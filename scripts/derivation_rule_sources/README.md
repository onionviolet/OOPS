# Derivation rule sources

Each `*.mjs` here adds score rows to `docs/coverage/derivation_rules.json` (see `scripts/derivation_rules_backtest.mjs` `build()`).
A lane adds its own file and edits no shared line, so parallel lanes never conflict.

```js
export const order = 60;            // where its rows sit among the others; ties break by file name
export default async ({row, sha, verdictOf}) => [/* score rows */];
```

The built-in rules (Gu rank, hp, lotm, generator) come first, then these files by `order`, then file name. The first
four files below keep the order the list had when it was one line (law-defaults 10, ss-rank 20, worm-prt 30, coi-potions 40);
new files pick any number (50 and up keeps them last).
