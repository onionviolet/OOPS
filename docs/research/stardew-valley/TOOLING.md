# Reproduce the static pass

Installed source: Steam app 413150, build/target 16826371; native assembly and Content paths in REPORT. No installed file changed, no game started, no save read. SHA-256 source/extract list: `~/.codex/research/fs-stardew/extract/HASHES.txt`, mirrored privately.

Tools already installed: ilspycmd 11.1.0.9782, decompiler 11.1.0.9782, user-local .NET, Python and Node v22.23.3. No tool/package install was performed. A source clone was created under the work area: [LeonBlade/xnbcli](https://github.com/LeonBlade/xnbcli), commit `499929e44593c65c66962a3aec3199e1f42b586c`. Reviewed package manifest and reader/decompressor dependencies before use. No npm install or repository shell script was run. Its pure JS LZX, BufferReader and error helpers were copied into work-area tools; local copies replaced color/log dependencies with no-op/identity helpers. Attribution/license stays with source clone; no vendor code in public files.

Commands that worked (paths are exact source/work locations):

```sh
DOTNET_ROOT="$HOME/.dotnet" "$HOME/.dotnet/tools/ilspycmd" --disable-updatecheck -l c "$HOME/Library/Application Support/Steam/steamapps/common/Stardew Valley/Contents/MacOS/Stardew Valley.dll"
DOTNET_ROOT="$HOME/.dotnet" "$HOME/.dotnet/tools/ilspycmd" --disable-updatecheck -t StardewValley.Object "$HOME/Library/Application Support/Steam/steamapps/common/Stardew Valley/Contents/MacOS/Stardew Valley.dll"
node "$HOME/.codex/research/fs-stardew/tools/xnb-reader/decompress.js" "$HOME/.codex/research/fs-stardew/extract/xnb/Data/Machines.xnb"
python3 -I "$HOME/.codex/research/fs-stardew/tools/read_xnb.py" "$HOME/.codex/research/fs-stardew/extract/GameData.cs" "$HOME/.codex/research/fs-stardew/extract/schema.json" "$HOME/.codex/research/fs-stardew/extract/xnb/Data/Machines.xnb.payload"
```

Targeted class exports only from main DLL: item/object/machines; farmer/friendship/save callers; dialogue/event/preconditions; crafting/shop/bundle/TV/profile/social menus; Farm and axe/pickaxe removal callers; Utility/GameLocation/Game1 to trace time, event/mail and shipping dispatch. The GameData model DLL was statically exported for reflection schema and subsystem inventory. Full class list is private/bulk. Never reference the game DLL in a new executable or use its content manager/runtime to deserialize.

Reader resolves declared public properties before fields, inherited models, explicit Id/Name getter properties, primitives, enums, nullable value types, lists, dictionaries, arrays, rectangles/points/vectors and skips static or serializer-ignored fields. It is a bounded metadata-driven parser, not a universal XNB tool. Chosen XNB headers were LZX; LZ4 explicitly fails. Every decoded file consumes exactly its payload length and decompresses to declared size. Success is structural decoding, not native gameplay or a second independent decoder.

Dead ends corrected: initial copied helper still required chalk in XnbError; patched work-area helper. Initial reflection parser missed non-auto Id/Name properties, enum list values, static fields and array member declarations; failed outputs were not used as evidence. Character model decode exposed these issues and now completes at exact byte length. Types `Objects.Television`, `Locations.Farm`, `BellsAndWhistles.Bundle`, and bare `SaveSerializer` were wrong names; actual TV/Farm/Menus.Bundle were found through type inventory. Actual `StardewValley.SaveSerialization.SaveSerializer` was then exported and read: it dispatches to XML serializers; full field-level runtime serialization and migrations remain unverified. NPC-named Abigail event file absent; events are location tables.

Parsed files/counts are listed in private `data/PARSED_FILES.json` and FINDINGS.json. Full source/data/logs are retained privately. Nothing staged, committed or pushed.
