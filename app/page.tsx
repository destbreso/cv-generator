"use client"

import { useState } from "react"
import type { CVData, CVTemplate } from "@/lib/types"
import { TerminalHeader } from "@/components/terminal-header"
import { CVEditor } from "@/components/cv-editor"
import { TemplateGallery } from "@/components/template-gallery"
import { CVPreview } from "@/components/cv-preview"
import { LLMConfigPanel } from "@/components/llm-config"
import { CVGenerator } from "@/components/cv-generator"
import { VersionHistory } from "@/components/version-history"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, History, Settings, FileText } from "lucide-react"
import { loadTemplates } from "@/lib/storage"

export default function Home() {
  const [cvData, setCVData] = useState<CVData | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate>(loadTemplates()[0])
  const [generatedContent, setGeneratedContent] = useState<string>("")

  return (
    <div className="min-h-screen bg-background">
      <TerminalHeader />

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="editor" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-muted">
            <TabsTrigger value="editor" className="gap-2">
              <FileText className="h-4 w-4" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-2">
              <Settings className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="generate" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CVEditor onDataChange={setCVData} />
              {cvData && <CVPreview cvData={cvData} template={selectedTemplate} />}
            </div>
          </TabsContent>

          <TabsContent value="templates">
            <TemplateGallery onTemplateSelect={setSelectedTemplate} />
            {cvData && (
              <div className="mt-6">
                <CVPreview cvData={cvData} template={selectedTemplate} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <LLMConfigPanel />
                {cvData && (
                  <CVGenerator cvData={cvData} templateId={selectedTemplate.id} onGenerated={setGeneratedContent} />
                )}
              </div>
              <div>
                {generatedContent && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-primary text-lg">{">"} Generated Content</h3>
                    <div className="p-4 bg-card border border-border rounded font-mono text-sm whitespace-pre-wrap max-h-[600px] overflow-auto">
                      {generatedContent}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <VersionHistory />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
