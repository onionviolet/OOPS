# World pack loader: checkpoint, 2026-10-16

Lane: `claude/world-pack-loader-9cff81`, based on `codex/gameplay-foundations`
(rebased at the coordinator's request; the first commit was cut from master,
which lacks `rule_modules.js` and `craft_*`). Design: [DESIGN.md](DESIGN.md)
(WPL1–WPL16). Brief: Part 9 P9P plus addenda P9M (world types, multiverse rule
sets) and P9S (series, multiverses, invariants). Additive only: no `main.js`,
save, `dist/`, `structured_pack_*`, MoL or `rule_modules` edits.

## Implemented (source + tests, not wired)

| Area | File | Rules |
| --- | --- | --- |
| Manifest and record validation: namespaced IDs, retired-ID reuse, attribution and licence tiers (private research refused), ruling status, declared budgets, integer-only data, sealed-term lint, text-blind fingerprint; `role`, 13 world axes, presets, parent `lock`, membership lists, profile revisions, `counterpartOf` | `src/world_pack_manifest.js` | WP1, WP2, WP4, WP6, P9P2c/e/i, MC5-1/3/6, IS1, IS2, IS7, P9M1, P9M2c, P9S1 |
| Load order over requires and memberships with cycle detection, feature gating, cascading dormancy, honest coverage, rule profile chain via lock adapter; axis composition (parents outermost first → preset → own, locks bind every member), membership role checks, instance pins, counterpart links, authority models on crossings; author report, player notices | `src/world_pack_loader.js` | WP4, WP5, WP12, WP14, P9P2a/d/h, P9P5, P9M2b-c, P9M3, P9M5b, P9S3a, CX6, IS8 |
| Scoped slot keys, lazy generated cohort members with a draw ledger, query-time presence with prioritized exceptions, sparse relationships | `src/world_pack_population.js` | WP10, P9Q2–P9Q4, P9Q43–44, GR2, GR9, GR10, CX4, CX5 |
| Section `{packId, packRevision, schema, delta}` with per-instance pins, derived validator, migration chain (steps receive the loaded pack), newer-save refusal, missing-pack dormancy, retired storage, seen-beats-revised, `profile-changed` dormancy; cluster section shape, validation and carry-through | `src/world_pack_save.js` | WP8, WP9, P9P2b/f/g, P9Y30, GR3, P9M5b, P9S3f |
| Synthetic test school (341 people) and rulebook pack | `tests/world_pack_school_fixture.js` | P9Q45 |
| Multiverse → series → two continuity worlds (d20/levels/ratio time vs percentile/learn-by-use/catch-up), shared counterpart hero, one traveler-authority crossing | `tests/world_pack_multiverse_fixture.js` | P9M addendum 5, P9S addendum 5 |
| Generic invariants INV1, INV2 (loader-visible), INV4, INV6, INV8, INV9, INV10 over every fixture set | `tests/world_pack_invariants.test.js` | P9S4–P9S5 |

### Checks run

- `node --test tests/world_pack*.test.js`: 62 tests, 62 pass.
- `npm test` on this base: 1856 tests, 1853 pass, 0 fail, 3 todo. No
  failures anywhere, so none are new.
- The invariant suite was checked against a deliberate break: with
  freeze-on-reveal disabled in `personView`, INV6 failed for both fixture sets.
  The break was then reverted.
- Budget figures from one local run: 341 students, 736,560 presence queries
  over 360 days at about 0.3 µs each (declared 50 µs); load 5.5 ms; 114 met
  people = 37 KB section (about 330 bytes each), inside the declared 200 KB.

## Implemented-unverified for gameplay

All of the above. Nothing is wired, so no player can reach it and no browser
evidence exists. Acceptance backlog:

- A1. World pack visit reachable from the game (WPL8a).
- A2. Presence list for an area at 1366×768 on a rebuilt fresh origin.
- A3. Meet a student, save, reload, import, and get the same frozen details and place.
- A4. A missing or dormant pack shows the plain player notice, never a diagnostic.

## Next steps not done in this slice

- N1. Rule-module layers `multiverse`, `cluster`, `universe` plus module-level
  locks: proposal for the rule-module owner in DESIGN WPL15.
- N2. Series catalog override by children, era-relative sealing, overlay packs (WPL14).
- N3. Cluster section writes, which wait for the first cross-world event (SR6).
- N4. INV3, INV5 and runtime INV7, which need wiring.
- N5. Generated-world admission (WPL6), lazy catalog loading, non-cohort slot
  kinds, inspector UI, pack diff tool, MoL migration (WPL7). Reopen triggers are in WPL9.

## Proposed next playable step (WPL8a)

A debug-gated "Test school" visit through the existing `content_packs`
optional-pack path: one `format: 'yairpg.world-pack'` dispatch arm in
`loadContentPacks`, bundled packs (no fetch), one desktop panel showing who is
in an area now, and "meet" freezing that person into a `world_packs` save
section, then save, reload and import.

## Next authoritative gate

Integration of WPL8a. It needs:

1. Weibao's go-ahead for the wiring slice.
2. An owner check with Foundation R15 (`main.js`, saves, `dist/`, II26) for the
   new `world_packs` save key, including `clusters`, and its compatibility
   decision (absent key = empty; old saves inert, EC5), plus one writer for the
   `content_packs` dispatch arm.
3. Then rebuilt-browser evidence at 1366×768 for A1–A4.

The lane's unit tests are not that gate; they prove only the pure modules.
