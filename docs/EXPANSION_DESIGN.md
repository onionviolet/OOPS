# Expansion design and inspiration audit

Date: 2026-09-30. All specific names, costs, reset rules and upcoming mechanics here are agent proposals awaiting creative review. Broad expansion direction is authorized in PROJECT.md.

## Historical proposal: first slice Jade Hollow

**Dated history notice, 2026-10-15:** this 2026-09-30 slice was retired on
2026-10-01 (PROJECT.md); it is not the current first milestone or reset policy.
The original proposal below is retained for reference. Original heading:
`## First slice: Jade Hollow`. [Current direction](DIRECTION_SUMMARY.md)
links the accepted time, carryover and entry answers.

Original region, reached from Village. Prototype costs are deliberately short enough to review in a few minutes.

1. Circulate qi through existing Meditation. Base rate is 2 qi/tick plus 0.2 per Meditation level, capped at level 30.
2. Choose preparation: Weightlifting yields body conditioning (base 1/tick, +0.1/Weightlifting and +0.05/Combat level); or Herbalism harvests dewleaf every 8 to 4 ticks. Borrow one Old sickle on first use if needed. Equipment and ordinary skill progression remain shared.
3. Cook 2 dewleaf into tea or refine 4 into a pellet using the native crafting engine. Recipes succeed deterministically in this slice. Tea gives 20 + up to 20 Cooking level qi and 10 preparation. Pellet gives 30 + up to 30 Alchemy level preparation.
4. Both trials require 60 qi, reserve/spend 40, and take 12 active ticks. Endurance needs 30 body; formation spends 30 preparation. Either yields a seal and 20 XP in Combat or Alchemy. Timed trials represent pressure/formation control, not a new combat AI. There is no random failure or permanent penalty in this slice.
5. Spend the seal requirement and 60 qi to open meridians once per life. Gain 50 Meditation and 50 Weightlifting XP and 50% faster qi/body training. Continue play or rebirth.

One active legacy: Remembered breath gives +25% meditation qi; Steady hands gives +50% preparation from crafted items. Rebirth resets only the cultivation layer and all three new item types, including storage, and returns to Village. Ordinary character XP, skills, gear, money, other inventory, quests, reputation, recipe knowledge and maps are retained. A review screen freezes the chosen legacy before confirmation; changing the selector afterward does not silently change the reviewed choice. Repeated rebirth replaces the active legacy and does not stack unlimited multipliers.

This retention rule is a reversible prototype decision, not a commitment that later prestige must always preserve every ordinary skill. It avoids forcing a full upstream reset before the new progression is worth that cost.

## Discovery sources, not a favorite-book declaration

Read the vault's `Reading_List_CN_Webnovels.md` and `Reading_List_Entertainment.md` for discovery. They cover cultivation, LitRPG/system stories, time loops, grey/scheming protagonists, rules horror/infinite-flow, and fan settings including superhero/ninja worlds. A list entry is not proof that Weibao likes the book or wants a direct adaptation. Shelf currency, popularity and personal ranking were not re-audited. No private reading files are copied into this repository.

| Reference | Verified source or boundary | Proposed adaptation and purpose |
|---|---|---|
| General xianxia progression | [Wuxiaworld glossary](https://www.wuxiaworld.com/page/general-glossary-of-terms/) describes qi, meditation, cultivation, alchemy, sects and realms | Make preparation and a trial prerequisites for a tier transition. Jade Hollow, numeric costs and legacy rules are invented gameplay, not canonical lore |
| Tribulation of Myriad Races | [Publisher synopsis](https://www.wuxiaworld.com/novel/tribulation-of-myriad-races) contrasts physical cultivation in war academies and mental cultivation in research academies | Distinct approaches to one milestone. Our endurance/formation split is an interpretation, not that novel's exact system |
| Mother of Learning | [Author's Royal Road listing](https://www.royalroad.com/fiction/21220/mother-of-learning) describes Zorian trapped in a time loop and repetition/learning | Retain learned skills and choose knowledge that changes the next journey. Proposed spirit/archive world later; the current rebirth is not a direct adaptation of its loop |
| Lord of the Mysteries, Reverend Insanity, Shadow Slave, Cradle and superhero/ninja fan settings | Titles found in saved discovery lists; no specific power-system lore relied upon in the shipped slice | Candidates for later pathway identities, consequential factions, bounded powers and world-rule exceptions. Verify original text or official publisher material before using specific lore. No direct fan world selected yet |

## Expansion architecture and next milestones

Shared layer: ordinary skill/recipe knowledge, equipment, discoveries and optional legacy. World layer: resources, available energy, hazards, local factions, access rules and trial logic. Keep world-state namespaces independently versioned so traveling need not reset another world. The current `cultivation` field is the first namespace, not a universal energy system.

Next proposed world: an original spirit archive. Rule difference: actions consume focus and create instability; research and safe rest clear instability, rather than earning another pool of qi by meditation. Archive discoveries unlock dewleaf inscriptions in Jade Hollow; those inscriptions make an archive expedition safer at a material cost. This gives a reason to return and a measurable tradeoff before adding more worlds. Do not implement a second name with the same loop and call it multi-world delivery.

Next depth proposals: a Hollow gardener mentor and a trial-circle custodian with competing branch rewards; Cooking tea options versus Alchemy concentrates; stance-sensitive pressure trials; technique discoveries from ordinary skill milestones; region quests that expose faction access. Keep companions, sect facilities and advanced prestige for later playable increments. Neither a custom faction nor these quests are implemented in this slice.

Acceptance for each addition: two viable builds, explicit resource uses/unlocks, save/reload, concrete cross-system effects, readable UI, and user review of the resulting play. The second-world acceptance requires a distinct rule and useful two-way interaction, not merely more locations.
