# Harry's native study actions on the Atlas

Status: agent-verified on the adopted desktop Atlas, not human-reviewed.

## Preflight

| Field | Scope |
|---|---|
| Request | Exercise the office-material map route on Harry's proven chart-book/Levitation work and extract the shared projection justified by those two consumers. |
| Authority | Parent's bounded second-world task; AD6/AD36, AR3/AR14 and [UI rules](../../../UI_RULES.md) UR70–UR75. No runtime generation, new geography, game mutation or source reading. |
| Visible result | At desktop 1366×768, Harry Potter → Places finds Hogwarts by a library-work action, shows its four real commands and links the reviewed native receipt. Source coverage remains zero. Mobile is deferred. |
| Existing owners | `HP_LIBRARY_COMMANDS` in `src/hp_library_work.js`, registered `book.hp.lead.school_hall` in the adopted map, the [Harry library receipt](HARRY_LIBRARY_WORK_2026-11-25.md) and [first LOTM map slice](ATLAS_PLACE_ACTIVITIES_2026-11-25.md). |
| Failure cases | No invented library node, cross-world location transfer, fake source row or compulsory Workbench packet. Native costs/conditions and fixture verification remain separate from current-save access and novel evidence. Non-ACT LOTM commands must not break server startup. |

Voice sample: “The chart-book shifted, then settled back on its shelf. You noticed where your motion slipped.” The Atlas uses the existing command descriptions and their own conditions, rather than rewriting the gameplay voice or claiming that a failed attempt is free.

## Shared projection and world boundaries

`projectNativeActivities` extracts exact command IDs, worlds, locations, descriptions, durations and named conditions. Two small world-owned wrappers supply the reviewed interpretation and evidence. The original LOTM wrapper retains the actual material source rows, its authored extra-requisition boundary, eligible-maker fixture scope and optional immutable handoff ID. Harry's wrapper reads the four existing library commands, with no source IDs or handoff ID fabricated.

Harry's command location is `book.hp.lead.school_hall`, registered as **Hogwarts, the Great Hall**. The feature currently hosts library work there. The Atlas uses that exact existing node and states that no distinct library location or source geography is asserted. It does not rename the hall or generate a runtime location.

The adopted HP reader digest is an emitted empty file: zero shards, entities and rules. The shared Places consumer can display native activity locations beside an absent or empty reader digest, while keeping its source-record count at zero. An activity projection does not add to reading coverage. An absent reading file and a readable empty digest are both covered by focused tests.

The parent also granted the small world-view routing hunk: a world with a nonempty explicit native-activity projection gets a Places entry. This adds Harry's actual navigation entry without changing its reading state. Native condition-reason strings are labelled as possible blockers, since they describe why a command would refuse rather than reporting the current save's condition.

| State | Display |
|---|---|
| Registered Hogwarts hall | The existing native name/ID and four bound study actions; registration does not establish the character's eligibility. |
| Ladder, chart-book and reference notes | Authored working-default boundary, actual durations and native cost/condition text. Learned Levitation, wand, term access and work-item requirements remain distinct. |
| Native play receipt | Explicit prepared-school-day fixture scope, real Charms/wand and Astronomy actions, paid fizzle/success and persistence evidence, linked to its existing reviewed receipt. No whole opening-to-library claim. |
| No Harry Workbench packet | No handoff/report link is drawn. Backlog-first work remains usable without inventing a packet. |
| LOTM office route | Its own source pointer, authored terms, fixture qualification and optional handoff link remain intact. Unresolved workshop placement stays unresolved. |

The server exposes two exact read-only text assets for the existing public receipts: `/activity-evidence/hp-library` and `/activity-evidence/lotm-materials`. The parent granted these allowlist entries. They do not accept arbitrary paths, and the native activity view gives each link a descriptive label.

## Checks

| Command/evidence | Result |
|---|---|
| `node --test tests/atlas_place_activities.test.js tests/atlas_place_details.test.js` | 7/7 passed during editing. Both genuine worlds, source absence, zero counts, optional packet, exact HALL location, real cast cost/conditions and non-ACT startup regression are covered. |
| `node prototypes/world-atlas/prove-place-activities.mjs` | Passed again after the shared refactor, exit 0 at 1366×768 and 1920×1080, using the unchanged adopted snapshot. Existing LOTM source and Making routes remain usable. |
| `node prototypes/world-atlas/prove-hp-place-activities.mjs` | Passed, exit 0 at 1366×768 using the adopted map and empty actual HP digest: exact native HALL, four commands, real costs and named blockers, zero source coverage, no invented library or packet, public receipt links, unknown receipt 404, direct route/reload, no horizontal overflow or page exceptions. |
| Module syntax checks, scoped `git diff --check` and `npm run check:docs` | Passed. |

Adopted snapshot SHA-256 remained `b6bbd9a4891b0f783110a02fbe645dfb826abddfddb020b281816a564d19c549`. [Machine proof](../../../representations/evidence/atlas-hp-place-activities-2026-11-25/proof.json), [Great Hall actions](../../../representations/evidence/atlas-hp-place-activities-2026-11-25/hogwarts-activities-1366.png), [native evidence and source boundary](../../../representations/evidence/atlas-hp-place-activities-2026-11-25/hogwarts-evidence-1366.png). Both captures were visually inspected. The proof uses a fixed task-owned high localhost port after an earlier OS-assigned port was blocked by Chrome; no other lane's server is reused or stopped.

The final proof's browser and server exited, with no snapshot copies, source fixtures or game saves created. Retained files are the projection/tests, proof script, captures, machine proof and this receipt.

The parent owns integrated release gates. This lane edits the Atlas projection/view and explicit receipt routes, with no gameplay module, private corpus, adopted snapshot, save, packet, commit or deployment changed.
