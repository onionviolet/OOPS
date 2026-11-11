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

## Round 3, 2026-11-10: Weibao's short playthrough

Weibao played the v0.6 snapshot (built from 35ed6580b, before the round 2 fixes) and sent nine screenshots with notes. Each note below has a code, what caused it, and what happened. Agent-verified, not human-reviewed: focused tests, a rebuild, a game-MCP replay of a fresh start and a headless probe at 1920x1080.

### Fixed

| Code | What he saw | Cause | Fix | Proof |
| --- | --- | --- | --- | --- |
| PX42 | Asking about the herb bed showed "text not found, id: '…'" | The translator turns any text without a translation key into a marker. Labels were cleaned up; answers were not. | `getText` returns prose-shaped text as written (key-shaped ids keep the marker for tests). | Test: every dialogue `name` and `text` resolves (`tests/talk_view.test.js` PX42) |
| PX43 | "What Old Hesk, the village elder knows of you" | One display string carried name and role into every sentence. | The talk host splits at the comma: sentences say "Old Hesk", the header says "Talking with Old Hesk, the village elder" once. | MCP replay |
| PX44 | "You told them: Hello? / Who are you?" | Every line you said counted as something you told them, questions included, and a "one of" row too. | "You said" lists statements; questions and "one of" rows tell them nothing; a questions-only talk reads "knows little of you". | Talk tests |
| PX45 | Rapport as four rings on a line; "1 more to reach…" | The rapport figure reused the shared figure track (the circles of UI round 40, UR98), and its text counted lines. | Rapport is one sentence: "Familiar. Closer, they might offer secrets they would keep from a stranger." No rings, no line count. | Talk tests, MCP replay |
| PX46 | Around you: "Nothing here to inspect yet", the willow stand's first sentence, then the same sentence again | The count line had a fallback text; the fold title was the first sentence and the body held the whole account. | A short account shows whole; a long one shows its first sentence with the rest behind "More about this place"; no count line when nothing is here; an empty place reads "No one else is here." The willow stand first ended "Could you make a shelter here? Homes has what it would take."; Weibao found that too much, so round 4 made it "Maybe I can build a house here." (PX57) | `tests/nearby_context_view.test.js` PX46, headless probe |
| PX47 | "Original local prototype… represented irrigation", "Following creates no past history", the temperature note's "makes no claim about heat safety", the herb answer's "thirty played minutes" | The PRS6 lint read `field: '…'` strings and missed text set with `textContent = '…'`. | Rewrote the four strings; the lint now reads `textContent`/`innerText` assignments and knows the new terms. It found 60 older strings it could not see before; they went to the baseline and the [rewrite backlog](../prose/PROSE_REWRITE_BACKLOG.md). | `node scripts/check_player_text.mjs` catches the old workshop intro |
| PX48 | "Move somewhere else" needs a second click after every move | Proto23's dropdown is rebuilt shut on each location change. | Menus remember the state the player gave them; travel starts open. | Headless probe: open on load and after a move |
| PX49 | Scrolling past the lives table to the Begin buttons; "Finish or stop the work under way first" under every button | The table was read-only and each disabled button printed its own reason. | Each table row carries its Begin button; a reason that blocks them all shows once above the table and the buttons point at it. | `tests/start_compare.test.js` PX49, headless probe |
| PX50 | The "?" shortcuts sheet does not close when clicking behind it | A modal `<dialog>` has no outside-press close by default. | One document listener closes any modal sheet on an outside press through its cancel path (typed confirm and the palette keep their handlers). | `tests/native_controls.test.js` PX50, headless probe |

Rules so they do not come back: UR147 (say a thing once per view), UR148 (a menu the player opened stays open), UR149 (choose where you compare), UR150 (a sheet closes when you press outside it), PRS9 (the world speaks, not the build).

### Proposed, not built

| Code | Note | Default proposed | Dial | Size |
| --- | --- | --- | --- | --- |
| PX51 | Opening a conversation swaps the whole centre and surprises. | A conversation opens in the Around you card it started from (the person's card grows into the talk), and the centre keeps what it showed; a long scene can still be expanded to the centre on purpose (UR144). | Per world: a scene-heavy world can open talks full size. | One slice: the talk host mounts into the person card; check:flow stability covers it. |
| PX52 | The Village screen is overwhelming: many folds, "0 ready / 9 actions", a workshop ledger open in the middle. | Local actions shows the ready actions first and folds the rest under one "More here" line; systems a player has not met (Iona's ledger) stay out until met (UR32, UR139). | Density setting. | Medium: needs the fold owner and a first-meeting flag per panel. |
| PX53 | Rapport rises from Stranger to Familiar in five lines. | Rapport reads the existing ties (`person_ties` trust and affection) and person memory, so it rises with time spent, help given and promises kept; small talk moves a stranger to acquainted and stops there. | Per world and per person: an open, friendly person warms faster. | Medium: wire `talkModel` to `tieValue` and the memory bond (AREA_GUIDE "People and ties"). Changes the pace, so it waits for Weibao (AD56). |
| PX54 | Crossing to Tingen is blocked by "Just running around". | Crossing stops the idle run itself and says so ("You stop running and cross."); work with a stake (a craft, a job, a fight) still blocks with its name. | None needed. | Small, but it touches how a life is left mid-activity; check save state first. |
| PX55 | "Already covered" shows "One of: My head hurts.. / Where am I? / …" | Record which sibling line was said (a one-field save note), then show that line alone. | None. | Small save addition. |
| PX56 | Is "Old Hesk" his real name? | It is an agent-given name (2026-11-07 names pass) for Proto23's unnamed "village elder", and it is not on the naming sheet. Keep it, or rename from the Village naming sheet. | Weibao's call. | Trivial either way. |

PX53 is the one that needs Weibao's answer before building; PX51 is the next flow slice.

## Round 4, 2026-11-10: narrator voice and the rest of the playthrough

Weibao on the round 3 willow line: "too much, we can try and be mysterious, and kind of be a casual narrater", plus "Being able to show things in specific ways could be products of feats or unlockable in the future" and "Address all the issue and similar issues". Agent-verified, not human-reviewed: focused tests (71 across 13 files, plus center_modes), a rebuild, `npm run check:flow` with two new checks, and headless probes at 1920x1080.

### Fixed

| Code | What | Fix | Proof |
| --- | --- | --- | --- |
| PX57 | Place text gave instructions ("Use Notebook to…", "Homes has what it would take") | Places get a casual narrator; how-to moved to station rows in Around you through a new `stations` field on locations (a data-driven path; main.js growth 0). The willow stand reads "…deadwood and dry grass under a forked canopy. Maybe I can build a house here." with a Homes row. Same treatment for Tingen, the book and Proto23 destinations, the pocket room and the tide and district destinations; resident lines lost "Native stock, equipment, XP and vitals remain their actual owners." | Golden trace refreshed (text changes, no state); probe shows the willow text and Homes row |
| PX44b | "You said" printed above every row of what they know of you | The source heads its group once (UR147). | Talk tests |
| PX52a | Section counts read "0 ready / 1 actions" | They read "1 of 9 ready". | Rebuild |
| PX53 | Rapport rose to Familiar in five lines | Talking gets a stranger to Acquainted; Familiar and Confidant need regard, trust plus affection on the one relationship store (`person_ties.tieValue`). Dial: the `talk` and `regard` thresholds per stage. Default today: in the Village nothing raises those ties yet, so talk alone stops at Acquainted. | Talk tests (talk alone stops at Acquainted; regard 3 makes Familiar) |
| PX54 | Crossing blocked by "Just running around" | Practice with no stake (running, lifting) no longer blocks; the crossing stops it and says "You stop running around and cross." Work with a stake still blocks with its reason. | Probe on the mid fixture: running, Begin enabled, confirm, run stopped, Tingen workroom shown |
| PX59 | Esc stopped returning home from every route | Found by the flow walk: "Fast travel" and challenges share the travel menu's class, and the centre view restored menus by class into the first match. Menus are now keyed by name; the centre leaves keyed menus to their owner. | check:flow: no back findings on 13 routes |
| PX60 | Leaked engine words on first-hour routes | New check:flow checks: `leak` (PRS6 words and markers in visible text) and `repeat` (a sentence twice in one module). Fixed what they found: Iona's ledger terms and records, the seal steward line, the bread-carrier life, "native crafting stations". | check:flow leak findings down from 10 to 4; the 4 left are knowledge saved in the test fixture, which keeps its wording (PRS8) |

### Still proposed

| Code | What | Why not now |
| --- | --- | --- |
| PX51 | A conversation opens in the person's card instead of taking the centre | A layout change to the native dialogue flow; one slice of its own, judged by eye. |
| PX52 | A calmer Village screen: ready actions first, the rest under one "More here" line | Needs the fold owner and a first-meeting flag per panel; Iona's ledger also holds the opt-in for following local people and work, so hiding it needs a new home for that switch. |
| PX55 | "Already covered" names the line you said, not "One of: …" | Needs a small save note: a dialogue line's `is_finished` already carries quest meaning ("defeated boars"). |
| PX56 | Keep or rename Old Hesk | Weibao's call. |
| PX58 | The rapport ladder as an earned view (UR151) | Waits for a feat or skill to unlock it, such as reading people. |
| M1 | Side columns move when a centre view opens (check:flow stability) | Round 47; waits for Weibao's look. |

### Did we absorb everything: the ledger

| From | Note | Status |
| --- | --- | --- |
| This playthrough | Doubled place text | Fixed (PX46, PX57) |
| | Pose a question, mysterious casual narrator | Fixed (PX57, PRS9) |
| | Travel menu double click | Fixed (PX48, PX59) |
| | Conversation jumps over the screen | Proposed (PX51) |
| | Herb answer "text not found" | Fixed (PX42) |
| | Old Hesk's name | His call (PX56) |
| | Rapport box at the bottom, circles | Fixed (PX45); ladder can return earned (UR151) |
| | Relationship too easy | Fixed (PX53) |
| | Begin from the table | Fixed (PX49) |
| | Blocked by running | Fixed (PX54) |
| | UI overwhelming | Partly: counts read plainly (PX52a); calmer screen proposed (PX52) |
| | "?" sheet will not close | Fixed (PX50, all three modal sheets) |
| | Engine words in text | Fixed where the flow walk sees them (PX47, PX60); the rest are in the [rewrite backlog](../prose/PROSE_REWRITE_BACKLOG.md) |
| | Show things in specific ways as unlocks | Recorded (UR151), not built |
| Round 46 Q1–Q15 | Reports column, Focus/You, opening at the bottom, item pages, scrolling, way back, clutter, spacing, zoom, spoilers, button feedback, circles, improvements showing up, Proto23 look, memory | Unchanged from [round 46](UI_DESIGN_CORE_AUDIT.md) except Q3 and Q6, which regressed (Esc) and are fixed again (PX59), and Q12, where rapport no longer uses circles. |

## Round 5, 2026-11-10: the long-term loop

Weibao asked: "Consider long term gameplay loop, like, would it be endless progression? is there joy or the possibility for infinite possibilities?" ([log](../gm/USER_VISION_LOG_2026-11.md#the-long-term-loop-2026-11-10)). Standing direction already in play: long play is welcome (2026-11-04), progression is any lasting improvement, not only ranks, many worlds are the plan, events may try to end a run (AD50), and the lead's life is the main line. Proposals below, not accepted decisions.

### Six shapes a long loop can take

| Code | Shape | Joy it gives | Where it goes hollow | Fit here |
| --- | --- | --- | --- | --- |
| PX61 | **Numbers forever** (classic idle: growth, prestige, multipliers) | Steady visible growth, good for the two-minute check-in | Bigger numbers stop meaning anything; fights canon calibration (SKR21) | As a per-world dial where the source scales that way (cultivation ranks, Gu immortals), never the main reward |
| PX62 | **A life with an end, then legacy** (heirs, successors, the next seat; Crusader Kings, Wildermyth, Rogue Legacy) | Endings that matter, a family or school that remembers | Restarting feels like loss if too little carries | Strong: `heir_inheritance.js`, `lineage_domain.js`, `home_personal_legacy.js` and heirlooms already exist |
| PX63 | **A world that keeps going** (after canon, the world simulates on: storyteller, economy, news, creatures; Dwarf Fortress, RimWorld) | Endless stories rather than endless numbers | Thin if generators are uncalibrated or repeat | Strong: today's storyteller, prices, populations and news are exactly this layer |
| PX64 | **Collection and completion** (routes, recipes, bestiary, deeds) | Finishing things; seeing what you have not tried | A checklist feels like a chore | Good as a record, not a goal: "Another way" deeds, known recipes, item knowledge |
| PX65 | **The traveller** (cross worlds, carry what the rules allow, learn how each world works; jumpchain) | Meta-progression of understanding; each world a new rulebook | Carry-ins that trivialise a world | Strong: WER crossings, cheats, XWR carry rules |
| PX66 | **Becoming a power** (the unusual one: late in a long line, the player stops being only a lead and becomes an acting power over other lives: a patron, a sealed artifact, a Venerable, a god; then authors new worlds) | A change of verb, not of size; the game turns inside out | Loses the daily-life texture if it replaces it | Built on today's acting-power record (AGT1); fits Fang Yuan's and Klein's own trajectories |

### Proposed default: layered, not endless

| Code | Default | Dial and reason |
| --- | --- | --- |
| PX67 | **Four time scales, each with its own reward.** A visit (tend, make, talk: something changed since last time); an arc (a rank, a tie, a canon beat reached by your route); a life (an ending, then what carries); a line (many lives and worlds, ending in PX66 if wanted). | Reason: each scale needs a reason to come back; idle games die when only the first exists. |
| PX68 | **A new tier changes your verbs.** Default: reaching a tier opens new decisions (a killer move, a post, a domain, a patron's view), not only larger numbers; a tier that only scales numbers is flagged in its slice receipt. | Reason: the joy of the move from mortal to immortal Gu is what you can now do. |
| PX69 | **Within a world, growth bends; across worlds it continues.** Default: a world's ladder follows canon and flattens at its top; new growth comes from crossing, legacy and becoming a power. | Dial: worlds whose canon has no ceiling (cultivation) keep climbing. Reason: canon-first calibration, and it keeps each world's top meaningful. |
| PX70 | **Infinite possibility comes from composition, not counters.** Default: the open-endedness is combinations (killer moves, recipes, rituals, routes), generated content calibrated on canon, emergent stories, and other lives, all running on one set of rules (SPR26, SPR27). | Reason: a finite set of parts that compose gives more real novelty than an infinite number. |
| PX71 | **After canon, the world goes on.** Default: when a lead's book ends, the world keeps its storyteller, economy, ties and news running, and generated pressures follow the world's own rules. | Reason: a book's last chapter should not be the game's. |
| PX72 | **Endings are offered, never forced.** Default: a life can end by canon, by choice, by AD50 threats or by age; continuing as the same person stays possible where the mechanisms allow it. | Reason: no forced weakness (AD55); endings matter when chosen. |
| PX73 | **What carries is legible.** Default: before a life ends or a crossing, the player sees what will carry (knowledge, heirlooms, ties, a legacy, a cheat) and what will not, by the world's rules. | Reason: trust (PX D); loss you understand is drama, loss you did not see is a bug. |

### Joy checks (how to tell it is working)

| Code | Check |
| --- | --- |
| PX74 | After ten hours in one world, the player still meets a decision they have not made before (pacing check, PAC). |
| PX75 | A second life in the same world plays differently, because of the seat, the route or what carried. |
| PX76 | A bot playing three styles (PX27) finds a different best route each. |
| PX77 | The player can name something that happened that no designer wrote (an emergent story). |

### LATER / DELEGATE

| Code | Item | Level, effort | Done check |
| --- | --- | --- | --- |
| PX78 | One life-end to legacy loop on existing heir and lineage code: a lead dies or retires, the player picks the next seat, and PX73's carry list shows. Queued by Weibao 2026-11-10 ("Que"), starts when a build lane frees | Sonnet, medium | Headless play from an ending into the next seat, save, reload and import |
| PX79 | Post-canon continuation for one world (LOTM after the first novel's ending, or Mother of Learning after the loop) with the storyteller and economy running | Sonnet, large | Thirty in-game days past canon produce events from world rules, not authored beats |
| PX80 | A first "becoming a power" prototype on the acting-power record: the player, as a patron, answers one other life's prayer | Sonnet, medium, after AGT1 merges | A patron answer shows up as an ordinary effect in the other life |
| PX81 | A tier review: list each world's ladder and which tiers only scale numbers (PX68) | Haiku, small | A table per world with each tier's new verbs |

## Round 5, 2026-11-10: hints, not manuals

Weibao, on three screenshots (the talk preamble, the herb answer, the Local life panel): "we can probably remove this, should the second one be prose instead? does that part leak too much?"

| Code | What | Fix | Proof |
| --- | --- | --- | --- |
| PX61 | "Old Hesk is listening. Saying any of these takes no time. Each line shows what it costs before you say it." | No preamble while there is something to say; a line that costs time quotes it on its own row. "Has nothing new for you" stays for an empty talk. | Talk tests |
| PX62 | The herb answer read as a manual (window, regrowth, scouting, "half as long") | Old Hesk says it in his voice and leaves the rest to find: "Golmoon, by the path. Anyone may pick it, if they can find it." … "It keeps odd hours. Late, well past midnight. And it takes a whole moon to grow a leaf back. Know the ground first, or you'll be crawling about till dawn." | Dialogue test (no marker); rebuild |
| PX63 | Local life: "1 find remains. 10% find chance, capped at 40%…", "native food poisoning… Actual exposure adds 0.25 Poison resistance XP per played minute", "next opening in 9227 minutes", the parcel-work rank line | The panel speaks as the narrator ("Something might be tucked away around here.", "Raw potatoes and roasted rat meat can turn your stomach."); exact odds and timings moved to a hover detail (UR151 default until a feat earns them); waits read as durations ("back in 7 days"); the parcel button says what opens it, with the rank detail on hover; the busy line reads "Finish what you are doing first." | `tests/local_life.test.js` (summary has no digits; numbers in `summaryDetail`) |
| PX64 | Why the lint missed it | `check_player_text` read `src/*.js` and skipped subfolders such as `src/absorb_c2/`. It now reads every source folder except dev previews; 114 older hits went to the baseline and the [rewrite backlog](../prose/PROSE_REWRITE_BACKLOG.md). | `node scripts/check_player_text.mjs` |

PRS9 now says it outright: hints and answers leave something to find, exact numbers sit one step away until earned, and a view needs no preamble.

## Round 6, 2026-11-10: pitfall catalog

Weibao: "write down these pitfalls, consider other similar ones, and then we can address accordingly". Each pitfall below has a code, where it showed up in his playthroughs, similar cases to look for, and what catches it. Status: **fixed** (where it was seen), **open** (seen, not fixed), **watch** (not seen yet, likely). The mixing counter screenshot (round 6) is broken out under its pitfalls.

### Words

| Code | Pitfall | Seen | Similar cases | Caught by | Status |
| --- | --- | --- | --- | --- | --- |
| PF1 | **Engine words reach the player** ("native", "actual", "represented", "seam", "prototype") | Iona's ledger, temperature note, Local life, resident lines | Debug ids, save keys, "proposal", "slice" in tooltips; Settings pacing text ("native pacing", "Native rain is retained") | PRS6 lint (now subfolders and `textContent`), check:flow `leak` | Fixed where seen; 593 older strings in the [backlog](../prose/PROSE_REWRITE_BACKLOG.md); Settings open |
| PF2 | **A manual where a hint belongs** (windows, rates, odds, shortcuts spelled out) | Herb answer, Local life odds | Settings pacing paragraphs ("drains over eight played hours… 80% to 100%"), quest text with exact windows, station descriptions | Proposed: a lint for digit-dense sentences on narrator surfaces (place text, dialogue answers, panel intros) | Fixed where seen; Settings open |
| PF3 | **Interface instructions inside world text** ("Use Notebook to…", "Homes has what it would take") | Willow stand, six destinations | Reports "Click it to rename", work line "Pick something under Here to start" | Proposed: lint `Use|Open|Click <Panel>` in description fields; station rows carry the how-to | Fixed in place text; Reports and work line open |
| PF4 | **A view explains itself** ("Each line shows what it costs before you say it") | Talk view | Mixing: "Words give the dose in a standard vial: one pack of the plant, one of water."; "Whole packs: water + plants. Drink to observe the dose. Responsive follows local laws." | Review rule (PRS9); proposed `repeat`-style check for a panel's first line restating its own controls | Talk fixed; mixing open |
| PF5 | **Ledger shorthand** (counts and states in compressed notation) | "0 ready / 1 actions" | Mixing: "(0 free, short 1)", "One stock, two products: 0 carried · 0 held in vessel · 0 blocked by other holds", "3 game minutes/batch", "Queue: Save an observed method before queuing." | Proposed: lint for `\d+ free`, `short \d`, `/batch`, `·`-chains of zeros | Count fixed; mixing open |
| PF6 | **Full display names inside sentences** ("Old Hesk, the village elder knows of you") | Talk view | Reports lines, quest steps ("Talk to Old Hesk, the village elder."), Around you rows | Talk host splits name and role; proposed: a names helper (`shortName`) used by sentences | Talk fixed; guide and Reports open |
| PF7 | **The wrong relation** (a question counted as telling) | "You told them: Who are you?" | Witness lines, "They saw" rows, gossip that credits the wrong speaker | Talk tests | Fixed |
| PF8 | **Missing-text markers** ("text not found, id: …") | Herb answer | `undefined`, `NaN`, `[object Object]`, empty labels | Translator fallback, dialogue test, check:flow `leak` | Fixed |
| PF9 | **Raw minute counts for waits** ("next opening in 9227 minutes") | Local life | Mixing "3 game minutes/batch", watch shifts, travel ETAs, cooldowns | `formatDuration` (number_format.js); proposed lint `in \$\{[^}]+\} minutes` | Fixed in Local life; others open |
| PF10 | **Saved history keeps old wording** | Knows: "Witnessed: the accepted commission consumed your log…" | Notebook entries, Reports history | PRS8 keeps history as written; new saves get new text | Accepted (by design) |

### Repetition and noise

| Code | Pitfall | Seen | Similar cases | Caught by | Status |
| --- | --- | --- | --- | --- | --- |
| PF11 | **The same title or line twice** | Around you fold title; "You said" per row | Mixing: "Village mixing counter" in the view header and again as the panel title; "Next step" in the guide box and again in Reports "Right now" | check:flow `repeat` (sentences of 30+ characters); proposed: heading-pair check (a view header equal to its first heading) | Around you, knows rows fixed; mixing, Next step open |
| PF12 | **The same reason under every disabled button** | Tingen Begin buttons | Shop rows when broke, craft rows without a station | Shared reason pattern (UR149); sweeper links `aria-describedby` | Fixed where seen |
| PF13 | **A grid of unknowns** | Mixing: 12 cells of "? unknown" | Bestiary, skill lists, herb lore tables | Proposed: show known rows, then one line "Untested: River bellleaf, Emberseed, Mellow salt" (the Proto23 `???` for names stays) | Open |
| PF14 | **Everything shown at once** | Village screen: many folds, Iona's ledger mid-screen | Mixing: method and process selects ("Ordinary method", "Steep") before the first mix; Settings page; module header controls (Dock, Earlier, Later) | UR32 progressive disclosure; proposed: first-meeting flag per panel and control (PX52) | Open |
| PF15 | **A preamble before the first action** | Talk view | Mixing intro line, Local life readiness line ("Ready. …") | PRS9 | Talk, Local life fixed; mixing open |

### Layout and flow

| Code | Pitfall | Seen | Similar cases | Caught by | Status |
| --- | --- | --- | --- | --- | --- |
| PF16 | **Opening a view moves what you did not touch** | Every centre route, mixing | Expanding a module, closing a dropdown (M4), combat entering | check:flow `stability` | Fixed while a view is open (M1); M1b, one refit after the first return from the Journal, open |
| PF17 | **A hard cut of most of the screen** | Mixing, conversation | World crossing, sleep, reading | UR152 ease-in | Fixed for centre views |
| PF18 | **A conversation or task takes the whole centre** | Talk, mixing | Trade, storage, crafting | PX51 proposal (open in place) | Open |
| PF19 | **State lost on redraw** | Travel menu shut after moves and after Esc | Scroll position, selected item, open folds, typed quantities in the mixing counter | Keyed menus (UR148); proposed check:flow item: open a menu, move, return, still open | Fixed for menus |
| PF20 | **A shared class used as an identity** | `choice_travel` on three menus restored the wrong one | `querySelector` on non-unique classes elsewhere | Proposed: grep for restores by class; key by name or id | Fixed where seen |
| PF21 | **Measuring a hidden or lazily drawn panel as real** | Around you measured short after a view closed | Any fit or size measure taken right after a reveal | Settle window in shell composition | Fixed for the top row |
| PF22 | **Compare in one place, act in another** | Tingen lives table | Shop compare vs buy, equipment comparison vs equip | UR149 | Fixed where seen |
| PF23 | **A sheet you cannot click out of** | "?" shortcuts | Control boxes (already close), item detail pop-outs | UR150 light dismiss | Fixed |
| PF24 | **Buttons whose labels wrap** | Mixing "Buy 1 (8 coins)" on two lines | Long action labels in Local life, Begin buttons | Proposed check:flow item: a button taller than two text lines | Open |
| PF25 | **A menu that must be reopened after every move** | Move somewhere else | Talk to someone, Find work | UR148 | Fixed for all location menus |

### Systems standing in for systems

| Code | Pitfall | Seen | Similar cases | Caught by | Status |
| --- | --- | --- | --- | --- | --- |
| PF26 | **A counter standing in for a real system** | Rapport counted lines said | Reputation from clicks, skill "mastery" from repeats, trust from gifts alone | AREA_GUIDE owners (ties, memory); PX53 | Rapport fixed |
| PF27 | **A block with no stake** | Crossing blocked by running | Talking blocked by idle training, saving blocked by harmless work | PX54 (idle practice yields) | Fixed for crossing |
| PF28 | **Exact numbers before they are earned** | Rapport track, find odds | Weather numbers, enemy stats before meeting, forecast | UR151 (hover detail until earned) | Rapport, Local life fixed; others open |

### Checks that missed

| Code | Pitfall | Seen | Fix |
| --- | --- | --- | --- |
| PF29 | **A lint with blind spots** | PRS6 read top-level `src/*.js` and `field: '…'` strings | Now recursive and reads `textContent`; proposed: also `innerHTML` templates and `title=` attributes |
| PF30 | **Tests read the model, the player reads the screen** | Rapport, herb answer, mixing all passed tests | check:flow reads visible text per route; proposed: add the mixing, Local life and Settings views to its walk |
| PF31 | **The test harness starts in a state players do not** | Top row 512 px at load, 305 px after any view | Proposed: check:flow compares home before and after one round trip |

### Watch list (not seen yet, likely)

From round 47 and the same causes: number jitter on live counters (tabular figures, UR117); focus lost after a redraw (UIC120); popovers covering the row they describe (UR111); notices that open themselves mid-read (UR88); the work line hidden by a view (UR11); layout choices forgotten after reload (UR58).

### Address next (ranked)

1. **Mixing counter** (PF4, PF5, PF9, PF11, PF13, PF14, PF15, PF24): one pass, since it shows eight pitfalls on one screen.
2. **Settings and the work line** (PF1, PF2, PF3): the pacing paragraphs and "Pick something under Here to start".
3. **New lints and flow checks** (PF2, PF3, PF5, PF9, PF24, PF29, PF31): cheap, and they keep the rest from coming back.
4. **PX51 talk in place and PX52 calmer Village** (PF14, PF18).
5. **M1b** (PF16): fit the top row to You alone.
