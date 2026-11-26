# Cross-owner entry search

Status: agent-verified at desktop 1366×768, not human-reviewed.

## Preflight

| Field | Scope |
|---|---|
| Request | Find a mechanic without guessing which named backlog or indexed idea owner contains it, then open its exact source entry. |
| Authority | Parent's explicit follow-up; AD6/AD36, AR14 and [UI rules](../../../UI_RULES.md) UR70–UR75. No gameplay, build, source-acquisition or proposal-writing work. |
| Visible outcome | Workbench → Ideas and backlogs → enter a word/code → explicit Search submission → bounded, shareable results → exact entry in another owner. Mobile remains deferred. |
| Fit | Existing canonical owner allowlist, structured parser and exact-entry detail. The new GET search builds one request-local directory inventory, deduplicates document files and reuses that admission while reading each document. Ordinary entry open/submission still rebuilds current canonical admission. |
| Failure cases | Private/unlisted sources and metric/policy rows must not leak into results. A code must not match a longer code or a mention inside another entry. Source drift must not replace an exact result with a similar row. |

Voice sample: “Results are structured source entries, not a count of open or implemented features.” Source kind, section and reference remain visible. Search does not assign a priority, acceptance state or gameplay status.

## Behavior and cost

The directory performs no cross-owner content scan on plain page load or typing. Submit, or opening a bookmarked search URL, calls `/idea-owner-search?q=...&offset=...&limit=...`. General word queries match entry wording and source section; code-shaped queries match the entire code across owners. Results default to 25, with a server maximum of 50 per page. Empty/overlong queries and invalid pages refuse before directory admission.

The current inventory deduplicates indexed owner sections and named backlog documents to 296 public files. The measured `method`, `gear` and `N2` queries each read that inventory once per request, with 296 files read and zero unreadable owners. Local search took about two seconds per query. It does not walk the docs directory once per owner, cache a startup corpus or return every matching body to the browser. The parser's metadata/fence/metrics exclusions and private/realpath gate remain in use.

Search URLs retain the query, offset and page size. Each result links to the content-addressed existing entry detail; the current owner is read again there. When an indexed document has section entries but no directory-level row, the deep link exposes a document view of that already admitted owner. A changed or missing exact ID remains unavailable rather than selecting a similarly named idea.

## Actual desktop quest

At 1366×768, entering `gear` produced 96 matches across the 296 current canonical files. The proof opened EI24 in `docs/audits/IDEAS_LEFT_INVENTORY_2026-10-25.md`, separate from the gameplay-loop owner used by prior proofs. Its source classification, section, wording and exact reference remained visible after reload. Second-page URL `#workbench/ideas/search?q=gear&offset=25&limit=25` also survived reload. An exact `N2` query returned four distinct rows across owners, without treating a code mention as another N2 entry.

These are query-result counts for the inspected bytes, not a coverage or feature-completion denominator. No owner text, work item, implementation report or native game state was written by this search proof.

## Checks

| Command/evidence | Result |
|---|---|
| `node --test tests/atlas_idea_search.test.js tests/atlas_idea_owners.test.js tests/atlas_idea_handoffs.test.js` | 21/21 passed. Includes one inventory admission and one read per unique document, exact duplicate codes, private/unlisted/metric exclusions, bounded pagination, source drift and existing source/proposal compatibility. |
| `node prototypes/world-atlas/prove-owner-search.mjs` | Passed, exit 0. Actual gear quest, another owner's exact detail/reload, shared second-page/reload, exact N2 and page-cap refusal; zero page errors or horizontal overflow. |
| Syntax/whitespace and `npm run check:docs` | Passed; no new documentation hits. |

[Machine proof](../../../representations/evidence/atlas-owner-search-2026-11-25/proof.json), [gear search](../../../representations/evidence/atlas-owner-search-2026-11-25/gear-search-1366.png), [exact source detail](../../../representations/evidence/atlas-owner-search-2026-11-25/gear-exact-source-1366.png). Both captures were visually inspected. EI24 resolved to row `6d7b6de373753ef08597f4829e879e50bc563d45cab770e73aa39bc1a694b48f`, owner fingerprint `7e29075fe7f3bc13723351b6641a8dd8f9636fd23d30224f9f7548c669654cda`.

Owned proof processes, fixture directories and temporary test log were removed. Retained files are the search/parser/view/tests, proof script, captures, machine proof and this receipt. Reading's backend handoff routes and Klein's native-report/build evidence remain separate. The parent owns integrated release gates.
