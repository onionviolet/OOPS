# Naming rules (NMR)

Proposed 2026-11-06 (AD32); run authorized by Weibao, lines not yet accepted
([direction](USER_VISION.md#five-quality-deep-dives-on-the-prose-model-2026-11-06)).

How people, places, items and money are named so each sounds like its world, and the check
that keeps them so. Each line is a default, a dial and a reason, never never/always/only
(AD5, AD38). Player-facing wording stays with [prose rules](PROSE_RULES.md) (PRS4 voice, PRS6
vocabulary); the report voice per world stays with [DESIGN](../DESIGN.md) DSG13. Per-world
register, sample names and currency words: [world naming sheets](names/WORLD_NAMING_SHEETS.md).
Check: `node scripts/check_names.mjs` (baseline `scripts/names_baseline.json`, joins `check:rules`
once the coordinator wires it); ranked work: [names backlog](names/NAMES_BACKLOG.md).

## Rules

| Code | Rule | Default, dial, reason |
| --- | --- | --- |
| NMR1 | **A person has a name of their own.** | Default: a first name, a surname, a title with a name or a nickname, drawn from the world's register (NMR3). A role may follow the name ("Mara, the miller"). Dial: a passer-by the player will not meet twice may be "the carter" in running text; anyone with a dialogue, a shop or a schedule gets a name. Reason: "village elder" and "gate guard" read as slots, and the player cannot remember or ask after a slot. |
| NMR2 | **One name, one entity, per world.** | Default: two people or places in one world do not share a name; a second one gets a distinguishing mark in the world's own way (a surname, "Old", the street). Dial: deliberate namesakes (a child named for a grandfather) are fine when the text says so and the ids are distinct. Reason: a duplicate makes "Talk to Sun" ambiguous and splits memory and knowledge between two rows. |
| NMR3 | **Names come from the world's register.** | Default: each world keeps a sheet (register, sample names, currency words); a new name should sit beside the samples. Dial: original worlds follow their sheet; canon names from source books are correct by default and stay as the source spells them unless a world's own reason (a translation choice, an in-world alias) changes them; a mixed-origin character (a foreigner, a transmigrator) may carry a name from elsewhere with an in-world reason. Reason: a modern word in a medieval village, or a Western given name in a sect, breaks the world faster than any mechanic. |
| NMR4 | **Across worlds, a name keeps its meaning or changes.** | Default: a place, person or item name used in two worlds means the same thing in both (the same canon figure) or is renamed in one. A noun that is a currency in one world ("crown", "stone") is not a plain object in another without a world prefix in the label. Dial: shared system words (Village, Forest) stay generic in systems text and are keyed to a world in player text. Reason: "stone" meaning a coin here and a rock there is how a player loses the thread of what things cost. |
| NMR5 | **Items are named for what they are or where they came from.** | Default: a material, a maker, a place or a use before the bare type ("Hearth-iron kettle", "Moonlight Gu", "the miller's dagger"). Dial: starter and commodity items may be plain ("Bread", "Torch") when they are really common there. Reason: "Iron Sword" tells the player nothing they could not see from the icon. |
| NMR6 | **Canon names are fixed; our own names around them follow the source's habits.** | Default: keep the source's spelling and capitalisation (Mr. Azik, Old Neil); where translations differ, pick one spelling per world and record it in the sheet. Dial: a world may display a shorter form in tight UI if the full name is one tap away. Reason: variants of one name (Palez and Pallez) split the cast into two people. |
| NMR7 | **Money and units are the world's.** | Default: each world names its coins and measures in its sheet and every label, price and Reports line uses them (Tingen: pounds, soli, pence). Dial: a bridge world may show a converted line when the conversion is in the text. Reason: a price in "coins" in a world with pounds and soli is the UI talking, not the world (PRS4). |
| NMR8 | **A name check runs where names are made.** | Default: the names check flags generic filler, shared names, spelling variants and out-of-register words against a baseline; a new finding is fixed or marked `// names: allow <why>`. Dial: the book casts are private, so the same scan runs locally with `--private` against a private baseline. Reason: the prose pass showed the baseline ratchet retires entries as content is rewritten without blocking unrelated work. |
