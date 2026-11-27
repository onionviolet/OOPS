# Exact idea-entry implementation evidence

Status: agent-verified at 1366×900, not human-reviewed.

| Preflight | Scope |
|---|---|
| Request | Show linked implementation reports and native playtest counts at the exact source entry, rather than an unhelpful blanket implementation-status disclaimer. |
| Authority | Parent's bounded legibility assignment; AD36/AD43, AR3/AR8. Proposed work, citations, reports and native evidence retain their separate meanings. |
| Mechanism | Reuse the loaded handoff queue and existing exact-reference matching. No joins by code, title, consumer label or prose. Named report links open the existing associated handoff detail; build comparison remains inside that detail. |
| Visible result | Counts and report links at PS153/N2. A zero-citation entry says “No linked implementation evidence here” and explicitly avoids claiming game absence. Attachment counts do not verify playthroughs or approve proposals. |
| Files | `idea-owners-view.mjs`, focused browser proof and this new evidence directory. No game, backend, stored proposal/report or earlier proof changes. |
| Failure/check | An unrelated N2 could inherit Harry N2 evidence by code; a report count could look like verification; per-entry rendering could cause repeated requests. Check actual exact citations, detail comparisons and request counts on the normal server. |
| Desktop | 1366×900; native links, existing list styling, readable counts. Mobile deferred. |

`node tests/atlas_exact_idea_evidence_browser.mjs`: passed, zero page errors, browser/server exit 0. Five captures were inspected.

| Actual source entry | Shown evidence | Existing detail comparison |
|---|---|---|
| PS153, play-surface considerations | 1 cited handoff, 1 implementation report, 1 native playtest | Exact current build match |
| Harry N2, gameplay loops/world ideas | 1 cited handoff, 1 implementation report, 2 native playtests | Both earlier/different builds |
| Unrelated N2, ideas-left inventory | 0 handoffs, 0 reports, 0 playtests | No evidence inherited from the matching code |

Each source-page load made one existing handoff-queue request. Filtering and rendering exact entries reused that queue and made no per-entry request. The source classification stays intact; the new counts describe attached evidence, not completion. Report links and tested/current comparisons were exercised through the normal UI.

[Proof data](proof.json) records served view SHA256 `4f8389dca0c3da97ff18937c74da96cebcfeaf39b8f5292ce0fdd14a970f16f3`, current bundle identity and preserved historical hashes. Prior PS153 trace/capture, Harry attachment data and frozen Harry library receipt stayed byte-identical. New captures are separate: [PS153 source](ps153-source-1366.png), [Harry N2 source](harry-n2-source-1366.png), [unrelated N2](unrelated-n2-1366.png), [PS153 detail](ps153-detail-1366.png), [Harry N2 detail](harry-n2-detail-1366.png).

Syntax, owned-file whitespace and docs checks passed. No default game build, gameplay replay, reading, source acquisition, spend, save mutation or extra retained process occurred in this lane.
