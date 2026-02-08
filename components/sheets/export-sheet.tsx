"use client";

import { useState } from "react";
import { useCVStore } from "@/lib/cv-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  FileJson,
  FileText,
  Download,
  Printer,
  Copy,
  Check,
  FileCode,
  File,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ExportFormat = "json" | "html" | "pdf" | "markdown";

export function ExportSheet() {
  const { state } = useCVStore();
  const { cvData, generatedCVData } = state;

  const [format, setFormat] = useState<ExportFormat>("json");
  const [filename, setFilename] = useState(
    `cv-${cvData.personalInfo.name.replace(/\s+/g, "-").toLowerCase() || "export"}`,
  );
  const [copied, setCopied] = useState(false);
  const [useGenerated, setUseGenerated] = useState(!!generatedCVData);

  const displayData =
    useGenerated && generatedCVData ? generatedCVData : cvData;

  const handleExport = () => {
    switch (format) {
      case "json":
        exportJSON();
        break;
      case "html":
        exportHTML();
        break;
      case "pdf":
        exportPDF();
        break;
      case "markdown":
        exportMarkdown();
        break;
    }
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(displayData, null, 2)], {
      type: "application/json",
    });
    downloadBlob(blob, `${filename}.json`);
  };

  const exportHTML = () => {
    window.dispatchEvent(new CustomEvent("cv-export-html", { detail: { filename } }));
  };

  const exportPDF = () => {
    window.dispatchEvent(new CustomEvent("cv-export-pdf"));
  };

  const exportMarkdown = () => {
    const markdown = generateMarkdown(displayData);
    const blob = new Blob([markdown], { type: "text/markdown" });
    downloadBlob(blob, `${filename}.md`);
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    let content: string;
    switch (format) {
      case "json":
        content = JSON.stringify(displayData, null, 2);
        break;
      case "html":
        content = generateHTML(displayData);
        break;
      case "markdown":
        content = generateMarkdown(displayData);
        break;
      default:
        content = JSON.stringify(displayData, null, 2);
    }

    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ScrollArea className="h-[calc(100vh-120px)] pr-4 pl-1">
      <div className="space-y-6 py-4 pl-5">
        {/* Data Source */}
        {generatedCVData && (
          <>
            <div className="space-y-3">
              <Label>Data Source</Label>
              <RadioGroup
                value={useGenerated ? "generated" : "original"}
                onValueChange={(v) => setUseGenerated(v === "generated")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="original" id="original" />
                  <Label
                    htmlFor="original"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Original CV Data
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="generated" id="generated" />
                  <Label
                    htmlFor="generated"
                    className="text-sm font-normal cursor-pointer"
                  >
                    AI-Optimized CV Data
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <Separator />
          </>
        )}

        {/* Format Selection */}
        <div className="space-y-3">
          <Label>Export Format</Label>
          <div className="grid grid-cols-2 gap-2">
            <FormatOption
              id="json"
              name="JSON"
              description="Raw data"
              icon={<FileJson className="h-4 w-4" />}
              selected={format === "json"}
              onClick={() => setFormat("json")}
            />
            <FormatOption
              id="html"
              name="HTML"
              description="Web page"
              icon={<FileCode className="h-4 w-4" />}
              selected={format === "html"}
              onClick={() => setFormat("html")}
            />
            <FormatOption
              id="pdf"
              name="PDF"
              description="Print ready"
              icon={<File className="h-4 w-4" />}
              selected={format === "pdf"}
              onClick={() => setFormat("pdf")}
            />
            <FormatOption
              id="markdown"
              name="Markdown"
              description="Plain text"
              icon={<FileText className="h-4 w-4" />}
              selected={format === "markdown"}
              onClick={() => setFormat("markdown")}
            />
          </div>
        </div>

        <Separator />

        {/* Filename */}
        <div className="space-y-2">
          <Label htmlFor="filename">Filename</Label>
          <div className="flex gap-2">
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="cv-export"
            />
            <span className="flex items-center text-sm text-muted-foreground">
              .{format === "pdf" ? "html" : format}
            </span>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="space-y-3">
          <Button className="w-full gap-2" onClick={handleExport}>
            {format === "pdf" ? (
              <>
                <Printer className="h-4 w-4" />
                Print / Save as PDF
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download {format.toUpperCase()}
              </>
            )}
          </Button>

          {format !== "pdf" && (
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy to Clipboard
                </>
              )}
            </Button>
          )}
        </div>

        {/* Preview Stats */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <h4 className="font-medium text-sm mb-2">Export Preview</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Name: {displayData.personalInfo.name || "Not set"}</p>
              <p>• Experience entries: {displayData.experience.length}</p>
              <p>• Education entries: {displayData.education.length}</p>
              <p>• Skill categories: {displayData.skills.length}</p>
              <p>• Projects: {displayData.projects.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}

function FormatOption({
  id,
  name,
  description,
  icon,
  selected,
  onClick,
}: {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
        selected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50",
      )}
    >
      <div
        className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center",
          selected ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        {icon}
      </div>
      <div>
        <div className="font-medium text-sm">{name}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </button>
  );
}

// Helper functions
function generateHTML(
  data: typeof import("@/lib/cv-store").DEFAULT_CV_DATA,
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CV - ${data.personalInfo.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
    }
    header { text-align: center; margin-bottom: 2rem; }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    .contact { color: #666; font-size: 0.9rem; }
    .contact span { margin: 0 0.5rem; }
    section { margin-bottom: 1.5rem; }
    h2 {
      font-size: 1.25rem;
      border-bottom: 2px solid #e5e5e5;
      padding-bottom: 0.5rem;
      margin-bottom: 1rem;
    }
    .entry { margin-bottom: 1rem; }
    .entry-header { display: flex; justify-content: space-between; }
    .entry-title { font-weight: 600; }
    .entry-subtitle { color: #666; font-size: 0.9rem; }
    .entry-date { color: #888; font-size: 0.85rem; }
    ul { margin-left: 1.5rem; margin-top: 0.5rem; }
    @media print {
      body { padding: 20px; }
      @page { margin: 1cm; }
    }
  </style>
</head>
<body>
  <header>
    <h1>${data.personalInfo.name}</h1>
    <div class="contact">
      ${data.personalInfo.email ? `<span>${data.personalInfo.email}</span>` : ""}
      ${data.personalInfo.phone ? `<span>•</span><span>${data.personalInfo.phone}</span>` : ""}
      ${data.personalInfo.location ? `<span>•</span><span>${data.personalInfo.location}</span>` : ""}
    </div>
  </header>

  ${
    data.summary
      ? `
  <section>
    <h2>Professional Summary</h2>
    <p>${data.summary}</p>
  </section>
  `
      : ""
  }

  ${
    data.experience.length > 0
      ? `
  <section>
    <h2>Work Experience</h2>
    ${data.experience
      .map(
        (exp) => `
    <div class="entry">
      <div class="entry-header">
        <div>
          <div class="entry-title">${exp.position}</div>
          <div class="entry-subtitle">${exp.company}</div>
        </div>
        <div class="entry-date">${exp.startDate} - ${exp.endDate}</div>
      </div>
      ${exp.description ? `<p style="margin-top: 0.5rem; font-size: 0.9rem;">${exp.description}</p>` : ""}
      ${
        exp.achievements.length > 0
          ? `
      <ul>
        ${exp.achievements.map((ach) => `<li>${ach}</li>`).join("")}
      </ul>
      `
          : ""
      }
    </div>
    `,
      )
      .join("")}
  </section>
  `
      : ""
  }

  ${
    data.education.length > 0
      ? `
  <section>
    <h2>Education</h2>
    ${data.education
      .map(
        (edu) => `
    <div class="entry">
      <div class="entry-header">
        <div>
          <div class="entry-title">${edu.degree} in ${edu.field}</div>
          <div class="entry-subtitle">${edu.institution}</div>
        </div>
        <div class="entry-date">${edu.startDate} - ${edu.endDate}</div>
      </div>
    </div>
    `,
      )
      .join("")}
  </section>
  `
      : ""
  }

  ${
    data.skills.length > 0
      ? `
  <section>
    <h2>Skills</h2>
    ${data.skills
      .map(
        (skill) => `
    <p><strong>${skill.category}:</strong> ${skill.items.join(", ")}</p>
    `,
      )
      .join("")}
  </section>
  `
      : ""
  }

  ${
    data.projects.length > 0
      ? `
  <section>
    <h2>Projects</h2>
    ${data.projects
      .map(
        (project) => `
    <div class="entry">
      <div class="entry-title">${project.name}</div>
      <p style="font-size: 0.9rem;">${project.description}</p>
      <p style="font-size: 0.8rem; color: #888;">Technologies: ${project.technologies.join(", ")}</p>
    </div>
    `,
      )
      .join("")}
  </section>
  `
      : ""
  }
</body>
</html>`;
}

function generateMarkdown(
  data: typeof import("@/lib/cv-store").DEFAULT_CV_DATA,
): string {
  let md = `# ${data.personalInfo.name}\n\n`;

  const contact = [
    data.personalInfo.email,
    data.personalInfo.phone,
    data.personalInfo.location,
  ]
    .filter(Boolean)
    .join(" | ");

  if (contact) md += `${contact}\n\n`;

  if (
    data.personalInfo.linkedin ||
    data.personalInfo.github ||
    data.personalInfo.website
  ) {
    const links = [
      data.personalInfo.linkedin
        ? `[LinkedIn](${data.personalInfo.linkedin})`
        : null,
      data.personalInfo.github ? `[GitHub](${data.personalInfo.github})` : null,
      data.personalInfo.website
        ? `[Website](${data.personalInfo.website})`
        : null,
    ]
      .filter(Boolean)
      .join(" | ");
    md += `${links}\n\n`;
  }

  if (data.summary) {
    md += `## Professional Summary\n\n${data.summary}\n\n`;
  }

  if (data.experience.length > 0) {
    md += `## Work Experience\n\n`;
    data.experience.forEach((exp) => {
      md += `### ${exp.position} at ${exp.company}\n`;
      md += `*${exp.startDate} - ${exp.endDate}*\n\n`;
      if (exp.description) md += `${exp.description}\n\n`;
      if (exp.achievements.length > 0) {
        exp.achievements.forEach((ach) => {
          md += `- ${ach}\n`;
        });
        md += "\n";
      }
    });
  }

  if (data.education.length > 0) {
    md += `## Education\n\n`;
    data.education.forEach((edu) => {
      md += `### ${edu.degree} in ${edu.field}\n`;
      md += `${edu.institution} | *${edu.startDate} - ${edu.endDate}*\n\n`;
    });
  }

  if (data.skills.length > 0) {
    md += `## Skills\n\n`;
    data.skills.forEach((skill) => {
      md += `**${skill.category}:** ${skill.items.join(", ")}\n\n`;
    });
  }

  if (data.projects.length > 0) {
    md += `## Projects\n\n`;
    data.projects.forEach((project) => {
      md += `### ${project.name}\n`;
      md += `${project.description}\n\n`;
      md += `*Technologies: ${project.technologies.join(", ")}*\n\n`;
    });
  }

  if (data.certifications.length > 0) {
    md += `## Certifications\n\n`;
    data.certifications.forEach((cert) => {
      md += `- **${cert.name}** - ${cert.issuer} (${cert.date})\n`;
    });
  }

  return md;
}
