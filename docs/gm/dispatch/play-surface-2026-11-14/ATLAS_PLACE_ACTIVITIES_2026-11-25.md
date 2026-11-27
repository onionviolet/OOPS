# Find office materials from the LOTM map

Status: agent-verified in the adopted desktop Atlas, not human-reviewed.

## Preflight

| Field | Scope |
|---|---|
| Request | Make one actual place/activity connection useful beyond reading tables: find where an office-material request happens and follow its source context. |
| Authority | Parent's bounded map task; AD6/AD36, AR3/AR14, WPR5/19–21; [UI rules](../../../UI_RULES.md) UR70–UR75 and desktop-first direction. No new world law, geography or runtime mechanic. |
| Visible result | LOTM Places at 1366×768 and 1920×1080 finds Blackthorn reception by the Slumber request's activity name. Its record shows the actual native approval/collection bindings, authored terms, source context and a Slumber Making link. Mobile remains deferred. |
| Fit and ownership | Exact `defineActs()` commands and `charmMaterialActs()` source rows feed a bounded office-material projection. Existing Things place-record and graph/finder consumers own display. Parent granted these scoped Things/server/static-route hunks. No cast-pack, snapshot-builder or gameplay edit. |
| Failure cases | Foreign worlds and similar place IDs must not acquire the commands. The source reception-sofa area must remain separate. Unknown workshop placement must stay unknown. Empty search and missing admitted source context must not invent a route or evidence. |

Voice sample: “This local request is separate from the monthly material allocation; it does not renew that allocation.” The existing command description and cost text are displayed with an explicit authored boundary. Binding, verified fixture behavior, source evidence and current-character access are separate claims.

## Observed gap and repair

The current adopted snapshot has four registered original LOTM probationer locations and no private cast pack. Neither its registry nor the admitted source-place entities contains `lotm.place.night-watch-reception`. The current game definitions nevertheless bind approval and collection to that exact location ID. The native material receipt's browser fixture names its mapped location “Fixture Blackthorn reception.” This supports **Blackthorn reception · native fixture**, not a canon map placement or a newly registered location.

The Places graph therefore adds that one location as a separately labelled native-fixture node, outside its source-place count. It creates no parent, coordinates within source geography, walk edge or source alias. The source's `lotm.place.reception-area` remains its own place. The separate inscription workshop ID is not remapped to reception or to an inferred source room.

The finder searches existing source affordances and exact native action labels as well as place names. Searching “Request a Slumber practice packet” reaches the qualified reception record. The existing action rows show approval and collection's native five-minute durations, descriptions and costs, their authored extra-requisition boundary and the admitted `lotm.institution.material-quota` context at `zh 第127章 p32`. A source link is drawn when the rule exists in the admitted digest; a citation alone does not invent a source record. A separate link opens Slumber Making and use.

The [native material owner](../procedural-crafting-2026-11-11/LOTM_CHARM_MATERIAL_HANDOFF_2026-11-25.md) records the eligible-maker fixture, actual normal office actions, inscription and persistence. This display inherits that bounded gameplay evidence. It does not establish an earned Klein route or current-character eligibility, and it does not reset the canonically exhausted monthly allocation.

| State | Display |
|---|---|
| Exact office command location | A native-fixture node and two detailed bound operations; source context and Slumber Making links. |
| Source place with a similar name | Its own source record, without office command transfer. |
| Current character's progress or stock unknown | Workshop-history, local-credit and signed-order conditions remain visible; the Atlas does not quote the personal save. |
| Separate inscription workshop placement unknown | Explicitly unplaced; no walk or parent relationship invented. |
| No matching activity | A qualified empty search result. |

## Checks

| Command/evidence | Result |
|---|---|
| `node --test tests/atlas_place_activities.test.js tests/atlas_place_details.test.js` | 6/6 passed: exact live bindings/source IDs, five-minute authored operations, world/location boundaries, duplicate-free fixture node, activity search, existing sealed-place and qualified-route behavior. |
| `node prototypes/world-atlas/prove-place-activities.mjs` | Passed, exit 0 at both 1366×768 and 1920×1080. Activity search reaches the separate reception node; source-context route/reload, Slumber Making link, handoff/report pointer, authored/fixture/access distinctions, unmapped workshop, distinct source reception area and empty search pass with no page exceptions or horizontal overflow. No snapshot regeneration or synthetic source rows. |
| `node --check` on changed view/server/proof modules; scoped `git diff --check` | Passed during editing. |
| `npm run check:docs` | Passed, no new hits. |

The adopted `work/atlas-snapshot/snapshot.json` remained byte-identical during the browser proof, SHA-256 `b6bbd9a4891b0f783110a02fbe645dfb826abddfddb020b281816a564d19c549`. Registration remains a snapshot claim; office-command details are a separate projection from current native definitions. [Machine proof](../../../representations/evidence/atlas-place-activities-2026-11-25/proof.json), [1366 reception record](../../../representations/evidence/atlas-place-activities-2026-11-25/office-activities-1366.png), [1366 lower-pane qualification](../../../representations/evidence/atlas-place-activities-2026-11-25/office-activity-qualification-1366.png), [1920 reception record](../../../representations/evidence/atlas-place-activities-2026-11-25/office-activities-1920.png), [1920 lower-pane qualification](../../../representations/evidence/atlas-place-activities-2026-11-25/office-activity-qualification-1920.png). The 1366 captures were visually inspected.

The ephemeral proof server and browser stopped; no snapshot copy or game fixture was created by this lane. Other lanes' active servers were left untouched. Retained evidence is the focused tests, proof script, captures, machine proof and this receipt.

The parent owns integrated release checks. The adopted snapshot and private source rows remain untouched; this lane changes a development Atlas projection and navigation.
