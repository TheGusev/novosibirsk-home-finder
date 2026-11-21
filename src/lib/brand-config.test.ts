import { describe, expect, it } from "vitest";
import { organizationSchema, seoHead } from "./seo";
import { parseSeoSettings } from "./seo-settings";
const DEFAULT_SEO_SETTINGS = parseSeoSettings([]);

describe("бренд «Ваш Адрес 54»", () => {
  it("без домена и юрлица не публикует данные организации", () => {
    expect(organizationSchema(DEFAULT_SEO_SETTINGS)).toBeNull();
  });
  it("добавляет название в title", () => {
    const h = seoHead("Контакты", "d", "/kontakty");
    expect(h.meta[0]).toEqual({ title: "Контакты — Ваш Адрес 54" });
  });
});
