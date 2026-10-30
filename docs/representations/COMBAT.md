# Combat and conflict representation (proposals, 2026-10-30)

Owner of how fights, chases and other conflicts are shown (RPX16, LTU7 in
[UI design core audit](../audits/UI_DESIGN_CORE_AUDIT.md)). Behavior rules stay in
[DOMAIN_RULES](../DOMAIN_RULES.md) CBR1-CBR30; this doc only decides display. Everything here
is a proposal (AD32) until Weibao accepts it by name.

Applies: UR11 (log column intact), UR35 (inspection free, actions explicit), UR36 (known,
unknown and unavailable kept distinct), UR37 (no fact in color alone), UR40 (a chance names both
sides; ratings are not chances), UR52 (nothing moves under a pending click), CBR13-CBR14 (learned
opponent facts), LSD91, LSD294, LSD384, proposed UR76 (home named before building).

## Reading (PRF1)

Show a fight as a situation a fighter would read: who is in it, what can down you, your odds in
words, the pace, and what each opponent means to do. Premises: 1920x1080 desktop; native combat
exists with an observer-safe opponent projection (`combat-opponents`, schema 1); the parity shell
already gives the opponents their own Opponent and Opponents panels; Weibao plays.

## Player sentence (PRF2)

When it works: "Infested field: 1 of 1 opponent standing; you have 54 of 60 hp. Odds: you hit
usually (90%); the wolf rat hits you rarely (22%). Tempo: you strike about 1.2 times for each of
its blows. Intent: no windups read yet." When it cannot say something, it says so in place:
"Odds: not shown as chances with 4 opponents", "??? hp", "target unread".

## Options weighed

| Code | Representation | Good at | Weak at | Verdict |
|---|---|---|---|---|
| O1 | **Situation card**: text lines first (lethal, odds, tempo, intent), one action row, then a radial figure with you at the centre, opponents on a ring and a strike edge from each | Multi-party fights; everything LSD91 asks for in one place; works on today's data | Positions are only "in this fight" until range exists | **Default** |
| O2 | **Tempo track**: each fighter's next strike on a shared time line | Duels where speed decides; idle watching | Needs per-tick redraw (UR52 risk); hides lethal and odds | Folded into O1 as one text line; a live track is a dial |
| O3 | **Chase distance track**: steps from caught to lost | Chases, pursuits, escapes (CBR25) | The pursuit model has stages, not distance | Shipped as a stage track; distance waits for range data |
| O4 | **Unusual: the fight as a bookmaker's slip**: no drawing at all, a short betting-style sheet ("you to win: likely; to be downed this exchange: 1 in 5; to get away clean: fair") | Very fast to read; text-native; good for away summaries and the "as the lead would" button (LSD93) | Needs an outcome model the game does not have; invites invented numbers | Kept as a palette entry for away reports once CBR2 outcomes carry odds |
| O5 | **Initiative clock**: each fighter's attack cycle as a hand on a dial; whoever nears the top strikes next | Very legible tempo; pretty | Same redraw cost as O2; more chrome than facts | Palette only |

## Default, dials and reasons

- **D1 Default: O1 situation card.** Reason: a fighter reads the whole situation before the
  details, and the card puts the facts that change a decision (can this down me, do I land, who is
  faster, what is coming) in words above the drawing. The drawing is the cast list.
- **D2 Ring meaning.** Default: the ring is "who is in this fight", labelled "(no range data)".
  Dial: a world or fight that models range bands (duels at reach, ships, sieges) places markers by
  band and the label changes. Reason: native combat has no positions; drawing distance would
  invent a fact.
- **D3 Odds.** Default: chances in words with the native number, one on one only, naming both
  sides (UR40). With several opponents the line says chances are not shown and why. Dial: a world
  with an appraisal skill may show estimated chances marked "~". Reason: the native group view
  gives attack and evasion ratings, which are not chances.
- **D4 Lethal telegraph.** Default: a stated bound: an opponent's hardest ordinary roll (1.2x shown
  attack, per strike) after your own defense layers, crits excluded, marked `!` with the word
  "Lethal" or "Heavy". A group line adds the assessed opponents' blows and says "at least" when
  one is unassessed. Dial: harsher worlds may add crit risk; a perception source may telegraph
  earlier (LSD384). Reason: a fair death is one the player could have seen coming, and the bound
  never claims more than the shown numbers support.
- **D5 Intent.** Default: "no windups read yet; unassessed" for every opponent. Dial: once CBR14
  learned intent exists, the strike edge carries it ("draws back to swing") at the observer's
  perception. Reason: nothing in native combat produces intent; guessing it from speed would be a
  hidden-stat leak dressed as insight.
- **D6 Targets.** Default: with you alone on your side, each standing opponent's edge reads
  "strikes" (native behavior: it can only strike you). With allies, edges read "target unread".
- **D7 Tempo.** Default: one text line from shown speeds. Dial: O2 or O5 as a live view when a
  world makes timing a decision (rhythm combat, spellcasting windows).
- **D8 Chase.** Default: stages from `pursuitView` (following, contact, face to face, over) with
  "Distance: not modelled here". Dial: distance steps when a pursuit carries range.

Known and unknown stay distinct (UR36): an opponent with unknown knowledge draws with `?`, shows
`??? hp`, and contributes nothing to lethal, odds or tempo even if a hidden value exists.

## Home (proposed UR76 contract)

| Field | Value |
|---|---|
| Home | Here center view during a fight, directly under the Local actions list that holds the leave choice (M15 "fight center mode"). In the parity shell the native `#combat_div` panel is hidden and the opponents have the Opponent and Opponents panels; the card fills the otherwise empty space under the leave choice. No new center mode (proposed UR77) |
| Shape | K5 scene card (header, stakes, lines, one option) plus the MDL2 figure with its text form |
| Empty | Hidden when there is no fight or Local actions is hidden (another center mode) |
| Unknown | `?` mark, `??? hp`, "unassessed", "not shown as chances" |
| Action | "Withdraw: Go back to [place] [time]" presses the native leave choice through its own guards; blocked with a reason when no leave choice is shown |
| Log | Untouched; the Reports column keeps full height (UR11) |
| Seat | Reads only the observer-safe projection and the controlled fighter's own readout (AD8, LSD226) |

## Receipt (2026-10-30)

Files:
- `src/ui/combat_situation.js`: leaf adapter, board and own numbers to figure spec; chase stage adapter.
- `src/combat_situation_ui.js`: mount and render on text change only (400 ms check, no rebuild when unchanged).
- `src/ui/combat_display.js`: one import and one mount line beside `registerCombatOpponents`.
- `index.html`: `styles/figure.css` link after `scene_card.css` (figure.css was gallery-only).
- `src/ui/preview/fixtures/combat.js`: duel, brawl and chase fixtures through the same adapter; registers itself.
- `src/ui/preview/figure_gallery.js`: one line, `import './fixtures/combat.js';`.
- `tests/combat_situation.test.js`, `scripts/combat_situation_browser.cjs`, evidence in `evidence/combat/`.

Change surface (FND2): no core-owner file touched beyond the two registration lines above;
`main.js` untouched; new cycle edges: none (`check:arch`); no save slice.

Checks:
- `node --test tests/combat_situation.test.js`: 10 pass (odds one on one only, ratings never become
  chances, intent unassessed, lethal bound arithmetic, unknown facts never leak, allies make
  targets unread, lower-bound group line, real projection path, chase stages, fixtures valid).
- `npm run build`: bundle `v0.6-a947c6cd1d2f`. `npm run build:figures`: gallery bundle, `gameCore: false`.
- `node scripts/combat_situation_browser.cjs` (headless, 1920x1080, fresh origin): PASS twice.
  Route: fresh life, Village Elder lines, Infested field (earned steps). The card shows with its
  text form; it does not rebuild across a second with no change; Withdraw left the field through
  the native choice; the card hid afterwards; the log column stayed 987 px tall. Only 404s were
  the private font files absent from this checkout. Evidence: `evidence/combat/fight-1920x1080.png`,
  `fight-card.png`, `gallery-*.png`, `journey.json`.
- `npm run check:arch`: PASS (no new cycle edges; main.js untouched). `npm run check:rules`: PASS (5 existing warnings).
- Full `npm test`: 4111 pass, 11 fail, 3 cancelled of 4127. Two failures need the private
  `docs/research/novels` folder, absent from this worktree. Nine are `cast_*` live-integration
  workers killed at their 160 s timeout while the machine's load average was 100-220 (sibling
  suites running). An A/B run of `cast_body_adapter` with this slice's mount disabled failed the
  same way, so they are not caused by this change. Gap: not rerun on a quiet machine.

AD43 floor: FLR1 bundle named; FLR2 route from a fresh life by earned steps plus named fixtures
`fight-duel`, `fight-brawl`, `chase-fixture.tollman`; FLR3 the card states what each line means and
says when it cannot; FLR4 the Withdraw row drives the existing native leave choice; FLR5 not
applicable (derived view, never saved); FLR6 agent-verified, not human-reviewed. State: done at
the floor for the native fight slice. The chase adapter is fixture-only (implemented, below floor
for in-game chase).

Known limits and next slice:
- Next slice: show the chase stage track in the pursuit encounter panel (`pursuit_ui.js`) and a
  duel at a named site, then wire intent once CBR14 learned intent has a source.
- Odds are words on today's native numbers; an appraisal skill should change the number to an
  estimate, not remove it.
- Lethal excludes crits by design; a world with heavy crits should switch the dial on.
- The card sits below the native leave choice, so on a short Local actions list it starts at
  about y 466; the figure is the first thing to drop below the fold, the text lines are not.
