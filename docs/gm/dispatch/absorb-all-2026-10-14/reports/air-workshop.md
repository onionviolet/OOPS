# Air workshop absorption, 2026-10-14

Status: **The requested technical absorption gate is complete.** The optional Village workshop is a playable, reversible proposal on `absorb/air-systems-cheats-completion`. It is not accepted canon or taste. Nothing was pushed or merged into gameplay-foundations.

## Correction to the old report

Replacement status for [the 2026-10-13 report](/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/air-absorb-2026-10-13/reports/systems-cheats-completion.md): **Complete technical absorption as an opt-in proposal: current foundation merged, six workshop failures fixed, rebuild and 639/639 tests pass, fresh-origin desktop loop and old/new save gates pass. Director play/taste remains open.** This supersedes its “Partial source absorption” and “not a playable checkpoint” status. That historical report remains unchanged.

## Authority, compatibility and scope

Followed the current wave's `COMMON.md`, the original `SYSTEMS-CHEATS-COMPLETION.md` compatibility decision, `AGENTS.md`, `PROJECT.md` and `USER_VISION.md`. Target: **1366×768 desktop/laptop**, showing usable workshop controls, earned goods, real work, durable learning versus assistance, and represented irrigation knowledge applied through actual materials. Mobile optimization remains deferred.

New workshop state remains optional and absent from old saves. An actual native save was made by the shipped **0216ccde** client, with no workshop state, then loaded, reloaded and file-imported in the candidate. Expansion, inventories, purse, location, availability, cheats, equipment durability and Village career matched; no workshop history was invented. Normal played calendar time is not claimed byte-identical. No personal save was used or changed.

Native item templates are available to the opt-in workshop without inserting new availability rows into absent-edition saves. A validated workshop save restores only its supported saved item availability bindings before the loader reads those flags. Unsupported editions, forged points, falsified model output and moved expiry deadlines still reject without replacing the current save. Save validation was not weakened.

## Absorption rows

| Source item | Decision | Landing / evidence |
|---|---|---|
| Current gameplay foundation `0216ccde` | Merge | `8ff5f936`, clean automatic merge; preserved newer main/save integration. |
| Prior Air source absorption `bd237e4d` | Retain and complete | Irrigation model, workshop definitions/runtime/UI/validation and optional registry/save hooks retained. No broad foreign main/save files pasted. |
| Six failing workshop cases | Adapt | `379518ec`: derive eligibility from persisted carriers in `simulation_effects.js`; reconcile manufacture receipts and deterioration inside `advanceSimulation` before validation. All original cases pass. |
| Caller-supplied workshop eligibility claims | Reject | Added regression proving recommendation, installed-field and Ren-learning claims cannot override current state. |
| Receipt/clock lifecycle | Adapt | Added direct-engine regression for valid manufactured and expired states, without post-return repair. Existing forged/missing expiry rejection retained. |
| Workshop panel registry and declared participants | Fix | Pass explicit registry to the panel and command definitions' declared target IDs to the current host. |
| New physical workshop goods | Register | Narrow `items.js` template registration; optional availability stays absent until goods arrive. |
| Real-loader import ordering | Fix | `04c79ed3`: restore supported optional availability after expansion validation, before native availability load. Real Export/Import passes. |
| Inherited browser scripts | Adapt | Use COMMON's absolute Playwright path, assigned port 18701, target viewport, current elder prerequisite, readiness waits, actual Export/download and race-safe Import waits. |
| Legacy client compatibility | Verify | `systems_workshop_legacy.cjs` uses an extracted 0216ccde client, not a new-build imitation of an old save. |
| Snapshot whole `main.js`, `save_files.js`, `index.html`, docs and generated bundles | Do not restore wholesale | Current owners and integration retained; build outputs tested but not committed. |
| Private source-world adapter / other worlds | No new claim | Original local workshop/model slice only; broader world adaptation remains separately owned. |

## Exact checks

Final candidate bundle SHA-256: `62e3888c2fa4a5179e8043823ea10e8f152f261c70d78ee7608cdbf5ecded9dc`. The native proof records the matching served bundle query `v0.6-62e3888c2fa4`.

| Check | Result |
|---|---|
| `npm run build` | PASS, ink checks and esbuild complete. |
| Focused workshop + irrigation tests | **18/18 PASS**: 14 workshop, 4 irrigation. |
| Final `npm test` after loader repair | **639/639 PASS**, 0 failed, cancelled or skipped; no pre-existing failures in this checkout. |
| `systems_workshop_browser.cjs` | **10 native groups PASS**, fresh origin, 1366×768, zero page errors, natural inputs, no dev grants; final played clock 90. |
| `systems_workshop_boundaries.cjs` | **10 groups PASS**, zero page errors: cancellation/refund, failed-storage nonpublication, both funded outcomes, four malformed imports, actual lease renewal, detached carriers. The detached-carrier check is an explicit removal fixture, not natural transfer proof. |
| Genuine 0216ccde old save | **3 groups PASS**, zero page errors: current load, reload, encoded-file import; exact checked gameplay fields and absent workshop state. |
| Earned new save | **3 persistence groups PASS**, zero page errors: exact restored/reloaded state, real Export download, real file-input Import. Actors, owners, knowledge, claims, titles, RNG, inventories and purse preserved. |
| Source/scripts/docs whitespace | PASS for task paths; generated bundle whitespace is excluded. |

The native loop exercises accepted/refused work, pending-job reload, exactly-once reward, permanent learning, leased/upgraded output, independent Ren work while away/disconnected, useful ordinary craft, both cache outcomes, lens/repair/dispatch, deterioration versus preservation, represented-only model comparison followed by different actual fitting yields, installed irrigation use, funded hidden draw/fold/settlement, and save/reload/Export/Import.

Evidence and reproduction instructions live in the lane worktree: [README](/Users/weiwei/code/yair-air-absorb-20261013/systems-cheats-completion/docs/gm/dispatch/absorb-all-2026-10-14/air-workshop/README.md), [build manifest](/Users/weiwei/code/yair-air-absorb-20261013/systems-cheats-completion/docs/gm/dispatch/absorb-all-2026-10-14/air-workshop/BUILD.json), and [desktop capture](/Users/weiwei/code/yair-air-absorb-20261013/systems-cheats-completion/docs/gm/dispatch/absorb-all-2026-10-14/air-workshop/evidence/desktop-workshop-1366x768.png). JSON summaries and exact command logs are retained there; disposable raw test saves remain under `/tmp/systems-workshop-proof`.

## Limits and merge risks

All items in the requested technical gate are exercised. **Implemented-unverified beyond this native loop:** chest-custody deterioration has focused source coverage; ordinary goods expiring in recipient custody has source inspection only. Neither has an actual native custody journey here. No broader source-world or inherited Foundation acceptance is inferred.

Against the lanes in `runs/SESSIONS.md`, the main conflict seams are `main.js` (upstream-dev, fork-fort and Proto23 integration/UI), `items.js` (new goods), `simulation_effects.js` (facts), and `expansion_engine.js` (clock reconciliation). Integrate the narrow imports/hooks and preserve both lanes' behavior; do not replace entire files. The save validator's existing checks remain intact. Other audit lanes own their own reports.

`node_modules` points to the main checkout's dependencies; its previous local directory was preserved at `/tmp/air-workshop-node_modules-20261014`. No dependency installation occurred. Generated `dist/` and index version changes are deliberately uncommitted; the rebuilt candidate is served on assigned port 18701. Only this lane's report was written in the main checkout.

**One remaining scoped acceptance gate: Weibao's play/taste.** Play Village → speak to the elder → open “Iona’s work ledger · systems and workshop” → follow local people/work → meet Iona → accept/work/buy a log/make the commissioned kit/claim. The mechanics, names, numbers and presentation remain a proposal.
