import type { NextRequest } from "next/server";
import type { CVData } from "@/lib/types";

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
    });

    const prompt = buildPrompt(cvData, context, llmConfig.systemPrompt, outputLanguage);
    const generateEndpoint = `${llmConfig.baseUrl}/api/generate`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (llmConfig.apiKey) {
      headers["Authorization"] = `Bearer ${llmConfig.apiKey}`;
    }

    // Stream from Ollama so the connection stays alive during long generations
    const ollamaRes = await fetch(generateEndpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: llmConfig.model,
        prompt,
        stream: true,
        format: "json",
      }),
    });

    console.log("[gen] Ollama status:", ollamaRes.status);

    if (!ollamaRes.ok) {
      const errorText = await ollamaRes.text();
      console.error("[gen] Ollama error:", errorText);
      return Response.json(
        { error: `LLM failed: ${ollamaRes.status}`, details: errorText },
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
        try {
          // Send an initial ping so the client knows the connection is alive
          controller.enqueue(
            encoder.encode('data: {"status":"generating"}\n\n'),
          );

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
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({ status: "progress", chunks: chunkCount })}\n\n`,
                    ),
                  );
                }
                if (parsed.done === true) {
                  // Ollama signals completion
                  break;
                }
              } catch {
                // skip malformed lines
              }
            }
          }

          console.log(
            "[gen] Complete. Length:",
            fullContent.length,
            "Chunks:",
            chunkCount,
          );

          // Send the final result
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ status: "done", content: fullContent })}\n\n`,
            ),
          );
          controller.close();
        } catch (err) {
          console.error("[gen] Stream error:", err);
          try {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ status: "error", error: String(err) })}\n\n`,
              ),
            );
            controller.close();
          } catch {
            /* already closed */
          }
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

function buildPrompt(
  cvData: CVData,
  context: string,
  systemPrompt?: string,
  outputLanguage?: string,
): string {
  const languageInstruction = outputLanguage && outputLanguage !== "auto"
    ? `\nIMPORTANT: Write ALL text content (summary, descriptions, achievements, skill categories, etc.) in ${outputLanguage}. Translate everything except proper nouns (company names, institution names, technologies, certifications). Field keys must remain in English.`
    : "";

  const defaultPrompt = `You are a professional CV/resume optimization assistant.
Your task is to optimize the given CV data for the specified job context.
You MUST return ONLY a single valid JSON object — no markdown, no explanation, no code fences.
The JSON must match the exact structure of the input CV data.
Keep all existing array fields (experience, education, skills, languages, projects, certifications, publications, volunteerWork, awards, interests).
Preserve all "id" fields exactly as they are.
Optimize descriptions, achievements, and summaries to better match the job context.
Do NOT remove sections — if a section has data, keep it. You may reword content to be more relevant.${languageInstruction}`;

  return `${systemPrompt || defaultPrompt}

JOB CONTEXT / TARGET ROLE:
${context}

CURRENT CV DATA (preserve this exact JSON structure, all fields, all ids):
${JSON.stringify(cvData, null, 2)}

Return the optimized CV as a single JSON object. No markdown, no wrapping, no explanation — ONLY the JSON.`;
}
