import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Property } from "./catalog";

/** Единый источник данных каталога: все опубликованные объекты. */
export const propertiesQuery = queryOptions({
  queryKey: ["properties"],
  queryFn: async (): Promise<Property[]> => {
    const { data, error } = await supabase.from("properties").select("*").in("status", ["active", "reserved"]);
    if (error) throw error;
    return data ?? [];
  },
  staleTime: 60_000,
});

export const propertyQuery = (slug: string) =>
  queryOptions({
    queryKey: ["property", slug],
    queryFn: async (): Promise<Property | null> => {
      const { data, error } = await supabase.from("properties").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
