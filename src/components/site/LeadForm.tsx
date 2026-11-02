import { useState } from "react";
import { KeyIcon } from "./KeyIcon";

export function LeadForm({ title = "Оставьте заявку", cta = "Отправить заявку" }: { title?: string; cta?: string }) {
  const [sent, setSent] = useState(false);
  return (
    <div className="rounded-2xl bg-card p-6 shadow-soft md:p-8">
      <h3 className="text-xl font-bold text-primary">{title}</h3>
      {sent ? (
        <p className="mt-4 rounded-xl bg-berry-soft p-4 text-sm text-primary">
          Спасибо! Мы перезвоним в рабочее время. (Отправка заявок заработает после подключения базы.)
        </p>
      ) : (
        <form
          className="mt-5 grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <input required placeholder="Ваше имя" className="h-12 rounded-xl border border-input bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-ring" />
          <input required type="tel" placeholder="Телефон" className="h-12 rounded-xl border border-input bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-ring" />
          <textarea rows={3} placeholder="Что ищете? Район, бюджет, сроки" className="rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
          <label className="flex items-start gap-2 text-xs text-muted-foreground">
            <input required type="checkbox" className="mt-0.5 accent-berry" />
            <span>
              Согласен на обработку персональных данных согласно <a href="/politika" className="underline">политике конфиденциальности</a>
            </span>
          </label>
          <button className="key-turn mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-berry font-semibold text-berry-foreground transition hover:brightness-110">
            <KeyIcon /> {cta}
          </button>
        </form>
      )}
    </div>
  );
}
