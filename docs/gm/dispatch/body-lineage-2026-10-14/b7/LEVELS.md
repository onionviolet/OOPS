# G48-B7.L: NPC body detail by relationship and need

2026-10-14. Proposal specification for [G48](../../../../GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md#g48-npc-bodies-at-the-right-level-of-detail).
No gameplay implementation or accepted balance is claimed. G1-G47 and their GN,
BD, PH, SG and LQ codes retain their meanings. This packet extends G48 rather
than redefining them. [REPORT](REPORT.md) owns the source audit and open gates.

## G48-B7.L1 Default, dial and cause

Default: every admitted individual has a stable body identity and generation
anchor. Concrete fields materialize when a supported observation or operation
needs them. Generated values and their dependencies commit to the save before
their result is published. A crowd count has no individual body records until
an individual is admitted. A named or previously observed person retains their
identity when moved to background detail.

Dial: a world may supply fully authored bodies, finer diagnoses, unusual
reproduction or deep population inheritance. A developer fixture can eagerly
materialize eligible fields to compare results. An observer's information access
is a separate dial and needs an actual world-supported means. Greater simulation
detail does not grant the player more knowledge.

Reason/cost: everyday encounters need useful physical differences, while a
clinic, inheritance or combat calculation needs more exact inputs. The engine
pays generation and save bytes; the character pays only a supported examination,
travel, equipment, procedure or other action cost. No payment is invented for
simply having a body, and no fixed number of relationships is imposed.

## G48-B7.L2 Illustrative demand bundles

Levels describe likely working sets, not relationship ranks or compulsory
reveals. A stranger can need deep medical truth; a spouse can retain undisclosed
ancestry. Request the smallest dependency-complete field bundle. The realized
level is a derived summary of saved commitments, never a permission predicate.

| Code / typical context | Truth resolved when needed | What this observer can receive | Usually deferred |
|---|---|---|---|
| L0 Background, unencountered individual | Body ID, owner-qualified person reference, seed/revision/constraint anchor; existing authored values retained | Nothing merely from registry membership | Measurements, SG1/SG2, quirks, named constitutions, loci and diagnoses |
| L1 Stranger or one encounter | Species template and age-stage basis needed for the scene; visible appearance/voice/frame features. SG1 only when actually perceived or needed by a system | Perceived features, apparent age/species, supplied address. Clothing or a sex-related impression is a perception claim, not verified anatomy | Exact height, concealed anatomy, reproductive capacity, genotype and latent faculties |
| L2 Recurring contact, friend, coworker, companion | Relevant build and quirks from shared work, food, sleep, tool fit or care; sensory/coordination dimensions needed by that work | Witnessed quirk effect, disclosed preference, fitted measurement or relevant diagnosis | Unrelated quirks, entire genetics or a whole special-body catalogue |
| L3 Rival, intimate partner, family investigation, heir, specialist patient | Physique/constitution parameters used by real actions; latent transmission inputs and qualified ancestry needed for conception, diagnosis or a line key | Observed function, received account, test result and confidence through their own route | Remaining genome, private parentage, institutions' claims and unsupported tests |

G48's stranger/friend/rival-or-spouse examples are demand defaults. The same
owner says generation happens when someone looks **or a system needs it**.
Thus an unseen combat participant gets necessary anatomy before damage; a friend
does not receive hidden genome information upon crossing a trust threshold.
SG1, SG2, SG3, SG4, SG5 and SG6 remain separate even when a scene uses several.
No player's gender setting determines NPC anatomy, attraction or availability.

## G48-B7.L3 Fields and B2 alignment

Use [B2 SPEC](../b2/SPEC.md#g24-b22-persisted-shape) as the vocabulary owner.
B2 currently specifies a **native-player** record, not an NPC generator. B7
proposes an explicitly versioned sparse NPC variant with the same paths; do not
pass it to B2's strict schema1 validator or add unchecked keys to schema1.
Genetics models and lineage attachments require their own later validated
extension, as B2 SPEC:105-109 states.

| B2 path or external authority | B7 lazy rule |
|---|---|
| physical.bodyId / physical.speciesId | Bind the actual body and qualified instance. Species truth can come from authored ancestry/template; apparent species belongs to an observation |
| physical.frame | Resolve heightKey, profileRef or real dimensions only at their demand. Save measured dimensions and developmental basis; do not infer reach from an unrelated race tooltip |
| physical.sex | Species-qualified SG1/SG2 as demanded. Unspecified means unresolved/unsupported, explicit none means a supported resolved reproductive role |
| physical.age | Stage and basis plus a future typed biological-age anchor if qualified. Keep birth/calendar, biological age, apparent age, soul age and legal majority distinct |
| physical.quirks / physiques / constitutions | B2 card instance IDs, definitionRevision, origin, acquiredAt, status, evidenceRef and validated params. Resolve only selected families; no repeated grants for existing sources |
| physical.genetics | Keep B2 unassigned reservation for unsupported models. A qualified model later supplies loci/templateRef and a frozen transmission reference, separate from expression |
| person.identity / address / presentation | Identity and address stay with the person through a body change. Self-description, what was said, and what another observer perceived remain distinct |
| person.registrations / socialRoles | Institutional statements with jurisdiction and evidence. They do not override body truth or establish biological descent |
| knowledge | Use B2 observation vocabulary and existing observer knowledge adapters with references. No duplicate whole truth snapshot per observer |
| Existing sources/faculties/conditions/body custody; P19 lineage bonds | Retain their authorities. B7 stores references or new data with no existing owner, not another effect, vitality, estate or relationship engine |

A sparse serialization may omit unresolved collections. Even an explicit empty
collection proves absence only for the saved resolved family scope, not every
possible trait. Save coverage such as `quirk.sleep@1 resolved-none`; otherwise
an empty array means no saved instances yet. A diagnosis of absence needs its
own observation evidence and scope.

## G48-B7.L4 Promotion, backgrounding and prerequisites

Promotion adds missing committed fields to the same body; it does not rebuild
the person, replace personality, advance the social RNG or erase completed
requests. Backgrounding reduces scheduling and view work, not saved truth.
Lossless packing is allowed; deleting generated traits to reroll them later
breaks G48. Real aging, healing, grooming, grafting, training and transformations
can change mutable state through dated causes. Immutable birth/template choices
and previous event-time snapshots stay fixed.

P19 NPC_LIVES.md:13-19 supplies recurring/known-background/crowd scheduling
levels, which are separate from these body bundles. P19 LINEAGE.md:7-18 keeps
biological, adoptive, teaching and office relationships distinct. Relationship
AUDIT.md:37-43 requires directed willingness and evidence-aware views without
a mandatory social-store merge. Body detail neither replaces those contracts
nor unlocks friendship, partnership or disclosure by itself.

For any later romantic/partner content, preserve the live rule in
`docs/USER_VISION.md:2055-2068,2080-2082`: both people have body ages 18+ and
adult appearance. Unknown body age, a coarse adult label, legal majority,
claimed age or a saved spouse ID does not prove that gate. Nonromantic care,
friendship, work, teaching and legacy can proceed with their own prerequisites.
Mobile optimization and a new top-level body panel are deferred; any eventual
People/body UI proof targets the existing laptop workspace at 1366x768.
