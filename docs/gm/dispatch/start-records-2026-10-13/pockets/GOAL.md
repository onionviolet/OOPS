# Pocket histories in the start probe (MZ2), 2026-10-14

Authority: Weibao, 2026-10-14: "more to consider? ... Send out codex as
usesful? Subtle stuff too?" Design: intro doc round 19 MZ2 (every starting
item has one line of history) and round 20. Dev probe only (`?start_probe=1`
on localhost); default game unchanged. Target viewport 1366x768.

Spec:
- Each layer patch in `src/data/start_layers_frontier.js` may carry
  `pockets: {itemId: line}`; every item a layer adds has a line (original,
  plain wording, one sentence, no em dashes; sensory and specific, e.g. where
  the bread came from, why the pants are patched).
- `resolveStart` adds `snapshot.pockets = [{axis, layerId, itemId, line}]`,
  one entry per (layer, item) pair, in axis order. Merge rule: `append`.
- The probe card adds a heading "In your pockets" and a list
  `[data-start-pockets] li`, one per entry; entries from hidden axes show
  "Something from your past you can't place yet." instead of the line.
- `data-start-resolved` may include pockets; money/items/location/quest and
  every earlier gate stay unchanged.

Done check: `pockets/check_pockets.sh` exits 0 (P1-P5 plus the full
start-records check G1-G7 and npm 0 failures).
Allowed files: `src/start_records.js`, `src/data/start_layers_frontier.js`,
`src/start_probe_ui.js`, `styles/start_probe.css`, `tests/start_records.test.js`,
`dist/` rebuild. No main.js, no save fields, no git add/commit/push, never
edit checks or gates.

## Coordinator verification (2026-10-14)

Reran `check_pockets.sh` independently: exit 0. P1-P5 PASS, start-records
G1-G7 PASS, npm 658 pass / 0 fail. Dev probe only; Weibao's taste review of
the pocket lines and integration remain open.
