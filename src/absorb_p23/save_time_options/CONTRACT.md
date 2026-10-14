# P15 save and time contract (proposal, 2026-10-14)

N28 trigger design, before implementation: one independent journal per release,
`yairpg:p23:backup-undo:1:live` or `yairpg:p23:backup-undo:1:dev`.
The journal stores schema 1, monotonic revision, current serialized native
snapshot and previous serialized native snapshot. It is not the active save.
No legacy key is read implicitly, renamed, deleted, migrated or overwritten.
One setItem replaces the whole journal after validation, real-loader preflight,
quota accounting and a final ownership/revision check. Browser setItem failure
must leave its previous value unchanged. No deletion or quota eviction fallback.
Missing journal means no backup, and old save envelopes need no new fields.
Unsupported journal/native schemas reject before mutation.

P00 provides ownsSave() under the EXISTING lifetime `yairpg-save:<release key>`
navigator lock, plus preflight(save) using the isolated real native loader.
No extra lock with an independent namespace: that would fail to exclude the
ordinary writer. Import probes/read-only tabs must return false. While async
preflight runs, overlapping operations detect a changed journal and abort.
Native writes/branch switching must be paused across final candidate selection
and durable host publication. This module changes only the journal, never the
live game. Caller must not publish or claim native restore from its return alone.

Bounded slice: capture(snapshot) replaces current and retains previous; undo()
swaps current and previous, with no lifetime once limit. Each candidate AND the
retained undo snapshot validate and preflight before write. This is one backup
and one undo, not multiple characters or automatic rotation. Slot design for
later work: opaque stable slot IDs and active ID must live in ONE manifest with
all changed snapshots, under the same release lock. Slot switch cannot be a
sequence of writes to live, metadata and active keys. P00 must first resolve
which envelope becomes authoritative at boot and how legacy saves are adopted
without altering their bytes. Multiple slots remain parked pending that join.

Quota: use native shared-origin UTF-16 budget (4 MiB); count unrelated keys,
including legacy saves, and both snapshots in the new journal. Preflight budget
rejection and actual QuotaExceededError preserve every key. A player can export
instead; do not silently discard prior recovery data.

N29 trigger remains unmet. Native world instances accept played_minutes with
absence freeze. Backlog prepaid packing is an explicit finite escrow contract,
not general offline eligibility. Live main documentation contains OT1-OT10
considerations, not a selected executable death/sleep/exposure policy.
Required P00/clock-owner contract before any catch-up implementation:
- Input: policy revision, active branch/world/life ID, authoritative played
  boundary, wall start/end, eligible native noncombat action and its real inputs,
  last-accounted interval cursor, chosen cap and remainder policy.
- Output: candidate native state, consumed interval cursor and known-only return
  summary, published atomically in the existing native durable envelope.
- Subtract foreground/previously accounted portions, settle old active branch
  before a switch, never credit resting branches or replay combat timers.
- Clamp backwards wall clocks to zero without moving the high-water cursor back.
  Reject unsupported schema/policy/branch identity before mutation.
- Save/reload/import retain settlement cursor; replaying the same real interval
  credits zero. No fixed lifetime once limit. Imports from earlier snapshots
  need a selected anti-double-credit policy before claiming this property.
- Owner must select eligibility, death, sleep, exposure, discovery/choice stops,
  caps and bank/drop behavior. This lane selects none of those policies.

Target for eventual host controls: 1366x768 desktop, useful ordinary backup/undo
access, known-only messages, Effects-off respected; mobile optimization deferred.
N28 module can pass empty-origin source/browser contract checks independently;
N28 native integration remains implemented-unverified until P00 joins it.

## Exact P00 request

Import `createBackupUndo` from `./absorb_p23/save_time_options/backup_undo.js`.
Construct once with `{storage:localStorage, release:is_on_dev()?'dev':'live',
currentVersion:game_version, ownsSave:()=>ownsSave && !importProbeToken &&
!foundationSaveBlocked && !is_loading_error && !restoringNativeSave,
preflight:preflightImport}`. The existing `preflightImport` is exported by
`src/import_probe.js`. P00 must also serialize same-tab backup operations with
save/import/branch-transition work, pause played time during capture/preflight,
and preserve that busy guard through durable publication.

`capture(JSON.stringify(create_save())) -> Promise<{schema:1,revision,current,
previous}>`: retain exact snapshot bytes after real-loader preflight. Missing
or invalid create_save result refuses. `read() -> journal|null` validates but
does not write; `undo() -> Promise<journal>` swaps journal snapshots only.
Display 'Backup kept' only after capture resolves. Journal undo is a recovery
candidate; DO NOT label it 'Life restored' before native integration.

For a native restore, P00 must first settle the authoritative-key/boot design.
Do not sequence undo(), a legacy-key write, and reload and call it atomic:
quota/error after the first write splits journal from live state. Until a
single-key authoritative publication or equivalent proven recovery protocol
exists, expose journal capture/download only, and keep native undo, slot switch
and native acceptance OPEN. To complete the requested gameplay gate, P00 owns
fresh-origin 1366x768 backup/restore/undo controls plus aborted storage, unsupported
schema, read-only tab, Save/reload/Export/literal-file Import proofs using its
integrated served bundle. No game-state field or main import is added by P15.
