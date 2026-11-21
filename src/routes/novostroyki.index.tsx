import { seoHead } from "@/lib/seo";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero, Section } from "@/components/site/ui";
import { LeadForm } from "@/components/site/LeadForm";
import { DISTRICTS } from "@/lib/catalog";
import { rub } from "@/lib/catalog";
import { metrikaGoal } from "@/lib/metrika";
import { applyComplexFilters, complexesQuery, complexImage, completionLabel, parseComplexFilters, type ComplexFilters } from "@/lib/complexes";

const field = "h-11 w-full rounded-md border-input bg-background px-3 text-sm text-primary outline-none focus:ring-2 focus:ring-ring";
const lbl = "mb-1.5 block text-xs font-semibold text-muted-foreground";
const YEARS = ["2025", "2026", "2027", "2028"];

export const Route = createFileRoute("/novostroyki/")({
  staticData: { sitemap: true },
  validateSearch: (s: Record<string, unknown>): ComplexFilters => parseComplexFilters(s),
  loaderDeps: ({ search }) => ({ filters: search }),
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(complexesQuery).then(rows => ({ rows, filters: deps.filters })),
  head: ({ loaderData }) => {
    const f = loaderData?.filters ?? {};
    const labels = Object.values(f).filter(Boolean).join(', ');
    return seoHead('Новостройки Новосибирска — жилые комплексы' + (labels ? `: ${labels}` : ''), 'Сравните жилые комплексы Новосибирска по району, сроку сдачи, цене и отделке.', '/novostroyki', { noindex: !loaderData || Object.values(f).filter(Boolean).length > 2 });
  },
  errorComponent: () => <SiteLayout><Section><p className="text-primary">Не удалось загрузить жилые комплексы. Обновите страницу.</p></Section></SiteLayout>,
  notFoundComponent: () => <SiteLayout><Section><p className="text-primary">Ничего не найдено.</p></Section></SiteLayout>,
  component: Complexes,
});

function Complexes() {
  const f = Route.useSearch();
  const nav = useNavigate({ from: "/novostroyki/" });
  const { data } = useSuspenseQuery(complexesQuery);
  const list = applyComplexFilters(data, f);
  const set = async (k: keyof ComplexFilters, v: string) => {
    await nav({ search: (p: ComplexFilters) => parseComplexFilters({ ...p, [k]: v }), replace: true });
    window.__lovableEvents?.track?.("project.use_filter", { catalog: "complexes" });
    metrikaGoal("use_filter", { catalog: "complexes" });
  };
  return (
    <SiteLayout>
      <PageHero eyebrow="Новостройки" title="Жилые комплексы Новосибирска" text="Сравните ЖК по району, сроку сдачи, цене и отделке. Поможем разобраться в условиях застройщика и договоре ДДУ." />
      <Section className="pt-8 md:pt-10">
        <div className="grid gap-3 rounded-lg bg-card p-4 border sm:grid-cols-2 lg:grid-cols-4">
          <label><span className={lbl}>Район</span>
            <select className={field} value={f.district ?? ""} onChange={(e) => set("district", e.target.value)}>
              <option value="">Любой</option>{DISTRICTS.map((d) => <option key={d}>{d}</option>)}
            </select></label>
          <label><span className={lbl}>Срок сдачи</span>
            <select className={field} value={f.due ?? ""} onChange={(e) => set("due", e.target.value)}>
              <option value="">Любой</option>{YEARS.map((y) => <option key={y} value={y}>до конца {y}</option>)}
            </select></label>
          <label><span className={lbl}>Цена от, ₽</span>
            <input inputMode="numeric" placeholder="от" className={field} value={f.price_from ?? ""} onChange={(e) => set("price_from", e.target.value.replace(/\D/g, ""))} /></label>
          <label><span className={lbl}>Отделка</span>
            <select className={field} value={f.finish ?? ""} onChange={(e) => set("finish", e.target.value)}>
              <option value="">Любая</option>{["Без отделки", "White box", "Чистовая"].map((d) => <option key={d}>{d}</option>)}
            </select></label>
        </div>
        <p className="mt-6 text-sm font-semibold text-primary">Найдено: {list.length}</p>
        {list.length === 0 ? (
          <div className="mt-4 rounded-lg bg-card p-8 text-center border">
            <p className="text-primary">По этим условиям ЖК не нашлось.</p>
            <button className="mt-3 text-sm font-semibold text-brand" onClick={async () => { await nav({ search: {}, replace: true }); window.__lovableEvents?.track?.("project.use_filter", { catalog: "complexes" }); metrikaGoal("use_filter", { catalog: "complexes" }); }}>Сбросить фильтры</button>
          </div>
        ) : (
          <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((c) => (
              <li key={c.id}>
                <Link to="/novostroyki/$slug" params={{ slug: c.slug }} className="group block overflow-hidden rounded-lg bg-card border transition">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={complexImage(c)} alt={c.name} loading="lazy" width={1200} height={900} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    {c.name.startsWith("Демо") && <span className="absolute bottom-3 right-3 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold text-primary">Демо</span>}
                  </div>
                  <div className="p-5">
                    <h2 className="text-lg font-bold text-primary">{c.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{c.developer} · {c.district} р-н</p>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      <span className="text-primary"><span className="text-muted-foreground">Сдача:</span> {completionLabel(c)}</span>
                      {c.finish && <span className="text-primary"><span className="text-muted-foreground">Отделка:</span> {c.finish}</span>}
                    </div>
                    <p className="mt-3 text-xl font-bold text-primary">{c.price_from ? `от ${rub(c.price_from)}` : "Цена [заполнить]"}</p>
                    {c.commission_note && <p className="mt-2 inline-block rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">{c.commission_note}</p>}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>
      <Section className="pt-0 md:pt-0"><LeadForm kind="complex_selection" title="Получить подборку новостроек" cta="Получить подборку" commentPlaceholder="Район, бюджет, срок сдачи, комнаты" /></Section>
    </SiteLayout>
  );
}
