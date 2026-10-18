# Static extraction and native-analysis receipt

2026-10-15. Read-only Steam build 16320528. No game launch, injector, Windows executable, personal save, Steam dialog, install mutation, staging or commit. Raw tools/data live in `~/.codex/research/mw-remnant2/`; all new work is in `deep/` or new tool clones under `repos/`.

## T1: sources and tool revisions

| Input | Pin / provenance | Use |
|---|---|---|
| Installed shipping executable | 134,154,256 bytes; SHA256 0f4783f75ec178724ddbe10baee55a38ce4311bebf1a8bacd0626b9d8f7d0265 | Static AES scan, reflection lists, native code |
| Installed manifest | Steam 1282100, build 16320528, depot manifest 3402363259625448228 | Build identity; DefaultEngine.ini BuildIdOverride independently reads 453438 |
| [yuhkix/aesdumpster-rs](https://github.com/yuhkix/aesdumpster-rs) | 9cba14126662ddc82afcd679c25fcb82260bccff | Read key_dumpster.rs; independently reimplemented signature/DWORD assembly in Python. No upstream executable run. |
| repak / retoc | Existing Hogwarts binaries at 355b5f62f51959c7cc6dd5a51708646ef483065d / 885a8dae740cb1ce1e41ff2e74f67f9f0c118237 | Pak decrypt/list/config extraction; prior IoStore census |
| CUE4Parse | 0415fe26eeba66ac0d814c2547b098219682066f | Copied source to repos/CUE4Parse-remnant-static, added one build-specific custom struct reader, built locally with natives disabled |
| [Archive mappings](https://github.com/TheNaeem/Unreal-Mappings-Archive) | Mapping blob 1f9a157adc6c2d381d5f2c045982ba9541d9a0aa; last file commit ea77c0dcb1526cb64bc58ec6837a9717a55d915e, 2024-05-18 | Enum labels and fallback types only after native regeneration. Predates installed late-2024 build. |
| [Documented static reflection route](https://docs.modelviewer.lol/tft-unreal-extraction) | Accessed 2026-10-15; source describes another UE build and does not publish its generator | Used as a method lead. This lane independently recovered the different UE5.2 descriptor layouts from the installed file. |
| REA over Ghidra | Reused source build bb540826d65316c164d2de8ba4ef10f81a8ad073, REA 6.4.0, Ghidra 12.1.4, OpenJDK 21 | Static native selected chains. Existing bounded-launch patch adds -noanalysis -max-cpu 2; see the [Hogwarts REA trial](../../hogwarts-legacy/REA_TRIAL.md). |
| Capstone | 5.0.9, installed in deep/venv; pip receipt retained | Independently decode selected file-byte instructions and leaf helpers unavailable through REA's procedure lookup |
| [Public save parser](https://github.com/AndrewSav/lib.remnant2.saves/tree/d5190d44e1ded9c2b2bc0c5968c593aa390a4518) | d5190d44e1ded9c2b2bc0c5968c593aa390a4518 | Source read only; no parser execution or save access |

No new system-wide tool installed. The .NET SDK, Ghidra, Java, Node, Rust CLIs and macOS Oodle library were reused. Only Capstone was installed into a new private venv. Copied dependencies and modified CUE4Parse source stay in this lane; Hogwarts tooling is unchanged.

## T2: AES validation

Broad public search did not produce an exact-build published key. A community result pointed to a Discord invite rather than an openly qualified artifact; no account/login route was used. Static recovery therefore proceeded directly.

`deep/tools/aes_static.py` reads the installed file as bytes, parses the inspected four signature families from the pinned Rust source, joins eight DWORDs per candidate and uses entropy only to rank/filter candidates. It found six candidates. Pattern 0 at file offset **0x1ffb999** supplied the first tested candidate. **repak info succeeded on pakchunk0** with that key; **repak list succeeded on both paks**. That decrypt result, not entropy or a plausible-looking string, validates the candidate for these indexes.

The key is stored only at `deep/notes/aes-key.txt`; candidate values stay in `aes-candidates-private.json`. Never copy either into this public dossier. Key-free receipts are in `aes-validation.json` and pak-info.txt. Pakchunk0: V11/Fnv64BugFix, encrypted index, zero encryption GUID, 4,428 entries; pakchunk1: two font entries. Config extraction used repak with the key and Oodle; no raw prose/config entered git.

A path census found zero duplicate ExportBundleData paths between the two IoStore containers. Neither pak lists a .uasset. Both unencrypted IoStore containers and both decrypted pak indexes are retained as separate evidence; no invented patch priority is needed for duplicate game assets here.

## T3: static mapping derivation

Private scripts: `pe_scan.py`, `pe.py`, `static_mapping.py`, `make_usmap.py`, `field_offsets.py`. All use Python standard-library byte reads except the later instruction check.

The PE reader maps preferred virtual addresses to file offsets and records section bounds. It identifies reflection registration tuples and follows RIP-relative references from constructors to native parameter records. It uses explicit descriptor counts rather than walking until a zero. Property stacks reconstruct arrays/sets/maps/enums and record descriptor addresses. Class and struct layouts are validated separately; the referenced guide's newer packed counts and smaller property layouts were not applied blindly to this executable.

UE5.2 layout notes independently read here: class parameter property-array pointer at +40 and explicit property-entry count at +64; struct parameter name at +24, size at +32, alignment at +40, property-array pointer at +48 and count at +56. Native property names/flags/type codes and referenced singleton functions yield the schema. Boolean descriptors have a different offset/set-bit arrangement; the offset report deliberately marks those memory offsets unresolved rather than pretending +56 is their field offset.

4,659 class + 2,893 struct lists resolved. The uncompressed version-4 usmap merges those 7,552 native types with 223 archive fallbacks and the archive enum-label tables. Enum labels/fallbacks are not all re-qualified to this build. `mapping-changes.json` records 205 changed compared layouts. Whole-map build-match remains unclaimed.

The first structural reread gave 66/161 clean packages. REA then identified VariableValue's custom tagged serializer. The isolated source addition is `CUE4Parse/UE4/Assets/Objects/FRemnantVariableValue.cs`, selected from FScriptStruct.cs. It reads a kind plus its actual payload and throws on an unknown kind. With that addition the same sample is 160/161 clean. The generated usmap was separately loaded from disk and reproduced that count without the in-memory overlay.

ReadDeep's Serilog sink counts object errors inside each package. Receipts report clean/partial/failed, not merely whether JSON was written. No warning/error suppression or fabricated properties are used. A clean result means no logged read error, not a certification of all values, inheritance or game use.

## T4: commands and exact rerun inputs

```sh
R2="$HOME/.codex/research/mw-remnant2"
HL="$HOME/.codex/research/hogwarts-legacy"
R2PAKS="$HOME/Library/Application Support/Steam/steamapps/common/Remnant2/Remnant2/Content/Paks"
python3 -I "$R2/deep/tools/aes_static.py"
python3 -I "$R2/deep/tools/pe_scan.py"
python3 -I "$R2/deep/tools/static_mapping.py"
python3 -I "$R2/deep/tools/make_usmap.py"
DOTNET_ROOT="$HOME/.dotnet" "$HOME/.dotnet/dotnet" build "$R2/repos/CUE4Parse-remnant-static/CUE4Parse/CUE4Parse.csproj" -c Release -p:CUE4PARSE_SKIP_NATIVE=true
DOTNET_ROOT="$HOME/.dotnet" "$HOME/.dotnet/dotnet" build "$R2/deep/tools/ReadDeep/Read.csproj" -c Release
DOTNET_ROOT="$HOME/.dotnet" "$HOME/.dotnet/dotnet" "$R2/deep/tools/ReadDeep/bin/Release/net10.0/Read.dll" "$R2PAKS" "$R2/deep/extract/remnant2-16320528-static-hybrid.usmap" "$R2/deep/extract/NEW-reread" "$HL/repos/retoc/target/release/liboo2coremac64.2.9.10.dylib" "$R2/deep/notes/failed-161.txt" - "$R2/deep/notes/aes-key.txt"
python3 -I "$R2/deep/tools/analyze_widen.py"
python3 -I "$R2/deep/tools/system_matrix.py"
"$R2/deep/venv/bin/python" -I "$R2/deep/tools/native_disasm.py"
```

Setup dependency: ReadDeep references copied DLLs under its deps directory. After building isolated CUE4Parse, copy its new DLL into ReadDeep/deps before building ReadDeep. `--dump` and `--enums` modes originally produced old-mapping.json/old-enums.json from the archive usmap; those inputs are preserved. All scripts and logs remain available, so a rerun need not rediscover them. Use new roots, preserving the old failures.

Selections and actual outputs:

| Input list | New output root | Clean / total |
|---|---|---:|
| failed-161.txt | reread-161-v2, overlay before custom serializer | 66 / 161 |
| failed-161.txt | reread-161-v3, overlay with custom serializer | 160 / 161 |
| failed-161.txt | reread-161-usmap, binary usmap with custom serializer | 160 / 161 |
| widen-selection.txt | widen-749 | 749 / 749 |
| crossing-ui.txt | crossing-ui | 20 / 20 |
| world-rules-selection.txt | world-rules | 20 / 20 |

Before comparison: those same 161 outputs had 24,589 exports and 2,361 named object failures. After: same export count, one logged object error. More selected packages are not a larger claim about the whole game.

## T5: native route and limits

`rea_client.py` starts the existing inspected MCP CLI, opens this executable, and submits named address batches. `rea-seeds.tsv` records seven explicit initial seeds. The process uses Ghidra's immutable-source import and local ephemeral database, not the game's runtime. Session closed after 53 successful pseudocode outputs; JSON receipts bind the target hash, provider version, parameters and results. No benchmark or whole-program completeness claim.

Method discovery: reflection name/function tables identified exec wrappers; traced direct callees led to bodies. Constructor-created vtables connected subquest and spawn-table methods. PE unwind ranges and diagnostic-string RIP references found required placement failure. Static field descriptors bind native offsets to QuestFailCount, RolledOneShots, Seed, Rarity and MaxUsageCount. No community SDK offset was applied to this build.

Ghidra sometimes has one-byte FunctionManager bodies while its decompiler follows a much wider flow. `read_function_instructions` returned an empty instruction list for one such body. That result was retained, not called complete assembly. Capstone independently confirmed the LCG/mantissa instructions from actual file bytes and decoded a tag-intersection leaf. Some leaf decodes extend into adjacent padding/functions if using a fallback range; conclusions use the bounded entry-to-return region only. Complete caller/body coverage and every indirect override remain open.

Named dead ends retained: two leaf procedure lookups did not resolve in REA; a manually requested audio probe used an address before its dependent lookup had returned, and was excluded from conclusions. The correct audio struct-ops maker was then read. An initial JSON PropertyType construction failed because the library has multiple constructors; an explicit recursive constructor fixed it before any accepted reread. Native static audio fields still do not explain the one incompatible cooked notify. No arbitrary compatibility patch was accepted.

## T6: private reference store

- `deep/extract/`: new package exports, full available dialogue text/conditions, 911 table rows, recipe records, config and generated usmap. Original first-pass roots unchanged.
- `deep/notes/`: public mapping history, private key/candidates, parser logs, per-package receipts/selections, native address chains, schema/offset records and structural audits.
- `deep/tools/`: byte scanners, generator, reader, native MCP driver, census and dossier generator. Reused DLLs copied locally; source diff for the custom struct is retained.
- `deep/extract/HASHES.txt`: every retained deep extract hashed. `deep/notes/provenance-hashes.json`: source tools, mapping inputs, helper and native evidence hashes. Hashes preserve byte identity; they do not validate a parse.

Raw dialogue, hidden routes, full data rows, decompiled code and AES values never belong in the public repo. Public source secrets use R2-S IDs; the boss route index stays private. No persistence acceptance or gameplay completion follows from this tooling.
