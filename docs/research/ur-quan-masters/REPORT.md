# The Ur-Quan Masters: places, voices and a continuing traveler

2026-10-14, lane `lib-uqm`. **PROPOSALS ONLY. Status: PARTIAL**, with bounded static questions answered and unread scope listed in [CHECKPOINT](CHECKPOINT.md).

UQM makes travel matter through the combination of alien institutions, useful conversations, expedition supply and local hazards. The same captain and fleet carry equipment, cargo, intelligence and alliances through a shared campaign. A planet is usually a distinct place inside that campaign, not a separate universe with a replacement power system. HyperSpace and QuasiSpace supply a stronger example of travel layers with different movement economics. **SHOWN:** F1-F10, [source pins](SOURCES.md).

The best YAIRPG use is richer contact and changed revisits: a speaker has a voice and agenda, a paid report unlocks a useful request, and leaving does not wipe the destination. UQM does not establish a universal portable cultivation/magic conversion system. Its authored stance flags and tactical ship AI also do not establish a general relationship or autonomous daily-life simulation. **INFERRED transfer boundary:** learn the causal joins, preserve YAIRPG's own bodies, sources, custody, institutions and per-edge carry rules.

## Evidence and limits

Primary source: [official repository at the pinned commit](https://sourceforge.net/p/sc2/uqm/ci/a0d90e239b3a8e3dcb9d732fd76a385aac2593e5/tree/), `a0d90e239b3a8e3dcb9d732fd76a385aac2593e5`. Official main was cloned without building or running downloaded code. A preliminary GitHub mirror was separately pinned at `ff2444088d42e80612fd28f79d368783e244a606`; differences were checked, and final counts/traces use official source. The mirror contains Lua experiment files absent from this official tree. They are not evidence that official UQM dialogue or events are Lua-driven.

The mechanical census found **27 conversation C modules, 3,451 phrase records in 27 text tables, 937 lexical `Response` sites and 1,758 lexical `NPCPhrase` sites**. These are not counts of species, voiced lines or reachable graph edges. Selected deep traces cover Spathi, Melnorme, Syreen, Arilou, Orz, starbase bulletins, travel, planetary retrieval, save/load and events. [Dialogue digest](DIALOGUE_SYSTEMS.md), [travel/economy digest](TRAVEL_AND_ECONOMY.md), [aspect pass](aspects-2026-10-14/ASPECTS.md).

Deep reference: [private index](private/REFERENCE_INDEX.md) records full phrase text/IDs, original C/header conditions, parsed tables, call-site contexts, hashes and the external source archive. No installed game, personal save, Steam dialog, account or bottle was opened. This is source evidence, not installed Free Stars parity, gameplay proof or a YAIRPG change.

## Ranked proposals

All routes below preserve the existing synthesis packet IDs and accepted playable-slice priority. Full scope, compatibility and desktop checks are in [IMPLEMENTATION_PACKETS](IMPLEMENTATION_PACKETS.md). They are options for the coordinator, not a revised product decision.

| Rank / code | Proposed useful result | Existing owner and kit | Synthesis |
|---|---|---|---|
| 1 / UQM-P1 | A returning speaker reacts to a real obligation or changed evidence, with a distinct voice | Dialogue owner; K6/K20/K27/K31 | Extend P19 |
| 2 / UQM-P2 | Buying or learning one report enables a useful second encounter; carrying proof remains distinct | Means/appraisal and dialogue; K11/K23/K30 | Extend P11/P19 |
| 3 / UQM-P3 | A known expedition displays departure, landing and return means before payment | Multiverse/travel and UI; K5/K8/K15 | Extend P18/P01 |
| 4 / UQM-P4 | A generated site's removed goods and discoveries remain changed on revisit | Multiverse/persistence; K9/K18/K29/K33 | Extend P15/P12 |
| 5 / UQM-P5 | An earned institutional tie enables an actual paid service or useful fitting | Institutions; K7/K9/K10/K15 | Extend P07/P04 |
| 6 / UQM-P6 | One qualified travel layer changes real cost or reach while preserving the traveler | Multiverse structures; K2/K5/K15 | Extend P14/P05 |
| 7 / UQM-P7 | Return news reports a real local consequence without replaying a gift | Characters/events; K12/K23/K29/K32 | Extend P20/P12 |
| 8 / UQM-N1 | A supported expedition carrier trades capacity for reach/protection through paid refits | Technology/progression; K5/K8/K9/K13/K15 | **NEW candidate**, adjacent P02/P17/P18 |

Only UQM-N1 is new at the local research level. Do not allocate a global P26 or create carrier slots without an actual consumer. The other seven supply fresh evidence and bounded variants for existing packets.

## Relation to prior owners and lanes

| Code | Prior finding or owner | Disposition from this pass |
|---|---|---|
| C1 | Synthesis P19 already has scoped Ink and native host bindings | **Confirms.** UQM contributes voice/stance/context and consequential responses, not grounds for another engine. Current `src/ink_narrative.js:commitInkNarrativeAction` already binds sequence, clock, scope, stable response and host plan. |
| C2 | Kit successor KW2 proposes per-world dialogue grammars | **Extends.** Author different agendas, evidence gates and small-talk rhythms over the existing host. UQM's C callback grammar is one source method, not the required YAIRPG format. |
| C3 | Nested-world brief separates settings, worlds, regions, layers, instances and visits | **Confirms.** UQM planetary systems are places in one campaign; QuasiSpace is a distinct traversal layer. Never call every starmap point an independent universe. |
| C4 | Start/branch integration map retains native owners and typed adapters | **Confirms.** Seeds and flags are not a substitute for mutable stock, body, relationships or knowledge. New starts cannot reconstruct spent goods on every visit. |
| C5 | Synthesis P10 separates eligibility, selection, cooldown and closure as an audit contract | **Corrects any overgeneralization.** UQM has a sorted date queue plus bespoke C handlers; it does not show a universal four-stage event engine. |
| C6 | P24 coherent restoration and kit K18/K33 | **Adds a counterexample.** Tagged chunks and legacy-load fallback do not prove atomic write or detached load. The inspected native writer truncates its target and deletes on detected failure. |
| C7 | Continuing traveler means retaining learned faculties across worlds | **Partial support.** Retained modules, technology, information and alliance access are real; generalized source/fuel conversion for foreign innate powers is not established by this source. |
| C8 | Kit K28 weather, K20 language, K31 subtext | **Extends.** Weather changes risk; alien voice and translation framing shape contact. Cosmetic text alone is not the whole local rule. |
| C9 | P15/P12 generated content with retained aftermath | **Qualifies.** Default mineral pickup can discard the remainder when the hold accepts only part of a node. Persisting depletion is not proof of conservation; retain YAIRPG native stock semantics. |

Owner edits proposed, not performed: cite this dossier in P19/P11/P18/P20 and the relevant world cards; preserve current priorities and K19-K34 readiness status. No new native gate, new world or research quota follows from this pass. Desktop target for any later UI packet is 1366x768 with useful context and terms visible; mobile optimization stays deferred.

## Checks and open work

Source pin, file hashes, census and JSON schema/keys were checked mechanically. Output paths and private ignore were checked. No game build, launch, browser journey, native save test, staging, commit or push occurred. Remaining semantic coverage, installed parity and runtime questions are named in CHECKPOINT. No YAIRPG implementation or human acceptance is claimed.
