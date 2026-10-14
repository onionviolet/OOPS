# B18 live code map

2026-10-14, dirty `codex/gameplay-foundations` main checkout. Read-only source inspection. `file:line` locators below are repository-relative entry points, not claims of browser execution. Other lanes' proposals are not live APIs. Recheck locators before implementation; other writers remain active.

## Requested source owners

| Source locator | Inspected behavior | Consequence for AB interfaces |
|---|---|---|
| `src/capabilities.js:4` | Nine source kinds include trait/bloodline and skill/equipment/knowledge/technique/condition/world/support. Physique/constitution are absent. | AB2 can use authoring family metadata and trait bindings initially. “Only trait and bloodline” is accurate only for the two relevant biological kinds, not the entire kind set. |
| `src/capabilities.js:15`, `src/capabilities.js:28` | Providers and grants require finite amount >0. Source grants may be empty. | AB8 costs/impairments cannot be negative capability grants. A decorative `grants:[]` card is not a new functional mechanic. |
| `src/capabilities.js:41`, `src/capabilities.js:53`, `src/capabilities.js:62` | Pure query skips expired and dormant/inactive/suppressed faculties; combines max/sum. Missing faculty does not block a legacy source. | AB2/AB3 wrap this authority. Query results include source IDs/labels and are not inherently observer-safe. |
| `src/expansion_engine.js:73`, `src/expansion_engine.js:136` | State has actor/world domains, sequence, played clock and legacy rng; schemas are admitted explicitly. | AB1/AB7 do not allocate parallel actors/worlds/clocks. Presence of an extra property is not complete runtime support. |
| `src/expansion_engine.js:198` | Source instances validate acquisition/expiry, origin, receipt, optional world/revision and registry membership. | AB2 stores a binding to this instance, not a duplicate source award. |
| `src/expansion_engine.js:303`, `src/expansion_engine.js:316` | Registry deep-freezes definitions and validates capabilities/sources. | Faculty/dial/ladder definitions need typed validators and explicit registry admission. |
| `src/expansion_engine.js:410`, `src/expansion_engine.js:484` | Capability inspection and action preview return derived facts, contributions and costs. | AB6/AB8 adapters join preview and commit; raw contribution labels cannot be sent to unknown-body UI. |
| `src/expansion_engine.js:502`, `src/expansion_engine.js:517` | Expansion source grant/remove is narrow; xorshift mutates state.rng. | Removing a source here must reconcile faculty references if a future unified path is added. AB11 keeps this legacy cursor. |
| `src/simulation_effects.js:106`, `src/simulation_effects.js:232` | Simulation body scalars become facts and body effects write those scalars. | AB1 native record must not overwrite simulation/host body authority. |
| `src/simulation_effects.js:110`, `src/simulation_effects.js:281` | Per-actor knowledge becomes requirement facts; equal/higher stage overwrites a same-key record. | AB5 needs distinct conflicting/versioned claim IDs and projection. No generic confidence, subject-field or fact-version owner currently exists here. |
| `src/simulation_effects.js:265`, `src/simulation_effects.js:278` | Inventory transfer conserves quantities; loan custody stores owner/holder/key/count/time/cause. | AB4/AB9 can wrap actual holdings. They must preserve equipped/borrowed restrictions and exact keys. |
| `src/simulation_effects.js:321`, `src/simulation_effects.js:326` | Faculty grant initializes independent booleans and development; remove deletes source/faculty. | AB3 is an orthogonal read model, not a six-value enum replacing current saved flags. |
| `src/simulation_effects.js:340`, `src/simulation_effects.js:358` | Power copy/transfer has donor/recipient semantics and optional mastery copying; titles grant/remove on an actor. | AB10 has a narrow existing transfer adapter. Actor title records do not implement CA4 office succession. |
| `src/components/bio_component.js:4`, `src/components/bio_component.js:11` | Four native bio fields, returned explicitly by getBio. | Unknown extra body fields will not serialize automatically. AB1 needs explicit accessor/save/load integration. |
| `src/character_bio.js:12`, `src/character_bio.js:16`, `src/character_bio.js:28` | Bio reads sources, awakening, body-visible conditions, observed techniques and training. | An endpoint for AB1/AB2/AB3/AB5; current filtering is not a general diagnosis/means projection. No CV1 implementation follows from this source. |
| `src/heir_inheritance.js:32`, `src/heir_inheritance.js:60` | Ended-life estate derives money/gear/chest/home/lessons/standing/obligations/debt; kin/apprentice recipient, lists capped at512. | AB4/AB10 must preserve current estate policy. These labels are not biological/soul lineage or exact individual identities. |
| `src/heir_inheritance.js:68`, `src/heir_inheritance.js:81`, `src/heir_inheritance.js:98` | Validates bounded leftovers, adds material estate into a fresh envelope, renders short lines. | Current helper is not an independently idempotent executor: applying twice adds twice. Durable offer/settlement authority is a future host requirement. |
| `src/cheat_cards.js:2`, `src/cheat_cards.js:32`, `src/cheat_cards.js:65` | Exact ten card keys, JSON-only nested data, grant clones a held record and runs no hooks. | AB2 faculty schema cannot be substituted for a C0 card. AB6 needs actual dispatcher/action binding. |
| `src/cheat_cards.js:85`, `src/cheat_cards.js:90` | Status eligibility/awakening and messages are distinct card state operations. | A body lens needs its own means and claims; awakening the existing card does not diagnose the body. |
| `src/status_window.js:7`, `src/status_window.js:23`, `src/status_window.js:41` | Existing panel reads native level/stats/titles/points, checks awakened card and refreshes every250ms. | AB5/AB12 feed an optional projection; refresh must not materialize, pay, roll or test. No body tab or generalized ladder is built. |
| `src/save_files.js:45`, `src/save_files.js:69`, `src/save_files.js:80` | Envelope validators dispatch optional domains, gate newer game versions, validate expansion. | Every selected AB owner needs explicit validation and a required-reader strategy. Older executables might silently drop unknown fields absent a version gate. |
| `src/save_files.js:81`, `src/save_files.js:168`, `src/save_files.js:196` | Streams validate; import decodes/validates, runs actual-loader preflight, then writes. | AB11 must roundtrip with outcomes; all new owner joins must reach preflight before storage. |
| `src/save_files.js:206`, `src/save_files.js:207`, `src/save_files.js:219` | Shared-origin 4MiB guard counts UTF-16 storage; UTF-8 measurement is separate. | Measure whole envelopes, not only standalone body JSON. Budget failure cannot delete truth or settled receipts. |
| `src/save_migration.js:3`, `src/save_migration.js:8`, `src/save_migration.js:14` | Pure cloned v0.6 prep supplies legacy bio defaults and migrates real kit counts. | Reuse before B2 normalization. It does not implement body_record, lineage, claims or office migration. |

## Additional seams needed to avoid a parallel owner

| Locator | Why it matters |
|---|---|
| `src/seeded_streams.js:5`, `src/seeded_streams.js:23`, `src/seeded_streams.js:38` | Named stream families/root/cells/log already exist; ensureStreams lazily initializes. Body-specific namespace names from B6/B11 are unsupported today. |
| `src/seeded_streams.js:47`, `src/seeded_streams.js:56`, `src/seeded_streams.js:59`, `src/seeded_streams.js:70` | Pure keyed decision, generator-root derivation, bounded log and cursor draw are different operations. streamSeed can mutate through ensureStreams. keyedUnit also writes log and uses current cell salt. |
| `src/main.js:2`, `src/main.js:3`, `src/main.js:4215`, `src/models/combat.js:80` | Mixture/person generator roots, native craft and combat already consume named streams. AB11 reuse has real consumers. |
| `src/main.js:5361`, `src/main.js:5364` | Loader restores expansion then ensures streams from saved rng or documented fallback1. This is current fallback policy, not recovery of a missing historical root. |
| `src/body_progression.js:15`, `src/body_progression.js:25`, `src/body_progression.js:65` | Existing innate/trained/acquired sources, evidence-qualified directed disclosures and body-condition facts. Useful AB2/AB5/AB6 comparison content. |
| `src/expedition_content.js:89`, `src/expedition_content.js:92` | Packing reads hand control/tenderness, with subtract/add duration modifiers and paid commitment. Real AB8 effect destination. |
| `src/simulation_contracts.js:85`, `src/simulation_contracts.js:249`, `src/simulation_contracts.js:253` | Knowledge basis, string stage/value/time/cause and faculty flags have exact validators. New typed claims/damage cannot bypass them. |
| `src/causal_situations.js:52` | Knowledge basis already distinguishes observation/recollection/instruction/inference and attribution/context. Extend it rather than create another unrelated basis enum. |
| `src/world_instances.js:54`, `src/world_instances.js:56` | World definition fields are closed; “put dials in world data” still needs a validator/schema decision. |
| `src/realm_boundary_rules.js:47`, `src/realm_boundary_rules.js:69`, `src/realm_boundary_rules.js:100` | Existing typed boundary rules, physical/evidence context and supported operating sources. AB6/AB7 adapt this support, not genre labels. |
| `src/config.js:37`, `src/config.js:38`, `src/main.js:2143` | Racial/height effects default off; address still reads gender/legacy age. AB1/AB7 need explicit native integration. |
| `src/main.js:2827`, `src/main.js:4238` | Native sleep recovery and craft success are actual AB8 targets; a new body modifier is not yet integrated at them. |
| `src/main.js:5006`, `src/main.js:5431`, `src/main.js:8392` | Explicit bio serializer, native bio load access, status read wiring. New owner fields and projected body rows need all these boundaries. |
| `src/life_experience_host.js:11`, `src/life_experience_host.js:20`, `src/life_experience_host.js:23` | Heir is built from fresh envelope, expansion is recreated from old rng with clock0, estate is applied. It does not retain a general body/lineage/world/stream history. |
| `src/main.js:1644`, `src/main.js:1650`, `src/main.js:1658` | Existing end dialog derives a request, stores it, then reconstructs through full import/preflight. New frozen generalized offers must join this real host. |
| `src/village_career.js:2`, `src/village_career.js:92`, `src/village_career.js:145` | Real rank names/earned promotion and teacher-to-Iona knowledge state. AB12 labels and AB10 teaching can adapt them without a new XP store. |
| `src/power_models.js:5`, `src/power_models.js:10` | Mastery bands affect capacity/cost; they are not universal fictional ranks or potential ceilings. |

## Consumer test per AB

“Target” means an existing source consumer that could receive the proposed interface. No new AB interface is implemented. Storage, decorative prose and a new proposed feature do not count as independent playable consumers.

| AB | Two actual targets, or premature result | Smallest valid claim |
|---|---|---|
| AB1 | Bio view + native address; save writer additionally | A native body/person reader has real targets. Full anatomy/NPC generation stays premature. |
| AB2 | Packing duration + bio source explanation | Shared definition/binding adapter has action and view targets. Per-instance executable source engine stays premature. |
| AB3 | Capability query + simulation eligibility facts | Reader over existing flags earns reuse. Located damage needs its own selected consumer. |
| AB4 | Estate distribution + custody transfers | Material carrier read adapter earns reuse. General soul/office dispositions remain premature. |
| AB5 | Knowledge-driven command predicates + directed body disclosures; bio/status presentation endpoints | Claim read/projection contract earns reuse. Retcon truth ledger requires a selected continuity slice. |
| AB6 | Body disclosure commands + realm supported-source/evidence checks | Eligibility/evidence adapter earns reuse; universal appraisal/diagnosis executor is premature. |
| AB7 | Native body bonus selectors + realm boundary support | Typed profile adaptation has targets. General comic laws lack selected live readers. |
| AB8 | Packing + native sleep; craft additionally | Narrow cost/modifier adapters have real consumers. Most B12 causes are still missing. |
| AB9 | Generic item consume/custody machinery only; proposed assay/edit excluded | PREMATURE general sample system. Implement only local lot/unit semantics for a selected B11 loop. |
| AB10 | Estate papers/apprentice + Watchcraft teaching; power transfer additionally | Narrow policies can share a planning vocabulary. PREMATURE general biological/clone/soul executor. |
| AB11 | Generated people/mixtures + native combat/craft | Reuse existing stream service; body slot/cause binding needs implementation. |
| AB12 | Career rank labels + status native level display | Read-only ladder adapter possible. PREMATURE fuzzy assessment runtime until selected CV5/CC1 output exists. |

G78's one-playable-slice gate remains OPEN for every proposed new interface. Existing source consumers are evidence of a fitting seam, not new gameplay acceptance.

## Final inspected source fingerprint

SHA-256 of read source bytes at locator refresh. These identify a local source snapshot only, with no bundle/runtime claim. main.js moved during concurrent work; its cited lines were refreshed to this snapshot.

| File | SHA-256 |
|---|---|
| `src/capabilities.js` | `c72b4c32d26ffb4988e970e6aa849498e3fb79e5bd987b7ab86d449a15322b35` |
| `src/expansion_engine.js` | `da1e9761400bec1cf72f4da171408f22af6cb6a2ce3dd72565b8b29039ab3f82` |
| `src/simulation_effects.js` | `507a5a60b82eaade331601c90f5e98410a2d99486903b9109937f933f3ffe151` |
| `src/components/bio_component.js` | `0052ccd0884597ff4a490bdc29445b07d2d88147f5f71b58da2db52a2888c975` |
| `src/character_bio.js` | `f6dc97c32f651734fb1984df7a93b9c44b42b1078380b7df51a1b670c8dd959a` |
| `src/heir_inheritance.js` | `41c510b1ceb72e39620ea97c5c9f0a3763604a4dd329de5a5b8cccbc5fc4370f` |
| `src/cheat_cards.js` | `8ca52e83187845d8da7bdb11d5ba96befe81bd3f2ebbe932f0c664f8140273d4` |
| `src/status_window.js` | `7f26cc81f03ebc3549fc35ea191196c148f83aa5ddf18101a6d6f954ecc9d641` |
| `src/save_files.js` | `9b87a732f2cb18abfd9e4225fa546203fed0b5d6e544e1284af01b2f61f16e6a` |
| `src/save_migration.js` | `feb8d7c31aad7a2793e75e2aa455af89f87ec101ab4e1b42cd3da2379988689f` |
| `src/seeded_streams.js` | `db2a19d956515eab816f7df7ca13ffc11d08797de61a583811f92254c46b7610` |
| `src/main.js` | `81a8b6130efe5560e456c25840ae6ec035666ecf92efdcd133de620183c0ba16` |
