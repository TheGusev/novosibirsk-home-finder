import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero, Section, Steps, head } from "@/components/site/ui";
import { LeadForm } from "@/components/site/LeadForm";

export const Route = createFileRoute("/prodat-kvartiru")({
  head: () => head("Продать квартиру в Новосибирске", "Продажа квартиры с агентством «Ключбери»: оценка, подготовка, показы и безопасная сделка."),
  component: () => (
    <SiteLayout>
      <PageHero eyebrow="Продать" title="Продадим квартиру спокойно и по рыночной цене" text="Оценим, подготовим объявление, проведём показы и сделку. Условия — в договоре до начала работы." />
      <Section>
        <Steps items={[
          { t: "Оценка", d: "Анализ похожих предложений в районе" },
          { t: "Подготовка", d: "Фото, описание, документы" },
          { t: "Показы", d: "Организуем и проводим сами" },
          { t: "Сделка", d: "Расчёты и регистрация" },
        ]} />
      </Section>
      <Section className="pt-0 md:pt-0"><LeadForm title="Оценить квартиру" cta="Получить оценку" /></Section>
    </SiteLayout>
  ),
});
