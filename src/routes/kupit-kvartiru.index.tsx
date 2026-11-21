import { seoHead } from "@/lib/seo";
import { nearestCollection, filterCount } from "@/lib/seo-collections";
import { CollectionLinks } from "@/components/site/CollectionLinks";
import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { lazy, Suspense, useMemo, useState } from "react";
import { LayoutGrid, List, Map as MapIcon, SlidersHorizontal, X, SearchX } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { FilterPanel } from "@/components/site/FilterPanel";
import { PropertyCard } from "@/components/site/PropertyCard";
import { activeChips, applyFilters, catalogTitle, cleanFilters, parseFilters, removeChip, SORTS, type Filters } from "@/lib/catalog";
import { propertiesQuery } from "@/lib/properties-query";
import { metrikaGoal } from "@/lib/metrika";

const CatalogMap = lazy(() => import("@/components/site/CatalogMap"));

type View = "grid" | "list" | "map";
type Search = Filters & { view?: string | undefined };

export const Route = createFileRoute("/kupit-kvartiru/")({
  staticData: { sitemap: true },
  validateSearch: (s: Record<string, unknown>): Search => {
    const f: Search = parseFilters(s);
    if (s["view"] === "list" || s["view"] === "map") f.view = s["view"];
    return f;
  },
  loaderDeps: ({ search }) => ({ filters: parseFilters(search) }),
  loader: async ({ context, deps }) => {
    const rows = await context.queryClient.ensureQueryData(propertiesQuery);
    return { filters: deps.filters, count: applyFilters(rows, deps.filters).length };
  },
  head: ({ loaderData }) => {
    const f = loaderData?.filters ?? {};
    const parent = nearestCollection(f);
    const title = catalogTitle(f);
    return seoHead(`${title} — каталог квартир`, `Каталог: ${title.toLowerCase()}. Сравните цену, площадь, состояние дома и документы; просмотр вариантов без ввода телефона.`, '/kupit-kvartiru', {
      noindex: !loaderData || filterCount(f) > 2,
      canonical: parent ? `/kupit-kvartiru/${parent.slug}` : '/kupit-kvartiru',
    });
  },
  errorComponent: () => <SiteLayout><div className="mx-auto max-w-6xl px-4 py-12"><h1 className="text-2xl font-bold text-primary">Не удалось загрузить квартиры</h1><p className="mt-3 text-muted-foreground">Обновите страницу, чтобы повторить загрузку.</p></div></SiteLayout>,
  notFoundComponent: () => <SiteLayout><div className="mx-auto max-w-6xl px-4 py-12"><h1 className="text-2xl font-bold text-primary">Каталог не найден</h1></div></SiteLayout>,
  component: Catalog,
});

const plural = (n: number, a: string, b: string, c: string) => {
  const m10 = n % 10, m100 = n % 100;
  return m10 === 1 && m100 !== 11 ? a : m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20) ? b : c;
};

function Catalog() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { view: rawView, ...filters } = search;
  const view: View = rawView === "list" || rawView === "map" ? rawView : "grid";
  const { data } = useSuspenseQuery(propertiesQuery);

  // Один источник: rows → items → заголовок, счётчик, чипы, список, карта.
  const items = useMemo(() => (data ? applyFilters(data, filters) : []), [data, search]);
  const count = items.length;
  const chips = activeChips(filters);
  const title = catalogTitle(filters);

  const [sheet, setSheet] = useState(false);
  const [draft, setDraft] = useState<Filters>(filters);
  const draftCount = data ? applyFilters(data, draft).length : 0;
  const [activeId, setActiveId] = useState<string | null>(null);

  const apply = async (f: Filters, v: View = view) => {
    await navigate({ search: { ...cleanFilters(f), ...(v !== "grid" ? { view: v } : {}) }, replace: true, resetScroll: false });
    if (JSON.stringify(cleanFilters(f)) !== JSON.stringify(cleanFilters(filters))) {
      window.__lovableEvents?.track?.("project.use_filter", { catalog: "properties" });
      metrikaGoal("use_filter", { catalog: "properties" });
    }
  };

  const openSheet = () => { setDraft(filters); setSheet(true); };
  const selectFromMap = (id: string) => {
    setActiveId(id);
    document.getElementById(`card-${id}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const results = count === 0 ? (
    <div className="rounded-2xl bg-card p-10 text-center shadow-soft">
      <SearchX className="mx-auto h-10 w-10 text-muted-foreground" strokeWidth={1.5} />
      <p className="mt-4 text-lg font-bold text-primary">Ничего не найдено</p>
      <p className="mt-1 text-sm text-muted-foreground">Попробуйте смягчить фильтры или сбросить их.</p>
      <button onClick={() => apply({})} className="mt-5 rounded-xl bg-berry px-5 py-2.5 text-sm font-semibold text-berry-foreground">Сбросить фильтры</button>
    </div>
  ) : (
    <div className={view === "list" || view === "map" ? "grid gap-4" : "grid gap-5 sm:grid-cols-2 xl:grid-cols-3"}>
      {items.map((p) => (
        <PropertyCard key={p.id} p={p} layout={view === "list" ? "list" : "grid"} active={activeId === p.id} onHover={view === "map" ? setActiveId : undefined} />
      ))}
    </div>
  );

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 md:px-6 md:pt-12">
        <h1 className="text-2xl font-extrabold text-primary md:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground" aria-live="polite">
          {`Найдено ${count} ${plural(count, "вариант", "варианта", "вариантов")}`}
        </p>

        {/* Панель управления */}
        <div className="sticky top-[72px] z-30 -mx-4 mt-5 flex flex-wrap items-center gap-2 bg-background/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:bg-transparent md:px-0">
          <button onClick={openSheet} className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground lg:hidden">
            <SlidersHorizontal className="h-4 w-4" /> Фильтры{chips.length ? ` · ${chips.length}` : ""}
          </button>
          <select aria-label="Сортировка" value={filters.sort ?? ""} onChange={(e) => apply({ ...filters, sort: e.target.value || undefined })}
            className="h-10 rounded-xl border border-input bg-card px-3 text-sm font-medium text-primary outline-none">
            {SORTS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
          </select>
          <div className="ml-auto flex rounded-xl bg-card p-1 shadow-soft" role="tablist" aria-label="Вид">
            {([["grid", LayoutGrid, "Плитка"], ["list", List, "Список"], ["map", MapIcon, "Карта"]] as const).map(([v, Icon, l]) => (
              <button key={v} role="tab" aria-selected={view === v} aria-label={l} onClick={() => apply(filters, v)}
                className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition ${view === v ? "bg-primary text-primary-foreground" : "text-primary"}`}>
                <Icon className="h-4 w-4" /><span className="hidden sm:inline">{l}</span>
              </button>
            ))}
          </div>
        </div>

        {chips.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {chips.map((c) => (
              <button key={c.key} onClick={() => apply(removeChip(filters, c.key))}
                className="inline-flex items-center gap-1.5 rounded-full bg-berry-soft px-3 py-1.5 text-xs font-semibold text-berry">
                {c.label} <X className="h-3.5 w-3.5" />
              </button>
            ))}
            <button onClick={() => apply(filters.sort ? { sort: filters.sort } : {})} className="px-2 text-xs font-semibold text-muted-foreground underline">Сбросить всё</button>
          </div>
        )}

        <div className="mt-6 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl bg-card p-5 shadow-soft">
              <FilterPanel value={filters} onChange={(f) => apply(f)} />
            </div>
          </aside>

          {view === "map" ? (
            <div className="grid gap-5 xl:grid-cols-[1fr_1.1fr]">
              <div className="order-1 h-[360px] overflow-hidden rounded-2xl bg-muted shadow-soft xl:order-2 xl:sticky xl:top-24 xl:h-[calc(100vh-8rem)]">
                <ClientOnly fallback={<div className="h-full animate-pulse bg-muted" />}>
                  <Suspense fallback={<div className="h-full animate-pulse bg-muted" />}>
                    <CatalogMap items={items} activeId={activeId} onSelect={selectFromMap} />
                  </Suspense>
                </ClientOnly>
              </div>
              <div className="order-2 xl:order-1">{results}</div>
            </div>
          ) : (
            results
          )}
        </div>
        <CollectionLinks />
      </div>

      {/* Мобильная шторка фильтров */}
      {sheet && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal aria-label="Фильтры">
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm animate-in fade-in" onClick={() => setSheet(false)} />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-3xl bg-card shadow-lift animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-lg font-bold text-primary">Фильтры</h2>
              <div className="flex items-center gap-3">
                <button onClick={() => setDraft(filters.sort ? { sort: filters.sort } : {})} className="text-sm font-semibold text-muted-foreground">Сбросить</button>
                <button onClick={() => setSheet(false)} aria-label="Закрыть" className="rounded-full p-1.5 text-primary"><X /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5"><FilterPanel value={draft} onChange={setDraft} /></div>
            <div className="border-t p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button onClick={() => { apply({ ...draft, sort: filters.sort }); setSheet(false); }}
                className="h-12 w-full rounded-xl bg-berry font-semibold text-berry-foreground disabled:opacity-60">
                {draftCount === 0 ? "Нет вариантов — измените фильтры" : `Показать ${draftCount} ${plural(draftCount, "вариант", "варианта", "вариантов")}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
