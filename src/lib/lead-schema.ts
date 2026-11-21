import { z } from "zod";

export const LEAD_TYPES = ["viewing", "question", "valuation", "selection", "mortgage", "callback"] as const;
export function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 ? `+7${digits}` : `+${digits.startsWith("8") ? `7${digits.slice(1)}` : digits}`;
}
export function maskPhone(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("7") || digits.startsWith("8")) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  if (!digits) return value ? "+7" : "";
  return `+7 (${digits.slice(0, 3)}${digits.length >= 3 ? ")" : ""}${digits.length > 3 ? ` ${digits.slice(3, 6)}` : ""}${digits.length > 6 ? `-${digits.slice(6, 8)}` : ""}${digits.length > 8 ? `-${digits.slice(8, 10)}` : ""}`;
}
export const leadSchema = z.object({
  kind: z.enum(["valuation", "complex_selection", "rent", "let", "general"]).default("general"),
  type: z.enum(LEAD_TYPES),
  name: z.string().trim().max(100).default(""),
  phone: z.string().max(30).transform(normalizePhone).pipe(z.string().regex(/^\+7[3489]\d{9}$/, "Укажите российский телефон: +7 и 10 цифр")),
  consent: z.literal(true, { errorMap: () => ({ message: "Нужно согласие на обработку персональных данных" }) }),
  website: z.string().max(200).default(""),
  property_id: z.string().uuid().nullable().default(null),
  message: z.string().trim().max(3000).default(""),
  budget: z.number().finite().min(0).max(100_000_000_000).nullable().default(null),
  rooms: z.string().max(50).default(""),
  district: z.string().max(100).default(""),
  source_page: z.string().max(500).regex(/^\/(?!\/)/),
  utm_source: z.string().max(200).default(""),
  utm_medium: z.string().max(200).default(""),
  utm_campaign: z.string().max(200).default(""),
  utm_term: z.string().max(200).default(""),
  referrer: z.string().max(500).default(""),
  details: z.record(z.string().max(80), z.string().max(1000)).refine(v => Object.keys(v).length <= 20).default({}),
});