# LP7 material choice proposal

At Eda's fitting bench, spend one log and one sap to refit an owned sharp knife for either cutting yield 3 instead of 2, or a fine guide that supports your separately learned Grain matching. Both are labelled PROPOSAL. Implemented and exercised on 2026-10-14 under Weibao's LP2-LP8 dispatch; play and taste are not yet accepted.

Target: 1366 × 768 desktop. Visible result: one material choice at Eda's existing fitting bench, either cutting yield 2 → 3 or a fine guide that supports separately learned Grain matching. Mobile optimization is deferred.

Entry route: Village → meet the ordinary craftsman → Tools, practice & local lives → Meet Eda, the sluice fitter → Fitting tools & materials. Own a sharp fitting knife and supply one Rough wood log and one Tree sap. Both PROPOSAL refits reserve the existing one-slot bench for three played minutes and spend one stamina. The broad knife recovers three wet staves instead of two; the fine guide retains yield two and enables the existing learned matching consumer. Neither changes rarity, item level or learning.

Compatibility decision: additive native item keys and commands under the existing optional feature_objects activation. No new save field or version. Old saves receive no stock, learning or activation. Old refit definitions and pending job terms remain unchanged. New LP7 refits use the same site and scheduler as existing cutting, drying and learning.

To try the stat choice, buy an owned fitting knife for six coins, choose **PROPOSAL · Broad back: cutting yield 2 → 3**, wait three played minutes, then **Cut one actual log into three wet staves**. For the function choice, choose **PROPOSAL · Fine guide: enable learned Grain matching**. Inspect the joint, watch Eda's actual sample, and complete **Practice Grain matching with Eda · 1 coin + 3 min**. Buy a sound stave for two coins and use **Match an inspected sound stave along its grain**. It yields one real matched insert and six Woodworking XP. The insert supplies the existing sealing task; LP7 does not add another recipe ladder.

## Files and integration scope

F1. `src/feature_expansion_objects.js` adds broad sharp/dull native item descriptors, two three-minute refits, one four-minute broad cutting batch, and exact edge restoration. `src/feature_expansion_objects_host.js` computes broad ownership eligibility and read-only choice, stock, slot and learning labels. `src/feature_expansion_wave_host.js` shows those records and replaces the duplicate legacy guide offer with the two labelled choices. The legacy command definitions remain registered for old jobs.

F2. `tests/lp7_material_choice.test.js` covers output conservation, learning and guide separation, slot capacity, unsupported/missing/borrowed/equipped means, repeat use, cancellation and old save states. `lp7-evidence/browser.cjs` runs the rebuilt native UI on port 8200 at 1366 × 768, using the unchanged earned R1 public checkpoint as its starting inventory. Purchases, refits, baseline and improved cuts, lessons and matching are performed through UI commands. A Playwright clock advances normal gameplay timers; it never calls the simulation executor or supplies stock.

F3. Merge risks against `codex/gameplay-foundations` and sibling LP lanes: the three feature expansion files are existing shared seams. Resolve adjacent array/import/projection edits by retaining both lanes' commands and records. The LP7 IDs begin `feature_objects.choose_`, `feature_objects.cut_broad_own` and `feature_objects.repair_broad`; new item keys are the broad knife variants. No `main.js`, global save schema, registry family or scheduler edit. Generated `dist/bundle.js`, source map and `index.html` cache fingerprints are local build output; integration should rebuild them from combined source. LP7's visibility filter hides only the two legacy refit offers, not their definitions or pending state.

## Source and build checks

V1. `npm run build` passes. The committed source uses the ordinary native item registration, command executor, single fitting site and durable publisher. No package installation.

V2. `node --test tests/lp7_material_choice.test.js`: 6 tests, 6 passed, 0 failed. The affected LP7, cooling refinement, fieldcraft saved job and save compatibility slice: 31 tests, 31 passed, 0 failed. These counts overlap.

V3. Final `npm test`: 1,400 tests, 1,397 passed, 0 failed, 0 skipped, 3 existing TODOs. Those TODOs in `tests/determinism_replay.test.js` concern legacy native combat RNG, local-life search/contact RNG, and encounter/loot/craft/market/gather RNG. No pre-existing failures were observed. The initial full run had three LP7 test-fixture mistakes; those were corrected before this final run. Exact counts are committed in `lp7-evidence/checks.json`; raw logs remain local and ignored.

V4. `git diff --check -- src tests docs/research/hogwarts-legacy index.html` passes. The generated minified bundle inherits trailing spaces from bundled text; it is not covered by that source/doc whitespace check.

Test Export files and raw logs are retained locally and ignored by Git. Screenshots, the browser harness and result records provide committed evidence without publishing full save payloads.


## Rebuilt desktop and persistence evidence

V5. `node docs/research/hogwarts-legacy/lp7-evidence/browser.cjs`: 12 groups passed, 0 page errors. `rewards.cjs`: one additional group passed. Both use isolated browser contexts on port 8200 at 1366 × 768. The browser starts from the unchanged existing public R1 natural-prerequisite checkpoint with 95 owned logs and 3 sap. LP7 creates neither that stock nor a new beginning. The proof buys an actual knife from Eda's finite stock, then compares the two refits from the same subsequently earned checkpoint. Normal gameplay timers pay time; no simulation entry point or stock/learning injection is used.

| Acceptance | Observed result |
|---|---|
| Stat before and after | Ordinary cutting produced 2 wet staves. Broad cutting added 3, moving actual owned wet stock from 2 to 5 for one log, two stamina and four played minutes. The broad knife returned dulled. |
| Function before and after | Owning the fine guide alone taught nothing and matching remained unavailable before the paid lesson. After instruction, one bought sound stave became one matched stave, the fine knife dulled, and 6 actual Woodworking XP was retained. |
| Real refit costs | Each refit consumed the owned sharp knife, one log, one sap and one stamina, with no output before completion. Native stock changed from 94 logs / 2 sap to 93 logs / 1 sap. |
| Slot limit | The accepted refit occupied the existing bench's only slot, displayed 1/1, and blocked the alternative. Completion freed it. Controlled SOURCE checks also isolate capacity refusal from player attention. |
| Separate labels | The UI explicitly shows Common rarity, fixed item level 1, cutting yield and learned-method status. Refitting never grants the lesson or a rarity/level increase. |
| Pending and complete restore | Both choices passed Save, reload, actual Export, and file-input literal Import with native stock, money, RNG, actor records, jobs and site reservations matching. Four checkpoints were exercised. |
| Rewards and repeat Import | A separate fresh context restored the actual matching Export, reloaded it and literally imported it twice. All native skill XP, character XP, money, stock and completion counts matched; Woodworking stayed at 6 XP and the matched stave stayed at 1. |
| Old save and served build | The older checkpoint loaded with its original inventory and no LP7 activation or stock. Served bundle SHA-256 matched the rebuilt local bundle: `1142c2ead0583d93c27c69d907f658ea3a51a4b2c04f8237ea0b00bcaeed184c`. |

Screenshots: [stat choice](lp7-evidence/01-stat-choice-before.png), [occupied slot](lp7-evidence/02-slot-reserved.png), [stat output](lp7-evidence/03-stat-output.png), [guide before lesson](lp7-evidence/04-guide-before-lesson.png), [matching after lesson](lp7-evidence/05-function-choice-after-lesson.png), [function output and separate labels](lp7-evidence/06-function-output.png). Machine-readable records: [checks](lp7-evidence/checks.json), [browser results](lp7-evidence/results.json), [native XP and repeated Import](lp7-evidence/rewards.json).

## Verification limits and remaining gate

The LP7 row's acceptance path is exercised. Native cancellation, borrowed/equipped/body-refusal variants, broad edge restoration and a second broad cutting batch remain implemented-unverified in the browser; their controlled SOURCE checks pass. Installing the matched insert and further downstream production are existing consumers, not claimed as exercised by this LP7 run. Mobile optimization is deferred. No whole-world, broader Foundation-chain or director acceptance is claimed.

The one remaining LP7 acceptance gate is Weibao's play and taste. The candidate is served at `http://127.0.0.1:8200/`. Branch `codex/hl-lp7` is for coordinator review; no push or merge was performed.
