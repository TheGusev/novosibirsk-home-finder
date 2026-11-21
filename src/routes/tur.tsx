import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { seoHead } from "@/lib/seo";
import { getTour } from "@/lib/tour/adapter";

const RoomTourViewer = lazy(() => import("@/components/tour/RoomTourViewer").then((m) => ({ default: m.RoomTourViewer })));

export const Route = createFileRoute("/tur")({
  staticData: { sitemap: false },
  validateSearch: (s: Record<string, unknown>): { room?: string } => (typeof s["room"] === "string" ? { room: s["room"] } : {}),
  head: () => seoHead("Рум-тур по демонстрационной квартире", "Пример интерактивного просмотра квартиры: комнаты, план и переходы. Интерьер демонстрационный.", "/tur", { noindex: true }),
  component: TourPage,
});

function TourPage() {
  const { room } = Route.useSearch();
  const tour = getTour();
  if (!tour) return <div className="p-8"><p>Тур недоступен.</p><Link to="/" className="text-brand underline">На главную</Link></div>;
  return (
    <main className="bg-primary">
      <h1 className="sr-only">Рум-тур по демонстрационной квартире</h1>
      <Suspense fallback={<div className="tour-shell grid place-items-center text-sm text-primary-foreground">Загружаем тур…</div>}>
        <RoomTourViewer bundle={tour} room={room} />
      </Suspense>
    </main>
  );
}
