# ER10 report, 2026-10-14

## CHECKPOINT

Research complete. Owned outputs written; no runtime/browser acceptance claimed.
Resume from [research report](../../../../research/BROWSER_PLATFORM_BEHAVIOR_2026-10-14.md)
for named missing evidence only. Recommendations remain proposals.

## Files written

| Code | File / result |
| --- | --- |
| ER10-O1 | `docs/research/BROWSER_PLATFORM_BEHAVIOR_2026-10-14.md`: desktop four-browser table F1–F15, dated official URLs, C1–C6 contradictions/version gaps, READ mappings R1–R9, severity/reproduction/smallest handling and ranked A1–A5. |
| ER10-O2 | `docs/gm/dispatch/engine-runtime-2026-10-14/ER10/REPORT.md`: this completion/limits record. |

## Findings

ER10-R3: the current page-lifetime Web Lock and startup-only `ownsSave` result
need a lifecycle handoff design before any automatic takeover proposal. Chrome
146's held-lock caching plus contention/query eviction is newer than blanket
lock-blocker guidance. Safari/Firefox exact cache-lock behavior is not established.

ER10-R9: locale collation occurs in consequential simulation/controller and
pursuit ordering, not just labels. A fixed display locale would not fix that.

ER10-R4/R5: disk-percentage quotas apply to origin-managed storage, not the small
localStorage limit. Same-origin backups do not survive origin eviction. Safari's
cap counts Safari-use days without interaction; installed first-party exceptions
exist. Granted persistence is not proven to override ITP.

## Commands and checks run

READ-only command groups, executed on 2026-10-14:

```sh
cat docs/gm/dispatch/engine-runtime-2026-10-14/COMMON.md
cat AGENTS.md PROJECT.md /Users/weiwei/.claude/user-preferences.md
git status --short
rg -n 'RT[0-9]+|MC[0-9]+|^##' docs/ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md
rg -n 'localStorage|indexedDB|navigator.storage|navigator.locks|CompressionStream|DecompressionStream|beforeunload|pagehide|pageshow|visibilitychange|requestAnimationFrame|new Worker|Intl\.' src --glob '!SECRETS*'
rg -n 'localeCompare|toLocaleString|Math\.(log|exp|pow)' src --glob '!SECRETS*'
```

Additional targeted `sed -n` / `nl -ba ... | sed -n` reads covered main's
ownership, shared adapter, save path, startup, timer/counters; save_files codec
and quota guard; expansion_persistence; combat/skill math; simulation order;
visibility listeners; USER_VISION; E1–E10; offline audit; ER1 and ER3.
Two exploratory source commands named nonexistent skill/component paths;
`rg` reported those paths missing. Corrected to `src/models/skill.js` and
the actual relevant files; no missing-path result is used as source evidence.
Some broad output was truncated, so relevant ranges were read again narrowly.

External checks: web open/search/find on the report's official URLs, plus Python
`urllib.request`/`json` read-only fetches of MDN BCD (CompressionStream,
LockManager, StorageManager), GitHub Web Locks issue 81/comments and WebKit PR
48369 metadata. Constructor support floors extracted: Chrome 80/Safari
16.4/Firefox 113 for CompressionStream; Chrome 69/Safari 15.4/Firefox 96 for
Web Locks. Edge BCD mirrors Chromium. PR metadata returned closed, merged false,
merged_at null. These are STATED external metadata, not MEASURED browser behavior.

Memory registry quick search found no relevant lane/code entry; no historical
memory claim was used. Existing dirty tree was inspected and preserved.
Final owned-document check verifies row coverage, source references, local links,
READ locations and no banned em dash/double-hyphen prose. No gameplay test suite
was run for this documentation-only lane. No builds, installs, commits or pushes.

## Open questions and acceptance

| Code | Remaining evidence |
| --- | --- |
| ER10-Q1 | Exact supported Firefox build's beforeunload/bfcache behavior, because MDN and web.dev disagree. |
| ER10-Q2 | Current Safari/Firefox held/pending-lock cache behavior and Edge shipment of Chrome 146 policy. |
| ER10-Q3 | Exact current Safari and per-engine/type hidden-worker throttling. No numeric guarantee from checked official docs. |
| ER10-Q4 | Safari persist versus ITP retention in supported normal/installed modes, with synthetic origins. Unmerged fix is not evidence of a shipped fix. |
| ER10-Q5 | Fresh isolated desktop browser journeys for hidden/sleep/discard, two-tab ownership and affected Save/reload/literal-file Import after any authorized implementation. |

Research deliverable is complete; implementation, native gameplay, actual quota
and retention measurements remain unrun. No new product policy or authoritative
acceptance gate was selected. Root palette and project owners remain read-only.
