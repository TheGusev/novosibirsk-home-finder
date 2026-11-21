import { seoHead } from "@/lib/seo";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { KeyIcon } from "./KeyIcon";

export { PHONE, PHONE_HREF } from "@/lib/contact";

export function BerryButton({ children = "Подобрать квартиру", className = "" }: { children?: ReactNode; className?: string }) {
  return (
    <Link
      to="/kontakty"
      className={`key-turn inline-flex items-center justify-center gap-2 rounded-xl bg-berry px-5 py-3 text-sm font-semibold text-berry-foreground shadow-soft transition hover:shadow-lift hover:brightness-110 ${className}`}
    >
      <KeyIcon className="h-5 w-5" />
      {children}
    </Link>
  );
}

export function Section({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return <section id={id} className={`mx-auto max-w-6xl scroll-mt-20 px-4 py-14 md:px-6 md:py-20 ${className}`}>{children}</section>;
}

export function PageHero({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 md:px-6 md:pt-16">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-berry">{eyebrow}</p>
      <h1 className="mt-3 max-w-3xl text-3xl font-extrabold text-primary md:text-5xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">{text}</p>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-card p-6 shadow-soft ${className}`}>{children}</div>;
}

export function Steps({ items }: { items: { t: string; d: string }[] }) {
  return (
    <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((s, i) => (
        <li key={s.t} className="rounded-2xl bg-card p-6 shadow-soft">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-berry-soft text-sm font-bold text-berry">{i + 1}</span>
          <h3 className="mt-4 font-bold text-primary">{s.t}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
        </li>
      ))}
    </ol>
  );
}

export function head(title: string, description: string, path: string) {
  return seoHead(title, description, path);
}
