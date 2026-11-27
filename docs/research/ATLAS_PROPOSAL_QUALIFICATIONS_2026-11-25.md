# Explicit source qualifications between Workbench proposals

Status: agent-verified through the normal desktop Workbench, not human-reviewed. This adds a relation between saved statements; it changes no gameplay or proposal review state.

## Preflight

| Field | Scope |
|---|---|
| Reading | Make a later source's qualification of an earlier saved proposal explicit and navigable, using the actual chapter-130/chapter-129 pair. |
| Authority | Coordinator's bounded request; AD6–AD8 preserve source, implementation and review distinctions; AD35 records evidence; AD36 uses focused verification. |
| Reader sentence | “Qualifies an earlier proposal” on the later detail; “Qualified by later evidence” on the earlier detail. |
| Ordinary route | Workbench → individual implementation handoff → Link an earlier proposal → choose a saved proposal, explain the qualification and cite a public evidence file. |
| Mechanism and fit | Existing immutable content-addressed packet storage, public path/realpath validation and file fingerprints. No existing direct proposal relation was found. |
| Ring | Model, local API, detail form, failure handling and persistence through reload. Existing game and native proof records remain separate. |
| Files | Scoped `reading-handoffs.mjs`, `serve.mjs`, `reading-handoffs-view.mjs`; focused handoff tests and a retained actual proof harness. Harry's readiness view is outside this lane. |
| Failure scenario | A retry duplicates the link, a URL/private path escapes the public evidence boundary, or attaching a relation changes an original proposal/report. Tests and the actual queue proof check these invariants. |
| Screen and voice | Desktop 1920×1080, populated individual proposal details. Existing Workbench voice sample: “Attach an implementation report”. Mobile optimization is deferred under standing direction. |

## Contract and presentation

`POST /reading-handoffs/<later-id>/qualifications` accepts three recognized fields: `earlierProposalId`, `qualification` and `evidencePath`. Both IDs must resolve to unchanged saved reading/backlog proposals in this Workbench queue; self-links are rejected. The bounded explanation is explicit author input. A public `docs/` file is checked through the existing path, realpath and fingerprint route. External URLs, traversal and private/sealed paths are rejected by that same validator.

The separate `atlas-proposal-qualification/1` packet lives under `proposal-qualifications`. Its content-addressed identity makes identical concurrent/retried submissions idempotent. It records the direction, explanation and evidence fingerprint. Original proposal, implementation report and native proof packets are not rewritten. Loading revalidates packet identities and projects recognized relation fields, with separate unreadable accounting. Evidence is shown as unchanged, changed, unavailable or unchecked according to the existing fingerprint mechanism.

Individual proposal details show forward/back links with the two directional headings above. The form states: “Records a source qualification. Saved proposals and gameplay review states stay unchanged.” Direction comes from the saved relation, without guessing from titles, dates or source labels. The qualification describes its bounded subject; it does not declare every earlier gameplay behavior superseded.

## Actual pair and proof

The real chapter-130 proposal `4d1614c2ed8e24b134ba0e637d417faac6a01bd8f9875aa061af46501479cc03` now explicitly qualifies chapter-129 proposal `d36ab6955de9976f57e6204e1cecd183e12acdc64f322f694b686582aecdb773`. The saved explanation limits the qualification to this response's replacement promise: Old Neil's later reassurance supports a contextual release, while his intention to approach Swain does not establish an agreement, claim amount or payment. Evidence is the existing [bounded chapter-130 reading](LOTM_CH130_BOUNDED_READING_2026-11-25.md), fingerprint `80d2713bdb15bae044b733eefd4235805da9c3468384fb55a694f0c623e3f404`.

Relation ID: `1048852b81706998e2e259870afff9e971ab53d0242df1ed2e2ccaa7e6704681`. It is stored in the real local Workbench queue, not a synthetic fixture. The [machine receipt](../representations/evidence/atlas-proposal-qualification-2026-11-25/result.json) records the exact relation, both proposal IDs and file state. The [later detail](../representations/evidence/atlas-proposal-qualification-2026-11-25/later-qualifies-earlier-1920.png) and [earlier detail](../representations/evidence/atlas-proposal-qualification-2026-11-25/earlier-qualified-by-later-1920.png) screenshots were visually inspected.

## Verification

| Check | Result and limits |
|---|---|
| `node --test tests/atlas_reading_handoffs.test.js tests/atlas_idea_handoffs.test.js` | 19/19 passed. Includes concurrent retry, both directions, immutable originals, evidence drift/missing, unknown/self IDs, URL/traversal/private paths, unknown request fields and sidecar projection. |
| All 25 `tests/atlas_*.test.js` files | 160/160 passed, zero failures/skips. [Retained log](../representations/evidence/atlas-proposal-qualification-2026-11-25/atlas-tests.log). |
| `node prototypes/world-atlas/prove-proposal-qualification.mjs` | Exit 0. Normal default server and persistent queue; attached through the actual form at 1920×1080; clicked both directions, reloaded, retried through the API and received the same ID. All 29 preexisting proposal/report/playtest statement files remained byte-identical. Both proposals remained proposed. Zero page errors or horizontal overflow. Owned server/browser closed. |

No game bundle, source corpus, snapshot, digest, source-reading attestation or native gameplay state changed. The retained harness and public screenshots/results are the task's proof; no scratch server or browser remains. Existing native proof attachments and their exact-build comparisons retain their independent scope.
