export const DEFAULT_CV_DATA = {
  personalInfo: {
    name: "David Estevez",
    email: "dev.destbreso@gmail.com",
    phone: "+1 (305) 555-0123",
    location: "Miami, Florida",
    website: "https://davidestevez.dev",
    linkedin: "https://linkedin.com/in/destbreso",
    github: "https://github.com/destbreso",
  },
  summary:
    "Project Lead, Software Architect, and Data Analyst with extensive experience in full-stack development, data analysis, and team leadership. Specialized in building scalable applications and data-driven solutions.",
  experience: [
    {
      id: "1",
      company: "Beck College Prep",
      position: "Full Stack Developer",
      startDate: "2023",
      endDate: "Present",
      description: "Leading development of educational technology solutions",
      achievements: [
        "Developed comprehensive student management system",
        "Implemented real-time analytics dashboard",
        "Improved application performance by 60%",
      ],
    },
    {
      id: "2",
      company: "Cosmetic Medicine",
      position: "Full Stack Engineer",
      startDate: "2022",
      endDate: "2023",
      description: "Built healthcare management platform",
      achievements: [
        "Designed and implemented patient portal",
        "Integrated payment processing system",
        "Reduced system downtime by 80%",
      ],
    },
    {
      id: "3",
      company: "Coverfleet",
      position: "Chief Engineer",
      startDate: "2020",
      endDate: "2022",
      description: "Led engineering team for fleet management solution",
      achievements: [
        "Architected microservices infrastructure",
        "Managed team of 8 engineers",
        "Delivered product 3 months ahead of schedule",
      ],
    },
  ],
  education: [
    {
      id: "1",
      institution: "Florida International University",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "2016",
      endDate: "2020",
    },
  ],
  skills: [
    {
      id: "1",
      category: "Languages",
      items: ["JavaScript", "TypeScript", "Python", "C", "C++", "Bash", "MATLAB", "R"],
    },
    {
      id: "2",
      category: "Frameworks & Libraries",
      items: ["React", "Next.js", "Node.js", "Express", "Django", "Flask"],
    },
    {
      id: "3",
      category: "Tools & Technologies",
      items: ["Git", "Docker", "AWS", "PostgreSQL", "MongoDB", "Redis"],
    },
  ],
  projects: [
    {
      id: "1",
      name: "Educational Analytics Platform",
      description: "Real-time analytics dashboard for educational institutions",
      technologies: ["React", "Node.js", "PostgreSQL", "Redis"],
    },
    {
      id: "2",
      name: "Healthcare Management System",
      description: "Comprehensive patient and appointment management solution",
      technologies: ["Next.js", "TypeScript", "MongoDB", "Stripe"],
    },
  ],
  certifications: [],
}

export const DEFAULT_SYSTEM_PROMPT = `You are a professional CV/Resume optimization assistant. Your task is to take the provided CV metadata and job context, then generate an optimized CV that highlights the most relevant experience and skills for the target position.

IMPORTANT: You MUST return ONLY valid JSON in the exact same structure as the input CV metadata. Do not include any explanatory text, markdown formatting, or additional commentary.

The JSON structure must include:
- personalInfo: {name, email, phone, location, website, linkedin, github}
- summary: string
- experience: array of {id, company, position, startDate, endDate, description, achievements: string[]}
- education: array of {id, institution, degree, field, startDate, endDate}
- skills: array of {id, category, items: string[]}
- projects: array of {id, name, description, technologies: string[]}
- certifications: array

Guidelines:
1. Tailor the summary to emphasize skills relevant to the job context
2. Reorder and emphasize experience that matches the job requirements
3. Highlight achievements that demonstrate relevant capabilities
4. Adjust skill categories to prioritize relevant technologies
5. Keep all original data but optimize presentation and emphasis
6. Maintain professional tone and clear, concise language

Return ONLY the JSON object, nothing else.`

const DEFAULT_TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean and contemporary design",
    content: `
      <div class="cv-container">
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
    description: "Simple and elegant",
    content: `
      <div class="cv-container minimal">
        <h1>{{personalInfo.name}}</h1>
        <p>{{personalInfo.email}} | {{personalInfo.phone}}</p>
        <p>{{summary}}</p>
        <h2>Experience</h2>
        {{#each experience}}
        <div><strong>{{position}}</strong> - {{company}} ({{startDate}} - {{endDate}})</div>
        {{/each}}
      </div>
    `,
  },
  {
    id: "technical",
    name: "Technical",
    description: "Developer-focused layout",
    content: `
      <div class="cv-container technical">
        <div class="header">
          <h1>{{personalInfo.name}}</h1>
          <div>{{personalInfo.github}} | {{personalInfo.linkedin}}</div>
        </div>
        <section>
          <h2>// Summary</h2>
          <p>{{summary}}</p>
        </section>
        <section>
          <h2>// Experience</h2>
          {{#each experience}}
          <div class="exp-item">
            <h3>{{position}} @ {{company}}</h3>
            <code>{{startDate}} - {{endDate}}</code>
          </div>
          {{/each}}
        </section>
      </div>
    `,
  },
]

const DEFAULT_LAYOUTS = [
  {
    id: "single",
    name: "Single Column",
    description: "Traditional single column layout",
    structure: "single" as const,
  },
  {
    id: "sidebar-left",
    name: "Sidebar Left",
    description: "Personal info on left, content on right",
    structure: "sidebar-left" as const,
  },
  {
    id: "sidebar-right",
    name: "Sidebar Right",
    description: "Content on left, personal info on right",
    structure: "sidebar-right" as const,
  },
  {
    id: "split",
    name: "Split",
    description: "Two equal columns",
    structure: "split" as const,
  },
]

export function loadTemplates() {
  if (typeof window === "undefined") return DEFAULT_TEMPLATES
  const saved = localStorage.getItem("cv_templates")
  return saved ? JSON.parse(saved) : DEFAULT_TEMPLATES
}

export function saveTemplates(templates: any[]) {
  if (typeof window === "undefined") return
  localStorage.setItem("cv_templates", JSON.stringify(templates))
}

export function addTemplate(template: any) {
  const templates = loadTemplates()
  templates.push(template)
  saveTemplates(templates)
}

export function loadCurrentTemplate() {
  if (typeof window === "undefined") return null
  return localStorage.getItem("cv_current_template")
}

export function saveCurrentTemplate(templateId: string) {
  if (typeof window === "undefined") return
  localStorage.setItem("cv_current_template", templateId)
}

export function loadCVData() {
  if (typeof window === "undefined") return DEFAULT_CV_DATA
  const saved = localStorage.getItem("cv_data")
  return saved ? JSON.parse(saved) : DEFAULT_CV_DATA
}

export function saveCVData(data: any) {
  if (typeof window === "undefined") return
  localStorage.setItem("cv_data", JSON.stringify(data))
}

export function loadIterations() {
  if (typeof window === "undefined") return []
  const saved = localStorage.getItem("cv_iterations")
  return saved ? JSON.parse(saved) : []
}

export function saveIteration(iteration: any) {
  const iterations = loadIterations()
  iterations.push(iteration)
  if (typeof window !== "undefined") {
    localStorage.setItem("cv_iterations", JSON.stringify(iterations))
  }
}

export function saveLLMConfig(config: any) {
  if (typeof window === "undefined") return
  localStorage.setItem("llm_config", JSON.stringify(config))
}

export function loadLLMConfig() {
  if (typeof window === "undefined") return null
  const saved = localStorage.getItem("llm_config")
  return saved ? JSON.parse(saved) : null
}

export function saveTemplateCustomization(customization: any) {
  if (typeof window === "undefined") return
  const key = `template_customization_${customization.templateId}`
  localStorage.setItem(key, JSON.stringify(customization))
}

export function loadTemplateCustomization(templateId: string) {
  if (typeof window === "undefined") return null
  const key = `template_customization_${templateId}`
  const saved = localStorage.getItem(key)
  return saved ? JSON.parse(saved) : null
}

export function getDefaultColorPalettes() {
  return [
    {
      id: "terminal-green",
      name: "Terminal Green",
      primary: "#00ff00",
      secondary: "#00cc00",
      accent: "#00ff88",
      background: "#000000",
      text: "#00ff00",
    },
    {
      id: "ocean-blue",
      name: "Ocean Blue",
      primary: "#0066cc",
      secondary: "#0099ff",
      accent: "#00ccff",
      background: "#f0f8ff",
      text: "#003366",
    },
    {
      id: "sunset-orange",
      name: "Sunset Orange",
      primary: "#ff6600",
      secondary: "#ff9933",
      accent: "#ffcc00",
      background: "#fff5e6",
      text: "#663300",
    },
    {
      id: "forest-green",
      name: "Forest Green",
      primary: "#228b22",
      secondary: "#32cd32",
      accent: "#90ee90",
      background: "#f0fff0",
      text: "#006400",
    },
    {
      id: "royal-purple",
      name: "Royal Purple",
      primary: "#6a0dad",
      secondary: "#9370db",
      accent: "#dda0dd",
      background: "#f8f0ff",
      text: "#4b0082",
    },
  ]
}

export function loadLayouts() {
  if (typeof window === "undefined") return DEFAULT_LAYOUTS
  const saved = localStorage.getItem("cv_layouts")
  return saved ? JSON.parse(saved) : DEFAULT_LAYOUTS
}

export function saveLayouts(layouts: any[]) {
  if (typeof window === "undefined") return
  localStorage.setItem("cv_layouts", JSON.stringify(layouts))
}

export function addLayout(layout: any) {
  const layouts = loadLayouts()
  layouts.push(layout)
  saveLayouts(layouts)
}

export function loadCurrentLayout() {
  if (typeof window === "undefined") return null
  return localStorage.getItem("cv_current_layout")
}

export function saveCurrentLayout(layoutId: string) {
  if (typeof window === "undefined") return
  localStorage.setItem("cv_current_layout", layoutId)
}
