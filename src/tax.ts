import { multiply, type Money } from "./money";

export type TaxRule = { region: string; rate: number; inclusive?: boolean };

const RULES: Record<string, TaxRule> = {
  "US-CA": { region: "US-CA", rate: 0.0725 },
  "US-NY": { region: "US-NY", rate: 0.04 },
  "US-OR": { region: "US-OR", rate: 0 },
  "US-WA": { region: "US-WA", rate: 0.065 },
  "US-TX": { region: "US-TX", rate: 0.0625 },
  GB: { region: "GB", rate: 0.2, inclusive: true },
  DE: { region: "DE", rate: 0.19, inclusive: true },
};

export const ruleFor = (region: string): TaxRule => {
  const rule = RULES[region];
  if (!rule) throw new Error(`No tax rule for region ${region}`);
  return rule;
};

/** Tax owed on a net amount, or the tax portion of a gross amount for inclusive regions. */
export const taxOn = (amount: Money, rule: TaxRule): Money =>
  rule.inclusive ? multiply(amount, rule.rate / (1 + rule.rate)) : multiply(amount, rule.rate);
