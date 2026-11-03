import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export type LeadKind = "valuation" | "complex_selection" | "rent" | "let" | "general";

const schema = z.object({
  name: z.string().trim().max(100).optional(),
  phone: z.string().trim().min(5, "Укажите телефон").max(30).regex(/^[\d\s()+-]+$/, "Только цифры, пробелы, +, -, ()"),
  consent: z.literal(true, { errorMap: () => ({ message: "Нужно согласие" }) }),
});

/** Сохраняет заявку в базу. Возвращает текст ошибки или null. */
export async function submitLead(kind: LeadKind, input: { name?: string; phone: string; consent: boolean; details?: Record<string, string> }): Promise<string | null> {
  const r = schema.safeParse(input);
  if (!r.success) return r.error.issues[0]?.message ?? "Проверьте поля";
  const details = Object.fromEntries(Object.entries(input.details ?? {}).map(([k, v]) => [k, String(v).slice(0, 1000)]));
  const { error } = await supabase.from("leads").insert({ kind, name: r.data.name || null, phone: r.data.phone, consent: true, details });
  return error ? "Не удалось отправить. Попробуйте ещё раз или позвоните нам." : null;
}
