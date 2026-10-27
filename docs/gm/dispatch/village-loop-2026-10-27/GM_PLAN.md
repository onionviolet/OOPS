# Village loop GM plan, 2026-10-27

Owner: `village-gm` session ([COMMON](COMMON.md), brief 1 in [BRIEFS](BRIEFS.md)). Docs only. Everything below is a proposal: Weibao's words and AD codes are the only authority (AD32, [GROUND_RULES](../../../GROUND_RULES.md)). Proposed hunks for PROJECT.md and USER_VISION.md are in [section 12](#12-proposed-hunks-for-shared-owners); this session does not edit them.

**Reading (PRF1).** Weibao wants one gameplay loop working first, in the Village, that gives the game its own identity and grows toward "a whole playable world with endless possibilities" ([USER_VISION, Village loop first](../../../USER_VISION.md#village-loop-first-coordinators-and-gm-plan-2026-10-27)). A relayed clarification from the parent session (2026-10-27) widens the plan to cover cross-world play, Proto23's base gameplay and how the whole idea bank reaches play; those are sections 4, 6 and 9. A later relayed direction from Weibao the same day lets Proto23 code be taken and asks for three sibling worlds (a base Proto23 world, a YAIR world, and our variant); [master plan round 8](../../../MASTER_PLAYABILITY_PLAN_2026-10-25.md#round-8-three-worlds-proto23-yair-and-our-variant-2026-10-27) WV1-WV12 and the [COMMON update](COMMON.md#update-2026-10-27-later-instruction-supersedes-the-copy-no-code-wording-above) own it, and sections 5, 6 and cards VC9-VC11 fold it in. Premises: desktop first, the player is Weibao, the YAIR Village already runs Proto23-inspired local life in source.

Codes: **GF** self-audit findings, **VC** slice cards, **VP** procedural picks, **LD** lore and identity decisions, **WD** decisions waiting for Weibao. Existing codes (TL, BC, SC, HR, IB, UT, PW, CL, CRL, PG, F/P Discord rows) keep their owners.

Rules applied: AD5, AD16, AD32, AD36, AD38, AD42, AD43 (FLR1-FLR6); PRF1-PRF8 (proposed); TL1-TL8, IB1-IB5; WV1-WV12 (PW3/PW4 as dated history), PW5, WER15; UR43, UR70-UR75; PR1-PR5; AR13; WPR27.

## 1. Self-audit across USER_VISION and the planning owners

Sonnet-class read of USER_VISION, PROJECT.md summary and LIFE_SIM_NORTH_STAR, plus direct reads of the identity thread, core-loop scoping, master plan rounds 3-7, the Proto23 loops proposal and its dispatch report.

### Stated identity, in Weibao's words

| Quote | Where |
| --- | --- |
| "anything is possible and it depends" | [USER_VISION:727](../../../USER_VISION.md#anything-is-possible-2026-10-09) |
| "The game is meant to be an idle rpg so it should be able to level up passibely lmao" | USER_VISION:2622, hunger and bodily needs |
| "balance of active gameplay and options versus idle rpg since the oriignal game is an idle rpg" (still open) | USER_VISION:973, section 7 |
| "I had the idea of a text based game like bitlife and stuff" | [LIFE_SIM_NORTH_STAR:20](../../../LIFE_SIM_NORTH_STAR.md) |
| "I just dont want to lose the 'vanilla' experience" | [USER_VISION:1819](../../../USER_VISION.md#proceeding-while-preserving-vanilla-2026-10-03) |
| "lets keep OOPS as the stylized name for Optimistic Progression Simulator" | USER_VISION:179 |
| "what matters is the book worlds and the menus and more?" | USER_VISION:6302-6305 (2026-10-26) |
| "So that we can have our own identity but also work towards a whole playable world with endless possibilities" | USER_VISION:6569 (2026-10-27) |

Agent synthesis already on file, still proposals: the core loop is a shape (choose a pursuit, act by hand or routine, learn and gain, open a new choice) with **discovery** as the hook ([CL1, CL2](../../../reviews/CORE_LOOP_SCOPING_CONSIDERATIONS_2026-10-16.md#short-answer)); travel is an exchange loop ([TL1](../../../MASTER_PLAYABILITY_PLAN_2026-10-25.md#the-loop)); the base cheat is the thread across worlds ([BC1](../../../MASTER_PLAYABILITY_PLAN_2026-10-25.md#the-base-cheat)). Read together: **an idle life sim where small world facts change your next decision, and what you learn in one life is worth something in another.** That sentence is GM inference, offered for LD1.

### Where the Village loop stands

- Local life ([`src/absorb_c2/local_life.js`](../../../../src/absorb_c2/local_life.js)) has watch, weekly market, courier, parcel relay, runner and meals, search exhaustion and elder guidance. The village-loop session's fresh-life MCP walk ([checkpoint survey](VILLAGE_LOOP_CHECKPOINT.md#survey-what-is-playable-now-mcp-walk-fresh-life-seed-7-live-bundle)) found all of them playable; the relay waits on the Eastern mill.
- Around it: Village career (patrol, kit custody, ranks), study, mentor, family, traveler asks (needs-driven requests, `src/village_traveler_asks.js`), workspace, household and home furnishing, paid Shack–Village freight (PROJECT.md:316).
- The gap is **consumers, not activities.** Watch pay, bread and relay receipts are dead ends: thirty shifts change nothing about how the Village treats you or what you can choose (FLR4, MC6). The village-loop session reached the same verdict independently ("React is the weakest step") and opened slice VL1 on it.

### Contradictions and stale claims (GF)

| Code | Finding | Evidence | Proposed reading |
| --- | --- | --- | --- |
| GF1 | **VL4 is stale.** Round 7 says the Proto23 loops are "mostly proposals". | The [p23-life-loops report](../absorb-all-2026-10-14/reports/p23-life-loops.md) opens "implemented and verified at the controlled native scope"; the fresh-life MCP walk confirms play. | Correct VL4 in round 7: the loops are playable; their outputs lack consumers. |
| GF2 | **CL25 is partly stale.** "Nothing imports" `away_ledger.js`. | `src/absorb_p23/world_adaptation/techniques.js` imports it now. | Real away-time progress for Village routines is still unproven; VC6 checks it before building. |
| GF3 | **Home base has three answers.** PROJECT.md:1812 lists home world `base.frontier`; TL4 makes the Village the default home; USER_VISION:2674 and :3581 keep the Village a chosen start, not the first-life opening. | Cited lines. | LD2: home is the life's start place by default; the Village is the first test bed and the home for lives that start there. |
| GF4 | **First-milestone gate lines linger.** Removed 2026-10-24 (USER_VISION:6131-6136, PROJECT.md:1691-1694), still asserted at USER_VISION:1403, :1691, :1977, :5994, PROJECT.md:1190 and in the [Proto23 design lessons](../../../research/proto23/DESIGN_LESSONS_FOR_OOPS_2026-10-20.md#what-seems-most-useful). | Cited lines. | Dated history under USER_VISION:6135; no slice treats them as a gate. |
| GF5 | **No PROJECT.md summary for the 2026-10-27 Village-loop request.** The three-worlds entry now exists (PROJECT.md:3, commit `d0734c983`). | Grep of PROJECT.md. | Hunk H1 below covers the Village loop only. |
| GF6 | **Viewport drift.** The 1366×768 floor was retired 2026-10-19 (USER_VISION:222), yet PROJECT.md:991 and the [Proto23 loops doc](../../../PROTO23_VILLAGE_LIFE_LOOPS_2026-10-14.md) target it. | Cited lines. | Village UI evidence uses 1920×1080 and 1536×864 at 14 and 21 px (COMMON). |
| GF7 | **LOTM ordinary entrance.** PROJECT.md:79-81 calls it reconciled and published; USER_VISION:6527 says the Village LOTM entrance fields and the BGP24 crossing remain proposed. | Cited lines. | Both true at different layers: the entrance plays, its later fields are open. VC7 depends only on the playing part. |
| GF9 | **Procedural status map is stale on storylets.** D4 says runtime "None"; `src/storylet_deck.js` (four Village decks, intervals, quiet periods, fact-weighted draws) and `src/storylet_content.js` (about 14 cards, opt-in through the elder) exist. | Source read 2026-10-27. | VP1 and VC12 build on the deck; the map's owner updates D4. |
| GF8 | **Frontier versus the Village.** The 2026-10-26 line keeps Frontier and Mistglass without new depth; the Village loop is exempt (USER_VISION:6571, VL1 in round 7). | Cited lines. | Village cards add no Frontier places or items; the sibling worlds (VC9, VC10) are their own worlds, not Frontier depth. |

## 2. Advisor reconciliation

The advisor was consulted once before planning. Its points, all adopted: fix the VL4 diagnosis first (GF1); the weak steps are apply, react and return; carry should be local first so the Village loop does not wait on Tingen; the original village is a docs card that differs by verb, not a reskin; procedural picks need named Village consumers; every card keeps native YAIR Village play intact (USER_VISION:1819); waiting decisions stay within build order, first-slice defaults, save compatibility and effort (AGENTS design framing). The one possible conflict, whether to walk the game myself or make the walk card 1, resolved itself: the village-loop session had already walked it, so no second call was needed.

## 3. The Village loop, step by step (TL1)

| Step | What exists (source, walked where noted) | Gap | Card |
| --- | --- | --- | --- |
| Live | Shack home, household, furnishing, meals, weather and calendar, runner, courier (walked) | Fine for now | none |
| Earn | Watch, weekly market, relay, career patrol, traveler asks, native jobs and trade (walked: watch, market, relay) | Earnings have no Village-specific use | VC2 |
| Carry | Inventory; paid Shack–Village freight; storage | No stockpile that changes what you can prepare (CRL3, CRL11) | VC5 |
| Apply | Coins spend at the native trader; furnishing bonuses | Nothing earned opens a new Village choice | VC2 |
| React | Native Village reputation exists, unused by local life | Service changes nothing (village-loop survey) | VC1, VC3, VC4 |
| Return | Weekly market and watch windows pull you back on a schedule; quests name the next relay stop | No "what changed while you were away" note; no away routine | VC3, VC6 |

## 4. Proto23 base gameplay: what transfers and what is missing

Sources: the [full source audit](../../../research/proto23/PROTO23_VS_YAIRPG_2026-10-10.md), [design lessons](../../../research/proto23/DESIGN_LESSONS_FOR_OOPS_2026-10-20.md), [feature side-by-side](../../../research/proto23/FEATURE_AUDIT_SIDE_BY_SIDE_2026-10-20.md) and the [loops proposal](../../../PROTO23_VILLAGE_LIFE_LOOPS_2026-10-14.md). This table was written under the no-copy rule (PW3), now dated history: the faithful Proto23 world (VC9) ports rules and data from the pinned source, while the Village rows below stay the variant's own versions (WV2).

**Its core loop, as our reading of those reports:** a small hub you return to between short outings; skills train by doing and pay out in discrete milestone perks; food and condition shape how well you work; gear wears and gets repaired; small facts about a tree, a tool or the weather change what you do next; and lifetime counters turn ordinary habits into titles. The pull is "this ordinary activity is a particular situation" (design lessons, What seems most useful), with home as the buffer between outings (CRL11).

| Proto23 mechanic (original-mechanics reading) | In the Village now | Missing or thin |
| --- | --- | --- |
| Hub with services and timed windows | Watch, weekly market, midday bread, courier, relay (walked) | Windows feed nothing (VC1, VC2) |
| Look around a room with finite finds | Search exhaustion (walked) | none |
| Titles from lifetime counters | Homebody and Local Customer titles; titles owner | Titles from Village service (VP3 dial) |
| Home as buffer, furnishing bonuses | Shack, household, furnishing (PROJECT.md decision 2026-10-11) | A stockpile that changes the next outing (VC5) |
| Gear wear and repair | Durable native repair P4 (PROJECT.md 2026-10-21) | none for this plan |
| Setbacks that train resistance | Bleeding trains Iron skin | none |
| Random hub encounters | Courier (40% per arrival), runner | A deck with memory of who you know (VP1) |
| Food shapes efficiency | Bodily needs owner (USER_VISION:2622 entry) | Not checked here; leave to its owner |
| A training-ladder spine (the Dojo courses) | Career ranks are the nearest analogue | The Proto23 world (VC9) ports this spine |
| Seasonal weather states | Weather/environment lanes (PROJECT.md 2026-10-26) | Village reading of weather (PG4, banked) |

## 5. Three sibling worlds: Proto23, YAIR and our variant

Superseded first version (2026-10-27, before round 8), kept as history: "The original village (PW4) is a separate world built on the same engine verbs with its own nouns, credited to Proto23 as inspiration." With Proto23 code now allowed, the plan follows WV1-WV2: two faithful worlds beside the current Village, which already is the variant and stays merged (PW5).

| World | What it is | How it differs | First base-loop slice |
| --- | --- | --- | --- |
| **Variant (the current Village)** | YAIR plus about seventeen absorbed Proto23 lanes plus our systems (WV2) | Carries the game's own name and voice (WV11); new ideas land here first (WV6) | VC1-VC3: service gets noticed, opens a choice, and the place says what changed |
| **Proto23 world** | Rule-faithful to the pinned Proto23 `index.html` (revision `e93a8cd6…`, SHA256 `a43e55e2…`), ported by loop step (WV3, WV9) | Instant hub screens, no travel minutes, the Dojo ladder as the progression spine, one monster at a time, 60 skills with milestone perks, food energy that scales efficiency, gear durability ([source audit](../../../research/proto23/PROTO23_VS_YAIRPG_2026-10-10.md#2-the-short-answer-how-they-differ) F1-F9) | VC9: hub plus Dojo first tier, skill-by-doing with reveal and milestone, with a matched probe |
| **YAIR world** | Upstream-faithful (MIT, Miktaew), preferably as a ruleset that hides the variant's additions (WV10) | Location graph with travel minutes, the elder-rats-mill-bridge quest chain, smooth skill bonuses, open selling with saturation | VC10: the vanilla opening from the elder to the mill with variant features off |

Notes:

- The existing `src/proto23_world_*.js` branch (save key `proto23Village`) is an original, no-copy Proto23-inspired branch. Default: it stays where it is (saves hold it); the faithful pack lives beside it in its own paths and does not overwrite it. Whether to fold it into the variant later is a slow decision.
- The YAIR Village loop proposals VC1-VC6 apply to the variant. By default the faithful worlds run without variant features, so their loops stay baselines; dial: a variant feature as an opt-in setting with a stated reason (WV6).
- **Three-world design card (former VC8, docs only, Sonnet low).** One page per sibling world: its verb (LD4), nouns, the shared verbs it uses, deviation list owner, credit and licence status, save fingerprint (WV8). Done when committed and each world names its first slice and baseline evidence.
- Per-world verbs (LD4) are now three: variant *keep a place running and be known for it*; Proto23 *train up the ladder between short outings*; YAIR *clear the road outward one quest at a time*.

## 6. The cross-world loop

The Village loop is the inner ring; travel is the outer ring around the same six steps (TL1).

- **Home base.** The Village is where gains pile up and show (TL4, LD2). Whatever a life brings home should land in a Village consumer built by VC1-VC5: standing, an ask, a stockpile, a workshop.
- **What crosses.** By default memories and the base cheat (TL2, AD11). So the Village's first import is knowledge: a method learned in Tingen used in Village making (TL8). Its first export is the same: a Village method (a search habit, a preparation, a recipe) that is useful or odd in another world (TL3).
- **The cheat as thread.** A world-first milestone on arrival in Tingen (BC9) and Village service milestones both feed the continuing self's record (BC1, BC2), so travel and home both grow the cheat.
- **Reasons to return.** Village windows (watch, market), open asks, a stockpile and the relay pull you home; LOTM digestion and HP terms pull you out (TL5). Frozen time stays the default; the return note (UT3) says so.
- **Scale and headroom.** Other worlds grow as thin region packs chosen by what the next rung or ask needs (SC1, SC4, HR4). The Village asks for nothing from them until VC7; later Village asks can name a reagent or tool another world supplies, which gives regions a reason to be visited (SC2).

- **Three sibling worlds as the cheapest test (WV7).** Before Tingen, carry one piece of knowledge across the variant, Proto23 and YAIR worlds. Same engine, different rules, so the same technique meets different mechanisms (AD38) without new region content. That is VC11. *Round 9 red team (section 14): the "cheapest" claim is killed; the cheap test is Tingen carry rows on the crossing that exists (VC7a), so VC7a comes first and VC11 waits for VC9 and VC10.*

Dependencies: VC11 needs VC9 and VC10 skeletons and per-world carry-ledger rows. VC7 needs RET7 (Tingen rows in the carry ledger) and the playing LOTM entrance (GF7). Nothing in VC1-VC6 waits on another world.

## 7. Slice cards, in dependency order

*Round 9 update: the red team (section 14) changed several cards; [section 18](#18-survivors-as-slice-cards-in-order) is the current order. This section stays as the first version.*

Each card follows IB3 and AD43. Every done check includes: from a fresh Village life (no fixture), rebuilt bundle named by hash, MCP walk first then rebuilt desktop browser at 1920×1080 and 1536×864 for UI claims, Save/reload/Export/Import when state changes, native YAIR Village play unchanged, and the "agent-verified, not human-reviewed" label. Blocked-reason text consumes backlog-ui's UIV1 primitive and does not edit it.

**Village-playable first: VC1, VC2, VC3. New sibling worlds: VC9, VC10 (independent of VC1-VC6; a separate lane can run them). Cross-world dependent: VC11 (on VC9, VC10), VC7 (on RET7 and VC2).** Ten cards, two over the brief's 5-8 because round 8 added the sibling worlds; the three-world design card is a section 5 note, not a slice. Ported Proto23 material: own paths (proposed `src/world_packs/proto23/`), a NOTICE naming source, revision and SHA256, credits page (PW6), its own branch until Weibao's yes (WV3, WV4, WD5).

| Card | Step | Outcome (player sentence) | Consumer | Cost | Mechanism (default, dial, reason) | Done check beyond the floor | Model, effort |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **VC1** The Village notices steady service | React | "Village watch complete: 12 coins, 3 Perception XP and +2 Village reputation." Band crossings say so once. | Native Village reputation: trade price part, rank ladder, reputation conditions | Unchanged watch and relay costs | Neighbours see who serves. Dial: per-village standing numbers. Interrupted shifts earn nothing. | Owned and specified by the village-loop session as [VL1](VILLAGE_LOOP_CHECKPOINT.md#slice-vl1-the-village-notices-steady-service); this plan adopts it unchanged | Sonnet medium (in progress) |
| **VC2** Standing opens a Village choice | Apply, earn | At Known Face the elder's "what to do next" names an open traveler ask that fits what you carry; at Neighbour asks seek you out and the career offers its next duty. | Existing `village_traveler_asks` and Village career ranks | Reputation earned in VC1; the ask's items | People trust and ask those they know. Dial: band thresholds per village. Reason: turns watch pay and bread into a path. | Reaching Known Face from a fresh life changes the elder text and lists an ask; completing it pays and moves standing; below the band the row says why it is closed | Sonnet medium |
| **VC3** The place remembers you, and says what changed | React, return | The Village description gains one line from your standing and finished relays; returning after an outing shows one note ("The market opened while you were at the mill; the courier left a pamphlet"). Watch and relay rows say what leaving costs before you accept. | Place description, return note (UT3), action descriptions (Discord F18/P5, F20/P7) | None new | Places keep visible consequences (SR rules). Dial: how much a village gossips. Reason: return needs a reason you can read. | Fresh life: description changes after the first band; leaving and coming back shows the note; interrupt text matches the actual forfeit; PR1 discovery wording | Sonnet medium |
| VC4 A Village deck that knows who you are | React, return | Occasional Village events cast people you served or helped ("The miller you carried for asks after the parcel"). | E2 storylet deck on F3 simulation streams; standing (VC1) | Event-specific | Salience casting (A1); seeded and saved so reload never rerolls (O1). Dial: frequency per village. | Ten cards drawable with saved cooldowns; one card casts a person from VC1/VC2 history; restore emits nothing | Sonnet medium |
| VC5 A home stock that changes the next outing | Carry, live | Bread, fuel and parcel goods kept at the Shack shorten the next outing's preparation; the row says what is stocked. | Household/larder clock, paid freight, workspace | Freight coins, spoilage | Home is a buffer (CRL3, CRL11). Dial: spoilage and capacity per home. | Stocking then leaving and returning changes a real preparation; spoilage follows game time | Sonnet medium |
| VC6 A Village routine while you are away | Return, idle | Choose a routine (watch, market runs) and come back to its results with stop reasons. | AD16 chosen routines; `away_ledger.js`; GN8 digest | The routine's own costs; stops at important choices or empty supplies | AD16 default; inactive worlds pause. Dial: rate per routine. | First confirm what `away_ledger.js` drives today (GF2). Then a closed-tab or bulk-time return shows results and stop reasons; no double pay | Sonnet medium, larger |
| **VC9** Proto23 pack and its base loop | Live, earn (Proto23 world) | Starting the Proto23 world opens its hub; the Dojo's first tier trains a skill by doing, the skill tab appears at level 1, and the first milestone perk applies. | World pack registry (`src/world_pack_registry.js`), shared skill and combat engine, start record | Port effort; one registration line (AR13) | Rule-faithful port (WV5). Deviations listed: the overflow double count, biased integer sampling and the craft-counter disagreement are source bugs and get fixed in the shared engine (WV6). | **Matched probe:** run the [source mechanism probes](../../../research/proto23/SOURCE_MECHANISM_PROBES_2026-10-13.json) cases against the port: `skillReveal` (tab visible at level 1 after 1 XP) matches; `overflow` (onGive total 69 for award 60) `randomDistribution` (2500/5000/2500) and `craftRequirements` (a missing second tool yields no output yet increments the craft counter, the source's preview/counter disagreement) are reproduced as recorded deviations with the corrected value beside them ([mechanism report](../../../research/proto23/SOURCE_MECHANISMS_AND_ADOPTION_2026-10-13.md)). The pinned `index.html` is fetched to the ignored `docs/research/proto23/private/` path and its SHA256 checked first. Plus a fresh-start MCP walk through the first Dojo tier, Save/reload/Export/Import, Village saves unchanged, NOTICE present. Commits land on branch `proto23-port/2026-10-27` in its own worktree (AD41 isolation reason: keep unpushed Proto23-derived files off shared `master`), merged only with Weibao's yes (WD5) | Sonnet medium |
| VC10 YAIR ruleset check | Live, earn (YAIR world) | Starting the YAIR world gives the upstream opening (elder, rats, mill) with the variant's panels absent. | Feature flags or a thin upstream data pack (WV10) | Small if flags are clean | Configuration before copy. | First an entanglement report: which variant features can be hidden by flag. Then a fresh-start walk to the mill matching upstream at a pinned `upstream` commit, with differences listed | Sonnet medium |
| VC11 Three-world carry test | Carry, apply (cross-world) | Learn one technique in one sibling world, cross, and see it work, fail or work differently in the next by that world's mechanisms; the crossing confirm lists what carries. | Carry ledger rows for the three packs; pack fingerprint in the life record (WV8); UT1, UT2, UT4 | The crossing method's cost | Memories and knowledge carry (TL2); outcome follows each world's rules (AD38). | From a fresh life: one round trip through all three worlds, the technique's result differs by world for a stated reason, Save/reload/Export/Import keep each life's ruleset | Sonnet medium |
| VC7 Learn there, use here | Carry, apply (cross-world) | Learn one method in Tingen, return, use it in Village making with a visible result, and the crossing confirm lists what you carry. | Village making; carry ledger with RET7 Tingen rows; BC9 world-first milestone; UT1, UT2, UT4 | Time, the method's cost, notice (TL6) | Memories and the cheat cross by default (TL2). Whether it works follows mechanisms (AD38). | TL8's done check; depends on VC2 (a Village use) and the playing LOTM entrance | Sonnet or Sol medium |

## 8. Procedural ideas with a Village consumer now (at most three)

| Code | Idea | Village consumer | Card |
| --- | --- | --- | --- |
| VP1 | Storylet deck ([E2](../../../emergent/E2_STORYLETS.md); about 14 cards already in `storylet_content.js` on `storylet_deck.js`, GF9) with salience casting ([A1](../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md)) deferred | The existing deck | VC12 (round 9) |
| VP2 | Needs-driven commissions ([PG1](../../../PROCEDURAL_AND_GENERAL_OPPORTUNITIES_2026-10-16.md#pg-other-procedural-systems)) | `village_traveler_asks` already holds needs with clues; standing decides who asks you | VC2 |
| VP3 | Market days and festivals (PG10) over the weekly market, with titles from deeds (PG14) as its dial | Weekly market window; titles owner | After VC3, small |

Banked, waiting for a consumer: PG2 fauna variants, PG5 rumors (after VC4 proves threads), PG6 disease, PG9 in-world documents (the courier pamphlet is a natural first), PG11 history and ruins, PG12 omens, PG15 expedition graphs, B1-B9 except B8 careers (which VC2 touches by hand), generated households (D7), randomized secrets (D6), and the procedural making audit's PC rows ([audit](../../../audits/PROCEDURAL_MAKING_AUDIT_2026-10-26.md)), which have their own owner.

## 9. Actualization path for the idea bank

The bank is big enough ([ideas inventory](../../../audits/IDEAS_LEFT_INVENTORY_2026-10-25.md), [Q18 triage](../../../audits/IDEAS_TRIAGE_2026-10-26.md) P01-P20, procedural docs, palettes). The route below makes ideas reach play by pull (IB1).

1. **Tag** each idea by loop step (IB2) when its row is next touched. No step, no move.
2. **Pull** only for the weakest step of the live loop. Today that is apply and react in the Village.
3. **Card** it (IB3): outcome, consumer, cost, mechanism, done check. A longer palette does not count.
4. **Slice** it to the AD43 floor in its owner lane, one at a time.
5. **Play** it (DC1): Weibao's notes jump the queue; the next pull reads them (IB4).
6. **Merge before adding** (IB5): a new idea joins its existing row.

Banked ideas pulled by step, now:

| Step | Pulled into a card | Next in line | Stays banked |
| --- | --- | --- | --- |
| Live | none | Bodily needs check (its owner) | NPC-heavy household simulation (AD33 order) |
| Earn | PG1 (VC2) | Q18 P16 restock policy pattern for Village stock | Generated careers (B8) |
| Carry | Freight and larder (VC5) | RET7 (VC7) | Per-life save files (LT3) |
| Apply | Traveler asks and career (VC2) | Village making use of a carried method (VC7) | Fusion and branching cheat paths (BC4, BC5) |
| React | VC1, VP1 (VC4), F20/P7 (VC3) | PG5 rumors | Rivals, cosmic events |
| Return | UT3, F18/P5 (VC3), AD16 (VC6) | VP3 market days | TL7 paused lives working (waits on LT3) |

Q18 P02-P10 are UI rows owned by backlog-ui; P11-P20 belong to book-world lanes. None is pulled into the Village loop except P10's return-session diagnostic, which VC3 can inform.

**This week (superseded by section 18):** VC1 (in progress), then VC2 and VC3 in the Village; VC9 in a separate lane if one is free; the three-world card on a DC4 day. VC10 then VC11 next. **Banked:** everything in the right-hand column above, and VC6 until GF2 is checked.

## 10. Lessons from saved Discord research (no new collection)

From the [YAIR upstream research](../../../research/yair-upstream/DISCORD_RESEARCH_2026-10-20.md#additional-context-backed-findings) and the [Corc/Proto23 lessons](../../../research/proto23/DESIGN_LESSONS_FOR_OOPS_2026-10-20.md):

- **Say what an interruption costs before the player starts** (F18, P5). Leaving the watch forfeits its pay; the row should say so. Used in VC3.
- **Let places show what you changed** (F20, P7; CRL13 "a changed reason to revisit a place"). Used in VC3.
- **Show evidence that a pursuit is still worth repeating, without showing the reward** (F31). VC2's band text does this for service.
- **Explain changed rates by their cause** (F23). If standing changes prices, the trade breakdown names it, as VC1 does.
- **Home is a buffer between outings, not a chore** (CRL11). VC5 avoids an unattended maintenance debt.
- **Discovery needs a useful next move** (CRL6). Each card's outcome names one.

## 11. Lore and identity decisions

Settle now, as defaults the cards need:

| Code | Decision | Default | Dial | Reason |
| --- | --- | --- | --- | --- |
| LD1 | The game's one-line identity, as a test | "An idle life sim where small world facts change your next decision, and what you learn in one life is worth something in another." | Rewrite after play | Gives every card a check: does it change a decision, does it carry? |
| LD2 | Home base | The life's start place; the Village for Village starts and as the first test bed | A hub world (WER17) or a chosen home | Resolves GF3 without moving `base.frontier` |
| LD3 | Who owns Village nouns | The fork does: Village people and places can grow freely in our own continuity (PROJECT.md:1696) | A world may later import a shared NPC with a reason | VC2-VC4 need new asks, lines and people |
| LD4 | Each world's verb (LT1 draft) | Variant: *keep a place running and be known for it*. Proto23 world: *train up the ladder between short outings*. YAIR world: *clear the road outward one quest at a time*. (First version, before round 8: original village *prepare, go out, come back changed*.) | Revisit after a week of short plays (LT1) | Gives the two villages different verbs (section 5) |

Decide slowly, on play evidence:

| Code | Decision | Meanwhile | Decide when |
| --- | --- | --- | --- |
| LD5 | Who the player is (USER_VISION:740-742) | Discovery inside a chosen life (CL90); no frame story | After several lives in two worlds feel different |
| LD6 | Parallel-universe framing of the upstream world (USER_VISION:1809) | Explored, not selected; the fork's continuity is its own | When the Village needs a history beyond its people |
| LD7 | How the Village relates to LOTM and other worlds (USER_VISION:6506-6511) | WER entry methods as dials; any sealed Village or LOTM secret stays referred to by ID and route only; this plan names none | When VC7 ships and the crossing has a felt cost |
| LD8 | Active versus idle mix (USER_VISION:973, LT5) | AD16-AD18 stop rules | From play notes on boredom versus clicking |

## 12. Proposed hunks for shared owners

Not applied. The owner of each file applies them from disk, hunk only, with the zero-loss check.

**H1, PROJECT.md** (new top entry):

```markdown
## Village loop first, 2026-10-27

Weibao: establish a gameplay loop first for the Village (YAIR Village, then a
Proto23-style village), widened the same day to cover cross-world play,
Proto23's base gameplay and the idea bank. The Village is the home base (TL4)
and test bed; new Frontier content stays out of scope. Proposals and slice
cards: [GM plan](docs/gm/dispatch/village-loop-2026-10-27/GM_PLAN.md);
first runtime slice: [VL1 checkpoint](docs/gm/dispatch/village-loop-2026-10-27/VILLAGE_LOOP_CHECKPOINT.md).
```

**H2, USER_VISION.md** (append under "Village loop first, coordinators and GM plan, 2026-10-27"):

```markdown
Clarification relayed from the coordinating session, 2026-10-27: the plan
covers cross-world play, Proto23's base gameplay and how to actualize the
whole idea bank, not only the Village. Recorded in the
[GM plan](gm/dispatch/village-loop-2026-10-27/GM_PLAN.md) sections 4, 6 and 9;
the three-world direction is in sections 5 and 6 and cards VC9-VC11.
```

**H3, master plan round 7, VL4** (owner: the session that wrote round 7): replace "Proto23 loops are mostly proposals" with "Proto23 loops are playable from a fresh life (village-loop MCP walk, 2026-10-27); their outputs lack consumers."

RULES_INDEX.md: no hunk. VC, VP, LD and GF codes are plan-local and register nothing.

## 13. Decisions waiting for Weibao

Within AGENTS limits: build order, first-slice defaults, save compatibility, effort.

| Code | Decision | Default if he says nothing |
| --- | --- | --- |
| WD1 | Build order between the Village cards and the sibling worlds | Section 18 order: Village survivors first, VC9 step 0 then its pack in its own lane, VC10 as a count. (Critic dissent recorded: defer VC9 until the Village loop works.) |
| WD5 | Merging the `proto23-port` branch into `master` (which makes it part of the next approved push), and whether to ask 23html for permission or a licence (WV4) | Keep the port on its branch; merge and push only on his yes; the ask is his outward step |
| WD2 | First-slice defaults for VC2: where the first `rank.Village` gate sits | Within one or two watch shifts of a fresh life (a Village grant dial or a per-village ladder), since at +2 per shift the default ladder's 10 is five shifts out |
| WD3 | Save shape for VC5 and VC6 (new home stock and away records) | Extend existing owners' schemas with migrations; no new top-level key |
| WD4 | LD1 and LD4 as working sentences | Use them as tests until play notes say otherwise |

## Addendum, round 9 (2026-10-27): red team, per-world pages, UI flow

Requested by Weibao through the coordinating session: audit these ideas offensively and cover per-world loops, identities, implementation and UI flow; then overarching loop considerations, comparable games and long-term world rules ([round 10](../../../MASTER_PLAYABILITY_PLAN_2026-10-25.md#round-10-overarching-loop-what-big-scope-games-do-and-long-term-world-rules-2026-10-27), OL1-OL5, CP1-CP9, WR1-WR10). Round 9 codes ([master plan round 9](../../../MASTER_PLAYABILITY_PLAN_2026-10-25.md#round-9-red-team-the-gm-plan-per-world-loops-and-identities-ui-flow-2026-10-27), RT1-RT3, PW1-PW2, UF1-UF7). Code note: round 9's PW1-PW2 collide with the Proto23 PW1-PW6 rows in the intro doc; below they are written **R9-PW1** and **R9-PW2**. Sections 1-13 above stay as written; where the red team changes them, section 18 is the current card order.

## 14. Red team (RT1-RT3)

**Method.** I made my own kill attempts first. Then one read-only Sonnet critic got the source files and a neutral list of the ideas, without this plan or my conclusions (RT2), and tried to break each one. The disagreements went to the advisor once. One framing ruling settled several of them: the red team kills mechanisms and agent claims, not Weibao's direction. The three worlds are his words (USER_VISION:6575-6577), so the attention they split off from LT2's "LOTM and HP only for depth" is recorded as a **sequencing risk**, not a kill (AGENTS: many worlds are his direction). CP1-CP9 in round 10 come from general knowledge and are treated here as unverified leads. Nothing below depends on one of them being true.

Columns: how it fails in play and what it costs the player's attention; scope, saves and tests; conflicts with code or rules; the cheapest disproof; the ruling.

| Idea | Fails how / attention | Scope, saves, tests | Conflicts or already in code | Cheapest disproof | Ruling |
| --- | --- | --- | --- | --- | --- |
| VC1 reputation for service | At most 6% off prices (`economy_standing.js:28`, 0.4 per point); bands sit at 10/50/200 (`faction_rank.js:8-10`), so Known Face takes five watches. The reward is invisible early, the "renamed meter" FLR4 warns about. | Built but uncommitted as VL1; no new save field | Village reputation may also move `market_circle` with the 0.6 rival backlash (`economy_standing.js:12-26`). That needs a check for double counting. | Play one watch and read the trader breakdown; count the steps to rank 10 | **Survives, changed.** Finish VL1. Add the backlash check to its failure scenario. VC2 supplies the visible early reward. |
| VC2 bands open asks and career duty | `village_traveler_asks.js` has no reputation input or "open ask"; a new ask type would be new code. A career duty change would compete with the existing promotion flow (`village_career_ui.js:18-58`). | A new ask goal shape needs a save-shape decision | `rank.Village` facts already exist (`faction_rank.js:35`) | Hand-write one card gated on `rank.Village` and see whether it fires | **Survives, narrowed.** Gate existing rows and storylet cards on `rank.Village`, with the first gate one or two shifts out (WD2). Killed: the new ask type and the career change. |
| VC3 place line, return note, leave cost | A list of lines would be noise. The return note duplicates `change_badges.js` and `event_feed.js`. | Text only | The row already says interruptions forfeit pay (`local_life.js:157`) | Leave mid-relay and read what the player sees | **Survives, split.** Leave-cost text and one conditional place sentence. The return note reuses change badges and the event feed. |
| VC4 storylet deck with casting | Casting "people you served" needs a served-people record, which does not exist. | Adds a save field | The deck is already built (GF9) | Run the deck 30 game days at a fixed seed and read the draws | **Survives as VC12** (data rows and a temperament dial on the existing deck). Casting is banked. |
| VC5 home stock with spoilage | A second inventory and a decay clock with no recorded pain point. Spoilage is the maintenance debt CRL11 warns against. | Large; new persistence | Chest/Shack carry rows and larder owners exist (audit I13) | Ask what in the current loop is blocked by missing stock: nothing on record | **Killed for now.** Revisit on a play note. |
| VC6 away routine | Watch pays only while you stay; running it offline changes what "played" means | Barriers and stop reasons need a save shape | `away_ledger.js` drives only Patient Furnace today. The critic proposed binding away time to that cheat. Rejected: AD16 is accepted for every player. | Read AD16-AD17 and `computeAway` | **Banked.** When built, reuse `computeAway`, and pick a first routine that does not depend on presence. |
| VC7 learn in Tingen, use in the Village | The carry ledger marks "Method" unavailable across a crossing while memory carries (`carry_ledger.js:31`). "Use in Village making" contradicts that unless the Tingen rows say otherwise. | Rows are data through `registerCarryRules` | SMU5: confirm text must follow the mechanics | Write the rows, read the confirm | **Survives as VC7a:** Tingen rows plus confirm text first, settling which row a learned recipe falls under. Use in making waits for one chosen method. |
| VC9 faithful Proto23 pack | A very large global-state source; "faithful" drifts without a probe. A third start surface. | Pack fingerprint in saves (WV8) | The critic proposed a licence gate. Rejected: WV4 says "Not a blocker", and an agent-authored gate fails PRF8. | Run the `skillReveal` probe against our current engine before porting anything | **Survives with a step 0.** Probe first, then the pack in its own lane and branch. The critic's dissent is recorded in WD1. |
| VC10 YAIR via feature flags | No flag system exists; about seventeen lanes are entangled in the Village (WV2). Section 16 shows the YAIR column differs from the Village mostly by subtraction. | Unknown until counted | None | A one-hour count of modules that reach variant features without a gate | **Mechanism killed** until the count supports it. The world survives as a baseline. The card becomes the count. |
| VC11 three-world carry as the cheapest test | It depends on two unbuilt packs. A two-world test runs today. | Large | WV7's "cheapest" claim | Compare against the Tingen rows (VC7a) | **Claim killed.** VC11 waits for VC9 and VC10. |
| UF2 header orientation | The world label is already in the date line (`village_workspace.js:23`; `main.js` local date header) | Small | None | Screenshot at 1536×864 and 21 px | **Survives, reduced:** add the life name when more than one life exists, plus SMU1, after the screenshot. |
| UF1 arrival line | Useful exactly when crossing | Small | None | Cross to Tingen and read what arrives | **Survives.** First UI slice (UF7). |
| UF3 world panel | A sixth place for lives and worlds (SMU3); no data until Tingen carry rows exist | Medium | Against UF6's "fewer surfaces" | Count today's facts that would fill it | **Survives as a deferred tab** in Continuing connection, after VC7a. |
| UF4 cheat panel | A new panel would duplicate "Continuing insight" (`cheat_ui.js`) | Small as an extension | None | Open the existing view | **"New panel" killed.** Extend the existing view after BC2/BC9 give it stages. |
| LD1 identity sentence | Untestable as written; the critic notes the Village did not change any decision before VL1 | None | None | Name one Village fact that changes a specific choice | **Survives as direction.** Its concrete check is VC2. |
| LD2 home base | Could justify ever more Village content | None | None | Ask what a Tingen life uses as home | **Survives.** A Tingen life's home is its lodgings (15.4). |
| LD3 fork owns Village nouns | Free invention could drift from the voice | None | None | Read three new Village lines against 15.1's voice sample | **Survives**, bound to the voice sample. |
| LD4 one verb per world | A verb that fits every world says nothing | None | None | Section 16: no row may read the same across worlds | **Survives.** Section 16 has no identical row. YAIR is the weakest, as a baseline by subtraction. |
| R9-PW2 contrast table | Rows invented on paper rather than from source | None | Faithful-world columns describe packs that do not exist yet | VC9's probe and VC10's count | **Survives, labelled:** the Proto23 and YAIR columns are source-audit readings until their packs exist. |
| CP1-CP9 (round 10) | General knowledge, not source-checked | None | None | CP-LATER source pass | **Leads only.** CP2 and CP3 earn a card because the deck already exists here, not because of the reference games. |

**Killed, with reasons:** VC5 home stock (no pain point, maintenance debt). VC2's new ask type and career change (new code and a competing flow where an existing fact suffices). Feature flags as the YAIR mechanism (no flag system, entanglement uncounted). The "cheapest travel test" claim for three worlds (two unbuilt packs; a two-world test exists). A separate return-note line (change badges and the event feed exist). "Dedicated" new world and cheat panels (one exists, the other has no data). Casting from a served-people record, for now (save shape for no shown need).

## 14a. Long-term world rules: register or overhead (round 10 WR)

LT6 asks for no new rulebook without a repeated mistake. For each WR rule: the kill attempt, then the verdict.

| Rule | Kill attempt | Verdict |
| --- | --- | --- |
| WR1 world loop card | Another per-world doc that grows into a palette | **Overhead as a rule.** Use it as the shape of the completion standard's S00 entry (section 15 is the seed). |
| WR2 three good evenings | Only Weibao can judge "good". As a gate it conflicts with AD42 (human review optional). | **Kill as a rule.** Keep it as the master plan horizon. |
| WR3 failure is content | A chronicle entry for every risk is a prose-volume tax | **Overhead.** It is already PRF4's "aftermath" prompt. |
| WR4 content as cards; generators need a consumer | The consumer half restates IB3 and FND1. The one-shape half prevents a real repeat: separate event shapes per lane. | **Register the one-shape half** as a line under WA21 (storylet-shaped pools in pack data). Drop the consumer half as a duplicate. |
| WR5 shared thread declared once | Already how `registerCarryRules` works | **Overhead.** It is a code fact. |
| WR6 typed headroom | HR6 already says it; but "not offered" stubs keep recurring (Sequence 7) | **Register** as one completion-standard row. It catches a repeated defect. |
| WR7 kill pass per world plan | Process weight per plan | **Register** as one WPR line. Nine rounds of additive proposals without a discard step is the repeated mistake, and this pass killed seven ideas. |
| WR8 second world proves the format | Already WA20 | **Overhead.** Schedule it instead: VC9 is the second-world test. |
| WR9 scope line | "A new world needs the previous one's three evenings" contradicts Weibao's three-world and many-world direction | **Kill as a rule.** Sequencing advice only. |
| WR10 retire dead ideas | Bookkeeping per idea | **Overhead as a rule.** Fold it into IB5 as a "banked-cold" tag when rows are touched. |

These verdicts are proposals for RULES_INDEX's owner; this session registers nothing.


## 15. World loop cards (R9-PW1 in the WR1 shape)

Each card gives the verb (LT1, a draft to test, not law), the evening shape (OL2: arrive, pick a project, tend it while idle, meet an event, see a consequence, choose next), rhythm (CP4), event-director temperament (CP2), scale ladder with phase shifts (CP5, HR), a voice sample, borrow and do-not-borrow, and the first slice. Contrast rows are in section 16. Voice samples are original lines written for this plan. "Exists" means source or a recorded receipt. Human play is unrecorded for all five worlds (round 3, F12).

### 15.1 Village (our variant)

- **Verb:** keep a place running and be known for it.
- **Evening:** arrive to the change badges → accept the watch or a relay stop → idle through the shift → a deck card or the runner interrupts → standing moves and a row opens (VL1, VC2) → choose market, mill or rest.
- **Systems now:** Shack, household, meals, weather; watch, market, relay, patrol career, traveler asks; freight; trader and furnishing; reputation (VL1).
- **Rhythm:** daily watch window (07:00 to 10:00 to accept, until 20:00), weekly market.
- **Director:** cozy, low pressure. Small chances, rare threats. The existing deck's intervals and quiet periods are the default temperament.
- **Scale ladder:**
  - Household, then known face, then trusted neighbour, then someone the Village asks to run things.
  - Phase shifts: from doing jobs, to being asked, to assigning others. The last two are typed gaps for now (WR6).
- **Voice:** "The miller nods at you before you've said a word. He's started counting on you."
- **Borrow:** absorbed Proto23 finds, titles and home buffer; YAIR's travel graph and saturation trade.
- **Do not borrow:** book-world institutions or ladders; Frontier content (GF8).
- **First slice:** VL1, then VC3, VC2, VC12.

### 15.2 Proto23 world (faithful pack)

- **Verb:** train up the ladder between short outings.
- **Evening:** arrive at the hub → pick a Dojo tier or a hunt → train → a milestone perk lands or gear wears → eat and repair → the next tier.
- **Systems now:** none as a faithful pack. The Village's absorbed lanes are the variant's versions.
- **Rhythm:** day cycle with seasonal weather; a weekly free meal.
- **Director:** flat chance. Hub encounters at a fixed rate (source audit F7), not state-driven.
- **Scale ladder:**
  - Dojo tiers, then hub mastery, then outer areas.
  - Phase shifts: from training, to hunting, to a home that supplies you.
- **Voice:** terse, menu-quick, deadpan: "You pat the cat. The cat permits it."
- **Borrow:** the shared save envelope, migrations and autosave; bug fixes listed as deviations.
- **Do not borrow:** the variant's reputation, local-life windows, cheat or crossings, by default (WV6).
- **First slice:** VC9 step 0, the `skillReveal` probe against our engine.

### 15.3 YAIR world (faithful baseline)

- **Verb:** clear the road outward one quest at a time.
- **Evening:** arrive in the Village → set a job or a zone running → idle → the quest step completes → a new location opens → the next job.
- **Systems now:** vanilla YAIR in today's build.
- **Rhythm:** daily price recovery; the quest chain.
- **Director:** none, as in upstream. Zones respawn.
- **Scale ladder:**
  - Village, then the mill and bridge, then outer locations.
  - Phase shifts: from manual jobs to automatic zones.
- **Voice:** upstream's own. Credit: Miktaew, MIT.
- **Borrow:** shared engine fixes only.
- **Do not borrow:** anything the variant adds.
- **First slice:** VC10, the entanglement count. Its distinctness is by subtraction (section 14).

### 15.4 LOTM (Tingen)

- **Verb:** act the role and digest.
- **Evening:** arrive in your lodgings → take a duty or errand → act the role while idle → notice, or danger at the edges → digestion or clearance moves → plan the next ingredient or rung.
- **Systems now:**
  - Places: three districts, Evernight, docks, university.
  - Pathways: four, at Sequences 9 and 8.
  - Work and making: merit, clearance, brokers, brewing and drinking.
  - Gap: Sequence 7 is not offered ([LOTM checkpoint](../lotm-pathway-gen-2026-10-25/CHECKPOINT.md)).
- **Rhythm:** duty shifts and the church's paperwork. Digestion advances only in Tingen (TL5).
- **Director:** slow dread. Pressure rises with acting, notice and rung (WER12).
- **Scale ladder:**
  - District, then city, then region packs (SC1).
  - Sequence 9, then 8, then a typed 7.
  - Phase shifts: from survivor, to institution member, to officer who keeps others' secrets.
- **Voice:** PR1 discovery wording, foggy and formal: "The clerk stamps your form without looking up. Someone else will read it tonight."
- **Borrow:** shared dose timing, places and presence rules.
- **Do not borrow:** Village cheer; fast travel; naming hidden structure on start screens (PR1-PR3).
- **First slice:** P11's acting and digestion consumers. This plan adds UF7 and VC7a only.

### 15.5 HP

- **Verb:** learn and use spells in a school life.
- **Evening:** arrive in the term calendar → attend the lesson that is due → practise while idle → a cast succeeds or a debt or letter arrives → grade or standing moves → pick the next lesson or trade.
- **Systems now:** school entry, calendar and lessons, wand and spell practice, adult trade, restock and debt. Four passed slices ([HP checkpoint](../hp-world-2026-10-25/CHECKPOINT.md)).
- **Rhythm:** the term timetable, weekly lessons, term breaks.
- **Director:** scheduled first. The calendar supplies most events; random ones are rare.
- **Scale ladder:**
  - Lesson, then year, then adult profession.
  - School, then village and home, then ministry and abroad (SC5).
  - Phase shift: from student to adult professional.
- **Voice:** bright school story with bureaucracy: "Your essay comes back with one word in the margin: 'Again.'"
- **Borrow:** shared brewing process and calendar.
- **Do not borrow:** LOTM's secrecy grammar as a default; Village service reputation.
- **First slice:** P12's next commission. This plan adds only orientation UI.

## 16. Cross-world contrast (R9-PW2)

If a row had no differences, the worlds would not be distinct. Mechanisms below are existing or proposed by the pages above; Proto23 and YAIR columns describe the faithful packs to come.

| Action | Village (variant) | Proto23 | YAIR | LOTM | HP |
| --- | --- | --- | --- | --- | --- |
| Cook or brew | Native cooking plus apothecary mixtures with hidden properties | Food refills energy that scales XP and hit chance | Timed stamina buffs | Brewing a purchased formula under supervision; drinking is a life event | Graded potion brewing against a formula and cauldron condition |
| Learn | Mentor, study, practice, watchcraft notes | Train at the Dojo; reveal a skill at level 1; milestone perks | Skills grow by use on a smooth curve | Digest by acting the role | Lessons on the timetable, then practice |
| Fight | Native auto-combat in groups; bleeding trains Iron skin | One foe at a time, one round per second | Groups of up to 8, stances | Rare, dangerous, noticed | Spells and wands; school rules limit it |
| Rest | Shack sleep, furnishing bonuses | Home with furniture bonuses and a cat | Sleep for faster ticks | Lodgings in a district; nightmares are a sign | Dormitory or home; term breaks |
| Trade | Saturation trade with reputation in the price | Fixed-price buyers; income scarce | Open selling with saturation | Pounds, soli and pence; black-market brokers | Tuition, debt, restock |

## 17. UI flow (UF1-UF7)

Target: 1920×1080 and 1536×864 at 14 and 21 px; mobile deferred. All rules UF5 lists apply without new exceptions.

**What exists (source read 2026-10-27):** the header already shows a local date with the world label for non-home worlds (`src/village_workspace.js:23`, `src/world_calendar.js:41`); the base cheat has its own view, "Continuing insight" (`src/cheat_ui.js`, 67 lines), and an awakened status window (`src/status_window.js`); "Continuing connection" (`src/continuation_ui.js`) is a tabbed center view for lives. SMU3 counts five places that talk about lives and worlds.

| Code | Proposal (default, dial, reason) | Reuses |
| --- | --- | --- |
| UF1 | One crossing verb and confirm (UT6, SMU4 now→after); arrival shows one line of what changed (rules, money units, date, skin); resume restores panel and selection (UT5). Dial: per-world skin tokens, layout unchanged (SMU7). | Tingen door, Continuing connection |
| UF2 | Header orientation: extend the existing date line to "world · life · local date", and fix SMU1 (Tingen date and weather) in the same place. Dial: the skin token carries the world without text. | `village_workspace.js` header date |
| UF3 | **The world view is a tab, not a sixth place.** Add a "This world" tab to the Continuing connection view that SMU3 is consolidating: ruleset, what crosses (carry ledger), local units, institutions and rules you have learned, all observer-safe (UIV6). | `continuation_ui.js` tabs |
| UF4 | **The cheat view grows in place.** Extend "Continuing insight" with stage, verbs, point sources (UT4), branches, limits found and observers who noticed (WER12). Quiet cheats stay quiet: unseen parts are absent, not greyed. | `cheat_ui.js`, `status_window.js` |
| UF6 | Banked UI ideas by panel: under-way list (UIV3) and return note (UT3) → the main log and pinned box; now→after (SMU4) and what-you-carry (UT2) → the crossing confirm; preview equals commit (UIV4) → every confirm; origin of knowledge (UT4) → item and skill inspection plus the cheat view; blocked reasons (UIV1) → the pinned box, owned by backlog-ui. | Existing surfaces only |
| UF7 | First UI slice after UIV1: UF2 header orientation plus the UF1 arrival line for the existing Tingen crossing. | As round 9 |

## 18. Survivors, as slice cards in order

**This replaces section 7's order.** The village-loop coordinator reads this table. The floor and done-check base from section 7 apply to every row. Seven cards; the first four are Village-playable.

| # | Card | Step | Outcome | Consumer and seam | Done check beyond the floor | Model, effort |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | **VL1 finish** (VC1) | React | Watch and relay completions move Village reputation, and the rows say so first | `local_life.js`, `main.js` stage line; trade breakdown, rank ladder | The checkpoint's checks. Also confirm the reputation gain does not double-count through `market_circle` and its rival backlash (`economy_standing.js:12-26`). | Sonnet medium (village-loop, in progress) |
| 2 | **VC3a** Say what leaving costs; the place remembers | React, return | Watch and relay rows say what leaving forfeits before you accept. The Village description gains one conditional sentence from standing. Returning shows changes through the existing change badges and event feed. | `local_life.js` row text, place description, `change_badges.js`, `event_feed.js` | Fresh life: leave mid-relay and read the forfeit; return and see the badge; PR1 wording | Sonnet low |
| 3 | **VC2n** Standing opens what already exists | Apply | One or two shifts in, a `rank.Village` gate opens an existing row or storylet card. The closed row says what it waits for. | `faction_rank.js` facts, storylet requirements, traveler-ask availability | From a fresh life the first gate opens within two shifts (WD2); the closed reason is visible (UIV1 primitive) | Sonnet medium |
| 4 | **VC12** An evening with a surprise | React, return | During a Village evening the deck draws one card fitted to what you are doing (on watch, after a relay, at a standing band). Its outcome changes the next choice (a coin, a contact, a closed or opened row). A temperament dial from calm to lively changes how often. | `storylet_deck.js` intervals, quiet periods and fact weights; `storylet_content.js` rows; opt-in through the elder | Fresh life, opt in, one played evening at the default dial draws at least one card that changes a next choice. The livelier dial draws more over a fixed-seed 30-day run. Reload never rerolls a drawn card. Two to four new cards are data rows only. | Sonnet medium |
| 5 | **VC7a** Tingen carry rows and honest confirm | Carry | The Tingen crossing confirm lists what carries and what stays unusable, from ledger rows. It settles whether a learned recipe is a memory or a method. | `carry_ledger.js` `registerCarryRules`; Tingen door confirm (SMU5) | Rows registered while Tingen is active; confirm text matches the rows; Save/reload/Import keep the crossing | Sonnet medium |
| 6 | **UF7** Arrival line and the life name | Return | Arriving in Tingen shows one line of what changed (rules, money units, date). The header date line adds the life name once more than one life exists, and Tingen shows its date and weather (SMU1). | Header date line (`village_workspace.js:23`), crossing arrival | A 1536×864 and 21 px screenshot before and after; 1920×1080 too; resume keeps the panel (UT5) | Sonnet medium |
| 7 | **VC9-0, then VC9** Proto23 probe, then pack | Live, earn | Step 0: our engine's skill reveal is compared with the `skillReveal` probe and the result recorded. Then the faithful pack's hub and first Dojo tier ship as in section 7. | Probe file; `world_pack_registry.js`; its own lane and branch | Step 0: one recorded comparison per probe case. Pack: as in section 7. | Sonnet low, then medium |

After these: the VC10 entanglement count (one hour, Sonnet low); then VC11 once VC9 and VC10 exist; then UF3 as a Continuing connection tab once VC7a has rows; then UF4, extending "Continuing insight" once BC2/BC9 add stages. Banked: VC5, VC6, casting from a served-people record.

**Note for village-loop.** VL1 is uncommitted in the shared checkout. The `market_circle` backlash check in card 1 is the critic's lead, not a confirmed defect.


## Verification

- Links: local Python check of every relative link and heading anchor in this file, 0 failures (2026-10-27).
- `git diff --check -- GM_PLAN.md`: clean.
- Blanket-claim sweep (never/always/only/accepted): remaining hits are sealed-secret practice, the reload-never-rerolls save invariant and plain usage.
- Round 9/10 addendum: one blind Sonnet critic (read-only, no access to this plan), one advisor call on the disagreements; source spot-checks of `storylet_deck.js`, `storylet_content.js`, `faction_rank.js`, `economy_standing.js`, `carry_ledger.js`, `cheat_ui.js`, `continuation_ui.js`. Links, anchors and diff-check rerun clean after the addendum.
- No runtime, tests or shared owners edited; no game run by this session (playability evidence is the village-loop session's MCP walk).
