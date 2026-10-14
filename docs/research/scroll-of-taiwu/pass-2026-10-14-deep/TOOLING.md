# Tooling and evidence receipt

Lane taiwu-2. Work root `/Users/weiwei/.codex/research/taiwu-2/`; output only `docs/research/scroll-of-taiwu/pass-2026-10-14-deep/`. Prior extracts under `/Users/weiwei/.codex/research/taiwu/extract/` were reused read-only. No clones, network fetches, installs, games, game assemblies, injectors or save reads. No REA/Ghidra needed: the questions stayed in managed code and data. ILSpy executes as a tool, never the inspected game DLLs.

## Inputs

Current manifest confirms app838350/build25845203/StateFlags4, depot838351 manifest5251987467382502170 and completed download/staging totals. GameData.dll and GameData.Shared.dll hashes were compared with the prior receipt and match. This validates reuse of those prior extracts, not their whole semantic coverage. No account identifiers copied to this dossier.

Payload root `/Users/weiwei/Library/Application Support/Steam/steamapps/common/The Scroll Of Taiwu/`. Relevant inputs: Backend/GameData.dll, GameData.Shared.dll, GameData.ActionPlanning.dll, GameData.ActionPlanning.ActionImpl.dll, GameData.Adventure.dll, CompDevLib.Interpreter.dll; frontend Managed/Assembly-CSharp.dll; five EventLib packages and matching EventScript files. Exact sizes/hashes are private `extract/source_receipt.json`. Every extract is hashed in `extract/HASHES.txt`.

## Mechanical rerun

Existing ILSpy11.1 and dotnet10 used, with DOTNET_ROOT set to `/Users/weiwei/.dotnet`. Python runs with `-I`. Task-authored scripts use subprocess argument arrays and separate stdout files, not game reflection/execution.

1. `python3 -I /Users/weiwei/.codex/research/taiwu-2/tools/extract.py`: lists module/frontend class metadata and extracts initial domains/config. Results `notes/extraction.json`.
2. `deep_extract.py`: entire planner/ActionImpl/Adventure/interpreter modules and event domain/frontend helper types. `types_extract.py`, `final_extract.py`, `supplement_extract.py`, `last_types.py` add targeted types; each corresponding JSON result log lives under notes where emitted. All use the same environment and ILSpy route.
3. Direct follow-ups used ILSpy `-t` on IEventScriptDecompiler, root-shared EventScriptId, CombatSkill, AdventureRuntime, AdventureMajorEvent, NeiliProportionOfFiveElements, NeiliProportionHelper, FiveElementsType and Config.EventFunction. No additional library installation.
4. `parse_twes.py` mirrors read format from IEventScriptDecompiler and EventScriptDecompiler_0_0_2_0. It decodes .NET7-bit-length UTF-8 strings and little-endian GUIDs, labels and instruction/condition arrays. It asserts record types and consumes each of five files to exact EOF. Private Scripts.*.json contains raw expressions; only paraphrase/counts appear in repo.
5. `table_audit.py` scans balanced constructor expressions, respects quoted strings/nesting, separates arguments and enumerates nine ID sets. Rows.*.json stays private. IDs and field summaries are in TABLE_COVERAGE_DIGEST. Counting rows is not full gameplay review.

Example command shape: invoke `/Users/weiwei/.dotnet/tools/ilspycmd -t GameData.ActionPlanning.MonthlyAI.CharacterPlanningAgent` with Backend/GameData.dll as final argument, redirect to this work area's extract path, and set DOTNET_ROOT. No `-p` build or assembly loading helper was used.

Dossier generation: write_dossier.py, finish_dossier.py and closeout.py. `validate.py` checks JSON, source files/symbols, table IDs, script receipts, prose/local links and raw-extract location. It writes VALIDATION.json and refreshes the private source receipt/hashes. Rerunning generation scripts can overwrite this output; these are lane tools, not a production authoring pipeline.

## Dead ends and limits

- Guessed Event.EventDomain failed exit65; ILSpy suggested TaiwuEvent.TaiwuEventDomain, which succeeded. Config.WorldSettings failed; metadata showed WorldCreation/WorldState, both recovered. Do not repeat the failed guesses.
- EventScriptId in GameData.dll returned70 and explicitly named GameData.Shared; extraction from Shared succeeded. SkillBookPageIncompleteState was guessed under Config, failed65 and was then recovered under GameData.Domains.Item in Shared. Prior Config.GlobalConfig failure is closed with root GlobalConfig.
- Generated event-package C# contains unresolved-reference/Unknown-result comments in some constructor/delegate scaffolding because packages live outside Backend. Conditions/calls cited here are readable; no unknown IL is treated as runtime proof. Script binary decoding supplies a second evidence layer for selected gates. An optional future rerun can add Backend to ILSpy reference search, after checking its help.
- Wide terminal output truncated a few searches. Claims use later narrow reads or private files; truncation never counts as complete reading.
- No browser/game tests, builds, native compatibility or save/reload/import. No remote citations needed: primary evidence is installed code; comparison claims cite dated local dossiers.
