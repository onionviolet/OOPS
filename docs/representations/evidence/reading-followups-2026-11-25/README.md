# Count-only reading-output follow-ups

Status: agent-verified at 1366×900, not human-reviewed.

| Preflight | Scope |
|---|---|
| Request | Let a reader open affected output files from World → Reading, with separate unindexed/missing reasons, pages and existing output links. Preserve book/field detail and on-demand loading. |
| Authority | Parent's explicit UI follow-up; AD36/AD43, AR3/AR8. Backend owner retains saved-count computation, projection, freshness and regeneration. No game edits. |
| Route | World → Reading → Read stage → Show measured output readiness → Output files to follow up → select reason → Load file counts → page or Open output. |
| Player sentence | “Unindexed counts are rows without an admitted public match. Missing means no selected output file.” Counts do not prove source-fact absence or reading quality. |
| Mechanism and fit | Existing readiness view calls the new count-only GET after an explicit request. Native disclosure, reason select, buttons and compact file cards show approved book/prefix/pass/kind/reason/counts and the supplied existing output route. |
| Files and ring | `reading-readiness-view.mjs`, focused browser proof and this evidence. Presentation, pagination, empty/legacy/stale states and output navigation. Server/readiness computation remain with the reading owner. |
| Failure | A missing output could be confused with unindexed rows; hidden rows could leak; a wide queue could bury links in the narrow inspector; opening Reading could trigger inspection. Exact API comparison and actual desktop navigation cover these cases. |
| Desktop | 1366×900, default restored corpus after the coordinated 44-world regeneration. Mobile deferred. No default game rebuild or persistence change. |

## Results

`node tests/atlas_reading_followups_browser.mjs http://127.0.0.1:4187` passed with zero page errors and exit 0. The normal server belonged to the reading lane and was explicitly released afterward; the proof's own browser/fixture server and temporary fixture directory closed/removed.

| Actual normal route | Observed result |
|---|---|
| HP, unindexed | 199 affected files. Pages 1–25 → 26–50 → 1–25 match the saved API metadata exactly. |
| HP, missing | Zero missing files, shown as an examined empty result for that reason. No unindexed file cards persist after switching filters. |
| HP's first output link | Existing `hp5 / hp5c031 / census / census` viewer shows 193 source rows, 176 linked records and **17 unindexed**, matching the queue count. Its public records stay behind the existing viewer's admission boundary. |
| A Soldier's Life, missing | 264 missing outputs. Shown file cards have one missing file and zero unindexed rows; their counts match the saved API. |
| Explicit older-report fixture | Remeasure note, no individual file rows, no claim of an examined empty queue. |
| Explicit stale fixtures | Stale legacy report retains both stale and remeasure notices; a stale current report retains saved rows with the stale notice. |

No follow-up GET occurred on initial Reading, summary load, opening book/field detail or opening the queue disclosure. A user load or paging action requests a bounded page. Reason changes clear the previous cards without fetching until Load is chosen. Existing HP2 book/field detail remains functional. The page has no horizontal overflow at the target viewport.

The first queue-table capture revealed that counts and links were horizontally outside the narrow inspector. The delivered view uses compact count-only file cards and paging above the list. The final captures were inspected: [unindexed](hp-unindexed-files-1366.png), [examined empty missing](hp-missing-empty-1366.png), [missing files](asl-missing-files-1366.png), [exact output](hp-open-exact-output-1366.png), [legacy](legacy-remeasure-1366.png), [stale legacy](stale-remeasure-1366.png), [stale saved rows](stale-current-remeasure-1366.png).

[Proof data](proof.json) records served view SHA256 `fba9f287ddf5e8d98965c82a9f70fc1312e46148e76d44e90c0ea72ba335c8fd` and current calculation SHA256 `156657bccef33bec7cb6f29e3c81594c6682d1a6e60470a24b385de706ef461c`. The older per-book/field and historical readiness evidence was not overwritten. `node --check` passed for both owned modules; owned-file whitespace and docs checks passed. This lane made no source-reading, raw-row, server, computation, gameplay or save changes.
