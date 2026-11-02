import { DISTRICTS, FINISHES, FLOOR_OPTS, HOUSE_TYPES, METRO, ROOMS, roomsList, type Filters } from "@/lib/catalog";

const field = "h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-primary outline-none focus:ring-2 focus:ring-ring";
const lbl = "mb-1.5 block text-xs font-semibold text-muted-foreground";

type Props = { value: Filters; onChange: (f: Filters) => void };

function Seg({ options, value, onPick }: { options: { v: string; l: string }[]; value: string[]; onPick: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value.includes(o.v);
        return (
          <button key={o.v} type="button" aria-pressed={on} onClick={() => onPick(o.v)}
            className={`h-10 min-w-12 rounded-xl px-3 text-sm font-semibold transition ${on ? "bg-primary text-primary-foreground" : "border border-input bg-background text-primary hover:border-primary/40"}`}>
            {o.l}
          </button>
        );
      })}
    </div>
  );
}

export function FilterPanel({ value: f, onChange }: Props) {
  const set = (k: keyof Filters, v: string) => onChange({ ...f, [k]: v || undefined });
  const rooms = roomsList(f);
  const Select = ({ k, label, opts, any = "Любой" }: { k: keyof Filters; label: string; opts: string[]; any?: string }) => (
    <label className="block">
      <span className={lbl}>{label}</span>
      <select className={field} value={f[k] ?? ""} onChange={(e) => set(k, e.target.value)}>
        <option value="">{any}</option>
        {opts.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
  const Range = ({ from, to, label, unit }: { from: keyof Filters; to: keyof Filters; label: string; unit: string }) => (
    <div>
      <span className={lbl}>{label}, {unit}</span>
      <div className="grid grid-cols-2 gap-2">
        <input inputMode="numeric" aria-label={`${label} от`} placeholder="от" className={field} value={f[from] ?? ""} onChange={(e) => set(from, e.target.value.replace(/\D/g, ""))} />
        <input inputMode="numeric" aria-label={`${label} до`} placeholder="до" className={field} value={f[to] ?? ""} onChange={(e) => set(to, e.target.value.replace(/\D/g, ""))} />
      </div>
    </div>
  );

  return (
    <div className="grid gap-5">
      <div>
        <span className={lbl}>Тип жилья</span>
        <Seg options={[{ v: "resale", l: "Вторичка" }, { v: "new", l: "Новостройка" }]} value={f.type ? [f.type] : []} onPick={(v) => set("type", f.type === v ? "" : v)} />
      </div>
      <div>
        <span className={lbl}>Комнаты</span>
        <Seg options={ROOMS} value={rooms} onPick={(v) => {
          const next = rooms.includes(v) ? rooms.filter((r) => r !== v) : [...rooms, v].sort();
          set("rooms", next.join(","));
        }} />
      </div>
      {Range({ from: "price_from", to: "price_to", label: "Цена", unit: "₽" })}
      {Range({ from: "area_from", to: "area_to", label: "Площадь", unit: "м²" })}
      <label className="block">
        <span className={lbl}>Этаж</span>
        <select className={field} value={f.floor ?? ""} onChange={(e) => set("floor", e.target.value)}>
          {FLOOR_OPTS.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
      </label>
      {Select({ k: "district", label: "Район", opts: DISTRICTS })}
      {Select({ k: "metro", label: "Метро", opts: METRO })}
      {Select({ k: "house", label: "Тип дома", opts: HOUSE_TYPES })}
      {Select({ k: "finish", label: "Отделка", opts: FINISHES })}
    </div>
  );
}
