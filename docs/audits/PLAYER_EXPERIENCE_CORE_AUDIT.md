# Player experience core audit

Status: proposal record (AD32 working defaults under AD56). This is the root palette for what makes the game good to play, across systems and worlds. It extends by rounds and never restarts its codes.

It sits above the quality rulebooks and points to them rather than repeating them:
- pacing [PAC](../PACING_RULES.md);
- openings [OPN](../OPENING_RULES.md);
- feedback [FBK](../FEEDBACK_RULES.md);
- the UI rules, especially the steady frame and flow rows UR139–UR146 ([UI rules](../UI_RULES.md)).

Direction: [log entry](../gm/USER_VISION_LOG_2026-11.md#player-experience-considerations-2026-11-10).

## Round 1, 2026-11-10: what gives a good experience

Weibao: "COnsider other General player considerations and more, what would give a good experience and more?"

The frame for this game:
- an idle life-sim RPG with many book worlds;
- played on a laptop or desktop;
- Weibao is essentially the sole player (AD22);
- agents build it while he is away, and he plays it in short checks and longer sessions.

A good experience here is mostly about **respect** (his time, his saves, his attention) and **wonder** (worlds that feel alive, discoveries that pay off). Each item gives the default, what exists today with its evidence, and a disposition:
- **ACT NOW**: done in this round;
- **ACCOUNT FOR NOW**: a constraint on the next work, no new feature;
- **LATER**: with level, effort and a done check.

### A. Respecting time

| Code | Consideration | Today | Disposition |
| --- | --- | --- | --- |
| PX1 | **Three session shapes, each with a fast path.** A two-minute check-in (what happened, one decision, set it running again), a twenty-minute session (a goal you can finish), and a long return after days (a story of what changed). Default: each shape has a first screen that serves it. Dial: the player picks which one the game opens on. | The return digest (`return_digest*.js`) and the away bank cover the long return. "Right now / Next step / Show me" covers the next decision. Nothing measures how many clicks a check-in takes. | LATER: measure a check-in as clicks from load to "running again" on three starts; target three or fewer. Sonnet, effort M. Done check: a number per start in the pacing notes (PAC2). |
| PX2 | **Coming back reads like a story, not a ledger.** Default: the return digest leads with the two or three events that matter (a tie changed, a craft finished, something went wrong), then the totals. Dial: detail level (TMR, recap dial). | The digest exists; its order and voice have not been checked against this. | ACCOUNT FOR NOW: new away events write a headline line as well as a total (PRS rules, RPT1–RPT14). |
| PX3 | **Idle runs until something worth waking for.** Default: routines run to stop points the player chose (UR88 stop list); the game never sits idle waiting for a click it could have predicted. | Routines and stop points exist in parts (TMR5, the stop list). | ACCOUNT FOR NOW: a new repeating action ships with its routine form and its stop points (MT7, SPR). |
| PX4 | **No chores.** Default: anything done the same way three times in a row is offered as a routine or a batch; upkeep (repair, feeding, rent) folds into routines (LLR24 answer, TMR18). | Craft batches, the repeat queue and the refinement routine idea exist. | ACCOUNT FOR NOW: a new upkeep system lands with its routine. |

### B. Knowing what to do

| Code | Consideration | Today | Disposition |
| --- | --- | --- | --- |
| PX5 | **Always a next step, never a single funnel.** Default: one suggested next step plus two or three open directions (a person to meet, a skill to try, a place to see), so a player who ignores the suggestion still has a road. | "Right now / Next step / Show me" gives one step. | LATER: add "Or try" with up to three open directions from the same facts. Sonnet, effort M. Done check: the three starts each show an alternative that leads somewhere. |
| PX6 | **Goals at three ranges.** Now (this action), soon (this session: a craft, a job, a person), long (this life: a sequence, a home, a world). Default: the player can see one of each at a glance. | The Journal holds quests, Pledges hold promises, and pathway ladders show long goals; they are in three places. | LATER: a small "Aims" strip with one goal of each range, each linking to its owner. Sonnet, effort M. Done check: a fresh start shows three linked aims. |
| PX7 | **Cause and effect you can see.** Default: every change to a number or a tie says why, where the player looks (FBK1–FBK8, UR84). | FBK and check:feedback cover actions; changes from ticks (moods, prices, weather) are thinner. | ACCOUNT FOR NOW: a tick-driven change that crosses a threshold writes one Reports line with its cause. |
| PX8 | **Learn by doing, then get out of the way.** Default: a first-time explanation shows once, inline, at the moment it matters, then folds to a "?" (OPN1–OPN9). Dial: explanation level per player. | Openings are checked per start; later systems introduce themselves unevenly. | LATER: a "first time" marker per system, cleared on first use. Haiku sweep, effort S. Done check: a list of systems with no first-time line. |

### C. Feeling progress

| Code | Consideration | Today | Disposition |
| --- | --- | --- | --- |
| PX9 | **Visible growth often, moments rarely.** Default: small gains show every few minutes (PAC1); big ones (a sequence advance, a breakthrough, a first home) get a moment with its own form and motion (UR91, UR93). | Settle effects and a short sound cue exist (`settled_text_effects.js`); big moments mostly read as Reports lines. | LATER: a milestone form for the three biggest moments per world, built on the altar and vessel work (UR98 L3). Opus for design, sonnet to build, effort L. Done check: Weibao sees one and says it felt like an event. |
| PX10 | **Player skill matters, not only numbers.** Default: knowing materials, timing a brew, reading a person or planning a route beats grinding, as the books do (AD38: things work by how they work). | Making, mixing and divination already reward knowledge (MR rules). | ACCOUNT FOR NOW: a new system names what the player can get better at, besides the character. |
| PX11 | **Collections and records.** Default: the game remembers what was found, made, met and survived, and lets the player browse it (chronicle, Knows, naming achievements). | Chronicle, Knows, the bestiary and naming achievements exist. | LATER: one "Records" view across them with counts and firsts. Haiku for inventory, sonnet to build, effort M. |
| PX12 | **Surprise that pays off.** Default: mysteries look mysterious (Proto23's `???`, UR142), rare events happen, and a discovery changes what the player can do; sealed secrets stay sealed in play. | The `???` names, sealed secrets and world events exist. | ACCOUNT FOR NOW: every `???` reveals into something usable, never a dead name. |

### D. Trust

| Code | Consideration | Today | Disposition |
| --- | --- | --- | --- |
| PX13 | **Progress is never lost.** Default: autosave, a backup, export and import, and a clear message when a save cannot load, with what was kept (UR17, UR125). Dial: backup count. | Autosave, the backup autosave, Export and Import exist; old saves are disposable during development (his 2026-11 call). | ACCOUNT FOR NOW: a breaking save change says so on load in plain words, not a silent reset. |
| PX14 | **Predictable rules.** Default: the same action in the same state gives the same family of results; a chance names both sides (UR40); a failure says what to change. | Mostly so; the generic "not available" reason (round 46 R6) is a gap. | Covered by round 46 R6. |
| PX15 | **Mistakes are cheap.** Default: confirm by stakes (UR112), and offer a short undo for instant spends where the world allows it (UIC126). | Confirms exist; no undo window. | LATER: UIC126. |
| PX16 | **No pressure tricks.** Default: no fear-of-missing-out timers, streaks or nags unless a world's own mechanism makes something time-bound (a festival, a deadline), and then the screen says so. | None exist. | ACCOUNT FOR NOW: keep it that way. |

### E. Comfort

| Code | Consideration | Today | Disposition |
| --- | --- | --- | --- |
| PX17 | **Fast and light.** Default: a click answers within 100 ms; a tick never stutters the page; the game runs comfortably on an 8 GB machine (his 2026-11 request). | Perf work landed earlier; UIC124 (decorator cost) is unmeasured. | LATER: UIC124 plus click-latency sampling in check:flow. Sonnet, effort S. Done check: a median and worst click time per route. |
| PX18 | **Comfortable to read for hours.** Default: text size, contrast and spacing hold at 125% and 150% zoom and 21 px text (UR33); long text breaks into short lines; the Luminous Gothic default stays readable in every world dress. | check:flow covers zoom; contrast per world dress is unchecked (UIC125). | LATER: UIC125. |
| PX19 | **A steady, keyboard-friendly frame.** Default: UR144–UR146 (nothing jumps), UR126 (Tab, Esc, hotkeys), Ctrl+K to find anything. | Ctrl+K and Alt hotkeys exist; M1 (side columns move) is open. | Covered by round 47 M1. |
| PX20 | **Sound, optional and quiet.** Default: off or very quiet by default; per-world ambient beds and a few cue sounds (a craft settles, a tie warms, danger) where a world benefits; every sound has a text twin. Dial: volume per kind. | One synthesized cue in `settled_text_effects.js`. | LATER (an idea that widens play, AD56): a sound palette per world with sourced or generated audio, noted like art (LLR32). Sonnet, effort M. |

### F. Ownership and expression

| Code | Consideration | Today | Disposition |
| --- | --- | --- | --- |
| PX21 | **Make it yours.** Default: themes, layout and region sizes, names, a home's furnishing, and pinned panels persist (UR58). | Customization profiles, homes and pins exist; region sizes are not a setting yet (UR145 dial). | ACCOUNT FOR NOW: a new layout choice persists. |
| PX22 | **Choices are remembered.** Default: people remember what you did (person memory, ties) and the chronicle keeps your life's story; a choice shows up again later. | Person memory, ties and the chronicle exist. | ACCOUNT FOR NOW: a scene choice writes a memory someone can bring up. |
| PX23 | **Many ways to play.** Default: paths, worlds and play styles (craft, fight, trade, talk, study, build) each carry a life (AD5). | Several exist per world; depth varies. | Covered by the world passes. |

### G. Long-run health, and playing a game that agents build

| Code | Consideration | Today | Disposition |
| --- | --- | --- | --- |
| PX24 | **Late-game lists stay usable.** Default: lists that grow (inventory, people, recipes, Reports) keep search, filters, groups and archives (UR27). | Search and filters exist on the main lists. | ACCOUNT FOR NOW: a new list ships with search once it can pass about 30 entries. |
| PX25 | **"What's new since you last played."** Default: agents change the game between his sessions, so the first screen after a new build lists, in player words, what changed and where to see it, with one click to try each. Dial: off, or a short list. | Nothing; changes live in commit messages and audit rounds. | LATER, recommended: a build manifest written at commit time (player-facing lines only), read on load. Sonnet, effort S–M. Done check: after a build with two player-facing changes, the first screen names both with routes. |
| PX26 | **Note a problem while playing.** Default: a "Note this" control (and a hotkey) saves his comment with the current screen, view and a save snapshot into a local file agents read, so a qualm is captured the moment it happens, not recalled later. | None; qualms reach agents only when he remembers to write them in chat. | LATER, recommended: local only, no network; agents triage the notes into the owning audit. Sonnet, effort M. Done check: a note written in play appears in the triage file with its screenshot and view. |
| PX27 | **Agents play as different players.** Default: before he plays, a bot plays each start as three kinds of player (a check-in player, a crafter, a talker) and reports where each got stuck, using check:flow, check:pacing and the game MCP. | The lead bot, check:pacing, check:openings and check:flow exist separately. | LATER: one `check:experience` that runs the three personas and joins their findings. Sonnet, effort M. Done check: a report per start naming where each persona stalled. |

### Ranked suggestions

1. **PX26, Note this.** His qualms are the best signal and today they are lost between sessions.
2. **PX25, what's new.** It makes every agent change visible and testable the moment he plays.
3. **PX1, measure a check-in.** Idle games live or die on the two-minute visit.

Then PX5 and PX6 (direction at a glance), and PX9 (moments that feel like events).
