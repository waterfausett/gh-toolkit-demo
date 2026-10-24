import { money, multiply, type Money } from "./money";

export type Discount =
  | { kind: "percent"; value: number }
  | { kind: "fixed"; value: number };

export const applyDiscount = (subtotal: Money, discount?: Discount): Money => {
  if (!discount) return subtotal;
  if (discount.kind === "percent") {
    if (discount.value < 0 || discount.value > 100) throw new RangeError("Percent discount must be 0-100");
    return multiply(subtotal, 1 - discount.value / 100);
  }
  return money(Math.max(0, subtotal.amount - discount.value), subtotal.currency);
};
