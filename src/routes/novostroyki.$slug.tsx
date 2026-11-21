import { seoHead, breadcrumbs } from "@/lib/seo";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/Layout";
import { Section } from "@/components/site/ui";
import { LeadForm } from "@/components/site/LeadForm";
import { roomsLabel, rub } from "@/lib/catalog";
import { complexImage, complexQuery, completionLabel } from "@/lib/complexes";

export const Route = createFileRoute("/novostroyki/$slug")({
  staticData: { sitemap: true },
  loader: async ({ params, context }) => {
    const r = await context.queryClient.ensureQueryData(complexQuery(params.slug));
    if (!r) throw notFound();
    return r;
  },
  head: ({ loaderData, params }) => {
    const path = `/novostroyki/${loaderData?.complex.slug ?? params.slug}`;
    if (!loaderData) return seoHead('Жилой комплекс недоступен', 'Жилой комплекс недоступен.', path, { noindex: true });
    const c = loaderData.complex;
    return seoHead(`${c.name}, ${c.district} район`, `${c.name}: планировки, срок сдачи ${completionLabel(c)}, ${c.district} район Новосибирска.`, path, { image: complexImage(c), schemas: [breadcrumbs([{ name: 'Главная', path: '/' }, { name: 'Новостройки', path: '/novostroyki' }, { name: c.name, path }])] });
  },
  errorComponent: () => <SiteLayout><Section><p className="text-primary">Не удалось загрузить ЖК. Обновите страницу.</p></Section></SiteLayout>,
  notFoundComponent: () => (
    <SiteLayout><Section><h1 className="text-3xl font-bold text-primary">ЖК не найден</h1><Link to="/novostroyki" className="mt-4 inline-block text-berry">Все новостройки →</Link></Section></SiteLayout>
  ),
  component: ComplexPage,
});

function ComplexPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(complexQuery(slug));
  if (!data) return null;
  const { complex: c, layouts } = data;
  const facts: [string, string][] = [
    ["Застройщик", c.developer],
    ["Район", c.district],
    ["Адрес", c.address ?? "[заполнить]"],
    ["Срок сдачи", completionLabel(c)],
    ["Отделка", c.finish ?? "—"],
    ["Цена от", c.price_from ? rub(c.price_from) : "[заполнить]"],
  ];
  return (
    <SiteLayout>
      <Section className="pt-6 md:pt-10">
        <nav aria-label="Хлебные крошки" className="text-sm text-muted-foreground">
          <Link to="/">Главная</Link> / <Link to="/novostroyki">Новостройки</Link> / <span className="text-primary">{c.name}</span>
        </nav>
        <div className="relative mt-4">
          <img src={complexImage(c)} alt={c.name} width={1200} height={900} fetchPriority="high" className="aspect-[16/8] w-full rounded-2xl object-cover shadow-lift" />
          {c.name.startsWith("Демо") && <span className="absolute bottom-3 right-3 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold text-primary">Демо</span>}
        </div>
        <div className="mt-8 grid gap-10 md:grid-cols-[1fr_380px]">
          <div>
            <h1 className="text-3xl font-extrabold text-primary md:text-4xl">{c.name}</h1>
            {c.commission_note && <p className="mt-3 inline-block rounded-full bg-berry-soft px-3 py-1 text-sm font-semibold text-berry">{c.commission_note}</p>}
            <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {facts.map(([k, v]) => (
                <div key={k} className="rounded-xl bg-card p-4 shadow-soft"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="mt-1 font-semibold text-primary">{v}</dd></div>
              ))}
            </dl>
            <h2 className="mt-10 text-2xl font-bold text-primary">Планировки</h2>
            {layouts.length === 0 ? <p className="mt-3 text-muted-foreground">Планировки скоро появятся. [заполнить]</p> : (
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {layouts.map((l) => (
                  <li key={l.id} className="flex gap-4 rounded-2xl bg-card p-4 shadow-soft">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted text-xs text-muted-foreground">
                      {l.image ? <img src={l.image} alt={`Планировка ${roomsLabel(l.rooms)}`} loading="lazy" width={600} height={600} className="h-full w-full object-contain" /> : "План [заполнить]"}
                    </div>
                    <div>
                      <p className="font-bold text-primary">{roomsLabel(l.rooms)} · {Number(l.area)} м²</p>
                      <p className="mt-1 text-sm text-muted-foreground">{l.price_from ? `от ${rub(l.price_from)}` : "Цена [заполнить]"}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-xs text-muted-foreground">Цены и наличие уточняйте: застройщик может менять их без предупреждения.</p>
            <h2 className="mt-10 text-2xl font-bold text-primary">О комплексе</h2>
            <p className="mt-2 text-muted-foreground">{c.description ?? "[заполнить]"}</p>
          </div>
          <div className="md:sticky md:top-24 md:self-start">
            <LeadForm kind="complex_selection" title="Получить подборку" cta="Получить подборку" details={{ complex: c.name, complex_slug: c.slug }} commentPlaceholder="Комнаты, бюджет, ипотека" />
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
