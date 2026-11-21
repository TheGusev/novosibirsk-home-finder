import { z } from 'zod';
const organization = z.object({
  address: z.string().nullable().default(null),
  phone: z.string().nullable().default(null),
  openingHours: z.array(z.string()).default([]),
  sameAs: z.object({ twoGis: z.string().default(''), yandexBusiness: z.string().default('') }).default({}),
});
export function parseSeoSettings(rows: { key: string; value: unknown }[]) {
  const threshold = rows.find(r => r.key === 'seo_index_min_objects')?.value;
  const details = organization.safeParse(rows.find(r => r.key === 'seo_organization')?.value ?? {});
  return {
    minObjects: typeof threshold === 'number' && Number.isInteger(threshold) && threshold >= 1 ? threshold : 3,
    organization: details.success ? details.data : organization.parse({}),
  };
}
export type SeoSettings = ReturnType<typeof parseSeoSettings>;
