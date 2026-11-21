import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero, Section, head } from "@/components/site/ui";

export const Route = createFileRoute("/politika")({
  staticData: { sitemap: true },
  head: () => head("Политика конфиденциальности", "Политика обработки персональных данных и согласие на обработку персональных данных [Название юрлица].", "/politika"),
  component: () => (
    <SiteLayout>
      <PageHero eyebrow="Документы" title="Политика конфиденциальности" text="Порядок обработки персональных данных пользователей сайта kluchberi.ru." />
      <Section className="max-w-3xl space-y-4 text-muted-foreground">
        <p>Оператор: [Название юрлица], ИНН [заполнить], адрес [заполнить].</p>
        <p>[заполнить] Текст политики в соответствии с 152-ФЗ «О персональных данных».</p>
        <h2 id="soglasie" className="pt-6 text-2xl font-bold text-primary">Согласие на обработку персональных данных</h2>
        <p>[заполнить] Текст согласия.</p>
      </Section>
    </SiteLayout>
  ),
});
