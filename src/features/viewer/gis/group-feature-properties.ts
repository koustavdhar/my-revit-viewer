/**
 * Group GeoJSON feature.properties for AEC-style inspection panels.
 * Unknown keys land in "Other attributes".
 */

export type PropertyGroup = {
  id: string;
  title: string;
  entries: [string, unknown][];
};

const IDENTITY = new Set([
  "id",
  "name",
  "title",
  "parcel_id",
  "feature_id",
  "fid",
  "objectid",
  "OBJECTID",
]);

const SITE = new Set([
  "land_use",
  "zoning",
  "address",
  "jurisdiction",
  "district",
  "zone",
  "parcel_number",
  "apn",
  "lot",
  "block",
]);

const METRICS = new Set([
  "acres",
  "area",
  "area_sqm",
  "sqft",
  "length",
  "perimeter",
  "width",
  "height",
]);

function normKey(key: string): string {
  return key.trim().toLowerCase();
}

/** Row-level emphasis in the feature inspector (identity + common metrics). */
export function isGisPropertyHighlighted(key: string): boolean {
  const n = normKey(key);
  return IDENTITY.has(n) || METRICS.has(n) || n === "category" || n === "type" || n === "subtype";
}

export function groupFeatureProperties(props: Record<string, unknown>): PropertyGroup[] {
  const keys = Object.keys(props);
  const used = new Set<string>();
  const groups: PropertyGroup[] = [];

  function take(
    predicate: (key: string) => boolean,
    id: string,
    title: string,
  ) {
    const entries: [string, unknown][] = [];
    for (const k of keys) {
      if (used.has(k) || !predicate(k)) continue;
      used.add(k);
      entries.push([k, props[k]]);
    }
    if (entries.length > 0) {
      groups.push({ id, title, entries });
    }
  }

  take((k) => IDENTITY.has(normKey(k)), "identity", "Identification");
  take((k) => SITE.has(normKey(k)), "site", "Site & zoning");
  take((k) => METRICS.has(normKey(k)), "metrics", "Quantities & dimensions");

  const remaining: [string, unknown][] = [];
  for (const k of keys) {
    if (!used.has(k)) remaining.push([k, props[k]]);
  }
  if (remaining.length > 0) {
    groups.push({ id: "other", title: "Other attributes", entries: remaining });
  }

  return groups;
}
