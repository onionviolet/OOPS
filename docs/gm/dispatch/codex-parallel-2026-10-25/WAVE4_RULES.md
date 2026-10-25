# Wave 4 rules and more-to-consider round (2026-10-25)

Weibao, 2026-10-25 ~02:40: "use all the skills available and more, run until super completion, maybe full world implementation, and also extreme UI enhancement of every little subtle detail, overall detail, modularity, glow, ideas left and more every cheat, every future little thing, engine stuff, programming language considerations, agentic power enhancements /more-to-consider also use skill to improve prompt, send codex accordingly and try to use everything entirely until high level completion".

Sharpened brief (sharpen skill): Codex carries every open track to high-level completion overnight. Claude coordinates lightly because its weekly limit is at 90%; Codex runs on the ChatGPT subscription (auth_mode chatgpt, no API key). Done when each lane ends with verified commits on its own branch or a saved owner doc, the GM lane has a merge plan, and the README shows every lane's final state. Merging to master, pushing, deleting and buying wait for Weibao. Assumed: the second full world is Harry Potter, and LOTM Tingen continues under C1.

## More to consider (round 1)

ACT NOW (applied to every wave 4 prompt):
- M1 dist/ is tracked. Branches must not commit dist/bundle.js or its map, or every merge will conflict; the merger rebuilds. Lanes still build locally for verification.
- M2 Unique ports per lane for dev servers and headless browsers (D1 5101, D2 5102, D4 5104, D7 5107, G1 5199; C lanes keep theirs). Stop your own servers by port when done.
- M3 Machine load: 18 cores, about 12 top-level lanes plus subagents. Run at most one full `npm test` and one browser session at a time per lane, and run the full suite only at the end.
- M4 Collisions: the cultivation run owns its files in the primary checkout (see the C5 handoff); C1 owns LOTM, C2 owns scripts/mcp, C3 the playtest-fix files, C4 tests restructuring. Wave 4 lanes branch from current master, check `git -C <primary> status --short <file>` before editing, and list overlaps in their checkpoint instead of avoiding needed work.
- M5 Nested launches: G1 needs write access to ~/.codex to run codex, and git access to create worktrees; it gets an extra --add-dir for both.

ACCOUNT FOR NOW:
- M6 Harry Potter goes through the existing world-pack loader and opt-in branch pattern (as LOTM did), following the deep-world workflow (docs/DEEP_WORLD_WORKFLOW_2026-10-19.md). Changed or randomized truths are sealed secrets.
- M7 UI claims need rebuilt browser evidence at the desktop target viewport (AGENTS.md; standing UI priority, desktop first, mobile deferred).
- M8 Proposals stay proposals: language/stack changes, idea inventories and agentic designs are saved as proposals; only the lane's own branch receives code.
- M9 One merge plan: C5 writes the reconciliation plan; G1 keeps it current as wave 4 branches finish.

LATER / DELEGATE:
- M10 Game MCP features (quote tool, Electron screenshots, session ids, frozen bundle) wait for C2's branch. G1 may dispatch them after C2 finishes. Level Sol, effort medium, done check: game_mcp_check passes plus the ledger rows are closed.
- M11 A language migration (TypeScript, WASM hot paths) is a proposal only until Weibao picks one. Level Sol, effort large, done check: a decision logged in USER_VISION.
