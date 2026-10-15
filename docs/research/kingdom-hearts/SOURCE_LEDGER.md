# Source ledger, Kingdom Hearts

Lane mw-kingdom-hearts, dispatch 2026-10-14. Installation and source reads occurred late on October 14, America/New_York. No game, injector, Windows executable, personal save or CrossOver bottle was opened. This dossier is research, not gameplay verification.

Evidence labels: **SHOWN** means inspected installed bytes or tool source, **STATED** means format documentation or authored game text, **INFERRED** means architectural interpretation or YAIRPG proposal. A decoded file is not an exercised native consumer. Byte counts and rows describe the selected payload, not active gameplay coverage.

## Pins and locators

| Code | Source | Scope |
|---|---|---|
| S01 | Steam 2552430, build 15194255; install `~/Library/Application Support/Steam/steamapps/common/KINGDOM HEARTS -HD 1.5+2.5 ReMIX-/` | Manifest StateFlags 4; download and staging counters reached targets. `Image/dt/` contains KH1 and KH2 HED/PKG pairs. Installation present, game unrun. |
| S02 | [OpenKH pinned source](https://github.com/OpenKH/OpenKh/tree/7a3b945c538d32c6a285128c98aefba093f52ceb), Apache-2.0 repository, with per-file notices retained | Clone at `~/.codex/research/mw-kingdom-hearts/repos/OpenKh/`; XeEngine submodule `f55d4bd1fe4a9389ae9b01184e37f4ad30abca2e`. Third-party SaveData files carry their own GPL notices. No foreign code incorporated into YAIRPG. |
| S03 | `OpenKh.Egs/Hed.cs`, `EgsHdAsset.cs`, `EgsEncryption.cs`, `EgsTools.cs` | HED entries are 32 bytes with MD5-name hash, PKG offset and lengths. Original payload header controls encryption/compression and remaster headers. Three extracted tables cross-checked byte-for-byte through upstream EgsHdAsset. |
| S04 | `docs/kh1/worlds.md`, `docs/kh1/dictionary/mdls.md`, `OpenKh.Kh1/Ard.cs` | KH1 world/room names and 32-section room archives; resource list in section 5. All 239 selected KH1 ARDs indexed. |
| S05 | `docs/kh2/worlds.md`, `OpenKh.Kh2/Constants.cs` | 19 indexed world slots, including technical/special entries. Do not equate slots with 19 full Disney campaigns. |
| S06 | `OpenKh.Kh2/SystemData/Memt.cs`; [03system format](https://openkh.dev/kh2/file/type/03system.html#memt) | Native `03system.bin/memt`: 37 FM rows, 18 members per row and seven party selector records. Docs explain fallback/conditional overlays. |
| S07 | `SystemData/Cmd.cs`, `Arif.cs`, `Item.cs`, `Ftst.cs`, `Went.cs`; `docs/kh2/file/type/03system.md` | Command restrictions, area flags/music/UI command selection, item stats, font colors, weapon model bindings. Native tables retained in full. |
| S08 | [00battle format](https://openkh.dev/kh2/file/type/00battle.html); `OpenKh.Kh2/Battle/Lvup.cs`, `Fmlv.cs`, `Bons.cs`, `Btlv.cs`, `Sumn.cs` | Native growth, bonus, local battle level, summon definitions and form levels. Upstream parser cross-checks for levels/member rows, typed dumps for seven other families. |
| S09 | [00progress format](https://openkh.dev/kh2/file/type/00progress.html) | Installed 26 BAR entries: 19 world-keyed chunks and seven shared chunks. Pointer scripts change ARD programs, access, music, menus and map state. Semantics from docs; selected exact script examined. |
| S10 | `OpenKh.Kh2/Ard/AreaDataScript.cs`, `Ard/Event.cs`, `Ard/SpawnPoint.cs`; [ARD format](https://openkh.dev/kh2/file/type/areadata.html) | 289 selected English ARDs; 749 room scripts and 951 event records decoded by upstream parsers, zero errors in those families. 171,811 event commands decoded, not individually audited. |
| S11 | `OpenKh.Kh2/Libretto.cs`, `Msg.cs`, `Messages/MsgSerializer.Xml.cs`; [Libretto format](https://openkh.dev/kh2/file/type/libretto.html) | 22 message lists with 16,258 entries. Global `13libretto.bin` has 1,285 definitions and 1,486 referenced boxes under the pointer/terminator decode. Detailed text stays private. |
| S12 | [MSN format](https://openkh.dev/kh2/file/type/msn.html); `docs/kh2/file/ai/index.md`, `OpenKh.Command.Bdxio/` | 303 selected mission archives and mission headers. 339 BDX entries decoded successfully; selected musical/tutorial callbacks read. Native trap bodies and most AI behavior remain unread. |
| S13 | `OpenKh.Kh2/SaveData/SaveDataFinalMix.cs`, `SaveCharacter.cs`, `DriveForm.cs`, `SaveProgress.cs`, `SaveDataFactory.cs` | Tool-side save schema, not a personal save or Steam container audit. Characters, forms, inventory, world-party and room/story state are separate fields. |
| S14 | Installed `msg/us/wm.bar`: IDs 18820, 19499, 19500, 19501; `msg/us/jm.bar`: IDs 10837, 10839, 10843 | STATED route-clearing rule and return requirements: drive capacity 5, Magnera, Thundaga. Exact evaluator/caller remains unread. |
| S15 | Installed `msg/us/lm.bar`: IDs 5273, 17820, 17821, 18725, 18726; `msg/us/hb.bar`: 17625 | STATED local swimming/tutorial controls, musical mode, summon party exchange. Keep full text and control tokens in private captures. |

## Private reference store

[Private index](private/REFERENCE_INDEX.md) points to `~/.codex/research/mw-kingdom-hearts/extract/`. It contains original selected files, complete decoded English messages, cutscene commands, room scripts, full table dumps, KH1 resource lists, mission records, indexes and SHA-256 receipts. Nothing there is bundled into YAIRPG. Raw bulk remains outside git. `extract/HASHES.txt` binds the captured files; `selected-manifest.json` joins original names to HED shards, lengths and hashes. No full PKG hash or platform file-integrity verification was performed.

## Owner reconciliation

Read COMMON.md, ASPECTS.md, PROJECT.md first 80 lines, USER_VISION desktop/continuing-traveler/deep-reference direction, both world-core kit owners, the start/branch integration map and cross-game synthesis report. The prompt's `docs/NESTED_WORLDS_AND_DEEP_TROPE_CHAINS_2026_10_05.md` does not exist; used its owning dispatch at `docs/gm/dispatch/NESTED_WORLDS_AND_DEEP_TROPE_CHAINS_2026_10_05.md`.

Only this dossier and the assigned external work area were written. Current P01 work-feedback priority and canon-first order remain unchanged. Proposed ownership homes below are recommendations for the coordinator, not accepted owner edits.
