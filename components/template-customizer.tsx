"use client"

import { useState } from "react"
import type { TemplateCustomization, ColorPalette } from "@/lib/types"
import { getDefaultColorPalettes } from "@/lib/storage"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Palette, Type, Space } from "lucide-react"

interface TemplateCustomizerProps {
  customization: TemplateCustomization
  onChange: (customization: TemplateCustomization) => void
}

export function TemplateCustomizer({ customization, onChange }: TemplateCustomizerProps) {
  const [showCustomPalette, setShowCustomPalette] = useState(false)
  const palettes = getDefaultColorPalettes()

  const fonts = [
    { value: "Inter, sans-serif", label: "Inter (Sans-serif)" },
    { value: "Georgia, serif", label: "Georgia (Serif)" },
    { value: "Courier New, monospace", label: "Courier (Monospace)" },
    { value: "Arial, sans-serif", label: "Arial (Sans-serif)" },
    { value: "Times New Roman, serif", label: "Times (Serif)" },
  ]

  const handlePaletteSelect = (palette: ColorPalette) => {
    onChange({ ...customization, colorPalette: palette })
    setShowCustomPalette(false)
  }

  const handleCustomColorChange = (key: keyof ColorPalette, value: string) => {
    if (key === "id" || key === "name") return
    onChange({
      ...customization,
      colorPalette: {
        ...customization.colorPalette,
        [key]: value,
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* Color Palettes */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-primary" />
          <Label className="text-sm font-bold">Color Palette</Label>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {palettes.map((palette) => (
            <Card
              key={palette.id}
              className={`p-3 cursor-pointer transition-all hover:border-primary ${
                customization.colorPalette.id === palette.id ? "border-primary bg-primary/10" : "border-border"
              }`}
              onClick={() => handlePaletteSelect(palette)}
            >
              <div className="text-xs font-medium mb-2">{palette.name}</div>
              <div className="flex gap-1">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: palette.primary }} />
                <div className="w-6 h-6 rounded" style={{ backgroundColor: palette.secondary }} />
                <div className="w-6 h-6 rounded" style={{ backgroundColor: palette.accent }} />
              </div>
            </Card>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full bg-transparent"
          onClick={() => setShowCustomPalette(!showCustomPalette)}
        >
          {showCustomPalette ? "Hide" : "Show"} Custom Colors
        </Button>

        {showCustomPalette && (
          <div className="space-y-2 p-3 border border-border rounded-lg bg-card/50">
            {(["primary", "secondary", "accent", "background", "text", "textSecondary"] as const).map((key) => (
              <div key={key} className="flex items-center gap-2">
                <Label className="text-xs w-24 capitalize">{key}</Label>
                <Input
                  type="color"
                  value={customization.colorPalette[key]}
                  onChange={(e) => handleCustomColorChange(key, e.target.value)}
                  className="w-16 h-8 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={customization.colorPalette[key]}
                  onChange={(e) => handleCustomColorChange(key, e.target.value)}
                  className="flex-1 h-8 text-xs font-mono"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Font Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4 text-primary" />
          <Label className="text-sm font-bold">Font Family</Label>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {fonts.map((font) => (
            <Card
              key={font.value}
              className={`p-2 cursor-pointer transition-all hover:border-primary ${
                customization.fontFamily === font.value ? "border-primary bg-primary/10" : "border-border"
              }`}
              onClick={() => onChange({ ...customization, fontFamily: font.value })}
            >
              <div className="text-xs" style={{ fontFamily: font.value }}>
                {font.label}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Font Sizes */}
      <div className="space-y-3">
        <Label className="text-sm font-bold">Font Sizes</Label>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">Base: {customization.fontSize.base}px</Label>
            <Slider
              value={[customization.fontSize.base]}
              onValueChange={([value]) =>
                onChange({ ...customization, fontSize: { ...customization.fontSize, base: value } })
              }
              min={12}
              max={18}
              step={1}
              className="mt-2"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Heading: {customization.fontSize.heading}px</Label>
            <Slider
              value={[customization.fontSize.heading]}
              onValueChange={([value]) =>
                onChange({ ...customization, fontSize: { ...customization.fontSize, heading: value } })
              }
              min={20}
              max={36}
              step={2}
              className="mt-2"
            />
          </div>
        </div>
      </div>

      {/* Spacing */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Space className="h-4 w-4 text-primary" />
          <Label className="text-sm font-bold">Spacing</Label>
        </div>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">Section: {customization.spacing.section}px</Label>
            <Slider
              value={[customization.spacing.section]}
              onValueChange={([value]) =>
                onChange({ ...customization, spacing: { ...customization.spacing, section: value } })
              }
              min={16}
              max={48}
              step={4}
              className="mt-2"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Item: {customization.spacing.item}px</Label>
            <Slider
              value={[customization.spacing.item]}
              onValueChange={([value]) =>
                onChange({ ...customization, spacing: { ...customization.spacing, item: value } })
              }
              min={8}
              max={24}
              step={2}
              className="mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
