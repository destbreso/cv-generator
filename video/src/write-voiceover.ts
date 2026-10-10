/**
 * Writes src/voiceover.json from script.ts plus the voice, bed and effect
 * settings. Run with `npm run video:script -- <seconds>`.
 */
import { writeFileSync } from 'node:fs';
import { LINES } from './script';

const seconds = Number(process.argv[2] ?? 100);

const spec = {
  // The channel's narrator, the same voice as the other videos.
  voiceId: 'nPczCjzI2devNBz1zQrb',
  modelId: 'eleven_multilingual_v2',
  voiceSettings: { stability: 0.5, similarity_boost: 0.8, style: 0.25, use_speaker_boost: true },
  lines: LINES,
  music: {
    lengthMs: Math.round(seconds * 1000),
    prompt: `Instrumental, light and modern, for a ${Math.round(seconds)}-second product video about a resume builder. Clean electronic pulse, soft plucked synths and warm pads, 104 BPM, major key, optimistic and focused, never busy, leaving room for a voiceover. Builds gently in the middle and resolves on a bright sustained chord at the end. No vocals.`,
    // On the free plan: a bright, light loop with a soft pulse, crossfaded to length.
    loop: {
      seconds: 30,
      text: 'Light modern ambient background loop for a product video: soft pulsing synth pad with gentle plucked notes, optimistic and calm, 104 BPM, major key, no drums, no vocals, no sudden changes, seamless loop',
    },
  },
  sfx: [
    { id: 'pop', seconds: 0.5, text: 'A soft, short UI pop, like a card appearing on screen, clean and friendly' },
    { id: 'whoosh', seconds: 1.0, text: 'A soft airy swoosh as several cards slide together into one, gentle and short' },
    { id: 'click', seconds: 0.5, text: 'One soft mouse click, clean, close' },
    { id: 'shimmer', seconds: 2.5, text: 'A bright soft magical shimmer swell, like something being generated, gentle and positive' },
    { id: 'flip', seconds: 0.6, text: 'A quick soft page flip of a single sheet of paper' },
    { id: 'ding', seconds: 1.2, text: 'A gentle, warm notification chime, a single soft bell tone' },
    { id: 'riser', seconds: 4, text: 'A light uplifting riser, airy synth swell rising for four seconds, ends abruptly at the peak, no impact' },
    { id: 'bloom', seconds: 3, text: 'A soft cinematic bloom hit, a warm bright chord swell with a short shimmering tail, not aggressive' },
  ],
};

writeFileSync(new URL('./voiceover.json', import.meta.url), JSON.stringify(spec, null, 2) + '\n');
console.log(`voiceover.json: ${LINES.length} lines, bed ${seconds}s`);
