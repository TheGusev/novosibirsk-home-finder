import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { rub, type Property } from "@/lib/catalog";


function icon(p: Property, active: boolean) {
  return L.divIcon({
    className: "",
    html: `<div class="map-pin ${active ? "is-active" : ""}"><span>${Math.round(p.price / 100000) / 10} млн</span></div>`,
    iconSize: [86, 34],
    iconAnchor: [43, 34],
  });
}

type Props = { items: Property[]; activeId: string | null; onSelect: (id: string) => void };

export default function CatalogMap({ items, activeId, onSelect }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markers = useRef(new Map<string, L.Marker>());
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    if (!el.current) return;
    map.current = L.map(el.current, { scrollWheelZoom: false }).setView([55.03, 82.92], 11);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap", maxZoom: 19 }).addTo(map.current);
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    const m = map.current;
    if (!m) return;
    markers.current.forEach((mk) => mk.remove());
    markers.current.clear();
    const pts: L.LatLngTuple[] = [];
    for (const p of items) {
      if (p.lat == null || p.lng == null) continue;
      const mk = L.marker([p.lat, p.lng], { icon: icon(p, false), title: `${p.title}, ${rub(p.price)}` })
        .addTo(m)
        .on("click", () => onSelectRef.current(p.id));
      markers.current.set(p.id, mk);
      pts.push([p.lat, p.lng]);
    }
    if (pts.length) m.fitBounds(pts, { padding: [40, 40], maxZoom: 14 });
  }, [items]);

  useEffect(() => {
    for (const p of items) {
      const mk = markers.current.get(p.id);
      if (!mk) continue;
      mk.setIcon(icon(p, p.id === activeId));
      mk.setZIndexOffset(p.id === activeId ? 1000 : 0);
    }
  }, [activeId, items]);

  return <div ref={el} className="h-full w-full" />;
}
