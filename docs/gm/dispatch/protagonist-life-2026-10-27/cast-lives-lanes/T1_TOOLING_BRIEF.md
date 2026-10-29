# Lane brief: T1, lean pipeline disk use and a reusable floor with budgets (SZ5, CL278, LSD146, LSD147)

Model: `gpt-6-luna`, medium. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg` beside B1 review and its
runtime follow-ups. This lane touches **no `src/` file**. Card: [CAST_LIVES_CARD](../CAST_LIVES_CARD.md); handoff
SZ5, CO3, LSD146-LSD147. Rules: AD36, AD43, AD45, `.claude/rules/research-and-agents.md`. CLR codes applied: CLR2,
CLR3, CLR12.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| `schema_union.mjs` copies the whole input folder per run (bytes written for one LOTM run) | ~400 MB | | yes |
| Existing floor script to start from: `/private/tmp/claude-501/-Users-weiwei-code-yet-another-idle-rpg/f33d10f0-e129-40d6-ae61-5cfdbbbf37ce/scratchpad/g1_floor.cjs` | 1 | | yes |
| Playwright helpers in `scripts/ui_helpers.cjs` (`launchChrome`) | 1 | | yes |

## Scope and seam

- **Part A, SZ5.** `scripts/lead_run/schema_union.mjs` and `world_lead_pipeline.mjs`: write only the files the
  union changes; link (symlink, or a path list passed to `merge_shards` via its existing `--match`/input options)
  the untouched ones instead of copying. Output stays outside the private tree. Done when a LOTM v1 run writes under
  50 MB of new files and its merged outputs are byte-identical to `/tmp/m1-lotm-final4/merged` (`cmp` each file).
- **Part B, CL278 floor.** New `scripts/floor/run_floor.cjs`: parametrized headless floor run (book world, start
  profile, viewport default 1920×1080, a fresh origin, `BUILD_OUT` folder). It builds or reuses a named build, starts a
  fresh life, pauses with `simulationTestHooks.pause/resume` around clicks (`:visible` selectors; the panel
  rebuilds each game minute), takes screenshots to a given private folder, and does save, reload, Export and
  Import with a state comparison that excludes the natural clock. Headless only (background-only windows).
- **Part C, LSD147 budgets.** The floor writes a JSON receipt with: bundle hash, ms per game minute (natural play,
  60 minutes), wait time for a 349-minute wait, save size in bytes after the run, and pack load ms. Optional
  `--budget budgets.json` turns any over-budget number into a failure naming it. Ship a
  `scripts/floor/budgets.example.json` with today's measured numbers as the first values (record them; no invented
  targets except the 3 s wait target already set in CO3).
- **Files owned.** `scripts/lead_run/schema_union.mjs`, `scripts/lead_run/world_lead_pipeline.mjs`,
  `tests/schema_union.test.js`, `tests/world_lead_pipeline.test.js`, new `scripts/floor/`, a new focused
  `tests/floor_budget.test.js` (budget comparison logic only, synthetic), checkpoint `cast-lives-lanes/T1_CHECKPOINT.md`.
- **Publication class (CLR3).** Scripts and tests public and name-free; screenshots and receipts from book packs
  go to private folders or `/tmp`.
- **Known limits (AD45).** The checkpoint names what stays simple (for example one world per run) and the refactor
  it expects.

## Work and done check

- `node --test tests/schema_union.test.js tests/world_lead_pipeline.test.js tests/floor_budget.test.js`.
- Part A: the LOTM run, bytes written, and `cmp` results. Part B and C: one real floor run on the LOTM beside start
  (`lotm.early_tingen.*`, the existing start) from a fresh build into `/tmp/t1-floor`, with the receipt numbers
  in the checkpoint. `node scripts/lane_review.mjs` with grants and explicit paths.
- **Stop conditions.** `merge_shards` cannot read a mixed linked/written folder without editing it: write
  `T1_INTEGRATION.patch` and keep copying for those files only.

Do not commit. Keep canon names and source text out of tracked files.
