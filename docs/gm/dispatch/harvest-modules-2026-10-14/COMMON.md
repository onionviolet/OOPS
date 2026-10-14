# Common rules for harvest-module lanes

Main checkout: `/Users/weiwei/code/yet-another-idle-rpg`, branch `codex/gameplay-foundations`. Other sessions commit there every few minutes. **Never write to the main checkout** except docs lanes, which write only inside their own folder `docs/gm/dispatch/harvest-modules-2026-10-14/<lane lower-case>/`. Never stage or commit in the main checkout; root commits docs lanes.

Read first: `AGENTS.md`, `PROJECT.md` standing priorities, this folder's `PLAN.md`, your lane prompt. Then the live code: `src/enemies.js` (loot, `get_loot`, Butchering modifier), the combat kill and loot path in `src/main.js`, `src/items.js`, `src/crafting_recipes.js` (butchering recipes), `src/seeded_streams.js`, and design: `docs/gm/dispatch/procgen-2026-10-13/p8/` (CREATURE_RESOURCES, LIVE_AUDIT, WORLD_VARIATIONS), `p6/`, `cr1/`, and the absorb-all `p23-salvage` report.

## Standing direction

- Desktop/laptop first: 1366x768 plus 1600x1000. Mobile deferred.
- Solo player: no fixed "once" limits; limits are per-world adjectives. Save safety still matters.
- Everything possible, reasonably: keep options reachable.
- Sealed secrets: never print a secret's truth in reports, commits or UI outside its route. Refer by ID.
- Reload never rerolls: draws that matter come from saved seeded streams (`src/seeded_streams.js`); previews never consume draws.
- Persistence changes need a migration or an explicit compatibility decision; old saves load unchanged.
- Original names and items unless a canon source is cited per PROJECT.md.
- Considerations, not specs: tables are palettes for fitting characters at fitting times, and must make sense per world.

## Code lanes: worktree and verification

```
cd /Users/weiwei/code/yet-another-idle-rpg
git worktree add .claude/worktrees/<worktree> -b <branch> codex/gameplay-foundations
ln -s /Users/weiwei/code/yet-another-idle-rpg/node_modules .claude/worktrees/<worktree>/node_modules
```
Reuse it on resume. `npm test` and `npm run build` must pass. Browser: Playwright at `/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright` (channel chrome), serving your rebuilt worktree with `python3 -m http.server <port> --bind 127.0.0.1`, fresh profiles under `/private/tmp/hv-<lane>-profile*`, hero named `TEST FIXTURE HV <lane> ...`. Exercise natively, then Save, reload, Export and literal-file Import with state comparison. Label claims natural / seeded-native / source. Unexercised work is IMPLEMENTED_UNVERIFIED in BACKLOG.md. Never touch Weibao's private saves. `docs/gm/dispatch/procgen-2026-10-13/r3-merge/p34_proof.cjs` is a working natural-journey harness to adapt.

Commit on your branch, plain message, **no Co-Authored-By trailer**, never `dist/` or `index.html`. Do not push or merge; root merges.

## Deliverables

In your lane folder (code lanes: inside your worktree): `CHECKPOINT.md` first and kept current; `REPORT.md` in plain English (how Weibao reaches it, what changed, shared files touched, checks with counts and labels, open items); `BACKLOG.md` for unverified or deferred items. Use short codes for findings. No em dashes. End with a short summary.
