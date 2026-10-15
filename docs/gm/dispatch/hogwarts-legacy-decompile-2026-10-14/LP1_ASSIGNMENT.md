# LP1 playable slice: a lesson grants a method, a known task checks it

Dispatched 2026-10-14 by Claude Code. Weibao: "Commit the research folder,
then send out Codex to implement LP1 (lesson grants a verb, one
environmental task checks it) as a playable slice." This authorizes
implementing LP1 as a labelled, reversible PROPOSAL. Weibao accepts taste
later by playing it.

## Paths

- Your worktree: `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/hl-lp1`,
  branch `codex/hl-lp1`, base `8856718d`. Write only there. `node_modules`
  is a symlink to the main checkout; don't install packages.
- Main checkout `/Users/weiwei/code/yet-another-idle-rpg` is dirty with
  other agents' work and many Codex runs are live. Never edit it.
- Report: `docs/research/hogwarts-legacy/LP1_REPORT.md` inside your
  worktree (committed on your branch).
- Browser port: **8197** only. Serve with
  `python3 -m http.server 8197 --bind 127.0.0.1` from your worktree.
  Playwright: `require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')`.
  Example harness: `docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/browser.cjs`
  (note its Node 22 fetch workaround).

## Read first

AGENTS.md, PROJECT.md, the standing UI priority in docs/USER_VISION.md,
then the owners for this slice:
- `docs/research/hogwarts-legacy/REPORT.md` (H1, LP1) and
  `IMPLEMENTATION_PACKETS.md`; `SPELL_AND_LESSON_DIGEST.md` for the
  reference shape (lesson → spell unlock → object checks the actual tool).
- `docs/research/hogwarts-games/IMPLEMENTATION_PACKETS.md` P1: player path,
  seams and acceptance. LP1 extends P1; it is not a competing owner.
- `docs/worlds/harry-potter/WORLD_BRIEF.md` and `SOURCE_LEDGER.md` for
  tone only. There is no Hogwarts world in `src/` yet.
- Existing seams to reuse, not duplicate: `src/techniques.js`,
  `src/known_routes.js`, `src/field_workshop.js`,
  `src/audited_workshop_lesson.js` (an existing teacher/lesson pattern
  with Eda in Village) and whatever teaching, knowledge-provenance and
  task code you find. Grep before adding a new module.

## What to build (smallest playable result)

In the current playable world (not a new world or prestige layer), add one
**original** lesson. Not a canon spell, no Legacy names, assets or text.

1. **Before:** the player can already see one known physical task (an
   existing obstructed or difficult field task, or one small new one placed
   where the player already goes). Without the method it is either
   impossible, or possible only by a slower or costlier route.
2. **Lesson:** a willing teacher who is present demonstrates the method,
   the player understands a rule, then does a short untimed practice that
   costs real time or support. Acquisition records its teaching provenance
   (who taught it, where, when), not "observed from enemy".
3. **After:** the same task offers a different useful solution that checks
   the learned method AND the actual body/tool at the moment of use. If the
   body or tool is unsupported, it fails with a stated reason the player
   can act on.
4. **Idle use:** a routine repeat of the method can queue while idle, so
   the lesson keeps paying off.
5. Show what is missing (lesson not learned, tool absent, body unfit)
   without revealing hidden destinations or a total list of secret tasks.

Per-world numbers are authored for this world. Legacy values are reference
only. No fixed "once" limits beyond save safety; the lesson itself is
learned once, but using it repeats.

## Gates

1. `npm run build`, focused tests for the new behavior, full `npm test`
   (report the count; name pre-existing failures, don't fix unrelated ones).
2. Fresh-origin desktop browser run at **1366x768** (also 1440x900 if
   cheap): compare the same task before and after the lesson, actually
   spend the time/support, get the changed result; show the
   unsupported body/tool failure and its reason; queue one idle repeat.
   Save screenshots to `docs/research/hogwarts-legacy/lp1-evidence/`.
3. Persistence: new state optional and absent from old saves; old saves
   load unchanged. Save, reload, Export and literal Import keep the learned
   method and pending practice with no duplicate gains or rewards. Record
   the compatibility decision.
4. Anything not exercised is **implemented-unverified** in the report.
5. Mobile layout is deferred; don't spend time there.

## Rules

- Adapt to current code. Commit on `codex/hl-lp1` in small plain commits.
  No `Co-Authored-By` trailer. No push, no merge into
  `codex/gameplay-foundations`. Don't commit rebuilt `dist/` unless the
  repo's convention for slices requires it; note the bundle hash you tested.
- Sealed secrets (AGENTS.md) apply to reports and commit messages.
- Stop and record a blocker rather than guessing on save formats or a
  conflict with USER_VISION.md.

## Report (LP1_REPORT.md)

Short plain-language summary first: what the player now does, step by step,
with the exact UI path to try it. Then: files changed, checks with exact
results, the compatibility decision, implemented-unverified items, merge
risks against `codex/gameplay-foundations` HEAD, and the one remaining gate
(Weibao's play and taste). Plain English, no em dashes.
