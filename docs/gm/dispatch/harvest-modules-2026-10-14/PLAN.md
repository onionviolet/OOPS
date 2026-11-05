# Harvest modules: carcass processing, part grades and skill feed (2026-10-14)

Weibao, 2026-10-14: "we should make resource generation more reasonable, every rat killed can be processed for their stuff and more? or we can harvest only specific stuff? per deeper modulization and stuff, that can feed skills and stuff, rarirty or compleness of pelts obtained and more?" Proposals below are not accepted decisions. Both "process everything" and "take only what you need" stay reachable (standing "everything possible, reasonably").

## Original source snapshot, 2026-10-14 (historical)

- Kills roll independent per-item chances: wolf rat gives Rat tail 4-8%, Rat fang 4%, Rat pelt 1-2% (`src/enemies.js:240-305`, `get_loot` at `:164`, seeded through P1 `STREAMS.loot`).
- `Butchering` only multiplies drop chance for `beast` tags (`src/enemies.js:24`). Butchering recipes turn pelts into leather (`src/crafting_recipes.js:947+`). No carcass, no part choice, no grade, no completeness.
- Design exists: [P8 creature resources](../procgen-2026-10-13/p8/CREATURE_RESOURCES.md) D1 (one partitionable carcass per supported kill, parts reserve portions, no double pay, quality from handling) and slice R6-A. [Crafting palette](../../../PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md) RX3 covers harvest provenance as batch properties. Absorb-all `p23-salvage` covers taking apart items, not bodies.

## More to consider

### Act now (inside HV1)

| Code | Consideration | Disposition |
|---|---|---|
| HM1 | **Both routes.** "Process whole" yields every part but takes longer and wants tools; "take only X" is quick and the rest is left or spoils; an optional auto-process setting covers idle fighting | HV1 builds all three for one species family |
| HM2 | **Carcass record per kill** for supported species only (wolf rat family first). Specimen traits (size, condition, rare variant) drawn from the loot stream keyed by the kill, saved, so reload never rerolls | HV1 |
| HM3 | **Grade from how it died and how it was handled.** Completeness (whole, damaged, scraps) from overkill, hit count, damage type and crits; quality from processing skill, tool quality and freshness. Not a rank-to-potency formula | HV1; exact formula unit-tested and listed in REPORT for Weibao to judge |
| HM4 | **No double pay.** Supported species stop rolling per-item chance drops for parts the carcass now owns. Unsupported creatures keep today's tables. `Butchering` changes from drop-rate multiplier to yield and grade bonus for supported species | Explicit compatibility decision in HV1 REPORT |
| HM5 | **Skill feed.** Processing grants Butchering XP scaled by work done; better grades need skill. New sub-skills (skinning, tanning, anatomy) are HV2 design, not HV1 | HV1 uses existing skills only |
| HM6 | **Graded items in inventory.** Check whether materials can carry quality in their inventory key like equipment. If not, choose the smallest safe route (quality on key, or grade-suffixed item IDs) and state how recipes consume mixed grades and pass quality on | HV1 decision with save roundtrip test |
| HM7 | **Save size and idle floods.** Auto-fight can make hundreds of carcasses. Keep carcasses as per-species lots with a cap and freshness clock; overflow is auto-processed or left behind by setting, never silent loss of finished parts | HV1 |

### Account for now

| Code | Consideration |
|---|---|
| HM8 | Processing is a timed activity like crafting, interruptible, with preview that consumes no draws |
| HM9 | More pelts change trader economics; whole carcasses and scraps can sell too. Keep trader prices data-driven; note balance for Weibao |
| HM10 | Traveler asks gain natural stretch goals ("a whole unblemished pelt"): [TA Amendment 1](../traveler-asks-2026-10-14/PLAN.md) TA-A1x reserves a `grade` field |
| HM11 | Lenses and debug: appraisal shows grade and completeness at the tier the player knows (GL1); a developer inspector shows the specimen draw and the grade inputs |
| HM12 | Hot files: `src/enemies.js`, combat loot path in `src/main.js`, `src/items.js`, `src/crafting_recipes.js`. Other absorb-all lanes touch nearby code. HV1 keeps new logic in its own module with thin native hooks |

### Later / delegate (HV2, docs)

Modular harvest beyond rats: plants (pick leaf versus uproot), ores and veins, magical creatures under per-world laws (P8 D3), nonlethal collection and husbandry; part templates per body plan; knowledge-informed part selection (deliberately selecting a gland needs a way to locate it; whole-specimen or compatible bulk processing still resolves unknown physical contents under MR1/AD38); sub-skills and skill tree; rarity tiers and rare variants as per-world adjectives; trophies; parts feeding P2 mixtures as properties; spoilage and preservation (salt, smoke, cold); helpers, companions and automation; part-diagram UI; cheats.

## Lanes

| Lane | Task | Kind | Route |
|---|---|---|---|
| HV1 | Wolf-rat carcass slice: carcass lots, process whole / take one part / auto-process, completeness and quality grades, Butchering feed, graded inventory, lint and browser proof | code, worktree `hv1-carcass`, branch `proc/hv1-carcass`, port 22430 | Codex default model, high |
| HV2 | Modular harvest framework across creatures, plants, ores and magic, per-world laws, skills, rarity, preservation, knowledge-gated parts, cheats; ranked build slices on HV1's shape | docs, `hv2/` | Codex default model, medium |

## Current rule qualification, 2026-10-18

[HV1's report](hv1/REPORT.md) records a later carcass/graded-parts implementation
and its own bounded source/build/browser limits. The opening "no carcass" text
is a pre-slice snapshot, not a current absence claim. Recover the actual consumer
before proposing a replacement or reusing evidence (AD36, AR10).

Making MR1/MR5/MR29 and combat CBR2/CBR3 qualify the next selected extension:
an actual dead specimen, shed material or other supported resource source and
its custody determine what can be processed. A surrendered living actor is not
a carcass just because a generic victory hook ran. Mid-processing interruption
retains performed work and remaining stock once. Coalesced lots must retain
observable quality/freshness/custody distinctions their consumers read; a
technical cap cannot silently destroy valid paid outputs or become a universal
biological limit (AD22/AD38). No new species, loot rebalance or runtime fix is
selected by this document audit.


## Content reconciliation B287: final HV1 scope and actual harvest limits

The full [HV1 report](hv1/REPORT.md) qualifies HM1–HM12. Five supported rat templates replace only their owned tail/fang/pelt rolls; guardian bone remains independent, unsupported beasts keep their old behavior, and wall rats have no added pelt. Take-one consumes that carcass and explicitly leaves the rest. Plain legacy goods remain valid; canonical graded keys preserve quality/completeness, while pre-HV1 pending damage retains no invented earlier hits. Actual dead specimens or other supported shed/material sources remain distinct from a surrendered living actor.

The reported natural journey earns ordinary field/craftsman access and reaches 17 kills, then exercises selective/whole processing, cancellation, pending/completed reload and literal import. Its relatively cleaner and messier kills demonstrate whole versus damaged tails; both pelts were damaged. Pristine one-hit pelt, heavy overkill/scraps and 10,000-kill runs are source tests, not natural play. The actual six-pelt recipe consumes one quality70 plus five quality75 inputs and produces quality75 leather through quantity weighting/rounding. Later F4/F5/F6 corrections address real Butchering XP/unlock, lost completeness on reload and read-only projection log floods. Each earlier journey and final presentation refresh keeps its exact candidate identity rather than inheriting the latest bundle by implication.

Preserve material differences that later consumers actually read. Completeness is stored but generic recipes accept scraps at the same item count; quality affects supported value/material readers. This does not implement appraisal tiers, grade-constrained asks, corpse sale, food-quality effects or biological potency from size/variant. Four played-hour aging lowers handling quality without silently deleting stock. The 24-lot cap is an engineering default; finished parts are retained, default overflow leaves an explicitly counted incoming body, and opt-in overflow whole-processing is an exceptional shortcut with no extra played minutes. That shortcut and the large rat-part supply increase remain visible balance choices, not measured fair economy or universal free-processing rules.

Final historical checks report 13 focused tests, build and a full suite of 1,380 total with 1,377 passes, zero failures and three existing TODOs. They do not establish all natural overflow branches or current shared integration. Five stage commits and an isolated review server were reported, with no merge/push and generated files unstaged; neither today's live server nor current branch adoption is reverified here. Current desktop/text requirements qualify old 1366/1600 evidence, and human review remains separate under AD42. Broader plants/ore/magical bodies/preservation/helpers remain useful HV2 possibilities, not a new expansion or balancing task.
