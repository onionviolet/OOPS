# NPC agency: mutation APIs and scheduled life

2026-10-14. Static native evidence only. No game or personal save opened.

**N1, shown:** `Info.NPC` (TypeDefIndex 12975) stores its own realm, XP, extra stats, favor, gift/chat times and behavior cursor. Its cursor includes sequence ID/index, element execution count and elapsed wait/work seconds. These are model fields, not proof of a paid cultivation planner.

**N2, shown:** `Info.NPC.AddExp`, VA `0x1807c9360`, requires a positive current level and configured level array. It adds the supplied amount, caps at the current profile's XP requirement and clamps below zero. It does not call RealmUp. `NpcManager.AddExp` at `0x1808d2ca0` looks up the actor and reaches this same operation by a tail jump.

**N3, shown:** `Info.NPC.RealmUp`, VA `0x1807c9540`, checks that the configured level array has another entry, increments Level, clears the current XP through its clamped adjustment, and calls `SchoolController.MemberRealmUp`. It does not check XP readiness inside this method and has no player combat trial or chance roll. `NpcManager.AddLevel` at `0x1808d31c0` wraps it and emits `OnRealmUp` on success. Callers must supply any admission rule. Existence of an unchecked advancement API is not proof that NPCs spontaneously advance.

**N4, shown:** `SchoolController.AddMembersExp`, VA `0x1802f9790`, iterates sect members and calls the NPC XP API. `MemberRealmUp` at `0x1802faeb0` awards configured sect development for a member's realm, subject to membership/config guards; player advancement uses a distinct zero-NPC-ID branch. The initiating source of ordinary NPC XP and a paid offscreen cultivation loop are not established.

**N5, shown:** `NpcScheduleManager.StartUp`, `MinuteChnage`, `DayChange`, `UpdateNpcSchedule` and `WhereAndWhat` at VAs `0x1807e9320`, `0x1807e8c60`, `0x1807e7f90`, `0x1807e96b0`, `0x1807e9930` connect schedule refresh to clock changes, delayed overrides and current day/time. `WhereAndWhat` resolves configured day/detail schedules into presence/state. This supports scheduled action without a player conversation. It does not establish unobserved world simulation or a cultivation budget.

**N6, shown:** `NpcBehaviourWorkGameHour.OnBegin` at `0x1808cfb40` parses a duration, converts positive hours to seconds and sets a work flag. `OnUpdate` at `0x1808cfd50` adds delta game time to the actor's work timer. `OnEnd` at `0x1808cfd10` clears the flag and elapsed timer; `HasDone` compares elapsed with a positive duration. These four methods do not award realm XP, consume training inputs or select a breakthrough. A work animation/timer is not that transaction.

**N7, shown:** `NpcManager.AddFavour`, VA `0x1808d2cd0`, adjusts an actor's player-facing favor, honors the no-favor-operation guard, caps at GetMaxFavour plus one, emits a change event and presents a result. `SetFavour` is a separate setter. This is not NPC-to-NPC relationship formation. `FavourOtherIds` and biographies in the schema do not prove generated relationships.

**N8, shown:** `MarryController.Marry`, VA `0x1803280c0`, writes one current roommate ID and initializes its per-NPC day entry. Its native debug text says cohabitation. `OnDayChange`, VA `0x180328180`, increments that roommate's day counter and emits an event. `DialogEnd.MoveNext` at thunk `0x1800fb1f0` processes authored dialogue/event bookkeeping and commands. This extends the prior roommate-data finding to code. Exclusivity UI, departures/restays and durable save atomicity remain open.

**N9, shown configuration plus native consumer:** Trigger rows 281-300, 307 and 310 contain 32 RealmUp_NPCID commands across 22 rows. Conditions are quest completion or a number of days since quest completion, and each row configures TriggerLimit 1. For example, rows 281-284 use 1, 3, 7 and 10 days since task 20024. The native function at 0x18052f120 reads a command integer, routes zero to player LevelAdd and a nonzero ID to NpcManager.AddLevel. Its await metadata names RealmUpCmd.<Execute>d__10; the public IL2CPP MoveNext thunk is 0x1800fda30. This is a concrete authored progression route. Trigger296 contains two commands for the same NPC ID1003. This pass preserves the duplicate and does not decide whether it is intentional. The supplementary TriggerManager import did not return decompilation and was stopped after its startup window and an observed replacement import. Trigger execution timing and save settlement require their own consumer checks; the per-row source limit is not a proposed YAIRPG restriction.

## Caller-search limit

Private `notes/callers.json` is an E8/E9 byte-pattern candidate census across executable PE sections. It is not instruction-aware and misses indirect, reflected and inlined calls. Nearest managed entries can be misleading: the AddLevel candidate at `0x18052f1e7` lies in the PE unwind function `0x18052f120..0x18052f301`, outside the nearby RoomManager rendering method. Only decompiled and instruction-bound candidates may support caller claims. No automatic training or NPC marriage conclusion is drawn from this census.

Useful comparison: a game can have persistent actors and rich daily routines while reserving advancement for separate authored/caller-controlled mutations. YAIRPG's funded actor behavior needs its own concrete consumers; this reference does not supply a verified autonomous-cultivation design.
