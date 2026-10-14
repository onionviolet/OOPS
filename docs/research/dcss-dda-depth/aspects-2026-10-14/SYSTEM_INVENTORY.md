# Dungeon Crawl Stone Soup and Cataclysm: Dark Days Ahead: system inventory, 2026-10-14

This is a static published-source inventory, not an installed-build manifest. Optional content, ports and platform files may not enter one build. Counts are tracked-path matches and byte counts, not guessed class/record counts or proof of semantic reading. Prior coverage means only the supplied dossier; unknown coverage by other lanes is not treated as absent. UNREAD means not semantically reviewed here. The module census below exposes the remaining source units rather than hiding them inside a few large groups.

## Dungeon Crawl Stone Soup: subsystem map

| System | Source families | Size signal | Dossier / this pass |
|---|---|---:|---|
| Contextual monster speech | `crawl-ref/source/mon-speak.cc crawl-ref/source/dat/database/*speak* crawl-ref/source/dat/database/shout*` | 6 paths, 309,956 bytes | new A01; D1 |
| Save package and tagged compatibility | `crawl-ref/source/files.cc crawl-ref/source/tags.cc crawl-ref/source/tag-version.h crawl-ref/source/store*` | 5 paths, 502,116 bytes | new A04; D2 |
| Independent random streams | `crawl-ref/source/random.* crawl-ref/source/pcg.*` | 4 paths, 29,069 bytes | new A08; D3 |
| Notes and milestone record | `crawl-ref/source/notes.*` | 2 paths, 23,432 bytes | new A02 |
| Hints and tutorial | `crawl-ref/source/hints.* crawl-ref/source/tutorial.* crawl-ref/source/dat/dlua/tutorial.lua` | 5 paths, 76,354 bytes | new hints; full tutorial UNREAD |
| Main command and time loop | `crawl-ref/source/main.cc crawl-ref/source/timed-effects.*` | 3 paths, 135,978 bytes | new A03/A09 |
| Monster energy and tactical AI | `crawl-ref/source/mon-act.* crawl-ref/source/mon-behv.* crawl-ref/source/mon-cast.*` | 6 paths, 539,890 bytes | energy read; tactical catalogue UNREAD |
| Skill allocation and targets | `crawl-ref/source/skills.* crawl-ref/source/skills-menu.*` | 2 paths, 101,765 bytes | prior REPORT; targets reread |
| Runes, access and endings | `crawl-ref/source/stairs.cc crawl-ref/source/hiscores.cc crawl-ref/source/end.cc` | 3 paths, 155,271 bytes | prior REPORT; fresh full route UNREAD |
| Actor holds and attacks | `crawl-ref/source/actor.cc crawl-ref/source/attack.cc crawl-ref/source/melee-attack.cc` | 3 paths, 256,471 bytes | prior selected report; broader combat UNREAD |
| Spells and abilities | `crawl-ref/source/spl-*.cc crawl-ref/source/ability.cc` | 15 paths, 926,970 bytes | UNREAD beyond prior casting work |
| Religion and piety | `crawl-ref/source/god*.cc crawl-ref/source/religion.cc crawl-ref/source/prayer.cc` | 9 paths, 624,205 bytes | UNREAD |
| Mutations, species and forms | `crawl-ref/source/mutation* crawl-ref/source/species* crawl-ref/source/transform*` | 10 paths, 356,963 bytes | UNREAD |
| Items, artefacts, brands and shops | `crawl-ref/source/item*.cc crawl-ref/source/artefact*.cc crawl-ref/source/shopping.cc` | 6 paths, 661,463 bytes | prior brand route; most UNREAD |
| Exploration and travel stops | `crawl-ref/source/travel.*` | 2 paths, 187,483 bytes | selected stops A06 |
| Level generation and vaults | `crawl-ref/source/dungeon.cc crawl-ref/source/dat/des/*/* crawl-ref/source/dat/dlua/*` | 218 paths, 6,422,767 bytes | inventory only |
| Level branches and portals | `crawl-ref/source/branch* crawl-ref/source/abyss* crawl-ref/source/abyss*` | 8 paths, 108,539 bytes | inventory only |
| Ghosts and bones | `crawl-ref/source/ghost*` | 2 paths, 43,576 bytes | located in files.cc; lifecycle UNREAD |
| Descriptions and messages | `crawl-ref/source/describe* crawl-ref/source/message*` | 9 paths, 436,126 bytes | selected interface only |
| Tiles, web and terminal UI | `crawl-ref/source/tile*.cc crawl-ref/source/rltiles/*/* crawl-ref/source/menu.cc` | 8788 paths, 27,577,841 bytes | UNREAD runtime layout |
| Lua authoring and user scripts | `crawl-ref/source/*lua* crawl-ref/source/lua* crawl-ref/source/dat/clua/*` | 122 paths, 848,735 bytes | inventory/selected RNG seam |
| Sound, sight and environment | `crawl-ref/source/noise* crawl-ref/source/los* crawl-ref/source/cloud* crawl-ref/source/terrain*` | 16 paths, 219,873 bytes | UNREAD |
| Tests, platform and build tools | `crawl-ref/source/test/* crawl-ref/source/util/* crawl-ref/source/Makefile*` | 142 paths, 1,395,407 bytes | UNREAD; not executed |

### Dungeon Crawl Stone Soup: complete immediate gameplay-module census

This mechanically lists every immediate C/C++ source/header stem in the game source root, including helpers. A stem is a discovery unit, not a claim of a separate engine. Nested directories remain visible in the directory census. Status is selected semantic reading when cited, otherwise UNREAD/inventory-only.

| Module | Files | Source lines | This pass |
|---|---:|---:|---|
| `AppHdr` | 2 | 340 | UNREAD / inventory only |
| `KeymapContext` | 1 | 18 | UNREAD / inventory only |
| `SDLMain` | 1 | 11 | UNREAD / inventory only |
| `ability` | 2 | 5,012 | UNREAD / inventory only |
| `ability-type` | 1 | 379 | UNREAD / inventory only |
| `abyss` | 2 | 2,465 | UNREAD / inventory only |
| `ac-type` | 1 | 12 | UNREAD / inventory only |
| `acquire` | 2 | 2,072 | UNREAD / inventory only |
| `act-iter` | 2 | 319 | UNREAD / inventory only |
| `activity-interrupt-type` | 1 | 31 | UNREAD / inventory only |
| `actor` | 2 | 1,682 | UNREAD / inventory only |
| `actor-los` | 1 | 74 | UNREAD / inventory only |
| `adjust` | 2 | 363 | UNREAD / inventory only |
| `areas` | 2 | 781 | UNREAD / inventory only |
| `arena` | 2 | 1,594 | UNREAD / inventory only |
| `art-func` | 1 | 1,907 | UNREAD / inventory only |
| `artefact` | 2 | 2,667 | UNREAD / inventory only |
| `artefact-prop-type` | 1 | 97 | UNREAD / inventory only |
| `attack` | 2 | 1,912 | UNREAD / inventory only |
| `attitude-change` | 2 | 415 | UNREAD / inventory only |
| `attribute-type` | 1 | 117 | UNREAD / inventory only |
| `bane-data` | 1 | 116 | UNREAD / inventory only |
| `bane-type` | 1 | 34 | UNREAD / inventory only |
| `beam` | 2 | 8,789 | UNREAD / inventory only |
| `beam-type` | 1 | 127 | UNREAD / inventory only |
| `beh-type` | 1 | 30 | UNREAD / inventory only |
| `behold` | 1 | 224 | UNREAD / inventory only |
| `bitary` | 2 | 278 | UNREAD / inventory only |
| `bloodspatter` | 2 | 302 | UNREAD / inventory only |
| `book-data` | 1 | 604 | UNREAD / inventory only |
| `book-type` | 1 | 138 | UNREAD / inventory only |
| `branch` | 2 | 538 | UNREAD / inventory only |
| `branch-data` | 1 | 462 | UNREAD / inventory only |
| `branch-data-json` | 2 | 41 | UNREAD / inventory only |
| `branch-type` | 1 | 80 | UNREAD / inventory only |
| `caction-type` | 1 | 52 | UNREAD / inventory only |
| `canned-message-type` | 1 | 42 | UNREAD / inventory only |
| `caught-type` | 1 | 9 | UNREAD / inventory only |
| `char-set-type` | 1 | 8 | UNREAD / inventory only |
| `chardump` | 2 | 2,316 | UNREAD / inventory only |
| `cio` | 2 | 1,670 | UNREAD / inventory only |
| `cleansing-flame-source-type` | 1 | 10 | UNREAD / inventory only |
| `cloud` | 2 | 2,511 | UNREAD / inventory only |
| `cloud-type` | 1 | 61 | UNREAD / inventory only |
| `clua` | 2 | 1,747 | UNREAD / inventory only |
| `cluautil` | 2 | 383 | UNREAD / inventory only |
| `cmd-keys` | 1 | 464 | UNREAD / inventory only |
| `colour` | 2 | 998 | UNREAD / inventory only |
| `command` | 2 | 1,538 | UNREAD / inventory only |
| `command-type` | 1 | 374 | UNREAD / inventory only |
| `conduct-type` | 1 | 52 | UNREAD / inventory only |
| `confirm-prompt-type` | 1 | 8 | UNREAD / inventory only |
| `constrict-type` | 1 | 11 | UNREAD / inventory only |
| `coord` | 2 | 221 | UNREAD / inventory only |
| `coord-circle` | 2 | 186 | UNREAD / inventory only |
| `coord-def` | 1 | 219 | UNREAD / inventory only |
| `coordit` | 2 | 843 | UNREAD / inventory only |
| `corpse` | 2 | 109 | UNREAD / inventory only |
| `crash` | 2 | 482 | UNREAD / inventory only |
| `ctest` | 2 | 268 | UNREAD / inventory only |
| `curse-type` | 1 | 38 | UNREAD / inventory only |
| `cursor-type` | 1 | 9 | UNREAD / inventory only |
| `daction-type` | 1 | 61 | UNREAD / inventory only |
| `dactions` | 2 | 509 | UNREAD / inventory only |
| `database` | 2 | 1,001 | UNREAD / inventory only |
| `dbg-asrt` | 1 | 906 | UNREAD / inventory only |
| `dbg-maps` | 2 | 638 | UNREAD / inventory only |
| `dbg-objstat` | 2 | 1,472 | UNREAD / inventory only |
| `dbg-scan` | 2 | 713 | UNREAD / inventory only |
| `dbg-util` | 2 | 632 | UNREAD / inventory only |
| `death-curse` | 2 | 260 | UNREAD / inventory only |
| `debug` | 1 | 108 | UNREAD / inventory only |
| `debug-defines` | 1 | 57 | UNREAD / inventory only |
| `deck-type` | 1 | 14 | UNREAD / inventory only |
| `decks` | 2 | 1,892 | UNREAD / inventory only |
| `defines` | 1 | 419 | UNREAD / inventory only |
| `delay` | 2 | 1,923 | UNREAD / inventory only |
| `describe` | 2 | 8,362 | selected spans only |
| `describe-god` | 2 | 1,357 | UNREAD / inventory only |
| `describe-spells` | 2 | 898 | UNREAD / inventory only |
| `description-level-type` | 1 | 21 | UNREAD / inventory only |
| `dgl-message` | 2 | 172 | UNREAD / inventory only |
| `dgn-delve` | 2 | 324 | UNREAD / inventory only |
| `dgn-event` | 2 | 317 | UNREAD / inventory only |
| `dgn-height` | 2 | 285 | UNREAD / inventory only |
| `dgn-irregular-box` | 2 | 706 | UNREAD / inventory only |
| `dgn-layouts` | 2 | 1,217 | UNREAD / inventory only |
| `dgn-overview` | 2 | 1,363 | UNREAD / inventory only |
| `dgn-proclayouts` | 2 | 937 | UNREAD / inventory only |
| `dgn-shoals` | 2 | 1,259 | UNREAD / inventory only |
| `dgn-swamp` | 2 | 72 | UNREAD / inventory only |
| `directn` | 2 | 4,129 | UNREAD / inventory only |
| `disable-type` | 1 | 16 | UNREAD / inventory only |
| `dlua` | 2 | 410 | UNREAD / inventory only |
| `domino` | 2 | 818 | UNREAD / inventory only |
| `domino-data` | 1 | 112 | UNREAD / inventory only |
| `dungeon` | 2 | 8,221 | UNREAD / inventory only |
| `dungeon-char-type` | 1 | 93 | UNREAD / inventory only |
| `dungeon-feature-type` | 1 | 429 | UNREAD / inventory only |
| `duration-data` | 1 | 978 | UNREAD / inventory only |
| `duration-type` | 1 | 320 | UNREAD / inventory only |
| `easy-confirm-type` | 1 | 8 | UNREAD / inventory only |
| `enchant-type` | 1 | 265 | UNREAD / inventory only |
| `end` | 2 | 498 | UNREAD / inventory only |
| `endianness` | 1 | 53 | UNREAD / inventory only |
| `energy-use-type` | 1 | 13 | UNREAD / inventory only |
| `english` | 2 | 499 | UNREAD / inventory only |
| `enum` | 1 | 196 | UNREAD / inventory only |
| `env` | 1 | 172 | UNREAD / inventory only |
| `equipment-slot` | 1 | 60 | UNREAD / inventory only |
| `errors` | 2 | 103 | UNREAD / inventory only |
| `evoke` | 2 | 1,505 | UNREAD / inventory only |
| `exclude` | 2 | 832 | UNREAD / inventory only |
| `exercise` | 2 | 294 | UNREAD / inventory only |
| `explore-greedy-options` | 1 | 16 | UNREAD / inventory only |
| `explore-stop-options` | 1 | 52 | UNREAD / inventory only |
| `externs` | 1 | 376 | UNREAD / inventory only |
| `fake-main` | 1 | 49 | UNREAD / inventory only |
| `fearmonger` | 1 | 168 | UNREAD / inventory only |
| `feature` | 2 | 313 | UNREAD / inventory only |
| `feature-data` | 1 | 818 | UNREAD / inventory only |
| `fight` | 2 | 1,990 | UNREAD / inventory only |
| `files` | 2 | 4,278 | selected spans only |
| `filter-enum` | 1 | 18 | UNREAD / inventory only |
| `fineff` | 2 | 2,255 | UNREAD / inventory only |
| `fixedarray` | 1 | 158 | UNREAD / inventory only |
| `fixedp` | 1 | 782 | UNREAD / inventory only |
| `fixedvector` | 1 | 126 | UNREAD / inventory only |
| `flang-t` | 1 | 12 | UNREAD / inventory only |
| `flood-find` | 1 | 176 | UNREAD / inventory only |
| `flush-reason-type` | 1 | 16 | UNREAD / inventory only |
| `fontwrapper-ft` | 2 | 1,141 | UNREAD / inventory only |
| `forbidden-act-type` | 1 | 18 | UNREAD / inventory only |
| `format` | 2 | 776 | UNREAD / inventory only |
| `fprop` | 2 | 114 | UNREAD / inventory only |
| `game-chapter` | 1 | 16 | UNREAD / inventory only |
| `game-exit-type` | 1 | 17 | UNREAD / inventory only |
| `game-options` | 2 | 830 | UNREAD / inventory only |
| `game-type` | 1 | 19 | UNREAD / inventory only |
| `gender-type` | 1 | 11 | UNREAD / inventory only |
| `geom2d` | 2 | 251 | UNREAD / inventory only |
| `ghost` | 2 | 1,516 | UNREAD / inventory only |
| `glwrapper` | 2 | 301 | UNREAD / inventory only |
| `glwrapper-ogl` | 2 | 799 | UNREAD / inventory only |
| `god-abil` | 2 | 7,744 | UNREAD / inventory only |
| `god-companions` | 2 | 1,300 | UNREAD / inventory only |
| `god-conduct` | 2 | 1,353 | UNREAD / inventory only |
| `god-item` | 2 | 473 | UNREAD / inventory only |
| `god-menu` | 2 | 75 | UNREAD / inventory only |
| `god-passive` | 2 | 2,725 | UNREAD / inventory only |
| `god-prayer` | 2 | 318 | UNREAD / inventory only |
| `god-type` | 1 | 42 | UNREAD / inventory only |
| `god-wrath` | 2 | 1,959 | UNREAD / inventory only |
| `hash` | 2 | 124 | UNREAD / inventory only |
| `hints` | 2 | 2,617 | selected spans only |
| `hiscores` | 2 | 3,488 | UNREAD / inventory only |
| `holy-word-source-type` | 1 | 8 | UNREAD / inventory only |
| `initfile` | 2 | 6,501 | UNREAD / inventory only |
| `invent` | 2 | 2,270 | UNREAD / inventory only |
| `item-def` | 1 | 184 | UNREAD / inventory only |
| `item-name` | 2 | 3,958 | UNREAD / inventory only |
| `item-prop` | 2 | 4,209 | UNREAD / inventory only |
| `item-prop-enum` | 1 | 932 | UNREAD / inventory only |
| `item-status-flag-type` | 1 | 55 | UNREAD / inventory only |
| `item-type-id-state-type` | 1 | 15 | UNREAD / inventory only |
| `item-use` | 2 | 3,731 | UNREAD / inventory only |
| `items` | 2 | 5,351 | UNREAD / inventory only |
| `job-def` | 1 | 33 | UNREAD / inventory only |
| `jobs` | 2 | 235 | UNREAD / inventory only |
| `json` | 2 | 1,600 | UNREAD / inventory only |
| `json-wrapper` | 1 | 39 | UNREAD / inventory only |
| `kill-category` | 1 | 10 | UNREAD / inventory only |
| `kill-dump-options-type` | 1 | 8 | UNREAD / inventory only |
| `kill-method-type` | 1 | 63 | UNREAD / inventory only |
| `killer-type` | 1 | 33 | UNREAD / inventory only |
| `kills` | 2 | 1,170 | UNREAD / inventory only |
| `known-items` | 2 | 559 | UNREAD / inventory only |
| `l-autofight` | 1 | 214 | UNREAD / inventory only |
| `l-colour` | 1 | 104 | UNREAD / inventory only |
| `l-crawl` | 1 | 1,959 | UNREAD / inventory only |
| `l-debug` | 1 | 511 | UNREAD / inventory only |
| `l-defs` | 1 | 11 | UNREAD / inventory only |
| `l-dgn` | 1 | 1,987 | UNREAD / inventory only |
| `l-dgnbld` | 1 | 2,386 | UNREAD / inventory only |
| `l-dgnevt` | 1 | 155 | UNREAD / inventory only |
| `l-dgngrd` | 1 | 160 | UNREAD / inventory only |
| `l-dgnit` | 1 | 266 | UNREAD / inventory only |
| `l-dgnlvl` | 1 | 149 | UNREAD / inventory only |
| `l-dgnmon` | 1 | 251 | UNREAD / inventory only |
| `l-dgntil` | 1 | 180 | UNREAD / inventory only |
| `l-feat` | 1 | 79 | UNREAD / inventory only |
| `l-file` | 1 | 247 | UNREAD / inventory only |
| `l-global` | 1 | 74 | UNREAD / inventory only |
| `l-item` | 1 | 1,903 | UNREAD / inventory only |
| `l-libs` | 1 | 88 | UNREAD / inventory only |
| `l-los` | 1 | 117 | UNREAD / inventory only |
| `l-mapgrd` | 1 | 110 | UNREAD / inventory only |
| `l-mapmrk` | 1 | 51 | UNREAD / inventory only |
| `l-moninf` | 1 | 1,001 | UNREAD / inventory only |
| `l-mons` | 1 | 698 | UNREAD / inventory only |
| `l-option` | 1 | 158 | UNREAD / inventory only |
| `l-spells` | 1 | 390 | UNREAD / inventory only |
| `l-subvault` | 1 | 52 | UNREAD / inventory only |
| `l-travel` | 1 | 214 | UNREAD / inventory only |
| `l-view` | 1 | 430 | UNREAD / inventory only |
| `l-wiz` | 1 | 64 | UNREAD / inventory only |
| `l-you` | 1 | 2,033 | UNREAD / inventory only |
| `lang-fake` | 2 | 599 | UNREAD / inventory only |
| `lang-t` | 1 | 11 | UNREAD / inventory only |
| `lev-pand` | 2 | 105 | UNREAD / inventory only |
| `level-gen-type` | 1 | 10 | UNREAD / inventory only |
| `level-id` | 1 | 144 | UNREAD / inventory only |
| `level-state-type` | 1 | 19 | UNREAD / inventory only |
| `libconsole` | 1 | 75 | UNREAD / inventory only |
| `libgui` | 1 | 251 | UNREAD / inventory only |
| `libunix` | 2 | 1,912 | UNREAD / inventory only |
| `libutil` | 2 | 1,050 | UNREAD / inventory only |
| `libw32c` | 2 | 995 | UNREAD / inventory only |
| `loading-screen` | 2 | 121 | UNREAD / inventory only |
| `longwalk-range-mode` | 1 | 10 | UNREAD / inventory only |
| `lookup-help` | 2 | 1,778 | UNREAD / inventory only |
| `lookup-help-type` | 1 | 24 | UNREAD / inventory only |
| `los` | 2 | 927 | UNREAD / inventory only |
| `los-def` | 2 | 122 | UNREAD / inventory only |
| `los-type` | 1 | 18 | UNREAD / inventory only |
| `losglobal` | 2 | 139 | UNREAD / inventory only |
| `losparam` | 2 | 446 | UNREAD / inventory only |
| `luaterp` | 2 | 165 | UNREAD / inventory only |
| `macro` | 2 | 2,505 | UNREAD / inventory only |
| `macros` | 1 | 99 | UNREAD / inventory only |
| `main` | 1 | 3,131 | UNREAD / inventory only |
| `makeitem` | 2 | 2,524 | UNREAD / inventory only |
| `map-cell` | 1 | 402 | UNREAD / inventory only |
| `map-feature` | 1 | 35 | UNREAD / inventory only |
| `map-knowledge` | 2 | 990 | UNREAD / inventory only |
| `map-marker-type` | 1 | 28 | UNREAD / inventory only |
| `mapdef` | 2 | 7,759 | UNREAD / inventory only |
| `mapmark` | 2 | 1,911 | UNREAD / inventory only |
| `maps` | 2 | 1,798 | UNREAD / inventory only |
| `matrix` | 1 | 51 | UNREAD / inventory only |
| `maybe-bool` | 2 | 227 | UNREAD / inventory only |
| `melee-attack` | 2 | 5,709 | UNREAD / inventory only |
| `menu` | 2 | 4,282 | UNREAD / inventory only |
| `menu-type` | 1 | 13 | UNREAD / inventory only |
| `message` | 2 | 2,552 | UNREAD / inventory only |
| `message-stream` | 1 | 119 | UNREAD / inventory only |
| `mgen-data` | 1 | 285 | UNREAD / inventory only |
| `mgen-enum` | 1 | 188 | UNREAD / inventory only |
| `misc` | 2 | 293 | UNREAD / inventory only |
| `mon-abil` | 2 | 1,814 | UNREAD / inventory only |
| `mon-act` | 2 | 4,414 | selected spans only |
| `mon-ai-action` | 1 | 60 | UNREAD / inventory only |
| `mon-attitude-type` | 1 | 20 | UNREAD / inventory only |
| `mon-aura` | 2 | 365 | UNREAD / inventory only |
| `mon-behv` | 2 | 1,696 | UNREAD / inventory only |
| `mon-book` | 1 | 23 | UNREAD / inventory only |
| `mon-cast` | 2 | 10,191 | UNREAD / inventory only |
| `mon-clone` | 2 | 423 | UNREAD / inventory only |
| `mon-dam-level-type` | 1 | 14 | UNREAD / inventory only |
| `mon-death` | 2 | 4,569 | UNREAD / inventory only |
| `mon-ench` | 2 | 2,587 | UNREAD / inventory only |
| `mon-enum` | 1 | 385 | UNREAD / inventory only |
| `mon-explode` | 2 | 462 | UNREAD / inventory only |
| `mon-flags` | 1 | 338 | UNREAD / inventory only |
| `mon-gear` | 2 | 2,737 | UNREAD / inventory only |
| `mon-holy-type` | 1 | 18 | UNREAD / inventory only |
| `mon-info` | 2 | 2,856 | UNREAD / inventory only |
| `mon-info-flag-name` | 1 | 169 | UNREAD / inventory only |
| `mon-inv-type` | 1 | 29 | UNREAD / inventory only |
| `mon-lurk` | 2 | 362 | UNREAD / inventory only |
| `mon-movetarget` | 2 | 1,132 | UNREAD / inventory only |
| `mon-pathfind` | 2 | 702 | UNREAD / inventory only |
| `mon-pick` | 2 | 388 | UNREAD / inventory only |
| `mon-pick-data` | 1 | 1,469 | UNREAD / inventory only |
| `mon-place` | 2 | 3,934 | UNREAD / inventory only |
| `mon-poly` | 2 | 799 | UNREAD / inventory only |
| `mon-project` | 2 | 726 | UNREAD / inventory only |
| `mon-speak` | 2 | 893 | selected spans only |
| `mon-spell` | 1 | 2,688 | UNREAD / inventory only |
| `mon-tentacle` | 2 | 1,421 | UNREAD / inventory only |
| `mon-transit` | 2 | 682 | UNREAD / inventory only |
| `mon-util` | 2 | 6,638 | UNREAD / inventory only |
| `monster` | 2 | 7,658 | UNREAD / inventory only |
| `monster-type` | 1 | 1,489 | UNREAD / inventory only |
| `montravel-target-type` | 1 | 11 | UNREAD / inventory only |
| `movement` | 2 | 1,324 | UNREAD / inventory only |
| `movement-type` | 1 | 46 | UNREAD / inventory only |
| `mpr` | 1 | 127 | UNREAD / inventory only |
| `msvc` | 1 | 44 | UNREAD / inventory only |
| `mutant-beast` | 1 | 55 | UNREAD / inventory only |
| `mutation` | 2 | 3,854 | UNREAD / inventory only |
| `mutation-data` | 1 | 2,653 | UNREAD / inventory only |
| `mutation-type` | 1 | 364 | UNREAD / inventory only |
| `nearby-danger` | 2 | 754 | UNREAD / inventory only |
| `newgame` | 2 | 2,373 | UNREAD / inventory only |
| `newgame-def` | 1 | 72 | UNREAD / inventory only |
| `ng-init` | 2 | 440 | UNREAD / inventory only |
| `ng-init-branches` | 2 | 58 | UNREAD / inventory only |
| `ng-input` | 2 | 107 | UNREAD / inventory only |
| `ng-restr` | 2 | 135 | UNREAD / inventory only |
| `ng-setup` | 2 | 719 | UNREAD / inventory only |
| `ng-wanderer` | 2 | 970 | UNREAD / inventory only |
| `noise` | 1 | 147 | UNREAD / inventory only |
| `notes` | 2 | 729 | selected spans only |
| `object-class-type` | 1 | 37 | UNREAD / inventory only |
| `object-selector-type` | 1 | 29 | UNREAD / inventory only |
| `operation-types` | 1 | 23 | UNREAD / inventory only |
| `options` | 1 | 1,058 | UNREAD / inventory only |
| `orb` | 2 | 110 | UNREAD / inventory only |
| `orb-type` | 1 | 6 | UNREAD / inventory only |
| `ouch` | 2 | 1,716 | UNREAD / inventory only |
| `outer-menu` | 2 | 595 | UNREAD / inventory only |
| `output` | 2 | 2,986 | UNREAD / inventory only |
| `package` | 2 | 1,084 | UNREAD / inventory only |
| `pattern` | 2 | 387 | UNREAD / inventory only |
| `pcg` | 2 | 176 | UNREAD / inventory only |
| `perlin` | 2 | 459 | UNREAD / inventory only |
| `piety-info` | 2 | 214 | UNREAD / inventory only |
| `place` | 2 | 98 | UNREAD / inventory only |
| `place-info` | 2 | 353 | UNREAD / inventory only |
| `platform` | 1 | 340 | UNREAD / inventory only |
| `playable` | 2 | 240 | UNREAD / inventory only |
| `player` | 2 | 11,246 | UNREAD / inventory only |
| `player-act` | 1 | 805 | UNREAD / inventory only |
| `player-equip` | 2 | 3,075 | UNREAD / inventory only |
| `player-notices` | 2 | 737 | UNREAD / inventory only |
| `player-reacts` | 2 | 1,471 | UNREAD / inventory only |
| `player-save-info` | 1 | 54 | UNREAD / inventory only |
| `player-stats` | 2 | 459 | UNREAD / inventory only |
| `potion` | 2 | 1,249 | UNREAD / inventory only |
| `potion-type` | 1 | 107 | UNREAD / inventory only |
| `precision-menu` | 2 | 2,079 | UNREAD / inventory only |
| `prompt` | 2 | 740 | UNREAD / inventory only |
| `pronoun-type` | 1 | 10 | UNREAD / inventory only |
| `props` | 1 | 23 | UNREAD / inventory only |
| `quiver` | 2 | 3,384 | UNREAD / inventory only |
| `randbook` | 2 | 1,006 | UNREAD / inventory only |
| `random` | 2 | 900 | selected spans only |
| `random-pick` | 1 | 148 | UNREAD / inventory only |
| `random-var` | 2 | 351 | UNREAD / inventory only |
| `ranged-attack` | 2 | 940 | UNREAD / inventory only |
| `ray` | 2 | 567 | UNREAD / inventory only |
| `rc-line-type` | 1 | 11 | UNREAD / inventory only |
| `recite-eligibility` | 1 | 10 | UNREAD / inventory only |
| `recite-type` | 1 | 10 | UNREAD / inventory only |
| `religion` | 2 | 5,196 | UNREAD / inventory only |
| `religion-enum` | 1 | 38 | UNREAD / inventory only |
| `rng-type` | 1 | 19 | UNREAD / inventory only |
| `sacrifice-data` | 1 | 209 | UNREAD / inventory only |
| `score-format-type` | 1 | 8 | UNREAD / inventory only |
| `screen-mode` | 1 | 10 | UNREAD / inventory only |
| `scroller` | 2 | 279 | UNREAD / inventory only |
| `seen-context-type` | 1 | 11 | UNREAD / inventory only |
| `shop-type` | 1 | 26 | UNREAD / inventory only |
| `shopping` | 2 | 2,945 | UNREAD / inventory only |
| `shout` | 2 | 1,349 | UNREAD / inventory only |
| `show` | 2 | 534 | UNREAD / inventory only |
| `showsymb` | 2 | 614 | UNREAD / inventory only |
| `size-part-type` | 1 | 7 | UNREAD / inventory only |
| `size-type` | 1 | 14 | UNREAD / inventory only |
| `skill-focus-mode` | 1 | 8 | UNREAD / inventory only |
| `skill-menu` | 2 | 2,171 | UNREAD / inventory only |
| `skill-menu-state` | 1 | 25 | UNREAD / inventory only |
| `skill-type` | 1 | 73 | UNREAD / inventory only |
| `skills` | 2 | 3,076 | selected spans only |
| `slot-select-mode` | 1 | 7 | UNREAD / inventory only |
| `sound` | 2 | 204 | UNREAD / inventory only |
| `species` | 2 | 895 | UNREAD / inventory only |
| `species-def` | 1 | 70 | UNREAD / inventory only |
| `spell-type` | 1 | 672 | UNREAD / inventory only |
| `spl-book` | 2 | 1,364 | UNREAD / inventory only |
| `spl-cast` | 2 | 4,038 | UNREAD / inventory only |
| `spl-clouds` | 2 | 237 | UNREAD / inventory only |
| `spl-damage` | 2 | 5,699 | UNREAD / inventory only |
| `spl-data` | 1 | 4,891 | UNREAD / inventory only |
| `spl-goditem` | 2 | 1,442 | UNREAD / inventory only |
| `spl-miscast` | 2 | 442 | UNREAD / inventory only |
| `spl-monench` | 2 | 698 | UNREAD / inventory only |
| `spl-other` | 2 | 841 | UNREAD / inventory only |
| `spl-selfench` | 2 | 381 | UNREAD / inventory only |
| `spl-summoning` | 2 | 4,829 | UNREAD / inventory only |
| `spl-transloc` | 2 | 2,677 | UNREAD / inventory only |
| `spl-util` | 2 | 2,446 | UNREAD / inventory only |
| `spl-vortex` | 1 | 497 | UNREAD / inventory only |
| `spl-zap` | 2 | 257 | UNREAD / inventory only |
| `sprint` | 2 | 39 | UNREAD / inventory only |
| `sqldbm` | 2 | 557 | UNREAD / inventory only |
| `stairs` | 2 | 1,467 | UNREAD / inventory only |
| `startup` | 2 | 1,148 | UNREAD / inventory only |
| `stash` | 2 | 2,498 | UNREAD / inventory only |
| `stat-type` | 1 | 11 | UNREAD / inventory only |
| `state` | 2 | 988 | UNREAD / inventory only |
| `status` | 2 | 1,699 | UNREAD / inventory only |
| `stepdown` | 2 | 77 | UNREAD / inventory only |
| `store` | 2 | 2,164 | UNREAD / inventory only |
| `stringutil` | 2 | 927 | UNREAD / inventory only |
| `syscalls` | 2 | 618 | UNREAD / inventory only |
| `tag-pref` | 1 | 12 | UNREAD / inventory only |
| `tag-version` | 1 | 498 | selected spans only |
| `tags` | 2 | 9,390 | selected spans only |
| `targ-mode-type` | 1 | 14 | UNREAD / inventory only |
| `target` | 2 | 3,803 | UNREAD / inventory only |
| `target-compass` | 2 | 130 | UNREAD / inventory only |
| `targeting-type` | 1 | 9 | UNREAD / inventory only |
| `teleport` | 2 | 537 | UNREAD / inventory only |
| `terrain` | 2 | 2,972 | UNREAD / inventory only |
| `terrain-change-type` | 1 | 25 | UNREAD / inventory only |
| `text-tag-type` | 1 | 10 | UNREAD / inventory only |
| `threads` | 1 | 100 | UNREAD / inventory only |
| `throw` | 2 | 1,143 | UNREAD / inventory only |
| `tile-env` | 1 | 75 | UNREAD / inventory only |
| `tile-flags` | 1 | 113 | UNREAD / inventory only |
| `tile-inventory-flags` | 1 | 13 | UNREAD / inventory only |
| `tile-player-flag-cut` | 1 | 8 | UNREAD / inventory only |
| `tile-player-flags` | 1 | 10 | UNREAD / inventory only |
| `tilebuf` | 2 | 469 | UNREAD / inventory only |
| `tilecell` | 2 | 659 | UNREAD / inventory only |
| `tiledgnbuf` | 2 | 828 | UNREAD / inventory only |
| `tiledoll` | 2 | 1,162 | UNREAD / inventory only |
| `tilefont` | 2 | 100 | UNREAD / inventory only |
| `tilemcache` | 2 | 1,911 | UNREAD / inventory only |
| `tilepick` | 2 | 5,481 | UNREAD / inventory only |
| `tilepick-p` | 2 | 1,288 | UNREAD / inventory only |
| `tilereg` | 2 | 287 | UNREAD / inventory only |
| `tilereg-abl` | 2 | 263 | UNREAD / inventory only |
| `tilereg-cmd` | 2 | 323 | UNREAD / inventory only |
| `tilereg-crt` | 2 | 75 | UNREAD / inventory only |
| `tilereg-dgn` | 2 | 1,182 | UNREAD / inventory only |
| `tilereg-doll` | 2 | 584 | UNREAD / inventory only |
| `tilereg-grid` | 2 | 257 | UNREAD / inventory only |
| `tilereg-inv` | 2 | 804 | UNREAD / inventory only |
| `tilereg-map` | 2 | 330 | UNREAD / inventory only |
| `tilereg-mem` | 2 | 192 | UNREAD / inventory only |
| `tilereg-mon` | 2 | 270 | UNREAD / inventory only |
| `tilereg-msg` | 2 | 155 | UNREAD / inventory only |
| `tilereg-skl` | 2 | 287 | UNREAD / inventory only |
| `tilereg-spl` | 2 | 251 | UNREAD / inventory only |
| `tilereg-stat` | 2 | 124 | UNREAD / inventory only |
| `tilereg-tab` | 2 | 553 | UNREAD / inventory only |
| `tilereg-text` | 2 | 338 | UNREAD / inventory only |
| `tiles` | 1 | 59 | UNREAD / inventory only |
| `tiles-build-specific` | 1 | 29 | UNREAD / inventory only |
| `tilesdl` | 2 | 1,866 | UNREAD / inventory only |
| `tiletex` | 2 | 308 | UNREAD / inventory only |
| `tileview` | 2 | 1,418 | UNREAD / inventory only |
| `tileweb` | 2 | 3,092 | UNREAD / inventory only |
| `tileweb-text` | 2 | 239 | UNREAD / inventory only |
| `timed-effect-type` | 1 | 33 | UNREAD / inventory only |
| `timed-effects` | 2 | 1,313 | selected spans only |
| `torment-source-type` | 1 | 15 | UNREAD / inventory only |
| `transform` | 2 | 3,673 | UNREAD / inventory only |
| `transformation` | 1 | 54 | UNREAD / inventory only |
| `traps` | 2 | 1,207 | UNREAD / inventory only |
| `travel` | 2 | 6,079 | selected spans only |
| `travel-defs` | 1 | 11 | UNREAD / inventory only |
| `travel-open-doors-type` | 1 | 15 | UNREAD / inventory only |
| `tutorial` | 2 | 69 | UNREAD / inventory only |
| `ui` | 2 | 4,958 | UNREAD / inventory only |
| `ui-scissor` | 1 | 55 | UNREAD / inventory only |
| `uncancel` | 2 | 158 | UNREAD / inventory only |
| `uncancellable-type` | 1 | 16 | UNREAD / inventory only |
| `undead-state-type` | 1 | 8 | UNREAD / inventory only |
| `unicode` | 2 | 657 | UNREAD / inventory only |
| `unique-creature-list-type` | 1 | 42 | UNREAD / inventory only |
| `unique-item-status-type` | 1 | 9 | UNREAD / inventory only |
| `unwind` | 1 | 95 | UNREAD / inventory only |
| `version` | 2 | 189 | UNREAD / inventory only |
| `view` | 2 | 1,284 | UNREAD / inventory only |
| `viewchar` | 2 | 187 | UNREAD / inventory only |
| `viewgeom` | 2 | 653 | UNREAD / inventory only |
| `viewmap` | 2 | 1,691 | UNREAD / inventory only |
| `wcwidth` | 1 | 233 | UNREAD / inventory only |
| `windowmanager` | 1 | 191 | UNREAD / inventory only |
| `windowmanager-sdl` | 2 | 1,438 | UNREAD / inventory only |
| `wiz-dgn` | 2 | 868 | UNREAD / inventory only |
| `wiz-dump` | 2 | 657 | UNREAD / inventory only |
| `wiz-fsim` | 2 | 887 | UNREAD / inventory only |
| `wiz-item` | 2 | 1,450 | UNREAD / inventory only |
| `wiz-mon` | 2 | 1,048 | UNREAD / inventory only |
| `wiz-you` | 2 | 1,221 | UNREAD / inventory only |
| `wizard` | 2 | 566 | UNREAD / inventory only |
| `wizard-option-type` | 1 | 8 | UNREAD / inventory only |
| `worley` | 2 | 377 | UNREAD / inventory only |
| `wu-jian-attack-type` | 1 | 10 | UNREAD / inventory only |
| `xom` | 2 | 6,064 | UNREAD / inventory only |
| `xp-evoker-data` | 1 | 46 | UNREAD / inventory only |
| `xp-tracking-type` | 1 | 9 | UNREAD / inventory only |
| `zap-data` | 1 | 2,927 | UNREAD / inventory only |
| `zap-type` | 1 | 210 | UNREAD / inventory only |
| `zot` | 2 | 444 | UNREAD / inventory only |

### Source and content directory census

Every tracked file is counted once by its containing directory. Presence is verified; unlisted semantics remain unread. Full path/blob manifests remain privately in `extract/crawl-git-tree.txt`.

| Directory | Tracked files |
|---|---:|
| `.` | 7 |
| `.github/ISSUE_TEMPLATE` | 1 |
| `.github/workflows` | 3 |
| `crawl-ref` | 4 |
| `crawl-ref/docs` | 13 |
| `crawl-ref/docs/develop` | 24 |
| `crawl-ref/docs/develop/git` | 6 |
| `crawl-ref/docs/develop/history` | 1 |
| `crawl-ref/docs/develop/levels` | 6 |
| `crawl-ref/docs/develop/release` | 4 |
| `crawl-ref/docs/develop/team` | 2 |
| `crawl-ref/docs/license` | 6 |
| `crawl-ref/docs/obsolete` | 5 |
| `crawl-ref/docs/template` | 2 |
| `crawl-ref/git-hooks` | 2 |
| `crawl-ref/settings` | 10 |
| `crawl-ref/settings/mac` | 1 |
| `crawl-ref/source` | 770 |
| `crawl-ref/source/Crawl.xcodeproj` | 2 |
| `crawl-ref/source/MSVC` | 14 |
| `crawl-ref/source/MSVC/include/sys` | 1 |
| `crawl-ref/source/MSVC/webserver` | 4 |
| `crawl-ref/source/MSVC/webserver/Properties` | 1 |
| `crawl-ref/source/android-project` | 4 |
| `crawl-ref/source/android-project/app` | 2 |
| `crawl-ref/source/android-project/app/src/main` | 1 |
| `crawl-ref/source/android-project/app/src/main/java/org/develz/crawl` | 12 |
| `crawl-ref/source/android-project/app/src/main/java/org/libsdl/app` | 4 |
| `crawl-ref/source/android-project/app/src/main/res/anim` | 4 |
| `crawl-ref/source/android-project/app/src/main/res/drawable` | 2 |
| `crawl-ref/source/android-project/app/src/main/res/layout` | 14 |
| `crawl-ref/source/android-project/app/src/main/res/mipmap-xhdpi` | 1 |
| `crawl-ref/source/android-project/app/src/main/res/values` | 2 |
| `crawl-ref/source/android-project/gradle` | 1 |
| `crawl-ref/source/android-project/gradle/wrapper` | 1 |
| `crawl-ref/source/android-project/jni` | 13 |
| `crawl-ref/source/android-project/jni/src` | 1 |
| `crawl-ref/source/catch2-tests` | 23 |
| `crawl-ref/source/contrib` | 14 |
| `crawl-ref/source/contrib/MSVC` | 18 |
| `crawl-ref/source/dat/clua` | 5 |
| `crawl-ref/source/dat/database` | 23 |
| `crawl-ref/source/dat/database/el` | 2 |
| `crawl-ref/source/dat/database/pl` | 2 |
| `crawl-ref/source/dat/database/zh` | 10 |
| `crawl-ref/source/dat/defaults` | 8 |
| `crawl-ref/source/dat/des` | 3 |
| `crawl-ref/source/dat/des/altar` | 14 |
| `crawl-ref/source/dat/des/arrival` | 5 |
| `crawl-ref/source/dat/des/branches` | 31 |
| `crawl-ref/source/dat/des/builder` | 24 |
| `crawl-ref/source/dat/des/portals` | 15 |
| `crawl-ref/source/dat/des/serial` | 19 |
| `crawl-ref/source/dat/des/sprint` | 9 |
| `crawl-ref/source/dat/des/test` | 2 |
| `crawl-ref/source/dat/des/traps` | 2 |
| `crawl-ref/source/dat/des/tutorial` | 5 |
| `crawl-ref/source/dat/des/variable` | 18 |
| `crawl-ref/source/dat/descript` | 23 |
| `crawl-ref/source/dat/descript/cs` | 14 |
| `crawl-ref/source/dat/descript/da` | 13 |
| `crawl-ref/source/dat/descript/de` | 17 |
| `crawl-ref/source/dat/descript/el` | 10 |
| `crawl-ref/source/dat/descript/es` | 18 |
| `crawl-ref/source/dat/descript/fi` | 11 |
| `crawl-ref/source/dat/descript/fr` | 17 |
| `crawl-ref/source/dat/descript/hu` | 2 |
| `crawl-ref/source/dat/descript/it` | 15 |
| `crawl-ref/source/dat/descript/ja` | 15 |
| `crawl-ref/source/dat/descript/ko` | 17 |
| `crawl-ref/source/dat/descript/lt` | 7 |
| `crawl-ref/source/dat/descript/lv` | 16 |
| `crawl-ref/source/dat/descript/nl` | 3 |
| `crawl-ref/source/dat/descript/pl` | 15 |
| `crawl-ref/source/dat/descript/pt` | 5 |
| `crawl-ref/source/dat/descript/ru` | 23 |
| `crawl-ref/source/dat/descript/sv` | 8 |
| `crawl-ref/source/dat/descript/tr` | 10 |
| `crawl-ref/source/dat/descript/zh` | 21 |
| `crawl-ref/source/dat/dist_bones` | 34 |
| `crawl-ref/source/dat/dlua` | 45 |
| `crawl-ref/source/dat/dlua/layout` | 28 |
| `crawl-ref/source/dat/emacs` | 1 |
| `crawl-ref/source/dat/forms` | 39 |
| `crawl-ref/source/dat/jobs` | 29 |
| `crawl-ref/source/dat/lua-wiz` | 1 |
| `crawl-ref/source/dat/mons` | 690 |
| `crawl-ref/source/dat/species` | 49 |
| `crawl-ref/source/dat/tiles` | 51 |
| `crawl-ref/source/dat/vim/syntax` | 1 |
| `crawl-ref/source/debian` | 11 |
| `crawl-ref/source/debian/source` | 1 |
| `crawl-ref/source/debian/upstream` | 1 |
| `crawl-ref/source/mac` | 3 |
| `crawl-ref/source/misc` | 6 |
| `crawl-ref/source/prebuilt` | 3 |
| `crawl-ref/source/rltiles` | 28 |
| `crawl-ref/source/rltiles/UNUSED/armour` | 15 |
| `crawl-ref/source/rltiles/UNUSED/effects` | 21 |
| `crawl-ref/source/rltiles/UNUSED/emissaries` | 6 |
| `crawl-ref/source/rltiles/UNUSED/features` | 24 |
| `crawl-ref/source/rltiles/UNUSED/floor` | 8 |
| `crawl-ref/source/rltiles/UNUSED/floor/sigils` | 39 |
| `crawl-ref/source/rltiles/UNUSED/food` | 5 |
| `crawl-ref/source/rltiles/UNUSED/gui` | 45 |
| `crawl-ref/source/rltiles/UNUSED/monsters` | 122 |
| `crawl-ref/source/rltiles/UNUSED/monsters/plants` | 11 |
| `crawl-ref/source/rltiles/UNUSED/monsters/skeletons` | 37 |
| `crawl-ref/source/rltiles/UNUSED/other` | 57 |
| `crawl-ref/source/rltiles/UNUSED/player` | 12 |
| `crawl-ref/source/rltiles/UNUSED/spells` | 41 |
| `crawl-ref/source/rltiles/UNUSED/spells/components` | 8 |
| `crawl-ref/source/rltiles/UNUSED/spells/divination` | 3 |
| `crawl-ref/source/rltiles/UNUSED/talismans` | 12 |
| `crawl-ref/source/rltiles/UNUSED/weapons` | 89 |
| `crawl-ref/source/rltiles/UNUSED/worn` | 9 |
| `crawl-ref/source/rltiles/UNUSED/worn/armour` | 12 |
| `crawl-ref/source/rltiles/UNUSED/worn/misc` | 10 |
| `crawl-ref/source/rltiles/UNUSED/worn/rods` | 10 |
| `crawl-ref/source/rltiles/dngn` | 17 |
| `crawl-ref/source/rltiles/dngn/altars` | 82 |
| `crawl-ref/source/rltiles/dngn/decor` | 21 |
| `crawl-ref/source/rltiles/dngn/doors` | 91 |
| `crawl-ref/source/rltiles/dngn/floor` | 585 |
| `crawl-ref/source/rltiles/dngn/floor/grass` | 41 |
| `crawl-ref/source/rltiles/dngn/gateways` | 127 |
| `crawl-ref/source/rltiles/dngn/shops` | 12 |
| `crawl-ref/source/rltiles/dngn/statues` | 62 |
| `crawl-ref/source/rltiles/dngn/traps` | 44 |
| `crawl-ref/source/rltiles/dngn/trees` | 57 |
| `crawl-ref/source/rltiles/dngn/vaults` | 120 |
| `crawl-ref/source/rltiles/dngn/vaults/wall` | 16 |
| `crawl-ref/source/rltiles/dngn/wall` | 799 |
| `crawl-ref/source/rltiles/dngn/wall/abyss` | 120 |
| `crawl-ref/source/rltiles/dngn/water` | 117 |
| `crawl-ref/source/rltiles/effect` | 514 |
| `crawl-ref/source/rltiles/gui` | 18 |
| `crawl-ref/source/rltiles/gui/abilities` | 40 |
| `crawl-ref/source/rltiles/gui/backgrounds` | 31 |
| `crawl-ref/source/rltiles/gui/commands` | 47 |
| `crawl-ref/source/rltiles/gui/invocations` | 143 |
| `crawl-ref/source/rltiles/gui/mutations` | 310 |
| `crawl-ref/source/rltiles/gui/skills` | 41 |
| `crawl-ref/source/rltiles/gui/skills/gods` | 17 |
| `crawl-ref/source/rltiles/gui/spells` | 2 |
| `crawl-ref/source/rltiles/gui/spells/air` | 12 |
| `crawl-ref/source/rltiles/gui/spells/alchemy` | 10 |
| `crawl-ref/source/rltiles/gui/spells/conjuration` | 9 |
| `crawl-ref/source/rltiles/gui/spells/earth` | 13 |
| `crawl-ref/source/rltiles/gui/spells/enchantment` | 19 |
| `crawl-ref/source/rltiles/gui/spells/fire` | 18 |
| `crawl-ref/source/rltiles/gui/spells/forgecraft` | 16 |
| `crawl-ref/source/rltiles/gui/spells/ice` | 18 |
| `crawl-ref/source/rltiles/gui/spells/misc` | 10 |
| `crawl-ref/source/rltiles/gui/spells/monster` | 175 |
| `crawl-ref/source/rltiles/gui/spells/monster/shadow` | 11 |
| `crawl-ref/source/rltiles/gui/spells/necromancy` | 23 |
| `crawl-ref/source/rltiles/gui/spells/summoning` | 20 |
| `crawl-ref/source/rltiles/gui/spells/translocation` | 13 |
| `crawl-ref/source/rltiles/gui/startup` | 8 |
| `crawl-ref/source/rltiles/gui/tutorial` | 2 |
| `crawl-ref/source/rltiles/item/amulet` | 42 |
| `crawl-ref/source/rltiles/item/amulet/artefact` | 12 |
| `crawl-ref/source/rltiles/item/amulet/randarts` | 8 |
| `crawl-ref/source/rltiles/item/armour` | 76 |
| `crawl-ref/source/rltiles/item/armour/artefact` | 66 |
| `crawl-ref/source/rltiles/item/armour/brands` | 49 |
| `crawl-ref/source/rltiles/item/armour/headgear` | 26 |
| `crawl-ref/source/rltiles/item/armour/shields` | 20 |
| `crawl-ref/source/rltiles/item/book` | 31 |
| `crawl-ref/source/rltiles/item/book/artefact` | 7 |
| `crawl-ref/source/rltiles/item/food` | 28 |
| `crawl-ref/source/rltiles/item/food/chunk_brands` | 4 |
| `crawl-ref/source/rltiles/item/gem` | 30 |
| `crawl-ref/source/rltiles/item/gizmo` | 10 |
| `crawl-ref/source/rltiles/item/gold` | 14 |
| `crawl-ref/source/rltiles/item/misc` | 36 |
| `crawl-ref/source/rltiles/item/misc/runes` | 24 |
| `crawl-ref/source/rltiles/item/misc/uncollected_runes` | 19 |
| `crawl-ref/source/rltiles/item/parchment` | 69 |
| `crawl-ref/source/rltiles/item/potion` | 57 |
| `crawl-ref/source/rltiles/item/ring` | 52 |
| `crawl-ref/source/rltiles/item/ring/artefact` | 5 |
| `crawl-ref/source/rltiles/item/ring/randarts` | 15 |
| `crawl-ref/source/rltiles/item/rod` | 10 |
| `crawl-ref/source/rltiles/item/scroll` | 35 |
| `crawl-ref/source/rltiles/item/staff` | 30 |
| `crawl-ref/source/rltiles/item/talisman` | 26 |
| `crawl-ref/source/rltiles/item/wand` | 35 |
| `crawl-ref/source/rltiles/item/weapon` | 124 |
| `crawl-ref/source/rltiles/item/weapon/artefact` | 77 |
| `crawl-ref/source/rltiles/item/weapon/brands` | 37 |
| `crawl-ref/source/rltiles/item/weapon/ranged` | 59 |
| `crawl-ref/source/rltiles/misc` | 84 |
| `crawl-ref/source/rltiles/misc/blood` | 122 |
| `crawl-ref/source/rltiles/misc/icons` | 114 |
| `crawl-ref/source/rltiles/misc/numbers` | 27 |
| `crawl-ref/source/rltiles/mon/aberrations` | 40 |
| `crawl-ref/source/rltiles/mon/abyss` | 11 |
| `crawl-ref/source/rltiles/mon/amorphous` | 33 |
| `crawl-ref/source/rltiles/mon/animals` | 121 |
| `crawl-ref/source/rltiles/mon/aquatic` | 12 |
| `crawl-ref/source/rltiles/mon/demihumanoids` | 20 |
| `crawl-ref/source/rltiles/mon/demihumanoids/merfolk` | 12 |
| `crawl-ref/source/rltiles/mon/demihumanoids/naga` | 6 |
| `crawl-ref/source/rltiles/mon/demihumanoids/taurs` | 8 |
| `crawl-ref/source/rltiles/mon/demons` | 47 |
| `crawl-ref/source/rltiles/mon/draco` | 17 |
| `crawl-ref/source/rltiles/mon/dragons` | 25 |
| `crawl-ref/source/rltiles/mon/eyes` | 7 |
| `crawl-ref/source/rltiles/mon/fungi_plants` | 63 |
| `crawl-ref/source/rltiles/mon/holy` | 9 |
| `crawl-ref/source/rltiles/mon/humanoids` | 39 |
| `crawl-ref/source/rltiles/mon/humanoids/demonspawn` | 5 |
| `crawl-ref/source/rltiles/mon/humanoids/elves` | 17 |
| `crawl-ref/source/rltiles/mon/humanoids/giants` | 11 |
| `crawl-ref/source/rltiles/mon/humanoids/humans` | 26 |
| `crawl-ref/source/rltiles/mon/humanoids/orcs` | 11 |
| `crawl-ref/source/rltiles/mon/humanoids/spriggans` | 7 |
| `crawl-ref/source/rltiles/mon/mutantbeast` | 45 |
| `crawl-ref/source/rltiles/mon/nonliving` | 125 |
| `crawl-ref/source/rltiles/mon/nonliving/shadows` | 28 |
| `crawl-ref/source/rltiles/mon/panlord` | 57 |
| `crawl-ref/source/rltiles/mon/player` | 13 |
| `crawl-ref/source/rltiles/mon/sprint` | 12 |
| `crawl-ref/source/rltiles/mon/statues` | 46 |
| `crawl-ref/source/rltiles/mon/tentacles/eldritch_corners` | 4 |
| `crawl-ref/source/rltiles/mon/tentacles/eldritch_ends` | 18 |
| `crawl-ref/source/rltiles/mon/tentacles/eldritch_portal` | 8 |
| `crawl-ref/source/rltiles/mon/tentacles/eldritch_segments` | 20 |
| `crawl-ref/source/rltiles/mon/tentacles/kraken_corners` | 4 |
| `crawl-ref/source/rltiles/mon/tentacles/kraken_ends` | 14 |
| `crawl-ref/source/rltiles/mon/tentacles/kraken_segments` | 29 |
| `crawl-ref/source/rltiles/mon/tentacles/kraken_simulacrum_corners` | 4 |
| `crawl-ref/source/rltiles/mon/tentacles/kraken_simulacrum_ends` | 14 |
| `crawl-ref/source/rltiles/mon/tentacles/kraken_simulacrum_segments` | 29 |
| `crawl-ref/source/rltiles/mon/tentacles/kraken_spectral_corners` | 4 |
| `crawl-ref/source/rltiles/mon/tentacles/kraken_spectral_ends` | 14 |
| `crawl-ref/source/rltiles/mon/tentacles/kraken_spectral_segments` | 29 |
| `crawl-ref/source/rltiles/mon/tentacles/kraken_zombie_corners` | 4 |
| `crawl-ref/source/rltiles/mon/tentacles/kraken_zombie_ends` | 14 |
| `crawl-ref/source/rltiles/mon/tentacles/kraken_zombie_segments` | 29 |
| `crawl-ref/source/rltiles/mon/tentacles/starspawn_corners` | 4 |
| `crawl-ref/source/rltiles/mon/tentacles/starspawn_ends` | 8 |
| `crawl-ref/source/rltiles/mon/tentacles/starspawn_segments` | 20 |
| `crawl-ref/source/rltiles/mon/tentacles/vine_corners` | 4 |
| `crawl-ref/source/rltiles/mon/tentacles/vine_ends` | 8 |
| `crawl-ref/source/rltiles/mon/tentacles/vine_segments` | 28 |
| `crawl-ref/source/rltiles/mon/undead` | 56 |
| `crawl-ref/source/rltiles/mon/undead/bound_souls` | 3 |
| `crawl-ref/source/rltiles/mon/undead/draugr` | 27 |
| `crawl-ref/source/rltiles/mon/undead/simulacra` | 29 |
| `crawl-ref/source/rltiles/mon/undead/spectrals` | 55 |
| `crawl-ref/source/rltiles/mon/undead/zombies` | 88 |
| `crawl-ref/source/rltiles/mon/unique` | 136 |
| `crawl-ref/source/rltiles/mon/vault` | 23 |
| `crawl-ref/source/rltiles/player/barding` | 5 |
| `crawl-ref/source/rltiles/player/base` | 174 |
| `crawl-ref/source/rltiles/player/beard` | 35 |
| `crawl-ref/source/rltiles/player/body` | 159 |
| `crawl-ref/source/rltiles/player/boots` | 27 |
| `crawl-ref/source/rltiles/player/cloak` | 19 |
| `crawl-ref/source/rltiles/player/drcwing` | 15 |
| `crawl-ref/source/rltiles/player/ench` | 1 |
| `crawl-ref/source/rltiles/player/felids` | 10 |
| `crawl-ref/source/rltiles/player/gloves` | 22 |
| `crawl-ref/source/rltiles/player/hair` | 56 |
| `crawl-ref/source/rltiles/player/halo` | 1 |
| `crawl-ref/source/rltiles/player/hand1` | 224 |
| `crawl-ref/source/rltiles/player/hand1/artefact` | 67 |
| `crawl-ref/source/rltiles/player/hand1/misc` | 13 |
| `crawl-ref/source/rltiles/player/hand2` | 36 |
| `crawl-ref/source/rltiles/player/hand2/doll_only` | 24 |
| `crawl-ref/source/rltiles/player/hand2/misc` | 30 |
| `crawl-ref/source/rltiles/player/head` | 103 |
| `crawl-ref/source/rltiles/player/legs` | 34 |
| `crawl-ref/source/rltiles/player/mutations` | 13 |
| `crawl-ref/source/rltiles/player/transform` | 152 |
| `crawl-ref/source/rltiles/tool` | 10 |
| `crawl-ref/source/scripts` | 7 |
| `crawl-ref/source/test` | 23 |
| `crawl-ref/source/test/big` | 1 |
| `crawl-ref/source/test/eyecandy` | 1 |
| `crawl-ref/source/test/stress` | 10 |
| `crawl-ref/source/util` | 71 |
| `crawl-ref/source/util/docs` | 6 |
| `crawl-ref/source/util/form-gen` | 3 |
| `crawl-ref/source/util/job-gen` | 8 |
| `crawl-ref/source/util/mon-gen` | 3 |
| `crawl-ref/source/util/monster` | 1 |
| `crawl-ref/source/util/server` | 3 |
| `crawl-ref/source/util/species-gen` | 10 |
| `crawl-ref/source/webserver` | 9 |
| `crawl-ref/source/webserver/contrib` | 1 |
| `crawl-ref/source/webserver/game_data/static` | 27 |
| `crawl-ref/source/webserver/game_data/templates` | 1 |
| `crawl-ref/source/webserver/games.d` | 1 |
| `crawl-ref/source/webserver/requirements` | 2 |
| `crawl-ref/source/webserver/requirements.in` | 3 |
| `crawl-ref/source/webserver/static` | 3 |
| `crawl-ref/source/webserver/static/fonts` | 5 |
| `crawl-ref/source/webserver/static/scripts` | 6 |
| `crawl-ref/source/webserver/static/scripts/contrib` | 8 |
| `crawl-ref/source/webserver/templates` | 8 |
| `crawl-ref/source/webserver/webtiles` | 19 |
| `crawl-ref/source/xdg-data` | 4 |
## Cataclysm: Dark Days Ahead: subsystem map

| System | Source families | Size signal | Dossier / this pass |
|---|---|---:|---|
| JSON topic graph and dialogue effects | `src/npctalk.cpp src/dialogue*.h src/condition*.cpp` | 6 paths, 554,621 bytes | new A01; D1 |
| Scheduled effect-on-condition engine | `src/effect_on_condition.*` | 2 paths, 26,772 bytes | new A09; D2 |
| Composite world/player persistence | `src/savegame*.cpp src/game_io.cpp` | 4 paths, 331,703 bytes | new A04; D3 |
| Event bus and statistics | `src/event_bus.* src/stats_tracker.*` | 4 paths, 24,793 bytes | bus reread; prior statistics |
| Achievements and conducts | `src/achievement.* data/json/achievements.json data/json/conducts.json` | 4 paths, 124,254 bytes | prior REPORT; full fresh engine UNREAD |
| JSON loading and mod data | `src/init.cpp src/mod*.cpp` | 4 paths, 74,395 bytes | loader selected; dependency ordering UNREAD |
| Calendar and turn processing | `src/calendar.* src/do_turn.*` | 4 paths, 96,437 bytes | selected A03/A09 |
| NPC needs, activity and combat AI | `src/npcmove.cpp src/npc_needs* src/npc*.cpp` | 12 paths, 1,046,430 bytes | selected results/needs; broader UNREAD |
| Mission lifecycle and diary | `src/mission*.cpp src/diary*` | 10 paths, 259,617 bytes | identity entry selected; full closure UNREAD |
| Sidebar widgets and UI | `src/panels.* src/widget* data/json/ui/*.json` | 109 paths, 534,950 bytes | partial A06 |
| Tutorial and contextual help | `src/gamemode_tutorial.* src/help.*` | 4 paths, 41,345 bytes | lesson enum selected; full triggers UNREAD |
| Practice, recipes and crafting | `src/crafting.cpp src/recipe.cpp data/json/recipes/practice/*.json` | 15 paths, 451,296 bytes | prior REPORT plus selected data |
| Activities, jobs and reservations | `src/activity_actor.cpp src/activity_handlers.cpp src/craft_reservations*` | 2 paths, 620,463 bytes | prior selected practice; broader UNREAD |
| Skills and proficiencies | `src/skill.* src/proficiency.* data/json/proficiencies/*.json` | 22 paths, 175,934 bytes | prior selected depth; catalogue UNREAD |
| Martial arts and combat | `src/martialarts.cpp src/melee.cpp data/json/martialarts.json` | 3 paths, 286,274 bytes | prior REPORT; fresh full route UNREAD |
| Vehicles and power | `src/vehicle*.cpp src/veh*.cpp data/json/vehicles/*.json` | 29 paths, 1,700,550 bytes | UNREAD |
| Mutation and bionics | `src/mutation*.cpp src/bionics.cpp data/json/mutations/*.json` | 32 paths, 1,316,726 bytes | UNREAD |
| Body, needs, medicine and food | `src/character*.cpp src/stomach.cpp data/json/comestibles/*.json` | 19 paths, 885,634 bytes | UNREAD; no YAIR hunger death proposal |
| Item uses and pockets | `src/iuse*.cpp src/item*.cpp` | 29 paths, 1,993,792 bytes | UNREAD beyond practice data |
| Overmap, hordes and settlements | `src/overmap*.cpp src/faction_camp.cpp src/faction.cpp` | 18 paths, 899,227 bytes | turn-loop entries selected; full lifecycle UNREAD |
| Map generation, terrain and fields | `src/mapgen*.cpp src/map.cpp src/field*.cpp data/json/mapgen/*.json` | 913 paths, 12,275,190 bytes | inventory only |
| Weather and ecology | `src/weather*.cpp src/mongroup*` | 5 paths, 101,939 bytes | UNREAD |
| Monsters, weakpoints and attacks | `src/monster*.cpp src/monattack*.cpp` | 4 paths, 416,685 bytes | prior death event; broader UNREAD |
| Worlds, dimensions and optional mods | `src/worldfactory.cpp src/dimension* data/mods/*/*.json` | 3317 paths, 26,186,527 bytes | inventory only; not all loaded together |
| Input, accessibility and translations | `src/input*.cpp src/translations.cpp src/ui_manager.cpp` | 6 paths, 146,179 bytes | UNREAD |
| Tests and build support | `tests/*.cpp tools/* CMakeLists.txt` | 514 paths, 6,669,689 bytes | UNREAD; not executed |

### Data type census

Top-level objects in tracked `data/json/` only; nested inline topics, optional mods and runtime override resolution are excluded. Definitions are inventory signals, not counts of active gameplay instances.

| Type / subsystem family | Top-level records | Coverage |
|---|---:|---|
| `ITEM` | 10431 | inventory only unless named above |
| `ITEM_CATEGORY` | 36 | inventory only unless named above |
| `LOOT_ZONE` | 66 | inventory only unless named above |
| `MIGRATION` | 871 | inventory only unless named above |
| `MONSTER` | 1225 | inventory only unless named above |
| `MONSTER_BLACKLIST` | 1 | inventory only unless named above |
| `MONSTER_FACTION` | 138 | inventory only unless named above |
| `SCENARIO_BLACKLIST` | 1 | inventory only unless named above |
| `SPECIES` | 34 | inventory only unless named above |
| `SPELL` | 281 | inventory only unless named above |
| `TRAIT_MIGRATION` | 6 | inventory only unless named above |
| `achievement` | 211 | inventory only unless named above |
| `activity_type` | 146 | inventory only unless named above |
| `addiction_type` | 13 | inventory only unless named above |
| `ammo_effect` | 97 | inventory only unless named above |
| `ammunition_type` | 159 | inventory only unless named above |
| `anatomy` | 2 | inventory only unless named above |
| `ascii_art` | 427 | inventory only unless named above |
| `attack_vector` | 41 | inventory only unless named above |
| `bash_damage_profile` | 2 | inventory only unless named above |
| `behavior` | 32 | inventory only unless named above |
| `bionic` | 152 | inventory only unless named above |
| `body_graph` | 16 | inventory only unless named above |
| `body_part` | 168 | inventory only unless named above |
| `butchery_requirement` | 1 | inventory only unless named above |
| `camp_migration` | 13 | inventory only unless named above |
| `character_mod` | 28 | inventory only unless named above |
| `charge_removal_blacklist` | 1 | inventory only unless named above |
| `city_building` | 416 | inventory only unless named above |
| `climbing_aid` | 22 | inventory only unless named above |
| `clothing_mod` | 5 | inventory only unless named above |
| `conduct` | 20 | inventory only unless named above |
| `connect_group` | 40 | inventory only unless named above |
| `construction` | 780 | inventory only unless named above |
| `construction_category` | 15 | inventory only unless named above |
| `construction_group` | 440 | inventory only unless named above |
| `damage_info_order` | 10 | inventory only unless named above |
| `damage_type` | 10 | inventory only unless named above |
| `dimension` | 15 | inventory only unless named above |
| `dimension_region_layout` | 15 | inventory only unless named above |
| `disease_type` | 2 | inventory only unless named above |
| `dream` | 110 | inventory only unless named above |
| `effect_migration` | 8 | inventory only unless named above |
| `effect_on_condition` | 991 | selected A01/A09 |
| `effect_type` | 525 | inventory only unless named above |
| `emit` | 67 | inventory only unless named above |
| `enchantment` | 52 | inventory only unless named above |
| `end_screen` | 11 | inventory only unless named above |
| `event_statistic` | 170 | inventory only unless named above |
| `event_transformation` | 158 | inventory only unless named above |
| `faction` | 25 | inventory only unless named above |
| `faction_mission` | 17 | inventory only unless named above |
| `fault` | 98 | inventory only unless named above |
| `fault_fix` | 72 | inventory only unless named above |
| `fault_group` | 32 | inventory only unless named above |
| `field_type` | 170 | inventory only unless named above |
| `forest_biome_component` | 12 | inventory only unless named above |
| `forest_biome_mapgen` | 3 | inventory only unless named above |
| `furniture` | 704 | inventory only unless named above |
| `gate` | 12 | inventory only unless named above |
| `harvest` | 378 | inventory only unless named above |
| `harvest_drop_type` | 9 | inventory only unless named above |
| `hit_range` | 1 | inventory only unless named above |
| `item_action` | 189 | inventory only unless named above |
| `item_group` | 5531 | inventory only unless named above |
| `jmath_function` | 19 | inventory only unless named above |
| `json_flag` | 823 | inventory only unless named above |
| `limb_score` | 15 | inventory only unless named above |
| `map_extra` | 80 | inventory only unless named above |
| `map_extra_collection` | 19 | inventory only unless named above |
| `mapgen` | 7090 | inventory only unless named above |
| `martial_art` | 38 | inventory only unless named above |
| `material` | 202 | inventory only unless named above |
| `mission_definition` | 355 | inventory only unless named above |
| `monster_attack` | 90 | inventory only unless named above |
| `monster_flag` | 146 | inventory only unless named above |
| `monstergroup` | 416 | inventory only unless named above |
| `mood_face` | 8 | inventory only unless named above |
| `morale_type` | 97 | inventory only unless named above |
| `movement_mode` | 4 | inventory only unless named above |
| `mutation` | 1070 | inventory only unless named above |
| `mutation_category` | 30 | inventory only unless named above |
| `mutation_type` | 76 | inventory only unless named above |
| `nested_category` | 610 | inventory only unless named above |
| `npc` | 226 | inventory only unless named above |
| `npc_class` | 170 | inventory only unless named above |
| `omt_placeholder` | 4 | inventory only unless named above |
| `oter_id_migration` | 24 | inventory only unless named above |
| `oter_vision` | 34 | inventory only unless named above |
| `overlay_order` | 1 | inventory only unless named above |
| `overmap_connection` | 5 | inventory only unless named above |
| `overmap_land_use_code` | 34 | inventory only unless named above |
| `overmap_location` | 70 | inventory only unless named above |
| `overmap_special` | 323 | inventory only unless named above |
| `overmap_special_migration` | 49 | inventory only unless named above |
| `overmap_terrain` | 1286 | inventory only unless named above |
| `palette` | 515 | inventory only unless named above |
| `pp_generator` | 3 | inventory only unless named above |
| `practice` | 129 | inventory only unless named above |
| `profession` | 342 | inventory only unless named above |
| `profession_group` | 1 | inventory only unless named above |
| `profession_item_substitutions` | 28 | inventory only unless named above |
| `proficiency` | 236 | inventory only unless named above |
| `proficiency_category` | 18 | inventory only unless named above |
| `proficiency_migration` | 4 | inventory only unless named above |
| `recipe` | 5589 | inventory only unless named above |
| `recipe_category` | 14 | inventory only unless named above |
| `recipe_group` | 62 | inventory only unless named above |
| `region_settings` | 16 | inventory only unless named above |
| `region_settings_city` | 2 | inventory only unless named above |
| `region_settings_forest` | 1 | inventory only unless named above |
| `region_settings_forest_mapgen` | 2 | inventory only unless named above |
| `region_settings_forest_trail` | 1 | inventory only unless named above |
| `region_settings_highway` | 1 | inventory only unless named above |
| `region_settings_lake` | 1 | inventory only unless named above |
| `region_settings_map_extras` | 3 | inventory only unless named above |
| `region_settings_ocean` | 1 | inventory only unless named above |
| `region_settings_ravine` | 3 | inventory only unless named above |
| `region_settings_river` | 1 | inventory only unless named above |
| `region_settings_terrain_furniture` | 4 | inventory only unless named above |
| `region_terrain_furniture` | 43 | inventory only unless named above |
| `relic_procgen_data` | 8 | inventory only unless named above |
| `requirement` | 475 | inventory only unless named above |
| `rotatable_symbol` | 24 | inventory only unless named above |
| `scenario` | 62 | inventory only unless named above |
| `scent_type` | 4 | inventory only unless named above |
| `score` | 40 | inventory only unless named above |
| `shopkeeper_blacklist` | 4 | inventory only unless named above |
| `shopkeeper_consumption_rates` | 3 | inventory only unless named above |
| `skill` | 28 | inventory only unless named above |
| `skill_display_type` | 4 | inventory only unless named above |
| `snippet` | 727 | inventory only unless named above |
| `speech` | 547 | inventory only unless named above |
| `speed_description` | 1 | inventory only unless named above |
| `start_location` | 101 | inventory only unless named above |
| `sub_body_part` | 544 | inventory only unless named above |
| `talk_topic` | 3329 | selected A01/A09 |
| `technique` | 261 | inventory only unless named above |
| `temperature_removal_blacklist` | 1 | inventory only unless named above |
| `ter_furn_migration` | 13 | inventory only unless named above |
| `ter_furn_transform` | 63 | inventory only unless named above |
| `terrain` | 1281 | inventory only unless named above |
| `tool_quality` | 89 | inventory only unless named above |
| `trait_group` | 152 | inventory only unless named above |
| `trap` | 146 | inventory only unless named above |
| `trap_migration` | 1 | inventory only unless named above |
| `uncraft` | 1428 | inventory only unless named above |
| `var_migration` | 2 | inventory only unless named above |
| `vehicle` | 273 | inventory only unless named above |
| `vehicle_group` | 67 | inventory only unless named above |
| `vehicle_part` | 506 | inventory only unless named above |
| `vehicle_part_category` | 12 | inventory only unless named above |
| `vehicle_part_location` | 17 | inventory only unless named above |
| `vehicle_part_migration` | 7 | inventory only unless named above |
| `vehicle_placement` | 2 | inventory only unless named above |
| `vehicle_spawn` | 3 | inventory only unless named above |
| `vitamin` | 58 | inventory only unless named above |
| `weakpoint_set` | 52 | inventory only unless named above |
| `weapon_category` | 25 | inventory only unless named above |
| `weather_generator` | 9 | inventory only unless named above |
| `weather_type` | 26 | inventory only unless named above |
| `widget` | 1247 | inventory only unless named above |

JSON parse failures in census: 0. Topic records: 3329; declared direct responses: 9473. These counts do not expand inline topic graphs or evaluate conditions.

### Cataclysm: Dark Days Ahead: complete immediate gameplay-module census

This mechanically lists every immediate C/C++ source/header stem in the game source root, including helpers. A stem is a discovery unit, not a claim of a separate engine. Nested directories remain visible in the directory census. Status is selected semantic reading when cited, otherwise UNREAD/inventory-only.

| Module | Files | Source lines | This pass |
|---|---:|---:|---|
| `achievement` | 2 | 1,194 | UNREAD / inventory only |
| `action` | 2 | 2,010 | UNREAD / inventory only |
| `active_item_cache` | 2 | 291 | UNREAD / inventory only |
| `activity_actor` | 2 | 15,676 | UNREAD / inventory only |
| `activity_actor_definitions` | 1 | 4,330 | UNREAD / inventory only |
| `activity_handlers` | 2 | 963 | UNREAD / inventory only |
| `activity_item_handling` | 2 | 4,867 | UNREAD / inventory only |
| `activity_tracker` | 2 | 235 | UNREAD / inventory only |
| `activity_type` | 2 | 303 | UNREAD / inventory only |
| `addiction` | 2 | 500 | UNREAD / inventory only |
| `advanced_inv` | 2 | 2,703 | UNREAD / inventory only |
| `advanced_inv_area` | 2 | 418 | UNREAD / inventory only |
| `advanced_inv_listitem` | 2 | 133 | UNREAD / inventory only |
| `advanced_inv_pagination` | 2 | 80 | UNREAD / inventory only |
| `advanced_inv_pane` | 2 | 639 | UNREAD / inventory only |
| `all_enum_values` | 1 | 27 | UNREAD / inventory only |
| `ammo` | 2 | 242 | UNREAD / inventory only |
| `ammo_effect` | 2 | 294 | UNREAD / inventory only |
| `anatomy` | 2 | 440 | UNREAD / inventory only |
| `animation` | 2 | 1,095 | UNREAD / inventory only |
| `armor_layers` | 1 | 1,229 | UNREAD / inventory only |
| `ascii_art` | 2 | 84 | UNREAD / inventory only |
| `atlas_bake_plan` | 2 | 169 | UNREAD / inventory only |
| `auto_note` | 2 | 755 | UNREAD / inventory only |
| `auto_pickup` | 2 | 1,198 | UNREAD / inventory only |
| `avatar` | 2 | 2,688 | UNREAD / inventory only |
| `avatar_action` | 2 | 1,397 | UNREAD / inventory only |
| `ballistics` | 2 | 895 | UNREAD / inventory only |
| `basecamp` | 2 | 1,651 | UNREAD / inventory only |
| `behavior` | 2 | 358 | UNREAD / inventory only |
| `behavior_oracle` | 2 | 124 | UNREAD / inventory only |
| `behavior_strategy` | 2 | 139 | UNREAD / inventory only |
| `bionics` | 2 | 3,933 | UNREAD / inventory only |
| `bionics_ui` | 1 | 1,076 | UNREAD / inventory only |
| `body_part_set` | 1 | 69 | UNREAD / inventory only |
| `bodygraph` | 2 | 836 | UNREAD / inventory only |
| `bodypart` | 2 | 2,087 | UNREAD / inventory only |
| `bonuses` | 2 | 522 | UNREAD / inventory only |
| `build_reqs` | 1 | 44 | UNREAD / inventory only |
| `butchery` | 2 | 1,515 | UNREAD / inventory only |
| `butchery_requirements` | 2 | 173 | UNREAD / inventory only |
| `cached_options` | 2 | 113 | UNREAD / inventory only |
| `calendar` | 2 | 1,755 | UNREAD / inventory only |
| `calendar_ui` | 2 | 182 | UNREAD / inventory only |
| `cartesian_product` | 1 | 52 | UNREAD / inventory only |
| `cata_algo` | 1 | 127 | UNREAD / inventory only |
| `cata_allocator` | 2 | 55 | UNREAD / inventory only |
| `cata_allocator_c` | 2 | 38 | UNREAD / inventory only |
| `cata_assert` | 1 | 38 | UNREAD / inventory only |
| `cata_bitset` | 2 | 384 | UNREAD / inventory only |
| `cata_compiler_support` | 1 | 18 | UNREAD / inventory only |
| `cata_flatbuffers_assert` | 1 | 16 | UNREAD / inventory only |
| `cata_imgui` | 2 | 1,753 | UNREAD / inventory only |
| `cata_io` | 1 | 515 | UNREAD / inventory only |
| `cata_lazy` | 1 | 80 | UNREAD / inventory only |
| `cata_path` | 1 | 172 | UNREAD / inventory only |
| `cata_scope_helpers` | 1 | 65 | UNREAD / inventory only |
| `cata_shader` | 2 | 2,396 | UNREAD / inventory only |
| `cata_small_literal_vector` | 1 | 237 | UNREAD / inventory only |
| `cata_tiles` | 2 | 7,373 | UNREAD / inventory only |
| `cata_type_traits` | 1 | 16 | UNREAD / inventory only |
| `cata_unreachable` | 1 | 20 | UNREAD / inventory only |
| `cata_utility` | 2 | 1,731 | UNREAD / inventory only |
| `cata_variant` | 2 | 643 | UNREAD / inventory only |
| `cata_views` | 1 | 86 | UNREAD / inventory only |
| `catacharset` | 2 | 852 | UNREAD / inventory only |
| `cellular_automata` | 2 | 132 | UNREAD / inventory only |
| `char_validity_check` | 2 | 55 | UNREAD / inventory only |
| `character` | 2 | 12,938 | UNREAD / inventory only |
| `character_ammo` | 1 | 298 | UNREAD / inventory only |
| `character_armor` | 1 | 422 | UNREAD / inventory only |
| `character_attire` | 2 | 2,958 | UNREAD / inventory only |
| `character_body` | 1 | 1,592 | UNREAD / inventory only |
| `character_crafting` | 1 | 239 | UNREAD / inventory only |
| `character_creator_ui` | 1 | 226 | UNREAD / inventory only |
| `character_escape` | 1 | 476 | UNREAD / inventory only |
| `character_guns` | 1 | 335 | UNREAD / inventory only |
| `character_health` | 1 | 3,483 | UNREAD / inventory only |
| `character_id` | 2 | 62 | UNREAD / inventory only |
| `character_inventory` | 1 | 3,207 | UNREAD / inventory only |
| `character_knowledge` | 1 | 600 | UNREAD / inventory only |
| `character_martial_arts` | 2 | 314 | UNREAD / inventory only |
| `character_modifier` | 2 | 488 | UNREAD / inventory only |
| `character_morale` | 1 | 312 | UNREAD / inventory only |
| `character_oracle` | 2 | 663 | UNREAD / inventory only |
| `character_portrait` | 1 | 24 | UNREAD / inventory only |
| `character_proficiency` | 1 | 136 | UNREAD / inventory only |
| `city` | 2 | 163 | UNREAD / inventory only |
| `climbing` | 2 | 615 | UNREAD / inventory only |
| `clone_ptr` | 1 | 71 | UNREAD / inventory only |
| `clothing_mod` | 2 | 267 | UNREAD / inventory only |
| `clzones` | 2 | 2,842 | UNREAD / inventory only |
| `colony` | 1 | 38 | UNREAD / inventory only |
| `color` | 2 | 1,702 | UNREAD / inventory only |
| `color_loader` | 1 | 84 | UNREAD / inventory only |
| `common_types` | 1 | 55 | UNREAD / inventory only |
| `compatibility` | 2 | 57 | UNREAD / inventory only |
| `computer` | 2 | 639 | UNREAD / inventory only |
| `computer_session` | 2 | 2,021 | UNREAD / inventory only |
| `condition` | 2 | 2,919 | UNREAD / inventory only |
| `construction` | 2 | 2,962 | UNREAD / inventory only |
| `construction_category` | 2 | 121 | UNREAD / inventory only |
| `construction_group` | 2 | 125 | UNREAD / inventory only |
| `consumption` | 1 | 2,120 | UNREAD / inventory only |
| `contents_change_handler` | 2 | 107 | UNREAD / inventory only |
| `coordinate_conversions` | 2 | 46 | UNREAD / inventory only |
| `coordinates` | 2 | 1,470 | UNREAD / inventory only |
| `coords_fwd` | 1 | 116 | UNREAD / inventory only |
| `craft_command` | 2 | 998 | UNREAD / inventory only |
| `craft_reservation` | 2 | 800 | UNREAD / inventory only |
| `craft_reservation_search` | 2 | 1,012 | UNREAD / inventory only |
| `crafting` | 2 | 6,042 | UNREAD / inventory only |
| `crafting_enums` | 1 | 27 | UNREAD / inventory only |
| `crafting_gui` | 2 | 3,360 | UNREAD / inventory only |
| `crafting_gui_helpers` | 2 | 1,452 | UNREAD / inventory only |
| `crash` | 2 | 236 | UNREAD / inventory only |
| `creature` | 2 | 5,173 | UNREAD / inventory only |
| `creature_tracker` | 2 | 694 | UNREAD / inventory only |
| `cube_direction` | 1 | 50 | UNREAD / inventory only |
| `cuboid_rectangle` | 1 | 197 | UNREAD / inventory only |
| `current_map` | 2 | 60 | UNREAD / inventory only |
| `cursesdef` | 1 | 167 | UNREAD / inventory only |
| `cursesport` | 2 | 660 | UNREAD / inventory only |
| `damage` | 2 | 1,199 | UNREAD / inventory only |
| `debug` | 2 | 2,322 | UNREAD / inventory only |
| `debug_actions_table` | 1 | 37 | UNREAD / inventory only |
| `debug_capture` | 2 | 760 | UNREAD / inventory only |
| `debug_console` | 2 | 6,539 | UNREAD / inventory only |
| `debug_console_snap` | 2 | 929 | UNREAD / inventory only |
| `debug_menu` | 2 | 5,195 | UNREAD / inventory only |
| `debug_menu_types` | 1 | 141 | UNREAD / inventory only |
| `debug_monitor_targets` | 2 | 364 | UNREAD / inventory only |
| `demangle` | 2 | 47 | UNREAD / inventory only |
| `dependency_tree` | 2 | 524 | UNREAD / inventory only |
| `dialogue` | 1 | 566 | UNREAD / inventory only |
| `dialogue_chatbin` | 2 | 228 | UNREAD / inventory only |
| `dialogue_helpers` | 2 | 420 | UNREAD / inventory only |
| `dialogue_imgui` | 2 | 615 | UNREAD / inventory only |
| `diary` | 2 | 924 | UNREAD / inventory only |
| `diary_ui` | 1 | 418 | UNREAD / inventory only |
| `disease` | 2 | 111 | UNREAD / inventory only |
| `dispersion` | 2 | 79 | UNREAD / inventory only |
| `display` | 2 | 1,883 | UNREAD / inventory only |
| `distraction_manager` | 2 | 194 | UNREAD / inventory only |
| `distribution` | 2 | 238 | UNREAD / inventory only |
| `do_turn` | 2 | 836 | selected spans only |
| `drawing_primitives` | 2 | 98 | UNREAD / inventory only |
| `editmap` | 2 | 1,911 | UNREAD / inventory only |
| `effect` | 2 | 2,343 | UNREAD / inventory only |
| `effect_on_condition` | 2 | 758 | selected spans only |
| `effect_source` | 2 | 153 | UNREAD / inventory only |
| `emit` | 2 | 140 | UNREAD / inventory only |
| `emscripten_exception` | 1 | 13 | UNREAD / inventory only |
| `end_screen` | 2 | 189 | UNREAD / inventory only |
| `enum_bitset` | 1 | 124 | UNREAD / inventory only |
| `enum_conversions` | 1 | 118 | UNREAD / inventory only |
| `enum_traits` | 1 | 143 | UNREAD / inventory only |
| `enums` | 1 | 592 | UNREAD / inventory only |
| `event` | 2 | 1,368 | UNREAD / inventory only |
| `event_bus` | 2 | 220 | selected spans only |
| `event_field_transformations` | 2 | 146 | UNREAD / inventory only |
| `event_statistics` | 2 | 1,455 | UNREAD / inventory only |
| `event_subscriber` | 1 | 30 | UNREAD / inventory only |
| `explosion` | 2 | 1,253 | UNREAD / inventory only |
| `faction` | 2 | 820 | UNREAD / inventory only |
| `faction_camp` | 2 | 6,339 | UNREAD / inventory only |
| `faction_mission` | 1 | 193 | UNREAD / inventory only |
| `faction_ui` | 2 | 1,129 | UNREAD / inventory only |
| `fault` | 2 | 608 | UNREAD / inventory only |
| `field` | 2 | 509 | UNREAD / inventory only |
| `field_type` | 2 | 744 | UNREAD / inventory only |
| `filesystem` | 2 | 759 | UNREAD / inventory only |
| `fire` | 1 | 60 | UNREAD / inventory only |
| `flag` | 2 | 1,033 | UNREAD / inventory only |
| `flag_hot_bits` | 1 | 81 | UNREAD / inventory only |
| `flat_set` | 1 | 221 | UNREAD / inventory only |
| `flexbuffer_cache` | 2 | 595 | UNREAD / inventory only |
| `flexbuffer_json` | 2 | 1,107 | UNREAD / inventory only |
| `flexbuffer_json-inl` | 1 | 1,147 | UNREAD / inventory only |
| `flood_fill` | 1 | 223 | UNREAD / inventory only |
| `font_loader` | 2 | 301 | UNREAD / inventory only |
| `fragment_cloud` | 1 | 34 | UNREAD / inventory only |
| `fungal_effects` | 2 | 302 | UNREAD / inventory only |
| `game` | 2 | 13,042 | UNREAD / inventory only |
| `game_constants` | 1 | 197 | UNREAD / inventory only |
| `game_inventory` | 2 | 3,664 | UNREAD / inventory only |
| `game_io` | 1 | 981 | selected spans only |
| `game_ui` | 2 | 45 | UNREAD / inventory only |
| `game_ui_tile_info` | 1 | 556 | UNREAD / inventory only |
| `gamemode` | 2 | 74 | UNREAD / inventory only |
| `gamemode_tutorial` | 2 | 458 | selected spans only |
| `gates` | 2 | 643 | UNREAD / inventory only |
| `generic_factory` | 2 | 2,400 | UNREAD / inventory only |
| `get_version` | 1 | 5 | UNREAD / inventory only |
| `global_vars` | 1 | 73 | UNREAD / inventory only |
| `glyph_shelf_packer` | 2 | 153 | UNREAD / inventory only |
| `grab` | 1 | 436 | UNREAD / inventory only |
| `gun_mode` | 1 | 62 | UNREAD / inventory only |
| `handle_action` | 1 | 3,400 | UNREAD / inventory only |
| `handle_liquid` | 2 | 892 | UNREAD / inventory only |
| `harvest` | 2 | 486 | UNREAD / inventory only |
| `hash_utils` | 1 | 119 | UNREAD / inventory only |
| `help` | 2 | 673 | UNREAD / inventory only |
| `horde_entity` | 2 | 82 | UNREAD / inventory only |
| `horde_map` | 2 | 575 | UNREAD / inventory only |
| `iexamine` | 2 | 7,867 | UNREAD / inventory only |
| `iexamine_actors` | 2 | 577 | UNREAD / inventory only |
| `imgui_demo` | 2 | 172 | UNREAD / inventory only |
| `imgui_texture` | 1 | 66 | UNREAD / inventory only |
| `init` | 2 | 1,261 | selected spans only |
| `input` | 2 | 1,488 | UNREAD / inventory only |
| `input_context` | 2 | 2,143 | UNREAD / inventory only |
| `input_enums` | 1 | 167 | UNREAD / inventory only |
| `input_popup` | 2 | 583 | UNREAD / inventory only |
| `input_wait` | 2 | 117 | UNREAD / inventory only |
| `int_id` | 1 | 180 | UNREAD / inventory only |
| `inventory` | 2 | 267 | UNREAD / inventory only |
| `inventory_ui` | 2 | 6,801 | UNREAD / inventory only |
| `io_tags` | 1 | 31 | UNREAD / inventory only |
| `item` | 2 | 9,460 | UNREAD / inventory only |
| `item_action` | 2 | 512 | UNREAD / inventory only |
| `item_armor` | 1 | 1,600 | UNREAD / inventory only |
| `item_category` | 2 | 274 | UNREAD / inventory only |
| `item_components` | 2 | 250 | UNREAD / inventory only |
| `item_container` | 1 | 1,196 | UNREAD / inventory only |
| `item_contents` | 2 | 3,511 | UNREAD / inventory only |
| `item_degrade` | 1 | 1,489 | UNREAD / inventory only |
| `item_factory` | 2 | 5,818 | UNREAD / inventory only |
| `item_group` | 2 | 1,633 | UNREAD / inventory only |
| `item_gun_tool_ammo` | 1 | 4,562 | UNREAD / inventory only |
| `item_info` | 1 | 4,596 | UNREAD / inventory only |
| `item_location` | 2 | 1,954 | UNREAD / inventory only |
| `item_pocket` | 2 | 3,563 | UNREAD / inventory only |
| `item_search` | 2 | 389 | UNREAD / inventory only |
| `item_stack` | 2 | 241 | UNREAD / inventory only |
| `item_stack_use_charges` | 1 | 33 | UNREAD / inventory only |
| `item_tname` | 2 | 1,087 | UNREAD / inventory only |
| `item_transformation` | 2 | 197 | UNREAD / inventory only |
| `item_uid` | 2 | 99 | UNREAD / inventory only |
| `item_wakeup` | 2 | 755 | UNREAD / inventory only |
| `iteminfo_query` | 2 | 396 | UNREAD / inventory only |
| `itype` | 2 | 2,392 | UNREAD / inventory only |
| `iuse` | 2 | 9,455 | UNREAD / inventory only |
| `iuse_actor` | 2 | 7,337 | UNREAD / inventory only |
| `iuse_software` | 2 | 91 | UNREAD / inventory only |
| `iuse_software_kitten` | 2 | 385 | UNREAD / inventory only |
| `iuse_software_lightson` | 2 | 249 | UNREAD / inventory only |
| `iuse_software_minesweeper` | 2 | 371 | UNREAD / inventory only |
| `iuse_software_snake` | 2 | 271 | UNREAD / inventory only |
| `iuse_software_sokoban` | 2 | 467 | UNREAD / inventory only |
| `jmapgen_flags` | 1 | 28 | UNREAD / inventory only |
| `json` | 2 | 4,109 | UNREAD / inventory only |
| `json_error` | 1 | 17 | UNREAD / inventory only |
| `json_loader` | 2 | 202 | UNREAD / inventory only |
| `kill_tracker` | 2 | 178 | UNREAD / inventory only |
| `lang_stats` | 2 | 41 | UNREAD / inventory only |
| `level_cache` | 2 | 308 | UNREAD / inventory only |
| `lightmap` | 2 | 2,062 | UNREAD / inventory only |
| `line` | 2 | 1,445 | UNREAD / inventory only |
| `list` | 1 | 15 | UNREAD / inventory only |
| `live_view` | 2 | 113 | UNREAD / inventory only |
| `loading_ui` | 2 | 308 | UNREAD / inventory only |
| `localized_comparator` | 2 | 110 | UNREAD / inventory only |
| `lru_cache` | 1 | 88 | UNREAD / inventory only |
| `magic` | 2 | 4,974 | UNREAD / inventory only |
| `magic_enchantment` | 2 | 1,997 | UNREAD / inventory only |
| `magic_spell_effect` | 1 | 2,118 | UNREAD / inventory only |
| `magic_spell_effect_helpers` | 1 | 18 | UNREAD / inventory only |
| `magic_teleporter_list` | 2 | 275 | UNREAD / inventory only |
| `magic_ter_fur_transform` | 1 | 323 | UNREAD / inventory only |
| `magic_ter_furn_transform` | 1 | 93 | UNREAD / inventory only |
| `magic_type` | 2 | 209 | UNREAD / inventory only |
| `main` | 1 | 955 | UNREAD / inventory only |
| `main_menu` | 2 | 1,427 | UNREAD / inventory only |
| `map` | 2 | 15,267 | UNREAD / inventory only |
| `map_accessories` | 2 | 125 | UNREAD / inventory only |
| `map_entity_stack` | 2 | 518 | UNREAD / inventory only |
| `map_extras` | 2 | 1,536 | UNREAD / inventory only |
| `map_field` | 2 | 2,373 | UNREAD / inventory only |
| `map_helpers` | 2 | 232 | UNREAD / inventory only |
| `map_iterator` | 1 | 223 | UNREAD / inventory only |
| `map_memory` | 2 | 767 | UNREAD / inventory only |
| `map_scale_constants` | 1 | 53 | UNREAD / inventory only |
| `map_selector` | 2 | 207 | UNREAD / inventory only |
| `mapbuffer` | 2 | 549 | UNREAD / inventory only |
| `mapdata` | 2 | 2,698 | UNREAD / inventory only |
| `mapgen` | 2 | 8,569 | UNREAD / inventory only |
| `mapgen_functions` | 2 | 2,333 | UNREAD / inventory only |
| `mapgen_parameter` | 1 | 73 | UNREAD / inventory only |
| `mapgen_post_process` | 2 | 1,179 | UNREAD / inventory only |
| `mapgen_primitives` | 1 | 49 | UNREAD / inventory only |
| `mapgendata` | 2 | 624 | UNREAD / inventory only |
| `mapgenformat` | 2 | 154 | UNREAD / inventory only |
| `mapsharing` | 2 | 213 | UNREAD / inventory only |
| `maptile_fwd` | 1 | 12 | UNREAD / inventory only |
| `martialarts` | 2 | 3,068 | UNREAD / inventory only |
| `material` | 2 | 610 | UNREAD / inventory only |
| `math_defines` | 1 | 38 | UNREAD / inventory only |
| `math_parser` | 2 | 1,117 | UNREAD / inventory only |
| `math_parser_diag` | 2 | 2,035 | UNREAD / inventory only |
| `math_parser_diag_value` | 2 | 491 | UNREAD / inventory only |
| `math_parser_func` | 1 | 183 | UNREAD / inventory only |
| `math_parser_impl` | 1 | 363 | UNREAD / inventory only |
| `math_parser_jmath` | 2 | 126 | UNREAD / inventory only |
| `math_parser_lex` | 2 | 189 | UNREAD / inventory only |
| `math_parser_type` | 1 | 69 | UNREAD / inventory only |
| `mattack_actors` | 2 | 1,890 | UNREAD / inventory only |
| `mattack_common` | 1 | 67 | UNREAD / inventory only |
| `mdarray` | 1 | 122 | UNREAD / inventory only |
| `medical_ui` | 1 | 913 | UNREAD / inventory only |
| `melee` | 2 | 3,012 | UNREAD / inventory only |
| `memorial_logger` | 2 | 1,261 | UNREAD / inventory only |
| `memory_fast` | 1 | 25 | UNREAD / inventory only |
| `messages` | 2 | 1,245 | UNREAD / inventory only |
| `mingw.thread` | 1 | 146 | UNREAD / inventory only |
| `mission` | 2 | 1,487 | selected spans only |
| `mission_companion` | 2 | 3,065 | UNREAD / inventory only |
| `mission_place` | 1 | 16 | UNREAD / inventory only |
| `mission_start` | 1 | 333 | UNREAD / inventory only |
| `mission_ui` | 1 | 503 | UNREAD / inventory only |
| `mission_util` | 1 | 540 | UNREAD / inventory only |
| `missiondef` | 1 | 256 | UNREAD / inventory only |
| `mmap_file` | 2 | 472 | UNREAD / inventory only |
| `mod_manager` | 2 | 758 | UNREAD / inventory only |
| `mod_manager_ui` | 1 | 285 | UNREAD / inventory only |
| `mod_tileset` | 2 | 98 | UNREAD / inventory only |
| `mod_tracker` | 1 | 86 | UNREAD / inventory only |
| `monattack` | 2 | 4,786 | UNREAD / inventory only |
| `mondeath` | 2 | 328 | UNREAD / inventory only |
| `mondefense` | 2 | 233 | UNREAD / inventory only |
| `monexamine` | 2 | 1,067 | UNREAD / inventory only |
| `monfaction` | 2 | 318 | UNREAD / inventory only |
| `mongroup` | 2 | 910 | UNREAD / inventory only |
| `monmove` | 1 | 2,957 | UNREAD / inventory only |
| `monster` | 2 | 5,145 | UNREAD / inventory only |
| `monster_oracle` | 2 | 159 | UNREAD / inventory only |
| `monstergenerator` | 2 | 1,812 | UNREAD / inventory only |
| `mood_face` | 2 | 192 | UNREAD / inventory only |
| `morale` | 2 | 1,384 | UNREAD / inventory only |
| `morale_types` | 2 | 109 | UNREAD / inventory only |
| `move_mode` | 2 | 371 | UNREAD / inventory only |
| `mtype` | 2 | 1,246 | UNREAD / inventory only |
| `music` | 2 | 130 | UNREAD / inventory only |
| `mutation` | 2 | 3,352 | UNREAD / inventory only |
| `mutation_data` | 1 | 1,179 | UNREAD / inventory only |
| `mutation_type` | 1 | 63 | UNREAD / inventory only |
| `mutation_ui` | 1 | 684 | UNREAD / inventory only |
| `ncurses_def` | 1 | 646 | UNREAD / inventory only |
| `newcharacter` | 1 | 3,882 | UNREAD / inventory only |
| `npc` | 2 | 6,292 | UNREAD / inventory only |
| `npc_arbitration` | 2 | 762 | UNREAD / inventory only |
| `npc_attack` | 2 | 1,028 | UNREAD / inventory only |
| `npc_class` | 2 | 758 | UNREAD / inventory only |
| `npc_decision_category` | 1 | 18 | UNREAD / inventory only |
| `npc_favor` | 1 | 36 | UNREAD / inventory only |
| `npc_opinion` | 1 | 43 | UNREAD / inventory only |
| `npc_sleep` | 2 | 281 | UNREAD / inventory only |
| `npc_trip` | 2 | 418 | UNREAD / inventory only |
| `npcmove` | 1 | 7,842 | selected spans only |
| `npctalk` | 2 | 9,812 | selected spans only |
| `npctalk_funcs` | 1 | 1,421 | UNREAD / inventory only |
| `npctalk_rules` | 2 | 513 | UNREAD / inventory only |
| `npctrade` | 2 | 450 | UNREAD / inventory only |
| `npctrade_utils` | 2 | 218 | UNREAD / inventory only |
| `ofstream_wrapper` | 1 | 45 | UNREAD / inventory only |
| `omdata` | 1 | 1,356 | UNREAD / inventory only |
| `options` | 2 | 4,970 | UNREAD / inventory only |
| `ordered_static_globals` | 2 | 19 | UNREAD / inventory only |
| `output` | 2 | 4,306 | UNREAD / inventory only |
| `overlay_ordering` | 2 | 65 | UNREAD / inventory only |
| `overmap` | 2 | 5,097 | UNREAD / inventory only |
| `overmap_city` | 1 | 559 | UNREAD / inventory only |
| `overmap_connection` | 2 | 254 | UNREAD / inventory only |
| `overmap_debug` | 2 | 152 | UNREAD / inventory only |
| `overmap_highway` | 1 | 1,166 | UNREAD / inventory only |
| `overmap_location` | 2 | 160 | UNREAD / inventory only |
| `overmap_map_data_cache` | 2 | 134 | UNREAD / inventory only |
| `overmap_noise` | 2 | 142 | UNREAD / inventory only |
| `overmap_special` | 1 | 436 | UNREAD / inventory only |
| `overmap_special_fixed` | 1 | 324 | UNREAD / inventory only |
| `overmap_special_mutable` | 1 | 961 | UNREAD / inventory only |
| `overmap_terrain` | 1 | 1,045 | UNREAD / inventory only |
| `overmap_types` | 1 | 19 | UNREAD / inventory only |
| `overmap_ui` | 2 | 3,177 | UNREAD / inventory only |
| `overmap_water` | 1 | 791 | UNREAD / inventory only |
| `overmap_worldgen` | 2 | 601 | UNREAD / inventory only |
| `overmapbuffer` | 2 | 3,167 | UNREAD / inventory only |
| `panels` | 2 | 1,048 | selected spans only |
| `past_achievements_info` | 2 | 121 | UNREAD / inventory only |
| `past_games_info` | 2 | 273 | UNREAD / inventory only |
| `path_info` | 2 | 734 | UNREAD / inventory only |
| `pathfinding` | 2 | 1,459 | UNREAD / inventory only |
| `perf` | 2 | 96 | UNREAD / inventory only |
| `pickup` | 2 | 651 | UNREAD / inventory only |
| `pimpl` | 1 | 79 | UNREAD / inventory only |
| `pinyin` | 2 | 105 | UNREAD / inventory only |
| `pixel_minimap` | 2 | 394 | UNREAD / inventory only |
| `pixel_minimap_geometry` | 2 | 99 | UNREAD / inventory only |
| `pixel_minimap_projectors` | 2 | 125 | UNREAD / inventory only |
| `platform_win` | 1 | 29 | UNREAD / inventory only |
| `player_activity` | 2 | 738 | UNREAD / inventory only |
| `player_difficulty` | 2 | 623 | UNREAD / inventory only |
| `player_display` | 1 | 1,978 | UNREAD / inventory only |
| `player_hardcoded_effects` | 1 | 1,772 | UNREAD / inventory only |
| `pocket_type` | 1 | 26 | UNREAD / inventory only |
| `point` | 2 | 739 | UNREAD / inventory only |
| `point_traits` | 1 | 57 | UNREAD / inventory only |
| `popup` | 2 | 739 | UNREAD / inventory only |
| `power_network` | 2 | 249 | UNREAD / inventory only |
| `printf_converter` | 1 | 46 | UNREAD / inventory only |
| `profession` | 2 | 1,284 | UNREAD / inventory only |
| `profession_group` | 2 | 91 | UNREAD / inventory only |
| `proficiency` | 2 | 981 | UNREAD / inventory only |
| `proficiency_ui` | 1 | 429 | UNREAD / inventory only |
| `projectile` | 2 | 384 | UNREAD / inventory only |
| `ranged` | 2 | 4,774 | UNREAD / inventory only |
| `recipe` | 2 | 2,870 | UNREAD / inventory only |
| `recipe_dictionary` | 2 | 1,210 | UNREAD / inventory only |
| `recipe_groups` | 2 | 247 | UNREAD / inventory only |
| `rect_range` | 1 | 63 | UNREAD / inventory only |
| `regional_settings` | 2 | 1,543 | UNREAD / inventory only |
| `relic` | 2 | 1,229 | UNREAD / inventory only |
| `requirements` | 2 | 2,398 | UNREAD / inventory only |
| `ret_val` | 1 | 127 | UNREAD / inventory only |
| `rng` | 2 | 461 | selected spans only |
| `rotatable_symbols` | 2 | 129 | UNREAD / inventory only |
| `safe_reference` | 2 | 111 | UNREAD / inventory only |
| `safemode_ui` | 2 | 1,005 | UNREAD / inventory only |
| `savegame` | 1 | 2,162 | selected spans only |
| `savegame_json` | 1 | 5,587 | UNREAD / inventory only |
| `savegame_legacy` | 1 | 247 | UNREAD / inventory only |
| `scenario` | 2 | 958 | UNREAD / inventory only |
| `scent_block` | 2 | 127 | UNREAD / inventory only |
| `scent_map` | 2 | 415 | UNREAD / inventory only |
| `scores_ui` | 2 | 378 | UNREAD / inventory only |
| `sdl_font` | 2 | 983 | UNREAD / inventory only |
| `sdl_gamepad` | 2 | 903 | UNREAD / inventory only |
| `sdl_geometry` | 2 | 68 | UNREAD / inventory only |
| `sdl_quad_batch` | 2 | 224 | UNREAD / inventory only |
| `sdl_renderer_recovery` | 1 | 628 | UNREAD / inventory only |
| `sdl_utils` | 2 | 310 | UNREAD / inventory only |
| `sdl_version_wrappers` | 1 | 33 | UNREAD / inventory only |
| `sdl_wrappers` | 2 | 1,752 | UNREAD / inventory only |
| `sdlsound` | 2 | 897 | UNREAD / inventory only |
| `sdltiles` | 2 | 7,793 | UNREAD / inventory only |
| `sets_intersect` | 1 | 30 | UNREAD / inventory only |
| `shader_tint_self_test` | 2 | 238 | UNREAD / inventory only |
| `shadowcasting` | 2 | 829 | UNREAD / inventory only |
| `shearing` | 2 | 138 | UNREAD / inventory only |
| `shop_cons_rate` | 2 | 370 | UNREAD / inventory only |
| `simple_pathfinding` | 2 | 661 | UNREAD / inventory only |
| `simplexnoise` | 2 | 768 | UNREAD / inventory only |
| `skill` | 2 | 1,047 | UNREAD / inventory only |
| `skill_ui` | 2 | 64 | UNREAD / inventory only |
| `sleep` | 2 | 465 | UNREAD / inventory only |
| `smart_controller_ui` | 2 | 258 | UNREAD / inventory only |
| `smooth_lighting` | 2 | 1,633 | UNREAD / inventory only |
| `sound_backend` | 1 | 94 | UNREAD / inventory only |
| `sound_backend_sdl3` | 1 | 634 | UNREAD / inventory only |
| `sounds` | 2 | 2,316 | UNREAD / inventory only |
| `speech` | 2 | 62 | UNREAD / inventory only |
| `speed_description` | 2 | 139 | UNREAD / inventory only |
| `start_location` | 2 | 807 | UNREAD / inventory only |
| `stats_tracker` | 2 | 620 | UNREAD / inventory only |
| `std_hash_fs_path` | 1 | 17 | UNREAD / inventory only |
| `stomach` | 2 | 782 | UNREAD / inventory only |
| `string_editor_window` | 2 | 631 | UNREAD / inventory only |
| `string_formatter` | 2 | 77 | UNREAD / inventory only |
| `string_id` | 2 | 444 | UNREAD / inventory only |
| `string_id_null_ids` | 1 | 125 | UNREAD / inventory only |
| `string_id_utils` | 1 | 48 | UNREAD / inventory only |
| `string_input_popup` | 2 | 1,017 | UNREAD / inventory only |
| `study_zone_ui` | 2 | 334 | UNREAD / inventory only |
| `subbodypart` | 2 | 216 | UNREAD / inventory only |
| `submap` | 2 | 968 | UNREAD / inventory only |
| `suffer` | 1 | 2,160 | UNREAD / inventory only |
| `surroundings_menu` | 2 | 1,791 | UNREAD / inventory only |
| `system_locale` | 2 | 214 | UNREAD / inventory only |
| `talker` | 1 | 944 | UNREAD / inventory only |
| `talker_avatar` | 2 | 175 | UNREAD / inventory only |
| `talker_character` | 2 | 1,831 | UNREAD / inventory only |
| `talker_furniture` | 2 | 139 | UNREAD / inventory only |
| `talker_item` | 2 | 301 | UNREAD / inventory only |
| `talker_monster` | 2 | 386 | UNREAD / inventory only |
| `talker_npc` | 2 | 1,064 | UNREAD / inventory only |
| `talker_topic` | 2 | 64 | UNREAD / inventory only |
| `talker_vehicle` | 2 | 296 | UNREAD / inventory only |
| `talker_zone` | 2 | 65 | UNREAD / inventory only |
| `teleport` | 2 | 546 | UNREAD / inventory only |
| `temp_crafting_inventory` | 2 | 678 | UNREAD / inventory only |
| `terminal_layout` | 2 | 182 | UNREAD / inventory only |
| `test_data` | 2 | 407 | UNREAD / inventory only |
| `text` | 2 | 566 | UNREAD / inventory only |
| `text_snippets` | 2 | 548 | UNREAD / inventory only |
| `text_style_check` | 1 | 209 | UNREAD / inventory only |
| `text_style_check_reader` | 1 | 73 | UNREAD / inventory only |
| `tgz_archiver` | 2 | 171 | UNREAD / inventory only |
| `tile_tint` | 2 | 95 | UNREAD / inventory only |
| `tileray` | 2 | 233 | UNREAD / inventory only |
| `tileset_loader` | 2 | 1,446 | UNREAD / inventory only |
| `timed_event` | 2 | 615 | UNREAD / inventory only |
| `to_string_id` | 1 | 24 | UNREAD / inventory only |
| `touch_joystick` | 2 | 151 | UNREAD / inventory only |
| `trade_ui` | 2 | 499 | UNREAD / inventory only |
| `trait_group` | 2 | 512 | UNREAD / inventory only |
| `translation` | 2 | 693 | UNREAD / inventory only |
| `translation_cache` | 1 | 115 | UNREAD / inventory only |
| `translation_document` | 2 | 287 | UNREAD / inventory only |
| `translation_gendered` | 2 | 95 | UNREAD / inventory only |
| `translation_manager` | 2 | 98 | UNREAD / inventory only |
| `translation_manager_impl` | 2 | 282 | UNREAD / inventory only |
| `translation_plural_evaluator` | 2 | 592 | UNREAD / inventory only |
| `translations` | 2 | 253 | UNREAD / inventory only |
| `trap` | 2 | 859 | UNREAD / inventory only |
| `trapfunc` | 1 | 1,807 | UNREAD / inventory only |
| `try_parse_integer` | 2 | 125 | UNREAD / inventory only |
| `turret` | 1 | 863 | UNREAD / inventory only |
| `type_id` | 1 | 436 | UNREAD / inventory only |
| `ui_extended_description` | 2 | 323 | UNREAD / inventory only |
| `ui_helpers` | 2 | 63 | UNREAD / inventory only |
| `ui_iteminfo` | 2 | 129 | UNREAD / inventory only |
| `ui_manager` | 2 | 922 | UNREAD / inventory only |
| `ui_style_picker` | 2 | 57 | UNREAD / inventory only |
| `uilist` | 2 | 2,107 | UNREAD / inventory only |
| `uistate` | 1 | 326 | UNREAD / inventory only |
| `unicode` | 2 | 483 | UNREAD / inventory only |
| `units` | 2 | 1,695 | UNREAD / inventory only |
| `units_fwd` | 1 | 85 | UNREAD / inventory only |
| `units_utility` | 2 | 635 | UNREAD / inventory only |
| `value_ptr` | 1 | 227 | UNREAD / inventory only |
| `veh_appliance` | 2 | 910 | UNREAD / inventory only |
| `veh_interact` | 2 | 3,368 | UNREAD / inventory only |
| `veh_shape` | 2 | 314 | UNREAD / inventory only |
| `veh_type` | 2 | 2,347 | UNREAD / inventory only |
| `veh_utils` | 2 | 683 | UNREAD / inventory only |
| `vehicle` | 2 | 11,970 | UNREAD / inventory only |
| `vehicle_autodrive` | 1 | 1,557 | UNREAD / inventory only |
| `vehicle_display` | 1 | 621 | UNREAD / inventory only |
| `vehicle_group` | 2 | 453 | UNREAD / inventory only |
| `vehicle_move` | 1 | 2,591 | UNREAD / inventory only |
| `vehicle_part` | 1 | 845 | UNREAD / inventory only |
| `vehicle_part_location` | 2 | 93 | UNREAD / inventory only |
| `vehicle_selector` | 2 | 150 | UNREAD / inventory only |
| `vehicle_use` | 1 | 3,025 | UNREAD / inventory only |
| `version` | 1 | 18 | UNREAD / inventory only |
| `viewer` | 1 | 22 | UNREAD / inventory only |
| `visitable` | 2 | 1,683 | UNREAD / inventory only |
| `vitamin` | 2 | 308 | UNREAD / inventory only |
| `vpart_position` | 1 | 206 | UNREAD / inventory only |
| `vpart_range` | 1 | 214 | UNREAD / inventory only |
| `wcwidth` | 2 | 194 | UNREAD / inventory only |
| `weakpoint` | 2 | 1,014 | UNREAD / inventory only |
| `weather` | 2 | 1,491 | UNREAD / inventory only |
| `weather_gen` | 2 | 497 | UNREAD / inventory only |
| `weather_type` | 2 | 347 | UNREAD / inventory only |
| `weighted_dbl_or_var_list` | 1 | 287 | UNREAD / inventory only |
| `weighted_list` | 1 | 342 | UNREAD / inventory only |
| `widget` | 2 | 2,453 | UNREAD / inventory only |
| `wincurse` | 1 | 841 | UNREAD / inventory only |
| `wish` | 1 | 1,546 | UNREAD / inventory only |
| `worldfactory` | 2 | 2,686 | UNREAD / inventory only |
| `wound` | 2 | 696 | UNREAD / inventory only |
| `zone_manager_ui` | 1 | 874 | UNREAD / inventory only |
| `zzip` | 2 | 1,451 | UNREAD / inventory only |
| `zzip_stack` | 2 | 514 | UNREAD / inventory only |

### Source and content directory census

Every tracked file is counted once by its containing directory. Presence is verified; unlisted semantics remain unread. Full path/blob manifests remain privately in `extract/cdda-git-tree.txt`.

| Directory | Tracked files |
|---|---:|
| `.` | 29 |
| `.devcontainer` | 2 |
| `.devcontainer/cross-compile` | 3 |
| `.devcontainer/graphical` | 2 |
| `.github` | 5 |
| `.github/ISSUE_TEMPLATE` | 3 |
| `.github/actions/build-sdl3-shaders` | 1 |
| `.github/actions/setup-sdl3-stack` | 1 |
| `.github/vcpkg_triplets` | 4 |
| `.github/workflows` | 35 |
| `.tx` | 1 |
| `.vscode` | 3 |
| `CMakeModules` | 3 |
| `CMakeModules/Find` | 2 |
| `android` | 6 |
| `android/app` | 2 |
| `android/app/jni` | 1 |
| `android/app/src/experimental/res/drawable` | 2 |
| `android/app/src/experimental/res/drawable-hdpi` | 1 |
| `android/app/src/experimental/res/drawable-mdpi` | 1 |
| `android/app/src/experimental/res/drawable-xhdpi` | 1 |
| `android/app/src/experimental/res/drawable-xxhdpi` | 1 |
| `android/app/src/experimental/res/drawable-xxxhdpi` | 1 |
| `android/app/src/experimental/res/values` | 3 |
| `android/app/src/main` | 1 |
| `android/app/src/main/assets` | 2 |
| `android/app/src/main/assets/lang` | 1 |
| `android/app/src/main/java/com/cleverraven/cataclysmdda` | 5 |
| `android/app/src/main/res/drawable` | 2 |
| `android/app/src/main/res/drawable-hdpi` | 1 |
| `android/app/src/main/res/drawable-mdpi` | 1 |
| `android/app/src/main/res/drawable-xhdpi` | 1 |
| `android/app/src/main/res/drawable-xxhdpi` | 1 |
| `android/app/src/main/res/drawable-xxxhdpi` | 1 |
| `android/app/src/main/res/values` | 3 |
| `android/app/src/main/res/values-de` | 1 |
| `android/app/src/main/res/values-es-rAR` | 1 |
| `android/app/src/main/res/values-es-rES` | 1 |
| `android/app/src/main/res/values-fr` | 1 |
| `android/app/src/main/res/values-in` | 1 |
| `android/app/src/main/res/values-it-rIT` | 1 |
| `android/app/src/main/res/values-ja` | 1 |
| `android/app/src/main/res/values-pl` | 1 |
| `android/app/src/main/res/values-pt-rBR` | 1 |
| `android/app/src/main/res/values-ru` | 1 |
| `android/app/src/main/res/values-tr` | 1 |
| `android/app/src/main/res/values-uk-rUA` | 1 |
| `android/app/src/main/res/values-zh-rCN` | 1 |
| `android/app/src/main/res/values-zh-rTW` | 1 |
| `android/gradle/wrapper` | 2 |
| `build-data/osx` | 8 |
| `build-data/osx/AppIcon.iconset` | 10 |
| `build-data/web` | 1 |
| `build-scripts` | 29 |
| `build-scripts/problem-matchers` | 3 |
| `data` | 5 |
| `data/core` | 8 |
| `data/credits` | 1 |
| `data/font` | 6 |
| `data/json` | 77 |
| `data/json/artifact` | 6 |
| `data/json/ascii_art` | 4 |
| `data/json/ascii_art/ammo` | 52 |
| `data/json/ascii_art/containers` | 1 |
| `data/json/ascii_art/vehicle` | 1 |
| `data/json/bodypart_graphs` | 9 |
| `data/json/construction` | 32 |
| `data/json/debug` | 2 |
| `data/json/effects_on_condition` | 19 |
| `data/json/effects_on_condition/comestible_eocs` | 2 |
| `data/json/effects_on_condition/mapgen_eocs` | 4 |
| `data/json/effects_on_condition/medicine_eocs` | 9 |
| `data/json/effects_on_condition/mutation_eocs` | 4 |
| `data/json/effects_on_condition/nether_eocs` | 14 |
| `data/json/effects_on_condition/npc_eocs` | 10 |
| `data/json/encounters` | 3 |
| `data/json/faults` | 17 |
| `data/json/fields` | 1 |
| `data/json/flags` | 2 |
| `data/json/furniture_and_terrain` | 74 |
| `data/json/furniture_and_terrain/netherum` | 9 |
| `data/json/furniture_and_terrain/special_use` | 3 |
| `data/json/itemgroups` | 36 |
| `data/json/itemgroups/Agriculture_Forage_Excavation` | 2 |
| `data/json/itemgroups/Clothing_Gear` | 13 |
| `data/json/itemgroups/Drugs_Tobacco_Alcohol` | 5 |
| `data/json/itemgroups/Food` | 15 |
| `data/json/itemgroups/Highlands` | 1 |
| `data/json/itemgroups/Labs` | 3 |
| `data/json/itemgroups/Locations_MapExtras` | 13 |
| `data/json/itemgroups/Monsters_Animals_Lairs` | 4 |
| `data/json/itemgroups/SUS` | 16 |
| `data/json/itemgroups/Weapons_Mods_Ammo` | 11 |
| `data/json/itemgroups/Weapons_Mods_Ammo/ammo` | 3 |
| `data/json/itemgroups/Weapons_Mods_Ammo/arsenal` | 32 |
| `data/json/itemgroups/Weapons_Mods_Ammo/conversions` | 3 |
| `data/json/itemgroups/Weapons_Mods_Ammo/magazines` | 3 |
| `data/json/itemgroups/netherum` | 3 |
| `data/json/items` | 26 |
| `data/json/items/ammo` | 63 |
| `data/json/items/appliances` | 2 |
| `data/json/items/armor` | 47 |
| `data/json/items/armor/bespoke_armor` | 10 |
| `data/json/items/book` | 44 |
| `data/json/items/classes` | 3 |
| `data/json/items/comestibles` | 37 |
| `data/json/items/containers` | 7 |
| `data/json/items/corpses` | 5 |
| `data/json/items/furniture` | 3 |
| `data/json/items/generic` | 12 |
| `data/json/items/gun` | 65 |
| `data/json/items/gunmod` | 14 |
| `data/json/items/magazine` | 44 |
| `data/json/items/melee` | 6 |
| `data/json/items/netherum` | 8 |
| `data/json/items/ranged` | 10 |
| `data/json/items/relics` | 5 |
| `data/json/items/resources` | 13 |
| `data/json/items/tool` | 38 |
| `data/json/items/vehicle` | 27 |
| `data/json/mapgen` | 275 |
| `data/json/mapgen/abandoned_textile_mill` | 2 |
| `data/json/mapgen/aircraft_carrier` | 7 |
| `data/json/mapgen/airport` | 2 |
| `data/json/mapgen/alien_meadow` | 1 |
| `data/json/mapgen/apartment_complex` | 4 |
| `data/json/mapgen/balthazar_fac` | 1 |
| `data/json/mapgen/balthazar_fac/nested` | 1 |
| `data/json/mapgen/basecamps` | 1 |
| `data/json/mapgen/basecamps/base/bare_bones_basecamp` | 1 |
| `data/json/mapgen/basecamps/base/fbmc_fire_lookout_tower` | 3 |
| `data/json/mapgen/basecamps/base/fbmc_helipad` | 2 |
| `data/json/mapgen/basecamps/base/fbmc_lighthouse` | 1 |
| `data/json/mapgen/basecamps/base/fbmc_lightindustry` | 5 |
| `data/json/mapgen/basecamps/base/fbmc_mansion` | 7 |
| `data/json/mapgen/basecamps/base/fbmc_outpost` | 1 |
| `data/json/mapgen/basecamps/base/fbmc_pottery_cottage` | 2 |
| `data/json/mapgen/basecamps/base/fbmc_radio_tower` | 3 |
| `data/json/mapgen/basecamps/base/fbmc_sealab_small` | 1 |
| `data/json/mapgen/basecamps/base/modular_firestation_1` | 2 |
| `data/json/mapgen/basecamps/base/modular_hub/version_1` | 6 |
| `data/json/mapgen/basecamps/base/modular_hub/version_2` | 4 |
| `data/json/mapgen/basecamps/base/modular_shelter` | 2 |
| `data/json/mapgen/basecamps/base/modular_shelter_1` | 2 |
| `data/json/mapgen/basecamps/base/modular_shelter_2` | 2 |
| `data/json/mapgen/basecamps/expansion/modular_canteen/version_1` | 3 |
| `data/json/mapgen/basecamps/expansion/modular_canteen/version_2` | 3 |
| `data/json/mapgen/basecamps/expansion/modular_farm/version_1` | 1 |
| `data/json/mapgen/basecamps/expansion/modular_farm/version_2` | 1 |
| `data/json/mapgen/basecamps/expansion/modular_garage/version_1` | 1 |
| `data/json/mapgen/basecamps/expansion/modular_garage/version_2` | 3 |
| `data/json/mapgen/basecamps/expansion/modular_livestock/version_1` | 3 |
| `data/json/mapgen/basecamps/expansion/modular_livestock/version_2` | 3 |
| `data/json/mapgen/basecamps/expansion/modular_saltworks/version_1` | 3 |
| `data/json/mapgen/basecamps/expansion/modular_storehouse/version_1` | 3 |
| `data/json/mapgen/basecamps/expansion/modular_storehouse/version_2` | 4 |
| `data/json/mapgen/basecamps/expansion/modular_workshop/version_1` | 3 |
| `data/json/mapgen/basecamps/expansion/modular_workshop/version_2` | 3 |
| `data/json/mapgen/basement` | 9 |
| `data/json/mapgen/basic` | 2 |
| `data/json/mapgen/bugs` | 6 |
| `data/json/mapgen/campus/buildings` | 21 |
| `data/json/mapgen/campus/open_areas` | 2 |
| `data/json/mapgen/chemist_holdout` | 1 |
| `data/json/mapgen/city_blocks` | 4 |
| `data/json/mapgen/container_yard` | 2 |
| `data/json/mapgen/convention_center` | 2 |
| `data/json/mapgen/deserter_city` | 3 |
| `data/json/mapgen/dummy` | 1 |
| `data/json/mapgen/exodii` | 6 |
| `data/json/mapgen/fema` | 2 |
| `data/json/mapgen/fortified_scrap_yard` | 1 |
| `data/json/mapgen/fungal` | 4 |
| `data/json/mapgen/gas_stations` | 2 |
| `data/json/mapgen/godco` | 3 |
| `data/json/mapgen/hells_raiders` | 5 |
| `data/json/mapgen/highlands` | 7 |
| `data/json/mapgen/highway` | 1 |
| `data/json/mapgen/highway/specials` | 8 |
| `data/json/mapgen/house` | 156 |
| `data/json/mapgen/isherwood_farms` | 4 |
| `data/json/mapgen/isolated_road` | 2 |
| `data/json/mapgen/lab` | 1 |
| `data/json/mapgen/lab/lab_modular` | 14 |
| `data/json/mapgen/lab/lab_modular/lab_nests_modular` | 11 |
| `data/json/mapgen/lab/lab_surface` | 6 |
| `data/json/mapgen/lake_buildings` | 7 |
| `data/json/mapgen/mall` | 5 |
| `data/json/mapgen/map_extras` | 46 |
| `data/json/mapgen/mi-go` | 4 |
| `data/json/mapgen/microlab` | 17 |
| `data/json/mapgen/microlab/microlab_distorted` | 3 |
| `data/json/mapgen/microlab/microlab_meat` | 1 |
| `data/json/mapgen/microlab/microlab_portal` | 3 |
| `data/json/mapgen/microlab/microlab_ratkin` | 1 |
| `data/json/mapgen/military/mil_base` | 6 |
| `data/json/mapgen/militia` | 1 |
| `data/json/mapgen/mine` | 6 |
| `data/json/mapgen/miniature_railway` | 1 |
| `data/json/mapgen/mobile_home_park` | 3 |
| `data/json/mapgen/nested` | 34 |
| `data/json/mapgen/nether_monster_corpse` | 5 |
| `data/json/mapgen/netherum` | 30 |
| `data/json/mapgen/nuclear_plant` | 9 |
| `data/json/mapgen/occupied_lumber_mill` | 1 |
| `data/json/mapgen/oil_platform` | 11 |
| `data/json/mapgen/portal_storm_dungeon` | 2 |
| `data/json/mapgen/prison` | 3 |
| `data/json/mapgen/refugee_center` | 4 |
| `data/json/mapgen/reverberations` | 6 |
| `data/json/mapgen/riverside` | 3 |
| `data/json/mapgen/robofaq_locs` | 5 |
| `data/json/mapgen/sand_pit` | 1 |
| `data/json/mapgen/scarlet_sea` | 1 |
| `data/json/mapgen/scenario` | 1 |
| `data/json/mapgen/steel_mill` | 3 |
| `data/json/mapgen/store` | 8 |
| `data/json/mapgen/string_dimension` | 7 |
| `data/json/mapgen/triffid` | 7 |
| `data/json/mapgen/vitrification` | 2 |
| `data/json/mapgen_palettes` | 108 |
| `data/json/mapgen_palettes/campus` | 1 |
| `data/json/mapgen_palettes/exodii` | 2 |
| `data/json/mapgen_palettes/lab` | 1 |
| `data/json/mapgen_palettes/military` | 1 |
| `data/json/mapgen_palettes/militia` | 1 |
| `data/json/mapgen_palettes/netherum` | 2 |
| `data/json/monster_special_attacks` | 10 |
| `data/json/monster_weakpoints` | 16 |
| `data/json/monsterdrops` | 26 |
| `data/json/monstergroups` | 27 |
| `data/json/monstergroups/netherum` | 3 |
| `data/json/monsters` | 70 |
| `data/json/monsters/netherum` | 1 |
| `data/json/mutations` | 27 |
| `data/json/npcs` | 50 |
| `data/json/npcs/Backgrounds` | 60 |
| `data/json/npcs/Backgrounds/OtherSurvivorStories` | 6 |
| `data/json/npcs/EOC_talkers` | 5 |
| `data/json/npcs/Kindred` | 3 |
| `data/json/npcs/Lighthouse_Family` | 5 |
| `data/json/npcs/balthazar_fac` | 4 |
| `data/json/npcs/bunker_shop` | 4 |
| `data/json/npcs/cabin_chemist` | 4 |
| `data/json/npcs/campus` | 7 |
| `data/json/npcs/civilians` | 1 |
| `data/json/npcs/common_chat` | 5 |
| `data/json/npcs/computers` | 7 |
| `data/json/npcs/exodii` | 15 |
| `data/json/npcs/exodii/netherum` | 5 |
| `data/json/npcs/exodii/string_dimension` | 1 |
| `data/json/npcs/godco` | 5 |
| `data/json/npcs/godco/members` | 22 |
| `data/json/npcs/godco/visitors` | 2 |
| `data/json/npcs/hells_raiders` | 2 |
| `data/json/npcs/holdouts` | 7 |
| `data/json/npcs/isherwood_farm` | 11 |
| `data/json/npcs/island_prison` | 1 |
| `data/json/npcs/isolated_road` | 10 |
| `data/json/npcs/lumbermill_employees` | 5 |
| `data/json/npcs/militia` | 2 |
| `data/json/npcs/mine` | 1 |
| `data/json/npcs/old_guard` | 4 |
| `data/json/npcs/other` | 10 |
| `data/json/npcs/other/homeless` | 1 |
| `data/json/npcs/other/homeless/group_camp` | 5 |
| `data/json/npcs/portal_storm` | 1 |
| `data/json/npcs/prisoners` | 1 |
| `data/json/npcs/random_encounters` | 4 |
| `data/json/npcs/refugee_center` | 2 |
| `data/json/npcs/refugee_center/beggars` | 5 |
| `data/json/npcs/refugee_center/surface_refugees` | 19 |
| `data/json/npcs/refugee_center/surface_staff` | 9 |
| `data/json/npcs/refugee_center/surface_staff/Smokes` | 7 |
| `data/json/npcs/refugee_center/surface_visitors` | 5 |
| `data/json/npcs/robofac` | 7 |
| `data/json/npcs/robofac/robofac_ancilla_npcs` | 5 |
| `data/json/npcs/robofac/robofac_ancilla_npcs/BAR_ENCOUNTER_MERCENARIES` | 11 |
| `data/json/npcs/robofac/robofac_ancilla_npcs/CHOP_SHOP` | 3 |
| `data/json/npcs/robofac/robofac_ancilla_npcs/PAT` | 6 |
| `data/json/npcs/robofac/robofac_basement_npcs` | 4 |
| `data/json/npcs/robofac/robofac_intercom` | 4 |
| `data/json/npcs/scrap_trader` | 2 |
| `data/json/npcs/snippets` | 6 |
| `data/json/npcs/tacoma_ranch` | 18 |
| `data/json/npcs/tacoma_ranch/Nunez` | 3 |
| `data/json/npcs/xedra_field_stations` | 3 |
| `data/json/npcs/your_followers` | 4 |
| `data/json/obsoletion_and_migration_0.I` | 24 |
| `data/json/obsoletion_and_migration_0.J` | 28 |
| `data/json/overmap` | 8 |
| `data/json/overmap/overmap_mutable` | 22 |
| `data/json/overmap/overmap_special` | 17 |
| `data/json/overmap/overmap_special/lab_modular` | 2 |
| `data/json/overmap/overmap_terrain` | 59 |
| `data/json/proficiencies` | 18 |
| `data/json/recipes` | 12 |
| `data/json/recipes/ammo` | 9 |
| `data/json/recipes/appliances` | 1 |
| `data/json/recipes/armor` | 17 |
| `data/json/recipes/armor/bespoke_armor` | 2 |
| `data/json/recipes/basecamps` | 3 |
| `data/json/recipes/basecamps/base/fbmc_fire_lookout_tower` | 3 |
| `data/json/recipes/basecamps/base/fbmc_helipad` | 2 |
| `data/json/recipes/basecamps/base/fbmc_lighthouse` | 1 |
| `data/json/recipes/basecamps/base/fbmc_lightindustry` | 5 |
| `data/json/recipes/basecamps/base/fbmc_mansion` | 5 |
| `data/json/recipes/basecamps/base/fbmc_outpost` | 1 |
| `data/json/recipes/basecamps/base/fbmc_pottery_cottage` | 2 |
| `data/json/recipes/basecamps/base/fbmc_radio_tower` | 3 |
| `data/json/recipes/basecamps/base/fbmc_sealab_small` | 1 |
| `data/json/recipes/basecamps/base/recipe_bare_bones_basecamp` | 3 |
| `data/json/recipes/basecamps/base/recipe_modular_firestation_1` | 3 |
| `data/json/recipes/basecamps/base/recipe_modular_hub/version_1` | 5 |
| `data/json/recipes/basecamps/base/recipe_modular_hub/version_2` | 4 |
| `data/json/recipes/basecamps/base/recipe_modular_shelter` | 3 |
| `data/json/recipes/basecamps/base/recipe_modular_shelter_1` | 3 |
| `data/json/recipes/basecamps/base/recipe_modular_shelter_2` | 3 |
| `data/json/recipes/basecamps/expansion/recipe_modular_canteen/version_1` | 2 |
| `data/json/recipes/basecamps/expansion/recipe_modular_canteen/version_2` | 3 |
| `data/json/recipes/basecamps/expansion/recipe_modular_farm/version_1` | 1 |
| `data/json/recipes/basecamps/expansion/recipe_modular_farm/version_2` | 2 |
| `data/json/recipes/basecamps/expansion/recipe_modular_garage/version_1` | 1 |
| `data/json/recipes/basecamps/expansion/recipe_modular_garage/version_2` | 2 |
| `data/json/recipes/basecamps/expansion/recipe_modular_livestock/version_1` | 2 |
| `data/json/recipes/basecamps/expansion/recipe_modular_livestock/version_2` | 3 |
| `data/json/recipes/basecamps/expansion/recipe_modular_saltworks/version_1` | 2 |
| `data/json/recipes/basecamps/expansion/recipe_modular_storehouse/version_1` | 2 |
| `data/json/recipes/basecamps/expansion/recipe_modular_storehouse/version_2` | 3 |
| `data/json/recipes/basecamps/expansion/recipe_modular_workshop/version_1` | 2 |
| `data/json/recipes/basecamps/expansion/recipe_modular_workshop/version_2` | 3 |
| `data/json/recipes/chem` | 5 |
| `data/json/recipes/electronics` | 2 |
| `data/json/recipes/food` | 33 |
| `data/json/recipes/nests` | 1 |
| `data/json/recipes/other` | 11 |
| `data/json/recipes/practice` | 13 |
| `data/json/recipes/tools` | 6 |
| `data/json/recipes/weapon` | 7 |
| `data/json/region_settings/region_settings` | 2 |
| `data/json/region_settings/region_settings/dimensions` | 13 |
| `data/json/requirements` | 14 |
| `data/json/snippets` | 53 |
| `data/json/snippets/art` | 1 |
| `data/json/snippets/art/paintings_and_sketches` | 3 |
| `data/json/snippets/art/statues` | 2 |
| `data/json/snippets/netherum` | 3 |
| `data/json/ui` | 57 |
| `data/json/ui/spacebar` | 10 |
| `data/json/ui/structured` | 10 |
| `data/json/ui/zenfs` | 28 |
| `data/json/uncraft` | 4 |
| `data/json/uncraft/ammo` | 51 |
| `data/json/uncraft/appliances` | 3 |
| `data/json/uncraft/armor` | 13 |
| `data/json/uncraft/book` | 1 |
| `data/json/uncraft/cbm` | 1 |
| `data/json/uncraft/classes` | 1 |
| `data/json/uncraft/comestibles` | 3 |
| `data/json/uncraft/containers` | 2 |
| `data/json/uncraft/corpses` | 1 |
| `data/json/uncraft/furniture` | 2 |
| `data/json/uncraft/netherum` | 1 |
| `data/json/uncraft/resources` | 3 |
| `data/json/uncraft/tool` | 10 |
| `data/json/uncraft/vehicle` | 5 |
| `data/json/uncraft/weapon` | 5 |
| `data/json/vehicleparts` | 25 |
| `data/json/vehicles` | 15 |
| `data/mods` | 2 |
| `data/mods/Aftershock` | 1 |
| `data/mods/Backrooms` | 16 |
| `data/mods/Backrooms/region_settings` | 1 |
| `data/mods/Backrooms/region_settings/region_settings` | 1 |
| `data/mods/Backrooms/rooms` | 15 |
| `data/mods/BombasticPerks` | 4 |
| `data/mods/BombasticPerks/corefiles` | 3 |
| `data/mods/BombasticPerks/docs` | 2 |
| `data/mods/BombasticPerks/perkdata` | 55 |
| `data/mods/BombasticPerks/perkdata/metamagic` | 9 |
| `data/mods/BombasticPerks/perkdata/perk_regions_and_mapgen` | 1 |
| `data/mods/CrazyCataclysm` | 18 |
| `data/mods/CrazyCataclysm/mod_interactions/mindovermatter` | 1 |
| `data/mods/Defense_Mode` | 17 |
| `data/mods/Defense_Mode/dialogue` | 3 |
| `data/mods/Defense_Mode/effects_on_condition` | 4 |
| `data/mods/Defense_Mode/mapgen` | 6 |
| `data/mods/Defense_Mode/mod_interactions/DinoMod` | 2 |
| `data/mods/Defense_Mode/mod_interactions/Mythos-Creatures` | 1 |
| `data/mods/Defense_Mode/mod_interactions/aftershock` | 1 |
| `data/mods/Defense_Mode/mod_interactions/bombastic_perks` | 2 |
| `data/mods/Defense_Mode/mod_interactions/bombastic_perks/perkdata` | 3 |
| `data/mods/Defense_Mode/mod_interactions/magiclysm` | 1 |
| `data/mods/Defense_Mode/mod_interactions/megafauna` | 1 |
| `data/mods/Defense_Mode/mod_interactions/mindovermatter` | 2 |
| `data/mods/Defense_Mode/mod_interactions/my_sweet_cataclysm` | 1 |
| `data/mods/Defense_Mode/mod_interactions/xedra_evolved` | 1 |
| `data/mods/DinoMod` | 13 |
| `data/mods/DinoMod/NPC` | 14 |
| `data/mods/DinoMod/achievements` | 2 |
| `data/mods/DinoMod/items` | 18 |
| `data/mods/DinoMod/mapgen` | 11 |
| `data/mods/DinoMod/mapgen/map_extras` | 79 |
| `data/mods/DinoMod/mapgen/nested` | 3 |
| `data/mods/DinoMod/monster_special_attacks` | 5 |
| `data/mods/DinoMod/monstergroups` | 7 |
| `data/mods/DinoMod/monsters` | 11 |
| `data/mods/DinoMod/mutations` | 2 |
| `data/mods/DinoMod/obsolete` | 2 |
| `data/mods/DinoMod/overmap` | 4 |
| `data/mods/DinoMod/proficiencies` | 1 |
| `data/mods/DinoMod/recipes` | 13 |
| `data/mods/DinoMod/requirements` | 2 |
| `data/mods/DinoMod/snippets` | 4 |
| `data/mods/Generic_Guns` | 4 |
| `data/mods/Generic_Guns/ammo` | 18 |
| `data/mods/Generic_Guns/bandoliers` | 2 |
| `data/mods/Generic_Guns/firearms` | 12 |
| `data/mods/Generic_Guns/gunmods` | 3 |
| `data/mods/Generic_Guns/items` | 1 |
| `data/mods/Generic_Guns/magazines` | 10 |
| `data/mods/Generic_Guns/recipes` | 9 |
| `data/mods/Generic_Guns/robots` | 3 |
| `data/mods/Generic_Guns/uncraft/ammo` | 7 |
| `data/mods/Isolation-Protocol` | 10 |
| `data/mods/Isolation-Protocol/EOC` | 8 |
| `data/mods/Isolation-Protocol/Map` | 2 |
| `data/mods/Isolation-Protocol/Map/furniture-terrain` | 1 |
| `data/mods/Isolation-Protocol/Map/levels` | 6 |
| `data/mods/Isolation-Protocol/Map/mapgen` | 5 |
| `data/mods/Isolation-Protocol/Map/mapgen/palettes` | 1 |
| `data/mods/Isolation-Protocol/NPC` | 2 |
| `data/mods/Isolation-Protocol/Player` | 6 |
| `data/mods/Isolation-Protocol/Player/Perks` | 5 |
| `data/mods/Isolation-Protocol/item_groups` | 1 |
| `data/mods/Isolation-Protocol/items` | 3 |
| `data/mods/Isolation-Protocol/monsters/bossfights` | 1 |
| `data/mods/Isolation-Protocol/recipes` | 3 |
| `data/mods/Isolation-Protocol/region_settings` | 1 |
| `data/mods/Isolation-Protocol/region_settings/region_settings` | 1 |
| `data/mods/Isolation-Protocol/setting_blacklists` | 1 |
| `data/mods/Limb_WIP` | 9 |
| `data/mods/Limb_WIP/armor` | 3 |
| `data/mods/Limb_WIP/mod_interactions/mindovermatter` | 1 |
| `data/mods/Limb_WIP/mutation_eocs` | 2 |
| `data/mods/Limb_WIP/mutations` | 5 |
| `data/mods/MA` | 12 |
| `data/mods/MA/MA_overmap` | 1337 |
| `data/mods/MMA` | 14 |
| `data/mods/Magiclysm` | 37 |
| `data/mods/Magiclysm/Spells` | 26 |
| `data/mods/Magiclysm/Spells/attunements` | 30 |
| `data/mods/Magiclysm/achievements` | 3 |
| `data/mods/Magiclysm/effect_on_conditions` | 12 |
| `data/mods/Magiclysm/effect_on_conditions/spellcasting` | 7 |
| `data/mods/Magiclysm/effects` | 7 |
| `data/mods/Magiclysm/enchantments` | 3 |
| `data/mods/Magiclysm/furniture_and_terrain` | 7 |
| `data/mods/Magiclysm/itemgroups` | 8 |
| `data/mods/Magiclysm/items` | 53 |
| `data/mods/Magiclysm/items/vehicle` | 2 |
| `data/mods/Magiclysm/migration_and_obsoletion` | 8 |
| `data/mods/Magiclysm/mod_interactions/bombastic_perks` | 2 |
| `data/mods/Magiclysm/mod_interactions/bombastic_perks/perkdata` | 9 |
| `data/mods/Magiclysm/mod_interactions/defense_mode` | 6 |
| `data/mods/Magiclysm/mod_interactions/innawood` | 5 |
| `data/mods/Magiclysm/mod_interactions/innawood/mapgen` | 3 |
| `data/mods/Magiclysm/mod_interactions/innawood/overmap` | 1 |
| `data/mods/Magiclysm/mod_interactions/mindovermatter` | 1 |
| `data/mods/Magiclysm/mod_interactions/skyisland` | 1 |
| `data/mods/Magiclysm/mod_interactions/xedra_evolved` | 2 |
| `data/mods/Magiclysm/monsters` | 26 |
| `data/mods/Magiclysm/mutations` | 11 |
| `data/mods/Magiclysm/mutations/magic_classes` | 2 |
| `data/mods/Magiclysm/mutations/mutation_paths` | 3 |
| `data/mods/Magiclysm/npc` | 17 |
| `data/mods/Magiclysm/recipes` | 22 |
| `data/mods/Magiclysm/requirements` | 5 |
| `data/mods/Magiclysm/snippets` | 6 |
| `data/mods/Magiclysm/ter_fur_transform` | 2 |
| `data/mods/Magiclysm/ui` | 1 |
| `data/mods/Magiclysm/vehicleparts` | 2 |
| `data/mods/Magiclysm/vehicles` | 4 |
| `data/mods/Magiclysm/worldgen` | 29 |
| `data/mods/Magiclysm/worldgen/caves` | 1 |
| `data/mods/Magiclysm/worldgen/city_specials` | 2 |
| `data/mods/Magiclysm/worldgen/farms` | 2 |
| `data/mods/Magiclysm/worldgen/goblin_locations` | 3 |
| `data/mods/Magiclysm/worldgen/housing` | 1 |
| `data/mods/Magiclysm/worldgen/labs` | 1 |
| `data/mods/Magiclysm/worldgen/map_extras` | 1 |
| `data/mods/Magiclysm/worldgen/scenarios` | 1 |
| `data/mods/Megacity` | 4 |
| `data/mods/Megafauna` | 6 |
| `data/mods/Megafauna/furniture_and_terrain` | 1 |
| `data/mods/Megafauna/items` | 1 |
| `data/mods/Megafauna/items/tool` | 1 |
| `data/mods/Megafauna/mod_interactions/defense_mode` | 2 |
| `data/mods/Megafauna/monstergroups` | 3 |
| `data/mods/Megafauna/monsters` | 4 |
| `data/mods/Megafauna/proficiencies` | 1 |
| `data/mods/Megafauna/recipes` | 1 |
| `data/mods/MindOverMatter` | 27 |
| `data/mods/MindOverMatter/dimensions` | 2 |
| `data/mods/MindOverMatter/dimensions/mycus_world` | 7 |
| `data/mods/MindOverMatter/dimensions/shoggothed_world` | 4 |
| `data/mods/MindOverMatter/effectoncondition` | 23 |
| `data/mods/MindOverMatter/effects` | 11 |
| `data/mods/MindOverMatter/enchantments` | 5 |
| `data/mods/MindOverMatter/furniture_and_terrain` | 7 |
| `data/mods/MindOverMatter/itemgroups` | 14 |
| `data/mods/MindOverMatter/items` | 18 |
| `data/mods/MindOverMatter/items/armor` | 4 |
| `data/mods/MindOverMatter/items/clothing` | 1 |
| `data/mods/MindOverMatter/items/tools` | 5 |
| `data/mods/MindOverMatter/mapgen` | 4 |
| `data/mods/MindOverMatter/mapgen/biokinesis_mutation_lab` | 1 |
| `data/mods/MindOverMatter/mapgen/hospital_lab` | 5 |
| `data/mods/MindOverMatter/mapgen/map_extras` | 5 |
| `data/mods/MindOverMatter/mapgen/microlab_no_meat` | 1 |
| `data/mods/MindOverMatter/mapgen/nested` | 4 |
| `data/mods/MindOverMatter/mapgen/psi_surface_lab` | 7 |
| `data/mods/MindOverMatter/mapgen/rare_specials` | 1 |
| `data/mods/MindOverMatter/mapgen/skyscraper_lab` | 1 |
| `data/mods/MindOverMatter/mapgen/vanilla_extras` | 1 |
| `data/mods/MindOverMatter/mapgen_palettes` | 7 |
| `data/mods/MindOverMatter/mod_interactions/backrooms` | 2 |
| `data/mods/MindOverMatter/mod_interactions/bombastic_perks` | 5 |
| `data/mods/MindOverMatter/mod_interactions/bombastic_perks/perkdata` | 4 |
| `data/mods/MindOverMatter/mod_interactions/crazy_cataclysm` | 2 |
| `data/mods/MindOverMatter/mod_interactions/defense_mode` | 5 |
| `data/mods/MindOverMatter/mod_interactions/innawood` | 1 |
| `data/mods/MindOverMatter/mod_interactions/magiclysm` | 3 |
| `data/mods/MindOverMatter/mod_interactions/skyisland` | 1 |
| `data/mods/MindOverMatter/mod_interactions/xedra_evolved` | 12 |
| `data/mods/MindOverMatter/monstergroups` | 4 |
| `data/mods/MindOverMatter/monsters` | 24 |
| `data/mods/MindOverMatter/mutations` | 8 |
| `data/mods/MindOverMatter/npcs` | 2 |
| `data/mods/MindOverMatter/npcs/dialogue` | 9 |
| `data/mods/MindOverMatter/npcs/overrides` | 1 |
| `data/mods/MindOverMatter/obsolete` | 6 |
| `data/mods/MindOverMatter/overmap` | 6 |
| `data/mods/MindOverMatter/powers` | 34 |
| `data/mods/MindOverMatter/powers/learning_eocs` | 10 |
| `data/mods/MindOverMatter/procgen` | 9 |
| `data/mods/MindOverMatter/recipes` | 17 |
| `data/mods/MindOverMatter/recipes/practice` | 10 |
| `data/mods/MindOverMatter/snippets` | 8 |
| `data/mods/MindOverMatter/ter_transform` | 1 |
| `data/mods/MindOverMatter/ui` | 2 |
| `data/mods/MindOverMatterNoKnacks` | 7 |
| `data/mods/MindOverMatterNoKnacks/eocs` | 4 |
| `data/mods/MindOverMatterNoKnacks/items` | 1 |
| `data/mods/MindOverMatterNoKnacks/monsters` | 1 |
| `data/mods/MindOverMatterNoKnacks/mutations` | 1 |
| `data/mods/My_Sweet_Cataclysm` | 24 |
| `data/mods/My_Sweet_Cataclysm/mod_interactions/defense_mode` | 3 |
| `data/mods/My_Sweet_Cataclysm/sweet_mapgen` | 4 |
| `data/mods/Mythos-Creatures` | 4 |
| `data/mods/Mythos-Creatures/items/corpses` | 1 |
| `data/mods/Mythos-Creatures/mod_interactions/defense_mode` | 3 |
| `data/mods/Mythos-Creatures/monstergroups` | 5 |
| `data/mods/Mythos-Creatures/monsters` | 1 |
| `data/mods/No_Hope` | 25 |
| `data/mods/No_Hope/Mapgen` | 13 |
| `data/mods/No_Hope/Mapgen/map_extras` | 5 |
| `data/mods/No_Hope/Mapgen/nested` | 3 |
| `data/mods/No_Hope/NPC` | 7 |
| `data/mods/No_Hope/eocs` | 1 |
| `data/mods/No_Hope/mapgen_palettes` | 4 |
| `data/mods/No_Hope/mod_interactions/skyisland` | 1 |
| `data/mods/No_Hope/overmap` | 5 |
| `data/mods/No_Hope/region_settings` | 1 |
| `data/mods/No_Hope/region_settings/region_settings` | 1 |
| `data/mods/No_NPC_Food` | 1 |
| `data/mods/Only_Wildlife` | 1 |
| `data/mods/Perk_melee` | 8 |
| `data/mods/Perk_melee/EOC` | 11 |
| `data/mods/Perk_melee/PERKS` | 5 |
| `data/mods/Perk_melee/UI` | 1 |
| `data/mods/Perk_melee/techniques` | 2 |
| `data/mods/Personal_Portal_Storms` | 2 |
| `data/mods/Rummaging` | 1 |
| `data/mods/Sky_Island` | 18 |
| `data/mods/Sky_Island/effectoncondition` | 14 |
| `data/mods/Sky_Island/itemgroups` | 2 |
| `data/mods/Sky_Island/loading_images` | 1 |
| `data/mods/Sky_Island/mapgen` | 5 |
| `data/mods/Sky_Island/missions` | 4 |
| `data/mods/Sky_Island/missions/island_upgrades` | 8 |
| `data/mods/Sky_Island/missions/raid_upgrades` | 8 |
| `data/mods/Sky_Island/mod_interactions/classic_zombies` | 1 |
| `data/mods/Sky_Island/mod_interactions/innawood` | 1 |
| `data/mods/Sky_Island/mod_interactions/magiclysm` | 5 |
| `data/mods/Sky_Island/mod_interactions/mindovermatter` | 4 |
| `data/mods/Sky_Island/mod_interactions/tropicata` | 1 |
| `data/mods/Sky_Island/mod_interactions/xedra_evolved` | 7 |
| `data/mods/Sky_Island/monsters` | 3 |
| `data/mods/Sky_Island/npc_merchants` | 5 |
| `data/mods/Sky_Island/obsolete` | 2 |
| `data/mods/Sky_Island/region_settings` | 1 |
| `data/mods/Sky_Island/region_settings/region_settings` | 1 |
| `data/mods/Sorcerer` | 8 |
| `data/mods/Sorcerer/Spells` | 2 |
| `data/mods/Sorcerer/bloodlines` | 3 |
| `data/mods/Sorcerer/generated_code` | 2 |
| `data/mods/Sorcerer/generated_code/bloodlines/standard` | 1 |
| `data/mods/Sorcerer/generated_code/learn_spell` | 1 |
| `data/mods/Sorcerer/items` | 1 |
| `data/mods/Sorcerer/requirements` | 1 |
| `data/mods/Sorcerer/tools` | 2 |
| `data/mods/Sorcerer/traits` | 1 |
| `data/mods/Standard_Combat_Tests` | 1 |
| `data/mods/Standard_Combat_Tests/mod_interactions/xedra_evolved` | 1 |
| `data/mods/TEST_DATA` | 88 |
| `data/mods/TEST_DATA/lang` | 1 |
| `data/mods/TEST_DATA/lang/mo/ru/LC_MESSAGES` | 1 |
| `data/mods/TEST_DATA/lang/po` | 1 |
| `data/mods/TEST_DATA/npc_behavior_arenas` | 1 |
| `data/mods/TEST_DATA/overmap_terrain_coverage_test` | 1 |
| `data/mods/Tamable_Wildlife` | 7 |
| `data/mods/Tamable_Wildlife/items/comestibles` | 2 |
| `data/mods/Tamable_Wildlife/mutations` | 1 |
| `data/mods/Tamable_Wildlife/recipes` | 3 |
| `data/mods/TropiCataclysm` | 10 |
| `data/mods/TropiCataclysm/furniture_and_terrain` | 2 |
| `data/mods/TropiCataclysm/itemgroups` | 1 |
| `data/mods/TropiCataclysm/itemgroups/Monsters_Animals_Lairs` | 1 |
| `data/mods/TropiCataclysm/items/comestibles` | 3 |
| `data/mods/TropiCataclysm/mapgen/bugs` | 1 |
| `data/mods/TropiCataclysm/mapgen/fungal` | 1 |
| `data/mods/TropiCataclysm/mapgen/nether` | 1 |
| `data/mods/TropiCataclysm/mapgen/triffid` | 3 |
| `data/mods/TropiCataclysm/migrations_0.J` | 3 |
| `data/mods/TropiCataclysm/monster_special_attacks` | 1 |
| `data/mods/TropiCataclysm/monstergroups` | 8 |
| `data/mods/TropiCataclysm/monsters` | 9 |
| `data/mods/TropiCataclysm/overmap/overmap_mutable` | 1 |
| `data/mods/TropiCataclysm/overmap/overmap_special` | 1 |
| `data/mods/TropiCataclysm/overmap/overmap_terrain` | 4 |
| `data/mods/TropiCataclysm/recipes` | 1 |
| `data/mods/TropiCataclysm/region_settings` | 1 |
| `data/mods/XedraWood` | 11 |
| `data/mods/XedraWood/effect_on_condition` | 7 |
| `data/mods/XedraWood/effects` | 6 |
| `data/mods/XedraWood/encounters` | 2 |
| `data/mods/XedraWood/furniture_and_terrain` | 6 |
| `data/mods/XedraWood/itemgroups` | 7 |
| `data/mods/XedraWood/items` | 14 |
| `data/mods/XedraWood/items/armor` | 2 |
| `data/mods/XedraWood/items/clothing` | 1 |
| `data/mods/XedraWood/items/comestibles` | 4 |
| `data/mods/XedraWood/magic` | 3 |
| `data/mods/XedraWood/magic/forest_magic` | 2 |
| `data/mods/XedraWood/magic/hedge_magic` | 2 |
| `data/mods/XedraWood/magic/monster_magic` | 2 |
| `data/mods/XedraWood/mapgen` | 5 |
| `data/mods/XedraWood/mapgen/hollow_villages` | 4 |
| `data/mods/XedraWood/mapgen/map_extras` | 6 |
| `data/mods/XedraWood/mapgen/mutables` | 3 |
| `data/mods/XedraWood/mapgen/wise_one_dwellings` | 1 |
| `data/mods/XedraWood/mapgen_palettes` | 2 |
| `data/mods/XedraWood/mod_interactions/DinoMod` | 1 |
| `data/mods/XedraWood/mod_interactions/innawood` | 1 |
| `data/mods/XedraWood/mod_interactions/megafauna` | 1 |
| `data/mods/XedraWood/monstergroups` | 6 |
| `data/mods/XedraWood/monsters` | 16 |
| `data/mods/XedraWood/mutations` | 1 |
| `data/mods/XedraWood/npcs` | 1 |
| `data/mods/XedraWood/overmap` | 5 |
| `data/mods/XedraWood/patterns` | 2 |
| `data/mods/XedraWood/player` | 10 |
| `data/mods/XedraWood/recipes` | 12 |
| `data/mods/XedraWood/recipes/armor` | 1 |
| `data/mods/XedraWood/recipes/blacklisting` | 2 |
| `data/mods/XedraWood/ter_transform` | 1 |
| `data/mods/Xedra_Evolved` | 41 |
| `data/mods/Xedra_Evolved/achievements` | 2 |
| `data/mods/Xedra_Evolved/dialogue` | 1 |
| `data/mods/Xedra_Evolved/effects` | 13 |
| `data/mods/Xedra_Evolved/enchantments` | 7 |
| `data/mods/Xedra_Evolved/encounters` | 4 |
| `data/mods/Xedra_Evolved/eocs` | 33 |
| `data/mods/Xedra_Evolved/furniture_and_terrain` | 9 |
| `data/mods/Xedra_Evolved/itemgroups` | 10 |
| `data/mods/Xedra_Evolved/itemgroups/spell_artifacts` | 6 |
| `data/mods/Xedra_Evolved/items` | 46 |
| `data/mods/Xedra_Evolved/items/armor` | 4 |
| `data/mods/Xedra_Evolved/items/comestibles` | 3 |
| `data/mods/Xedra_Evolved/items/inventor` | 11 |
| `data/mods/Xedra_Evolved/items/spell_learning_items` | 7 |
| `data/mods/Xedra_Evolved/loading_images` | 6 |
| `data/mods/Xedra_Evolved/mapgen` | 21 |
| `data/mods/Xedra_Evolved/mapgen/basements` | 2 |
| `data/mods/Xedra_Evolved/mapgen/cabins` | 2 |
| `data/mods/Xedra_Evolved/mapgen/caves` | 1 |
| `data/mods/Xedra_Evolved/mapgen/elemental_eruptions` | 1 |
| `data/mods/Xedra_Evolved/mapgen/great_tree` | 3 |
| `data/mods/Xedra_Evolved/mapgen/microlabs` | 2 |
| `data/mods/Xedra_Evolved/mapgen/mutable` | 2 |
| `data/mods/Xedra_Evolved/mapgen/nested` | 6 |
| `data/mods/Xedra_Evolved/mapgen_palettes` | 3 |
| `data/mods/Xedra_Evolved/martial_arts` | 4 |
| `data/mods/Xedra_Evolved/mod_interactions/DinoMod` | 1 |
| `data/mods/Xedra_Evolved/mod_interactions/bombastic_perks/perks` | 2 |
| `data/mods/Xedra_Evolved/mod_interactions/bombastic_perks/perks/perk_data` | 2 |
| `data/mods/Xedra_Evolved/mod_interactions/classic_zombies` | 6 |
| `data/mods/Xedra_Evolved/mod_interactions/crazy_cataclysm` | 1 |
| `data/mods/Xedra_Evolved/mod_interactions/defense_mode` | 9 |
| `data/mods/Xedra_Evolved/mod_interactions/innawood` | 2 |
| `data/mods/Xedra_Evolved/mod_interactions/innawood/itemgroups` | 2 |
| `data/mods/Xedra_Evolved/mod_interactions/innawood/mapgen` | 1 |
| `data/mods/Xedra_Evolved/mod_interactions/innawood/monstergroups` | 2 |
| `data/mods/Xedra_Evolved/mod_interactions/innawood/monsters` | 1 |
| `data/mods/Xedra_Evolved/mod_interactions/innawood/player` | 2 |
| `data/mods/Xedra_Evolved/mod_interactions/magiclysm` | 4 |
| `data/mods/Xedra_Evolved/mod_interactions/mindovermatter` | 5 |
| `data/mods/Xedra_Evolved/mod_interactions/skyisland` | 3 |
| `data/mods/Xedra_Evolved/monster_special_attacks` | 1 |
| `data/mods/Xedra_Evolved/monsters` | 26 |
| `data/mods/Xedra_Evolved/mutations` | 30 |
| `data/mods/Xedra_Evolved/mutations/paraclesians` | 30 |
| `data/mods/Xedra_Evolved/npc` | 26 |
| `data/mods/Xedra_Evolved/npc/dialogue` | 4 |
| `data/mods/Xedra_Evolved/npc/strange_events` | 1 |
| `data/mods/Xedra_Evolved/npc/vampire_hunters` | 5 |
| `data/mods/Xedra_Evolved/obsoletion_and_migration` | 11 |
| `data/mods/Xedra_Evolved/overmap` | 1 |
| `data/mods/Xedra_Evolved/player` | 8 |
| `data/mods/Xedra_Evolved/procgen` | 3 |
| `data/mods/Xedra_Evolved/recipes` | 25 |
| `data/mods/Xedra_Evolved/recipes/changeling` | 2 |
| `data/mods/Xedra_Evolved/recipes/food` | 1 |
| `data/mods/Xedra_Evolved/recipes/inventor` | 10 |
| `data/mods/Xedra_Evolved/recipes/paraclesians` | 4 |
| `data/mods/Xedra_Evolved/requirements` | 6 |
| `data/mods/Xedra_Evolved/snippets` | 18 |
| `data/mods/Xedra_Evolved/spells` | 30 |
| `data/mods/Xedra_Evolved/ter_transforms` | 10 |
| `data/mods/Xedra_Evolved/ui` | 4 |
| `data/mods/Xedra_Evolved/vehicles` | 4 |
| `data/mods/Xedra_Evolved/weakpoints` | 3 |
| `data/mods/aftershock_exoplanet` | 26 |
| `data/mods/aftershock_exoplanet/EOC` | 16 |
| `data/mods/aftershock_exoplanet/achievements` | 2 |
| `data/mods/aftershock_exoplanet/doc` | 3 |
| `data/mods/aftershock_exoplanet/doc/lore` | 8 |
| `data/mods/aftershock_exoplanet/faults` | 3 |
| `data/mods/aftershock_exoplanet/itemgroups` | 27 |
| `data/mods/aftershock_exoplanet/itemgroups/clothing` | 5 |
| `data/mods/aftershock_exoplanet/itemgroups/weapons` | 6 |
| `data/mods/aftershock_exoplanet/items` | 43 |
| `data/mods/aftershock_exoplanet/items/ammo` | 13 |
| `data/mods/aftershock_exoplanet/items/armor` | 11 |
| `data/mods/aftershock_exoplanet/items/armor/exosuit` | 18 |
| `data/mods/aftershock_exoplanet/items/comestibles` | 7 |
| `data/mods/aftershock_exoplanet/items/crafting_scrap` | 10 |
| `data/mods/aftershock_exoplanet/items/gun` | 17 |
| `data/mods/aftershock_exoplanet/items/gunmods` | 5 |
| `data/mods/aftershock_exoplanet/items/magazine` | 12 |
| `data/mods/aftershock_exoplanet/items/software` | 2 |
| `data/mods/aftershock_exoplanet/maps` | 11 |
| `data/mods/aftershock_exoplanet/maps/furniture_and_terrain` | 16 |
| `data/mods/aftershock_exoplanet/maps/mapgen` | 55 |
| `data/mods/aftershock_exoplanet/maps/mapgen/aeolian_plains` | 4 |
| `data/mods/aftershock_exoplanet/maps/mapgen/formless_ruins` | 4 |
| `data/mods/aftershock_exoplanet/maps/mapgen/habitat_blocks` | 3 |
| `data/mods/aftershock_exoplanet/maps/mapgen/habitats` | 6 |
| `data/mods/aftershock_exoplanet/maps/mapgen/houses` | 1 |
| `data/mods/aftershock_exoplanet/maps/mapgen/port_augustmoon` | 2 |
| `data/mods/aftershock_exoplanet/maps/mapgen/ravine_floor` | 1 |
| `data/mods/aftershock_exoplanet/maps/mapgen/space` | 1 |
| `data/mods/aftershock_exoplanet/maps/mapgen/tunnels` | 6 |
| `data/mods/aftershock_exoplanet/maps/mapgen_pallete` | 10 |
| `data/mods/aftershock_exoplanet/maps/mutable_specials` | 4 |
| `data/mods/aftershock_exoplanet/maps/nested` | 4 |
| `data/mods/aftershock_exoplanet/maps/nested/arcology` | 2 |
| `data/mods/aftershock_exoplanet/maps/overmap_terrain` | 6 |
| `data/mods/aftershock_exoplanet/migration` | 2 |
| `data/mods/aftershock_exoplanet/missions` | 2 |
| `data/mods/aftershock_exoplanet/mod_interactions/defense_mode` | 3 |
| `data/mods/aftershock_exoplanet/monster_attacks` | 2 |
| `data/mods/aftershock_exoplanet/monsterdrops` | 2 |
| `data/mods/aftershock_exoplanet/monsters` | 14 |
| `data/mods/aftershock_exoplanet/monsters/monster_groups` | 4 |
| `data/mods/aftershock_exoplanet/monsters/monster_weakpoints` | 2 |
| `data/mods/aftershock_exoplanet/mutations` | 9 |
| `data/mods/aftershock_exoplanet/npcs` | 12 |
| `data/mods/aftershock_exoplanet/npcs/Augustmoon_Salvors` | 4 |
| `data/mods/aftershock_exoplanet/npcs/Backgrounds` | 31 |
| `data/mods/aftershock_exoplanet/npcs/Independents` | 1 |
| `data/mods/aftershock_exoplanet/npcs/Independents/GENERIC` | 1 |
| `data/mods/aftershock_exoplanet/npcs/Mercurial` | 1 |
| `data/mods/aftershock_exoplanet/npcs/Salvor_Market` | 7 |
| `data/mods/aftershock_exoplanet/npcs/UICA` | 8 |
| `data/mods/aftershock_exoplanet/npcs/UICA/GENERIC` | 4 |
| `data/mods/aftershock_exoplanet/npcs/computers` | 3 |
| `data/mods/aftershock_exoplanet/npcs/cyborg_npcs` | 2 |
| `data/mods/aftershock_exoplanet/npcs/cyborg_npcs/backgrounds` | 2 |
| `data/mods/aftershock_exoplanet/npcs/mutant_npcs` | 1 |
| `data/mods/aftershock_exoplanet/npcs/prepnet_phyle` | 1 |
| `data/mods/aftershock_exoplanet/obsoletion` | 3 |
| `data/mods/aftershock_exoplanet/player` | 10 |
| `data/mods/aftershock_exoplanet/price_overrides` | 2 |
| `data/mods/aftershock_exoplanet/recipes` | 22 |
| `data/mods/aftershock_exoplanet/recipes/basecamps` | 1 |
| `data/mods/aftershock_exoplanet/recipes/deconstruction` | 2 |
| `data/mods/aftershock_exoplanet/recipes/esper` | 5 |
| `data/mods/aftershock_exoplanet/region_settings` | 2 |
| `data/mods/aftershock_exoplanet/region_settings/region_settings` | 1 |
| `data/mods/aftershock_exoplanet/setting_blacklists` | 4 |
| `data/mods/aftershock_exoplanet/snippets` | 4 |
| `data/mods/aftershock_exoplanet/spells` | 6 |
| `data/mods/aftershock_exoplanet/spells/psionics` | 12 |
| `data/mods/aftershock_exoplanet/vehicles` | 5 |
| `data/mods/alt_map_key` | 18 |
| `data/mods/alt_map_key/mod_interactions/desertpack` | 1 |
| `data/mods/alt_map_key/mod_interactions/innawood` | 1 |
| `data/mods/alt_map_key/mod_interactions/magiclysm` | 1 |
| `data/mods/alt_map_key/mod_interactions/mindovermatter` | 1 |
| `data/mods/alt_map_key/mod_interactions/xedra_evolved` | 1 |
| `data/mods/cbm_slots` | 1 |
| `data/mods/classic_zombies` | 12 |
| `data/mods/classic_zombies/contagion` | 1 |
| `data/mods/classic_zombies/furniture_and_terrain` | 2 |
| `data/mods/classic_zombies/items` | 8 |
| `data/mods/classic_zombies/loading_images` | 1 |
| `data/mods/classic_zombies/mapgen` | 3 |
| `data/mods/classic_zombies/mod_interactions/skyisland` | 1 |
| `data/mods/classic_zombies/monstergroups` | 1 |
| `data/mods/classic_zombies/monsters` | 3 |
| `data/mods/classic_zombies/npcs` | 1 |
| `data/mods/classic_zombies/recipes` | 4 |
| `data/mods/classic_zombies/region_settings/region_settings` | 1 |
| `data/mods/classic_zombies/vehicles` | 4 |
| `data/mods/dda` | 1 |
| `data/mods/dda_tutorial` | 8 |
| `data/mods/deadly_bites` | 6 |
| `data/mods/desert_region` | 7 |
| `data/mods/desert_region/furniture-and-terrain` | 2 |
| `data/mods/desert_region/itemgroups` | 1 |
| `data/mods/desert_region/mapgen` | 3 |
| `data/mods/desert_region/mod_interactions/skyisland` | 1 |
| `data/mods/desert_region/monsters` | 2 |
| `data/mods/desert_region/overmap` | 3 |
| `data/mods/desert_region/overmap/mutable` | 3 |
| `data/mods/desert_region/region_settings/region_settings` | 1 |
| `data/mods/desert_region/weather` | 4 |
| `data/mods/extra_mut_scen` | 5 |
| `data/mods/hunvre` | 3 |
| `data/mods/hunvre/documentation` | 1 |
| `data/mods/hunvre/json` | 5 |
| `data/mods/hunvre/json/effects_on_condition` | 5 |
| `data/mods/hunvre/json/furniture_and_terrain/furniture` | 1 |
| `data/mods/hunvre/json/furniture_and_terrain/ter_furn_transform` | 1 |
| `data/mods/hunvre/json/furniture_and_terrain/terrain` | 1 |
| `data/mods/hunvre/json/itemgroups` | 2 |
| `data/mods/hunvre/json/itemgroups/food` | 2 |
| `data/mods/hunvre/json/items/clothing` | 7 |
| `data/mods/hunvre/json/items/tool` | 1 |
| `data/mods/hunvre/json/items/trash` | 1 |
| `data/mods/hunvre/json/loading_screens` | 4 |
| `data/mods/hunvre/json/loading_screens/original` | 3 |
| `data/mods/hunvre/json/mapgen/habitations` | 2 |
| `data/mods/hunvre/json/mapgen/industry` | 2 |
| `data/mods/hunvre/json/mapgen/infrastructure` | 3 |
| `data/mods/hunvre/json/mapgen/parks` | 1 |
| `data/mods/hunvre/json/mapgen/shops` | 2 |
| `data/mods/hunvre/json/mapgen/shops/restaurants` | 2 |
| `data/mods/hunvre/json/mapgen_palettes` | 5 |
| `data/mods/hunvre/json/mod_settings` | 3 |
| `data/mods/hunvre/json/mod_settings/region_settings` | 4 |
| `data/mods/hunvre/json/monster_special_attacks` | 1 |
| `data/mods/hunvre/json/monstergroups` | 1 |
| `data/mods/hunvre/json/monsters` | 3 |
| `data/mods/hunvre/json/npcs` | 2 |
| `data/mods/hunvre/json/scenarios_professions_hobbies` | 3 |
| `data/mods/hunvre/json/snippets` | 4 |
| `data/mods/hunvre/json/vehicles` | 1 |
| `data/mods/innawood` | 16 |
| `data/mods/innawood/furniture_and_terrain` | 6 |
| `data/mods/innawood/itemgroups` | 8 |
| `data/mods/innawood/items` | 8 |
| `data/mods/innawood/loading_screens` | 1 |
| `data/mods/innawood/mapgen` | 8 |
| `data/mods/innawood/mapgen/nested` | 1 |
| `data/mods/innawood/mapgen/ore_veins` | 1 |
| `data/mods/innawood/mapgen_palettes` | 4 |
| `data/mods/innawood/migration` | 2 |
| `data/mods/innawood/mining` | 2 |
| `data/mods/innawood/mining/furniture_and_terrain` | 3 |
| `data/mods/innawood/mining/itemgroups` | 1 |
| `data/mods/innawood/mining/items` | 2 |
| `data/mods/innawood/mining/recipes` | 1 |
| `data/mods/innawood/mod_interactions/bombastic_perks` | 1 |
| `data/mods/innawood/mod_interactions/perk_melee_system` | 1 |
| `data/mods/innawood/mod_interactions/skyisland` | 1 |
| `data/mods/innawood/mod_interactions/sorcerer` | 1 |
| `data/mods/innawood/monsterdrops` | 3 |
| `data/mods/innawood/monsters` | 4 |
| `data/mods/innawood/mutations` | 1 |
| `data/mods/innawood/npcs` | 6 |
| `data/mods/innawood/npcs/Backgrounds` | 49 |
| `data/mods/innawood/overmap` | 4 |
| `data/mods/innawood/recipes` | 16 |
| `data/mods/innawood/recipes/armor` | 3 |
| `data/mods/innawood/recipes/other` | 6 |
| `data/mods/innawood/recipes/practice` | 3 |
| `data/mods/innawood/recipes/vanilla_blacklists` | 10 |
| `data/mods/innawood/recipes/weapon` | 5 |
| `data/mods/innawood/region_settings/region_settings` | 1 |
| `data/mods/innawood/requirements` | 2 |
| `data/mods/innawood/vehicleparts` | 1 |
| `data/mods/package_bionic_professions` | 9 |
| `data/mods/railroads` | 3 |
| `data/mods/railroads/mapgen` | 2 |
| `data/mods/railroads/mapgen/railroad` | 2 |
| `data/mods/railroads/mapgen_palettes` | 1 |
| `data/mods/railroads/overmap` | 3 |
| `data/mods/railroads/overmap/overmap_special` | 1 |
| `data/mods/railroads/overmap/overmap_terrain` | 1 |
| `data/mods/rural_biome` | 1 |
| `data/mods/rural_biome/region_settings/region_settings` | 1 |
| `data/mods/translate-dialogue` | 6 |
| `data/motd` | 1 |
| `data/names` | 6 |
| `data/raw` | 3 |
| `data/raw/color_templates` | 2 |
| `data/raw/color_themes` | 26 |
| `data/raw/compression` | 3 |
| `data/raw/imgui_styles` | 2 |
| `data/raw/keybindings` | 1 |
| `data/screenshots` | 4 |
| `data/shaders` | 16 |
| `data/sound/Menu_Sound_Test` | 5 |
| `data/title` | 16 |
| `data/xdg` | 3 |
| `doc` | 28 |
| `doc/JSON` | 43 |
| `doc/JSON/JSON_Mapping_Guides` | 3 |
| `doc/c++` | 14 |
| `doc/design-balance-lore` | 18 |
| `doc/design-balance-lore/melee_weapons` | 2 |
| `doc/firearm_stats` | 5 |
| `doc/img` | 19 |
| `doc/user-guides` | 2 |
| `doxygen_doc` | 2 |
| `gfx` | 1 |
| `gfx/ASCIITileset` | 4 |
| `gfx/Larwick_Overmap` | 5 |
| `gfx/loading_screens` | 2 |
| `lang` | 10 |
| `lang/incoming` | 1 |
| `lang/json` | 1 |
| `lang/mo` | 1 |
| `lang/notes` | 3 |
| `lang/po` | 2 |
| `lang/string_extractor` | 8 |
| `lang/string_extractor/parsers` | 99 |
| `lgtm/cpp-queries` | 2 |
| `msvc-full-features` | 21 |
| `pch` | 1 |
| `src` | 959 |
| `src/chkjson` | 2 |
| `src/third-party` | 2 |
| `src/third-party/flatbuffers` | 17 |
| `src/third-party/flatbuffers/pch` | 2 |
| `src/third-party/fmt` | 16 |
| `src/third-party/imgui` | 20 |
| `src/third-party/imtui` | 5 |
| `src/third-party/jc_voronoi` | 2 |
| `src/third-party/pinyin` | 2 |
| `src/third-party/plf` | 3 |
| `src/third-party/snmalloc` | 4 |
| `src/third-party/snmalloc/aal` | 11 |
| `src/third-party/snmalloc/backend` | 6 |
| `src/third-party/snmalloc/backend_helpers` | 22 |
| `src/third-party/snmalloc/ds` | 7 |
| `src/third-party/snmalloc/ds_aal` | 5 |
| `src/third-party/snmalloc/ds_core` | 10 |
| `src/third-party/snmalloc/global` | 7 |
| `src/third-party/snmalloc/mem` | 15 |
| `src/third-party/snmalloc/mem/secondary` | 2 |
| `src/third-party/snmalloc/override` | 8 |
| `src/third-party/snmalloc/pal` | 21 |
| `src/third-party/snmalloc/stl` | 6 |
| `src/third-party/snmalloc/stl/cxx` | 5 |
| `src/third-party/snmalloc/stl/gnu` | 5 |
| `src/third-party/zstd` | 6 |
| `src/third-party/zstd/common` | 25 |
| `src/third-party/zstd/compress` | 29 |
| `src/third-party/zstd/decompress` | 8 |
| `tests` | 293 |
| `tests/catch` | 1 |
| `tests/catch/contrib` | 2 |
| `tests/data` | 5 |
| `tests/pch` | 1 |
| `tools` | 30 |
| `tools/clang-tidy-plugin` | 83 |
| `tools/clang-tidy-plugin/test` | 50 |
| `tools/flagdoc` | 3 |
| `tools/format` | 6 |
| `tools/format_emscripten` | 3 |
| `tools/gfx_tools` | 5 |
| `tools/graphs` | 1 |
| `tools/iwyu` | 8 |
| `tools/json_tools` | 33 |
| `tools/json_tools/jq` | 5 |
| `tools/json_tools/overmap_sprites_files/color_schemes` | 2 |
| `tools/llama` | 2 |
| `tools/llama/gcc-focal` | 1 |
| `tools/save` | 1 |
| `tools/spell_checker` | 4 |
| `utilities` | 2 |
