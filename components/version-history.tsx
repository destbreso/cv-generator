"use client"

import { useState, useEffect } from "react"
import type { CVIteration, CVData } from "@/lib/types"
import { loadIterations, loadTemplates } from "@/lib/storage"
import { generateDiff } from "@/lib/diff-utils"
import { exportAsHTML, exportAsMarkdown } from "@/lib/export-utils"
import { DiffViewer } from "@/components/diff-viewer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GitCompare, Calendar, FileText, Download, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface VersionHistoryProps {
  onLoadIteration?: (cvData: CVData) => void
}

export function VersionHistory({ onLoadIteration }: VersionHistoryProps) {
  const [iterations, setIterations] = useState<CVIteration[]>([])
  const [selectedOld, setSelectedOld] = useState<string>("")
  const [selectedNew, setSelectedNew] = useState<string>("")
  const [showDiff, setShowDiff] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const loaded = loadIterations()
    setIterations(loaded.sort((a, b) => b.timestamp - a.timestamp))

    if (loaded.length >= 2) {
      setSelectedNew(loaded[0].id)
      setSelectedOld(loaded[1].id)
    }
  }, [])

  const handleCompare = () => {
    setShowDiff(true)
  }

  const handleExportIteration = (iteration: CVIteration, format: "html" | "md") => {
    const templates = loadTemplates()
    const template = templates.find((t) => t.id === iteration.templateId) || templates[0]

    if (format === "html") {
      exportAsHTML(iteration.cvData, template)
      toast({
        title: "> HTML exported",
        description: "Iteration exported as HTML",
      })
    } else {
      exportAsMarkdown(iteration.cvData)
      toast({
        title: "> Markdown exported",
        description: "Iteration exported as Markdown",
      })
    }
  }

  const handleLoadIntoEditor = (iteration: CVIteration) => {
    // Prefer generated structured data if available, otherwise use original
    const dataToLoad = iteration.generatedCVData || iteration.cvData

    if (onLoadIteration) {
      onLoadIteration(dataToLoad)
      toast({
        title: "> Loaded into editor",
        description: "Iteration data loaded. You can now edit and refine it.",
      })
    }
  }

  const oldIteration = iterations.find((i) => i.id === selectedOld)
  const newIteration = iterations.find((i) => i.id === selectedNew)

  const diffSections = oldIteration && newIteration ? generateDiff(oldIteration.cvData, newIteration.cvData) : []

  if (iterations.length === 0) {
    return (
      <Card className="p-12 text-center bg-card border-border">
        <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-bold text-foreground mb-2">No iterations yet</h3>
        <p className="text-muted-foreground">Generate your first CV to start tracking versions</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card border-border">
        <h3 className="font-bold text-primary text-lg mb-4">{">"} Compare Versions</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Previous Version</label>
            <Select value={selectedOld} onValueChange={setSelectedOld}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="Select version" />
              </SelectTrigger>
              <SelectContent>
                {iterations.map((iteration) => (
                  <SelectItem key={iteration.id} value={iteration.id}>
                    {new Date(iteration.timestamp).toLocaleString()} - {iteration.context.slice(0, 30)}...
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Current Version</label>
            <Select value={selectedNew} onValueChange={setSelectedNew}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="Select version" />
              </SelectTrigger>
              <SelectContent>
                {iterations.map((iteration) => (
                  <SelectItem key={iteration.id} value={iteration.id}>
                    {new Date(iteration.timestamp).toLocaleString()} - {iteration.context.slice(0, 30)}...
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleCompare} disabled={!selectedOld || !selectedNew} className="w-full gap-2">
          <GitCompare className="h-4 w-4" />
          Compare Versions
        </Button>
      </Card>

      {showDiff && oldIteration && newIteration && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 bg-destructive/5 border-destructive/20">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-destructive" />
                <span className="font-bold text-sm text-destructive">Previous Version</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{new Date(oldIteration.timestamp).toLocaleString()}</p>
              <p className="text-sm font-mono">{oldIteration.context}</p>
            </Card>

            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="font-bold text-sm text-primary">Current Version</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{new Date(newIteration.timestamp).toLocaleString()}</p>
              <p className="text-sm font-mono">{newIteration.context}</p>
            </Card>
          </div>

          <div>
            <h3 className="font-bold text-foreground text-lg mb-4">{">"} Changes</h3>
            <DiffViewer sections={diffSections} />
          </div>
        </div>
      )}

      <Card className="p-6 bg-card border-border">
        <h3 className="font-bold text-primary text-lg mb-4">{">"} All Iterations</h3>
        <div className="space-y-2">
          {iterations.map((iteration) => (
            <div
              key={iteration.id}
              className="p-3 border border-border rounded hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-foreground">
                  {new Date(iteration.timestamp).toLocaleString()}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleLoadIntoEditor(iteration)}
                    className="h-8 gap-1 bg-primary/10 hover:bg-primary/20 border-primary/30"
                  >
                    <Upload className="h-3 w-3" />
                    Load
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleExportIteration(iteration, "html")}
                    className="h-8 gap-1"
                  >
                    <Download className="h-3 w-3" />
                    HTML
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleExportIteration(iteration, "md")}
                    className="h-8 gap-1"
                  >
                    <Download className="h-3 w-3" />
                    MD
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-1">
                Template: {iteration.templateId}
                {iteration.generatedCVData && <span className="ml-2 text-primary">• Structured data available</span>}
              </p>
              <p className="text-sm text-muted-foreground font-mono">{iteration.context}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
