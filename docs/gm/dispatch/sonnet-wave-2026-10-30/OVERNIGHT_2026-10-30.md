# Overnight supervision (2026-10-30 night)

Weibao, going to sleep: "how can you coordinate/send waves and waves of sonnet workrs and get the most amount of considerations and work done before its too late? more to conisder?" then "dont duplicate work and more, work through every little thing but accordingly? use sonnet workers accordingly".

## Decision

No new parallel wave. About 40 sessions already run under three coordinators, and a fourth dispatcher would duplicate their lanes. The overnight session (this file's writer) only supervises: it keeps the three coordinators feeding their own queues and holds the stop lines.

| Coordinator | Session | Owns |
| --- | --- | --- |
| Sonnet wave planning | `local_e9811a9a` | `sw-*` lanes, [QUEUE](QUEUE.md), [LEDGER](LEDGER.md), `ideas/` |
| General UI improvements | `local_67a1ca1a` | `rep-*` representation lanes, `ui-integrator` |
| Book indexing and re-read | `local_82a9ce30` | `p3c-memory`, `p4-fights`, `lead-readings` |

## Overnight rules sent to each coordinator

1. **No duplicates.** A coordinator dispatches only inside its own queue. Before starting a worker, check the other coordinators' queues and the session list for the same files or family. One writer per file area.
2. **Every little thing, in order.** Each idle lane takes its next queued item: improvement pass, then the next volume or slice. Small items from `ideas/` intake that are ACT NOW inside an owner's files get done by that owner, not by a new lane.
3. **Model fit (AU1-AU15).** Sonnet for code, design and synthesis; haiku for bounded reading, extraction and file checks; Codex Luna/Sol for bulk where the queue already routes it. No opus without an advisor reason.
4. **Stop lines.** Claude weekly 75%: stop launching, checkpoint. If the 5-hour window fills, checkpoint the exact next step and wait for its reset; do not spin. The queue's hard end (2026-11-02 11:00) stands.
5. **Gates.** Merge finished, gate-passing branches before dispatching more (merge before dispatch). Commit own paths only, no stash/reset/force, no push. Runtime claims need the rebuilt browser floor; otherwise "implemented, below floor".
6. **Morning line.** Each coordinator leaves one current-state block in its checkpoint: what became playable, what is below floor, what needs Weibao (at most five, coded).

## Supervisor tick

Every ~40 minutes the supervisor reads usage and the session list. An idle coordinator with queue left gets one nudge to continue. Above the stop lines it sends "checkpoint and hold" instead. It does not write code, start workers or edit other owners' files.

## Morning report

Filled by the supervisor's last tick.

- (pending)
