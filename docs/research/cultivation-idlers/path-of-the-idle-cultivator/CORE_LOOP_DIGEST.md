# Core loop and breakthrough mechanisms

Evidence labels and `L` locators follow [REPORT.md](REPORT.md). All mechanisms below are **shown** unless marked otherwise. This is prose analysis, not imported game code.

## Realm and stage model

The normal named catalogue runs from Body Tempering to Supreme Transcendence: 79 entries, maximum index 78. The twelve category ranges are below (zero-based). Astral qi has its own 111-name catalogue and 16 category ranges; demonic has 40 names and ten ranges. These tables do not establish universal access. L79600-80048.

| Category | Normal indices |
|---|---|
| Mortal | 0-4 |
| Earth | 5-11 |
| Heaven | 12-18 |
| Immortal | 19-26 |
| Divine | 27-37 |
| Celestial | 38-45 |
| Dao | 46-49 |
| Ascended | 50-54 |
| Boundless | 55-62 |
| Eternal | 63-68 |
| Primordial | 69-73 |
| Supreme | 74-78 |

The normal path uses stages 1-9. A bottleneck checker repeatedly advances eligible stages and ordinary realms from accumulated qi. At a category transition it records the bottleneck, stops the ordinary action and pauses unless an earned automation will handle it. Sword/spear use custom realm tables and breakthrough-index lists instead. L81410-81479, L123163-123237.

## Qi is accumulated progress with several producers

The table begins with 100 qi per stage and generates later requirements by repeated category-band multipliers. Its bands do not all match the display category ranges: early requirement bands use 0-6, 7-13 and 14-21, whereas display ranges begin at 5 and 12. Treat requirement bands and presentation categories as distinct until the author confirms intent. L136400-136540.

The full-realm accounting helper calculates 19 times that realm's per-stage value. Stage requirements also include previous realm totals. At stage 9 the normal next-stage helper simplifies to previous totals plus nine stage units, although full realm accounting includes 19. That is what the code says; do not smooth this into a claim that the player visibly pays nineteen units at the trial. Custom-main paths use their own stage count and table. L123091-123131, L139593-139647.

Normal qi generation starts with base rate **30**, adds a meridian flat contribution and the configured spirit-stone rate divided by its bonus divisor. It then applies room quantity, gathering percent and refining efficiency percent, followed by world/law, companions, race, physique, guardian, inner arts penalty, kingdom, inner realm and other active bonuses. A main path whose `cultivatesQi` is false returns zero from normal gathering. Active energy conversion is separate from normal qi generation. L14950, L139705-139790.

The rate breakdown exposes base input, room qi, gathered/refined amount, the penalty and downstream multipliers. This is useful explainability, but is not a claim that every UI breakdown is perfectly synchronized under every combination. L139747-139790.

## Vessel and resources

The dantian's **maximum purity** is derived from realm and modifiers, including earned trial quality. **Available purity** subtracts monster corruption and impurities, clamped at zero. An exceptional full-corruption state bypasses that calculation. Size, refining points, refining progress and development progress are independent saved quantities. Corruption can decay with action days; additions are bounded by currently available purity. L92500-92575, L92832-92867.

Elemental nodes consume inventory when installed. Reconfiguration is limited to a supported setup phase and refuses outside it. Connections to the dantian determine which installed nodes contribute to elemental roots; not every node merely existing in inventory counts. Rebirth clears the vessel's life values and enters pending setup while learned unlocks remain. L92625-92695, L93285-93312.

Spirit stones buy training/manual tiers and may accelerate cultivation. Monster essence, elemental fragments, beast materials and later astral materials feed recipes or other routes. Some producers and retention rules depend on institution ownership or legacy. This is a network of resource consumers, not one interchangeable cultivation currency. Recipe examples L102520-102555; retention L81054-81075.

## Standard tribulation: grade the attempt

Starting requires a qi bottleneck and any applicable Battle for Heaven prerequisite. It snapshots maximum trial HP into a **separate** `tribulationHp` field and pauses normal game speed. L140519-140533.

The maximum is **50 turns**. Damage scaling increases in bands with thresholds at 0, 5, 10, 15, 20, 25, 30, 35, 40 and 50. The table's scaling follows powers of six. Heaven Chosen receives a 20x origin damage multiplier; laws and equipped treasures alter it further. L140356-140369, L140561-140578.

The player can accept the current grade. Zero trial HP and surviving all 50 turns both lead to the same finalization path; zero trial HP locks the reached grade, while completing all turns with positive HP earns tier 1. Ordinary turn grading bottoms out at tier 2, so merely reaching the final turn is not automatically perfect. Cancelling clears trial state without advancing. L140400-140410, L140584-140614.

Finalization records the bonus and dantian quality gain, consumes equipped treasures, clears the trial state and opens a results modal. Confirmation invokes advancement, grants realm stats/lifespan, clears the bottleneck and refreshes progression. The accumulated `totalBonus` is additive; its derived multiplier applies to stats, and an Origin-Power-sensitive version improves rebirth SP. It resets on rebirth. Guide wording calls the effect compounding, but the accumulator itself adds each reward. L140628-140657, L140660-140743, L140777-140779, L81015-81032.

**Correction boundary:** this is not a normal combat duel using the player's live HP, and this standard failure path does not call death rebirth. Demonic/specialty combat trials are separate handlers; this result must not be generalized to their every failure mode.

## Death and lifespan

Initial maximum age is **100**, with later realm/law/physique/secondary contributions. Realm-based lifespan is category-sensitive and delegated to the active method where appropriate. L15056, L139794-139815. End of Life opens a restart modal; the restart action performs death rebirth and credits pending SP. Voluntary rebirth uses the same settlement/reset flow but requires effective realm index 5. L81193-81243, L337613-337635. No runtime lifespan or combat failure was exercised.
