# SRD 5.2.1 authoring pilot

Proposal data only. Nothing here is imported by gameplay or registered in a world.
Use `validateEffectRecord(record)` for one record and `validateEffectPack(records)`
for the joined three JSON arrays. They throw `TypeError` on invalid input and
return their unchanged input on success. Schema validation does not prove source
fidelity, resolve rulings, approve content or execute an effect.

Canonical source: SRD 5.2.1, the supplied `dnd-srd-521.txt`. Each record has its
heading, starting printed page, edition and SHA-256 of that exact text. No 5.1,
VTT dataset or other edition was mixed into this pilot. Cross-column/page
continuations were read in the same source. `revision: 1` is the adapted record's
revision, separate from source edition. Keep source, licence and attribution
when moving individual records. [ATTRIBUTION.md](ATTRIBUTION.md) contains the
required notice and describes the adaptations.

## Representation contract

- `supported`: every rule of this sampled record fits the defined fields or
  primitive semantics. This means authoring coverage, with no runtime claim.
  `needs_ruling`: the known partial representation has named `unmodeled` rules
  and concrete `rulings`. `unsupported`: a reason is recorded, still under the
  same strict schema. A future executor must refuse both non-supported states
  unless a separately reviewed adapter resolves them. Notes cannot supply missing
  opcodes or silently upgrade status.
- `effects`: a bounded list, each with its own target, area, range, timing,
  resolution, damage, healing, conditions, duration, concentration and components.
  Feet are SRD feet. An area's `feet` is radius for sphere/emanation, length for
  cone, and the nominal unit length for an unresolved wall. Area targets have
  `count: null`; counted targets have positive integer counts. `requiresSight`
  means the caster must see the target. Size/type arrays restrict eligibility;
  empty means unrestricted. Range `touch` and `self` have zero numeric distance;
  `longFeet` permits a ranged weapon's long range, with its disadvantage supplied
  by the D&D resolver rather than a second damage effect.
- Duration is instantaneous, finite rounds/minutes/hours, or `source` (controlled
  by the applying source, never an invented permanent timer). Concentration is a
  separate finite-duration gate. An applied condition inherits its explicit
  condition duration; early save success or parent expiry ends that application.
  `ends` names source termination events. A reaction requires its trigger;
  `ritual` means the alternate SRD cast takes ten additional minutes and no slot.
  `save.dc: "spell"` and attack `bonus: "spell"` are source caster parameters.
  Save `none` negates the failed-save effect on success; `half_damage` halves
  damage, rounded down; `ends` ends that target's application. Attack damage
  applies on a hit. `repeat: "end_turn"` repeats the same save at each target
  turn end. Damage channels on one attack share its hit, such as Rend's Slashing
  and Fire; `instances` counts separate projectiles, which still need allocation
  semantics before Magic Missile can be supported.
- Materials require `stockId`, quantity, minimum **unit** value in GP,
  consumption and focus-substitution permission. A priced or consumed component
  cannot be substitutable. A future inventory adapter must select actual held
  stock of the required kind and quantity, check its value, reserve it with the
  cast and consume only rows marked `consumed`. GP is an eligibility threshold,
  never permission to debit coins or conjure the material. Dust quantity 1 is
  one qualifying batch; Revivify quantity 1 is one qualifying diamond. Free,
  unconsumed components can use a focus/pouch under the world's casting rules.
  This pilot performs no inventory mutation or purchasing.
- `function` states what the ability does, its carrier, prerequisites and scaling.
  Targets and ranges are inherited from its effects. Scale steps are cumulative
  additions once the named caster/slot level reaches `at`; they are keyed to an
  existing effect. `projectile_count` increases both dart instances and the
  potential recipient count, pending the ruling on allocation. `target_count`
  increases eligible recipients. Damage/healing steps add dice of the base size,
  leaving flat bonuses unchanged. Fixed/CR labels have no steps; CR is a source
  encounter label, never a conversion to another world's rank. Exhaustion's
  dynamic formula is explicitly unresolved.

## Condition primitives

`rules` are data, not callbacks or a new evaluator. `roll` changes the named
D20 test to Advantage, Disadvantage or automatic failure. `block` forbids its
named action or faculty. `harm_source` specifically forbids attacking the
charmer or targeting it with damaging abilities/magic; it is not mind control.
`approach_source` forbids willing movement closer to the fear source.
`speed: all, 0` sets every speed to zero and the accompanying `speed_increase`
block prevents increasing it. `grant_condition` includes that condition's
rules; pack validation rejects missing references and grant cycles.
`resistance` halves the named damage type, or all damage, under the world's
normal resistance rules. `condition_immunity` blocks the named condition only.
`critical_hit` turns a successful incoming attack into a critical hit if the
attacker is within five feet. The other primitives break concentration, drop
held items or remove awareness. They do not create stock.

`when` filters refer to the condition source and the current test's counterparty:
`source_visible` means the fear source is within line of sight;
`target_not_source` excludes the grappler; `observer_cannot_see` applies when
the effect creator or attack counterparty cannot see the Invisible creature.
Invisibility conceals worn/carried equipment too. Its Initiative advantage
remains unconditional while Invisible. Five-foot filters measure attacker to
target. Size filters and `ally_near_target` are reserved partial predicates;
compound hit/size and ally eligibility remain flagged in the affected records.

Monster fixed `multiattack` entries are the attacks in one action, with each
count repeated. An empty list supplies no Multiattack; unresolved weapon choices
remain in notes and require a ruling. A `recharge` entry starts available, is
spent on using that action, and rolls its d6 at the start of each of the
creature's turns while spent; a result at least `minimum` restores availability.
A future consumer must use the world's addressed draw resolver, not a new RNG.
Source hit dice are separate from fixed average HP; no HP is rolled by validation.

## Import boundary and checks

`tools/import_srd521.mjs BLOCK_FILE PAGE CANONICAL_TEXT_FILE` emits a draft plus
validation errors. It never accepts a draft or writes this pack. Unknown header
syntax stays invalid. A schema-valid draft still requires semantic source review.
`tools/trial_srd521.mjs BLOCK_DIRECTORY CANONICAL_TEXT_FILE` reproduces the
20-spell trial using private single-spell blocks named for their record ID suffix.
The lane's `REPORT.md` and `IMPORT_TRIAL.json` own coverage, exact questions and
review limits. Run `node --test tests/effect_dsl.test.js` for the focused suite.

No save shape, migration, lazy world loader or runtime adapter is introduced.
Existing saves are inert. EP9's future lazy world registration remains open;
this lane supplies portable licensed data without implementing that separate seam.
