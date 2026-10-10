/**
 * Writes out/youtube/captions.en.srt from the narration's word timestamps:
 * one cue per sentence (split again past 12 words), timed to the frame the
 * film plays each line at. Run with `npm run video:captions`.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BEATS, FPS, LEAD, vo } from './timeline';

const here = dirname(fileURLToPath(import.meta.url));
const ts = (s: number) => {
  const ms = Math.round(s * 1000);
  const p = (n: number, w = 2) => String(n).padStart(w, '0');
  return `${p(Math.floor(ms / 3_600_000))}:${p(Math.floor(ms / 60_000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};

type W = { w: string; start: number; end: number };
const cues: { a: number; b: number; text: string }[] = [];
const MAX_WORDS = 12;

/** A long sentence is cut at the comma nearest its middle, never mid-phrase. */
function pieces(sentence: W[]): W[][] {
  if (sentence.length <= MAX_WORDS) return [sentence];
  const mid = sentence.length / 2;
  let cut = -1;
  sentence.forEach((w, i) => {
    if (i < sentence.length - 2 && /,$/.test(w.w) && (cut < 0 || Math.abs(i + 1 - mid) < Math.abs(cut - mid))) cut = i + 1;
  });
  if (cut < 0) cut = Math.ceil(mid);
  return [...pieces(sentence.slice(0, cut)), ...pieces(sentence.slice(cut))];
}

// A sentence ends on . ? ! except inside "instead dot F Y I." (a spelled address).
const ends = (w: string) => /[.?!]$/.test(w) && !/^[A-Z]\.?$/.test(w.replace(/\.$/, '')) || w === 'I.';

for (const beat of BEATS) {
  const t0 = (beat.from + LEAD) / FPS;
  let sentence: W[] = [];
  const flush = () => {
    for (const g of pieces(sentence)) {
      if (!g.length) continue;
      cues.push({ a: t0 + g[0].start, b: t0 + g[g.length - 1].end, text: g.map((x) => x.w).join(' ').replace('cvbuilder dot destbreso dot com.', 'cvbuilder.destbreso.com.') });
    }
    sentence = [];
  };
  for (const w of vo[beat.id].words) {
    sentence.push(w);
    if (ends(w.w)) flush();
  }
  flush();
}

const srt = cues.map((c, i) => `${i + 1}\n${ts(c.a)} --> ${ts(Math.max(c.b, c.a + 0.6))}\n${c.text}\n`).join('\n');
const out = join(here, '..', 'out', 'youtube');
mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'captions.en.srt'), srt);
console.log(`captions.en.srt: ${cues.length} cues`);
