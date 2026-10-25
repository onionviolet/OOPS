# B1 playtest area A: Frontier livelihood, workshop, and gear

**Input:** isolated `codex/game-mcp-play-2026-10-25` worktree at master `3a1180dc274868d1e4350058a74725ac6b534394`, with the task's MCP wrapper correction. Fresh test origins used seeds 251031–251046. Player-visible actions only; no source edits or debug mutations. Applied AD6–AD8, AD32, AD36–AD38, AR7–AR8, MR1–MR36, AU1–AU15, and sealed-secrets handling from AGENTS/RULES_INDEX.

## Coverage

| Area | Result | Boundary |
|---|---|---|
| Fresh Village start | Reached | `game_new` reports `started: true`; two people, five services/stations, 10C and 2W are visible. |
| Livelihood: Find work → patrolling | Partial | Took the visible loaned kit and started Patrolling with Tessa. The two-hour shift pays 5C, grants XP/milestone notices, returns the loaned kit, and stops work, but the 120-minute `game_step` call throws after resolving it. |
| Wild willow stand | Visited and exited | Travel takes 5 minutes. The site description says no known people/services/stations and offers no gather action. Initial shim failed to expose its return dropdown; the coordinator's wrapper correction exposes it, and `Return to Village [5m]` works. This was a tool-wrapper gap during the run, not a remaining game blocker. |
| Village common herb verge | Gathered and crafted one trial | Gather produces carried material instantly. A selected one-item free experiment showed `Success 100%` and `Can craft now: 1 attempt`, but the trial came out too thin and consumed the lots. See BFA3. |
| Gear workshop and starting pants | Inspected; basic equip works | Starting Cheap leather pants show 40% quality and known stat effects. Clicking Equip changes the item action to Take off and its inventory category count from Gear 1 to Gear 0. The workshop opens and lists fitting, treatment, repair, reforge, salvage, and local-repair options; no workshop process was submitted. |
| Time and persistence | Reached Day 3; round trip passed | With no work running, stepped 720 + 720 + 1,440 minutes from Day 1 08:00 to Day 3 08:00. Save hash `5d5b78a752083a40`; Export then Import returned to Day 3 08:00 in Village. Status reports 2,880 minutes and no page errors. |

## Findings

### BFA1 — 120-minute patrolling step reports an exception after resolving the shift (bug)

- **Area:** Village livelihood / Find work.
- **Reproduction:** `game_new({seed: 251031})`; in default `game_look`, click the `work_outline Find work` action; from the resulting list click `[data-activity="patrolling"]`; call `game_step({minutes: 120})`.
- **Expected:** Advance two in-game hours, resolve the 5C full-round pay, return the loaned kit, and return a normal result from `game_step`.
- **Observed:** Tool returns `Cannot read properties of undefined (reading 'skill_required')`. Follow-up `game_look` shows Day 1 10:00, “Hero stopped patrolling,” `Hero earned 5 C`, and earned-XP/level notices. A following 1-minute step succeeds. `game_status` reports no page errors. Coordinator independently reproduced with seed 251035. Receipts: `/tmp/b1-workrecover.jsonl` and coordinator `/tmp/b1-patrol-repro.jsonl`.
- **Severity:** bug. The outcome is applied but the action reports failure, leaving callers unsure whether it is safe to retry.

### BFA3 — “Success 100%” trial can consume the only selected lot without making a preparation (confusing)

- **Area:** Village experiments / Frontier steeped preparation.
- **Reproduction:** `game_new({seed: 251046})`; open the visible Village common herb verge, choose “Open Village common herb verge,” click “Gather from the Village verge,” then click the carried-material checkbox and “Craft 1.”
- **Expected:** The preview's `Success 100%` and `Can craft now: 1 attempt` communicate whether this attempt can make the listed unidentified herbal preparation.
- **Observed:** With one Low rushwort selected, the click consumes the lot and reports: “The steep came out too thin: too little sap or oil in the water to hold, so the lots were wasted.” No preparation is created. The UI separately warns that properties act before they are known, so an exploratory loss is plausible; the ambiguity is whether the displayed success percentage describes completion of the attempt or success at making a viable preparation.
- **Severity:** confusing. A single exploratory attempt; other lots and combinations were not tested. Receipt: `/tmp/b1-herb-craft.jsonl`.

## BFA2 — Recovered play-surface issue (fixed-on-branch)

At Wild willow stand, the original lane wrapper exposed the visible dropdown label without a click target. The coordinator's wrapper change adds `.location_choice_dropdown` to visible controls. Retest at seed 251040 returned `Return to Village [5m]` under key `div[onclick=change_location]`, and clicking it reached Village at 08:10. The lane's earlier `game_report_limit` entry is historical; the return route now works in the tested wrapper.

## What felt good

The starting character has useful immediate context: currency/materials, a concrete gear item, and a local service list. Patrolling communicates its two-hour pay cadence and returns its loaned kit. The herb verge gives a no-cost visible route from gathering to examining a sample or trying a batch, and the workshop lists concrete operations instead of an empty workbench. The multi-day save/export/import round trip returned to the same location and time.

## Remaining coverage

No viable steep was made; the preparation was not drunk. Other herb lots/recipes and the experiment notebook remain unverified. The workshop's repair, fitting, treatment, reforge, and salvage operations were listed but not performed. No multi-day work routine was selected; the Day 3 run was idle, and only save/export/import persistence was assessed.

No game source or runtime files were edited. This report records playtest observations, not accepted design decisions.
