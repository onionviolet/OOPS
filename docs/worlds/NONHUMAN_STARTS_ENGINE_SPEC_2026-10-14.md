# Nonhuman starts engine specification, 2026-10-14

Status: ENGINE lane source verification and **proposal**, not accepted design or
implemented gameplay. Source read on 2026-10-14; no tests, rebuild or browser run.
Only this document and the [lane checkpoint](../gm/dispatch/nonhuman-starts-2026-10-14/engine/CHECKPOINT.md)
were written. Existing unrelated dirty files were preserved. Locators are relative
to the repository and describe the inspected source, not runtime evidence.

Authority: [requirements owner](NONHUMAN_STARTS_ENGINE_REQUIREMENTS_2026-10-14.md)
F/B/E codes, [origins](ORIGINS_AND_WORLD_TIMELINES.md),
[identity/control](PLAYER_CHARACTER_IDENTITY_AND_CONTROL_2026-10-13.md),
[brood](../GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md),
[intro CR4 and SA14-SA19](../INTRO_FLOW_CONSIDERATIONS_2026-10-13.md), and
[foundations U01/U03/U10/U12/X01/X06/V06](../SHARED_FOUNDATIONS_AUDIT_2026-10-12.md).
Standing direction remains desktop/laptop first, mobile deferred, useful meals,
no hunger death, one playable slice before another. This does not reprioritize
worlds or make paused world gates prerequisites for a Village slice.

Evidence labels: **SHOWN** means read in source, **STATED** names a design owner
or Weibao's recorded direction, **INFERRED** means engineering interpretation or
proposal, **UNKNOWN** means not established. All schemas, examples, APIs and plans
below are INFERRED proposals unless explicitly marked SHOWN. No sealed files were
opened. No outside-source lore claims are needed for these original examples.

## 1. Verification of F1-F9 and B1-B11

### Existing seams

| Code | Verdict | SHOWN evidence and correction |
|---|---|---|
| F1 | Corrected | `src/main.js:535-538` reads the simulation body, but returns only id/form/owner/controller/hands/mobile. It falls back to cosmetic race and invents two hands/mobile. It does **not** include age. `src/main.js:1077` separately sets lifeStage from bio age and **overwrites form with race**, even when the physical body exists. This is not yet one authoritative body read. |
| F2 | Confirmed, source only | `src/backlog_expansion_body.js:222-238` selects reedling only at the verified fresh human-scaffold opening, freezes an origin claim, gives two sap and the inherited source. Body has two hands, mobile, photosynthetic, no air breathing/intake port. No native anatomy-wide implementation is proved by this source. |
| F3 | Confirmed, source only | `src/backlog_expansion_body.js:35-37`, `:344-389` defines stationary Tern, checks actual consent, parks the original body and native vitals, transfers host body/vitals, incapacitates host, and restores the same records on explicit return. Spent clay stamina remains spent; goods do not follow control. |
| F4 | Corrected | `src/realm_traveler_profiles.js:1-5`, `:55-70`, `:422-440`, `:468-470`, `:490`, `:514-521` is explicitly detached, unverified snapshot/planning code. Functions exist as strings. Seven bodies is one sample source's `maxBodies`, not an engine-wide limit; evaluation checks source-specific support at `:310` and `:362`. Human fixtures do not imply a human-only validator. No native controller with N bodies exists here. |
| F5 | Corrected | `src/structured_pack_runtime.js:18-19`, `:28-31`, `:66-71` supports admitted forms/stages and player ownership/control. However admission checks **all starts** against the current form before selection (`d.starts.some`), not only the selected start. Mixed-form start pools therefore cannot work as a general form picker. Body fields here must be scalar, excluding the nested schema proposed below. |
| F6 | Confirmed | `src/realm_boundary_rules.js:51`, `:72-77`, `:100`, `:113-117` validates and applies explicit form lists to boundaries and source support. Keep actual world/material restrictions; function queries should not erase them. |
| F7 | Confirmed, narrow seam | `src/feature_expansion_book_cultivation.js:803-819` documents and requires separate actor/body/controller/soul fields in rule snapshots. This is a rule evaluator seam, not persisted native separation of those owners. |
| F8 | Confirmed, narrow seam | `src/capabilities.js:1-3`, `:11-35`, `:40-69` validates capability/source grants and computes pure provenance-bearing queries. `src/body_progression.js:17-20` grants `body.hand_control`. These are actor-source capability values, not anatomical functions or a body eligibility resolver. |
| F9 | Confirmed with limits | `src/simulation.js:51-59` copies optional NPC bodies/vitals/life policies, but initially creates the player **without** a body. `:483` checks NPC lifespan; `:579-583` can delete body/vitals and restart life under declared rebirth policy. It does not install a replacement template or reconcile native slots/skills by itself. |

### Original blockers

| Code | Verdict | SHOWN evidence and implementation implication |
|---|---|---|
| B1 | Corrected | `src/data/character.js:7,21` creates one global Hero `main_character`. `src/models/combat.js:141,154,173,279,295,398,501` branches on `tags.main_character`, **not** `hero_id`; the owner's claim of 27 hero_id sites is not present in this file. Combat already supports fighter arrays (`:38` onward). Singleton native publication/control is the blocker, not absence of multi-fighter data structures. |
| B2 | Confirmed with nuance | `src/races.js:7-8`, `:58-239` is the cosmetic humanoid palette; live `src/config.js:37-38` disables race/height bonuses; `src/components/bio_component.js:4-16` stores age/height/race/gender. Race definitions contain possible stat bonuses, so “cosmetic” is current configuration/direction, not a schema guarantee. No function declaration occurs there. |
| B3 | Confirmed with nuance | `src/models/stat_haver.js:6-74` gives every instance the same default stat keys. Those numeric keys alone need not be human. Concrete assumptions are `src/models/person.js:316-328,340-350` unarmed/weapon mapping and unconditional Running, Weightlifting, Climbing, Breathing and Shield bonuses; `src/models/hero.js:11,87` imports the global skill catalog. Skill XP also has per-person level owners, so the catalog should not be mistaken for one global XP balance. |
| B4 | Confirmed | `src/display.js:219-229` binds fixed slot DOM; `src/data/character.js:5` lists fixed tools; `src/items.js:128-136` maps armor components to torso/legs/arms/feet. `src/models/hero.js:305-310` equips an inventory item without a body-function check; `src/models/person.js:496` is the lower equipment writer. Gate both action and transaction. |
| B5 | Confirmed | `src/main.js:2791-2795,2799-2844,3721-3735` dispatches health-zero to lost-consciousness text, parent location or last bed, sleeping and Recovering. `src/models/location.js:15-24` represents sleep housing and sleeping XP. Keep the existing human result as a template policy, not the universal defeat meaning. |
| B6 | Corrected | `src/main.js:2156` already calls `backlogNativeActionReasons(...,'travel')`; `src/backlog_expansion_host.js:108-109` includes `bodyActionReasons`, which blocks stationary Tern at `src/backlog_expansion_body.js:470-476`. General immobile bodies outside active Tern possession still have no general function-based native route gate. Restore and authorized realm relocation bypass ordinary travel intentionally; distinguish relocation from walking. |
| B7 | Corrected | Native combat can have arrays of fighters; body fit and controlled-fighter routing are the gap. Shield equipment and skill assumptions occur at `src/models/combat.js:322-343` and `src/models/person.js:82-89`; `src/native_battle.js:16-19` builds a humanoid equipment-oriented fighter snapshot. No natural-attack profile or brood control budget is established. |
| B8 | Corrected and extended | Human-only admission: `src/proto23_world_host.js:20-22`, `src/book_world_paradise_host.js:23`, `src/book_world_mol_state.js:11,33`, `src/book_world_paradise_campaign_facts.js:106-107`, `src/world_completion_lens_facts.js:31,95`. Defaults: Proto23 `:88-89`, Paradise `:61`. Foundation uses **humanoid**, not human (`src/foundation_interaction_content.js:39,58`; `src/foundation_interaction_policy.js:54-55`). `src/feature_expansion_book_host.js:37-42` requires human native scaffold **but admits physical human or reedling**. Several checks are exact authored participant/admission contracts, not generic anatomy checks to delete indiscriminately. |
| B9 | Confirmed and extended | `src/status_care_facts.js:27-28` additionally requires human/mobile/own control; `src/exchange.js:7` defaults absent hands to two; `src/original_frontier_field_content.js:125-126` tests count; `src/foundation_interaction_policy.js:55` adds usable/tender flags. `src/backlog_expansion_body.js:242,368,454` also uses two hands for player and NPC work. Grip count, fine control, injury and special clay/reed functions should be separate requirements. |
| B10 | Confirmed, corrected locator | `src/main.js:2123-2127` uses gender and `middle-aged`; actual greeting branch is **2125**, not 2127. `index.html:80-134` supplies fixed creation fields. The mismatch with `middle aged` (`index.html:110`) needs its own regression; body/life-stage-aware greetings are the larger change. |
| B11 | Corrected | `src/heir_inheritance.js:38-44,79-93` writes goods/money into the singleton recipient envelope; it does **not itself create a human body**. `src/life_experience_host.js:11-21` uses a supplied pristine native envelope then replaces expansion. That replacement can discard a future selected nonhuman body unless explicitly preserved. Succession is a new person/life, not automatic controller or bodily expertise inheritance. |

### Additional assumptions and coverage gaps

| Code | SHOWN locator | INFERRED consequence |
|---|---|---|
| B12 | `src/structured_pack_state.js:49`; `src/main.js:1077` | Save validation equates physical form with cosmetic race while context forces race into form. Split lineage/appearance from anatomy and validate the actual body reference instead. |
| B13 | `src/structured_pack_runtime.js:18`; `src/simulation_contracts.js:60`; `src/simulation_effects.js:232` | Typed beginnings and body effects accept scalar properties only. Nested functions/slots/policies need explicit schema validation and structured replacement/patch operations; cannot slip arrays through the existing body effect. |
| B14 | `src/simulation_contracts.js:237-241`; `src/native_gameplay_adapter.js:43-46,52-58` | Saved vitals accept only health/stamina/max values; live publication always reads those from the native person. Ghost integrity/core charge and bodyless presence need optional pools and body-scoped bindings, not renamed health fields with hidden human semantics. |
| B15 | `src/models/person.js:19-24,116-117,255-258`; `src/models/stat_haver.js:7-9` | Default height is human centimeters; health uses truthy fallback (`0` becomes 60). Never construct a bodyless/zero-integrity actor through these defaults unchanged. Size and an optional stat template must be explicit. |
| B16 | `src/native_gameplay_adapter.js:62-66`; `src/simulation_contracts.js:230`; `src/simulation.js:51` | Existing simulation `controllers` belongs to work/routine infrastructure, not proven embodiment control. Native occupancy is actor-wide; N bodies require per-body job/session reservations plus controller attention policy. Do not reuse this map's name by overwriting its existing contract. |
| B17 | `src/structured_equipment_runtime.js:54,76` | Gear projection requires owner/controller equal actor, form fit and nonzero legs for riding. Lending a body or carrying a sword must keep title/custody separate from bodily fit. A carried sentient sword is not automatically a humanoid rider. |
| B18 | `tests/foundation_start_content.test.js:19,31-37`; `tests/structured_origins.test.js:39,81,122` | Human fixture and explicit elf rejection test lock current admission; one/two-hand tests are useful counterexamples. Add a function-compatible nonhuman positive without weakening intentional world form exclusions. |
| B19 | `tests/structured_equipment_runtime.test.js:7`; `tests/heir_inheritance.test.js:10-11,24-25`; `tests/body_progression.test.js:13-20,51-53` | Human-only equipment fixture, main_character heir fixtures and palms-only body tests prove their slices. They do not prove arbitrary bodies, bodyless controllers or possession. Keep human baselines and add actual nonhuman cases. |
| B20 | `src/backlog_expansion_body.js:520-575`; source searches of `tests/` and `scripts/` | Dedicated reedling selection, Tern possession/return and realm-traveler tests were **missing in the searched trees**: no matches for reedling, possess_clay, return_from_clay or realmTravelerCases. Existing body_progression tests cover training/conditions, not these transitions. Browser or historical proof elsewhere is UNKNOWN, not disproved by this search. |
| B21 | `src/simulation.js:47-51`; `src/simulation_contracts.js:217-223`; `src/main.js:1069,1343` | A body-only simulation record is **not currently admitted**: validation requires numeric enrolledAt, enrollment requires no simulation, and joined-clock detection tests simulation existence. Installing a body cannot merely set enrolledAt=null. Separate body initialization from service enrollment and clock joining with an explicit versioned mode; preserve deliberate opening flows. |

## 2. Body template schema proposal

**Default:** separate immutable, revisioned template from mutable instance. The
single-body first slice keeps `simulation.people.player.body` as the authoritative
instance, with templates resolved by id/revision. No second body save namespace.
**Dial:** a world can provide anatomy variants, stages and compatible exceptions.
**Reasonably:** templates state positive means, not a universal price for being strange.

| Field | Proposed contract |
|---|---|
| schema, templateId, templateRevision | Instance schema 1; content revisions pinned. Unknown revision preserves save and blocks incompatible play rather than inventing anatomy. |
| id, ownerId, controllerId, personId, lifeId, instanceId | Stable body identity; person/soul/legal title/control are separate. Preserve current ids and optional structured lifetime ids. controllerId may be null. |
| form, lineage | `form` describes physical configuration, e.g. human, wolf, clay_vessel. Legacy race goes into lineage/appearance, not function authority. |
| functions | Map function id to `{capacity, channel?, sourceRef?, constraints?}`. Capacities are finite nonnegative values; missing function means unavailable, not human fallback. Effective body view combines template, stage, actual source grants and conditions. |
| slots | List `{id, count, requires, fitTags, maxSize?, custodyPolicy}`. Empty is valid. Worn items remain in existing equipment/custody owners; this list grants no stock. |
| intake | `{modes, mealBenefitsPolicy, upkeepPolicy, shortagePolicy}` with no hunger death. Modes describe matter/energy support; resource production and meal rewards still need their own costs/receipts. |
| rest | `{mode, supportedAt, recoveryPolicy}`: sleep, dormancy, recharge, meditation, none. No universal bed or sleeping XP. |
| defeat | `{trigger, outcome, recoveryAnchor, lossPolicy, continuationPolicy}`. Body defeat, death of a person and end of a run remain distinct. |
| presence | `{kind, endpointRef, anchorRef?, reach, carrierBodyId?, memberBodyIds?}`. Material, incorporeal, object, territory, collective, virtual. Reach names channels/targets; no omniscience. |
| mobility | `{modes, routeConstraints, carrierPolicy}`. Rooted is not walking; carried travel needs an actual carrier and custody/route compatibility. |
| size | `{class, dimensions?, mass?, scalePolicy}`. Units explicit; material mass may be null for virtual/incorporeal presence. |
| lifespan, stages | `{mode, duration?, clockPolicy}` and stage list with thresholds/function/stat changes. Calendar age, biological exposure and time spent in a borrowed body stay separate. No new offline aging by implication. |
| statTemplate | Revisioned stat/pool profile, nullable for a virtual controller. Compatibility profile preserves current human numerical defaults, bonuses and offsets. Other profiles declare attack modes rather than inheriting fists. |
| skillCarryRules | Default classification plus per-skill rules: knowledge on person/mind, motor practice on body, mixed as separate records, soul/source faculty on its actual source. Applicability differs from retained XP. |
| extensions | Namespaced proven physical flags and references (photosynthetic, clayPressure, brassLungId, palms.callused). Preserve unknown inert data during old-save conversion; never treat it as an executable grant. |

Starter vocabulary: `grip`, `manipulate.fine`, `speak`, `sign`, `read`, `write`,
`see`, `hear`, `smell`, `sense.mana`, `sense.contact`, `signal.scent`,
`communicate.telepathy`, `move.walk`, `move.swim`, `move.fly`, `move.root`,
`move.carried`, `move.phase`, `eat.food`, `eat.meat`, `eat.light`, `eat.mana`,
`eat.fuel`, `wear.<slot>`, `wield`, `cast.gesture`, `cast.verbal`, `attack.bite`,
`press.clay`, `produce.reed_sap`, `influence.advice`, `build.territory`.
`eat.*` is an authoring family, not an executable wildcard granting every intake.
`grip.capacity=2` can express two simultaneous gripping structures without two
human hands. Fine manipulation, literacy knowledge, language and spell method are
separate checks. Seeing does not grant read; speak does not grant verbal magic;
wield does not grant weapon expertise. Aliases `hands.grip → grip` and
`travel.physical → compatible physical move mode` translate F4 snapshots explicitly.
`move.root` means local rooted growth/reach, never inter-location travel.

### Illustrative records

The following is a compact record notation, **not executable code or canon**.
Each row resolves to the complete field set above. Common `schema=1`,
`templateRevision=1`, neutral skill policy `carry.default`, and no implied costs.
`F(...)` maps named functions to capacity 1 except `grip:2`; `S(...)` builds
slots requiring corresponding wear functions and fit metadata. Helpers reference
immutable definitions, not runtime objects. Compatibility human slot set includes
head, torso, arms, ring, weapon, off-hand, legs, feet, amulet, artifact, cape and
axe/pickaxe/sickle/shovel/fishing_pole. Physical values not known from existing
records are proposed defaults, never claims that the source already supports them.

```js
[
 {templateId:'body.human.compat', form:'human', lineage:'legacy.race',
  functions:F('grip:2','manipulate.fine','speak','sign','read','write','see','hear','smell',
    'move.walk','eat.food','wield','cast.gesture','cast.verbal', ...humanWearFunctions),
  slots:S(...humanCompatibilitySlots), intake:meal('food'), rest:rest('sleep','housing'),
  defeat:defeat('health.zero','unconscious','last_bed_or_parent','native.compat'),
  presence:presence('material','body.location','local'), mobility:mobility('walk'),
  size:size('human','legacy.height'), lifespan:life('legacy_chronicle'),
  stages:stages('legacy.bio.age'), statTemplate:'stats.human.compat', skillCarryRules:'carry.default'},
 {templateId:'body.reedling.compat', form:'reedling', lineage:null,
  functions:F('grip:2','manipulate.fine','see','hear','speak','read','write','move.walk',
    'eat.light','produce.reed_sap','wield', ...humanWearFunctions),
  slots:S(...humanCompatibilitySlots), intake:meal('light'), rest:rest('dormancy','shelter'),
  defeat:defeat('health.zero','dormant','local_shelter','reed.compat'),
  presence:presence('material','body.location','local'), mobility:mobility('walk'),
  size:size('human',null), lifespan:life('world_defined'), stages:stages('adult'),
  statTemplate:'stats.reedling.compat', skillCarryRules:'carry.default',
  extensions:{photosynthetic:true,breathesAir:false,intakePort:false}},
 {templateId:'body.tern.compat', form:'clay_vessel', lineage:null,
  functions:F('grip:2','press.clay'), slots:[], intake:meal('none'), rest:rest('none','none'),
  defeat:defeat('reserve.empty','inactive','Village','tern.compat'),
  presence:presence('material','Village','bench_contact'), mobility:mobility('root'),
  size:size('bench_vessel',null), lifespan:life('open'), stages:stages('constructed'),
  statTemplate:'stats.tern.reserve2', skillCarryRules:'carry.tern',
  extensions:{clayPressure:true,breathesAir:false,intakePort:false}},
 {templateId:'body.wolf.village', form:'wolf', lineage:'original.wolf',
  functions:F('see','hear','smell','signal.scent','move.walk','eat.meat','attack.bite',
    'wear.collar','wear.harness'), slots:S('collar','harness'), intake:meal('meat'),
  rest:rest('sleep','den_or_shelter'), defeat:defeat('health.zero','unconscious','shelter','village.safe'),
  presence:presence('material','body.location','local'), mobility:mobility('walk'),
  size:size('medium_quadruped',null), lifespan:life('world_defined'), stages:stages('cub','adult','elder'),
  statTemplate:'stats.wolf.village', skillCarryRules:'carry.quadruped'},
 {templateId:'body.ghost.original', form:'ghost', lineage:null,
  functions:F('see','hear','sense.mana','communicate.telepathy','move.phase','eat.mana'),
  slots:[], intake:meal('mana'), rest:rest('meditation','anchor'),
  defeat:defeat('integrity.zero','dispersed','anchor','ghost.reform'),
  presence:presence('incorporeal','anchor','bounded_haunt'), mobility:mobility('phase'),
  size:size('incorporeal',null), lifespan:life('open'), stages:stages('manifest'),
  statTemplate:'stats.ghost.integrity', skillCarryRules:'carry.mind'},
 {templateId:'body.sword.original', form:'sentient_sword', lineage:null,
  functions:F('sense.contact','communicate.telepathy','move.carried','wear.hilt_wrap','wear.sheath'),
  slots:S('hilt_wrap','sheath'), intake:meal('none'), rest:rest('none','none'),
  defeat:defeat('integrity.zero','broken','repair_site','sword.repair'),
  presence:presence('object','carrier.location','holder_contact'), mobility:mobility('carried'),
  size:size('weapon',null), lifespan:life('open'), stages:stages('forged'),
  statTemplate:'stats.sword.integrity', skillCarryRules:'carry.object'},
 {templateId:'body.core.original', form:'dungeon_core', lineage:null,
  functions:F('sense.mana','build.territory','eat.mana','move.root','wear.socket'),
  slots:S('socket'), intake:meal('mana'), rest:rest('recharge','core_anchor'),
  defeat:defeat('integrity.zero','dormant','core_anchor','core.recovery'),
  presence:presence('territory','core_anchor','owned_rooms'), mobility:mobility('root'),
  size:size('core_with_territory',null), lifespan:life('open'), stages:stages('seed','grown'),
  statTemplate:'stats.core.integrity_charge', skillCarryRules:'carry.territory'},
 {templateId:'body.brood.original', form:'brood', lineage:null, functions:F('coordinate.members'),
  slots:[], intake:meal('member_policies'), rest:rest('member_policies','member_locations'),
  defeat:defeat('member_policy','connection_loss','surviving_members','brood.selected'),
  presence:presence('collective','member_locations','actual_link_channels'),
  mobility:mobility('member_modes'), size:size('distributed',null), lifespan:life('member_policies'),
  stages:stages('membership'), statTemplate:null, skillCarryRules:'carry.brood',
  memberBodyIds:['brood.scout.body','brood.worker.body']},
 {templateId:'presence.ai_guide.original', form:'ai_guide', lineage:null,
  functions:F('influence.advice','communicate.telepathy'), slots:[], intake:meal('none'),
  rest:rest('none','none'), defeat:defeat('channel.lost','disconnected','host_channel','guide.reconnect'),
  presence:presence('virtual','host_channel','authorized_channel'), mobility:mobility('none'),
  size:size('virtual',null), lifespan:life('open'), stages:stages('connected'),
  statTemplate:null, skillCarryRules:'carry.mind', bodyId:null}
]
```

Brood row is an aggregate **view**, not a material body owning pooled member
health/gear. Each member resolves an ordinary body record. AI-guide row is a
presence template on a controller with zero bodies, not a fabricated Hero with
zero HP. A guide's host is a separate person with its own body/control decision.
Reedling's current two sap stay finite: declaring photosynthesis does not add a
new sap regeneration loop. Tern's two stamina and no ordinary native work remain
its compatibility policy; recharge is a future authored change, not a migration
bonus. Human and reedling literacy/spell entries name available channels; actual
knowledge/method/source requirements still decide execution. New reedling sense,
rest and slot semantics need explicit implementation acceptance before activation.

## 3. Query API and ordered touch list

**Default:** pure resolved-body queries. `resolveBody(state, actorId, context)`
returns a validated effective view with id/revision, actual functions, slot fit,
conditions and source provenance. It does not create a body, spend, enroll or save.
`can(body, fn, {amount:1, target, route})` returns boolean; `explainCan(...)`
returns `{allowed,reasons,provenance}`. No body means no bodily function; legacy
human defaults belong to migration, never query fallback.

| API | Meaning |
|---|---|
| `slotsFor(body)` / `fitFor(body,item,slot,context)` | Supported slot descriptions; fit, function, size and actual custody are independently checked. |
| `intakeOf(body)` / `restOf(body,site)` / `defeatOf(body,event)` | Return declared policy/plan. Applying it is a durable command, not query side effect. |
| `presenceOf(body)` / `reachOf(body,channel,target)` / `movementFor(body,route,carrier)` | Resolve supported reach/travel; carrier relationship and route are actual inputs. |
| `statsFor(body)` / `skillApplicability(body,person,skill)` / `carryFor(transition,domain)` | Physical projection, known method applicability and explicit retention. No grants from remembered XP alone. |
| `controlledBodies(state,controllerId)` / `actingBody(state,command)` | Stable ids and revisions; bodyless influence uses a presence, not fallback main_character. |
| `admissionFor(world,start,body,context)` | Form/material restrictions plus functional requirements, exceptions and known reasons. Some worlds genuinely admit only humans. |

Touch list below is ordered by blast radius, smallest first. Codes link directly
to section 1. “Switch” means replace the anatomy decision, **retain** actual
owner/control/life/location/knowledge/receipt guards. Later rows are not all
required for slice 1.

| Order | Exact consumers to switch | Query and scope |
|---|---|---|
| T1 | F1/B12 `main.js:535-538,1077`; B9 `exchange.js:7` | `resolveBody`, `can(grip,amount:2)`; stop race override and query-time human defaults. |
| T2 | F2/F3/B9 `backlog_expansion_body.js:181-190,242,268,368,454,470-476` | Grip/fine control, mobility, photosynthetic/clay/device fit via templates. Keep finite resources, consent, exact bodies and source flags. Slice 1 adapts compatibility reads, not new Tern verbs. |
| T3 | B9 `status_care_facts.js:27-28`; `original_frontier_field_content.js:125-126`; B8 `world_completion_lens_facts.js:31,95,98`; `foundation_interaction_content.js:58`; `foundation_interaction_policy.js:54-55` | Function-derived facts and `explainCan`; retain restricted experimental participants and world rules. Adopt each active consumer under its own tests; no universal removal of form contracts. |
| T4 | F8 `capabilities.js:40-69`; F9/B21 `simulation.js:47-59,579-583`; `main.js:1069,1343`; B13/B14 `simulation_effects.js:106-107,207-240`; `simulation_contracts.js:60,237-241`; B12 `structured_pack_state.js:49-50` | Produce resolved function facts from capability provenance; validate/init body and replacement; use acting-body vitals. Schema work is mandatory slice 1 despite its wider validator reach. |
| T5 | F5 `structured_pack_runtime.js:18-31,66-71`; F6 `realm_boundary_rules.js:100,113-117`; B8 `proto23_world_host.js:20-22,88-89`; `book_world_paradise_host.js:23,61`; `book_world_mol_state.js:11,33`; `book_world_paradise_campaign_facts.js:106-107`; `feature_expansion_book_host.js:37-42` | `admissionFor` plus queries, preserve world form lists and exact native body support. Separate start candidate eligibility from established body traversal. Active-world adoption only; paused worlds may remain explicit unsupported destinations. |
| T6 | B6/B5/B10 `main.js:2152-2164,2799-2844,3721-3735,2123-2127`; B5 `models/location.js:15-24`; B3 `models/game_action.js:18-83` | `movementFor`, `restOf`, `defeatOf`, stage/communication view and declared action requirements at preview/start/finish. Restore relocation uses validation, not walking permission. Greeting typo stays a small separate fix. |
| T7 | B4 `display.js:219-229`; `models/hero.js:288-310`; `models/person.js:496`; `items.js:128-136`; B17 `structured_equipment_runtime.js:54,76`; `native_equipment_transaction.js:12-35` | `slotsFor` and `fitFor` at display, direct equipment mutation and staged publication. Human DOM adapter can remain until beast slots are rendered; no hidden incompatible item bonuses. |
| T8 | B3/B7/B15 `models/stat_haver.js:6-74`; `models/person.js:82-89,116-117,316-350`; `models/combat.js:141-173,279-295,322-343,398,501`; `native_battle.js:16-19`; B14 `native_gameplay_adapter.js:43-58` | `statsFor`, `skillApplicability`, natural attack/shield functions, controlled fighter selection and acting-body reserve. Preserve existing multi-fighter combat structures. |
| T9 | B1/B11/B16 `data/character.js:7,21`; `heir_inheritance.js:38-44,81-93`; `life_experience_host.js:11-21`; `chronicle.js:80`; `native_gameplay_adapter.js:62-66`; F4 `realm_traveler_profiles.js:55-70,422-440` | Controller/body binding, life policy and declared carriers; body-scoped jobs. Full N-body control is later than beast slice. Traveler stays a snapshot adapter until real command bindings exist. |
| T10 | B18-B20 cited tests; all save touchpoints in section 5 | Preserve human regression assertions, add function-compatible nonhuman and no-body cases, validate complete envelope and failure atomicity. |

## 4. Controller versus bodies and NPC rules

**INFERRED default:** a runtime controller is an interaction binding, not a new
soul or possessing spirit. This supports identity owner's O1 within a life and O8
between lives without forcing that proposal as universal ontology. O3-O7 remain
world/origin options. U01 separates person/life/body/controller; U10 shares the
relevant rules with NPCs; X01 permits partial or mistaken recognition.

Proposed later durable shape: `embodimentControllers[id]` holds `personIds`,
`bodyIds`, `focusedBodyId|null`, `presenceIds`, mode and attention/channel policy.
Keep this separate from existing simulation work `controllers`. A body has a
stable owning person and zero or more explicitly authorized control leases;
exclusive default, shared/per-channel control as a world dial. Once N bodies
ships, bodies move to one `simulation.bodies[id]` registry and person records hold
body references. The earlier single-body `people.player.body` becomes a derived
compatibility projection, never a separately saved copy. This later migration
requires another version decision; E1 does not prematurely add two authorities.

Commands carry actorId, controllerId, bodyId/presenceId, expected body revision
and sequence. `hero_id` remains a compatibility native binding for the focused
single body initially. Eventually consumers resolve the controlled fighter(s)
rather than deciding player identity from `main_character` tags. XP recipients,
physical stamina, legal stock owner, knowledge recipient and combat credit are
explicit. Focus switching alone neither moves cargo nor restores stamina.

Tern generalization: create a control lease, keep original body parked at its
actual location, preserve each body's reserve, suspend or share host executive
control under its authored contract, then durably release the same lease on
return. No transfer of Tern goods, private focus, learned methods or identity by
being the current player. Current guards against jobs/offline escrow, installed
lung and unsettled custody remain until an actual carrier policy replaces them.
Recovery if the parked body is inaccessible is a declared route, not teleportation.

Brood members keep individual equipment, knowledge, reserve and commitments.
Assignments reserve member time and consume real inputs. Disconnection may leave
an autonomous assignment, end direct control or do another declared world result.
AI guide has N=0 and influence through an actual recipient channel; advice does
not guarantee obedience in an independent-host mode. X06 gives caregivers their
own effort/supplies; no free care because a body is dependent. Distant actors use
summaries with relevant obligations, not full per-member ticks everywhere.

NPCs use the **same** `can`, fit, reach, intake, rest, defeat, maturation and
carrier validation where those functions matter. Detail level and control source
can differ. A wolf NPC cannot craft with nonexistent fine manipulation while a
player wolf is denied it; a borrowed NPC body cannot keep functioning in two
places. Recognition uses visible form/behavior and observed evidence, not private
controller ids or omniscient detection. Background former people remain ordinary
NPCs under the recorded user lean; persistence/branch choices do not make them
all controllable bodies of the same controller.

## 5. Save compatibility and every body-relevant save touchpoint

**INFERRED version decision:** bump emitted `fork_schema` from 1 to **3** (reader
currently admits 1/2), add validated `body.schema=1` and pinned template revision.
This explicitly separates the new contract from already-admitted fork 2 rather
than silently repurposing it. Update game version with the implementation release
so older clients reject newer saves. Existing expansion schema numbers 5 onward
represent other optional owners; do not blanket-reset them to 5 or relabel a world
record. Add body validation to every admitted expansion/simulation variant.
The body-only bootstrap requires a structural simulation version change: current
versions 1-6 reject null enrolledAt. Propose simulation schema 7 with an explicit
`servicesEnrolled` flag and nullable enrolledAt only in body-only mode. Existing
schemas migrate as enrolled without changing their anchor. Update enrollment to
upgrade the existing body-only record, retaining its body, rather than replacing
it; joined-clock decisions consult the declared mode. Allocate the final version
from live constants at implementation time if another lane has advanced them. N-body registry conversion needs a later
explicit bump, not covert extension of this single-body migration.

Migration runs on a **cloned complete envelope before dependent validators or
native publication**. Current `prepareV06Save` is called after validation in the
native loader; add a shared `prepareBodySave` at the import/envelope boundary,
not just inside `load`. It must be deterministic and idempotent, retain unrelated,
retired and dormant content and leave storage untouched on failure.

| Incoming case | Proposed migration |
|---|---|
| Old native save with no physical body | Install human compatibility form, retain race as lineage/appearance and bio age as legacy stage. Preserve actual numerical stats/gear/XP and any opted-in chronicle mortality. Do not enroll rewards/world services to obtain a body; create only required structural records with no enrollment cause. Use the schema 7 body-only mode above; adjust enrollment guard and joined-clock detection. Prove this cannot unlock NPCs, advance the joined clock or block later deliberate enrollment. |
| Existing partial body such as palms-only training flags | Fill missing base human template only when the old native binding proves the legacy scaffold; preserve all earned flags and conditions. Explicit nonhuman form outranks race. Unknown explicit form is retained as unsupported, never flattened into human. |
| Reedling origin | Preserve body id, origin claim, two-sap remaining balance, source, woven count and receipt sequence. Migrate its **physical reedling** record, even though bio race/nativeScaffold is human. If Tern is active, reedling is in `possession.homeBody`; do not change current clay body to reedling. |
| Tern introduced/offered/active/returned | Normalize host/current/parked bodies by actual id. Active host has no body/vitals because the same records are with player. Preserve owner/control, host incapacitation, consent, parked location, homeVitals, depleted clay stamina and private resources. Never synthesize a second clay body from the host definition. Preserve stricter compatibility validators until lease migration. |
| Realm-traveler snapshot | F4 is detached; no runtime save namespace is established by it. Normalize functions on an explicit future import adapter, preserve body refs/pools/cargo/endpoints, source maxBodies and condition owners. Do not auto-enroll its sample cases or claim it is already part of the save. Existing realm state/envelope continues its own bindings. |
| Typed structured beginning | Preserve exact start/instance/life/body ids and pinned content hashes. Body form becomes independent of bio race; compare saved template/form to the selected physical definition and lifetime reference. Do not mutate pinned pack content/hash in place; old revisions retain a supported adapter or remain suspended with export available. |

Save touchpoints below are the full body-relevant path inventory from this sweep,
not a claim that every unrelated optional save feature was audited. Names in rows
are required review/touch sites; unchanged codecs/probes can remain if their gate
continues to pass.

| Code | SHOWN touchpoint | Proposed obligation |
|---|---|---|
| S1 | `src/main.js:4935,5183-5197` create_save and native world snapshots | Emit fork 3 and validated authoritative body; retain character/levels/inventories compatibility projections without making them body owners. Save/export during Tern keeps parked native Hero and controlled clay distinct. |
| S2 | `src/main.js:806,921`; `src/expansion_persistence.js:7-50` persistExpansion/plan | Validate combined body/gameplay/equipment envelope before storage, then publish. Failed write must leave live body/control/items/vitals unchanged. |
| S3 | `src/save_migration.js:3-26`; `src/save_compatibility.js:9,56`; `src/main.js:5289-5308` | Shared idempotent migration before body-dependent validation, followed by retired-content retention and current expansion initialization. |
| S4 | `src/expansion_engine.js:136-147,258-270`; `src/simulation_contracts.js:60,229-241` | Validate every admitted variant, nested body data and bounded ids/references/policies. Validate patches/replacements separately from scalar body effects. |
| S5 | `src/save_files.js:40-83,104-142,158-191,196-217` | Envelope fork admission/version check, singleton XP/inventory compatibility, body-reference validation, UTF-8 encode/decode/import and guarded quota writes. Migrate before early `validateStructuredEnvelope`, not after it. |
| S6 | `src/main.js:5228,5255-5274,7056-7107,7634-7648` | Export, manual save, normal load, file import, backup/other-release restore and autosave/backup use the same migrated validation contract. Export-only suspended saves remain preservable. |
| S7 | `src/import_probe.js:2-33,36-59`; `src/main.js:8480-8481` | Real-loader isolated preflight must reconstruct body and dependent UI without warnings, run no gameplay/save, and reject incompatible data before overwrite. |
| S8 | `src/main.js:5371-5373,5637-5713,6023,6941-6943`; `src/native_equipment_transaction.js:12-35`; `src/gameplay_publication.js:3,15` | Restore bio independently; validate slot fit and exact equipped item custody, then derive stats. Future focused-body adapter resolves target native owner; no equip bypass on load. |
| S9 | `src/backlog_expansion_body.js:520-575`; `src/backlog_expansion_host.js:126-147` | Optional proof validation and full envelope parked-native checks retain Tern/reedling invariants. Nested additions must not invalidate old scalar fields or invent new rewards. |
| S10 | `src/structured_pack_state.js:17-27,40-50`; `src/structured_pack_runtime.js:18,66`; `src/realm_state.js:18,38` | Typed selection/lifetime/content binding and realm envelope validate actual form/template independently of race; preserve snapshot and owner identities. |
| S11 | `src/save_files.js:73-83`; `src/main.js:5191-5196` | All invoked envelope validators and native snapshot adapters need review for body authority: realm, Tidemark, nested, Paradise, MoL, Proto23, retort, causal story, backlog and world-completion. Keep their exact authored support restrictions while ensuring new generic schema does not overwrite bodies. |
| S12 | `src/heir_inheritance.js:38-44,81-93`; `src/life_experience_host.js:11-21`; `src/chronicle.js:80,284` | New-life envelope retains selected fresh body when expansion is recreated; goods pass once under declared carrier policy, old bodily training and controller leases do not become heir property by default. |

Export/import gate: generated old human (including cosmetic nonhuman race),
partial-trained body, reedling, Tern offered/active/depleted/returned and typed
origin saves migrate twice identically; save/reload/export/literal-file import
retain exact body ids, controller/owner, funds, stock, XP, claims and reserves.
Reject dangling body/carrier/template refs, malformed nested capacities, illicit
control, wrong stage/content revision and future schema **without storage or live
state mutation**. Unknown form preserves file/export and gives a supported-body
message; it does not silently equip human gear. Test quota failure and failed
preflight. No actual private user save is needed or authorized for these fixtures.

## 6. Phased implementation plan

INFERRED sizing: S = roughly half an engineer day, M = 1-2 days, L = 3-5 days,
including focused tests but excluding director taste acceptance. These are scope
estimates, not elapsed-time promises. Implement one step then inspect the real
diff; split L work if evidence finds a wider coupling. No implementation is
assigned by this research lane.

### Slice 1: E1 + E2 + E14, one authoritative body without new start kinds

Target 1366×768 desktop browser. Visible outcome: existing human, reedling and
Tern records show the same physical identity across native/structured panels;
ordinary travel cannot use an immobile body; saved state restores consistently.
New wolf content, N-body scheduling, mobile layout, universal world adoption,
new metabolism/defeat/lifespan gameplay and unrelated greeting polish are deferred.

| Step | Size | Concrete work and tests to add |
|---|---|---|
| P1 | M | Define versioned human/reedling/Tern compatibility templates, instance validator and pure resolve/can/explain APIs. Preserve scalar extension fields. Tests: no mutation/random draw, missing function denied, count vs fine manipulation, stage/injury/source suppression, unknown template, human defaults only through migration. Test proposed nested schema against typed-start/scalar-effect boundaries. |
| P2 | L | Add fork 3 envelope migration before every validator. Add schema 7 body-only initialization, preserve native clock behavior, and allow later deliberate service enrollment without replacing the body; retain partial training and special forms. Update structured race equality and content revision adapters. Tests: old race variants → human form + preserved appearance; idempotence; old unenrolled remains functionally unenrolled; reedling/homeBody/Tern variants; retired/dormant preservation; malformed/future refs rejected. |
| P3 | M | Switch T1/T2 reads, function-derived facts and generic native movement gate. Preserve Tern's stricter native-action hold and allow explicit validated restore/realm relocation. Keep world admission restrictions outside selected active consumers. Tests: reedling form survives context, stationary non-Tern travel denied, Tern denied, human unchanged, save/export/return available, no new sap/reserve generation. Add dedicated backlog body and possession tests missing from current tree. |
| P4 | L | Integrate serialization, publication and real-loader restoration from S1-S12. Do not move all stats/gear/XP to new owners yet; bind compatibility projection explicitly to the parked native body during Tern. Tests: each migration fixture roundtrip through full envelope; failed write/preflight preserves body/vitals/stock; active Tern spent stamina exact after return; new-life builder retains selected body; typed origin hashes/lifetime unchanged. Run focused affected existing suites, then required broader repo checks once. |
| P5 | M | Rebuild (`npm run build` from `package.json:7`), serve own disposable fresh origin and verify current served bundle identity. Native UI journey selects fresh reedling, uses its finite rope route; separate generated journey meets/asks/enters Tern, spends one actual clay stamina, tries blocked travel, saves, reloads, exports, literal-file imports through real file input, returns. Compare ids/control/reserves/items and original body's native stats. Include legacy-human migration journey. Capture desktop evidence and remaining gates; never use existing user origin/save. |

Slice 1 deterministic completion: focused schema/query/migration/transition
checks pass, unchanged human regression slice passes, actual rebuilt desktop
journeys and full persistence comparisons pass. A body record plus passing unit
tests is not playable completion. Failed browser/import gates stay
implemented-unverified in its acceptance backlog. Read-only design completion
here does not claim any of these future gates passed.

### Slice 2: first playable beast start, original wolf in Village

Default proposal: one adult wolf with local senses, natural bite, den/shelter,
meaningful scent/foraging work and collar/harness gear. Dial: language, magical
senses, legal recognition and special body changes by selected world/premise.
Reasonably: communication through signaling or an earned channel, tools/services
through actual people, human transformation later if selected. No universal
stat nerf, compulsory hostility or free psychic speech.

| Step | Size | Concrete work and tests to add |
|---|---|---|
| P6 | M | Freeze Village wolf start body/history/means/support/first verbs and admitted selection record. Show CR4 physical effects alongside cosmetic fields. Add viable opening/idle route with supported inputs, cancel/stop behavior and a small payoff human actions do not offer (scent trail locating a recoverable cache). Tests: deterministic selection/reload, no duplicate cache, no inherited human gear or source, fresh viable action and off-screen policy unchanged. |
| P7 | L | E3/E4: requirements on Village actions, crafting, trading, reading and equipment paths, including transaction recheck. Implement bite-independent foraging/scent queue, collar/harness slot display and a real acquisition route using local exchange/help. Tests: no sword/shield/fine craft without acquired means, no hidden human stat bonuses, legitimate alternative yields exact stock/cost, interruption on lost function, stale action/loan rejected. |
| P8 | L | E10/E11 plus bounded E6/E9 compatibility: natural bite fighter profile and wolf-appropriate skill application; observe/signal interactions and body-aware defeat/rest. Keep character knowledge and motor applicability separate. Tests: natural attacks, no shield block/fists, NPC wolf same rules, no omniscient recognition, recovery preserves declared losses, food helps and cannot kill by hunger, queues cannot farm duplicated rewards. Lifespan mechanics and full controller XP conversion stay deferred. |
| P9 | M | Rebuild on a fresh 1366×768 origin. Start wolf, complete scent/idle route and useful exchange, obtain/equip collar or harness, verify rejected human action, fight one native encounter by bite, recover via actual wolf policy. Save/reload/export/literal-file import at opening, active queue and post-combat. Recheck human/reedling/Tern regression journeys only where affected. Record playable route, exact comparison evidence and unaccepted balance/taste. |

A wolf that merely hides most human buttons is not a finished beast start. The
slice needs an enjoyable supported idle loop, an anatomy-specific action payoff,
one social route, usable gear and combat/recovery, all preserved after import.
This is a bounded original Village prototype, not a new priority above canon
world work. Later core/brood/AI slices depend on reach/leases/attention scheduling,
not on adding all their example templates as playable starts immediately.

## 7. Risks and open questions

All items INFERRED; ten total. Questions name design decisions for the future
implementation owner, not requests that Weibao repeat existing direction.

| Code | Risk or open decision | Default + dial + resolution |
|---|---|---|
| R1 | Migration accidentally enrolls services or rewards | Default structural body only; preserve enrolledAt/claims. Dial explicit enrollment later. Resolve with old-unenrolled eligibility regression and full native load. |
| R2 | Two body authorities diverge during possession | Default one persistent body record per id; legacy native projection explicitly parked. Dial multi-body registry later. Resolve active/depleted Tern roundtrip and failed-publication tests. |
| R3 | Function grants become a universal bypass | Default separate anatomy, mastery, source, custody, channel and world admission. Dial authored exceptions. Resolve equivalent player/NPC scenarios and retained form exclusions. |
| R4 | Template/pack revision changes invalidate retained starts | Default pin revision/hash, keep compatibility adapter. Dial explicit migration with carriers. Resolve old/new typed origin fixtures and suspended export behavior. |
| R5 | Brood duplicate work and simulation cost | Default per-member reserve/commitment and summarized distant members. Dial source-specific parallel attention capacity. Resolve no double-reservation/resource-spend checks before enabling N bodies. |
| R6 | Empty action set or disguised human wolf | Default guarantee one useful loop and anatomy-specific payoff per offered start. Dial deliberate terminal starts only when advertised. Resolve real opening route and idle cancellation/persistence. |
| Q1 | Which legacy flags imply grip/fine control? | Default versioned known human/reedling/Tern adapter, preserve unknown fields inert. Dial acquired compatible anatomy. Resolve explicit mapping table before P1 acceptance; no inference from cosmetic race alone. |
| Q2 | How much wolf motor XP transfers across later bodies? | Default keep legacy XP without applying incompatible bonuses; new knowledge/motor records distinguish ownership. Dial per-skill transfer ratios or learned remapping. Resolve E9 when a body-changing playable route is selected. |
| Q3 | What are precise wolf rest/defeat and recognition terms? | Default safe Village shelter recovery and observable signaling, no forced speech or universal hostility. Dial harsher or magical premise. Resolve authored P6 contract and P8/browser outcomes, not blanket engine penalties. |
| Q4 | Are functions serialized as full map or overrides? | Default pinned template + instance overrides, derived effective view never saved as second truth. Dial retained template snapshot for archival compatibility. Resolve save-size/content-retention tradeoff before P2, with no remote lookup needed to import. |

Completion of this lane: 9 F seams, 21 B entries (11 inherited + 10 added),
9 illustrative records, 10 touch groups, 12 save touchpoints and 9 sized plan steps.
Missing current-tree possession/reedling/traveler tests are documented. Native
behavior, migration, performance and director acceptance remain UNKNOWN here;
this deliverable is a source-grounded proposal ready for coordinator review.
