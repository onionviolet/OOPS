# World core kit audit playbook (repeatable, 2026-10-14)

Weibao asked on 2026-10-14 to "save this core auditing for long term
repeating". This playbook turns the first run (rounds 1-7, lanes W1-W20) into
a method any later session can rerun. It is registered as a core audit in
[WORLD_CORE_KIT_CORE_AUDIT](../audits/WORLD_CORE_KIT_CORE_AUDIT.md) (triggers
and run log) under the general topic expansion audit method; the project
skill `topic-expansion-audit` routes there.

What it audits: how close each world is to playing in depth, measured
against the [world core kit](WORLD_CORE_KIT_2026-10-14.md) (K1-K34, KM, KV,
KT, KK, KC, KS, KQ, KP, KD, CL, AX and the rest), and what to consider next.
It produces proposals and readiness evidence, never accepted decisions.

## When to rerun

| Code | Trigger | Run shape |
|---|---|---|
| WT1 | A world joins the canon-first tier or a new world folder appears | Full run for that world: readiness card plus lanes for its weakest K groups |
| WT2 | An implementation wave lands for a world | Readiness-only delta: recheck that world's card against code |
| WT3 | Weibao asks "more to consider / other stuff / subtle / implementation / abstraction" on the kit | One palette round plus 2-3 lanes on the new angles |
| WT4 | Core foundations change (capability merge, tags, randomness, saves) | Recheck AX rows and K3/K18 floors across all worlds |
| WT5 | Monthly, or when 10+ new design docs have landed since the last run | Readiness delta for all priority worlds plus consolidation |
| WT6 | A new medium or genre is proposed (comics were round 6) | Genre round: what the kit bends, starts, cheats, abstractions |

A rerun extends the existing kit and cards. It does not restart the codes.

## Inputs to read first

1. `AGENTS.md`, `PROJECT.md` standing priorities, `docs/USER_VISION.md`
   (canon-first world order, desktop-first UI, food direction).
2. The kit root [WORLD_CORE_KIT_2026-10-14.md](WORLD_CORE_KIT_2026-10-14.md)
   (or its successor) and this playbook's "Lessons" section.
3. Last run's cards in `docs/worlds/world-core-kit-<date>/cards/` and its
   dispatch `SESSIONS.md`, to know what changed since.
4. [Completion standard](../WORLD_COMPLETION_STANDARD.md) S00-S14,
   [full-world method](world-depth-2026-10-13/10_FULL_WORLD_METHOD.md),
   [required features](world-depth-2026-10-13/07_REQUIRED_FEATURES_AND_ENGINE.md),
   [deeper synthesis](world-depth-2026-10-13/23_DEEPER_SYNTHESIS.md) UP rows.
5. [Core foundations scorecard](../CORE_FOUNDATIONS_SCORECARD_2026-10-14.md)
   (or newer) for what the shared engine really has.
6. Live ownership: running Codex processes (`ps`), Foundation checkpoints,
   other dispatch folders dated today.

## The loop

Each run is one or more rounds of this loop.

| Step | What | Who | Output |
|---|---|---|---|
| L1 Palette round | Write the new angles in the root, coded, Default + Dial, with ranked suggestions and a lane table | Claude (root owner) | Root section "Round N" |
| L2 Lanes | Launch 2-6 docs-only Codex lanes, one owned file each | `tools/core_kit_audit/new_lane.py` + launcher | Lane files under `world-core-kit-<date>/` |
| L3 Returns | Read finished reports; fold short F rows into the root; correct root claims lanes disproved | Claude | Root "Lane returns" rows |
| L4 Consolidation | One lane merges lane rows into one card per world with a contradiction register (MG1-MG6) | Codex W19-style lane, after lanes finish | `cards/<world>.md`, `cards/README.md` grid |
| L5 Owner updates | Route findings to real owners through their writers (RF17, WORLD_BRIEFs, LM4 owner) | Owning sessions | Owner edits, not kit edits |
| L6 Record and commit | USER_VISION request line; commit kit paths only | Claude, under standing or current authorization | One commit per round |

Rounds can overlap: L1 of round N+1 may run while round N lanes are still
out. L4 waits until the lanes it merges have finished.

## Lane catalog (reusable)

Reuse these shapes instead of inventing new lanes. Copy the prompt from the
first run's dispatch folder and change the date, world list and parts.

| Lane | Covers | First-run prompt |
|---|---|---|
| Readiness | All K parts per world, floor met/partial/missing with pointers, top three gaps | [W1](../gm/dispatch/world-core-kit-2026-10-14/W1.md) |
| Rules and power | K2 laws, K3 power core, K10 combat grammar | [W2](../gm/dispatch/world-core-kit-2026-10-14/W2.md) |
| People and life | K6 cast, K7 institutions, K8 daily life | [W3](../gm/dispatch/world-core-kit-2026-10-14/W3.md) |
| Places and look | K5, K9, K13 signature loop, K14 presentation | [W4](../gm/dispatch/world-core-kit-2026-10-14/W4.md) |
| Story and crossing | K11, K12, K15, K16 | [W5](../gm/dispatch/world-core-kit-2026-10-14/W5.md) |
| Engine and template | Shared seams per K, data shape, template | [W6](../gm/dispatch/world-core-kit-2026-10-14/W6.md) |
| Micro by world | KM tables, source-checked | [W7](../gm/dispatch/world-core-kit-2026-10-14/W7.md) |
| Lived layer | K19-K24 | [W8](../gm/dispatch/world-core-kit-2026-10-14/W8.md) |
| First-day stress test | Walk a starter's first day through the kit; list gaps | [W9](../gm/dispatch/world-core-kit-2026-10-14/W9.md) |
| References | Games and books known for the angle being audited | [W10](../gm/dispatch/world-core-kit-2026-10-14/W10.md) |
| Micro in motion | KV, KT, KK, KC with save impact | [W11](../gm/dispatch/world-core-kit-2026-10-14/W11.md) |
| Signals and ripples | KS, KQ, K29, K32 | [W12](../gm/dispatch/world-core-kit-2026-10-14/W12.md) |
| Perception engine | KP, KR, KD with seams | [W13](../gm/dispatch/world-core-kit-2026-10-14/W13.md) |
| Implementation specs | Files, owners, save decisions, tests for chosen IO steps | [W14](../gm/dispatch/world-core-kit-2026-10-14/W14.md) |
| Schema across worlds | One shared schema expressed per world (power core in run 1) | [W15](../gm/dispatch/world-core-kit-2026-10-14/W15.md) |
| Genre through the kit | A medium or genre (comics in run 1) | [W16](../gm/dispatch/world-core-kit-2026-10-14/W16.md) |
| Cheats that reveal | Lens cheats for the layers audited | [W17](../gm/dispatch/world-core-kit-2026-10-14/W17.md) |
| Abstraction map | AX rows against code, interfaces, retire list | [W18](../gm/dispatch/world-core-kit-2026-10-14/W18.md) |
| Consolidation | Per-world cards, code renames, contradiction registers | [W19](../gm/dispatch/world-core-kit-2026-10-14/W19.md) |

Every lane prompt starts with "Read COMMON.md first" and names exactly the
files it owns. [COMMON](../gm/dispatch/world-core-kit-2026-10-14/COMMON.md)
holds the shared rules (docs only, evidence labels, sealed safety, no
either/or, no "once" limits, plain style, CHECKPOINT and report).

## Tools

In [tools/core_kit_audit/](tools/core_kit_audit/):

- `new_run.py <date>` creates `docs/gm/dispatch/world-core-kit-<date>/` with
  COMMON copied from the last run, `runs/launch.py` and an empty
  `SESSIONS.md`, plus `docs/worlds/world-core-kit-<date>/`.
- `new_lane.py <run-dir> <lane> "<title>" <owned-file> <task-file>` writes a
  lane prompt in the standard shape.
- `status.py <run-dir>` lists each lane as running, finished (report present,
  process gone) or stalled (no process, no report), with output sizes.
- `commit_list.py <run-dir>` prints the kit paths safe to commit: root,
  template, prompts, SESSIONS, launcher, and lane files whose report exists
  and whose process has exited. Use it with `git commit --pathspec-from-file`.
- Launch: `python3 runs/launch.py <lane> <lane>.md` from the dispatch folder
  (setsid double fork, logs gitignored). Resume:
  `python3 runs/launch.py <lane> <lane>.md <session id>`.

## Readiness scoring

- One card per world (TTKS split per book). Rows K1-K34 with D (docs) and R
  (runtime) columns: floor met, partial, missing, plus the pointer.
- Separate documented, source implemented, built, browser verified and
  director accepted. A doc row never promotes runtime status.
- Delta runs print what moved since the last cards, including regressions
  (KX41).
- The grid in `cards/README.md` is what Weibao sees: spoiler-safe, no sealed
  names, one line per world.

## Commit and push rules

- Commit only kit paths: root, playbook, template, tools, dispatch prompts,
  `runs/SESSIONS.md`, `runs/launch.py`, finished lane files and reports. Run
  logs are gitignored.
- Use `git commit --pathspec-from-file=<list>` so files other sessions have
  staged stay staged and out of the commit. For kit paragraphs inside shared
  owners, use `docs/audits/tools/commit_own_paragraphs.py`.
- Do not stage shared owner files (USER_VISION, IDEA_INDEX, PROJECT,
  WORLD_DEPTH index) when they carry other sessions' uncommitted edits; leave
  the kit lines for that file's committing session.
- No `Co-Authored-By` trailer. Push and master merge only on Weibao's
  explicit yes for that action.

## Lessons from the first run

| Code | Lesson | Fix in the method |
|---|---|---|
| LL1 | Lanes return asynchronously; the first check found none done | `status.py` before folding; fold whatever is finished each round |
| LL2 | Lane codes collided with root KX codes (F14) | Lane-local codes carry a lane prefix; consolidation renames |
| LL3 | Root claims can be wrong (K13.1 versus RF17, F9) | L3 corrects the root in place and records the correction |
| LL4 | Lanes duplicate context reading | Give later lanes the latest returns as named inputs; consolidation hands a digest |
| LL5 | Another session had staged files; a plain commit would take them | `--pathspec-from-file` only |
| LL6 | zsh does not split `$FILES`; a multi-line variable became one pathspec | Write the list to a file and use `--pathspec-from-file` |
| LL7 | Session ids printed by grep came out of file order | Read each lane's own log for its id (`grep -H`) |
| LL8 | 45+ other Codex runs were live | Cap a round at 2-6 lanes; check `ps` first |
| LL9 | The biggest gap (K3 power core) was fragmentation, not absence | Always join the readiness grid with the core foundations scorecard |
| LL10 | A parallel session audited the same core from another side | Search dispatch folders dated today before launching |

Add a row here whenever a run teaches something new.
