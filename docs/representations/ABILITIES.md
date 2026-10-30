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
