import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero, Section, Steps, head } from "@/components/site/ui";
import { LeadForm } from "@/components/site/LeadForm";

export const Route = createFileRoute("/ipoteka")({
  head: () => head("Ипотека в Новосибирске", "Помощь с ипотекой: сравнение программ, подготовка документов, подача в банки."),
  component: () => (
    <SiteLayout>
      <PageHero eyebrow="Ипотека" title="Ипотека без лишней бумажной работы" text="Сравним программы, поможем собрать документы и подать заявку в банки. Банки-партнёры: [заполнить]." />
      <Section>
        <Steps items={[
          { t: "Консультация", d: "Обсуждаем доход, взнос и цели" },
          { t: "Подбор программы", d: "Семейная, IT, стандартная и др." },
          { t: "Заявка в банки", d: "Готовим и подаём документы" },
          { t: "Одобрение", d: "Сопровождаем до сделки" },
        ]} />
      </Section>
      <Section className="pt-0 md:pt-0"><LeadForm title="Консультация по ипотеке" /></Section>
    </SiteLayout>
  ),
});
