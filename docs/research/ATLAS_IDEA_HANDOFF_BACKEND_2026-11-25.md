# Backlog-first handoff backend

Preflight: the existing public owner-ideas API owns source admission and row identity; the existing immutable handoff queue owns storage. This slice adds a typed idea source without fabricating a book, reading pass or batch row. AD36/AD43 apply. Portable owns the form and mixed-source Workbench presentation; Klein's implementation/native-proof sidecars remain the shared evidence mechanism.

F1: An idea previously had to be carried into a reading-output form before a proposal could be saved. `idea-handoffs.mjs` now prepares and saves `atlas-idea-handoff/1` through the existing content-addressed writer. Every submission re-runs `readOwnerIdeas` on the canonical allowlisted owner and selects the exact idea ID. It compares the current document hash and requires a citable reference. Client title, excerpt, classification, stage and reading identity are not trusted or stored.

F2: The API is `POST /idea-handoffs` with JSON `{ownerReference, ideaId, documentHash, change, check}`. The first three come from the current owner-ideas page and selected row. Change/check are required trimmed text, each at most 500 characters. Success is HTTP 200 with `{id, schema: "atlas-idea-handoff/1", status: "proposed"}`. Stale document identity returns 409; a changed or absent exact row returns 404; invalid owner or proposal fields return 400, with the owner's existing public-boundary refusal able to return 403. Reopen the current owner after identity failures.

| Packet field | Stored value |
| --- | --- |
| `schema`, `stage` | `atlas-idea-handoff/1`, `proposed` |
| `proposal` | Automatic exact `backlog: row.reference`, plus submitted `change` and `check` |
| `source.kind` | `idea-owner` |
| `source` identity | `ownerReference`, `reference`, `ideaId`, `documentHash`, `sourceReference`, `lineStart`, `lineEnd`, `section` from the admitted current owner row |
| `record` | Trusted `label`, `type: idea`, source `classification`, `entryLabel`, nullable `code`, bounded `excerpt`, and the exact public `/idea-owner-ideas?owner=…&idea=…` verification route |

F3: Identical retries produce one immutable packet ID, the SHA-256 of the serialized packet bytes. Different source sections sharing a code remain different idea identities. Existing reading packets stay byte-identical. `GET /reading-handoffs` admits both proposal schemas in the same queue. Existing implementation-report and native-playtest sidecars can bind an idea proposal without changing their historical schemas or promoting its proposed stage.

V1: `node --test tests/atlas_idea_handoffs.test.js tests/atlas_reading_handoffs.test.js` passed 17/17. It covers exact-row/classification preservation, stale hash and changed wording rejection, public owner admission, required bounded proposal text, concurrent retry deduplication, mixed queue reads, unchanged older reading packets and positive idea → implementation report → native-proof attachment. The attachment uses a named synthetic protocol fixture, not a real gameplay claim. Test workspaces are removed through their cleanup hooks.

V2: `node --check prototypes/world-atlas/idea-handoffs.mjs`, `node --check prototypes/world-atlas/serve.mjs` and scoped `git diff --check` passed. The API/schema was delivered to Portable. Existing model/server hunks were coordinated with Klein before editing. This backend lane made no real queue submission, browser claim, source-output change, full-suite run, commit or push. Frontend and normal browser acceptance remain with Portable and the coordinator.
