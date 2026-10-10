#!/usr/bin/env node
// Two-pass loudness normalization to -14 LUFS / -1.5 dBTP, LINEAR: one gain
// for the whole film, so the mix keeps its balance. (Single-pass loudnorm is
// dynamic: it acts like an automatic gain control and lifts the music bed in
// every gap between lines.) Video is copied untouched.
// Usage: node scripts/loudnorm.mjs <in.mp4> <out.mp4>
import { execFileSync, spawnSync } from "node:child_process";

const [, , input, output] = process.argv;
const target = "I=-14:TP=-1.5:LRA=11";
// ffmpeg prints the measurement on stderr.
const pass1 = spawnSync("ffmpeg", ["-hide_banner", "-i", input, "-af", `loudnorm=${target}:print_format=json`, "-vn", "-f", "null", "-"], { encoding: "utf8" }).stderr;
const m = JSON.parse(pass1.slice(pass1.lastIndexOf("{"), pass1.lastIndexOf("}") + 1));
const pass2 = `loudnorm=${target}:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", input, "-c:v", "copy", "-af", pass2, "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", output]);
console.log(`loudness ${m.input_i} LUFS -> -14 (linear, offset ${m.target_offset})`);
