import { useState } from "react";
import { KeyIcon } from "./KeyIcon";

const field = "h-12 w-full rounded-xl border border-input bg-background px-4 text-sm text-primary outline-none focus:ring-2 focus:ring-ring";
const NEEDS = ["Купить", "Продать", "Ипотека"];

export function FinalForm() {
  const [need, setNeed] = useState("Купить");
  const [sent, setSent] = useState(false);
  if (sent)
    return <div className="rounded-2xl bg-card p-8 text-primary shadow-soft">Спасибо! Перезвоним в рабочее время. (Отправка заявок заработает после подключения базы.)</div>;
  return (
    <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="grid gap-3 rounded-2xl bg-card p-5 shadow-soft md:p-8">
      <div className="grid gap-3 sm:grid-cols-2">
        <input required placeholder="Имя" className={field} />
        <input required type="tel" placeholder="Телефон" className={field} />
      </div>
      <fieldset>
        <legend className="mb-2 text-xs font-semibold text-muted-foreground">Что нужно</legend>
        <div className="grid grid-cols-3 gap-2">
          {NEEDS.map((n) => (
            <button type="button" key={n} onClick={() => setNeed(n)} aria-pressed={need === n}
              className={`h-11 rounded-xl text-sm font-semibold transition ${need === n ? "bg-primary text-primary-foreground" : "border border-input bg-background text-primary"}`}>
              {n}
            </button>
          ))}
        </div>
      </fieldset>
      <textarea rows={3} placeholder="Комментарий: район, бюджет, сроки" className="rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
      <label className="flex items-start gap-2 text-xs text-muted-foreground">
        <input required type="checkbox" className="mt-0.5 accent-berry" />
        <span>Согласен на <a href="/politika#soglasie" className="underline">обработку персональных данных</a></span>
      </label>
      <button className="key-turn inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-berry font-semibold text-berry-foreground transition hover:brightness-110">
        <KeyIcon /> Отправить заявку
      </button>
    </form>
  );
}
