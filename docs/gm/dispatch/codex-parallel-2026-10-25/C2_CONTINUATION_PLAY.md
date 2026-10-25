# C2 continuation playtest, 2026-10-25

Applied AD6–AD8, AD22, AD32, AD34, AD36; AR3, AR7, AR8; AU1–AU7. Runtime identity: committed src tree `6f928fb9523f41ce21c8140461ba39d81ecc7a52` at branch HEAD `35ef1a1f3`; C2 MCP rebuilt with harness instrumentation. The resumed C2 run included the coordinator's uncommitted runner async-click wait fix. No primary uncommitted runtime, desktop UI or human acceptance claim.

## CCC1 · Continuation cycle and save persistence

**Area:** Life transitions, return points and save/export/load. **Severity:** confusing headless observation after resume; runtime cause unresolved; initial-return route remains untested.

**Repro:** `game_new({seed:251045,panel:'continuation'})` → `game_click({key:'#continuation_open'})` → scoped `game_look({scope:'#continuation_view'})` → `Begin a fresh life` → confirm it. The visible prompt explained that the current life pauses intact, the new embodiment starts in a separate Frontier history, and possessions do not transfer. On the fixed runner, the resulting view showed `Life 2 · arrival paused`, Continue, and Resume First life. Continue produced `Life 2 · one continuing self`. Resume First life required its visible confirmation; confirming returned to Day 1, 08:00 and showed First life · arrival paused, with Continue and Resume Life 2 available. Clicking Continue displayed “This return has already been applied” while the next scoped look still showed arrival-paused status. Resuming Life 2 also required confirmation and returned to its saved Day 1, 08:13 state. The selected reciprocal return works; whether Continue should clear the paused status is unresolved.

Life 2 study reached the later-checkpoint option after 10 minutes of ordinary time. Marking it and saving produced hash `aa6283a3e98a80b0`; export produced `/var/folders/xb/njlqv84d65zbhd229mkw85zh0000gn/T/yairpg-mcp/save-b4ec838d-105f-4fb1-86be-5af05840054e.txt` (413900 bytes). `game_new({path:<export>})`, More panels → Continuing connection, then scoped look restored Life 2 with its later return point. Confirming Return to later checkpoint moved from 08:13 to 08:12. Export/import therefore retained the reached second-life state and checkpoint.

**Coordinator qualification:** the source emits “This return has already been applied” when a continuation event token equals the previous token. The headless runner re-seeds its deterministic `crypto.randomUUID` stream on reload, so this observation may be a harness identity-replay artifact. A coordinator harness-only probe at seed 251045 confirmed that the first UUID repeats after realm reinstall (`true`); it loaded no game state. This supports a harness cause, not browser evidence of a native continuation bug. No token or hidden save state was injected to bypass it.

**Player feel:** The separation, pause and reciprocal route were clear, and the small study made the return-point idea legible. The arrival-paused copy remained after one Continue attempt with “This return has already been applied”; behavior beyond the demonstrated route is unclear. Return to initial point was not exercised.

## CCC2 · Old C2 runner sync defect, fixed on C2

**Area:** MCP observation after native life transition. **Severity:** medium tooling blocker, fixed on this lane.

**Repro:** On the pre-fix host, seed 251045 → open connection → select Begin a fresh life → explicitly confirm → `game_look({scope:'#continuation_view'})`. The call returned `game_look: "undefined" is not valid JSON` and `true !== false`. A save then changed to `8c1bce0cb3f729da`; exporting and loading that state exposed `Life 2 · arrival paused`, proving the transition had applied despite the stale/failed observation. The old transcript is `/tmp/c2-cont-session.jsonl`. The coordinator added an async-click wait; its focused check `/tmp/c2-fresh-check.log` records the same fresh-life route reaching Life 2 and saving hash `bd500535ce527677`. The updated persistent run then completed the journeys in CCC1 (`/tmp/c2-cont-fixed-session.jsonl`). Coordinator reports 14 affected consumer tests and expanded MCP regression passed; this worker ran no tests.

## Coverage gaps

U1 physical-baggage duplication is **untestable on this committed C2 build**: the visible continuation route offered no baggage ownership or slot controls. Do not treat this as a no-repro. Law memory was not exposed in the Learning view; it showed `Remembered learning · 0 observed skills`, the reading/crafting/smelting/forging carry description, and remembered life events. Source inspection only confirmed the rendered control’s boundary; it is not gameplay evidence. The fresh-runner route has no rebuilt desktop viewport evidence or human acceptance.

`game_report_limit({})` was called accidentally while diagnosing a look error and wrote a blank, no-information entry to the MCP limit ledger; the blank entry is not a documented limitation. The coordinator separately recorded the actual asynchronous observation failure with fields; all raw entries were retained. No source/tool/test changes by this worker, no commit.
