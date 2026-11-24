# Rules that force filler words (2026-11-22)

Weibao: "audit other rules too, What I meant by that is like discriptors that dont add much like 'fresh' and stuff that kind of exposes the Ai prose and design choices". The trigger was the foe bar words "Fresh", "Hurt" and "All fresh", which repeated what the fill already showed and were removed on 2026-11-21. These are findings and proposed rewrites, not accepted decisions.

**Method.** A read-only sweep of the UI rules (UR1 to UR177, working copy), the prose rules (PRS1 to PRS13), the play-surface rules (PS) and the design rules (DSG), plus a grep of `src/` for the text each rule produces. I checked the four worst strings in the source myself. Nobody looked at them rendered, so some of them may show only on hover or in inspection.

**What is fine.** The prose rules do not cause this: PRS6 and PRS9 push against filler. The design rules have no rows that require words. UR108, UR139, UR146 and UR165 were already loosened by another session's uncommitted edit. Accessible names, which are invisible to sighted play, are not the problem (UR111, UR134).

## The rules (worst first)

| Code | Rule | What it forces | Example in code | Proposed rewrite |
| --- | --- | --- | --- | --- |
| DR1 | UR115 | "value and maximum in text", and the question the meter answers | `src/meter_bar.js:56` prints `5/10 · low`, `· near the limit`, `· full` | The bar shows its fill, plus a number where one helps. Words only for a state the fill can't show (capped, stale). |
| DR2 | UR61 | Name units, baseline and applicability on every meter | Same renderer; the "Details" fold at `meter_bar.js:44` | Meaning lives in the fill, position and colour; units go in the hover. |
| DR3 | UR166, PS300, PS297 | "One bar, number inside" for every pool and fighter | `src/ui/combat_versus.js:158-162`: "Condition · Fresh" in inspection, and a text hp line when there is no number | One bar style. Your own pools keep the number; a foe's state is the fill, with numbers on hover. No state word over or beside a bar. |
| DR4 | UR125, UR32 | Every data element has empty, loading and error text, and an empty area says how to fill it | "Nothing here." (`src/stock_view_ui.js:51`), "Nothing yet. Each thing you say is kept here." (`src/ui/talk_view.js:35`), "Nothing ready now" (`src/ui/ready_hub.js:93`), "Nothing is stored here yet. Move items in from your inventory." (`src/empty_states.js:7`) | Empty draws nothing, or a quiet frame. One sentence only the first time, or where the next step can't be guessed. |
| DR5 | UR100, UR128 | A state sheet for every element, including "disabled with its reason" printed in the action group | Reason lines in `src/ui/lotm_task_summary.js:16` and `src/ui/gu_moves_view.js:28`, and the kit's refusal notes | The look shows the state. The reason appears on hover or focus, and prints beside the control only when the player can't guess it. |
| DR6 | UR136 | An unknown reading shows the word "unknown" on a dashed track | `meter_bar.js:56`, and `src/ui/known_number.js:29` "not known yet" | The dashed track alone; the word stays in the accessible name. |
| DR7 | UR84 | Every known fact carries certainty, source, day and freshness | No string found yet, but the rule invites one | Source and day only when they differ from the surface's default. Freshness is the dimming, never a word. |
| DR8 | PS190 | The day strip "explains itself", with a "Today" label | `src/ui/day_strip.js:129` | No label while the strip covers one day. |
| DR9 | PS251 | A clash gets a bar and a reason sentence | `src/ui/bench_form.js` | A mark on the slot, with the reason on hover. |
| DR10 | UR116 | A long calculation shows "computing", then "ready" | No string found | Drop the words; a running timer shows its number. |

UR147 ("a count line shows only when there is something to count") and PS109 already have the right shape. The "Nothing here" lines break UR147, so if DR4 lands, UR147 covers it.

## Filler on screen with no rule behind it

These come from habit, not from a rule, so a rewrite alone won't remove them:

- **S1. Words repeating a picture.**
  - `readyWord` (`src/ui/combat_versus.js:58`) prints "acts next / acts soon / winding up / a while yet" next to the timer bar.
  - The hit chance reads "you hit likely (72%)" (`src/ui/combat_situation.js:70-72`): the word repeats the number.
- **S2. Developer notes in player view.**
  - "Distance: not modelled here; stages only." (`src/ui/combat_situation.js:162`).
  - Graph labels "not assessed", "who strikes whom" and "target unread" (`combat_situation.js:111, 126`).
- **S3. Foe-state words still in hover and inspection.**
  - "All fresh" in the foe bar's title and accessible name (`src/combat_situation_ui.js:259`).
  - "Condition · Fresh" (`combat_versus.js:158`).
  - The threat words "Light / Heavy / Could down you / Not sized up" (`combat_situation.js:137`).
- **S4. Empty sentences on panels.**
  - "Nothing ready · Open pack" (`src/combat_situation_ui.js:129`).
  - "Nothing ready to make here yet" (`src/crafting_visibility.js:108`).
  - "Nothing is kept here that you know of." (`src/home_overview_model.js:180`).
- **S5. Status labels on task cards.** "Ready", "Work under way", "Situation complete", "Time left" and "Before you begin" (`src/ui/lotm_task_summary.js:16-20`).

## Progress

- 2026-11-22, Weibao: "Yes, start there" (DR3, S3, S2).
  - DR3 is rewritten in UR166, PS297 and PS300 (uncommitted in the primary checkout).
  - S3 and S2 touch `combat_versus.js`, `combat_situation.js` and `combat_situation_ui.js`, which the fight-card sessions are changing on their branches, so the code change went to that session's owner rather than a second writer.
  - S3 and S2 are done on `mock/fight-card-2026-11-21`, commit `99f1d211c` (not merged or pushed). The threat words are kept: they judge danger to you and don't sit on a bar. The page test now fails on any "Fresh" in the fight card.

## Order if this is taken up

1. DR3 and S3, which finish the "Fresh" removal, plus S2, the developer notes.
2. DR1, DR2 and S1: the meter renderer feeds about 56 modules, so one change in `meter_bar.js` covers most of it.
3. DR4 and S4, the empty states.
4. DR5, the reason lines, which need a per-surface check of what the player can guess.
5. DR6 to DR10, which are small.

Caveat: `src/` has uncommitted edits from other sessions, so some of these lines may already be changing.

## Keeping filler out from now on (PV1 to PV5, proposed 2026-11-22)

Weibao: "How to prevent redudant or Ai prose in the future?" The filler came from three places: rules that asked for words (DR1 to DR10), agents adding a "why" or a state word by habit (S1 to S5), and no check that reads the screen the way a player does. The prose rules (PRS) belong to another chat. These proposals cover the UI side and the checks, and hand the wording rule to that chat.

- **PV1. One word test, written as a rule.** A word on screen must say something the fill, the number, the position or the colour cannot. If the picture already says it, the word goes to the hover or goes away. This replaces the "say what it is" habit in UR115, UR61, UR125 and UR100. The wording rule itself goes to the prose chat as a PRS line.
- **PV2. A lint that catches the known kinds.** It extends the warning ratchet in `scripts/check_rule_lints.mjs` to flag:
  - state words set next to bar or meter code ("Fresh", "near the limit"),
  - developer phrases in player strings ("not modelled", "stages only", "placeholder"),
  - empty-state sentences ("Nothing here", "Nothing yet").
  
  It warns, never fails, and counts only new hits beyond the baseline, as the existing lints do.
- **PV3. A screen check that reads like a player** (in `npm run check:flow`). On each walked state it flags:
  - the same sentence shown twice in one view (the fight verdict was in three places),
  - words printed over a bar whose fill is known,
  - a box whose words per line of height run past a budget.
  
  The fight-card session's "verdict appears once" count is the first instance of this.
- **PV4. Agents justify each new string.** When an agent adds player text, its report lists each new string and what it says that the picture doesn't. It goes in the consistency gates in `docs/gm/AGENT_WORKFLOWS.md`, the step every UI change already passes through. This is the cheapest of the five, and it catches what a lint can't.
- **PV5. Word budgets per surface,** taken from the reference games, which say a fight's end in one log line:
  - a fight's end: one line, plus chips,
  - a bar: no words, or one number,
  - an empty box: nothing,
  - a hover: up to three short lines.

Recommendation: PV1, PV2 and PV4 now, since they are small. PV3 comes with the next check:flow pass. PV5 is folded into PV1's rule text. Not decided.

**Built 2026-11-22** (Weibao: "Send and build those too"). None of this is committed yet, in the primary checkout.
- **PV1:** UR178 is added to the UI rules and indexed, and UR115 now points to it.
- **PV2:** the UR178 lint is in `scripts/check_rule_lints.mjs`, with a unit test. Twelve known hits are baselined. They are the to-do list for DR4, S2 and S3, among them "Not modelled yet." in the HP and LOTM position files, "All fresh" on master, "near the limit" and "Nothing here.".
- **PV4:** the string-justification step is added to the UI gate in `docs/gm/AGENT_WORKFLOWS.md`.
- **Prose rule:** the PRS wording line went to the coordinator for the prose chat.
