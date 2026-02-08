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

export function LinkedInImportDialog() {
  const { state, importFromLinkedIn } = useCVStore();
  const { isImportingLinkedIn, linkedInImportStatus, isConnected } = state;
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    // Close dialog after successful import with a brief delay
    setTimeout(() => {
      setOpen(false);
      setSelectedFile(null);
    }, 2500);
  }, [selectedFile, importFromLinkedIn]);

  const isError = linkedInImportStatus.startsWith("Error:");
  const isDone = linkedInImportStatus === "Import complete!";

  // Estimate progress from status
  let progressValue = 0;
  if (linkedInImportStatus.includes("Extracting")) progressValue = 15;
  else if (linkedInImportStatus.includes("analyzing")) progressValue = 35;
  else if (linkedInImportStatus.includes("Structuring")) progressValue = 65;
  else if (isDone) progressValue = 100;
  else if (isError) progressValue = 100;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Linkedin className="h-4 w-4" />
          LinkedIn
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Linkedin className="h-5 w-5 text-[#0A66C2]" />
            Import from LinkedIn
          </DialogTitle>
          <DialogDescription>
            Upload your LinkedIn profile PDF and AI will extract and structure
            your CV data automatically.
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
                        or click to browse — PDF files only
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
                ) : isError ? (
                  <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                ) : (
                  <Loader2 className="h-5 w-5 animate-spin text-primary shrink-0" />
                )}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        isDone && "text-green-600",
                        isError && "text-destructive",
                      )}
                    >
                      {linkedInImportStatus}
                    </p>
                    {!isDone && !isError && (
                      <Sparkles className="h-3.5 w-3.5 text-muted-foreground animate-pulse" />
                    )}
                  </div>
                  <Progress value={progressValue} className="h-2" />
                </div>
              </div>
              {isDone && (
                <p className="text-xs text-muted-foreground text-center">
                  Your CV data has been imported! You can now edit it in the
                  editor.
                </p>
              )}
            </div>
          )}

          {/* Connection warning */}
          {!isConnected && !isImportingLinkedIn && (
            <div className="flex items-start gap-2 rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-900/50 dark:bg-yellow-950/20 p-3">
              <AlertCircle className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-700 dark:text-yellow-400">
                LLM connection is not active. Please configure and test your
                connection in the AI Config panel first.
              </p>
            </div>
          )}

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
                  disabled={!selectedFile || !isConnected}
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Import &amp; Extract CV
                </Button>
              </>
            )}
            {isImportingLinkedIn && isDone && (
              <Button
                size="sm"
                onClick={() => {
                  setOpen(false);
                  setSelectedFile(null);
                }}
              >
                Done
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
