"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log for debugging in production
    console.error("[cv-gen] App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,theme(colors.destructive/0.2),transparent_60%)]" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-destructive/10 blur-3xl" />

        <div className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-4 py-1 text-xs uppercase tracking-widest text-destructive">
            <AlertTriangle className="h-3.5 w-3.5" />
            System Fault
          </div>

          <h1 className="text-3xl font-semibold sm:text-4xl">
            The editor hit a turbulence pocket.
          </h1>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base">
            We captured the fault and froze the workbench to protect your data.
            Try a reset or return home.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Button onClick={reset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Retry
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link href="/">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>

          <div className="mt-10 w-full rounded-xl border border-border bg-card/50 p-4 text-left text-xs text-muted-foreground">
            <div className="font-mono">Fault: {error.name}</div>
            <div className="font-mono">Digest: {error.digest || "unknown"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
