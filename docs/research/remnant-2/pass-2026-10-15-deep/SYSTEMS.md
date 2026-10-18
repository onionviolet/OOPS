# Systems recovered in the deep pass

SHOWN means a static read of this executable or a clean selected asset export. STATED means a named third-party parser/tool source. INFERRED marks interpretation or an adaptation. None means played. All game locators below belong to installed build 16320528, executable SHA256 `0f4783f75ec178724ddbe10baee55a38ce4311bebf1a8bacd0626b9d8f7d0265`, preferred image base `0x140000000`. Native addresses are preferred virtual addresses, not process addresses.

## S1: static reflection and the repaired reader

SHOWN: the shipping executable retains 7,552 recoverable class/struct registration entries. The generator found 4,659 class and 2,893 struct property lists, with no list rejected by its structural checks. It compared 205 changed type layouts against the archive mapping. This is a type-list count, not a claim that all custom serializers are reflected.

Examples that explain earlier failures:

| Type | Native change / recovered detail | Locator |
|---|---|---|
| RemnantQuest | ManualOrderID is inserted after IsOneShot; later field positions shift. ServerStatus replaces the older label in the map. | Class params 0x145d7ac10 |
| Quest | Adds NewUnprocessedComponents and NewProcessingComponents after ParentQuestComponent. | Class params 0x145fde7d0 |
| StatModTableEntry | Adds AllowOverrideRequiredContextSlot between RequiredContextSlot and Description. | Struct params 0x147665420 |
| SpawnTableItem | Starts with bScaleWeightIfOwned and OwnedWeightScalar, before ItemBP and quantities. | Descriptor records in notes/static-mapping.json |
| EventTreeNode_Dialog | Native property list includes attachment/play parameter records and default-speaker/vocal-range controls. | Type list and descriptor addresses in static-mapping.json |

VariableValue has **zero reflected fields** but an explicit native serializer. REA followed its struct-ops maker at 0x1424e4250 to vtable 0x14604faa0 and the serializer at **0x1424ec010**. It reads a one-byte kind followed by no payload, a four-byte Boolean, a four-byte integer, a float, or an archive FName. The public save parser independently uses the same none/bool/int/float/name kind order. A local CUE4Parse addition implements those reads and rejects unknown kinds. It does not skip unread bytes.

The generated usmap has 7,775 types. Native lists are derived from this exact executable; 223 fallback types and 1,770 enum-label tables remain from the archive. This is a **statically regenerated hybrid**, not a wholly new verified dump. One selected audio notify still misreads GunfireAudioPlayParams/GunfireAudioAttachParams. Its native eight-property list differs from the old map's nine-property list, but no justified compatibility parser was established. No guessed field insertion was accepted.

## S2: native generation chain

Names attached to reflection wrappers are SHOWN. Helper descriptions below are inferred names for traced bodies, not recovered debug symbols. Private `rea-*.json`, `native-*.c` and `native-field-offsets.json` bind each address to its evidence.

| Address | Identity / source | What was read |
|---|---|---|
| 0x14201f700 | RemnantQuestSubQuest vtable slot 205, reached from its native constructor | Advances context seed, applies ChanceToSpawn, selects a pinned QuestBP or resolves a filtered candidate, records usage and chosen quest. |
| 0x141ffcf90 | Selection helper called by the preceding body | Usage/type/tag/exclusion filtering, rarity weights, saved miss counts, weighted draw, selected entry copy. |
| 0x1422b2c50 | Traced tag helper | Checks whether all names in the first tag list occur in the second, with explicit empty-list behavior. |
| 0x1422beaf0 | Leaf tag helper, REA had no procedure; decoded from file bytes with Capstone | Returns true when any 64-bit tag token appears in both lists. Selection rejects that result for exclusions. |
| 0x14202b6a0 → 0x141fff5d0 | Reflected RemnantQuestManager.CreateRootQuest wrapper → creation body | Resolves registered root, replaces a prior slot occupant, assigns quest ID, a newly supplied seed, slot and other creation inputs. Complete failure settlement is unread. |
| 0x14202b9a0 | Reflected DestroyRootQuest wrapper | Adjusts active-slot/main-campaign metadata, invokes root cleanup and removes the quest. It is not evidence that every traveler carrier is destroyed. |
| 0x14202f260 → 0x14200db40 | Reflected GetRegisteredRootQuestsForMode → filter body | Root type + requested game mode, required-award availability and prior one-shot state; later filtering considers corresponding one-shot definitions. |
| 0x142032020 → 0x142011a20 | Reflected IsOneShotRolled → membership helper | Checks the saved RolledOneShots list only for a definition flagged one-shot. |
| 0x14201bbc0 | Required-tile placement diagnostic xref | Marks required placement failure and returns false; an explicitly optional tile follows a different branch. Full path-connectivity solver is not recovered. |
| 0x142462c20 → 0x1424462e0 → 0x142446f20 | Reflected SpawnTable.GenerateWithSeed → virtual generate → table body | Explicit seed context, eligibility/level/tag filters, table/list/group variants and weighted entry selection. This is a separate spawn-table layer. |

### S2.1: weights and history

SHOWN in 0x141ffcf90: entries whose current usage reaches MaxUsageCount are excluded. Candidate Type must match. Requested tags must be present in the entry; the entry's parent requirements must be present on the parent; a nonempty exclusion intersection rejects it.

Rarity codes 0..4 map to base weights **100, 50, 25, 10, 5**. The archive names them Common through Legendary; numeric branches are confirmed in this executable, while the names retain archive provenance. A saved miss count, when found, multiplies the weight by `count + 1`. The selected entry is removed from that miss map; other eligible entries have their counts incremented. Reflection binds the map at offset 0x58 to **RemnantSaveGame.QuestFailCount**. RolledOneShots is separately at 0xa8. These are world-save fields, not proof of an account-wide pity guarantee.

INFERRED: repeated eligible misses make a future selection more likely. No finite guaranteed selection count was proved; ineligible content does not gain a demonstrated universal guarantee. Source MaxUsageCount and one-shot rules must stay source-specific in YAIRPG proposals.

### S2.2: seeds and chance

SHOWN: the subquest body updates the context state with `state * 0x0BB38435 + 0x3619636B`, keeping the low 32 bits. At instructions 0x14201f724..0x14201f730, SHR/OR/MOVD construct the floating fraction from mantissa bits. The body compares the resulting `1 + 99 * fraction` against ChanceToSpawn. This is a 1-to-less-than-100 roll, not a guessed independent percentage implementation. The selector uses the same update constants to choose a point in cumulative integer weight.

Creation helper 0x141fb42f0 derives a fresh value from rand(). Selection helper 0x141ffcf90 substitutes rand() when its supplied seed is -1; SpawnTable.GenerateWithSeed substitutes rand() when its exposed seed is 0. Those sentinels differ. A root-seed debug override is registered at 0x1408042c0; its complete caller propagation was not traced. Do not claim that one seed alone reproduces all rewards, content revisions, profiles and call orders.

### S2.3: reroll and adventure

SHOWN in clean UI/UI_DATLA/Widget_WorldMenuDialog bytecode: BuildCreateQuestList calls GetRegisteredRootQuestsForMode; the creation/destruction flow reaches DestroyRootQuest, CreateRootQuest and ActivateRootQuest. The graph also calls CommitSave. This is a static UI-to-native chain, not a rendered or atomic-save test.

The native mode filter reads required award and one-shot history. Clean DLC adventure defaults additionally hold entitlement references and manual ordering. Base adventure wrappers contain world-specific story filters; campaign children include fixed Labyrinth and Root Earth references. The complete entitlement evaluator, all campaign/adventure quest-item exceptions and rollback after every failed write remain open. A call to CommitSave is not proof of crash consistency.

## S3: world rules, factions and bosses

The selected dataset has 206 clean quest defaults. The table below reports coverage signals, not complete world content counts or playable branch counts. DLC roots are kept separate instead of silently added to their base world's total. Boss packages include explicit boss/miniboss quest definitions; a branch instruction may be a validity check rather than a player choice.

| World | Clean quest defaults | Selected boss/miniboss packages | Conditional script nodes in those packages | EventTree packages |
|---|---:|---:|---:|---:|
| Losomn | 38 | 5 | 36 | 31 |
| N'Erud | 40 | 5 | 38 | 11 |
| Yaesha | 41 | 8 | 48 | 13 |
| Labyrinth | 2 | 0 | 0 | 2 |
| Root Earth | 3 | 1 | 19 | 2 |
| DLC/other | 82 | 9 | 88 | 68 |

| World | Hazard / traversal evidence | Faction evidence | Boss/closure boundary |
|---|---|---|---|
| Losomn | Clean Fae story and zone-door/portal definitions; shared curse actions are now readable but their application is not assumed for every Fae encounter. | Story and interaction scripts can act through shared affiliation overrides. No complete per-person faction reaction table. | Selected boss quest branches, item/variable predicates and reward calls retained privately; alternate reward solutions stay behind route IDs. |
| N'Erud | DeathFog overlap volume, elapsed exposure, action application and exit cleanup remain concrete. | Shared faction grammar plus Nerud quest/entity references; all hostility exceptions unread. | Clean story/boss defaults expose linked subquests and native reward conditions; all endings and later availability not fully proved. |
| Yaesha | Bloodmoon event/spawn scripts and rot-cloud behavior newly extracted; exact timing and reward routes remain private/incomplete. | Shared affiliations and local quest/state conditions, not one flat species hostility rule. | Boss/miniboss condition/reward structure readable; full route truth and causal aftermath need more traces. |
| Labyrinth | Portal definitions and states now read, plus quest/zone links. A visual portal's presence is not proof of every destination/timing rule. | No complete local affiliation roster established. | No package matches the selected boss-directory naming convention; this is a coverage limit, not absence of a boss. |
| Root Earth | Explicit campaign zone chain and cinematic transition action; no full hazard ecology decoded. | No complete local affiliation roster established. | Final-zone quest branch structure retained; complete combat phases remain unread. |

SHOWN global faction grammar: clean Faction_NPC has same-faction SuperFriendly affiliation, enemy definitions can disable friendly-fire scaling, and BP_TriggerFactionOverride supplies a target faction, replacement affiliation and radius. Defaults and trigger bytecode are not a proof of every placed instance or world law. A full faction matrix needs character defaults, placed overrides and triggered changes joined together.

Private boss IDs R2-B01 onward map to source paths and branch counters in `boss-route-index-private.json`. Discovery families R2-S01..R2-S03 retain the first pass's IDs; R2-S04 labels newly readable hidden/secret ingredient and reward predicates. No hidden solution is published here.

## S4: progression, equipment and craft

SHOWN: 58 clean DataTables contain 911 rows. StatModTableEntry now retains context-slot overrides, descriptions and hidden flags rather than aborting at the new Boolean field. For a nonsecret example, Trait_Vigor_Stats has ten rows, HealthMax bonuses 3, 6 and onward through 30. This is a data-row progression, not a native combat calculation or a proposal for YAIRPG's health scale.

Selected archetype unlock rows distinguish level, granted modifier, required context slot and hidden display status. That is stronger evidence for separating learned faculty, active slot and current use than the old broken tables. Default omitted values still inherit from native/content parents; a sparse export is not a zero-filled full stat block. All selected ring/amulet definitions are readable; no universal balance or portability rule follows from their item category.

SHOWN: 223 CraftingRecipe exports specify outputs, item level/quantity or tags, stable GUIDs, ingredient references and quantities, upgrade type, and hidden/secret-if-missing controls. For a nonsecret ordinary weapon upgrade, level 1 lists 4 Iron + 200 Scrap; level 2 lists 6 Iron + 220 Scrap. These are authored rows, not proof that a single linear formula governs all twenty levels. Full rows stay private.

Native reflected CraftingComponent.CraftItem at 0x1421bd070 calls a validation virtual method before dispatching the actual craft implementation. GetRecipeInfo at 0x1421bedb0 reaches 0x1421a9270, which gathers ingredient ownership and recipe eligibility. Buy-value calculation reaches 0x1423a1ed0 and uses inventory/value information plus optional stat adjustments. Sell-value wrapper 0x1423cb860 multiplies value by a supplied scalar and uses SSE rounding operations. Exact tie behavior, every virtual override and commit-time consumption were not generalized from this partial chain. This is not a native transaction-conservation proof.

## S5: dialogue and branch integrity

SHOWN: all 127 EventTree-named assets in the original index selection read without logged errors. They contain 8,787 text-bearing EventTreeNode_Dialog exports and 2,207 Branch_DialogOption exports. Available text, localization keys, speaker references, variables, items, priorities, trigger nodes, rewards and removal effects are preserved privately in full.

A separate validator checked **43,096 internal references** for target export-index existence and terminal-name agreement, with zero issues after handling qualified outer names correctly. This test does not prove external references, graph reachability, all condition semantics or paid outcome conservation. Cycles are not rejected merely because dialogue can repeat. Keep source truth out of actor hints until discovery. R2D-P04 extends MWA-P04 and the existing P19/P24 route, not a new narrative engine.

## S6: persistence format and ownership

SHOWN reflection from this executable separates RemnantSaveGameProfile from RemnantSaveGame. Profile fields include characters, active-character index, account awards, entitlements and currencies. World-save fields include active root slot, quest/zone ID generators, QuestFailCount and RolledOneShots. These definitions support carrier-specific ownership; they do not alone prove every field's save lifecycle.

STATED by the inspected [public parser source](https://github.com/AndrewSav/lib.remnant2.saves/tree/d5190d44e1ded9c2b2bc0c5968c593aa390a4518): Archive reads chunk headers, inflates zlib and checks CRC32. The expanded FileHeader includes CRC, size, version and build number. SaveData uses package/class information, name-table and object-table offsets, per-object properties and components. Its reader preserves extra unparsed bytes rather than silently treating all bytes as understood.

Source locators: `Compression/Archive.cs`, `Compression/Model/ChunkHeader.cs`, `Model/Memory/FileHeader.cs`, `Model/SaveData.cs`, `Model/UObject.cs`, `Model/Variable.cs`. The chunk-size constant is 0x20000, compressor ID 3, and the parser expects version 9 while warning on a different version. Its CRC mismatch path throws. These are parser-supported format claims, not a sample from a personal save or proof of the game's migration, backup recovery or write atomicity. No save parser was run against a save.

## S7: A01-A12 delta and inventory

| Aspect | New evidence | Remaining status |
|---|---|---|
| A01 Dialogue | Clean graphs, variables and local reference check | Partial: external reachability and native effects |
| A02 Narrative | Clean quest defaults/objectives and boss branch structures | Partial: every ending/aftermath |
| A03 Architecture | Static native schema, custom serializer, 53 REA pseudocode outputs | Partial: full engine/caller coverage |
| A04 Persistence | Native profile/world fields plus public parser format | Partial: native migration/atomicity, no sample save |
| A05 AI/NPC | Base faction grammar and override behavior | Partial: complete character/placed faction joins |
| A06 UI | 20 clean crossing/world-menu packages | Partial: unrendered, no keyboard/runtime claim |
| A07 Authoring | Native property lists, rows and graph integrity validator | Partial: all content validation rules |
| A08 Balance | Rarity/history weights, progression rows, recipe/price paths | Partial: every override/rounding edge |
| A09 Time | Seeded selection versus timer/hazard time kept separate | Partial: full event/calendar/away policy |
| A10 Reveal | Required awards, one-shot/entitlement structures and secret-ingredient flags | Partial: source unlock routes private; exact all-call enforcement |
| A11 Touches | Exposure cleanup, precise quote/data and branch conditions | Partial: no audiovisual play |
| A12 Other | Craft, economy, account versus world progression | Partial: full prism/relic/optional mode behavior |

Inventory of newly read families: native reflection (7,552 type lists), selected quests (206 defaults), progression (58 tables/911 rows), equipment (ring/amulet defaults), craft (223 recipe exports), factions (8 named packages plus shared override), world menu (20 packages), rule/portal actions (20 packages), all selected EventTrees (127 packages), and native functions (53 successful pseudocode outputs, with leaf/boundary limits). Complete source locators, row counts and type census are in private `widen-analytics-private.json`, `widen-types.json`, `native-read-inventory.json` and selections. The first pass's inventory remains a dated baseline.

Highest-payoff deeper systems are S2's eligible/history-weighted visit, S3's scoped local rule, and S5's conversation with a state effect. Their YAIRPG joins are MWA-P05/P09, MWA-P02 and MWA-P04; carrier ownership across all three belongs to MWA-P06. None grants a gameplay writer or changes current priorities.
