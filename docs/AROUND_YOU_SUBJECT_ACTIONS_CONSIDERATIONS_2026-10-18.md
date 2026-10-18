# Around you and subject actions: considerations (2026-10-18)

Status: proposals. Nothing here is accepted until Weibao says so. Rules applied:
UR35 (inspection is free, actions are explicit), UR41 (navigation scope),
UR42 (no duplicate facts across simultaneous panels), UR13 (nothing disappears
silently), UR52 (stable navigation). Target viewports: 1366×768 floor and
1920×1080 primary. Mobile is deferred.

## Problem

In the Village, Actions → "Talk to someone" (legacy dropdown, `src/display.js`
around line 2488) lists the same NPCs as Around you → People here. Both reach
`start_dialogue`. "Visit a merchant" overlaps the trader row the same way. The
earlier R13 dedupe removed the lower People/Things tabs but missed these
dropdowns. At 1366×768 the Actions list is also clipped, so the duplicate costs
a visible row.

Around you lists authored NPCs only in the Village (`inVillage` gate in the
`createVillageWorkspace` read in `src/main.js`). Gate guards, the slums,
the farm and the swamplands still rely on the dropdowns.

## Upstream baseline (checked 2026-10-18, upstream/master v0.5.5.30)

Upstream has one route to people: the location's action list. "Talk to
someone" expands into one "Talk to <name>" row per NPC, and "Visit a merchant"
does the same for traders. It skips an NPC whose lines and actions are all
unavailable or finished. There is no people list, inspection or relationship
view; the location description is plain text. Traders also offer Trade from
inside their dialogue. Retiring the dropdowns (S4) therefore returns to one
route, with Around you as that route instead of the dropdown.

Other games: a research prompt is ready at
[around-you-talk-patterns PROMPT](research/around-you-talk-patterns-2026-10-18/PROMPT.md)
(run 2026-10-18; its report folds in below as round 3, AY23-AY31).

## Placement: verbs live in the bottom Actions panel

The top panel answers "who and what is here". The bottom panel answers "what do
I do". Selecting a subject at the top scopes the bottom.

- Conversations already render in the bottom action area
  (`update_displayed_dialogue` clears and fills `action_div`). Talk pressed
  there opens the conversation in the same spot, so the eye does not move.
- The bottom module is registered with role `actions`; Focus/Around you is the
  inspection home (UR41).
- Selecting a name stays free and safe (UR35): the top card never executes.
- The pre-shell village scene already rendered a target-scoped "Actions:" row
  in the bottom (`scene-target-row` in `src/village_workspace.js`), so this
  restores a known pattern rather than inventing one.

This replaces D1 (verbs on each top row) and D2 (verbs on the top card) from
the first proposal in chat.

## Revised slice

| Code | Proposal |
|---|---|
| S1 | Selecting a person or station in Around you pins a group at the top of bottom Actions: "With village elder: Talk · Trade". Place verbs (Move, Craft, Work, Train, Rest) follow below |
| S2 | With nothing selected, the bottom shows place verbs plus one quiet line: "Pick someone or something above to talk, trade or use it" |
| S3 | Around you lists displayable authored NPCs at every location, not only the Village (lift the `inVillage` gate for authored people) |
| S4 | Retire "Talk to someone" and "Visit a merchant" everywhere once S3 lands, with a one-time log line saying where talking and trading went (UR13) |
| S5 | Enter on an already-selected row runs that subject's first verb (Talk for people, Open for stations). Arrow keys and j/k keep moving the selection |

## Round 1 (2026-10-18)

### ACT NOW (inside the slice)

| Code | Consideration |
|---|---|
| AY1 | Superseded by AY14 (round 2). Eligibility parity. The dropdown hides NPCs with no available textlines or actions. Around you should keep showing displayable NPCs and grey Talk with a reason ("Nothing new to say") instead of hiding the person, so the list does not flicker as lines unlock |
| AY2 | Busy state. Verbs stay visible and disabled with the existing reason ("Finish your current work or conversation first") |
| AY3 | After a conversation ends, the person stays selected and the subject group returns, so Talk again or Trade is one click |
| AY4 | Stability (UR52). Changing selection replaces the subject group in place; it never resets the bottom scroll or steals focus. At 1366×768 the subject group stays pinned and place verbs scroll beneath it |
| AY5 | Met state. Only the elder has a met flag today (`metVillageElder`). Other authored NPCs need a default so the label reads "Talk with X", with "Meet" reserved for travelers |

### ACCOUNT FOR NOW

| Code | Consideration |
|---|---|
| AY6 | Stations use the same model. "Try to craft something" in place verbs duplicates the Crafting stations row once that row has an Open verb; keep the station route |
| AY7 | Combat. When Around you becomes Opponents, no subject group appears in the bottom; inspecting an enemy still does not change attack targeting |
| AY8 | Travelers keep their Meet verb, which opens the travelers panel |
| AY9 | Trade opens through the shared center controller with the destination-labelled back bar and Esc (UR9) |
| AY10 | A selected person who leaves (schedule, travel) uses the existing "no longer available here" notice; the subject group disappears with the same notice, not silently |

### LATER / DELEGATE

| Code | Consideration | Level, effort, done check |
|---|---|---|
| AY11 | Subject verb provider. As verbs grow (Give, Ask about, Hire, Train with), features register verbs for a subject kind through the domain registry instead of editing the group (AR one-registration rule) | Mid-level runtime lane, about half a day; done when a second verb lands with one registration line and no edit to the group renderer |
| AY12 | A "talk again" link on the last conversation's log line that selects the person and focuses Talk | Small UI lane, about an hour; done when the log link selects the subject without starting the dialogue (UR48) |
| AY13 | Mobile layout of the subject group | Deferred by the standing UI priority |

## Round 2 (2026-10-18): repeated lines and "nothing new"

Weibao's question: with nothing new to say you can still talk, but the lines
repeat. What is best?

### How dialogue behaves today (shown in source)

- A textline stays available after you read it unless a `locks_lines` entry
  locks it (`src/components/dialogue_component.js`, data in
  `src/data/dialogues.js`, about 177 uses). Reading a line again repeats its
  text and reruns its rewards.
- Lines that give items lock themselves after use (the 8 item-reward lines all
  sit with `locks_lines`), so repeats do not duplicate items.
- Nothing records which lines the hero has heard. The game cannot tell new from
  repeated today.
- The legacy dropdown hides an NPC only when zero lines are displayable, which
  is rare. "Nothing to say" in AY1 was an assumption, not a tracked state.
- Defect found: `NPC.getAvailableActions` iterates textlines instead of
  actions (and indexes `actions[actions]`), so the dropdown's action count
  repeats the line count (`src/models/npc.js`).

### Proposal

Talking is always allowed. Asking the same question again is ordinary
in-world behavior; the cost is only time. What the hero needs is to know
whether there is anything new.

| Code | Consideration | Disposition |
|---|---|---|
| AY14 | Supersedes AY1. Talk is always enabled for a displayable NPC; it is never greyed for having no new lines | ACT NOW |
| AY15 | Heard lines. Record per NPC which textline keys the hero has heard, plus a short hash of the text heard, so a line whose `getText` changes (season variants, quest progress) counts as new again | ACT NOW |
| AY16 | New-line signal. The subject group reads "Talk · 2 new" when unheard lines exist and plain "Talk" otherwise. The Around you row gets a small "new" mark. Hovering it says which topics are new without revealing their text (sealed-secret safe) | ACT NOW |
| AY17 | Inside the conversation, new topics list first and heard topics stay clickable with a quiet "heard" mark. Rereading is free; this only orders and labels | ACT NOW |
| AY18 | Save slice. Heard lines are a namespaced save slice with a migration. Default for old saves: seed every currently available line as heard, because a played save has probably read them; fresh saves start empty. Cost: on an old save, a line unlocked but never opened shows no mark until it changes | ACT NOW, save-compatibility default |
| AY19 | Fix the `getAvailableActions` defect in the same slice, since the subject group reads that count | ACT NOW |
| AY20 | Heard is character knowledge, not player knowledge. A journal "Conversations" view can list heard topics per person for rereading without opening the dialogue | LATER: small UI lane, about two hours; done when a heard line can be reread from the journal without starting a conversation (UR35) |
| AY21 | Repeat flavor. A world may let some NPCs vary repeat answers ("As I said…") or grow impatient; a default of plain repetition stays | LATER: content palette, per world |
| AY22 | Rewards rerun on repeat. Item lines self-lock, but flag/unlock rewards rerun silently. Verify they are idempotent before relying on repeat talk; a non-idempotent one should lock or guard itself | ACCOUNT FOR NOW: done check is a scan of textline rewards for non-idempotent effects |

## Round 3 (2026-10-18): how other games do it

Source: [around-you talk patterns REPORT](research/around-you-talk-patterns-2026-10-18/REPORT.md),
24 games, labelled shown/stated/inferred there. Proposals only; nothing here is
accepted.

What the research found, in brief (codes TP and C are the report's):

- Select-then-act (TP10), focused conversation surfaces with an explicit exit
  (TP11), schedule-driven presence (TP1) and both routes to trade (TP9) are
  common. They support S1-S5, AY10, AY14, AY20 and AY21.
- Heard state is usually stored per choice (TP2). Where it is visible, it shows
  inside the conversation (TP3), not on the person.
- No base game found marks a person as having unheard lines before you open
  the conversation (C2). Pre-open markers mean something actionable or
  significant (TP4). Stardew players wrote a mod for the gap, OpenMW ships its
  topic colours off by default, and a Persona player report shows a marker loses
  trust when it fires falsely.
- Grey means "locked" in Mass Effect and Witcher 3 (C3, TP5), so a heard style
  must not look disabled.
- Talking is rationed in some games (C1, TP8). In YAIRPG game time is already
  that cost, so this is a dial on AY14, not a reversal.

### ACT NOW (inside the slice)

| Code | Consideration |
|---|---|
| AY23 | Three distinct styles: "new" (small accent dot), "heard" (normal text with a quiet check or muted label, fully clickable) and "locked" (grey plus a reason). Heard never borrows the disabled look (C3, TP5) |
| AY24 | The person mark is truthful: count only lines that pass their eligibility now, never gated or invite-only ones (C2, Persona failure) |
| AY26 | The AY15 text hash covers content lines only. Greetings, seasonal flavor and random variants are excluded from "new", so daily variation does not re-mark people (C5) |
| AY28 | Trade stays reachable both ways: the subject-group verb and the dialogue option call one function (TP9, upstream baseline) |

### ACCOUNT FOR NOW

| Code | Consideration |
|---|---|
| AY25 | The person mark is a setting, on by default. Around you shows only a dot, never a count; the count lives in the subject group (C2, TP4) |
| AY27 | Inside a conversation, keep authored order by default and mark new lines in place. AY17's new-first ordering becomes a dial, so choices do not jump between visits (UR52, TP3) |
| AY29 | Every conversation ends with an explicit Leave option listed last, plus Esc. A world may mark a scene non-leavable with an in-world reason, and the UI says so (C8, TP11). Refines AY3 |

### LATER / DELEGATE

| Code | Consideration | Level, effort, done check |
|---|---|---|
| AY30 | With many people in one place, group Around you by role (merchants, residents, travelers) with an optional filter; never auto-reorder on a "new" change (ACS, BitLife; UR52) | Small UI lane, about two hours; done when 15 seeded NPCs stay scannable at 1366×768 |
| AY31 | "People you know" in the journal shows last-seen place and known schedule hints for absent people, extending AY20 (TP1, C6; Majora's Mask notebook) | Mid UI lane, about half a day; done when an absent NPC appears there and not in Around you |

Evidence gap: placement (Q6) and scale (Q7) are mostly stated, not shown. A
screenshot play pass on owned games (Stardew, Qud, Disco, RimWorld) would
upgrade them (report section 6).
