/**
 * Writes video/src/capture-input.json: the fictional persona, the job, and the
 * app's own template, palette and layout lists (read from lib/cv-store, so the
 * captures and the narration count what the app actually ships). Run from the
 * repo root, where the app's path aliases resolve:
 *   npx -y tsx video/src/write-capture-input.ts
 */
import { writeFileSync } from 'node:fs';
import { COLOR_PALETTES, LAYOUTS, TEMPLATES } from '../../lib/cv-store';
import { JOB, PERSONA } from './persona';

const out = {
  persona: PERSONA,
  job: JOB,
  templates: TEMPLATES.map((t: { id: string; name: string }) => ({ id: t.id, name: t.name })),
  palettes: COLOR_PALETTES.map((p: { id: string; name: string; colors: { primary: string; accent: string } }) => ({ id: p.id, name: p.name, primary: p.colors.primary, accent: p.colors.accent })),
  layouts: LAYOUTS.map((l: { id: string; name: string }) => ({ id: l.id, name: l.name })),
};
writeFileSync(new URL('./capture-input.json', import.meta.url), JSON.stringify(out, null, 2) + '\n');
console.log(`capture-input.json: ${out.templates.length} templates, ${out.palettes.length} palettes, ${out.layouts.length} layouts`);
