import { describe, expect, it } from "vitest";
import { money, prorate, remainingFraction } from "../src";

const period = { periodStart: new Date("2026-10-01"), periodEnd: new Date("2026-10-31") };

describe("remainingFraction", () => {
  it("is the share of days left in the period", () => {
    expect(remainingFraction(period.periodStart, period.periodEnd, new Date("2026-10-16"))).toBe(0.5);
  });

  it("clamps changes before the period starts", () => {
    expect(remainingFraction(period.periodStart, period.periodEnd, new Date("2026-09-20"))).toBe(1);
  });
});

describe("prorate", () => {
  it("credits the old plan and charges the new one for the remaining days", () => {
    const p = prorate({ ...period, fromPrice: money(4900), toPrice: money(9900), changedAt: new Date("2026-10-16") });
    expect(p.credit.amount).toBe(2450);
    expect(p.charge.amount).toBe(4950);
    expect(p.net.amount).toBe(2500);
    expect(p.daysRemaining).toBe(15);
  });

  it("returns nothing once the period has ended", () => {
    const p = prorate({ ...period, fromPrice: money(4900), toPrice: money(9900), changedAt: new Date("2026-11-02") });
    expect(p.net.amount).toBe(0);
    expect(p.daysRemaining).toBe(0);
  });

  it("produces a negative net on downgrade", () => {
    const p = prorate({ ...period, fromPrice: money(9900), toPrice: money(4900), changedAt: new Date("2026-10-16") });
    expect(p.net.amount).toBe(-2500);
  });
});
