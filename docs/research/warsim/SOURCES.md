# Sources and evidence levels

Inspected 2026-10-14. Developer statements are STATED; current binary/data are
SHOWN; transfer lessons are PROPOSALS or INFERRED. Web sources do not override
installed-build evidence. No third-party wiki claim supplies an exact formula.

## Installed source S0

Steam payload: `/Users/weiwei/Library/Application Support/Steam/steamapps/common/Warsim The Realm of Aslona/`.
Manifest `appmanifest_659540.acf`, build 25097075, StateFlags 4, zero staging.
Executable SHA-256: `93d159754192876538b175b1a50a515e256806dce9f03e2d7f50a32880686e5f`.
PE console x86-64; CLR data directory zero. MinGW GCC 14.2.0 compiler marker,
C++ mangled functions and adjacent libstdc++/libgcc libraries corroborate native
C++. Text inventory, string file offsets and COFF symbols are local evidence.

## S1 Developer method and scope

[Huw's itch.io development account](https://itch.io/post/2382728), published
about five years before retrieval. STATED: learning C++ led first to generators,
then a battle simulator, hiring, arena, desertion, exploration and mercenaries.
He kept ideas in text files, grouped related suggestions, deferred optional
work and reduced roughly 3,000 entries to 500 for themed updates. Player
feedback and his own play drove additions. Historical planning method, not a
current backlog measurement.

## S2 Race system and choices

[Official race-system article](https://warsimstore.com/blogs/news/exploring-the-depths-of-the-94-million-procedurally-generated-fantasy-races-in-warsim-the-realm-of-aslona),
dated April 12, 2026 on this site, may republish older material. STATED: five
foreign kingdoms draw from a claimed 94,887,852 combinations. A generated
faction bundles ruler, government, currency, flag, laws and three troop tiers.
Traits can change behavior: raiders take gold, pacifists avoid attack, cold
specialists react to weather, and some leaders change annually. Entirely
uncommunicative starts can reduce diplomatic options. These examples describe
functions beyond cosmetic naming. Not all are verified in installed resolver
code, and the claimed total is not independently reproduced.

## S3 Prefix schema, historical developer wiki

[Huw2k8's original prefix guide](https://github.com/Huw2k8/warsim/wiki/Race-Generator-Prefixes),
page last edited October 9, 2020. STATED: two prefix classes occupy separate
slots. After label and an obsolete field, data contains value/operator pairs
for battle score, population and civilization, then alignment and a bonus
code. Score/pop operators are add, subtract, divide, multiply or set;
civilization supports add, subtract or set. Score additions distribute across
three tiers, with lower tier half and upper tier double the middle value.
Guide flags some behaviors as inactive, so a row name is not proof of a working
feature. SHOWN: current RaceSuffix rows still have the matching 12-field shape.
Exact current operator semantics, stacking and rounding remain unread.

## S4 Historical battle and labor explanation

[Developer battle explanation, July 2020](https://www.reddit.com/r/WarsimRpg/comments/hokozo/how_are_the_battles_calculated/).
STATED by Huw2k8: individual frontline fights include army bonuses and random
rolls; casualties remove workers, surviving peasants contribute to harvest;
general skill can offer deployments without peasants. Resurrecting units can
return during combat. It explains why protecting weak workers can matter even
with a large army. This is a historical description, not an exact formula for
build 25097075. Current menu/report strings corroborate the work/force join.

## S5 Historical arena weakness, developer response

[Steam arena discussion, January-May 2024](https://steamcommunity.com/app/659540/discussions/0/4034728215967266698/).
Developer-labelled responses acknowledged that arena gambling could become an
unintended money engine, discussed odds, and said play without it remained
possible but harder. Player reports disagree on whether this shortcut improves
the early game. Treat those reports as dated testimony. Current binary menus
show fixed advertised returns but do not establish that every past exploit
still works. Transfer proposal: give players credible ordinary income and
understandable repeatable stakes, without forcing anti-abuse caps on solo play.

## S6 Developer view on duplicates

[Huw2k8's generation discussion, 2019](https://www.reddit.com/r/gamedesign/comments/e5h4xw/a_breakdown_of_a_procedural_fantasy_race/).
STATED: the large number is combinatorics; the player usually faces a handful
of races. The developer rejected guaranteed unique traits per world because
several factions sharing a trait could itself produce an interesting world.
This supports retaining repeated reasonable combinations, not treating
uniqueness as a mandatory global rule.

## S7 Product breadth, claims only

[Steam store description](https://store.steampowered.com/app/659540/Warsim_The_Realm_of_Aslona/).
STATED: authored exploration plus newer procedural exploration, more than
1,000 throne-room encounters, steward delegation and configurable arena
ownership. The page itself says it misses later additions. These are product
claims; physical table counts are not evidence for their logical totals.

## Failed route and switch

Fandom Races page returned an internal fetch error. Switched to the developer's
GitHub wiki rather than retrying URL variants. Fandom search snippets locate
topics but were not used as formula authority. No account login, paywall
bypass or game launch was needed.
