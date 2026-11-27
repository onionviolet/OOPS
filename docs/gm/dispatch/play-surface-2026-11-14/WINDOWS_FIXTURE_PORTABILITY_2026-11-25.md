# Windows fixture and source identity repair

| Preflight | Scope |
| --- | --- |
| Reading and authority | Investigate the systemic Windows failures in the coordinating full-suite log, reproduce representative cases and fix shared portability boundaries without weakening gameplay assertions. The coordinator additionally authorized the actual planning-frame callback regression and canonical text identities. |
| Fit and seams | `tests/helpers/native_loader.mjs`, disposable fixture inputs, Node URL conversion, canonical source text, and the transient planning read frame. The current mutable planning-frame caller is the native actor-context builder. |
| Mechanism | Esbuild hooks match normalized module paths. Disposable dependencies use Windows junctions and immutable file copies. Filesystem paths cross Node URL boundaries through the standard converters. Text fingerprints use Git's LF text form. Mutable actor frames detach data while borrowing the query callbacks required at settlement. |
| Rules | AR3, AR6, AR7, AR9, AR10, AD36. [Architecture](../../../ARCHITECTURE_RULES.md), [preflight](../../PREFLIGHT_CARD.md). No new saved fields or compatibility migration. No UI contract, perspective, Here, Workroom, MoL or charm implementation edited. |
| Failure scenario | A frame containing `charmPresence` used to throw on clone and halt the joined clock. A mutable consumer must retain that live query while its facts/vitals remain isolated. A fixture cleanup must preserve its source directory. |
| Screen | No player-facing UI change. Native disposable integration is exercised; rebuilt browser acceptance for the coordinating gameplay batch remains separate. |

## Findings and changes

| Code | What was wrong | Repair |
| --- | --- | --- |
| F1 | Esbuild's Windows onLoad paths did not match slash-only presentation patterns, so tests loaded the entire game runtime instead of the intended stubs. This produced `LocationType`, Courtyard and Waypost errors. | Normalize separators before matching the existing patterns. The same stub definitions and tests remain in force. |
| F2 | Disposable copies requested privileged Windows file/directory symlinks. Their next failure was spawning `npm` as an executable. | New `tests/helpers/fixture_fs.mjs` uses directory junctions and independent file copies on Windows, retaining POSIX links. Twenty fixture consumers use it. Known build/architecture subprocesses run the same Node entry scripts directly. |
| F3 | URL pathname strings became `C:\\C:\\...`, and absolute Windows paths passed to `import()` became an unsupported `c:` scheme. The scenario identity walker also mixed native separators with module-style prefixes. | Use `fileURLToPath`/`pathToFileURL` and canonical relative paths. A regression includes an imported document under a scratch root containing spaces and a hash. |
| F4 | Windows CRLF checkouts changed the frozen Worm/CoI source fingerprints and raw canonical ledger comparisons. Row values and scores were unchanged. | New `scripts/canonical_text.mjs` normalizes CRLF to LF at the text identity boundary. Existing frozen values and all substantive equality assertions are retained. No ledgers regenerated. |
| F5 | The transient actor frame now carries a settlement-time query callback; `structuredClone` rejected it during a mutable planning read. | `planning_read_frame.js` retains borrowed callback identity and detaches its plain mutable data. Existing callers require the callback to evaluate presence against settlement state. It stays outside persisted state. |

## Verification

### Resumed residue, 2026-11-25

Coordinator-authorized follow-up covers `book_power_ledgers`, `cheat_awakening`, `cheat_cards`, `native_save_fixtures` and Village bot-route replay. AR3/AR6/AR9 and AD36 apply; no gameplay/UI or persistence contract changes. Reproduced log failures were doubled Windows drive roots, Mac-specific Playwright/Chrome module paths and a child process with an invalid URL-path working directory. The ledger script and Village child now use `fileURLToPath`; cheat esbuild input/resolve paths use the same converter. Cheat and native-save browser harnesses use the existing `launchChrome` environment/module fallback; the latter retains its `RT_*` overrides. Existing assertions are unchanged.

`node --test tests/book_power_ledgers.test.js tests/cheat_awakening.test.js tests/cheat_cards.test.js tests/native_save_fixtures.test.js tests/village_lead_line.test.js`: **36 passed, zero failed/skipped**, 154 seconds, using `YAIRPG_PLAYWRIGHT` for the installed Codex module and `YAIRPG_CHROME` for installed Windows Chrome, headless. Covered exact committed-ledger rebuilds, awakening storage-failure recovery, actual cheat serializer/import roundtrip, all CN11 native-save craft/level/town-chain invariants and the twice-identical Village bot route plus HEADLESS export/import/reload. Log: `%TEMP%/oops-harry-residue-focused-20261125.log`. Scoped `git diff --check` passed. The run closed normally, with no retained task server/browser or scratch build. Other residue clusters remain with their coordinating owners.

| Check | Result and limits |
| --- | --- |
| Native and helper checks | `node --test tests/patient_furnace.test.js tests/gear_acquisition.test.js tests/seeded_streams.test.js tests/mixture_adapters.test.js tests/lotm_amulet_protection.test.js tests/planning_read_frame.test.js tests/fixture_fs.test.js tests/headless/scenario_identity.test.js`: 29 passed on final source. |
| URL and identity checks | `node --test tests/b_coverage_ledgers.test.js tests/coi_potions.test.js tests/worm_prt_derived.test.js tests/self_registration.test.js tests/worlds_ledger.test.js tests/worm_power_ledger.test.js`: 25 passed. Canonical hashes match the recorded frozen identities. |
| Facts-frame integration | `node --test tests/facts_frame.test.js`: eight passed, two skipped because the private cast fixture is absent. Its fresh native route and frame differential ran. |
| Disposable native integration | `node --test --test-name-pattern='live joins' tests/cast_exchange_adapter.test.js`: passed. Reproduced EPERM, then `spawn npm ENOENT`, then the real callback clone pause, before repairs. Final native UI/clock and Save/reload/Export/literal Import passed on disposable bundle SHA-256 `e94096e4c5af2bb66cdc89e3f65454a7468874061c62342a82f1029a59d95b78`. |
| Structure and whitespace | `npm run check:arch` passed. Twenty-one fixture helper consumers parse. `node scripts/check_doc_slips.mjs` and scoped `git diff --check` passed. No main/display/save registration lines added. |

The coordinating full suite remains the authoritative aggregate gate. Existing tests that explicitly require real symlink semantics, such as the snapshot link-cycle test, are separate from disposable dependency setup and were not changed here. The schema-union and batch-pipeline lane owns its own input-link behavior. UI and MoL clusters retain their assigned owners.

Detailed bounded logs remain in the system temp directory as `oops-windows-native-focused-20261125.log`, `oops-windows-url-focused-20261125.log`, `oops-windows-fixture-focused-20261125.log`, and `oops-windows-facts-focused-20261125.log`. Disposable exchange scratch was removed by its existing test teardown. No commit or push performed.

## Slot limiter test portability follow-up

The coordinating full suite reproduced four platform assumptions in `tests/slot_run.test.js`: Windows `SIGTERM` force-terminates a Node runner instead of invoking its signal/exit handlers; Windows `os.loadavg()` reports zero; nested execution required `sh` and shell/PATH quoting; soft-load coverage depended on actual host load. The limiter implementation and npm test entry point are unchanged.

The two-holder/third-waiter integration retains its real atomic slots and blocking assertions. POSIX still terminates the holder with `SIGTERM`, exercising signal forwarding and slot release. Windows completes the actual held child through a fixture-owned completion file, exercising child-exit release; the existing dead-PID case continues to test stale-holder reclamation. Load integration now preloads a deterministic OS load input in the spawned Node process, then invokes the real CLI: high load waits without acquiring a slot, calm load runs, and sustained high load expires its one-second soft wait with the existing message assertion. No production load override or limiter bypass was added. Nested runners use direct `process.execPath` argv and retain the seven exit code plus released-slot check. Inherited hard-load settings are cleared inside the isolated test environment; soft/nested scratch directories are removed.

`node --test tests/slot_run.test.js`: **eight passed, zero failed/skipped**, Windows, 4.8 seconds. Log: `%TEMP%/oops-slot-portability-focused-20261125.log`. Windows lifecycle, real queue/status/concurrency, hard/soft simulated load, nested held-slot behavior, crash/missing-command exits and stale-holder reclamation ran. POSIX signal branch is retained in source but was not executed on this Windows host. Focused scope requested; no full suite run by this lane.
