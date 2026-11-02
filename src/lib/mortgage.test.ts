import { describe, expect, it } from "vitest";
import { monthlyPayment } from "./mortgage";

describe("monthlyPayment", () => {
  it("считает кредит как стоимость минус взнос", () => {
    expect(monthlyPayment(6_000_000, 1_500_000, 20, 12).loan).toBe(4_500_000);
  });
  it("аннуитет 4.5 млн, 20 лет, 12% ≈ 49 549 ₽", () => {
    expect(Math.round(monthlyPayment(6_000_000, 1_500_000, 20, 12).payment)).toBe(49549);
  });
  it("при нулевой ставке платёж = кредит / месяцы", () => {
    expect(monthlyPayment(1_200_000, 0, 10, 0).payment).toBe(10_000);
  });
  it("взнос больше стоимости — платежа нет", () => {
    expect(monthlyPayment(1_000_000, 2_000_000, 10, 10).payment).toBe(0);
  });
});
