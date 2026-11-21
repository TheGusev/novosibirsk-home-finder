import { createFileRoute } from '@tanstack/react-router';
import { getRouterInstance } from '@tanstack/react-start';
import { isSitemapRouteIncluded, sitemapPathForLocation, sitemapStaticPaths, sitemapXML, type SitemapEntry } from '@/lib/sitemap';
import { SITE_ORIGIN } from '@/lib/seo';
import { COLLECTIONS, collectionRows, collectionIndexable } from '@/lib/seo-collections';
import { getProperties, getComplexes, getSeoSettings } from '@/lib/public-data.functions';

export const Route = createFileRoute('/sitemap.xml')({
  staticData: { sitemap: false },
  server: { handlers: { GET: async () => {
    try {
      const router = await getRouterInstance();
      const entries: SitemapEntry[] = sitemapStaticPaths(router).map(path => ({ path }));
      const propertyRoute = '/kvartira/$id';
      const collectionRoute = '/kupit-kvartiru/$collection';
      if (isSitemapRouteIncluded(router.routesById[propertyRoute]) || isSitemapRouteIncluded(router.routesById[collectionRoute])) {
        const rows = await getProperties();
        if (isSitemapRouteIncluded(router.routesById[propertyRoute])) for (const row of rows.filter(p => p.status === 'active')) {
          const location = router.buildLocation({ to: '/kvartira/$id', params: { id: row.slug }, search: () => ({}), hash: '' });
          const path = sitemapPathForLocation(router, location, propertyRoute);
          if (path) entries.push({ path });
        }
        if (isSitemapRouteIncluded(router.routesById[collectionRoute])) {
          const settings = await getSeoSettings();
          for (const c of COLLECTIONS) {
            if (!collectionIndexable(collectionRows(rows, c.filters).length, settings.minObjects, c.filters)) continue;
            const location = router.buildLocation({ to: '/kupit-kvartiru/$collection', params: { collection: c.slug }, search: () => ({}), hash: '' });
            const path = sitemapPathForLocation(router, location, collectionRoute);
            if (path) entries.push({ path });
          }
        }
      }
      const complexRoute = '/novostroyki/$slug';
      if (isSitemapRouteIncluded(router.routesById[complexRoute])) for (const c of await getComplexes()) {
        const location = router.buildLocation({ to: '/novostroyki/$slug', params: { slug: c.slug }, search: () => ({}), hash: '' });
        const path = sitemapPathForLocation(router, location, complexRoute);
        if (path) entries.push({ path });
      }
      return new Response(sitemapXML(SITE_ORIGIN, entries), { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=300' } });
    } catch {
      return new Response('Карта сайта временно недоступна', { status: 503, headers: { 'Cache-Control': 'no-store' } });
    }
  } } },
});
