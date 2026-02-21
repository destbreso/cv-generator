"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Palette,
  Sparkles,
  History,
  Eye,
  Database,
  EyeOff,
  Bot,
  HelpCircle,
  Home,
} from "lucide-react";
import { useCVStore } from "@/lib/cv-store";
import { CVEditorPanel } from "@/components/panels/cv-editor-panel";
import { TemplatePanel } from "@/components/panels/template-panel";
import { GeneratePanel } from "@/components/panels/generate-panel";
import { HistoryPanel } from "@/components/panels/history-panel";
import { PreviewPanel } from "@/components/panels/preview-panel";
import { AIConfigSheet } from "@/components/sheets/ai-config-sheet";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { FAQPanel } from "@/components/panels/faq-panel";
import { StorageManagerPanel } from "@/components/panels/storage-manager-panel";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  className?: string;
}

export function MainLayout({ className }: MainLayoutProps) {
  const { state, dispatch, loadFromStorage } = useCVStore();
  const { panels, isDirty, isConnected, aiConfig, isGenerating } = state;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadFromStorage();
  }, [loadFromStorage]);

  if (!mounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className={cn("h-screen flex flex-col bg-background", className)}>
        {/* Top Bar */}
        <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card/50 backdrop-blur">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <span className="font-semibold text-foreground">
                CV Generator
              </span>
              {isDirty && (
                <Badge
                  variant="outline"
                  className="text-xs bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                >
                  Unsaved
                </Badge>
              )}
            </div>
            <Link
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {/* Home Button */}
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                title="Back to Home"
              >
                <Home className="h-4 w-4" />
              </Button>
            </Link>

            {/* AI Status + Config Sheet Trigger */}
            <Sheet
              open={panels.showAIConfig}
              onOpenChange={(open) =>
                dispatch({ type: "SET_AI_CONFIG_OPEN", payload: open })
              }
            >
              <button
                type="button"
                onClick={() => dispatch({ type: "TOGGLE_AI_CONFIG" })}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-colors",
                  "hover:bg-muted/80",
                  isConnected
                    ? "bg-green-500/10 text-green-600"
                    : "bg-muted text-muted-foreground",
                )}
                title={
                  isConnected
                    ? `Connected to ${aiConfig.provider}`
                    : "AI not connected"
                }
              >
                <Bot className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">
                  {aiConfig.model || "No model"}
                </span>
                <div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    isConnected ? "bg-green-500" : "bg-muted-foreground",
                  )}
                />
              </button>
              <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    AI Configuration
                  </SheetTitle>
                </SheetHeader>
                <AIConfigSheet />
              </SheetContent>
            </Sheet>

            {/* Theme Switcher */}
            <ThemeSwitcher />

            {/* Toggle Preview */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => dispatch({ type: "TOGGLE_PREVIEW" })}
                >
                  {panels.showPreview ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {panels.showPreview ? "Hide preview" : "Show preview"}
              </TooltipContent>
            </Tooltip>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <aside className="w-14 border-r border-border bg-card/30 flex flex-col">
            {/* Workflow steps */}
            <nav className="flex-1 py-4 flex flex-col items-center gap-1">
              <SidebarButton
                icon={FileText}
                label="Your Data"
                step={1}
                active={panels.activePanel === "editor"}
                onClick={() =>
                  dispatch({ type: "SET_ACTIVE_PANEL", payload: "editor" })
                }
              />
              <SidebarButton
                icon={Sparkles}
                label="AI Enhance"
                step={2}
                active={panels.activePanel === "history"}
                badge={isGenerating ? "..." : undefined}
                onClick={() =>
                  dispatch({ type: "SET_ACTIVE_PANEL", payload: "history" })
                }
              />
              <SidebarButton
                icon={Palette}
                label="Design & Export"
                step={3}
                active={panels.activePanel === "templates"}
                onClick={() =>
                  dispatch({ type: "SET_ACTIVE_PANEL", payload: "templates" })
                }
              />
            </nav>

            {/* Secondary tools */}
            <div className="p-2 border-t border-border flex flex-col items-center gap-1">
              <SidebarButton
                icon={History}
                label="History"
                active={panels.activePanel === "export"}
                onClick={() =>
                  dispatch({ type: "SET_ACTIVE_PANEL", payload: "export" })
                }
              />
              <SidebarButton
                icon={Database}
                label="Storage"
                active={panels.activePanel === "storage"}
                onClick={() =>
                  dispatch({ type: "SET_ACTIVE_PANEL", payload: "storage" })
                }
              />
              <SidebarButton
                icon={HelpCircle}
                label="FAQ"
                active={panels.activePanel === "faq"}
                onClick={() =>
                  dispatch({ type: "SET_ACTIVE_PANEL", payload: "faq" })
                }
              />
            </div>
          </aside>

          {/* Resizable Panels */}
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            {/* Left Panel - Editor/Templates */}
            <ResizablePanel
              defaultSize={panels.showPreview ? 50 : 100}
              minSize={30}
              className="flex flex-col"
            >
              <Tabs
                value={panels.activePanel}
                onValueChange={(v) =>
                  dispatch({
                    type: "SET_ACTIVE_PANEL",
                    payload: v as typeof panels.activePanel,
                  })
                }
                className="flex-1 flex flex-col min-h-0"
              >
                {/* Workflow step tabs */}
                <div className="border-b border-border">
                  <TabsList className="flex items-center px-4 h-11 bg-transparent rounded-none w-full justify-start gap-0">
                    {(
                      [
                        {
                          value: "editor" as const,
                          icon: FileText,
                          label: "Your Data",
                          step: 1,
                        },
                        {
                          value: "history" as const,
                          icon: Sparkles,
                          label: "AI Enhance",
                          step: 2,
                        },
                        {
                          value: "templates" as const,
                          icon: Palette,
                          label: "Design & Export",
                          step: 3,
                        },
                      ] as const
                    ).map((tab, i) => {
                      const isActive = panels.activePanel === tab.value;
                      const workflowSteps = [
                        "editor",
                        "history",
                        "templates",
                      ] as const;
                      const activeStepIdx = workflowSteps.indexOf(
                        panels.activePanel as (typeof workflowSteps)[number],
                      );
                      const isPast = activeStepIdx > i;

                      return (
                        <div key={tab.value} className="flex items-center">
                          {i > 0 && (
                            <div
                              className={cn(
                                "w-8 h-px mx-1 transition-colors",
                                isPast ? "bg-primary/40" : "bg-border",
                              )}
                            />
                          )}
                          <TabsTrigger
                            value={tab.value}
                            className={cn(
                              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                              "bg-transparent shadow-none border-0 outline-none",
                              "hover:bg-muted/60",
                              "data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none",
                              !isActive && "text-muted-foreground",
                            )}
                          >
                            <div
                              className={cn(
                                "h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors",
                                isActive
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : isPast
                                    ? "bg-primary/20 text-primary border-primary/30"
                                    : "border-muted-foreground/30 text-muted-foreground",
                              )}
                            >
                              {tab.step}
                            </div>
                            <span className="hidden sm:inline">
                              {tab.label}
                            </span>
                          </TabsTrigger>
                        </div>
                      );
                    })}
                  </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <TabsContent value="editor" className="m-0 p-4">
                    <CVEditorPanel />
                  </TabsContent>
                  <TabsContent value="templates" className="m-0 p-4">
                    <TemplatePanel />
                  </TabsContent>
                  <TabsContent value="history" className="m-0 p-4">
                    <GeneratePanel />
                  </TabsContent>
                  <TabsContent value="export" className="m-0 p-4">
                    <HistoryPanel />
                  </TabsContent>
                  <TabsContent value="storage" className="m-0 p-4">
                    <StorageManagerPanel />
                  </TabsContent>
                  <TabsContent value="faq" className="m-0 p-4">
                    <FAQPanel />
                  </TabsContent>
                </div>
              </Tabs>
            </ResizablePanel>

            {/* Resizable Handle */}
            {panels.showPreview && (
              <>
                <ResizableHandle withHandle className="bg-border/50" />

                {/* Right Panel - Preview */}
                <ResizablePanel defaultSize={50} minSize={30}>
                  <PreviewPanel />
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>
      </div>
    </TooltipProvider>
  );
}

// Sidebar Button Component
interface SidebarButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  step?: number;
  active?: boolean;
  badge?: string;
  onClick?: () => void;
}

function SidebarButton({
  icon: Icon,
  label,
  step,
  active,
  badge,
  onClick,
}: SidebarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={cn(
            "w-10 h-10 relative flex items-center justify-center rounded-lg transition-all duration-200",
            "text-muted-foreground hover:text-foreground hover:bg-muted/60",
            active && [
              "text-primary bg-primary/10 hover:bg-primary/15 hover:text-primary",
              "ring-1 ring-primary/20",
            ],
          )}
          onClick={onClick}
        >
          {/* Active left indicator */}
          {active && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-primary" />
          )}
          {step ? (
            <div
              className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold border transition-colors",
                active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-muted-foreground/30",
              )}
            >
              {step}
            </div>
          ) : (
            <Icon
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                active && "scale-110",
              )}
            />
          )}
          {badge && (
            <span className="absolute -top-1 -right-1 h-4 min-w-4 px-0.5 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center animate-pulse">
              {badge}
            </span>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">
        {step && (
          <span className="text-muted-foreground mr-1">Step {step}:</span>
        )}
        {label}
      </TooltipContent>{" "}
    </Tooltip>
  );
}
