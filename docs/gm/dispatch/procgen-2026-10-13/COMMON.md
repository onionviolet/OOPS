# Common rules for procgen wave 1 workers

Main checkout: `/Users/weiwei/code/yet-another-idle-rpg` (branch `codex/gameplay-foundations`). **Never write to the main checkout** except P5, which writes only under `docs/gm/dispatch/procgen-2026-10-13/p5/`. Another integration worker is active in the main checkout.

Read first: `AGENTS.md`, `PROJECT.md` (standing priorities section), this folder's `PLAN.md`, your slice prompt, then the owner docs it names. Several owner docs are untracked and exist only in the main checkout; read them by absolute path there:
- `/Users/weiwei/code/yet-another-idle-rpg/docs/PROCEDURAL_GENERATION_STATUS_2026-10-13.md`
- `/Users/weiwei/code/yet-another-idle-rpg/docs/PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md`
- `/Users/weiwei/code/yet-another-idle-rpg/docs/research/procedural-materials-2026-10-13/` (REPORT.md, IMPLEMENTATION.md, PROCEDURAL_RULES.md, deep/)
- `/Users/weiwei/code/yet-another-idle-rpg/docs/HUNGER_AND_BODILY_NEEDS_CONSIDERATIONS_2026-10-13.md`

## Standing direction that binds every slice

- Desktop/laptop first: UI checks at 1366x768 plus one wider desktop check. Mobile deferred.
- Food: useful meal benefits, comfortable unfed play, no hunger death.
- Solo player: no fixed "once" limits as anti-abuse; limits are per-world adjectives. Save safety still matters.
- Everything possible, reasonably: keep options reachable rather than forcing either/or.
- Sealed secrets: never print a secret's truth in reports, commit messages or UI outside its discovery route. Refer by ID and status.
- Reload never rerolls: every draw that matters is seeded from the per-save seed and its consumed state is saved. Previews never consume draws.
- Persistence changes need a migration or explicit compatibility decision. Old saves must load unchanged in behavior where the slice does not apply.
- Original fictional ingredients/people/names unless a canon source is cited per PROJECT.md attribution rules.

## Worktree setup (do this first)

```
cd /Users/weiwei/code/yet-another-idle-rpg
git worktree add .claude/worktrees/<your-worktree> -b <your-branch> codex/gameplay-foundations
ln -s /Users/weiwei/code/yet-another-idle-rpg/node_modules .claude/worktrees/<your-worktree>/node_modules
```
If the worktree already exists (resume), reuse it. Work only inside it.

## Verification (AGENTS.md)

- Unit tests for every new module and every reproduced defect. `npm test` and `npm run build` must pass in your worktree.
- Browser: Playwright at `/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright` (channel chrome), viewport 1366x768 plus 1600x1000, serving YOUR rebuilt worktree on your assigned port with `python3 -m http.server <port> --bind 127.0.0.1`. Fresh profiles under `/private/tmp/procgen-<slice>-profile*`.
- Exercise the changed behavior natively, then Save, reload, Export and literal-file Import with state comparison. Seeded test states are allowed if made through real game code; name the hero `TEST FIXTURE PROCGEN <slice> ...` and label every claim natural / seeded-native / source.
- Anything not exercised is IMPLEMENTED_UNVERIFIED and goes in your BACKLOG.md.
- Never use or touch Weibao's private saves.

## Deliverables

Under `docs/gm/dispatch/procgen-2026-10-13/<slice lower-case>/` **inside your worktree** (P5: main checkout):
- `CHECKPOINT.md` created first and updated as you go (resume point).
- `REPORT.md` in plain English: how Weibao reaches it in play, what changed (files, with shared-file edits listed separately), checks run with counts and labels, pass/fail, open items.
- `BACKLOG.md` for unverified/deferred items. Compact evidence and harness only; nothing over ~2 MB, no browser profiles.

## Commit

Commit on your branch with a plain message and **no Co-Authored-By trailer**. Never commit `dist/` or `index.html`. Do not push. Do not merge into `codex/gameplay-foundations`; root merges.

End with a short summary: commit hash, what is playable, checks and labels, shared files touched, what is open.
