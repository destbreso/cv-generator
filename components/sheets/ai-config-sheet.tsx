"use client";

import { useState } from "react";
import {
  useCVStore,
  type AIProvider,
  DEFAULT_AI_CONFIGS,
} from "@/lib/cv-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Bot,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  ChevronDown,
  Key,
  Globe,
  Cpu,
  FileText,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PROVIDERS: {
  id: AIProvider;
  name: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "ollama",
    name: "Ollama",
    description: "Local LLM (Free)",
    icon: <Cpu className="h-4 w-4" />,
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "GPT-4o, GPT-4",
    icon: <Zap className="h-4 w-4" />,
  },
  {
    id: "anthropic",
    name: "Anthropic",
    description: "Claude 3.5",
    icon: <Bot className="h-4 w-4" />,
  },
  {
    id: "groq",
    name: "Groq",
    description: "Fast inference",
    icon: <Zap className="h-4 w-4" />,
  },
  {
    id: "custom",
    name: "Custom",
    description: "OpenAI-compatible",
    icon: <Globe className="h-4 w-4" />,
  },
];

const DEFAULT_SYSTEM_PROMPT = `You are an expert CV writer and career coach. Your task is to optimize CVs for specific job applications.

When given CV data and job context:
1. Rewrite content to better match the target role
2. Emphasize relevant skills and achievements
3. Use action verbs and quantifiable results
4. Keep the same JSON structure as input
5. Be concise but impactful

Output ONLY valid JSON matching the input CVData structure.`;

export function AIConfigSheet() {
  const { state, dispatch, testConnection, loadModels, saveToStorage } =
    useCVStore();
  const { aiConfig, isConnected, availableModels } = state;

  const [testing, setTesting] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleProviderChange = (provider: AIProvider) => {
    dispatch({ type: "SET_AI_PROVIDER", payload: provider });
  };

  const handleTestConnection = async () => {
    setTesting(true);
    const success = await testConnection();
    if (success) {
      setLoadingModels(true);
      await loadModels();
      setLoadingModels(false);
    }
    setTesting(false);
  };

  const handleSave = () => {
    saveToStorage();
  };

  return (
    <ScrollArea className="h-[calc(100vh-120px)] pr-4 pl-1">
      <div className="space-y-6 py-4 pl-5">
        {/* Provider Selection */}
        <div className="space-y-3">
          <Label>AI Provider</Label>
          <div className="grid grid-cols-2 gap-2">
            {PROVIDERS.map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleProviderChange(provider.id)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                  aiConfig.provider === provider.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50",
                )}
              >
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center",
                    aiConfig.provider === provider.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted",
                  )}
                >
                  {provider.icon}
                </div>
                <div>
                  <div className="font-medium text-sm">{provider.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {provider.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Connection Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Connection</Label>
            <Badge
              variant={isConnected ? "default" : "secondary"}
              className="gap-1"
            >
              {isConnected ? (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  Connected
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3" />
                  Disconnected
                </>
              )}
            </Badge>
          </div>

          <div className="space-y-2">
            <Label htmlFor="baseUrl" className="text-xs text-muted-foreground">
              Base URL
            </Label>
            <Input
              id="baseUrl"
              value={aiConfig.baseUrl}
              onChange={(e) =>
                dispatch({
                  type: "SET_AI_CONFIG",
                  payload: { baseUrl: e.target.value },
                })
              }
              placeholder="http://localhost:11434"
            />
          </div>

          {aiConfig.provider !== "ollama" && (
            <div className="space-y-2">
              <Label
                htmlFor="apiKey"
                className="text-xs text-muted-foreground flex items-center gap-1"
              >
                <Key className="h-3 w-3" />
                API Key
              </Label>
              <Input
                id="apiKey"
                type="password"
                value={aiConfig.apiKey || ""}
                onChange={(e) =>
                  dispatch({
                    type: "SET_AI_CONFIG",
                    payload: { apiKey: e.target.value },
                  })
                }
                placeholder="sk-..."
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="model" className="text-xs text-muted-foreground">
              Model
            </Label>
            {availableModels.length > 0 ? (
              <Select
                value={aiConfig.model}
                onValueChange={(value) =>
                  dispatch({ type: "SET_AI_CONFIG", payload: { model: value } })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {availableModels.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="model"
                value={aiConfig.model}
                onChange={(e) =>
                  dispatch({
                    type: "SET_AI_CONFIG",
                    payload: { model: e.target.value },
                  })
                }
                placeholder="llama3"
              />
            )}
          </div>

          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handleTestConnection}
            disabled={testing}
          >
            {testing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Test Connection
              </>
            )}
          </Button>
        </div>

        <Separator />

        {/* Advanced Settings */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Advanced Settings
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  showAdvanced && "rotate-180",
                )}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="systemPrompt"
                  className="text-xs text-muted-foreground"
                >
                  System Prompt
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() =>
                    dispatch({
                      type: "SET_AI_CONFIG",
                      payload: { systemPrompt: DEFAULT_SYSTEM_PROMPT },
                    })
                  }
                >
                  Reset to default
                </Button>
              </div>
              <Textarea
                id="systemPrompt"
                value={aiConfig.systemPrompt || DEFAULT_SYSTEM_PROMPT}
                onChange={(e) =>
                  dispatch({
                    type: "SET_AI_CONFIG",
                    payload: { systemPrompt: e.target.value },
                  })
                }
                rows={8}
                className="text-xs font-mono"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Save Button */}
        <Button className="w-full" onClick={handleSave}>
          Save Configuration
        </Button>
      </div>
    </ScrollArea>
  );
}
