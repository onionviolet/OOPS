# Source ledger

Access date: 2026-10-14. Raw captures are private work files under `~/.codex/research/discworld-2/extract/`; hashes are in `extract/HASHES.txt`. Read means article/page body, not every linked page, image, comment or advertised asset. Website statements and archived player accounts are not current runtime demonstrations.

## Wikipedia and its reference trail

The full [Wikipedia article](https://en.wikipedia.org/wiki/Discworld_MUD), revision 1368383791, was read: history, software/interface, interaction, mechanics/guilds, canon/divergence, reception and reference list. It routes research; unsourced subsections were not promoted to primary evidence. The “licensed” premise was not established.

| Reference | Route and disposition |
|---|---|
| 1 Nayar, *Introduction to New Media and Cybercultures*, p143 | Bibliographic citation/excerpt read on Wikipedia. Full book/page not acquired; outside verified reading. |
| 2 Kitchin/Dodge, *Atlas of Cyberspace*, pp187–188 | [Archive item](https://archive.org/details/atlasofcyberspac0000dodg/page/187) fetched, but item shell is not scanned-page reading. Full cited pages unread. |
| 3 Olivetti, 2011 | [Engadget article](https://www.engadget.com/2011/04/19/the-game-archaeologist-plays-with-muds-the-games/) fetched; Discworld section read. Historical short survey; old permanent-death account predates the official 2012 change. |
| 4 Features | [Official page](https://discworld.starturtle.net/lpc/about/features.html) read; usable objects and player services. Quantities are website statements, not audited live counts. |
| 5 Feris/Bennett interview | Web tool failed archive access; shell archive fetch succeeded. [2010 capture](https://web.archive.org/web/20100924002936/http://www.armchairarcade.com/neo/node/364) article read. Original URL returned 403 and was abandoned. Primary designer testimony. |
| 6 History | [Official history](https://discworld.starturtle.net/lpc/about/history.html) read; historical hosting/development context. |
| 7 Mudlib | [Official mudlib page](https://discworld.starturtle.net/lpc/about/mudlib.html) read. Followed to public release discovery, pinned source and README terms. |
| 8 Creators | [Official help](https://discworld.starturtle.net/lpc/playing/documentation.c?path=/concepts/creators) read. A managed creator role is distinct from ordinary character level. |
| 9 Playtesters | [Official help](https://discworld.starturtle.net/lpc/playing/documentation.c?path=/concepts/playtesters) read. Review role and quality expectations; no application submitted. |
| 10 Rules | [Official help](https://discworld.starturtle.net/lpc/playing/documentation.c?path=/concepts/rules) read. Current page permits website quest solutions while limiting public-channel spoilers; differs from historical study's older rule. No account created. |
| 11 Maloni et al., *Net Games*, p107 | [Archive item](https://archive.org/details/netgamesyourguid00malo/page/107) shell fetched. Cited scanned page unread; Wikipedia excerpt is secondary evidence only. |
| 12 Womble Lovers | [Public page](https://www.fidella.com/womble/womble_MUD.html) Discworld account read. Historical fan observations, not current world inventory. |
| 13 LPMud FAQ | [Original](http://www.faqs.org/faqs/games/mud-faq/lp/) returned HTTP 400. Wikipedia excerpt only; full FAQ unread. Primary official/code routes used for mechanisms. |
| 14 Karlsen | [Full study](https://gamestudies.org/0801/articles/karlsen) Discworld analysis and methods read, including contradictory player/designer views of difficult puzzles and changing reward policy. Historical field evidence. |
| 15 Developer blog | [Official post id422](https://discworld.starturtle.net/lpc/blog/blog.c?action=filter&blog=recent%20developments&id=422) read. Post describes AshkEnte final-death recovery, not a modern source formula. |
| 16 Guilds | [Official concept help](https://discworld.starturtle.net/lpc/playing/documentation.c?path=/concepts/guilds) read. Broad cross-skill access and guild-specific training/abilities. |
| 17 Fools | [Official guild page](https://discworld.starturtle.net/lpc/playing/guild_ob.c?guild=fool) read with the other five formerly unread official guild pages. |
| 18 Mud of the Month | [2010 capture of 1999 article](https://web.archive.org/web/20101126220548/http://mudconnect.com/motm/motm-0499.html) read. Administrators and player testimony emphasize social participation; named canon NPC encounters are anecdotal. Original returned 404. |
| Further reading: Cobbett | Web tool failed; shell followed original [PC Gamer URL](https://www.pcgamer.com/uk/saturday-crapshoot-discworld-mud/) successfully. Full article read, now titled a quick tour and dated 2022 as a rerun. Historical experience, not new gameplay proof. |
| Further reading: Lane | [Guardian](https://www.theguardian.com/games/2022/sep/28/we-can-continue-pratchetts-efforts-the-gamers-keeping-discworld-alive) read for context. Only conclusion retained: no formal association is established. No extended article paraphrase is used. |

## Requested archived player wiki coverage

Availability API initially returned no closest snapshot for several titles that replay later resolved. **An empty availability result does not prove no archive exists.** CDX query through the web tool was inaccessible; a shell CDX route timed out. Exact replay URLs recovered seven pages. HTTP failures were not retried with challenge tricks or date variants.

| Page | Capture / result | Read status |
|---|---|---|
| [Death](https://web.archive.org/web/20260609024619/https://dwwiki.mooo.com/wiki/Death) | 20260609024619 | Full body read |
| Taskmaster | Nearest replay returned 500 | Unread; official help + historical source used, not treated as wiki coverage |
| [Skills](https://web.archive.org/web/20260818131209/https://dwwiki.mooo.com/wiki/Skills) | 20260818131209 | Full body and skill/stat table read |
| [Teaching](https://web.archive.org/web/20260105161804/https://dwwiki.mooo.com/wiki/Teaching) | 20260105161804, redirects to teacher guide | Full body read |
| Player housing | Nearest replay returned 500 | Unread; source read is separate |
| [Languages](https://web.archive.org/web/20260922031240/https://dwwiki.mooo.com/wiki/Languages) | 20260922031240 | Full body read, including research caveats |
| Assassins' Guild | Availability found 20251218174634; replay returned 500 | Unread; official page read |
| Fools' Guild | Nearest replay returned 404 | Unread; official page read |
| Priests' Guild | 20260819183350 | Full body read, see CANON_AND_GUILDS link |
| Thieves' Guild | 20260818154834 | Full body read, see CANON_AND_GUILDS link |
| Warriors' Guild | Availability found 20260410225644; replay returned 500 | Unread; official page read |
| Witches' Guild | 20260921083806 | Full body/service and spell tables read |

`crafts`, `currency`, `accents`, current `skills` and `taskmaster` official concepts were fetched and read. Six official guild pages were fetched through their actual `guild_ob.c?guild=` links after guessed static paths returned 404. No live dwwiki fetch or bot-challenge bypass was attempted.

## Static source coverage

Read the relevant implementations and call paths in `README`, `obj/handlers/taskmaster.c`, `include/tasks.h`, `std/living/skills.c`, `std/skills.c`, `include/skills.h`, `include/tune.h`, `cmds/living/teach.c`, `cmds/living/learn.c`, `include/cmds/teach.h`, `std/room/inherit/guild.c`, `std/guilds/standard.c`, `std/guilds/warrior.c`, `global/player.c` death/revival sections, `std/shadows/misc/death_shadow.c`, `obj/handlers/languages.c`, `std/languages/language_inherit.c`, `obj/handlers/housing.c`, `include/housing.h`, `std/room/inherit/player_housing.c` setup/persistence/permission sections. This is scoped static reading, not an exhaustive repository audit.

The distribution omits most live domains and concrete guild implementations. No modern taskmaster, modern teaching algorithm, Death NPC, AshkEnte implementation, actual rent listings or franchise licence was recovered.
