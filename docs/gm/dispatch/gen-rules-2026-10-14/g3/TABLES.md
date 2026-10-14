# G3 table contract

2026-10-14. **INFERRED proposal**, extending GR7, GR10, GR11 and MC11 in
[the root](../../../../GENERATION_FOUNDATION_RULES_2026-10-14.md). Not accepted
or implemented. [OVERLAYS](OVERLAYS.md), [WORKED](WORKED.md) and
[PIPELINE](PIPELINE.md) supply merge, examples and authoring contracts.

## T1: boundary with A2 and G1

[A2](../../core-foundations-2026-10-14/A2.md) owns tag definitions, parents,
implication/cycle checks, entity tag sets, visibility, serialization and
tagFacts. G3 owns table data and its resolver only. Do not introduce a second
tag store, change tag merging, serialize invented tag deltas, or reuse a table
overlay as an E4 tag/rule overlay. A2's output is not available at the initial
read; export names and serialized shape are **UNKNOWN**. Required adapter
semantics, not proposed export names:

| Adapter | Required input/output |
|---|---|
| Catalogue view | Immutable admitted entity refs for one kind/pool/world instance, with definition revisions and their existing owner refs |
| Tag match | Candidate ref + compiled all/any/not query + truth view → met/unknown; implied tags follow A2, never local recursion |
| Tag projection | Observer → only the tags and labels the observer can know; used for display, not physical truth selection |
| Reader qualification | Candidate + frozen context refs → met/known/reasons from the selected domain owner; no spend or mutation |

[G1](../G1.md) owns addressed draws, integer weighted/stratified picks,
shuffle bags, pity, retries and explanations. G3 supplies sorted candidates,
weights, addresses and proposed plain-data state to an adapter of that kit.
It supplies no second hash, PRNG, bag implementation or seed migration.
G1's source/report appeared later in this run; the read bindings are in
[P5](PIPELINE.md#p5-g1-bindings-seen-during-this-run), still unmerged here.
E1/P1 owns root and world/life scoping; A5 owns determinism ratchets.

**SHOWN:** `src/rules.js:3-29` implements all/any/not and missing-aware
eq/gte/lte facts; `src/items.js:202-204` copies item tags and adds `item`.
These were read in this run. They do not establish a tag-query table engine.
E4's larger timed/strength-tag store remains a proposal. Where E4 says to
drop unknown saved tags, the later assigned A2 requirement to keep and report
them governs this dependency. G3 preserves their opaque data and does not
grant them new semantics.

## T2: inert format

UTF-8 strict JSON, no comments/functions/eval, one table per file. Filename
is a packaging detail; identity is `id` plus positive integer `rev`.
`table:core.materials@1` means immutable revision 1. Unknown schema/fields,
duplicate JSON keys, duplicate IDs, unsafe integers and unresolved required
refs block admission. An executable JS wrapper is not the authoring format.

```json
{
  "schema": 1,
  "id": "table:core.materials",
  "rev": 1,
  "pool": {"kind": "item", "ref": "pool:admitted.materials@1"},
  "query": {"tag": "material"},
  "requires": {"fact": "candidate.available", "op": "eq", "value": true},
  "baseWeight": 10,
  "weightRules": [
    {"id": "fresh", "query": {"not": {"tag": "rotten"}}, "add": 2,
     "reason": "reason:fresh_stock"}
  ],
  "strata": [
    {"id": "rare", "query": {"tag": "rare"}, "weight": 10},
    {"id": "ordinary", "query": {"all": []}, "weight": 90}
  ],
  "emptyStratum": "renormalize",
  "fallback": "fallback:materials.no_offer@1",
  "policy": "adjective:world.grounded_supply@1",
  "budget": {
    "maxEntities": 4, "maxDrawsPerGameDay": 48,
    "maxCandidatesPerPick": 128, "maxQueryNodes": 64,
    "maxAttempts": 3, "maxDrawsPerAttempt": 4, "costClass": "small"
  }
}
```

The pool ref pins its schema/selection contract, not a hard-coded list of
IDs. Its resolved content manifest has a separate immutable hash. New
admitted content expands the pool without editing any table. A receipt
records both table revision and content manifest, because a table revision
alone cannot reproduce a pick after an item is added. Pool instances are
bounded world/region/era views, not an unrestricted whole-library scan.

`requires` uses the existing rules shape on a caller-owned fact map. The
reader must declare every fact's writer/default. For each candidate the
adapter supplies `candidate.available` from actual supply/eligibility, never
from a claim in text. Choosing a template does not create a person, stock,
money, item or completed quest. That belongs to the consumer's transaction.
People pools may hold templates; materials may hold supply refs; each pool
declares which. Do not mix templates, inventory variants and owned instances
in one deduplication domain.

## T3: query grammar and truth

Canonical schema-1 grammar is a JSON tree:

```text
query := {"tag": tagId}
       | {"all": [query, ...]}
       | {"any": [query, ...]}
       | {"not": query}
```

One key per node. `all:[]` is true; `any:[]` is false. `not` takes exactly
one node. Example: `{"all":[{"tag":"herb"},{"tag":"wet"},
{"not":{"tag":"poisonous"}}]}`. The root's illustrative `toxic` is not
silently an alias for vocabulary `poisonous`. An author must register a new
tag or explicit implication in A2 if that distinction is wanted.

Admission validates tag refs against A2's pinned registry. A known tag
absent from a complete truth set is false. Hidden is not absent. Unknown
registry refs or an incomplete tag view are unknown, and unknown never
qualifies a pick, including under negation. Boolean composition follows
missing-aware logic: all fails if a known child fails, otherwise unknown
if any child is unknown; any succeeds if a known child succeeds, otherwise
unknown if any child is unknown; not unknown is unknown. Runtime truth
queries use complete A2 truth, while observer search may expose unknown.

Schema 1 has no strengths, tag expiry, regex, arbitrary facts inside tag
nodes, ID-list unions, dynamic tag-name interpolation or executable query.
E4's `burning>=2`, arrays-as-any and `!wet` may get a separately versioned
authoring compiler later. Never pretend minimal A2 supports strengths.
Strength readers can use an explicitly supported E4 adapter through
`requires`; missing support blocks admission instead of coercing to presence.
Expiry resolution belongs to the tag/time owner before obtaining the view.

Membership is `pool bounds AND query AND requires`, then overlays and
stratum classification. Unknown/invalid refs yield diagnostics with opaque
IDs where restricted. Template tags and instance changes continue to follow
A2/E4; G3 never grants tags just to make an entry eligible.

## T4: weights and stable category shares

All stored weights, additive modifiers and category masses are safe integers.
Bounds: each effective item/category weight 0..1,000,000; each sum ≤2^32-1.
Validate before draws, including overlay arithmetic. Reject overflow/negative
results, do not silently clamp. Weight zero retains membership but excludes
ordinary selection. Bans and eligibility apply even to zero-weight pins.

Start at `baseWeight`; apply matching `weightRules` once each in declared
order, then overlay ops in [O2](OVERLAYS.md#o2-merge-order). Each rule/op has
a stable ID and reason ref. v1 supports integer add or absolute set, with
exactly one of them per modifier. No floats or implicit multiplication.
Repeated grants of an implied tag do not apply the same modifier twice.
Repetition penalties may be a named, integer add modifier from the shared
observer-history owner; they are not another table-local history store.

Strata are disjoint by **first match in the authored ordered array** after
membership. An explicit final all-empty query is the catch-all. Unclassified
members are a lint error. A candidate never occupies two strata. Ordering
changes require a new revision. Within each stratum, sort qualified refs by
code point stable ID, then variant/incarnation key if the pool uses one.
Never use array position as identity or localeCompare as ordering.

Pick stratum by its fixed mass, then item by its effective weight. With
ordinary:rare = 90:10, adding ten ordinary herbs keeps a nonempty rare
stratum at 10%; individual ordinary odds change. A zero-total stratum is
empty. `renormalize` removes empty strata and reports changed available
shares. Alternative `fallback` preserves a category's selected share by
returning the declared no-result if that category is empty. The table must
choose one; neither mode manufactures a rare item. Banned/ineligible items
do not count as a nonempty stratum.

## T5: per-world adjectives

Resolved adjective data is immutable `id@rev`, recorded with overlays. These
are tuning proposals, never global once rules. Table/context patches may
specialize a world policy with a new effective hash. Separate hard lore,
era, stock and actor eligibility from soft pattern preference.

| Field | Data and meaning |
|---|---|
| `luck` | `iid`, `bag`, or `pity`; scope is world-instance/life/table/stratum plus actor for actor-local policy. A bag adds the selected pattern branch to its subkey, so choosing the familiar branch does not consume surprise members. G1 supplies state transitions. Bag membership/rebase is explicit in O6. Pity declares target stratum and `after` eligible committed windows. |
| `surprise` | Integer 0..1000; pattern branch masses are `1000-surprise` and `surprise`. `plausibleQuery` defines familiar candidates; surprise branch selects its complement **inside hard eligibility**. Empty branch renormalizes or yields fallback as declared. No valid complement means surprise cannot occur. |
| `rarity` | `none` or `{stratum, everyEligible}`. Force that nonempty target at the Nth eligible committed opportunity since its last success. At earlier windows retain category masses. Reset only on target success; counter stops while target empty. |
| `repeat` | `none` or a ref to an integer penalty over what this observer actually saw, shared across relevant tables. Never penalize unseen NPC selections on the player's behalf. |

Resolve hard eligibility → strata → due rarity/pity → pattern branch → item.
Within an ordinary category, intersect with the selected pattern branch.
If due rarity/pity selects a category, choose pattern within that category
and use its declared empty-branch policy. A guarantee guarantees the category,
not an impossible pattern. Reject conflicting rarity/pity targets in one
policy; compatible ones coalesce into one force decision. Pin takes precedence
over these soft policies, with the counter behavior in O3. A bag handles
within-stratum items only; fixed category masses still apply. Probability
band tests for ordinary draws exclude forced and pinned windows explicitly.

Bag mode is uniform over positive-weight membership, because G1's current
bag takes IDs, not relative weights. Integer reweighting still determines
zero-weight exclusion; it changes relative odds only in iid/pity mode.
Do not silently promise a weighted bag. See P5 for its adapter limits.

An eligible window is one stable game-time opportunity admitted by the
consumer, not a render, peek, failed save or repeated click. Key examples:
`day:12/supply:oren` or `hour:48/dispatch:site7`. Commit once per key;
replays read its receipt. Count the actual available rare opportunity,
not elapsed wall time. Ineligible/empty and budget-deferred windows do not
advance luck. `surprise=0` is a selected local preference; other premises,
overlays and earned routes may expose the other reasonable possibilities.

## T6: budgets and receipt

Budget owner is world-instance/life/table family and local game day, including
NPC and player callers. Regions/persons cannot multiply allowance by changing
IDs. Declare also the parent generator's aggregate composition budget. The
sample's 4 entities/day, 48 draws/day, 128 candidates/pick and small cost
class are fixture limits, not population, rarity or permanent gameplay caps.

Reserve upper bounds before generation: `maxAttempts` includes the initial
try, so 3×4 = 12 draws and one entity slot per requested output; unused
capacity is returned on commit. G1 retry attempt addresses never shift other
subjects. Distinguish candidates evaluated from random draws and new entities
from choosing existing refs. A no-offer fallback uses zero new entity slots.
Every nested generator charges its work to both its local budget and the
parent aggregate once, not twice within either ledger. Count every G1 bag
refill shuffle draw too: m positive members require m-1 swap draws. The
four-draw material example is iid, not a valid 128-member bag budget. A
bag consumer needs a compatible candidate/refill bound, as in W1.

At capacity, defer optional generation via [P32](../../procgen-2026-10-13/p32/LEVEL_OF_DETAIL.md)
with the same address/input lock. Required paid/due work is not dropped or
rerolled into a cheaper reward; keep its pending transaction. Candidate
enumeration exceeding a cap must yield through a stable cursor and finish
the domain before a pick, or defer. Do not take the first 128 candidates and
call that a weighted sample. Profiling deadlines choose when to yield, never
the winner. `costClass` is `small`/`medium`/`large`, an unmeasured scheduling
hint until benchmarked on the target build.

Receipt fields required by this proposal:

```json
{
  "schema": 1,
  "address": "gen:village:stock:oren:day12",
  "table": "table:core.materials@1",
  "effectiveHash": "fixture-effective-v1",
  "contentManifest": "fixture-content-v1",
  "tagRegistry": "fixture-tags@1",
  "policy": "adjective:world.grounded_supply@1",
  "overlays": ["overlay:world.village@1"],
  "inputsRef": "inputs:stock.oren.day12@1",
  "selected": {"id": "item:village.rush", "rev": 1},
  "stratum": "ordinary",
  "pattern": "plausible",
  "attempt": 0,
  "fallback": null,
  "budgetUsed": {"draws": 2, "newEntities": 0},
  "explainRef": "explain:stock.oren.day12"
}
```

Hashes above are synthetic labels, not computed digest claims. Production
hashes derive from canonical inert data including ordered ops/strata and
resolved dependency locks. Frozen outputs keep actual values and refs, not
only this receipt. G1 explain contributors retain item and category weights,
matched reason/op IDs, pin/ban/force decisions and fallback counts. Projection
filters hidden membership, tags, counts and reasons before display. Root GI5
limits saved explanations to three contributors per recent/frozen result;
G1's top five can be transient, with full arithmetic reproducible from locks.
A builder
must bind this receipt to the selected save/transaction owner before gameplay.

## Vocabulary additions

Proposal-only table metadata: `table`, `pool`, `overlay`, `adjective`,
`contentManifest`, `effectiveHash`, `stratum`, `eligibleWindow`, budget
classes. `material` and world-specific role/habitat tags in WORKED are
proposed A2 registry additions, not new entity kinds or tag-store formats.
