# Privacy Policy — CV Generator

**Last updated:** February 8, 2026

CV Generator is an open-source, privacy-first application. This document explains what data is collected, how it is stored, and what control you have over it.

---

## 1. No Accounts, No Tracking

- CV Generator does **not** require sign-up, login, or any form of authentication.
- There are **no analytics**, **no tracking pixels**, **no cookies** (beyond what your browser manages natively), and **no telemetry**.
- The application does not collect, transmit, or store your data on any external server.

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

- **No data leaves your device** unless you explicitly use a cloud AI provider (see Section 4).
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

### Local AI (Ollama) — Fully Private

When using **Ollama**, all AI processing happens on your local machine. Your CV data is sent to `localhost` and never leaves your computer. This is the most private option.

### Cloud AI Providers

When using cloud providers (**OpenAI**, **Anthropic**, **Groq**, or a custom endpoint), the following happens:

1. Your CV data and job context are sent directly from your browser to the provider's API.
2. **No data passes through any intermediary server** — the request goes straight from your browser to the provider.
3. Data is sent **only when you explicitly click "Generate"** — never automatically or in the background.
4. The provider processes your data according to **their** privacy policy:
   - [OpenAI Privacy Policy](https://openai.com/privacy)
   - [Anthropic Privacy Policy](https://www.anthropic.com/privacy)
   - [Groq Privacy Policy](https://groq.com/privacy-policy/)

### What is sent to AI providers?

Only the following data is sent when you trigger generation:

- Your CV data (the fields visible in the Editor)
- The job description / context you entered
- The system prompt (visible and editable in AI Configuration)

API keys are stored in your browser's localStorage and sent directly to the provider. They are **never** transmitted to any other server.

---

## 5. Third-Party Services

CV Generator does **not** use any third-party services by default:

- ❌ No Google Analytics
- ❌ No Facebook Pixel
- ❌ No Sentry or error reporting
- ❌ No CDN-hosted fonts (Geist fonts are bundled locally)
- ❌ No external API calls on page load
- ❌ No server-side data storage

The only external network requests occur when you explicitly use a cloud AI provider.

---

## 6. LinkedIn PDF Import

When you import a LinkedIn PDF:

- The PDF file is processed **server-side** by the Next.js API route (`/api/parse-linkedin-pdf`).
- If running locally (development mode), this processing happens on your machine.
- If deployed, the PDF is processed on the hosting server and the extracted data is returned to your browser.
- **The PDF file is not stored** — it is processed in memory and discarded immediately.
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
  <strong>TL;DR:</strong> Your data stays in your browser. Nothing is tracked. Nothing is sent anywhere unless you explicitly use a cloud AI provider. You have full control to inspect, export, or delete everything at any time.
</p>
