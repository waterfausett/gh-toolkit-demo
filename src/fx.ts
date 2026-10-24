import { money, type Money } from "./money";

export type Rates = Record<string, number>;

/** Converts using a rate table keyed by "FROM:TO". */
export const convert = (m: Money, to: string, rates: Rates): Money => {
  if (m.currency === to) return m;
  const rate = rates[`${m.currency}:${to}`];
  if (rate === undefined) throw new Error(`No rate for ${m.currency} → ${to}`);
  return money(Math.round(m.amount * rate), to);
};
