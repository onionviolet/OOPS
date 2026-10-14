# Immortal Life: breakthrough code and the limits of NPC autonomy

2026-10-14. Lane `immortal-life-2`. **Status: PARTIAL.** Static research and PROPOSALS only. No game launch, save access or YAIRPG implementation.

**F1, shown:** the inspected breakthrough panel selects the current `Level` row, spends stamina and launches a combat-wave trial. Clearing its configured waves opens a success result that advances the realm. The nine-row `Breakthrough` asset is not the table consumed by this proven branch. No independent success-percentage roll or separate lightning tribulation was established in this chain. [Breakthrough digest](BREAKTHROUGH_DIGEST.md).

**F2, shown:** successful realm advancement applies the new row's stats, resets the eight current-realm preparation counters and total XP, then clears the three selected trial skills. This is advancement within one actor. Defeat code routes to a return/recovery UI, and an injury buff can block another trial. No lifespan, old-age death, rebirth, inheritance or legacy contract was established. The searched schemas and selected recovery methods bound that negative finding. [Lifespan and recovery](LIFESPAN_AND_RECOVERY_DIGEST.md).

**F3, shown:** NPC XP and realm advancement have real native methods. XP is capped and does not itself promote the NPC. The separate realm-up method checks its configured maximum, advances and reports sect development; it does not impose the player's trial or an XP threshold internally. A game-command consumer reaches NPC advancement; 22 configured milestone/time triggers contain 32 such commands. Scheduled work timers and player-facing favor changes are also implemented. None of these establishes self-directed paid cultivation or NPC-to-NPC relationship formation. [NPC digest](NPC_AGENCY_DIGEST.md).

**F4, shown:** a second D2 tool-fit data point is complete. REA over Ghidra and direct Ghidra both recover the same selected 24-entry breakthrough chain. Direct: 17.59 s, 1,256,095,744-byte maximum RSS. REA: 18.91 s, 1,238,614,016-byte maximum RSS. These single observations are similar, not a performance win. REA adds structured provenance; Dumper metadata remains essential for shared IL2CPP generic methods. [REA trial](REA_TRIAL.md).

Shown = inspected native flow/table/schema. Stated = authored description. Inferred = an interpretation bounded by those reads. Static path reachability is not played reachability, save durability or full-program absence proof.

## Ranked PROPOSALS

Unselected. Preserve one realm/one prestige for the first milestone, optional cultivation, useful ordinary life, supported idle practice and repeatable routes. Proposed UI targets 1440 × 900 desktop/laptop with readiness, selected skills, cost and outcome visible together. Mobile optimization is deferred. These packets do not authorize implementation.

| Rank/code | Proposed result | Existing owner | Bounded first step |
|---|---|---|---|
| 1/P1 | Work preparation offers a concrete choice of trial tools, with realm XP separate from profession mastery. | [Cultivation](../../../RESEARCH_CULTIVATION_PATHS.md), [techniques/engine](../../../ENGINE_EXPANSION.md), [trials](../../../TRIALS_AND_TRIBULATIONS.md) | One work source, two useful trial applications and one choice. |
| 2/P2 | Entry, payment, trial result and promotion are explicit states with one settlement per attempt. | Trials, engine, persistence | One affordable attempt, refusal, loss, win and exact reload. Repeat attempts remain supported. |
| 3/P3 | A failed trial can leave a treatable condition with a visible recovery route and an exact retry rule. | Cultivation, [health](../../../HUNGER_AND_BODILY_NEEDS_CONSIDERATIONS_2026-10-13.md), trials | One condition, wait or medicine, preserved preparation rules. No default hunger death. |
| 4/P4 | NPC routines retain a task cursor and elapsed work so interrupted activity resumes coherently. | [Characters](../../../CHARACTERS_AND_WORLD_EVENTS.md), actor scheduling, engine | One funded duty across departure/revisit/save; real inputs and output custody. |
| 5/P5 | NPC training admission, XP accrual and advancement are separately observable transactions. | Cultivation, characters, engine | One NPC buys time/materials, accrues XP and qualifies for one advancement. Reference API separation is useful; autonomous policy is original YAIRPG design. |
| 6/P6 | Story obligations override routine schedules, then return the actor to an appropriate current activity. | Characters, actor scheduling | One appointment override with refusal and expired-appointment handling. |
| 7/P7 | A voluntary roommate stay remembers days and authored shared events across a supported departure and later stay. | Characters, [continuity](../../../SELVES_AND_ECHOES.md) | One resident, event memory, gifts from actual custody and free departure. Source's single-current-ID layout is not a universal design limit. |

[Implementation packets](IMPLEMENTATION_PACKETS.md) provide future acceptance gates. [Small touches](SMALL_TOUCHES.md) offers 24 scoped options.

## Prior findings reconciled

| Prior locator | Disposition | New evidence and remaining limit |
|---|---|---|
| F2 / cultivation digest: preparation and professions differ | Confirm and extend | Native promotion resets eight realm-preparation counters and three slots. Profession persistence was not traced end to end. |
| F5: Level versus Breakthrough unresolved | Narrowly close | BreakPanel and BreakBattleManager consume Level with matched generic method metadata. Plumber has a separate minigame config. Alternate callers and old-asset loader status remain open. |
| CHECKPOINT: exact payment/failure/retry unread | Partly close | Entry subtracts stamina; success mutates realm; recovery and injury consumers read. Duration interpreter, all defeat branches and save atomicity remain open. |
| F4: no independent cultivation transaction trace | Extend, preserve boundary | NPC XP/realm APIs and command-driven advancement recovered. Authored milestone/time triggers provide an admission route; no funded autonomous training policy established. |
| F3: Marry names do not prove romance | Confirm with code | Current roommate ID, per-NPC day count and authored event completion. No children or generated marriage inference. |
| CHECKPOINT: lifespan and next-life rules | Remain unestablished | Full PlayerData/Info.NPC declarations plus named defeat/recovery methods read; lexical search finds no matching age/next-life contract. Not a whole-program absence proof. |
| CHECKPOINT: fortune/delegation/full quest semantics | Remain open | Not needed to resolve the selected native chains; no repeated table extraction or invented custody proof. |
| TOOLING: declarations are not bodies | Extend evidence layer | Matching original DLL/metadata hashes rechecked; selected native bodies now read through REA. No game execution. |

Coordinator-only proposed owner edits: link this deep pass from the existing Immortal Life research entry; qualify the earlier table-selection gap with the proven combat branch; add this REA trial as a second D2 data point. Preserve all remaining autonomy, lifespan and gameplay limits. No shared owner or index was edited.
