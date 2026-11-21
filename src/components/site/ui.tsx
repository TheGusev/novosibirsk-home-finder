import { seoHead } from "@/lib/seo";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export { PHONE, PHONE_HREF } from "@/lib/contact";

export const btn = {
  primary: "inline-flex h-12 items-center justify-center gap-2 rounded-md bg-brand px-5 text-sm font-semibold text-brand-foreground transition hover:brightness-110 disabled:opacity-60",
  secondary: "inline-flex h-12 items-center justify-center gap-2 rounded-md border-input bg-card px-5 text-sm font-semibold text-primary transition hover:border-primary/40",
} as const;

export function BrandButton({ children = "Подобрать квартиру", className = "" }: { children?: ReactNode; className?: string }) {
  return <Link to="/kontakty" className={`${btn.primary} ${className}`}>{children}</Link>;
}

export function Section({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return <section id={id} className={`mx-auto max-w-[1280px] scroll-mt-20 px-4 py-8 md:px-6 md:py-12 ${className}`}>{children}</section>;
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <h2 className="text-xl font-bold text-primary md:text-2xl">{children}</h2>
      {action}
    </div>
  );
}

/** Eyebrow kept for API compatibility; rendered only as a small breadcrumb-like label. */
export function PageHero({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="mx-auto max-w-[1280px] px-4 pt-6 md:px-6 md:pt-10">
      <p className="text-sm text-muted-foreground">{eyebrow}</p>
      <h1 className="mt-1 max-w-3xl text-[1.75rem] font-bold leading-tight text-primary md:text-[2.5rem]">{title}</h1>
      <p className="mt-3 max-w-2xl text-base text-muted-foreground">{text}</p>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-lg border bg-card p-5 ${className}`}>{children}</div>;
}

export function Steps({ items }: { items: { t: string; d: string }[] }) {
  return (
    <ol className="grid gap-x-8 gap-y-5 border-t pt-5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((s, i) => (
        <li key={s.t} className="grid grid-cols-[28px_1fr] gap-x-2">
          <span className="text-sm font-semibold text-brand tabular">{String(i + 1).padStart(2, "0")}</span>
          <div>
            <h3 className="font-semibold text-primary">{s.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="border rounded-lg border-dashed bg-card px-5 py-10 text-center">
      <p className="font-semibold text-primary">{title}</p>
      {text && <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function head(title: string, description: string, path: string) {
  return seoHead(title, description, path);
}
