# Health lane report, 2026-10-14

**Completed:** documentation consolidation and extension only. Followed `runs/COMMON.md`; wrote only the two assigned files. No code, bundle, test, save, pack, index, part 32/33, commit or push change. Existing dirty state and other lanes' work remain outside this lane.

## Files and row counts

| File | Result | Rows / prefixes |
|---|---|---|
| `docs/worlds/world-depth-2026-10-13/35_HEALTH_INJURY_ILLNESS_DEATH.md` | Created the health owner with eight requested sections, source citations, per-world qualifications and five ranked slices. | **87 coded rows:** H35C 13; H35M 15; H35T 10; H35D 10; H35W 16; H35I 6; H35U 6; H35P 6; H35S 5. |
| `docs/gm/dispatch/relationship-prereqs-2026-10-14/HEALTH_REPORT.md` | Created this bounded handback with findings, conflicts, checks and an index-row proposal. | **14 coded rows:** H35F 5; H35X 6; H35V 3. Index proposal is uncoded. |

All prefixes use the distinct H35 namespace. A pre-write search found no H35-coded rows in searchable nonsealed design docs. Post-write checks count unique row codes and search for collisions outside these two files. No secret file was opened; private source analysis referenced below contains no raw prose copied into the outputs.

## Findings

| Code | Finding | What part 35 does with it |
|---|---|---|
| H35F1 | **SHOWN:** HP recovery, hand conditions, lasting marks and narrow field care are already separate source mechanisms. | H35C1/C3/C7-C10 grounds the vitality/injury/illness distinction in actual seams. Prioritizes a useful reader over building anatomy first. |
| H35F2 | **SHOWN:** ordinary `kill_player` combat means unconsciousness plus Recovering, while chronicle mortal mode has a distinct old-age end. | H35C2/C11-C13 prevents treating `total_deaths`, zero HP or the load clamp as terminal life history or revival. |
| H35F3 | **STATED:** medicine lore coverage is uneven. D&D has selected primary SRD anchors despite its blocked digest; Frieren has a newer secondary source ledger despite its blocked digest. HP/Naruto/Fallout exact care rules still have gaps. | H35W labels the real available evidence, missing facts and original fill-ins. No new full-source verification credit. |
| H35F4 | **STATED:** current TTKS source grouping has five distinct Chinese continuities. The Stubborn Skill-Grinder digest is a separate blocked synopsis lead. | H35W3-W7 keeps each body's/reset's terms separate; the identity note prevents a false common TTKS death law. |
| H35F5 | **INFERRED:** the cheapest coherent sequence is existing care summary, known lesson, received NPC care, one safe mild illness, then existing mortal ending recap. | H35S1-S5 names save impact and actual future observable gates. General contagion, hospital management and a resurrection engine are not prerequisites for these slices. |

## Contradictions and tensions, both sides retained

These are reconciliation findings, not edits or new accepted decisions. Other source/doc owners were read only.

| Code | Side A | Side B | Treatment in this lane |
|---|---|---|---|
| H35X1 | Earlier hunger note D1 and trial endurance examples allow survival/strong hunger possibilities; Proto23 PA3/PA24 includes hardship and home hazard death. | Later accepted food direction in PROJECT/User Vision requires comfortable unfed play, no hunger death and passive Famine progression. | Later user authority governs. H35D1 forbids hunger death; hardship XP and hazardous trials can remain non-hunger or nonlethal proposals. Proto23 is inspiration, not accepted policy. |
| H35X2 | North-star aging/wear and genetics WR6/AG ideas describe long-career decline, lifespan extension and deaths across many bodies. | Current chronicle explicitly selects open or mortal enrolment; the lane requires old-age death only as the existing optional mortal mode. | Keep aging texture, recovery and role changes as possibilities without new default lifespan drain. H35C11 and H35M8 retain the exact existing option. |
| H35X3 | `LIFE_SIM_NORTH_STAR.md:819` mentions opt-in harsh closed-time aging; `TRIALS_AND_TRIBULATIONS.md` includes forced-offline trial alternatives. | Original Frontier brief says closed-browser advancement unsupported; this lane explicitly requires illness cannot kill offline, and HP/Naruto/Fallout briefs leave offline/terminal policies unselected. | No new offline hazard selected. H35I1/I2 separates safe recovery from a held lethal boundary; no lethal-offline illness dial proposed. General historical harsh-mode ideas do not authorize this slice. |
| H35X4 | Source names `kill_player` and `total_deaths` appear terminal. | Actual native log/return says lost consciousness; chronicle and story life policies distinguish true endings. | Cite actual branches, not names. H35C2/C12/C13 separates fainting, optional old-age end, prevention, explicit resurrection policy and heir succession. |
| H35X5 | First-cheats/death-rewards default discourages repeated early deaths producing generic currency; part 18 PA3 proposes capped softening to avoid farming. | TTKS B3 findings record unlimited returns before the goal and repeated death-based rewards; user direction rejects universal once limits and supports reasonable options. | Keep the generic suggestion as a proposal, not a source override or ban. H35W5/H35D4/H35D10 preserves the particular challenge contract and repeat growth. No blanket cap added. |
| H35X6 | Part 31 opening and IL1 prefer soft inner states and no forced loss; part 34's conscience is not a game moral grade. | Some source worlds have lethal/corruptive exposure, soul wounds, loss of control and dangerous trials. | H35M9/M12 and H35W11 separate ordinary mood/mental health from world-specific supernatural mechanisms. General mood proposals cannot silently repeal lore; lore cannot silently turn current ordinary care lethal. |

## Read and evidence scope

Read COMMON first; inspected AGENTS, PROJECT priorities/accepted direction and relevant User Vision, user preferences and the four required local design-memory notes. Used parts 18, 22 section 17, 28, 29, 30, 31 and 34; hunger, first-cheats/death-rewards, north-star health search, trials, genetics G22/G31/G37 and related sections. The requested first-cheats filename is under **`docs/worlds/`**, not the docs root; that actual owner was read and referenced.

Inspected priority world briefs where present and current wiki digests, plus D&D source contract, Frieren ledger/synthesis, TTKS public findings/P13 source grouping, Soldier held-series analytical dossier and succession-by-world owner. Source content is paraphrased as STATED/reused evidence; no whole-novel reread or new external retrieval claimed. Some rows intentionally leave exact medical lore UNKNOWN instead of importing unverified memory. Cultivation remains selected-continuity-specific.

Searched `src/` case-insensitively for HP, health, injury, wound, condition, illness, disease, heal, medicine, death, revive, mortal, old age and lifespan, including word variants. Inspected relevant native HP/effect paths, medicine items/skills, body progression, field care, balm host, simulation condition scheduler, chronicle, heir and story-death policy. Search hits are not proof that every feature is implemented; absence claims are limited to what this pass established.

The prompt's "54 docs" is an input estimate, not a confirmed current inventory. A live illness/disease Markdown filename count returned **78** with the executed `rg` filters at this pass; that broad count includes reports and histories and can drift during parallel work. It does not measure 78 distinct mechanics or complete source coverage. This lane creates a routing/design home, without deleting or rewriting the historical idea owners.

## Verification and remaining gate

| Code | Check | Result / limit |
|---|---|---|
| H35V1 | Markdown row counts, uniqueness and prefix collision check; prose punctuation; local cited-path/line bounds. | Documentation checks only. Codes are unique, counts match and checked explicit source citations resolve. No gameplay claim. |
| H35V2 | Scope and authority review. | Only assigned paths written; no index edit. No hunger death, no new default old-age end, no offline illness death, no fixed proposed once cap. Desktop 1366x768 and mobile deferral stated; original fill-ins and UNKNOWN lore retained. |
| H35V3 | Runtime/persistence acceptance. | **Not run and not completed:** no build, tests, browser journey or save migration. Future chosen slice needs fresh rebuilt desktop behavior and save/reload/import if persistent, followed by separate director acceptance. Contextual balm's existing native gate remains OPEN. |

**Open decisions for Weibao: zero required to finish this documentation lane.** H35S1 is the cheapest suggested follow-up, not an implementation authorization. No either/or choice among reasonable world options is requested. Broader care/death variants remain reachable through source-qualified local profiles or explicit original/AU premises.

## Proposed index row, do not apply in this lane

For `docs/worlds/WORLD_DEPTH_CONSIDERATIONS_2026-10-13.md`, using its existing Parts table format:

```markdown
| [35 Health, injury, illness and death](world-depth-2026-10-13/35_HEALTH_INJURY_ILLNESS_DEATH.md) | Current HP, conditions, injury, medicine, mortality and heirs with code evidence; health and care palette; priority-world lore/unknowns; death warnings and aftermath; safe idle recovery; desktop discovery; prerequisites and five cheapest slices with save impact | H35C, H35M, H35T, H35D, H35W, H35I, H35U, H35P, H35S | 87 |
```
