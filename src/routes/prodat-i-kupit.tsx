import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero, Section, Steps, head } from "@/components/site/ui";
import { LeadForm } from "@/components/site/LeadForm";

export const Route = createFileRoute("/prodat-i-kupit")({
  head: () => head("Продать и купить другую квартиру", "Альтернативная сделка в Новосибирске: продажа своей квартиры и покупка новой в одной цепочке."),
  component: () => (
    <SiteLayout>
      <PageHero eyebrow="Альтернативная сделка" title="Продать свою и купить другую квартиру" text="Согласуем продажу и покупку так, чтобы вы не остались без жилья между сделками." />
      <Section>
        <Steps items={[
          { t: "План", d: "Оценка вашей квартиры и бюджет на новую" },
          { t: "Продажа", d: "Ищем покупателя, готовим документы" },
          { t: "Подбор", d: "Параллельно ищем новую квартиру" },
          { t: "Одна цепочка", d: "Согласуем расчёты и даты сделок" },
        ]} />
      </Section>
      <Section className="pt-0 md:pt-0"><LeadForm title="Обсудить альтернативную сделку" /></Section>
    </SiteLayout>
  ),
});
