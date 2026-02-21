/**
 * Parse LLM provider errors into user-friendly messages.
 *
 * Used by API routes (generate-cv, parse-linkedin-pdf, list-models)
 * to return actionable error messages to the client.
 */
export function parseLLMError(
  status: number,
  rawBody: string,
  provider: string,
): string {
  // Try to parse JSON error body
  let parsed: any = null;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    // not JSON
  }

  const deepMessage: string =
    parsed?.error?.message || parsed?.error?.error || parsed?.message || "";
  const lower = deepMessage.toLowerCase();

  // ── Rate limit / quota ──
  if (
    status === 429 ||
    lower.includes("rate") ||
    lower.includes("quota") ||
    lower.includes("resource_exhausted") ||
    lower.includes("too many requests")
  ) {
    // Try to extract retry delay
    const retryMatch = deepMessage.match(/retry in ([\d.]+)s/i);
    const retryHint = retryMatch
      ? ` Try again in ~${Math.ceil(Number(retryMatch[1]))}s.`
      : " Please wait a moment and try again.";
    return `Rate limit exceeded for ${provider}.${retryHint}`;
  }

  // ── Auth errors ──
  if (status === 401 || status === 403) {
    return `Authentication failed for ${provider}. Check your API key.`;
  }

  // ── Model not found ──
  if (
    status === 404 ||
    lower.includes("model not found") ||
    lower.includes("does not exist")
  ) {
    return `Model not found on ${provider}. Verify the model name.`;
  }

  // ── Request too large ──
  if (status === 413 || lower.includes("too large") || lower.includes("max tokens")) {
    return `Request too large for ${provider}. Try a shorter input.`;
  }

  // ── Server error ──
  if (status >= 500) {
    return `${provider} server error (${status}). The provider may be experiencing issues.`;
  }

  // ── Fallback — use provider message if readable, else generic ──
  if (deepMessage && deepMessage.length < 200) {
    return `${provider}: ${deepMessage}`;
  }

  return `${provider} request failed (${status}).`;
}
