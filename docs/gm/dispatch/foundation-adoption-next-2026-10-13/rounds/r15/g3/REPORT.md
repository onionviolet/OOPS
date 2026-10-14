# R15 G3: manual study, fieldcraft and assay

2026-10-13. Worker branch `worktree-agent-aedda304f5f9605f0`, merged
`codex/gameplay-foundations` at `a697c3d1` before the resumed checks. Scope follows
the [R15 brief](../BRIEF.md), [FA10 leaves](../../r5/ACCEPTANCE_BACKLOG.md) and
[FA13 leaves](../../r8/ACCEPTANCE_BACKLOG.md). The R8 failed profile is a lost
test run, not a permanent product verdict. Earlier rounds are unchanged.

Target: headless Chrome, 1600x1100 desktop, fresh disposable profile, port 19130,
this worktree's rebuilt bundle. Visible outcome: usable study and fieldcraft
controls, retained keyboard focus, honest save-failure feedback, actual stock
and learned results. Mobile, new mechanics and fiction/balance decisions are
deferred. All current gameplay checks below are **seeded-native**; no new-game
natural progression claim is made.

Result: **FA10 core route PASS, seeded-native. FA13 core route PASS,
seeded-native.** The source-only alternatives and guards below pass their own
checks; their unrun native variants remain explicitly open. The final evidence
checker passes 15 browser steps and all 13 current persistence checkpoints.

## What changed

**F1, source:** Opening the notebook again for a timed job moved focus away
from the control the player was operating. `src/workspace_layout.js` now keeps
focus already inside an opened module, while opening it from elsewhere still
focuses its first control. `tests/workspace_focus.test.js` fails on the merged
baseline and passes with the fix. **F1, seeded-native:** real Tab and Enter/Space
actions retain focus while study and tool work starts. Disappearing completed
controls use the existing summary fallback.

**F2, source:** After an action failed to save, the feature panel did not
rerender, hiding the paused-save instruction behind the generic retry feedback.
`src/feature_expansion_ui.js` now renders in `finally` after the command.
`tests/feature_panel_save_failure.test.js` fails on the merged baseline and
passes with the fix. **F2, seeded-native:** an injected real storage failure
immediately showed “Progress paused because saving failed. Free storage and
reload before continuing.” The seven durable state groups were unchanged;
reload and one explicit retry produced one manual and charged once.

These two small changes were recovered from the previous worker's partial
work. No G3 changes to `src/main.js`, `src/simulation.js` or `src/save_files.js`.
The merged G1/G7 `nativeOccupationReason()` fix is retained. No persistence
format changed, so no migration is needed.

## FA10 leaves

| ID | Leaf and observed result | Label | Status |
|---|---|---|---|
| M1 | Real copy commission reserves paper, ink, two coins and one Eda stamina. Cancellation restores the counted inputs, purse and her effort. A later successful copy creates one physical manual | seeded-native | PASS |
| M2 | Trial holds one owned manual and sound sample, returns both unchanged, and records the specific missing edge-clearance comparison | seeded-native | PASS |
| M3 | Completed trial applies fatigue with expiry four played minutes after its diagnostic. Earlier partial run also observed ordinary expiry without rest | seeded-native | PASS |
| M4 | Two-minute rest completes before that expiry and removes fatigue. It does not remove the diagnostic | seeded-native | PASS |
| M5 | Comparison holds/returns the same counted manual and sample, prepares version 1, and leaves procedure unlearned | seeded-native | PASS |
| M6 | Separate three-minute reading returns the manual and learns procedure version 1. Possession, diagnostic, preparation and learned method remain distinct | seeded-native | PASS |
| M7 | Learned plain sharp-knife route holds manual/tool, consumes exactly two sound staves and one sap, then adds two actual Prepared survey kits and returns the manual plus one dull counterpart of that knife | seeded-native | PASS |
| M8 | Native kit stock 7 → 9 → 7; Eda's finite order receives two real kits and pays two coins. Items are fungible counted keys, not uniquely numbered copies | seeded-native | PASS |
| M9 | Prepared, learned, held kit job, completed kits, delivered stock and failure/retry checkpoint each pass Save/reload/Export/literal-file Import comparisons | seeded-native | PASS, with explicit equipment-cache qualification below |
| M10 | Copy cancellation on merged build; trial and kit cancellation in recovered partial runs return exact held inputs without a completion. Real Tab/Enter/Space operate the study, read, kit, delivery, copy and cancel actions | seeded-native | PASS |
| M11 | Failed native write preserves last durable life, shows reload instruction immediately, and succeeds once after reload and explicit retry | seeded-native | PASS |
| M12 | Guided comparison, fine-knife variant, exact stamina-free rest, every cancellation variant and rest spanning natural expiry | source | PASS, `current-source-fa10.txt`, 10 tests |
| M13 | Scheduler support loss refunds body/location/clock/author/hands/battle failures; stale quotes and forged effects, costs, due time, version and returned reservations reject | source | PASS |
| M14 | Missing, borrowed, equipped, foreign-world/body/tool and occupied-bench admission cases; loss of a physical copy preserves learned knowledge but blocks physical work | source | PASS |
| M15 | Old R3 life imports with all three optional domains absent. Rendering, Save, reload, Export and literal-file Import create no manual-study, fieldcraft or assay enrollment, knowledge or stock | seeded-native | PASS |

Native mid-job support loss remains **OPEN**: normal work reserves the body and
attention, and travel controls are hidden while it is pending. The recovered
travel probes did not leave Village and do not prove a refund on lost support.
There is no honest current UI route to revoke Eda's method, alter the body or
forge the held job mid-action. Those guards have source proof only. The guided
and fine-tool alternatives also remain source-only; the required plain-tool
route has browser proof.

## Stamina investigation

**F3, seeded-native:** The real pale-vial control reserved one stamina. Before
Village regeneration could race the observation, the native display read
`50/51 stamina`, the durable reservation had `stamina_to_full: 1`, and a fresh
native Save still had that same debit. Pending Save/reload/Export/literal-file
Import retained it. Play then resumed and normal Village regeneration returned
the character to full stamina. `current-11-control-stamina-result.json` records
the exact evidence. No debit defect reproduced in this path, and no speculative
stamina repair was made. The probe stops wall-clock timers after the real
durable reservation; it changes no game values, and reload resumes normal time.
The same check on the exact **clouded negative trial** also passes: one durable
and live-native stamina debit survives its pending restoration, then one empty
container and the unchanged dull knife return with no identity. See
`current-21-clouded-debit-result.json`. Thus both the R8 action and its useful
control were exercised, not merely a related recipe.

## FA13 leaves

| ID | Leaf and observed result | Label | Status |
|---|---|---|---|
| A1 | Inherited negative observation is inconclusive: without a firsthand control the comparison is unavailable, and real keyboard activation creates no job or identity | seeded-native | PASS |
| A2 | Separate pale-vial trial holds one full charge and owned dull knife, spends one stamina, returns one empty container and the corresponding sharp tool, and records a firsthand attributed control | seeded-native | PASS |
| A3 | Actual comparison records inference using the retained negative and control; no inventory quantity changes or refunded charge | seeded-native | PASS |
| A4 | Real finite purchases exhaust the two packing pins and last clouded vial. Washing consumes one full charge and one gummed pin, returning one empty container and one recovered pin | seeded-native | PASS |
| A5 | Scraping needs no vial, holds/returns the unchanged dull knife, and recovers the other pin. Cancelled scraping returns the pin and knife without a result | seeded-native | PASS |
| A6 | Native cutting spends one log for two wet staves; ordinary drying makes one sound stave. One pin, sound stave and set resin become one existing survey kit | seeded-native | PASS |
| A7 | Kit stock 7 → 8, then Eda's funded order takes two real kits and pays two coins. This is a fungible counted-key consumer, not unique kit identity tracking | seeded-native | PASS |
| A8 | Ration raises Rill's satiety to 2; each of two actual lessons spends one satiety and dog stamina, learns one lesson, and stops at 2/2. Feeding to 4/4 exposes the full-refusal control | seeded-native | PASS |
| A9 | Retrieval unavailable before scent. One actual second-use charge leaves an empty vial and a twelve-minute condition on the actual fitter. Trained retrieval completes while that condition is live, moving one finite pin and spending care/effort | seeded-native | PASS |
| A10 | Ordinary manual retrieval moves the second recess pin; exhausted pins refuse further recovery. Handoff sets willingness false, resume restores it, without resetting care, learning or stock | seeded-native | PASS |
| A11 | Discovery, two oil uses and Rill retrieval each earn one attributed feat. All three remain once after Import and appear as earned in the player-visible Field feats panel | seeded-native | PASS |
| A12 | Pending control, inferred identification, recovered pins, useful kit delivery and final care/feats each pass Save/reload/Export/literal-file Import with the stated cache qualification | seeded-native | PASS |
| A13 | Keyboard Tab and Enter reach comparison, sharpening, washing, cancellation, kit binding, feeding, lessons, scent and dog retrieval controls, with visible focus | seeded-native | PASS |
| A14 | Missing/custody/equipped/body/site/stale cases, forged job effects and failed durable publisher reject; lost body/location support and withdrawn dog willingness return reserved inputs without result or feat | source | PASS, 13 worktree-bound probe checks |
| A15 | Two actual lesson cap, ordinary scraping without identity, exact provenance, no rendering/reload feat replay and no implicit conduct enrollment | source | PASS |
| A16 | Fresh negative run refuses a lesson at zero care; a full 4/4 Rill then refuses feeding with one actual spare ration held, preserving that ration | seeded-native | PASS |

Forced support/body/clock/custody failures and forged imports remain
**source-only**, with native variants **OPEN**: normal UI reserves participants
and does not offer a way to rewrite their bodies, clock, ownership or held
effects. No failure was inferred from merely clicking a hidden travel control.
The failed-publisher native example is FA10's real shared publisher path;
FA13-specific failed writes remain source-only.

## Evidence method

`fixture/generate.mjs` uses actual native `importSaveFile`, `load`,
`character.addToInventory`, `create_save` and `encodeSaveFile`, then imports into
a second model. FA10 adds four ordinarily craftable sound staves, one ordinary
sharp knife, sap, paper and ink to the historical R8 test save. FA13 adds no
items. The old-absence fixture comes from R3; the fresh negative-trial fixture
comes from R7. Both add no items. Each hero is
named `TEST FIXTURE R15 G3 ...`. `fixture/VERIFICATION.json` records unchanged
expansion state, exact stock deltas and zero load warnings. These fixtures seed
prerequisites only; the tested effects run through browser controls.

Current loaded and disk bundle SHA-256:
`84746e7891da46f2f7a7f89cf67a712f43c31454c5c479da065fb53eff734e1c`.
Checkpoint rows bind every reload/import to these rebuilt bytes. The earlier
worker's `fa10*` and `fa13*` journals and hashes are preserved as pre-merge
evidence; `current-*` results and `persistence-current-*` are the merged replay.
The reused FA13 step files also reuse their export filenames, so those exports
contain the latest merged replay, not the older journal's bytes. The historical
hashes are qualified in `historical-fa13-export-disposition.json`; the original
final export is separately retained as `partial-fa13-final-export.txt.gz`.

Persistence comparisons include character, all native person inventories, the
whole expansion, calendar, location, NPCs and NPC equipment. Reload compares
strictly. Export can populate derived equipment fields (`stats`, rarity,
inventory key, attack power, bonus skill levels); their exact paths are listed
in each result. Export/Import equality excludes only those listed caches; other
differences must be empty. Early partial strict comparisons that failed on these
caches remain recorded as failures, followed by the qualified passing checks.

The first current cancellation assertion compared inventory object key order
instead of quantities. Returned items moved to the end of the object; counts,
money and effort were intact. The corrected count comparison passed. The
original failed harness result is retained in
`evidence/harness-cancel-order-comparison.json`.

Two recovered summary probes also used the older `repositories.miri` actor
instead of the actual fitter `feature_objects.miri`. Their summarized scent
field was therefore null, and their Eda-effort/pin-owner assertions were not
evidence for the actual owner. The selectors are corrected. The final real
export confirms the actual scent lasts through retrieval and that Eda's finite
pins are exhausted (`current-17-fa13-assertions-result.json`); a separate
copy-cancel check records the actual fitter's effort before, during and after
cancellation. The old summaries are retained with this qualification.

That direct native cancellation check reads Eda's actual stamina **7 → 6 → 7**,
her coins unchanged at 44, and the player's full counted inputs and purse
returned. The source probe's advance helper was also corrected to consume
`advanceSimulation`'s returned native offsets, instead of treating its unchanged
input vital map as the advanced result. A loss-of-health fixture now preserves
the already-reserved stamina instead of assigning an unrelated value. Exact
refund assertions pass with that adapter. These were harness errors, not
runtime defects; `harness-native-offset-comparison.txt` retains the first failed
comparison.

Source verification: `npm test` **611/611 PASS**, including 10 FA10 tests and
the two UI regressions. The worktree-bound FA13 probe passes 13 checks, including
lost support and dog willingness refunds. `evidence/current-checks.json` records
the build and suite; `regression-before.txt` / `regression-after.txt` record both
UI regressions failing before and passing after. Harness instructions and the
compact-export format are in [README.md](README.md).
The committed harness, fixtures and evidence total about 1.6 MB. The 13 retained
current exports are losslessly compressed; each uncompressed byte hash was
checked again against its actual native checkpoint. Superseded partial exports
and redundant screenshots stay in the local `/private/tmp/` archive. Browser
profiles are excluded. Rebuilt `dist/` and the HTML version bump are excluded
from the worker commit; root rebuilds after integration.

## What remains open

**R1:** Native forced support-loss and synthetic invalid-input variants described
above, FA10's guided/fine-tool alternatives and FA13-specific failed storage
writes were not exercised in the browser. Their source checks pass. Normal UI
cannot manufacture the body, custody, clock or forged-job states, and forcing
those into a save would test rejection rather than an honest play route.

**R2:** Weibao's fiction, pacing and balance acceptance, natural acquisition from
a new game, and root's integrated recovery/review remain outside this G3 proof.
No taste acceptance or whole-chain completion is claimed. No push is performed.
