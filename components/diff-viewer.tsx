"use client"

import type { DiffSection } from "@/lib/diff-utils"
import { formatFieldName } from "@/lib/diff-utils"
import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"

interface DiffViewerProps {
  sections: DiffSection[]
}

export function DiffViewer({ sections }: DiffViewerProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(sections.map((s) => s.field)))

  const toggleSection = (field: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(field)) {
        next.delete(field)
      } else {
        next.add(field)
      }
      return next
    })
  }

  if (sections.length === 0) {
    return (
      <Card className="p-8 text-center bg-card border-border">
        <p className="text-muted-foreground">No differences found between versions</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {sections.map((section, idx) => {
        const isExpanded = expandedSections.has(section.field)
        const hasChanges = section.lines.some((line) => line.type !== "unchanged")

        if (!hasChanges) return null

        return (
          <Card key={idx} className="overflow-hidden bg-card border-border">
            <button
              onClick={() => toggleSection(section.field)}
              className="w-full px-4 py-3 flex items-center justify-between bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <div className="flex items-center gap-2">
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <span className="font-mono text-sm font-bold text-primary">{formatFieldName(section.field)}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {section.lines.filter((l) => l.type === "added").length} additions,{" "}
                {section.lines.filter((l) => l.type === "removed").length} deletions
              </span>
            </button>

            {isExpanded && (
              <div className="font-mono text-xs">
                {section.lines.map((line, lineIdx) => {
                  if (line.type === "unchanged") {
                    return (
                      <div key={lineIdx} className="px-4 py-1 bg-card text-muted-foreground flex">
                        <span className="w-12 text-right pr-4 select-none">{line.lineNumber}</span>
                        <span className="flex-1">{line.content}</span>
                      </div>
                    )
                  }

                  if (line.type === "removed") {
                    return (
                      <div key={lineIdx} className="px-4 py-1 bg-destructive/10 text-destructive flex">
                        <span className="w-12 text-right pr-4 select-none">-</span>
                        <span className="flex-1">
                          <span className="select-none">- </span>
                          {line.content}
                        </span>
                      </div>
                    )
                  }

                  if (line.type === "added") {
                    return (
                      <div key={lineIdx} className="px-4 py-1 bg-primary/10 text-primary flex">
                        <span className="w-12 text-right pr-4 select-none">+</span>
                        <span className="flex-1">
                          <span className="select-none">+ </span>
                          {line.content}
                        </span>
                      </div>
                    )
                  }

                  return null
                })}
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}
