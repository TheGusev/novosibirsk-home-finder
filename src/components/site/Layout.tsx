import { WHATSAPP_HREF, TELEGRAM_HREF, CONTACT_NAME } from "@/lib/contact";
import { SITE } from "@/config/site";
import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Menu, X, Phone } from "lucide-react";
import { PHONE, PHONE_HREF } from "./ui";
import { metrikaGoal } from "@/lib/metrika";

const NAV = [
  { to: "/kupit-kvartiru", label: "Купить" },
  { to: "/novostroyki", label: "Новостройки" },
  { to: "/prodat-kvartiru", label: "Продать" },
  { to: "/arenda", label: "Аренда" },
  { to: "/ipoteka", label: "Ипотека" },
  { to: "/kontakty", label: "Контакты" },
] as const;

const trackPhone = () => { window.__lovableEvents?.track?.("project.click_phone", {}); metrikaGoal("click_phone"); };

function Logo() {
  return (
    <Link to="/" className="flex min-w-0 items-baseline gap-2">
      <span className="truncate text-base font-bold text-primary">{SITE.name}</span>
      <span className="hidden truncate text-xs text-muted-foreground xl:inline">{SITE.tagline}</span>
    </Link>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-15 max-w-[1280px] items-center justify-between gap-4 px-4 md:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Основная навигация">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-primary" activeProps={{ className: "!text-primary font-semibold" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <a href={PHONE_HREF} onClick={trackPhone} className="hidden whitespace-nowrap px-2 text-sm font-semibold text-primary tabular lg:block">{PHONE}</a>
          <a href={PHONE_HREF} onClick={trackPhone} aria-label={`Позвонить: ${PHONE}`} className="flex h-11 w-11 items-center justify-center rounded-md text-primary lg:hidden"><Phone className="h-5 w-5" /></a>
          <button className="flex h-11 w-11 items-center justify-center rounded-md text-primary lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Закрыть меню" : "Меню"} aria-expanded={open}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="max-h-[calc(100dvh-60px)] overflow-y-auto border-t bg-background px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] lg:hidden">
          <nav className="grid py-1" aria-label="Меню">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="border-b py-3.5 font-medium text-primary">{n.label}</Link>
            ))}
          </nav>
          <p className="mt-5 text-xs text-muted-foreground">Агент {CONTACT_NAME}</p>
          <a href={PHONE_HREF} onClick={trackPhone} className="mt-1 block text-lg font-semibold text-primary tabular">{PHONE}</a>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <a href={WHATSAPP_HREF} className="flex h-11 items-center justify-center rounded-md border text-sm font-medium text-primary">WhatsApp</a>
            <a href={TELEGRAM_HREF} className="flex h-11 items-center justify-center rounded-md border text-sm font-medium text-primary">Telegram</a>
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-12 border-t bg-card text-sm">
      <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-10 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        <div>
          <p className="font-bold text-primary">{SITE.name}</p>
          <p className="mt-1 text-muted-foreground">{SITE.tagline}</p>
        </div>
        <ul className="grid content-start gap-2 text-muted-foreground">
          {NAV.map((n) => <li key={n.to}><Link to={n.to} className="hover:text-primary">{n.label}</Link></li>)}
        </ul>
        <div className="text-muted-foreground">
          <a href={PHONE_HREF} onClick={trackPhone} className="font-semibold text-primary tabular">{PHONE}</a>
          <p className="mt-1">Агент {CONTACT_NAME}</p>
          <p className="mt-1"><a href={WHATSAPP_HREF} className="hover:text-primary">WhatsApp</a> · <a href={TELEGRAM_HREF} className="hover:text-primary">Telegram</a></p>
          <p className="mt-3">Новосибирск, [заполнить адрес]</p>
          <p className="mt-1">Часы работы: [заполнить]</p>
        </div>
        <div className="text-muted-foreground">
          <p>[Название юрлица] · ИНН [заполнить] · ОГРН [заполнить]</p>
          <ul className="mt-3 grid gap-2">
            <li><Link to="/politika" className="underline hover:text-primary">Политика конфиденциальности</Link></li>
            <li><Link to="/politika" hash="soglasie" className="underline hover:text-primary">Согласие на обработку данных</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} {SITE.name}</div>
    </footer>
  );
}

/** Один нижний CTA на телефоне — выводится страницей только там, где он нужен. */
export function MobileAction({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="h-[calc(72px+env(safe-area-inset-bottom))] lg:hidden" aria-hidden />
      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur lg:hidden">{children}</div>
    </>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2">К содержимому</a>
      <Header />
      <main id="main" className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
