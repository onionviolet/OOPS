# Nonhuman start specs, 2026-10-14

START SPECS lane. **INFERRED proposals for implementation review, not accepted decisions, executable packs, implemented starts or browser proof.** Only this file and the [lane checkpoint](../gm/dispatch/nonhuman-starts-2026-10-14/startspecs/CHECKPOINT.md) are owned here. The dirty shared tree is preserved. No source library, runtime, tests, build, user save, commit or publication was changed.

Authority: [COMMON](../gm/dispatch/nonhuman-starts-2026-10-14/COMMON.md), [requirements](NONHUMAN_STARTS_ENGINE_REQUIREMENTS_2026-10-14.md), all live rounds 1-10 (rounds 9-10 arrived during review), [PROJECT](../../PROJECT.md#standing-priorities-and-document-authority), and [user vision](../USER_VISION.md#standing-ui-priority-2026-10-13). Desktop/laptop first, **1366x768 CSS viewport**, mobile optimization deferred; useful meals, comfortable unfed play, no hunger death; one realm and one prestige layer. These three records are alternatives in the existing shortlist, not authority to implement three worlds together. Finish the selected playable slice before the next.

## SS0: owners, evidence and shared start contract

SS-A, SS-B and SS-C are this document's stable start codes. Beat codes A01-A10, B01-B10 and C01-C10 are scoped here. SS-I/SS-V codes identify future implementer/browser gates. Codes in other owners retain their original meaning.

| Owner | Codes consumed, without restating their specification |
|---|---|
| [Engine spec](NONHUMAN_STARTS_ENGINE_SPEC_2026-10-14.md) | Section 2 body schema; B12-B21, T1-T10, S1-S12, Slice 1 P1-P5; SS-A implements the proposed Slice 2 P6-P9 boundary. |
| [Intro/start records](../INTRO_FLOW_CONSIDERATIONS_2026-10-13.md) | WC1-WC12, SR1-SR10, LY1-LY12, LK2/LK4/LK6/LK7/LK8/LK10. |
| [Play](NONHUMAN_STARTS_PLAY_2026-10-14.md), [society](NONHUMAN_SOCIETY_LAW_AND_ECONOMY_2026-10-14.md), [bonds](NONHUMAN_BONDS_AND_PARTIES_2026-10-14.md) | BK1/NS1, NP1-NP14, Society S1/SL1-SL16; BDS1, BKD2/BKD8/BKD9, BS1-BS8 and BD17/BD18. Bonds BS1 is distinct from Paradise BS1. |
| [Progression](NONHUMAN_PROGRESSION_AND_BALANCE_2026-10-14.md), [monster side](NONHUMAN_MONSTER_SIDE_2026-10-14.md) | PSG1, PG1/PG4/PG7/PG10/PG13; MSS1/MB1/MF5 where compatible. |
| [By world](NONHUMAN_STARTS_BY_WORLD_2026-10-14.md), [protagonist mechanics](NONHUMAN_PROTAGONIST_MECHANICS_2026-10-14.md) | W01, S1/HP-P1; NC8/NX4/NX8; NM4/NM6/NM9 separate naming, partnership and delegated analysis. No slime/Predator implementation is added. |
| [Transformation](NONHUMAN_TRANSFORMATION_AND_BODY_CHANGE_2026-10-14.md), [senses/UI](NONHUMAN_SENSES_SCALE_AND_UI_2026-10-14.md) | TX4/TX6/TX8/TX10/TX13; SU1-SU10, SU15-SU17 and SS1-SS5. No transformation is needed to succeed. |
| [Body authoring](NONHUMAN_BODY_AUTHORING_2026-10-14.md), [clocks](NONHUMAN_CLOCKS_LIFESPANS_AND_SEASONS_2026-10-14.md) | BA-E1, BA-L1-BA-L17, BA-F5 and template/instance separation; CK1-CK18, eligible played exposure, distinct biological/contract clocks, no implicit offline aging. These arrived during this lane. |
| [Kin](NONHUMAN_KIN_AND_RELATIONSHIPS_2026-10-14.md), [micro](NONHUMAN_SUBTLE_MICRO_DETAILS_2026-10-14.md), [majority worlds](NONHUMAN_MAJORITY_WORLDS_2026-10-14.md) | NK-E1/NK-E5/NK-E7, NK-R3 and NK-V1; MD-BK1.1-MD-BK1.6, MD-L1/MD-E6, T/R and MD-N1-MD-N10; MJ4/MJ5/MJ8/MJ11/MJ18. Later arrivals are reconciled below without adding a kin registry or majority world. |
| Paradise [canon plan](paradise-hub/CANON_PRIORITY_PLAN_2026-10-14.md), [beings](paradise-hub/BEINGS_PETS_AND_BODIES_2026-10-14.md), [missions](paradise-hub/DERIVED_WORLDS_AND_MISSIONS_2026-10-14.md), [hub life](paradise-hub/HUB_LIFE_ECONOMY_AND_PEOPLE_2026-10-14.md) | SRP9 seat comparison, BS1/PB1-PB5, BC5/BC7/BC8/BC11, DM8/DM11 and S4 mission-body lease; hub S1/S2/S4. SS-C defaults to BS1's bird, not SRP9's dog near Su Xiao. |

**Labels:** SHOWN(source) means a code definition read here, not gameplay. SHOWN(text) means a scene read in the supplied HP text. SHOWN(dossier) means an inspected private Paradise reader report, with its member/paragraph locator; this lane did not reread its raw chapter. STATED names a speaker. INFERRED means deduction or authored proposal. UNKNOWN identifies unresolved evidence. No MEMORY lore is used. Every proposed dialogue, number, schedule, person and start below is INFERRED unless a source row explicitly labels it otherwise. Source labels and CF/AU status never imply implementation acceptance.

**Shared resolved record, proposal revision 1.** Resolve world → source/era → place → family/bond → role → body → background → advantage (SR1, LY1). Each SS record below pins the result. Family and advantage default to no additional layer (LY6); linked NPCs are independent actors. Reject conflicting identity/title/location/control assignments; sum only explicitly additive counted stock; never merge two body instances or memories by last-wins (LY2/LY3). Preview and commit recheck WC9 and actual first means; no viable first action means no offered start, rather than rerolling after payment (LY9).

Save a single `resolvedStart` receipt containing start id/revision, source snapshot/revision, continuity/era/anchor, world instance, selected layer ids/revisions, seed, content/snapshot hashes, person/life/body instance ids, control seat, knowledge mode/basis, actual initial stock/title/custody, obligations, and reveal state. `runId` below means the durably allocated origin instance id; `lifeId=runId+'.life'` and `bodyInstanceId=runId+'.body'`. Freeze once before publishing. Unknown axes resolve once but stay absent from observer views until learned (LY5/LY8). No placeholder hash is a real content binding; compute hashes from the final compiled definitions.

WC10 defaults to **random-pool weight 0 while unsupported**; explicit prototype selection can be offered only after SS-I gates pass. Proposed qualified weight is 1 within a chosen world/body filter, not a global rarity decision. WC11 defaults to explicit creative selection, with prior-world-contact unlock as a reachable dial. No global unlock wall is added. SR8 notes stay author-only. WC12 gives a plain truthful frame until local evidence reveals the world's name; debug IDs, layer labels and canon locators are not player text.

First-hour scripts target **60 eligible game minutes**, with approximate beat windows. They are not a one-hour wall-clock promise, countdown, or compulsory itinerary. Inspection/choices take zero simulation time; timed work consumes the stated common minutes through the existing scheduler. An overlong fight, refusal, pause or interruption shifts later beats. Each opening remains viable past minute 60. Idle means played-time queued work; browser-closed time defaults to frozen, with no catch-up reward, aging, starvation or companion loss. Broader offline, family, seasons, multi-seat switching and body-change work is deferred.

### SS0-E: integration seams that must be addressed

| Code | SHOWN(source), read in this lane | Required interpretation for these records, INFERRED |
|---|---|---|
| SS0-E1 | `src/structured_pack_runtime.js:14-19` admits only six start keys and scalar body fields. | The full records and nested templates below are authoring inputs. Add an explicit schema/adapter, not unsupported keys or arrays in a scalar body effect. |
| SS0-E2 | `src/structured_pack_runtime.js:28-44` compares every start form with current form, requires a base.frontier opening, then freezes a random selection. | New-life body choice needs selected-start admission and atomic body initialization. Do not claim a hound/elf/bird can be installed by today's selection function. Preserve existing admission contracts for old packs. |
| SS0-E3 | `src/structured_pack_definitions.js:41-53,70-90` requires pack-owned world/location/person/command definitions; `src/structured_pack_runtime.js:68-72` rejects duplicate provisioned actors. | SS-A reuses native Village through a native-origin adapter. SS-B needs a new HP pack. SS-C needs an isolated source-adjacent snapshot adapter. Do not clone Village or publish duplicate native NPCs merely to satisfy pack ownership. |
| SS0-E4 | `src/structured_pack_runtime.js:89-100` filters people/status by held knowledge and previews actual commands. | Reuse these observer/quote principles; no private NPC reserves, unrevealed identity, future event or unopened contract becomes a panel fact. |
| SS0-E5 | `src/book_world_paradise_host.js:23-30` requires the controlled human native body and owned cargo. | SS-C needs a new qualified body/start adapter with actual carrier validation. Retain existing human-Goa behavior and do not delete checks globally. |

All require ENGINE_SPEC Slice 1 and E15 selected admission first. Engine fork 3/simulation 7 are that owner's **proposed** version allocations, not current constants. Allocate from the live schema owners when implementing. Apply migration at the complete-envelope boundary; no production save is needed for fixtures. Preserve old worlds dormant, identities and earned stock. Unknown template/content revision suspends affected actions with export available. Save failure, invalid import and failed compilation leave live state/storage untouched.

### SS0-S: complete numeric and desktop projection defaults

**INFERRED stat adapter decision**, grounded in SHOWN(source) `src/models/stat_haver.js:6-44`: create a complete profile with every current native key, not inherited constructor truthy defaults. For each profile below set current pool equal to its declared maximum only at creation; subsequent load/publication uses actual saved current values, including zero. All health/stamina/mana regeneration and health-loss flat/percent fields and all tolerance/armor-penetration/block/evasion-point/attack-point fields default0. Set `stamina_efficiency=1`, `mana_efficiency=1`, `max_mana=mana=magic=0`, `crit_rate=0.05`, `crit_multiplier=1.3`, `unarmed_power=0`. SS-A adds strength12, attack_power12, attack_speed1, attack_count1 to BA-E1 and uses the natural Bite consumer, not native fists. SS-B/C have attack_power0/attack_speed1/attack_count0 and no combat method; their strength is12/4 respectively. Remaining agility/dexterity/intuition/defense and health/stamina maxima are the explicit per-start profiles. SS-C health/max_health mirror the current/max core integrity as a compatibility projection only. Body-method eligibility decides all skill/equipment bonuses, without turning on race/height bonuses. No absent numeric stat or native default creates a spell/fist/attack. Fix zero-value construction/publication rather than storing misleading nonzero substitutes.

**INFERRED layout budget, not measured fit:** use16px outer margins and12px column gaps in the1366x768 fresh Workspace view:280px Body column,650px place/actions column,380px partner/work column. Header48px; top content440px; lower belongings/log reading region224px, with12px vertical gaps. These sum to1334x736 inside the margins. Keep4-6 short routine actions in the center and Stop/Pause/Save available. Longer terms/prose scroll within their reading region. Reuse panel identities/player layouts; this proposed fresh layout does not reset a stored arrangement. SS-V8 must measure populated labels/menus/zoom in a rebuilt browser, since dimensions alone do not prove usable fit.

**Late-owner reconciliation, INFERRED:** A's guard is a scoped caretaker/contact, not an automatically adopted parent (NK-E1/E5, NK-R3); no relatives are invented to satisfy NK-V1. B's former household is freedom history, not elf parentage. C's maker/partner can become chosen kin only through a later actual recognized tie; manufacture/repair alone does not establish ancestry or soul identity (NK-E7). Apply MJ4/MJ8/MJ18 to A09 and all worker permissions: species is not faction/citizenship and each claim settles once. Micro T captions read actual state and cause no benefit; R events such as learned signal, trace discrimination, fitted gear, payment or turning the perch need their actual command/settlement reader (MD-L1/MD-E6). Incidental weather/fit text cannot manufacture a condition or damage. Round9 CV1-CV12 remain separate earned advantages; the ordinary UI displays supported self-observations/received offers, never private soul/kin/trust appraisal. IM1 schedules foundation work with its live owner; this lane grants no competing write reservation. Round10 NA1-NA8 reuse owners and require real consumers, without expanding the three-start scope.

## SS-A: original Village hound

**Default:** adult hound, sapient native mind, direct player control, scent/retrieval/signals, independent quiet life. **Dial:** ordinary canine cognition, explicit human-memory incarnation, wolf anatomy, sourced speech or eventual transformation. **Reasonably:** each has coherent faculties and knowledge; default sapience is original YAIRPG fiction, not a biological claim or free Literacy. Join Engine Slice 2, BK1/NS1, Society S1, BDS1 and PSG1. MSS1 appears only as the optional bounded neighbor encounter A09.

### A-R: full resolved start fields

| Field / intro code | Proposed value |
|---|---|
| Id / source / era, WC1/WC4/WC5 | `village.bodies.hound.start`, revision 1; original YAIRPG Village opening; anchor is the fresh native calendar, no fabricated franchise date. `continuity=original.village.hound.r1`, one base.frontier instance. |
| Place / role, WC1/WC3 | `Village`, safe workshop-side resting patch (new subsite, not a separate location). Entry `woke`; known local hound available for a voluntary grain-token retrieval. Native hound history is authored, with no erased former occupant. |
| Body / seat, WC2 | `village.bodies.hound` revision 1, adult; instance id `runId+'.body'`, `personId=player`, `lifeId=runId+'.life'`, owner/controller `player`, current endpoint `Village`. One body and one command seat. Native NPC identity bridges retain actual NPC ids. |
| Mind / knowledge, WC1/WC8 | Native sapient canine; understands the taught local yes/no and follow gestures, remembers workshop/guard scents. No future/source knowledge. Default Literacy XP 0, Running motor XP 0, no assumed human source/gear. Human-memory dial explicitly lists retained knowledge; PSG1 fixture supplies 120 retained Literacy XP once, with provenance, rather than default free knowledge. |
| Needs / defeat | Compatible meal benefits and own stamina recovery; no food timer/death. Sleep at the starting resting patch. Health 0 means incapacitated, rest/care at that patch; first field trial has an agreed guard rescue if present, otherwise recovery at the actual field-margin endpoint until a supported return becomes possible; the first trial admits only this safe margin under its disclosed recovery contract. No generic bed teleport, stock/XP loss or compulsory human body. |
| Slots / first verbs, WC9 | Collar and harness; initial slots empty. `Sniff token`, `Compare traces`, `Follow known trace`, `Carry light token`, `Signal wait/yes/no`, `Rest`, `Practice circuit`; optional natural Bite after field access. Mouth retrieval uses the explicit reviewed `carry.mouth` extension, at most100g with usable unoccupied jaws, not fine grip or wield. |
| Witnesses / relations | `villageGuard` receives signals, `oldCraftsman` owns the token/order and performs fitting, `villageElder` can grant this start's field trial, `villageTrader` remains initially uninformed. Guard's caretaker offer is a new bounded relationship/availability bridge, not Tessa's native patrol kit or control of Rill. Regard, legal recognition, goods title and body control are separate. |
| Initial means / support | Craftsman owns 1 new token and 6 native coins reserved for this one order, plus 1 new fitted collar for sale at 4 coins. Player owns 1 existing `Stale bread` explicitly supplied by this original start and 0 coins. Guard offers two one-minute help intervals and one optional trial escort, each with its own time reservation. No free repeat care. |
| Idle / WC6/WC7 | Calm/social/active; local hound introduction card, no human school form. Safe solo circuit alternates 2-minute scent practice and 3-minute gait practice, 1 own stamina per segment, finite queue capped at 3 cycles; rest available without a partner. New trail, injury, occupied mouth, support loss or inadequate stamina pauses before spending the next segment. |
| Save / links | Freeze body/template, token custody, stock, payment/fitting receipts, witnesses' separate knowledge, guard offers/expiry, route cursor, body practice and retained knowledge. LK4 guard/hound pair, LK7 Village, optional LK2 later human meets this hound; LK6 earned body route is deferred. No new controllable seat, offspring or inheritance grant. |
| Frame / standing / author note | WC12 `Village` and `Hound` are locally known; player chooses name/pronouns. Collar label conveys its witnessed affiliation, not ownership or soul truth. WC8 heightened scent is anatomy; acquired universal speech is an extra sourced advantage. SR8: prove useful direct verbs, delegated hands and a lasting local mark. |

### A-B: engine-schema body template

Full field set follows ENGINE_SPEC section 2 and late BA-E1. This compact JSON-shaped notation is **INFERRED declarative authoring**, not a currently accepted runtime payload. Template tokens resolve against the instance above; missing functions remain unavailable.

```json
{
  "schema": 1, "templateId": "village.bodies.hound", "templateRevision": 1,
  "form": "hound", "lineage": null,
  "functions": {
    "see": {"capacity": 1, "channel": "visible"},
    "hear": {"capacity": 1, "channel": "sound"},
    "smell": {"capacity": 1, "channel": "scent"},
    "sense.contact": {"capacity": 1, "channel": "touch"},
    "read": {"capacity": 1, "channel": "visible_text", "constraints": {"textWithinSightAndPositioned": true}},
    "signal.scent": {"capacity": 1, "channel": "scent_mark"},
    "sign": {"capacity": 1, "channel": "posture"},
    "move.walk": {"capacity": 1, "channel": "quadruped"},
    "carry.mouth": {"capacity": 1, "channel": "jaw", "constraints": {"jawUsable": true, "mouthUnoccupied": true, "loadAtMost100g": true}},
    "move.carried": {"capacity": 1, "channel": "actual_carrier"},
    "eat.food": {"capacity": 1, "channel": "mouth"},
    "attack.bite": {"capacity": 1, "channel": "jaw", "constraints": {"jawUsable": true}},
    "wear.collar": {"capacity": 1, "channel": "neck"},
    "wear.harness": {"capacity": 1, "channel": "torso"}
  },
  "slots": [
    {"id": "collar", "count": 1, "requires": ["wear.collar"], "fitTags": ["canine_neck"], "maxSize": "medium", "custodyPolicy": "existing_item_title_and_holder"},
    {"id": "harness", "count": 1, "requires": ["wear.harness"], "fitTags": ["quadruped_torso"], "maxSize": "medium", "custodyPolicy": "existing_item_title_and_holder"}
  ],
  "intake": {"modes": ["food"], "mealBenefitsPolicy": "compatible_meal_adds_recovery_bonus", "upkeepPolicy": "no_passive_food_debit", "shortagePolicy": "unfed_viable_no_hunger_death"},
  "rest": {"mode": "sleep", "supportedAt": ["village.hound.rest_patch"], "recoveryPolicy": "own_played_rest_and_optional_meal_bonus"},
  "defeat": {"trigger": "health.zero", "outcome": "incapacitated", "recoveryAnchor": "village.hound.safe_refuge", "lossPolicy": "retain_identity_stock_knowledge", "continuationPolicy": "same_body_supported_recovery"},
  "presence": {"kind": "material", "endpointRef": "body.location", "anchorRef": null, "reach": {"sense": "same_place_supported_channel", "effect": "contact", "message": "local_signal"}, "carrierBodyId": null, "memberBodyIds": []},
  "mobility": {"modes": ["walk", "carried"], "routeConstraints": ["actual_access", "body_fit", "carrier_route_if_carried"], "carrierPolicy": "actual_carrier_capacity_custody_and_permission"},
  "size": {"class": "medium", "dimensions": null, "mass": null, "scalePolicy": "class_fit_until_authored_dimensions"},
  "lifespan": {"mode": "world_defined", "duration": null, "clockPolicy": "played_exposure_no_implicit_offline_age"},
  "stages": [{"id": "adult", "threshold": {"kind": "selected_start"}, "functionChanges": {}, "statChanges": {}}],
  "statTemplate": "village.bodies.hound.stats",
  "skillCarryRules": {"default": "review_per_method", "knowledge": "person", "motorPractice": "body", "mixed": "separate_knowledge_and_motor", "sourceFaculty": "actual_source"},
  "extensions": {}
}
```

Use BA-E1's proposed profile: health 100, stamina 40, agility 12, dexterity 8, intuition 12, defense 3, magic 0, contact bite power 12/cadence 1 per second. These are original balance defaults, not the existing Wolf enemy's stats. Use the full SS0-S mapping below for native numeric keys omitted by that compact profile; absent wield/fine-grip/shield functions suppress those mechanisms and associated bonuses. Do not fill empty equipment with fists. Rest at the patch proposes +2 health/+2 stamina per eligible played minute, capped at maxima; the compatible existing meal adds its real `Basic meal` effect through the body intake adapter, never a second invented bread buff.

### A-X: existing reuse and flagged additions

| Exact definition | Evidence / reuse boundary |
|---|---|
| `Village`, `villageElder`, `villageGuard`, `oldCraftsman`, `villageTrader` | SHOWN(source): `src/data/locations.js:378-393`, `src/data/npcs.js:63-66,81`. Reuse actors/place/station; signal, caretaker, commission and observer adapters are NEW. |
| `Shack`, `Eastern mill`, `Infested field` | SHOWN(source): `src/data/locations.js:396-418,469-478`. Initially locked. Only Infested field gets a bounded start-specific trial unlock after the elder's actual agreement; no automatic Shack/mill unlock. |
| `Running`, `Perception`, `Literacy`, `Spatial awareness` | SHOWN(source): `src/data/skills.js:1464-1477,2470-2479,2539-2556,431` and progression PS1/PS6. Reuse definitions, NEW applicability/XP-owner consumers. Scent practice credits new body-owned scent practice, not native critical chance by name alone. Gait maps Running; guard's fitting work is not player crafting XP. Visual reading is an explicit SS-A extension to BA-E1, requiring positioned text and learned Literacy; it grants neither knowledge nor hands. |
| `Stale bread` | SHOWN(source): `src/items.js:4203-4208`, `src/data/inventory_templates.js:31,86`. Existing Basic meal item; NEW starting transfer and canine intake adapter. Ordinary shop prices/stock keep their native quote. |
| `search for delivery`, `carry grain`, `fieldwork`, `patrolling`, `woodcutting` | SHOWN(source): `src/data/locations.js:2553-2614,1930-1950,1975-1999`. Their 15-minute Perception search, 480-minute carrying and two-hour wages are not completed or shortened by A's errand. Tool use stays gated; new scent contract has its own claim. |
| NEW `village.hound.rest_patch`, `village.hound.safe_refuge`, `village.hound.token`, `village.hound.collar` | Two safe subsites under Village and one identifiable token/gear definition. Token is the craftsman's property, retrieved under permission. Collar sold once, player-owned after settlement; tag makes no legal owner claim. Harness is a declared slot, future gear content. |

### A01-A10: first-hour script and branches

| Beat / suggested window | Exact content and action contract | Success, refusal or failure |
|---|---|---|
| A01 / 0-3 | In existing `Village`, NEW opening patch; show own body/empty collar slot and a flour trace. `Sniff token` records the craftsman's demonstrated scent sample, 1 minute/1 stamina, no stock reward. | Observed scent association only. Refusal leaves Rest and Circuit practice available. Cannot identify unseen owner by smell. |
| A02 / 3-7 | Existing `villageGuard`, NEW signal rehearsal: choose low posture, paw tap or wait. One 2-minute supported lesson reserves both parties; learns a yes/no exchange the guard witnessed. | Guard stores the demonstrated convention. A nervous wag is initially ambiguous (SB1); repeat or wait costs no penalty/forced obedience. Uninformed trader does not inherit the guard's knowledge. |
| A03 / 7-12 | Existing `oldCraftsman`, NEW request: one token fell beneath the bench within snout reach. Guard relays the specific request in one reserved minute. Preview 4-minute retrieval, 2 stamina, return token for 6 coins; hound may decline. | Both accept: reserve actual token and craftsman's six coins. Guard unavailable: request pauses; solo practice/rest remains. No body grip grant. |
| A04 / 12-18 | NEW `Compare traces` then `Follow known trace` under Village bench. Flour trace yields the one reachable token; oil distraction leads to a known empty edge. | Correct trace enables contact retrieval once. Wrong trace spends 2 minutes/1 stamina, records why it was wrong, retains token/funding and permits retry. Rendering/reload does not reroll its position. |
| A05 / 18-23 | NEW mouth carry, 2 minutes/1 stamina; transfer exact token to `oldCraftsman`, witnessed by guard. Settle only on recipient acceptance. | Craftsman retains token, pays 6 once to player's own purse; guard places counted coins in the player's accessible cache as custodian, not owner. Drop/interruption leaves the same token at its actual endpoint, coins in escrow; no payout until return. |
| A06 / 23-28 | Existing `villageTrader` initially cannot read the hound's signal. NEW introduction adapter through guard, then commission existing `oldCraftsman` for NEW collar, 4 coins/2 minutes/one help interval. | One fitted collar acquired/equipped through real helper. Decline keeps all 6 coins and empty slots. Stale quote, absent helper or wrong-size collar spends nothing. No global market unlock from private mind id. |
| A07 / 28-35 | NEW safe circuit under existing Village; queue one 5-minute cycle (2 scent +3 gait, 2 stamina total). Body practice credit proposes 2 scent XP and 3 Running motor XP. | Segment receipts once; stop/cancel preserves completed segment, drops future reservations. Route has no cash payday. Knowledge-mode fixture retains Literacy 120 while physical reading requires a capable helper holding text and the declared visual reading means. Default hound learns no Literacy here. |
| A08 / 35-42 | Rest at NEW patch, eat the one existing `Stale bread` if chosen. Existing `villageElder` receives the guard's report, NEW optional field-trial permission. | Own recovery/meal only; no care or friendship farming. Elder unlocks `Infested field` only after observed/report-delivered usefulness and current permission. Refusal leaves domestic life viable. |
| A09 / 42-53 | Optional MSS1 join: NEW wolf-rat resident `village.hound.rat_neighbor`, NEW mana-patch subsite, NEW crop claimant Fen (`village.hound.crop_keeper`), NEW named hunter Sedge (`village.hound.hunter`). All are original additions at the existing field's margin. Smell/observe, signal guard, choose alternate footpath or a permitted native bite encounter with existing `Starving wolf rat`/`Wolf rat`. | Default avoidance changes the known circuit away from crops; defensible contact is a witnessed withdrawal signal, not canine telepathy. No species-wide hunting flag. Hunter's one warning claim closes once; no payment for both reporting and defeating the same actor. Combat, if chosen, preserves existing foe definitions but uses hound attack/recovery; resident is a separate persistent actor, not a respawning anonymous foe. |
| A10 / 53-60 | Return via actual field exit to existing `Village`, choose 1-3 safe practice cycles or rest. Review known guard/craftsman memories and own collar/purse. | Quiet settled career is success. Interrupted field trial recovers under A-R; unpaid order stays recoverable. Save active routine and its exact cursor. No human evolution, mill clearance or all-MSS1 ecology required. |

**A-M micro:** INFERRED MM1/MM2/MM5/MM7 and SB1/SB4/SB5/SB6/SB8/SB12 consumers. A sunny patch can say the coat warmed, with no invented weather numeric penalty. A bench oil trace remains a distinct sensory lead, never a secret identity. Guard kneels only after witnessed signal practice. Collar rubbing reads an actual fitting issue and permits adjustment, not automatic damage. A repeated nickname sticks only after an actual introduction; player may keep their chosen name. If the player stays quiet, the guard waits or returns to work rather than narrating a spoken yes. Follow late micro owner MD-N1-MD-N10: event-bound text, default ceiling one ambient line per ten played minutes and avoid the last four detail IDs; Quiet is inspection-only and Rich is the owner's separate dial. Required receipts/pause reasons remain visible in every mode.

**A-U, proposed 1366x768 view:** left Body shows Hound, health/stamina, collar/harness and known sensing/communication; center Village shows the observed trace and 4-6 useful actions, including Rest and Stop; right Current work shows retrieval/circuit cursor and Partner shows only the guard's communicated offer. Belongings shows player purse/token custody, not craftsman's hidden funds. The first task, allowed signal and pause/save controls stay visible together. A narrative line such as `Flour trails beneath the bench. The guard waits for your signal.` replaces human greetings. Human-memory dial says `You remember written words; you need someone to hold this page where you can see it.` without granting hands.

## SS-B: Harry Potter free house-elf worker

**Default:** added adult free elf in a seven-novel branch, kitchen service with pay and independent choices (W01/S1/HP-P1). **Dial:** generated household commission, bound-elf premise with explicit terms, native or human-memory mind, another era, sourced broader magic. **Reasonably:** duties, freedom, individual regard, faculties and mastery resolve separately. This original player is neither Dobby's replacement nor an elf enrolled as a wizard pupil.

### B-C: canon ledger and source cutoff

Primary text read here: private `docs/research/novels/harry-potter/world-audit-2026-10-11/core-sources/complete-series.layout.txt`, from the seven-book PDF identified in `core-sources/LOCAL_SOURCE_RECEIPT.json`, SHA-256 `9db33901964c71cb58c90d65b50ac6af719e3ad8f9e65d25818343b14331b7d4`. TXT is newline-based line numbering; PDF is one-based page position in that supplied compilation, not a retail edition page. The [HP source ledger](harry-potter/SOURCE_LEDGER.md) and private [origins audit](../research/novels/harry-potter/world-audit-2026-10-11/ORIGINS_ERAS_BODIES_AND_OPENING.md), O16/I10, keep their original gaps. The readings below resolve selected claims only. No raw prose is copied into this document.

| Code / claim used here | Label and exact locator | Limit |
|---|---|---|
| B-C1 free elf precedent | SHOWN(text): Lucius throws the sock, Dobby catches it and then resists him. STATED(Dobby): he is free. Chamber of Secrets ch18, supplied PDF621-622, TXT26548-26605. | The original player's earlier clothing-release history is INFERRED. This scene does not create a universal accidental-clothes rule, full rights code or inherited employment. |
| B-C2 paid Hogwarts work | STATED(Dobby): Dumbledore employed him and Winky, offers wages; he accepted one Galleon/week and one day/month after a larger offer. Goblet of Fire ch21, PDF1483-1486, TXT62348-62352,62472-62497. | Dobby's chosen terms are his terms. SS-B's trial wage, hours, hiring, room and supplies are original, not a canonical elf wage schedule. |
| B-C3 opinions differ | SHOWN(text): nearby elves distance themselves at paid-work talk. STATED(Dobby): other employers rejected his paid-work request. STATED(Winky): she rejects payment and is ashamed of freedom. GoF ch21, PDF1485-1487, TXT62432-62456,62503-62530. | NPC response is individual. No compulsory self-punishment, species-wide shame or universal hostility is selected for the player. |
| B-C4 kitchen setting / body | SHOWN(text): pear-picture entrance, large kitchen, brass cookware/fireplace, many elves, long fingers/large ears. GoF ch21, PDF1481-1483, TXT62298-62309,62325-62331,62356-62384. | Player dimensions and hearing range are UNKNOWN in canon; template fit classes are original engineering choices. No special omniscient hearing. |
| B-C5 wandless magic lead | SHOWN(text): pudding floats while Dobby is present, then falls and Dobby disappears. Chamber of Secrets ch2, PDF274, TXT12239-12267. INFERRED: the scene supports designing a bounded elf object-moving technique without a wand. | Exact casting method, player mastery and safe tray limits are authored. No universal spell list or Hogwarts transit exception follows. Local `lift_one_tray` below is an original method with this lead. |
| B-C6 free expression | STATED(Dobby): bound service involved secrecy; Dumbledore waived this requirement for him. GoF ch21, PDF1487, TXT62526-62552. | Player's voluntary commission is separate from magical/legal binding. No automatic disclosure of other people's secrets or general liberation law. |
| B-C7 unresolved physiology/law | UNKNOWN: exact lifespan, routine diet/sleep physiology, general wand license, all elf magic limits, emancipation paperwork and unrestricted Hogwarts apparition. Locators: private origins I10; By-world W01 gaps; B-C1-B-C6 scenes do not settle them. | Rest/food numbers are explicit YAIRPG policies. Deferred faculties are absent, rather than MEMORY canon presented as fact. |

Source/era anchor: **after the kitchen employment state reported in GoF ch21, before any later chapter outcome is preloaded**. The audit's 1994-95 school-year candidate is a branch label; no exact day/date is claimed verified by this read. Original shift is a quiet later work interval, not Harry's narrated visit replayed with the player inserted. Seven novels are the baseline; films, later supplements and fanfiction are separate dials. B-C codes above qualify every canon-derived setting/person/magic assertion below.

### B-R: full resolved start fields

| Field / intro code | Proposed value |
|---|---|
| Id / source / premise | `hp.elf_worker.start`, revision 1, source revision pinned to B-C ledger; `continuity=hp.elf_worker.gof21.added_person.r1`, era anchor above. CF added-person scenario with original hiring/technique; any changed slavery/admission/magic law gets a separate AU layer, never silent canon promotion. |
| Place / role / entry | NEW native `hp.elf_worker.kitchen` labeled Hogwarts kitchens (B-C4) and NEW original supply alcove `hp.elf_worker.alcove`; private resting mat is a subsite. Entry `arrived` for a voluntary paid trial. Player is an original free worker, hired for one small order through an original coordinator, not an unshown canonical appointment. |
| Body / control / mind | Template `hp.elf_worker.body` rev1; owner/controller/person `player`, life/body ids from SS0, adult native elf mind, one body at kitchen. Knows local language, ordinary cleaning/sorting and one authored light-tray method. No future tournament lore, human memories or Dobby powers borrowed by appearance. |
| Freedom / relationships / witnesses | Original background record: a former original household released this elf with clothing before the opening, mechanism modeled narrowly from B-C1. No current master/controller claim; household id retained as history, not an active NPC spawned for compulsion. NEW original elf coordinator Tavi (`hp.elf_worker.tavi`) witnesses delivery. Dobby is optional NEW runtime canon actor (`hp.elf_worker.dobby`, B-C2/B-C3), not mandatory boss or magical source. Winky's attitudes B-C3 are context, not a compulsory cameo/therapy quest. |
| Needs / defeat / slots | Food may help; ordinary unfed play viable. Sleep on original mat, no canon sleep-duration claim. Trial defeat is exhaustion/incapacitation; recover same body on mat, rest +2 health/+2 stamina per played minute to maxima. No magical binding or self-punishment triggered by failure/refusal. Clothes/body-fit apron, satchel and fine-hand work tools; no seeded wand or wizard license. |
| First verbs / WC9 | `Inspect order`, `Ask terms`, `Lift one light tray`, `Sort cups by touch`, `Carry order`, `Return borrowed utensils`, `Refuse extra work`, `Rest`. Trial lead: deliver one borrowed tray to nearby alcove for a counted 2-Sickle fee. Magic is useful because hands can stabilize a spill while the tray is suspended; it is not just a ban on swords. |
| Initial means / payment | Player owns one original tunic and 0 wizard money; Tavi owns 1 light tray, 3 cups, 1 cleaning cloth, 2 orders total and 4 Sickles held for two 2-Sickle settlements. One water basin is a site, not spendable free potion stock. Borrowing lists exact object ids and return conditions. Currency is local wizard money, separate from Village/Paradise balances; no conversion formula is selected. |
| Idle / knowledge / advantage | Four-minute known sorting job, 1 stamina, 3 actual cups reusable after transfer to correct shelf. Sorting practice proposes 4 body-method XP, no automatic wages. Queue up to three segments while borrowed permission/workplace holds; pause at new order, lost tool/support or full shelf. Basic language is declared background; Literacy XP0 until taught or explicit memory layer. Tray method source/method grant is recorded separately from anatomy. |
| WC6/WC7/WC8/WC12 | Calm/social/work; a local trial-work card showing freedom, fee and loan return, not a Hogwarts pupil form. Elf anatomy and declared local training are ordinary means here. Perfect spell mastery/extra foreknowledge are separately labeled advantages. Kitchens and Dobby name are displayed only after local observation/introduction (B-C4/B-C2); no unrevealed chapter facts. |
| Save / links / SR8 | Keep free-status evidence/history, template/instance, learned method/source, coins in local purse, exact utensils/loans, order state/expiry, acceptance/refusal, Tavi/Dobby separate knowledge and routine cursor. LK4 coworkers, LK7 kitchens, optional LK6 earned independent household commission later. Future HP→Paradise crossing is LK10 with an actual later contract, not initial body storage. SR8: a useful free livelihood without compulsory human conversion or pupil admission. |

### B-B: engine-schema body template and method

All capacities, slot fits, numbers, rest/life policies and predicates are INFERRED adaptation values. B-C4 motivates shape; B-C5 motivates the separately granted technique. `cast.gesture` is only an anatomical channel, not an executable spell grant.

```json
{
  "schema": 1, "templateId": "hp.elf_worker.body", "templateRevision": 1,
  "form": "house_elf", "lineage": "hp.native.house_elf",
  "functions": {
    "see": {"capacity": 1, "channel": "visible"},
    "hear": {"capacity": 1, "channel": "sound"},
    "smell": {"capacity": 1, "channel": "local_scent"},
    "sense.contact": {"capacity": 1, "channel": "fingers"},
    "grip": {"capacity": 2, "channel": "hands"},
    "manipulate.fine": {"capacity": 1, "channel": "fingers"},
    "speak": {"capacity": 1, "channel": "voice"},
    "sign": {"capacity": 1, "channel": "gesture"},
    "read": {"capacity": 1, "channel": "visible_text"},
    "write": {"capacity": 1, "channel": "held_tool"},
    "move.walk": {"capacity": 1, "channel": "biped"},
    "eat.food": {"capacity": 1, "channel": "mouth"},
    "cast.gesture": {"capacity": 1, "channel": "hands"},
    "wear.apron": {"capacity": 1, "channel": "torso"},
    "wear.satchel": {"capacity": 1, "channel": "shoulder"},
    "wear.work_tool": {"capacity": 1, "channel": "hand"}
  },
  "slots": [
    {"id": "apron", "count": 1, "requires": ["wear.apron"], "fitTags": ["elf_small_torso"], "maxSize": "small", "custodyPolicy": "existing_item_title_and_holder"},
    {"id": "satchel", "count": 1, "requires": ["wear.satchel"], "fitTags": ["elf_small_shoulder"], "maxSize": "small", "custodyPolicy": "existing_item_title_and_holder"},
    {"id": "work_tool", "count": 1, "requires": ["wear.work_tool", "grip"], "fitTags": ["small_hand_tool"], "maxSize": "small", "custodyPolicy": "existing_item_title_and_holder"}
  ],
  "intake": {"modes": ["food"], "mealBenefitsPolicy": "authored_compatible_meal_bonus", "upkeepPolicy": "no_passive_food_debit", "shortagePolicy": "unfed_viable_no_hunger_death"},
  "rest": {"mode": "sleep", "supportedAt": ["hp.elf_worker.mat"], "recoveryPolicy": "own_played_rest_and_optional_meal_bonus"},
  "defeat": {"trigger": "health.zero", "outcome": "incapacitated", "recoveryAnchor": "hp.elf_worker.mat", "lossPolicy": "retain_identity_and_goods_actual_loans_remain", "continuationPolicy": "recover_same_body_no_auto_binding"},
  "presence": {"kind": "material", "endpointRef": "body.location", "anchorRef": null, "reach": {"sense": "same_place_supported_channel", "effect": "contact_or_licensed_method", "message": "local_voice"}, "carrierBodyId": null, "memberBodyIds": []},
  "mobility": {"modes": ["walk"], "routeConstraints": ["actual_access", "body_fit", "workplace_permission"], "carrierPolicy": "none_in_first_hour"},
  "size": {"class": "small", "dimensions": null, "mass": null, "scalePolicy": "authored_fit_class_not_canon_measurement"},
  "lifespan": {"mode": "unresolved_source_open_mortality", "duration": null, "clockPolicy": "played_exposure_no_implicit_offline_age"},
  "stages": [{"id": "adult", "threshold": {"kind": "selected_start"}, "functionChanges": {}, "statChanges": {}}],
  "statTemplate": "hp.elf_worker.stats",
  "skillCarryRules": {"default": "review_per_method", "knowledge": "person", "motorPractice": "body", "mixed": "separate_knowledge_and_motor", "sourceFaculty": "actual_source"},
  "extensions": {"hp.elf_worker": {"sourceRef": "hp.elf_worker.native_magic", "methodRef": "hp.elf_worker.lift_one_tray", "canonLedger": "B-C5"}}
}
```

NEW `hp.elf_worker.stats`: health60/stamina40; explicit ordinary work profile strength12/agility8/dexterity10/intuition10/defense0. These native-compatible numbers are proposed test/balance values, not canon power scaling. No attack mode, shield/fist bonus or wizard spell XP in this noncombat opening. Local magic consumes **1 stamina per 1-minute tray hold** as an original effort abstraction, not a canon mana law. NEW `lift_one_tray` requires recorded source/method, working gesture channel, sight, one permitted tray within 1m, load at most 1kg, free hand available for stabilizing contents and workplace permission; holds for one segment. No living targets, sealed cargo, transfiguration or travel. Source suppression removes the method, not the character's memory or speech. Exact range/load are original dials; broad elf casting remains B-C7 UNKNOWN.

### B-X: exact reuse and additions

No HP native world/location/NPC/item definition is asserted present. [WORLD_BRIEF](harry-potter/WORLD_BRIEF.md) is a proposal. Its original people Mara Fen, Elias Brook and Nessa Vale are **document concepts**, not runtime actors; this opening does not provision them by pretending otherwise. Reuse native `Literacy`, `Perception` and applicable crafting knowledge definitions only after method mapping (PSG1/PG1). No Village item becomes a canon Hogwarts utensil by relabeling it.

NEW locations: `hp.elf_worker.kitchen` (B-C4 setting), `hp.elf_worker.alcove` (original service subroom), mat subsite. NEW actors: Tavi original coworker; optional Dobby sourced by B-C2/B-C3. NEW identifiable items: `hp.elf_worker.tray`, three `hp.elf_worker.cup` object instances, cloth, tunic, two order slips and one optional fitted apron. NEW source/method, free-status background record, Sickle purse and contracts are explicit content/adapters. No wand, apparition, canon recipe, Dumbledore audience or school enrollment is seeded. Dobby's optional appointment is original availability in this branch; his canonical employment does not prove he is always available.

### B01-B10: first-hour script and branches

| Beat / suggested window | Exact place/person/item and action | Success, refusal or failure |
|---|---|---|
| B01 / 0-4 | NEW `hp.elf_worker.kitchen`; original Tavi shows one order slip with three cups, tray and fee. Inspect in own voice/hands. Setting is B-C4; this order is original. | Learn known terms and local place, no wages/source from viewing. Work card states free, voluntary trial and own purse. |
| B02 / 4-8 | Ask Tavi for 2 Sickles on accepted delivery; accept one bounded loan of tray/cups/cloth. | Reserve first of two funded orders. Decline retains room/rest and a free practice station; no loss of freedom, forced apology or compulsory punishment (B-C1/B-C6 boundary). |
| B03 / 8-13 | Practice NEW `lift_one_tray`, empty loaned tray over basin, 1 minute/1 stamina per attempt. Declared ordinary background method uses B-C5 lead. | Hold succeeds with valid means. Drop spends disclosed effort only, leaves same tray recoverable at basin. Unsupported/overweight hold refuses before expenditure and offers manual carry. |
| B04 / 13-20 | Sort three exact cups by touch and inspect chips in kitchen, 4 minutes/1 stamina; stabilize with hands during one licensed tray hold. | Safe set ready. Chip discovery creates an observed issue requiring Tavi to supply a replacement or accept two cups; no invented duplicate cup/recipe. Failure leaves wet cloth and same counted stock. |
| B05 / 20-25 | Walk to NEW original alcove with authorized tray; 2 minutes, door/custody recheck. Carry or hold method both reachable. | Contact endpoint changes once. Closed door/withdrawn access pauses at threshold; no automatic elf apparition through wards. B-C7 remains unresolved. |
| B06 / 25-30 | Recipient Tavi, under original appointment, accepts cups; return tray/cloth under loan terms. | Settle 2 Sickles once, retain clean-delivery memory. Refusal for mismatch leaves recoverable order and no paid receipt; return stock, correct or renegotiate disclosed smaller order. |
| B07 / 30-36 | Optional NEW Dobby introduction in kitchen, brief voluntary exchange, sourced employment/opinion B-C2/B-C3. No source dialogue copied. | Witnesses only visible work and introduced identity. A free elf coworker can like different terms; declining chat causes no global hostility. Dobby absent leaves no named locked button revealing his presence. |
| B08 / 36-42 | Tavi offers second funded trial or NEW fitted apron for 1 Sickle/2-minute fitting. Say yes, no or later. | Spend own local purse only. Apron improves fit/handling of wet work, not obedience. Work refusal retains earned coins/free status; Tavi can refuse another loan when busy without ending all rapport. |
| B09 / 42-54 | Queue three 4-minute known sorting segments with three cups now on reusable workshop shelves, actual permission, capacity and supplies. | 12 eligible minutes/3 stamina, proposes 12 sorting practice XP, no recurring cash. Full shelf/tool loss/new commission pauses. Hand/method expertise stays with actual executor, no unearned Cooking recipe. |
| B10 / 54-60 | Rest at NEW mat or inspect the second order. Optional compatible original meal has quoted stock and benefit; no food requirement. | Success is own livelihood and next useful choice. Exhaustion recovers the same elf, loan debt/title persists if still outstanding. Save before/after acceptance and mid-sort; no master bond created by reload. |

**B-M micro:** INFERRED MM3/MM5/MM7 and SB3/SB5/SB11. Cloth tied clear of long ears uses B-C4 shape; no stat derived from ear length. A cup on a low shelf avoids unnecessary carrying, an actual reach difference. An NPC asks whether the worker wants pay rather than presuming Dobby's preference (B-C2/B-C3). An apron offered for sale is gear, not a second release event after this already-free start. Original Tavi clears a dry working corner after a kept delivery; only recorded acts trigger that tell. Human-memory dial may place a cup at a remembered table position, no automatic recipe or uncanny detection. Ambient cap follows A-M.

**B-U, proposed 1366x768 view:** left Body includes small fitted slots, voice/hands, current fatigue and free-status history known to player; center Kitchens shows active three-cup order, manual and magic methods with their real costs; right Work/Loans shows recipient, fee, exact borrowed objects and Return/Stop. A known coworker row sits beside the contract. Currency reads Sickles, not Village coins. No hidden elf slavery meter, omniscient soul label, canon future or universal wand menu. Relevant actions plus Refuse/Rest/Pause/Save remain visible together.

## SS-C: Paradise alchemical bird partner

**Default:** durable independent alchemical bird beside an original contractor NPC, Paradise BS1; noncombat hub delivery first. **Dial:** living pet, temporary summon with its own source-specific lease, canine SRP9 near Su Xiao after explicit relationship/era review. **Reasonably:** no Baha/Bubtney stats, loyalty, recall, storage, revival or Contractor status arrive just by choosing the seat. SRP9 is a canine/relationship AU; SS-C shares its companion perspective and owner/controller separation, while using BS1's bird and an original partner.

### C-C: qualified canon ledger

Use supplied snapshot `PD-MTL-67f15d112389-r1`, hash in `src/book_world_paradise_ids.js:4-5`. `sid` is supplied member order and `p` paragraph number, not an authenticated chronological date. MTL fidelity to original Chinese remains UNKNOWN; missing printed4042-4049 stays a source gap. Private note roots are under `docs/research/novels/trailblaze-reading/paradise-depth/` (PD). No raw text or source dialogue is copied.

| Code / source claim used | Label and locator | Consequence/limit |
|---|---|---|
| C-C1 constructed speaking companion | SHOWN(dossier): alchemical Baha hatches/identifies himself, memories/speech appear; damaged core impairs language. STATED(scan): particular core stability and flight/poison faculties. PD `workers/b0012/windows/w2330-2339.md`, B0012-W13-C05, sid2338 p22-79, sid2339 p4-53; Paradise BC5/L6/F23. | Motivates original constructed bird. Same soul, arbitrary reconstruction and SS-C's core lifetime/powers are UNKNOWN. No 656-day timer or poison imported. |
| C-C2 companion livelihood | SHOWN(dossier): companions staff a stall, negotiate sales, hold earnings and fund room repairs. PD `workers/b0009/windows/w1720-1729.md`, B0009-W12-F01, sid1720 p1-23,29-47; sid1724 p15-27; BC7/L5. | Supports useful hub partner work. Original parcel, pay, furnishings and all rights below are INFERRED, not a recovered canon quest. |
| C-C3 temporary spirit distinction | STATED(item/system), SHOWN(dossier, via inspected beings owner): roughly forty-minute creation, no summon slot, death/departure ends that particular spirit. BC8/L9, PD `workers/b0009/windows/w1760-1769.md` F03, sid1763 p1-19,1764 p1-25,1769 p20-27. | Retain as attributed source lead for optional lease research, not a direct raw-chapter read here. Does not define the durable bird or every summon. |
| C-C4 living transfer is specific | SHOWN/STATED(narrator, dossier via beings owner): converted Bubtney can reach reality with retained stats/passives and sealed actives; temporary spirit expires on departure. BC11/L2/L9, PD reviewed B0002-P03 sid399 p28-34,63-105; sid401 p44-60. | No universal companion storage, suspended age or reality passport. SS-C has no cross-world travel in its first hour. |
| C-C5 housing/services | STATED(system, dossier via hub-life owner): private-room entry protection in one notice; SHOWN(dossier): ordinary services and furnishings. Hub-life §1 and canon F05/F09, PD sid23 p50-74, sid26 p22-65, sid27 p1-32, sid28 p1-11. | Partner's room/guest grant/perch/work route below are original. An existing training bench is not already a room, and hub-wide invulnerability is not established. |
| C-C6 injury/revival boundary | SHOWN/STATED(system, dossier): return restoration is partial and complex companion injuries need alchemy in the cited case. B0012-W13-C03, sid2334 p2-30; BC10/L6. UNKNOWN: generic pet resurrection, safe core replacement or an all-species summon recall service. | Minor repair in this slice is an authored paid service for the same retained core. Destroyed core cannot quietly respawn. |

Anchor `rp.bird_partner.post_alchemical_reference.r1` is a **source-adjacent original mission-return interval using the mechanisms C-C1/C-C2**, not a canonical day, Su Xiao household, or transplantation of late Baha into current first-Goa history. Source cutoff and branch divergence are serialized. Existing independent desk/training templates may be reused in this isolated branch through an explicit adapter; its actors/budgets do not overwrite `book.paradise.hub.main` or initialize/replay the Goa baseline.

### C-R: full resolved start fields

| Field / intro code | Proposed value |
|---|---|
| Id / source / role / entry | `rp.bird_partner.start` rev1, PD source revision above; authored source-adjacent companion branch. Entry `returned` with original partner Iven from an original completed low-risk errand; starting history is disclosed background, not player-earned mission rewards. Role partner/pet, not registered Contractor/Hunter. |
| Place / body / seat | NEW original private room `rp.bird_partner.room`, inside isolated hub instance `rp.bird_partner.hub.run.<seed>.<sequence>`. Template `rp.bird_partner.body` rev1; controller/person `player`, ownerId `player` for engine possession/title binding; legal registration separately says created partner with no selected universal species-rights rule. One body/one core, no parked human body. |
| Mind / knowledge / faculties | Native independently choosing created mind with local signal training, room/desk route memory. No predecessor Baha memories, poison, supersonic dive, automatic magic sight or future novel knowledge. Basic audible call/posture signals understood by Iven only after actual practice. No language spell, Literacy or free access to NPC task panels. |
| Relationship / witnesses | NEW original contractor Iven (`rp.bird_partner.iven`) owns the room, repair supplies and service purse; invitation grants perch/care and voluntary work, never motor control. Reuse existing `book.paradise.employee` definition as a branch-bound original desk worker, with fresh resolved instance stock only, per C-X. Personal regard, recognized work permission, body control and partner contract have separate records (PB1). |
| Needs / rest / defeat | No mandatory food/fuel depletion. Compatible repair charge can improve core recovery; ordinary stable activity and perch rest remain viable. Stamina0 pauses flight; walk/perch remain if supported. Health/core integrity0 grounds/incapacitates this retained core; no species-wide resurrection rule. Partial repair needs real executor/supply/time. Destroyed/missing core suspends repair and offers a separately authored successor/new-life option, not the same restored person. |
| Slots / first verbs | Leg band and light parcel pouch, both initially empty; one worn load at a time. `Inspect seam`, `Hop to perch`, `Signal partner`, `Quiet flight on known route`, `Carry light parcel`, `Refuse dispatch`, `Rest`. Flight/signature readings are original bounded traits, not C-C1's full Baha powers. |
| Initial means / support | Partner owns NEW1 parcel (<=100g), NEW1 matching pouch for loan, NEW1 repair charge and NEW1 small leg band for sale at 1 Paradise Coin. Desk order has 2 Paradise Coins explicitly escrowed from branch service funds. Player owns 0 coins/items initially; room/perch permission, not title. Partner has one paid 4-minute fitting/repair appointment available in the first hour. |
| Idle / contract | Two-minute route-memory exercise on known perch loop, 1 stamina; 2 body-owned flight-control XP. Up to three segments then rest. Optional paired delivery reserves each executor's different minutes, one actual parcel, single world clock. New route/door/damage/withdrawal/unavailable partner pauses; solo perch exercise remains. No parallel duplicate native Hero or minting offline jobs. |
| WC6/WC7/WC8/WC12 | Calm/social/curious; partnership card previews independent choices, room permission, pouch loan, custody and repair limits. Quiet flight is original anatomy/technique, not Contractor authority. Show Paradise name only from partner's local introduction, specific rights from actual offer. Known partner may be shown, private mission notices are absent. |
| Save / links / SR8 | Pin branch source/era/content, body/core identity, room invitation, actor/definition bindings, partner offer revision, custody/loan, purse/escrow, signal knowledge, practice/delivery cursor and repair settlement. LK4 pair, LK7 home; future LK10 crossing requires PB2 carrier receipt, destination habitat, source-specific expiry and DM8/DM11/S4 lease if temporary. No automatic reality return. SR8: companion livelihood with refusal and independent useful work. |

### C-B: engine-schema body template

INFERRED original bird, not canonical Baha. `read`/fine grip/speak/cast are absent; `hear` does not reveal Iven's private plans. Quiet flight changes an authored route's noise outcome, not universal undetectability.

```json
{
  "schema": 1, "templateId": "rp.bird_partner.body", "templateRevision": 1,
  "form": "alchemical_bird", "lineage": null,
  "functions": {
    "see": {"capacity": 1, "channel": "visible"},
    "hear": {"capacity": 1, "channel": "sound"},
    "sense.contact": {"capacity": 1, "channel": "beak_and_feet"},
    "sign": {"capacity": 1, "channel": "call_and_posture"},
    "move.walk": {"capacity": 1, "channel": "hop"},
    "move.fly": {"capacity": 1, "channel": "wings", "constraints": {"wingsUsable": true, "flightEffortAvailable": true}},
    "move.carried": {"capacity": 1, "channel": "actual_partner_carrier"},
    "wear.leg_band": {"capacity": 1, "channel": "leg"},
    "wear.parcel_pouch": {"capacity": 1, "channel": "torso"}
  },
  "slots": [
    {"id": "leg_band", "count": 1, "requires": ["wear.leg_band"], "fitTags": ["small_bird_leg"], "maxSize": "small", "custodyPolicy": "existing_item_title_and_holder"},
    {"id": "parcel_pouch", "count": 1, "requires": ["wear.parcel_pouch"], "fitTags": ["bird_light_load"], "maxSize": "small", "custodyPolicy": "existing_item_title_and_holder"}
  ],
  "intake": {"modes": ["repair_charge"], "mealBenefitsPolicy": "compatible_charge_optional_recovery_bonus", "upkeepPolicy": "no_passive_charge_debit", "shortagePolicy": "ordinary_stable_play_no_hunger_death"},
  "rest": {"mode": "recharge", "supportedAt": ["rp.bird_partner.perch"], "recoveryPolicy": "perch_rest_recovers_effort_minor_damage_requires_repair"},
  "defeat": {"trigger": "core_integrity.zero", "outcome": "grounded_retained_core", "recoveryAnchor": "same_identified_core_at_actual_endpoint", "lossPolicy": "retain_actual_core_goods_memory_no_free_duplicate", "continuationPolicy": "supported_same_core_repair_or_separate_successor"},
  "presence": {"kind": "material", "endpointRef": "body.location", "anchorRef": "body.coreRef", "reach": {"sense": "same_place_supported_channel", "effect": "contact", "message": "local_call_and_posture"}, "carrierBodyId": null, "memberBodyIds": []},
  "mobility": {"modes": ["walk", "fly", "carried"], "routeConstraints": ["actual_access", "wing_fit", "load_at_most_100g", "known_route_or_manual_choice", "carrier_route_if_carried"], "carrierPolicy": "actual_capacity_permission_and_same_core_custody"},
  "size": {"class": "small", "dimensions": null, "mass": null, "scalePolicy": "authored_aperture_class_and_separate_load_limit"},
  "lifespan": {"mode": "authored_stable_core_no_automatic_deadline", "duration": null, "clockPolicy": "played_exposure_no_implicit_offline_decay"},
  "stages": [{"id": "operational", "threshold": {"kind": "selected_start"}, "functionChanges": {}, "statChanges": {}}],
  "statTemplate": "rp.bird_partner.stats",
  "skillCarryRules": {"default": "review_per_method", "knowledge": "person", "motorPractice": "body", "mixed": "separate_knowledge_and_motor", "sourceFaculty": "actual_source"},
  "extensions": {"rp.bird_partner": {"coreRefBinding": "same_body_identified_core", "quietFlightMethod": "rp.bird_partner.known_route_glide", "coreDestructionIsNotRevival": true}}
}
```

NEW profile: core integrity24, stamina16, agility12/dexterity8/intuition10/defense0, no attack modes in this opening. Core integrity needs ENGINE_SPEC B14's real pool adapter; do not save both health and integrity as independent owners of the same damage. Native compatibility health is a derived projection where needed, not the final defeat policy. Perch rest +2 stamina per eligible minute capped16; no passive integrity repair. NEW repair spends partner's single charge and 4 scheduled minutes, restores up to12 integrity on the same retained core. Partner must accept and have actual means. No source claim of universal alchemical immunity, immortality or free repair. Capacity predicates and namespace policies need registered consumers before the start is admitted.

### C-X: exact existing reuse and new branch content

| Definition | SHOWN(source) and boundary |
|---|---|
| `book.paradise.hub`, `book.paradise.employee`, `book.paradise.hub.stock`, `book.paradise.hub.shop` | `src/book_world_paradise_ids.js:6`; `src/book_world_paradise_content.js:13,21-31`. Employee is an original branch desk worker, not Xi/Xia. Reuse immutable definition only with explicitly new instance bindings; its existing purse18/attention8 and goods are not player's assets or automatically refreshed. |
| `Paradise independent-contractor desk`, `Paradise paid training booth` | `src/book_world_paradise_ids.js:7,12-15`. Reuse place templates through snapshot adapter, not early-Goa mutable state. Training booth can be observed; bird has no inherited humanoid bracing course. |
| `Survey rope`, `Prepared survey kit`, `Goa ration parcel` | `src/book_world_paradise_ids.js:9`, `src/book_world_paradise_content.js:22,30,34`. Existing item ids are reference controls only. None fits this small parcel or serves as automatic core fuel; NEW parcel does not grant kit/Goa quest progress. |
| NEW room/perch, Iven, core, pouch, parcel, repair charge, leg band | `rp.bird_partner.*` original definitions/objects under one branch. Core is identity-bound component, not a second pet item that can be duplicated or sold while its body remains. Room invitation/loan/delivery/repair are NEW commands and state readers. |

NEW branch services get their explicit order budget, not the whole existing employee stock copied as reward. Instance adapter allocates unique actor-instance identity while keeping definition references and observer labels. If the engine cannot bind multiple instances of an existing native actor/location safely, the implementer must use new namespaced branch actors/locations referencing those templates and show that decision in the content manifest; do not enroll a second `book.paradise.employee` singleton. HP and Paradise identity isolation are SS-I2 gates, not assumed features.

### C01-C10: first-hour script and branches

| Beat / suggested window | Exact content / scheduled work | Success, refusal or failure |
|---|---|---|
| C01 / 0-4 | NEW room/perch: inspect own wing seam and same identified core. Iven offers his known signal, pouch loan and one desk parcel. C-C1/C-C2 are source precedents; this room/offer is original. | Player learns present limits and local invitation. No owner commands automatically move the body; no Hunter brand or private task knowledge. |
| C02 / 4-8 | Signal `wait`, `yes` or `no`; Iven repeats the convention, 2-minute joint practice. | Separate observer record for received signal. Misread call causes clarification, not increased loyalty or involuntary dispatch. Refusal leaves perch practice. |
| C03 / 8-13 | Iven fits NEW pouch, 2-minute joint work; reserve one identified <=100g parcel and desk's 2-Coin escrow for this delivery. | Actual loan/cargo custody; partner retains title to pouch. No mouth parcel plus a duplicate inventory parcel. Wrong fit/overweight refuses before spending, manual partner-carried route remains if accepted. |
| C04 / 13-18 | Quiet-flight rehearsal inside known room: 2-minute loop/1 stamina, then choose flight or hop/carried route. | Observed seam rattle reveals a real fitting issue; adjust/rehearse. No full Baha quiet-flight property, supersonic speed, poison or magic perception from C-C1. |
| C05 / 18-25 | Travel from NEW room to branch-bound existing `Paradise independent-contractor desk`, NEW original connection, 3 game minutes/2 stamina for flight, or 5-minute consenting partner carry. | Departure, arrival and custody recorded separately. Closed door/new disturbance pauses at safe threshold. Carrier absent causes no teleport or bird-inventory storage. |
| C06 / 25-31 | Existing-definition desk worker, branch-local instance, checks Iven's order/known signal and accepts NEW parcel. | Named recipient receives exact parcel; 2 Paradise Coins settle once into bird's own purse with explicit partner custody if held for it. Unrecognized call or wrong order yields a delivery question; can wait for Iven, return or refuse. No wages from global source currency pool. |
| C07 / 31-37 | Return via same connection; hand loaned pouch back to Iven, decide whether to buy NEW leg band at1 Coin, 2-minute fitting. | Pouch title/custody clear. Band denotes witnessed affiliation, not motor control or Contractor status. Decline preserves 2 Coins. Pouch still out means next borrowing waits on actual return. |
| C08 / 37-43 | Optional minor seam/core service: Iven's one4-minute appointment, one owned repair charge. This is original repair motivated by C-C1/C-C6. | Restore up to12 actual damage, spend stock/time once; zero damage does not consume charge. If core is missing/destroyed, reject same-person repair and preserve suspended life/export; no silent replica revival. |
| C09 / 43-55 | Queue up to three2-minute solo route exercises, rest between as needed; optional linked Iven desk-preparation job uses his own separate means/time. | Six eligible flight minutes/3 stamina give6 body practice XP once. World clock advances once. Partner departure ends shared offer; solo practice/rest stays. No automatic mission acceptance at recall. |
| C10 / 55-60 | Review known home/coin/loan/repair and own route history; choose more safe exercise, rest or later delivery when a funded new order exists. | Useful nonhuman household career is success. New mission, temporary summon or cross-world passage needs a new contract and source-qualified carrier receipt. No extraction/reward from an unissued mission. |

**C-M micro:** INFERRED MM1/MM5/MM7, SB3/SB4/SB5/SB8. Iven turns the perch to face the door after the bird successfully uses a signal; this reads a recorded choice and does not imply mind sharing. A pouch seam rattle reads fitting/actual carried load, not hidden item contents. Band glints only to sighted local witnesses. After partial core repair the player sees the same familiar scratch; narration never certifies soul continuity from a cosmetic mark. A held call lets Iven finish another commitment before replying. Partner impatience/refusal is communicated, not leaked from a private affection score. Ambient cap follows A-M.

**C-U, proposed 1366x768 view:** left Body shows Bird/core integrity/effort, worn band/pouch and known flight load; center Room or Desk with Observe/Signal/Travel/Rest; right Partner shows Iven's actual offer, selected control seat and next known appointment, and Current work shows parcel/loan/cursor/stop cause. Own Paradise-Coin purse and actual cargo sit together. Say `Iven offers to carry you` and await agreement; never `Owner commands: obey`. No global summon-slot bar, staff ledger, unopened mission destination or future Su Xiao relationship.

## SS-AC: implementer and browser acceptance checklist

**All gates below are specified, unrun.** An implementer records SOURCE/test results separately from a verifier's rebuilt native journey. A passing schema or synthetic fixture does not close a playable gate. Use generated disposable saves, own fresh origin and the real save/file UI, never an existing user save. Human taste/balance acceptance is separate. Completion of this writing lane does not authorize runtime writes or acceptance of its policy choices.

### Shared checklist for whichever start is selected

| Implementer checklist | Browser verifier checklist |
|---|---|
| **SS-I1** Schema: implement selected-start admission and validated template/instance resolution from E1/E2/E14/E15; unknown function denied, no race-as-form overwrite; all namespaced policies have executable registered readers. Counterexamples cover human, reedling, active/returned Tern and selected nonhuman. | **SS-V1** Rebuild candidate, serve disposable fresh origin, record actual served bundle hash/build identity and1366x768 viewport. Enter selected start through creation UI; no console-injected body or prebuilt bundle. Inspect body, active verbs and initial inventory/knowledge. |
| **SS-I2** Identity/creation: resolve once, store hashes/revisions/seed/ids before publication, validate actual source/era/place/role; avoid duplicate native NPCs/world instances. No stock, random draw or knowledge mutation during preview. Failed allocation/publication is atomic. | **SS-V2** At opening, manual Save/reload/Export/literal-file Import through actual file input preserve selected receipt/body/life/seed and exact initial stock. Import refusal for future/unknown schema preserves storage and offers supported recovery/export. No reroll/reprovision on reload. |
| **SS-I3** Means: action preview and transaction/finish recheck functions, actual channel/reach, slots/fit, custody, participant availability and method. Invalid stale quote fails without expense. Natural attacks never inherit swords/shield/fists by empty slots. | **SS-V3** Perform one distinctive useful verb and one real service/exchange. Attempt unavailable human action and incompatible fitting via UI; show truthful reason and viable alternate. Reopen stale quote after support changes; no unauthorized output. |
| **SS-I4** Scheduler: reserve each participant and input, complete segments once, cancel/refund only unsettled terms, persist cursor/escrow. No double native/simulation timer, NPC/player work duplication, inherited two-hour wage, or rendering-triggered reward. | **SS-V4** Start idle routine, stop mid-segment, resume and finish. Save/reload/export/literal import while active and after settlement; compare cursors, reservations, stamina, goods, purse and XP owners. Repeat reopening to prove no duplicate wages/objects. |
| **SS-I5** Knowledge/social: each witness learns only received/observed evidence; mind knowledge, body practice and source faculty have separate provenance/applicability. Directed regard, title, legal claim and control are not one meter. Paused/refused helper still has its own choices. | **SS-V5** Compare informed helper with uninformed observer. Refuse work/support, observe remembered consequences and resume useful solo work. No universal communication, private reserves, sealed truth, source-future facts or unseen named actor in panels/tooltips/search/log. |
| **SS-I6** Needs/recovery: test zero pools without truthy fallback, own rest policy, real meal/fuel input and disclosed recovery losses. Hunger cannot kill. Preserve opted-in legacy mortality; no new automatic aging/closed-browser death/compulsory transformation. | **SS-V6** Exercise legitimate rest and compatible meal/support input; verify useful effect and continued unfed eligibility. Exercise authored defeat/repair branch using a generated fixture plus native route where appropriate; inspect same identity/custody and exact recovery expense. |
| **SS-I7** Persistence: full-envelope deterministic/idempotent migration from old absent/partial body, reedling and Tern records; preserve dormant packs and current schemas. Failed storage/import/quota/preflight leaves body/vitals/stock unchanged. New-life builder preserves chosen body, not a silent human reset. | **SS-V7** Run affected old-human and body regression journeys on disposable origins after rebuild. Compare active/returned Tern and reedling where touched. Browser-closed reopen grants no unscheduled credit/loss. Report unsupported native regressions OPEN rather than substituting source tests. |
| **SS-I8** UI: one qualified view used for place/log/tooltips/actions; meaningful body slots and party/offer readers; escaped names, effect-off and text-only routes; safe pause/save controls stay reachable. No new mobile-design gate. | **SS-V8** Capture1366x768 opening, task, refusal and recovery screens. All routine actions/body/current work/known partner visible at comfortable16px text; no horizontal overflow/page scroll for routine controls. Test keyboard focus, text-only/effects-off, long name, and150% desktop zoom with local panel scrolling. Record actual browser result, not a claimed fit from pixel budgets. |

### SS-A additional checklist

| Implementer | Browser verifier |
|---|---|
| **A-I1** Declare native-origin adapter and NPC identity bridges; separate token errand from native delivery/fieldwork/patrol. Reserve one token/six coins/one collar. Correct trace fixed at origin; oil false lead costs effort without changing stock. | **A-V1** Start hound in Village; follow wrong then correct trace, carry/drop/recover exact token, return it, earn6 coins once. Existing native delivery quest remains unfinished. |
| **A-I2** Mouth/contact retrieval does not grant fine manipulation; guard's scoped representation/fitting executes through guard/craftsman. Trader requires actual introduction. Collar fit/title/control independent. | **A-V2** Before introduction, trader cannot interpret the private signal. Introduce, pay4 coins for collar with actual fitting help; purse2/collar1/token back with craftsman, no extra bread/source/weapon. Withdraw helper before another quote and verify no spend. |
| **A-I3** PSG1: default Literacy0; separate generated human-memory fixture retains120 XP with actual visual-reading means/held page. Gait credits current body's Running only. Full effect mapping excludes incompatible native bonuses. | **A-V3** Run one5-minute circuit:2 scent/3 gait XP,2 stamina consumed once. In knowledge fixture, retained Literacy survives but hands/fine writing remain unavailable; supported held-text reading uses correct helper/time. |
| **A-I4** Natural bite/retreat/recovery tested on native enemy consumer; harmless NPC hound gets identical fit/means rules. Health0 pauses job and continues same body under declared safe-field policy. | **A-V4** With elder's actual permission, enter existing Infested field, fight by Bite, retreat/recover at hound anchor without human bed/fist/shield text. Save/import post-fight identity/stock and active recovery. Noncombat refusal remains useful. |
| **A-I5** Optional MSS1 additions require four independent actors/sites/claims, no native pursuit target-generalization assumed. Resident encounter does not duplicate hostile foe or settle hunter/crop claims twice. | **A-V5** If MSS1 content ships, observe named neighbor and claimant, receive hunter's warning, change actual circuit/route or make defensible witnessed contact; closure remains once after import. Otherwise label A09's MSS1 branch deferred, not demonstrated. |

### SS-B additional checklist

| Implementer | Browser verifier |
|---|---|
| **B-I1** Source manifest pins B-C1-B-C7; origin freedom is authored history, no master/controller created from clothing or employment. Canon Dobby availability is optional original schedule; no school/wand/ward permission invented. | **B-V1** New HP worker starts free in Kitchens with only declared background/source/utensils. Inspect/refuse trial; freedom/own purse and rest remain. No compulsory bound-elf dialogue or pupil creation flow. |
| **B-I2** Source and method grant separate from `cast.gesture`; lift checks load<=1kg/range<=1m/sight/permission/actual object. Mana law is not inferred from effort. Manual carry always available for valid small load. | **B-V2** Hold actual light tray, stabilize cups; compare manual method. Unsupported load/suppressed source and stale permission show reasons, no cloned tray or generic apparition. |
| **B-I3** Orders use exact cups/tray/cloth, loan title and two escrowed fees. Match/return before settlement, wrong cup supports renegotiation/return without automatic penalty. Currency separate. | **B-V3** Complete first order for2 Sickles once, buy optional apron for1, retain exact remaining purse/loan state. Reject wrong recipient/set; correct/return and preserve funds. Village coins remain separate. |
| **B-I4** Sorting owns bodily practice, declared knowledge has its own owner. Shelf capacity and tool/participant loss pause segment; full body-schema/save compatibility enforced. | **B-V4** Mid-sort Save/reload/export/literal import retains source/method/free status, exact borrowed objects, segment progress and separate skills; no recurring wages from practice. |
| **B-I5** Observe only present/introduced canon coworker; individual payment attitudes/source confidence retained in author notes. Recovery never rebinds or presumes a source cure. | **B-V5** Optional Dobby introduction and absence behave truthfully; refuse extra order, rest after exhaustion and eat a compatible authored meal. Inspect renewed offers/observer memories without global hostility or future canon leaks. |

### SS-C additional checklist

| Implementer | Browser verifier |
|---|---|
| **C-I1** Freeze new branch bindings/source cutoff; retain existing first-Goa human branch unchanged. One bird/core identity; body control independent from Iven room/title/offer. No generic Contractor admission or duplicate employee singleton. | **C-V1** Enter bird in original room, observe known partner and granted perch; existing desk label reused only under declared branch. Own body remains bird after reload; no Su Xiao/Baha power/relationship or Goa future knowledge seeded. |
| **C-I2** Load/aperture/flight/carrier/custody recheck. Pouch title stays Iven's; parcel leaves its actual owner only once; both parties reserve real time. Partner says no without controlling player. | **C-V2** Try overweight/closed-route flight, then consent to known legal route or actual carry. Arrive at branch desk, deliver exact parcel, receive2 Coins once; return pouch, optionally buy1-Coin band. No inventory pet storage/duplicate cargo. |
| **C-I3** Core integrity pool has real publication/validation semantics; health is compatibility projection only. Partial repair uses same core, one charge/four minutes; missing/destroyed core refuses revival. | **C-V3** Partial-damage native/fixture journey repairs up to12 with exact charge cost; post-repair save/import preserves same core id/remaining damage. Destroyed-core fixture is safely suspended, original file remains exportable, no silent replacement person. |
| **C-I4** Safe practice works without Iven. Paired jobs share one clock and each actor's own means; solo practice grants only own flight-control XP. No passive fuel debit/656-day countdown from Baha scan. | **C-V4** Withdraw partner mid-offer, run solo exercise, stop/resume/import active cursor. Verify6 practice XP after three2-minute segments,3 stamina debit, no double elapsed time/cash and no absence decay. |
| **C-I5** Durable BS1 selected. Temporary-summon dial remains unavailable until named source/lease validates owner/controller, expiry, identity/reinvocation, source-specific failure and actual return anchor. Generic recall is not inferred from C-C3/C-C4. | **C-V5** First hour offers durable bird career without a recall button promising universal safety. If temporary version is later built, separately verify expiry/dismissal/failed return/same-person policy and cargo reconciliation under that exact contract; none is credited by this durable route. |

### SS-D: final ready-to-implement boundary and remaining gaps

**F1:** Three complete proposed records, three full engine-schema templates,30 scripted beats, three micro/presentation treatments, and23 implementer plus23 browser checklist rows are written. Body templates are parseable authoring notation; they are not compiled by the current pack validators. SOURCE inspection supports the listed reuse boundaries, not shipped gameplay.

**F2:** Shared engine/admission/persistence work remains the prerequisite. SS-A adds native Village bridges and scoped help; SS-B needs HP runtime content and bounded original magic; SS-C needs isolated branch/instance support and actual core-pool publication. The explicit SS0-S numeric mapping and the declared predicates/source grants/policy operations need registered readers before compilation. None is an executable promise by its name.

**F3:** Canon coverage is narrow and labeled. HP exact general physiology/law/Hogwarts transit rules remain B-C7 UNKNOWN; Paradise translation, missing chapters, universal recall/storage/revival and soul identity remain C-C1-C-C6 qualified. The default routes deliberately use declared original terms rather than filling those gaps with unsourced lore. A full close adaptation of broader powers needs the named source recheck.

**F4:** All five optional round7 corpus owners are now present and their relevant codes reconciled; their live revision/status still needs refreshing before implementation. Round9 IM1/IM2/IM5/OA5 and round10 NA scope considerations agree with one body owner, affected human regressions and a shared Body surface. No cheats, comic content, broad abstractions, kin registry or extra realm are introduced here. All runtime, build,1366x768 browser, full save/import and director acceptance gates remain OPEN. A09's optional MSS1 expansion, mobile optimization, broader transformations/kin/clocks, temporary summons and world crossings are explicitly deferred.

Resume from the [START SPECS checkpoint](../gm/dispatch/nonhuman-starts-2026-10-14/startspecs/CHECKPOINT.md). The coordinator reviews proposals against the linked owners; only a later authorized implementation packet chooses and publishes the executable version.
