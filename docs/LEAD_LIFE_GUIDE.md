# Lead-life guide: one reading of the book-life ideas

*Written 2026-10-29. Status: **proposal and navigation, not new direction.** It adds no rule
codes and changes no accepted line. Where it says "accepted", Weibao's own words or an AD
code record it; everything else is a proposal from the cast-lives sessions.*

This guide reconciles how YAIRPG turns a book into a playable life: the design in
[LEAD_LIFE_SYSTEMS_DESIGN](gm/dispatch/protagonist-life-2026-10-27/LEAD_LIFE_SYSTEMS_DESIGN.md)
(LSD1-LSD256), the timeline standard, the absorption and cast-lives rules, the reader
schemas and Weibao's own entries in [USER_VISION](USER_VISION.md). It summarizes and
links; the owners keep their tables. Where this guide and an owner disagree, the owner wins
and this guide is corrected.

**Not the rulebook.** [LEAD_LIFE_RULES](LEAD_LIFE_RULES.md) (made 2026-10-29, as LSD155 proposed)
holds the lines Weibao has accepted. This guide is a reading aid with an implementation order
and does not replace it. Add no LSD codes here (LSD216: planning text is outrunning playable change).

## Contents

1. The model on one page
2. How the vision moved, and what is accepted
3. Field-to-system matrix
4. One chapter per system
5. The four shared joins
6. Implementation order and cost
7. Contradictions and superseded lines
8. Drift check and a more-to-consider round
9. Coverage of LSD165-LSD256

---

## 1. The model on one page

**Why it exists.** Weibao's standing aim ([north star](LIFE_SIM_NORTH_STAR.md), AD44) is a
life sim built from books. For a book world, the protagonist's own life ("be the lead") is
the main line and the harness: playing it forces every system a world needs into existence.
The test from the north star still applies: *does this make one character's life feel lived?*

**Natural course.** Each world has a course it would follow if the player were absent. For a
book it is the book's canon in the chosen premise ([TIMELINES_AND_DIVERGENCE](TIMELINES_AND_DIVERGENCE.md),
OD7 accepted: canon follows its natural course unless changed; OD8: a world may correct itself
only through a mechanism the world actually has). Only named events are tracked (C1), decided
when reached (C3), and motives outlive scripts (C6).

**Canon as constraints, not a script** (proposal, LSD106-LSD125; what Weibao accepted on 2026-10-28 is the forced canon run, and USER_VISION records the representation as the coordinator's proposal for it).
Each canon fact is a windowed constraint with provenance (`canon`, `canon-derived`, `fill`,
`emergent`, `divergent`). The engine runs freely between constraints; where one applies, a
keyed draw is conditioned to the canon outcome; reservations refuse free actions that would
break a later canon fact. This exists: `src/constraint_store.js`, `src/constraint_pack.js`
(D1, below floor).

**Canon pull** (LSD233, proposal). One number per canon fact at the moment it resolves, from
0 (free play) to 1 (the canon run's pin). Where a keyed draw for the fact gives the canon
outcome with chance `pull + (1 - pull) x p`, `p` being what our rules alone give. Run mode sets
the ceiling; plot weight, redundancy, the world's canon-pressure dial, a fixed-point flag and
disturbance set where it sits (LSD234); facts nothing later needs get pull 0 even in the canon
run (LSD235). Pull is computed lazily and derived rather than saved (LSD242, LSD245). Fate is an in-world
actor that spends on pull, only where a world names a fate mechanism (LSD239, OD8). No code
reads a pull yet; `conditionedDraw` is the nearest seam and today is the pull-1 case.

**Run modes** are one dial: hard (canon run, accepted default for the lead and for the lead as
NPC), weighted (fate, open run), none (free). The canon run is accepted; the open run and
D2 (outside interference) are later by Weibao's words.

**Three grains** (LSD209, proposal). *Beats* (great weight) played step by step with real
choices; *days* (routine scenes) as a montage settled by outcome; *narration* (thinking,
reports, description) as journal, knowledge and texture. Dial: any day can be zoomed to steps
once a mechanism exists. This is in tension with the accepted reading of "every step reachable"
(section 7, item 1).

**The lead's run as a feature harness** (LSD226-LSD230, proposal). The run buys features, not
step counts. A feature counts as part of the game when it reads no "is the lead" flag, ships
a failure path and a refused path, and runs on a second world's fixture. Until then it is a
book-specific feature. Plot armour is a constraint, not a stat (LSD228).

**Content scales, code does not** (LSD165). Steps collapse into verb families, families into
effect operations (`src/simulation_effects.js`) and frames. A step costs a row; only a new
operation, input or stop rule costs code. Measured 2026-10-29: about 110-115k of 159k source
lines are logic, about 30k are content kept in code (LSD173 moves new content to data packs).

**Emergent canon rate** (LSD236). The real measure of success: run the canon life at pull 0
across seeds and count the canon facts the rules reach by themselves. A world that reproduces
most of its book at pull 0 is one where leaving canon is believable.

## 2. How the vision moved, and what is accepted

The arc, from Weibao's own entries (USER_VISION; dates are entry dates):

| Date | What he said or accepted | Effect |
| --- | --- | --- |
| 2026-09-29 to 10-07 | A text life sim ("like bitlife"), many worlds, the YAIRPG expansion continues it ([north star](LIFE_SIM_NORTH_STAR.md)) | The test: does it make one life feel lived |
| 2026-10-15 | OD7 natural course; OD8 fate only by real mechanism; OD24 no compulsory main quest (a world can still offer an optional main goal) | Canon is a default course, not a script |
| 2026-10-28 | Build everything the lead's life needs; "be the lead" is the main line (AD44) | Lead-first for every book world |
| 2026-10-28 | "Sure" to the batched defaults | CLR1-CLR13, SUI1-SUI19, RPT1-RPT12 binding |
| 2026-10-28 | Fights and results follow the book in the lead's run; the canon run is forced, open run later | Canon as constraints; untaken options locked, not removed |
| 2026-10-28 | People besides the lead "don't quite need full lives" | Depth by tier (his views are direction; the design answers are proposals) |
| 2026-10-29 | Timings need not be exact to the hour, "as long as all the features and events happens" | Order and windows, not minutes (LSD156-LSD164 are proposals) |
| 2026-10-29 | "Sure" to mechanisms before bulk review | **LSD168 accepted**, with LSD179-LSD183 as working defaults |
| 2026-10-29 | Answers on the guide: per-world variation in how canon resists, the pressure dial already covered by CL21/CL22, 1.5 reread later, main goal optional; asks the advisor to decide grains versus reachable steps | See section 7 |
| 2026-10-29 | LSD218 "isn't absolute"; wants emergent behaviour, wider probabilities, fate, with the butterfly effect considered | Canon-holding narrowed to a default; canon pull proposed |

**Accepted (Weibao's yes or an AD code):** AD44, AD45; the 2026-10-29 answers on the guide's open contradictions (section 7 items 2-5; item 1 decided under his delegation); CLR/SUI/RPT; the canon run is forced
by default for the lead and lead as NPC, with an open run later; windows over exact hours as
direction; mechanisms first (LSD168); WA25-WA41 as accepted, adjustable defaults; AD1-AD9,
AD38 and AD5's design framing.

**Proposal only:** the rest of LSD1-LSD256, including canon pull and its formula, the three
grains, the field-to-system matrix, the four joins, tag sidecars, schema 1.5 (implemented
opt-in, unused), tiers (LSD126-LSD137), the wake-time scheduler, and everything in sections 4-6
below.

## 3. Field-to-system matrix

Spine for the guide (LSD255). **Read** = a system in LSD246-LSD254 or its owner needs it
(my reading of those tables; proposal). **Reader found** = where a grep over `scripts/`, `src/` and `tests/` on 2026-10-29 found code that reads the
field; cells marked "(owner doc)" were not grepped and come from the owner's description. A grep is not proof of
absence; "none found" means to check before collecting more.

Systems: **Rel** relationships, **Mk** crafting and brewing, **Dv** divination and ritual,
**Tm** time travel and loops, **Ec** economy and work, **Kn** knowledge and rumour,
**Lw** law and institutions, **Ab** abilities, **Cf** conflicts. `x` = reads.

### 3.1 Scene fields (schema 1.3, all versions)

| Field | Rel | Mk | Dv | Tm | Ec | Kn | Lw | Ab | Cf | Reader found |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `beat`, `order`, `pov` | x |  |  | x |  | x |  |  | x | cast pack, replay mapping |
| `date`, `timeOfDay` |  |  | x | x | x | x | x |  | x | constraint pack (windows) |
| `place` | x | x | x | x | x |  | x |  | x | place acts, journeys |
| `deps` (after, needs) |  |  | x | x |  | x |  |  | x | constraint pack; pull redundancy (LSD234) is future |
| `steps` (see 3.2) | x | x | x |  | x | x | x | x | x | gap census, replay mapping |
| `touched` | x | x |  |  | x |  |  |  | x | cast pack |
| `present` | x |  |  |  |  | x | x |  | x | witness fallback (LSD196) |
| `knowledge` | x |  | x | x |  | x | x |  |  | `beat_knowledge.js` path (owner doc) |
| `motives` | x |  |  |  | x |  | x |  | x | motive resolver (D2) future |
| `choices`, `options` | x |  | x |  |  |  |  | x | x | WA28 stubs, locked-option list (owner doc) |
| `outcomes` | x | x | x | x | x | x | x | x | x | cards (LSD182) future |
| `anchors` (money and counts) |  | x |  |  | x |  |  |  |  | constraint pack anchors |
| `weight` | x |  |  | x |  |  |  |  | x | grains (LSD209); pull input (LSD234) |
| `footprint` | x |  |  | x |  |  |  |  |  | constraint windows |
| `sealed` |  |  | x |  |  | x |  |  |  | sealed-secrets lint (owner doc) |
| `evidence` | x | x | x | x | x | x | x | x | x | all (locators, CLR1) |
| `mechanism` |  | x | x |  |  |  |  | x |  | none found beyond the reader prompt |
| `conflict` block (a card field; the batch readers do not emit it, 7 item 8) | x |  |  |  |  |  | x |  | x | `scripts/lead_run/conflict_contracts.mjs` derives it from merged rows |

### 3.2 Step fields (1.3 base and the eight 1.5 additions)

| Field | Rel | Mk | Dv | Tm | Ec | Kn | Lw | Ab | Cf | Reader found |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `verb`, `class` | x | x | x |  | x | x | x | x | x | family tags, mapping |
| `label` (S, I, U) |  |  |  |  |  |  |  |  |  | evidence, not a system input |
| `time` |  | x | x | x | x |  |  |  | x | timing windows |
| `inputs`, `outputs` |  | x | x |  | x |  |  | x |  | gap census |
| `gains`, `requires` | x | x |  |  | x | x |  | x |  | progression gates |
| **1.5 `locator`** | x | x | x | x | x | x | x | x | x | many scripts read locators; the step field is new |
| **1.5 `actor`** | x |  |  |  |  | x | x | x | x | `build_replay_mapping.mjs` reads `step.actor`; the 1.5 override of script guesses (LSD207) is not yet proven |
| **1.5 `kind`** (act, perceive, think, speak, report, narration) |  |  | x |  |  | x |  |  |  | scene-level `kind` readers exist; step-level not confirmed |
| **1.5 `target`** | x |  |  |  |  | x | x |  | x | none found for steps |
| **1.5 `using`** |  | x | x |  | x |  |  | x |  | **none found** |
| **1.5 `habit`** | x |  |  |  | x |  |  |  |  | **none found** (only the plan maker and one test) |
| **1.5 `results`** | x | x | x | x | x | x | x | x | x | **none found** at step level (a `.results` hit in the cast host is a resolution list; the card builder LSD182 would read this field) |
| **1.5 `witnesses`** |  |  |  |  |  | x | x |  | x | **none found** (the K1 lane would read it, LSD196) |

### 3.3 Passes 3-5 (schema 1.3, with 1.4 additions in bold)

| Field | Rel | Mk | Dv | Tm | Ec | Kn | Lw | Ab | Cf | Reader found |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| rule `kind`, `worldKind`, `conditions`, `limits` |  | x | x |  |  |  | x | x |  | cast adapters for Mk, Dv, Ab (owner doc) |
| rule `steps`, `inputs` (role), `products`, `minutes`, `place` |  | x | x |  |  |  |  |  |  | MK1 adapter (owner doc) |
| rule `costs`, **`costStated`** |  | x | x |  | x |  |  | x |  | `build_crosswalk.mjs` reads `costStated` |
| rule `ritual` |  |  | x |  |  |  |  |  |  | DV1 adapter (owner doc) |
| rule `results`, `consequences`, `who` | x | x | x |  |  |  | x | x |  | partial |
| rule **`acquire`** |  |  |  |  |  |  |  | x |  | gap census mentions it; ability adapter reads none found |
| rule **`reset`** |  |  |  | x |  |  |  |  |  | **none found** (a `reset:true` hit in the LOTM host is a persist option) |
| rule **`enforcement`** |  |  |  |  |  |  | x |  |  | **none found** outside a test fixture |
| person `routine`, **`recurrence`**, **`until`** | x |  |  |  | x |  |  |  |  | cast pack, worksheet |
| person `relations`, **`since`** | x |  |  |  |  |  |  |  |  | relations: yes; `since`: none found |
| person `knows` | x |  |  |  |  | x |  |  |  | knowledge seeding |
| person `reacts`, **`class`**, **`by`**, **`responseClass`** | x |  |  |  |  | x | x |  | x | `after_actions.mjs`, L7 classes |
| person `speech`, `wants` | x |  |  |  | x |  |  |  |  | motive model (D2) future |
| person `reveals` (same-as) |  |  |  |  |  | x |  |  |  | identity merges |
| place `hours`, `access`, `crowd`, `affordances`, `routes` | x | x |  | x | x | x | x |  | x | place acts, journeys |
| service price rows, **`kind`**, **`amount`**, **`unit`**, **`per`**, **`priceId`** |  | x |  |  | x |  |  |  |  | typed prices; **`priceStated`** none found outside a test |
| `news` (public or private, `carriedBy`) |  |  |  |  |  | x | x |  |  | rumour (LSD37) future |
| `customs` |  |  |  |  | x | x | x |  |  | law and etiquette rows |

### 3.4 What the matrix says

**Fields no system reads yet (no reader found):** step `using`, `habit`, `results`,
`witnesses`, `target`; rules `reset` and `enforcement`; person `since`; `priceStated`;
scene `mechanism`. READINESS L10 says a field with no consumer is dropped after the probe,
and WA41 allows a field only when a named consumer reads it within one milestone. By that
rule, no further 1.5 reading should be bought until a mapper or the card builder reads
these (LSD207). Dropping vs keeping is Weibao's call; the schema is already implemented
opt-in and cost nothing yet.

**Systems missing a field (proposed schema or script changes):**

| System | Missing | Cheapest fix |
| --- | --- | --- |
| Relationships | The cause of a bond change (which event moved it) | Derive from step `results` plus `reacts`; no new field |
| Economy | Household membership and pooled purse | Role fill from people `relations`; household anchors (`scope: household`) exist |
| Knowledge | What the lead knows then versus what narration tells (LSD199) | Script from evidence kind; local model for narration that outruns him |
| Law | Secrecy and risk (LSD198); who counts as an institution's person | Local pass over rules `institution` kind plus `enforcement`; wait for a consumer |
| Conflicts | Move-level detail (who acts on whom, range, wounds, stat claims) | FD1 narrow pass over conflict scenes only (LSD100); the batch schema carries no `conflict` block (see 7.8) |
| Abilities | Loss of control and side effects as fields | Rules `consequences` and `limits` partly cover; ability rows (LSD171) decide |
| Divination | The question asked and the answer given as records | Rules `ritual` plus `results`; DV1 pack schema already defines its own |
| Time and loops | Per-loop observed times (LSD164) | MoL lane; `reset` rules plus scene `date` |
| Crafting | Quality, waste and failure bands | Rules `results` (success, failure, partial); bands by calibration |

## 4. One chapter per system

Each chapter: readings → under canon pull → owners (checked to exist 2026-10-29) → first
playable slice. The four joins apply to all and are in section 5. "Below floor" means built
and agent-verified but not at the AD43 six-line floor.

### 4.1 Relationships (LSD26-LSD32, LSD246)
- **Readings.** People `relations` (attitude, basis, `since`), `reacts` by action class; scene `knowledge`, `present`; 1.5 `target`, `results`.
- **Pull.** A canon bond change is a fact with pull; the cause between canon turning points is free, so who helped whom can vary while turning points hold. LSD237 turns each canon choice into a test of the motive model.
- **Owners.** `src/relationship_view.js` (read point), `src/obligations_ledger.js` (record shape, not wired), `src/peer_standing.js`, `src/reputation.js`, `src/household_fortunes.js`, `src/cast_topic_talk.js`. R1 (one bond record per pair) is not built; the five relationship stores the audit found still disagree. WA42, WA34, [relationships palette](RELATIONSHIPS_AND_CANON_CONSIDERATIONS_2026-10-18.md).
- **First slice.** One pair (the lead and one family member): a bond moved by a cause-dated event, read by a choice (who pays the rent), with a failure path (a refused favour) and a non-lead fixture. Done when flipping trust flips the book's choice in seeded runs (LSD32).
- **Joins.** Pull-aware resolve: none. Failure and refused path: none (R1 not built). Non-lead fixture: none. Beat checkpoint: none.

### 4.2 Crafting, brewing, making (LSD247)
- **Readings.** Rules inputs with roles, ordered steps, minutes, products, costs, 1.4 `acquire`; step `using` (1.5).
- **Pull.** The canon product and whether it worked hold; quality, waste and time are free within the band. An off-canon brew is the same rows.
- **Owners.** `src/cast_making_adapter.js` and `tests/cast_making_adapter.test.js` (MK1; rebased on DV1 and integrated per its resume 2; below floor, no joint-pack journey), `src/book_world_lotm_brew.js`, the `src/craft_*.js` family, MR1-MR36.
- **First slice.** MK1's one preparation-to-product-to-use chain, plus a second generic product from another world's rows (LSD214). Done when the rebuilt desktop journey runs it and both a failure and a refused path exist.
- **Joins.** Pull-aware resolve: none. Failure path: MK1 tests cover interrupted work and conservation (receipt); a refused path is not confirmed. Non-lead fixture: its fixtures use a `player` actor and a cast actor; I found no explicit non-lead run. Beat checkpoint: none.

### 4.3 Divination and ritual (LSD248, LSD240)
- **Readings.** Rules `ritual` and conditions; ritual and divination step families (232 steps, with an unreviewed ritual bucket of 438).
- **Pull.** A rite's success is a fact with pull; its preparation is free. Divination can read the pull and strain of the questions it asks, at its own accuracy and through means (AD6, AD9), not the sealed truth beyond them. This gives divination a mechanical job in any world that has it.
- **Owners.** `src/cast_divination_adapter.js` (DV1, landed in `3ece3baf2`, below floor), `src/book_world_lotm_ritual.js`, `src/cast_inference_adapter.js` (KN1).
- **First slice.** DV1's paid query with a failed or obscured result, then a read of one fact's strain. Needs the pull seam in the constraint store first (section 6, step 4).
- **Joins.** Pull-aware resolve: none. Failure path: DV1 tests an obscured attempt that pays with no answer, plus stale means and interrupted support. Non-lead fixture: it checks that another actor does not receive the private signal, which is isolation, not a non-lead run. Beat checkpoint: none.

### 4.4 Time travel, loops and restarts (LSD249, LSD164)
- **Readings.** Scene `date`, `deps`, windows; 1.4 `reset` rules (trigger, span, what resets, what is kept, who remembers).
- **Pull.** A return restores a beat checkpoint (LSD224) with the traveller's knowledge kept; the natural course replays at its pulls and the traveller's knowledge is disturbance (TIMELINES T1-T5). Loop worlds tighten timing and record what each loop changed. Restore versus branch is a per-world dial (TIMELINES mutability); the LSD chose restore.
- **Owners.** [TIMELINES_AND_DIVERGENCE](TIMELINES_AND_DIVERGENCE.md), `src/anchor_snapshots.js` (derives world snapshots; not confirmed as a beat checkpoint store), `src/continuation_laws.js`, `src/book_world_mol_*.js`, WER1-WER17 for crossings. No reader of `reset` rules found; LSD224 (beat checkpoints) is not built.
- **First slice.** After the beat-checkpoint join exists: one MoL loop restart that keeps knowledge and replays two beats at their pulls, with a second world as the fixture.
- **Joins.** All four: none. This system is the one that needs the beat-checkpoint join most.

### 4.5 Economy and work (LSD250, LSD40-LSD42)
- **Readings.** Typed price, wage, rent, fee rows; money anchors with scope; routine slots.
- **Pull.** Canon balances on canon days are reservations (LSD109); spending between them is free.
- **Owners.** `src/economy_domain.js` (the one money seam, ECR16), `src/household_fortunes.js` (rules only), `src/cast_exchange_adapter.js` (L2; atomic purchase and stash), `src/simulation_effects.js`. E1 (wage, rent, household) is not built.
- **First slice.** Pay day, rent due and one late-rent chain through the household (LSD46), with the landlord bond as the aftermath. Luna-sized.
- **Joins.** Pull-aware resolve: none. Failure path: the exchange adapter tests stale stock and insufficient money (MF1 L2 scope; receipt below floor). Non-lead fixture: none confirmed. Beat checkpoint: none.

### 4.6 Knowledge, rumour and secrets (LSD251, LSD36-LSD38, LSD144)
- **Readings.** Scene `knowledge`, evidence kinds, 1.5 `witnesses`, `news`, sealed ids.
- **Pull.** Canon learning holds on canon time (LSD119); who else hears is free unless a later fact needs it.
- **Owners.** `src/people_knowledge.js`, `src/world_knowledge.js`, `src/beat_knowledge.js`, `src/observation_channels.js`, `src/information_freshness.js`, `src/cast_inference_adapter.js`. Rumour propagation (LSD37) and the K1 witness scale outside the cast path are not built. Sealed-secrets rule applies in full: ids, never text.
- **First slice.** One rumour travelling along bonds with keyed draws per edge and day, with a refused-to-tell path, read by a vendor's manner (LSD51).
- **Joins.** Pull-aware resolve: none. Failure path: none for rumour. Non-lead fixture: none confirmed. Beat checkpoint: none. Inner steps (thinking, deducing, LSD172) run as part of the act that prompts them, with a "think it over" act only where the book gives no trigger.

### 4.7 Law and institutions (LSD252, LSD39)
- **Readings.** Rules law rows with 1.4 `enforcement`; `news`; `customs`.
- **Pull.** A canon arrest or ruling holds; detection draws elsewhere are free and feed disturbance.
- **Owners.** `src/institution_store.js` exists but holds contribution and store rows for churches, sects and societies; it is not a police, case or record store, so LSD39's "no runtime owner" still stands for cases. `src/life_record.js` is a biography. LW1 is not built.
- **First slice.** One incident becoming a case only through someone telling an institution, ending in a summons (LSD47). Sol-sized; wait until K1's witness scale exists.
- **Joins.** All four: none (system not built).

### 4.8 Abilities and progression (LSD253, LSD171)
- **Readings.** Rules abilities with `acquire`; ability family (160 steps).
- **Pull.** Advancement on canon days holds; how practice went is free; off-canon advancement uses the same rows.
- **Owners.** `src/cast_ability_adapter.js`, `src/book_world_lotm_abilities.js`, `src/book_world_lotm_pathways.js`, `src/book_world_lotm_path.js`, [ABILITY_RULES](ABILITY_RULES.md) ABR1-ABR22.
- **First slice.** One ability row used through the one use-a-power move, with a loss-of-control side effect as its failure path and a non-lead actor with the same means.
- **Joins.** Pull-aware resolve: none. Failure path: the ability adapter receipt is below floor; side effects are the intended failure path. Non-lead fixture: none confirmed. Beat checkpoint: none.

### 4.9 Fights and conflicts (LSD254, LSD81-LSD102, LSD218-LSD220)
- **Readings.** The scene `conflict` block is derived by `scripts/lead_run/conflict_contracts.mjs` from merged scene rows (5 candidate contracts in LOTM chapters 1-24); move-level detail comes from the FD1 pass.
- **Pull.** In the canon run, pull 1 gives the book's outcome tier and play moves the cost. At lower pull, play can move the outcome. Locked facts (winner, survival, items) come from the forward-anchor lint, free facts (rounds, order of blows, wound place) are keyed draws (LSD219).
- **Owners.** `src/native_battle.js`, `src/party_battle.js`, `src/feature_expansion_battle.js`, `src/defeat_domain.js`, `src/combat_math.js`, `src/pursuit.js`, `src/models/combat.js`. LSD81 grows the saved-battle family into one data-driven runner; LSD71's second engine is superseded. F1, FD1 and C2 are not done.
- **First slice.** Port the road duel through the general runner with byte-identical results (LSD82); then one canon fight with a 100-seed spread (LSD220).
- **Joins.** Pull-aware resolve: none (fights use keyed draws but not a pull). Failure path: the saved battles already end in lost, withdrew, yielded, escaped. Non-lead fixture: none confirmed. Beat checkpoint: none.

## 5. The four shared joins (LSD256)

Each new system needs the same four joins before it is real. Building them once makes each
system cheaper. State as of 2026-10-29:

| Join | Meaning | State |
| --- | --- | --- |
| Pull-aware resolve | Resolve through one function that takes a pull | `conditionedDraw` in `src/constraint_store.js` takes outcomes and a consistency test, so it is the pull-1 case. No `pull` input exists in code. Weighted and open modes are rejected by the save (D1) |
| Failure path | One failure and one refused path with consequences (LSD227) | Per system; none is a shared kit yet |
| Non-lead fixture | Tests run once with a non-lead actor (LSD226) | Per system; no shared fixture |
| Beat checkpoint test | Start work at chapter N from chapter N-1's snapshot (LSD224) | Not built; `anchor_snapshots.js` scope unconfirmed |

## 6. Implementation order and cost

**Constraints.** Paid credits are low this month (Weibao 2026-10-29; the Codex weekly window
is the scarce budget, ON13/ON14 in the coordinator handoff). Route order is script, then local
model, then Luna, then Sol (LSD200); the local model runs one at a time and, by LA6, not beside a build
or browser. Hold remaining Sol lanes until the window resets (LSD168 caveat). The
build order below is a proposal. Mechanisms first is accepted.

| Step | Work | Cost class | Done check |
| --- | --- | --- | --- |
| 1 | **Free tags and measures.** Derive actor, kind, family, habit by script into a per-step sidecar with `source` (LSD190-LSD192, LSD194, LSD202). Rerun the mapper over the old gaps (LSD180). Print code lines per newly covered step (LSD166) and a family-by-volume table (LSD170) | script | Counts printed; the "32% are tagging faults" claim measured (LSD205) and either confirmed or the join is fixed |
| 2 | **Measures that match the aim.** Replay driver reports beats reached in order, days whose outcomes hold, distinct usable verbs (LSD210) and emergent canon rate at pull 0 (LSD236), headless (LSD185) | script (driver mode) | One report prints all four beside step fidelity |
| 3 | **Reachable cards.** Build canon-event cards from scene outcomes (LSD167, LSD182) | script, Luna low for the builder | Every gap step in chapters 1-24 is a card or listed as missing outcomes |
| 4 | **The four joins once.** Add a `pull` input to the keyed resolve with default 1 (no behaviour change) and a per-world curve from disturbance to pull (7 item 2), a shared non-lead fixture, a failure and refused path helper, and beat checkpoints (LSD224) | Luna medium | Same state hash as before at default pull; ch20 starts from a snapshot and matches the full replay hash; pull 0.5 gives the stated chance over 1,000 keys |
| 5 | **Land what is paid for.** Six MF1 lanes exist as adapters at "implemented, below floor": exchange (L2), making (MK1), divination (DV1), ability (AB1), body-care and inference (KN1), each with its own `MF_*_CHECKPOINT.md` and an integration patch or live integration noted there. Settle each at its stated state, run the rebuilt desktop journey for those that need it, then add a second-world fixture (LSD214) | coordinator time; browser | AD43 floor met or "below floor" restated per receipt; one MoL or HP row set runs unchanged |
| 6 | **Residue tagging.** Family and inner-step tags on the `unknown` residue overnight (LSD184, LSD203) | local model | 500 tagged steps agree with a 50-step Sol spot check at or above 90% |
| 7 | **Systems not yet built, in the live queue's order.** MF1 D2 and CL268 already rank the lanes and run them as the be replay reaches each; this guide adds no competing order. Remaining after step 5: Relationships (R1), Economy (E1), Knowledge and rumour (K1), Law (LW1), Conflicts (FD1, F1, C2), Time and loops. Deviations from MF1's order are listed in 7 items 16-17 | Luna for E1, Sol for the rest (waits for the window) | Each system's chapter 4 slice plus its joins from section 5 |
| 8 | **Pull proper.** Lazy recompute from disturbance, the divergence view, fate as an actor, resist-fate scenario (LSD241-LSD245, LSD223, LSD239) | Sol | Seeded scenario where one push fails and a larger push succeeds; a changed world dial changes future draws with no save migration |

**Run log, steps 1-2 (2026-10-29; scripts only, no model call, no browser).** New: `scripts/lead_run/derive_step_tags.mjs` (sidecar keyed by step id with a basis per tag and a `weak` flag for defaults), `scripts/lead_run/replay_metrics.mjs` (reachable share, playable share over great beats, fold-loss count, control kinds, family-by-volume table), test `tests/lead_run_step_tags.test.js` (4 of 4 pass). Outputs are private, under `lead-run-2026-10-27/step-tags-2026-10-29/`.

- **Tags.** 16,679 steps tagged in the whole-book scenes (11,168 in lead scenes). Actor: 4,961 from a scene's non-lead point of view, 1,197 from a name in the verb, 10,521 the weak lead default. Kind: 3,340 from the verb lexicon, the rest the weak "act" default. Habit: 119 steps.
- **LSD205 result: the "about a third are tagging faults" claim is not supported by script tags.** Against 342 deduplicated reviewed steps, script tags found 0 of the 54 "actor not the lead" steps (they stayed on the weak default) and 6 of the 62 "not an action" steps, and marked 11 of 77 good rows as non-actions. Most of those gaps are the reader's step not matching its cited paragraph, which a bare verb cannot show. Reading the paragraph is the route: the local model, or a reread at 1.5 for the shards a mechanism needs (7 item 4). The sidecar still helps the 6,158 steps with a strong actor, and the family tag, but it does not shrink the review backlog.
- **Metrics on the latest mapping set (11,159 steps).** Reachable share 10.0%; playable share over great-beat steps 7.3%; great beats fully reached 3 of 1,196; fold-loss count 0 (no lossy folds are produced yet, so the count says nothing until cards exist); 7 control kinds (journey 544, place act 492, talk topic 64, greeting 7, household 3, walk 2, wait 1). Beats reached in order and emergent canon rate are not measured: they need the replay driver and a pull input.
- **Family by volume (LSD170).** Top families by gap steps: speak or ask 1,144; reason or plan 830; handle or move an item 807; needs mechanism review: other 678; travel or move 658; inspect or investigate 438; needs mechanism review: ritual 438. Volume 1 holds the most of each; the table is in the private metrics file.
- **Not done.** The code-per-covered-step meter (LSD166, needs per-lane covered-step counts); wiring the sidecar into the mapper rerun (LSD180), which would not change coverage because tags did not clear gaps.

**Working practices** that apply to every step above (all proposals unless noted):

- Shard review and mechanism lanes by family, not chapter (LSD179); stop bulk review for a family when a sample turns under about 15% of steps into rows (LSD183).
- Pull paragraph packets once per shard into private research (LSD181, LSD153) and give reviewers a step inspector showing paragraph, family, control, operation and gap reason (LSD175, Luna medium after MF1).
- Each mechanism lane ships a short golden replay slice for the steps it claims (LSD176); lanes run only the affected families' slices, and the committer runs the full suite once (LSD187).
- Track Codex window points per lane type and print before and after for every speed or cost change (LSD174, LSD188); load by window (SZ4) before the pack grows again (LSD215).
- Collect open questions for Weibao in the handoff's decision list so lanes keep running on defaults (LSD189).
- Each mechanism brief names one open-run choice it enables beyond the canon step (LSD213). Money, prices and meeting windows stay exact (LSD217).
- Mechanisms are world modules: a world-neutral core, a thin per-world adapter, their own tests (LSD225). A technical butterfly (one extra roll reshuffling later rolls) is a bug that subject-keyed draws prevent; a story butterfly travels along causal links (LSD221, LSD222); a divergence view shows what now differs from the book (LSD223, with D2).

- Reuse across worlds is the payoff test: a mechanism is general when a second book maps steps to it with rows only (LSD177). Report progress as a fidelity curve (reachable, playable, strain per volume), not lines or reviewed steps (LSD178, LSD211: detail follows the chapters actually played).
- One-off events stay cards unless a later world reuses the shape (LSD169). Step outcomes and costs are assigned from scene outcomes by script (LSD193); agency comes from the scene's `choices` and `options` (LSD197). Tag on demand by the family the next mechanism needs (LSD201).
- Widening possibility means lowering pull on the same records, not authoring twice (LSD238; untaken options are the WA28 rows).
- Model fine-tuning on our reviewed rows waits until enough exist; meanwhile reviewed rows keep their locator, schema version and `source` so a training set can be cut later (LSD231, LSD232).
- Dropped here: prebuilt pack indexes (LSD186), an engine speed item that stays LATER in the LSD doc (Sol low after P5).

Default: no further reader spend at schema 1.5 before step 4. Optional and his call: fifteen
minutes of Weibao playing chapters 1-3 in the be seat (LSD212).

## 7. Contradictions and superseded lines

Each row names the owner that wins and why. Where two proposals disagree I flag it and do not
pick. Items 1-5 were the open ones; Weibao answered them on 2026-10-29 (record in USER_VISION) and each row now shows its status. Later rows have a winner.

| # | Conflict | Winner or status | Why |
| --- | --- | --- | --- |
| 1 | LSD209/LSD210 (only beats need step controls; measure beats and verbs) versus the accepted reading in USER_VISION 2026-10-29 ("every step the lead takes is reachable through the game's own controls") | **Decided by the advisor under Weibao's delegation ("We need advisor to decide #1 contradiction"), 2026-10-29; he can override.** Both lines stay. Floor: every canon step is reachable in the canon run as a playable step, a card or part of a montage day, with untaken options locked. Depth: beats get step controls first (LSD209). A card or montage counts only if it passes CLR6's fold-loss test (keeps choices, inputs and outputs, time and order, who was there, place, outcomes, what was noticed); a lossy fold is a gap. The day-zoom dial is how a player follows all options. Metrics: reachable share over all steps, playable share over great beats, fold-loss count, distinct verbs, emergent canon rate; step-order fidelity is a diagnostic | CLR6 is accepted and already defines what a fold may lose |
| 2 | TIMELINES C2 (a threshold: an event shifts only when disturbance beats inertia) versus LSD233 (a probability: canon chance `pull + (1 - pull) x p`) for the same job | **Weibao: "sure, maybe different implementations for different worlds".** Proposal to implement it: one resolver with the `pull` input, and a per-world curve from disturbance against inertia to pull. A step curve (C2) holds pull at the ceiling until disturbance beats inertia; a smooth curve falls gradually (LSD233). A world with a truly different mechanism (a fate actor, a loop reset) supplies a world module (LSD225, CL22). Book-world default, proposed: step-shaped, since AD2 says "sufficiently disturbed"; calibrate each world's curve from its emergent canon rate (LSD236) rather than by hand | His "sure" accepts per-world variation; the curve design is a proposal for D2 |
| 3 | LSD62 "book fidelity is a play dial, not fate" versus LSD239 (fate is an actor spending on pull) and LSD234 (pull from "the world's canon pressure dial") | **Resolved with Weibao's "pressure dial should have been addressed already".** It is: CL21 causal mass is the default in every world; CL22's dial (a nudge on draws up to active correction) is off until a world pass names a mechanism; the 2026-10-15 OD7 answer "does not select universal canon pressure". So read LSD234's "world canon-pressure dial" input as CL21 redundancy plus CL22 where a world names one. Book fidelity is the play dial at pull 1 (the canon run). The TIMELINES per-world table's "canon pressure: medium" default is a stale proposal against CL22 and USER_VISION | CL21, CL22 and USER_VISION win
| 4 | **Keep or drop the unread 1.5 fields** (`target`, `using`, `habit`, `results`, `witnesses`) versus READINESS L10 and WA41 | **Deferred by Weibao: "we can do that in the future".** Is a reread to 1.5 worth it? Proposal: not now. Script derivation covers actor, kind, habit, results and witnesses at no token cost (LSD190-LSD196), no reader exists yet (L10), and credits are low; the union rule (LSD151, LSD202) means nothing is lost by waiting. Revisit after step 1 if a family that a mechanism needs keeps an unknown-actor share above the threshold that mechanism's brief names, and then reread only those shards, pricing it first from an unsent plan. New books (Mother of Learning, Reverend Insanity) read at 1.5 on the first pass once a mapper reads the fields | His direction is "later"; the trigger is a proposal |
| 5 | **OD24 versus AD44.** OD24 says no compulsory global main quest; AD44 makes the lead's life the build main line | **Weibao: different scopes**, and no need to say there is no main goal: a world can offer a main goal that the player chooses whether to pursue. OD24 says "no *compulsory* main quest" and "optional campaigns"; AD44 is build order, not a player obligation. New angle (proposal): in the open run the book's arc can be that optional main goal, with canon facts at pull below 1 as milestones the player may steer toward or away from | OD24 and AD44, as he read them |
| 6 | LSD218 ("canon fixes the outcome tier; play moves the cost") versus Weibao 2026-10-29 ("this isn't absolute") | **Weibao**; LSD218 is narrowed to a default for the canon run (the doc already says so) | His words outrank the proposal |
| 7 | LSD65 (untaken options stay possible) versus LSD103 (locked in the canon run) | **USER_VISION 2026-10-28.** WA28 stays in force for the records and the open run; it is narrowed, not overridden, for the canon run | His entry says so |
| 8 | LSD99/LSD254 say the readings carry a `conflict` block; the batch schema does not (`batch_lib.mjs` header excludes it) | **Code wins.** Conflict contracts are script-derived from merged rows | The card (1.3) defines the block; the batch readers do not emit it |
| 9 | LSD208 heading says witnesses "stay out of the schema" but its text and LSD206 and the code include `witnesses` in 1.5 | **Code wins**; fix the heading when the LSD doc is next edited by its owner | Heading error |
| 10 | LSD71 (two engines) versus LSD81 (grow the saved-battle family) | **LSD81** (the doc says it supersedes) | Later, checked against existing code |
| 11 | LSD61-LSD70 first draft proposed disabling untaken moves | Already corrected inside the doc (section 12) | Recorded |
| 12 | ON13 (Codex weekly budget) versus ON14 (Codex does the implementing) | **ON14**, per its own text | Weibao's clarification 2026-10-29 |
| 13 | LSD155 proposed `LEAD_LIFE_RULES.md`; this guide exists beside it | Both; the rulebook (made 2026-10-29) holds accepted lines only | Stated in the opening |
| 14 | OD2 and OD5 (memory carries; crossing does not reset history) versus LSD249 (return restores a checkpoint) | **Per-world dial** (TIMELINES mutability: restore, branch, closed loop) | LSD249 states one default, not a rule |
| 15 | AD33 (NPC-heavy work deprioritized) versus a 1,500-person pack and tiers | **AD33.** LSD137 already sets full depth for few people; the pack size is data, not simulation | Weibao's own direction |
| 16 | LSD99 ("keep the batch readers and schema as they are") versus LSD204/LSD206 (schema 1.5 moved tags to the step) | **LSD204/LSD206 and the code win** | They are later and implemented opt-in; LSD99 was about fight detail, which still needs FD1 |
| 17 | MF1 D2's ranked lane order versus this guide's section 6 | **MF1 D2 and CL268 win**; the guide lists only what step 5 settles first and adds the free script steps 1-4 ahead of Sol lanes because credits are low (LSD200) | The live queue is the coordinator's; the guide adds no order of its own |

## 8. Drift check and a more-to-consider round

Checked against the north star, AD5, AD33, AD38, AD42, AD44, OD7, OD8, OD12, OD24 and the
2026-10-29 entries. "Drift" here means the work has moved away from what he asked for; most
items are small. Dispositions: ACT NOW, ACCOUNT FOR NOW, LATER/DELEGATE.

**Where the work matches the vision.** Lead-first (AD44) is followed: DV1, MK1, D1 and H2 all
came out of the lead's run and each is world-neutral in shape. The canon run is forced by
default; the open run waits. Timings are windows. Mechanisms are first. Secrets stay sealed
by ID. Desktop-first applies; no mobile claims appear in these lanes.

| # | Drift or gap | Evidence | Disposition |
| --- | --- | --- | --- |
| Dr1 | **Step accounting over "a life that feels lived".** Fidelity is 0.013 (2 of 150 steps in order) and the doc itself says the step metric drove review work MF1 then reclassified (LSD210) | LSD section 22.2, north star test | ACCOUNT FOR NOW: step 2 of section 6 reports beats, days, verbs and emergent canon rate beside step fidelity |
| Dr2 | **One book's data over portable systems.** LOTM has a pack, census and replay; MoL has its own host and uses none of the new mechanisms (LSD214) | `src/book_world_mol_*.js` | ACCOUNT FOR NOW: second-world fixture before any new mechanism is called general (step 5) |
| Dr3 | **Planning text outrunning playable change.** LSD1 to LSD256 in two days, mostly proposals no lane reads (LSD216). This guide adds length too | LSD doc, this file | ACCOUNT FOR NOW: add no more LSD rounds unless a lane brief or check will read them; fold new ideas into the suggestion list here |
| Dr4 | **Human play check absent.** The be seat is agent-verified, not human-played. Under AD42 that is allowed | LSD212 | LATER, his call: fifteen minutes in the be seat on chapters 1-3 (level: human, effort: 15 minutes, done when he notes whether it feels like his life, legible and fun) |
| Dr5 | **Canon-only success paths.** The lead passes every test, so failure, refusal and being caught go unbuilt. OD12 says recovery stays forgiving by default, so failure paths need recovery rules, not just penalties | LSD227, OD12 | ACCOUNT FOR NOW: each system's failure path states its recovery |
| Dr6 | **A hidden number against "limits are adjectives".** Pull is a 0-1 number; AGENTS says limits are adjectives set per world and the player should learn through means | AD5, AD6, LSD233, LSD240 | ACCOUNT FOR NOW: pull stays engine-side; the player and divination see signs and bands (LSD92 risk bands), not the raw number unless a world gives a means for it |
| Dr7 | **Foreknowledge.** The spoiler concern (LSD93 marker off by default, LSD116 plans as intentions) is a display default the LSD doc proposes (LSD93 leaves the marker dial to his later call); the matrix should not let a reading field leak into UI text a reader of the book would not yet know | LSD161, LSD199 | ACCOUNT FOR NOW: Kn chapter's first slice includes the UI check at 1920x1080 |
| Dr8 | **OD24 versus AD44** (moved to 7 item 5) | OD24, AD44 | Flag only |
| Dr9 | **Original worlds.** LSD149 says canon-density zero needs no second engine, but nothing here tests it | LSD149 | LATER/DELEGATE: Luna medium, one original-world fixture (no constraints) on the same store; done when it runs with fills only and two identical runs match |
| Dr10 | **Persistence of new state.** Pull is derived, not saved (LSD245); save deltas and provenance codes are (LSD143). Persistence rules (AR6, FLR5) still need Save, reload, Export, Import for each new state | AGENTS | ACCOUNT FOR NOW: each slice names its save delta or says none |

**Round 2 (2026-10-29, after Weibao asked how to reconcile drift long term).** Turn each drift into a check or a place a check reads, because prose rules without a check recur (GROUND_RULES). Proposals; the coordinator owns the lane brief template, so these are changes to propose to it, not edits made here.

| Round | Disposition |
| --- | --- |
| Dr1 | ACCOUNT FOR NOW: the section 6 step 2 metrics (reachable share, playable share over great beats, fold-loss count, distinct verbs, emergent canon rate) are the headline of the ON10 morning note |
| Dr2 | ACCOUNT FOR NOW: a mechanism is reported as general only with a second-world fixture and a harvest-ledger row (LSD230); a done-check line in the brief template |
| Dr3 | ACCOUNT FOR NOW: no new LSD lines unless a brief or check reads them. Done 2026-10-29: `docs/LEAD_LIFE_RULES.md` exists with a register row (no new codes). LATER: move each newly accepted line into it with his words and date; done when every accepted line in USER_VISION and PROJECT has a rulebook row |
| Dr5 | ACCOUNT FOR NOW: a brief line asking for a failure path plus its recovery (OD12 forgiving by default) |
| Cross-doc dedupe | Done 2026-10-29 for canon, fate and pressure: [owner map](TIMELINES_AND_DIVERGENCE.md#canon-fate-and-pressure-one-owner-per-concept-2026-10-29). Authority was deduped rather than text: restating docs are dated or accepted history and keep their wording. LATER: other concepts get a map only if they cause a real conflict |
| Recurrence | ACCOUNT FOR NOW: rerun this drift check at each wave checkpoint as a new round here, without restarting codes |

**Adjacent ideas outside this guide's authority (suggestions, not dispositions):**
a one-page "what you can play today" card per integration (LSD212 suggestion); a one-page
family map with step counts and owners once MF1 reports; a pull inspector in the existing
inspector (LSD145, inspection only); splitting this guide's matrix into a generated file so
the reader fields cannot go stale.

## 9. Coverage of LSD165-LSD256

Every line appears below as a section reference or is listed as dropped. Section 19-25 ideas
are covered as follows. Nothing is dropped; where an LSD line is a suggestion or already done,
it is labelled.

| LSD | Where in this guide |
| --- | --- |
| LSD165 | 1 (content scales), 6 |
| LSD166 | 6 step 1 |
| LSD167 | 1, 6 step 3, 7 item 1 |
| LSD168 | 2 (accepted), 6 |
| LSD169 | 6 step 7 (cards hold the long tail) |
| LSD170 | 6 step 1 |
| LSD171 | 4.8 |
| LSD172 | 3.2 (`kind`), 4.6 |
| LSD173 | 1 |
| LSD174 | 6 (cost per lane) |
| LSD175 | 6 step 3 note; suggestion list in 8 |
| LSD176 | 5 (golden slices belong to the beat checkpoint join) |
| LSD177 | 6 step 7 ordering |
| LSD178 | 6 and 8 Dr1 (fidelity as a curve) |
| LSD179 | 6 step 6 |
| LSD180 | 6 step 1 |
| LSD181 | 6 step 3 (paragraph packets stay private, LSD153) |
| LSD182 | 6 step 3 |
| LSD183 | 6 step 6 |
| LSD184 | 6 step 6 |
| LSD185 | 6 step 2 |
| LSD186 | Dropped from this guide as engine tuning outside system reconciliation; stays LATER in the LSD doc (Sol low after P5) |
| LSD187 | 5 (affected-family tests) |
| LSD188 | 6 (print before and after) |
| LSD189 | 8 (decisions collect in one list) |
| LSD190-LSD194 | 3.2 and 6 step 1 |
| LSD195-LSD199 | 3.4 (missing fields) and 7 item 5 |
| LSD200-LSD203 | 6 |
| LSD204 | 3.2 and 7 items 4-5 |
| LSD205 | 6 step 1 done check |
| LSD206-LSD208 | 3.2, 7 items 4, 5, 9 |
| LSD209-LSD211 | 1, 7 item 1, 8 Dr1 |
| LSD212 | 6 and 8 Dr4 |
| LSD213 | 8 (open-run choice per mechanism; folded into the first-slice lines) |
| LSD214 | 5, 6 step 5, 8 Dr2 |
| LSD215 | 6 (load by window before pack growth) |
| LSD216 | Opening and 8 Dr3 |
| LSD217 | 4.5 (money and time windows stay exact) |
| LSD218-LSD220 | 4.9, 7 item 6 |
| LSD221-LSD223 | 4.4, 6 step 8 (technical versus story butterfly; divergence view) |
| LSD224 | 5, 6 step 4 |
| LSD225 | 1 (mechanisms as world modules) and 6 step 5 |
| LSD226-LSD230 | 1, 5 |
| LSD231-LSD232 | Not built into the order: model fine-tuning waits for enough reviewed rows (LATER). The rule "keep rows tune-ready" is in step 1 sidecar `source` and locator |
| LSD233-LSD235 | 1, 7 item 2 |
| LSD236-LSD238 | 1, 6 step 2 |
| LSD239-LSD241 | 1, 4.3, 6 step 8, 7 item 3 |
| LSD242-LSD245 | 1, 6 step 8, 8 Dr10 |
| LSD246-LSD254 | 3 and 4 |
| LSD255 | 3 |
| LSD256 | 5 |

Mechanical check (run 2026-10-29): every integer from 165 to 256, ranges expanded, appears as an LSD code in the text above this section, not only in this index.
