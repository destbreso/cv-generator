"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RotateCcw, Save, FileText, Lightbulb } from "lucide-react";

interface SystemPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  defaultValue: string;
  onSave: (value: string) => void;
}

export function SystemPromptDialog({
  open,
  onOpenChange,
  value,
  defaultValue,
  onSave,
}: SystemPromptDialogProps) {
  const [draft, setDraft] = useState(value);
  const isModified = draft !== value;
  const isCustom = draft !== defaultValue;

  // Sync draft when dialog opens
  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  const handleSave = () => {
    onSave(draft);
    onOpenChange(false);
  };

  const handleReset = () => {
    setDraft(defaultValue);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl w-[95vw] h-[92vh] !flex !flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            AI Writing Instructions
          </DialogTitle>
          <DialogDescription>
            These instructions control how the AI writes and optimizes your CV.
            Customize them to match your industry, tone, or formatting
            preferences.
          </DialogDescription>
        </DialogHeader>

        {/* Tip */}
        <div className="rounded-md border bg-muted/50 px-3 py-2.5 flex items-start gap-2 shrink-0">
          <Lightbulb className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            The default prompt follows professional resume best practices — ATS
            optimization, achievement-driven bullets using the XYZ formula,
            keyword alignment, and strong action verbs. Add industry-specific
            instructions, tone preferences, or formatting rules to make it
            yours.
          </p>
        </div>

        {/* Editor — scrollable area */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full h-full resize-none rounded-md border border-input bg-background px-3 py-2 text-xs font-mono leading-relaxed ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Enter custom AI writing instructions..."
          />
        </div>

        <DialogFooter className="!flex-row !justify-between shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={handleReset}
            disabled={!isCustom}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset to Default
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button size="sm" className="gap-1.5" onClick={handleSave}>
              <Save className="h-3.5 w-3.5" />
              {isModified ? "Save Changes" : "Done"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
