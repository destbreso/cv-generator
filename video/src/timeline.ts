/**
 * The running order, paced by the narration: each beat lasts its voice line
 * (measured from the take in audio.json) plus a lead-in and a breath, never
 * less than its picture needs. cue() turns a word of a line into a frame, from
 * the per-word timestamps ElevenLabs returns, so things land on their word.
 */
import audio from './audio.json';
import type { LineId } from './script';

export const FPS = 30;
export const LEAD = 12;
const TAIL = 22;

const MIN: Record<LineId, number> = {
  files: 240,
  catch: 330,
  idea: 230,
  data: 300,
  stance: 300,
  ai: 360,
  review: 330,
  history: 150,
  design: 330,
  export: 220,
  control: 260,
  private: 240,
  card: 300,
};

const ORDER: LineId[] = ['files', 'catch', 'idea', 'data', 'stance', 'ai', 'review', 'history', 'design', 'export', 'control', 'private', 'card'];
const CARD_HOLD = 60;

type Word = { w: string; start: number; end: number };
const vo = audio.vo as Record<LineId, { seconds: number; file: string; words: Word[]; lufs?: number }>;

let at = 0;
export const BEATS = ORDER.map((id) => {
  const voice = LEAD + Math.ceil(vo[id].seconds * FPS) + (id === 'card' ? CARD_HOLD : TAIL);
  const dur = Math.max(MIN[id], voice);
  const beat = { id, from: at, dur };
  at += dur;
  return beat;
});

export const TOTAL = at;
export const beat = (id: LineId) => BEATS.find((b) => b.id === id)!;

/** Lowercase, punctuation dropped, except a decimal point between digits. */
const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/(\d)\.(\d)/g, '$1§$2')
    .replace(/[^a-z0-9$%§]/g, '')
    .replace(/§/g, '.');

/** Frame, relative to beat `id`, where the voice starts `word` (nth occurrence; trailing * = prefix). */
export function cue(id: LineId, word: string, nth = 0, end = false): number {
  const prefix = word.endsWith('*');
  const target = norm(prefix ? word.slice(0, -1) : word);
  const hits = vo[id].words.filter((w) => (prefix ? norm(w.w).startsWith(target) : norm(w.w) === target));
  const w = hits[nth];
  if (!w) throw new Error(`cue: "${word}" (#${nth}) not in line "${id}"`);
  return LEAD + Math.round((end ? w.end : w.start) * FPS);
}

export const VO_SPANS = BEATS.map((b) => [b.from + LEAD, b.from + LEAD + Math.ceil(vo[b.id].seconds * FPS)] as const);

export { audio, vo };
