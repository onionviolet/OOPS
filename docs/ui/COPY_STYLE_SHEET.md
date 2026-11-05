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
| V3 | **YAIR receipts are bare facts.** Who did what, with the number; finished work and combat hits read in the past, what happens to you now reads in the present (round 2 measure: 58% present). | "%HeroName% was critically hit"; "You fail to notice anything interesting" |
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
| CPY16 | **Flavour line, then effect line.** Items, titles, traits and skills show a short plain or wry description, then a separate compact effect line in stat shorthand (V6, UR70's meaning-first). Every effect also appears outside the prose. | A trait with no mechanical effect has just the flavour line, and says so if the player might expect one (UR72). | Proto23's split is the clearest way to keep whimsy and the useful half apart (CPY12). |
| CPY17 | **Milestones can tease.** Rank, title and mastery text may undercut the player in the deadpan way of V2 and V7. | A world sets how much (DSG13); grim worlds can drop it. | DSG3's whimsy, in the places a player reads for fun. |
| CPY18 | **Plain names, no padding (V1).** Skill and item descriptions start with what the thing is or helps with, in a few words, before any lore. | — | YAIR's best habit; our descriptions open with conditions and qualifiers. |

## How the pass runs

1. **Lint first.** Extend `scripts/ui_string_inventory.mjs` into a check for the CPY lines a script can catch (CPY1 word list, CPY2 camelCase or "schema", CPY4, CPY5 `toFixed` places, CPY8, CPY10, CPY14 semicolons). Report-only until slices land, then a test, so new code is right by default. The inventory's voice metrics track the gap to the reference table.
2. **Rewrite by surface, smallest first:** refusals (CPY3), then the message log (CPY19-CPY22 and CPY26, after round 2's runtime capture L1, since it is the most-read surface in idle play), then empty states (CPY9), then tooltips and settings (CPY1, CPY5, CPY25), then Reports (CPY13, CPY15), then item, title and skill text (CPY16-CPY18). Upstream shell text comes last and changes least: fix V8 slips, keep its voice.
3. **Each slice** names its files, keeps UR74 (one meaning across surfaces), rebuilds, and checks the changed text in the browser at 1920×1080 per AGENTS verification. Inventory rows alone do not prove what is on screen.

## Round 2: other games, the log and other aspects (2026-11-03)

Weibao: "What about other games worth learning from? We need to consider improving our logs too? More to consider? Other aspects?" Codes continue from round 1.

### Correction

V3 said YAIR logs run in the past tense. A rough tense count on lines that open with "You" or a name and a verb says otherwise: YAIR 58% present (74 lines), Proto23 80% present (138), ours 51% present (943). The references put what happens to you now in the present and keep the past for receipts. V3 is fixed above.

### What the log already does

Keep and cite these; round 2 adds nothing that duplicates them.

- Message filters by kind, saved with the game (upstream `message_filters`)
- Combat repeat folding, compact or detailed (UX18, `combatRepeatMode`)
- An "N new" anchor that holds your reading position (ER11-P3)
- The return digest, with time as a phrase (RPT6, TC8-TC11)
- Per-world Reports voice (RPT12-RPT13, `reportVoice`) and the cast-line defaults RPT1-RPT14

### Findings

| Code | Finding | Evidence |
| --- | --- | --- |
| F9 | **Log counts in the inventory are a floor.** 152 `log_message(` call sites; 79 pass literal text, the rest pass a variable built earlier, so the 203 "log/report" rows undercount. | grep of `src/` |
| F10 | **Tense mixes in one stream.** | "You recorded your reading of the return question." next to "You swear the vow of the …" and "You sit a while with …" |
| F11 | **System and dev text lands in the message log.** RPT11 keeps it out of Reports, not out of the log as a whole. | "Reset rejected; current authority kept."; "A pack is an object."; "Dev save was not found. Loaded live version save." |
| F12 | **Every line has one weight.** A level-up, a missed invitation and a routine gather share the stream; colour by kind is all that tells them apart (`message_critical` exists but nothing routes by importance). | `src/display.js` `log_message` kinds |
| F13 | **Raw units in news.** The event feed says "opens in N game minutes" while the return digest already phrases time (TC9). | `src/event_feed.js` |
| F14 | **Vague progress receipts.** "Made some progress in quest" does not say which step. Fragment joins (", making do with what is short", "${…} finished${…}.") break plural and tense rules. | `src/quests.js`, `src/tools_domain.js`, `src/clock_owner.js` |

### Games worth learning from

Evidence label: **unchecked recall.** These come from memory of the games, not from their docs or a play session this pass, and no game text is quoted (L2 checks them). None of these titles appear in the [similar-games](../research/SIMILAR_GAMES_BEYOND_PROTOLIKE_2026-10-30.md) or [micro-feel](../research/UI_MICRO_FEEL_AUDIT_2026-10-14.md) docs yet, so this list does not duplicate them. They were picked for contrast, not as more idle games.

| Code | Game | What to learn | Lands in |
| --- | --- | --- | --- |
| G1 | RimWorld | Three weights: letters that stay until read, with a jump-to button; short messages that fade; alerts that hold while a condition lasts and clear when it is fixed. | CPY20 |
| G2 | Cataclysm: DDA and roguelike logs | Repeats fold with a count, severity has colour, and sounds arrive as what you could perceive and from which direction. | CPY21, RPT2 |
| G3 | NetHack | Status changes arrive as "you feel" lines, and your state filters the text itself: hallucination renames things, blindness turns sights into touch and sound. | V4, CPY15, A1 |
| G4 | A Dark Room | The log is the story. Lines are very short, sparse at the start, and the world's description grows richer as you build. | CPY24 |
| G5 | Fallen London, Sunless Sea | Wry second person, then each stat change on its own plain line; failures get flavour as good as successes. | V6, CPY16, CPY22 |
| G6 | Kingdom of Loathing | Every item and effect carries a joke, while the effect line stays exact. | CPY12, CPY17 |
| G7 | Dwarf Fortress | Announcements and combat reports are separate logs; settings choose which announcements pause or pop up; Legends holds long memory. | CPY20 dial, RPT9 |
| G8 | Caves of Qud | Generated prose on a fixed grammar; item text puts lore first with stats always beside it; a terse second-person log. | CPY18 dial, A1 |
| G9 | Disco Elysium | A check names the skill, the odds and the result in one line before the prose; skills talk as voices. | CPY23 |
| G10 | Crusader Kings | Event cards: flavour, then buttons labelled as in-character replies with the effect in a tooltip; terms inside tooltips open their own tooltips. | CPY25 |
| G11 | Melvor Idle | Coming back shows what was gained while away, item by item. | RPT6 extends to gains |
| G12 | Elin and Elona | A chatty life-sim log: people bark, small events happen around you. It works because filters tame it. | CPY20, RPT5 folding |
| G13 | Darkest Dungeon | A narrator speaks on big moments and stays quiet otherwise, rate-limited so the lines stay special. | CPY11, CPY17 |
| G14 | Cogmind | A terse main log, a separate combat log with the maths on demand, and tooltips that show how a number was computed. | CPY23 |

### Rules (proposed, continuing)

| Code | Default | Dial | Reason |
| --- | --- | --- | --- |
| CPY19 | **One tense per kind of line.** What happens to you now: present ("You swear the vow"). Receipts of finished work: past ("Sold 3 pelts", "Finished the book"). What others do in front of you: present, as witnessed (RPT2). | A world with a narrated, storybook voice may run all of its lines in the past. | F10; the references sit at 58-80% present for what happens to you. |
| CPY20 | **A message's weight picks its surface.** Routine: the log, may fold. Notable: the log, highlighted, counted in the unread anchor. Must-see: the log plus a card that stays until read, with a jump button (G1). Condition: an alert that stays while the state holds and clears itself (hungry, soaked, a deadline). Colour is backed by a cue: each weight also has a word or icon, and screen readers announce must-see lines and skip the rest. | Per-kind settings, as the filters already allow; a world may promote a kind (a debt world makes payment dates must-see). | F12. Reuses `message_critical` and the filters; a new store waits for a second consumer (AR1). |
| CPY21 | **Fold repeats in every kind,** combat and beyond. Four "Gathered 3 herbs" become one line with a count or a summed total. | Detailed mode keeps each line, as UX18 does. | G2; idle play repeats the same line all day. |
| CPY22 | **An outcome line contains the outcome.** "Made some progress in quest" becomes "Quest 'The Ledger': found the second page (2 of 3)". A failure says what was lost and what stayed. | — | F14, G5. |
| CPY23 | **Show the working on demand.** The line gives the result; hover or the inspector gives the roll, the odds and what changed them (G9, G14). | A world that hides odds in its fiction (divination) shows a plain word ("a fair chance") and says the odds are hidden. | AD38: a visible mechanism is how the player knows things work by how they work. |
| CPY24 | **Log density grows with the world.** A fresh start is sparse; lines get richer as you learn places and people (G4). | Per world (DSG13). | A first hour that opens on system text reads like a test harness. |
| CPY25 | **Tooltips come in layers.** First line: what it is. Second: what it does. Deeper, on hold or click: the terms explained, which may open their own tooltips (G10). | Compact rows show just the first line. | UR70 meaning-first without hiding detail. |
| CPY26 | **System messages follow the same voice.** Save, load, import, reset and pack messages follow CPY10; developer text goes to the console (extends RPT11 from Reports to the whole log). | A debug overlay on a test origin may show both (CPY2). | F11. |

### Other aspects

| Code | Aspect | Disposition |
| --- | --- | --- |
| A1 | **Perception filters the text.** Your state changes how lines read: fever blurs names, drink garbles, a sight-based power (Spirit Vision) adds colours and auras, blindness turns sights into sounds (G3, G8). Fits AD38 and RPT2's witness levels. | LATER (L5) |
| A2 | **Pronouns and names come from records.** Templates take a subject and resolve name and pronoun from the person record (RPT4), instead of a hard-coded "he" or a pasted name. | ACCOUNT FOR NOW in every slice |
| A3 | **Whole sentences, not joined fragments.** Fragment joins break CPY4, CPY19 and any later translation. Slices replace them with whole-sentence templates that take values. | ACCOUNT FOR NOW in every slice |
| A4 | **Idle-scale numbers.** Item-log counts switch from raw to exponent at one million (ER11-N16); a suffix or scientific setting belongs with CPY5. | LATER |
| A5 | **Hints that retire.** First-time hints say how to do a thing once, then stop. | LATER |
| A6 | **The log as a life's journal.** Export the log and chronicle as a readable account of one life (the life-sim north star). | LATER |

### Disposition

- **ACT NOW (done):** V3 corrected; F9 recorded, so lint numbers for the log read as a floor; log moved up to second in the rewrite order; round saved here.
- **ACCOUNT FOR NOW:** A2, A3 and CPY20's non-colour cue in every slice; the refusals slice applies CPY19 and CPY22 to any sibling lines it touches.
- **LATER / DELEGATE:**

| Code | Work | Level, effort | Done check |
| --- | --- | --- | --- |
| L1 | Runtime log capture: drive the game MCP through fresh-day3 and two other worlds, dump every log line with its kind | sonnet, small | A local JSON of real lines; the inventory report cites its counts beside the static floor |
| L2 | Check G1-G14 against official docs or wikis | haiku, small | Each row relabelled developer-documented or community-reported, with a link |
| L3 | CPY20 weights: map existing kinds to weights, a must-see card for level-ups and missed invitations | sonnet, medium | Rebuilt, checked at 1920×1080; filters still save and load |
| L4 | CPY21 folding for gather and craft lines | sonnet, small to medium | An idle hour of gathering shows folded lines; focused test passes |
| L5 | A1 design note: perception-filtered text with two worlds' examples | sonnet, medium | A palette section naming the states, the filter and the cost |
| L6 | Lint additions: tense mix per kind, fragment joins, raw "game minutes" | haiku, small | Report-only lines in the inventory output |

### L1 done: runtime log capture (2026-11-03)

Weibao: "Log capture". `node scripts/ui_log_capture.mjs` plays three headless routes on the full game: the scripted village route, an idle day and a Tingen crossing as a Nighthawk probationer (seed 20261014). It reads every message-log line from the DOM with its kind, compact form, tooltip and fold count. Report: [UI_LOG_CAPTURE_2026-11-03](../reviews/UI_LOG_CAPTURE_2026-11-03.md). 50 lines, so this is a sample of real play, not a census, and the static floor (F9) still applies.

| Code | Finding | Evidence |
| --- | --- | --- |
| F15 | **Spec voice is not in the log.** 0 of 50 lines carry a CPY1 word; the log reads close to YAIR (median 7 words, 18% "you", no semicolons). F1 lives in panels, refusals and tooltips, so the log slice is about weight, kinds and folding, not wording. The one spec line is the tooltip on every date line. | Date-line tooltip: "Authored legacy numeric calendar; not a sourced civil date." |
| F16 | **Navigation chatter fills the first minutes.** 14 of 50 lines (28%) are "X is now available in navigation."; the Tingen day logged five of them and nothing from the world itself. | "Statistics is now available in navigation."; "Leads is now available in navigation." |
| F17 | **Lines with no kind.** 12 of 50 log as kind `undefined` (quest started, item obtained, manual save), so the kind filters cannot sort them and they carry no repeat key. | "Started a new quest: Lost memory"; "Hero obtained "Old axe x1"" |
| F18 | **Repeats fold only when keyed and adjacent.** Folding for non-combat lines already exists (`report_repeats.js`, ×N): gathering folded "Gained "Rough wood log" x1" ×2. "Saved the game manually" shows four times, twice back to back, because it has no kind. CPY21 narrows to: give every line a kind, and fold near repeats into a total. | Village route |
| F19 | **One action, two lines.** A craft writes "Craft settled: Low quality iron ingot ×1 from 1 attempt." and then "Created Low quality iron ingot x1". | Village route |
| F20 | **Receipts mix voices.** "Hero obtained …" (third person, hero name) sits beside "You have gained …"; "x1" beside "×1"; item names in quotes in some lines, not others. | Village route |

Disposition: F16, F17 and F19 go to L3 (CPY20 weights: navigation unlocks become one folded notable line or a badge) and L4 (folding). F20 joins the log rewrite under CPY13 and CPY19. The tooltip in F15 is a one-line fix for the next refusals or tooltip slice. Agent-verified, not human-reviewed; the routes are headless (no viewport), which is fine for text capture and makes no layout claim.

## Slice 1: home-world refusals (2026-11-03)

Weibao chose "Yes, refusals slice". Scope: refusal and reason lines in `src/main.js` and the Frontier files, the world a fresh game opens in. 28 rewrites in six files (`main.js`, `crafting_frontier_runtime.js`, `original_frontier_field_content.js`, `original_frontier_campaign_ui.js`, `village_career_ui.js`, `village_content.js`), applying CPY1, CPY3, CPY4, CPY13, CPY14 and CPY19.

| Before | After |
| --- | --- |
| Restore writable saving. (5 places) | Saving is paused, so this can't run right now. |
| Saving is unavailable. (run, investigate) | Saving is paused, so you can't practice running. / … you can't investigate. |
| Requires 2 stamina for a journey; travel falls back to walking. | Too tired to run: you need 2 stamina. You'll walk instead. |
| Requires free accessible housing, Sleeping 5 and your meal. | To rest here you need a free bed you can use, Sleeping 5 and a packed meal. |
| Requires an accessible alchemy station before crafting. | Crafting this needs an alchemy station you can use. Around you lists the stations here. |
| The selected observer needs present consent, a living usable body and their own real rope. | Your observer must agree, be here, be fit to climb and bring their own rope. |
| The held batch needs N more played minutes before collection. | The batch on the brazier needs N more minutes (1 minute when N is 1). |

"Saving is paused, so …" matches the wording LotM already uses. Save-validation messages in `village_career.js`, `village_family.js` and the brazier checks are developer text (CPY2, CPY26) and stay as they are. A later pass moves them off screen if any reach it. Left for the next slice: the "Restore writable saving before …" errors (two in `main.js`, one in `hp_brewing_domain.js`) and "Recover above one HP", which several worlds share (UR74).

Checks:
- 15 focused test files that cover these modules or strings: 112 of 112 pass.
- `npm run build`: passes.
- The rebuilt bundle was checked in headless Chrome at 1920×1080. Setup: scenario fresh-day3, seed 7, Running and Perception XP added to the save, and a second tab on the same origin. In that tab, Practiced actions shows "Saving is paused, so you can't practice running." and "… you can't investigate." The first tab shows the normal lines. No page errors.
- Not exercised on screen: the low-stamina, rest, alchemy, brazier, field-trial and watchcraft lines. They are implemented and covered by tests, but no screen check yet.

Agent-verified, not human-reviewed.

## Empty states slice (2026-11-03)

Scope: the empty states a fresh home-world game shows (fresh-day3, seed 7), then other panels a player opens often. The work list came from a headless sweep of all 22 top-nav routes and 51 known panels (`scripts/capture_empty_states.mjs`), not from inventory rows alone. 34 strings rewritten (39 places) in 24 source files, applying CPY9, CPY1, CPY8, CPY13 and RPT14. The sweep also showed that Reports, Travelers, Neighbors and Projects are not empty on a fresh game. They were collapsed, so they needed no new line.

| Before | After |
| --- | --- |
| Item details · Pick an item first | Item details · Select an item in Inventory |
| Study · Nothing here can be studied yet | Study · Ask around for someone to teach you |
| Nothing here can be studied yet. Lessons, books and odd things you meet will appear here once you start on them. | Nothing to study yet. Ask the people around you what they could teach, and their lessons show up here. |
| Other worlds · No optional world installed | Other worlds · No other world is open to you yet |
| Ledger · Nothing owed or recorded yet | Ledger · Take a commission to start one |
| Village only (six panels) | Go back to the Village to use this |
| No work running. | No work running. Pick something under Here to start. |
| No saved receipts yet. | No saved receipts yet. Accept a commission and each step is kept here. |
| No assist leased. | No assist leased. Spend points from finished commissions to lease one. |
| No equipment yet. / No usable items or books yet. / No materials, components or loot yet. | Each adds a step: "Buy or loot gear to see it here." / "Buy, cook or find something to eat, use or read." / "Gather or craft some to see them here." |
| No home yet. The Village home supplier rents and sells places to live; a wild site lets you build one from gathered material. | No home yet. Rent or buy one from the Village home supplier, or build one at a wild site from gathered material. |
| No installed furnishings. | No furnishings yet. Carry one here to install it. |
| You carry no tools. | You carry no tools yet. Any you pick up show here with their wear. |
| No spillable stock carried | Carry a vial or ingredient pack to spill |
| No authored site is applied. | None of your own places is in use. Fill in the draft and press Apply site. |
| No story has taken shape yet. Rivalries and debts appear here once the saved record shows them. | No story has taken shape yet. Rivalries and debts show up here as they form. |
| No recent cause. Prices follow standing alone. | Nothing has moved prices lately. They follow your standing alone. |
| No one has repeated a price to you. | No one has passed a price to you yet. Trade a little and people start to. |
| Nothing here can be gathered. | Nothing to gather here. Where I am lists nearby places to try. |
| No known people, services or stations to inspect here. | Nothing here to inspect yet. Talk to someone in Local actions to meet them. |
| No known subjects here | Nothing here to inspect yet |
| Nothing to name yet | Equip something to name it |
| No known people to show here / No learned routes to show here / No local notes are available here | Meet someone to see them here / Travel a road to learn its route / Nothing noted here yet |
| No commitments are running. | Nothing running. Start work or take a job and it shows here. |
| No combat facts observed yet. | Nothing noticed about this opponent yet. Trade a few blows to learn more. |
| Relationship: No remembered dealings. | Relationship: You have not dealt with them yet. |
| No known unfinished waypost opportunities. | Nothing left unfinished at the wayposts you know. |
| Nothing is left to temper in this slice. | Nothing is left to temper for now. |
| Nothing has shown an effect yet. | Nothing has shown an effect yet. Drink another preparation and note what changes. |
| No numbers this item adds to what you wear. | Wearing this adds nothing to your stats. |

The first draft of the work line said "Open local controls to start something". That button is hidden when no work runs, so the line now names the Here tab, which is always on screen (RPT14). The Study line names no particular lesson. Studies are listed only after the player hears of them (AD6), and the first home one needs the craftsman meeting, which a fresh game does not have yet.

Left as they are:
- Quiet on purpose (CPY9 dial): "No shield", "No active effects", "No station", "No worn title", "Nothing held", "No quality rating", "No moments are waiting.", "Nothing weighs on you." These are slot labels or calm status lines where a pointer would be noise.
- Already point forward: the Known things kinds ("Defeat an enemy and it is recorded here." and the rest), "Gather a material and it is tallied here.", "Equip something and it can be named here.", the skill, bestiary and book list empties, "No project is offered here. Try another place.", the owed-ledger empty text, "Hold or wear a second piece of equipment…", "No items in this inventory. Gather, loot or buy items…", the Travelers intro.
- No step that holds in every world yet: "No paths known yet.", "No techniques known yet." and the Knows glance "Nothing learned yet." These are shared across worlds, and each world reaches them differently.
- Developer text and disclosures (CPY2), not empty states: "No stock, money, deed or debt is granted by meeting the residents.", the "No … may precede actual …" checks, the inspector's "No retained … owner" lines, and the thrown error in `authored_site.js` (only its UI twin changed).
- Book-world files and the refusal files (`main.js`, `crafting_frontier_runtime.js`, `hp_brewing_*`, `village_career*`, `village_content.js`, `original_frontier_*`) are outside this slice.

Noticed for later slices: the Ledger panel is titled "Work Ledger" (`main.js`, CPY6). Statistics says "Per-activity time and per-world tallies are not recorded yet." (CPY1). Trade standing shows "no policy" in lower case.

Checks:
- 23 focused test files for the touched modules, including the three updated for changed strings (`inventory_tabs`, `panel_directory`, `research_view`): all pass except `book_world_lotm_opening`. That file fails at HEAD too, because `canon_pull_panel.js` does not export `canonPullVisible`.
- `npm run build`: passes.
- Full `npm test`: 4931 pass, 20 fail, 17 skipped. The same 20 fail on a clean HEAD checkout (`book_world_lotm_opening`, `conflict_frame` ×15, `place_act_sequence`, `reach_run_admission`, `cast_worksheet`, `lead_run_crosswalk`; the last two also fail at HEAD when run alone). None of them touches this slice.
- Headless Chrome at 1920×1080, rebuilt bundle, fresh origin, fresh-day3 seed 7, via `node scripts/capture_empty_states.mjs <dir> --grep …`: 18 of 18 new lines found on screen with no page errors. The 12 unchanged since the first pass are on bundle 7f625b3b1336: Other worlds, ledger assist and receipts, home, story, spill, own places, tools, both trade standing lines. The 6 on the final bundle f84d876cc880 are the Item details and Study reasons, the work line, receipts, home and tools. The screenshots confirm the ledger lines.
- Not exercised on screen: the inventory category hints (the Other tab was not clicked), Where I am, the inspect target, notebook reasons, Travel Today, combat inspection, the waypost, temper, preparation, furnishing and item-card lines, and "Go back to the Village to use this" (needs a game away from the Village). They are implemented but not yet checked on screen.

## Slice 2: leftovers, Tingen and Harry Potter refusals (2026-11-03)

Scope: the slice 1 leftovers, the six shared "above one HP" lines (UR74, changed together), then player-facing refusal and reason lines in the Tingen (LotM) and Harry Potter code a fresh game can reach. 62 lines (61 refusals and one button label) at 75 sites in 24 source files, applying CPY1, CPY3, CPY4, CPY13, CPY14 and CPY19. The inventory tag was a starting point, not the list. The Polyjuice bench reasons thrown in `hp_brewing_state.js` reach the button through `quote()`, so they are in. Source-audit notes in the LotM row files are not player text.

| Before | After |
| --- | --- |
| Restore writable saving before study. / … before study conditioning. | Saving is paused, so you can't study right now. / … so study conditioning can't change right now. |
| Restore writable saving before using the HP bench. | Saving is paused, so you can't use the Polyjuice bench right now. |
| Recover above one HP before this trial. (5 variants) | You're too badly hurt for this trial. Heal until your health is at least 2. |
| Use your current living native body in the Village, above one HP and free of another encounter. | You need to be in your own body in the Village, with health of at least 2 and no other fight under way. |
| Wake first: you are asleep. (10 places) | You're asleep. Wake up first. |
| Need Sailor, breath & duty officer. | You need the Sailor's long breath working and the duty officer here. |
| Need the taught protocol, current G3 custody and cleared group, and 3 stamina. | You need the protocol you were taught, the grade 3 item in your keeping, the cleared group and 3 stamina. |
| Not written yet: that route carries pulls and claims this build has no rules for. | Not written yet: that route brings pulls and claims the game has no rules for. |
| … is a stated loss-of-control risk. | … risks losing control. |
| A fresh book life is unavailable in this host. | This life isn't open to you yet. |
| Begin the slice first. / Begin the Polyjuice slice (button) | Set up the Polyjuice bench first. / Set up the Polyjuice bench |
| That costs N coins and you hold M. | That costs N coins. You have M. (1 coin when N is 1) |
| This bench supports carried portions and private bench storage. Recipient and native chest transfers are not connected. | You can carry portions or keep them on your bench. Giving them away or moving them to a chest isn't possible yet. |
| The pinned method does not predict this ingredient replacement. Experimenting remains possible. | The recipe doesn't cover this swap. You can still try it as an experiment. |
| A proposed physical arrangement is not a demonstrated result. | Nobody has tried this mix yet, so the result is unknown. |
| The hand-preparation service is unavailable here. | No one here prepares ingredients by hand. |

Checks:
- Focused tests: 90 files for the touched HP, LotM, cast, Frontier, combat-fit, village-study and UI-contract modules. `hp_brewing`, `hp_brewing_domain`, `hp_preparation`, `hp_material_preparation` and `hp_ingredient_substitution` pass 50 of 50 after the pinned regexes were moved to the new wording (three test files). Failures in `conflict_frame` (15 "road old/runner") and `cast_worksheet` (1) also fail on a clean HEAD checkout. `book_world_lotm_opening` fails to import `canonPullVisible` from `canon_pull_panel.js`, also at HEAD. Under load (load average 42), the seven `cast_*` adapter files failed their "live integration … real save validator" tests. Rerun one at a time with load near 6, those files and five save tests (`save_compatibility`, `native_save_fixtures`, `world_pack_save`, `structured_pack_runtime`, `book_world_native_binding`) pass 72 of 72 with no failing subtests. Also run: nine more files covering UI contract, player text, village study, combat fit, Tingen districts, clearance and ritual, and Frontier, 46 of 46. `npm run check:arch` passes. The full `npm test` was not run.
- `npm run build`: passes.
- The rebuilt bundle was checked in headless Chrome at 1920×1080, scenario fresh, on a test origin. Tingen workroom: "Not written yet: that route brings pulls and claims the game has no rules for." shows, and the old wording is gone. Polyjuice bench, in a first tab and in a second, read-only tab: the button reads "Set up the Polyjuice bench", and the reason shows as visible text and as the button's title. No page errors.

Gaps:
- The bench line also shows in the first, writing tab, where the game bar says "Saving available." The bench's `writable` port (`tradeWritable` in `main.js`) returns false there; `persist` is wired. The old line ("Restore writable saving …") was just as wrong. The cause is runtime, not copy, and is left for its own fix.
- Not exercised on screen: the "above one HP" set, the sleep line, the Tingen district, clearance and ritual lines, and the "Can't be undone on this save" cost (a returnable save shows "Your Village life pauses" instead).
- Left as they are: Harry Potter school pack text (`book_hp_life_data.js`, `book_hp_school_extension.js`). Its content hash is stored in saves (`structured_pack_state.js`) and pinned by the school extension, so rewording needs a pack revision with a migration. "Cast unavailable: private pack absent" and its sibling labels change as one family in a later slice. "TC01" in the bench reason is an item naming question. Spell adapter dial reasons, the `div_supply` notes and the LotM source-row notes are developer text (CPY2).
- Follow-up outside copy: find why `tradeWritable` is false for the Polyjuice bench in a fresh, writing tab and fix it, so the bench opens and the paused line only shows when saving really is paused.

Agent-verified, not human-reviewed.

## Not decided here

The CPY lines, the verb split in CPY7, the precision table in CPY5, the weights in CPY20 and the reading of the reference voices (V1-V8, G1-G14) are proposals. Slices 1 and 2 rewrote refusal lines under these proposals. The rules themselves are not accepted.


## Runtime-log sample reconciliation, 2026-11-04 (B171)

The complete [UI log capture](../reviews/UI_LOG_CAPTURE_2026-11-03.md), this owner’s F15–F20 application and selected header/reference context were read. Keep its50 lines/three headless routes as a bounded text sample: zero CPY1 words in sampled visible line bodies does not mean the whole game or every tooltip is free of developer wording. Five sampled tooltips contain the date explanation; the report’s displayed example is one distinct repeated text. Twelve undefined-kind messages still exist as text even though kind filters cannot sort them. Existing adjacent keyed repeat folding was observed, so L4 is a refinement, not a missing folding engine.

The9 readable-subject/verb tense classifications are a subset of50, not the grammar distribution of all lines. Navigation chatter, duplicated craft receipts and mixed voice retain F16–F20 as concrete leads at their current producers. Existing owner dispositions already route them; this does not create a duplicate queue or endorse all CPY rules. Current UR70–74/RPT and Nov4 prose direction govern: use meaningful state, task voice, fitting whimsy and truthful historical outcomes, not a target percentage of second-person wording or punctuation. Old already-saved observations keep their original text unless an explicit scoped repair is chosen. No layout, current-runtime freshness, screen-reader or whole-log census claim follows; the full copy-sheet body remains independently reviewable.
