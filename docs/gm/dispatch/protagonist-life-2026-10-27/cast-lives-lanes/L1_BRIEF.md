# L1 brief: merge, crosswalk and consumer-fitness report (paste into Codex)

Model: `gpt-6.1-sol`, medium effort (the collision review is judgment). Run **locally in
`/Users/weiwei/code/yet-another-idle-rpg`**, never in the cloud: the index data is gitignored.
Plan: [CAST_LIVES_PLAN_2026-10-28](../CAST_LIVES_PLAN_2026-10-28.md) sections 1, 2, 4 and 10.

## Goal

Give the cast import one stable id per entity and a measure of which rows a game consumer can use, for
LOTM volume 1 (chapters 1-24 first) and Mother of Learning (chapter 1 to the end of the first restart).

## Read first

`AGENTS.md`, `docs/GROUND_RULES.md`, `docs/research/BATCH_READING_WORKFLOW.md` (Merge and use),
`scripts/lead_run/merge_shards.mjs` header, `docs/gm/dispatch/protagonist-life-2026-10-27/SCHEMA_CARD_1_3.md`.

## Steps

1. **Rerun the LOTM volume-1 merge** into a new folder, leaving the existing `merged/` alone:
   `node scripts/lead_run/merge_shards.mjs docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27 --out <that dir>/merged-cast-2026-10-28 --match '<regex>'`.
   The regex takes the agent shards (`s2rm` to `w4s41m`) and the volume-1 batch waves (`b4s`-`b7s`
   prefixes), and excludes `lotm2c`-`lotm8c`, the `w3s33` A/B variants and `zw*`. Check
   `merge_report.json`: people and rules extras must be above 0 (the 2026-10-27 merge reports 0 although
   590 volume-1 people rows exist). If the extras still read 0, find why (prefix mapping in `loadShards`)
   and stop to report before editing `merge_shards.mjs`.
2. **Review `overlay_proposed.json`** for both books. Accept redirects where one person or place clearly
   has two ids (same Chinese name, same role). Reject on doubt. Rerun the merge with `--overlay`.
3. **Write `scripts/lead_run/build_crosswalk.mjs`**: input a merged dir and the runtime ids
   (`src/book_world_lotm_ids.js`, `src/book_world_mol_ids.js`, pack people definitions); output a private
   `crosswalk.json` mapping index id to runtime id, or to `new:<proposed id>`, or to `skip:<reason>`, for
   every person, place, organization and item **present or partial in lead scenes** inside the slice
   chapters. Free-text routine places map to a place id here (CL55).
4. **Consumer-fitness report** (CL57), printed by the same script with `--report`, counts only:
   relations with a resolvable `with`; routine slots with a place id and a time; `reacts` items whose
   `to` maps to an action class (keyword classifier, WA25 classes); scenes with an outcome and a place
   id; rules with `costStated`. Write the counts (no row text) into a checkpoint file
   `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/L1_CHECKPOINT.md`.

## Owned files

`scripts/lead_run/build_crosswalk.mjs`, `tests/lead_run_crosswalk.test.js`, `cast-lives-lanes/L1_CHECKPOINT.md`.
Private outputs under each book's `private/` folder only. Do not edit `merge_shards.mjs` or
`batch_lib.mjs` (owned by the batch-reading session) without stopping to report.

## Rules

WA22-WA24, WA43, AR1-AR16 (tooling only, no `src/` change), AD36. Committed files carry ids, counts and
locators only; never source text. Sealed truths by id only. Shared checkout: commit only your own paths
from a fresh HEAD, no stash, reset, force or push, no `Co-Authored-By` trailer.

## Done check

- `node --test tests/lead_run_crosswalk.test.js` passes (fixture rows, not private data).
- LOTM merge report shows people and rules extras above 0.
- Every person, place and organization present in LOTM chapters 1-24 lead scenes has a crosswalk row.
- The checkpoint lists the fitness counts for both books and one line per check (command, result, gaps).
- `npm run check:rules` passes. Full `npm test` runs once before the commit.

## Stop and report if

The merge needs a code change, a collision is ambiguous on more than ten ids, or any step would need a
paid call.
