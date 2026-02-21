"use client";

import { useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";

const REPO_URL = "https://github.com/destbreso/cv-generator";
const STORAGE_KEY = "cv-gen-engagement";

/* ────────────────────────────────────────────────
   Message pool — lightweight, non-invasive, varied
   ──────────────────────────────────────────────── */
interface EngagementMessage {
  id: string;
  text: string;
  description?: string;
  actionLabel: string;
  actionUrl: string;
  /** Weight 1-5 — higher = shown more often */
  weight: number;
}

const MESSAGES: EngagementMessage[] = [
  {
    id: "star-enjoy",
    text: "Enjoying CV Generator?",
    description: "A ⭐ on GitHub helps others discover it too.",
    actionLabel: "Star on GitHub",
    actionUrl: REPO_URL,
    weight: 4,
  },
  {
    id: "star-free",
    text: "100% free, no sign-up, open source",
    description: "If that's valuable to you, consider starring the repo.",
    actionLabel: "⭐ Star",
    actionUrl: REPO_URL,
    weight: 3,
  },
  {
    id: "contribute",
    text: "Want to improve CV Generator?",
    description: "We welcome contributions — bug fixes, features, translations.",
    actionLabel: "Contribute",
    actionUrl: `${REPO_URL}/blob/main/CONTRIBUTING.md`,
    weight: 2,
  },
  {
    id: "star-milestone",
    text: "You just generated a CV with AI!",
    description: "If it helped, a star helps us keep building.",
    actionLabel: "⭐ GitHub",
    actionUrl: REPO_URL,
    weight: 3,
  },
  {
    id: "issues",
    text: "Found a bug or have a feature idea?",
    description: "Open an issue — we read every one.",
    actionLabel: "Open issue",
    actionUrl: `${REPO_URL}/issues`,
    weight: 2,
  },
  {
    id: "share",
    text: "Know someone looking for a job?",
    description: "Share CV Generator — it's free and private.",
    actionLabel: "Share repo",
    actionUrl: REPO_URL,
    weight: 2,
  },
  {
    id: "privacy-first",
    text: "Your data never leaves your browser",
    description: "We're committed to privacy. Star us if you agree that matters.",
    actionLabel: "⭐ Support privacy",
    actionUrl: REPO_URL,
    weight: 2,
  },
];

/* ────────────────────────────────────────────────
   Persistence — track what was shown & dismissed
   ──────────────────────────────────────────────── */
interface EngagementState {
  /** Total times engagement was triggered */
  totalShown: number;
  /** IDs that user explicitly dismissed (clicked ✕) */
  dismissed: string[];
  /** Timestamp of last engagement shown */
  lastShown: number;
  /** Number of "milestone" events (generation, import, etc.) */
  milestones: number;
  /** True if user clicked any action link (likely starred) */
  engaged: boolean;
}

function loadState(): EngagementState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    totalShown: 0,
    dismissed: [],
    lastShown: 0,
    milestones: 0,
    engaged: false,
  };
}

function saveState(s: EngagementState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {}
}

/* ────────────────────────────────────────────────
   Pick a message using weighted random selection
   ──────────────────────────────────────────────── */
function pickMessage(state: EngagementState): EngagementMessage | null {
  const pool = MESSAGES.filter((m) => !state.dismissed.includes(m.id));
  if (pool.length === 0) return null;

  const totalWeight = pool.reduce((sum, m) => sum + m.weight, 0);
  let r = Math.random() * totalWeight;
  for (const m of pool) {
    r -= m.weight;
    if (r <= 0) return m;
  }
  return pool[pool.length - 1];
}

/* ────────────────────────────────────────────────
   Hook
   ──────────────────────────────────────────────── */
export function useGithubEngagement() {
  const stateRef = useRef<EngagementState | null>(null);

  useEffect(() => {
    stateRef.current = loadState();
  }, []);

  const getState = useCallback((): EngagementState => {
    if (!stateRef.current) stateRef.current = loadState();
    return stateRef.current;
  }, []);

  const showEngagement = useCallback(
    (trigger?: "generation" | "import" | "connect" | "idle") => {
      const s = getState();

      // If user already clicked an action link, stop showing (they engaged)
      if (s.engaged) return;

      // Rate-limit: min 5 minutes between toasts
      const MIN_GAP = 5 * 60 * 1000;
      if (Date.now() - s.lastShown < MIN_GAP) return;

      // Don't show on the very first session interaction — let them settle in
      if (s.milestones < 1 && trigger !== "idle") {
        s.milestones++;
        saveState(s);
        stateRef.current = s;
        return;
      }

      // Cap: max 3 total across the lifetime
      if (s.totalShown >= 3) return;

      // Probability gate — not every event triggers a toast
      const PROB: Record<string, number> = {
        generation: 0.6, // 60% after AI generation
        import: 0.5, // 50% after LinkedIn import
        connect: 0.3, // 30% after AI connect
        idle: 0.2, // 20% after idle time
      };
      if (Math.random() > (PROB[trigger || "idle"] ?? 0.2)) {
        s.milestones++;
        saveState(s);
        stateRef.current = s;
        return;
      }

      const msg = pickMessage(s);
      if (!msg) return;

      s.totalShown++;
      s.milestones++;
      s.lastShown = Date.now();
      saveState(s);
      stateRef.current = s;

      toast(msg.text, {
        description: msg.description,
        duration: 12000,
        action: {
          label: msg.actionLabel,
          onClick: () => {
            window.open(msg.actionUrl, "_blank", "noopener,noreferrer");
            // Mark as engaged — no more prompts
            const updated = getState();
            updated.engaged = true;
            saveState(updated);
            stateRef.current = updated;
          },
        },
        onDismiss: () => {
          // Track dismissal so we don't repeat that message
          const updated = getState();
          updated.dismissed.push(msg.id);
          saveState(updated);
          stateRef.current = updated;
        },
      });
    },
    [getState],
  );

  /** Track a milestone without necessarily showing anything */
  const trackMilestone = useCallback(() => {
    const s = getState();
    s.milestones++;
    saveState(s);
    stateRef.current = s;
  }, [getState]);

  return { showEngagement, trackMilestone };
}
