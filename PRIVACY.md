# Privacy Policy — CV Generator

**Last updated:** October 10, 2026

CV Generator is an open-source, privacy-first application. This document explains what data is collected, how it is stored, and what control you have over it.

---

## 1. No Accounts, No Tracking Cookies

- CV Generator does **not** require sign-up, login, or any form of authentication.
- The site counts visits with **Google Analytics 4** in its cookieless mode: **no cookies**, no advertising features, and no identifier that could link one visit to the next.
- Besides page views, it counts a few actions (generating a CV, importing a LinkedIn PDF, exporting a file), tagged at most with the AI provider or the file type. **Nothing from your CV, your job descriptions or your prompts is ever sent to analytics.**
- There are no tracking pixels and no other telemetry, and no server keeps a copy of your data.

---

## 2. Local Data Storage

All application data is stored exclusively in your browser's **localStorage**. This includes:

| Data Category           | Description                                                                                 | Storage Keys                                                                                                                   |
|-------------------------|---------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------|
| **CV Data**             | Your personal information, experience, education, skills, projects, and all other CV fields | `cv-data`, `cv_data` (legacy)                                                                                                  |
| **AI Configuration**    | LLM provider settings, model selection, base URL, system prompt                             | `ai-config`, `llm_config` (legacy)                                                                                             |
| **Generation History**  | All AI-generated CV versions with metadata and timestamps                                   | `cv-iterations`, `cv_iterations` (legacy)                                                                                      |
| **Templates & Styling** | Selected template, color palette, layout, and any custom styling overrides                  | `cv-template`, `cv-template-id`, `cv-palette-id`, `cv-layout-id`, `cv-customization`, `cv-layouts`, `template_customization_*` |
| **Preferences**         | Theme preference (light/dark/system)                                                        | `theme`                                                                                                                        |

### Important facts:

- **Your data is saved only in your browser.** It leaves your device only when you use an AI feature: generating a CV or importing a LinkedIn PDF (see Sections 4 and 6).
- Data persists until you clear it manually or clear your browser's storage.
- Each browser profile has its own independent storage — data is not synced across devices.
- localStorage has a ~5 MB limit per origin. The Storage Manager panel shows your current usage.

---

## 3. Storage Manager

CV Generator includes a built-in **Storage Manager** (accessible from the sidebar) that gives you full transparency and control:

- **Inspect** — View every stored key, its size, category, and raw JSON value.
- **Search** — Filter keys by name, category, or content.
- **Delete** — Remove individual keys or batch-delete selected items. Critical keys are flagged with a warning.
- **Export** — Download a full backup of all stored data as a timestamped JSON file.
- **Import** — Restore data from a previously exported backup file.
- **Clear All** — Permanently delete all CV Generator data with a single action (with confirmation dialog).
- **Quota Monitor** — See how much of the ~5 MB localStorage limit you are using.

You are always in full control of your data.

---

## 4. AI Provider Data Handling

CV Generator supports AI-powered CV optimization. How your data is handled depends on the provider you choose:

### How a request travels

When you click "Generate", your browser sends your CV data, the job context, the system prompt and your provider settings (including the API key, if your provider needs one) to CV Generator's own API route (`/api/generate-cv`), on the server that runs the app. The route forwards the request to the provider you chose and streams the answer back to your browser. **It keeps no copy of your CV, your job context or your key.** Testing a connection or listing models sends only the provider settings, never your CV.

### Local AI (Ollama)

When you run CV Generator on your own computer, its API route runs there too and talks to **Ollama** on `localhost`, so your data never leaves your machine. This is the most private option. The hosted site cannot reach an Ollama running on your computer, so it offers cloud providers only; for local AI, run your own copy (the code is open source).

### Cloud AI Providers

When using cloud providers (**OpenAI**, **Anthropic**, **Groq**, or a custom endpoint), the following happens:

1. Your CV data and job context reach the provider through the app's API route, as described above.
2. Data is sent **only when you explicitly click "Generate"** or import a LinkedIn PDF, never automatically or in the background.
3. The provider processes your data according to **their** privacy policy:
   - [OpenAI Privacy Policy](https://openai.com/privacy)
   - [Anthropic Privacy Policy](https://www.anthropic.com/privacy)
   - [Groq Privacy Policy](https://groq.com/privacy-policy/)

### What is sent to AI providers?

Only the following data is sent when you trigger generation:

- Your CV data (the fields visible in the Editor)
- The job description / context you entered
- The system prompt (visible and editable in AI Configuration)

API keys are stored in your browser's localStorage and travel with each request, through the app's API route, to the provider. The server **never** stores them.

---

## 5. Third-Party Services

CV Generator relies on these outside services, and no others:

- **Cloudflare** hosts the site and runs its API routes.
- **Google Analytics 4**, in its cookieless mode, counts anonymous visits and actions (Section 1). Its script loads from Google when the page opens.
- **The AI provider you choose**, only when you use an AI feature.

And it does not use:

- ❌ No advertising or tracking cookies
- ❌ No Facebook Pixel
- ❌ No Sentry or error reporting
- ❌ No CDN-hosted fonts (the Geist fonts are served with the app)
- ❌ No server-side data storage
- ❌ No data selling

---

## 6. LinkedIn PDF Import

When you import a LinkedIn PDF:

- The PDF is read **server-side** by the app's API route (`/api/parse-linkedin-pdf`), which extracts its text.
- That text is sent, through the same route, to the AI provider you configured, which turns it into structured CV data. When you run the app yourself with Ollama, all of this happens on your machine.
- **Neither the PDF nor its text is stored:** both are processed in memory and discarded.
- The extracted CV data is stored only in your browser's localStorage, like all other data.

---

## 7. Data Portability

You can export and import all your data at any time:

- **Export All** — The Storage Manager exports everything as a JSON file, including CV data, AI config, history, and preferences.
- **Import** — Restore from a previously exported JSON backup.
- **JSON CV Export** — The Editor panel allows exporting just your CV data as JSON.

Your data is never locked in. You own it entirely.

---

## 8. Data Deletion

You have multiple ways to delete your data:

1. **Storage Manager** — Use "Clear All Data" to delete everything, or selectively delete individual keys.
2. **Browser Settings** — Clear localStorage for the site through your browser's developer tools or settings.
3. **Uninstall/Close** — Since data is only in localStorage, clearing browser data removes everything.

Once deleted, data cannot be recovered unless you have a previously exported backup.

---

## 9. Children's Privacy

CV Generator does not knowingly collect information from anyone under the age of 13. The application has no user accounts and does not collect any personal data server-side.

---

## 10. Changes to This Policy

If this privacy policy changes, the update will be reflected in this file with an updated date. Since this is an open-source project, all changes are visible in the Git history.

---

## 11. Contact

For privacy-related questions or concerns, please open an issue on the [GitHub repository](https://github.com/destbreso/cv-generator) or contact the maintainer at dev.destbreso@gmail.com.

---

<p align="center">
  <strong>TL;DR:</strong> Your data stays in your browser. Your CV only leaves it when you use an AI feature, and then it goes through the app's own server to the AI provider you chose, without being stored on the way. The site counts anonymous visits, with no cookies and no identifier that could link visits to you. You have full control to inspect, export, or delete everything at any time.
</p>
