import { describe, expect, it } from "vitest";
import { leadSchema, normalizePhone, maskPhone } from "./lead-schema";
const valid = { type: "viewing", phone: "8 (913) 123-45-67", consent: true, source_page: "/kvartira/demo" };
describe("lead rules", () => {
  it("accepts Russian telephone and normalizes 8 to +7", () => expect(leadSchema.parse(valid).phone).toBe("+79131234567"));
  it("rejects foreign or incomplete phones", () => {
    expect(leadSchema.safeParse({ ...valid, phone: "+12025550123" }).success).toBe(false);
    expect(leadSchema.safeParse({ ...valid, phone: "+7913" }).success).toBe(false);
  });
  it("requires explicit consent", () => expect(leadSchema.safeParse({ ...valid, consent: false }).success).toBe(false));
  it("stores a nullable property id and rejects malformed ids", () => {
    expect(leadSchema.parse(valid).property_id).toBeNull();
    expect(leadSchema.safeParse({ ...valid, property_id: "invalid" }).success).toBe(false);
  });
  it("formats Russian numbers without losing digits", () => expect(normalizePhone(maskPhone("89131234567"))).toBe("+79131234567"));
  it("accepts exactly the requested categories", () => {
    for (const type of ["viewing", "question", "valuation", "selection", "mortgage", "callback"]) expect(leadSchema.safeParse({ ...valid, type }).success).toBe(true);
    expect(leadSchema.safeParse({ ...valid, type: "other" }).success).toBe(false);
  });
});