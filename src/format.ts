import type { Money } from "./money";

export const formatMoney = (m: Money, locale = "en-US"): string =>
  new Intl.NumberFormat(locale, { style: "currency", currency: m.currency }).format(m.amount / 100);
