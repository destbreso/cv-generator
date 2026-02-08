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

    // Clean the base URL and construct the tags endpoint
    const cleanBaseUrl = baseUrl.replace(/\/+$/, "").replace(/\/api.*$/, "")
    const modelsEndpoint = `${cleanBaseUrl}/api/tags`

    console.log("[cv-gen] Fetching models from:", modelsEndpoint)

    const response = await fetch(modelsEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(5000),
    })

    console.log("[cv-gen] Models response status:", response.status)

    if (response.ok) {
      const data = await response.json()
      const models = data.models || []

      console.log(
        "[cv-gen] Found models:",
        models.map((m: any) => m.name),
      )

      return NextResponse.json({
        success: true,
        models: models.map((m: any) => ({
          name: m.name,
          size: m.size,
          modified: m.modified_at,
        })),
      })
    } else {
      const errorText = await response.text()
      console.error("[cv-gen] Failed to fetch models:", errorText)
      return NextResponse.json(
        {
          success: false,
          error: `Failed to fetch models: ${response.status}`,
          details: errorText,
        },
        { status: response.status },
      )
    }
  } catch (error: any) {
    console.error("[cv-gen] List models error:", error)

    if (error.name === "TimeoutError" || error.name === "AbortError") {
      return NextResponse.json(
        {
          success: false,
          error: "Timeout fetching models",
          details: "Ollama is not responding",
        },
        { status: 408 },
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
