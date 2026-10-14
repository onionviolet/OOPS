# Breakthrough: selected native path

2026-10-14, installed GameAssembly SHA256 `82294aa03035a9d2179ee87a2d5cc96f3b9fb0ff2930a64efd7986161b457f4a`. SHOWN means selected native control flow plus the matching Dumper metadata, not played behavior. Prior extracted tables are reused read-only. Raw pseudocode stays private.

## Selection and entry

**B1, shown:** `BreakPanel.Init` at VA `0x18036a9a0` reads `ConfigManager.Get<Level>(PlayerController.Level)` into its `nowlevelData`. The generic method token at `0x1829e1300` resolves its element type to `Level`; the shared generic function's address alone would not. The panel binds the button to a confirmation callback for `EnterBreak`.

**B2, shown:** `CheckBreakButtonAvalible` at `0x18036a390` checks the current realm/lock result, already-in-trial state, the cultivation slider reaching one, stamina, the prerequisite unlock, injury status and nonempty preparation slots. The limit check uses `PlayerData.LevelLimit <= Level`; levels 3 and 6 have specific prerequisite messages in this branch. This is an entry gate, not a success percentage.

**B3, shown:** `PlayerController.CheckBreakSkillGet` at `0x1807fdbd0` rejects a zero entry in `SelectedBreakSkillIDs`. `BreakPanel.OnClickAbility` at `0x18036ae10` constructs choices from the current Level preparation categories. Selection UI and exact category-to-skill balance are separate from the success test. The existing schema has three slots.

**B4, shown:** `BreakPanel.EnterBreak` at `0x18036a940` reads `GetCurrentLevelDesc`, calls `PhysicalChange` with the negative `BreakPPSpend`, sets `Player.IsInBreakBattleScene`, and starts a scene-loading coroutine with `Level.SceneID`. Its confirmation text formats both stamina and hours. This entry body has no elapsed-hours payment. The inspected Level rows configure hours as zero. Do not treat confirmation wording as a proven nonzero time cost.

The prior Level table configures stamina 100, 125, 150, 200, 200, 200 and 400, and SceneID 901 throughout. The highest row is not proof of another reachable promotion: `LevelAdd` checks the configured maximum. Actual game launch remains prohibited.

## Resolution and settlement

**B5, shown:** `BreakBattleManager.Init` at `0x180369170` reads the current `Level`, clears short buffs, collects monster spawners and initializes the wave counter. `SpawnNextWave.MoveNext` at `0x18037daf0` consumes `Level.BreakMonsters`, tracks the largest configured wave and spawns the entries for the current wave. Advancing beyond that maximum enters `BreakComplete`. `OnUnitDead` at `0x1803698d0` removes a tracked monster; when none remain, it starts the next-wave coroutine. `StartNextWave.MoveNext` at `0x18037e830` waits three seconds before starting that wave.

**B6, shown:** `BreakComplete.MoveNext` at the IL2CPP thunk `0x1800fb510` eventually opens `BreakResultUIManager` with true. `OnOpen(true)` calls `SuccessSet` at `0x18036c470`. That function records old displayed stats, calls `PlayerController.LevelAdd` and then displays new stats. The level-up mutation occurs while preparing the success result screen, before its close button.

**B7, shown:** `LevelAdd` at `0x180800ca0` refuses advancement at the maximum, otherwise calls `PlayerData.OnLevelUp` and reports the realm change to the sect. `OnLevelUp` at `0x1803be9b0` increments the level, applies the NEW row's six stat increases, calls `InitNowLevelAbilityExp` and clears all three selected preparation slots. `InitNowLevelAbilityExp` at `0x1803be250` clears and recreates the eight preparation counters at zero and resets total cultivation XP to zero. This is a per-realm preparation reset, not death or reincarnation carryover.

**B8, inferred within traced path:** normal resolution is a combat-wave challenge. No independent success-percentage roll was found in the selected entry, wave-clear or success-settlement methods. This does not prove every combat hit is deterministic. Damage, skills and AI can contain their own RNG. No separate lightning-tribulation consumer was established.

## Puzzle-table conflict

**B9, shown:** the current BreakPanel combat branch reads `Level`. The `PlumberUI_Game` class also reads `Level` for attributes, but its minigame layout is selected from `ConfigManager.PlumberGameConfig` at static offset `0x2f0`. `Init` at `0x180559fc0` selects the entry indexed by current level; `InitGame` at `0x1805597c0` selects a configured map and transforms its layout. `ReceiveBoxClick` at `0x18055ad50` handles step exhaustion and a step counter. This is a separate recoverable puzzle path in the binary.

The older nine-row `Breakthrough` and `BreakthroughMaps` TextAssets are not the generic `Level` consumer proven above. Merely finding them does not make them active. This pass does not prove all Plumber entry points are reachable or declare those assets dead. Loader provenance and every alternate launch route remain unread.

Private receipts: `notes/rea-batch-{0,8,16}.json`, `notes/rea-batch2-{0,8,16,24}.json`, `notes/rea-batch3-{0,8}.json`, and corresponding `.annotated.txt` under `~/.codex/research/immortal-life-2/`. The annotation map preserves shared-method aliases rather than assigning an arbitrary managed name to them.
