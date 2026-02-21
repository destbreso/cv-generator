import { type NextRequest, NextResponse } from "next/server"
import { parseLLMError } from "@/lib/llm-errors"

export async function POST(request: NextRequest) {
  try {
    const { provider, baseUrl, apiKey } = await request.json()

    if (!baseUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Base URL is required",
        },
        { status: 400 },
      )
    }

    let modelsEndpoint: string
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    switch (provider) {
      case "ollama":
        // Ollama: fetch from /api/tags
        const cleanBaseUrl = baseUrl.replace(/\/+$/, "").replace(/\/api.*$/, "")
        modelsEndpoint = `${cleanBaseUrl}/api/tags`
        break

      case "openai":
        // OpenAI: fetch from /v1/models
        modelsEndpoint = "https://api.openai.com/v1/models"
        if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`
        break

      case "groq":
        // Groq: fetch from base URL /models
        modelsEndpoint = `${baseUrl.replace(/\/+$/, "")}/models`
        if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`
        break

      case "gemini":
        // Google Gemini: OpenAI-compatible endpoint
        modelsEndpoint = `${baseUrl.replace(/\/+$/, "")}/models`
        if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`
        break

      case "mistral":
        // Mistral: OpenAI-compatible /models
        modelsEndpoint = `${baseUrl.replace(/\/+$/, "")}/models`
        if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`
        break

      case "deepseek":
        // DeepSeek: OpenAI-compatible /models
        modelsEndpoint = `${baseUrl.replace(/\/+$/, "")}/models`
        if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`
        break

      case "anthropic":
        // Anthropic: no standard models list endpoint, return hardcoded models
        return NextResponse.json({
          success: true,
          models: [
            { name: "claude-opus-4-1", size: null, modified: null },
            { name: "claude-sonnet-4-20250514", size: null, modified: null },
            { name: "claude-haiku-3-5", size: null, modified: null },
            { name: "claude-3-5-sonnet-20241022", size: null, modified: null },
          ],
        })

      case "custom":
        // Custom: try to fetch from /models or /v1/models
        modelsEndpoint = `${baseUrl.replace(/\/+$/, "")}/models`
        if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`
        break

      default:
        // Default to Ollama for backward compatibility
        const cleanUrl = baseUrl.replace(/\/+$/, "").replace(/\/api.*$/, "")
        modelsEndpoint = `${cleanUrl}/api/tags`
    }

    console.log("[cv-gen] Fetching models from:", modelsEndpoint)

    const response = await fetch(modelsEndpoint, {
      method: "GET",
      headers,
      signal: AbortSignal.timeout(5000),
    })

    console.log("[cv-gen] Models response status:", response.status)

    if (response.ok) {
      const data = await response.json()

      // Parse different response formats based on provider
      let models: any[] = []

      if (provider === "openai") {
        // OpenAI returns { data: [...] }
        models = (data.data || []).map((m: any) => ({
          name: m.id,
          size: null,
          modified: m.created,
        }))
      } else if (provider === "groq" || provider === "gemini" || provider === "mistral" || provider === "deepseek") {
        // OpenAI-compatible providers return { data: [...] }
        models = (data.data || []).map((m: any) => ({
          name: m.id,
          size: null,
          modified: m.created,
        }))
      } else if (provider === "custom") {
        // Custom might return { data: [...] } or { models: [...] } or just [...]
        if (Array.isArray(data)) {
          models = data
        } else if (data.data) {
          models = data.data
        } else if (data.models) {
          models = data.models
        }
        // Normalize to have 'name' field
        models = models.map((m: any) => ({
          name: typeof m === "string" ? m : m.id || m.name,
          size: m.size || null,
          modified: m.modified || m.created || null,
        }))
      } else {
        // Ollama returns { models: [...] }
        models = (data.models || []).map((m: any) => ({
          name: m.name,
          size: m.size,
          modified: m.modified_at,
        }))
      }

      console.log(
        "[cv-gen] Found models:",
        models.map((m: any) => m.name),
      )

      return NextResponse.json({
        success: true,
        models,
      })
    } else {
      const errorText = await response.text()
      console.error("[cv-gen] Failed to fetch models:", errorText)
      const friendlyError = parseLLMError(response.status, errorText, provider)
      return NextResponse.json(
        {
          success: false,
          error: friendlyError,
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
          error: "Connection timed out. Make sure the provider is running and reachable.",
        },
        { status: 408 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to load models",
      },
      { status: 500 },
    )
  }
}
