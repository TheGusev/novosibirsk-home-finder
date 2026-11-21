import { describe, expect, it } from 'vitest';
import { COLLECTIONS, collectionRows, collectionIndexable, nearestCollection, filterCount } from './seo-collections';
import { parseSeoSettings } from './seo-settings';
import { allPages } from './pagination';
import { sitemapXML } from './sitemap';
import type { Property } from './catalog';
const p = (status: string, rooms = 1): Property => ({ id: status, slug: status, title: 'Демо', type: 'resale', rooms, area_total: 40, price: 5_000_000, price_per_m2: 125000, district: 'Ленинский', metro: 'Площадь Маркса', status, images: [], created_at: '2026-01-01', price_verified_at: '2026-01-01', area_kitchen: null, floor: null, floors_total: null, address: null, lat: null, lng: null, house_type: null, finish: null, description: null, source_type: 'agency', responsible_agent_id: null, year_built: null, deal_type: null, encumbrances: null, availability_verified_at: null, checks_done: [], checks_pending: [] });
describe('SEO indexing policy', () => {
  it('indexes only at the configured threshold, not below', () => {
    expect(collectionIndexable(2, 3, {})).toBe(false);
    expect(collectionIndexable(3, 3, {})).toBe(true);
    expect(collectionIndexable(3, 5, {})).toBe(false);
    expect(parseSeoSettings([{ key: 'seo_index_min_objects', value: 5 }]).minObjects).toBe(5);
  });
  it('counts only active objects, excluding reserved, sold and hidden', () => {
    expect(collectionRows([p('active'), p('reserved'), p('sold'), p('hidden')], {}).map(r => r.status)).toEqual(['active']);
  });
  it('more than two logical filters are noindex; ranges count as one', () => {
    expect(collectionIndexable(20, 3, { rooms: '1', price_from: '1', price_to: '5000000' })).toBe(true);
    expect(collectionIndexable(20, 3, { rooms: '1', price_to: '5000000', district: 'Ленинский' })).toBe(false);
    expect(filterCount({ sort: 'price_asc' })).toBe(0);
  });
  it('chooses a matching collection rather than an unrelated parent', () => {
    expect(nearestCollection({ rooms: '2', price_to: '5000000', district: 'Ленинский' })?.slug).toBe('2-komnatnye');
    expect(nearestCollection({ floor: 'middle', house: 'Кирпич', finish: 'Чистовая' })).toBeUndefined();
  });
  it('budget collection includes 5 million and excludes higher prices', () => {
    const c = COLLECTIONS.find(c => c.slug === 'do-5-mln');
    if (!c) throw new Error('Missing requested collection');
    expect(collectionRows([p('active'), { ...p('active'), price: 5000001 }], c.filters)).toHaveLength(1);
  });
  it('all 12 requested collection slugs are present', () => {
    expect(COLLECTIONS.map(c => c.slug)).toEqual(['1-komnatnye', '2-komnatnye', '3-komnatnye', 'studii', 'vtorichka', 'novostroyki', 'do-5-mln', 'leninskiy-rayon', 'zaeltsovskiy-rayon', 'oktyabrskiy-rayon', 'metro-ploshchad-marksa', 'metro-zaeltsovskaya']);
  });
});
describe('sitemap public pagination', () => {
  it('reads every batch with an empty terminating batch', async () => {
    const offsets: number[] = [];
    expect(await allPages(async (offset) => { offsets.push(offset); return [1, 2, 3, 4, 5].slice(offset, offset + 2); }, 2)).toEqual([1, 2, 3, 4, 5]);
    expect(offsets).toEqual([0, 2, 4, 5]);
  });
  it('rejects a later-page error without returning partial rows', async () => {
    await expect(allPages(async offset => { if (offset >= 2) throw new Error('later page'); return [1, 2]; }, 2)).rejects.toThrow('later page');
  });
  it('does not invent lastmod and rejects query-string URLs', () => {
    expect(sitemapXML('https://kluchberi.ru', [{ path: '/' }])).not.toContain('lastmod');
    expect(() => sitemapXML('https://kluchberi.ru', [{ path: '/?rooms=2' }])).toThrow();
  });
});
