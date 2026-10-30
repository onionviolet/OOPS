# Abilities, powers and advancement ladders: representation

Status: proposals, 2026-10-30. Nothing here is accepted direction. It applies RPX5
(`docs/audits/UI_DESIGN_CORE_AUDIT.md`), ABR1-ABR22 (`docs/ABILITY_RULES.md`, proposed),
UIV6 (known / guessed / unknown, proposed), UR37 (text form) and the proposed UR76
contract (name the home and shape first). Shared pieces: `src/ui/figure.js` (MDL2),
`src/observer_view.js` (MDL9), `src/ascension_paths.js` (ASC1-ASC3).

## What is being shown

Three kinds of thing share the word "ability" here, and each wants a different shape:

| Kind | Examples in the game today | Engine owner |
| --- | --- | --- |
| Advancement ladder | Tingen pathway sequences (Seer and the row-built pathways), Mistglass method tracks, cultivation realms | `ascension_paths.js` `definePath` / `pathView` |
| Held ability rows | LOTM ability rows, HP spells, cheat powers, device abilities | simulation powers, `compileStructuredAbilities` |
| Skills and techniques | Frontier skills ("Methods & practice", `skills_panel`), Rat-step (`technique_panel`) | `techniques.js`, `skill_expansion_*` |

This slice covers the ladder (RPX5). The other two get a default below and a later slice.

## Options weighed

**O1. Vertical ladder with known, rumoured and unknown rungs.** Rungs climb a vertical
track from the entry state. Crossed rungs are done, the current rung carries a fill,
named rungs ahead are pending, rumoured rungs are guessed (dashed, italic, "~"), and
whatever the character cannot name is one "Not yet known" rung. The next crossing is a
second, horizontal track under it. Strength: it is how the in-world institutions teach
these paths (a church counts Sequences down, a sect names its realms in order), so the
shape itself is in-world. It reuses `pathView`, which every ladder already produces.
Weakness: a ladder implies one line; branching or merging paths need the web.

**O2. Skill web.** Held skills and techniques as nodes, edges for "taught by",
"builds on", "combines with". Rendered with the figure's nodes and edges, the player
at the centre, rings for depth of mastery. Strength: lateral worlds (frontier skills,
HP's spell census, Gu combinations) read as a web, not a ladder, and the edges show
why learning one opens another. Weakness: webs leak what is unknown unless pruned hard;
a web of 100 spells is unreadable without filtering (ABM4).

**O3 (unusual). The vessel.** The character's body and spirit as concentric rings
(body, spirit, mind, or a world's own layers); each held source sits as a slot on its
layer, digestion is the slot's fill, strain fills a warning segment of the ring, and
cooldowns are a clock of segments round the slot that empty as it recharges. Strength:
costs, cooldowns, strain and digestion of several sources at once in one glance,
which neither a ladder nor a web shows; it is the honest picture of a cultivator
whose meridians are the actual limit, or a Beyonder holding two potions' worth of
risk. Weakness: it needs a body/spirit model per world and becomes decoration if a
world has no layered self.

Also considered and set aside for now: a playbill of roles (abilities as parts the
character plays, cue cards for acting); a deck of cards for cheat charges. Both are
skins over O1 and O3 rather than new shapes.

## Default, dial and reason

- **Default: O1 for every advancement ladder**, drawn by `src/ability_ladder_figure.js`
  from `pathView`. Reason: every world with sequences, realms or ranks already declares a
  `definePath` descriptor, and the ladder is the in-world teaching shape.
- **Dial: O2 for lateral skill sets** (frontier skills, HP spells, Gu) once a world holds
  more than a handful of rows that build on each other; until then the existing list rows.
  Reason: the web earns its place only when the edges carry real prerequisites.
- **Dial: O3 for worlds whose limit is the body** (meridian cultivation, potion load and
  loss of control), shown in the You panel's body view, not the ladder's home. Reason: it
  shows simultaneous load, which is the decision there.

## Digestion and mastery as fill

- The current rung's fill is progress on the next stage's counted crossing (`digest`
  or `quota`): acts performed, practice hours. `rungFill(view)` reads it; nothing new is saved.
- Fill always comes with words (UR37). The figure's step note carries them, and the
  text form reads the note, or the fill as a percentage when no note exists, so the
  drawing never holds a fact alone (`figure.js` header).
- **Felt versus counted is a per-world dial.** In the Tingen life, digestion is known by
  feel; the panel already says "feels unsettled / settling / settled" and keeps the act
  count as a plain record of what you did. The ladder shows both ("feels settling, 2 of N").
  Where a world's practitioners do not know the threshold, the owner passes the felt words
  only and no fill; the adapter draws no fill when there is no counted crossing.
- Mastery bands (Mistglass Learning / Practiced / Integrated) are rungs, not fills, because
  each band changes what the method does (ABR10, ABR18). The fill is the practice toward
  the next band.

## Cooldowns and costs

- Costs live on the ability row and its button, in the world's resource, as the existing
  quote shows them ("10 game min · 2 spirituality"). They are not drawn on the ladder,
  which is about who you are, not what a use costs. ABM3 (one cost vocabulary per world)
  decides the resource word.
- Cooldowns and charges are words first ("ready in 40 min", "2 of 3 charges"), and a
  figure ring of segments only in the vessel (O3), where several recharge at once.
  A cooldown nobody in the world could time shows as a felt state ("still spent"), not a
  timer (ABR19).
- An unknown cost is not shown as "?" on a row the character cannot see (ABR19); a known
  row with an unknown price says so in words ("the price is not known to you").

## What a non-lead seat sees

- A seat's own ladder is shown in full to that seat: beside, follow and bystander lives
  each read their own `pathView`. The adapter never compares against the lead's identity;
  surfaces take an observer from `observer_view.js` (MDL9).
- Looking at **someone else's** ladder uses the witness perspective
  (`ladderFigureSpec(view, {perspective: 'witness', seen})`): only rungs the witness saw
  used, the highest seen marked "seen in use", one "Not seen" rung above, no fill, no
  crossings, no grants, no risk line. How far someone has digested is not visible from
  outside. Fixture `ladder-lantern-witness` shows it.
- Runs of unknown rungs collapse to one, for every perspective, so no figure reveals how
  long a ladder is (ABR19: no counts of unknown rungs).

## Home and contract (proposed UR76)

| Item | Value |
| --- | --- |
| Home | Tingen place service (`#lotm_panel`), pathway block (`lotm.block.path`, `[data-lotm-path]`), in the main workspace |
| Shape | Figure (MDL2) with one vertical track; text form in a "Read the ladder as text" disclosure; the existing "Plan the next crossing" list keeps the crossings and Find step buttons, so the figure omits its crossing track there (`crossings: false`) |
| Target viewport | 1920×1080 desktop; mobile deferred |
| States and their words | Civil staff: no ladder, the existing "A civil post brings no potion or field membership." Fresh: "standing on Ordinary clerk", next rungs pending, one "Not yet known". Digesting: current rung filled with "feels settling, n of N". Capped: "… is not open to you here yet." Witness: as above |
| Next homes | Mistglass method track in the cultivation panel (`mistglassPathView` already returns a `pathView`); skills panel web (O2) |

## Receipt (2026-10-30)

Agent-verified, not human-reviewed. Branch `claude/rep-abilities-6f77c2`, based on `a742581ac`.

**Files**

| File | Change |
| --- | --- |
| `src/ability_ladder_figure.js` | New adapter: `ladderFigureSpec(pathView, {felt, rumours, perspective, seen, subject, crossings})`, `rungFill(view)` |
| `src/ui/figure.js` | Generic: `track.orient: 'vertical'`, `track.progress` words, step `fill` (0..1) and `note`, state `guessed` (UIV6); horizontal labels wrap to the space between steps, end labels turn inward, track height grows to fit (fixes clipped and overlapping step labels) |
| `styles/figure.css` | `.fig-fill`, `.fig-step-note`, guessed state |
| `src/book_world_lotm_ui.js` | Pathway block draws the ladder figure with a "Read the ladder as text" disclosure; the felt line moved into the current rung's note; plan list unchanged |
| `index.html` | Links `styles/figure.css` (the game did not load it before) |
| `src/perspective_controls.js` | Tags the two new `data-lotm-ladder*` families as in-world |
| `src/ui/preview/fixtures/abilities.js`, `src/ui/preview/figure_gallery.js` (one import line) | Gallery fixtures `ladder-lantern-self`, `ladder-reed-self`, `ladder-lantern-witness`, built through `definePath` / `pathView` / the adapter |
| `tests/ability_ladder_figure.test.js` | Vertical track, fill, text form, validation; self, rumoured, collapsed unknown, witness, `crossings: false`; real Tingen facts fresh and digesting; gallery registration |
| `docs/representations/evidence/abilities/` | 1920×1080 captures and `capture-log.txt` |

**Checks**

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/ability_ladder_figure.test.js tests/figure.test.js` | 11 pass | |
| `node --test tests/perspective_controls.test.js tests/observer_view.test.js` | 9 pass, after tagging `data-lotm-ladder` and `data-lotm-ladder-text` in `src/perspective_controls.js` (the full run caught the untagged family) | |
| `npm test` (full, once) | 4105 pass, 12 fail, 3 cancelled. One was this slice (the untagged family, fixed above). The rest: disposable-copy integration workers killed at their 160 s / 180 s timeouts with empty output while the machine ran at load average 71-121 (eleven sibling sessions), and two private-corpus tests needing the gitignored `docs/research/novels/` this worktree lacks | Rerunning the 14 affected files after the fix: 74 pass, 7 fail, 4 cancelled, all timeouts; one file alone took 3 min at 15% CPU and timed out. Not proven green here; the merge gate should rerun on a quieter machine |
| `npm run check:arch` | PASS (main.js -48, display.js -37 against baseline) | |
| `npm run check:rules` | PASS, 5 existing warnings | |
| `npm run build`, `npm run build:figures` | built; gallery closure does not reach the game core | |
| Headless Chrome 1920×1080, `capture_cdp.mjs` | Gallery: three fixtures, effects full and off. Game: fresh origin, ladder visible in the workroom, text form readable, after the dose the current rung reads "feels unsettled, 0 of 6"; no page errors | Partial in-game fill not reached (needs timed acts) |

**AD43 floor**

| Line | State |
| --- | --- |
| FLR1 Build | Proven on `dist/bundle.js?version=v0.6-833bb019e3c6`; gallery `dist/figure-gallery.js` rebuilt from the same sources |
| FLR2 Route | Fresh test origin in headless Chrome: PLAY, pick the probationer life, cross, open "Tingen workroom" from the top "Other known panels" list, then Report in, Accept allocation, Drink. Fixtures named above for the gallery. MCP walk not run (the slice is a view over existing facts; the MCP returns text, which the text form already covers in tests) |
| FLR3 Shown | Ladder words for every state; text form in the disclosure and the SVG description; no new cost or blocked action |
| FLR4 Used | Reads the existing `pathView` that the plan list and crossings already consume; the figure adds no new fact |
| FLR5 Kept | No persistence change; nothing saved |
| FLR6 Labelled | Agent-verified, not human-reviewed; route kind: fresh life, earned steps, rebuilt browser |

Gaps: the in-game fill arc is shown at 0 of 6 only (digestion acts need timed work); a partial fill
is proven in the gallery and by the real-facts test. The workroom panel is parked after crossing, so a
player opens it from the top list; that is the existing layout, not this change. Effects-off capture
covers the gallery only.

**Next slice**

1. Mistglass method track in the cultivation panel through the same adapter (`mistglassPathView`
   already returns a `pathView`).
2. The unchosen pathways in the Tingen block (still arrow text) as small ladders, or one ladder with a
   chooser.
3. Skill web (O2) for the "Methods & practice" panel once two skills build on each other.
4. Witness view's first in-game home: another person's card when the player has seen them use a power.

## Round 2 (2026-10-30): review against other games, fresh eyes, depth

Brief: `docs/gm/dispatch/ui-refactor-wave-2026-10-29/ROUND2_BRIEF.md` items 1-21. This session leads
item 19 (levels and depth) and item 15 (how an ability feels when used or gained). Everything here,
round 1 included, is a draft and open to refactor or replacement with a reason (AD45, item 21).
Codes RA1-RA30 are this round's.

### How other games do it (item 1)

Labels: **docs** (known from published material or wide play reports), **inferred** (my reading of why it works).

| Code | Game | What the player sees | Makes easy | Costs | Idea worth adapting |
| --- | --- | --- | --- | --- | --- |
| RA1 | Path of Exile, passive tree | A huge web of small nodes; notables and keystones larger; your allocated path lit (docs) | Planning a long build; seeing where a cluster leads | Overwhelming on first sight; needs external planners (docs) | Size by consequence: a rung or node that changes what you can do is drawn larger than one that adds a number (ABR18). Our ladder already marks only real tiers; the skill web (O2) should size notables up |
| RA2 | Disco Elysium, skills as voices | Skills speak in the dialogue log with their own name; level shows as dots; checks quote odds (docs) | Feeling a skill as part of the character; knowing why a check passed | Text-heavy; ability truth comes in voice, not table (inferred) | The ability speaks when it acts: a short log line in the ability's own voice on use, marked as such (RA24). The potion's "felt" state already reads like this |
| RA3 | Tale of Immortal / Amazing Cultivation Simulator, realms | Named realms with early/mid/late/peak sub-stages, a cultivation bar, a breakthrough event with odds (docs) | Long progressions in readable chunks; dread before breakthrough | Grindy bars become the whole game; odds as bare numbers (inferred) | Sub-stages as segments of one rung (fill in quarters) and the breakthrough as its own crossing with a stated risk; our crossing track and risk note already fit; segments are LATER (RA27) |
| RA4 | Hades, boon chains | Boon cards with rarity, a prerequisite icon row; duo boons appear when two gods' boons are held (docs) | Seeing synergies at the moment of choice | Short-run scope; little long-term depth (inferred) | Synergy shown where the choice happens, as "works with X you hold", not in a separate tree (RA19) |
| RA5 | Skyrim, constellations | Skill trees as star patterns per skill; perks lit; level gates per perk (docs) | Diegetic beauty; one tree per skill keeps each small | Hard to compare across trees; stars hide requirements (inferred) | One small figure per path, not one giant board; requirements in words beside each star (our crossing track) |
| RA6 | Proto23 / YAIR baselines (UR12, UR49) | Skills as rows with a level and an XP bar, unlocks listed (our own reference) | Quick glance at many skills | No sense of tier or what the next level changes | Keep the row-and-bar glance for skills; the ladder is the click-away depth (RA10) |

Our own history checked: the thematic UI owner's BD2 "accumulation" (fill toward a known
consequence, a cue on release) is exactly digestion fill; the scale palette's CS1 says a cheat's
surface follows its fiction (RA16); the representation ladder (glance, row, figure, scene) is the
density scale used below.

### Fresh-player test (item 2)

From a fresh life (PLAY, pick the probationer life, cross, open "Tingen workroom"):

| Code | Finding | Fix |
| --- | --- | --- |
| RA7 | "0 of 6" beside "feels unsettled" has no unit: 6 of what? | ACT NOW: the rung says "0 of 6 toward the next rung"; the crossing track keeps the unit in its label |
| RA8 | What the next rung gives is not said anywhere, so there is no pull to climb | ACT NOW: "What the next rung gives: …" when the character can name it (`pathView.nextGrants`) |
| RA9 | Terms a newcomer must know: Sequence, Beyonder, potion, digestion, rung. "Rung" is our word, not the world's | Keep "rung" in the generic adapter; a world's term set (Sequence, realm, rank) belongs to the world's skin through tokens and the track label (item 20). LATER: per-world rung noun in the path descriptor |
| RA10 | The workroom opens parked after crossing; the ladder sits under the place status and meters | Not this slice: Worlds and crossings owns workroom density (item 14). Proposed glance line for the You panel or sheet (RA11) so the ladder is seen without opening the workroom |

### Space, split, density (items 3, 4, 18)

| Code | Part | Density and form | Why the others fit worse |
| --- | --- | --- | --- |
| RA11 | Glance | One line, `ladderGlance(view)`: "Sequence 9 · Seer · feels settling · 2 of 6 toward Sequence 8". For the You panel header or the character sheet (rep-character-sheet composes it) | A bar alone hides the felt words; a figure is too much for a header |
| RA12 | Ladder | Vertical track (round 1) in the pathway block; compact horizontal variant for sheets (`layout: 'compact'`) | Ladder rungs are ordered ranks, so a vertical track beats rings (no cycle) and a tree (no branching in a chosen path) |
| RA13 | Crossings | Plan list stays text with Find step buttons (actions first); the figure omits its crossing track there | A second picture of the same list would split attention |
| RA14 | Long ladders (later volumes) | Above 7 rungs, crossed rungs below the one under you fold into "k rungs crossed" | Ten Sequences or nine realms at 64 px each would push the plan off screen |
| RA15 | Bar | Digestion uses the figure's fill plus words, not a separate meter; a meter would repeat the same fact (UR74) | |

### Pop-out, cheats, style, flourish (items 5, 6, 7, 13, 15)

- **RA16 Cheat or insight view.** `insight: {stages}` names rungs the character cannot know, drawn
  as guessed with "shown by insight" and a note saying so (CS1: the cheat's surface follows its
  fiction; a system-window cheat would show this inside its own window). Insight never applies to
  the witness view. Sealed truths stay out: insight reads only the path descriptor's public stage
  labels the owner passes in, never sealed secret files.
- **RA17 Pop-out.** Not earned: the ladder changes a few times per life. A desktop notification on
  a rung gained is earned (presence already exists); proposed, not built.
- **RA18 Alternative style.** Compact horizontal ladder in the gallery beside the vertical one. The
  vertical reads better for one path you live in (height means rank); the compact one reads better in
  a sheet that lists several things. Both use the same tokens, so Luminous and Neutral both work.
- **RA19 Flourish on gain (item 15).** When the current rung changes, the new rung pulses once
  (`effect: 'pulse'`), bound to the settled subject; effects off and reduced remove it and the words
  stay (UR38, UR62). On use, the ability's own voice line in Reports (RA24) is the feel; particles
  only for a crossing, never for routine use.

### Levels and depth (item 19, lead)

| Code | Depth question | Default, dial and in-world reason |
| --- | --- | --- |
| RA20 | Levels, tiers, stages | Rungs are tiers that add a verb or domain (ABR18); sub-stages (early/mid/late) are fill segments inside a rung, not rungs. Dial: a world whose sub-stages each change what you can do promotes them to rungs |
| RA21 | What the next level changes | Shown when the character can name the next rung ("What the next rung gives"); otherwise nothing (ABR19). Reason: institutions teach what the next step brings; rumours give only its name |
| RA22 | Prerequisites and unlocks | The crossing track is the prerequisite list; what a rung unlocks is its grants. For skill webs, edges "builds on" and "opens" (O2) |
| RA23 | How use, training or digestion moves it | Fill on the current rung from the counted crossing (`digest` acts, `quota` practice) plus felt words where the world knows it by feel. Dial: a world without felt cues shows the count only |
| RA24 | Synergies and conflicts | Shown at the moment of choice as one line ("works with: …", "conflicts with: …"), from row data; the Tingen rule "one pathway per life, a second potion risks loss of control" is the first conflict and already reads as the switch notice. Data field proposed for path rows: `conflicts`, `synergies` |
| RA25 | Costs that scale | On the ability row's quote, per rung ("2 spirituality at Sequence 9, 1 at 8"); the ladder shows only that a rung changes costs, in its grants text |
| RA26 | How well a character knows their own ability | Four depths, matching UIV6: unknown (no row), heard of (guessed rung), known (named rung and grants), understood (thresholds and costs shown). The `known` count in `pathView` already sets the first three; "understood" is a per-world fact (an assessment, a teacher, insight) |

### Later volumes and worlds (item 17)

Checked against what the library index and reading status say exist (higher Sequences, long realm
ladders, ranks inside organisations, several pathways seen in others): the adapter is data-driven
over `definePath`, so a later volume adds stages and grants rows, not code. Needs met now: long
ladders fold (RA14); unknown rungs never reveal ladder length; witness view for others' powers.
Open: branching pathways (a tree), parallel ladders held at once (cultivation plus a body art),
sub-stage segments (RA27), and a per-world rung noun (RA9).

### Unconventional option (item 9)

**RA28 The ladder you remember climbing.** Each crossed rung keeps one dated line from the moment
it happened ("Drank it in the workroom at dusk; the room smelled of smoke"), drawn as a small
scene card on hover, so the ladder becomes a memoir of the life rather than a progress bar. Needs a
crossing receipt line in the owner's knowledge record (the Tingen knowledge entries already hold a
time and text) and a hover inspector. Worth a later slice once the scene card is in the workroom.

### Flair in two worlds (item 20)

Marks carry roles, not looks: `rank` (rung), `crossing`, `risk`, `rumour`, `seal` (not offered
here). In a gothic potion world the motif could be a stair of numbered brass plates, the fill as
liquid in a vial beside the current plate, rumoured plates tarnished. In a cultivation world, a
mountain path of named terraces, the fill as mist rising round the current terrace, the next
breakthrough a gate with its risk written on the lintel. Both restyle `fig-track--vertical` through
tokens and a motif class; the adapter and text form do not change.

### Audit gaps (item 10)

Other seats: beside lives read their own ladder; the witness view covers others. Empty: civil staff
keeps its words, no ladder. Error: a malformed descriptor throws in `definePath`, caught in tests.
Performance: one SVG of under 60 nodes per render; the panel already rebuilds the block on change
only. Accessibility: SVG title and description carry the text form; the disclosure gives it as
plain text; effects off keeps every fact. Keyboard: the disclosure is reachable; the figure has no
controls. 21 px text: labels wrap by width (round 1 fix) but the vertical rung labels are not yet
checked at 21 px (gap).

### ACCOUNT FOR NOW

- RA10/RA11: the You panel or sheet shows `ladderGlance`; rep-character-sheet decides placement.
- RA24: path rows add `conflicts` and `synergies` when a second ladder becomes holdable.
- Workroom density is Worlds and crossings' (item 14); this block keeps actions first and prose behind disclosures.

### LATER / DELEGATE (ranked)

| Priority | Work | Level / effort / done check |
| --- | --- | --- |
| First | Mistglass method track through the same adapter in its cultivation home | Sonnet medium, small. Done: track shows in its panel at 1920×1080 with practice fill; tests on `mistglassPathView` |
| Second | RA19 pulse on rung gain plus a Reports line in the ability's voice (RA2, RA24) | Sonnet low, small. Done: one pulse after a crossing, none with effects off; one Reports line per crossing |
| Third | RA27 sub-stage segments (fill in quarters) as a generic step option in `figure.js` | Sonnet medium, small. Done: test and gallery fixture of a four-stage realm |
| Fourth | O2 skill web for "Methods & practice" once two skills build on each other | Opus design, Sonnet build; medium. Done: web from real skill rows, unknown skills absent |
| Fifth | RA28 memoir ladder | Sonnet medium after scene cards reach the workroom. Done: each crossed rung shows its dated line on hover |

### ACT NOW (done this round)

| Code | Change | Where |
| --- | --- | --- |
| RA7 | Rung count says "toward the next rung" | `src/ability_ladder_figure.js` |
| RA8, RA21 | "What the next rung gives" when the next rung is nameable; `pathView` returns `nextGrants` | `src/ascension_paths.js`, adapter |
| RA11 | `ladderGlance(view, {felt})` one-line glance for headers and sheets | adapter (not wired: rep-character-sheet owns placement) |
| RA12, RA18 | `layout: 'compact'` horizontal ladder; gallery `ladder-lantern-compact` | adapter, fixtures |
| RA14 | Ladders over 7 rungs fold crossed rungs below the one under you ("5 rungs crossed", "Rung 1 to Rung 5"); gallery `ladder-long-self` | adapter, fixtures |
| RA16 | `insight: {stages}` names unknown rungs as guessed, "shown by insight", with a note; never for a witness; gallery `ladder-lantern-insight` | adapter, fixtures |
| RA19 | A gained rung pulses for six seconds in the workroom; effects off and reduced keep only the words | `src/book_world_lotm_ui.js` |

Built by a Sonnet subagent from a bounded brief (adapter, `pathView`, tests, fixtures), diff reviewed
here; fold-note shortening, fixture fix and the pulse done here.

**Round 2 checks**

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test` on the ladder, figure, perspective and observer tests | 30 pass | |
| `node --test` on every test reading `pathView` (LOTM pathway, compat, digestion files) | 53 pass | Full `npm test` not rerun this round: round 1's full run was load-bound (see round 1 checks) and round 2 touches only these consumers |
| `npm run build`, `npm run build:figures` | Bundle `v0.6-e53c162fccff` | |
| Headless Chrome 1920×1080, `capture_cdp.mjs` | Six gallery fixtures captured; fresh life to the workroom; after the dose the gained rung carries `fig-fx--pulse`; no page errors | 21 px text not captured; pulse proven by class, not by eye |

AD43 floor for round 2: FLR1 bundle above; FLR2 same fresh-life route; FLR3 words for every new
state; FLR4 reads existing `pathView`; FLR5 no persistence change; FLR6 agent-verified, not human-reviewed.
