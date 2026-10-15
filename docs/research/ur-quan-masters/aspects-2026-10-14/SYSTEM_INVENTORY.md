# UQM system inventory

Official source revision is pinned in [SOURCES](../SOURCES.md). This is a source-tree inventory, not a statement that this particular library build links every optional backend. Counts are table records, C units or lines. No other lane's internal documentation was assumed. **D** means documented by this lane's selected trace; **U** means undocumented in depth and retained for a later read. A family can have selected D members and unread remainder.

## Functional subsystems

| System | Location / size signal | Documentation |
|---|---|---|
| Conversation dispatcher and presentation | comm.c, commglue.*, commanim.*; 27 species/context C modules | D: A01, DIALOGUE_SYSTEMS; animation runtime only partial |
| Dialogue corpus | content/base/comm, 27 text tables, 3,451 phrase records | D: census and selected voices; remainder not semantically read |
| World/flag namespace | globdata.*, 1 global campaign owner | D: selected knowledge/manner/visit/device fields; full field map U |
| Calendar and events | clock.*, gameev.*, 18 selectors before NUM_EVENTS | D: A09, DEEPER_SYSTEMS D3 |
| HyperSpace/QuasiSpace travel | hyper.*, 1 route-layer state family | D: displacement fuel and exits |
| Starmap and knowledge projection | planets/pstarmap.c plus starmap.* | D: fuel estimates and known influence; search/render detail U |
| Default and special system generation | planets/generate, callback tables | D: gendefault/genspa selected; other overrides U |
| Planet analysis/resources | planets, minerals/life/scans and lander | D: scan/cargo/hazard/retrieval; full ecological balance U |
| Planet mutable state | state.*, SaveStarInfo | D: scan retrieval masks |
| Device acquisition/use | planets/devices.c | D: portal device only; remaining devices U |
| Starbase economy and news | starbase.*, comm/starbas, outfit.c, shipyard.c | D: mineral sale/news/refit/access selected |
| Merchant knowledge/technology economy | comm/melnorm | D: purchase, knowledge, fuel, rescue and trade paths |
| Fleet politics and encounters | gameev.c, build.c, grpinfo.c, encount.c | D: selected scheduled changes and alliance access; full group lifecycle U |
| Battle engine and weapons | battle.*, weapon.*, collide.*, gravity.*, ship.* | U core; selected species hooks D |
| Species ship behavior | ships/*, per-species C unit | D Arilou/Spathi selected; rest U |
| Generic computer control | cyborg.c | U; two override callers D |
| Campaign save/load | save.*, load.c, load_legacy.c | D current tagged format; legacy and corruption paths U |
| Main activity loop/input | starcon.c, gameinp.c, process.c | D dispatch/tick selected; full loop U |
| Setup/options/controller bindings | setup.*, settings.*, gameopt.*, menu.*, controls.* | U; no native display or device test |
| Intro/end/credits/video | intro.c, credits.c, fmv.*, restart.c | U, no post-ending continuing-life claim |
| Super Melee/netplay | supermelee/* | U, separate game mode |
| Shared platform/graphics/sound/files/resources | src/libs/* | U; not a measured performance claim |
| Build, platform and content tools | sc2/build*, tools/* | U; no downloaded code executed |

## Every conversation table

The table-name count is not a species count. D marks selected semantic reading; all rows have retained full text and IDs. Speech callbacks can split speakers inside one table.

| Table | Phrase records | Semantic disposition |
|---|---:|---|
| `arilou` | 97 | D selected, remainder U |
| `chmmr` | 78 | U, census only |
| `commander` | 99 | U, census only |
| `druuge` | 105 | U, census only |
| `ilwrath` | 108 | U, census only |
| `kohrah` | 76 | U, census only |
| `melnorme` | 282 | D selected, remainder U |
| `mycon` | 109 | U, census only |
| `orz` | 116 | D selected, remainder U |
| `pkunk` | 182 | U, census only |
| `probe` | 86 | U, census only |
| `safeones` | 145 | D selected, remainder U |
| `shofixti` | 95 | U, census only |
| `slylandro` | 116 | D selected, remainder U |
| `spathi` | 134 | D selected, remainder U |
| `starbase` | 300 | D selected, remainder U |
| `supox` | 97 | U, census only |
| `syreen` | 131 | D selected, remainder U |
| `talkingpet` | 113 | U, census only |
| `thraddash` | 154 | U, census only |
| `umgah` | 87 | U, census only |
| `urquan` | 76 | U, census only |
| `utwig` | 117 | U, census only |
| `vux` | 102 | U, census only |
| `yehat` | 75 | U, census only |
| `yehatrebels` | 34 | U, census only |
| `zoqfotpik` | 337 | D selected, remainder U |

## Translation-unit inventory

Every root game C file and every nested source directory is listed. These finer entries qualify the functional inventory above, not new claims of inspection.

| Path / family | C units | Lines | Status |
|---|---:|---:|---|
| `sc2/src/uqm/battle.c` | 1 | 512 | U |
| `sc2/src/uqm/battlecontrols.c` | 1 | 100 | U |
| `sc2/src/uqm/border.c` | 1 | 200 | U |
| `sc2/src/uqm/build.c` | 1 | 547 | U |
| `sc2/src/uqm/cleanup.c` | 1 | 99 | U |
| `sc2/src/uqm/clock.c` | 1 | 314 | D selected |
| `sc2/src/uqm/cnctdlg.c` | 1 | 630 | U |
| `sc2/src/uqm/collide.c` | 1 | 183 | U |
| `sc2/src/uqm/comm.c` | 1 | 1649 | D selected |
| `sc2/src/uqm/commanim.c` | 1 | 623 | U |
| `sc2/src/uqm/commglue.c` | 1 | 421 | D selected |
| `sc2/src/uqm/confirm.c` | 1 | 250 | U |
| `sc2/src/uqm/cons_res.c` | 1 | 112 | U |
| `sc2/src/uqm/credits.c` | 1 | 839 | U |
| `sc2/src/uqm/cyborg.c` | 1 | 1339 | U |
| `sc2/src/uqm/demo.c` | 1 | 141 | U |
| `sc2/src/uqm/displist.c` | 1 | 274 | U |
| `sc2/src/uqm/dummy.c` | 1 | 207 | U |
| `sc2/src/uqm/encount.c` | 1 | 844 | U |
| `sc2/src/uqm/flash.c` | 1 | 805 | U |
| `sc2/src/uqm/fmv.c` | 1 | 134 | U |
| `sc2/src/uqm/galaxy.c` | 1 | 464 | U |
| `sc2/src/uqm/gameev.c` | 1 | 729 | D selected |
| `sc2/src/uqm/gameinp.c` | 1 | 496 | U |
| `sc2/src/uqm/gameopt.c` | 1 | 1347 | U |
| `sc2/src/uqm/gendef.c` | 1 | 137 | U |
| `sc2/src/uqm/getchar.c` | 1 | 442 | U |
| `sc2/src/uqm/globdata.c` | 1 | 511 | U |
| `sc2/src/uqm/gravity.c` | 1 | 200 | U |
| `sc2/src/uqm/grpinfo.c` | 1 | 865 | U |
| `sc2/src/uqm/hyper.c` | 1 | 1747 | D selected |
| `sc2/src/uqm/init.c` | 1 | 351 | U |
| `sc2/src/uqm/intel.c` | 1 | 76 | U |
| `sc2/src/uqm/intro.c` | 1 | 875 | U |
| `sc2/src/uqm/ipdisp.c` | 1 | 777 | U |
| `sc2/src/uqm/load.c` | 1 | 774 | D selected |
| `sc2/src/uqm/load_legacy.c` | 1 | 821 | U |
| `sc2/src/uqm/loadship.c` | 1 | 200 | U |
| `sc2/src/uqm/master.c` | 1 | 217 | U |
| `sc2/src/uqm/menu.c` | 1 | 603 | U |
| `sc2/src/uqm/misc.c` | 1 | 407 | U |
| `sc2/src/uqm/oscill.c` | 1 | 191 | U |
| `sc2/src/uqm/outfit.c` | 1 | 795 | D selected |
| `sc2/src/uqm/pickship.c` | 1 | 501 | U |
| `sc2/src/uqm/plandata.c` | 1 | 1850 | U |
| `sc2/src/uqm/process.c` | 1 | 1108 | U |
| `sc2/src/uqm/restart.c` | 1 | 413 | U |
| `sc2/src/uqm/save.c` | 1 | 813 | D selected |
| `sc2/src/uqm/settings.c` | 1 | 97 | U |
| `sc2/src/uqm/setup.c` | 1 | 332 | U |
| `sc2/src/uqm/setupmenu.c` | 1 | 1613 | U |
| `sc2/src/uqm/ship.c` | 1 | 574 | U |
| `sc2/src/uqm/shipstat.c` | 1 | 437 | U |
| `sc2/src/uqm/shipyard.c` | 1 | 1495 | D selected |
| `sc2/src/uqm/sis.c` | 1 | 1741 | U |
| `sc2/src/uqm/sounds.c` | 1 | 199 | U |
| `sc2/src/uqm/starbase.c` | 1 | 602 | U |
| `sc2/src/uqm/starcon.c` | 1 | 323 | D selected |
| `sc2/src/uqm/starmap.c` | 1 | 125 | U |
| `sc2/src/uqm/state.c` | 1 | 354 | D selected |
| `sc2/src/uqm/status.c` | 1 | 582 | U |
| `sc2/src/uqm/tactrans.c` | 1 | 1032 | U |
| `sc2/src/uqm/trans.c` | 1 | 154 | U |
| `sc2/src/uqm/uqmdebug.c` | 1 | 1926 | U |
| `sc2/src/uqm/util.c` | 1 | 312 | U |
| `sc2/src/uqm/velocity.c` | 1 | 153 | U |
| `sc2/src/uqm/weapon.c` | 1 | 414 | U |
| `sc2/src/uqm/comm/arilou/` | 1 | 855 | D selected, remainder U |
| `sc2/src/uqm/comm/blackur/` | 1 | 567 | U, census only |
| `sc2/src/uqm/comm/chmmr/` | 1 | 641 | U, census only |
| `sc2/src/uqm/comm/comandr/` | 1 | 694 | U, census only |
| `sc2/src/uqm/comm/druuge/` | 1 | 926 | U, census only |
| `sc2/src/uqm/comm/ilwrath/` | 1 | 649 | U, census only |
| `sc2/src/uqm/comm/melnorm/` | 1 | 1855 | D selected, remainder U |
| `sc2/src/uqm/comm/mycon/` | 1 | 643 | U, census only |
| `sc2/src/uqm/comm/orz/` | 1 | 898 | D selected, remainder U |
| `sc2/src/uqm/comm/pkunk/` | 1 | 1148 | U, census only |
| `sc2/src/uqm/comm/rebel/` | 1 | 449 | U, census only |
| `sc2/src/uqm/comm/shofixt/` | 1 | 652 | U, census only |
| `sc2/src/uqm/comm/slyhome/` | 1 | 921 | D selected, remainder U |
| `sc2/src/uqm/comm/slyland/` | 1 | 518 | U, census only |
| `sc2/src/uqm/comm/spahome/` | 1 | 1018 | D selected, remainder U |
| `sc2/src/uqm/comm/spathi/` | 1 | 834 | D selected, remainder U |
| `sc2/src/uqm/comm/starbas/` | 1 | 1961 | D selected, remainder U |
| `sc2/src/uqm/comm/supox/` | 1 | 708 | U, census only |
| `sc2/src/uqm/comm/syreen/` | 1 | 878 | D selected, remainder U |
| `sc2/src/uqm/comm/talkpet/` | 1 | 841 | U, census only |
| `sc2/src/uqm/comm/thradd/` | 1 | 954 | U, census only |
| `sc2/src/uqm/comm/umgah/` | 1 | 729 | U, census only |
| `sc2/src/uqm/comm/urquan/` | 1 | 555 | U, census only |
| `sc2/src/uqm/comm/utwig/` | 1 | 996 | U, census only |
| `sc2/src/uqm/comm/vux/` | 1 | 796 | U, census only |
| `sc2/src/uqm/comm/yehat/` | 1 | 685 | U, census only |
| `sc2/src/uqm/comm/zoqfot/` | 1 | 975 | D selected, remainder U |
| `sc2/src/uqm/planets/` | 16 | 13583 | D selected, remainder U |
| `sc2/src/uqm/planets/generate/` | 29 | 5797 | D selected, remainder U |
| `sc2/src/uqm/ships/androsyn/` | 1 | 528 | U |
| `sc2/src/uqm/ships/arilou/` | 1 | 303 | D selected, remainder U |
| `sc2/src/uqm/ships/blackurq/` | 1 | 567 | U |
| `sc2/src/uqm/ships/chenjesu/` | 1 | 588 | U |
| `sc2/src/uqm/ships/chmmr/` | 1 | 790 | U |
| `sc2/src/uqm/ships/druuge/` | 1 | 324 | U |
| `sc2/src/uqm/ships/human/` | 1 | 360 | U |
| `sc2/src/uqm/ships/ilwrath/` | 1 | 409 | U |
| `sc2/src/uqm/ships/lastbat/` | 1 | 926 | U |
| `sc2/src/uqm/ships/melnorme/` | 1 | 658 | U |
| `sc2/src/uqm/ships/mmrnmhrm/` | 1 | 527 | U |
| `sc2/src/uqm/ships/mycon/` | 1 | 376 | U |
| `sc2/src/uqm/ships/orz/` | 1 | 1083 | U |
| `sc2/src/uqm/ships/pkunk/` | 1 | 640 | U |
| `sc2/src/uqm/ships/probe/` | 1 | 118 | U |
| `sc2/src/uqm/ships/shofixti/` | 1 | 521 | U |
| `sc2/src/uqm/ships/sis_ship/` | 1 | 1002 | U |
| `sc2/src/uqm/ships/slylandr/` | 1 | 438 | U |
| `sc2/src/uqm/ships/spathi/` | 1 | 301 | D selected, remainder U |
| `sc2/src/uqm/ships/supox/` | 1 | 288 | U |
| `sc2/src/uqm/ships/syreen/` | 1 | 284 | U |
| `sc2/src/uqm/ships/thradd/` | 1 | 400 | U |
| `sc2/src/uqm/ships/umgah/` | 1 | 434 | U |
| `sc2/src/uqm/ships/urquan/` | 1 | 554 | U |
| `sc2/src/uqm/ships/utwig/` | 1 | 380 | U |
| `sc2/src/uqm/ships/vux/` | 1 | 398 | U |
| `sc2/src/uqm/ships/yehat/` | 1 | 369 | U |
| `sc2/src/uqm/ships/zoqfot/` | 1 | 377 | U |
| `sc2/src/uqm/supermelee/` | 5 | 5075 | U |
| `sc2/src/uqm/supermelee/netplay/` | 17 | 3895 | U |
| `sc2/src/uqm/supermelee/netplay/proto/` | 3 | 353 | U |

## Shared engine and platform families

These source-directory counts include optional backends and third-party support. No linking or performance inference.

| Family | C files recursively | Status |
|---|---:|---|
| `sc2/src/libs/callback/` | 3 | U |
| `sc2/src/libs/cdp/` | 3 | U |
| `sc2/src/libs/decomp/` | 3 | U |
| `sc2/src/libs/file/` | 3 | U |
| `sc2/src/libs/graphics/` | 41 | U |
| `sc2/src/libs/heap/` | 1 | U |
| `sc2/src/libs/input/` | 4 | U |
| `sc2/src/libs/list/` | 1 | U |
| `sc2/src/libs/log/` | 3 | U |
| `sc2/src/libs/math/` | 3 | U |
| `sc2/src/libs/md5/` | 1 | U |
| `sc2/src/libs/memory/` | 1 | U |
| `sc2/src/libs/mikmod/` | 23 | U |
| `sc2/src/libs/network/` | 13 | U |
| `sc2/src/libs/resource/` | 7 | U |
| `sc2/src/libs/sound/` | 18 | U |
| `sc2/src/libs/strings/` | 6 | U |
| `sc2/src/libs/task/` | 1 | U |
| `sc2/src/libs/threads/` | 3 | U |
| `sc2/src/libs/time/` | 2 | U |
| `sc2/src/libs/uio/` | 20 | U |
| `sc2/src/libs/video/` | 7 | U |
