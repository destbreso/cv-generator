import type { CVData, CVTemplate, CVIteration, LLMConfig } from "./types"

const STORAGE_KEYS = {
  CV_DATA: "cv-generator-data",
  TEMPLATES: "cv-generator-templates",
  ITERATIONS: "cv-generator-iterations",
  LLM_CONFIG: "cv-generator-llm-config",
  CURRENT_TEMPLATE: "cv-generator-current-template",
}

// CV Data Storage
export const saveCVData = (data: CVData): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.CV_DATA, JSON.stringify(data))
  }
}

export const loadCVData = (): CVData | null => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STORAGE_KEYS.CV_DATA)
    return data ? JSON.parse(data) : null
  }
  return null
}

// Templates Storage
export const saveTemplates = (templates: CVTemplate[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates))
  }
}

export const loadTemplates = (): CVTemplate[] => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STORAGE_KEYS.TEMPLATES)
    return data ? JSON.parse(data) : getDefaultTemplates()
  }
  return getDefaultTemplates()
}

export const addTemplate = (template: CVTemplate): void => {
  const templates = loadTemplates()
  templates.push(template)
  saveTemplates(templates)
}

// Iterations Storage
export const saveIteration = (iteration: CVIteration): void => {
  if (typeof window !== "undefined") {
    const iterations = loadIterations()
    iterations.push(iteration)
    localStorage.setItem(STORAGE_KEYS.ITERATIONS, JSON.stringify(iterations))
  }
}

export const loadIterations = (): CVIteration[] => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STORAGE_KEYS.ITERATIONS)
    return data ? JSON.parse(data) : []
  }
  return []
}

// LLM Config Storage
export const saveLLMConfig = (config: LLMConfig): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.LLM_CONFIG, JSON.stringify(config))
  }
}

export const loadLLMConfig = (): LLMConfig | null => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STORAGE_KEYS.LLM_CONFIG)
    return data ? JSON.parse(data) : null
  }
  return null
}

// Current Template Storage
export const saveCurrentTemplate = (templateId: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.CURRENT_TEMPLATE, templateId)
  }
}

export const loadCurrentTemplate = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_TEMPLATE)
  }
  return null
}

// Default Templates
function getDefaultTemplates(): CVTemplate[] {
  return [
    {
      id: "modern",
      name: "Modern",
      description: "Clean and modern design with clear sections",
      content: `
        <div class="cv-modern">
          <header class="cv-header">
            <h1>{{personalInfo.name}}</h1>
            <div class="contact-info">
              <span>{{personalInfo.email}}</span>
              <span>{{personalInfo.phone}}</span>
              <span>{{personalInfo.location}}</span>
            </div>
          </header>
          
          <section class="cv-section">
            <h2>Summary</h2>
            <p>{{summary}}</p>
          </section>
          
          <section class="cv-section">
            <h2>Experience</h2>
            {{#each experience}}
            <div class="experience-item">
              <h3>{{position}} at {{company}}</h3>
              <p class="date-range">{{startDate}} - {{endDate}}</p>
              <p>{{description}}</p>
              <ul>
                {{#each achievements}}
                <li>{{this}}</li>
                {{/each}}
              </ul>
            </div>
            {{/each}}
          </section>
          
          <section class="cv-section">
            <h2>Education</h2>
            {{#each education}}
            <div class="education-item">
              <h3>{{degree}} in {{field}}</h3>
              <p>{{institution}}</p>
              <p class="date-range">{{startDate}} - {{endDate}}</p>
            </div>
            {{/each}}
          </section>
          
          <section class="cv-section">
            <h2>Skills</h2>
            {{#each skills}}
            <div class="skill-category">
              <h3>{{category}}</h3>
              <p>{{items}}</p>
            </div>
            {{/each}}
          </section>
        </div>
      `,
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Simple and elegant with focus on content",
      content: `
        <div class="cv-minimal">
          <h1>{{personalInfo.name}}</h1>
          <p>{{personalInfo.email}} | {{personalInfo.phone}} | {{personalInfo.location}}</p>
          
          <h2>Summary</h2>
          <p>{{summary}}</p>
          
          <h2>Experience</h2>
          {{#each experience}}
          <div>
            <strong>{{position}}</strong> - {{company}} ({{startDate}} - {{endDate}})
            <p>{{description}}</p>
          </div>
          {{/each}}
          
          <h2>Education</h2>
          {{#each education}}
          <div>
            <strong>{{degree}} in {{field}}</strong> - {{institution}} ({{startDate}} - {{endDate}})
          </div>
          {{/each}}
          
          <h2>Skills</h2>
          {{#each skills}}
          <div>
            <strong>{{category}}:</strong> {{items}}
          </div>
          {{/each}}
        </div>
      `,
    },
    {
      id: "technical",
      name: "Technical",
      description: "Developer-focused with emphasis on projects and skills",
      content: `
        <div class="cv-technical">
          <header>
            <h1>{{personalInfo.name}}</h1>
            <div class="links">
              {{#if personalInfo.github}}<a href="{{personalInfo.github}}">GitHub</a>{{/if}}
              {{#if personalInfo.linkedin}}<a href="{{personalInfo.linkedin}}">LinkedIn</a>{{/if}}
              {{#if personalInfo.website}}<a href="{{personalInfo.website}}">Website</a>{{/if}}
            </div>
            <p>{{personalInfo.email}} | {{personalInfo.phone}}</p>
          </header>
          
          <section>
            <h2>Technical Skills</h2>
            {{#each skills}}
            <div>
              <strong>{{category}}:</strong> {{items}}
            </div>
            {{/each}}
          </section>
          
          <section>
            <h2>Experience</h2>
            {{#each experience}}
            <div>
              <h3>{{position}} - {{company}}</h3>
              <p>{{startDate}} - {{endDate}}</p>
              <p>{{description}}</p>
              <ul>
                {{#each achievements}}
                <li>{{this}}</li>
                {{/each}}
              </ul>
            </div>
            {{/each}}
          </section>
          
          <section>
            <h2>Projects</h2>
            {{#each projects}}
            <div>
              <h3>{{name}}</h3>
              <p>{{description}}</p>
              <p><strong>Technologies:</strong> {{technologies}}</p>
            </div>
            {{/each}}
          </section>
          
          <section>
            <h2>Education</h2>
            {{#each education}}
            <div>
              <strong>{{degree}} in {{field}}</strong> - {{institution}} ({{endDate}})
            </div>
            {{/each}}
          </section>
        </div>
      `,
    },
  ]
}
