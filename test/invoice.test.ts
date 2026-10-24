import { describe, expect, it } from "vitest";
import { formatMoney } from "../src/format";
import { totals, type Invoice } from "../src/invoice";
import { money } from "../src/money";

const invoice = (overrides: Partial<Invoice> = {}): Invoice => ({
  number: "INV-1042",
  customerId: "cus_8f2k",
  region: "US-CA",
  currency: "USD",
  items: [
    { description: "Starter plan (monthly)", unitPrice: money(4900), quantity: 1 },
    { description: "Extra seats", unitPrice: money(900), quantity: 3 },
  ],
  ...overrides,
});

describe("totals", () => {
  it("computes subtotal, tax and total", () => {
    const t = totals(invoice());
    expect(t.subtotal.amount).toBe(7600);
    expect(t.tax.amount).toBe(551);
    expect(t.total.amount).toBe(8151);
  });

  it("applies a percent discount before tax", () => {
    const t = totals(invoice({ discount: { kind: "percent", value: 10 } }));
    expect(t.discounted.amount).toBe(6840);
  });

  it("never lets a fixed discount go below zero", () => {
    const t = totals(invoice({ discount: { kind: "fixed", value: 100000 } }));
    expect(t.total.amount).toBe(0);
  });

  it("keeps VAT inside the total for inclusive regions", () => {
    const gb = invoice({
      region: "GB",
      currency: "GBP",
      items: [{ description: "Annual plan", unitPrice: money(12000, "GBP"), quantity: 1 }],
    });
    expect(totals(gb).total.amount).toBe(12000);
    expect(totals(gb).tax.amount).toBe(2000);
  });

  it("formats totals for display", () => {
    expect(formatMoney(totals(invoice()).total)).toBe("$81.51");
  });
});
