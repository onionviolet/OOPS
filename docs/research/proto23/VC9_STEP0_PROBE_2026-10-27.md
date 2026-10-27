# VC9 step 0: Proto23 probe (2026-10-27)

Research only. Plan owner: [GM_PLAN section 7 (VC9), section 18 row 7](../../gm/dispatch/village-loop-2026-10-27/GM_PLAN.md); master plan WV3-WV9. Rules applied: WA (world-audit/pass rules, evidence kept apart from claims), AD36 (focused checks only, one line per check), AD38 (mechanisms, not allowed lists), AR13 (one registration line per feature). No sealed secret is named or needed.

## Checks run

| Check | Result |
|---|---|
| `shasum -a 256` of `private/tags-titles-2026-10-15/index.e93a8cd.html` | `a43e55e2…55d5`, matches the pinned SHA; 14,768 lines |
| Read [probe JSON](SOURCE_MECHANISM_PROBES_2026-10-13.json) and `probe_source_mechanisms.mjs` | Four recorded cases; script reads the pinned file only |
| Read pinned `Skill`, `giveSkExp`, `giveTitle`, one milestone table (lines 1691-1712, 13747-13768) | Done |
| Re-ran the probe | **Not run** (recorded output from 2026-10-13 is cited, unverified today) |
| Ran the probe cases against our engine | **Not done**: that is step 0b below; our engine's reveal path was not read beyond file names |
| Browser or MCP play of anything | **Not done**, unverified |

## F1: the plan's `skillReveal` expectation is wrong

VC9's matched probe says "`skillReveal` (tab visible at level 1 after 1 XP) matches". The recorded probe says otherwise: after **1 XP** the skill is level 0, not in `you.skls`, and the tab still reads `???????`. Only after a further 50 XP (default first threshold 51: `expnext = round(50 + (lvl+1)^ln(9·lvl+1))`) does it reach level 1, push into `you.skls`, show "New Skill Unlocked!" and reveal the tab. The 2026-10-13 mechanism report (F4) already corrected this. The plan's probe line, the GM_PLAN section 7 "done" text and its done-check should read "visible at level 1 after the first threshold (51 XP), not at 1 XP". This is a doc fix for the plan owner (village-gm/village-loop), not made here.

## F2: WD5 names a branch that does not exist

`proto23-port/2026-10-27` is planned, not created. `git branch -a` lists no proto23 branch locally or on remotes. WD5 and VC9 should say "to be created from fresh HEAD in its own worktree (AD41)". Nothing was created in this probe.

## Mechanisms the pack would port

Source line numbers refer to the pinned HTML.

| # | Mechanism | Source | Needs from our engine | Port as code or re-implement |
|---|---|---|---|---|
| M1 | Skill XP with level-up reveal, milestone perks, skill multiplier `p` | `Skill` 1691, `giveSkExp` 13747 | A skill record with level, XP, next-threshold function, a "revealed" flag that hides the tab, and milestone hooks. Our `skill_*` modules, `skill_records.js` and `skill_expansion_host.js` exist; whether they hide a tab until level 1 is **unverified** | **Re-implement** from the formula as pack data (threshold curve, milestone list `{lv, effect, text}`). The function is global-state code (`you`, `global`, `dom`, `msg`); copying it drags in all four |
| M2 | Overflow carry | `giveSkExp` recursion | Excess XP carries into the next level once | **Re-implement fixed** (source bug: `onGive` fires with 9 then 60, total 69 for an award of 60). Listed deviation (WV6). Our `skill_overflow_domain.js` is a different feature (frontier bank); do not reuse it by name |
| M3 | Milestone perks with a message ("NEW PERK UNLOCKED") | `mlstn` tables, e.g. Fighting lv 2/5/8/10/11 | Effect hooks onto player stats (EXP gain, STR, energy effectiveness, mastery gains) and titles | **Data port, re-implemented effects.** Each perk is a mechanism on our stats, not a pasted closure (AD38) |
| M4 | Dojo ladder (training area, lobby, courses, gear turn-in) | `chss.t1.sl` 11533, `chss.t3.sl` 11589 and nearby | Instant hub screens, a quest/course owner, titles ("Dojo disciple"), item turn-in | **Re-implement** on our location/quest owners. Data (names, text, course steps) is ported with NOTICE. Not read in full here, unverified |
| M5 | Crafting with extra tool requirements | `make` 8883, `_fcraft` 10727 | Recipe with a requirement list and a preview that agrees with execution | **Re-implement fixed**: the source preview/counter disagree (missing second tool gives no output yet counter becomes 1). Listed deviation |
| M6 | Random option selection | `Math.random` used about 60 times | A seeded RNG owner | **Re-implement**: the recorded 2500/5000/2500 split for three options is biased. Fix in the shared engine (WV6) |
| M7 | Food energy, gear durability, one-monster combat, weekly meal, seasonal weather | Source audit F1-F9 | Not examined in this probe | Out of the first slice; unverified |

Nothing above is a "copy the function" candidate. The pinned file is global-state code and the plan's own AR rules (WV3, WV9) push toward pack data plus shared-engine seams. Code that could be lifted nearly as written: pure formulas (the `expnext` curve, milestone tables) and text.

## What the pack needs that we already have

- A pure pack loader and registry: `src/world_pack_registry.js` (`BUNDLED_WORLD_PACKS`), `world_pack_loader.js`, `world_pack_manifest.js`, `world_pack_save.js`; packs live in `src/world_packs/`. One registration line per pack (AR13).
- A pack fingerprint in the projection (`worldPackFingerprint`) for WV8.
- An existing, separate `src/proto23_world_*.js` branch (save key `proto23Village`). Per GM_PLAN section 5 it stays; the faithful pack must not collide with it. Whether a start surface can host a third world is unverified.

## Licence and credit gaps

1. Proto23 (`23html/23html.github.io`) has no licence file at the pinned revision (per the plan and WV4; I did not re-fetch the repository). Rights stay with the author. Only a licence or permission changes that; the ask is Weibao's outward step (WD5).
2. The repository `LICENSE` is Miktaew's MIT for the upstream game and covers upstream-derived code only. Whether Proto23 itself derives from an MIT project is **unverified**; if it does, that lineage would help attribution but would not license Proto23's own additions.
3. Needed regardless: a NOTICE in the pack's folder naming repository, revision `e93a8cd6…` and SHA256; a credits-page entry (PW6, moving Proto23 from "inspiration" to "source used"); ported files isolated so one commit removes them; no push of derived files without Weibao's yes. `origin` is public (`onionviolet/OOPS`), so an unpushed branch is the real mitigation.
4. Gap: the existing `proto23_world_*` files and docs are "inspiration" credits. Their credit wording should be revisited when the NOTICE lands. Not changed here.

## Recommended first slice

**VC9-0 (about half a day, Sonnet low), no pack yet.**

1. Re-run `node docs/research/proto23/probe_source_mechanisms.mjs <pinned file>` once; record SHA and output in the task record.
2. Write a focused test, `tests/proto23_skill_reveal.test.js`, that feeds the four probe cases into **our** skill path and records, per case, "matches / differs / our engine has no equivalent". Expected from the probe: reveal at level 1 after 51 XP (not 1 XP), onGive total 60 rather than 69, the three-option split near 3333 each, and a craft with a missing second tool that never bumps the counter.
3. Record the result as one line per case in this file's addendum. Done check: four rows, each with a value from our engine beside the source value, and the plan's F1 line corrected by its owner.

**VC9-1 (pack, own lane and branch), after step 0:** `src/world_packs/proto23_pack.js` registering hub + Dojo first tier with the Skill XP, reveal and the first Fighting milestone (lv 2, +2% EXP gain) from M1/M3, with the deviations M2/M5/M6 fixed in the shared engine. Done check, per GM_PLAN section 7: fresh-start MCP walk through the first Dojo tier, Save/reload/Export/Import, Village saves byte-unchanged, NOTICE present, and rebuilt desktop evidence at 1920×1080 and 1536×864 (UI standing priority). Run the full `npm test` once as pre-commit gate (AD36). Create `proto23-port/2026-10-27` in its own worktree first (F2).

## Not verified

Our engine's reveal behaviour; any Dojo content beyond file locations; M7 mechanisms; whether the start surface can hold a third world; today's re-run of the probe; the licence status of the upstream repository today.
