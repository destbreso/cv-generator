"use client";

import { useCVStore } from "@/lib/cv-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  History,
  Clock,
  ArrowRight,
  Trash2,
  FileText,
  Target,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export function HistoryPanel() {
  const { state, dispatch } = useCVStore();
  const { iterations } = state;

  const handleLoadIteration = (iteration: (typeof iterations)[0]) => {
    dispatch({ type: "LOAD_ITERATION", payload: iteration });
    dispatch({ type: "SET_ACTIVE_PANEL", payload: "editor" });
  };

  if (iterations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <History className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-medium mb-2">No generations yet</h3>
        <p className="text-sm text-muted-foreground max-w-[300px]">
          Generate your first optimized CV and it will appear here for future
          reference.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Generation History</h2>
        <Badge variant="secondary">{iterations.length} versions</Badge>
      </div>

      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="space-y-3 pr-4">
          {iterations.map((iteration, index) => (
            <Card
              key={iteration.id}
              className="group hover:border-primary/20 transition-colors cursor-pointer"
              onClick={() => handleLoadIteration(iteration)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      v{iterations.length - index}
                    </div>
                    <div>
                      <CardTitle className="text-sm">
                        {iteration.cvData.personalInfo.name || "Untitled CV"}
                      </CardTitle>
                      <CardDescription className="text-xs flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(iteration.timestamp, {
                          addSuffix: true,
                          locale: es,
                        })}
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLoadIteration(iteration);
                    }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {/* Context preview */}
                  {iteration.context && (
                    <div className="flex items-start gap-2 p-2 rounded bg-muted/50">
                      <Target className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {iteration.context}
                      </p>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      <FileText className="h-3 w-3 mr-1" />
                      {iteration.cvData.experience.length} exp
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {iteration.cvData.skills.length} skills
                    </Badge>
                    {iteration.generatedCVData && (
                      <Badge variant="default" className="text-xs">
                        AI optimized
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
