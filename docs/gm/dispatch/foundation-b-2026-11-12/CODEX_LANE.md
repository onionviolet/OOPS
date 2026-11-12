# Codex lane brief · B ledger evidence pass

*For chat B (brewing and chemistry) in the [procedural foundation plan](../../../PROCEDURAL_FOUNDATION_PLAN.md#coverage-ledgers-cv). The coordinator launches it; chat B reviews the diff before anything is committed to B's branch. Proposal under AD56; nothing here changes accepted direction. Rule codes: CV1-CV4, PFP25, GL7, SKR1, SKR3, SKR7, SKR18, SKR21, AU13, AD56.*

## Goal

Turn B's three title-classified coverage ledgers into evidence-checked ones. Today every Hogwarts row was classified from its title, novel hits and linked observations only (marked `title-classified (inference)` in its note). Check each row against its source, correct the state where the evidence says otherwise, record which medium each Hogwarts entry comes from, and add the named Lord of the Mysteries potions that sit outside the pathway table. Done means every row has been looked at against a source and every change carries its evidence.

## Start

- Work in your own worktree off branch `claude/fdn-b-brewing-afd93a` at its latest commit. Never merge to master, push, stash, reset or force. Commit inside your worktree only; chat B reviews and takes the commits.
- Read first: `docs/coverage/README.md` (row format and states), `scripts/b_coverage_ledgers.mjs` (how rows are built, the family rules and `OVERRIDES`), and the "MS1 · Coverage ledgers" section of `docs/gm/dispatch/foundation-b-2026-11-12/CHECKPOINT.md` (the blocker table and its owners).

## Files you may touch

| Path | What |
| --- | --- |
| `docs/coverage/b_overrides.json` | **The only hand-edited file.** Patches by row id plus `lotm_extra` rows; each needs `evidence` |
| `docs/coverage/hp_potions.jsonl`, `hp_ingredients.jsonl`, `lotm_potions.jsonl` | Regenerated only, by `node scripts/b_coverage_ledgers.mjs`. Never edit by hand |
| `docs/gm/dispatch/foundation-b-2026-11-12/CODEX_RETURN.md` | Your return (new file) |

Do not touch `scripts/`, `src/`, `tests/`, other chats' ledgers, `docs/coverage/README.md` or any other doc. If the script cannot express a correction you need (a new state family, a new field), stop and write it in the return as a request instead.

## Sources (read only)

| Source | Path | Use |
| --- | --- | --- |
| Hogwarts evidence catalogue and observations | `docs/research/hogwarts-potion-evidence-2026-11-11/` (`catalogue.jsonl`, `observations.jsonl`, `aliases.jsonl`, `README.md`) | Row identity, novel locators, observation ids |
| Harry Potter wiki inventory | `/Users/weiwei/code/yet-another-idle-rpg/docs/research/power-systems/wiki-digests/full-dumps/harrypotter_SOURCES.json` (41 MB; load once, look up by title and revision) | Each entry's medium and what it does |
| LOTM pathway potion table | `docs/gm/dispatch/potion-pathways-2026-10-24/PATHWAY_POTION_TABLE.md` | The 220 Sequence rows |
| LOTM census | `/Users/weiwei/code/yet-another-idle-rpg/docs/research/novels/lord-of-mysteries/census-2026-10-19/LOTM_CENSUS.jsonl` (466 rows) and its report | Named potions outside the pathways; formula rows the table may have missed |

Private paths stay private: cite them by path and row or page id, and copy no raw text (SKR18). Paraphrase only, and never more than 15 consecutive words of any source in any file. Lord of the Mysteries canon is open in development; a changed or randomized truth goes by ID. Wiki, novel and game layers stay separate (SKR3).

## Work, in three shards (commit after each)

1. **Hogwarts potions (316 rows).** For each row, look up its wiki revision. Record the medium in the patch's `layer` (`novel`, `official-supplement`, `companion-book`, `film`, `game:<name>`, `other`). Where the evidence shows the title rule chose the wrong state, patch it: a real potion marked `not-a-thing`, a topic marked as a potion, or a wrong `blocked:<rule>` family. Give each of the 48 `blocked:effect-sentence` rows the family its described effect belongs to, using the families already in the script (`body-door`, `mind-state`, `body-form`, `plant-or-creature-target`, `conceal-or-sense`, `object-surface`, `place-release`, `protection-field`, `luck-field`). Keep `effect-sentence` only where the sources say nothing about the effect. Do not set any `runs-*` state; only B decides what runs.
2. **Hogwarts ingredients (409 rows).** Record `layer` the same way. Correct `not-a-thing` calls in both directions (foods and household goods used in brewing are real materials). Leave the state `blocked:ingredient-properties` on real materials; in the note, name the property the evidence supports (for example "a soporific in the Draught of Living Death, HPPE0xx") without inventing numbers.
3. **LOTM potions.** Add `lotm_extra` rows for every named potion in the census that is not a pathway Sequence row: id `lotm.potion.extra_<slug>`, `source` (census row id plus locator), `state` (`blocked:<rule>` with the missing rule, usually `body-door` or `formula-in-notes`), and `note` (one paraphrased line on what it is). For any pathway row marked `blocked:formula-in-notes` where the census holds a main material, patch the note to say so and cite the census row. Leave the state for B to change.

## Focused checks (run before each commit)

```bash
node scripts/b_coverage_ledgers.mjs
```

```bash
node scripts/b_coverage_ledgers.mjs --check
```

```bash
node --test tests/b_coverage_ledgers.test.js
```

```bash
node scripts/coverage_report.mjs --check
```

The last command also reports other chats' ledgers; only B's three (`hp_potions`, `hp_ingredients`, `lotm_potions`) must show zero problems. Do not run the full `npm test`.

## Return (`CODEX_RETURN.md`)

- Counts before and after per ledger (states, runs share, not-a-thing), from `node scripts/b_coverage_ledgers.mjs`.
- The number of patches per shard, and the medium breakdown per Hogwarts ledger.
- Every call you were unsure of, with its id and why (at most 40 lines; rank by how much it changes a count).
- Requests: any state family or field the script could not express.
- Commands run, with results.

## Done check

- All three shards committed in your worktree.
- The four checks above pass, with zero problems in B's three ledgers and zero `unclassified` rows.
- Every patch and `lotm_extra` row carries `evidence`.
- No file other than the three listed in "Files you may touch" changed (`git diff --stat` against the starting commit).
- No source passage longer than 15 words appears anywhere.

## Budget and stop

Bulk lookup and classification: a mid-tier model with medium effort is enough (AU13). Stop at the usage ceiling the coordinator sets, or at the done check, whichever comes first. If you stop early, commit the finished shards and say in the return which shard is incomplete.
