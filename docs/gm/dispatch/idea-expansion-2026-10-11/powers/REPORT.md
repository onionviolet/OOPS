# G2 powers, cheats and progression: actionability pass

Planning revision 2026-10-11.1. Status: planning-reviewed-by-worker. No runtime claim.

## Scope and authority

This additive packet audits existing public idea families and inspected engine seams.
It does not reopen a full source work, choose a world for implementation, modify
accepted mechanics, or verify gameplay. Existing source/detail owners remain canonical.
The companion [REQUIREMENTS.json](REQUIREMENTS.json) holds 29 proposed functional
requirements, the complete 49-family library disposition, 12 player-layer cards,
and preserved growth/concept/simulator palette IDs. Each requirement includes
scope, variants, effects, dependencies, consumer gaps, acceptance and open work.
The palette is not a list of 29 universal laws. A selected world defines its rules.

## Findings and corrections

| ID | Concrete gap | Planning consequence |
|---|---|---|
| F1 | Library prose suggests arbitrary runtime state under actor.sources; inspected validator checks acquisition provenance and existing acquisition writers construct fixed records. | Introduce a validated optional runtime-card owner or explicit schema extension; do not hide charges/anchors inside incidental unknown properties. |
| F2 | Copy/transfer/fusion of executable powers already exist, but copying a power record does not install donor anatomy, actual source/faculty or authority. | Preserve each requested transfer layer with its own transaction/consumer. |
| F3 | Scenario rewind restores only a scenario and explicitly retains actors/worlds/RNG. The heir builder creates a fresh expansion. | Full regression and retained powers require domain/identity/carrier support; succession and regression are separate functions. |
| F4 | Numeric capabilities and power previews alone do not implement absolute functions, reflection, clone combat, exact future sight or conceptual rule changes. | Name a selected actual consumer for every verb; catalog labels never close a criterion. |
| F5 | Older proposal prose requires scarcity, counters, dormant starts or limits for every cheat. Current actionability prompt preserves free, fully powerful and exceptionless variants. | Retain older restrictions only as selected local variants. No manufactured downside, forced hunter or generic counter. |

## Inspected source contracts

These are source observations, not browser claims. Exact current symbols and
range locators are retained here so implementers do not invent interfaces.

| Path and locator | Actual support | Boundary still open |
|---|---|---|
| src/expansion_engine.js:297 createContentRegistry | sources/capabilities/techniques/rollTables/actions plus simulation registry | No generic runtime cheat-card registry asserted |
| src/expansion_engine.js:192-202 acquisition validator; :495-501 source effect | Acquired source timestamp/expiry/receipt/world/revision/origin | Arbitrary cheat state is not an established validation/migration contract |
| src/capabilities.js:9-76 validateCapabilityDefinitions/queryCapabilities | Positive numeric grants, max/sum, provenance and faculty suppression | A capacity value is not a semantic promise or automatic observation authority |
| src/power_models.js:5-44 previewPowerModel | Practice/design/investment/authority/hybrid scope and costs | Actual target effects remain separate shared effects/native consumers |
| src/simulation_effects.js:262-304 | Explicit resurrection, faculty lifecycle and power copy/transfer/fusion/mastery | No generic consciousness/anatomy/authority transfer inferred |
| src/simulation_contracts.js:42-87 | Closed typed effect vocabulary with knowledge/faculty/power validation | New function-shaped operations require selected typed adapter |
| src/expansion_engine.js:582-631 advanceSimulation | Cloned advancement, choice stops and boundary budget | Complete native replay/purity is not proven in this pass |
| src/expansion_engine.js:652-675 scenario checkpoint/rewind | Isolated scenario snapshot; actors/worlds/RNG retained | Full-world restore and temporal carrier entitlement absent from this helper |
| src/life_experience_host.js:8-28 buildLifeHeirSave | Fresh envelope/new expansion, chronicle, NPC lives/options/life record | Does not copy retained powers or world snapshots; no runtime route checked |
| src/skill_expansion_content.js:1-90; src/skill_expansion_host.js:13 | Native XP, ordinary method learning/mastery/real stock and knowledge presentation | Representative existing joins, not proof all skills/powers are integrated |
| src/models/skill.js:175 add_xp; src/techniques.js:techniqueFacts | Native XP and observed/understood/owned/practiced/executable separation | Local level meaning and exceptional instant-learning need actual adapters |
| src/main.js Math.random callsites | Native randomness remains in crafting/gathering and other selected logic | Exact future sight cannot claim complete native deterministic replay |

## Requirement map

| ID | Functional family | Sections |
|---|---|---|
| G2-001 | Acquisition, information, mastery and actual authority | S02, S07, S09, S14 |
| G2-002 | Real effects and ordered execution | S07, S08, S14 |
| G2-003 | Copying, harvest, absorption and template shelves | S06, S07, S08, S09, S14 |
| G2-004 | Regression, anchors and checkpoint load | S07, S11, S12, S14 |
| G2-005 | Revival, reserve bodies and adaptation | S02, S07, S08, S11, S14 |
| G2-006 | Time dilation, acceleration and time stop | S05, S07, S11, S12, S14 |
| G2-007 | Analysis, divination and actual future sight | S07, S09, S11, S13, S14 |
| G2-008 | Life simulators and outcome selection | S02, S07, S09, S11, S12, S14 |
| G2-009 | Talent lottery, accumulators and generated rewards | S07, S09, S14 |
| G2-010 | Growth, levels, scales and mastery | S01, S07, S09, S14 |
| G2-011 | Ordinary skills remain useful at the top | S04, S05, S06, S07, S09 |
| G2-012 | Held systems, quests, shops and playable system entities | S02, S04, S05, S07, S10, S14 |
| G2-013 | Sign-in, daily intelligence and choice rewards | S03, S07, S09, S11, S14 |
| G2-014 | Multiplier returns, disciples and follower power | S04, S05, S07, S14 |
| G2-015 | Absolute knacks, stealth, perfect comprehension and perfect crafting | S05, S06, S07, S09, S14 |
| G2-016 | Storage, pocket worlds, territory and owned reality | S03, S05, S06, S07, S12, S14 |
| G2-017 | Duplication and perfect production | S05, S06, S07, S14 |
| G2-018 | Possession, swapping, shapeshifting and split carriers | S02, S04, S07, S09, S14 |
| G2-019 | Clones, summons, heroic spirits and many selves | S04, S07, S08, S12, S14 |
| G2-020 | Resident spirits, companions and inheritance tests | S04, S07, S09, S10, S14 |
| G2-021 | Wishes, outcome edits, luck and incident direction | S01, S07, S09, S11, S14 |
| G2-022 | Contracts, debts, karma, vows and authority | S04, S05, S07, S09, S14 |
| G2-023 | Names, titles, achievements, memory and recognition | S04, S07, S09, S10, S14 |
| G2-024 | Automation, offline growth and reading | S05, S07, S11, S14 |
| G2-025 | Deep concepts, optimizers and unbounded functions | S01, S07, S09, S14 |
| G2-026 | Compatibility, conversion, suppression and retention | S01, S07, S12, S14 |
| G2-027 | NPC holders, rival progression and institutional consequences | S04, S05, S07, S09, S10, S14 |
| G2-028 | Known-card UI, reports and playability | S09, S13, S14 |
| G2-029 | Versioned card state and durable integration | S07, S14 |

## Shared functional card contract

The JSON cards inherit only authoring obligations, not fictional costs. A selected
card freezes actual origin/acquisition, source identity and revision, carrier,
backing, faculty/body/authority support, verbs/targets, trigger and effect order,
resources only when required, growth/fixed function, meaningful variants,
observer channels, NPC policy, interruptions, duration, retention and compatible
worlds. Each selected function binds an authoritative state owner and native
consumer. These authoring fields are not exported APIs or new game-save fields.

Micro details to finish within that card include self/allies and moving targets,
startup versus ongoing input, source removed mid-action, joint orders, copied
revision, interrupted settlement, resumed absence, duplicate identity and
witness evidence. Macro chains must use actual changes: production changes
supply, teaching changes workforce capability, reliable futures change contracts,
and an army changes actual reach. Institutions respond only through knowledge
and means; a harmless invisible passive need not trigger a hunter.

## Ready bounded implementation packets

These packets are preparation for the integrator to select. They are not launched
runtime assignments. Proposed future file areas must be reserved explicitly;
current source/build writers keep ownership. Each packet delivers one connected
journey through original native UI in a selected qualified world, without a
mandatory Frontier opening.

| Packet | Requirement scope | Proposed exclusive writer and files | Dependency and actual proof |
|---|---|---|---|
| P1 functional acquisition | G2-001/002/003 plus G2-029 | Shared power integrator: selected simulation effect/contract edits; world worker owns only selected new card/content/host files | Freeze exact method/source/body outputs. Observe a method, acquire superior functional copy and use it on actual target; compare donor consequences and reload. Old saves receive no invented source. |
| P2 one absolute function | G2-015 plus G2-028/029 | Selected native consumer writer; content and UI descriptor writers disjoint after interface | One qualified origin or earned route obtains the function, ordinary method fails on a supported task, absolute method succeeds, repeat/reload/import works. Requires no generic hook bus. |
| P3 isolated simulator | G2-007/008/009 plus G2-028/029 | Simulation runner/settlement owner, then separate world content worker | Establish all-owner purity fixture; freeze subject/policy/seed/clock/knowledge/reward. Complete a short run with one real kept output. Report-only, failed settlement, real-seed match and changed policy cases; measure responsive budget. |
| P4 system and host | G2-012/014 plus G2-027/028/029 | System-host owner, native command/UI integrator and disjoint world quest data | One actual host/system relationship issues mission, fulfils or refuses, grants reward and transacts shop or teaching. Gift remains after supply loss where promised. Test duplicate claim and opaque hidden intent. |
| P5 temporal retention | G2-004/005/006/026 plus G2-029 | G4 temporal integrator owns domains/clocks; G2 retention writer owns only agreed power-carrier adapter | After G4 snapshot/identity contract, exercise one regression and one distinct succession/revival variant with actual retained power support, RNG/memory/claims, nested reset and save/import. Scenario-only rewind cannot pass full-world criterion. |

Every packet freezes target world/card revision, exact edits, positive and
counterexample cases, persistence compatibility and native presentation before
runtime work. Browser proof requires a current rebuild and fresh origin. Old-save,
save/reload/import and failed durable write evidence accompany changed persistence.
Implemented source, browser verification and Weibao acceptance remain separate.

## Cross-lane joins and remaining work

| Join | G2 supplies | Other owner supplies |
|---|---|---|
| G1 starts | Actual carried source/body/mastery/authority and first usable cheat verbs | Qualified random entry state, knowledge, pool/selection persistence and compatible body |
| G3 life/material | Effects on production, residents, teaching, institutions and stock | Named actual services/material consumers and knowledgeable local reactions |
| G4 history | Temporal cheat mechanism, truth reach, trigger, support and retained carriers | History/instance identity, rollback domain, causal propagation, clocks, memory/claim/RNG policy and simultaneous ordering |
| G5 integration | Stable requirements, source observations, family disposition and packets | Canonical requirement deduplication, exact ownership, chosen interfaces/revisions and follow-on world assignments |

World GMs still need source-bounded local variants and full functional/source
cards for each selected setting. Uninspected/private material is listed in JSON
unreadRemainder and remains with its current owner. This packet does not establish
coverage of every book/anime world, every original audit, all runtime systems or
the entire Cartesian product of possible powers. No downloads, builds, tests,
private saves, commits or gameplay edits were made.

## Checks

Worker self-review checked distinct mechanism outputs, current accepted direction,
no arbitrary nerfs, source-symbol boundaries, spoiler-safe wording and all 49
library-family mappings. JSON structure, requirement ID references, input and
source pointer existence, expected palette counts and own-file whitespace were
validated locally. Runtime acceptance gates remain open.

## Latest VFX and micro-progression join

G2-028 joins the existing [presentation palette](../../../../PRESENTATION_AND_FOURTH_WALL.md)
to the [G7 review owner](../review/REQUIREMENTS.json): time clock/rewind, Infinity
approach gaps, adaptation wheels, domain borders, theft/copy motion, clone split,
body swap and possession bleed, space folds, pocket-world weather, fate threads
and reality-layout effects. TX1-TX13 and VP1-VP4 stay linked as prior IDs.
Anticipation, activation, contact, counter and aftermath reflect actual committed
functions; persistent marks reflect durable consequences. Viewer means determine
what can be shown. G7 owns the full visual audit, infrastructure and effect proof.

G8 owns native micro-progression bookkeeping and title/skill/trait/perk consumers.
G2 retains acquisition, actual function, growth variants, source carriers and
retention; G5 should join these owners instead of creating duplicate criteria.
