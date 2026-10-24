/** Amounts are integer minor units (cents) to avoid floating-point drift. */
export type Money = { amount: number; currency: string };

export const money = (amount: number, currency = "USD"): Money => {
  if (!Number.isInteger(amount))
    throw new RangeError(`Amount must be whole minor units, got ${amount}`);
  return { amount, currency };
};

export const add = (a: Money, b: Money): Money => {
  assertSameCurrency(a, b);
  return { amount: a.amount + b.amount, currency: a.currency };
};

export const multiply = (m: Money, factor: number): Money => ({
  amount: Math.round(m.amount * factor),
  currency: m.currency,
});

export const sum = (items: Money[], currency = "USD"): Money => items.reduce(add, money(0, currency));

const assertSameCurrency = (a: Money, b: Money) => {
  if (a.currency !== b.currency) throw new Error(`Currency mismatch: ${a.currency} vs ${b.currency}`);
};
