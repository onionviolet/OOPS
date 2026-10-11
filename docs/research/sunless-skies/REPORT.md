# Sunless Skies: source audit

**Seen in data or code:** Skies gives the next captain the locomotive, banked goods, selected persistent qualities, half the old money and most fitted equipment. Death can remove one eligible fitting; retirement retains the fittings. A new captain still chooses their own origin, history and ambition. Continuity is broader than Sea's five legacy selections, without carrying every quest or relationship.

**Seen in data or code:** Skies keeps the storylet/quality model but adds useful distinctions: timed thematic decks, requirements that are also costs, and rare outcomes identified as compromised success. Supplies running out opens a staged starvation chain. Terror crises can leave Nightmares, which open later linked stories even after immediate terror has fallen.

**Inferred:** the strongest YAIR options are a clear succession receipt, separate world and personal story state, and danger with an aftermath. These can deepen the existing inventory, NPC, chronicle and story systems without adopting Skies' survival rules for every world. [Packets](IMPLEMENTATION_PACKETS.md) are proposals only.

**Seen in text, qualified by installed code:** Failbetter's 2019 explanation describes exploration XP protection plus halved other XP. This installed build instead computes inherited XP as max(current exploration XP, ExpOnDeath for the current level). The recovered level table sets ExpOnDeath to half the level's cumulative threshold, not half the captain's raw current total. Preserve that discrepancy. [Developer comparison](https://www.failbettergames.com/news/sunless-sea-vs-sunless-skies-death-legacies-and-repetition).

The assigned source pass is complete. [Findings](FINDINGS.md) include a Sea-to-Skies comparison and contradictions; [coverage](COVERAGE.md) states what remains unread. No game launch, personal-save inspection, YAIR edit, build, commit or uninstall occurred. Both section B games are ready for Weibao to remove himself if desired.
