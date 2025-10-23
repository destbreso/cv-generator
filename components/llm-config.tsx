"use client"

import { useState, useEffect } from "react"
import type { LLMConfig } from "@/lib/types"
import { saveLLMConfig, loadLLMConfig } from "@/lib/storage"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, TestTube, RefreshCw, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AvailableModel {
  name: string
  size: number
  modified: string
}

export function LLMConfigPanel() {
  const [config, setConfig] = useState<LLMConfig>({
    endpoint: "http://localhost:11434/api/generate",
    model: "llama2",
    apiKey: "",
  })
  const [testing, setTesting] = useState(false)
  const [loadingModels, setLoadingModels] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle")
  const [availableModels, setAvailableModels] = useState<AvailableModel[]>([])
  const [errorMessage, setErrorMessage] = useState<string>("")
  const { toast } = useToast()

  useEffect(() => {
    const loaded = loadLLMConfig()
    if (loaded) {
      setConfig(loaded)
    }
  }, [])

  const handleSave = () => {
    saveLLMConfig(config)
    toast({
      title: "> Config saved",
      description: "LLM configuration has been saved",
    })
  }

  const handleTest = async () => {
    setTesting(true)
    setConnectionStatus("idle")
    setErrorMessage("")

    try {
      const response = await fetch("/api/test-llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setConnectionStatus("success")
        toast({
          title: "> Connection successful",
          description: `Connected to ${data.model || config.model}`,
        })
        // Automatically load models after successful connection
        await loadModels()
      } else {
        setConnectionStatus("error")
        setErrorMessage(data.error || "Connection failed")
        toast({
          title: "> Connection failed",
          description: data.error || "Could not connect to LLM endpoint",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      setConnectionStatus("error")
      setErrorMessage(error.message || "Network error")
      toast({
        title: "> Connection error",
        description: "Failed to reach LLM endpoint. Is Ollama running?",
        variant: "destructive",
      })
    } finally {
      setTesting(false)
    }
  }

  const loadModels = async () => {
    setLoadingModels(true)
    try {
      const response = await fetch("/api/list-models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: config.endpoint }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setAvailableModels(data.models)
        toast({
          title: "> Models loaded",
          description: `Found ${data.models.length} available model(s)`,
        })
      } else {
        toast({
          title: "> Failed to load models",
          description: data.error || "Could not fetch available models",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "> Error loading models",
        description: "Failed to fetch model list",
        variant: "destructive",
      })
    } finally {
      setLoadingModels(false)
    }
  }

  const formatSize = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024)
    return `${gb.toFixed(1)} GB`
  }

  return (
    <Card className="p-6 space-y-4 bg-card border-border">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-primary text-lg">{">"} LLM Configuration</h3>
        {connectionStatus === "success" && (
          <div className="flex items-center gap-2 text-sm text-green-500">
            <CheckCircle2 className="h-4 w-4" />
            <span>Connected</span>
          </div>
        )}
        {connectionStatus === "error" && (
          <div className="flex items-center gap-2 text-sm text-red-500">
            <XCircle className="h-4 w-4" />
            <span>Disconnected</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="endpoint" className="text-foreground">
            API Endpoint
          </Label>
          <Input
            id="endpoint"
            placeholder="http://localhost:11434/api/generate"
            value={config.endpoint}
            onChange={(e) => setConfig((prev) => ({ ...prev, endpoint: e.target.value }))}
            className="bg-input border-border font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">Default: Ollama local endpoint</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="model" className="text-foreground">
              Model Name
            </Label>
            {connectionStatus === "success" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={loadModels}
                disabled={loadingModels}
                className="h-6 px-2 text-xs"
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${loadingModels ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            )}
          </div>

          {availableModels.length > 0 ? (
            <Select value={config.model} onValueChange={(value) => setConfig((prev) => ({ ...prev, model: value }))}>
              <SelectTrigger className="bg-input border-border font-mono text-sm">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {availableModels.map((model) => (
                  <SelectItem key={model.name} value={model.name} className="font-mono text-sm">
                    <div className="flex items-center justify-between w-full">
                      <span>{model.name}</span>
                      <span className="text-xs text-muted-foreground ml-4">{formatSize(model.size)}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="model"
              placeholder="llama2"
              value={config.model}
              onChange={(e) => setConfig((prev) => ({ ...prev, model: e.target.value }))}
              className="bg-input border-border font-mono text-sm"
            />
          )}
          <p className="text-xs text-muted-foreground">
            {availableModels.length > 0 ? "Select from available models" : "e.g., llama2, mistral, codellama"}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="apiKey" className="text-foreground">
            API Key (optional)
          </Label>
          <Input
            id="apiKey"
            type="password"
            placeholder="sk-..."
            value={config.apiKey || ""}
            onChange={(e) => setConfig((prev) => ({ ...prev, apiKey: e.target.value }))}
            className="bg-input border-border font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">Required for cloud APIs like OpenAI</p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive font-mono">{errorMessage}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Config
          </Button>
          <Button onClick={handleTest} variant="outline" className="gap-2 bg-transparent" disabled={testing}>
            {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <TestTube className="h-4 w-4" />}
            {testing ? "Testing..." : "Test Connection"}
          </Button>
        </div>
      </div>
    </Card>
  )
}
