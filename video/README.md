# CV Generator / video

Remotion compositions for CV Generator's YouTube video. A separate package on purpose: the app's install and build never see the render toolchain (Chromium, ffmpeg), and the root `tsconfig.json` excludes this folder.

| id | size | for |
|---|---|---|
| `Film` | 1920 x 1080 | the YouTube video, about two minutes |
| `Thumb` | 1280 x 720 | its thumbnail |

The video follows the channel's grammar (the same narrator, a problem, the idea, the real product, a closing credit) in the product's own look: the app's Modern theme, Geist, near-white and one blue.

No join shows a cut: every beat is opaque and dissolves in over the one before it, consecutive app beats keep the same browser window still, the folder and the online builder share one window frame, and the history picks up the camera where the review left it.

## What is real

Every app screen is a capture of the running app (`scripts/capture-app.cjs`), driven through its own storage so each shot is reproducible. The person is fictional (`src/persona.ts`), so the demo is about the tool; the app's "Load Sample Data" is the author's own CV and is not used here. The AI section is a real run against a fictional job with a local model through Ollama (`gemma2:9b`), captured frame by frame; the before and after on screen is the text the app showed. The counts the narration says (templates, palettes, layouts) are read from the app's own lists into `src/capture-input.json`.

The narration says what the screen does not: the screen carries the specifics, the voice what they are for. Each claim was checked against the code (see the header of `src/script.ts`). Arrivals and highlights are timed with `cue()` from the per-word timestamps ElevenLabs returns.

Sound: the voice, a light bed, and a few interface sounds (pops, flips, a shimmer when the AI finishes, a bloom on the card), every level set in dB relative to the voice, normalized linearly to -14 LUFS. On a paid ElevenLabs plan the bed is a composed track (Music API); on the free plan it is built from a seamless loop.

## Running

Captures need the app running (`npx next dev --port 3099` at the repo root) and, for the AI section, Ollama with the model.

```
npx -y tsx video/src/write-capture-input.ts     # from the repo root: persona, job, the app's design lists
cd video && npm install
PLAYWRIGHT=<playwright-core> CHROME=<chromium> node scripts/capture-app.cjs   # public/cv; one step with data|design|ai|ai-go|panels
PLAYWRIGHT=<playwright-core> CHROME=<chromium> node scripts/measure-boxes.cjs # src/boxes.json
npm run video:script -- <seconds>    # narration + audio settings -> src/voiceover.json
npm run video:audio                  # voice, bed, effects -> public/audio (ELEVENLABS_API_KEY)
npm run video:render                 # out/youtube/cv-generator.mp4
npm run video:captions               # out/youtube/captions.en.srt
npm run video:metadata               # out/youtube/metadata.md
npm run video:thumbnail              # out/youtube/thumbnail.png
```

A new AI capture produces a new generation, so its text changes; the before and after follows it automatically. `ai-go` retakes only the two shots before Generate, without running the model.
