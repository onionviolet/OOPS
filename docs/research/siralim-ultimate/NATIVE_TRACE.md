# Named native traces, with limits

2026-10-14. GameMaker YYC, Steam build 20548371. Static only, no game or personal-save execution.

## Target identity and method

Original universal executable SHA256: `2046367bc20a32f4ddabffaf8067050669680b15cc3dc815dc383a1289228106`. Original `game.ios`: `442d90e49d918f661c4bc3d842fa4bc4a7ad090f6da053f45fe7593c587511a4`. Extracted arm64 SHA256: `c43b08a7ec56c24e914bb51de715d2940c68dbf797dcf53451d4e74e5b43946b`.

REA 6.4.0 over Ghidra 12.1.4 returned ten resolved procedures with pseudocode in the corrected first bounded batch. Private receipts: `notes/rea-bounded-native.json`, its `-summary.json`, and `extract/native/*.c`. Each target was selected by this binary's native symbols. Symbol-sized AddressSet restrictions stop the seed decoder from exploring the whole runtime. A private `strip -x -S` analysis copy preserves every `__TEXT` section byte and address; `notes/macho-code-identity.json` binds it to the original. The modified artifact has a different full-file hash, recorded there and in REA.

Annotation is mechanical: `tools/normalize_native.py` maps native function addresses back to original symbols and data offsets at `g_VAR`/`g_FUNC` entries back to their names. A `plus8` suffix means the compiled ID member at that exact offset, not a guessed semantic variable. Raw REA pseudocode remains alongside the annotated copy. This is not reconstructed GML, and inferred types remain uncertain.

**Limits:** no whole-image automatic analysis, no proof of complete caller coverage, and no runtime validation. Several bodies retain PIC-construction, unreachable-block or overlapping-global warnings. Ghidra sometimes follows an unwind path into a neighboring global-script registration stub in the returned C even when the initial decode was restricted. Do not treat those tails as verified function boundaries or gameplay behavior. Normal-path call/field observations below remain narrower than complete decompilation.

## First bounded batch

| ID | Function / original arm64 address | SHOWN static result | Interpretation / limit |
|---|---|---|---|
| N1 | `scr_InitDatabases`, `0x104b4b8bc` | Explicit calls to creature, passive, perk, spell-gem, material, quest, project, visual and other database families, then `inv_MaterialCacheBuildAll` and achievement localization | Real compiled initialization and a derived material cache. Not an external mechanics CSV loader or a mod API. |
| N2 | `scr_RealmGetProperties`, `0x104d513d8` | Builds property-ID/value arrays; branches for random numeric values, buff/debuff/minion selection; writes distinct `telerealmprops`/`telerealmvalues` and `hiddenrealmprops`/`hiddenrealmvalues`; reads frontier and fusion data | Pre-entry and hidden state are genuinely separate native data. Complete exclusion rules, weights, selected count and reward impact are not all resolved. |
| N3 | `scr_RealmHasProperty`, `0x104d54790` | Context guards, then a count-at-index-zero `realmprops` scan returning whether an ID matches | A shared property lookup, not a text-only declaration. Guard meanings require named enum/caller joins. |
| N4 | `scr_RealmPropertyGetValue`, `0x104d54c28` | Reads matching `realmprops`/`realmvalues`, `instability` and a mode flag; special IDs return derived values, others return stored values or a scaled numeric value | Property strength is not one universal lookup. Generic numeric branch appears to compute stored value plus half stored value times instability; keep this INFERRED until numeric ABI/order and exclusions are fully joined. |
| N5 | `scr_GetRaceArrayByRealm`, `0x104975684` | Switch over 30 authored realm mappings appends race constants to a count-prefixed array; optional second argument routes through a temporary two-column grid, sorting and destroying it | A concrete authored pool function plus optional presentation ordering. Full constant-to-name mapping and encounter spawn weights remain unread. |
| N6 | `scr_PlayerOutlevelsRealm`, `0x104cd5f1c` | Reads `daily`, `playerxp`, `floors`; calls `scr_PlayerLevel` and `scr_GetEnemyLevelByRealmLevel`; a disabled branch returns false | The ordinary comparison appears to be player level greater than 1.1 times the returned enemy level plus 5. INFERRED arithmetic, not the full enemy scaling formula or a proven reward penalty. |
| N7 | `scr_AddTrait`, `0x1012c32cc` | Scans global `extra_traits`, returns false for an existing entry; otherwise increments the count and appends the requested ID | Correction: this is a global unique-list helper. It does not prove a creature's temporary trait cap, acquisition eligibility or combat queue policy. |
| N8 | `scr_SetFusion`, `0x104d98738` | Reads `fuse_list`/`fuse_cache` and overworld variants; uses surface, palette extraction/swapping and skin/creature references | Correction: visual fusion caching. It is not the body/stat/trait/payment merge transaction. That requires `scr_Fuse` and its UI caller. |
| N9 | `scr_SaveGame`, `0x104d93f58` | Checks existing instances and context, then creates `obj_savegame` (OBJT index 887) | Save request wrapper. Does not directly prove serialized fields, durable replacement or atomicity. |
| N10 | `scr_LoadGame`, `0x104b946a0` | Selects among five `loadbuff_main*`/`loadid_main*` entries by save slot; sets up asynchronous buffer loading with group/options/load/end helpers | Reads are staged through async infrastructure. Completion, decoding, version/migration and recovery are further consumers, not proved by a successful async request. |

Full normal-path bodies, field names, branches and raw constants remain private. The repo keeps only short identifiers, paraphrase and evidence locations.

## Follow-up

The second bounded batch returned five pseudocode bodies and one error. Final total: **15 returned bodies of 16 named targets**, not whole-game coverage. `notes/rea-followup-native.json` retains both success and error envelopes; `tools/normalize_native.py` retains the five successful bodies privately. The save Step method failed decompilation with a timeout under the private 30-second budget. No unchanged request was repeated after this bounded result.

| ID | Function / original arm64 address | SHOWN static result | Limit |
|---|---|---|---|
| N11 | `scr_Fuse`, `0x1048ec42c` | Reads both parents, calls inventory-return helpers, computes average XP through `thylacine_round`, creates a result creature, writes `fuse1`/`fuse2`, skins and chosen sort; retains primary nickname, strategy, macro, item, personality, GUID and training fields; calls stable remove/add and `scr_UpdateCreature`, then visual `scr_SetFusion` | This is the logical merge body. Exact base-stat/trait realization is delegated to creature/update consumers; UI admission/payment and complete item custody need further calls. No atomicity or no-duplication claim. |
| N12 | `scr_GetEnemyLevelByRealmLevel`, `0x10495c8a4` | Reads `biome` and `difficultylevel`, branches on a second argument, adds difficulty coefficients to base 0.03, applies mode factors, rounds upward and floors the result at the input depth | The curve below is INFERRED from identified operators; exact calling context and displayed result remain unrun. |
| N13 | `scr_BiomeGod`, `0x1012ea91c` | Thirty-branch authored biome-to-patron mapping | Full numeric constant-to-localized patron-name join unread. This is an issuer identity function, not a social AI. |
| N14 | `scr_BiomeName`, `0x1012eb41c` | Thirty-branch authored biome-to-text lookup | Localized names are separately retained in vocabulary CSV; full constant initializer join unread. |
| N15 | `obj_savegame` Create, `0x1059908bc` | Initializes stepped save bookkeeping; updates player creatures, checks/copies files, sets async group options, creates a buffer and opens an INI string | File copy branches demonstrate backup-like activity, not proved crash-safe replacement or recovery. No personal file was opened by this research. |
| N16 | `obj_savegame` Step, `0x10599277c` | Named method exists, about 261,492 bytes to the next text symbol; returned pseudocode request failed under the bounded decompile policy | **Unread.** No full serializer, commit sequence or migration proof. Error diagnostics retain decompiler timeout; further work should split by named serialization helpers or decode a selected control-flow region. |

### Inferred depth curve, bounded branch

Let d be the input depth. The returned level appears to be `max(d, ceil(c * d * d * (1 + d / 1000)))`. The base coefficient is 0.03. Where the function permits difficulty adjustment, ten difficulty cases add 0, 0.01, 0.02, 0.04, 0.08, 0.16, 0.32, 0.64, 1.28 or 2.56. A second argument or a particular biome bypasses that adjustment. Separately, `mode[0]` values 0 and 2 multiply the coefficient by 0.65 and 3; other values leave it unchanged. Mode labels are not assigned from numbers without their authoring join.

For the c=0.03 branch, depths 10, 100 and 1000 give inferred levels 10, 330 and 60000. This is static arithmetic derived from normal-path operators and IEEE constants, not a played measurement, complete enemy stat formula, loot curve or YAIRPG balance recommendation. The separate outlevel helper N6 uses the result through its own caller flag.

### Fusion identity takeaway

PROPOSAL: preserve origin references and deliberate inherited control fields separately from a new object's current stats. The real native merge also revises inventory and roster membership, so fusion is a transaction across owners rather than a display cache refresh. For YAIRPG this extends P16/P05 and K3/K9/K15/K18; no creature-merging feature is selected by this research.
