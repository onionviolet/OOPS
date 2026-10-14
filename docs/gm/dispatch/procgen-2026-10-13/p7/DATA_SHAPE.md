# Per-world grammar and person data contract

Status: PROPOSAL, 2026-10-13. Illustrative JSON-safe shapes; no exports, schemas or migration are implemented by P7. Apply [GUIDELINES](GUIDELINES.md) and each selected world profile.

## F1: inspected P4 seam and limits

Read-only P4 checkout: `.claude/worktrees/proc-p4-people`, branch `proc/p4-people`, HEAD `09403f5c948e072444d29dc41fde15caac23286a`. Its REPORT's test/browser results are inherited reports, not P7 verification.

| Current source | Observed behavior | Extension required |
|---|---|---|
| `src/name_grammar.js`, `nameGrammars` | `base.frontier`, revision 1; cultures have `id/given/family`. | Separate world pack, culture/era filters, patterns, readings and explicit weights. |
| `generatePersonName({seed,key,worldId,used,authored,grammars})` | Enumerates every given×family pair, chooses hashed offset, scans for an unblocked full/given name. Returns `name/culture/grammarRevision`; exhaustion throws. | Preserve old API. Add a new qualified admission API rather than changing legacy output determinism. |
| Same enumeration | Larger culture tables implicitly get more probability; cultures are not selected by E6's proposed weights. | Pick eligible culture/pattern/components with declared weights; do not flatten all combinations. |
| Same reservations | Lowercase/trim plus first token split on space/comma. Default reserves Village names. | Pack-local name/alias/role policies and Unicode/order/transliteration-aware comparisons. No Village defaults in canon packs. |
| `src/generated_people.js` | `createGeneratedPeople(seed,at,authoredNames)` draws exactly 3 Village travelers with its local saved RNG. | Instance-qualified creation/admission inputs; world templates and conditional demographics. |
| `validateGeneratedPeople` | Schema 1, `traveler_[1-3]`, Village cultures/revision, native bread/pelts/tails, finite purse and supply goal. | World-aware validation cannot be accomplished by merely registering a grammar. Keep this schema's validator for legacy saves. |
| `generatedPeopleView` / interactions | Limited discovered traits; Village-only meets/help/settle and saved finite possessions. Separate from simulation actors. | Per-world projection/actions and an explicit actor bridge only when another consumer needs it; never silently treat P4 IDs as registered actors. |

P4 stores frozen generated results and saved RNG, not just seeds. Keep that property. D7 household composition consumes P4 people; D8 lore binds existing names and facts. Neither owns identity generation.

## D1: pack definition

IDs below are proposed semantic IDs, not registered destinations. Direct canon data loads from an optional private pack using the existing pack seam after root integration review. Public modules contain generic contracts and synthetic fixtures. `sourceRef` locators point to qualified evidence, not raw prose.

```js
{
  schema: 1, packId: "private.example.people", revision: 1,
  worldId: "example.world", sourceSnapshotId: "example.edition",
  continuityId: "example.baseline", eraIds: ["opening"],
  grammarId: "example.names", grammarRevision: 1,
  reservationRevision: 1, demographicRevision: 1,
  sourceRefs: [{id:"S1", locator:"edition/chapter/paragraph",
    mode:"stated", quality:"supplied-edition-qualified", speakerRef:null}],
  cultures: [{id:"district.local", regionIds:["district"], eraIds:["opening"],
    languageId:"local", script:"Latn", displayOrder:"given-family",
    namingStyleIds:["ordinary"],
    patterns:[{id:"two_part", weight:3, slots:["given","family"]}],
    components:{given:[{id:"g1", value:"Invented", weight:1,
      reading:null, romanization:null, styleTags:["ordinary"], sourceRef:null}],
      family:[{id:"f1", value:"Name", weight:1, sourceRef:null}]},
    addressRules:[], allowedHouseholdFamilyReuse:true}],
  reserved: [{id:"reserved.actor1", kind:"identity", canonActorRef:"canon.a1",
    comparisonKeys:["internal canonical key"], policy:"full_and_alias",
    eraIds:["opening"], sourceRef:"S1", visibility:"author-only"}],
  cohorts: [{id:"district.work", regionId:"district", eraId:"opening",
    selectionWeights:[{templateId:"carrier", weight:4},
      {templateId:"records_helper", weight:2}],
    cultureWeights:[{cultureId:"district.local", weight:1}],
    powerProfileWeights:[{profileId:"ordinary", weight:1}],
    constraints:[], reservedRoleRefs:[], populationCap:3,
    weightBasis:"prototype, not a canon census"}],
  templates: [{id:"carrier", revision:1, provenance:"original-gap-filler",
    sourceRefs:["S1"], cultureIds:["district.local"], ageRange:[20,60],
    bodyProfileIds:["supported.adult"], occupationId:"carrier",
    factionEligibility:[], institutionRoleIds:[], powerProfileIds:["ordinary"],
    traitPoolId:"everyday", needPoolId:"belonging", goalTemplateIds:["deliver"],
    meansTemplateId:"funded.carrier", relationshipPolicyId:"original.locals",
    availabilityPolicyId:"played-local-time", knowledgeProjectionId:"intro_only"}],
  powerProfiles: [{id:"ordinary", eligibility:[], acquisitionRefs:[],
    lineageRef:null, capabilities:[], mastery:{}, resources:{},
    institutionRecognition:[], sourceRefs:[]}],
  overlays: []
}
```

This is a logical contract, not a second inventory, power registry, household graph or calendar. Means templates initialize the selected existing authoritative owner once. `powerProfiles` bind to sourced body/power/resource records; strings are not capability grants. Eligibility must resolve through typed world facts, not arbitrary JavaScript in pack data. Household chooses a shared surname once when its convention calls for one; no independent surname roll for each child.

Source quality and claim mode are orthogonal. Add contradiction records `{id, claimRefs, disposition, unresolved}`; unknown quantities stay null, not zero. A source snapshot and an AU overlay do not have the same provenance. Closed evidence gates make templates ineligible for canon implementation while retaining them as design candidates.

## D2: resolved saved person and admission

Proposed new optional owner `generated_people_worlds`, schema 1, avoids redefining P4's existing `generated_people` schema 1. Root must confirm the integrated envelope key before coding. Legacy P4 and the new owner remain disjoint and do not copy the same people. A later unification needs its own explicit migration.

```js
{schema:1, instances:{"instance.key":{
  worldId:"example.world", instanceId:"instance.key", eraId:"opening",
  regionId:"district", sourceSnapshotId:"example.edition", continuityId:"baseline",
  packId:"private.example.people", packRevision:1, overlayRefs:[],
  grammarRevision:1, reservationRevision:1, demographicRevision:1,
  nextPersonOrdinal:4, admissionReceipts:{}, occupiedRoleRefs:[],
  people:{"person.instance.key.1":{
    id:"person.instance.key.1", definitionKind:"generated",
    templateId:"carrier", templateRevision:1, cultureId:"district.local",
    originRegionId:"district", currentLocationRef:"site.district",
    naming:{civil:{given:"Invented", family:"Name", reading:null},
      displayName:"Invented Name", patternId:"two_part", grammarRevision:1,
      aliases:[], introductionReceiptRef:null},
    birthCalendarRef:"calendar.local", ageAtAdmission:30, bodyRef:"body.1",
    occupationRef:"occupation.carrier", institutionRoleRefs:[], factionRefs:[],
    householdRef:null, relationshipOwnerRef:"relationships.1",
    powerOwnerRef:"powers.1", meansOwnerRef:"inventory.1",
    knowledgeOwnerRef:"knowledge.1", secretSlotRefs:[],
    traits:["patient","curious"], need:{id:"belonging", value:70},
    goal:{id:"deliver", commitmentRef:null}, lifeStatus:"alive",
    admissionReceiptRef:"admission.1", actorBridgeRef:null
  }}, lastPlayedMinute:0
}}}
```

Names, trait results, admitted means, world profile and references are saved. Alias events append dated claims/reveal receipts; secret truth lives only in its owning sealed state. Canon cast references are authored registry entries, not generated records with `definitionKind` flipped. Do not expose this raw author record directly to UI.

Admission order is fixed: resolve source/overlay revisions → select eligible cohort → validate available roles/body/era/resources → consume one committed named people-stream allocation → derive local subkeys by instance/person/field → select template, culture and name → freeze traits/means and references → validate whole graph → durably publish once. Save RNG consumption/receipt with the admitted results. Use P1's integrated stream interface when known; no guessed export name. Preserve P4's existing derived sequence for its old records.

Preview/render/restore do not allocate IDs, draws, names, goods or secrets. Deterministic collision attempts use the same admission subkey and reservation snapshot; they do not advance unrelated streams. A failed durable write leaves neither person nor consumed allocation published. Repeated admission with the same cause returns the original receipt. Explicit new starts are different causes/instances, not a reload reroll.

## D3: constraints and projection

| Constraint | Reject or qualify before admission |
|---|---|
| Scope/source | Unknown grammar/culture/template, unsupported pack or revision, mixed continuity, disabled primary claim, unbound source-dependent capability |
| Identity | Duplicate ID or reserved full/alias/role; distinctive canon name disguised by punctuation; invalid reading/order; culture exhausted |
| Demographic | Unsupported body/age/species, aptitude-to-capability jump, illegal clan lineage, unique power/seat assigned, rank treated as skill |
| Institution/time | Occupied unique office, person not alive/present in era, invalid membership, stale AU dependencies, future knowledge injected |
| Relations/means | Invalid/self/age-impossible kinship, canon edge without policy, duplicated stock/coins, dangling holder/loan/goal target |
| Knowledge | Public view includes undiscovered alias/source/secret, inferred belief cast as truth, hidden-count/filter side channel |

Projection input is `(observerRef, personRef, knownReceipts, context)`, never a full truth object for a UI to hide ad hoc. Output may show "unintroduced worker", known civil name, observed role, public certification and supported actions. An observed technique establishes that observation, not its full inheritance or limits. An away person can retain a known contact record without presenting actionable physical presence. Receipts conserve real item/fund transfers and relationship cause; no repeated enrollment/help reward.

Bound the active cohort to three for a first proof, with a declared cap policy. This is a performance/playtest choice, not world population or canon rarity. Anonymous background people need no complete simulation. Promoted actors retain the original generated ID through a bijective saved bridge and registered/frozen templates; P4's separate store is not automatically valid in simulation's registry.

## D4: revision and compatibility

| Case | Required behavior |
|---|---|
| Old save without P4/world owner | Owner stays absent; no retroactive names, clan, household or history. Explicit supported enrollment uses the current local calendar. |
| Existing P4 schema 1 | Restore with its original validator, IDs, names/cultures/revision, inventory, knowledge and next RNG. Do not relabel its travelers as canon locals. |
| Pack grammar/table update | Existing resolved names/traits/means and active effects keep their frozen revisions. New people may use the new revision only under a declared admission policy. |
| New reservation exposes old collision | Preserve saved spelling/identity; flag internal review or safe public disambiguation. No automatic retcon, lineage grant or silent rename. |
| Missing private pack | Preserve saved state and safe already-known text; disable pack-dependent actions with neutral availability. Do not fall back to Village generation, refill or rewrite the cast. |
| Unsupported future schema/revision | Reject before durable mutation or use an explicitly supported inactive preservation mode. Never strip unknown people from an import silently. |
| Overlay or era switch | New independent instance by default. In-place conversion requires a reviewed atomic migration preserving commitments, identities, evidence and losses. |

Validation of imported private facts is not player discovery. Save/reload/Export/literal-file Import compare exact snapshots, references, resources, disclosures and the next admitted person/draw. Tests use synthetic fixtures; direct canon data and private test saves remain outside git/bundle.

## D5: smallest useful slice per world

All are future proposals. First implement one world, not this whole table. A pack can initially constrain a cohort to one culture, ordinary means and three people; a second qualified culture is needed before claiming cross-culture grammar support. Table entries are local scene candidates, not registered starts.

| World | Three generated contacts and useful loop | World-specific proof |
|---|---|---|
| HP | Nursery helper, supply carrier, household customer; deliver owned stock, receive actual payment, earn supervised work access. | Source eligibility and school/family rights stay distinct; no generated canon relative. |
| D&D | Carrier, mundane repair worker, lodging helper; commission bag repair, deliver and settle. | Rules profile fixed; a civilian occupation does not mint Wizard levels or Mending. |
| Soldier's Life | Recruit, billet supply worker, courier; take issued kit, do a duty, return same kit, gain next-duty trust. | Rank/affinity/source independent; no collector or canonical company role duplication. |
| TTKS B1 | Tenant, reagent assistant, market carrier; rent/deliver stock, retain known habits. | Claimed identity versus evidence; no random mimic truth. |
| TTKS B2/B3/B4/B5 | B2 local work contact; B3 civilian aid; B4 estate supply; B5 civilian desk applicant, each in its own three-person cohort. | Per-book retention/rights/identity policy; never one merged TTKS population. |
| MoL | Guest clerk, household supplier, workshop helper; deliver paper and earn a permission-bound job. | Mana eligibility, study and certification separate; continuous branch is explicit. |
| LOTM/COI | LOTM landlord/client/clerk OR COI inn worker/carrier/customer; settle service and hear one witnessed account. | Separate era/culture; no unearned sequence/boon or cross-era membership. |
| Shadow Slave | Civilian supplier, recovery aide, trainee contact; provision a funded preparation job. | No mandatory Aspect/True Name or divine core progression; chosen era pinned. |
| JJK | Civilian supplier, records worker, qualified support contact; arrange paid evacuation supplies. | Sight/technique/grade separate; unique abilities and canon family roles reserved. |
| Bleach | Living courier, records helper, supported observer; ordinary parcel route versus paid survey. | Buyer gains a report, not spiritual perception or a release. |
| Fate | Civilian client, repair worker, archive assistant; mundane commission with a sourced local account. | One route/era; no random Servant/heroic identity or Crest inheritance. |
| HxH | Port worker, exam traveler, lodging helper; fulfill a funded travel request. | Hunter status/Nen mastery separate; no copied signature ability. |
| FMA | Parts runner, workshop helper, customer; service actual owned prosthetic parts and return goods. | Engineer, alchemist and State status separate; branch and era pinned. |

Shared future gates: focused deterministic/constraint/compatibility checks, appropriate test/build pass, fresh rebuilt browser actions at 1366×768 and 1600×1000, actual useful consequence/refusal/failure, Save/reload/Export/literal-file Import, legacy unchanged, no secret leakage and director fiction review. These are NOT RUN here.
