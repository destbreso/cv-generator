import type { CVData, CVTemplate, CVIteration, LLMConfig, TemplateCustomization, ColorPalette } from "./types"

// Templates
const defaultTemplates: CVTemplate[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean and contemporary design",
    content: `
      <div class="cv-modern">
        <header>
          <h1>{{personalInfo.name}}</h1>
          <p>{{personalInfo.email}} | {{personalInfo.phone}} | {{personalInfo.location}}</p>
          {{#if personalInfo.website}}<a href="{{personalInfo.website}}">Website</a>{{/if}}
          {{#if personalInfo.linkedin}}<a href="{{personalInfo.linkedin}}">LinkedIn</a>{{/if}}
          {{#if personalInfo.github}}<a href="{{personalInfo.github}}">GitHub</a>{{/if}}
        </header>
        <section>
          <h2>Summary</h2>
          <p>{{summary}}</p>
        </section>
        <section>
          <h2>Experience</h2>
          {{#each experience}}
          <div class="experience-item">
            <h3>{{position}} - {{company}}</h3>
            <p><em>{{startDate}} - {{endDate}}</em></p>
            <p>{{description}}</p>
            <ul>
              {{#each achievements}}<li>{{this}}</li>{{/each}}
            </ul>
          </div>
          {{/each}}
        </section>
        <section>
          <h2>Education</h2>
          {{#each education}}
          <div class="education-item">
            <h3>{{degree}} in {{field}}</h3>
            <p>{{institution}} | {{startDate}} - {{endDate}}</p>
          </div>
          {{/each}}
        </section>
        <section>
          <h2>Skills</h2>
          {{#each skills}}
          <p><strong>{{category}}:</strong> {{items}}</p>
          {{/each}}
        </section>
        {{#each projects}}
        <section>
          <h2>Projects</h2>
          <div class="project-item">
            <h3>{{name}}</h3>
            <p>{{description}}</p>
            <p><strong>Technologies:</strong> {{technologies}}</p>
          </div>
        </section>
        {{/each}}
      </div>
    `,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant layout",
    content: `
      <div class="cv-minimal">
        <h1>{{personalInfo.name}}</h1>
        <p>{{personalInfo.email}} • {{personalInfo.phone}} • {{personalInfo.location}}</p>
        <h2>Summary</h2>
        <p>{{summary}}</p>
        <h2>Experience</h2>
        {{#each experience}}
        <div>
          <h3>{{position}}, {{company}}</h3>
          <p>{{startDate}} - {{endDate}}</p>
          <p>{{description}}</p>
        </div>
        {{/each}}
        <h2>Education</h2>
        {{#each education}}
        <p><strong>{{degree}}</strong> in {{field}}, {{institution}} ({{startDate}} - {{endDate}})</p>
        {{/each}}
        <h2>Skills</h2>
        {{#each skills}}
        <p>{{category}}: {{items}}</p>
        {{/each}}
      </div>
    `,
  },
  {
    id: "technical",
    name: "Technical",
    description: "Developer-focused template",
    content: `
      <div class="cv-technical">
        <header>
          <h1>{{personalInfo.name}}</h1>
          <p>{{personalInfo.email}} | {{personalInfo.phone}}</p>
          {{#if personalInfo.github}}<p>GitHub: {{personalInfo.github}}</p>{{/if}}
        </header>
        <section>
          <h2>// Summary</h2>
          <p>{{summary}}</p>
        </section>
        <section>
          <h2>// Experience</h2>
          {{#each experience}}
          <div>
            <h3>{{position}} @ {{company}}</h3>
            <p>{{startDate}} → {{endDate}}</p>
            <p>{{description}}</p>
            {{#each achievements}}<p>• {{this}}</p>{{/each}}
          </div>
          {{/each}}
        </section>
        <section>
          <h2>// Skills</h2>
          {{#each skills}}
          <p><strong>{{category}}:</strong> {{items}}</p>
          {{/each}}
        </section>
        <section>
          <h2>// Projects</h2>
          {{#each projects}}
          <div>
            <h3>{{name}}</h3>
            <p>{{description}}</p>
            <p>Stack: {{technologies}}</p>
          </div>
          {{/each}}
        </section>
      </div>
    `,
  },
]

export function loadTemplates(): CVTemplate[] {
  const stored = localStorage.getItem("cv-templates")
  return stored ? JSON.parse(stored) : defaultTemplates
}

export function saveTemplates(templates: CVTemplate[]): void {
  localStorage.setItem("cv-templates", JSON.stringify(templates))
}

export function addTemplate(template: CVTemplate): void {
  const templates = loadTemplates()
  templates.push(template)
  saveTemplates(templates)
}

export function loadCurrentTemplate(): string | null {
  return localStorage.getItem("cv-current-template")
}

export function saveCurrentTemplate(templateId: string): void {
  localStorage.setItem("cv-current-template", templateId)
}

// CV Data
const defaultCVData: CVData = {
  personalInfo: {
    name: "Your Name",
    email: "your.email@example.com",
    phone: "+1 (555) 000-0000",
    location: "City, Country",
    website: "",
    linkedin: "",
    github: "",
  },
  summary: "Professional summary goes here...",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
}

export function loadCVData(): CVData {
  const stored = localStorage.getItem("cv-data")
  return stored ? JSON.parse(stored) : defaultCVData
}

export function saveCVData(data: CVData): void {
  localStorage.setItem("cv-data", JSON.stringify(data))
}

// Iterations
export function loadIterations(): CVIteration[] {
  const stored = localStorage.getItem("cv-iterations")
  return stored ? JSON.parse(stored) : []
}

export function saveIteration(iteration: CVIteration): void {
  const iterations = loadIterations()
  iterations.unshift(iteration)
  localStorage.setItem("cv-iterations", JSON.stringify(iterations))
}

// Template Customization
export function saveTemplateCustomization(customization: TemplateCustomization): void {
  const key = `template-custom-${customization.templateId}`
  localStorage.setItem(key, JSON.stringify(customization))
}

export function loadTemplateCustomization(templateId: string): TemplateCustomization | null {
  const key = `template-custom-${templateId}`
  const stored = localStorage.getItem(key)
  return stored ? JSON.parse(stored) : null
}

export function getDefaultColorPalettes(): ColorPalette[] {
  return [
    {
      id: "professional-blue",
      name: "Professional Blue",
      primary: "#2563eb",
      secondary: "#1e40af",
      accent: "#3b82f6",
      background: "#ffffff",
      text: "#1f2937",
      textSecondary: "#6b7280",
    },
    {
      id: "elegant-purple",
      name: "Elegant Purple",
      primary: "#7c3aed",
      secondary: "#6d28d9",
      accent: "#8b5cf6",
      background: "#ffffff",
      text: "#1f2937",
      textSecondary: "#6b7280",
    },
    {
      id: "modern-green",
      name: "Modern Green",
      primary: "#059669",
      secondary: "#047857",
      accent: "#10b981",
      background: "#ffffff",
      text: "#1f2937",
      textSecondary: "#6b7280",
    },
    {
      id: "warm-orange",
      name: "Warm Orange",
      primary: "#ea580c",
      secondary: "#c2410c",
      accent: "#f97316",
      background: "#ffffff",
      text: "#1f2937",
      textSecondary: "#6b7280",
    },
    {
      id: "dark-mode",
      name: "Dark Mode",
      primary: "#60a5fa",
      secondary: "#3b82f6",
      accent: "#93c5fd",
      background: "#111827",
      text: "#f9fafb",
      textSecondary: "#d1d5db",
    },
  ]
}

// LLM Config
export function saveLLMConfig(config: LLMConfig): void {
  localStorage.setItem("llm-config", JSON.stringify(config))
}

export function loadLLMConfig(): LLMConfig | null {
  const stored = localStorage.getItem("llm-config")
  return stored ? JSON.parse(stored) : null
}
