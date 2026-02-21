"use client";

import { useState } from "react";
import { useCVStore, TEMPLATES, COLOR_PALETTES, LAYOUTS } from "@/lib/cv-store";
import type { TemplatePaletteColors } from "@/lib/cv-store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, Palette, Layout, Pipette } from "lucide-react";
import { cn } from "@/lib/utils";

export function TemplatePanel() {
  const { state, dispatch } = useCVStore();
  const selectedTemplate = state.selectedTemplateId;
  const selectedPalette = state.selectedPaletteId;
  const selectedLayout = state.selectedLayoutId;

  const [customColors, setCustomColors] = useState<TemplatePaletteColors>(
    state.customPalette ?? {
      primary: "#18181b",
      secondary: "#71717a",
      accent: "#3b82f6",
    },
  );

  const handleCustomColorChange = (
    key: keyof TemplatePaletteColors,
    value: string,
  ) => {
    const next = { ...customColors, [key]: value };
    setCustomColors(next);
    dispatch({ type: "SET_CUSTOM_PALETTE", payload: next });
  };

  const isCustomActive = selectedPalette === "custom";

  return (
    <div className="space-y-6">
      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="templates" className="gap-2 text-xs">
            <Layout className="h-3.5 w-3.5" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="colors" className="gap-2 text-xs">
            <Palette className="h-3.5 w-3.5" />
            Colors
          </TabsTrigger>
        </TabsList>

        {/* ── Templates + Layout ── */}
        <TabsContent value="templates" className="mt-0">
          <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
            {TEMPLATES.map((template) => {
              const isSelected = selectedTemplate === template.id;

              return (
                <div
                  key={template.id}
                  className={cn(
                    "group relative rounded-lg border text-left transition-all hover:shadow-md overflow-hidden",
                    isSelected
                      ? "ring-2 ring-primary border-primary"
                      : "border-border hover:border-muted-foreground/30",
                  )}
                >
                  {/* Template preview + name */}
                  <button
                    className="w-full text-left"
                    onClick={() =>
                      dispatch({
                        type: "SET_TEMPLATE_ID",
                        payload: template.id,
                      })
                    }
                  >
                    <div className={cn("h-12", template.preview)} />
                    <div className="px-2.5 pt-1.5 pb-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-medium text-xs truncate">
                          {template.name}
                        </span>
                        {isSelected && (
                          <div className="h-4 w-4 shrink-0 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-2.5 w-2.5 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate leading-tight">
                        {template.description}
                      </p>
                    </div>
                  </button>

                  {/* Layout picker row */}
                  <div className="flex items-center gap-0.5 px-2.5 pb-2 pt-0.5">
                    {LAYOUTS.map((layout) => {
                      const isLayoutActive =
                        isSelected && selectedLayout === layout.id;
                      return (
                        <Tooltip key={layout.id}>
                          <TooltipTrigger asChild>
                            <button
                              className={cn(
                                "flex-1 h-6 rounded text-sm flex items-center justify-center transition-all",
                                isLayoutActive
                                  ? "bg-primary text-primary-foreground shadow-sm"
                                  : isSelected
                                    ? "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                                    : "bg-muted/50 text-muted-foreground/50",
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                // Select both template and layout
                                if (!isSelected) {
                                  dispatch({
                                    type: "SET_TEMPLATE_ID",
                                    payload: template.id,
                                  });
                                }
                                dispatch({
                                  type: "SET_LAYOUT_ID",
                                  payload: layout.id,
                                });
                              }}
                            >
                              <span className="text-[13px] leading-none">
                                {layout.icon}
                              </span>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="text-xs">
                            {layout.name}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* ── Colors ── */}
        <TabsContent value="colors" className="mt-0">
          <div className="max-h-[60vh] overflow-y-auto pr-1 space-y-3">
            {/* Preset palettes – compact 3-col grid */}
            <div className="grid grid-cols-3 gap-2">
              {COLOR_PALETTES.map((palette) => (
                <button
                  key={palette.id}
                  className={cn(
                    "group relative rounded-lg border text-left transition-all hover:shadow-md overflow-hidden",
                    selectedPalette === palette.id
                      ? "ring-2 ring-primary border-primary"
                      : "border-border hover:border-muted-foreground/30",
                  )}
                  onClick={() =>
                    dispatch({ type: "SET_PALETTE_ID", payload: palette.id })
                  }
                >
                  {/* Color bar preview */}
                  <div className="flex h-6">
                    <div
                      className="flex-1"
                      style={{ backgroundColor: palette.colors.primary }}
                    />
                    <div
                      className="flex-1"
                      style={{ backgroundColor: palette.colors.secondary }}
                    />
                    <div
                      className="flex-1"
                      style={{ backgroundColor: palette.colors.accent }}
                    />
                  </div>
                  <div className="px-2 py-1.5 flex items-center justify-between gap-1">
                    <span className="font-medium text-xs truncate">
                      {palette.name}
                    </span>
                    {selectedPalette === palette.id && (
                      <div className="h-4 w-4 shrink-0 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-2.5 w-2.5 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Custom palette picker */}
            <div
              className={cn(
                "rounded-lg border p-3 space-y-3 transition-all",
                isCustomActive
                  ? "ring-2 ring-primary border-primary"
                  : "border-border",
              )}
            >
              <button
                className="flex items-center gap-2 w-full text-left"
                onClick={() =>
                  dispatch({
                    type: "SET_CUSTOM_PALETTE",
                    payload: customColors,
                  })
                }
              >
                <Pipette className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">Custom Palette</span>
                {isCustomActive && (
                  <div className="ml-auto h-4 w-4 shrink-0 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-2.5 w-2.5 text-primary-foreground" />
                  </div>
                )}
              </button>

              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { key: "primary", label: "Primary" },
                    { key: "secondary", label: "Secondary" },
                    { key: "accent", label: "Accent" },
                  ] as const
                ).map(({ key, label }) => (
                  <label key={key} className="space-y-1 cursor-pointer">
                    <span className="text-[10px] text-muted-foreground block text-center">
                      {label}
                    </span>
                    <div className="relative mx-auto w-10 h-10 rounded-full overflow-hidden border border-border shadow-sm">
                      <input
                        type="color"
                        value={customColors[key]}
                        onChange={(e) =>
                          handleCustomColorChange(key, e.target.value)
                        }
                        className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                      />
                      <div
                        className="w-full h-full rounded-full"
                        style={{ backgroundColor: customColors[key] }}
                      />
                    </div>
                    <span className="text-[9px] text-muted-foreground/70 block text-center font-mono">
                      {customColors[key]}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Summary */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <h4 className="font-medium text-sm mb-3">Current Configuration</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              {TEMPLATES.find((t) => t.id === selectedTemplate)?.name} ·{" "}
              {LAYOUTS.find((l) => l.id === selectedLayout)?.name}
            </Badge>
            <Badge variant="outline">
              Colors:{" "}
              {selectedPalette === "custom"
                ? "Custom"
                : COLOR_PALETTES.find((p) => p.id === selectedPalette)?.name}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
