import { createFileRoute } from "@tanstack/react-router";
import building from "@/assets/building.jpg";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero, Section, Steps, head } from "@/components/site/ui";
import { LeadForm } from "@/components/site/LeadForm";

export const Route = createFileRoute("/novostroyki")({
  head: () => head("Новостройки Новосибирска", "Помощь в выборе новостройки в Новосибирске и области: застройщики, сроки сдачи, ипотека."),
  component: () => (
    <SiteLayout>
      <PageHero eyebrow="Новостройки" title="Квартира в новом доме — без сюрпризов" text="Поможем сравнить жилые комплексы, разобраться в сроках сдачи и условиях застройщика." />
      <Section>
        <img src={building} alt="Новый жилой комплекс" loading="lazy" width={1200} height={912} className="aspect-[16/8] w-full rounded-2xl object-cover shadow-lift" />
      </Section>
      <Section className="pt-0 md:pt-0">
        <Steps items={[
          { t: "Задача", d: "Район, бюджет, срок сдачи" },
          { t: "Сравнение ЖК", d: "Плюсы и минусы без рекламы" },
          { t: "Ипотека", d: "Подбор программы и банка" },
          { t: "Договор ДДУ", d: "Проверка перед подписанием" },
        ]} />
      </Section>
      <Section className="pt-0 md:pt-0"><LeadForm title="Подобрать новостройку" /></Section>
    </SiteLayout>
  ),
});
