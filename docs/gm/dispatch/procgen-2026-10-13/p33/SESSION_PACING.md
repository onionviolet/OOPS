# AT1: stories sized to the current session

2026-10-14. **PROPOSAL ONLY.** Extend root [AT1](../../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md#at-session-sized-stories). [P25 episodes T1](../p25/EPISODES.md) owns editorial session boundaries/recaps; [P5 D9](../p5/D9_STORYTELLER.md) owns local pacing at P3's selection seam; [P12](../p12/STRUCTURES.md) owns causal arcs. AT1 adds a reversible estimate of attention and optional beat-size preference. It never changes settled losses, rival competence, chemistry, canon causes or world time to meet a runtime target.

## AT1.1: source audit and clock distinction

SHOWN/SOURCE: `src/main.js:7288-7295,7819` uses `Date.now` for tick timing; this is not a player story-session model. `src/main.js:7214-7215` can pause joined progression for waiting/manual encounters. `src/simulation.js:80,233-237,360-397` uses sessions for mechanical encounters and reservation/response/withdrawal, not reading-attention sessions. `src/chronicle.js:49-57` validates another mechanical encounter session. `src/event_feed.js:102` returns eight recent news rows; it cannot establish episode completeness. [P25 T1.1](../p25/EPISODES.md#t11-a-session-is-a-reading-boundary) already distinguishes a reading boundary from a world tick.

INFERRED gap: the inspected tick/encounter/feed paths lack a model mapping current attention to candidate beat duration. Avoid overloading `simulation.sessions` with attention telemetry. Wall time can estimate reading activity, but must never move the authoritative native/instance clock, a due job or a promise.

## AT1.2: offer preference and observe cautiously

First offer a tiny preference: **Quick check-in**, **Open-ended**, or **Let it adapt**, with ordinary play available immediately. The choices affect delivery size and suggestions, not possible endings. Explicit preference wins over inferred pattern. A player can ask for a long scene during a short visit or turn adaptation off.

Local, proposed signals: foreground engaged interval, completed meaningful actions, time reading a scene, optional choices answered, known open threads and the player's chosen budget. Subtract hidden-tab idle/paused periods from attention estimates without stopping permitted game-time work. Reading quietly is engagement, not proof of boredom. Accessibility/input pace and repeated menu actions must not be misclassified as a request for threat. Do not collect keystrokes, full action text, URLs or private transcripts, and do not upload play patterns. Only small local aggregates are needed.

Illustrative estimate, not calibrated psychology: classify today's session as explicit budget when set; otherwise use coarse short/unknown/long bands from completed engaged intervals and the recent local median. Start unknown, wait for enough actual intervals, and require sustained contrary evidence before switching. The 5-minute and 3-hour root examples are descriptions, not compulsory exact cutoffs. Persist preference and a bounded optional aggregate only after enrollment; keep an active interruption/resume distinct from Import/reload, which cannot create bonus beats or reset a long queue.

## AT1.3: fit content by structure, not speed-up

| Current attention | Proposed offered shape | Evidence and resumability |
|---|---|---|
| Brief check-in | Short factual P25 recap, one fitting optional beat and live next action | Show actually completed jobs/new evidence, not invented drama; accepting a long request can leave it open |
| Uncertain/quiet | Compact ambient or ordinary opportunity with expandable text | Silence stays valid; no forced decision wall or assumption of imminent exit |
| Sustained active session | Linked choice/preparation/consequence scenes where real plans supply them | Existing causal thread can get a richer view; long prose alone does not create more mechanical depth |
| Active crafting/training session | Small relevant interruption after a safe boundary, or player-requested social/competition beat | Do not steal reserved material, worker or time; same activity's real result remains unchanged |
| Returning to unfinished arc | Resume exact pending state plus short recap | Same accepted terms, chosen cast, deadlines and draws; no refresh rewrite |

Each candidate declares attention estimate, number of manual decisions, interruptible boundaries, mandatory mechanical duration if any, prerequisite/receipt refs and continuation policy. Estimated reading time is UI advice. A rescue that needs 30 supported game minutes cannot become a five-minute world action because the player's attention band is short.

AT1 hands one soft preference factor to D9/P3 alongside stage/style, with hard lore/means exclusion still zero. Do not schedule a second event loop or multiply the same factor via several owners. Candidate size can favor a short scene, a resumable opening or a summary of a settled NPC result. Once a scene is admitted, freeze its substantive cast, conditions, outcome draws and terms. Later preferences can collapse/expand wording or postpone a new beat, never reroll it.

Episodes can span visits; an arc can be short because an overwhelming success genuinely resolved it. A three-hour session need not be padded with another obstacle. Stories cannot require login streaks or hidden minimum attendance. Ordinary idle routines continue under their selected clock policy; AT1 does not authorize offline simulation.

## AT1.4: use patterns to deepen options

Original pairing: a quick Village visit receives a rival board revision and a short maker invitation. The player can inspect and queue an already learned method, then leave the unresolved social thread. A longer visit can investigate the same publication, attend a fitting lesson and negotiate a rematch. These actions cause the larger story; the system does not secretly settle them during absence.

Repeated interest may suggest optional related content, with a visible reset/control. Reading a defeat account need not mean the player wants more defeats. Clicking one romance scene need not suppress crafting or permanently specialize the story. Save choices as evidence of preference with uncertainty; preserve unrelated eligible possibilities. Difficulty, source scope, food policy and world adjectives remain independently controlled.

No hunger in attention, pressure or recovery budgets. Food remains an optional benefit. Strong or gentle worlds, rare or constant media, long ordinary lives and intensive sessions stay reachable. Session pacing controls when/how much is offered, never a fixed universal once law.

## AT1.5: first journey and gates

Future first slice: explicit short/open-ended controls plus one local adaptive band over integrated D9/P3 and P25. Compare the same earned pending episode in short and expanded views; then demonstrate that future eligible short versus resumable-long candidates change priority while results/causes remain fixed. No new world or universal director required.

All gates OPEN: foreground idle and reading distinguished; manual preference overrides inference; disabling/removing optional owner preserves baseline behavior; invisible hidden candidates absent from explanations. Repeated views/reloads/preferences never alter pending cast/draws, game-time boundaries, stock or deadlines. Deterministic SOURCE traces compare eligibility/weights and summarization coverage, not a promise that one sampled run has a fixed rare-event count. Failed write retains aggregate/preference/cursor; Import supports explicit local aggregate reset without resetting gameplay. Rebuilt 1366x768 and 1600x1000 show short recap, open work and expansion control without blocking routine actions. Human session fit remains a separate acceptance gate.
