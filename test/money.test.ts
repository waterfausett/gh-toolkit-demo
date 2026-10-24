import { describe, expect, it } from "vitest";
import { add, money, multiply, sum } from "../src/money";

describe("money", () => {
  it("rejects fractional minor units", () => {
    expect(() => money(10.5)).toThrow(RangeError);
  });

  it("adds amounts in the same currency", () => {
    expect(add(money(250), money(125))).toEqual(money(375));
  });

  it("refuses to add different currencies", () => {
    expect(() => add(money(1, "USD"), money(1, "EUR"))).toThrow(/Currency mismatch/);
  });

  it("rounds when multiplying", () => {
    expect(multiply(money(999), 0.0725).amount).toBe(72);
  });

  it("sums an empty list to zero", () => {
    expect(sum([], "GBP")).toEqual(money(0, "GBP"));
  });
});
