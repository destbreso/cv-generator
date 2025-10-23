"use client"

import { useState, useEffect } from "react"
import type { CVTemplate } from "@/lib/types"
import { loadTemplates, saveCurrentTemplate, loadCurrentTemplate, addTemplate } from "@/lib/storage"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TemplateGalleryProps {
  onTemplateSelect: (template: CVTemplate) => void
}

export function TemplateGallery({ onTemplateSelect }: TemplateGalleryProps) {
  const [templates, setTemplates] = useState<CVTemplate[]>([])
  const [selectedId, setSelectedId] = useState<string>("")
  const { toast } = useToast()

  useEffect(() => {
    const loaded = loadTemplates()
    setTemplates(loaded)

    const currentId = loadCurrentTemplate()
    if (currentId) {
      setSelectedId(currentId)
      const template = loaded.find((t) => t.id === currentId)
      if (template) {
        onTemplateSelect(template)
      }
    } else if (loaded.length > 0) {
      setSelectedId(loaded[0].id)
      onTemplateSelect(loaded[0])
    }
  }, [])

  const handleSelect = (template: CVTemplate) => {
    setSelectedId(template.id)
    saveCurrentTemplate(template.id)
    onTemplateSelect(template)
    toast({
      title: "> Template selected",
      description: `Using ${template.name} template`,
    })
  }

  const handleUpload = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".html,.txt"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const content = event.target?.result as string
          const newTemplate: CVTemplate = {
            id: `custom-${Date.now()}`,
            name: file.name.replace(/\.[^/.]+$/, ""),
            description: "Custom uploaded template",
            content,
          }
          addTemplate(newTemplate)
          setTemplates((prev) => [...prev, newTemplate])
          toast({
            title: "> Template uploaded",
            description: "Custom template added to gallery",
          })
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">{">"} Template Gallery</h2>
        <Button onClick={handleUpload} variant="outline" size="sm" className="gap-2 bg-transparent">
          <Upload className="h-4 w-4" />
          Upload
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`p-4 cursor-pointer transition-all hover:border-primary ${
              selectedId === template.id ? "border-primary bg-primary/10" : "border-border"
            }`}
            onClick={() => handleSelect(template)}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-foreground">{template.name}</h3>
              {selectedId === template.id && <Check className="h-5 w-5 text-primary" />}
            </div>
            <p className="text-sm text-muted-foreground">{template.description}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
