# RimWorld systems sweep, 2026-10-14

**Corrections and qualifications first:** prior descriptions of “faction economy” remain inventory labels, not proof of an offscreen supply simulation. The inspected settlement stock is generated, discarded after its period, and materialized again on access. Prior quest lifecycle coverage did not include generation: authored nodes build saved parts from temporary variables. `Slate.DeepCopy` copies the variable dictionary while retaining object references, so it is not a world-state sandbox. XML patch sequences stop on failure without rolling back earlier mutations. These are new qualifications, not reproduced game defects. [S09/S14/S15](SYSTEMS.md).

This sweep adds fifteen bounded source traces across bodies, care, substances, relationships, mood, companions, Royalty, powers, trade, travel, diplomacy, crops, infrastructure, content and quests. The [family map](FAMILY_MAP.json) preserves **all 254 raw definition families**, plus prior runtime/namespace/prefix rows and the new routes, with statuses and proposed owners. [Grouped inventory](INVENTORY.md) lists every remaining named-only family. The 254 families are XML authoring categories, not 254 independent gameplay systems.

**SHOWN:** installed `1.7.4979 rev109`, assembly SHA-256 `a97a01c4319414414c0ca39f3565215e83300dc608dc94b69a27720095b4e751`, independently rehashed. Steam build 25947168 is **STATED by the prior pinned dossier**, not independently re-read from a manifest in this lane. Historical 1.6 traces remain historical. All new rules are static code/XML evidence. **INFERRED** transfer ideas below are PROPOSALS. No game, Windows executable, content loader, user save, native UI or gameplay test ran.

## Ranked PROPOSALS

The ranks compare new research options. The existing kit selection of P01 Village mixing is STATED in the live successor/earlier dossier context; this lane neither reselects it nor adds gates to it. One realm/one prestige, comfortable nonlethal ordinary hunger, conditional passive growth and reasonable repeatability remain standing direction.

| Rank/code | Useful proposed result | YAIRPG owner and routing | First acceptance evidence if separately selected |
|---|---|---|---|
| 1 / DS-P1 | A named body condition changes one real task, with an explained rate or unavailable means | Genetics G17/G22/G37; K3/K22; P04/P15/P17; S01 | Same useful task before/after condition, recovery control, exact save/reload/import |
| 2 / DS-P2 | A clinic job retains treatment quality and gradual recovery separately | Genetics G31/HI4, life sim; K8/K22; P03/P04/P13; S02 | Actual paid care, changed recovery, persisted pending/final state |
| 3 / DS-P3 | A companion learns and performs a useful job through actual paired work | Companions A2/C3/C10/D1, nonhuman bonds; K6/K13/K26; P03/P06/P25; S06 | Earned training, useful task, unavailable-handler control, retained learner and result |
| 4 / DS-P4 | A recurring relationship has distinct opinion, direct tie and remembered deed | Characters/dialogue and genetics G61/G64; K6/K24; P06/P12/P19; S04 | A caused relation changes a later response; journal reopening pays nothing |
| 5 / DS-P5 | One institution right supplies a recurring service under local conditions | Characters/institution law; K7/K15/K24; P04/P07/P18; S07/S11 | Right retained but unsupported place refuses; valid delivery/cost/cooldown persist |
| 6 / DS-P6 | A power shows reserve, accumulated load, recovery and target applicability | Ability authoring/G43; K3/K10/K15; P04/P17; S08 | Current host quote and commit agree; failed target handling has declared cost policy |
| 7 / DS-P7 | One trade names stock, price modifiers and full commitment before payment | Means/appraisal and modular chains ML8; K8/K9/K29; P02/P18; S09 | Disclosed rounding, stale-stock refusal, conservation and useful proceeds |
| 8 / DS-P8 | A finite crop or travel job produces a useful material under place/actor/capacity rules | Gathering, modular chains ML2/ML7, companions; K5/K9/K28; P02/P08/P13; S10/S12 | Natural queued output, zero-output control, explicit away-clock policy and exact persistence |

No donor formulas are selected as YAIRPG balance. Every UI proposal targets a rebuilt **1366x768 laptop view**, with actor, present means, useful next action and known reason visible together. Mobile optimization stays deferred. Research/source evidence is not browser evidence.

## Prior-pass reconciliation

| Code | Earlier gap/claim | Disposition here |
|---|---|---|
| C1 | Root and feature 1.6 material/food/environment spans | Current body-function and plant/harvest paths added; no wholesale 1.6 reconfirmation |
| C2 | bf-rimworld medical/combat/global balance unread | S01-S03/S08 close selected capacities, immunity, treatment, substances and powers; armor/hit resolution/surgery remain unread |
| C3 | lib-rimworld-deep U10 Royalty unread | S07/S08 close title/favor/permit and psychic resource/cast routes statically; all permits/title inheritance/effects remain partial |
| C4 | Full AI/factions/world economy unread | S06/S09-S11 add companion tracker/command, stock, caravan needs/forage and diplomacy; no global economic/planning simulation claim |
| C5 | Feature A07 inheritance/patch semantics unread | S14 closes selected static merge/sequence rules; effective active loader and mod conflict execution remain unrun |
| C6 | bf-rimworld all quest scripts/reward parts unread | S15 adds generation/slate/four node routes and joins prior saved lifecycle; every script/reward remains unread |
| C7 | Prior inventory labels often still say undocumented after later deep pass | FAMILY_MAP preserves old labels as evidence but credits named prior routes separately. Raw families stay partial even when one consumer is traced |
| C8 | A “power” could sound like title, learned method and current casting are the same | S07/S08 identify distinct faction service, bodily psylink, learned ability, focus, entropy and target readers |

**Owner gaps:** a spatial power-net topology/automatic shedding contract and several donor rendering/engine details have no specific YAIRPG owner located in the read owners. Broad technology/engine/UI routing exists; `owner_gap` does not mean a new owner must be created. No new top-level semantic family is justified just because RimWorld has a Def tag. Every row maps to K/P/topic candidates, with these limits visible.

Full deep reference is retained privately in `~/.codex/research/ds-rimworld/`: 68 successful type exports; all 14,084 raw Def records and full English index reused from pinned earlier work; 1,178 selected raw records and their 243 whole XML source files; method anchors, provenance, command logs and hashes. No raw code/dialogue/prose entered these repo reports. Earlier work roots stayed read-only.

[Systems](SYSTEMS.md), [packets](IMPLEMENTATION_PACKETS.md), [small touches](SMALL_TOUCHES.md), [tooling](TOOLING.md), [prior unread reconciliation](UNREAD_LEDGER.md), [checkpoint](CHECKPOINT.md). Status is **PARTIAL** for explicit unread/runtime limits. No runtime, source implementation, install, commit, push or director acceptance is claimed.
