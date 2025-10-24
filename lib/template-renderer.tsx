import type { CVData, CVTemplate, TemplateCustomization } from "./types"

export function renderTemplate(template: CVTemplate, data: CVData, customization?: TemplateCustomization): string {
  let html = template.content

  // Replace simple placeholders
  html = html.replace(/\{\{personalInfo\.name\}\}/g, data.personalInfo.name)
  html = html.replace(/\{\{personalInfo\.email\}\}/g, data.personalInfo.email)
  html = html.replace(/\{\{personalInfo\.phone\}\}/g, data.personalInfo.phone)
  html = html.replace(/\{\{personalInfo\.location\}\}/g, data.personalInfo.location)
  html = html.replace(/\{\{personalInfo\.website\}\}/g, data.personalInfo.website || "")
  html = html.replace(/\{\{personalInfo\.linkedin\}\}/g, data.personalInfo.linkedin || "")
  html = html.replace(/\{\{personalInfo\.github\}\}/g, data.personalInfo.github || "")
  html = html.replace(/\{\{summary\}\}/g, data.summary)

  // Handle conditionals
  html = html.replace(/\{\{#if personalInfo\.github\}\}(.*?)\{\{\/if\}\}/gs, (_, content) => {
    return data.personalInfo.github ? content : ""
  })
  html = html.replace(/\{\{#if personalInfo\.linkedin\}\}(.*?)\{\{\/if\}\}/gs, (_, content) => {
    return data.personalInfo.linkedin ? content : ""
  })
  html = html.replace(/\{\{#if personalInfo\.website\}\}(.*?)\{\{\/if\}\}/gs, (_, content) => {
    return data.personalInfo.website ? content : ""
  })

  // Handle experience loop
  html = html.replace(/\{\{#each experience\}\}(.*?)\{\{\/each\}\}/gs, (_, itemTemplate) => {
    return data.experience
      .map((exp) => {
        let item = itemTemplate
        item = item.replace(/\{\{position\}\}/g, exp.position)
        item = item.replace(/\{\{company\}\}/g, exp.company)
        item = item.replace(/\{\{startDate\}\}/g, exp.startDate)
        item = item.replace(/\{\{endDate\}\}/g, exp.endDate)
        item = item.replace(/\{\{description\}\}/g, exp.description)

        // Handle achievements nested loop
        item = item.replace(/\{\{#each achievements\}\}(.*?)\{\{\/each\}\}/gs, (_, achTemplate) => {
          return exp.achievements.map((ach) => achTemplate.replace(/\{\{this\}\}/g, ach)).join("")
        })

        return item
      })
      .join("")
  })

  // Handle education loop
  html = html.replace(/\{\{#each education\}\}(.*?)\{\{\/each\}\}/gs, (_, itemTemplate) => {
    return data.education
      .map((edu) => {
        let item = itemTemplate
        item = item.replace(/\{\{degree\}\}/g, edu.degree)
        item = item.replace(/\{\{field\}\}/g, edu.field)
        item = item.replace(/\{\{institution\}\}/g, edu.institution)
        item = item.replace(/\{\{startDate\}\}/g, edu.startDate)
        item = item.replace(/\{\{endDate\}\}/g, edu.endDate)
        return item
      })
      .join("")
  })

  // Handle skills loop
  html = html.replace(/\{\{#each skills\}\}(.*?)\{\{\/each\}\}/gs, (_, itemTemplate) => {
    return data.skills
      .map((skill) => {
        let item = itemTemplate
        item = item.replace(/\{\{category\}\}/g, skill.category)
        item = item.replace(/\{\{items\}\}/g, skill.items.join(", "))
        return item
      })
      .join("")
  })

  // Handle projects loop
  html = html.replace(/\{\{#each projects\}\}(.*?)\{\{\/each\}\}/gs, (_, itemTemplate) => {
    return data.projects
      .map((project) => {
        let item = itemTemplate
        item = item.replace(/\{\{name\}\}/g, project.name)
        item = item.replace(/\{\{description\}\}/g, project.description)
        item = item.replace(/\{\{technologies\}\}/g, project.technologies.join(", "))
        item = item.replace(/\{\{url\}\}/g, project.url || "")
        return item
      })
      .join("")
  })

  // Apply customization if provided
  if (customization) {
    const { colorPalette, fontFamily, fontSize, spacing } = customization

    // Wrap in a styled container with customizations
    html = `
      <div style="
        font-family: ${fontFamily};
        font-size: ${fontSize.base}px;
        color: ${colorPalette.text};
        background-color: ${colorPalette.background};
      ">
        <style>
          .cv-preview h1 { 
            color: ${colorPalette.primary} !important; 
            font-size: ${fontSize.heading}px !important;
          }
          .cv-preview h2 { 
            color: ${colorPalette.primary} !important; 
            font-size: ${fontSize.heading * 0.7}px !important;
            margin-top: ${spacing.section}px !important;
            margin-bottom: ${spacing.item}px !important;
          }
          .cv-preview h3 { 
            color: ${colorPalette.secondary} !important; 
            font-size: ${fontSize.heading * 0.5}px !important;
          }
          .cv-preview p { 
            color: ${colorPalette.text} !important;
            margin-bottom: ${spacing.item}px !important;
          }
          .cv-preview a { 
            color: ${colorPalette.accent} !important; 
          }
          .cv-preview section {
            margin-bottom: ${spacing.section}px !important;
          }
          .cv-preview strong {
            color: ${colorPalette.secondary} !important;
          }
        </style>
        ${html}
      </div>
    `
  }

  return html
}

export function convertToMarkdown(data: CVData): string {
  let md = `# ${data.personalInfo.name}\n\n`
  md += `${data.personalInfo.email} | ${data.personalInfo.phone} | ${data.personalInfo.location}\n\n`

  if (data.personalInfo.website || data.personalInfo.linkedin || data.personalInfo.github) {
    if (data.personalInfo.website) md += `[Website](${data.personalInfo.website}) `
    if (data.personalInfo.linkedin) md += `[LinkedIn](${data.personalInfo.linkedin}) `
    if (data.personalInfo.github) md += `[GitHub](${data.personalInfo.github})`
    md += "\n\n"
  }

  md += `## Summary\n\n${data.summary}\n\n`

  md += `## Experience\n\n`
  data.experience.forEach((exp) => {
    md += `### ${exp.position} - ${exp.company}\n`
    md += `*${exp.startDate} - ${exp.endDate}*\n\n`
    md += `${exp.description}\n\n`
    if (exp.achievements.length > 0) {
      exp.achievements.forEach((ach) => {
        md += `- ${ach}\n`
      })
      md += "\n"
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
