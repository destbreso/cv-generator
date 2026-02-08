"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";
import type {
  CVData,
  CVTemplate,
  LLMConfig,
  CVIteration,
  TemplateCustomization,
} from "./types";

// Default CV Data structure
export const DEFAULT_CV_DATA: CVData = {
  personalInfo: {
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    portfolio: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  languages: [],
  projects: [],
  certifications: [],
  publications: [],
  volunteerWork: [],
  awards: [],
  interests: [],
};

// Sample CV Data for quick testing
export const SAMPLE_CV_DATA: CVData = {
  personalInfo: {
    name: "Alex Rivera",
    title: "Senior Full-Stack Engineer",
    email: "alex.rivera@email.com",
    phone: "+1 (555) 987-6543",
    location: "San Francisco, CA",
    website: "https://alexrivera.dev",
    linkedin: "linkedin.com/in/alexrivera",
    github: "github.com/alexrivera",
    portfolio: "https://portfolio.alexrivera.dev",
  },
  summary:
    "Passionate full-stack engineer with 8+ years of experience building scalable web applications and distributed systems. Proficient in TypeScript, React, Node.js, and cloud-native architectures. Strong advocate for clean code, developer experience, and open-source contribution. Led cross-functional teams of up to 12 engineers across multiple time zones.",
  experience: [
    {
      id: "exp-1",
      company: "Quantum Cloud Inc.",
      position: "Staff Software Engineer",
      startDate: "Jan 2022",
      endDate: "Present",
      description:
        "Lead the platform engineering team responsible for the core API gateway serving 50M+ requests/day. Architected the migration from monolithic Rails app to event-driven microservices on Kubernetes.",
      achievements: [
        "Reduced API latency by 65% through caching and query optimization",
        "Mentored 6 junior engineers through structured 1:1 programs",
        "Implemented CI/CD pipeline reducing deployment time from 45min to 8min",
        "Drove adoption of TypeScript across 15 microservices",
      ],
    },
    {
      id: "exp-2",
      company: "DataStream Analytics",
      position: "Senior Frontend Engineer",
      startDate: "Mar 2019",
      endDate: "Dec 2021",
      description:
        "Built real-time data visualization dashboards used by Fortune 500 companies. Owned the frontend architecture for the analytics product.",
      achievements: [
        "Designed component library used across 4 product teams",
        "Achieved 98% test coverage with React Testing Library",
        "Optimized bundle size by 40% through code-splitting and lazy loading",
      ],
    },
    {
      id: "exp-3",
      company: "NovaTech Solutions",
      position: "Software Engineer",
      startDate: "Jun 2016",
      endDate: "Feb 2019",
      description:
        "Full-stack development for enterprise SaaS platform. Worked on authentication, billing, and reporting modules.",
      achievements: [
        "Built OAuth2/OIDC integration supporting 10+ identity providers",
        "Designed event-sourcing architecture for audit logging",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of California, Berkeley",
      degree: "Master of Science",
      field: "Computer Science",
      startDate: "2014",
      endDate: "2016",
      gpa: "3.9",
    },
    {
      id: "edu-2",
      institution: "Georgia Institute of Technology",
      degree: "Bachelor of Science",
      field: "Computer Engineering",
      startDate: "2010",
      endDate: "2014",
      gpa: "3.7",
    },
  ],
  skills: [
    {
      id: "sk-1",
      category: "Languages",
      items: ["TypeScript", "JavaScript", "Python", "Go", "Rust", "SQL"],
    },
    {
      id: "sk-2",
      category: "Frontend",
      items: [
        "React",
        "Next.js",
        "Vue.js",
        "Tailwind CSS",
        "GraphQL",
        "Storybook",
      ],
    },
    {
      id: "sk-3",
      category: "Backend",
      items: ["Node.js", "Express", "NestJS", "PostgreSQL", "Redis", "Kafka"],
    },
    {
      id: "sk-4",
      category: "DevOps & Cloud",
      items: [
        "AWS",
        "Docker",
        "Kubernetes",
        "Terraform",
        "GitHub Actions",
        "Datadog",
      ],
    },
    {
      id: "sk-5",
      category: "Soft Skills",
      items: [
        "Technical Leadership",
        "Mentoring",
        "Agile/Scrum",
        "Cross-team Communication",
        "System Design",
      ],
    },
  ],
  languages: [
    { id: "lang-1", language: "English", proficiency: "native" },
    { id: "lang-2", language: "Spanish", proficiency: "fluent" },
    { id: "lang-3", language: "Portuguese", proficiency: "intermediate" },
  ],
  projects: [
    {
      id: "proj-1",
      name: "OpenMetrics Dashboard",
      description:
        "Open-source real-time metrics dashboard with pluggable data sources. Built with React, D3.js, and WebSockets. Used by 2,000+ developers.",
      technologies: ["React", "D3.js", "WebSocket", "Node.js", "Docker"],
      url: "https://github.com/alexrivera/openmetrics-dash",
    },
    {
      id: "proj-2",
      name: "CLI Task Runner",
      description:
        "A blazing-fast task runner for monorepos with dependency graph resolution, caching, and parallel execution.",
      technologies: ["Rust", "TOML", "DAG algorithms"],
      url: "https://github.com/alexrivera/taskr",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Solutions Architect – Professional",
      issuer: "Amazon Web Services",
      date: "Mar 2023",
      url: "https://aws.amazon.com/certification",
    },
    {
      id: "cert-2",
      name: "Certified Kubernetes Administrator (CKA)",
      issuer: "Cloud Native Computing Foundation",
      date: "Nov 2022",
    },
    {
      id: "cert-3",
      name: "Google Professional Cloud Developer",
      issuer: "Google Cloud",
      date: "Jul 2021",
    },
  ],
  publications: [
    {
      id: "pub-1",
      title: "Scaling Event-Driven Architectures: Lessons from Production",
      publisher: "InfoQ",
      date: "Sep 2023",
      url: "https://infoq.com/articles/scaling-eda",
      description:
        "Deep dive into patterns and pitfalls of event-driven systems at scale, based on real-world experience migrating a monolith.",
    },
    {
      id: "pub-2",
      title: "The Case for TypeScript in Backend Development",
      publisher: "Medium — Better Programming",
      date: "Apr 2022",
      url: "https://medium.com/better-programming/typescript-backend",
    },
  ],
  volunteerWork: [
    {
      id: "vol-1",
      organization: "Code for America",
      role: "Volunteer Engineer",
      startDate: "Jan 2021",
      endDate: "Dec 2021",
      description:
        "Built an open-source civic engagement platform used by 3 cities to manage community feedback and budget allocation.",
    },
  ],
  awards: [
    {
      id: "award-1",
      title: "Engineering Excellence Award",
      issuer: "Quantum Cloud Inc.",
      date: "2023",
      description:
        "Recognized for outstanding technical leadership and impact on platform reliability.",
    },
    {
      id: "award-2",
      title: "Best Open-Source Project — DevConf 2022",
      issuer: "DevConf International",
      date: "2022",
    },
  ],
  interests: [
    "Open-source development",
    "Distributed systems",
    "Technical writing",
    "Rock climbing",
    "Board games",
  ],
};

// AI Provider types
export type AIProvider = "ollama" | "openai" | "anthropic" | "groq" | "custom";

export interface AIProviderConfig {
  provider: AIProvider;
  baseUrl: string;
  model: string;
  apiKey?: string;
  systemPrompt?: string;
}

export const DEFAULT_AI_CONFIGS: Record<
  AIProvider,
  Partial<AIProviderConfig>
> = {
  ollama: {
    provider: "ollama",
    baseUrl: "http://localhost:11434",
    model: "llama3",
  },
  openai: {
    provider: "openai",
    baseUrl: "https://api.openai.com/v1",
    model: "gpt-4o",
  },
  anthropic: {
    provider: "anthropic",
    baseUrl: "https://api.anthropic.com/v1",
    model: "claude-sonnet-4-20250514",
  },
  groq: {
    provider: "groq",
    baseUrl: "https://api.groq.com/openai/v1",
    model: "llama-3.3-70b-versatile",
  },
  custom: {
    provider: "custom",
    baseUrl: "",
    model: "",
  },
};

// Panel visibility state
export interface PanelState {
  showSidebar: boolean;
  showPreview: boolean;
  showAIConfig: boolean;
  activePanel: "editor" | "templates" | "history" | "export";
}

// Template selection types (co-located with store)
export interface TemplatePaletteColors {
  primary: string;
  secondary: string;
  accent: string;
}

export interface TemplateOption {
  id: string;
  name: string;
  description: string;
  preview: string;
}

export interface PaletteOption {
  id: string;
  name: string;
  colors: TemplatePaletteColors;
}

export interface LayoutOption {
  id: string;
  name: string;
  icon: string;
}

export const TEMPLATES: TemplateOption[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and simple design",
    preview:
      "bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Classic corporate style",
    preview:
      "bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary with sidebar",
    preview:
      "bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900 dark:to-indigo-900",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold and colorful",
    preview:
      "bg-gradient-to-br from-purple-100 to-pink-200 dark:from-purple-900 dark:to-pink-900",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Elegant and sophisticated",
    preview:
      "bg-gradient-to-br from-amber-100 to-yellow-200 dark:from-amber-900 dark:to-yellow-900",
  },
  {
    id: "tech",
    name: "Tech",
    description: "Developer-focused layout",
    preview:
      "bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900 dark:to-emerald-900",
  },
];

export const COLOR_PALETTES: PaletteOption[] = [
  {
    id: "default",
    name: "Default",
    colors: { primary: "#18181b", secondary: "#71717a", accent: "#3b82f6" },
  },
  {
    id: "ocean",
    name: "Ocean",
    colors: { primary: "#0369a1", secondary: "#0891b2", accent: "#06b6d4" },
  },
  {
    id: "forest",
    name: "Forest",
    colors: { primary: "#166534", secondary: "#15803d", accent: "#22c55e" },
  },
  {
    id: "sunset",
    name: "Sunset",
    colors: { primary: "#c2410c", secondary: "#ea580c", accent: "#f97316" },
  },
  {
    id: "grape",
    name: "Grape",
    colors: { primary: "#7c3aed", secondary: "#8b5cf6", accent: "#a78bfa" },
  },
  {
    id: "mono",
    name: "Monochrome",
    colors: { primary: "#000000", secondary: "#525252", accent: "#a3a3a3" },
  },
];

export const LAYOUTS: LayoutOption[] = [
  { id: "single", name: "Single Column", icon: "▢" },
  { id: "sidebar-left", name: "Sidebar Left", icon: "◧" },
  { id: "sidebar-right", name: "Sidebar Right", icon: "◨" },
  { id: "two-column", name: "Two Column", icon: "▥" },
];

// App state
export interface CVAppState {
  // CV Data (source of truth)
  cvData: CVData;
  isDirty: boolean;

  // Templates & Customization
  selectedTemplate: CVTemplate | null;
  customization: TemplateCustomization | null;
  selectedTemplateId: string;
  selectedPaletteId: string;
  selectedLayoutId: string;

  // AI Configuration
  aiConfig: AIProviderConfig;
  isConnected: boolean;
  availableModels: string[];

  // Generation
  isGenerating: boolean;
  generatedContent: string;
  generatedCVData: CVData | null;
  jobContext: string;

  // History
  iterations: CVIteration[];

  // UI State
  panels: PanelState;
}

// Actions
type CVAction =
  | { type: "SET_CV_DATA"; payload: CVData }
  | { type: "UPDATE_CV_FIELD"; payload: { path: string; value: unknown } }
  | { type: "MARK_CLEAN" }
  | { type: "SET_TEMPLATE"; payload: CVTemplate }
  | { type: "SET_CUSTOMIZATION"; payload: TemplateCustomization }
  | { type: "SET_TEMPLATE_ID"; payload: string }
  | { type: "SET_PALETTE_ID"; payload: string }
  | { type: "SET_LAYOUT_ID"; payload: string }
  | { type: "SET_AI_CONFIG"; payload: Partial<AIProviderConfig> }
  | { type: "SET_AI_PROVIDER"; payload: AIProvider }
  | { type: "SET_CONNECTION_STATUS"; payload: boolean }
  | { type: "SET_AVAILABLE_MODELS"; payload: string[] }
  | { type: "SET_GENERATING"; payload: boolean }
  | {
      type: "SET_GENERATED_CONTENT";
      payload: { content: string; cvData?: CVData };
    }
  | { type: "SET_JOB_CONTEXT"; payload: string }
  | { type: "ADD_ITERATION"; payload: CVIteration }
  | { type: "LOAD_ITERATION"; payload: CVIteration }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "TOGGLE_PREVIEW" }
  | { type: "TOGGLE_AI_CONFIG" }
  | { type: "SET_ACTIVE_PANEL"; payload: PanelState["activePanel"] }
  | { type: "LOAD_STATE"; payload: Partial<CVAppState> }
  | { type: "LOAD_SAMPLE_DATA" }
  | { type: "CLEAR_DATA" }
  | { type: "APPLY_GENERATED" };

// Initial state
const initialState: CVAppState = {
  cvData: DEFAULT_CV_DATA,
  isDirty: false,
  selectedTemplate: null,
  customization: null,
  selectedTemplateId: "minimal",
  selectedPaletteId: "default",
  selectedLayoutId: "single",
  aiConfig: {
    provider: "ollama",
    baseUrl: "http://localhost:11434",
    model: "llama3",
    systemPrompt: "",
  },
  isConnected: false,
  availableModels: [],
  isGenerating: false,
  generatedContent: "",
  generatedCVData: null,
  jobContext: "",
  iterations: [],
  panels: {
    showSidebar: true,
    showPreview: true,
    showAIConfig: false,
    activePanel: "editor",
  },
};

// Helper to deep set a value by path
function setNestedValue(
  obj: Record<string, unknown>,
  path: string,
  value: unknown,
): Record<string, unknown> {
  const keys = path.split(".");
  const result = { ...obj };
  let current = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    current[key] = { ...(current[key] as Record<string, unknown>) };
    current = current[key] as Record<string, unknown>;
  }

  current[keys[keys.length - 1]] = value;
  return result;
}

// Reducer
function cvReducer(state: CVAppState, action: CVAction): CVAppState {
  switch (action.type) {
    case "SET_CV_DATA":
      return { ...state, cvData: action.payload, isDirty: true };

    case "UPDATE_CV_FIELD":
      return {
        ...state,
        cvData: setNestedValue(
          state.cvData as unknown as Record<string, unknown>,
          action.payload.path,
          action.payload.value,
        ) as unknown as CVData,
        isDirty: true,
      };

    case "MARK_CLEAN":
      return { ...state, isDirty: false };

    case "SET_TEMPLATE":
      return { ...state, selectedTemplate: action.payload };

    case "SET_CUSTOMIZATION":
      return { ...state, customization: action.payload };

    case "SET_TEMPLATE_ID":
      return { ...state, selectedTemplateId: action.payload };

    case "SET_PALETTE_ID":
      return { ...state, selectedPaletteId: action.payload };

    case "SET_LAYOUT_ID":
      return { ...state, selectedLayoutId: action.payload };

    case "SET_AI_CONFIG":
      return {
        ...state,
        aiConfig: { ...state.aiConfig, ...action.payload },
      };

    case "SET_AI_PROVIDER":
      const defaultConfig = DEFAULT_AI_CONFIGS[action.payload];
      return {
        ...state,
        aiConfig: {
          ...state.aiConfig,
          ...defaultConfig,
          apiKey: state.aiConfig.apiKey, // Keep existing API key
          systemPrompt: state.aiConfig.systemPrompt, // Keep existing prompt
        },
        isConnected: false,
        availableModels: [],
      };

    case "SET_CONNECTION_STATUS":
      return { ...state, isConnected: action.payload };

    case "SET_AVAILABLE_MODELS":
      return { ...state, availableModels: action.payload };

    case "SET_GENERATING":
      return { ...state, isGenerating: action.payload };

    case "SET_GENERATED_CONTENT":
      return {
        ...state,
        generatedContent: action.payload.content,
        generatedCVData: action.payload.cvData || null,
      };

    case "SET_JOB_CONTEXT":
      return { ...state, jobContext: action.payload };

    case "ADD_ITERATION":
      return {
        ...state,
        iterations: [action.payload, ...state.iterations].slice(0, 50), // Keep last 50
      };

    case "LOAD_ITERATION":
      return {
        ...state,
        cvData: action.payload.cvData,
        generatedContent: action.payload.generatedContent,
        generatedCVData: action.payload.generatedCVData || null,
        jobContext: action.payload.context,
        isDirty: false,
      };

    case "TOGGLE_SIDEBAR":
      return {
        ...state,
        panels: { ...state.panels, showSidebar: !state.panels.showSidebar },
      };

    case "TOGGLE_PREVIEW":
      return {
        ...state,
        panels: { ...state.panels, showPreview: !state.panels.showPreview },
      };

    case "TOGGLE_AI_CONFIG":
      return {
        ...state,
        panels: { ...state.panels, showAIConfig: !state.panels.showAIConfig },
      };

    case "SET_ACTIVE_PANEL":
      return {
        ...state,
        panels: { ...state.panels, activePanel: action.payload },
      };

    case "LOAD_STATE":
      return { ...state, ...action.payload };

    case "LOAD_SAMPLE_DATA":
      return { ...state, cvData: SAMPLE_CV_DATA, isDirty: true };

    case "CLEAR_DATA":
      return {
        ...state,
        cvData: DEFAULT_CV_DATA,
        generatedCVData: null,
        generatedContent: "",
        isDirty: true,
      };

    case "APPLY_GENERATED":
      if (!state.generatedCVData) return state;
      return {
        ...state,
        cvData: state.generatedCVData,
        generatedCVData: null,
        generatedContent: "",
        isDirty: true,
        panels: { ...state.panels, activePanel: "editor" },
      };

    default:
      return state;
  }
}

// Context
interface CVContextType {
  state: CVAppState;
  dispatch: React.Dispatch<CVAction>;
  // Convenience actions
  setCVData: (data: CVData) => void;
  updateField: (path: string, value: unknown) => void;
  saveToStorage: () => void;
  loadFromStorage: () => void;
  setAIProvider: (provider: AIProvider) => void;
  testConnection: () => Promise<boolean>;
  loadModels: () => Promise<void>;
  generateCV: () => Promise<void>;
  applyGeneratedData: () => void;
}

const CVContext = createContext<CVContextType | null>(null);

// Storage keys
const STORAGE_KEYS = {
  cvData: "cv-data",
  aiConfig: "ai-config",
  iterations: "cv-iterations",
  template: "cv-template",
  customization: "cv-customization",
  templateId: "cv-template-id",
  paletteId: "cv-palette-id",
  layoutId: "cv-layout-id",
};

// Provider
export function CVStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cvReducer, initialState);

  const setCVData = useCallback((data: CVData) => {
    dispatch({ type: "SET_CV_DATA", payload: data });
  }, []);

  const updateField = useCallback((path: string, value: unknown) => {
    dispatch({ type: "UPDATE_CV_FIELD", payload: { path, value } });
  }, []);

  const saveToStorage = useCallback(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem(STORAGE_KEYS.cvData, JSON.stringify(state.cvData));
    localStorage.setItem(STORAGE_KEYS.aiConfig, JSON.stringify(state.aiConfig));
    localStorage.setItem(
      STORAGE_KEYS.iterations,
      JSON.stringify(state.iterations),
    );
    if (state.selectedTemplate) {
      localStorage.setItem(
        STORAGE_KEYS.template,
        JSON.stringify(state.selectedTemplate),
      );
    }
    if (state.customization) {
      localStorage.setItem(
        STORAGE_KEYS.customization,
        JSON.stringify(state.customization),
      );
    }
    localStorage.setItem(STORAGE_KEYS.templateId, state.selectedTemplateId);
    localStorage.setItem(STORAGE_KEYS.paletteId, state.selectedPaletteId);
    localStorage.setItem(STORAGE_KEYS.layoutId, state.selectedLayoutId);
    dispatch({ type: "MARK_CLEAN" });
  }, [state]);

  const loadFromStorage = useCallback(() => {
    if (typeof window === "undefined") return;

    const stored: Partial<CVAppState> = {};

    const cvData = localStorage.getItem(STORAGE_KEYS.cvData);
    if (cvData) stored.cvData = JSON.parse(cvData);

    const aiConfig = localStorage.getItem(STORAGE_KEYS.aiConfig);
    if (aiConfig) stored.aiConfig = JSON.parse(aiConfig);

    const iterations = localStorage.getItem(STORAGE_KEYS.iterations);
    if (iterations) stored.iterations = JSON.parse(iterations);

    const template = localStorage.getItem(STORAGE_KEYS.template);
    if (template) stored.selectedTemplate = JSON.parse(template);

    const customization = localStorage.getItem(STORAGE_KEYS.customization);
    if (customization) stored.customization = JSON.parse(customization);

    const templateId = localStorage.getItem(STORAGE_KEYS.templateId);
    if (templateId) stored.selectedTemplateId = templateId;

    const paletteId = localStorage.getItem(STORAGE_KEYS.paletteId);
    if (paletteId) stored.selectedPaletteId = paletteId;

    const layoutId = localStorage.getItem(STORAGE_KEYS.layoutId);
    if (layoutId) stored.selectedLayoutId = layoutId;

    dispatch({ type: "LOAD_STATE", payload: stored });
  }, []);

  const setAIProvider = useCallback((provider: AIProvider) => {
    dispatch({ type: "SET_AI_PROVIDER", payload: provider });
  }, []);

  const testConnection = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state.aiConfig),
      });

      const data = await response.json();
      dispatch({ type: "SET_CONNECTION_STATUS", payload: data.success });
      return data.success;
    } catch {
      dispatch({ type: "SET_CONNECTION_STATUS", payload: false });
      return false;
    }
  }, [state.aiConfig]);

  const loadModels = useCallback(async () => {
    try {
      const response = await fetch("/api/list-models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseUrl: state.aiConfig.baseUrl,
          provider: state.aiConfig.provider,
        }),
      });

      const data = await response.json();
      if (data.success && data.models) {
        dispatch({
          type: "SET_AVAILABLE_MODELS",
          payload: data.models.map((m: { name: string }) => m.name || m),
        });
      }
    } catch {
      // Silent fail
    }
  }, [state.aiConfig]);

  const generateCV = useCallback(async () => {
    if (!state.jobContext.trim()) return;

    dispatch({ type: "SET_GENERATING", payload: true });

    try {
      const response = await fetch("/api/generate-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvData: state.cvData,
          context: state.jobContext,
          llmConfig: {
            baseUrl: state.aiConfig.baseUrl,
            model: state.aiConfig.model,
            apiKey: state.aiConfig.apiKey,
            systemPrompt: state.aiConfig.systemPrompt,
            provider: state.aiConfig.provider,
          },
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Generation failed:", response.status, errorBody);
        throw new Error("Generation failed");
      }

      // Read SSE stream — server sends progress pings and a final "done" message with content
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let generatedContent = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE messages (delimited by \n\n)
        const messages = buffer.split("\n\n");
        buffer = messages.pop() || ""; // Keep incomplete message in buffer

        for (const msg of messages) {
          const line = msg.trim();
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6);
          try {
            const data = JSON.parse(jsonStr);
            if (data.status === "done" && data.content) {
              generatedContent = data.content;
            } else if (data.status === "error") {
              throw new Error(data.error || "Generation failed");
            }
            // "generating" and "progress" are just keep-alive pings, ignore
          } catch (e) {
            if (e instanceof Error && e.message !== "Generation failed") {
              // JSON parse error, skip
            } else {
              throw e;
            }
          }
        }
      }

      // Process any remaining buffer
      if (buffer.trim()) {
        const line = buffer.trim();
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.status === "done" && data.content) {
              generatedContent = data.content;
            }
          } catch {
            // skip
          }
        }
      }

      console.log(
        "[cv-store] Generation response received. Content length:",
        generatedContent.length,
      );

      // Robustly extract JSON from the generated content
      let generatedCVData: CVData | undefined;
      const tryParseCVData = (raw: string): CVData | undefined => {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.personalInfo) {
            // Normalize: ensure all required arrays exist
            return {
              personalInfo: {
                name: "",
                email: "",
                phone: "",
                location: "",
                ...parsed.personalInfo,
              },
              summary: parsed.summary || "",
              experience: parsed.experience || [],
              education: parsed.education || [],
              skills: parsed.skills || [],
              languages: parsed.languages || [],
              projects: parsed.projects || [],
              certifications: parsed.certifications || [],
              publications: parsed.publications || [],
              volunteerWork: parsed.volunteerWork || [],
              awards: parsed.awards || [],
              interests: parsed.interests || [],
            } as CVData;
          }
        } catch {
          // Not valid JSON
        }
        return undefined;
      };

      generatedCVData = tryParseCVData(generatedContent);
      if (!generatedCVData) {
        // Try to extract JSON object from mixed content
        const jsonMatch = generatedContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          generatedCVData = tryParseCVData(jsonMatch[0]);
        }
      }

      console.log(
        "[cv-store] Generation complete. Content length:",
        generatedContent.length,
        "Parsed CV data:",
        !!generatedCVData,
      );

      dispatch({
        type: "SET_GENERATED_CONTENT",
        payload: { content: generatedContent, cvData: generatedCVData },
      });

      // Save iteration
      const iteration: CVIteration = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        cvData: state.cvData,
        context: state.jobContext,
        templateId: state.selectedTemplate?.id || "default",
        generatedContent,
        generatedCVData,
      };
      dispatch({ type: "ADD_ITERATION", payload: iteration });
    } catch (error) {
      console.error("Generation error:", error);
    } finally {
      dispatch({ type: "SET_GENERATING", payload: false });
    }
  }, [state.cvData, state.jobContext, state.aiConfig, state.selectedTemplate]);

  const applyGeneratedData = useCallback(() => {
    dispatch({ type: "APPLY_GENERATED" });
  }, []);

  return (
    <CVContext.Provider
      value={{
        state,
        dispatch,
        setCVData,
        updateField,
        saveToStorage,
        loadFromStorage,
        setAIProvider,
        testConnection,
        loadModels,
        generateCV,
        applyGeneratedData,
      }}
    >
      {children}
    </CVContext.Provider>
  );
}

// Hook
export function useCVStore() {
  const context = useContext(CVContext);
  if (!context) {
    throw new Error("useCVStore must be used within CVStoreProvider");
  }
  return context;
}
