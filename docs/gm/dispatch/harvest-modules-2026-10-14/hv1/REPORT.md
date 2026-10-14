# HV1 wolf-rat processing

F1: Native Combat.doCombatAction calls Enemy.get_loot, inserts item-template keys, then kill_target records bestiary progress. Enemy damage currently has physical hits and crits, no anatomical targeting. Combat snapshots retain encounter/enemy keys and health but need retained handling inputs for mid-fight reload.
F2: Item keys already support numeric quality. OtherItem can retain it; completeness needs a dedicated optional key field. Material-ID matching finds graded stacks but a legacy plain stack currently short-circuits that search.
F3: Existing Butchering recipe spends six Rat pelts for one Piece of wolf rat leather with its existing success chance. Preserve that cost and chance.

D1 / HM4: Supported templates are Starving wolf rat, Wolf rat, Elite wolf rat, Elite wolf rat guardian and Wall rat. Replace only their Rat tail, Rat fang and Rat pelt chance rolls. Guardian Weak monster bone stays independent. Unsupported species keep all drop behavior and Butchering drop multiplier. Wall rats have tails/fangs only, matching their existing table. Existing Rat meat chunks were found on the deeper item pass; this slice deliberately retains three existing rat-drop parts rather than introducing a food yield. Each other rat yields one pelt, one tail and two fangs before bounded skill yield bonus. Kill creates one specimen; taking one part consumes the carcass and explicitly leaves the rest behind.

D2 / HM6: Use canonical {id,quality,completeness} keys, quality in steps of five, completeness whole/damaged/scraps. Keep legacy {id} keys unchanged. Matching recipes aggregate plain and graded material-ID stacks, cheapest first, stopping at the existing material-change boundary. Leather carries quantity-weighted quality of the actual pelts consumed; plain legacy inputs count as quality 100. Completeness is spent as material condition, not copied onto leather. Equipment quality recipes later use graded leather quality as input. No grade-suffixed item IDs.

D3: Optional harvest owner, schema/revision 1. Per-species FIFO lots capped at 24; one held job. Freshness uses played calendar minutes, no wall-clock spoilage. Default keeps carcasses, leaves incoming overflow with an explicit counter. Opt-in auto-process handles overflow whole and processes queued lots over played time. Finished parts never discarded. Cancellation returns the held specimen to its slot. Balance and appearance remain director proposals.

The dated stages below retain their evidence at that point. Final status and coverage are at the end.

## Part table and formulas (proposal)

| Part | Count | Work with tool | Damage sensitivity |
|---|---:|---:|---:|
| Rat pelt | 1 | 2 played minutes | 1 |
| Rat tail | 1 | 1 played minute | 0.65 |
| Rat fang | 2, +1 at Butchering 25 | 1 played minute | 0.35 |

Whole gives all supported parts and sums work and XP; hands double work time. Take-one gives only that part and leaves all other tissue behind. XP is twice the part's base work minutes. No additional random success roll.

Completeness: integrity starts at 100. Subtract sensitivity times (35 times overkill divided by max health, capped at 2; 3 per landed strike after the first; 8 per critical attack; damage penalty physical 0, cut 8, blunt 16, fire 40, magic 25). At least 75 means whole, at least 40 means damaged, otherwise scraps. Native edged weapons count as cut, hammers as blunt, hands as physical. No anatomical/body-part roll is claimed.

Quality: 45 + 0.6 per Butchering level up to 100 + 0.15 per cutting-tool quality up to 150 + 25 times freshness + specimen condition modifier (robust +5, frail -5). Freshness falls linearly from 1 to 0 over 240 played minutes. Clamp quality to 10..150 and round to five. Condition/size/variant share one loot-stream specimen draw keyed to the encounter enemy: under .1 frail, above .9 robust; under .2 small, above .8 large; above .97 unusual. Size/variant have no potency bonus in this slice. Preview consumes no draw.

V1: Eight pure module tests passed, including same-seed replay, no-draw preview, separate damage inputs, cancellation slot, mixed recipe quality and two identical 10,000-kill runs.

V2: Build passed after native joins. New harvest_ui.js exposes timed whole/take-one controls, opt-in auto processing and grade previews/receipt. Explicit jobs occupy the player and can be canceled with the specimen returned; automatic jobs accompany combat. Existing equipped edged weapon doubles as cutting tool, hands remain reachable. Developer inspector requires the existing dev deployment or explicit ?harvest-inspector=1 URL opt-in; ordinary play has no inspector. Native paths remain unexercised at this commit.

D4 / compatibility: Old saves omit harvest and remain absent until the first supported kill or setting change. Loading/import never draws a specimen or grants output. Pending native encounters now optionally retain accumulated harvest damage; pre-HV1 pending encounters start with no recorded earlier hits, preserving their existing saved health without guessing history. Existing plain parts remain usable and quality 100 for blending. Unknown schema/revision, future birth times, duplicate held claims, over-cap lots, invalid damage and noncanonical grades reject before import publication.

V3: Eleven focused tests and rebuilt candidate pass. Optional owner, pending/completed JSON roundtrips, malformed import and held-slot flood controls included. Manual decisions and timed settlement use native model snapshots and durable saved-envelope publication with rollback on a pending failed write. Live clocks stay played-time only. Native literal import still OPEN.

## Final native evidence

V4 / NATURAL: Fresh disposable Chrome profile `/private/tmp/hv-hv1-profile-natural`, hero `TEST FIXTURE HV HV1 NATURAL`, isolated port 22430. Elder hello → injury question → need to leave → starting sword; equip sword and pants; enter Infested field. Actual fights, ordinary defeats/rest and auto-food use earned the first 15-kill clear; elder cleared-field line unlocked the craftsman; hello/learn unlocked existing crafting. No state, RNG, inventory, skill or damage injection. The final persistence journey reached 17 kills (5 Wolf rats, 12 Starving wolf rats).

V5 / NATURAL: Both 1366x768 and 1600x1000 were exercised. Carcass choices show part count, completeness, quality, minutes and base Butchering XP; local controls scroll independently while vitals/inventory/reports remain available. Manual tail-only yielded exactly one tail and no pelt/fang; whole yielded pelt/tail/two fangs. Cancel returned the exact lot. Whole pending Save/reload preserved harvest, full stock, XP and RNG; completed reload and a UI Export followed by literal file input Import in a second fresh profile preserved the same projection exactly, including after PLAY and another Save. Developer inspector is absent in normal play and present only through explicit opt-in. Zero page errors. [Browser evidence](proof/BROWSER_EVIDENCE.json), [finishing harness](proof/finish.cjs).

V6 / NATURAL grade comparison: A 7-strike, no-crit cut kill with 1.58% overkill produced a whole tail (integrity 83); a 17-strike, no-crit cut kill with 4.14% overkill produced a damaged tail (integrity 63). These are relatively cleaner/messier real kills, not a claim of a pristine one-hit pelt. Their pelts were both damaged. One-hit whole-pelt and heavy overkill/scraps controls are SOURCE tests. Freshness differences separately produced 70% versus 75% handling quality.

V7 / NATURAL recipe: Existing six-pelt leather recipe consumed one quality-70 pelt plus five damaged quality-75 pelts. Quantity-weighted quality rounds to 75; the recipe really produced one quality-75 Piece of wolf rat leather. Native receipt stated one made, six spent and measured XP. The receipt now counts all grades of the result ID, so it does not falsely report zero for a graded output. [Craft evidence](proof/CRAFT_EVIDENCE.json), [desktop leather](proof/leather-1600.png).

F4: Initial native processing exposed locked Butchering and the generic noncraft XP cap. Completion now unlocks the existing Butchering skill and grants work-scaled base XP without the per-hit cap, retaining ordinary XP bonuses and parent propagation. Native later processing increased Butchering XP and earned levels. No retroactive grant on load.

F5: Initial reload reconstructed materials with id/quality and stripped completeness. All v0.6 inventory-owner loads now retain exact harvest keys. The early disposable fixture's already-degraded quality-only keys remain legacy stock; no state was fabricated to repair them. Later native Save/reload and literal-file import preserve exact completeness. Old quality-only keys, including non-five-step historical quality, retain the old reader contract.

F6: Review of final screenshots exposed repeated occupancy notices from a read-only running projection. Its getter now reads the occupation reason without logging; actual actions retain their ordinary guards. A final rebuilt natural refresh verifies whole processing, exact graded-stock reload, both viewports and no projection log flood. The existing Current work bar now names the processing choice and remaining minutes rather than claiming no work is running. [Final refresh](proof/FINAL_REFRESH.json) binds those claims to the final served bundle. Earlier full-journey evidence remains bound to its recorded candidate hash; these presentation changes do not alter harvest, recipe or import logic.

D5 / downstream compatibility: Supported Butchering recipes also pass grades to Processed rat pelt and Rat meat chunks. Recognized graded leather/pelts affect the existing clothing/cape quality calculation. Other materials retain their previous calculation. Guardian bone still rolls independently, without a supported-rat Butchering drop multiplier. Other beast species retain their old multiplier. No authored non-rat drop table is changed.

## Balance and limits

R1: Whole ordinary rats now supply one tail, two fangs and one pelt instead of independent 4%, 4%, 1% drops. Before market saturation, base values total 30 versus old expected 0.58 per Wolf-rat kill at unmodified odds; at quality 75, roughly 22.5 before native price rounding and merchant rules. This is a large supply increase, intentionally visible for judgment. Existing merchant prices and six-pelt recipe costs remain data-driven and unchanged. Overflow auto-processing immediately resolves the incoming whole body rather than extending an unbounded queue; this exceptional overflow route charges no extra played minutes. Default overflow leaves the incoming body with a visible count. Finished parts are never discarded.

R2: Completeness is retained physical metadata and a separate stack/name. Current generic recipes accept scraps as pelts at the same item count; quality affects value and supported downstream material quality. There is no implemented appraisal tier, grade-constrained traveler ask, corpse sale or food-quality effect. Four-hour aging reduces handling quality, never silently deletes a corpse or a finished part. Size/variant are retained specimen traits with no combat potency or extra-body-part roll. Extended balancing stays a proposal.

Shared runtime joins: src/main.js (kill hook, clock, occupation, saves/load, output keys), src/models/combat.js (damage history and snapshot), src/enemies.js (supported drop filtering/modifier), src/items.js (graded decoding/name), src/crafting_recipes.js (matching and quality), src/display.js (truthful graded craft receipt), src/data/skills.js (effect description), src/seeded_streams.js (optional encounter-damage validator), src/save_files.js (full-envelope validator). Main logic is isolated in src/harvest.js and src/harvest_ui.js. No root checkout writes, merge or push.

See BACKLOG for unexercised native branches and deferred HM9/HM10/mobile. Human balance/taste is separate from passing technical checks.

## Final checks and delivery

V8 / SOURCE: 13/13 focused tests pass. Includes independent kill inputs, tool/freshness/skill quality, hands-versus-tool time, skill-25 fang yield, key/legacy compatibility, optional owner and malformed-state rejection, pending-slot caps and weighted actual recipe expenditure. The Node headless owner stress sends 10,000 kills twice per scenario. The loot-stream scenario covers all five species, reloads halfway and compares exact specimens, output stock, owner and RNG. Long browser-combat overflow is explicitly unexercised, not disguised as natural proof.

V9 / SOURCE: Final npm test has 1380 tests, 1377 pass, 0 fail, 0 skipped, 3 existing TODO, 39205.124917 ms. Final npm run build passes. Task-source/document git diff --check passes. [Check metadata and hashes](proof/CHECKS.json). Counts are this final snapshot, not sums of the earlier overlapping runs.

Five stage commits on proc/hv1-carcass; no merge/push. Generated dist and index.html are not staged. The isolated rebuilt server remains on port 22430 for review. Technical requested proof is complete at this scope; the unexercised branches and human balance gate remain separately listed in BACKLOG.
