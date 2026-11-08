# Portal multiverse worlds ideaboard (2026-11-07)

Request (Weibao, 2026-11-07): "ideaboarding implementing worlds like rick on morty? what that would require and more?" Then: "save ideaboarding accordingly" ([direction log](../gm/USER_VISION_LOG_2026-11.md#portal-multiverse-worlds-ideaboard-2026-11-07), [register](../gm/WRITEUP_REGISTER.md#portal-multiverse-worlds-ideaboard-2026-11-07)).

Status: **proposal palette**, not accepted direction, not implemented. Codes PRT1+ are local to this doc (prefix checked clean 2026-11-07). Extends [multiverse structures](MULTIVERSE_STRUCTURES.md), [world entry rules](../WORLD_ENTRY_RULES.md) WER1-WER17, [selves and echoes](../SELVES_AND_ECHOES.md), [timelines](../TIMELINES_AND_DIVERGENCE.md) and [seeded worlds](../research/TIME_TRAVEL_AND_SEEDED_WORLDS_2026-10-27.md). It links to them and does not restate their specs. Later "more to consider?" rounds extend this doc with new codes.

## Reading

"Worlds like Rick and Morty" names a premise family, not one world: a home world plus a personal crossing device that reaches near-infinite variant dimensions, each one changed law away from a known base, with counterpart selves, a crossroads of selves, gadget invention, cross-dimension police and money, and a comic, cruel, whimsical tone. Two delivery forms, by AD5 both:

- **PRT1. Original analogue (default).** Our own premise: a home, a crossing device, our names, our dimensions. Player text carries no franchise names or characters. Credit the inspiration under WER15.
- **PRT2. Canon pack (condition).** Only as a private direct adaptation under WER11, the same footing as HP and LOTM. Canon names follow NMR6. Sequenced after the LOTM and HP lead lines (risk R1 below).

## What it requires, mapped to what exists

Ranked by how much the premise breaks without it. "Exists" means a module in `src/` today; behavior beyond its own tests is not verified here.

| Code | Requirement | State | Where |
|---|---|---|---|
| PRT3 | **Many instances of one world at once.** A dimension is an instance of a base world with its own history, era and continuity, linked to a parent. | Exists as records | `src/world_instances.js` (`parentInstanceId`, `continuityId`, `eraId`, visits, `planWorldClock`); TIMELINES T4 |
| PRT4 | **Cheap near-infinite dimensions.** A dimension is a seed plus a small law diff over a base world, stored as seed-only until first visit. Visited ones keep only what changed. | **Gap** (inference: built from the parts in the next column) | `src/seeded_streams.js`, `src/keyed_generation.js`, `src/premise_generator.js` (tone axis: ordinary, odd, villain, funny); seeded-worlds C1 DT1 |
| PRT5 | **A personal crossing device as carrier.** Whole-body transport (XM3) with the device as the WER9 carrier; fuel or charge is the cost dial; losing the device strands you (AD50 run-ending threat with two exits). | Partial | `src/realm_connections.js`, `src/realm_cargo.js`, `src/backlog_expansion_transit.js`, `src/realm_clock_leases.js`; WER2/WER9 |
| PRT6 | **Counterpart selves who are other people.** A counterpart shares your past up to the fork and is a separate person after it (MULTIVERSE "branching histories"). Replacing a dead counterpart is a WER3 identity-and-papers start. | Partial | LT8 person record `src/person_ties.js`; SELVES G4, G8-G9 |
| PRT7 | **Law diffs that actually change mechanisms.** "Gravity is sideways", "everyone is furniture", "money is a feeling" must change what actions do, by AD38, not repaint text. | **Gap** | Needs a law-diff layer the world port reads (AD51 shared seam); [cross-world transfer](../CROSS_WORLD_SYSTEMS_TRANSFER.md) LT5 bring-up recipe |

Second tier, each with an existing owner:

- **PRT8. Crossroads of selves (hub).** A city run by counterparts, with its own politics, is a WER17 hub. It answers who runs it, time rate, what crosses and whether visited worlds are copies.
- **PRT9. Gadget invention.** Name a goal and get a knowledge-filtered roadmap: [technology](../TECHNOLOGY_AND_PROGRESSION.md) round 5 procedural invention. Gadgets are the main progression here, more than ranks.
- **PRT10. Cross-dimension police and law.** They act only where they hold a claim, knowledge and reach (2026-11-06 authority direction); a strong enough traveller can refuse them.
- **PRT11. Money across dimensions.** Local currencies do not cross by default (ECR27, OD11); a hub currency or barter in rare matter does.
- **PRT12. Abandoned worlds keep running.** A wrecked dimension persists under the MULTIVERSE persistence axis; returning shows the consequences. Compaction keeps this cheap (visit-history compaction in `src/proto23_world_state.js`, `src/book_world_mol_state.js`).
- **PRT13. Tone.** Whimsy, cruelty and cartoon logic follow [prose rules](../PROSE_RULES.md) PRS1-PRS8 and the medium notes in [comic worlds](../COMIC_WORLDS_AND_MEDIUM_CONSIDERATIONS_2026-10-14.md). Cartoon physics is a law diff (PRT7), not a separate engine.

## ACT NOW (done in this doc)

- PRT1-PRT13 above: premise split, ranked requirements with code state.
- **PRT14. Dimension address.** A dimension is `[baseWorldId, revision, seed, lawDiffIds]`. Same address, same dimension, matching the FND1 keying `premise_generator.js` already uses. Coordinates you write down let you return; a random jump draws a new seed.
- **PRT15. Law-diff kinds (palette).** Pick per dimension, usually one, sometimes two:
  - Physics: gravity, time rate, scale, material behavior.
  - Biology: who is alive, what species rule, bodies made of something else.
  - Social: who holds power, what money is, which taboo is reversed.
  - History: one event went the other way (TIMELINES fork point).
  - Medium: the dimension runs on cartoon, game or story logic (comic medium notes).
  - Identity: you, or your counterpart, are the famous or hated one here.
- **PRT16. What a hop costs.** Charge or fuel, device wear, local exposure (being noticed by WER12 world mechanisms), time drift against home (clock leases), and the chance that the arrival point is hostile. Each is a dial per device.

## ACCOUNT FOR NOW (shape early work so these stay possible)

- **PRT17. Home is a lived place.** The point of the premise is a family home that the chaos keeps returning to. That fits the lived-home direction and the [Paradise hub](paradise-hub/WORLD_BRIEF.md) pattern; home relationships strain or grow with what you bring back.
- **PRT18. Counterpart memory and knowledge.** Counterparts know their own world, not yours (truth, knowledge and display stay separate, AD6-AD8). Meeting one is a knowledge exchange with a trust cost.
- **PRT19. Bringing things back.** Items, creatures and people crossing home are WER9 carrier questions; a stray creature or a counterpart who follows you is a consequence, not a bug.
- **PRT20. Save size.** Seed-only unvisited dimensions, diff-only visited ones, compaction for long-abandoned ones. No full world snapshot per hop.
- **PRT21. Other book worlds as dimensions.** A device that can reach HP or LOTM instances is a cross-world premise (WER1 dial). Default: the device reaches its own family of variants; reaching a book world needs a stated in-world reason and a heavier cost.

## LATER / DELEGATE

| Code | Item | Level | Effort | Done check |
|---|---|---|---|---|
| PRT22 | Law-diff seam design (PRT7): which world-port hooks a diff may change, with two worked diffs on one base world | Sonnet design lane | M | Doc names the hooks; a focused test shows one diff changing an action's result |
| PRT23 | Seeded dimension generator (PRT4, PRT14) over `seeded_streams` and `premise_generator` | Sonnet code lane | M | Same address yields the same dimension across reloads; unvisited ones add no save field |
| PRT24 | First playable slice (below) | Sonnet code lane | L | Browser at 1920x1080 from a fresh origin: hop, see the diff change play, return, save, reload |
| PRT25 | Crossroads hub WER17 answers (PRT8) | Sonnet design | S | All WER17 questions answered |
| PRT26 | Canon pack source pass (PRT2), if Weibao wants it | source-deep-dive | L | Entry, device, hub and tone mechanisms catalogued under WPR rules |

## Proposed first slice

One crossing device as a carrier into seeded variants of an already-built world, using existing records (PRT3, PRT5) plus the two gaps (PRT4, PRT7) at their smallest: three hand-picked law diffs and a random-seed jump. Base world default: the HP or LOTM home district, since Frontier and Mistglass get no new depth. Rejected: a new original home world first (more content before the seams prove out) and Frontier as base (test bed only).

## Risks

- **R1. Sequencing.** LOTM and HP lead lines are the standing priority. This premise mostly needs seams (PRT4, PRT7) that also serve parallel book worlds, so the seam work can go first without new world content.
- **R2. Infinite content trap.** Near-infinite dimensions are only worth it if diffs change mechanisms. A dimension that differs only in text is a skin.
- **R3. Tone drift.** Cruel comedy beside HP and LOTM's own tones needs per-world prose dials, not one voice.

## Naming sample (NMR)

No naming sheet exists for an original portal world yet. Nearest register to borrow: "Hub-and-lab register: station names, ecology and salt-works vocabulary" (Paradise hub, [naming sheets](../names/WORLD_NAMING_SHEETS.md)). A world pass for PRT1 adds its own sheet.
