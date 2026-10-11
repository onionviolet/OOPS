# C2: legacy and retained knowledge

Read-only source pass, 2026-10-07. Owner: `read_legacy`. No gameplay or private save was run or changed. These are bounded code findings and original proposals, not accepted rules.

## Source discovery and limits

Paths below are relative to `/Users/weiwei/.codex/research/`.

| Source | Discovered provenance | Limit |
|---|---|---|
| Rogue Legacy | `rogue-legacy/RogueLegacy1/README.md`; live local Git HEAD `b41c17888a91100bbf8f1febecaa636a1b421f5b` | Public FNA source, with assets excluded. Source reading only; custom source license. No copied code or text is proposed. |
| Melvor Idle | `melvor-idle/13311431/hosted/script-manifest.json`: retrieved 2026-10-06, observed v1.3.1, query pin 12097, source URLs/hashes | Hosted JS is the behavior evidence. `authoring/manifest.json` identifies a typing project at `aa84a425…`, which is declarations rather than runtime proof. Folder build ID alone does not bind hosted JS to the installed build. |
| Orb of Creation | `orb-of-creation/24426975/INPUT_MANIFEST.json`, `DECOMPILATION_MANIFEST.json`, `ASSET_MANIFEST.json` | Installed Assembly-CSharp input and successful decompilation, 1,002 C# files. Manifest explicitly says recovery is not semantic review, compilation or execution. This pass traces reset code, not every serialized research asset or its in-game unlock. |

The existing broad research dossiers were not treated as behavior proof. No verified ticking biological aging system was found in the bounded files inspected. That is a coverage limit, not a claim that none exists anywhere.

## Verified findings

**F1, Rogue Legacy separates a remembered person from the next playable body.**
`rogue-legacy/RogueLegacy1/RogueCastle/src/Screens/GameOverScreen.cs:150-197` creates a `FamilyTreeNode` containing name, age, class, traits, kills and boss achievement; appends it; clears candidate branches and run counters; marks death; and saves PlayerData, Lineage and MapData. `Screens/LineageScreen.cs:867-913` replaces appearance, class, traits, spell, name and ages with the selected heir. This is concrete history plus succession. It is not evidence of memories becoming knowledge bonuses.

**F2, Rogue Legacy's age fields are not a verified lifespan clock.**
`RogueCastle/src/Game Objects/LineageObj.cs:205-206` assigns age randomly from 18–30 and child age from 2–5. `Screens/LineageScreen.cs:391-420` reconstructs ancestor portraits and advances the displayed era from those ages. Separate upgrade retention is explicit: `Managers/SaveGameManager.cs:850-859` writes each skill level and `:1668-1680` reconstructs them by leveling saved traits. Thus its heir starts with retained upgrades, which differs from the proposed YAIR rule that knowledge survives while embodied power does not.

**F3, Melvor preserves practiced expertise independently of normal defeat.**
`melvor-idle/13311431/hosted/skill.js:2021-2042` stores mastery XP and level per action; `:2555-2578` saves that map and reconstructs level from XP. `player.js:2569-2575` removes active effects, restores at least 1 HP or 20% max HP, records death and applies an equipment penalty; `:2628-2656` conditionally removes one selected equipped stack and its charges. `combatManager.js:497-517` separately calls `resetAccountData()` for permadeath unless raid/event/free-death exceptions apply. This supports distinguishing ordinary recovery from a life-ending transition. It does not establish inherited mastery or rebirth.

**F4, Orb makes retention an explicit per-object policy.**
`orb-of-creation/24426975/decompiled/GameManager.cs:613-649` collects persistent save data, resets objects, reloads eligible saved data and calls `OnPersistentReset`; other resettable objects simply reset. `ResearchSO.cs:1309-1315` retains research when any linked research type has `persistThroughReset`; `ResearchTypeSO.cs:23` declares that policy. `ResearchSO.cs:13-56` saves/restores level, queue, stage and active/developing state. Actual asset assignments remain unbound in this pass. `PersistentResetManager.cs:93-107` resets elapsed cycle time, increments reset count and reapplies challenge rewards. This is a world-cycle prestige mechanism, not verified death or reincarnation.

## Smallest playable proposal

**P1, one named lesson survives; its predecessor's skill levels do not.** An elder who actually practices or teaches an existing skill can leave one lesson tied to that skill and its source milestone. The life-ending screen shows a grave, epitaph and the exact inherited lesson. An heir starts with their own normal body and training state. The lesson exposes one ordinary practice action with a small, bounded early-learning benefit; it cannot grant equipment, levels or unavailable local fuel. This combines Rogue Legacy's identifiable ancestor, Melvor's action-specific expertise and Orb's explicit retention boundary without claiming that any reference implements this exact combination.

Proposal gate: a fresh-origin player earns the lesson through play, ends the opted-in life, sees the ancestor and source milestone, begins an heir, and observes the lesson affect actual practice. Save/reload/import must preserve lesson provenance and the heir, without regranting it or changing vanilla defeat into death. Foundation GM owns life records and migrations; this report defines behavior, not a competing save schema. Aging speed, teaching unlock age and bonus balance remain proposed choices.
