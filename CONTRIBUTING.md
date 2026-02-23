# Contributing to CV Generator

Thank you for your interest in contributing! This guide will help you get started. Please also review our [Code of Conduct](CODE_OF_CONDUCT.md) to keep our community respectful and welcoming.\n

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

## � Reporting Bugs

Found a bug? Please open an issue using our [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md). Include:\n- Steps to reproduce\n- Expected vs actual behavior\n- Browser and OS info\n- Screenshots if applicable\n\n## 💡 Requesting Features\n\nHave an idea? Please open an issue using our [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md). Describe:\n- The problem you're trying to solve\n- Your proposed solution\n- Alternatives you've considered\n\n## �📋 Guidelines

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

By contributing to CV Generator, you agree that your contributions will be licensed under its [MIT License](LICENSE).

## 🤝 Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the maintainers.

## 🔒 Security

For security concerns, please do not open a public issue. Instead, email **dev.destbreso@gmail.com** with details. See [SECURITY.md](SECURITY.md) for our full security policy.

By contributing, you agree that your contributions will be licensed under the MIT License.
