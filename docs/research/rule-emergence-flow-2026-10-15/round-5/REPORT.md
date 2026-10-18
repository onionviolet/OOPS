# Round5: recovery selectors, construction resources and special save callbacks

2026-10-15. Research only. The user requested actual DF refund paths, recovery of Qud's preserved contextless actors and Rain World retry/special-callback consumers. Five existing specialists were reused with independent crosschecks. No game/native target/shipped generator, personal save/configuration or runtime implementation was executed/changed. Analyst code reads metadata only. Full selected source, native bytes, tool outputs and command/hash receipts remain in private evidence archives.

## F1: DF positive quantities must be tied to source identity and policy

[Quantity/refund audit](../../dwarf-fortress/emergence-2026-10-15/round-5/audit/REPORT.md), [exception extraction](../../dwarf-fortress/emergence-2026-10-15/round-5/extraction/REPORT.md).

This pass follows explicit positive-count candidates rather than repeatedly inspecting generic unlink. The candidate inventory includes split-like dimension transfers and grouping of newly produced outputs; the virtual split operation's exact count decrement is still unread. A parent count increase after transferring dimensions or a new-product grouping step is not proof of restored consumed input. Exact pointer identities and arithmetic are retained by the audit. A large decompile that exceeded the response buffer and a bad-instruction diagnostic are preserved, with independent instruction windows used rather than assuming successful original-source recovery.

The factory has a C++ exception handler; a compiler-pattern metadata join identifies a candidate cleanup funclet that frees the parent frame's saved newly allocated glob pointer. Exact funclet/thunk instructions reach CRT free; complete compressed FH4 state-map decoding remains unverified. That is output-allocation disposal, not reversal of earlier corpse/tissue accounting. The inspected harvest/placement unwind regions have no local language handler after following their chains. This narrows local rollback; it does not establish that outer callers, other jobs or all exception routes cannot compensate.

The concrete UI/input join is now recovered: virtual stage+0x118 selects Cancel construction at zero versus Remove building otherwise. The selected zero-stage input branch calls teardown0x140587d80; the nonzero branch requests removal through virtual+0x168. Teardown reaches virtual+0x230. Independent instructions show a type4 exception that forces that call's argument to1 despite the caller's zero flags; other types inherit0. That virtual is a notification routine in the pinned actual-building base, not the material-release implementation. This is an actual user-action policy rather than an inference from the UI label.

The connected cancellation release now reaches the selected building_actual teardown: it reverse-iterates stored+0x128 wrappers, obtains their existing item pointers and detaches them with mode2. Under the decoded matching-reference and type/flag gates, the type0x24 reference branch matches the same pointer, frees/erases the16-byte building wrapper, removes the item's corresponding reference and clears selected flags. It does not demonstrate a positive quantity write to recreate consumed input. This is concrete release of stored existing resources at the containment level. Floor/world re-registration and actual delivery remain unproved in the remaining helpers. Selected construction cancellation and a recipe's consumed-material rollback are different policies.

## F2: Qud reference access does not supply a world-recovery selector

[Depth7](../../qud-systems-audit-2026-10-15/depth-7/REPORT.md), [decoded recovery consumers](../../qud-systems-audit-2026-10-15/depth-7/RECOVERY_CONSUMERS.md), [independent audit](../../qud-systems-audit-2026-10-15/depth-7/independent-audit/REPORT.md).

A metadata-only scan retains61 direct uses of the four Physics attribution fields across62,661 method bodies, with zero decoder errors. The scan is navigation evidence, not full semantic reading. Selected source consumers use retained bodies for damage/death credit, burning/freezing events and effects. Some party consumers can use a retained body or explicit ID fallback; the wrapper itself does not perform fallback or placement. Beguiling can synchronize effect/HP state on a retained body without returning it to the world; exact vortex eligibility/party composition remains necessary, since nontrifling player-led actors take explicit tracking instead of the ordinary queue.

Generic movement tolerates a null source and can place a valid actor when supplied a valid destination and passing all admission gates. The stock join-party command, however, selects objects already in cached-zone cells; it does not enumerate detached body tokens. The ordinary AI action also returns on IsNowhere before follow logic, on top of scheduler rejection. The missing stock selector/caller remains the relevant recovery gap.

Return values need qualification: Cell.AddObject returns its input even when entry is rejected, and the direct follow helper ignores its movement result before emitting its joined event/return. An attempted move is not verified cell membership. No native loss, recovery command or permanent-unrecoverability claim follows. Root cumulative452captured types includes234 without root printed windows; independent coverage remains separate.

## F3: Rain World has no managed transfer retry in the inspected outer chain

[Outer recovery extraction](../../rain-world/emergence-2026-10-15/round-5/extraction/REPORT.md), [callback/process audit](../../rain-world/emergence-2026-10-15/round-5/audit/REPORT.md).

The exact transfer call propagates through Player, Room, RainWorldGame, MainLoopProcess, ProcessManager and the RainWorld Unity component hook without an enclosing transfer catch/reset/requeue in the inspected managed callsites. Unrelated catches do not surround the transfer. Native Unity dispatch after propagation remains uninspected; the research does not claim the entire application exits. If updates resume, the already advanced counter and pre-set one-shot latch do not automatically replay the transfer.

A fresh Game process normally calls Revert and can parse FRIENDS from the retained backend campaign key, giving a conditional replay attempt. Resuming pendingProcess reuses its old game/latch. An eligible starvedSaveState can also bypass parsing by reviving an in-memory state. Load/FastTravel setup, matching campaign and suitable retained data remain prerequisites. A malformed record can fail again; a new process alone is not a successful retry guarantee.

The runtime consumed queue, attempted-transfer ledger, retained backend string and actual disk/cloud bytes are different owners. The direct death-persistent tagged merge retains other campaign sections, including prior FRIENDS. Its WarpPoint scrub helper does not directly mutate friend queues or recapture NPCs in the inspected body. This supports conditional fresh-load replay while preserving all storage freshness/durability limits.

Extraction cumulative56types:8full reads,32selected-window reads and16unread. Its structural catch-scan windows are separately qualified. Audit reading has its own cumulative ledger; totals are not summed.

## F4: custom passage hooks and Expedition have concrete ordering limits

The shipped CustomPassage base OnWin, OnDeath and ApplyHooks bodies are empty. Its initially empty public registry is mutable; registration inserts before ApplyHooks, with no local rollback on a throwing hook. A pinned-main-assembly IL search found no direct Register call or CustomPassage subclass, one static win call site and one static death call site. Those counts do not establish exactly-once runtime invocation, since the death helper has multiple consumers. This is not inspection of the live registry, external mods, other assemblies or reflection. No built-in callback recapture was established in that scoped evidence.

Built-in Friend progression precedes the OnWin enumeration, and Expedition completion follows it. A callback exception can stop the local method before later callbacks/completion/save. Death tracker encoding temporarily mutates and restores selected fields without finally-based protection around every extension side effect. The base callbacks being empty does not make unknown external implementations safe or active; their behavior remains unobserved.

Expedition requests a separate core-file save before campaign wipe/Revert. The core save returns void and can skip its Set request when unloaded/unavailable, while completion continues. A wipe request can clear currentSaveState before the later ordinary session-end encoder, whose current-world branch requires a nonnull state. The two records have no demonstrated cross-file durable transaction. As a source-level combination, if a later campaign wipe actually replaces the retained key without that campaign, the fresh-load FRIENDS replay described above loses its required record; new-process creation alone cannot recover it. No wipe, completion or save was executed. Other challenge subclasses, win-screen finalization and special modes remain unread.

## Continuity and remaining work

[CURRENT](../CURRENT.md) owns latest unread navigation. [Continuation](CONTINUATION.md) names actual remaining selectors, restoring-resource policies and platform/extension boundaries. [WORKFLOW](../WORKFLOW.md) preserves the updated method. Findings do not select new YAIRPG behavior or alter accepted direction.
