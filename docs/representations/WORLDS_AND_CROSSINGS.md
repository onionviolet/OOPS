# Worlds, crossings and transmigration: representations

Status: proposals, 2026-10-30 (UI refactor wave, worlds lane). Nothing here is an
accepted rule. Codes cited as "(proposed)" stay proposed until Weibao says yes.

Sources: [world entry rules](../WORLD_ENTRY_RULES.md) WER1-WER17;
[UI design core audit](../audits/UI_DESIGN_CORE_AUDIT.md) RPX20, LTU8, LTU14, MDL6,
MDL12; [ui-refactor wave plan](../gm/dispatch/ui-refactor-wave-2026-10-29/PLAN.md);
UR76-UR82 (proposed) in the [coverage plan](../gm/dispatch/ui-coverage-2026-10-27/PLAN.md#8-proposed-standing-rules-proposed-2026-10-27-awaiting-weibaos-yes).
Shared pieces used: `src/ui/scene_card.js`, `src/observer_view.js`, `src/carry_ledger.js`.

## What a crossing has to show

A crossing is the most irreversible thing a player does: a body, a purse, a name
and a whole life change at once. WER3 already makes every start answer nine
questions (body, memories, base cheat, money and items, name and papers,
language, who notices, the former life, what you owe). Today those answers render
as nine flat paragraphs. They are correct, but the player has to sort them in
their head to learn the three things that matter at the door: **what comes with
me, what stays, and what I wake up owing.**

## Options weighed

| Code | Representation | Good at | Weak at |
| --- | --- | --- | --- |
| WCO1 | **Threshold carry list.** The confirm step as a scene card: header (from → to, start, era), one stakes sentence, then the WER3 answers grouped as *Crosses with you*, *Stays behind*, *Pauses* (or *Ends here*), *Waiting on the far side*, then the choices. | Answers the door question at a glance; reuses the nine answers verbatim, so wording still matches mechanics (WER3); works for every world without code (any start supplies answers). | Only exists at the moment of crossing; says nothing about worlds you already hold. |
| WCO2 | **Multiverse map.** A figure (`figure.js`) with one node per world: the active one lit, paused lives dimmed with their departure date, unvisited worlds outlined, edges labelled by carrier (Continuing connection, a door, a hub). Text form lists each world with its state. | The standing overview LTU8 and WER13 want: which lives exist, which pause, how they connect. Natural home: the existing Worlds route. | A map invites implying links between worlds that WER1 says are separate. Edges must come only from real carriers, never geography. |
| WCO3 | **Per-world skin tokens.** Each world declares palette, frame, glyph set and figure style as tokens (MDL6). Precedence (MDL12): player choice, then world skin, then the Luminous default. | Worlds feel distinct at no per-feature cost; crossing becomes visible as a change of light. | Not information by itself; must never carry meaning that the text form lacks (UR37). |
| WCO4 | **The packing table** (unusual). The threshold as a diegetic scene: your hands, a table and a door. Things that cross are already in your pockets; what stays sits on the table; the paused life is the coat on the hook. Each object reads its WER3 line on hover and in the text form. | Turns a ledger into a memorable moment; gives WER9's "needs a carrier" a physical place (a bound bag, a sealed letter). | Highest art cost; the same facts as WCO1 with more pixels. Worth it for a world whose crossing is itself a scene (a rite, a summoning). |

## Proposed default

**WCO1 first, as the floor for every start; WCO2 next in the Worlds route; WCO3
as tokens once two worlds have looks; WCO4 as a per-world dial.**

- **Default:** every crossing confirm step is a threshold carry list built from the
  start's WER3 answers. Grouping is by question, never by parsing answer text, and
  an unknown question lands in *Also*, so a world that adds a question never loses
  it.
- **Dial:** a world whose crossing is itself an event (a summoning, a rite, a
  cocoon release) may stage the same groups as a scene (WCO4) or a rite figure,
  with the carry list kept as its text form. Independent new lives show their
  answers as *How it begins* with no crossing groups.
- **In-world reason:** at a real door the traveller checks pockets, not a
  questionnaire. The groups are the questions a person asks before stepping
  through.

Grouping rules (proposed): Memories and Base cheat cross. Money and items stays
behind (the answer names what replaces it). The former life pauses when a
continuing connection can carry it and is titled *Ends here* when it cannot.
Body, Name and papers, Language, Who notices and What you owe wait on the far
side. In an in-person crossing (XM3), Body and Language cross instead.

### Seat header and taking a seat (LTU8, LTU14)

The carry list header already carries place, start and era. For a cast seat
(LTU14) the same card takes four groups instead: *What you know*, *What you own*,
*Whom you know*, *Which book facts now lock*. Those read from `observerView`, never
from the lead's identity. The run-mode chip (LTU8: canon or open run) belongs in
the header's `lead` slot. Both are the next slices, not built here.

### World skin precedence (MDL6, MDL12)

- **Default:** player choice > world skin > Luminous default. A world skin
  supplies only token values (`--ui-accent`, frame, glyph set, figure style),
  applied under the player's chosen component theme. A player who picked a palette
  or Neutral keeps it everywhere.
- **Dial:** a player setting "Let worlds set their look" (on by default) turns
  world skins on or off as a whole. A world may mark one moment, such as the
  crossing card or a dream scene (RPX8), as a skin moment that tints only that
  card.
- **Reason:** the player is the one who reads the screen for hours. A world's mood
  must not cost them legibility. `componentThemeTokens` already recovers contrast
  per palette, and world tokens must pass through the same check.

### Multiverse map notes (WCO2)

- Home: the existing **Worlds** route (`optional-worlds`). It adds no new route
  (UR77, proposed).
- Nodes come from real state only: the active world, paused lives from the
  continuation record, and worlds the player can enter. Edges come from carriers:
  the Continuing connection, a place door, a hub. None comes from adjacency or
  lore (WER1).
- Sealed secrets: an undiscovered world's real nature stays sealed. The node shows
  only what the seat knows (`observerView`).

## UI contract (UR76, proposed)

| Field | Value |
| --- | --- |
| Home | The `lotm` center module's entry step (*Tingen workroom*, opened from the Village place action "Cross to another world: Tingen"). Later starts use their own existing entry step. |
| Shape | Scene card (`scene_card.js`) plus a carry-list section inside it (`src/ui/crossing_threshold.js`). |
| States | Returnable crossing (*Pauses*); one-way (*Ends here*); in-person (body and language cross); blocked (the reason prints beside Confirm); independent new life (*How it begins*). |
| Text form | `thresholdText(view)`: the header line, the stakes, each group with its rows, and each choice with its blocked reason. |
| Tokens | `styles/crossing_threshold.css`, tokens only (UR6). Groups are labelled in words. Colour is an extra cue, never the only one. |

## Receipt (2026-10-30)

Files:
- `src/ui/crossing_threshold.js`: generic adapter and renderer (`carryGroups`, `thresholdScene`, `thresholdText`, `renderCrossingThreshold`). Holds no world names.
- `src/book_world_lotm_threshold.js`: maps the existing entry view (`profiles[].answers`, `returnable`, `axes`, `startable`) to a threshold view. It keeps the `data-lotm` tokens (`enroll`, `enroll_<key>`, `entry_back`) and the `data-lotm-entry-answers` and `data-lotm-answer` hooks.
- `src/book_world_lotm_ui.js`: the old answer box and button row replaced by one `renderCrossingThreshold` call.
- `styles/crossing_threshold.css`, plus one stylesheet link in `index.html`.
- `src/ui/preview/fixtures/worlds.js`: named fixtures `CROSSING_RETURNABLE` and `CROSSING_ONE_WAY_BLOCKED`, using invented places only (CLR3). The figure gallery renders only figures, so this slice has no gallery registration line.
- `tests/crossing_threshold.test.js`.
- Evidence: `docs/representations/evidence/worlds/` (`threshold-confirm-1920.png`, `threshold-choice-1920.png`, `reconcile-master-result.json`).

Checks:
- `node --test tests/crossing_threshold.test.js tests/perspective_controls.test.js tests/lotm_ui_replay.test.js`: 11 pass. Covers grouping, all nine answers kept once per live profile, button tokens, blocked reason, text form and tokens-only CSS.
- `npm run build`: pass.
- `node scripts/playtest/reconcile-master.mjs <worktree> <out>`: PASS at 1920×1080 and 1536×864, sizes 14 and 21. The route is fresh Village → door → pick → nine answers → Back → confirm → pause and resume both lives → Save, reload, Export and literal Import. The first run failed only on console 404s for gitignored private fonts that this worktree lacked. With those fonts copied in locally (not committed), it passed.
- `npm test` (once, pre-commit): 4105 pass, 9 fail, none in files this slice touches and none using the entry step. Seven are live native-save browser tests (timeouts or silent save-worker failures). `tests/place_acts.test.js` fails the same way on a clean master copy, so these predate this change. Two need the private `docs/research/novels` folder, which this worktree lacks. One perf timing test also failed outside the nine (2000 disabled buttons in 102 ms) while ten sessions shared the machine.
- `npm run check:arch`: pass (no growth). `npm run check:rules`: PASS.
- `dist/bundle.js` and the `index.html` bundle version are rebuilt artifacts. On merge, resolve them by rebuilding.

AD43 floor: the slice is reachable from a fresh life (Village place action) and
from named fixtures. Its text form is shown and tested. It was rebuilt and
exercised headless at 1920×1080. Persistence is unchanged: no save shape changed,
so no migration. Status: agent-verified, not human-reviewed.

Next slice: WCO2, the multiverse map in the Worlds route. It would be built from
the continuation record's paused lives and the active world, with carrier-only
edges. After that comes the LTU14 seat threshold, using the same card with the
four seat groups.
