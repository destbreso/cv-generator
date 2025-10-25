import type {
  CVData,
  CVTemplate,
  CVIteration,
  LLMConfig,
  TemplateCustomization,
  ColorPalette,
} from "./types";

// Default system prompt for CV generation
export const DEFAULT_SYSTEM_PROMPT = `You are an expert CV/Resume writer. Your task is to optimize and enhance CV content based on the provided metadata and job context.

IMPORTANT: You MUST respond with ONLY valid JSON in the exact format specified below. Do not include any markdown, explanations, or additional text.

Input:
1. CV Metadata (source of truth about the person)
2. Job Context (target position and requirements)

Output Format (JSON only):
{
  "personalInfo": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "website": "string",
    "linkedin": "string",
    "github": "string"
  },
  "summary": "string",
  "experience": [
    {
      "id": "string",
      "company": "string",
      "position": "string",
      "startDate": "string",
      "endDate": "string",
      "description": "string",
      "achievements": ["string"]
    }
  ],
  "education": [
    {
      "id": "string",
      "institution": "string",
      "degree": "string",
      "field": "string",
      "startDate": "string",
      "endDate": "string"
    }
  ],
  "skills": [
    {
      "id": "string",
      "category": "string",
      "items": ["string"]
    }
  ],
  "projects": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "technologies": ["string"],
      "url": "string"
    }
  ],
  "certifications": [
    {
      "id": "string",
      "name": "string",
      "issuer": "string",
      "date": "string",
      "url": "string"
    }
  ]
}

Instructions:
1. Analyze the job context to understand requirements
2. Enhance descriptions to highlight relevant experience
3. Reorder and emphasize skills matching the job
4. Optimize language for ATS systems
5. Keep all factual information accurate
6. Return ONLY the JSON object, no other text`;

// Default CV data based on David Estevez's LinkedIn profile
const DEFAULT_CV_DATA: CVData = {
  personalInfo: {
    name: "David Estevez",
    email: "david@example.com",
    phone: "+1 (555) 123-4567",
    location: "Miami, Florida, United States",
    website: "https://davidestevez.dev",
    linkedin: "https://linkedin.com/in/destbreso",
    github: "https://github.com/destbreso",
  },
  summary:
    "Experienced software architect and project lead with expertise in full-stack development, data analysis, and system design. Proven track record of delivering scalable solutions and leading technical teams. Passionate about leveraging technology to solve complex problems and drive business value.",
  experience: [
    {
      id: "1",
      company: "Beck College Prep",
      position: "Full Stack Developer",
      startDate: "2023-01",
      endDate: "Present",
      description:
        "Leading development of educational technology solutions. Architecting and implementing full-stack applications using modern web technologies.",
      achievements: [
        "Architected scalable learning management system",
        "Improved application performance by 40%",
        "Mentored junior developers on best practices",
      ],
    },
    {
      id: "2",
      company: "Cosmetic Medicine",
      position: "Full Stack Engineer",
      startDate: "2022-01",
      endDate: "2023-01",
      description:
        "Developed and maintained healthcare management systems. Built responsive web applications for patient management and appointment scheduling.",
      achievements: [
        "Implemented HIPAA-compliant data handling",
        "Reduced appointment scheduling time by 60%",
        "Built real-time notification system",
      ],
    },
    {
      id: "3",
      company: "Coverfleet",
      position: "Chief Engineer",
      startDate: "2020-01",
      endDate: "2022-01",
      description:
        "Led engineering team in developing fleet management solutions. Designed system architecture and established development best practices.",
      achievements: [
        "Managed team of 8 engineers",
        "Delivered 3 major product releases",
        "Reduced system downtime by 75%",
      ],
    },
  ],
  education: [
    {
      id: "1",
      institution: "University of Miami",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "2016",
      endDate: "2020",
      gpa: "3.8",
    },
  ],
  skills: [
    {
      id: "1",
      category: "Programming Languages",
      items: [
        "JavaScript",
        "TypeScript",
        "Python",
        "C",
        "C++",
        "Bash",
        "MATLAB",
        "R",
      ],
    },
    {
      id: "2",
      category: "Frontend",
      items: ["React", "Next.js", "Vue.js", "HTML5", "CSS3", "Tailwind CSS"],
    },
    {
      id: "3",
      category: "Backend",
      items: ["Node.js", "Express", "Django", "Flask", "PostgreSQL", "MongoDB"],
    },
    {
      id: "4",
      category: "Tools & Platforms",
      items: ["Git", "Docker", "AWS", "Vercel", "Linux", "CI/CD"],
    },
  ],
  projects: [
    {
      id: "1",
      name: "Educational Platform",
      description:
        "Built a comprehensive learning management system with real-time collaboration features and analytics dashboard",
      technologies: ["React", "Node.js", "PostgreSQL", "WebSocket"],
      url: "https://example.com/edu-platform",
    },
    {
      id: "2",
      name: "Healthcare Management System",
      description:
        "Developed HIPAA-compliant patient management system with appointment scheduling and medical records",
      technologies: ["TypeScript", "Express", "MongoDB", "Redis"],
      url: "https://example.com/healthcare",
    },
    {
      id: "3",
      name: "Fleet Tracking Solution",
      description:
        "Created real-time vehicle tracking and management platform with predictive maintenance features",
      technologies: ["Python", "React", "PostgreSQL", "AWS IoT"],
      url: "https://example.com/fleet",
    },
  ],
  certifications: [
    {
      id: "1",
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2022-06",
      url: "https://aws.amazon.com/certification/",
    },
  ],
};

// Check if we're in browser environment
const isBrowser = typeof window !== "undefined";

// LLM Configuration
const LLM_CONFIG_KEY = "cv-generator-llm-config";

export function saveLLMConfig(config: LLMConfig): void {
  if (!isBrowser) return;
  localStorage.setItem(LLM_CONFIG_KEY, JSON.stringify(config));
}

export function loadLLMConfig(): LLMConfig | null {
  if (!isBrowser) return null;
  const stored = localStorage.getItem(LLM_CONFIG_KEY);
  if (!stored) return null;
  return JSON.parse(stored);
}

// CV Data Management
const CV_DATA_KEY = "cv-generator-data";

export function saveCVData(data: CVData): void {
  if (!isBrowser) return;
  localStorage.setItem(CV_DATA_KEY, JSON.stringify(data));
}

export function loadCVData(): CVData {
  if (!isBrowser) return DEFAULT_CV_DATA;
  const stored = localStorage.getItem(CV_DATA_KEY);
  if (!stored) {
    saveCVData(DEFAULT_CV_DATA);
    return DEFAULT_CV_DATA;
  }
  return JSON.parse(stored);
}

// Template Management
const TEMPLATES_KEY = "cv-generator-templates";
const CURRENT_TEMPLATE_KEY = "cv-generator-current-template";

const DEFAULT_TEMPLATES: CVTemplate[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean and professional design with bold headers",
    content: `
      <div style="font-family: var(--font-family); padding: var(--spacing-lg); max-width: 800px; margin: 0 auto;">
        <header style="border-bottom: 2px solid var(--primary-color); padding-bottom: var(--spacing-md); margin-bottom: var(--spacing-lg);">
          <h1 style="color: var(--primary-color); font-size: var(--font-size-xl); margin: 0;">{{personalInfo.name}}</h1>
          <p style="color: var(--secondary-color); font-size: var(--font-size-lg); margin: var(--spacing-xs) 0;">{{personalInfo.title}}</p>
          <div style="display: flex; gap: var(--spacing-md); flex-wrap: wrap; margin-top: var(--spacing-sm); font-size: var(--font-size-sm);">
            <span>{{personalInfo.email}}</span>
            <span>{{personalInfo.phone}}</span>
            <span>{{personalInfo.location}}</span>
          </div>
        </header>
        
        <section style="margin-bottom: var(--spacing-lg);">
          <h2 style="color: var(--primary-color); font-size: var(--font-size-lg); margin-bottom: var(--spacing-sm);">Summary</h2>
          <p style="line-height: 1.6;">{{summary}}</p>
        </section>
        
        <section style="margin-bottom: var(--spacing-lg);">
          <h2 style="color: var(--primary-color); font-size: var(--font-size-lg); margin-bottom: var(--spacing-sm);">Experience</h2>
          {{#each experience}}
          <div style="margin-bottom: var(--spacing-md);">
            <h3 style="font-size: var(--font-size-md); margin: 0;">{{position}}</h3>
            <p style="color: var(--secondary-color); margin: var(--spacing-xs) 0;">{{company}} | {{startDate}} - {{endDate}}</p>
            <p style="line-height: 1.6;">{{description}}</p>
          </div>
          {{/each}}
        </section>
        
        <section style="margin-bottom: var(--spacing-lg);">
          <h2 style="color: var(--primary-color); font-size: var(--font-size-lg); margin-bottom: var(--spacing-sm);">Skills</h2>
          {{#each skills}}
          <div style="margin-bottom: var(--spacing-sm);">
            <strong>{{category}}:</strong> {{#each items}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}
          </div>
          {{/each}}
        </section>
        
        <section style="margin-bottom: var(--spacing-lg);">
          <h2 style="color: var(--primary-color); font-size: var(--font-size-lg); margin-bottom: var(--spacing-sm);">Education</h2>
          {{#each education}}
          <div style="margin-bottom: var(--spacing-md);">
            <h3 style="font-size: var(--font-size-md); margin: 0;">{{degree}} in {{field}}</h3>
            <p style="color: var(--secondary-color); margin: var(--spacing-xs) 0;">{{institution}} | {{startDate}} - {{endDate}}</p>
          </div>
          {{/each}}
        </section>
      </div>
    `,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant layout with subtle styling",
    content: `
      <div style="font-family: var(--font-family); padding: var(--spacing-lg); max-width: 800px; margin: 0 auto;">
        <header style="margin-bottom: var(--spacing-xl);">
          <h1 style="font-size: var(--font-size-xl); margin: 0; font-weight: 300;">{{personalInfo.name}}</h1>
          <p style="color: var(--secondary-color); font-size: var(--font-size-md); margin: var(--spacing-xs) 0;">Software Engineer</p>
          <p style="font-size: var(--font-size-sm); color: var(--secondary-color);">{{personalInfo.email}} • {{personalInfo.phone}} • {{personalInfo.location}}</p>
        </header>
        
        <section style="margin-bottom: var(--spacing-xl);">
          <p style="line-height: 1.8; color: var(--text-color);">{{summary}}</p>
        </section>
        
        <section style="margin-bottom: var(--spacing-xl);">
          <h2 style="font-size: var(--font-size-md); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: var(--spacing-md); color: var(--primary-color);">Experience</h2>
          {{#each experience}}
          <div style="margin-bottom: var(--spacing-lg);">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <h3 style="font-size: var(--font-size-md); margin: 0; font-weight: 500;">{{position}}</h3>
              <span style="font-size: var(--font-size-sm); color: var(--secondary-color);">{{startDate}} - {{endDate}}</span>
            </div>
            <p style="color: var(--secondary-color); margin: var(--spacing-xs) 0; font-size: var(--font-size-sm);">{{company}}</p>
            <p style="line-height: 1.6; margin-top: var(--spacing-sm);">{{description}}</p>
          </div>
          {{/each}}
        </section>
        
        <section style="margin-bottom: var(--spacing-xl);">
          <h2 style="font-size: var(--font-size-md); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: var(--spacing-md); color: var(--primary-color);">Education</h2>
          {{#each education}}
          <div style="margin-bottom: var(--spacing-md);">
            <h3 style="font-size: var(--font-size-md); margin: 0; font-weight: 500;">{{degree}} in {{field}}</h3>
            <p style="color: var(--secondary-color); margin: var(--spacing-xs) 0; font-size: var(--font-size-sm);">{{institution}} • {{startDate}} - {{endDate}}</p>
          </div>
          {{/each}}
        </section>
        
        <section>
          <h2 style="font-size: var(--font-size-md); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: var(--spacing-md); color: var(--primary-color);">Skills</h2>
          {{#each skills}}
          <p style="line-height: 1.8;"><strong>{{category}}:</strong> {{#each items}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}</p>
          {{/each}}
        </section>
      </div>
    `,
  },
  {
    id: "technical",
    name: "Technical",
    description: "Developer-focused design with monospace fonts",
    content: `
      <div style="font-family: var(--font-family); padding: var(--spacing-lg); max-width: 900px; margin: 0 auto; background: var(--bg-color);">
        <header style="background: var(--primary-color); color: white; padding: var(--spacing-lg); margin: calc(var(--spacing-lg) * -1) calc(var(--spacing-lg) * -1) var(--spacing-lg);">
          <h1 style="font-size: var(--font-size-xl); margin: 0; font-family: monospace;">{{personalInfo.name}}</h1>
          <p style="font-size: var(--font-size-lg); margin: var(--spacing-xs) 0; opacity: 0.9;">Software Engineer</p>
          <div style="display: flex; gap: var(--spacing-md); margin-top: var(--spacing-sm); font-size: var(--font-size-sm); font-family: monospace;">
            <span>📧 {{personalInfo.email}}</span>
            <span>📱 {{personalInfo.phone}}</span>
            <span>📍 {{personalInfo.location}}</span>
          </div>
        </header>
        
        <section style="margin-bottom: var(--spacing-lg); padding: var(--spacing-md); background: var(--accent-color); border-left: 4px solid var(--primary-color);">
          <p style="line-height: 1.6; margin: 0;">{{summary}}</p>
        </section>
        
        <section style="margin-bottom: var(--spacing-lg);">
          <h2 style="font-size: var(--font-size-lg); margin-bottom: var(--spacing-md); font-family: monospace; color: var(--primary-color);">&gt; Experience</h2>
          {{#each experience}}
          <div style="margin-bottom: var(--spacing-md); padding-left: var(--spacing-md); border-left: 2px solid var(--secondary-color);">
            <h3 style="font-size: var(--font-size-md); margin: 0; font-family: monospace;">{{position}}</h3>
            <p style="color: var(--secondary-color); margin: var(--spacing-xs) 0; font-family: monospace; font-size: var(--font-size-sm);">{{company}} | {{startDate}} - {{endDate}}</p>
            <p style="line-height: 1.6;">{{description}}</p>
          </div>
          {{/each}}
        </section>
        
        <section style="margin-bottom: var(--spacing-lg);">
          <h2 style="font-size: var(--font-size-lg); margin-bottom: var(--spacing-md); font-family: monospace; color: var(--primary-color);">&gt; Technical Skills</h2>
          {{#each skills}}
          <div style="margin-bottom: var(--spacing-sm);">
            <code style="background: var(--accent-color); padding: var(--spacing-xs); border-radius: 4px; font-size: var(--font-size-sm);"><strong>{{category}}:</strong> {{#each items}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}</code>
          </div>
          {{/each}}
        </section>
        
        <section style="margin-bottom: var(--spacing-lg);">
          <h2 style="font-size: var(--font-size-lg); margin-bottom: var(--spacing-md); font-family: monospace; color: var(--primary-color);">&gt; Projects</h2>
          {{#each projects}}
          <div style="margin-bottom: var(--spacing-md); padding: var(--spacing-md); background: var(--accent-color); border-radius: 4px;">
            <h3 style="font-size: var(--font-size-md); margin: 0; font-family: monospace;">{{name}}</h3>
            <p style="margin: var(--spacing-xs) 0; line-height: 1.6;">{{description}}</p>
            <p style="font-size: var(--font-size-sm); color: var(--secondary-color); font-family: monospace;">Tech: {{#each technologies}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}</p>
          </div>
          {{/each}}
        </section>
        
        <section>
          <h2 style="font-size: var(--font-size-lg); margin-bottom: var(--spacing-md); font-family: monospace; color: var(--primary-color);">&gt; Education</h2>
          {{#each education}}
          <div style="margin-bottom: var(--spacing-md);">
            <h3 style="font-size: var(--font-size-md); margin: 0; font-family: monospace;">{{degree}} in {{field}}</h3>
            <p style="color: var(--secondary-color); margin: var(--spacing-xs) 0; font-family: monospace; font-size: var(--font-size-sm);">{{institution}} | {{startDate}} - {{endDate}}</p>
          </div>
          {{/each}}
        </section>
      </div>
    `,
  },
];

export function loadTemplates(): CVTemplate[] {
  if (!isBrowser) return DEFAULT_TEMPLATES;
  const stored = localStorage.getItem(TEMPLATES_KEY);
  if (!stored) {
    saveTemplates(DEFAULT_TEMPLATES);
    return DEFAULT_TEMPLATES;
  }
  return JSON.parse(stored);
}

export function saveTemplates(templates: CVTemplate[]): void {
  if (!isBrowser) return;
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
}

export function addTemplate(template: CVTemplate): void {
  const templates = loadTemplates();
  templates.push(template);
  saveTemplates(templates);
}

export function loadCurrentTemplate(): string {
  if (!isBrowser) return "modern";
  return localStorage.getItem(CURRENT_TEMPLATE_KEY) || "modern";
}

export function saveCurrentTemplate(templateId: string): void {
  if (!isBrowser) return;
  localStorage.setItem(CURRENT_TEMPLATE_KEY, templateId);
}

// Iteration Management
const ITERATIONS_KEY = "cv-generator-iterations";

export function loadIterations(): CVIteration[] {
  if (!isBrowser) return [];
  const stored = localStorage.getItem(ITERATIONS_KEY);
  if (!stored) return [];
  return JSON.parse(stored);
}

export function saveIteration(iteration: CVIteration): void {
  if (!isBrowser) return;
  const iterations = loadIterations();
  iterations.push(iteration);
  localStorage.setItem(ITERATIONS_KEY, JSON.stringify(iterations));
}

// Template Customization
const CUSTOMIZATION_KEY_PREFIX = "cv-template-custom-";

export function saveTemplateCustomization(
  templateId: string,
  customization: TemplateCustomization
): void {
  if (!isBrowser) return;
  localStorage.setItem(
    `${CUSTOMIZATION_KEY_PREFIX}${templateId}`,
    JSON.stringify(customization)
  );
}

export function loadTemplateCustomization(
  templateId: string
): TemplateCustomization | null {
  if (!isBrowser) return null;
  const stored = localStorage.getItem(
    `${CUSTOMIZATION_KEY_PREFIX}${templateId}`
  );
  if (!stored) return null;
  return JSON.parse(stored);
}

// Default Color Palettes
export function getDefaultColorPalettes(): ColorPalette[] {
  return [
    {
      id: "professional-blue",
      name: "Professional Blue",
      primary: "#2563eb",
      secondary: "#64748b",
      accent: "#dbeafe",
      background: "#ffffff",
      text: "#1e293b",
      textSecondary: "#64748b",
    },
    {
      id: "elegant-purple",
      name: "Elegant Purple",
      primary: "#7c3aed",
      secondary: "#6b7280",
      accent: "#ede9fe",
      background: "#ffffff",
      text: "#1f2937",
      textSecondary: "#6b7280",
    },
    {
      id: "modern-green",
      name: "Modern Green",
      primary: "#059669",
      secondary: "#6b7280",
      accent: "#d1fae5",
      background: "#ffffff",
      text: "#111827",
      textSecondary: "#6b7280",
    },
    {
      id: "creative-orange",
      name: "Creative Orange",
      primary: "#ea580c",
      secondary: "#64748b",
      accent: "#fed7aa",
      background: "#ffffff",
      text: "#1e293b",
      textSecondary: "#64748b",
    },
    {
      id: "classic-gray",
      name: "Classic Gray",
      primary: "#374151",
      secondary: "#6b7280",
      accent: "#f3f4f6",
      background: "#ffffff",
      text: "#111827",
      textSecondary: "#6b7280",
    },
  ];
}
