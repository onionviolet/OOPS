# Modular seams run, 2026-10-16

You are the single Codex writer for this lane. Weibao asked: "make a codex run
to fix accordingly and create rules accordingly". The rules exist; your job is
the fix.

## Where you work

- Worktree: `/Users/weiwei/.codex/worktrees/modular-seams/yet-another-idle-rpg`
- Branch: `codex/modular-seams`, cut from `codex/gameplay-foundations`.
- Work only in this worktree. Do not edit, stage, stash or reset anything in the
  shared checkout `/Users/weiwei/code/yet-another-idle-rpg`. It holds other
  sessions' uncommitted work (including continuation source in `main.js`,
  `display.js`, `save_files.js` and untracked `src/continuation_*.js`). That
  work is not on your base; do not copy it in. Note in the checkpoint which of
  your changes will need reconciling with it at merge time.
- Commit on your branch at the end of each round. Never add a `Co-Authored-By`
  trailer. Do not push. Do not merge into `codex/gameplay-foundations`; the
  merge back is Weibao's or the coordinator's call.
- At the start of each round, `git merge codex/gameplay-foundations` into your
  branch so you track the hot files. Resolve conflicts preserving their behavior.
- `node_modules` is a symlink to the shared checkout's; do not run `npm install`
  there. Use your own port for any preview server (19460–19469), never 8123,
  and stop servers by PID or port, never `pkill -f`.

## Read first

1. `AGENTS.md`, `PROJECT.md` summary (top sections only).
2. `docs/ARCHITECTURE_RULES.md` (AR1–AR16). This is your contract.
3. `docs/reviews/MODULARITY_AND_REWRITE_ASSESSMENT_2026-10-16.md` (context).
4. For M3 only: `docs/CRAFTING_ENGINE.md` (Open gates), `docs/UI_RULES.md`,
   `docs/MAKING_RULES.md`.
Sealed secrets rules in AGENTS.md apply. Keep user saves untouched.

## Rounds

Run them in order. Each round ends with its gate passed and a commit, or with a
recorded stop. If one round's gate fails twice after real fixes, record why in
the checkpoint and stop the run.

### M1. Break the display/main cycle and add the architecture check (structural only)

- Move the helpers `display.js` imports from `main.js` (`translate` and the rest
  of that import list) into a leaf module, and update importers. Then look for
  any other module that imports `main.js`; move those helpers too where it is
  mechanical. Anything not mechanical goes on the baseline.
- Add `scripts/check_architecture.mjs` and an npm script `check:arch`. It builds
  the static relative-import graph of `src`, fails on any import cycle or any
  import of `src/main.js` not in `scripts/architecture_baseline.json`, and
  prints line counts of `main.js`, `display.js` and `save_files.js` against the
  baseline (report growth; do not fail on it yet). The baseline must only shrink.
- No gameplay change (AR9). Gate: `npm run build`, `npm test`, `npm run check:arch`,
  and a Playwright scenario on the rebuilt bundle from a fresh origin at
  1366×768: new game, a few actions, Save, reload, Export, literal Import, no
  console errors. Run the same scenario on the pre-change build and compare the
  resulting save JSON (ignore timestamps). Keep the scenario script; M2 reuses it.

### M2. Domain registry with two existing domains migrated (structural only)

- Add `src/domain_registry.js` per AR2–AR4 and AR6: `registerDomain({id, deps,
  initialState, save, validate, migrate, load, tick, commands, projection,
  panels})`, every part optional. `main.js` and `save_files.js` iterate the
  registry for create_save, load, envelope validation and ticks, keeping the
  existing validation order. Panels keep registering through `definePanel`.
  Inject narrow operations; no omnibus context; no new timer or save writer.
- Migrate two existing domains with different shapes. Harvest is the suggested
  first (it has `validateHarvestEnvelope` in `save_files.js` and `tickHarvest`
  in `main.js`). Pick a second with a different lifecycle, for example one with
  a panel or commands. Move their wiring out of `main.js`/`save_files.js` into
  registrations. Save keys and JSON shape stay byte-compatible.
- Gate: everything from M1, plus the before/after save comparison on a save that
  exercises both migrated domains, plus loading an old save without those keys
  (old-save compatibility). Report how many lines left `main.js` and `save_files.js`.

### M3. Crafting as the first new consumer (gameplay)

- Close the crafting engine's GR12 open gate through the registry, not through
  new hand-wiring in `main.js`: a `crafting` save slice (create/load/validate),
  product key resolution for native items, a carrier item template, effect on
  use saved and restored, one harvest action at one Village location keyed by
  the game clock, and one UI home that follows UI_RULES (declare the surface
  type, tokens, own node, shared center controller with bottom back bar and Esc).
  Follow MAKING_RULES for knowledge versus truth. Reuse `craft_resolver.js`,
  `craft_state.js`, `craft_product_registry.js` and `crafting_detail.js`.
- AR1 check: count lines this round added to `main.js`, `display.js` and
  `save_files.js`. Target at most one registration line each; explain any excess.
- Gate: build, test, `check:arch`, and a Playwright journey on the rebuilt bundle
  from a fresh origin at 1366×768: harvest → stored material → craft → useful
  output used → Save → reload → Export → literal Import, with state intact;
  plus an old save with no `crafting` key loading untouched. Save screenshots
  of the UI home in `evidence/` of this dispatch folder (in your worktree).

### M4, only if M3 passed with budget left: second case (AR11)

Add a second, materially different product or resource through the same seam.
Record whether it needed any core-owner edit. If it did, say what the seam lacked.

## Record keeping

- Keep `docs/gm/dispatch/modular-seams-2026-10-16/CHECKPOINT.md` in your worktree
  current after each round: status, commit, gate evidence, lines moved, baseline
  counts, reconciliation notes and open items. Put round reports beside it as
  `M1_REPORT.md` etc.
- Label anything not exercised in a rebuilt browser as implemented-unverified.
- If you find a rule in `docs/ARCHITECTURE_RULES.md` that is wrong or
  unworkable, do not silently ignore it: note it under "Rule feedback" in the
  checkpoint with evidence.

## Out of scope

Migrating every domain, merging the old unmerged branches, UI redesign beyond
the M3 crafting home, mobile layouts, TypeScript/framework changes, NPC-heavy
work, and editing `docs/USER_VISION.md` or `PROJECT.md`.

## Final message

End with: rounds completed, commits, gate results with commands run, lines moved
out of the core files, AR1 line counts for M3, what is unverified, merge
reconciliation notes, and rule feedback.
