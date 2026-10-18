# Round 4: consumed work, alternate actor roots and friendship timing

2026-10-15. Research only. This continues the user's requested DF consumed-material refund, Qud queued-victim save-reference and Rain World friend-transfer/save-order gaps. Five existing specialists were reused with separate write areas. No game, native target, shipped generator, personal save/configuration or YAIRPG implementation was executed/changed. Full selected source representations, native bytes, commands and reading receipts remain in private archives.

## F1: DF's cancellation owner can clean up completed consumed-work

[Transaction audit](../../dwarf-fortress/emergence-2026-10-15/round-4/audit/REPORT.md), [output extraction](../../dwarf-fortress/emergence-2026-10-15/round-4/extraction/REPORT.md), [exact output consumers](../../dwarf-fortress/emergence-2026-10-15/round-4/extraction/OUTPUT_DETAILS.md).

The selected stack count-minus-one loop reaches a dispatch exit that sets a separate out-byte and returns false. Its actual caller interprets both values and can invoke the familiar cancellation/unlink owner. Thus the owner also serves completed-work cleanup; its invocation does not establish interruption, failure or repayment. A recovered positive owner counter update is distinct from restoring an item stack's count.

The material-output route constructs a new item_globst, assigns its count through the exact signed32 setter, writes material selectors, places it through a holder-wrapper/reference helper and reserves it for the job. These positive output counts belong to the newly allocated output, not the consumed input. The factory default at+c8 is distinct from inherited stack count+80. Placement's wrapper result is ignored by the selected caller before reservation.

Source extraction accounting precedes output creation. No compensating source quantity/extraction-record write appears in the selected factory/setter/placement bodies. This establishes operation order and rejects two apparent refund candidates. It does not prove that every job refunds or never refunds. The exact case-specific post-consumption failure edge, exception unwinding, downstream reference/registration helpers and source-restoration consumer remain unread. No gameplay failure was induced.

## F2: Qud has conditional full-body preservation through damage references

[Depth 6](../../qud-systems-audit-2026-10-15/depth-6/REPORT.md), [save-root map](../../qud-systems-audit-2026-10-15/depth-6/SAVE_REFERENCES_AND_RECOVERY.md), [independent token/Physics audit](../../qud-systems-audit-2026-10-15/depth-6/independent-audit/REPORT.md).

A concrete alternate save owner exists. Damage processing can put actor A in actor B's Physics.LastDamagedBy. If A later enters the vortex's deferred queue and B remains saved, B's full-body damage-reference serialization can enroll A. Its validity predicate requires Physics and absence from the graveyard, rather than a current cell. This conditionally preserves the body even though the vortex queue and normal scheduler ownership were removed. General amnesty, suspension and later overwrite can clear the holder.

Party/leader reference wrappers behave differently: they are finalized after body enrollment, reusing an enrolled token or writing an ID-only reference without enrolling a missing body. Brain friendly-fire memory uses full body serialization but filters ordinary contextless nonplayers out. The root trace follows game/system/zone/cache/quest/object-state serialization order and preserves custom hook uncertainty instead of assuming every NonSerialized field is omitted forever.

Body survival is not placement or activity. Physics restores saved context fields; the skipped vortex queue is not rebuilt. Scheduler validation rejects a nonplayer with no CurrentCell. The earlier post-teleport MakeActive request is therefore insufficient to infer ongoing orphan NPC turns. Whole-game dynamic custom references, later recovery/access and native save/reload behavior remain open.

Root Qud ledger now has450 unique captured types,234 without printed windows in root depth1-6 logs. Independent reading is separately counted; totals are not added as unique classes. Exact new and cumulative unread complements are retained.

## F3: Rain World's pending-friend queue reaches a one-shot consumer before success is known

[Friend-transfer extraction](../../rain-world/emergence-2026-10-15/round-4/extraction/REPORT.md), [independent order audit](../../rain-world/emergence-2026-10-15/round-4/audit/REPORT.md).

MMF shelter/forced-room selection and optional MSC creature gates determine which NPC strings enter FRIENDS. Actual restoration is in Player.UpdateMSC behind an exact fifth-reached-call condition, story session, no player AI, global pending-object latch and safari policy. The method name does not imply every statement requires MSC; the relevant early return lies later.

The global latch is set before spawning pending objects and friends. GrabSavedCreatures records originals in a field named spawnedPendingFriendCreatures, rewrites returned strings and clears the pending queue. SpawnCritters then parses, ticks creature state, overwrites its coordinate, adds it to the abstract room and requests realization. No local per-item null guard, acknowledgement, retry or rollback is present in those consumers. The attempted ledger is not a successful-spawn receipt. The same-session fifth-call/latch policy does not automatically retry on the sixth call.

Exceptions before queue clear, factory rejection after clear and failure after admission leave different partial states, documented in the extraction's failure table. In-memory clearing does not itself rewrite the last stored FRIENDS payload. Full outer exception handlers, fresh-session recovery, module settings and physical success remain unread/unobserved.

## F4: NPC friendship strings and progression can observe different times

The direct built-in survival route is now resolved statically: BringUpToDate captures NPC population or transfer strings before the shelter-friend boost. The later SaveToString concatenates those strings without recapturing the mutable SocialMemory. The RegionState object is shared, but its cached strings do not become live views of an NPC.

A qualifying persistent like0.6 is captured as0.6; the later boost makes the live value0.8. Under the reviewed built-in route with no extension intervention, the same-session world payload still carries the pre-boost string. WinState.CycleCompleted can meanwhile read live0.8 and, when eligible/unclamped, add0.8×0.34=0.272 to Friend progression. Death-persistent state is serialized freshly. Thus one assembled payload can reflect pre-boost NPC relationship state and post-boost progression.

This is a source-derived conditional example, not an executed roundtrip. CustomPassage.OnWin can access the game, and Expedition/special routes differ. Normal survival, survived-malnourished, death/starve and quit encode different layers, with their actual gates recorded by the audit. No universal claim that the boost never persists follows. Transferred creatures additionally receive a CycleTick before placement, so later relationship use can differ again from the serialized value.

## Saved continuity

[CURRENT](../CURRENT.md) links the current lane reports and unread owners. [Next bounded packets](CONTINUATION.md) separate resolved static edges from remaining work. [WORKFLOW](../WORKFLOW.md) retains reusable owner/token/snapshot/cancellation distinctions. Earlier round reports remain unchanged historical evidence. Research findings do not select a YAIRPG implementation or change accepted product direction.
