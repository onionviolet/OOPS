# W4: System quests in other games and fiction

Research draft, 2026-10-14. The directory date is the dispatch date. Considerations only; no code changes, selected balance model, or new acceptance gates.

**F1: Default:** a patient, known-state milestone board is the strongest fit for the first Village slice. **Dial:** a particular world or card can instead use training obligations, seasonal requests, patron contracts, or a hostile grader. **Reasonably:** those variants can be valuable fiction, but their deadlines, rewards, knowledge and authority deserve separate treatment. A quest system need not make every life a checklist.

## Scope, evidence and the incumbent

Read: [AGENTS.md](../../../../AGENTS.md), [PROJECT.md](../../../../PROJECT.md), the relevant [USER_VISION.md](../../../USER_VISION.md) cheat/passive-play entries, [CHEAT_LIBRARY.md](../../../CHEAT_LIBRARY.md) from “More to consider: the status window” through its end, the audit's [Stage 1 recommendation](../cheat-status-window-2026-10-13/AUDIT_REPORT.md#stage-1-recommendation), and `src/quests.js` / `src/titles.js`. The existing tree contains unrelated work; it was inspected read-only and left alone. This draft is the only file written. No source library was acquired or modified, and no sealed YAIRPG truth is reproduced.

Evidence labels throughout:

| Label | Meaning here |
| --- | --- |
| **Shown** | Visible in inspected local source or directly readable source text. It does not mean gameplay was exercised. |
| **Stated** | Official documentation, publisher/distributor description, wiki, guide, or player report says it. Source type and access limitations are identified. |
| **Inferred** | My interpretation of player value, failure risk, or YAIRPG adaptation. This is not an empirical prevalence claim. |
| **Unverified** | A requested detail or memory recollection lacks adequate evidence in this pass. It is not treated as a fact. |

Web sources were checked on 2026-10-14. Indexed excerpts count as **stated**, not full-page verification. This is a targeted mechanic survey, not a full-source deep dive. No surveyed game was run. Unless a player report is explicitly cited, “failure mode” below means an inferred design risk, not a demonstrated defect or claim that most players dislike the mechanic. The pattern table reuses the evidence in the numbered entries.

**F2, shown in local owners:** stage 0 informs; the later S1 section makes stage 1 quests **and points**, with spending deferred to stage 2. The earlier SW1 shorthand associates points with stage 2. This is a wording discrepancy, not evidence of two implementations; this draft follows the user's explicit stage-1 description and the later S1/PT text. S1D1-S1D4 propose one post-awakening known-skill milestone and a truthful legacy baseline. Audit D1-D3 are proposals, not product authority. AW1/AW2/AW4/AW5 identify save, clock, reveal and validation concerns; this survey does not establish whether concurrent hardening has resolved them.

**F3, shown in source:** `quests.js` has sequential tasks, `any`/`all` conditions, event type/target/count matching, and requirements/restrictions on supplied tags. `reach_skill` sets an absolute current value; other matching event types increment it. Existing content demonstrates kill, location and skill targets. Finishing native tasks/quests invokes native rewards automatically. This supports reusing vocabulary, not registering point-claim rows in the story manager without an adapter.

`titles.js` reads supplied counter snapshots for kills, enemy kinds, critical hits, strongest hit, hits taken, deaths, character level, successful crafts, gathering, books, years, playtime and money. It saves earned IDs with timestamps, combines selected small bonuses, and exposes capped progress rows. It does not itself produce those counters. Neither skim proves recipe-specific craft history, slept hours, meal quality, relationship events, household credit, negative-action windows or offline parity. A global craft count cannot identify which recipe produced it, and inventory possession cannot establish production after offer. These gaps matter to QG1-QG3/QG5/QG10.

For UI proposals, the target is the existing desktop/laptop status window, provisionally 1366×768; the visible outcome is a legible have/need row, reason, state and reachable Claim. Mobile optimization and a new quest screen remain deferred. No rebuilt-browser UI claim is made here.

## Fiction: obligation, recognition and system personality

### SQ1: Solo Leveling, daily training and the penalty zone

**Stated, distributor recap:** episode 3 gives Jinwoo a daily exercise task, punishes noncompliance by sending him to a dangerous desert, and pays recovery and stat points on completion. Episode 12 shows a missed daily interrupting another quest through penalty-zone transport. Sources: [Crunchyroll episode 3 recap](https://www.crunchyroll.com/news/features/2024/1/23/solo-leveling-episode-3-recap), [episode 12 recap](https://www.crunchyroll.com/news/features/2024/4/2/solo-leveling-episode-12-season-one-finale-recap). These were available as indexed excerpts; the first full-page open returned no article text. Exact exercise totals, timing and reward counts across novel/manhwa/anime are not established here.

**Inferred:** clear compulsory training dramatizes a system with power over its holder. Transplanting it into an idle life-sim risks repetitive chores, interrupted plans and punishment for being away; direct stat awards may bypass ordinary training.

**Default:** borrow measurable progress and a clear consequence description. **Dial:** a harsh card could impose game-day obligations with a disclosed survival route. **Reasonably:** a penalty zone is substantive world content, not a red expired row. Supports QG1/QG7 and SC1; challenges QT1/QT2, PT5 and S1P.4. Its world dial is coercion, not merely quest frequency.

### SQ2: The Gamer, ordinary life read as quests

**Stated, official WEBTOON synopsis:** Jihan sees the world as a video game while juggling homework, quests and leveling. It verifies the ordinary-life interface premise, not a universal daily-reset or shop rule. [Official series page](https://www.webtoons.com/en/action/the-gamer/list?page=1&title_no=88).

**Inferred:** a system can make familiar actions legible and satisfying without inventing a separate arena. The failure risk is quantifying every conversation into an optimal farming route, or assuming an omniscient panel knows intentions and relationships.

**Default:** offer a task because a visible native pursuit exists. **Dial:** school, household or profession boards can vary their verb mix. **Reasonably:** QG5 can mirror a known NPC request with its attribution intact; QG8 can recognize looking at known information. Supports QG1/QG5/QG8, SW3/SW5 and DM3; challenges SC4 if answers outrun recorded knowledge. Per-world dial: how much daily life the interface observes. Specific quest payouts are unverified.

### SQ3: Dungeon Crawler Carl, achievements and boxes

**Stated, fan index with book/chapter references:** the dungeon AI recognizes specific acts, attaches distinctive commentary, and awards boxes or sometimes no material reward. A sign-reading achievement supplies interface information. [Book 1 achievement index](https://dungeon-crawler-carl.wiki/book-1/achievements/). The full index was readable, but its footer says it is generated; exact transcription was not checked against the book. The [publisher series page](https://www.penguinrandomhouse.com/series/43C/dungeon-crawler-carl/) separately establishes the game-show setting, not each achievement.

**Inferred:** recognition turns an unusual personal act into a story beat, while a reward's flavor can express the system's agenda. Box variance and escalating power can redirect players toward farming bizarre behavior; loud commentary can overwhelm routine idle activity.

**Default:** borrow occasional contextual recognition and concise voice. **Dial:** a showman card can offer surprise presentation or cosmetic boxes. **Reasonably:** preview the reward category and keep critical progression outside a random box. Supports QG8/QG9, SC1/SC5 and PT3; challenges PT5/S1P.4. World dials: reward variance, commentary density and whether the system's stated preferences actually influence rewards. Flavor rapport at stage 1 stays distinct from a mechanical patron economy.

### SQ4: Ave Xia Rem Y, grading not yet verified; institutional points verified

**Shown, author-posted chapter excerpt:** disciples spend points on isolation-chamber time. [Chapter 120, Royal Road](https://www.royalroad.com/fiction/15193/ave-xia-rem-y/chapter/715124/chapter-120-i-thought-long-and-hard-about-it). **Stated, fan wiki indexed excerpt:** the Eternal Flame Clan uses an internal point economy instead of outside currencies. [Eternal Flame Clan](https://ave-xia-rem-y.fandom.com/wiki/Eternal_Flame_Clan). Its full-page fetch was blocked.

**Unverified:** the requested “grading” mechanic. Searches did not locate a clear canonical task-grading rubric, payout formula or autonomous quest board. Sect tests and point spending do not prove one. Nor do Royal Road's author badges or reader ratings describe the fictional system. This is not a claim that grading is absent from the whole novel.

**Inferred:** faction credit can buy access to an institution's resources and make work socially situated. A possible graded-task adaptation risks opaque judgments and compulsory institution dependence.

**Default:** distinguish a sect's issuer/ledger from a private system's points. **Dial:** an institution could publish a rubric and pay quality-sensitive credit. **Reasonably:** that adaptation is a proposal, not a sourced Ave mechanic. Supports QG5 and PT2/PT3; challenges universal conversion under PT4 and a world-independent shop under PT5. World dial: institution, recognized quality and services purchasable there.

### SQ5: Omniscient Reader's Viewpoint, scenarios and one consequential currency

**Stated, fan wiki:** coins serve as system currency and can purchase stat increases and skills/items from shops, including the Dokkaebi Bag. [Coin](https://omniscient-readers-viewpoint.fandom.com/wiki/Coin). **Stated, series overview:** challenges are presented as scenarios managed by dokkaebi. [Series overview](https://en.wikipedia.org/wiki/Omniscient_Reader%27s_Viewpoint). This verifies an additional well-known system example at secondary-source level; no complete chapter was read.

**Inferred:** one currency links accomplishment, bargaining and survival, making spending consequential. Paying directly for stats can compress the ordinary progression loop, and survival costs can turn discretionary play into compulsory earning.

**Default:** preserve a traceable point source and meaningful reward choice. **Dial:** a patron or survival world can use more powerful purchases, debt or upkeep. **Reasonably:** their costs and progression consequences belong to that world rather than the Village pilot. Supports PT2/PT4 and SC1; challenges QT1 and PT5. Per-world dial: discretionary rewards versus survival resource, plus conversion boundaries.

## Idle and incremental games: persistent goals and compounding rewards

### SQ6: Melvor Idle, Township tasks are not simply midnight dailies

**Stated, mirrored developer update:** Casual Tasks arrive every five hours, accumulate up to five, and can be completed later; the announcement explicitly frames them as avoiding missed-day FOMO. [March 2023 update mirror](https://www.tuxdb.com/game/8765%26gamenews%3D1%26bdate%3D1679447587). This is a historical developer announcement reproduced by another site, not proof of the current build. **Stated, official-wiki indexed FAQ/shop:** main Township tasks gate shop goods; casual tasks help town growth. [FAQ](https://wiki.melvoridle.com/index.php/FAQ), [Shop](https://wiki.melvoridle.com/w/Shop). The task page returned 403; no retry was made.

**Inferred:** a banked queue preserves direction while allowing irregular returns. A full queue still loses potential future accrual, so “no FOMO” describes intent, not zero opportunity cost. Progression eligibility also does not guarantee a short or enjoyable task. A [player report](https://steamcommunity.com/app/1267910/discussions/0/3882722797155141444/) describes a disproportionately costly potion request; this is an anecdote, not a rate estimate.

**Default:** retain offered rows and offline-earned progress. **Dial:** later use a small banked board with disclosed capacity. **Reasonably:** copy banking before exact timers or shop gates. Supports QT1/QT2, QG1/QG6 and S1D2; challenges treating S1.6 as expiring calendar dailies and PT5 when tasks unlock exclusive goods. World dial: accrual cadence, bank size and meaningful effort range.

### SQ7: Idle Champions, guidance versus historical seasonal chores

**Stated, indexed developer blog:** Guide and Collection Quests span tutorial, feature and collection milestones; guide rows direct progress while collection rows recognize it. The developer says Seasons development was paused after Season 7. [Guide/Collection announcement and season context](https://codenameentertainment.com/?page=idle_champions&tag=guide+quests). Full-page access was restricted. Historical Season 7 used quest-linked rewards and exclusive cosmetics. [Season 7 developer post](https://www.codenameentertainment.com/?page=idle_champions&post_id=1605). These do not establish an active 2026 seasonal daily board.

**Inferred:** permanent guidance can orient a player in many interacting systems; time-limited quests can instead dictate formations and routine. A [2023 player thread](https://www.reddit.com/r/idlechampions/comments/16plvbp) complains about daily/seasonal quest navigation and friction. It supports that the complaint exists, not that all players share it.

**Default:** show the nearest useful known milestone. **Dial:** collection rows, onboarding chains or an optional event board. **Reasonably:** keep historical season evidence dated. Supports QG7, S1D2 and S1U.3; challenges QT1/PT3 where exclusive expiring rewards drive attendance. World dial: teaching versus collection, with event cadence separately configured.

### SQ8: NGU Idle, achievement multipliers and quest automation

**Stated, wiki:** achievements grant Bonus Points that increase Arbitrary Point gain; this is a point-earning multiplier, not a direct multiplier to every resource. [Achievements](https://ngu-idle.fandom.com/wiki/Achievements). **Stated, guide/wiki:** major quests accumulate to a cap, minor quests remain available, and idle questing trades reward/speed against manual collection. [Questing guide](https://sayolove.github.io/ngu-guide/en/mechanics/questing/), [Questing wiki](https://ngu-idle.fandom.com/wiki/Questing). The two describe the major accrual interval as roughly eight hours versus seven hours fifty minutes; exact timing is not settled here. AP and Quest Points are distinct currencies, not one universal quest wallet. [AP source table](https://ngu-idle.fandom.com/wiki/Arbitrary_Points).

**Inferred:** milestones make broad play feed future earnings, and automation can free attention. Compounding point income may make “optional” achievements economically compulsory; manual premiums can make the idle route feel inferior.

**Default:** keep pilot points a simple fixed receipt. **Dial:** later allow bounded earning bonuses or convenience purchases. **Reasonably:** compare the full idle/manual value, not just whether automation exists. Supports QG7, QT2/QT3 and PT3; challenges PT5 and humble S1P.5 if bonuses snowball. World dials: multiplier ceiling, bank cap and active premium.

### SQ9: Kittens Game, milestone records and reset rewards are different

**Stated, wiki:** achievements include civilization and constrained-run feats; the tab appears after the first achievement. [Achievements](https://wiki.kittensgame.com/en/game-tabs/achievements). **Shown, primary localization source:** named feats include building a ziggurat with one kitten and a magneto in Iron Will. [Game source strings](https://github.com/nuclear-unicorn/kittensgame/blob/master/res/i18n/en.json). **Stated, wiki:** achievements survive reset, while paragon has a separate reset calculation tied to population beyond 70. [Game mechanics](https://wiki.kittensgame.com/en/general-information/game-mechanics). This does not establish that every achievement pays spendable points or a production multiplier.

**Inferred:** records can preserve accomplishment while a new run changes the challenge. Long threshold grinds can encourage optimizing resets instead of caring about the settlement.

**Default:** keep title recognition separate from point transactions. **Dial:** a backing may retain knowledge/records while resetting a life's board. **Reasonably:** select inheritance separately for the card, wallet, offered work and historical receipts. Supports S1D3, QG3/QG7 and existing titles; challenges a blanket carry-all or reset-all policy. World dial: life-local versus lineage/meta achievement scope.

## Life sims: projects and requests with local meaning

### SQ10: Stardew Valley bundles, a lasting community project

**Stated, game wiki:** bundles require item sets, offer individual rewards, and completed rooms produce larger community benefits. [Bundles](https://stardewvalleywiki.com/Bundles). This is a project checklist, not a daily point board.

**Inferred:** a visible collection goal connects farming, gathering and exploration to a changed place. Seasonal availability can create a long wait after a missed item; completionism can push a preferred lifestyle aside. Directly copying unlock rewards into a cheat shop could also make the cheat replace native community work.

**Default:** later let a system recognize a known project step with a truthful why line. **Dial:** flexible ingredient slots, seasonal alternatives and community/household credit. **Reasonably:** an NPC project retains its ordinary completion and reward owner. Supports QG5/QG7/QG10 and QT1; challenges PT5/S1P.4 if points buy the completed project. World dial: collection breadth, season dependence and shared benefit.

### SQ11: Stardew Valley special orders, timed work after acceptance

**Stated, wiki:** special orders appear on a weekly board, have varying time limits, and some require gathering after acceptance; stored items alone do not satisfy those collection counters. [Quests, special-orders section](https://stardewvalleywiki.com/Quests#List_of_Special_Orders). The same page distinguishes untimed story quests and two-day Help Wanted tasks with no failure penalty. A life sim can support all three cadences.

**Inferred:** choosing a larger job turns a week into a purposeful project. Misreading the offer's remaining window, needing seasonal conditions, or doing production before acceptance can cause frustration. A deadline is not equivalent to punishment.

**Default:** the first system milestone waits. **Dial:** later accept a dated local contract whose count basis and remaining time are visible. **Reasonably:** distinguish possession, production since offer, delivery and final reporting. Supports QG1/QG5 and QT4/QT5; challenges QT1 only when a timed variant is deliberately selected. World dial: contract duration and calendar anchoring, not compulsory real-world attendance.

### SQ12: Animal Crossing, Nook Miles recognition and optional repeatable goals

**Stated, fan wiki:** Nook Miles recognize island activities; the upgraded Miles+ adds repeatable goals. [Nook Miles](https://nookipedia.com/wiki/Nook_Miles). The Nook Stop exchanges miles for cosmetics and functional goods, including unique convenience/recipe purchases. [Nook Stop](https://nookipedia.com/wiki/Nook_Stop). The separate login streak is SQ17.

**Inferred:** ordinary small acts become recognized progress, and a short renewable board can suggest something to do. An endless stream can turn relaxing activities into token farming; a functional shop can make chores a prerequisite for basic comfort.

**Default:** recognize a small variety of existing pursuits. **Dial:** cozy cards favor self-care/observation; ambitious cards alternate familiar and neglected activities. **Reasonably:** distinguish a cosmetic skin, an optional convenience, and a new native capability. Supports QG2/QG6/QG8, PT3 and SC1; challenges PT5 if ordinary functions are available only through points. World dial: variety, replacement cadence and power of redemption goods. Exact daily multiplier values were not verified in this pass.

### SQ13: Rune Factory 5, requests as teaching and local service

**Stated, fan wiki:** RF5's task board gives assignments that teach systems and unlock useful resources. [Requests (RF5)](https://therunefactory.fandom.com/wiki/Requests_%28RF5%29). **Stated, Japanese guide:** accepted board requests can be canceled without friendship loss and have no time limit; its random-request section warns of early requests for unavailable items and lineup changes after reload. [RF5 request guide](https://wikiwiki.jp/rf5/%E4%BE%9D%E9%A0%BC). These are secondary statements, not a reproduced native test; other Rune Factory installments may differ.

**Inferred:** tasks supply contextual teaching and reinforce known relationships. Resource unlocks can make request completion mandatory; impossible targets and reload-sensitive generation erode trust.

**Default:** mirror only a known measurable request. **Dial:** a tutorial board can suggest the next locally available action. **Reasonably:** retain NPC credit and distinguish the journal reward from a declared system bonus. Supports QG5/QG7, S1D2 and QT1/QT5; challenges S1.3/S1.7 when inaccessible or rerolled targets appear. World dial: tutorial/service balance and eligibility strictness.

## MMOs and gacha: cadence, choice, guarantees and attendance

### SQ14: Guild Wars 2 Wizard's Vault, objectives feeding a choice shop

**Stated, official support:** tasks award Astral Acclaim, spent on chosen rewards rather than only fixed track payouts. Cosmetics from earlier rotations remain in a legacy tab at a higher price; there is no premium Vault tier and acclaim cannot be bought with real money. [Official support article](https://help.guildwars2.com/hc/en-us/articles/19617357502867-Secrets-of-the-Obscure-Wizard-s-Vault). **Stated, official announcement:** objectives have daily, weekly and release cadences, with activity-mode selection. [Rewards announcement](https://www.guildwars2.com/en-gb/news/new-rewards-in-guild-wars-2-secrets-of-the-obscure/). These document the design; current numerical caps and payouts were not audited.

**Inferred:** choice converts varied activity into a personally useful purchase; retaining cosmetics reduces permanent missed-reward loss. Resetting objectives still creates attendance pressure, and a higher legacy price preserves an early-purchase incentive.

**Default:** stage 2 offers a stable, small catalog with readable prices. **Dial:** rotating featured offers with retained ordinary availability. **Reasonably:** an archive reduces one kind of FOMO, not all of it. Supports PT2/PT3, QG6 and SC4; challenges QT1/QT4 if copied as server-clock chores. World dial: activity preference, reward retention and rotation premium.

### SQ15: Genshin Impact battle pass, multiple mission windows

**Stated, wiki:** daily, weekly and pass-period missions feed Battle Pass EXP and reward tracks. [Battle Pass](https://genshin-impact.fandom.com/wiki/Battle_Pass). **Stated, developer patch notes:** weekly missions exist, and version 2.7 added carryover for weekly progress completed during update week. [2.7 notes](https://genshin.hoyoverse.com/en/news/detail/21202), [3.3 weekly-mission example](https://genshin.hoyoverse.com/en/news/detail/27964). These historical notes do not establish the current mission roster, weekly cap or prices.

**Inferred:** mixed windows create short goals inside a longer arc. Expiry and paid progression can generate FOMO, chore optimization or purchased skipping; a cap can discourage late catch-up even while limiting binge earning.

**Default:** use a finite personal arc that remains available. **Dial:** a world could have a season-long institution or festival record with catch-up. **Reasonably:** adapt the clear track before monetization, mandatory attendance or expiring functional rewards. Supports QG7/PT2 and a cadence dial for S1.6; challenges QT1/QT2/QT4 and PT5. World dial: window length, catch-up capacity and whether the arc expires.

### SQ16: Gacha pity, bound a random process rather than a quest

**Stated, official Genshin notices:** character-event guarantee counts are shared across the two character-event wish types and independent of other wish types. [2026 notice](https://genshin.hoyoverse.com/en/news/detail/163629). **Stated, official update:** the weapon Fate Point requirement changed to one in version 5.0, superseding the older two-point explanation. [5.0 mechanic announcement](https://genshin.hoyoverse.com/m/en/news/detail/125274), [older Epitomized Path explanation](https://genshin.hoyoverse.com/en/news/detail/103970). A guarantee for rarity and a guarantee for the desired item are distinct.

**Inferred:** pity bounds bad luck, but a visible nearly-filled counter can encourage further spending. It also needs an explicit eligible-attempt definition and carryover policy; “pity exists” does not describe those.

**Default:** stage-1 quest success is deterministic, with no loot roll. **Dial:** a later random cosmetic or discovery process could retain misses and state a bound. **Reasonably:** use UP5 for unlock chance; do not make points valuable only through uncertain purchases. Supports PT2 and UP5, with QG9 only for discovery-safe presentation; challenges PT3/PT5 if pity sells progression. World dial: process identity, guarantee kind and cross-life/banner continuity.

### SQ17: Login streaks, attendance is a different achievement

**Stated, Nookipedia:** using the Nook Stop daily raises its mile bonus over consecutive days; missing a visit resets that streak. [Nook Stop bonus daily Miles](https://nookipedia.com/wiki/Nook_Stop#Bonus_daily_Miles). **Stated, fan NGU wiki:** manual saving is listed as a once-daily AP source. [Arbitrary Points](https://ngu-idle.fandom.com/wiki/Arbitrary_Points). These demonstrate attendance/interaction rewards; the NGU example is not itself proof of a streak. Exact gacha login-reset semantics remain unverified.

**Inferred:** attendance bonuses give a quick reason to return, but opening a panel or pressing save does not show the character lived well. A missed login can destroy a record despite substantial offline activity.

**Default:** count qualifying game-day conduct, not browser presence. **Dial:** an expressly optional social/event attendance card could celebrate visits. **Reasonably:** keep cumulative visits and best streaks readable even when a current streak ends. Supports QG1/QG2 and QT4 only after adaptation; challenges QT2 and SC2 if prompt claiming becomes economic obedience. World dial: presence versus conduct, grace days and retained records.

## Roguelites and habit apps: experimentation, challenge and authored goals

### SQ18: Hades, prophecies as an experimentation checklist

**Stated, wiki/guide:** the Fated List offers rewards for completing tasks, with entries revealed through game/story progression and collection-style objectives among them. [Fated List wiki](https://hades.fandom.com/wiki/Fated_List_of_Minor_Prophecies), [Hades 2020 guide](https://www.neoseeker.com/hades-2020/Fated_List_of_Minor_Prophecies). The wiki full-page fetch failed; the indexed excerpt and guide support the general mechanism, not exact current totals.

**Inferred:** a checklist encourages trying options outside a habitual build, turning variation into progress. Random availability can turn the last missing option into a grind; a complete visible catalog can spoil discoveries or reward weak choices purely for completion.

**Default:** offer milestones only within the player's known catalog. **Dial:** a guide card suggests a neglected known skill, or recognizes newly discovered options afterward. **Reasonably:** QG9 concealment is governed by the world's spoiler dial, not a justification to reveal an unknown name. Supports QG6/QG7/QG9, QT1 and SW3; challenges S1.4 when the next step depends mostly on a rare roll. World dial: experimentation pressure and catalog visibility.

### SQ19: Slay the Spire, ascension is earned challenge, not a wallet

**Stated, game wiki:** clearing an Act 3 boss at an ascension unlocks the next level; modifiers are cumulative and progression is character-specific. [Ascension, Slay the Spire 1](https://slaythespire.wiki.gg/wiki/Ascension), [secondary wiki](https://slay-the-spire.fandom.com/wiki/Ascension). The first full-page fetch returned 403; these claims are indexed documentation. This is the first game's ascension ladder, not its daily climb or the sequel.

**Inferred:** earned difficulty supplies a new decision for mastery without purchasing raw power. Treating higher difficulty as the only meaningful progress can crowd out relaxed play; poorly disclosed cumulative modifiers make failure confusing.

**Default:** optional challenge milestones sit beside ordinary life goals. **Dial:** a martial card proposes harder constraints after demonstrated capability. **Reasonably:** the system can recognize an accepted challenge without forcing every peaceful life up a difficulty ladder. Supports QG3/QG7 and S1D1; challenges a combat-only board or PT5 if points substitute for the accomplishment. World dial: challenge opt-in, relevant capability and record scope.

### SQ20: Habitica, player-authored goals with rewards and reprieves

**Stated, official site:** users track Habits, Dailies and To Dos. [Habitica overview](https://habitica.com/static/front?iframe=yes). **Stated, wiki:** completing scheduled Dailies grants rewards and streak credit; missed due Dailies lose health and can harm a quest party. Resting in the Inn suspends one's missed-Daily penalties while allowing completion credit, but does not shield a player from another participant's quest damage. [Dailies](https://habitica.fandom.com/wiki/Dailies), [Rest in the Inn](https://habitica.fandom.com/wiki/Rest_in_the_Inn). These are indexed excerpts; official [data-display tooling](https://tools.habitica.com/) separately exposes expected Daily damage and streak records.

**Inferred:** authoring goals supports agency and makes an abstract pursuit concrete. Punishment can convert illness or absence into guilt; group damage can create unwanted social pressure. Self-report works for a habit app but is not an authoritative native action counter.

**Default:** later let the player author a goal from known trackable targets. **Dial:** schedules, partial checklists, grace and household participation. **Reasonably:** adapt authorship and reprieve separately from damage. Supports QG2/QG4/QG10, QT1/QT4 and SC3; challenges QT2 and flavor-only SC2 if absence hurts anyone. World dial: who authors the goal, who is credited and who bears failure.

## Contradictions and tensions to keep visible

| Code | Evidence or local tension | Consideration, not a resolution imposed on the project |
| --- | --- | --- |
| C1 | SW1's older stage shorthand versus later S1/PT and the current instruction | Use stage 1 earning / stage 2 spending in this draft; no owner was edited. |
| C2 | S1.6 proposes daily refresh and 3–5 rows; QT1 says quests wait; S1D2 proposes one initial row | Default: retain the pilot row. Dial: later new offers can arrive without deleting unfinished ones. Reasonably: distinguish refreshing offers from expiring commitments. |
| C3 | S1U.4 lists auto-claim settings; QT3 and audit D2 defer it | Default: manual pilot claim. Dial: later setting or purchase. Reasonably: choose the convenience's ownership when it becomes in scope. |
| C4 | Solo Leveling's coercion/power payouts versus Village patience/progression | Default: import legibility. Dial: a hostile card may supply different stakes. Reasonably: fiction that creates drama need not supply the default return loop. |
| C5 | Melvor's stated no-FOMO intent versus capped task banking | Default: preserve earned work. Dial: bounded accrual. Reasonably: disclose forgone future offers without equating them to lost existing progress. |
| C6 | “Idle Champions daily/season board” as a timeless example versus developer pause after Season 7 | Default: cite permanent guidance and date historical season evidence. Reasonably: no claim that the old seasonal structure is active now. |
| C7 | NGU major accrual described as eight hours versus seven hours fifty minutes | Default: take the banking pattern only. Dial: YAIRPG chooses its own game clock. Reasonably: do not import a disputed exact interval. |
| C8 | Older Genshin two-point weapon explanation versus later one-point update | Default: separate version and wish type. Reasonably: pity is a process-specific promise, not an assumed global counter. |
| C9 | Requested Ave grading versus evidence of sect points and tests | Default: retain the gap. Dial: explicit institutional grading remains a proposal. Reasonably: an internal currency does not establish automatic evaluation. |
| C10 | Local quest/title machinery versus richer verbs in QG | Default: generate from demonstrated observations. Dial: add a settled event contract later. Reasonably: the ability to accept a tag is not proof that a native producer supplies it. |

## Pattern table

All adaptations below are **inferred proposals**. Entries above carry the source URLs and evidence level. “Challenges” describes a design tension, not a reason to ban a world variant.

| Pattern | Reference and player purpose | Supports | Challenges | Default + Dial + Reasonably |
| --- | --- | --- | --- | --- |
| SQ1 | Solo Leveling: compulsory measurable training | QG1/QG7, SC1 | QT1/QT2, PT5 | Clear progress; coercion dial; a penalty needs a playable recovery route. |
| SQ2 | The Gamer: everyday pursuits become legible | QG1/QG5/QG8, DM3 | SW3/SC4 if omniscient | Known pursuit; observation dial; record facts rather than inferred intentions. |
| SQ3 | Carl: unusual acts receive expressive recognition | QG8/QG9, SC1/SC5, PT3 | S1P.4/PT5 | Occasional flavor; box/voice dial; separate recognition from power payout. |
| SQ4 | Ave: institutional points buy services; grading unverified | QG5, PT2/PT3 | Universal PT4/PT5 | Named issuer; rubric dial; any proposed grader is an adaptation. |
| SQ5 | ORV: scenario rewards fuel consequential spending | PT2/PT4, SC1 | QT1/PT5 | Traceable receipts; survival-economy dial; direct stat purchases materially change progression. |
| SQ6 | Melvor: banked casual tasks wait | QT1/QT2, QG6, S1D2 | Expiring reading of S1.6 | Retain rows; accrual/bank dial; capacity does not erase earned progress. |
| SQ7 | Idle Champions: guides and collection milestones | QG7, S1U.3/S1D2 | Historical seasonal FOMO | Near-next guidance; collection/event dial; date retired or paused structures. |
| SQ8 | NGU: achievements boost earnings; quests automate | QG7, QT2/QT3, PT3 | S1P.5/PT5 snowball | Fixed pilot points; bounded multiplier/active-premium dial; compare total value. |
| SQ9 | Kittens: records survive while reset rewards stay distinct | S1D3, QG3/QG7 | Blanket inheritance | Separate record/wallet/board; scope dial; title ownership stays existing. |
| SQ10 | Stardew bundles: a project changes a community | QG5/QG7/QG10, QT1 | S1P.4/PT5 project bypass | Recognize native projects; seasonal/shared-credit dial; retain the native payoff. |
| SQ11 | Stardew orders: accepted work has a defined window | QG1/QG5, QT4/QT5 | QT1 for selected contracts | Patient pilot; contract-window dial; label after-offer versus possession counts. |
| SQ12 | Nook Miles: small acts feed chosen rewards | QG2/QG6/QG8, PT3 | PT5 exclusive functions | Varied known acts; renewal/reward-power dial; comfort need not become an endless chore. |
| SQ13 | RF5 requests: teaching through local service | QG5/QG7, QT1/QT5 | S1.3/S1.7 bad generation | Known feasible request; tutorial/service dial; preserve issuer and reward ownership. |
| SQ14 | GW2 Vault: objectives buy chosen, retained rewards | QG6, PT2/PT3 | QT1/QT4 server-clock pressure | Stable catalog; rotation/archive dial; retained availability still can carry a premium. |
| SQ15 | Battle pass: small windows feed a longer arc | QG7, PT2 | QT1/QT2/QT4, PT5 | Persistent personal arc; expiry/catch-up dial; don't infer current caps from old notes. |
| SQ16 | Pity: constrain a particular random process | UP5, PT2 | PT3/PT5 random progression | Deterministic pilot; bounded cosmetic/chance dial; distinguish rarity from desired-result guarantee. |
| SQ17 | Login streak: reward attendance | Adapted QT4/QG1 | QT2, SC2 economic obedience | Game conduct; attendance/grace dial; keep best/cumulative records. |
| SQ18 | Hades: encourage experimentation | QG6/QG7/QG9, QT1 | S1.3/S1.4 unavailable targets | Known alternatives; visibility/randomness dial; avoid a spoiler checklist. |
| SQ19 | Ascension: earned optional difficulty | QG3/QG7, S1D1 | Combat-only progression | Side challenge; constraint dial; recognize capability without forcing escalation. |
| SQ20 | Habitica: author goals and schedule repeats | QG2/QG4/QG10, SC3 | QT2, SC2 punishment | Known-target authorship; schedule/credit dial; reprieve can exist without group damage. |

## Anti-patterns to avoid for an idle life-sim

| Code | Failure pattern and better default | Dial and reasonably |
| --- | --- | --- |
| AP1 | **Attendance masquerading as living:** rewarding login/Claim timing more than the character's actions. Prefer recorded qualifying conduct. | Optional attendance content can exist; it should describe what it actually counts. |
| AP2 | **Offline expiry races:** every sleeping game day replaces quests before the returning player can claim them. Prefer retained completion and one return summary, QT2. | Timed contracts can expire; distinguish expiration of incomplete work from disposal of earned rewards. |
| AP3 | **Board as a second job:** too many repeated rows, long exact-item grinds, or a reroll cost that traps the player. Prefer a small near-next board and an explanation of impossible rows. | Larger, harsher boards can be card fiction; the effort/reward range and exit matter. |
| AP4 | **Paying to erase the game's pursuits:** items, XP, completed native projects or unique essentials bought from cheap repeatable points. Prefer information, presentation or modest convenience. | A world can make its system the normal power route; its ordinary baseline then differs from the Village. |
| AP5 | **Unbounded compounding:** easier farming raises point income, which buys faster farming, which crowds out other lives. Prefer fixed pilot payouts and explicit ceilings for later bonuses. | Strong systems can grow rapidly; assess combined titles, boosts and point multipliers rather than each alone. |
| AP6 | **Invented observations:** inferring crafts from inventory, self-care from elapsed time, or social care from clicks. Prefer count semantics tied to real events and stored baselines. | Richer verbs become reasonable once their native observations and offline behavior exist. |
| AP7 | **Spoiler rewards and omniscient grading:** naming undiscovered goals or asserting hidden motives through a why line. Prefer known target IDs and bounded explanations. | Mystery/hostile graders can be wrong or obscure; show their epistemic status without exposing sealed truth. |
| AP8 | **Punitive personality:** a sulking voice quietly changes payouts or harms companions. Prefer flavor-only SC2 and reachable silencing. | Mechanical patron approval is a separate disclosed contract, not implied by a cosmetic voice. |
| AP9 | **Record loss disguised as refresh:** inherited points disappear, reload rerolls the board, or old saves receive invented quest history. Prefer saved identities, baselines and receipts. | Backing can reset a board or keep it life-local; name that scope before continuity is promised. |
| AP10 | **Duplicate reward ownership:** a journal request and its system mirror each pay the same native reward. Prefer one native completion owner, QG5. | A declared system bonus can be additional; label it separately so the receipt remains intelligible. |

## Five concrete suggestions for stage 1 and the stage 2 shop

These are proposals for review, not accepted requirements. Numerical examples below are illustrative and untested.

1. **A1: Start with one patient known-skill row.** Default: after S1D1's separate post-awakening trigger, target the next displayed level of one known, trainable skill, with have/need, a real why line, manual Claim and one point. The row waits and its claimed state remains readable. Dial: a second generic successful-craft delta row after that observation is settled; broader boards later. Reasonably: a truthful empty board is preferable to an inaccessible target. This adapts SQ2/SQ6/SQ7 and preserves audit D1-D3's bounded proposal, S1D2/S1D4 and QT1. The awakening's own title/kill is not fresh stretch evidence.

2. **A2: Make the first point a durable, intelligible receipt.** Default: show “Uses unlock later,” source, amount and game date, with a stored offer baseline and once-only claim. Dial: different earning pace under S1P.5, then a banked board. Reasonably: ordinary offline progress should count under QT2, but no unobserved history should be invented for legacy cards. Before implementation acceptance, save/reload/import would need to preserve the same row, balance and claimed receipt; duplicate claims and failed storage would need explicit checks. This adapts SQ6/SQ9/SQ14 and PT1/PT2. It is an acceptance suggestion, not a test result.

3. **A3: Give stage 2 a small stable catalog of understandable choices.** Default: an information purchase about an already-known recipe or seller, a cosmetic window skin/voice, and a modest optional board convenience. For a balance sketch, imagine prices of 2, 3 and 4 points against a one-point milestone; confirm that there are enough finite earnable rows before exposing those prices. Dial: archive rotating cosmetics, offer alternate native acquisition under PT5, or localize the shop to a guild/patron. Reasonably: knowledge is sold only when the card can legitimately read it; a purchased “hint” should not be an undiscovered route leak. This adapts SQ3/SQ4/SQ12/SQ14, PT3/PT5 and SW3/SC4. Permanent accumulation with no eventual useful spend is a separate risk.

4. **A4: Trial convenience before power in the shop.** Default: later auto-claim or batch-claim convenience with the same accounting and receipts; expose keyboard access, readable progress and quiet/off notifications without requiring purchases. Dial: a paid extra board slot or reroll, with a shown replacement and effort range. Reasonably: extra slots should improve choice rather than multiply required chores; if a mild focus boost is tried, an illustrative +5% known-skill XP for one game hour could be compared with baseline training before selection. Defer instant levels, chain-completing items and earning multipliers from this first shop proposal. This adapts SQ8/SQ14, QT3/PT3 and S1P.4 without treating the example rate as balanced.

5. **A5: Extend into authored life goals once their observations exist.** Default: let a player choose a known pursuit from a small grammar, then offer positive self-care or restraint goals with no attendance penalty. Dial: cozy guide, stern mentor, sect grader or hostile system; define window, failure, inheritance and voice separately. Reasonably: begin with counters already supplied, defer sleep/meal/social/household verbs until their native contracts are proved, and keep SC2 flavor-only in stage 1. Later a “three qualifying game days out of five” goal may be gentler than a reset-to-zero streak, but it needs a recorded game-day history. This adapts SQ1/SQ13/SQ18-SQ20 and QG2-QG4/QG6/QG10, QT4/QT5 and SC3. A player can keep living without servicing every offered goal.

## What could not be verified

| Code | Limit | Effect on this draft |
| --- | --- | --- |
| U1 | Ave Xia Rem Y's specific grading rubric, quest scoring and grade-to-reward formula | Unverified. Sect point spending is verified separately; institutional grading remains an explicitly inferred adaptation. A chapter reference would resolve the named gap. |
| U2 | Exact Solo Leveling exercise counts, deadline duration, box/stat amounts and adaptation differences; The Gamer's detailed quest payout/expiry rules | General premises are sourced. Exact numbers from memory are unverified and were not used to set balance. |
| U3 | Full Melvor task page, some Fandom pages, Codename full article and Slay the Spire wiki full page | Fetches were blocked or restricted. Alternate indexed excerpts, an update mirror, official sources and a guide were used; no inaccessible page was presented as fully inspected. |
| U4 | Current numerical caps/timers and complete reward tables for NGU, Melvor, GW2 and Genshin; current Idle Champions seasonal operation | Version-sensitive examples are dated or bounded. NGU timing disagreement is retained. No 2026 economy audit is claimed. |
| U5 | Exact Nook Miles+ multipliers, specific gacha login streak/reset rules, and general player fatigue incidence | Unverified. Nook Stop verifies a login streak; that is not evidence that all gacha calendars reset on a missed day. Fatigue/FOMO/grind/skip risks are inferred except the expressly attributed anecdotes. |
| U6 | Native YAIRPG production hooks for all QG verbs; offline parity, persistence of a future board, current concurrent AW fixes, and shop balance | Source skim establishes reusable vocabulary/counter catalog only. No implementation, build, browser play, persistence test or human acceptance occurred. Those would belong to an authorized implementation slice. |

Research artifact check: required reference families, code mappings, contradictions, SQ pattern table, anti-patterns, five suggestions and verification limits are present. This closes the draft-writing assignment only.
