# Talk and dialogue representation

Status: proposals (AD32). Everything here is the current best and open to refactor or replacement with a reason (AD45).
Branch `claude/rep-talk-d8d734`, 2026-10-30. Evidence: [evidence/talk/](evidence/talk/). Code: `src/read_models/talk_bridge.js` (pure bridge),
`src/ui/talk_view.js` + `styles/talk_view.css` (renderer), `src/talk_dialogue_host.js` (native Village seam, one hook in `src/display.js`),
`tests/talk_view.test.js`, `scripts/talk_browser.cjs`.

## What the slice is (PRF1, PRF2, PRF7)

A fresh player opens **Talk to someone → Talk to village elder** in the Village and lands on a conversation view in the center, at 1920×1080:

- **Card (top, actions first, UR42).** "Talking with Village elder · Village", one sentence of stakes ("Saying any of these takes no time. Each line shows
  what it costs before you say it."), the person's last line (the native answer node, moved into the card), then every line you can say, each with its quote.
- **Already covered (left of the lower row).** Lines you have said (a quiet check, still readable, opens to recall the answer) and lines settled another way.
- **What the elder knows of you (right).** Sourced rows: what you told them (your own words), what they saw you do (the existing `storyRecap` line),
  how they act toward you. A fresh life reads "has not spoken with you yet, so they know nothing of you". Beneath it, **Rapport**, a four-stop ladder drawn by the shared figure track, with a sentence naming what the next stage opens.

Player sentence when it cannot run (PIR9, PIR10): a line that is known but not possible shows its reason beside it. In the base Village nothing is locked
by a stat, so the only "cannot" is that the elder has nothing new; the card says so.

Route kind (FLR2): real route from a fresh life, by earned steps (the place action), exercised in the rebuilt bundle with headless Chromium at 1920×1080 on a fresh origin.

## Design decisions in the slice

1. **Quote before the click (SUI6), without spoilers (PIR5).** A native line's `rewards` map to observable categories: "Opens more to ask.", "May point you
   somewhere new.", "May show you something to do.", "You receive something.", "Moves one of your journal tasks forward.", "Settles the other ways to put this."
   Names appear only when the caller says the hero already knows the target. The test uses the real elder data: the line that unlocks a field and two activities
   quotes none of their names. Time: base dialogue costs none, said once in the stakes line when every row agrees.
2. **Three looks (PIR16) derived, not stored.** new = a line the native menu offers (read from the divs `update_displayed_dialogue` already built, so eligibility cannot
   drift); heard = a closed line that locks only itself; several sibling lines that lock each other read as one grouped row, "One of: ...", because availability cannot say which was said (found by the advisor check, covered by a real-data test); settled another way = a closed line some other line locked. No new save field, so no migration and nothing to
   import or export (FLR5: save, reload, confirmed derived again in the browser script). Known limit: PIR14 asks for a per-line fingerprint so changed text counts as new
   again; that needs a persisted heard list and is ACCOUNT FOR NOW below.
3. **Hidden lines stay hidden.** The base elder's later lines are unlocked by earlier ones. The view shows a single sentence, "There may be more to ask as you learn more." Listing
   locked lines by name would leak the tree (PIR5, SUI5 applies where the hero knows the line exists, as in cast topic talk).
4. **One function per verb (PIR8).** The native line divs stay in the DOM (visually hidden, `aria-hidden`), and the view's buttons call `window.start_textline(key)`. Existing browser scripts that click `[data-textline]` still work.
5. **Reuse (item 8).** Card = `renderSceneCard`; rapport ladder = a `figure.js` track (`rapportFigure`), which also gives the text form; people knowledge = `storyRecap` and, later,
   `person_memory` readers; cast topics = the same rows through `topicsFromTopicTalk` (tested against `quoteTopicTalks`). No new shape: the row `{id,label,state,reason,quote}` is the one
   shape, with two producers now (native textlines, cast topic talk). A third producer (a pack's conversation data, the ink scenes) would earn the "two consumers" rule (UR79).

## Reference games (item 1; claims marked K known from play or docs, I inferred)

| Game | What the player sees | Easy | Costs | Idea taken |
|---|---|---|---|---|
| Disco Elysium | Dialogue is a column of text with skill names as speakers; checks show a percent and are colored by passive/active (K) | Seeing your own mind argue; risk is visible before choosing | Dense text walls; the skill voices interrupt the person's actual line (I) | Quote the risk before the click, and let a "voice" be a labelled source (our `source` words on the knows ledger) rather than a new UI |
| Mass Effect | Radial wheel; position means tone (top paraphrase, left probe, right close), the wheel shows paraphrases, not full lines (K) | Fast, controller friendly, tone is learned once | The paraphrase can differ from what the hero says (K, a common complaint) | Fixed position = fixed meaning. Our rows are ordered by authored order (PIR18) and the quote line sits in a fixed place. The wheel itself suits one active scene, not a topic list; kept as a later alternative form |
| Persona series | Social links: a rank per person, choices score points, the rank-up gates new scenes and perks (K) | Visible progression with each person | Rank can feel like a grind meter; some answers are "correct" (K) | Rapport as a ladder with a sentence naming what the next stage opens (item 19); no hidden "correct answer" |
| Kenshi | Terse one-line barks, no choice trees; the world reacts through standing and behavior (K) | Almost no text; the world carries meaning | Little to read means little to plan around (I) | A "bark" form for a person the player does not know yet: one line, no card (see Round 1, form E) |
| Pentiment | Each speaker has a lettering style (typeface) so you read who is talking and how educated or rushed they are (K) | Speaker identity without labels | Needs authored fonts per person (I) | Speaker identity by role mark, through tokens, so a world skin sets the typeface (item 20); kept to a later motif pack |
| Citizen Sleeper | Dice-driven actions with a quoted cost and a clock; conversations are short, with the cost of time visible (K) | Every choice has a visible price | Heavy use of the cost line becomes noise (I) | Say a uniform cost once (done: "Saying any of these takes no time."), per-row when it differs |
| Crusader Kings III | Opinion tooltips list each cause with a signed number; interactions show acceptance chance (K) | You can see why someone feels as they do | Many numbers; the sum hides which cause mattered (I) | "What they know of you" is a ledger of causes, each with its source, not one number. The relationship web session owns the number view |
| RimWorld | Social interactions are log lines; the opinion breakdown lists reasons (K) | Cheap, readable, no UI per chat | Little agency in the chat itself (I) | Heard lines become subject-first log lines (Reports, below) |

## Forms (item 18): which shape for which question

| Question | Form chosen | Why not the others |
|---|---|---|
| What can I say, and what does it do? | **Card** (scene card with quoted rows) | A wheel hides the quote; a table makes a choice feel like a form |
| What have I already covered with this person? | **Topic ledger** (list with three looks) | A graph invents structure the base game does not have |
| How is this person changing toward me? | **Ladder** (figure track) with a sentence | A bar implies a number the game does not keep; a ring implies a cycle |
| What did we say, in order? | **Transcript** (the text form, and a log-style view, form D) | Cards forget; the log forgets by design (RPT9), so the person view must remember |
| One unconventional | **Margin notes**, see below | |

### Round 1 forms in the gallery of options

- **A. Dialogue card on the scene card (built).** Best when you are in the conversation: actions first, quotes under each row.
- **B. Topic ledger (built, as the left rail).** Best between conversations: what the person has been told, what is open. Known topics and unknown topics: unknown topics are a count-free
  sentence, never a list (sealed-secrets rule and PIR5).
- **C. Wheel (not built).** For a charged scene with three to six short stances (Mass Effect). Needs the stance to be one word and the quote to move to a hover; poor with 21 px text and keyboard.
- **D. Log-style transcript (partly built).** `talkText()` already prints covered lines and answers; a per-person transcript in the person view is the destination (RPT9: the log forgets, the person view remembers).
- **E. Bark (not built).** For someone the hero does not know: one line ("The trader nods and goes back to counting."), no card. Cheap, gives a fresh player less to read.
- **Unconventional: margin notes.** After a line commits, the other party's reaction is drawn as a short note in the margin of the card, tinted by the manner chip
  (warmer, cooler, wary), and the same line is written to Reports. The reaction is one line of text and a mark; sound is never information (UR38). It would take the `person_memory` `reactionLine` reader (already pure)
  and a per-world phrase table. Worth a later slice once memory is wired into the live game.

## Levels and depth (item 19)

- **Rapport stages** are counted in things said, with a default table in the bridge (`RAPPORT_STAGES`: Stranger, Acquainted, Familiar, Confidant). It is a default with a dial: a world passes its own table, and the
  count can be replaced by the real relationship value when a world has one (the web session owns that value). Each stage carries a sentence for what it opens.
- **What unlocks a topic.** Three kinds, all quoted: a stage reached, a thing known, an item or standing held. The reason string names only what the hero's means can establish (PIR9).
- **Depth one click away (UR42).** The glance is the card; the covered rows open to recall the answer; the ladder is already small.
- **Later volumes and worlds (item 17).** Rows are data (`topicsFromLines`, `topicsFromTopicTalk`, `rewardQuote` kinds), so a later volume's talks add rows to a pack; I checked the cast topic-talk module, and did not read the reading outputs for this slice, so which kinds of talk later volumes need (negotiation, interrogation, ritual speech) is open.

## Less text density (item 14)

- A uniform cost is said once. Effects are separated by a middle dot on one line.
- Reference prose is not on the card: the rapport sentence is the one piece of prose beyond the quote.
- Center layout is container-sized: at the center column's width the card leads and the two ledgers sit side by side beneath it; in a wider pop-out the three columns sit in one row.
- Reports (proposal, not built): a said line would write one subject-first line ("You asked the village elder: Hello?") through the existing log path, and the person view would hold the history. Shared panel shell stays with the time session (item 14).

## Witness levels and names (SUI3, RPT2, RPT4, other seats)

`witnessLine({witness, who, topic, outcome})` is the one text rule: present gets the exchange; affected gets the outcome; aftermath gets "seems to have talked about"; heard gets "Word is that ...", marked as told.
`who` is the display name as the viewer knew it then (a described name such as "a tall officer" until introduced). The view does not decide this; the caller passes the name resolved at read time. A seat that is not the speaker gets a
witness line, not a card: only the lead's own conversations draw the card.

## Round 1 checks (agent-verified, not human-reviewed)

| Check | Result |
|---|---|
| `node --test tests/talk_view.test.js` | 10 pass (real elder data: fresh life shows one new line; a line that unlocks a place quotes no place name; heard and closed rows; one of three sibling lines said reads as one grouped row; rapport; knows ledger; witness; cast adapter; view draws through the given document; styles use tokens) |
| `node scripts/slot_run.mjs --kind build -- npm run build` | ok; proof ran on that bundle (`talk-proof.json` names the fingerprint) |
| `scripts/talk_browser.cjs` via slot_run browser | passes: fresh life route, 1920×1080, quote and empty ledger, choose through the view (native `start_textline` runs), heard row and told row, Esc leaves, save + reload derives heard again, 21 px text with effects off has no horizontal overflow |
| Gaps | Not run: `npm test` (committer), `check:arch`, `check:rules`; Neutral theme screenshot; real 14 px vs "Increase textsize" option toggle (the 21 px case set tokens directly); Electron |

## Round 2 (items 1-21)

Items 1 (reference games) and 18 (forms) are above.

**2. Fresh-player test.** I opened it as a first-time player (screenshot `talk-fresh-1920.png`). In five seconds: you are talking to the elder, one thing to say, it costs nothing, they know nothing of you yet.
Terms that needed knowing: "Rapport" (answered by a sentence and a ladder), "settled another way" (answered by the row). Clicks that hid the point: none new. A number without a meaning: none. Cheap fixes made: header
read "Talking with · Village · Village elder" and is now "Talking with Village elder · Village"; the stakes sentence no longer says "nothing costs you anything but what is quoted"; the doubled period in "Hello?." was removed in the text form; a native line authored as plain text
showed "text not found, id: ..." as its label (a pre-existing native defect on the moon-bed line, now shown cleanly by the view, still wrong in the native list).

**3. Space, split, density.** Split: "what can I say" (card) and "what do we have" (ledgers) answer different questions and are separate. Merge: the native name div, answer div and list were three stacked blocks; now one card.
Density by frequency: the card is the always-read part, so it carries one line per row; the ledgers are glances; recall is one click.
At the center column width the three-column layout was cramped (screenshot before the container query); now a container query stacks the ledgers under the card.

**4. Bars and small signals.** No bar. The ladder is four named stops, because rapport in the base game is not a number. If a world keeps a relationship value, the relationship web's bar or chip should be reused here, not redrawn.

**5. Pop-outs and Electron.** The renderer draws into the node it is given and uses that node's document, so it can be popped out (MDL13); the container query lets it widen into three columns on a second screen. A dock badge or notification for "someone has something new to say" fits the PIR15 truthful-dot rule and the person marks setting; not built.

**6. Cheats and insight.** `model.cheat` marks a view that shows what a person privately thinks (a `manner` row from `reactionLine`, or their actual stance). It prints "Cheat view: shows what they privately think." with a dashed rule, so a cheat-sourced row never reads as something the hero learned.
Not wired to a setting. Sealed secrets stay inside their discovery route: the bridge only accepts rows the caller already filtered.

**7. Visual style.** One alternative proposed, not built: **paper and ink**, the covered lines as a handwritten ledger (rule lines, no borders), the knows ledger as marginalia. It reads better for the covered list (a book of what was said) and worse for the card
(quotes need clear separation). Both must work in Luminous and Neutral at 14 and 21 px with effects off; the card already uses only tokens (tested).

**8. Use what we have.** Done above (scene card, figure track, `storyRecap`, `quoteTopicTalks`). Not reused: `observer_view.js` seat reads (the view takes an already filtered model).

**9. One unconventional option.** Margin notes (above).

**10. Audit gaps.**
- Lead's run (LTU1-LTU15): the first conversation is reachable and legible; later talk (asking about the moon bed after meeting the elder) shows as a row with its own quote.
- Other seats: witness lines exist as text; no seat draws them yet.
- Empty and error states (UR32): empty ledger sentence, no-new-lines sentence. A throwing host seam would leave the native list visible, since the view mounts after it.
- Persistence: none added.
- Performance: one render per dialogue open, about 40 nodes.
- Accessibility: native lines are `aria-hidden`; the view's buttons are real buttons in tab order; the unit and browser checks cover 21 px and effects off. Arrow-key navigation between rows (PIR11) is not built.

**11. Prior implementations, abstraction.** The abstraction is a **ledger of rows with a state and a quote**: topic rows here, owed rows in economy, claims in knowledge. The two-state vocabulary (new / heard / closed / locked) matches the knowledge session's certainty grammar in spirit (known, guessed, open); they answer different questions (what you can say vs what you know), so I did not merge them.

**12. Open for improvement.** Likely next refactor: persist a heard list with per-line fingerprints (PIR14) and have the view read it; then `heard` is truthful across edited text. The reward-category table is the other thing to move into pack data when a second world needs its own wording.

**13. Flourish.** Hover and focus glow use `--ui-glow-affordance` and are removed under effects off and reduced. A settle animation when a line moves from the card to the covered list, and a soft pulse on a new line, would use `settled_text_effects`; not built. Effects never move layout.

**14. Reports and center.** Reports (proposal, not built; see ACCOUNT FOR NOW): one subject-first line per said line, written once by the settling event (RPT8). Center: reference prose stays out of the card. Shared panel shells left to time and worlds.

**15. Ability flourish.** Not relevant here.

**16. Fold into existing UI.** The view replaces the native line list and name block in the dialogue center mode and keeps its Leave and Trade buttons; the native list remains in the DOM. Retiring the Talk to someone dropdown is a PIR1 and PIR24 matter (two routes to the same people) for the coordinator; I made no change to it.

**17. Later volumes.** See above. Open: negotiation and interrogation as talk kinds.

**19. Levels and depth.** Above.

**20. Roles, not looks.** Marks carry roles: topic state (new, heard, closed, locked), knows source (told, deed, manner), rapport stage. Flair in two worlds: a quiet village world could set heard lines in a ledger hand and rapport as a hearth that burns lower and higher; a court-intrigue world could set the speaker mark as a seal and rapport as a ladder of titles of address. Neither touches the bridge or the text form.

**21. Draft status.** The three-column layout is a draft. If a later round shows the card should be a full-width sheet with the ledgers behind tabs, the bridge and text form survive unchanged.

### ACT NOW (done)
Conversation view, bridge, host seam, tests, browser proof; fresh-player wording fixes; container-sized layout; uniform-cost line.

### ACCOUNT FOR NOW
- **Persist heard with fingerprints (PIR14, PIR15).** Level: runtime, migration needed. Effort: medium. Done when: a heard list in a namespaced slice, reload and Import keep it, an edited line reads new again.
- **Reports line per said line (RPT3, RPT8).** Level: runtime, small. Done when: one subject-first line per commit, no duplicates on reload.
- **Arrow-key navigation and "Enter runs first" (PIR11).** Small. Done when: a browser script walks the rows by keyboard.
- **Name resolution through the reference resolver (RPT4)** for the person's name and witness lines. Small.

### LATER / DELEGATE
- **Wire cast topic talk into the view** (adapter exists and is tested): Sonnet-sized, medium; done when the Tingen cast conversation renders with quoted costs and heard marks.
- **Margin notes and `reactionLine`** once memory is live: medium; done when a cooler or warmer note follows a commit and is in Reports.
- **Paper-and-ink alternative style and a gallery fixture:** small to medium; done when it passes in Neutral and Luminous at 14 and 21 px, effects off.
- **Transcript tab in the person view (RPT9):** medium; belongs to the relationship web session's people view, so coordinate before building.
- **Pop-out for a second screen:** small once the container query is checked in a real pop-out.
