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

## Round 2, 2026-11-10: UI flow

Weibao: "Also UI flow and more?"

**Method.** Played the fresh start through the game MCP as a new player: the first screen, the Next step guide, meeting the elder, the conversation, and picking the spare weapon. Combined with the route walk in [UI audit rounds 46 and 47](UI_DESIGN_CORE_AUDIT.md#round-46-2026-11-10-intuitive-sectioned-flowing-and-the-playtest-complaints). Agent-verified, not human-reviewed.

### What the first minutes show

| Code | Finding | Rule | Disposition |
| --- | --- | --- | --- |
| PX28 | **The guide takes the long way.** Next step says "In Local actions: Talk to someone, then Talk to Old Hesk", and Show me opens Local actions. Old Hesk is also a button in Around you, one click away. | UR140, PX5 | LATER: the guide points at the shortest visible route and names it ("Old Hesk, in Around you"). Sonnet, effort S. Done check: on a fresh start, Show me lands on the elder's card. |
| PX29 | **One act, two names.** The guide says "Talk to Old Hesk"; his card's button says "Meet traveler", though he is the village elder. | UR74, UR140 | LATER: the person card's verb comes from the person's kind (talk, trade, meet). Effort S. Done check: the elder's card says "Talk". |
| PX30 | **Layout notices on day 1.** A fresh game's Reports shows "Inventory tools and Inventory view options are now in Inventory. Nothing was removed." and "Stats and equipment is now in Vitals". Those are migration notes for an older layout. | OPN2, UR88 | LATER: layout-move notices show for a save that had the old layout, and not on a fresh start. Effort S. Done check: a fresh start's Reports has no "now in" lines. |
| PX31 | **Choice captions repeat and use jargon.** Three choices each carry "Opens more to ask. · Moves one of your journal tasks forward. · Settles the other ways to put this." | PRS1–PRS8, UR64 | LATER: one caption per group when every choice shares it; replace "Settles the other ways to put this" with "Picking one closes the others". Effort S. Done check: the elder's first menu shows the caption once. |
| PX32 | **A choice without its facts.** The weapon pick gives flavour lines and no numbers to compare (speed, damage, hands). The choice can be redone later ("you don't need to stick to it forever"), so the stakes are low. | UR63, UR40 | LATER: a small compare row under each option, from the weapon's real stats. Effort S–M. Done check: the five weapons show speed and damage side by side. |
| PX33 | **Rapport moves faster than the story.** Three lines in zero minutes took Old Hesk from Stranger to Familiar, and the full four-step ladder shows at first meeting. | TIE rules, PAC1 | ACCOUNT FOR NOW: rapport steps should need time or deeds as well as lines; the ladder can show the next step alone until the player opens it. Owner: the ties rulebook. |
| PX34 | **Unlocks link to where they live.** Each unlock writes a Reports line with a "Here ›" link (UR29), and each conversation line shows what it costs before you say it. | UR29, FBK | Keep. |
| PX35 | **A busy top bar on day 1.** A fresh start shows 11 routes (Stats, Condition, Inventory, Travelers, Projects, Ledger, Organizations, Worlds, Beginning, Connection, Settings); several are empty or locked. | UR82 (held as LLR30), UR77 | Waits for Weibao's answer on LLR30; meanwhile check:flow can count routes that open on an empty state. |

### UI flow considerations

Each is a default with a dial:

- **PX36, journeys have a measured length.** For each core loop (start a craft, sell an item, equip new gear, take a job, travel, cross worlds), record the clicks from the home view and any dead end. Default: a frequent loop takes three clicks or fewer, and the step that commits says its cost. LATER: a `journeys` section in check:flow driven by the game MCP. Sonnet, effort M. Done check: a click count per loop per start.
- **PX37, context travels with you.** Default: a selected item, person or recipe stays selected when you move to a related view (from an item to the craft that uses it, from a person to their trade), with a way back to where you were (UR22, UR23).
- **PX38, interruptions return you.** Default: when a fight, event or scene interrupts, ending it returns you to the view and selection you left, and the work line says what resumed (UR23, UR88).
- **PX39, reload returns you.** Default: after a reload, the game opens on the view you were in, with a one-line "you were…" (UR23, UR58).
- **PX40, mode changes are announced and reversible.** Default: entering a fight, a scene, another world or a full-screen form says what changed, keeps the work line visible, and shows how to leave (UR144, round 47).
- **PX41, the guide grows with the player.** Default: on day 1 the guide gives one step; later it gives the next step plus open directions (PX5); deep into a life it can be hidden. Dial: guide level.

### Ranked

PX28 and PX29 are the first thing a new life meets; together they cost one small change in the guide and the person card. Then PX30 and PX31 (noise in the first minute), then PX36 (measure the loops).

### Round 2 fixes, 2026-11-10

Weibao: "Yes, fix them" (PX28–PX31). Agent-verified, not human-reviewed. Proof: a fresh start replayed through the game MCP after a rebuild, plus focused tests.

| Code | Fix | Where | Proof |
| --- | --- | --- | --- |
| PX28 | The guide points at Old Hesk in Around you. Show me opens his card (a free inspection) and focuses "Talk with Old Hesk"; the press says "Opened Around you". The same applies to the weapon and report-back steps. | `src/first_hour.js` (steps gain `place`, `open`, `focus`) | Show me lands on the card with the Talk button; `tests/first_hour.test.js` |
| PX29 | A village person you have not met yet reads "Talk with Old Hesk"; "Meet traveler" stays for generated travelers. | `src/main.js` (same line, no growth) | The elder's card says "Talk with Old Hesk" |
| PX30 | Layout-move notices come from layouts saved before this page load, not from the one a fresh start writes. A first session marks every move as seen, so later loads stay quiet too. | `src/panel_folds.js` (`layoutsAtLoad`) | No "now in" lines on a fresh start; new test in `tests/panel_folds.test.js` |
| PX31 | Alternatives that do the same thing state it once; the next ones read "Same as the line above." "Settles the other ways to put this" became "Picking one closes the others." | `src/read_models/talk_bridge.js`, `scripts/talk_browser.cjs` | The elder's first menu shows the caption once; new test in `tests/talk_view.test.js` |

**Also done:** Spotlight showed three copies of the app. The build output in `desktop-tauri/target/bundle` and an old rollback copy in `work/` went to the Trash. Both folders now carry `.metadata_never_index`, so future builds there stay out of Spotlight. `~/Applications/Yet Another Idle RPG.app` is the one left.
