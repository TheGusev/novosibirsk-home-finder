import { seoHead, faqSchema } from "@/lib/seo";
import { CollectionLinks } from "@/components/site/CollectionLinks";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Home, Building2, KeyRound, Repeat, DoorOpen, FileSearch, ArrowRight, User, ChevronDown } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { HomeHero } from "@/components/site/HomeHero";
import { Section } from "@/components/site/ui";
import { KeyIcon } from "@/components/site/KeyIcon";
import { PropertyCard } from "@/components/site/PropertyCard";
import { useSuspenseQuery } from "@tanstack/react-query";
import { propertiesQuery } from "@/lib/properties-query";
import { applyFilters } from "@/lib/catalog";
import { MortgageCalc } from "@/components/site/MortgageCalc";
import { FinalForm } from "@/components/site/FinalForm";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  loader: ({ context }) => context.queryClient.ensureQueryData(propertiesQuery),
  head: () => seoHead('Купить квартиру в Новосибирске', 'Новостройки и вторичное жильё в Новосибирске и области. Понятная цена, проверка документов и сопровождение сделки.', '/', { schemas: [faqSchema(FAQ)] }),
  errorComponent: () => <SiteLayout><Section><h1 className="text-2xl font-bold text-primary">Не удалось загрузить страницу</h1><p className="mt-3 text-muted-foreground">Обновите страницу.</p></Section></SiteLayout>,
  notFoundComponent: () => <SiteLayout><Section><h1 className="text-2xl font-bold text-primary">Страница не найдена</h1></Section></SiteLayout>,
  component: Index,
});

const TASKS = [
  { to: "/kupit-kvartiru", icon: Home, t: "Купить квартиру", d: "Вторичка: подбор, показы, проверка" },
  { to: "/novostroyki", icon: Building2, t: "Купить новостройку", d: "Сравнение ЖК и проверка договора" },
  { to: "/prodat-kvartiru", icon: KeyRound, t: "Продать квартиру", d: "Оценка, показы и расчёты" },
  { to: "/prodat-i-kupit", icon: Repeat, t: "Продать и купить другую", d: "Альтернативная сделка в одной цепочке" },
  { to: "/arenda", icon: DoorOpen, t: "Снять / сдать", d: "Поиск и договор аренды" },
  { to: "/proverka-obekta", icon: FileSearch, t: "Проверить объект", d: "Документы и история квартиры" },
] as const;

const STEPS = [
  ["Подбор", "Уточняем задачу и отбираем подходящие варианты"],
  ["Просмотр", "Едем смотреть, замечаем то, что не видно на фото"],
  ["Проверка документов", "Смотрим права, обременения и историю объекта"],
  ["Финансирование", "Собственные средства, ипотека, сертификаты"],
  ["Договор и расчёты", "Готовим договор и выбираем способ расчётов"],
  ["Регистрация", "Подаём документы на переход права"],
  ["Ключи у вас", "Подписываем акт — ключ, бери"],
];

const SERVICES = [
  "Консультация и план сделки",
  "Подбор и показы квартир",
  "Проверка документов объекта",
  "Помощь с ипотекой",
  "Подготовка договора и сопровождение расчётов",
  "Продажа вашей квартиры",
];

const TEAM = ["Специалист по покупке", "Специалист по продаже", "Ипотечный брокер", "Юрист"];

const FAQ: [string, string][] = [
  ["Из чего складываются расходы при покупке?", "Помимо цены квартиры обычно есть расходы на проверку и оформление документов, госпошлину за регистрацию, услуги банка и страхование при ипотеке, способ расчётов (ячейка или аккредитив) и услуги агентства. Точный список зависит от сделки — мы составим его до задатка."],
  ["Как проверяется квартира?", "Запрашиваем выписку из ЕГРН, смотрим основания владения, обременения, зарегистрированных лиц, историю перехода прав и соответствие планировки документам. О найденных рисках рассказываем простыми словами."],
  ["Можно ли купить квартиру в ипотеку?", "Да, если банк одобрит кредит. Поможем сравнить программы, подготовить документы и подать заявки. Решение об одобрении принимает банк."],
  ["Как продать и купить одновременно?", "Через альтернативную сделку: продажа вашей квартиры и покупка новой согласуются по срокам и расчётам, чтобы вы не остались без жилья."],
  ["Сколько занимает сделка?", "Зависит от рынка, финансирования, документов и участников. Обсудим реалистичный план на первой консультации."],
  ["Что такое альтернативная сделка?", "Это цепочка, где деньги от продажи одной квартиры идут на покупку другой. Важно синхронизировать все сделки — этим мы и занимаемся."],
];

function H2({ eyebrow, children }: { eyebrow: string; children: string }) {
  return (
    <div className="mb-8">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-berry"><KeyIcon className="h-4 w-4" />{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-extrabold text-primary md:text-4xl">{children}</h2>
    </div>
  );
}

function Index() {
  return (
    <SiteLayout>
      <HomeHero />

      <Section>
        <H2 eyebrow="Сценарии">С какой задачей вы пришли</H2>
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3">
          {TASKS.map((s) => (
            <Link key={s.to} to={s.to} className="group flex flex-col rounded-2xl bg-card p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift md:p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary"><s.icon className="h-5 w-5" strokeWidth={1.8} /></span>
              <h3 className="mt-4 font-bold leading-tight text-primary md:text-lg">{s.t}</h3>
              <p className="mt-1 hidden text-sm text-muted-foreground sm:block">{s.d}</p>
              <ArrowRight className="mt-auto h-4 w-4 pt-0 text-berry opacity-0 transition group-hover:opacity-100 sm:mt-4" />
            </Link>
          ))}
        </div>
      </Section>

      <div className="bg-primary text-primary-foreground">
        <Section>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-berry-soft"><KeyIcon className="h-4 w-4" />Путь к ключам</p>
          <h2 className="mt-2 text-2xl font-extrabold md:text-4xl">Как проходит сделка</h2>
          <ol className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-7">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="relative border-l border-primary-foreground/20 pl-5 lg:border-l-0 lg:border-t lg:pl-0 lg:pt-5">
                <span className={`absolute -left-[9px] top-0 flex h-[18px] w-[18px] items-center justify-center rounded-full text-[10px] font-bold lg:-top-[9px] lg:left-0 ${i === STEPS.length - 1 ? "bg-berry text-berry-foreground" : "bg-primary-foreground text-primary"}`}>{i + 1}</span>
                <h3 className="font-bold">{t}</h3>
                <p className="mt-1 text-sm opacity-70">{d}</p>
              </li>
            ))}
          </ol>
        </Section>
      </div>

      <Section>
        <H2 eyebrow="Открытая комиссия">Что входит в наши услуги и сколько это стоит</H2>
        <div className="overflow-hidden rounded-2xl bg-card shadow-soft">
          <div className="hidden grid-cols-[2fr_1fr_1fr] bg-accent px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground md:grid">
            <span>Услуга</span><span>Что входит</span><span className="text-right">Стоимость</span>
          </div>
          {SERVICES.map((s) => (
            <div key={s} className="grid gap-1 border-t px-5 py-4 first:border-t-0 md:grid-cols-[2fr_1fr_1fr] md:items-center md:px-6">
              <span className="font-semibold text-primary">{s}</span>
              <span className="text-sm text-muted-foreground">[заполнить]</span>
              <span className="text-sm font-bold text-primary md:text-right">[заполнить]</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Комиссию называем открыто и фиксируем в договоре до начала работы.</p>
      </Section>

      <Section className="pt-0 md:pt-0">
        <div className="flex items-end justify-between gap-4">
          <H2 eyebrow="Подборка">Квартиры в Новосибирске</H2>
          <Link to="/kupit-kvartiru" className="mb-9 shrink-0 text-sm font-semibold text-berry">Все →</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <HomeListings />
        </div>
      </Section>

      <Section className="pt-0 md:pt-0">
        <H2 eyebrow="Ипотека">Рассчитайте ежемесячный платёж</H2>
        <MortgageCalc />
      </Section>

      <Section className="pt-0 md:pt-0">
        <H2 eyebrow="Команда">Кто будет вести вашу сделку</H2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {TEAM.map((r) => (
            <div key={r} className="overflow-hidden rounded-2xl bg-card shadow-soft">
              <div className="flex aspect-square items-center justify-center bg-accent text-primary/30"><User className="h-16 w-16" strokeWidth={1.2} /></div>
              <div className="p-4">
                <p className="font-bold text-primary">Имя [заполнить]</p>
                <p className="mt-1 text-sm text-muted-foreground">{r} [заполнить]</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="max-w-3xl pt-0 md:pt-0">
        <H2 eyebrow="Вопросы">Частые вопросы</H2>
        <div className="grid gap-3">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group rounded-2xl bg-card p-5 shadow-soft">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-primary">
                {q}<ChevronDown className="h-5 w-5 shrink-0 text-berry transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section className="pt-0 md:pt-0"><CollectionLinks /></Section>
      <Section className="grid gap-8 pt-0 md:grid-cols-[1fr_1.2fr] md:items-center md:pt-0">
        <div>
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-berry"><KeyIcon className="h-8 w-8" /></span>
          <h2 className="mt-5 text-2xl font-extrabold text-primary md:text-4xl">Ключ — в ваши руки</h2>
          <p className="mt-3 text-muted-foreground">Расскажите о задаче — перезвоним, ответим на вопросы и предложим план. Ни к чему не обязывает.</p>
        </div>
        <FinalForm />
      </Section>
    </SiteLayout>
  );
}

function HomeListings() {
  const { data } = useSuspenseQuery(propertiesQuery);
  return <>{applyFilters(data ?? [], {}).slice(0, 6).map((p) => <PropertyCard key={p.id} p={p} />)}</>;
}
