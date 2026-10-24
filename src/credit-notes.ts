import { totals, type Invoice } from "./invoice";
import { money, type Money } from "./money";

export type CreditNote = { number: string; invoiceNumber: string; amount: Money; reason: string };

export const creditNote = (invoice: Invoice, amount: number, reason: string, seq: number): CreditNote => {
  const { total } = totals(invoice);
  if (amount <= 0) throw new RangeError("Credit amount must be positive");
  if (amount > total.amount) throw new RangeError(`Cannot credit more than the invoice total (${total.amount})`);
  return {
    number: `CN-${String(seq).padStart(5, "0")}`,
    invoiceNumber: invoice.number,
    amount: money(amount, invoice.currency),
    reason,
  };
};
