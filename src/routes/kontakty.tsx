import { CONTACT_NAME, WHATSAPP_HREF, TELEGRAM_HREF } from "@/lib/contact";
import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero, Section, Card, head, PHONE, PHONE_HREF } from "@/components/site/ui";
import { LeadForm } from "@/components/site/LeadForm";
import { metrikaGoal } from "@/lib/metrika";

export const Route = createFileRoute("/kontakty")({
  staticData: { sitemap: true },
  head: () => head("Контакты", "Контакты агентства недвижимости «Ключбери» в Новосибирске: телефон, адрес, часы работы.", "/kontakty"),
  component: () => (
    <SiteLayout>
      <PageHero eyebrow="Контакты" title="Приходите, звоните, пишите" text="Ответим на вопросы и подберём квартиру под вашу задачу." />
      <Section className="grid gap-8 md:grid-cols-2">
        <Card className="grid gap-5">
          <p className="flex gap-3"><Phone className="text-berry" /><a href={PHONE_HREF} onClick={() => { window.__lovableEvents?.track?.("project.click_phone", {}); metrikaGoal("click_phone"); }} className="font-semibold text-primary">{PHONE}</a></p>
          <p className="text-sm text-primary">Агент {CONTACT_NAME} · WhatsApp, Telegram и MAX на этом номере</p>
          <div className="flex flex-wrap gap-4 text-sm font-semibold text-berry"><a href={WHATSAPP_HREF}>WhatsApp</a><a href={TELEGRAM_HREF}>Telegram</a></div>
          <p className="flex gap-3"><Mail className="text-berry" /><span className="text-primary">info@kluchberi.ru</span></p>
          <p className="flex gap-3"><MapPin className="text-berry" /><span className="text-primary">Новосибирск, [заполнить адрес]</span></p>
          <p className="flex gap-3"><Clock className="text-berry" /><span className="text-primary">Пн–Пт: [заполнить], Сб–Вс: [заполнить]</span></p>
          <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground">Карта [заполнить]</div>
        </Card>
        <LeadForm type="selection" title="Подобрать квартиру" />
      </Section>
    </SiteLayout>
  ),
});
