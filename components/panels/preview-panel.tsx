"use client";

import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import {
  useCVStore,
  COLOR_PALETTES,
  type TemplatePaletteColors,
} from "@/lib/cv-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  LayoutGrid,
  Rows3,
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
    compact: {
      headerStyle: "text-left",
      sectionTitleStyle: "text-xs font-bold uppercase tracking-widest",
      bodyFont: "font-sans",
      headerFont: "font-sans",
      borderStyle: "border-b",
      chipStyle: "text-[10px] px-1 py-0.5 rounded",
      headerLayout: "left",
      accentBar: true,
    },
    academic: {
      headerStyle: "text-center",
      sectionTitleStyle: "text-sm font-semibold italic",
      bodyFont: "font-serif",
      headerFont: "font-serif",
      borderStyle: "border-b",
      chipStyle: "text-xs italic",
      headerLayout: "center",
      accentBar: false,
    },
    elegant: {
      headerStyle: "text-center",
      sectionTitleStyle: "text-base font-medium tracking-wide",
      bodyFont: "font-serif",
      headerFont: "font-serif",
      borderStyle: "border-b",
      chipStyle: "text-xs px-2 py-0.5 rounded-full",
      headerLayout: "center",
      accentBar: false,
    },
    swiss: {
      headerStyle: "text-left",
      sectionTitleStyle: "text-lg font-black uppercase",
      bodyFont: "font-sans",
      headerFont: "font-sans",
      borderStyle: "border-b-4",
      chipStyle: "text-xs font-semibold px-2 py-0.5 rounded",
      headerLayout: "left",
      accentBar: true,
    },
    editorial: {
      headerStyle: "text-left",
      sectionTitleStyle: "text-sm font-semibold uppercase tracking-[0.2em]",
      bodyFont: "font-serif",
      headerFont: "font-sans",
      borderStyle: "border-b-2",
      chipStyle: "text-xs px-2 py-0.5 rounded-lg",
      headerLayout: "left",
      accentBar: true,
    },
    startup: {
      headerStyle: "text-center",
      sectionTitleStyle: "text-base font-bold",
      bodyFont: "font-sans",
      headerFont: "font-sans",
      borderStyle: "border-b-2",
      chipStyle: "text-xs font-medium px-2.5 py-1 rounded-full",
      headerLayout: "center",
      accentBar: true,
    },
    harvard: {
      headerStyle: "text-center",
      sectionTitleStyle: "text-sm font-bold uppercase tracking-widest",
      bodyFont: "font-serif",
      headerFont: "font-serif",
      borderStyle: "border-b",
      chipStyle: "text-xs",
      headerLayout: "center",
      accentBar: false,
    },
    oxford: {
      headerStyle: "text-center",
      sectionTitleStyle: "text-sm font-semibold uppercase tracking-[0.2em]",
      bodyFont: "font-serif",
      headerFont: "font-serif",
      borderStyle: "border-b",
      chipStyle: "text-xs italic",
      headerLayout: "center",
      accentBar: false,
    },
    cambridge: {
      headerStyle: "text-left",
      sectionTitleStyle: "text-sm font-bold uppercase tracking-wide",
      bodyFont: "font-sans",
      headerFont: "font-sans",
      borderStyle: "border-b",
      chipStyle: "text-xs",
      headerLayout: "left",
      accentBar: false,
    },
    princeton: {
      headerStyle: "text-center",
      sectionTitleStyle: "text-base font-black uppercase",
      bodyFont: "font-serif",
      headerFont: "font-sans",
      borderStyle: "border-b-2",
      chipStyle: "text-xs font-semibold",
      headerLayout: "center",
      accentBar: true,
    },
    yale: {
      headerStyle: "text-center",
      sectionTitleStyle: "text-sm font-semibold uppercase tracking-widest",
      bodyFont: "font-serif",
      headerFont: "font-serif",
      borderStyle: "border-b",
      chipStyle: "text-xs",
      headerLayout: "center",
      accentBar: false,
    },
    mit: {
      headerStyle: "text-left",
      sectionTitleStyle: "text-sm font-bold uppercase tracking-wide",
      bodyFont: "font-sans",
      headerFont: "font-sans",
      borderStyle: "border-b-2",
      chipStyle: "text-xs font-mono px-1.5 py-0.5 rounded border",
      headerLayout: "left",
      accentBar: true,
    },
  };
  return styles[templateId] || styles.minimal;
}

/* ─── Page format definitions ─── */

type PageFormat = "a4" | "letter";

const PAGE_FORMATS: Record<
  PageFormat,
  { label: string; widthMm: number; heightMm: number; css: string }
> = {
  a4: { label: "A4", widthMm: 210, heightMm: 297, css: "A4" },
  letter: { label: "Letter", widthMm: 215.9, heightMm: 279.4, css: "letter" },
};

/* ─── mm → px helper (computed once) ─── */
let _mmToPx: number | null = null;
function mmToPx(mm: number): number {
  if (_mmToPx === null) {
    const el = document.createElement("div");
    el.style.width = "100mm";
    el.style.position = "absolute";
    el.style.visibility = "hidden";
    document.body.appendChild(el);
    _mmToPx = el.offsetWidth / 100;
    document.body.removeChild(el);
  }
  return mm * _mmToPx;
}

/* ─── Page margins (mm) ─── */
const PAGE_MARGIN_TOP = 12;
const PAGE_MARGIN_BOTTOM = 14;
const PAGE_MARGIN_SIDE = 0; // side margins handled by CVPreviewContent padding

export function PreviewPanel() {
  const { state } = useCVStore();
  const {
    cvData,
    generatedCVData,
    generatedContent,
    selectedTemplateId,
    selectedPaletteId,
    customPalette,
    selectedLayoutId,
    isGenerating,
    isImportingLinkedIn,
  } = state;

  const [viewMode, setViewMode] = useState<"preview" | "json" | "raw">(
    "preview",
  );
  const [zoom, setZoom] = useState(80);
  const [copied, setCopied] = useState(false);
  const [pageFormat, setPageFormat] = useState<PageFormat>("a4");
  const [previewLayout, setPreviewLayout] = useState<"scroll" | "grid">(
    "scroll",
  );
  const [pageCount, setPageCount] = useState(1);

  // Hidden off-screen container to measure total content height
  const measureRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const displayData = generatedCVData || cvData;
  const palette = useMemo(
    () =>
      selectedPaletteId === "custom" && customPalette
        ? customPalette
        : (COLOR_PALETTES.find((p) => p.id === selectedPaletteId)?.colors ??
          COLOR_PALETTES[0].colors),
    [selectedPaletteId, customPalette],
  );
  const templateStyles = useMemo(
    () => getTemplateStyles(selectedTemplateId),
    [selectedTemplateId],
  );

  const fmt = PAGE_FORMATS[pageFormat];
  const pageWidthPx = useMemo(() => mmToPx(fmt.widthMm), [fmt.widthMm]);
  const pageHeightPx = useMemo(() => mmToPx(fmt.heightMm), [fmt.heightMm]);
  const contentHeightPx = useMemo(
    () => pageHeightPx - mmToPx(PAGE_MARGIN_TOP) - mmToPx(PAGE_MARGIN_BOTTOM),
    [pageHeightPx],
  );

  // Measure content and compute page count
  const calculatePages = useCallback(() => {
    if (!measureRef.current) return;
    const totalH = measureRef.current.scrollHeight;
    const pages = Math.max(1, Math.ceil(totalH / contentHeightPx));
    setPageCount(pages);
  }, [contentHeightPx]);

  useEffect(() => {
    const node = measureRef.current;
    if (!node) return;
    // Initial calculation with a small delay for rendering
    const timer = setTimeout(calculatePages, 50);
    const ro = new ResizeObserver(() => calculatePages());
    ro.observe(node);
    return () => {
      clearTimeout(timer);
      ro.disconnect();
    };
  }, [
    calculatePages,
    displayData,
    selectedTemplateId,
    selectedLayoutId,
    pageFormat,
  ]);

  const handleCopy = async () => {
    const content =
      viewMode === "json"
        ? JSON.stringify(displayData, null, 2)
        : generatedContent || JSON.stringify(displayData, null, 2);
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ── Build standalone CSS from current template/palette ── */
  const buildExportStyles = () => {
    const ts = templateStyles;
    const p = palette;

    const fontMap: Record<string, string> = {
      "font-sans":
        "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      "font-serif": "Georgia, 'Times New Roman', Times, serif",
      "font-mono":
        "'SF Mono', SFMono-Regular, Menlo, Consolas, 'Liberation Mono', 'Courier New', monospace",
    };
    const bodyFont = fontMap[ts.bodyFont] || fontMap["font-sans"];
    const headerFont = fontMap[ts.headerFont] || bodyFont;

    const borderMap: Record<string, string> = {
      "border-b": `1px solid ${p.accent}`,
      "border-b-2": `2px solid ${p.accent}`,
      "border-b-4": `4px solid ${p.accent}`,
      "border-b border-dashed": `1px dashed ${p.accent}`,
    };
    const sectionBorder = ts.accentBar
      ? borderMap[ts.borderStyle] || `2px solid ${p.accent}`
      : `1px solid ${p.secondary}66`;

    const headerAlign = ts.headerLayout === "center" ? "center" : "left";

    const titleSizeMap: Record<string, string> = {};
    if (ts.sectionTitleStyle.includes("text-sm"))
      titleSizeMap.fontSize = "0.875rem";
    else if (ts.sectionTitleStyle.includes("text-base"))
      titleSizeMap.fontSize = "1rem";
    else titleSizeMap.fontSize = "0.875rem";

    const titleWeight = ts.sectionTitleStyle.includes("font-black")
      ? "900"
      : ts.sectionTitleStyle.includes("font-bold")
        ? "700"
        : "600";

    const titleTransform = ts.sectionTitleStyle.includes("uppercase")
      ? "uppercase"
      : "none";
    const titleTracking = ts.sectionTitleStyle.includes("tracking-[0.2em]")
      ? "0.2em"
      : ts.sectionTitleStyle.includes("tracking-widest")
        ? "0.1em"
        : ts.sectionTitleStyle.includes("tracking-wide")
          ? "0.05em"
          : "normal";

    const pageSizeCss = fmt.css;
    const pageW = `${fmt.widthMm}mm`;

    return `
      * { margin: 0; padding: 0; box-sizing: border-box; }

      /* Force browsers to print background colors and images */
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }

      body {
        font-family: ${bodyFont};
        line-height: 1.6;
        color: ${p.primary};
        background: #ffffff;
      }

      .cv-root {
        max-width: ${pageW};
        margin: 0 auto;
        background: #ffffff;
      }

      .cv-root > div[style*="display: flex"],
      .cv-root > div.flex { display: flex !important; }

      /* Preserve all inline background-color styles */
      [style*="background-color"],
      [style*="backgroundColor"],
      [style*="background:"] {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      header { text-align: ${headerAlign}; }
      header h1 {
        font-family: ${headerFont};
        font-weight: 700;
        font-size: 1.875rem;
        line-height: 1.2;
        color: ${p.primary};
      }
      header p { margin-top: 0.125rem; }

      h2 {
        font-family: ${ts.bodyFont === "font-mono" ? fontMap["font-mono"] : bodyFont};
        font-size: ${titleSizeMap.fontSize};
        font-weight: ${titleWeight};
        text-transform: ${titleTransform};
        letter-spacing: ${titleTracking};
        color: ${p.primary};
        border-bottom: ${sectionBorder};
        padding-bottom: 0.25rem;
        margin-bottom: 0.75rem;
      }

      h3 { font-weight: 500; color: ${p.primary}; }
      p, li, span { font-size: 0.875rem; }
      a { color: ${p.accent}; text-decoration: none; }
      a:hover { text-decoration: underline; }
      ul { padding-left: 1.25rem; }
      li { margin-bottom: 0.25rem; }

      span[style*="background"],
      div[style*="background"] {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      span[style*="background"] {
        display: inline-block;
        padding: 0.125rem 0.5rem;
        border-radius: ${ts.chipStyle.includes("rounded-full") ? "9999px" : ts.chipStyle.includes("rounded-lg") ? "0.5rem" : "0.25rem"};
        font-size: 0.75rem;
        margin: 0.125rem;
      }

      .skeleton { display: none !important; }
      .animate-pulse { animation: none !important; }

      section { margin-bottom: 1.25rem; break-inside: avoid; }
      header { break-inside: avoid; }
      .space-y-5 > * + * { margin-top: 1.25rem; }
      .space-y-4 > * + * { margin-top: 1rem; }
      .space-y-3 > * + * { margin-top: 0.75rem; }
      .space-y-2 > * + * { margin-top: 0.5rem; }
      .space-y-1 > * + * { margin-top: 0.25rem; }
      .space-y-1\\.5 > * + * { margin-top: 0.375rem; }

      .flex { display: flex; }
      .flex-1 { flex: 1 1 0%; }
      .flex-col { flex-direction: column; }
      .flex-wrap { flex-wrap: wrap; }
      .items-center { align-items: center; }
      .items-start { align-items: flex-start; }
      .justify-between { justify-content: space-between; }
      .justify-center { justify-content: center; }
      .gap-1 { gap: 0.25rem; }
      .gap-1\\.5 { gap: 0.375rem; }
      .gap-2 { gap: 0.5rem; }
      .gap-3 { gap: 0.75rem; }
      .gap-4 { gap: 1rem; }
      .gap-6 { gap: 1.5rem; }
      .gap-x-6 { column-gap: 1.5rem; }
      .gap-y-1 { row-gap: 0.25rem; }
      .shrink-0 { flex-shrink: 0; }

      .grid { display: grid; }
      .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }

      .p-5 { padding: 1.25rem; }
      .p-6 { padding: 1.5rem; }
      .p-8 { padding: 2rem; }
      .px-1 { padding-left: 0.25rem; padding-right: 0.25rem; }
      .px-1\\.5 { padding-left: 0.375rem; padding-right: 0.375rem; }
      .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
      .px-2\\.5 { padding-left: 0.625rem; padding-right: 0.625rem; }
      .py-0\\.5 { padding-top: 0.125rem; padding-bottom: 0.125rem; }
      .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
      .mt-1 { margin-top: 0.25rem; }
      .mt-2 { margin-top: 0.5rem; }
      .mt-6 { margin-top: 1.5rem; }
      .mb-1 { margin-bottom: 0.25rem; }
      .mb-2 { margin-bottom: 0.5rem; }
      .mb-3 { margin-bottom: 0.75rem; }
      .pb-1 { padding-bottom: 0.25rem; }
      .min-h-full { min-height: 100%; }
      .min-w-\\[100px\\] { min-width: 100px; }
      .min-w-\\[120px\\] { min-width: 120px; }
      .w-full { width: 100%; }

      .border { border: 1px solid ${p.secondary}30; }
      .border-r { border-right: 1px solid ${p.secondary}20; }
      .border-l { border-left: 1px solid ${p.secondary}20; }
      .border-b { border-bottom: 1px solid ${p.secondary}20; }
      .border-dashed { border-style: dashed; }

      .text-\\[10px\\] { font-size: 10px; }
      .text-xs { font-size: 0.75rem; line-height: 1rem; }
      .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
      .text-base { font-size: 1rem; line-height: 1.5rem; }
      .text-lg { font-size: 1.125rem; }
      .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
      .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
      .font-medium { font-weight: 500; }
      .font-semibold { font-weight: 600; }
      .font-bold { font-weight: 700; }
      .font-black { font-weight: 900; }
      .font-sans { font-family: ${fontMap["font-sans"]}; }
      .font-serif { font-family: ${fontMap["font-serif"]}; }
      .font-mono { font-family: ${fontMap["font-mono"]}; }
      .italic { font-style: italic; }
      .uppercase { text-transform: uppercase; }
      .tracking-widest { letter-spacing: 0.1em; }
      .tracking-wide { letter-spacing: 0.05em; }
      .tracking-\\[0\\.2em\\] { letter-spacing: 0.2em; }
      .leading-relaxed { line-height: 1.625; }
      .list-disc { list-style-type: disc; }
      .list-inside { list-style-position: inside; }
      .hover\\:underline:hover { text-decoration: underline; }

      .rounded { border-radius: 0.25rem; }
      .rounded-full { border-radius: 9999px; }
      .rounded-lg { border-radius: 0.5rem; }

      .cv-root > div { min-height: 100%; }

      h3.text-xs {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin-bottom: 0.5rem;
      }

      @media print {
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        body { background: white; margin: 0; }
        @page { margin: ${PAGE_MARGIN_TOP}mm ${PAGE_MARGIN_SIDE || 10}mm ${PAGE_MARGIN_BOTTOM}mm; size: ${pageSizeCss}; }
        .cv-root { max-width: 100%; box-shadow: none; }
      }
    `;
  };

  const buildFullHTML = (innerHtml: string) => {
    const name = displayData.personalInfo.name || "Untitled";
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CV - ${name}</title>
  <style>${buildExportStyles()}</style>
</head>
<body>
  <div class="cv-root">${innerHtml}</div>
</body>
</html>`;
  };

  const handleExportPDF = () => {
    if (!measureRef.current) return;
    const html = measureRef.current.innerHTML;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(buildFullHTML(html));
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 300);
  };

  const handleExportHTML = () => {
    const html = measureRef.current?.innerHTML || "";
    const fullHTML = buildFullHTML(html);
    const blob = new Blob([fullHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cv-${(displayData.personalInfo.name || "untitled").replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  /* ── Page array for rendering ── */
  const pages = useMemo(
    () => Array.from({ length: pageCount }, (_, i) => i),
    [pageCount],
  );

  const gridScale = zoom / 100;

  return (
    <div className="h-full flex flex-col">
      {/* Header / Toolbar */}
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
              {/* Format selector */}
              <select
                className="h-7 text-xs rounded border border-border bg-background px-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                value={pageFormat}
                onChange={(e) => setPageFormat(e.target.value as PageFormat)}
              >
                <option value="a4">A4</option>
                <option value="letter">Letter</option>
              </select>

              <div className="w-px h-4 bg-border mx-0.5" />

              {/* Layout toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  setPreviewLayout((l) => (l === "scroll" ? "grid" : "scroll"))
                }
                title={previewLayout === "scroll" ? "Grid view" : "Scroll view"}
              >
                {previewLayout === "scroll" ? (
                  <LayoutGrid className="h-4 w-4" />
                ) : (
                  <Rows3 className="h-4 w-4" />
                )}
              </Button>

              <div className="w-px h-4 bg-border mx-0.5" />

              {/* Zoom */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setZoom(Math.max(30, zoom - 10))}
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

              {pageCount > 0 && (
                <>
                  <div className="w-px h-4 bg-border mx-0.5" />
                  <span className="text-xs text-muted-foreground">
                    {pageCount} pg
                  </span>
                </>
              )}
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

      {/* Hidden measurement container – renders content at full page width off-screen */}
      <div
        ref={measureRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-99999px",
          top: 0,
          width: `${fmt.widthMm}mm`,
          visibility: "hidden",
          pointerEvents: "none",
        }}
      >
        <CVPreviewContent
          data={displayData}
          palette={palette}
          templateId={selectedTemplateId}
          layoutId={selectedLayoutId}
          templateStyles={templateStyles}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto" ref={scrollContainerRef}>
        <div
          className="p-6"
          style={{
            background:
              viewMode === "preview"
                ? "repeating-conic-gradient(#80808015 0% 25%, transparent 0% 50%) 0 0 / 20px 20px"
                : undefined,
          }}
        >
          {/* ── PREVIEW: Generating / importing skeleton ── */}
          {viewMode === "preview" && (isGenerating || isImportingLinkedIn) && (
            <div
              className="mx-auto flex flex-col items-center gap-6"
              style={{
                width: `${pageWidthPx * gridScale + 4}px`,
              }}
            >
              {/* Single skeleton page */}
              <div
                className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.05)] overflow-hidden relative"
                style={{
                  width: `${pageWidthPx}px`,
                  height: `${pageHeightPx}px`,
                  transform: `scale(${gridScale})`,
                  transformOrigin: "top left",
                }}
              >
                <GeneratingSkeleton
                  palette={palette}
                  message={
                    isImportingLinkedIn ? "Importing from LinkedIn…" : undefined
                  }
                />
              </div>
            </div>
          )}

          {/* ── PREVIEW: Paginated pages ── */}
          {viewMode === "preview" && !isGenerating && !isImportingLinkedIn && (
            <div
              className={cn(
                "mx-auto",
                previewLayout === "grid"
                  ? "flex flex-wrap justify-center gap-6"
                  : "flex flex-col items-center gap-4",
              )}
            >
              {pages.map((pageIdx) => {
                const scale = gridScale;
                const marginTopPx = mmToPx(PAGE_MARGIN_TOP);
                const marginBottomPx = mmToPx(PAGE_MARGIN_BOTTOM);

                return (
                  <div
                    key={pageIdx}
                    className="relative"
                    style={{
                      width: `${pageWidthPx * scale}px`,
                      height: `${pageHeightPx * scale}px`,
                    }}
                  >
                    {/* Scaled page */}
                    <div
                      className="absolute top-0 left-0 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.05)] overflow-hidden"
                      style={{
                        width: `${pageWidthPx}px`,
                        height: `${pageHeightPx}px`,
                        transform: `scale(${scale})`,
                        transformOrigin: "top left",
                        paddingTop: `${marginTopPx}px`,
                        paddingBottom: `${marginBottomPx}px`,
                        boxSizing: "border-box",
                      }}
                    >
                      {/* Content area – clips to safe zone between margins */}
                      <div
                        style={{
                          height: `${contentHeightPx}px`,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            marginTop: `-${pageIdx * contentHeightPx}px`,
                          }}
                        >
                          <CVPreviewContent
                            data={displayData}
                            palette={palette}
                            templateId={selectedTemplateId}
                            layoutId={selectedLayoutId}
                            templateStyles={templateStyles}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Page number label */}
                    <span
                      className="absolute bottom-1 right-2 text-[10px] text-muted-foreground/60 select-none"
                      style={{
                        transform: `scale(${1 / scale})`,
                        transformOrigin: "bottom right",
                      }}
                    >
                      {pageIdx + 1} / {pageCount}
                    </span>
                  </div>
                );
              })}
            </div>
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
      </div>
    </div>
  );
}

/* ─── Generation Skeleton ─── */

function GeneratingSkeleton({
  palette,
  message,
}: {
  palette: TemplatePaletteColors;
  message?: string;
}) {
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
          style={{
            backgroundColor: `${palette.accent}12`,
            color: palette.accent,
          }}
        >
          <Loader2 className="h-4 w-4 animate-spin" />
          <Sparkles className="h-3.5 w-3.5" />
          {message || "AI is optimizing your CV…"}
        </div>
      </div>

      {/* Header skeleton */}
      <header className="text-center space-y-3">
        <div className="flex flex-col items-center gap-2">
          <div
            className="h-8 w-64 rounded animate-pulse"
            style={{ backgroundColor: `${palette.primary}12` }}
          />
          <div
            className="h-4 w-44 rounded animate-pulse"
            style={{ backgroundColor: `${palette.accent}15` }}
          />
        </div>
        <div className="flex items-center justify-center gap-3 mt-2">
          <div
            className="h-3 w-32 rounded animate-pulse"
            style={{ backgroundColor: `${palette.secondary}12` }}
          />
          <span style={{ color: `${palette.secondary}30` }}>•</span>
          <div
            className="h-3 w-24 rounded animate-pulse"
            style={{ backgroundColor: `${palette.secondary}12` }}
          />
          <span style={{ color: `${palette.secondary}30` }}>•</span>
          <div
            className="h-3 w-28 rounded animate-pulse"
            style={{ backgroundColor: `${palette.secondary}12` }}
          />
        </div>
      </header>

      {/* Summary skeleton */}
      <section className="space-y-2">
        <div
          className="h-5 w-48 rounded animate-pulse"
          style={{ backgroundColor: `${palette.primary}12` }}
        />
        <div
          className="h-px w-full"
          style={{ backgroundColor: `${palette.accent}20` }}
        />
        <div className="space-y-2 pt-1">
          <div
            className="h-3 w-full rounded animate-pulse"
            style={{ backgroundColor: `${palette.secondary}10` }}
          />
          <div
            className="h-3 w-[92%] rounded animate-pulse"
            style={{ backgroundColor: `${palette.secondary}10` }}
          />
          <div
            className="h-3 w-[85%] rounded animate-pulse"
            style={{ backgroundColor: `${palette.secondary}10` }}
          />
        </div>
      </section>

      {/* Experience skeleton */}
      <section className="space-y-2">
        <div
          className="h-5 w-40 rounded animate-pulse"
          style={{ backgroundColor: `${palette.primary}12` }}
        />
        <div
          className="h-px w-full"
          style={{ backgroundColor: `${palette.accent}20` }}
        />
        {[1, 2].map((i) => (
          <div key={i} className="space-y-2 pt-2">
            <div className="flex justify-between">
              <div className="space-y-1.5 flex-1">
                <div
                  className="h-4 w-52 rounded animate-pulse"
                  style={{ backgroundColor: `${palette.primary}12` }}
                />
                <div
                  className="h-3 w-36 rounded animate-pulse"
                  style={{ backgroundColor: `${palette.secondary}10` }}
                />
              </div>
              <div
                className="h-3 w-28 rounded animate-pulse"
                style={{ backgroundColor: `${palette.accent}12` }}
              />
            </div>
            <div className="space-y-1.5">
              <div
                className="h-3 w-full rounded animate-pulse"
                style={{ backgroundColor: `${palette.secondary}08` }}
              />
              <div
                className="h-3 w-[90%] rounded animate-pulse"
                style={{ backgroundColor: `${palette.secondary}08` }}
              />
              <div
                className="h-3 w-[75%] rounded animate-pulse"
                style={{ backgroundColor: `${palette.secondary}08` }}
              />
            </div>
          </div>
        ))}
      </section>

      {/* Education skeleton */}
      <section className="space-y-2">
        <div
          className="h-5 w-32 rounded animate-pulse"
          style={{ backgroundColor: `${palette.primary}12` }}
        />
        <div
          className="h-px w-full"
          style={{ backgroundColor: `${palette.accent}20` }}
        />
        <div className="flex justify-between pt-2">
          <div className="space-y-1.5">
            <div
              className="h-4 w-56 rounded animate-pulse"
              style={{ backgroundColor: `${palette.primary}12` }}
            />
            <div
              className="h-3 w-40 rounded animate-pulse"
              style={{ backgroundColor: `${palette.secondary}10` }}
            />
          </div>
          <div
            className="h-3 w-28 rounded animate-pulse"
            style={{ backgroundColor: `${palette.accent}12` }}
          />
        </div>
      </section>

      {/* Skills skeleton */}
      <section className="space-y-2">
        <div
          className="h-5 w-24 rounded animate-pulse"
          style={{ backgroundColor: `${palette.primary}12` }}
        />
        <div
          className="h-px w-full"
          style={{ backgroundColor: `${palette.accent}20` }}
        />
        <div className="space-y-2 pt-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-2 items-center">
              <div
                className="h-3 w-24 rounded animate-pulse"
                style={{ backgroundColor: `${palette.primary}10` }}
              />
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

  return (
    <header
      className={cn("transition-all", templateStyles.headerStyle)}
      style={{ padding: "0" }}
    >
      {data.personalInfo.name ? (
        <>
          <h1
            className={cn(
              "font-bold",
              templateStyles.headerFont,
              isCreative ? "text-4xl" : "text-3xl",
            )}
            style={{ color: palette.primary }}
          >
            {data.personalInfo.name}
          </h1>
          {data.personalInfo.title && (
            <p
              className="text-base mt-0.5"
              style={{
                color: palette.accent,
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
            color: palette.secondary,
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
            color: palette.secondary,
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
              style={{ color: palette.accent }}
            >
              LinkedIn
            </a>
          )}
          {data.personalInfo.github && (
            <a
              href={`https://${data.personalInfo.github}`}
              className="hover:underline"
              style={{ color: palette.accent }}
            >
              GitHub
            </a>
          )}
          {data.personalInfo.website && (
            <a
              href={data.personalInfo.website}
              className="hover:underline"
              style={{ color: palette.accent }}
            >
              Website
            </a>
          )}
          {data.personalInfo.portfolio && (
            <a
              href={data.personalInfo.portfolio}
              className="hover:underline"
              style={{ color: palette.accent }}
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
