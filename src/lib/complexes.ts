import { queryOptions } from "@tanstack/react-query";
import { getComplexes, getComplex } from "./public-data.functions";
import type { Tables } from "@/integrations/supabase/types";

export type Complex = Tables<"complexes">;
export type Layout = Tables<"complex_layouts">;

export type ComplexFilters = { district?: string | undefined; due?: string | undefined; price_from?: string | undefined; finish?: string | undefined };
const KEYS = ["district", "due", "price_from", "finish"] as const;

export function parseComplexFilters(s: Record<string, unknown>): ComplexFilters {
  const out: ComplexFilters = {};
  for (const k of KEYS) {
    const v = s[k];
    if (typeof v === "string" && v.trim()) out[k] = v.trim();
    else if (typeof v === "number") out[k] = String(v);
  }
  return out;
}

/** due = год сдачи «до» включительно: «2026» → сдан или сдаётся не позже 2026. */
export function applyComplexFilters(rows: Complex[], f: ComplexFilters): Complex[] {
  const due = Number(f.due) || undefined;
  const pf = Number(f.price_from) || undefined;
  return rows
    .filter((c) => {
      if (f.district && c.district !== f.district) return false;
      if (f.finish && c.finish !== f.finish) return false;
      if (due && (c.completion_year == null || c.completion_year > due)) return false;
      if (pf && (c.price_from == null || c.price_from < pf)) return false;
      return true;
    })
    .sort((a, b) => (a.completion_year ?? 9999) - (b.completion_year ?? 9999) || (a.completion_quarter ?? 0) - (b.completion_quarter ?? 0));
}

export const completionLabel = (c: Pick<Complex, "completion_year" | "completion_quarter">) =>
  c.completion_year ? `${c.completion_quarter ? c.completion_quarter + " кв. " : ""}${c.completion_year}` : "[заполнить]";

export const complexImage = (c: Complex) => (Array.isArray(c.images) && typeof c.images[0] === "string" ? (c.images[0] as string).replace(/^\/images\/(hero|interior|building)\.jpg$/, "/images/$1.webp") : "/images/building.webp");

export const complexesQuery = queryOptions({
  queryKey: ["complexes"],
  queryFn: (): Promise<Complex[]> => getComplexes(),
  staleTime: 60_000,
});

export const complexQuery = (slug: string) =>
  queryOptions({
    queryKey: ["complex", slug],
    queryFn: (): Promise<{ complex: Complex; layouts: Layout[] } | null> => getComplex({ data: slug }),
  });
