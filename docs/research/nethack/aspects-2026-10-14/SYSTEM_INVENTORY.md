# NetHack: system inventory, 2026-10-14

This is a static published-source inventory, not an installed-build manifest. Optional content, ports and platform files may not enter one build. Counts are tracked-path matches and byte counts, not guessed class/record counts or proof of semantic reading. Prior coverage means only the supplied dossier; unknown coverage by other lanes is not treated as absent. UNREAD means not semantically reviewed here. The module census below exposes the remaining source units rather than hiding them inside a few large groups.

## NetHack: subsystem map

| System | Source families | Size signal | Dossier / this pass |
|---|---|---:|---|
| Quest conversations | `src/quest.c src/questpgr.c dat/quest.lua` | 3 paths, 168,286 bytes | new A01; D1 |
| Save compatibility and recovery | `src/save.c src/restore.c src/version.c include/save* include/nh*` | 7 paths, 154,217 bytes | new A04; D2 |
| Timer identity and level scope | `src/timeout.c` | 1 paths, 94,353 bytes | new A09; D3 |
| Command dispatch and turn loop | `src/allmain.c src/cmd.c` | 2 paths, 226,786 bytes | new A03, command catalogue unread |
| Monster movement and item AI | `src/monmove.c src/muse.c` | 2 paths, 208,495 bytes | partial A05 |
| Pets and food suitability | `src/dog.c src/dogmove.c` | 2 paths, 107,586 bytes | prior REPORT; not fully reread |
| Items and contextual use | `src/apply.c src/potion.c src/zap.c` | 3 paths, 488,715 bytes | prior REPORT; catalogue unread |
| Knowledge and object naming | `src/o_init.c src/objnam.c` | 2 paths, 258,416 bytes | prior REPORT and new A10 |
| Conducts and scores | `src/topten.c src/end.c` | 2 paths, 116,523 bytes | prior REPORT; selected conduct reread |
| Equipment, wear and wield | `src/do_wear.c src/wield.c src/weapon.c` | 3 paths, 216,508 bytes | UNREAD in this pass |
| Spell learning and effects | `src/spell.c src/read.c` | 2 paths, 205,612 bytes | prior selected report; broader catalogue unread |
| Hunger and eating | `src/eat.c` | 1 paths, 141,227 bytes | prior report; not a YAIR starvation proposal |
| Shops and billing | `src/shk.c src/shknam.c` | 2 paths, 238,953 bytes | UNREAD beyond chat price entry |
| Religion, sacrifice and alignment | `src/pray.c src/priest.c src/minion.c` | 3 paths, 145,170 bytes | UNREAD |
| Dungeon topology and special levels | `dat/*.lua src/dungeon.c src/sp_lev.c` | 133 paths, 951,333 bytes | partial A07 |
| Randomness and luck | `src/rnd.c src/isaac64.c` | 2 paths, 11,351 bytes | new partial A08 |
| Sound, chat and sensory messages | `src/sounds.c` | 1 paths, 72,966 bytes | new selected A01/A11 |
| Rumors, consultation and encyclopedia | `src/rumors.c dat/rumors.* dat/data.base` | 4 paths, 372,280 bytes | located; payment/lore catalogue UNREAD |
| Polymorph and body rules | `src/polyself.c src/mondata.c` | 2 paths, 141,879 bytes | UNREAD |
| Bones and cross-run remnants | `src/bones.c` | 1 paths, 30,862 bytes | UNREAD |
| Map visibility and pathfinding | `src/vision.c src/detect.c src/track.c` | 3 paths, 163,171 bytes | UNREAD |
| Traps, digging and environment | `src/trap.c src/dig.c src/region.c` | 3 paths, 381,151 bytes | prior environment overview; detailed rules UNREAD |
| Window ports and UI settings | `win/*/* src/windows.c src/options.c dat/help dat/opthelp` | 198 paths, 4,146,969 bytes | reference-only A06; port rendering UNREAD |
| Objects and creature definitions | `src/objects.c src/monst.c include/obj*.h include/mon*.h` | 10 paths, 367,881 bytes | catalogue UNREAD |
| Platform, build, tools and tests | `sys/*/* util/* test/*` | 392 paths, 4,630,378 bytes | UNREAD; not executed |

### NetHack: complete immediate gameplay-module census

This mechanically lists every immediate C/C++ source/header stem in the game source root, including helpers. A stem is a discovery unit, not a claim of a separate engine. Nested directories remain visible in the directory census. Status is selected semantic reading when cited, otherwise UNREAD/inventory-only.

| Module | Files | Source lines | This pass |
|---|---:|---:|---|
| `allmain` | 1 | 1,046 | selected spans only |
| `alloc` | 1 | 285 | UNREAD / inventory only |
| `apply` | 1 | 4,559 | UNREAD / inventory only |
| `artifact` | 1 | 2,843 | UNREAD / inventory only |
| `attrib` | 1 | 1,364 | UNREAD / inventory only |
| `ball` | 1 | 1,109 | UNREAD / inventory only |
| `bones` | 1 | 844 | UNREAD / inventory only |
| `botl` | 1 | 4,586 | UNREAD / inventory only |
| `calendar` | 1 | 229 | UNREAD / inventory only |
| `cfgfiles` | 1 | 2,248 | UNREAD / inventory only |
| `cmd` | 1 | 5,739 | UNREAD / inventory only |
| `coloratt` | 1 | 1,169 | UNREAD / inventory only |
| `date` | 1 | 178 | UNREAD / inventory only |
| `dbridge` | 1 | 1,021 | UNREAD / inventory only |
| `decl` | 1 | 1,229 | UNREAD / inventory only |
| `detect` | 1 | 2,418 | UNREAD / inventory only |
| `dig` | 1 | 2,329 | UNREAD / inventory only |
| `display` | 1 | 3,863 | UNREAD / inventory only |
| `dlb` | 1 | 550 | UNREAD / inventory only |
| `do` | 1 | 2,496 | UNREAD / inventory only |
| `do_name` | 1 | 1,681 | UNREAD / inventory only |
| `do_wear` | 1 | 3,504 | UNREAD / inventory only |
| `dog` | 1 | 1,399 | UNREAD / inventory only |
| `dogmove` | 1 | 1,549 | UNREAD / inventory only |
| `dokick` | 1 | 1,973 | UNREAD / inventory only |
| `dothrow` | 1 | 2,793 | UNREAD / inventory only |
| `drawing` | 1 | 144 | UNREAD / inventory only |
| `dungeon` | 1 | 3,745 | UNREAD / inventory only |
| `earlyarg` | 1 | 948 | UNREAD / inventory only |
| `eat` | 1 | 3,975 | UNREAD / inventory only |
| `end` | 1 | 1,948 | UNREAD / inventory only |
| `engrave` | 1 | 1,792 | UNREAD / inventory only |
| `exper` | 1 | 402 | UNREAD / inventory only |
| `explode` | 1 | 1,073 | UNREAD / inventory only |
| `extralev` | 1 | 355 | UNREAD / inventory only |
| `files` | 1 | 3,727 | UNREAD / inventory only |
| `fountain` | 1 | 828 | UNREAD / inventory only |
| `getpos` | 1 | 1,169 | UNREAD / inventory only |
| `glyphs` | 1 | 1,275 | UNREAD / inventory only |
| `hack` | 1 | 4,575 | UNREAD / inventory only |
| `hacklib` | 1 | 1,015 | UNREAD / inventory only |
| `iactions` | 1 | 724 | UNREAD / inventory only |
| `insight` | 1 | 3,506 | UNREAD / inventory only |
| `invent` | 1 | 5,731 | UNREAD / inventory only |
| `isaac64` | 1 | 180 | UNREAD / inventory only |
| `light` | 1 | 985 | UNREAD / inventory only |
| `lock` | 1 | 1,320 | UNREAD / inventory only |
| `mail` | 1 | 803 | UNREAD / inventory only |
| `makemon` | 1 | 2,614 | UNREAD / inventory only |
| `mcastu` | 1 | 1,014 | UNREAD / inventory only |
| `mdlib` | 1 | 884 | UNREAD / inventory only |
| `mhitm` | 1 | 1,514 | UNREAD / inventory only |
| `mhitu` | 1 | 2,642 | UNREAD / inventory only |
| `minion` | 1 | 566 | UNREAD / inventory only |
| `mklev` | 1 | 2,665 | UNREAD / inventory only |
| `mkmap` | 1 | 488 | UNREAD / inventory only |
| `mkmaze` | 1 | 2,110 | UNREAD / inventory only |
| `mkobj` | 1 | 3,866 | UNREAD / inventory only |
| `mkroom` | 1 | 1,109 | UNREAD / inventory only |
| `mon` | 1 | 6,162 | UNREAD / inventory only |
| `mondata` | 1 | 1,671 | UNREAD / inventory only |
| `monmove` | 1 | 2,398 | selected spans only |
| `monst` | 1 | 89 | UNREAD / inventory only |
| `mplayer` | 1 | 379 | UNREAD / inventory only |
| `mthrowu` | 1 | 1,561 | UNREAD / inventory only |
| `muse` | 1 | 3,309 | UNREAD / inventory only |
| `music` | 1 | 945 | UNREAD / inventory only |
| `nhlobj` | 1 | 685 | UNREAD / inventory only |
| `nhlsel` | 1 | 1,051 | UNREAD / inventory only |
| `nhlua` | 1 | 3,094 | UNREAD / inventory only |
| `nhmd4` | 1 | 298 | UNREAD / inventory only |
| `o_init` | 1 | 1,221 | selected spans only |
| `objects` | 1 | 38 | UNREAD / inventory only |
| `objnam` | 1 | 5,735 | UNREAD / inventory only |
| `options` | 1 | 10,270 | UNREAD / inventory only |
| `pager` | 1 | 2,967 | UNREAD / inventory only |
| `pickup` | 1 | 4,116 | UNREAD / inventory only |
| `pline` | 1 | 719 | UNREAD / inventory only |
| `polyself` | 1 | 2,286 | UNREAD / inventory only |
| `potion` | 1 | 2,930 | UNREAD / inventory only |
| `pray` | 1 | 2,721 | UNREAD / inventory only |
| `priest` | 1 | 944 | UNREAD / inventory only |
| `quest` | 1 | 523 | selected spans only |
| `questpgr` | 1 | 684 | selected spans only |
| `read` | 1 | 3,411 | UNREAD / inventory only |
| `rect` | 1 | 219 | UNREAD / inventory only |
| `region` | 1 | 1,408 | UNREAD / inventory only |
| `report` | 1 | 665 | UNREAD / inventory only |
| `restore` | 1 | 1,688 | selected spans only |
| `revision` | 1 | 89 | UNREAD / inventory only |
| `rip` | 1 | 167 | UNREAD / inventory only |
| `rnd` | 1 | 312 | selected spans only |
| `role` | 1 | 3,024 | UNREAD / inventory only |
| `rumors` | 1 | 957 | UNREAD / inventory only |
| `save` | 1 | 1,227 | selected spans only |
| `selvar` | 1 | 812 | UNREAD / inventory only |
| `sfbase` | 1 | 1,133 | UNREAD / inventory only |
| `sfstruct` | 1 | 646 | UNREAD / inventory only |
| `shk` | 1 | 6,147 | UNREAD / inventory only |
| `shknam` | 1 | 928 | UNREAD / inventory only |
| `sit` | 1 | 764 | UNREAD / inventory only |
| `sounds` | 1 | 2,231 | selected spans only |
| `sp_lev` | 1 | 6,514 | UNREAD / inventory only |
| `spell` | 1 | 2,427 | UNREAD / inventory only |
| `stairs` | 1 | 237 | UNREAD / inventory only |
| `steal` | 1 | 900 | UNREAD / inventory only |
| `steed` | 1 | 945 | UNREAD / inventory only |
| `strutil` | 1 | 158 | UNREAD / inventory only |
| `symbols` | 1 | 1,181 | UNREAD / inventory only |
| `sys` | 1 | 186 | UNREAD / inventory only |
| `teleport` | 1 | 2,294 | UNREAD / inventory only |
| `timeout` | 1 | 2,777 | selected spans only |
| `topten` | 1 | 1,487 | selected spans only |
| `track` | 1 | 107 | UNREAD / inventory only |
| `trap` | 1 | 7,214 | UNREAD / inventory only |
| `u_init` | 1 | 1,420 | UNREAD / inventory only |
| `uhitm` | 1 | 6,447 | UNREAD / inventory only |
| `utf8map` | 1 | 222 | UNREAD / inventory only |
| `vault` | 1 | 1,292 | UNREAD / inventory only |
| `version` | 1 | 874 | selected spans only |
| `vision` | 1 | 2,188 | UNREAD / inventory only |
| `weapon` | 1 | 1,845 | UNREAD / inventory only |
| `were` | 1 | 239 | UNREAD / inventory only |
| `wield` | 1 | 1,091 | UNREAD / inventory only |
| `windows` | 1 | 1,904 | UNREAD / inventory only |
| `wizard` | 1 | 885 | UNREAD / inventory only |
| `wizcmds` | 1 | 2,042 | UNREAD / inventory only |
| `worm` | 1 | 1,001 | UNREAD / inventory only |
| `worn` | 1 | 1,421 | UNREAD / inventory only |
| `write` | 1 | 420 | UNREAD / inventory only |
| `zap` | 1 | 6,461 | UNREAD / inventory only |

### Source and content directory census

Every tracked file is counted once by its containing directory. Presence is verified; unlisted semantics remain unread. Full path/blob manifests remain privately in `extract/nethack-git-tree.txt`.

| Directory | Tracked files |
|---|---:|
| `.` | 10 |
| `DEVEL` | 8 |
| `DEVEL/DOTGIT` | 1 |
| `DEVEL/hooksdir` | 20 |
| `dat` | 154 |
| `doc` | 66 |
| `include` | 97 |
| `nhlua` | 3 |
| `nhlua/lua` | 2 |
| `nhlua/lua/doc` | 10 |
| `nhlua/lua/src` | 64 |
| `outdated` | 1 |
| `outdated/dat` | 1 |
| `outdated/include` | 12 |
| `outdated/sys/atari` | 1 |
| `outdated/sys/be` | 3 |
| `outdated/sys/msdos` | 9 |
| `outdated/sys/os2` | 5 |
| `outdated/sys/unix` | 2 |
| `outdated/sys/unix/hints` | 16 |
| `outdated/sys/unix/hints/include` | 2 |
| `outdated/sys/vms` | 1 |
| `outdated/sys/wince` | 47 |
| `outdated/sys/wince/ceinc` | 4 |
| `outdated/sys/wince/ceinc/sys` | 2 |
| `outdated/win/Qt3` | 17 |
| `outdated/win/gnome` | 33 |
| `sound/fmod` | 1 |
| `sound/mac68ksound` | 1 |
| `sound/macsound` | 1 |
| `sound/qtsound` | 1 |
| `sound/wav` | 66 |
| `sound/windsound` | 1 |
| `src` | 133 |
| `submodules` | 2 |
| `sys/amiga` | 32 |
| `sys/atari` | 16 |
| `sys/libnh` | 3 |
| `sys/libnh/test` | 3 |
| `sys/mac68k` | 43 |
| `sys/mac68k/tools` | 9 |
| `sys/msdos` | 25 |
| `sys/msdos/fonts` | 11 |
| `sys/share` | 17 |
| `sys/unix` | 23 |
| `sys/unix/NetHack.xcodeproj` | 3 |
| `sys/unix/NetHack.xcodeproj/project.xcworkspace` | 2 |
| `sys/unix/NetHack.xcodeproj/project.xcworkspace/xcshareddata` | 2 |
| `sys/unix/NetHack.xcodeproj/xcshareddata/xcschemes` | 3 |
| `sys/unix/hints` | 6 |
| `sys/unix/hints/include` | 16 |
| `sys/vms` | 26 |
| `sys/windows` | 26 |
| `sys/windows/vs` | 20 |
| `sys/windows/vs/FetchPrereq` | 2 |
| `sys/windows/vs/Images` | 52 |
| `sys/windows/vs/NetHack` | 2 |
| `sys/windows/vs/NetHackW` | 1 |
| `sys/windows/vs/PDCurses` | 1 |
| `sys/windows/vs/PDCursesGui` | 1 |
| `sys/windows/vs/dlb` | 2 |
| `sys/windows/vs/fetchctags` | 2 |
| `sys/windows/vs/hacklib` | 1 |
| `sys/windows/vs/lualib` | 1 |
| `sys/windows/vs/makedefs` | 2 |
| `sys/windows/vs/package` | 2 |
| `sys/windows/vs/recover` | 2 |
| `sys/windows/vs/sfctool` | 1 |
| `sys/windows/vs/sftags` | 2 |
| `sys/windows/vs/tile2bmp` | 2 |
| `sys/windows/vs/tilemap` | 2 |
| `sys/windows/vs/tiles` | 1 |
| `sys/windows/vs/uudecode` | 2 |
| `test` | 11 |
| `util` | 14 |
| `win/Qt` | 53 |
| `win/X11` | 26 |
| `win/chain` | 4 |
| `win/curses` | 18 |
| `win/gem` | 15 |
| `win/macosx` | 5 |
| `win/share` | 22 |
| `win/shim` | 1 |
| `win/tty` | 5 |
| `win/win32` | 45 |
