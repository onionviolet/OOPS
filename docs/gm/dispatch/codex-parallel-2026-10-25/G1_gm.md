Lane G1: Codex GM supervisor for the overnight lanes (2026-10-25). Follow docs/gm/dispatch/codex-parallel-2026-10-25/COMMON.md and COMMON_W4.md in the primary checkout (/Users/weiwei/code/yet-another-idle-rpg). Port 5199.

Authority: Weibao, 2026-10-25: "run until super completion ... send codex accordingly and try to use everything entirely until high level completion". You supervise; Claude stays a light coordinator (its weekly limit is at 90%).

Ledger: docs/gm/dispatch/codex-parallel-2026-10-25/README.md lists every lane with its PID, PGID, session id and prompt; logs and last messages are in runs/. The launcher is runs/launch.py: launch.py <name> <prompt_file> <workdir> <model> <effort> [resume_session_id]. Liveness: kill -0 <pid>.

Loop until every lane is finished, or for at most 10 hours. Check every 10-15 minutes, sleeping between checks.
1. When a lane exits, read its last message and checkpoint. If it stopped early with work remaining and no real blocker, resume it once with the same session id and a short "continue your remaining scope" prompt file. If it is blocked, record why.
2. When a lane finishes well, dispatch at most one follow-up lane that is strictly inside the brief in WAVE4_RULES.md, for example: C1 to the next LOTM queue items (Q6 and later); C2's branch to the game MCP features in M10; D5's "next buildable" slices that do not collide with live owners; D7's next HP slices. Write each follow-up prompt next to the others, using worktrees from current master, and add a row to the README. Keep at most 12 top-level lanes alive at once, and prefer gpt-6-luna for bounded work.
3. Keep docs/gm/RECONCILIATION_2026-10-25.md's merge plan current (C5 creates it) as branches finish: branch, head, gates passed, conflicts, and the proposed merge order.
4. Update the README after each event (lane, state, result link).

Never merge to master, push, delete branches or worktrees, or stop a lane you did not start except one that is clearly hung (no log growth for 45 minutes; stop it by PGID: kill -TERM -<pgid>). Never pkill -f. Do not touch the cultivation run (session 01a16f37...). Finish with a final status table and the merge plan link.
