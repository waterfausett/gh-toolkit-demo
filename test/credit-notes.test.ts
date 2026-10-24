import { describe, expect, it } from "vitest";
import { creditNote } from "../src/credit-notes";
import { money } from "../src/money";

const invoice = {
  number: "INV-1042",
  customerId: "cus_8f2k",
  region: "US-OR",
  currency: "USD",
  items: [{ description: "Starter plan", unitPrice: money(4900), quantity: 1 }],
};

describe("creditNote", () => {
  it("numbers credit notes and links the invoice", () => {
    const note = creditNote(invoice, 1500, "Outage on Oct 12", 7);
    expect(note.number).toBe("CN-00007");
    expect(note.invoiceNumber).toBe("INV-1042");
    expect(note.amount.amount).toBe(1500);
  });

  it("refuses to credit more than the total", () => {
    expect(() => creditNote(invoice, 5000, "Too much", 1)).toThrow(RangeError);
  });
});
