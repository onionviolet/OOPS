# Discord evidence for the OOPS atlas: codex, canvas, fold, design language, retention

Date: 2026-11-24

Proposal (AD32); unclassified evidence from a live read-only search on 2026-11-24 via discord-issue-mcp.

Channels searched: `#yet-another-idle-rpg` (1458887440398942300) and the threads that surface under it (`#Development/contributions`, `#YAFEIRPG`, `#Nekorpg`). `#other-general` (1458892378327879700) was searched in a second pass, and its findings are DY26 to DY40. `#proto-23` was not searched.

Quotes are kept to a few words; everything else is paraphrase. Speaker names are the display names shown by the bridge.

| ID | Idea (one line) | Speaker | Date | Channel | Message id | Feeds |
|---|---|---|---|---|---|---|
| DY1 | A traditional wiki fits badly: content is wide, not deep, so most areas get a paragraph; grouped, swappable pages (Trello style) suit it better | Alhixx | 2026-11-03 | #yet-another-idle-rpg | 1567343597391454360 | codex |
| DY2 | Ship a data viewer built on the game's own data so reference pages are easier to produce and keep current | Nonon | 2026-11-03 | #yet-another-idle-rpg | 1567348414730215537 | codex |
| DY3 | A player built their own item compendium as they cleared content, so in-game reference is missing and players make it | McFrugal | 2026-09-01 | #yet-another-idle-rpg | 1544278806045524030 | codex |
| DY4 | Tease future content and show that more exists without revealing it all; the `???` placeholder caused more trouble than fun and `Unknown {type}` was floated instead | Nonon | 2026-09-18 | #yet-another-idle-rpg | 1550543803134251009 | codex, fold |
| DY5 | The map is the graph: a "+" adds a box, you feed it links and times, and an off-the-shelf search computes distance | Guy | 2026-11-11 | #yet-another-idle-rpg | 1570209677793431675 | canvas |
| DY6 | Use regional maps that redraw on region change, with travel time written on each edge line | Guy | 2026-11-15 | #Development/contributions | 1571571121378295841 | canvas |
| DY7 | Map reveals gated by actions in a core area; only four marker types (settlement, combat, training, gathering); dungeons unmapped or minimum-time route only | Cole Ignios | 2026-02-19 | #yet-another-idle-rpg | 1474264884144509102 | canvas |
| DY8 | Map parts stay visually hidden until unlocked, and the map must update itself when areas are added | BD Jim | 2026-11-11 | #yet-another-idle-rpg | 1570204973587890328 | canvas |
| DY9 | A map that opens on demand is the more restrained design than a permanent panel | Mercurius | 2026-11-15 | #Development/contributions | 1571587242336460881 | canvas, design language |
| DY10 | Offer removing combat areas from the map as an option, for decluttering | Guy | 2026-11-15 | #Development/contributions | 1571569931110055988 | canvas |
| DY11 | The map can be a chart of favourited locations that sends a move command, since the game already computes distance | BD Jim | 2026-11-11 | #yet-another-idle-rpg | 1570211288875933697 | canvas |
| DY12 | Show effects and damage types with icons, numbers and arrows; less text, more visual language | BD Jim | 2026-11-12 | #yet-another-idle-rpg | 1570506916126527660 | design language, fold |
| DY13 | Each menu gets a "?" button explaining itself; equipment pieces list the reachable recipes and materials that apply, to show what to aim for | Witardo | 2026-10-24 | #yet-another-idle-rpg | 1563734294709534721 | codex, design language |
| DY14 | A help section beside the monster compendium for weapon effects and mechanics | Whim | 2026-07-10 | #YAFEIRPG | 1525231322648281178 | codex |
| DY15 | Tooltip code was unified (one mover, walks up parents to find the target, a restricted-tooltip list, a side parameter); the developer calls it a top cleanup | Miktaew | 2026-08-14 | #yet-another-idle-rpg | 1537943297761476609 | design language |
| DY16 | A small region tooltip that shows locked unlocks as `???`, like milestones | Erika | 2026-06-19 | #yet-another-idle-rpg | 1517572663063744693 | codex, fold |
| DY17 | Bestiary entries can show obscured names and spoilered images until known | Miktaew | 2026-05-09 | #yet-another-idle-rpg | 1502748183346811032 | codex, fold |
| DY18 | Enemy names fade as you outgrow them and show only when you inspect, so knowledge and strength change what you see | Umbra Animo | 2026-10-02 | #yet-another-idle-rpg | 1555790334620082177 | fold |
| DY19 | Give NPCs full stats, equipment and skill levels so inspect has something to show, purely for flavour | Miktaew | 2026-07-18 | #yet-another-idle-rpg | 1528131035324350655 | fold |
| DY20 | Tooltips and flavour text should explain the reasoning behind a taxonomy so odd categories read as intended | Mercurius | 2026-07-07 | #yet-another-idle-rpg | 1524130066219536494 | fold, codex |
| DY21 | The UI does not fit one window; players run 90%, 110% or 10% zoom to compensate, and zoomed-out scrollbars covered content | Mai | 2026-03-27 | #yet-another-idle-rpg | 1487102527819481189 | design language |
| DY22 | With many tabs there is clutter whichever option you pick; a semi-permanent map tab would force a readability redesign | Guy | 2026-11-15 | #Development/contributions | 1571570737330782360 | design language, canvas |
| DY23 | Found the game getting grindy, rescanned everywhere, and discovered new training methods and quests, which kept them playing | Kensarto | 2026-11-03 | #yet-another-idle-rpg | 1567149730109198469 | retention, codex |
| DY24 | Idle games work on a loop of slow start, speed-up, a burst of reward, then a slowdown until the next milestone | Alp | 2026-02-05 | #yet-another-idle-rpg | 1469018138061443112 | retention |
| DY25 | Would have quit years ago if the game could not run 24/7 | Erika | 2026-11-20 | #yet-another-idle-rpg | 1573354300594458786 | retention |
| DY26 | A static map drawn as a graph is the suggested fit for another developer's small game; the same graph idea as DY5 reached independently | Guy | 2026-11-20 | #other-general | 1573443476903690423 | canvas |
| DY27 | Travel time is dead air because the player is paused from engaging; address that instead of just shortening trips | BD Jim | 2026-11-20 | #other-general | 1573387358517198930 | canvas, retention |
| DY28 | Let a player abort a move action after a misclick | BD Jim | 2026-11-20 | #other-general | 1573408714273194138 | canvas |
| DY29 | Keep the map reachable at any time inside the main window; a separate tab must keep redrawing itself | Malthanis | 2026-11-15 | #other-general | 1571635127161856131 | canvas |
| DY30 | The game's charm is its font and colour scheme; plain boxes work because the look is consistent | Guy | 2026-11-15 | #other-general | 1571682810731692075 | design language |
| DY31 | No UI is generically great; judge one by its purpose, and design for the task | Malthanis | 2026-11-15 | #other-general | 1571686609789652995 | design language |
| DY32 | Liked having a lot of control over the UI in another dev's game | TvStatic | 2026-11-20 | #other-general | 1573394969618813078 | design language |
| DY33 | Items whose effects do not show on hover leave players thinking they wasted a resource | Boredone | 2026-11-20 | #other-general | 1573396198713204847 | fold, codex |
| DY34 | A mark of a poor enemy is no familiarity meter, no bestiary entry and no known drops | shinichizio | 2026-08-18 | #other-general | 1539462804237451385 | codex, fold |
| DY35 | The discovery side is fun for some players, and automating the tedious parts later is the payoff | Witardo | 2026-09-15 | #other-general | 1549291137800478782 | retention, codex |
| DY36 | A number going up with no reason behind it is boring and reads like a predatory game | khade | 2026-09-13 | #other-general | 1548850075432910864 | retention |
| DY37 | A game that forces constant check-ins before automation unlocks wears players down | Wallydo | 2026-11-12 | #other-general | 1570573655258300417 | retention |
| DY38 | Unlock tips gradually as the player progresses | onko342 | 2026-11-20 | #other-general | 1573388430468059177 | codex, retention |
| DY39 | Separate Drops and Misc inventory tabs help players ignore clutter, though it only moves it elsewhere | Janus | 2026-04-07 | #other-general | 1491155428539891764 | design language |
| DY40 | Offline time worth more than online time lets players stay offline until ready to grind; this drew long maths in a fork | onko342 | 2026-08-16 | #other-general | 1538448665343950848 | retention |

## Search notes

Searched `#yet-another-idle-rpg` (threads included) for: wiki, codex, bestiary, encyclopedia, compendium, journal, map, zoom, graph, tooltip, inspect, thoughts, consistent, theme, font, readable, cluttered, clutter, density, layout, mobile, dark, addictive, addicting, boring, bored, grindy, quit, discover, reveal, hidden, spoiler, knowledge, achievements, dopamine, mood, interface, favorite, ui, "data viewer", overview, and used history around DY1, DY4, DY7, DY12 and DY13. Nothing useful came from codex (only the OpenAI tool), encyclopedia, overview, theme (no visual theme talk), dark (Dark Souls chatter, no dark-mode talk), density, mobile and addictive (off-topic talk). "Thoughts" and "mood" returned no creature-inspector or hidden-state talk, so there is no direct evidence for nested body or thoughts folds; DY18 to DY20 are the closest. The only wiki signals are a community wiki described as a beginning (2026-11-19) plus a Miraheze page and a Starlight site posted 2026-09-02. Limits: search returns capped pages (most terms show only the first 8 to 25 of dozens of hits, with offset paging not used), only about 60 bridge calls were allowed, ids are for the quoted message and not always the whole exchange, the bridge shows display names not account handles, and several relevant talks (the Sep 7 unlock-count complaint by Witardo, the Nov 20 bestiary tab order, the 2026-02-06 font complaint, the 2026-04-16 font failure on Linux, the 2026-11-23 achievements tab) were seen but left out of the table to stay under 25 rows.

## #other-general notes

Searched `#other-general` for: wiki, codex, bestiary, encyclopedia, compendium, journal, map, zoom, graph, tooltip, inspect, thoughts, theme, font, consistent, layout, design, mobile, dark, readable, cluttered, addictive, quit, boring, idle, offline, unlock, ui, familiarity, discovery, with history around DY26, DY30, DY32 and DY36. Nothing useful came from encyclopedia and compendium (no matches), codex (the OpenAI tool and a novel series), layout (keyboard layouts), zoom (the word as a verb), inspect (browser dev tools and prose), and wiki (mostly links to other games' wikis and one player giving up around hell). The channel is mostly off-topic chat and discussion of other games (Neko RPG, incrementals), so several rows come from other developers' games or other games and are only analogies for OOPS. DY26 to DY29 and DY32 come from a 2026-11-20 review of another developer's small game, not from YAIR itself. Limits: each term returned only its first 8 hits, so high-volume terms (quit, unlock, idle, design, map) are sampled, and no creature-inspector or body/thoughts evidence turned up here either.
