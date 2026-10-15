# Growth, rewards and route gates

## What is actually in the tables

SHOWN, native KH2 tables parsed with the pinned OpenKH types:

| Code | Family | Count / fields | Interpretation and limit |
|---|---|---|---|
| G1 | `00battle/lvup` | 13 characters × 99 levels; experience, Strength/Magic/Defense/AP, Sword/Shield/Staff ability fields | A stable growth backbone. Fields include three ability-order choices. Exact award/level-up evaluator is not audited. |
| G2 | `00battle/bons` | 179 character-qualified reward rows; HP/MP/Drive/slot increases and two bonus items | Story/mission growth is distinct from ordinary level growth. Mission header BonusReward links to this family. No claim that 179 rows equal 179 bosses. |
| G3 | `00battle/fmlv` | 45 rows; form ID/level, XP threshold, ability and level, AntiRate nibble | Forms have their own progression records. Values do not explain which action awards form XP or all caps. |
| G4 | `00battle/sumn` | Four rows; command, summoning item, actor entities and limit command | Portable item/command unlock and invoked companion are distinct objects. HB text 17625 states summons replace the rest of the party and use a separate gauge view. |
| G5 | `03system/item` | 535 item definitions; 151 stat records | Keyblades, local weapons, magic, abilities, summons, forms, maps and reports share a typed item namespace. Definition is not ownership. Stats contain a bound ability, not merely a damage number. |
| G6 | `00battle/btlv` | 20 rows; progress flag plus per-world values | STATED docs: enabled entries contribute to local battle level. This is world progression, not automatic level matching to the player. Full native summation caller unread. |
| G7 | `03system/trsr` | 430 rows; reward item, world, room, chest/event linkage | Grant source and location can remain attached to a globally useful item. Event/chest claim semantics not traced. |
| G8 | Mission headers | 303 read: 14 DriveDisabled, 48 NoExperience, 3 MagicDisabled, 34 RetryPossible, 3 SummonDisabled bits | Counts use documented bit meanings on native bytes. Distinct restrictions can intersect. They are not a full census of every restriction because other tables and code also constrain actions. |

## What carries and what is gated

**SHOWN structure:** save-tool declarations put experience, character level/equipment/abilities, inventory and forms alongside per-world party and story fields. **INFERRED:** that split supports a continuous growth model across world changes. It does not prove arbitrary imports into every body or that every guest can travel anywhere.

**STATED returns:** world-map messages 19499/19500/19501 require drive capacity at least 5, Magnera and Thundaga respectively for Atlantica activities; journal 10837/10839/10843 repeats the intended return prompts. These are functional gates around a local story/activity, not separate permanent local character levels. Exact threshold comparisons, cap readers and completion behavior remain native questions.

**SHOWN local reward binding:** `lm02-evt`, program 0x3F, AreaSettings 7 links progress flag 0x2c22, event 104, a return jump and inventory ID 367. The item table types 367 as a recipe. Its progression script changes room 2's event-program selection. This binds scene, reward and changed revisit in authored data. It is not proof of durable atomicity or repeat-grant protection in the executable.

**STATED travel:** `wm` message 18820 distinguishes connecting worlds by clearing a Gummi route from landing at a destination. SHOWN `00worldpoint.bin` has 512 four-byte slots: 54 populated with entrance 99 and 458 zero slots. `00progress` has separate wlds/epsd/link/wmky chunks for arrival, recap, flag links and map keys. Exact route IDs, unlock graph, shooter score/ship build formulas and warp exceptions are unread. Gummi text and original captured `gumi*.bin` records are preserved privately for a targeted continuation.

**KH1 limit:** `btltbl.bin` and all selected room resources were retained; KH1 growth/ability tables have not been semantically decoded. Model/weapon and command dictionaries do not authenticate reward locations or transfer exclusions. Do not reuse KH2's 99-row count as a KH1 measurement.

PROPOSALS: KH-P01 preserves earned state while projecting present legality; KH-P04 uses one earned function in a distinct local activity; KH-P06 explains a known return requirement without leaking undiscovered destinations. Existing owners and acceptance contracts remain authoritative.
