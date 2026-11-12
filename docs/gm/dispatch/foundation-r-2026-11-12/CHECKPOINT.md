# Foundation R · Progression: checkpoint

*Chat R in the [procedural foundation plan](../../../PROCEDURAL_FOUNDATION_PLAN.md) (OS3, MC13). Phase 1, inventory and contract proposal, 2026-11-12. Branch `claude/fdn-r-progression-668868` from 9bbc51363. Everything below the inventory is a proposal under AD56 (it widens play) and stays adjustable; nothing here is accepted.*

```receipt
build: n/a
route: n/a
state: drafted
viewport: n/a (docs-only inventory and contract proposal)
persistence: unchanged
tests: none run; docs-only (check:rules)
review: none
```

**State:** phase 1 done (docs only). No runtime code touched. Save compatibility (MC4): unchanged.
**Next phase:** embed, after K v0 and W v0 are merged to master. Start with the three first consumers in [the last section](#first-consumers-after-k-v0).

## What R covers

Advancement read as one shape: a holder stands at a position on a path; progress accrues toward the next step; a step opens when its gate is met; crossing may be an attempt with risk; crossing costs something and changes the holder. Per AD46, progression is any lasting improvement, so a path can be a rank, a sequence, a skill level, a credential, a study year or a Gu's own rank.

## Inventory

Reads by three bounded readers, then spot-checked by hand (file and line checks below). "Data" means rows run by shared code; "bespoke" means a module or scene that hard-codes the step.

### Shared pieces that already exist (build on these, do not fork)

| Piece | File | What it does | Importers in `src` |
| --- | --- | --- | --- |
| Path descriptor (ASC) | `src/ascension_paths.js:32` `definePath`, `:45` `pathView` | Ordered stages, each with typed crossings (`quota, structure, insight, trial, ingest, digest, consume, recognition, bodyPoint`), grants, failure signs; six shapes (ladder, tree, web, wheel, stack, field); `known` and `ceiling` for observer views. Stores nothing | 13 |
| Ladder rows and transitions (L10) | `src/ladder_holdings.js:18` `pathFromLadderRow` | A held ladder is a row; swap, branch, demote and wrong-order transitions with costs and a failure hook | 2 (structured packs) |
| Ladder surface | `src/structured_ladder_view.js` | A pack declares `presentation.ladders` with a path, a position fact and fact mapping; returns observer-safe views | 2 |
| Gate descriptor (GTR) | `src/progression_gates.js:38` `defineGate`, `:62` `evaluateGate` | Gate kind, `requires` rule, reason, costed routes, dials, overflow policy, persist or revocable; pure read with knowledge-filtered hints | 8 |
| Rule evaluator | `src/rules.js:3` `evaluateRule`, `:44` `chooseOutcome`, `:69` `resolveOnce` | Fact rules, caller-supplied draws, JSON-safe receipts | many |
| Breakthrough attempt | `src/breakthrough_trial.js:16` `defineTrialRules`, `:40` `attemptBreakthrough` | Permille risk by tier, pressure, stability, scars, paid units; floor; setback on failure; slice `progression.trial@1` | 3 |
| Overflow bank | `src/skill_overflow_domain.js:39` `settleCappedSkillGain` | Per-world policy for gains a cap rejects (banked, lost, converted) | 2 |
| Display forms | `src/progression_forms.js:14` | Figure registry (ladder, graph, list) | 0 in production (test only) |

### Advancement systems in `src`

| System | Where | Advances | Stored as | What gates a step | Cost and risk | Data or bespoke |
| --- | --- | --- | --- | --- | --- | --- |
| Upstream skill levels | `src/models/skill.js:175` `add_xp`, `:204` curve; `src/components/levelable_component.js:66,112` | Level per skill | `skill_progress[id]` `{current_level, total_xp, xp_to_next_lvl, ...}` | Cumulative XP `base·(1−s^n)/(1−s)`, base 40 and scale 1.8 by default; per-gain cap 0.1 of next level (`src/config.js:29`); child skill capped by parent | Time spent; no risk | Data: 65 skills in `src/data/skills.js` on one curve |
| Character level | `src/components/levelable_component.js:66` | Level | Levelable `current_level`, `total_xp` | Same curve, base 10, scale 1.6 | None | Data (one curve) |
| Skill milestone perks | `src/skill_ladder.js:32-78` | Perks derived from levels | None (title `sound_sleeper` in `character.titles`) | 4 hard-coded rows (Sleeping 3, 5; Patience 2, 4) | None | Bespoke |
| Skill rust and overflow | `src/skill_records.js`, `src/skill_overflow_domain.js` | Penalty and bank, not steps | Slices `{schema, tracked, rustOn, nearMisses}`, `skill_overflow` | Per-world dial rows (Frontier) | Rust never lowers `total_xp` | Data, 1 to 2 world rows |
| Faction rank | `src/faction_rank.js:31` `rankOf`, `:90` `rankChange` | Rank from reputation | Caller-owned reputation | `DEFAULT_LADDER` 6 rungs (−inf, 0, 10, 50, 200, 1000); 3 region overrides | None; lesson fee discount | Data |
| Titles | `src/titles.js:84,89` | Earned title | `character.titles` | Counter thresholds, about 40 rows | None | Data |
| Body traits | `src/body_progression.js:94,100` | Trait supersession (Frail to Steadier frame) | `body.*` knowledge keys | Command requirements | None | Data, 6 traits |
| Frontier tempering | `src/pledges.js:123-129` over `breakthrough_trial.js`; dials `src/pledges_content.js:29` | Tier, Raw to Seasoned (4 stages) | `{pressure, last, stage, attempts, learning}` | Progress per tier | Risk 300, 450, 600 permille; floor 50; tribulation from tier 2 with 2 waves; up to 5 ration units at −60 each | Data rules, shared attempt |
| Frontier vessel discipline | `src/absorb_p23/world_adaptation/discipline.js:22`; `src/vessel_mantras.js:23`; `src/vessel_forks.js:22`; cap `src/cultivation_guidance.js:14` | Law depth, comprehension, mantra tier | `worldAdaptation.techniques.discipline` | Law cost `1000·2^depth`, comprehension `16·2^depth`; mantra `500·2^(t−1)` and `16·4^(t−1)`; fork needs 48 breath and 48 settling minutes; depth cap 40 | Resource and time | Bespoke formulas in code |
| Mistglass method tracks | `src/ascension_paths_mistglass.js` | Breath and settling stages | Pack facts | ASC crossings | Practice | Data, 2 paths |
| Shadow Slave rank | `src/ascension_paths_ss.js:12`; `src/world_packs/book_shadow_slave_trial.js` | Unwoken to Unbound | Pack position fact | Trial crossings | Trial | Data: 3 modelled steps, 3 placeholders |
| LOTM Seer Seq 9 and 8 | `src/book_world_lotm_path.js:13` `seerPathway`, `:33`; acts `src/book_world_lotm_actions.js:36,141` | Ordinary, Seq 9, Seq 8 | `actors.player.facts['book.lotm.*']`, resource `book.lotm.acting`, `state.lotm` envelope | Digestion `LOTM_DIGEST_ACTS = 6` (`src/book_world_lotm_ids.js:21`, verified); assessment; exam needs a deacon present | Attention per act, minutes, dose item | Bespoke ladder literal and commands |
| LOTM pathway rows | `src/book_world_lotm_pathways.js:17-87`; rows `src/book_world_lotm_rows.js:14,40,64` | Seq 9 and 8 per pathway | `book.lotm.<key>.acting`, `lotm.<key>.*` | Digest 4 acts (`LOTM_CC_ACTS`, verified), attention, church home, examiner | Attention, dose, minutes | Data: Corpse Collector, Savant, Sailor |
| LOTM generated rows | `src/book_world_lotm_generated.js:21,39,63`; `src/book_world_lotm_sun_rows.js:7` | Seq 9 and 8 | Same pattern | Digest 4; Seq 8 digestion not offered (`:45` gap text, verified) | Dose | Data: Spectator, Sun; abilities missing |
| LOTM Seq 7 | `src/book_world_lotm_seq7.js:19-51`; rungs and abilities from the private pack via `src/lotm_advancement.js:14,43` | Clown to Magician | Fact `seq7.promoted`, source `book.lotm.adv.magician` | Clown digested (6 acts), Magician dose | Dose; exam dropped | Bespoke module, pack-fed rungs |
| LOTM loss of control | `src/book_world_lotm_causes.js:16-55`; `src/book_world_lotm_harm.js:8-75`; carrier row `src/harm_state.js:37-58` | Pressure toward loss | Harm engine carrier | Stages 3, 6, 9 (lost); rest 0.25 per hour, treated 1 per hour; grace 30 minutes | Deterministic accrual, not a roll | Data carrier row, bespoke causes |
| LOTM merit and posts | `src/book_world_lotm_merit.js:15`; `src/book_world_lotm_positions.js:27,100` | Merit, post labels | `resources['book.lotm.merit.nighthawks.*']` | Missions earn 1 or 2 merit; merit gates store purchases only, not promotion | Time | Data, partly wired |
| Gu Master aperture | `src/world_packs/book_gu_keeper.js:12` `KEEPER_DIALS`, `:45`; `src/book_world_gu_keeper_domain.js:76,89` | Primeval essence reserve | `state.simulation.energies.player['book.ri.keeper.primeval']` | Full sea 24; aptitude 50% gives capacity 12; regen 1 per hour; aperture is a faculty flag | Gu use draws essence (`src/gu_fuel.js`) | Data dials; rank is a display string |
| Gu Master rank and sub-stage (Fang Yuan) | `src/world_packs/book_gu_lead_rank_two.js` and 17 other lead scenes | Rank One peak to Rank Two initial, middle, upper, Rank Three initial | Per-scene facts `actor.<scene>.aperture_stage` and `reserve_grade` as strings | Hard-coded per scene: 38 parts to crack the wall, refill to 44, scene predecessors | Essence, stones, time | Bespoke: 18 scene files set stage strings by hand |
| Gu worm rank by refinement | `src/gu_refinement.js:10,71`; Fortune Thread 6 to 7 `src/gu_keeper_refinement.js:17-110`, `src/world_packs/book_gu_keeper_immortal_advancement.js` | A Gu's own rank | `state.attempts[]`, `state.stocks[refiner]` | Precursor rank below recipe rank; recipe stages | Luck sand, minutes, quench risk 0.5 on a seeded fraction | Shared engine plus a bespoke rank-7 module |
| Gu rank gap | `src/gu_fuel.js` | Output and risk by rank gap | None | Factor `2^(gu.rank − supply.rank)`, control risk `min(1, gap·0.25)` | Risk | Data formula (GTR32 shape) |
| Keeper rank practice | `src/world_packs/book_gu_keeper_rank_trial.js` | Practice with a rank-two Gu on rank-one essence | Knowledge notes | Aperture active; fuel quote | Control risk from the gap | Bespoke scene over shared fuel |
| Cultivation root and intents | `src/cultivation_root.js:5-10`; `src/cultivation_intents.js` | Root flow and still 0 to 4; insights | Lineage; `facts['cultivation.intent.*']` | Earned evidence; reflection 15 or 5 minutes | Retune transfer | Data, small |
| Mother of Learning study | `src/mol_zorian_study_months.js:19,27,68` | Study month 1 to 6 | `actors.player.completed[...]`, knowledge, `state.motherOfLearning.runStartedAt` | Month-end event, departure plan, on-time check | Time | Bespoke gating over generated ids |
| Harry Potter lessons and spell | `src/book_world_hp_lessons.js:22-82`; `src/lesson.js:9,16`; `src/book_world_hp_school_calendar.js:8` | Spell mastery (levitation), brew chance | `simulation.powers.player['book.hp.lead.levitation']` | Failure 0.6 minus 0.1 per practice, floor 0.05; brew `0.5 + 0.02·xp`, cap 0.95; study bonus 0.1 | Lesson time | Data rows, bespoke view; school year does not advance |
| D&D | `src/dnd_levitate.js:34,107,129,161`; `src/dnd_phandalin.js:8` | Spell slots only | Local slots | Rest refills | Slot use | No level, no XP, no level-up step |
| Route expertise | `src/trial_expertise.js:8-10` | Steadiness per route, cap 3 | `state.trial.routeLessons` | Failed tasks teach | None | Data, small |
| Life stage learning | `src/life_experience.js:9-10` | Learning rate by age | `c.knowledge[...]` | Age bands 25 and 65 | None | Data, 3 lessons |
| Rank-gap perception | `src/rank_gap_observer.js:64-100` | What an observer can read across a rank gap | Slice `rankGapObserver` | Tiers 0 to 3, 8 dials | Strain | Data (GTR35 shape) |

Not traced: `src/book_world_lotm_cast_host.js`, `src/book_world_lotm_ui.js`, `src/feature_expansion_book_cultivation.js`, `src/home_cultivation*.js`, Hogwarts exams (`src/hp_exam_model.js`). They may hold more steps; phase 2 re-measures with the commands below.

### Defects and duplication found

- LOTM digestion is re-derived in five places (`book_world_lotm_path.js:55-59`, `book_world_lotm_actions.js:141-142`, `book_world_lotm_pathways.js:46-47`, `book_world_lotm_generated.js:64`, `book_world_lotm_seq7.js:44`).
- Two LOTM ladder sources (the `seerPathway` literal and `pathwayDescriptor`) and three read models for one ladder (`ascension_paths.pathView`, `ascension_graph.graphView`, `pathway_requirements.requirementLadder`).
- Fang Yuan's rank and sub-stage live as prose-valued facts copied scene to scene; no path holds his position, so a variant life cannot reach Rank Two another way (against AD38 and GTR2).
- Two attempt shapes: `breakthrough_trial` (permille against a roll) and the Gu quench (seeded fraction against 0.5). The Gu rank-two wall crack has no attempt at all, only a scripted failure.
- Accrual has no shared owner: XP, digestion acts, essence regen, practice minutes and merit each count their own way.
- Merit is recorded but no promotion reads it, though the comment says canon does.

## PFP2 counts (phase 1 baseline)

| Count | Value | How measured |
| --- | --- | --- |
| Canon advancement steps run as data through shared code | 88 | 65 upstream skills on one curve (`grep -cE '^\s*skills\["' src/data/skills.js`); LOTM 10 Seq 9 and 8 steps from 5 rows (`book_world_lotm_rows.js`, `book_world_lotm_generated.js`, `book_world_lotm_sun_rows.js`; 2 lack Seq 8 digestion); faction rank 5 steps above the floor (`DEFAULT_LADDER`); Frontier tempering 3 steps (`pledges_content.js:29`); Shadow Slave 3 modelled trials; Mistglass 2 tracks, counted as 1 step each (stages per track not tallied). Small rows (cultivation insights, titles, body traits) are left out |
| Bespoke advancement modules or scene files | 24 | 18 Gu lead scenes setting `aperture_stage` or `reserve_grade` (`grep -rlE "aperture_stage\|reserve_grade" src/world_packs \| wc -l`); LOTM Seer literal and acts, Seq 7 module (2); Keeper rank trial and Fortune Thread rank 7 (2); `skill_ladder.js` (1); MoL study gating (1) |
| Path descriptors on the shared ASC seam (production) | 6 call sites | `grep -rnE "definePath\(" src` minus fixtures and the definer: LOTM Seer, LOTM pathways, LOTM pack, Mistglass, Shadow Slave, ladder rows |
| Gate descriptors in use | 5 | `grep -rnE "defineGate\(" src \| grep -v "export function" \| wc -l` |

The data count is mostly upstream skills, which is one curve, not 65 mechanisms. The measure that matters for R is mechanisms per path shape: today there are at least seven ways to hold a position (skill_progress, levelable, facts with prose values, resource counters, pack position facts, trial slice, energies) and two attempt shapes.

## Contract proposal (R v0 draft)

Labels R-1 to R-14 are local to this checkpoint, not registered codes. Proposal under AD56; every number is a pack dial.

### The path row

A path stays an ASC descriptor (`definePath`), extended rather than replaced. A path row in a world pack:

```js
{
  id: 'ri.gu_master', world: 'book.ri', label: 'Gu Master rank', shape: 'ladder',
  holder: 'body',                     // body | actor | thing | institution record
  stages: [ { id, label, grants: [...], crossings: [...], step: {...} } ],
  tracks: { essence_purity: {...} },  // accruals the steps read
  dials: { wallParts: {default: 38, reason: 'aperture wall strength at rank one peak'} }
}
```

- **R-1 · A path is data on the ASC seam.** Stages, crossings, grants and failure signs stay in `ascension_paths.js`. New canon costs a row (PFP1). Sub-stages (initial, middle, upper, peak) are stages, not strings.
- **R-2 · One position store, owned by the holder's owner.** R owns the rule; the position lives where the holder lives: a body's path in L's body record, an actor's in the actor facts, a Gu's rank on the Gu (G), a credential in the issuing institution's record (GTR25, M). R defines the shape `{path, revision, position, since, tracks}` and one validator; owners store it in their slice.
- **R-3 · Tracks accrue toward a threshold.** A track is a named amount (XP, digestion, comprehension, purity, merit) with a source rule: a rate over a fact (per hour of practice), or a count of events (an acting act that fits the potion's principle). Thresholds are dials or expressions over facts (GTR30: the skill curve, `1000·2^depth`). Overflow names its policy (GTR16, GTR29), reusing `skill_overflow_domain`.
- **R-4 · Accrual is time-partition invariant.** A track settles to the same value whether time passes in one jump or many (K's done check, PFP12). Rates integrate over the elapsed span; event counts settle per event; caps apply after integration with overflow per R-3.
- **R-5 · A step's gate is a GTR descriptor.** Each stage's `step.gate` is a `defineGate` row of the right kind (capacity, knowledge, credential, resource, maturation, social), read with `evaluateGate` over facts the caller supplies. Routes around it are costed (GTR4). Evaluation is a pure read (GTR14).
- **R-6 · Crossing is a K working.** Opening a step is quoted and settled through K's working: roles (holder, teacher, examiner, materials, place), costs, an optional attempt, and a receipt. Admission is checked at quote; admitted attempts keep their quote (GTR11). Opening stages and publishes after the save (GTR12).
- **R-7 · Attempts share one risk shape.** `breakthrough_trial` generalises: base risk per stage, modifiers from named facts (pressure, stability, scars, rank gap, digestion left), paid units that buy risk down to a floor, a caller-supplied draw through `chooseOutcome`, and an outcome ladder (pass, setback, damage, loss). The floor is a dial with an in-world reason; a world may set it to 0. Deterministic accrual risks (LOTM pressure) stay accruals, not rolls.
- **R-8 · Costs and changes are effects, not writes.** A step lists what it spends (essence, a dose, stones, merit) and what it changes (grants, capacity, rate, new tracks, a flaw attached, a rival path closed, GTR34). R publishes these as W effects and quantity changes; L applies body changes, G applies Gu changes, the holder's owner moves the position.
- **R-9 · Risk outcomes land on bodies through L.** A cracked aperture, loss of control or a heart-demon scar is a published effect L applies to the body (OS5). R never writes a body.
- **R-10 · Observed is not true.** The holder's true track and position are separate from what they can measure (GTR10, GTR15). A Seer feels digestion as signs; a Gu Master reads his sea; a player reads an XP bar. The path row names, per track, the observation form and which knowledge entry unlocks a sharper reading.
- **R-11 · NPCs walk the same paths.** An NPC's breakthrough reads the same row, gate and attempt (GTR20, PFP11). Far from the player, a path settles as a rate to the same expected position (PFP12).
- **R-12 · Paths can be held by things.** A Gu's rank, a creature's rank (SS creature ladder) and an item tier are paths with `holder: 'thing'`; G or L owns the row and storage, R owns the rule.
- **R-13 · Transitions reuse ladder holdings.** Swapping pathways, branching, demotion and wrong-order attempts stay `ladder_holdings` transitions, now settled as R-6 workings with R-7 risk.
- **R-14 · World numbers live in packs.** Domain law here never names a world. Each world pack declares its paths, dials and calibration fixed points (AD49: LOTM digestion acts, Rank Two at the book's essence counts).

### What R reads from other chats

| From | R reads | Port |
| --- | --- | --- |
| K | The working shape (quote, settle, receipt, observed versus true) for crossings and attempts | K v0 |
| W | Quantities: primeval essence by kind and grade, time elapsed, place quantities (a moon window, a quiet room); effects R publishes | W v0, `applySimulationEffects`, energies |
| L | Body capacity and condition as facts (aperture grade, aptitude, injuries, age); L applies backlash | L's body facts |
| Knowledge (no N chat in this wave) | What the holder knows about the next step, the potion's principle, a teacher's method | MC8 owners: `knowledge_home`, `discovery_codex`; GTR10 `knows` callback |
| M | Credential records, merit and standing for institutional ranks (faction rank, Nighthawk posts) | M's records (GTR25) |
| G, S, B | Gu as holders and essence costs; spell mastery as a track; potion doses as step costs | Their catalogue rows |
| A | Actors choosing whether to attempt | A over K quotes |

### Ownership proposal

R proposes to own `ascension_paths.js`, `ladder_holdings.js`, `breakthrough_trial.js`, `progression_gates.js` and a new path-step leaf, plus the progression parts of `skill_ladder.js` and `faction_rank.js` (the rung tables, not the reputation). `progression_gates.js` stays a separate leaf other domains import; it moves into K only if two domains need it there (PFP5). World rows stay with their world owners (G for Reverend Insanity rows, the LOTM pack owner for LOTM rows).

## First consumers after K v0

| Consumer | Target | Done check (default) |
| --- | --- | --- |
| Gu rank step | Rank One peak to Rank Two initial for a Reverend Insanity body: a path row in a Gu world pack (with G), essence read from W, the wall crack as an R-7 attempt with the scene's 38 and 44 parts as calibration dials, replacing the `aperture_stage` strings in `book_gu_lead_rank_two.js` | Fang Yuan reaches Rank Two by the row with his ch87-92 numbers; a different body with a lower aperture grade fails the attempt by the rules alone; the lead-life tests still pass (MC5) |
| LOTM sequence step | Seer Seq 9 to Seq 8 with digestion as an R-3 event track (6 acts) and the deacon exam as a credential gate; one digestion counter replaces the five | The Seer and Corpse Collector rows advance through the same step code; Klein's ch129 endpoint test passes; drinking undigested raises loss pressure through L |
| Skill level | One upstream skill (for example Sleeping) re-expressed as a path row whose track is the existing XP curve | Level after any split of the same XP equals today's `add_xp` result (partition test); `skill_ladder` perks read the path's grants |

## What the rules could not express (backlog)

- **Digestion by acting quality.** An act counts if it fits the potion's principle; today it is a count of named acts. Needs a principle match from S or N, not R.
- **Aperture grade and aptitude as body law.** Capacity from aptitude is a dial in a pack; a grade that changes with stones, a cracked aperture or an immortal aperture needs L's body model.
- **Conserved supply** (GTR33): Beyonder characteristics and unique sequence seats need a world ledger, likely M or W.
- **Skipping or wrong order** (LOTM wrong pathway, rushing): `ladder_holdings` has the shape; outcomes need L and A.
- **D&D levels.** No level or XP exists; a class path row is new content, not a re-expression.
- **School years** (Hogwarts, MoL months): a calendar-gated path with a credential; needs W's calendar.
- **Felt progress text** per track (R-10) needs prose rules and the knowledge owners.

## Requests to other chats (to send at embed)

- **K:** the working must carry an optional attempt (risk, draw, outcome ladder) and keep the admission quote (GTR11).
- **W:** essence as a typed quantity with kind and grade; a time-integration hook R can use for rates.
- **L:** body facts for capacity, aptitude and condition; an inbox for backlash effects.
- **G:** Gu Master rank and sub-stage move from scene strings to a path position on the body; Gu worm rank as a thing path. Note left in the shared notes folder.

## Checks run

| Command | Result | Gaps |
| --- | --- | --- |
| `git merge --ff-only 9bbc51363` | Branch fast-forwarded from c25fd396d to the plan's start commit | None |
| Three read-only inventory readers (haiku) over `src` | Reports above | Files listed under "Not traced" |
| Spot checks: `LOTM_DIGEST_ACTS`, `LOTM_CC_ACTS`, `src/models/skill.js:204`, generated-row Seq 8 gap, Gu rank-two scene, `aperture_stage` grep, importer counts | Confirmed; the reader's "no Gu Master rank-up exists" was wrong: it exists as a bespoke scene (`book_gu_lead_rank_two.js`) | Mistglass stage counts not tallied |
| `npm run check:rules` | Exit 0; receipts pass; one pre-existing TMR1 warning in `src/book_world_hp_exams.js:14` (not this change) | Docs-only change; no tests run |
