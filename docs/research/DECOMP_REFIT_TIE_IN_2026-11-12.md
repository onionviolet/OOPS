# Decomp re-fit onto the tie-in gaps, 2026-11-12

Weibao (2026-11-12): "we already have a pror design decomp somewhere, and then we
can use how they do it for our own stuff? We have alot of thoe", then "COnsider
specific UI elements and how they organize stuff and more? How they implement
ideas nad more? Refit accordingly?"

This repeats the [October re-fit](DECOMP_REFIT_2026-10-22.md) against today's
engine: the contest, the engine world, spellcraft, the Gu work and enchanted
gear. It maps what the game dossiers already record onto the gaps named in the
[tie-in considerations](../PROCEDURAL_CARRY_OUT.md#tie-in-considerations-seam-fun-screen-and-the-fight-system-2026-11-12)
(codes TV, N, TC, FK, SF, GP, AE there). Findings and proposals only (AD32). It
selects nothing, changes no order and authorizes no runtime work. Engine first
still holds (PC95).

## Method and limits

- **Readers.** Six haiku readers, one per topic, each grep-led over named
  dossiers with a cap of about 12,000 source words and at most 14 rows back.
  One pass, no retries. About 523,000 reader tokens and 75 tool calls in total
  (AU2). All six ran at once, above the default of two at a time; the reads
  were disjoint and nothing was written by a reader.
- **Sources.** 41 dossiers under `docs/research/` plus the panel design
  absorption, the UX reference screens, the Proto23 UI source absorption and
  the UI density audit. Large dossiers (RimWorld, Minecraft, Hogwarts Legacy,
  Academagia) were grepped, not read whole.
- **Evidence labels** are the dossiers' own, as the readers reported them:
  **C** confirmed in source or data, **P** partial, **S** stated by help text,
  developer or wiki. The coordinator reopened seven rows in their dossiers
  (TR8, TR9 queue wording, TR14, TR16, TR18, TR23, TR36) and all matched. The
  other rows are reader extractions.
- **Seams.** Every `src/` path below was checked to exist on the shared
  checkout at `4d4505223` plus live edits. Existence is all that was checked;
  nothing was built, tested or played for this pass.
- **Numbers** from other games are reference shapes. Our values come from each
  world's source (AD49).

## What the dossiers are good for

Strong: bodies and wounds, spell composition, automation queues, how to show
unknown information, how gear grants and retracts what it gives, and dense
screen organization. Thin or silent: the layout of a fight screen, how a spell
duel resolves, how damage types meet resistances, and feeding schedules for kept
creatures. Those four are listed under [what is missing](#what-the-dossiers-do-not-hold).

## Fight panel

| Code | Take | From | Lands on | Closes |
| --- | --- | --- | --- | --- |
| TR1 | Three stable regions: you and your reserves at left, the fight in the center, a full-height log at right. Selecting a row opens a neighboring detail area. Compact and expanded views share one state owner and one command path | Proto23, via [panel design](PANEL_DESIGN_ABSORPTION_2026-10-15.md) G1, P23-3. Composition is a proposal there | `src/tempo_fight_domain.js` panel | TV1 |
| TR2 | An acceptance line that already exists: retreat, the opponent's state and at least five recent log lines visible together at 1366×768 and 1920×1080 | [UI density audit](../UI_DENSITY_AND_ORIGINAL_COMPARISON_AUDIT_2026-10-13.md) F3, slice A3 (open, measured on an older build) | Fight panel proof | TV6 |
| TR3 | Log categories with filter chips that appear when a category first occurs, and a capped history per category | Kittens Game (21 filters, 40 entries), Evolve (60 per tag), Trimps (Story, Combat, Notices with kept filter settings), all source-read in the audit | Reports | N6 |
| TR4 | Odds sit on the option. A character who has not earned the number sees a word; cost and the reason show on hover | Disco Elysium, [UX reference screens](GAME_UX_REFERENCE_SCREENS_2026-11.md) pattern 5 (proposal under AD56) | `tempoView` odds word, `quoteContestOdds` in `src/contest.js` | TV1 |
| TR5 | A `?` on the exact unknown cell with a hover that says how to find out; five steps of knowing with their own look; a known value's hover says how it was learned | Caves of Qud, NetHack, RimWorld, same doc patterns 1 to 4 and 11 | `src/knowledge_record.js`, UR157 | TV3 |
| TR6 | Five idle states (running, blocked, awaiting input, complete, lost access), rows and selection that stay put under live ticks, a scrolled-up log left alone | Panel design M4 and M5 | Fight panel and policy runs | N5 |

## Fights on a policy, and away

| Code | Take | From | Lands on | Closes |
| --- | --- | --- | --- | --- |
| TR7 | A policy is a queue of rows run top to bottom, each with a count, a repeat mode and skip-if-stuck. Separate queues run side by side | Your Chronicle's Sloth, [automation and party](your-chronicle/pass-2026-10-14/AUTOMATION_AND_PARTY.md) (S: help text; scheduler unread) | Contest policy over `defaultChoice` | N5 |
| TR8 | A preferred costly move with a fallback: when the shared reserve cannot pay, the default move is used and the assignment is kept | Your Chronicle, [party and equipment trace](your-chronicle/traces/PARTY_AND_EQUIPMENT.md) T2 (C) | The Gu contest pack already has an unfunded fallback; show it as a policy row | N5, GP4 |
| TR9 | Missing fuel suppresses the player's attack while the opponent keeps its cadence. It does not end the fight by rule | Melvor Idle, [report](melvor-idle/REPORT.md) combat fuel row (C) | `src/ready_stock.js`, CBR26 | TC11 |
| TR10 | Catch-up runs the same ticks and the same death check as play, under a cap; away combat is opt-in | Melvor Idle offline bounds (C); Legends of Idleon dispatches by activity and needs a minimum elapsed time (C) | `src/away_bank_domain.js`, CFC12, CBR27 | N5 |
| TR11 | When a rule change invalidates a running plan, stop it, keep the plan and show the blocked reason. Give scripted play a per-update budget and a single-step control | Antimatter Dimensions Automator, [report](trimps-antimatter/REPORT.md) F12, F14 (C) | Later; any saved policy | N5 |
| TR12 | A roster readout: who is doing what and for how long, without opening each one | Legends of Idleon, [AFK digest](legends-of-idleon/AFK_AND_LEGIBILITY_DIGEST.md) (P) | `src/return_digest_ui.js` | N5 |

## How opponents choose

| Code | Take | From | Lands on | Closes |
| --- | --- | --- | --- | --- |
| TR13 | Simulate each candidate move and target, score damage, kills or downs, healing, lasting effects and position, then act. Skill decides whether the best, the average or a skewed score is used, and how many candidates are tried: `clamp(14 + 4 × level, 1, 150)` | Vagrus, [deeper systems](vagrus/aspects-2026-10-14/DEEPER_SYSTEMS.md) D3 (C, bounded read) | `defaultChoice` in `src/contest.js`. The contest is pure, so a candidate can be tried on a copy | TC10, N2 |
| TR14 | Weighted multi-beat sequences with a chance gate before each beat, kept in separate idle and fighting queues | Discworld MUD, [deeper systems](discworld-mud/aspects-2026-10-14/DEEPER_SYSTEMS.md) (C for the queues; its combat file is unread) | Simple creatures and opponent lines | TC10 |

TR13 replaces the behaviour-tree library floated earlier in chat. It also gives
the policy-spread check (N2) its "skilled opponent" for free.

## Bodies, wounds and recovery

| Code | Take | From | Lands on | Closes |
| --- | --- | --- | --- | --- |
| TR15 | Capabilities are derived from parts in a fixed pipeline: a zero rule, the anatomy worker, offsets, factors, a cap, a floor. Moving is zero once about half the limbs are gone. Current injury, a grafted part and effective function are separate values | RimWorld, [systems](rimworld/pass-2026-10-14-systems/SYSTEMS.md) S01 (C) | `src/harm_state.js` rungs and `actionModifiers` | TC1 |
| TR16 | Treatment quality = clamp((healer × medicine + bed) × self-treat factor, 0, medicine's ceiling), with stated defaults for no healer and no medicine. A tended day moves one severity component by that quality | RimWorld S02 (C) | A treatment action; `src/harm_engine.js` | TC13 |
| TR17 | In that game the health panel lists the affected parts and builds each treatment button from the wound's fields plus the supplies on hand. A bandage can hide the wound under it, so treatment state and what the player knows are separate | Project Zomboid, [body and actions](project-zomboid/BODY_AND_ACTIONS.md) BD7 (C) | `src/read_models/body_bridge.js` | TC1, TV3 |
| TR18 | Injury slows an action by a multiplier, `1 + hand-to-forearm pain / 300`, and some actions ignore it (reading) | Project Zomboid BD5 (C) | CBR22; `actionModifiers` | TC1 |
| TR19 | Status icons are derived readouts. The wound fields stay the authority | Project Zomboid BD3, BD4 (C) | Vitality shown as a percent beside named wounds | TC1 |
| TR20 | A limb is original, stump, replaced or crushed. A replacement is an item with its own tradeoffs. Upkeep of a made body and healing of a born one are different services | Kenshi, [bodies](kenshi/second-pass/BODIES.md) B1 to B5 (C for the states; P for thresholds and throughput) | The body alteration family | TC13 |
| TR21 | Healing names what it repairs (a wound, a tissue, a nerve, bleeding, infection) | Dwarf Fortress, [report](dwarf-fortress/REPORT.md) DF-B01 to B04 (P) | Recovery rows per world | TC13 |

Battle Brothers' dossier keeps ordinary defeat as unconsciousness and recovery,
with lasting wounds and death as separately chosen rules (P). That matches
AD19 and the per-contest stakes proposal (FK13).

## Spells and the spellbook

| Code | Take | From | Lands on | Closes |
| --- | --- | --- | --- | --- |
| TR22 | Six owners of cast state, each with its own lifetime: the focus (capacity, delay, recharge, spread), the card (uses left), the cycle, the cast group (modifiers), the cast as a whole (mana), the payload. A card that cannot be paid for is skipped and the next one tried | Noita, [composition digest](noita/COMPOSITION_DIGEST.md) evaluation model (C) | Kernel working plus `src/stored_working.js`; the wand as an instrument with its own numbers (CBR17) | SF1 |
| TR23 | A spell is a delivery method followed by effects, and in that mod each effect takes the modifiers written straight after it. Validation is caps: one method, so many of each modifier | Ars Nouveau, [report](ars-nouveau/REPORT.md) F2 (C) | `src/spell_grammar.js` rows | T5 |
| TR24 | A stored spell can be run by a fixture that pays from its own supply and skips the caster's reserve | Ars Nouveau F5 (C) | A stored working with `draw` | FK8 |
| TR25 | The spellbook is one list sorted by kind, then cost, then name, with quick slots. A fizzle from the surroundings can still spend the cost | Magical Diary, [school and spells](magical-diary-wolf-hall/SCHOOL_AND_SPELLS.md) F2 (C, from reconstructed code; recheck numbers before use) | `src/spellbook_ui.js` | TV4 |
| TR26 | A spell record keeps cooldown, the kinds of target it accepts (living, object, plant, dead, water) and an out-of-fight multiplier as separate fields | Hogwarts Legacy, [spell and lesson digest](hogwarts-legacy/SPELL_AND_LESSON_DIGEST.md) (C, extracted data, not played) | Target kinds on spell rows, so a cast can aim at the room | SF4 |
| TR27 | Knowing a spell and being able to cast it now are different gates. In that game practice is credited when the cast could be paid for, and an unaffordable one earns nothing | Magic Research 2, [report](magic-research-2/REPORT.md) F1 to F4 (C, demo source) | `src/spellbook_workings.js` | TV4 |
| TR28 | A move with no valid target or missing equipment exits before any payment. A legal one completes even when its secondary effect is resisted. A held stance reserves part of the reserve while it is up | Tales of Maj'Eyal, [report](tales-of-maj-eyal/REPORT.md) T2 (C) | Contest moves; reservations shown in the aperture | SF2, GP1 |
| TR29 | Learning takes a successful lesson as well as the prerequisites; meeting the numbers alone teaches nothing | Magical Diary F1 (C) | Lessons, `HP_SPELL_PRACTICE` | T6 |

## Gu panel

| Code | Take | From | Lands on | Closes |
| --- | --- | --- | --- | --- |
| TR30 | The reserve is both a pool and a gate. A conversion drains it per tick while quality builds, an advance needs it nearly full plus items, and a failed attempt keeps what it spent and raises the next chance | Amazing Cultivation Simulator, [cultivation trace](amazing-cultivation-simulator/traces/cultivation.md) (C) | Aperture, refinement bench | GP1, GP6 |
| TR31 | Automatic upkeep as ticked rows up to a slot cap, spent in list order through the same call as manual play, and returning before any payment when it cannot proceed | Your Chronicle auto-summon, party and equipment trace T1 (C) | Auto-feeding in list order through the existing feed action | GP3 |
| TR32 | A favorite mark and "in the current loadout" both protect a piece from being consumed | Your Chronicle T3 (C) | A keep mark on a Gu before refinement or fusion can take it | GP2, GP6 |
| TR33 | A browser with filters for name, kind, trait, fused, known, equipped, rarity and favorites, and labels that tell permanent from temporary | Siralim Ultimate, [builds](siralim-ultimate/BUILDS_AND_COMPUTATION.md) UI pattern (C for labels, P for layout) | The Gu list | GP2 |
| TR34 | Fusion keeps the primary's identity (id, nickname) and takes kind and traits from both | Siralim Ultimate, [systems](siralim-ultimate/pass-2026-10-14-systems/SYSTEMS.md) D05 (P) | Lineage on fused Gu | GP6 |
| TR35 | One carrier with typed sockets, opened by tier | Siralim Ultimate build layers (S) | A killer move as typed roles to fill | GP4 |
| TR36 | Starting work reserves its cost and cancelling unbuilt work returns it. A recruit's price rises with how many are already kept | KeeperRL, [report](keeperrl/REPORT.md) five paths (C) | The story route already reserves and refunds refinement; same shape for the bench | GP6 |
| TR37 | Matching elements multiply the gain (100, 200 or 50 percent) with a disorder term; gains toward an affinity fall off steeply | Scroll of Taiwu, [sects and study](scroll-of-taiwu/SECTS_AND_STUDY_DIGEST.md) (C); cultivation idlers F2 (C) | Palette for aperture growth | GP1 |

## Enchanted gear and items

| Code | Take | From | Lands on | Closes |
| --- | --- | --- | --- | --- |
| TR38 | Wearing applies each of the item's entries as a temporary value and records the ids on the item; taking it off removes exactly those. Gear can grant an ability the same way and retract it | Tales of Maj'Eyal, [equipment reader](tales-of-maj-eyal/EQUIPMENT_READER.json) equip-and-remove (C) | The contest's loadout read at release (ENF20) | AE1 |
| TR39 | Block is a timed effect that subtracts its power from incoming damage of the kinds it supports and leaves other kinds alone | Tales of Maj'Eyal T5 (C) | One layer reader, now in `src/gu_defense.js` | AE4 |
| TR40 | An affix comes from a pool named on the base item, with a chance that rises with level; material tier is its own field and later scales the affix | Tales of Maj'Eyal T5 (C) | Generated gear and opponents with typed kit | AE3 |
| TR41 | What a kind of item is, what state this one is in, and what the character has identified are three records. Per-object status runs unknown, partial, known, with a shared table by blueprint | NetHack, [report](nethack/REPORT.md) point 2 (C); Caves of Qud, [knowledge audit](qud-systems-audit-2026-10-15/KNOWLEDGE_RECIPES_AND_MATERIALS.md) S4a (C) | `src/item_identity.js` already has this shape | ENF19 |
| TR42 | The bench splits Build from Modify, with category, search, collapse and cost on each row. Starting rechecks everything and reports each missing means separately | Caves of Qud, [UI implementation](qud-systems-audit-2026-10-15/UI_IMPLEMENTATION.md) U7 (P) | Enchanting and refinement benches | AE2, GP6 |
| TR43 | The bench quotes before work (target, grade, inputs, capacity, stability), then shows the actual result, with an explicit discard that says what is lost | Potionomics, [report](potionomics/REPORT.md) F4 (P) | Same benches | GP6 |
| TR44 | Each wanted component rolls on its own: success if 1 to 100 is at most `min(99, power + skill + bonus)`. Room on the item is its quality minus what is already committed, and knowledge decides which components can be picked | Academagia, [systems](academagia/pass-2026-10-14-systems/SYSTEMS.md) DS02 (C) | `src/rune_grammar.js` capacity, ENF15 | AE5 |
| TR45 | Repair and averaged durability across parts; armor as separately worn pieces | Vintage Story, [aspects](vintage-story/aspects-2026-10-14/ASPECTS.md) (C for the shape, S for values) | ENF16 | AE2 |

## Screen organization across all four surfaces

| Code | Take | From | Lands on |
| --- | --- | --- | --- |
| TR46 | A panel or tab appears when a real event first supports it. Settings, save recovery and readable costs stay reachable throughout | Proto23, [UI source absorption](proto23/UI_SOURCE_ABSORPTION_2026-10-13.md) F1 | The Gu panel and spellbook appear with the first Gu or spell |
| TR47 | One scroll owner per region, tight rows near 30 px, a tall log | Same doc F2; the audit counts nine nested scrollers in the fork (open) | All four surfaces |
| TR48 | Show unlocked rows and one next-locked row with what it still needs | Progress Knight, audit section 7 | Spellbook, moves, Gu recipes |
| TR49 | Cost, time, effect and affordability sit on the control. A locked choice stays visible with met and unmet requirements where that is not a secret | Universal Paperclips, Fallen London, audit section 7 | Every action row; FBK4 |
| TR50 | Rows with no knowledge fold into one line ("Untried: A, B, C") | UX reference screens pattern 2 | Other people's Gu, unknown spells |

## What the dossiers do not hold

| Code | Missing | Nearest material already on disk |
| --- | --- | --- |
| TM1 | The layout of a fight screen: turn order, target selection, where the opponent sits. The dossiers read here do not describe one | The audit's F3 measurements of our own; Your Chronicle's battle log asset (98 rows, inventoried and unread) |
| TM2 | A fight policy with retreat thresholds or priority lists | TR7 and TR8 are the nearest shapes |
| TM3 | Morale, surrender, knockout or flee formulas in any of the eight body dossiers | Discworld's combat file (3,337 lines) and Kingdom of Loathing's combat module are inventoried and unread |
| TM4 | How a spell duel resolves: interruption, counter, deflect, disarm. Hogwarts Legacy's colored shields rest on help text, and Academagia's duel math is open | Our own Duelling Club test is ahead of the dossiers here |
| TM5 | A damage type against resistance formula and its order with armor | Our `src/damage_types.js` and ENF8 are ahead here too |
| TM6 | Equipment screen layout and the order of lines in an item tooltip | None |
| TM7 | Feeding schedules, a daily upkeep summary or days of stock for a kept creature | None. The upkeep ledger (GP3) is ours to design |
| TM8 | Fusion or breeding odds and what a failure loses | Amazing Cultivation Simulator's refining loss is the one example found |
| TM9 | A summary screen for time away | Rate and cap math (TR10), with no screen described |

Proposals, none started: read the three inventoried combat sources for TM3;
take screenshots of reference fight screens for TM1 and TM6 with the
`ui-benchmark` skill, since layout is seen faster than decompiled; and treat
TM4, TM5 and TM7 as places where our own engine leads and the books are the
source.

## If only five were used

1. **TR13** for opponents, because it also powers the fun check.
2. **TR17** with **TR15** for the body panel: list the affected parts and build each button from the wound and the supplies.
3. **TR7** with **TR8** for policy fights.
4. **TR38** for gear in a fight, which is the open ENF20.
5. **TR1**, **TR4** and **TR5** as the fight panel's frame.
