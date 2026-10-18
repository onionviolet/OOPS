# G24-B2 migration and compatibility contract

**Current applicability, 2026-10-18:** this is a retained optional migration
proposal. The 2026-10-17 compatibility decision permits reset/drop of old state,
so implementing every legacy case here is not a mandatory gate. If a selected
task retains a migration, its failed-write, alias-consistency and no-grant
invariants still apply. New-state Save/reload/Export/Import remains required;
this audit runs no case or migration and changes no user data.

Proposal, not implemented. [SPEC](SPEC.md) owns field definitions and proposed
numbers. Compatibility means unchanged old gameplay, address strings, resources,
RNG, body capabilities and history after loading. JSON may gain the additive
record on the next successful save. Byte identity of the enlarged successful
save is not promised. Failed operations preserve the previous stored bytes.

## G24-B2.M1 Normalize without inventing a past

Proposed pure `prepareBodyRecord(save)` returns a cloned envelope and an in-memory
migration note. It writes no storage, calls no RNG, advances no clock and grants
no source. The migration note is developer evidence, not a player lore entry.

| Input | Result |
|---|---|
| Existing valid character.body_record schema1 | Validate, retain values/revisions, no default overlay onto existing fields |
| No B2 domain, pre-v0.6 | Apply current prepareV06Save first: personal then bio over its defaults; then construct neutral B2 from that result |
| No B2 domain, v0.6 component bio | Copy existing race/height/age and gender meaning; create legacy_cosmetic profile, empty cards/genetics/evidence |
| No B2 domain, missing bio/fields | Preserve existing legacy bio omissions; B2 uses explicit unspecified values, neutral effect resolver and legacy nonmale address fallback; no reopened creation panel |
| Present null, array, unsupported schema/revision or malformed fields | Reject before active mutation/storage. Absence is different from corrupt presence |
| Valid unknown legacy race/height/age string | Retain exact legacy field, carry as inert legacy value and use neutral effect until a supported mapping exists; do not substitute human/adult/average |
| Unknown active B2 definition, profile revision or inconsistent known native alias | Reject, preserve input/save, ask for compatible build through existing load-error UI |

B2 records written by this slice must have schema1 and revision1. A definition's
revision is independent of envelope schema. Supported profiles use the exact
ID/revision/settings tuples in SPEC; user dial changes select a registered tuple,
not arbitrary imported rates. An inert legacy label has no active modifier.
Unknown future active records are not discarded or demoted to cosmetic.

Legacy omission preservation: unspecified B2 fields project to absent legacy
values, not the literal word unspecified in old native getters. If old rendering
cannot handle an invalid race already, B2 does not claim to repair it. Missing
bio is a validator-supported fixture path, not proof that every malformed bio
has a playable old baseline.

Migration should satisfy `M(M(x)) == M(x)` and not mutate x. Use field presence,
not truthiness, to distinguish absent data. Validate primitive types and reject
prototype keys at every keyed map. Never spread an untrusted record into a
class instance or reinterpret imported params as executable code.

## G24-B2.M2 Gender, body and address mapping

| Old bio.gender | SG3 identity | SG5 address.playfulForm | SG5 pronouns | SG1 and SG2 |
|---|---|---|---|---|
| male | male | legacy_male | null | Species unspecified template / unspecified role |
| female | female | legacy_nonmale | null | Same independent species template |
| ambiguous | ambiguous | legacy_nonmale | null | Same; ambiguous is not intersex |
| absent | unspecified | legacy_nonmale | null | Same |
| Other string | unspecified | legacy_nonmale | null | Same; keep raw value only in bio.gender snapshot |

No random sex, inferred fertility, pronoun guess or social role is added.
SG4 null, SG6/SG7 empty. Migration preserves the old bio.gender value for export
compatibility. Runtime identity and address readers stop using it as anatomy.
New record edits change person.identity or person.address independently; do not
silently update one when the other changes. A later deliberate identity edit
may update the deprecated gender projection to male/female/ambiguous for older
readers, but the four legacy fields are never read back over valid split state.
Unsupported identities project to ambiguous, without changing explicit address.

New address helper proposal:

```js
function playfulAddress(record, legacyBio) {
  const oldAge = legacyBio.age; // preserve original spelling
  const form = record.person.address.playfulForm;
  if (form === 'legacy_male')
    return oldAge === 'middle-aged' ? 'Jii-san' : 'Onii-san';
  if (form === 'legacy_nonmale')
    return oldAge === 'middle-aged' ? 'Baa-san' : 'Onee-san';
  if (form === 'neutral') return 'friend'; // proposed explicit new choice
  throw new Error('Unsupported address form');
}
```

Pronouns are separately null or `{subject, object, possessiveDeterminer,
possessivePronoun, reflexive, agreement}`. Strings use bounded plain text;
agreement is singular/plural. New creation can offer he, she, they and custom
sets, but selecting one is independent of SG1 and playful honorific. Native
current text has no pronoun interpolation; do not claim adding data rewrites
all dialogue. Put any later pronoun placeholders through a single resolver.

Keep the current exact age comparison: `middle aged` from creation uses
Onii-san/Onee-san, while imported `middle-aged` uses Jii-san/Baa-san. A later age
cleanup would need its own explicit compatibility decision. Modern neutral
address is a proposed selectable option; no old ambiguous character is changed
to friend or they/them automatically. NPC remembered address remains observer
knowledge, not automatic global replacement of how every NPC speaks.

## G24-B2.M3 Load, save and import sequence

| Boundary | Required later integration |
|---|---|
| Envelope preflight | src/save_files.js validateSaveEnvelope validates present body_record before retirement/native mutation. Legacy preparation and B2 normalization use shared pure helpers so local load and file preflight agree |
| Normalize | After existing v0.5 personal-to-bio preparation, create neutral record only when absent. Do not pin fresh-character gentle profile for any loaded save, even zero-XP saves |
| Load native components | Explicitly load record via its setter, not Object.keys(bio) field copying. Retain saved profile revisions. Leave expansion/simulation/backlog payloads untouched |
| Rebuild stats | Resolve actual world/body. Replace owned race/height/quirk buckets after native skill/equipment/effect reconstruction and run stat recomputation before main.js:6736 missing-vital restore. Later recomputations must see the same buckets |
| Startup and import probe | Replace main.js:8185 and :8482 additive calls with shared idempotent reconciliation, or remove redundant calls if load/creation already owns them. Probe never chooses new traits or persists migrations |
| Fresh creation | Build record after selected race/height/age/identity/address, explicitly choose profile, then reconcile and run. Creation is a trusted fresh initializer route, not merely is_hero_created=false in a loaded save |
| Normal save | create_save serializes one validated body_record explicitly alongside bio. No derived stat buckets, query results or labels serialized |
| Export | Same create_save record and UTF-8 codec. Preserve existing ordinary export reward policy; isolate that reward when comparing body behavior |
| File import | decode -> envelope validate/normalize -> real-loader iframe preflight -> guarded storage write -> page reload. Keep input bytes and active state when any stage rejects |

There is no global save-schema bump required by this optional-domain proposal.
If repository release policy instead bumps game version, preserve the domain's
optional migration behavior. This slice guarantees forward loading into the
new implementation, not downgrade safety in an older executable that ignores
unknown fields. Keep an untouched generated old export as a fixture; never
overwrite a real user save to test rollback.

## G24-B2.M4 Body, world and continuation compatibility

| Existing state | Required behavior |
|---|---|
| Body progression unenrolled | Remains unenrolled. Empty B2 record is not body.begin; no chronicle, grip, mark or balance reward |
| Earned natural balance / conditioned grip / scars | Existing source, faculty and evidence retain exact origin and activation; no duplicate card bonus |
| Backlog reedling or installed device | Retain exact body/form/custody; B2 resolves neutral for unsupported form; native race alias is not evidence that this body is human |
| Active clay possession | Person identity/address remains with player; native physical record describes parked body; host stats/control/resources remain existing owners; native action gates unchanged |
| Changed world | Resolve target's pinned profile or neutral fallback; do not rewrite body traits, erase home-world profile or carry an unsupported world modifier |
| Existing paid action | Stored cost/due/effects frozen. New resolver does not retroactively lower reserved costs or adjust outcomes |
| Ordinary reload/offline return | No body aging, mutation, decay, random generation or new discovery. Clock policy remains existing owner |
| New life/heir | Do not copy previous person's physical record or identity by generic object spread. Current new-hero initialization makes a fresh record; inherited cards require the later B3 carrier and explicit consumer. B2 selects no lineage/prestige rule |

Legacy profiles remain neutral in every world unless explicitly adopted. Store
only the home legacy profile initially; missing-world neutral fallback prevents
new defaults from affecting the old run when it travels. Deliberate opt-in
produces a durable profile change while idle; its record and native stat preview
publish after a successful write. Storage failure leaves old profile and active
buckets unchanged. Full quirk-grant/treatment actions require their own receipt;
loading is not acquisition.

## G24-B2.M5 Validation and failure cases

Validate record shape, safe positive revisions, supported profiles, species/frame
keys or declared inert legacy values, finite dimensions, field/card allowlists,
unique IDs, source-origin enum, null-or-safe acquiredAt <= current clock when a
clock is known, and observation paths/stages/actor IDs. Do not assert prehistory
at minute zero from a null acquisition time. Bounded custom text proposal: each
pronoun <=64 code points, identity/presentation label <=128, diagnostic claim
<=256; no HTML rendering. No collection count is a biological limit; stress the
engineering targets without dropping valid entries. Reject unknown schema1
field keys to catch typos; future fields need a supported schema revision.

Canonical alias check for supported native species/frame/stage is exact equality
with bio.race/height/age; missing aliases match unspecified. Intentional body
changes write canonical record and aliases in one transaction. Imported
inconsistency rejects, rather than selecting whichever grants larger stats.
The active controlled host is exempt from that native alias comparison because
it has its own existing owner, not because aliases are overwritten.

On bad body state during local load, follow existing load-error and save-block
behavior; do not persist defaults over it. On import failure, no storage write
and no current model mutation. On profile/adoption storage failure, no partial
body grant, evidence, stat bucket or user message. On over-budget save, preserve
last saved life and permit existing export recovery. No public commit, private
payload or live user-save access is needed for these tests.
