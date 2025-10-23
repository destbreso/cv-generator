"use client"

import type { CVData, CVTemplate } from "@/lib/types"
import { exportAsHTML, exportAsMarkdown } from "@/lib/export-utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileCode, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ExportPanelProps {
  cvData: CVData
  template: CVTemplate
}

export function ExportPanel({ cvData, template }: ExportPanelProps) {
  const { toast } = useToast()

  const handleExportHTML = () => {
    exportAsHTML(cvData, template)
    toast({
      title: "> HTML exported",
      description: "CV has been downloaded as HTML file",
    })
  }

  const handleExportMarkdown = () => {
    exportAsMarkdown(cvData)
    toast({
      title: "> Markdown exported",
      description: "CV has been downloaded as Markdown file",
    })
  }

  return (
    <Card className="p-6 space-y-4 bg-card border-border">
      <div className="flex items-center gap-2">
        <Download className="h-5 w-5 text-primary" />
        <h3 className="font-bold text-primary text-lg">{">"} Export CV</h3>
      </div>

      <div className="space-y-3">
        <div className="p-4 bg-secondary/50 border border-border rounded space-y-2">
          <div className="flex items-center gap-2">
            <FileCode className="h-5 w-5 text-foreground" />
            <h4 className="font-bold text-foreground">HTML Format</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Export as a styled HTML file. Perfect for printing to PDF or viewing in a browser.
          </p>
          <Button onClick={handleExportHTML} className="w-full gap-2">
            <FileCode className="h-4 w-4" />
            Download HTML
          </Button>
        </div>

        <div className="p-4 bg-secondary/50 border border-border rounded space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-foreground" />
            <h4 className="font-bold text-foreground">Markdown Format</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Export as plain Markdown. Easy to edit and convert to other formats.
          </p>
          <Button onClick={handleExportMarkdown} variant="outline" className="w-full gap-2 bg-transparent">
            <FileText className="h-4 w-4" />
            Download Markdown
          </Button>
        </div>
      </div>

      <div className="p-3 bg-accent/10 border border-accent/20 rounded text-xs space-y-1">
        <p className="text-foreground">
          <span className="text-accent font-bold">{">"}</span> Tip: Open HTML files in your browser
        </p>
        <p className="text-muted-foreground">
          <span className="text-accent font-bold">{">"}</span> Use browser's Print function (Ctrl/Cmd + P) to save as
          PDF
        </p>
        <p className="text-muted-foreground">
          <span className="text-accent font-bold">{">"}</span> Markdown files can be edited in any text editor
        </p>
      </div>
    </Card>
  )
}
