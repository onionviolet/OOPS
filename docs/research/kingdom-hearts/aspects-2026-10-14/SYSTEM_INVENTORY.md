# System inventory

All distinct named families encountered in the selected KH1/KH2 archives and adjacent inspected formats are listed. This is a discovery inventory, not a claim to census every native executable subsystem. Sizes come from installed bytes. Unknown or unread families remain explicit. Every 0a record is retained even when names repeat. See [deeper systems](DEEPER_SYSTEMS.md) for the top three by multiverse payoff.

| Code | System/family | Where | Size signal | This lane coverage |
|---|---|---|---|---|
| I01 | Attack parameters | `00battle.bin/atkp` | 130509 bytes | Undocumented here: retained, evaluator unread |
| I02 | Party attacks | `00battle.bin/ptya` | 15172 bytes | Undocumented here: retained, evaluator unread |
| I03 | Prize table | `00battle.bin/przt` | 4424 bytes | Undocumented here: retained, evaluator unread |
| I04 | Voice table | `00battle.bin/vtbl` | 3382 bytes | Undocumented here: retained, evaluator unread |
| I05 | Character growth | `00battle.bin/lvup` | 20708 bytes | Read: 13 x 99 |
| I06 | Mission bonus growth | `00battle.bin/bons` | 2872 bytes | Read: 179 rows |
| I07 | World battle levels | `00battle.bin/btlv` | 648 bytes | Read: 20 rows |
| I08 | Level parameters | `00battle.bin/lvpm` | 1188 bytes | Undocumented here: retained, evaluator unread |
| I09 | Enemy parameters | `00battle.bin/enmp` | 21076 bytes | Undocumented here: retained, evaluator unread |
| I10 | Patterns | `00battle.bin/patn` | 584 bytes | Undocumented here: retained, evaluator unread |
| I11 | Player parameters | `00battle.bin/plrp` | 8200 bytes | Undocumented here: retained, evaluator unread |
| I12 | Limits | `00battle.bin/limt` | 1992 bytes | Undocumented here: retained, evaluator unread |
| I13 | Summons | `00battle.bin/sumn` | 264 bytes | Read: 4 rows |
| I14 | Magic | `00battle.bin/magc` | 2024 bytes | Undocumented here: retained, evaluator unread |
| I15 | Vibration-related/unknown | `00battle.bin/vbrt` | 612 bytes | Undocumented here: retained, evaluator unread |
| I16 | Form growth | `00battle.bin/fmlv` | 368 bytes | Read: 45 rows |
| I17 | Stop-related/unknown | `00battle.bin/stop` | 68 bytes | Undocumented here: retained, evaluator unread |
| I18 | Unknown 0a entries | `00battle.bin/0a` | 612 bytes | Undocumented here: retained, evaluator unread |
| I19 | Unknown 0a entries | `00battle.bin/0a` | 396 bytes | Undocumented here: retained, evaluator unread |
| I20 | Unknown 0a entries | `00battle.bin/0a` | 2760 bytes | Undocumented here: retained, evaluator unread |
| I21 | Reaction-count/unknown | `03system.bin/rcct` | 428 bytes | Undocumented here: retained, evaluator unread |
| I22 | Commands | `03system.bin/cmd` | 36056 bytes | Partial: field schema/masks |
| I23 | Weapon model bindings | `03system.bin/went` | 3828 bytes | Partial: schema only |
| I24 | World-map state/unknown | `03system.bin/wmst` | 4480 bytes | Undocumented here: retained, evaluator unread |
| I25 | Area information | `03system.bin/arif` | 22676 bytes | Read structure + native dump, area totals retained |
| I26 | Items and stats | `03system.bin/item` | 15272 bytes | Read: 535 items/151 stats |
| I27 | Treasure/event rewards | `03system.bin/trsr` | 5164 bytes | Read: 430 rows |
| I28 | Member projections | `03system.bin/memt` | 1960 bytes | Read: 37 rows/seven selectors |
| I29 | Font palettes | `03system.bin/ftst` | 728 bytes | Partial: 9 palettes x 19 |
| I30 | Shop definitions | `03system.bin/shop` | 4256 bytes | Partial: format only |
| I31 | Weapon attachment skeletons | `03system.bin/sklt` | 216 bytes | Undocumented here: retained, evaluator unread |
| I32 | Preferences tables | `03system.bin/pref` | 7372 bytes | Undocumented here: retained, evaluator unread |
| I33 | Event-related/unknown | `03system.bin/evtp` | 152 bytes | Undocumented here: retained, evaluator unread |
| I34 | Item picture/unknown | `03system.bin/ipic` | 6264 bytes | Undocumented here: retained, evaluator unread |
| I35 | Area access dictionary | `00progress.bin/dsa` | 294 bytes | Partial: docs |
| I36 | World arrival selection | `00progress.bin/wlds` | 144 bytes | Partial: docs |
| I37 | Episode recap | `00progress.bin/epsd` | 368 bytes | Partial: 45 recap rows |
| I38 | Map boundaries/shrouds | `00progress.bin/dark` | 560 bytes | Partial: docs, unresolved values |
| I39 | World flag data/unknown | `00progress.bin/wldf` | 5596 bytes | Undocumented here: purpose uncertain |
| I40 | Flag links | `00progress.bin/link` | 4928 bytes | Partial: docs |
| I41 | World-map key display | `00progress.bin/wmky` | 184 bytes | Partial: docs |
| I42 | Per-world progress operations | `00progress world-keyed chunks` | 19 chunks | Partial: exact LM flag 34; MU24/NM58; remaining candidates private |
| I43 | World/room roster | `docs/kh2/worlds + selected ARDs` | 19 world slots, 289 English ARDs | Read roster; not all destinations audited |
| I44 | Landing points | `00worldpoint.bin` | 512 slots / 54 populated | Read: four-byte records, entrance 99 |
| I45 | Spawn placements/paths/triggers | `ARD type 12` | 3,879 entries | Partial: schema; most entity bodies unread |
| I46 | Room program scripts | `ARD type 13` | 749 entries | All decoded; selected LM/MU scripts read |
| I47 | Cutscene timeline | `ARD type 22` | 951 entries / 171,811 commands | All decoded; selected LM scene read |
| I48 | Room/mission AI bytecode | `ARD/MSN type 3` | 339 BDX entries decoded | Selected musical/tutorial methods read; remaining semantic audit OPEN |
| I49 | Mission headers and challenge policy | `msn/us/*.bar` | 303 headers | Read documented flag/reward fields; most opcode bodies unread |
| I50 | Talk-to-text linkage | `13libretto.bin` | 1,285 definitions, 1,486 boxes | Partial: pointer/terminator decode; grammar discrepancy recorded |
| I51 | Localized message corpus | `msg/us/*.bar` | 22 decoded lists / 16,258 messages | Captured in full; selected local/growth/route text read |
| I52 | Typography control tokens/font info | `MSG encoders/fontinfo.bar` | 1 non-MSG fontinfo rejection | Partial: encoding source, fontinfo semantics unread |
| I53 | Save state and checksum | `SaveData tool classes` | 13 characters, 10 form slots, world/room flags | Partial: declarations only, no user saves |
| I54 | Gummi travel/shooter/building | `gumi assets, wm messages, map chunks` | Gummi text list + captured gumi*.bin | Partial: route rule stated; graph/score/build/warp evaluators unread |
| I55 | Crafting/synthesis | `Mixdata source and related assets` | Definition family present; no native semantic row census | Undocumented here: no recipe/economy execution trace |
| I56 | Collections/journal/puzzles | `jm messages, PuzzlePieceFlags, treasure defs` | 0x30 declared puzzle flag bytes; 430 treasure rows | Partial: schema/text only |
| I57 | Audio/model/animation rendering | `BAR model/motion/audio types, Event commands` | Referenced by room/event/mission assets | Partial: data references; native render/mix loop unread |
| I58 | KH1 room/resource system | `KH1 *.ard section 5` | 239 archives / 32 sections each | Read resource lists; script sections untyped |
| I59 | KH1 growth/battle system | `KH1 btltbl.bin` | 71,232 original bytes | Undocumented here: raw captured, no semantic table decode |
| I60 | KH1 inventory/commands/model families | `OpenKH dictionaries + native resource lists` | Selected model binding verification | Partial: no exact unlock/capability/save reader |
| I61 | Remaining collection titles | `BBS/ReCOM/Theater installed packages` | Presence only | Unread: KH1/KH2 scope prioritized |
