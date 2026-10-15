# Chain and interruption digest

Evidence E1-E9 in REPORT.md. Values are donor reference, not YAIRPG balance choices.

| Job | Inputs per unit | Time or heat | Interruption |
|---|---|---|---|
| Tannin supply | tagged log + 1000 mB water | 8000 ticks | early unseal resets elapsed work |
| Limewater supply | flux or lime + 500 mB water | instant barrel | no sealed timer |
| Brine supply | 9 saltwater + 1 vinegar | instant fluid mixing | no sealed timer |
| Brining food | eligible nonrotten food + 125 mB brine | 4000 ticks | early unseal resets timer; completed food carries trait |
| Hide soak / rinse / tan | small 300, medium 400, large 500 mB, respectively limewater / water / tannin | 8000 ticks per barrel stage | early unseal resets timer, unchanged unfinished inputs |
| Lye supply | five wood ash + 1000 mB water | pot, 600 C, 2000 boiling ticks plus pre-boil gate | losing boiling resets accumulated boiling work; catch-up consumes fuel |
| Bleaching | colored item + 25 mB lye | 1000 ticks | timed barrel, distinct from lye supply |
| Mud brick drying | placed wet brick, up to four per block | >24000 ticks plus random-tick completion | rain at sampled update resets counter; adding wet brick resets batch; picking unfinished brick returns wet item |
| Ceramic firing | unfired ceramic, recipe heat capability | brick/fire brick/pick mold 1399 C | threshold conversion; not a second fixed timer |
| Pit kiln | up to four ordinary placed items, eight straw, eight logs, valid enclosure and ignition | 8000 tick burn, 1400 C maximum | missing/blocked fire or invalid enclosure consumes fuel and returns placed contents at their current state |

Barrel output batching uses integer minimum of item and fluid ratios; one timer can process several units. Spare item/fluid amounts remain according to output-fluid rules. Output-fluid conversion is capacity-limited and not a blanket conservation model. Inputs are rechecked at completion. Listed hide/brining rows have no on_seal/on_unseal transforms; do not generalize unchanged early-unseal inputs to every barrel recipe.

Pit heat is clamp(progress * 1.125,0,1) * maximum temperature. At 1399 C and default settings the threshold is about 7106.03 elapsed ticks, reached on a later integer tick, before 8000-tick burnout. This is a calculated inference, not measured play. Interruption retains already converted goods too. Rain is explicit in drying; rain effects on the Minecraft fire above a kiln are inherited behavior and were not native-tested here.

Scraping saves a 16-bit completion mask. Each cell sets a bit; all bits complete converts the actual input and optional extra drop. The supported surface is the logs tag and the tool is the knives tag. Manual spatial coverage has no elapsed work timer.

Molds keep a fluid tank and heat state. Matching fluid and amount determine the metal-specific casting result; removal refuses molten contents. Copper pick head consumes 100 mB and has break chance 1. Assembly chooses a copper tool recipe, consumes a wooden rod, and copies only the forging bonus from the designated head position.

Calendar.getTicks returns playerTime, distinct from calendarTime used for seasons. Ordinary active server ticks increment playerTime with players present; sleep/set-time paths also add jumps to both clocks. Default empty-server stop means elapsed wall-clock absence is not ordinary offline production. Barrel catch-up temporarily rewinds the calendar transaction around ordered completion boundaries; pot catch-up consumes finite fuel. Unloaded weather-history fidelity for drying was not established.
