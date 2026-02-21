"use client";

import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";

/**
 * Branded loading spinner for CV Generator.
 * Shows an animated logo + pulsing dots.
 * Use directly or as Next.js loading boundary.
 *
 * @param fullScreen - fill viewport (default: true)
 * @param label - optional loading text
 */
export function CVLoading({
  fullScreen = true,
  label,
}: {
  fullScreen?: boolean;
  label?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6",
        fullScreen && "min-h-screen",
      )}
    >
      {/* Animated logo */}
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute -inset-4 rounded-full bg-primary/10 animate-ping" />
        <div className="absolute -inset-4 rounded-full bg-primary/5 animate-pulse" />

        {/* Logo container */}
        <div
          className={cn(
            "relative h-16 w-16 rounded-2xl flex items-center justify-center",
            "bg-gradient-to-br from-primary/20 to-primary/5",
            "border border-primary/15 shadow-lg shadow-primary/10",
            "animate-[logoSpin_3s_ease-in-out_infinite]",
          )}
        >
          <FileText className="h-8 w-8 text-primary" />
        </div>
      </div>

      {/* Brand name */}
      <div className="text-center space-y-2">
        <p className="text-sm font-semibold text-foreground tracking-tight">
          CV Generator
        </p>

        {/* Loading dots */}
        <div className="flex items-center justify-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-primary/60"
              style={{
                animation: "loadDot 1.4s ease-in-out infinite",
                animationDelay: `${i * 0.16}s`,
              }}
            />
          ))}
        </div>

        {label && (
          <p className="text-xs text-muted-foreground mt-1">{label}</p>
        )}
      </div>

      <style jsx>{`
        @keyframes logoSpin {
          0%, 100% {
            transform: scale(1) rotate(0deg);
          }
          25% {
            transform: scale(1.05) rotate(-2deg);
          }
          50% {
            transform: scale(1) rotate(0deg);
          }
          75% {
            transform: scale(1.05) rotate(2deg);
          }
        }
        @keyframes loadDot {
          0%, 80%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}
