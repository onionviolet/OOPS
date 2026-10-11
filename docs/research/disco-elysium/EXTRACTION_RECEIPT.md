# Disco Elysium extraction receipt

Completed assigned extraction and targeted read-only audit on 2026-10-10. Install build 23980936, StandaloneOSX. Evidence classifications and semantic limits are in FINDINGS/COVERAGE.

## Recovery

E1 **Seen in data or code:** inventory captured 2,270 files totaling 11,470,467,627 bytes. Seven useful inputs were retained privately: the universal GameAssembly dylib, IL2CPP metadata, dialogue bundle, resources.assets, globalgamemanagers, globalgamemanagers.assets and build_info.txt. `SOURCE_RECEIPTS.json` holds original paths, bytes, SHA-256 and copy equality. None is a user save.

E2 **Seen in data or code:** existing private `tale-extract-venv` provides UnityPy 1.25.4 and Capstone 5.0.9; the existing dotnet SDK and Il2CppDumper 6.7.46 were reused read-only. No new shared tool installation. UnityPy recovered the dialogue bundle's full embedded typetree and indexed 112,962 nodes. Private `extract_dialogue.py` reproduces normalized actors/items/conversations from the retained bundle.

E3 **Seen in data or code:** generic stripped MonoBehaviour typetrees in resources did not decode their complete payloads. Switched to generic header reads without requiring a full typetree, resolved MonoScript 1315 through globalgamemanagers.assets, then used recovered serialized field order for project primitives/PPtr arrays. Private `scan_thoughts.py` and `parse_effects.py` record this route. All 53 projects and referenced primitive effect data are retained with raw slices and locators. String/translation tails remain opaque; this is not a full-object decode claim.

E4 **Seen in data or code:** Il2CppDumper initially stopped because a redirected process could not choose a universal-binary architecture. Running with a PTY and selecting architecture 1 (x86_64) completed metadata v27.1 recovery. CodeRegistration 0x2A25758 and MetadataRegistration 0x2A26670. Generated dump.cs, script.json and DummyDll are useful signatures/address maps; DummyDll method bodies are stubs.

The invoked dumper used the existing dotnet host with `DOTNET_ROLL_FORWARD=LatestMajor`, the retained `inputs/GameAssembly.dylib` and `inputs/global-metadata.dat`, and output directory `~/.codex/research/disco-elysium/il2cpp/`. It analyzed the binary, not the installed game process.

E5 **Seen in data or code:** private `disassemble.py` reads the x86_64 fat-binary slice, verifies the __TEXT VM/file mapping, resolves selected method addresses using script.json, bounds ranges by the next known address and writes `NATIVE_SELECTED.asm`. Seventeen selected ranges were disassembled and reviewed. Concrete field accesses and native instructions support the findings; shared generic call labels can be ambiguous. No claim of full native decompilation.

## Retention and checks

Verified core input copies against SHA-256, checked all 53 project/effect pointer bindings and primitive enum values, recorded corpus/check annotation counts in AUDIT_STATS.json, retained exact selected scene graphs, and checked local document links. RETENTION.json indexes retained files with hashes; CHECKS.json records the final verification results.

Before the extraction/decompilation phase that could write more than 200 MB, `df -h ~` showed 5.3 GiB available. A later check showed 6.0 GiB. The below-3-GB extraction pause did not apply. The full install was never copied. Music, voice, artwork and most asset payloads were neither copied nor decoded.

Once normalized text and useful recovery outputs existed, removed only this task's redundant full typetree JSON and generated il2cpp.h, 192,397,397 bytes in total. CLEANUP.json records the deletion. Raw useful source inputs, normalized text, selected scenes, raw component slices, metadata signatures and address maps remain private. No install file was deleted or changed.

No game launch, save/settings access, build, test of YAIR gameplay, source edit, commit, push or uninstall. Pass complete; Weibao can remove the install at his choice. Runtime/native activation and the broader content coverage remain exactly as bounded in COVERAGE.md.
