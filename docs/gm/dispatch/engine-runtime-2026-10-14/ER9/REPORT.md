# ER9 report, 2026-10-14

## CHECKPOINT

Complete: requested MC1–MC21 and MC34 source audit, synthetic pure-module probes,
every public-source Math.random line classification, long-campaign severity
ranking and smallest-fix proposals. No gameplay fix or native acceptance claimed.
Resume from [audit](../../../../research/MICRO_CORRECTNESS_AUDIT_2026-10-14.md)
and this lane's `results.json` and `source-survey.json`; compare
`source-fingerprints.json` before reusing source-specific evidence.

## Files written

| Code | Owned file | Purpose |
| --- | --- | --- |
| ER9-W1 | `docs/research/MICRO_CORRECTNESS_AUDIT_2026-10-14.md` | Ranked F1–F14, measured M1–M5, exhaustive RNG R1–R10, remaining coverage C1–C8 and proposals A1–A5. Adds proposed MC35 distribution bias, MC36 post-durable exceptions, MC37 mutating read helpers. |
| ER9-W2 | `docs/gm/dispatch/engine-runtime-2026-10-14/ER9/REPORT.md` | This completion record. |
| ER9-W3 | `ER9/checks.mjs`, `results.json`, `check-output.txt` | Repeatable synthetic probes, including actual imports of pure modules; exact misc helper extracted into a VM because its full module imports main.js. |
| ER9-W4 | `ER9/source-survey.json`, `source-fingerprints.json` | Public source RNG/locale/lifecycle/test literal sites and hashes of 10 core inputs; no secrets/private fixtures. |
| ER9-W5 | `ER9/test-output.txt` | Passing focused test output. |

## Commands run and outcomes

READ: `cat`/`sed` of COMMON, AGENTS, PROJECT, user preferences, root palette,
E-review, offline audit, ER1 hotspots, ER3 stack options and relevant public
source/test files. `rg` scans for Math.random, clocks, timers, sort/localeCompare,
JSON, writer ownership, import flags, numeric guards and lifecycle hooks.
`git status --short` showed extensive unrelated dirty/staged work, preserved.
Memory registry `rg` for engine-runtime/micro/MC1/ER9 had no relevant hit.
No subagents spawned. No files named SECRETS opened.

MEASURED commands:

```sh
node docs/gm/dispatch/engine-runtime-2026-10-14/ER9/checks.mjs
node --test tests/expansion_engine.test.js tests/absorb_e1.test.js tests/absorb_c2.test.js tests/save_files.test.js tests/native_combat_math.test.js
```

ER9-V1: Node v22.23.3; probe exit 0; tests **37 passed**, 0 failed, 0 skipped.
Output is saved in the files above. No package scripts/build/install needed.

ER9-V2: Pure calendar numeric fields match split/single at 60, 1440 and 518400
minutes across a year boundary. One queued scheduler reward matches state,
external money and gameplay after 60 minutes. A thousand pure previews retain
seed 123/state and consume zero Math.random calls. Overflowing expansion clock
is rejected. These are bounded fixtures, not whole-game equivalence proof.

ER9-V3: Hunger differs by 2.8421709430404007e-13 at 60 minutes and
5.230815780521425e-13 at 480; weather matches. Search intentionally gives one
attempt/0.5 XP for a 60-minute jump versus twelve attempts/6 XP for minute steps.
A 10,000-draw deterministic grid through the actual random_range helper gives
[2500,5000,2500] for [0,2]. NaN/Infinity money rejects before serialization but
passes envelope validation after JSON converts it to null. Exact results remain
in `results.json`.

ER9-V4: Source survey counts 63 Math.random occurrences on 63 lines in 10 files:
24 cosmetic draw lines, 36 gameplay draw lines, 3 injectable defaults. Locale
comparison: 20 lines in 10 files. No direct real-clock/random references found
in public test JS, with one zero-delay task yield. Text scans do not prove absence
of aliased or transitive consumers.

ER9-V5: Final Python sanity check compared report RNG line assignments to the
survey: zero missing sites, zero extra sites. No forbidden em dash/space-double-
hyphen prose. Ten source fingerprints showed zero drift between probe completion
and report check. These checks were ad hoc scripts via exec, not installed tools.

## Findings and open questions

| Code | State / remaining proof |
| --- | --- |
| ER9-Q1 | F1: JSON laundering of invalid money measured at the envelope boundary. Actual ordinary runtime origin of nonfinite money/counters not established. Proposed pre-JSON validation must keep legitimate legacy omissions and explicit numeric DTO snapshots. |
| ER9-Q2 | F2/F3: post-write render throw and import/play overlap inferred from exact publication order and await boundary. Browser fault injection, paid retry and slow-import mutation matrix are open. |
| ER9-Q3 | F4/F5: hide/leave, sleep, bfcache and two-tab writer restoration require fresh-origin browser proof coordinated with ER10. No native-control route used. |
| ER9-Q4 | F6/F8: confirm intended integer distributions before balance changes; no current ASCII-ID cross-locale outcome difference reproduced. Cross-engine combat/XP comparisons and full native seeded trace remain open. |
| ER9-Q5 | Research only: proposals do not authorize code/schema edits. Any selected repair needs source tests, isolated rebuild, desktop browser exercise and persistence checks appropriate to that repair. Existing director acceptance, offline policy and deferred worlds are unchanged. |

The lane output fulfills the audit request. Runtime code, tests, dist, index,
build/package files, personal saves and private packs were left untouched; no
commit, push, install or publication. Source/test evidence is distinct from
packaged, browser, persistence, human and release acceptance.
