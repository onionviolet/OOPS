# Foundation C · Conflict, checkpoint (phase 1: inventory and contract proposal)

*Chat C in the [procedural foundation plan](../../../PROCEDURAL_FOUNDATION_PLAN.md) (OS2). Branch `claude/fdn-c-conflict-085132`, from 9bbc51363. Phase 1 is read-only over `src/`: an inventory of every fight and contest owner, the PFP2 baseline and a contest contract proposal for after K and W v0. Everything below is a proposal under AD56 unless it cites an accepted code. Agent-verified at source level, not human-reviewed.*

## Status

- Phase 1 (inventory and proposal): sections 1 to 8 below, merged to master.
- **Phase 2 (contest v0 and first consumers): committed, section P2.** Status: **implemented, below floor** (AD43: no player route yet, FLR2 and FLR4 unmet). Agent-verified, not human-reviewed.
- **C's done check is not met yet.** One contest rule runs the Gu duel, both Hogwarts bouts and the wolf hunt, but only the wolves' damage reaches an L body store (the lifecycle cohort). People's hits land on W body holders' `vitality`, a quantity C's own pack declares; nothing writes `harm_state` or simulation vitals. It closes on L1 (an injure door on W bodies) or an adapter to L's people body once L names it.
- Owner doc from phase 2 on: [CONTEST_CONTRACT](../../../CONTEST_CONTRACT.md) (CFC1 to CFC16, codes kept from the proposal; CFC13 and CFC14 not built yet).

## P2. Phase 2: contest contract v0 on K and W (2026-11-12)

Branch `claude/fdn-c-conflict-085132`, after merging master at ea6a170dd (fast-forward). Plan sections read: sectioning (SC1 to SC10, PFP21), separate but connected (SB1 to SB6, NV1 to NV5, EF1 to EF8, PFP22 to PFP24), PG7; every sibling phase-1 checkpoint.

**What was built**

- `src/contest.js`: the contest runner. Each move is a kernel working (`kernel.working@1`, two operations `ready` and `release`) with roles `actor` and `target` of kind `entrant`, reread through `ports.read` at each step's time (KW3, KW6). One readiness clock with ties by id; noticing sets the opening; hard hits interrupt unfinished workings (KW8); costs paid as a working begins; typed outcomes; priced withdraw with pursuers recorded; yield accepted or refused by the other side's wants; side morale (`breakAt`); crowding; a referee limit (`limits.landed`); far detail by the same rule; odds by the same rule on keyed seeds; versioned save with nested kernel records.
- `src/contest_resolvers.js`: `strike` (reuses `combat_math` hit chance and damage spread), `notch` (reuses `notch_contest.winChance`), `layers` (reuses `gu_defense.resolveGuDefense`). A held guard adds to the target's defense against the objects it names (EF3).
- `src/contest_bodies.js`: the contest's substrate pack (`c.contest`, body quantities `vitality` and `stamina` until W adopts them), a body-holder helper, and `applyLifecycleIntents`, which calls `creature_lifecycle`'s own doors (`settleCohortStock`, `injureCreature`). PFP10 reason for the one direct import: L has no shared injure door yet (L1); this file is the only place C touches L.
- `src/contest_packs/gu_world.js` and `src/contest_packs/hogwarts.js`: the three consumers as rows. No code of their own beyond scene builders that list bodies and entrants.
- Docs: [CONTEST_CONTRACT](../../../CONTEST_CONTRACT.md); RULES_INDEX register and router rows; AREA_GUIDE "Fights and harm" foundation-path line.
- Not touched: `main.js`, `save_files.js`, `display.js`, every existing fight engine, every other chat's files. Nothing registers a domain; no save key changed (MC4 compatibility line: unchanged).

**The three consumers (calibrated to canon outcomes across seeds, AD49)**

| Code | Consumer | Canon fixed point | Result over 40 seeds (test floor) |
| --- | --- | --- | --- |
| FC1 | Fang Yuan against Wang Er and three hunters (RI vol. 1 ch65-70) | Moonblades at four parts each; Wang Er fights bow then fists and dies; the other hunters kneel | Fang Yuan wins at least 32 of 40, Wang Er killed at least 28, hunters kneel in at least half; every blade debits exactly four parts with a ledger source |
| FC2a | Snape against Lockhart, Duelling Club (CoS ch11) | Snape disarms Lockhart | Snape wins at least 36 of 40; the hit lands on `focus` (the wand), Lockhart's vitality untouched, outcome `yielded` |
| FC2b | Harry against Draco (CoS ch11) | Each lands a charm and Snape stops the bout | Stopped after two landed charms; no winner; both stood; composure or footing lowered |
| FC3 | Fang Yuan against about twenty crippled lightning wolves (RI vol. 2 ch122-123) | Twenty parts on Moonglow blades; the pack keeps working together until too many fall, then pulls away; the fight costs him about six health | Wins at least 34 of 40, pack routs at least 34, four to six wolves fall on average, mean health lost between 3 and 12 (measured 7.7 at the chosen dials); fallen wolves leave the lifecycle cohort through `settleCohortStock`; far detail gives the same result and totals |

Calibration dials named in the rows with reasons: wolf `kiteCrowd` 2, bite power 3, wolf attack 10; hunters `yieldAtSideHurt` 0.2; Snape notch 3 against Lockhart minus 1; charm amounts 40 so one charm does not end a duel.

**PFP2 counts, before and after phase 2**

| Count | Before | After | Note |
| --- | --- | --- | --- |
| Data cases | 36 | 40 | The 36 enemy templates, plus FC1, FC2a, FC2b, FC3 |
| Book-canon data cases | 0 | **4** | FC1, FC2a, FC2b, FC3, each rows over the shared contest |
| Bespoke scene modules | 24 | 24 | None retired yet. The authored packs FC1 and FC3 shadow (`book_gu_lead_early_duel`, `book_gu_lead_wolf_front`) stay until a player route crosses the contest, because the paused lead lives are gated on them (MC5) |
| Separate resolution engines | 5 | 5 plus the contest | The contest reuses three of them as resolvers; folding E2 and E3 onto it is phase 3 |
| Separate body stores | 7 | 7 plus W bodies | W body holders are where L1 should land |

**Checks (command, result, gaps)**

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/contest.test.js tests/contest_consumers.test.js` | 18 pass, 0 fail (after the starting-injury fix: a body that enters hurt fights impaired) | No player route; consumers run from fixtures |
| `npm run check:arch` | pass; main.js 10114 against baseline 10115; no new cycles | |
| `npm run check:rules` | pass; one pre-existing TMR1 warning in `book_world_hp_exams.js`; one stale private_packs glob | |
| `npm run build` | pass | No bundled module imports the contest yet |
| Full `npm test`, browser | not run | Integrator runs the full suite at merge (MC7); no player-facing change |

**Rescopes and changed meanings (with reasons)**

- **Folding moved to phase 3.** The phase-2 brief included folding the parallel engines; none is folded yet. Reason: `tempo_fight` is a live engine with schema-7 saved sessions, six opener files and a host panel; deleting any of it needs the contest wired to a player route first and a rebuilt-browser check (AGENTS verification, MC5 for the lead-life packs), which is a phase of its own.
- **CFC12 changed meaning.** The phase-1 proposal said far contests settle as one keyed draw on aggregate strength, matched to the detailed odds within 5 points. v0 instead runs every meeting with the same draws and only batches what it writes to the world, which gives exact equality with the near fight. It is cheaper on the world (one write per body) but not on compute: FC3 takes about 50 ms a fight and odds run 24 fights. The aggregate settle is backlog CB-13.
- **Two direct imports with reasons (PFP10).** `contest_bodies.js` imports `creature_lifecycle.js` (no L door yet, L1). `contest_resolvers.js` imports `gu_defense.js` for the layered-packet rule; that function names no Gu, so the request is for G to move it to a neutral file (G2). The SC9 test exempts only that file.
- **FC1 order differs from the book.** The end state matches (Wang Er dead, the hunters kneeling), but the first moonblade usually kills the hunter it hits, where the book has him caught in the arm, and Wang Er often falls before the hunters kneel. A wound outcome short of a fall (CB-14) would fix the order.

**What the rules could not express (new backlog rows)**

- **CB-7** A blade along a line (several targets in one release). FC3 gets its five falls from five blades; canon prose may mean one blade cuts more than one wolf. Needs a target shape on the effect grammar (SB3).
- **CB-8** Sun glare and place light. `use_sun` in the canon duel reads daylight; v0 entrants do not read place quantities into aim. Needs a read of W place quantities in the entrant view (W1).
- **CB-9** Referee stops are a count of landed hits, not an actor. A referee as a third side with a stop working is closer to the scene.
- **CB-10** Far equality holds only while no reactor answers a blow mid-fight. With reactors, far settlement loses mid-fight reactions by design; E should measure how often that matters.
- **CB-11** Wild cohort members fight as individual entrants (twenty wolf holders). A cohort entrant with a count and shared morale would be cheaper for a full wolf tide (CB-5).
- **CB-12** The chooser is C's default. A's wants-based chooser plugs in through `ports.choose`.
- **CB-13** Aggregate far settle: one keyed draw per contest on side strength, checked against the detailed odds within a tolerance dial, for NPC-on-NPC fights and a full wolf tide away from the player. E measures the far cost first (MC16).
- **CB-14** A wound short of a fall: a hit that lands a part injury and changes a want (the hunter caught in the arm kneels) without taking the body to zero.

**Requests (relay to owners)**

- **K · KB8**: `settleTogether` for several records in fixed order (deadline, then id). The contest does this ordering locally today; M is the second consumer that would promote it (PFP5). **K · KB3**: a refund row for costs paid at begin, so an interrupted killer move can refund by its own rule.
- **W4**: adopt `vitality` and `stamina` into `world_quantities.js` (unit `point`, 0 to 1,000,000); C writes them, L reads and writes them. **W1** (repeat): a view of place quantities (light, footing, noise) for a contest reader.
- **L1** (repeat): one injure door on W body holders, and the impairment ladder as a pure leaf. `harm_state.js` registers a domain on import, so C copies its fifths ladder as a dial instead of importing it.
- **A1**: a chooser for `ports.choose(law, record, world, id) -> {move, target, why}` reading wants and knowledge.
- **G, S**: adopt the Gu and Hogwarts rows into your packs when ready (SC5, SC9); C keeps only how moves meet.
- **G2**: move `resolveGuDefense` (layered packets, names no Gu) to a neutral file so the contest's resolver does not import a Gu file.
- **K · units**: confirm kernel step counts are unit-free. Contest workings count deadlines in ticks of a tenth of a second under `kernel.working@1`, whose KW5 text says minutes.
- **E**: measure far contest cost per fight (FC3 is about 50 ms) alongside MC16.

**Next phase (C phase 3)**

Fold the parallel fight engines onto the contest one at a time, deleting what it covers: first `tempo_fight` (its moves become rows, `tempo_starters` openers become contest scenes, `tempo_exit` and `tempo_allies` dials move into CFC11 and CFC15), then the saved native battles (E2) behind a compatibility line, then a player route for one consumer through a host so FLR2 and FLR4 can be met.

## 1. The engines that resolve fights today

Five ways a fight or contest is decided, plus one way it is not decided at all.

| Code | Engine | Files | How it resolves | Initiative and timing |
| --- | --- | --- | --- | --- |
| E1 | Upstream native combat | `models/combat.js`, `combat_math.js`, `damage_types.js`, `combat_stances.js`, `enemies.js`, `main.js` (`set_new_combat` to `end_combat`, `kill_player`) | Real-time attack loops per fighter; hit chance from attack points against evasion points (`get_hit_chance`), block, crit, elemental affinity, flat defense, typed mix scalar (`typedStrike`), `damage_taken` | Each fighter's cooldown from attack speed, on `engineTimeout` subticks (`plan_subticks`, `nextAttackTiming`) |
| E2 | Saved native battle sessions | `native_battle.js` (rival duel), `party_battle.js`, `cohort_battle*.js`, `feature_expansion_battle.js` (schemas 3, 4, 5), `audit_remainder_combat_objectives_*.js`, `audit_remainder_combat_fit_*.js` (schema 5 hooks), `conflict_frame.js`, `native_battle_contracts.js` | Turn-by-turn strikes in a simulation session, upstream strike math (`rollCombatStrike`, `mitigateCombatDamageFromStats`), paid through simulation commands | Fixed turn order per definition; draws from `legacyConflictRandom` (xorshift cursor, part of the saved replay contract) |
| E3 | Tempo fight | `tempo_fight.js`, `tempo_fight_domain.js`, `tempo_fight_contract.js` (schema 7), `tempo_allies.js`, `tempo_exit.js`, `tempo_location.js`, `tempo_starters.js` | Moves (jab, swing, guard, tend, withdraw, yield, order, plus stock moves shoot and reload) over upstream strike math, hit location into harm rungs, mishaps from conditions, allies with ranked goals who hear orders by chance, exits with a price | Speed and readiness queue (`nextActor`, `actingOrder`); an opening set by perception against stealth (surprise delay); keyed draws through `gen_kit` and `checkKey` |
| E4 | Notch contest | `notch_contest.js`, `social_contest.js`, LOTM `shotOdds` in `book_world_lotm_be_firearm.js` | One keyed logistic draw on a signed notch gap (`winChance`); social contest reads channel rows against resistance | None: one settle per attempt, the attempt index is the only clock |
| E5 | Gu activation and layered defense | `gu_activation.js`, `gu_defense.js`, `gu_move_search.js`, `gu_move_roles.js`, `gu_effect_chains.js`, `gu_procedures.js`, `gu_fighting_spirit.js` | Ordered stages and beats spend essence and emit effects; incoming packets pass through defense layers outside to inside, each spending capacity on what it can intercept | Beat order inside one activation; no opposing actor, so no meeting of two workings |
| E6 | Authored outcome | `world_packs/book_gu_lead_early_duel.js`, `book_gu_lead_wolf_front.js`, `book_gu_lead_hunt_followthrough.js`, `book_world_hp_lead_duel.js`, `cast_ability_adapter.js` (LOTM cast encounters) | Place acts or ordered moves with costs and fixed results. Nothing is drawn and nothing can go differently | Act order |

Supporting owners that every engine should reach but most do not: `defeat_domain.js` (the CBR2 publisher, eight typed outcomes), `pursuit.js` (leaving and following), `rival_memory.js` and `rehearsed_foe.js` (memory of past fights), `combat_review*.js`, `opponent_board.js`, `opponent_sheet.js`, `combat_opponents_domain.js` (observer-safe projection, AD8), `harm_state.js` and `harm_engine.js` (the body ladder), `creature_lifecycle.js` (`injureCreature`, `creatureHealth`).

## 2. PFP2 counts (baseline 2026-11-12)

**Counting rule** (so anyone can recount):

- *Data case*: a conflict resolved by a shared resolver with no code written for that case. A row in a shared table counts; a spec builder in its own file does not.
- *Book-canon data case*: a data case whose opponent and situation come from a book.
- *Bespoke module*: a file that writes the resolution, admission or aftermath of one fight or one scene.

| Count | Number | What is counted |
| --- | --- | --- |
| Data cases | **36** | Enemy templates in `enemies.js` (`enemy_templates[...] = new`), run by E1 with no per-enemy code. Upstream and fork content, none from a book |
| Book-canon data cases | **0** | No book fight runs through a shared resolver. The canon fights that exist (Fang Yuan against Wang Er and the boar, the wolf tide front, Harry's midnight duel passage, LOTM cast encounters) are E6, authored outcomes |
| Bespoke scene modules | **24** | Tempo openers with their own code: `book_world_lotm_fight`, `book_world_lotm_collector`, `book_world_lotm_constables`, `book_world_lotm_guard` (its fight part), `frontier_bow` (two openers, one file), `meadow_shell_combat`. Saved battles: `native_battle` (rival duel), `party_battle`, `cohort_battle` and its 4 sibling files counted as 1, `feature_expansion_battle`, `audit_remainder_combat_objectives_*` (4 files, 1 scene), `audit_remainder_combat_fit_*` (4 files, 1 scene), `field_care_battle`. Gu: `gu_keeper_defense`, `gu_hosted_wolf`, `gu_wolf_ridge`, `gu_wolf_scouting`, `gu_fighting_spirit`. Authored packs: `book_gu_lead_early_duel`, `book_gu_lead_wolf_front`, `book_gu_lead_hunt_followthrough`, `book_world_hp_lead_duel`, `book_world_lotm_cast_host` with `cast_ability_adapter` |
| Separate resolution engines | **5** (E1 to E5) | Plus E6, which resolves nothing |
| Separate body stores a hit can land on | **7** | Section 3 |

The first count should rise and the third fall (PFP2). The phase-3 target (default, adjustable): the three consumers in section 6 as book-canon data cases, and at least the tempo openers and the rival duel re-expressed as rows, which takes bespoke modules from 24 to about 16.

## 3. Where damage lands: seven bodies

The headline finding. A blow in each engine lands somewhere different, and none of these is L's body model yet.

| Code | Store | Written by | Read by | Notes |
| --- | --- | --- | --- | --- |
| B1 | Upstream fighter stats `health` on `character` and enemy objects | E1 (`models/combat.js`), `kill_player` | Native display, `combat_review` | Live object, not a save slice; the player's value syncs to B2 through the native adapter |
| B2 | Simulation vitals `{health, max_health, stamina, max_stamina}` per actor (`plan.vitals`, `simulation.people[id].vitals`) | E2 strikes, E3 at settle (`tempo_fight.js` line 140, clamped at health 1 or above), simulation `vital` effects | Admission checks ("needs recovery before another duel"), `simulationFacts` (`vital.*`, `target.vital.*`) | The nearest thing to a shared body today, but flat: no parts, no condition |
| B3 | `harm_state` parts, rungs (shaken, bruised, wounded, maimed, dying) and backlash carriers | E3 only, through `tempo_location.injuryFor` and `tempo_fight_domain` `harmPart`; LOTM harm wiring for power strain | `actionGate`, `actionModifiers` (CBR22: injury lowers control before it blocks a verb) | One global state for the player; world rows only for `book.lotm.tingen` plus defaults |
| B4 | Saved battle fighter records (hp inside the session payload) | E2, E3 during the fight | The battle view; copied back to B2 at the end | A third HP copy that lives only for the fight |
| B5 | `creature_lifecycle` health and injury (`injureCreature`, recovery minutes) | `gu_hosted_wolf`, meadow shell care | `meadow_shell_state` condition (the terrapin's fight spec reads it, but its fight does not write it back) | L's current body; no hit from any engine lands here |
| B6 | Gu operator aspects (mind, soul) from `injure-operator` backlash | E5 (`gu_procedures`, `gu_fighting_spirit`) | Gu procedure results | Self-harm from one's own working; no opponent can cause it |
| B7 | Gu defense layer capacity | E5 (`gu_defense`) | `gu_keeper_defense` trials | A shield's state, not a body, but the same idea as armor in E1 and E3 |

Also: cohort fighters bind a body through `cohortBodyBinding`; field care writes wound facts; enemies have no body after death beyond harvest (`damageRecord`).

## 4. Inventory by owner

Columns: what it stores (slice, schema), engine, body it lands on, kind of draw, whether the end goes through `defeat_domain`.

| Owner | Stores | Engine | Body | Draws | Defeat publisher |
| --- | --- | --- | --- | --- | --- |
| `models/combat.js`, `main.js` combat, `combat_math`, `damage_types`, `combat_stances`, `enemies` | Live Combat object; `snapshot()` of turns and loops for resume; enemy kill counts | E1 | B1 then B2 | `gameKeyedRandom` streams | Yes, unconscious only (`combatDefeat`) |
| `absorb_p23/combat_options` | `combatOptions` schema 1 (throw, smoke, lure; break requested) | E1 add-on | B1 | Host | Through E1 |
| `combat_review*`, `combat_readout`, `combat_focus`, `combat_subject`, `combat_log`, `opponent_*`, `combat_opponents_domain`, `ui/combat_*` | Review schema 1 (24 recent); weak maps for identity; no truth in projections | Readers of E1 | Read only | None | Not applicable |
| `native_battle` (Mara, `rival.native_duel`) | Session `nativeBattle` schema 1, rehearsed foe record, rival facts | E2 | B2 | `legacyConflictRandom` | `savedBattleLoss` |
| `party_battle` | Session schema 2 (`party.braced_contest`) plus party helper | E2 | B2 | Legacy | `savedBattleLoss` |
| `cohort_battle*` (5 files) | Schema 6, members, coaches, body binding | E2 | B2 via binding | `xorshift32` | Through host |
| `feature_expansion_battle`, `feature_battle_facts`, `world_completion_battle_validation` | Schemas 3, 4, 5 (shield, hook foes) | E2 | B2 | Legacy and keyed | `savedBattleLoss` |
| `audit_remainder_combat_objectives_*` | Objectives state, carried fittings | E2 schema 5 hooks | B2 | Keyed | Through host |
| `audit_remainder_combat_fit_*` | Grip, harness, rope practice | E2 schema 5 hooks | B2 | Keyed | Through host |
| `field_care_battle` | Wound watch facts | E2 add-on | Facts, not a body | None | Through host |
| `tempo_fight*`, `tempo_allies`, `tempo_exit`, `tempo_location`, `tempo_starters` | Session `nativeBattle` schema 7, fighters, conditions, log (12 lines), held stock | E3 | B4 then B2 and B3 | Keyed (`drawFraction`, `checkKey`) | `savedBattleLoss` |
| Tempo openers (6 files, 7 openers) | Each its own slice or facts (`lotm_guard@1`, `constables@1`, heat acts) | E3 | As E3 | Keyed | As E3; aftermath read back from the fight log because openers have no end hook |
| `meadow_shell_combat`, `meadow_shell_state` | Shell condition from lifecycle and living regulator | E3 | Reads B5, writes B2 only | Keyed | As E3 |
| `notch_contest`, `social_contest` | Nothing (pure) | E4 | None | Keyed | No; caller decides |
| `book_world_lotm_fight` and `book_world_lotm_be_firearm` | Loaded rounds (FD3), light and fog from the clock (FD9) | E3 with E4 shot odds | As E3 | Keyed | As E3 |
| `gu_activation`, `gu_defense`, `gu_move_search`, `gu_effect_chains`, `gu_fighting_spirit` | Nothing; hosts publish | E5 | B6, B7 | Control draw supplied by host | No |
| `gu_keeper_defense`, `gu_hosted_wolf`, `gu_wolf_ridge`, `gu_wolf_scouting` | Keeper facts per scene | E5 plus scene code | B5 (wolf), B7 | Scene keyed | No |
| `book_gu_lead_early_duel`, `book_gu_lead_hunt_followthrough`, `book_gu_lead_wolf_front` | Structured pack extensions with fact and knowledge effects | E6 | None (essence and items only) | None | No |
| `book_world_hp_lead_duel` | Place acts over the school anchor | E6 | None | None | No |
| `cast_ability_adapter`, `book_world_lotm_cast_host` | Ordered encounter moves with costs and results | E6 over `runConflictFrame` | Effects only | None | No |
| `defeat_domain` | Defeat state, death causes | Publisher | Not applicable | None | Is the publisher |
| `pursuit` | `simulation.pursuits` | Its own | None | Evidence-led | Not applicable |
| `rival_memory`, `rehearsed_foe` | Actor facts; power record | Readers at fight start | None | None | Not applicable |

Existing accepted rules every engine already owes and that the contract must keep: CBR1 to CBR30 (accepted 2026-10-18, [DOMAIN_RULES](../../../DOMAIN_RULES.md#combat-rules)), AD8 (learned opponent numbers), AD19 (forgiving recovery), AD20, AD25, AD28, AD38, AD50, BHR11, BHR13, BHR15, BHR17, BHR18. The palette is [combat and conflict considerations](../../../COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md); its 2026-10-17 owner map is [C1](../combat-2026-10-18/C1_OWNERS_AND_ENGINE.md).

## 5. Contest contract proposal (CFC1 to CFC14)

Base, not a fresh design (PRF5): E3 already has initiative, notice, conditions, hit location, allies, priced exits, policy play and keyed draws. The contract lifts that shape off its fixed move list and onto K workings, takes E4 and E1 math as interchangeable resolvers, and routes every end through `defeat_domain`. Each line is a default, a dial and a reason.

**Shape**

- **CFC1 · A contest is workings that meet.** A contest binds two or more actors on sides, each running a K working whose roles can name another actor or that actor's working as a target. A Gu killer move, a cast, a sword cut, a bite and a shouted order are all workings; the contest adds only who meets whom, when, and what the meeting does. Default: two sides; dial: any number of sides (a three-way brawl, a beast that attacks both); reason: wolves and rivals do not take sides by rule.
- **CFC2 · Resolution is a named resolver chosen by the world pack.** The contest calls one resolver per meeting: `strike` (E1 attack points against evasion, the upstream feel), `notch` (E4 logistic on a notch gap, LOTM and social), `check` (dice checks for D&D), `layers` (E5 packets through defense layers, Gu), or `opposed-working` (two workings compared on what they actually do, a disarm against a shield charm). Default: the world's combat grammar row (W2 K10) picks it; dial: a working can name its own (a gun uses `notch` inside a `strike` world); reason: worlds differ in how fights feel (AD5, "each world picks its own systems").
- **CFC3 · Moves are data.** E3's `TEMPO_MOVES` become rows: what the move costs, its readiness, which resolver it uses, what it can target, what it leaves open. Stock moves (shoot, reload) already prove the shape. A canon technique becomes a row plus the K working it runs.

**Timing and initiative**

- **CFC4 · One readiness queue across all workings.** Each actor carries readiness; each move adds its time cost; the lowest readiness acts next (E3 `nextActor`). E1's real-time cooldowns map onto it (cooldown in seconds is readiness). Default: E3 speed 100 base; dial: per world and per body; reason: one queue lets a Gu move, a wolf's lunge and a spell share a clock without join code.
- **CFC5 · The opening comes from noticing.** Perception against stealth decides surprise (E3 `aware`), read from W quantities (light, noise, cover) instead of the fight's own `conditions` copy. A hunt or ambush is this rule with one side unaware. Default: surprise delay from E3 dials; reason: who notices first sets the fight (LSD341).
- **CFC6 · A working can be interrupted.** A multi-step working (a killer move's beats, a long cast, a reload) can be cut by a hit that lands before its last step. What it already did stays done (LT31's rule for supports, the plan's PFP7 join), what it reserved is refunded or lost by its own row. Needs K (request K2).

**Landing on bodies and the world**

- **CFC7 · A landed hit is an effect on a body, through L's door.** The resolver returns a typed hit `{target body, part or slot, kind (cut, crush, burn, essence, mind, soul), amount, cause chain}`. L turns it into condition: rung, part, stamina, bleeding, loss of a faculty. B1 to B6 collapse onto one body record over time; B2 stays as L's flat projection for old callers. Default: E3 slots and harm rungs as the first mapping; dial: world body plans (a Gu worm has no arms, a wolf has four legs); reason: one injury must mean the same thing in a fight, a fall and a failed brew (OS5).
- **CFC8 · Costs and side effects land on W quantities.** Stamina, essence, ammunition, wand focus and loaded rounds are spent through K costs on W quantities. Each meeting also publishes effects into the place: noise, blood scent, light, broken cover, a body down. Present things react through their own law (the smell draws other beasts, as the boar act already says in prose). Default: cascade depth from W; reason: emergence without join code (O3).
- **CFC9 · Lethality is a dial, not a hidden clamp.** E3 clamps health at 1; E1 makes defeat unconsciousness. Both become the world's lethality dial plus the player's recovery setting, which stay separate (CBR5, CBR6, AD19). Default: the current behaviour (no death in ordinary fights); reason: keeps today's saves and play unchanged until a world asks.

**Ends: retreat, surrender, outcomes**

- **CFC10 · Every end goes through the defeat publisher with a typed outcome on both sides.** The eight `DEFEAT_OUTCOMES` for the loser and the CBR3 outcomes for the winner (killed, knocked out, let go, surrender accepted, captured, drove off). The contest ends when one side has no actor willing and able to continue; willingness comes from A's wants (morale, fear, goals as in `tempo_allies`). Default: E3 `tempo_exit` dials for leaving and yielding; reason: CBR2 says every path calls one publisher, and today E4, E5 and E6 do not.
- **CFC11 · Leaving is an attempt, accepting surrender is a choice.** Withdraw, flee, yield and parley are moves with a priced chance (E3 `leaveChance`, `yieldChance`), and the other side answers from its own goals: a wolf pack does not accept surrender, a sect elder may, a starving predator follows (`pursuit.js` takes over after contact breaks). Default: E3 dials; dial: a means that makes escape free works (CBR25, AD55); reason: "leaving a live fight is a choice with a cost by default".

**Away from the player**

- **CFC12 · Far contests settle coarsely to the same distribution.** Near the player, the contest runs move by move. Away, it settles as one keyed draw per contest on aggregate strength (notch gap of the sides, with conditions), producing the same typed outcomes, injuries by expected rung and costs by expected spend. Two properties, each a test: (a) the same key gives the same outcome after a reload or a split time jump; (b) over many seeds the coarse odds of each outcome match the detailed odds within a tolerance dial (default 5 percentage points). Away combat still stops at the CBR27 conditions (downed, lasting-harm risk, a new kind of enemy). Reason: PFP12 and SPR28, "near is detailed, far is rates", and A's NPCs need to fight each other cheaply.
- **CFC13 · Fights are evidence for both sides.** Each meeting writes what each side observed (an exact readout only where AD8 allows), into N or the existing knowledge owners (MC8), and memory into the actor (as `rival_memory` does for Mara). Deception writes wrong beliefs, not wrong truth (CBR15, CBR16).
- **CFC14 · Conflict is wider than fighting.** A debate, a haggle, an intimidation or a trial is the same contest with the `notch` resolver over social channels and with condition landing on standing or composure instead of a body (CBR30; `social_contest.js` is the first non-violent consumer).

**Save shape (MC4, OS8).** One session slice under K's versioned save shape: contest id, sides, actors by body id, readiness, open workings, log, result. Compatibility line for phase 3: E2 legacy sessions with `legacyConflictRandom` keep their schemas until each is re-expressed; re-expressed fights reset open sessions with a reason (old saves are disposable by standing direction).

## 6. First consumers after K v0

Each is a book-canon data case: a row set over shared rules, no file of its own. Done check for each (default): the fight runs from a fixture through the contest rule, damage lands on L's body, the end goes through `defeat_domain`, and a reload mid-fight reproduces it.

| Code | Consumer | Canon anchor | Actors and workings | Replaces | What it proves |
| --- | --- | --- | --- | --- | --- |
| FC1 | **Gu duel: Fang Yuan against Wang Er** | Reverend Insanity vol. 1 ch65 to 70 (today's E6 acts `close_gap`, `duck_arrow`, `use_sun` in `book_gu_lead_early_duel.js`) | Fang Yuan's Moonlight Gu as a K working with essence cost (resolver `layers`, moonblade packet), Wang Er's bow as a `strike` working with ammunition; sun glare as a W light quantity that lowers aim | The duel acts of the early duel pack | Two resolvers in one contest; a Gu activation meets a mortal weapon; essence spent from W; the outcome can differ for a stated reason (no moonlight, an arrow that lands) |
| FC2 | **Hogwarts duel: the Duelling Club** | Chamber of Secrets ch11 (hp2 in the library index). Book 1's midnight duel never happens in canon; `book_world_hp_lead_duel.js` is a passage, not a fight, so it stays a passage | Harry and Draco, then Snape and Lockhart; casts as S's spell workings (Expelliarmus, Rictusempra, Tarantallegra, Serpensortia) meeting through `opposed-working`; a Disarming hit lands on the wand (a held instrument), a Tickling hit on L's body as a condition, not damage | Nothing yet (new consumer) | Spells meet spells; a hit that lands on an item or a condition, not health; a supervised duel ends by a referee's stop (an outcome with no defeat state) |
| FC3 | **Wolf hunt: the wolf tide front** | Reverend Insanity vol. 2 ch122 to 123 (`book_gu_lead_wolf_front.js`, E6 today); lightning wolves as L creatures | A wolf pack as L cohort actors choosing through A (hunger, pack morale), a defender with Gu; ambush through CFC5; wolves flee when morale breaks, the pack follows wounded prey through `pursuit` | The wolf front acts; later `gu_hosted_wolf` and Frontier's boar opener | Many-sided contest; creatures on the player's rules (PFP11); damage on creature bodies (B5) and the player's; coarse settlement of the parts of the tide the player is not in |

## 7. Requests to other chats (PFP4)

Sent as a note in the shared notes folder; owners decide.

- **K1** · Several workings settle in one receipt, in a fixed order, so a meeting of two workings is one settlement.
- **K2** · A working can be cut partway by an outside input; steps already settled stay, reserved costs follow the working's own refund row.
- **K3** · Roles can bind another actor or another actor's running working as a target.
- **K4** · A readiness or time-cost field on steps that a contest can order across workings.
- **W1** · Place quantities a fight reads: light, noise, footing, cover, weather (today copied into E3 `conditions`).
- **W2** · Effects a fight publishes: blow landed, noise made, blood or scent, body down, cover broken; with the cascade limit and fixed order.
- **W3** · Quantity accounts for stamina, essence by kind, ammunition and focus that K costs draw from.
- **L1** · One injure door for people, animals and Gu: `{body, part, kind, amount, cause}` to condition, with body plans per kind; B2 kept as a projection.
- **L2** · A readable condition for fight admission and morale: able to act, impaired, downed, dying (CBR5).
- **A1** · Wants that decide continue, flee, yield or accept surrender, and a policy for actors the player does not drive.
- **G1** · Killer moves exposed as K workings with their beats as steps, so CFC6 can interrupt them.
- **S1** · Spells as K workings with a target role and an `opposed-working` comparison (what a shield charm stops).

## 8. What the rules could not express (backlog rows)

- **CB-1** E1's real-time loop and E3's queue are not yet the same clock. Mapping cooldowns onto readiness keeps the upstream feel only if the native view still animates bars; needs a UI decision at embed time.
- **CB-2** E2 legacy sessions carry an exact draw-count replay contract. Re-expressing them changes their outcomes for the same seed; each one needs a compatibility line, not a migration.
- **CB-3** E5 has no opponent. Gu layered defense against an incoming killer move needs both sides' beats on one queue (K1, K4) before FC1 can show a defense Gu answering an attack.
- **CB-4** Hits on items and on conditions (disarm, tickle, petrify) have no owner today; CFC7 routes them to the item or L, but the item side (F) is not asked yet.
- **CB-5** Mass fights (the full wolf tide, sect wars) need a level above the contest: cohorts as single actors with strength and morale. Proposed for after FC3, with M and PG7.
- **CB-6** Tempo openers have no end hook, so aftermath is read back from the log (collector, constables). The contract's typed outcome replaces the readback.

## 9. Checks run

| Command | Result | Gaps |
| --- | --- | --- |
| `git merge --ff-only 9bbc51363` | Pass; branch now starts from the shared commit | Branch was 37 commits behind at session start |
| Read of `src/` combat, contest, harm, Gu and pack owners (grep and file heads, about 60 files) | Inventory above | Read by excerpt, not line by line; E2 schema hooks summarized, not traced |
| Link targets in this file checked by path | Pass | Anchor fragments not machine-checked |
| `npm test`, `check:arch`, `check:rules` | Not run | Docs-only change under the dispatch folder; no rule codes registered |

## 10. Next phase

After K v0 and W v0 are on master: write the contest contract as code over K (a contest runner and resolver registry), port E3's moves to rows, build FC1 first (smallest, two resolvers), then FC3, then FC2 once S exposes spell workings. Retire bespoke tempo openers into rows as each becomes expressible. Stop at the plan's done check for C: one contest rule runs FC1, FC2 and FC3 with damage on L's bodies.

```receipt
build: n/a
route: n/a
state: drafted
viewport: n/a
persistence: unchanged
tests: docs only
review: diff-scoped
surface: conflict inventory and contest contract proposal; no runtime change
```
