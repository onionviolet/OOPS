# Engine bindings from cultivation research, 2026-10-22

Weibao: "implement everything that is missing in the engine", after the gap list
drawn from [protolike deep](../../../research/protolike-deep-2026-10-22/REPORT.md)
and [additional cultivation](../../../research/additional-cultivation-2026-10-22/REPORT.md).

Scope: narrow bindings on existing owners, not new engines (both reports, AD38).
Order and checkpoints, each a playable slice before the next (AGENTS.md):

| Code | Binding | Source proposal | Status |
| --- | --- | --- | --- |
| E1 | Learned method reserve + practiced cost drive one real operation | O1, W4 | source + focused tests |
| E2 | Helper errand reservation by person ID; preview and dispatch share one quote | O3 | source + focused tests |
| E3 | One process-derived material property with two real readers; one advancement changes an available operation | W1 | source + focused tests |
| E4 | One hazard reads the active body faculty; knowledge survives a body change | O2 | source + focused tests |
| E5a | History seed binds a present owner/site/obligation; never regenerated on reload | W3 | source + focused tests |
| E5b | Institution office, steward pauses when unavailable, successor keeps institutional resources only | W2 | source + focused tests |
| E6 | Means-based site access: one environmental requirement with two supported approaches | O5 | source + focused tests |
| O4 | Closed-browser offline-return clock policy | O4 | not implemented: world clock policy is Weibao's choice (AD22 limits per world); recorded, not built |

Dependency: E1 builds on the uncommitted Mistglass method work
([cultivation-spacing](../cultivation-spacing-2026-10-22/CHECKPOINT.md);
`src/absorb_p23/world_adaptation/techniques.js` untracked). No commit is
authorized; this task keeps that diff intact and adds hunks.

Rules: AD5/22/36/38/41, AR1-AR16, MR (E3), SR (E6), UR for any visible control.
Target viewport 1920x1080 at 14px first; 1536x864 secondary. Mobile deferred.

Persistence pattern per binding: optional child schema absent by default, exact
legacy behavior when absent, malformed optional state rejected, native
save/reload/export/import proof.

Reserved writes: new pure modules for each binding under `src/`, their tests,
hunk-only consumer joins in `src/main.js`, `src/proto23_shell.js`, P12
`world_adaptation` files, this folder.

Verification selected: focused tests per slice; final `npm run build`, full
`node --test`, `check:arch`, `check:rules`; rebuilt browser proof per consumer.

## Progress log

- Owner mapping dispatched (read-only sonnet Explore agents).
- E1: Mistglass outflow sluice. `techniques.js` per-stage `work` cost (settling 2.0/1.5/1.0, breath 2.0/1.8/1.6, open mist 2.0 condensate) at fixed 2.0 output; `previewSluice`/`prepareSluice` in P12 planner, optional `worldAdaptation.sluice` record (absent = legacy), new `native-wage` effect paid through `plan.external.money`; jam returns 60 played minutes after clearing; 2 coins per jam. Host `stageMistglassSluice`, `actMistglass('sluice')`, panel line. Tests: p23-world-adaptation + host-joins 30/30.
- E2: `home.staff.gather` (Toma, 30 min, 2 household coins, 20 energy, +2 logs +3 dry grass into his stock, which his repair/dry orders consume). `staffQuote(id)` projects the same command definition the engine reserves and settles; Homes panel button label is built from it. The engine already refused double-booking by person ID; added an explicit 'already out gathering' guard. Tests: home_household/home_system/household_play 29/29.
- E3: optional lot fact `treatment` in material lineage (explicit per process, never inherited). `material_treatment.js`: smoke (any maker, 1 log per 3 pelts) or oil-dress (Crafting 5, 1 Lamp oil). Readers: existing butchering recipe output quality, Processed rat pelt +10/-10, Piece of wolf rat leather -5/+10, mixed batches weighted. Gear workshop panel 'Prepare hides' section, same quote/execute + native craft transaction. Tests: processed_materials + material_lineage 8/8.
- E4: `body.cold_hardened` (Weathered skin) from three `body.cold_soak` + `body.harden_cold`; `bodyFacultyActive` checks the earning body; storm-gust offset -3 to -1 and half stamina when active. Knowledge `body.cold` persists. Native frontier has no ordinary body-swap route, so the different-body case is exercised in tests only. Tests: body_progression + p23-exposure 26/26.


## Coordination request from W1–W4 owner, 2026-10-22

Weibao explicitly approved “Coordinate ownership and continue” in Codex chat
`01a16509-8686-7850-b336-d1a8269acd77`. That chat owns
[W1–W4 native completion](../distinct-world-w1-w4-2026-10-22/CHECKPOINT.md).
Please record an explicit seam handoff here when your current writes finish,
or identify disjoint missing W behavior it may own now. Proposed split: retain
your E1–E6 bindings here; W owner reuses them, fills remaining W acceptance gaps
and owns combined native journeys. No runtime reservation has been taken over.
Additional-cultivation chat was messaged for its C7/C9/C10 split as well.
This additive coordination note grants no commit, publication or product scope.
- E5a: retained Mistglass realm gains optional `history {schema,id,drawnAt}`, drawn once at first creation from `world.events:p23.mistglass.history` keyed decision and saved; reload/re-entry read it, older realms keep none (original keeper wage). `keeper-built` pays 2 coins per cleared jam; `mill-race` makes clearing a Village duty (+1 Village standing, no coins). The keeper's account is learned with the method (knowledge `p23.mistglass.history`, stage seen) and shown in the panel. Test: two seeds yield both histories, reload/re-entry keep it, invented id rejected.
- E5b: pantry office (`home_office.js`). Rowan takes it with 16 household coins moved into `home.officeFunds`; disclosed policy orders 4 meat + 2 logs from Mara (8 office coins) when the kitchen falls below 2 meat. `officeDecision` reports idle/waiting/paused with reasons (rest, leave, fund, Mara away/short). The residence clock (`stageResidenceClock`) starts the holder's `home.office.restock.<holder>` job; no new timer. Succession to Toma only when the holder is unavailable: fund and policy move, personal wages/energy stay. Close returns the fund to the treasury. Homes panel lines and buttons. Test: order, pause reason, reload, succession, successor order, empty-fund pause.
- E6: `frontier.fen_guided` (ready guide, 4-coin fee, 10 min, 3 herbs, guide left tired) and `frontier.fen_probed` (rope or Climbing 5, no fee, 16 min, 70/30 gathered/soaked, preparation shifts 10%). Without either, both show their reasons. Test in expansion_engine.

## Coordination with the W1-W4 Codex chat (2026-10-22 15:17)

A same-day Codex chat ([distinct-world-w1-w4](../distinct-world-w1-w4-2026-10-22/CHECKPOINT.md)) is authorized for W1-W4 and was in recovery with no runtime writes when these bindings finished. To avoid duplicate seams: E1 and E5a are the W4/W3 minimal bindings in Mistglass, E3 is the W1 material-property binding, and E5b is the W2 office binding. They are first slices, not the full W journeys that record describes (worker/student path, earned office, two intake laws, etc.). That chat should extend these modules rather than add parallel ones. This task now releases its runtime reservation; no further writes here beyond this record and verification.

## Verification (2026-10-22)

- `npm run build`: pass; bundle SHA-256 `d0b5685a761b33976eb9270c3bbd8f03e66d77ffabc06429801a69bad1e0462c`.
- `node --test --test-concurrency=2 tests/*.test.js`: **2,528 pass, 0 fail** on the final source inputs.
- `npm run check:arch`: pass (main.js 10,274 lines vs 10,310 baseline; no new main imports). `npm run check:rules`: pass, two pre-existing untracked-link warnings. No rulebook changed, so the rule-behavior gate was not selected.
- Rebuilt native browser, fresh origin, 1920x1080 ([receipt](browser/sluice-jhAPNX/sluice.json)): E1 sluice cost 2 → 1 condensate after Still-pool reached Integrated, reserve drop exactly 1, disabled reasons for unaffordable and cleared states; E5a `mill-race` history account shown and Village standing +1; Save/reload/Export/literal Import kept history id, sluice record, coins and standing. No page errors. The harness copy's style preload was corrected to `styles/ui_tokens.css`.

Acceptance backlog (implemented-unverified in a native browser): E1/E5a `keeper-built` coin branch (covered by host tests only), E2 Toma gathering errand and E5b pantry office (need a ducal/royal manor start), E3 Prepare hides in the gear workshop, E4 cold soak / Weathered skin with storm gusts, E6 fen approaches. 1800x1040, 1536x864 and 21px text cases not run. Human pacing/taste review open. Nothing committed.

Weibao (2026-10-22): leave the remaining browser proof to the W1-W4 chat's native journeys. That chat's [record](../distinct-world-w1-w4-2026-10-22/CHECKPOINT.md) owns this backlog from here; this task is closed at source, full-suite and E1/E5a browser evidence.
