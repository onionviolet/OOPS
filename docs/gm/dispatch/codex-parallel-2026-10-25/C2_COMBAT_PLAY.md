# C2 native combat playtest, 2026-10-25

Owner: C2. Scope: native combat and combat review in the C2 MCP harness, one fresh seed and bounded follow-up. Worktree HEAD `35ef1a1f3`; runtime/source tree `6f928fb9523f41ce21c8140461ba39d81ecc7a52`. This is headless MCP evidence, not desktop or human acceptance. Relevant direction: AD6–AD8, AD22, AD32, AD34, AD36; AR3/AR7/AR8; CBR1–CBR30; AU1–AU7. The dispatch `COMMON.md` was absent from this worktree; I read the primary copy at `/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/codex-parallel-2026-10-25/COMMON.md` before handoff.

## Checkpoint

Fresh native route, seed `251046`: `game_new` → visible elder action `[data-dialogue="villageElder"]` → `[data-textline="hello"]` → `what happened` → `ask to leave 1` → `need to` → `starting gear` → `sword` → `#center_mode_back` → scoped `#location_actions_div` → `Enter the [Infested field] [15m]`. The elder route disclosed the field through ordinary dialogue. A fresh place action view showed the native travel option. No synthetic state, hidden-truth access or raw save inspection was used.

At 08:20, the native Combat panel became available through the visible More panels menu. It showed one Wolf rat at 24/28 hp, 15/15 groups remaining, player 34/40 stamina and 60/60 hp, and “Combat in progress.” The native report log recorded repeated player hits and rat misses. After 30 played minutes, the first group resolved and a second Wolf rat appeared; the zone showed 14/15 groups remaining. At 09:05, the player had 18/60 hp and 0/40 stamina; the second rat had 24/30 hp. Subsequent bounded 5-minute steps reduced the player to 8/60 hp and the rat to 21/30. The player had a Cheap iron sword from the elder’s starting-gear choice.

Save/export/load at 09:05 preserved the Infested field location, game time, player vitals, and active encounter. `game_save` returned hash `9a46e31b8f398a4c`; export was written under the MCP private temp directory and loaded through `game_load`. The post-load Combat panel returned the same opponent at 24/30 hp. No raw save was read.

Receipt: `/tmp/c2-combat-session.jsonl` (live MCP request/result transcript); earlier exploratory receipts are `/tmp/c2-combat-transcript.json` and `/tmp/c2-combat-transcript.jsonl`. The MCP server bundles the assigned worktree with harness instrumentation; no desktop/browser claim is made.

## Coverage

| Area | Status | Evidence / remaining gate |
|---|---|---|
| Fresh-start elder route and field unlock | Exercised | Seeded dialogue and visible travel option in transcript |
| Real native combat entry | Exercised | Infested field, Wolf rat, native opponent and Combat panel, 08:20 |
| Native combat progress and win | Exercised | First group resolved; zone moved from 15/15 to 14/15 groups remaining |
| Defeat or withdrawal | Open; withdrawal route unresolved | At 8/60 hp and 0/40 stamina during live combat, `#location_actions_div` returned no actions; the C2 MCP scope does not establish whether another native control exposes the parent return action |
| Native combat review/report | Partial | Combat-filtered exchange log was visible; no dedicated combat review surface exists in this branch, and no post-outcome review was exercised |
| Save, export, load, and identity/time/location return | Exercised mid-fight | 09:05, Infested field, 18/60 hp, 0/40 stamina, same active rat and hp restored |
| Desktop and human play acceptance | Open | Outside this headless harness |

## Findings

**CBC1: Infested field, mid-fight withdrawal discoverability.** Repro from fresh `game_new({seed:251046})`: complete elder `hello` → `what happened` → `ask to leave 1` → `need to`; take `starting gear` → `sword`; return with `#center_mode_back`; enter the visible Infested field from `#location_actions_div`; open the native Combat panel; allow the first group to resolve; during the next “Combat in progress” state, inspect `game_look({scope:"#location_actions_div"})`. **Expected:** a player-visible withdrawal choice with its ordinary cost (CBR25). **Observed:** this scope returned no actions at 8/60 hp and 0/40 stamina. The parent return route exists in source, so this headless observation does not prove it is unavailable elsewhere in the native UI. **Severity:** confusing; route/coverage gap, not a confirmed CBR25 violation. **Receipt:** `/tmp/c2-combat-session.jsonl`, including the single `game_report_limit` entry; **build:** assigned C2 HEAD `35ef1a1f3`, runtime tree `6f928fb9523f41ce21c8140461ba39d81ecc7a52`.

Combat-review coverage remains partial: the native Reports area had a Combat filter and exchange entries, but this branch has no dedicated combat review surface; those are not treated as equivalent. The bounded run stopped with the second encounter active after a confirmed first-group win and a successful live-encounter save/export/load roundtrip. No after-outcome review was possible within this route. No gameplay acceptance, desktop behavior or wider balance claim is made.

Checks: native C2 MCP play only, seed `251046`, completed through the assigned driver; no source edits, build or test commands in this playtest lane.

What felt good: ordinary elder dialogue opened travel and equipment choices; the native combat view made opponent health and group progress legible. A mid-fight export/import retained the reached vitals and opponent state.
