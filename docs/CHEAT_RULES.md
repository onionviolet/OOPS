# Cheat rules

Proposed 2026-11-10 (AD32). Weibao: "Cheats should be brough earlier for consideration" ([log](gm/USER_VISION_LOG_2026-11.md#four-more-rulebooks-and-cheats-brought-forward-2026-11-10)), which ends the 2026-10-30 long-term deferral of cheat work. The lines are agent proposals until he accepts them; "for consideration" is read as design and rules, not a build order. Rows marked **(restates)** repeat a rule that already binds through its own code and add no authority.

A cheat here is an in-fiction advantage that puts someone beyond the ordinary: the base cheat, a ring spirit, a system interface, a regression, a patron's gift, a bloodline that should not exist. It is not anti-cheat (AD22: none beyond save integrity). A world may set any line differently with an in-world reason and cost (AD5, AD38); each row gives the default, the dial and the reason.

His words that set the shape: "anything is possible and it depends" (2026-10-09); fit cheats into the cosmology rather than rank them, "the ranking is a cool idea and can be kept for funsies" (2026-10-10); "make it an optional start, keep everything possible, random possibility… Types of cheat too? Very rare? Not so rare? starts by being researched?" and "maybe I have to unlock it first" (2026-10-13); "Types of cheat and medium of cheat matters" (CA3, 2026-10-15); "Cheats dont necissarily have to be fitting" and a cheat's look goes "by type" (2026-10-16); "Ring spirit is NOT the base cheat… base cheat is the standard stuff that makes our guy beyond a normal person, but then, the world can have so much more" (2026-10-30).

Owners and neighbours (linked, not restated): Rulebook 1, 5, 11, 12 in [RULES_FROM_SCRATCH](RULES_FROM_SCRATCH.md#the-rulebook-accepted-2026-10-10); AD9, AD11, AD12, AD14, AD17, AD21, AD22, AD26–AD30 in the [rules index](RULES_INDEX.md#economy-power-and-cheats); ABR16–ABR17 in [ability rules](ABILITY_RULES.md#kinds-of-abilities) (proposed); WER2, WER3, WER9, WER17 in [world entry rules](WORLD_ENTRY_RULES.md); [limits are adjectives](ABUSE_AND_LIMITS.md#limits-are-adjectives). Palettes: [cheat cosmology](CHEAT_COSMOLOGY.md) (eight backings, placement card, gift terms; B493 is its current-authority gate), [cheat library](CHEAT_LIBRARY.md) (families as loops, AQ1–AQ14 acquisition routes, rarity dials; B499 retires weak-start gates), [cheat core audit](audits/CHEAT_CORE_AUDIT.md) (IM36–IM46), and the [cheat catalogue](CHEAT_CATALOGUE.md) of types to draw on (CTC1–CTC91, CM1–CM10, 2026-11-10). Code: `src/cheat_cards.js`, `cheat_definitions.js`, `cheat_mechanisms.js`, `cheat_growth.js`, `cheat_host.js`, `cheat_save.js`, `cheat_ui.js`.

## What a cheat is

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| CHT1 | **The base cheat and other cheats are different things.** The base cheat is the standard faculty that makes the played character beyond normal; a ring spirit, a system or a patron's gift is another cheat a world can offer. | Default: every played character has a base cheat; other cheats are separate cards from any route. Dial: a world where other cheats are common or absent. Reason: his 2026-10-30 correction. | AD29, AD11 |
| CHT2 | **The base cheat is quiet** (restates AD29). It is a personal faculty, not a voice or a window. | Default: a quiet faculty with no interface; systems and voices come through other cheats or means. Dial: none for the base cheat; other cheats may talk. Reason: AD29 and CA13. | AD29, AD26 |
| CHT3 | **Each start declares its base cheat.** A start (lead, ordinary or special) states what its base cheat is and what it does in that world. | Default: the generic quiet faculty ("Continuing insight") for ordinary starts; a lead start declares its own through the start's `grants`, which already feed `applyStartGrants`. Dial: per start. Reason: WER3 asks "base cheat" for every start, but LOTM, Harry and the other book worlds show a fixed string with no card. | WER3, AD11 |
| CHT4 | **A cheat is an ability with terms.** It feeds the shared power seam like any ability, with a source and terms (gift, digested, matured, lease, loan, lien, leash, burdened loan, bound item). | Default: new cheat effects go through the power registry (as `cheat.rehearsed_foe` does); world-changing effects emit simulation effects. Dial: a world-law effect with no holder stays world data. Reason: ABR16 and AD51; a parallel cheat engine would duplicate every power rule. | ABR16, AD51 |
| CHT5 | **What backs a cheat decides where it goes.** A cheat is backed by soul, body, item, system, world law, patron, knowledge or concept, and each part travels by its own rule. | Default: the backing is a question each card answers, not a guarantee (B493). Dial: per card. Reason: Rulebook 5; a ring-backed cheat is lost with the ring, a soul-backed one is not. | Rulebook 5, ABR17 |
| CHT6 | **A cheat's look follows its type, not the world** (restates AD26). | Default: an AI ring looks like a hologram, a cultivator in a ring has his own art style, wherever they are. Dial: per card. Reason: his 2026-10-16 words. | AD26 |
| CHT7 | **Cheats need not fit the world.** A cheat can come from outside the world's rules and still work by how it works. | Default: it works; the world's observers react by their means (AD6). Dial: a world's law may resist or convert it (the verse equalization modes). Reason: "Cheats dont necissarily have to be fitting" (2026-10-16). | AD38, AD21 |

## Getting and growing

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| CHT8 | **Any route, rarity per world.** A cheat can come as a start option, a found item, a deed, research, purchase, an awakening, a patron's offer, an inheritance or a debug grant. | Default: the AQ1–AQ14 routes are a palette; the start option and premise grant are built. Dial: rarity from none through mythic to common; who knows cheats exist; how one learns it is real. Reason: his 2026-10-13 words. | AQ1–AQ14, AD5 |
| CHT9 | **A cheat can be earned into.** Some cheats start locked and open by play, research or deed. | Default: an optional start can grant at once; other routes unlock in play. Dial: per card. Reason: "maybe I have to unlock it first" so that a cheat does not erase early progression. | AQ routes, GTR |
| CHT10 | **Base-cheat powers are found in play** (restates AD26). | Default: the player discovers what the base cheat does by using it; the panel shows only what has been found. Dial: a start that begins with a manual. Reason: AD26; discovery is the fun. | AD26, KNW rules |
| CHT11 | **Cheats grow.** A cheat can gain tiers, modules and range by use, deeds, research or time. | Default: growth tiers in `cheat_growth.js`; growth is saved state (a persistence decision is open, IM40). Dial: per card; a cheat may also stop growing. Reason: "leveling up base cheat" (CA3) and "the higher level stuff has no room to exist" (2026-10-27). | CA3, BC1–BC9 |
| CHT12 | **No compulsory cost, tell or counter** (now general, AD55). A cheat carries the limits its card states, as adjectives. | Default: charges, terms and limits per card; pushback comes from observers and causes in the world, not a rule that every cheat needs a weakness (B499). Dial: per card. Reason: AD22, Rulebook 11; balance is not forced. | AD22, Rulebook 11 |
| CHT13 | **Everything can become OP; beaten obstacles stay beaten** (restates Rulebook 11, AD28). | Default: power is relative to the world. Dial: none. Reason: Rulebook 11. | AD28 |

## Across lives and worlds

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| CHT14 | **The base cheat carries; others follow their backing** (restates AD11). | Default: memories and the base cheat carry; a system carries if its reach does, an item if it is carried, a patron's gift by its terms. Dial: a world's conversion of power ranks. Reason: AD11, Rulebook 5. | AD11, CHT5 |
| CHT15 | **The cheat belongs to whoever is played** (restates the 2026-10-30 heir direction). | Default: no heir carry; `HEIR_REACH` stays dormant. Dial: "start as the heir" with its own reach rule, when heirs reopen. Reason: his deferral. | TIE20, IM45 |
| CHT16 | **Entry warns about cheats.** Crossing into a world states which cheats carry, convert or stop working there. | Default: one line in the WER confirm step (IM42). Dial: none. Reason: a cheat that silently stops working is a hidden loss. | WER3, IM42 |
| CHT17 | **Cheats can see and change bindings** (restates AD14) and **can change in-world rules** (restates AD21). | Default: only through a card's stated effect. Dial: per card. Reason: AD14, AD21. | AD14, AD21 |

## Others and knowledge

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| CHT18 | **Others can have cheats.** Rivals, enemies and canon people may hold cheats under the same rules. | Default: an NPC's cheat is a card with the same terms; the player learns of it by means. Dial: per world. Reason: AD6. | AD6, enemy cheats |
| CHT19 | **What a cheat shows is a means.** A cheat that reads, foresees or appraises gives knowledge by its stated accuracy. | Default: sealed truths still follow their discovery route; a foresight cheat shows its uncertainty. Dial: per card. Reason: AD9, AD17 and the sealed-secret rule. | AD9, AD17, KNW rules |
| CHT20 | **A talking cheat can be wrong.** A voice may boast, misremember or mislead. | Default: quiet (CHT2) unless the card has a voice; a voiced cheat states its reliability as a hidden property. Dial: per card (the ring elder runs a tier ahead). Reason: AD26; an unreliable narrator is a story. | AD26, cheat_growth |

## Bringing cheats forward

The cheapest seams, in order (agent proposal; no slice is authorized):

1. This rulebook, registered (done 2026-11-10).
2. A per-start base-cheat declaration (CHT3): one `grants` field per start; `seedBeginningCheats` and `applyStartGrants` already exist.
3. One cheat on the power seam (CHT4): move the ring spirit or the system card onto the registry, as `cheat.rehearsed_foe` does.
4. The entry warning (CHT16): read-only text over existing cards.

Not cheap: AQ routes beyond the start option, growth tier effects (needs a persistence decision), any all-world collision engine.

## Open details

- The eight authored modules are Frontier tools (appraise, routine and carcass work check `base.frontier`); no book world has a cheat card (CHT3).
- Cards are mostly not on the power registry (CHT4).
- Growth tier effects wait on a persistence decision (IM40, CHT11).
- One talking cheat exists (CHT20).
- Older docs sometimes treat the ring spirit as a form of the base cheat; CHT1 supersedes that reading.
- The USER_VISION pointer for "any route, rarity per world" links the Food and Famine entry; the matching words are in the AQ entry of 2026-10-13.
