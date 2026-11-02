import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Home, KeyRound, Landmark, ShieldCheck, FileText, MessageSquare } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { SiteLayout } from "@/components/site/Layout";
import { BerryButton, Section, Card, Steps } from "@/components/site/ui";
import { ListingCard } from "@/components/site/ListingCard";
import { LeadForm } from "@/components/site/LeadForm";
import { LISTINGS } from "@/lib/listings";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ключбери — недвижимость Новосибирска и области" },
      { name: "description", content: "Агентство недвижимости «Ключбери»: покупка, продажа, аренда квартир и ипотека в Новосибирске и области. Сделка — по понятным правилам." },
      { property: "og:title", content: "Ключбери — недвижимость Новосибирска и области" },
      { property: "og:description", content: "Ключ — в ваши руки. Сделка — по понятным правилам." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const SERVICES = [
  { to: "/kupit-kvartiru", icon: Home, t: "Купить", d: "Подберём квартиру под ваш бюджет и район" },
  { to: "/novostroyki", icon: Building2, t: "Новостройки", d: "Поможем разобраться в застройщиках и сроках" },
  { to: "/prodat-kvartiru", icon: KeyRound, t: "Продать", d: "Оценка, подготовка и показы без суеты" },
  { to: "/ipoteka", icon: Landmark, t: "Ипотека", d: "Сравним условия и поможем с одобрением" },
] as const;

function Index() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 pt-6 md:px-6 md:pt-10">
        <div className="relative overflow-hidden rounded-2xl shadow-lift">
          <img src={hero} alt="Светлая квартира с видом на Новосибирск" width={1600} height={1104} className="h-[560px] w-full object-cover md:h-[620px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/55 to-primary/5" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/80">Недвижимость Новосибирска и области</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-extrabold leading-[1.05] text-primary-foreground md:text-6xl">
              Ключ — в ваши руки.
              <br />
              <span className="opacity-80">Сделка — по понятным правилам.</span>
            </h1>
            <div className="mt-7 flex flex-wrap gap-3">
              <BerryButton />
              <Link to="/prodat-kvartiru" className="inline-flex items-center rounded-xl bg-primary-foreground/15 px-5 py-3 text-sm font-semibold text-primary-foreground backdrop-blur hover:bg-primary-foreground/25">
                Продать квартиру
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <Link key={s.to} to={s.to} className="rounded-2xl bg-card p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
              <s.icon className="h-7 w-7 text-primary" strokeWidth={1.6} />
              <h3 className="mt-4 text-lg font-bold text-primary">{s.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section className="pt-0 md:pt-0">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-extrabold text-primary md:text-4xl">Квартиры в продаже</h2>
          <Link to="/kupit-kvartiru" className="text-sm font-semibold text-berry">Все →</Link>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Примеры карточек — реальные объекты появятся после подключения базы.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {LISTINGS.map((l) => <ListingCard key={l.id} l={l} />)}
        </div>
      </Section>

      <Section className="pt-0 md:pt-0">
        <h2 className="text-2xl font-extrabold text-primary md:text-4xl">Понятные правила</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card><FileText className="h-6 w-6 text-berry" /><h3 className="mt-3 font-bold text-primary">Договор до начала работы</h3><p className="mt-2 text-sm text-muted-foreground">Стоимость услуг и обязанности сторон фиксируем заранее. [заполнить]</p></Card>
          <Card><ShieldCheck className="h-6 w-6 text-berry" /><h3 className="mt-3 font-bold text-primary">Проверка объекта</h3><p className="mt-2 text-sm text-muted-foreground">Смотрим документы и историю квартиры до задатка. [заполнить]</p></Card>
          <Card><MessageSquare className="h-6 w-6 text-berry" /><h3 className="mt-3 font-bold text-primary">Без давления</h3><p className="mt-2 text-sm text-muted-foreground">Объясняем каждый шаг и не торопим с решением.</p></Card>
        </div>
      </Section>

      <Section className="pt-0 md:pt-0">
        <h2 className="mb-8 text-2xl font-extrabold text-primary md:text-4xl">Как проходит сделка</h2>
        <Steps items={[
          { t: "Знакомство", d: "Обсуждаем задачу, бюджет и сроки" },
          { t: "Подбор и показы", d: "Отбираем варианты и ездим смотреть" },
          { t: "Проверка и сделка", d: "Проверяем документы, готовим договор" },
          { t: "Ключи", d: "Ключ, бери — квартира ваша" },
        ]} />
      </Section>

      <Section className="grid items-center gap-10 pt-0 md:grid-cols-2 md:pt-0">
        <div>
          <h2 className="text-2xl font-extrabold text-primary md:text-4xl">Расскажите, что ищете</h2>
          <p className="mt-3 text-muted-foreground">Перезвоним, уточним детали и пришлём подборку. Бесплатно и ни к чему не обязывает.</p>
        </div>
        <LeadForm title="Подбор квартиры" />
      </Section>
    </SiteLayout>
  );
}
