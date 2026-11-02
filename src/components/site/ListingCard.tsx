import { Link } from "@tanstack/react-router";
import type { Listing } from "@/lib/listings";

export function ListingCard({ l }: { l: Listing }) {
  return (
    <Link to="/kvartira/$id" params={{ id: l.id }} className="group overflow-hidden rounded-2xl bg-card shadow-soft transition hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={l.image} alt={l.title} loading="lazy" width={1200} height={900} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-berry px-3 py-1 text-xs font-semibold text-berry-foreground">{l.type}</span>
        <span className="absolute right-3 top-3 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold text-primary">Демо</span>
      </div>
      <div className="p-5">
        <p className="text-lg font-bold text-primary">{l.price}</p>
        <p className="mt-1 font-medium text-primary">{l.title}, {l.area} м²</p>
        <p className="mt-1 text-sm text-muted-foreground">{l.district} · этаж {l.floor}</p>
      </div>
    </Link>
  );
}
