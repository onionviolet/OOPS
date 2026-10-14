# U11: reading comfort and typography

## CHECKPOINT

2026-10-14: research and design consideration pass complete. Own only this file
and [U11_REPORT.md](U11_REPORT.md). No gameplay, build, browser, save, pack,
commit or root-palette edits. All TY defaults and dials below are INFERRED
proposals, not accepted decisions or implemented behavior. Resume from the
source ledger and open checks, not from assumptions about shipped UI.

Target: 1366x768 laptop and 1920x1080 desktop. Visible outcome proposed: long
prose with easy line tracking, logs that scan quickly, and numbers that compare
without shifting, while useful independent panels remain visible. Mobile
optimization, U4 accessibility settings and implementation are deferred here.

## Direction and evidence

Use the screen for the workspace; set a reading measure inside each prose
region. A wide panel need not mean a sentence spanning the whole screen.
Available space can hold actions, a known-person rail, or a related record.
Those neighbors remain optional arrangements, not an excuse to condense the
game into one column. Long prose and history may scroll in their own regions.
This follows the [standing direction](../../../USER_VISION.md#standing-ui-priority-2026-10-13)
and [PROJECT.md](../../../../PROJECT.md). The root palette remains owned by
Claude; this lane maps onto it without editing it.

Evidence labels follow [COMMON.md](COMMON.md): SHOWN means a loaded page or
local source with lines; STATED means a claim in developer documentation;
INFERRED means our proposal; MEMORY means unchecked recall. A fetched article
does not prove a game's current rendering. No gameplay screenshots were
visually inspected and no game was played for this lane. Evidence IDs E1-E23
below let a reader distinguish support from analogy.

## What the references contribute

| Code | Reference and evidence | Reading lesson, INFERRED unless explicitly stated | Limit or opposing pressure |
| --- | --- | --- | --- |
| RF1 | Fallen London: E1 STATED, developer describes a browser game with a large handcrafted narrative | Story-sized blocks with a clear choice boundary can make a huge text corpus approachable. Keep title, situation, choice and result visually distinct | Its exact current font, measure and storylet rendering were not checked; browser play alone proves no comfort claim |
| RF2 | Sunless Sea: E2 STATED, developer revisited small fonts and added independent UI/text scaling | Fit the layout around readable text. Do not make players lower resolution to read, losing sharpness | The old interface is a caution as well as an inspiration. More visible panels can compete with larger text |
| RF3 | 80 Days: E3 STATED, branching narrative and globe travel; book-like text flow is MEMORY | Let prose have a clear start and choices a clear end; a travel workspace and a reading surface can coexist | No numerical typography or reveal speed was measured. Short narrative beats do not justify chopping every long letter into clicks |
| RF4 | Sorcery!: E4 STATED, story rewritten around choices and generated combat descriptions; paper treatment is MEMORY | Preserve continuity between action and resulting prose. Distinguish choices from the transcript even when both share one page | A theatrical paper surface can waste vertical space. Rewritten fiction is not permission to silently rewrite an archived receipt |
| RF5 | Disco Elysium: E5 STATED, dialogue engine central to reading, in-world menu metaphor, subtle result effects | Treat speaker and inner voice as explicit transcript roles. Give an interjection an attribution, not just a color | Narrow dialogue presentation is MEMORY, not measured here. Dense competing voices need more turn boundaries, not more fonts |
| RF6 | Citizen Sleeper: E6 STATED, narrative RPG using dice, clocks and drives; separate prose/decision rhythm is MEMORY | Give the scene room, then show the exact decision and cost. Keep prose and numerical scheduling connected without mixing their type treatments | Dice and clocks are verified mechanics, not proof of its font metrics or a reason to add them here |
| RF7 | Kentucky Route Zero: E7 SHOWN official description; theatrical text placement is MEMORY | Quiet space, scene headings and deliberate turn breaks can signal tone without decorating every line | Sparse scenic staging is costly for an idle workspace with many useful panels. Use it as an optional scene treatment, not a global density rule |
| RF8 | Roadwarden: E8 STATED, complex dialogue, choices and occasional parser input, little animation | Long reading and persistent practical resources belong in distinct regions. Keep the input prompt distinguishable from prior narration | Retro/pixel type is MEMORY, not a verified comfort benchmark. Atmosphere does not establish laptop legibility |
| RF9 | Ren'Py visual novels: E9-E10 SHOWN docs, separate dialogue/name/interface customization, history and instant/typed text controls | Explicit name field, stable reading box, transcript and reveal controls form a useful baseline | Documentation examples vary in size and font. They are not a canonical default font recommendation, and engine pixels are not CSS pixels |
| RF10 | Steins;Gate: E11 STATED, long branching story and phone interaction; stable VN reading window/backlog conventions are MEMORY | Give an in-world message its own document form while retaining a stable main reading surface | Original, Elite and other editions differ. No edition-specific backlog or font behavior is asserted as verified |
| RF11 | Inform/Glulx: E12 SHOWN release notes, semantic style mapping with appearance under interpreter/player control | Store prose, emphasis, heading and preformatted roles; do not make meaning depend on one font file | Historical release notes are not a current interpreter compatibility survey |
| RF12 | Twine: E13 SHOWN cookbook, emphasis conventions vary by story format | Author semantic emphasis and quotes once, then map to the renderer. There is no single Twine typography default to copy | Macro syntax and passage behavior differ by format; a style that works in one is not proof for another |
| RF13 | MUD clients: E14 SHOWN Mudlet docs, wrapping, continuation indents and monospace concerns | A streaming record needs a clear distinction between a new event and a wrapped continuation. Keep fixed-grid art separate from flowing prose | The documented 90-character wrap is a client default, not a universal prose optimum. New output must not steal the line being read |

## Starting values and contradictions

F1, measure: Butterick suggests 45-90 characters including spaces (E15).
Bringhurst's often-cited 45-75 range and roughly 66-character ideal are MEMORY
from *The Elements of Typographic Style*, not checked against an original
edition here. Dyson and Haselgrove's publisher abstract reports that a medium
55-character measure supported effective screen reading (E17, STATED from a
search-index excerpt; full fetch failed). These are different forms of evidence.
None establishes one magic width for hours of laptop play. Start near 60-70
actual Latin characters and compare shorter and wider versions with our text.
Very short lines also cost flow and increase scrolling.

F2, spacing: Butterick's 1.20-1.45 recommendation (E16) is tighter than the
1.5 spacing facility described in WCAG's AAA Visual Presentation criterion
(E18). Text Spacing, a separate criterion, concerns surviving user overrides,
not forcing those values as author defaults (E19). Proposed prose starts at
1.5; dense data can be tighter. U4 owns settings and compliance review. This
lane supplies typography that should survive those settings, not a second menu.

F3, theme: a controlled proofreading study found a positive-polarity advantage
for dark text on a light background (E20). It did not test hours of game play
or prove that light mode is universally more comfortable. Dark fiction, room
lighting and personal preference pull the other way. Preserve the player's
current palette, and offer a light reading surface through U4's theme controls.
Do not switch palettes on arrival in a world or shrink dark-mode text to fit.

F4, typeface: a text serif can provide a book voice and a sans face can separate
controls from narration. That is a design choice, not proof that serif beats
sans on screens. X-height, stroke strength, spacing, language coverage and
rendering at the actual size matter. A single readable family remains a valid
dial, and can avoid a busy page.

## TY consideration palette: default plus dial

All rows are INFERRED. Values are initial review candidates, not minimum
hardware requirements, locks on U4 controls or a specification for a new suite.

| Code | Consideration | Default proposed | Dial and guardrail | Root mapping |
| --- | --- | --- | --- | --- |
| TY1 | Measure within wide panels | Prose aims at 60-70 actual Latin characters per full line, ragged right; constrain its inner reading region | About 45-80 for prose comparison. A deliberate wider transcript remains reachable. Do not shrink text to enforce width or hide adjacent useful panels | VI1, NP1, NP3 |
| TY2 | Line height by reading job | Prose 1.5; event log 1.35-1.45; numeric rows 1.25-1.35 with row padding | Airier prose around 1.65 or tighter around 1.4 for review; spacing overrides remain free. Tall glyphs and multiple scripts may need more height | VI1, NP1, NP3 |
| TY3 | Paragraph and turn rhythm | Prose gap about 0.7em, no first-line indent; new speaker gets a new block | Book letters may use first-line indents with smaller gaps. Avoid both large indents and large gaps by default; never split a sentence just to fill a page | NP1, NP3 |
| TY4 | Font roles and shared scale | Stable readable sans for controls/data; a text serif option for narrative; existing VI1 tokens drive sizes | Start prose near 1.125rem, routine labels/data near 1rem and secondary metadata near 0.875rem, relative to the user's base. Same-family mode and larger text stay reachable; essential costs never become fine print | VI1, MI9, MI14 |
| TY5 | Numerals fit their job | Lining tabular figures for changing stats, timers, prices and comparison columns | Oldstyle proportional figures optional in literary body copy and dates in letters. Style and width are independent axes. Missing font features fall back without losing meaning | VI1, CS1, MI37 |
| TY6 | Data alignment | Left-align labels; right-align comparable values with stable unit columns; reserve plausible width for updates | Decimal alignment for precision-heavy comparisons, proportional prose elsewhere. Tabular digits do not solve different digit counts or units; expand long values rather than clip | VI1, MI10, MI11 |
| TY7 | Dialogue attribution | Explicit known speaker name before each turn, consistent alignment; narration uses its own role | Portraits, small caps, subtle color or voice badges can support names. Inner voices retain labels. Long names wrap; identity labels use only information the player knows | NP1, NP2, NP3, CS1 |
| TY8 | Quotes and emphasis | Locale-aware quotation marks for quoted speech in narration; italics for brief stress; bold for a few discovery anchors | Tagged dialogue need not repeat enclosing quote marks. Letters use block quotes where needed. Longer thoughts get an attributed block instead of paragraphs of italics; underline remains a link cue | MI12, NP3, MI39 |
| TY9 | In-world documents | Letter: sender/date/body/signature; notice: short heading and instruction; receipt: aligned data; system: frame and status labels | Handwriting or display type in a title/signature, readable body underneath. Documents may feel distinct without becoming screenshots of text, stained low-contrast pages or unreadable cursive | CS1, MI15, MI37, MI39 |
| TY10 | Text reveal | Instant prose and logs; player advances scene beats | Optional typed or paced scene mode with adjustable tempo. Reveal remainder first, advance on the next deliberate input. Skip only actually seen lines by default; altered outcomes count as new | NP5, NP3 |
| TY11 | Log density | Compact event rows with distinct timestamp, actor, event and consequence; hanging continuation aligns with event text | Cozy spacing or dense rows remain reachable. Repeated routine events may group with count and expand to originals; unique fiction and important receipts retain full text | NP3, MI11, MI13 |
| TY12 | Reading position | When looking back, hold the visible event/paragraph anchor and show new-entry count | Follow-live resumes by choice. Font, width and theme changes keep the same passage visible; do not drag selection or reading position to the latest event | NP2, NP3, NP5 |
| TY13 | Recaps and thread previews | One useful summary per open thread, with person/place/date and a link to its exact transcript | Preview length can grow. Show whether text is excerpt or summary; show source anchors. Keep unknown names unknown and avoid generating new facts | NP2, NP4, MI11 |
| TY14 | Dark and light reading surfaces | Inherit current player palette, solid background behind body text, no continuous glow or texture through prose | Light/paper, neutral dark and warmer surfaces via U4; select text weight for actual rendering. Mood accents belong at edges and headings, not on every sentence | VI1, MI39 |
| TY15 | Multilingual and invented scripts | Main reading text uses a font covering the language; short flavor script has a known-language gloss only when understood | Native scripts, transliteration or plain-label treatment stay reachable. An unknown inscription remains explicitly unknown; a readable mode never reveals its sealed meaning | NP3, CS1, MI39 |
| TY16 | Per-world font floor | Keep shared control/data face; reskin headings, document trim and limited voice cues | Optional world body face after legibility review. Same size token, readable stroke, distinguishable glyphs, real emphasis and language coverage. Player font override wins over world costume | VI1, CS1, MI37, MI39 |
| TY17 | OpenType and variable fonts | Standard kerning/ligatures for prose, numeric features by role, optical sizing when font supports it | True small caps for short speaker labels, slashed zero for IDs if useful. Avoid discretionary swashes in body copy and animated weight/width on persistent text | VI1, MI37, MI39 |
| TY18 | Text VFX and reading craft | Brief effect around a rare meaningful event; preserve a stable plain record and unaffected adjacent prose | Strong scene treatments remain possible under the existing effects owner. No permanent jitter, unreadable tiny conditions or combining-mark damage across routine text | NP5, MI12, MI37, MI39 |
| TY19 | Readable microcopy | Exact verb/object on actions; past tense on history; count and missing component written once | World diction can change the lead-in, not obscure the action or blocker. Relative time pairs with accessible exact time; zero, one and many use correct grammar | MI9-MI15 |

## Craft details worth keeping together

### Measure, shape and the laptop workspace

`ch` measures the advance of the font's zero, not an average prose character.
An initial `max-inline-size` near `60ch` is a tuning aid, not evidence of
60 characters per line. Count several representative full lines after the font
loads. A 700-900px panel could hold a shorter prose block and a modest rail;
1920px should not automatically stretch prose farther than 1366px. At increased
text size the rail can move below while other workspace panels remain useful.
Do not force a continuous story into newspaper columns with an ambiguous
reading order. Left-align flowing Latin prose, avoid full justification by
default, and localize wrapping/hyphenation rather than hard-wrap source text.

The proposed size roles extend VI1 rather than multiplying it: prose is a use
of an existing comfortable body token, numeric alignment is a style, and a
speaker is a role. Neither needs a new size for every world. Avoid a hierarchy
of progressively fainter and smaller text when some of it contains a cost,
condition or consequence. No font has been selected or benchmarked in this lane.

### Font features and dense stats

E14's monospace warning and E21-E23 below support separating grid art from
ordinary reading. A readable proportional sans with tabular figures can handle
stats without turning every panel into a terminal. Tabular width (`tnum`) and
oldstyle shape (`onum`) are independent; oldstyle does not mean proportional.
Lining plus tabular figures are the safer initial comparison treatment.
An optional prose face could use `oldstyle-nums proportional-nums`; numeric
fields could use `lining-nums tabular-nums`. These are illustrative CSS feature
choices, not source edits. Confirm the actual selected font supplies the glyphs.

Keep number formatting under the existing formatter direction: typography
does not invent precision or change a known range into an exact value. A
rounded overview and an exact detail may coexist if clearly labeled. Use
consistent separators and units by locale. Identifiers should keep ambiguous
`0/O`, `1/I/l` distinguishable; amounts should remain selectable text. Do not
enable fractions on slash-separated IDs or add slashed zeros to all prose.

Variable fonts can supply weight and optical size without many files (E23),
but axis availability is font-specific. Width changes alter measure and
weight changes can reflow text. Pick stable values for a role rather than
animating the font as an idle indicator. Keep ordinary shaping required by
Arabic or other scripts intact; optional Latin ligature choices must not
disable language shaping.

### Dialogue, documents and logs

Distinguish voice by attribution before decoration. A party scene with three
speakers should still make sense when copied as plain text. A named character,
narrator and inner voice can have different spacing or a subtle label style;
they do not each need a body font. Unknown speakers use a known description.
Color, portrait and alignment support the label rather than replace it.

MI12's first-name bold is an anchor for discovery, not a rule to bold every
proper noun. Apply it to the first genuinely known appearance in the relevant
reading context; archives should not gain new discovery emphasis just because
they rerender. Do not bold a still-secret identity. MI10 grammar and MI13 tense
help the reader tell past event from possible action without parsing the frame.
MI14's blocked count belongs next to the action, in full-size readable text.
MI15 may say "The ledger is blank" and then plainly offer "Record a note."

Letter/notice/system treatments can share the same readable body. Frame,
heading, signature and spacing carry much of the voice. A system window may
use mono for terse fields and brackets while a long explanation returns to a
prose face. Bloodline or ordinary narration need not acquire a system frame.
Never hide document conditions in tiny contractual type. A worn letter can
look worn at its edges while the words remain clear.

A wrapped log event is one event, not three new lines. Give timestamps their
own column and align continuation under the sentence, as Mudlet's wrapping
controls suggest (E14). Compact spacing applies between routine rows; a
paragraph inside an important event keeps prose spacing. Grouping duplicates
should preserve originals for NP3. Selecting text or scrolling backward holds
position; an unread counter can report ongoing play without moving the reader.

### Pacing, flavor scripts and text effects

Typed reveal can add a beat, but several hours of compulsory animation add
waiting. Default instant, with opt-in scene pacing. A reveal control completes
the current block before a separate advance can choose anything. Reveal by
grapheme cluster, not code unit, to avoid separating marks or emoji. An authored
pause can be bypassed. Automatic pacing should consider text length and locale;
no universal characters-per-second value is asserted. Logs, archives and stat
updates never replay typewriter effects. U4 owns reduced motion and the control
surface; this lane defines the reading behavior they should govern.

CJK needs its own measure check rather than English counts; E18 describes a
40-glyph width facility for CJK versus 80 for other text. Mixed-script names,
Arabic directionality and diacritics require real font coverage and logical
reading order. Flavor runes should occupy short headings or an inscription
region. When the character has no translation, a legible description such as
"Unfamiliar inscription" respects discovery; readability is not appraisal.
The presentation owner's "per-world readability dial" concerns in-world means
of knowing, not permission to make body text physically illegible.

The [text VFX rules](../../../PRESENTATION_AND_FOURTH_WALL.md#rules-for-text-effects)
already propose a plain sentence and static form (TX2-TX3). U11 keeps those
forms stable in history and lets a scene host a rare effect without resetting
the reader's place. Spaced letters, shrinking words, ghost text and combining
marks are scene materials, not persistent typography. An invented example:
a notice briefly stamps "SEALED", then leaves a normal readable notice. It
does not turn all subsequent costs into faint moving glyphs. No sealed file
was opened for this lane.

## Root-code map and U4 handoff

| Root code | U11 contribution | Boundary |
| --- | --- | --- |
| VI1 | TY1-TY6, TY14, TY16-TY17: role-based typography using shared size tokens | U4 owns player text-size/font controls; no new token count is mandated |
| NP1 | TY1-TY4, TY7, TY9: readable scene region inside the laptop workspace | No automatic global takeover or hiding routine panels is accepted here |
| NP2 | TY7, TY12-TY13: explicit speaker, thread preview and stable unread reading | Attention queue behavior belongs to its owner |
| NP3 | TY8, TY10-TY13, TY15: plain searchable transcript with original attribution | Search, storage and retention are not implemented here |
| NP4 | TY13: concise recap with source anchors, unknowns preserved | No summary generator or new canonical story truth |
| NP5 | TY10, TY12, TY18: instant/typed/paced behavior, stable history | U4 settings and effects owner remain authoritative |
| MI9 | TY19: exact verb/object, costs visible | Microcopy choice, not altered action semantics |
| MI10 | TY6, TY19: grammar, numbers and units survive long labels | Identity owner and formatter decide facts |
| MI11 | TY6, TY11, TY13, TY19: stable time field with readable exact detail | Do not rely solely on hover for needed information; U4 owns input access |
| MI12 | TY8, TY18: sparse first-known-name emphasis | No hidden identity exposure or repeated fake discovery |
| MI13 | TY11, TY19: past-tense receipt versus imperative action | Both treatments retain complete meaning |
| MI14 | TY4, TY19: readable named blocker and shortfall | No tiny footnote conditions |
| MI15 | TY9, TY19: world voice followed by plain next action | Empty state still identifies what is empty |
| CS1 | TY7, TY9, TY15-TY16: form follows fiction and known surface | No forced status window for every cheat |
| MI37 | TY5, TY9, TY16-TY18: system frame/fields distinct from ordinary prose | Mono is optional for long body text; sound is outside U11 |
| MI39 | TY8-TY9, TY14-TY18: world trim and fonts retain a legibility floor | Ornament never replaces a readable label |

## Source ledger

Loaded through web retrieval on 2026-10-14, without launching a browser.
SHOWN describes the loaded document, not measured game UI. Source summaries
are deliberately narrow; no whole text was copied.

| ID | Label and source | What was actually available |
| --- | --- | --- |
| E1 | STATED [Failbetter: Fallen London](https://www.failbettergames.com/games/fallen-london) | Developer page search excerpt: browser/text narrative. No measured typography |
| E2 | STATED [Sunless Sea interface update, 2016](https://www.failbettergames.com/news/interface-update-coming-to-sunless-sea) | Loaded lines 12-27: font problem, independent UI/text scale and log improvements |
| E3 | STATED [inkle: 80 Days](https://www.inklestudios.com/80days/) | Loaded lines 30-39: narrative, globe and choices. Wrong-domain fetch failed first; switched to actual developer domain |
| E4 | STATED [inkle: Sorcery!](https://www.inklestudios.com/sorcery/) | Loaded lines 21-43: rewritten story, map, choices and combat descriptions |
| E5 | STATED [Disco Elysium: Feld Playback Experiment, 2016](https://discoelysium.com/devblog/2016/12/20/feld-playback-experiment) | Loaded lines 11-14: reading importance and menu metaphor. Its fiction was not imported into our design |
| E6 | STATED [Fellow Traveller: Citizen Sleeper](https://www.fellowtraveller.games/citizen-sleeper) | Loaded lines 47-71: narrative RPG and dice/clocks/drives; images linked but not inspected |
| E7 | SHOWN [Kentucky Route Zero official site](https://kentuckyroutezero.com/) | Loaded description and language support, no typography measurement |
| E8 | STATED [Moral Anxiety: Roadwarden press kit](https://moralanxietystudio.com/presskit/roadwarden) | Loaded lines 50-57: dialogue, choices, parser and low animation |
| E9 | SHOWN [Ren'Py GUI guide](https://www.renpy.org/doc/html/gui.html) | Font/name/interface/dialogue/history configuration and translation examples; example values are not certified generated defaults |
| E10 | SHOWN [Ren'Py preferences](https://www.renpy.org/doc/html/screen_actions.html#preferences) | Instant text, speed, seen/all skip, auto-forward and spacing controls; maximum control ranges are not default speeds |
| E11 | STATED [Steins;Gate official English site](https://steins-gate.com/) | Loaded lines 7-12: long branching story and phone-based interaction only |
| E12 | SHOWN [Inform release notes](https://inform-fiction.org/manual/ReleaseNotes-6.3x.html) | Loaded lines 860-867: style roles and player-controlled interpreter appearance; separate guessed Glk URL failed |
| E13 | SHOWN [Twine cookbook: style text](https://twinery.org/cookbook/questions/style_text.html) | Format-specific emphasis guidance, not one engine-wide font default |
| E14 | SHOWN [Mudlet user interface manual](https://wiki.mudlet.org/w/Manual:Mudlet_User_Interface) | Loaded lines 364-386: wrap count, continuation indentation and experimental server unwrap; no local client run |
| E15 | SHOWN [Butterick: line length](https://practicaltypography.com/line-length.html) | Loaded 45-90 character recommendation and line tracking discussion |
| E16 | SHOWN [Butterick: line spacing](https://practicaltypography.com/line-spacing.html) | Loaded 120-145% guidance, font dependence and unitless CSS advice |
| E17 | STATED [Dyson and Haselgrove, 2001](https://www.sciencedirect.com/science/article/abs/pii/S1071581901904586) | Publisher search excerpt only: medium 55-character line supported effective reading. Direct fetch 403; alternate paper copy fetch also failed. No full-paper analysis claimed |
| E18 | SHOWN [W3C: Visual Presentation](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html) | AAA facility for measure/spacing/presentation, including 80/40 character distinction; no claim this project passes |
| E19 | SHOWN [W3C: Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html) | Override tolerance is distinct from author defaults; U4 owns compliance review |
| E20 | STATED [Piepenbrock, Mayr and Buchner, 2014](https://pubmed.ncbi.nlm.nih.gov/25135324/) | Indexed abstract and fetched record: polarity, pupil size and proofreading results, not long-session gameplay |
| E21 | SHOWN [OpenType: tabular/proportional figures](https://learn.microsoft.com/en-us/typography/opentype/spec/features_pt#tnum) | Loaded `tnum`/`pnum` definitions; alignment by width |
| E22 | SHOWN [OpenType: oldstyle/lining figures](https://learn.microsoft.com/en-us/typography/opentype/spec/features_ko#onum) | Loaded `onum` definition and independence from figure-width features |
| E23 | SHOWN [MDN: optical sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-optical-sizing) | Loaded optical-size behavior depends on an `opsz` axis; no selected font tested |

## Open review checks, not new required gates

| Code | Uncertainty to resolve if a typography slice is selected | Useful evidence |
| --- | --- | --- |
| O1 | Actual face, role sizes and measure on our laptop workspace | Rebuilt 1366x768 and 1920x1080 views with a long scene, dense log and stat panel; count real full lines after font load |
| O2 | Comfort over time rather than a pretty screenshot | Human reading comparison using the same text at several measures/heights, including returning to the line after a decision; no hours-long comfort claim from brief inspection |
| O3 | Font changes, long labels, large numbers and scripts | Zoom/text-size changes preserving passage position; mixed-script and fallback samples without clipping. Coordinate controls and override checks with U4 |
| O4 | Reveal, transcript and streaming semantics | Advance does not accidentally choose; fresh/changed text is not marked seen; archived text is complete; new log entries do not move backward readers |
| O5 | Reference evidence still based on recall or an excerpt | Edition-specific screenshots or developer material if exact copying becomes useful; original Bringhurst passage and full Dyson paper before asserting their detailed findings |

Recommended first comparison, INFERRED: TY1-TY4 with TY5-TY6 on an existing
scene/log/stat arrangement. Keep other TY rows available as considerations.
This pass adds no gameplay acceptance gate, no new settings subsystem and no
claim that reading comfort has been tested.
