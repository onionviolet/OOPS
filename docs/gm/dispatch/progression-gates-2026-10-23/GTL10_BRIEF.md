# GTL10 brief: overflow-policy pilot (successor task)

Weibao's request (2026-10-23): build a reviewable GTL10 overflow-policy pilot
against the existing native gate/XP seam. Keep current world behaviour by default.
Add the missing policy representation and execution only where an actual current
consumer and a source-supported per-world row justify it. Prove one end-to-end
consumer with costs and conservation, save/reload/import and rebuilt 1920x1080
evidence. Proposed policies stay proposals, not accepted universal rules. No
five-world build-out, no unsupported pressure fiction. No commit, push,
publication or app installation.

## Start

1. You work in your own git worktree. The parent's GTL6 work is uncommitted in
   the primary checkout `/Users/weiwei/code/yet-another-idle-rpg`. Copy exactly
   the files listed under "Input receipts" in
   `/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/progression-gates-2026-10-23/CHECKPOINT.md`
   from the primary checkout into your worktree. For the modified tracked files
   (`levelable_component.js`, `display.js`, `reveal_chain.js`, `chain_inspector*.js`,
   two tests), apply the primary checkout's `git diff` for those paths instead of
   copying whole files if your HEAD differs. Verify the sha256 prefixes and record
   them. Never write into the primary checkout.
2. Read: `docs/PROGRESSION_GATE_RULES.md` (GTR16, GTR21, GTR29, GTR30; rounds 2 and 3),
   `docs/PROGRESSION_GATE_OVERFLOW_2026-10-23.md` (GTL6 section, GTO rows),
   `docs/worlds/progression-gates-2026-10-23/*.md` (proposed per-world overflow rows),
   `.claude/rules/runtime-code.md` and `docs/ARCHITECTURE_RULES.md` (AR1 net-zero main.js,
   domain registry, save slices), AGENTS.md verification section.
3. Name the target viewport (1920x1080), visible outcome and deferred scope in your
   task record before editing (AGENTS UI direction).

## Choose the one consumer and row

Pick exactly one policy beyond lost/banked (converted, spill or pressure) and one
world row, using these tests, and write the choice and the rejected candidates
with reasons in your report:

- The consumer exists and runs today in a world a player can reach (cite file:line).
- The world's row is supported by a source claim in its audit or overflow doc
  (cite the row code and its evidence label). Inferred-only rows do not qualify.
- The policy's cost or conservation is checkable: excess goes somewhere countable,
  or a stated cost is paid, with nothing created from nothing.
- It does not require editing LOTM files, gear workshop files or Qud paths.

Likely candidates to evaluate (not preselected): the child-to-parent skill spill
that already exists (GTO2) expressed as a `spill` row; `book.mol.cyoria` (MLP1);
the Mistglass world `p23.mistglass` rows in the overflow doc. If none qualifies,
stop and report why; that is a valid outcome.

## Build

- Extend `src/skill_overflow_domain.js` (or the descriptor in `src/progression_gates.js`)
  with the chosen policy's representation and execution only. Unlisted worlds and
  `base.frontier` keep their current behaviour; add a regression proving both.
- Optional rank/place keying (GTR29) only if the chosen row needs it.
- Save state through the existing `skill_overflow` domain slice; legacy saves and
  existing slices must load unchanged. Any new field is optional with a safe default.
- `main.js` gains no net lines (AR1). No new import cycles (`npm run check:arch`).
- UI: show the outcome where the player sees that skill's XP, with the row's reason.
  Use UI tokens; no new literals (UR65–UR68).

## Prove

- Focused tests: the new policy, conservation (excess in = amount out + amount
  held), unchanged frontier and default rows, legacy slice load.
- `npm run build`, then a headless browser run at 1920x1080 on a fresh origin
  (pattern: `docs/gm/dispatch/progression-gates-2026-10-23/skill_overflow_check.cjs`):
  reach the chosen world, cause a real capped gain, show the outcome text, then
  save, reload and file import with the result intact and no console errors.
  Use a port of your own; stop it by port when done. Headless only, no visible
  windows.
- `npm run check:arch`, `npm run check:rules`, and the full `npm test` once at the
  end. Attribute any failure to its owner with evidence.

## Report

Write `docs/gm/dispatch/progression-gates-2026-10-23/GTL10_REPORT.md` in your
worktree with: choice and rejected candidates, files changed with a diff summary,
input receipts, one line per check (command, result, gaps), evidence paths, what
is proposal, and remaining gates. Do not edit PROJECT.md, USER_VISION.md,
RULES_INDEX.md or PROGRESSION_GATE_RULES.md; put proposed hunks for them in the
report. Your final message names your worktree path and branch so the parent can
reconcile.
