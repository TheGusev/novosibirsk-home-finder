import { useState, type ReactNode } from "react";
import { KeyIcon } from "./KeyIcon";
import { submitLead, type LeadKind } from "@/lib/leads";

export const fieldCls = "h-12 w-full rounded-xl border border-input bg-background px-4 text-sm text-primary outline-none focus:ring-2 focus:ring-ring";

type Props = {
  title?: string;
  cta?: string;
  kind?: LeadKind;
  /** Дополнительные поля: name атрибуты попадут в details заявки. */
  extra?: ReactNode;
  showComment?: boolean;
  commentPlaceholder?: string;
  showName?: boolean;
  details?: Record<string, string>;
};

export function LeadForm({ title = "Оставьте заявку", cta = "Отправить заявку", kind = "general", extra, showComment = true, commentPlaceholder = "Что ищете? Район, бюджет, сроки", showName = true, details }: Props) {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <div className="rounded-2xl bg-card p-6 shadow-soft md:p-8">
      <h3 className="text-xl font-bold text-primary">{title}</h3>
      {sent ? (
        <p className="mt-4 rounded-xl bg-berry-soft p-4 text-sm text-primary">Спасибо! Заявка принята, перезвоним в рабочее время.</p>
      ) : (
        <form
          className="mt-5 grid gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const d: Record<string, string> = { ...details };
            fd.forEach((v, k) => { if (!["name", "phone", "consent"].includes(k) && String(v).trim()) d[k] = String(v); });
            setBusy(true);
            const e2 = await submitLead(kind, { name: String(fd.get("name") ?? ""), phone: String(fd.get("phone") ?? ""), consent: fd.get("consent") === "on", details: d });
            setBusy(false);
            if (e2) setErr(e2); else setSent(true);
          }}
        >
          {extra}
          {showName && <input name="name" maxLength={100} placeholder="Ваше имя" className={fieldCls} />}
          <input name="phone" required type="tel" maxLength={30} placeholder="Телефон" className={fieldCls} />
          {showComment && <textarea name="comment" rows={3} maxLength={1000} placeholder={commentPlaceholder} className="rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />}
          <label className="flex items-start gap-2 text-xs text-muted-foreground">
            <input name="consent" required type="checkbox" className="mt-0.5 accent-berry" />
            <span>Согласен на обработку персональных данных согласно <a href="/politika" className="underline">политике конфиденциальности</a></span>
          </label>
          {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
          <button disabled={busy} className="key-turn mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-berry font-semibold text-berry-foreground transition hover:brightness-110 disabled:opacity-60">
            <KeyIcon /> {busy ? "Отправляем…" : cta}
          </button>
        </form>
      )}
    </div>
  );
}
