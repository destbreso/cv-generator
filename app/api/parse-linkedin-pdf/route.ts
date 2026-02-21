import type { NextRequest } from "next/server";
import type { CVData } from "@/lib/types";
import { parseLLMError } from "@/lib/llm-errors";

// Allow long-running parsing + LLM extraction
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("pdf") as File | null;
    const baseUrl = formData.get("baseUrl") as string | null;
    const model = formData.get("model") as string | null;
    const apiKey = formData.get("apiKey") as string | null;
    const provider = (formData.get("provider") as string | null) || "ollama";

    if (!file) {
      return Response.json({ error: "No PDF file provided" }, { status: 400 });
    }

    if (!baseUrl || !model) {
      return Response.json(
        { error: "LLM configuration (baseUrl, model) is required" },
        { status: 400 },
      );
    }

    console.log("[linkedin] Parsing PDF:", file.name, "Size:", file.size);

    // 1. Extract text from PDF
    // NOTE: import from "pdf-parse/lib/pdf-parse" to skip the self-test
    // that index.js runs (tries to open ./test/data/05-versions-space.pdf)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pdfParse = (await import("pdf-parse/lib/pdf-parse")).default;
    const pdfResult = await pdfParse(buffer);
    const pdfText = pdfResult.text;

    console.log(
      "[linkedin] Extracted text length:",
      pdfText.length,
      "Pages:",
      pdfResult.numpages,
    );

    if (!pdfText.trim()) {
      return Response.json(
        {
          error:
            "Could not extract text from PDF. The file may be image-based or empty.",
        },
        { status: 422 },
      );
    }

    // 2. Use LLM to structure the extracted text into CV data
    const prompt = buildLinkedInPrompt(pdfText);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    console.log("[linkedin] Sending to LLM for structuring...", {
      provider,
      model,
    });

    const encoder = new TextEncoder();

    // Helper to create SSE response for non-streaming providers
    const createSSE = (content: string) => {
      const cvData = tryParseCVData(content);
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(
            encoder.encode('data: {"status":"extracting"}\n\n'),
          );
          if (cvData) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ status: "done", cvData })}\n\n`,
              ),
            );
          } else {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  status: "error",
                  error: "Failed to parse structured data from LLM response",
                  rawContent: content.substring(0, 2000),
                })}\n\n`,
              ),
            );
          }
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

    // ── Non-Ollama providers: single request → SSE wrapper ──
    if (provider !== "ollama") {
      let endpoint = baseUrl.replace(/\/+$/, "");
      let llmResponse: Response | undefined;

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

        llmResponse = await fetch(chatEndpoint, {
          method: "POST",
          headers,
          body: JSON.stringify({
            model,
            messages: [
              {
                role: "system",
                content:
                  "You are a professional CV data extraction assistant. Return ONLY valid JSON.",
              },
              { role: "user", content: prompt },
            ],
            temperature: 0.2,
          }),
        });
      } else if (provider === "anthropic") {
        if (apiKey) {
          headers["x-api-key"] = apiKey;
          headers["anthropic-version"] = "2023-06-01";
          delete headers["Authorization"];
        }
        const messagesEndpoint = `${endpoint}/messages`;
        llmResponse = await fetch(messagesEndpoint, {
          method: "POST",
          headers,
          body: JSON.stringify({
            model,
            max_tokens: 4096,
            system:
              "You are a professional CV data extraction assistant. Return ONLY valid JSON.",
            messages: [{ role: "user", content: prompt }],
          }),
        });
      }

      if (!llmResponse) {
        return Response.json(
          { error: "Unsupported provider" },
          { status: 400 },
        );
      }

      if (!llmResponse.ok) {
        const errorText = await llmResponse.text();
        console.error("[linkedin] LLM error:", errorText);
        const friendlyError = parseLLMError(llmResponse.status, errorText, provider);
        return Response.json(
          { error: friendlyError },
          { status: 502 },
        );
      }

      const data = await llmResponse.json();
      let content = "";
      if (provider === "anthropic") {
        content = data?.content?.[0]?.text || "";
      } else {
        content = data?.choices?.[0]?.message?.content || "";
      }

      return createSSE(content);
    }

    // ── Ollama provider: NDJSON streaming ──
    const generateEndpoint = `${baseUrl}/api/generate`;
    const ollamaRes = await fetch(generateEndpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        prompt,
        stream: true,
        format: "json",
      }),
    });

    if (!ollamaRes.ok) {
      const errorText = await ollamaRes.text();
      console.error("[linkedin] Ollama error:", errorText);
      const friendlyError = parseLLMError(ollamaRes.status, errorText, "ollama");
      return Response.json(
        { error: friendlyError },
        { status: 502 },
      );
    }

    const ollamaReader = ollamaRes.body?.getReader();
    if (!ollamaReader) {
      return Response.json(
        { error: "No response body from LLM" },
        { status: 502 },
      );
    }

    const decoder = new TextDecoder();
    let fullContent = "";
    let chunkCount = 0;

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
            /* ignore */
          }
        };

        const abortHandler = () => {
          closed = true;
          try {
            ollamaReader.cancel();
          } catch {
            /* ignore */
          }
          safeClose();
        };

        request.signal.addEventListener("abort", abortHandler, { once: true });

        try {
          safeEnqueue(encoder.encode('data: {"status":"extracting"}\n\n'));

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
                if (chunkCount % 10 === 0) {
                  safeEnqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({ status: "progress", chunks: chunkCount })}\n\n`,
                    ),
                  );
                }
                if (parsed.done === true) {
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
            "[linkedin] LLM complete. Content length:",
            fullContent.length,
            "Chunks:",
            chunkCount,
          );

          const cvData = tryParseCVData(fullContent);

          if (cvData) {
            safeEnqueue(
              encoder.encode(
                `data: ${JSON.stringify({ status: "done", cvData })}\n\n`,
              ),
            );
          } else {
            safeEnqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  status: "error",
                  error: "Failed to parse structured data from LLM response",
                  rawContent: fullContent.substring(0, 2000),
                })}\n\n`,
              ),
            );
          }
          safeClose();
        } catch (err) {
          console.error("[linkedin] Stream error:", err);
          safeEnqueue(
            encoder.encode(
              `data: ${JSON.stringify({ status: "error", error: String(err) })}\n\n`,
            ),
          );
          safeClose();
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
    console.error("[linkedin] Parse error:", error);
    return Response.json(
      { error: "Failed to parse LinkedIn PDF", details: String(error) },
      { status: 500 },
    );
  }
}

function tryParseCVData(raw: string): CVData | undefined {
  const attempt = (text: string): CVData | undefined => {
    try {
      const parsed = JSON.parse(text);
      if (parsed.personalInfo) {
        return {
          personalInfo: {
            name: "",
            title: "",
            email: "",
            phone: "",
            location: "",
            website: "",
            linkedin: "",
            github: "",
            portfolio: "",
            ...parsed.personalInfo,
          },
          summary: parsed.summary || "",
          experience: (parsed.experience || []).map(
            (exp: Record<string, unknown>, i: number) => {
              const { id: _id, ...rest } = exp;
              return {
                id: (exp.id as string) || `exp-${i + 1}`,
                company: "",
                position: "",
                startDate: "",
                endDate: "",
                description: "",
                achievements: [],
                ...rest,
              };
            },
          ),
          education: (parsed.education || []).map(
            (edu: Record<string, unknown>, i: number) => {
              const { id: _id, ...rest } = edu;
              return {
                id: (edu.id as string) || `edu-${i + 1}`,
                institution: "",
                degree: "",
                field: "",
                startDate: "",
                endDate: "",
                ...rest,
              };
            },
          ),
          skills: (parsed.skills || []).map(
            (sk: Record<string, unknown>, i: number) => {
              const { id: _id, ...rest } = sk;
              return {
                id: (sk.id as string) || `sk-${i + 1}`,
                category: "",
                items: [],
                ...rest,
              };
            },
          ),
          languages: (parsed.languages || []).map(
            (lang: Record<string, unknown>, i: number) => {
              const { id: _id, ...rest } = lang;
              return {
                id: (lang.id as string) || `lang-${i + 1}`,
                language: "",
                proficiency: "intermediate",
                ...rest,
              };
            },
          ),
          projects: (parsed.projects || []).map(
            (proj: Record<string, unknown>, i: number) => {
              const { id: _id, ...rest } = proj;
              return {
                id: (proj.id as string) || `proj-${i + 1}`,
                name: "",
                description: "",
                technologies: [],
                ...rest,
              };
            },
          ),
          certifications: (parsed.certifications || []).map(
            (cert: Record<string, unknown>, i: number) => {
              const { id: _id, ...rest } = cert;
              return {
                id: (cert.id as string) || `cert-${i + 1}`,
                name: "",
                issuer: "",
                date: "",
                ...rest,
              };
            },
          ),
          publications: (parsed.publications || []).map(
            (pub: Record<string, unknown>, i: number) => {
              const { id: _id, ...rest } = pub;
              return {
                id: (pub.id as string) || `pub-${i + 1}`,
                title: "",
                publisher: "",
                date: "",
                ...rest,
              };
            },
          ),
          volunteerWork: (parsed.volunteerWork || []).map(
            (vol: Record<string, unknown>, i: number) => {
              const { id: _id, ...rest } = vol;
              return {
                id: (vol.id as string) || `vol-${i + 1}`,
                organization: "",
                role: "",
                startDate: "",
                endDate: "",
                description: "",
                ...rest,
              };
            },
          ),
          awards: (parsed.awards || []).map(
            (award: Record<string, unknown>, i: number) => {
              const { id: _id, ...rest } = award;
              return {
                id: (award.id as string) || `award-${i + 1}`,
                title: "",
                issuer: "",
                date: "",
                ...rest,
              };
            },
          ),
          interests: parsed.interests || [],
        } as CVData;
      }
    } catch {
      // not valid JSON
    }
    return undefined;
  };

  let result = attempt(raw);
  if (!result) {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      result = attempt(jsonMatch[0]);
    }
  }
  return result;
}

function buildLinkedInPrompt(pdfText: string): string {
  return `You are a professional CV data extraction assistant.
You will receive raw text extracted from a LinkedIn profile PDF.
Your task is to parse and structure this text into a well-organized CV/resume JSON object.

IMPORTANT RULES:
- Return ONLY a single valid JSON object — no markdown, no explanation, no code fences.
- Extract as much information as possible from the LinkedIn text.
- For each experience entry, create a description from the role details and extract individual achievements as bullet points.
- Group skills into logical categories (e.g., "Programming Languages", "Frameworks", "Tools", "Soft Skills").
- Map language proficiencies to one of: "native", "fluent", "advanced", "intermediate", "basic".
- If a field is not found in the text, use an empty string or empty array as appropriate.
- Generate unique IDs for each array item (e.g., "exp-1", "edu-1", "sk-1", etc.).
- For dates, use the format found in the text or approximate (e.g., "Jan 2020", "2020").

The JSON structure MUST be:
{
  "personalInfo": {
    "name": "string",
    "title": "string (professional headline)",
    "email": "string",
    "phone": "string",
    "location": "string",
    "website": "string",
    "linkedin": "string",
    "github": "string",
    "portfolio": "string"
  },
  "summary": "string (professional summary/about section)",
  "experience": [
    {
      "id": "exp-1",
      "company": "string",
      "position": "string",
      "startDate": "string",
      "endDate": "string (use 'Present' if current)",
      "description": "string",
      "achievements": ["string"]
    }
  ],
  "education": [
    {
      "id": "edu-1",
      "institution": "string",
      "degree": "string",
      "field": "string",
      "startDate": "string",
      "endDate": "string",
      "gpa": "string (if available)"
    }
  ],
  "skills": [
    {
      "id": "sk-1",
      "category": "string",
      "items": ["string"]
    }
  ],
  "languages": [
    {
      "id": "lang-1",
      "language": "string",
      "proficiency": "native|fluent|advanced|intermediate|basic"
    }
  ],
  "projects": [
    {
      "id": "proj-1",
      "name": "string",
      "description": "string",
      "technologies": ["string"],
      "url": "string"
    }
  ],
  "certifications": [
    {
      "id": "cert-1",
      "name": "string",
      "issuer": "string",
      "date": "string",
      "url": "string"
    }
  ],
  "publications": [
    {
      "id": "pub-1",
      "title": "string",
      "publisher": "string",
      "date": "string",
      "url": "string",
      "description": "string"
    }
  ],
  "volunteerWork": [
    {
      "id": "vol-1",
      "organization": "string",
      "role": "string",
      "startDate": "string",
      "endDate": "string",
      "description": "string"
    }
  ],
  "awards": [
    {
      "id": "award-1",
      "title": "string",
      "issuer": "string",
      "date": "string",
      "description": "string"
    }
  ],
  "interests": ["string"]
}

LINKEDIN PROFILE TEXT:
${pdfText}

Return the structured CV as a single JSON object. No markdown, no wrapping, no explanation — ONLY the JSON.`;
}
