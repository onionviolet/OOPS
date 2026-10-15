# System inventory

This is a static inventory of the available pinned artifacts, not an inventory of unavailable live server builds. Size signals are physical source lines or indexed objects, not gameplay scope. Identified-only rows are **UNDOCUMENTED** behavior. The private full tracked-file/hash census is `~/.codex/research/asp-text/extract/SOURCE_CENSUS.json`. No semantic completeness is claimed for every source file.

| System | Location | Size signal / prior coverage |
|---|---|---|
| Conversation | `std/living/response_mon.c` | 636 source lines across 1 files; new deep read |
| NPC speech, stories and action AI | `obj/monster.c` | 2680 source lines across 1 files; extended deep read |
| Player save | `global/player.c` | 2241 source lines across 1 files; new deep read |
| Item reconstruction | `global/auto_load.c` | 556 source lines across 1 files; new deep read |
| Quest registry | `obj/handlers/quest_handler.c` | 599 source lines across 1 files; extended |
| Practice rules | `obj/handlers/taskmaster.c` | 953 source lines across 1 files; prior skill digest |
| Skill state/bonus | `std/living/skills.c` | 749 source lines across 1 files; prior skill digest |
| NPC authoring | `d/learning/newbie/introduction/examples/advanced_npc.c` | 139 source lines across 1 files; new read |
| World event rendering | `global/events.c` | 2553 source lines across 1 files; identified |
| Player score/options | `cmds/player` | 16329 source lines across 131 files; partial/prior help |

## Available build census

| Snapshot | Tracked files | Commit |
|---|---:|---|
| discworld | 6128 | `8c8619c64c0a41f09e406a97ee1e0a084ff92a60` |

## Discovered module and subsystem catalogue

Rows below are mechanically named modules. Size and existence are SHOWN; behavior is UNDOCUMENTED unless a row links to an aspect or prior digest. Deeper payoff is ranked in [DEEPER_SYSTEMS.md](DEEPER_SYSTEMS.md).

| Module / subsystem | Path | Size signal | Documentation |
|---|---|---:|---|
| applications_handler | `obj/handlers/applications_handler.c` | 673 lines | **UNDOCUMENTED**, identified only |
| armoury | `obj/handlers/armoury.c` | 550 lines | **UNDOCUMENTED**, identified only |
| artifact_handler | `obj/handlers/artifact_handler.c` | 269 lines | **UNDOCUMENTED**, identified only |
| attack_messages | `obj/handlers/attack_messages.c` | 363 lines | **UNDOCUMENTED**, identified only |
| autodoc_file | `obj/handlers/autodoc/autodoc_file.c` | 991 lines | **UNDOCUMENTED**, identified only |
| autodoc_handler | `obj/handlers/autodoc/autodoc_handler.c` | 638 lines | **UNDOCUMENTED**, identified only |
| autodoc_html | `obj/handlers/autodoc/autodoc_html.c` | 772 lines | **UNDOCUMENTED**, identified only |
| autodoc_nroff | `obj/handlers/autodoc/autodoc_nroff.c` | 762 lines | **UNDOCUMENTED**, identified only |
| bank_handler | `obj/handlers/bank_handler.c` | 451 lines | **UNDOCUMENTED**, identified only |
| bits_controller | `obj/handlers/bits_controller.c` | 77 lines | **UNDOCUMENTED**, identified only |
| board_handler | `obj/handlers/board_handler.c` | 1497 lines | **UNDOCUMENTED**, identified only |
| book_handler | `obj/handlers/book_handler.c` | 337 lines | **UNDOCUMENTED**, identified only |
| bounty | `obj/handlers/bounty.c` | 413 lines | **UNDOCUMENTED**, identified only |
| broadcaster | `obj/handlers/broadcaster.c` | 472 lines | **UNDOCUMENTED**, identified only |
| change_skills | `obj/handlers/change_skills.c` | 603 lines | **UNDOCUMENTED**, identified only |
| chime_handler | `obj/handlers/chime_handler.c` | 162 lines | **UNDOCUMENTED**, identified only |
| clothing_handler | `obj/handlers/clothing_handler.c` | 745 lines | **UNDOCUMENTED**, identified only |
| club_handler | `obj/handlers/club_handler.c` | 25 lines | **UNDOCUMENTED**, identified only |
| clusters | `obj/handlers/clusters.c` | 673 lines | **UNDOCUMENTED**, identified only |
| cmr_handler | `obj/handlers/cmr_handler.c` | 317 lines | **UNDOCUMENTED**, identified only |
| cmr_library | `obj/handlers/cmr_library.c` | 107 lines | **UNDOCUMENTED**, identified only |
| co_ordinate_handler | `obj/handlers/co_ordinate_handler.c` | 150 lines | **UNDOCUMENTED**, identified only |
| colour | `obj/handlers/colour.c` | 65 lines | **UNDOCUMENTED**, identified only |
| complaints_handler | `obj/handlers/complaints_handler.c` | 82 lines | **UNDOCUMENTED**, identified only |
| converter | `obj/handlers/converter.c` | 84 lines | **UNDOCUMENTED**, identified only |
| corpse_handler | `obj/handlers/corpse_handler.c` | 286 lines | **UNDOCUMENTED**, identified only |
| cpi_handler | `obj/handlers/cpi_handler.c` | 143 lines | **UNDOCUMENTED**, identified only |
| data | `obj/handlers/data.c` | 929 lines | **UNDOCUMENTED**, identified only |
| english_handler | `obj/handlers/english_handler.c` | 139 lines | **UNDOCUMENTED**, identified only |
| error_handler | `obj/handlers/error_handler.c` | 18 lines | **UNDOCUMENTED**, identified only |
| error_tracker | `obj/handlers/error_tracker.c` | 20 lines | **UNDOCUMENTED**, identified only |
| fairy_godmothers | `obj/handlers/fairy_godmothers.c` | 435 lines | **UNDOCUMENTED**, identified only |
| finderror_helper | `obj/handlers/finderror_helper.c` | 309 lines | **UNDOCUMENTED**, identified only |
| firework | `obj/handlers/firework.c` | 151 lines | **UNDOCUMENTED**, identified only |
| folder_handler | `obj/handlers/folder_handler.c` | 800 lines | **UNDOCUMENTED**, identified only |
| fuel_handler | `obj/handlers/fuel_handler.c` | 60 lines | **UNDOCUMENTED**, identified only |
| garbage | `obj/handlers/garbage.c` | 419 lines | **UNDOCUMENTED**, identified only |
| gathering | `obj/handlers/gathering.c` | 267 lines | **UNDOCUMENTED**, identified only |
| gossip_handler | `obj/handlers/gossip_handler.c` | 154 lines | **UNDOCUMENTED**, identified only |
| group_handler | `obj/handlers/group_handler.c` | 997 lines | **UNDOCUMENTED**, identified only |
| haggle_handler | `obj/handlers/haggle_handler.c` | 260 lines | **UNDOCUMENTED**, identified only |
| hist_handler | `obj/handlers/hist_handler.c` | 184 lines | **UNDOCUMENTED**, identified only |
| hospital | `obj/handlers/hospital.c` | 1749 lines | **UNDOCUMENTED**, identified only |
| housing | `obj/handlers/housing.c` | 925 lines | prior dossier / selected aspect |
| image | `obj/handlers/image.c` | 92 lines | **UNDOCUMENTED**, identified only |
| case_control | `obj/handlers/inherit/case_control.c` | 482 lines | **UNDOCUMENTED**, identified only |
| citizen_elections | `obj/handlers/inherit/citizen_elections.c` | 633 lines | **UNDOCUMENTED**, identified only |
| citizens | `obj/handlers/inherit/citizens.c` | 270 lines | **UNDOCUMENTED**, identified only |
| club_basic | `obj/handlers/inherit/club_basic.c` | 1084 lines | **UNDOCUMENTED**, identified only |
| club_discuss | `obj/handlers/inherit/club_discuss.c` | 2457 lines | **UNDOCUMENTED**, identified only |
| club_elected | `obj/handlers/inherit/club_elected.c` | 2100 lines | **UNDOCUMENTED**, identified only |
| club_family | `obj/handlers/inherit/club_family.c` | 701 lines | **UNDOCUMENTED**, identified only |
| club_inherit | `obj/handlers/inherit/club_inherit.c` | 449 lines | **UNDOCUMENTED**, identified only |
| club_personal | `obj/handlers/inherit/club_personal.c` | 48 lines | **UNDOCUMENTED**, identified only |
| craft_skills | `obj/handlers/inherit/craft_skills.c` | 95 lines | **UNDOCUMENTED**, identified only |
| distance_handler | `obj/handlers/inherit/distance_handler.c` | 169 lines | **UNDOCUMENTED**, identified only |
| error_handler | `obj/handlers/inherit/error_handler.c` | 786 lines | **UNDOCUMENTED**, identified only |
| nomic_rules | `obj/handlers/inherit/nomic_rules.c` | 342 lines | **UNDOCUMENTED**, identified only |
| player_council | `obj/handlers/inherit/player_council.c` | 881 lines | **UNDOCUMENTED**, identified only |
| inhume | `obj/handlers/inhume.c` | 28 lines | **UNDOCUMENTED**, identified only |
| item_tracker | `obj/handlers/item_tracker.c` | 262 lines | **UNDOCUMENTED**, identified only |
| key_handler | `obj/handlers/key_handler.c` | 281 lines | **UNDOCUMENTED**, identified only |
| languages | `obj/handlers/languages.c` | 368 lines | prior dossier / selected aspect |
| library | `obj/handlers/library.c` | 532 lines | **UNDOCUMENTED**, identified only |
| livings | `obj/handlers/livings.c` | 246 lines | **UNDOCUMENTED**, identified only |
| login_handler | `obj/handlers/login_handler.c` | 1042 lines | **UNDOCUMENTED**, identified only |
| mag_eff_handler | `obj/handlers/mag_eff_handler.c` | 334 lines | **UNDOCUMENTED**, identified only |
| mail_track | `obj/handlers/mail_track.c` | 476 lines | **UNDOCUMENTED**, identified only |
| mailer | `obj/handlers/mailer.c` | 1487 lines | **UNDOCUMENTED**, identified only |
| map | `obj/handlers/map.c` | 1326 lines | **UNDOCUMENTED**, identified only |
| map_helper | `obj/handlers/map_helper.c` | 355 lines | **UNDOCUMENTED**, identified only |
| mime | `obj/handlers/mime.c` | 366 lines | **UNDOCUMENTED**, identified only |
| money_handler | `obj/handlers/money_handler.c` | 1546 lines | prior dossier / selected aspect |
| monster_handler | `obj/handlers/monster_handler.c` | 41 lines | **UNDOCUMENTED**, identified only |
| multiplayer | `obj/handlers/multiplayer.c` | 379 lines | **UNDOCUMENTED**, identified only |
| new_soul | `obj/handlers/new_soul.c` | 1153 lines | **UNDOCUMENTED**, identified only |
| newbiehelpers | `obj/handlers/newbiehelpers.c` | 555 lines | **UNDOCUMENTED**, identified only |
| news_handler | `obj/handlers/news_handler.c` | 76 lines | **UNDOCUMENTED**, identified only |
| newspaper | `obj/handlers/newspaper.c` | 848 lines | **UNDOCUMENTED**, identified only |
| nmoney_handler | `obj/handlers/nmoney_handler.c` | 1448 lines | **UNDOCUMENTED**, identified only |
| non_refuelling_lantern | `obj/handlers/non_refuelling_lantern.c` | 150 lines | **UNDOCUMENTED**, identified only |
| nquest_handler | `obj/handlers/nquest_handler.c` | 599 lines | **UNDOCUMENTED**, identified only |
| nroff | `obj/handlers/nroff.c` | 634 lines | **UNDOCUMENTED**, identified only |
| options_handler | `obj/handlers/options_handler.c` | 954 lines | **UNDOCUMENTED**, identified only |
| parcel | `obj/handlers/parcel.c` | 305 lines | **UNDOCUMENTED**, identified only |
| pattern_compiler | `obj/handlers/pattern_compiler.c` | 462 lines | **UNDOCUMENTED**, identified only |
| peopler | `obj/handlers/peopler.c` | 416 lines | **UNDOCUMENTED**, identified only |
| philosophies | `obj/handlers/philosophies.c` | 444 lines | **UNDOCUMENTED**, identified only |
| player_council | `obj/handlers/player_council.c` | 26 lines | **UNDOCUMENTED**, identified only |
| player_handler | `obj/handlers/player_handler.c` | 1305 lines | prior dossier / selected aspect |
| player_shop | `obj/handlers/player_shop.c` | 191 lines | **UNDOCUMENTED**, identified only |
| playerinfo | `obj/handlers/playerinfo.c` | 1617 lines | **UNDOCUMENTED**, identified only |
| playtesters | `obj/handlers/playtesters.c` | 983 lines | **UNDOCUMENTED**, identified only |
| potion | `obj/handlers/potion.c` | 158 lines | **UNDOCUMENTED**, identified only |
| potion_space | `obj/handlers/potion_space.c` | 165 lines | **UNDOCUMENTED**, identified only |
| project_management | `obj/handlers/project_management.c` | 2903 lines | **UNDOCUMENTED**, identified only |
| property_tracker | `obj/handlers/property_tracker.c` | 232 lines | **UNDOCUMENTED**, identified only |
| quest_handler | `obj/handlers/quest_handler.c` | 599 lines | prior dossier / selected aspect |
| random_names | `obj/handlers/random_names.c` | 183 lines | **UNDOCUMENTED**, identified only |
| random_num | `obj/handlers/random_num.c` | 97 lines | **UNDOCUMENTED**, identified only |
| reaction | `obj/handlers/reaction.c` | 468 lines | **UNDOCUMENTED**, identified only |
| refresh | `obj/handlers/refresh.c` | 314 lines | **UNDOCUMENTED**, identified only |
| report_handler | `obj/handlers/report_handler.c` | 305 lines | **UNDOCUMENTED**, identified only |
| room_handler | `obj/handlers/room_handler.c` | 735 lines | **UNDOCUMENTED**, identified only |
| room_rental | `obj/handlers/room_rental.c` | 326 lines | **UNDOCUMENTED**, identified only |
| route_handler | `obj/handlers/route_handler.c` | 110 lines | **UNDOCUMENTED**, identified only |
| script_processor | `obj/handlers/script_processor.c` | 79 lines | **UNDOCUMENTED**, identified only |
| snmp_handler | `obj/handlers/snmp_handler.c` | 78 lines | **UNDOCUMENTED**, identified only |
| soul_compiler | `obj/handlers/soul_compiler.c` | 517 lines | **UNDOCUMENTED**, identified only |
| start_positions | `obj/handlers/start_positions.c` | 155 lines | **UNDOCUMENTED**, identified only |
| state_change | `obj/handlers/state_change.c` | 154 lines | **UNDOCUMENTED**, identified only |
| taskmaster | `obj/handlers/taskmaster.c` | 953 lines | prior dossier / selected aspect |
| team | `obj/handlers/team.c` | 445 lines | **UNDOCUMENTED**, identified only |
| term | `obj/handlers/term.c` | 528 lines | **UNDOCUMENTED**, identified only |
| terrain_handler | `obj/handlers/terrain_handler.c` | 815 lines | **UNDOCUMENTED**, identified only |
| dungeon_maker | `obj/handlers/terrain_things/dungeon_maker.c` | 402 lines | **UNDOCUMENTED**, identified only |
| logroom | `obj/handlers/terrain_things/logroom.c` | 69 lines | **UNDOCUMENTED**, identified only |
| sample_passage | `obj/handlers/terrain_things/sample_passage.c` | 13 lines | **UNDOCUMENTED**, identified only |
| sample_passage_1 | `obj/handlers/terrain_things/sample_passage_1.c` | 13 lines | **UNDOCUMENTED**, identified only |
| sample_passage_2 | `obj/handlers/terrain_things/sample_passage_2.c` | 13 lines | **UNDOCUMENTED**, identified only |
| sample_room_1 | `obj/handlers/terrain_things/sample_room_1.c` | 16 lines | **UNDOCUMENTED**, identified only |
| sample_room_2 | `obj/handlers/terrain_things/sample_room_2.c` | 16 lines | **UNDOCUMENTED**, identified only |
| sample_room_3 | `obj/handlers/terrain_things/sample_room_3.c` | 16 lines | **UNDOCUMENTED**, identified only |
| title_handler | `obj/handlers/title_handler.c` | 165 lines | **UNDOCUMENTED**, identified only |
| tokeniser | `obj/handlers/tokeniser.c` | 152 lines | **UNDOCUMENTED**, identified only |
| top_ten_handler | `obj/handlers/top_ten_handler.c` | 712 lines | **UNDOCUMENTED**, identified only |
| trig | `obj/handlers/trig.c` | 75 lines | **UNDOCUMENTED**, identified only |
| twiki | `obj/handlers/twiki.c` | 223 lines | **UNDOCUMENTED**, identified only |
| vhandler | `obj/handlers/vhandler.c` | 47 lines | **UNDOCUMENTED**, identified only |
| virtuals | `obj/handlers/virtuals.c` | 143 lines | **UNDOCUMENTED**, identified only |
| wander_handler | `obj/handlers/wander_handler.c` | 513 lines | **UNDOCUMENTED**, identified only |
| weather | `obj/handlers/weather.c` | 1640 lines | prior dossier / selected aspect |
| world_map | `obj/handlers/world_map.c` | 507 lines | **UNDOCUMENTED**, identified only |
| global/alias.c | `global/alias.c` | 1 files / 343 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/auto_load.c | `global/auto_load.c` | 1 files / 556 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/auto_mailer.c | `global/auto_mailer.c` | 1 files / 60 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/cloner.c | `global/cloner.c` | 1 files / 268 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/command.c | `global/command.c` | 1 files / 172 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/communicate.c | `global/communicate.c` | 1 files / 395 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/creator.c | `global/creator.c` | 1 files / 74 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/events.c | `global/events.c` | 1 files / 2553 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/family.c | `global/family.c` | 1 files / 432 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/finger.c | `global/finger.c` | 1 files / 452 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/friends.c | `global/friends.c` | 1 files / 89 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/guild-race.c | `global/guild-race.c` | 1 files / 264 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/handlers | `global/handlers` | 1 files / 354 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/history.c | `global/history.c` | 1 files / 212 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/le.c | `global/le.c` | 1 files / 160 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/line_ed.c | `global/line_ed.c` | 1 files / 530 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/log.c | `global/log.c` | 1 files / 21 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/lord.c | `global/lord.c` | 1 files / 295 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/magic.c | `global/magic.c` | 1 files / 2885 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/more_file.c | `global/more_file.c` | 1 files / 508 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/more_string.c | `global/more_string.c` | 1 files / 374 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/new_parse.c | `global/new_parse.c` | 1 files / 2156 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/newbie_junk.c | `global/newbie_junk.c` | 1 files / 259 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/nickname.c | `global/nickname.c` | 1 files / 38 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/options_control.c | `global/options_control.c` | 1 files / 195 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/parser.c | `global/parser.c` | 1 files / 596 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/parser.h | `global/parser.h` | 1 files / 2 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/path.c | `global/path.c` | 1 files / 200 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/player.c | `global/player.c` | 1 files / 2241 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/playtester.c | `global/playtester.c` | 1 files / 620 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/psoul.c | `global/psoul.c` | 1 files / 637 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/pweath.c | `global/pweath.c` | 1 files / 228 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/shut.c | `global/shut.c` | 1 files / 179 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/spells.c | `global/spells.c` | 1 files / 114 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/start_position.c | `global/start_position.c` | 1 files / 313 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/telnet.c | `global/telnet.c` | 1 files / 52 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/virtual | `global/virtual` | 21 files / 2165 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/wiz_channels.c | `global/wiz_channels.c` | 1 files / 301 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/wiz_file_comm.c | `global/wiz_file_comm.c` | 1 files / 515 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/wiz_info_comm.c | `global/wiz_info_comm.c` | 1 files / 75 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/wiz_inter_comm.c | `global/wiz_inter_comm.c` | 1 files / 66 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/wiz_object_comm.c | `global/wiz_object_comm.c` | 1 files / 113 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| global/wiz_present.c | `global/wiz_present.c` | 1 files / 253 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/living/armour.c | `std/living/armour.c` | 1 files / 485 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/living/carrying.c | `std/living/carrying.c` | 1 files / 309 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/living/combat.c | `std/living/combat.c` | 1 files / 3337 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/living/corpse.c | `std/living/corpse.c` | 1 files / 317 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/living/crafts.c | `std/living/crafts.c` | 1 files / 92 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/living/effects.c | `std/living/effects.c` | 1 files / 22 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/living/force.c | `std/living/force.c` | 1 files / 165 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/living/gender.c | `std/living/gender.c` | 1 files / 101 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/living/gender.old | `std/living/gender.old` | 1 files / 75 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/living/health.c | `std/living/health.c` | 1 files / 430 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/living/holding.c | `std/living/holding.c` | 1 files / 334 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/living/living.c | `std/living/living.c` | 1 files / 1502 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/living/living.eff_shad.c | `std/living/living.eff_shad.c` | 1 files / 1507 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/living/living.no_eff_shad.c | `std/living/living.no_eff_shad.c` | 1 files / 1502 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/living/mon-shadow.c | `std/living/mon-shadow.c` | 1 files / 19 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/living/mon_actions.c | `std/living/mon_actions.c` | 1 files / 112 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/living/money.c | `std/living/money.c` | 1 files / 170 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/living/nationality.c | `std/living/nationality.c` | 1 files / 128 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/living/respond_cmd.c | `std/living/respond_cmd.c` | 1 files / 92 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/living/response_mon.c | `std/living/response_mon.c` | 1 files / 636 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/living/skills.c | `std/living/skills.c` | 1 files / 749 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/living/spells.c | `std/living/spells.c` | 1 files / 151 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/living/stats.c | `std/living/stats.c` | 1 files / 587 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/auction_room.c | `std/room/auction_room.c` | 1 files / 1613 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/basic | `std/room/basic` | 15 files / 6240 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/basic_room.c | `std/room/basic_room.c` | 1 files / 3150 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/basic_room_new.c | `std/room/basic_room_new.c` | 1 files / 2826 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/bath_house_inside.c | `std/room/bath_house_inside.c` | 1 files / 20 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/bath_house_outside.c | `std/room/bath_house_outside.c` | 1 files / 20 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/club_control_room.c | `std/room/club_control_room.c` | 1 files / 26 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/complaints_room.c | `std/room/complaints_room.c` | 1 files / 37 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/controller | `std/room/controller` | 5 files / 2764 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/council_archive.c | `std/room/council_archive.c` | 1 files / 129 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/council_cases.c | `std/room/council_cases.c` | 1 files / 1105 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/council_chambers.c | `std/room/council_chambers.c` | 1 files / 562 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/council_citizenship.c | `std/room/council_citizenship.c` | 1 files / 858 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/council_document.c | `std/room/council_document.c` | 1 files / 19 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/council_fine.c | `std/room/council_fine.c` | 1 files / 161 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/council_treasury.c | `std/room/council_treasury.c` | 1 files / 460 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/council_vote.c | `std/room/council_vote.c` | 1 files / 358 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/delivery_room.c | `std/room/delivery_room.c` | 1 files / 39 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/furniture | `std/room/furniture` | 27 files / 8759 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/graffbase.c | `std/room/graffbase.c` | 1 files / 176 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/guild-outside.c | `std/room/guild-outside.c` | 1 files / 21 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/guild.c | `std/room/guild.c` | 1 files / 20 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/inherit | `std/room/inherit` | 49 files / 26702 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/meeting.c | `std/room/meeting.c` | 1 files / 21 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/newspaper_office.c | `std/room/newspaper_office.c` | 1 files / 21 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/newspaper_subscription.c | `std/room/newspaper_subscription.c` | 1 files / 573 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/npcroom.c | `std/room/npcroom.c` | 1 files / 129 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/outside.c | `std/room/outside.c` | 1 files / 358 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/parcel_inherit.c | `std/room/parcel_inherit.c` | 1 files / 238 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/player_housing.c | `std/room/player_housing.c` | 1 files / 178 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/player_housing_outside.c | `std/room/player_housing_outside.c` | 1 files / 165 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/punishments | `std/room/punishments` | 6 files / 658 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/rooftop.c | `std/room/rooftop.c` | 1 files / 746 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/room_rental.c | `std/room/room_rental.c` | 1 files / 25 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/room_rental_office.c | `std/room/room_rental_office.c` | 1 files / 25 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/room_save.c | `std/room/room_save.c` | 1 files / 68 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/safe_room.c | `std/room/safe_room.c` | 1 files / 240 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/stable.c | `std/room/stable.c` | 1 files / 538 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/topography | `std/room/topography` | 17 files / 546 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/voting_room.c | `std/room/voting_room.c` | 1 files / 48 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/water_inside.c | `std/room/water_inside.c` | 1 files / 98 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/room/water_outside.c | `std/room/water_outside.c` | 1 files / 98 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/README | `std/shops/README` | 1 files / 8 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/auction_house.c | `std/shops/auction_house.c` | 1 files / 18 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/bank.c | `std/shops/bank.c` | 1 files / 485 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/bank_franchise.c | `std/shops/bank_franchise.c` | 1 files / 169 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/bank_master.c | `std/shops/bank_master.c` | 1 files / 164 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/binding.c | `std/shops/binding.c` | 1 files / 108 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/book_shop.c | `std/shops/book_shop.c` | 1 files / 141 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/bureau_de_change.c | `std/shops/bureau_de_change.c` | 1 files / 310 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/commercial.c | `std/shops/commercial.c` | 1 files / 6 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/controllers | `std/shops/controllers` | 2 files / 3019 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/craft_shop.c | `std/shops/craft_shop.c` | 1 files / 28 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/craft_shop_category.c | `std/shops/craft_shop_category.c` | 1 files / 29 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/engrave_inherit.c | `std/shops/engrave_inherit.c` | 1 files / 213 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/general_shop.c | `std/shops/general_shop.c` | 1 files / 1977 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/general_shop_close.c | `std/shops/general_shop_close.c` | 1 files / 12 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/inherit | `std/shops/inherit` | 22 files / 18802 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/item_shop.c | `std/shops/item_shop.c` | 1 files / 50 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/item_shop_close.c | `std/shops/item_shop_close.c` | 1 files / 12 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/item_shop_outside.c | `std/shops/item_shop_outside.c` | 1 files / 43 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/laundry_entry_inherit.c | `std/shops/laundry_entry_inherit.c` | 1 files / 129 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/money_changer.c | `std/shops/money_changer.c` | 1 files / 131 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/objs | `std/shops/objs` | 1 files / 39 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/player_craft_shop.c | `std/shops/player_craft_shop.c` | 1 files / 97 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/player_pub.c | `std/shops/player_pub.c` | 1 files / 41 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/player_shop | `std/shops/player_shop` | 24 files / 9692 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/potion_shop.c | `std/shops/potion_shop.c` | 1 files / 185 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/print_shop.c | `std/shops/print_shop.c` | 1 files / 1212 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/pub_shop.c | `std/shops/pub_shop.c` | 1 files / 62 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/pub_shop_outside.c | `std/shops/pub_shop_outside.c` | 1 files / 62 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/real_estate_auction.c | `std/shops/real_estate_auction.c` | 1 files / 373 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/sign_writer.c | `std/shops/sign_writer.c` | 1 files / 528 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/storeroom.c | `std/shops/storeroom.c` | 1 files / 100 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/vault.c | `std/shops/vault.c` | 1 files / 229 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shops/vault_entry.c | `std/shops/vault_entry.c` | 1 files / 35 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/effects/attached | `std/effects/attached` | 7 files / 642 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/effects/basic.c | `std/effects/basic.c` | 1 files / 133 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/effects/curses | `std/effects/curses` | 9 files / 424 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/effects/disease | `std/effects/disease` | 12 files / 1140 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/effects/external | `std/effects/external` | 4 files / 312 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/effects/fighting | `std/effects/fighting` | 1 files / 60 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/effects/npc | `std/effects/npc` | 26 files / 1825 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/effects/object | `std/effects/object` | 17 files / 1450 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/effects/other | `std/effects/other` | 2 files / 219 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/effects/room | `std/effects/room` | 10 files / 955 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shadows/attached | `std/shadows/attached` | 3 files / 358 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shadows/curses | `std/shadows/curses` | 7 files / 477 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shadows/disease | `std/shadows/disease` | 2 files / 95 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shadows/fighting | `std/shadows/fighting` | 3 files / 263 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shadows/misc | `std/shadows/misc` | 12 files / 2095 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shadows/npc | `std/shadows/npc` | 25 files / 2085 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shadows/object | `std/shadows/object` | 9 files / 1239 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shadows/peace_shadow.c | `std/shadows/peace_shadow.c` | 1 files / 141 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/shadows/room | `std/shadows/room` | 2 files / 48 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| obj/reactions/base.hdr | `obj/reactions/base.hdr` | 1 files / 4 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| obj/reactions/base.hdr_dc.c | `obj/reactions/base.hdr_dc.c` | 1 files / 80 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| obj/reactions/base.hdr_dc.c.old | `obj/reactions/base.hdr_dc.c.old` | 1 files / 4380 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| obj/reactions/black_tea.rcn | `obj/reactions/black_tea.rcn` | 1 files / 6 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| obj/reactions/blackpowder.rcn | `obj/reactions/blackpowder.rcn` | 1 files / 14 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| obj/reactions/blue_water.rcn | `obj/reactions/blue_water.rcn` | 1 files / 43 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| obj/reactions/blue_water.rcn_dc.c | `obj/reactions/blue_water.rcn_dc.c` | 1 files / 5 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/npc/goal_inherit.h | `std/npc/goal_inherit.h` | 1 files / 34 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/npc/goals | `std/npc/goals` | 4 files / 418 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/npc/goals_inherit.c | `std/npc/goals_inherit.c` | 1 files / 471 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/npc/inherit | `std/npc/inherit` | 1 files / 53 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/npc/locksmith.c | `std/npc/locksmith.c` | 1 files / 775 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/npc/npc_intelligent.c | `std/npc/npc_intelligent.c` | 1 files / 68 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/npc/plans | `std/npc/plans` | 2 files / 216 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/npc/surface_decorator.c | `std/npc/surface_decorator.c` | 1 files / 443 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/npc/taliswoman.c | `std/npc/taliswoman.c` | 1 files / 257 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| std/npc/test_npc.c | `std/npc/test_npc.c` | 1 files / 20 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| cmds/base.c | `cmds/base.c` | 1 files / 47 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| cmds/bug_replies.c | `cmds/bug_replies.c` | 1 files / 345 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| cmds/creator | `cmds/creator` | 135 files / 12146 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| cmds/errors_base.c | `cmds/errors_base.c` | 1 files / 599 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| cmds/errors_base2.c | `cmds/errors_base2.c` | 1 files / 478 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| cmds/guild-race | `cmds/guild-race` | 9 files / 1902 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| cmds/guild_base.c | `cmds/guild_base.c` | 1 files / 237 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| cmds/living | `cmds/living` | 65 files / 8448 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| cmds/lord | `cmds/lord` | 23 files / 2356 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| cmds/player | `cmds/player` | 131 files / 16329 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| cmds/playtester | `cmds/playtester` | 9 files / 1276 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| cmds/position_base.c | `cmds/position_base.c` | 1 files / 306 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| cmds/report_base.c | `cmds/report_base.c` | 1 files / 586 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| cmds/speech.c | `cmds/speech.c` | 1 files / 375 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| cmds/template.c | `cmds/template.c` | 1 files / 34 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| cmds/theft_base.c | `cmds/theft_base.c` | 1 files / 206 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| d/admin | `d/admin` | 170 files / 14083 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| d/dist | `d/dist` | 130 files / 7716 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| d/learning | `d/learning` | 193 files / 15710 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| d/liaison | `d/liaison` | 61 files / 13159 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/ac_callback.h | `include/ac_callback.h` | 1 files / 30 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/access.h | `include/access.h` | 1 files / 24 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/alias.h | `include/alias.h` | 1 files / 45 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/all_inc.h | `include/all_inc.h` | 1 files / 28 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/am_time.h | `include/am_time.h` | 1 files / 297 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/applications.h | `include/applications.h` | 1 files / 44 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/armour.h | `include/armour.h` | 1 files / 29 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/armoury.h | `include/armoury.h` | 1 files / 58 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/artifacts.h | `include/artifacts.h` | 1 files / 9 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/assassin.h | `include/assassin.h` | 1 files / 38 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/assert.h | `include/assert.h` | 1 files / 1 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/attack_messages.h | `include/attack_messages.h` | 1 files / 16 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/autodoc.h | `include/autodoc.h` | 1 files / 69 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/bit.h | `include/bit.h` | 1 files / 15 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/bits_controller.h | `include/bits_controller.h` | 1 files / 14 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/board.h | `include/board.h` | 1 files / 162 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/board_master.h | `include/board_master.h` | 1 files / 41 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/book_handler.h | `include/book_handler.h` | 1 files / 85 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/bounty.h | `include/bounty.h` | 1 files / 10 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/broadcaster.h | `include/broadcaster.h` | 1 files / 21 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/chime.h | `include/chime.h` | 1 files / 21 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/client.h | `include/client.h` | 1 files / 25 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/climate.h | `include/climate.h` | 1 files / 15 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/clothing.h | `include/clothing.h` | 1 files / 21 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/clubs.h | `include/clubs.h` | 1 files / 505 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/cmds | `include/cmds` | 7 files / 222 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/cmr.h | `include/cmr.h` | 1 files / 37 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/colour.h | `include/colour.h` | 1 files / 48 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/combat.h | `include/combat.h` | 1 files / 336 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/command.h | `include/command.h` | 1 files / 34 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/comms.h | `include/comms.h` | 1 files / 6 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/complaints_handler.h | `include/complaints_handler.h` | 1 files / 19 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/config.h | `include/config.h` | 1 files / 53 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/corpse.h | `include/corpse.h` | 1 files / 21 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/cpi.h | `include/cpi.h` | 1 files / 2 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/crafts.h | `include/crafts.h` | 1 files / 105 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/creator.h | `include/creator.h` | 1 files / 12 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/cwc.h | `include/cwc.h` | 1 files / 101 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/data.h | `include/data.h` | 1 files / 30 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/dates.h | `include/dates.h` | 1 files / 34 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/db.h | `include/db.h` | 1 files / 32 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/decay_handler.h | `include/decay_handler.h` | 1 files / 4 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/dirs.h | `include/dirs.h` | 1 files / 51 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/disease.h | `include/disease.h` | 1 files / 9 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/door.h | `include/door.h` | 1 files / 27 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/drinks.h | `include/drinks.h` | 1 files / 9 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/dst.h | `include/dst.h` | 1 files / 17 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/ed.h | `include/ed.h` | 1 files / 10 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/effect.h | `include/effect.h` | 1 files / 21 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/effects | `include/effects` | 1 files / 16 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/error_handler.h | `include/error_handler.h` | 1 files / 193 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/esc.h | `include/esc.h` | 1 files / 7 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/expressions.h | `include/expressions.h` | 1 files / 67 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/fighter.h | `include/fighter.h` | 1 files / 8 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/finger.h | `include/finger.h` | 1 files / 6 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/fixed_random.h | `include/fixed_random.h` | 1 files / 6 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/forms.h | `include/forms.h` | 1 files / 10 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/forn.h | `include/forn.h` | 1 files / 220 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/forn.old | `include/forn.old` | 1 files / 96 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/ftmoney.h | `include/ftmoney.h` | 1 files / 8 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/ftp.h | `include/ftp.h` | 1 files / 214 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/fuel_handler.h | `include/fuel_handler.h` | 1 files / 2 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/function.h | `include/function.h` | 1 files / 18 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/gag.h | `include/gag.h` | 1 files / 1 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/goal.h | `include/goal.h` | 1 files / 11 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/good_fighter.h | `include/good_fighter.h` | 1 files / 14 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/gossip.h | `include/gossip.h` | 1 files / 28 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/group_handler.h | `include/group_handler.h` | 1 files / 147 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/guide_places.h | `include/guide_places.h` | 1 files / 82 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/guilds.h | `include/guilds.h` | 1 files / 14 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/hospital.h | `include/hospital.h` | 1 files / 159 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/housing.h | `include/housing.h` | 1 files / 38 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/http.h | `include/http.h` | 1 files / 270 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/image.h | `include/image.h` | 1 files / 13 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/imap4.h | `include/imap4.h` | 1 files / 50 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/inet.h | `include/inet.h` | 1 files / 10 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/inhume.h | `include/inhume.h` | 1 files / 117 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/language.h | `include/language.h` | 1 files / 123 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/learning.h | `include/learning.h` | 1 files / 28 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/liaison.h | `include/liaison.h` | 1 files / 58 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/library.h | `include/library.h` | 1 files / 6 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/living.h | `include/living.h` | 1 files / 31 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/localtime.h | `include/localtime.h` | 1 files / 14 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/log.h | `include/log.h` | 1 files / 49 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/login.h | `include/login.h` | 1 files / 12 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/login_handler.h | `include/login_handler.h` | 1 files / 47 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/ls.h | `include/ls.h` | 1 files / 14 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/mail.h | `include/mail.h` | 1 files / 99 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/mail_track.h | `include/mail_track.h` | 1 files / 12 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/map.h | `include/map.h` | 1 files / 2 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/map_handler.h | `include/map_handler.h` | 1 files / 32 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/merchant.h | `include/merchant.h` | 1 files / 11 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/mime.h | `include/mime.h` | 1 files / 58 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/mineral.h | `include/mineral.h` | 1 files / 9 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/mission.h | `include/mission.h` | 1 files / 10 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/money.h | `include/money.h` | 1 files / 95 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/monster.h | `include/monster.h` | 1 files / 7 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/move_failures.h | `include/move_failures.h` | 1 files / 42 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/mudwho.h | `include/mudwho.h` | 1 files / 6 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/nameserver.h | `include/nameserver.h` | 1 files / 7 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/network.h | `include/network.h` | 1 files / 105 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/newbiehelpers.h | `include/newbiehelpers.h` | 1 files / 15 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/newudp.h | `include/newudp.h` | 1 files / 82 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/nomic_system.h | `include/nomic_system.h` | 1 files / 274 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/npc | `include/npc` | 5 files / 271 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/nroff.h | `include/nroff.h` | 1 files / 19 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/obj_parser.h | `include/obj_parser.h` | 1 files / 150 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/origin.h | `include/origin.h` | 1 files / 13 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/panic.h | `include/panic.h` | 1 files / 41 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/parse_command.h | `include/parse_command.h` | 1 files / 11 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/parser.h | `include/parser.h` | 1 files / 9 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/parser_error.h | `include/parser_error.h` | 1 files / 13 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/peopler.h | `include/peopler.h` | 1 files / 170 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/permissions.h | `include/permissions.h` | 1 files / 10 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/philosophies.h | `include/philosophies.h` | 1 files / 14 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/player.h | `include/player.h` | 1 files / 211 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/player_handler.h | `include/player_handler.h` | 1 files / 39 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/player_shop.h | `include/player_shop.h` | 1 files / 718 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/playerinfo.h | `include/playerinfo.h` | 1 files / 50 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/playerinfo2.c | `include/playerinfo2.c` | 1 files / 48 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/playtesters.h | `include/playtesters.h` | 1 files / 47 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/pop3.h | `include/pop3.h` | 1 files / 50 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/position.h | `include/position.h` | 1 files / 80 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/potion_attrs.h | `include/potion_attrs.h` | 1 files / 31 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/priest.h | `include/priest.h` | 1 files / 22 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/priests_dev.h | `include/priests_dev.h` | 1 files / 11 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/project_management.h | `include/project_management.h` | 1 files / 120 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/pub.h | `include/pub.h` | 1 files / 18 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/quest_handler.h | `include/quest_handler.h` | 1 files / 6 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/race.h | `include/race.h` | 1 files / 7 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/random_names.h | `include/random_names.h` | 1 files / 8 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/ranged_response.h | `include/ranged_response.h` | 1 files / 3 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/reaction.h | `include/reaction.h` | 1 files / 85 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/refresh.h | `include/refresh.h` | 1 files / 32 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/report_handler.h | `include/report_handler.h` | 1 files / 14 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/reversi.h | `include/reversi.h` | 1 files / 35 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/ritual_system.h | `include/ritual_system.h` | 1 files / 119 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/room | `include/room` | 8 files / 487 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/room.h | `include/room.h` | 1 files / 114 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/route.h | `include/route.h` | 1 files / 9 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/runtime_config.h | `include/runtime_config.h` | 1 files / 94 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/security.h | `include/security.h` | 1 files / 7 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/server.h | `include/server.h` | 1 files / 39 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/shop.h | `include/shop.h` | 1 files / 17 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/shops | `include/shops` | 6 files / 474 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/situations.h | `include/situations.h` | 1 files / 36 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/skills.h | `include/skills.h` | 1 files / 352 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/snmp.h | `include/snmp.h` | 1 files / 28 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/socket.h | `include/socket.h` | 1 files / 13 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/socket_err.h | `include/socket_err.h` | 1 files / 46 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/socket_errors.h | `include/socket_errors.h` | 1 files / 46 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/soul.h | `include/soul.h` | 1 files / 36 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/spells.h | `include/spells.h` | 1 files / 11 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/state_change.h | `include/state_change.h` | 1 files / 19 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/sur.h | `include/sur.h` | 1 files / 77 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/surface.h | `include/surface.h` | 1 files / 7 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/talker.h | `include/talker.h` | 1 files / 68 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/tasks.h | `include/tasks.h` | 1 files / 95 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/telnet.h | `include/telnet.h` | 1 files / 9 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/term.h | `include/term.h` | 1 files / 6 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/terrain.h | `include/terrain.h` | 1 files / 9 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/terrain_map.h | `include/terrain_map.h` | 1 files / 228 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/tokenise.h | `include/tokenise.h` | 1 files / 27 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/top_ten_tables.h | `include/top_ten_tables.h` | 1 files / 69 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/tune.h | `include/tune.h` | 1 files / 34 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/twilight.h | `include/twilight.h` | 1 files / 5 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/type.h | `include/type.h` | 1 files / 15 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/udp.h | `include/udp.h` | 1 files / 51 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/underworld.h | `include/underworld.h` | 1 files / 30 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/unseen.h | `include/unseen.h` | 1 files / 6 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/user_parser.h | `include/user_parser.h` | 1 files / 49 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/vault.h | `include/vault.h` | 1 files / 38 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/virtual.h | `include/virtual.h` | 1 files / 30 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/virtual_room.h | `include/virtual_room.h` | 1 files / 13 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/virtual_spell.h | `include/virtual_spell.h` | 1 files / 74 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/volumes.h | `include/volumes.h` | 1 files / 59 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/wander.h | `include/wander.h` | 1 files / 6 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/weapon.h | `include/weapon.h` | 1 files / 41 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/weapon_old.h | `include/weapon_old.h` | 1 files / 25 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/weather.h | `include/weather.h` | 1 files / 45 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| include/weezent.h | `include/weezent.h` | 1 files / 14 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| secure/bastards.c | `secure/bastards.c` | 1 files / 317 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| secure/bastards.o.bak.gz | `secure/bastards.o.bak.gz` | 1 files / 82 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| secure/bastards.o.gz | `secure/bastards.o.gz` | 1 files / 83 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| secure/bulk_delete.c | `secure/bulk_delete.c` | 1 files / 270 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| secure/bulk_delete.os | `secure/bulk_delete.os` | 1 files / 0 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| secure/cmds | `secure/cmds` | 43 files / 4575 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| secure/command.c | `secure/command.c` | 1 files / 344 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| secure/config | `secure/config` | 4 files / 204 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| secure/delete_clear.c | `secure/delete_clear.c` | 1 files / 78 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| secure/finger.c | `secure/finger.c` | 1 files / 900 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| secure/force.c | `secure/force.c` | 1 files / 130 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| secure/ftp_auth.c | `secure/ftp_auth.c` | 1 files / 216 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| secure/ftpd.c | `secure/ftpd.c` | 1 files / 1638 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| secure/items | `secure/items` | 2 files / 83 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| secure/loader.c | `secure/loader.c` | 1 files / 136 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| secure/login.c | `secure/login.c` | 1 files / 1733 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| secure/login.o | `secure/login.o` | 1 files / 2 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| secure/master | `secure/master` | 31 files / 2505 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| secure/master.c | `secure/master.c` | 1 files / 395 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| secure/master.o | `secure/master.o` | 1 files / 4 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| secure/player | `secure/player` | 1 files / 52 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| secure/rcs_handler.c | `secure/rcs_handler.c` | 1 files / 171 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| secure/rcs_handler.o.gz | `secure/rcs_handler.o.gz` | 1 files / 42 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| secure/related_files.c | `secure/related_files.c` | 1 files / 61 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| secure/security.c | `secure/security.c` | 1 files / 19 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| secure/simul_efun | `secure/simul_efun` | 41 files / 5243 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
| secure/simul_efun.c | `secure/simul_efun.c` | 1 files / 67 lines | **UNDOCUMENTED** remainder; selected seams in ASPECTS |
