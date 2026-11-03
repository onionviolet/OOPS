# Copy style sheet (proposal, 2026-11-03)

Status: **agent proposal (AD32), not accepted.** Weibao asked for a general prose pass on "UI lines, subtle stuff and more" and chose "inventory first" (2026-11-03, [record](../USER_VISION.md#ui-copy-pass-inventory-first-2026-11-03)). This sheet turns the [string inventory](../reviews/UI_STRING_INVENTORY_2026-11-03.md) into house rules for interface words, measured against the two games the shell comes from: YAIR (the upstream this fork keeps, MIT) and Proto23 (the accepted UI baseline, DSG1). Weibao asked to "consider prose from YAIR and Proto23 accordingly" (2026-11-03). It extends DSG3 (short, concrete, whimsical words), UR70-UR74 (meaning first, real behavior, one meaning across surfaces) and RPT12-RPT14 (Reports voice); where they conflict, those owners win. World voice is out of scope here: that is DSG13 and the deferred local-AI prose pass.

Target: desktop 1920×1080 at 14 and 21 px text (UR viewport targets). Mobile deferred.

## What the inventory found

Static scan, 41,478 candidate strings in 1,060 files; leads are prompts, not verdicts. One headless spot-check on a fresh day-3 game (live working-tree bundle, not rebuilt for this pass) confirmed F1 reaches the screen.

| Code | Finding | Evidence |
| --- | --- | --- |
| F1 | **Spec voice is the main problem.** Rulebook words reach players: "actual" (2,803 strings), "native" (1,143), "retained" (498), "supplied", "authored", "binding", "observer", "qualified", "proposal". | Settings on a fresh game: "Hunger off (native pacing). Weather off (native weather)… Native rain is retained." Refusals such as "Selected training needs its actual unlocked native zone owner." |
| F2 | **Dev validation text shares paths with player text.** camelCase names, "schema" and "Invalid…" strings sit in refusal returns that a UI may show. | "resolveWithPull needs a dayIndex number.", "Unsupported growth schema/profile/body." |
| F3 | **Bare refusals.** 121 refusals say what is missing but not why or what to do. | "Requires 10 coins.", "Cast place unavailable", "· unavailable" |
| F4 | **Plurals are not counted.** 585 templates put a number before a plural noun with no 1-case. | "${n} coins", "${n} rungs crossed" |
| F5 | **Numbers have no precision rule.** `toFixed` runs from 0 to 7 places; settings show "0.1905 stamina/minute". | ER11-N in the [micro-feel audit](../research/UI_MICRO_FEEL_AUDIT_2026-10-14.md) |
| F6 | **Labels mostly agree.** Sentence case wins 3,215 to 142; verb families overlap (Close/Cancel/Back/Leave; Study/Practice/Learn/Read) but many differ on purpose. | Inventory "Label verbs" |
| F7 | **The upstream shell is closer to the target than our text.** `src/data/*` and `index.html` (3,726 strings) keep YAIR's short, plain, second-person voice (see the reference section). Its slips are small: exclamations on refusals, a few typos, internal fragments in data fields. | "You can't do that without a shovel!"; "A crab the size of a small boulder" |
| F8 | **Small slips.** Lowercase person names beside capitalised ones ("village elder" / "Village neighbor"), "Item details · Pick an item first", a period-ending label, an all-caps save failure. | Fresh-game screen; inventory leads |

## Reference voices: YAIR and Proto23

Same scanner run over YAIR at `upstream/master` (`e3356432a`, 35 files) and Proto23's pinned HTML revision `e93a8cd` (the private copy under `docs/research/proto23/private/`, gitignored; no Proto23 text is added to Git, so its examples below are paraphrased). "Ours" leaves out the upstream shell. Strings of four or more words.

| Measure | YAIR | Proto23 | Ours |
| --- | ---: | ---: | ---: |
| Strings measured | 1,642 | 1,628 | 23,103 |
| Median words per sentence | 7 | 7 | 8 |
| Says "you" or "your" | 21.6% | 31.3% | 13.8% |
| Uses a contraction | 10.9% | 17.0% | 7.4% |
| Has a semicolon | 0.0% | 2.1% | 14.6% |
| Has a spec-voice word (CPY1 list) | 0.2% | 0.2% | 20.6% |
| Ends with "!" | 3.5% | 4.0% | 0.0% |

Sentence length is not the gap. Ours is the same length on average but packs two clauses into it with a semicolon, uses rulebook nouns, and rarely talks to the player. Its "!" rate of zero also reads flat beside both references.

What each reference does well (codes kept for the session and lanes):

| Code | Voice trait | Example |
| --- | --- | --- |
| V1 | **YAIR names things plainly and stops.** Descriptions are noun phrases or one short sentence, often with no closing period; skills say what they help with in a few words. | "Knowledge of useful plants and mushrooms"; "Ability to survive and function in high temperatures" |
| V2 | **YAIR jokes lightly and in passing.** A rhetorical "right?" or a deadpan aside sits inside an otherwise plain line. | "The more you eat the better you will be at digesting, right?" |
| V3 | **YAIR logs are bare facts in the past tense.** Who did what, with the number. | "Made some progress in quest: …"; "%HeroName% was critically hit" |
| V4 | **Proto23 says how a change feels, in second person.** Weather, food and status changes arrive as a short sensation (your clothes getting soaked, your stomach complaining, feeling a little better). 36 such lines. | paraphrased |
| V5 | **Proto23 refuses with an in-world reason.** Fog means you cannot see a metre ahead; you cannot read while asleep; your arms are too frail to hit anything. The refusal is a sentence about the world, not a missing flag. | paraphrased |
| V6 | **Proto23 splits flavour from effect.** An item or title has a wry description line, then a separate compact, coloured effect line in stat shorthand ("EXP Gain +8%, STR +1, New Title" style; 115 such lines). | shape, not text |
| V7 | **Proto23 deflates milestones.** Rank text undercuts the player: reaching a level is described as what an ordinary person manages anyway, or "not something to be proud of". | short fragment |
| V8 | **Both leave things to avoid.** Typos in both, alarm-style errors in YAIR ("An error has occured on loading! …"), lowercase fragments and raw HTML colour spans in Proto23. | — |

## Rules (proposed)

Each line is a default, its dial and the reason (AGENTS design framing).

| Code | Default | Dial | Reason |
| --- | --- | --- | --- |
| CPY1 | **Say it the way a person in the room would.** Player text uses plain words for what is there. "Actual", "native", "retained", "supplied", "binding", "observer", "qualified", "authored", "proposal" and "row" stay in docs and code. "Native rain is retained" becomes "Normal rain still falls". | A world's own term (a Beyonder's "acting") stays when the world uses it. An in-fiction clerk may talk like a clerk. | F1: the rulebook voice is the most common thing that makes the game read like a spec. |
| CPY2 | **Dev text stays off screen.** Validation messages with field names, schemas or "Invalid" go to the console or tests; the player gets the CPY3 shape instead. | A debug overlay on a test origin may show both. | F2; UR73 already keeps diagnostics out of player copy. |
| CPY3 | **A refusal says what, why, and what now,** with the reason in the world where there is one (V5). "Too dark to read here. Light a lamp or move to the hearth." / "Needs 10 coins (you have 4). Sell something at the trader." The "what now" names a control that exists (RPT14). | When no route exists yet, say so plainly ("Not open to you yet") rather than invent one. | F3; a bare "unavailable" sends the player hunting. |
| CPY4 | **Count before plural.** Use one helper for "1 coin / 2 coins"; no "(s)". | Mass nouns ("3 water") stay as they are. | F4. |
| CPY5 | **One precision per kind of number.** Money and counts: whole. Rates and multipliers: up to 1 decimal ("×0.8", "0.2 stamina/min"). Percentages: whole, or 1 decimal under 10%. Times: "3 min", "1 h 20 min", "about 30 min" for estimates (UR forecast wording). | Inspection panels may show more places when the player asks for detail. | F5; precision is noise unless it changes a choice. |
| CPY6 | **Sentence case everywhere** for labels, headings and tabs. Names of people and places are capitalised; roles are not ("the village elder"), but a role used as a name is ("Elder"). | Item and title names keep their own casing. | F6, F8. |
| CPY7 | **Buttons are verbs; one verb per action.** Close dismisses a view; Cancel stops work in progress; Back goes up one level; Leave exits a place or job. Study (from a source), Practice (repeat a skill), Learn (gain something new), Read (a text). | A world may rename a verb in its own voice when the action is the same (DSG13). | F6. |
| CPY8 | **Labels have no end period;** sentences do. Ellipsis is "…" and means "more follows" or a trailing voice, not "loading". | Character speech keeps its own punctuation. | F7, F8. |
| CPY9 | **Empty states point forward.** "Nothing here yet. Gather herbs at the verge to fill this." | A deliberately quiet panel may just say "Empty". | Many of the 411 empty-state strings stop at "No …". |
| CPY10 | **Calm errors.** No all caps, no "PLEASE CHECK CONSOLE". Say what was lost, what was kept and one next step. | — | F8: the save-failure message. |
| CPY11 | **Exclamations are rare and earned:** a win, a near miss, a character shouting, at about the references' rate (one line in 25 to 30). Not on refusals or errors. | Upstream shell lines may keep theirs until a slice touches them. | F7, V8; zero reads flat, YAIR's refusal "!" reads like scolding. |
| CPY12 | **Whimsy lives in the flavour half,** not the useful half. A joke sits beside a cost rather than replacing it (RPT14, DSG3). | A world can turn whimsy down (DSG13). | Keeps DSG3's tone without hiding information. |
| CPY13 | **Talk to the player.** Second person and contractions are the default for anything that happens to the character ("You're soaked", "Your hands are steadier"). | Reports about other people stay third person; a world may pick a cooler register (DSG13). | Both references are at 22-31% "you" against our 14% (V4). |
| CPY14 | **One clause per sentence;** a semicolon is a sign to split. Middots (·) join fields in compact labels and rows, not sentences. | Long-form reading surfaces may run longer (UR70). | Our 14.6% semicolons against 0-2% in the references. |
| CPY15 | **A changed state gets a felt line.** When weather, food, injury or a status changes, the Report gives a short sensation in second person next to the number (V4). | Repeats stack under RPT12 instead of repeating the line. | The number says how much; the line says what it is like. |
| CPY16 | **Flavour line, then effect line.** Items, titles, traits and skills show a short plain or wry description, then a separate compact effect line in stat shorthand (V6, UR70's meaning-first). Every effect also appears outside the prose. | A trait with no mechanical effect has only the flavour line, and says so if the player might expect one (UR72). | Proto23's split is the clearest way to keep whimsy and the useful half apart (CPY12). |
| CPY17 | **Milestones can tease.** Rank, title and mastery text may undercut the player in the deadpan way of V2 and V7. | A world sets how much (DSG13); grim worlds can drop it. | DSG3's whimsy, in the places a player reads for fun. |
| CPY18 | **Plain names, no padding (V1).** Skill and item descriptions start with what the thing is or helps with, in a few words, before any lore. | — | YAIR's best habit; our descriptions open with conditions and qualifiers. |

## How the pass runs

1. **Lint first.** Extend `scripts/ui_string_inventory.mjs` into a check for the CPY lines a script can catch (CPY1 word list, CPY2 camelCase or "schema", CPY4, CPY5 `toFixed` places, CPY8, CPY10, CPY14 semicolons). Report-only until slices land, then a test, so new code is right by default. The inventory's voice metrics track the gap to the reference table.
2. **Rewrite by surface, smallest first:** refusals (CPY3), then empty states (CPY9), then tooltips and settings (CPY1, CPY5), then Reports and logs (CPY13, CPY15), then item, title and skill text (CPY16-CPY18). Upstream shell text comes last and changes least: fix V8 slips, keep its voice.
3. **Each slice** names its files, keeps UR74 (one meaning across surfaces), rebuilds, and checks the changed text in the browser at 1920×1080 per AGENTS verification. Inventory rows alone do not prove what is on screen.

## Not decided here

The CPY lines, the verb split in CPY7, the precision table in CPY5 and the reading of the reference voices (V1-V8) are proposals. Nothing in the game has been rewritten yet.
