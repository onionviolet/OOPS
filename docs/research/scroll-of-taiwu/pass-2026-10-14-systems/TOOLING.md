# Tooling and preserved source detail

Work root: [ds-scroll-of-taiwu](/Users/weiwei/.codex/research/ds-scroll-of-taiwu/). Only repo writes: this pass directory. Full code/schema/table extracts stay outside git. Earlier roots `taiwu/`, `taiwu-2/` and `taiwu-2-aspects/` were reused read-only. No source text or assets copied into gameplay.

## Inputs and source identity

Installed payload: `/Users/weiwei/Library/Application Support/Steam/steamapps/common/The Scroll Of Taiwu/`. Current read-only GameData and Shared hashes match the earlier build25845203 receipts:

| Input | Bytes | SHA-256 |
|---|---:|---|
| Backend/GameData.dll |9170432|0f56b7b7bb324e95389e587b864cb9a06dc69d5859ef7f55c71aa0a05f29e1e4|
| Backend/GameData.Shared.dll |23540224|4fa0a319209ef61af2e0b82d1d447431f5d20cad42a369388b5cf0c4fd962080|

This verifies reuse against those exact binaries. Build/depot naming comes from the previous receipt; no fresh Steam install-state or compatibility claim is made. No manifest account fields, saves, working databases or live mods were read.

## Preserved references

- [New source index](/Users/weiwei/.codex/research/ds-scroll-of-taiwu/extract/source_index.json) lists25 complete type extracts, symbols, hashes and the314 numeric MakeItemSubType constructors. [Hash manifest](/Users/weiwei/.codex/research/ds-scroll-of-taiwu/extract/HASHES.txt) covers every new extract. Full table constructors and schemas are retained, not just counts; constructor capture is not semantic reading of every row.
- [Structured evidence](/Users/weiwei/.codex/research/ds-scroll-of-taiwu/extract/source_receipt.json) identifies input DLLs. FINDINGS.json has40 exact source-symbol anchors with file hashes and line locators across15 systems. SYSTEMS uses suffix aliases: for example `N:GenomeHelper` means `extract/GameData.Domains.Character.GenomeHelper.cs`, and `N:MakeItemData.cs` means `extract/GameData.Domains.Building.MakeItemData.cs`. The source index resolves every full filename.
- [Prior artifact manifest](/Users/weiwei/.codex/research/ds-scroll-of-taiwu/notes/prior_inputs.json) records31 prior dossier artifacts and hashes. Prior raw compiled tables, study/AI/script code,265 decoded scripts and complete event-language archives remain in their earlier roots, linked from their TOOLING. This pass adds no redundant dialogue dump; the earlier858 CN/EN files and554 linked event IDs are still the full private references for that selected corpus.
- New full types: GenomeHelper, CharacterCreation, PregnantState, Genome, LegendaryBookDomain, MapDomain, prison/treasury helpers and schemas, MakeItemData/Method, ItemTemplateHelper, DebateGame, MerchantData, ArtisanOrder, EatingItems/Helper and six config table/schema types. Exact25-type list is in extraction.json/supplement.json and source_index, rather than a competing copied type roster.

## Mechanical rerun

No installs, clones, web fetches or native UI. Used preinstalled Python3, ILSpy11.1 and dotnet10. Every game assembly was read statically by ILSpy, never executed/reflected as game code. Task-authored scripts run with `python3 -I`; subprocess arguments are arrays, output files separate.

1. `python3 -I /Users/weiwei/.codex/research/ds-scroll-of-taiwu/tools/extract.py` extracts17 types from Backend/GameData.dll or Shared and records source hashes. It sets DOTNET_ROOT to `/Users/weiwei/.dotnet` in the subprocess environment.
2. `python3 -I /Users/weiwei/.codex/research/ds-scroll-of-taiwu/tools/supplement.py` extracts8 more types. All25 jobs returned0 with empty stderr. Logs: notes/extraction.json and notes/supplement.json. No game process started.
3. `tools/map_inventory.py` reads earlier system_inventory.json and the committed prior inventory table, preserves all306 rows,21 domains and17 modules, and writes FAMILY_MAP/FAMILY_INDEX. Family assignments use reviewed name patterns; YAIR mappings are marked inferred. Prior row status is retained. Do not run this alone after manual map refinements without finish.py.
4. `tools/finish.py` builds FINDINGS/source_index, updates deep-system K/P routing, checks40 symbols, validates matching binary hashes and refreshes extract hashes. `tools/validate.py` checks required artifacts/JSON/counts/links/symbols/owners/prose and produces VALIDATION.json. Source-anchor presence verifies a locator, not the truth of every interpretation.
5. New prose reports were written directly in the allowed output directory. Generation scripts are local rerun aids, not production game authoring tools. Rerunning map/finish can overwrite generated artifacts in this output directory only.

Basic static command form: `/Users/weiwei/.dotnet/tools/ilspycmd -t GameData.Domains.Character.Genome <payload>/Backend/GameData.Shared.dll`, with DOTNET_ROOT set and stdout redirected under the work root. No `-p` project build, executable launch or assembly-loading exporter used.

## Limits and dead ends

No new type-extraction guesses failed. Broad shell output sometimes truncated; narrower function/section reads replaced it. Old failed Config.GlobalConfig guesses were not retried. S03 dispatch to the population entry point remains unestablished after narrow caller searches; both new/old implementations are recorded, without guessing which runs. Missing exact source constants remain symbolic, explicitly named in S06/S13, rather than invented values.

Potential code anomalies were retained as questions: unused targetDurability argument; missing in-method craft/repair/adjacency guards; transient treasury allowance; serialized debate board without a traced archive registration. No running-game exploit, bug reproduction or safety proof follows from these observations. No runtime, UI, benchmark, save/reload/import, corruption, compatibility or human-acceptance test was attempted. CHECKPOINT owns every remaining question.
