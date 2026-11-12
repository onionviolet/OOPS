# Foundation A · Agency, checkpoint 2026-11-12

*Chat A in the [procedural foundation plan](../../../PROCEDURAL_FOUNDATION_PLAN.md) (OS1). Phase 1: inventory and contract proposal, before K and W v0. Docs only; no `src` edits. Started from 9bbc51363 (branch `claude/fdn-a-agency-9dddef`, fast-forwarded from c25fd396d). Everything below is a proposal under AD56 and stays adjustable.*

## Reading

How an NPC, creature, Gu or process picks a working from its wants, knowledge and means, on the same quote the player sees (PFP11, SPR26), with minds (wants, mood, fear, sanity, loss of control) read from L's bodies. Rules applied: PFP2, PFP10-PFP13, SPR26, SPR28, SPR31, SPR32, MND2, MND5, MND7-MND9, MND18, AD38, AD51, GR17.

## F1 · The agency engine already exists

`src/simulation.js:718-750` runs every registered **controller**: on its interval, it walks the controller's candidate actions and starts the first one that passes the same `previewCommand` the player's commands use (`previewSimulationCommand` at :115 and `commitSimulationCommand` at :305 both reach `previewCommand` and `startCommand`). Candidates are commands, event responses or encounter answers, optionally guarded by a `when` rule and an authored `schedule` row (`npc_schedule.scheduleFacts`). Programs (`s.programs`, :752) repeat a command through the same preview and pause with a reason when inputs run out. Work plans (`feature_expansion_work_plan.js`) are cursors over the same preview and commit.

So SPR26 holds for these actors already. What the loop lacks:

- **No wants.** Order is a fixed `priority` per candidate (`controllerOrder`, :646), ties broken by JSON text. Nothing about the actor's needs, mood or the world's scarcity changes the order.
- **No stated cause.** `c.lastAction` records what ran, never why it beat the others.
- **No knowledge filter.** Guards read `simulationFacts`, which mixes truth and actor knowledge; nothing marks a candidate as chosen on belief.
- **No coarse mode.** No away-time harness case covers controllers (searched `tests/away*`, `determinism_replay`, `replay_harness`); the replay harness drives player commands only.

## F2 · Inventory of decision sites

Input for every count: `expeditionRegistry` from `src/expedition_content.js` at 9bbc51363, read by a scratch script (not committed).

**Shared loop (data rows over one rule)**

| Owner | Who decides | How | Player's path? |
| --- | --- | --- | --- |
| `simulation.js` controllers | 58 controllers, 46 actors, 226 candidates (223 command, 2 encounter, 1 event); 11 book-world (Paradise 7, Mother of Learning 2, book care 2), 47 original | First eligible by fixed priority; 39 have 2+ candidates, 9 of those with `when` guards, 6 with tied priorities; 19 single-candidate | Yes, `previewCommand` |
| `simulation.js` programs | Any actor with a running routine | Repeat one command; pause with a reason | Yes |
| `feature_expansion_work_plan.js` | Itinerary holders | Ordered cursor | Yes |
| `npc_schedule.js`, `cast_schedule.js` | Authored people | Place and activity by minute; facts only, no choice (the schedule header names "a later needs/goals layer" as its reader) | Facts, not choice |
| `pursuit.js` | A pursuer | **Evidence directs travel; the target's true position is read only for contact.** The one existing knowledge-not-truth chooser | Through simulation effects |

**Standalone choosers (bespoke code)**

| Owner | Who | How it decides | Cause line? | Player's path? |
| --- | --- | --- | --- | --- |
| `tempo_allies.allyMove` (:46) | Allies in a tempo fight | **Scored rules** over goals {survive, protect, aim, pay}, bond, discipline, derived fear, heard order; flee threshold dial | Yes, `why` per rule | Same moves as player |
| `tempo_fight.policyChoice` (:111) | Foes, and the player's auto-driver | Ordered if-rules by named policy (safe, steady) | No | **Yes: foes and the player's auto-play share `policyMove`** (:345, :409), a PFP11 success |
| `crowd.chooseWitness`, `comesForward` | Crowd witnesses | Goal-weighted chance {civic, protect, fear} on a keyed draw (GR17) | Chance shown, no line | Own table |
| `household_fortunes_domain.routineNeed`, `runRoutines` (:126-132) | Manor staff | Need test (cook when meat < 2, repair when integrity < 100, dry when wet) then gate on reserve | No | Uses `planOrder`, the staff order path |
| `organizations_domain.settlerPolicy` (:219) | A claim's settlers | Pay on time if strong or known, else late | No | No; caller asks |
| `book_world_lotm_constables.decide` (:107) | Backlund constables | Heat level against a wanted dial, latched | No | No |
| `companion_wishes.issueWish` | Companions | Seeded pick among rites, no duplicates | No | No |
| `rival_memory` | Rivals | Appraisal and hidden margin feed a combatant | Partial (brief) | Own quote (`rivalStudyQuote`) |
| `village_family.familyPolicy`, `npc_lives` | Village household | **Not a decision site.** A seeded timeline of births, marriages and deaths; the policy toggles a player-set switch | n/a | n/a |
| `gu_keeper_wild.advanceRoamingWorm` (:290) | The roaming liquor worm | **Not a decision site.** A fixed timer between cellar and border | n/a | n/a |
| `creature_lifecycle.advanceWildHabitat` (:306) and its Gu users (`gu_colony`, `gu_wolf_ridge`, `gu_army_ants`) | Wild populations | **Not a decision site.** Population rates by capacity; wild wolves are passive targets of the player's hunt | n/a | n/a |
| `gu.wildWill` (`gu_workshop.js`) | A wild Gu | **Not a decision site.** A flag that blocks use until refined | n/a | n/a |
| `cultivation_intents`, `continuation_intents` | The player | **Not a decision site.** Earned execution habits the player selects; they shift two numbers in Frontier tempering | n/a | Player only |
| `gu_goal_search`, `creature_methods.planCreatureMethod` | The player's hosts only (`gu_keeper_goal` checks `actorId === 'player'`; `meadow_courier`, `meadow_fleece`) | Bounded search over methods; ordered steps with reasons | Blocked reasons | Player only today; **planners A can hand to NPCs** |
| `story_director` | The pacing layer | Chooses which already-caused events surface | n/a | Not an actor (D's) |

**Minds**

| Owner | What | Note |
| --- | --- | --- |
| `mood_thoughts.moodOf` | Dated attributed thoughts, mood derived on read (MND5) | Read by `person_ties`, `book_world_lotm_colleagues` |
| `everyday_life.activeMood`, `moodConditions` | Mood as conditions on authored people | A second mood owner |
| `tempo_allies.allyFear` | Fear derived each turn from wounds, fallen allies, discipline, light | A third, local to fights |
| `person_temperament`, `person_memory_effects` | Traits as dials on recall, trust, telling (MND2) | The trait port |
| LotM acting and digestion | `book_world_lotm_actions` | Stays in LotM by MND10 until a second world needs it |

Loss of control and sanity: no runtime chooser exists. MND7 (no generic sanity tax) and MND9 (loss of control is a threat with exits) are the owners.

## F3 · PFP2 counts (A's baseline)

| Count | Value | Meaning |
| --- | --- | --- |
| Choices as data | **58** controllers, 226 candidates | Rows on the shared controller loop |
| Bespoke choosers | **8** | `allyMove`, `policyChoice`, `chooseWitness`/`comesForward`, `routineNeed`/`runRoutines`, `settlerPolicy`, constables `decide`, `issueWish`, `rival_memory` |
| Choices that carry a stated cause | **1** | `allyMove` only. This is the number A exists to raise |
| Wild creatures that choose | **0** | Wild life is timers and rates today |

## The agency contract, v0 proposal

Build it as **"scored candidates in the controller loop"**, not a new engine. `controllerOrder(d)` becomes a score over the candidates; `previewCommand` stays the gate; the stable tie-break stays so a reload replays the run (GR17, PFP13). `allyMove` and `comesForward` are the shapes it generalizes.

**A1 · Actor.** Anyone with a controller: a person, a creature, a Gu, a process (a weather front, a rack drying). The actor's body and condition are L's; A reads them.

**A2 · Wants.** A small weighted set per actor, each a named pull with a unit weight 0-1: `{survive, eat, rest, keep, earn, protect, aim, belong, ...}` as a world pack's vocabulary, not a fixed list. Default: wants come from the actor's definition plus live reads (hunger from L, fear derived as `allyFear` does, mood band from `moodOf`). Dial: a world adds wants (a Gu's hunger for its food, a Beyonder's acting pressure). Reason: `allyMove` already shows four goals cover a fight; more come from the world.

**A3 · Knowledge read.** Candidates and scores read **what the actor knows**, not the truth (SPR31, PFP13; the `pursuit.js` rule). Default: an actor-scoped fact view through N's knowledge port with each fact's route (seen, told, deduced). Dial: a process with no mind (weather) reads truth. Reason: a rival who acts on a rumor is the story; acting on hidden truth leaks it.

**A4 · Candidate workings.** The controller's authored candidates plus any working in K's catalogue the actor can bind (the means). Each candidate gets **the same quote the player sees** from K (cost, time, odds, eligibility). Ineligible candidates drop with K's reason kept, so "why didn't they" is readable.

**A5 · Score with a stated cause.** `score = sum(want weight x the candidate's expected effect on that want) - quoted cost x thrift + authored priority as a bias term`. Each term is labelled; the top two terms form the cause line ("Orr is hungry and the market is short of bread, so he bakes"), written by the actor's own knowledge (SPR32: no more than they would know). Dial: priority-only worlds keep the bias term and zero wants, which reproduces today's behavior exactly. Reason: lets the 58 existing controllers migrate with no behavior change, then gain wants one at a time.

**A6 · Choice.** Highest score wins; ties fall to the existing stable order. Default deterministic. Dial: a temperament may add a keyed draw over the top few (`gen_kit` address `agency.choice/{actor}/{clock}`), so a reckless person sometimes takes the second best. Reason: people are not optimizers, and keyed draws replay.

**A7 · Stances.** An intent (the `cultivation_intents` shape) is a stance any actor can hold that shifts score terms (patient: +stability weight, -risk). The player's habits become one case of A's stance rows (PFP11).

**A8 · Minds.** Mood and fear are score inputs, never stored meters (MND5): `moodOf` becomes the single read port; `everyday_life` mood conditions and `allyFear` read through it or write thoughts into it. Loss of control (MND9) is a mind state from L/LotM's carriers that overrides wants with the world's stated compulsion, keeps its exits, and still acts through quoted workings.

**A9 · Coarse choice away from the player** (PFP12, SPR28). Near the player, choose each interval. Away, an actor's choice settles as **shares over its candidates for the span** (what fraction of days it baked, rested, traveled), computed from the same scores over the span's expected wants, so totals match the step-by-step run within a dial tolerance. Default: one harness case (new; none exists for controllers) runs a controller one jump and many steps and compares. Reason: idle time must stay cheap (MC16) and still honest.

**A10 · Receipt.** Every choice writes `{actor, chose, score terms, cause line, beat}` to a bounded per-actor ring (SPR30), read by Reports and `chain_inspector` (MC10). No new knowledge layer (MC8).

## First two consumers (after K v0)

**C1 · NPC: the manor cook** (`household_fortunes_domain.routineNeed`). Scarcity input: roasted rat meat in staff stock and estate funds. Today a fixed "meat < 2" test. After: the cook's wants {keep (the house fed), thrift} score `cook`, `buy` and `rest` through K's quotes. Done check: lowering stock or raising a meat price (M or a test dial) changes which working wins, and the Reports cause line says why. Moves one bespoke chooser onto the loop.

**C2 · Wild creature: the roaming liquor worm** (`gu_keeper_wild`, lifecycle from L). Scarcity input: liquor or food supply at the cellar (a W quantity). Today a fixed timer. After: wants {eat, safety} score `stay`, `roam to feed` and `flee` (a keeper's presence raises fear). Done check: a well-stocked cellar keeps it home, an empty one sends it roaming, with the same totals after one jump and many steps. First wild creature that chooses.

Fallback for C1: a causal-story courier controller with competing candidates, if the household owner is busy in another chat.

## Requests to other chats (also in the shared notes folder)

- **K:** an actor-scoped pure quote (`quote(working, actor, bindings, knownFacts)`) with eligibility reasons and a slot for a cause line; A calls it unchanged for every candidate.
- **L:** body reads per actor: vitality, hunger or feed level, injury, condition, and Gu feeding state, as one read.
- **W:** scarcity as a quantity a place carries (food, liquor, coin in circulation), readable by A without importing a domain.
- **N** (when it starts): an actor-scoped knowledge view with each fact's route; until then A reads `simulation.knowledge[actor]` directly.
- **M** (when it starts): a price read for an actor at a place, so C1's scarcity can come from a market.

## What the rules could not express (backlog)

- **B1 · Wants vocabulary.** No owner names the want set; A2 starts it as world-pack data. Needs a naming pass against NMR.
- **B2 · Planning depth.** v0 scores one step. Multi-step plans (save coin now to buy a Gu later) need `gu_goal_search`-style bounded search on K; level sonnet, after C1 and C2.
- **B3 · Group choice.** A pack, a sect or a crowd choosing as one; `crowd.js` and M's groups are the start. After M v0.
- **B4 · Three mood owners.** Folding `everyday_life` mood conditions and `allyFear` onto `moodOf` touches files owned elsewhere; request, not edit.
- **B5 · Loss of control.** Only LotM has the carrier; a shared compulsion needs a second world (MND10).
- **B6 · Tied priorities.** 6 controllers rely on text-order tie-breaks today; A5's bias term keeps them, but each deserves a stated reason.
- **B7 · Bespoke choosers.** `settlerPolicy`, constables `decide`, `issueWish` and `rival_memory` move onto the loop after C1 and C2, each a drop in the bespoke count.

## Checks run

| Command | Result | Gaps |
| --- | --- | --- |
| `node scratchpad/count.mjs` (imports `src/expedition_content.js`, counts controllers) | 58 controllers, 46 actors, 226 candidates; 39 multi, 9 guarded, 6 tied, 11 book-world | Only the expedition registry; book worlds installed elsewhere may add controllers at runtime |
| `grep` for choosers, minds, wild behavior and callers across `src` (1,298 files) | Table F2 | Name-pattern search; a chooser with an unusual name could be missed |
| `grep` of `tests/` for an away-time controller case | None found | |
| Doc check: no em dashes in this file | Pass | No runtime tests needed (docs only) |

Compatibility (MC4): unchanged; no save shape touched.

## Next phase

Phase 2 waits for K and W v0 on master. Then: wire A5 as a scored `controllerOrder` with the priority-only dial (zero behavior change, proven by the existing controller tests and a new one-jump-versus-steps harness case), then C1, then C2, each with its focused test and a Reports cause line.

```receipt
build: n/a
route: n/a
state: drafted
viewport: n/a
persistence: unchanged
tests: docs only
review: diff-scoped
surface: agency inventory and contract proposal; no runtime change
```
