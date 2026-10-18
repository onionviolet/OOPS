# Rain World round 5 independent audit

Status: PARTIAL overall. Named base passage and Expedition completion consumer chain completed statically; no whole-game or native completion.

Owned writes: round-5/audit and its private raw counterpart only. Prior reports read-only. Nine full new types have commands/input/output/exit receipts. Capture is separate from reading: three new class bodies read fully, five through selected windows, one captured-unread. Sibling shared captures joined by exact hashes and independently named windows; MainLoopProcess fully read.

Done: base passage API/registry/invocation and exception order; main-assembly IL reference scan; AchievementChallenge→base completion→Expedition content/core save→campaign wipe→Revert current pointer; actual WarpPoint death scrub; process resume/new and retained payload scope. No automatic NPC recapture was found in the shipped base callbacks. External implementation behavior remains unknown. Core request success is not required before the campaign wipe and no cross-file durability gate was proved.

Evidence owners: REPORT.md, FINDINGS.json, READ_LEDGER.json, UNREAD.json, SOURCE_INDEX.json, VALIDATION.json. Private CUSTOM_PASSAGE_REFERENCE_SCAN.json records precise regexes, source hash and hits; negative static references are not runtime registry truth. Main input b6be1d4e18ce219d21091b51564cb6a11c1e4106b41de903eb8e58849cb16fdb.

No game/shipped routine execution, personal saves/configuration, installs/downloads, runtime edits, commits or subagents. Next useful work requires one concrete selected callback/module or an authorized native observation; no exhaustive plugin or platform survey implied. Original research workflow owner remains ../../audit/RESEARCH_FLOW.md.
