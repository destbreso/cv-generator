import type { CVTemplate, CVData, TemplateCustomization, CVLayout } from "./types"

export function renderTemplate(
  template: CVTemplate,
  data: CVData,
  customization: TemplateCustomization,
  layout?: CVLayout,
): string {
  let html = template.content

  // Apply layout wrapper if provided
  if (layout) {
    html = applyLayout(html, layout, data)
  }

  // Replace placeholders with actual data
  html = html.replace(/\{\{personalInfo\.name\}\}/g, data.personalInfo.name || "")
  html = html.replace(/\{\{personalInfo\.email\}\}/g, data.personalInfo.email || "")
  html = html.replace(/\{\{personalInfo\.phone\}\}/g, data.personalInfo.phone || "")
  html = html.replace(/\{\{personalInfo\.location\}\}/g, data.personalInfo.location || "")
  html = html.replace(/\{\{personalInfo\.website\}\}/g, data.personalInfo.website || "")
  html = html.replace(/\{\{personalInfo\.linkedin\}\}/g, data.personalInfo.linkedin || "")
  html = html.replace(/\{\{personalInfo\.github\}\}/g, data.personalInfo.github || "")
  html = html.replace(/\{\{summary\}\}/g, data.summary || "")

  // Handle experience array
  html = html.replace(/\{\{#each experience\}\}([\s\S]*?)\{\{\/each\}\}/g, (_, template) => {
    return data.experience
      .map((exp) => {
        let expHtml = template
        expHtml = expHtml.replace(/\{\{company\}\}/g, exp.company)
        expHtml = expHtml.replace(/\{\{position\}\}/g, exp.position)
        expHtml = expHtml.replace(/\{\{startDate\}\}/g, exp.startDate)
        expHtml = expHtml.replace(/\{\{endDate\}\}/g, exp.endDate)
        expHtml = expHtml.replace(/\{\{description\}\}/g, exp.description)

        // Handle achievements
        expHtml = expHtml.replace(/\{\{#each achievements\}\}([\s\S]*?)\{\{\/each\}\}/g, (_, achTemplate) => {
          return exp.achievements.map((ach) => achTemplate.replace(/\{\{this\}\}/g, ach)).join("")
        })

        return expHtml
      })
      .join("")
  })

  // Handle education array
  html = html.replace(/\{\{#each education\}\}([\s\S]*?)\{\{\/each\}\}/g, (_, template) => {
    return data.education
      .map((edu) => {
        let eduHtml = template
        eduHtml = eduHtml.replace(/\{\{institution\}\}/g, edu.institution)
        eduHtml = eduHtml.replace(/\{\{degree\}\}/g, edu.degree)
        eduHtml = eduHtml.replace(/\{\{field\}\}/g, edu.field)
        eduHtml = eduHtml.replace(/\{\{startDate\}\}/g, edu.startDate)
        eduHtml = eduHtml.replace(/\{\{endDate\}\}/g, edu.endDate)
        return eduHtml
      })
      .join("")
  })

  // Handle skills array
  html = html.replace(/\{\{#each skills\}\}([\s\S]*?)\{\{\/each\}\}/g, (_, template) => {
    return data.skills
      .map((skill) => {
        let skillHtml = template
        skillHtml = skillHtml.replace(/\{\{category\}\}/g, skill.category)
        skillHtml = skillHtml.replace(/\{\{items\}\}/g, skill.items.join(", "))
        return skillHtml
      })
      .join("")
  })

  // Handle projects array
  html = html.replace(/\{\{#each projects\}\}([\s\S]*?)\{\{\/each\}\}/g, (_, template) => {
    return data.projects
      .map((project) => {
        let projectHtml = template
        projectHtml = projectHtml.replace(/\{\{name\}\}/g, project.name)
        projectHtml = projectHtml.replace(/\{\{description\}\}/g, project.description)
        projectHtml = projectHtml.replace(/\{\{technologies\}\}/g, project.technologies.join(", "))
        return projectHtml
      })
      .join("")
  })

  // Apply customization styles
  const styles = `
    <style>
      .cv-container {
        font-family: ${customization.fontFamily};
        font-size: ${customization.fontSize.base}px;
        color: ${customization.colorPalette.text};
        background: ${customization.colorPalette.background};
        padding: ${customization.spacing.section}px;
        line-height: 1.6;
      }
      .cv-header h1, .cv-container h1 {
        color: ${customization.colorPalette.primary};
        font-size: ${customization.fontSize.heading}px;
        margin-bottom: ${customization.spacing.item}px;
      }
      .cv-section, section {
        margin-bottom: ${customization.spacing.section}px;
      }
      .cv-section h2, section h2 {
        color: ${customization.colorPalette.secondary};
        font-size: ${customization.fontSize.heading * 0.7}px;
        margin-bottom: ${customization.spacing.item}px;
        border-bottom: 2px solid ${customization.colorPalette.accent};
        padding-bottom: ${customization.spacing.item / 2}px;
      }
      .experience-item, .education-item, .skill-category {
        margin-bottom: ${customization.spacing.item}px;
      }
      .experience-item h3, .education-item h3, .skill-category h3 {
        color: ${customization.colorPalette.primary};
        font-size: ${customization.fontSize.base * 1.2}px;
        margin-bottom: ${customization.spacing.item / 2}px;
      }
      .contact-info {
        color: ${customization.colorPalette.text};
        margin-bottom: ${customization.spacing.item}px;
      }
      .contact-info span {
        margin-right: ${customization.spacing.item}px;
      }
      .date-range {
        color: ${customization.colorPalette.secondary};
        font-style: italic;
        font-size: ${customization.fontSize.base * 0.9}px;
      }
      
      /* Layout-specific styles */
      .layout-sidebar-left, .layout-sidebar-right {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: ${customization.spacing.section}px;
      }
      .layout-sidebar-right {
        grid-template-columns: 1fr 300px;
      }
      .layout-split {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: ${customization.spacing.section}px;
      }
      .sidebar {
        background: ${customization.colorPalette.background};
        padding: ${customization.spacing.section}px;
        border: 1px solid ${customization.colorPalette.accent};
      }
      .main-content {
        padding: ${customization.spacing.section}px;
      }
    </style>
  `

  return styles + html
}

function applyLayout(html: string, layout: CVLayout, data: CVData): string {
  const personalInfoSection = `
    <div class="sidebar">
      <h2>Contact</h2>
      <p><strong>${data.personalInfo.name}</strong></p>
      <p>${data.personalInfo.email}</p>
      <p>${data.personalInfo.phone}</p>
      <p>${data.personalInfo.location}</p>
      ${data.personalInfo.website ? `<p><a href="${data.personalInfo.website}">${data.personalInfo.website}</a></p>` : ""}
      ${data.personalInfo.linkedin ? `<p><a href="${data.personalInfo.linkedin}">LinkedIn</a></p>` : ""}
      ${data.personalInfo.github ? `<p><a href="${data.personalInfo.github}">GitHub</a></p>` : ""}
      
      <h2>Skills</h2>
      ${data.skills
        .map(
          (skill) => `
        <div class="skill-category">
          <h3>${skill.category}</h3>
          <p>${skill.items.join(", ")}</p>
        </div>
      `,
        )
        .join("")}
    </div>
  `

  const mainContentSection = `
    <div class="main-content">
      ${html}
    </div>
  `

  switch (layout.structure) {
    case "sidebar-left":
      return `<div class="layout-sidebar-left">${personalInfoSection}${mainContentSection}</div>`
    case "sidebar-right":
      return `<div class="layout-sidebar-right">${mainContentSection}${personalInfoSection}</div>`
    case "split":
      const leftContent = html.substring(0, html.length / 2)
      const rightContent = html.substring(html.length / 2)
      return `<div class="layout-split"><div>${leftContent}</div><div>${rightContent}</div></div>`
    case "single":
    default:
      return html
  }
}

export function convertToMarkdown(data: CVData): string {
  let md = `# ${data.personalInfo.name}\n\n`
  md += `${data.personalInfo.email} | ${data.personalInfo.phone} | ${data.personalInfo.location}\n\n`

  if (data.personalInfo.website) md += `[Website](${data.personalInfo.website}) | `
  if (data.personalInfo.linkedin) md += `[LinkedIn](${data.personalInfo.linkedin}) | `
  if (data.personalInfo.github) md += `[GitHub](${data.personalInfo.github})`
  md += `\n\n---\n\n`

  md += `## Summary\n\n${data.summary}\n\n`

  md += `## Experience\n\n`
  data.experience.forEach((exp) => {
    md += `### ${exp.position} at ${exp.company}\n`
    md += `*${exp.startDate} - ${exp.endDate}*\n\n`
    md += `${exp.description}\n\n`
    if (exp.achievements.length > 0) {
      exp.achievements.forEach((ach) => {
        md += `- ${ach}\n`
      })
      md += `\n`
    }
  })

  md += `## Education\n\n`
  data.education.forEach((edu) => {
    md += `### ${edu.degree} in ${edu.field}\n`
    md += `${edu.institution} | ${edu.startDate} - ${edu.endDate}\n\n`
  })

  md += `## Skills\n\n`
  data.skills.forEach((skill) => {
    md += `**${skill.category}:** ${skill.items.join(", ")}\n\n`
  })

  if (data.projects.length > 0) {
    md += `## Projects\n\n`
    data.projects.forEach((project) => {
      md += `### ${project.name}\n`
      md += `${project.description}\n\n`
      md += `**Technologies:** ${project.technologies.join(", ")}\n\n`
    })
  }

  return md
}
