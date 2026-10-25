# D3 brief: original-world overflow pilot (coordinator, Sonnet)

Owner finding: [GAP_AUDIT F4/D3](../claude-coordinator-continuation-2026-10-23/GAP_AUDIT.md).
Prior pilot and its rejected candidates: [GTL10_REPORT](GTL10_REPORT.md).
Rules: [PROGRESSION_GATE_RULES](../../../PROGRESSION_GATE_RULES.md) GTR16, GTR21, GTR29;
[overflow doc](../../../PROGRESSION_GATE_OVERFLOW_2026-10-23.md) GTO6, GTO7.

## Correction to the earlier brief

"Source-supported" does not require external canon for an original world. An
original world's authored mechanism, dial, cost and reason is valid support,
labelled proposal. Original worlds are Weibao's established direction; do not ask
him to choose between alternatives again. GTL10 rejected Mistglass on canon alone;
that test was wrong.

## Goal

Reassess one current original-world consumer (start with `p23.mistglass`: the
condensate reserve credit clamp and practice-minute cap). If an actual reachable
consumer supports it, implement one reversible overflow proposal (converted, spill
or pressure) with an authored per-world mechanism, dial, cost and reason, and prove
it. If none is reachable, record the concrete missing seam; that is a valid end.

## Order and isolation

Work in your own worktree. Read and assess freely. Before writing any code that
overlaps D1's input (gate, overflow, levelable, display, reveal_chain files), wait
for D1's message that `D1_INPUT_RECEIPT.md` is frozen, then base your edits on that
receipt so the two packages compose. Message D1 (id given after start) with any
dependency you add.

## Limits

Behaviour outside the pilot row stays unchanged (frontier banks, other worlds lose
with a stated reason, GTO2 unchanged). No global XP-conservation rewrite, no new
full world, no LOTM, gear workshop, Qud or O/F/A paths. `main.js` net zero. No
commit, push, publication or install; no primary overwrite (new report files only).
At most two bounded workers.

## Proof for changed behaviour

Meaningful focused tests (the policy, conservation: excess in equals amount out
plus held, unchanged defaults, legacy save load), `npm run build`,
`npm run check:arch`, then a rebuilt headless 1920x1080 run on a fresh origin:
reach the world, cause a real capped event, see the outcome and reason, then save,
reload and file import intact with no console errors. Pattern:
`docs/gm/dispatch/progression-gates-2026-10-23/skill_overflow_check.cjs`. Own port,
stopped by port. Report in `D3_REPORT.md` (copy into the primary dispatch folder as
a new file): choice, files changed, receipts, one line per check, evidence,
proposal status, remaining gates, and your worktree and branch.
