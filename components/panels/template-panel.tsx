"use client";

import { useCVStore, TEMPLATES, COLOR_PALETTES, LAYOUTS } from "@/lib/cv-store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Palette, Layout, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export function TemplatePanel() {
  const { state, dispatch } = useCVStore();
  const selectedTemplate = state.selectedTemplateId;
  const selectedPalette = state.selectedPaletteId;
  const selectedLayout = state.selectedLayoutId;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="templates" className="gap-2 text-xs">
            <Layout className="h-3.5 w-3.5" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="colors" className="gap-2 text-xs">
            <Palette className="h-3.5 w-3.5" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="layout" className="gap-2 text-xs">
            <Eye className="h-3.5 w-3.5" />
            Layout
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-0">
          <div className="grid grid-cols-2 gap-3">
            {TEMPLATES.map((template) => (
              <Card
                key={template.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedTemplate === template.id && "ring-2 ring-primary",
                )}
                onClick={() => dispatch({ type: "SET_TEMPLATE_ID", payload: template.id })}
              >
                <div className={cn("h-32 rounded-t-lg", template.preview)} />
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-sm">{template.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {template.description}
                      </p>
                    </div>
                    {selectedTemplate === template.id && (
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="colors" className="mt-0">
          <div className="grid grid-cols-2 gap-3">
            {COLOR_PALETTES.map((palette) => (
              <Card
                key={palette.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedPalette === palette.id && "ring-2 ring-primary",
                )}
                onClick={() => dispatch({ type: "SET_PALETTE_ID", payload: palette.id })}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div
                        className="h-8 w-8 rounded-full"
                        style={{ backgroundColor: palette.colors.primary }}
                      />
                      <div
                        className="h-8 w-8 rounded-full"
                        style={{ backgroundColor: palette.colors.secondary }}
                      />
                      <div
                        className="h-8 w-8 rounded-full"
                        style={{ backgroundColor: palette.colors.accent }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{palette.name}</h3>
                    </div>
                    {selectedPalette === palette.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="layout" className="mt-0">
          <div className="grid grid-cols-2 gap-3">
            {LAYOUTS.map((layout) => (
              <Card
                key={layout.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedLayout === layout.id && "ring-2 ring-primary",
                )}
                onClick={() => dispatch({ type: "SET_LAYOUT_ID", payload: layout.id })}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-12 w-12 rounded bg-muted flex items-center justify-center text-2xl">
                    {layout.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{layout.name}</h3>
                  </div>
                  {selectedLayout === layout.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Summary */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <h4 className="font-medium text-sm mb-3">Current Configuration</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              Template: {TEMPLATES.find((t) => t.id === selectedTemplate)?.name}
            </Badge>
            <Badge variant="outline">
              Colors:{" "}
              {COLOR_PALETTES.find((p) => p.id === selectedPalette)?.name}
            </Badge>
            <Badge variant="outline">
              Layout: {LAYOUTS.find((l) => l.id === selectedLayout)?.name}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
