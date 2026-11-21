import { leadSchema, type LEAD_TYPES } from "./lead-schema";
import { leadAttribution } from "./lead-attribution";
import { saveLead } from "./leads.functions";
import { metrikaGoal } from "./metrika";

export type LeadKind = "valuation" | "complex_selection" | "rent" | "let" | "general";

export type LeadType = (typeof LEAD_TYPES)[number];
export const LEAD_SUCCESS = "Заявка принята. Мы свяжемся с вами в рабочее время";

/** Сохраняет заявку в базу. Возвращает текст ошибки или null. */
export async function submitLead(kind: LeadKind, input: { name?: string; phone: string; consent: boolean; details?: Record<string, string>; type?: LeadType; propertyId?: string; website?: string }): Promise<string | null> {
  const details = input.details ?? {};
  const type = input.type ?? (kind === "valuation" ? "valuation" : kind === "complex_selection" || kind === "rent" ? "selection" : "question");
  const budget = (details["budget"] ?? "").replace(/\s/g, "").replace(",", ".");
  const r = leadSchema.safeParse({ ...leadAttribution(), ...input, kind, type, details,
    property_id: input.propertyId ?? null, message: details["comment"] ?? "", budget: budget ? Number(budget) : null,
    rooms: details["rooms"] ?? "", district: details["district"] ?? "" });
  if (!r.success) return r.error.issues[0]?.message ?? "Проверьте поля";
  try {
    const result = await saveLead({ data: r.data });
    if (!result.ok) return result.error ?? "Не удалось отправить заявку.";
    window.__lovableEvents?.track?.("project.submit_lead", { type });
    metrikaGoal("submit_lead", { type });
    return null;
  } catch { return "Не удалось отправить. Попробуйте ещё раз или позвоните нам."; }
}
