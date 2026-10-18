# Round 3: deferred actors, timed effects and save transactions

2026-10-15. Research only. The user requested deeper DF expiry/refund consumers, Qud queued vortex victims and Rain World cleanup/save paths. Existing decompiler/auditor pairs were reused and an independent Qud auditor added. No new user-owned chat was needed for these connected scopes. Full selected code, disassembly, tables and reading receipts remain in ignored private archives. No game, personal save, runtime experiment or product implementation was performed.

## F1: Qud's queue is a separate lifecycle with incomplete persistence ownership

[Depth 5 report](../../qud-systems-audit-2026-10-15/depth-5/REPORT.md), [decoded lifecycle](../../qud-systems-audit-2026-10-15/depth-5/QUEUED_VICTIMS_AND_CLEANUP.md), [independent audit](../../qud-systems-audit-2026-10-15/depth-5/independent-audit/REPORT.md).

Ordinary eligible actors can be queued, removed from context and made inactive while an important/player/companion entrant instead forces destination selection. The latter entrant can flush earlier victims before its own contact veto. Queue flush ignores Teleport's Boolean result, calls MakeActive only through its normal Brain/Force gate, logs per-victim exceptions and then discards queue references. This is conditional source behavior, not a reproduced loss or duplication bug.

The actual inherited serializer skips Queue/Locations, and the action queue no longer contains normally removed victims. Cell saving traverses current cell objects; it does not discover the detached queue. Temporary expiry and ordinary vortex destruction expose no explicit queue drain. This closes those specific fallback candidates. Other serialized references, generic contents responders, pooling and whole-game roots remain open. The static archive does not prove ultimate garbage collection or universal disappearance.

Root coverage now records 442 unique captured types with exact printed/not-printed complements. Of those, 234 have no printed windows in the root depth 1-5 ledgers. The independent audit records 15 source-file reading scopes and seven new narrow exports separately; those totals are not summed as unique types. Prior skills/mutations/cybernetics unread families remain retained.

## F2: Rain World saves selected state and rebuilds physical relationships conditionally

[Save extraction](../../rain-world/emergence-2026-10-15/round-3/extraction/REPORT.md), [cleanup audit](../../rain-world/emergence-2026-10-15/round-3/audit/REPORT.md).

Region snapshots admit selected objects/creatures and can save a creature at its den instead of its last physical position. They serialize endpoint-A-owned stick records without deduplicating duplicate link instances. Population is restored before links, but link resolution still requires both IDs in the selected room entity list. Skipped, relocated or den-only endpoints can prevent a link from reconstructing. Successful abstract loading is distinct from successful physical Grab admission.

The earlier successful-rebuild duplicate is now qualified: a later same-target Grab releases the live grasp, and abstract DropCarriedObject removes all grip records for that slot. This supports a cleanup route and rejects an inference of monotonic growth. Mixed graphs, malformed indexes, virtual overrides and exception paths remain open. Destruction flags, registry removal, abstract link removal, room abstraction and staged unloading are separate operations with distinct consumers.

Durable social state is conditionally saved with living creature state. Temporary affect resets from durable baselines; normal lizard AI construction creates a new FriendTracker and reacquires its realized friend. Region catch-up uses elapsed cycles for some counters but calls the ordinary social CycleTick only once when elapsed cycles are positive. Same-cycle shelter-friend boost durability remains a snapshot-order question because the boost occurs after BringUpToDate.

## F3: Rain World's backend exposes request/completion gaps

The previously opaque storage route is managed code in the separately pinned Assembly-CSharp-firstpass.dll. The extraction follows progression text to Set, queued/coalesced writes, XML/encryption envelope, Write_Default, completion callbacks and load parsing.

SaveToDisk can return true when flags request no work, when the Set tail is skipped, or when writing is deferred. The actual default file route uses FileMode.Create. Some directory/open/write exceptions are caught and logged without marking operation failure; if catch/finally returns normally, the caller can clear modified and complete successfully. Other exceptions have separate failure handling. This is a static failure-reporting candidate, not an induced storage failure or a claim about every platform/cloud route.

MD5 mismatch is recorded but the payload still parses. Nonempty strings shorter than the expected prefix cross an unguarded substring boundary in the reviewed method. Neither the checksum nor the callback alone proves a valid complete restored world. No personal data or test save was accessed.

Extraction cumulative coverage is 51 captured types: 7 full reads, 26 selected-window reads and 18 unread. The audit separately records 49 main-game classes: 10 full reads, 25 selected-window reads and 14 unread, plus support sources. Each lane's receipt is authoritative for its own count; totals are not summed.

## F4: DF now connects reservation acquisition, selected consumption and partial output

[Job audit](../../dwarf-fortress/emergence-2026-10-15/round-3/audit/REPORT.md), [native transaction details](../../dwarf-fortress/emergence-2026-10-15/round-3/audit/TRANSACTION_DETAILS.md).

Native helper 0x140d028e0 installs bilateral 24-byte job/item associations and sets an item flag. One acquisition caller reaches cancellation on search failure; another has different failure behavior. A duplicate-tag diagnostic can occur after both associations were already appended, so it is not an admission rejection or local rollback.

The selected action-dispatch branch now reaches a verified item count accessor and signed32 delta method: a count of at least two is reduced by one; a smaller stack enters a removal-request helper, whose body does not directly free the allocation. Six RTTI/vtable chains and exact leaf instructions ground the count interpretation. NPC/world-owned job records are present, but planner selection priorities remain unread.

Corpse/corpse-piece items use a separate material extraction path. It records partial extracted amounts, marks complete material use, can allocate and configure an output item, invokes placement, and associates the output with the job. Partial output can coexist with retained source state. Placement success, resource rights, failure rollback and generic job enums are still unresolved.

Reservation unlink removes references; it does not itself show a positive restoring quantity delta. No general consumed-material refund has been established. The report deliberately retains that gap instead of calling cancellation a refund.

## F5: DF effect expiry reaches source-associated native removal

[Effect extraction](../../dwarf-fortress/emergence-2026-10-15/round-3/extraction/REPORT.md), [full native lifecycle](../../dwarf-fortress/emergence-2026-10-15/round-3/extraction/EFFECT_LIFECYCLE.md).

The common parser maps START+0x10, PEAK+0x14, END+0x18 and DWF_STRETCH+0x1c, with explicit clamps/coupling. An earlier worker progress note conflated START and PEAK; saved findings correct it. Values are native counters, with scheduler frequency still unresolved.

Actual updater 0x1413dcd00 advances the instance counter, resets the instance's source contribution and reapplies eligible whole-actor/localized effects through the virtual callback slot. Start/end/ramp, abrupt flags, resistance and selectors have distinct branches. Independent instructions establish an all-inactive Boolean return despite the decompiler's incorrect void signature.

The owner tests that result at 0x14135591b. On expiry it scans source-matching records, frees selected subblocks, clears source identity, destroys the active instance, erases its vector entry and invokes two derived-state helpers. This closes the selected active expiry-to-removal path, beyond the earlier definition destructor. It does not prove reversal of already-inflicted wounds, every permanent transformation, all overlapping-source precedence or suspended/offscreen timing. The exact unread complements preserve those limits.

## Remaining work and reusable flow

[Continuation packets](CONTINUATION.md) retain bounded follow-ups. [CURRENT](../CURRENT.md) links the latest independent unread owners. [WORKFLOW](../WORKFLOW.md) now preserves queue ownership, transaction/error boundaries, refund distinctions and duplicate cleanup checks. Prior round reports remain dated evidence. None of these findings changes accepted YAIRPG product direction or authorizes implementation.
