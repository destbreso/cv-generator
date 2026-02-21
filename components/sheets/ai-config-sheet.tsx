"use client";

import { useCallback, useEffect, useState } from "react";
import {
  useCVStore,
  type AIProvider,
  DEFAULT_AI_CONFIGS,
} from "@/lib/cv-store";
import { DEFAULT_SYSTEM_PROMPT } from "@/lib/default-system-prompt";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SystemPromptDialog } from "@/components/dialogs/system-prompt-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Bot,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  Key,
  Globe,
  Cpu,
  FileText,
  Zap,
  Copy,
  Edit2,
  Check,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const isOllamaEnabled = process.env.NEXT_PUBLIC_DISABLE_OLLAMA !== "true";

const ALL_PROVIDERS: {
  id: AIProvider;
  name: string;
  description: string;
  icon: React.ReactNode;
  needsKey?: boolean;
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
    needsKey: true,
  },
  {
    id: "anthropic",
    name: "Anthropic",
    description: "Claude 3.5",
    icon: <Bot className="h-4 w-4" />,
    needsKey: true,
  },
  {
    id: "groq",
    name: "Groq",
    description: "Fast inference",
    icon: <Zap className="h-4 w-4" />,
    needsKey: true,
  },
  {
    id: "gemini",
    name: "Gemini",
    description: "Google AI",
    icon: <Zap className="h-4 w-4" />,
    needsKey: true,
  },
  {
    id: "mistral",
    name: "Mistral",
    description: "Mistral AI",
    icon: <Zap className="h-4 w-4" />,
    needsKey: true,
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    description: "DeepSeek AI",
    icon: <Zap className="h-4 w-4" />,
    needsKey: true,
  },
  {
    id: "custom",
    name: "Custom",
    description: "OpenAI-compatible",
    icon: <Globe className="h-4 w-4" />,
    needsKey: true,
  },
];

const PROVIDERS = ALL_PROVIDERS;

export function AIConfigSheet() {
  const { state, dispatch, testConnection, loadModels, saveToStorage } =
    useCVStore();
  const { aiConfig, isConnected, availableModels } = state;
  const { apiKeys } = state;

  const [testing, setTesting] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);

  const [editingApiKey, setEditingApiKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [showPromptDialog, setShowPromptDialog] = useState(false);

  const handleLoadModels = useCallback(async () => {
    setLoadingModels(true);
    await loadModels();
    setLoadingModels(false);
  }, [loadModels]);

  const handleProviderChange = (provider: AIProvider) => {
    dispatch({ type: "SET_AI_PROVIDER", payload: provider });
  };

  const handleTestConnection = async () => {
    setTesting(true);
    const success = await testConnection();
    if (success) {
      await handleLoadModels();
    }
    setTesting(false);
  };

  useEffect(() => {
    if (aiConfig.provider === "ollama" && aiConfig.baseUrl) {
      handleLoadModels();
    }
  }, [aiConfig.provider, aiConfig.baseUrl, handleLoadModels]);

  const handleCopyApiKey = () => {
    if (aiConfig.apiKey) {
      navigator.clipboard.writeText(aiConfig.apiKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const handleSave = () => {
    setEditingApiKey(false);
    saveToStorage();
  };

  const maskApiKey = (key: string | undefined) => {
    if (!key) return "";
    if (key.length <= 8) return "*".repeat(key.length);
    const head = key.slice(0, 4);
    const tail = key.slice(-4);
    return `${head}********${tail}`;
  };

  return (
    <ScrollArea className="h-[calc(100vh-120px)] pr-4">
      <div className="w-full min-w-0 max-w-full space-y-6 py-4 px-4">
        {/* Security Notice */}
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 space-y-2">
          <div className="flex gap-2 items-start">
            <Shield className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs space-y-1 min-w-0">
              <p className="font-semibold text-amber-700 dark:text-amber-400">
                API Key Privacy Notice
              </p>
              <p className="text-amber-700/80 dark:text-amber-400/70">
                Your API key is stored <strong>only in memory</strong> (RAM)
                during this session. It is <strong>never saved</strong> to disk,
                localStorage, sessionStorage, or cookies. When you close this
                tab, it's automatically deleted.
              </p>
              <p className="text-amber-700/70 dark:text-amber-400/60 text-[11px] mt-2">
                ⚠️ <strong>Limitation:</strong> If this website is compromised
                with XSS, keys in memory could theoretically be accessed. For
                production/sensitive keys, consider using an API gateway or
                backend proxy instead.
              </p>
            </div>
          </div>
        </div>

        {/* Provider Selection */}
        <div className="space-y-3">
          <Label>AI Provider</Label>
          <div className="grid grid-cols-2 gap-2">
            {PROVIDERS.map((provider) => {
              const isDisabledOllama =
                provider.id === "ollama" && !isOllamaEnabled;
              return (
                <button
                  key={provider.id}
                  onClick={() =>
                    !isDisabledOllama && handleProviderChange(provider.id)
                  }
                  disabled={isDisabledOllama}
                  className={cn(
                    "relative flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                    isDisabledOllama
                      ? "border-border opacity-50 cursor-not-allowed"
                      : aiConfig.provider === provider.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50",
                  )}
                >
                  {provider.needsKey &&
                    (() => {
                      const hasKey = !!(
                        apiKeys[provider.id] ||
                        (provider.id === aiConfig.provider && aiConfig.apiKey)
                      );
                      return (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span
                              className={cn(
                                "absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full border",
                                hasKey
                                  ? "bg-green-100 dark:bg-green-900/60 border-green-400/50 dark:border-green-600/50"
                                  : "bg-amber-100 dark:bg-amber-900/60 border-amber-300/50 dark:border-amber-700/50",
                              )}
                            >
                              <Key
                                className={cn(
                                  "h-2 w-2",
                                  hasKey
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-amber-600 dark:text-amber-400",
                                )}
                              />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">
                            {hasKey ? "API key configured" : "API key required"}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })()}
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                      aiConfig.provider === provider.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted",
                    )}
                  >
                    {provider.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-sm flex items-center gap-1.5">
                      {provider.name}
                      {isDisabledOllama && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground border border-border">
                          Local only
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {provider.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Connection Settings */}
        <div className="space-y-4">
          <Label>Connection</Label>

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
              className="text-sm"
            />
          </div>

          {aiConfig.provider !== "ollama" && (
            <div className="space-y-2 w-full min-w-0 max-w-full overflow-hidden">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <Key className="h-3 w-3 flex-shrink-0" />
                API Key (Secure)
              </Label>

              {!editingApiKey && aiConfig.apiKey ? (
                // Masked view - show masked key with copy/edit buttons
                <div className="space-y-2 w-full min-w-0 max-w-full overflow-hidden">
                  {/* API Key Display - Constrained width with ellipsis */}
                  <div className="w-full h-10 flex items-center px-3 py-2 rounded-md border border-border bg-muted font-mono text-sm overflow-hidden">
                    <span className="w-full min-w-0 truncate text-muted-foreground">
                      {maskApiKey(aiConfig.apiKey)}
                    </span>
                  </div>

                  {/* Action Buttons - Always 2 columns */}
                  <div className="w-full grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyApiKey}
                      disabled={copiedKey}
                      className="gap-1 whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                      {copiedKey ? (
                        <>
                          <Check className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="min-w-0 truncate">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="min-w-0 truncate">Copy</span>
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingApiKey(true)}
                      className="gap-1 whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                      <Edit2 className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="min-w-0 truncate">Change</span>
                    </Button>
                  </div>
                </div>
              ) : (
                // Edit view - show input field
                <div className="space-y-2 w-full min-w-0 max-w-full overflow-hidden">
                  <Input
                    type="password"
                    value={aiConfig.apiKey || ""}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_AI_CONFIG",
                        payload: { apiKey: e.target.value },
                      })
                    }
                    placeholder="sk-..."
                    className="w-full min-w-0 max-w-full text-sm"
                  />
                  <div className="w-full grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingApiKey(false)}
                      className="gap-1 whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                      <Check className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="min-w-0 truncate">Save</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingApiKey(false);
                        dispatch({
                          type: "SET_AI_CONFIG",
                          payload: { apiKey: "" },
                        });
                      }}
                      className="whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                      <span className="min-w-0 truncate">Cancel</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="model" className="text-xs text-muted-foreground">
                Model
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={handleLoadModels}
                disabled={loadingModels}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh
              </Button>
            </div>
            {availableModels.length > 0 ? (
              <Select
                value={aiConfig.model}
                onValueChange={(value) =>
                  dispatch({ type: "SET_AI_CONFIG", payload: { model: value } })
                }
                disabled={loadingModels}
              >
                <SelectTrigger className="text-sm">
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
                disabled={loadingModels}
                placeholder={
                  loadingModels ? "Loading available models..." : "llama3"
                }
                className="text-sm"
              />
            )}
            {loadingModels && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Fetching available models...</span>
              </div>
            )}
          </div>

          {/* Connect Button — prominent CTA */}
          <Button
            className={cn(
              "w-full gap-2 transition-all",
              isConnected
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-primary hover:bg-primary/90",
            )}
            onClick={handleTestConnection}
            disabled={testing || loadingModels || !aiConfig.baseUrl}
          >
            {testing || loadingModels ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {testing ? "Testing Connection..." : "Loading Models..."}
              </>
            ) : isConnected ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Connected - Re-test
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Connect & Load Models
              </>
            )}
          </Button>
        </div>

        <Separator />

        {/* AI Writing Instructions (System Prompt) */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            AI Writing Instructions
          </Label>

          {/* Compact preview card */}
          <button
            type="button"
            className="w-full text-left rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors px-3 py-2.5 group cursor-pointer"
            onClick={() => setShowPromptDialog(true)}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                {(aiConfig.systemPrompt || DEFAULT_SYSTEM_PROMPT).slice(0, 180)}
                …
              </p>
              <span className="text-[10px] text-primary font-medium shrink-0 group-hover:underline mt-0.5">
                Edit
              </span>
            </div>
            {aiConfig.systemPrompt &&
              aiConfig.systemPrompt !== DEFAULT_SYSTEM_PROMPT && (
                <span className="inline-block mt-1.5 text-[10px] rounded-full bg-primary/10 text-primary px-2 py-0.5 font-medium">
                  Custom prompt
                </span>
              )}
          </button>
        </div>

        {/* System Prompt Dialog */}
        <SystemPromptDialog
          open={showPromptDialog}
          onOpenChange={setShowPromptDialog}
          value={aiConfig.systemPrompt || DEFAULT_SYSTEM_PROMPT}
          defaultValue={DEFAULT_SYSTEM_PROMPT}
          onSave={(value) =>
            dispatch({
              type: "SET_AI_CONFIG",
              payload: { systemPrompt: value },
            })
          }
        />

        <Separator />

        {/* Save Button */}
        <Button className="w-full" onClick={handleSave}>
          Save Configuration
        </Button>
      </div>
    </ScrollArea>
  );
}
