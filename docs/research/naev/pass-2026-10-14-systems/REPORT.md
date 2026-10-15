# Naev deep systems sweep

Lane `ds-naev`, 2026-10-14. **Status: PARTIAL, fifteen source traces delivered.** No game launch, installation, user-save access, YAIRPG edit, staging or commit.

## Corrections and qualifications first

| Code | Prior claim or open row | This pass |
|---|---|---|
| C1 | NV-I20 and prior U2 leave the encyclopedia undocumented | DS10 closes the reference-page pipeline and visibility reader at source level. It is knowledge-gated executable Markdown, not just a static lore list. All pages and UI remain partial. |
| C2 | NV-I10 / NV-X2 leave bioship tree and respec unread | DS06 traces prerequisites, body-size families, skill installation and 20% XP reset. `inherits()` here inherits a hull definition. It does not establish breeding or family lineage. Prior income-growth findings remain intact. |
| C3 | NV-I17 / prior U2 leave capture, repair and fleets named | DS01-DS04 expose distinct owned ships, temporary escorts, bay craft and pending captured hulls. A damaged hull can survive capture settlement without immediate repair funds. Exact in-flight restore remains open. |
| C4 | Prior discovery sample might be read as all eligible notices firing | DS09 finds short-circuit evaluation in create: after a truthy handler result, later handlers are skipped in that call. Repeated eligibility is not proof of a discovery queue. |
| C5 | Directory labels can imply generic tech research or finite mining | DS11 tech is store composition/availability. DS07 asteroid extraction chooses one material, emits random-sized gatherables and respawns elsewhere. Neither establishes a research economy or finite conserved geology. |
| C6 | New POI model might imply generated risk determines difficulty | DS08: rewardrisk retains generated risk, then create forces encounter risk to 2 and locks the derelict. Reward identity is retained; path geometry is generated on entry. |
| C7 | Prior NV-F09/U4 warn that save domains omit timers | Confirmed and narrowed: owned ships save real equipment/cargo/shipvars; escort outfit snapshots and many active states are local. Damage/status lists, EW timers and gate visual state are not saved by the inspected ship serializer. No atomic restore guarantee is added. |
| C8 | Source comments/UI can stand in for executing rules | DS07 mining wrapper says Sokoban while core is angular timing. DS12 missile-lock stealth guard is commented out. DS14 payment checks `credits > cost`, not `>=`. These are source observations, not reproduced player-visible bug reports. |

## What the sweep adds

Naev is strongest here as a model of separate carriers and practical services. You can possess something that is damaged, deploy something that carries cargo, order an escort that must actually arrive, or know a technique that your current hull cannot support. A clue, sensor contact, identified target, catalogue entry and useful power are different states. These differences make much better YAIRPG reference material than treating every ship level as a bloodline or every price fluctuation as a simulated industry.

[System traces](SYSTEMS.md) record models, precise rules, authoring, connections and save boundaries for fifteen systems. [FAMILY_MAP.json](FAMILY_MAP.json) retains every original inventory row, adds fifteen traced leaves and splits twenty-eight residuals. Module rows and semantic rows overlap by design. Their counts must not be added as independent mechanics. Raw source, full authored text and data remain private in the retained clone and lane extracts; public files paraphrase.

The live kit successor and production palette still point to P01 work feedback on Village mixing. This research does not select a different slice. All applications below are **PROPOSALS**, using original content and the existing owners. One realm and one prestige remain the first milestone; mobile optimization stays deferred. Reasonable recurring routes remain possible, without importing source lifetime flags or source progression caps.

## Ranked PROPOSALS

| Rank / code | Proposal | Traces | Kit / packets | Proposed owner |
|---|---|---|---|---|
| 1. NDS-P1 | Keep damaged assets useful as future repair work | DS02 DS03 | K8 K9 K22; P04 P12 P18 P19 | [MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md](../../../MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md) |
| 2. NDS-P2 | Make one exploration lead need a real sensing means | DS08 DS12 | K5 K11 K30; P04 P11 P19 | [MEANS_AND_APPRAISAL.md](../../../MEANS_AND_APPRAISAL.md) |
| 3. NDS-P3 | Give one travelling companion a bounded task and retained result | DS01 DS04 | K5 K6 K18; P06 P08 P25 | [CHARACTERS_AND_WORLD_EVENTS.md](../../../CHARACTERS_AND_WORLD_EVENTS.md) |
| 4. NDS-P4 | Show market observations as dated evidence | DS15 | K8 K11 K23; P01 P11 P18 | [TECHNOLOGY_AND_PROGRESSION.md](../../../TECHNOLOGY_AND_PROGRESSION.md) |
| 5. NDS-P5 | Let a known reference page read the same real facts as actions | DS09 DS10 DS11 | K9 K11 K14; P04 P11 P16 | [MEANS_AND_APPRAISAL.md](../../../MEANS_AND_APPRAISAL.md) |
| 6. NDS-P6 | Separate local technology supply from personal competence | DS05 DS11 | K7 K9 K11; P04 P07 P16 | [TECHNOLOGY_AND_PROGRESSION.md](../../../TECHNOLOGY_AND_PROGRESSION.md) |
| 7. NDS-P7 | Make extraction method change an actual intermediate | DS07 DS15 | K8 K9 K13; P02 P09 P18 | [MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md](../../../MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md) |
| 8. NDS-P8 | Preview carrier-specific respecialization and recovery | DS06 DS13 DS14 | K3 K15 K18 K22; P05 P16 P17 P24 | [GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md](../../../GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md) |

[Implementation packets](IMPLEMENTATION_PACKETS.md) give each scope, exclusions and useful acceptance. The first three proposals are repair continuity, sensing-led exploration and a bounded companion task. None requires importing Naev code, coefficients, names, fiction or a new generic engine.

## Why these fifteen

| Payoff rank | Trace | YAIRPG reason |
|---|---|---|
| 1 | DS03: Deferred repair preserves an impaired asset | A useful future task survives lack of money. |
| 2 | DS08: POI leads, scanner trails and fixed reward identity | Knowledge comes from a lead, means and actual observation. |
| 3 | DS04: Convoy contracts, survival and orders | Participation has conditions, arrival and loss. |
| 4 | DS01: Fleet deployment and cargo custody | Group cargo and actual carrier differ. |
| 5 | DS10: Knowledge-gated reference pages | Reference UI can follow earned knowledge. |
| 6 | DS11: Technology catalogues are local supply, not research | Personal competence and local supply differ. |
| 7 | DS07: Mining method, yield and optional timing interaction | Method changes output and downstream work. |
| 8 | DS15: Price motion and remembered market samples | Information history differs from current quote. |
| 9 | DS06: Bioship skill graph and respecialization | Body/item-specific development and reversible specialization. |
| 10 | DS12: Sensing, scanning and stealth are different states | Detection, identification and inspection differ. |
| 11 | DS02: Capture is a pending recovery process | A pending salvage result carries costs and custody. |
| 12 | DS09: Discovery records are more than map knowledge | Presentation can create durable recognition. |
| 13 | DS13: Timed effects and typed damage | Replacement and expiry policies matter to bodily faculties. |
| 14 | DS05: NPC equipment as constrained choice | Roles can select equipment under actual constraints. |
| 15 | DS14: Gates and wormholes have distinct travel contracts | Different crossings need different terms and clocks. |

## Intake families and owner coverage

Every original module row and NV-I01..NV-I21 is preserved with its prior status in FAMILY_MAP. Deep traces close selected subquestions, never the whole bundled row. Explicit family routing is proposed document ownership, not a claim that YAIRPG already implements the source system.

| Family | Prior named/partial systems | This pass / remainder | YAIRPG owners |
|---|---|---|---|
| Economy and production | commodities, cargo/rush, mining, project supplies, repairs | DS01/03/07/15; full purchase flows and colony dialogue open | K8/K9/K29; P02/P12/P18; production MS1-MS13 |
| Social, companions and AI | factions, traffic, standing, fleets, capture, escort, optimizer, scan/hail/retreat | DS01-05/12; all faction wrappers, full planner and personal events open | K6/K7/K10/K24; P06/P07/P25; companion A/C tracks, cast owner |
| Body and powers | Flow, bioships, outfits/slots, damage/effects, difficulty | DS06/12/13; Flow charge, full skill leaves and heat/difficulty open | K3/K9/K22; P05/P09/P17; genetics layers and ability authoring |
| Knowledge and technology | discoveries, tutorials, maps, reference pages, technology groups | DS08-12; full map flags, tutorials and page census open | K9/K11/K30; P04/P11/P16; tech TL/TG/TM |
| World and time | star systems, virtual presence, lanes, ordinary jumps, gates/wormholes, nebula, runtime/calendar | DS07/14/15; lanes, ordinary jumps and full time transition matrix open | K5/K15/K28; P05/P13/P14; world kit and multiverse |
| Events and dialogue | missions, events, VN, scene claims, place diffs, late campaigns, minigames/racing | DS02-04/08/09 extend selected lifecycle joins; full campaigns/claims/puzzles open | K6/K12/K16/K32; P10/P19/P22/P24; dialogue and starts/endings palette |
| Information and UI | HUD, news/logs, encyclopedia, perception, presentation cues | DS09/10/12/15; actual audio/readability/accessibility open | K14/K19/K23/K30; P01/P20/P21; thematic UI |
| Content tools | plugins, editors, utilities, console, localization, dependency checks, attribution | inherited partial, no new full editor or precedence audit | K1/K33/K34; P16/P22; engine authoring |
| Save | mem/userdata, hook omissions, shipvars/assets, migrations, corruption | every DS section has explicit save boundary; U4 still partial | K18/K33; P23/P24; engine saves |

**Owner gaps, narrowly stated:** no dedicated race/minigame owner or native rendering/audio/physics owner was found among the consulted palettes. FAMILY_MAP marks these rows with broad owner plus missing specialist. No gameplay proposal here needs a new synthesis packet: fleet custody fits P06/P18/P24, recoverable impairment fits P12/P18, and sensing/reference pages fit P04/P11/P16. Bodies, lineage, companions and production already have topic owners. Source evidence for biological lineage, independent research and household/industrial conservation was not established in examined modules. That is a source gap, not a missing YAIRPG owner and not a whole-game absence claim.

## Prior unread closure

| Prior row | Bounded questions closed at source level | Still open |
|---|---|---|
| U1 | Added repair and POI dialogue conditions/callbacks | All campaigns and relationship routes |
| U2 | Fleet core allocation; capture/repair; convoy helper; optimizer constraints/fallback; mining core; gated reference pipeline; typed damage/effect replacement; special transit | Full AI, combat, lanes, ordinary jumps, racing, other minigames, all faction/content variants |
| U3 | No closure claimed | Claim edge reproduction and chapter anomaly |
| U4 | Explicit serializer fields for inspected carriers; known transient omissions; respec fields | Corrupt saves, migrations, Flow charge, exact pending restores and arbitrary VN cursor |
| U5 | Reference UI/order layout source only | All visual/audio/keyboard/accessibility acceptance |
| U6 | None | Canonical upstream head comparison |
| U7 | Routing proposals only | All YAIRPG implementation and native acceptance |

## Verification and route

[FINDINGS.json](FINDINGS.json) stores structured traces; [SMALL_TOUCHES](SMALL_TOUCHES.md) adds 25 scoped motifs. [TOOLING](TOOLING.md) records source pin, commands, dead ends and private captures. [CHECKPOINT](CHECKPOINT.md) is the resume surface with every residual leaf and reason. Artifact validation checks JSON, source/owner paths, links, inventory coverage and hashes. It does not run the game, prove formulas by execution or prove native persistence.
