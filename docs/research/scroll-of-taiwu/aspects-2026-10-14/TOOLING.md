# Evidence and private reference map

New work root: `/Users/weiwei/.codex/research/taiwu-2-aspects/`. Prior roots `/Users/weiwei/.codex/research/taiwu/` and `/Users/weiwei/.codex/research/taiwu-2/` remain read-only. Only repo output is this aspects folder. Bulk raw material remains in user-local research storage as COMMON permits; no new writes under the game's private/ directory were authorized by this lane.

## Preserved detail

- [Full CN/EN language archive index](/Users/weiwei/.codex/research/taiwu-2-aspects/extract/dialogue_index.json) maps858 copied shipped files and their EventGuid records; raw files are under `extract/event_languages/`. These files retain the complete shipped text, authoring event names and option text.82,367 occurrences include language/file duplicates, not that many unique narrative events.
- [Selected linked dialogue and flow](/Users/weiwei/.codex/research/taiwu-2-aspects/extract/dialogue_linked_selected.json) retains exact text blocks for554 event IDs in two languages, generated speaker-role selectors, option key/GUID/ordinal maps and decoded .twes records when present. Every selected record matches a generated class;314 of1,108 records have compiled script entries. Additional generated predicates are in the linked prior Package.*.cs files; a missing .twes record is not proof an option has no condition.
- [System metadata census](/Users/weiwei/.codex/research/taiwu-2-aspects/extract/system_inventory.json) retains21 main-domain class groups,306 table/item identifiers, all17 Backend GameData DLL names and the prior frontend type inventory. Public SYSTEM_INVENTORY retains the exhaustive detected table list with documentation status.
- `extract/*.cs` has the new static archive/global/mod/merchant/info/tutorial/record/career/frontend body reads. Full prior tables and flow extracts remain available in the read-only old roots, including CombatSkill955/BuildingBlock319 compiled rows and Rows.*.json for nine additional tables. They were not discarded or copied into the repo.
- `extract/HASHES.txt` hashes new extracts including private text. `extract/source_receipt.json` identifies inspected assemblies; the dialogue index and hashes identify copied language files. No user saves, working.db, mods, library prose or account data were copied.

## Tools and commands

No installs, clones, external fetches or native UI control. Existing dotnet10 and ILSpy11.1 used with DOTNET_ROOT=/Users/weiwei/.dotnet. Python uses `-I`; subprocess arguments are arrays. ILSpy is a static reader here, never a game execution/reflection exporter.

`tools/extract.py` lists ArchiveData/Serializer/Common classes and extracts LocalArchiveFile, GlobalArchiveFile, ModDomain, MerchantDomain, TutorialChapterDomain, SecretInformationProcessor, SecretInformationDisseminationData, LifeRecordDomain and frontend EventModel/TaiwuCharacterModel. All13 jobs returned0; notes/extraction.json retains results.

`tools/supplement.py` extracts ArchiveFileBase, CompressionStreamFactory, DatabaseBridge, GlobalDomain, DataUpgradeManager, ProfessionData, Profession, ProfessionSkill, frontend GameDataBridge and ViewRevertArchive. All10 returned0; notes/supplement.json retains results. The exact command form is ILSpy `-t <fully-qualified type> <installed assembly>`, redirected to this new extract directory. No game build, save read or assembly runtime load occurs.

`tools/reference_index.py` copies only shipped CN/EN EventLanguages and enumerates metadata; `dialogue_links.py` reuses prior generated package and decoded-script files and joins by GUID. Selected packages are CharacterInteraction_Main, CharacterInteraction_Study, TaiwuLegacyPassing, SectBuildingInteraction and Adventure_Interaction. It preserves the entire event text block rather than guessing a YAML/string escape grammar.

`tools/write_aspects.py`, `write_inventory.py` and `finish.py` write this assigned output; `validate.py` checks the fixed twelve-key schema, source locators, preserved-copy identity, selected linkage, census, local links, hashes and required output presence. Text-file joins and constructor counts do not establish semantic whole-corpus review.

## Limits and dead ends

One guessed language subfolder did not exist; directory listing showed flat files, and reference_index used the actual names. No fetch failure or login route occurred. A few broad terminal searches were truncated; later narrow source reads replaced them. All new ILSpy jobs succeeded. Prior failed guesses and unresolved package scaffolding remain recorded in the earlier TOOLING; those extracts were reused without rerunning failed routes.

Raw text is preserved privately, public analysis is paraphrased and linked. No current visual UI, game test, save/reload/import, corrupted-save trial, timing benchmark or compatibility claim. Full semantic content and remaining source questions are in CHECKPOINT.
