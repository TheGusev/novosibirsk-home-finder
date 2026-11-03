import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero, Section, head } from "@/components/site/ui";
import { LeadForm } from "@/components/site/LeadForm";
import { supabase } from "@/integrations/supabase/client";
import { rub, roomsLabel } from "@/lib/catalog";

/** Каталог аренды показывается только при включённом флаге И наличии актуальных предложений. */
const rentalsQuery = queryOptions({
  queryKey: ["rentals-section"],
  queryFn: async () => {
    const s = await supabase.from("site_settings").select("value").eq("key", "rental_catalog_enabled").maybeSingle();
    if (s.data?.value !== true) return [];
    const { data } = await supabase.from("rentals").select("*").eq("status", "active").order("verified_at", { ascending: false });
    return data ?? [];
  },
  staleTime: 60_000,
});

export const Route = createFileRoute("/arenda")({
  loader: ({ context }) => context.queryClient.ensureQueryData(rentalsQuery),
  head: () => head("Аренда квартир в Новосибирске", "Снять квартиру или сдать свою в Новосибирске: подбор, проверка сторон и понятный договор аренды."),
  errorComponent: () => <SiteLayout><Section><p className="text-primary">Не удалось загрузить страницу. Обновите её.</p></Section></SiteLayout>,
  notFoundComponent: () => <SiteLayout><Section><p className="text-primary">Страница не найдена.</p></Section></SiteLayout>,
  component: Rent,
});

function Rent() {
  const { data: rentals } = useSuspenseQuery(rentalsQuery);
  return (
    <SiteLayout>
      <PageHero eyebrow="Аренда" title="Снять или сдать квартиру" text="Поможем найти жильё или надёжного арендатора и оформить всё договором." />
      <Section className="grid gap-6 md:grid-cols-2">
        <div id="snyat" className="grid content-start gap-4">
          <h2 className="text-2xl font-extrabold text-primary">Снять</h2>
          <ul className="grid gap-2 text-sm text-primary">
            {["Подбор по району, бюджету и срокам", "Организация просмотров", "Проверка собственника и документов на квартиру", "Договор аренды и акт приёма-передачи"].map((t) => <li key={t} className="flex gap-2"><span className="text-berry">✓</span>{t}</li>)}
          </ul>
          <p className="text-sm text-muted-foreground">Условия и стоимость: [заполнить]</p>
          <LeadForm kind="rent" title="Хочу снять" cta="Подобрать жильё" commentPlaceholder="Район, комнаты, бюджет в месяц, с какой даты" />
        </div>
        <div id="sdat" className="grid content-start gap-4">
          <h2 className="text-2xl font-extrabold text-primary">Сдать</h2>
          <ul className="grid gap-2 text-sm text-primary">
            {["Оценка арендной ставки", "Фото и объявление", "Показы и отбор арендатора", "Договор, опись имущества, акт"].map((t) => <li key={t} className="flex gap-2"><span className="text-berry">✓</span>{t}</li>)}
          </ul>
          <p className="text-sm text-muted-foreground">Условия и стоимость: [заполнить]</p>
          <LeadForm kind="let" title="Хочу сдать" cta="Найти арендатора" commentPlaceholder="Адрес, комнаты, желаемая ставка" />
        </div>
      </Section>
      {rentals.length > 0 && (
        <Section className="pt-0 md:pt-0">
          <h2 className="text-2xl font-extrabold text-primary">Актуальные предложения</h2>
          <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rentals.map((r) => (
              <li key={r.id} className="overflow-hidden rounded-2xl bg-card shadow-soft">
                {Array.isArray(r.images) && typeof r.images[0] === "string" && <img src={r.images[0] as string} alt={r.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />}
                <div className="p-5">
                  <p className="text-xl font-extrabold text-primary">{rub(r.price_month)}/мес.</p>
                  <p className="mt-1 font-semibold text-primary">{roomsLabel(r.rooms)}{r.area_total ? ` · ${Number(r.area_total)} м²` : ""}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{r.title}{r.district ? ` · ${r.district} р-н` : ""}</p>
                  <p className="mt-2 text-xs text-muted-foreground">Проверено {new Date(r.verified_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </SiteLayout>
  );
}
