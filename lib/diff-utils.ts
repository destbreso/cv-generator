export interface DiffLine {
  type: "added" | "removed" | "unchanged"
  content: string
  lineNumber?: number
}

export interface DiffSection {
  field: string
  oldValue: string
  newValue: string
  lines: DiffLine[]
}

export function generateDiff(oldData: any, newData: any, path = ""): DiffSection[] {
  const sections: DiffSection[] = []

  if (typeof oldData === "string" && typeof newData === "string") {
    if (oldData !== newData) {
      const lines = computeLineDiff(oldData, newData)
      sections.push({
        field: path,
        oldValue: oldData,
        newValue: newData,
        lines,
      })
    }
    return sections
  }

  if (Array.isArray(oldData) && Array.isArray(newData)) {
    const maxLength = Math.max(oldData.length, newData.length)
    for (let i = 0; i < maxLength; i++) {
      const oldItem = oldData[i]
      const newItem = newData[i]

      if (!oldItem && newItem) {
        sections.push({
          field: `${path}[${i}]`,
          oldValue: "",
          newValue: JSON.stringify(newItem, null, 2),
          lines: [{ type: "added", content: JSON.stringify(newItem, null, 2) }],
        })
      } else if (oldItem && !newItem) {
        sections.push({
          field: `${path}[${i}]`,
          oldValue: JSON.stringify(oldItem, null, 2),
          newValue: "",
          lines: [{ type: "removed", content: JSON.stringify(oldItem, null, 2) }],
        })
      } else if (oldItem && newItem) {
        sections.push(...generateDiff(oldItem, newItem, `${path}[${i}]`))
      }
    }
    return sections
  }

  if (typeof oldData === "object" && typeof newData === "object" && oldData !== null && newData !== null) {
    const allKeys = new Set([...Object.keys(oldData), ...Object.keys(newData)])

    for (const key of allKeys) {
      const oldValue = oldData[key]
      const newValue = newData[key]
      const fieldPath = path ? `${path}.${key}` : key

      if (oldValue === undefined && newValue !== undefined) {
        sections.push({
          field: fieldPath,
          oldValue: "",
          newValue: typeof newValue === "object" ? JSON.stringify(newValue, null, 2) : String(newValue),
          lines: [
            {
              type: "added",
              content: typeof newValue === "object" ? JSON.stringify(newValue, null, 2) : String(newValue),
            },
          ],
        })
      } else if (oldValue !== undefined && newValue === undefined) {
        sections.push({
          field: fieldPath,
          oldValue: typeof oldValue === "object" ? JSON.stringify(oldValue, null, 2) : String(oldValue),
          newValue: "",
          lines: [
            {
              type: "removed",
              content: typeof oldValue === "object" ? JSON.stringify(oldValue, null, 2) : String(oldValue),
            },
          ],
        })
      } else if (oldValue !== newValue) {
        sections.push(...generateDiff(oldValue, newValue, fieldPath))
      }
    }
    return sections
  }

  return sections
}

function computeLineDiff(oldText: string, newText: string): DiffLine[] {
  const oldLines = oldText.split("\n")
  const newLines = newText.split("\n")
  const lines: DiffLine[] = []

  // Simple line-by-line diff
  const maxLength = Math.max(oldLines.length, newLines.length)

  for (let i = 0; i < maxLength; i++) {
    const oldLine = oldLines[i]
    const newLine = newLines[i]

    if (oldLine === newLine) {
      lines.push({ type: "unchanged", content: oldLine || "", lineNumber: i + 1 })
    } else {
      if (oldLine !== undefined) {
        lines.push({ type: "removed", content: oldLine, lineNumber: i + 1 })
      }
      if (newLine !== undefined) {
        lines.push({ type: "added", content: newLine, lineNumber: i + 1 })
      }
    }
  }

  return lines
}

export function formatFieldName(field: string): string {
  return field
    .replace(/\[(\d+)\]/g, " #$1")
    .replace(/\./g, " > ")
    .replace(/([A-Z])/g, " $1")
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
