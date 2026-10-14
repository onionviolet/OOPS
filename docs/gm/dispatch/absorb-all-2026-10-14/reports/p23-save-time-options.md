# P15 save/time options, 2026-10-14

Status: bounded N28 module implemented-unverified as native gameplay; N29 parked.
Do not final-merge as a passing gameplay lane. P00 integration and completed
full-suite evidence remain required. New behavior is a proposal, taste unaccepted.

F1: Verified clean worktree/assigned branch at
`0216ccdefcfce79877378f8cb0ee41129fe11c5d`. Coordinator's current assignment
reserves 18833 and authorizes wave 2 without waiting; SESSIONS.md lists this lane
as `01a138b9-0846-71d0-bfa7-067a1e593409`. Port had no listener before our server.
No ownership of shared game files was assumed. Live main later reached
`2a9efa3793074acd890c27183763191a3063503c`; release keys and lifetime navigator
save lock still match this contract. No shared game file was edited.

F2: Reviewed AGENTS, PROJECT priorities/accepted decisions, USER_VISION,
north-star proposal scope, ledger N28/N29, native main/save_files/import_probe,
world instance clocks/realm leases/backlog time and T4. Live intro Round 12 and
`docs/research/OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md` identify
OT1-OT10 as considerations with missing native elapsed routing, not an adopted
general offline policy. Pinned HTML hash matches
`a43e55e2eeb455f1c1ae589e3fc074a588813fe6cd57cfba827dcf923f3755d5`.
R1/R5 save/time notes, R2-R4 scope/gaps, M2 S2, M3 S44/S49 and N2/mod-audit
cross-references reviewed. Foreign code/assets copied: none.

| Row | Disposition | Landing and compatibility |
| --- | --- | --- |
| N28 | Bounded module implemented; native implemented-unverified; multi-slot/rotation parked | `src/absorb_p23/save_time_options/backup_undo.js`, CONTRACT.md and 10 focused tests. One journal key per release, current plus one undo snapshot, single atomic setItem. Existing keys untouched. No fixed character-count or lifetime-once limit. Native restore/slot switch needs P00 boot/publication design. |
| N29 | Parked, trigger unmet | Active-branch interval contract only. No clock adapter/state added. Native world instances retain played_minutes/absence freeze. Explicit prepaid packing unchanged. No selected death, sleep, exposure, cap, remainder or import-replay policy exists for general catch-up. |

F3: Key/lock/quota/undo plan was written before implementation in
`src/absorb_p23/save_time_options/CONTRACT.md`. Missing journal means no backup;
old save envelopes need no new fields/migration. Unsupported journal/native
schemas reject before mutation. Capture preserves exact supplied snapshot bytes,
validates/preflights both snapshots, rechecks ownership and journal bytes after
async preflight, then uses the native shared-origin UTF-16 4 MiB budget. Failure
never deletes/evicts keys. Undo swaps current/previous and can repeat. This is a
recovery journal, not an atomic restoration of the running life.

## P00 request

F4: Import `createBackupUndo` from `./absorb_p23/save_time_options/backup_undo.js`.
Construct with `{storage:localStorage, release:is_on_dev()?'dev':'live',
currentVersion:game_version, ownsSave:()=>ownsSave && !importProbeToken &&
!foundationSaveBlocked && !is_loading_error && !restoringNativeSave,
preflight:preflightImport}`. The existing real-loader iframe check is exported
by `src/import_probe.js`. Reuse existing lifetime `yairpg-save:<release key>`
lock, not an independent lock that fails to exclude ordinary writes. Serialize
backup operations with native saves/import/branch transitions; pause native time
across snapshot capture/preflight/publication.

`capture(JSON.stringify(create_save())) -> Promise<journal>`;
`read() -> journal|null`; `undo() -> Promise<journal>`.
Journal shape: `{schema:1,revision,current,previous}`. Missing/invalid snapshot
refuses; prior recovery bytes remain on error. Display success only after durable
completion. Known-only plain messages; Effects-off remains master. Native target:
1366x768 desktop accessible ordinary Backup/Undo controls; mobile deferred.

P00 must first resolve one authoritative boot/publication protocol for native
restore. Do not sequence journal undo, legacy-key write and reload and describe
it as atomic: failure between writes splits journal/live state. Until a proven
single-key authority or recovery protocol exists, capture/download may be joined,
but native undo and slot switching remain OPEN. CONTRACT.md supplies the later
slot-manifest design and N29 interval inputs/outputs/cursors/preflight requirements.
N29 owner must select eligibility and risk/clock policy before implementation.

## Checks

Implementation commit: `d370de8f` (`Add isolated backup and undo journal contract`).
Evidence: `checks/p23-save-time-options/` and companion ledger. Served native bundle SHA256: `598e02f54fe7db4c9a35bc79c75a754a7f8dc42eccf9fab828de8fd82e97b615`; isolated probe bundle SHA256: `ba35b21a77291d2a9bd6a9a921982c375c0287f8fe229d0e073bc21613ff316b`. The native bundle hash matched rebuilt local bytes.

| Gate | Exact result |
| --- | --- |
| `npm run build` | Exit 0. Unchanged native entry does not include the unjoined module. |
| Focused `node --test tests/p23-save-time-options.test.js` | Exit 0, 10 tests, 10 pass, 0 failures/skips. Quota/budget abort, old-key preservation, exact undo, schema/loader rejection, ownership loss and concurrent async preflight conflict. |
| Full `npm test` | Exit 1 without aggregate summary; 55 emitted passes, 0 emitted named failures. Incomplete under concurrent suite load. Not a passing suite. |
| Full bounded equivalent `node --test --test-concurrency=2 tests/*.test.js` | Timed out at 240.35 seconds, exit 1; 416 emitted passes, 0 emitted named failures, no aggregate completion. No pre-existing failure attribution is justified. |
| Fresh-origin 1366x768 Playwright | Exit 0 (5.89 seconds), Chrome. Native baseline Save/reload exact, Export download, literal-file Import reload verified. Isolated journal: real iframe loader preflight, exact undo, quota abort, schema rejection, all legacy keys preserved, revision 3 survives reload; 0 page errors. Synthetic ownership callback in probe mode, not native controls/publication. |

Harness corrections: default Playwright headless-shell absent, switched to
installed Chrome; bare inkjs source import required bundling the isolated probe
with existing esbuild. Reload initially compared pre-Export bytes; corrected to
post-Export bytes because native Export updates its reward timestamp. A running
host autosave changed legacy bytes during multi-iframe preflight; final isolated
module probe uses native import-probe mode, which stops game time/autosave.
These are harness changes, not production fixes. Disposable contexts only;
no actual user saves/origins were read. Real-loader preflight remains distinct
from native backup controls and actual live restoration.

F5: Wave-1 ui-polish report (`fd737f8a`) and upstream-dev report read as available;
life-loops/reveal-chain initially pending. No d49cb911/379007d7 feature redone.
No source overlaps with other lanes; P00 must reconcile merged main/save/time
owners. Build-generated source map excluded from commits. No push/merge, package
installation, raw-source edits, user-save reads or shared game mutations.

OPEN: completed full suite; P00 native backup/restore/undo controls and atomic
publication; native abort/schema/read-only controls; changed-native Save/reload/
Export/literal-file Import with P00 served bytes. N29 stays policy-triggered.
After technical gates, the remaining acceptance is Weibao's play/taste.
