import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero, Section, head } from "@/components/site/ui";
import { ListingCard } from "@/components/site/ListingCard";
import { LeadForm } from "@/components/site/LeadForm";
import { LISTINGS } from "@/lib/listings";

export const Route = createFileRoute("/kupit-kvartiru")({
  validateSearch: (s: Record<string, unknown>): { type?: string; rooms?: string; budget?: string; place?: string } => {
    const pick = (k: string) => (typeof s[k] === "string" && s[k] ? (s[k] as string) : undefined);
    return { type: pick("type"), rooms: pick("rooms"), budget: pick("budget"), place: pick("place") };
  },
  head: () => head("Купить квартиру в Новосибирске", "Подбор и покупка квартир в Новосибирске и области с проверкой документов."),
  component: () => (
    <SiteLayout>
      <PageHero eyebrow="Купить" title="Купить квартиру в Новосибирске" text="Подберём варианты под ваш бюджет, проверим документы и проведём сделку." />
      <Section>
        <div className="mb-6 flex flex-wrap gap-2">
          {["Все", "1-комнатные", "2-комнатные", "3+ комнат", "Новостройки"].map((f, i) => (
            <span key={f} className={`rounded-full px-4 py-2 text-sm font-medium ${i === 0 ? "bg-primary text-primary-foreground" : "bg-card text-primary shadow-soft"}`}>{f}</span>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-3">{LISTINGS.map((l) => <ListingCard key={l.id} l={l} />)}</div>
      </Section>
      <Section className="pt-0 md:pt-0"><LeadForm title="Не нашли подходящее? Подберём" /></Section>
    </SiteLayout>
  ),
});
