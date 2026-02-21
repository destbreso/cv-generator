import type { NextRequest } from "next/server";
import type { CVData } from "@/lib/types";
import { parseLLMError } from "@/lib/llm-errors";
import { DEFAULT_SYSTEM_PROMPT } from "@/lib/default-system-prompt";

// Allow long-running generation
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const { cvData, context, outputLanguage, llmConfig } = await request.json();

    if (!llmConfig || !llmConfig.baseUrl || !llmConfig.model) {
      return Response.json(
        { error: "LLM configuration is required" },
        { status: 400 },
      );
    }

    console.log("[gen] Config:", {
      baseUrl: llmConfig.baseUrl,
      model: llmConfig.model,
      provider: llmConfig.provider,
      outputLanguage: outputLanguage || "auto",
    });

    const { systemMessage, userMessage } = buildMessages(
      cvData,
      context,
      llmConfig.systemPrompt,
      outputLanguage,
    );
    const provider = llmConfig.provider || "ollama";

    const createSSE = (content: string) => {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(
            encoder.encode('data: {"status":"generating"}\n\n'),
          );
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ status: "done", content })}\n\n`,
            ),
          );
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    };

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (llmConfig.apiKey) {
      headers["Authorization"] = `Bearer ${llmConfig.apiKey}`;
    }

    if (provider !== "ollama") {
      let endpoint = llmConfig.baseUrl.replace(/\/+$/, "");
      let response: Response | undefined;

      if (
        provider === "openai" ||
        provider === "groq" ||
        provider === "gemini" ||
        provider === "mistral" ||
        provider === "deepseek" ||
        provider === "custom"
      ) {
        const base = endpoint.includes("/v1") ? endpoint : `${endpoint}/v1`;
        const chatEndpoint = `${base}/chat/completions`;

        if (llmConfig.apiKey) {
          headers["Authorization"] = `Bearer ${llmConfig.apiKey}`;
        }

        response = await fetch(chatEndpoint, {
          method: "POST",
          headers,
          body: JSON.stringify({
            model: llmConfig.model,
            messages: [
              { role: "system", content: systemMessage },
              { role: "user", content: userMessage },
            ],
            temperature: 0.2,
          }),
        });
      } else if (provider === "anthropic") {
        if (llmConfig.apiKey) {
          headers["x-api-key"] = llmConfig.apiKey;
          headers["anthropic-version"] = "2023-06-01";
        }

        const messagesEndpoint = `${endpoint}/messages`;
        response = await fetch(messagesEndpoint, {
          method: "POST",
          headers,
          body: JSON.stringify({
            model: llmConfig.model,
            max_tokens: 4096,
            system: systemMessage,
            messages: [{ role: "user", content: userMessage }],
          }),
        });
      }

      if (!response) {
        return Response.json(
          { error: "Unsupported provider" },
          { status: 400 },
        );
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[gen] LLM error:", errorText);
        const friendlyError = parseLLMError(
          response.status,
          errorText,
          provider,
        );
        return Response.json(
          { error: friendlyError, status: response.status, provider },
          { status: 502 },
        );
      }

      const data = await response.json();
      let content = "";

      if (provider === "anthropic") {
        content = data?.content?.[0]?.text || "";
      } else {
        content = data?.choices?.[0]?.message?.content || "";
      }

      return createSSE(content);
    }

    const generateEndpoint = `${llmConfig.baseUrl}/api/generate`;

    // Stream from Ollama so the connection stays alive during long generations
    // Ollama generate uses a single prompt string — combine system + user
    const ollamaFullPrompt = `${systemMessage}\n\n${userMessage}`;
    const ollamaRes = await fetch(generateEndpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: llmConfig.model,
        prompt: ollamaFullPrompt,
        stream: true,
        format: "json",
      }),
    });

    console.log("[gen] Ollama status:", ollamaRes.status);

    if (!ollamaRes.ok) {
      const errorText = await ollamaRes.text();
      console.error("[gen] Ollama error:", errorText);
      const friendlyError = parseLLMError(
        ollamaRes.status,
        errorText,
        "ollama",
      );
      return Response.json(
        { error: friendlyError, status: ollamaRes.status, provider: "ollama" },
        { status: 502 },
      );
    }

    // Collect the full response by consuming the Ollama NDJSON stream,
    // then return the assembled result as a single JSON response.
    // We read chunk-by-chunk to keep the HTTP connection alive.
    const ollamaReader = ollamaRes.body?.getReader();
    if (!ollamaReader) {
      return Response.json({ error: "No response body" }, { status: 502 });
    }

    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    let fullContent = "";
    let chunkCount = 0;

    // Use a TransformStream to send SSE keep-alive pings + final result
    const stream = new ReadableStream({
      async start(controller) {
        let closed = false;

        const safeEnqueue = (chunk: Uint8Array) => {
          if (closed) return;
          try {
            controller.enqueue(chunk);
          } catch {
            closed = true;
          }
        };

        const safeClose = () => {
          if (closed) return;
          closed = true;
          try {
            controller.close();
          } catch {
            // ignore
          }
        };

        const abortHandler = () => {
          closed = true;
          try {
            ollamaReader.cancel();
          } catch {
            // ignore
          }
          safeClose();
        };

        request.signal.addEventListener("abort", abortHandler, { once: true });

        try {
          // Send an initial ping so the client knows the connection is alive
          safeEnqueue(encoder.encode('data: {"status":"generating"}\n\n'));

          let ollamaDone = false;
          while (true) {
            const { done, value } = await ollamaReader.read();
            if (done) break;

            const text = decoder.decode(value, { stream: true });
            const lines = text.split("\n");

            for (const line of lines) {
              if (!line.trim()) continue;
              try {
                const parsed = JSON.parse(line);
                if (parsed.response) {
                  fullContent += parsed.response;
                  chunkCount++;
                }
                // Send periodic progress pings every 10 chunks to keep connection alive
                if (chunkCount % 10 === 0) {
                  safeEnqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({ status: "progress", chunks: chunkCount })}\n\n`,
                    ),
                  );
                }
                if (parsed.done === true) {
                  // Ollama signals completion
                  ollamaDone = true;
                  break;
                }
              } catch {
                // skip malformed lines
              }
            }

            if (ollamaDone) break;
          }

          console.log(
            "[gen] Complete. Length:",
            fullContent.length,
            "Chunks:",
            chunkCount,
          );

          // Send the final result
          safeEnqueue(
            encoder.encode(
              `data: ${JSON.stringify({ status: "done", content: fullContent })}\n\n`,
            ),
          );
          safeClose();
        } catch (err) {
          console.error("[gen] Stream error:", err);
          try {
            safeEnqueue(
              encoder.encode(
                `data: ${JSON.stringify({ status: "error", error: String(err) })}\n\n`,
              ),
            );
            safeClose();
          } catch {
            /* already closed */
          }
        } finally {
          request.signal.removeEventListener("abort", abortHandler);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("[gen] CV generation error:", error);
    return Response.json(
      { error: "Generation failed", details: String(error) },
      { status: 500 },
    );
  }
}

/**
 * Build the system and user messages for the LLM request.
 *
 * - **systemMessage**: The user's custom writing instructions (or a sensible
 *   default) + mandatory output-format rules + optional language override.
 *   This is sent as the `system` role for chat providers and prepended to
 *   the prompt for Ollama.
 *
 * - **userMessage**: The job context + the raw CV data + a short closing
 *   instruction.  This is the `user` role content.
 *
 * Keeping them separate avoids duplicating the system prompt and ensures
 * format / language constraints are always enforced regardless of whether
 * the user customised the writing instructions.
 */
function buildMessages(
  cvData: CVData,
  context: string,
  customSystemPrompt?: string,
  outputLanguage?: string,
): { systemMessage: string; userMessage: string } {
  // ── 1. Writing-style instructions (user-customisable) ──
  const writingInstructions =
    customSystemPrompt?.trim() || DEFAULT_SYSTEM_PROMPT;

  // ── 2. Output-format rules (always enforced) ──
  const formatRules = `
OUTPUT FORMAT RULES (always follow these):
- You MUST return ONLY a single valid JSON object — no markdown, no explanation, no code fences.
- The JSON must match the exact structure of the input CV data.
- Keep all existing array fields (experience, education, skills, languages, projects, certifications, publications, volunteerWork, awards, interests).
- Preserve all "id" fields exactly as they are.
- Do NOT add or remove top-level keys.`;

  // ── 3. Language override (appended when not "auto") ──
  const languageRule =
    outputLanguage && outputLanguage !== "auto"
      ? `\n\nOUTPUT LANGUAGE: Write ALL text content (summary, descriptions, achievements, skill categories, etc.) in ${outputLanguage}. Translate everything except proper nouns (company names, institution names, technologies, certifications). JSON field keys must remain in English.`
      : "";

  const systemMessage = `${writingInstructions}\n${formatRules}${languageRule}`;

  // ── 4. User message — job context + CV data ──
  const userMessage = `JOB CONTEXT / TARGET ROLE:
${context}

CURRENT CV DATA (preserve this exact JSON structure, all fields, all ids):
${JSON.stringify(cvData, null, 2)}

Return the optimized CV as a single JSON object. No markdown, no wrapping, no explanation — ONLY the JSON.`;

  return { systemMessage, userMessage };
}
