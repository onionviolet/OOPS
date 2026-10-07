# Skyrim implementation packet

Status: expanded staged Develop/Research packet, revision 2, 2026-10-03. **Not dispatched; build gate blocked by named instance/native dependencies.** [Campaign](CAMPAIGN.md) owns expanded fiction and the [brief](WORLD_BRIEF.md) indexes entry/checkpoint and [local GM role](GM_PROMPT.md) owns assignment behavior. This uses [the implementer template](../../GAME_IMPLEMENTER_TEMPLATE.md); authoring record names from [contract v1](../CAMPAIGN_FRAMEWORK.md) are not available runtime APIs.

## Filled task packet

```text
OUTCOME: A future isolated Skyrim visit supports the lower-road supply choice:
         costly ordinary work, destructive craft or a paid escort, and refusal.
PARENT: world-expansion specialist; WORLD_BRIEF expanded revision 2; master /root integrates.
AUTHORITY: Current authorization is Develop/Research only. This packet prepares
           a later build; no worker, runtime writes or second world are selected.
BASE: /Users/weiwei/code/yet-another-idle-rpg;
      97c28efece4fd6248b6f075ad0c6927c3d0432df plus existing dirty work.
WRITER: Current GM owns the four reserved docs/worlds/skyrim campaign/brief/role/packet documents only.
        Future source/test/view reservations require master assignment.
CONTEXT: Ordinary traveler; invented Lower Road cast/history; bounded S1-S3 in CAMPAIGN/SOURCE_LEDGER;
         no Dragonborn entitlement, new prestige, automatic old-save rewards.
INTERFACE: Inspected owners and exact gaps below; freeze contract before build.
DO NOT TOUCH: Private saves, unrelated dirty work, other worlds, LICENSE,
              generated bundles or shared files without integrator reservation.
ROUTE: Capable integrator settles instance/native persistence. A settled local
       content slice may qualify Luna/high after capacity is explicitly granted.
GATE: Two funded approaches and abstention have distinct durable consequences;
      custody, occupancy, knowledge, failed-write, reload and once-only checks.
CHECKPOINT: WORLD_BRIEF Resume checkpoint, writer world-expansion specialist.
RETURN: Status, paths, actual inputs/checks/results, unrun combined gates,
        missing contract and specific next action; no narrative-only proof.
```

## Proposed integrated proof

Future test fixture: new generated character, isolated test origin and explicit Skyrim enrollment. Preserve a separate untouched Frontier progress snapshot. Provision fixture holdings with known acquisition receipts, not by editing a personal save: local spendable septims, an owned unequipped stamina ring, plain boots and one purchased filled gem. A borrowed ring belongs to a separate custody owner. Old saves gain none of these on loading.

**Ordinary loop:** A finite four-minute mill shift spends two stamina and pays three local septims. A known batch can repeat until the chosen count, stamina, site capacity or player cancellation stops it. Reading availability pays nothing; selecting and completing work applies each effect once. Proposed amounts are balance fixtures, not Skyrim numbers.

**Approach A, permanent craft:** Inspect the cart, pay two septims for Orven's enchanter slot, and deliberately destroy the owned ring in a nonrefundable two-minute study. The study separately earns one pattern. Then reserve plain boots, the filled gem and three septims for a four-minute fitting/enchantment job. Cancellation before completion refunds these untouched reserved craft inputs, never the destroyed ring. Loan the completed boots to Runa's named hauler through custody; her six-minute hauling job uses the equipment's proposed stamina benefit. Successful delivery grants the agreed fee once; returning the boots closes custody. Keep the pattern and boots for later funded production/hauling.

**Approach B, limited service:** Retain the ring and boots, pay ten septims, and supply one actually owned Serevyn recovery dose. Orven reserves six Magicka units for a six-minute protective escort. His participant reservation prevents simultaneous teaching/escort work. Cancellation after accepted booking forfeits the fee, dose and reserved preparation fuel; the preview states this before commitment. The same shipment can arrive, but the player gains a paid-service memory and preserves gear, without receiving the studied pattern or reusable boots benefit.

**Refusal and expiry:** Decline or let the 24-minute public offer expire. Runa funds the long road from her own means; the yard's next shipment moves away, and a later report discloses this. The player receives no fee, promise or automatic grievance. A separate later timber/labor repair can restore yard deliveries while preserving the old route history and forfeited opportunity. Acceptance followed by default must differ from refusal.

**Optional imported-power check:** Retain learned `field.load_step` mastery two and its actual `field.drive` reserve in the fixture. A proposed bracing application spends three drive units and adds strain, saves one reinforcement and shortens a supported cart task. It does not grant Skyrim pattern knowledge. A second run without fuel disables the execution and keeps the owned method. No severe dragon battle is needed for the first proof.

## Inspected owners and precise missing adapters

| Domain | Available source contract | Required integration decision or missing behavior |
|---|---|---|
| World state | [expansion_engine.js](../../../src/expansion_engine.js): `createExpansionState`, schema5 worlds/actors, registry validation; [simulation.js](../../../src/simulation.js): `previewCampaignTransition`, `commitCampaignTransition` | Saved actors bind one `worldId`; there is no independent native `worldInstanceId` projection. Define how proposed source-family/continuity/era/region records bind an instance without redefining old IDs. Same-instance reentry must restore isolated shops, quest/access flags, locations, NPC/equipment and local facts/RNG. |
| Native host | [main.js](../../../src/main.js): `expeditionContext`, `persistExpansion`, native context/publication; [native_gameplay_adapter.js](../../../src/native_gameplay_adapter.js): `snapshot`, `contexts` | `current_location`, native character and data registries remain shared host state. [locations](../../../src/data/locations.js), [dialogues](../../../src/data/dialogues.js), [traders](../../../src/data/traders.js) and [NPCRegistry](../../../src/data/npcs.js) have no isolated Skyrim instance adapter. Add an explicit active-instance/native location-travel/save projection before exposing real entry. Simulation `relocate` rejects native actors. |
| Paid commands/production | [simulation.js](../../../src/simulation.js): `previewSimulationCommand`, `commitSimulationCommand`, `cancelSimulationJob`, finite programs; [site_projects.js](../../../src/site_projects.js): `compileSiteProject` | Jobs, site capacity, participants, refunds and phases are available. Register local sites/actors/definitions only after scoped IDs and active-instance requirements are frozen. A menu cannot execute an unregistered destination command. |
| Inventory/enchantment | [simulation_effects.js](../../../src/simulation_effects.js): `item`, `transfer`, `custody`, `claim`, `knowledge`; native transaction/publication in [main.js](../../../src/main.js) | Register actual item keys and compatible native equipment effects; no enchanting machine, dynamic enchantment-stat adapter, soul capture or weapon-charge system is supplied. First proof may use fixed authored item variants, with the destroyed item and gem consumed in the same owner, and no second player inventory. General enchantment construction/recharge stays separate. |
| Fuel and imported method | [energy_resources.js](../../../src/energy_resources.js): learned policies, reserve/use/refund/recovery; [power_models.js](../../../src/power_models.js): contextual execution/capacity; [field_workshop.js](../../../src/field_workshop.js): actual step/drive | Define local Magicka recovery and specific imported command support. The current frontier application is authored for `base.frontier`; copied ownership is not destination execution. Do not modify the original paid method or silently refill fuel on entry. Local septims can be an actor resource; multi-currency trade and conversion are missing native adapters. |
| Situation and observers | [simulation.js](../../../src/simulation.js): `discoverSimulationEvent`, `respondSimulationEvent`; [simulation_effects.js](../../../src/simulation_effects.js): world facts, observation, knowledge, directed relationships | Use one event/claim/phase writer. [people_knowledge.js](../../../src/people_knowledge.js) currently authors particular Frontier records; Skyrim needs a known-only projection. [world_knowledge.js](../../../src/world_knowledge.js) has name/branch facts but no era/instance disclosure contract. General Events/Quests projections need explicit local bindings. |
| Persistence/compatibility | [expansion_persistence.js](../../../src/expansion_persistence.js): `persistExpansionPlan`; [save_files.js](../../../src/save_files.js): validation/import; [main.js](../../../src/main.js): publish after save | The native transition planner can project an authored envelope; it does not supply destination snapshot restoration or migration. Integrator selects schema/migration and unsupported-content policy; old saves retain `base.frontier`, jobs and knowledge without enrollment or rewards. Export/import/reentry must use one durable envelope. |
| Threat/death/history | [native_battle.js](../../../src/native_battle.js): hardcoded `rival.native_duel`/Mara, minimum one HP; [simulation_effects.js](../../../src/simulation_effects.js): explicit authored `life` effect | No generic native Skyrim battle/dragon action host, multi-fighter party adapter, lethal player end/return/cargo policy or dependent-history rollback is implemented. A raw `life: dead` effect alone does not satisfy them. Severe mode and historical scenarios require separate selected gates; current fainting/offline defaults remain. |

## Future decomposition and evidence plan

Lane 0, capable master integrator: settle instance isolation, native travel/save restoration, item/equipment variants, currency binding and absence clock. Reserve shared files and tests as one writer. Freeze the new interface and snapshot affected dirty inputs. **This is the authoritative dependency gate before a playable Skyrim visit.**

Lane 1, representative content worker after Lane 0: propose exclusive `src/skyrim_content.js` and `tests/skyrim_content.test.js` reservations, not current authorization. Author local definitions and two cost paths against the settled registry; test real consequences rather than copied implementation details. Return source facts/inventions, fixture state, actual results and gaps for world-GM review. The master owns registry integration and generated builds.

Lane 2, known-only menu worker after Lane 1 interface review: proposed exclusive `src/skyrim_ui.js` reservation. Project known offers, current work and local People records; commits go through the host's durable planner. It may develop independently after the read/command interface freezes, but shared Notebook/Events/Quests hooks stay with master. Human text/balance approval remains separate from technical acceptance.

**Narrow negative and persistence checks:**

1. Reject insufficient septims, missing/dormant fuel, unsuitable gear, equipped or borrowed study input, busy teacher, full bench, expired offer, wrong instance and stale sequence with no spend or RNG advance. Observation alone grants no pattern, fuel or faction authority.
2. Save after ring destruction, during crafting and during Orven's escort; reload preserves the ring's absence and restores pattern progress, reserved inputs, participants, due time and fuel without another charge. Cancel returns only the specified reservation; no resurrection of the destroyed ring. Collect twice and replay a settled response: no extra fee, boots, pattern or relationship increment.
3. Force a storage-write failure for commitment and completion: live money, inventory, fuel, claims, native equipment and route outcome remain unpublished; recovery uses the last durable command, not an uncertain repeated reward. Unknown NPC/world/dragon state stays out of People, Events, Quests labels and tooltips before supported discovery.
4. Refuse, expire and default after acceptance in separate generated fixtures; report the distinct debt/memory/route results. Finish later repair, export/import, leave and revisit: repaired capacity and people/claims persist; Frontier shops, native quests, calendar policy and original progress match their preserved instance snapshot. Earlier-era scenario changes only its isolated branch.

**Combined gate, integrator-owned and unrun:** Use the repository's actual build script, then exercise both choices, refusal, failed saving, reload, native export/import and return journeys in a browser on a separate test origin. Record exact current input hashes, test commands, browser steps and results in the existing [PLAYTEST owner](../../PLAYTEST.md). Do not use a prebuilt bundle or documentation walkthrough as evidence. A severe-mode gate additionally needs explicit opt-in terms, fixed threatening output, real death/failure retention and rejected unpaid escapes; it is excluded from this first proof.

**Current review evidence:** The GM inspected live registry/planner/effect/native owners and bounded primary sources; local Markdown targets and design consistency are checked before return. No runtime, browser, personal-save or lethal-mode verification was run. All proposed runtime filenames/reservations remain future assignments. Next: master reviews the documents, resolves Lane 0 scope if a build is later selected, and preserves the existing first milestone.

## Expanded campaign staging and current evidence

Read [CAMPAIGN](CAMPAIGN.md), [MODULE_CATALOGUE](MODULE_CATALOGUE.md), [SOURCE_LEDGER](SOURCE_LEDGER.md), [ability contract](../ABILITY_AUTHORING.md) and [continuity](../LORE_AND_CONTINUITY.md) before dispatch. Detailed component numbers remain catalogue-owned. These stages do not authorize implementation, worker creation or all five worlds at once.

| Stage | Concrete result and acceptance dependency |
|---|---|
| 0. Shared instance boundary | Master integrator binds native home/destination isolation, absent clocks, namespace/revision compatibility, actual local money/items and durable return. No label swap or native hard reset. |
| 1. Lower Road proof | The exact destructive-study versus paid-escort sequence below, including a costly ordinary shift, once-only supply claim, refusal/default distinction and full synthetic round trip. |
| 2. Connected careers and places | Dry-stock yard, Companions supplier annex and coastal sample store connect through paid people/materials; deliver one martial versus ordinary craft or research journey with useful return. |
| 3. Assemblies and regional institutions | Consume the module catalogue through actual part identity, supported worn versus charged effects, refit/condition and road-compact phases; dynamic construction needs its named integrator adapter. |
| 4. Mature branch/danger proof | Test public versus exclusive charter in independent histories and a fixed overwhelming threat under a selected general combat/loss profile. No new prestige or lethal rules by implication. |

A bounded Paradise-style expedition can select one campaign scenario without implementing its entire map; local people/projects/claims must still persist and the issuer/hub contract remains a separate shared owner. No novel-specific penalty or residence rule is asserted.

Current design reservation is exactly CAMPAIGN/WORLD_BRIEF/GM_PROMPT/IMPLEMENTATION_PACKET in this directory. The specialist owns the same four filenames in five worlds; module and source writers remain separate. No general world-directory ownership, source/bundle/private-save edits, commits or chat messaging is granted.

Current inspected input fingerprints, 2026-10-03; rediscover affected drift before future build:

- `docs/GAME_MASTER_PROMPT.md` SHA256 `80f615e02151a5c787bdb4351c62b26e6e42a9f99ac93cb6330cb63fe581bbba`.
- `docs/gm/WORLD_EXPANSION_GM_PROMPT.md` SHA256 `f36733e10d8611159e29b3d57e22b5f3955f5e169ab75c945112a1bf5643fffb`.
- `docs/worlds/CAMPAIGN_FRAMEWORK.md` SHA256 `c1c796a29139284bbeda99d9caf2ad57e8ddd797cb11249eb073d146269550f4`.
- `docs/worlds/PROGRESSION_AND_ASSEMBLY.md` SHA256 `35a3ea8aaa3ab4f1336d3617f07c4e7ef5e5287b8dfed4cd7cec7cbc77f37147`.
- `docs/worlds/ABILITY_AUTHORING.md` SHA256 `a6062efad9c196ab069bee910c543bca45f89ad9b74907f5f7cabb900e4b1687`.
- `docs/ENGINE_AUTHORING.md` SHA256 `5051a43423e6ac0cf8ed581d3afec3baf4b36e119187ffc8eff449b13eafd8a3`.
- `src/simulation.js` SHA256 `c824114398d941db6cf393cf6671c66519e695acff5855590cd406e054a4a056`.
- `src/simulation_contracts.js` SHA256 `6dd71c3d5024d22767d8e26d19a22c614f0c71f2f3d1980196f5ed259d18b2af`.
- `src/simulation_effects.js` SHA256 `e64d422c240a78dfd94410fe73db7b8a95c785136369a5df41918670cc2e5db8`.
- `src/power_models.js` SHA256 `cbf6d86aea5cdfd1fda9bb39dddb208944c210e91c60196283f5ea731d3c23b7`.
- `src/energy_resources.js` SHA256 `cc619def4c618a7b7128c43c499864a4ccc306d5f54dc20660f15004bbbb55ef`.
- `src/native_gameplay_adapter.js` SHA256 `41900a2254f3db55fdf9ca8d59c6125ae2797947521756f319fe993f1b7ea8ad`.

Checkpoint: the brief owns the live specialist checkpoint. The inherited opening proof remains a proposed fixture, now stage 1 of the expanded campaign. Local document/link/coverage/evidence-vocabulary checks passed; every runtime/unit/build/browser/save/migration and human gate remains unrun. Verified design evidence: twenty reserved paths, 307 local links/ten anchors resolved, campaign coverage checked, no authored em dashes or trailing whitespace. Runtime acceptance remains unrun.
