# tally

Invoice totals, tax and discounts for small billing services. Amounts are integer minor units.

```ts
import { money, totals } from "tally";

totals({
  number: "INV-1042",
  customerId: "cus_8f2k",
  region: "US-CA",
  currency: "USD",
  items: [{ description: "Starter plan", unitPrice: money(4900), quantity: 1 }],
});
```

> This repo is the demo fixture for [gh-toolkit](https://github.com/waterfausett/gh-toolkit). Its pull requests are staged to show the userscript's features in screenshots.
