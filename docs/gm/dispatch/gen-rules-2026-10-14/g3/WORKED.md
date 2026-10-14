# G3 nine worked table views

2026-10-14. **INFERRED synthetic proposals**, not gameplay or canon claims.
Village plus two priority worlds: [Harry Potter brief](../../../../worlds/harry-potter/WORLD_BRIEF.md)
and [Jujutsu brief](../../../../worlds/jujutsu/WORLD_BRIEF.md), qualified by
its newer [curtain-dispatch packet](../../../../worlds/jujutsu/IMPLEMENTATION_PACKET.md).
HP is a supervised nursery/craft life; JJK is an incomplete-report and
actor-perception mission loop. Neither is selected for runtime here. All
people/materials/storylets below are original fixtures, with no copied canon
dialogue, private payloads or sealed truth. Exact source claims still need
the world's ledger before canon-labelled admission.

## W1: shared definitions and view resolution

Three immutable base table files plus nine world views, not nine copied
candidate lists. The material base is T2 in [TABLES](TABLES.md#t2-inert-format).
The other two full base definitions are:

```json
{
  "schema": 1, "id": "table:core.people", "rev": 1,
  "pool": {"kind": "person", "ref": "pool:admitted.people@1"},
  "query": {"tag": "people"},
  "requires": {"fact": "candidate.available", "op": "eq", "value": true},
  "baseWeight": 10, "weightRules": [],
  "strata": [
    {"id": "exceptional", "query": {"tag": "rare"}, "weight": 10},
    {"id": "routine", "query": {"all": []}, "weight": 90}
  ],
  "emptyStratum": "renormalize", "fallback": "fallback:people.no_contact@1",
  "policy": "adjective:world.grounded_people@1",
  "budget": {"maxEntities": 4, "maxDrawsPerGameDay": 48,
    "maxCandidatesPerPick": 128, "maxQueryNodes": 64,
    "maxAttempts": 3, "maxDrawsPerAttempt": 4, "costClass": "small"}
}
```

```json
{
  "schema": 1, "id": "table:core.storylets", "rev": 1,
  "pool": {"kind": "card", "ref": "pool:admitted.storylets@1"},
  "query": {"any": [{"tag": "daily"}, {"tag": "opportunity"}, {"tag": "callback"}]},
  "requires": {"fact": "candidate.available", "op": "eq", "value": true},
  "baseWeight": 10, "weightRules": [],
  "strata": [
    {"id": "rare", "query": {"tag": "rare"}, "weight": 10},
    {"id": "ordinary", "query": {"all": []}, "weight": 90}
  ],
  "emptyStratum": "renormalize", "fallback": "fallback:storylets.quiet_window@1",
  "policy": "adjective:world.grounded_story@1",
  "budget": {"maxEntities": 4, "maxDrawsPerGameDay": 120,
    "maxCandidatesPerPick": 8, "maxQueryNodes": 64,
    "maxAttempts": 3, "maxDrawsPerAttempt": 10, "costClass": "small"}
}
```

A view manifest has `schema`, `id`, `rev`, `base`, ordered `overlays` and
typed `contextRef`. It is a resolver recipe, not another candidate table or
tag store. Full example:

```json
{
  "schema": 1, "id": "view:village.materials", "rev": 1,
  "base": "table:core.materials@1",
  "overlays": ["overlay:world.village@1", "overlay:region.village_marsh@1"],
  "contextRef": "context:village.marsh_supply@1"
}
```

The storylet fixture reserves at most ten draws per attempt: category,
pattern and item selection plus a worst-case seven-swap refill for eight
members. Bag selection uses the refill instead of the weighted-item draw;
ten is a conservative bound. Three attempts reserve thirty, so four daily
outputs fit 120. Larger admitted pools require a reviewed budget/profile
revision or a bounded hierarchical selector; never truncate the pool.

The following nine rows completely specify the other view manifests by that
shape. All revs are 1; world-overlay IDs apply their table-specific ops as
listed below. Each context adapter resolves actual world/region/actor, time,
installed content, hard bounds, eligibility and frozen refs. Exact API names
await integration. Pool view automatically enumerates **admitted tagged
definitions**, never the illustrative IDs in the tables below.

| View ID | Base ref | Ordered overlays | Context ref / actual reader |
|---|---|---|---|
| `view:village.people` | `table:core.people@1` | `overlay:world.village@1` | `context:village.market_contact@1`; meet an available worker, not an invented duplicate Oren |
| `view:village.storylets` | `table:core.storylets@1` | `overlay:world.village@1` | `context:village.need_window@1`; admit a real request or quiet window |
| `view:village.materials` | `table:core.materials@1` | `overlay:world.village@1`, `overlay:region.village_marsh@1` | `context:village.marsh_supply@1`; actual collect/buy/preparation supply |
| `view:hp.people` | `table:core.people@1` | `overlay:world.hp_nursery@1` | `context:hp.supervised_contact@1`; qualified lesson/paid nursery help |
| `view:hp.storylets` | `table:core.storylets@1` | `overlay:world.hp_nursery@1` | `context:hp.nursery_window@1`; supervised batch or care request |
| `view:hp.materials` | `table:core.materials@1` | `overlay:world.hp_nursery@1`, `overlay:region.hp_nursery@1` | `context:hp.nursery_supply@1`; owned/purchased usable harvest |
| `view:jjk.people` | `table:core.people@1` | `overlay:world.jjk_dispatch@1` | `context:jjk.report_contact@1`; actual witness/support contact |
| `view:jjk.storylets` | `table:core.storylets@1` | `overlay:world.jjk_dispatch@1` | `context:jjk.dispatch_window@1`; report/test/help/refusal |
| `view:jjk.materials` | `table:core.materials@1` | `overlay:world.jjk_dispatch@1`, `overlay:region.jjk_store@1` | `context:jjk.support_supply@1`; mundane carrier/repair/marker stock |

These pool ref contracts use the context's world-instance/era automatically.
HP labels are original continuity labels from the brief, not native world IDs.
JJK contexts follow a modern original local dispatch proposal, not a verified
canon cast. Context availability includes means, custody/stock, prerequisites,
era, source/body/method, relationship eligibility and actual observation where
needed. A definition's existence or matching tags never proves these.

## W2: Village, needs and physical preparation

World overlay for people removes `not people`; storylets remove
`not daily AND not opportunity AND not callback`; materials remove `not herb
AND not cloth`. These are ordinary JSON query trees under O1, not changes to
the registry. Material region overlay is O1's marsh example. For people, an
available `kind` worker gets +2. For storylets, `money` gets +3 only while the
context supplies a funded need, checked by requires.

Policy: surprise 40/1000, plausible = `daily` for cards, `people` for people,
`herb OR cloth` for materials; iid within-category picks; rare category
guaranteed on the 12th eligible rare-stock/story opportunity, independently
scoped to each relevant table. People use no guarantee. No daily rare stock
means no rarity-window increment.

| Table | Synthetic admitted examples, tags | Qualification and weights |
|---|---|---|
| People | `person:village.mender` [people, kind]; `person:village.traveler` [people, rare, curious] | Present/contactable and not already instantiated under another ID. Mender routine 12, traveler exceptional 10. Shares 90:10 if both qualify. |
| Storylets | `card:village.cloth_need` [daily, money]; `card:village.market_account` [opportunity, rare] | Need has remaining repair work and reserved fee; account has an actual speaker/basis. Weights 13 ordinary, 10 rare. Refusal transfers nothing; report never repairs the cart. |
| Materials | `item:village.flax` [material, cloth]; `item:village.marsh_mint` [material, herb, wet, marsh_supply, rare] | Actual source/stock in this window. Flax fresh 12 ordinary; mint fresh 12+wet bonus 4=16 rare. Rare odds 10% absent force. |

New catalogue envelope, **not A2's save serialization**:

```json
{
  "id": "item:village.rush", "rev": 1, "kind": "item",
  "tags": ["material", "herb", "wet", "marsh_supply"],
  "ownerRef": "fixture:village.marsh_rush_stock@1",
  "sourceMode": "ORIGINAL_PROPOSAL"
}
```

One admission to the item owner and A2 tags updates the catalogue index. No
table/overlay file edit. Rush enters the ordinary material stratum at weight
16. With flax weight 12, ordinary pick odds become flax 12/28, rush 16/28;
rare mint stays 10% of ordinary-policy category selections. The new item also
matches the existing material query for preparation (`herb AND not rotten`)
and collection (`herb AND wet AND marsh_supply`), each a context of the same
base table with typed supply qualification. It cannot be collected in an
empty source just because it is tagged wet.

Existing people/storylet readers use query-based material inputs. The mender's
cloth job still needs cloth and **does not accept rush**. An already authored
herb request and nursery-work role can bind rush through their material
selector when owned stock exists. Rush does not join the people/card pools.
That negative witness is part of the zero-edit claim, not an exception to it.

Illustrative fixed draws: category bucket 89/100 selects ordinary in the
code-point order ordinary then rare; item bucket 15/28 selects rush after
flax. Freeze the rush supply ref, then the collection consumer revalidates
and moves actual stock. These are hand calculations, not G1 output.

## W3: HP, supervised work and source eligibility

World material overlay removes `not nursery_supply`; region adds +4 to
`herb AND wet` and removes rotten. People selection requires the actual
supervision/access adapter; storylets require the selected care/batch cause.
Matching `nursery_supply` never grants a magical faculty, wand bond, mastery,
permission or inherited trained spells. This follows the brief's distinctions.

Policy: people iid; storylet items bag within category; materials iid.
Surprise 30/1000, plausible = `nursery_supply` for materials, `nursery_role`
for people and `daily` for storylets. Rare storylet guarantee every 16 eligible
windows; rare material schedule none. Bag is uniform over positive-weight
members, not a weighted bag; category shares remain 90:10. See P5 for the
G1 adapter constraint. All values are tuning proposals.

| Table | Synthetic admitted examples, tags | Qualification and weights |
|---|---|---|
| People | `person:hp.elias_fixture` [people, nursery_role, kind]; `person:hp.visiting_fitter` [people, craft_role, rare] | Introduced/available and legitimately qualified for the requested lesson. Routine worker 10, exceptional fitter 10. A child cannot independently hire unsupported staff. |
| Storylets | `card:hp.damp_batch` [daily, nursery_role]; `card:hp.fitting_visit` [opportunity, rare, craft_role] | Batch uses owned input and a qualified supervisor; visit uses a real appointment. Both 10. Unknown magical eligibility suspends that route; mundane tending remains possible. |
| Materials | `item:hp.nursery_leaf` [material, herb, wet, nursery_supply]; `item:hp.fitting_fiber` [material, cloth, nursery_supply, rare] | Eligible owned/purchased samples, not a free harvest. Leaf 16 ordinary, fiber 12 rare. Rare fraction remains 10% when both available. |

```json
{
  "id": "item:hp.lantern_moss", "rev": 1, "kind": "item",
  "tags": ["material", "herb", "wet", "nursery_supply", "calming"],
  "ownerRef": "fixture:hp.moss_stock@1", "sourceMode": "ORIGINAL_PROPOSAL"
}
```

Admit once: moss joins material supply at fresh 12+4=16, supervised
preparation selector `herb AND nursery_supply AND not rotten`, and tending
selector `herb AND wet AND nursery_supply`. These are existing query-based
contexts/readers, so tables do not change. Preparation still needs a separately
authored supported recipe/method. `calming` is a property tag, not a proved
potion effect or safe-use claim. A mundane entrant can handle supported
materials but gains no magic from this selection.

The damp-batch storylet's input slot queries those materials and can bind
moss; Elias's job reader can offer an actual moss-care task. Fitting visit
still requires compatible craft inputs and cannot accept moss as cloth.
People entries remain people, card entries remain cards. Illustration:
ordinary materials leaf:moss = 16:16; each has 45% overall ordinary-policy
odds with the 10% rare category available. A patched pool can change an
unseen moss pick, but an accepted batch retains its actual input/cost terms.

## W4: JJK, reports, perception and barriers

Use the current packet's incomplete report, one authored known entry predicate,
qualified help and no-contract refusal. No roll invents a witnessed curse,
upgrades fictional grade to actual strength, or supplies an innate technique.
The examples deliberately use mundane support materials so there is no new
canon rule about creating cursed tools by tagging a cloth.

World materials remove `not support_supply`; store region reweights cloth
+4 and removes broken. People include `report_role` OR `support_role` under
actual contact availability. Storylets retain `report` OR `dispatch` cards
with required actual cause; absence of a mission means no fabricated deadline.

Policy: iid, surprise 180/1000; plausible = `support_supply` for materials,
`report_role` for people, `report` for cards. Thus a qualified support person
or dispatch story can be surprising while still lawful. People rarity none;
storylet rarity every 8 **eligible** rare report windows; materials none.
The higher surprise is an original pacing proposal, not a canon frequency.

| Table | Synthetic admitted examples, tags | Qualification and weights |
|---|---|---|
| People | `person:jjk.witness_fixture` [people, report_role]; `person:jjk.support_fixture` [people, support_role, rare] | Witness can report only actual perceptions; specialist can help only with declared method/access. Both 10; lack of sight is not absence of a phenomenon. |
| Storylets | `card:jjk.partial_report` [daily, report]; `card:jjk.curtain_test` [opportunity, dispatch, rare] | Speaker/basis for report; qualified actor and authored predicate for test. Both 10. A report is a claim with unresolved fields, never generated hidden truth delivered as prose. |
| Materials | `item:jjk.marker_ink` [material, oil, support_supply]; `item:jjk.padded_wrap` [material, cloth, support_supply, rare] | Actual mundane source/stock; no technique grant. Ink fresh 12 ordinary; wrap fresh 12+4=16 rare. |

```json
{
  "id": "item:jjk.survey_cloth", "rev": 1, "kind": "item",
  "tags": ["material", "cloth", "support_supply"],
  "ownerRef": "fixture:jjk.cloth_stock@1", "sourceMode": "ORIGINAL_PROPOSAL"
}
```

Admit once: cloth joins supply, repair `cloth AND not broken`, and protective
packing `cloth AND support_supply AND not rotten` selectors without table
edits. Its ordinary weight is 16, so ink:cloth =12:16 while rare wrap retains
10% category share. An inspection-marker job can use cloth only if its
existing recipe permits that carrier. It does not become a spell/barrier,
a report witness, a cursed tool or an innate technique.

Support-person job and curtain-test preparation bind it by material ref;
report occurrence still needs a real report and the test still needs qualified
access. Failed save retains stock and unconsumed pin. An exact pin to cloth
can choose it once when eligible; banning cloth blocks that pin; banning
all cloth leaves ink and the table's empty-stratum rule intact.

## W5: zero-edit witnesses and revision exercise

For each world, evaluate the unchanged nine view/base/overlay data files
before and after admitting the new material. Assert its three listed material
selectors match, and kind guards prevent people/card membership. Then run
existing reader qualification with actual stock/method/actor fixtures and
the missing-stock/unsupported-method negatives. Hashes of table/overlay files
are unchanged; content manifest changes. This is the requested zero-table-edit
mechanism, not evidence that any source consumer already does it.

To test GR7 for every entity kind, admit one new tagged person and one new
tagged card separately: the world-qualified pools automatically include them
in their matching strata, without material-table membership. Adding an item
cannot honestly demonstrate person/card membership in typed pools.

Reveal rush on day 12; accept HP batch on day 12 without displaying it;
leave JJK supply address day 13 unadmitted. Admit the three new materials
under content manifest v2. Village known rush and HP accepted terms stay
v1; day-13 JJK pick uses v2. A peek from v1 becomes stale; no window/counter
advances until a v2 commit. Native save/reload/import is a future gate.

## Vocabulary additions

Proposed A2 tag definitions only: `material`; `marsh_supply`, `nursery_supply`,
`support_supply` (supply classification, not capabilities); `nursery_role`,
`craft_role`, `report_role`, `support_role`, `report`, `dispatch`. A2 owns
their registration/kind/parents/visibility. Fixture tags do not require
strengths or a second world-specific namespace parser. ID world scope and
pool/context bounds prevent accidental cross-world inclusion.
