# Presence and interaction rules

**Proposal, 2026-10-18. Not accepted until Weibao says so (AD32).** Drafted for
every agent that designs or builds who and what is present in a place, how the
player selects a person, station, event or way out, and how verbs act on them.
Weibao, 2026-10-18: "basic rules and more to help this get implemented?", after
nine rounds in the
[Around you considerations](AROUND_YOU_SUBJECT_ACTIONS_CONSIDERATIONS_2026-10-18.md)
(S, AY, AT, ST, ID, LP, AI and TF codes).

Each rule names the mistake it prevents. Rules marked **(accepted)** restate an
accepted decision or standing rule and bind now through it; the rest are
proposals. Every rule is a default; a world may state an exception with an
in-world reason and cost (AD5). The first build slice is in the
[S1-S4 packet](gm/dispatch/around-you-2026-10-18/S1_S4_PACKET.md).

## Presence

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| PIR1 | **One home for who and what is here.** Around you lists people, stations, events and ways out for the current place. No other surface lists the same subjects at the same time (UR42). (S3, S4) | Two menus reaching the same people, as with the Talk dropdown |
| PIR2 | **Presence follows the world's own clocks.** Schedules, travel and events decide who is here; the list reads that state and never invents it. (TP1, ID9) | A list that drifts from where people actually are |
| PIR3 | **Absent people live elsewhere.** Known people who are not here appear in "People you know" with last seen and its age, never greyed in the here list. (AY31) | Here lists cluttered with people who are not here |
| PIR4 | **Companions are "With you", locals are "Here".** Travelling with the hero keeps a separate group. (AT7) | Companions vanishing on travel or mixing with locals |
| PIR5 | **Show only what the hero knows (accepted, sealed secrets, AD6, SR5).** Subjects, events and dates appear as known claims; sealed truths stay sealed. (TF6) | The list leaking an unmet person, a hidden event or a changed canon date |

## Selecting and acting

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| PIR6 | **Pointer: UR35.** Selecting is free (accepted). | A click to read details that starts a conversation |
| PIR7 | **Verbs live in the bottom Actions panel.** A selected subject's verbs pin to the top of Actions; place verbs follow. Conversations render there too, so the act and its result share one place. (S1, S2) | Verbs split between the inspection card and the action panel |
| PIR8 | **One function per verb.** Every route to a verb (subject group, dialogue option, command, keyboard) calls the same native function with the same eligibility checks. (AY28, LP9, AT9) | Trade from the card and trade from dialogue behaving differently |
| PIR9 | **Unavailable verbs say why.** A blocked verb stays visible with its reason; a verb that would interrupt running work names what it stops. (AY2, ID3) | Silent grey buttons, or verbs that cancel a routine without warning |
| PIR10 | **Talking is always allowed for a displayable person.** Repeats cost time, not permission. (AY14) | People greyed out for having "nothing new to say" |
| PIR11 | **Keyboard reaches every verb.** Arrows move the selection; Enter on a selected row runs its first verb. (S5) | A mouse-only path for the most frequent action |
| PIR12 | **Selection is stable (accepted, UR52).** Ticks, away time and list changes never move the selection or steal focus; a subject that leaves gives a notice, not a silent jump. (AY4, AY10, ID2) | The inspected person changing under the cursor |
| PIR13 | **A conversation has an explicit exit.** Leave is listed last, Esc works, and the place returns with the selection kept. A world may make a scene non-leavable with a stated in-world reason. (AY3, AY29) | A conversation that strands the player or loses their place |

## New and heard

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| PIR14 | **Heard is recorded per line with a fingerprint of its text.** Changed text counts as new again; greetings and flavor variants are excluded. (AY15, AY26) | Daily variation re-marking everyone, or real changes going unnoticed |
| PIR15 | **A mark is truthful.** A "new" dot counts only lines and content the hero can act on now. (AY24) | Markers that fire falsely and lose trust |
| PIR16 | **Three looks: new, heard, locked.** New is a small accent; heard is normal text with a quiet mark and stays clickable; locked is grey with a reason. Heard never borrows the disabled look. (AY23) | Players reading heard topics as unavailable |
| PIR17 | **The list shows a dot; the count lives in Actions.** Person marks are a setting, on by default. A "You could ask about…" hint may stand in for the dot. (AY25, AY32) | Badge noise across the people list |
| PIR18 | **Conversations keep authored order** and mark new lines in place; new-first ordering is a dial. (AY27) | Choices jumping position between visits |

## Time, idle and continuity

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| PIR19 | **Choices are attended; repetition can run itself.** Talk never runs while away; routines, known travel and practice can. (AI1, ID6) | Away time auto-picking dialogue, or chores that need a click per day |
| PIR20 | **Away time stops before known events (accepted, AD16, for important choices).** By default idling pauses shortly before an event the hero knows is coming; per event the player may let it pass. (TF2) | A canon event skipped silently while idle |
| PIR21 | **Rewind shows what it undoes (accepted, D11 and CA5 for scope).** A checkpoint return lists, per subject, the history it undoes; memory, heard lines and cheat growth carry. (TF5, LP5, LP6) | Losing relationships to a rewind without warning |
| PIR22 | **Past-life knowledge is memory, not relationship (accepted, AD11, AD12).** People known from an earlier life show what is remembered; the new life still meets them. (LP5, LP8) | A fresh life that inherits friendships it never formed |

## Build and verification

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| PIR23 | **Pointer: AR3, AR6.** One authority per fact, namespaced save slice (accepted). Presence reads the existing location and NPC registries. | Parallel people lists, route tables or heard flags |
| PIR24 | **Retire a route only after its consumers move.** Text, hints and browser scripts that name a retired control move to the new route in the same change, with one log line telling the player where it went (UR13). (ID1) | Broken quest hints and a red browser suite after removing a menu |
| PIR25 | **Pointer: UR "Before you call it done", AD34.** Target-viewport evidence (accepted). | Claims based on the prebuilt bundle or a mobile check |

## Not covered here

Event storylets as content (ST2), maps (AT4), plans and replay (LP4), loops
(LP1-LP12) and time-skip verbs (TF1) keep their own owners when built. NPC-heavy
work stays deprioritized under AD33; PIR applies to the existing NPCs and to
new ones when a slice adds them.
