# mw-siralim checkpoint

Status: PARTIAL

2026-10-14. Requested read-only installed-game research completed to the bounded evidence below. Further gaps are explicit, not implied gameplay gates. Only `docs/research/siralim-ultimate/` was written in the repo. No game launch, personal-save access, source edit, stage, commit or push.

## Done

- **D1:** Dispatch/common/aspect contracts and relevant live owners read. Nested-world owner recovered at its actual path, `docs/gm/dispatch/NESTED_WORLDS_AND_DEEP_TROPE_CHAINS_2026_10_05.md`. Accepted desktop/canon-first/persistent-instance direction retained. No owner/index/Province War edits.
- **D2:** Steam app 1289810, installed build 20548371 identified. GameMaker YYC established from absent CODE chunk plus native GML bodies. Extracted 64,052 strings, 5,785 SCPT records, 1,160 OBJT records and 79 ROOM records. All 24 localization CSVs preserved privately: 37,568 logical records including complete dialogue/lore/tables, not assumed entity counts.
- **D3:** REA over Ghidra, named functions only: first bounded batch 10 returned bodies; follow-up 5 returned bodies and one decompile timeout. **15 of 16 targets**, with inferred types, PIC/unwind/boundary limits retained. Realm properties, pool construction, semantic versus visual fusion, depth curve, database initialization and save setup are documented in NATIVE_TRACE. Full game decompilation is not claimed.
- **D4:** Standard outputs, realm/carry and build/computation digests, native trace, A01-A12 JSON/Markdown, system inventory and three deeper reads saved. Seven ranked proposals mapped to kit parts and synthesis packets; SU-P04 is a new bounded extension, not an accepted shared-engine requirement. Twenty-four small touches. Fourteen machine-readable findings.
- **D5:** Verification passed: 13 required files, exact A01-A12 keys/allowed statuses, JSON parse, unique finding IDs, 24 touch IDs, 14 local Markdown links, no em dashes and unchanged hashes for all 27 pinned installed files. No game/YAIRPG tests, build, browser or persistence roundtrip was run. Private extract manifest hashes 57 files.

Private root: `~/.codex/research/mw-siralim/`.
Measured retained disk after REA cleanup: **415,636 KiB, about 406 MiB**. Dependency symlink points to existing REA dependencies and is not counted as a new installation. Transient projects cleaned on session close; no lane-owned game or decompiler remains running at final inspection.

Main-checkout observation during final source routing: branch `codex/gameplay-foundations`, HEAD `dcd8d4070426c1f8a12e74fd5752bced36663a60`. Shared work was already dirty and moving; this pin records a read, not ownership or a clean-tree claim. All substantive research here is proposal/source evidence only.

## Next pending item and exact resume

Highest-payoff continuation: join the 30-way `scr_GetRaceArrayByRealm` output to named race constants and each realm's object/quest spawning. Use existing `extract/native/`, symbol map, full CSVs and `notes/*-reference.json` rather than reacquiring text. For durability, select a small `save_Creature`/`load_Creature` plus actual Step/completion caller region instead of rerunning the entire large Step method unchanged.

`TOOLING.md` owns commands/pins. `tools/archive_index.py`, `localization.py`, `normalize_native.py`, `macho_verify.py`, `rea_bounded.py`, `rea_followup.py` and `verify_dossier.py` are private rerun tools. `notes/source-hashes.json` and `extract/HASHES.txt` bind source/extract identity. REA's seed-range and 30-second decompiler patches are retained as diffs/hashes. Original failed/stopped runs remain evidence.

## Unread table

| ID | Exact gap | Why / what resolves it |
|---|---|---|
| U1 | Full 30-realm enemy pool, object and quest join | Pool constructor and biome/name/patron functions decoded, but constant-initializer-to-name map and all spawn/quest conditions not joined. Read named initializers and selected realm generator/object consumers. |
| U2 | Exact fusion base-stat/trait realization, admission, payment and complete custody | `scr_Fuse` normal path decoded, but `scr_Creature`, `scr_UpdateCreature`, rounding and inventory/stable helpers and UI payment caller not closed. No transaction, no-duplication or full rounding proof. |
| U3 | Trait dispatch, limit resets, Calm/relic exemptions and startup numbering conflict | Installed help and event/reaction names read; actual `bc_Event*`/`bc_On*` queue consumers not traced. Global `scr_AddTrait` does not enforce the described per-creature cap. |
| U4 | Save field publication and completion | `obj_savegame_Step_0` at `0x10599277c`, about 261,492 bytes to next symbol, timed out under the final 30-second budget. Create/wrapper/async setup does not prove complete serialized retention. Split into selected helpers or bounded control-flow regions. |
| U5 | Migration, corrupt-file rejection, backup selection and recovery | `scr_LoadMain`, per-domain serializers and async completion remain unread. File copy activity in Create is not proof of crash-safe recovery. No personal saves were inspected. |
| U6 | Complete dialogue eligibility, flag writes, speaker/portrait and relationship graph | All full text/IDs retained; only explicit menu choices/errors and selected scene structures read. Follow native speaker/menu/object callers, preserving original lines privately. |
| U7 | All minigame rules, collection modifiers, crafting sinks, loot weights and odds | Tables and subsystem names inventoried; only bounded representative systems analyzed. Narrow by a concrete downstream decision. |
| U8 | Live desktop controls/layout, rendered comparisons, source-game save roundtrip and persistent-society behavior | Game execution is prohibited by dispatch. Static data cannot establish these. No UI/native play or independent-world society parity is claimed. |

## Delivery boundary

Coordinator may commit this output directory and route its proposals; this lane did not stage or commit it. Top three: SU-P01 useful local encounter grammar, SU-P02 source/lifetime/usability inspector, SU-P03 explicit retained-carrier travel preview. Full native proof, playable YAIRPG adoption, rebuilt desktop acceptance and any affected persistence roundtrip remain separate work for a selected live owner.
