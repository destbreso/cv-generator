import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { baseUrl } = await request.json()

    if (!baseUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Base URL is required",
        },
        { status: 400 },
      )
    }

    // Clean the base URL (remove trailing slashes and paths)
    const cleanBaseUrl = baseUrl.replace(/\/+$/, "").replace(/\/api.*$/, "")
    const healthEndpoint = `${cleanBaseUrl}/api/tags`

    console.log("[cv-gen] Testing Ollama connection at:", healthEndpoint)

    const response = await fetch(healthEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(5000),
    })

    console.log("[cv-gen] Ollama response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[cv-gen] Ollama connection failed:", errorText)
      return NextResponse.json(
        {
          success: false,
          error: `Ollama not responding: ${response.status}`,
          details: errorText,
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    const modelCount = data.models?.length || 0

    console.log("[cv-gen] Ollama is alive! Found", modelCount, "models")

    return NextResponse.json({
      success: true,
      message: `Ollama is running with ${modelCount} model(s) available`,
      modelCount,
    })
  } catch (error: any) {
    console.error("[cv-gen] Ollama test error:", error)

    if (error.name === "TimeoutError" || error.name === "AbortError") {
      return NextResponse.json(
        {
          success: false,
          error: "Connection timeout",
          details: "Ollama is not responding. Make sure it's running on the specified URL.",
        },
        { status: 408 },
      )
    }

    if (error.cause?.code === "ECONNREFUSED") {
      return NextResponse.json(
        {
          success: false,
          error: "Connection refused",
          details: "Cannot connect to Ollama. Verify the URL and that Ollama is running.",
        },
        { status: 503 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unknown error",
        details: String(error),
      },
      { status: 500 },
    )
  }
}
