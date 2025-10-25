import type { NextRequest } from "next/server"
import type { CVData } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const { cvData, context, llmConfig } = await request.json()

    if (!llmConfig || !llmConfig.baseUrl || !llmConfig.model) {
      return new Response(JSON.stringify({ error: "LLM configuration is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    console.log("[v0] Generating CV with config:", {
      baseUrl: llmConfig.baseUrl,
      model: llmConfig.model,
    })

    const prompt = buildPrompt(cvData, context, llmConfig.systemPrompt)

    const generateEndpoint = `${llmConfig.baseUrl}/api/generate`
    console.log("[v0] Calling Ollama at:", generateEndpoint)

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (llmConfig.apiKey) {
      headers["Authorization"] = `Bearer ${llmConfig.apiKey}`
    }

    const response = await fetch(generateEndpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: llmConfig.model,
        prompt,
        stream: true,
        format: "json",
      }),
    })

    console.log("[v0] Ollama response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Ollama error response:", errorText)
      throw new Error(`LLM request failed: ${response.status} - ${errorText}`)
    }

    // Stream the response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        if (!reader) {
          controller.close()
          return
        }

        const decoder = new TextDecoder()

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split("\n")

            for (const line of lines) {
              if (line.trim()) {
                try {
                  const parsed = JSON.parse(line)
                  if (parsed.response) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: parsed.response })}\n\n`))
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"))
          controller.close()
        } catch (error) {
          console.error("[v0] Stream error:", error)
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("[v0] CV generation error:", error)
    return new Response(JSON.stringify({ error: "Generation failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

function buildPrompt(cvData: CVData, context: string, systemPrompt?: string): string {
  const defaultPrompt = `You are a professional CV optimization assistant. Return ONLY valid JSON matching the CVData structure.`

  return `${systemPrompt || defaultPrompt}

JOB CONTEXT:
${context}

CURRENT CV DATA (Source of Truth):
${JSON.stringify(cvData, null, 2)}

Generate an optimized CV in JSON format matching the exact structure above. Return ONLY the JSON object, no additional text.`
}
