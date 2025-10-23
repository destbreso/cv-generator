"use client"

import { useEffect, useRef } from "react"
import type { CVData, CVTemplate } from "@/lib/types"
import { renderTemplate } from "@/lib/template-renderer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CVPreviewProps {
  cvData: CVData
  template: CVTemplate
  generatedContent?: string
}

export function CVPreview({ cvData, template, generatedContent }: CVPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (previewRef.current) {
      const html = renderTemplate(template, cvData)
      previewRef.current.innerHTML = html
    }
  }, [cvData, template, generatedContent])

  const handleExportPDF = () => {
    if (!previewRef.current) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const html = renderTemplate(template, cvData)
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>CV - ${cvData.personalInfo.name}</title>
          <style>
            body { font-family: monospace; padding: 20px; }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>${html}</body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()

    toast({
      title: "> PDF export ready",
      description: "Use the print dialog to save as PDF",
    })
  }

  const handleExportHTML = () => {
    const html = renderTemplate(template, cvData)
    const fullHTML = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>CV - ${cvData.personalInfo.name}</title>
    <style>
      body { font-family: monospace; padding: 20px; max-width: 800px; margin: 0 auto; }
    </style>
  </head>
  <body>${html}</body>
</html>
    `
    const blob = new Blob([fullHTML], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `cv-${cvData.personalInfo.name.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.html`
    link.click()
    URL.revokeObjectURL(url)

    toast({
      title: "> HTML exported",
      description: "CV exported successfully",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">{">"} CV Preview</h2>
        <div className="flex gap-2">
          <Button onClick={handleExportHTML} variant="outline" size="sm" className="gap-2 bg-transparent">
            <FileText className="h-4 w-4" />
            Export HTML
          </Button>
          <Button onClick={handleExportPDF} variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

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
