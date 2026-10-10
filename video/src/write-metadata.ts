/**
 * Writes out/youtube/metadata.md for the upload. Chapter times come from the
 * timeline; the counts from the app's own lists (capture-input.json).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import input from './capture-input.json';
import { FPS, beat } from './timeline';
import type { LineId } from './script';

const at = (id: LineId) => {
  const s = Math.floor(beat(id).from / FPS);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

// At least three chapters of ten seconds or more, from 0:00.
const chapters = [
  ['0:00', 'Ten copies of the same CV'],
  [at('idea'), 'One career, one record'],
  [at('stance'), 'No embellishment: the AI works from your record'],
  [at('review'), 'You review and adjust every line'],
  [at('design'), 'Templates, palettes and layouts'],
  [at('export'), 'A free download, and your data stays yours'],
  [at('card'), 'Free app, free code'],
];

const T = input.templates.length, P = input.palettes.length, L = input.layouts.length;

const md = `# YouTube upload: CV Generator

## Title

Tailor Your CV to Every Job with AI, Without Inventing Anything

## Description

Keep your whole career in one record, and make the CV each job needs from it. Your history is real and it doesn't need embellishing: paste a job description and the AI reworks the emphasis for that role, using only what's in your record. Nothing changes until you've read it, and you can adjust any line by hand.

🔗 https://cvbuilder.destbreso.com

What's in it:
• One structured record: experience, projects, skills, education. Import it from your LinkedIn PDF or type it once.
• AI tailoring for each job. The model is told to use only facts from your record, never to invent a title, a skill or a number; every version is kept in the history.
• ${T} templates, ${P} color palettes and ${L} layouts, switched without touching the content.
• A preview that is the printed page, page breaks included. The download is just a download: no account, no card.
• Export your record as JSON and import it anytime, in another browser or on another computer.
• No account. Your data is stored in your browser. Run it yourself and the AI can be a local model through Ollama.

Chapters
${chapters.map(([t, n]) => `${t} ${n}`).join('\n')}

The AI run in this video is real: a local model (gemma2:9b) through Ollama, on a fictional person and fictional companies. The video was made in code with Remotion; the narration and the sound design were generated with ElevenLabs.

Built by David Estévez · https://destbreso.com

#resume #cv #jobsearch

## Tags

resume builder, cv builder, ai resume, tailor resume to job, resume for each job, free resume builder, open source resume builder, cv generator, ollama, local ai, resume templates, job search, career, David Estévez, destbreso

## Settings

- Thumbnail: thumbnail.png
- Subtitles: captions.en.srt (Subtitles > Upload file > With timing, English)
- Language: English · Category: Science & Technology · Not made for kids
- End screen: subscribe element plus the channel's other videos, last 10 seconds

## Pinned comment

How many CV_final files do you have right now? Try it with one job you're applying to: cvbuilder.destbreso.com
`;

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'out', 'youtube');
mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'metadata.md'), md);
console.log(chapters.map(([t, n]) => `${t} ${n}`).join('\n'));
