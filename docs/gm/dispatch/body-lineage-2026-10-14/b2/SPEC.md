# B2 implementation specification

Everything newly specified here is a proposal. G24-B2 extends G24 and G25.1,
with the requested G25.2 quirk examples. [AUDIT](AUDIT.md) records current code;
[MIGRATION](MIGRATION.md) owns compatibility; [TEST_PLAN](TEST_PLAN.md) owns
unrun acceptance cases. No runtime implementation is claimed.

## G24-B2.1 Scope and ownership

Default: preserve native play and old saves. Add one optional versioned
`character.body_record`, one pure resolver and one biography projection. The
native bio's race/height/age remain compatibility projections. Its old gender
is a compatibility snapshot; new readers use the split fields below. No new
XP track, world, prestige, reproduction simulation or aging loop is required.

Dial: each world can author its own bodily effects and creation options.
Reason/cost: physical means change native work; an existing character may keep
its existing balance or deliberately adopt a disclosed profile. Adoption costs
no currency in this proof; changed strengths and weaknesses are the disclosed
consequence. Future world treatments or transformations may have their own
real costs. No fixed once-only anti-abuse limit is introduced.

Suggested later module `src/body_record.js` owns normalize/validate/resolve/view
helpers and a small versioned definition table. `BioComponent` may hold the
record with explicit accessor/serializer methods, but `getBio()` keeps returning
the legacy four-field shape. `create_save()` writes `character.body_record`
explicitly. Avoid a second copy under expansion or simulation.

Existing simulation body anatomy, sources, faculties, conditions, custody,
chronicle and backlog proofs remain with their current owners. The B2 physical
record describes the native body only. A temporary possessed host is resolved
through existing body projection; its anatomy does not overwrite this record.

## G24-B2.2 Persisted shape

Illustrative migrated record, exact keys proposed:

```json
{
  "schema": 1,
  "revision": 1,
  "physical": {
    "bodyId": "native.player.body",
    "speciesId": "human",
    "frame": {"heightKey": "average"},
    "sex": {"characteristics": "unspecified", "reproductiveRole": "unspecified"},
    "age": {"stage": "adult", "basis": "legacy-selection"},
    "quirks": [],
    "physiques": [],
    "constitutions": [],
    "genetics": {"model": "unassigned", "loci": [], "templateRef": null}
  },
  "person": {
    "identity": "ambiguous",
    "address": {"pronouns": null, "playfulForm": "legacy_nonmale"},
    "presentation": null,
    "registrations": [],
    "socialRoles": []
  },
  "knowledge": {"player": [], "observers": {}},
  "worldProfiles": {
    "base.frontier": {"id": "legacy_cosmetic", "revision": 1, "raceScale": 0, "heightScale": 0, "quirks": false}
  }
}
```

This sample follows a human/average/adult/ambiguous legacy input. Migration
copies the actual race/height/age; it does not turn other saves into this sample.
Fields omitted by upstream saves remain unspecified as MIGRATION describes.

| Palette reference | Physical/person storage | Meaning and consumer |
|---|---|---|
| PH1 | physical.frame.heightKey; optional heightCm, reachCm | Relative category authoritative for this slice; optional real dimensions only if supplied, never rolled on load |
| PH2–PH11 | Optional frame.profileRef | Versioned authored frame definition may describe muscle, connective tissue, lungs, metabolism, recovery, fatigue, senses, coordination, voice and appearance; omitted dimensions carry no fabricated measurement |
| PH12 | physical.physiques | Instance cards for ordinary extremes; empty in first migration |
| SG1 | physical.sex.characteristics | Species-specific body template ID, unspecified or an explicitly chosen variation. Not inferred from gender |
| SG2 | physical.sex.reproductiveRole | Species-owned role ID, unspecified or explicit none; no reproduction effects in B2 |
| SG3 | person.identity | Self-described identity key. Preserve legacy male/female/ambiguous without interpreting ambiguous as anatomy |
| SG4 | person.presentation | Optional declared presentation profile. Observers see actual supported clothing/voice evidence; this declaration is not automatic recognition |
| SG5 | person.address | Explicit pronoun set or null; playfulForm routes current honorifics. Null means not specified, not they/them |
| SG6 | person.registrations | `{worldId, registryId, recordedSex, evidenceRef}` rows; claims can disagree with truth |
| SG7 | person.socialRoles | `{worldId, cultureId, roleId, evidenceRef}` rows; empty grants no social access or penalty |
| AG1–AG6 | physical.age | Existing native age stage, optional years only if known. No derived lifespan or decline in this slice |
| LQ | physical.quirks | Saved instances referencing versioned definitions; not live random draws |
| CN | physical.constitutions | Cards describe processes; empty slots do not imply absence of an undiscovered faculty |
| GN1–GN12 | physical.genetics | Reserved model/loci/templateRef. Unassigned differs from no genes or sterile |

`physical.age.stage` initially accepts native young/adult/"middle aged", plus
unspecified when missing. Copy any additional legacy label as an inert legacy
value until qualified rather than guessing years. Creation currently writes
"middle aged" with a space (index.html:110), while the address branch checks
"middle-aged". Preserve that mismatch for old saves. Optional future species
stages use a species definition;
chronicle age stays a separate clock and must not be overwritten.

Card instance proposal, shared for physique/constitution/quirk:
`{id, definitionRevision, origin, acquiredAt, status, evidenceRef, params}`.
An optional sourceId references an existing earned-source owner; it grants
nothing by itself and must resolve to the same physical function.
IDs identify definitions, not public names; origin is unknown/inherited/trained/
acquired; acquiredAt is an existing game minute or null for unknown prehistory;
status is active/dormant/suppressed; evidenceRef is null or an existing receipt
ID; params is a validated definition-specific object, empty by default. Runtime
rates and prose come from the pinned definition revision. No arbitrary script,
multiplier blob or HTML is accepted in params. IDs are unique per collection.
An existing earned source is referenced, never granted again by merely listing
its card. Faculties remain the authority for that source's activation.

For GN placeholders, model unassigned requires empty loci and null templateRef.
Do not implement parent rolls, dominance, transmission or a blank DNA array per
species in this slice. A future named genetic model gets its own schema/model
validation and migration. B3 prestige work must refer to this reservation rather
than treating empty loci as an inheritance decision.

SG1 defaults: this proof's current playable species templates use unspecified,
with reproductiveRole unspecified. This is an explicit unknown template, not a
random sex. A later creation selection can choose a species-qualified SG1/SG2
pair independently of identity. Body swaps change physical state; SG3/SG5 stay
with the person. B2 does not port native physiology to unsupported host bodies.

## G24-B2.3 Knowledge and size

Truth is stored in physical/person. Knowledge stores field observations, not a
second truth object. Observation shape: `{path, stage, value, at, evidenceRef}`;
path is an allowlisted body field/card path, stage seen/understood, value a
small typed diagnostic claim. Observer map keys are stable actor IDs; no entry
means no such body observation. Player has its own observations. Existing
simulation knowledge can retain an evidence reference to the observation;
B2 does not replace or bulk copy that store. No simulation enrollment is needed
for ordinary self-description. NPC knowledge requires an actual tell, dialogue
or diagnostic means. Conflicting claims can coexist with truth.

Migration creates no diagnosis or observers. Identity/address and selected
race/height/age are known from the legacy bio directly; unspecified SG1 and
unassigned GN are not displayed as positive findings. Card names and effects
need known evidence. Effects may work before identification; UI says only a
supported sensation such as “Your hands feel steadier,” not a hidden trait ID.
Hidden state must not leak through DOM attributes, tooltips, accessibility text
or counts of unnamed slots. Evidence IDs, not sealed truth, appear in reports.

Proposed engineering budget, not biological trait limits:

| Case | Compact UTF-8 JSON | UTF-16 storage bytes | Basis |
|---|---:|---:|---|
| Migrated empty native record | target <= 1,536 B | target <= 3,072 B | One physical record, person and neutral profile |
| First useful authored record | target <= 4,096 B | target <= 8,192 B | Eight example quirks, two physique and two constitution cards, modest evidence |
| Slice qualification fixture | target <= 16,384 B | target <= 32,768 B | Multiple world entries/observers and Unicode stress |

The illustrative migrated JSON above measures 660 UTF-8 bytes and 1,320
UTF-16 storage bytes when compacted; wrapped as a body_record property it is
676 and 1,352 bytes respectively. This is a shape check, not a real game-save
measurement.

Measure actual serialized deltas to the envelope, including the body_record
key, using TextEncoder and string.length * 2. These are targets, not import
caps. Warn developers on over-target fixtures; do not truncate cards/evidence or
reject a valid life solely for exceeding a target. Existing 4 MiB shared-origin
guard remains the hard storage check. Keep full history in its existing owner,
no per-tick body journal, generated prose, duplicated registry definitions or
population genomes. UTF-8 export base64 adds `4 * ceil(utf8Bytes / 3)` characters
plus its prefix. Test both UTF encodings; character count alone is insufficient.

## G24-B2.4 Per-world body profile and exact arithmetic

World identity comes from the active gameplay/world host, not a guessed race or
location string. Pin each world's profile under worldProfiles on fresh creation
or explicit adoption. An unlisted world resolves to neutral without editing the
record; entering it does not reroll or reset physique. Profile revision pins
rates; table changes require an explicit profile migration, not silent rebalance.
The resolver also pins the current race/height definition table revision to
profile revision 1. Keep its historic values available after future edits.

| Proposed profile | raceScale | heightScale | quirks | Default, reason and cost |
|---|---:|---:|---|---|
| legacy_cosmetic r1 | 0 | 0 | false | Every loaded save without B2; preserves the run's existing body balance |
| frontier_gentle r1 | .25 | .5 | true | Proposed fresh home-world default; physical variation affects work without raw 40% health reductions |
| frontier_table r1 | 1 | 1 | true | Optional full existing-table proposal; stronger advantages and weaknesses disclosed before applying |
| unsupported world/body | 0 | 0 | false | Neutral translation until that world/body has a qualified adapter; keeps data dormant |

Formula per stat: `raceFactor = 1 + raceScale * (rawRaceMultiplier - 1)`;
`heightFactor = 1 + heightScale * (rawHeightMultiplier - 1)`.
Missing raw entry = 1. Multiply raceFactor * heightFactor with existing level,
skill, equipment, condition and other native buckets, using existing stat order.
No rounding until existing native presentation/damage rounding. Raw race XP
maps remain inactive; SG identity/address have no stat multiplier in B2. Sex
stat differences are an available future world/species dial, not inferred here.
All numbers in this section are balance proposals, not accepted game rules.

For gentle: cat agility/dexterity 1.05, strength/health .925; mouse strength/
health .90; short strength/health .95, agility/stamina efficiency 1.05; tall
strength/health 1.05, agility/stamina efficiency .95. Short cat combined strength
and health = .87875 and agility = 1.1025. With unmodified base health 60 and
strength 12, the results are 52.725 and 10.545; base agility 8 becomes 8.82.
Human/average stays 1. Legacy scales zero give precisely 1 for every species.

Implementation contract `reconcileBodyBonuses(character, record, context)`:
replace complete race/height flat and multiplier buckets from the pure resolved
profile, including clearing stale entries on off/world/body changes; clear race
XP bucket for B2 profiles. Do not call additive addRaceBonus/addHeightBonus as
well. Both old config flags cease to be selectors for B2-managed characters;
missing B2 data is normalized to legacy before resolving. Keep global defaults
false. No double application through startup, probe or equipment recalculation.

Reconcile after creation selections, after load's native reconstruction and
before final vital restoration, after deliberate profile/frame/species changes,
and at supported world/body transition boundaries. Repeated calls are stable.
Ordinary updateStats reads the replaced buckets without refreshing history.
Keep missing-health and missing-stamina semantics of native saves.
On explicit profile changes, reducing a
maximum clamps current health to [1, max] and stamina to [0, max] for a living
native hero. On load, preserve the exact native fallback at main.js:6736: missing
or excessive hp_to_full yields health 1; missing or excessive stamina_to_full yields stamina 0.
No free heal from an identity edit.
Disable/adopt profile while idle only, with actual old/new stat and vital
preview. Preserve running jobs, combat and reserved costs by refusing a profile
change while busy; do not rewrite paid work. Repeat adoption is allowed whenever
idle, with the same explicit preview. No fee or artificial cooldown in this proof.

## G24-B2.5 Quirk hook and eight concrete variants

Proposed pure API:

```js
queryBodyEffects({record, worldId, bodyId, action, facts})
// => {multipliers: {}, chanceDelta: 0, staminaCostDelta: 0, reasons: []}
```

`action` is an allowlisted semantic token: sleep.recovery, food.effect,
combat.native, pursuit.conceal or craft.native.items. Facts are trusted host
inputs, never DOM hints: game hour, native light, effect ID and food tag, recipe
scope. The query cannot mutate state, clock, RNG, inventory or knowledge. It
filters active instances with pinned definitions, appropriate world profile and
matching physical body. Empty/disabled/unknown body returns exact identity.
Unknown definitions in schema1 fail validation before play; never silently lose
an active modifier. Query reasons are observer-filtered for presentation.
Allowed multiplier keys in this proof are sleepStaminaRecovery,
foodEffectDuration and attack_points; absent key = 1. No arbitrary stat key or
negative multiplier is allowed. chanceDelta is a probability fraction (.02 is
two percentage points), staminaCostDelta is native stamina units. All outputs
must be finite. These values are applied by the named adapter only.

Multipliers multiply, chance and stamina deltas sum. Clamp native craft chance
to [0,1], final stamina cost to >=0. Recovery remains a float until native caps;
effect durations use ceil(base * product), minimum 1 for positive durations.
No rounding per individual quirk. Apply each instance once. Early/late chronotype
share an exclusive parameterized LQ3 instance in this fixture, not a global
budget restricting other constitutions. Proposed variants:

| Palette / instance ID | Existing action and proposed effect | How chosen or changed; reason and cost |
|---|---|---|
| LQ3 / lq.early_riser | Sleep stamina recovery x1.05 from 20:00–03:59, x.95 from 04:00–19:59 | Optional creation chronotype; proposed routine treatment can shift schedule. Work planned around sleep hours |
| LQ3 / lq.late_riser | Sleep stamina recovery x1.05 from 02:00–09:59, x.95 otherwise | Alternative LQ3 parameter; same change route, no automatic night-watch XP |
| LQ5 / lq.snorer | Sleep stamina recovery x.98, health unchanged | Optional authored quirk; proposed treatment/sleep posture suppresses it. No automatic information leak or camping detection without an observer route |
| LQ1 / lq.bread_sensitive | Positive food buff duration x.90 for explicitly allowlisted bread IDs | Optional authored sensitivity; choose other meals or proposed remedy. No added damage, hunger drain or permanent food lock |
| LQ2 / lq.poison_tolerant | Incoming Slight food poisoning duration x.80, only when applying tagged food | Optional authored tolerance; later earned treatment/exposure may grant it through its own receipt. No duplicate resistance XP |
| LQ4 / lq.faint_scent | pursuit.conceal stamina cost delta -1, time/effect unchanged | Optional scent variation; less masking effort. Proposed wash/cover treatment can suppress variation. Neri does not gain smell-based detection |
| LQ8 / lq.sharp_eyes | Native attack_points x1.03 when native light is normal | Optional visual acuity; lenses or changed body can alter it later. No hidden knowledge, archery system or benefit in unqualified battle hosts |
| LQ14 / lq.steady_hand | Native item-crafting success chance +.02 after Work Ledger | Optional hand-control variation; later training/injury may change it by a real record. It does not double conditioned-grip capability |

IDs, effects, hours, recipe/food scopes and treatments above are proposals.
Bread allowlist for proof: Stale bread only, with existing Basic meal effect
(src/items.js:4203); no broad ingredient-allergy inference. Intervals include their first
minute and exclude the next boundary. Two-hour clock jumps must sample actual
sleep ticks, not apply one starting-hour multiplier to the whole jump.

Adapter instructions:

| Consumer | Application and transaction boundary |
|---|---|
| Sleep main.do_sleeping | Multiply computed furniture-adjusted stamina recovery, then cap. Health multiplier remains 1 for these examples. Tick clock and Sleeping XP unchanged |
| Food main.use_item | Resolve on item template/effect ID before add_active_effect. For the bread fixture only, positive means Basic meal; leave all other effects untouched. Leave native effect replacement and prepareFood fullness intact; no-op use follows the actual used flag rather than a new duration-extension rule |
| Native combat | Add a body_quirks multiplier bucket for attack_points in native stat assembly; refresh on light/world/body changes, clear when disabled. Hit formula and RNG draw order unchanged |
| Pursuit simulation preview/commit | Transform costs for exact pursuit.conceal in both preview and committed preview. Current commit freezes costs; use those same resolved costs for reservation/cancel/refund. Existing d.duration/effects and pursuit rules remain intact |
| Native crafting | Share one final chance helper between display and execute_native_recipe; only items subcategory gets this effect. Apply after Work Ledger. Output counts, XP, materials, recursive batches and rollback use the resulting chance unchanged |

Durable body choices and discovery claims join the action's existing durable
boundary. Native sleep/food ticks already use ordinary save cadence: do not
claim new per-tick atomic storage. Save reconstructs only already persisted
progress; no reroll or reward on recovery. For craft, include changed body
knowledge in rollback scope; for simulation, keep it in unpublished plans.
A body evidence message publishes after the relevant commit, not a preview.
No per-action history spam; retain the latest supported observation per field
and the existing life-record owner for meaningful events.

Quirk grants in the initial UI are explicit choices for fresh characters, with
None available and exact before/after effects. Existing saves get an empty
list, not random quirks. Treatments are extension routes, not existing item or
service claims. Full treatment actions are deferred; suppression via the
profile's quirk dial is a working reversible proof option with disclosed effects.

## G24-B2.6 Existing biography panel at 1366x768

Target: Workspace laptop viewport 1366x768 CSS pixels, 100% zoom; existing
`#character_bio_div` in the character module. The visible result is an identity
and body summary with active effects plus readable earned biography. Preserve
independent Local actions, combat and inventory surfaces. No auto-switch on a
quirk firing and no replacement of the whole workspace with a body dashboard.

Proposed panel order:

| Region | Initial content | Interaction |
|---|---|---|
| Existing 2-column profile | Age stage / identity; height / species; address on full row | Keep old field IDs for compatible links; gender row now identity; separate address label |
| Body summary, initially visible | Known frame, known SG1 if specified, active world profile, resolved race/height factors with stat names | A visible “Body details” control and “Body rules” preview; effects also keyboard focusable |
| Current relevant quirk line | Known quirk effect on current/selected action, with unit | No unrelated quirk list inserted into each action; show one grouped explanation when several apply |
| Optional Body details in same panel | Separate known sex/reproduction, presentation, registry claims/social roles, known physique/constitution cards | Empty unknown fields omitted; no “0 hidden genes” indicator; rows expand for provenance |
| Existing earned sections | Current condition, training, inherited traits, discoveries, movements | Preserve keyed rendering, practice notes and skill navigation |

Use the panel's allocated width. For the existing narrow character module,
keep a 2-column summary and single-column cards; when the user widens that
module, use two independent detail columns at >=560 px. Proposed minimum body
text 14 px, line-height 1.4. Do not shrink text to force all history into 180 px.
Classic currently has a 180 px scroll region while Workspace removes that cap
(see AUDIT). Later UI work should allow a taller biography reading region within
the character module at laptop size and keep scrolling inside long details.
Do not reset saved module geometry or force-open all history. Wireframe and
pixel budgets are design targets, not observed screenshots.

Profile dialog is an inline region, not a new window: current/new effect table,
“Apply body rules” and “Keep current rules.” Disable apply with the actual busy
reason. All controls work by keyboard, focus returns to opener, labels do not
rely on hover/color. Race/height creation and bio tooltips share resolved numbers
and say “No effect in this world” for neutral profiles. Replace the creation
“purely cosmetic” statement for fresh enabled profiles; retained legacy profiles
can truthfully explain cosmetic mechanics. Identity/address tooltips cannot
promise unimplemented random NPC assumptions.

UI acceptance remains OPEN: rebuild own candidate, exercise real bio and actions
at 1366x768, capture initial/expanded/long-known-history and neutral profile
states, then check laptop zoom/text size. Do not claim fit from CSS or this doc.
Mobile optimization, extra top-level panels, all-world social laws and broad
nonhuman body editors are deferred. Existing saved layouts need regression
checks; mobile does not substitute for laptop proof.
