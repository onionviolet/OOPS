# Original YAIR implementation proposals

Research only. No proposal is accepted or implemented. All source anchors refer to recovered private scripts under `~/.codex/research/ani-idle/recovered/scripts/`; see FINDINGS.json. Extend current native owners, keep vanilla entry intact, one realm and one prestige layer. No imported art, dialogue, currencies, executable logic or invented prestige.

| Rank / code | Original proposal | Native owner / fit | Source finding | Playable acceptance gate |
|---|---|---|---|---|
| 1 / AN-P1 Rest that leaves a place memory | Extend native rest/sleep in one existing home location with one bounded original encounter and a remembered outcome. Preserve base recovery; no hostile event lottery by default. | src/main.js native rest/sleep; src/life_record.js appendLifeMilestone | AN-F2 | Rest stops incompatible action, heals normally, writes exactly one memory for the encounter; save/reload/import does not replay it. |
| 2 / AN-P2 One tool repair with a stated target | One native profession recipe repairs one existing weapon property with known inputs; preview what can change and what stays. Do not create an entire crystal currency or loot rarity system. | src/crafting_recipes.js; src/items.js; src/native_equipment_transaction.js | AN-F3 | Preview matches committed item; invalid/full-inventory operations cost nothing; item identity and other modifiers survive save/reload/import. |
| 3 / AN-P3 A recurring encounter remembers unfinished care | One home-world person/object remembers a useful supplied item until a later native quest resolves it. Ownership and care matter before a reward. | src/quests.js; src/causal_story_native.js; src/life_record.js | AN-F4 | First encounter records custody, later encounter consumes it once, decline preserves it; imports never invent past care. |
| 4 / AN-P4 Explain one practiced technique intervention | Extend the existing known/practiced/executable technique surface with clear mana/tool/readiness blockers and a concrete useful application; auto routine remains ordinary native play. | src/village_career_ui.js; src/main.js native combat; src/data/skills.js | AN-F1 | No free effect from owning notes; required practice/tools checked; one valid use has visible consequence; cooldown and resource charges match. |
| 5 / AN-P5 Show a finite task route before commitment | One already existing expedition displays its required stages, supplied kit and reward before starting. Permit abandonment under current YAIR rules; do not copy a no-flee lock. | src/data/locations.js; src/simulation_ui.js; src/simulation.js | AN-F7 | Preview equals stages/reward; early departure follows declared custody rules; reload neither skips a stage nor duplicates reward. |
| 6 / AN-P6 Ordinary skill offers an alternate event solution | One current quest accepts trained mundane skill as an alternate solution with a specific physical method and outcome; avoid a universal class gate. | src/data/skills.js; src/quests.js; src/data/dialogues.js | AN-F5 | Qualified/unqualified paths explain cause; item/resource transaction occurs once; vanilla default choice still works. |
| 7 / AN-P7 Loot handling protects the wanted object | Reuse current inventory/equipment surfaces for a visible keep/salvage preference on one original crafted item, with preview and capacity-safe handoff. | src/items.js; src/display.js inventory; src/native_equipment_transaction.js | AN-F11 | Protected item cannot be consumed accidentally; overflow never silently discards reward; export/import retains preference. |
| 8 / AN-P8 Describe the action that survives absence | Show existing routine and save/offline policy honestly in the native panel; preview what resumes, what pauses and when the player must choose. This is clarity over a second offline engine. | src/simulation.js setSimulationProgram; src/save_files.js; src/main.js saving | AN-F10 | Fresh/reload/import show actual routine state; pending choice prevents unintended continuation; limits are explicit. No new prestige behavior. |

The mapping is an integration target, not a claim that a proposed feature already exists. YAIR native jobs, counted routines, bounded life record and guarded import already exist; reference: [comparison baseline](../library-games-2026-10-09/YAIR_BASELINE.md). Each authorized packet would need its own current-source design check and rebuilt fresh-origin browser test, including save/reload/import for persistent state.

## Smaller original touches

| Code | Touch | Native mapping | Inspiration |
|---|---|---|---|
| AN-T01 | Rest location names its actual shelter | native location/rest description | AN-F2 |
| AN-T02 | Show current rest recovery target | native health/stamina panel | AN-F2 |
| AN-T03 | Rest visibly interrupts incompatible work | native center action state | AN-F2 |
| AN-T04 | Remember one person met while recovering | life_record milestone | AN-F2 |
| AN-T05 | Show ready/blocked reason on technique | village_career_ui method view | AN-F1 |
| AN-T06 | Show resource cost before technique use | native combat/skill tooltip | AN-F1 |
| AN-T07 | Show cooldown as remaining time | native active effect panel | AN-F1 |
| AN-T08 | Show selected repeat target and remaining count | simulation_ui routine view | AN-F1 |
| AN-T09 | Show when a routine pauses for choice | simulation_ui pending event | AN-F10 |
| AN-T10 | Show exactly what a repair preserves | crafting recipe preview | AN-F3 |
| AN-T11 | Show craftsman and material requirements together | native crafting panel | AN-F3 |
| AN-T12 | Explain blocked upgrade without spending input | native equipment transaction | AN-F3 |
| AN-T13 | Separate property repair from full replacement | native crafting recipe labels | AN-F3 |
| AN-T14 | Preview batch quantity and total cost | native crafting amount control | AN-F3 |
| AN-T15 | Remember supplied care item between encounters | quest flag/custody state | AN-F4 |
| AN-T16 | Describe missing matching object in later encounter | native dialogue condition | AN-F4 |
| AN-T17 | Offer skill-based alternate approach | native quest/dialogue option | AN-F5 |
| AN-T18 | Explain uncertain outcome without asserting fake odds | native choice text | AN-F5 |
| AN-T19 | Label frequency with in-game calendar if applicable | native Game_Time quest view | AN-F6 |
| AN-T20 | Show expedition final reward before departure | native location/quest view | AN-F7 |
| AN-T21 | Show current expedition stage | native center activity text | AN-F7 |
| AN-T22 | Keep wanted gear out of accidental salvage | inventory item lock/protection proposal | AN-F11 |
| AN-T23 | Show capacity failure before accepting reward | native reward transaction | AN-F11 |
| AN-T24 | Record first earned usable tool in biography | life_record bounded milestone | AN-F12 |
