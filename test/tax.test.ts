import { describe, expect, it } from "vitest";
import { money } from "../src/money";
import { ruleFor, taxOn } from "../src/tax";

describe("tax", () => {
  it("adds sales tax for exclusive regions", () => {
    expect(taxOn(money(10000), ruleFor("US-CA")).amount).toBe(725);
  });

  it("extracts VAT from gross amounts for inclusive regions", () => {
    expect(taxOn(money(12000, "GBP"), ruleFor("GB")).amount).toBe(2000);
  });

  it("throws for unknown regions", () => {
    expect(() => ruleFor("MARS")).toThrow(/No tax rule/);
  });
});
