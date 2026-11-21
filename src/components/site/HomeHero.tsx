import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { cleanFilters, DISTRICTS, METRO } from "@/lib/catalog";
import { metrikaGoal } from "@/lib/metrika";

const field = "h-11 w-full rounded-md border-input bg-background px-3 text-sm text-primary outline-none focus:ring-2 focus:ring-ring";
const label = "mb-1.5 block text-xs font-semibold text-muted-foreground";

export function HomeHero() {
  const navigate = useNavigate();
  const [q, setQ] = useState({ type: "", rooms: "", budgetFrom: "", budgetTo: "", place: "" });
  const set = (k: keyof typeof q) => (e: { target: { value: string } }) => setQ({ ...q, [k]: e.target.value });

  return (
    <section className="mx-auto max-w-[1280px] px-4 pt-6 md:px-6 md:pt-10">
      <h1 className="text-[1.75rem] font-bold leading-tight text-primary md:text-[2.5rem]">Квартиры в Новосибирске</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">Вторичка и новостройки. Поможем сравнить варианты, проверить документы и посчитать расходы до покупки.</p>
      <div role="radiogroup" aria-label="Тип жилья" className="mt-5 inline-flex rounded-md border bg-card p-1">
        {[["", "Все"], ["resale", "Вторичка"], ["new", "Новостройки"]].map(([v, l]) => (
          <button key={v} type="button" role="radio" aria-checked={q.type === v} onClick={() => setQ({ ...q, type: v as string })}
            className={`h-10 rounded px-4 text-sm font-medium ${q.type === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-primary"}`}>{l}</button>
        ))}
      </div>
      <form
        id="poisk"
        onSubmit={async (e) => { e.preventDefault(); const place = q.place.trim().toLowerCase();
          const district = DISTRICTS.find((d) => place && d.toLowerCase().startsWith(place.slice(0, 5)));
          const metro = METRO.find((m) => place && m.toLowerCase().includes(place));
          await navigate({ to: "/kupit-kvartiru", search: cleanFilters({ type: q.type, rooms: q.rooms, price_from: q.budgetFrom.replace(/\D/g, ""), price_to: q.budgetTo.replace(/\D/g, ""), district, metro: district ? undefined : metro }) });
          window.__lovableEvents?.track?.("project.use_filter", { catalog: "properties" });
          metrikaGoal("use_filter", { catalog: "properties" }); }}
        className="mt-3 grid scroll-mt-24 grid-cols-2 gap-3 rounded-lg border bg-card p-4 lg:grid-cols-[1fr_1.4fr_1.4fr_auto] lg:items-end"
      >
        <div className="col-span-2 lg:col-span-1">
          <label className={label} htmlFor="rooms">Комнаты</label>
          <select id="rooms" className={field} value={q.rooms} onChange={set("rooms")}>
            <option value="">Любое число</option><option value="studio">Студия</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4+</option>
          </select>
        </div>
        <div className="col-span-2 lg:col-span-1">
          <span className={label}>Бюджет, ₽</span>
          <div className="grid grid-cols-2 gap-2">
            <input id="budget" aria-label="Бюджет от" inputMode="numeric" placeholder="от" className={field} value={q.budgetFrom} onChange={set("budgetFrom")} />
            <input aria-label="Бюджет до" inputMode="numeric" placeholder="до" className={field} value={q.budgetTo} onChange={set("budgetTo")} />
          </div>
        </div>
        <div className="col-span-2 lg:col-span-1">
          <label className={label} htmlFor="place">Район или метро</label>
          <input id="place" placeholder="Центральный, «Площадь Маркса»…" className={field} value={q.place} onChange={set("place")} />
        </div>
        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brand px-6 text-sm font-semibold text-brand-foreground transition hover:brightness-110 col-span-2 lg:col-span-1">
          <Search className="h-4 w-4" /> Показать варианты
        </button>
        
      </form>
    </section>
  );
}
