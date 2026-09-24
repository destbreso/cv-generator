/**
 * Sending an event to GA4.
 *
 * Everything that reaches Google goes through here, so there is one place that
 * decides what is allowed out.
 *
 * The rule: nothing from a CV. Not a name, not an employer, not a job
 * description, not the text of a prompt. Events say what kind of thing
 * happened and, at most, carry a value this codebase chose from a fixed set,
 * such as which template or which provider. The allowlist below is that set;
 * anything else is dropped rather than guessed at, so a field added at a call
 * site cannot start leaking by accident.
 */

const ALLOWED_PARAMS = new Set(["type", "name", "provider", "template", "count"]);

export function sanitizeParams(
  payload?: Record<string, unknown>,
): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  if (!payload) return out;
  for (const [key, value] of Object.entries(payload)) {
    if (!ALLOWED_PARAMS.has(key)) continue;
    if (typeof value === "number" && Number.isFinite(value)) out[key] = value;
    else if (typeof value === "string" && value) out[key] = value.slice(0, 60);
  }
  return out;
}

export function track(name: string, payload?: Record<string, unknown>): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, sanitizeParams(payload));
}
