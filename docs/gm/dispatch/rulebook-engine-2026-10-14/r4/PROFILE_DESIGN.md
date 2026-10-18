# R4: profiles, cross-world acts, combat and time

2026-10-14. **Design proposal only.** No runtime, source, save, build or browser
change. R4 codes extend the root's MV, EP, EC and EA codes without replacing
them. SHOWN means read in the named source, INFERRED means proposed YAIR
behavior, UNKNOWN means not established by this pass. A SHOWN source rule is
not implemented gameplay. All unmarked schema examples below are INFERRED.

## R4-F1. Authority and scope

SHOWN: [COMMON](../COMMON.md) assigns only this folder to R4. The root's
MV1-MV20, EP1-EP10, EC1-EC9 and EA1/4/5/10/11/13/14/15 are the task inputs.
[PROJECT](../../../../../PROJECT.md), [USER_VISION](../../../../USER_VISION.md),
[MULTIVERSE_STRUCTURES](../../../../worlds/MULTIVERSE_STRUCTURES.md) and
[tabletop considerations](../../../../research/tabletop-library-2026-10-14/DESIGN_CONSIDERATIONS.md)
keep setting, cosmology and rules independent. Learned functions persist;
their actual carriers, supplies and contact still matter. First-slice order,
one-prestige scope and existing native acceptance gaps stay as recorded there.
This note selects no new world or accepted mechanic.

INFERRED UI target: 1366x768 laptop, with 1440x900 as a useful secondary
desktop check. A future visible slice shows current activity and known world
rules beside ability/function details, with a concise result receipt. Mobile,
general tactical geometry, full SRD coverage and autonomous absent worlds are
deferred. This document supplies no rebuilt UI evidence.

SHOWN: the [abstraction inventory](../../../../research/ABSTRACTION_INVENTORY_2026-10-14.md),
AB10-AB12 and ER18-N1-N9, rejects treating a definition as a mutable instance,
information as cargo, or appearance settings as laws. Those distinctions are
preserved throughout this schema. Research and source reading are bounded;
neither selected rulebook was read in full here.

## R4-F2. What the existing seams actually admit

| ID | Label | Readback and design consequence |
|---|---|---|
| R4-F2a | SHOWN | `src/rule_modules.js:40-57` strictly admits schema 1 modules, only resolver `village.mix@2`, five module kinds, three channels and bounded effects. `RULE_FACTS` and the one parameter target are at lines 12-13. A d20 module, new `ruling` kind, zone field or new damage target is not accepted today. |
| R4-F2b | SHOWN | `src/rule_modules.js:60-86` matches route plus exact world/instance/continuity scope, then requirements and tag roles. Line 83's candidate bucket has those three scope keys. Zone support needs both admission and indexing work, not a field added to JSON alone. |
| R4-F2c | SHOWN | `src/rule_modules.js:88-94` orders priority by layer, depth, value, specificity, order, and creates a lock containing the sorted full modules, refs and fingerprint. It does not include the tag registry, profile, fact vocabulary or interpreter implementation. The fingerprint is a reproducibility check, not a security signature. |
| R4-F2d | SHOWN | `src/rule_modules.js:97-113` returns detached proposals. Priority chooses parameter replacement; equal-ranked unequal replacements throw. Vetoes remain unless an exemption names the exact effect and supplies its boolean source fact. A higher layer does not automatically defeat a gate. Permission does not invent missing means. |
| R4-F2e | SHOWN | `src/world_instances.js:54-77,97-111` has strict definition/instance field lists. Its clock supports played minutes with frozen absence. Arbitrarily adding `profile` or `laws` there would fail admission. |
| R4-F2f | SHOWN | `src/realm_traveler_profiles.js:245-259,285-300,330-347` keeps identity/method/source/pool references and checks actual support. Its preview explicitly says `nativeExecutable:false` at line 247. `src/power_models.js:3-43` calculates scope and cost for practice, design, investment, authority and hybrid powers without fictional rank conversion. Reuse those owners. |
| R4-F2g | SHOWN | `src/rules.js:1-29` is pure, missing-aware evaluation. `src/gen_kit.js:16-45,59-77` supplies canonical addresses, hash/draw helpers and integer bucket mapping. Neither is a reward writer. Draws for the proposal follow GR1-GR17, including the generation owner's later correction that legacy roots must not be silently replaced. |

INFERRED seam plan: use a profile/pack wrapper around existing module locks,
as [R1's remit](../R1.md) proposes. Names here are design vocabulary, not an
assertion about R1's eventual API. Keep schema 1 module validation and its
legacy consumer intact. Any broader module interpreter or zone compiler needs
one designated seam owner and an explicit new version. Do not build a second
rule precedence system inside the combat or travel adapter.

## R4-P1. Profile record schema

A `ProfileRecord` is immutable author data. `Ref` means a namespaced ID plus
positive integer revision, rendered `id@rev`; a source edition is a separate
string. All numbers used in addresses are safe integers or explicit rational
records. Reject extra fields, duplicate IDs, unknown units and unregistered
families before admission. References must resolve to frozen records with
executable readers for the selected slice. They cannot contain JS callbacks.

| Field | Required type and meaning |
|---|---|
| `schema`, `id`, `revision` | `1`, stable ID, positive integer. This is a proposed wrapper schema, not module schema 1. |
| `basis` | `{sourceId, edition, locators[], adaptationRef}`. Exact edition and selected scope. `adaptationRef` lists deliberate YAIR departures. Never infer a cosmology from these fields. |
| `resolution` | `{ref, family, dice, targetRule, degreeRuleRef, criticalRuleRef, opposedRuleRef}`. `dice` is `{count,sides,selection}` or null for a non-dice family. Each use names `checkKind` such as attack, save or ability, so attack criticals do not become universal skill criticals. |
| `progression` | `{ref, unit, awardPolicyRef, settlementPolicyRef, retentionPolicyRef}`. Unit enum: `xp`, `use_mark`, `career_step`, `point`, `study_period`, `tier`. A policy says what grants it, when it settles and which owner receives it. No conversion by equating numbers. |
| `law` | `{ref, modulePackRefs[], crossingPolicyRef, discoveryPolicyRef}`. Scope-qualified permission, means, interaction and consequence records. Physics, institutional permission and knowledge remain distinct channels. |
| `scale` | `{classRef, contactPolicyRef}`. The default class for this world's ordinary actors; each actor/effect may have its own explicit class. Neither world size nor level is a scale class. |
| `time` | `{ladderRef, defaultRung, conversionPolicyRef}`. Rung enum: `round`, `turn`, `scene`, `day`, `season`, `year`; an action duration may also use `second`, `minute`, `hour` or `week`. Rungs require the typed semantics in R4-T1, not one universal multiplication table. |
| `combat` | `{modelRef, actionPolicyRef, recoveryPolicyRef, consequencePolicyRef}`. Model examples: `legacy.auto`, `timed.tabletop`, `aggregate.declared`. Consequences distinguish defeat, fainting, injury and death. |
| `procedures` | `{directorPolicyRef, trackPolicyRefs[], tablePackRefs[]}`. Optional references may be null or empty. These connect EP6/7/8; a profile does not create an unrelated director, clock store or tag deck. |
| `packs` | `Ref[]`. Manifest dependencies loaded for this world, with revision, content fingerprint and per-record licence provenance. Lazy-load before first use; missing content never means substitute the latest. |
| `licence` | `{tier, licenceId, noticeRef, sourceRefs[]}`. Tier enum: `open_notice`, `share_alike`, `reference_only`. The enum is an admission/routing category, not a legal conclusion. Per-pack/per-record grants control what ships. Mixed provenance cannot inherit the most permissive record's tier. |
| `budget` | `{checksPerChunk, drawsPerCheck, receiptLimit, overflowPolicyRef}`. Positive safe integers with explicit validation limits. Overflow pauses work or carries it forward; it never awards guessed results. |

INFERRED EA1 extension route: register families by executable ID. Start with
`sum_target` and `roll_under` for these examples. Pool, step-die, symbol, card,
spend and rank/bid families remain reachable when a consumer needs them. Do
not pretend that switching a `family` string implements their semantics.
Numberless profiles use native ranks and declared comparison policies; do
not invent a universal numeric character sheet for them.

### R4-P2. Binding the record to the rule lock

INFERRED: save a sidecar `rulebookState`, separate from the strict existing
world-instance record. The future persistence owner must admit it through the
actual save envelope. Until then it is only this design shape:

```text
rulebookState = {
  schema: 1,
  bindings: { [instanceId]: ProfileBinding },
  actors: { [actorId]: ActorProfileState },
  knowledge: { [observerId]: RuleKnowledge },
  jobs: { [jobId]: ProfileJob },
  encounters: { [encounterId]: TimedEncounter },
  replay: ReplayState,
  migrationEvents: []
}
ProfileBinding = {
  worldId, instanceId, continuityId, eraId,
  profileRef, profileLock, zoneBindings, lawEvents, timeBridge
}
profileLock = {
  schema: 1, profileSnapshot, legacyModuleLocks, extensionPacks,
  interpreterRefs, registryRef, factVocabularyRef,
  dependencySnapshots, fingerprint
}
```

`legacyModuleLocks` contains unaltered `createRuleLock` values only for modules
that actually pass its schema 1 validator. `extensionPacks` contains versioned
profile/ruling/interaction records admitted by the wrapper. A future extended
module pack must name its own validated interpreter; it cannot masquerade as
`village.mix@2`. Null/empty legacy locks are valid for a new non-mixture profile.

The wrapper fingerprint covers canonical full snapshots, dependency revisions,
registry semantics, units, fact vocabulary and interpreter refs. A reference
without recoverable immutable content is insufficient. Snapshot data plus a
retained interpreter version is required for replay. Pack code is never saved
as executable text. A missing interpreter pauses affected new-profile actions
with a compatibility reason; it cannot run an updated resolver on old data.

`zoneBindings` maps actual represented zone IDs to scoped law/crossing refs.
`lawEvents` records accepted runtime changes with old/new lock references,
source authority and effective game time. `timeBridge` retains only conversion
remainders/watermarks; existing clock owners remain authoritative.

Freeze the profile when an instance is created or explicitly adopts profiles,
even if its rules are still unknown to the player. Do not regenerate on entry,
travel, reveal, reload or content update. Shared cluster defaults are authoring
inputs expanded into each binding, not mutable pointers that rewrite worlds.

### R4-P3. Two worked profiles

The IDs and policy implementations below are illustrative. Both records use
every field defined in R4-P1; referenced policies are described below. No claim
is made that these values pass an existing runtime validator.

```json
{
  "schema": 1, "id": "profile.srd521.pilot", "revision": 1,
  "basis": {"sourceId": "srd521", "edition": "5.2.1", "locators": ["Playing the Game/D20 Tests", "Character Creation/Level Advancement", "Rules Glossary/Short Rest", "Rules Glossary/Long Rest"], "adaptationRef": "adaptation.srd521.pilot@1"},
  "resolution": {"ref": "resolution.srd521@1", "family": "sum_target", "dice": {"count": 1, "sides": 20, "selection": "normal"}, "targetRule": "total_gte_target", "degreeRuleRef": "degree.srd521.by_check_kind@1", "criticalRuleRef": "critical.srd521.by_check_kind@1", "opposedRuleRef": "opposed.srd521.by_action@1"},
  "progression": {"ref": "growth.srd521@1", "unit": "xp", "awardPolicyRef": "award.srd521.authored@1", "settlementPolicyRef": "settle.srd521.level@1", "retentionPolicyRef": "retain.earned_functions@1"},
  "law": {"ref": "law.srd521.pilot@1", "modulePackRefs": ["pack.srd521.pilot_laws@1"], "crossingPolicyRef": "crossing.srd521.place@1", "discoveryPolicyRef": "discovery.rules.evidence@1"},
  "scale": {"classRef": "scale.srd521.ordinary@1", "contactPolicyRef": "contact.srd521.pilot@1"},
  "time": {"ladderRef": "time.srd521@1", "defaultRung": "round", "conversionPolicyRef": "bridge.srd521.joined@1"},
  "combat": {"modelRef": "timed.tabletop@1", "actionPolicyRef": "action.srd521.round_budget@1", "recoveryPolicyRef": "recovery.srd521.rests@1", "consequencePolicyRef": "consequence.srd521.pilot@1"},
  "procedures": {"directorPolicyRef": null, "trackPolicyRefs": [], "tablePackRefs": []},
  "packs": ["pack.srd521.pilot@1"],
  "licence": {"tier": "open_notice", "licenceId": "CC-BY-4.0", "noticeRef": "notice.srd521.required@1", "sourceRefs": ["source.srd521.official@1"]},
  "budget": {"checksPerChunk": 256, "drawsPerCheck": 32, "receiptLimit": 128, "overflowPolicyRef": "budget.pause_and_resume@1"}
}
```

SHOWN source basis: SRD 5.2.1, D20 Tests and Advantage/Disadvantage, printed
pp. 6-7; Combat order, p. 13; Critical Hits, p. 16; Level Advancement, pp. 23-24;
Short/Long Rest, pp. 187/185. Local text:
`docs/research/tabletop-library-2026-10-14/private/text/dnd-srd-521.txt`.
A D20 Test adds modifiers and compares against its target. Advantage uses the
higher of two dice; disadvantage uses the lower. Attack 1/20 handling is
check-specific. The official [SRD release page](https://www.dndbeyond.com/srd)
and the PDF's Legal Information identify the CC-BY-4.0 grant. Future shipped
SRD data must carry its exact required notice; R2 owns that notice/data work.

INFERRED worked check: attack bonus +5 against AC 15 needs 10-20, giving
11/20 = 55%; advantage gives 319/400 = 79.75%. A normal example die 12
produces 17, a hit. Natural 20 uses the attack policy, not a universal
double-output modifier. Ability checks do not inherit attack auto-success or
auto-failure. Basic degrees are success/failure with critical-hit annotation;
margin is recorded for explanation, with no invented graded benefit.

INFERRED progression/law: an authored encounter award of 50 XP at 280 total
would produce 330 and reach the SRD level-2 threshold of 300. The reward amount
is this example's fiction, not an SRD universal award. Level choices requiring
input pause settlement; a new body does not receive duplicated XP. The pilot
law pack binds supported spell prerequisites, targets and effects only. Local
institutions can still forbid casting without making it physically impossible.
`adaptation.srd521.pilot` explicitly excludes automatic adoption of survival,
malnutrition or lethal offline rules. Comfortable ordinary unfed play and the
accepted food direction remain authoritative. This is a selective SRD pilot,
not an assertion that the entire SRD is enforced.

```json
{
  "schema": 1, "id": "profile.brp2025.learn_use_pilot", "revision": 1,
  "basis": {"sourceId": "brp.quickstart.2025", "edition": "2025 quickstart", "locators": ["System/Skill Rolls", "System/Critical Success", "System/Experience and Advancement", "Time/The Combat Round", "Combat/Healing"], "adaptationRef": "adaptation.brp.original_growth@1"},
  "resolution": {"ref": "resolution.brp2025.pilot@1", "family": "roll_under", "dice": {"count": 1, "sides": 100, "selection": "normal"}, "targetRule": "roll_lte_skill", "degreeRuleRef": "degree.brp2025.pilot@1", "criticalRuleRef": "critical.brp2025.pilot@1", "opposedRuleRef": "opposed.brp2025.quickstart@1"},
  "progression": {"ref": "growth.brp.original@1", "unit": "use_mark", "awardPolicyRef": "award.meaningful_success@1", "settlementPolicyRef": "settle.original.review@1", "retentionPolicyRef": "retain.earned_functions@1"},
  "law": {"ref": "law.original.percentile_town@1", "modulePackRefs": ["pack.original.percentile_town_laws@1"], "crossingPolicyRef": "crossing.percentile_town.place@1", "discoveryPolicyRef": "discovery.rules.evidence@1"},
  "scale": {"classRef": "scale.brp.ordinary@1", "contactPolicyRef": "contact.percentile_town.pilot@1"},
  "time": {"ladderRef": "time.brp2025@1", "defaultRung": "turn", "conversionPolicyRef": "bridge.brp2025.joined@1"},
  "combat": {"modelRef": "timed.tabletop@1", "actionPolicyRef": "action.brp2025.pilot@1", "recoveryPolicyRef": "recovery.brp2025.pilot@1", "consequencePolicyRef": "consequence.percentile_town.pilot@1"},
  "procedures": {"directorPolicyRef": null, "trackPolicyRefs": [], "tablePackRefs": []},
  "packs": ["pack.brp2025.reference@1", "pack.original.percentile_town@1"],
  "licence": {"tier": "reference_only", "licenceId": "not_admitted_for_shipping", "noticeRef": null, "sourceRefs": ["source.brp2025.quickstart@1"]},
  "budget": {"checksPerChunk": 256, "drawsPerCheck": 32, "receiptLimit": 128, "overflowPolicyRef": "budget.pause_and_resume@1"}
}
```

SHOWN source basis: [Chaosium 2025 quickstart](https://downloads.chaosium.com/basic-roleplaying/cha2040-brp-quickstart/CHA2040_Basic_Roleplaying_Quickstart.pdf),
printed pp. 17-18, Skill Rolls/Critical Success; p. 20, Experience and
Advancement; p. 21, Time; p. 27, Healing. Local prepared text is
`docs/research/tabletop-library-2026-10-14/private/text/brp-quickstart.txt`.
Percentile checks succeed at or below skill, criticals at one tenth rounded
up. Successful use can lead to advancement at adventure end; the full method
is referred elsewhere. Rounds last 12 seconds; exploration turns five minutes.

INFERRED worked check: skill 60, die 42 succeeds; 01-06 are critical, 61-100
fail in this bounded ordinary check. Unlike the SRD example, this is a
threshold skill, not a bonus against AC. The unsupported policy for special
fumble boundaries, extreme skill values or unencoded conflicts is
`needs_ruling` before committing that action, rather than guessing another
BRP edition's rule. This sample is not full BRP combat conformance.

INFERRED learn-by-use procedure, deliberately original: one meaningful
successful craft sets a skill use mark for the current authored review period.
Repeated identical safe work does not multiply that period's mark. At a paid,
eligible review job, roll d100 above the current rating to gain +1 rating;
otherwise retain the rating. At rating 60, a review die 72 gives 61 and settles
the mark. Further review periods remain possible; this is no global once-only
limit. Automatic routine successes do not qualify unless that local policy
explicitly permits them. No XP-to-mark conversion or global 100-point cap is
imposed. UNKNOWN: the full source advancement procedure and its high-skill
edge cases have not been inspected; this invented settlement must be visibly
named as such or replaced after the owning book deep dive.

INFERRED law/licence: the town's laws and crossing adapters are original, not
claims about a canonical BRP universe. `reference_only` is this sample's
current shipping admission. SHOWN: [Chaosium's ORC page](https://www.chaosium.com/orc-license/)
offers a separate Universal Game Engine licensing route. That does not
establish that this quickstart's every record has been cleared. UNKNOWN:
pack-specific grant/notice mapping. A separately verified open or share-alike
pack remains reachable; no proprietary text or tables are copied here.

## R4-X1. MV5 declaration and decision order

INFERRED `CrossingPolicy` is frozen author data referenced by a world's law
profile or a zone override:

```text
CrossingPolicy = {
  id, revision, scope: {worldId, instanceId, continuityId, zoneId},
  mode: place | traveler | raw,
  lawRef, translationPackRef, interactionPackRef,
  growthPolicyRef, discoveryPolicyRef
}
```

`zoneId:null` means the represented instance default; it is not permission to
use the policy in every world. A cluster may supply an authoring default.
Actor cheats select explicit scoped overlays, never a silent global mode
toggle. Policy application records the source endpoint, target endpoint,
actor/body/ability refs, applicable zones and lock identities. A remote act
can cross two endpoints without moving the actor.

| Mode | INFERRED operational meaning | What it does not supply |
|---|---|---|
| `place` | The target/place law decides supported interaction. Read the foreign ability's function and use the local resolver via a declared adapter. | Automatic knowledge erasure, a free local skill rating, fuel, bodily support or permission. |
| `traveler` | MV5's translation model: retain the traveler and native sheet, select a declared temporary local expression, resolve through that expression's local check rules. Its binding names source, local form, paid setup and reversion policy. | Merely rolling the home die forever; forced permanent replacement of the earned ability; conversion of every companion as a group. |
| `raw` | Execute native checks and resources through the origin profile; use an explicit cross-profile contact adapter to apply the result to the target. | Comparing unrelated HP, ignoring target wards, or resolving two incompatible defense engines with no stated order. |

All three remain reachable per cluster/zone. A missing converter is a known
coverage gap, not evidence that the foreign ability is metaphysically invalid.

INFERRED resolution order has five stages:

1. **R4-X1a:** bind real endpoints and locks, then check actual carrier, learned
   function, source contact, range, target and resource ownership. Keep N6's
   information, projection, inheritance and bodily travel distinct.
2. **R4-X1b:** collect scoped local laws and relevant personal modules. Resolve
   physics, institution and knowledge through the shared module semantics.
   A legal permit cannot cure absent fuel. A cheat exemption must name its
   source and exact blocked effect, as in R4-F2d.
3. **R4-X1c:** select mode, expression and contact rule. Resolve scale contact
   before subtracting damage. Contact declares unsupported, same-scale,
   explicit conversion, immunity, threshold, or a rule effect such as banish.
   Numerical cross-scale coefficients are per interaction, never inferred
   from franchise reputation, level or world size.
4. **R4-X1d:** quote the same resolver snapshot used by commit. Address draws by
   world/instance/continuity/life, encounter or job, game-time event ordinal,
   actor ID, target ID, purpose and explicit attempt. Peeks/canceled quotes
   cannot spend resources or advance attempts. Never use render/tick/chunk
   indices or wall time as randomness keys.
5. **R4-X1e:** atomically publish costs, outcome, progression event and receipt
   under the existing transaction/persistence owner. Revalidate a stale quote.
   A duplicate event returns its settled result. A failure before publication
   retains state; an error after durable publication must restore/read the
   committed result rather than refund and invite replay (ER18-N5).

### R4-X2. Status window and discovery

SHOWN: `src/status_window.js:8-16,28-40,48-54` currently gates the window on an
awakened status card and shows level, five stats, titles, points and quests.
It has no world-profile or crossing read model. The proposed rows are new UI.

INFERRED: once known, show `Here: local rules`, `Here: translated traveler
rules`, or `Here: native powers, mixed contact rules`. Under an ability show
`Home sheet`, `Used here`, actual source/cost and any known limitation.
For mixed parties, each member retains a native sheet and gets an individual
effective-function view. A known zone crossing updates the row before a paid
choice; an undiscovered change never displays hidden rule truth.

Unknown rules read `Local interaction not yet understood`; known unsupported
coverage reads `This interaction needs a ruling`; a discovered missing
material reads its actual reason. No hidden source names, exact sealed truth,
raw profile IDs or author diagnostics leak through denial text. The engine
always uses truth; unknown knowledge never means use a random/default law.

Rules learned without a System remain available in an ordinary known-world
panel; the cheat's numeric window remains conditional on its own capability.
Numberless worlds show ranks/qualitative knowledge unless a supported personal
System supplies numbers. The author-only EP10 inspector may read locks,
full reasons and exact odds, but is never the player panel's backing projection.

### R4-X3. Three worked cases

Every value below is an INFERRED test fixture, not a canonical conversion.
The Fire Bolt home basis is SHOWN in SRD 5.2.1 p. 132: ranged spell attack,
instant fire effect, native damage die and casting prerequisites. This case
uses an early-level caster with a real learned method and bodily support.

| ID / act | Place rules | Traveler rules | Raw |
|---|---|---|---|
| R4-X3a / D&D Fire Bolt in the percentile town | Adapter explicitly supplies local spell-control 60 from a retained function assessment, not `+5 = 60`. Die 42 succeeds. A declared local fire-impact record produces 4 local wound units before the target's native mitigation. No home die or second home damage roll. Status: `Local check: 60%; home spell retained`. | Translation binding supplies a local ember technique at 55, preserving its link to Fire Bolt. Die 42 succeeds; local cost/effect and 12-second action apply as declared. The original entry remains on the native sheet; leaving removes this expression, not the learning. Status: `Translated ember technique: 55%`. | Home bonus +5, die 12 gives 17 against an explicitly supplied cross-contact AC 15; native damage example 7. Contact record `fire.srd_to_town@1` declares 1:1 into this target's local wound units, then local armor policy acts. That coefficient applies only to this supported ordinary-scale interaction. Status: `Native spell check; local fire contact`. No contact record means needs ruling before payment. |
| R4-X3b / craft learned in A, used in B | Retain the joinery method and its acquisition receipt. B's supported tools/materials permit the function; a local assessment grants 60 for this task. Die 42 repairs one paid damaged cart component. Local use-mark growth follows B. | A declared local workshop expression may supply a 55-rated technique with actual available tools. It does not duplicate the original workshop or grant a guild licence. The repair changes the same cart's state; reverting preserves the original learning. | Keep native +5 vs authored DC 15; die 12 succeeds. Contact record verifies that B's material and joint geometry support the method, so a function result repairs the component. No damage-scale mapping is needed. A missing saw still blocks actual means. |
| R4-X3c / personal System cheat | Scoped actor `cheat_overlay` keeps its personal point growth while ordinary NPCs use marks. It only bypasses a named local veto when its acquired source grants that exemption; point ownership is not enough. | Translate the surface to a local ledger while preserving its real point pool and source. A translation cannot create a second spendable balance or grant the System to companions. | Native System progression remains native; world interactions still pass contact and source checks. It can be fully universal only where its authored capability actually says so. No automatic exemption follows from the word cheat. |

For R4-X3c, an illustrative paid review event awards 2 personal points through
the cheat's own policy. A copied display log awards nothing. The growth policy
names whether that same event also marks a local skill: this sample allows
both distinct ledgers but no double credit within either. A point-spend costs
from one actual pool and is settled once. NPC travelers with the same source
use the same rules. These cases support broad powers without a universal tax,
slot limit or daily charge invented by the engine.

### R4-X4. Generated laws and converged zones

INFERRED EA13: author a candidate law with acquired authority, jurisdiction,
target domain, effective duration and cost. Admit through the same validators
and budgets as authored packs. Record the source-qualified accepted event,
publish its new lock revision and keep prior snapshots for pending work/replay.
A preview cannot write law truth. Existing profile locks are never mutated in
place to hide the change. An in-fiction law change is distinct from a patch.

INFERRED EA14: a converged district selects region-scoped modules using the
existing layer/depth/value/specificity/order semantics. For a new `zoneId`, the
wrapper first resolves the represented zone to its region context or a new
versioned scope compiler includes it in matching and candidate indexing.
No claim is made that today's validator already accepts it. Equal-priority
incompatible replacements fail admission/need a ruling; gates compose and
named exemptions work as R4-F2d. An outgoing actor zone cannot automatically
override the target's zone law. Interaction records declare applicability to
source/target/both, so a seam-straddling effect has one ordered resolution.
Which institutions retain jurisdiction after a merge is authored world data.

## R4-C1. Combat mapping, EA4

| ID | Label | Upstream read and consequence |
|---|---|---|
| R4-C1a | SHOWN | `src/combat_math.js:1-24,29-58` has a nonlinear hit formula, damage spread, mitigation, shield/evasion and critical helpers. `src/models/combat.js:420-495` uses base damage plus its own strike path; it does not call the whole `rollCombatStrike` helper. Do not stack this hit curve and a d20 attack on one swing. |
| R4-C1b | SHOWN | `src/combat_stances.js:14-44,59-74,87-162` defines stamina, stat multipliers and target counts, scaled by skill. Actual targeting/stamina are chosen in `src/models/combat.js:194-245`. Source data is not proof every declared multi-target stance is applied exactly as described. |
| R4-C1c | SHOWN | `src/models/combat.js:154-170,248-297` derives cooldowns from inverse attack speed, scales the fastest base cooldown to at least one second, then progresses a swing through 60 timer callbacks with drift correction and tickrate. These are scheduler/UI details, not 60 tabletop turns or a world calendar rule. |
| R4-C1d | SHOWN | `src/models/combat.js:80-109,254-255` saves encounter key, per-side turn counters and pending loop inputs/counts. The keyed decision also includes target and purpose. `snapshot` excludes special/actionAdapter battles at line 86. Those seams do not establish a generic saved tabletop encounter. |
| R4-C1e | SHOWN | `src/models/combat.js:300-338,350-355,379-411,531-562` interleaves hooks, XP, actionAdapter, fainting, death hooks, loot and kill progress. `actionAdapter` bypasses the native strike body but not all scheduling or stance XP. Neither it nor `is_special_combat` is a drop-in tabletop mode with equivalent rewards/persistence. |

INFERRED retain `legacy.auto@1` as today's domain model. A new profile opts
into `timed.tabletop@1`, a pure event resolver plus a scheduler/presentation
adapter and domain-specific settlement. Reuse detached math only where its
meaning matches. Native health/skill/item owners receive staged effects once;
no second full actor, inventory or battle reward system is created.

INFERRED mapping: a tabletop turn becomes an actor decision slot, not a
cooldown measured by the browser. Save initiative order and turn/round
ordinal. Within a declared round, action/movement/bonus/reaction allowances
come from the edition's action policy. Show cast/windup bars over those slots.
A reaction is an interrupt linked to its triggering event and own allowance;
extra attacks are subactions, not extra whole turns. Haste, delay, conditions,
concentration, end/start-of-turn effects and death checks need explicit events.
An unencoded rule pauses before the dependent action rather than becoming
normal attack damage.

For the faithful SRD pilot, one round accounts for six fictional seconds total.
Three participants taking their turns do not cost eighteen seconds. Freeze
initiative; draw ties only by the declared tie policy. Use ordered subslots
inside the round for display and effect ordering, then advance its one time
boundary. Action speed controls presentation or a declared feature, not the
number of SRD turns. A later free-speed ATB variant can schedule
`nextReady = logicalNow + actionDuration/speed`; give it a separate action
policy/adaptation revision, since that changes tabletop action economy.

INFERRED example: saved initiative A=17, B=11. In round 8, A commits one spell
action, B gets its declared defensive interrupt if eligible, then B's turn.
The ordinary example attack die is 12, +5 vs AC15; hit, followed by an addressed
damage draw. Stamina comes only from that profile's action cost, not the
legacy stance's additional charge. At round end, advance six world seconds
once and run due duration events in deterministic order. At zero HP use the
profile consequence policy; do not call legacy defeat hooks to approximate
SRD death saves. The legacy path's `fainted` signal is not universally death.

### R4-C2. Offline batch path, EC2

INFERRED choose bounded exact event batching for the first consumer. A batch
is a faster execution of the same ordered kernel, with DOM/log rendering
coalesced. It is not a substitute distribution or a second RNG stream.

| Stage | INFERRED deterministic contract |
|---|---|
| R4-C2a / admit | Existing offline policy supplies an authorized joined-time interval. Check the world's absence policy, actor occupation, supplies, queued plan and stop policy. This note grants no new offline movement, combat or death permission. |
| R4-C2b / schedule | Order events by logical due time, phase, frozen initiative/turn order and stable code-point event ID. Save causal event ordinal and draw addresses independently of chunk size. A rule change, zone crossing or target defeat is an event boundary. |
| R4-C2c / resolve | Quote current truth, resolve each permitted action, update dependencies in order, then stage costs, outcomes, growth and unique claims under one settlement ID per event. Do not treat interacting strikes, healing, fleeing or target selection as independent binomial trials. |
| R4-C2d / budget | Initial proposal: 256 checks/chunk, 32 draws/check, 128 recent detailed receipts. These are operational budgets, not per-world lifetime or daily action limits. Yield and retain the next event/debt when a chunk ends. A request needing more draws is unsupported until a suitable budgeted policy is selected; no silent truncation. |
| R4-C2e / publish | Persist pending encounter/queue, conversion remainder and settlement watermark together with owner effects. Rehydrate before continuing after a durable-write error. Aggregate display messages afterward. Never replay paid rewards from the log. |

Stop at a human choice, missing contact adapter, changed means, rest
interruption, authored danger boundary or unresolved lethal consequence.
Keep unused authorized time as debt rather than silently consuming it. Further
chunks continue deterministically when no such stop exists. In a faithful
profile, automated reactions require an explicit queued policy; the engine
does not invent tactical intent while the player is away.

INFERRED batching example: two actors over 10 SRD rounds consume 60 fictional
seconds, with up to 20 ordinary turn decisions before extra events. Processing
one round at a time or ten together produces identical per-event draws,
resources, wounds and next event. The calendar receives one minute only when
the authorized bridge settles those 60 seconds. A batch split after event 7
resumes at event 8, preserving earlier deaths/loot and unique claims.

Expected-outcome combat remains a ranked later option. It must be explicitly
declared as an aggregate model with supported inputs and consequence bounds.
Multiplying average DPS by elapsed time does not preserve survival, criticals,
resource exhaustion or outcome-dependent growth. Exact distribution batching
is possible only for a validated independent repeatable task with no branching
dependencies; it cannot quietly replace the default fight kernel. EC2's curve
comparison needs normalized modifiers/targets and outcomes: flat d20 versus
3d6 alone does not prove greater variance in binary success totals.

## R4-T1. Time ladder without merging time kinds, EA5

INFERRED `Duration = {amount, unit, rung, timeKind, clockRef, policyRef}`.
Amount is a nonnegative rational with positive denominator. `unit` names
seconds/minutes/hours/days/weeks or an explicit ordinal/event unit. `rung`
names the fiction's grouping; it does not identify the authoritative clock.
`timeKind` is one of the five kinds below. `clockRef` binds a real owner and
instance or job, never a display label. `policyRef` defines conversion,
rounding, pause, interruption and absence. Reject conversions lacking one.

| Kind from ER18-N1 | SHOWN basis / INFERRED handling |
|---|---|
| R4-T1a / native calendar | SHOWN `src/game_time.js:8-41` stores minutes, hours, days, 30-day months and 12-month years. INFERRED source-world civil calendars can differ; bridge to this owner explicitly instead of changing it globally. A calendar year is not 365 days by default here. |
| R4-T1b / joined elapsed | SHOWN world-instance records use played minutes and frozen absence (`src/world_instances.js:108-111`). INFERRED eligible work advances the existing joined-time owner once. A tabletop sub-minute remainder is not a second parallel joined clock. |
| R4-T1c / local occupied or lease | SHOWN the inventory identifies this as a separate semantic kind. INFERRED workshop occupation or rent accrual follows its own existing policy, which may not equal actor aging or home-world time. No double workshop job in one occupied slot. |
| R4-T1d / wall packing | INFERRED wall absence is only input to the existing eligibility/cap policy that grants a joined interval. Packing 100 events into one callback changes processing cost, not how many seasons passed. A wall timestamp is not a draw key or direct rest completion. |
| R4-T1e / browser timer cadence | SHOWN `src/simulation_clock.js:3-25` distinguishes native timers/test hooks and uses wall-backed engine time; `src/status_window.js:53` polls at 250 ms. INFERRED cadence drives rendering/wakeup only. Throttling the tab must not grant extra turns or healing. |

| Rung | INFERRED rule, with source distinctions |
|---|---|
| R4-T2a / round | SHOWN SRD combat order p. 13 uses about six seconds; BRP quickstart p. 21 uses twelve. Bind that profile's round duration. Effects expiring at turn boundaries still use event order, not just seconds. |
| R4-T2b / turn | SRD actor turn is an ordinal slot within a round. BRP exploration turn is a five-minute interval. Specify `actor_turn` or `exploration_turn` in the policy. Neither equals a browser tick. |
| R4-T2c / scene | A declared start/end event or bounded job, not a universal number of rounds. When no duration is known, maintain the event boundary and do not invent idle credit. |
| R4-T2d / day | Civil boundary and elapsed duration can differ. A cooldown of 24 hours, next dawn and once in a local calendar day are distinct policies. Crossing worlds cannot reset a claim by changing a label. |
| R4-T2e / season | Calendar interval or declared study season. A job states its required occupation and whether partial progress persists. Do not use the legacy calendar's three months for every cosmology. |
| R4-T2f / year | Use calendar arithmetic for birthdays/eras; explicit elapsed units for duration. Do not round per tick or equate real-world year length to every world's year. |

INFERRED bridges operate on exact rational elapsed seconds with integer
remainders at each owner boundary. Ten SRD rounds equal one minute; nine
rounds retain 54 seconds and grant zero full joined minutes. If five more
seconds of eligible work follow, retain 59, not ten rounded-up minutes. A
calendar/lease bridge records its last settled event/interval so replay cannot
charge the same minute twice. Profile changes carry the remainder as elapsed
time with its old policy identity, not as a count of new rounds.

Existing domains advance only through their current causal joins. A frozen
absent world accrues no local rest from another world's years. Other absence
models remain possible through their own explicit versioned adapter, not by
editing this ladder. Rest, workshop and travel may overlap only when the
actual actor/body/slot and policies support it. Parent/nested worlds do not
inherit each other's time speed from a parent ID.

### R4-T3. Rest and recovery as idle jobs, EA10/EA11

INFERRED `ProfileJob` fields: `id`, `kind`, `actorId`, `bodyId`, `instanceId`,
`profileLockRef`, `policyRef`, `duration`, `startedAt`, `progress`,
`reservedMeansRefs`, `interruptions`, `choicePolicyRef`, `status`,
`settlementId`. `startedAt` and `progress` are typed positions/durations under
one bound clock. The job retains a reviewed automated choice policy or stops
when a decision is needed. Status enum: queued, active, paused, complete,
canceled. Completion means durable effects settled, not a timer hitting zero.

| Job | Source basis and INFERRED idle mapping |
|---|---|
| R4-T3a / SRD short rest | SHOWN SRD p. 187 specifies an hour, eligibility and interruptions, optional Hit Point Dice and feature recovery. INFERRED queue one hour of eligible local downtime; reserve selected dice or an explicit spend policy. Address each healing die by job/die ordinal. Stop on an applicable interruption with no unearned completion benefit. Sequential die-spend decisions need either a queued policy or a player choice. |
| R4-T3b / SRD long rest | SHOWN SRD p. 185 specifies at least eight hours, sleep/light-activity constraints, starting HP, a 16-hour wait after completion before a new start, interruption/resumption and recovery. INFERRED encode those exact eligibility facts and feature-specific restoration. A permitted interruption after sufficient rest may settle a short-rest benefit once; resumption extends required work by the source rule. Track benefit/interrupt event IDs to prevent repeated short-rest rewards. Do not use SRD 5.1's different Hit Dice recovery rule. |
| R4-T3c / percentile recovery | SHOWN BRP quickstart p. 27 describes weekly recovery and injury-qualified First Aid. INFERRED queue a week of eligible local healing, using its actual treatment policy and wound references. A First Aid attempt belongs to the actual injury, not a repeatable generic HP button. Exact recovery dice and per-injury constraints remain in the book owner's source records. This model does not silently give a long rest's full restoration. |
| R4-T3d / seasonal healing or research | INFERRED extension only: a season job reserves place, treatment/mentor and actual time, then settles its own growth/recovery unit. UNKNOWN source-specific seasonal formulas here. Reuse the job and ledger seam only when the chosen world has a consumer; no Ars rule fidelity is claimed. |

INFERRED injuries reference the actual affected body/owner, condition policy
and cause event. Death-save counters or an injury table are profile-specific
consequence state, not a global HP reskin. Stabilization, treatment, exhaustion,
resurrection and rebuilding require explicit supported transitions. Heir
inheritance, restored consciousness and retained memory do not revive a body
implicitly. The pilot should stop at unresolved danger rather than invent
offline death or reinterpret ordinary fainting as death.

## R4-M1. Migration and compatibility of every proposed saved field

All rows are INFERRED compatibility decisions, not implemented migrations.
The schema is closed: only the fields enumerated here and in their referenced
immutable records are proposed. Author catalog defaults are not save defaults.
Existing `worldId`, instance paths, bodies, pools, RNG roots/cursors, clocks,
pending battles and legacy saves remain owned by their current readers.

| New saved field or complete group | Missing in an old save | Admission, upgrade and replay decision |
|---|---|---|
| R4-M1a / `rulebookState.schema` | No sidecar means legacy behavior, not implicit SRD or percentile rules. | Adopt only for a newly authored instance or explicit reviewed migration. Unknown schema refuses this feature during staged load; preserve the original import/save intact. |
| R4-M1b / `bindings` and each binding's `worldId,instanceId,continuityId,eraId` | Empty sidecar map; never infer independent instances from labels. | Validate against real existing instance identities. No template/region/branch ID substitution; no new copy of people, goods or claims. |
| R4-M1c / binding `profileRef` | Absent instance stays legacy. | Freeze `id@rev` on adoption. No automatic 5.1 to 5.2.1 or quickstart to core update. |
| R4-M1d / `profileLock.schema,profileSnapshot` | No synthesized profile snapshot. | Freeze all R4-P1 leaves: identity/basis, resolution, progression, law, scale, time, combat, procedures, packs, licence and budget. Validate every referenced record's schema/units. A revision change requires an explicit compatibility plan; presentation labels cannot change adjudication. |
| R4-M1e / `legacyModuleLocks,extensionPacks` | No re-locking old mixture operations. | Existing module locks validate byte-equivalently through the current reader. New extension snapshots require their own versioned admission; unknown opcodes never fall through to legacy rules. |
| R4-M1f / `interpreterRefs,registryRef,factVocabularyRef,dependencySnapshots,fingerprint` | Preserve legacy dependencies as they were; feature absent. | Resolve exact compatible implementations and canonical dependency snapshots. Missing/changed fingerprints block affected actions. Do not recompute the saved expected fingerprint to bless new content. Retain old readers; hash is not authentication. |
| R4-M1g / `zoneBindings` entries `{zoneId,lawRef,crossingPolicyRef,lockRef}` | Empty; existing region laws unchanged. | Each zone must be real represented coverage, each override scope admitted. Re-entry uses the same binding, not a new roll or generated law. |
| R4-M1h / `lawEvents` entries `{id,sourceRef,scope,oldLockRef,newLockRef,effectiveAt,settlementId}` | Empty, no retroactive generated laws. | Immutable event/lock history; `effectiveAt` is typed game time. In-flight jobs either keep their pinned interpretation or stop/revalidate at the named law event. Never silently recompute completed facts. |
| R4-M1i / `timeBridge` entries `{clockRef,policyRef,remainder,lastSettledEventId}` | Absent/zero only for a newly adopted bridge at an explicit anchor. | Never derive backpay from the save's lifetime or wall age. Rational remainder must be bounded and units validated. Carry old elapsed remainder across a deliberate rule migration, recording the new conversion policy. |
| R4-M1j / `actors` map and `homeProfileRef,nativeSheetRef,functionRefs` | Existing actor/power/method state stays the authority; no free ability. | References bind actual owners; native stats remain native. Imported NPCs use the same adapters, not player-only hidden conversion. Function records are versioned author data; acquired function refs persist. |
| R4-M1k / actor `scaleClassRef` and effect scale refs | Native legacy damage math remains unchanged. | Opt-in explicit scale for the new profile. Missing cross-scale contact is unsupported, never implicit equality or default immunity. Do not map level to scale on load. |
| R4-M1l / actor `expressionBindings` entries `{id,abilityRef,sourceRef,bodyRef,destinationRef,expressionRef,policyRef,setupSettlementId,reversionPolicyRef}` | Empty, no automatic translated ability grants. | Rebuild display from saved bindings but revalidate live means before use. Do not copy inventory/resources or overwrite home learning. Reversion settles only the expression named. |
| R4-M1m / actor `growthLedgers` entries `{profileRef,unit,balance,pendingMarks,lastReviewId,lastSettledEventId}` | Empty new ledgers; existing XP unchanged. | Unit-specific nonnegative values and mark IDs. No XP/mark/point currency exchange by load. Pending marks settle once under their pinned policy. Keep review IDs/watermarks after detail compaction. |
| R4-M1n / actor `personalOverlayRefs` | Empty references, not emptying existing cheats. | Link actual granted cheat/source owner; never reconstruct a grant from a UI title. Existing cheat state and one pool remain authoritative. |
| R4-M1o / actor `consequenceState` `{bodyRef,policyRef,conditionRefs,woundRefs,counters,lastSettledEventId}` | Existing health/fainting/conditions load unchanged. | New counters only from actual opt-in events, never infer old deaths/injuries from missing data. Preserve body ownership and event identity. |
| R4-M1p / `knowledge` map with entries `{factId,profileRef,scope,evidenceRefs,disclosure,learnedAt}` | Empty knowledge, not unknown engine truth. | Never grant profile truth on load. Preserve old evidence/aliases; render names through the observer projection. Updating truth does not erase historical beliefs. UI caches are derived, never migration evidence. |
| R4-M1q / `jobs` identity fields `id,kind,actorId,bodyId,instanceId,profileLockRef,policyRef` | Empty; old native jobs continue in their own scheduler. | No conversion of an in-flight old rest or combat mid-event. Explicit adoption waits for a safe settled boundary or a separately proved pending-state mapper. |
| R4-M1r / job `duration,startedAt,progress` | No elapsed/offline credit inferred. | Typed clock/rung/unit plus exact fraction validation. Import restores progress and remainder without re-awarding previous segments. A display rounding change does not change due time. |
| R4-M1s / job `reservedMeansRefs,choicePolicyRef` | No fabricated reservation or automated tactical choice. | Rebind real slots, materials, pools and chosen policy. On stale means pause under the interruption policy; releasing/refunding needs the actual reservation state. |
| R4-M1t / job `interruptions,status,settlementId` | No new jobs or interruption benefits. | Interruption entries `{eventId,at,kind,benefitSettlementId}` are deduplicated. Only durable settled effects can mark complete; duplicate completion returns the result. |
| R4-M1u / `encounters` identity `id,modelRef,profileLockRefs,actorRefs` | Preserve existing native snapshot/loops and RNG. | Never reinterpret native `count/60` as SRD round progress. New encounter starts at a supported boundary; imported old encounter remains legacy. Mixed actors pin each relevant lock. |
| R4-M1v / encounter `round,turnIndex,initiativeOrder,allowances,eventOrdinal` | No synthetic initiative rolls or action allowances. | Save stable actor IDs, tie outcomes and remaining per-actor action/reaction units. Reject duplicates/invalid order. Rehydrate the same next decision, not a new round. |
| R4-M1w / encounter `pendingEvents,queuedPolicyRefs,status,stopReason` | Empty for absent feature only. | Each event `{id,due,phase,actorId,targetIds,actionRef,drawAddress,reservedCostRefs,settlementId}` is pinned to typed time and refs. Never redraw an in-flight action; stop reason is a code with knowledge-filtered presentation. |
| R4-M1x / `replay.rootRef,intervalDebt,nextEventId,lastSettledEventId` | Keep all legacy stream roots/cursors; no re-seeding or derived lifetime debt. | Reference an existing root only under its owner's compatibility decision. New namespace/root adoption needs an explicit anchor. Carry authorized unprocessed time exactly once; no draws keyed to batch size. |
| R4-M1y / `replay.recentReceipts,unsettledReceipts,settlementWatermarks` | Empty for the new feature. | Receipt fields `{schema,eventId,address,profileLockRefs,policyRefs,inputSnapshot,dice,modifiers,result,reasons,costRefs,growthRefs,settlementId}` are immutable causal evidence. Keep every unresolved or externally referenced receipt. Bound recent detail; compact settled history only with a safe watermark and unique-claim owner intact. Logs do not become reward ledgers. |
| R4-M1z / optional `migrationEvents` entries `{id,fromRef,toRef,at,policyRef,resultRef}` | Empty, no implicit migration acceptance. | A deliberate edition/profile change is staged with a verified before snapshot and exact affected fields, pending-action policy, knowledge treatment and rollback boundary. After durable publication restore the committed migration on errors, not an older partially paid state. |

INFERRED upgrade default: retain old instances/readers; new editions create
new profile IDs/locks for new instances. Optional in-place migration can be
authored later, with progression thresholds, active effects, pending actions,
rest eligibility and conversion remainders mapped explicitly. Choosing a new
cosmetic label is not such a migration. Unsupported future schemas should
leave the original file recoverable and must not drop unknown state and then
overwrite it as a successful save.

## R4-V1. Acceptance plan for a future implementation

These are proposed checks, all **NOT RUN** in R4. They are not extra gates for
this documentation lane or claims of implemented gameplay.

| ID | Required observable evidence |
|---|---|
| R4-V1a | Both profiles validate; malformed refs/units, unknown families, bad scope, equal-ranked conflicts and missing means fail before spending. Exact enumeration verifies d20 55% and advantage 79.75%; percentile 60% with a distinct critical band. |
| R4-V1b | Three fixed-address goldens per supported family, a stated seed-sweep band, preview/cancel parity, and same next result after save/reload/literal-file import. Existing RNG and frozen legacy module locks stay unchanged. |
| R4-V1c | Run all three acts in R4-X3 under all three modes, plus missing-carrier, scale-mismatch, unknown-rule, NPC-traveler and zone-seam cases. Verify one real stock/point owner and persistent craft aftermath. |
| R4-V1d | Online versus chunk sizes 1/7/256 yields identical encounter/job state, draws and rewards; test interruption, event-7 resume, exhausted resources, unavailable adapters, round/turn boundaries and failed publication both before and after durability. |
| R4-V1e | Rebuild and exercise a fresh 1366x768 origin with paid action, known rules, blocked use and rest progress; save/reload/import pending and completed work. Check sealed/discovery filtering separately from author inspector. Director taste and human acceptance remain distinct. |

UNKNOWN at close: R1/R2 final APIs and artifacts, full BRP advancement,
unencoded source rules, exact first destination/contact conversion, accepted
combat/offline danger policy and runtime persistence integration. Ranked
options are in [REPORT](REPORT.md). The proposal does not close any of them.
