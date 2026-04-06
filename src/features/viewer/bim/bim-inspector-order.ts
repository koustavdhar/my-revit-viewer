/** Keys surfaced first and visually emphasized in the BIM properties inspector. */

const BIM_HIGHLIGHT = new Set(
  [
    "name",
    "type",
    "objecttype",
    "object type",
    "tag",
    "predefinedtype",
    "predefined type",
    "globalid",
    "globallyuniqueid",
    "category",
    "material",
    "level",
    "storey",
    "elevation",
    "classification",
    "ifctype",
    "ifc type",
    "ifcclass",
    "ifc class",
  ].map((s) => s.replace(/\s+/g, "")),
);

function normKey(key: string): string {
  return key.trim().toLowerCase().replace(/\s+/g, "");
}

export function isBimPropertyHighlighted(key: string): boolean {
  const n = normKey(key);
  if (BIM_HIGHLIGHT.has(n)) return true;
  const raw = key.trim().toLowerCase();
  if (raw.includes("globalid") || raw.includes("ifctype") || raw.startsWith("ifc")) return true;
  return false;
}

/** Highlighted keys first, then remaining; each block sorted A→Z. */
export function orderBimPropertyEntries(entries: [string, string][]): [string, string][] {
  const hi = entries.filter(([k]) => isBimPropertyHighlighted(k));
  const lo = entries.filter(([k]) => !isBimPropertyHighlighted(k));
  const cmp = (a: [string, string], b: [string, string]) =>
    a[0].localeCompare(b[0], undefined, { sensitivity: "base" });
  hi.sort(cmp);
  lo.sort(cmp);
  return [...hi, ...lo];
}
