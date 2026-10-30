# Body, conditions and altered states (proposals, 2026-10-30)

**Next slice (2026-10-30):** BC8 chips in the Condition panel Body section. Level and effort: Sonnet, small. Done when: chips visible in Condition at 1920×1080 with words, effects off identical.

Representation round for RPX4 (cultivation and body channels), RPX9 (altered states)
and RPX10 (disguise and identity) from the
[UI design audit](../audits/UI_DESIGN_CORE_AUDIT.md), on the MDL2 figure primitive
(`src/ui/figure.js`). Everything here is a proposal (status: agent-verified, not
human-reviewed). Rules applied: BHR2, BHR5, BHR6, BHR7, BHR19, BHR29 from
[domain rules](../DOMAIN_RULES.md); UR37, UR38, UR62 from [UI rules](../UI_RULES.md);
MDL2, MDL4, MDL5, MDL8; UR76 (proposed) for the home contract.

## BC1-BC6: representations weighed

| Code | Representation | What it shows well | Cost or risk | Verdict |
| --- | --- | --- | --- | --- |
| BC1 | **Body map**: regions placed on a standing body, each marked with its current condition (`!`) or lasting change (`●`), conditions and changes in plain notes, recovery milestones as tracks | Where harm sits (BHR2), time left, the next useful step (BHR19), lasting versus passing (BHR29) | Points on a body, not a drawn silhouette; regions are only the slots the body owner already names | **Default, built** |
| BC2 | **Channel ring**: channels around a core, open, closed or unmeasured, edges for which method draws on which channel | Cultivation affinity and blockages as node states (RPX4) | Only meaningful where a world has channels; the base frontier has only the latent root | Default where a body has channels; adapter and fixture built |
| BC3 | **Altered-state presentation**: the same body map and log, with a tint on the subject's frame, an intruding voice marked as such ("a thought that is not quite yours:"), and unreliable readings flagged `?` with the word "unreliable" | Intoxication, poison, fear, loss of control (RPX9) felt without lying | Easy to slide into hiding facts or moving controls; must stay subject-bound (MDL8) | Proposal; needs an altered-state condition with a `reads` field first |
| BC4 | **Second body view**: your own body and the borrowed face side by side, edges for who sees which and how long it lasts | Polyjuice, masks, secret roles (RPX10); seat projection of "appearing as" | The Polyjuice bench is its own world slice; wiring waits for that home | Adapter and fixture built; wiring is the next slice |
| BC5 | **Paper doll silhouette** with drawn limbs that change color | Familiar from RPGs | Needs a drawing per body kind (BHR4: constructs, spirits, plants), and color carries the fact (UR37) | Rejected for now; BC1 regions come from data and suit every body kind |
| BC6 | **Unusual: Seen and Felt.** The body split in two columns: what others can see (the owner's `look` text, public) and what you feel (`bioDetail`, private), with symptoms before any diagnosis (BHR7) | Makes the gap between appearance and experience playable: hiding a limp, a disguise that fails because of a visible sore hand, an NPC noticing what you did not mention | Needs a witness rule for who saw what; overlaps the seat projection (MDL4) | Proposal; the data already exists on every body trait and condition |

## Default, dial and reason

- **Default:** BC1, the body map, shown in Notebook › Practice › Body & recovery under
  a "Body figure" disclosure, with its full text form beneath the drawing.
- **Dial, per world and per body:** a world whose bodies have channels adds BC2 beside
  BC1; a borrowed or worn body adds BC4; an altered state layers BC3 on whichever is
  shown. Effects follow the save-level Effects setting (full, reduced, off).
- **In-world reason:** you know your own body by where it hurts and what changed, so
  the map is the character's own sense of their body. Channels show only after a
  measurement, because the character cannot feel an affinity they have not tested.
  A borrowed face shows both bodies because the wearer always knows which is which.

## Honesty contract (UR38, UR62, BHR6)

- Every fact is in words: the label, the state word and a note. The mark glyphs `!`,
  `●`, `✓`, `▶` repeat a word; color and the pulse add nothing the text lacks. A test
  pins this: removing every effect leaves the text form identical.
- The pulse sits on the subject (the region with a condition now) and stops when the
  condition ends. Under Effects reduced or off the halo is gone; controls keep their
  place (the drill button measured at the same offset in all three settings).
- Only conditions the body owner marks showable (`bioVisible`) appear. A hidden or
  dormant condition waits for its sign, test or fitting means (BHR6).
- The figure reads through `observerView`, never the lead's identity (MDL4).

## UR76 contract (proposed)

Home: Notebook › Practice › Body & recovery (existing, `#body_panel`). Shape: MDL2
figure. States and their text:

| State | Text shown |
| --- | --- |
| No body record | Figure hidden; the panel's scene line explains the record is not begun |
| Settled | "Nothing is troubling this body right now." |
| Condition now | "Now: sore hands." plus "Sore hands (hands, 12 min left): ..." or "until treated" |
| Lasting change | "Palm mark (marks, acquired): A pale line crosses one palm." |
| Milestone | "Conditioned grip, 1 of 3 done: 1. Drill 1 (done); 2. Drill 2 (current); ..." |

## Receipt

Files:
- `src/body_figure.js`: `bodyFigureSpec` (BC1, wired), `channelFigureSpec` (BC2),
  `secondBodyFigureSpec` (BC4).
- `src/body_ui.js`: Body figure disclosure; redraws only when the text form changes.
- `index.html`: loads `styles/figure.css` in the game page (it was gallery-only).
- `src/ui/preview/fixtures/body.js`: three fixtures through the same adapters;
  `src/ui/preview/figure_gallery.js`: one registration line.
- `tests/body_figure.test.js`: 7 tests on the real body engine and the panel.
- `scripts/body_figure_browser.cjs`: the evidence capture, reproducible.
- Evidence in [evidence/body/](evidence/body/): `body-panel-1920-effects-{reduced,full,off}.png`
  (whole 1920×1080 window), `body-panel-crop-effects-*.png`, `body-figure-text.txt`, gallery shots.

Checks (one line each; input: bundle `c22e3500a15f`, gallery bundle `96316e079476`):
- `node --test tests/body_figure.test.js`: 7 pass (no record, fresh settled body, drill soreness then
  expiry, hidden condition stays off, frail start, effects carry no facts, channel and second body, panel
  redraws only on change).
- `node scripts/body_figure_browser.cjs`, headless Chromium 1920×1080, fresh `localhost` origin with
  `?test_hooks=1`: elder met, body record begun, one grip drill finished by dev-stepped time, clock paused,
  then Settings › Effects set to reduced, full and off with Apply and save. Pulse halo animates only at
  full (`fig-pulse`); reduced and off show no halo; the drill button sits 1115.9 px into the panel in all
  three. No page errors.
- `npm run check:arch`: pass (no new main.js lines, no new cycles). `npm run check:rules`: pass, 5
  existing warnings.
- `npm test`: 4106 pass, 9 fail, 6 cancelled under load average 220-320 from sibling sessions; the
  failures are live-integration files hitting the 180 s timeout. The 15 failing files rerun alone at
  load ~150: same timeouts (worker killed at its 160 s limit, empty output). `cast_body_adapter.test.js`
  "native sleep, waking, meals" with the worker limit raised: passes in 451 s on this branch. Gap: the
  other 14 live files were not rerun with a raised limit; a quiet-machine `npm test` is still owed.

AD43 floor: FLR1 bundle `c22e3500a15f`. FLR2 reached from a fresh life by earned steps (elder, begin
record, drill), plus named fixture `body-record` in the figure gallery. FLR3 no new verb: the figure is
read-only beside the existing Body & recovery actions, which keep their costs and reasons. FLR4 consumer:
the existing body verbs; the milestone track names the next one (Drill 2, Keep the grip). FLR5 no
persistence change. FLR6 browser-verified (headless), route kind fresh life plus fixture; agent-verified,
not human-reviewed. BC2 and BC4 adapters are fixture-only: implemented, below floor.

Next slice: wire BC4 into the Polyjuice bench's effect line, then move the Body
figure's text summary into the Condition panel's Body section (the Condition home for
RPX9), then BC3 once an altered-state condition carries a `reads: unreliable` field.

## Round 2 (2026-10-30): review and restructure

Brief: [round 2](../gm/dispatch/ui-refactor-wave-2026-10-29/ROUND2_BRIEF.md) items 1-21. All of this is a
draft and open to replacement with a reason (AD45). Codes continue: BC7 onward, R2-F for findings.

### How other games do it (item 1)

Patterns adapted, not looks. "Known" means from play or the games' public docs; "inferred" is my reading.

| Game | What the player sees | Makes easy | Costs | Idea taken |
| --- | --- | --- | --- | --- |
| Dwarf Fortress | Per-part wound list, colour-coded body-part text, a long "health" screen per creature (known) | Seeing exactly which part carries which harm | Dense, colour carries meaning, hard for a new player | Harm names its part and its effect on function (BHR2, BHR13) |
| RimWorld | Health tab: a list of parts with their conditions, and capacity percentages (moving, manipulation) beside them; tend quality and bleeding shown per row (known) | "What is wrong, where, and what it does to work" in one table | Percentages without context need learning | **The part table (BC7)**, and showing the effect on work in words |
| Project Zomboid | Moodles: a small stack of icons at the screen edge, one per state, with severity levels; a body silhouette in the health panel (known) | Constant glance at what is bothering you, without opening anything | Icons need learning; severity by colour/border | **Condition chips as the glance (BC8)**, each with words and time |
| Darkest Dungeon | Stress meter per hero; at a threshold an affliction is revealed in a dramatic moment and the hero barks lines that interrupt (known) | Altered state felt as a change of voice, not just a number | Barks can override player intent | An intruding voice marked as such for BC3; never takes a control away |
| Tale of Immortal / cultivation sims | Meridian or channel chart over a body outline, nodes opened by breakthroughs (inferred from public material) | Cultivation progress as body places | Mostly decorative once learned | Channels stay a figure (BC2) only where a world has channels |
| Disco Elysium | Skills speak as named voices in the dialogue log (known) | Inner states as readable, attributed text | Heavy writing cost | BC3's voice lines carry their source ("the drink says:") |

Own references: our earlier palette already had MI36 ("an injury puts a small mark on the actions it
affects") in [UI at scale](../UI_AT_SCALE_CONSIDERATIONS_2026-10-14.md) and LD3 ("recovery looks different
from danger") in the [thematic UI owner](../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md). Both fold in.

### Fresh-player test (item 2)

Round 1's body map, opened as a first-timer:
- R2-F1: the figure is dots in mostly empty space; "Face and bearing" with a `!` does not say what is wrong
  until you read the notes below the drawing. Point hidden behind reading.
- R2-F2: it never says what to do. "Sore hands" sits far from "Rest your hands", the verb that clears it.
- R2-F3: "9 min left" has no anchor (left of what?). Recovery progress has no shape.
- R2-F4: "Skin" and "Build" rows with nothing to say are noise for a new body.
- R2-F5: the legend repeats glyph meanings the words already carry.
Fixed in BC7/BC8 below: rows only for parts with something to say, cure buttons on the row, "3 of 12 min
recovered" with a meter, no legend.

### Form per part (items 3, 4, 18, 21)

| Code | Part | Form | Why this form | Density (UR42) |
| --- | --- | --- | --- | --- |
| BC7 | Body by part (replaces the round-1 radial map as default) | Table: Part, Now, Others see | Comparison across parts is a table's job; a radial layout implies a cycle the body does not have | Full detail, one click (the Body & recovery disclosure) |
| BC8 | Conditions now | Chips: `! Sore hands · 9 min left` | Glance often, like moodles; one line | Compact glance, always shown at the top of the view |
| BC9 | Recovery of one condition | Meter plus words ("3 of 12 min recovered") | One value; a bar answers "how far along" | Inside the row |
| BC10 | Training milestones | Figure track (kept from round 1) | Ordered steps toward a lasting change is a track | Below the table |
| BC2 | Channels | Ring (kept as draft) | Channels around a core read as a cycle; a body outline with paths may beat it later | Fixture only |
| BC4 | Borrowed face | Becomes the table's "Others see" column: while a face is borrowed, that column shows the borrowed appearance and the row says "worn over your own" | Seen-versus-felt is the real question; the node graph answered it indirectly | Same table, no new view |

BC6 (Seen and Felt) is now the default structure rather than an extra: "Others see" is the owner's `look`
text, "Now" carries what you feel (`bioDetail`). Round 1's radial map stays in the gallery as a fixture.

### Cures, depth and levels (items 8, 19)

- Every row lists the verbs that clear its condition, read from the commands that remove it, and the
  same disabled reason the panel already shows. The time-left words say the condition also fades.
- Recovery progress uses the duration of the one command that applies the condition; when several do,
  the view shows only time left (no invented total).
- Levels: a condition with intensity above 1 shows "level N"; severity words per world are LATER.
- BHR19 stages (pain eased, tissue, function, cause) need the condition owner to record them. The row
  has room for a stage line; today only one stage exists.

### Pop-outs, notifications, cheats (items 5, 6)

- No pop-out: the body view is small and read beside actions. A Dock notification when a condition clears
  during away time is worth a later slice (presence host, `src/host.js` fallback).
- Cheat or insight view (status windows, appraisal): adds rows for hidden conditions with a mark naming
  the source and what layer it read ("Status window, body layer"), BHR9. Sealed conditions keep their
  discovery route; the view never shows a sealed truth without that route's reveal.
- The developer inspector stays separate.

### Style, flourish, Reports, folding in (items 7, 13, 14, 16, 20)

- Style: tokens only; works in Luminous Gothic and Neutral. Alternative style sketched, not built:
  "paper chart" (a physician's record, ruled lines, handwritten-feeling part names) through MDL6 tokens.
- Flourish within UR38: chips may glow softly at Effects full; a clearing condition could settle with the
  existing settled-text effect (LD3: recovery eases rather than flashes). Never moves controls; the text is
  the same at Effects off.
- Semantic roles for later motifs: `condition-now`, `lasting-change`, `recovery`, `cure`, `seen`, `felt`.
  Flair sketch: a frontier world draws the table as a ledger with stitched margins and the meter as a
  drying bandage; a cultivation world draws channel rows as ink brush strokes and recovery as qi settling.
- Reports lines (proposal for the Time and chronicle owner): "Hands: sore hands began · 12 min" and
  "Hands: sore hands cleared", subject first, grouped when repeated, linking to the Body view.
- Folding in: the Condition panel's Body section (proto23 shell) should show the BC8 chips instead of its
  biography line; that touches the shell owner, so it is listed for the coordinator, not done here. The
  character-sheet session composes `renderBodyView(node, model)`; the body view stays owned here.

### Unconventional option (item 9)

BC11, **the body reported by others**: no number or diagram at all; the people around you notice. The
craftsman says "favouring those hands?" when sore hands are visible (the `showHands` verbs already exist).
A row's "Others see" text becomes what a named witness actually saw, with the time they saw it. Worth a
later slice once the witness and memory lanes settle; it turns disguise and concealment into play.

### Later volumes and worlds (item 17)

Regions come from data (`look.slot`), cures and durations from commands, so a later world with constructs,
spirits or many-limbed bodies adds rows, not view code (BHR4). Open: harm carriers beyond flesh (mind, soul,
held power, BHR2) need a "carrier" column or grouping; rank-scaled healing (BHR12) needs severity words per
world. Checked against the body rules only; reading outputs for later volumes not yet mined for body needs.

### Harm owner switch-over (coordinator, 2026-10-30)

The sonnet wave's L9 lane (death, harm and restarts; LSD34 and LSD283 harm ladder; `continuation_*`) owns
harm. Body views read that owner rather than a model of their own. Today `bodyViewModel` reads simulation
conditions (`state.simulation.conditions`) and the body owner's definitions (`bodyConditions`,
`bodySources`). Switch-over seam (confirmed by the L9 lane, 2026-10-30, [L9 design](../gm/dispatch/sonnet-wave-2026-10-30/L9_DEATH_RESTART_DESIGN.md#where-a-body-part-lives-proposal-answers-the-ui-coordinator-user_vision-injuries-overall-hp-plus-part-damage-where-it-matters-2026-10-30)):
`harmView(save)` in `src/harm_state.js` is the read. Its `parts` (slice 1 reserves `parts:[]`; the write side
lands with the first combat consumer) become table rows keyed by partId with the rung word; its `carriers`
(`stageLabel`, `blocked` action classes, `recovers`) become a grouping over parts (BHR2) and the stage line
under each row; `actionGate` supplies the "needs a steady hand" reason. `bodyViewModel` then takes a harm
view beside the simulation conditions: the `live` read and the `conditions` parameter are the only lines
that change, and a condition's `part` names a harm partId rather than a second store. Until parts are
written, the view keeps reading simulation conditions and `look.slot`. Body views read, never write.

### Injury model (proposals, IM1-IM7)

Follows Weibao's direction in [USER_VISION](../USER_VISION.md#injuries-overall-hp-plus-part-damage-where-it-matters-2026-10-30):
HP stays the overall pool, part damage is recorded where something reads it, combat first, middle path for now.

| Code | Proposal | How the body view carries it |
| --- | --- | --- |
| IM1 | A hit lowers HP and may also leave a part injury. HP is survival; parts shift odds and strength by degree. A part kills only through vital parts the world names (dial per world and body kind, BHR4). | HP bar unchanged and separate; part injuries are rows in the by-part table |
| IM2 | Consumers decide which parts exist. Defaults: hands and grip (accuracy and force for weapons, tools, writing, gestures), legs (speed, travel time, evasion, fleeing), eyes (precision in reading, searching, aiming), voice (chants, talk). A condition nothing reads stays a plain condition with no part. | The table shows only parts with something to say; a new part arrives as a harm partId or `look.slot`, not view code |
| IM3 | Degree before gate (Weibao, clarified 2026-10-30): a damaged hand is less accurate and weaker, a hurt leg slower with less evasion, a hurt eye less precise. Gating comes only at the extreme rung, and then the blocked action names the part ("needs a steady hand", MI36, BHR13). Modifiers come from the harm lane as a graded `actionModifiers` beside `actionGate`. | Each row shows its effect in words from `actionModifiers`; a gate reason appears only at the extreme rung |
| IM4 | Display: the glance line states the effect in words ("Right hand: −accuracy, −force · 6 days"); the by-part view shows the severity rung per part one click away; numbers sit in the row's detail, never alone (UR61). | BC8 chips become that line; the table's Now cell gains the rung word and the modifier list |
| IM5 | Recovery: treatment and training reduce the modifier; pain fades faster than damage (BHR19), so a row can show "pain eased, still weaker"; healing declares cost and where the harm goes (BHR22); routines reroute around injuries (BHR28); lasting harm warns first (BHR11). | BC9 meter tracks the damage rung; a separate pain line fades sooner; cure buttons keep cost and time from the command |
| IM6 | Visible injuries are tells: others can read a limp or a bandaged hand, opponents included, shown to the observer only as facts they know (UR36). Persistence lives in the L9 `harm` slice as an optional additive `parts:{<partId>:{rung,cause?}}` (absent when empty, no schema bump); a condition's `part` references those ids. Nothing added here. | "Others see" column carries the tell; reads `harmView(save).parts`, see the seam above |
| IM7 | Check: if an injury changes no choice in a fixed-seed playthrough, it is too detailed; merge it into a plain condition. | A row with no modifier, no cure and no gate is a merge candidate |

### Audit gaps (item 10)

- Other seats: the model reads through `observerView`; a thin life without a body record shows nothing,
  which is correct but silent. Error state: none of the view's inputs can throw at render.
- Performance: the table re-renders only when its text changes (same rule as round 1).
- Accessibility: real table semantics with row headers; cure buttons are focusable; 21 px text wraps.
- BHR10 cause: the condition record keeps only an opaque cause id; naming "from: grip drill" needs the
  owner to store the command label. LATER.

### ACT NOW (done this round)

- BC7 table, BC8 chips, BC9 recovery meter replace the round-1 map in Notebook › Practice › Body &
  recovery ("Body by part", open by default). Round 1's map stays as the `body-record` gallery fixture.
- `bodyViewModel` in `src/body_figure.js` (design, Opus); `renderBodyView` in `src/ui/body_view.js`,
  `styles/body_view.css` and `tests/body_view.test.js` built by a Sonnet subagent to an exact spec and
  reviewed here.
- Cure buttons click the panel's existing command card, so costs, errors and reasons have one source.
  Cures are limited to verbs this panel can run; the first capture showed four foreign "Not available
  here" routes and a duplicate, so the narrowing is a fresh-player fix, not polish.
- Focus returns to the same cure button after a redraw (the minutes tick each game minute).
- Fixture `BODY_VIEW_FIXTURE` in `src/ui/preview/fixtures/body.js` for the character-sheet session.

Round 2 checks (bundle `b1135cf638ad`):
- `node --test tests/body_figure.test.js tests/body_view.test.js`: 12 pass.
- `node scripts/body_figure_browser.cjs` at 1920×1080, fresh origin: chip glow only at Effects full
  (`box-shadow`), none at reduced and off; the drill button at the same offset in all three; no page errors.
- 21 px text set through Settings › Font size: table cells compute to 21 px and wrap without clipping
  (`body-panel-crop-21px.png`).
- Not checked: keyboard focus restore in a real browser (code reading only).

### ACCOUNT FOR NOW

- The Condition panel chips (needs the shell owner), the paper-chart style and the Dock notification wait.
- Gallery shows figure specs only; the body view is a DOM view, so its fixture lives in tests and in the
  game until the gallery gains a hook for non-figure renderers (coordinator).

### LATER / DELEGATE

| Work | Level / effort / done check |
| --- | --- |
| BC8 chips in the Condition panel Body section | Sonnet, small. Done: chips visible in Condition at 1920×1080 with words, effects off identical |
| BHR19 recovery stages and BHR10 cause label on conditions | Sonnet, medium, touches simulation owner. Done: a row shows "pain eased, tissue mending" and "from: grip drill" |
| BC4 wired to the Polyjuice bench through the "Others see" column | Sonnet, small. Done: drinking a canon brew shows the borrowed appearance row with time left |
| BC3 altered-state voice lines | Opus design then Sonnet build, medium. Done: an intoxication fixture shows an attributed voice line and `?` unreliable readings; effects off shows words only |
| BC11 witness-reported body | Opus design, later, after memory lanes |
