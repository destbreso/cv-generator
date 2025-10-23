import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { endpoint, model, apiKey } = await request.json()

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (apiKey) {
      headers["Authorization"] = `Bearer ${apiKey}`
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model,
          prompt: "Hello",
          stream: false,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        return NextResponse.json({
          success: true,
          message: "Connection successful",
          model: data.model || model,
        })
      } else {
        const errorText = await response.text()
        return NextResponse.json(
          {
            success: false,
            error: `HTTP ${response.status}: ${errorText}`,
          },
          { status: response.status },
        )
      }
    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      if (fetchError.name === "AbortError") {
        return NextResponse.json(
          {
            success: false,
            error: "Connection timeout - is Ollama running?",
          },
          { status: 408 },
        )
      }
      throw fetchError
    }
  } catch (error: any) {
    console.error("[v0] LLM test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Connection failed",
      },
      { status: 500 },
    )
  }
}
