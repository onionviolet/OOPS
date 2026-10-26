Lane Q12: carry-out queue follow-up. Branch codex/q12-checkjs-pilot-2026-10-26. Model gpt-6-luna low. Port 5212 if needed; avoid servers for this task.

Follow the primary checkout dispatch COMMON.md at /Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/carry-out-queue-2026-10-26/COMMON.md (read by absolute path if absent from your master snapshot). Read GROUND_RULES and relevant RULES_INDEX codes; if the master snapshot lacks GROUND_RULES, read /Users/weiwei/code/yet-another-idle-rpg/docs/GROUND_RULES.md and primary relevant rule sections read-only. Shared .git writes are explicitly authorized for narrow task commits; if sandbox denies lock/ref writes, use the supported approval escalation for that exact command once, without changing permissions or lockfiles. If denied, preserve work and report blocked. Your own worktree is the sole write area. Commit narrow task paths on your branch; never push or merge, touch primary, change dist/index.html, run full npm test, or dispatch subagents. Use focused checks. Receipt starts with COMMON front matter, then paths, commands/results/gaps, remaining work, branch and full head. Maximum wall time three hours. No broader cleanup.

Codes: IPC63; TS10, AD39, AD36. Packet remains proposal execution, no rule acceptance.

Why/task: Run a one-file TypeScript checkJs pilot on one pure leaf, initially src/clear_state.js, on this disposable branch. Inspect the file first; use available TypeScript tooling without adding a runtime dependency or changing gates. Run tsc --allowJs --checkJs --noEmit with explicit one-file inputs and suitable configuration, recording compiler version, exact command, input hash, transitive scope, error count and which diagnostics identify real shape bugs versus environment/noise. Do not fix runtime source in this pilot. Own a new docs/reviews/CHECKJS_PILOT_2026-10-26.md and optional isolated pilot config only; no package/lock edits. If compiler unavailable, record actual blocker without silently installing packages. Done: reproducible results and usefulness judgment; no gate change.

PRF1: Deliver this queue row at its stated scope.
PRF2: Tooling/doc result and actionable failure report; player text n/a.
PRF3: Reuse existing tool/doc; record actual blocker rather than widen scope.
PRF4: Existing owner produces the result; integrator handles later landing.
PRF5: Extend the specific script/table/pilot owner named above.
PRF6: Tooling/docs only; runtime/persistence/UI unchanged.
PRF7: No UI changes or viewport claim.
PRF8: User-authorized packet; preserve accepted direction and distinguish proposals.
