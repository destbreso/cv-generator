# Contributing to CV Generator

Thank you for your interest in contributing! This guide will help you get started.

## 🚀 Quick Start

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/destbreso/cv-generator.git
   cd cv-generator
   ```
3. **Install** dependencies:
   ```bash
   pnpm install
   ```
4. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feat/your-feature-name
   ```
5. **Start** the dev server:
   ```bash
   pnpm dev
   ```

## 📋 Guidelines

### Code Style
- TypeScript strict mode
- Functional components with hooks
- Use `cn()` utility for conditional class names
- Follow existing naming conventions (kebab-case files, PascalCase components)
- Prefer composition over inheritance

### Commits
- Use clear, descriptive commit messages
- Prefix with type: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`
- Keep commits focused and atomic

### Pull Requests
- Fill out the PR template
- Reference related issues
- Include screenshots for UI changes
- Ensure no TypeScript errors (`pnpm lint`)
- Test across Light and Dark themes

## 🧩 Adding a Template

1. Add a new entry to `TEMPLATES` in `lib/cv-store.tsx`:
   ```ts
   {
     id: "your-template",
     name: "Your Template",
     description: "Brief description",
     preview: "bg-gradient-to-br from-... to-...",
   }
   ```

2. Add matching styles in `getTemplateStyles()` in `components/panels/preview-panel.tsx`:
   ```ts
   "your-template": {
     headerStyle: "text-center",
     sectionTitleStyle: "text-sm font-bold uppercase tracking-widest",
     bodyFont: "font-serif",
     headerFont: "font-serif",
     borderStyle: "border-b",
     chipStyle: "text-xs",
     headerLayout: "center",
     accentBar: false,
   }
   ```

## 🎨 Adding a Color Palette

Add a new entry to `COLOR_PALETTES` in `lib/cv-store.tsx`:
```ts
{
  id: "your-palette",
  name: "Your Palette",
  colors: { primary: "#...", secondary: "#...", accent: "#..." },
}
```

## 🐛 Reporting Bugs

Open an issue with:
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS info
- Screenshots if applicable

## 💡 Feature Requests

Open an issue with the `enhancement` label describing:
- The problem you're trying to solve
- Your proposed solution
- Any alternatives you've considered

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.
