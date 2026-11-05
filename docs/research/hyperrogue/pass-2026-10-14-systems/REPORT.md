# HyperRogue deeper systems sweep

2026-10-14, `ds-hyperrogue`. **Research and unselected PROPOSALS only.** Fifteen bounded systems now have data, exact rules, consumers, authoring and persistence notes in [SYSTEMS.md](SYSTEMS.md). Whole-source coverage remains PARTIAL. Source pin: `c7c9a2993b43ee2f4bbac422e565d18fdd98f886`.

## Corrections and extensions first

| Code | Prior wording or gap | Result and evidence |
|---|---|---|
| C1 | Stable per-cell knight IDs and names | Refine the lifetime: `knight_name` lazily chooses a nonunique pool index; `move_knight` transfers it at commit. No core serialization of knight_id was found. Runtime label continuity is shown, durable person identity is not. DS02, complex2.cpp:369-384. |
| C2 | Save path left editor map-stream unread | Extend, not contradict: editor maps serialize actual cell state/topology and selected phases, including explicit dice/tortoise data. Normal score/Safety still regenerates selected state. Do not broaden the prior Safety counterexample to every HyperRogue persistence path. DS13, mapeditor.cpp:1131-1697. |
| C3 | Rescue/dialogue mostly located | Default source speech and core escort milestones/revival are now traced. Cursors are shared function-static state; wrap bounds 32/127 are not dialogue counts or per-NPC memory. DS01/DS02. |
| C4 | Body and ecology types only named | Dragon/kraken have actual spatial body readers; Hive has tactical group conflict and traces. Neither establishes inheritance, household life or political institutions. DS05/DS09. |
| C5 | Time covered at scheduler level | Extend with distinct per-system clocks, tide thresholds, heat diffusion, fire staging, awakening and reload. Speed does not uniformly freeze all processes. DS07/DS08/DS10/DS12. |
| C6 | Orb Strategy apparent forbidden-history mismatch | Preserve the prior source finding and runtime-untested label. No launch or reproduction authorized by this static lane; no fix made. Prior inventory.cpp:678-688 and complex.cpp:644. |

In plain terms, the useful depth is in small rules that several systems actually read: a companion's changed combat state, a tentative mark, an object's orientation, a shore's next phase, or a material's heat. Many regions reuse those rules. HyperRogue does not supply a demonstrated general life economy, hereditary lineage, research tree or production-chain engine in the inspected core. For those goals, use the existing body, technology and chains owners and stronger sources from the wider sweep.

## Ranked PROPOSALS

These proposals extend existing owners. Their historical Village P01 sequencing and one-realm/one-prestige milestone are superseded by [current scope](../../../VISION_DIGEST.md). They do not authorize a build or require a new engine. Canon-first direction, repeatable reasonable solo options and no mandatory survival chores stand.

| Rank / code | Proposed useful result | Source systems | Existing route |
|---|---|---|---|
| 1 / HRD-P1 | One useful process reads the actual local condition | DS07 DS08 | K2 K8 K9 K13 K28; P01 P02 P13 |
| 2 / HRD-P2 | A companion outcome changes the next useful action | DS01 DS03 | K6 K10 K12 K16 K29; P06 P12 P25 |
| 3 / HRD-P3 | Tentative marks remain separate from learned facts | DS06 DS02 | K11 K14 K23 K30; P04 P11 P21 |
| 4 / HRD-P4 | Acknowledgement reads aftermath and keeps person identity | DS02 DS09 | K6 K20 K29 K31; P12 P15 P21 |
| 5 / HRD-P5 | One body property changes a verb and its evidence | DS05 DS11 DS04 | K3 K10 K22 K30; P14 P15 P16 |
| 6 / HRD-P6 | A telegraphed event starts only on committed conduct | DS10 DS08 | K10 K12 K29 K32; P10 P12 P24 |
| 7 / HRD-P7 | Save contract lists more than scalar fields | DS13 DS14 DS15 | K18 K33 K34; P16 P23 P24 |

[IMPLEMENTATION_PACKETS.md](IMPLEMENTATION_PACKETS.md) gives scope, state and done checks. All are INFERRED adaptations. Broad topic routing: chains FC6/ML-R4c and useful dry-to-kit; technology FT5/CN14; body MT1-MT5; kit KW1-KW4. Latest root folds were read, so old branch-only/readiness notes are not treated as current truth.

## Inventory and closure

[FAMILY_MAP.json](FAMILY_MAP.json) retains 132 root-module rows, 4 nested groups, 39 separately addressed compound subsystems and all 95 declared land rows, plus 15 deep reads and 4 bounded negative-interest rows. Its 289 records overlap and are not 289 independent game systems. [INVENTORY.md](INVENTORY.md) lists every prior module/subsystem with family, prior depth and current disposition. A prior focus does not imply full rule closure. All prior checkpoint gaps have an explicit disposition there and in [CHECKPOINT.md](CHECKPOINT.md).

**Owner gap G1:** DS14's exact example-driven constraint-solver mechanism has no dedicated accepted implementation leaf identified in the inspected YAIRPG palettes. Generation/authoring already own the broad topic; this is a potential leaf, not an unowned world system or a reason to build a new engine. Geometry/rendering-specific entries have no demonstrated direct product need. Every relevant body, knowledge, companion, material, event and save topic already has a design route. Mapping says nothing about runtime acceptance.

Source reference detail is retained under `/Users/weiwei/.codex/research/ds-hyperrogue/extract/`, with full selected source files, original dialogue/conditions, full source tables, hashes and per-system source slices. Earlier `mw-hyperrogue` data remains read-only. Raw source/prose stays outside Git; these outputs paraphrase and link. No requested secret was designed or disclosed.

## Checks and limits

Static deliverable validation parses both JSON files, checks all prior module/land coverage, all fifteen system dimensions, source line bounds, owner existence, packet IDs, local links, touch count and punctuation. A separate arithmetic check confirms the tide array's 96-step construction. Results are saved in the lane work area's `notes/validation.json` and summarized in CHECKPOINT. These checks do not execute the game or establish balance, full migration safety, play feel or whole-engine correctness.

No source/build/install/save/browser/runtime/commit/push changes. Only this output folder was written in the repo. For any later selected UI work, target desktop 1366x768 with the useful command, known blocker and actual resource/condition visible together; mobile optimization is deferred. Rebuild and fresh-origin ordinary play, affected Save/reload/Export/literal Import and director acceptance remain future implementation gates, not research completion claims.


## Content reconciliation B595: complete map and bounded source closure

F1: Full review covers every field of all 289 records, all header/dictionary values and 32 routing blocks through the [lossless reading view](../../../audits/reconciliation-2026-11-04/hyperrogue-family-lossless-view-b595.json) and [round-trip receipt](../../../audits/reconciliation-2026-11-04/hyperrogue-family-view-receipt-b595.json). Original JSON/schema remain unchanged. Source pin c7c9a2993b43ee2f4bbac422e565d18fdd98f886 and static source claims are historical; none of the raw C++ bodies, private captures, executable or current upstream was newly read or run.

F2: The 132 root modules, four optional groups, 39 compound subsystem rows, 95 land declarations, 15 deep-system rows and four bounded negatives overlap. A bounded_extension host module is not fully read by its selected leaves; prior_partial named subsystems remain partial even where another selected flow shares the file. File sizes/namespaces and the 20/5/1/161 optional-group file counts do not measure semantic closure. Broad geometry routing of menus, monstergen, nofont or mymake and generic world-simulation routing of dialogue/body leaves are rough navigation, not exact consumer adjudications. Optional groups remain unread. The four negative rows establish only that general households/careers/markets, genetic lineage, technology diffusion and workforce/recipe chains were not established in the inspected core, never whole-repository absence.

F3: All 95 LAND IDs retain metadata-only/full-runtime-open status, including laNone and boundary/reflection variants. Haunted Woods, Reflection and Terracotta Army each appear under distinct IDs. Display-name deduplication would lose source identity and topology; neither these rows nor selected generation locators prove 95 independent complete regional loops, every orb/creature/mode consumer or playable reachability. The exact source IDs and line locators remain preserved.

F4: DS01 escort milestones/revenge/revival do not close every prison generator, princess gate planner or defeat mode. DS02 selected speech and knight movement do not establish durable person identity, unique names, translations, every trigger or persisted incidental presentation; a lazy nonunique name index and shared function-static speech cursor are different from per-person memory. DS03 lawful companion choice/path lifetime does not close hostile AI, every stay/move branch, gate planning or households. DS04 admission/stun formulas do not close all terrain aftermath, attack flag combinations or player defeat. DS05 representative segmented dragon/kraken bodies do not establish lineage, every mount/spawn branch or transformed-body restore.

F5: DS06 tentative marking, knowledge/reveal and explosion admission preserve the difference between a mark and an established fact; generation probabilities, displayed numbers and protection interactions remain open. DS07 diffusion/thresholds/fire staging/timeouts do not close all burnable items, wind, geometry or offscreen restoration. DS08 tide clock construction and the separately checked 96-step arithmetic do not prove native pause/resume or boundary convergence. DS09 local hive targeting/traces is not a whole ecology or offscreen budget; DS10 committed ambush/awakening is not every pickup caller, geometry edge case, give-up rule or fairness proof. Keep their useful condition, clue and aftermath adaptations optional under existing owners.

F6: DS11 dice orientation/admission and explicit map fields do not close every reward/anger lifecycle, Chaos swap or preview traversal. DS12 reload/targeting/rollback does not close mirror recursion, all aiming styles, achievements or live targeting usability. DS13 editor topology/cell serialization is distinct from score/Safety regeneration; neither direction generalizes to every persistence route. Complete geometry codecs, hooks, versions, corruption, atomicity and runtime roundtrips remain open. DS14's compact example-driven solver excludes opaque dictionary decoding and leaves census/dead-end/repair behavior open; its exact accepted implementation leaf was not identified, although generation and authoring own the broad topic. DS15 presentation schema/callback lifecycle/recovery controls do not establish all callback cleanup, extra shows, accessibility or lesson feel. The current scope owner retires the former first-milestone gate and supersedes the old Village sequencing note; AD42 makes human review optional rather than an automatic delivery blocker. No new rule, gameplay implementation, acquisition, native launch, private-state access, deletion, relocation, runtime test, commit or push follows from this reconciliation.
