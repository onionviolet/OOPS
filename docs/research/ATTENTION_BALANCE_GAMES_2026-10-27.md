# Attention balance in comparable games (2026-10-27)

Proposals only; nothing here is accepted. Question from Weibao: does gameplay go
two ways, life-sim or more active, and what do other games do to balance them?
Answer in one line: they do not pick. They run one world on a **dial of how much
attention each stretch of play asks for**, and they pay for that dial with a
small set of rules (stop conditions, rhythm limits, a director). YAIRPG already
owns most of the parts; what is missing is the dial itself and its contract.

Evidence labels used below: **[S]** = fact from a source linked in this file or
in `docs/RESEARCH_IDLE_GAMES.md`; **[U]** = from memory, unverified;
**[I]** = my inference. Web search this session returned mostly wiki, forum and
press summaries; where a search could not reach a primary page (the Melvor and KoL
wikis returned 403), the claim carries that limit.

Related owners: [Master plan Round 10](../MASTER_PLAYABILITY_PLAN_2026-10-25.md)
(OL1-OL5, CP1-CP9, WR1-WR10), [Village loop GM plan](../gm/dispatch/village-loop-2026-10-27/GM_PLAN.md)
(sections 15-18, VC12 temperament dial), [world absorption rules](../WORLD_ABSORPTION_RULES.md)
(WA5: engine owns verbs, worlds own nouns), [idle research](../RESEARCH_IDLE_GAMES.md),
and the accepted pause and offline direction in PROJECT.md (2026-10-15: current-world
catch-up pauses at important unresolved choices; caps and bank still open).

## 1. What the games do, by question

### 1.1 The attention dial (idle to hands-on)

- **Melvor Idle.** Offline progress records the skill you were training and
  computes the time away. Sources disagree on the base cap: most say 24 hours, one
  guide says 18; no official page was reachable. [S, weak]
  ([Steam thread](https://steamcommunity.com/app/1267910/discussions/0/591762563949134719),
  [vaporlens summary](https://vaporlens.app/app/1267910/melvor_idle.md)). The repo's
  own dossier deliberately asserts no cap (RESEARCH_IDLE_GAMES.md line 59).
  **Treat 24 h as unverified.**
- **Idle Loops (Omsi fork).** Each run is a small reset; automation and saved
  move lists persist between runs [S, community review]
  ([IncrementalDB](https://www.incrementaldb.com/community/review/4766)). Code
  records offline time and spends it on accelerated play [S, repo dossier line 60].
  The player's attention goes into the plan, not into clicking.
- **Increlution.** A queued action list; an empty queue pauses the game
  [S, repo dossier line 43/63]. The pause is the takeover point.
- **Dwarf Fortress.** Standing orders queue jobs when inputs appear; manager work
  orders mass-produce; idle dwarves with the right labor take jobs. Work orders
  can get stuck if ingredients vanish
  [S] ([DF wiki, Order](https://dwarffortresswiki.org/index.php/Order),
  [Steam discussion](https://steamcommunity.com/app/975370/discussions/0/3716062978748290565)).
  The known failure is a routine that stalls without saying why. [I]
- **Idle-game survey.** A paper on 11 popular idle games names the shared loop
  as active participation, inactive progress, return reward, and notes games
  balance rules that encourage leaving against rules that reward returning
  [S] ([NSF PAR](https://par.nsf.gov/servlets/purl/10188033)).
  One small developer used click cooldowns so active play is not hugely better
  than idle [S, devlog] ([Autumn Idle](https://sites.google.com/view/brandonkorn/projects/autumn-idle)).
- **Crusader Kings III.** Players run at their own game speed and argue about
  pause-on-event: pausing on every event is called bad design by one poster, and
  CK3's pop-up method differs from CK2's hard freeze
  [S, forum] ([Steam](https://steamcommunity.com/app/1158310/discussions/0/4633734182370033182)).
  The lesson is that the **pause rule is a dial in its own right.** [I]
- **Persona 5 and Stardew Valley.** The calendar is the dial. Persona splits days
  into day and night slots; fixed story dates and overlapping confidant windows
  make slots precious [S, guide pages, thin]
  ([guide](https://jeu.video/en/guide/persona-5-royal-confidants-best-order-guide)).
  Stardew: a 20-hour in-game day (6 a.m. to 2 a.m.) in about 14.3 real minutes,
  limited by energy rather than the clock, with a penalty for staying up and a
  fixed wake time [S]
  ([Stardew wiki, Day](https://wiki.stardewvalley.net/Day)). Some players found
  early days stressful and asked for slower time [S, forum]
  ([forum](https://forums.stardewvalley.net/threads/accessibility-suggestion-slower-time-option.28771/latest)).
- **Kingdom of Loathing.** A daily adventure allotment (base 40, trimmed to 200
  at rollover per the wiki page the search surfaced), with food, drink and spleen
  items that add adventures but are each capped per day [S, via search summary]
  ([KoL wiki, Adventure](https://wiki.kingdomofloathing.com/Adventure),
  [Giant Bomb](https://giantbomb.com/wiki/Games/The_Kingdom_of_Loathing)).
  Caps turn "play as much as you like" into "spend a daily budget well". The wiki
  page itself 403'd on direct fetch, so numbers are search-summary level.
- **Fallen London.** Actions refill over real time (about 1 per 10 minutes, cap
  20, or 40 for subscribers, per the community wiki; the cap changed over time)
  [S, community] ([Fallen London wiki](https://fallenlondon.wiki/wiki/Beginner's_Guide),
  [IF50](https://if50.substack.com/p/2009-fallen-london)). The candle is a
  visible attention budget.
- **Hades.** The first escape unlocks the Pact of Punishment: voluntary Heat
  modifiers, higher Heat unlocks better rewards, and Heat resets per weapon
  [S] ([Prima](https://primagames.com/gaming/hades-guide-pact-of-punishment-modifiers-heat),
  [RPG Site](https://www.rpgsite.net/feature/10287-hades-pact-of-punishment-heat-modifiers-and-how-to-maximize-your-rewards)).
  The difficulty dial is **voluntary, diegetic and paid in reward**, not a menu setting.
- **BitLife.** [U] One tap per year with event prompts; pacing is the event deck.
  Not searched; do not cite.

### 1.2 Director, not dice (what shapes the evening)

- **RimWorld.** Three storytellers (Cassandra: danger, breathing room, push;
  Phoebe: long calm gaps and kindly aftermath; Randy: random). Event frequency and
  type read colony wealth, building wealth, colonist and animal counts, recent
  deaths or wounds, and time since the last major event. Difficulty is a separate
  setting, changeable mid-game [S]
  ([RimWorld wiki](https://rimworldwiki.com/wiki/AI_storyteller)). The design
  model is Left 4 Dead's AI Director and the "story generator" aim [S]
  ([Wikipedia](https://en.wikipedia.org/wiki/RimWorld)).
- **Fallen London.** Quality-based storylets: content is cards gated by persistent
  qualities, mostly 1 action each [S] ([SF Encyclopedia](https://sf-encyclopedia.com/entry/fallen_london),
  [fallen london wiki](https://fallenlondon.wiki/wiki/Beginner's_Guide)).
- **Wildermyth.** Heroes enter a Legacy pool when they retire, get a tomb, or
  survive; recruiting costs legacy points by tier; a returning hero is
  intentionally not the same character, and injuries carrying over bothered some
  players [S, forum/press, community-level]
  ([GamingOnLinux](https://www.gamingonlinux.com/2020/06/papercraft-styled-tactical-rpg-wildermyth-adds-legacy-campaigns/)).

### 1.3 Scope and phases

- **Universal Paperclips.** One button, then plateaus that force a new invention;
  later phases change the verb (drones, probes, drifters) before a restart option
  [S] ([Wikipedia](https://en.wikipedia.org/wiki/Universal_Paperclips)). Release
  note: 450,000 players in 11 days, most finishing. Phases are new verbs, not a
  bigger number.
- **Evolve, Trimps.** Reset categories and universe types change the rules;
  retained progression differs per reset [S, repo dossier lines 45, 47, 65].
- **Prestige math.** Multipliers usually follow fractional-exponent curves to keep
  numbers manageable [S] ([Game Developer](https://www.gamedeveloper.com/design/the-math-of-idle-games-part-iii)).

## 2. Comparison table

| Game | How it balances | What it costs | What we take |
| --- | --- | --- | --- |
| Melvor Idle | One skill trains while away; offline settles by elapsed time | Offline depletion and death exist per the community FAQ; cap unverified | Offline is "the current routine, settled", never new choices (matches accepted choice pause) |
| Idle Loops | Plan once, run automatically; permanent info changes the next plan | Needs a legible plan UI | Plan quality is the active skill; takeover = replan |
| Increlution | Action queue; empty queue pauses | Dead stretches when the queue is thin | Routine ends with a named stop reason |
| Dwarf Fortress | Standing and work orders automate; stuck orders when inputs vanish | Silent stalls | Every routine states why it stopped (P2) |
| RimWorld | Director reads state and temperament; difficulty is separate | Unreadable if it ignores player state | Pace dial = director temperament, kept separate from power/difficulty |
| CK3 | Speed and pause-on-event are player-set | Pause fatigue, or missed crises at top speed | Auto-pause only on choices that matter; the rest goes to a log |
| Stardew | Day length plus energy; bedtime penalty; fixed wake | Early-day stress for some | Evening budget by energy and window, soft penalty not hard stop |
| Persona 5 | Slots with fixed deadlines; overlapping windows | Missable content stress | Few fixed dates per world, each with a visible reason |
| Kingdom of Loathing | Daily budget plus capped consumables | Players optimize the cap | Budget as a shaped rhythm with named adjectives, not a counter |
| Fallen London | Visible refilling action budget; storylets by quality | Prose volume | Storylet shape already planned (WA21); show the budget |
| Hades | Voluntary Heat modifiers pay better rewards | Needs a baseline players master | Optional pressure per outing, paid in a named reward (P5) |
| Wildermyth | Legacy pool; returning heroes are new stories | Carried-over injuries felt wrong | Carry stories and relationships, not every scar (OL4) |
| Universal Paperclips | Plateaus force a new verb | Phase can feel scripted | Phase shift = new verb, test against "renamed meter" |
| Evolve/Trimps | Reset types change rules | Hard to audit all combos | Worlds as rule variants (already WA5); declare what crosses |
| Idle surveys | Return reward against reasons to leave | Clicking dominates if unbounded | Active play gets decisions, not a rate multiplier (P1 contract) |

## 3. Recommended pace dial (proposal)

### 3.1 The three settings

A **pace** is set per life (not per save), shown in the header beside the world
label and changeable at a rest point. It controls three things only: how often the
director draws, how many things pause the clock, and how long routines may run
before they hand back. It never multiplies XP, coin or damage.

| Pace | Director draw | Auto-pause | Routine run length |
| --- | --- | --- | --- |
| Calm | Quiet periods wide; threats rare; at most one card per evening | Only unresolved choices with a deadline (current accepted rule) | Until a stop reason or the day ends |
| Lively | The existing deck intervals (the Village default, GM plan 15.1) | Choices plus any card that changes a row or standing | Until a stop reason or the next card |
| Hands-on | Denser cards, optional pressure modifiers offered per outing | Every choice plus each outing step | One step at a time unless the player sets a short plan |

**Default, dial, reason.** Default Lively for a fresh life; dial: the player, any
time at a rest point, and a world may start a life at another pace with an
in-world reason; reason: Lively is the temperament the Village deck already
ships with, and RimWorld shows temperament and difficulty can live apart [S].

**Power parity [I].** Hands-on earns better outcomes per hour only through
choices that are real (stance fit, ingredient pick, price timing, a pressure
modifier taken), never through a hidden rate. Calm must reach every milestone,
just with fewer surprises and more elapsed world time. This is the idle-survey
lesson that active play must not make idle feel punished [S, small dev].

### 3.2 Routines and takeover points

A routine is a repeated job the engine already runs (shift, relay, study, brew).
Default contract: it stops, and says why, on any of: **a new choice appears**,
**stock target met or inputs missing**, **danger threshold crossed**, **a card
drew**, **a rest or needs limit**, **the world's window closed**. The stop reason
is one line in the pinned box and the return note (UIV1, UT3). Dial: the player
adds or removes stop reasons from a short list per routine; reason: DF's silent
stalls [S] and Increlution's empty-queue pause [S] are the two ends, and the
named reason is the cheap middle.

Takeover points are the stop reasons. Handing back is always one action, with the
routine's state preserved so resuming costs nothing but a click.

### 3.3 Offline

Offline settles the current routine at the life's pace, spends world time (accepted
2026-10-15), and pauses at an unresolved choice with a deadline. Default cap:
**24 hours of world time per absence** [I; Melvor's figure is unverified]; dial:
per world, and the banked-time idea (open in PROJECT.md) may raise it with a
stated efficiency; reason: a cap stops "leave it a week" from replacing play,
and a banked remainder keeps absence from being a pure loss.

### 3.4 Per-world defaults

| World | Default pace | Rhythm | Why (loop card) |
| --- | --- | --- | --- |
| Village (variant) | Lively, can drop to Calm | Daily watch, weekly market | Deck already cozy; calm is the evening-tending default (15.1) |
| Proto23 | Lively | Day cycle, weekly free meal | Flat hub encounter rate; menu-quick (15.2) |
| YAIR | Calm | Quest chain, daily price recovery | No director upstream; zones run themselves (15.3) |
| LOTM (Tingen) | Hands-on | Duty shifts, digestion | Pressure rises with acting and notice; leaving a routine running is the risk (15.4) |
| HP | Lively, scheduled | Term timetable | Calendar supplies most events (15.5) |

## 4. Power versus life texture

- **Do not let the life-sim side stall.** Each evening needs one decision within a
  stated number of game hours. The repo dossier already says to judge pacing by
  time-to-next-decision, not content size (RESEARCH_IDLE_GAMES.md line 231). A
  Calm life that passes 24 h with no row, card or return-note line is a defect. [I]
- **Do not let progression become grind-till-death.** KoL and Fallen London use a
  visible budget [S]; Stardew uses energy [S]; YAIRPG already has windows (watch
  07:00-20:00), needs and shifts. Name the limit as an adjective per world
  (AGENTS.md: limits are adjectives) and show it.
- **Phase shifts carry the long arc [I].** Paperclips changes the verb at a
  plateau [S]. The Village ladder (doing jobs, being asked, assigning others)
  already matches; each rung must add a verb, not a number.

## 5. Keeping active decisions meaningful

1. **The decision must change what happens, visibly.** Stances, ingredients and
   prices count only if the preview shows a different outcome (UIV4 preview
   equals commit). [I]
2. **Choose before, not during.** Increlution and Idle Loops move choice to
   planning [S]; hands-on in YAIRPG should be the preparation (stance, kit,
   ingredient grade, which stop reasons) rather than reaction speed. [I]
3. **Optional pressure with a named reward** (Hades Heat [S]) in place of a
   difficulty menu.
4. **Pause only for stakes.** CK3's pause debate [S] says the same.
5. **Cap click advantage with a cooldown or a stop reason**, not with a penalty
   [S, small dev].

## 6. Failure modes and the guard for each

| Failure | Seen in | Guard |
| --- | --- | --- |
| Routine stalls silently | DF stuck orders [S] | Stop-reason line (P2) |
| Pause on everything or nothing | CK3 [S] | Pause tiers by pace (3.1) |
| Director feels random | RimWorld's Randy is chosen as random on purpose [S]; any unseen state is worse [I] | Draw reads visible state; show why a card fired in the log |
| Active play devalues idle (or reverse) | Idle surveys [S] | Parity contract (3.1) |
| Carried-over scars feel wrong | Wildermyth [S] | Carry ledger rows list what crosses (VC7a) |
| Scale slows or bloats | CK3 big dynasties [S, forum] | Few multiplying systems; headroom typed, not populated |
| Early pressure alienates | Stardew stress threads [S, forum] | Soft penalties, slower time at Calm |
| Budget gamed | KoL cap optimization [I] | Adjective limits; the world reacts (rank, gossip) |
| Mile wide, inch deep | CP9 [I] | Pull by loop step |

## 7. Proposals (none accepted)

| # | Proposal (default, dial, reason) | Level | Effort | Done check |
| --- | --- | --- | --- | --- |
| P1 | **Pace per life**: Calm, Lively, Hands-on as in 3.1; one field on the life, shown in the header; touches only deck draw, pause tier and routine length. Default Lively; dial: player or world; reason: temperament apart from power. | Engine seam (event director, clock pause) | Medium | Headless run of the Village deck 30 game days at each pace: card counts differ in the stated order, XP and coin per hour equal for the same routine; save, reload and import keep the pace. |
| P2 | **Stop-reason contract** for every routine (list in 3.2), one line in the pinned box and return note. | UI plus routine runner | Small to medium | Each routine in the Village (shift, relay, study) stops for each reason in a scripted case and shows the line; browser evidence at 1536x864 and 1920x1080 at 14 and 21 px. |
| P3 | **Return note as the idle reward**: the first screen after absence lists what settled, what stopped and why, and what waits (UT3; the idle-game survey names "return reward" as a core loop part [S]). | UI | Small | A 12 h absence in a fresh test origin yields a note with at least one settled line and one stop reason. |
| P4 | **Evening budget as a visible adjective** per world (Village: shift window and energy; LOTM: notice; HP: timetable). Soft penalty on overrun. | Rules per world pack | Small per world | Each loop card names its budget; the UI shows it; overrun in a test life costs the stated amount. |
| P5 | **Optional outing pressure** with a named reward (Hades Heat model [S]): up to three voluntary modifiers per outing in Hands-on; Calm and Lively offer none. | Combat/outing rules | Medium to high | One outing with two modifiers pays the named reward; same outing with none pays the baseline; preview matches commit. |
| P6 | **Decision-gap check**: add time-to-next-decision (game hours) to the headless MCP report and fail a Calm run that exceeds the world's stated gap. | Test tooling | Small | The report prints the gap per pace for the Village; a seeded stall case fails it. |
| P7 | **Offline default 24 h of world time per absence, per-world dial, banked remainder when the open bank decision lands.** | Persistence plus clock | High (offline engineering milestone per dossier line 233) | Reload after a simulated 30 h away yields 24 h settled, one pending choice paused, remainder recorded. |
| P8 | **Phase-shift test per world ladder**: each rung must add a verb; "renamed meter" rungs get a typed gap (WR6). | Docs plus loop card | Small | Every loop card in section 15 of the GM plan lists the new verb per rung or marks the rung "not offered". |

Suggested order [I]: P2 and P3 (nothing new to balance, helps the return loop),
then P1 with P6 as its gate, then P4, then P8; P5 and P7 later.

## 8. Open questions (each with a recommended default)

- **Q1.** Does pace belong to the life or the save? Recommend the life, because
  worlds differ (3.4).
- **Q2.** Should Hands-on offer a faster rate? Recommend no; it offers more
  decisions and optional rewards only (3.1).
- **Q3.** Should the director read the pace and the player's recent success?
  Recommend yes, as RimWorld's does [S]; list the inputs in the log line.
- **Q4.** Offline cap value. Recommend 24 h of world time pending Weibao's call
  on the banked-time direction already open in PROJECT.md.
- **Q5.** Source gaps. Primary pages for Melvor, KoL and Persona were not reached;
  BitLife was not checked. Recommend a source pass through the existing research
  route if any of these becomes a design reason, not a trivia point.

## 9. Sources

[Melvor Steam thread](https://steamcommunity.com/app/1267910/discussions/0/591762563949134719) ·
[vaporlens](https://vaporlens.app/app/1267910/melvor_idle.md) ·
[RimWorld wiki](https://rimworldwiki.com/wiki/AI_storyteller) ·
[RimWorld, Wikipedia](https://en.wikipedia.org/wiki/RimWorld) ·
[Wildermyth, GamingOnLinux](https://www.gamingonlinux.com/2020/06/papercraft-styled-tactical-rpg-wildermyth-adds-legacy-campaigns/) ·
[KoL wiki](https://wiki.kingdomofloathing.com/Adventure) ·
[Giant Bomb KoL](https://giantbomb.com/wiki/Games/The_Kingdom_of_Loathing) ·
[Universal Paperclips](https://en.wikipedia.org/wiki/Universal_Paperclips) ·
[Math of idle games III](https://www.gamedeveloper.com/design/the-math-of-idle-games-part-iii) ·
[DF wiki Order](https://dwarffortresswiki.org/index.php/Order) ·
[DF Steam thread](https://steamcommunity.com/app/975370/discussions/0/3716062978748290565) ·
[Persona guide](https://jeu.video/en/guide/persona-5-royal-confidants-best-order-guide) ·
[CK3 Steam thread](https://steamcommunity.com/app/1158310/discussions/0/4633734182370033182) ·
[Hades Prima](https://primagames.com/gaming/hades-guide-pact-of-punishment-modifiers-heat) ·
[Hades RPG Site](https://www.rpgsite.net/feature/10287-hades-pact-of-punishment-heat-modifiers-and-how-to-maximize-your-rewards) ·
[Fallen London wiki](https://fallenlondon.wiki/wiki/Beginner's_Guide) ·
[IF50 Fallen London](https://if50.substack.com/p/2009-fallen-london) ·
[SF Encyclopedia](https://sf-encyclopedia.com/entry/fallen_london) ·
[Stardew wiki Day](https://wiki.stardewvalley.net/Day) ·
[Stardew slower-time thread](https://forums.stardewvalley.net/threads/accessibility-suggestion-slower-time-option.28771/latest) ·
[Idle Loops review](https://www.incrementaldb.com/community/review/4766) ·
[Idle-game survey (NSF PAR)](https://par.nsf.gov/servlets/purl/10188033) ·
[Autumn Idle](https://sites.google.com/view/brandonkorn/projects/autumn-idle).
Repo: `docs/RESEARCH_IDLE_GAMES.md` (Melvor, Idle Loops, Increlution, Evolve, Trimps).

This pass changes Round 10's CP table status: CP1-CP9 remain mostly unverified
from this session's search except CP2 (RimWorld), CP3 (Fallen London), CP5
(Paperclips), CP6 (Wildermyth, partly), CP8 (CK3, forum-level only). Hades, Wildermyth, Dwarf Fortress
and Kingdom of Loathing details are community-level sources.
