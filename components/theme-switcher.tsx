"use client"

import { Terminal, Palette, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"

type Theme = "light" | "dark" | "pastel"

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>("light")

  useEffect(() => {
    // Check localStorage for saved theme
    const savedTheme = localStorage.getItem("cv-theme") as Theme | null
    if (savedTheme) {
      applyTheme(savedTheme)
    } else {
      // Check if dark mode is preferred
      const isDarkMode = document.documentElement.classList.contains("dark")
      setTheme(isDarkMode ? "dark" : "light")
    }
  }, [])

  const applyTheme = (newTheme: Theme) => {
    // Remove all theme classes
    document.documentElement.classList.remove("dark", "pastel")

    // Apply new theme
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else if (newTheme === "pastel") {
      document.documentElement.classList.add("pastel")
    }

    setTheme(newTheme)
    localStorage.setItem("cv-theme", newTheme)
  }

  const getThemeIcon = () => {
    switch (theme) {
      case "dark":
        return <Terminal className="h-5 w-5" />
      case "pastel":
        return <Palette className="h-5 w-5" />
      default:
        return <Sun className="h-5 w-5" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-secondary">
          {getThemeIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => applyTheme("light")} className="cursor-pointer">
          <Sun className="mr-2 h-4 w-4" />
          <span>Terminal Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyTheme("dark")} className="cursor-pointer">
          <Moon className="mr-2 h-4 w-4" />
          <span>Terminal Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyTheme("pastel")} className="cursor-pointer">
          <Palette className="mr-2 h-4 w-4" />
          <span>Pastel Minimalist</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
