# Format and view decision audit

2026-10-14. Weibao: "I want a general audit on decisions so things can be decided in full and have a proper direction? I want to find out and compare if hanzi and other options are the best and more, this isnt an implementation run but rather a consideration run."

Consideration only. No runtime, build or dispatch. Every recommendation below is a proposal until Weibao confirms it; his quoted words and PROJECT.md accepted decisions are the only binding rows. Following [everything possible, reasonably](../PROJECT.md#accepted-decisions), options are written as a default plus dials, not as winners that exclude the rest.

Inputs reconciled: [format assessment](YAIR_FORMAT_AND_STORY_DELIVERY_2026-10-14.md), [art/reference report](research/format-and-character-art-2026-10-14/REPORT.md), [parts 1–3 reconciliation](research/format-and-character-art-2026-10-14/RECONCILIATION_PARTS_1-3.md), [Hanzi owner](WANDERING_ZONES_AND_INSIGHT.md#chinese-glyph-map-direction-explored-2026-10-02), [play beyond menus](PLAY_BEYOND_MENU_SELECTORS_CONSIDERATIONS_2026-10-14.md), [maps and charts lane MP4](gm/dispatch/ui-at-scale-2026-10-14/MAPS_AND_CHARTS.md), [presentation TX6/P6](PRESENTATION_AND_FOURTH_WALL.md), [UI owner](THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md).

## Short answer

**Hanzi is the right default local view, but "Hanzi or something else" is the wrong question.** The decision that actually carries weight is the layer under it: one semantic place model (known targets, kinds, adjacency, commands) that any skin can draw. With that layer, Hanzi becomes the default skin, and ASCII, icons, runes, box-drawing or an illustration become per-world or per-player dials at small cost. Without it, every view is a separate build and the comparison never ends.

Hanzi beats the alternatives as the *default* on three counts that matter for YAIR specifically: near-zero art cost across many worlds, glyphs that carry meaning (林, 水, 兽) rather than just shape, and a distinct identity no idle game peer has. Its real costs are CJK font weight, double-width cell alignment, and readability for non-readers, all solvable with labels and a fallback skin.

The view question is also second to a bigger one: **whether the game gets a scene surface at all** (DV3 below). That is where presence comes from. A map shows where you are; a scene shows who is there and what you can do with them.

## Decision register

Status key: **W** = Weibao decided (quoted or accepted), **P** = proposal awaiting him, **O** = open, nothing proposed yet, **N** = needs evidence (a prototype or source fact) before anyone can decide.

### Foundation

| Code | Decision | Status | Recommended default and dials | Decided by |
| --- | --- | --- | --- | --- |
| DF1 | Overall format | P | Text-led world RPG: scenes for the moment, idle routines for growth, small views for where/who/what. Format O2 in the format assessment | Weibao confirms direction |
| DF2 | Main surface | **W** 2026-10-02 | Center action menu stays primary; other views sit beside it | Done |
| DF3 | Target screen | **W** 2026-10-13 | Desktop/laptop at 1366×768; mobile deferred | Done |
| DF4 | Engine migration | P | None. Every candidate view fits the current DOM stack; canvas only if entity counts demand it | Weibao confirms; reversible |
| DF5 | Runtime LLM prose | P | Not a dependency. Optional later investigation | Weibao confirms |

### Views

| Code | Decision | Status | Recommended default and dials | Decided by |
| --- | --- | --- | --- | --- |
| DV1 | Semantic place layer under every map | P (new framing) | One model: target id, kind, known label, glyph key, adjacency, legal commands, knowledge state. Already implied by the Hanzi owner's "shared commands" rule; this makes it the actual decision | Weibao confirms; cheap to keep, expensive to retrofit |
| DV2 | Local view skin | **W** style, P placement | Hanzi field default. Dials: per world (DV6), per player (accessibility, DV7) | Style done; placement needs DV3 result |
| DV3 | Scene surface (who is here, what can I do with them) | N | Add one beside the center menu for one real situation. This is the presence test | Prototype, then Weibao's feel |
| DV4 | Regional view | P | Connected-place graph (ink atlas look) using real locations and travel costs. Geometry schematic and labeled as such | Later; needs more than one meaningful region |
| DV5 | Spatial tactics, workbench diagrams | P | Only where position or arrangement changes the result. Not presentation work | Per mechanic |
| DV6 | Per-world skins | P (exists as TX6 idea) | Hanzi in the base and Chinese-source worlds; kanji for JJK/Bleach; runes or Latin letters for D&D/LOTM; box-drawing for status-window worlds; the traveler's own lens as a dial (DV8) | Per world, as each lands |
| DV7 | Player skin choice | P | Settings dial: Hanzi, Hanzi + labels, ASCII, icons. Per-browser display setting like Vivid | Cheap once DV1 exists |
| DV8 | Traveler's lens | O (new idea) | The traveler always sees in their home glyphs, or adopts the world's, as an earned/cosmetic dial. Gives Hanzi a fiction reason to persist across worlds | Weibao taste |

### Characters and art

| Code | Decision | Status | Recommended default and dials | Decided by |
| --- | --- | --- | --- | --- |
| DC1 | Portraits | P (Weibao leaned yes: "portrait should be largely unnecisarry?") | Not required for any content. Optional for selected recurring people | Weibao confirms |
| DC2 | Person marker in views | O | A glyph (人, or a surname character for known people) plus English name; no silhouette that implies an unlearned role | Falls out of DV1 |
| DC3 | Where art budget goes first | P | Places and scene backgrounds before faces; one image serves many encounters | Weibao taste, later |
| DC4 | Voice as identity | P | Short trait- and relationship-keyed lines per person; reuses existing traveler traits | Small authoring slice after DV3 |

### Story model

| Code | Decision | Status | Recommended default and dials | Decided by |
| --- | --- | --- | --- | --- |
| DS1 | Story spine | P, partly built | Situations with checked prerequisites; receipts record outcomes; later scenes read receipts. Exists in Village (`story_requests`, `lore_history_state`, `causal_situations`) | Weibao confirms as direction |
| DS2 | Canon events | P | Conditional on their causes; never restored by presentation | Weibao confirms |
| DS3 | Person owners (four today) | P | Leave separate until one situation needs two kinds together | Engineering, later |
| DS4 | History beyond Village | O | Widen receipt scope per world with a save compatibility decision | First book world that needs it |

## Hanzi against the alternatives

Scored for YAIR's needs, not in general. Cost is to make one useful local view; breadth is cost to cover many worlds after that.

| Code | Option | Presence and identity | Clarity for a new player | Cost, then breadth | Fits book worlds | Main risk |
| --- | --- | --- | --- | --- | --- | --- |
| V1 | **Hanzi field** | High; meaningful glyphs, unique among idle peers | Medium; needs labels for non-readers | Low, then very low | Strong for Chinese sources; workable elsewhere with DV8 | CJK font weight and double-width alignment; screen-reader names |
| V6 | ASCII / CP437 roguelike | Medium; genre-familiar (A Dark Room, Caves of Qud) | Medium; letters as monsters confuse beginners | Very low, then very low | Neutral everywhere | Feels generic; less YAIR identity |
| V7 | Icon or emoji tiles | Medium | High; pictures read instantly | Low (open icon sets), then low | Neutral; emoji clash with grim worlds | Platform-dependent emoji look; tone |
| V8 | 1-bit or pixel tiles | Medium-high | High | Medium, then medium per world | Needs new tiles per world | Art pipeline creep, which DC1 avoids |
| V9 | Illustrated place with hotspots (Roadwarden style) | Highest atmosphere | High | High per place, then high | Strong but each place needs a picture | Art becomes a content gate |
| V3 | Scene tableau (names, objects, exits as cards) | High for people, low for space | High | Low, then low | Strong; text carries voice | Not a map; answers "who", not "where" |
| V10 | Clickable prose (nouns in the description are targets) | High for voice | High | Very low, then very low | Strongest; book voice stays prose | Weak for spatial reasoning |
| V2 | Connected-place graph | Low-medium | High for travel | Low, then low | Strong | Not local; answers "where can I go" |
| V11 | Top-down free movement | High | High | Very high | Weak; scales and bodies vary too much | Rewrite; DF4 conflict |

Reading the table: V1, V6, V7 and V8 are the same view with different skins once DV1 exists, so they are not competitors. V3 and V10 answer a different question (who and what) and are the best candidates for the scene surface. V9 is the premium skin for chosen places. V11 is the only option that conflicts with standing direction.

**Why Hanzi stays default:** the cheapest skins (ASCII, emoji) lose identity; the clearest (icons, pixel, illustration) carry art cost per world, which the portrait-light direction is trying to avoid. Hanzi keeps both low cost and high identity, and Weibao picked it on sight. Its weakness, readability, is fixed by labels, a selected-detail panel and the V7 fallback dial, not by switching style.

**What would change this:** if the DV3 prototype shows players read the scene and ignore the map, the local view drops in priority (not in style). If Hanzi at 1366×768 needs a font so large that a useful field no longer fits beside the center menu, a mixed skin (Hanzi for landmarks, icons for actors) is the fallback.

## More to consider

**ACCOUNT FOR NOW**

| Code | Consideration | Consequence |
| --- | --- | --- |
| MC1 | Font | System CJK fonts exist on macOS/Windows; bundling Noto Sans SC is several MB, subsetting to the used glyphs is small. Decide before any field ships |
| MC2 | Double-width cells | Hanzi takes two monospace cells; mixed labels break alignment. Use a fixed CSS grid, not monospace text runs (MAPS_AND_CHARTS already flags this) |
| MC3 | Accessibility | Every mark needs an English accessible name and keyboard focus; glyph alone never carries meaning |
| MC4 | Knowledge leaks | Map density, unknown-area outlines and marker counts can reveal sealed content. Draw only known targets; decorative terrain carries no information |
| MC5 | Glyph meaning drift across worlds | 兽 means "beast" in every skin's data; the skin changes the drawing, not the kind. Keeps saves skin-independent |
| MC6 | View switching | Free: no time, no rolls, no reveals. Already the stated rule; DV1 makes it structural |

**LATER / DELEGATE**

- **LD1.** Radical composition (木 → 林 → 森) and stroke-order animation as discovery feedback, from the presentation owner. A strong Hanzi-only payoff once DV2 ships.
- **LD2.** Bilingual or Chinese text option (LIFE_SIM_NORTH_STAR idea) pairs naturally with V1; separate localization decision.
- **LD3.** A skin-comparison page that renders one Village pocket in V1, V6 and V7 from the same data, for Weibao to look at. Cheap once DV1 exists; it is the "find out" step in his request.

## What Weibao needs to decide

Only build order and confirmations; everything else has a default above.

| Code | Question | Default if confirmed |
| --- | --- | --- |
| Q1 | Confirm DF1, DS1, DC1 as direction (text-led scenes, receipt-driven story, portraits optional)? | Recorded as accepted in PROJECT.md |
| Q2 | Confirm DV1 (semantic layer, Hanzi as default skin, other skins as dials)? | Hanzi stops being a style-vs-style debate |
| Q3 | Build order: scene surface (DV3) first, then the Hanzi pocket on the same targets? | Prototype section 4 builds the traveler scene first |

## Round 2: UI identity, navigation and representation

[UI identity and representation](UI_IDENTITY_AND_REPRESENTATION_CONSIDERATIONS_2026-10-14.md) adds DU1–DU7 (Proto23 frame language, font, layout skeleton, full-height log, back rule, main-surface hygiene, tokens), a generalized Proto23 mirror panel for characters, NetHack and Bitburner lessons, and Q4–Q6. It also finds that the message log is buried rather than missing: four panels insert themselves into the 144 px log box.

## Round 3: overarching UI foundation, 2026-10-15

Weibao accepted Q4 and Q5 and answered Q6 (Village mixing counter). [Foundation round](UI_FOUNDATION_DESIGN_ROUND_2026-10-15.md) proposes rebuilding three shared layers (look tokens, panel placement, one center-mode controller) and migrating features onto them, plus a UI contract test so parallel lanes cannot drift the style again. Codex lane: [ui-foundation-2026-10-15](gm/dispatch/ui-foundation-2026-10-15/COMMON.md). Q1–Q3 remain open.

## Round 4: surface types and the drawing board, 2026-10-15

[Surface types](UI_SURFACE_TYPES_AND_DRAWING_BOARD_2026-10-15.md) proposes a placement rule (routine, place service, threshold screen, quick confirm, obligations, reference, settings, proposals drawer, ambient log), world start as a full screen, a keep/rehome/drawing-board/retire triage, and the Village apothecary in place of the mixing counter. Questions Q7–Q9.

## Round 5: overarching design direction, 2026-10-15

The [overarching design core audit](OVERARCHING_DESIGN_CORE_AUDIT_2026-10-15.md) moves above format and UI to long-standing game direction (OD1-OD8) and hands UI findings U1-U5 to the UI chat. It also flags this audit's line 109: Q1 is described as recorded in PROJECT.md, but no such entry exists (C10).
