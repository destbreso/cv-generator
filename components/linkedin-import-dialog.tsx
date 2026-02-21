"use client";

import { useState, useCallback, useRef } from "react";
import { useCVStore } from "@/lib/cv-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Linkedin,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { InlineAIConfig } from "@/components/inline-ai-config";

interface LinkedInImportDialogProps {
  externalOpen?: boolean;
  onExternalOpenChange?: (open: boolean) => void;
}

export function LinkedInImportDialog({
  externalOpen,
  onExternalOpenChange,
}: LinkedInImportDialogProps = {}) {
  const { state, importFromLinkedIn, cancelLinkedInImport } = useCVStore();
  const { isImportingLinkedIn, linkedInImportStatus, isConnected } = state;
  const [internalOpen, setInternalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;
  const setOpen = isControlled
    ? (v: boolean) => onExternalOpenChange?.(v)
    : setInternalOpen;

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type === "application/pdf") {
        setSelectedFile(file);
      }
    },
    [],
  );

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleImport = useCallback(async () => {
    if (!selectedFile) return;
    await importFromLinkedIn(selectedFile);
    // Auto-close only on success (the status check happens after the async call resolves)
  }, [selectedFile, importFromLinkedIn]);

  const isError = linkedInImportStatus.startsWith("Error:");
  const isDone = linkedInImportStatus === "Import complete!";
  const isCancelled = linkedInImportStatus === "Import cancelled.";

  const stages = [
    { key: "Extracting", label: "Extraction" },
    { key: "analyzing", label: "Interpretation" },
    { key: "Structuring", label: "Structuring" },
  ];

  const activeStageIndex = stages.findIndex((stage) =>
    linkedInImportStatus.includes(stage.key),
  );

  // Estimate progress from status
  let progressValue = 0;
  if (linkedInImportStatus.includes("Extracting")) progressValue = 15;
  else if (linkedInImportStatus.includes("analyzing")) progressValue = 35;
  else if (linkedInImportStatus.includes("Structuring")) progressValue = 65;
  else if (isDone) progressValue = 100;
  else if (isError) progressValue = 100;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Linkedin className="h-5 w-5 text-[#0A66C2]" />
            Import from PDF
          </DialogTitle>
          <DialogDescription>
            Upload a resume PDF and AI will extract and structure your CV data
            automatically. Optimized for LinkedIn profile exports.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Instructions */}
          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <p className="text-sm font-medium">
              How to download your LinkedIn PDF:
            </p>
            <ol className="text-sm text-muted-foreground space-y-1.5 list-decimal list-inside">
              <li>Go to your LinkedIn profile page</li>
              <li>
                Click the <strong>&quot;More&quot;</strong> button (next to
                &quot;Open to&quot;)
              </li>
              <li>
                Select <strong>&quot;Save to PDF&quot;</strong>
              </li>
              <li>Upload the downloaded PDF here</li>
            </ol>
            <a
              href="https://www.linkedin.com/in/me/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#0A66C2] hover:underline mt-1"
            >
              Open your LinkedIn profile
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* File drop zone */}
          {!isImportingLinkedIn && (
            <div
              className={cn(
                "relative rounded-lg border-2 border-dashed p-8 transition-all cursor-pointer",
                "hover:border-primary/50 hover:bg-muted/30",
                dragOver && "border-primary bg-primary/5 scale-[1.01]",
                selectedFile &&
                  "border-green-500/50 bg-green-50/50 dark:bg-green-950/20",
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-3 text-center">
                {selectedFile ? (
                  <>
                    <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {(selectedFile.size / 1024).toFixed(1)} KB — Click or
                        drop to replace
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rounded-full bg-muted p-3">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Drop your LinkedIn PDF here
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        or click to browse, PDF files only
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Progress */}
          {isImportingLinkedIn && (
            <div className="space-y-3 py-4">
              <div className="flex items-center gap-3">
                {isDone ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                ) : isError || isCancelled ? (
                  <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                ) : (
                  <Loader2 className="h-5 w-5 animate-spin text-primary shrink-0" />
                )}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <p
                      className={cn(
                        "text-sm font-medium truncate",
                        isDone && "text-green-600",
                        (isError || isCancelled) && "text-destructive",
                      )}
                    >
                      {linkedInImportStatus}
                    </p>
                    {!isDone && !isError && !isCancelled && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs shrink-0"
                        onClick={cancelLinkedInImport}
                      >
                        Stop
                      </Button>
                    )}
                  </div>
                  <Progress value={progressValue} className="h-2" />
                </div>
              </div>
              <div className="grid gap-2 text-xs">
                {stages.map((stage, index) => {
                  const isComplete = isDone || index < activeStageIndex;
                  const isActive =
                    index === activeStageIndex && !isDone && !isError;
                  return (
                    <div
                      key={stage.key}
                      className={cn(
                        "flex items-center gap-2 rounded-md border px-2 py-1",
                        isComplete && "border-green-500/30 bg-green-500/5",
                        isActive && "border-primary/30 bg-primary/5",
                        isError &&
                          index === activeStageIndex &&
                          "border-destructive/30 bg-destructive/5",
                      )}
                    >
                      {isComplete ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      ) : isActive ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                      ) : isError && index === activeStageIndex ? (
                        <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                      ) : (
                        <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                      )}
                      <span
                        className={cn(
                          isComplete && "text-green-600",
                          isActive && "text-primary",
                          isError &&
                            index === activeStageIndex &&
                            "text-destructive",
                        )}
                      >
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              {isDone && (
                <p className="text-xs text-muted-foreground text-center">
                  Your CV data has been imported! You can now edit it in the
                  editor.
                </p>
              )}
            </div>
          )}

          {/* AI Provider config — always visible before import */}
          {!isImportingLinkedIn && <InlineAIConfig variant="compact" />}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            {!isImportingLinkedIn && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setOpen(false);
                    setSelectedFile(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleImport}
                  disabled={
                    !selectedFile || !isConnected || !state.aiConfig.model
                  }
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Import &amp; Extract CV
                </Button>
              </>
            )}
            {isImportingLinkedIn && (isDone || isError || isCancelled) && (
              <Button
                size="sm"
                onClick={() => {
                  setOpen(false);
                  setSelectedFile(null);
                }}
              >
                {isDone ? "Done" : "Close"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
