"use client"

import { useState, useEffect } from "react"
import type { CVTemplate, TemplateCustomization } from "@/lib/types"
import {
  loadTemplates,
  saveCurrentTemplate,
  loadCurrentTemplate,
  addTemplate,
  saveTemplateCustomization,
  loadTemplateCustomization,
  getDefaultColorPalettes,
} from "@/lib/storage"
import { renderTemplate } from "@/lib/template-renderer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { TemplateCustomizer } from "./template-customizer"

interface TemplateGalleryProps {
  onTemplateSelect: (template: CVTemplate) => void
}

const sampleData = {
  personalInfo: {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    website: "https://johndoe.com",
    linkedin: "https://linkedin.com/in/johndoe",
    github: "https://github.com/johndoe",
  },
  summary:
    "Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies.",
  experience: [
    {
      id: "1",
      company: "Tech Corp",
      position: "Senior Software Engineer",
      startDate: "Jan 2020",
      endDate: "Present",
      description: "Leading development of cloud-based applications",
      achievements: ["Improved performance by 40%", "Led team of 5 developers"],
    },
  ],
  education: [
    {
      id: "1",
      institution: "University of Technology",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "2014",
      endDate: "2018",
    },
  ],
  skills: [
    { id: "1", category: "Languages", items: ["JavaScript", "TypeScript", "Python"] },
    { id: "2", category: "Frameworks", items: ["React", "Node.js", "Next.js"] },
  ],
  projects: [
    {
      id: "1",
      name: "E-commerce Platform",
      description: "Built a scalable e-commerce solution",
      technologies: ["React", "Node.js", "PostgreSQL"],
    },
  ],
  certifications: [],
}

export function TemplateGallery({ onTemplateSelect }: TemplateGalleryProps) {
  const [templates, setTemplates] = useState<CVTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate | null>(null)
  const [customization, setCustomization] = useState<TemplateCustomization | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loaded = loadTemplates()
    setTemplates(loaded)

    const currentId = loadCurrentTemplate()
    if (currentId) {
      const template = loaded.find((t) => t.id === currentId)
      if (template) {
        setSelectedTemplate(template)
        loadCustomizationForTemplate(template)
        onTemplateSelect(template)
      }
    } else if (loaded.length > 0) {
      setSelectedTemplate(loaded[0])
      loadCustomizationForTemplate(loaded[0])
      onTemplateSelect(loaded[0])
    }
  }, [])

  const loadCustomizationForTemplate = (template: CVTemplate) => {
    const saved = loadTemplateCustomization(template.id)
    if (saved) {
      setCustomization(saved)
    } else {
      // Create default customization
      const defaultPalette = getDefaultColorPalettes()[0]
      const defaultCustomization: TemplateCustomization = {
        templateId: template.id,
        colorPalette: defaultPalette,
        fontFamily: "Inter, sans-serif",
        fontSize: { base: 14, heading: 28 },
        spacing: { section: 32, item: 12 },
      }
      setCustomization(defaultCustomization)
    }
  }

  const handleSelect = (template: CVTemplate) => {
    setSelectedTemplate(template)
    saveCurrentTemplate(template.id)
    loadCustomizationForTemplate(template)
    onTemplateSelect(template)
    toast({
      title: "> Template selected",
      description: `Using ${template.name} template`,
    })
  }

  const handleCustomizationChange = (newCustomization: TemplateCustomization) => {
    setCustomization(newCustomization)
    saveTemplateCustomization(newCustomization)
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

  const previewHtml =
    selectedTemplate && customization ? renderTemplate(selectedTemplate, sampleData, customization) : ""

  return (
    <div className="grid grid-cols-12 gap-4 h-full">
      {/* Template Selection - Left */}
      <div className="col-span-3 space-y-4 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">{">"} Templates</h2>
          <Button onClick={handleUpload} variant="outline" size="sm" className="gap-2 bg-transparent">
            <Upload className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={`p-3 cursor-pointer transition-all hover:border-primary ${
                selectedTemplate?.id === template.id ? "border-primary bg-primary/10" : "border-border"
              }`}
              onClick={() => handleSelect(template)}
            >
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-bold text-sm text-foreground">{template.name}</h3>
                {selectedTemplate?.id === template.id && <Check className="h-4 w-4 text-primary" />}
              </div>
              <p className="text-xs text-muted-foreground">{template.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Preview - Center */}
      <div className="col-span-6 overflow-y-auto">
        <h2 className="text-lg font-bold text-foreground mb-4">{">"} Preview</h2>
        <Card className="p-6 bg-card border-border">
          {previewHtml ? (
            <div
              className="cv-preview"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
              style={{ minHeight: "600px" }}
            />
          ) : (
            <div className="text-center text-muted-foreground py-12">Select a template to preview</div>
          )}
        </Card>
      </div>

      {/* Customization - Right */}
      <div className="col-span-3 overflow-y-auto">
        <h2 className="text-lg font-bold text-foreground mb-4">{">"} Customize</h2>
        {customization && selectedTemplate ? (
          <TemplateCustomizer customization={customization} onChange={handleCustomizationChange} />
        ) : (
          <div className="text-sm text-muted-foreground">Select a template to customize</div>
        )}
      </div>
    </div>
  )
}
