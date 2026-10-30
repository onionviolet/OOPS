# CH1 checkpoint: chance core

Status: **implemented, below floor**. Scope follows CH1 brief and LSD376, with runtime rules AR1-AR16, AD36/38/43/45, CLR2/3/9/12, GR1-GR17 and LSD335-LSD387. Deferred LSD388-LSD392 remain untouched.

## Result

- `CH1_FIT_MAP.md` maps all 53 rows. 38 (71.7%) have an existing relevant function/module. The resolver, addressed draw kit, and author inspector were reused; no resolver behavior or golden fixture changed.
- `src/check_keys.js` provides factor-based keys (`subject`, method, tool, helpers, period, target state, and retry state), stable passive values, bounded stratified batch chances, and a player projection that does not distinguish failed reads from absent facts. Retry state is caller-supplied cumulative effort/conditions, never an ordinal.
- `tests/check_keys.test.js` covers unchanged/changed retries with a non-lead subject, passive stability, the 100-run 30% batch and refusal above its draw budget, and hidden-result equivalence.
- No save fields or migration are introduced. The leaf is world-neutral; future consumers choose their clocks, values, costs, and whether to batch.

## Floor and limits

| FLR | State |
|---|---|
| FLR1 Build | Not applicable to this pure helper lane; no bundle built. |
| FLR2 Route | No gameplay route or caller exists yet. |
| FLR3 Shown | Helper returns a minimal status; caller descriptions and visible costs remain future consumer work. |
| FLR4 Used | No production consumer yet. |
| FLR5 Kept | No persistence changes. |
| FLR6 Labelled | Agent-verified, not human-reviewed; implementation evidence only. |

Known limits: the key helper cannot decide which factors are real; callers must include every changed dependency and an owning world/body clock where applicable. `passiveValue` composes caller-authored integer values and does not define a universal scale. The batch cap is 512 addressed draws. The safe player projection is a leaf contract, not a UI integration. Existing resolver costs are admission/spend proposals; fatigue, noise, and cumulative search effort effects remain consumer-owned.

P2 needs: use `checkKey` for recall checks with actor, cue/target state, memory clock and cumulative effort; keep saved memory/frozen facts in the memory owner; route character knowledge separately from author receipts; add save/migration and round-trip proof there.

## Checks

| Command | Result | Gaps |
|---|---|---|
| `node --test tests/check_keys.test.js tests/check_resolver.test.js` | PASS, 39 tests; resolver goldens replay unchanged | No caller/browser journey exists in this lane. |
| `npm run check:arch` | PASS; `src/main.js` -51 lines, `src/display.js` -37, `src/save_files.js` 0 | No architecture growth. |

## Input SHA-256

| File | SHA-256 |
|---|---|
| `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/CH1_CHANCE_CORE_BRIEF.md` | `a0ef462451995da03eaf3dcd41a6ed609f142e9ebcb21dc7141bd19bd432ebe8` |
| `docs/gm/dispatch/protagonist-life-2026-10-27/LEAD_LIFE_SYSTEMS_DESIGN.md` | `05eb42982e8412fe8f030cdfa6a7362d2b98518f33d3438cb22f61ddcbc97b26` |
| `docs/GENERATION_FOUNDATION_RULES_2026-10-14.md` | `1a8b112f52209ef97e28dd8584bc43fff2fa3c2f0649b0b389c499919d74a0a1` |
| `src/check_resolver.js` | `3cdebe3999fe4a634889440e4b98d688d5644f38075da851ec2cc94b1088119d` |
| `src/check_contract.js` | `20c1f0b118d1b5f9cb40ebd3b195a6f2aff0cc3d67f5d3671bebf2aaa40c4410` |
| `src/check_inspector.js` | `e05fdd3257a57995a8712eb09ba4e16de34272858cb56a5fb9422d85b5501e9f` |
| `src/gen_kit.js` | `bbbd05aea220aae5f1a8af48252f771851ad089690c9e68f2be0e19c99d38ec4` |
| `tests/check_resolver.test.js` | `23558b2120593df8478dad4bfa80fd8e26e8ded3b1100b105405476f2e2d2fcb` |
| `tests/fixtures/check_resolver_golden.json` | `ca29bf2dfa3c7d88c897a49e9747264bb847e49cd87b341fdc005b38f9694c17` |

## Coordinator review (2026-10-29)

- Defect found and fixed: `stratifiedChance` assigned slot i to stratum i, so every success fell on the first slots of a
  batch (slots 0-29 of 100 at 30%). A keyed shuffle now assigns slots to strata; the test pins that successes are spread
  and that the batch replays identically.
- `node --test tests/check_keys.test.js tests/check_resolver.test.js`: PASS 39/39 after the fix.
- `npm run check:arch`: PASS, no growth.
- `npm test`: PASS 4076/4076 (full suite, pre-commit gate).
- Canon sweep of the two public files: no names. State stays "implemented, below floor": no consumer or player route yet.
