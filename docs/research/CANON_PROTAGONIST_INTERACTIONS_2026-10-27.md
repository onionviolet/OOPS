# Playing as, beside or apart from a world's original protagonist (2026-10-27)

Status: research and proposals. Nothing here is accepted. Codes PX1 to PX18 are
proposed local labels and are not registered in the rules index. Engine owns
verbs, worlds own nouns (WA5). No world's sealed truth is stated in this file;
canon facts used are public and come from repo owners.

Weibao's words (2026-10-27, also in [USER_VISION](../USER_VISION.md)): "Schedule
rather than deadline should be the case, unless it is a deadline like the
protagonist of the original book doing this at x time or something, we might need
separate chat to ponder interactions as a player on the original character of
worlds?" This file is that separate pass. It builds on the clock record in the
[NPC absence report](NPC_ABSENCE_AND_REACH_OUT_2026-10-27.md) (C1 to C3, S1 to S3).

Labels: **[S]** sourced this session (link given); **[U]** from memory,
unverified; **[I]** inference for this project. Method: one standard web search
per topic, no page fetches, so every [S] row is a search summary. Many results
were forum threads, fan wikis or guide sites and are flagged. Unreached items are
listed in Part B.3.

## Part A. What the repo already decided

### A.1 Existing owners

| Topic | Owner | What it says |
| --- | --- | --- |
| Beside, never as | [WER11](../WORLD_ENTRY_RULES.md) | "Live beside protagonists, never as them." Check sequels for later protagonists and eras. |
| Direct canon starts | [INTRO_FLOW SG8, WF1, SA10](../INTRO_FLOW_CONSIDERATIONS_2026-10-13.md) | Playing a source character is reachable under a chosen premise or a direct-adaptation request, with its own label. Default starts sit beside canon. Hero-adjacent seats (sibling, rival, classmate, mentor) are owned. |
| Direct recreations stay private | AD1; [WA2](../WORLD_ABSORPTION_RULES.md) | Public build uses original names; direct adaptations live in a private pack. Packs cite, they do not quote. |
| Fresh canon per life | INTRO_FLOW BW1 to BW8 | Each new life starts a fresh copy of the timeline at the chosen anchor. A changed timeline continues only by choice (BW2). A played canon character returns to canon behavior in the next fresh timeline (BW4). Same OC replayed is a fresh instance (BW5). |
| Timeline anchor and premise | INTRO_FLOW WC4, WC5 | Before, during or after a source arc, or source-free. Premise: canon, divergent, AU, randomized truth. A Soldier's Life already offers canon and divergent premises in its private pack. |
| Natural course | [TIMELINES_AND_DIVERGENCE](../TIMELINES_AND_DIVERGENCE.md) OD7, OD8 | Divergence spreads along relationships. Canon corrects itself only through a world mechanism (fate, will, history), never to protect an author's planned scene. |
| Canon clock and foreknowledge | [LIVING_BESIDE_PROTAGONISTS](LIVING_BESIDE_PROTAGONISTS_2026-10-10.md) P1 to P10, M1 to M3 | Premise families (born there, adult outsider, replace a canon character P3, peer P4, earlier era P5, civilian P6, villain-side P7, regressor P8). M1: canon events as scheduled deadlines. M2: foreknowledge as states (full, partial, fading, scrambled, none). M3: sticky great events, fragile local details. |
| Needs and fillers | [RELATIONSHIPS_AND_CANON](../RELATIONSHIPS_AND_CANON_CONSIDERATIONS_2026-10-18.md) RLB3, RLB4 | Canon already assigned who fills each need. Arrive first and both can share the role; displacing one needs a real cause. |
| Protagonist fate | LIFE_SIM_NORTH_STAR D2a; RIVALS_IDENTITIES_AND_FATE | Book protagonists are very hard to defeat unless fate is severed; fate works per world and is not settled. |
| Other protagonists as people | LIFE_SIM_NORTH_STAR "Protagonists and cheaters as other characters"; [ENEMY_PROTAGONISTS](../ENEMY_PROTAGONISTS.md) | They run on the life framework, can be sponsored, warned, replaced or ignored, and notice change. Not implemented. |
| Entry questions | WER2 to WER9, WER14; [prose rules PR1 to PR3](../MASTER_PLAYABILITY_PLAN_2026-10-25.md) | Method, nine answers, era, origin, carry. Start text speaks from what the character knows, with a "full premise" dial. |
| Entry-method catalogue | WER2 XM1 to XM10 | XM1 soul into the recently dead, XM3 whole-body transport, XM4 rebirth, XM8 native-born with later memories, XM9 time return. |

### A.2 What exists per entry shape

| Shape | In the repo today |
| --- | --- |
| Transmigration into the protagonist's body | Paper only: LIVING_BESIDE P3 and SG8. No pack offers it. The LOTM pack's people are "original, unnamed, no canon identity" (`src/book_world_lotm_content.js`), and the HP pack has "one unnamed role" for the Potions master. Direct recreations are outside the public build by AD1. |
| Starting beside them | The only built shape. LOTM: four early-Tingen starts in 1349 (`src/book_world_lotm_entry.js`), clerk hosts, original supervisors. HP: an eleven-year-old pupil, or an adult glass trader. Both are beside canon by default, but no canon person is present. |
| Taking a bystander's place | Listed (SA10, P4, "Moretti family" in P4's LOTM example) with no mechanism for "the seat is taken, so the canon occupant is elsewhere". RLB3 says two people may share a role. |
| Arriving at a different date | LOTM: era axis offers 1349 only; 1352 and later are listed as "Not written yet". The Tingen source card places the protagonist's arrival on 28 June and notes July 1349 elsewhere ([CONTEXT_OPENING](novels/full-book/lord-of-mysteries/CONTEXT_OPENING.md), edition-qualified). HP: no cohort anchor. |

### A.3 Gaps this pass found

- **G1. WER11 says "never" and SG8 says "reachable".** Both are repo text. Part C
  proposes the reconciliation as default, dial, reason (PX1, PX17).
- **G2. LOTM's start has a year but no month.** Today's four starts say 1349; the
  source card says the protagonist arrives in June and a later chapter is in July
  of the same year. Whether a start is before, on or after that arrival is
  therefore unsettled in data. Until a world pass records the start's date,
  "beside" can only mean "same city, same year, relation to the arrival unknown".
- **G3. HP has no cohort offset.** The school start is first-year at eleven, but
  nothing says which year relative to the protagonist's cohort. The WER table
  already flags era as a question.
- **G4. No record for a beat.** C1's clock record has `source` and `scope`, but
  nothing yet describes a canon beat's date check, its inputs or its outcomes.
- **G5. Sequels and later volumes are unread for beat purposes.** WER4 and WER11
  already require this before a premise leans on them.

## Part B. How other games and fanwork handle it

### B.1 Findings

| Work | Playing the canon character or a near-canon seat | Fixed date or recurring schedule | If you ignore a canon beat | Script versus waiting world |
| --- | --- | --- | --- | --- |
| Fire Emblem: Three Houses | You are Byleth, the fixed protagonist, and choose a house. Part I is shared; the game diverges at Chapter 12 into one of four routes, and the Black Eagles route needs conditions met earlier or the game defaults to Silver Snow [S, [Prima](https://primagames.com/tips/fire-emblem-three-houses-chapters-guide-story-paths), [RPG Site](https://rpgsite.net/feature/8833-fire-emblem-three-houses-routes-guide); the two guides disagree on where that Edelgard condition is checked, so the exact point is unresolved]. | Calendar months with free days; story dates are fixed. | A missed condition silently routes you to the default branch [S]. | Authored branches avoid both a forced single script and a waiting world, at the cost of one hidden gate. [I] |
| Persona 5 (Royal) | You are a fixed named-by-player avatar in a calendar year. | Dated cutoffs: most confidants remain open to the end of the year, a few close earlier tied to plot events [S, secondary guides that disagree on exact dates: [Games Learning Society](https://www.gameslearningsociety.org/wiki/is-there-a-deadline-for-confidants/), [cgmag](https://www.cgmagonline.com/guides/persona-5-confidant-guide-sae-igor-morgana-and-sojiro)]. | A missed link is gone for that run [S]. Opacity about which ranks matter pushes players to manual saves [S]. | Hard dates with early warning from the calendar. The opacity is the part to avoid. [I] |
| Mass Effect | Shepard is player-defined; BioWare's marketing director said there is no "canon" version of the hero [S, [Engadget on default-hero use](https://www.engadget.com/2011/07/19/bioware-13-of-mass-effect-players-use-default-hero-18-play-f/), [Wikipedia](https://en.wikipedia.org/wiki/Commander_Shepard)]. ME2's crew-risk clock is in the [absence report](NPC_ABSENCE_AND_REACH_OUT_2026-10-27.md) Part A. | A fear clock before one finale [S there]. | Costs land on the crew, not on the player's access [S there]. | The protagonist is a blank the player fills, so "playing the canon character" is not a conflict. [I] |
| Fate/Grand Order | Ritsuka Fujimaru is written as a self-insert for the player, with sparse background; name and gender are customizable [S, [Type-Moon wiki via search](https://typemoon.fandom.com/wiki/File:Agartha.png)]. The Lostbelt detail came only from a fan profile and is unverified [U]. | Event-driven, not a calendar [U]. | Not found. | The avatar is a thin shell so the canon cast carries the story. [I] |
| Dragon Age | The Keep turns Origins and DA2 decisions into a world state loaded when a new game starts; a default state loads if you export none; not every choice matters [S, [EA Keep FAQ](https://help.ea.com/en-us/help/dragon-age/dragon-age-keep-faq)]. How the earlier Warden appears in Inquisition: not found. | None. | Choices persist as facts, not deadlines. | A world state as an import record is the closest precedent for a branch carried between lives. [I] |
| The Witcher 3 | You are Geralt, a canonical lead from earlier games. One critic argues the urgency framing around finding Ciri does not hold when the game invites side play [S, opinion: [GameSkinny](https://www.gameskinny.com/opinion/why-the-witcher-3-didnt-completely-win-me-over/)]. | Soft urgency by story framing. | The world visibly waits. | A cautionary case: urgency stated but not enforced reads as dissonance, not freedom. [I] |
| Pathologic 2 | You are a fixed protagonist in a twelve-day plague. | Hard: twelve days, a town destroyed if no cure; each day's single major task, if skipped, kills an ally [S, [Bonus Stage](https://www.bonusstage.co.uk/archives/156659), [Edge via PressReader](https://www.pressreader.com/australia/edge/20200103/281522227989678)]. Quests vanish when the day ends [S]. | Permanent loss; opportunities may be gone for good [S]. Whether the town's end follows directly from ignored quests: not found. | "You can't save everyone" is the design [S]. An authored stance the player chooses by buying the game, not a default to import. [I] |
| Disco Elysium | You are a fixed amnesiac protagonist. | The clock advances only on interaction, so there is no waiting world [S, [RPGamer](https://rpgamer.com/review/disco-elysium-review/)]. A one-week structure: not found. | Not applicable: time moves when you act. | An action-driven clock: nothing happens while you idle. Matches the repo's frozen-world default. [I] |
| Crusader Kings 3, Hearts of Iron IV | You are a ruler placed at a bookmark date. Bookmark start dates are limited (hard to source distant history) and extra ones come from mods [S, fan-sourced: [Steam Workshop](https://steamcommunity.com/app/1158310/discussions/0/3004423845044036499)]. HoI4 offers a Historical Focus setting for the AI, and alternate-history paths in DLC [S, [Paradox press](https://gamespress.com/New-Histories-and-New-Tactics-Coming-to-Hearts-of-Iron-IV)]. | Dated bookmarks; historical or free AI. | Nothing forces history. | A per-game switch between "history leans on" and "history is only a starting state" is the clean precedent for a per-life dial. [I] Total War scripted historical triggers: not reached. |
| SaGa (Romancing SaGa series, Free Scenario) | You pick among protagonists in one setting. Minstrel Song's time progression tracks days in a living world and governs quest availability, recruitment and world events; you can miss an event you never had to attend [S, [Common Sense Media](https://www.commonsensemedia.org/game-reviews/romancing-saga-minstrel-song-remastered), [Cubed3](https://www.cubed3.com/games/reviews/playstation-5/romancing-saga-minstrel-song-remastered-international)]. Time in these games passes by battles per a forum list [S, weak: [GOG forum](https://www.gog.com/forum/general/how_should_games_model_time)]. | A world calendar advanced by play. | The event happens without you. | The world carries on without the protagonist, but only while the player acts, which is the repo's lazy model. [I] |
| Self-insert and canon-divergence fanwork | Fanlore: a canon divergence AU diverges from canon at a point of departure, sometimes in backstory or during canon; "canon-compliant" aligns with canon [S, [Fanlore](https://fanlore.org/wiki/Canon_divergent)]. Self-inserts are often fix fics [S, [PPC wiki](https://ppc.fandom.com/wiki/Self-Insert)]. "Butterfly effect" and "fixed point" were not found in the glossary results. | Canon events as the clock (LIVING_BESIDE M1). | Readers favor foreknowledge that costs something and mock walkthrough style (LIVING_BESIDE M2 [S there]). | Fanwork practice backs M3: big beats resist, details bend. |
| Tabletop campaigns in canon | Canon characters work best as cameos so important NPCs can grow with the party; killing a major canon figure breaks continuity fastest; campaigns that engage canon directly tend to be more memorable if the group wants that [S, opinion: [Cannibal Halfling](https://cannibalhalflinggaming.com/2020/10/28/the-trouble-with-canon/)]. A GM anchors a campaign at a fixed point to cut note-keeping [S, [Nerdist](https://nerdist.com/article/gms-our-best-tips-for-handling-time-travel-in-your-rpgs/)]. | An anchor date. | GM judgment. | Cameo canon plus an anchor date. [I] |
| Fallout 1, Majora's Mask, Stardew, Animal Crossing | Covered in the [absence report](NPC_ABSENCE_AND_REACH_OUT_2026-10-27.md) Part A. | Fallout: a paid-extendable deadline; Majora: visible schedules with notebook memory; Stardew: recurring decay with offsets. | See there. | See there. |

### B.2 What the findings say

- **F1. Fixed dates and recurring schedules usually coexist.** Persona and Fire
  Emblem run a calendar (schedule) with dated gates (deadlines) on top. The gates
  carry the story; the calendar carries the days. Matches S1: schedules are the
  default, deadlines come only from an in-world source. [I]
- **F2. Silent gates are the common complaint.** Persona's opacity and Fire
  Emblem's hidden Edelgard condition are the failures to avoid. A canon beat that
  can close a door needs a lead the player can read (C2's hard degree). [I]
- **F3. A world that waits forever reads as dissonance when urgency is stated.**
  The Witcher critique is one opinion, but it names the risk. The repo's frozen
  default is fine only if the beat is stated as a date in the world's own clock,
  not as a pressure about real time. [I]
- **F4. A forced script reads as a railroad; a branch list reads as options.**
  Fire Emblem and HoI4 both turn "the story" into a chosen path or setting.
  [I]
- **F5. Action-driven clocks avoid both problems.** Disco Elysium and SaGa
  advance time through the player's acts, so the world moves exactly as far as
  the player has. This is the repo's lazy evaluation (C3). [I]
- **F6. An import record is the precedent for branch continuation.** Dragon Age's
  Keep. [I]
- **F7. Cameo canon plus anchor date is what tabletop advice converges on.** [S,
  opinion]

### B.3 Unreached or weak

- Total War scripted historical triggers: the search returned only Hearts of Iron.
- Dragon Age's Warden-versus-Inquisitor cameo handling: no page found.
- Disco Elysium's day structure: not confirmed.
- "Butterfly effect" and "fixed point" as fandom terms: not in results.
- Persona and Fire Emblem exact dates: guide sites disagree; used only as shape.
- Fate/Grand Order's Lostbelt structure: fan profile only.
- Primary developer statements: none retrieved for any entry. All [S] rows are
  search summaries, several secondary.

## Part C. Proposals for YAIRPG

Every item is a proposal with default, dial and reason, in the repo's framing.

### C.1 Modes

**PX1. Six modes, with "beside" as the default.** The mode is a field on the
start record next to WER2 to WER9.

| Mode | What it is | Default, dial and reason |
| --- | --- | --- |
| Beside | A life in the canon setting who is not the protagonist and not in their circle (a clerk, a classmate in another house, a neighbor). | Default for every book world (WER11, WF1). Dial: beside can be near (shares a place and weekly rhythm with the protagonist) or far. Reason: it is the only shape that exists in data. |
| Follow or join | Enter the protagonist's circle: a teammate, house-mate, same employer or same class (P4). | Dial: offered where the world pass has canon records for that circle. Reason: gives canon beats a natural attachment point (scope C1) without being the protagonist. |
| Bystander seat | Take a minor canon seat the book places near a beat (SA10, RLB3). The canon occupant still exists elsewhere unless a cause removes them. | Default: the seat is shared (RLB3), not stolen. Dial: displacing the occupant needs an in-world cause and cost. Reason: otherwise a seat read as a free swap erases canon without a mechanism. |
| Divergent | Start from a changed premise at a branch point (fanlore "point of departure"; WC5). | Dial: what changed is recorded as input diffs (PX9); a changed or randomized truth is sealed by ID. Reason: matches OD7 and OD8. |
| After canon | A life after the arc closes (P5's mirror), or in a sequel's era (WER11's Lumian note). | Gated on a source pass of the late volumes (G5). Reason: later reveals can overturn an opening (WER4); do not start there from the opening alone. |
| Be the protagonist | Take the original character's life, by replacement (the body, the place, the obligations; an outsider mind, XM1) or as a straight recreation. | Default: not in the public build. Dial: available in the private direct-adaptation pack under its own label (SG8, AD1) and in worlds whose protagonist is the player by construction (C.4). Reason: attribution, and D2a plus the world's fate rules were written around that person. |

**PX2. Era is a field of the mode, in the world's own calendar.** WER6 already
requires it. For each mode, a start names a date relative to the canon line:
before it, at an anchor beat, or after it. LOTM's 1349 gets a month once the
world pass settles G2. HP gets a cohort offset (G3). Reason: "beside" before the
protagonist arrives and "beside" in their third year are different lives.

### C.2 A canon beat is a clock with extra fields

**PX3. Beat record = C1 clock record plus these fields.** C1's fields stay (id,
source, scope, degree, lead, miss behavior, recovery). Add:

| Field | Meaning |
| --- | --- |
| `canonDate` | The beat's date in the world's own calendar, with the source's locator (WA2: cite, do not quote). A date, never a count of real time. |
| `inputs` | The facts the canon outcome depended on (people present, an item held, a place open). A disturbance to an input changes the outcome (OD7, RLC). |
| `outcomes` | Canon outcome, altered outcome per changed input class, deferred. Each is a record, not prose. |
| `kind` | `great` (sticky, M3), `detail` (fragile, M3) or `routine` (the protagonist's own recurring schedule). |
| `sealed` | Whether the beat's truth is sealed (changed or randomized truths only). |

**PX4. Degree follows kind.** Default: `routine` beats are ambient or soft
schedules (S1), `detail` beats are soft, `great` beats are firm, and a `great`
beat becomes hard only if the world has an in-world mechanism that closes the
door (OD8) and the player's life is within scope. Reason: Weibao's correction
says deadlines only from an in-world source; this makes the source explicit.

**PX5. Attachment is by scope, not by world.** Default: a canon beat attaches to
a life only if one of these holds: the life is in `follow`, `bystander` or `be`
mode for that circle; the life holds a fact in the beat's `inputs` (for example
works at the same office); or the life has been within the ripple reach of the
protagonist (TIMELINES default: connected people). A `beside` life far from the
line is not counted and gets no note line. Reason: C1, and the sealed-secrets and
frozen-world rules. Dial: a visible "history leans on" switch per life (HoI4's
Historical Focus is the precedent [S]) with three settings: *background*
(beats happen and are ambient), *natural course* (beats attach by scope, the
default), *free* (the canon line is only a starting state).

### C.3 What happens to a beat the player does not attend, and to ones they cause

**PX6. Evaluate against the world's own date, lazily.** A canon beat is keyed to
`canonDate` on that world's clock and checked when that world's clock next moves
(C3). The accepted frozen-world default holds: a world does not tick while the
player is in another world or away, so a beat never fires because real time
passed, and absence cannot trigger canon. Where a world runs while you are away
(an exception with a stated rule), the beat resolves when the world clock passes
`canonDate` and the player is next in that world.

**PX7. Unattended means the world carried on, with a trace.** Default: the canon
actors produce the canon outcome unless an input changed; the player gets a line
in the return note ("while you were at X: the register at Y was posted") plus one
visible after-effect in the place (a door shut, a rumor, a seat changed hands).
Dial: how large the trace is, by degree. Reason: F3 and F5, a world that moves
exactly as far as the player has, and a miss that still reads as consequence.

**PX8. Three outcome classes, no fourth "world waits".** Resolved by inputs:
(a) *carried*: inputs unchanged, canon outcome; (b) *altered*: an input changed
(by the player or another cause), so the altered outcome record applies; (c)
*deferred*: a precondition is absent (the protagonist is elsewhere), so the beat
moves to its next valid date or lapses with a trace. Reason: avoids both a world
that freezes the plot for you and a script that forces you through it.

**PX9. Beats the player causes are input diffs.** A change is recorded as
`{beat id, input, was, now, cause, date}`. Downstream beats whose `inputs` mention
the changed fact are re-evaluated when their date arrives (lazy, per beat). No
whole-world simulation. Canon corrects itself only through a named world
mechanism (OD8); where none exists, the new state stands. Reason: OD7, OD8.

**PX10. Never a silent gate.** Any beat that can close a door shows its lead
early and shows what recovery costs (C2). The first firm or hard beat of a life
gets a plain heads-up in the return note and the World/Schedule view. Reason:
F2.

**PX11. Foreknowledge is a state with a price.** Mode defaults for M2: `beside`
and `bystander` natives: none; `follow` natives: none or partial; outsiders with
canon memory: full, fading or scrambled by the method (XM1, XM8, XM9); `be` by
replacement: the body's memories plus whatever the method carries. The "hide
it" choice exists. Dial: per start. Reason: M2 and WER3's memory question.

### C.4 Per world

| World | Honest answer | Modes offered, default | Canon beats |
| --- | --- | --- | --- |
| Village variant | Original world. There is no canon protagonist; the lead is the player's own character, and past lives can be NPCs there (BW3, IX2). | One mode in practice: the player is the Village's hero by construction. | None by default. A "passing hero" world event is an original proposal (a named traveler passes through on a schedule) and not canon. In-world deadlines exist only if Weibao writes them for this world. |
| Proto23 | Credited faithful port ([access decision](NPC_ABSENCE_AND_REACH_OUT_2026-10-27.md)). The source's protagonist is the player avatar. | Be, which here means the source's own avatar. No modes to add. | None. The weekly dojo meal stays a schedule (C4 of the absence doc). Nothing added to the faithful build. |
| YAIR | Faithful baseline of an idle game whose lead is the player [I]. | Be, as above. | None. Daily price recovery stays a schedule. The quest chain is a sequence, not a dated deadline [I]. |
| LOTM (Tingen) | The only built world with a real canon line. Today's pack has no canon identities; starts are 1349, month unsettled (G2). | Beside (default, built). Follow and bystander after a world pass writes the early-arc circle as records. Divergent where WER5's neutral crossing meets a canon route. After canon waits for a late-volume pass. Be only in the private pack. | Many beats, by degree (PX4). Date anchors exist for the opening (the protagonist's arrival in June 1349 and a later July date, edition-qualified). Beats beyond the early arc stay off until the source pass reads past it (WER4). The world's own mechanisms may notice divergence (divination, fate); verify per beat before use (OD8). |
| HP | Pack has an unnamed Potions master role and original household people; school start at eleven with no cohort offset (G3). | Beside (default). Follow as a house-mate or classmate of the protagonist's cohort needs the cohort offset and canon records (HP doc proposes six schedule-bearing canon people as T2 records). Bystander and after canon are LATER. Be only in the private pack. | `routine` beats are the term timetable (schedules, already the HP rhythm). `great` beats attach only to lives whose cohort overlaps. Term events are scheduled first (GM plan 15.5), so most HP "canon" is calendar and not deadline. |

**PX12. Where the player is the avatar, add nothing.** Proto23 and YAIR already
satisfy "play the original protagonist" because the original protagonist is the
player's avatar. Inventing modes there would add canon the sources do not have
(WA17-style scope drift). Reason: F4 and the faithful-port decision.

### C.5 Spoilers, prose and sealed secrets

**PX13. Beat names are spoilers for a new reader even when they are public
franchise facts.** Start and schedule text follows PR1 to PR3: discovery wording
by default, "full premise" on request. Add a per-player dial: *I know this
book*, *new reader*. It changes labels only (the beat is "the arrival at the
bureau" for a reader who knows, "something due at the church office" for one who
does not). Reason: WER3 wants a knowing choice about costs without a tour of
hidden structure.

**PX14. Canon text is cited, not reproduced.** Beat records hold a locator and a
short paraphrase (WA2). A returning-note line is original prose in the world's
voice. Reason: copyright and AD35.

**PX15. Sealing follows the existing rule.** Public franchise twists are not
sealed. A changed or randomized truth is: its beat record sets `sealed` and is
referred to by ID, route and status in docs and UI (for example "B-D2: altered,
route found"). The `outcomes` of a divergent start do not appear on its confirm
screen. Reason: AGENTS sealed-secrets rule.

### C.6 Saves and continuation

**PX16. Save shape.** A life stores `mode`, `anchor` (world date and canon
reference), the `history leans on` setting, and a list of beat results
`{beat id, class (carried, altered, deferred, caused), date, input diffs}`. No
canon text is stored. Reason: small, replayable, cites sources.

**PX17. Compatibility and branches.** Fresh canon per life (BW1) stays the
default. Continuing a changed timeline is an explicit branch choice (BW2), and the
branch list shows the mode and the count of altered beats, never the sealed
truth (BW6). Existing saves load as `beside`, `natural course`, with no beat list
(WER16): no behavior change. A change to a start record or pack identity needs a
compatibility decision as WER16 says. A dedicated import record in the style of
the Dragon Age Keep [S] is an option only if branch transfer becomes common.

**PX18. Proposed rewording of WER11 (not edited here).** Current: "Live beside
protagonists, never as them." Proposed: "**Default: live beside protagonists.**
Dial: a life may follow, replace a bystander or diverge from them; being the
protagonist is available in the private direct-adaptation pack and in worlds
whose protagonist is the player's own avatar (SG8, AD1). Reason: public
attribution, canon fate rules built around that character, and a start that
declares its mode like any other." This removes the "never" the project's own
framing forbids. It needs Weibao's acceptance and a same-change update to the
WER11 row and its AD line in the rules index.

### C.7 Recommended defaults in one place

- Mode: beside. Attachment: by scope. History switch: natural course.
- Degree: great is firm, detail is soft, routine is ambient or soft.
- Unattended: carried with a trace in the return note.
- Foreknowledge: none for natives, a priced state for outsiders.
- Spoiler dial: discovery wording by default, "I know this book" opt-in.
- Be the protagonist: private pack and avatar-by-construction worlds only.

## Part D. More to consider (round 1)

Codes: F findings, D decisions, O options, R risks, Q questions, A actions.

### Findings (new)

- **F8. "Beside" is the only shape with data, and "beside" is itself unspecified
  until the world settles its date.** G2 and G3 mean the built LOTM and HP starts
  cannot say whether they come before, with or after the canon line.
- **F9. Replacement is cheaper to model than recreation.** An outsider in the
  protagonist's body inherits the body's obligations, and canon deadlines attach
  through them (scope) with no new beat data. A direct recreation needs full
  character data and fidelity. [I]
- **F10. A bystander seat conflicts with RLB3's default.** If two people can share
  a role, "I took the seat" needs an explicit cause for the occupant's absence,
  or the seat is shared and the occupant reacts to you.

### ACT NOW (done in this file)

- A1. Named the WER11 versus SG8 conflict and proposed a rewording (PX18).
- A2. Reconciled the owners instead of writing a rival spec (A.1, PX3 to PX11).
- A3. Settled the frozen-world question: beats key to the world's date (PX6).
- A4. Named the data gaps (G1 to G5) and picked codes that do not collide with
  CP, C, S, E, N (PX).
- A5. Recorded the request in USER_VISION and a pointer in Round 11.

### ACCOUNT FOR NOW

- R1. **Spoiler leak through beat labels.** Mitigation: PX13 and PR5's lint over
  start and schedule strings, extended with a per-world list of beat names.
- R2. **A beat record for each of dozens of canon events is content cost.**
  Mitigation: write only `great` and `routine` beats for the early arc first
  (kind-gated), `detail` beats on demand.
- R3. **A returned-from-absence note listing many canon misses becomes noise.**
  Mitigation: C2's cap on visible firm beats applies; attached beats only.
- R4. **Sealed changed truths in a divergent start.** Mitigation: PX15 by ID.
- R5. **D2a (protagonist fate) is unsettled.** `be` and `follow` modes make the
  protagonist's survival a pack decision; do not fix a single rule across
  worlds. Default per pack, with the world's mechanism named (WA4).

### LATER or DELEGATE

| # | Item | Level | Effort | Done check |
| --- | --- | --- | --- | --- |
| L1 | Settle LOTM start date (G2): add month to start records and read the opening's date anchors | World pass (WPR/WER6) | Small, Sonnet reader plus review | Each of the four starts records a date relative to the arrival, with locators. |
| L2 | HP cohort offset (G3) and the six canon schedule records | World pass | Medium | A life with cohort offset 0 sees canon `routine` beats; offset 2 sees none. |
| L3 | Beat record resolver on top of the clock resolver (PX3 to PX9) | Engine, small | Medium | Two scripted lives: one in scope sees the beat and a miss note; the other sees nothing. A changed input flips a downstream outcome. |
| L4 | Early-arc LOTM beat set as data, `great` and `routine` only | Source deep dive then data | Medium to high | Each beat has a locator, inputs and at least two outcomes; sealed ones are marked. |
| L5 | Spoiler dial and beat-name lint | UI plus `check:rules` | Small | The confirm screen of a "new reader" life shows no beat names; the lint catches a planted name. |
| L6 | Source pass on the research gaps (Total War, Dragon Age cameo, primary developer statements) | Research | Small | B.3 rows updated with primary sources or kept as gaps. |
| L7 | "Passing hero" original event for the Village variant | Design, Village slice | Small | Optional; only if Weibao asks. |

### Decisions and questions

- D1. Proposed default: beside, natural course. Recommended; not accepted.
- D2. Proposed WER11 rewording. Needs Weibao's yes before the owner edit.
- D3. Order: L1 and L2 before any beat data (a beat has no anchor without a date).
- No either/or questions: each item above carries a default.

### Top three recommendations

1. **Make "beside, natural course" the default and attach canon beats by scope**
   (PX1, PX5). Reason: it gives LOTM and HP a canon line without forcing any life
   through a script, and it makes Weibao's "deadline only from the protagonist's
   line" literal.
2. **Settle dates first (L1, L2), then build the beat record on the clock
   resolver** (PX3 to PX9). Reason: a beat cannot be checked without a world date,
   and C1 to C3 already give the lazy evaluation.
3. **Reword WER11 as default and dial** (PX18) so "be the protagonist" has a
   private-pack route and avatar-by-construction worlds are not forced into a
   mode system they do not need (PX12).

## Part E. Round 2: prior art, comics and fanfic as a method (2026-10-27)

Weibao asked: has anyone done this before, would we gather fanfics and compare
them with the original, how do comics do it, more to consider? Method as in Part
B: one standard search per topic, summaries only, no page fetches. Labels as
above. Proposals only.

### E.1 Has anyone done this? Closest precedents

No search found a game that combines a scoped canon clock, lazy evaluation and
protagonist modes the way Part C does. Pieces exist separately. [I]

| Precedent | What it did | Lesson for YAIRPG |
| --- | --- | --- |
| Hogwarts Legacy | A new student in the 1890s, about a century before the books; sources say the era freed the developers from altering the main story and opened an unused setting, and canon status is unconfirmed [S, [Den of Geek](https://www.denofgeek.com/?p=814247), [Sportskeeda](https://www.sportskeeda.com/esports/none-harry-potter-s-main-characters-likely-appear-hogwarts-legacy-good-thing)]. Two SEO pages gave other years and are not used. | An **other-era start** is the cheapest way to live in a canon setting with no protagonist to collide with. It fits WER6 and LIVING_BESIDE P5. |
| Dragonlance modules | Players run pregenerated Heroes of the Lance and reenact the war; Riverwind and Tika begin as DM-run characters and others become playable later; the published adventures flex with choices, but the canon storyline is largely assumed [S, [Dragons of Despair](https://en.wikipedia.org/wiki/Dragons_of_Despair), [DL series](https://en.wikipedia.org/wiki/DL_series)]. A newer world book reportedly moves players to their own Heroes of the Lance, from forum posts [S, weak: [EN World](https://www.enworld.org/posts/9991692/)]. | "Be the protagonist" has a long tabletop precedent as pregens. The weakness is the assumed storyline. Give each pregen's circle seats too (PX24). |
| SaGa Free Scenario | World days pass as you act; events, recruitment and quests open and close without you [S, Part B.1]. | The closest match to lazy, action-driven canon beats. |
| The Lord of the Rings Online | Fellowship instances for private story, layered instancing for special story moments, and phasing in the Isengard book so choices change NPCs and buildings in a shared space; players reported spoiled or hijacked phased moments [S, [Engadget](https://www.engadget.com/2009-02-24-the-daily-grind-is-phasing-the-new-instancing.html), [Engadget](https://www.engadget.com/2011-11-15-rings-and-words-of-power-going-inside-lotros-update-5.html), 2009 to 2011 coverage]. The epic story mixes the studio's own events with Tolkien's [S, same]. | Phasing is the MMO name for "render the world by this life's facts", our scope test (PX5). One person can be the hero because the world shows each person their own state. Single-player has no spoil problem, and we avoid the cost of shared instances. [I] |
| Telltale and BioWare "string of beads" | Branches split and re-converge to a single track; critics call many choices "false" or "for the moment", and compare Mass Effect 3's ending [S, [Game Informer](https://www.gameinformer.com/b/features/archive/2015/02/03/why-your-choices-dont-matter-in-telltale-games.aspx), [Bright Shiny Robot](https://bigshinyrobot.com/video-games/wizeguy-pro-choice/); cost is cited as the cause, [Mancunion](https://mancunion.com/?p=35670)]. | Convergence at big beats is acceptable. Losing the differences afterward is the failure. Keep consequences as facts (PX19). |
| Spider-Verse "canon events" | Miguel O'Hara's society says certain moments in a Spider-Person's life must happen or a universe collapses; the role of Ben Parker is filled by different people across universes; Miles is called an anomaly; the film leaves Miguel's logic open to doubt [S, [Looper](https://www.looper.com/1304052/spider-man-across-the-spider-verse-every-canon-event), [Digital Fix](https://www.thedigitalfix.com/spider-man/across-the-spider-verse-anomaly-plot-hole)]. | Fiction has already named this exact problem. Two lessons: the role is fixed and the filler can vary (PX20), and the claim "this must happen" is made by someone in the world, so it can be wrong or contested (PX21). |
| Doctor Who fixed points and Loki's TVA | Fixed points are immovable moments; the TVA prunes "Nexus" deviations before they branch. One article reads them as inverse ideas [S, [SlashFilm](https://www.slashfilm.com/581727/loki-doctor-who-comparisons-marvel/), [Den of Geek](https://www.denofgeek.com/tv/loki-what-is-a-nexus-event/)]. | Two mechanisms for "canon resists": the event is rigid, or an agent enforces. Pick one per beat and name it (OD8). |
| Marvel and DC comics | Marvel names its main continuity Earth-616 and tells What If? stories that alter one key moment outside it; DC's Elseworlds is a non-canon imprint; DC collapsed its parallel Earths in Crisis on Infinite Earths because juggling them confused readers and creators [S, [Wikipedia What If](https://en.wikipedia.org/wiki/What_If_(comics)), [TV Tropes Elseworlds](https://tropedia.fandom.com/wiki/Elseworlds), fan wikis; dates need primary checks]. | See E.2. |

### E.2 What comics add

- **A labeled main line plus labeled side branches.** Earth numbers and
  What If? issues are branch ids with a stated departure point. This is BW1
  (fresh canon) plus BW6 (labeled branch list). A life's branch id is the
  departure beat and a short change summary, with sealed truths by ID. [I]
- **A cost warning.** Many live parallel worlds forced a reboot at DC [S,
  secondary]. BW7 already says abandoned branches are not simulated; add a cap
  on continued branches shown at once (PX23).
- **Alternate-reality stories sit outside continuity on purpose.** A
  divergent start can be cheap if it is declared non-main (Elseworlds) and its
  results never rewrite the fresh-canon copy. That matches BW4. [I]

### E.3 Fanfic: yes, as a method, with three different jobs

The original, fanfic and other media do different jobs, so comparing them is
useful and none replaces another.

| Source | Job | Never used as |
| --- | --- | --- |
| The original book | Truth of the beat: date, participants, what depended on what. Locators per WA2. | n/a |
| Fanfic corpus | A palette of departure points, seats beside canon and consequence chains players already want to explore; a count of what readers choose. | Evidence of what the book does. Label as fan inference. |
| Games, comics, TV | Structural patterns (Part B, E.1). | Content. |

**Research precedent.** Computational fan studies exist: Messina (2019) read about
3,759 Legend of Korra fics against air dates and classed uptakes as
canon-complicit, explicit-implicit or canon-resistant [S, [Journal of Writing
Analytics](https://wacclearinghouse.org/docs/jwa/vol3/messina.pdf)]; Kleindienst
and Schmidt (2020) compared character mentions in about 7,853 Supernatural fics
with the episodes [S, [Regensburg](https://epub.uni-regensburg.de/50828/1/Kleindienst%20%26%20Schmidt%20%282020%29%20-%20Supernatural.pdf)];
Vadde and So paired close and computational reading of Harry Potter fic [S,
[DukeSpace](https://dukespace.lib.duke.edu/items/e2c1d7ab-6c00-4a8e-af59-c2b0ae658bef)];
a Harry Potter and Naruto canon-versus-fanon sample used only 10 stories each
[S, weak: [Uzhhorod repository](https://dspace.uzhnu.edu.ua/jspui/bitstream/lib/68426/1/FROM%20CANON%20TO.pdf)].
A study using "canon divergence" as a tag category was not found. The tag system
carries seven tag types usable as metadata [S, [Project MUSE](https://muse.jhu.edu/article/970680)].

**PX25. A bounded departure-point census, not a scrape of everything.**
Extends the 2026-10-10 fan-premise surveys ([LIVING_BESIDE](LIVING_BESIDE_PROTAGONISTS_2026-10-10.md),
private folder, gitignored); do not restart them.

1. *Metadata pass (cheap).* Per target world, collect tags and summaries only
   for a bounded sample of canon-divergence and "beside the protagonist" fics:
   departure point, seat taken, era, pairings of "what changed" and "first
   consequence". Output: counts and a ranked list of departure points and seats.
2. *Text sample (small).* For the top five departure points, read three to five
   fics in capped shards (haiku readers, AU15 caps) and extract only
   `input changed, outcome` pairs in our own words.
3. *Reconcile with the original.* A canon locator decides whether the departure
   point is real. Pairs from fics enter `outcomes` as `fan inference` and get
   authored by us; they do not become canon facts.
4. *Output.* Per world: the first ten departure points worth authoring, the
   seats worth offering (PX1's follow and bystander), and a tag-derived
   faithfulness label for branch lists (PX26).

Guards: raw fic text stays out of git (research rules); collection goes through
the polite scraper and its site-rule checks, and I have not verified any site's
terms, so that check comes first [U]; one coordinator, one shared budget (AU rules);
an acquisition needs Weibao's yes where it downloads books or fanfiction in
bulk. Where he already owns exports, read those first.

### E.4 New proposals

| Code | Proposal | Default, dial and reason |
| --- | --- | --- |
| PX19 | **Converge the event, keep the difference.** A `great` beat may converge to a canon-shaped result, but every changed input persists as a fact afterward: who was there, who owes you, what was taken. | Default: persistence on. Dial: how many facts a beat keeps. Reason: the "string of beads" complaint is lost differences, not convergence [S, opinion]. |
| PX20 | **Beats name roles, not people.** A beat has role slots (the one who dies, the one who warns) with a canon filler by default; another person can fill the slot when inputs allow (RLB3). | Default: the canon filler. Dial: how freely a slot refills. Reason: Spider-Verse shows the same event filled by different people [S]. |
| PX21 | **"Must happen" needs an in-world authority.** A firm or hard beat names who or what enforces it (a rule of the world, an institution, a fate mechanism), or it stays soft (OD8). | Default: soft without a named enforcer. Dial: the enforcer may be wrong or contested. Reason: Spider-Verse's authority is questioned in the film [S]. |
| PX22 | **Offer an other-era start beside any canon line.** Before or after the protagonist's era, no protagonist collision. | Default: offered where the pass has era data (WER6). Dial: how far from the canon line. Reason: Hogwarts Legacy [S]. |
| PX23 | **A cap on continued branches shown at once.** | Default: three live branches in the picker, the rest archived and listed. Dial: any number. Reason: DC's parallel-Earth burden [S, secondary] and BW7. |
| PX24 | **Pregen circles.** In `follow` and private-pack `be` modes, offer the protagonist's circle as playable seats, with roles that start as NPCs (Dragonlance's Riverwind and Tika [S]). | Default: circle seats only where records exist. Reason: more than one way to be near the line. |
| PX26 | **A derived faithfulness label for branch lists.** From beat results: *complicit* (mostly carried), *divergent* (some altered), *resistant* (mostly altered). | Default: label only, no reward or penalty. Reason: Messina's three classes [S] make a cheap, spoiler-free summary. |

### E.5 More to consider (round 2)

**ACT NOW (done):** recorded precedents and the fanfic method (E.1 to E.3);
added PX19 to PX26 (PX25 is the method); no ids collide with CP, C, S, E, N.

**ACCOUNT FOR NOW**

- R6. **Fan corpus bias.** Popular fic skews toward pairings and fix-its, so the
  census over-represents romance and rescue. Mitigation: rank departure points by
  canon locator, not popularity alone; use counts to order work only.
- R7. **A source-world rule against fan content.** Some projects keep fan
  material off the repo. Mitigation: only our own paraphrase and counts are
  committed (existing rule).
- R8. **Fan tags are user-made.** Counts are noisy [S, MUSE]. Treat as
  indicative.
- R9. **Hidden "canon events" feel cheap if enforced by a bare label.** PX21 asks
  for a named enforcer.
- R10. **Branch sprawl.** PX23.

**LATER or DELEGATE**

| # | Item | Level | Effort | Done check |
| --- | --- | --- | --- | --- |
| L8 | Departure-point census for LOTM and HP (PX25 steps 1 to 3) | Research lane, haiku readers, one coordinator | Medium | A ranked list of ten departure points and five seats per world, each with a canon locator or "no locator"; no raw text in git. |
| L9 | Role-slot field in the beat record (PX20) | Docs then data | Small | A beat with a role slot filled by a different person resolves with the altered outcome. |
| L10 | Other-era start for HP (the book's earlier decades) and LOTM | World pass | Medium | A start record with era, WER answers and no protagonist collision. |
| L11 | Branch picker labels (PX23, PX26) | UI | Small | A picker shows branch id, departure summary and label, hiding sealed truth. |
| L12 | Primary-source check of the E.1 rows (comics dates, LOTRO current design, Dragonlance's new book) | Research | Small | Rows updated or kept as gaps. |

**Unreached in this round:** current LOTRO design (coverage is 2009 to 2011);
primary Marvel and DC statements; a study that treats "canon divergence" as a tag
class; official Dragonlance product details (forum posts only); any site's terms
for collecting fanfiction.

**Top three after round 2**

1. Add **role slots and persisted differences** to the beat record (PX19, PX20):
   they answer both "forced script" and "choices vanish".
2. Treat **other-era starts** as the cheapest first canon-adjacent mode (PX22),
   then follow and bystander seats where the census says players want them.
3. Run the **departure-point census** (PX25) as a bounded, metadata-first lane
   after L1 and L2, so authored beats follow what the original supports and
   readers choose.

## Part F. Round 3: considerations not yet covered, and what makes this easier (2026-10-27)

Weibao asked for deeper considerations and what would make this easier. No new
web research; this round is inference from the repo owners and Parts A to E, so
every item is [I] unless a source is linked. Proposals only.

### F.1 Considerations not yet covered

| Code | Consideration | Why it matters | Default, dial and reason |
| --- | --- | --- | --- |
| PX27 | **The canon line is a life, not a table.** A protagonist is an NPC with a plan, a schedule and information limits, run on the same life framework as everyone else (LIFE_SIM_NORTH_STAR "Protagonists and cheaters as other characters"; ENEMY_PROTAGONISTS; plan clocks, BX6). Beats are what that life does on its dates. | It removes a second beat system. Inputs are that person's dependencies; outcomes are what they do next. | Default: a line is one scripted NPC life plus its circle. Dial: how much of it is simulated versus replayed from records. Reason: reuse. |
| PX28 | **Beats reach the player through in-world media, with delay.** Newspaper line, rumor, a clerk's remark, a changed notice board. Witness levels: heard of, saw the aftermath, present, involved. | The cheapest content per beat is one line, and it makes unattended beats real (PX7). It matches the foreknowledge states "known, guessed, unknown" (UIV6). | Default: every `great` beat gets a rumor line with a delay by distance. Dial: media per world (HP papers, Tingen papers). Reason: a trace you can read costs one string. |
| PX29 | **Attendance is an appointment, not a new system.** "Be at the office on the day" is an ordinary errand or appointment on the one under-way list (UIV3). | Idle play needs beats that do not block. | Default: beats you choose to attend become appointments; others resolve without you. Reason: reuse the schedule and return-note machinery. |
| PX30 | **Playing the part is a verb.** In `be` by replacement, NPCs compare you with the person they knew; imitation quality (voice, habits, known facts) governs suspicion over time. LOTM's own verb is "act the role" (GM plan 15.4), so this lands on a built mechanism. | It turns the hardest mode into play instead of a switch. It needs a per-character profile (voice, habits, ties) that the RLB need-profile idea already sketches. | Default: private-pack `be` modes carry a role profile. Dial: how fast suspicion rises, by how close each NPC is. Reason: the world notices through its own mechanisms (WER12). |
| PX31 | **A line has a status.** *Active*, *diverged* (alive, off the canon track), *ended* (died, retired, finished), *succeeded* (someone else carries it). When the player removes or replaces the protagonist, the world keeps going: beats whose roles lose their filler lapse with a trace or reassign (PX20). | Without this, killing or sponsoring the protagonist breaks the world or freezes it. | Default: the world continues as an ordinary world after an ended line. Dial: whether a successor exists, by the world's mechanisms (OD8). Reason: AD38. |
| PX32 | **Offscreen is mostly inference.** A book is told from the protagonist's side, so most of the world's simultaneous life is invented. Beats the protagonist does not witness are labeled `inferred` and written as our own proposal. | It stops invented content reading as canon. | Default: label every non-witnessed beat. Reason: unbiased-lens rule and WPR evidence labels. |
| PX33 | **Compression.** A canon year can span a thousand chapters while idle play covers many days between beats. | Quiet stretches are normal, so beats act as the event-director feed (CP2): canon beats become storylet prerequisites, not a separate pacer. | Default: beats and local storylets share one director. Dial: world temperament. Reason: no second pacer. |
| PX34 | **Several lines per world.** Sequels, spin-offs, ensembles and villain-side leads give more than one line (WER11 already notes LOTM's second book). | A world pass should list lines, not one protagonist. | Default: `lines[]` per world; each line carries its own era and circle. Reason: P5 and P7 premises. |
| PX35 | **Information hazard is a cost, not a block.** Foreknowledge of a beat can be spent (warn, trade, intercept). Using it tells the world's observers where to look; reaction comes from the world's mechanisms (OD8). | Gives the knowing player something to play and the world something to answer. | Default: spending foreknowledge raises attention in worlds that watch (divination, institutions). Dial: per world. Reason: M2 and WER12. |
| PX36 | **Public/private split of the data.** Public packs use original names and cite instead of quote (AD1, WA2). A beat table with canon names and dates is direct-adaptation data and belongs in the private pack; the engine fields, original sample beats and tests stay public. | This is the largest structural fact: the system must be buildable and testable without any canon text in the public repo. | Default: engine and test content public, canon beat rows private. Reason: attribution and WA2. |

### F.2 What would make this easier

**E1. Build the engine against an original mini-book first.** The Village is
ours. Give it a small original "passing hero" line: one NPC life, five beats,
three role slots, one circle. It exercises scope, degrees, inputs, outcomes,
traces, rumors, branches and saves with no licence question, in the public build,
and every later world gets the same engine. Default: this is the first slice.
Reason: PX36, and the Village loop is the cozy low-pressure test bed already in
the plan.

**E2. A null-player golden run.** Run the world with no player life and assert
each beat resolves as `carried` on its `canonDate`. Then run a scripted
intervention and assert the exact `altered` outcome and the changed downstream
fact. It is cheap, deterministic and covers the property that matters (the line
reproduces itself and moves when poked). Default: one fixture per line. Reason:
lean tests (AGENTS), by system.

**E3. Derive `canonDate` with a deterministic tool.** Where the repo already holds
source cards and chapter notes (the LOTM cards give date anchors such as the June
arrival and a July chapter), extract date anchors and chapter indexes with a
local script into a table, then have a reader check the few ambiguous ones.
Default: tool first, human or model review second. Reason: token-efficient long
runs; the cards already warn that intervening-day links need evidence.

**E4. Start with `routine` and `great` beats of one month.** One month of LOTM's
early arc (the opening weeks around the June 1349 arrival) and one school term of
HP's timetable. Ten to twenty beats each. Default: that is the pilot size.
Reason: R2 content cost.

**E5. Reuse, do not extend, the existing records.** Clock record (C1), under-way
list (UIV3), return note (UT3), foreknowledge states (UIV6), branch list (BW6),
start record fields (WER2 to WER9), event director (CP2). New fields are PX3's
five and the line status. Default: no new UI surface beyond a "Canon" section in
the existing schedule view and a mode line on the confirm screen. Reason: UR and
AD36 efficiency.

**E6. Order by what is cheapest to verify.** (1) Village mini-line (E1, public).
(2) HP routine beats, since the calendar is already built and the beats are
schedules, with the cohort offset (L2). (3) LOTM month pilot in the private pack
after L1. (4) `follow` and `bystander` seats from the census (PX25). (5) `be` in
the private pack. Default: this order. Reason: each step reuses the last and none
needs a licence decision before the engine exists.

**E7. Decide four small things once, so lanes do not reopen them.** Recommended
defaults, none accepted:

| Decision | Recommended default |
| --- | --- |
| Where canon beat rows live | Private pack for named canon; public for original lines |
| History switch default | Natural course (PX5) |
| Who may be played as the protagonist | Private pack and avatar-by-construction worlds (PX18) |
| What a lapsed beat does | Trace in the return note, no penalty to the player, and recovery only where C2's hard degree says so |

### F.3 More to consider (round 3)

**ACT NOW (done):** PX27 to PX36 and E1 to E7 recorded here.

**ACCOUNT FOR NOW**

- R11. **A line is a heavy NPC.** A fully simulated protagonist costs more than a
  replayed one. Mitigation: replay from records by default (PX27's dial).
- R12. **Role profiles for `be` are content-heavy and copyright-adjacent.** They
  belong in the private pack and cite instead of quote.
- R13. **A null-player run can hide drift in non-canon fixtures.** Pin the
  fixture's inputs in the test record.
- R14. **Rumors can spoil.** PX13's spoiler dial applies to rumor text too.

**LATER or DELEGATE**

| # | Item | Level | Effort | Done check |
| --- | --- | --- | --- | --- |
| L13 | Village mini-line: one NPC life, five beats, three role slots, rumor lines, golden-run test | Engine slice, public | Medium | Null run carries all five beats on their dates; a scripted warning flips one outcome and one downstream fact; a life out of scope sees no note; save and reload keep the results. |
| L14 | Date-anchor extraction script for local source cards | Tooling | Small | A table of dates with chapter indexes for the LOTM early arc; ambiguous rows flagged. |
| L15 | Line status field (PX31) and succession rules per world | Rules | Small | An ended line leaves the world running; lapsed beats leave traces. |
| L16 | Role profile format for `be` (PX30) | Private pack data | Medium | A profile drives a suspicion score in a scripted run. |
| L17 | Media delay table per world (PX28) | World data | Small | Each `great` beat has a rumor line with a delay by distance. |

### F.4 Updated top three

1. **Build the engine on the Village mini-line with a null-player golden run**
   (E1, E2, L13). It is public, licence-free and proves the whole path.
2. **Treat the protagonist as an NPC life and beats as its dated actions**
   (PX27), delivered through rumors and appointments (PX28, PX29), so no second
   beat system exists.
3. **Keep canon names and dates in the private pack** (PX36) and derive dates with
   a tool (E3), so the public repo carries the mechanism and tests only.

## Part G. Round 4: influence on the original lead, being caught in beats, an open-domain pilot and protagonist-first authoring (2026-10-27)

Weibao's questions: how do we treat our influence on the original protagonist;
beats change the world around us too (caught in the crossfire, or able to
join); a first story from the open domain; and whether a world should be built
by first assuming a full playthrough as the book's protagonist, then opening
the seat to our own person. No new web research. [I] unless noted; [U] items are
from memory and need a check before use. Proposals only. Codes PX37 to PX52.

### G.1 Our influence on the original lead

PX27 makes the lead an NPC life, so influence uses the same channels as any
NPC (RLB; ENEMY_PROTAGONISTS). Nothing new is needed except a ledger.

| Code | Proposal | Default, dial and reason |
| --- | --- | --- |
| PX37 | **Five channels, all existing verbs.** What they *know* (tell, rumor, warn), what they *have* (gift, trade, theft), whom they *meet* (introduce, block, delay), their *state* (heal, harm, feed, lodge), and their *opposition* (aid or hinder those against them). | Default: influence only through these channels, each recorded as an input diff (PX9). Reason: WA5; engine owns verbs. |
| PX38 | **Reaction comes from their need profile and the world's laws, not from you.** The lead weighs a help or a warning against what they want and fear (RLB1, RLB4) and against their own information limits (PX32). | Dial: how stubborn, per character. Reason: advice that always works is a cheat; advice that never works is a wall. |
| PX39 | **Recognition ladder.** Unknown, glimpsed, known by name, remembered, trusted, rival. It advances by repeated, legible contact and sets how the lead and their circle treat you. | Default: no automatic closeness for arriving first (RLB3). Reason: a bond is a mechanism, not a meter. |
| PX40 | **Protective fate is a named mechanism per world, not a blanket shield.** D2a stays unsettled; each pack says what protects the lead (an institution, luck, a rule, plot-adjacent authors do not count, OD8), what it covers and what gets through. | Default: protection stated per pack, with cost and exceptions. Reason: AD38 and the project's default-dial-reason framing. |
| PX41 | **Credit and blame travel.** The lead and their circle may attribute outcomes to you correctly, wrongly or not at all; third parties hear the version their sources give. | Default: attribution follows who saw it. Reason: gives influence a social shape and a trace. |
| PX42 | **An influence ledger per line.** One row per change: channel, was, now, date, how seen. Summed it is the line's divergence, which feeds PX26's label and the branch list. | Default: always on for lines you touch. Reason: cheap, replayable, spoiler-free. |

### G.2 Beats change the world around us

A beat has a **footprint**, so the question "were we nearby" has an answer
without simulating anyone.

| Code | Proposal | Default, dial and reason |
| --- | --- | --- |
| PX43 | **Beat footprint = place set, window, hazard kinds, open roles.** Examples of hazard kinds: violence, fire, crowd, official sweep, curse or other world-specific hazard, contagion. The record is data on the beat (PX3). | Default: every `great` beat has one. Reason: lets exposure be a lookup. |
| PX44 | **Exposure ladder.** Unaffected, heard of, saw the aftermath, affected by the aftermath, present, caught up, involved. | Default: the ladder is shown in the return note by name. Reason: states are already what a player would say. |
| PX45 | **Exposure is computed lazily from where the life was.** A life's schedule and under-way list give its place at the window (PX29); if that place is in the footprint, the engine resolves an exposure outcome. Lives elsewhere get only the ripple. | Default: lazy, one lookup per beat per attached life. Reason: C3 evaluation; no simulation of absent lives. |
| PX46 | **Idle safety.** A footprint with a hazard is announced with a lead (a closed street, a posted notice, a curfew), and an idle life with stop conditions halts at the edge. Without prior consent, outcomes are bounded: displaced, delayed, hurt but recoverable, questioned, recruited or hired. Harsher outcomes need a dial the player set (a risky life, a hunter, a soldier). | Default: bounded unless the life took on risk. Reason: the attention report's stop reasons and pace dial; Persona's lead without its opacity (F2). |
| PX47 | **Participation is a role slot (PX20) offered to a life that fits.** Witness, helper, guide, rescuer, supplier, hostage, scapegoat, hired hand. It appears as an invitation or a chance if the life is in the footprint and has the capability or the fact the role needs. | Default: offered, never forced; declining leaves the canon filler. Reason: the same slot machinery handles joining and being caught. |
| PX48 | **Second-order ripples reach everyone in scope.** Prices, closures, new patrols or laws, refugees, shortages, investigations and funerals. They are world-state changes written to notices and prices, affecting lives by the facts they hold, whether or not they were present. | Default: a small set per `great` beat (two or three). Reason: the beat matters to lives that never saw it, and the cost is one world-state edit each. |
| PX49 | **Sealed truths stay behind discovery even when you are present.** Witnessing a beat shows what a person there would perceive, not the beat's sealed content; public franchise facts are not sealed (AGENTS). | Default: perception text per witness level. Reason: PR1 and the sealed-secret rule. |

### G.3 Starting from the open domain

The request is to pilot on something we can use freely. Two pieces already
settled the first part: the Village mini-line (E1) is original and public. For a
real book, an out-of-copyright work lets us test the whole method, including
dates and text extraction, in the public repo.

**PX50. Pilot book from the public domain, chosen for what it tests.**
Candidates from memory [U]; each edition's status needs a check on Project
Gutenberg or equivalent before any text is used, since a translation or
edition can be in copyright when the original is not.

| Candidate | Tests | Notes |
| --- | --- | --- |
| *Dracula* (1897, English) | Dated beats from diary and letter entries, a small cast, bounded months, a clear lead and circle. | Best test of `canonDate` extraction (E3) and of the null-player run. Recommended first. |
| *Pride and Prejudice* | A social schedule (visits, balls, letters), bystander seats around a lead, a life-sim feel close to HP's calendar. | Second pilot. Dates are implicit, so a human pass is needed. |
| *Journey to the West* (a public-domain English edition, if one is verified) | A passing hero on a road, villages that meet him, a progression feel. | Good for the "passing hero" seat. Pick an edition only after a status check. |
| *The Count of Monte Cristo* | Long arcs, a deliberate plan with dated stages, a lead who manipulates others. | Strong test of influence (G.1) and of a line with a plan. |

Default: *Dracula* after the Village mini-line, then one more only if it adds a
distinct test. Reason: dated entries give E3 its cleanest input, and a pilot in
the public repo needs no private pack. [I] Caveat: a horror text is not our
tone; the pilot is an engine and method test, not a shipped world, and nothing
requires it to become one.

### G.4 Protagonist-first authoring (the method Weibao described)

His proposal: first assume a full playthrough as the book's protagonist and
create every detail that character needs, so the book becomes a real world; then
implement playing as our own person.

**Assessment.** It is sound, and it matches PX27 and E2: the protagonist's run is
the canon line, and the null-player golden run is that same run played by a
scripted lead. It also supplies a completeness test that the repo's world passes
lack: **every place, item, price, law and person the lead touches must exist as
a world fact.** That list is the necessary core; a bystander's needs (lodging,
food, work, rumor) are the second layer and are covered by the existing world
pass questions.

| Code | Proposal | Default, dial and reason |
| --- | --- | --- |
| PX51 | **Protagonist-first pass, in four steps.** (1) *Lead run*: write the lead's path as dated beats and dependencies, with every touched fact (the necessary core). (2) *Scripted lead*: a bot plays the lead through the engine; the null-player golden run must reproduce the canon outcomes on their dates. (3) *Open the seat*: the same world with the lead as an NPC and the player in `beside`, `follow` or `bystander` modes. (4) *Add the second layer*: fill the needs of other lives and the fan-derived departure points (PX25). | Default: the method for any world with a canon line. Dial: depth of step 4 per world. Reason: the whole world is then proven playable by someone before the player arrives. |
| PX52 | **Scaffold, not a gate.** The lead run proves the world; it is not a required player playthrough, and it is not a quality gate for worlds without a canon line. | Default: authoring and test scaffold only. Reason: WORLD_COMPLETION_STANDARD says an opening playthrough is not a prerequisite; completion measures authored delivery. |

**What this changes in the earlier plan.** Part F's E6 order stays; PX51 is the
method inside each step. A world pass would add one small deliverable: the
lead-run table (beat, date, place, dependencies, touched facts) with evidence
labels (WPR). Proposed as a WPR candidate and not edited into WORLD_PASS_RULES.

**Cautions.**
- The lead's run covers the lead's world. Their blind spots are the world's
  blind spots (PX32); step 4 and the `inferred` label address that.
- A lead with a cheat or a special route makes step 2 depend on that mechanism.
  The bot may need the mechanism built before it can finish, which is a useful
  ordering signal, not a reason to skip it.
- Several leads or lines (PX34) need one run each.
- Step 2 must not become a script that the real player is pushed along. The bot
  is a test double; the player's world has no lead script except the lead's NPC
  life.

### G.5 Many ways to do the same thing

The orders overlap, so pick by the cheapest verification. Recommended single
path, no either/or: Village mini-line (public, original; E1, L13) with a
null-player run, then a public-domain pilot through PX51 (*Dracula* as the
default), then the private-pack canon worlds in E6's order, HP routine beats
first. The earlier modes (PX1) are the seats opened at PX51 step 3.

### G.6 More to consider (round 4)

**ACT NOW (done):** PX37 to PX52; the method assessment; the pilot shortlist.

**ACCOUNT FOR NOW**

- R15. **Edition status.** A public-domain original may have in-copyright
  translations or editions. Check before extraction (PX50 [U]).
- R16. **Footprint authoring cost.** Two or three ripples per `great` beat.
  Mitigation: write footprints only for beats a life can plausibly reach.
- R17. **Exposure surprises in idle play.** PX46 lead and bounded outcomes.
- R18. **Fan-derived departure points outrun canon.** Keep the `inferred` label
  and the canon locator rule (PX25).
- R19. **A lead-run table is a spoiler artifact.** Keep it in the private pack
  for named canon; the public pilot's table is fine to publish.

**LATER or DELEGATE**

| # | Item | Level | Effort | Done check |
| --- | --- | --- | --- | --- |
| L18 | Footprint and exposure resolver (PX43 to PX46) on the Village mini-line | Engine slice | Medium | A life at the market on the beat's date gets an exposure line and a bounded outcome; a life at home gets only a ripple; an idle life halts at the posted edge. |
| L19 | Influence ledger and recognition ladder (PX39, PX42) | Engine slice | Small to medium | A warning flips one outcome; the ledger shows the row; the lead's reaction differs by need profile. |
| L20 | Lead-run table template and the scripted-lead bot (PX51 steps 1 and 2) | Tooling plus test | Medium | The bot reproduces five beats on their dates from the table. |
| L21 | Edition check and date extraction for the public-domain pilot | Research then tooling | Small | An edition verified as public domain; a dated beat table with chapter indexes. |
| L22 | Propose PX51 as a WPR candidate for Weibao's decision | Docs | Small | A WPR proposal paragraph, not an edit to the rulebook. |

**Updated top three**

1. **Adopt protagonist-first as the authoring method** (PX51, PX52): lead run,
   scripted lead, open the seat, add the second layer. It doubles as the
   golden-run test and proves the world playable before the player arrives.
2. **Make exposure a lookup on a beat footprint** (PX43 to PX46), with bounded
   outcomes for idle lives and role slots for joining (PX47), so being caught
   and being able to help use the same machinery.
3. **Pilot in the public repo** with the Village mini-line and then one
   verified public-domain book (*Dracula* by default), so the engine and method
   are proven before any named canon enters the private pack.
