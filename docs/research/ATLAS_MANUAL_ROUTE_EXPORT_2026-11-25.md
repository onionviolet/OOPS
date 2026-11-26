# Atlas manual route export

| Preflight | Scope |
| --- | --- |
| Request and authority | Export the existing Workbench build comparison and public manual game routes for another reader or playtester. No launch, teleport, raw reading text or gameplay mutation. |
| Surface and voice | Workbench → Implementation handoffs, 1366×768 desktop. Existing voice: “Compare playtests with this build.” A compact export link appears after successful comparison; mobile deferred. |
| Mechanism and fit | Existing loaded queue plus GET `/reading-handoffs/build-check`; separate browser export module, immutable IDs and public evidence paths. No additional request or server write. |
| Ring and failure | Consumer and UI export; source/proof drift and missing build stay qualified. Download is user initiated. No game-save schema changes. |
| Rules and ownership | AD36, UR70–75, AR14. Own export module/test/proof and narrow queue/import/static asset hunks. No gameplay or build changes. |

The queue now offers **Export manual routes (JSON)** beside a successful build comparison. The user-initiated download reuses the loaded queue and the actual comparison response; it adds no request or server write. It includes each immutable handoff/report/playtest ID, the report's existing manual `playerRoute`, public consumer/receipt/proof paths and saved hashes, comparison counts, and separate source-file status. Source excerpts and reading prose are omitted. A report's historical wording is retained as reported, rather than silently updated or presented as a new playability finding. A matching proof and changed source remain distinct facts; unknown/mismatched proofs do not establish current playability.

| Check | Result and boundary |
| --- | --- |
| `node --test tests/atlas_handoff_route_export.test.js tests/atlas_reading_handoffs.test.js` | 17/17 pass: exact IDs/routes, source drift, changed/missing/different-build proof, public-path filtering, no raw source fields, and existing immutable handoff behavior. |
| `node prototypes/world-atlas/prove-route-export.mjs` | Actual local queue at 1366×768; parsed the browser download, retained Harry's chart-book, Klein's office-materials and the earned cape routes, one comparison GET, zero mutation requests/page errors/overflow. Existing adopted snapshot; no game rebuild or new gameplay proof. [Machine receipt](../representations/evidence/atlas-route-export-2026-11-25/proof.json), [portable export](../representations/evidence/atlas-route-export-2026-11-25/atlas-manual-routes.json), [desktop](../representations/evidence/atlas-route-export-2026-11-25/manual-routes-export-1366.png). |
| Build identity and counts | Compared default bundle `9a960b6694049fb0da8063c09e6245254469cebeaa20c96c8793a7f54f8e9fc1`: nine loaded/compared handoffs, three matching native receipts, ten from other builds, zero unverified. Counts are this run's snapshot, not a permanent project total. |
| Fit and visible state | Initially three complete queue rows fit, third bottom 751.5 px. After comparison two complete rows and part of the third fit, third bottom 819.6 px. Export visible versus hidden produced identical row coordinates. Compact readable result paragraphs and a wrapping toolbar summary prevent the export from adding a row. Earlier disclosure and unbounded summary candidates failed the fit check and were replaced. |
| Scope | Agent-verified, not human-reviewed. No gameplay, personal save, immutable queue file, frozen prior evidence or generated bundle changed. Broader current-source route validity and earned prerequisites remain with each implementation's owner/receipt. |

The final proof exited 0 after owned browser and server shutdown. Windows reported a locked private browser profile. Automatic approval review rejected scoped recursive cleanup of this task's six exact `%TEMP%/yairpg-owned-chrome-` directories as “blocked by policy”: `Y8nW4P`, `dzHn3p`, `9pRE50`, `wmdQgY`, `yCRd1Y`, `98gJMt`. These residues remain named; no cleanup of another lane's browser was attempted. Retained public JSON/screens and proof scripts are cited evidence, not scratch.
