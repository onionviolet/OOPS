CHECKPOINT: PARTIAL

# TW-B report, 2026-10-14

Bounded audit and both assigned deliverables are written. PARTIAL describes
source coverage: full current constitution generation, some gender rules and
source-native behavior remain unknown. No implementation is pending under
this lane's write authority. Findings and proposals are in [OUTPUT](OUTPUT.md).

## Scope and authority

**SHOWN:** read COMMON first, then PROJECT top80, AGENTS standing-direction
section, USER_VISION's body prompt, food/passive-growth direction and standing
deep-reference rule. Read the topic expansion playbook and more-to-consider
skill. Read genetics G19/SG1-SG10, round12 BW1-BW8, ST-A to ST-F, RL1-RL6 and
the relevant source/constitution/body ownership sections. Genetics is a live
dirty root owned by another writer; no root changes made.

**SHOWN:** `git status --short` before writing showed many unrelated modified
and untracked files, including root palettes and research waves. Preserved
them. Only this lane's OUTPUT.md and REPORT.md were written; no add, commit,
push, build, browser, game launch, save access or source edit.

## What was read

| Area | Read coverage and evidence level |
|---|---|
| Direction and method | **SHOWN:** COMMON, PROJECT top80, AGENTS standing direction, relevant USER_VISION sections, `docs/audits/TOPIC_EXPANSION_AUDIT_PLAYBOOK.md`, more-to-consider SKILL. A light memory registry search returned no relevant hits; no memory-derived facts used. |
| Body owners | **SHOWN:** genetics selected sections and code index; life-sim heading/constitution/continuity owner search; nonhuman body authoring, including template/instance, generation, schema and fixture boundaries; transformation body's TF rows/carry table; engine requirements heading/owner routing. These are proposals or current source descriptions, not accepted new features. |
| Taiwu base/deep/aspects | **SHOWN/STATED:** DATA_SHAPE, SECTS_AND_STUDY, inheritance-transfer, table-coverage and NPC-autonomy digests; targeted aspect rows and inventory. Direct bounded read of preserved Character.cs fields, role checks, gender accessor/avatar mismatch, qualification loops and obsolete generation methods. Raw extracts remain at `~/.codex/research/taiwu/extract/` and `taiwu-2/extract/`. |
| Tale base/deep/aspects | **SHOWN/STATED:** FINDINGS selected aptitude/creation/relationship entries, breakthrough and NPC-life deep digests, aspect social gap. Direct structural read of preserved round2 workbook JSON for RoleCreateFeature, RoleAttributeDesc, RoleEffect, RoleFace, RoleDress and RoleBeauty. Raw full workbooks already preserved under its gitignored private/deep-detail folder. No raw dialogue/prose copied into outputs. |
| Immortal Life base/deep | **SHOWN/STATED:** CULTIVATION, NPC_LIFE, lifespan/recovery and NPC_AGENCY deep digests, including native roommate and authored NPC realm-up consumers. Aspect folder inventory and checkpoint inspected; only in-progress checkpoint existed at inspection. |
| Idle Reincarnator base/aspects | **SHOWN/STATED:** RESET_AND_LIFE, selected systems/tooling, aspect DEEPER_SYSTEMS and aspect relationship search. No invented birth-trait count. Raw decoded lifecycle state remains in its existing private reference. |
| Your Chronicle base/deep/aspects | **SHOWN/STATED:** native RETENTION trace, CARRYOVER_AND_UNLOCKS, selected FINDINGS/aspects dialogue/reset boundary. Did not equate ritual talent with inherited genetics. |
| Warsim base/deep | **SHOWN/STATED:** GENERATION, table inventory selected rows, REA NAME_AND_LORE and targeted event/save/economy searches. Gendered patronymic is a naming branch, not demonstrated parentage. No aspects directory available. |
| Path base/aspects/private | **SHOWN/STATED:** SYSTEMS_AND_REBIRTH, tooling/pinned readable hash, aspect inventory/DEEPER_SYSTEMS/checkpoint. Direct read of readable.js root-roll constants/handler, physique registry/eligibility/selection/origin auto-equip. Three definitions, ten tier names each; five primary root elements and3+15 slots. Raw code stays at `~/.codex/research/path-idle-cultivator/extract/readable.js`. |
| YAIR source | **SHOWN:** character_creation.js, BioComponent, Person bio/height initialization, character_bio source filtering, body_progression command/source/condition patterns, heir_inheritance, selected backlog_expansion_body native inputs/validation, seeded_streams; targeted main/display persistence/address consumers. Read-only seams, not rendered behavior. |

## Unread table

| Code | Missing or partial evidence | Consequence and bounded next source |
|---|---|---|
| U1 | Taiwu full CharacterFeature table and current creation/genetics consumer. Available Character.cs genetic/basic-feature generators carry Obsolete attributes. | No complete constitution names/count/odds asserted. A source reader should locate current creation types from existing metadata, preserve full table privately and trace selected current row consumers before reusing the old formula. Not a YAIR implementation gate. |
| U2 | Full Taiwu force-type labels/36-row semantics, reproductive feature170 meaning, avatar/address/clothing consumers and every gendered method. |36 is a table count, not36 constitutions. Do not map `_transgender` to a complete identity model or feature170 to a guessed biological label. Read selected config/localization and actual callers if needed. |
| U3 | Tale current native creation sampler, feature group exclusion, weight/cap semantics, full aptitude-to-method eligibility. | Positive weight is not runtime chance. All constitution-like records were not semantically classified; output gives exact six-row family and broader structural counts. Existing backup tables do not prove current active loading. |
| U4 | Tale complete marriage, child/heir, gendered/dual practice, chosen address and NPC initiators. | Report parameters as parameters. Next evidence is current UnitActionRoleMarry/Trains and newborn/condition consumers, not genre assumptions. |
| U5 | Immortal Life aspects A01-A12, SYSTEM_INVENTORY and DEEPER_SYSTEMS were absent when checked; checkpoint says IN PROGRESS. | Base and completed deep pass used. Later aspect delivery may add body/relationship facts; no waiting or invented pass completion. Full lifespan absence is not proven. |
| U6 | Idle Reincarnator and Your Chronicle whole-game gender/presentation/marriage content beyond inspected live reset schemas and aspect summaries. | Unknown in the source matrix, not claimed absent. No new random-body research requirement; inspect only a named prospective consumer. |
| U7 | Warsim full race modifier graph/seed lifecycle, family/heir transactions and all gender/title branches. No aspects directory at inspection. | Race counts and specific presentation/name consumers are known; complete race probability and personal lineage are not. Existing REA deep pass is separate from a missing aspect pass. |
| U8 | Path full physique XP-to-axis/lifespan arithmetic, all selection callers, origin root exceptions, downstream root gates and reproductive/gender systems. | Definitions and selected handlers are shown; full reachability/reset/effect enforcement is not. Source setter alone is not an admission guarantee. Do not treat actor-independent breeding vocabulary as human marriage. |
| U9 | Source-game runtime UI, game saves, scheduler performance and save roundtrips. | No gameplay or atomic-persistence claims for any source. These were docs/static-code reads. |
| U10 | YAIR runtime changes, complete BioComponent migration, new body-template integration and rebuilt UI proof. | No code change authorized here. Future selected slice must preserve all legacy gender values/missing fields, use the existing body/actor/save owners and pass its own tests/rebuilt desktop/native persistence gates. |

## Contradictions found

| Code | What was wrong or too broad | Where handled |
|---|---|---|
| C1 | BW5 attributes rolled life traits jointly to two sources whose inspected mechanisms are reset handlers and computed talent. | OUTPUT TW-B01 and IR/YC table rows. |
| C2 | BW4 asks Immortal Life to establish lifespan aging and breakthrough longevity, although its deep trace establishes same-actor defeat/recovery and leaves lifespan unknown. Internal Marry vocabulary can also mislead the BW6 read. | OUTPUT TW-B02 and gender matrix. |
| C3 | BW8's “methods as body slots” hides three separate mechanisms. | OUTPUT TW-B03, Path root/physique table and TW-B05. |
| C4 | G19 says three creation values drive address; the actual dynamic address branch distinguishes only male versus the remaining values. This is a source-visible mismatch for the ambiguous option. | OUTPUT TW-B10; no UI repair authorized and no rendered defect claim. |
| C5 | Available Taiwu genetics formula looks usable until its Obsolete attribute is read. | OUTPUT TC/body row and U1. No current odds inferred. |
| C6 | Source NPC policies differ from YAIR's shared-rules direction: Taiwu has a distinct distant-marriage route; Immortal Life has caller/authored NPC advancement without the player's trial inside the NPC API. | OUTPUT gender matrix and TW-B08. Report source as-is, preserve YAIR direction separately. |

## Checks and remaining gate

**SHOWN:** table counts derived by Python reading preserved JSON and counting
only numeric `id` rows after the three workbook header rows. Confirmed the
six trait-to-RoleEffect joins and Path constants from text, without executing
game code. Final document checks cover both files, source references, twelve
coded rows, dispositions, five ranked picks, unread table and punctuation.
These checks establish documentation structure only.

**INFERRED:** next root action is to fold TW-B01-03 corrections and select among
the ranked extensions. Nothing here changes accepted build order, authorizes a
new simulator, requires source-wide excavation, or closes a playable gate.
All source gaps above remain explicit. No new research storage path was
written because this lane owns exactly two repo files; deep detail read here
already exists in the prior private extracts referenced by OUTPUT.
