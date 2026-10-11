You are the master GM for the absorption wave in /Users/weiwei/code/yet-another-idle-rpg, branch codex/gameplay-foundations. Follow AGENTS.md and docs/GAME_MASTER_PROMPT.md (master GM → implementers, one integrator, exclusive writers). The scope is docs/gm/dispatch/absorb-2026-10-11/ASSIGNMENT.md, Parts A–E. Read it, CHECKPOINT.md and SESSIONS.md there first.

Live state you are inheriting: an earlier run was stopped mid Part A. `git merge f0e32c20` (7 v0.6 dev commits) is in progress. src/crafting_recipes.js and src/main.js are edited with no conflict markers but are unstaged; src/data/locations.js has unstaged edits too. scripts/absorb_browser.cjs is an unfinished browser check. Review those resolutions against both sides before accepting them; abort and redo the merge if they are wrong. Preserve the untracked PNG at the repo root.

Accepted decision (PROJECT.md, 2026-10-11): furniture, fixtures, accessories and similar owned things may give passive bonuses. Numbers are proposals.

Execution shape:

1. Phase 1, you alone: finish Part A. Resolve, `npm test`, `npm run build`, fresh-origin browser check of the new Days 2–7 content and an old fork save, then save, reload and import. Commit the merge locally. Everything after branches from this commit.

2. Phase 2, parallel: before spawning, reserve exact paths per worker and write the reservation table into CHECKPOINT.md. Give each worker its own git worktree and branch off the Part A commit, a focused brief (decision, sources, paths it owns, exclusions, gate) and no copy of this conversation. Suggested split, adjust after reading the source:
   - W-B: furniture and home bonuses (Part B).
   - W-C1: build accessories with utility effects (Proto23 O3).
   - W-C2: bad food and resistance training, look around with capped rising find chance, hub encounters and a recurring service, plus fitting Xeus24 section 4 ideas (O6, O7, O8).
   - W-D: fork patterns FNA04, FNA08, FNA12 (check overlap with village career), FNA05 Fort chain as original content.
   - W-E: pacing systems O2 hunger, O4 weather, O5 durability with repair, O9 elements, each behind a player setting with stated defaults. Split W-E further if the pool allows.
   You own the shared paths: src/main.js, src/save_files.js and other persistence, generated dist/, index.html, style.css, PROJECT.md, PLAYTEST.md and IDEA_INDEX.md. Workers put logic in their own modules and tests and hand you a short note of the hook lines, save fields and UI insertion points they need. Workers do not commit dist or touch another worker's paths. Each worker runs its own focused tests plus `npm test` in its worktree and reports evidence.

3. Phase 3, you alone: review each worker's actual diff and evidence. Merge them one at a time in order B, C1, C2, D, E. Add the hooks and save migrations yourself; old saves, including pre-merge fork saves, must load. After each merge, run `npm test` and `npm run build`, browser-check that part from a fresh origin, then save, reload and import, and commit locally with a plain message and no Co-Authored-By trailer. Send defects back to the owning worker rather than patching around them.

4. Phase 4: one combined fresh-origin journey touching every part, then save, reload and import. Anything not exercised goes in ACCEPTANCE_BACKLOG.md there as implemented-unverified. Then push codex/gameplay-foundations to origin. Never push to master.

Keep CHECKPOINT.md current (phase, worker IDs, scopes, statuses: queued, running, changes ready, verified, needs repair) so a successor can resume after a context refresh. If a part cannot be finished, stop at the last verified merge, push that, and rank the rest in REPORT.md. Finish with REPORT.md: what changed, what to click to see each part, checks run, what remains open. Proposal entries go in PROJECT.md marked proposal.
