# HV1 wolf-rat processing

F1: Native Combat.doCombatAction calls Enemy.get_loot, inserts item-template keys, then kill_target records bestiary progress. Enemy damage currently has physical hits and crits, no anatomical targeting. Combat snapshots retain encounter/enemy keys and health but need retained handling inputs for mid-fight reload.
F2: Item keys already support numeric quality. OtherItem can retain it; completeness needs a dedicated optional key field. Material-ID matching finds graded stacks but a legacy plain stack currently short-circuits that search.
F3: Existing Butchering recipe spends six Rat pelts for one Piece of wolf rat leather with its existing success chance. Preserve that cost and chance.

D1 / HM4: Supported templates are Starving wolf rat, Wolf rat, Elite wolf rat, Elite wolf rat guardian and Wall rat. Replace only their Rat tail, Rat fang and Rat pelt chance rolls. Guardian Weak monster bone stays independent. Unsupported species keep all drop behavior and Butchering drop multiplier. Wall rats have tails/fangs only, matching their existing table. No meat added because no rat-meat item exists. Each other rat yields one pelt, one tail and two fangs before bounded skill yield bonus. Kill creates one specimen; taking one part consumes the carcass and explicitly leaves the rest behind.

D2 / HM6: Use canonical {id,quality,completeness} keys, quality in steps of five, completeness whole/damaged/scraps. Keep legacy {id} keys unchanged. Matching recipes aggregate plain and graded material-ID stacks, cheapest first, stopping at the existing material-change boundary. Leather carries quantity-weighted quality of the actual pelts consumed; plain legacy inputs count as quality 100. Completeness is spent as material condition, not copied onto leather. Equipment quality recipes later use graded leather quality as input. No grade-suffixed item IDs.

D3: Optional harvest owner, schema/revision 1. Per-species FIFO lots capped at 24; one held job. Freshness uses played calendar minutes, no wall-clock spoilage. Default keeps carcasses, leaves incoming overflow with an explicit counter. Opt-in auto-process handles overflow whole and processes queued lots over played time. Finished parts never discarded. Cancellation returns the held specimen to its slot. Balance and appearance remain director proposals.

Checks: source audit only. Native and persistence gates OPEN.
