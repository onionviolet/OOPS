# HV1 wolf-rat processing

F1: Native Combat.doCombatAction calls Enemy.get_loot, inserts item-template keys, then kill_target records bestiary progress. Enemy damage currently has physical hits and crits, no anatomical targeting. Combat snapshots retain encounter/enemy keys and health but need retained handling inputs for mid-fight reload.
F2: Item keys already support numeric quality. OtherItem can retain it; completeness needs a dedicated optional key field. Material-ID matching finds graded stacks but a legacy plain stack currently short-circuits that search.
F3: Existing Butchering recipe spends six Rat pelts for one Piece of wolf rat leather with its existing success chance. Preserve that cost and chance.

D1 / HM4: Supported templates are Starving wolf rat, Wolf rat, Elite wolf rat, Elite wolf rat guardian and Wall rat. Replace only their Rat tail, Rat fang and Rat pelt chance rolls. Guardian Weak monster bone stays independent. Unsupported species keep all drop behavior and Butchering drop multiplier. Wall rats have tails/fangs only, matching their existing table. Existing Rat meat chunks were found on the deeper item pass; this slice deliberately retains three existing rat-drop parts rather than introducing a food yield. Each other rat yields one pelt, one tail and two fangs before bounded skill yield bonus. Kill creates one specimen; taking one part consumes the carcass and explicitly leaves the rest behind.

D2 / HM6: Use canonical {id,quality,completeness} keys, quality in steps of five, completeness whole/damaged/scraps. Keep legacy {id} keys unchanged. Matching recipes aggregate plain and graded material-ID stacks, cheapest first, stopping at the existing material-change boundary. Leather carries quantity-weighted quality of the actual pelts consumed; plain legacy inputs count as quality 100. Completeness is spent as material condition, not copied onto leather. Equipment quality recipes later use graded leather quality as input. No grade-suffixed item IDs.

D3: Optional harvest owner, schema/revision 1. Per-species FIFO lots capped at 24; one held job. Freshness uses played calendar minutes, no wall-clock spoilage. Default keeps carcasses, leaves incoming overflow with an explicit counter. Opt-in auto-process handles overflow whole and processes queued lots over played time. Finished parts never discarded. Cancellation returns the held specimen to its slot. Balance and appearance remain director proposals.

Checks: source audit only. Native and persistence gates OPEN.

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

V2: Build passed after native joins. New harvest_ui.js exposes timed whole/take-one controls, opt-in auto processing and grade previews/receipt. Explicit jobs occupy the player and can be canceled with the specimen returned; automatic jobs accompany combat. Existing equipped edged weapon doubles as cutting tool, hands remain reachable. Developer inspector is limited to existing is_on_dev() gate. Native paths remain unexercised at this commit.
