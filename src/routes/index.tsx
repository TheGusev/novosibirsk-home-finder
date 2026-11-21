import { seoHead, faqSchema } from "@/lib/seo";
import { CollectionLinks } from "@/components/site/CollectionLinks";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChevronDown } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { HomeHero } from "@/components/site/HomeHero";
import tourPoster from "@/assets/tour/living.webp";
import { Section, SectionTitle, Steps } from "@/components/site/ui";
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

const DIRECTIONS = [
  { to: "/prodat-kvartiru", t: "Продать квартиру", d: "Оценка по сделкам рядом, показы, договор и расчёты" },
  { to: "/prodat-i-kupit", t: "Обменять", d: "Продать свою и купить другую в одной цепочке" },
  { to: "/proverka-obekta", t: "Проверить объект", d: "Документы, обременения и история квартиры" },
] as const;

const STEPS = [
  { t: "Подбор и показы", d: "Отбираем варианты под задачу и бюджет, едем смотреть." },
  { t: "Проверка документов", d: "Права, обременения, зарегистрированные лица, история." },
  { t: "Финансирование", d: "Собственные средства, ипотека, сертификаты." },
  { t: "Договор и регистрация", d: "Договор, безопасные расчёты, переход права." },
];

const FAQ: [string, string][] = [
  ["Из чего складываются расходы при покупке?", "Помимо цены квартиры обычно есть расходы на проверку и оформление документов, госпошлину за регистрацию, услуги банка и страхование при ипотеке, способ расчётов (ячейка или аккредитив) и услуги агентства. Точный список зависит от сделки — мы составим его до задатка."],
  ["Как проверяется квартира?", "Запрашиваем выписку из ЕГРН, смотрим основания владения, обременения, зарегистрированных лиц, историю перехода прав и соответствие планировки документам. О найденных рисках рассказываем простыми словами."],
  ["Можно ли купить квартиру в ипотеку?", "Да, если банк одобрит кредит. Поможем сравнить программы, подготовить документы и подать заявки. Решение об одобрении принимает банк."],
  ["Как продать и купить одновременно?", "Через альтернативную сделку: продажа вашей квартиры и покупка новой согласуются по срокам и расчётам, чтобы вы не остались без жилья."],
  ["Сколько занимает сделка?", "Зависит от рынка, финансирования, документов и участников. Обсудим реалистичный план на первой консультации."],
  ["Что такое альтернативная сделка?", "Это цепочка, где деньги от продажи одной квартиры идут на покупку другой. Важно синхронизировать все сделки — этим мы и занимаемся."],
];

function Index() {
  return (
    <SiteLayout>
      <HomeHero />

      <Section>
        <SectionTitle action={<Link to="/kupit-kvartiru" className="text-sm font-semibold text-brand hover:underline">Весь каталог</Link>}>Актуальные предложения</SectionTitle>
        <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          <HomeListings />
        </div>
      </Section>

      <Section className="pt-0 md:pt-0">
        <ul className="grid divide-y rounded-lg border bg-card md:grid-cols-3 md:divide-x md:divide-y-0">
          {DIRECTIONS.map((s) => (
            <li key={s.to}>
              <Link to={s.to} className="group flex h-full items-start justify-between gap-4 p-5 hover:bg-muted/50">
                <span><span className="block font-semibold text-primary">{s.t}</span><span className="mt-1 block text-sm text-muted-foreground">{s.d}</span></span>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-brand" />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="grid gap-8 pt-0 md:pt-0 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <SectionTitle>Что входит в услугу</SectionTitle>
          <Steps items={STEPS} />
          <p className="mt-5 text-sm text-muted-foreground">Стоимость услуг: [заполнить]. Условия фиксируем в договоре до начала работы.</p>
        </div>
        <TourPreview />
      </Section>

      <Section className="pt-0 md:pt-0">
        <SectionTitle>Ипотечный платёж</SectionTitle>
        <MortgageCalc />
      </Section>

      <Section className="grid gap-10 pt-0 md:pt-0 lg:grid-cols-[1fr_1fr]">
        <div>
          <SectionTitle>Частые вопросы</SectionTitle>
          <div className="divide-y border-y">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group py-1">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 font-medium text-primary">
                  {q}<ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition group-open:rotate-180" />
                </summary>
                <p className="pb-4 text-sm leading-relaxed text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </div>
        <div>
          <SectionTitle>Задать вопрос</SectionTitle>
          <FinalForm />
        </div>
      </Section>

      <Section className="pt-0 md:pt-0"><CollectionLinks /></Section>
    </SiteLayout>
  );
}

function TourPreview() {
  return (
    <Link to="/tur" className="group relative block overflow-hidden rounded-lg border bg-card">
      <img src={tourPoster} alt="" width={1600} height={1008} loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
      <span className="absolute left-3 top-3 rounded bg-card/95 px-1.5 py-0.5 text-[11px] font-semibold text-primary">Демонстрационная квартира</span>
      <span className="flex items-center justify-between gap-3 p-4">
        <span><span className="block font-semibold text-primary">Посмотреть квартиру изнутри</span><span className="block text-sm text-muted-foreground">Пример рум-тура: 5 комнат и план</span></span>
        <ArrowRight className="h-4 w-4 shrink-0 text-brand" />
      </span>
    </Link>
  );
}

function HomeListings() {
  const { data } = useSuspenseQuery(propertiesQuery);
  return <>{applyFilters(data ?? [], {}).slice(0, 6).map((p, i) => <PropertyCard key={p.id} p={p} priority={i < 3} />)}</>;
}
