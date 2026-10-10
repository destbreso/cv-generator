/**
 * The YouTube thumbnail, 1280x720, built like the channel's other one: one
 * headline carries it, the proof rides on top as patches. Here the patches are
 * the problem (a CV_final file, struck out) and the answer (one CV per job,
 * each tagged with its role). The product's own Modern colors; the bottom-right
 * corner stays quiet for YouTube's duration badge.
 */
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { C, font, fontMono, shadow } from './theme';

const RED = 'oklch(0.6 0.21 25)';

const PAGES = [
  { img: 'template-modern.png', tag: 'Senior Frontend', x: 0, y: 40, r: -7 },
  { img: 'template-harvard.png', tag: 'Tech Lead', x: 190, y: 0, r: 0 },
  { img: 'template-swiss.png', tag: 'Platform', x: 360, y: 40, r: 7 },
];

export const Thumb: React.FC = () => (
  <AbsoluteFill
    style={{
      fontFamily: font,
      background: C.bg,
      backgroundImage: `radial-gradient(oklch(0.22 0.02 265 / 0.07) 1px, transparent 1px), radial-gradient(60% 70% at 78% 50%, oklch(0.55 0.18 260 / 0.14), transparent 70%)`,
      backgroundSize: '22px 22px, 100% 100%',
    }}
  >
    {/* the headline */}
    <div style={{ position: 'absolute', left: 64, top: 120 }}>
      <div style={{ fontSize: 124, fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 0.95, color: C.fg }}>One CV.</div>
      <div style={{ fontSize: 124, fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 0.95, color: C.primary, marginTop: 8 }}>Every job.</div>
      <div style={{ marginTop: 34, display: 'inline-flex', alignItems: 'center', gap: 12, padding: '12px 24px', borderRadius: 999, background: C.primary, color: 'white', fontSize: 30, fontWeight: 700, boxShadow: '0 12px 30px oklch(0.55 0.18 260 / 0.35)' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
        </svg>
        AI tailors it to the job
      </div>
    </div>

    {/* the answer: one CV per job */}
    <div style={{ position: 'absolute', left: 676, top: 150, width: 600, height: 520 }}>
      {PAGES.map((p) => (
        <div key={p.tag} style={{ position: 'absolute', left: p.x, top: p.y, transform: `rotate(${p.r}deg)` }}>
          <Img src={staticFile(`cv/${p.img}`)} style={{ width: 230, borderRadius: 5, border: `1px solid ${C.border}`, boxShadow: shadow }} />
          <div style={{ marginTop: 12, textAlign: 'center' }}>
            <span style={{ display: 'inline-block', padding: '6px 14px', borderRadius: 999, background: C.panel, border: `1px solid ${C.border}`, fontSize: 20, fontWeight: 700, color: C.fg, boxShadow: shadow }}>{p.tag}</span>
          </div>
        </div>
      ))}
    </div>

    {/* the problem, struck out */}
    <div style={{ position: 'absolute', left: 560, top: 46, transform: 'rotate(-8deg)', padding: '16px 22px', borderRadius: 14, background: C.panel, border: `1px solid ${C.border}`, boxShadow: shadow, display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 40, height: 50, borderRadius: 6, background: C.primarySoft, border: `1px solid ${C.primaryLine}`, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 5, fontFamily: fontMono, fontSize: 11, fontWeight: 600, color: C.primary }}>DOC</div>
      <span style={{ position: 'relative', fontFamily: fontMono, fontSize: 30, color: C.muted }}>
        CV_final_v3.docx
        <span style={{ position: 'absolute', left: -6, right: -6, top: '50%', height: 6, background: RED, borderRadius: 3, transform: 'rotate(-4deg)' }} />
      </span>
    </div>
  </AbsoluteFill>
);
