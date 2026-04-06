import type { ItemAttribute, ItemData } from "@thatopen/fragments";

function isItemAttribute(v: unknown): v is ItemAttribute {
  return typeof v === "object" && v !== null && "value" in v;
}

/**
 * Turn nested Fragments ItemData into flat key → string for the UI.
 */
export function flattenItemData(data: ItemData, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, raw] of Object.entries(data)) {
    const path = prefix ? `${prefix} › ${key}` : key;
    if (isItemAttribute(raw)) {
      const val = raw.value;
      out[path] =
        val === null || val === undefined
          ? "—"
          : typeof val === "object"
            ? JSON.stringify(val)
            : String(val);
    } else if (Array.isArray(raw)) {
      raw.forEach((entry, i) => {
        if (entry && typeof entry === "object" && !("value" in entry)) {
          Object.assign(out, flattenItemData(entry as ItemData, `${path}[${i}]`));
        }
      });
    }
  }
  return out;
}
