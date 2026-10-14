# Tooling and rerun record

Lane work area: `~/.codex/research/taiwu/`. Output only: `docs/research/scroll-of-taiwu/`. No downloaded repos, clones or new tool installations. Used existing Python 3 and ILSpy command-line 11.1 with the preinstalled dotnet SDK. No dependency install or game launch. UnityPy was not needed for compiled tables.

## Inputs

Build 25845203, Windows depot 838351 manifest 5251987467382502170. Manifest fully installed with StateFlags 4 and matching downloaded/staged totals. Soundtrack data ignored. No owner/account identifiers or saves copied to the dossier.

- `The Scroll of Taiwu.exe`: 872728 bytes; SHA-256 `ab77130ec53530d9d15b8cf909cdd512e2e389ba5ed949b190e780da224534c8`.
- `GameData.dll`: 9170432 bytes; SHA-256 `0f56b7b7bb324e95389e587b864cb9a06dc69d5859ef7f55c71aa0a05f29e1e4`.
- `GameData.Shared.dll`: 23540224 bytes; SHA-256 `4fa0a319209ef61af2e0b82d1d447431f5d20cad42a369388b5cf0c4fd962080`.
- `GameData.pdb`: 4900896 bytes; SHA-256 `659746daf84e8fc264c708c66e1857c1bc22e1cf4198b0f0c9f06cd5db4c0eab`.
- `GameData.Shared.pdb`: 3372904 bytes; SHA-256 `782e181057b504f0793fafc8aeca2ac4e2a86ef347510d7b8ff7c426e1806c06`.

## Commands and method

Set `DOTNET_ROOT="$HOME/.dotnet"`. Input root is `/Users/weiwei/Library/Application Support/Steam/steamapps/common/The Scroll Of Taiwu`.

```sh
DOTNET_ROOT="$HOME/.dotnet" "$HOME/.dotnet/tools/ilspycmd" -l c "$taiwu_payload/Backend/GameData.dll"
DOTNET_ROOT="$HOME/.dotnet" "$HOME/.dotnet/tools/ilspycmd" -l c "$taiwu_payload/Backend/GameData.Shared.dll"
DOTNET_ROOT="$HOME/.dotnet" "$HOME/.dotnet/tools/ilspycmd" -t GameData.Domains.Taiwu.TaiwuDomain "$taiwu_payload/Backend/GameData.dll"
DOTNET_ROOT="$HOME/.dotnet" "$HOME/.dotnet/tools/ilspycmd" -t Config.CombatSkill "$taiwu_payload/Backend/GameData.Shared.dll"
```

Before rerun assign `taiwu_payload` to the quoted input root above and redirect output under the lane work area. Equivalent Python subprocess calls were used to avoid quoting errors, with subprocess environment DOTNET_ROOT and stdout redirected to extract files. ILSpy reads metadata; it did not run the game assembly.

Extracted GameData types: TaiwuDomain, OrganizationDomain, BuildingDomain, WorldDomain, CharacterDomain, Character, Sect, Settlement and CombatSkillDomain. Extracted Shared types: CombatSkillItem, CombatSkill, OrganizationItem, LegacyItem, LegacyPointItem, BuildingBlockItem, ReadingStrategyItem, ConfigData<T,TKey>, LegacyPoint, BuildingBlock and SectApprovingEffect. CN and EN encyclopedia directories were copied read-only to the work area.

Use `rg -n` on method names from each digest. For counts parse all `new CombatSkillItem(<numeric ID>, ...)`, not only additions using the literal `_dataArray` variable. The static count result is saved in `extract/table_counts.json`. Read selected constructor schemas and behavior methods; do not execute the DLL to export tables.

`extract/payload_fingerprint.json` contains input hashes. `extract/HASHES.txt` hashes every extracted file. The two local dossier-generation scripts are under `tools/`; they write only this output directory. Those are task-authored Python, not downloaded code.

## Dead ends and limits

- `Config.GlobalConfig` class-target decompilation returned exit 65 and an empty file. The presumed full type name was not established; the file is not evidence. Numeric active-study settings remain unread. Do not rerun this guess; locate the full metadata type/kind first.
- Initial CombatSkill count restricted to `_dataArray.Add` reported only 281 rows because ILSpy also aliases the list. Corrected parser counts all 955 constructors, matching Init capacity, contiguous IDs and uniqueness.
- Wide file/search output was truncated. Narrow method-target reads replaced it; truncated output is not full coverage.
- No fetch failed; official Steam and independent guide loaded. Wiki mechanics were not needed once primary local code was readable. No wiki scrape or account route used.
- Decompilation is not original source or executed behavior. Downstream unread handlers, event scripts and runtime gates remain explicit.
