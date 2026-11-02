import { describe, expect, it } from "vitest";
import { applyFilters, activeChips, catalogTitle, parseFilters, type Property } from "./catalog";

const p = (o: Partial<Property>): Property => ({
  id: o.slug ?? "x", slug: "x", title: "Демо", type: "resale", rooms: 1, area_total: 40, area_kitchen: null, floor: 3, floors_total: 9,
  price: 5_000_000, price_per_m2: 125_000, district: "Центральный", metro: null, address: null, lat: null, lng: null, house_type: null,
  finish: null, description: null, source_type: "agency", responsible_agent_id: null, price_verified_at: "2026-01-01", status: "active",
  created_at: "2026-01-01", images: [], year_built: null, deal_type: null, encumbrances: null, availability_verified_at: null, checks_done: [], checks_pending: [], ...o,
});

const rows = [
  p({ slug: "a", rooms: 2, price: 6_000_000 }),
  p({ slug: "b", rooms: 2, price: 7_000_000 }),
  p({ slug: "c", rooms: 1, price: 4_000_000, floor: 1 }),
  p({ slug: "d", rooms: 5, price: 12_000_000, type: "new" }),
];

describe("каталог", () => {
  it("rooms=2&price_to=6000000 оставляет только a", () => {
    const f = parseFilters({ rooms: "2", price_to: "6000000" });
    expect(applyFilters(rows, f).map((r) => r.slug)).toEqual(["a"]);
  });
  it("мультивыбор комнат 1,4 включает 4+", () => {
    expect(applyFilters(rows, { rooms: "1,4" }).map((r) => r.slug).sort()).toEqual(["c", "d"]);
  });
  it("этаж «не первый» исключает первый", () => {
    expect(applyFilters(rows, { floor: "not_first" }).some((r) => r.slug === "c")).toBe(false);
  });
  it("заголовок и чипы строятся из тех же фильтров", () => {
    const f = parseFilters({ rooms: "2", type: "new" });
    expect(catalogTitle(f)).toBe("Купить 2-комнатную квартиру в новостройке в Новосибирске");
    expect(activeChips(f).map((c) => c.key)).toEqual(["type", "rooms"]);
  });
  it("пустые параметры URL игнорируются", () => {
    expect(parseFilters({ rooms: "", district: "  " })).toEqual({});
  });
});
