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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Bot,
  Target,
  Lightbulb,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OUTPUT_LANGUAGES = [
  { value: "auto", label: "Auto (same as input)" },
  { value: "English", label: "English" },
  { value: "Spanish", label: "Español" },
  { value: "French", label: "Français" },
  { value: "German", label: "Deutsch" },
  { value: "Portuguese", label: "Português" },
  { value: "Italian", label: "Italiano" },
  { value: "Dutch", label: "Nederlands" },
  { value: "Chinese", label: "中文" },
  { value: "Japanese", label: "日本語" },
  { value: "Korean", label: "한국어" },
  { value: "Arabic", label: "العربية" },
  { value: "Russian", label: "Русский" },
  { value: "Hindi", label: "हिन्दी" },
] as const;

export function GeneratePanel() {
  const {
    state,
    dispatch,
    generateCV,
    applyGeneratedData,
    testConnection,
    loadModels,
  } = useCVStore();
  const {
    cvData,
    jobContext,
    outputLanguage,
    isGenerating,
    isConnected,
    generatedContent,
    generatedCVData,
    aiConfig,
  } = state;

  const hasRequiredData =
    cvData.personalInfo.name &&
    cvData.personalInfo.email &&
    (cvData.experience.length > 0 || cvData.education.length > 0);

  const handleGenerate = async () => {
    if (!isConnected) {
      const connected = await testConnection();
      if (!connected) return;
      await loadModels();
    }
    await generateCV();
  };

  return (
    <div className="space-y-6">
      {/* AI Status Card */}
      <Card
        className={cn(
          "border-2 transition-colors",
          isConnected ? "border-green-500/20 bg-green-500/5" : "border-muted",
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center",
                  isConnected ? "bg-green-500/10" : "bg-muted",
                )}
              >
                <Bot
                  className={cn(
                    "h-5 w-5",
                    isConnected ? "text-green-500" : "text-muted-foreground",
                  )}
                />
              </div>
              <div>
                <CardTitle className="text-base">
                  {aiConfig.provider.charAt(0).toUpperCase() +
                    aiConfig.provider.slice(1)}
                </CardTitle>
                <CardDescription className="text-xs">
                  {isConnected
                    ? `Connected • ${aiConfig.model}`
                    : "Not connected"}
                </CardDescription>
              </div>
            </div>
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "Ready" : "Offline"}
            </Badge>
          </div>
        </CardHeader>
        {!isConnected && (
          <CardContent className="pt-0">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={async () => {
                await testConnection();
                await loadModels();
              }}
            >
              Test Connection
            </Button>
          </CardContent>
        )}
      </Card>

      {/* CV Data Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4" />
            CV Data Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <StatusItem
            label="Personal Info"
            complete={!!cvData.personalInfo.name && !!cvData.personalInfo.email}
          />
          <StatusItem
            label="Professional Summary"
            complete={!!cvData.summary && cvData.summary.length > 50}
          />
          <StatusItem
            label="Work Experience"
            complete={cvData.experience.length > 0}
          />
          <StatusItem
            label="Education"
            complete={cvData.education.length > 0}
          />
          <StatusItem label="Skills" complete={cvData.skills.length > 0} />
          <StatusItem
            label="Projects"
            complete={cvData.projects.length > 0}
            optional
          />
          <StatusItem
            label="Certifications"
            complete={cvData.certifications.length > 0}
            optional
          />
        </CardContent>
      </Card>

      {/* Job Context */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Job Context
          </CardTitle>
          <CardDescription className="text-xs">
            Describe the target role to optimize your CV
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={jobContext}
            onChange={(e) =>
              dispatch({ type: "SET_JOB_CONTEXT", payload: e.target.value })
            }
            placeholder={`Describe the job you're targeting...

Example:
• Senior Software Engineer at a fintech startup
• Focus on backend development with Python/Go
• Looking for leadership and team management experience
• Must have cloud architecture knowledge (AWS/GCP)`}
            rows={6}
            className="resize-none text-sm"
          />

          {/* Quick prompts */}
          <div className="flex flex-wrap gap-2">
            <QuickPrompt
              label="Tech Lead"
              onClick={() =>
                dispatch({
                  type: "SET_JOB_CONTEXT",
                  payload:
                    jobContext +
                    "\n• Focus on technical leadership\n• Emphasize team management and mentoring\n• Highlight architecture decisions",
                })
              }
            />
            <QuickPrompt
              label="Startup"
              onClick={() =>
                dispatch({
                  type: "SET_JOB_CONTEXT",
                  payload:
                    jobContext +
                    "\n• Fast-paced environment\n• Versatile and adaptable\n• Product-minded approach",
                })
              }
            />
            <QuickPrompt
              label="Remote"
              onClick={() =>
                dispatch({
                  type: "SET_JOB_CONTEXT",
                  payload:
                    jobContext +
                    "\n• Remote work experience\n• Async communication skills\n• Self-motivated and organized",
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Output Language */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Output Language
          </CardTitle>
          <CardDescription className="text-xs">
            Language for the generated CV content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={outputLanguage}
            onValueChange={(value) =>
              dispatch({ type: "SET_OUTPUT_LANGUAGE", payload: value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {OUTPUT_LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-2">
            {outputLanguage === "auto"
              ? "The AI will keep the same language as your input data"
              : `All content will be translated to ${outputLanguage}`}
          </p>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <Button
        className="w-full h-12 text-base gap-2"
        onClick={handleGenerate}
        disabled={isGenerating || !hasRequiredData || !jobContext.trim()}
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            Generate Optimized CV
          </>
        )}
      </Button>

      {!hasRequiredData && (
        <p className="text-xs text-muted-foreground text-center">
          Complete at least personal info and experience/education to generate
        </p>
      )}

      {/* Generated Result */}
      {generatedCVData && !isGenerating && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2 text-primary">
                <CheckCircle2 className="h-4 w-4" />
                CV Generated!
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                Ready to apply
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Your CV has been optimized for the target role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              The AI has rewritten your CV content to better match the job
              context. Review the preview on the right panel.
            </p>
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={applyGeneratedData}
            >
              Apply to Editor
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatusItem({
  label,
  complete,
  optional = false,
}: {
  label: string;
  complete: boolean;
  optional?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">
        {label}
        {optional && <span className="text-xs ml-1">(optional)</span>}
      </span>
      {complete ? (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      ) : (
        <AlertCircle
          className={cn(
            "h-4 w-4",
            optional ? "text-muted-foreground" : "text-yellow-500",
          )}
        />
      )}
    </div>
  );
}

function QuickPrompt({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="h-7 text-xs"
      onClick={onClick}
    >
      + {label}
    </Button>
  );
}
