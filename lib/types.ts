export interface CVData {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
    website?: string
    linkedin?: string
    github?: string
  }
  summary: string
  experience: Array<{
    id: string
    company: string
    position: string
    startDate: string
    endDate: string
    description: string
    achievements: string[]
  }>
  education: Array<{
    id: string
    institution: string
    degree: string
    field: string
    startDate: string
    endDate: string
    gpa?: string
  }>
  skills: Array<{
    id: string
    category: string
    items: string[]
  }>
  projects: Array<{
    id: string
    name: string
    description: string
    technologies: string[]
    url?: string
  }>
  certifications: Array<{
    id: string
    name: string
    issuer: string
    date: string
    url?: string
  }>
}

export interface CVTemplate {
  id: string
  name: string
  description: string
  thumbnail?: string
  content: string // HTML template with placeholders
}

export interface CVIteration {
  id: string
  timestamp: number
  cvData: CVData
  context: string
  templateId: string
  generatedContent: string
}

export interface LLMConfig {
  endpoint: string
  model: string
  apiKey?: string
}
