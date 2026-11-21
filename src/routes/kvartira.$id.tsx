import { seoHead, breadcrumbs, pageUrl } from "@/lib/seo";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteLayout, MobileAction } from "@/components/site/Layout";
import { PropertyCard, specsLine } from "@/components/site/PropertyCard";
import { Section, btn } from "@/components/site/ui";
import { LeadForm } from "@/components/site/LeadForm";
import { firstImage, roomsLabel, rub, SOURCE_LABEL, type Property } from "@/lib/catalog";
import { propertyQuery, propertiesQuery } from "@/lib/properties-query";
import { useEffect, useRef } from "react";
import { metrikaGoal } from "@/lib/metrika";

export const Route = createFileRoute("/kvartira/$id")({
  staticData: { sitemap: true },
  loader: async ({ params, context }) => {
    const p = await context.queryClient.ensureQueryData(propertyQuery(params.id));
    if (!p) throw notFound();
    await context.queryClient.ensureQueryData(propertiesQuery);
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
    <SiteLayout><Section><h1 className="text-3xl font-bold text-primary">Объект не найден</h1><Link to="/kupit-kvartiru" className="mt-4 inline-block text-brand">Все квартиры →</Link></Section></SiteLayout>
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
  const images = (Array.isArray(l.images) ? l.images.filter((x): x is string => typeof x === "string") : []).map((x) => x.replace(/^\/images\/(hero|interior|building)\.jpg$/, "/images/$1.webp"));
  const gallery = images.length ? images : [firstImage(l)];
  const list = (j: unknown) => (Array.isArray(j) ? j.filter((x): x is string => typeof x === "string") : []);
  const done = list(l.checks_done), pending = list(l.checks_pending);
  const date = (d: string | null) => (d ? new Date(d).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }) : "Уточняется");
  const facts: [string, string][] = [
    ["Тип", l.type === "new" ? "Новостройка" : "Вторичка"],
    ["Общая площадь", `${Number(l.area_total)} м²`],
    ["Кухня", l.area_kitchen ? `${Number(l.area_kitchen)} м²` : "Уточняется"],
    ["Этаж", l.floor ? `${l.floor}${l.floors_total ? ` из ${l.floors_total}` : ""}` : "Уточняется"],
    ["Дом", l.house_type ?? "Уточняется"],
    ["Год постройки", l.year_built ? String(l.year_built) : "Уточняется"],
    ["Отделка", l.finish ?? "Уточняется"],
    ["Район", `${l.district}${l.metro ? `, м. ${l.metro}` : ""}`],
  ];
  const terms: [string, string][] = [
    ["Тип сделки", l.deal_type ?? "Уточняется"],
    ["Обременения", l.encumbrances ?? "Уточняется"],
    ["Продавец", SOURCE_LABEL[l.source_type] ?? "Уточняется"],
  ];
  const Dl = ({ rows }: { rows: [string, string][] }) => (
    <dl className="divide-y border-y text-sm">
      {rows.map(([k, v]) => <div key={k} className="grid grid-cols-[minmax(120px,40%)_1fr] gap-4 py-2.5"><dt className="text-muted-foreground">{k}</dt><dd className={v === "Уточняется" ? "text-muted-foreground" : "font-medium text-primary"}>{v}</dd></div>)}
    </dl>
  );
  return (
    <SiteLayout>
      <Section className="pt-4 md:pt-6">
        <nav aria-label="Хлебные крошки" className="truncate text-sm text-muted-foreground"><Link to="/" className="hover:text-primary">Главная</Link> / <Link to="/kupit-kvartiru" className="hover:text-primary">Купить квартиру</Link> / <span>{l.title}</span></nav>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0">
            <div className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" aria-label="Фотографии">
              {gallery.map((src, i) => (
                <img key={src + i} src={src} alt={`${l.title} — фото ${i + 1}`} width={1200} height={900} loading={i ? "lazy" : "eager"} fetchPriority={i ? "auto" : "high"} decoding="async"
                  className={`aspect-[4/3] shrink-0 snap-center rounded-md bg-muted object-cover ${gallery.length > 1 ? "w-[88%] sm:w-[70%]" : "w-full"}`} />
              ))}
            </div>
            {gallery.length > 1 && <p className="mt-2 text-xs text-muted-foreground">{gallery.length} фото · листайте</p>}
          </div>
          <aside className="lg:sticky lg:top-20 lg:self-start">
            {l.title.startsWith("Демо") && <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-semibold text-primary">Демо</span>}
            <h1 className="mt-2 text-2xl font-bold leading-tight text-primary md:text-[1.75rem]">{specsLine(l)}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{[l.address, `${l.district} р-н`, l.metro && `м. ${l.metro}`].filter(Boolean).join(" · ")}</p>
            <p className="mt-4 text-[1.75rem] font-bold text-primary tabular">{rub(l.price)}</p>
            {l.price_per_m2 != null && <p className="text-sm text-muted-foreground tabular">{rub(l.price_per_m2)} за м² · цена проверена {date(l.price_verified_at)}</p>}
            <div className="mt-5 hidden gap-2 lg:grid">
              <a href="#prosmotr" className={btn.primary}>Записаться на просмотр</a>
              <a href="#vopros" className={btn.secondary}>Задать вопрос</a>
            </div>
          </aside>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="grid min-w-0 gap-10">
            <section><h2 className="mb-3 text-lg font-bold text-primary">Описание</h2><p className="max-w-[68ch] leading-relaxed text-muted-foreground">{l.description ?? "Описание уточняется."}</p></section>
            <section><h2 className="mb-3 text-lg font-bold text-primary">Характеристики</h2><Dl rows={facts} /></section>
            <section><h2 className="mb-3 text-lg font-bold text-primary">Условия сделки</h2><Dl rows={terms} /></section>
            <section>
              <h2 className="mb-3 text-lg font-bold text-primary">Актуальность и проверки</h2>
              <Dl rows={[["Цена проверена", date(l.price_verified_at)], ["Наличие проверено", date(l.availability_verified_at)]]} />
              <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
                <div><p className="font-medium text-primary">Проверено</p><ul className="mt-1 list-disc pl-5 text-muted-foreground">{done.length ? done.map((x) => <li key={x}>{x}</li>) : <li>Пока ничего не отмечено</li>}</ul></div>
                <div><p className="font-medium text-primary">Ещё не проверено</p><ul className="mt-1 list-disc pl-5 text-muted-foreground">{pending.length ? pending.map((x) => <li key={x}>{x}</li>) : <li>Уточняется</li>}</ul></div>
              </div>
            </section>
            {l.lat != null && l.lng != null && (
              <section><h2 className="mb-3 text-lg font-bold text-primary">На карте</h2>
                <a className="text-sm font-semibold text-brand underline" target="_blank" rel="noopener noreferrer" href={`https://www.openstreetmap.org/?mlat=${l.lat}&mlon=${l.lng}#map=16/${l.lat}/${l.lng}`}>Открыть местоположение на карте</a>
              </section>
            )}
            <section id="vopros" className="scroll-mt-20"><LeadForm type="question" propertyId={l.id} title="Задать вопрос по квартире" cta="Отправить вопрос" /></section>
          </div>
          <div id="prosmotr" className="scroll-mt-20 lg:sticky lg:top-20 lg:self-start">
            <LeadForm type="viewing" propertyId={l.id} title="Записаться на просмотр" cta="Записаться" />
          </div>
        </div>
        <Similar current={l} />
      </Section>
      <MobileAction><a href="#prosmotr" className={`${btn.primary} w-full`}>Записаться на просмотр</a></MobileAction>
    </SiteLayout>
  );
}

function Similar({ current }: { current: Property }) {
  const { data } = useSuspenseQuery(propertiesQuery);
  const items = (data ?? []).filter((p) => p.id !== current.id && p.status === "active" && (p.district === current.district || p.rooms === current.rooms)).slice(0, 3);
  if (!items.length) return null;
  return (
    <section className="mt-12">
      <h2 className="mb-4 text-lg font-bold text-primary">Похожие предложения</h2>
      <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">{items.map((p) => <PropertyCard key={p.id} p={p} />)}</div>
    </section>
  );
}
