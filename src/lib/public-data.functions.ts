import { createServerFn } from '@tanstack/react-start';
import { allPages } from './pagination';
import { parseSeoSettings } from './seo-settings';

export const getProperties = createServerFn({ method: 'GET' }).handler(async () => {
  const { publicClient } = await import('./public-client.server');
  const client = publicClient();
  return allPages(async (offset, size) => {
    const { data, error } = await client.from('properties').select('*').in('status', ['active', 'reserved']).order('id').range(offset, offset + size - 1);
    if (error) throw error;
    return data ?? [];
  });
});
export const getProperty = createServerFn({ method: 'GET' }).inputValidator((slug: string) => slug).handler(async ({ data: slug }) => {
  const { publicClient } = await import('./public-client.server');
  const { data, error } = await publicClient().from('properties').select('*').eq('slug', slug).in('status', ['active', 'reserved']).maybeSingle();
  if (error) throw error;
  return data;
});
export const getComplexes = createServerFn({ method: 'GET' }).handler(async () => {
  const { publicClient } = await import('./public-client.server');
  const client = publicClient();
  return allPages(async (offset, size) => {
    const { data, error } = await client.from('complexes').select('*').eq('status', 'active').order('id').range(offset, offset + size - 1);
    if (error) throw error;
    return data ?? [];
  });
});
export const getComplex = createServerFn({ method: 'GET' }).inputValidator((slug: string) => slug).handler(async ({ data: slug }) => {
  const { publicClient } = await import('./public-client.server');
  const client = publicClient();
  const { data, error } = await client.from('complexes').select('*').eq('slug', slug).eq('status', 'active').maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const layouts = await allPages(async (offset, size) => {
    const result = await client.from('complex_layouts').select('*').eq('complex_id', data.id).order('id').range(offset, offset + size - 1);
    if (result.error) throw result.error;
    return result.data ?? [];
  });
  return { complex: data, layouts };
});
export const getSeoSettings = createServerFn({ method: 'GET' }).handler(async () => {
  const { publicClient } = await import('./public-client.server');
  const { data, error } = await publicClient().from('site_settings').select('key,value').in('key', ['seo_index_min_objects', 'seo_organization']);
  if (error) throw error;
  return parseSeoSettings(data ?? []);
});
export const getRentals = createServerFn({ method: 'GET' }).handler(async () => {
  const { publicClient } = await import('./public-client.server');
  const client = publicClient();
  const setting = await client.from('site_settings').select('value').eq('key', 'rental_catalog_enabled').maybeSingle();
  if (setting.error) throw setting.error;
  if (setting.data?.value !== true) return [];
  return allPages(async (offset, size) => {
    const { data, error } = await client.from('rentals').select('*').eq('status', 'active').order('id').range(offset, offset + size - 1);
    if (error) throw error;
    return data ?? [];
  });
});
