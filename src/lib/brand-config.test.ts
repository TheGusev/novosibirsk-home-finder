import { describe, expect, it } from "vitest";
import { organizationSchema, seoHead } from "./seo";
import { parseSeoSettings } from "./seo-settings";
const DEFAULT_SEO_SETTINGS = parseSeoSettings([]);

describe("неутверждённый бренд", () => {
  it("не публикует данные организации в разметке", () => {
    expect(organizationSchema(DEFAULT_SEO_SETTINGS)).toBeNull();
  });
  it("не добавляет заглушку названия в title", () => {
    const h = seoHead("Контакты", "d", "/kontakty");
    expect(h.meta[0]).toEqual({ title: "Контакты" });
  });
});
