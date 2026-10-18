# UI identity, navigation and representation

2026-10-14. Round 2 of the [format and view decision audit](FORMAT_AND_VIEW_DECISION_AUDIT_2026-10-14.md). Weibao:

> better 2d representations? General ui considerationjs? we should inherit more of Proto23's identity since right now's rounded stuff and style feels vibe coded and does not share the same style in a way? Other stuff accordingly? Representation of characters? Scene panels + other ideas? we can draw from text based game like nethack and bitburner, other aspects to consider? Consider best ideas and more? Easiest and most capable representations?

> also right now Ui feels cluncky and we miss the side panel of attack numbers and random event text and more?also clicking into certain panels leaves no way back?

Consideration run. No source change. Evidence: Proto23 source capture (`/private/tmp/proto23-ui-source.html`, CSS lines 5–110) and its [after-difficulty screenshot](research/proto23/UI_AFTER_DIFFICULTY_2026-10-13.png); current repo CSS; current working tree served locally at 1366×768 on a new game, with computed styles read from the live page. The served build is the working tree's bundle, not a fresh rebuild, so it shows the current look but proves no gameplay.

## Diagnosis: why it feels clunky and off-style

| Code | Finding | Evidence |
| --- | --- | --- |
| UF1 | **The log is buried, not missing.** Combat and event messages still go to `message_box_div`. Four newer panels insert themselves at the top of that same box: Village travelers (`generated_people_ui.js:74`), Remembered years (`life_record_ui.js:14`), Village neighbors (`npc_lives_ui.js:17`) and the event feed (`event_feed_ui.js:18`, hidden when empty). The box is 144 px tall at 1366×768, so the actual lines get pushed out of sight. Proto23 gives its log a full-height right column | Live DOM measure; grep of the four `prepend` calls |
| UF2 | **No shared shape language.** On one visible screen: corner radii of 0, 3, 4, 5 and 6 px, two main font stacks (`system-ui` on 210 elements, Arial on 103) plus `inkFree`, eight font sizes from 12 to 24 px, five button variants. `styles/workspace.css` alone adds 12 radius and 19 shadow rules. Upstream YAIR already had 13 radius rules, so the rounded look is partly inherited and partly added by later waves | Computed styles; per-file counts |
| UF3 | **Cards nested inside cards.** Local actions holds bordered rounded boxes ("Talk to someone", "Find work"), then `▸` disclosure rows, then proposal panels such as Waypost supply clerk and Mistglass conservatory. Each wave added its panel to the main surface. This accretion is most of the "vibe coded" feeling: every piece is styled locally, and none follows one frame | Screenshot at 1366×768 |
| UF4 | **The focus target has no home.** Proto23 mirrors You against the current opponent in two equal top panels. YAIR shows a conversation by replacing Local actions ("Conversation in progress · Open local controls"), and the right column reshuffles at the same time | Live dialogue with the elder |
| UF5 | **Way back: not reproduced yet.** Dialogue has "go back" and an "Open local controls" button; Optional worlds and Talk expand inline. I did not find the dead end in this pass. Needs the panel names from Weibao (Q6) | Live clicks |

## What Proto23's identity actually is

Taken from its CSS, not memory:

| Code | Element | Proto23 value |
| --- | --- | --- |
| PX1 | Corners | Square everywhere. No `border-radius` in the core panels |
| PX2 | Frames | 3 px solid black around each window; panels butt against each other |
| PX3 | Fills | Horizontal gradients, navy to teal (`rgb(0,5,51)` to `rgb(0,65,107)`); log column purple (`rgb(60,50,90)` to `rgb(24,16,49)`) |
| PX4 | Rows | Dense rows about 20–22 px, separated by 1 px colored hairlines (`#44c`, `#3848c0`, `#9485ed`). No card padding |
| PX5 | Text | Centered in stat and log rows; pale cyan `rgb(188,254,254)` body; colored nouns in the log (item orange, heal green, hit numbers) |
| PX6 | Hover | Teal gradient sweep on the row, no transition |
| PX7 | Titles | Letter-spaced lowercase ("m e s s a g e   l o g") |
| PX8 | Tooltip | Light grey 5 px border, black 3 px outline, hard crimson offset shadow (8 px, no blur) |
| PX9 | Staged reveal | Locked tabs shown as `???????`; `ıLOCKEDı` equipment slots |
| PX10 | Layout | You and opponent side by side on top; inventory, location and log columns below; thin utility bar at the bottom |
| PX11 | Font | `MS Gothic`, a Japanese font. **On a Mac it falls back to the default serif**, which is why the screenshot looks like Times. The "Proto23 look" in the capture is partly a fallback accident. Either look can be chosen on purpose (DU2) |
| PX12 | Hanzi already present | The location header shows `[春]` for the season. Proto23 already mixes a CJK glyph into the UI, so a Hanzi field continues its identity rather than departing from it |

## Borrowing from NetHack and Bitburner

General design knowledge of both games, not a new source read. Existing [NetHack](research/nethack/REPORT.md) and [Bitburner](research/bitburner/REPORT.md) reports cover mechanics, not UI.

| Code | Source | Mechanism | YAIR use |
| --- | --- | --- | --- |
| NB1 | NetHack | One message line plus a message history; two status lines always visible (stats, HP, turn, and conditions like Hungry or Burdened) | A fixed status strip and a full log column. Conditions as words, colored when they matter |
| NB2 | NetHack | Every thing is one glyph; the look command describes any glyph on the map | Hanzi field marks with an inspect action that opens the same detail as the list (DV1) |
| NB3 | NetHack | ASCII, DECgraphics, IBMgraphics and tiles are interchangeable skins over the same glyph data | Proof that the semantic layer plus skins (DV1, DV6, DV7) works at scale for decades |
| NB4 | NetHack | Esc always closes the current menu; inventory letters stay stable | Universal back: Esc and one visible back control on every replaced view. Stable keys for routine actions |
| NB5 | NetHack | "Things that are here" list when you step on a square | The scene panel's object list: what is here, what can be picked up or used |
| NB6 | Bitburner | Persistent left navigation; you can never get lost | A permanent nav strip (Here, People, Work, Log, Worlds) that always returns to a known view |
| NB7 | Bitburner | City pages drawn as ASCII art with clickable place names | The easiest capable 2D: a text-art place map whose labels are real targets. No art assets |
| NB8 | Bitburner | Script log "tail" windows that float, minimize and keep their own scroll | Optional detachable log or combat feed instead of fighting for space in one box |
| NB9 | Bitburner | Theme editor: every color is a named token | One token set for frame, fill, hairline, accent and radius, so a Proto23 skin is a token swap rather than per-file edits |

## Representation options, easiest to most capable

For each question the player asks, the cheapest view that answers it well:

| Code | Question | Easiest | Most capable within standing direction |
| --- | --- | --- | --- |
| RP1 | Where am I, where can I go | Location header with exits as buttons (current) | Text-art place map (NB7) or Hanzi field (DV2), both on the same targets |
| RP2 | Who is here | Name list with role and one known trait | **Focus panel** (RP4) plus a tableau row of people as glyph-and-name chips |
| RP3 | What is here | Plain list | NetHack-style "things here" list with inspect and use (NB5) |
| RP4 | Who am I dealing with | Dialogue text in the center | **Proto23 mirror panel generalized**: the top-right twin of You shows the current focus, whether enemy, traveler, shopkeeper or teacher. Name, title, known traits, relationship, the few numbers that matter. Enemies show HP and stats; people show mood, need and what they remember of you |
| RP5 | What just happened | Log lines | Full-height log column with colored nouns and category filters (filters already exist: unlocks, events, crafting, combat, loot, background) |
| RP6 | What am I doing now | Status line | Status strip plus current-work row; NB1 |

**Character representation without portraits:** glyph token (人, or the surname character for known people; 兽 until a creature is identified) + English name + title in quotes, Proto23 style ("lvl 1 'Nobody'") + known traits + relationship line + memory line ("Remembers: you brought the bread"). The mirror panel (RP4) is the main stage; the glyph is the token in maps and tableau rows. This reuses traveler data that already exists.

**Scene panel shape:** location header (place, season glyph, time, weather) → focus panel (RP4) → people chips (RP2) → things here (RP3) → actions grouped by target. Built from the existing `projectVillageScene` shape and traveler view.

## Decisions added to the register

| Code | Decision | Status | Recommended default and dials |
| --- | --- | --- | --- |
| DU1 | Visual identity | P | Proto23 frame language as the default skin: square corners, black frames, gradient fills, hairline rows, centered stat text, letter-spaced titles, hard-shadow tooltips. Vivid colors stay. Rounded is a player dial at most |
| DU2 | Font | P | One deliberate stack. Default: a CJK-capable font so Hanzi and UI text match (PX11, PX12). Serif-like body and monospace numbers are both reasonable dials. Decide together with MC1 |
| DU3 | Layout skeleton | P | Proto23 arrangement: You and Focus on top, then inventory, center scene and full-height log columns, a status strip and a persistent nav strip. Workspace panels keep working inside it |
| DU4 | Log | P, bug-like | Full-height log column. Move the four inserted panels (UF1) to their own homes (People, Memories) |
| DU5 | Navigation | P | A view that replaces content always has a visible back control, plus Esc; persistent nav strip (NB6) |
| DU6 | Main-surface hygiene | P | Opt-in proposals and project panels leave Local actions for a Projects drawer; Local actions keeps routine actions at one level of nesting |
| DU7 | Tokens | P | One token set (frame, fill, hairline, accent, radius, three type sizes, two button variants) enforced through the existing panel kit and `--theme-radius`; skins swap tokens |

## More to consider

**ACCOUNT FOR NOW**

- **UC1.** DU4 is the cheapest high-value fix: no new design needed, only moving four panels out of the log box and giving the log its height back. It also returns the combat numbers Weibao misses.
- **UC2.** DU1 and DU7 belong together. Restyling file by file repeats UF2; a token pass first makes the Proto23 skin one change and keeps Classic, Workspace and per-world frames consistent.
- **UC3.** Proto23 license is unresolved (UI owner, 2026-10-13): copy the shape language, not its code or assets. Its values above are design measurements.
- **UC4.** Dense square rows at 14 px still need comfortable reading at 1366×768. Keep Proto23 density inside panels and breathing room between groups (UI owner P4).
- **UC5.** Mirror panel must stay observer-safe: unknown stats show `???` (Proto23 already does "rank: ???"), hidden traits stay counted, never named.

**LATER / DELEGATE**

- **UL1.** Text-art place maps per location (NB7) as the bridge between list and Hanzi field: same targets, nearly free to author.
- **UL2.** Detachable tail windows for combat and work logs (NB8).
- **UL3.** Skin preview page (LD3 in the audit) extended to compare rounded, Proto23-square and per-world frames on one screen.

## Questions for Weibao

| Code | Question | Default if confirmed |
| --- | --- | --- |
| Q4 | Confirm Proto23 frame language (DU1, DU3) as the default look? | Token pass, then skin |
| Q5 | Build order: log fix (DU4) and back rule (DU5) first, then tokens and skin (DU7, DU1), then the scene/focus panel? | That order |
| Q6 | Which panels left you with no way back? | Fix those first under DU5 |
