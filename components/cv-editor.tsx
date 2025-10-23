"use client"

import { useState, useEffect } from "react"
import type { CVData } from "@/lib/types"
import { saveCVData, loadCVData } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Plus, Trash2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const defaultCVData: CVData = {
  personalInfo: {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    website: "https://johndoe.dev",
    linkedin: "https://linkedin.com/in/johndoe",
    github: "https://github.com/johndoe",
  },
  summary: "Experienced software engineer with a passion for building scalable applications.",
  experience: [
    {
      id: "1",
      company: "Tech Corp",
      position: "Senior Software Engineer",
      startDate: "2020-01",
      endDate: "Present",
      description: "Leading development of cloud-native applications",
      achievements: ["Improved system performance by 40%", "Mentored 5 junior developers"],
    },
  ],
  education: [
    {
      id: "1",
      institution: "University of Technology",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "2012",
      endDate: "2016",
    },
  ],
  skills: [
    {
      id: "1",
      category: "Programming Languages",
      items: ["JavaScript", "TypeScript", "Python", "Go"],
    },
    {
      id: "2",
      category: "Frameworks",
      items: ["React", "Next.js", "Node.js", "Express"],
    },
  ],
  projects: [],
  certifications: [],
}

interface CVEditorProps {
  onDataChange: (data: CVData) => void
}

export function CVEditor({ onDataChange }: CVEditorProps) {
  const [cvData, setCVData] = useState<CVData>(defaultCVData)
  const { toast } = useToast()

  useEffect(() => {
    const loaded = loadCVData()
    if (loaded) {
      setCVData(loaded)
      onDataChange(loaded)
    } else {
      onDataChange(defaultCVData)
    }
  }, [])

  const handleSave = () => {
    saveCVData(cvData)
    onDataChange(cvData)
    toast({
      title: "> Data saved",
      description: "CV data has been saved to local storage",
    })
  }

  const updatePersonalInfo = (field: keyof CVData["personalInfo"], value: string) => {
    setCVData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }))
  }

  const addExperience = () => {
    setCVData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now().toString(),
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
          achievements: [],
        },
      ],
    }))
  }

  const removeExperience = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }))
  }

  const updateExperience = (id: string, field: string, value: string | string[]) => {
    setCVData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    }))
  }

  const addSkillCategory = () => {
    setCVData((prev) => ({
      ...prev,
      skills: [
        ...prev.skills,
        {
          id: Date.now().toString(),
          category: "",
          items: [],
        },
      ],
    }))
  }

  const removeSkillCategory = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill.id !== id),
    }))
  }

  const updateSkillCategory = (id: string, field: string, value: string | string[]) => {
    setCVData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill) => (skill.id === id ? { ...skill, [field]: value } : skill)),
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">{">"} Edit CV Data</h2>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save
        </Button>
      </div>

      <Card className="p-4 space-y-4 bg-card border-border">
        <h3 className="font-bold text-primary">{">"} Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Name"
            value={cvData.personalInfo.name}
            onChange={(e) => updatePersonalInfo("name", e.target.value)}
            className="bg-input border-border"
          />
          <Input
            placeholder="Email"
            value={cvData.personalInfo.email}
            onChange={(e) => updatePersonalInfo("email", e.target.value)}
            className="bg-input border-border"
          />
          <Input
            placeholder="Phone"
            value={cvData.personalInfo.phone}
            onChange={(e) => updatePersonalInfo("phone", e.target.value)}
            className="bg-input border-border"
          />
          <Input
            placeholder="Location"
            value={cvData.personalInfo.location}
            onChange={(e) => updatePersonalInfo("location", e.target.value)}
            className="bg-input border-border"
          />
          <Input
            placeholder="Website (optional)"
            value={cvData.personalInfo.website || ""}
            onChange={(e) => updatePersonalInfo("website", e.target.value)}
            className="bg-input border-border"
          />
          <Input
            placeholder="LinkedIn (optional)"
            value={cvData.personalInfo.linkedin || ""}
            onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
            className="bg-input border-border"
          />
          <Input
            placeholder="GitHub (optional)"
            value={cvData.personalInfo.github || ""}
            onChange={(e) => updatePersonalInfo("github", e.target.value)}
            className="bg-input border-border"
          />
        </div>
      </Card>

      <Card className="p-4 space-y-4 bg-card border-border">
        <h3 className="font-bold text-primary">{">"} Summary</h3>
        <Textarea
          placeholder="Professional summary..."
          value={cvData.summary}
          onChange={(e) => setCVData((prev) => ({ ...prev, summary: e.target.value }))}
          rows={4}
          className="bg-input border-border"
        />
      </Card>

      <Card className="p-4 space-y-4 bg-card border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-primary">{">"} Experience</h3>
          <Button onClick={addExperience} size="sm" variant="outline" className="gap-2 bg-transparent">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
        {cvData.experience.map((exp) => (
          <div key={exp.id} className="space-y-3 p-3 border border-border rounded bg-secondary/50">
            <div className="flex justify-end">
              <Button
                onClick={() => removeExperience(exp.id)}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Company"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                className="bg-input border-border"
              />
              <Input
                placeholder="Position"
                value={exp.position}
                onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                className="bg-input border-border"
              />
              <Input
                placeholder="Start Date (YYYY-MM)"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                className="bg-input border-border"
              />
              <Input
                placeholder="End Date (YYYY-MM or Present)"
                value={exp.endDate}
                onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                className="bg-input border-border"
              />
            </div>
            <Textarea
              placeholder="Description"
              value={exp.description}
              onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
              rows={3}
              className="bg-input border-border"
            />
            <Textarea
              placeholder="Achievements (one per line)"
              value={exp.achievements.join("\n")}
              onChange={(e) => updateExperience(exp.id, "achievements", e.target.value.split("\n"))}
              rows={3}
              className="bg-input border-border"
            />
          </div>
        ))}
      </Card>

      <Card className="p-4 space-y-4 bg-card border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-primary">{">"} Skills</h3>
          <Button onClick={addSkillCategory} size="sm" variant="outline" className="gap-2 bg-transparent">
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>
        {cvData.skills.map((skill) => (
          <div key={skill.id} className="space-y-3 p-3 border border-border rounded bg-secondary/50">
            <div className="flex justify-end">
              <Button
                onClick={() => removeSkillCategory(skill.id)}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Input
              placeholder="Category (e.g., Programming Languages)"
              value={skill.category}
              onChange={(e) => updateSkillCategory(skill.id, "category", e.target.value)}
              className="bg-input border-border"
            />
            <Textarea
              placeholder="Skills (comma-separated)"
              value={skill.items.join(", ")}
              onChange={(e) =>
                updateSkillCategory(
                  skill.id,
                  "items",
                  e.target.value.split(",").map((s) => s.trim()),
                )
              }
              rows={2}
              className="bg-input border-border"
            />
          </div>
        ))}
      </Card>
    </div>
  )
}
