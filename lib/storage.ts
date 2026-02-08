// Import necessary types and variables
import type { CVLayout } from "./types" // Assuming CVLayout is defined in a types file
const isBrowser = typeof window !== "undefined" // Declare isBrowser variable

// Default layouts
export function getDefaultLayouts(): CVLayout[] {
  return [
    {
      id: "single",
      name: "Single Column",
      description: "Traditional single column layout",
      structure: "single",
    },
    {
      id: "sidebar-left",
      name: "Sidebar Left",
      description: "Personal info on left, content on right",
      structure: "sidebar-left",
    },
    {
      id: "sidebar-right",
      name: "Sidebar Right",
      description: "Content on left, personal info on right",
      structure: "sidebar-right",
    },
    {
      id: "split",
      name: "Split",
      description: "Two equal columns",
      structure: "split",
    },
  ]
}

// Function to load layouts from storage
export function loadLayouts(): CVLayout[] {
  if (!isBrowser) return getDefaultLayouts()
  const stored = localStorage.getItem("cv-layouts")
  return stored ? JSON.parse(stored) : getDefaultLayouts()
}

// Helper function to save layouts to storage
function saveLayouts(layouts: CVLayout[]): void {
  if (!isBrowser) return
  localStorage.setItem("cv-layouts", JSON.stringify(layouts))
}

// Function to add custom layouts
export function addLayout(layout: CVLayout): void {
  const layouts = loadLayouts()
  layouts.push(layout)
  saveLayouts(layouts)
}
