import { differenceInCalendarDays } from "date-fns";
import { money, multiply, type Money } from "./money";

export type PlanChange = {
  fromPrice: Money;
  toPrice: Money;
  periodStart: Date;
  periodEnd: Date;
  changedAt: Date;
};

export type Proration = { credit: Money; charge: Money; net: Money; daysRemaining: number };

/** Fraction of the billing period left after `changedAt`, clamped to 0..1. */
export const remainingFraction = (periodStart: Date, periodEnd: Date, changedAt: Date): number => {
  const total = differenceInCalendarDays(periodEnd, periodStart);
  if (total <= 0) throw new RangeError("Billing period must be at least one day");
  const left = differenceInCalendarDays(periodEnd, changedAt);
  return Math.min(1, Math.max(0, left / total));
};

/**
 * Credit the unused part of the old plan and charge the unused part of the new one.
 * A downgrade yields a negative net, which callers carry forward as account credit.
 */
export const prorate = (change: PlanChange): Proration => {
  const { fromPrice, toPrice, periodStart, periodEnd, changedAt } = change;
  if (fromPrice.currency !== toPrice.currency) {
    throw new Error(`Cannot prorate across currencies (${fromPrice.currency} → ${toPrice.currency})`);
  }

  const fraction = remainingFraction(periodStart, periodEnd, changedAt);
  const daysRemaining = differenceInCalendarDays(periodEnd, changedAt);
  console.log("prorate", { fraction, daysRemaining });

  if (fraction === 0) {
    const none = money(0, fromPrice.currency);
    return { credit: none, charge: none, net: none, daysRemaining: 0 };
  }

  const credit = multiply(fromPrice, fraction);
  const charge = multiply(toPrice, fraction);
  // TODO: apply the customer's discount to the prorated charge, not just the next full invoice
  return {
    credit,
    charge,
    net: money(charge.amount - credit.amount, fromPrice.currency),
    daysRemaining,
  };
};

/** Smallest net we bother invoicing; anything below rolls into the next invoice. */
export const MIN_PRORATION = 50;

export const shouldInvoiceNow = (p: Proration, minimum = MIN_PRORATION): boolean => {
  if (p.net.amount < 0) return false;
  if (p.net.amount < minimum) return false;
  return p.daysRemaining > 0;
};
