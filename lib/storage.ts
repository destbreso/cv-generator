import type {
  CVData,
  CVTemplate,
  CVIteration,
  LLMConfig,
  TemplateCustomization,
} from "./types";

// Default system prompt for CV generation
export const DEFAULT_SYSTEM_PROMPT = `You are an expert CV/Resume writer. Your task is to optimize and enhance CV content based on the provided metadata and job context.

IMPORTANT INSTRUCTIONS:
1. You will receive two inputs:
   - CV Metadata: The source of truth about the person (their experience, skills, education, etc.)
   - Job Context: The specific job or role they are targeting

2. Your output MUST be valid JSON that matches the exact structure of the CV Metadata input.

3. Optimize the content by:
   - Tailoring descriptions to match the job context
   - Highlighting relevant skills and experiences
   - Using action verbs and quantifiable achievements
   - Maintaining professional tone
   - Keeping the same structure as the input

4. Return ONLY the JSON object, no additional text or explanation.

5. The JSON structure must include:
   - personalInfo: { name, title, email, phone, location, summary }
   - experience: [{ company, position, duration, description, highlights[] }]
   - education: [{ institution, degree, field, year }]
   - skills: [{ category, items[] }]
   - projects: [{ name, description, technologies[], link }]

Generate an optimized CV in JSON format:`;

// LLM Configuration
export function saveLLMConfig(config: LLMConfig): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("llm-config", JSON.stringify(config));
  }
}

export function loadLLMConfig(): LLMConfig {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("llm-config");
    if (saved) {
      return JSON.parse(saved);
    }
  }
  return {
    baseUrl: "http://localhost:11434",
    model: "",
    apiKey: "",
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
  };
}

// CV Data
export function saveCVData(data: CVData): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("cv-data", JSON.stringify(data));
  }
}

export function loadCVData(): CVData {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("cv-data");
    if (saved) {
      return JSON.parse(saved);
    }
  }
  return {
    personalInfo: {
      name: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
  };
}

// Templates
const DEFAULT_TEMPLATES: CVTemplate[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean and contemporary design",
    html: '<div class="cv-modern"><h1>{{name}}</h1><p>{{title}}</p></div>',
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant",
    html: '<div class="cv-minimal"><h1>{{name}}</h1><p>{{title}}</p></div>',
  },
  {
    id: "technical",
    name: "Technical",
    description: "Perfect for tech roles",
    html: '<div class="cv-technical"><h1>{{name}}</h1><p>{{title}}</p></div>',
  },
];

export function loadTemplates(): CVTemplate[] {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("cv-templates");
    if (saved) {
      return JSON.parse(saved);
    }
  }
  return DEFAULT_TEMPLATES;
}

export function saveTemplates(templates: CVTemplate[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("cv-templates", JSON.stringify(templates));
  }
}

export function addTemplate(template: CVTemplate): void {
  const templates = loadTemplates();
  templates.push(template);
  saveTemplates(templates);
}

export function loadCurrentTemplate(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("current-template") || "modern";
  }
  return "modern";
}

export function saveCurrentTemplate(templateId: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("current-template", templateId);
  }
}

// Iterations
export function loadIterations(): CVIteration[] {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("cv-iterations");
    if (saved) {
      return JSON.parse(saved);
    }
  }
  return [];
}

export function saveIteration(iteration: CVIteration): void {
  const iterations = loadIterations();
  iterations.push(iteration);
  if (typeof window !== "undefined") {
    localStorage.setItem("cv-iterations", JSON.stringify(iterations));
  }
}

// Template Customization
export function saveTemplateCustomization(
  templateId: string,
  customization: TemplateCustomization
): void {
  if (typeof window !== "undefined") {
    const key = `template-custom-${templateId}`;
    localStorage.setItem(key, JSON.stringify(customization));
  }
}

export function loadTemplateCustomization(
  templateId: string
): TemplateCustomization | null {
  if (typeof window !== "undefined") {
    const key = `template-custom-${templateId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  }
  return null;
}

// Default Color Palettes
export function getDefaultColorPalettes() {
  return [
    {
      id: "professional",
      name: "Professional Blue",
      primary: "#2563eb",
      secondary: "#1e40af",
      accent: "#3b82f6",
      text: "#1f2937",
      background: "#ffffff",
    },
    {
      id: "elegant",
      name: "Elegant Gray",
      primary: "#4b5563",
      secondary: "#374151",
      accent: "#6b7280",
      text: "#111827",
      background: "#f9fafb",
    },
    {
      id: "creative",
      name: "Creative Purple",
      primary: "#7c3aed",
      secondary: "#6d28d9",
      accent: "#8b5cf6",
      text: "#1f2937",
      background: "#ffffff",
    },
    {
      id: "modern",
      name: "Modern Teal",
      primary: "#0d9488",
      secondary: "#0f766e",
      accent: "#14b8a6",
      text: "#1f2937",
      background: "#ffffff",
    },
    {
      id: "bold",
      name: "Bold Orange",
      primary: "#ea580c",
      secondary: "#c2410c",
      accent: "#f97316",
      text: "#1f2937",
      background: "#ffffff",
    },
  ];
}
