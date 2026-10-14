# Checkpoint

2026-10-14. **Bounded pass complete, with explicit unread limits.** This closes the prior public-page pass's Legacy data gap to the extent recorded in COVERAGE. It does not mean full game decompilation, every branch understood, live gameplay verified or YAIRPG implemented.

Start with [REPORT](REPORT.md), then the three digests, [BLUEPRINT_PASS](BLUEPRINT_PASS.md), [REA_TRIAL](REA_TRIAL.md), [COVERAGE](COVERAGE.json) and [TOOLING](TOOLING.md). Only this research folder was written in the shared project. Existing source, staged edits and other active lanes were preserved. No game launch, saves, account actions, gameplay builds, git add, commit or push.

## Done

| Code | Completed evidence |
|---|---|
| A1 | Live Steam build 20773316 and StateFlags 4 verified. Seven pak indexes and eight utoc headers read. No encryption flag in the utocs; pak indexes need no key. Both database paths occur only in base pak. |
| A2 | Two SQLite databases extracted and integrity_check returns ok. Ship schema census: 530 tables; Game: 633. Selected tables/joins cover all five question groups. GameData's extra development tables were not promoted to runtime behavior. |
| A3 | English MAIN dictionary decoded: 18,889 unique entries with validated offsets/UTF-8. Twenty selected Blueprint packages converted and parsed to JSON; ten Kismet text/DOT exports passed. Local-function-edge warnings are qualified in BLUEPRINT_PASS. |
| A4 | One native chain selected after Blueprint PurchasePerk call exposed a missing cost consumer. Direct Ghidra and REA each recover the same three functions. First-purchase path passes minus one to the points updater. No second native chain. |
| A5 | Thirteen requested/supporting artifacts written, including eight ranked proposals and 26 small touches. F1–F15/P1–P5 crosswalk, exact recipe digests, 33 coverage rows and private hashes/receipts retained. Proposals remain unaccepted. |

Next pending item: **none inside this bounded pass**. The unread table below is the boundary for a later named question, not an implicit instruction to continue extracting. Rerun mechanics and source settings are in TOOLING; a new build requires fresh hashes and native address selection. Do not reopen a native chain merely because another tool exists.

## Unread and remaining uncertainty

| Item | Exactly where this pass stopped |
|---|---|
| Spells and lessons | All 27 UI-candidate rows, all 34 spell reward rows and all twelve Assignment-line records digested. Only selected assignment/minigame/puzzle joins traced deeply. Exact red-shield mask, every spell consumer, combo operation order and noncombat multiplier arithmetic remain untraced. See C01–C05. |
| XP and talents | All 40 level thresholds and 56 perk rows covered, with S1 internal rows kept private. One first-purchase native cost examined. Level-point award cadence, already-owned upgrade path, reset/refund pricing, XP cap/exhaustion and cumulative-threshold semantics remain untraced. See C06–C09. |
| Pages, Challenges and gear | All selected tier/recipe rows digested. Counter reset semantics, reachable totals after filters, outlier gear slots and final stat stacking unplayed/untraced. See C10–C13. |
| Care and recipes | All seven potion, eight plant, 13 adult product, 13 family, 75 trait and 38 stat-cost rows covered. Offline/unloaded timer semantics and exact care-condition consumption remain unread in native components. Birth/brewing presentation is not the simulation engine. See C14–C19. |
| School state | Quest-driven seasons, default/activity schedules and selected companion controls read. No house-score economy or written/practical OWL grading contract located in the inspected schema, mission/criteria rows and localized exam terms. Full narrative/cinematic/attendance behavior remains unread. See C20–C26. |
| World and enemies | Faction fields, enemy presets, selected defense/vulnerability/tip joins, puzzle family inventory and two puzzle behaviors examined. Full behavior trees, faction hostility matrix, every statue/map actor and reachable puzzle count remain unread. See C27–C32. |
| S1 | Private data-gate receipt in `notes/sealed-S1.json`; summary status only. Meter formula and complete hidden execution route remain unread. No truth or location list in the public artifacts. See C33. |
| Executable | Only native registration selection and the purchase wrapper/body/point updater chain. No full auto-analysis, protected-code unpacking, PDB, live memory, injection or further native formula work. |
| Mapping/SDK match | No Hogwarts mapping in the inspected public archive. Public SDK names useful but addresses do not match this build. Selected assets parsed successfully without mappings. Neither fact establishes all-package compatibility. |
| Runtime and persistence | Game deliberately never launched. No user save read, export, import or mutation. Shipped Dynamic tables are templates. Static data and decompilation do not establish save durability or human acceptance. |

## REA disposition

D2 trial **ran**, so the “skip because no native question remains” branch does not apply. Native question was the talent first-purchase cost, selected after reading SQLite and Blueprint flow. REA is locally built at the inspected pin, with a declared no-auto-analysis/two-CPU launcher patch. The trial recovered the same selected logic as direct Ghidra; keep it optional. Exact hash, measurements, source patch and limits are in REA_TRIAL. The shared tool-fit document was not edited; REPORT contains its proposed one-line update.

No task-owned Ghidra or REA server remains running. REA temporary snapshot/project cleaned on close. The direct Ghidra project remains private for repeat selected reads. Cancelled partial `repos/rea/` is not a usable checkout; the successful source archive is in `repos/rea-pinned/`.

## Disk, hashes and repeat checks

Measured workspace disk use: about **3.2 GiB** in `~/.codex/research/hogwarts-legacy/`, comprising about 29 MiB extract, 808 MiB notes (including a 696 MiB direct Ghidra project), 2.4 GiB repos/builds and 24 MiB tools. The separate user-local .NET install is about 649 MiB; Cargo/NuGet cache growth was not baselined. No cleanup or deletion of user data was performed. Two dot-free `/tmp` symlinks point into this workspace for Ghidra's path constraint; actual research files stay here.

`extract/HASHES.txt` records SHA256 for all **62 extracted files**, totaling **30,517,138 bytes**. `notes/verification.json` records both successful database integrity checks, 20 parser successes, ten successful Kismet commands and unchanged opening install index inventory (sizes/mtimes plus utoc hashes). This is not a full 71 GB before/after checksum. Executable SHA256 is recorded independently in native-target.json and REA_TRIAL.

Final document checks: both JSON outputs parse; required files present; nine unique findings, 33 unique coverage codes, eight proposals, 26 touches and earlier-code crosswalk complete; relative local links resolve; cited DB table/column roots checked; no raw assets, source code or sealed S1 truth in project outputs. Artifact receipts remain private. No YAIRPG test suite or browser acceptance was run because this lane made no gameplay changes.
