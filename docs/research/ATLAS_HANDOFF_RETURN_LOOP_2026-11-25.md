# Atlas reading handoff return loop, 2026-11-25

```receipt
build: 9de2dbb6f60f99c71f6269cc2c493655e6bd02fb4e2af512cf8a70500ba9bb49
route: fixture(isolated-reading-handoffs)
state: browser-verified
viewport: 1920×1080 desktop
persistence: checked
tests: 24 focused tests and the standalone headless proof passed
review: diff-scoped
```

The build identity is the SHA-256 of the three-module fingerprint map in the [browser result](../representations/evidence/atlas-handoff-return-2026-11-25/result.json). The Atlas serves these modules directly. This is not a game bundle, installed app or release claim.

| Preflight | Scope |
| --- | --- |
| Request | Close a saved reading proposal's return loop with a named runtime consumer, player entry and actual local receipt, keeping the proposal immutable and the report distinct from verification or release. |
| Fit and authority | Existing reading-handoffs packet publisher, Workbench queue and local server. Explicit user-directed Atlas implementation workflow. AR3, AD36, AD43; desktop-first UR33/UR43/UR74. |
| Files | reading-handoffs.mjs, reading-handoffs-view.mjs, their scoped serve.mjs route/import, atlas_reading_handoffs.test.js and standalone prove-handoff-implementation.mjs. Other Atlas proof files and unrelated server routes are unchanged by this lane. |
| Ordinary route | Open a specific immutable proposal in Workbench, attach the consumer name/path, playable entry and receipt path, then revisit it. A public file that changes becomes drifted; a missing or newly private target becomes unavailable. |
| Element states | Proposal stays Proposed. The separate report reads Implementation report attached, with matching/changed/unavailable/unchecked file state. The form keeps entered values on failure and disables its submission while saving. Direct proposal routes link back to all handoffs. |
| Failure and checks | Concurrent retries must produce one complete report; traversal and private/escaping links must fail; changed bytes and retargeted links must not look current. Tests use real isolated files and directory links. |
| Boundaries | Paths and fingerprints are checked. The report remains an implementer's statement; no gameplay test, source truth, acceptance, commit or release is inferred from it. |

## Delivered behavior

R1: Implementation reports are content-addressed files in the queue's `implementation-reports` subdirectory. They reference the proposal ID and keep a consumer name, public repo-relative `src/` file, player route and public `docs/` receipt. Current bytes and canonical targets are fingerprinted. No timestamp or mutable status is written into the original proposal, so identical submissions remain idempotent.

R2: Paths are normalized, existing regular files are required, and both requested and real paths must remain within the appropriate public repository area. Traversal, absolute paths, hidden/private/sealed/secret path names, wrong-area targets and links escaping the root are rejected. A later edit or public-link retarget labels the registered file changed; a missing or private retarget labels it unavailable without exposing the new target. Stored report bytes remain immutable.

R3: `#workbench/handoffs/<proposal-id>` filters to the specific proposal and keeps that destination after attachment or retry. Reports are shown separately from proposal text. Exact accessible labels now identify the reading-record select and attachment fields.

The scoped POST endpoint is `/reading-handoffs/<proposal-id>/implementation-reports`, with `consumerName`, `consumerPath`, `playerRoute` and `receiptPath`. The queue GET adds optional `implementationReports` only to entries with reports; old unattached packets retain their prior shape. The coordinator has the full result-field contract for its other Atlas links.

## Evidence and limits

| Check | Result |
| --- | --- |
| Focused tests | `node --test tests/atlas_reading_handoffs.test.js tests/atlas_output_records.test.js tests/atlas_reader_proposals.test.js`: 24/24 passed. Includes concurrent idempotency, immutable proposal bytes, real-file drift/removal, wrong paths, outside/private junctions, same-byte link retargets, private retarget readback and damaged reports. |
| Browser | `node prototypes/world-atlas/prove-handoff-implementation.mjs` passed with normal process exit. Real Atlas server and view, isolated synthetic queue, existing public consumer/receipt paths, fresh headless Chrome at 1920×1080. The proposal fixture makes no actual reading-coverage claim. |
| Shown and used | [Attachment form](../representations/evidence/atlas-handoff-return-2026-11-25/attach-form.png), [attached report](../representations/evidence/atlas-handoff-return-2026-11-25/report-attached.png), [drift label](../representations/evidence/atlas-handoff-return-2026-11-25/file-drift.png). Visually inspected. No horizontal document overflow or page errors. |
| Persistence | A normal reload preserved the attachment. A duplicate API submission returned the same report ID and one saved report. Proposal bytes and Proposed stage stayed unchanged. Endpoint rejected traversal with 400 and cross-origin writes with 403. |
| Drift scope | The browser used a historical-fingerprint fixture to exercise the real GET drift projection without editing shared runtime files. Unit tests changed actual bytes, removed a receipt and retargeted links in isolated workspaces. |
| Architecture | `npm run check:arch` passed, with existing six grandfathered main imports and 205 cycle edges unchanged. |
| Rules | Rules index, receipts, direction sync, player text/durations, names and continuity passed. The final route check warned that the optional `private_packs/**` glob matched no mounted file; this lane did not change that unrelated rule route. |
| Review | Agent-verified, not human-reviewed. No automatic verification, acceptance, release or public upload. The normal proof removed its isolated snapshot, queue and server and closed its browser. |

The coordinator's independent backlog lookup and output-row handoff links are separate hunks. The recorded module hashes identify the code at this proof; a later combined proof owns those additions.

The desktop Workbench queue can now show proposals awaiting a report, proposals with a report, or entries whose reported files changed or disappeared. The rebuilt browser proof exercised each filter using one waiting proposal and one reported proposal with historical and current file versions. The [real Slumber chapter handoff](../representations/evidence/atlas-workbench-2026-11-25/actual-slumber-implementation.json) also reopened with matching consumer and receipt fingerprints.
