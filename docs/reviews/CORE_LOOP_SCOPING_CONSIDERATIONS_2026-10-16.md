# Core loop scoping considerations, 2026-10-16

**Planning only. Every recommendation, option, slice and code below is a Claude
proposal, not an accepted decision.** Accepted direction is cited by its owner
code (AD, D2/D3, CX) and is not restated as new authority. No runtime change and
no priority change.

Weibao, after an earlier chat pitch named the game around "selling the heir loop":

> heir loop doesnt have to be the core loop, the core loop should probably be scoped properly upcoming? /more-to-consider Might need. seperate deeper considerations

Thread hub: [engine and identity thread](ENGINE_AND_IDENTITY_THREAD_2026-10-16.md#core-loop).
Codes in this doc use **CL**.

## Sources read

- [USER_VISION](../USER_VISION.md): the 2026-10-16 core loop entry; open item 7
  "Balance between active play and idling"; Q8 ("would we be the characters, or
  someone guiding them ... this changes the gameplay flow"); heir "if any";
  heir-only carryover as implementation state, not design limit.
- [Rules index](../RULES_INDEX.md): AD10–AD12 (lives), AD15–AD18 (time, away
  time, recap, time bank), AD19 (forgiving recovery), AD24 (players choose
  pursuits, no compulsory main quest), AD33 (complexity welcome, slices sequence it).
- [Representation discussion](../gm/REPRESENTATION_DIRECTION_DISCUSSION_2026-10-15.md):
  accepted D2 (any little pursuit can become a whole path; mixture depends on
  world and life) and D3 (hands-on involvement chosen per activity and life).
- [LIFE_SIM_NORTH_STAR](../LIFE_SIM_NORTH_STAR.md): "What persists across runs,
  and the gameplay loop" (timescale table, life loop, four persistence layers);
  "Hunger and idle play"; draft **D2b** (idle backbone, active play steers),
  which is still listed under "Draft decisions awaiting review". Claude
  recommended accepting it; Weibao has not.
- [PROJECT.md](../../PROJECT.md): first milestone "one realm and one prestige
  layer. This sequences delivery; it does not cap the vision"; vanilla stays intact.
- Complexity owners: [Part 9 pass](../gm/dispatch/ui-foundation-2026-10-15/next-parts/part-9-complexity-and-openness.md)
  CX1–CX8 (accepted), [subsystem scope ladders](../SUBSYSTEM_SCOPE_LADDERS_2026-10-16.md) SSD.
- Engine notes: [foundation](FOUNDATION_CONSIDERATIONS_2026-10-16.md) C1–C8,
  [core engine](CORE_ENGINE_AND_RUNTIME_CONSIDERATIONS_2026-10-16.md) N1–N8.
- Reference dossiers: [Idle Loops](../research/open-idle-games-2026-10-09/IDLE_LOOPS.md),
  [Path of the Idle Cultivator core loop](../research/cultivation-idlers/path-of-the-idle-cultivator/CORE_LOOP_DIGEST.md),
  Groundhog Life, Academagia and Immortality Idle (north star pointer, 2026-10-13).
  Other game patterns below come from general knowledge, labelled as such.
- Current source, read by a search agent for this pass (section CL20). Not
  exercised in a browser.

## Short answer

**CL1. Recommendation: the core loop is a shape, not an activity.** One cycle
that every world and every pursuit plugs into:

> **choose a pursuit → act on it (by hand or by routine) → learn and gain →
> the gain opens a new choice.**

Work, making, exploring sites, fighting, training, farming and cheat discovery
are all *pursuits* that fill that cycle. Lives, heirs, world travel and
prestige are *outer loops* that change which pursuits exist and what carries.
This fits accepted D2 (any pursuit can become a whole path), D3 (involvement
chosen per activity and life) and AD24 (players choose pursuits). It also
explains why naming the game after the heir loop felt wrong: the heir loop is
one outer loop, and an heir is optional.

**CL2. The distinctive part, the hook a name or pitch can point at, is
discovery inside that cycle.** Every pursuit is also a way to find out how this
world actually works (hidden properties are real, AD3, AD9; making rules MR).
Melvor's loop is "level the bar". Qud's is "find out what this thing is". The
recommendation is that YAIRPG's per-minute pull is Qud's question asked through
an idle game's routines: you set things running, and they come back with
discoveries, not only numbers.

**CL3. First-slice default (for Weibao to confirm or change): the first
milestone's core loop is the day loop in the native realm**, using pursuits
the build already has (work, training skills, combat, making), with one
discovery-bearing pursuit raised to "whole path" quality, and accepted away
time (AD16) actually implemented, since the build has none (CL25). The one prestige
layer is a generic **fresh-life boundary** (CL40) whose first trigger can be
death, choice or a crossing, with heir as one carrier among several. Build
order and that first trigger are the only questions this doc leaves for him.

## CL10: loops by timescale

The north star's timescale table already exists; this restates it with what
the player decides at each level and which accepted rule governs it.

| Code | Timescale | Player decides | Runs on its own | Governing direction |
| --- | --- | --- | --- | --- |
| CL11 | Moment (seconds to minutes, active) | Pick an action, inspect, experiment, fight choices, read the log | The chosen action's progress bar | D3: hands-on involvement chosen per activity and life |
| CL12 | Session (minutes to an hour) | Set or change routines, chase one short goal (a recipe, a site, a skill threshold), handle stopped routines | Routines with stop conditions | D2b draft; AD15 settled routines compress |
| CL13 | Away (hours to days, closed tab) | Nothing while away; on return, read the recap and resolve paused choices | Chosen routines in the current world; inactive worlds pause | AD16, AD17, AD18 accepted |
| CL14 | Arc (many sessions) | Career, project, site restoration, breakthrough, home | Projects advance through routines | D2: a pursuit can become a whole path |
| CL15 | Life | When and how a life ends or continues; what to prepare | Aging per world and settings | AD10–AD13 |
| CL16 | Journey (across lives and worlds) | Which fresh life, world or carrier next | Nothing; inactive worlds keep their histories | AD4, AD11, AD12 |

**CL17. Decision density is the measure, not activity count.** Each level needs
at least one consequential decision the level below cannot make for you. If
the session level has no decision (routines just run), the game collapses into
an incremental; if the moment level demands every click, it fights idle play.
Track this per world (CL60).

## CL20: what the current build delivers

Read from `src/` by a search agent on 2026-10-16 HEAD; not run, not built, not
played. **[code]** is read in source, **[inf]** inferred.

| Code | Finding | Evidence |
| --- | --- | --- |
| CL21 | Tick model: 1 tick per real second, each tick 1 game minute (6 while sleeping). One joined clock, paused during some fork scenes and pending choices. 360-day year with seasons | [code] `src/config.js:19,23`; `src/main.js:8746,2076,8744`; `src/chronicle.js:96` |
| CL22 | Moment loop is vanilla YAIR: click to start a job, training or gathering, which then runs every tick for XP and drops; combat zones auto-fight and respawn groups; favourite consumables auto-use. XP gain per step is capped | [code] `src/main.js:3539-3585,9063-9115,9448-9450,4976-4998,8988-9026`; `src/config.js:27-28` |
| CL23 | Session loop: location unlocks, 13 quests, crafting recipes, trade with daily price recovery and spreading saturation. Fork Village adds patrol job with lent kit and debt, mentor, watchcraft training, career rank, a free workbench | [code] `src/quests.js`; `src/crafting_recipes.js`; `src/trade.js`; `src/main.js:3574-3577,858,9047,571` |
| CL24 | Defeat is unconsciousness and recovery, not death (matches AD19) | [code] `src/main.js:5067-5088` |
| CL25 | **No offline progress.** Source says no player offline policy exists yet; catch-up is a test hook. `src/away_ledger.js` (cap plus bank) exists but nothing imports it. A backlog feature counts at most 6 reviewed minutes | [code] `src/main.js:9460-9465`; `src/backlog_expansion_time.js:43-48` |
| CL26 | Lives: open or mortal life chosen at the Village elder; start age 18, lifespan 80; mortal life warns a year ahead then ends. `beginHeir` reloads into an heir who inherits money after estate, items and chest, the Shack, half reputation, written lessons or a taught apprentice, and unpaid obligations; skills and XP do not carry. An "independent life" option archives the old life and starts a new one | [code] `src/chronicle.js:78-80,116-121,160-162`; `src/main.js:2730,2743-2751`; `src/heir_inheritance.js:32-96` |
| CL27 | No prestige currency or multiplier | [inf] none found |
| CL28 | Wired fork systems: cheat card wakes on day 3 or first won fight and unlocks a status window; Frontier campaign panel gated on a field flag; Practice blocks other actions while active | [code] `src/cheat_cards.js:86-105`; `src/frontier_campaign_ui.js:29`; `src/main.js:2727` |
| CL29 | Book worlds and realms (Mother of Learning, Paradise, Proto23, pocket realm, Mistglass, an authored site) are imported with panels and a realm move; content packs load only from the gitignored private manifest. The fresh-start route into a realm was not confirmed | [code] `src/main.js:114-212,1946,2170`; `src/content_packs.js:88-99`; route [inf] |

**CL20a. What this means for scoping.**

- The build's actual core loop today is vanilla YAIR's: start an activity or
  enter a zone, let it run while the tab is open, spend the gains. It is an
  *open-tab* idle game. Closing the tab stops the world. That contradicts
  accepted AD16 in practice: the direction is accepted, the implementation is
  missing. This is the largest gap between the core loop on paper and in play.
- The fresh-life boundary (CL41) partly exists already: the heir route and the
  "independent life" route are two triggers on one reload-into-new-life path.
  The prestige layer is closer to a generic operation than the heir framing
  suggested.
- Discovery (CL2) is thin in the moment loop today: jobs and zones return
  numbers and drops. Making and sites, the recommended discovery pursuits,
  are the least finished parts.

## CL30: candidate loops, core or supporting

"Core" here means *the pursuit the first milestone leans on to fill CL11–CL14*.
Under CL1 every row stays reachable; the table ranks readiness and fit for the
first slice, not worth.

| Code | Loop | Fills which levels | Idle fit | Discovery fit (CL2) | Readiness now | Cost to raise to whole path | First-slice role (proposal) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CL31 | Work and skill training (vanilla YAIR) | Moment, session, away | Best | Low unless jobs reveal things | Shipped in vanilla | Low | Backbone that funds everything |
| CL32 | Making (potions, cooking, smithing, runes) | Moment, session, arc | Good once a recipe is solved (solved → routine) | **High**: hidden properties, free experimentation, MR rules | Partial; M3 crafting seam implemented-unverified | Medium | **Recommended discovery pursuit** |
| CL33 | Exploration and sites (ruins, natural places, maps) | Session, arc | Medium: expeditions can run as routines with stop conditions | **High**: claims versus truth, SR rules | Rules SR1–SR24; procedural layouts deferred | Medium-high | Strong second; current procedural focus |
| CL34 | Combat | Moment, session, away (zones) | Good (vanilla auto-combat) | Medium: learned opponent numbers (AD8) | Shipped in vanilla | Low | Supporting; gates places and materials |
| CL35 | World travel | Journey | N/A per minute | High at journey level | Hubs and some worlds in source, unverified | High | Outer loop; deferred past milestone 1 except as the prestige trigger option |
| CL36 | Cheats (base cheat discovery) | Arc, journey | Neutral | **High**: powers found in play (AD26) | Designs plus partial source | Medium | A modifier on every pursuit, not a loop of its own |
| CL37 | Lives, heirs, lineage | Life, journey | High (generational idle) | Medium | Heir and independent-life routes in code; skills do not carry (CL26) | Medium | Outer loop; one carrier option inside CL40 |
| CL38 | Procedural content (generated sites, items, rumors) | Feeds CL32, CL33 | N/A | Supplies novelty | Engine seams only; layouts deferred | High | Supplier, not a loop |
| CL39 | Life-sim day (home, needs, relationships) | Session, arc | Good if needs are automatic | Low-medium | Proto23 village/household in source, unverified; NPC-heavy work deprioritized | High | Texture layer; NPC depth deferred (AD33) |

**CL30a. Why making first, exploration close second.** Both carry CL2's
discovery hook. Making reuses the most existing owners (MR rules, M3 seam,
vanilla crafting UI) and works in one place, so it suits a one-realm slice and
the idle shape (solve once, then routinize). Exploration is the current
procedural focus and carries the strongest "world" feel, but its depth wants
generated places that are still deferred. A slice can pair them: exploration
finds materials and claims, making tests what they really are. That pairing is
the strongest single-realm loop the docs already support.

**CL30b. What would change this ranking.** If Weibao's first playtest finds
making's experiment UI tiring, swap the lead to exploration; if he plays most in
combat zones, lead with combat plus learned numbers. Ranking is a sequencing
default, not a judgment of which loop matters.

## CL40: the one prestige layer without presuming heirs

The milestone says one prestige layer. The north star proposed "death and the
next life" as that layer. Weibao's correction means the layer should not be
built as "the heir loop".

**CL41. Recommendation: build the layer as one generic operation, the
fresh-life boundary.** It already exists in accepted direction as AD12 ("a
fresh life has its own history; the former life pauses"). One operation card,
many triggers:

| Trigger | Carrier for what persists | Accepted basis |
| --- | --- | --- |
| Death with an heir | The heir, plus whatever the world's means carry | Current code (`beginHeir`, CL26); heir "if any" |
| Independent life (already in code) | Archive of the old life | Current code (CL26) |
| Death without an heir | Memories and base cheat (AD11); world remembers | AD11, heirless endings (north star part 26) |
| Chosen fresh life (reincarnation, regression, loop) | Memories, base cheat, world-specific means | AD12 intentional loops |
| Crossing to another world | Memories, base cheat, carried items by means | AD11; deferred beyond milestone 1 as content |
| No boundary at all (life extended indefinitely) | Not needed | North star: "Death is not required" |

**CL42. The card defines resets, not a universal currency.** For each trigger:
what resets (body, local inventory, local standing), what stays in the world
(AD4), what carries and by which carrier (AD11; C2 save scopes `life`,
`lineage`, `world`, `meta`). Idle-game prestige math becomes legacy, karma or
soul weight only where a world gives that a reason.

**CL43. Vanilla is untouched.** The layer is opt-in for vanilla play; no
forced reset, matching "vanilla stays intact".

**CL44. Reference shapes the card can borrow** (general knowledge unless
linked): Idle Loops resets run state while talent persists (dossier F2);
Antimatter Dimensions stacks layers, each resetting the one below;
Kittens Game resets the colony and keeps paragon and metaphysics;
Evolve resets the species and keeps genes and plasmids, and changes the
start by choice; Rogue Legacy passes to an heir with traits and a manor;
Groundhog Life softens the end so days stretch. Each is one trigger plus one
carry rule, which is why one card with triggers is enough.

## CL50: how the core differs per world while staying one game

**CL51. Invariant across worlds:** the CL1 cycle, the verbs (center actions,
routines with stop conditions, recap, inspect), the log column, save scopes
(C2), absence policies declared per domain (N5) and the fresh-life operation
(CL41).

**CL52. Variable per world (data, declared in the world pack):** which
pursuits exist and which is the world's natural lead; clock cadence (C1) and
time compression (AD15); needs and danger (north star hunger options);
absence policy for away time (AD16 sets the default, the world chooses
details, L6); which outer loops are available (some worlds have heirs, some
loops, some neither).

| World shape (illustrative palette) | Natural lead pursuit | Natural idle form | Reference pattern |
| --- | --- | --- | --- |
| Native YAIR realm | Work, combat zones | Auto-combat and jobs | Vanilla YAIR, Melvor |
| Magic school year | Study and exams | Day slots with class defaults | Academagia, Groundhog Life |
| Cultivation | Training and breakthroughs | Closed-door seclusion | Path of the Idle Cultivator, Immortality Idle |
| Frontier or ruin-heavy | Expeditions and sites | Expedition routines with stop conditions | Qud, Dwarf Fortress adventure mode |
| Village or homestead | Making and household | Production routines | RimWorld, Kittens Game |
| Investigation-heavy (LOTM-like) | Inquiry and acting | Slow background inquiry | Book of Hours |

**CL53. One proposed field per world pack:** `loops.lead` (the natural lead
pursuit) and `loops.outer` (available fresh-life triggers). This is a manifest
note for the [world pack loader](../gm/dispatch/ui-foundation-2026-10-15/next-parts/part-9-complexity-and-openness.md#world-pack-loader-dispatch-considerations-2026-10-16)
owner, not a change to its current lane.

**CL54. Player role (Q8) changes the moment loop, not the shape.** Being the
character is the default (AD10). Guiding someone (a system, a sect leader, a
patron spirit) turns CL11 into setting priorities and intervening, the RimWorld
and Dwarf Fortress pattern. Both fit CL1; role is a realm-of-play setting, not
a second core loop.

## CL60: idle and offline expectations

**CL61. Most of this is already accepted, none of it is built.** AD16 (away
time runs chosen routines in the current world and stops at important choices
or exhausted supplies; inactive worlds pause), AD17 (recap shows what knowledge
allows), AD18 (banked unused time). The build has no offline progress (CL25),
and the unused `away_ledger.js` is the nearest existing piece. Open details stay
with L6: cap, formula versus simulated catch-up, and per-world aging. For an
idle RPG, away time is part of the core loop, not an extra; CL13 is empty in
play until it lands.

**CL62. The core loop must pay off in both modes.** The away recap should
contain discoveries as well as totals, otherwise CL2 disappears while idle.
Concretely: a routine that tests ingredients or walks a site logs what it
learned, inside AD17's knowledge limits.

**CL63. Open item 7 (active versus idle balance) is answered by D2b plus D3 if
Weibao accepts D2b.** Until then it stays open. This doc does not accept it.

**CL64. Solved becomes routine.** The bridge between active and idle play is
the moment a hand-solved task (a recipe, a route, a fight) turns into a routine.
Idle Loops shows the strength of "prepare once, replay, inspect where it
failed". This is the single mechanic that most makes the shape work.

## CL70: first-milestone fit

**CL71.** One realm: the native realm or one world pack, with the CL1 cycle
filled by work, combat and one discovery pursuit (CL30a), plus AD16 away time
for the routines that pursuit offers.
**CL72.** One prestige layer: the fresh-life operation (CL41) with one trigger
implemented first.
**CL73.** Everything else (travel, lineage depth, generated layouts, NPC depth)
stays reachable through the same seams and is deferred by CX7 and AD33, not
cut.
**CL74.** Done for the milestone means Weibao plays a full cycle at every level
from CL11 to CL15 in one realm, crosses the prestige boundary once, and the
recap after a real absence shows routines and discoveries.

## ACT NOW (done in this pass)

| Code | Item | Status |
| --- | --- | --- |
| CL80 | Saved this considerations doc and linked it from the thread hub's Core loop section | Done |
| CL81 | Recorded that D2b is still a draft awaiting review, so active/idle balance is not settled by this pass | Done (CL63) |
| CL82 | Separated the heir loop from the core loop and from the prestige layer (CL1, CL41) | Done |

## ACCOUNT FOR NOW (constraints on current work, no feature work)

| Code | Constraint | Applies to |
| --- | --- | --- |
| CL90 | No name, pitch, UI copy or doc should present the heir loop as the core loop. Point identity at discovery inside a chosen life (CL2) until Weibao picks | Naming thread GN1–GN9 |
| CL91 | Keep the engine loop-neutral: C1 cadences, C2 scopes and N5 absence policies already allow every CL30 row as lead. Do not hardcode death as the only life boundary | Modular seams, ER12 |
| CL92 | Making commands registered in M3 should be routine-capable (serializable arguments, C3) so "solved becomes routine" (CL64) needs no rewrite later | Modular seams M3 |
| CL93 | Domains declare whether they produce recap-worthy discoveries, so the away recap can include them (CL62) | Domain registry conformance (C7) |
| CL94 | UI work keeps routines, stop conditions and the recap discoverable at 1366×768 on a populated save; they are the core loop's main surface | UI rounds R15+ |
| CL95 | Treat the missing away-time implementation (CL25) as a known gap against accepted AD16 when reporting the core loop as playable. A slice that claims idle play must say whether it ran with the tab closed | Any playable-slice report |

## LATER / DELEGATE (proposals, nothing dispatched)

| Code | Item | Level and effort | Done check |
| --- | --- | --- | --- |
| CL100 | Playtest the current build against CL10: log which decisions Weibao makes at each level and where idle dead time appears | Weibao with Claude observing; one session | A short local playtest note per level, with dead spots named |
| CL101 | Fresh-life operation card (CL41, CL42): triggers, resets and carriers mapped onto C2 scopes and current heir code | Strong model; design first, then a scoped slice | Card reviewed by Weibao; each trigger maps to save scopes with a migration decision |
| CL102 | Core loop slice spec for milestone 1: native realm, work plus combat plus making with solved-to-routine and a discovery recap | Strong model plan, balanced model build | Rebuilt browser journey at 1366×768 completes CL74 |
| CL103 | Routine and stop-condition design across pursuits (one shared form, per-pursuit conditions) | Balanced model; after CL100 | One routine form drives two pursuits in a browser journey |
| CL104 | Per-world loop card fields `loops.lead` and `loops.outer` (CL53) for the world pack loader | Balanced model; after the loader lane merges | Two packs declare different leads and the game reads them |
| CL105 | Offline semantics pass (L6) with discovery-bearing recap (CL62) | Weibao's design call; Claude drafts | Per-world absence table accepted or edited by Weibao |
| CL107 | First away-time slice: AD16 for one pursuit in the current world, reusing `away_ledger.js` if it fits, with stop conditions, inactive worlds paused and an AD17 recap. Needs N5 absence policies and a save decision | Strong model design, balanced build; persistence change needs migration | Close tab, reopen after real time, recap shows routine results and stops; save, reload and import pass on a fresh origin |
| CL106 | Decision-density audit of reference idles (Melvor, Kittens, Antimatter Dimensions, Evolve) against CL17, reusing existing dossiers before new reads | Balanced model; one pass | Table of decisions per level per game, with sources labelled shown, stated or inferred |

## Questions for Weibao (build order and first-slice defaults only)

- Build order: where away time (CL107) and the core loop slice (CL102) sit
  relative to the modular seams M2.5/M3 work. Recommendation: CL107 first
  (it serves every lead pursuit and closes an accepted-but-missing rule), then
  M3, then CL102.
- First prestige trigger beyond the two in code: recommendation is death
  without an heir (memories and base cheat carry), because it exercises the
  generic carriers and makes heirs an add-on rather than the frame.
