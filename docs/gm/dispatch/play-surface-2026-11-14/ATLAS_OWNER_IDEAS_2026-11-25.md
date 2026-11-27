# Browse coded ideas inside an owner

Status: agent-verified on the adopted desktop Atlas, not human-reviewed.

## Preflight

| Field | Scope |
|---|---|
| Request | The Ideas directory could search document/section names but could not browse or cite an individual idea. Add a bounded on-demand reader for canonical public owners. |
| Authority | Parent's explicit idea-level backlog task; AD6/AD36, AR14, [UI rules](../../../UI_RULES.md) UR70–UR75. Existing documents retain their decisions, priorities and historical statuses. |
| Concrete owner | [Gameplay loops and world ideas](../../../research/GAMEPLAY_LOOPS_AND_WORLD_IDEAS_2026-10-26.md): N2 is a coded table row, P2 appears in a rank/code table, and A1 occurs in two different sections with different meanings. |
| Visible outcome | At 1366×768, Workbench → Ideas and backlogs → selected owner → Browse ideas shows coded entries, source sections and exact citations. A selected reference prefills the existing handoff form. Mobile is deferred. |
| Fit and ownership | Existing owner directory, proposal text and immutable handoff contract; dedicated read-only `/idea-owner-ideas` endpoint, bounded owner parser/view and focused tests/proof. No runtime, source-reading, automatic proposal or generation work. |
| Adverse checks | Duplicate codes, changed/absent IDs, private/outside/escaped paths and link targets; source wording must not silently inherit an older idea ID. No owner contents fetch before the user opens Browse. |

Voice sample: “A citation records a proposal, not acceptance or completion.” The view labels its count as coded entries, retains section names and existing wording, and separates exact saved citations from implementation status.

## Behavior and identity

Browse reads one selected document from the canonical directory derived from `IDEA_INDEX.md` and public backlog owners. Handoff-supplied arbitrary documents are not an additional content allowlist. The endpoint checks the canonical reference and resolved public `docs/` target before reading; private/sealed, traversal, escaped and outside aliases are excluded. Directory loading still reads metadata rather than scanning owner contents.

The parser recognizes established coded Markdown table first cells, including ranked cells such as `2 · P2`, coded headings and coded paragraph/list starts. It skips fenced examples. Section hierarchy is retained, including duplicate-heading anchors. Uncoded prose stays outside parsed entries, and the parser assigns no decision or work status. Unsupported conventions may produce no coded entries, with that limitation shown.

An idea's SHA-256 identity covers its owner, section hierarchy, code, exact Markdown wording and repeated-row occurrence. The saved text is `docs/...md#idea-<full SHA-256>`. Unrelated line insertion does not replace that identity; changed wording or section does. Current source line ranges, section and document fingerprint accompany lookup results. The saved exact reference itself resolves through the endpoint, and an absent or changed ID returns 404 instead of picking another row with the same code.

The actual gameplay owner's N2 reference is 128 characters, within the handoff form's existing 160-character limit. For unusually long owner paths, the view disables the shortcut and explains the existing limit rather than silently truncating the exact citation. Lookup remains available. No handoff schema or limit was changed.

Exact citations link back to their document owner. Content-hash fragments do not create invented owner-section rows. An idea lists saved handoffs that contain its exact reference; older unqualified code text is retained without being remapped. No exact citation means no recorded exact citation, rather than no implementation. Harry's existing backlog-first work and implementation wording remain intact.

| State | Display |
|---|---|
| Directory view | No owner-content request; document/section search and prior owner reverse links remain available. |
| Owner opened | One file's coded entries, searchable locally and shown in pages of 30. Code-shaped queries match the code exactly. |
| Repeated A1 in different sections | Distinct entries and immutable references, with their source sections visible. |
| Exact idea chosen | The existing handoff form receives the exact reference; no proposal is submitted by the shortcut. |
| Missing/changed idea or restricted owner | Explicit refusal; no fallback to a similarly named row or arbitrary file. |

## Verification

| Command/evidence | Result |
|---|---|
| `node --test tests/atlas_idea_owners.test.js tests/atlas_reading_handoffs.test.js` | Final 16/16 passed. Covers row/section identity, supported conventions, fenced examples, immutable fixture save and source drift, unknown IDs, public alias targets, private/traversal/escaped paths, existing proposal/report boundaries and legacy citation preservation. |
| `node prototypes/world-atlas/prove-owner-ideas.mjs` | Passed, exit 0 at 1366×768. Actual gameplay owner N2/P2 and duplicate A1s, zero contents requests before Browse and one after, exact-reference verification, current local output's unsubmitted handoff prefill, missing-ID/private/escaped-path refusals and no page exceptions/overflow. No synthetic owner or real proposal write. |
| Syntax checks and scoped `git diff --check` | Passed during editing. |
| `npm run check:docs` | Passed with no new hits after correcting two receipt lint findings. |

The actual N2 row resolves to [source line 211](../../../research/GAMEPLAY_LOOPS_AND_WORLD_IDEAS_2026-10-26.md#L211), row SHA-256 `f9dceadaf608390dd3b2a5be153162ddedc37548d8dd2ff66d985c977d673f48`, owner document SHA-256 `66db5cedf058a9e90f827d63ae128517167063acc8b9e5b16d14340b767de186`. [Machine proof](../../../representations/evidence/atlas-owner-ideas-2026-11-25/proof.json), [1366 desktop capture](../../../representations/evidence/atlas-owner-ideas-2026-11-25/gameplay-N2-1366.png). The capture was visually inspected. The adopted snapshot remained unchanged during the run, SHA-256 `86706819b5f3df29aa04dd2ac1da05d679c62d6e71b4cb34a69e9a778ee79950`.

The owned proof browser/server stopped; test owner/queue fixtures were removed. Retained artifacts are the parser/view/tests, proof script, screenshot, machine proof and this receipt. Other lanes' processes were untouched.

The parent owns integrated release checks. Canonical owner text and real immutable packets remain unchanged. Test saves use a throwaway fixture that is removed after the check.
