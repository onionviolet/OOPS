# Relevant-system coverage map

2026-10-15. Final map for supplied Qud 2.0.211.56. This is complete across the requested audit families and their named dependencies, not an exhaustive gameplay taxonomy. The initial map was written before deeper capture; this final version records achieved coverage and exact gaps.

**C** = complete supplied data catalog. **R** = named source chain/windows reviewed. **P** = predecessor evidence reused with its limits. **E** = full source retained but not fully read. **U** = unresolved or outside semantic coverage. Every row remains native-unverified.

| Code | System / question | Status and actual coverage | Precise remaining gap / owner |
|---|---|---|---|
| S1a | Skills and proficiencies | C: 21 skill/123 power rows, full text/cost/stat/prerequisite metadata; R: loader/index and gate semantics | Runtime mods/overrides; most individual consumers. [S1](SKILLS_AND_PROFICIENCIES.md) |
| S1b | Buying skills | R: parent substitution, SP/base-stat checks, confirmation, component add and free inclusions | All failure callbacks and charge-on-add-refusal behavior in native play |
| S1c | Teaching and acquisition | R: ritual offer/reputation/teacher attribution; training-book read key/NPC route | NPC-to-NPC teaching generally; every initiatory sequence and alternate teacher |
| S1d | Active/passive and NPC use | R: Jump target/body/path/payment/removal/NPC handlers; Spry DV add/remove; Axe to-hit handler | Remaining 120 power rows lack new full consumer review; prior cooking paths separately P |
| S1e | Skill removal and persistence | R: component/free-child removal, Skills count writer, generic object property/part save windows | Paid dependent skills, skill-list rebuilding and all stat-shift restoration; no round trip |
| S2a | Names and display titles | C: full Naming table; R: DescriptionBuilder title-list formatting/clear | Most legendary epithet producers, every display field's origin/lifetime |
| S2b | Item naming and bestowal | R: NameItem state/counters/journal; optional bestowal → relic armor fields/stat shifts | All opportunity probabilities, elementary powers, transfer/revert/save lifecycle |
| S2c | Reputation and social services | C: authored Factions/ChiliadFactions; R: first ritual → numeric reputation → paid skill → real action | All faction AI/trade/holy-place callers and dynamic faction realization |
| S2d | Named faction rank | R: separate player/NPC rank owners, generic promotion/comparison delegates and configurable UI text | A specific campaign promotion/privilege instance, demotion/removal, all rank hooks |
| S2e | Achievements | C: 150 static declarations; R: equipped producer → state/notification/save; threshold/child counters | Every producer/consumer, platform implementation and write-failure behavior; no universal reward absence proof |
| S2f | Accomplishments/mural/gospel | R: ritual, item naming, generated quest, book examples and Journal serializers | All alternative narrative rules and player-history consumers |
| S3a | Mutations/acquisition | C: 132 normal/hidden rows; R: four-MP purchase, selected pool, inherent add/modifier/remove | Most mutation descriptions/consumers; every mutation eligibility conflict and Sifrah branch |
| S3b | Ranks/caps/resources | R: base/effective/temporary-source distinction, cap helper, one-MP rank-up, serialized cooldown fields | Every subclass cap, rapid-advance acquisition and all cooldown scheduler consumers |
| S3c | Inherent active power | P/R: selected cold cast/AI/body/readiness consumer reused; mutation owner deepened here | Lethal/full combat dispatch, all AI response methods and native thermal outcome |
| S3d | Attached item power | R: real TauHeadpiece/Telepathy declaration → tracked equipment grant → conversation attempt → source removal | Conversation success/cost, overlapping transfer/copy interruption and all item providers |
| S3e | Cybernetic support | C: 91 inherited candidates; R: physical SingleSkillsoft2 → terminal/body install → skill consumer → support-count removal | All 91 individual effects; license upgrade/security/slot graphs; native support restoration |
| S3f | Borrowed body | R: Domination success switches Player.Body, normal effect/end action/return windows | Exceptional source death/metempsychosis, generic copied/borrowed knowledge and cross-body save |
| S3g | Anatomy and fit | P: multiple-arms/body nodes, fitting/removal/same-item aftermath; R: cybernetic BodyPart serialization | Entire topology, all severing/reattachment and serializer reconciliation |
| S4a | Identification | R: object epistemic field/global blueprint understanding, inspect attempt/cost/failure/display distinction | All result methods, shared-knowledge semantics under body changes and full actor epistemics |
| S4b | Tinkering recipe catalog | C: all object/Mods tables and 964 broad candidate index; R: LoadBlueprint filtering and TinkerData recipe creation | Exact baked runtime recipe pool; ordered inheritance/mixins were not executed |
| S4c | Reference versus learned construction | R: disk Learn consumes disk; direct Build keeps reference; actual bits/output/energy; known-list serializer | All NPC ownership and exception/rollback routes, every recipe/mod/ingredient alternative |
| S4d | Psychometry/reverse engineering | R: identify versus learn-existing-template branches; E: reverse engineer/disassembly skill classes | Full disassembly outcomes and all Sifrah processes/bonuses |
| S4e | Books | C: Books table; R: training per-book per-actor record, Markov seeded read/fragment owner | All generated pages/secret insertions/corpus distributions and ordinary reading consumers |
| S4f | Cooking/invention/learning/use | P: complete supplied Foods/Data, 66 domains/181 concrete references; closed jam/jerky/recipe/HP chain | Exact lethal-hit ordering, all domain combinations/effects; no repeated full cooking review |
| S4g | Liquids/fuel/material uses | P: composition → pure-fuel gate → retained cell/socket → weapon/light; R: buildable gaslight blueprint joins crafting | Mixtures globally, counter drain/refill/load and query side effects; no exact per-swing promise |
| S5a | History/entity snapshots | C: HistorySpice; R: ApplyEvent/ordered snapshot/serializer and village initializer | All event generation logic, grammar branches and timeline/causality semantics |
| S5b | Village realization | R: stored region/faction/sacred context and selected quest context; E: full Village/VillageBase | All settlement layouts/populations/economies and generated faction consumers |
| S5c | Procedural fetch quest | R: template/cache ID → independent builders → physical placement → acceptance/early inventory scan → turn-in → reward | Already-built destinations, missing giver/item, repeated builders, cloned IDs and recovery |
| S5d | Other generated quests | E: type inventory and shared factory/context; full tables retained | Site, object interaction and negotiate templates are not semantically closed here |
| S5e | Relics/generated items | C: Relics table; R: history/element/type into actual item bestowals and description | All subtype/element consumers and spawn distribution |
| S5f | Time/remote world | R: historic years differ from scheduler; zone visited/freeze/thaw elapsed-tick hook | All thaw listeners and remote resource/NPC/combat progression; no blanket offline simulation claim |
| S5g | Generated-world persistence | R: histories, cached objects/builders, quest state/tracking/reward, journal explicit owners | Full generic field serializers and exact native save/arrival-order equivalence |
| U1a | Skills/mutations/reputation UI | R: rows/details/cost gates and activation/cancel differences | Matching-version screenshots, font/layout/controllers and settings |
| U1b | Cybernetics UI | R: option IDs, slot/replacement, cursor-complete → actual install, global versus submenu Back | Serialized prefab wiring/geometry, all screen cursor sequences and native mutation timing |
| U1c | Ability manager/bar | R: highlight/selected result, unusable reason, hotkeys/pages/command queue, entry flags/cooldown | Every caller/dispatch order, stale readiness, layout/rebind/controller behavior |
| U1d | Items/tinkering UI | P/R: actual action collection and inventory; modern known-recipe → actual build helper | Every action provider, exact quantity controls and native build/payment/error flow |
| U1e | Journal/recipe/map/generated result | P/R: reveal/known recipe distinction; track/highlight map notes; fetch accept/result | All screen return focus/prefab events and exact current rendering |
| U1f | Visual comparison | R: one parent historical ingredient image inspected; source/image distinction preserved | No version-matched images of the other requested surfaces |

## Full catalogs and scope

[Source inventory](SOURCE_INDEX.md), [per-type window ledger](private/REVIEW_LEDGER.json), [exact unread rows/types](private/UNREAD_AND_UNKNOWN.json), [table coverage](private/TABLE_COVERAGE.json) and [UI trace](UI_IMPLEMENTATION.md) provide the inventory behind this map. Full class export is only E until named semantic work supports R; data catalog C is independent of both. Classes may span families and counts overlap.

All work stayed in this directory. Existing dirty source/build/design work and other chats' research were preserved. No parallel workers or new chats were launched, and no source game or personal save was opened. Research findings do not change accepted priorities or create required YAIR gameplay gates.

## Deeper continuation, 2026-10-15

The research-only [skills, mutations and cybernetics supplement](depth-1/REPORT.md) adds effect consumers, formulas, combinations, limits and NPC policies, with complete private captures and explicit reading coverage. The initial audit above remains its own checkpoint; this does not change YAIR product authority or claim native verification.

## Unread continuation, 2026-10-15

The next research-only [effects, NPC and cleanup supplement](depth-2/REPORT.md) traces long-blade control, reactions/ranged upgrades, Sunder/Mirror/Mass Mind, follower support, temporary-copy expiry, anatomy, additional implants and gas navigation. Full private source and explicit unread inventory are retained; no native or implementation acceptance is claimed.

## Cleanup continuation and Steam pin, 2026-10-15

[Depth3](depth-3/REPORT.md) follows direct removal, effect/goal/flight/contents consumers and additional ability combinations. The current Steam CoQ.app assembly matches the existing pin; the older Applications path remains absent. The joined private unread inventory preserves captured-only and partially read limits.

## Field and physical consumer continuation, 2026-10-15

[Depth4](depth-4/REPORT.md) follows forcefield/stasis, gravity/fall damage, destruction/context, opinion expiry and teleport/burrowing combinations. [CURRENT](CURRENT.md) links the latest joined unread inventory; prior counts remain their dated scope.


## Depth 5 continuation, 2026-10-15

Queued vortex serialization, scheduling, expiry and cell-save consumers are now traced in [depth 5](depth-5/REPORT.md), with an [independent audit](depth-5/independent-audit/REPORT.md). Use [CURRENT](CURRENT.md) for current unread owners. Earlier inventories remain dated evidence; no whole-system or native completion is implied.


## Depth6 continuation,2026-10-15

[Alternate save roots](depth-6/REPORT.md) now establish conditional full-body preservation through Physics damage references, distinct from reference-only links, placement and activity. [CURRENT](CURRENT.md) points to exact updated unread owners. Earlier queue omission evidence remains valid with this qualification; universal disappearance is not claimed. Research only.


## Depth7 continuation,2026-10-15

[Recovery consumers](depth-7/REPORT.md) now distinguish retained effects/credit/HP access, generic null-origin movement and the missing automatic target selector. Party cell scans and AI nowhere guards are traced; exact unread owners are linked from [CURRENT](CURRENT.md). Metadata field references are navigation evidence only. Research only; no native recovery performed.
