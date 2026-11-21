import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { SiteLayout } from '@/components/site/Layout';
import { Section } from '@/components/site/ui';
import { PropertyCard } from '@/components/site/PropertyCard';
import { CollectionLinks } from '@/components/site/CollectionLinks';
import { propertiesQuery } from '@/lib/properties-query';
import { activeChips, parseFilters, type Filters } from '@/lib/catalog';
import { collectionBySlug, collectionRows, collectionFaq, collectionIndexable } from '@/lib/seo-collections';
import { seoSettingsQuery, seoHead, breadcrumbs, faqSchema } from '@/lib/seo';

export const Route = createFileRoute('/kupit-kvartiru/$collection')({
  staticData: { sitemap: true },
  validateSearch: (search: Record<string, unknown>): Filters => parseFilters(search),
  loaderDeps: ({ search }) => ({ filters: search }),
  loader: async ({ params, deps, context }) => {
    const collection = collectionBySlug(params.collection);
    if (!collection) throw notFound();
    const [rows, settings] = await Promise.all([context.queryClient.ensureQueryData(propertiesQuery), context.queryClient.ensureQueryData(seoSettingsQuery)]);
    // Named collection constraints cannot be weakened by a query string.
    const filters: Filters = { ...deps.filters, ...collection.filters };
    return { collection, filters, count: collectionRows(rows, filters).length, minObjects: settings.minObjects };
  },
  head: ({ loaderData, params }) => {
    const path = `/kupit-kvartiru/${params.collection}`;
    if (!loaderData) return seoHead('Подборка недоступна', 'Подборка квартир недоступна.', path, { noindex: true });
    const { collection: c, filters, count, minObjects } = loaderData;
    const chips = activeChips(filters).filter(chip => !(chip.key in c.filters) && !(chip.key === 'price_from' && 'price_to' in c.filters));
    const title = c.title + (chips.length ? ` — ${chips.map(chip => chip.label).join(', ')}` : '');
    return seoHead(title, c.intro, path, { noindex: !collectionIndexable(count, minObjects, filters), canonical: path,
      schemas: [breadcrumbs([{ name: 'Главная', path: '/' }, { name: 'Купить квартиру', path: '/kupit-kvartiru' }, { name: c.title, path }]), faqSchema(collectionFaq(c.title))] });
  },
  errorComponent: () => <SiteLayout><Section><h1 className="text-2xl font-bold text-primary">Не удалось загрузить подборку</h1><p className="mt-3 text-muted-foreground">Обновите страницу, чтобы повторить загрузку.</p></Section></SiteLayout>,
  notFoundComponent: () => <SiteLayout><Section><h1 className="text-2xl font-bold text-primary">Подборка не найдена</h1><Link to="/kupit-kvartiru" className="text-berry">Все квартиры</Link></Section></SiteLayout>,
  component: CollectionPage,
});
function CollectionPage() {
  const { collection: c, filters } = Route.useLoaderData();
  const { data: rows } = useSuspenseQuery(propertiesQuery);
  const items = collectionRows(rows, filters);
  const chips = activeChips(filters);
  return <SiteLayout><Section className="pt-6 md:pt-10">
    <nav aria-label="Хлебные крошки" className="text-sm text-muted-foreground"><Link to="/">Главная</Link> / <Link to="/kupit-kvartiru">Купить квартиру</Link> / <span>{c.title}</span></nav>
    <h1 className="mt-6 text-3xl font-extrabold text-primary md:text-4xl">{c.title}</h1>
    <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">{c.intro}</p>
    <p className="mt-6 font-semibold text-primary">Найдено {items.length}</p>
    <p className="mt-2 text-sm text-muted-foreground">{chips.map(chip => chip.label).join(' · ')}</p>
    <Link to="/kupit-kvartiru" search={filters} className="mt-4 inline-block text-sm font-semibold text-berry underline">Уточнить условия поиска</Link>
    {items.length ? <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map(p => <PropertyCard key={p.id} p={p} />)}</div> : <div className="mt-8 border-y py-8"><h2 className="text-lg font-bold text-primary">Пока нет подходящих квартир</h2><p className="mt-2 text-muted-foreground">Посмотрите соседние подборки или измените условия в каталоге.</p></div>}
    <h2 className="mt-12 text-2xl font-bold text-primary">Вопросы о покупке</h2>
    <div className="mt-4 divide-y">{collectionFaq(c.title).map(([q, a]) => <details key={q} className="py-4"><summary className="cursor-pointer font-semibold text-primary">{q}</summary><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a}</p></details>)}</div>
    <CollectionLinks current={c.slug} />
  </Section></SiteLayout>;
}
