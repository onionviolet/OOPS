# Village loop GM plan, 2026-10-27

Owner: `village-gm` session ([COMMON](COMMON.md), brief 1 in [BRIEFS](BRIEFS.md)). Docs only. Everything below is a proposal: Weibao's words and AD codes are the only authority (AD32, [GROUND_RULES](../../../GROUND_RULES.md)). Proposed hunks for PROJECT.md and USER_VISION.md are in [section 12](#12-proposed-hunks-for-shared-owners); this session does not edit them.

**Reading (PRF1).** Weibao wants one gameplay loop working first, in the Village, that gives the game its own identity and grows toward "a whole playable world with endless possibilities" ([USER_VISION, Village loop first](../../../USER_VISION.md#village-loop-first-coordinators-and-gm-plan-2026-10-27)). A relayed clarification from the parent session (2026-10-27) widens the plan to cover cross-world play, Proto23's base gameplay and how the whole idea bank reaches play; those are sections 4, 6 and 9. Premises: desktop first, the player is Weibao, the YAIR Village already runs Proto23-inspired local life in source.

Codes: **GF** self-audit findings, **VC** slice cards, **VP** procedural picks, **LD** lore and identity decisions, **WD** decisions waiting for Weibao. Existing codes (TL, BC, SC, HR, IB, UT, PW, CL, CRL, PG, F/P Discord rows) keep their owners.

Rules applied: AD5, AD16, AD32, AD36, AD38, AD42, AD43 (FLR1-FLR6); PRF1-PRF8 (proposed); TL1-TL8, IB1-IB5; PW3-PW5, WER15; UR43, UR70-UR75; PR1-PR5; AR13; WPR27.

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
| GF5 | **No PROJECT.md summary for the 2026-10-27 Village-loop request.** | Grep of PROJECT.md. | Hunk H1 below. |
| GF6 | **Viewport drift.** The 1366×768 floor was retired 2026-10-19 (USER_VISION:222), yet PROJECT.md:991 and the [Proto23 loops doc](../../../PROTO23_VILLAGE_LIFE_LOOPS_2026-10-14.md) target it. | Cited lines. | Village UI evidence uses 1920×1080 and 1536×864 at 14 and 21 px (COMMON). |
| GF7 | **LOTM ordinary entrance.** PROJECT.md:79-81 calls it reconciled and published; USER_VISION:6527 says the Village LOTM entrance fields and the BGP24 crossing remain proposed. | Cited lines. | Both true at different layers: the entrance plays, its later fields are open. VC7 depends only on the playing part. |
| GF8 | **Frontier versus the Village.** The 2026-10-26 line keeps Frontier and Mistglass without new depth; the Village loop is exempt (USER_VISION:6571, VL1 in round 7). | Cited lines. | Village cards add no Frontier places or items; the original village (VC8) is its own world, not Frontier depth. |

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

Sources: the [full source audit](../../../research/proto23/PROTO23_VS_YAIRPG_2026-10-10.md), [design lessons](../../../research/proto23/DESIGN_LESSONS_FOR_OOPS_2026-10-20.md), [feature side-by-side](../../../research/proto23/FEATURE_AUDIT_SIDE_BY_SIDE_2026-10-20.md) and the [loops proposal](../../../PROTO23_VILLAGE_LIFE_LOOPS_2026-10-14.md). Mechanics and feel only; no code, assets or prose (PW3).

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
| A training-ladder spine (the Dojo courses) | Career ranks are the nearest analogue | The original village (VC8) can take this verb |
| Seasonal weather states | Weather/environment lanes (PROJECT.md 2026-10-26) | Village reading of weather (PG4, banked) |

## 5. YAIR Village and an original Proto23-style village

Both, in order, with conditions (AD5). The YAIR Village is the home base and the test bed for shared mechanisms; what is there stays (PW5). The original village (PW4) is a separate world built on the same engine verbs with its own nouns, credited to Proto23 as inspiration (WER15). It earns a place by having a **different verb**, not by repeating watch and market under new names. Proposed default for its verb (LD4): *a training-ladder village where you prepare for short outings and each outing changes the next preparation*, which takes the Dojo spine and the home buffer from section 4. It starts after VC1-VC3 have proven the react and apply mechanisms it will reuse.

## 6. The cross-world loop

The Village loop is the inner ring; travel is the outer ring around the same six steps (TL1).

- **Home base.** The Village is where gains pile up and show (TL4, LD2). Whatever a life brings home should land in a Village consumer built by VC1-VC5: standing, an ask, a stockpile, a workshop.
- **What crosses.** By default memories and the base cheat (TL2, AD11). So the Village's first import is knowledge: a method learned in Tingen used in Village making (TL8). Its first export is the same: a Village method (a search habit, a preparation, a recipe) that is useful or odd in another world (TL3).
- **The cheat as thread.** A world-first milestone on arrival in Tingen (BC9) and Village service milestones both feed the continuing self's record (BC1, BC2), so travel and home both grow the cheat.
- **Reasons to return.** Village windows (watch, market), open asks, a stockpile and the relay pull you home; LOTM digestion and HP terms pull you out (TL5). Frozen time stays the default; the return note (UT3) says so.
- **Scale and headroom.** Other worlds grow as thin region packs chosen by what the next rung or ask needs (SC1, SC4, HR4). The Village asks for nothing from them until VC7; later Village asks can name a reagent or tool another world supplies, which gives regions a reason to be visited (SC2).

Dependencies: VC7 needs RET7 (Tingen rows in the carry ledger) and the playing LOTM entrance (GF7). Nothing in VC1-VC6 waits on another world.

## 7. Slice cards, in dependency order

Each card follows IB3 and AD43. Every done check includes: from a fresh Village life (no fixture), rebuilt bundle named by hash, MCP walk first then rebuilt desktop browser at 1920×1080 and 1536×864 for UI claims, Save/reload/Export/Import when state changes, native YAIR Village play unchanged, and the "agent-verified, not human-reviewed" label. Blocked-reason text consumes backlog-ui's UIV1 primitive and does not edit it.

**Village-playable first: VC1, VC2, VC3. Cross-world dependent: VC7. Docs only: VC8.**

| Card | Step | Outcome (player sentence) | Consumer | Cost | Mechanism (default, dial, reason) | Done check beyond the floor | Model, effort |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **VC1** The Village notices steady service | React | "Village watch complete: 12 coins, 3 Perception XP and +2 Village reputation." Band crossings say so once. | Native Village reputation: trade price part, rank ladder, reputation conditions | Unchanged watch and relay costs | Neighbours see who serves. Dial: per-village standing numbers. Interrupted shifts earn nothing. | Owned and specified by the village-loop session as [VL1](VILLAGE_LOOP_CHECKPOINT.md#slice-vl1-the-village-notices-steady-service); this plan adopts it unchanged | Sonnet medium (in progress) |
| **VC2** Standing opens a Village choice | Apply, earn | At Known Face the elder's "what to do next" names an open traveler ask that fits what you carry; at Neighbour asks seek you out and the career offers its next duty. | Existing `village_traveler_asks` and Village career ranks | Reputation earned in VC1; the ask's items | People trust and ask those they know. Dial: band thresholds per village. Reason: turns watch pay and bread into a path. | Reaching Known Face from a fresh life changes the elder text and lists an ask; completing it pays and moves standing; below the band the row says why it is closed | Sonnet medium |
| **VC3** The place remembers you, and says what changed | React, return | The Village description gains one line from your standing and finished relays; returning after an outing shows one note ("The market opened while you were at the mill; the courier left a pamphlet"). Watch and relay rows say what leaving costs before you accept. | Place description, return note (UT3), action descriptions (Discord F18/P5, F20/P7) | None new | Places keep visible consequences (SR rules). Dial: how much a village gossips. Reason: return needs a reason you can read. | Fresh life: description changes after the first band; leaving and coming back shows the note; interrupt text matches the actual forfeit; PR1 discovery wording | Sonnet medium |
| VC4 A Village deck that knows who you are | React, return | Occasional Village events cast people you served or helped ("The miller you carried for asks after the parcel"). | E2 storylet deck on F3 simulation streams; standing (VC1) | Event-specific | Salience casting (A1); seeded and saved so reload never rerolls (O1). Dial: frequency per village. | Ten cards drawable with saved cooldowns; one card casts a person from VC1/VC2 history; restore emits nothing | Sonnet medium |
| VC5 A home stock that changes the next outing | Carry, live | Bread, fuel and parcel goods kept at the Shack shorten the next outing's preparation; the row says what is stocked. | Household/larder clock, paid freight, workspace | Freight coins, spoilage | Home is a buffer (CRL3, CRL11). Dial: spoilage and capacity per home. | Stocking then leaving and returning changes a real preparation; spoilage follows game time | Sonnet medium |
| VC6 A Village routine while you are away | Return, idle | Choose a routine (watch, market runs) and come back to its results with stop reasons. | AD16 chosen routines; `away_ledger.js`; GN8 digest | The routine's own costs; stops at important choices or empty supplies | AD16 default; inactive worlds pause. Dial: rate per routine. | First confirm what `away_ledger.js` drives today (GF2). Then a closed-tab or bulk-time return shows results and stop reasons; no double pay | Sonnet medium, larger |
| VC7 Learn there, use here | Carry, apply (cross-world) | Learn one method in Tingen, return, use it in Village making with a visible result, and the crossing confirm lists what you carry. | Village making; carry ledger with RET7 Tingen rows; BC9 world-first milestone; UT1, UT2, UT4 | Time, the method's cost, notice (TL6) | Memories and the cheat cross by default (TL2). Whether it works follows mechanisms (AD38). | TL8's done check; depends on VC2 (a Village use) and the playing LOTM entrance | Sonnet or Sol medium |
| VC8 The original village, on paper | Design | A one-page world card: verb sentence (LD4), its nouns, the shared verbs it reuses, credit and licence status. | WER start record, PW4, WER15 | One doc | Engine owns verbs, world owns nouns. | Card committed; no copied Proto23 names or prose; build order waits for WD1 | Sonnet low |

## 8. Procedural ideas with a Village consumer now (at most three)

| Code | Idea | Village consumer | Card |
| --- | --- | --- | --- |
| VP1 | Storylet deck ([E2](../../../emergent/E2_STORYLETS.md), 20 drafted Village cards; status D4 in the [procedural map](../../../PROCEDURAL_GENERATION_STATUS_2026-10-13.md)) with salience casting ([A1](../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md)) | Simulation event streams (F3 `village.shower` proves the seam) | VC4 |
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

**This week:** VC1 (in progress), then VC2 and VC3. Write VC8 on a DC4 day. **Banked:** everything in the right-hand column above, and VC6 until GF2 is checked.

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
| LD4 | The Village's verb (LT1 draft) | YAIR Village: *keep a place running and be known for it*. Original village: *prepare, go out, come back changed* | Revisit after a week of short plays (LT1) | Gives the two villages different verbs (section 5) |

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
[GM plan](gm/dispatch/village-loop-2026-10-27/GM_PLAN.md) sections 4, 6 and 9.
```

**H3, master plan round 7, VL4** (owner: the session that wrote round 7): replace "Proto23 loops are mostly proposals" with "Proto23 loops are playable from a fresh life (village-loop MCP walk, 2026-10-27); their outputs lack consumers."

RULES_INDEX.md: no hunk. VC, VP, LD and GF codes are plan-local and register nothing.

## 13. Decisions waiting for Weibao

Within AGENTS limits: build order, first-slice defaults, save compatibility, effort.

| Code | Decision | Default if he says nothing |
| --- | --- | --- |
| WD1 | When the original village (VC8) moves from paper to runtime | After VC1-VC3 pass the floor and he has played them once |
| WD2 | First-slice defaults for VC2: band thresholds 10 and 50, and which ask the elder names first | Use VL1's bands; the first ask is the one the player can already fill |
| WD3 | Save shape for VC5 and VC6 (new home stock and away records) | Extend existing owners' schemas with migrations; no new top-level key |
| WD4 | LD1 and LD4 as working sentences | Use them as tests until play notes say otherwise |

## Verification

- Links: local Python check of every relative link and heading anchor in this file, 0 failures (2026-10-27).
- `git diff --check -- GM_PLAN.md`: clean.
- Blanket-claim sweep (never/always/only/accepted): remaining hits are sealed-secret practice, the reload-never-rerolls save invariant and plain usage.
- No runtime, tests or shared owners edited; no game run by this session (playability evidence is the village-loop session's MCP walk).
