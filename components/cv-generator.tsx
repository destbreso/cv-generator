"use client"

import { useState } from "react"
import type { CVData } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Sparkles, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { saveIteration } from "@/lib/storage"

interface CVGeneratorProps {
  cvData: CVData
  templateId: string
  onGenerated: (content: string, generatedCVData?: CVData) => void
}

export function CVGenerator({ cvData, templateId, onGenerated }: CVGeneratorProps) {
  const [context, setContext] = useState("")
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState("")
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!context.trim()) {
      toast({
        title: "> Context required",
        description: "Please provide context for CV generation",
        variant: "destructive",
      })
      return
    }

    const savedConfig = localStorage.getItem("llm-config")
    if (!savedConfig) {
      toast({
        title: "> LLM not configured",
        description: "Please configure your LLM connection first",
        variant: "destructive",
      })
      return
    }

    setGenerating(true)
    setProgress("Connecting to LLM...")

    try {
      const response = await fetch("/api/generate-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvData,
          context,
          llmConfig: JSON.parse(savedConfig),
        }),
      })

      if (!response.ok) {
        throw new Error("Generation failed")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let generatedContent = ""

      if (reader) {
        setProgress("Generating CV content...")

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6)
              if (data === "[DONE]") {
                break
              }
              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  generatedContent += parsed.content
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      let generatedCVData: CVData | undefined
      try {
        // Try to parse the generated content as JSON
        const parsed = JSON.parse(generatedContent)
        // Validate it has the expected structure
        if (parsed.personalInfo && parsed.summary && parsed.experience) {
          generatedCVData = parsed as CVData
          console.log("[cv-gen] Successfully parsed generated CV data")
        }
      } catch (e) {
        console.warn("[cv-gen] Could not parse generated content as CVData:", e)
      }

      // Save iteration with structured data
      const iteration = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        cvData,
        context,
        templateId,
        generatedContent,
        generatedCVData, // Save structured data
      }
      saveIteration(iteration)

      onGenerated(generatedContent, generatedCVData)

      toast({
        title: "> CV generated",
        description: generatedCVData
          ? "Your CV has been optimized and structured data extracted"
          : "Your CV has been optimized by AI",
      })
    } catch (error) {
      console.error("[cv-gen] Generation error:", error)
      toast({
        title: "> Generation failed",
        description: "Could not generate CV. Check your LLM configuration.",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
      setProgress("")
    }
  }

  return (
    <Card className="p-6 space-y-4 bg-card border-border">
      <h3 className="font-bold text-primary text-lg">{">"} Generate with AI</h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="context" className="text-foreground">
            Job Context
          </Label>
          <Textarea
            id="context"
            placeholder="Describe the job role, company, or focus for this CV...&#10;&#10;Example:&#10;- Senior Software Engineer position at a fintech startup&#10;- Focus on backend development and cloud architecture&#10;- Emphasize leadership and mentoring experience"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={8}
            className="bg-input border-border font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Provide details about the target role to optimize your CV content
          </p>
        </div>

        <Button onClick={handleGenerate} disabled={generating} className="w-full gap-2">
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {progress}
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Optimized CV
            </>
          )}
        </Button>

        <div className="p-3 bg-secondary/50 border border-border rounded text-xs space-y-1">
          <p className="text-muted-foreground">
            <span className="text-primary font-bold">{">"}</span> The AI uses your CV metadata as the source of truth
          </p>
          <p className="text-muted-foreground">
            <span className="text-primary font-bold">{">"}</span> Job context guides optimization and emphasis
          </p>
          <p className="text-muted-foreground">
            <span className="text-primary font-bold">{">"}</span> Generated CV maintains the same JSON structure
          </p>
          <p className="text-muted-foreground">
            <span className="text-primary font-bold">{">"}</span> Results can be loaded back into the editor for
            refinement
          </p>
        </div>
      </div>
    </Card>
  )
}
