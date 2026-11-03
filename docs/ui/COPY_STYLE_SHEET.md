# Copy style sheet (proposal, 2026-11-03)

Status: **agent proposal (AD32), not accepted.** Weibao asked for a general prose pass on "UI lines, subtle stuff and more" and chose "inventory first" (2026-11-03, [record](../USER_VISION.md#ui-copy-pass-inventory-first-2026-11-03)). This sheet turns the [string inventory](../reviews/UI_STRING_INVENTORY_2026-11-03.md) into house rules for interface words. It extends DSG3 (short, concrete, whimsical words), UR70-UR74 (meaning first, real behavior, one meaning across surfaces) and RPT12-RPT14 (Reports voice); where they conflict, those owners win. World voice is out of scope here: that is DSG13 and the deferred local-AI prose pass.

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
| F7 | **The upstream shell has its own older voice.** `src/data/*` and `index.html` (3,726 strings) use exclamations, "..." and Title Case. Attribution stays; wording can follow this sheet where it is ours to change. | "You can't do that without a shovel!" |
| F8 | **Small slips.** Lowercase person names beside capitalised ones ("village elder" / "Village neighbor"), "Item details · Pick an item first", a period-ending label, an all-caps save failure. | Fresh-game screen; inventory leads |

## Rules (proposed)

Each line is a default, its dial and the reason (AGENTS design framing).

| Code | Default | Dial | Reason |
| --- | --- | --- | --- |
| CPY1 | **Say it the way a person in the room would.** Player text uses plain words for what is there. "Actual", "native", "retained", "supplied", "binding", "observer", "qualified", "authored", "proposal" and "row" stay in docs and code. "Native rain is retained" becomes "Normal rain still falls". | A world's own term (a Beyonder's "acting") stays when the world uses it. An in-fiction clerk may talk like a clerk. | F1: the rulebook voice is the most common thing that makes the game read like a spec. |
| CPY2 | **Dev text stays off screen.** Validation messages with field names, schemas or "Invalid" go to the console or tests; the player gets the CPY3 shape instead. | A debug overlay on a test origin may show both. | F2; UR73 already keeps diagnostics out of player copy. |
| CPY3 | **A refusal says what, why, and what now.** "Needs 10 coins (you have 4). Sell something at the trader." The "what now" names a control that exists (RPT14). | When no route exists yet, say so plainly ("Not open to you yet") rather than invent one. | F3; a bare "unavailable" sends the player hunting. |
| CPY4 | **Count before plural.** Use one helper for "1 coin / 2 coins"; no "(s)". | Mass nouns ("3 water") stay as they are. | F4. |
| CPY5 | **One precision per kind of number.** Money and counts: whole. Rates and multipliers: up to 1 decimal ("×0.8", "0.2 stamina/min"). Percentages: whole, or 1 decimal under 10%. Times: "3 min", "1 h 20 min", "about 30 min" for estimates (UR forecast wording). | Inspection panels may show more places when the player asks for detail. | F5; precision is noise unless it changes a choice. |
| CPY6 | **Sentence case everywhere** for labels, headings and tabs. Names of people and places are capitalised; roles are not ("the village elder"), but a role used as a name is ("Elder"). | Item and title names keep their own casing. | F6, F8. |
| CPY7 | **Buttons are verbs; one verb per action.** Close dismisses a view; Cancel stops work in progress; Back goes up one level; Leave exits a place or job. Study (from a source), Practice (repeat a skill), Learn (gain something new), Read (a text). | A world may rename a verb in its own voice when the action is the same (DSG13). | F6. |
| CPY8 | **Labels have no end period;** sentences do. Ellipsis is "…" and means "more follows" or a trailing voice, not "loading". | Character speech keeps its own punctuation. | F7, F8. |
| CPY9 | **Empty states point forward.** "Nothing here yet. Gather herbs at the verge to fill this." | A deliberately quiet panel may just say "Empty". | Many of the 411 empty-state strings stop at "No …". |
| CPY10 | **Calm errors.** No all caps, no "PLEASE CHECK CONSOLE". Say what was lost, what was kept and one next step. | — | F8: the save-failure message. |
| CPY11 | **Exclamations are rare and earned:** a win, a near miss, a character shouting. Not on refusals. | Upstream shell lines may keep theirs until a slice touches them. | F7. |
| CPY12 | **Whimsy lives in the flavour half,** not the useful half. A joke sits beside a cost rather than replacing it (RPT14, DSG3). | A world can turn whimsy down (DSG13). | Keeps DSG3's tone without hiding information. |

## How the pass runs

1. **Lint first.** Extend `scripts/ui_string_inventory.mjs` into a check for the CPY lines a script can catch (CPY1 word list, CPY2 camelCase or "schema", CPY4, CPY5 `toFixed` places, CPY8, CPY10). Report-only until slices land, then a test, so new code is right by default.
2. **Rewrite by surface, smallest first:** refusals (CPY3), then empty states (CPY9), then tooltips and settings (CPY1, CPY5), then Reports and logs, then upstream shell text.
3. **Each slice** names its files, keeps UR74 (one meaning across surfaces), rebuilds, and checks the changed text in the browser at 1920×1080 per AGENTS verification. Inventory rows alone do not prove what is on screen.

## Not decided here

The CPY lines, the verb split in CPY7 and the precision table in CPY5 are proposals. Nothing in the game has been rewritten yet.
