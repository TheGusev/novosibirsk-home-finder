import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero, Section, Card, head } from "@/components/site/ui";
import { LeadForm } from "@/components/site/LeadForm";

const CHECKS = [
  ["Права собственника", "Выписка из ЕГРН, основание владения"],
  ["Обременения", "Залоги, аресты, ограничения"],
  ["Зарегистрированные лица", "Кто прописан и когда выпишется"],
  ["История перехода прав", "Как квартира переходила между владельцами"],
  ["Перепланировки", "Соответствие техническому плану"],
  ["Долги", "Коммунальные платежи и капремонт"],
];

export const Route = createFileRoute("/proverka-obekta")({
  head: () => head("Проверка квартиры перед покупкой", "Проверка документов и юридической истории квартиры в Новосибирске перед сделкой."),
  component: () => (
    <SiteLayout>
      <PageHero eyebrow="Проверка объекта" title="Проверим квартиру до задатка" text="Смотрим документы и историю объекта, объясняем найденные риски простыми словами. Стоимость: [заполнить]." />
      <Section className="grid gap-4 md:grid-cols-3">
        {CHECKS.map(([t, d]) => (
          <Card key={t}><h3 className="font-bold text-primary">{t}</h3><p className="mt-2 text-sm text-muted-foreground">{d}</p></Card>
        ))}
      </Section>
      <Section className="pt-0 md:pt-0"><LeadForm title="Заказать проверку" /></Section>
    </SiteLayout>
  ),
});
