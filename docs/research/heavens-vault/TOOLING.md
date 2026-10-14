# Tooling and rerun record

## Scope and identity

Steam app 774201, build 4220136, Windows depot 774202 manifest 6790446026763573193. At lane start the executable existed, StateFlags was 4, staging zero and installed/downloaded byte totals matched. Read-only payload root: `/Users/weiwei/Library/Application Support/Steam/steamapps/common/Heaven's Vault/`. Assembly-CSharp and Mono directory establish Unity Mono. No IL2CPP route was needed. No game executable, injector, Steam dialog or save was opened.

Work root: `~/.codex/research/heavens-vault/`. All raw game data, source and clones remain there. Installed source hashes are in `notes/payload-hashes.json` and this lane's FINDINGS.json. SHA256 for every extract file is in `extract/HASHES.txt`.

## Tools and installs

Existing: `~/.dotnet/dotnet` SDK 10.0.402 and `~/.dotnet/tools/ilspycmd` 11.1.0.9782. No system installation changed.

Lane install: `python3 -m venv ~/.codex/research/heavens-vault/tools/venv`, followed by venv `python -I -m pip install UnityPy`. Python 3.15; UnityPy 1.25.4. Pip built UnityPy, lz4 and tpk_ar wheels; download/build took several minutes but succeeded. Full log `notes/pip.log`; exact dependencies in `notes/requirements.freeze.txt`. Dependency package cache writes follow normal pip behavior outside the repo.

Installed dependency versions:

```text
archspec==0.2.6
astc_encoder_py==0.1.12
attrs==26.1.0
brotli==1.2.0
etcpak==0.9.15
fmod_toolkit==0.1.3
fsspec==2026.9.0
lz4==4.4.5
pillow==12.3.0
pyfmodex==0.7.2
texture2ddecoder==1.0.6
tpk_ar==0.2.4
UnityPy==1.25.4
```

Read-only reference clone: `https://github.com/inkle/ink.git`, shallow clone under `repos/ink`, commit `35c63e52f1d36060930dc7ed3cfba38ea224b528`. Read Documentation/ink_JSON_runtime_format.md; did not build or execute the repo. The shipped game runtime is the authority for ink format 19; current upstream documentation is explanatory, not proof that the game uses the latest upstream runtime.

## Commands that worked

```sh
python3 -m venv "$HOME/.codex/research/heavens-vault/tools/venv"
"$HOME/.codex/research/heavens-vault/tools/venv/bin/python" -I -m pip install UnityPy
DOTNET_ROOT="$HOME/.dotnet" "$HOME/.dotnet/tools/ilspycmd" -p \
  -o "$HOME/.codex/research/heavens-vault/extract/csharp" \
  "/Users/weiwei/Library/Application Support/Steam/steamapps/common/Heaven's Vault/Heaven's Vault_Data/Managed/Assembly-CSharp.dll"
git clone --depth 1 https://github.com/inkle/ink.git \
  "$HOME/.codex/research/heavens-vault/repos/ink"
"$HOME/.codex/research/heavens-vault/tools/venv/bin/python" -I \
  "$HOME/.codex/research/heavens-vault/tools/extract_textassets.py" \
  "/Users/weiwei/Library/Application Support/Steam/steamapps/common/Heaven's Vault/Heaven's Vault_Data" \
  "$HOME/.codex/research/heavens-vault/extract/textassets"
```

ILSpy completed with empty error log and 1299 C# files. Extraction script is retained in the work area. It iterates top-level `.assets` and `levelN` files one at a time, reads only TextAssets, writes a sanitized source/path-ID/name filename, and records size/hash in INDEX.json. ERRORS.json is empty. No game assembly was loaded for execution. Analysis scripts parsed JSON as data without invoking ink story code.

## Navigation for rerun

Read `extract/textassets/INDEX.json`, then `notes/census.json`. Search decompiled Translation/EntityLexDictionary.cs, Translation/SubstitutingStateView.cs, Translation/TranslationGameTranslationModelWord.cs, Translation/TranslationModel.cs, StoryScript.cs, Player.cs, TimelineEvent.cs, Game.cs and SpaceGame.Pathfinding/*.cs. Generic ink helpers inspected: showing_uncertain_translation, note_learned_word, ArtefactTranslationSolved and loadInscription. Their prose-free structural snapshots are in notes/shape_*.json.

Hash reproduction: recursively enumerate regular files in extract except HASHES.txt, SHA256 each byte stream and record its relative path. Input hashes cover exe, Assembly-CSharp.dll, resources.assets and sharedassets0.assets. Hashes identify inspected bytes; they do not prove gameplay.

## Web evidence and dead ends

Read the [official game page](https://www.inklestudios.com/heavensvault/), [developer explanation of translation and site progress](https://medium.com/@inklestudios/why-does-translation-unlock-sites-in-heavens-vault-e05c4ccadf62), and [ink JSON documentation](https://github.com/inkle/ink/blob/master/Documentation/ink_JSON_runtime_format.md). No wiki dump was needed after primary code/data became readable. Web results were read through the web tool and not saved as full dumps. No fetch failed.

An initial docs-wide notebook/known grep was too broad and truncated its output. Narrow searches to the named owners and files; do not repeat an unrestricted dump of docs. A premature clone HEAD query ran before clone completion and failed; the completed clone then yielded the pinned revision above. UnityPy setup was slow, not failed. AssetRipper, Ghidra and native game execution were unnecessary.
