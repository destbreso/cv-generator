/**
 * Storage Manager Utility
 *
 * Provides fine-grained control and transparency over all localStorage data
 * used by the CV Generator application.
 */

// ─── Storage Key Registry ────────────────────────────────────────────────────
// All known localStorage keys used by the app, with metadata.

export interface StorageKeyInfo {
  key: string;
  label: string;
  description: string;
  category: "cv-data" | "ai-config" | "templates" | "preferences" | "history";
  critical: boolean; // If true, deleting may break the app flow
}

export const STORAGE_REGISTRY: StorageKeyInfo[] = [
  // CV Data
  {
    key: "cv-data",
    label: "CV Data",
    description:
      "Your personal information, experience, education, skills, and projects.",
    category: "cv-data",
    critical: true,
  },
  {
    key: "cv_data",
    label: "CV Data (legacy)",
    description:
      "Legacy storage key for CV data. May contain older saved data.",
    category: "cv-data",
    critical: false,
  },

  // AI Configuration
  {
    key: "ai-config",
    label: "AI Configuration",
    description: "LLM provider, model, base URL, and system prompt settings.",
    category: "ai-config",
    critical: false,
  },
  {
    key: "llm_config",
    label: "LLM Config (legacy)",
    description: "Legacy storage key for LLM configuration.",
    category: "ai-config",
    critical: false,
  },

  // Iterations / History
  {
    key: "cv-iterations",
    label: "Generation History",
    description: "All AI-generated CV versions and their metadata.",
    category: "history",
    critical: false,
  },
  {
    key: "cv_iterations",
    label: "Generation History (legacy)",
    description: "Legacy storage key for CV iterations.",
    category: "history",
    critical: false,
  },

  // Template & Customization
  {
    key: "cv-template",
    label: "Selected Template",
    description: "The currently active template object.",
    category: "templates",
    critical: false,
  },
  {
    key: "cv-customization",
    label: "Template Customization",
    description: "Custom styling overrides for the selected template.",
    category: "templates",
    critical: false,
  },
  {
    key: "cv-template-id",
    label: "Template ID",
    description: "The ID of the currently selected template.",
    category: "preferences",
    critical: false,
  },
  {
    key: "cv-palette-id",
    label: "Color Palette ID",
    description: "The ID of the currently selected color palette.",
    category: "preferences",
    critical: false,
  },
  {
    key: "cv-layout-id",
    label: "Layout ID",
    description: "The ID of the currently selected layout style.",
    category: "preferences",
    critical: false,
  },
  {
    key: "cv_templates",
    label: "Templates (legacy)",
    description: "Legacy storage key for template definitions.",
    category: "templates",
    critical: false,
  },
  {
    key: "cv_current_template",
    label: "Current Template (legacy)",
    description: "Legacy storage key for current template ID.",
    category: "templates",
    critical: false,
  },
  {
    key: "cv-layouts",
    label: "Custom Layouts",
    description: "Saved layout configurations.",
    category: "templates",
    critical: false,
  },
  {
    key: "cv_layouts",
    label: "Custom Layouts (legacy)",
    description: "Legacy storage key for layout definitions.",
    category: "templates",
    critical: false,
  },
  {
    key: "cv_current_layout",
    label: "Current Layout (legacy)",
    description: "Legacy storage key for current layout ID.",
    category: "templates",
    critical: false,
  },

  // Preferences
  {
    key: "theme",
    label: "Theme",
    description: "Application theme preference (light/dark/system).",
    category: "preferences",
    critical: false,
  },
];

// ─── Storage Item ────────────────────────────────────────────────────────────

export interface StorageItem extends StorageKeyInfo {
  exists: boolean;
  sizeBytes: number;
  sizeFormatted: string;
  preview: string;
  rawValue: string | null;
  lastModified?: string; // We can't track this natively, but we can show the data
}

// ─── Utility Functions ───────────────────────────────────────────────────────

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

/**
 * Get the byte size of a string (UTF-8)
 */
function getStringByteSize(str: string): number {
  return new Blob([str]).size;
}

/**
 * Generate a safe preview of a stored value
 */
function generatePreview(value: string | null, maxLen: number = 120): string {
  if (!value) return "—";
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === "string") return parsed.slice(0, maxLen);
    if (Array.isArray(parsed)) return `Array with ${parsed.length} items`;
    if (typeof parsed === "object" && parsed !== null) {
      const keys = Object.keys(parsed);
      return `Object { ${keys.slice(0, 5).join(", ")}${keys.length > 5 ? ", ..." : ""} }`;
    }
    return String(parsed).slice(0, maxLen);
  } catch {
    return value.slice(0, maxLen);
  }
}

/**
 * Scan localStorage for all known CV Generator keys and return their status
 */
export function scanStorage(): StorageItem[] {
  if (typeof window === "undefined") return [];

  return STORAGE_REGISTRY.map((info) => {
    const rawValue = localStorage.getItem(info.key);
    const exists = rawValue !== null;
    const sizeBytes = exists ? getStringByteSize(rawValue!) : 0;

    return {
      ...info,
      exists,
      sizeBytes,
      sizeFormatted: formatBytes(sizeBytes),
      preview: generatePreview(rawValue),
      rawValue,
    };
  });
}

/**
 * Scan for any unknown localStorage keys not in the registry
 * (from other apps or leftover data)
 */
export function scanUnknownKeys(): StorageItem[] {
  if (typeof window === "undefined") return [];

  const knownKeys = new Set(STORAGE_REGISTRY.map((k) => k.key));
  const unknownItems: StorageItem[] = [];

  // Also detect dynamic keys like template_customization_*
  const dynamicPrefixes = ["template_customization_"];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    if (knownKeys.has(key)) continue;

    const isDynamic = dynamicPrefixes.some((prefix) => key.startsWith(prefix));
    const rawValue = localStorage.getItem(key);
    const sizeBytes = rawValue ? getStringByteSize(rawValue) : 0;

    unknownItems.push({
      key,
      label: isDynamic
        ? `Template Customization (${key.replace("template_customization_", "")})`
        : key,
      description: isDynamic
        ? "Per-template customization overrides."
        : "Key not recognized by CV Generator. May belong to another app or be leftover data.",
      category: isDynamic ? "templates" : "preferences",
      critical: false,
      exists: true,
      sizeBytes,
      sizeFormatted: formatBytes(sizeBytes),
      preview: generatePreview(rawValue),
      rawValue,
    });
  }

  return unknownItems;
}

/**
 * Get total storage usage summary
 */
export interface StorageSummary {
  totalKeys: number;
  totalSize: number;
  totalSizeFormatted: string;
  byCategory: Record<
    string,
    { count: number; size: number; sizeFormatted: string }
  >;
  quotaUsedPercent: number | null;
}

export function getStorageSummary(): StorageSummary {
  if (typeof window === "undefined") {
    return {
      totalKeys: 0,
      totalSize: 0,
      totalSizeFormatted: "0 B",
      byCategory: {},
      quotaUsedPercent: null,
    };
  }

  const knownItems = scanStorage().filter((item) => item.exists);
  const unknownItems = scanUnknownKeys();
  const allItems = [...knownItems, ...unknownItems];

  const totalSize = allItems.reduce((acc, item) => acc + item.sizeBytes, 0);

  const byCategory: Record<
    string,
    { count: number; size: number; sizeFormatted: string }
  > = {};
  for (const item of allItems) {
    if (!byCategory[item.category]) {
      byCategory[item.category] = { count: 0, size: 0, sizeFormatted: "0 B" };
    }
    byCategory[item.category].count += 1;
    byCategory[item.category].size += item.sizeBytes;
    byCategory[item.category].sizeFormatted = formatBytes(
      byCategory[item.category].size,
    );
  }

  // Estimate quota usage (~5MB typical limit)
  const estimatedQuota = 5 * 1024 * 1024; // 5MB
  const quotaUsedPercent = (totalSize / estimatedQuota) * 100;

  return {
    totalKeys: allItems.length,
    totalSize,
    totalSizeFormatted: formatBytes(totalSize),
    byCategory,
    quotaUsedPercent: Math.round(quotaUsedPercent * 100) / 100,
  };
}

/**
 * Delete a specific storage key
 */
export function deleteStorageKey(key: string): boolean {
  if (typeof window === "undefined") return false;
  localStorage.removeItem(key);
  return true;
}

/**
 * Delete multiple storage keys
 */
export function deleteStorageKeys(keys: string[]): number {
  if (typeof window === "undefined") return 0;
  let count = 0;
  for (const key of keys) {
    localStorage.removeItem(key);
    count++;
  }
  return count;
}

/**
 * Delete all CV Generator storage keys (known + dynamic)
 */
export function clearAllCVStorage(): number {
  if (typeof window === "undefined") return 0;

  const knownKeys = STORAGE_REGISTRY.map((k) => k.key);
  const dynamicKeys: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("template_customization_")) {
      dynamicKeys.push(key);
    }
  }

  const allKeys = [...knownKeys, ...dynamicKeys];
  return deleteStorageKeys(allKeys);
}

/**
 * Export all CV Generator data as a JSON file
 */
export function exportAllData(): string {
  if (typeof window === "undefined") return "{}";

  const knownItems = scanStorage().filter((item) => item.exists);
  const unknownItems = scanUnknownKeys();
  const allItems = [...knownItems, ...unknownItems];

  const exportData: Record<string, unknown> = {};
  for (const item of allItems) {
    try {
      exportData[item.key] = item.rawValue ? JSON.parse(item.rawValue) : null;
    } catch {
      exportData[item.key] = item.rawValue;
    }
  }

  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      appName: "CV Generator",
      version: "1.0.0",
      data: exportData,
    },
    null,
    2,
  );
}

/**
 * Import data from a previously exported JSON file
 */
export function importData(jsonString: string): {
  imported: number;
  errors: string[];
} {
  if (typeof window === "undefined")
    return { imported: 0, errors: ["Window not available"] };

  const errors: string[] = [];
  let imported = 0;

  try {
    const parsed = JSON.parse(jsonString);
    const data = parsed.data || parsed;

    if (typeof data !== "object" || data === null) {
      return { imported: 0, errors: ["Invalid data format"] };
    }

    for (const [key, value] of Object.entries(data)) {
      try {
        const serialized =
          typeof value === "string" ? value : JSON.stringify(value);
        localStorage.setItem(key, serialized);
        imported++;
      } catch (e) {
        errors.push(`Failed to import key "${key}": ${e}`);
      }
    }
  } catch (e) {
    errors.push(`Failed to parse JSON: ${e}`);
  }

  return { imported, errors };
}

/**
 * Category display metadata
 */
export const CATEGORY_META: Record<
  string,
  { label: string; icon: string; color: string }
> = {
  "cv-data": {
    label: "CV Data",
    icon: "FileText",
    color: "text-blue-500",
  },
  "ai-config": {
    label: "AI Configuration",
    icon: "Bot",
    color: "text-purple-500",
  },
  templates: {
    label: "Templates & Styling",
    icon: "Palette",
    color: "text-pink-500",
  },
  preferences: {
    label: "Preferences",
    icon: "Settings",
    color: "text-orange-500",
  },
  history: {
    label: "Generation History",
    icon: "History",
    color: "text-green-500",
  },
};
