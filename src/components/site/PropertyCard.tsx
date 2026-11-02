import { Link } from "@tanstack/react-router";
import { Heart, MapPin } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import { firstImage, roomsLabel, rub, SOURCE_LABEL, type Property } from "@/lib/catalog";
import { KeyIcon } from "./KeyIcon";

type Props = { p: Property; layout?: "grid" | "list"; active?: boolean; onHover?: ((id: string | null) => void) | undefined };

export function PropertyCard({ p, layout = "grid", active, onHover }: Props) {
  const fav = useFavorites();
  const isFav = fav.has(p.id);
  const list = layout === "list";
  const verified = new Date(p.price_verified_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
  return (
    <article
      id={`card-${p.id}`}
      onMouseEnter={() => onHover?.(p.id)}
      onMouseLeave={() => onHover?.(null)}
      className={`group relative overflow-hidden rounded-2xl bg-card shadow-soft transition hover:shadow-lift ${active ? "ring-2 ring-berry" : ""} ${list ? "sm:grid sm:grid-cols-[280px_1fr]" : ""}`}
    >
      <Link to="/kvartira/$id" params={{ id: p.slug }} className="relative block aspect-[4/3] overflow-hidden sm:aspect-auto sm:min-h-full">
        <img src={firstImage(p)} alt={p.title} loading="lazy" width={1200} height={900} className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${list ? "" : "aspect-[4/3]"}`} />
        <span className="absolute left-3 top-3 rounded-full bg-berry px-3 py-1 text-xs font-semibold text-berry-foreground">{SOURCE_LABEL[p.source_type] ?? "Агентство"}</span>
        {p.status === "reserved" && <span className="absolute bottom-3 left-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">Бронь</span>}
      </Link>
      <button
        type="button"
        onClick={() => fav.toggle(p.id)}
        aria-label={isFav ? "Убрать из избранного" : "В избранное"}
        aria-pressed={isFav}
        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-card/90 text-primary shadow-soft backdrop-blur transition hover:scale-105"
      >
        <Heart className={`h-5 w-5 ${isFav ? "fill-berry text-berry" : ""}`} />
      </button>
      <div className="flex flex-col p-5">
        <div className="flex flex-wrap items-baseline gap-x-3">
          <p className="text-xl font-extrabold text-primary">{rub(p.price)}</p>
          {p.price_per_m2 != null && <p className="text-sm text-muted-foreground">{rub(p.price_per_m2)}/м²</p>}
        </div>
        <Link to="/kvartira/$id" params={{ id: p.slug }} className="mt-1 font-semibold text-primary hover:underline">
          {roomsLabel(p.rooms)} · {Number(p.area_total)} м² · {p.floor}/{p.floors_total} эт.
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">{p.title}</p>
        <p className="mt-2 flex items-start gap-1.5 text-sm text-muted-foreground">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{p.address} · {p.district} р-н{p.metro ? ` · м. ${p.metro}` : ""}</span>
        </p>
        <p className="mt-2 text-xs text-muted-foreground">Цена проверена {verified}</p>
        <Link to="/kvartira/$id" params={{ id: p.slug }} className="key-turn mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-primary/15 text-sm font-semibold text-primary transition hover:border-berry hover:text-berry sm:self-start sm:px-5">
          <KeyIcon className="h-4 w-4" /> Записаться на просмотр
        </Link>
      </div>
    </article>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-soft" aria-hidden>
      <div className="aspect-[4/3] animate-pulse bg-muted" />
      <div className="space-y-3 p-5">
        <div className="h-6 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-11 animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  );
}
