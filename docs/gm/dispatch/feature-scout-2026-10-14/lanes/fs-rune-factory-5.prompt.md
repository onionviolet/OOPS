You are lane `fs-rune-factory-5` in the YAIRPG feature scout wave of 2026-10-14.
Repo: /Users/weiwei/code/yet-another-idle-rpg (main checkout, read-only for you except your output dir).
Read first, in order: docs/gm/dispatch/feature-scout-2026-10-14/FEATURES.md, then docs/gm/dispatch/game-research-wave-2026-10-14/COMMON.md (hard rules) and docs/gm/dispatch/game-research-wave-2026-10-14/ASPECTS.md. They govern this prompt.
Work area: `~/.codex/research/fs-rune-factory-5/`
Weibao, 2026-10-14: "send out the free game stuff accordingly, using codex, some of the steam ones are installing, did we consider rimworld yet? more to consider?"

Output dir (the only repo path you may write): `docs/research/rune-factory-5/`
Private deep details: `docs/research/rune-factory-5/private/fs-rune-factory-5/`

## Game and payload
Installed (Rune Factory 5, Unity IL2CPP, Windows): `~/Library/Application Support/Steam/steamapps/common/Rune Factory 5/` with GameAssembly.dll and `Rune Factory 5_Data/` (global-metadata.dat under il2cpp_data). Owned by Weibao.

## Route
IL2CPP route: build Il2CppDumper or Cpp2IL from source with the local dotnet SDK (record which ran) to recover class and field names; read data tables from Unity assets with a pure reader (UnityPy in a venv, or AssetRipper built from source). Never run the game. If names recover but logic stays opaque, answer from tables and field names and mark inferred.

## Questions (answer each in the Feature answers table)
1. P02: Crafting and forging with item upgrades: one material can go to forging, upgrading, cooking, gifting or shipping. How are these destinations and their effects stored?
2. P03/P09: Skills that level by use (dozens of skills): how use maps to XP, and what each level unlocks.
3. P19: Dialogue, gifts and friendship events: conditions and any paid or failable choice.
4. P01: Farm and monster helpers: how assigned work reports its result or blocker.
5. A04 save: what is saved for crafted item stats and relationships.

## Done
Per FEATURES.md and COMMON.md. CHECKPOINT.md stays current so a restart resumes. Final message: the answers in one line each, top three proposals, gaps.
