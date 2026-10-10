/**
 * CV Generator, the video: the problem (a folder of CV_final copies), the idea
 * (one record, a CV per job), then the real app (the record, a real local AI
 * run against a job, the history, every design option, export, privacy) and
 * the card. Same channel grammar as the other films (narrator, structure, the
 * closing credit); the look is the product's own Modern theme.
 */
import React from 'react';
import { AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, font, fontMono, shadow } from './theme';
import { BEATS, FPS, LEAD, TOTAL, VO_SPANS, audio, beat, cue } from './timeline';
import type { LineId } from './script';
import input from './capture-input.json';
import generated from './generated.json';
import boxes from './boxes.json';
import meta from './capture-meta.json';

// ---------------------------------------------------------------------------
// Motion

const EASE = Easing.bezier(0.32, 0.72, 0, 1);
const ramp = (f: number, from: number, len: number) =>
  interpolate(f, [from, from + len], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });

const Rise: React.FC<{ at: number; children: React.ReactNode; lift?: number; style?: React.CSSProperties }> = ({ at, children, lift = 22, style }) => {
  const p = ramp(useCurrentFrame(), at, 20);
  return <div style={{ ...style, opacity: p, transform: `translateY(${(1 - p) * lift}px)` }}>{children}</div>;
};

const Ground: React.FC = () => (
  <AbsoluteFill
    style={{
      background: C.bg,
      backgroundImage: `radial-gradient(oklch(0.22 0.02 265 / 0.07) 1px, transparent 1px)`,
      backgroundSize: '28px 28px',
    }}
  />
);

/** Frames a beat dissolves in over the one before it. */
const OVER = 14;

/**
 * Seamless joins: every beat is opaque (it carries its own ground) and fades
 * in OVER the previous beat, which stays solid underneath for those frames and
 * only then ends. Nothing ever dips to an empty frame, and two beats that share
 * the same browser window keep it perfectly still while their content changes.
 */
const Beat: React.FC<{ first?: boolean; children: React.ReactNode }> = ({ first, children }) => {
  const f = useCurrentFrame();
  const o = first ? 1 : interpolate(f, [0, OVER], [0, 1], { extrapolateRight: 'clamp', easing: EASE });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Ground />
      {children}
    </AbsoluteFill>
  );
};

/** Whether the beat before this one also showed the app window (then it does not re-enter). */
const ContinuedWindow = React.createContext(false);

const Pill: React.FC<{ children: React.ReactNode; tone?: 'blue' | 'plain'; size?: number }> = ({ children, tone = 'blue', size = 24 }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 18px',
      borderRadius: 999,
      fontSize: size,
      fontWeight: 600,
      whiteSpace: 'nowrap',
      color: tone === 'blue' ? C.primary : C.fg,
      background: tone === 'blue' ? C.primarySoft : C.panel,
      border: `1px solid ${tone === 'blue' ? C.primaryLine : C.border}`,
      boxShadow: tone === 'plain' ? shadow : 'none',
    }}
  >
    {children}
  </span>
);

// ---------------------------------------------------------------------------
// The app in a browser window

const VIEW_W = 1600;
const VIEW_H = 900;
type Cam = { x: number; y: number; w: number };
type Rect = { x: number; y: number; w: number; h: number };

const Browser: React.FC<{ children: React.ReactNode; url?: string }> = ({ children, url = 'cvbuilder.destbreso.com/editor' }) => {
  const continued = React.useContext(ContinuedWindow);
  const enter = ramp(useCurrentFrame(), 0, 24);
  const p = continued ? 1 : enter;
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 20 }}>
      <div style={{ width: VIEW_W, borderRadius: 16, overflow: 'hidden', background: C.panel, border: `1px solid ${C.border}`, boxShadow: shadow, opacity: p, transform: `translateY(${(1 - p) * 50}px) scale(${0.98 + 0.02 * p})` }}>
        <div style={{ height: 46, display: 'flex', alignItems: 'center', gap: 9, padding: '0 20px', background: C.soft, borderBottom: `1px solid ${C.border}` }}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <span key={c} style={{ width: 13, height: 13, borderRadius: '50%', background: c, opacity: 0.85 }} />
          ))}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <span style={{ fontFamily: fontMono, fontSize: 17, color: C.muted, background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: '5px 80px' }}>{url}</span>
          </div>
          <span style={{ width: 60 }} />
        </div>
        <div style={{ position: 'relative', width: VIEW_W, height: VIEW_H, overflow: 'hidden', background: C.bg }}>{children}</div>
      </div>
    </AbsoluteFill>
  );
};

function camera(frame: number, keys: (Cam & { at: number; len?: number })[]): Cam {
  let cam: Cam = keys[0];
  for (let i = 1; i < keys.length; i++) {
    const t = ramp(frame, keys[i].at, keys[i].len ?? 30);
    if (t <= 0) break;
    cam = { x: cam.x + (keys[i].x - cam.x) * t, y: cam.y + (keys[i].y - cam.y) * t, w: cam.w + (keys[i].w - cam.w) * t };
  }
  return cam;
}

/** A capture of the 1920-wide app seen through the camera. */
const Shot: React.FC<{ src: string; cam?: Cam; opacity?: number; children?: (s: (r: Rect) => Rect) => React.ReactNode }> = ({ src, cam = { x: 0, y: 0, w: 1920 }, opacity = 1, children }) => {
  const k = VIEW_W / cam.w;
  const toScreen = (r: Rect): Rect => ({ x: (r.x - cam.x) * k, y: (r.y - cam.y) * k, w: r.w * k, h: r.h * k });
  return (
    <AbsoluteFill style={{ opacity }}>
      <Img src={staticFile(`cv/${src}`)} style={{ position: 'absolute', left: -cam.x * k, top: -cam.y * k, width: 1920 * k, maxWidth: 'none' }} />
      {children?.(toScreen)}
    </AbsoluteFill>
  );
};

/** A blue ring that draws around an element, then lets go. */
const Mark: React.FC<{ r: Rect | null; from: number; to: number }> = ({ r, from, to }) => {
  const f = useCurrentFrame();
  const o = Math.min(ramp(f, from, 10), 1 - ramp(f, to, 10));
  if (!r || o <= 0) return null;
  const pad = 8;
  return (
    <div
      style={{
        position: 'absolute',
        left: r.x - pad,
        top: r.y - pad,
        width: r.w + pad * 2,
        height: r.h + pad * 2,
        border: `3px solid ${C.primary}`,
        borderRadius: 12,
        background: 'oklch(0.55 0.18 260 / 0.06)',
        boxShadow: '0 0 0 6px oklch(0.55 0.18 260 / 0.12)',
        opacity: o,
        transform: `scale(${0.97 + 0.03 * o})`,
      }}
    />
  );
};

// ---------------------------------------------------------------------------
// A window on the laptop. The folder and the online builder share one frame,
// so the join between them only changes what is inside it.

const NEUTRAL = { bg: 'oklch(0.97 0 0)', panel: 'oklch(1 0 0)', line: 'oklch(0.88 0 0)', ink: 'oklch(0.3 0 0)', soft: 'oklch(0.6 0 0)', go: 'oklch(0.62 0.15 150)' };
const WIN_W = 1500;
const WIN_H = 860;
const BAR = 64;

const DeskWindow: React.FC<{ bar: React.ReactNode; body?: string; over?: React.ReactNode; p?: number; children: React.ReactNode }> = ({ bar, body = NEUTRAL.bg, over, p = 1, children }) => (
  <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ position: 'relative', width: WIN_W, height: WIN_H, borderRadius: 14, overflow: 'hidden', background: body, border: `1px solid ${NEUTRAL.line}`, boxShadow: shadow, fontFamily: font, opacity: p, transform: `translateY(${(1 - p) * 40}px) scale(${0.98 + 0.02 * p})` }}>
      <div style={{ height: BAR, display: 'flex', alignItems: 'center', padding: '0 28px', gap: 14, background: NEUTRAL.panel, borderBottom: `1px solid ${NEUTRAL.line}` }}>
        <span style={{ display: 'flex', gap: 9, marginRight: 12 }}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <span key={c} style={{ width: 13, height: 13, borderRadius: '50%', background: c, opacity: 0.85 }} />
          ))}
        </span>
        {bar}
      </div>
      <div style={{ position: 'relative', height: WIN_H - BAR }}>{children}</div>
      {over}
    </div>
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------
// 1. The folder

const FILES = [
  { name: 'CV_final.docx', date: 'Mar 2021', word: ['final', 0] },
  { name: 'CV_final_2.docx', date: 'Nov 2022', word: ['two', 0] },
  { name: 'CV_final_REALLY_final.pdf', date: 'Jan 2023', word: ['really', 0] },
  { name: 'resume_2023_google.pdf', date: 'Aug 2023', word: ['None', 0] },
  { name: 'CV (1).docx', date: 'Feb 2024', word: ['None', 0] },
  { name: 'CV_final_v3_USE_THIS.docx', date: 'Jun 2024', word: ['None', 0] },
] as const;

/** A file as the icon view shows it: the page, its type, its name and when it was last touched. */
const FileIcon: React.FC<{ name: string; date: string; at: number; stale: number }> = ({ name, date, at, stale }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - at, fps, config: { damping: 14, mass: 0.6 } });
  const pdf = name.endsWith('.pdf');
  const tint = pdf ? 'oklch(0.58 0.2 25)' : C.primary;
  return (
    <div style={{ width: 380, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', opacity: Math.min(1, s * 1.4), transform: `scale(${0.7 + 0.3 * s})` }}>
      <svg width="104" height="132" viewBox="0 0 96 122" style={{ filter: 'drop-shadow(0 6px 14px oklch(0.22 0.02 265 / 0.12))' }}>
        <path d="M8 2H64L94 32V114a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8a6 6 0 0 1 6-6Z" fill="white" stroke={NEUTRAL.line} strokeWidth="2" />
        <path d="M64 2V26a6 6 0 0 0 6 6H94" fill={NEUTRAL.bg} stroke={NEUTRAL.line} strokeWidth="2" strokeLinejoin="round" />
        {[46, 57, 68].map((y, i) => (
          <rect key={y} x="16" y={y} width={i === 2 ? 40 : 62} height="5" rx="2.5" fill="oklch(0.9 0 0)" />
        ))}
        <rect x="12" y="88" width="46" height="21" rx="4" fill={tint} />
        <text x="35" y="103" textAnchor="middle" fontFamily={fontMono} fontSize="12.5" fontWeight="700" fill="white">{pdf ? 'PDF' : 'DOC'}</text>
      </svg>
      <div style={{ marginTop: 18, fontFamily: fontMono, fontSize: 24, lineHeight: 1.3, color: C.fg, wordBreak: 'break-all' }}>{name}</div>
      <div style={{ marginTop: 8, fontSize: 21, color: stale > 0 ? `color-mix(in oklch, ${C.amber} ${Math.round(stale * 100)}%, ${C.muted})` : C.muted, fontWeight: stale > 0 ? 600 : 400 }}>
        Modified {date}
      </div>
    </div>
  );
};

const Files: React.FC = () => {
  const f = useCurrentFrame();
  const stale = ramp(f, cue('files', 'None'), 16);
  const crumb = { fontSize: 22, color: NEUTRAL.soft } as const;
  return (
    <DeskWindow
      p={ramp(f, 0, 22)}
      body={NEUTRAL.panel}
      bar={
        <>
          <svg width="26" height="22" viewBox="0 0 26 22" style={{ marginRight: 2 }}>
            <path d="M2 4a2 2 0 0 1 2-2h6l3 3h9a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z" fill="oklch(0.55 0.18 260 / 0.2)" stroke={C.primary} strokeWidth="1.6" />
          </svg>
          <span style={crumb}>Documents</span>
          <span style={crumb}>›</span>
          <span style={{ fontSize: 22, fontWeight: 600, color: NEUTRAL.ink }}>CV</span>
        </>
      }
    >
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 380px)', columnGap: 44, rowGap: 60 }}>
          {FILES.map((file, i) => (
            <FileIcon key={file.name} name={file.name} date={file.date} stale={stale} at={cue('files', file.word[0], file.word[1]) + (i >= 3 ? (i - 3) * 5 : -4)} />
          ))}
        </div>
      </AbsoluteFill>
    </DeskWindow>
  );
};

// ---------------------------------------------------------------------------
// 2. The idea: one record, a CV per job

const persona = input.persona;
const RECORD_ROWS = [
  ['Experience', persona.experience.length],
  ['Projects', persona.projects.length],
  ['Skills', persona.skills.reduce((n, s) => n + s.items.length, 0)],
  ['Education', persona.education.length],
  ['Languages', persona.languages.length],
] as const;

const JOBS = [
  { tag: 'Senior Frontend · Mendwell', img: 'template-modern.png' },
  { tag: 'Tech Lead · a startup', img: 'template-harvard.png' },
  { tag: 'Platform · fintech', img: 'template-swiss.png' },
];

const Idea: React.FC = () => {
  const f = useCurrentFrame();
  const fan = cue('idea', 'make');
  return (
    <AbsoluteFill style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 90 }}>
      {/* already there as the join lands, so the cut never shows an empty frame */}
      <Rise at={0}>
        <div style={{ width: 480, padding: 34, borderRadius: 20, background: C.panel, border: `1px solid ${C.border}`, boxShadow: shadow }}>
          <div style={{ fontSize: 20, fontWeight: 600, color: C.primary, letterSpacing: '0.08em', textTransform: 'uppercase' }}>One record</div>
          <div style={{ marginTop: 10, fontSize: 40, fontWeight: 700, color: C.fg, letterSpacing: '-0.02em' }}>{persona.personalInfo.name}</div>
          <div style={{ fontSize: 22, color: C.muted, marginTop: 4 }}>{persona.personalInfo.title}</div>
          <div style={{ marginTop: 26, borderTop: `1px solid ${C.border}` }}>
            {RECORD_ROWS.map(([label, n], i) => (
              <Rise key={label} at={cue('idea', 'place') + i * 4} lift={10}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: `1px solid ${C.border}`, fontSize: 24 }}>
                  <span style={{ color: C.fg }}>{label}</span>
                  <span style={{ color: C.primary, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{n}</span>
                </div>
              </Rise>
            ))}
          </div>
        </div>
      </Rise>
      <div style={{ display: 'flex', gap: 34, alignItems: 'flex-start' }}>
        {JOBS.map((job, i) => {
          const p = ramp(f, fan + i * 8, 26);
          return (
            <div key={job.tag} style={{ width: 280, marginTop: i === 1 ? 50 : 0, opacity: p, transform: `translateX(${(1 - p) * -140}px) rotate(${(i - 1) * 2.5 * p}deg)` }}>
              <Img src={staticFile(`cv/${job.img}`)} style={{ width: 280, borderRadius: 6, boxShadow: shadow, border: `1px solid ${C.border}` }} />
              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
                <Pill tone="plain" size={20}>{job.tag}</Pill>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 1b. The catch: a generic online builder (no real product) and its paywall

const Cursor: React.FC<{ x: number; y: number; press?: number }> = ({ x, y, press = 0 }) => (
  <svg width="34" height="40" viewBox="0 0 23 34" style={{ position: 'absolute', left: x, top: y, transform: `scale(${1 - press * 0.12})`, filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.25))' }}>
    <path d="M0,0 L0,30 L7.5,23 L12.5,34 L18,31.5 L13,21 L23,20 Z" fill="white" stroke="black" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

const Catch: React.FC = () => {
  const f = useCurrentFrame();
  const fill = cue('catch', 'fill');
  const pick = cue('catch', 'pick');
  const press = cue('catch', 'press');
  const wall = cue('catch', 'only') - 4;
  const card = cue('catch', 'card.') - 2;
  // fields fill in one by one, then the design changes, then the click
  const fields = ['Alex Rivera', 'Senior Full-Stack Engineer', 'alex@example.com', 'Lumacrest Payments, 2021 to present', 'Northbay University, B.S.'];
  const filled = Math.min(fields.length, Math.max(0, Math.floor((f - fill) / 8)));
  const swap = ramp(f, pick + 2, 8);
  // From the form to the Download button, whose centre sits at (DL_X, BAR / 2) in the window.
  const DL_W = 202;
  const DL_X = WIN_W - 28 - DL_W / 2;
  const cx = interpolate(f, [pick + 10, press], [700, DL_X - 14], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });
  const cy = interpolate(f, [pick + 10, press], [640, BAR / 2 - 2], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE });
  const click = ramp(f, press, 5) - ramp(f, press + 7, 6);
  const modal = ramp(f, wall, 16);
  const cardField = ramp(f, card, 14);
  const preview = { position: 'absolute', height: 720, borderRadius: 4, boxShadow: shadow } as const;
  return (
    <DeskWindow
      bar={
        <>
          <span style={{ width: 30, height: 30, borderRadius: 8, background: NEUTRAL.soft, opacity: 0.4 }} />
          <span style={{ fontSize: 22, fontWeight: 600, color: NEUTRAL.ink }}>Resume builder</span>
          <span style={{ marginLeft: 'auto', width: DL_W, boxSizing: 'border-box', textAlign: 'center', padding: '12px 0', borderRadius: 10, background: NEUTRAL.go, color: 'white', fontSize: 22, fontWeight: 700, transform: `scale(${1 - click * 0.05})` }}>Download PDF</span>
        </>
      }
      over={
        <>
          {f >= pick + 10 && f < wall + 30 && <Cursor x={cx} y={cy} press={click} />}
          {/* the wall */}
          {modal > 0 && (
            <AbsoluteFill style={{ background: `rgba(0,0,0,${0.45 * modal})`, alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 640, padding: 44, borderRadius: 18, background: NEUTRAL.panel, boxShadow: '0 30px 80px rgba(0,0,0,0.35)', opacity: modal, transform: `translateY(${(1 - modal) * 30}px) scale(${0.96 + 0.04 * modal})`, textAlign: 'center' }}>
                <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke={NEUTRAL.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="10" width="16" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
                <div style={{ marginTop: 14, fontSize: 36, fontWeight: 700, color: NEUTRAL.ink }}>Almost there!</div>
                <div style={{ marginTop: 12, fontSize: 24, lineHeight: 1.4, color: NEUTRAL.soft }}>Create an account and choose a plan to download your resume.</div>
                <div style={{ marginTop: 26, height: 56, borderRadius: 10, border: `1px solid ${NEUTRAL.line}`, display: 'flex', alignItems: 'center', padding: '0 18px', gap: 12, fontSize: 22, color: NEUTRAL.soft, opacity: cardField }}>
                  <span style={{ width: 36, height: 24, borderRadius: 4, background: 'oklch(0.85 0 0)' }} /> Card number
                </div>
                <div style={{ marginTop: 22, display: 'flex', gap: 14, justifyContent: 'center' }}>
                  <span style={{ padding: '14px 30px', borderRadius: 10, background: NEUTRAL.go, color: 'white', fontSize: 22, fontWeight: 700 }}>Sign up</span>
                  <span style={{ padding: '14px 30px', borderRadius: 10, border: `1px solid ${NEUTRAL.line}`, color: NEUTRAL.ink, fontSize: 22, fontWeight: 600 }}>See plans</span>
                </div>
              </div>
            </AbsoluteFill>
          )}
        </>
      }
    >
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ width: 640, padding: 34, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {fields.map((v, i) => (
            <div key={v} style={{ padding: '16px 18px', borderRadius: 10, background: NEUTRAL.panel, border: `1px solid ${NEUTRAL.line}`, fontSize: 22, color: i < filled ? NEUTRAL.ink : NEUTRAL.soft }}>
              {i < filled ? v : '...'}
            </div>
          ))}
        </div>
        <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'oklch(0.94 0 0)' }}>
          {/* picking a design: the preview changes template */}
          <Img src={staticFile('cv/template-minimal.png')} style={{ ...preview, opacity: 1 - swap }} />
          <Img src={staticFile('cv/template-elegant.png')} style={{ ...preview, opacity: swap }} />
        </div>
      </div>
    </DeskWindow>
  );
};

// ---------------------------------------------------------------------------
// 3. The record, in the app

const Data: React.FC = () => {
  const f = useCurrentFrame();
  const toJson = cue('data', 'structured');
  const backTo = cue('data', 'LinkedIn') - 10;
  const json = ramp(f, toJson, 14) * (1 - ramp(f, backTo, 14));
  const cam = camera(f, [{ x: 0, y: 0, w: 1920, at: 0 }, { x: 0, y: 40, w: 1700, at: 30, len: 120 }]);
  return (
    <Browser>
      <Shot src="data.png" cam={cam} opacity={1 - json}>
        {(s) => <Mark r={s(boxes.importButton)} from={cue('data', 'LinkedIn')} to={beat('data').dur + 20} />}
      </Shot>
      <Shot src="json.png" cam={cam} opacity={json} />
    </Browser>
  );
};

// ---------------------------------------------------------------------------
// 4. A real AI run against the job

const AI_FRAMES = Array.from({ length: meta.aiFrames }, (_, i) => `ai-${String(i).padStart(3, '0')}.jpg`);

const before = persona.summary;
const after = (() => {
  const t = generated.previewText;
  const a = t.toUpperCase().indexOf('SUMMARY');
  const b = t.toUpperCase().indexOf('WORK EXPERIENCE');
  return a >= 0 && b > a ? t.slice(a + 'SUMMARY'.length, b).trim() : '';
})();
// Phrases of the job the rewrite now leads with, highlighted where they appear.
const JOB_TERMS = ['Senior Frontend Engineer', 'accessibility', 'healthcare', 'mentor', 'React', 'TypeScript'];

const Highlighted: React.FC<{ text: string; at: number }> = ({ text, at }) => {
  const f = useCurrentFrame();
  const parts: React.ReactNode[] = [];
  let rest = text;
  let k = 0;
  while (rest) {
    let best = -1;
    let term = '';
    for (const t of JOB_TERMS) {
      const i = rest.toLowerCase().indexOf(t.toLowerCase());
      if (i >= 0 && (best < 0 || i < best)) {
        best = i;
        // the whole word: "mentor" highlights "mentoring", not half of it
        let end = i + t.length;
        while (end < rest.length && /[A-Za-z]/.test(rest[end])) end++;
        term = rest.slice(i, end);
      }
    }
    if (best < 0) { parts.push(rest); break; }
    parts.push(rest.slice(0, best));
    const p = ramp(f, at + k * 5, 14);
    parts.push(
      <span key={k} style={{ background: `linear-gradient(transparent 58%, oklch(0.55 0.18 260 / ${0.28 * p}) 58%)`, color: C.fg, fontWeight: 600 }}>
        {term}
      </span>,
    );
    rest = rest.slice(best + term.length);
    k++;
  }
  return <>{parts}</>;
};

const Ai: React.FC = () => {
  const f = useCurrentFrame();
  const paste = cue('ai', 'Paste');
  const click = cue('ai', 'AI') - 6;
  const done = cue('ai', 'rewrites') - 4;
  const overlay = cue('ai', 'emphasis') - 2;
  // the run itself, two minutes, played in the time between the click and "rewrites"
  const runP = interpolate(f, [click + 6, done], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const frame = AI_FRAMES[Math.min(AI_FRAMES.length - 1, Math.floor(runP * AI_FRAMES.length))];
  const goO = 1 - ramp(f, click + 6, 8);
  const doneO = ramp(f, done - 8, 8);
  const runO = ramp(f, click + 6, 8) * (1 - doneO);
  const cam = camera(f, [
    { x: 0, y: 0, w: 1920, at: 0 },
    { x: 1000, y: 80, w: 920, at: done + 10, len: 40 },
  ]);
  const ov = ramp(f, overlay, 22);
  return (
    <>
      <Browser>
        {goO > 0 && (
          <Shot src="ai-go.png" opacity={goO}>
            {(s) => (
              <>
                <Mark r={s(boxes.jobBox)} from={paste} to={click} />
                <Mark r={s(boxes.generateButton)} from={click - 4} to={click + 14} />
              </>
            )}
          </Shot>
        )}
        {runO > 0 && <Shot src={frame} opacity={runO} />}
        {doneO > 0 && <Shot src="ai-done.png" cam={cam} opacity={doneO} />}
      </Browser>
      {/* Before and after, the real text of the two versions. */}
      <AbsoluteFill style={{ background: `oklch(0.985 0.002 265 / ${0.95 * ov})`, opacity: ov > 0 ? 1 : 0, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', gap: 40, opacity: ov, transform: `translateY(${(1 - ov) * 30}px)` }}>
          <div style={{ width: 640, padding: 34, borderRadius: 20, background: C.panel, border: `1px solid ${C.border}`, boxShadow: shadow }}>
            <div style={{ fontSize: 20, fontWeight: 600, color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Your record</div>
            <p style={{ fontSize: 25, lineHeight: 1.5, color: C.muted, margin: '16px 0 0' }}>{before}</p>
          </div>
          <div style={{ width: 720, padding: 34, borderRadius: 20, background: C.panel, border: `2px solid ${C.primaryLine}`, boxShadow: shadow }}>
            <div style={{ fontSize: 20, fontWeight: 600, color: C.primary, letterSpacing: '0.08em', textTransform: 'uppercase' }}>For the Mendwell job</div>
            <p style={{ fontSize: 25, lineHeight: 1.5, color: C.fg, margin: '16px 0 0' }}>
              <Highlighted text={after} at={overlay + 16} />
            </p>
          </div>
        </div>
      </AbsoluteFill>
    </>
  );
};

// ---------------------------------------------------------------------------
// 3b. The stance: no embellishment, just accurate data

const Stance: React.FC = () => {
  const f = useCurrentFrame();
  const lines = [
    { at: cue('stance', 'real'), text: 'Your real history.', color: C.fg },
    { at: cue('stance', 'embellishing:') - 2, text: 'No embellishment.', color: C.fg },
    { at: cue('stance', 'emphasis') - 4, text: 'Just accurate data, framed for the role.', color: C.primary },
  ];
  return (
    <AbsoluteFill style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 110 }}>
      <Rise at={0}>
        <div style={{ width: 460, padding: 34, borderRadius: 20, background: C.panel, border: `1px solid ${C.border}`, boxShadow: shadow }}>
          <div style={{ fontSize: 20, fontWeight: 600, color: C.primary, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Source of truth</div>
          {persona.experience.map((e, i) => (
            <Rise key={e.id} at={4 + i * 5} lift={10}>
              <div style={{ padding: '16px 0', borderBottom: i < persona.experience.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                <div style={{ fontSize: 24, fontWeight: 600, color: C.fg }}>{e.position}</div>
                <div style={{ fontSize: 20, color: C.muted, marginTop: 4 }}>{e.company} · {e.startDate.slice(0, 4)}</div>
              </div>
            </Rise>
          ))}
        </div>
      </Rise>
      <div style={{ width: 760 }}>
        {lines.map((l) => (
          <Rise key={l.text} at={l.at} lift={16}>
            <div style={{ fontSize: 66, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, color: l.color, marginBottom: 22 }}>{l.text}</div>
          </Rise>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 4b. Review: apply when it's right, adjust by hand

/** Where the review leaves the camera; the history picks it up from there. */
const REVIEW_END: Cam = { x: 40, y: 240, w: 1080 };

const Review: React.FC = () => {
  const f = useCurrentFrame();
  const apply = cue('review', 'Apply');
  const hand = cue('review', 'hand.') - 6;
  const cut = cue('review', 'out.') - 4;
  const selO = ramp(f, apply + 14, 8);
  const doneO = ramp(f, cut - 2, 6);
  const cam = camera(f, [{ x: 0, y: 0, w: 1920, at: 0 }, { ...REVIEW_END, at: hand, len: 30 }]);
  return (
    <Browser>
      {selO < 1 && (
        <Shot src="ai-review.png" opacity={1 - selO}>
          {(s) => (
            <>
              <Mark r={s(meta.readyCard)} from={8} to={apply - 2} />
              <Mark r={s(meta.applyButton)} from={apply - 4} to={apply + 18} />
            </>
          )}
        </Shot>
      )}
      {selO > 0 && doneO < 1 && (
        <Shot src="edit-selected.png" cam={cam} opacity={selO * (1 - doneO)}>
          {(s) => <Mark r={s(meta.summaryBox)} from={hand} to={cut + 2} />}
        </Shot>
      )}
      {doneO > 0 && (
        <Shot src="edit-done.png" cam={cam} opacity={doneO}>
          {(s) => <Mark r={s(meta.summaryBox)} from={cut - 6} to={beat('review').dur + 20} />}
        </Shot>
      )}
    </Browser>
  );
};

// ---------------------------------------------------------------------------
// 5. History

const History: React.FC = () => {
  const f = useCurrentFrame();
  // Same window, same framing as the edit it follows: only the panel changes, then the camera moves up to the list.
  const cam = camera(f, [{ ...REVIEW_END, at: 0 }, { x: 40, y: 80, w: 1100, at: 12, len: 32 }]);
  return (
    <Browser>
      <Shot src="history.png" cam={cam}>
        {(s) => <Mark r={s({ x: 72, y: 120, w: 900, h: 130 })} from={cue('history', 'version')} to={beat('history').dur + 20} />}
      </Shot>
    </Browser>
  );
};

// ---------------------------------------------------------------------------
// 6. Design: templates, palettes, layouts

const TEMPLATES = ['minimal', 'professional', 'modern', 'creative', 'swiss', 'harvard', 'startup', 'elegant'];
const PALETTES = ['default', 'ocean', 'forest', 'sunset', 'grape', 'rose', 'teal', 'charcoal'];
const LAYOUTS = ['single', 'sidebar-left', 'sidebar-right', 'two-column'];

const PALETTE_COLORS = Object.fromEntries(input.palettes.map((p) => [p.id, p.primary]));

/**
 * Templates roll past as a carousel (the centred page is the current one),
 * then the same page changes palette under a row of the palettes' colours,
 * then the four layouts stand side by side.
 */
const Design: React.FC = () => {
  const f = useCurrentFrame();
  const tAt = cue('design', 'templates*') - 14;
  const pAt = cue('design', 'palettes*') - 6;
  const lAt = cue('design', 'layouts*') - 6;
  const PAGE_H = 640;
  const PAGE_W = Math.round(PAGE_H / 1.414);
  const GAP = 46;

  // templates: a continuous scroll from the first to the last
  const tIdx = interpolate(f, [tAt, pAt - 8], [0, TEMPLATES.length - 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  const toPalettes = ramp(f, pAt - 8, 14);
  const toLayouts = ramp(f, lAt, 20);
  const pIdx = Math.min(PALETTES.length - 1, Math.max(0, Math.floor(((f - pAt) / Math.max(1, lAt - pAt)) * PALETTES.length)));

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      {/* the template carousel */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 170, height: PAGE_H + 120, opacity: 1 - toPalettes }}>
        {TEMPLATES.map((id, i) => {
          const d = i - tIdx;
          const scale = 1.12 - 0.26 * Math.min(1, Math.abs(d));
          return (
            <Img
              key={id}
              src={staticFile(`cv/template-${id}.png`)}
              style={{
                position: 'absolute',
                left: 960 - PAGE_W / 2 + d * (PAGE_W + GAP),
                top: 30,
                height: PAGE_H,
                borderRadius: 6,
                border: `1px solid ${C.border}`,
                boxShadow: shadow,
                transform: `scale(${scale})`,
                opacity: 1 - 0.45 * Math.min(1, Math.abs(d)),
                zIndex: 10 - Math.round(Math.abs(d)),
              }}
            />
          );
        })}
      </div>
      {f < pAt && f >= tAt && (
        <div style={{ position: 'absolute', bottom: 92 }}>
          <Pill>{`${input.templates.length} templates`}</Pill>
        </div>
      )}

      {/* the palettes, on one page */}
      {toPalettes > 0 && toLayouts < 1 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 34, opacity: toPalettes * (1 - toLayouts) }}>
          <Img src={staticFile(`cv/palette-${PALETTES[pIdx]}.png`)} style={{ height: 720, borderRadius: 6, border: `1px solid ${C.border}`, boxShadow: shadow }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {PALETTES.map((id, i) => (
              <span key={id} style={{ width: 34, height: 34, borderRadius: '50%', background: PALETTE_COLORS[id], boxShadow: i === pIdx ? `0 0 0 4px ${C.bg}, 0 0 0 7px ${PALETTE_COLORS[id]}` : 'none', transform: `scale(${i === pIdx ? 1.15 : 1})` }} />
            ))}
            <span style={{ marginLeft: 18 }}>
              <Pill>{`${input.palettes.length} palettes`}</Pill>
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* the layouts */}
      {toLayouts > 0 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 36 }}>
          <div style={{ display: 'flex', gap: 30 }}>
            {LAYOUTS.map((id, i) => {
              const p = ramp(f, lAt + i * 6, 20);
              return <Img key={id} src={staticFile(`cv/layout-${id}.png`)} style={{ height: 600, borderRadius: 6, boxShadow: shadow, border: `1px solid ${C.border}`, opacity: p, transform: `translateY(${(1 - p) * 40}px)` }} />;
            })}
          </div>
          <div style={{ opacity: toLayouts }}>
            <Pill>{`${input.layouts.length} layouts`}</Pill>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 7. Export

const Export: React.FC = () => {
  const f = useCurrentFrame();
  const chip = (word: string, label: string, sub: string) => {
    const p = ramp(f, cue('export', word), 18);
    return (
      <div style={{ opacity: p, transform: `translateX(${(1 - p) * 40}px)`, display: 'flex', alignItems: 'center', gap: 20, padding: '22px 30px', borderRadius: 18, background: C.panel, border: `1px solid ${C.border}`, boxShadow: shadow, width: 470 }}>
        <div style={{ width: 64, height: 78, borderRadius: 10, background: C.primarySoft, border: `1px solid ${C.primaryLine}`, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 10, fontFamily: fontMono, fontWeight: 600, fontSize: 16, color: C.primary }}>{label}</div>
        <div>
          <div style={{ fontFamily: fontMono, fontSize: 22, color: C.fg }}>{sub}</div>
          <div style={{ fontSize: 19, color: C.muted, marginTop: 6 }}>A4 or US Letter, as previewed</div>
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 90 }}>
      <Rise at={0}>
        <div style={{ position: 'relative', width: 560, height: 800 }}>
          <Img src={staticFile('cv/template-professional.png')} style={{ position: 'absolute', left: 40, top: 30, height: 760, borderRadius: 6, boxShadow: shadow, border: `1px solid ${C.border}`, opacity: 0.6 }} />
          <Img src={staticFile('cv/template-modern.png')} style={{ position: 'absolute', left: 0, top: 0, height: 760, borderRadius: 6, boxShadow: shadow, border: `1px solid ${C.border}` }} />
        </div>
      </Rise>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
        {chip('PDF,', 'PDF', 'Alex_Rivera_CV.pdf')}
        <Rise at={cue('export', 'download.', 1) + 4}>
          <div style={{ fontSize: 30, fontWeight: 600, color: C.fg }}>No account. No card.</div>
        </Rise>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 7b. Control: export and import the record as JSON, anywhere

const Device: React.FC<{ label: string; wide?: boolean }> = ({ label, wide }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ width: wide ? 260 : 200, height: wide ? 170 : 140, borderRadius: 14, border: `3px solid ${C.fg}`, background: C.panel, boxShadow: shadow }} />
    <div style={{ width: wide ? 120 : 240, height: 12, margin: '0 auto', borderRadius: '0 0 8px 8px', background: C.fg }} />
    <div style={{ marginTop: 16, fontSize: 22, color: C.muted }}>{label}</div>
  </div>
);

const Control: React.FC = () => {
  const f = useCurrentFrame();
  const exp = cue('control', 'Export');
  const imp = cue('control', 'import');
  const away = cue('control', 'another', 0) - 4;
  const travel = ramp(f, away, 40);
  const devices = ramp(f, away - 10, 18);
  return (
    <>
      <AbsoluteFill style={{ opacity: 1 - devices }}>
        <Browser>
          <Shot src="export-menu.png" opacity={1 - ramp(f, imp - 6, 8)}>{(s) => <Mark r={s(meta.exportJson)} from={exp} to={imp} />}</Shot>
          {f >= imp - 6 && (
            <Shot src="import-menu.png" opacity={ramp(f, imp - 6, 8)}>{(s) => <Mark r={s(meta.importJson)} from={imp - 2} to={beat('control').dur + 20} />}</Shot>
          )}
        </Browser>
      </AbsoluteFill>
      {devices > 0 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: devices }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 420 }}>
            <Device label="This browser" />
            <Device label="Another computer" wide />
          </div>
          <div style={{ position: 'absolute', left: 960 - 330 + travel * 560, top: 380 - Math.sin(travel * Math.PI) * 120, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 22px', borderRadius: 14, background: C.panel, border: `1px solid ${C.primaryLine}`, boxShadow: shadow }}>
            <span style={{ fontFamily: fontMono, fontWeight: 600, fontSize: 18, color: C.primary, padding: '6px 8px', borderRadius: 6, background: C.primarySoft }}>JSON</span>
            <span style={{ fontFamily: fontMono, fontSize: 22, color: C.fg }}>cv-data.json</span>
          </div>
          <div style={{ position: 'absolute', bottom: 150 }}>
            <Pill>It stays yours</Pill>
          </div>
        </AbsoluteFill>
      )}
    </>
  );
};

// ---------------------------------------------------------------------------
// 8. Private

const Private: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camera(f, [{ x: 0, y: 0, w: 1920, at: 0 }, { x: 0, y: 40, w: 1600, at: 20, len: 90 }]);
  const chip = (word: string, text: string, i: number) => {
    const p = ramp(f, cue('private', word), 18);
    return (
      <div key={text} style={{ opacity: p, transform: `translateY(${(1 - p) * 16}px)` }}>
        <Pill tone="plain">{text}</Pill>
      </div>
    );
  };
  return (
    <>
      <Browser>
        <Shot src="storage.png" cam={cam} />
      </Browser>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 58, display: 'flex', justifyContent: 'center', gap: 18 }}>
        {chip('account', 'No account', 0)}
        {chip('browser,', 'Stored in your browser', 1)}
        {chip('machine.', 'Local AI with Ollama, when you run it yourself', 2)}
      </div>
    </>
  );
};

// ---------------------------------------------------------------------------
// 9. The card

const Logo: React.FC<{ size?: number }> = ({ size = 96 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.24, background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 14px 40px oklch(0.55 0.18 260 / 0.35)' }}>
    <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8M8 17h5" />
    </svg>
  </div>
);

const Card: React.FC = () => (
  <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
    <Rise at={cue('card', 'CV') - 8}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
        <Logo size={120} />
        <div style={{ fontSize: 120, fontWeight: 700, color: C.fg, letterSpacing: '-0.04em' }}>CV Generator</div>
      </div>
    </Rise>
    <Rise at={cue('card', 'Stop') - 4}>
      <div style={{ marginTop: 40, fontSize: 52, fontWeight: 600, color: C.fg, letterSpacing: '-0.02em' }}>
        Stop duplicating. <span style={{ color: C.primary }}>Start generating.</span>
      </div>
    </Rise>
    <Rise at={cue('card', 'free') - 4}>
      <div style={{ marginTop: 46, display: 'flex', gap: 18, alignItems: 'center' }}>
        <Pill>cvbuilder.destbreso.com</Pill>
        <Pill tone="plain">Free app · free code (MIT)</Pill>
      </div>
    </Rise>
    <Rise at={cue('card', 'free') + 10} style={{ position: 'absolute', bottom: 70 }}>
      <div style={{ fontSize: 24, color: C.muted }}>Built by David Estévez · destbreso.com</div>
    </Rise>
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------
// Running order and sound

/** Beats that show the app window; between two of them the window stays still. */
const APP_BEATS = new Set<LineId>(['data', 'ai', 'review', 'history', 'private']);

const SCENES: Record<LineId, React.FC> = { files: Files, catch: Catch, idea: Idea, data: Data, stance: Stance, ai: Ai, review: Review, history: History, design: Design, export: Export, control: Control, private: Private, card: Card };

type Clip = { lufs?: number; file: string };
const VOICE_LUFS = (() => {
  const v = Object.values(audio.vo as Record<string, Clip>).map((c) => c.lufs ?? -24);
  return v.reduce((a, b) => a + b, 0) / v.length;
})();
const level = (clip: Clip, rel: number) => Math.min(1, 10 ** ((VOICE_LUFS + rel - (clip.lufs ?? VOICE_LUFS)) / 20));
const bed = (audio as { music?: Clip | null }).music ?? null;
const BED = bed ? level(bed, -13) : 0;
const DUCKED = bed ? level(bed, -19) : 0;

const bedVolume = (f: number) => {
  const near = VO_SPANS.reduce((d, [a, b]) => (f >= a - 6 && f <= b + 6 ? 0 : Math.min(d, Math.abs(f - (a - 6)), Math.abs(f - (b + 6)))), Infinity);
  const v = DUCKED + (BED - DUCKED) * Math.min(1, near / 12);
  return v * interpolate(f, [0, 30, TOTAL - 50, TOTAL], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
};

const Sfx: React.FC<{ id: keyof typeof audio.sfx; at: number; rel: number }> = ({ id, at, rel }) => (
  <Sequence from={Math.max(0, at)} layout="none">
    <Audio src={staticFile(audio.sfx[id].file)} volume={level(audio.sfx[id] as Clip, rel)} />
  </Sequence>
);

const Sound: React.FC = () => {
  const at = (id: LineId, f: number) => beat(id).from + f;
  const len = (id: keyof typeof audio.sfx) => Math.round(audio.sfx[id].seconds * FPS);
  const files = FILES.map((file, i) => at('files', cue('files', file.word[0], file.word[1]) + (i >= 3 ? (i - 3) * 5 : -4)));
  const card = at('card', cue('card', 'CV') - 8);
  const tAt = at('design', cue('design', 'templates*') - 14);
  const pAt = at('design', cue('design', 'palettes*') - 6);
  const lAt = at('design', cue('design', 'layouts*') - 6);
  const flips = [...TEMPLATES.slice(1).map((_, i) => tAt + Math.round(((pAt - 8 - tAt) / (TEMPLATES.length - 1)) * (i + 1))), ...PALETTES.map((_, i) => pAt + Math.round(((lAt - pAt) / PALETTES.length) * i))];
  return (
    <>
      {files.map((f, i) => <Sfx key={`pop${i}`} id="pop" at={f} rel={-12} />)}
      <Sfx id="whoosh" at={beat('idea').from - 6} rel={-10} />
      {[0, 1, 2].map((i) => <Sfx key={`card${i}`} id="pop" at={at('idea', cue('idea', 'make') + i * 8)} rel={-14} />)}
      <Sfx id="click" at={at('ai', cue('ai', 'AI') - 6)} rel={-6} />
      <Sfx id="shimmer" at={at('ai', cue('ai', 'rewrites') - 4)} rel={-8} />
      {flips.map((f, i) => <Sfx key={`flip${i}`} id="flip" at={f} rel={-14} />)}
      <Sfx id="whoosh" at={lAt} rel={-11} />
      <Sfx id="click" at={at('catch', cue('catch', 'press'))} rel={-6} />
      <Sfx id="pop" at={at('catch', cue('catch', 'only') - 4)} rel={-8} />
      <Sfx id="click" at={at('review', cue('review', 'Apply'))} rel={-7} />
      <Sfx id="ding" at={at('export', cue('export', 'PDF,'))} rel={-9} />
      <Sfx id="whoosh" at={at('control', cue('control', 'another', 0) - 4)} rel={-11} />
      <Sfx id="riser" at={card - len('riser')} rel={-8} />
      <Sfx id="bloom" at={card} rel={-5} />
    </>
  );
};

export const Film: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: font, color: C.fg }}>
    {BEATS.map((b, i) => {
      const Scene = SCENES[b.id];
      const continued = i > 0 && APP_BEATS.has(BEATS[i - 1].id) && APP_BEATS.has(b.id);
      return (
        <Sequence key={b.id} from={b.from} durationInFrames={i < BEATS.length - 1 ? b.dur + OVER : b.dur} layout="none">
          <ContinuedWindow.Provider value={continued}>
            <Beat first={i === 0}>
              <Scene />
            </Beat>
          </ContinuedWindow.Provider>
        </Sequence>
      );
    })}
    {bed ? <Audio src={staticFile(bed.file)} volume={bedVolume} /> : null}
    {BEATS.map((b) => (
      <Sequence key={`vo-${b.id}`} from={b.from + LEAD} layout="none">
        <Audio src={staticFile(audio.vo[b.id].file)} />
      </Sequence>
    ))}
    <Sound />
  </AbsoluteFill>
);
