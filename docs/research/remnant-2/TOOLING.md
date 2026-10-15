# Tooling and rerun receipt

2026-10-15, macOS arm64. No game or Windows executable run. No system installs. Existing .NET SDK and copied Hogwarts reader DLLs were used to build a small local C# reader. A source-only RemnantSaveGuardian clone was inspected, never built or launched.

## Pinned/reused tools

| Source | Revision | Use |
|---|---|---|
| trumank/repak | 355b5f62f51959c7cc6dd5a51708646ef483065d | Existing Hogwarts CLI, encrypted pak index probe |
| trumank/retoc | 885a8dae740cb1ce1e41ff2e74f67f9f0c118237 | Existing Hogwarts CLI, all IoStore paths and one legacy conversion |
| FabianFG/CUE4Parse | 0415fe26eeba66ac0d814c2547b098219682066f | Copied prebuilt Hogwarts DLLs; new reader references copies, no shared source rebuild |
| Razzmatazzz/RemnantSaveGuardian | 501b6ff2e070af34f1cf387c9f17942153a2c158 | Source inspection only; README explicitly warns of incomplete analyzer results |
| TheNaeem/Unreal-Mappings-Archive | tree 6797e0ccfd66502b835b72fbfd6a0fc0637c95da; blob 1f9a157adc6c2d381d5f2c045982ba9541d9a0aa | Public Remnant2/Mappings.usmap, build match UNKNOWN |

Original tool source review/build receipts live in `../hogwarts-legacy/TOOLING.md`. The reused DLL copy and its hashes are retained in this lane's tools/Read/deps. Copied DLL/mapping/helper hashes are in notes/tool-input-hashes.json. Exact source/game index hashes are in notes/source-index-hashes.json; source mapping tree response retained. No public AES key was validated.

## Worked route

The Steam manifest had StateFlags 4, build 16320528, complete counters, depot 1282101 manifest 3402363259625448228 and 92,793,797,879 declared bytes. The executable and ~41/44 GiB IoStore payloads were present. Read-only metadata inspection, not launch or Steam verification.

`repak info` reports the pak is encrypted without a key. `retoc info` on pakchunk0 reports Compressed|Signed|Indexed, PerfectHashWithOverflow, OptionalSegmentPackages, Oodle and 197,992 packages. Its index is readable. `retoc list` over the full Paks directory emitted 767,729 lines, including chunk records and both containers. Deduplicate export paths before reporting content counts. Provider logs mount pakchunk0 and pakchunk1 at order 3. Exact overlapping path winner semantics were not audited; preserve both source indexes and do not infer patch precedence from name alone.

Commands that worked, using these scratch variables:

```sh
R2="$HOME/.codex/research/mw-remnant2"
HL="$HOME/.codex/research/hogwarts-legacy"
R2PAKS="$HOME/Library/Application Support/Steam/steamapps/common/Remnant2/Remnant2/Content/Paks"
"$HL/repos/retoc/target/release/retoc" info "$R2PAKS/pakchunk0-Windows.utoc"
"$HL/repos/retoc/target/release/retoc" list "$R2PAKS" --path > "$R2/notes/iostore-list.txt"
"$HL/repos/retoc/target/release/retoc" to-legacy "$R2PAKS" "$R2/extract/legacy" --no-shaders -f 'Quest_AdventureMode_Fae.uasset'
DOTNET_ROOT="$HOME/.dotnet" "$HOME/.dotnet/dotnet" build "$R2/tools/Read/Read.csproj" -c Release
DOTNET_ROOT="$HOME/.dotnet" "$HOME/.dotnet/dotnet" "$R2/tools/Read/bin/Release/net10.0/Read.dll" "$R2PAKS" "$R2/notes/Mappings.usmap" "$R2/extract/parsed" "$HL/repos/retoc/target/release/liboo2coremac64.2.9.10.dylib" "$R2/notes/selected.txt"
python3 -I "$R2/tools/census.py"
python3 -I "$R2/tools/evidence.py"
```

Repeat the reader with selected2..selected7.txt and separate parsed2..parsed7 output roots, redirecting each console stream to notes/parseN.log. Seven actual passes completed. UE setting: GAME_UE5_2. ReadScriptData=true. Initialize, Mount and PostMount, with a FileUsmapTypeMappingsProvider. No AES needed for these IoStore reads. Oodle is loaded from the preexisting macOS library, not downloaded anew. `to-legacy` succeeded for one wrapper; direct CUE4Parse exports exposed bytecode so no extra Kismet/REA build was needed.

## Dead ends and error interpretation

- A guessed dippyshere AES README URL returned 404; switched to GitHub repository API, which also returned 404. Web search and the Gildor forum supplied no validated key. No repeated URL variants or login were attempted. The encrypted pak remains unread.
- Public mappings were fetched through the archive tree API and raw file route. No publisher build pin matches 16320528. Quest defaults hit invalid FText/bool/property reads; unlock DataTables hit unknown StatModTableEntry properties. Do not patch guessed property offsets or accept values that resemble sensible numbers.
- CUE4Parse catches many object errors internally: GetExports can return JSON and the helper prints PARSED despite those failures. Receipts.json therefore means output emitted only. `tools/evidence.py` associates logged errors with sequential package attempts and writes package-audit.json. No-error objects are still conditional on the schema and tool, not fully verified records.
- Speech/VO assets sampled as AnimSequence, so they were not mistaken for text lines. Actual conversation graphs were found through EventTree paths and parsed separately.
- Generic pattern matching initially selected UI textures for ring/amulet terms. Those outputs remain in scratch and count as texture samples, not item mechanics. Later exact definition selections still had property errors, recorded as partial.
- No native REA chain: generation/native questions remain named in CHECKPOINT, but parser failure is not evidence that native logic is the right next route. No game launch, injector or mapping dumper permitted.

## Durable references

`notes/selected*.txt`: exact inputs. `notes/parse*.log`: unabridged logs. `notes/package-audit.json`: per-package failures. `notes/census.json`, `types.json`, `evidence-summary.json`: machine counts. `extract/parsed*`: complete emitted JSON including available dialogue/table content and ScriptBytecode. `extract/dialogue-reference.json`: indexed available dialogue/conditions/effects, not a cleaned truth set. `extract/HASHES.txt`: SHA256 for every retained extract; hashing does not validate decoding. `tools/Read/`: buildable helper plus copied dependencies. `tools/{census,evidence,write_dossier}.py`: census/audit/report generators. No copyrighted extracts belong in git.
