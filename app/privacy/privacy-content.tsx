"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Database,
  Bot,
  FileText,
  Trash2,
  Download,
  Globe,
  Lock,
  Baby,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ThemeSwitcher } from "@/components/theme-switcher";

export function PrivacyContent() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to App
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs gap-1">
              <Lock className="h-3 w-3" />
              Privacy-First
            </Badge>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Title */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Privacy Policy
            </h1>
          </div>
          <p className="text-muted-foreground">
            Last updated: October 10, 2026
          </p>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            CV Generator is an open-source, privacy-first application. This
            document explains what data is collected, how it is stored, and what
            control you have over it.
          </p>
        </div>

        {/* TL;DR Banner */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 mb-10">
          <p className="text-sm font-medium text-center">
            <strong>TL;DR:</strong> Your data stays in your browser. Your CV
            only leaves it when you use an AI feature, and then it goes through
            the app&apos;s own server to the AI provider you chose, without
            being stored on the way. The site counts anonymous visits, with no
            cookies and no identifier that could link visits to you. You have
            full control to inspect, export, or delete everything at any time.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {/* Section 1 */}
          <PolicySection
            icon={Lock}
            number={1}
            title="No Accounts, No Tracking Cookies"
          >
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>
                CV Generator does{" "}
                <strong className="text-foreground">not</strong> require
                sign-up, login, or any form of authentication.
              </li>
              <li>
                The site counts visits with{" "}
                <strong className="text-foreground">Google Analytics 4</strong>{" "}
                in its cookieless mode:{" "}
                <strong className="text-foreground">no cookies</strong>, no
                advertising features, and no identifier that could link one
                visit to the next.
              </li>
              <li>
                Besides page views, it counts a few actions (generating a CV,
                importing a LinkedIn PDF, exporting a file), tagged at most with
                the AI provider or the file type.{" "}
                <strong className="text-foreground">
                  Nothing from your CV, your job descriptions or your prompts is
                  ever sent to analytics.
                </strong>
              </li>
              <li>
                There are no tracking pixels and no other telemetry, and no
                server keeps a copy of your data.
              </li>
            </ul>
          </PolicySection>

          <Separator />

          {/* Section 2 */}
          <PolicySection icon={Database} number={2} title="Local Data Storage">
            <p className="text-sm text-muted-foreground mb-4">
              All application data is stored exclusively in your browser&apos;s{" "}
              <strong className="text-foreground">localStorage</strong>. This
              includes:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left px-3 py-2 font-medium border-b border-border">
                      Category
                    </th>
                    <th className="text-left px-3 py-2 font-medium border-b border-border">
                      Description
                    </th>
                    <th className="text-left px-3 py-2 font-medium border-b border-border">
                      Keys
                    </th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border">
                    <td className="px-3 py-2 font-medium text-foreground">
                      CV Data
                    </td>
                    <td className="px-3 py-2">
                      Personal info, experience, education, skills, projects
                    </td>
                    <td className="px-3 py-2">
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        cv-data
                      </code>
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-3 py-2 font-medium text-foreground">
                      AI Config
                    </td>
                    <td className="px-3 py-2">
                      LLM provider, model, base URL, system prompt
                    </td>
                    <td className="px-3 py-2">
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        ai-config
                      </code>
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-3 py-2 font-medium text-foreground">
                      History
                    </td>
                    <td className="px-3 py-2">
                      AI-generated CV versions with metadata
                    </td>
                    <td className="px-3 py-2">
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        cv-iterations
                      </code>
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-3 py-2 font-medium text-foreground">
                      Templates
                    </td>
                    <td className="px-3 py-2">
                      Template, palette, layout, customizations
                    </td>
                    <td className="px-3 py-2">
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        cv-template-id
                      </code>
                      , etc.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-foreground">
                      Preferences
                    </td>
                    <td className="px-3 py-2">
                      Theme preference (light/dark/system)
                    </td>
                    <td className="px-3 py-2">
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        theme
                      </code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p>
                •{" "}
                <strong className="text-foreground">
                  Your data is saved only in your browser.
                </strong>{" "}
                It leaves your device only when you use an AI feature:
                generating a CV or importing a LinkedIn PDF (Sections 4 and 6).
              </p>
              <p>
                • Data persists until you clear it manually or clear your
                browser&apos;s storage.
              </p>
              <p>
                • Each browser profile has its own independent storage — data is
                not synced across devices.
              </p>
              <p>
                • localStorage has a ~5 MB limit per origin. The Storage Manager
                panel shows your current usage.
              </p>
            </div>
          </PolicySection>

          <Separator />

          {/* Section 3 */}
          <PolicySection icon={Database} number={3} title="Storage Manager">
            <p className="text-sm text-muted-foreground mb-3">
              CV Generator includes a built-in{" "}
              <strong className="text-foreground">Storage Manager</strong>{" "}
              (accessible from the sidebar) that gives you full transparency and
              control:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">Inspect</strong> — View
                every stored key, its size, category, and raw JSON value.
              </li>
              <li>
                <strong className="text-foreground">Search</strong> — Filter
                keys by name, category, or content.
              </li>
              <li>
                <strong className="text-foreground">Delete</strong> — Remove
                individual keys or batch-delete selected items.
              </li>
              <li>
                <strong className="text-foreground">Export</strong> — Download a
                full backup as a timestamped JSON file.
              </li>
              <li>
                <strong className="text-foreground">Import</strong> — Restore
                data from a previously exported backup.
              </li>
              <li>
                <strong className="text-foreground">Clear All</strong> —
                Permanently delete all data with a confirmation dialog.
              </li>
              <li>
                <strong className="text-foreground">Quota Monitor</strong> — See
                how much of the ~5 MB limit you are using.
              </li>
            </ul>
          </PolicySection>

          <Separator />

          {/* Section 4 */}
          <PolicySection
            icon={Bot}
            number={4}
            title="AI Provider Data Handling"
          >
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-medium text-foreground mb-1">
                  How a request travels
                </h4>
                <p>
                  When you click &ldquo;Generate&rdquo;, your browser sends your
                  CV data, the job context, the system prompt and your provider
                  settings (including the API key, if your provider needs one)
                  to CV Generator&apos;s own API route, on the server that runs
                  the app. The route forwards the request to the provider you
                  chose and streams the answer back to your browser.{" "}
                  <strong className="text-foreground">
                    It keeps no copy of your CV, your job context or your key.
                  </strong>{" "}
                  Testing a connection or listing models sends only the provider
                  settings, never your CV.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-1">
                  Local AI (Ollama)
                </h4>
                <p>
                  When you run CV Generator on your own computer, its API route
                  runs there too and talks to Ollama on{" "}
                  <code className="bg-muted px-1 py-0.5 rounded text-xs">
                    localhost
                  </code>
                  , so your data never leaves your machine. The hosted site
                  cannot reach an Ollama running on your computer, so it offers
                  cloud providers only; for local AI, run your own copy (the
                  code is open source).
                </p>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-1">
                  Cloud AI Providers
                </h4>
                <p className="mb-2">
                  When using cloud providers (OpenAI, Anthropic, Groq, or
                  custom):
                </p>
                <ol className="list-decimal list-inside space-y-1.5">
                  <li>
                    Your CV data and job context reach the provider through the
                    app&apos;s API route, as described above.
                  </li>
                  <li>
                    Data is sent{" "}
                    <strong className="text-foreground">
                      only when you explicitly click &ldquo;Generate&rdquo;
                    </strong>{" "}
                    or import a LinkedIn PDF.
                  </li>
                  <li>
                    The provider processes your data according to their privacy
                    policy.
                  </li>
                </ol>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-1">
                  What is sent to AI providers?
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Your CV data (the fields visible in the Editor)</li>
                  <li>The job description / context you entered</li>
                  <li>
                    The system prompt (visible and editable in AI Configuration)
                  </li>
                </ul>
                <p className="mt-2">
                  API keys are stored in your browser&apos;s localStorage and
                  travel with each request, through the app&apos;s API route, to
                  the provider. The server{" "}
                  <strong className="text-foreground">never</strong> stores
                  them.
                </p>
              </div>
            </div>
          </PolicySection>

          <Separator />

          {/* Section 5 */}
          <PolicySection icon={Globe} number={5} title="Third-Party Services">
            <p className="text-sm text-muted-foreground mb-3">
              CV Generator relies on these outside services, and no others:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground mb-4">
              <li>
                <strong className="text-foreground">Cloudflare</strong> hosts
                the site and runs its API routes.
              </li>
              <li>
                <strong className="text-foreground">Google Analytics 4</strong>
                , in its cookieless mode, counts anonymous visits and actions
                (Section 1). Its script loads from Google when the page opens.
              </li>
              <li>
                <strong className="text-foreground">
                  The AI provider you choose
                </strong>
                , only when you use an AI feature.
              </li>
            </ul>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <p>❌ No advertising or tracking cookies</p>
              <p>❌ No Facebook Pixel</p>
              <p>❌ No Sentry / error reporting</p>
              <p>❌ No CDN-hosted fonts</p>
              <p>❌ No server-side data storage</p>
              <p>❌ No data selling</p>
            </div>
          </PolicySection>

          <Separator />

          {/* Section 6 */}
          <PolicySection icon={FileText} number={6} title="LinkedIn PDF Import">
            <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground">
              <li>
                The PDF is read{" "}
                <strong className="text-foreground">server-side</strong> by the
                app&apos;s API route, which extracts its text.
              </li>
              <li>
                That text is sent, through the same route, to the AI provider
                you configured, which turns it into structured CV data. When you
                run the app yourself with Ollama, all of this happens on your
                machine.
              </li>
              <li>
                <strong className="text-foreground">
                  Neither the PDF nor its text is stored:
                </strong>{" "}
                both are processed in memory and discarded.
              </li>
              <li>
                Extracted CV data is stored only in your browser&apos;s
                localStorage.
              </li>
            </ul>
          </PolicySection>

          <Separator />

          {/* Section 7 */}
          <PolicySection icon={Download} number={7} title="Data Portability">
            <p className="text-sm text-muted-foreground mb-3">
              You can export and import all your data at any time:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">Export All</strong> —
                Storage Manager exports everything as a JSON file.
              </li>
              <li>
                <strong className="text-foreground">Import</strong> — Restore
                from a previously exported JSON backup.
              </li>
              <li>
                <strong className="text-foreground">JSON CV Export</strong> —
                Export just your CV data as JSON.
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-3">
              Your data is never locked in. You own it entirely.
            </p>
          </PolicySection>

          <Separator />

          {/* Section 8 */}
          <PolicySection icon={Trash2} number={8} title="Data Deletion">
            <p className="text-sm text-muted-foreground mb-3">
              You have multiple ways to delete your data:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">Storage Manager</strong> —
                Use &ldquo;Clear All Data&rdquo; or selectively delete keys.
              </li>
              <li>
                <strong className="text-foreground">Browser Settings</strong> —
                Clear localStorage through developer tools.
              </li>
              <li>
                <strong className="text-foreground">Uninstall/Close</strong> —
                Clearing browser data removes everything.
              </li>
            </ol>
            <p className="text-sm text-muted-foreground mt-3">
              Once deleted, data cannot be recovered unless you have a
              previously exported backup.
            </p>
          </PolicySection>

          <Separator />

          {/* Section 9 */}
          <PolicySection icon={Baby} number={9} title="Children's Privacy">
            <p className="text-sm text-muted-foreground">
              CV Generator does not knowingly collect information from anyone
              under the age of 13. The application has no user accounts and does
              not collect any personal data server-side.
            </p>
          </PolicySection>

          <Separator />

          {/* Section 10 */}
          <PolicySection
            icon={FileText}
            number={10}
            title="Changes to This Policy"
          >
            <p className="text-sm text-muted-foreground">
              If this privacy policy changes, the update will be reflected here
              with an updated date. Since this is an open-source project, all
              changes are visible in the Git history.
            </p>
          </PolicySection>

          <Separator />

          {/* Section 11 */}
          <PolicySection icon={Mail} number={11} title="Contact">
            <p className="text-sm text-muted-foreground">
              For privacy-related questions or concerns, please open an issue on
              the{" "}
              <a
                href="https://github.com/destbreso/cv-generator"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                GitHub repository
              </a>{" "}
              or contact the maintainer at{" "}
              <a
                href="mailto:dev.destbreso@gmail.com"
                className="text-primary hover:underline"
              >
                dev.destbreso@gmail.com
              </a>
              .
            </p>
          </PolicySection>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CV Generator — Open Source under{" "}
            <a
              href="https://github.com/destbreso/cv-generator/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MIT License
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}

// ─── Policy Section Component ───────────────────────────────────────────────

interface PolicySectionProps {
  icon: React.ComponentType<{ className?: string }>;
  number: number;
  title: string;
  children: React.ReactNode;
}

function PolicySection({
  icon: Icon,
  number,
  title,
  children,
}: PolicySectionProps) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <h2 className="text-lg font-semibold">
          <span className="text-muted-foreground mr-1.5">{number}.</span>
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
