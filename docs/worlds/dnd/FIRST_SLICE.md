# Proposed first playable slice: a working life in Phandalin

2026-10-11. Decision-ready design, no implementation. [Source anchors](SOURCE_CONTRACT.md) and [coverage IDs](COVERAGE_MAP.md) apply. All new lives, people, wages, situations and consequences below are authored branch proposals, not a reproduced published adventure.

## Current qualification, reconciled 2026-10-20

WPD-R11: [SRD521_START](SRD521_START.md) already qualifies a proposed ST2
SRD 5.2.1 snapshot, including Mending acquisition/components, and
[RULINGS_LEDGER](RULINGS_LEDGER.md) records provisional local calls. The older
A1/starting-table audit requests below are historical for those delivered
source/design pieces; do not redo them as missing work. Still open: selected
setting/era evidence, source-critical exceptions for the chosen journey,
ST1/ST3 if the three-start scope is selected, and actual native consumers and
current-format round trips. A qualified ST2 does not implement its listed spells.

ACCOUNT FOR NOW (WG23): demand for an actual bag repair may be finite, and a
client can react to observed service. No obligation to simulate a displaced
repair economy follows from one at-will cantrip. Before implementation, freeze
the actual object/tear, access/hand/voice/focus timing and funded fee, keeping
replacement distinct from repaired identity. Level/effort: coordinator medium
for object/spell/time/publication, Luna low for supplied SRD fields. Done check:
valid repair and incompatible-target refusal preserve custody and settle once;
Save/reload/Export/literal Import retain unfinished casting and final results.
Primary desktop target is 1920×1080; floor 1536×864, mobile deferred.

## Region and starting lives

P: town plus one short surrounding work route. The Phandalin overview supports a mining settlement with ordinary trades, lodging and service locations (S04). It does not establish every local service price or historical role. New local contacts avoid pretending an uninspected canonical NPC biography is known.

| Start | Proposed body and rules package | Actual opening means, obligations and alternatives |
|---|---|---|
| ST1 caravan guard | Adult human, level-one Fighter; background/proficiencies selected only after O1 origin audit | Own basic clothing and verified legal equipment; modest cash; guard contact and paid lodging obligation. Inspect load, negotiate work or hire repair. No free crafting proficiency inferred from occupation. |
| ST2 itinerant student | Adult human, level-one Wizard, proposed Sage background; exact class/starting equipment audit open | Personal spellbook and casting implements only after rules qualification; proposed Mending selection; limited cash and a lodging lead. Offer fitting repair, take ordinary labor, pay another craftsperson or seek instruction. Study cannot create an unlisted spell or slot. |
| ST3 shrine helper | Adult dwarf, level-one Cleric, proposed Acolyte background; exact species/class package audit open | Local shrine contact, verified kit and prepared spell options, modest savings; opportunity for service in exchange for board. Care, organize supplies, use an eligible spell or refuse work. No unlimited free healing or divine favor assumed. |

Initial bodies, ability scores, HP, proficiency lists, known/prepared spells, cash/items, relationships and actor knowledge must form a complete snapshot before any start is eligible. Human/dwarf combinations are proposals to verify, not accepted randomized truth. These design names are author-only. A random-entry UI reveals surroundings and usable means, not a catalog of future discoveries. One start can establish the first technical proof; delivery of the promised three-start slice requires all three functioning journeys.

## Connected action contract

P: a local carrier needs a torn work bag repaired before a supply run. This modest invented job tests useful magic alongside tools and negotiation. A bag has a known owner, contents, reachable location, condition and exactly one settlement claim. The tear size and repairability are observable through inspection; the sample positive fixture is a single six-inch tear, not sealed mystery content.

| Leaf | Action and actual alternatives | Cost/time, failure and consequence | Owner / gate |
|---|---|---|---|
| PS01 | Meet carrier; inspect bag; ask terms; decline | Inspection takes proposed short time; reveals observed condition, not hidden motives. No wages, debt or acceptance for merely viewing. | People/knowledge plus object-condition consumer; actor and location validation. |
| PS02 | Agree cash fee, service-for-board or instruction exchange | Freeze one selected agreement, deadline and reward; client must own promised funds/access. Cancellation policy shown before agreement. | Existing claim/job pattern; authored terms and settlement receipt. |
| PS03 | If legally known and executable, cast Mending on eligible tear; alternatively pay a qualified worker, use owned needle/thread with declared skill, or buy replacement | Mending uses C06's one-minute casting and actual component/casting means. Mundane repair duration/materials are an explicit ruling, not C02's manufacture formula. Too-large damage or missing components rejects spell route; no roll for the spell's guaranteed valid effect. | New typed object eligibility/repair consumer; authoritative item remains in existing inventory/custody owner. |
| PS04 | Choose departure now, prepare more, ask another worker, stay local or abandon contract | Supplies, daylight and route access rechecked. Optional paid help needs actual availability. Refusal retains only already agreed consequences. No remote NPC cooperation inferred. | Common clock, sites, participant and knowledge gates. |
| PS05 | Encounter a visible mundane route obstacle; inspect, detour, attempt bounded check, request help or turn back | Example P fixture: unstable stepping stones. Declare one DC and consequences before coding; retry only after a meaningful changed approach, not infinite free rolls. Use C01 for eligible uncertain attempt, deterministic paths where appropriate. | New profile-specific d20 resolver with saved cause/roll, exposure and outcome; existing frozen encounter responses. |
| PS06 | Deliver supplies; settle chosen fee/board/lesson; return or continue ordinary work | Exactly one settlement. Client remembers completion or declined/failed agreement only if witnessed. Lesson creates understood instruction, not automatic class level/proficiency. | Existing claims/knowledge/relationship/job patterns plus explicit consumers. |

The repaired bag must matter to PS04 or transport capacity; a renamed item reward alone fails the proof. Mending must work on another compatible object through the same consumer, and reject an incompatible object. The mundane route remains useful if magic is unavailable. Board offsets an actual lodging expense; instruction opens an actual later learning action. Rewards and costs are proposed balance values to freeze after source review.

Idle translation P: crafting/study/travel remain committed jobs on the common world clock; tactical and hazardous choices pause for a decision. Interface pacing may compress elapsed real time, while source in-world durations remain explicit. No unattended lethal rolls or browser-closed losses are added. Safe finite work can later automate with declared inventory, funding and interruption limits. The first slice is not full combat, a whole adventure or a second prestige layer.

## Engine fit, inspected source and missing seams

Source-inspected means neither runtime-verified nor sufficient for arbitrary D&D behavior. Current dirty source is the evidence base, not the prebuilt bundle.

| Gap ID | Classification and actual current source | Required interface/behavior and observable proof |
|---|---|---|
| E01 | Content over existing contracts: [simulation commands](../../../src/simulation.js), `previewSimulationCommand` and `commitSimulationCommand`; [contracts](../../../src/simulation_contracts.js) | Author actors, jobs, costs, parties, conditions and claims. Recheck location/participants/occupancy and quote sequence at commit. Preview, refusal and failed save cannot spend, roll or reward. |
| E02 | New shared consumer: D&D checks. Current command outcomes use weighted draws; [combat math](../../../src/combat_math.js) uses native hit/evasion and mitigation, not d20 vs AC | Proposed profile resolver input: actor snapshot, test kind, target/DC or AC, proficiency, advantage state, modifiers, cause and source binding. Output: frozen dice/result/effects. No invented existing export. Prove roll accounting, advantage cancellation and reload invariance. |
| E03 | New object consumer: existing [effects](../../../src/simulation_effects.js) hold items/custody/knowledge, not a verified arbitrary-object Mending adapter | Authoritative object fields for damage geometry/type and repair state; spell eligibility from held means; atomic update, without a second inventory. Positive compatible target, oversized break rejection, inaccessible target rejection, same object after reload. |
| E04 | New profile/state/native consumer: [native adapter](../../../src/native_gameplay_adapter.js) reads native stats; D&D abilities, HP, slots and origin packages need explicit mapping | D&D state belongs to selected world-instance/profile owner; native projection is a reviewed binding. Do not assume native stat names/XP equal D&D abilities/levels. Pin profile revision, preserve existing saves and reject unsupported content cleanly. |
| E05 | Source contract available, D&D rest/conditions incomplete: condition and life effects exist in [simulation effects](../../../src/simulation_effects.js) | Later consumers must implement eligibility, interruption, concentration, slot recovery and zero-HP sequence from frozen rules. A life enum is not death saves. First repair route need not depend on full rest or lethal combat; add them before an encounter requires them. |
| E06 | Existing native battle is unsuitable as D&D rules proof: [native battle](../../../src/native_battle.js) uses `rollCombatStrike` and its rival opening explicitly stops at one HP | Later tactical adapter owns initiative, actions/reactions, targets, AC/saves, damage, conditions and group consequences while reusing durable publication and UI where fitting. Do not relabel the native duel as D&D. |
| E07 | Persistence extension and private content binding: [save files](../../../src/save_files.js) validates current envelope; [engine authoring](../../ENGINE_AUTHORING.md) describes integrations | Select schema/migration for profile pins and object/check receipts; absent D&D pack yields declared unavailable-content behavior, no rerolled start. First-start selection and settlement survive save/reload/import. Raw setting text remains outside git/bundle. |

Source inspections establish reusable shapes for actor knowledge, conditions, story life, claims and jobs. They do not prove this proposed journey works. Reinspect changed owners before assigning engine writes; this GM has no shared-engine ownership.

## Finite next units and acceptance

**A1 next bounded research unit:** inspect O1 character creation, the three proposed classes/backgrounds, Mending acquisition/components and the selected town setting chapter. Freeze one legal ST2 snapshot, one object schema and PS01–PS03 terms; qualify ST1/ST3 afterward. Prefer an already-held/signed-in setting source, or an explicitly selected accessible official source; do not acquire a large corpus merely to fill this table. Exact wages, repairs and local event routines remain authored rulings unless sourced.

**A2 later implementation packet:** master assigns exclusive shared adapter ownership for E02–E04/E07; world content writer owns local actors/jobs/objects/private setting data. Freeze interfaces before parallel writers. Build a connected PS01–PS06 journey, then finish all three starts before claiming the three-start slice. No implementation is authorized by this document alone.

**A3 acceptance:** rebuild, then run positive and counterexample journeys from fresh test origins. Verify inspect versus know, agree versus view, valid spell target versus invalid, paid/mundane/replacement alternatives, useful repaired-object consumer, meaningful changed retries, interruption/refund terms, distinct starts and once-only settlement. Save/reload/import at origin selection, unfinished repair/check and completed settlement; simulate failed publication and unsupported pack. Preserve private user saves. Browser evidence, shared integration and director acceptance remain separate.
