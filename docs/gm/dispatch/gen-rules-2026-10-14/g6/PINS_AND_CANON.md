# G6 pins and canon

2026-10-14. **PROPOSAL ONLY.** Implements no GA5 store. Read with
[ADDRESS_SPACE](ADDRESS_SPACE.md), [P13 contract](../../procgen-2026-10-13/p13/RULES.md)
and [Timelines T3/T5](../../../../TIMELINES_AND_DIVERGENCE.md).

## PC1: OG1 needs a narrower meaning

INFERRED: canon is a version-qualified baseline of pinned facts and conditional
expectations. An AU is an overlay of declared differences. Generation supplies
eligible values for unresolved slots. Divergence invalidates relevant future
expectations through actual causes; it does not erase the baseline, known past,
identity reservations or current custody.

The literal slogan fails in both directions: authored original content is not
necessarily canon; generated content may be pinned by a cheat or frozen after
reveal. Canon can contain unknown facts, and an unpinned identity still may not
be legal to invent. Pin origin, causal authority, mutability and observation
state are independent axes, not a single `isCanon` flag.

## PC2: GA5 interface and logical pin store

INFERRED: shared envelope and query API for canon and cheat pins, with typed
authority. Do not make a universal truth database. Immutable reviewed canon
manifests live with content; save data stores manifest refs and branch/cheat
overrides keyed by concrete slot address. Conceptually this is one pin view.
Resolved canon refs need exact manifest revisions on restore. Root GI2's
empty-old-save maps do not mean deleting the baseline content manifest.

```text
readPin(address, context) -> effective pin | absent | conflict | unresolved
planPinChange(address, change, authority, expectedRevision)
  -> {patch, validation, receiptRefs}   // existing publisher commits it

pin = {
  pinId, targetAddress, kind, valueRefOrValue, valueType,
  authorityRef, sourceClaimRefs, evidenceStatus,
  manifestRef, manifestRevision, clockConstraintRef,
  prerequisiteRefs, permittedChangeRef, revision, receiptRef
}
```

`valueRefOrValue` is a tagged union: one validated value or a ref with exact
revision and availability checks. It must not execute code. `evidenceStatus`
keeps unresolved source candidates out of an executable canon manifest.
Reservation is a distinct kind, never a hidden success pin. World policy
authorizes eligible operations; calling the same API does not grant a cheat
power over every past fact, body or law. G5 owns costs, preview and receipts;
G3 owns ordered overlay operations. GA5 adds address/value authority only.

| Pin kind | What is fixed | Release or change meaning |
|---|---|---|
| Source/version | Included work/edition/horizon and baseline revision | New manifest or explicit compatibility plan, not patch-day replacement. |
| Entry/history | An attested prior fact at an admitted anchor | Ordinary future actions preserve the fact's historical occurrence; named rewrite mechanism may create a new history revision. |
| Law | Supported local rule with scope | AU law overlay needs a specific world rule/implementation. Removing a pin cannot silently turn off all constraints. |
| Reservation | Named identity, singular object or role identity | Vacant custody does not permit generation of another unique object/person. Supported destruction/transfer/counterpart still has its own rules. |
| Expected future | Source-natural event/effect while prerequisites and clock window hold | Missing actual cause can release the expectation and mark the event inapplicable; missing model data is unresolved. |
| Cheat/preference | Eligible fixed option for one slot, with real authority/cost | Validate against current support and commitments. An impossible option does not force an effect. |

Effective resolution order is proposed: authoritative committed state or
resolved occurrence first; then inherited historical/frozen draw bindings;
then admitted baseline+ordered overlays+validated active pins; then eligible
generator+fallback. A freeze record is a historical value record, not a command
to restore yesterday's current health. Simultaneous writers need revision
guards and one publication transaction.

An `unpin` overlay tombstone names the exact pin and revision it masks. It
persists, so a later baseline load cannot accidentally reinstate the pin.
It neither deletes the old record nor automatically calls a generator. A
dependent future scene can remain canceled, be rescheduled, or get an actor's
new supported plan. Unrelated expectations keep their pins.

For SB23, a removed option gives an explicit compatibility status. Preserve
the intended pin, old ref and cause; use only its declared fallback policy
with a visible safe note. If no equivalent option exists, block that operation
or keep it dormant, not silently pay for another result. Known content may
require the matching old reader. Never expose hidden choices in the note.

## PC3: canon clock, not a second scheduler

INFERRED: a canon clock is a qualified coordinate system for a baseline's
event graph: source phase, partial order, local date/window, era and anchor.
Chapter/publication order is not elapsed game time. The instance binding maps
those coordinates to the existing local clock, with explicit absence policy
and optional subjective/outside time. A forecast is information held by an
observer, not that mapping or the event's actual occurrence.

SHOWN: [src/world_instances.js:108](../../../../../src/world_instances.js:108)
admits only `played_minutes` and `absence: freeze`; the occupied-interval
union at [src/world_instances.js:308](../../../../../src/world_instances.js:308)
prevents two visitors advancing time twice. Those functions do not map school
terms to source events or implement a source loop. Existing temporal adapters
elsewhere may be reused after selected inspection; this packet does not declare
all other clocks absent.

A future pin is checked when its existing scheduler/consumer considers its
window and prerequisites. Pinning the window does not enqueue a second timer,
duplicate rewards or advance an absent world. Expiry, renewal and calendar
repeat are per-world rules, never a global once limit.

## PC4: Harry Potter worked pin view

INFERRED proposal for a canon-first book world, credited to J.K. Rowling.
Use [HP source ledger H1–H5](../../../../worlds/harry-potter/SOURCE_LEDGER.md)
and [P13 HP](../../procgen-2026-10-13/p13/HARRY_POTTER.md). No new book reading
or source authentication was done here. HP chapter locators in P13 are
candidates, not executable proof of an exact date or complete event graph.
SHOWN: [src/feature_expansion_book_roster.js:2535](../../../../../src/feature_expansion_book_roster.js:2535)
has authoring family `fan.harry_potter`, `nativeWorldId: null`, and expressly
no native instance initialization. This is a real authoring case, not a live
canon-play claim.

| Proposed target / pin | Evidence and semantics |
|---|---|
| Source continuity `hp.source.seven_books.r1` / source pin | Proposed seven-novel boundary; H1 is bounded publisher evidence. H2–H4 supplements remain separately included or excluded. Exact pack ID/revision still needs root binding. |
| Person identity and place subjects / reservations | Source-qualified named cast and school/place identity reserved once selected. Age, acquired power, custody and location require anchor-specific evidence; no future title inherited by an early start. |
| `hp.template.first_term` / entry facts | Selected term snapshot of staff, pupils, accessible places and ordinary supplies. Exact scene/date qualification remains UNKNOWN. Do not write missing facts as canon zero/false. |
| `hp.term.dispatch/expected.window` / future expectation | Original support dispatch beside a source-qualified school term. Dispatch costs/worker are O; its source context does not make it a novel event. Window is local partial-order/term context, not invented Gregorian time. |
| Ordinary supplier/person/item slots / generated gap | Original worker's name may be unresolved, generated once and frozen on reveal. Stock is actual acquired/manufactured supply. Famous cast, unique items and offices stay reserved. |

Worked divergence uses P13's synthetic dispatch dependency rather than certify
a book scene: close the actual only dispatch site through an admitted paid
action; publish `site.open=false` and cause receipt; invalidate dispatch for
that window; invalidate only its dependent appointment. Mask the relevant
expectation pins. Preserve school-term expectations with independent causes,
the observed worker and the closure history. A willing existing courier can
make another plan only with actual access, time and supply. A relationship AU
overlays the selected relationship at entry and records `origin=premise`,
not a fabricated earned action. It neither silently changes law nor grants
the other person's memories.

## PC5: Mother of Learning worked pin view

INFERRED proposed source-qualified loop case, credited to nobody103; follow
[P13 MoL](../../procgen-2026-10-13/p13/MOTHER_OF_LEARNING.md). Its retained
carrier/reset source qualification and exact scope remain an implementation
gate. Existing supplied-edition analysis is qualified provenance, not a newly
authenticated primary source. No late truths or sealed answer mappings here.

| Layer | Proposed pins and identities |
|---|---|
| Source/baseline | Pin admitted source snapshot, entry anchor, baseline people/stock, source-qualified reset domain and participant reservations. Baseline generated ordinary neighbors are resolved once, not rerolled each pass. |
| Current pass | Separate pass/occurrence refs for actor plans, warnings, payments and current stock. Same baseline identity does not mean every conversation, relation or event repeats. |
| Retained carrier | Actual authorized carrier retains only the selected memory/method facets. Another person's knowledge, affection, body growth and material products do not carry by similarity. |
| Reset operation | One named, paid/source-supported transaction restores only selected domains, releases pass expectations, creates new pass refs and handles exports/external commitments explicitly. Save reload is not this operation. |
| Stochastic policy | GA10 keeps baseline root stable; permitted varying response domains include pass context. A successful intervention can change causes without rerolling anything. |

Counterexample to literal unpinning: a warning reaches a real recipient, changes
preparation and makes one encounter inapplicable. That pass's outcome remains
history. On reset, a selected body/stock snapshot may be restored, while only
the qualified carrier remembers. Deleting a pin cannot perform either the
restoration or retention. Old pass observations belong to that pass; they do
not freeze the new pass's physical stock or teach all NPCs the earlier result.

SHOWN existing branch: [src/book_world_mol_ids.js:12](../../../../../src/book_world_mol_ids.js:12)
binds `book.mol.cyoria.main` to `book.mol.independent_visitor.branch`;
[src/book_world_mol_ids.js:13](../../../../../src/book_world_mol_ids.js:13)
declares continuous played time and loop control outside scope.
[src/book_world_mol_state.js:24](../../../../../src/book_world_mol_state.js:24)
requires exact source/hash, same native body and independent nonmage visitor;
[src/book_world_mol_state.js:33](../../../../../src/book_world_mol_state.js:33)
binds independently retained residents. This branch can get read-only address
aliases; it must not gain pass IDs, reset semantics or fresh stock by migration.

## PC6: pins versus freeze records

INFERRED GA6 extends AX15; P1 owns compact draw receipts and P32 promotion.
Suggested record is `{address, valueOrRef, contentRevision, inputDigest,
resolvedAt, occurrenceOrPassRef, causeReceiptRef, observedByRefs}`. Commitment
can resolve truth before anyone observes it; observation records who learned
which facet. Keep those moments distinct (OG3).

| Question | Pin | Freeze/resolved record |
|---|---|---|
| Why does the value exist? | Reviewed baseline or authorized chosen constraint | Actual generation/commitment/observation with provenance |
| Can it exist unseen? | Yes, including author-only source expectations | Yes at commitment; seen facets additionally record observation |
| Is it current mutable state? | Only if its typed policy says so | Usually historical resolved detail, not a replacement for current state |
| Does removing it reroll? | No; removal may merely invalidate an expectation | No; ordinary content revision cannot erase resolved truth |
| Can current facts change? | Through their actual owner and allowed cause | Yes, such as paid transfer/injury/repair; keep old observation and new receipt |
| Is it proof the event happened? | No | Only an actual occurred-effect/settlement receipt, not a preview or observed forecast |

Generated worker name: no canon pin, saved revealed value. Pinned unseen drop:
cheat pin, no reveal record yet. Canon expected event: source pin, may never
occur. Actual event: durable occurrence/effects, with separate witness knowledge.
Pinning an already resolved name is redundant; retconning it needs a named
mechanism, new revision and residue. Ordinary supported changes to mutable
state need their action receipts, not a retroactive retcon of the old draw.
