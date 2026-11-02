import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero, Section, Card, head } from "@/components/site/ui";
import { LeadForm } from "@/components/site/LeadForm";

export const Route = createFileRoute("/arenda")({
  head: () => head("Аренда квартир в Новосибирске", "Снять или сдать квартиру в Новосибирске с понятным договором аренды."),
  component: () => (
    <SiteLayout>
      <PageHero eyebrow="Аренда" title="Снять или сдать квартиру" text="Поможем найти жильё или надёжного арендатора и оформить договор." />
      <Section className="grid gap-4 md:grid-cols-2">
        <Card><h3 className="text-lg font-bold text-primary">Арендаторам</h3><p className="mt-2 text-sm text-muted-foreground">Подбор вариантов, показы, проверка собственника. [заполнить условия]</p></Card>
        <Card><h3 className="text-lg font-bold text-primary">Собственникам</h3><p className="mt-2 text-sm text-muted-foreground">Поиск арендатора, договор, акт приёма-передачи. [заполнить условия]</p></Card>
      </Section>
      <Section className="pt-0 md:pt-0"><LeadForm title="Заявка на аренду" /></Section>
    </SiteLayout>
  ),
});
