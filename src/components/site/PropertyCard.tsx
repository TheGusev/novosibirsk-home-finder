import { Link } from "@tanstack/react-router";
import { Heart, ImageOff } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { firstImage, roomsLabel, rub, SOURCE_LABEL, type Property } from "@/lib/catalog";

type Props = { p: Property; layout?: "grid" | "list"; active?: boolean; onHover?: ((id: string | null) => void) | undefined; priority?: boolean };

/** Specs in one line: комнаты · площадь · этаж. Missing values are skipped, never invented. */
export function specsLine(p: Pick<Property, "rooms" | "area_total" | "floor" | "floors_total">) {
  return [
    roomsLabel(p.rooms),
    p.area_total ? `${Number(p.area_total).toLocaleString("ru-RU")} м²` : null,
    p.floor ? `${p.floor}${p.floors_total ? `/${p.floors_total}` : ""} эт.` : null,
  ].filter(Boolean).join(" · ");
}

export function PropertyCard({ p, layout = "grid", active, onHover, priority }: Props) {
  const fav = useFavorites();
  const isFav = fav.has(p.id);
  const list = layout === "list";
  const img = firstImage(p);
  const demo = p.title.startsWith("Демо");
  return (
    <article
      id={`card-${p.id}`}
      onMouseEnter={() => onHover?.(p.id)}
      onMouseLeave={() => onHover?.(null)}
      className={`group relative flex min-w-0 flex-col ${list ? "sm:grid sm:grid-cols-[260px_1fr] sm:gap-5 sm:rounded-lg sm:border sm:bg-card sm:p-3" : ""} ${active ? "outline-2 outline-offset-4 outline-brand" : ""}`}
    >
      <Link to="/kvartira/$id" params={{ id: p.slug }} className="relative block aspect-[4/3] overflow-hidden rounded-md bg-muted" tabIndex={-1} aria-hidden>
        {img ? (
          <img src={img} alt="" loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" width={800} height={600} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
        ) : (
          <span className="flex h-full items-center justify-center text-muted-foreground"><ImageOff className="h-6 w-6" /></span>
        )}
        <span className="absolute left-2 top-2 flex gap-1">
          {demo && <span className="rounded bg-card/95 px-1.5 py-0.5 text-[11px] font-semibold text-primary">Демо</span>}
          {p.status === "reserved" && <span className="rounded bg-primary px-1.5 py-0.5 text-[11px] font-semibold text-primary-foreground">Бронь</span>}
        </span>
      </Link>
      <button
        type="button"
        onClick={() => fav.toggle(p.id)}
        aria-label={isFav ? "Убрать из избранного" : "В избранное"}
        aria-pressed={isFav}
        className="absolute right-1 top-1 z-10 flex h-11 w-11 items-center justify-center text-primary"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-card/95"><Heart className={`h-4 w-4 ${isFav ? "fill-brand text-brand" : ""}`} /></span>
      </button>
      <div className="min-w-0 pt-3 sm:pt-2">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <p className="text-lg font-bold text-primary tabular">{rub(p.price)}</p>
          {p.price_per_m2 != null && <p className="text-xs text-muted-foreground tabular">{rub(p.price_per_m2)}/м²</p>}
        </div>
        <Link to="/kvartira/$id" params={{ id: p.slug }} className="mt-0.5 block font-medium text-primary after:absolute after:inset-0 after:content-[''] hover:underline">
          {specsLine(p)}
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{[p.address, p.district && `${p.district} р-н`, p.metro && `м. ${p.metro}`].filter(Boolean).join(" · ")}</p>
        <p className="mt-1.5 text-xs text-muted-foreground">{SOURCE_LABEL[p.source_type] ?? "Агентство"}{p.price_verified_at ? ` · цена проверена ${new Date(p.price_verified_at).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}` : ""}</p>
      </div>
    </article>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div aria-hidden>
      <div className="aspect-[4/3] animate-pulse rounded-md bg-muted" />
      <div className="mt-3 h-5 w-1/2 animate-pulse rounded bg-muted" />
      <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-muted" />
      <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-muted" />
    </div>
  );
}
