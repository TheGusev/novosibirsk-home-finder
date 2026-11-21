import { queryOptions } from '@tanstack/react-query';
import { getSeoSettings } from './public-data.functions';
import type { SeoSettings } from './seo-settings';
export const SITE_ORIGIN = 'https://novosibirsk-home-finder.lovable.app';
export const seoSettingsQuery = queryOptions({ queryKey: ['seo-settings'], queryFn: () => getSeoSettings(), staleTime: 60_000 });
export const pageUrl = (path: string) => new URL(path, SITE_ORIGIN).href;
export function breadcrumbs(items: { name: string; path: string }[]) {
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: pageUrl(item.path) })) };
}
export function faqSchema(faq: readonly (readonly [string, string])[]) {
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })) };
}
export function organizationSchema(settings: SeoSettings) {
  const o = settings.organization;
  return { '@context': 'https://schema.org', '@type': ['Organization', 'RealEstateAgent'], '@id': 'https://kluchberi.ru/#organization', name: 'Ключбери', alternateName: 'Kluchberi', url: 'https://kluchberi.ru',
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
      { title: `${title} — Ключбери` }, { name: 'description', content: description },
      { property: 'og:title', content: `${title} — Ключбери` }, { property: 'og:description', content: description },
      { property: 'og:type', content: options.type ?? 'website' }, { property: 'og:url', content: url },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'robots', content: options.noindex ? 'noindex, follow' : 'index, follow' },
      ...(image ? [{ property: 'og:image', content: image }, { name: 'twitter:image', content: image }] : []),
    ],
    links: [{ rel: 'canonical', href: url }],
    scripts: (options.schemas ?? (path === '/' ? [] : [breadcrumbs([{ name: 'Главная', path: '/' }, { name: title, path }])])).map(schema => ({ type: 'application/ld+json', children: JSON.stringify(schema).replace(/</g, '\\u003c') })),
  };
}
