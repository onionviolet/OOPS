# A4 factions, standing and institutional membership palette

2026-10-14. **INFERRED proposal, not an accepted specification or build gate.**
Extends U08/M5 and the [A4 source audit](AUDIT.md). This lane implements only a
pure relationship reader. No faction, standing or membership owner is added.

Direction comes from [User Vision](../../../../USER_VISION.md) and
[PROJECT](../../../../../PROJECT.md): several paths remain reachable, titles can
mean different things to different observers, and prices need causal reasons.
First milestone scope remains one realm and one prestige layer. World selection
follows the current canon-first priorities, not examples in this palette.

This extends the [relationship prerequisite audit](../../relationship-prereqs-2026-10-14/AUDIT.md)
and [companion palette](../../../../COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md).
Their RZ/RAU/RCL/RUI retention, authoring, permission and knowledge work stays
there. Companion C5/S/BG, R108/R114 and HC4 already own contract terms,
institutional beasts, guild methods and individual consent. This page adds the
institution's side of that link rather than restating companion kinds or care.

## Distinct owners, one useful join

| Code | Proposal | Concrete distinction |
|---|---|---|
| A4-D1 | An institution has a stable world-instance identity. A faction is one optional role it can play. | An academy can have a registrar, workroom and competing internal factions. An informal band can be a faction with no registrar. Do not make every group a legal office. |
| A4-D2 | Standing belongs to an audience toward a subject, scoped to place, issue and time. | The guild trusts your fittings, the street fears your wolf, and the registrar still refuses your forged certificate. A single global favorability score loses this. |
| A4-D3 | Membership is a recorded relationship to an institution, with status, rank/role, terms and authority. | Being admired is not enrollment; being enrolled is not a work licence; being a licensed member is not a particular trader's consent. Membership need not confer affection. |
| A4-D4 | Evidence and permission remain separate. | A witnessed certificate can be known but expired. A secret member can have actual access while the public knows nothing. Rumor changes a belief; it does not silently rewrite the registrar's record. |
| A4-D5 | Consume read adapters first; defer persistent consolidation. | The new relationship view keeps simulation and chronicle axes separate. Region reputation stays with its current native/transaction owners until a particular standing consumer needs an explicit adapter. |

A4-D1 to D5 are implementation choices to consider, not a demand for five new
subsystems. One authored service can use a tiny local registry and a narrow
membership record. Physical means, stock, location, time and willingness still
qualify the action.

## Candidate data shape

**INFERRED.** Registry definitions describe possible groups and policies;
persisted state describes actual issuances and consequences. IDs name actual
people and institution instances. Display names and shared franchise labels
never join identities across timelines or worlds.

```js
// Content definition, compiled by existing registries when a slice needs it.
const institution = {
  id: 'frontier.fitters', revision: 1, worldId: 'base.frontier',
  kinds: ['guild', 'licensing-body'],
  jurisdictions: ['village.workshops'],
  ranks: ['learner', 'fitter'],
  roles: ['member', 'examiner'],
  policyId: 'frontier.fitters.policy.v1', // world-owned admission/access rules
};

// Candidate additive expansion owner; NOT implemented by A4.
const social = {
  schema: 1,
  institutions: {
    'home.fitters': {
      definitionId: 'frontier.fitters', definitionRevision: 1,
      worldInstanceId: 'home', jurisdictionIds: ['village.workshops'],
      status: 'active', authorityActorIds: ['registrar.actual'],
    },
  },
  standing: {
    'home.fitters': {
      'player': {
        // Direction: institution/audience -> actual subject, not reciprocal.
        scopes: {
          'fitting-work': {
            axes: {reliability: 2, fear: 0},
            evidenceIds: ['fitting:paid-1'], updatedAt: 120,
          },
        },
      },
    },
  },
  memberships: {
    'admission:17': {
      institutionId: 'home.fitters', actorId: 'player',
      status: 'active', rankId: 'learner', roleIds: ['member'],
      issuedByActorId: 'registrar.actual', issuedAt: 120,
      expiresAt: null, endedAt: null, cause: 'admission:17',
      policyRevision: 1,
      credentialClaimId: 'credential:fitter:17',
      termIds: ['terms:learner:17'],
      grantIds: ['grant:workroom:17'],
    },
  },
  grants: {
    'grant:workroom:17': {
      membershipId: 'admission:17', scopeId: 'village.workroom',
      verbIds: ['use-bench'], issuedAt: 120, expiresAt: null,
      status: 'active', cause: 'admission:17',
    },
  },
  receipts: {
    'admission:17': {operation: 'admit', membershipId: 'admission:17', at: 120},
  },
};
```

This is a shape sketch, not a save fixture. All referenced actors, definitions,
claims and terms must exist in their owning registries/ledgers. Membership IDs
identify an issuance; actor plus institution may have multiple historical
issuances. A title may name a role, office, honorary award or rumor, with only
its declared grants giving rights. An active status alone does not authorize
all verbs.

| Code | Data rule to consider |
|---|---|
| A4-SD1 | Stable actual actor, world-instance and institution IDs. No implicit mapping from `Village` reputation to a fitters guild, or from an AU counterpart to the original person. |
| A4-SD2 | One writer for each standing audience and institution's authoritative register. Content effects name that writer, scope, finite delta and receipt cause. World policy supplies thresholds and bounds; ±100 is not copied globally from chronicle. |
| A4-SD3 | Membership status vocabulary can start with offered, applicant, active, suspended, ended. Declined offers and denied applications are distinct from ended memberships. Rank and office remain separate, so an elected examiner may still be a low-rank fitter. |
| A4-SD4 | Append caused admission/change/sanction/exit records once. Retry preserves cause. Another real service gets a new cause. Persistent current status and durable rights never depend on the newest 32 relationship memories. |
| A4-SD5 | Terms reference the existing claim/obligation owner. Grants express narrow rights, not custody or control of people. Temporary permission, sanction and expiry need a clock owner and reversible state transition. |
| A4-SD6 | Observer knowledge uses existing attributed knowledge records. Derived views return known/unknown, reported status and evidence; internal execution may explicitly resolve authoritative register state. Reader scope must be named, not guessed from “viewer.” |
| A4-SD7 | Membership in several groups is allowed. A world can author conflicts with concrete triggers such as incompatible oaths, rather than a universal one-faction limit. An institution may split; existing issuances then need a declared continuation or contest. |
| A4-SD8 | Definition revisions do not retroactively rewrite historical terms or permissions. A future renewal can adopt revised policy. Missing content suspends affected executable offers while retaining already saved histories and obligations. |

## Palette of forms and consequences

All rows **INFERRED**. These are selectable forms, not a required feature list.
Use Default + Dial + Reasonably from the companion palette; numerical bounds
are data safety limits, not hard social capacity or permanent once limits.

| Code | Form | Useful consequence and dial |
|---|---|---|
| A4-FAC1 | Work guild or cooperative | Skill proof opens one bench booking or request. Dues, peer sponsorship, examination or simple apprenticeship can be the entry route. |
| A4-FAC2 | Academy or sect | A rank gives curriculum access; a named mentor still decides whether to teach privately. A rival department can respect your results but dispute attribution. |
| A4-FAC3 | Court, guard or civil office | An appointment gives jurisdiction and duties. Office can survive the incumbent leaving; affection and personal possessions do not transfer with it. |
| A4-FAC4 | Faith, temple or spirit court | Ritual role, accepted offering, taboo, refuge. Membership, divine favor and a particular spirit's contract can disagree. |
| A4-FAC5 | Informal neighborhood or reputation audience | Recognition changes greetings, referrals or warnings without an admission ledger. Different streets hear different accounts. |
| A4-FAC6 | Household, clan or lineage institution | A register can recognize kinship, patronage or estate claims. A new heir inherits named rights/obligations only under that owner's succession rules. |
| A4-FAC7 | Tamer guild, animal clan or companion registry | Handling qualification, licence or treaty opens a service or route. The creature's willingness is still its own actor/link reader, as companion R114 requires. |
| A4-FAC8 | Secret circle or outlaw network | Vouched membership and concealed credentials support covert access; public standing can worsen while private recognition improves. Player knowledge follows discovery. |
| A4-FAC9 | Trade association or merchant audience | Reliable payment, scarcity, fear, sanctions and personal regard can alter an explicit quote in different directions. Public admiration need not mean a discount. |
| A4-FAC10 | External ally, contractor or tolerated visitor | Service access without full membership. A revoked contract need not expel the person from a home guild or erase completed paid work. |

## Which existing readers would consume it first

**SHOWN** column records existing seams; **INFERRED** columns propose use and
order. No reader listed here was wired to the new module or candidate owner.

| Code / order | SHOWN current reader | INFERRED first use | Guard and test before adoption |
|---|---|---|---|
| A4-C1 / 1 | `src/people_knowledge.js:16-26,52-63`, `src/people_ui.js:26`; already use evidence-qualified history | A known institution row: issued role, next permitted service and witnessed admission/sanction, with unknown status when not discovered | Keep the same introduction/evidence filter. The raw A4 relationship view is an internal authority view, not this UI. Rebuild and exercise 1366×768 before claiming behavior; mobile deferred. |
| A4-C2 / 2 | `src/simulation_effects.js:131,156-158` fact projection; `src/rules.js:2-30` scalar known/met evaluation | A named workroom service reads membership status, a scoped grant, local presence and actual means; standing may qualify an invitation, not auto-enroll | Direction and institution-instance must be explicit. Missing membership is not an active grant. Preview and commit recheck issuer authority, expiry and stock. Keep existing chronicle-only and simulation-only fact meanings. |
| A4-C3 / 3 | `src/chronicle.js:136,199-218`, `src/chronicle_ui.js:113-119` read duty, grievance and successor | Reuse the existing archive-duty shape as a design example for membership obligation and a finite succession office, without migrating it merely for uniformity | A reader can consume existing ties through the read view. No inferred guild membership, copied affection, automatic inheritance or waived grievance. Preserve current action outcomes. |
| A4-C4 / 4 | `src/conditions.js:246-252`, authored region thresholds in `src/data/locations.js:480-499`; `src/components/trader_component.js:141-145` | Availability adapter for one licence and a separate quote reason for standing, personal regard, fear or scarcity | Preserve legacy regional totals and old thresholds. Explicit policy translates a selected source into a price/permission contribution. No sum of incompatible scores; denied entry and an expensive quote differ. Actual trade settlement must honor the reviewed quote. |
| A4-C5 / 5 | `src/heir_inheritance.js:51-63,91-92`; `src/backlog_expansion_transit.js:153-160` named office/duty/credential carriers | Preview which memberships, roles or credentials survive death, heir succession and a world move | Reader/proposal only until carrier and succession owners approve the concrete rule. New heir has its own ID; a historical predecessor is not the current licensee. Preserve unresolved obligations and separately declared consents. |

A small first slice would be one optional Village workroom access grant earned
through an existing paid fitting, shown through known People history and used by
one quoted service. That is a proposal, not permission to add it now. Full faction
politics, NPC schedules, generated institutions, generic pricing and new resets
are not dependencies of the pure read module.

## Save compatibility decision

**A4-D6, SHOWN:** this lane is save-free. The reader changes no existing owner or
schema. It takes expansion state as input and creates a detached projection that
must not be persisted as authoritative state. No migration, native save access,
reload/import test or dist rebuild is needed to claim this pure module's test
slice. Native import behavior remains outside that claim.

**A4-D7, INFERRED future decision:** if a concrete slice adds `expansion.social`,
use an explicit additive migration coordinated with
[A1's migration/read-side plan](../a1/) and the current save owners
(`src/expansion_engine.js:256-270`, `src/save_files.js:73,158-190`). Missing social
state means no register entries and unknown standing, with no invented history,
neutral axis defaults, automatic faction memberships or retrospectively issued
licences. That migration must name the actual next supported expansion schema
at integration time; A4 does not reserve a schema number.

Keep legacy `character.reputation` totals byte-for-byte and keep the current
saved-total/omitted-region replay decision (`src/reputation_state.js:2-16`). A
future read-only adapter can explicitly expose a region's standing as a legacy
source, but it must not convert that number into group membership or personal
trust. Preserve chronicle axes/ties and directed simulation records exactly.
The read API's stricter memory-payload check does not change their save validators.

A migration fixture set must cover an old absent-owner save, partially present
legacy regional totals, mixed old relationship stores, zero/negative standing,
an expired/suspended membership, a missing institution definition, and an heir
with retained duties. Import preflight stays atomic. Unknown retired definitions
retain a non-executable historic record with a reason, never silently grant
access or erase debt. If the current loader cannot support this disposition,
that loader change is part of the future slice's scope, not a promise made here.

Receipts, statuses and grants need a retention decision before writing them.
Archive summaries may compact display history; they must preserve current rights,
open claims and the replay key needed to prevent duplicate admissions. A new
schema and fixture proof still require actual save/reload/literal import at the
native boundary before gameplay completion.

## More to consider

All **INFERRED**. This round adds institutional edge cases to the existing
relationship and companion owners rather than another universal build gate.

| Code | Angle | Consequence to test if selected |
|---|---|---|
| A4-M1 | Two offices recognize different credentials | The local examiner accepts a guild certificate; a border guard requires a different licence. Scope the reader to the actual issuer and jurisdiction. |
| A4-M2 | Several speakers claim to be the institution | An elected registrar, an emergency deputy and a usurper conflict. Issuer authority and the observer's belief are separate records; appeal has a real route. |
| A4-M3 | Public reputation and private sponsorship disagree | A feared worker is privately vouched for. It can produce a discreet invitation and a public refusal without averaging scores. |
| A4-M4 | Collective blame and transferred prestige | A household or companion causes a witnessed event. Decide who actually receives the consequence; association is a policy effect with evidence, not automatic propagation to every edge. |
| A4-M5 | Borrowed, forged or stolen credentials | Possession, identity recognition and authorization diverge. Reuse custody/claim and identity owners; do not make a badge item proof of valid membership. |
| A4-M6 | Contract worker, member and institutional beast | Same group, different verbs and exit terms. A licence held by a tamer does not authorize an order to every sapient clan member. |
| A4-M7 | Resignation, suspension, expulsion and reconciliation | Already paid work remains settled. Outstanding duties and current service access can change independently. Repair needs a caused act, not erasure of an old entry. |
| A4-M8 | A group dissolves, splits or changes doctrine | Membership may become historic, be contested or renew through one successor. No arbitrary ID rename that transfers every right to the new group. |
| A4-M9 | Time, dues and absence | Which clock expires a grant? Use existing supported game-time owners. Played idle reliable work can matter; general wall-clock dues/decay or offline social catch-up remain with derived-snapshots and prerequisite RI owners. |
| A4-M10 | Many groups and many audiences | Sparse active subject/audience records, bounded due-work and indexed lookups. Measure before adding global all-pairs propagation; data bounds are not a one-faction rule. |
| A4-M11 | Promotion inside a group changes whose voice counts | An examiner's new authority does not retroactively validate an old unauthorized admission. Keep policy revision and issuance cause. |
| A4-M12 | Relationship AU or same-named guild elsewhere | Branch/world-instance namespace preserves parallel histories. Cross-world recognition needs a declared treaty or correspondence bridge, not name matching. |
| A4-M13 | Reading standing through skills or reveal cheats | A public letter, fallible social inference and truth-reading have different fidelity. Reuse companion GA/GC and knowledge owners; the internal facts adapter grants none of them. |
| A4-M14 | Titles, permits and rank can be deliberately humble | Honorary titles may have no authority, while a plain stamped work pass opens a useful service. Present the actual consequence and reason, not an automatic prestige ladder. |
| A4-M15 | A new companion's own career | An animal, construct or spirit can be recognized independently from the player. If it joins an institution, its body/personhood, duties and freedom still follow their existing owners. |
| A4-M16 | Social history outlives a short memory buffer | A destroyed membership paper is not automatic expulsion; a forgotten encounter does not cancel a registered debt. Author the institutional and personal remembrance dispositions separately. |

Dependencies by owner: nonhuman starts/bonds own bodies, senses and control;
procgen wave 1 (`proc/p1-streams`, mixing, storylets, people) owns deterministic
generation; derived-snapshots owns snapshots/offline time; world-core-kit W6 owns
per-world template registration. A4 proposes joins to those owners, not parallel
implementations. None is needed to finish this unwired source lane.
