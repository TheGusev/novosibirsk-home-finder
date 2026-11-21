import { queryOptions } from '@tanstack/react-query';
import { getSeoSettings } from './public-data.functions';
import type { SeoSettings } from './seo-settings';
import { SITE } from '@/config/site';
const BRAND_READY = !SITE.name.startsWith('[');
const withBrand = (t: string) => (BRAND_READY ? `${t} — ${SITE.name}` : t);
export const SITE_ORIGIN = 'https://novosibirsk-home-finder.lovable.app';
export const seoSettingsQuery = queryOptions({ queryKey: ['seo-settings'], queryFn: () => getSeoSettings(), staleTime: 60_000 });
export const pageUrl = (path: string) => new URL(path, SITE_ORIGIN).href;
export function breadcrumbs(items: { name: string; path: string }[]) {
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: pageUrl(item.path) })) };
}
export function faqSchema(faq: readonly (readonly [string, string])[]) {
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })) };
}
/** Returns null until the brand name and domain are approved — no fictitious organization data in SEO. */
export function organizationSchema(settings: SeoSettings) {
  const o = settings.organization;
  if (!BRAND_READY || !SITE.domain) return null;
  const url = `https://${SITE.domain}`;
  return { '@context': 'https://schema.org', '@type': ['Organization', 'RealEstateAgent'], '@id': `${url}/#organization`, name: SITE.name, url,
    address: { '@type': 'PostalAddress', addressLocality: 'Новосибирск', addressRegion: 'Новосибирская область', addressCountry: 'RU', ...(o.address ? { streetAddress: o.address } : {}) },
    ...(o.phone ? { telephone: o.phone } : {}), ...(o.openingHours.length ? { openingHours: o.openingHours } : {}),
    sameAs: Object.values(o.sameAs).filter(url => /^https:\/\//.test(url)),
  };
}
export function seoHead(title: string, description: string, path: string, options: { noindex?: boolean; canonical?: string; schemas?: unknown[]; image?: string; type?: string } = {}) {
  const url = pageUrl(options.canonical ?? path);
  const image = options.image && /^https:\/\//.test(options.image) ? options.image : null;
  return {
    meta: [
      { title: withBrand(title) }, { name: 'description', content: description },
      { property: 'og:title', content: withBrand(title) }, { property: 'og:description', content: description },
      { property: 'og:type', content: options.type ?? 'website' }, { property: 'og:url', content: url },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'robots', content: options.noindex ? 'noindex, follow' : 'index, follow' },
      ...(image ? [{ property: 'og:image', content: image }, { name: 'twitter:image', content: image }] : []),
    ],
    links: [{ rel: 'canonical', href: url }],
    scripts: (options.schemas ?? (path === '/' ? [] : [breadcrumbs([{ name: 'Главная', path: '/' }, { name: title, path }])])).map(schema => ({ type: 'application/ld+json', children: JSON.stringify(schema).replace(/</g, '\\u003c') })),
  };
}
