/**
 * The narration, line by line. The screen carries the specifics (the real
 * editor, the job, the generated text, every template); the voice says what
 * they are for. Counts come from the app's own lists (capture-input.json is
 * read from lib/cv-store), so the voice cannot claim a template the app does
 * not ship. Claims about behaviour were checked against the code:
 * - a generation is a separate version until applied (APPLY_GENERATED), and
 *   every run is kept in the Generation History panel;
 * - the model is told to use only facts from the record and never invent a
 *   title, skill or number (the integrity rules the generate-cv route always
 *   appends, whatever the writing prompt);
 * - the record exports and imports as JSON (Import > JSON File, Export as JSON);
 * - the app and its code are free (MIT, public repository);
 * - the record lives in localStorage, there is no account;
 * - AI requests go through the app's own server route to the provider, so a
 *   model on your own machine means running the app yourself (Ollama).
 *
 * `npm run video:script` writes these lines into voiceover.json.
 */
import input from './capture-input.json';

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty'];
const words = (n: number) => (n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : ''));
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

const T = input.templates.length;
const P = input.palettes.length;
const L = input.layouts.length;

export const LINES = [
  {
    id: 'files',
    text: `Somewhere on your laptop there's a CV final, a CV final two, and a CV final, really final. None of them is quite up to date.`,
  },
  {
    id: 'catch',
    text: `And the online builders? You fill in every field, pick a design, press download, and only then does it ask for an account, or a card.`,
  },
  {
    id: 'idea',
    text: `Your career is one story. Keep it in one place, and make the CV each job needs from it.`,
  },
  {
    id: 'data',
    text: `That place is CV Generator. Every role, project and skill, in one structured record. Bring it in from your LinkedIn export, or type it once.`,
  },
  {
    id: 'stance',
    text: `It's your real history, and you keep it. It doesn't need embellishing: it's already true. It only needs the right emphasis for each role.`,
  },
  {
    id: 'ai',
    text: `Paste the job you want. The AI works only from your record, and it's told never to invent a title, a skill or a number. It picks what matters for that role, and rewrites the emphasis.`,
  },
  {
    id: 'review',
    text: `Nothing changes until you've read it. Apply it when it's right, and adjust any line by hand. If it went a step too far, take it out.`,
  },
  {
    id: 'history',
    text: `Every version is kept, so you can always go back.`,
  },
  {
    id: 'design',
    text: `How it looks is a separate choice. ${cap(words(T))} templates, ${words(P)} palettes, ${words(L)} layouts, and the content never moves.`,
  },
  {
    id: 'export',
    text: `And when it's done, the download is just a download. A PDF, exactly as you see it, page breaks and all.`,
  },
  {
    id: 'control',
    text: `Export your record as JSON and import it whenever you want, in another browser or on another computer. It stays yours.`,
  },
  {
    id: 'private',
    text: `There's no account to create. Your record lives in your browser, and if you run it yourself, the AI can be a model on your own machine.`,
  },
  {
    id: 'card',
    text: `CV Generator. Stop duplicating, start generating. The app is free, and so is the code. cvbuilder dot destbreso dot com.`,
  },
] as const;

export type LineId = (typeof LINES)[number]['id'];
