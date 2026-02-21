"use client";

import { useState } from "react";
import { useCVStore, TEMPLATES, COLOR_PALETTES, LAYOUTS } from "@/lib/cv-store";
import type {
  TemplatePaletteColors,
  FavoritePreset,
  SavedPalette,
} from "@/lib/cv-store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Check,
  Palette,
  Layout,
  Pipette,
  Heart,
  Star,
  Trash2,
  Save,
  ArrowUp,
  ArrowDown,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function TemplatePanel() {
  const { state, dispatch, saveToStorage } = useCVStore();
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

  // Favorite preset name input
  const [favoriteName, setFavoriteName] = useState("");
  const [showFavoriteInput, setShowFavoriteInput] = useState(false);

  // Custom palette save name
  const [paletteSaveName, setPaletteSaveName] = useState("");
  const [showPaletteSave, setShowPaletteSave] = useState(false);

  const handleCustomColorChange = (
    key: keyof TemplatePaletteColors,
    value: string,
  ) => {
    const next = { ...customColors, [key]: value };
    setCustomColors(next);
    dispatch({ type: "SET_CUSTOM_PALETTE", payload: next });
  };

  const isCustomActive = selectedPalette === "custom";

  // ── Favorites ──
  const handleSaveFavorite = () => {
    const name =
      favoriteName.trim() ||
      `${TEMPLATES.find((t) => t.id === selectedTemplate)?.name} · ${LAYOUTS.find((l) => l.id === selectedLayout)?.name}`;
    const preset: FavoritePreset = {
      id: `fav-${Date.now()}`,
      name,
      templateId: selectedTemplate,
      layoutId: selectedLayout,
      paletteId: selectedPalette,
      customPalette: selectedPalette === "custom" ? customColors : null,
      priority: state.favoritePresets.length,
      createdAt: Date.now(),
    };
    dispatch({ type: "ADD_FAVORITE_PRESET", payload: preset });
    setFavoriteName("");
    setShowFavoriteInput(false);
    toast.success(`Favorite "${name}" saved`);
    // Persist immediately
    setTimeout(() => saveToStorage(), 0);
  };

  const handleApplyFavorite = (preset: FavoritePreset) => {
    dispatch({ type: "APPLY_FAVORITE_PRESET", payload: preset });
    if (preset.customPalette) {
      setCustomColors(preset.customPalette);
    }
    toast.success(`Applied "${preset.name}"`);
  };

  const handleRemoveFavorite = (id: string) => {
    dispatch({ type: "REMOVE_FAVORITE_PRESET", payload: id });
    setTimeout(() => saveToStorage(), 0);
  };

  const handleMoveFavorite = (idx: number, dir: -1 | 1) => {
    const list = [...state.favoritePresets];
    const target = idx + dir;
    if (target < 0 || target >= list.length) return;
    [list[idx], list[target]] = [list[target], list[idx]];
    list.forEach((f, i) => (f.priority = i));
    dispatch({ type: "REORDER_FAVORITE_PRESETS", payload: list });
    setTimeout(() => saveToStorage(), 0);
  };

  // ── Custom Palette Save ──
  const handleSaveCustomPalette = () => {
    const name =
      paletteSaveName.trim() || `Custom ${state.savedPalettes.length + 1}`;
    const saved: SavedPalette = {
      id: `sp-${Date.now()}`,
      name,
      colors: { ...customColors },
      createdAt: Date.now(),
    };
    dispatch({ type: "ADD_SAVED_PALETTE", payload: saved });
    setPaletteSaveName("");
    setShowPaletteSave(false);
    toast.success(`Palette "${name}" saved`);
    setTimeout(() => saveToStorage(), 0);
  };

  const handleDeleteSavedPalette = (id: string) => {
    dispatch({ type: "REMOVE_SAVED_PALETTE", payload: id });
    setTimeout(() => saveToStorage(), 0);
  };

  // Merge built-in + saved palettes for display
  const allPalettes = [
    ...COLOR_PALETTES,
    ...state.savedPalettes.map((sp) => ({
      id: sp.id,
      name: sp.name,
      colors: sp.colors,
      _saved: true as const,
    })),
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="templates" className="gap-1.5 text-xs">
            <Layout className="h-3.5 w-3.5" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="colors" className="gap-1.5 text-xs">
            <Palette className="h-3.5 w-3.5" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="favorites" className="gap-1.5 text-xs">
            <Star className="h-3.5 w-3.5" />
            Favorites
            {state.favoritePresets.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 h-4 px-1 text-[10px] leading-none"
              >
                {state.favoritePresets.length}
              </Badge>
            )}
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
            {/* Preset + saved palettes – compact 3-col grid */}
            <div className="grid grid-cols-3 gap-2">
              {allPalettes.map((palette) => {
                const isSaved = "_saved" in palette;
                const isActive = isSaved
                  ? selectedPalette === "custom" &&
                    state.customPalette?.primary === palette.colors.primary &&
                    state.customPalette?.secondary ===
                      palette.colors.secondary &&
                    state.customPalette?.accent === palette.colors.accent
                  : selectedPalette === palette.id;

                return (
                  <div
                    key={palette.id}
                    className={cn(
                      "group relative rounded-lg border text-left transition-all hover:shadow-md overflow-hidden",
                      isActive
                        ? "ring-2 ring-primary border-primary"
                        : "border-border hover:border-muted-foreground/30",
                    )}
                  >
                    <button
                      className="w-full text-left"
                      onClick={() => {
                        if (isSaved) {
                          // Apply saved palette as custom palette with its colors
                          dispatch({
                            type: "SET_CUSTOM_PALETTE",
                            payload: palette.colors,
                          });
                          setCustomColors(palette.colors);
                        } else {
                          dispatch({
                            type: "SET_PALETTE_ID",
                            payload: palette.id,
                          });
                        }
                      }}
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
                          {isSaved && (
                            <Heart className="inline h-2.5 w-2.5 mr-0.5 text-pink-500 fill-pink-500" />
                          )}
                          {palette.name}
                        </span>
                        {isActive && (
                          <div className="h-4 w-4 shrink-0 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-2.5 w-2.5 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    </button>
                    {/* Delete button for saved palettes */}
                    {isSaved && (
                      <button
                        className="absolute top-0.5 right-0.5 h-5 w-5 rounded-full bg-destructive/80 text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSavedPalette(palette.id);
                        }}
                        title="Delete saved palette"
                      >
                        <Trash2 className="h-2.5 w-2.5" />
                      </button>
                    )}
                  </div>
                );
              })}
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

              {/* Save custom palette button */}
              {isCustomActive && (
                <div className="pt-1 border-t border-border/50">
                  {showPaletteSave ? (
                    <div className="flex items-center gap-1.5">
                      <Input
                        value={paletteSaveName}
                        onChange={(e) => setPaletteSaveName(e.target.value)}
                        placeholder="Palette name (optional)"
                        className="h-7 text-xs flex-1"
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSaveCustomPalette()
                        }
                        autoFocus
                      />
                      <Button
                        size="sm"
                        variant="default"
                        className="h-7 px-2 text-xs"
                        onClick={handleSaveCustomPalette}
                      >
                        <Save className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs"
                        onClick={() => setShowPaletteSave(false)}
                      >
                        ✕
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full h-7 text-xs gap-1"
                      onClick={() => setShowPaletteSave(true)}
                    >
                      <Save className="h-3 w-3" />
                      Save this palette
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ── Favorites ── */}
        <TabsContent value="favorites" className="mt-0">
          <div className="max-h-[60vh] overflow-y-auto pr-1 space-y-3">
            {/* Save current as favorite */}
            <div className="rounded-lg border border-dashed border-border p-3">
              {showFavoriteInput ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Save current template + layout + colors as a favorite
                    preset:
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Input
                      value={favoriteName}
                      onChange={(e) => setFavoriteName(e.target.value)}
                      placeholder="Preset name (optional)"
                      className="h-7 text-xs flex-1"
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSaveFavorite()
                      }
                      autoFocus
                    />
                    <Button
                      size="sm"
                      variant="default"
                      className="h-7 px-2 text-xs"
                      onClick={handleSaveFavorite}
                    >
                      <Save className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-xs"
                      onClick={() => setShowFavoriteInput(false)}
                    >
                      ✕
                    </Button>
                  </div>
                  {/* Mini preview of what will be saved */}
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <Badge variant="outline" className="text-[10px] py-0 h-5">
                      {TEMPLATES.find((t) => t.id === selectedTemplate)?.name}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] py-0 h-5">
                      {LAYOUTS.find((l) => l.id === selectedLayout)?.name}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-[10px] py-0 h-5 gap-1"
                    >
                      {selectedPalette === "custom"
                        ? "Custom"
                        : allPalettes.find((p) => p.id === selectedPalette)
                            ?.name || selectedPalette}
                      <span className="flex gap-px">
                        {(() => {
                          const colors =
                            selectedPalette === "custom"
                              ? customColors
                              : allPalettes.find(
                                  (p) => p.id === selectedPalette,
                                )?.colors;
                          if (!colors) return null;
                          return (
                            <>
                              <span
                                className="inline-block h-2.5 w-2.5 rounded-full border border-border/50"
                                style={{ backgroundColor: colors.primary }}
                              />
                              <span
                                className="inline-block h-2.5 w-2.5 rounded-full border border-border/50"
                                style={{ backgroundColor: colors.accent }}
                              />
                            </>
                          );
                        })()}
                      </span>
                    </Badge>
                  </div>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full h-8 text-xs gap-1.5"
                  onClick={() => setShowFavoriteInput(true)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Save current configuration as favorite
                </Button>
              )}
            </div>

            {/* Favorites list */}
            {state.favoritePresets.length === 0 ? (
              <div className="text-center py-8">
                <Star className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">
                  No favorites yet
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Save your preferred template + layout + color combinations
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {state.favoritePresets
                  .sort((a, b) => a.priority - b.priority)
                  .map((preset, idx) => {
                    const tmpl = TEMPLATES.find(
                      (t) => t.id === preset.templateId,
                    );
                    const layout = LAYOUTS.find(
                      (l) => l.id === preset.layoutId,
                    );
                    const palette =
                      preset.paletteId === "custom"
                        ? null
                        : allPalettes.find((p) => p.id === preset.paletteId);
                    const colors =
                      preset.customPalette || palette?.colors || null;
                    const isActive =
                      selectedTemplate === preset.templateId &&
                      selectedLayout === preset.layoutId &&
                      (selectedPalette === preset.paletteId ||
                        (preset.paletteId === "custom" &&
                          selectedPalette === "custom"));

                    return (
                      <div
                        key={preset.id}
                        className={cn(
                          "group rounded-lg border transition-all overflow-hidden",
                          isActive
                            ? "ring-2 ring-primary border-primary"
                            : "border-border hover:border-muted-foreground/30 hover:shadow-sm",
                        )}
                      >
                        <button
                          className="w-full text-left p-2.5"
                          onClick={() => handleApplyFavorite(preset)}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <Star className="h-3.5 w-3.5 shrink-0 text-amber-500 fill-amber-500" />
                              <span className="font-medium text-xs truncate">
                                {preset.name}
                              </span>
                            </div>
                            {isActive && (
                              <div className="h-4 w-4 shrink-0 rounded-full bg-primary flex items-center justify-center">
                                <Check className="h-2.5 w-2.5 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <Badge
                              variant="outline"
                              className="text-[10px] py-0 h-4"
                            >
                              {tmpl?.name || preset.templateId}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-[10px] py-0 h-4"
                            >
                              {layout?.icon} {layout?.name || preset.layoutId}
                            </Badge>
                            {colors && (
                              <span className="flex gap-px ml-auto">
                                <span
                                  className="inline-block h-3 w-3 rounded-full border border-border/50"
                                  style={{
                                    backgroundColor: colors.primary,
                                  }}
                                />
                                <span
                                  className="inline-block h-3 w-3 rounded-full border border-border/50"
                                  style={{
                                    backgroundColor: colors.secondary,
                                  }}
                                />
                                <span
                                  className="inline-block h-3 w-3 rounded-full border border-border/50"
                                  style={{
                                    backgroundColor: colors.accent,
                                  }}
                                />
                              </span>
                            )}
                          </div>
                        </button>

                        {/* Controls row */}
                        <div className="flex items-center gap-0.5 px-1.5 pb-1.5 pt-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                className="h-5 w-5 rounded text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveFavorite(idx, -1);
                                }}
                                disabled={idx === 0}
                              >
                                <ArrowUp className="h-3 w-3" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="text-xs">
                              Move up
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                className="h-5 w-5 rounded text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveFavorite(idx, 1);
                                }}
                                disabled={
                                  idx === state.favoritePresets.length - 1
                                }
                              >
                                <ArrowDown className="h-3 w-3" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="text-xs">
                              Move down
                            </TooltipContent>
                          </Tooltip>
                          <div className="flex-1" />
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                className="h-5 w-5 rounded text-destructive hover:text-destructive hover:bg-destructive/10 flex items-center justify-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveFavorite(preset.id);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="text-xs">
                              Delete
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
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
                : allPalettes.find((p) => p.id === selectedPalette)?.name ||
                  selectedPalette}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
