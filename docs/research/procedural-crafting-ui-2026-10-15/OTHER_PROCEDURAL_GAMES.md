# Other procedural system references

2026-10-15. Additional scouting requested by Weibao. Research only. This supplements DQ1 and the existing comparisons; it does not dispatch further chats, select gameplay laws or authorize implementation. Rankings are judgments about relevance to multi-use ingredients, combining means and discovering recipes, not purchase recommendations.

## Ranked candidates

| Code / rank | Game | Supported mechanism | Why investigate / finite question | Evidence limit |
|---|---|---|---|---|
| PG1 / 1 | Caves of Qud | Developer cooking announcement explicitly describes generated recipes and status effects mixed with handwritten material. Campfire actions separate ingredient cooking, recipe cooking and preservation. | Closest new reference for turning an experimental meal into a reusable method. Trace one ingredient through generated effect, recording, repeat cooking and actual effect consumer. Inspect selection and recipe UI. | Historical developer announcement, not a pinned current executable. Current recipe retention and ingredient substitution rules require verification. |
| PG2 / 2 | Noita | Official site describes player-created spells and material simulations including simplified chemical reactions, electricity and thermodynamics. | Strong reference for one material participating in several systems and spell components interacting with a world. Extend existing Noita digest through one spell/material consumer rather than restarting it. | Official overview documents scope; it does not establish each reaction, spell ordering rule or current build. Existing local private payload availability remains unresolved. |
| PG3 / 3 | Cataclysm: Dark Days Ahead | Official source documentation separates material components, particular tools, tool qualities and reusable requirements. It describes ingredient alternatives, recipe learning fields and reversible crafting. | Best new inspectable reference for combining available means without treating everything as a consumed ingredient. Trace one alternative component and one qualifying tool through admission, debit, output, actual use and disassembly. | Authored recipe rules are not arbitrary invention. Documentation on moving master is not a pinned released runtime. Step/unattended craft behavior needs a commit pin and matching implementation before adoption claims. |
| PG4 / 4 | Mages of Mystralia | Developer/store material documents spell design for combat and environmental puzzles. A developer reply describes discovering runes gradually and learning their different uses. | Useful for one compositional vocabulary serving several purposes, plus UI that teaches combinations progressively. Inspect one rune reused across a combat and a traversal/puzzle spell. | Modular composition is not generated ingredient chemistry. No native interaction or detailed rune execution verified here. |
| PG5 / 5 | Magicraft | Developer store description documents combining spell components and randomized runs with staffs and relics. | Compare its combination interface with Noita: can the player understand which component changes delivery, behavior or timing? Trace one component interaction through an actual target consumer. | Marketing claims about limitless combinations are not evidence of unlimited mechanics; do not copy claimed counts or infer exact execution from them. |
| PG6 / 6 | Magicka | Official store describes dynamic spell casting; an official manual is available for exact control and element rules. | Useful contrasting case: composing a spell during action, rather than editing a saved recipe beforehand. Inspect element entry, cancellation and the selected delivery route. | Dynamic casting is not automatically procedural recipe generation. Detailed element and casting rules remain a manual-reading task. |

## Sources read or located

| ID | Primary source | What this pass establishes |
|---|---|---|
| S1 | [Qud developer news, November–December 2017](https://store.steampowered.com/news/posts/?appids=333640&enddate=1513391908) | Historical cooking design and campfire action distinctions. |
| S2 | [Qud developers' End-to-End Procedural Generation presentation](https://media.gdcvault.com/gdc2019/presentations/Grinblat_Jason_End-to-End_Procedural_Generation.pdf) | Located via search, but full web extraction failed due to document size. Do not claim the full slide deck was read. S1 supplies this pass's cooking claims. |
| S3 | [Noita official site](https://www.noitagame.com/) | Spell construction and simulated material-system scope. |
| S4 | [CDDA official crafting/disassembly documentation](https://github.com/CleverRaven/Cataclysm-DDA/blob/master/doc/JSON/ITEM_CRAFT_AND_DISASSEMBLY.md) | Requirement categories, alternatives, learning fields and recovery caveats. The docs.cataclysmdda.org route failed; switched to official GitHub source. |
| S5 | [CDDA recipe implementation](https://github.com/CleverRaven/Cataclysm-DDA/blob/master/src/recipe.cpp) | Search-exposed source includes learning and requirement parsing. No complete implementation trace performed. |
| S6 | [Mages of Mystralia developer store page](https://store.steampowered.com/app/529660/Mages_of_Mystralia/) and [developer discussion](https://steamcommunity.com/app/529660/discussions/0/152390648080824521/) | Spell design across combat/environmental purposes; progressive rune discovery. |
| S7 | [Magicraft developer store page](https://store.steampowered.com/app/2103140/Magicraft/) | Spell combinations and randomized build context. |
| S8 | [Magicka developer store page](https://store.steampowered.com/app/42910/Magicka/) and [official manual](https://cdn.akamai.steamstatic.com/steam/apps/42910/manuals/Magicka%20manual%20body%20--%20English.pdf) | Dynamic casting documented by store; exact manual rules located, not fully read. |

## Disposition

Keep Taiwu DQ1 active. For a further finite research pass, Qud is the strongest new recipe-discovery candidate, Noita the strongest existing composition/material candidate and CDDA the strongest new source-readable process candidate. Mages, Magicraft and Magicka are useful UI/composition contrasts once one exact interaction is selected. These judgments do not justify a universal crafting engine or additional workers.

This pass used public documentation only. No new decompilation, source checkout, executable download, install, launch, personal save access or gameplay verification. No native Mac compatibility or purchase value claim. Deep extracts and complete selected data belong in private storage when a concrete follow-on is selected; this scouting note paraphrases sources and preserves their exact URLs.

## Follow-up completed and dispatched

The user selected Qud/CDDA ingredient research: [report](QUD_CDDA_REPORT.md), [deeper UI and installation](INSTALLATION_AND_EXTENDED_RESEARCH.md). A subsequent explicit request opened the broader [Qud audit](QUD_AUDIT_DISPATCH.md). No implementation.
