# W28 report: per-world climate prototype

## CHECKPOINT

2026-10-14. COMPLETE for the authorized isolated prototype. W23 returned
COMPLETE before implementation. Not integrated, not built, not browser
verified, not human accepted. No merge or push. R15 owns integration.

| Code | Result |
|---|---|
| W28-R1 | Worktree `/Users/weiwei/code/yairpg-w28-world-climate`; branch `kit/w28-world-climate`; base `6947900bcc3ad2bd8a2b973b7505d4fed281e949`. Commit `024d4da98268cd04b7d534e796d94c97bb6f6837`, title `Prototype pure per-world climate derivation for W28`. No Co-Authored-By trailer. Worktree clean after commit. |
| W28-R2 | Exactly three committed files: `src/world_climate.js`, `tests/world_climate.test.js`, `docs/worlds/world-core-kit-2026-10-14/W28_WORLD_CLIMATE.md`. This report is the sole main-checkout write by this lane and remains uncommitted. Main's unrelated changes are preserved. |
| W28-R3 | Pure world/profile/place/clock/seed derive with explicit calendar environment. Exact legacy unsmoothed temperature/rain/light parity on sampled inputs; no-season, arbitrary positive-length weather cycles, calendar-owned custom seasons and non-24-hour day fractions, indoor/sealed places. Pure seeded hash/mix reuse, no stream cursor or main.js import. Three numerical profiles are INFERRED proposals, not source-qualified climate tables. |

## Sources read

AGENTS.md, `~/.claude/user-preferences.md`, PROJECT.md top/standing direction
and USER_VISION; dispatch COMMON; kit root rounds 9-11 including
MC28/KX67/DR1/MD1-MD4/MD11-MD12/CR4-CR5/SW1-SW8;
W23_GLOBALS_AND_LIFECYCLE.md and its returned report;
W29_PARADISE_SPECIAL.md, W30_HP_DND_MOL_SPECIAL.md,
W31_NOVEL_WORLDS_SPECIAL.md, W32_ANIME_WORLDS_SPECIAL.md and
W33_CALENDAR_ENGINE.md (calendar shape/environment seam);
`src/book_world_paradise_carriers.js:30-35`, `src/weather.js:5-105,194-245`,
`src/game_time.js:3-87,193-195`, `src/seeded_streams.js:13-21` and package.json.
These were read from the live main checkout; the code prototype/tests ran
against the declared worktree base. Main may continue to change independently.
No private novels/packs, saves or sealed files were opened. No fresh external
canon verification was needed for explicitly authored numerical proposals.

## Test output

**W28-T1 SHOWN(test)** `node --test tests/world_climate.test.js`, exit 0:

```text
1..7
# tests 7
# suites 0
# pass 7
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 795.647334
```

The parity test exercises actual weather.js bodies in a VM with imports/export
removed, across 5,280 time/place combinations. It does not import main.js or
exercise browser consumers or smoothing. Other tests check determinism,
skipped-day/order independence, frozen inputs, no-season/unknown light,
7/3-day weather cycles, calendar-projected 10-day season wrap and 27-hour
fractions, shelter and invalid-input rejection.

**W28-T2 SHOWN(test)** `npm test`, exit 0:

```text
1..807
# tests 807
# suites 0
# pass 807
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 13327.937875
```

Node v22.23.3. `npm ci --no-audit --no-fund` installed 3 locked packages only
in the worktree; package/lock files unchanged. First full attempt lacked
esbuild/inkjs: 233 pass, 84 fail (`ERR_MODULE_NOT_FOUND`); the final run above
resolved those failures. First focused run found arithmetic grouping changed
floating-point output: 5 pass, 1 fail; corrected operation order, then 6/6
passed, then final 7/7 after adding the calendar-consumer fixture.
`git diff --cached --check` passed; committed path inventory and clean worktree
were verified after commit. No builds, bundles, shared hosts, weather.js,
main.js or save files changed.

## Open gates and R15 ask

| Code | Remaining gate |
|---|---|
| W28-G1 | R15 review/adoption of branch commit under its own authorization. Agree the W33 normalized daylight adapter, selected clock/place/seed and profile revision binding. Preserve unknown Paradise public climate; sealed example is not a hub canon claim. |
| W28-G2 | Choose a versioned pure smoothing policy or scoped legacy cache before replacing visible smoothed temperature. Only the unsmoothed formula is reproduced here. Route one native slice, then rebuild and exercise it from a fresh test origin at 1366x768/1920x1080; director acceptance remains open. |
| W28-G3 | Away consumer interval/boundary agreement and idempotent effect settlement; save/reload/export/literal-file import of caused effects through existing owners. Derived weather saves nothing new in this prototype; effects must retain cause IDs per MD4. Any later persisted profile binding needs an explicit compatibility decision. |

The branch documentation owns the API, adoption details, save impact and ranked
considerations. It is available at
`/Users/weiwei/code/yairpg-w28-world-climate/docs/worlds/world-core-kit-2026-10-14/W28_WORLD_CLIMATE.md`.
Source/test completion is not integrated gameplay or browser evidence.
