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

## Round 4 (2026-10-18): text-game flows

Source: Claude's own knowledge of text games, not verified by the round 3
research (which skipped Kingdom of Loathing and Discworld MUD after failed
fetches). Treat as inferred until a shown pass confirms it.

- MUDs list people inline in the room text ("The village elder is standing
  here"), inspect with a free verb and act with another; modern clients make
  names clickable with a verb menu. Close to S1.
- Parser IF often offers a hint line ("You could ask about…") that lists only
  unexplored topics; heard topics drop out of the hint but stay usable.
- Kingdom of Loathing and Fallen London express people as places or
  storylets rather than a roster; Sunless Sea flags fresh port content only.

| Code | Consideration | Disposition |
|---|---|---|
| AY32 | Topic hint as the "new" signal: the subject group or conversation shows "You could ask about …" listing only unexplored, currently eligible topics. It cannot fire falsely (C2) and never makes heard topics look disabled (C3). An alternative or complement to AY16's dot, chosen per presentation | ACCOUNT FOR NOW |
| AY33 | Shown evidence pass on text games (Kingdom of Loathing, Discworld MUD, Fallen London, one parser IF) with screenshots of the find, select, talk and return flow | LATER: small research lane, about two hours; done when each game has a shown flow with screenshots in the report |

## Round 5 (2026-10-18): travel, maps and the whole flow

Codes AT, to avoid clashing with AY34 onward, which the AY33 evidence pass
reserves. Sources: the existing map work in
[UI at scale U7](UI_AT_SCALE_CONSIDERATIONS_2026-10-14.md) (MP1-MP8, including
the Mudlet mapper), [site and exploration rules](SITE_AND_EXPLORATION_RULES.md)
SR7, SR8 and SR13, the `known_routes` modules, and Claude's own knowledge of
MUDs (inferred, unverified).

### How MUDs handle space (inferred)

Most MUDs are room graphs: a room description, "Obvious exits: north, east",
and who is here. Many add an ASCII minimap beside the room text, and some have
an in-game `map` command. Clients such as Mudlet build a 2D map from room IDs
the server sends, and clicking a room walks the path there. NPCs wander between
rooms on timers; boats and coaches are timed travel with messages en route.
`who` lists everyone online and `where` lists who is in the area.

### The whole flow, proposed

1. Arrive: one log line, Around you refreshes with three groups: people,
   stations, ways out.
2. Select a subject at the top: inspection only (UR35).
3. Its verbs appear pinned in bottom Actions, with a cost preview where one
   exists (SR13).
4. Act: talk and trade render in the bottom or the center controller; travel
   becomes the running work.
5. Return: Leave or Esc goes back to the place with the selection kept.

### Considerations

| Code | Consideration | Disposition |
|---|---|---|
| AT1 | Ways out as subjects. Around you gains a "Ways out" group fed by the existing known-routes data (one authority, AR). Selecting a route shows "Go · 2 h · cold road" in bottom Actions, replacing the "Move somewhere else" dropdown the same way S4 retires the Talk dropdown | ACCOUNT FOR NOW: next slice after S1-S4 |
| AT2 | Arrival freshness. On arrival, people who came since your last visit and stations with fresh stock get the same truthful dot as AY24; "since you were last here" is one log line, not a modal (SR21) | ACCOUNT FOR NOW |
| AT3 | On the road. While travelling, Around you shows "On the road" with fellow travelers and road encounters as subjects, so travel is a place too, not a dead progress bar | LATER: mid lane, about a day; done when a road encounter is selectable and talkable mid-journey |
| AT4 | Map as a reader of known routes. A small room-and-exit graph (MP4) of known places, click a node for "Go" with the same cost preview. It shows knowledge, not truth: stale or rumored routes look different (SR7, SR8) | LATER: mid-high lane, about two days; done when clicking a known node previews and starts the same journey as AT1 |
| AT5 | Find a person. "People you know" (AY31) offers "Go to last seen place" through AT1's route, labelled with how old the sighting is | LATER: depends on AY31 and AT1 |
| AT6 | Talk unlocks travel. When a line rewards a location or route, the log line links to the new way out and it carries the new dot. Directions become a verb ("Ask about the road") that grants what the speaker knows (SR8) | ACCOUNT FOR NOW: the dot reuses AY24; the verb is LATER content |
| AT7 | With you versus here. Companions and party members sit in a separate "With you" group, so they never mix with locals or disappear on travel | ACCOUNT FOR NOW |
| AT8 | Ambient presence. Arrival barks ("The elder nods at you") go to the log at most once per arrival per person, filterable, never as dialogue (UR44) | LATER: content lane per world |
| AT9 | Command line. An optional typed bar (`talk elder`, `go mill`, `trade`) runs the same verbs for keyboard players. Text-game feel without a second rule path | LATER: small lane, about half a day; done when every verb in the subject group is reachable by command |
| AT10 | Clickable names in the log select the subject if present now, and say so when they are not (UR48) | LATER: small lane, about two hours |
| AT11 | Worlds. Around you, ways out and the map are scoped to the current world; crossing worlds uses the cross-world atlas graph (MP7), not the local map | ACCOUNT FOR NOW |
| AT12 | Space at 1366×768. Ways out adds a third group; with the AY30 grouping, groups collapse to a header row when long, and the map lives in the contextual slot rather than permanently on screen (UI at scale placement table) | ACCOUNT FOR NOW |

## Round 6 (2026-10-18): presentation style and idle aspects

### Style default (proposal, Claude's recommendation; not accepted)

| Code | Proposal |
|---|---|
| ST1 | **Default: place and subjects (the MUD shape).** A place shows people, stations, events and ways out; selecting one is free; its verbs act. Reasons: upstream data is already rooms with NPC lists and connections; a life sim needs persistent people with a home; subjects with verbs scale with AD38 (new mechanics add verbs, not menus); text stays cheap across many worlds |
| ST2 | **Storylets as subjects.** A happening ("Something is stirring at the mill") is a subject with its own choices. A story-heavy world may lead with storylets as its presentation (AD5, per world) |
| ST3 | **Idle carries repetition.** Travel, jobs and routines run as work so the player is not clicking room to room; known places and people get one-step "go" and "repeat" verbs |
| ST4 | **Map-first is not the default.** A sprite or walkable town is costly per world and buries people behind movement. The known-places map (AT4) stays a reader of route knowledge. A world whose fiction centers on space may still choose a richer map, with that world paying the cost |
| ST5 | **Risk and signal.** The shape's risk is click busywork. Guards: S5 Enter, truthful dots (AY24), routines (ST3). If a populated save at 1366×768 still feels clicky after S1-S4, lean further on routines rather than changing style |

### Idle aspects

Owners: AD15 (ordinary play advances time; settled routines compress) and AD16
(away time runs chosen routines in the current world and stops at important
choices or exhausted supplies), with the
[offline time audit](OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md).

| Code | Consideration | Disposition |
|---|---|---|
| ID1 | Retiring the Talk dropdown breaks text that names it: the elder's local-life message ("Meet me through Talk to someone", `src/absorb_c2/local_life.js`) and a hint in `src/main.js` near line 1587. S4 updates both to name the person in Around you | ACT NOW (with S4) |
| ID2 | Selection survives ticks and away time. Coming back from offline keeps the selected subject if still present, otherwise uses the existing "no longer here" notice (UR52, AY10) | ACT NOW |
| ID3 | Running work and subjects coexist. While a job or routine runs, Around you stays inspectable; verbs that would interrupt say so ("Stops Morning watch") rather than greying silently, and the existing busy reason stays for blocked ones (AY2) | ACT NOW |
| ID4 | Routines as subject verbs. A known recurring task with a person or station ("Morning watch with the guard", "Weekly market with the trader") shows as a "Make it a routine" verb in that subject's group, feeding the existing routine owner, not a second scheduler (AR one authority) | ACCOUNT FOR NOW |
| ID5 | Away summary per subject. After away time, people and stations touched by routines get the truthful dot, and the "since you were last here" line (AT2) lists what changed by subject. Important choices that stopped a routine (AD16) appear as a subject, not a modal | ACCOUNT FOR NOW |
| ID6 | Conversation never runs while away. Talk is an attended verb; away time may queue "the elder wants to see you" as a dot, never auto-pick lines | ACCOUNT FOR NOW |
| ID7 | Compression shows in verbs. Once a routine is settled (AD15), its subject verb offers "Do a week of this" with the time cost preview, so repetition does not need a click per day | LATER: mid lane, about a day; done when a settled routine compresses through the subject verb and the log summarizes the result |
| ID8 | Travel as idle work. A long route runs as work with stop conditions (supplies, danger, a choice); arrival or a stop is a dot on the place or the road subject (AT3), never a forced popup | ACCOUNT FOR NOW, builds on AT1 |
| ID9 | Presence keeps moving while away. Schedules and travelers continue in the current world (inactive worlds pause, AD16), so Around you on return reflects time passed; people who left move to "People you know" with last seen (AY31) | ACCOUNT FOR NOW |
| ID10 | Background tab and battery. Around you renders at the existing 250 ms poll only while visible; hidden tabs skip it (existing `deferWhileHidden` pattern) so subject lists add no idle cost | ACCOUNT FOR NOW: done check is no render calls while the tab is hidden |
| ID11 | Idle-game evidence. The repo's [idle research](RESEARCH_IDLE_GAMES.md) has no roster-of-people UI; idle games with people (Groundhog Life, BitLife, cultivation idlers) put verbs on a person profile (BitLife, round 3). Worth one shown check in the AY33 pass | LATER: fold into AY33 |

## Round 7 (2026-10-18): loops and starting over as idle automation

Weibao asked whether looping and starting over should become a bigger part of
core gameplay for idle automation. Accepted direction this must respect:
AD10 (the journey continues across lives), AD11 (memories and the base cheat
carry), AD12 and D27 (intentional loops are a player option), AD4 (worlds keep
their own histories), "prestige/rebirth kept separate from travel and
ascension", and the first milestone's one prestige layer. RL2 in the
[continuation owner](worlds/CONTINUATION_CHOICE_CONSIDERATION_2026-10-13.md#reciprocal-return-and-intentional-loop-direction-2026-10-15)
proposes looping off by default. Everything below is a proposal; changing the
default would need Weibao's decision.

### What idle games do (repo research, labels from those reports)

| Game | Reset and carry | Label |
|---|---|---|
| Groundhog Life | Money, home, job and levels reset; each skill keeps a "relearn faster" factor from its best level this loop; a deeper Grand Prestige clears factors for a permanent multiplier | shown (code), [report](research/groundhog-life/REPORT.md) |
| Idle Reincarnator | Two resets, rebirth and regression; best level gives an XP multiplier; town technology survives personal rebirth but not deeper regression | shown, [report](research/idle-reincarnator/REPORT.md) |
| NGU Idle | Rebirth resets allocations and run levels, not all growth; some systems keep levels and lose only allocations | shown, [report](research/ngu-idle/REPORT.md) |
| Increlution | Buildings and resources reset; instincts and artifact powers persist; authored replay of the same origin | shown, [checkpoint](research/increlution/CHECKPOINT.md) |
| Majora's Mask, Outer Wilds | Only knowledge and a few tools carry; the notebook or ship log is the progression | shown, repo reports |
| Idle Loops | A recorded action list replays each loop; banked time | stated in the Groundhog report's cross-reference; details from memory |

Pattern: the loop works when **what you learned becomes faster or automatic
next time**, and the reset is legible (preview of kept, lost and dormant, as
the existing P1 reset-preview proposals say).

### Recommendation

| Code | Proposal |
|---|---|
| LP1 | **Yes, but as knowledge-carry, not as a wipe.** Make starting over a strong player option whose reward is automation: what the hero learned last life (people's schedules, heard lines, routes, recipes, routines) carries as memory (AD11) and turns into one-step verbs next life. Keep it a choice (D27), not the only path |
| LP2 | **Personal loop by default, world loop by world.** The hero's body, money and rank reset; the world and its people keep their history (AD4), so relationships are not erased. Loop-native worlds (a Majora-style three-day world) rewind the world too, as that world's law (AD5) |
| LP3 | **The one prestige layer becomes the automation layer.** For the first milestone, design that single layer around carried knowledge and replayable routines rather than a bare multiplier currency. No second layer now (sequencing) |
| LP4 | **Record and replay plans from real verbs.** "Remember today as a plan": the subject verbs you used (go to mill, talk to miller, trade) become a replayable plan with stop conditions (RL4). Next life, a plan replays only where the current body, funds and facts allow it (Idle Reincarnator P4) |
| LP5 | **Around you shows past-life knowledge.** People and places known from an earlier life show "known from a past life" with what you remember; the new life still has to meet them (AD12 fresh history). Heard lines (AY15) and last seen (AY31) carry as memory, not as the new life's relationship |

### Considerations

| Code | Consideration | Disposition |
|---|---|---|
| LP6 | Reset preview before any start-over: kept, lost, dormant and what will be faster, per subject (existing P1 proposals in NGU and Idle Reincarnator packets) | ACCOUNT FOR NOW |
| LP7 | Life-sim cost. Loops that reward grinding can hollow out living. Guard: carried knowledge speeds the tedious parts (routes, routines, known lines) and leaves people, choices and new content fresh | ACCOUNT FOR NOW |
| LP8 | Truthful dots across lives. "New" means new to this life's hero for relationships and new to the journey for knowledge; the two never show as one mark | ACCOUNT FOR NOW |
| LP9 | Plans replay through the same command path as manual play, with their own attempt identity (RL3) and a responsive stop (RL4); no second rule path | ACCOUNT FOR NOW |
| LP10 | Away time can run a plan (AD16) and stops at the first new choice, missing input or danger; the away summary lists results per subject (ID5) | ACCOUNT FOR NOW |
| LP11 | Default looping state. RL2 proposes off by default; LP1 keeps the option strong without changing that default. Turning loops on by default would be Weibao's call | Decision for Weibao only if he wants loops central |
| LP12 | Evidence: confirm Idle Loops' action-list replay and Progress Knight's carry with a shown pass before LP4's design is fixed | LATER: small research lane, about two hours; done when both have shown flows in a report |

## Round 8 (2026-10-18): active versus idle

Weibao asked whether the game should become more active than idle. Standing
direction: "The game is meant to be an idle rpg so it should be able to level
up passibely" ([USER_VISION](USER_VISION.md), passive progression), with the
active/idle balance still listed as open question 7 in USER_VISION. This round
is a proposal toward that open question, not a decision.

| Code | Proposal |
|---|---|
| AI1 | **Stay idle at heart; be active where it is interesting.** Decisions, discovery, first meetings, new lines and danger are attended. Repetition, travel on known routes, routines and practice run on their own. The player chooses; the game carries |
| AI2 | **Automation comes from within a life first.** The main source is routines and plans learned by doing (AD15 compression, LP4 record-and-replay, ID4 routine verbs). Loops (round 7) add to that for players who want them; they are not the only route to automation |
| AI3 | **Passive progress never needs a click.** Every system with a reasonable passive path keeps it (the passive-progression direction); active play is faster or richer, not required |
| AI4 | **The attention budget is a dial per world.** A crisis world asks for more attended choices; a calm farming world runs mostly on routines (AD5). The UI's calm/crisis modes (UI at scale QL) present it |
| AI5 | **Test, don't guess.** Open question 7 settles in the first real playtest: on a populated save, count attended clicks per in-game day and note where play felt like chores versus where it felt empty. Chores mean automate (ST3, AI2); empty means add a decision there |

## Round 9 (2026-10-18): time between story events and rewinding to canon events

Weibao asked whether he can stay passive between story events and rewind to a
canon event, or whether that needs unlocking. Accepted direction (recovered in
[cheat access discussion](gm/CHEAT_ACCESS_DESIGN_DISCUSSION_2026-10-15.md)):
D1 modest continuation from the start with an initial-arrival fallback; D9 a
later checkpoint is the first authored upgrade; D11 checkpoint return rewinds
by default depending on anchor type and means; CA5 rewind covers current-world
history while cheat growth carries. Proposals P11 and P29 (not accepted):
later checkpoints mark the present moment, not arbitrary dates. AD15 and AD16
govern passive time.

### Answer in short

- Passive between events: yes, from the start (AD15, AD16).
- Rewind to the start of this arrival: yes, from the start (D1 fallback).
- Rewind to just before a canon event: after the first upgrade (D9), by
  marking a checkpoint while you are there.
- Jump to any canon date from a menu: not ordinary. It needs a stronger anchor,
  a time cheat or a loop-native world (AD38: works by how the means works).

| Code | Proposal | Disposition |
|---|---|---|
| TF1 | **Wait until a known event.** A place verb "Wait until the festival" compresses time with routines running (AD15) and stops at the event, an important choice or exhausted supplies (AD16). Offered only for events the hero knows about | ACCOUNT FOR NOW |
| TF2 | **Pause before known events.** A setting, on by default: passive and away time stop shortly before any event the hero knows is coming, so idling never skips it silently. Per event, the player can set "let it pass" | ACCOUNT FOR NOW |
| TF3 | **Checkpoint nudge.** Once the first upgrade exists, approaching a known event shows a quiet "Mark checkpoint here?" in the subject group or log, never a modal, and never auto-marks. Marking replaces the movable point with a confirmation (P29) | LATER: with the D9 slice |
| TF4 | **Event as a subject.** An upcoming known event appears in Around you as a subject (ST2) with "Wait until", "Mark checkpoint" and, after it passes, "What happened" from the log | ACCOUNT FOR NOW |
| TF5 | **Rewind costs history, keeps memory.** Rewinding undoes current-world history after the point, including relationships formed since (CA5). Memory, heard lines and cheat growth carry (AD11, LP5). The rewind preview lists what this undoes per subject (LP6) | ACCOUNT FOR NOW |
| TF6 | **Sealed and changed events.** Only events the hero actually knows appear. A world whose canon is changed or randomized keeps its truth sealed; the UI shows the known claim, not the real date (sealed-secrets rule, SR5) | ACT NOW for any event UI |
| TF7 | **Arbitrary canon-date travel as an upgrade path.** Several checkpoint slots, picking from known past events, or a world's own time law can grow from research and means (D2, D9, T5), each with its own cost and scope | LATER: design with the anchor research route |
| TF8 | **Missed events continue.** An event you let pass still happens and its consequences persist (C6 motives outlive scripts); the log and "People you know" show its aftermath | ACCOUNT FOR NOW |
