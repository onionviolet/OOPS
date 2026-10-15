# melvor-idle: three deeper systems

Ranked by payoff for this aspect backfill, especially earlier text/save/authoring gaps. These are targeted traces. Full semantic completeness and future YAIR selection are separate.

## D1 Lore requirement interface

Prior status: Previously not central in old production/combat audit.

Trace: declared LoreBook data -> requirement objects -> registry -> update unlocks -> readLore.

Evidence: https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/lore.d.ts

Limit: Interface-only chain. Does not prove current content, delivery order or narrative side effects.

PROPOSAL: route this pattern through the existing owners named in ASPECTS; no new parallel scheduler/save store and no automatic source adaptation.

## D2 Namespace-preserving save interface

Prior status: Prior executable save work cannot be refreshed here.

Trace: declared header/version -> namespace map -> numeric ID -> registered object or unresolved string identity.

Evidence: https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/saveWriter.d.ts; https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/save.d.ts

Limit: Signatures support a missing-content question but do not establish successful recovery or rollback.

PROPOSAL: route this pattern through the existing owners named in ASPECTS; no new parallel scheduler/save store and no automatic source adaptation.

## D3 Event-driven tutorial interface

Prior status: Previously undocumented authoring surface.

Trace: declared stage ID -> tasks/event matcher/count -> progress UI -> encoded stage.

Evidence: https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/tutorialIsland.d.ts; https://github.com/GamesByMalcsPtyLtd/Melvor-Typing-Project/blob/aa84a4253d998ab03f396aee9e1c0b3a9df0582c/src/gameTypes/tutorialMenus.d.ts

Limit: Exact task catalogue/reward order and skip/save behavior remain unread until public bodies are reachable.

PROPOSAL: route this pattern through the existing owners named in ASPECTS; no new parallel scheduler/save store and no automatic source adaptation.

