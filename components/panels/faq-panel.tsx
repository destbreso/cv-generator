"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HelpCircle, Bot, Palette, Shield, Code, Import } from "lucide-react";

const FAQ_SECTIONS = [
  {
    id: "general",
    label: "General",
    icon: HelpCircle,
    items: [
      {
        q: "What is CV Generator?",
        a: "CV Generator is an open-source, privacy-first resume builder. You can create, edit, and customize your CV with 18 templates, 14+ color palettes, and 4 layout modes, all from your browser. Optionally, use AI to tailor your resume for specific job applications.",
      },
      {
        q: "Is it free to use?",
        a: "Yes, completely free and open-source under the MIT License. No subscriptions, no hidden fees, no accounts required.",
      },
      {
        q: "Do I need to create an account?",
        a: "No. CV Generator works entirely in your browser. There is no sign-up, no login, and no server storing your data.",
      },
    ],
  },
  {
    id: "privacy",
    label: "Privacy & Data",
    icon: Shield,
    items: [
      {
        q: "Where is my CV data stored?",
        a: "All your CV data is stored locally in your browser's localStorage. Nothing is sent to any server unless you explicitly use a cloud AI provider to generate content.",
      },
      {
        q: "Is my data safe with AI generation?",
        a: "If you use Ollama (local), your data never leaves your machine. If you use cloud providers (OpenAI, Anthropic, Groq), your CV data is sent to their API only during generation — we don't store or relay it through any intermediary server.",
      },
      {
        q: "How do I delete all my data?",
        a: "Open the Storage Manager panel (database icon in the sidebar) where you can see every stored key, inspect its value, delete individual keys, or use 'Clear All Data' to wipe everything. You can also export a backup before deleting.",
      },
    ],
  },
  {
    id: "ai",
    label: "AI Generation",
    icon: Bot,
    items: [
      {
        q: "Can I use this without AI?",
        a: "Absolutely! The editor, templates, palettes, layouts, and export all work independently. AI is purely optional — useful when you want to tailor your CV content for a specific job posting.",
      },
      {
        q: "How do I set up Ollama (local AI)?",
        a: "1) Install Ollama from ollama.ai\n2) Pull a model: ollama pull llama3.2\n3) Ollama runs on http://localhost:11434 by default\n4) In the app, click ⚙️ → select Ollama → Test Connection\n\nAll processing happens on your machine — no data leaves your computer.",
      },
      {
        q: "Which AI providers are supported?",
        a: "Ollama (local, free), OpenAI (GPT-4o, GPT-4), Anthropic (Claude 3.5+), Groq (fast inference), and any OpenAI-compatible custom endpoint.",
      },
      {
        q: "Why is AI generation slow?",
        a: "Local models (Ollama) depend on your hardware — a GPU significantly speeds things up. Cloud providers are generally faster but require an API key and internet connection.",
      },
      {
        q: "How does the AI tailor my CV?",
        a: "Paste a job description in the Generate tab. The AI analyzes your existing CV data and rewrites content to better match the target role — emphasizing relevant skills, using impactful language, and quantifying achievements. The output keeps the same structure as your original data.",
      },
    ],
  },
  {
    id: "templates",
    label: "Templates & Styling",
    icon: Palette,
    items: [
      {
        q: "How many templates are available?",
        a: "18 templates: Minimal, Professional, Modern, Creative, Executive, Tech, Compact, Academic, Elegant, Swiss, Editorial, Startup, Harvard, Oxford, Cambridge, Princeton, Yale, and MIT.",
      },
      {
        q: "Can I create a custom color palette?",
        a: "Yes! In the Templates tab → Colors section, scroll past the preset palettes to find the Custom Palette picker. Click each color circle to pick your own primary, secondary, and accent colors.",
      },
      {
        q: "Can I add my own template?",
        a: "Yes! Add a new entry to the TEMPLATES array in lib/cv-store.tsx and a matching style definition in getTemplateStyles() in components/panels/preview-panel.tsx. See CONTRIBUTING.md for details.",
      },
      {
        q: "What layout options are available?",
        a: "Four layouts: Single Column (classic), Sidebar Left, Sidebar Right, and Two Column. Combined with templates and palettes, you can create hundreds of unique combinations.",
      },
    ],
  },
  {
    id: "import-export",
    label: "Import & Export",
    icon: Import,
    items: [
      {
        q: "How do I export my CV to PDF?",
        a: "Click the print button (🖨️) in the preview panel. Your browser's print dialog opens — select 'Save as PDF'. The output faithfully reproduces the preview with all colors, formatting, and page breaks.",
      },
      {
        q: "Can I import my LinkedIn profile?",
        a: "Yes! Go to LinkedIn → your profile → 'More' → 'Save to PDF'. Then in the Editor tab, click the LinkedIn import button and upload the PDF. Fields will be auto-populated.",
      },
      {
        q: "Can I save and load my CV data?",
        a: "Yes. Use Export (↓) to save your CV data as a JSON file, and Import (↑) to load it back. Your data is also auto-saved to localStorage. For full data management (backup, restore, inspect, delete), use the Storage Manager panel.",
      },
      {
        q: "What page formats are supported?",
        a: "A4 (210 × 297 mm) and US Letter (215.9 × 279.4 mm). Switch between them in the preview toolbar.",
      },
    ],
  },
  {
    id: "technical",
    label: "Technical",
    icon: Code,
    items: [
      {
        q: "What technologies is this built with?",
        a: "Next.js 16, React 19, TypeScript 5, Tailwind CSS v4, shadcn/ui + Radix UI, react-resizable-panels, and Server-Sent Events for AI streaming.",
      },
      {
        q: "Can I self-host this?",
        a: "Yes! Clone the repo, run pnpm install && pnpm build, then deploy to any platform that supports Node.js — Vercel, Railway, Docker, VPS, etc.",
      },
      {
        q: "How do I contribute?",
        a: "Fork the repo, create a feature branch, make your changes, and open a Pull Request. See CONTRIBUTING.md for detailed guidelines.",
      },
    ],
  },
];

export function FAQPanel() {
  const totalQuestions = FAQ_SECTIONS.reduce(
    (acc, s) => acc + s.items.length,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {FAQ_SECTIONS.length} categories · {totalQuestions} questions
        </p>
      </div>

      <Separator />

      {/* Sections */}
      <div className="space-y-8">
        {FAQ_SECTIONS.map((section) => (
          <div key={section.id}>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center">
                <section.icon className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-semibold text-sm">{section.label}</h3>
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0 ml-1"
              >
                {section.items.length}
              </Badge>
            </div>

            <Accordion type="multiple" className="space-y-2">
              {section.items.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`${section.id}-${i}`}
                  className="border rounded-lg px-4 transition-colors data-[state=open]:bg-muted/30"
                >
                  <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline gap-3 [&>svg]:shrink-0">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground pb-4 whitespace-pre-line leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>

      {/* Footer */}
      <Separator />
      <div className="text-center pb-4 space-y-1">
        <p className="text-xs text-muted-foreground">
          Read our full{" "}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Privacy Policy
          </a>
          .
        </p>
        <p className="text-xs text-muted-foreground">
          Can&apos;t find what you&apos;re looking for? Open an issue on{" "}
          <a
            href="https://github.com/destbreso/cv-generator/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </div>
  );
}
