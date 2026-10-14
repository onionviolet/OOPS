# G53-B11: first modification loop

Proposal, 2026-10-14. Docs only, not an implementation assignment. All new IDs,
APIs, laws, numbers, prices and probabilities below are **proposals**. Extend
G52/G53/GD1-GD5 without changing their meaning. [AUDIT](AUDIT.md) separates
current source from missing adapters; [TEST_PLAN](TEST_PLAN.md) defines the
unrun gates. B2 [SPEC](../b2/SPEC.md) and [MIGRATION](../b2/MIGRATION.md) remain
the body/identity owners. B6 [GRAMMAR](../b6/GRAMMAR.md),
[VALIDITY](../b6/VALIDITY.md) and [SAVE_SHAPE](../b6/SAVE_SHAPE.md) own generated
card semantics. This is fictional body crafting, not a medical model.

## G53-B11.1: bounded world and playable outcome

Default: an original Village clinic under a proposed `base.frontier` law
overlay `b11.home.alchemy`, revision 1. A resident alchemist diagnoses a native
adult human body, stabilizes monster tissue and applies a supported GM3 tendon
rewrite. The illustrative trait is **Ropewise Tendons**. It supplies
`body.hand_control:1`, shortening a qualifying `frontier.pack` action by one
minute through its existing consumer. A trained Conditioned grip already
provides that benefit; max stacking means no extra packing reduction from both.
Show that comparison before payment. Learned grip, knowledge and mastery stay
earned separately. The treatment never grants Climbing XP or ancestry rank.

Dial: a supported species/body gets its own carrier/recipe adapter; a service,
personal technique, sufficient constitution or explicit cheat can supply the
means elsewhere. Reason/cost: this clinic knows one tissue procedure and needs
real samples, tools, time and fees. Unsupported bodies are not globally
impossible; this provider cannot treat them yet. No fixed lifetime edit quota.

This overlay is a public synthetic design example, not a sealed world truth or
a change to B6's mundane home fixture. Implementing it later requires an explicit
home-world adoption decision and root-owned integration. The requested first
loop does not reorder canon worlds, expand prestige beyond one layer, select a
population genetics simulator or activate paused Fallout work.

Observable journey: acquire diagnosis → source/stabilize a sample → assay it →
preview capacity, delivery and reversal → choose somatic or heritable → commit
treatment → wait for the frozen outcome → recover/complete repair if needed →
use the actual packing advantage → reverse the selected change. Choice affects
future transmission state as specified below, without changing person identity.

## G53-B11.2: actions, supply and known facts

Use the actual Village and native body/world ownership checks. “Clinic open” is
an authored local service fact; the overlay's service has no daily closing
window for this proof. Busy, ended life, parked/possessed body, travel and
inventory restrictions come from the host, not a second actor controller.
Treating hosts/NPCs is a later adapter, not a reason to overwrite the native body.

If local simulation services are absent, the clinic first links to the existing
explicit local-services enrollment action. This is a visible prerequisite,
not a hidden call from diagnosis or loading. `enrollSimulation` already creates
the source/faculty/condition owners (`src/simulation.js:49-74`); root keeps its
existing enrollment effects exact. Clinic code never invokes `body.begin`,
awards Natural balance or substitutes an incomplete simulation object.

| Proposed command | Inputs and duration, proposal | Durable output and knowledge |
|---|---|---|
| `b11.read_body` (GD2) | Village service; 1 native coin, 2 game minutes | Bounded diagnostic observation of native-body eligibility, current overlay burden and tendon treatment fit, tied to body/law revision. Reads no hidden ancestry, sex or soul. No RNG or source grant. |
| `b11.buy_sample` (SO7 with SO1 supply) | 12 native coins, immediate, transfer one actual vendor-owned stabilized vial | Exact lot/unit custody changes; no faculty. Vendor starts this proposed local stock with three retained units sourced from a documented hunter consignment. No inferred named donor. Further stock needs real procurement. |
| `b11.stabilize` (SO1) | 1 owned Rat tail + 1 Glass phial + 2 coins, 4 min | One retained sample unit. Inputs held until completion. Old tail provenance is unknown individual/unknown collection time; processed time is known. This route has no extra success roll in revision 1. |
| `b11.assay_sample` (GD2/MC3) | 1 coin, 2 min; same unit held and returned | Evidence of retained lot identity, intact template, stability, purity band and this recipe's compatibility. Non-destructive; same body/unit/law unchanged gives same report. |
| `b11.apply` somatic (GM3/GD1) | 1 exact sample unit + 1 Willow bark + 4 coins, 8 min | A frozen treatment outcome, new edit/cause and, if functional, one registered acquired source/card binding. No descendants receive this somatic overlay. |
| `b11.apply` heritable (GM3/GD1) | Same sample and bark + 6 coins, 12 min | Same somatic change plus one engineered overlay allele, only on successful full establishment. Capacity includes the template burden. No offspring created by this action. |
| `b11.complete_mosaic` | 2 coins, 6 min; original edit/body and clinic required | Completes that same retained edit, establishes its requested template if heritable, activates its source. No new sample, draw, extra burden or new card name. |
| `b11.rest_hands` | No fee, 3 min at clinic; this treatment's soreness cause required | Removes only B11-caused body.sore_hands; no reversal, training grant or unrelated scrape removal. Available without the separate body.begin enrollment. |
| `b11.reverse` | See .7 | Scoped removal of body/template changes, retaining receipts and unrelated life progress. |

All material names above reuse existing templates where available; sample
vial/carrier, provider, consignment and commands are new proposals. Register
Willow bark and phial availability before claiming the route is reachable:
proposed initial stock is 12 bark at 4 coins each and 8 phials at 10 coins each,
transferred from actual retained vendor holdings. Restocking requires real
deliveries or existing procurement, not reopening the view. No forced combat grind: the purchased
sample route is sufficient for the first proof. Native rat drops remain the
independent hunt route; its .04 drop chance is not changed or claimed seeded by
this spec. An obtained old Rat tail remains usable after stabilization.

Sample truth is generated/frozen at the lot's actual creation, including vendor
initial procurement, not at assay/use. Revision-1 admitted lots are intact,
stabilized and recipe-compatible by authored definition; the UI knows that only
through provenance/assay. Quality is a retained proposed band, not another random
power bonus. Unsupported/unresolved template references reject before payment.
Known incompatible/degraded lots can be studied, but this clinic cannot apply
them. Foreign, counterfeit and unstabilized variants need separate authored
lot profiles before admission; they do not slip into the first table.

Default: stabilization prevents decay; the character's absence costs nothing.
Dial: a later harsh world may author freshness/preservation with its own clock
and disclosed consequence. No decay or spoilage system is added to the default
home loop. Quality, purity, compatibility and provenance remain separate typed
fields, not one universal “blood purity” score.

Diagnosis is optional. A player may proceed blind with the exact disclosed
blind risk envelope in .6. Blind admission still validates actual carrier,
body and capacity on detached state. If a hidden incompatibility prevents a
procedure, give a bounded provider reason without identifying hidden faculties.
Unknown properties never become a free full genome read through preview errors.
“Diagnosed” for .6 means both body reading and same-unit assay are valid for the
current body, template and law revisions. Repeated visits cannot reroll either.

## G53-B11.3: owners and versioned data shape

One B2 body record remains canonical. Proposed extension: retain `schema:1`,
advance B2 `revision` to **2**, and add optional `modification` to that record.
Revision 1's strict validator cannot accept these fields. Root must reconcile
and implement the revision before code; B11 does not edit B2. B2 physical,
person, observations, worldProfiles and legacy aliases retain their contracts.

Material custody can outlive this body. Shared immutable samples, cards,
templates and receipts therefore live once in optional envelope
`body_modification_archive`, schema1/revision1. The native record owns only its
current edits and pending work. This archive is not another body/person,
inventory or simulation. References below use `archive` for that envelope owner.
Its first creation/procurement occurs in explicit clinic enrollment, not load.

| Owner/path | Proposed contents and invariant |
|---|---|
| `character.body_record.modification` | Optional schema1 revision1 owner for current native-body edits and pending work. bodyRef equals physical.bodyId. bodyEpoch increments on supported physical/template change, separately from schema revision; diagnostics pin it and the relevant law/profile fingerprint. No duplicate person/inventory. |
| `physical.genetics` | Remains `unassigned` for somatic-only edits. A successful heritable edit explicitly adopts model `b11.overlay@1`; `loci` describes engineered overlay slots only, not a discovered entire genome. `templateRef` points at a frozen overlay template below. Null allele = no engineered overlay at that slot, not absence of natural genes. |
| `physical.physiques` | B2 instance `{id, definitionRevision, origin, acquiredAt, status, evidenceRef, params, sourceId}` referencing the frozen card/source. `params` holds only validated `cardRef`/`editRef`. Each collection ID unique. No second reward from listing a card. |
| `archive.cards` | B6 semantic ledger: resolved intrinsic tuple, law/context revisions, generation cause/slot/receipt, spelling and source binding. First catalog has one authored registered archetype, not arbitrary imported executable grants. Card identity survives suppression/removal. |
| `archive.samples` | Lot definitions plus individually identified units, template/product refs, donor provenance, recorded custody events and draw receipt refs. Inventory/escrow remains the sole current quantity/holder authority. Consumed units remain referenced history. |
| `modification.edits` | Edit ID, body, target locus/tissue, sample unit, requested mode, definition/law revisions, full outcome, load vector, scoped before-values, card/source references, lifecycle and reversal receipts. |
| `archive.templates` | Immutable engineered-overlay snapshots. Each change creates a new templateRef. Prior templates stay for births, clones or evidence that actually references them. No live pointer from a child to a parent's mutable body. |
| `archive.causeIndex`, `archive.receipts`, `archive.retiredBodies` | Durable idempotence/receipt authority across native-body replacement. Retired-body entry holds the final moved edit ledger, never another active body or automatic inheritance. |
| `modification.pending` | Null or one typed clinic job: cause, command, expected body/template/law revision, admission/due clock, held inputs/currency, frozen plan, result receipt, continuation/cancellation state. Native actor-busy checks include it. Not copied into `expansion.pending`. |
| Existing actor sources/faculties | Registered `b11.ropewise_tendons`, revision1, kind trait, origin acquired. Source receipt points to edit settlement; active faculty reflects full functional expression. Nothing changes trained `body.conditioned_grip`. |
| Existing B2 knowledge | Diagnostic claims `{path,stage,value,at,evidenceRef}`; extend the path allowlist for B11 observations. Raw sample truth/outcomes do not live here. Simulation observers can reference that evidence without copying all truth. |
| P1 RNG owner | Immutable root, namespace/version and draw receipts. B11 stores references and resolved outputs, not a competing RNG cursor. Fallback proposal in .8. |

Illustrative **partial object**, not a loadable full envelope:

```json
{
  "character": {
    "body_record": {
      "schema": 1,
      "revision": 2,
      "physical": {
        "bodyId": "native.player.body",
        "genetics": {
          "model": "unassigned",
          "loci": [],
          "templateRef": null
        }
      },
      "modification": {
        "schema": 1,
        "revision": 1,
        "bodyRef": "native.player.body",
        "bodyEpoch": 0,
        "lawProfile": {
          "id": "b11.home.alchemy",
          "revision": 1
        },
        "edits": {},
        "pending": null
      }
    }
  },
  "body_modification_archive": {
    "schema": 1,
    "revision": 1,
    "sequence": 1,
    "samples": {
      "sample:b11:1": {
        "lotRef": "lot:b11:1",
        "unitOrdinal": 0,
        "materialRef": "Rat tail",
        "templateRef": "b11.rat_tendon@1",
        "origin": {
          "route": "SO1",
          "donorRef": null,
          "collectedAt": null,
          "processedAt": 20,
          "evidenceRef": "receipt:b11:stabilize:1"
        },
        "quality": "intact",
        "purityPermille": 1000,
        "preservation": "stabilized",
        "compatibilityProfile": "b11.human_tendon@1",
        "status": "available",
        "causeRef": "cause:b11:stabilize:1"
      }
    },
    "cards": {},
    "templates": {},
    "causeIndex": {
      "cause:b11:stabilize:1": "receipt:b11:stabilize:1"
    },
    "receipts": {
      "receipt:b11:stabilize:1": {
        "kind": "stabilize",
        "at": 20,
        "bodyRef": "native.player.body",
        "sampleRef": "sample:b11:1"
      }
    },
    "retiredBodies": {}
  }
}
```

Every successful mutation increments archive.sequence; native body edits also
increment modification.bodyEpoch. Pending jobs pin both at admission and advance
their own expected receipt on supported start/settle transitions. Schema revision
does not increase after each action. The archive exists whenever any held sample,
current/retired edit or transmitted template references it; an orphaned reference
rejects. An empty disabled body need not have a modification object. Sample
material-template IDs resolve registered definitions; engineered templateRef
values resolve immutable archive.templates entries, with distinct typed validators.

Canonical new carrier key proposal:
`{"id":"B11 stabilized sample","sample":"sample:b11:1"}`. `sample` identifies
one physical unit, count exactly 1 across all holders plus pending escrow.
LotRef shares immutable properties across units. Multiple aliquots require new
unit IDs and a conservation receipt, not copying a string. First slice uses
whole vials. Canonical serialization orders `id` then `sample`; unknown fields,
aliases or duplicate physical-unit holdings reject. This identity extension
must be wired into getItemFromKey, inventories, trades/chests, acquisition and
save validation. It cannot ride on the ordinary JSON-key validator alone.

Sample status available/held/consumed is checked against the owning inventory
or escrow; historical custody is not a second live holder. Assay holds a sample
without consuming it. Apply changes held → consumed at treatment start. Save
records after consumption cannot be sold, used or regenerated. Reserved native
materials use their complete keys; equal template names cannot substitute.

Edit lifecycle: `pending` → `active` / `mosaic` / `rejected` / `aborted`;
active or mosaic can become `body_removed`, `template_removed` or `removed`
according to the independent current-body/template state. Store explicit
`somaticPresent` and `templatePresent` booleans to remove naming ambiguity.
“Suppressed” by a world is a faculty execution state, not edit deletion.
Rejected/aborted are history and consume no enduring budget. Mosaic reserves its
whole proposed load until completed or reversed.

Source ownership: `binding` stores sourceDefinitionId, sourceRevision,
acquisitionReceiptRef, editRef and status. At most one living tendon-archetype
binding for this particular treatment; duplicate active application is rejected
before costs. Replacement requires reversing or an explicitly priced revision
procedure. This is one tissue's same template being rewritten, not a universal
one-mod rule. Reapplication after removal is a new edit on actual inputs.
Source removal is allowed only if its acquisition receipt still matches that
edit. If another source owns the ID, fail validation rather than remove it.

B6 integration: map the authored card to the B6 mechanism/trigger/function/cost/
discovery/transmission/name/context contract. The modifier is GM3 acquired
tendon structure, continuous when tissue is usable, `hand_control` handler r1,
no operating fuel, work/clinic discovery, mode-specific transmission, home
naming and original-overlay context. It is not B6's learned-callus H-M2 tuple.
Generated cards become admissible only after their exact handlers, burden,
delivery, before-state and reversal contract qualify under this world profile.
Copy intrinsic B6 card once into the shared archive; other collections store
references. No arbitrary generated multiplier, eval, inherited mastery or
string-matched canon ability is admitted.

## G53-B11.4: local capacity arithmetic (GD3)

**Every value in this section is a proposal**, not RimWorld tuning or real
biology. Budget axes are independent integer load units: C = complexity this
clinic can establish, M = continuing metabolic regulation, S = stability load.
Only this overlay's engineered changes consume these units; do not assign costs
retroactively to existing race, quirks or unknown constitutions.

| Component | C | M | S | Meaning |
|---|---:|---:|---:|---|
| Default qualified native-body/clinic limit | 6 | 4 | 4 | Local baseline, pinned in law/body diagnostic revision |
| Ropewise Tendons somatic component | 3 | 2 | 2 | Persistent altered tissue, operating food/fuel cost zero |
| Heritable template component | 1 | 1 | 1 | Added only while templatePresent, even if current body is reversed |
| Soreness/rejection episode | 0 | 0 | 0 | Timed recovery condition, not a capacity refund or permanent flaw |

Admission computes per axis:
`after = existingLiveLoad - explicitlyReplacedLoad + newSomatic + newTemplate`.
Require each `after <= limit` and every operand finite, safe nonnegative integer.
Other pending reservations also count, but one actor cannot start two procedures
in this clinic. Never average axes or exchange S for C without an authored rule.
No negative-load flaws or free points from side effects in this profile.

Examples: empty → somatic = `(3,2,2)`; empty → heritable = `(4,3,3)`;
existing qualified edits `(2,2,1)` plus heritable = `(6,5,4)`, rejected for
M by 1, although C/S fit. Exactly `(6,4,4)` fits. Synthetic multi-edit fixtures
test arithmetic without declaring extra live archetypes. Body-only reversal of
a heritable edit leaves `(1,1,1)`; template-only reversal leaves `(3,2,2)`;
full reversal releases `(4,3,3)`. Suppressed tissue still exists and occupies its
somatic load. A rejected edit occupies none.

Default requires a provider-qualified supported body profile. Dial: a developed
constitution can supply a registered capacity modifier, e.g. proposed `+2 M`,
or a better procedure may reduce a specific load vector. Reason/cost: actual
regulation and different means, earned through its own body/source route.
Neither ancestry names nor rarity raise capacity. Clean worlds can set high
capacity and zero side effects. Strong constitutions need no invented curse.

Over-budget treatment is not available at this clinic; removing an existing
edit or finding better means is the visible route. A later reckless clinic can
author overload with an explicit harm/reversal table. No silent clamping,
emergency death or forced hunger is invented. A later capacity loss retains
the existing body and blocks further additions; it does not spontaneously
delete edits. Any resulting dysfunction needs its own local rule. Ordinary
potions never raise capacity unless a future definition explicitly does so.

## G53-B11.5: function, stacking and causal feedback

Register `b11.ropewise_tendons` granting `body.hand_control:1`; keep capability
stacking max. Full expression contributes once. Existing `frontier.pack`
consults the resulting capability and hand tenderness through its existing
duration modifier order; freeze duration at admission. Expected untouched
comparison: 4 → 3 minutes with this source alone; craftsman's lesson 2 → 1;
already trained Conditioned grip + treatment remains 3 (or 1 with the lesson).
Soreness adds the existing 2 minutes, so 4 - 1 + 2 = 5 until recovery. No body
change edits an already committed packing job. Respect the action's no-kit and
unsurveyed gates rather than loosening them to make tests easier.

The source grant predicate must bind the actual controlled bodyRef, usable
established tendon tissue and a qualified destination action adapter. Travelling
retains ordinary altered tissue and its load; an unsupported execution adapter
leaves the function unavailable without deleting the edit or template. Returning
restores only supported execution, never spent inputs or a new result. A parked
native body cannot supply hand control to an unrelated possessed host.

Mosaic: card/body change exists but faculty remains inactive; it contributes no
hand control until `complete_mosaic`. No half-strength grant is used because the
current packing threshold would not express a meaningful half-minute benefit.
No template is established from a mosaic result until completion. UI explicitly
says “Heritable establishment incomplete” if that was requested.

Default social response: the alchemist knows the procedure they performed; the
craftsman learns only from a requested hand/work demonstration. No automatic
reputation, registry or family-tree update. Dial: a world with visible markings,
inspection laws or competing clinics can author corresponding evidence and
responses. One bodily tell in this proof is steadier pressure while tying the
kit; it establishes function, not donor ancestry or a changed personality.

## G53-B11.6: side effects and frozen outcomes (GD4)

Proposal r1: one integer outcome draw `r` in `[0,9999]` at paid admission,
retained privately until settlement. The diagnosed/blind risk class is frozen
from .2. Each row covers the entire outcome, not independent rolls that could
contradict one another. No roll at load, condition expiry or panel opening.

| Outcome ID | Diagnosed range / chance | Blind range / chance | Exact settlement consequence |
|---|---|---|---|
| `established` | 0-6999 / 70% | 0-3999 / 40% | Functional somatic edit/source; requested template established; no new condition. |
| `sore` | 7000-8999 / 20% | 4000-7499 / 35% | Same full edit/template, plus existing `body.sore_hands` for 20 game minutes from settlement. Use three-minute clinic rest, existing recovery when eligible, or let played time expire it. |
| `mosaic` | 9000-9799 / 8% | 7500-9499 / 20% | Whole load reserved in nonfunctional mosaic edit; no active faculty and no transmissible allele. Complete it for 2 coins/6 min or reverse. No reroll on repair. |
| `rejected` | 9800-9999 / 2% | 9500-9999 / 5% | No lasting edit/template/source; consumed sample/bark and fee remain spent; 20-minute `body.sore_hands`; diagnostic receipt records this procedure's rejection only. |

Applying soreness follows the existing condition owner's `max` intensity and
new-expiry semantics. Existing body.recover requires separate body enrollment; clinic rest instead
checks a soreness cause from B11 and removes only that condition. Admission
blocks while already tender in the baseline
clinic, so it cannot shorten a preexisting episode. Reversal can proceed while
tender and preserves that episode's existing expiry. It does not apply a new
shorter soreness condition. Waiting uses authoritative game time; closing the
browser adds no newly invented elapsed-time simulation.

Default has no automatic lifespan loss, addiction, off-target identity change,
fertility inference, hunger death or unseen genetic curse. These are possible
world dials requiring their own declared carriers, known risk envelopes and
reversal entries before admission. A clean profile can make established 100%;
an exposure profile can choose a seeded compatible card and larger known risk.
No requirement forces every advantage to have a penalty.

## G53-B11.7: reversal, suppression and GD1 transmission

Before Apply, display the available reversal for **both** requested modes.
Store only the target locus/tissue before-values and owned source bindings.
Reversal uses compare-and-swap against that edit's after-values. If another
procedure has since changed that target, stop for a new diagnostic/removal plan
without charging. Never restore an old whole save/body snapshot, refund prior
playtime or remove unrelated training/injuries.

| Request, proposal | Cost/time | Exact result and retained consequence |
|---|---|---|
| Remove somatic component | 1 Willow bark + 2 coins, 6 min | Removes this edit's functional source/tissue overlay, including mosaic; does not touch learned Conditioned grip. Restores that owned tissue target's before-value. Existing soreness and evidence persist. |
| Remove template component | 2 coins, 4 min | Restores that engineered overlay allele to its prior value, writes a new frozen template. Does not remove present somatic benefit or change already conceived children. |
| Remove both in one procedure | 1 Willow bark + 4 coins, 10 min | Atomic scoped combination of the two operations. Mosaic heritable requests have no established template, so charge only somatic removal. No refund of sample or original fee. |
| Suppression | No clinic toggle in r1; later local ability may suppress expression | Source/faculty deactivates but tissue/template/load/history remain. Suppression is not reversal. |
| Permanent/partial removal in another world | Only if that world's method explicitly authors it | Show residual burden, scars, faculty and transmission before commitment. This r1 clinic's scoped overlay removal leaves no lasting new scar; past observations remain. |

Reversal has no random failure in this profile. Removal of a component already
absent is a no-op with no charge, not another reversal receipt/reward. Historical
cause IDs remain to prevent duplicate settlement. Reapply through actual supply
and payment after removal; there is no fixed lifetime once rule.

**Heritable choice is more than a label.** A fully established heritable edit
writes a `b11.overlay@1` locus `tendon.pack` with two engineered overlay allele
slots. For this first acquired edit, fill the first empty slot with its frozen
`templateAlleleRef`; remaining slots null. If this same trait allele already
exists in either slot, a repeated equivalent edit grants no new inheritance
probability and cannot silently create a homozygous lineage. Additional allele
engineering needs a separately previewed procedure. Somatic choice writes no
locus. A heritable edit does not infer fertility or change SG1/SG2.

At an actual supported conception event, freeze each participating parent's
template snapshot. For each registered overlay locus, choose slot 0 or 1 from
each biological contributor with an independent keyed 50/50 draw, retaining
the chosen allele or null. One heterozygous edited parent and an unedited parent
give proposed 50% carrier chance; two give 75% at least one copy. Equal alleles
express once under max stacking. This is a game model of engineered overlays,
not a general account of polygenic traits. No offspring/body or NPC is created
by a calculation-only match preview.

Expression: transmitted potential is present in the newborn template; this
tendon trait activates only at that species adapter's authored usable-hands
development stage. It supplies hand control, never the parent's crafting,
Climbing XP, memories, title, loyalty or germline-edit procedure. Recipient
budget is resolved from their own body. Inherited template load is `(1,1,1)`
per distinct tendon archetype, even with two identical alleles; somatic
`(3,2,2)` begins at expression. Insufficient capacity never rejects a birth or
erases an allele: retain the carrier, block further edits and wait for supported
expression with a clear diagnosis. The child pays no parent's procedure fee and
gains no stored sample. Expression creates its own receipt with origin inherited.

Somatic reversal in a parent leaves their heritable component unless explicitly
removed. Template reversal affects only conceptions after that reversal;
children and already frozen embryos keep their snapshots. Adoption and chosen
heirs convey actual property/teaching under B3, not these biological alleles.
Clones require a stated somatic versus germline template-copy route, not this
birth resolver. Death/body loss preserves only what a real carrier retains.
B6 G7 supplies the transmission-cause contract: this local allele rule is a
qualified overlay-specific table, never the random-adult card pool.

New-life transitions retain the shared archive and mark retired source bindings
severed; they do not activate old faculties in the new body. The first clinic
slice must implement template write/removal and a pure tested
transmission resolver. Natural conception/development/first-heir gameplay joins
remain a distinct B3/world gate; do not claim playable heredity from that unit
test or invoke generic current rebirth to copy the body record. No offspring UI
is required to complete the initial clinic treatment proof.

## G53-B11.8: deterministic causes, clock and atomic publication

Default: integrate the common P1 root/namespace service. Proposed namespace
`body.modify@<worldInstance>` with stable keys
`<bodyId>|<sampleUnitId>|<procedureCause>|<lawRevision>|outcome`.
B6 card generation stays in its qualified `body.gen@<worldInstance>` namespace;
card naming and modification outcomes use independent subkeys. Use one provider
receipt for the authored archetype; do not fabricate a random tuple draw for a
single fixed card. Arbitrary catalog ordering, unrelated combat and diagnosis
cannot shift a committed result. Names are frozen, not regenerated on display.

P1 is not established as integrated by this audit. Proposed legacy alternative,
requiring root's explicit compatibility adoption: create an immutable
`b11LegacyRoot` once on the first successful paid clinic transaction from a
single host entropy value; save it atomically before any B11 decision. Label it
as a new domain root, not the original save seed. Failed storage publishes
neither root nor that transaction. Subsequent loading never creates/replaces it.
Store fallback root registration in archive.rngRegistration with rootRef,
namespace and algorithmRevision. Use a versioned shared keyed generator with
published golden vectors at
implementation; do not reuse the mutable `state.rng` as the root. Until one of
these routes is bound, RNG integration is OPEN and the loop is not playable.

Within the selected keyed RNG adapter, normalize an unsigned 32-bit draw as
`u = draw / 4294967296`; `r = floor(u * 10000)`. Test all outcome boundaries
directly through injectable draw values and preserve the integer receipt.
This mapping and .6's intervals are specified even though the host mixer is
unbound. No UI or Math.random calls participate in a modification result.

| Stage | Proposed semantic API, not existing export | Invariant |
|---|---|---|
| Preview | `previewModification(knownContext, request)` | Pure, observer-filtered. Show exact known loads/costs, mode, plausible outcomes and reversal. Unknown capacities show a conservative provider range, not hidden trait counts. No cause/ordinal allocated. |
| Admit | `stageModification(candidateEnvelope, request, expectedSequence)` | Revalidate active owner/actor/body/world/location/service, no conflicting work, stock/diagnostics/laws, actual capacity and definitions. Clone all touched owners; allocate stable cause after eligibility, draw once, freeze every possible result handler and selected result. |
| Reserve/persist | one host transaction | Hold exact vial/bark/coins in pending job, mark sample held, save job/result/receipt/RNG/body changes together with the entire existing envelope. Validation and guarded write precede publication. |
| Start treatment | first scheduler advance past admission | Change held materials/currency into consumed/spent; mark job started durably. No extra clock or draw. Cancellation before this point returns exact inputs; time is still spent. |
| Settle | `settleModification(jobId, cause)` | At due clock, apply frozen result to that target, release reservation, publish source/faculty/card/template/knowledge once. Validate full envelope then write. Duplicate settled cause returns prior result without costs/reward. |
| Reverse/repair | same staged publisher, new command cause | No new random outcome. Preserve original edit/card IDs and source ownership. Costs, target compare-and-swap, receipt and source updates share the write. |

Use existing authoritative home game minutes and the host's mapping to expansion
time. Store both the clock identity and admission/due integer values, never a
new Date-based timer. Register clinic boundaries with the host time advance
adapter, not `setInterval` inside an open panel. One pending clinic record is
the sole queue entry and reserves that provider/actor. Clinic can be closed in
the UI while time runs; treatment progresses while the actor remains supported
and idle. Future automation repeats only explicit authorized plans on actual
stock, not unlimited implicit self-experimentation.

Cancellation before started returns vial/bark/coins exactly. Cancellation after
started forfeits consumed inputs/fee, records aborted without edit/allele/source,
and applies 12-minute soreness. This home provider performs no partial surgery
before settlement. Both paths retain the cause/outcome receipt; resume of the
same pre-start-cancelled plan reuses it with the same exact inputs/revisions.
A genuinely newly paid procedure is a new cause, not a free reroll. Its possible
different outcome is ordinary renewed treatment, not reload manipulation.

The actor cannot initiate travel, body swap or another native occupied action
while treatment holds them; show the actual busy reason. A host-forced relocation,
life end, body replacement or invalidated provider pauses settlement for an
explicit abort/support resolution, preserving the frozen outcome and held/spent
state. Ordinary loading validates consistency without settling or advancing
time. Existing offline policy remains authoritative; this slice adds no
closed-browser progress or absence penalties. Long played-time advances split
at started/due/condition boundaries and match minute stepping.

On write/quota failure, publish no new body, sample debit, source, knowledge,
message, draw state or calendar for that staged boundary. Keep the pending job
and previous save recoverable. Prepare native publication before write so it
cannot fail midway; a post-write rendering failure recovers from committed state
without rerunning effects. Do not combine `commitMixturePlan` and a body write
as two transactions. If P2 contributes a product later, reference its retained
product and include its debit/exposure changes in this same envelope plan.

## G53-B11.9: method availability is a world dial

This table covers G53, not eleven required systems. Providers, recipes, cost and
attention must exist before enabling a method. A world may have a real absolute
law, but a missing adapter is implementation scope rather than that law.

| Methods | Home-overlay default | Dial, in-world reason and cost |
|---|---|---|
| GM1 selection | Not implemented by this clinic | Farming/breeding institutions or household routes can supply it; generations, stock and care, not an instant personal procedure. |
| GM2 mutagens/exposure | Provider not equipped | Radiation/wild-alchemy site can expose a body through a declared table; diagnostic uncertainty, access and recovery differ. |
| GM3 alchemical rewrite | Available for one qualified tendon procedure, both GD1 modes | Different ritual/recipe/lab can broaden targets, eliminate side effects or supply more capacity through real means. |
| GM4 grafting/chimeras | No qualified graft practitioner | Surgeon, donor organ and aftercare can enable it; custody, donor loss and identity/control get their own contracts. |
| GM5 precision editing; GM6 vectors | No local instruments/delivery profile | Tech service or higher-level system can supply sequencing/delivery; off-target/spread rules only when the chosen method supports them. |
| GM7 nanotech; GM8 gene-organs | No local fabrication/provider | Import a real device/organ and compatible power/service; maintenance and ownership follow that carrier. |
| GM9 uplift; GM10 de-extinction | No selected agency/organism model | A suitable laboratory/rite can enable them with actual new organisms, preserved templates and social consequences. |
| GM11 gene drives | No population propagation model | A world can support an ecological programme with actual carriers/reproduction and affected institutions, not a clinic checkbox. |

Higher-level cheats can supply missing methods if they actually provide the
read/design/delivery/control functions. Local factions learn through witnesses,
records or examinations; possession of a rare method does not cause automatic
global hostility. Corporate locks, subscriptions and compulsory stigma stay
GD7/GD8 dials, absent in this clinic. GD9 production and GD10 identity drift
remain possible, not new mandatory meters.

## G53-B11.10: 1366x768 desktop UI contract

Target: Workspace at 1366x768 CSS px, 100% zoom, ordinary laptop text. Visible
outcome: read current body, selected sample, after-budget, GD1 choice, risk and
reversal before committing; see pending time and a clear return to Local
actions. Mobile optimization deferred. Preserve character/vitals, inventory and
other independent panels; do not replace the entire workspace with an editor.
B8 owns the wider [body UI lane](../b8/CURRENT_UI.md); B11 adds only the clinic
task view and B2 known-body summary links.

Proposed 760x570 task region in the existing action/crafting workspace, when that
region is allocated enough width. At narrower saved module widths, stack these
same sections with a sticky action row; allow the user to widen the module
without resetting their layout. Keep the compact body summary in biography.

```text
Village clinic                       Body details     Back to local actions
Native body: known diagnostic summary        Clinic: ready / real busy reason
+--------------------------+----------------------------------------------+
| Sample / custody         | Ropewise Tendons                              |
| Owned exact vial         | Packing 4 -> 3 min; existing grip: no extra    |
| Tested / untested        | [Somatic] [Heritable]                          |
| Buy / Stabilize / Assay  | Complexity 0 -> 3 / 6                         |
| Source evidence         | Regulation 0 -> 2 / 4; Stability 0 -> 2 / 4   |
|                         | Known risks and timed recovery                |
| Current body diagnosis  | Reversal: 2 coins + bark, 6 min                |
| Read / repeat reading   | Heritable mode adds template terms here       |
+--------------------------+----------------------------------------------+
| 1 vial + 1 bark + 4 coins; 8 min        [Begin treatment] [Keep body]    |
+-----------------------------------------------------------------------+
Pending replaces action row: 5 min remaining; inputs spent; Abort: terms
```

Layout proposal: header/status 70 px; two columns 228/496 px with 12 px gap,
main reading region 380 px; action/status region 90 px; remaining spacing 30 px.
These are fit targets, not an observed screenshot. Body text >=14 px, line
height >=1.4; controls use text labels, not hover-only icons. Risk/reversal stays
reachable in the main region and the action row keeps exact payment/time.
No page-wide horizontal scrolling. Long provenance/history scrolls inside its
own expanded region; it cannot hide Apply/Back by extending the whole page.

Before assay, show “Untested; blind treatment risk…” and known provenance,
not hidden quality, rolled outcome, card ID, rarity or ancestry. After diagnosis,
show supported facts and their scope/date. A rejected or mosaic result gets a
specific work/recovery route and named consequence. Reversal preview distinguishes
“this body”, “future descendants”, and “both”; existing offspring are explicitly
outside the removal target. Keyboard radio selection and focus order match
reading order. Focus remains on the selected field during clock updates and
returns to the opener after Back. Accessible names, DOM data attributes and
tooltips obey the same knowledge boundary as visible text.

No UI behavior/fit claim until an own rebuilt candidate exercises this at the
target viewport, plus a wider desktop and saved-layout/text-zoom regression.
No live UI was changed or inspected for B11; wireframe is proposal only.

## G53-B11.11: migration and compatibility

| Input/boundary | Required later behavior |
|---|---|
| No B2 or B11 domain | Run B2's neutral migration only when B2 is implemented; keep both B11 native modification and shared archive absent. No enrollment, entropy draw, diagnostic, ancestry or body alteration from loading. Legacy cosmetic profile remains unchanged. |
| Valid B2 schema1 revision1 | Pure lift to revision2 without `modification`; preserve every physical/person/profile/knowledge value. Absence is disabled, not a corrupt empty edit state. |
| Valid revision2 with B11 | Validate all data and cross-references on detached state. Restore frozen samples/cards/results/names/templates; no regeneration, new root, awakening, settlement or rebalancing at load. |
| Present null/array/malformed B11 or unsupported revision | Reject with existing load/import recovery behavior before active mutation/storage. Never turn corrupt presence into absence. |
| Genetics unassigned | Remains unassigned through somatic play. First established heritable edit explicitly selects the overlay model and snapshots only engineered loci; do not pretend to sequence unknown natural genes. |
| Duplicate source, dangling sample/card/template, double-owned unit, forged receipt, target mismatch | Reject entire candidate; do not pick the most beneficial version or repair by a new roll. |
| Existing earned grip/balance, P2 mixture, possession, unsupported body/world | Preserve their owners exactly; B11 adds no duplicate bonus, native-body overwrite, mixture conversion or automatic law adoption. |
| New life/body replacement | Settle or explicitly abort pending work under its terms; move the old body's final edit ledger into archive.retiredBodies; preserve archive samples/templates/cards and actual world stock. Create fresh B2 physical/person state and a fresh body ID from the existing life-initialization cause. Do not reuse native.player.body for another body or grant its sources. Retained inventory/heir transfer follows existing policy with the same unit refs. Body-copy is not transmission. |
| Older executable/downgrade | Not supported after adoption. Keep an untouched fixture export before opting in; old builds may ignore the domain and lose it. Do not call forward compatibility downgrade safety. |
| Rules/catalog update | Keep pinned old resolvers or explicitly migrate with before/after values and receipt. Unsupported active definitions reject; no silent disable-and-save, regeneration or changed outstanding terms. |

Load order: decode/legacy preparation → B2/B11 structural and cross-envelope
validation → resolve pinned definitions/RNG/templates → bind sample/card
lookup → inventories and pending owner → sources/faculties/conditions and body
projection → native stats/action previews. Extend both local load and import
preflight. Existing full-envelope import remains decode → validate → real-loader
probe → guarded write → reload. No validation step writes to storage.

Normal Save and Export serialize the current body owner and shared archive once
each, plus existing
sources/knowledge/conditions in their owners. Compare body fields separately
from existing ordinary Export rewards and saved-at timestamps. Literal-file
Import into a fresh fixture origin replaces the whole envelope; do not merge
new costs with an older body or retain a newer RNG root. Preserve user saves;
all migration/native tests use generated fixture lives.

Validation uses closed keys, plain objects, safe IDs/no prototype keys, supported
integer revisions/clock/sequence, finite typed loads/probabilities, exact allowed
alleles and action/handler refs. Check cause index ↔ receipts ↔ edit ↔ card ↔
source/faculty ↔ body bidirectionally. Check pending held/spent conservation and
all inventory holders. Conditions keep their own expiry/source cause. A
removed card can retain a historical severed binding but cannot claim an active
source. Strings render as plain text, never executable params/HTML.

Proposed engineering targets: disabled B11 adds no B11 bytes; one sample plus
one edit and receipt/card target <=8 KiB UTF-8 delta; ten complete cycles target
<=48 KiB. Measure UTF-8 and UTF-16 storage deltas including envelope keys; these
are targets, not biological caps or reasons to discard history. Retain all
referenced samples, templates and idempotence receipts. Existing shared 4 MiB
storage guard remains authoritative; fail safely before optional new work when
it cannot fit. Future archival needs a separate reference-preserving migration,
not truncation of active history. No per-tick body journal.

Implementation seams proposed: pure `src/body_modification.js` for state,
validation, budget, transmission and planning; `src/body_modification_native.js`
for one guarded full-envelope publisher and host clock/busy registration;
`src/body_modification_ui.js` for observer projection in the clinic surface.
Root reserves shared B2/item/save/source/time changes before any coding. These
filenames are a reviewable boundary, not existing APIs or permission to write
outside this lane.
