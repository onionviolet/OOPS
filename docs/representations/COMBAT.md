# Combat and conflict representation (proposals, 2026-10-30)

**Next slice (2026-10-30):** the chase stage track in the pursuit encounter panel (`pursuit_ui.js`) and a duel at a named site, from "Known limits and next slice" below; the intent chip waits on CBR14 learned intent.

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
  attack, per strike; native enemy strikes use damage modifier 1) after your own defense layers.
  Each line says what it leaves out: "before crits, armor piercing or element", because the
  attacker's crit, armor piercing, elemental and pledge modifiers are hidden or situational. Only a
  "Lethal" line carries the `!` could-down-you mark; a "Heavy" line (half your hp or more) is plain
  text. A group line adds the assessed opponents' blows and says "at least" when
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
| Action | "Withdraw: Go back to [place] [time]" presses the native leave choice through its own guards; blocked with a reason when no leave choice is shown. It takes the leave branch, never Quick return; during a fight `display.js` lists no onward links, so it cannot step deeper |
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
- `node --test tests/combat_situation.test.js`: 12 pass (odds one on one only, ratings never become
  chances, intent unassessed, lethal bound arithmetic and its stated exclusions, heavy lines unmarked,
  unknown facts never leak, allies make targets unread, lower-bound group line, real projection
  path, Withdraw never picks Quick return, chase stages, fixtures valid).
- `npm run build`: bundle `v0.6-e20ff4c1a672`. `npm run build:figures`: gallery bundle, `gameCore: false`.
- `node scripts/combat_situation_browser.cjs` (headless, 1920x1080, fresh origin): PASS twice.
  Route: fresh life, Village Elder lines, Infested field (earned steps). The card shows with its
  text form; over live ticks the hp and lines change while the Withdraw button stays the same DOM
  node (the card is built once per fight and leave choice; only stakes, lines and drawing update,
  UR52); Withdraw left the field through
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

## Round 2 (2026-10-30): review, restructure and next steps

Brief: [ROUND2_BRIEF](../gm/dispatch/ui-refactor-wave-2026-10-29/ROUND2_BRIEF.md) items 1-21.
Everything here, round 1 included, is a draft and the current best, open to refactor or
replacement with a reason (AD45). Codes R2-xx are new; round 1 codes O1-O5 and D1-D8 keep their
meaning.

### How other games do it (item 1)

Patterns are adapted, not looks or content. "Known" is from play or public docs; "inferred" is
reasoning about why it works.

| Code | Game | What the player sees | Makes easy | Costs | Idea taken |
|---|---|---|---|---|---|
| R2-G1 | Slay the Spire | An intent icon and number above each enemy: attack and damage, block, buff, unknown (known) | Planning the next turn at a glance; the threat is on the enemy, not in a log | Needs a real intent model; icons need learning (inferred) | **Intent chip on each opponent card**, with an honest "Intent unread" until CBR14 supplies intent |
| R2-G2 | Into the Breach | Every enemy's next attack drawn on the board as tiles and arrows, with exact damage (known) | Perfect-information puzzles; no surprise deaths | Only works with full enemy knowledge (inferred) | **Telegraph before lethal**, shown as a bound we can honestly state, never a guess |
| R2-G3 | Darkest Dungeon | Heroes and enemies in two facing rows of ranked positions; stress bars; affliction pop-ups (known) | Who is in front, who can be hit, how close to breaking (inferred) | Positions only matter when skills read them | **Two facing sides as the layout**; morale and stress later as a ladder when modelled |
| R2-G4 | Melvor Idle; Proto23 | Player and enemy panels side by side with attack bars, hit chances and a scrolling combat log (known) | Idle watching; numbers players expect (UR12) | Text-heavy; little sense of danger (inferred) | **Keep the native panels and full log**; the situation card adds readings, not a second stat block |
| R2-G5 | Battle Brothers | Per-unit morale states (confident, steady, wavering, breaking, fleeing) shown as icons and words (known) | Reading who is about to break or rout | Needs a morale model | **Stage ladders in words** (threat now; morale and wounds when modelled) |
| R2-G6 | Our own: Proto23 mirror (PX10, RP4) and opponent board (R20-R22) | You against the current opponent in two equal panels; list plus inspector for several (known, in repo) | Comparison | Two panels already used | **Do not duplicate raw stats**; the card only adds what the panels cannot say |

### Restructure (items 18, 21)

- **R2-S1 Versus row replaces the ring as the default form. ACT NOW.** A ring around "you" implies
  positions we do not model, and it spends a 380-560 px drawing on "who is here". Two facing sides
  (your side, then one card per opponent) answer the same question in a quarter of the space and
  give each opponent a home for its chips. The radial figure stays as the gallery alternative and
  for later crowd fights (many fighters, no ranks), where a ring scales better than a card grid.
- **R2-S2 Split by question.** The Opponent and Opponents panels answer "what are its stats"; the
  situation card answers "what does that mean for me". The card shows only derived readings
  (threat, odds in words, intent, target, tempo), never raw stats twice.
- Forms per part: sides as **cards** (things you act on and compare); threat, odds and intent as
  **chips** (one value at a glance); tempo and the together line as **plain prose**; a chase as a
  **track** (ordered stages); a duel's back-and-forth later as a short **timeline** of exchanges.
  Circles fit worse for all of these: no cycle and no placed components.

### Fresh-player test (item 2)

Route: fresh life, Village Elder lines, Infested field. Findings and fixes:
- R2-F1 "unassessed", "ordinary blow", "no range data" are developer words. **Fixed:** "you have
  not sized this opponent up yet", "hardest normal hit", the ring label is now "In this fight".
- R2-F2 The lethal line was one long sentence. **Fixed:** it leads with "Could down you:" and the
  exclusions are a separate short sentence ("Crits, armor piercing or elements can add more.").
- R2-F3 "Odds: not shown as chances with 4 opponents" read as a bug. **Fixed:** "no hit chances in a
  fight with 4 opponents, only attack and evasion ratings, which are not chances."
- R2-F4 Numbers without meaning: the threat chip now carries a word stage (Light, Heavy, Could down
  you, Not sized up, Down) before any number.
- Left open: "Tempo" is a game word; acceptable with its sentence beside it.

### Space and density at 1920×1080 (item 3)

- Glance: the versus row (one line per side, chips). Looked at every few seconds, so compact.
- Detail one click away: the Opponent panel's facts (existing), the card's text form (in the card).
- The row sits in the Here view under the leave choice, where round 1 found about 570 px of empty
  height during a fight; the cards use the width instead of the ring's square.

### Small signals, flourish, pop-outs, cheats (items 4-6, 13)

- R2-B1 Threat chip and hp bar are the bars here; words beside every colour (UR37).
- R2-B2 Flourish: the lethal chip uses the existing `fig-fx--pulse` class, so effects off and
  reduced switch it off (UR38). Hit flashes stay with the native fighter rows. ACCOUNT FOR NOW: a
  one-shot settle glow on a card when its threat stage changes (bind to the change, not the tick).
- R2-P1 No pop-out for the card (it belongs beside the leave choice). LATER: a detachable combat
  feed (NB8) belongs to the log owner. An Electron notification when away combat stops on a
  lethal risk (CBR27) is the right desktop hook; owner: time and chronicle digest.
- R2-C1 Cheats: an insight or appraisal cheat fills the intent and hidden-stat chips with a marked
  source glyph ("◈ insight: winds up a heavy swing"), read through `observerView`; enemy cheats show
  only as observed effects (CS7). Sealed secrets stay in their route. LATER (sonnet, M, done when a
  fixture cheat fills the intent chip with a marked source and a test proves no unmarked reveal).

### Alternative style (item 7)

The gallery shows the versus row (default) beside the round 1 radial figure (alternative), both in
Luminous Gothic and Neutral. The row reads better at 14 px and 21 px because it is text with chips;
the ring's labels crowd past four opponents.

### Use what we have (item 8)

Reused: `opponent_board.js` projection, `combat_readout.js`, `combat_math.js`, `scene_card.js`
(header, stakes, option row), `figure.js` (marks, pulse class, alternative view), the native leave
choice. New: one renderer, `src/ui/combat_versus.js`, with one consumer today. Proposed UR79 wants
two consumers for a new primitive: the second is the planned debate and negotiation card (CBR30),
which has the same sides-and-chips shape. Until then it is a combat-local renderer, not a shared
primitive.

### Unconventional option (item 9)

R2-U1 **The fight reads the room.** Instead of a meter, the place's prose line changes with the
fight's state ("The field goes quiet but for the rat's breathing" when you are winning, "Your vision
narrows" when a lethal line is up), drawn from threat and hp stages, in the Here header. Diegetic,
cheap in data (a few lines per world and stage), and it makes danger felt without a number. Needs
a prose table per world and a rule that it never replaces the factual chip. Worth a later slice
(sonnet, S, done when three stages swap the header line in a fixture fight and effects-off keeps
the chips).

### Levels and depth (item 19)

Shown now: threat stages (Light, Heavy, Could down you, Not sized up, Down); odds word ladder
(almost never to almost always, seven steps). ACCOUNT FOR NOW in the model shape: `intent` is an
object with `known`, so learned intent adds a word and a source without a shape change. LATER
(each a row in the model, not new code): morale stages (steady, shaken, wavering, breaking, fleeing,
CBR12 yielding and fleeing means); wound severity per BHR (graze, wound, maimed, critical) on your
side and theirs; appraisal grade on each card (how well you have sized it up, CBR14).

### Reports and center (item 14)

The log column is untouched (UR11). Proposal for the Reports owner (time and chronicle), not built:
one grouped fight line at the end, subject first: "⚔ Wolf rat driven off · 14 exchanges · you took
18 · closest call 9 hp", expandable to the exchanges, linking to the place. Center density: the card
puts the action (Withdraw) and four short lines first, cards second, no prose paragraph.

### Folding into existing UI (item 16)

No panel moved. The card lives in the Here view; the native `#combat_div` stays hidden in the
parity shell as it already is. Larger proposal for the coordinator: when a fight starts, the Here
tab's label could read "Here · fighting" so the player knows where the card is (UR13).

### Later volumes and worlds (item 17)

Checked against the model, not canon: larger casts (the row wraps into a grid; past about eight
opponents the ring alternative or grouped cards by kind, as the opponent board already groups);
new power kinds (a threat stage can come from any damage source the readout exposes); duels with
rules (a duel adds a "terms" line to the scene card); non-violent conflict (CBR30: debate,
negotiation and trial reuse the same sides-and-chips shape with "position" instead of hp). Open:
mass battles and sieges (a map form, owner: maps), and the lead's later sequences where opponents
outclass the player by tiers (needs appraisal grade to say "far beyond you" honestly).

### Flair later (item 20)

Specs name roles, not looks: `threat`, `intent`, `odds`, `target`, `down`, `you`. In a gaslit
city-mystery world the cards could be calling-card stock with a wax-seal threat mark and intent as
a handwritten aside; in a cultivation world the sides could face across a scroll with threat as
qi-pressure brush strokes. Neither touches the adapter or the text form.

### Audit gaps (item 10)

- Other seats: the card reads the controlled actor's own readout and the observer-safe projection,
  so a weaker or less knowing seat sees less, never more. Not yet exercised on a non-lead seat.
- Empty and error states: no fight hides the card; no leave choice blocks Withdraw with a reason.
- Performance: the card rebuilds only on a text change; DOM nodes per opponent about 12.
- Accessibility: chips are text; Withdraw is a real button; at 21 px the cards wrap. Keyboard order
  is header, Withdraw, cards. Not yet exercised at 21 px in the browser (gap).
- Persistence: none (derived view).

### Hit location (proposals, 2026-10-30)

Direction: [Injuries: overall HP plus part damage where it matters](../USER_VISION.md#injuries-overall-hp-plus-part-damage-where-it-matters-2026-10-30).
HP stays the overall pool. A part is recorded only when something reads it, and combat reads it first.
Detail is a per-world and per-body dial (BHR2, BHR4). Codes HL1-HL6 are proposals (AD32).

- **HL1 Where a hit lands.** Default: the location comes from the attack's intent (a swing, a lunge, a
  bite) weighted by the attacker's skill. Unskilled hits land where they can; skilled ones land where
  they mean to. Aimed attacks are explicit options on the fight card, each with its cost and odds
  quoted before the click (UR40, SUI6). For example: "Aim at the legs: stops a flight · hit sometimes
  (31%) instead of usually (78%) · slower swing", or "Aim at the hand: may disarm". Dial: a world may
  let some fighters aim freely, or forbid aiming for a body kind with no parts to aim at.
  Reason: an aimed blow trades accuracy and tempo for a specific outcome, and the player should see
  that trade before choosing it.
- **HL2 Armour by slot.** Equipment already carries slots such as [legs]. Coverage decides what a hit on
  a part soaks, so an unarmoured arm under a good breastplate is a real weakness. The fight card's
  lethal bound uses the defense of the part likely to be hit once locations exist, and the overall
  defense until then. Reason: armour that protects everywhere at once makes slots decoration.
- **HL3 Words in the log and on the card.** The log line names the part, subject first (RPT3):
  "Wolf rat bites your left leg for 4, limping", grouped like the other combat lines; the log column
  stays intact (UR11). On the versus row, impaired parts are known facts on both sides (UR36): a chip
  such as "Left leg: limping" on your side, and "Right arm: hanging" on an opponent card once you have
  seen it. Parts you have not observed on an opponent stay absent; they are never shown as unhurt.
- **HL4 Idle fights stay idle.** Auto-combat chooses targets through a policy row (K8): condition, then
  aim, then what it costs and when it stops. For example "If it flees, aim at the legs (slower swing) ·
  stop when it is down". With no policy, hits fall where intent and skill put them, and nothing asks
  the player mid-fight (AD16, CBR26).
- **HL5 One harm record.** Part damage, its stages and recovery belong to the sonnet wave's sw-death
  lane (L9, `src/harm_state.js`, `parts:{<partId>:{rung,cause?}}`). The combat adapter reads parts from there and adds no part model of its own. Fields the
  card will need, proposed to L9 rather than built here: `part` (id and words), `stage` (a word such
  as bruised, limping, useless or lost), `observedBy` (who has seen it, for HL3), `impairs` (the verbs
  or control numbers it lowers, CBR22) and `lasting` (whether recovery is permanent, for HL6).
- **HL5a Write side: which attack writes which part and rung** (answers the L9 lane; the harm record
  is `parts:{<partId>:{rung,cause?}}` in the `harm` slice, `src/harm_state.js`). One writer: the
  native strike path in `src/models/combat.js`, after `takeDamage` settles the HP loss, calls one L9
  command (proposed name `harmPart(state, {partId, rung, cause})`); the combat card never writes.
  - Which part: the HL1 location roll. A world row lists the tracked `partIds`; a hit on an untracked
    part writes nothing and stays plain HP loss.
  - Which rung: from the share of the part's soak the hit exceeded, after HL2 slot armour. Default
    ladder per part (L9's words): a hit under about a quarter of current HP writes nothing, a quarter
    writes `bruised`, half writes `wounded`, a crit past the slot armour at half or more writes
    `maimed`. A part only moves up a rung, never down, until recovery (`healPart`).
  - Which attacks: ordinary strikes by their intent (a bite and a claw land on limbs; a swing on arms,
    torso and head); aimed attacks (HL1) write their named part; a crit raises the rung by one;
    blunt weapons cap at `wounded` unless the world says bones break. Enemy attacks on the player
    and the player's attacks on opponents use the same path, so opponent parts exist when tracked.
  - `cause` is the attacker's name and attack word ("wolf rat bite"), for the log line (HL3) and the
    body panel.
- **HL5b Read side.** The adapter `src/ui/combat_situation.js` takes a `parts` input read once per
  render from `harmView(save).parts` for your side (the combat UI module passes it in; the adapter
  stays a leaf with no save read). Opponent parts arrive through the opponent projection as observed
  facts only (HL3), never from the harm slice directly, so an unseen injury cannot leak.

#### Injuries shift odds by degree (Weibao clarified the same night, 2026-10-30)

Injuries mostly shift odds and strength by degree; only the extreme rung gates (L9 `actionGate`).

- **HL7 What shifts.** A damaged hand: lower hit odds, weaker blows (a cut tendon hits weaker), and its
  strikes are easier to dodge. A hurt leg: lower speed and evasion. A hurt eye: lower precision at
  range. The source is L9 (adopted in b8da5ec4a; parts and modifiers land in L9 slice 2 with this
  consumer): `actionModifiers(save, actionClass)` returns per-axis entries `[{axis, mult|add, cause}]`,
  combined across every applying part and backlash (the worst does not simply win). Combat calls it
  for four axes: `accuracy` (your hit odds), `force` (blow strength), `speed` (attack rate) and
  `evasion` (their hit odds against you). `actionGate` stays only for hard stops (backlash `lost`, an
  extreme part rung), which disable the option with the stage word as the reason. The native strike
  path applies the same entries to its rolls, so the quote and the outcome agree; the adapter only
  reads and words them. Treatment and training reduce the entries through L9's recovery function.
- **HL8 The quote shows the shift and its cause.** Odds on the card and on an aimed-attack option carry
  the adjustment and each entry's `cause` verbatim: "You hit usually 62% (−8%, injured right hand)",
  "Blows weaker (×0.8, cut tendon)", "Slower (×0.9, limping left leg)" (UR40, UR71). With several
  entries on one axis the glance shows the net and the largest cause ("−14%, injured right hand and
  1 more"); the full breakdown (base, each entry with its cause, stance, armour) is one hover away on
  the chip. Model change when it lands: `versus.you.mods` and `odds.shift` carry `[{axis, delta, cause}]`.
  The threat chip's bound uses the shifted numbers on both sides.
- **HL9 What reduces a penalty.** Switching to the off hand (its own skill), a splint or bandage (care
  items with a stated reduction), and trained one-handed technique each reduce the factor, each named
  in the breakdown. Pain fades faster than damage: L9 keeps the two apart, so a bandaged hand stops
  hurting before it is healed, and the quote shows what is left.
- **HL10 Opponents read injuries too.** A visible limp is a tell for both sides: an opponent with
  perception favours your injured side, and you get "Aim at its injured leg" as an option once you
  have seen the limp. The player sees an opponent's injury only as a known fact (UR36): "limping,
  seen" on its card; unseen injuries are absent, not shown as healthy.
- **HL11 Masking at a cost.** Adrenaline or a stance can suppress a penalty briefly, shown as
  "Masked by adrenaline (about 2 min), then +1 rung of fatigue", with the later cost quoted before
  the stance is chosen (SUI6). The masked factor still appears in the hover breakdown, struck through,
  so the player knows it is coming back.
- **HL6 Telegraph before crippling or lethal.** Before a hit that can leave lasting harm, or a part at
  its last stage before loss, the card shows the risk and a retreat route first (LSD384, BHR11, CBR23).
  For example: "! Could cripple your right hand: it is already useless, and the next hit there may
  sever it · Withdraw". This extends today's "Could down you" chip with a "Could cripple" stage, and
  uses the same stated-bound honesty: it names what it cannot see.

### Switch-over to the sonnet wave's owners (coordinator, 2026-10-30)

Combat views read the shared models rather than one of their own
([sonnet wave plan](../gm/dispatch/sonnet-wave-2026-10-30/PLAN.md), lanes L9 and L10). Every switch
lands in the pure adapter `src/ui/combat_situation.js`; the renderer and the text form keep their shape.

| Reading today | Source today | Switches to | Where in the adapter |
|---|---|---|---|
| Threat stage (Light, Heavy, Could down you) and the lethal bound | Shown attack, own defense, `mitigateCombatDamage` | L9 harm ladder (sw-death: harm, backlash, death; LSD34, LSD283): "could down you" becomes the ladder rung the hit reaches (hurt, downed, maimed, dead) | `hardestBlow` and the `lethal` list; `versus.opponents[].threat` gains a `rung` |
| "Down" for a beaten opponent | `defeated` in the opponent projection | L9 typed outcome (CBR2, CBR5: unconscious, yielded, fled, dead) | `threat.level === 'down'` becomes the outcome word |
| Intent chip ("Intent unread") | Nothing; no source | L10 typed ability record (sw-adv, GM26): an opponent's known abilities and readied ability, read through the observer's appraisal (CBR14) | `versus.opponents[].intent` (already `{known, word}`; adds `source`) |
| Your own side | Native fighter readout | L10 typed abilities for your actions; a later "use ability" option row in the scene card | `versus.you` gains `abilities` |

Until those lanes land, the adapter keeps today's sources, and the doc's D4 and D5 dials stand.
Neither lane is consumed yet; no code was changed for this note.

### Round 2 receipt

Delegation: one Sonnet subagent built `src/ui/combat_versus.js`, `styles/combat_versus.css`,
`tests/combat_versus.test.js` and the gallery section against the `versus` model contract I wrote;
I reviewed the diff and replaced its workaround for the UI contract's foreign-host rule with a reviewed
allowlist entry (gallery-only fixture, reason recorded). No other session started.

Files this round: `src/ui/combat_situation.js` (versus model, plainer wording), `src/combat_situation_ui.js`
(versus row in game, lines only for what chips cannot carry), `src/ui/combat_versus.js`, `styles/combat_versus.css`
(tokens only; linked in `index.html` and `figure-gallery.html` after figure.css), `src/ui/preview/fixtures/combat.js`
(versus gallery section), `tests/combat_versus.test.js`, `tests/combat_situation.test.js`,
`tests/ui_contract_allowlist.json` (one entry), `scripts/combat_situation_browser.cjs`, evidence.

Checks:
- `node --test tests/combat_versus.test.js tests/combat_situation.test.js tests/ui_contract.test.js`: 24 pass.
- `npm run build`: bundle `v0.6-01428795c89a`; `npm run build:figures`: `gameCore: false`.
- `node scripts/combat_situation_browser.cjs` (headless 1920x1080, fresh life, earned route): PASS. The card
  is now 297 px tall (846 px in round 1); the Withdraw button survives live hp changes; Withdraw leaves;
  the log column is 987 px. Evidence: `fight-1920x1080.png`, `fight-card.png`, `gallery-versus-row.png`,
  `gallery-versus-row-effects-off.png`, `journey.json`.
- `check:arch` PASS (no new cycles), `check:rules` PASS.
- Full `npm test` on `a2a56e01f`: killed by an outside signal (exit 144) after 2,990 of about 4,127
  tests, at load average 140-185. Of those, 2,981 passed and 9 failed: the same `cast_*` live-integration
  workers timing out as in round 1 (A/B-checked then as not caused by this slice). No new failure.
  The rest of the suite was not reached (gap). The round 1 run was stopped once round 2 edits began,
  because it would have tested mixed code.

Gaps: 21 px text not verified (the gallery page does not scale with the root font size; the in-game
text-size setting was not exercised); non-lead seat not exercised; the threat-change settle glow
(R2-B2) and the Reports fight line (item 14) are proposals only.

AD43 floor: unchanged from round 1 (bundle named, earned route, shown with text, Withdraw consumer,
no persistence, agent-verified, not human-reviewed); done at the floor for the native fight slice.

COV15 wiring (2026-10-30, view side): the Encounters and pursuit panel (`src/pursuit_ui.js`, Notebook, People) now draws `chaseSituation` through `withPursuitRange` for each open case. The range track draws only from the meeting request's place once the pursuer has made contact (route minutes by the policy's own routes, place ids are the place names); before contact the figure says "you have not seen where they are". Missing input: a seen-or-sensed sighting fact for the pursuer's place (the pursuer's true position and the pursuit's lead are private and are not used). A closed case draws no figure. Proof: `evidence/cov15/chase_browser.cjs` (generated field-member save, DEV SEEDED as `scripts/o2b_pursuit_browser.cjs`, begin the trail test, wait for contact) with `chase-contact-*.png` and `chase-result.json`; gallery fixtures `fx-chase-range` and `fx-chase-unseen`. AD43 floor: FLR1 bundle rebuilt; FLR2 below floor (the panel needs field membership, so the route is a seeded save, not a fresh life); FLR3 shown with a text form; FLR4 used by the panel; FLR5 no persistence change; FLR6 agent-verified, not human-reviewed. Implemented, below floor on FLR2.

## Round 3 (2026-10-30): one fight surface, damage types in tempo, merge census

Lane `combat-surface` of the [UI identity and combat wave](../gm/dispatch/ui-identity-combat-2026-10-30/PLAN.md)
(M1, M2, M6, M7, M9). Weibao's words: [USER_VISION](../USER_VISION.md#ui-identity-per-world-basics-and-combat-surfaces-2026-10-30).
Everything here is a proposal (AD32). Codes R3-xx are new.

### Forms weighed for one fight surface (M2)

| Code | Form | Good at | Weak at | Verdict |
|---|---|---|---|---|
| R3-O1 | **One surface, two modes.** A shared header (versus row with threat, type and odds chips), one log, one move area. The native auto-fight and the tempo contest are modes of it, chosen per world and encounter (AD46). One read model: the `fightSituation` adapter takes either the native opponent board or a tempo board. | One place to read any fight in any world; damage types shown once; a world picks its mode without a second UI | The native mode's move area holds only Withdraw (it is an auto-fight), so the two modes look different in the lower half | **Default** |
| R3-O2 | **Two surfaces sharing parts.** Native card and tempo panel stay separate; both reuse `combat_versus.js` and a shared log-row renderer. | Cheapest; no mode switch to design | Keeps the drift this round is meant to end: two homes, two wordings, types shown twice in two ways | Rejected: the census below would keep a "native vs tempo" row forever |
| R3-O3 | **Unusual: one engine.** Native auto-fight becomes the tempo engine under an auto policy (`driveTempoFight` with `steady`), so there is one engine and one surface by construction. | Truly one fight model; replays and types in one place | Changes native timing, the three legacy replays and every Proto23 balance number; the plan says combine presentation, not engines (M2) | Palette: revisit when a world wants native fights to pause for orders |
| R3-O4 | **Unusual: the fight as a ledger.** No cards; each exchange is a ledger row (who, move, type split, harm, what you learned), with a running total line at the top. | Very honest; shows types and learning naturally; text-native | Weak at "who is still standing" at a glance; long fights scroll | Folded in: the log uses this row shape for typed hits |

Why R3-O1: the player asks the same questions in both modes (who is here, what can down me, what
does my blow do to it), so the answers should sit in one place with one wording. The modes differ
only in who chooses the next move, which is exactly the move area. A world declares its default
mode; an encounter can override it with an in-world reason (a formal duel is move by move, a
brawl in the rat field runs on its own).

What is built (first slice): the Fight card (`#fight_situation`, under Local actions) has a mode. In tempo
mode it reads the `tempo_fight` projection and plays moves through that domain's `move` command; in auto
mode it reads the native opponent projection as before. Today the encounter picks the mode (the road
contest offers tempo; field fights run native). A per-world default mode is a dial not yet wired (later:
a row per world family, read through the same `data-world-family` hook as DESIGN.md DSG11). The tempo
`<details>` panel keeps only the start offer and a pointer while a contest is open.

### Damage types in tempo fights (M1, M6)

- The frame stays structural: `conflict_frame.js` gets no harm step. The tempo definition's strike
  calls `typedHit` in `damage_types.js` (sibling of `typedStrike`, same math, no draws) and passes the
  multiplier as the fifth argument of `mitigateCombatDamageFromStats`.
- Tempo fighters are saved data, not live actors, so `typeSnapshot(actor)` reads the live hero,
  rival or ally once at the start of the fight and stores `profile.types = {attack, defense}`.
  **Compatibility decision:** an open fight saved before this change has no `profile.types` and reads
  as untyped physical with no modifiers, which is the old math. No migration.
- Native fights are typed once, in `models/combat.js` through `takeDamage(type_multiplier)`. The tempo
  path does not call `typedStrike`, and the native path does not call `typedHit`, so no hit is typed twice.
- The three legacy frame battles (road duel, party, sluice) do not opt in; their saved replay contract
  stays identical (`tests/conflict_frame.test.js`).
- Per-world names (M6): `damage_types.js` holds a world table of display names and glyphs. A world
  declares rows for the types it uses and may add its own type ids (a curse, mystical harm); an
  undeclared world shows physical plus the effect_dsl types under their plain names. Nothing is saved.

### What the surface shows about types

- On moves: the attack mix ("slashing 70% · piercing 30%").
- In the log: what was dealt by type and whether it bit ("hit Mara for 4.2 slashing, resisted").
- On opponents: resistances you have learned by sizing them up in this fight (a typed hit that was
  resisted or found a weak spot teaches that row). A cheat that reveals them shows every row with the
  marked source glyph (R2-C1); nothing unmarked is ever revealed.
- Dev readout (M7): with dev view on, each typed hit adds a line with the per-type split and the multiplier.

### Merge census (M9)

One row per old/new pair that drifts. Verdicts are proposals.

| Code | Pair | Evidence | Proposal |
|---|---|---|---|
| R3-C1 | Native auto-fight (`models/combat.js`, `ui/combat_display.js`, `combat_situation_ui.js`) vs tempo contest (`tempo_fight*.js`, its `<details>` panel) | Two homes, two logs, types only on the native side | **Merge presentation** into R3-O1; keep both engines |
| R3-C2 | Pursuit stages (`pursuit.js`, `pursuit_ui.js`) vs chase stage track (`chaseSituation`, fixture only) vs a tempo chase (not built) | Since COV15 (2026-10-30), `pursuit_ui.js` draws `chaseSituation` with a range track for each open case; no tempo chase exists | **Merged** for stages and range (COV15). A tempo chase, when built, is a mode of the fight surface, not a third chase UI |
| R3-C3 | `away_ledger.js` vs the away bank | `away_bank_domain.js:2` imports `computeAway`; not orphaned | **Keep**: the ledger is the bank's calculator, not a rival |
| R3-C4 | `anchor_snapshots.js` vs live state | Imported only by `tests/anchor_snapshots.test.js` | **Retire or wire**: give it a consumer (world lint in `check:rules`) in the next world pass, else retire with its test |
| R3-C5 | Return digest (`return_digest*.js`, event feed) vs Reports dock (`reports_dock.js`) | Both mounted from `main.js`, both list recent events | **Merge**: the digest's grouped rows become dock rows with the world voice table (M4); one report surface |
| R3-C6 | `Enemy.takeDamage` vs `Person.takeDamage` | Same mitigation call in `enemies.js` and `models/person.js` | **Merge** into one helper so a new layer (types, location) lands once |
| R3-C7 | Inline strike math in `cohort_battle.js` and `causal_story_core.js` | Each repeats roll, mitigation and stamina by hand | **Merge** onto a shared strike step; opt into `typedHit` when they do |
| R3-C8 | Native combat log (`combat_log.js` events) vs tempo log (`b.log`, 12 lines) | Different shapes and wordings for the same hit | **Merge presentation**: one log row shape (R3-O4) in the surface; engine logs stay |
| R3-C9 | `combat_readout.js` vs `combat_opponents_domain.js` | Own exact numbers vs observer-safe projection (AD8) | **Keep**: layered on purpose |
| R3-C10 | Native fight screen: top Opponent panel, Opponents list, Encounter box and the Fight card (reported by the damage-types session from a 1920x1080 River crab fight, 2026-10-30) | Opponent hp in three places, hit chances twice, "Could down you" as a sentence and a chip, the remaining count three times | **Merge**: one home per fact. Done in the card: the threat chip carries the bound and the per-opponent sentence is gone. Unowned, waiting on Weibao's go-ahead: the top Opponent panel stops repeating hp and odds during a fight, the Opponents list becomes one compact row per enemy (hp, attack with type) with details on click, and the Encounter box folds into one header line |

| R3-C11 | Hero panel hp vs the tempo contest's own hp (DESIGN.md DSG11, one home per fact) | During a contest the hero panel shows native vitals (60/60) while the card shows the contest's 55.4/60; the contest writes vitals back only at its end | **Merge** (proposal for `p4-fights`, owner of `tempo_fight*.js`): write the player's contest hp and stamina to the native vitals after each settled move, so every view reads one value. The card already keeps hp only on the versus row |

Other frame users and types:

| Frame user | Harm today | Opt into types? |
|---|---|---|
| `native_battle` (road duel) | `mitigateCombatDamageFromStats`, legacy stream | **No** while legacy: values are part of the saved replay. The tempo contest already stands in for it |
| `party_battle` | Same, legacy | **No** for the same reason; a tempo party contest (Lio) is typed |
| `feature_expansion_battle` (sluice) | Same, legacy, twice (guard check) | **No** until a revision bump with new content that declares types |
| `cast_ability_adapter` | No harm step; commits the ability | **Yes, through the ability**: when an ability deals harm, its effect_dsl damage type feeds `typedHit` |

### Round 3 receipt (checkpoint, 2026-10-30): implemented, below floor

State: **implemented, below floor** (AD43). The tempo engine half and `damage_types.js` belong to two
sessions whose work was still uncommitted on primary at checkpoint: `p4-fights` owns `src/tempo_fight*.js`
and applies this lane's patches itself after its witness and hit-location changes (its choice, option a);
the damage-types session owns `src/damage_types.js` until its commit, then hands it to this lane. So this
checkpoint commits only this lane's paths, and the branch does not build alone until both land.

Not in this commit (kept as patches in the wave's shared notes folder, applied locally for the checks below):
`tempo_fight.patch` (typed strike, learned rows, hit records, tempoView fields), `tempo_fight_domain.patch`
(type snapshots at start, `commands.move`, panel defers to the card), `damage_types_additions.diff`
(`typeSnapshot`, `typedHit`, per-world names with LOTM as the first row, `mixText`).

In this commit: the Fight card's tempo mode (`src/combat_situation_ui.js`), the tempo adapter and type chips
(`src/ui/combat_situation.js`), type and bound chips (`src/ui/combat_versus.js`, `styles/combat_versus.css`),
the M7 fixture (`src/ui/preview/fixtures/combat.js`), Mara's declared types (`src/frontier_campaign.js`, data
read only by the tempo contest), `tests/combat_surface_types.test.js`, `scripts/combat_surface_browser.mjs`,
evidence under `evidence/combat-surface/`.

Checks (all on the worktree with the owners' working files and the three patches applied locally):
- `node --test tests/combat_surface_types.test.js`: 9 pass (typedHit equals typedStrike; untyped saved fight
  keeps the old math; native typed once; frame untouched; world names; tempo chips, reveal marks, dev readout;
  typed tempo engine harm, learned row, split, save and reload).
- `node --test tests/conflict_frame.test.js tests/tempo_fight.test.js tests/damage_types.test.js tests/combat_versus.test.js tests/combat_situation.test.js tests/party_battle.test.js`:
  177 pass, including the three legacy old/runner replays (road, party, sluice).
- `node scripts/combat_surface_browser.mjs` (headless, 1920x1080, fresh origin, DEV SEEDED field fixture as in
  the P4 proof, then real clicks): PASS, bundle `1bc871cfaab9`. Card opens with moves showing their mix; four
  quick strikes log "You hit Mara for 1 bludgeoning, weak spot."; Mara's card gains "weak to bludgeoning"
  (learned); dev readout shows each hit's split; save and reload identical; Export and Import identical; the
  old panel only points to the card after Import; the fight finishes (won) and the card hides.
- Not run: full `npm test`, `npm run build`, `check:arch`, `check:rules` (they wait for the rebased tree).
- "One other path" in the done check is native combat (`models/combat.js` through `takeDamage(type_multiplier)`, which both
  `Enemy` and `Person` forward on primary). No conflict-frame user opts in, per the census above. Today's native check is the
  math plus a one-call source check; after the rebase it should run a real `Enemy.takeDamage` through the owner's `loadNative` helper.

Gaps: native mode not re-proved in the browser this round (the stale-hp report in R3-C10 is unverified; the
card polls every 400 ms, so a screenshot can catch one hit's gap); `data-world-family` comes from the
`ui-identity` lane and was not on this tree, so the LOTM words are covered by the unit test only; no cheat
source reveals types in play yet (the fixture shows the marked form); the hero panel shows native hp during a
tempo contest because the contest applies harm at its end (existing behavior). Agent-verified, not human-reviewed.

Built against the DESIGN.md draft (`ui-identity`, commit 7c2cbf199): DSG11 one home per fact (the tempo summary no
longer repeats hp; R3-C11 names the hero-panel gap); DSG14 type names from the world, owned in `damage_types.js`. Not
done: world-voiced fight report rows in `src/world_report_voice.js` (later, small).

World family: the card reads `data-world-family` for now; once `world_look.js` is on master it should call
`worldFamily(fight world id)` with `currentWorldFamily()` as the fallback (one authority, works headless), as `ui-identity` advised.

Update after rebase (2026-10-30, weekly 89%, stopped at the 86% budget line): rebased onto master 19a48e65d
(damage types committed by their owner, who handed `damage_types.js` to this lane) and fe8f654c4 (P5 tempo). This
lane's additions are now in `damage_types.js` (`typeSnapshot`, `typedHit`, `declareWorldDamageTypes`, `damageTypeLabel`,
`mixText`, the LOTM row). The two tempo patches were regenerated against P5 and sit in the shared notes folder for
`p4-fights` to apply (its choice); the two tempo-engine tests skip with a named reason until `typedHit` is in `tempo_fight.js`.
- With both patches applied locally: `node --test` over combat_surface_types, tempo_fight, tempo_allies, conflict_frame,
  damage_types, combat_situation, combat_versus, party_battle: 197 pass, 0 skipped. Without them (this commit): the two
  tempo tests skip, the rest pass.
- `npm run check:arch`: PASS. `npm run check:rules`: PASS (16 receipts, 0 problems).
- `node scripts/combat_surface_browser.mjs` with the patches: PASS, bundle `9ff850f5dca6`. Reload and Import identical
  except `held` (banked away minutes, 5 to 6 and 5 to 7), which grows on purpose (P5, LSD317).
- Not run: full `npm test` (budget stop; the committer runs it before merge), `npm run build` into `dist/`.

Remaining gate, in order: `p4-fights` applies both patches and commits; rebase; the two skipped tests run; full
`npm test` and `npm run build`; the browser script once more; merge on Weibao's yes. After `ui-identity` merges, read
the world family through `world_look.js`.
