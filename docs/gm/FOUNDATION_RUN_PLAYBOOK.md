# Foundation run playbook (OOPS binding), 2026-11-06

Weibao asked to keep the overnight coordination routine "long term as a skill for codex
and claude" after the [foundation consumers wave](dispatch/foundation-consumers-2026-11-06/CHECKPOINT.md)
(2026-11-06: four sonnet lanes, a haiku lookup, a native smoke, a consumer lane, two
headless walks, one defect fixed from the walk, three commits, run paced by usage while
he slept). The portable method is the shared `foundation-run` skill (Claude and Codex both
have it, from the agent-skills collection). This file binds it to this repository: which
owners feed it, which codes the briefs cite, which tools prove it and what the record looks
like. It composes existing owners and links them; it is not a new rulebook (AD32).

Use it when Weibao asks to "make the most progress" with coordinated workers, to keep going
while he is away, or to run the next wave from the atlas. For one settled slice use the
relevant runtime checks directly; for a design topic with lanes use `topic-expansion-audit`;
for one mechanic with research use the [mechanic absorption workflow](MECHANIC_ABSORPTION_WORKFLOW.md).

Rules it applies: AD36, AD41, AD43 with FLR1–FLR6, AD51 with FND5, FND2, AR1–AR16 (AR14 in
briefs, AR16 before done), AU5 model routing, UR70–UR75 for any player prose, AD6–AD8 for
observer safety, sealed secrets ([rules index](../RULES_INDEX.md)).

## Stage 0. Orient from the live owners

1. Startup read per AGENTS.md: [GROUND_RULES](../GROUND_RULES.md), [vision digest](../VISION_DIGEST.md),
   PROJECT.md (current focus decides which world's consumers come first).
2. Progress picture: the newest `docs/audits/PROGRESS_ATLAS_*.md` and
   `PROGRESS_EVIDENCE_MAP_*.md`. Their FD and AT rows carry a "next" cell each; the wave is
   selected from those cells. If the atlas is older than the last foundation commit, refresh
   it first with `progress-atlas` and record the refresh as a dated section in the same file.
3. Reconcile each candidate against accepted direction (`reconcile-project`): an atlas
   proposal, a review or an inherited prompt cannot promote itself to a priority (AGENTS.md
   standing-direction gates). Check the session list and `ps` for other writers before
   claiming the primary checkout (AD41, [shared worktree practice](SHARED_WORKTREE_PRACTICE.md)).

## Stage 1. Select the wave

A slice qualifies when it gives a shared seam its first play consumer, or lets a second
world validate a seam the first world already uses (AD51, FND5), and when its files are
disjoint from every other lane's. Three or four code lanes, one read-only lookup and one
verification lane is the normal size; load from four lanes plus a suite runs above 30 on
this machine, so expect slow gates ([high load is fine](SHARED_WORKTREE_PRACTICE.md#heavy-gates-take-a-slot-2026-10-30-rct5)).

Record the lane table (lane, slice, owner files, why foundational) and the rejected
candidates with reasons in a new `docs/gm/dispatch/<name>-<date>/CHECKPOINT.md` that opens
with a `receipt` fence (vocabulary below). Run `more-to-consider` on the set and write the
dispositions there before dispatch; ACCOUNT FOR NOW items become checks in the briefs.

Candidates that stay out by default, with the reason: anything touching the installed app
Weibao plays (AT7 is its own task); private-pack content the public bundle cannot reach
(fixture-only); worlds whose windows are not built yet.

## Stage 2. Briefs for this repository

Follow the skill's lane brief shapes; the local copy is at
`~/.claude/skills/foundation-run/references/lane-briefs.md`. Every brief here also names:

- Reading: AGENTS.md "Design framing", "Verification", "Safety", "Sealed secrets" (and
  "Game MCP" for walks), `docs/GROUND_RULES.md`, `.claude/rules/runtime-code.md`,
  `docs/ARCHITECTURE_RULES.md` AR1–AR16, `docs/SAVES.md` sections 3, 5, 6 when a slice adds
  a saved key.
- Voice sample, for any lane that writes player-facing text: one good line from the same
  world and surface, quoted as "player text sounds like this", and PRS4/PRS6 named
  (`docs/PROSE_RULES.md`); `npm run check:player-text` must pass before the return.
- Prohibitions, quoted into the brief: touch the listed files and no others; no `git add`,
  `commit`, `stash`, `checkout` or `npm run build` in the shared checkout (the coordinator
  is the sole committer and builder, so lanes cannot race each other); no visible window
  (Weibao's standing rule, 2026-10-30).
- Known traps: every `data-lotm-*` attribute must be registered in
  `tests/perspective_controls.test.js` (use a neutral attribute for shared layers); tests
  that spawn subprocesses need `node --test` run from the repository root; an untouched life
  must write no new save key so fixtures stay byte-identical; a resident life and a
  non-resident life take different panel branches, so a row proven in one is not proven in
  the other.
- Return: files, commands with counts, FND2 change surface (core-owner files, new cycle
  edges, registration lines), what is not covered, FLR state in one line. The coordinator
  writes the receipt; lanes write no docs.

Model routing (AU5, portable agreement): sonnet for code and walks, haiku for lookups,
opus only for a hard seam after an advisor opinion. Codex lanes: Luna-low by default.

## Stage 3. Fold, gate, commit

Check each return at its locator before recording it: grep callers of the seam a lane says
it wired (the Nov 6 wave found two seams with no caller play reaches, AT13), run its
focused tests or `npm run test:changed` from the root, read the diff. Then, as the committer, once on the folded
tree: `npm run build` (record the `dist/bundle.js` sha256), `npm test` through the slot
runner (one suite at a time; a baseline run started before lanes edit `src/` is partial
evidence at best), `npm run check:arch` (no new cycle, main imports at or under baseline),
`npm run check:rules` (receipts and direction sync), `node scripts/check_doc_slips.mjs` on
the new prose (reword each hit with a default, dial and reason).

Commit only the wave's paths from a fresh HEAD; `dist/` and `index.html` are shared build
output and stay uncommitted; other sessions' dirty files stay untouched; no
`Co-Authored-By` trailer; push waits for Weibao's yes.

## Stage 4. Native proof through the game MCP

One walk per build, headless, fresh origin, on a frozen identity:

- `game_capabilities`, then `game_freeze` once; pass its bundle and manifest paths to every
  `game_new`; record the hashes. `view:"compact"` on every call.
- LOTM lives: `game_new({url:"http://localhost/?lotm_probe=1", panel:"lotm", ...frozen})`.
  Step at most 1440 minutes per call (78 to 230 s under load; longer steps exceed the 300 s
  tool timeout and kill the session). The civil-staff buttons appear after the report act.
- Imports: `game_new` accepts `YAIR-UTF8-1` export text from the MCP temp directory, not raw
  checkpoint JSON; a private-pack copy used for loading is deleted afterwards.
- Each life: save, reload, export, import into a new session; read clock, place and purse.
- Sealed secrets: report player-visible text, with a default of at most one short quote
  per observation (the reason: the return is read in chat, outside the discovery route).
- A limit that blocks the walk gets one `game_report_limit` entry
  ([limits doc](../tools/GAME_MCP_LIMITS.md)).

While writers are active in the primary checkout, the walk runs in a scratch worktree of
the committed HEAD (`git worktree add <scratch> HEAD --detach`, symlink `node_modules`,
`node build.js` there) and is labeled as proving HEAD; remove it and check
`git worktree list` at closeout. A failed item is diagnosed in source by the coordinator,
fixed, rebuilt, re-gated, and re-walked for that item alone (the AT9b shape).

## Stage 5. Record

Receipt fence vocabulary (checked by `check:receipts`): `build` a 64-character sha256 or
`n/a`; `route` natural, fixture(name) or n/a; `state` drafted, source-spot-checked,
rules-reconciled, built, browser-verified or director-accepted (AD42: Weibao's own word,
not an agent's); `viewport` 1920x1080 or n/a; `persistence` checked, unchanged or n/a;
`review` none, diff-scoped or landing. A
runtime slice is done at FLR1–FLR6 (AD43); otherwise write "implemented, below floor".

The CHECKPOINT holds: lane table and rejections, reservation, more-to-consider pass, one
receipt per lane (walk receipts as a table: item, what the player saw, result), worktree
inventory if one was taken, the resume block, and a Checks table (command, result, gap).
The atlas gets a dated refresh section with before/after rows and findings under their
existing IDs (AT codes continue, never restart). Browser evidence at 1920x1080 is still the
UI claim's gate; a headless walk proves behavior, not the look.

## Stage 6. Pace and resume

Before Weibao leaves and after every state change, keep the resume block current (shape in
the skill's `references/usage-pacing.md`; example in the Nov 6 checkpoint). Read usage with
the session usage tool before each new lane or wakeup. Weibao's rule (2026-11-06): continue
while weekly all-models is under 75% and the 5-hour window under 85%; at 85% on the 5-hour
window wake after its reset; at 75% weekly stop and wait for him. Use the host wakeup as a
20-minute-or-longer fallback; lane completion notifies on its own. Stop the loop when the
stop condition is written as reached.

## Lessons kept from the first run

| Code | Lesson | Where it lives now |
|---|---|---|
| FR-L1 | A lane's "wired" is a claim; grep for a caller play reaches before recording it | Stage 3 |
| FR-L2 | A focused domain test does not prove the panel; resident and non-resident branches differ | Stage 2 traps |
| FR-L3 | Smoke in a scratch worktree of HEAD when writers share the checkout; it proves HEAD, not the lanes (the reason to re-walk after the fold) | Stage 4 |
| FR-L4 | `game_step` over 1440 minutes exceeds the tool timeout | Stage 4 |
| FR-L5 | The loader takes export text, not checkpoint JSON | Stage 4 |
| FR-L6 | Receipt vocabulary and doc-slip words cost a retry each; write them right the first time | Stage 5, Stage 3 |
| FR-L7 | Usage pacing is the user's dial; write the thresholds into the block | Stage 6 |
