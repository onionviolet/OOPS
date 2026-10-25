---
name: mechanic-absorption
description: Take a YAIRPG mechanic from question to playable slice - fit it to existing systems, run consideration rounds, research and gap-fill lanes, an implementation design, isolated build lanes with save and browser proof, and coordinator verification. Use in /Users/weiwei/code/yet-another-idle-rpg when Weibao asks to absorb, implement or "send out and work on" a mechanic from a source world or his own idea, especially after "more to consider?" rounds.
---

# Mechanic absorption (Codex)

The repo owns the workflow; this skill only routes to it. Read
`docs/gm/MECHANIC_ABSORPTION_WORKFLOW.md` (stages 0 to 7 and the expansion backlog) in
`/Users/weiwei/code/yet-another-idle-rpg` and follow it. AGENTS.md rules win on any conflict.
This file is the Codex copy; install or refresh it at `~/.codex/skills/mechanic-absorption/`
and keep it in step with `.claude/skills/mechanic-absorption/SKILL.md` (MAW-X1).

## Stages, short version

0. **Fit first.** Open `docs/SYSTEMS_REGISTER.md` and its two files under `docs/systems/`.
   Find the system and the degree that already fits (for example recipe slots SUB0 to SUB4).
   Read the host code before designing.
1. **Consider in rounds.** Use the `more-to-consider` skill. Save each round in the owning
   palette with ACT NOW, ACCOUNT FOR NOW and LATER/DELEGATE; never restart codes.
2. **Research lanes**, in parallel, notes and code only, one file each in the task's
   `docs/gm/dispatch/<task>/` folder: whole-space catalog, mechanics and edge rules,
   implementation design from code. Spot-check cited facts before folding.
3. **Data gap fill** when data is thin: `docs/research/SOURCE_DEEP_DIVE_PLAYBOOK.md`
   section DGF1 to DGF10, with `docs/research/tools/book_deep_dive/keyword_scan.py`,
   `hit_context_shards.py` and `fetch_wiki_images.py`. Bulk downloads only on Weibao's ask;
   raw data stays gitignored or in `private_packs/`.
4. **Build lanes in separate worktrees.** Create each with
   `git worktree add <path> -b codex/<lane> master` and symlink `node_modules`. Worktrees see
   only committed files: give lanes absolute paths to uncommitted docs in the main checkout.
   Record owned files, branch and path in the checkpoint first. Each runtime brief carries a
   golden snapshot of existing commands, the save validators that could refuse new state,
   conservation in the save envelope, an old-save load, and browser proof on the rebuilt
   bundle from a fresh origin at 1920x1080 and 1536x864 at 14 and 21 px with save, reload,
   Export and literal Import. Lanes run focused tests only and never commit or push.
5. **Verify yourself**: rerun focused tests, read the diff and decision file, open one
   screenshot at target size, read the browser result JSON including the old-save run.
6. **Integrate** in one clean worktree off current master; run `npm run build && npm test`,
   `npm run check:arch`, `npm run check:rules` once. Commit own paths only (private index
   for shared docs, see `docs/gm/SHARED_WORKTREE_PRACTICE.md`), no `Co-Authored-By`; commit
   and push only on Weibao's yes. Remove verified worktrees and merged branches afterwards.
7. **Record**: palette round, USER_VISION line quoting him, checkpoint, systems register
   update when a system or degree lands, play queue entry with exact steps, and new lessons
   in the workflow's expansion backlog.

## Codex specifics

- Subagents: `gpt-6-luna` at low effort for bounded reading, extraction and file checks;
  `gpt-6.1-sol` for design, synthesis and code lanes. Set model and effort explicitly.
  `gpt-6-astra` only after an advisor second opinion, with the reason stated.
- Detach long runs in their own process group; record session IDs and PIDs; stop by PID or
  group, never `pkill -f`.
- No spoofed user agents in fetches; sites blocked by policy stay blocked; logins are
  Weibao's route.
