"use client"

import { useEffect, useRef } from "react"
import type { CVData, CVTemplate } from "@/lib/types"
import { renderTemplate } from "@/lib/template-renderer"
import { Card } from "@/components/ui/card"
import { ExportPanel } from "@/components/export-panel"

interface CVPreviewProps {
  cvData: CVData
  template: CVTemplate
}

export function CVPreview({ cvData, template }: CVPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (previewRef.current) {
      const html = renderTemplate(template, cvData)
      previewRef.current.innerHTML = html
    }
  }, [cvData, template])

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">{">"} Preview</h2>

      <ExportPanel cvData={cvData} template={template} />

      <Card className="p-6 bg-card border-border overflow-auto max-h-[800px]">
        <div
          ref={previewRef}
          className="cv-preview prose prose-sm max-w-none"
          style={{
            fontFamily: "var(--font-mono)",
          }}
        />
      </Card>
    </div>
  )
}
