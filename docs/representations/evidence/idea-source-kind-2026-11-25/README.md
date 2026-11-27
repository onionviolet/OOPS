# Cross-owner source-kind filter

Status: agent-verified at 1366×900, not human-reviewed.

| Preflight | Scope |
|---|---|
| Request | Add an optional filter for the existing structured row kinds, preserving unfiltered search and shareable pagination. No ranking or acceptance inference. |
| Authority | Parent's bounded final backlog-prioritization slice; AD36/AD43, AR3/AR8. Source context remains classification, not completion. |
| Route | Normal Workbench → Ideas and backlogs → enter term → choose source kind → Search all idea owners → page/reload/open exact entry. |
| Mechanism | Existing search accepts optional `kind` using the five actual `row.kind` values, filters before slicing pages and retains the existing source-order sort. GET parsing and UI preserve it in URLs. |
| Files | `owner-idea-search.mjs`, named search GET hunk, search view, focused tests/browser proof and this evidence. No native game changes or new persistence keys. |
| Failure/check | Proposal context could be mislabeled as acceptance, a filter could change pagination totals, invalid kinds could scan before refusal, or initial load could launch an extra query. Tests and normal UI proof cover those cases. |
| Desktop | 1366×900. Accessible Source kind select, explicit search submission, clear source-kind labels and original exact-entry links. Mobile deferred. |

## Actual corpus comparison

Normal cross-owner search for **method** reads the same 296 canonical files and returns 415 unfiltered structured entries. This is a query-result count, not a count of open features. The optional filtered totals were:

| Existing kind | UI label | Matching entries |
|---|---|---:|
| `feature-proposal` | Proposals (source context) | 79 |
| `acceptance-check` | Acceptance checks (not execution) | 4 |
| `finding` | Reported findings | 21 |
| `historical-note` | Historical/report notes | 26 |
| `backlog-entry` | Backlog entries (unclassified) | 285 |

Each filtered result is bounded by the unfiltered count; their sum is exactly 415. Existing row kinds and source labels are unchanged. No ranking, priority, acceptance or completion status was invented.

`node tests/atlas_idea_source_kind_browser.mjs` (AD36): passed, zero page errors, browser/server exited 0. It verifies the normal form and GET parsing, exact per-kind row IDs, explicit kind URLs, proposal pagination 1–25 → 26–50 → 1–25, page reload/share state, and an exact acceptance-check entry link with reload/back navigation. Clearing the kind restores the original unfiltered rows and total. Unsupported `kind=accepted` returns 400. Initial directory load and changing the select made no cross-owner query request; the explicit Search action performs the query.

`node --test tests/atlas_idea_search.test.js tests/atlas_idea_owners.test.js tests/atlas_idea_handoffs.test.js`: **23 passed**, including invalid-kind refusal before scanning, all five source classifications, filtering before pagination, exact codes, private/unlisted exclusion and existing immutable handoff behavior. Syntax, owned-file whitespace and docs checks passed.

Three captures were inspected: [mixed/default](mixed-method-1366.png), [proposal context](proposal-method-1366.png), [acceptance checks](acceptance-check-method-1366.png). [Proof data](proof.json) records exact source hashes, totals, viewport and query checks. No earlier evidence was overwritten, and no game build, gameplay mutation, source acquisition, spend, commit or push was performed in this lane.
