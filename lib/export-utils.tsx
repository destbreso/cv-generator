import type { CVData, CVTemplate } from "./types"
import { renderTemplate, convertToMarkdown } from "./template-renderer"

export function exportAsHTML(cvData: CVData, template: CVTemplate): void {
  const html = renderTemplate(template, cvData)

  const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cvData.personalInfo.name} - CV</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Courier New', monospace;
      line-height: 1.6;
      color: #1a1a1a;
      background: #f5f5f0;
      padding: 2rem;
    }
    
    .cv-modern, .cv-minimal, .cv-technical {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 3rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: #2d5016;
    }
    
    h2 {
      font-size: 1.3rem;
      margin-top: 2rem;
      margin-bottom: 1rem;
      color: #2d5016;
      border-bottom: 2px solid #2d5016;
      padding-bottom: 0.3rem;
    }
    
    h3 {
      font-size: 1.1rem;
      margin-top: 1rem;
      margin-bottom: 0.5rem;
      color: #1a1a1a;
    }
    
    p {
      margin-bottom: 0.5rem;
    }
    
    ul {
      margin-left: 1.5rem;
      margin-bottom: 1rem;
    }
    
    li {
      margin-bottom: 0.3rem;
    }
    
    .cv-header {
      margin-bottom: 2rem;
    }
    
    .contact-info {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-top: 0.5rem;
      font-size: 0.9rem;
      color: #666;
    }
    
    .cv-section {
      margin-bottom: 2rem;
    }
    
    .experience-item, .education-item, .skill-category {
      margin-bottom: 1.5rem;
    }
    
    .date-range {
      font-size: 0.9rem;
      color: #666;
      font-style: italic;
    }
    
    a {
      color: #2d5016;
      text-decoration: none;
    }
    
    a:hover {
      text-decoration: underline;
    }
    
    .links {
      display: flex;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }
    
    @media print {
      body {
        background: white;
        padding: 0;
      }
      
      .cv-modern, .cv-minimal, .cv-technical {
        box-shadow: none;
        padding: 1rem;
      }
    }
  </style>
</head>
<body>
  ${html}
</body>
</html>`

  downloadFile(fullHTML, `${cvData.personalInfo.name.replace(/\s+/g, "_")}_CV.html`, "text/html")
}

export function exportAsMarkdown(cvData: CVData): void {
  const markdown = convertToMarkdown(cvData)
  downloadFile(markdown, `${cvData.personalInfo.name.replace(/\s+/g, "_")}_CV.md`, "text/markdown")
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
