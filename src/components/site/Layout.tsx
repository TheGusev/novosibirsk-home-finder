import { WHATSAPP_HREF, TELEGRAM_HREF } from "@/lib/contact";
import { Link } from "@tanstack/react-router";
import { createElement, useState, type ReactNode } from "react";
import { Menu, X, Phone, MessageCircle, Send } from "lucide-react";
import { KeyIcon } from "./KeyIcon";
import { BerryButton, PHONE, PHONE_HREF } from "./ui";
import { metrikaGoal } from "@/lib/metrika";

const NAV = [
  { to: "/kupit-kvartiru", label: "Купить" },
  { to: "/novostroyki", label: "Новостройки" },
  { to: "/prodat-kvartiru", label: "Продать" },
  { to: "/arenda", label: "Аренда" },
  { to: "/ipoteka", label: "Ипотека" },
  { to: "/kontakty", label: "Контакты" },
] as const;

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-berry">
        <KeyIcon className="h-6 w-6" />
      </span>
      <span className="leading-tight">
        <span className="block text-lg font-extrabold text-primary">Ключбери</span>
        <span className="block text-[11px] text-muted-foreground">Недвижимость Новосибирска и области</span>
      </span>
    </Link>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Logo />
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="text-sm font-medium text-primary/80 hover:text-primary" activeProps={{ className: "text-primary font-bold" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-4 lg:flex">
          <a href={PHONE_HREF} onClick={() => { window.__lovableEvents?.track?.("project.click_phone", {}); metrikaGoal("click_phone"); }} className="text-sm font-semibold text-primary">{PHONE}</a>
          <BerryButton />
        </div>
        <button className="rounded-lg p-2 text-primary lg:hidden" onClick={() => setOpen(!open)} aria-label="Меню">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t bg-background px-4 pb-6 lg:hidden">
          <nav className="grid py-2">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="border-b py-3 font-medium text-primary">
                {n.label}
              </Link>
            ))}
          </nav>
          <a href={PHONE_HREF} onClick={() => { window.__lovableEvents?.track?.("project.click_phone", {}); metrikaGoal("click_phone"); }} className="mt-4 block font-semibold text-primary">{PHONE}</a>
          <BerryButton className="mt-4 w-full" />
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-primary pb-28 text-primary-foreground lg:pb-0">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div>
          <div className="flex items-center gap-2 text-lg font-extrabold">
            <KeyIcon className="h-6 w-6 text-berry" /> Ключбери
          </div>
          <p className="mt-3 text-sm opacity-75">Ключ — в ваши руки. Сделка — по понятным правилам.</p>
        </div>
        <div>
          <h4 className="text-sm font-bold">Разделы</h4>
          <ul className="mt-3 grid gap-2 text-sm opacity-80">
            {NAV.map((n) => (
              <li key={n.to}><Link to={n.to} className="hover:opacity-100">{n.label}</Link></li>
            ))}
          </ul>
        </div>
        <div className="text-sm">
          <h4 className="font-bold">Контакты</h4>
          <p className="mt-3 opacity-80"><a href={PHONE_HREF} onClick={() => { window.__lovableEvents?.track?.("project.click_phone", {}); metrikaGoal("click_phone"); }}>{PHONE}</a></p>
          <p className="mt-1 opacity-80">info@kluchberi.ru</p>
          <p className="mt-1 opacity-80">Новосибирск, [заполнить адрес]</p>
          <h4 className="mt-5 font-bold">Часы работы</h4>
          <p className="mt-2 opacity-80">Пн–Пт: [заполнить]<br />Сб–Вс: [заполнить]</p>
        </div>
        <div className="text-sm">
          <h4 className="font-bold">Реквизиты</h4>
          <p className="mt-3 opacity-80">ООО «Ключбери»<br />ИНН [заполнить]<br />ОГРН [заполнить]<br />Юр. адрес: [заполнить]</p>
          <ul className="mt-5 grid gap-2 opacity-80">
            <li><Link to="/politika" className="underline">Политика конфиденциальности</Link></li>
            <li><Link to="/politika" hash="soglasie" className="underline">Согласие на обработку персональных данных</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-5 text-center text-xs opacity-60">© {new Date().getFullYear()} Ключбери · kluchberi.ru</div>
    </footer>
  );
}

function MobileBar() {
  const item = "flex flex-col items-center gap-1 py-2 text-[11px] font-semibold text-primary";
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t bg-card/95 pb-[env(safe-area-inset-bottom)] shadow-lift backdrop-blur lg:hidden">
      <a href={PHONE_HREF} onClick={() => { window.__lovableEvents?.track?.("project.click_phone", {}); metrikaGoal("click_phone"); }} className={item}><Phone className="h-5 w-5" />Позвонить</a>
      <a href={WHATSAPP_HREF} className={item}><MessageCircle className="h-5 w-5" />WhatsApp</a>
      <a href={TELEGRAM_HREF} className={item}><Send className="h-5 w-5" />Telegram</a>
      <Link to="/kontakty" className="key-turn m-1.5 flex flex-col items-center justify-center gap-1 rounded-xl bg-berry text-[11px] font-semibold text-berry-foreground">
        <KeyIcon className="h-5 w-5" />Подбор
      </Link>
    </nav>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  // Keep the shared wrapper independent of the preview's lazy jsxDEV binding.
  // A stale hot-update runtime must not prevent every page from mounting.
  return createElement(
    "div",
    { className: "flex min-h-screen flex-col" },
    createElement(Header),
    createElement("main", { className: "flex-1" }, children),
    createElement(Footer),
    createElement(MobileBar),
  );
}
