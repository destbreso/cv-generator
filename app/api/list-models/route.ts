import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { endpoint } = await request.json()

    const baseUrl = endpoint.replace(/\/api\/.*$/, "")
    const modelsEndpoint = `${baseUrl}/api/tags`

    const response = await fetch(modelsEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const data = await response.json()
      // Ollama returns models in { models: [...] } format
      const models = data.models || []
      return NextResponse.json({
        success: true,
        models: models.map((m: any) => ({
          name: m.name,
          size: m.size,
          modified: m.modified_at,
        })),
      })
    } else {
      return NextResponse.json({ success: false, error: "Failed to fetch models" }, { status: 500 })
    }
  } catch (error) {
    console.error("[v0] List models error:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
