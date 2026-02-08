"use client";

import { useState, useEffect } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Settings2,
  PanelLeftClose,
  PanelLeft,
  Eye,
  EyeOff,
  Download,
  Save,
  Upload,
  Bot,
  Zap,
  ChevronRight,
} from "lucide-react";
import { useCVStore } from "@/lib/cv-store";
import { CVEditorPanel } from "@/components/panels/cv-editor-panel";
import { TemplatePanel } from "@/components/panels/template-panel";
import { GeneratePanel } from "@/components/panels/generate-panel";
import { HistoryPanel } from "@/components/panels/history-panel";
import { PreviewPanel } from "@/components/panels/preview-panel";
import { AIConfigSheet } from "@/components/sheets/ai-config-sheet";
import { ExportSheet } from "@/components/sheets/export-sheet";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  className?: string;
}

export function MainLayout({ className }: MainLayoutProps) {
  const { state, dispatch, saveToStorage, loadFromStorage } = useCVStore();
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
          </div>

          <div className="flex items-center gap-2">
            {/* AI Status */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-colors",
                    isConnected
                      ? "bg-green-500/10 text-green-500"
                      : "bg-muted text-muted-foreground",
                  )}
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
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {isConnected
                  ? `Connected to ${aiConfig.provider}`
                  : "AI not connected"}
              </TooltipContent>
            </Tooltip>

            {/* Theme Switcher */}
            <ThemeSwitcher />

            {/* AI Config Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Settings2 className="h-4 w-4" />
                </Button>
              </SheetTrigger>
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

            {/* Export Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Download className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Export CV
                  </SheetTitle>
                </SheetHeader>
                <ExportSheet />
              </SheetContent>
            </Sheet>

            {/* Save Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isDirty ? "default" : "ghost"}
                  size="icon"
                  className="h-9 w-9"
                  onClick={saveToStorage}
                >
                  <Save className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save changes</TooltipContent>
            </Tooltip>

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
          <aside
            className={cn(
              "border-r border-border bg-card/30 transition-all duration-300 flex flex-col",
              panels.showSidebar ? "w-14" : "w-0",
            )}
          >
            <nav className="flex-1 py-4 flex flex-col items-center gap-1">
              <SidebarButton
                icon={FileText}
                label="Editor"
                active={panels.activePanel === "editor"}
                onClick={() =>
                  dispatch({ type: "SET_ACTIVE_PANEL", payload: "editor" })
                }
              />
              <SidebarButton
                icon={Palette}
                label="Templates"
                active={panels.activePanel === "templates"}
                onClick={() =>
                  dispatch({ type: "SET_ACTIVE_PANEL", payload: "templates" })
                }
              />
              <SidebarButton
                icon={Sparkles}
                label="Generate"
                active={panels.activePanel === "history"}
                badge={isGenerating ? "..." : undefined}
                onClick={() =>
                  dispatch({ type: "SET_ACTIVE_PANEL", payload: "history" })
                }
              />
              <SidebarButton
                icon={History}
                label="History"
                active={panels.activePanel === "export"}
                onClick={() =>
                  dispatch({ type: "SET_ACTIVE_PANEL", payload: "export" })
                }
              />
            </nav>

            <div className="p-2 border-t border-border">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-10 h-10"
                    onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })}
                  >
                    {panels.showSidebar ? (
                      <PanelLeftClose className="h-4 w-4" />
                    ) : (
                      <PanelLeft className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {panels.showSidebar ? "Collapse sidebar" : "Expand sidebar"}
                </TooltipContent>
              </Tooltip>
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
                className="flex-1 flex flex-col"
              >
                <div className="border-b border-border px-2">
                  <TabsList className="h-11 bg-transparent p-0 gap-1">
                    {[
                      {
                        value: "editor" as const,
                        icon: FileText,
                        label: "Editor",
                      },
                      {
                        value: "templates" as const,
                        icon: Palette,
                        label: "Templates",
                      },
                      {
                        value: "history" as const,
                        icon: Sparkles,
                        label: "Generate",
                      },
                      {
                        value: "export" as const,
                        icon: History,
                        label: "History",
                      },
                    ].map((tab) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className={cn(
                          "relative h-11 px-3 rounded-none bg-transparent shadow-none transition-colors duration-200",
                          "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                          "data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none",
                          "after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:rounded-full after:transition-all after:duration-300",
                          "after:bg-primary data-[state=active]:after:w-[calc(100%-12px)] after:w-0",
                        )}
                      >
                        <tab.icon className="h-3.5 w-3.5 mr-1.5" />
                        <span className="text-xs font-medium">{tab.label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <ScrollArea className="flex-1">
                  <TabsContent value="editor" className="m-0 p-4 h-full">
                    <CVEditorPanel />
                  </TabsContent>
                  <TabsContent value="templates" className="m-0 p-4 h-full">
                    <TemplatePanel />
                  </TabsContent>
                  <TabsContent value="history" className="m-0 p-4 h-full">
                    <GeneratePanel />
                  </TabsContent>
                  <TabsContent value="export" className="m-0 p-4 h-full">
                    <HistoryPanel />
                  </TabsContent>
                </ScrollArea>
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
  active?: boolean;
  badge?: string;
  onClick?: () => void;
}

function SidebarButton({
  icon: Icon,
  label,
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
          <Icon
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              active && "scale-110",
            )}
          />
          {badge && (
            <span className="absolute -top-1 -right-1 h-4 min-w-4 px-0.5 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center animate-pulse">
              {badge}
            </span>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
