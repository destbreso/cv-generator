import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { endpoint, model, apiKey } = await request.json()

    console.log("[cv-gen] Testing LLM connection:", { endpoint, model })

    const baseUrl = endpoint.replace(/\/api\/.*$/, "")
    const healthEndpoint = `${baseUrl}/api/tags`

    console.log("[cv-gen] Checking Ollama health at:", healthEndpoint)

    try {
      const healthResponse = await fetch(healthEndpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(5000),
      })

      console.log("[cv-gen] Health check response status:", healthResponse.status)

      if (!healthResponse.ok) {
        const errorText = await healthResponse.text()
        console.error("[cv-gen] Health check failed:", errorText)
        return NextResponse.json(
          {
            success: false,
            error: `Ollama health check failed: ${healthResponse.status} - ${errorText}`,
          },
          { status: healthResponse.status },
        )
      }

      const healthData = await healthResponse.json()
      console.log(
        "[cv-gen] Available models:",
        healthData.models?.map((m: any) => m.name),
      )

      console.log("[cv-gen] Testing generation with model:", model)

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }

      if (apiKey) {
        headers["Authorization"] = `Bearer ${apiKey}`
      }

      const genResponse = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model,
          prompt: "Say 'test' and nothing else.",
          stream: false,
        }),
        signal: AbortSignal.timeout(15000),
      })

      console.log("[cv-gen] Generation response status:", genResponse.status)

      if (genResponse.ok) {
        const data = await genResponse.json()
        console.log("[cv-gen] Generation successful")
        return NextResponse.json({
          success: true,
          message: "Connection successful - Ollama is responding",
          model: data.model || model,
        })
      } else {
        const errorText = await genResponse.text()
        console.error("[cv-gen] Generation failed:", errorText)
        return NextResponse.json(
          {
            success: false,
            error: `Generation test failed: ${genResponse.status} - ${errorText}`,
          },
          { status: genResponse.status },
        )
      }
    } catch (fetchError: any) {
      console.error("[cv-gen] Fetch error:", fetchError)

      if (fetchError.name === "TimeoutError" || fetchError.name === "AbortError") {
        return NextResponse.json(
          {
            success: false,
            error:
              "Connection timeout - Ollama might be slow or not responding. Check if Ollama is running on localhost:11434",
          },
          { status: 408 },
        )
      }

      if (fetchError.cause?.code === "ECONNREFUSED") {
        return NextResponse.json(
          {
            success: false,
            error:
              "Connection refused - Ollama is not accessible at the specified endpoint. Make sure Ollama is running.",
          },
          { status: 503 },
        )
      }

      throw fetchError
    }
  } catch (error: any) {
    console.error("[cv-gen] LLM test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: `Connection failed: ${error.message || String(error)}`,
        details: error.cause ? String(error.cause) : undefined,
      },
      { status: 500 },
    )
  }
}
