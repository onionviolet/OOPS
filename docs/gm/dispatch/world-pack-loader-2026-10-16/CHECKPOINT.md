# World pack loader: checkpoint, 2026-10-16

Lane: `claude/world-pack-loader-9cff81`. Design: [DESIGN.md](DESIGN.md) (WPL1–WPL10).
Brief: Part 9 P9P. Additive only: no `main.js`, save, `dist/`, `structured_pack_*`,
MoL or `rule_modules` edits.

## Finding before the work

`src/rule_modules.js` and `src/craft_*.js` are on `codex/gameplay-foundations`
but not on master (`b12f5161a`), which this branch is cut from. The loader
therefore takes the rule lock through an injected adapter
(`{createRuleLock}`) and treats an absent adapter or resolver as a dormant
profile (EC5, WP12). The R1/R2 branches stay optional for the same reason.

## Implemented (source + tests, not wired)

| Area | File | Rules |
| --- | --- | --- |
| Manifest and record validation, namespaced IDs, retired-ID reuse, attribution and licence tiers (private research refused), ruling status, declared budgets, integer-only data, sealed-term lint on player text, text-blind fingerprint | `src/world_pack_manifest.js` | WP1, WP2, WP4, WP6, P9P2c, P9P2e, P9P2i, MC5-1/3/6, IS1, IS2, IS7 |
| Deterministic load order with cycle detection, dependency revisions, duplicate and nested namespaces, feature gating per pack/area/slot, reference integrity with cascading dormancy, honest coverage (playable floor, dormant routes, reachability), rule profile chain with layer check and lock adapter, crossings with rule and scale rule, author report, player notices | `src/world_pack_loader.js` | WP4, WP5, WP12, WP14, P9P2a, P9P2d, P9P2h, P9P5a–f, CX6, IS8 |
| Scoped slot keys, lazy generated cohort members with a draw ledger, query-time presence (calendar → timetable → dorm/commons → prioritized exceptions), sparse relationships | `src/world_pack_population.js` | WP10, P9Q2–P9Q4, P9Q43, P9Q44, GR2, GR9, GR10, CX4, CX5 |
| Per-pack section `{packId, packRevision, schema, delta}`, derived validator, migration registry and chain, identity hops from `saveCompatibleFrom`, newer-save refusal, missing-pack dormancy, retired storage, seen-beats-revised freezing, instance isolation | `src/world_pack_save.js` | WP8, WP9, P9P2b, P9P2f, P9P2g, P9Y30, GR3 |
| Synthetic test school (28 cohorts, 341 people, timetable, clubs, exceptions, canon edge, test-only sealed secret), rulebook pack, fake lock adapter | `tests/world_pack_school_fixture.js` | P9Q45 |

### Checks run

- `node --test tests/world_pack*.test.js`: 40 tests, 40 pass.
- `npm test`: 1421 tests, 1418 pass, 0 fail, 3 todo. The baseline before this
  lane was 1381 tests, 1378 pass, 0 fail, 3 todo, so the 40 new tests pass and
  nothing else changed.
- Budget measurements on this laptop (`world_pack_budget.test.js` asserts the
  declared budgets; the numbers below are one local run):
  341 students, 736,560 presence queries over 360 days at about 0.3 µs per
  query (declared budget 50 µs); load 5.5 ms; 114 met people = 37 KB section
  (about 330 bytes each, UTF-16 counted), inside the declared 200 KB.

## Implemented-unverified for gameplay

All of the above. Nothing is wired, so no player can reach it and no browser
evidence exists. Add to this wave's acceptance backlog:

- A1. World pack visit reachable from the game (WPL8a).
- A2. Presence list for an area at 1366×768 on a rebuilt fresh origin.
- A3. Meet a student, save, reload, import, and get the same frozen details and place.
- A4. A missing or dormant pack shows the plain player notice, never a diagnostic.

## Not done (deferral register in DESIGN WPL9)

Generated-world admission (WPL6), lazy catalog loading, non-cohort slot kinds,
inspector UI, pack diff tool, MoL migration (WPL7), user/mod packs. Each has a
reopen trigger in DESIGN.

## Proposed next playable step (WPL8a)

A debug-gated "Test school" visit through the existing `content_packs`
optional-pack path: one `format: 'yairpg.world-pack'` dispatch arm in
`loadContentPacks`, bundled packs (no fetch), one desktop panel showing who is
in an area now, "meet" freezing that person into a `world_packs` save section,
then save/reload/import.

## Next authoritative gate

Integration of WPL8a. It needs:

1. Weibao's go-ahead for the wiring slice.
2. An owner check with Foundation R15 (`main.js`, saves, `dist/`, II26) for the
   new `world_packs` save key and its compatibility decision (absent key =
   empty; old saves inert, EC5), plus one writer for the `content_packs`
   dispatch arm.
3. Then rebuilt-browser evidence at 1366×768 for A1–A4.

The lane's unit tests are not that gate; they prove only the pure modules.
