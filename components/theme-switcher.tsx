"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Terminal, Moon, Sun, Laptop, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const THEMES = [
  {
    id: "light",
    label: "Console Light",
    description: "Warm terminal, light background",
    icon: Sun,
    preview: [
      "bg-[oklch(0.96_0.01_85)]",
      "bg-[oklch(0.35_0.12_142)]",
      "bg-[oklch(0.55_0.12_60)]",
    ],
  },
  {
    id: "dark",
    label: "Console Dark",
    description: "Classic terminal, black & green",
    icon: Terminal,
    preview: [
      "bg-[oklch(0.1_0_0)]",
      "bg-[oklch(0.85_0.12_142)]",
      "bg-[oklch(0.75_0.15_60)]",
    ],
  },
  {
    id: "modern",
    label: "Modern",
    description: "Clean professional, sans-serif",
    icon: Laptop,
    preview: [
      "bg-[oklch(0.985_0.002_265)]",
      "bg-[oklch(0.55_0.18_260)]",
      "bg-[oklch(0.65_0.15_170)]",
    ],
  },
] as const;

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const current = THEMES.find((t) => t.id === theme) ?? THEMES[1];
  const CurrentIcon = current.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 hover:bg-secondary"
        >
          {mounted ? (
            <CurrentIcon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Theme
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {THEMES.map((t) => {
          const Icon = t.icon;
          const isActive = theme === t.id;
          return (
            <DropdownMenuItem
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={cn(
                "cursor-pointer flex items-center gap-3 py-2.5",
                isActive && "bg-accent",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{t.label}</div>
                <div className="text-xs text-muted-foreground">
                  {t.description}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {/* Color dots preview */}
                <div className="flex gap-0.5 mr-1">
                  {t.preview.map((color, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-3 w-3 rounded-full border border-border/50",
                        color,
                      )}
                    />
                  ))}
                </div>
                {isActive && <Check className="h-4 w-4 text-primary" />}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
