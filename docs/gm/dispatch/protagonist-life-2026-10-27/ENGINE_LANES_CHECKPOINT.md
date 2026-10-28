# Engine lanes checkpoint (PL-E0, PL-B1, PL-E2, PL-E3, PL-E1, PL-H1), 2026-10-27

Status: agent-verified, not human-reviewed. All six lanes are **implemented, below floor**
(AD43): no browser run from a fresh origin and no persisted-save evidence for any lane.
Lane definitions: [PLAN section 4](PLAN.md). Rules applied: AR1-AR16, AD36, AD43.

## Lanes

| Lane | Commit | Files | Floor state |
| --- | --- | --- | --- |
| PL-E0 `dayIndex` and clock table (C1) | b8fa9df9b | `src/world_day_index.js`, `tests/world_day_index.test.js` | Implemented, below floor |
| PL-B1 lead bot and lint | 59314203e | `scripts/headless/lead_bot.mjs`, `scripts/check_lead_bot.mjs`, `tests/lead_bot.test.js` | Implemented, below floor |
| PL-E2 reference resolver (CAE-E1, E4) | 72f0dfbfb | `src/ref_resolver.js`, `tests/ref_resolver.test.js`, one import and `note()` change in `src/chronicle.js` | Implemented, below floor |
| PL-E3 beat resolver | 22fe209af | `src/beat_records.js`, `tests/beat_records.test.js` | Implemented, below floor |
| PL-E1 keyed shop stock (C2) | f43431e5d | `src/keyed_generation.js`, `tests/keyed_generation.test.js` | Implemented, below floor; call site unwired |
| PL-H1 Village harness | b527bc7fe | `src/world_packs/village_lead_line.js`, `tests/village_lead_line.test.js`, `scripts/headless/lead_runs/village_lead_line.mjs` | Implemented, below floor |

## Checks (one line each)

- `node --test` per lane file: PL-E0 3/3, PL-B1 5/5, PL-E2 30/30 (with chronicle neighbours), PL-E3 10/10, PL-E1 4/4, PL-H1 7/7. Gap: subagent-reported, not rerun by the coordinator except through the full suite.
- `npm test` before the PL-E0, B1, E2 commits: 3521/3521; before PL-E3 and E1: 3545/3545; before PL-H1: 3555/3555. Gap: runs include other sessions' uncommitted working-tree files.
- `npm run build`, `npm run check:arch` per lane: pass, no cycle growth (205 grandfathered). Gap: build rewrote already-dirty `dist/` and `index.html`, not committed by these lanes.
- `npm run check:rules`: pass (16 receipts) after PL-E2/E3/E1 and again from PL-H1's report.
- PL-H1 headless export, import and reload: day count unchanged; replay from day 0 gives the same beat state. Gap: headless, not a browser; the beat state is re-derived, not persisted.
- Not exercised: browser at the target viewport, PX64 check 6 (bystander smoke), `lint_lead_run` on the PL-H1 rows (not in `lead-run/1.3` shape).

## Stops and decisions needed

- **CAE-E2 heir snapshot** (PL-E2): a save addition, not built. Needs an additive-migration yes.
- **`beatLedger` slice** (PL-E3): proposed only, needed if a run must survive export and import mid-window.
- **PL-E1 call site**: `src/components/trader_component.js` (clean) keys stock without a world seed, and the trader has no opt-in flag. Wiring changes existing shop stock; needs a decision on an opt-in argument.
- **PL-E3 engine card E3-1**: a beat that needs a mechanism the world lacks reports `blocked`; moving a body, spending a purse and the lead's routine are not built (PLAN MS1, possible PL-E4).
- **PL-E2 limit**: the chronicle hook renders at write time with an empty context, so names and masks need a read-time render by a caller.
- **PL-H1 limits**: beats fall on days 2 and 3 (headless stepping is about 14 s per world day); the bot steps the clock and talks to the elder, with no engine hook to drive beats through game verbs.

## Follow-ups approved by Weibao (2026-10-27)

Weibao approved the three save and wiring items above. Same floor state: implemented, below floor; agent-verified, not human-reviewed.

| Item | Commit | Files | Notes |
| --- | --- | --- | --- |
| CAE-E2 heir snapshot | 3ed02a5bb | `src/chronicle.js`, `tests/chronicle_heir_snapshot.test.js` | Additive tie `predecessorLife` (placeholder `life:gen<N>`) beside the frozen `rememberedPredecessor`; old saves render unchanged. No UI calls `heirPredecessorLabel` yet, so the label always falls back to the snapshot. |
| PL-E1 trader opt-in | 5f4b73e71 | `src/components/trader_component.js`, `tests/trader_keyed_stock.test.js`, stub in `tests/market_life.test.js` | `worldSeed` is a runtime argument, no save field. No game code passes it yet. Non-opt-in output is byte-identical (tested). |
| beatLedger slice | 352e91ddf | `src/beat_ledger.js`, `tests/beat_ledger.test.js`, one import line in `src/native_tool_domains.js` | Absent slice loads empty, empty ledger writes no key. Headless export, import and reload keep it. No consumer calls `commit` yet (AR10: engine-ready, not integrated). |

Checks: `npm test` 3563/3563 (one earlier run showed a failure in the beatLedger copy-semantics test while that lane was mid-edit; rerun green after the lane fixed validate-before-normalize); `npm run check:arch` exit 0, no growth; `npm run check:rules` pass. Gap: no browser pass for any of the three.
