import { applyDiscount, type Discount } from "./discounts";
import { add, multiply, sum, type Money } from "./money";
import { ruleFor, taxOn } from "./tax";

export type LineItem = { description: string; unitPrice: Money; quantity: number };

export type Invoice = {
  number: string;
  customerId: string;
  region: string;
  currency: string;
  items: LineItem[];
  discount?: Discount;
};

export type Totals = { subtotal: Money; discounted: Money; tax: Money; total: Money };

export const lineTotal = (item: LineItem): Money => multiply(item.unitPrice, item.quantity);

export const totals = (invoice: Invoice): Totals => {
  const subtotal = sum(invoice.items.map(lineTotal), invoice.currency);
  const discounted = applyDiscount(subtotal, invoice.discount);
  const rule = ruleFor(invoice.region);
  const tax = rule.inclusive && !invoice.discount
    ? sum(invoice.items.map((item) => taxOn(lineTotal(item), rule)), invoice.currency)
    : taxOn(discounted, rule);
  const total = rule.inclusive ? discounted : add(discounted, tax);
  return { subtotal, discounted, tax, total };
};
