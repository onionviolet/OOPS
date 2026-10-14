# fork-resurvey lane, 2026-10-14

A1: Complete live fork-network enumeration and fresh row audit are saved in [RESURVEY](../../../world-implementation/second-pass/fork-network-absorption/RESURVEY_2026-10-14.md) and its JSON. **42 forks / 61 heads**, no new external fork/branch, one changed external fork. All ten Ononoki changed files already belong to current October 11 absorption. Root dev 200f1ba6 stays with upstream-dev. 47 primary source files fetched at pins for targeted mechanism review; original October 5 ledgers remain intact.

A2: Implemented **FNA04 public/heard clear hints, FNA08 known bestiary source reverse view, FNA10 partial known-loot expectation**, as reversible proposals. Source commit **57fce47e**. Commit **38075d47** labels the estimate's single-enemy/no-loot-accessory assumptions. No Schoko Fort implementation here.

A3: Candidate table includes FNA17 as well as requested FNA01–16. Resurvey also re-audits 29 separate items covering every old “What was useful…” paragraph. Solo-player/many-world possibilities remain design scope; missing consumers and incompatible IDs are not cured by broad scope. Deferred rows are explicit missing contracts, not silently dropped.

## Decisions

| Source row | New decision | Where / reason |
| --- | --- | --- |
| FNA01 | Already adopted | 68694413; src/display.js uses action_name, model supplies fallback; preserve availability filters. |
| FNA02 | Already adopted | 68694413; src/crafting_recipes.js validates missing/unmatched native material/results before RNG; main rejects stale selections. |
| FNA03 | Already adopted | 68694413; src/trade.js copies requests, preserving native grouped quote/settlement. No scalar-price rollback. |
| FNA04 | Adapted this lane | src/fork_discovery_views.js extends the existing heard-note contract to explicit authored public hints. Infested field description publicly discloses its recognition thresholds. Both display refresh paths use the existing reader. Hidden rows contribute no marker. |
| FNA05 | Other lane | Schoko Fort chain belongs exclusively to fork-fort. Existing Waypost Fort (f62e264e) is a separate original campaign; no duplicate Schoko implementation here. |
| FNA06 | Already adopted | 68694413 and d49cb911; Makeable now filter plus selected-row recovery and craft detail already exist. Never-made history cannot be inferred from present stock; omit that unsupported marker. |
| FNA07 | Retain targeted migration only | Current v06/save compatibility stages earned unlocks and preserves retired content. No demonstrated missing entitlement in these pins/current fixtures. Inventing historical rewards from max skill is incorrect even for a solo player. No speculative save repair. |
| FNA08 | Adapted this lane | Native Item log now reverses only already disclosed bestiary loot edges for positively acquired items and killed enemies. Label is Known bestiary sources, not observed-drop provenance. Existing Fort journal retains actual/reported source records. Whole-registry undiscovered sources stay excluded. |
| FNA09 | Deferred specific automatic transition | Native auto-return-to-bed and manual fast travel to last combat already work. Automatic waking/return is genuinely additional convenience, not forbidden abuse. It needs a saved cause/intent, current-world destination validation and cancellation across sleep/travel/restore; copying a Neko tick condition would affect voluntary sleep and stale realms. Retain manual return now; no fixed attempt cap. |
| FNA10 | Adapted this lane | Encountered enemy bestiary gains partial expected base loot value from positively acquired items only. Uses native drop modifier and count expectation, caps actual probability at 1, labels standard-quality/base-price/market/markup exclusions. No Neko gems or source/assets copied. |
| FNA11 | Duplicate useful mechanism; omit broken neighbors | src/models/location.js getActivityEfficiency already scales real count, chance and duration from native gathering skills; main settles those exact outputs. Adding parallel generic Gather speed/efficiency tracks duplicates that progression. Efficient training is display-only in source, Failure expert lacks settlement consumer, and unclamped Lucky loot is not an independent rule worth transplanting. |
| FNA12 | Already adapted | f62e264e; native Waypost clerk accepts repeat actual deliveries from finite funds with custody/save staging. No fixed once cap on paid work. A second guild_jobs clock/ledger would duplicate it; further regional customers are new content, not a safe mechanical transplant. |
| FNA13 | Duplicate paid stance pattern; mana variant deferred | src/combat_stances.js already supplies earned stamina-funded alternate functions; native combat owns fuel/counters. Fueled mana stance is live but its magic module is unused/invalid and no acquisition/casting/counter chain accompanies it. Mana-funded magic remains possible for a world with authored spells; do not turn every ordinary weapon hit into a global mana multiplier. |
| FNA14 | Newer native connected sinks already adopted; incomplete catalog deferred | Current Days 4–7 include monster bone processing/handles, Gryphon pinion/trophy and Frumious claw/blade. Suraimu remaining Spiritwood/Magisteel names have acquisition but missing downstream functions. Do not add dead stock or change all worlds to Tensura. A source-qualified original material chain needs its own actual source and sink, not the TS graph. |
| FNA15 | Deferred new traversal scene, not rejected engine capability | Current native action/route commitments and Climbing support original traversal; Sardine grip/height/falling-rock interaction is additional content with no native interchangeable scene. No engine/toolchain port or rat image copy. Reauthor when selecting an actual reachable cliff with grip costs, retreat and failure aftermath; preserve all-world possibility. |
| FNA16 | Deferred typed offense authoring; defensive preparation already adapted | Native optional absorb_e3 preparation already responds to encountered enemies/known bestiary with real defensive effects. Angular offensive weakness is a distinct useful future rule, but current ordinary weapons expose weapon family, not that games element enumeration. Requires world-specific attack types/known evidence/resistance/counters and native battle fixtures. Do not infer universal fire weakness from a tag or replace combat with broken OneMore code. |
| FNA17 | Already native principle; no new rename | Extra old candidate beyond requested FNA01–16 included for completeness. Current guild ID is intentionally retained and v06 migration preserves legacy data. Bippy item-only aliases omit quest/kill domains; no selected rename warrants adding them. |

## Implemented contract

Public eligibility requires actual authored hint.visibility = public on a real remaining clear-reward row, or a heard disclosure matching this location and threshold. Infested field description openly states its recognition thresholds. Only the next known threshold is displayed; reward contents are never projected. Both native initial combat rendering and per-kill rendering retain the existing known-clear reader. Waypost heard notes delegate to the same pure projection.

Item log sources require positive acquisition and a killed/known bestiary enemy. These are already disclosed bestiary edges, not observed provenance of any particular stock. No search across undiscovered zones/recipes. Loot value uses native bestiary drop modifier, clamped chance, expected native count and standard-quality base value, with explicit single-enemy/no-accessory, market and markup assumptions. No RNG in projection, reward, XP, price change or hidden-loot count.

First acquisition refresh occurs after positive count recording, only for relevant enemies. Native recipe refresh initializes a missing page cache. That guard was exposed by an invalid disposable fixture during diagnosis, not established as a defect in valid player save formats.

Compatibility: **no new save fields/schema/IDs or persistent state**. Existing knowledge, money, XP, kills and rewards retain their native owners. No migration, inferred past reward or repeat reward grant. Existing save validation correctly rejected the first disposable fixture because its two XP records disagreed. Corrected fixture supplies matching character/level XP and generated field counter. No private save touched.

## Checks

Target desktop/laptop viewport **1366×768**; mobile optimization deferred.

| Check | Exact result / limits |
| --- | --- |
| npm run build | PASS, esbuild + Ink check. Built dist not committed. |
| Focused node --test tests/fork_discovery_views.test.js tests/absorb_d.test.js | **11 pass / 0 fail**, public/heard/hidden/wrong-location/completed thresholds; positive-acquisition/known-enemy boundaries; partial value/count/probability/no-hidden-price-call; original Fort contracts. |
| Full npm test | **624 pass / 0 fail**, npm test -- --test-concurrency=2 (50.407 seconds). Previous default-concurrency run: 623 pass / 1 fail; unchanged alloy_equipment.test.js:118 fixture child exceeded its 60-second timeout. Isolated alloy rerun: 5 pass / 0 fail. Earlier default run also passed 624/624. No stable pre-existing failure established; timeout is retained in full-run-timeout.txt. |
| Rebuilt fresh-origin desktop Playwright | PASS native 29→30 group clear: known milestone 2 becomes 4 clears; no 10-clear marker in the active next-hint slot. Initially no unknown-loot estimate; real native drops create acquired-item estimates and reverse source rows. Tooltip actually hovered/visible; native Data control opens item log. |
| Save/reload | PASS generated hero's known next-clear projection and acquired-loot estimates. Export/import is not required by COMMON for this no-new-persistence change and was not claimed. |
| Fixture qualification | Fresh isolated browser context, matching hero XP 100000 / field groups 29. Final reproducible run controls native Math.random to 0.01 for an actual positive drop. Native consumer proof, **not natural progression/balance or unmodified RNG proof**. Earlier uncontrolled native drop/reload run also passed core assertions; final visual run is the pinned gate. |
| Bundle / map | SHA256 69097d0c46c8a5e1876945dcdaaf17772973fdf21f781bbedcd8c110ca8e5100; **465 source-map files matched / 0 mismatches**. Rebuilt worktree served on assigned origin http://127.0.0.1:18703/. |
| Visual review | Combat hint and bestiary tooltip visible at target viewport. Native journal panel scroll contains item rows; source header wraps cleanly. Existing compact journal height is not a new layout redesign. |
| Artifacts | [GATE.json](/Users/weiwei/code/yair-absorb-all-20261014/fork-resurvey/docs/gm/dispatch/absorb-all-2026-10-14/checks/fork-resurvey/GATE.json), browser.cjs/browser.json, combat.png, bestiary.png, desktop.png, build/focused/full receipts and isolated timeout recovery. |

Implemented-unverified: no deferred mechanic is described as implemented. Generic hidden/public edge cases have focused source proof; browser positives cover the authored public field and encountered rat loot. Natural balance, other gathering/trade source projections and other worlds' offensive weakness/casting/automatic-recovery scenes were not exercised or added.

## Merge risks

[Live sessions](../runs/SESSIONS.md) was found under runs/ (COMMON's top-level SESSIONS path was absent).

| Lane | Shared area / merge instruction |
| --- | --- |
| fork-fort | src/data/locations.js, src/items.js, possibly display imports. Keep its Schoko registrars; retain public field metadata and shared existing Waypost known-clear delegation. This lane never implements Schoko chain. |
| p23-ui-polish / p23-reveal-chain | src/display.js import/header/recipe/UI areas. Keep newer renderer work; merge only small recipe lookup, source column and bestiary projection hunks. Never replace whole files. |
| p23-life-loops / air-workshop | Possible item/content imports. Keep native inventories and lane registrars. First-acquisition refresh stays after count publication. |
| PROJECT summaries | This lane appends one proposal summary to PROJECT.md; other lane append summaries may need a manual documentation merge. |
| upstream-dev | Content/model/renderer overlaps possible. Current Ononoki model/load/content fixes already in base; do not re-add them from this audit. Root 200f1ba6 belongs there. |
| p23-reaudit / air-reaudit | Main documentation isolated by report name. Only named resurvey MD/JSON and fork-resurvey.md were written here. |

No push, merge, remote edits, dependency install, save deletion or source-library mutation. Worktree retains uncommitted rebuilt dist/map/index stamp for tested preview; only task source, PROJECT proposal summary and evidence paths are committed.

**One remaining acceptance gate for delivered behavior: Weibao's play/taste review.** Deferred mechanics remain honestly unimplemented, with reasons and future contract gaps in the table. No complete many-world feature rollout is claimed.
