import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { provider, baseUrl, apiKey } = await request.json();

    if (!baseUrl) {
      return Response.json(
        { success: false, error: "Base URL is required" },
        { status: 400 },
      );
    }

    let testUrl: string;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    switch (provider) {
      case "ollama":
        testUrl = `${baseUrl}/api/tags`;
        break;
      case "openai":
      case "groq":
      case "gemini":
      case "mistral":
      case "deepseek":
      case "custom":
        testUrl = `${baseUrl}/models`;
        if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
        break;
      case "anthropic":
        // Anthropic doesn't have a models endpoint, just test with a minimal request
        testUrl = `${baseUrl}/messages`;
        if (apiKey) {
          headers["x-api-key"] = apiKey;
          headers["anthropic-version"] = "2023-06-01";
        }
        // For Anthropic, we'll do a different kind of test
        try {
          const response = await fetch(testUrl, {
            method: "POST",
            headers,
            body: JSON.stringify({
              model: "claude-sonnet-4-20250514",
              max_tokens: 1,
              messages: [{ role: "user", content: "test" }],
            }),
            signal: AbortSignal.timeout(10000),
          });
          // Even a 400 means we can reach the API
          return Response.json({
            success: response.status !== 401 && response.status !== 403,
            message: response.ok
              ? "Connected to Anthropic"
              : `Status: ${response.status}`,
          });
        } catch (error: any) {
          return Response.json({
            success: false,
            error: "Cannot reach Anthropic API",
            details: error.message,
          });
        }
      default:
        testUrl = `${baseUrl}/api/tags`;
    }

    const response = await fetch(testUrl, {
      method: "GET",
      headers,
      signal: AbortSignal.timeout(10000),
    });

    if (response.ok) {
      return Response.json({
        success: true,
        message: `Connected to ${provider || "API"}`,
      });
    } else {
      return Response.json({
        success: false,
        error: `Connection failed with status ${response.status}`,
      });
    }
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        error: "Connection failed",
        details: error.message || "Could not reach the API",
      },
      { status: 500 },
    );
  }
}
