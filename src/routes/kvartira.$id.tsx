import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { Section } from "@/components/site/ui";
import { LeadForm } from "@/components/site/LeadForm";
import { LISTINGS } from "@/lib/listings";

export const Route = createFileRoute("/kvartira/$id")({
  loader: ({ params }) => {
    const l = LISTINGS.find((x) => x.id === params.id);
    if (!l) throw notFound();
    return l;
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.title}, ${loaderData.area} м² — Ключбери` : "Квартира — Ключбери";
    const d = loaderData ? `${loaderData.title} в районе ${loaderData.district}, Новосибирск.` : "Объект недвижимости в Новосибирске.";
    return { meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] };
  },
  notFoundComponent: () => (
    <SiteLayout><Section><h1 className="text-3xl font-bold text-primary">Объект не найден</h1><Link to="/kupit-kvartiru" className="mt-4 inline-block text-berry">Все квартиры →</Link></Section></SiteLayout>
  ),
  component: Apartment,
});

function Apartment() {
  const l = Route.useLoaderData();
  const facts = [["Площадь", `${l.area} м²`], ["Этаж", l.floor], ["Район", l.district], ["Тип", l.type]];
  return (
    <SiteLayout>
      <Section className="pt-6 md:pt-10">
        <Link to="/kupit-kvartiru" className="text-sm text-muted-foreground">← Все квартиры</Link>
        <img src={l.image} alt={l.title} width={1200} height={900} className="mt-4 aspect-[16/9] w-full rounded-2xl object-cover shadow-lift" />
        <div className="mt-8 grid gap-10 md:grid-cols-[1fr_380px]">
          <div>
            <span className="rounded-full bg-berry-soft px-3 py-1 text-xs font-semibold text-berry">{l.type}</span>
            <h1 className="mt-3 text-3xl font-extrabold text-primary md:text-4xl">{l.title}, {l.area} м²</h1>
            <p className="mt-2 text-2xl font-bold text-primary">{l.price}</p>
            <dl className="mt-6 grid grid-cols-2 gap-4">
              {facts.map(([k, v]) => (
                <div key={k} className="rounded-xl bg-card p-4 shadow-soft"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="mt-1 font-semibold text-primary">{v}</dd></div>
              ))}
            </dl>
            <h2 className="mt-8 text-xl font-bold text-primary">Описание</h2>
            <p className="mt-2 text-muted-foreground">[заполнить] Описание квартиры, состояние, инфраструктура рядом.</p>
          </div>
          <LeadForm title="Записаться на показ" cta="Записаться" />
        </div>
      </Section>
    </SiteLayout>
  );
}
