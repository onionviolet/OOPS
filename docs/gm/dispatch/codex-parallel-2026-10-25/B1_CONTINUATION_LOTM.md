# B1-D continuation and LOTM playtest, 2026-10-25

Input: isolated branch `codex/game-mcp-play-2026-10-25`, committed master `3a1180dc2` plus the MCP wrapper fix. Player-facing controls only; no game source or save editing. Seed `251034`. Main receipt: `/tmp/b1-lotm.jsonl`. Applies AD6–AD8, AD10–AD12, AD15–AD17, AD32, AD36, AR7–AR8, PIR22 and sealed-secret handling.

## Findings

### BLD1 — Bug: Village patrol time advance throws

- **Area:** Fresh Frontier life, ordinary work control.
- **Repro:** `game_new({seed:251034,url:'http://localhost/?test_hooks=1&lotm_probe=1'})`; `game_click` the visible `Find work` action; click the offered `Take a loaned kit and patrol with Tessa (2 hours, 50 coins)` control (`[data-activity="patrolling"]`), then `game_step({minutes:120})`.
- **Expected:** Complete the two-hour patrol or show an ordinary player-facing reason it cannot continue.
- **Observed:** Patrol starts, then the step returns `Cannot read properties of undefined (reading 'skill_required')`. This prevents a clean two-hour work result; the worker remains usable.
- **Severity:** bug.
- **Receipt:** `/tmp/b1-lotm.jsonl`; `game_report_limit` recorded the exception. No other work activity was tested; idle stepping remained available.

### BLD2 — Blocker: Tingen panel is absent on the test entry route

- **Area:** LOTM entry, both Sequence 9 pathways and Tingen districts.
- **Repro:** Fresh game with the seed and localhost URL above, including `lotm_probe=1`; save once; inspect default and paged `game_look` actions; inspect `game_look({scope:'#lotm_panel'})`.
- **Expected:** The opt-in Tingen branch appears as a normal player control, allowing enrollment and pathway/district play.
- **Observed:** The game starts in Village (`started:true`), but no paged action contains LOTM/Tingen. The scoped panel view is empty both before and after `game_save`. The visible Options groups and local-life controls did not expose it.
- **Severity:** blocker for this requested coverage; no claim about pathway behavior.
- **Receipt:** `/tmp/b1-lotm.jsonl`; `game_report_limit` recorded the missing entry route. No direct host command or save mutation used.

### BLD3 — Blocker: fresh-life connection has no reachable player control

- **Area:** Continuation, memory and baggage across lives.
- **Repro:** Fresh game as above; inspect default and paged `game_look` actions, then `game_look({scope:'#continuation_panel'})`; repeat the scope check after `game_save`.
- **Expected:** A visible continuing-connection control opens the ordinary confirmation flow for a fresh life and its carryover details.
- **Observed:** No action contains “continuation,” “connection,” or “fresh life”; the scoped panel view is empty. No new life could be started through visible controls, so law memory, baggage and reciprocal return remain untested.
- **Severity:** blocker for requested continuation coverage.
- **Receipt:** `/tmp/b1-lotm.jsonl`; `game_report_limit` recorded the missing continuation route. No direct host command or save mutation used.

## Coverage

| Area | Result | Evidence / gap |
|---|---|---|
| Initial life and entry | Reached | `game_new` starts in Village at day 1, 08:00 with the test-only URL. Initial view includes home, mixing, herb verge and gear-workshop services. |
| Several days in the active life | Reached by idle stepping | Three `game_step({minutes:1440})` calls advanced the same life to day 4, 08:00 in Village. The patrol step exception interrupted active-work testing. |
| Continuation, fresh life, law memory and baggage | Not exercised | BLD3; no visible player route. |
| LOTM Seer and Corpse Collector pathways | Not exercised | BLD2; entry panel unavailable. |
| LOTM Tingen districts and timed movement | Not exercised | BLD2; no district controls exposed. |
| Save/export/load | Reached | `game_save`: 116,785 bytes, hash `26625ddf61b9b1cc`; export wrote `/var/folders/xb/njlqv84d65zbhd229mkw85zh0000gn/T/yairpg-mcp/save-64ed4004-b931-429b-b7dd-729c57542c39.txt`; `game_new({path})` resumed at day 4, 08:00, Village. A second save returned 129,027 bytes; second export and `game_load({path})` restored day 4, 08:00, Village with zero page errors. These are disposable harness saves. |

The UI offered useful local landmarks, a timed market notice, a local search action, and the elder’s direct route advice. Those are promising orientation cues, but this pass could not judge activity feel, continuation or Tingen play.

## Remaining gate

Expose the LOTM enrollment and continuing-connection panels through ordinary visible controls on the authorized test route, then repeat this slice. Fix the `patrolling` action exception. Until then, all three blockers above remain; this is headless MCP evidence only, not desktop or human acceptance.
