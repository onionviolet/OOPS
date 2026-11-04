# HP review fixes A receipt (2026-11-04)

Agent-verified, not human-reviewed, not committed. `dist/` not rebuilt. Hashes of book.hp.school, trade and book.hp untouched (hp_lead_life hash test passes).

## Changes
- F4: `src/book_world_beginning_registration.js` skips `registerHpLeadDomain` when domain `hp` is already registered; holdings registration was already idempotent (Map set). Gap: a second call that adds ports after a portless first call keeps the first registration. Test: "registerBookBeginnings can run twice" in `tests/hp_lead_life.test.js`.
- F1: `src/hp_life_holdings.js` parses each inventory key as JSON, takes `.id`, requires the `<life.id>.` prefix plus a non-empty remainder, skips unparsable keys. Test in `tests/own_holdings.test.js` (extra field, reordered fields, bad JSON, other life, empty name).
- F3: `src/world_look.js` uses `ownHoldings(worldId)` for the veil flag; `ownHoldingsView` runs once, only when registered, for the notices. Behavior otherwise identical (existing own_holdings/world_look tests pass).
- F2: `src/book_world_hp_lead_pack.js` emits one `console.warn` per load with validation reasons or the error message; still returns null. Test in `tests/hp_lead_life.test.js`.
- F6: `scripts/lead_run/build_cast_pack.mjs` `buildCastPack` throws a clear error on an empty districts list (chose reject, not default fallback, so `--districts ,` typos surface). Test in `tests/build_cast_pack.test.js`.

## Checks
- `node --test tests/own_holdings.test.js tests/hp_lead_life.test.js tests/build_cast_pack.test.js tests/world_look.test.js`: 39 pass, 0 fail.
- `node --test tests/hp_lead_window1/2/3.test.js tests/world_portable_tools.test.js`: 13 pass, 0 fail.
- `npm run check:arch`: PASS (1 warning, pre-existing grandfathering).
- `npm run check:rules`: PASS.
- Gaps: full `npm test` not run (committer's gate); no browser check (display-only, no UI change).
