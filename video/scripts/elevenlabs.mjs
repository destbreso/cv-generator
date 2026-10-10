#!/usr/bin/env node
// Generates the video's audio with ElevenLabs: voiceover lines, background
// music and sound effects, all described in src/voiceover.json.
// Writes the files to public/yt/ and their measured durations to
// src/audio.json, which the composition reads for its timing.
//
// Key: ELEVENLABS_API_KEY, or the first line of ../elevenlabs-key.
// Usage: node scripts/elevenlabs.mjs [--only=vo,music,sfx] [--force]
// Unchanged items (same text/settings) are cached and not re-billed.

import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const specPath = join(root, "src/voiceover.json");
const manifestPath = join(root, "src/audio.json");
const outDir = join(root, "public/audio");
const API = "https://api.elevenlabs.io/v1";

const args = process.argv.slice(2);
const force = args.includes("--force");
const onlyArg = args.find((a) => a.startsWith("--only="));
const only = onlyArg ? onlyArg.slice(7).split(",") : ["vo", "music", "sfx"];

const key =
  process.env.ELEVENLABS_API_KEY?.trim() ||
  (existsSync(join(root, "../elevenlabs-key"))
    ? readFileSync(join(root, "../elevenlabs-key"), "utf8").split("\n")[0].trim()
    : "");
if (!key) {
  console.error("No ElevenLabs key: set ELEVENLABS_API_KEY or fill ../elevenlabs-key");
  process.exit(1);
}

const spec = JSON.parse(readFileSync(specPath, "utf8"));
const manifest = existsSync(manifestPath)
  ? JSON.parse(readFileSync(manifestPath, "utf8"))
  : { vo: {}, music: null, sfx: {} };

const hash = (o) => createHash("sha1").update(JSON.stringify(o)).digest("hex").slice(0, 12);

const duration = (file) =>
  Number(
    execFileSync("ffprobe", [
      "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file,
    ]).toString().trim(),
  );

/** Integrated loudness (LUFS), so the film can set every level relative to the voice. */
const loudness = (file) => {
  const out = spawnSync("ffmpeg", ["-hide_banner", "-i", file, "-af", "ebur128", "-f", "null", "-"], { encoding: "utf8" }).stderr;
  const m = [...out.matchAll(/I:\s+(-?[\d.]+) LUFS/g)].pop();
  return m ? Number(m[1]) : null;
};

async function post(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "xi-api-key": key, "content-type": "application/json", accept: "audio/mpeg" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`${path} -> ${res.status}: ${detail.slice(0, 400)}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

// Voice lines use the with-timestamps endpoint: the audio arrives as base64
// next to a per-character alignment, which becomes per-word start times so
// the picture can land on the exact word the voice is saying.
async function postTimed(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "xi-api-key": key, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${path} -> ${res.status}: ${(await res.text()).slice(0, 400)}`);
  const json = await res.json();
  const a = json.alignment;
  const words = [];
  let cur = null;
  a.characters.forEach((ch, i) => {
    if (/\s/.test(ch)) { if (cur) { words.push(cur); cur = null; } return; }
    if (!cur) cur = { w: "", start: a.character_start_times_seconds[i] };
    cur.w += ch;
    cur.end = a.character_end_times_seconds[i];
  });
  if (cur) words.push(cur);
  return { audio: Buffer.from(json.audio_base64, "base64"), words };
}

async function item(kind, id, request, file, entryOf) {
  const h = hash(request.body);
  const prev = kind === "music" ? manifest.music : manifest[kind][id];
  const abs = join(outDir, file);
  if (!force && prev?.hash === h && existsSync(abs)) {
    console.log(`= ${kind}/${id} cached (${prev.seconds.toFixed(2)}s)`);
    return;
  }
  process.stdout.write(`+ ${kind}/${id} ... `);
  let words;
  if (request.timed) {
    const out = await postTimed(request.path, request.body);
    writeFileSync(abs, out.audio);
    words = out.words.map((w) => ({ w: w.w, start: +w.start.toFixed(3), end: +w.end.toFixed(3) }));
  } else {
    writeFileSync(abs, await post(request.path, request.body));
  }
  const entry = { file: `audio/${file}`, seconds: duration(abs), hash: h, ...entryOf, ...(words ? { words } : {}) };
  if (kind === "music") manifest.music = entry;
  else manifest[kind][id] = entry;
  console.log(`${entry.seconds.toFixed(2)}s`);
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
}

const failures = [];
const run = async (label, fn) => {
  try {
    await fn();
  } catch (e) {
    console.log("FAILED");
    console.error(`  ${label}: ${e.message}`);
    failures.push(label);
  }
};

if (only.includes("vo")) {
  for (const line of spec.lines) {
    await run(`vo/${line.id}`, () =>
      item("vo", line.id, {
        path: `/text-to-speech/${spec.voiceId}/with-timestamps?output_format=mp3_44100_128`,
        timed: true,
        body: { text: line.text, model_id: spec.modelId, voice_settings: spec.voiceSettings },
      }, `vo-${line.id}.mp3`, { text: line.text }),
    );
  }
}

// Background music. The Music API composes a track of the exact length, but
// only on a paid ElevenLabs plan. On the free plan it answers 402, and the
// bed is built instead from a seamless loop made with the sound-effects model
// (which the free plan allows, up to 30 s), repeated to length with ffmpeg.
// Rerunning after an upgrade replaces the loop bed with a composed track.
async function loopBed() {
  const loop = spec.music.loop;
  const body = { text: loop.text, duration_seconds: loop.seconds, prompt_influence: 0.5, loop: true, model_id: "eleven_text_to_sound_v2" };
  const h = hash({ body, lengthMs: spec.music.lengthMs, bed: "loop" });
  const abs = join(outDir, "music.mp3");
  if (!force && manifest.music?.hash === h && existsSync(abs)) {
    console.log(`= music/loop-bed cached (${manifest.music.seconds.toFixed(2)}s)`);
    return;
  }
  process.stdout.write("+ music/loop-bed ... ");
  const loopMp3 = join(outDir, "music-loop.mp3");
  const loopWav = join(outDir, "music-loop.wav");
  writeFileSync(loopMp3, await post("/sound-generation?output_format=mp3_44100_128", body));
  // Decoded to WAV first so the MP3 encoder padding does not leave a gap; then
  // repeated with crossfades (a loop's two ends rarely sit at the same level,
  // and a hard join is a dip every thirty seconds), trimmed, faded in and out.
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", loopMp3, loopWav]);
  const secs = spec.music.lengthMs / 1000;
  const XF = 4;
  const copies = Math.ceil(secs / (loop.seconds - XF)) + 1;
  const inputs = Array.from({ length: copies }, () => ["-i", loopWav]).flat();
  let graph = "";
  let last = "[0:a]";
  for (let k = 1; k < copies; k++) {
    const out = `[x${k}]`;
    graph += `${last}[${k}:a]acrossfade=d=${XF}:c1=tri:c2=tri${out};`;
    last = out;
  }
  graph += `${last}atrim=0:${secs},afade=t=in:d=2,afade=t=out:st=${Math.max(0, secs - 5)}:d=5[bed]`;
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", ...inputs, "-filter_complex", graph, "-map", "[bed]", "-c:a", "libmp3lame", "-b:a", "128k", abs]);
  rmSync(loopWav, { force: true });
  manifest.music = { file: "audio/music.mp3", seconds: duration(abs), hash: h, source: "sound-generation loop" };
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`${manifest.music.seconds.toFixed(2)}s (from a ${duration(loopMp3).toFixed(1)}s loop)`);
}

if (only.includes("music")) {
  let composed = true;
  try {
    await item("music", "track", {
      path: "/music?output_format=mp3_44100_128",
      body: { prompt: spec.music.prompt, music_length_ms: spec.music.lengthMs, model_id: "music_v1" },
    }, "music.mp3", { source: "music api" });
  } catch (e) {
    if (!/402|paid_plan_required/.test(e.message) || !spec.music.loop) {
      console.log("FAILED");
      console.error(`  music: ${e.message}`);
      failures.push("music");
    } else {
      console.log("needs a paid plan, building the bed from a loop");
      composed = false;
    }
  }
  if (!composed) await run("music/loop-bed", loopBed);
}

if (only.includes("sfx")) {
  for (const fx of spec.sfx) {
    await run(`sfx/${fx.id}`, () =>
      item("sfx", fx.id, {
        path: "/sound-generation?output_format=mp3_44100_128",
        body: { text: fx.text, duration_seconds: fx.seconds, prompt_influence: 0.6, ...(fx.loop ? { loop: true, model_id: "eleven_text_to_sound_v2" } : {}) },
      }, `sfx-${fx.id}.mp3`, {}),
    );
  }
}

// Annotate every file with its loudness (cheap, and cached ones may predate it).
for (const entry of [...Object.values(manifest.vo), ...Object.values(manifest.sfx), manifest.music].filter(Boolean)) {
  if (entry.lufs === undefined) entry.lufs = loudness(join(root, "public", entry.file));
}
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

if (failures.length) {
  console.error(`\n${failures.length} item(s) failed: ${failures.join(", ")}`);
  process.exit(2);
}
