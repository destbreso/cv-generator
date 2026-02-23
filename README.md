# CV Generator — AI-Powered Resume Builder

An open-source, privacy-first CV/resume builder with AI-powered optimization. Built with Next.js 16, React 19, and Tailwind CSS v4. Supports local LLMs (Ollama) and cloud providers (OpenAI, Anthropic, Groq) for intelligent resume tailoring.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 💡 Why This Exists

Every professional maintains the same information scattered across dozens of places: a Word document, a Google Doc "updated" version, a PDF you emailed last year, a LinkedIn profile that's slightly different, a version tailored for that one job you applied to in 2023. Every time you need a CV, you open whichever file you find first, realize it's outdated, copy-paste from another version, reformat, adjust, and inevitably lose track of what's current.

**The problem isn't writing a CV. It's that you don't have a single source of truth.**

Think about it: your professional history — your experience, skills, education, projects — is *one* dataset. It doesn't change depending on where you apply. What changes is *which parts you highlight* and *how you present them*. But instead of maintaining one canonical record and generating tailored views from it, we've been maintaining dozens of divergent copies. It's the same mistake as copying a database instead of querying it.

### The obvious solution (once you see it)

1. **One knowledge base.** You maintain a single, complete, structured record of everything: every role, every skill, every project, every certification. This is your source of truth. You update it once, and it's always current.

2. **Generate, don't duplicate.** When you need a CV for a specific job, you don't copy and edit — you *generate* an optimized version from your complete data. The AI reads the job description, selects the most relevant experience, emphasizes the right skills, and adjusts the tone. The output is a tailored CV. Your source data stays untouched.

3. **Templates and formatting are separate concerns.** Your content shouldn't be locked into a format. Want a minimal single-column layout today and a sidebar layout tomorrow? Switch. Want a different color palette for a creative role vs. a corporate one? Switch. The data doesn't care about the presentation.

4. **AI assists, you decide.** The AI can draft, suggest, and optimize — but you always have the final word. Review every change, edit any detail, tweak the wording until it feels right. Run multiple iterations until you're satisfied. Or skip AI entirely and write everything yourself — the editor, templates, and export work perfectly without it. The tool adapts to your workflow, not the other way around.

5. **Your data stays yours.** Everything lives in your browser. No accounts, no cloud sync, no vendor lock-in. Export your data as JSON anytime. If you use AI, you can run it locally with Ollama — your professional history never leaves your machine.

This is what CV Generator does. It's not a "prettier resume template" — it's the workflow that makes maintaining and tailoring your CV a solved problem instead of a recurring chore.

---

## ✨ Features

### 📝 Full CV Editor
- Structured editor with collapsible sections for all CV fields
- Personal info, summary, experience, education, skills, languages, projects, certifications, publications, volunteer work, awards, and interests
- Import/export CV data as JSON
- **LinkedIn PDF upload** — upload your LinkedIn profile PDF and auto-populate CV fields
- Load sample data for quick testing

### 🤖 AI-Powered Generation
- Tailor your CV for specific job descriptions with AI
- **Output language selector** — generate your CV in any of 13 languages (English, Spanish, French, German, Portuguese, Italian, Dutch, Chinese, Japanese, Korean, Arabic, Russian, Hindi) or auto-detect from your input
- Streaming generation with real-time preview
- Support for 8 AI providers:
  - **Ollama** — Run locally, completely free and private
  - **OpenAI** — GPT-4o, GPT-4
  - **Anthropic** — Claude 3.5+
  - **Groq** — Fast inference
  - **Google Gemini** — Gemini 2.0 Flash
  - **Mistral** — Mistral models
  - **DeepSeek** — DeepSeek Chat
  - **Custom** — Any OpenAI-compatible API
- Apply AI suggestions directly to your editor
- Version history with diff viewer

### 🎨 18 Templates
Minimal, Professional, Modern, Creative, Executive, Tech, Compact, Academic, Elegant, Swiss, Editorial, Startup, Harvard, Oxford, Cambridge, Princeton, Yale, and MIT.

### 🎭 14 Color Palettes + Custom Picker
Default, Ocean, Forest, Sunset, Grape, Monochrome, Slate, Rose, Teal, Amber, Navy, Coral, Lavender, Charcoal — plus a fully custom palette picker where you choose primary, secondary, and accent colors.

### 📐 4 Layout Modes
Single Column, Sidebar Left, Sidebar Right, and Two Column.

### 📄 Page Format & Preview
- A4 and US Letter page formats
- Paginated preview with accurate page breaks
- Grid view for multi-page overview
- Zoom controls (25%–200%)
- Scroll or grid viewing modes

### 🖨️ Print & Export
- Print-ready output faithful to the preview
- PDF export via browser print dialog
- Full `print-color-adjust: exact` support for backgrounds and colors

### 🌓 Theming & Offline
- Light, Dark, and System theme modes
- Multiple built-in color themes (Console Light, Console Dark, Modern)
- Works completely offline after first load — no servers needed
- Consistent design across all components

### 🗄️ Storage Manager
- Full transparency dashboard — see every key, its size, and category
- Storage usage bar with quota percentage (~5 MB limit)
- Inspect any stored value (formatted JSON viewer)
- Delete individual keys with confirmation (critical keys are flagged)
- Bulk selection & batch delete
- Search and filter stored keys
- **Export all data** as a timestamped JSON backup file
- **Import data** from a previously exported backup
- **Clear All Data** with confirmation — nuclear option with safety dialog
- Detects legacy and dynamic keys (e.g., per-template customizations)
- Shows unused registered keys that will be populated as you use the app
- Privacy notice embedded in the panel

### 🧩 Developer Experience
- Resizable panels (editor + preview side by side)
- Keyboard-friendly UI
- Responsive sidebar with tooltips
- Clean, modern IDE-like interface

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.17+ (recommended: 20+)
- **pnpm**, **yarn**, or **npm**
- *(Optional)* **Ollama** for local AI generation — [Install Ollama](https://ollama.ai)

### Installation

```bash
# Clone the repository
git clone https://github.com/destbreso/cv-generator.git
cd cv-generator

# Install dependencies
pnpm install
# or
yarn install
# or
npm install

# Start the development server
pnpm dev
# or
yarn dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Setting up AI (Optional)

#### Local with Ollama (Free & Private)

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model
ollama pull llama3.2

# Ollama runs on http://localhost:11434 by default
```

Then in the app, click the ⚙️ settings icon → select **Ollama** → **Test Connection**.

#### Cloud Providers

Click ⚙️ → select your provider:
- **OpenAI** → enter API key → test connection
- **Anthropic** → enter API key → test connection  
- **Groq** → enter API key → test connection
- **Google Gemini** → enter API key → test connection
- **Mistral** → enter API key → test connection
- **DeepSeek** → enter API key → test connection
- **Custom** → enter base URL, model name, and API key → test connection

---

## 🏗️ Project Structure

```
cv-generator/
├── app/
│   ├── layout.tsx              # Root layout with theme provider
│   ├── page.tsx                # Home page (CV store provider + landing page)
│   ├── globals.css             # Global styles, themes, animations, print rules
│   ├── editor/
│   │   └── layout.tsx          # Editor-specific layout with overflow control
│   └── api/
│       ├── generate-cv/        # AI generation endpoint (SSE streaming)
│       ├── test-connection/    # Test AI provider connection
│       ├── test-ollama/        # Ollama-specific health check
│       ├── test-llm/           # LLM generation test
│       ├── list-models/        # Fetch available models
│       └── parse-linkedin-pdf/ # LinkedIn PDF parser
├── components/
│   ├── layout/
│   │   └── main-layout.tsx     # App shell (sidebar, tabs, resizable panels)
│   ├── landing/
│   │   ├── landing-page.tsx    # Landing page with hero, features, pricing
│   │   └── scroll-reveal.tsx   # Scroll animation utility
│   ├── panels/
│   │   ├── cv-editor-panel.tsx        # Full CV editor with collapsible sections
│   │   ├── preview-panel.tsx          # Live preview with pagination & export
│   │   ├── template-panel.tsx         # Template, color, layout, favorites selectors
│   │   ├── generate-panel.tsx         # AI generation interface
│   │   ├── history-panel.tsx          # Version history with diffs
│   │   ├── faq-panel.tsx              # Built-in FAQ section
│   │   └── storage-manager-panel.tsx  # Storage transparency & management UI
│   ├── sheets/
│   │   └── ai-config-sheet.tsx # AI provider configuration sheet
│   ├── dialogs/                # Reusable modal dialogs
│   ├── ui/                     # shadcn/ui components
│   ├── theme-switcher.tsx      # Theme selector component
│   ├── theme-provider.tsx      # Theme context provider
│   ├── linkedin-import-dialog.tsx     # LinkedIn PDF import flow
│   ├── cv-preview.tsx          # CV preview component
│   ├── diff-viewer.tsx         # Version comparison viewer
│   └── ...
├── lib/
│   ├── cv-store.tsx            # Global state (useReducer + Context with favorites/palettes)
│   ├── types.ts                # TypeScript interfaces (CVData, etc.)
│   ├── utils.ts                # Utilities (cn, etc.)
│   ├── storage-manager.ts      # Storage scanning, export/import, registry
│   ├── diff-utils.ts           # Diff comparison utilities
│   └── export-utils.tsx        # Export/print helpers
├── hooks/
│   ├── use-github-engagement.ts # GitHub engagement toasts & editor tips
│   └── ...                     # Custom React hooks
├── types/                      # Global TypeScript types
├── styles/                     # Additional stylesheets
└── public/                     # Static assets
```

---

## 🛠️ Tech Stack

| Category     | Technology                         |
|--------------|------------------------------------|
| Framework    | Next.js 16 (App Router, Turbopack) |
| UI Library   | React 19                           |
| Language     | TypeScript 5                       |
| Styling      | Tailwind CSS v4, CSS Variables     |
| Components   | shadcn/ui + Radix UI primitives    |
| State        | useReducer + React Context         |
| Panels       | react-resizable-panels             |
| Fonts        | Geist Sans + Geist Mono            |
| PDF Parsing  | pdf-parse                          |
| AI Streaming | Server-Sent Events (SSE)           |

---

## � Deployment (Cloudflare Workers)

This project is configured for deployment on **Cloudflare Workers** using [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare).

### Prerequisites

- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed (`npm i -g wrangler`)
- A Cloudflare account (free tier works)
- Authenticated via `wrangler login`

### Configuration files

| File                  | Purpose                                                                       |
|-----------------------|-------------------------------------------------------------------------------|
| `wrangler.jsonc`      | Cloudflare Workers config (name, compatibility, assets)                       |
| `open-next.config.ts` | OpenNext adapter — sets `buildCommand: "pnpm build"` and R2 incremental cache |
| `.env.production`     | Production env vars (built into the bundle at build time)                     |
| `.env.example`        | Template for local `.env` — copy and adjust                                   |

### Environment Variables

| Variable                     | Values                      | Default  | Description                                                               |
|------------------------------|-----------------------------|----------|---------------------------------------------------------------------------|
| `NEXT_PUBLIC_DEFAULT_THEME`  | `light` · `dark` · `modern` | `modern` | Default UI theme                                                          |
| `NEXT_PUBLIC_DISABLE_OLLAMA` | `true` · `false`            | `false`  | Disable Ollama provider (set `true` in production — Ollama is local only) |

### Build & Deploy

```bash
# 1. Stub @vercel/og files to stay under the 3 MiB free-tier bundle limit
for f in node_modules/.pnpm/next@16.*/node_modules/next/dist/compiled/@vercel/og/{resvg.wasm,yoga.wasm,index.edge.js}; do
  echo "// stub" > "$f"
done

# 2. Build for Cloudflare Workers
pnpm build:cf

# 3. Deploy
pnpm deploy:cf
```

Or as a one-liner:

```bash
for f in node_modules/.pnpm/next@16.*/node_modules/next/dist/compiled/@vercel/og/{resvg.wasm,yoga.wasm,index.edge.js}; do echo "// stub" > "$f"; done && pnpm build:cf && pnpm deploy:cf
```

### Local Preview (Cloudflare)

```bash
pnpm preview:cf
```

> **Note:** The `@vercel/og` stubs are lost after every `pnpm install`. You must re-stub before each build.  
> The `.env*` files are gitignored — never commit secrets. Use `.env.example` as a reference.

---

## �📋 FAQ

Common questions are answered in the app's built-in FAQ section (click **FAQ** in the sidebar).

<details>
<summary><strong>Can I use this without AI?</strong></summary>

Yes! The editor, templates, palettes, layouts, and export work completely independently. AI is optional — useful for tailoring your CV to specific job descriptions.
</details>

<details>
<summary><strong>Is my data sent to any server?</strong></summary>

No. All CV data stays in your browser (localStorage). If you use Ollama, AI processing also stays on your machine. Cloud providers (OpenAI, etc.) only receive data when you explicitly generate.
</details>

<details>
<summary><strong>How do I export to PDF?</strong></summary>

Use the print button in the preview panel → your browser's print dialog opens → select "Save as PDF". The output faithfully reproduces the preview with all colors and formatting.
</details>

<details>
<summary><strong>Can I generate my CV in a different language?</strong></summary>

Yes! In the Generate panel, select an output language before generating. The AI will translate all content (summary, descriptions, achievements, skill categories) to your chosen language while preserving proper nouns like company names, institutions, and technologies. You can also set it to "Auto" to keep the same language as your input data.
</details>

<details>
<summary><strong>Can I add my own templates?</strong></summary>

Yes! Add a new entry to the `TEMPLATES` array in `lib/cv-store.tsx` and a matching style definition in `getTemplateStyles()` in `components/panels/preview-panel.tsx`.
</details>

---

## � AI Disclaimer

This project was built with the assistance of AI tools. I used [v0](https://v0.dev) for an initial mockup and then refined the entire codebase with [GitHub Copilot](https://github.com/features/copilot), switching between models depending on task complexity.

I acted as **product owner, project manager, and developer** throughout the process — defining features, breaking down tasks, reviewing every output, and programming alongside the AI agents.

> **AI amplifies you, but creativity, asking the right questions, and discovering the right problem to solve — that's something only you can do.**

Keep coding. 🚀

---

## �🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) to keep our community respectful and inclusive.

---

## 🔒 Security

If you discover a security vulnerability, please report it responsibly by emailing **dev.destbreso@gmail.com** (not via public issues). See [SECURITY.md](SECURITY.md) for details.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## � Privacy Policy

Your privacy matters. All CV data stays in your browser's localStorage. See the full [Privacy Policy](PRIVACY.md) for details on data storage, AI provider usage, and your rights.

---

## �🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) — Beautiful, accessible UI components
- [Radix UI](https://radix-ui.com/) — Unstyled, accessible primitives
- [Ollama](https://ollama.ai/) — Run LLMs locally
- [Lucide](https://lucide.dev/) — Beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS

---

<p align="center">
  Built with ❤️ for the open-source community
</p>
