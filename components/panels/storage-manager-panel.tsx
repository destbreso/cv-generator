"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Database,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  Shield,
  HardDrive,
  Eye,
  EyeOff,
  CheckSquare,
  Square,
  FileText,
  Bot,
  Palette,
  Settings,
  History,
  Search,
  Info,
  XCircle,
  Package,
  Copy,
  Check,
  Key,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  scanStorage,
  scanDynamicAppKeys,
  getStorageSummary,
  deleteStorageKey,
  clearAllCVStorage,
  exportAllData,
  importData,
  CATEGORY_META,
  formatBytes,
  type StorageItem,
  type StorageSummary,
} from "@/lib/storage-manager";
import { cn } from "@/lib/utils";
import { useCVStore } from "@/lib/cv-store";

// ─── Category Icon Mapping ──────────────────────────────────────────────────

const CATEGORY_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  "cv-data": FileText,
  "ai-config": Bot,
  templates: Palette,
  preferences: Settings,
  history: History,
  secrets: Shield,
};

// ─── Component ──────────────────────────────────────────────────────────────

export function StorageManagerPanel() {
  const { state, loadFromStorage } = useCVStore();

  const [knownItems, setKnownItems] = useState<StorageItem[]>([]);
  const [dynamicItems, setDynamicItems] = useState<StorageItem[]>([]);
  const [summary, setSummary] = useState<StorageSummary | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<{
    imported: number;
    errors: string[];
  } | null>(null);

  // Refresh all data
  const refresh = useCallback(() => {
    setKnownItems(scanStorage());
    setDynamicItems(scanDynamicAppKeys());
    setSummary(getStorageSummary());
    setSelectedKeys(new Set());
    setImportResult(null);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleDeleteKey = (key: string) => {
    deleteStorageKey(key);
    refresh();
    // Reload app state so in-memory data reflects the deletion
    loadFromStorage();
  };

  const handleDeleteSelected = () => {
    selectedKeys.forEach((key) => deleteStorageKey(key));
    refresh();
    // Reload app state so in-memory data reflects the deletion
    loadFromStorage();
  };

  const handleClearAll = () => {
    clearAllCVStorage();
    refresh();
    // Reload app state to reflect cleared data
    loadFromStorage();
  };

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cv-generator-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      const result = importData(text);
      setImportResult(result);
      refresh();
      // Reload app state to reflect imported data
      if (result.imported > 0) {
        loadFromStorage();
      }
    };
    input.click();
  };

  const handleCopyValue = (key: string, value: string | null) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleSelect = (key: string) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleSelectAll = (items: StorageItem[]) => {
    const existingKeys = items.filter((i) => i.exists).map((i) => i.key);
    const allSelected = existingKeys.every((k) => selectedKeys.has(k));
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        existingKeys.forEach((k) => next.delete(k));
      } else {
        existingKeys.forEach((k) => next.add(k));
      }
      return next;
    });
  };

  // ── Filtering ─────────────────────────────────────────────────────────────

  const allItems = [...knownItems, ...dynamicItems];
  const filteredItems = allItems.filter(
    (item) =>
      item.exists &&
      item.storage !== "memory" &&
      (searchQuery === "" ||
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  // Group by category (exclude secrets — they have their own section)
  const groupedItems: Record<string, StorageItem[]> = {};
  for (const item of filteredItems) {
    if (item.category === "secrets") continue;
    if (!groupedItems[item.category]) groupedItems[item.category] = [];
    groupedItems[item.category].push(item);
  }

  const existingCount = allItems.filter(
    (i) => i.exists && i.storage !== "memory" && i.category !== "secrets",
  ).length;
  const emptyCount = knownItems.filter(
    (i) => !i.exists && i.storage !== "memory" && i.category !== "secrets",
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Storage Manager
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Full control and transparency over all data stored by CV Generator.
        </p>
      </div>

      <Separator />

      {/* ── Secrets & Security ─────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-green-500" />
          <h3 className="text-sm font-semibold">Secrets & Security</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          How CV Generator handles sensitive data like API keys.
        </p>

        {/* API Keys status card — per provider */}
        <div className="rounded-lg border border-border bg-card/50 p-3 space-y-2.5">
          <div className="flex items-center gap-2">
            <Key className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-xs font-medium">AI Provider API Keys</span>
            <div className="ml-auto">
              {(() => {
                const configuredCount =
                  Object.values(state.apiKeys || {}).filter(Boolean).length +
                  (state.aiConfig?.apiKey &&
                  !state.apiKeys?.[state.aiConfig.provider]
                    ? 1
                    : 0);
                return configuredCount > 0 ? (
                  <Badge
                    variant="outline"
                    className="text-[10px] h-5 border-green-500/30 text-green-600 dark:text-green-400 bg-green-500/5"
                  >
                    {configuredCount} active (this session)
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-[10px] h-5 text-muted-foreground"
                  >
                    None configured
                  </Badge>
                );
              })()}
            </div>
          </div>

          {/* Per-provider key indicators */}
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                "openai",
                "anthropic",
                "groq",
                "gemini",
                "mistral",
                "deepseek",
                "custom",
              ] as const
            ).map((provider) => {
              const hasKey = !!(
                state.apiKeys?.[provider] ||
                (state.aiConfig?.provider === provider &&
                  state.aiConfig?.apiKey)
              );
              return (
                <span
                  key={provider}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border",
                    hasKey
                      ? "bg-green-500/5 text-green-600 dark:text-green-400 border-green-500/20"
                      : "bg-muted/50 text-muted-foreground/60 border-border",
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      hasKey ? "bg-green-500" : "bg-muted-foreground/30",
                    )}
                  />
                  {provider === "openai"
                    ? "OpenAI"
                    : provider === "anthropic"
                      ? "Anthropic"
                      : provider === "groq"
                        ? "Groq"
                        : provider === "gemini"
                          ? "Gemini"
                          : provider === "mistral"
                            ? "Mistral"
                            : provider === "deepseek"
                              ? "DeepSeek"
                              : "Custom"}
                </span>
              );
            })}
          </div>

          <div className="flex items-start gap-2 rounded-md bg-muted/50 px-2.5 py-2">
            <Info className="h-3 w-3 text-muted-foreground mt-0.5 shrink-0" />
            <div className="text-[11px] text-muted-foreground leading-relaxed space-y-1">
              <p>
                <strong>Memory only</strong> - API keys live exclusively in
                browser RAM, stored separately per provider. They are{" "}
                <strong>never</strong> written to localStorage, cookies, or any
                persistent storage.
              </p>
              <p>
                Closing this tab permanently deletes all keys. You'll need to
                re-enter them next session. This is by design for maximum
                security.
              </p>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground/60 italic">
            To configure: AI Settings panel (⚙️). To remove: close this browser
            tab.
          </p>
        </div>
      </div>

      <Separator />

      {/* ── Persistent Data Header ──────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <HardDrive className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">
          Persistent Data (localStorage)
        </h3>
      </div>

      {/* ── Summary Cards ──────────────────────────────────────────────────── */}
      {summary && (
        <div className="space-y-3">
          {/* Usage Bar */}
          <div className="rounded-lg border border-border bg-card/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Storage Usage</span>
              </div>
              <span className="text-sm font-mono text-muted-foreground">
                {summary.totalSizeFormatted} / ~5 MB
              </span>
            </div>
            <Progress value={summary.quotaUsedPercent ?? 0} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{existingCount} active keys</span>
              <span>
                {summary.quotaUsedPercent !== null
                  ? `${summary.quotaUsedPercent}% used`
                  : "N/A"}
              </span>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(summary.byCategory)
              .filter(([cat]) => cat !== "secrets")
              .map(([cat, info]) => {
                const meta = CATEGORY_META[cat];
                const Icon = CATEGORY_ICONS[cat] || Package;
                return (
                  <div
                    key={cat}
                    className="flex items-center gap-2 rounded-md border border-border bg-card/30 px-3 py-2"
                  >
                    <Icon
                      className={cn(
                        "h-3.5 w-3.5",
                        meta?.color ?? "text-muted-foreground",
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">
                        {meta?.label ?? cat}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {info.count} keys · {info.sizeFormatted}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      <Separator />

      {/* ── Action Bar ─────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            className="gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            Export All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleImport}
            className="gap-1.5"
          >
            <Upload className="h-3.5 w-3.5" />
            Import
          </Button>

          {selectedKeys.size > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-1.5">
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete Selected ({selectedKeys.size})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete selected items?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You are about to delete {selectedKeys.size} storage{" "}
                    {selectedKeys.size === 1 ? "key" : "keys"}. This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteSelected}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <div className="flex-1" />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-destructive hover:text-destructive"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                Clear All Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Clear all CV Generator data?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete <strong>all</strong> data stored
                  by CV Generator, including your CV data, AI configuration,
                  generation history, and preferences. This action cannot be
                  undone. Consider exporting a backup first.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearAll}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Import result feedback */}
        {importResult && (
          <div
            className={cn(
              "rounded-md border px-3 py-2 text-sm flex items-center gap-2",
              importResult.errors.length > 0
                ? "border-yellow-500/30 bg-yellow-500/5 text-yellow-600 dark:text-yellow-400"
                : "border-green-500/30 bg-green-500/5 text-green-600 dark:text-green-400",
            )}
          >
            {importResult.errors.length > 0 ? (
              <AlertTriangle className="h-4 w-4 shrink-0" />
            ) : (
              <Check className="h-4 w-4 shrink-0" />
            )}
            <span>
              Imported {importResult.imported} keys.
              {importResult.errors.length > 0 &&
                ` ${importResult.errors.length} error(s).`}
            </span>
            <button
              onClick={() => setImportResult(null)}
              className="ml-auto hover:opacity-70"
            >
              <XCircle className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      <Separator />

      {/* ── Search & Bulk Select ────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search keys..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={() => toggleSelectAll(filteredItems)}
            >
              {filteredItems.every((i) => selectedKeys.has(i.key)) &&
              filteredItems.length > 0 ? (
                <CheckSquare className="h-3.5 w-3.5" />
              ) : (
                <Square className="h-3.5 w-3.5" />
              )}
              All
            </Button>
          </TooltipTrigger>
          <TooltipContent>Select / deselect all visible items</TooltipContent>
        </Tooltip>
      </div>

      {/* ── Storage Items by Category ──────────────────────────────────────── */}
      {Object.keys(groupedItems).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <Database className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="font-medium text-sm">No stored data found</p>
          <p className="text-xs text-muted-foreground mt-1">
            {searchQuery
              ? "Try adjusting your search query."
              : "CV Generator hasn't saved any data yet."}
          </p>
        </div>
      ) : (
        <Accordion type="multiple" defaultValue={Object.keys(groupedItems)}>
          {Object.entries(groupedItems).map(([category, items]) => {
            const meta = CATEGORY_META[category];
            const Icon = CATEGORY_ICONS[category] || Package;
            const catSize = items.reduce((acc, i) => acc + i.sizeBytes, 0);

            return (
              <AccordionItem
                key={category}
                value={category}
                className="border rounded-lg px-4 mb-2 data-[state=open]:bg-muted/20"
              >
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-2 flex-1">
                    <div
                      className={cn(
                        "h-7 w-7 rounded-md flex items-center justify-center",
                        "bg-primary/10",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-3.5 w-3.5",
                          meta?.color ?? "text-primary",
                        )}
                      />
                    </div>
                    <span className="font-semibold text-sm">
                      {meta?.label ?? category}
                    </span>
                    <Badge variant="secondary" className="text-[10px] h-5">
                      {items.length}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground ml-auto mr-2 font-mono">
                      {formatBytes(catSize)}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-3">
                  <div className="space-y-2">
                    {items.map((item) => (
                      <StorageItemRow
                        key={item.key}
                        item={item}
                        selected={selectedKeys.has(item.key)}
                        expanded={expandedItem === item.key}
                        copied={copiedKey === item.key}
                        onToggleSelect={() => toggleSelect(item.key)}
                        onToggleExpand={() =>
                          setExpandedItem(
                            expandedItem === item.key ? null : item.key,
                          )
                        }
                        onDelete={() => handleDeleteKey(item.key)}
                        onCopy={() => handleCopyValue(item.key, item.rawValue)}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}

      {/* ── Empty (not-set) Keys Section ───────────────────────────────────── */}
      {emptyCount > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Unused Keys
              </span>
              <Badge
                variant="outline"
                className="text-[10px] h-5 text-muted-foreground"
              >
                {emptyCount}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              These registered keys have no data stored yet. They will be
              populated as you use the app.
            </p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {knownItems
                .filter(
                  (i) =>
                    !i.exists &&
                    i.storage !== "memory" &&
                    i.category !== "secrets",
                )
                .map((item) => (
                  <Tooltip key={item.key}>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="outline"
                        className="text-[10px] text-muted-foreground/70 font-mono cursor-help"
                      >
                        {item.key}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[200px]">
                      <p className="text-xs font-semibold">{item.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
            </div>
          </div>
        </>
      )}

      {/* ── Privacy Notice ─────────────────────────────────────────────────── */}
      <Separator />
      <div className="rounded-lg border border-border bg-card/30 p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-green-500" />
          <span className="text-sm font-medium">Privacy Notice</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          All data is stored exclusively in your browser&apos;s localStorage.
          Nothing is sent to external servers (except when using the AI
          generation feature, which sends CV data to your configured LLM
          endpoint). You have full control to inspect, export, or delete any
          data at any time.{" "}
          <Link
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Read full Privacy Policy →
          </Link>
        </p>
      </div>
    </div>
  );
}

// ─── Storage Item Row Component ─────────────────────────────────────────────

interface StorageItemRowProps {
  item: StorageItem;
  selected: boolean;
  expanded: boolean;
  copied: boolean;
  onToggleSelect: () => void;
  onToggleExpand: () => void;
  onDelete: () => void;
  onCopy: () => void;
}

function StorageItemRow({
  item,
  selected,
  expanded,
  copied,
  onToggleSelect,
  onToggleExpand,
  onDelete,
  onCopy,
}: StorageItemRowProps) {
  return (
    <div
      className={cn(
        "rounded-md border transition-colors",
        selected
          ? "border-primary/30 bg-primary/5"
          : "border-border bg-card/30 hover:border-border/80",
      )}
    >
      {/* Main row */}
      <div className="flex items-center gap-2 px-3 py-2">
        {/* Checkbox */}
        <button
          onClick={onToggleSelect}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {selected ? (
            <CheckSquare className="h-3.5 w-3.5 text-primary" />
          ) : (
            <Square className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium truncate">{item.label}</span>
            {item.critical && (
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant="outline"
                    className="text-[9px] h-4 border-yellow-500/30 text-yellow-500 bg-yellow-500/5"
                  >
                    critical
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  Deleting this key may affect app functionality.
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <code className="text-[10px] text-muted-foreground font-mono">
              {item.key}
            </code>
            <span className="text-[10px] text-muted-foreground">·</span>
            <span className="text-[10px] text-muted-foreground font-mono">
              {item.sizeFormatted}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={onToggleExpand}
              >
                {expanded ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {expanded ? "Hide value" : "Inspect value"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={onCopy}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy raw value</TooltipContent>
          </Tooltip>

          <AlertDialog>
            <Tooltip>
              <AlertDialogTrigger asChild>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
              </AlertDialogTrigger>
              <TooltipContent>Delete this key</TooltipContent>
            </Tooltip>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete &ldquo;{item.label}&rdquo;?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the value stored at{" "}
                  <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">
                    {item.key}
                  </code>
                  . This action cannot be undone.
                  {item.critical && (
                    <span className="block mt-2 text-yellow-500 font-medium">
                      ⚠ This key is marked as critical. Deleting it may affect
                      app functionality.
                    </span>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Expanded value viewer */}
      {expanded && (
        <div className="border-t border-border px-3 py-2">
          <p className="text-[10px] text-muted-foreground mb-1.5 font-medium uppercase tracking-wider">
            Raw Value
          </p>
          <pre className="text-[11px] text-foreground/80 bg-muted/50 rounded-md p-2.5 overflow-x-auto max-h-[200px] overflow-y-auto font-mono leading-relaxed whitespace-pre-wrap break-all">
            {(() => {
              try {
                return JSON.stringify(JSON.parse(item.rawValue || ""), null, 2);
              } catch {
                return item.rawValue || "—";
              }
            })()}
          </pre>
          <p className="text-[10px] text-muted-foreground mt-1.5 italic">
            {item.description}
          </p>
        </div>
      )}
    </div>
  );
}
