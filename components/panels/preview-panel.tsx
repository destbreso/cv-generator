"use client";

import { useRef, useState, useMemo } from "react";
import {
  useCVStore,
  COLOR_PALETTES,
  type TemplatePaletteColors,
} from "@/lib/cv-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Eye,
  Code,
  FileText,
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  Copy,
  Check,
  Loader2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CVData } from "@/lib/types";

/* ─── Template style helpers ─── */

function getTemplateStyles(templateId: string) {
  const styles: Record<
    string,
    {
      headerStyle: string;
      sectionTitleStyle: string;
      bodyFont: string;
      headerFont: string;
      borderStyle: string;
      chipStyle: string;
      headerLayout: "center" | "left" | "split";
      accentBar: boolean;
    }
  > = {
    minimal: {
      headerStyle: "text-center",
      sectionTitleStyle: "text-sm font-semibold uppercase tracking-widest",
      bodyFont: "font-sans",
      headerFont: "font-sans",
      borderStyle: "border-b",
      chipStyle: "text-xs",
      headerLayout: "center",
      accentBar: false,
    },
    professional: {
      headerStyle: "text-center",
      sectionTitleStyle: "text-base font-bold",
      bodyFont: "font-serif",
      headerFont: "font-serif",
      borderStyle: "border-b-2",
      chipStyle: "text-xs",
      headerLayout: "center",
      accentBar: false,
    },
    modern: {
      headerStyle: "text-left",
      sectionTitleStyle: "text-base font-bold",
      bodyFont: "font-sans",
      headerFont: "font-sans",
      borderStyle: "border-b-2",
      chipStyle: "text-xs px-2 py-0.5 rounded-full",
      headerLayout: "left",
      accentBar: true,
    },
    creative: {
      headerStyle: "text-center",
      sectionTitleStyle: "text-base font-black uppercase tracking-wide",
      bodyFont: "font-sans",
      headerFont: "font-sans",
      borderStyle: "border-b-4",
      chipStyle: "text-xs px-2 py-1 rounded-lg font-medium",
      headerLayout: "center",
      accentBar: true,
    },
    executive: {
      headerStyle: "text-center",
      sectionTitleStyle: "text-sm font-semibold uppercase tracking-[0.2em]",
      bodyFont: "font-serif",
      headerFont: "font-serif",
      borderStyle: "border-b",
      chipStyle: "text-xs italic",
      headerLayout: "center",
      accentBar: false,
    },
    tech: {
      headerStyle: "text-left",
      sectionTitleStyle: "text-sm font-bold font-mono uppercase",
      bodyFont: "font-mono",
      headerFont: "font-mono",
      borderStyle: "border-b border-dashed",
      chipStyle: "text-xs font-mono px-1.5 py-0.5 rounded border",
      headerLayout: "left",
      accentBar: true,
    },
  };
  return styles[templateId] || styles.minimal;
}

export function PreviewPanel() {
  const { state } = useCVStore();
  const {
    cvData,
    generatedCVData,
    generatedContent,
    selectedTemplateId,
    selectedPaletteId,
    selectedLayoutId,
    isGenerating,
  } = state;

  const [viewMode, setViewMode] = useState<"preview" | "json" | "raw">(
    "preview",
  );
  const [zoom, setZoom] = useState(100);
  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const displayData = generatedCVData || cvData;
  const palette = useMemo(
    () =>
      COLOR_PALETTES.find((p) => p.id === selectedPaletteId)?.colors ??
      COLOR_PALETTES[0].colors,
    [selectedPaletteId],
  );
  const templateStyles = useMemo(
    () => getTemplateStyles(selectedTemplateId),
    [selectedTemplateId],
  );

  const handleCopy = async () => {
    const content =
      viewMode === "json"
        ? JSON.stringify(displayData, null, 2)
        : generatedContent || JSON.stringify(displayData, null, 2);

    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDF = () => {
    if (!previewRef.current) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const html = previewRef.current.innerHTML;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>CV - ${displayData.personalInfo.name || "Untitled"}</title>
          <style>
            body { 
              font-family: system-ui, -apple-system, sans-serif; 
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
              color: #1a1a1a;
              line-height: 1.6;
            }
            h1 { font-size: 2rem; margin-bottom: 0.5rem; }
            h2 { 
              font-size: 1.25rem; 
              margin-top: 1.5rem;
              padding-bottom: 0.5rem;
              border-bottom: 2px solid #e5e5e5;
            }
            .skeleton { display: none; }
            .contact-info { color: #666; font-size: 0.9rem; }
            .contact-info span { margin-right: 1rem; }
            @media print {
              body { padding: 20px; }
              @page { margin: 1cm; }
            }
          </style>
        </head>
        <body>${html}</body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
  };

  const handleExportHTML = () => {
    const html = previewRef.current?.innerHTML || "";
    const fullHTML = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>CV - ${displayData.personalInfo.name || "Untitled"}</title>
    <style>
      body { 
        font-family: system-ui, -apple-system, sans-serif; 
        padding: 40px;
        max-width: 800px;
        margin: 0 auto;
        color: #1a1a1a;
        line-height: 1.6;
      }
      h1 { font-size: 2rem; margin-bottom: 0.5rem; }
      h2 { font-size: 1.25rem; margin-top: 1.5rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e5e5e5; }
      .skeleton { display: none; }
    </style>
  </head>
  <body>${html}</body>
</html>`;

    const blob = new Blob([fullHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cv-${(displayData.personalInfo.name || "untitled").replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="h-12 border-b border-border px-4 flex items-center justify-between bg-card/50">
        <div className="flex items-center gap-4">
          <h2 className="font-medium text-sm">Preview</h2>
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as typeof viewMode)}
          >
            <TabsList className="h-8">
              <TabsTrigger value="preview" className="text-xs h-7 px-3">
                <Eye className="h-3 w-3 mr-1.5" />
                Visual
              </TabsTrigger>
              <TabsTrigger value="json" className="text-xs h-7 px-3">
                <Code className="h-3 w-3 mr-1.5" />
                JSON
              </TabsTrigger>
              {generatedContent && (
                <TabsTrigger value="raw" className="text-xs h-7 px-3">
                  <FileText className="h-3 w-3 mr-1.5" />
                  Raw
                </TabsTrigger>
              )}
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-1">
          {viewMode === "preview" && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setZoom(Math.max(50, zoom - 10))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground w-10 text-center">
                {zoom}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setZoom(Math.min(150, zoom + 10))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </>
          )}
          <div className="w-px h-4 bg-border mx-1" />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleExportHTML}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleExportPDF}
          >
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {viewMode === "preview" && isGenerating && (
            <Card
              className="bg-white shadow-lg mx-auto overflow-hidden"
              style={{
                width: `${(8.5 * zoom) / 100}in`,
                minHeight: `${(11 * zoom) / 100}in`,
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
              }}
            >
              <GeneratingSkeleton palette={palette} />
            </Card>
          )}

          {viewMode === "preview" && !isGenerating && (
            <Card
              className="bg-white shadow-lg mx-auto overflow-hidden"
              style={{
                width: `${(8.5 * zoom) / 100}in`,
                minHeight: `${(11 * zoom) / 100}in`,
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
              }}
            >
              <div ref={previewRef} style={{ color: palette.primary }}>
                <CVPreviewContent
                  data={displayData}
                  palette={palette}
                  templateId={selectedTemplateId}
                  layoutId={selectedLayoutId}
                  templateStyles={templateStyles}
                />
              </div>
            </Card>
          )}

          {viewMode === "json" && (
            <Card className="p-4 bg-zinc-950">
              <pre className="text-xs text-green-400 font-mono overflow-auto">
                {JSON.stringify(displayData, null, 2)}
              </pre>
            </Card>
          )}

          {viewMode === "raw" && generatedContent && (
            <Card className="p-4 bg-zinc-950">
              <pre className="text-xs text-zinc-300 font-mono overflow-auto whitespace-pre-wrap">
                {generatedContent}
              </pre>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

/* ─── Generation Skeleton ─── */

function GeneratingSkeleton({ palette }: { palette: TemplatePaletteColors }) {
  return (
    <div className="p-8 space-y-6 relative">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${palette.accent}08 50%, transparent 100%)`,
          }}
        />
      </div>

      {/* AI badge */}
      <div className="flex items-center justify-center gap-2 py-3">
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
          style={{ backgroundColor: `${palette.accent}12`, color: palette.accent }}
        >
          <Loader2 className="h-4 w-4 animate-spin" />
          <Sparkles className="h-3.5 w-3.5" />
          AI is optimizing your CV…
        </div>
      </div>

      {/* Header skeleton */}
      <header className="text-center space-y-3">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-64 rounded animate-pulse" style={{ backgroundColor: `${palette.primary}12` }} />
          <div className="h-4 w-44 rounded animate-pulse" style={{ backgroundColor: `${palette.accent}15` }} />
        </div>
        <div className="flex items-center justify-center gap-3 mt-2">
          <div className="h-3 w-32 rounded animate-pulse" style={{ backgroundColor: `${palette.secondary}12` }} />
          <span style={{ color: `${palette.secondary}30` }}>•</span>
          <div className="h-3 w-24 rounded animate-pulse" style={{ backgroundColor: `${palette.secondary}12` }} />
          <span style={{ color: `${palette.secondary}30` }}>•</span>
          <div className="h-3 w-28 rounded animate-pulse" style={{ backgroundColor: `${palette.secondary}12` }} />
        </div>
      </header>

      {/* Summary skeleton */}
      <section className="space-y-2">
        <div className="h-5 w-48 rounded animate-pulse" style={{ backgroundColor: `${palette.primary}12` }} />
        <div className="h-px w-full" style={{ backgroundColor: `${palette.accent}20` }} />
        <div className="space-y-2 pt-1">
          <div className="h-3 w-full rounded animate-pulse" style={{ backgroundColor: `${palette.secondary}10` }} />
          <div className="h-3 w-[92%] rounded animate-pulse" style={{ backgroundColor: `${palette.secondary}10` }} />
          <div className="h-3 w-[85%] rounded animate-pulse" style={{ backgroundColor: `${palette.secondary}10` }} />
        </div>
      </section>

      {/* Experience skeleton */}
      <section className="space-y-2">
        <div className="h-5 w-40 rounded animate-pulse" style={{ backgroundColor: `${palette.primary}12` }} />
        <div className="h-px w-full" style={{ backgroundColor: `${palette.accent}20` }} />
        {[1, 2].map((i) => (
          <div key={i} className="space-y-2 pt-2">
            <div className="flex justify-between">
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-52 rounded animate-pulse" style={{ backgroundColor: `${palette.primary}12` }} />
                <div className="h-3 w-36 rounded animate-pulse" style={{ backgroundColor: `${palette.secondary}10` }} />
              </div>
              <div className="h-3 w-28 rounded animate-pulse" style={{ backgroundColor: `${palette.accent}12` }} />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-full rounded animate-pulse" style={{ backgroundColor: `${palette.secondary}08` }} />
              <div className="h-3 w-[90%] rounded animate-pulse" style={{ backgroundColor: `${palette.secondary}08` }} />
              <div className="h-3 w-[75%] rounded animate-pulse" style={{ backgroundColor: `${palette.secondary}08` }} />
            </div>
          </div>
        ))}
      </section>

      {/* Education skeleton */}
      <section className="space-y-2">
        <div className="h-5 w-32 rounded animate-pulse" style={{ backgroundColor: `${palette.primary}12` }} />
        <div className="h-px w-full" style={{ backgroundColor: `${palette.accent}20` }} />
        <div className="flex justify-between pt-2">
          <div className="space-y-1.5">
            <div className="h-4 w-56 rounded animate-pulse" style={{ backgroundColor: `${palette.primary}12` }} />
            <div className="h-3 w-40 rounded animate-pulse" style={{ backgroundColor: `${palette.secondary}10` }} />
          </div>
          <div className="h-3 w-28 rounded animate-pulse" style={{ backgroundColor: `${palette.accent}12` }} />
        </div>
      </section>

      {/* Skills skeleton */}
      <section className="space-y-2">
        <div className="h-5 w-24 rounded animate-pulse" style={{ backgroundColor: `${palette.primary}12` }} />
        <div className="h-px w-full" style={{ backgroundColor: `${palette.accent}20` }} />
        <div className="space-y-2 pt-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-2 items-center">
              <div className="h-3 w-24 rounded animate-pulse" style={{ backgroundColor: `${palette.primary}10` }} />
              <div className="flex gap-1.5 flex-wrap flex-1">
                {Array.from({ length: 4 + i }).map((_, j) => (
                  <div
                    key={j}
                    className="h-5 rounded-full animate-pulse"
                    style={{
                      width: `${40 + Math.random() * 30}px`,
                      backgroundColor: `${palette.accent}12`,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ─── Skeleton building blocks ─── */

function SkeletonLine({
  width = "100%",
  className,
}: {
  width?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "skeleton h-3 rounded bg-zinc-200 animate-pulse",
        className,
      )}
      style={{ width }}
    />
  );
}

function SkeletonBlock({ lines = 3 }: { lines?: number }) {
  const widths = ["100%", "92%", "85%", "78%", "65%"];
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine key={i} width={widths[i % widths.length]} />
      ))}
    </div>
  );
}

function SkeletonSection({ title, color }: { title: string; color: string }) {
  return (
    <section className="skeleton">
      <h2
        className="text-lg font-semibold border-b border-dashed pb-1 mb-3"
        style={{ color, borderColor: `${color}30`, opacity: 0.4 }}
      >
        {title}
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <SkeletonLine width="55%" className="h-4" />
            <SkeletonLine width="35%" />
          </div>
          <SkeletonLine width="80px" />
        </div>
        <SkeletonBlock lines={2} />
      </div>
    </section>
  );
}

function SkeletonSkillsSection({ color }: { color: string }) {
  return (
    <section className="skeleton">
      <h2
        className="text-lg font-semibold border-b border-dashed pb-1 mb-3"
        style={{ color, borderColor: `${color}30`, opacity: 0.4 }}
      >
        Skills
      </h2>
      <div className="space-y-2">
        {["Languages", "Frontend", "Backend"].map((cat) => (
          <div key={cat} className="flex gap-2 items-center">
            <span
              className="text-sm min-w-[100px]"
              style={{ color, opacity: 0.4 }}
            >
              {cat}:
            </span>
            <div className="flex gap-1.5 flex-wrap">
              {[55, 45, 35, 40, 30].map((w, i) => (
                <div
                  key={i}
                  className="h-5 rounded-full bg-zinc-200 animate-pulse"
                  style={{ width: `${w}px` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Section Title ─── */

function SectionTitle({
  children,
  palette,
  templateStyles,
}: {
  children: React.ReactNode;
  palette: TemplatePaletteColors;
  templateStyles: ReturnType<typeof getTemplateStyles>;
}) {
  return (
    <h2
      className={cn(
        "pb-1 mb-3",
        templateStyles.sectionTitleStyle,
        templateStyles.borderStyle,
      )}
      style={{
        color: palette.primary,
        borderColor: templateStyles.accentBar
          ? palette.accent
          : `${palette.secondary}40`,
      }}
    >
      {children}
    </h2>
  );
}

/* ─── Sidebar content (for sidebar layouts) ─── */

function SidebarContent({
  data,
  palette,
  templateStyles,
}: {
  data: CVData;
  palette: TemplatePaletteColors;
  templateStyles: ReturnType<typeof getTemplateStyles>;
}) {
  return (
    <div className="space-y-5">
      {/* Contact */}
      <div>
        <h3
          className={cn("text-xs font-bold uppercase tracking-widest mb-2")}
          style={{ color: palette.accent }}
        >
          Contact
        </h3>
        <div
          className="space-y-1.5 text-xs"
          style={{ color: palette.secondary }}
        >
          {data.personalInfo.email && <p>{data.personalInfo.email}</p>}
          {data.personalInfo.phone && <p>{data.personalInfo.phone}</p>}
          {data.personalInfo.location && <p>{data.personalInfo.location}</p>}
          {data.personalInfo.website && (
            <a
              href={data.personalInfo.website}
              style={{ color: palette.accent }}
            >
              {data.personalInfo.website}
            </a>
          )}
          {data.personalInfo.linkedin && <p>{data.personalInfo.linkedin}</p>}
          {data.personalInfo.github && <p>{data.personalInfo.github}</p>}
        </div>
      </div>

      {/* Skills */}
      {data.skills.length > 0 && (
        <div>
          <h3
            className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: palette.accent }}
          >
            Skills
          </h3>
          <div className="space-y-2">
            {data.skills.map((skill) => (
              <div key={skill.id}>
                <p
                  className="text-xs font-medium mb-1"
                  style={{ color: palette.primary }}
                >
                  {skill.category}
                </p>
                <div className="flex flex-wrap gap-1">
                  {skill.items.map((item, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: `${palette.accent}15`,
                        color: palette.primary,
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <div>
          <h3
            className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: palette.accent }}
          >
            Languages
          </h3>
          <div className="space-y-1">
            {data.languages.map((lang) => (
              <div
                key={lang.id}
                className="text-xs"
                style={{ color: palette.primary }}
              >
                <span className="font-medium">{lang.language}</span>
                <span style={{ color: palette.secondary }}>
                  {" "}
                  — {lang.proficiency}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interests */}
      {data.interests.length > 0 && (
        <div>
          <h3
            className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: palette.accent }}
          >
            Interests
          </h3>
          <div className="flex flex-wrap gap-1">
            {data.interests.map((interest, i) => (
              <span
                key={i}
                className="text-[10px] px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: `${palette.accent}10`,
                  color: palette.secondary,
                }}
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div>
          <h3
            className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: palette.accent }}
          >
            Certifications
          </h3>
          <div className="space-y-2">
            {data.certifications.map((cert) => (
              <div key={cert.id}>
                <p
                  className="text-xs font-medium"
                  style={{ color: palette.primary }}
                >
                  {cert.name}
                </p>
                <p className="text-[10px]" style={{ color: palette.secondary }}>
                  {cert.issuer} · {cert.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main content sections (used in all layouts) ─── */

function MainContent({
  data,
  palette,
  templateStyles,
  isEmpty,
  includeSideSections,
}: {
  data: CVData;
  palette: TemplatePaletteColors;
  templateStyles: ReturnType<typeof getTemplateStyles>;
  isEmpty: boolean;
  includeSideSections: boolean;
}) {
  return (
    <div className="space-y-5">
      {/* Summary */}
      {data.summary ? (
        <section>
          <SectionTitle palette={palette} templateStyles={templateStyles}>
            Professional Summary
          </SectionTitle>
          <p
            className="text-sm leading-relaxed"
            style={{ color: palette.secondary }}
          >
            {data.summary}
          </p>
        </section>
      ) : (
        <SkeletonSection title="Professional Summary" color={palette.primary} />
      )}

      {/* Experience */}
      {data.experience.length > 0 ? (
        <section>
          <SectionTitle palette={palette} templateStyles={templateStyles}>
            Work Experience
          </SectionTitle>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3
                      className="font-medium"
                      style={{ color: palette.primary }}
                    >
                      {exp.position}
                    </h3>
                    <p className="text-sm" style={{ color: palette.secondary }}>
                      {exp.company}
                    </p>
                  </div>
                  <span
                    className="text-sm shrink-0"
                    style={{ color: palette.accent }}
                  >
                    {exp.startDate} — {exp.endDate}
                  </span>
                </div>
                {exp.description && (
                  <p
                    className="mt-1 text-sm"
                    style={{ color: palette.secondary }}
                  >
                    {exp.description}
                  </p>
                )}
                {exp.achievements.length > 0 && (
                  <ul
                    className="mt-2 list-disc list-inside text-sm space-y-1"
                    style={{ color: palette.secondary }}
                  >
                    {exp.achievements.map((ach, i) => (
                      <li key={i}>{ach}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      ) : (
        <SkeletonSection title="Work Experience" color={palette.primary} />
      )}

      {/* Education */}
      {data.education.length > 0 ? (
        <section>
          <SectionTitle palette={palette} templateStyles={templateStyles}>
            Education
          </SectionTitle>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3
                    className="font-medium"
                    style={{ color: palette.primary }}
                  >
                    {edu.degree} in {edu.field}
                  </h3>
                  <p className="text-sm" style={{ color: palette.secondary }}>
                    {edu.institution}
                  </p>
                </div>
                <span
                  className="text-sm shrink-0"
                  style={{ color: palette.accent }}
                >
                  {edu.startDate} — {edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <SkeletonSection title="Education" color={palette.primary} />
      )}

      {/* Skills (only in single/two-column layouts) */}
      {includeSideSections && data.skills.length > 0 ? (
        <section>
          <SectionTitle palette={palette} templateStyles={templateStyles}>
            Skills
          </SectionTitle>
          <div className="space-y-2">
            {data.skills.map((skill) => (
              <div key={skill.id} className="flex gap-2">
                <span
                  className="font-medium text-sm min-w-[120px] shrink-0"
                  style={{ color: palette.primary }}
                >
                  {skill.category}:
                </span>
                <span className="text-sm" style={{ color: palette.secondary }}>
                  {skill.items.join(", ")}
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : includeSideSections ? (
        <SkeletonSkillsSection color={palette.primary} />
      ) : null}

      {/* Projects */}
      {data.projects.length > 0 ? (
        <section>
          <SectionTitle palette={palette} templateStyles={templateStyles}>
            Projects
          </SectionTitle>
          <div className="space-y-3">
            {data.projects.map((project) => (
              <div key={project.id}>
                <div className="flex items-center gap-2">
                  <h3
                    className="font-medium"
                    style={{ color: palette.primary }}
                  >
                    {project.name}
                  </h3>
                  {project.url && (
                    <a
                      href={project.url}
                      className="text-xs hover:underline"
                      style={{ color: palette.accent }}
                    >
                      ↗ Link
                    </a>
                  )}
                </div>
                <p
                  className="text-sm mt-1"
                  style={{ color: palette.secondary }}
                >
                  {project.description}
                </p>
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className={templateStyles.chipStyle}
                        style={{
                          color: palette.accent,
                          backgroundColor: `${palette.accent}10`,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ) : isEmpty ? (
        <SkeletonSection title="Projects" color={palette.primary} />
      ) : null}

      {/* Languages (only in single/two-column) */}
      {includeSideSections && data.languages.length > 0 && (
        <section>
          <SectionTitle palette={palette} templateStyles={templateStyles}>
            Languages
          </SectionTitle>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {data.languages.map((lang) => (
              <div key={lang.id} className="text-sm">
                <span
                  className="font-medium"
                  style={{ color: palette.primary }}
                >
                  {lang.language}
                </span>
                <span style={{ color: palette.secondary }}>
                  {" "}
                  — {lang.proficiency}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications (only in single/two-column) */}
      {includeSideSections && data.certifications.length > 0 ? (
        <section>
          <SectionTitle palette={palette} templateStyles={templateStyles}>
            Certifications
          </SectionTitle>
          <div className="space-y-2">
            {data.certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-start">
                <div>
                  <h3
                    className="font-medium text-sm"
                    style={{ color: palette.primary }}
                  >
                    {cert.name}
                    {cert.url && (
                      <a
                        href={cert.url}
                        className="ml-1 text-xs hover:underline"
                        style={{ color: palette.accent }}
                      >
                        ↗
                      </a>
                    )}
                  </h3>
                  <p className="text-xs" style={{ color: palette.secondary }}>
                    {cert.issuer}
                  </p>
                </div>
                <span
                  className="text-xs shrink-0"
                  style={{ color: palette.accent }}
                >
                  {cert.date}
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : isEmpty && includeSideSections ? (
        <SkeletonSection title="Certifications" color={palette.primary} />
      ) : null}

      {/* Publications */}
      {data.publications.length > 0 && (
        <section>
          <SectionTitle palette={palette} templateStyles={templateStyles}>
            Publications
          </SectionTitle>
          <div className="space-y-3">
            {data.publications.map((pub) => (
              <div key={pub.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3
                      className="font-medium text-sm"
                      style={{ color: palette.primary }}
                    >
                      {pub.title}
                      {pub.url && (
                        <a
                          href={pub.url}
                          className="ml-1 text-xs hover:underline"
                          style={{ color: palette.accent }}
                        >
                          ↗
                        </a>
                      )}
                    </h3>
                    <p className="text-xs" style={{ color: palette.secondary }}>
                      {pub.publisher}
                    </p>
                  </div>
                  <span
                    className="text-xs shrink-0"
                    style={{ color: palette.accent }}
                  >
                    {pub.date}
                  </span>
                </div>
                {pub.description && (
                  <p
                    className="text-sm mt-1"
                    style={{ color: palette.secondary }}
                  >
                    {pub.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Volunteer Work */}
      {data.volunteerWork.length > 0 && (
        <section>
          <SectionTitle palette={palette} templateStyles={templateStyles}>
            Volunteer Work
          </SectionTitle>
          <div className="space-y-3">
            {data.volunteerWork.map((vol) => (
              <div key={vol.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3
                      className="font-medium text-sm"
                      style={{ color: palette.primary }}
                    >
                      {vol.role}
                    </h3>
                    <p className="text-xs" style={{ color: palette.secondary }}>
                      {vol.organization}
                    </p>
                  </div>
                  <span
                    className="text-xs shrink-0"
                    style={{ color: palette.accent }}
                  >
                    {vol.startDate} — {vol.endDate}
                  </span>
                </div>
                {vol.description && (
                  <p
                    className="text-sm mt-1"
                    style={{ color: palette.secondary }}
                  >
                    {vol.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Awards */}
      {data.awards.length > 0 && (
        <section>
          <SectionTitle palette={palette} templateStyles={templateStyles}>
            Awards &amp; Honors
          </SectionTitle>
          <div className="space-y-2">
            {data.awards.map((award) => (
              <div key={award.id} className="flex justify-between items-start">
                <div>
                  <h3
                    className="font-medium text-sm"
                    style={{ color: palette.primary }}
                  >
                    {award.title}
                  </h3>
                  <p className="text-xs" style={{ color: palette.secondary }}>
                    {award.issuer}
                  </p>
                  {award.description && (
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: palette.secondary }}
                    >
                      {award.description}
                    </p>
                  )}
                </div>
                <span
                  className="text-xs shrink-0"
                  style={{ color: palette.accent }}
                >
                  {award.date}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Interests (only in single/two-column) */}
      {includeSideSections && data.interests.length > 0 && (
        <section>
          <SectionTitle palette={palette} templateStyles={templateStyles}>
            Interests
          </SectionTitle>
          <p className="text-sm" style={{ color: palette.secondary }}>
            {data.interests.join(" · ")}
          </p>
        </section>
      )}
    </div>
  );
}

/* ─── Header Component ─── */

function CVHeader({
  data,
  palette,
  templateStyles,
  templateId,
}: {
  data: CVData;
  palette: TemplatePaletteColors;
  templateStyles: ReturnType<typeof getTemplateStyles>;
  templateId: string;
}) {
  const isCreative = templateId === "creative";
  const hasHeaderBg =
    templateId === "modern" ||
    templateId === "creative" ||
    templateId === "tech";

  return (
    <header
      className={cn("transition-all", templateStyles.headerStyle)}
      style={{
        ...(hasHeaderBg
          ? {
              backgroundColor: palette.primary,
              color: "#ffffff",
              padding: "24px 32px",
              margin: "-1px -1px 0 -1px",
            }
          : { padding: "0" }),
      }}
    >
      {data.personalInfo.name ? (
        <>
          <h1
            className={cn(
              "font-bold",
              templateStyles.headerFont,
              isCreative ? "text-4xl" : "text-3xl",
            )}
            style={{ color: hasHeaderBg ? "#ffffff" : palette.primary }}
          >
            {data.personalInfo.name}
          </h1>
          {data.personalInfo.title && (
            <p
              className="text-base mt-0.5"
              style={{
                color: hasHeaderBg ? `rgba(255,255,255,0.8)` : palette.accent,
              }}
            >
              {data.personalInfo.title}
            </p>
          )}
        </>
      ) : (
        <div className="skeleton flex flex-col items-center gap-2">
          <SkeletonLine width="280px" className="h-7" />
          <SkeletonLine width="180px" className="h-4" />
        </div>
      )}

      {/* Contact */}
      {data.personalInfo.email ||
      data.personalInfo.phone ||
      data.personalInfo.location ? (
        <div
          className="mt-2 flex items-center flex-wrap gap-3 text-sm"
          style={{
            color: hasHeaderBg ? "rgba(255,255,255,0.7)" : palette.secondary,
            justifyContent:
              templateStyles.headerLayout === "center"
                ? "center"
                : "flex-start",
          }}
        >
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && (
            <>
              <span style={{ opacity: 0.4 }}>•</span>
              <span>{data.personalInfo.phone}</span>
            </>
          )}
          {data.personalInfo.location && (
            <>
              <span style={{ opacity: 0.4 }}>•</span>
              <span>{data.personalInfo.location}</span>
            </>
          )}
        </div>
      ) : (
        <div className="skeleton mt-2 flex items-center justify-center gap-3">
          <SkeletonLine width="130px" />
          <span className="text-zinc-300">•</span>
          <SkeletonLine width="100px" />
          <span className="text-zinc-300">•</span>
          <SkeletonLine width="110px" />
        </div>
      )}

      {/* Links */}
      {(data.personalInfo.linkedin ||
        data.personalInfo.github ||
        data.personalInfo.website ||
        data.personalInfo.portfolio) && (
        <div
          className="mt-1 flex items-center flex-wrap gap-3 text-sm"
          style={{
            color: hasHeaderBg ? "rgba(255,255,255,0.6)" : palette.secondary,
            justifyContent:
              templateStyles.headerLayout === "center"
                ? "center"
                : "flex-start",
          }}
        >
          {data.personalInfo.linkedin && (
            <a
              href={`https://${data.personalInfo.linkedin}`}
              className="hover:underline"
              style={{ color: hasHeaderBg ? "#ffffff" : palette.accent }}
            >
              LinkedIn
            </a>
          )}
          {data.personalInfo.github && (
            <a
              href={`https://${data.personalInfo.github}`}
              className="hover:underline"
              style={{ color: hasHeaderBg ? "#ffffff" : palette.accent }}
            >
              GitHub
            </a>
          )}
          {data.personalInfo.website && (
            <a
              href={data.personalInfo.website}
              className="hover:underline"
              style={{ color: hasHeaderBg ? "#ffffff" : palette.accent }}
            >
              Website
            </a>
          )}
          {data.personalInfo.portfolio && (
            <a
              href={data.personalInfo.portfolio}
              className="hover:underline"
              style={{ color: hasHeaderBg ? "#ffffff" : palette.accent }}
            >
              Portfolio
            </a>
          )}
        </div>
      )}
    </header>
  );
}

/* ─── Main CV Preview ─── */

function CVPreviewContent({
  data,
  palette,
  templateId,
  layoutId,
  templateStyles,
}: {
  data: CVData;
  palette: TemplatePaletteColors;
  templateId: string;
  layoutId: string;
  templateStyles: ReturnType<typeof getTemplateStyles>;
}) {
  const isEmpty =
    !data.personalInfo.name &&
    !data.summary &&
    data.experience.length === 0 &&
    data.education.length === 0 &&
    data.skills.length === 0;

  const isSidebarLayout =
    layoutId === "sidebar-left" || layoutId === "sidebar-right";

  if (isSidebarLayout) {
    const sidebarBg = `${palette.primary}08`;
    const sidebar = (
      <div
        className="p-5 space-y-4"
        style={{
          backgroundColor: sidebarBg,
          borderRight:
            layoutId === "sidebar-left"
              ? `1px solid ${palette.secondary}20`
              : "none",
          borderLeft:
            layoutId === "sidebar-right"
              ? `1px solid ${palette.secondary}20`
              : "none",
          minWidth: "220px",
          width: "35%",
        }}
      >
        <SidebarContent
          data={data}
          palette={palette}
          templateStyles={templateStyles}
        />
      </div>
    );

    const main = (
      <div className="flex-1 p-6 space-y-5">
        <CVHeader
          data={data}
          palette={palette}
          templateStyles={templateStyles}
          templateId={templateId}
        />
        <MainContent
          data={data}
          palette={palette}
          templateStyles={templateStyles}
          isEmpty={isEmpty}
          includeSideSections={false}
        />
      </div>
    );

    return (
      <div className={cn("flex min-h-full", templateStyles.bodyFont)}>
        {layoutId === "sidebar-left" ? (
          <>
            {sidebar}
            {main}
          </>
        ) : (
          <>
            {main}
            {sidebar}
          </>
        )}
      </div>
    );
  }

  if (layoutId === "two-column") {
    return (
      <div className={cn("p-8", templateStyles.bodyFont)}>
        <CVHeader
          data={data}
          palette={palette}
          templateStyles={templateStyles}
          templateId={templateId}
        />
        <div className="mt-6 grid grid-cols-2 gap-6">
          {/* Left column: summary, experience, education */}
          <div className="space-y-5">
            {data.summary ? (
              <section>
                <SectionTitle palette={palette} templateStyles={templateStyles}>
                  Summary
                </SectionTitle>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: palette.secondary }}
                >
                  {data.summary}
                </p>
              </section>
            ) : (
              <SkeletonSection title="Summary" color={palette.primary} />
            )}

            {data.experience.length > 0 ? (
              <section>
                <SectionTitle palette={palette} templateStyles={templateStyles}>
                  Experience
                </SectionTitle>
                <div className="space-y-3">
                  {data.experience.map((exp) => (
                    <div key={exp.id}>
                      <h3
                        className="font-medium text-sm"
                        style={{ color: palette.primary }}
                      >
                        {exp.position}
                      </h3>
                      <p
                        className="text-xs"
                        style={{ color: palette.secondary }}
                      >
                        {exp.company} · {exp.startDate} — {exp.endDate}
                      </p>
                      {exp.description && (
                        <p
                          className="mt-1 text-xs"
                          style={{ color: palette.secondary }}
                        >
                          {exp.description}
                        </p>
                      )}
                      {exp.achievements.length > 0 && (
                        <ul
                          className="mt-1 list-disc list-inside text-xs space-y-0.5"
                          style={{ color: palette.secondary }}
                        >
                          {exp.achievements.map((ach, i) => (
                            <li key={i}>{ach}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ) : (
              <SkeletonSection title="Experience" color={palette.primary} />
            )}

            {data.publications.length > 0 && (
              <section>
                <SectionTitle palette={palette} templateStyles={templateStyles}>
                  Publications
                </SectionTitle>
                <div className="space-y-2">
                  {data.publications.map((pub) => (
                    <div key={pub.id}>
                      <h3
                        className="font-medium text-xs"
                        style={{ color: palette.primary }}
                      >
                        {pub.title}
                      </h3>
                      <p
                        className="text-[10px]"
                        style={{ color: palette.secondary }}
                      >
                        {pub.publisher} · {pub.date}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.volunteerWork.length > 0 && (
              <section>
                <SectionTitle palette={palette} templateStyles={templateStyles}>
                  Volunteer
                </SectionTitle>
                <div className="space-y-2">
                  {data.volunteerWork.map((vol) => (
                    <div key={vol.id}>
                      <h3
                        className="font-medium text-xs"
                        style={{ color: palette.primary }}
                      >
                        {vol.role}
                      </h3>
                      <p
                        className="text-[10px]"
                        style={{ color: palette.secondary }}
                      >
                        {vol.organization} · {vol.startDate} — {vol.endDate}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right column: education, skills, languages, certs, projects, awards, interests */}
          <div className="space-y-5">
            {data.education.length > 0 && (
              <section>
                <SectionTitle palette={palette} templateStyles={templateStyles}>
                  Education
                </SectionTitle>
                <div className="space-y-2">
                  {data.education.map((edu) => (
                    <div key={edu.id}>
                      <h3
                        className="font-medium text-sm"
                        style={{ color: palette.primary }}
                      >
                        {edu.degree} in {edu.field}
                      </h3>
                      <p
                        className="text-xs"
                        style={{ color: palette.secondary }}
                      >
                        {edu.institution} · {edu.startDate} — {edu.endDate}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.skills.length > 0 && (
              <section>
                <SectionTitle palette={palette} templateStyles={templateStyles}>
                  Skills
                </SectionTitle>
                <div className="space-y-2">
                  {data.skills.map((skill) => (
                    <div key={skill.id}>
                      <p
                        className="text-xs font-medium mb-1"
                        style={{ color: palette.primary }}
                      >
                        {skill.category}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {skill.items.map((item, i) => (
                          <span
                            key={i}
                            className={templateStyles.chipStyle}
                            style={{
                              color: palette.accent,
                              backgroundColor: `${palette.accent}10`,
                            }}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.languages.length > 0 && (
              <section>
                <SectionTitle palette={palette} templateStyles={templateStyles}>
                  Languages
                </SectionTitle>
                <div className="space-y-1">
                  {data.languages.map((lang) => (
                    <div key={lang.id} className="text-xs">
                      <span
                        className="font-medium"
                        style={{ color: palette.primary }}
                      >
                        {lang.language}
                      </span>
                      <span style={{ color: palette.secondary }}>
                        {" "}
                        — {lang.proficiency}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.projects.length > 0 && (
              <section>
                <SectionTitle palette={palette} templateStyles={templateStyles}>
                  Projects
                </SectionTitle>
                <div className="space-y-2">
                  {data.projects.map((project) => (
                    <div key={project.id}>
                      <h3
                        className="font-medium text-xs"
                        style={{ color: palette.primary }}
                      >
                        {project.name}
                      </h3>
                      <p
                        className="text-[10px]"
                        style={{ color: palette.secondary }}
                      >
                        {project.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.certifications.length > 0 && (
              <section>
                <SectionTitle palette={palette} templateStyles={templateStyles}>
                  Certifications
                </SectionTitle>
                <div className="space-y-1">
                  {data.certifications.map((cert) => (
                    <div key={cert.id} className="text-xs">
                      <span
                        className="font-medium"
                        style={{ color: palette.primary }}
                      >
                        {cert.name}
                      </span>
                      <span style={{ color: palette.secondary }}>
                        {" "}
                        · {cert.issuer} · {cert.date}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.awards.length > 0 && (
              <section>
                <SectionTitle palette={palette} templateStyles={templateStyles}>
                  Awards
                </SectionTitle>
                <div className="space-y-1">
                  {data.awards.map((award) => (
                    <div key={award.id} className="text-xs">
                      <span
                        className="font-medium"
                        style={{ color: palette.primary }}
                      >
                        {award.title}
                      </span>
                      <span style={{ color: palette.secondary }}>
                        {" "}
                        · {award.issuer}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.interests.length > 0 && (
              <section>
                <SectionTitle palette={palette} templateStyles={templateStyles}>
                  Interests
                </SectionTitle>
                <p className="text-xs" style={{ color: palette.secondary }}>
                  {data.interests.join(" · ")}
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default: Single column
  return (
    <div className={cn("p-8 space-y-6", templateStyles.bodyFont)}>
      <CVHeader
        data={data}
        palette={palette}
        templateStyles={templateStyles}
        templateId={templateId}
      />
      <MainContent
        data={data}
        palette={palette}
        templateStyles={templateStyles}
        isEmpty={isEmpty}
        includeSideSections={true}
      />
    </div>
  );
}
