# G3 overlays and revision compatibility

2026-10-14. **INFERRED proposal**, extending GR8, GR10 and MC10.
[TABLES](TABLES.md) defines membership and weights. These patches select
content; A2 still owns tags, E4 owns interaction-rule layers, and
[P22 director mode](../../procgen-2026-10-13/p22/DIRECTOR_MODE.md) owns the
development panel and test-session envelope. No panel/save code was built.
Root round 2 also assigns shared pin storage/address semantics to
[G6](../G6.md) and lawful generation-cheat hooks to [G5](../G5.md).
Director pin ops here must bind to that shared owner rather than create
a second pin store. The O4 inline statuses illustrate its projected view.

## O1: overlay envelope and operations

An overlay is inert strict JSON. `id@rev` is immutable. A typed scope
restricts applicability to one actual instance, region path, actor or
director session. Catalogue additions are separately reviewed definitions;
`add` never invents an entity or edits its tags.

```json
{
  "schema": 1,
  "id": "overlay:region.village_marsh",
  "rev": 1,
  "layer": "region",
  "scope": {"worldInstance": "fixture:village.life1", "region": "place:village.marsh"},
  "tables": ["table:core.materials"],
  "ops": [
    {"id": "local_supply", "op": "add", "query": {"tag": "marsh_supply"},
     "reason": "reason:local_habitat"},
    {"id": "no_rot", "op": "remove", "query": {"tag": "rotten"},
     "reason": "reason:spoiled_stock"},
    {"id": "wet_bonus", "op": "reweight", "query": {"tag": "wet"}, "add": 4,
     "reason": "reason:marsh_abundance"}
  ],
  "policyPatch": {"surprise": 80}
}
```

The fixture's tags must be admitted to A2 before this file can compile.
`tables` addresses table families rather than revisions so compatibility
can be reviewed on revision change; the effective lock records exact table
and overlay revisions. Each op has unique stable ID and reason ref. A
selector is exactly one `query` or `entry:{id,rev}`. Prefer queries for
reusable content. Exact entries are allowed for MC10 intervention and
authored identity reservations, not the normal GR7 discovery mechanism.

| Op | Exact semantics |
|---|---|
| `add` | Include matching admitted candidates from the same typed pool even if the base table query did not match. Cannot bypass pool/world/era bounds, requires, custody, capability or world laws. Membership becomes true. Uses table base weight plus all applicable weight rules/ops. |
| `remove` | Membership becomes false for matching candidates, including later automatic pool additions. A later add may include them again. This is a contextual selection edit, not catalogue deletion. |
| `reweight` | Exactly one integer `add` or `set`; modifies matching candidates whether currently members or not. Evaluate all applicable modifiers in O2 order at pick time. Can yield zero; invalid range/overflow blocks the edit. Does not add membership. |
| `ban` | Exact `entry` or query plus `value:true`/`false`. Latest applicable op sets a selection veto or releases it. Banned candidates are excluded after membership and weight resolution. A later add or pin alone cannot release a ban. |
| `pin` | Exact entry revision, stable pin ID, `fromWindow`, `throughWindow`, `status`. Queue a requested pick while eligible. No query pin in v1 because one query can name many future items. Once fulfilled, expired or cancelled it stays as a terminal receipt, not an active pin. |

`policyPatch` may replace declared scalar/record adjective fields, not query
grammar, tag meaning, effect opcodes or hard laws. Full `luck`/`rarity`
records replace whole records to avoid mixed mode fields. Category masses
may change through a separately named `stratumWeights:{stratumId:int}`
patch. Unknown categories block admission. There is no implicit mass change
when an item is added. Edits to a definition/fallback/query structure require
a new base table revision instead of unrestricted patch paths.

## O2: merge order

Resolve one context at the consumer's admitted game-time boundary:

1. **Core** table and core overlays, ordered by declared priority ascending,
   then stable overlay ID by code point. Higher priority runs later.
2. **World** overlays for the actual world instance, selected era/continuity
   and installed pack lock. Foreign origin tags remain on carried items;
   inclusion never changes their home-law owner (SB16).
3. **Region** overlays from outermost world region to innermost room. Regions
   use an authored parent path; cycles block compilation. Within one depth,
   use priority ascending then ID.
4. **Person** overlays for the caller/beneficiary declared by the consumer.
   For multiple owners use declared role order then priority and ID. Do not
   apply every NPC's modifier to the player. Relationship predicates still
   read relationship refs, not person tags.
5. **Director** session overlays last, ordered by saved edit sequence, then
   overlay ID. They alter test selection, not the ordinary character's powers.

Within an overlay, array order is meaningful and hashed. Never derive order
from object insertion order. Repeated identical overlay refs apply once;
conflicting revisions of the same ID in one layer are an admission error.
Policy fields use the same precedence; immutable identity/hard eligibility
is not patchable by these ops. Final veto check follows all membership ops.

Example for a herb with base weight 10: world `+2`, region `set:6`, person
`+3`, director `+1` yields 10. World remove → region add restores membership.
World ban true → director add does not restore selection; an explicit later
ban false may release the table veto, but still cannot overrule actual
unavailability or a world-law gate. Log every contributor and override.

## O3: pins, bans and preview

At each eligible window, revalidate pins against exact definition revision,
kind/pool/scope, current requires, membership and final ban. A pin may pick
an effective zero-weight member; record this intentional bypass. It never
bypasses a removed/nonmember entry. Pin stays pending while ineligible; it
does not create a person, material, rumor claim, mission or cost.

If several pins are eligible, select the oldest saved pin edit sequence,
then pin ID by code point. Other pins remain pending for later windows.
Pins with no matching through-window remaining expire without firing. Bans
take precedence: do not consume a blocked pin; report opaque blocked status.
The director can cancel or release the ban in a new edit. No silent conflict
winner from array order or a renamed label.

Window bounds are compared by the context's typed game-time/window ordinal,
not lexicographic `day:9` versus `day:12`. Bounds must share the same scoped
calendar/window family and resolve to an inclusive ordered interval; reject
unknown/mixed families. A clock migration retains the reviewed mapping.

If a table/content revision removes a pending pin's option, preserve its
pin ID/old lock, set compatibility status `invalidated`, and use the named
no-result fallback at its next admitted target window with a safe visible
note (root SB23). No replacement entry is selected. Temporary stock/access
ineligibility is different: the pin remains pending until expiry. G6 owns
the final transition/storage binding; retain invalidation history after
fallback or expiry.

Pin selection skips category/pattern/item draws. It still consumes the
actual output/consumer budget and window. If the pin lands in the rarity/
pity target, reset its counter; otherwise pause its counter for that window.
It does not burn an unrelated bag token; remove the pinned member from an
active bag only if that bag would ordinarily contain it, recording the
transition. This avoids immediately repeating a pinned item. Failed commit
does not consume a pin, bag token, window or budget.

Inspection, validation and quote use detached next-state data and G1 peek.
Persist selection receipt, pin terminal state, luck/window state, budget
usage and domain effects through one selected transaction boundary before
publication. Failed durable write retains the prior snapshot. No director
edit secretly rerolls a frozen result; intentional forced play uses P22's
intervention receipt and actual domain adapter.

## O4: save owner and director edits

Proposed optional owner below is a contract to bind, not an existing engine
field. Do not splice it into A2's serialized tag sets or P1's seed fields.
P22 retains its distinct `yairpg-director-session` outer envelope and storage
isolation. Ordinary save import must reject director envelopes, as P22
proposes; this lane does not silently select dev-panel behavior for normal play.

```json
{
  "genTables": {
    "schema": 1,
    "effectiveLocks": {"stock:village.oren": "lock:fixture.stock@1"},
    "director": {
      "sessionId": "fixture:director.g3",
      "editSeq": 2,
      "overlays": [
        {
          "schema": 1, "id": "overlay:director.fixture", "rev": 2,
          "layer": "director",
          "scope": {"sessionId": "fixture:director.g3", "worldInstance": "fixture:village.life1"},
          "tables": ["table:core.materials"],
          "ops": [
            {"id": "bias_herbs", "op": "reweight", "query": {"tag": "herb"},
             "add": 3, "editSeq": 1, "reason": "reason:director_supply_test"},
            {"id": "pin_rush", "op": "pin", "entry": {"id": "item:village.rush", "rev": 1},
             "pinId": "pin:fixture.rush", "editSeq": 2,
             "fromWindow": "day:12", "throughWindow": "day:14", "status": "pending",
             "reason": "reason:director_route_test"}
          ]
        }
      ]
    }
  }
}
```

Store full inert director ops plus sequence, scopes and revisions in the
director save, not a reference to mutable browser preferences. Effective
locks reference retained compiled manifests of base/policy/overlay/content/
tag revisions. G1 luck state, frozen outputs and receipts are saved by their
selected owners with links to these locks, not duplicate arrays here. Runtime
updates pin terminal state alongside its receipt; each edit increments overlay
revision, while pin ID/editSeq remain stable. A snapshot pins the exact result
of those state transitions.

Save/import validation must bound overlay count, op count, query depth,
string length and total bytes; suggested first fixture limits are 32 overlays,
128 ops/overlay, 64 query nodes/op and 256 KiB decoded owner data. These are
not measured whole-envelope fit. [P32](../../procgen-2026-10-13/p32/LEVEL_OF_DETAIL.md)
owns storage/catch-up scale. Reject an oversize edit before it replaces the
last good state; never truncate bans or pending commitments to fit.

Old saves without this owner mean no director overlays or table-local locks;
admit new generation prospectively, retain already existing people/items.
Unknown owner schema fails import atomically with a compatibility report.
An older build must refuse a required new owner, not ignore it and reroll.
Root integration must select the host envelope/engine-version bump; no numeric
ENGINE_SCHEMA is claimed here. Unknown tag IDs stay preserved/reported under
A2; affected queries are suspended until resolved, not treated as no tag.

## O5: revision migration matrix

| State at patch | Rule |
|---|---|
| Address never admitted/revealed | Resolve current table, overlays, content and tag registry at the next admitted window. Same root/address may now produce a different unseen value. Record the new lock. |
| Quoted preview, not committed | Invalidate quote if effective lock/input state changed. Fresh quote uses current revisions. Do not charge luck, budget, stock or a pin. |
| Accepted job, reserved stock, scheduled obligation or admitted pending generation | Keep its input/definition lock even if not yet visually shown. Durable commitment freezes its actual terms; visual reveal is not the only reason to retain truth. Expand under that lock or suspend if unavailable. |
| Revealed/observed/frozen value | Keep actual chosen values, IDs/incarnations, refs, known facts, receipt and old revisions. Future table selection does not rewrite it. Current lawful state changes may alter it through its owner, with a new cause. |
| Frozen rumor/storylet | Keep original claim/speaker/basis, slot bindings, choice terms and grammar revision. Later discoveries update knowledge/projection, not the original claim. |
| Missing old definitions or private pack | Historical safe projections may remain readable from frozen data. Active execution suspends with a compatibility diagnostic. Never pick a nearby substitute or fabricate hidden details. |

Archive old executable dependencies while active obligations need them. A
terminal frozen value can eventually retain only the fields its owners require,
per P32 continuity rules, but receipt-only retention cannot recreate it.
Table/pool revision aliases require explicit reviewed maps; do not alias by
display label. Migration stages a detached new owner, validates every active
reference, then publishes atomically. Unsupported refs are preserved and
suspended; no partial load that loses an obligation.

Adding a new item changes contentManifest/effectiveHash without forcing a
table rev bump. Editing query/weight/order/fallback/schema changes table rev.
Editing an overlay changes overlay rev. Retagging/revising an entity changes
entity and content revision; changing implication changes tagRegistry revision.
All can affect unseen results and [graph impact](PIPELINE.md#p3-composition-graph).

## O6: luck-state rebasing

Unseen new windows may use a new manifest, while committed windows keep their
receipts. For an existing bag: preserve current remaining eligible token IDs
and order under its old cycle lock, skip newly banned/ineligible tokens without
a successful-window charge, and add new members only when that cycle ends.
Do not restart a partly consumed cycle on each patch. If all remaining tokens
are ineligible, close the empty cycle with a reason and refill under the new
lock at the next admitted opportunity. G1 supplies the actual transition.

Rarity/pity counters carry over unchanged when target stratum and meaning of
eligible window remain stable. If target/scope/window semantics change, require
an explicit policy migration (`carry` with a reviewed target map, or `reset`
with reason). Pending generation retains old policy regardless. Freeze the
migration choice in the lock; previews cannot repeatedly reset pity.

## O7: required future compatibility witnesses

Old save without owner; director round trip with pending/blocked/fulfilled
pins; quote cancelled; failed durable write; content added before and after
reveal; active job patched before visual reveal; tag-parent revision; missing
private pack; bag mid-cycle; shifted rarity target. Assert the same frozen
values/terms and next committed value after save/reload/import under each
selected compatibility path. All witnesses are OPEN, not tests run here.
