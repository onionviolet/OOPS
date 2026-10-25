# Mechanic absorption workflow (MAW), 2026-10-25

Weibao asked for "a future workflow for something like this" after the LOTM potion run
(2026-10-24 to 25): a question about one mechanic ("potion crafting requirements and more?")
grew through rounds of consideration, research lanes, a data gap fill and an implementation
design into two playable or tested slices. This file is the reusable version. It composes
existing owners and links them; it is not a new rulebook.

Use it when Weibao asks to consider, absorb or implement a mechanic from a source world or
from his own idea, and the answer needs both research and code. For a source-only deep dive
use the [source deep dive playbook](../research/SOURCE_DEEP_DIVE_PLAYBOOK.md); for a design
topic with Codex lanes use `topic-expansion-audit`.

Rules it applies: AD5, AD36, AD38, AD41, AR11 to AR16, MR1 to MR36, AU1 to AU15, WPR30 to
WPR32, sealed secrets ([rules index](../RULES_INDEX.md)). Example run:
[potion-pathways checkpoint](dispatch/potion-pathways-2026-10-24/CHECKPOINT.md),
[CRAFTING_ENGINE rounds 8 to 12](../CRAFTING_ENGINE.md#round-8-2026-10-24-potion-requirements-brewing-versus-drinking-and-orphaned-materials).

## Stage 0. Fit before you design

1. Open the [systems register](../SYSTEMS_REGISTER.md). Find the system that already does
   most of the job and the **degree** it supports (for example recipe slots: exact item, tag
   query or property threshold). Most "new" mechanics are a new degree or new data on an
   existing system.
2. Read the code that would host it, not only the docs. The potion run found that LOTM had
   no brewing verb, broker materials with no consumer, and a second potion engine, all from
   ten minutes of grep (round 8).
3. Find the owning palette (`docs/*_CONSIDERATIONS*`, `CRAFTING_ENGINE.md` and similar). Each
   round goes there, never in a new parallel doc.

## Stage 1. Consider in rounds (more-to-consider)

- Each "more to consider?" is a new round in the owner with ACT NOW, ACCOUNT FOR NOW and
  LATER/DELEGATE, new codes, never restarted (AGENTS.md design framing).
- Diff every candidate against earlier rounds before keeping it. Lead with what the code
  shows (SHOWN) before proposals.
- Say what was wrong in an earlier round before correcting it, in place, dated.

## Stage 2. Research lanes (notes first)

| Lane | Model | Output |
|---|---|---|
| Catalog of the whole space (all pathways, ranks, tiers) | Sonnet | One table file with evidence tags |
| Mechanics and edge rules (how brewing works, higher ranks) | Sonnet | One file, conflicts listed |
| Implementation design from real code | Sonnet (Opus only for a hard seam, with advisor first) | Data shape, verbs, save compatibility, slice order, risks |

All three run in parallel, read existing notes and code only, and write one file each in
the task's dispatch folder. Spot-check two or three cited facts before folding.

## Stage 3. Data gap fill (when data is thin)

Run [DGF1 to DGF10](../research/SOURCE_DEEP_DIVE_PLAYBOOK.md#data-gap-fill-workflow-dgf-2026-10-25):
keyword scan of the original-language text, Haiku shard extraction, the wiki's data modules,
a crosswalk, and recheck every conflict in the text. Bulk wiki or image downloads only on
Weibao's ask; raw data stays in the gitignored research folder or `private_packs/`.

## Stage 4. Build lanes (isolated worktrees)

- One lane per independent slice, each in its own worktree off master (Agent tool
  `isolation: "worktree"`), so builds and `dist/` never collide with other sessions.
- **Worktrees only see committed files.** Give lanes absolute paths to uncommitted design
  docs in the main checkout, and tell them to write notes inside their own worktree.
- Record each lane's owned files, branch and worktree path in the checkpoint before dispatch.
  New files beat edits; never touch files another session has uncommitted edits in.
- Every runtime brief carries:
  - a **golden snapshot** of existing command definitions taken before the change;
  - the **save validators** that would refuse a new state (exact fields, revision and source
    hashes, saved jobs equal to definitions), with a stop-and-report bound;
  - **conservation** of every consumed or minted item in the save envelope;
  - **old-save compatibility**: load a save made on master before the change;
  - **browser proof** on the rebuilt bundle from a fresh origin at 1920x1080 and the
    1536x864 floor at 14 and 21 px, with save, reload, Export and literal Import;
  - proposals labeled (prices, times, authored values), canon values cited.
- Lanes run focused tests only and never commit, merge or push.

## Stage 5. Coordinator verification

1. Rerun each lane's focused tests yourself.
2. Read the diff stat and the decision file; open one screenshot at the target size.
3. Read the browser result JSON, including the old-save run.
4. List open issues the lane reported; they stay with the slice.

## Stage 6. Integration (needs Weibao's yes to land)

1. Combine lanes in one clean worktree off current master; rebuild once.
2. Run the full gate once: `npm run build && npm test`, `npm run check:arch`,
   `npm run check:rules`, plus `check:rule-behavior` for rule changes (AD36).
3. Commit only with Weibao's yes, own paths only, no `Co-Authored-By`; push separately on
   his yes.

## Stage 7. Record

- Owner palette round, USER_VISION line quoting his words, checkpoint with lanes, checks and
  open issues. Systems register updated when a new system or degree lands.
- Playable result goes on the play queue with exact steps. It is implemented-unverified until
  he plays it.

## Lessons from the potion run

- Ask the advisor once before dispatching build lanes; it caught a dose-accounting rule
  that would have refused every brewed save.
- Haiku is enough for shard extraction; check its sequence labels (one was wrong).
- A wiki quantity next to another quantity is the likeliest error (X1).
- Blocked sites stay blocked; spoofed fetches are refused; logins are Weibao's route.

## Expansion backlog (keep growing this), 2026-10-25

Weibao: "make sure to keep in mind expanding on those and more, and also make the skill work
for codex". Every run of this workflow checks this list, does what its task touches, and adds
what it learned. Items are proposals with level, effort and done check.

| Code | Item | Level, effort | Done check |
|---|---|---|---|
| MAW-X1 | Codex parity: the skill at `~/.codex/skills/mechanic-absorption/SKILL.md` mirrors `.claude/skills/mechanic-absorption`; update both in the same change | Coordinator, minutes | Both skill files name the same stages and paths |
| MAW-X2 | Register drift check: a script lists exported functions of the modules the [systems register](../SYSTEMS_REGISTER.md) covers and flags ones the register does not mention; wire it into `check:rules` or a new `check:register` | Sonnet or Sol, small | Running it on master lists zero unexplained exports, or a reviewed allowlist |
| MAW-X3 | One importer template per world (TSW11): generalize `tools/build_lotm_ingredient_pack.mjs` into a world-agnostic builder plus a per-world source adapter; HP next from its census | Sonnet or Sol, one session | HP ingredients build through the shared builder with less new code than LOTM (AR11) |
| MAW-X4 | Graded substitution in play (TSW3, TSW-L3): give `matchRecipe` a live caller and a fit score that changes the outcome | Opus or Sol design, Sonnet build | One slot accepts a substitute in a rebuilt browser run with a visible fit preview |
| MAW-X5 | Lane brief templates: save the build-lane brief (golden snapshot, validators, conservation, old save, browser matrix) as a fill-in template under `docs/gm/` so each dispatch copies it instead of rewriting | Coordinator, small | Next dispatch's brief is a filled template |
| MAW-X6 | Browser harness kit: factor the shared parts of `o1-browser.cjs` and `s1-brew-browser.cjs` (static server, fresh origin, viewport and font matrix, save/Export/Import, old-save run) into one helper | Sonnet or Sol, one session | Two existing harnesses run unchanged on the helper |
| MAW-X7 | Integration helper: one script that assembles lane worktrees into a clean integration worktree, runs the full gate, commits own paths through a private index and verifies worktrees before removal (zsh-safe, no `rm` inside `bash -c`) | Sonnet or Sol, one session | A dry run on a two-lane fixture lands and cleans with no manual steps |
| MAW-X8 | Register coverage gaps: entries for combat, NPC people and helpers, sites and exploration, and UI layout systems | Sonnet or Sol per area | Each area has a register file in the same format |
| MAW-X9 | Gap list follow-through: the register's MIE-G and progression gaps get owners or are linked to existing palettes | Coordinator | Each gap row names an owner or a palette code |
