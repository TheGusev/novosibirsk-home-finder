import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { KeyIcon } from "./KeyIcon";
import { cleanFilters, DISTRICTS, METRO } from "@/lib/catalog";

const field = "h-12 w-full rounded-xl border border-input bg-background px-3 text-sm text-primary outline-none focus:ring-2 focus:ring-ring";
const label = "mb-1.5 block text-xs font-semibold text-muted-foreground";

export function HomeHero() {
  const navigate = useNavigate();
  const [q, setQ] = useState({ type: "", rooms: "", budgetFrom: "", budgetTo: "", place: "" });
  const set = (k: keyof typeof q) => (e: { target: { value: string } }) => setQ({ ...q, [k]: e.target.value });

  return (
    <section className="mx-auto max-w-6xl px-4 pt-6 md:px-6 md:pt-12">
      <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-xs font-semibold text-primary shadow-soft">
            <KeyIcon className="h-4 w-4 text-berry" /> Недвижимость Новосибирска и области
          </p>
          <h1 className="mt-5 text-[2rem] font-extrabold leading-[1.1] text-primary md:text-5xl">
            Купить квартиру в Новосибирске — <span className="text-berry">с понятной ценой</span> и сопровождением сделки
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
            Новостройки и вторичное жильё. Поможем сравнить варианты, разобраться в документах и рассчитать расходы до покупки.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link to="/kupit-kvartiru" className="key-turn inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-berry px-6 text-sm font-semibold text-berry-foreground shadow-soft transition hover:shadow-lift hover:brightness-110">
              <KeyIcon /> Смотреть квартиры
            </Link>
            <a href="#poisk" onClick={() => setTimeout(() => document.getElementById("budget")?.focus(), 300)} className="inline-flex h-12 items-center justify-center rounded-xl border border-primary/20 bg-card px-6 text-sm font-semibold text-primary transition hover:border-primary/40">
              Подобрать под мой бюджет
            </a>
          </div>
        </div>
        <div className="relative">
          <img src={hero} alt="Светлая квартира с видом на Новосибирск" width={1600} height={1104} className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lift lg:aspect-[4/5]" />
          <div className="absolute -bottom-4 left-4 flex items-center gap-2 rounded-xl bg-card px-4 py-3 text-sm font-semibold text-primary shadow-lift">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-berry"><KeyIcon className="h-5 w-5" /></span>
            Ключ — в ваши руки
          </div>
        </div>
      </div>

      <form
        id="poisk"
        onSubmit={(e) => { e.preventDefault(); const place = q.place.trim().toLowerCase();
          const district = DISTRICTS.find((d) => place && d.toLowerCase().startsWith(place.slice(0, 5)));
          const metro = METRO.find((m) => place && m.toLowerCase().includes(place));
          navigate({ to: "/kupit-kvartiru", search: cleanFilters({ type: q.type, rooms: q.rooms, price_from: q.budgetFrom.replace(/\D/g, ""), price_to: q.budgetTo.replace(/\D/g, ""), district, metro: district ? undefined : metro }) }); }}
        className="relative z-10 mt-10 grid scroll-mt-24 grid-cols-2 gap-3 rounded-2xl bg-card p-4 shadow-lift md:p-5 lg:grid-cols-[1fr_1fr_1.4fr_1.3fr_auto] lg:items-end"
      >
        <div>
          <label className={label} htmlFor="type">Тип жилья</label>
          <select id="type" className={field} value={q.type} onChange={set("type")}>
            <option value="">Любой</option><option value="resale">Вторичка</option><option value="new">Новостройка</option>
          </select>
        </div>
        <div>
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
        <button className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:brightness-125 col-span-2 lg:col-span-1">
          <Search className="h-4 w-4" /> Показать варианты
        </button>
        <p className="text-xs text-muted-foreground col-span-2 lg:col-span-5">Каталог открывается сразу — телефон не нужен.</p>
      </form>
    </section>
  );
}
