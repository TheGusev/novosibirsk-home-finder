import { queryOptions } from "@tanstack/react-query";
import { getProperties, getProperty } from "./public-data.functions";
import type { Property } from "./catalog";

/** Единый источник данных каталога: все опубликованные объекты. */
export const propertiesQuery = queryOptions({
  queryKey: ["properties"],
  queryFn: (): Promise<Property[]> => getProperties(),
  staleTime: 60_000,
});

export const propertyQuery = (slug: string) =>
  queryOptions({
    queryKey: ["property", slug],
    queryFn: (): Promise<Property | null> => getProperty({ data: slug }),
  });
