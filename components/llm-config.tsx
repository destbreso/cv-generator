"use client";

import { useState, useEffect } from "react";
import type { LLMConfig } from "@/lib/types";
import { apiPath } from "@/lib/api";
import {
  saveLLMConfig,
  loadLLMConfig,
  DEFAULT_SYSTEM_PROMPT,
} from "@/lib/storage";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Save,
  TestTube,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  Info,
  RotateCcw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AvailableModel {
  name: string;
  size: number;
  modified: string;
}

export function LLMConfigPanel() {
  const [config, setConfig] = useState<LLMConfig>({
    baseUrl: "http://localhost:11434",
    model: "llama2",
    apiKey: "",
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
  });
  const [testing, setTesting] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [availableModels, setAvailableModels] = useState<AvailableModel[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errorDetails, setErrorDetails] = useState<string>("");
  const [showEndpoints, setShowEndpoints] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loaded = loadLLMConfig();
    if (loaded) {
      setConfig({
        ...loaded,
        apiKey: loaded.apiKey || "",
        systemPrompt: loaded.systemPrompt || DEFAULT_SYSTEM_PROMPT,
      });
    }
  }, []);

  const handleSave = () => {
    saveLLMConfig(config);
    toast({
      title: "> Config saved",
      description: "LLM configuration has been saved",
    });
  };

  const handleTest = async () => {
    if (!config.baseUrl || config.baseUrl.trim() === "") {
      toast({
        title: "> Base URL required",
        description: "Please enter a valid Ollama base URL",
        variant: "destructive",
      });
      return;
    }

    setTesting(true);
    setConnectionStatus("idle");
    setErrorMessage("");
    setErrorDetails("");

    try {
      const response = await fetch(apiPath("/api/test-ollama"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl: config.baseUrl }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setConnectionStatus("success");
        toast({
          title: "> Connection successful",
          description: data.message,
        });
        await loadModels();
      } else {
        setConnectionStatus("error");
        setErrorMessage(data.error || "Connection failed");
        setErrorDetails(data.details || "");
        toast({
          title: "> Connection failed",
          description: data.error || "Could not connect to Ollama",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      setConnectionStatus("error");
      setErrorMessage("Network error");
      setErrorDetails(error.message || "Failed to reach the API");
      toast({
        title: "> Connection error",
        description: "Failed to test connection",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  const loadModels = async () => {
    setLoadingModels(true);
    try {
      const response = await fetch(apiPath("/api/list-models"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl: config.baseUrl }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAvailableModels(data.models);
        toast({
          title: "> Models loaded",
          description: `Found ${data.models.length} available model(s)`,
        });
      } else {
        toast({
          title: "> Failed to load models",
          description: data.error || "Could not fetch available models",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "> Error loading models",
        description: "Failed to fetch model list",
        variant: "destructive",
      });
    } finally {
      setLoadingModels(false);
    }
  };

  const formatSize = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(1)} GB`;
  };

  const endpoints = {
    health: `${config.baseUrl || "http://localhost:11434"}/api/tags`,
    generate: `${config.baseUrl || "http://localhost:11434"}/api/generate`,
    chat: `${config.baseUrl || "http://localhost:11434"}/api/chat`,
  };

  const resetSystemPrompt = () => {
    setConfig((prev) => ({ ...prev, systemPrompt: DEFAULT_SYSTEM_PROMPT }));
    toast({
      title: "> Prompt reset",
      description: "System prompt has been reset to default",
    });
  };

  return (
    <Card className="p-6 space-y-4 bg-card border-border">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-primary text-lg">
          {">"} LLM Configuration
        </h3>
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
          <Label htmlFor="baseUrl" className="text-foreground">
            Ollama Base URL
          </Label>
          <Input
            id="baseUrl"
            placeholder="http://localhost:11434"
            value={config.baseUrl}
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, baseUrl: e.target.value }))
            }
            className="bg-input border-border font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Base URL without path (e.g., http://localhost:11434)
          </p>
        </div>

        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEndpoints(!showEndpoints)}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <Info className="h-3 w-3 mr-1" />
            {showEndpoints ? "Hide" : "Show"} Ollama Endpoints
          </Button>

          {showEndpoints && (
            <div className="p-3 rounded-lg bg-muted/30 border border-border space-y-1.5">
              <div className="text-xs space-y-1">
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground min-w-[80px]">
                    Health:
                  </span>
                  <code className="text-primary font-mono">
                    {endpoints.health}
                  </code>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground min-w-[80px]">
                    Generate:
                  </span>
                  <code className="text-primary font-mono">
                    {endpoints.generate}
                  </code>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground min-w-[80px]">
                    Chat:
                  </span>
                  <code className="text-primary font-mono">
                    {endpoints.chat}
                  </code>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="model" className="text-foreground">
              Model Name
            </Label>
            {connectionStatus === "success" && availableModels.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={loadModels}
                disabled={loadingModels}
                className="h-6 px-2 text-xs"
              >
                <RefreshCw
                  className={`h-3 w-3 mr-1 ${loadingModels ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            )}
          </div>

          {connectionStatus === "success" && availableModels.length > 0 ? (
            <Select
              value={config.model}
              onValueChange={(value) =>
                setConfig((prev) => ({ ...prev, model: value }))
              }
            >
              <SelectTrigger className="bg-input border-border font-mono text-sm">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {availableModels.map((model) => (
                  <SelectItem
                    key={model.name}
                    value={model.name}
                    className="font-mono text-sm"
                  >
                    <div className="flex items-center justify-between w-full gap-4">
                      <span>{model.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatSize(model.size)}
                      </span>
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
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, model: e.target.value }))
              }
              className="bg-input border-border font-mono text-sm"
              disabled={connectionStatus !== "success"}
            />
          )}
          <p className="text-xs text-muted-foreground">
            {connectionStatus === "success"
              ? availableModels.length > 0
                ? "Select from available models"
                : "Test connection to load models"
              : "Test connection first to load available models"}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="apiKey" className="text-foreground">
            API Key (optional)
          </Label>
          <Input
            id="apiKey"
            type="password"
            placeholder="Not required for local Ollama"
            value={config.apiKey}
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, apiKey: e.target.value }))
            }
            className="bg-input border-border font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Only needed for cloud APIs (OpenAI, Anthropic, etc.)
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="systemPrompt" className="text-foreground">
              System Prompt
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetSystemPrompt}
              className="h-6 px-2 text-xs"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset to Default
            </Button>
          </div>
          <Textarea
            id="systemPrompt"
            placeholder="Enter system prompt for CV generation..."
            value={config.systemPrompt}
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, systemPrompt: e.target.value }))
            }
            rows={8}
            className="bg-input border-border font-mono text-xs"
          />
          <p className="text-xs text-muted-foreground">
            Instructions for the AI on how to optimize CVs. Must request JSON
            output matching CVData structure.
          </p>
        </div>

        {errorMessage && (
          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <div className="space-y-1 flex-1">
                  <p className="text-sm text-destructive font-mono font-semibold">
                    {errorMessage}
                  </p>
                  {errorDetails && (
                    <p className="text-xs text-destructive/80 font-mono">
                      {errorDetails}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p className="font-semibold">Troubleshooting:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-2">
                    <li>
                      Check if Ollama is running:{" "}
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        ollama list
                      </code>
                    </li>
                    <li>
                      Verify the base URL is correct (default:
                      http://localhost:11434)
                    </li>
                    <li>
                      Try accessing{" "}
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        {config.baseUrl}/api/tags
                      </code>{" "}
                      in your browser
                    </li>
                    <li>
                      Pull a model if none exist:{" "}
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        ollama pull llama2
                      </code>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleTest}
            variant="outline"
            className="gap-2 bg-transparent"
            disabled={testing || !config.baseUrl}
          >
            {testing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <TestTube className="h-4 w-4" />
            )}
            {testing ? "Testing..." : "Test Connection"}
          </Button>
          <Button
            onClick={handleSave}
            className="gap-2"
            disabled={connectionStatus !== "success"}
          >
            <Save className="h-4 w-4" />
            Save Config
          </Button>
        </div>
      </div>
    </Card>
  );
}
