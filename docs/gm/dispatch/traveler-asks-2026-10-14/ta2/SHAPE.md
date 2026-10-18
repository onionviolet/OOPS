# Smallest shared ask profile

2026-10-14. **PROPOSAL ONLY. Amendment 1 applied.** This is authoring data for later lanes, not a new save schema. Keep authored profile, observer-relative route assessment and frozen accepted obligation separate. [Inventory](INVENTORY.md) routes every profile; [build packet](NEXT_WORLD_BUILD_PACKET.md) supplies a concrete first adapter.

## D1: profile envelope and authored row

| Field | Minimum meaning | Current TA1 mapping / later extension |
|---|---|---|
| `id`, `revision` | Stable profile ID and content revision | Envelope around TA1's `ASK_TABLE_REVISION=2`; do not replace a saved revision |
| `scopeRef` | World definition, instance/continuity, era/source snapshot, region/layer and law refs supplied by the world owner | New world envelope; never use display name as join key. Existing Village execution is still hard-coded |
| `adjectives` | Cadence, climate/calendar ref, tone, local renewal cause, absence policy and reward policy ref | Profile-level proposed fields, not required new fields on every TA1 row |
| `byRole` | Map of world-owned role/template IDs to eligible authored rows | Exact structural match to `VILLAGE_ASKS[templateId]`; new roles still need a people adapter |
| row `id`, `kind` | Stable ask ID; goods, service, information or favor | TA1 `id`; `kind` may default to goods for the existing table |
| row `item`, `quantity`, optional `grade` | Goods: exact item ID, inclusive `[min,max]`, optional grade selector | Exact TA1 fields. `grade:null` means no grade requirement, never “scraps only.” Quantity currently bounded to 1-3 |
| row `targetRef` | Non-goods: service definition, information question/basis policy, or favor action with objective and participant refs | Conditional union member, absent for goods. Do not encode a service as a fake inventory item |
| row `tags`, optional `season`, `weather` | Role-fit tags and supported context selectors | Exact TA1 names. TA1 season is a list, weather is a scalar equality. Omit unsupported selectors rather than pass invented seasons |
| row `fiction`, `clue` | Authored request and honest, observer-safe fallback lead | Exact TA1 fields. No seed, hidden counts, secret truth, undiscovered alias, private answer or unobserved source location |
| row `routeRefs`, `effort`, `danger` | World-owned actual routes; effort E1-E3 and danger D0-D3 for quoting/acceptance | Proposed metadata/adapter refs. TA1 derives routes externally by item; avoid copying a second route ledger into each row |
| row `rewardPolicyRef`, `evidenceRefs` | Currency/reward adapter; sourced canon claim or explicit original-invention record | Inherit profile defaults when identical. No canonical prices inferred from these proposals |

Only scope, adjectives, role grouping and the goods/non-goods distinction are world-independent authoring additions. Concrete route, stock, actor, calendar, grade and reward schemas stay with their owners. A role, season or tag never grants access, capacity, source compatibility or knowledge.

```json
{
  "id": "cyoria.traveler_asks",
  "revision": 1,
  "scopeRef": "book.mol.cyoria.main / retained independent visitor branch",
  "adjectives": {
    "cadence": "term-paced",
    "tone": "studious",
    "renewal": "new funded copying need after actual use",
    "absence": "freeze; no penalty",
    "calendarRef": "world-owned supported calendar only",
    "rewardPolicyRef": "cyoria.local_crowns_effort"
  },
  "byRole": {
    "copyist_visitor": [{
      "id": "cyoria.copyist.paper",
      "kind": "goods",
      "item": "Cyorian research paper",
      "quantity": [1, 1],
      "grade": null,
      "tags": ["study", "copying", "ordinary"],
      "fiction": "One Cyorian research paper for my notes, please.",
      "clue": "I need a sheet fit for ordinary notes.",
      "routeRefs": ["book.mol.paper", "book.mol.catalog_shift"],
      "effort": "E1",
      "danger": "D0",
      "evidenceRefs": ["original ask; existing item and routes in book_world_mol_actions.js"]
    }]
  }
}
```

These role/profile IDs are proposed, not registered. `scopeRef` is shown as readable text here; implementation binds the actual typed footprint rather than parsing this string.

## D2: reach assessment is derived, support is separate

| Assessment | Required author truth | Player-facing implication |
|---|---|---|
| Route proposed / unsupported | Profile suggests a route, but there is no admitted executable acquisition/service path yet | Exclude from runtime draw. This is the status of planned-world examples until their owners build/bind them |
| Ready | An actual world route exists and the player knows an available route meeting quantity, grade, access, stock/funds and supported means | Offer ordinary terms and known source directions |
| Stretch | An actual route exists and is known, but needs money, tool, skill, timing or a trip | Explain only known prerequisites; pay more for effort. Declining/waiting preserves ordinary play |
| Unknown | An actual route exists, but the player has not discovered it | An honest fiction lead can start investigation. “I need a sound hide; perhaps a hide worker could advise” is a question, not proof of an unseen workshop |

Missing route data is not an unknown band. Unknown is relative to the player, not permission to fabricate supply. A fulfilled ask is not automatically renewed because its item is absent again: its issuer must have a fresh actual need and funded terms. New opportunities can be generated when means change; accepted obligations retain their terms. If every available route is difficult, do not silently replace the world's desired item with bread.

Use separate `routeSupport` and `band` in diagnostics. A lost source can suspend the offer with an honest explanation or allow a supported alternative; it must not auto-convert an accepted obligation into debt. Preview never draws, moves stock or spends funding. No deadline penalty from closed-browser absence or not knowing the route.

## D3: grading and item identity

Preserve `item` as a data key plus optional `grade`; do not add a switch for today's three/eight item names. The later HV1 adapter decides whether grade lives in an inventory key or distinct item definition. The row selects the underlying product through that adapter, not a guessed suffix such as `Rat pelt (pristine)`.

Future illustrative selector: `grade: {completeness: "whole", qualityAtLeast: "owner-defined-unblemished"}`. Those field names and enum values are **a proposal**, not an asserted HV1 contract. Resolve them to actual harvest-owner definitions before admission. Completeness, quality, freshness, identity and species remain distinct. A body part can be harvested through whole processing, selective taking, trade or commissioned handling where the world supports it. Known route to a pelt does not prove route to the required grade. Missing grade support excludes that row, rather than quietly accepting ordinary stock.

Mixed inventory stacks require exact selected-lot debits, no quality erasure, and no combat-drop/carcass double payment. Source-specific magical materials and soul/characteristic identities cannot be graded into another canon substance. Knowledge-hidden parts follow the harvest knowledge owner; request text cannot name a sealed unknown part or reveal its function. [Harvest PLAN](../../harvest-modules-2026-10-14/PLAN.md) HM3/HM6/HM10 and P8 creature resources own the integration.

## D4: settlement, cadence and origins

A drawn goal freezes `askId`, table/profile revision, target, quantity, grade, quoted band, fiction/clue and fee basis. The accepted request adds issuer, need ID/revision, escrow, status and cause/receipt references. These are not new parallel owners for P34 stock or D8 history. Rechecking present knowledge can improve directions without repricing or rerolling the obligation.

Coin fees keep the local denomination and actual payer. Stretch and unknown quotes pay more than ready for comparable quantity/effort. Lesson/recipe hint/introduction/standing/rumor rewards need their own deliverable and willing issuer. Do not assert that every rumor is true or every teacher can teach personal sources. Unknown-discovery premium is frozen when quoted; later learning the route does not reduce the promised fee. Abundant profitable trade remains permitted under actual world laws and funding.

Origins overlay every row: infant/child uses supported signaling, caregiver or supervised help; rooted actor uses real reach or consenting collaborator; projected visitor has declared contact/cargo; role replacement does not grant predecessor skill/office. Neither a profile nor an introduction spawns a free helper or makes household-owned stock personal. See [origins](../../../../worlds/ORIGINS_AND_WORLD_TIMELINES.md).

Cadence adjectives select causes and clocks, not universal timers: term-paced copying, tidal maintenance, caravan departure, case appointment, rooted seasonal collection, strip-scale friendly play. Respect source-limited powers without converting them into a global once-per-save anti-abuse rule. No offline catastrophe or compulsory daily care is added by these profiles.

## F1: checked against committed TA1

Read with `git show proc/ta1-village-asks:src/village_traveler_asks.js`, `:src/village_obtainability.js` and `:src/story_requests.js` at **d79a99d1ec152b60e98329bf7e0f72765105ae4f** on 2026-10-14. Initial head 91ec169e had no new ask table; 211de399 introduced v2 and d79a99d1 added known gathering projection and lint/replay changes; that initial missing status is superseded by this comparison. This is committed-source inspection, not TA1 build/browser/merge acceptance.

| Concern | Observed committed TA1 | TA2 consequence |
|---|---|---|
| Table | 12 rows under 3 role IDs; 8 item IDs; revision 2; quantity ranges | Goods examples can lower into that row shape, with per-world role binding |
| Optional grade | Constructor includes `grade:null`; `askPool` explicitly excludes non-null grades | Schema reservation exists, functioning graded asks do not. HV1 bridge remains open |
| Context | Optional row season/weather; no current world envelope | Profile owns local context refs; unsupported climate is omitted |
| Reach | `reachBand` returns ready/stretch/unknown from actual indexed routes, known/available flags, quantity and money; band draw preference 7/2/1 among present bands | Same band names and semantics; 70/20/10 is a Village proposal, not a universal-world quota |
| Routes | Index covers inventory, trader, gather, drop, recipe. Native recipe reader admits only currently unlocked recipes | A later world-wide route catalogue must retain author-supported locked routes separately. Unknown must not mean a missing catalogue entry. TA2 does not change TA1's implementation |
| Reward | `base + ceil(base*premium) + bonus`; ready 25%+2, stretch 50%+5, unknown 75%+10. Base reads guaranteed purchase or work estimate | Extra reward exists for harder/unknown bands. Reuse concept with local denomination; do not impose Village prices on other worlds |
| Frozen goal | `askId,item,quantity,grade,band,fiction,clue,reward,feeBasis`; validator checks `needRevision` | Keep these names for goods lowering; later service/non-coin contracts need an explicit revision |
| Execution | Request contract rev2, legacy rev1 retained; place/stock/native coin settlement remain Village-specific | Table shape alone does not make another world runnable. New world/stock/currency adapter is a named build task |

No TA1 patch, merge, test or private save manipulation was performed by TA2. Later TA1 commits require refreshing this comparison by commit ID before implementation.
