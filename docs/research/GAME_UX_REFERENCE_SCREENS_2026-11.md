# Game UX reference screens: how released games solve our problem screens

Accessed 2026-11-10 and 2026-11-11. Scope: mechanisms from released games that bear on the pitfalls PF1-PF31 (Round 6) and unknown marks UK1-UK7 (Round 7) in [the player experience audit](../audits/PLAYER_EXPERIENCE_CORE_AUDIT.md), aimed at the mixing counter, talk, Around you, Local life, Village actions and the person page. Proposals only (AD56); none of this is an accepted decision.

## How to read the labels

- **Stated** marks a claim supported by readable source text. The citation identifies whether it comes from the developer, a wiki or another writer.
- **Shown** marks something visible in a screenshot. A still image establishes layout and visible state at capture time.
- **Inferred** marks an interpretation for YAIRPG or a claim that still needs a direct check.

The Game UI Database remains inaccessible to this pass. The Potion Craft fandom wiki article bodies remain unavailable, so the Potion Craft update uses Steam screenshots and developer notes. Stardew’s Friendship and Player Menu articles were readable on the follow-up. The Melvor Game Guide, CDDA proficiency document and full Dwarf Fortress UI article remain open. Idle-game developer intent also remains open.

---

## 1. Alchemy and mixing

### Potion Craft: Alchemist Simulator

- **Shown**. The brewing screen puts the bottle marker and dotted path on the map, with the potion summary at left and stock at right. The cauldron and mortar are visible below. This is a dense work surface with a clear place for each part of the task (PF14, PF16, PF22). [Developer’s brewing screenshot](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1210320/ss_a5197ad5bb35e9899c9e751820cdb9dbc0ceb308.1920x1080.jpg).
- **Shown**. The Recipe Book replaces the central workspace with a saved recipe and its steps, ingredients and brewing controls. The right-hand inventory stays visible. The screenshot also shows a written description. [Developer’s Recipe Book screenshot](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1210320/ss_2ee267fdbdac585741df64403ff45a746cdf725a.1920x1080.jpg).
- **Stated**. Niceplay describes grinding and mixing ingredients to plot a route on the map, saving recipes to brew again, and giving potions custom names and label descriptions. Its notes mention the tutorial and progression through the Alchemist’s Path. [Steam store description](https://store.steampowered.com/app/1210320/Potion_Craft_Alchemist_Simulator/#about), [developer patch notes](https://steamcommunity.com/app/1210320/allnews/?l=english).
- **Stated in a secondary guide**. Map hazards and areas to explore help shape the player’s route. The indexed Recipe Book entry describes a notes field. [TechRaptor beginner guide](https://techraptor.net/gaming/guides/potion-craft-alchemist-simulator-beginners-guide), [Recipe Book index lead](https://potion-craft.fandom.com/wiki/Recipe_Book).
- **Inferred**. Use this as evidence for a stable stock column and preview that changes near the inputs, with a separate place for methods worth keeping. YAIRPG can convey a predicted change in words. The map does not establish a convention for unknown ingredient cells, and the stills cannot establish the order in which controls are introduced (UK1, UK2, PF16, PF22).

### Potionomics

Links: [Steam discussion on ratios](https://steamcommunity.com/app/1874490/discussions/0/5254037276327223026), [Gamepressure recipe guide](https://www.gamepressure.com/newsroom/potionomics-recipe-for-the-best-potions/ze4b80).

- Recipes are ratios of five magimin types, and ingredients are charged with those types. Stated (guides). Bears on PF5: the unit is a short ratio, not a sentence of counts.
- A recipe menu on the brew screen lists the recipes you hold and unlocks over time through progress and competitions; players can also find recipes by improvising. Stated (guides, community). Bears on UK2 (known by being given vs known by trying).
- Players report that extra ingredients on a near-perfect mix lower quality. Stated (community). Inferred: the screen shows quality as you build, so feedback comes before commit. Bears on the mixing preview line.
- I could not confirm how the screen marks magimin values of ingredients you have not tried. Inferred only; check a screenshot. <!-- slip-ok: summarized source guidance, not a design rule -->

### Third game: Outer Wilds ship log (a knowledge map, not alchemy)

Links: [PC Gamer review text via PressReader](https://www.pressreader.com/usa/pc-gamer-us/20190226/281612421645145), [Wikipedia](https://en.wikipedia.org/wiki/Outer_Wilds).

- The log records found places and rumours, and links between clues, updating as you learn. Stated (review). Bears on UK3 (a page per subject that fills in).
- A fan page says unresolved leads show with a question mark and "more to explore" cues. Unverified, one low-quality source. Inferred; treat as a lead to check in a screenshot, bears on UK1.
- I could not find a verified third alchemy game. Strange Horticulture, Little Alchemy and Wildermyth returned nothing usable.

---

## 2. Unidentified items

### Caves of Qud

Links: [Artifact examination](https://wiki.cavesofqud.com/wiki/Identify), [Unidentified artifacts](https://wiki.cavesofqud.com/wiki/Unidentified_artifacts), [Artifact](https://wiki.cavesofqud.com/wiki/Artifact).

- Unknown items keep a placeholder look and a generic name until examined. Stated. Bears on UK1 (the mark sits on the thing, name and icon both).
- Three levels: unidentified, partly identified (the name becomes a more specific type), fully identified (usable). Stated. Matches UK2's ladder almost exactly. Bears on UK2.
- The check depends on the character (intelligence, tinkering skill) and the item's complexity; success is a degree, not a yes/no. Stated. Bears on UK2, UK5 (who identified it matters).
- Players narrow a guess from weight, trade value and name before identifying. Stated (wiki). Bears on UK4: a belief built from clues, held before proof.
- A failed attempt can break the item, and confusion always reads as a break and never identifies. Stated. Bears on UK4 (a wrong belief can stand). <!-- slip-ok: summarized source guidance, not a design rule -->

### NetHack

Links: [Discoveries](https://nethackwiki.com/wiki/Discoveries), [Price identification](https://nethackwiki.com/wiki/Price-ID), [Object identification spoiler](https://www.chiark.greenend.org.uk/~damerell/games/nhid.html).

- A discoveries list, opened by one key, shows what you have identified, including types you named yourself. Stated. Items the game tells you about but you have not met carry a leading asterisk. Stated. Bears on UK3, UK6: one page, known entries only plus a marked "told but not met" class. <!-- slip-ok: summarized source guidance, not a design rule -->
- You can name an unknown type with your own label ("call"), and the label shows in place of the generic name. Stated (search summary of the wiki). Bears on UK4, UK5.
- Price offers from shopkeepers are an indirect clue; a sell offer is steadier than a buy price. Stated. Many types share a price, so the result is a short list, not an answer. Bears on UK4 and PF28 (clues narrow, numbers do not confirm).
- Inferred: the unknown name stays visible in the inventory ("a cloudy potion"), so an unknown is described by what you can see, not by the word "unknown".

### Shattered Pixel Dungeon (optional)

Not researched; no source read. Omitted on purpose.

---

## 3. Disco Elysium

Links: [Dev blog on active skill checks](https://discoelysium.com/devblog/2016/10/06/active-skill-checks), [Gamepressure skill checks](https://www.gamepressure.com/disco-elysium/skill-tests/zfe3e2), [Skills wiki](https://discoelysium.fandom.com/wiki/Skills).

- Active checks are options phrased as what your character attempts, not what will happen. Stated (dev blog). Bears on PF4 and talk wording.
- Hover on a check shows the chance of success, built from skill, modifiers, items and thoughts. Stated (dev blog, Gamepressure). A player guide advises reading the modifier list, not only the percent. Stated (guide). Bears on PF28 and PF22: cost and odds sit on the option, where the choice is made. <!-- slip-ok: summarized source guidance, not a design rule -->
- Passive checks show no chance; they run quietly and a success adds options or lines. Stated. Bears on PF2 and PF14: most knowledge arrives as extra lines, not as a panel.
- White checks are safe gates: failing costs a little and the option greys out until the skill rises or the situation changes. Red checks fail for real and cannot be retried. Stated. The game shows the retry rule through the option itself. Bears on PF12 (the reason lives with the option, once).
- Conversation sits in a bottom panel over the scene portrait; the thought cabinet is a separate corner screen. Inferred from general knowledge, not checked. Bears on PF18 (talk in place) and PF17.
- Skills speak as characters inside the dialogue, labelled by name. Inferred. Bears on UK5 (where knowing came from is part of the line).

---

## 4. Dense simulation screens

### Dwarf Fortress (Steam)

Links: [PC Gamer on the new UI](https://www.pcgamer.com/the-new-dwarf-fortress-ui-looks-so-much-better), [PC Gamer on mouse support](https://pcgamer.com/tutorials-and-mouse-support-could-make-dwarf-fortress-on-steam-vastly-easier-to-play), [workshop overhaul](https://www.pcgamesn.com/dwarf-fortress/workshops).

- The Steam release added mouse support, tooltips and a reworked interface over the keyboard menus. Stated (PC Gamer headlines and summaries).
- Several workshop functions were merged into one window with clickable buttons for workshops and their tasks. Stated (search summary of dev diary coverage). Bears on PF18 (one place to do the task) and PF22.
- One reviewer said the old interface had a reliable logic that kept the map separate from menu information, and the redesign lost some of that. Stated (review, paraphrased). Bears on PF16: a fixed map area is a feature, and the redesign shows the cost of losing it.
- Inferred: the map stays in the centre while menus open at the side, so opening a menu does not move the map. Not checked.

### Cataclysm: Dark Days Ahead

Links: [Proficiency doc](https://docs.cataclysmdda.org/PROFICIENCY.html) (404), [forum: proficiencies](https://discourse.cataclysmdda.org/t/proficiencies-how-do/24388), [forum: starting recipes](https://discourse.cataclysmdda.org/t/starting-recipes/28295).

- Recipes you cannot attempt are hidden from the craft list unless your skills are near enough to have a chance. Stated (forum reply). Bears on PF13 and UK6.
- Proficiencies are a dependency graph that changes craft time and failure; players say they do not appear in the character menu until you have them, and that working on a recipe that uses one can start learning it. Stated (forum). Bears on UK2 and UK7.
- A player complained the craft screen gives no failure chance for proficiency recipes, and another proposed a separate proficiency screen to avoid clutter. Stated (forum). Bears on PF14 and PF28: a missing odds line is felt as a gap, and the fix proposed was a separate page.
- Inferred: the craft menu is a list plus a detail pane for the selected recipe, so detail is per selection rather than per row.

---

## 5. Relationships

### Stardew Valley

- **Stated in the wiki**. The Social tab shows hearts, gifts given this week and whether the player spoke to the villager today. Hearts summarize a point total at 250 points per heart. The ordinary pre-dating cap for a marriage candidate displays the last two hearts as unavailable until a bouquet, while points can accrue just short of the next heart. [Player Menu](https://stardewvalleywiki.com/Player_Menu#Social), [Friendship](https://stardewvalleywiki.com/Friendship#Point_system).
- **Stated by the developer**. The NPC profile opens from the Social tab and records birthdays and gift preferences as they are discovered. [Official 1.4 changelog](https://www.stardewvalley.net/stardew-valley-1-4-update-full-changelog/).
- **Shown in the 1.4 developer image**. Emily’s portrait, hearts, birthday and status sit at left. On the right, a category page groups discovered gift icons into Loved, Liked and Disliked rows with empty space after the entries. The hearts use distinct filled, outlined and unavailable appearances. [Gift Log screenshot](https://www.stardewvalley.net/wp-content/uploads/2019/11/giftlog-1024x576.png).
- **Stated in the modding wiki**. The default Social tab policy replaces an unmet NPC’s name with `???`. Data can also hide an NPC until met or show their name in advance. [NPC data, social features](https://stardewvalleywiki.com/Modding:NPC_data#Social_features).
- **Inferred**. Keep relationship state separate from knowledge of a person (UK2, UK3, PF28). A person page can group observed preferences while the overview gives a readable relationship summary. The screenshot does not establish that each blank slot represents a particular undiscovered item.

### RimWorld

Links: [Opinion](https://rimworldwiki.com/wiki/Opinion), [Social](https://rimworldwiki.com/wiki/Social).

- Each colonist has a social tab with opinions of other colonists and their relatives. Stated.
- Opinion is a number built from traits, appearance, chats and actions, and fight effects last a set number of days. Stated. Opinion moves for named reasons that expire. Bears on UK5 and PF26.
- Whether a hover lists every modifier was not confirmed (a guide says the full breakdown needs developer mode). Unverified. Inferred: the game hides the arithmetic in the base view. Bears on PF28.

### Fire Emblem: Three Houses

Link: [Support system explained](https://twinfinite.net/guides/fire-emblem-three-houses-support-system-explained/).

- Support is shown as ranks C, B, A (some pairs have plus steps, one pair reaches S). Stated. A rank is a word-like step, not a number. Bears on PF28 and UK2.
- Points come from acting together; the guides say the game shows when a point is earned. Stated (guide, one source). Bears on PF26: rank comes from shared doing, not repetition of one click.
- Persona 5: not researched (no source).

---

## 6. Incremental onboarding

### Melvor Idle

Links: [Adventure guide](https://testwiki.melvoridle.com/w/Adventure/Guide), [v0.17 notes](https://wiki.melvoridle.com/w/V0.17), [Epic beginner guide](https://store.epicgames.com/news/melvor-idle-beginners-guide).

- A short Game Guide tutorial covers the key systems. Stated (wiki).
- A bank redesign was made for new players. Stated (patch notes via search).
- In Adventure mode you start with only melee unlocked and pay a rising cost to unlock each other skill. Stated (wiki). Bears on PF14: unlocking is a choice with a price. <!-- slip-ok: summarized source guidance, not a design rule -->
- The wiki says it is hard to see how the skills connect until you use them. Stated. Bears on PF2: connections are learned by playing.
- Inferred: a left sidebar lists skills and unlocked ones appear as they open.

### Antimatter Dimensions

Link: [Steam page](https://store.steampowered.com/app/1399720/Antimatter_Dimensions/); [how-to via search](https://aarextiaokhiao.github.io/NG-plus-3/howto.html) (a related mod's page, not the base game).

- Dimensions unlock one by one through a shift, not all at once. Stated (guides).
- A spoiler setting shows only the content you have and the next piece to unlock. Stated (how-to via search, a related project). Bears on PF14 and UK3: show the current step and one step ahead, hide the rest. <!-- slip-ok: summarized source guidance, not a design rule -->

### Kittens Game

Link: [Steam page](https://store.steampowered.com/app/1097410/Kittens_Game/).

- Players describe elements unlocking slowly over play, and a commenter says there is always something to do but nothing instant. Stated (community). Inferred: resources and tabs appear on first use. Not verified. <!-- slip-ok: summarized source guidance, not a design rule -->

---

## Patterns worth absorbing

Each is a default with a dial and a reason, proposed under AD56. Codes name the source game and the pitfalls or marks it bears on.

1. **Mark the exact cell, not the sentence** (Caves of Qud placeholder names, NetHack asterisk; UK1, PF13). Default: a single `?` on the cell, field or name that is not known, with a hover that says how to find out. Dial: a world can spell the word out, or hide the mark when the count of unknowns would itself spoil. Reason: the player sees what is missing without reading a grid of the same word. Fits: mixing counter, person page.
2. **Fold what has nothing known into one line** (CDDA hides recipes you cannot attempt; NetHack lists known entries; UK6, PF13). Default: rows with no knowledge collapse to "Untried: A, B, C". Dial: the fold opens on click; a world can show them all. Reason: the table shows what the player has learned, not what they lack. Fits: mixing counter, person page.
3. **Three steps of knowing, each its own look** (Caves of Qud unidentified, partial, full; UK2, UK4). Default: unseen, seen, tried, known, mastered, with partial knowledge replacing the generic name by a more specific one. Dial: a world can use fewer steps. Reason: the reader can tell a guess from a fact at a glance. Fits: mixing counter, person page, Local life.
4. **A guess keeps its question mark** (NetHack "call", Qud clue-narrowing; UK4). Default: a belief shows as a word plus `?` until tested; the player may be wrong and the game lets it stand. Dial: how long hearsay lasts. Reason: wrong beliefs make testing worth doing. Fits: mixing counter, person page, talk.
5. **Odds sit on the option, where you choose** (Disco Elysium hover; PF22, PF28, PF12). Default: an option shows what the attempt is and, on hover, what it costs and how likely it is, with the reason once. Dial: a character who has not earned the odds sees words ("a long shot") instead. Reason: no scanning elsewhere, and exact numbers stay earned (UR151). Fits: talk, Village actions, Local life.
6. **Most knowledge arrives as an extra line, not a panel** (Disco Elysium passive checks; PF2, PF14). Default: a skill or fact that applies adds a line or an option in the scene. Dial: how often it fires per world. Reason: the player gets what applies without opening anything. Fits: talk, Around you.
7. **Keep useful context in place** (Potion Craft’s right-hand stock column shown, Dwarf Fortress review of lost separation; PF16, PF18). Default: a list stays put and the selected item's detail opens next to it. Dial: a view may take the centre when the task is a long one. Reason: nothing moves that the player did not touch. Fits: mixing counter, talk, Village actions.
8. **Show the current step and a next lead** (a spoiler setting in a related Antimatter Dimensions mod, Melvor Adventure mode; PF14, PF15). Default: controls and panels appear after the first use, with one hint for the next. Dial: a replay or a returning player can show everything. Reason: a first screen with eight controls teaches none. Fits: mixing counter, Village actions, Local life.
9. **A page per subject that fills in** (Stardew Gift Log shown, NetHack discoveries stated; UK3). Default: group what the character has learned. Mark a particular missing fact when the character has reason to expect it. Dial: show a progress count for a known set where it helps the player decide what to pursue. Reason: progress stays readable and a visible total can itself reveal information. Fits: person page, mixing counter.
10. **Rank as a word, number earned** (Fire Emblem support ranks, Stardew hearts over a hidden total; PF28, PF26). Default: relationships show a rank word or a few steps; exact points appear on hover only once earned. Dial: per world. Reason: a word reads at a glance, and the hidden total keeps the system real. Fits: person page, Around you, talk.
11. **Say where it came from** (RimWorld named opinion reasons that expire, Qud identifier skill; UK5). Default: a known value's hover says how you know it (tried, told by someone, read), and hearsay can fade. Dial: per world. Reason: the player learns whom to trust. Fits: mixing counter, person page, talk.
12. **Let the player keep their own notes** (Potion Craft recipe book names and notes, NetHack "call"; UK4, PF2). Default: a saved method or a belief accepts a short label by the player. Dial: auto-fill a plain default. Reason: the player's words replace a manual. Fits: mixing counter, person page.

## A mixing counter sketch

Proposed 1920×1080 desktop walkthrough for comparison with the current rework. The first visit shows one row of plain stock with buy buttons and a single Mix button, with no method or process selects; those appear after the first vial is mixed, and the second visit shows them as a quiet fold. The title and first line are one (no "Village mixing counter" twice, no sentence explaining the controls), and a ratio such as two plants to one water replaces "(0 free, short 1)" shorthand. The ingredient table lists only what has any knowledge, each known cell a short word and each exact unknown cell a single `?` whose hover says "drink one dose to learn what it does", while the untouched ingredients fold into one line, "Untried: River bellleaf, Emberseed, Mellow salt". A first try gives a seen-level row (what it looks like), a drunk vial fills cells at the tried level with a `?` after a guessed word, and a repeat confirms it, so a belief and a fact look different. Hover on a known cell says how you know it, and mastered numbers appear only after earned repetition (UR151). A "Next try" line stays as one hint, with the set-up button beside it, and the buy buttons and quantities keep their place when the table grows or folds, so nothing under them moves. Show the cost and any known material risk beside Mix before it commits. A short reason and next step appear at the same point when the player cannot proceed. Put optional detail, such as how the character learned an effect, behind a keyboard-reachable control.

## Open gaps for a later pass

- Official Potion Craft brewing and Recipe Book images and the Stardew 1.4 Gift Log are visually checked. A first-session capture would establish the order of disclosure. A capture of Stardew’s unmet rows would complement the written policy. Direct codex and dialogue references remain open.
- Persona 5, Shattered Pixel Dungeon and a third alchemy game were not covered.
- Dev-intent statements for the idle games were not found; those patterns are inferred.
