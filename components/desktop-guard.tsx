"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Monitor, MoveRight, Zap } from "lucide-react";

const MIN_DESKTOP_WIDTH = 1024;

export function DesktopGuard({ children }: { children: React.ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const check = () => {
      setIsDesktop(window.innerWidth >= MIN_DESKTOP_WIDTH);
    };

    check();

    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!isMounted) return children;
  if (isDesktop) return children;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,theme(colors.primary/0.2),transparent_60%)]" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs uppercase tracking-widest text-primary">
            <Zap className="h-3.5 w-3.5" />
            Workbench Locked
          </div>

          <h1 className="text-3xl font-semibold sm:text-4xl">
            This forge runs only on full-size screens.
          </h1>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base">
            The CV Generator is a precision tool. For a stable editor, open this
            on a desktop or laptop. Mobile layouts risk data loss and broken
            controls, so we keep the workbench closed here.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Button asChild className="gap-2">
              <Link href="/">
                Back to Home
                <MoveRight className="h-4 w-4" />
              </Link>
            </Button>
            <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
              <Monitor className="h-4 w-4" />
              Requires at least 1024px width
            </div>
          </div>

          <div className="mt-10 w-full rounded-xl border border-border bg-card/50 p-4 text-left text-xs text-muted-foreground">
            <div className="font-mono">Status: MOBILE_VIEW_DISABLED</div>
            <div className="font-mono">
              Hint: Open on desktop for AI workflows
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
