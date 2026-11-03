import { describe, expect, it } from "vitest";
import { applyComplexFilters, type Complex } from "./complexes";

const c = (o: Partial<Complex>): Complex => ({
  id: o.slug ?? "x", slug: "x", name: "Демо", developer: "", district: "Центральный", completion_year: 2026, completion_quarter: 4,
  price_from: 5_000_000, finish: "Без отделки", address: null, description: null, images: [], commission_note: null, status: "active", created_at: "", ...o,
});
const rows = [c({ slug: "a", completion_year: 2025 }), c({ slug: "b", completion_year: 2027, district: "Советский" }), c({ slug: "c", price_from: 8_000_000, finish: "Чистовая" })];
const ids = (r: Complex[]) => r.map((x) => x.slug);

describe("applyComplexFilters", () => {
  it("срок сдачи — не позже выбранного года", () => expect(ids(applyComplexFilters(rows, { due: "2026" }))).toEqual(["a", "c"]));
  it("цена от", () => expect(ids(applyComplexFilters(rows, { price_from: "6000000" }))).toEqual(["c"]));
  it("район и отделка", () => {
    expect(ids(applyComplexFilters(rows, { district: "Советский" }))).toEqual(["b"]);
    expect(ids(applyComplexFilters(rows, { finish: "Чистовая" }))).toEqual(["c"]);
  });
});
