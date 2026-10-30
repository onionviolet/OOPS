# Lane brief: CH1, chance core (fit map first, then a small key and passive-value leaf)

Model: `gpt-6-luna`, medium (Weibao 2026-10-29: "Send that luna stuff"). Local, `/Users/weiwei/code/yet-another-idle-rpg`.
Do not commit; never stash, reset, force or push. Publication class: public code (name-free). Rules:
`.claude/rules/runtime-code.md` AR1-AR16, AD36, AD38, AD43, AD45, MD1-MD3, CLR2, CLR3, CLR9, CLR12; generation
contract [GR1-GR17](../../../../GENERATION_FOUNDATION_RULES_2026-10-14.md); keyed draws only, never ordinal (LSD139).
Design: [LEAD_LIFE_SYSTEMS_DESIGN](../LEAD_LIFE_SYSTEMS_DESIGN.md) sections 33, 35 and 37 (LSD335-LSD387), plan row
LSD376. Lines LSD388-LSD392 are deferred by Weibao; do not build them. Write constraints as default, dial and reason.

## Why

Sections 33-37 put chance in every system. Much of what they ask for already exists: `src/gen_kit.js` has addressed
draws (`address`, `drawU32`, `drawFraction`), `pickStratified`, `pity` and `withRetries`; `src/check_resolver.js`
resolves keyed checks with receipts (`resolveCheck`, `replayCheck`, golden fixture `tests/fixtures/check_resolver_golden.json`);
`src/seeded_streams.js` and `src/keyed_generation.js` hold the stream and keyed-unit helpers. The risk is building a
second chance system beside them. So this lane maps first and codes only the gaps.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| LSD rows in sections 33, 35, 37 to map (LSD335-LSD387) | 53 | | no |
| Of those, rows already served by an existing function | about half | | no; record the share |
| Existing check golden cases that must stay byte-identical | all | | yes |

## Part A: fit map (do this first, stop if it shows no code is needed)

Write `cast-lives-lanes/CH1_FIT_MAP.md`: one row per LSD335-LSD387 code with its GR row, the existing module and
function that serves it (or "none"), the gap in one line, and the phase that owns the gap (P1 here; P2-P8 per LSD376-LSD378).
Keep it a table, no prose essay.

## Part B: P1 code, only for gaps Part A finds in chance-core scope

- Outcome: a caller can build a check's draw key that changes exactly when something real changed (LSD363): subject,
  method, tool, helpers, target state and the period of anything with its own clock (LSD365: daily mood, weekly price).
  The same attempt with nothing changed gives the same key. Retries carry their cost and cumulative effort (LSD364).
- Passive values (LSD379): background noticing reads a stable passive value instead of rolling each minute; an active
  search rolls.
- Smoothed batches (LSD338): repeated idle actions can draw from a stratified stream so a 30% chance lands near 30% over a
  run; one-off checks stay plain. Reuse `pickStratified` or the addressed draws; do not add a new RNG.
- No-leak read (LSD380, LSD349): a read-only `describeCheck` style view for a dev inspector returns key, factors, band,
  draw and result, and a player-facing view that is identical for "failed" and "nothing there". Sealed facts appear by id only.
- Seam (AD45): a world-neutral leaf `src/check_keys.js` with imports only from `gen_kit.js` and, if needed,
  `check_contract.js`. Do not change `src/check_resolver.js` behavior; if a hunk there is truly needed, write it as
  `cast-lives-lanes/CH1_INTEGRATION.patch` (CLR9) and keep the golden fixture identical.
- Files owned: `src/check_keys.js`, `tests/check_keys.test.js`, `cast-lives-lanes/CH1_FIT_MAP.md`,
  `cast-lives-lanes/CH1_CHECKPOINT.md`, optional `cast-lives-lanes/CH1_INTEGRATION.patch`. Everything else read-only.
- Save fields: none in this lane (the leaf is pure). If a later caller needs saved state, name it in the checkpoint.
- Actor parametrization (CL225): nothing reads "is the lead"; tests use a non-lead actor too.

## Work and done check

- Failure cases: an unchanged retry returns the same key and result; a changed factor gives a new key; a fixed fact is
  never rerolled (LSD336, GR3 freeze on reveal); a draw budget exhaustion refuses rather than biasing.
- Verification: `node --test tests/check_keys.test.js tests/check_resolver.test.js`
  and `npm run check:arch` with no growth. Report input SHA-256 of the files you read, as other checkpoints do.
- Done when: the fit map exists; the focused tests pass; a 100-run stratified batch at 30% lands within 2 points; the
  checkpoint says "implemented, below floor" with FLR lines, known limits and what P2 needs from this leaf.
- Stop conditions: Part A shows every chance-core row is already served (then write only the map and checkpoint), or a
  needed change in a shared file that no prepared patch can carry.
- Ambiguity default (CLR12): prefer reusing an existing function with a thin wrapper over a new one, and say why.
- Out of scope: browser checks (no UI in this lane), memory (P2), fights (P4), bystanders (P6).

Do not commit. Keep canon names and source text out of tracked `src/` and `tests/` (CLR3).
