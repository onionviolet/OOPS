# HOI4 deep systems sweep

2026-10-14. Source research, **PARTIAL**. Fifteen system dossiers are written; native formulas, exact save fields, runtime behavior and unselected country variants remain open. No implementation or owner registration.

## Corrections and qualifications first

| ID | Prior area | Correction / extension and evidence |
| --- | --- | --- |
| C1 | A12 associates collections/profile families with possible cross-run progression | `common/collections` is a typed scoped-query facility. It is not a collectibles album; it supplies faction progress and iteration. Profile award definitions remain a different family. S02/S13. |
| C2 | MIO capacity appears in authoring fields | This install has `NIndustrialOrganisation.ENABLE_TASK_CAPACITY = false`. Do not present its example task capacity as a live finite limit. Quality/production trait consumers are shown separately. S01. |
| C3 | Faction member upgrades versus empty folders | Actual contribution tiers live in `member_upgrades` and its member groups. Empty `factions/upgrades` placeholders do not establish another playable tree. S02. |
| C4 | Probability/author docs can supply exact boundaries | Raid docs disagree with examples on base chance and units; faction ratio prose repeats the wrong denominator; one faction cancel handler uses a scope its docs say is absent. These remain contradictions, not repaired source. S02/S11. |
| C5 | Project/personnel progress | Special-project depth extends to injury, specialist tags, basic/support research and removal timers. No body inheritance, family simulation or personal small-talk system is established. S08-S10. |
| C6 | Earlier save-parser correction | Retain the aspect pass's correction: parser tests include 1.17, not just 1.10, and may skip missing token data. No new fixture was fetched or parser test run. Exact save schema stays open. |

HOI4's strongest new lesson is how a large institution is split into smaller causal records: who belongs, who has permission, what they contribute, what work is assigned, what they know and what consequences remain. It also keeps regional resistance distinct from compliance, practice distinct from climate adaptation, and mission success distinct from participant damage.

SHOWN: installed Steam app 394360, build 25205862; 286 selected source files, 5,472,798 bytes, all identical to the earlier aspect capture. The new map carries **156 inventory/surface rows**, including all **138 common-family/nested rows** from the earlier inventory. Nested rows overlap and are not independent gameplay-system counts. Fifteen sections in [SYSTEMS](SYSTEMS.md) each cover data, exposed rules/timers, connections, authoring and explicit save-evidence limits.

## Ranked PROPOSALS

These are choices for existing owners, not accepted decisions, new required gates or dispatched implementation. Rank is expected payoff for the life sim and current native seams, not a request to build all eight.

| Rank / ID | Proposal | Design owner and synthesis route | Useful first result |
| --- | --- | --- | --- |
| 1 / HDS-P1 | A named specialist learns through useful workshop work; appointment and learned skill remain separate | Skills/cast and modular-chain palettes; K6/K9/K11; P03/P06/P09. S01/S08/S09. | An actual helper changes one paid job and keeps earned learning after reassignment. |
| 2 / HDS-P2 | An institution separates membership, permission, support and contribution | Society/event owners; K7/K8; P07/P18. S02-S04/S06. | A guild service has real staff/tool support and a truthful stop/recovery reason. |
| 3 / HDS-P3 | An expedition retains preparation, target, means, task result and participant consequences separately | Characters/world events and means; K5/K6/K10/K12; P04/P06/P10/P18. S07/S11. | Prepare a real rescue/delivery, change a premise, then settle conserved costs and observed outcome. |
| 4 / HDS-P4 | Condition thresholds use explicit margin and crossing history | Events/conditions; K12/K29/K32; P10/P12. S05. | A local condition changes one useful service without flickering or repaying on reload. |
| 5 / HDS-P5 | Sustained conditions teach a fitting adaptation independent of active combat | Bodily-needs/skills/world laws; K22/K28; P09/P14. S10. | One locally supported adaptation advances under the declared passive policy and changes a real action. |
| 6 / HDS-P6 | Access credentials and information carriers have target and source scope | Means/knowledge/dialogue; K11/K23; P04/P11/P20. S07. | One known contact supplies a dated observation; loss of support changes access without erasing knowledge. |
| 7 / HDS-P7 | Paid maintained intent owns its active effects and withdrawal | Engine/life-sim; K13/K26; P06/P08/P13. S15. | Start/stop one useful routine with exact paid work and no replayed enrollment. |
| 8 / HDS-P8 | Distinguish a useful service award from retrospective life recognition | Life-sim/history/save owners; K6/K16/K18; P12/P15/P16. S13. | One earned recognition has a causal reader; no account bonus or profile wrapper assumed. |

For any selected UI adoption: target desktop 1366x768, showing useful action, actual support/cost, current commitment and known result together. Mobile optimization stays deferred. Rebuild and fresh-origin browser play are future implementation gates, with save/reload/literal import when persistence changes. They are not performed by this source-only lane. One realm/one prestige remains the first milestone; all reasonable options remain reachable, without copied lifetime once limits.

## Every initially undocumented family, grouped

The following table is generated from every `UNDOCUMENTED` row of the earlier inventory. Status is the new pass's bounded coverage, never exhaustive native proof. Previously named but thin MIO/faction families are additionally covered by S01/S02. Other prior unread obligations are individually reconciled in CHECKPOINT.

### AI

| Inventory ID | System | This pass | Route |
| --- | --- | --- | --- |
| I005 | ai areas | unread | inventory only |
| I006 | ai attitudes | empty_definition | SYSTEMS cheap closures |
| I007 | ai equipment | representative_deep_read | S14 |
| I008 | ai faction theaters | unread | inventory only |
| I009 | ai focuses | unread | inventory only |
| I014 | ai personalities | empty_definition | SYSTEMS cheap closures |
| I100 | scorers | representative_deep_read | S14 |
| I101 | scorers/country | representative_deep_read | S14 |

### UI

| Inventory ID | System | This pass | Route |
| --- | --- | --- | --- |
| I018 | alerts | metadata_read | SYSTEMS cheap closures |
| I057 | focus inlay windows | author_contract_read | SYSTEMS cheap closures |
| I058 | frontend | metadata_read | SYSTEMS cheap closures |
| I059 | frontend/backgrounds | metadata_read | SYSTEMS cheap closures |
| I062 | graphicalculturetype | unread | inventory only |
| I068 | map modes | author_contract_read | SYSTEMS cheap closures |
| I090 | profile backgrounds | metadata_read | SYSTEMS cheap closures |
| I091 | profile pictures | metadata_read | SYSTEMS cheap closures |
| I094 | region colors | unread | inventory only |

### authoring

| Inventory ID | System | This pass | Route |
| --- | --- | --- | --- |
| I020 | bookmarks | representative_read | SYSTEMS cheap closures |
| I029 | country tag aliases | author_contract_read | SYSTEMS cheap closures |
| I034 | difficulty settings | representative_read | SYSTEMS cheap closures |
| I046 | event modifiers | empty_placeholder | SYSTEMS cheap closures |
| I063 | idea tags | metadata_read | SYSTEMS cheap closures |
| I074 | modifier definitions | metadata_read | SYSTEMS cheap closures |
| I075 | modifiers | unread | inventory only |
| I076 | msgrdk achievements | unread | inventory only |
| I077 | mtth | commented_contract_only | SYSTEMS cheap closures |
| I102 | script constants | unread | inventory only |
| I103 | script enums | unread | inventory only |
| I104 | scripted diplomatic actions | commented_contract_only | SYSTEMS cheap closures |
| I116 | synchronized dynamic tokens | metadata_read | SYSTEMS cheap closures |
| I121 | timed activities | small_definition_read | SYSTEMS cheap closures |
| I122 | triggered modifiers | empty_placeholder | SYSTEMS cheap closures |
| I125 | unit tags | metadata_read | SYSTEMS cheap closures |

### body

| Inventory ID | System | This pass | Route |
| --- | --- | --- | --- |
| I002 | acclimatation | representative_deep_read | S10 |
| I120 | terrain | representative_deep_read | S10 |

### combat

| Inventory ID | System | This pass | Route |
| --- | --- | --- | --- |
| I003 | aces | small_definition_read | SYSTEMS cheap closures |
| I137 | wargoals | unread | inventory only |

### companions

| Inventory ID | System | This pass | Route |
| --- | --- | --- | --- |
| I028 | country leader | representative_deep_read | S09 |
| I123 | unit leader | representative_deep_read | S09 |

### economy

| Inventory ID | System | This pass | Route |
| --- | --- | --- | --- |
| I045 | equipment groups | representative_deep_read | S01 |

### events

| Inventory ID | System | This pass | Route |
| --- | --- | --- | --- |
| I092 | raids | representative_deep_read | S11 |
| I093 | raids/categories | representative_deep_read | S11 |

### identity

| Inventory ID | System | This pass | Route |
| --- | --- | --- | --- |
| I061 | generation | small_definition_read | SYSTEMS cheap closures |
| I069 | medals | representative_deep_read | S13 |
| I078 | names | representative_read | SYSTEMS cheap closures |
| I098 | ribbons | representative_deep_read | S13 |
| I124 | unit medals | representative_deep_read | S13 |

### knowledge

| Inventory ID | System | This pass | Route |
| --- | --- | --- | --- |
| I066 | intelligence agencies | representative_deep_read | S06 |
| I067 | intelligence agency upgrades | representative_deep_read | S06 |
| I083 | operation tokens | representative_deep_read | S07 |
| I099 | scientist traits | representative_deep_read | S08 |
| I119 | technology tags | metadata_read | SYSTEMS cheap closures |

### social

| Inventory ID | System | This pass | Route |
| --- | --- | --- | --- |
| I019 | autonomous states | representative_deep_read | S03 |
| I024 | collections | representative_deep_read | S02 |
| I027 | countries | unread | inventory only |
| I030 | country tags | unread | inventory only |
| I080 | occupation laws | representative_deep_read | S04 |
| I086 | peace conference | representative_deep_read | S12 |
| I087 | peace conference/ai peace | representative_deep_read | S12 |
| I088 | peace conference/categories | representative_deep_read | S12 |
| I089 | peace conference/cost modifiers | representative_deep_read | S12 |

### time

| Inventory ID | System | This pass | Route |
| --- | --- | --- | --- |
| I026 | continuous focus | representative_deep_read | S15 |

### world simulation

| Inventory ID | System | This pass | Route |
| --- | --- | --- | --- |
| I095 | resistance activity | representative_deep_read | S05 |
| I096 | resistance compliance modifiers | representative_deep_read | S05 |
| I115 | strategic locations | small_definition_read | SYSTEMS cheap closures |

## Owner routing and genuine gaps

[FAMILY_MAP.json](FAMILY_MAP.json) maps every row to family, current depth, K codes, P01-P25 packet references and actual topic/owner paths. Its status labels distinguish source definitions, commented contracts, metadata, earlier representative work and native unread gaps. An owner link establishes a design home, not implemented support.

| ID | No dedicated owner located in the read YAIRPG surfaces | Nearest existing home, proposed routing only |
| --- | --- | --- |
| OG1 / S03 | Sovereignty/category transition and directed rights-transfer contract | K7/K16, society palette, P07/P14/P18. Keep nation-scale work optional. |
| OG2 / S07 | Geographic information-network diffusion/decay | K11/K23, means and dialogue, P11/P20. First use a finite informant route. |
| OG3 / S12 | Multi-party staged settlement, pending claims and commit reconciliation | K7/K12/K16, events/dialogue, P18/P19/P24. Whole-cost quoting does not prove this engine exists. |
| OG4 / S13 | Career-profile stat production, scope and retention | K6/K16/K18, life-sim/history/save, P15/P16/P23. Save-wrapper research is not a profile reward implementation. |

These are bounded owner-search findings, not proof of absence across the entire repo. Proposed coordinator edits: add links from the matching existing owners and [cross-game packets](../../cross-game-synthesis-2026-10-14/PACKETS.md) to selected S/HDS-P IDs. No new owner was created and no priority changed. Province War continues to use [the existing fit dossier](../PROVINCE_WAR_FIT.md); LOG01/CUSTOM01/ERA01 remain deferred. S11/S12/S14 may enrich its future references without registering or changing that queue.

## Reference and checks

Full selected tables and comments: `/Users/weiwei/.codex/research/ds-hearts-of-iron-iv/extract/raw/`. Existing [private reference index](../private/README.md) and `/Users/weiwei/.codex/research/asp-hoi4/extract/` remain read-only; the latter retains the complete captured English/event corpus. No private folder outside the assigned output was written. No raw game prose/code/assets are added to Git.

See [SMALL_TOUCHES](SMALL_TOUCHES.md), [consumer proposals](IMPLEMENTATION_PACKETS.md), [TOOLING](TOOLING.md), [source hashes](SOURCE_LEDGER.md), [FINDINGS](FINDINGS.json) and [CHECKPOINT](CHECKPOINT.md). Validation checks artifact shape, all prior taxonomy rows, owner paths, source paths/hashes and numerical illustrations. It does not validate a native engine, live UI or saved game. No game run, personal-save read, new install, staging, commit or push.
