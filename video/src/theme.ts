/**
 * The app's "Modern" theme (app/globals.css), so the video looks like the
 * product it shows: near-white ground, ink-blue text, one blue accent, Geist.
 * Chromium renders oklch directly, so these are the app's own values.
 */
import { loadFont as loadGeist } from '@remotion/google-fonts/Geist';
import { loadFont as loadGeistMono } from '@remotion/google-fonts/GeistMono';

const geist = loadGeist('normal', { weights: ['400', '500', '600', '700', '800'], subsets: ['latin'] });
const mono = loadGeistMono('normal', { weights: ['400', '500'], subsets: ['latin'] });

export const font = geist.fontFamily;
export const fontMono = mono.fontFamily;

export const C = {
  bg: 'oklch(0.985 0.002 265)',
  fg: 'oklch(0.22 0.02 265)',
  muted: 'oklch(0.5 0.015 265)',
  faint: 'oklch(0.7 0.01 265)',
  border: 'oklch(0.9 0.005 265)',
  panel: 'oklch(1 0 0)',
  soft: 'oklch(0.94 0.005 265)',
  primary: 'oklch(0.55 0.18 260)',
  primarySoft: 'oklch(0.55 0.18 260 / 0.1)',
  primaryLine: 'oklch(0.55 0.18 260 / 0.35)',
  amber: 'oklch(0.72 0.15 70)',
};

export const shadow = '0 1px 2px oklch(0.22 0.02 265 / 0.06), 0 18px 50px oklch(0.22 0.02 265 / 0.12)';
