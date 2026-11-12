# Foundation run, 2026-11-12

Coordinator: the Claude session that wrote the [procedural foundation plan](../../../PROCEDURAL_FOUNDATION_PLAN.md). Workers: twelve local Claude sessions, one per chat (K W P G L F B S A C R M), each in its own worktree and branch. The coordinator verifies, merges, gates and dispatches.

## Phase 1 (2026-11-11 to 2026-11-12)

| Chat | Branch | Commits | Delivered | State |
| --- | --- | --- | --- | --- |
| K | claude/fdn-k-kernel-a28c4b | 6df7bbdb3, f05d8afa8 | Working contract v0; Gu procedures and creature methods pass 17 contract tests incl. one jump vs many and reload | merged |
| W | claude/fdn-w-substrate-ee40b6 | 7d9378127, 5956d23ae | Substrate v0; brew steam and shell regulator exchange humidity and smoke with no import; same after jump, steps, reload | merged; not wired into live play (below floor) |
| P | claude/fdn-p-grammar-4ffe18 | 415f8e755, 937d36f4e | Grammar contract v0, module, Gu canon test (report in foundation-p) | merged |
| G | claude/fdn-g-gu-312887 | eb8b903b9, 860ff5875 | Catalogue 28 to 78 kinds as identity data; 7 run as data; compression inventory; grammar and quantity drafts | merged |
| L, F, B, S, A, C, R, M | claude/fdn-*-* | one or two each | Inventories, PFP2 counts, grammar or contract proposals; S adds a spellbook browser receipt | merged |

Merged into master as 12 no-ff merges ending at 886d8c1e7.

## Resume block (unattended run, 2026-11-12)

Weibao (2026-11-12): "send the plan updates to the chats and start phase 2. Continuw auto thorugh all the phases until everything is comprehensive and works to cover all the gu, all the possibilities of moves and more, all the potions and more? rescope as needed and more?"

- Objective: every chat in the plan meets its done check (plan tables plus PFP2 counts), Gu catalogue runs as data with moves beyond canon through the effect grammar and composed workings, potions as data across Hogwarts and Lord of the Mysteries, the three emergence chains run with no join code, one combined browser pass; each phase committed on master.
- Input identity: master at 886d8c1e7 plus plan edits; dirty but not ours: none at start.
- State of the steps: phase 1 merged; gates on merged tree running; phase 2 not dispatched.
- Last evidence: pre-merge master 9bbc51363 full suite 6146 pass, 0 fail, 2 skipped.
- Failed approaches: starting sessions from a background-task turn is refused by the app; dispatch only on a user turn or by messaging existing sessions.
- Next useful action: on green gates, commit the plan, message all twelve chats with the phase 2 brief.
- Usage pacing: read 2026-11-12 06:00 local: 5-hour 31%, weekly all-models 51%. Continue while weekly < 75% and 5-hour < 85%. 5-hour >= 85%: no new phase dispatch; wake after reset. Weekly >= 75%: stop, keep this block current, wait for Weibao.
- Stop condition: objective met, or weekly >= 75%, or a blocker only Weibao can clear (push, direction change). Reached? no.

Resume prompt for a fresh session: "Continue the unattended foundation run from the Resume block in docs/gm/dispatch/foundation-run-2026-11-12/RUN.md. Check git status and git log -3 against its input identity first; finish the next useful action; keep the block current; commit own paths, no push."
