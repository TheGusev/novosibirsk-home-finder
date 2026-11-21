import { useRef, useState } from "react";
import { monthlyPayment } from "@/lib/mortgage";
import { metrikaGoal } from "@/lib/metrika";

const fmt = (n: number) => Math.round(n).toLocaleString("ru-RU") + " ₽";
const num = (s: string) => Number(s.replace(/\s/g, "").replace(",", ".")) || 0;
const field = "h-12 w-full rounded-xl border border-input bg-background px-4 text-sm text-primary outline-none focus:ring-2 focus:ring-ring";

export function MortgageCalc() {
  const [v, setV] = useState({ price: "", down: "", years: "", rate: "" });
  const tracked = useRef("");
  const r = monthlyPayment(num(v.price), num(v.down), num(v.years), num(v.rate));
  const ready = num(v.price) > 0 && num(v.years) > 0 && v.rate !== "";
  const inp = (k: keyof typeof v, label: string, ph: string) => (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{label}</span>
      <input inputMode="decimal" placeholder={ph} className={field} value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} onBlur={() => {
        if (!ready || num(v.down) < 0 || num(v.down) >= num(v.price) || num(v.rate) < 0) return;
        const signature = JSON.stringify(v);
        if (tracked.current === signature) return;
        tracked.current = signature;
        window.__lovableEvents?.track?.("project.calc_mortgage", {});
        metrikaGoal("calc_mortgage");
      }} />
    </label>
  );
  return (
    <div className="grid gap-6 rounded-2xl bg-card p-5 shadow-soft md:grid-cols-2 md:p-8">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">{inp("price", "Стоимость квартиры, ₽", "например, 6 000 000")}</div>
        <div className="col-span-2">{inp("down", "Первоначальный взнос, ₽", "например, 1 500 000")}</div>
        {inp("years", "Срок, лет", "20")}
        {inp("rate", "Ставка, % годовых", "введите ставку")}
      </div>
      <div className="flex flex-col justify-between rounded-xl bg-primary p-6 text-primary-foreground">
        <div>
          <p className="text-sm opacity-75">Ежемесячный платёж</p>
          <p className="mt-1 text-3xl font-extrabold md:text-4xl">{ready ? fmt(r.payment) : "—"}</p>
          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div><dt className="opacity-70">Сумма кредита</dt><dd className="font-semibold">{ready ? fmt(r.loan) : "—"}</dd></div>
            <div><dt className="opacity-70">Переплата</dt><dd className="font-semibold">{ready ? fmt(r.overpay) : "—"}</dd></div>
          </dl>
        </div>
        <p className="mt-6 text-xs opacity-70">Расчёт ориентировочный и не является одобрением кредита.</p>
      </div>
    </div>
  );
}
