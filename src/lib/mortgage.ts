/** Аннуитетный ежемесячный платёж. rate — годовая ставка в процентах. */
export function monthlyPayment(price: number, down: number, years: number, rate: number) {
  const loan = Math.max(price - down, 0);
  const n = Math.round(years * 12);
  if (!loan || n <= 0) return { loan, payment: 0, overpay: 0 };
  const r = rate / 100 / 12;
  const payment = r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n));
  return { loan, payment, overpay: payment * n - loan };
}
