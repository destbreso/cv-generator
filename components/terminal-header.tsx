"use client"

import { Terminal } from "lucide-react"
import { ThemeSwitcher } from "./theme-switcher"

export function TerminalHeader() {
  return (
    <header className="border-b border-border bg-card transition-colors duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal className="h-6 w-6 text-primary transition-colors duration-300" />
            <div>
              <h1 className="text-xl font-bold text-foreground transition-colors duration-300">CV Generator</h1>
              <p className="text-xs text-muted-foreground transition-colors duration-300">
                $ generate --resume --optimize
              </p>
            </div>
          </div>

          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
}
