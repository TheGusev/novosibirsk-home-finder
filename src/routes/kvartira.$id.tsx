import { seoHead, breadcrumbs, pageUrl } from "@/lib/seo";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/Layout";
import { Section } from "@/components/site/ui";
import { LeadForm } from "@/components/site/LeadForm";
import { firstImage, roomsLabel, rub, SOURCE_LABEL } from "@/lib/catalog";
import { propertyQuery } from "@/lib/properties-query";
import { useEffect, useRef } from "react";
import { metrikaGoal } from "@/lib/metrika";

export const Route = createFileRoute("/kvartira/$id")({
  staticData: { sitemap: true },
  loader: async ({ params, context }) => {
    const p = await context.queryClient.ensureQueryData(propertyQuery(params.id));
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData, params }) => {
    const path = `/kvartira/${loaderData?.slug ?? params.id}`;
    if (!loaderData) return seoHead('Объект недоступен', 'Объект недвижимости недоступен.', path, { noindex: true });
    const p = loaderData;
    const title = `${p.title}, ${p.area_total} м²`;
    const description = `${roomsLabel(p.rooms)} квартира, ${p.district} район, Новосибирск. ${rub(p.price)}. ${p.address ?? ''}`;
    const offer = { '@context': 'https://schema.org', '@type': 'Offer', url: pageUrl(path), price: p.price, priceCurrency: 'RUB', availability: p.status === 'active' ? 'https://schema.org/InStock' : 'https://schema.org/Reserved',
      itemOffered: { '@type': 'Apartment', name: p.title, description: p.description ?? description, floorSize: { '@type': 'QuantitativeValue', value: p.area_total, unitCode: 'MTK' }, numberOfRooms: p.rooms, address: { '@type': 'PostalAddress', addressLocality: 'Новосибирск', addressCountry: 'RU', ...(p.address ? { streetAddress: p.address } : {}) } } };
    return seoHead(title, description, path, { noindex: p.status !== 'active', image: firstImage(p), schemas: [offer, breadcrumbs([{ name: 'Главная', path: '/' }, { name: 'Купить квартиру', path: '/kupit-kvartiru' }, { name: p.title, path }])] });
  },
  errorComponent: () => <SiteLayout><Section><h1 className="text-2xl font-bold text-primary">Не удалось загрузить квартиру</h1><p className="mt-3 text-muted-foreground">Обновите страницу.</p></Section></SiteLayout>,
  notFoundComponent: () => (
    <SiteLayout><Section><h1 className="text-3xl font-bold text-primary">Объект не найден</h1><Link to="/kupit-kvartiru" className="mt-4 inline-block text-berry">Все квартиры →</Link></Section></SiteLayout>
  ),
  component: Apartment,
});

function Apartment() {
  const { id } = Route.useParams();
  const { data: l } = useSuspenseQuery(propertyQuery(id));
  const viewed = useRef<string | null>(null);
  useEffect(() => {
    if (!l || viewed.current === l.id) return;
    viewed.current = l.id;
    window.__lovableEvents?.track?.("project.view_property", { housing_type: l.type });
    metrikaGoal("view_property", { housing_type: l.type });
  }, [l?.id]);
  if (!l) return null;
  const facts: [string, string][] = [
    ["Площадь", `${Number(l.area_total)} м²`],
    ["Кухня", l.area_kitchen ? `${Number(l.area_kitchen)} м²` : "—"],
    ["Этаж", `${l.floor}/${l.floors_total}`],
    ["Район", l.district],
    ["Метро", l.metro ?? "—"],
    ["Дом", l.house_type ?? "—"],
    ["Отделка", l.finish ?? "—"],
    ["Продавец", SOURCE_LABEL[l.source_type] ?? "—"],
  ];
  return (
    <SiteLayout>
      <Section className="pt-6 md:pt-10">
        <nav aria-label="Хлебные крошки" className="text-sm text-muted-foreground"><Link to="/">Главная</Link> / <Link to="/kupit-kvartiru">Купить квартиру</Link> / <span>{l.title}</span></nav>
        <img src={firstImage(l)} alt={l.title} width={1200} height={900} fetchPriority="high" className="mt-4 aspect-[16/9] w-full rounded-2xl object-cover shadow-lift" />
        <div className="mt-8 grid gap-10 md:grid-cols-[1fr_380px]">
          <div>
            <span className="rounded-full bg-berry-soft px-3 py-1 text-xs font-semibold text-berry">{l.type === "new" ? "Новостройка" : "Вторичка"}</span>
            <h1 className="mt-3 text-3xl font-extrabold text-primary md:text-4xl">{l.title}</h1>
            <p className="mt-2 text-2xl font-bold text-primary">{rub(l.price)} <span className="text-base font-medium text-muted-foreground">· {l.price_per_m2 ? rub(l.price_per_m2) : ""}/м²</span></p>
            <p className="mt-1 text-sm text-muted-foreground">{l.address} · цена проверена {new Date(l.price_verified_at).toLocaleDateString("ru-RU")}</p>
            <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {facts.map(([k, v]) => (
                <div key={k} className="rounded-xl bg-card p-4 shadow-soft"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="mt-1 font-semibold text-primary">{v}</dd></div>
              ))}
            </dl>
            <h2 className="mt-8 text-xl font-bold text-primary">Описание</h2>
            <p className="mt-2 text-muted-foreground">{l.description ?? "[заполнить]"}</p>
          </div>
          <LeadForm type="viewing" propertyId={l.id} title="Записаться на просмотр" cta="Записаться" />
        </div>
      </Section>
    </SiteLayout>
  );
}
