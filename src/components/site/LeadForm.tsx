import { useRef, useState, type ReactNode } from "react";
import { LEAD_SUCCESS, submitLead, type LeadKind, type LeadType } from "@/lib/leads";
import { maskPhone } from "@/lib/lead-schema";
import { metrikaGoal } from "@/lib/metrika";
import { Button } from "@/components/ui/button";
import { DISTRICTS, ROOMS } from "@/lib/catalog";

export const fieldCls = "h-12 w-full rounded-md border-input bg-background px-4 text-sm text-primary outline-none focus:ring-2 focus:ring-ring";

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
  type?: LeadType;
  propertyId?: string;
};

export function LeadForm({ title = "Оставьте заявку", cta = "Отправить заявку", kind = "general", extra, showComment = true, commentPlaceholder = "Что ищете? Район, бюджет, сроки", showName = true, details, type, propertyId }: Props) {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const opened = useRef(false);
  const submitting = useRef(false);
  const category = type ?? (kind === "valuation" ? "valuation" : kind === "complex_selection" || kind === "rent" ? "selection" : "question");
  return (
    <div className="rounded-lg bg-card p-6 border md:p-8">
      <h3 className="text-xl font-bold text-primary">{title}</h3>
      {sent ? (
        <p role="status" className="mt-4 rounded-md bg-brand-soft p-4 text-sm text-primary">{LEAD_SUCCESS}</p>
      ) : (
        <form
          className="mt-5 grid gap-3"
          onFocusCapture={() => {
            if (opened.current) return;
            opened.current = true;
            window.__lovableEvents?.track?.("project.open_form", { type: category });
            metrikaGoal("open_form", { type: category });
          }}
          onSubmit={async (e) => {
            e.preventDefault();
            if (submitting.current) return;
            const fd = new FormData(e.currentTarget);
            const d: Record<string, string> = { ...details };
            fd.forEach((v, k) => { if (!["name", "phone", "consent", "website"].includes(k) && String(v).trim()) d[k] = String(v); });
            submitting.current = true;
            setErr(null);
            setBusy(true);
            const e2 = await submitLead(kind, { name: String(fd.get("name") ?? ""), phone: String(fd.get("phone") ?? ""), consent: fd.get("consent") === "on", details: d, type: category, ...(propertyId ? { propertyId } : {}), website: String(fd.get("website") ?? "") });
            submitting.current = false;
            setBusy(false);
            if (e2) setErr(e2); else setSent(true);
          }}
        >
          {extra}
          {showName && <input name="name" aria-label="Ваше имя" autoComplete="name" maxLength={100} placeholder="Ваше имя" className={fieldCls} />}
          <input name="phone" aria-label="Телефон" required type="tel" inputMode="tel" autoComplete="tel" maxLength={18} placeholder="+7 (___) ___-__-__" value={phone} onChange={e => setPhone(maskPhone(e.target.value))} className={fieldCls} />
          {category === "selection" && <div className="grid gap-3 sm:grid-cols-3">
            <input name="budget" aria-label="Бюджет" inputMode="decimal" maxLength={15} placeholder="Бюджет, ₽" className={fieldCls} />
            <select name="rooms" aria-label="Комнаты" className={fieldCls}><option value="">Комнаты</option>{ROOMS.map(r => <option key={r.v} value={r.l}>{r.l}</option>)}</select>
            <select name="district" aria-label="Район" className={fieldCls}><option value="">Район</option>{DISTRICTS.map(d => <option key={d}>{d}</option>)}</select>
          </div>}
          <label className="sr-only" aria-hidden="true">Ваш сайт<input name="website" tabIndex={-1} autoComplete="off" maxLength={200} /></label>
          {showComment && <textarea name="comment" rows={3} maxLength={1000} placeholder={commentPlaceholder} className="border rounded-md border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />}
          <label className="flex items-start gap-2 text-xs text-muted-foreground">
            <input name="consent" required type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-0.5 accent-brand" />
            <span>Согласен на обработку персональных данных согласно <a href="/politika" className="underline">политике конфиденциальности</a></span>
          </label>
          {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
          <Button type="submit" disabled={busy || !consent} className="mt-1 h-12 rounded-md bg-brand font-semibold text-brand-foreground hover:bg-brand hover:brightness-110">
             {busy ? "Отправляем…" : cta}
          </Button>
        </form>
      )}
    </div>
  );
}
