import type { Tables } from "@/integrations/supabase/types";

export type Property = Tables<"properties">;

export const DISTRICTS = ["Центральный", "Железнодорожный", "Заельцовский", "Калининский", "Кировский", "Ленинский", "Октябрьский", "Первомайский", "Советский", "Дзержинский"];
export const METRO = ["Заельцовская", "Гагаринская", "Красный проспект", "Площадь Ленина", "Октябрьская", "Речной вокзал", "Студенческая", "Площадь Маркса", "Сибирская", "Маршала Покрышкина", "Берёзовая роща", "Золотая Нива"];
export const HOUSE_TYPES = ["Монолит", "Кирпич", "Панель"];
export const FINISHES = ["Без отделки", "White box", "Чистовая", "Косметический", "Евроремонт", "Требует ремонта"];
export const ROOMS = [{ v: "0", l: "Студия" }, { v: "1", l: "1" }, { v: "2", l: "2" }, { v: "3", l: "3" }, { v: "4", l: "4+" }];
export const FLOOR_OPTS = [{ v: "", l: "Любой" }, { v: "not_first", l: "Не первый" }, { v: "not_last", l: "Не последний" }, { v: "middle", l: "Не первый и не последний" }];
export const SORTS = [{ v: "", l: "По актуальности" }, { v: "price_asc", l: "Сначала дешевле" }, { v: "price_desc", l: "Сначала дороже" }, { v: "ppm_asc", l: "Цена за м² ↑" }, { v: "new", l: "Новые" }];

/** Все фильтры — строки из URL. Пустые значения не хранятся. */
export type Filters = {
  type?: string | undefined;
  rooms?: string | undefined; // "1,2"
  price_from?: string | undefined;
  price_to?: string | undefined;
  area_from?: string | undefined;
  area_to?: string | undefined;
  floor?: string | undefined;
  district?: string | undefined;
  metro?: string | undefined;
  house?: string | undefined;
  finish?: string | undefined;
  sort?: string | undefined;
};
export const FILTER_KEYS = ["type", "rooms", "price_from", "price_to", "area_from", "area_to", "floor", "district", "metro", "house", "finish", "sort"] as const;

export function parseFilters(s: Record<string, unknown>): Filters {
  const out: Filters = {};
  for (const k of FILTER_KEYS) {
    const v = s[k];
    if (typeof v === "string" && v.trim()) out[k] = v.trim();
    else if (typeof v === "number") out[k] = String(v);
  }
  return out;
}

export function cleanFilters(f: Filters): Filters {
  return parseFilters(f as Record<string, unknown>);
}

const n = (s?: string) => {
  if (!s) return undefined;
  const v = Number(s.replace(/\s/g, ""));
  return Number.isFinite(v) && v > 0 ? v : undefined;
};

export const roomsList = (f: Filters) => (f.rooms ? f.rooms.split(",").filter(Boolean) : []);

export function applyFilters(rows: Property[], f: Filters): Property[] {
  const rooms = roomsList(f);
  const pf = n(f.price_from), pt = n(f.price_to), af = n(f.area_from), at = n(f.area_to);
  const res = rows.filter((p) => {
    if (f.type && p.type !== f.type) return false;
    if (rooms.length && !rooms.some((r) => (r === "4" ? p.rooms >= 4 : p.rooms === Number(r)))) return false;
    if (pf && p.price < pf) return false;
    if (pt && p.price > pt) return false;
    if (af && p.area_total < af) return false;
    if (at && p.area_total > at) return false;
    if (f.floor && p.floor != null) {
      const first = p.floor === 1, last = p.floors_total != null && p.floor === p.floors_total;
      if (f.floor === "not_first" && first) return false;
      if (f.floor === "not_last" && last) return false;
      if (f.floor === "middle" && (first || last)) return false;
    }
    if (f.district && p.district !== f.district) return false;
    if (f.metro && p.metro !== f.metro) return false;
    if (f.house && p.house_type !== f.house) return false;
    if (f.finish && p.finish !== f.finish) return false;
    return true;
  });
  const by = {
    price_asc: (a: Property, b: Property) => a.price - b.price,
    price_desc: (a: Property, b: Property) => b.price - a.price,
    ppm_asc: (a: Property, b: Property) => (a.price_per_m2 ?? 0) - (b.price_per_m2 ?? 0),
    new: (a: Property, b: Property) => b.created_at.localeCompare(a.created_at),
  }[f.sort ?? ""] ?? ((a: Property, b: Property) => b.price_verified_at.localeCompare(a.price_verified_at));
  return [...res].sort(by);
}

const fmtNum = (v: string) => Number(v).toLocaleString("ru-RU");

/** Чипы активных фильтров — из того же объекта фильтров, что и список. */
export function activeChips(f: Filters): { key: keyof Filters; label: string }[] {
  const c: { key: keyof Filters; label: string }[] = [];
  if (f.type) c.push({ key: "type", label: f.type === "new" ? "Новостройка" : "Вторичка" });
  const r = roomsList(f);
  if (r.length) c.push({ key: "rooms", label: "Комнат: " + r.map((x) => ROOMS.find((o) => o.v === x)?.l ?? x).join(", ") });
  if (f.price_from || f.price_to) c.push({ key: "price_from", label: `Цена ${f.price_from ? "от " + fmtNum(f.price_from) : ""} ${f.price_to ? "до " + fmtNum(f.price_to) : ""} ₽`.replace(/\s+/g, " ") });
  if (f.area_from || f.area_to) c.push({ key: "area_from", label: `Площадь ${f.area_from ? "от " + f.area_from : ""} ${f.area_to ? "до " + f.area_to : ""} м²`.replace(/\s+/g, " ") });
  if (f.floor) c.push({ key: "floor", label: FLOOR_OPTS.find((o) => o.v === f.floor)?.l ?? f.floor });
  if (f.district) c.push({ key: "district", label: f.district + " р-н" });
  if (f.metro) c.push({ key: "metro", label: "м. " + f.metro });
  if (f.house) c.push({ key: "house", label: f.house });
  if (f.finish) c.push({ key: "finish", label: f.finish });
  return c;
}

export function removeChip(f: Filters, key: keyof Filters): Filters {
  const next = { ...f };
  delete next[key];
  if (key === "price_from") delete next.price_to;
  if (key === "area_from") delete next.area_to;
  return next;
}

const ROOM_WORD: Record<string, string> = { "0": "студию", "1": "1-комнатную квартиру", "2": "2-комнатную квартиру", "3": "3-комнатную квартиру", "4": "4+-комнатную квартиру" };

export function catalogTitle(f: Filters): string {
  const r = roomsList(f);
  let what = r.length === 1 ? ROOM_WORD[r[0] ?? ""] ?? "квартиру" : "квартиру";
  if (f.type === "new") what += " в новостройке";
  const where = f.district ? `, ${f.district} район` : "";
  return `Купить ${what} в Новосибирске${where}`;
}

export const rub = (v: number) => v.toLocaleString("ru-RU") + " ₽";
export const roomsLabel = (r: number) => (r === 0 ? "Студия" : `${r}-комн.`);
export const SOURCE_LABEL: Record<string, string> = { owner: "Собственник", agency: "Агентство", developer: "Застройщик" };
export const firstImage = (p: Property) => (Array.isArray(p.images) && typeof p.images[0] === "string" ? (p.images[0] as string).replace(/^\/images\/(hero|interior|building)\.jpg$/, "/images/$1.webp") : "/images/hero.webp");
