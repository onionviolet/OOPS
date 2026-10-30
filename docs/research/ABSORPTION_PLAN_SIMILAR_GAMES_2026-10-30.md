# Absorption plan from the 2026-10-30 similar-games surveys

Design and planning pass; no runtime code changed. Everything here is a proposal (AD32): nothing is accepted until Weibao
says so, and no slice starts without his go. Inputs: [beyond-protolike survey](SIMILAR_GAMES_BEYOND_PROTOLIKE_2026-10-30.md)
and [protolike fork survey](PROTOLIKE_FORKS_AND_SIMILAR_GAMES_2026-10-30.md).
CBD1-CBD10 (damage and protection types) are already decided in
[the combat considerations](../COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md) and are not redone. Applies AD5, AD33,
AD38, FND5, CX1-CX3 and WPR23. Closed-game numbers (Dominions, EVE, DragonRealms) and copyleft constants (Veloren,
SWGEmu) are not copied; shapes are.

## Classification

Classes: **covered** (cite file), **deepen** (extends a live system), **new** (new mechanism with an owner),
**poor fit** (reason). Size S, M or L. "Lane" marks files other sessions are editing now.

| # | Mechanism | Source | Our owner | Class | Size | Dependencies and cautions |
|---|---|---|---|---|---|---|
| 1 | Ingredient quality as an axis that also reads as risk and tool tier | SWGEmu | Quality already exists: CE4/SC11/NX12 graded stacks, PD5, TQ1-TQ3, TQ9, TQ11, PD7; PC61 corrected to a connection, PC63 | mostly covered; the gap is the reader into hazards | S-M | none running; AGPL, shape taken; confirm what reaches the brew first |
| 2 | Declared study queue at a stat-set rate; empty queue wastes time | EVE | SKILLS EL31; SLC108, SLC110 | deepen | M | rides on away-bank spend (`src/away_bank_domain.js`, lane) |
| 3 | Per-skill absorption band that drains with rest | DragonRealms | SKILLS SLL12, SLC-P; SLC107 | new | M | community-reported, shape taken; away-bank lane |
| 4 | Weekly settlement of standing arrangements, one report line on return | Arx | S19 `src/clock_owner.js` (lane), `src/return_digest_ui.js`; recorded in this plan | new | M | clock_owner has uncommitted edits; name one arrangement owner (rent, wage, dues) first |
| 5 | One condition record across body, items, places | Ostranauts | WDI60 (LOTM strain meter); WDI61 | deepen | L | `src/effect_dsl.js` (lane); FND5 wants a second-world consumer named first |
| 6 | Verb shown only when actor and target tests both pass | Ostranauts, SS14 | S11 expansion engine; AY2 keeps unavailable verbs visible and disabled with a reason; WDI62 corrected | covered; display choice differs (AY2 wins by default) | none | hide only for options the character cannot perceive (TQ6) |
| 7 | Paired world dials, point budget with refunds | Dominions | WORLD_DIALS; WDI63 | new | M | creation screen; numbers unverified |
| 8 | Advance cost grows with value (smooth curve) | Daggerfall | SKILLS SLL12 plateau; SLC106 | deepen | S | would replace the plateau table, not sit beside it (SLR27) |
| 9 | Rank gate: standing + qualifying skills + time floor | Daggerfall | S5, PROGRESSION_GATE_RULES (GTR) | deepen | S | recorded in this plan; add as a GTR example when a rank slice is picked |
| 10 | Relationship fade, slower when strong, capped per entity | Veloren | RELATIONSHIPS RLI4; RLU5, RLU6 | deepen | M | conflicts with "trust does not decay" unless framed as a familiarity dial; AD33 later |
| 11 | Bounty-weighted follower autonomy with named refusals | Majesty | PIR, COMPANIONS; RLU7 | new | L | AD33 later |
| 12 | Coarse NPC advance while away + list of dropped actions | Veloren | `src/away_ledger.js` (lane), SIMULATION_AND_NPC_ARCHITECTURE; RLU8 | deepen | M | away-bank lane; AD33 |
| 13 | Skill groups per tool; content hash forces visible respec | Veloren | SKILLS, S12 persistence; SLC109 | new | M | needs the migration decision (old-save compatibility deferred) |
| 14 | World persists, person resets; heirlooms do not duplicate | Hundred Lives | DEATH_AND_RESET B4; U1 | covered (B4, starts palette P4 legacy row) | S | two-list naming |
| 15 | Failure keeps discoveries | Lowbridge | CRAFTING domain table "Failure gives", DP4; U2 | covered | none | |
| 16 | Death as a bought, located branch | Fabled Lands | DEATH_AND_RESET; U3 | new | S | default off, LATER |
| 17 | Banked time with objective stops and Accelerate | Lowbridge, Screeps, Clicker Heroes | `src/away_bank_domain.js` (lane); RLCE12, AD16 | covered in part (bank exists; edge stops per RLCE12) | none | comparator; do not change the lane |
| 18 | Earned away cap | Idle Clans | AD18 `ports.capacity()` hook in away_bank_domain | covered | none | |
| 19 | Property-based recipes, substitution | NEO Scavenger | `src/craft_recipes.js`, TQ7, G2 | covered | none | |
| 20 | Wound locations, bleed and shock | NEO Scavenger | BHR/CBR; combat-surface lane owns `src/damage_types.js` | deepen, LATER | L | no combat doc touched; reopen after the combat-surface lane |
| 21 | Reaction rows with thermal gate | SS14 | GEAR_DEPTH chemistry; PC62 | deepen | M | needs a named heat source |
| 22 | Tag selectors plus meters | IncRPG | AD38, WDI60; WDI64 | covered (direction) | none | |
| 23 | Data lint (no dead multipliers, optional systems as accelerants) | Dao Tree | `scripts/check_content_authoring.mjs` consumer check, `check_generators.mjs`; WDI65 | mostly covered; extend with one rule | S | extend, do not add a script |
| 24 | Manuals read in study hours, routine wheel | Severed Heaven | CRL49, S11, EL31; SLC110 | deepen | M | read the code first (SLC111); the LLM scene layer is out (AD38) |
| 25 | Age-banded event deck with unopened category icons | Alter Ego | STARTS_ENDINGS palette P4, LIFE_SIM_NORTH_STAR ("aging changes play") | deepen, LATER | M | recorded in this plan |
| 26 | Unreachable-content audit | Echoes Beneath | CX6; Proto23 section 6 | covered; diff the lists (survey L5) | S | |
| 27 | One flag bag with world-prefixed keys | Fabled Lands | S1 fact rules | poor fit | none | facts are already namespaced registry slices; one string map would weaken typed validation |
| 28 | LLM scene writing | Severed Heaven, Knight LLM | none | poor fit | none | conflicts with AD38 and mechanisms-first |
| 29 | Fork-network chassis (Knight, Idle Loops, NekoRPG) | protolike F7-F9 | none | poor fit for mechanics | none | mechanics already recorded elsewhere |

## Recommended first slices (at most five, none started)

Hosts follow current direction: the lead's life and book worlds; Frontier and Mistglass get no new depth.
A second overlap check (below) removed two earlier picks, so the list was rebuilt. Slices with no running-lane dependency come first.

1. **Ingredient quality has a consequence** (row 1; PC63). A wiring slice over the existing tag and axis system, no new stat.
   Player sentence: "A rotten ingredient makes this brew likelier to spoil, and the preview says so." Host: HP brewing.
   Not blocked. Done: FLR1-FLR6.
2. **Paired world dials at creation** (row 7; WDI63). Player sentence: "I spend a few points to make this world's
   order or turmoil, luck or misfortune lean my way, and getting weaker in one pair pays for the other." Host: a book-world
   start. Size M. Not blocked by a running lane; Dominions numbers are unverified, so invent the world's own pairs.
3. **Study queue, then absorption band** (rows 2, 3, 24; SLC110). Player sentence: "I queue three hours with this book;
   the third teaches less." Host: the lead's book study. Waits for the away-bank lane to commit `src/away_bank_domain.js`.
4. **Weekly return line** (row 4). Player sentence: "On return I read one line: rent paid, wage earned, dues owed."
   Host: the lead's village. Waits on `src/clock_owner.js` edits, and on an arrangement owner that does not yet exist
   (a search of `src/` found only `realm_clock_leases.js`, no rent or wage owner).
5. **Shared condition record, second consumer** (row 5; WDI61). Player sentence: "Strain and contamination both warn
   me the same way and fade the same way." Hosts: LOTM strain plus HP brewing contamination (FND5's second consumer).
   Waits for the `src/effect_dsl.js` edits.

Held behind lanes or AD33: rows 5 and 20 (effect DSL, combat-surface lane), 10-12 (NPC-heavy), 13 (migration decision).

## Second overlap check

Weibao asked whether ideas already exist. Checked again: ingredient quality (row 1) was mostly covered by the tag and axis
system and is now a wiring slice; verbs-by-test (row 6) conflicts with AY2; the dead-effect lint (row 23) is mostly in
`check_content_authoring.mjs`. Rows 2, 3, 4, 7 and 5 were not found elsewhere beyond what the table cites. Rows 8-13 and
16-21 still carry the first pass's lighter check; a lookup in the owning doc is the first step of any of them.

## Sequencing flags

- The combat-surface lane owns `src/damage_types.js` and [its PLAN](../gm/dispatch/ui-identity-combat-2026-10-30/PLAN.md).
  Row 20 waits for it. No combat doc was edited here.
- Away-bank work is live in `src/away_bank_domain.js` and `src/away_ledger.js`. Rows 2, 3, 12 and 17 are comparators.
- `src/clock_owner.js` and `src/effect_dsl.js` also have uncommitted edits and gate rows 4 and 5.
- Old-save compatibility is deferred, so row 13's hash needs an explicit decision first.

## Where each pick is recorded

Skills: SLC106-SLC111 in [SKILLS_AND_LEARNING](../SKILLS_AND_LEARNING_CONSIDERATIONS_2026-10-18.md). Relationships:
RLU5-RLU8 in [RELATIONSHIPS_AND_CANON](../RELATIONSHIPS_AND_CANON_CONSIDERATIONS_2026-10-18.md). World dials: WDI61-WDI65 in
[WORLD_DIALS](../WORLD_DIALS_AND_INTERPRETER_CONSIDERATIONS_2026-10-19.md). Crafting: PC61-PC63 in
[CRAFTING_ENGINE](../CRAFTING_ENGINE.md). Death and legacy: U1-U4 in [DEATH_AND_RESET](DEATH_AND_RESET_CONSIDERATIONS_2026-10-10.md).
Rows 4, 9 and 25 are recorded in this plan; no existing owner had a fitting section.

## Verification state

Documentation change. Coverage calls rest on file reads and ripgrep of `docs/` and `src/` on 2026-10-30; `craft_recipes.js`
and the Skills plateau code were read at header and comment level. Highest state: drafted, agent-checked, not human-reviewed.

## More to consider

ACT NOW (done): classification and five owner sections. ACCOUNT FOR NOW: the lane flags above. LATER: survey research
reads L1-L7 stay in their source docs; reopen row 4 when a standing arrangement (rent, wage) exists in the lead's life;
reopen row 25 with a life-stage slice.
