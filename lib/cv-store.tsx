"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { apiPath } from "@/lib/api";
import { toast } from "sonner";
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
    name: "David Estevez",
    title: "CTO @ Coverfleet",
    email: "dev.destbreso@gmail.com",
    phone: "",
    location: "Miami, Florida, United States",
    website: "https://coverfleet.com",
    linkedin: "https://www.linkedin.com/in/destbreso",
    github: "github.com/destbreso",
    portfolio: "https://destbreso.com",
  },
  summary:
    "Team player, passionate Mathematician, Software Developer, and IT Enthusiast with 10+ years of experience leading successful engineering teams. Specializing in tackling complex challenges and creating innovative solutions from a multidisciplinary perspective — from machine learning research to building zero-to-scale platforms in trucking, cybersecurity, and SaaS industries.",
  experience: [
    {
      id: "exp-1",
      company: "Coverfleet",
      position: "CTO | Strategic & Product Innovation",
      startDate: "Jun 2025",
      endDate: "Present",
      description:
        "Hands-on CTO designing architecture, writing production code, shipping features, debugging systems, and owning execution end-to-end. Working closely with the engineering team to drive product strategy, technical direction, and budget decisions while aligning with real business needs and company vision.",
      achievements: [
        "Zero-to-scale systems & platform building for trucking industry",
        "Product & innovation leadership across multiple product lines",
        "Full-stack, cross-domain problem solving (backend, data, infra)",
        "Budget, cost optimization & ROI-driven technical decisions",
        "Led engineering team with execution, ownership & delivery focus",
      ],
    },
    {
      id: "exp-2",
      company: "Coverfleet",
      position: "Chief Systems & Data Engineer",
      startDate: "Apr 2020",
      endDate: "Jun 2025",
      description:
        "Engineered data-driven solutions for the trucking industry, building critical infrastructure, scalable ETL pipelines, and automated workflows that powered core business operations.",
      achievements: [
        "Built scalable ETL pipelines and automated data workflows processing millions of records",
        "Designed dashboards and reports enabling actionable insights for decision-makers",
        "Architected core data infrastructure supporting real-time operations",
      ],
    },
    {
      id: "exp-3",
      company: "Xumansoft",
      position: "Senior Backend Developer | Data Analyst",
      startDate: "Jan 2023",
      endDate: "Jul 2024",
      description:
        "Led a team of developers in designing and implementing backend and data solutions for transportation and cybersecurity sectors.",
      achievements: [
        "Led development of backend and data systems ensuring performance, scalability, and reliability",
        "Designed and implemented API architectures for multi-tenant platforms",
      ],
    },
    {
      id: "exp-4",
      company: "Guajiritos",
      position: "Chief Technology Officer",
      startDate: "Jul 2023",
      endDate: "Jan 2024",
      description:
        "Led technology and strategic initiatives, driving innovation and building high-quality SaaS products across B2B and B2C verticals.",
      achievements: [
        "Led a 40+ cross-functional team across 10+ SaaS projects",
        "Built and stabilized scalable platforms for B2B and B2C operations",
        "Established engineering standards, code review processes, and CI/CD pipelines",
      ],
    },
    {
      id: "exp-5",
      company: "Guajiritos",
      position: "Project Lead & Solution Architect",
      startDate: "Jan 2023",
      endDate: "Jul 2023",
      description:
        "Led cross-functional squads and architected backend solutions for multiple concurrent projects.",
      achievements: [
        "Led a team of 8+ (UI/UX, DevOps, Backend, Frontend, QA)",
        "Conducted requirements gathering, sprint planning, and project monitoring",
        "Designed solution architectures for new product initiatives",
      ],
    },
    {
      id: "exp-6",
      company: "One Broker Solutions LLC",
      position: "Co-Founder | Solutions Architect | Senior Backend Developer",
      startDate: "Jan 2019",
      endDate: "Jan 2023",
      description:
        "As a founding member, led the architecture and development of a full-stack platform supporting multi-service providers and agencies in both B2C and B2B operations.",
      achievements: [
        "Designed and led development of multiple subsystems from scratch",
        "Architected APIs, real-time integrations, and core transaction workflows",
        "Built multi-tenant platform serving multiple service agencies",
      ],
    },
    {
      id: "exp-7",
      company: "CENATAV",
      position: "Machine Learning Researcher | Biometrics",
      startDate: "Jul 2015",
      endDate: "Dec 2018",
      description:
        "Machine learning researcher specializing in computer vision, focused on enhancing the accuracy and efficiency of fingerprint recognition systems for criminal investigation.",
      achievements: [
        "Developed methods and algorithms for latent fingerprint and palm print comparison",
        "Published peer-reviewed papers on fingerprint template analysis and dissimilarity representations",
        "Contributed to national-scale biometric identification systems",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "Universidad de La Habana",
      degree: "Bachelor of Science",
      field: "Mathematics",
      startDate: "2005",
      endDate: "2009",
    },
    {
      id: "edu-2",
      institution:
        "Vocational High School Institute of Exact Sciences Vladimir Ilich",
      degree: "High School Diploma",
      field: "Mathematics",
      startDate: "2002",
      endDate: "2005",
    },
  ],
  skills: [
    {
      id: "sk-1",
      category: "Backend & Runtime",
      items: [
        "Node.js",
        "Express",
        "NestJS",
        "Python",
        "TypeScript",
        "JavaScript",
      ],
    },
    {
      id: "sk-2",
      category: "Databases & Data",
      items: [
        "PostgreSQL",
        "MongoDB",
        "DynamoDB",
        "Azure Cosmos DB",
        "ELK Stack",
        "Redis",
        "ETL Pipelines",
      ],
    },
    {
      id: "sk-3",
      category: "DevOps & Tools",
      items: [
        "Docker",
        "GitLab CI/CD",
        "GitHub Actions",
        "Bitbucket Pipelines",
        "AWS",
        "Azure",
      ],
    },
    {
      id: "sk-4",
      category: "Project Management",
      items: [
        "Jira",
        "Trello",
        "Agile/Scrum",
        "Sprint Planning",
        "Cross-functional Leadership",
      ],
    },
    {
      id: "sk-5",
      category: "Machine Learning & Research",
      items: [
        "Computer Vision",
        "Biometrics",
        "Pattern Recognition",
        "Dissimilarity Representations",
        "Scientific Publishing",
      ],
    },
    {
      id: "sk-6",
      category: "Architecture & Design",
      items: [
        "Microservices",
        "Event-Driven Architecture",
        "System Design",
        "API Design",
        "Multi-tenant Platforms",
        "Solution Architecture",
      ],
    },
  ],
  languages: [
    { id: "lang-1", language: "Spanish", proficiency: "native" },
    { id: "lang-2", language: "English", proficiency: "fluent" },
  ],
  projects: [
    {
      id: "proj-1",
      name: "Sagua Services Broker Platform",
      description:
        "Full-stack multi-service platform supporting agencies and providers in B2C and B2B operations, with real-time integrations, transaction workflows, and multi-tenant architecture.",
      technologies: ["Node.js", "NestJS", "PostgreSQL", "MongoDB", "Docker"],
    },
    {
      id: "proj-2",
      name: "Coverfleet Data Platform",
      description:
        "Scalable data infrastructure for the trucking industry, featuring automated ETL pipelines, real-time dashboards, and reporting systems driving business intelligence.",
      technologies: ["Node.js", "PostgreSQL", "ELK Stack", "AWS", "DynamoDB"],
    },
  ],
  certifications: [],
  publications: [
    {
      id: "pub-1",
      title:
        "Fingerprint Template Ageing Revisited — It's the Quality, Stupid!",
      publisher: "Conference Paper",
      date: "Apr 2019",
      description:
        "Research on the impact of quality factors on fingerprint template ageing in automated recognition systems.",
    },
    {
      id: "pub-2",
      title:
        "Improving Regression Models by Dissimilarity Representation of Bio-chemical Data",
      publisher: "Book Chapter",
      date: "Mar 2019",
      description:
        "Novel approach using dissimilarity representations to improve regression model performance on bio-chemical datasets.",
    },
    {
      id: "pub-3",
      title: "Minutiae Template Fusion and Its Impact on Fingerprint Matching",
      publisher: "Article — vol.12, n.4, pp.103-114",
      date: "2018",
      description:
        "Study on fusion strategies for minutiae templates and their effect on fingerprint matching accuracy.",
    },
  ],
  volunteerWork: [],
  awards: [],
  interests: [
    "Mathematics & Topology",
    "Open-source development",
    "Distributed systems",
    "Machine learning research",
    "Technical writing",
  ],
};

// AI Provider types
export type AIProvider =
  | "ollama"
  | "openai"
  | "anthropic"
  | "groq"
  | "gemini"
  | "mistral"
  | "deepseek"
  | "custom";

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
  gemini: {
    provider: "gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    model: "gemini-2.0-flash",
  },
  mistral: {
    provider: "mistral",
    baseUrl: "https://api.mistral.ai/v1",
    model: "mistral-small-latest",
  },
  deepseek: {
    provider: "deepseek",
    baseUrl: "https://api.deepseek.com/v1",
    model: "deepseek-chat",
  },
  custom: {
    provider: "custom",
    baseUrl: "",
    model: "",
  },
};

// Panel visibility state
export interface PanelState {
  showPreview: boolean;
  showAIConfig: boolean;
  activePanel:
    | "editor"
    | "templates"
    | "history"
    | "export"
    | "faq"
    | "storage";
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

/** A saved template+layout+palette combo */
export interface FavoritePreset {
  id: string;
  name: string;
  templateId: string;
  layoutId: string;
  paletteId: string;
  customPalette: TemplatePaletteColors | null;
  priority: number; // lower = higher priority
  createdAt: number;
}

/** A user-saved custom palette */
export interface SavedPalette {
  id: string;
  name: string;
  colors: TemplatePaletteColors;
  createdAt: number;
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
  {
    id: "compact",
    name: "Compact",
    description: "Dense, space-efficient layout",
    preview:
      "bg-gradient-to-br from-gray-100 to-stone-200 dark:from-gray-800 dark:to-stone-900",
  },
  {
    id: "academic",
    name: "Academic",
    description: "Research & academic style",
    preview:
      "bg-gradient-to-br from-sky-100 to-cyan-200 dark:from-sky-900 dark:to-cyan-900",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Refined serif typography",
    preview:
      "bg-gradient-to-br from-rose-100 to-pink-200 dark:from-rose-900 dark:to-pink-900",
  },
  {
    id: "swiss",
    name: "Swiss",
    description: "International typographic style",
    preview:
      "bg-gradient-to-br from-red-100 to-orange-200 dark:from-red-900 dark:to-orange-900",
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "Magazine-inspired design",
    preview:
      "bg-gradient-to-br from-teal-100 to-emerald-200 dark:from-teal-900 dark:to-emerald-900",
  },
  {
    id: "startup",
    name: "Startup",
    description: "Fresh, modern & friendly",
    preview:
      "bg-gradient-to-br from-violet-100 to-fuchsia-200 dark:from-violet-900 dark:to-fuchsia-900",
  },
  {
    id: "harvard",
    name: "Harvard",
    description: "Classic Harvard OCS style",
    preview:
      "bg-gradient-to-br from-red-50 to-stone-200 dark:from-red-950 dark:to-stone-900",
  },
  {
    id: "oxford",
    name: "Oxford",
    description: "Traditional Oxford CV format",
    preview:
      "bg-gradient-to-br from-blue-50 to-stone-200 dark:from-blue-950 dark:to-stone-900",
  },
  {
    id: "cambridge",
    name: "Cambridge",
    description: "Clean Cambridge academic style",
    preview:
      "bg-gradient-to-br from-sky-50 to-gray-200 dark:from-sky-950 dark:to-gray-900",
  },
  {
    id: "princeton",
    name: "Princeton",
    description: "Bold Princeton career format",
    preview:
      "bg-gradient-to-br from-orange-50 to-stone-200 dark:from-orange-950 dark:to-stone-900",
  },
  {
    id: "yale",
    name: "Yale",
    description: "Refined Yale resume style",
    preview:
      "bg-gradient-to-br from-blue-100 to-zinc-200 dark:from-blue-950 dark:to-zinc-900",
  },
  {
    id: "mit",
    name: "MIT",
    description: "Structured MIT engineering CV",
    preview:
      "bg-gradient-to-br from-gray-50 to-red-100 dark:from-gray-950 dark:to-red-950",
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
  {
    id: "slate",
    name: "Slate",
    colors: { primary: "#334155", secondary: "#64748b", accent: "#0ea5e9" },
  },
  {
    id: "rose",
    name: "Rose",
    colors: { primary: "#9f1239", secondary: "#e11d48", accent: "#fb7185" },
  },
  {
    id: "teal",
    name: "Teal",
    colors: { primary: "#115e59", secondary: "#0d9488", accent: "#2dd4bf" },
  },
  {
    id: "amber",
    name: "Amber",
    colors: { primary: "#92400e", secondary: "#d97706", accent: "#fbbf24" },
  },
  {
    id: "navy",
    name: "Navy",
    colors: { primary: "#1e3a5f", secondary: "#2563eb", accent: "#60a5fa" },
  },
  {
    id: "coral",
    name: "Coral",
    colors: { primary: "#9a3412", secondary: "#f43f5e", accent: "#fb923c" },
  },
  {
    id: "lavender",
    name: "Lavender",
    colors: { primary: "#4c1d95", secondary: "#7c3aed", accent: "#c4b5fd" },
  },
  {
    id: "charcoal",
    name: "Charcoal",
    colors: { primary: "#1c1917", secondary: "#44403c", accent: "#78716c" },
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
  customPalette: TemplatePaletteColors | null;
  selectedLayoutId: string;

  // Favorites & Custom Palettes
  favoritePresets: FavoritePreset[];
  savedPalettes: SavedPalette[];

  // AI Configuration
  aiConfig: AIProviderConfig;
  apiKeys: Partial<Record<AIProvider, string>>; // Per-provider API keys (memory only)
  isConnected: boolean;
  availableModels: string[];

  // Generation
  isGenerating: boolean;
  generatedContent: string;
  generatedCVData: CVData | null;
  generationStatus: string;
  generationChunks: number;
  jobContext: string;
  outputLanguage: string;

  // LinkedIn Import
  isImportingLinkedIn: boolean;
  linkedInImportStatus: string;

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
  | { type: "SET_CUSTOM_PALETTE"; payload: TemplatePaletteColors }
  | { type: "SET_LAYOUT_ID"; payload: string }
  | { type: "SET_AI_CONFIG"; payload: Partial<AIProviderConfig> }
  | { type: "SET_AI_PROVIDER"; payload: AIProvider }
  | { type: "SET_CONNECTION_STATUS"; payload: boolean }
  | { type: "SET_AVAILABLE_MODELS"; payload: string[] }
  | { type: "SET_GENERATING"; payload: boolean }
  | { type: "SET_GENERATION_STATUS"; payload: string }
  | { type: "SET_GENERATION_CHUNKS"; payload: number }
  | {
      type: "SET_GENERATED_CONTENT";
      payload: { content: string; cvData?: CVData };
    }
  | { type: "SET_JOB_CONTEXT"; payload: string }
  | { type: "SET_OUTPUT_LANGUAGE"; payload: string }
  | { type: "ADD_ITERATION"; payload: CVIteration }
  | { type: "LOAD_ITERATION"; payload: CVIteration }
  | { type: "TOGGLE_PREVIEW" }
  | { type: "TOGGLE_AI_CONFIG" }
  | { type: "SET_AI_CONFIG_OPEN"; payload: boolean }
  | { type: "SET_ACTIVE_PANEL"; payload: PanelState["activePanel"] }
  | { type: "LOAD_STATE"; payload: Partial<CVAppState> }
  | { type: "LOAD_SAMPLE_DATA" }
  | { type: "CLEAR_DATA" }
  | { type: "APPLY_GENERATED" }
  | { type: "SET_IMPORTING_LINKEDIN"; payload: boolean }
  | { type: "SET_LINKEDIN_IMPORT_STATUS"; payload: string }
  // Favorites
  | { type: "ADD_FAVORITE_PRESET"; payload: FavoritePreset }
  | { type: "REMOVE_FAVORITE_PRESET"; payload: string }
  | { type: "REORDER_FAVORITE_PRESETS"; payload: FavoritePreset[] }
  | { type: "APPLY_FAVORITE_PRESET"; payload: FavoritePreset }
  // Custom palettes
  | { type: "ADD_SAVED_PALETTE"; payload: SavedPalette }
  | { type: "REMOVE_SAVED_PALETTE"; payload: string }
  | { type: "UPDATE_SAVED_PALETTE"; payload: SavedPalette };

// Initial state
const initialState: CVAppState = {
  cvData: DEFAULT_CV_DATA,
  isDirty: false,
  selectedTemplate: null,
  customization: null,
  selectedTemplateId: "minimal",
  selectedPaletteId: "default",
  customPalette: null,
  selectedLayoutId: "single",
  favoritePresets: [],
  savedPalettes: [],
  aiConfig: {
    provider:
      process.env.NEXT_PUBLIC_DISABLE_OLLAMA === "true" ? "openai" : "ollama",
    baseUrl:
      process.env.NEXT_PUBLIC_DISABLE_OLLAMA === "true"
        ? "https://api.openai.com/v1"
        : "http://localhost:11434",
    model:
      process.env.NEXT_PUBLIC_DISABLE_OLLAMA === "true" ? "gpt-4o" : "llama3",
    systemPrompt: "",
  },
  apiKeys: {},
  isConnected: false,
  availableModels: [],
  isGenerating: false,
  generatedContent: "",
  generatedCVData: null,
  generationStatus: "",
  generationChunks: 0,
  jobContext: "",
  outputLanguage: "auto",
  isImportingLinkedIn: false,
  linkedInImportStatus: "",
  iterations: [],
  panels: {
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
      return {
        ...state,
        selectedPaletteId: action.payload,
        customPalette: null,
      };

    case "SET_CUSTOM_PALETTE":
      return {
        ...state,
        selectedPaletteId: "custom",
        customPalette: action.payload,
      };

    case "SET_LAYOUT_ID":
      return { ...state, selectedLayoutId: action.payload };

    case "SET_AI_CONFIG": {
      const updatedAiConfig = { ...state.aiConfig, ...action.payload };
      // Sync apiKeys map when apiKey changes
      const updatedApiKeys =
        action.payload.apiKey !== undefined
          ? {
              ...state.apiKeys,
              [updatedAiConfig.provider]: action.payload.apiKey || undefined,
            }
          : state.apiKeys;
      return {
        ...state,
        aiConfig: updatedAiConfig,
        apiKeys: updatedApiKeys,
      };
    }

    case "SET_AI_PROVIDER": {
      const defaultConfig = DEFAULT_AI_CONFIGS[action.payload];
      // Save current provider's key, load new provider's key
      const savedKeys = state.aiConfig.apiKey
        ? { ...state.apiKeys, [state.aiConfig.provider]: state.aiConfig.apiKey }
        : { ...state.apiKeys };
      return {
        ...state,
        aiConfig: {
          ...state.aiConfig,
          ...defaultConfig,
          apiKey: savedKeys[action.payload] || "",
          systemPrompt: state.aiConfig.systemPrompt, // Keep existing prompt
        },
        apiKeys: savedKeys,
        isConnected: false,
        availableModels: [],
      };
    }

    case "SET_CONNECTION_STATUS":
      return { ...state, isConnected: action.payload };

    case "SET_AVAILABLE_MODELS":
      return { ...state, availableModels: action.payload };

    case "SET_GENERATING":
      return { ...state, isGenerating: action.payload };

    case "SET_GENERATION_STATUS":
      return { ...state, generationStatus: action.payload };

    case "SET_GENERATION_CHUNKS":
      return { ...state, generationChunks: action.payload };

    case "SET_GENERATED_CONTENT":
      return {
        ...state,
        generatedContent: action.payload.content,
        generatedCVData: action.payload.cvData || null,
      };

    case "SET_JOB_CONTEXT":
      return { ...state, jobContext: action.payload };

    case "SET_OUTPUT_LANGUAGE":
      return { ...state, outputLanguage: action.payload };

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

    case "SET_AI_CONFIG_OPEN":
      return {
        ...state,
        panels: { ...state.panels, showAIConfig: action.payload },
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

    case "SET_IMPORTING_LINKEDIN":
      return {
        ...state,
        isImportingLinkedIn: action.payload,
        linkedInImportStatus: action.payload ? "Preparing…" : "",
      };

    case "SET_LINKEDIN_IMPORT_STATUS":
      return { ...state, linkedInImportStatus: action.payload };

    // ── Favorite Presets ──
    case "ADD_FAVORITE_PRESET":
      return {
        ...state,
        favoritePresets: [...state.favoritePresets, action.payload],
      };

    case "REMOVE_FAVORITE_PRESET":
      return {
        ...state,
        favoritePresets: state.favoritePresets.filter(
          (f) => f.id !== action.payload,
        ),
      };

    case "REORDER_FAVORITE_PRESETS":
      return { ...state, favoritePresets: action.payload };

    case "APPLY_FAVORITE_PRESET": {
      const preset = action.payload;
      return {
        ...state,
        selectedTemplateId: preset.templateId,
        selectedLayoutId: preset.layoutId,
        selectedPaletteId: preset.paletteId,
        customPalette: preset.customPalette,
      };
    }

    // ── Custom Palettes ──
    case "ADD_SAVED_PALETTE":
      return {
        ...state,
        savedPalettes: [...state.savedPalettes, action.payload],
      };

    case "REMOVE_SAVED_PALETTE":
      return {
        ...state,
        savedPalettes: state.savedPalettes.filter(
          (p) => p.id !== action.payload,
        ),
        // If deleted palette was active, revert to default
        selectedPaletteId:
          state.selectedPaletteId === action.payload
            ? "default"
            : state.selectedPaletteId,
      };

    case "UPDATE_SAVED_PALETTE":
      return {
        ...state,
        savedPalettes: state.savedPalettes.map((p) =>
          p.id === action.payload.id ? action.payload : p,
        ),
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
  cancelGeneration: () => void;
  applyGeneratedData: () => void;
  importFromLinkedIn: (file: File) => Promise<void>;
  cancelLinkedInImport: () => void;
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
  favoritePresets: "cv-favorite-presets",
  savedPalettes: "cv-saved-palettes",
  customPalette: "cv-custom-palette",
};

// API keys are ONLY stored in memory (React state), NEVER persisted to localStorage/sessionStorage
// This is the most secure approach for client-side only apps.
// User must re-enter API key each session - no persistence.
const SENSITIVE_KEYS = {
  aiApiKey: true, // Never persist to any storage
};

// Provider
export function CVStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cvReducer, initialState);
  const generationAbortRef = useRef<AbortController | null>(null);
  const linkedInAbortRef = useRef<AbortController | null>(null);

  const setCVData = useCallback((data: CVData) => {
    dispatch({ type: "SET_CV_DATA", payload: data });
  }, []);

  const updateField = useCallback((path: string, value: unknown) => {
    dispatch({ type: "UPDATE_CV_FIELD", payload: { path, value } });
  }, []);

  const saveToStorage = useCallback(() => {
    if (typeof window === "undefined") return;

    // Save CV data
    localStorage.setItem(STORAGE_KEYS.cvData, JSON.stringify(state.cvData));

    // Save AI config WITHOUT API key (separate for security)
    const aiConfigWithoutKey = { ...state.aiConfig };
    delete (aiConfigWithoutKey as { apiKey?: string }).apiKey; // Remove sensitive key
    localStorage.setItem(
      STORAGE_KEYS.aiConfig,
      JSON.stringify(aiConfigWithoutKey),
    );

    // API key is NOT stored anywhere - kept only in memory for this session

    // Save other data
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

    // Save custom palette colors
    if (state.customPalette) {
      localStorage.setItem(
        STORAGE_KEYS.customPalette,
        JSON.stringify(state.customPalette),
      );
    } else {
      localStorage.removeItem(STORAGE_KEYS.customPalette);
    }

    // Save favorites & custom palettes
    localStorage.setItem(
      STORAGE_KEYS.favoritePresets,
      JSON.stringify(state.favoritePresets),
    );
    localStorage.setItem(
      STORAGE_KEYS.savedPalettes,
      JSON.stringify(state.savedPalettes),
    );

    dispatch({ type: "MARK_CLEAN" });
  }, [state]);

  const loadFromStorage = useCallback(() => {
    if (typeof window === "undefined") return;

    const stored: Partial<CVAppState> = {};

    const cvData = localStorage.getItem(STORAGE_KEYS.cvData);
    if (cvData) stored.cvData = JSON.parse(cvData);

    // Load AI config from localStorage (but NOT the API key - intentional)
    const aiConfig = localStorage.getItem(STORAGE_KEYS.aiConfig);
    if (aiConfig) {
      stored.aiConfig = JSON.parse(aiConfig);
      // API key is intentionally NOT restored from storage
      // For security: user must re-enter API key each session
    }

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

    // Load custom palette colors
    const customPaletteRaw = localStorage.getItem(STORAGE_KEYS.customPalette);
    if (customPaletteRaw) stored.customPalette = JSON.parse(customPaletteRaw);

    // Load favorites & custom palettes
    const favorites = localStorage.getItem(STORAGE_KEYS.favoritePresets);
    if (favorites) stored.favoritePresets = JSON.parse(favorites);

    const savedPalettes = localStorage.getItem(STORAGE_KEYS.savedPalettes);
    if (savedPalettes) stored.savedPalettes = JSON.parse(savedPalettes);

    dispatch({ type: "LOAD_STATE", payload: stored });
  }, []);

  const setAIProvider = useCallback((provider: AIProvider) => {
    dispatch({ type: "SET_AI_PROVIDER", payload: provider });
  }, []);

  const testConnection = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch(apiPath("/api/test-connection"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state.aiConfig),
      });

      const data = await response.json();
      dispatch({ type: "SET_CONNECTION_STATUS", payload: data.success });
      if (data.success) {
        toast.success("Connected to AI provider");
      } else {
        toast.error(data.error || "Connection failed");
      }
      return data.success;
    } catch {
      dispatch({ type: "SET_CONNECTION_STATUS", payload: false });
      toast.error("Connection failed");
      return false;
    }
  }, [state.aiConfig]);

  const loadModels = useCallback(async () => {
    try {
      const response = await fetch(apiPath("/api/list-models"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseUrl: state.aiConfig.baseUrl,
          provider: state.aiConfig.provider,
          apiKey: state.aiConfig.apiKey,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        let message = "Failed to load models";
        try {
          const parsed = JSON.parse(errorBody);
          message = parsed?.error?.message || parsed?.error || message;
        } catch {
          if (errorBody) message = errorBody;
        }
        toast.error(message);
        return;
      }

      const data = await response.json();
      if (data.success && data.models) {
        const models = data.models.map((m: { name: string }) => m.name || m);
        dispatch({
          type: "SET_AVAILABLE_MODELS",
          payload: models,
        });
        if (models.length > 0) {
          toast.success(`Models loaded (${models.length})`);
        } else {
          toast.message("No models returned");
        }
      } else {
        toast.error(data.error || "Failed to load models");
      }
    } catch {
      toast.error("Failed to load models");
    }
  }, [state.aiConfig]);

  const generateCV = useCallback(async () => {
    if (!state.jobContext.trim()) return;

    dispatch({ type: "SET_GENERATING", payload: true });
    dispatch({
      type: "SET_GENERATION_STATUS",
      payload: "Starting generation...",
    });
    dispatch({ type: "SET_GENERATION_CHUNKS", payload: 0 });

    const controller = new AbortController();
    generationAbortRef.current = controller;

    try {
      const response = await fetch(apiPath("/api/generate-cv"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          cvData: state.cvData,
          context: state.jobContext,
          outputLanguage: state.outputLanguage,
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
        let message = "Generation failed";
        try {
          const parsed = JSON.parse(errorBody);
          message = parsed?.error || message;
        } catch {
          if (errorBody) message = errorBody;
        }
        throw new Error(message);
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
            if (data.status === "generating") {
              dispatch({
                type: "SET_GENERATION_STATUS",
                payload: "Generating optimized CV...",
              });
            } else if (data.status === "progress") {
              const chunks = Number(data.chunks || 0);
              dispatch({ type: "SET_GENERATION_CHUNKS", payload: chunks });
              dispatch({
                type: "SET_GENERATION_STATUS",
                payload: `Processing... (${chunks} chunks)`,
              });
            } else if (data.status === "done" && data.content) {
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
      dispatch({
        type: "SET_GENERATION_STATUS",
        payload: "Generation complete.",
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
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          dispatch({
            type: "SET_GENERATION_STATUS",
            payload: "Generation cancelled.",
          });
          toast.message("Generation cancelled");
        } else {
          dispatch({
            type: "SET_GENERATION_STATUS",
            payload: error.message || "Generation failed",
          });
          toast.error(error.message || "Generation failed");
        }
      } else {
        dispatch({
          type: "SET_GENERATION_STATUS",
          payload: "Generation failed",
        });
        toast.error("Generation failed");
      }
    } finally {
      dispatch({ type: "SET_GENERATING", payload: false });
      generationAbortRef.current = null;
    }
  }, [
    state.cvData,
    state.jobContext,
    state.outputLanguage,
    state.aiConfig,
    state.selectedTemplate,
  ]);

  const applyGeneratedData = useCallback(() => {
    dispatch({ type: "APPLY_GENERATED" });
  }, []);

  const cancelGeneration = useCallback(() => {
    const controller = generationAbortRef.current;
    if (!controller) return;
    if (controller.signal.aborted) {
      generationAbortRef.current = null;
      return;
    }
    dispatch({ type: "SET_GENERATION_STATUS", payload: "Cancelling..." });
    try {
      controller.abort();
    } catch {
      // Ignore abort errors
    } finally {
      generationAbortRef.current = null;
    }
  }, []);

  const importFromLinkedIn = useCallback(
    async (file: File) => {
      dispatch({ type: "SET_IMPORTING_LINKEDIN", payload: true });
      dispatch({
        type: "SET_LINKEDIN_IMPORT_STATUS",
        payload: "Extracting text from PDF\u2026",
      });

      const controller = new AbortController();
      linkedInAbortRef.current = controller;

      try {
        const formData = new FormData();
        formData.append("pdf", file);
        formData.append("baseUrl", state.aiConfig.baseUrl);
        formData.append("model", state.aiConfig.model);
        formData.append("provider", state.aiConfig.provider);
        if (state.aiConfig.apiKey) {
          formData.append("apiKey", state.aiConfig.apiKey);
        }

        const response = await fetch(apiPath("/api/parse-linkedin-pdf"), {
          method: "POST",
          body: formData,
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorBody = await response.text();
          console.error("LinkedIn import failed:", response.status, errorBody);
          let message = "Import failed";
          try {
            const parsed = JSON.parse(errorBody);
            message = parsed?.error || message;
          } catch {
            if (errorBody && errorBody.length < 200) message = errorBody;
          }
          throw new Error(message);
        }

        // Read SSE stream
        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let buffer = "";
        let importedData: CVData | null = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const messages = buffer.split("\n\n");
          buffer = messages.pop() || "";

          for (const msg of messages) {
            const line = msg.trim();
            if (!line.startsWith("data: ")) continue;
            try {
              const data = JSON.parse(line.slice(6));
              if (data.status === "extracting") {
                dispatch({
                  type: "SET_LINKEDIN_IMPORT_STATUS",
                  payload: "AI is analyzing your LinkedIn profile\u2026",
                });
              } else if (data.status === "progress") {
                dispatch({
                  type: "SET_LINKEDIN_IMPORT_STATUS",
                  payload: `Structuring CV data\u2026 (${data.chunks} chunks)`,
                });
              } else if (data.status === "done" && data.cvData) {
                importedData = data.cvData as CVData;
              } else if (data.status === "error") {
                throw new Error(data.error || "Failed to parse LinkedIn data");
              }
            } catch (e) {
              if (
                e instanceof Error &&
                e.message !== "Import failed" &&
                !e.message.includes("Failed to parse")
              ) {
                // JSON parse error, skip
              } else {
                throw e;
              }
            }
          }
        }

        // Process remaining buffer
        if (buffer.trim()) {
          const line = buffer.trim();
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.status === "done" && data.cvData) {
                importedData = data.cvData as CVData;
              }
            } catch {
              // skip
            }
          }
        }

        if (importedData) {
          dispatch({ type: "SET_CV_DATA", payload: importedData });
          dispatch({
            type: "SET_LINKEDIN_IMPORT_STATUS",
            payload: "Import complete!",
          });
          toast.success("LinkedIn profile imported successfully");
          console.log("[cv-store] LinkedIn import successful");
        } else {
          throw new Error("No structured data received from parser");
        }
      } catch (error) {
        console.error("LinkedIn import error:", error);
        if (error instanceof Error && error.name === "AbortError") {
          dispatch({
            type: "SET_LINKEDIN_IMPORT_STATUS",
            payload: "Import cancelled.",
          });
          toast.message("LinkedIn import cancelled");
        } else {
          const msg = error instanceof Error ? error.message : "Import failed";
          dispatch({
            type: "SET_LINKEDIN_IMPORT_STATUS",
            payload: `Error: ${msg}`,
          });
          toast.error(msg);
        }
      } finally {
        linkedInAbortRef.current = null;
        // Keep status visible briefly, then clear
        setTimeout(() => {
          dispatch({ type: "SET_IMPORTING_LINKEDIN", payload: false });
        }, 2000);
      }
    },
    [state.aiConfig],
  );

  const cancelLinkedInImport = useCallback(() => {
    const controller = linkedInAbortRef.current;
    if (!controller) return;
    if (controller.signal.aborted) {
      linkedInAbortRef.current = null;
      return;
    }
    dispatch({
      type: "SET_LINKEDIN_IMPORT_STATUS",
      payload: "Cancelling...",
    });
    try {
      controller.abort();
    } catch {
      // Ignore abort errors
    } finally {
      linkedInAbortRef.current = null;
    }
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
        cancelGeneration,
        applyGeneratedData,
        importFromLinkedIn,
        cancelLinkedInImport,
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
