# B1 Area C playtest: Mistglass and combat

Status: complete at the bounded MCP-playable scope. Input: isolated master `3a1180dc274868d1e4350058a74725ac6b534394` plus the MCP wrapper fix. Fresh test origin: `http://localhost/?test_hooks=1`, seed `251033`. MCP reported `started: true`, Village, Day 1 08:00, and zero page errors.

Applied rules: AD6–AD8, AD15–AD17, AD19–AD20, AD25, AD28, AD32, AD36–AD38, MR1–MR7, MR10–MR12, MR16–MR22, MR27–MR32, CBR2–CBR3, CBR5–CBR7, CBR9–CBR16, CBR19–CBR30, AD41.

## Checkpoint

| Area | Coverage so far | State |
| --- | --- | --- |
| Mistglass entry | Fresh Village start; inspected visible actions and optional Projects surface | Blocked at route discovery. The Projects route and Mistglass presenter exist in source, but are not in the active MCP-visible controls. No explicit world-entry URL flag was found. No cultivation behavior reached. |
| Condensation / vessel geometry / seedbed / brood | Not reached | Unverified; no player-visible route yet. |
| Formulation / medicine / trials | Not reached | Unverified; no player-visible route yet. |
| Combat | Not reached | No combat state or outcome was seen. Village patrol is a livelihood job; it does not establish a combat route. |
| Combat review | Not reached | No combat report from a fight was available to review. |
| Time, Save / Export / Import | Seed `251034` advanced from Day 1 08:00 to Day 3 08:00 in 24-hour steps; Save, Export, cross-process `game_new({path})`, and Import all retained Day 3 08:00 at Village with zero page errors | Reached for the ordinary starting life. This checks persistence only for this idle Village state. |

### Limit recorded

**BMC1 (route access, blocker for this playtest lane)**

- Area: Mistglass entry and all cultivation systems.
- Repro: call `game_new({seed:251033,url:'http://localhost/?test_hooks=1'})`; inspect the visible action list and `#workspace_pane_navigation`.
- Expected: a player-visible route to optional Projects and the Mistglass opt-in panel, or a documented entry route.
- Observed: only Here, Crafting, Mixing and `?` are exposed in Center views; `#workspace_navigation`, the Projects route button, and Mistglass panel have no visible actions. The Village context list omits Projects. Source shows a Projects route and opt-in panel, but their UI is not exposed in this test surface.
- Severity: blocker for reaching the requested content through this MCP playtest; this does not establish a game defect or that cultivation is unreachable in the rendered desktop app.
- Receipts: `/tmp/b1-mistglass.jsonl`; one `game_report_limit` entry appended to `docs/tools/game_mcp_limits.jsonl`.
- Felt good: fresh-start result explicitly says `started: true`; the visible basic Village state is legible.

No source edits, save fixtures, or game-state debug mutations. Temp MCP transcript is unfiltered runtime text and is not a report surface for sealed content.

### Finding

**BMC2 (Village patrol advance errors, bug)**

- Area: time advance during an ordinary Village livelihood patrol job.
- Repro: `game_new({seed:251033})`; `game_look({scope:'#location_actions_div'})`; click action index `2` (Find work); click action index `70` (Take a loaned kit and patrol with Tessa); `game_step({minutes:120})`.
- Expected: the two-hour patrol shift advances or settles its stated pay and work outcome.
- Observed: the `game_step` operation returns `Cannot read properties of undefined (reading 'skill_required')`. The server remains usable; no combat state or fight outcome was observed. Patrol had started at Day 1 08:00.
- Severity: bug, this job's first time advance errors. This does not establish patrol as a combat route.
- Receipts: `/tmp/b1-mistglass.jsonl` (includes the call and error).
- Felt good: the job offer explains the two-hour duration and 50-coin pay before starting.

## Completion checkpoint

MCP actions during this bounded pass: fresh starts, project/control visibility inspection, the Village Find work and patrol attempt, two 24-hour idle advances, Save, Export, cross-process path resume, another 24-hour advance, Save, Export and Import. The 120-minute patrol step returned an operation error rather than ending the worker. A separate fresh life reached Day 3 08:00 and completed persistence checks. Mistglass cultivation, combat, and combat review remain untested because their player routes were not reached. Headless text evidence does not establish desktop viewport visibility or human acceptance.

Checks:

- `game_new({seed:251033,url:'http://localhost/?test_hooks=1'})`: PASS for started Village state; route BMC1 not exposed.
- `game_step({minutes:120})` after starting the patrol job: ERROR, BMC2; no combat reached.
- `game_step({minutes:720})` twice plus `game_step({minutes:1440})` on seed `251034`: PASS, Day 3 08:00.
- `game_save`, `game_export`, new server `game_new({path:<export>})`, and `game_load({path:<export>})`: PASS; time/location retained at Day 3 08:00/Village, page errors zero. Save hash after Day 3: `387e7da8758d70f2`.
