import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { leadSchema } from "./lead-schema";

export const saveLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => leadSchema.parse(input))
  .handler(async ({ data }) => {
    if (data.website) return { ok: false, error: "Не удалось отправить заявку." };
    const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
    const url = process.env['SUPABASE_URL'];
    if (!key || !url) throw new Error("Lead storage is unavailable");
    const client = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      } },
    });
    const { error } = await client.rpc("create_lead", { payload: data });
    if (error) return { ok: false, error: error.message.includes("RATE_LIMIT")
      ? "Вы уже отправили 3 заявки за 15 минут. Попробуйте позже."
      : "Не удалось отправить. Попробуйте ещё раз или позвоните нам." };
    return { ok: true, error: null };
  });