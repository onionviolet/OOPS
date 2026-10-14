# Original implementation proposals

All packets are PROPOSALS, not selected tasks or verified YAIRPG gaps. Implement
one playable slice if selected, after recovering current writer/owner authority.
No source write was performed. Existing code areas below are routing candidates,
not a current audit of their complete behavior. Prototype UI targets 1440×900
and uses independent visible panels; mobile optimization is deferred.

| Packet | Small playable slice and owner | Source lesson | Cost and compatibility | Observable acceptance gate |
| --- | --- | --- | --- | --- |
| P1 Reset preview | One existing life transition shows each item's carrier, cost and destination. Owners: RULES_FROM_SCRATCH, ENGINE_SAVES_AND_SCALE_REVIEW, existing life transition/persistence | Save vs SaveR, exceptions, remembered access vs proficiency | Medium. Versioned carry decision per field, existing old heirs load unchanged. Do not infer reset scope from a single owner | Preview matches the actual reset for one durable item, one lost progress field, one remembered permission and one obligation; fresh-origin save/reload/import agrees |
| P2 Learned alternatives | One mentor offers two methods in a life; later life can learn the other and receives recognition for prior knowledge. Owners: lore practice, dialogue and life history, LIFE_SIM_NORTH_STAR | Four local paths produce inherited books and knowledge-aware mastery | Medium. Stable learned-method IDs, source/cost receipt and migration for existing knowledge. No arbitrary once-ever block | Both paths remain reasonably reachable; actor dialogue checks actual knowledge; earned lesson survives the selected carry rule and import |
| P3 Independent plans | Show work/combat/other plans and why each is blocked. Owners: simulation_resolution, action scheduler, offline audit | Sloth queues; manual/AHA allocation split; eligibility per action | Medium. Preserve saved manual allocations and queue cursors, define catch-up and duplicate receipt policy | One plan stalls for missing stock while another proceeds; auto disable preserves manual work; short offline replay spends exactly once |
| P4 Competing sinks | One mundane produced good can be eaten, crafted onward or donated to a workshop. Owners: stock, crafting, food, everyday life | Grilled fish production/eating; Elixir competing use; research summon vs examine | Small to medium. Existing stock commit owner remains authoritative, no new currency required | Every destination pays the same stock atomically; no double use on reload; unfed play remains comfortable |
| P5 Voluntary constraint | Reserve one optional next-life condition, with visible reward and cancellation. Owners: world/start dials, life transition | Pride reserve/current split and disabled subsystem rewards | Medium. Store reservation separately from active condition; cancellation does not restore already-spent stock by inference | Reservation activates at intended boundary, cancellation works, reward checks completion under condition; default path stays reachable |
| P6 Away work | Assign one ally to timed mundane work, choosing between party use and labor. Owners: party_battle, everyday_life, time resolution | Squad exclusivity, stamina slowdown and completion rewards | Medium. Persist member IDs, stamina and progress independently of temporary rewards; explicit across-life policy | Same ally cannot occupy both tasks; exhausted work slows visibly; interruption/reload preserves paid progress |
| P7 Durable capacity | One trained practice retains earned access/speed while current progress resets. Owners: skills, life transition and authoring | Envy Level versus Routine Level, class access versus proficiency | Medium. Separate fields with carrier receipts; avoid extra prestige layer | Reset preview and resulting practice agree; durable speed neither disappears nor duplicates after reload/import |

Each slice needs a rebuild and changed-behavior browser exercise from a fresh
origin. Persistence changes also need save/reload/import and interrupted-payment
checks appropriate to that slice. No test count substitutes for playable proof
or director acceptance. Reuse existing consumers rather than copying this game's
implementation or adding a parallel subsystem merely to match its menu count.

Proposed owner edits for a coordinator: link P1/P2 from the life-transition owner,
P3 from the offline audit, and P4 from ordinary production/food considerations.
Keep every proposal marked unselected until Weibao selects it. Province War may
reuse the queue, competing-stock and away-work lessons through its own owners;
this dossier makes no changes to that project.
