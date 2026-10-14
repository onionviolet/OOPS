# Common rules for chain-build lanes (T2, T3)

Weibao, 2026-10-14: "Dispatch T2 (read-only chain inspector) then T3 (rule reader at Village mixing) as code lanes, after HV1 merges." HV1 merged at `4f853c24`. Picks come from [modular chains round 3](../../../MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md#cross-lane-top-picks-proposal-ranked). Implementation of these two slices is authorized; nothing else in the palette is.

Main checkout: `/Users/weiwei/code/yet-another-idle-rpg`, branch `codex/gameplay-foundations`. Other sessions commit there every few minutes. **Never write to the main checkout.** Work only in your own worktree. Do not push or merge; root merges.

Read first: `AGENTS.md`, `PROJECT.md` standing priorities, the round 3 section of the palette above (corrections X1-X19, R3-1 to R3-5), your lane prompt, then the lane reports it names. Live code beats reports: reports were written against older commits.

## Standing direction

- Desktop/laptop first: 1366x768 plus 1600x1000. Mobile deferred.
- No universal crafting, rule or assembly engine. Extend existing owners; share a piece only when two real consumers use it.
- Reload never rerolls: draws come from saved seeded streams (`src/seeded_streams.js`); previews and inspectors never consume draws.
- Sealed secrets and generated laws: never print a generated or sealed truth in reports, commit messages or player UI outside its discovery route. Refer by ID and status. Debug views that show truth must be developer-only and labeled.
- Persistence changes need a migration or an explicit compatibility decision; old saves and HV1-era saves load unchanged. New saved domains are optional and revisioned; a missing domain means old behavior.
- Solo player: no fixed "once" limits; limits are per-world adjectives.
- Original names unless a canon source is cited. No em dashes in docs.

## Worktree and verification

```
cd /Users/weiwei/code/yet-another-idle-rpg
git worktree add .claude/worktrees/<worktree> -b <branch> <base>
ln -s /Users/weiwei/code/yet-another-idle-rpg/node_modules .claude/worktrees/<worktree>/node_modules
```
Reuse it on resume. `npm test` and `node build.js` must pass. Browser: Playwright at `/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright` (channel chrome), serving your rebuilt worktree with `python3 -m http.server <port> --bind 127.0.0.1`, fresh profiles under `/private/tmp/cb-<lane>-profile*`, hero named `TEST FIXTURE CB <lane> ...`. Exercise natively from a fresh origin, then Save, reload, Export and literal-file Import into a second fresh profile with state comparison. Working harness to adapt: `docs/gm/dispatch/merge-sweep-2026-10-14/hv1-browser-smoke.cjs`. Label claims natural / seeded-native / source. Unexercised work is IMPLEMENTED_UNVERIFIED in BACKLOG.md. Never touch Weibao's private saves.

Commit each stage on your branch, plain message, **no Co-Authored-By trailer**, never `dist/` or `index.html` unless the build requires it as the repo already does.

## Deliverables

In `docs/gm/dispatch/chain-build-2026-10-14/<lane lower-case>/` inside your worktree: `CHECKPOINT.md` first and kept current (first line `DONE` only when every gate passes, otherwise `IN PROGRESS` or `BLOCKED: <reason>`); `REPORT.md` in plain English (how Weibao reaches it, what changed, shared files touched, checks with counts and labels, compatibility decisions, open items); `BACKLOG.md` for unverified or deferred items. Short codes for findings. End with a short summary.
