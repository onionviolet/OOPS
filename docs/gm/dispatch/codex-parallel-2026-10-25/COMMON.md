Common rules for every 2026-10-25 Codex lane (Weibao: "send out a bunch more Codex agents ... let those CLIs start subagents too"). Coordinator: Claude session "Codex lanes" in the primary checkout; lane records in docs/gm/dispatch/codex-parallel-2026-10-25/.
- Read AGENTS.md and docs/RULES_INDEX.md first; cite the rule codes you apply in your output.
- You may spawn Codex subagents for parallel bounded work (Weibao asked for it). Default subagent model gpt-6-luna at low or medium effort; reserve gpt-6.1-sol for synthesis or judgment. Give each subagent a narrow brief, owned files, and a done check; review their returns before folding them in. Keep at most 4 subagents running at once unless your brief says otherwise.
- Several other Claude and Codex sessions edit the primary checkout. Never stash, reset, force, switch branches or commit there. Never push. Never use pkill -f; stop processes by PID.
- Sealed secrets: never write a secret's truth into reports; refer by ID and route.
- Save partial results as you go so an interrupted run leaves usable files. Finish with what changed, the checks run (one line each: command, result, gaps) and what remains.
