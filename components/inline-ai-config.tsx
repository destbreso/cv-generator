"use client";

import { useState, useCallback } from "react";
import { useCVStore, type AIProvider } from "@/lib/cv-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  Loader2,
  Key,
  Globe,
  Cpu,
  Zap,
  Settings2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

const isOllamaEnabled = process.env.NEXT_PUBLIC_DISABLE_OLLAMA !== "true";

const ALL_PROVIDERS: {
  id: AIProvider;
  name: string;
  icon: React.ReactNode;
  needsKey: boolean;
}[] = [
  {
    id: "ollama",
    name: "Ollama",
    icon: <Cpu className="h-3.5 w-3.5" />,
    needsKey: false,
  },
  {
    id: "openai",
    name: "OpenAI",
    icon: <Zap className="h-3.5 w-3.5" />,
    needsKey: true,
  },
  {
    id: "anthropic",
    name: "Anthropic",
    icon: <Bot className="h-3.5 w-3.5" />,
    needsKey: true,
  },
  {
    id: "groq",
    name: "Groq",
    icon: <Zap className="h-3.5 w-3.5" />,
    needsKey: true,
  },
  {
    id: "gemini",
    name: "Gemini",
    icon: <Zap className="h-3.5 w-3.5" />,
    needsKey: true,
  },
  {
    id: "mistral",
    name: "Mistral",
    icon: <Zap className="h-3.5 w-3.5" />,
    needsKey: true,
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    icon: <Zap className="h-3.5 w-3.5" />,
    needsKey: true,
  },
  {
    id: "custom",
    name: "Custom",
    icon: <Globe className="h-3.5 w-3.5" />,
    needsKey: true,
  },
];

const PROVIDERS = ALL_PROVIDERS;

interface InlineAIConfigProps {
  /** Compact: shows only badge + expand. Full: always shows config */
  variant?: "compact" | "full";
  /** Called when config is ready (provider connected, model selected) */
  onReady?: () => void;
  /** Additional class names */
  className?: string;
}

/**
 * Lightweight inline AI configuration widget.
 *
 * Shows only provider selection (filtered to those that are usable —
 * i.e. don't need a key, or already have one configured), model picker,
 * and a "More config" link that opens the full AI Config Sheet.
 *
 * Base URL, API keys, system prompt etc. are managed exclusively in the
 * full config sheet. Keys live in React state (memory only), never persisted.
 */
export function InlineAIConfig({
  variant = "compact",
  onReady,
  className,
}: InlineAIConfigProps) {
  const { state, dispatch, testConnection, loadModels } = useCVStore();
  const { aiConfig, isConnected, availableModels } = state;

  const [expanded, setExpanded] = useState(!isConnected);
  const [testing, setTesting] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);

  const currentProvider = PROVIDERS.find((p) => p.id === aiConfig.provider);
  const needsKey = currentProvider?.needsKey ?? false;
  const hasKey = !!aiConfig.apiKey;

  // Only show providers the user can actually use right now:
  // - providers that don't need a key (Ollama — if enabled)
  // - any provider that has a key stored in the per-provider apiKeys map
  // - Ollama always shown (but disabled if not enabled)
  const usableProviders = PROVIDERS.filter(
    (p) =>
      p.id === "ollama" ||
      !p.needsKey ||
      !!state.apiKeys?.[p.id],
  );

  // If the currently selected provider needs a key but doesn't have one,
  // the user must go to full config first.
  const providerMissingKey = needsKey && !hasKey;

  const handleProviderChange = (providerId: string) => {
    dispatch({ type: "SET_AI_PROVIDER", payload: providerId as AIProvider });
  };

  const openFullConfig = () => {
    dispatch({ type: "TOGGLE_AI_CONFIG" });
  };

  const handleTest = useCallback(async () => {
    setTesting(true);
    const ok = await testConnection();
    if (ok) {
      setLoadingModels(true);
      await loadModels();
      setLoadingModels(false);
      setExpanded(false);
      onReady?.();
    }
    setTesting(false);
  }, [testConnection, loadModels, onReady]);

  const handleLoadModels = useCallback(async () => {
    setLoadingModels(true);
    await loadModels();
    setLoadingModels(false);
  }, [loadModels]);

  // --- Compact badge (when connected & not expanded) ---
  if (variant === "compact" && isConnected && !expanded) {
    return (
      <div
        className={cn(
          "rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-2",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
            <span className="text-xs font-medium truncate">
              {currentProvider?.name} — {aiConfig.model}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-[11px]"
            onClick={() => setExpanded(true)}
          >
            Change
          </Button>
        </div>
      </div>
    );
  }

  // --- Expanded config ---
  return (
    <div
      className={cn(
        "rounded-lg border",
        isConnected
          ? "border-green-500/20 bg-green-500/5"
          : "border-amber-500/30 bg-amber-500/5",
        className,
      )}
    >
      <div className="px-3 py-2 space-y-3">
        {/* Header + More config link */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-xs font-semibold">AI Provider</span>
            {isConnected && (
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 h-5 border-green-500/30 text-green-600"
              >
                Connected
              </Badge>
            )}
          </div>
          <button
            onClick={openFullConfig}
            className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
          >
            <Settings2 className="h-3 w-3" />
            More
          </button>
        </div>

        {/* Provider pills — only usable ones */}
        <div className="flex flex-wrap gap-1.5">
          {usableProviders.map((p) => {
            const isDisabledOllama = p.id === "ollama" && !isOllamaEnabled;
            return (
            <button
              key={p.id}
              onClick={() => !isDisabledOllama && handleProviderChange(p.id)}
              disabled={isDisabledOllama}
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all",
                isDisabledOllama
                  ? "border-border opacity-50 cursor-not-allowed text-muted-foreground"
                  : aiConfig.provider === p.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/40 text-muted-foreground",
              )}
            >
              {p.icon}
              {p.name}
              {isDisabledOllama && (
                <span className="text-[10px] opacity-70">Local only</span>
              )}
            </button>
            );
          })}
          {/* If no keyed providers are available, hint to configure */}
          {usableProviders.length <= 1 && (
            <button
              onClick={openFullConfig}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-dashed border-muted-foreground/30 text-muted-foreground hover:border-primary/40 transition-all"
            >
              <Key className="h-3 w-3" />
              Add provider…
            </button>
          )}
        </div>

        {/* Missing key — redirect to full config */}
        {providerMissingKey && (
          <div className="flex items-start gap-2 p-2 rounded border border-amber-500/30 bg-amber-500/5">
            <Key className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-tight">
                {currentProvider?.name} requires an API key.
              </p>
              <button
                onClick={openFullConfig}
                className="text-[11px] font-medium text-primary hover:underline mt-1"
              >
                Open AI Config to set it up →
              </button>
            </div>
          </div>
        )}

        {/* Model selection — only when provider is usable */}
        {!providerMissingKey && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <Label className="text-[11px] text-muted-foreground">Model</Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 px-1.5 text-[10px]"
                onClick={handleLoadModels}
                disabled={loadingModels}
              >
                <RefreshCw
                  className={cn(
                    "h-3 w-3 mr-1",
                    loadingModels && "animate-spin",
                  )}
                />
                Refresh
              </Button>
            </div>

            {availableModels.length > 0 ? (
              <Select
                value={aiConfig.model}
                onValueChange={(v) =>
                  dispatch({ type: "SET_AI_CONFIG", payload: { model: v } })
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {availableModels.map((m) => (
                    <SelectItem key={m} value={m} className="text-xs">
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={aiConfig.model}
                onChange={(e) =>
                  dispatch({
                    type: "SET_AI_CONFIG",
                    payload: { model: e.target.value },
                  })
                }
                placeholder={loadingModels ? "Loading..." : "model name"}
                className="h-8 text-xs"
                disabled={loadingModels}
              />
            )}
          </div>
        )}

        {/* Connect button — only when provider is usable */}
        {!providerMissingKey && (
          <Button
            size="sm"
            className="w-full h-8 text-xs gap-1.5"
            onClick={handleTest}
            disabled={
              testing || loadingModels || !aiConfig.baseUrl || !aiConfig.model
            }
          >
            {testing || loadingModels ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {testing ? "Connecting..." : "Loading models..."}
              </>
            ) : isConnected ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                Reconnect
              </>
            ) : (
              <>
                <Zap className="h-3.5 w-3.5" />
                Connect
              </>
            )}
          </Button>
        )}

        {/* Collapse when connected */}
        {isConnected && variant === "compact" && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full h-6 text-[11px]"
            onClick={() => setExpanded(false)}
          >
            Collapse
          </Button>
        )}
      </div>
    </div>
  );
}
