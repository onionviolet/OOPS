# How other games handle finding and talking to people (2026-10-18)

Status: research report for [PROMPT.md](PROMPT.md). Findings and proposals
only. Nothing here is accepted, and no runtime code changed. Rules applied:
UR35, UR41, UR42, UR13, UR52, AD36, AU1-AU15. The proposal under test is
S1-S5 and AY1-AY22 in
[the considerations doc](../../AROUND_YOU_SUBJECT_ACTIONS_CONSIDERATIONS_2026-10-18.md).
New proposals from this report fold in there as round 3 (AY23-AY31).

**Labels.** **shown** = seen in source, decompiled data or the repo's own
capture of the game. **stated** = wiki, developer, guide, review or player
post. **inferred** = our reading. **n/e** = the cited notes looked and found
no evidence. The private reader notes in `private/` (gitignored) carry the
full per-game breakdown, quotes and every URL. Committed text paraphrases them.

**Evidence quality.** The repo's earlier passes studied mechanics, not screens,
so most UI cells are stated rather than shown. No reader watched play or read
screenshots. Treat placement (Q6) and scale (Q7) answers as thin.

## 1. Per-game table

Source keys (`[R1]` and so on) are listed in section 7. Q7 and Q8 are covered
in the patterns and the coverage list because most games have no evidence.

| Game | Q1 Finding | Q2 Inspect vs act | Q3 New vs heard | Q4 Nothing new | Q5 Merchants | Q6 Placement |
|---|---|---|---|---|---|---|
| Majora's Mask | shown: authored schedule (day, time, scene, flags) decides presence; one NPC meeting is found by following, with no marker [MM-F1,F2] | shown: talk is offered only when the schedule result is nonzero; some results auto-offer [MM-repass] | shown: script marks the conversation heard and logs both people in the notebook; stated: notebook marks grey after a rewind [MM-F2,F5,F6] | shown: earlier acts switch which timetable runs, so the same person says different things [MM-F3] | n/e [R1] | stated: absent people live in the Bombers' Notebook (20 entries, schedule bars), not in the scene [MM-F6] |
| Disco Elysium | n/e [R1] | n/e [R1] | shown: failed white checks reopen on skill or circumstance change; a finished thought sends you back to a named person [DE-F4,F7]; stated (player report): fully used options grey out [R3-DE] | shown: locked checks stay locked until state changes [DE-F4] | n/e [R1] | stated: tall dialogue column on the right, portraits opposite [R3-DE] |
| Planescape: Torment | n/e [R1] | n/e [R1] | shown: journal updates by itself; a notebook fact can replace a stat gate to open the same line [PST-S3,S22] | shown: speech varies with moral history and party size [PST-S25] | n/e [R1] | n/e [R1] |
| Heaven's Vault | n/e [R1] | n/e [R1] | shown: words carry four states (unseen, wrong, unconfirmed, known), not a binary heard bit [HV-K] | stated: plot does not require translation [HV-R] | n/e [R1] | n/e [R1] |
| Book of Hours | n/e [R1] | shown: visitor talk is a family of recipes [BOH-F25] | shown: advice stamps an "acted" mark on the incident and a history mark on the visitor [BOH-R] | shown: each conversation spends soul capacity, so repeat talk is rationed [BOH-R] | n/e [R1] | n/e [R1] |
| Citizen Sleeper | n/e [R1] | n/e [R1] | n/e [R1] | n/e [R1] | n/e [R1] | stated (publisher screenshot): portrait beside choices, prose in its own scroll region, dice stay visible [CS-T03-T06] |
| BitLife | stated: relationships are a roster grouped by role [BL-F4] | stated: verbs (spend time, ask, insult) sit on the person's profile [BL-F4] | n/e [R1] | n/e [R1] | n/e [R1] | inferred: the profile is the action surface [BL-F4] |
| Stardew Valley | shown: schedules exist; the map page draws no NPC markers [SDV-A, R2] | n/e [R2] | shown: seen response IDs and seen events are recorded; no UI mark found [SDV-D]; stated: after talking, a circle by the portrait marks talked-today [R3-SDV] | shown: lines vary by hearts, day-seeded random and calendar, with a generic fallback [SDV-D] | shown: `ShopMenu` is its own menu [SDV-A] | n/e [R2] |
| Rune Factory 5 | shown: schedules list NPC, time and weather [RF5-F8] | n/e [R2] | shown: save keeps per-NPC talk history; UI unread [RF5-F3] | shown: five named talk scripts per NPC [RF5-T] | shown (counts): shops carry both a catalog and clerk talk lines [RF5-S] | n/e [R2] |
| Elin | shown: residents follow timetables tied to worksites [EL-RES] | shown: trainer services are dialogue choices [EL-PRO] | inferred: unavailable choices are not added, so they are absent rather than grey [EL-RES] | shown: affinity stages gate choices [EL-RES] | shown: training is paid inside dialogue [EL-PRO] | n/e [R2, R4] |
| Immortal Life | shown: 371 schedules; some people are met in their own home scene; shops are map points, not people [IL-N4, R2] | shown: an interact panel runs per-option conditions [IL-A01] | shown: chosen options record count and time; no UI mark found [IL-A01] | shown: greetings gate on friendship; repeat roommate talk every 3 days, mostly without reward [IL-N1,N6] | n/e [R2] | shown: dialogue panel with portrait and choice widgets [R2] |
| Tale of Immortal | n/e [R2] | shown: chat costs 5 energy; player-interrupting interaction capped near 6 a month [TOI-N23,N29] | n/e [R2] | shown: companion barks are authored data [TOI-A] | n/e [R2] | n/e [R2] |
| Scroll of Taiwu | shown: map blocks show counts of characters, not a roster [TW-MAP] | shown: options have separate visible and available conditions; "Important" options ask to confirm [TW-A01] | shown: interaction counts recorded; no UI mark found [TW-A01] | shown (partial): behavior-specific NPC words [R2] | n/e [R2] | shown: one model binds actors, costs and confirmation; layout unread [TW-A06] |
| Amazing Cultivation Simulator | shown: HUD roster of your own members only, with filter, four sorts and a compact mode; hidden in RPG mode [ACS-WND] | shown: select opens an info panel with tab buttons [ACS-PTI] | shown: `VisibleScript` hides options; `EnableScript` (disable) exists but no base graph uses it [ACS-A01] | shown: NPC-to-NPC talk has a cooldown [ACS-TR] | n/e [R2] | shown: dialogue has its own window [R2] |
| Kenshi | n/e [R2, R4] | stated: hover gives a chat cursor, one click talks; right-click offers follow or attack [R4-KEN] | stated: unique talk fires once and is remembered, with no visible mark [R4-KEN] | stated: most NPCs repeat self-description; shown: lines change when a unique NPC is dead or jailed [R4-KEN, KEN-F4,F5] | stated: right-click the shopkeeper to trade; shown: hire and protection are money-gated dialogue lines [R4-KEN, KEN-F4] | n/e [R4] |
| Caves of Qud | shown: a nearby-objects scroller refreshes each turn; stated: point-of-interest list autowalks [QUD-NIW, R4-QUD] | shown: look is separate from use; stated: Look then Space opens an interaction menu [QUD-MAN, R4-QUD] | shown: choice hashes drive visited colouring inside the conversation; no mark on the person found [QUD-A01] | shown: opening node picked by priority and conditions, so greetings follow quest state [QUD-A01] | stated: trade from a dialogue choice or directly by Tab; shown: skill teaching is a dialogue part [R4-QUD, QUD-NPC] | shown: conversation UI with number and letter keys; Escape works only when allowed [QUD-A01] |
| RimWorld | shown: pawn tables list spawned, unfogged pawns; stated: a "?" floats over visiting traders only [RW-INS, R4-RW] | shown: selection opens an inspect pane; stated: select a colonist, right-click the trader, choose Trade [RW-INS, R4-RW] | n/e [R2, R4] | shown: pawn-to-pawn talk has a per-pair cooldown [RW-S01] | stated: trade is its own verb with no dialogue step [R4-RW] | stated: trade menu opens on contact and can be closed and resumed [R4-RW] |
| Sunless Sea | stated: story events listed per port, no people list [R4-SS] | stated: port options are a choice list with locks and odds shown [R4-SS] | stated: "Something awaits you at port" flags fresh port content; no per-line mark found [R4-SS] | stated: some rewards are one-time per port [R4-SS] | stated: selling is a port market screen [R4-SS] | n/e [R4] |
| Morrowind / OpenMW | stated: topics are hyperlinks auto-built from words in NPC text [R3-MW] | stated: click a topic in the dialogue window [R3-MW] | stated: OpenMW optional, default-off colours: grey = heard from any NPC, blue = this NPC has a unique unheard answer [R3-MW] | stated (player report): repeats still leak through on ungreyed topics [R3-MW] | n/e [R3] | n/e [R3] |
| The Witcher 3 | n/e [R3] | stated: walk up and interact [R3-W3] | stated: yellow options advance the plot; icons mark service options; locked = missing ability; no heard grey found [R3-W3] | n/e [R3] | stated: shop opens from an icon-marked option inside the conversation [R3-W3] | stated: NPC's last line stays on screen; exit option always last [R3-W3] |
| Mass Effect | n/e [R3] | n/e [R3] | stated: wheel puts exploring options left and advancing right; every greyed option found is a Charm/Intimidate or morality gate, not a heard state [R3-ME] | n/e [R3] | n/e [R3] | stated: radial wheel over the scene [R3-ME] |
| Persona 5 | stated: map icons at stations show where a confidant is and whether a rank-up is near [R3-P5] | n/e [R3] | stated: the marker sits on the place and person before you go [R3-P5] | stated (player report): marker shows even when the hangout needs the confidant's invite [R3-P5] | n/e [R3] | n/e [R3] |
| Fallen London | stated: storylets mostly tied to locations; entering costs nothing [R3-FL] | stated: entering is free, options inside cost an action [R3-FL] | stated: border colour marks significance (gold often once-only); no heard mark found [R3-FL] | stated (player report): storylets fail to refresh as stats rise [R3-FL] | n/e [R3] | stated: the card hand hides while inside a storylet [R3-FL] |
| A Dark Room | stated: stranger and builder arrive by event; villagers are counts, not named people [R3-ADR] | n/e [R3] | n/e [R3] | n/e [R3] | n/e [R3] | n/e [R3] |

Covered with at least one evidenced cell: 24 games (18 from the repo's folders,
6 from outside). Groundhog Life adds evidence to TP2 only. See section 6 for the skipped ones.

## 2. Recurring patterns (three or more games each)

| Code | Pattern | Games |
|---|---|---|
| TP1 | **Presence comes from schedules; absent people live in a second home.** Who is here follows time and place. Known people elsewhere show in a notebook, map or journal, not in the here list | Majora's Mask, Stardew, Rune Factory 5, Elin, Immortal Life, Persona 5 |
| TP2 | **Heard state is stored per choice or topic.** Games record which response or option was taken, often with counts or IDs. Several never show it | Majora's Mask, Stardew, Rune Factory 5, Immortal Life, Scroll of Taiwu, Caves of Qud, Groundhog Life, Morrowind/OpenMW |
| TP3 | **Where heard state is visible, it is inside the conversation.** Visited colour (Qud), grey and blue topics (OpenMW, opt-in), exhausted options grey (Disco, player report) | Caves of Qud, OpenMW, Disco Elysium |
| TP4 | **Markers on the person, before opening, mean "something actionable or significant here", not "unheard lines".** Trader "?", confidant map icon, "Something awaits you", gold borders, a talked-today circle | RimWorld, Persona 5, Sunless Sea, Fallen London, Stardew |
| TP5 | **Grey or locked means "requirement unmet".** Players read grey as "can't", so a heard style that looks disabled collides with it | Mass Effect, The Witcher 3, Disco Elysium, Sunless Sea, Kenshi |
| TP6 | **Unavailable choices are often hidden, not shown disabled.** Engines carry both visible and enabled conditions, and content mostly uses visible | Elin, Amazing Cultivation Simulator, Scroll of Taiwu, Caves of Qud |
| TP7 | **Repeat talk is allowed, and the content shifts with state.** Greetings and lines change with relationship, quest, calendar or world events, with a generic fallback | Stardew, Kenshi, Caves of Qud, Planescape, Majora's Mask, Immortal Life |
| TP8 | **Some games ration talking itself.** Talk costs a resource, has a cooldown or is capped per period | Book of Hours, Tale of Immortal, Amazing Cultivation Simulator, RimWorld, Stardew (friendship from one talk a day) |
| TP9 | **Trade and services split both ways, and many games offer both routes.** Inside the conversation: Witcher 3, Elin training, Qud teaching, Kenshi hire, Rune Factory 5 clerks. As a direct verb or screen: RimWorld, Kenshi shop, Qud Tab, Stardew `ShopMenu`, Sunless Sea market | 9 games |
| TP10 | **Selecting is separate from acting.** Look, inspect or select first, then a menu or verb acts | Caves of Qud, RimWorld, Amazing Cultivation Simulator, BitLife |
| TP11 | **A conversation takes over a focused surface, with an explicit exit.** The surrounding hand or HUD recedes; the exit option is last or bound to Escape | Witcher 3, Disco Elysium, Citizen Sleeper, Fallen London, Caves of Qud, Amazing Cultivation Simulator |
| TP12 | **A notebook or journal keeps what was learned from people.** The conversation is not the only place to reread | Majora's Mask, Planescape, Disco Elysium, Heaven's Vault, Morrowind |

## 3. Contradictions with S1-S5 and AY14-AY18

| Code | Where good games do the opposite | Why (as far as evidence shows) |
|---|---|---|
| C1 | **Talk is not unconditional** (vs AY14). Book of Hours spends soul capacity, Tale of Immortal charges energy and caps interaction, ACS and RimWorld use cooldowns, Persona gates by time and invites | Talk is a paced resource there, so the player plans who to see. Inferred: in YAIRPG the cost is already game time, which AY14 names, so the contradiction is a dial, not a refutation |
| C2 | **No base game found shows "has unheard lines" on the person before opening** (vs AY16). Pre-open markers mean actionable or significant (TP4). Stardew's community wrote a reminder mod; OpenMW made topic colouring opt-in and off by default | Inferred: designers avoid a marker that turns every NPC into a chore and keep markers for things that matter. Stated (player report): Persona's marker loses trust when it fires and the hangout is not actually possible |
| C3 | **Grey means locked** in Mass Effect and Witcher 3 (vs AY17's "heard" mark) | A heard style that dims like a disabled control will read as "can't ask again" |
| C4 | **Heard is global per topic in OpenMW** (heard from any NPC), not per NPC (vs AY15) | Morrowind topics are shared across NPCs. YAIRPG textlines belong to one NPC, so per-NPC tracking fits our data; inferred, not a contradiction in practice |
| C5 | **Changing text rarely re-marks as new** (vs AY15's hash). Stardew varies lines daily by seeded random and calendar; Qud's choice hash covers choice identity, and retention was not established | A text hash over flavor variation would mark seasonal or random lines new every day. Qud is the closest precedent for hashing |
| C6 | **Absent people are not in the here list** (Majora's Mask, Persona). They live in a notebook or map | Consistent with S3 (displayable present NPCs) and AY10; it argues against listing absent people in Around you |
| C7 | **Verbs often sit on or near the subject** (RimWorld float menu, BitLife profile, Qud interaction menu), not in a fixed separate panel (vs S1) | Short eye travel in a spatial view. YAIRPG's conversation already renders bottom center, so S1 keeps eye travel short for the next step, which is the conversation |
| C8 | **Some conversations cannot be left at will.** Qud allows Escape only "when allowed"; Taiwu asks to confirm important options | Commitments inside a scene. AY3 assumes every conversation returns cleanly |

## 4. Patterns mapped to proposal codes

| Proposal | Verdict | Reason |
|---|---|---|
| S1 subject group in bottom Actions | supports, with C7 noted | TP10 select-then-act and TP11 focused surface; C7 shows the alternative of verbs on the subject |
| S2 quiet hint with nothing selected | supports | Inferred from TP10: games that separate select from act tell you to select first; no direct evidence |
| S3 authored NPCs everywhere | supports | TP1: present people follow place; C6 keeps absent people out |
| S4 retire dropdowns | supports | Upstream had one route; no studied game keeps two parallel name lists for the same people (inferred, absence of evidence) |
| S5 Enter runs the first verb | supports | Kenshi and Witcher 3 start talk in one action; Qud uses keys for choices |
| AY3 return with person selected | changes | C8: allow a conversation to declare itself non-leavable; normal ones return as proposed |
| AY10 departure notice | supports | TP1 schedules make departures routine |
| AY14 Talk always enabled | supports, with C1 as a world dial | TP7 shows free repeat is common; TP8 shows rationing is a deliberate alternative |
| AY15 heard lines plus text hash | changes | TP2 supports storing heard per choice; C5 says hash only content that matters, not flavor variation |
| AY16 "new" count and person mark | changes | C2 and TP4: no precedent for an unheard mark on the person; keep it truthful, subtle and switchable |
| AY17 new first, heard marked | changes | TP3 supports marking inside the conversation; C3 says heard must not look disabled; reordering conflicts with games that keep stable choice order (inferred) |
| AY18 seed old saves as heard | supports | No evidence either way; TP4 suggests under-marking is safer than marker spam |
| AY20 journal of heard topics | supports | TP12 |
| AY21 repeat flavor | supports | TP7 |
| AY9 Trade via shared controller | supports | TP9: keep Trade both as a verb and inside dialogue, as upstream already does |

## 5. New proposals (AY23-AY31)

Proposals only. They fold into the considerations doc as round 3.

- **AY23** Three distinct styles: "new" (small accent dot), "heard" (normal text with a quiet check or muted label, still fully clickable) and "locked" (grey plus a reason). Heard never borrows the disabled look (C3, TP5).
- **AY24** The person mark is truthful: count only lines that pass their eligibility now, never gated or invite-only ones (C2, the Persona failure).
- **AY25** The person mark is a setting, on by default. Around you shows only a dot, never a count; the count lives in the subject group (C2, TP4; the OpenMW opt-in).
- **AY26** The AY15 text hash covers content lines only. Greetings, seasonal flavor and random variants are excluded from "new", so day-to-day variation does not re-mark people (C5).
- **AY27** Inside a conversation, keep authored order by default and mark new lines in place. Moving new lines first (AY17) is a dial, not the default, so choices do not jump between visits (UR52, inferred from TP3).
- **AY28** Trade stays reachable both ways: the subject-group verb and the dialogue option call one function (TP9, the upstream baseline).
- **AY29** Every conversation ends with an explicit Leave option listed last, plus Esc. A world may mark a scene non-leavable with an in-world reason, and the UI says so (C8, TP11).
- **AY30** LATER: when a place has many people, group Around you by role (merchants, residents, travelers) with an optional filter. Never auto-reorder on a "new" change (TP9 scale evidence from ACS and BitLife, UR52). Small UI lane; done when 15 seeded NPCs stay scannable at 1366×768.
- **AY31** LATER: "People you know" in the journal shows last-seen place and known schedule hints for absent people (TP1, C6; Majora's Mask notebook). It extends AY20. Mid UI lane; done when an absent NPC appears there and not in Around you.

## 6. Coverage and budget

**Covered (24 rows):** Majora's Mask, Disco Elysium, Planescape: Torment, Heaven's
Vault, Book of Hours, Citizen Sleeper, BitLife, Stardew Valley, Rune Factory 5,
Elin, Immortal Life, Tale of Immortal, Scroll of Taiwu, Amazing Cultivation
Simulator, Kenshi, Caves of Qud, RimWorld and Sunless Sea (18) are from the
repo's folders; Groundhog Life adds TP2 evidence only. Morrowind/OpenMW,
The Witcher 3, Mass Effect, Persona 5, Fallen London and A Dark Room are from
outside.

**Thin (a cell or two):** Citizen Sleeper, BitLife, Tale of Immortal, A Dark
Room, Mass Effect, Persona 5 (search snippets only), Groundhog Life.

**Skipped, with reasons:**
- Kingdom of Loathing: the repo has only clan and shop-price rows; the wiki returned 403 and a mirror had an expired certificate.
- Melvor Idle: shops are a menu with no people.
- Discworld MUD: no talk evidence in the repo; earlier wiki fetches failed.
- Magic Research 2, Wildermyth, King of Dragon Pass, Six Ages: no dialogue hits in the repo's notes.
- Citizen Sleeper 2: no talk evidence beyond one player report on lost access.
- Cultivation idlers: unseen-scene filtering only, too thin for a row.
- Sunless Skies: no talk evidence in the repo.

**Not covered:** Q7 (scale) and Q8 (complaints) have little evidence beyond
ACS, BitLife, Qud, Fallen London, Persona and OpenMW. No game has
**shown** evidence for screen placement from actual play. A play pass with
screenshots of owned games (Stardew, Qud, Disco, RimWorld) would upgrade
Q2/Q6/Q7 from stated to shown.

**Budget (AU1, AU3, AU7):** one coordinator; 4 of 4 reader invocations used
(R1 repo narrative and idle, R2 repo life sim and sandbox, R3 outside games
from the web, R4 web gap pass on six repo games). At most two ran at once. All
readers ran on Sonnet; no paid or stronger-model fallback. Readers did not
retry failed fetches. The coordinator ran two extra web searches to check the
Witcher 3 and Mass Effect "greyed heard" question; neither confirmed a heard
grey. The budget bound was reached and expansion stopped there.

## 7. Sources

Private notes (gitignored, full URLs and quotes):
`[R1]` [private/R1_repo_narrative_idle.md](private/R1_repo_narrative_idle.md),
`[R2]` [private/R2_repo_lifesim.md](private/R2_repo_lifesim.md),
`[R3]` [private/R3_external_web.md](private/R3_external_web.md),
`[R4]` [private/R4_web_gap_pass.md](private/R4_web_gap_pass.md).

Repo files (paths under `docs/research/`):

- MM: `majoras-mask/REPORT.md` F1-F6; `majoras-mask/private/repass-2026-10-14/CALL_NOTES.md`
- DE: `disco-elysium/FINDINGS.md` F4, F7, F18
- PST: `planescape-torment/SMALL_TOUCHES.md` S3, S22, S25
- HV: `heavens-vault/KNOWLEDGE.md`, `heavens-vault/REPORT.md`
- BOH: `book-of-hours/FINDINGS.json` BOH-F25, `book-of-hours/REPORT.md`
- CS: `citizen-sleeper/SMALL_TOUCHES.md` T03-T06
- BL: `bitlife/REPORT.md` F4
- SDV: `stardew-valley/DIALOGUE_AND_EVENTS.md` (D), `stardew-valley/aspects-2026-10-14/ASPECTS.md` (A)
- RF5: `rune-factory-5/DIALOGUE_AND_HELPERS_DIGEST.md` F8, `REPORT.md` F3, `private/fs-rune-factory-5/tables/TalkDataTable.json` (T), `aspects-2026-10-14/SYSTEM_INVENTORY.md` (S)
- EL: `elin/readers/RESIDENT.md` (RES), `elin/readers/PROGRESSION.md` (PRO)
- IL: `immortal-life/NPC_LIFE_DIGEST.md` N1, N4, N6; `immortal-life/aspects-2026-10-14/ASPECTS.md` A01
- TOI: `tale-of-immortal/pass-2026-10-14/` N23, N29; `tale-of-immortal/aspects-2026-10-14/REPORT.md` (A)
- TW: `scroll-of-taiwu/private/aw-mapdomain-2026-10-16.md` (MAP), `scroll-of-taiwu/aspects-2026-10-14/ASPECTS.md` A01, A06
- ACS: `amazing-cultivation-simulator/private/around-you-sims-2026-10-16/Wnd_GameMain.cs` (WND), `Panel_ThingInfo.cs` (PTI), `aspects-2026-10-14/ASPECTS.md` A01, `traces/actors.md` (TR)
- KEN: `kenshi/FINDINGS.md` F4, F5
- QUD: `caves-of-qud/aspects-2026-10-14/ASPECTS.md` A01 and UI notes, `caves-of-qud/NPC_FINDINGS.json` (NPC), private captures `Qud.UI.NearbyItemsWindow.cs` (NIW) and `Manual.xml` (MAN)
- RW: `rimworld/private/` `InspectPaneUtility.cs` (INS), `rimworld/FINDINGS.json` social-01 (S01)

Public sources (each reader note carries the exact page per claim):

- R3-MW: [UESP AddTopic](https://content1.uesp.net/wiki/Morrowind_Mod:AddTopic), [OpenMW forum](https://forum.openmw.org/viewtopic.php?p=50314), [OpenMW commit](https://git.cijber.net/mirror/openmw/commit/f9577d904cf0b2c351919b3e70a47020470cb056)
- R3-W3: [How to Make an RPG, Witcher 3 conversation](https://howtomakeanrpg.com/r/a/witcher-three-conversation.html)
- R3-ME: [Fextralife morality system](https://masseffect1.wiki.fextralife.com/Morality+System), [TechRadar](https://www.techradar.com/news/mass-effects-dialogue-system-started-with-real-promise-and-went-downhill-from-there)
- R3-P5: [Digital Trends confidants guide](https://www.digitaltrends.com/gaming/persona-5-romance-confidants-guide-tips/), [Steam player thread](https://steamcommunity.com/app/1687950/discussions/0/3489752656795504377)
- R3-FL: [Fallen London wiki: Storylets](https://fallenlondon.wiki/wiki/Storylets), [Cards](https://fallenlondon.wiki/wiki/Cards), [Failbetter community](https://community.failbettergames.com/t/persuasive-storylets-not-changing/14258)
- R3-ADR: [Wikipedia](https://en.wikipedia.org/wiki/A_Dark_Room)
- R3-DE: [design blog](https://tommartin.myblog.arts.ac.uk/?p=168), [Steam player thread](https://steamcommunity.com/app/632470/discussions/0/2823131222985947424)
- R3-SDV: [Stardew wiki: Friendship](https://wiki.stardewvalley.net/Friendship), [reminder mod](https://www.nexusmods.com/stardewvalley/mods/14709)
- R4-QUD: [Qud wiki: Trade](https://wiki.cavesofqud.com/wiki/Trade), [devlog 2019-03-01](https://freeholdgames.itch.io/cavesofqud/devlog/70009/featire-friday-march-1-2019)
- R4-KEN: [GamesFuze beginner's guide](https://gamesfuze.com/guides/kenshi-complete-beginners-guide/)
- R4-RW: [RimWorld wiki: Trade](https://www.rimworldwiki.com/wiki/Trade)
- R4-SS: [LP Archive, Sunless Sea update 6](https://lparchive.org/Sunless-Sea/Update%2006), [Sunless Sea wiki: Story Event](https://sunlesssea.fandom.com/wiki/Story_Event)
- Coordinator check: [Witcher 3 search lead, GOG thread](https://www.gog.com/forum/the_witcher_3_wild_hunt/spoilers_the_dialogues_that_affect_the_ending_are_unfairly_obscure), [Mass Effect Steam thread](https://steamcommunity.com/app/17460/discussions/0/2564160288787994615)
