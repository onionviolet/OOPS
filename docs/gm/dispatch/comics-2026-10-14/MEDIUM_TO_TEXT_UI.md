# K3: comic technique for a text-first desktop UI

## CHECKPOINT

2026-10-14. Research and documentation complete; proposals remain unselected.
Own only this file and [K3_REPORT.md](K3_REPORT.md). Shared checkout branch
`codex/gameplay-foundations`; preexisting dirty work and sibling reservations
preserved. Root palette is read-only. No source, bundle, test, save, private
pack, commit or push changes. No comic scans acquired or sealed files opened.

Target: 1366×768 laptop, with a wider 1920×1080 comparison. Visible proposed
outcome: stable actions beside a readable sequence of text panels, with optional
recaps and scene pages. Mobile optimization, drawn art, implementation and
playable acceptance are deferred. Wireframes are arithmetic sketches, not
browser evidence. Resume: root reviews the reconciliation rows and five ideas
in the report. A selected later build needs its own rebuilt desktop proof.

## Scope and authority

This extends CS1–CS17, CK1–CK9, CI1, CI2, CI11 and CA2 in the
[root palette](../../../COMIC_WORLDS_AND_MEDIUM_CONSIDERATIONS_2026-10-14.md).
The proposal is a comic reading grammar over the existing workspace: attribution,
grouping, omission, juxtaposition and occasional emphasis. A comic skin does not
grant a comic power, change world laws or reveal more information.

The live owners keep their subjects. Read the
[restraint direction](../../../PRESENTATION_AND_FOURTH_WALL.md#direction-restraint-makes-effects-land-weibao-2026-10-10),
[plain perceived layer, TX13](../../../PRESENTATION_AND_FOURTH_WALL.md#more-rules-when-and-how-effects-fire),
and [UI at scale](../../../UI_AT_SCALE_CONSIDERATIONS_2026-10-14.md)
for effects, placement, attention, typography and comfort. This lane links those
rules rather than restating their menus. The accepted
[desktop direction](../../../USER_VISION.md#standing-ui-priority-2026-10-13)
remains primary. The earlier [wiki pilot](../../../research/comics/REPORT.md),
[playthrough targets](../../../research/comics/PLAYTHROUGH_TARGETS.md) and
[bounded comparisons](../../../worlds/LORE_AND_CONTINUITY.md#bounded-comic-comparisons)
own world selection and comic mechanics, not this rendering choice.

Evidence: **SHOWN** means inspected text with a location; **STATED** means an
attributed source reports it; **INFERRED** means our proposed transfer;
**MEMORY** means unchecked recall. A source-backed technique is not an accepted
UI decision. Player comments and critics below are individual accounts, not a
survey or a consensus. No reference game was played in this lane.

## T: technique and its text translation

**T0, editions and limits.** Scott McCloud, *Understanding Comics: The Invisible
Art* (1993), especially chapter 3,
“Blood in the Gutter,” and chapter 4, “Time Frames.” The
[author's overview](https://scottmccloud.com/2-print/1-uc/index.html) confirms the
1993 work and closure as reader participation. The University of Winnipeg's
[teaching summary](https://www.uwinnipeg.ca/1b19/docs/how-comics-work-web-cc-by-nc-nd.pdf)
also identifies six transitions and closure, in checked indexed text. Its full
PDF fetch exceeded the tool limit; Bennett supplies the readable text route.
Anina Bennett's [creator/teaching guide](https://www.bigredhair.com/about/teaching-comic-books/writing-guide)
summarizes those chapters, the six transitions and context-dependent pacing.
These are STATED from checked summaries, not a full book read or inspected
original panels. Chapter titles are locators; no edition-specific page numbers
are asserted here.

| Code | STATED technique, McCloud summaries above | INFERRED transfer to text |
| --- | --- | --- |
| T1 | Moment-to-moment: small changes in one subject. | One consequential instant split into short beats: grip, hesitation, release. Useful for tension; ordinary attacks stay compact. |
| T2 | Action-to-action: connected acts by one subject. | Group the attempt, settled result and aftermath in an ordered beat sequence. Keep any decision boundary between acts. |
| T3 | Subject-to-subject: focus changes within a scene. | Alternate clearly named speakers, or person then object, inside one scene. A reaction is attributed, not narrator-certified thought. |
| T4 | Scene-to-scene: a substantial shift in place or time. | A separator with location and elapsed game time, then a new scene. Idle return and reported remote events fit here. |
| T5 | Aspect-to-aspect: facets of a place, mood or idea. | A short cluster of perceived details: rain, an empty seat, a cooling cup. Avoid making each detail a new actionable system. |
| T6 | Non-sequitur: no apparent relation between adjacent images. | Optional surreal juxtaposition in fitting worlds. Label a dream or dislocation where known; keep transaction results understandable. |
| T7 | Closure: the reader supplies connections across gaps. | Omit redundant movement prose between established causes and results. Leave costs, choices and uncertainty explicit. |
| T8 | Time comes from content and arrangement together. | Separate game duration, narrative sequence and reading pace. A panel may contain several utterances; its border is not a clock. |

All six categories are a useful vocabulary, not an exhaustive universal grammar.
The text examples are original proposals. **CS15 is CORRECTED:** extra small
panels can stretch an instant, while a sparse large panel can be read quickly.
Panel count and width alone do not mean fast versus slow. This qualification is
explicit in [Bennett's timing discussion](https://www.bigredhair.com/about/teaching-comic-books/writing-guide).
In our UI, a before/after timestamp states actual duration; spacing only invites
a reading rhythm. More text beats do not slow the simulation by themselves.

**T9, Eisner's frame and sequence.** Will Eisner, *Comics and Sequential Art:
Principles and Practices from the Legendary Cartoonist*, revised Norton edition
(2008, ISBN 9780393331264). The
[publisher](https://wwnorton.co.uk/books/9780393331264-comics-and-sequential-art)
confirms the edition; the [catalogue/contents](https://books.google.com/books/about/Comics_and_Sequential_Art.html?id=hgmp1CF872sC)
identifies “Comics as a Form of Reading,” “Timing,” “The Frame” and “Expressive
Anatomy,” and describes treatment of dialogue and framing. NYU Press's
[Sequence essay](https://keywords.nyupress.org/comics-studies/essay/sequence/)
summarizes Eisner's account of arrangement within and between frames as narrative
grammar. These points are STATED; the complete revised text was not inspected.
MEMORY, UNVERIFIED: exact gesture taxonomies or numerical panel timing rules.
They are not used as evidence or thresholds below.

INFERRED: a text panel chooses what deserves focus. “The guard folds the letter”
can perform the expressive work of a pictured hand without claiming a hidden
emotion. Pair it with the next spoken line for a meaningful sequence. A frame
may hold speech, a perceived action and its result together. Framing should
preserve the useful relation, rather than give every sentence a border.

### L: lettering carries voice and attribution

STATED: Nate Piekos's professional
[Blambot reference](https://blambot.com/pages/comic-book-grammar-tradition)
explicitly treats these as traditions with editor-specific variation. The
following short summaries concern mainly American comics, not a global code.

| Code | STATED convention, Blambot section locator | INFERRED text counterpart |
| --- | --- | --- |
| L1 | Speech tails point toward the mouth; thought tails use circles toward the head. “Balloon Tails,” “Thought Balloons.” | Visible speaker attribution and channel labels do the job without a drawn head. |
| L2 | Dashed balloon outlines traditionally mark whispers; telepathy has variable styles. “Whispering,” “Telepathic Balloons.” | `Speech · whisper` or `Telepathy · received`; retain normal readable type. |
| L3 | Radio balloons often use regular spikes and a lightning tail; shout bursts are more irregular. “Radio Balloons,” “Burst Balloons.” | `Radio · source` versus `Speech · shout`; optional trim differs, not just colour. |
| L4 | Off-panel tails can meet the border; some editors omit them. “Off-Panel Dialogue.” | `Voice behind the door` or a known source name. Off-panel does not mean remotely known. |
| L5 | Captions distinguish time/location, inner monologue, spoken voice and editorial voice. “Captions.” | A label/subkind prevents an attributed belief from reading as objective narration. |
| L6 | Bold italic can mark emphasis; SFX letterforms suggest a noise's quality/intensity. “Bold Italic,” “Sound Effects.” | Brief emphasis and a sound word beside a plain description; decorative fonts stay out of long prose. |

**CS1 CONFIRMED:** letterer Todd Klein
[describes Dream's white-on-black lettering](https://kleinletters.com/NeilGaimanLettering.html),
including its production through negative photostats. His account credits the
reversal idea to editor Karen Berger and says he opposed it initially. This
confirms that example, not a font law for all gods or dead people. INFERRED: a
known voice may have a restrained border or name treatment. A disguised or
unrecognized speaker should not acquire an identifying signature that leaks
their truth.

**CS2 CORRECTED:** dashed tail = telepathy is not supported as a general rule.
Blambot associates a dashed *balloon outline* with whispering; telepathy varies.
Radio styling broadly fits the root, but shape identifies channel/source rather
than a distance measurement. Tiny whisper text is a print convention, not a
reason to shrink our body text. **CS3 QUALIFIED:** rounded/uneven borders and
gutter treatments are flashback options in
[Bennett's border discussion](https://www.bigredhair.com/about/teaching-comic-books/writing-guide).
Sepia is MEMORY, UNVERIFIED as a general convention. `Memory · then` supplies
the meaning whichever trim a world chooses.

## G: game comparisons, including costs players noticed

These references serve different purposes. Comic setting, comic-looking art,
play inside a page, and a comic-shaped record are separate observations. Any
transfer in the last column is INFERRED. Franchise names remain references;
wireframes and proposed content use original people and places.

| Code / reference | What the sources show or state | Attributed praise and dislike | Useful transfer |
| --- | --- | --- | --- |
| G1 Comix Zone (1995; SEGA Classics manual) | SHOWN: [official manual, English p. 3](https://cdn.steamstatic.com/steam/apps/34272/manuals/CZ_PC_MG_EFIGS_US.pdf) describes comic pages, cleared panels and route arrows. STATED: [GameSpot's retrospective](https://www.gamespot.com/reviews/comix-zone-review/1900-6165085/) describes gutter leaps and speech balloons. | [GameFAQs player review 164821](https://gamefaqs.gamespot.com/genesis/10975-comix-zone/reviews/164821) praises detailed comic scenery and balloons, but dislikes punishing deaths and repeated replay. | Borders can express route or scene boundaries. Borrow legible transitions; do not make reading a dexterity or survival test. |
| G2 Wildermyth (PC event comics) | SHOWN: developer-hosted [Comic Editor Reference](https://wildermyth.com/wiki/Comic_Editor_Reference) separates narration/speech/thought, prompts, choices and outcomes; [Panel styles](https://wildermyth.com/wiki/Panel_styles) gives full/half/third widths. [Effects](https://wildermyth.com/wiki/Effects) separates event comics from ordinary abilities and interval tidings. | [RPGamer](https://rpgamer.com/review/wildermyth-review/) praises drawn story scenes; [RPGFan](https://www.rpgfan.com/review/wildermyth/) reports repeated dialogue. A [2021 player thread](https://www.reddit.com/r/wildermyth/comments/q71hcw/a_mod_or_setting_to_make_the_story_panels_come_in/) objects to waiting for moving text. A reply promises an option next patch; this lane did not verify its eventual delivery. | A selected story beat can become a page, while routine combat remains a log. Variation should change circumstances or meaning, not merely swap names. Instant presentation is a useful default. |
| G3 Batman: The Telltale Series (2016), plus Shadows Edition (2019) | STATED: [episode-one review](https://www.gamespot.com/reviews/batman-the-telltale-series-realm-of-shadows-episod/1900-6416488/) describes thick outlines, scene lighting, dialogue and staged action. [Telltale](https://www.telltale.com/news/batman-shadows-edition-press-release/) confirms a noir makeover. This is cinematic comic styling; checked sources do not establish a continuous navigable page grid or a balloon-based reading mode. | [GameFAQs player MTLH](https://gamefaqs.gamespot.com/pc/193215-batman-the-telltale-series-episode-1-realm-of-shadows/reviews/163036) welcomes investigation/planning and the Bruce story, but finds action input disconnected from its spectacle. A [player discussion](https://www.reddit.com/r/telltale/comments/lxjyv5/is_batman_just_notoriously_broken/) contains both glitch complaints and reports of problem-free play. | Let cuts and captions frame a consequential choice; show what input actually changed. Noir styling can be an option without requiring whole-workspace rearrangement. |
| G4 XIII (2003), with the 2020 remake kept separate | STATED: [contemporary review](https://www.gamespot.com/reviews/xiii-review/1900-6084270/) describes readable SFX and inset panels; [El País](https://elpais.com/diario/2004/03/11/ciberpais/1078974151_850215.html) describes footstep/explosion words and monochrome memory scenes. | [MobyGames' firsthand reviews](https://www.mobygames.com/game/11251/xiii/) praise presentation while criticizing core play. Direct fetch failed; this is checked indexed text, not a full review read. The [2022 post-update reviewer](https://as.com/meristation/2022/09/16/analisis/1663317742_292080.html) still criticizes remake visuals/design, whereas [Microids](https://www.microids.com/xiii-remake-a-major-update-and-the-switch-version-coming-september-13/) says art, AI and technical systems were reworked. Neither account proves today's runtime. | SFX can convey a perceived sound as information, with source/range uncertainty. An inset reaction is distinct from a full scene. Record flashbacks as recalled history, not new actions. |
| G5 Marvel's Midnight Suns (2022 covers/Photobooth) | SHOWN in a [firsthand feature guide](https://attackofthefanboy.com/guides/midnight-suns-make-the-marvel-comic-covers-of-your-dreams-with-this-feature/): mission-end generated covers, editable poses/layout and gallery records. This is a commemorative surface, not evidence that combat or dialogue proceeds in comic panels. No official feature explanation was located in this pass. | A [player thread](https://www.reddit.com/r/midnightsuns/comments/zng5nm/loving_the_photobooth/) enjoys covers as mission memorials but wants custom text and includes a player who missed the feature. Separate [discussion](https://www.reddit.com/r/midnightsuns/comments/1budd9y/) splits over friendship/dialogue pacing. These complaints do not establish rejection of the cover feature. | An earned issue cover can be a title, place, participants and result in text. Give the record a clear home. A truthful commemorative cover and CK5's speculative future cover have different labels. |
| G6 Liberated (2020), a Sin City-style noir comparison | STATED: [official site](https://liberated.games/) presents gameplay/story across comic pages; [publisher store text](https://store.steampowered.com/app/875310/Liberated/) references Frank Miller and Eisner. [Cubed3's Switch review](https://www.cubed3.com/games/reviews/nintendo-switch/liberated) describes static frames, animated scenes, dialogue choices and playable cells. This is a style comparison, not a Sin City adaptation. | [GOG player review, near end of first review page](https://www.gog.com/en/game/liberated) praises direction/tension, but dislikes repetitive play, jarring 2D/3D shifts and hard-to-distinguish characters. Cubed3 praises the noir backdrop yet reports advancing just as a balloon appears, losing dialogue. | Reveal readable content before an advance can dismiss it. Stable panels and explicit speaker names support noir without low-contrast prose. |
| G7 The Silver Case (1999; 2016 remaster), visual novel/adventure window presentation | SHOWN: [PLAYISM DevLog 5](https://playism.com/cn/news/2016/1006/the-silver-case-devlog-5/) explains scripted placement/timing of text, name, image, camera and sound windows. This is a panel-like Film Window composition, not a claimed selectable “comic mode.” | [Steam firsthand reviews](https://steamcommunity.com/app/476650/reviews/?browsefilter=toprated) include praise for style and inferred narrative connections, alongside complaints about slow repeated transitions and clunky movement. [Nintendo Life's 2425 review](https://www.nintendolife.com/reviews/nintendo-switch/silver_case_2425) finds shifting text/portraits distracting. | Text, source attribution and small scene details can be composed separately. Keep their reading order stable and their entrance instant by default. |
| G8 The 25th Ward: The Silver Case (2018 remake) | STATED: [publisher-authored store description](https://store.steampowered.com/app/697650/The_25th_Ward_The_Silver_Case/) confirms Film Window returns; the collection [official site](https://nisamerica.com/the-silver-case-2425/) distinguishes the two games. It is another windowed VN/adventure, not evidence that panel toggles are standard in visual novels. | [Nintendo Life's collection review and reader comments](https://www.nintendolife.com/reviews/nintendo-switch/silver_case_2425) contain both criticism of distraction/pace and appreciation of the presentation and story. Its criticism covers the collection, not an isolated PC build audit. | A remembered account can open beside the present scene. Borrow juxtaposition, with a labelled transcript alternative; a player's windows stay where they placed them. |

**G9, contradictions retained.** A source can praise a game's comic look and
dislike its play. Wildermyth praise and repetition complaints coexist; Silver
Case's style and distraction accounts coexist. Microids' update claim and the
post-update XIII review disagree about success, not the existence of the update.
None implies that every player wants the same skin. MEMORY, UNVERIFIED: exact
animation timings, reference-game screen-reader support and a generic VN
“panel mode” toggle. No such claims guide the sketch.

## U: log kinds, beats and pages

**U1, live seam (SHOWN).** [display.js](../../../../src/display.js),
`log_message` around lines 863–1053, creates a div and assigns semantic event
classes/groups. Routine groups have caps; dynamic loot replaces an earlier node;
current log-follow/unread handling preserves backward reading unless Always
follow is chosen. [index.html](../../../../index.html), message region around
671–701, has category filters and no explicit log live-region attribute there.
This was source inspection, not browser or screen-reader proof. Historical line
numbers in the presentation owner's implementation note have shifted.

[event_feed.js](../../../../src/event_feed.js), `eventFeed`, explicitly excludes
the global simulation log, filters discovered events and received player
accounts, and projects completed receipts. This is a useful existing knowledge
boundary. It is not already a general comic recap/archive implementation.
Its `news` slice is also bounded. K6 owns the deeper engine-fit assessment.

**U2, CI1 refinement (INFERRED).** Separate *what the entry says* from *how a
beat is laid out*. Caption, speech, thought and SFX are content kinds. Recap,
splash and silent are beat/page treatments that may contain several kinds.
A splash containing speech should not lose its speaker because `kind=splash`.
Keep existing category/type independent so Combat and Loot filters retain their
meaning. Unannotated text can render as a neutral caption; that is a rendering
fallback, not proof of old-save compatibility.

| Code | Content or treatment | Suggested ordinary text form | Per-world/player dial |
| --- | --- | --- | --- |
| U3a | Caption | `Day 12 · Wharf` then perceived scene text; optional source/subkind. | Objective narration, diary voice or attributed account where fiction permits. |
| U3b | Speech | `Mara · speech: “The ferry has left.”` | Small rounded trim; channel labels remain readable without it. |
| U3c | Thought | `Your thought: “Try the bridge.”` or `Received thought · Mara`. | Cloud trim if desired. Other people's thoughts require CK2/CK3 means. |
| U3d | SFX | `KNOCK · three taps from the door.` | Plain default; emphasis only for a fitting significant sound. |
| U3e | Recap | `Previously · since Day 12, 18:00` with changed/open thread rows and record links. | Brief digest to browsable issue page; return time does not invent developments. |
| U3f | Splash | Scene title, one decisive fact and aftermath link. | Full width within the reading surface; wider page view when explicitly opened. |
| U3g | Silent beat | Quiet spacing and a restrained perceived detail, with an equivalent description available. | Minimal trim to optional art. No empty box substitutes for a consequential fact. |
| U3h | Flashback treatment | `Memory · Day 8 · recalled now on Day 12` on existing entries. | Frame change or inset. Recall does not rerun rewards, actions or first cues. |

**U4, CI2 refinement (INFERRED).** An entry is one attributed statement; a beat
is a meaningful unit; a scene groups beats with shared context; a page is their
reading arrangement. Receipt order and scene order remain available regardless
of columns. Stable record references allow regrouping without recreating causes.
Use [story W1](../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md#w-mining-the-books-for-story-shapes)
and the actual [P26 beat-template owner](../procgen-2026-10-13/p26/BEAT_TEMPLATES.md)
for semantic scenes. P26 is a lane designation, not a beat-template row code.
K3 adds presentation hints, not a second story or simulation engine.

Default + Dial + Reasonably: default to automatic grouping of causally related
settled entries, with detail expandable. A world can give rare scenes more
beats or juxtapose remembered reports. The player can prefer flat prose.
Grouping preserves each action's cost, time, unresolved state and refusal route;
compression is not permission to fabricate a connective event or hide a choice.

**U5, CK7 recap source (INFERRED).** Build a digest from durable, player-known
records and genuine before/after states, with links to what was recorded.
The capped display DOM is insufficient. Where the archive lacks detail, say
“Earlier detail not retained” rather than reconstruct a scene from truth the
player never learned. Offer an issue page when requested, with a visible return
to current work. An idle check-in gets a useful summary without mandatory page
turns. The UI-at-scale NP4 and IN3 owners retain recap/attention placement.

**U6, CI11 and CA2 (INFERRED).** Choose the skin separately from world laws and
power availability. A prose world can use framed text; a comic world can use a
plain log. Keep panel identity, command labels, known facts and selected records
shared. Default to quiet borders and ordinary type; world trim and illustrative
art are optional. Stronger presentation follows the existing restraint owner.
A CSS grid may arrange scene cards, but the narrow workspace log is usually a
single ordered stream. Grid presentation belongs where text has enough measure.

## R: reconciliation of assigned root rows

These are review returns to the root owner, not edits to the root or decisions
for Weibao. “INFERRED” rows remain proposals; they have not been canon-checked
or implemented merely because a related medium convention exists.

| Root row | Evidence/status | Default text mapping, dial and material constraint |
| --- | --- | --- |
| CS1 | CONFIRMED, STATED: Klein's Dream example, L above. Universal speaker-kind rule remains INFERRED. | Name/channel first, optional signature trim. Only perceived/recognized identity determines the signature. |
| CS2 | CORRECTED, STATED: Blambot, L2–L4. | Channel/source labels; dashed outline can mark whisper. Do not equate tail shape with measured range or shrink whisper text. |
| CS3 | QUALIFIED, STATED: Bennett's border/gutter examples; sepia MEMORY, UNVERIFIED. | Memory header with event time and recall time. Frame dial is optional, and a recollection is not a new settlement. |
| CS4 | INFERRED; accepted restraint supports the direction. | Quiet observed aftermath plus space. An accessible description carries the same perceived scene; no hidden truth or compulsory timed hold. |
| CS5 | INFERRED rarity policy; splash format STATED in Bennett's guide. | Full reading-surface card for a fitting turn. Dial frequency locally; repeated routine entries normally remain quiet. “Never for routine” is a taste default, not a universal content ban. |
| CS6 | INFERRED, compatible with current known-only feed. | `Report received · from Dock office · about 18:00` or an earned remote-sense scene. Occurrence and receipt times differ. Skin alone grants no off-screen knowledge. |
| CS7 | INFERRED, not a verified close-trigger hook. | End a scene on an actually pending thread. Return recap states resolved/open/unknown; it need not resolve every hook. No extra crisis is created because the tab closed. |
| CS8 | INFERRED gameplay dependency, not a lettering fact. | Costume detail/condition in self or observed description. Changed reactions require an actual identity/condition owner; the skin cannot implement them. |
| CS9 | INFERRED gameplay dependency; prior pilot M6 is the reference. | Show an observed clue or NPC line, not a hidden suspicion meter. A signature voice/font must not accidentally certify the secret identity. |
| CS10 | INFERRED consequential-event treatment. | A short unmasking scene, perceived witnesses and known aftermath. Weight/frequency dial by world; visual emphasis grants no identity consequence. |
| CS11 | INFERRED. | Detail pair from recorded observations: old sign, fresh paint. Never infer revival or status-quo restoration from cosmetic trim. |
| CS12 | INFERRED, already labelled so in root. | Era label and optional vocabulary/frame shift. Palette/style changes do not rewrite names, facts or past accounts. An actual reboot belongs to world-law owners. |
| CS13 | INFERRED. | Known title-holder labels with record links. “Former” or “second” only when learned; present and historical references retain their original dates. |
| CS14 | INFERRED; story Z1/P26 owns recurrence. | Reuse an established gag with changed circumstances, usually a quiet caption. Avoid compulsory animation or repeated page interrupts. |
| CS15 | CORRECTED, STATED: T8 and Bennett's timing qualification. | A few short beats can slow a decisive instant; routine repeated action compresses. Show elapsed time explicitly. Reader pace and simulation time are separate. |
| CS16 | INFERRED. | Optional received mail in Records, with author/source/date. Dial audience by world; letters show those voices, not a global reader approval statistic. |
| CS17 | INFERRED; G1/G6 demonstrate issue/page framing. | Stable scene/issue labels in archive. Event-time anniversaries can earn a fitting note; issue labels do not require a new yearly reward or milestone mechanic. |

| Root row | Evidence/status | Presentation and knowledge boundary |
| --- | --- | --- |
| CK1 | Existing pilot M1 is SHOWN/STATED in the earlier report, not rerun here; comic sight itself INFERRED. | Appraisal rows in the existing reading surface. Six ranks are available only with actual appraisal/source means; the skin does not disclose them. |
| CK2 | INFERRED power; captions' multiple voices STATED, L5. | `Received self-account · speaker` with confidence/source where known. It may be a mistaken belief, rather than omniscient narration. |
| CK3 | INFERRED power; thought-balloon convention STATED, L1. | Received surface thought only for eligible sensed actors. “Same panel” describes a fiction dial for focus/proximity, not who happens to be in the CSS grid. |
| CK4 | INFERRED power. | Separate `Glimpse · possible next beat` from completed log. Cropping is informational uncertainty, not clipped readable text. Resolution links back without pretending every glimpse was inevitable. |
| CK5 | INFERRED power. | `Possible cover · source unknown/known` as a forecast in Records. Dramatic ambiguity is labelled; archival earned covers (G5) stay factual. Default false-positive behavior is a per-world law question. |
| CK6 | Editorial asterisk convention STATED, L above; record-link power INFERRED. | An editor note links the player's own retained record. Ordinary recap/history usability need not be locked behind a cheat; extraordinary inaccessible recollection can be. |
| CK7 | INFERRED; overlaps UI-at-scale NP4/IN3. | Free usability recap of known facts; dial style/length. Extra remote or lost-memory knowledge requires a distinct earned ability. Display history caps create a real source constraint, U5. |
| CK8 | INFERRED power/continuity dependency. | Known continuity/version and prior expectation beside observed divergence. Styling never authenticates which universe this is or imports later canon. |
| CK9 | Earlier pilot M10 reference; power/tracker INFERRED. | Player Records file: last observed encounter, received escape report, current whereabouts unknown. “Next likely return” is an attributed estimate only when supported; no private scheduler leak or default enemy dossier UI. |

| Root row | Evidence/status | Refinement |
| --- | --- | --- |
| CI1 | INFERRED; current category/type seam SHOWN, U1. | Content kind and beat treatment are separate; retain event category and plain perceived text. Neutral-caption fallback does not prove migration. |
| CI2 | INFERRED; P26 semantic-template owner checked. | Beat grouping joins attributed entries and real receipts. Pages are views of that structure; chronology and source links survive layout changes. |
| CI11 | INFERRED presentation; accepted desktop scope confirmed in live owners. | Ordered framed text at 1366×768; optional grid in a wider reading view. Text width, actions and independent panels outrank a rigid comic-page imitation. |
| CA2 | INFERRED abstraction, compatible with live presentation/placement owners. | Skin is separate from world/power semantics. Shared content and commands, optional trim; saved-layout or persistence changes still need a compatibility decision. |

## W: comic skin sketches

All sizes are illustrative CSS-pixel budgets at 100% scale. They account for
the full stated viewport, not browser chrome; usable client height still needs
measurement later. The outer workspace remains familiar. Scene cards are a
reading view inside it, not extra windows for every line. No new world priority
or gameplay scope is selected here.

**W1, 1366×768 workspace.** Width: margins 16×2 + left 250 + center 636 +
right 424 + gaps 12×2 = 1366. Height: top 48 + bottom 40 + margins 16×2 +
two gaps 12×2 + body 624 = 768. Actions receive the largest work region;
the log uses one readable column. At larger text sizes, these allocations
adapt rather than shrink the font to preserve the sketch.

```text
+-----------------------------------------------------------------------+
| Day 12  18:10 | Wharf | Work: paused | Needs you: 1 | Skin: Comic      |
+----------------+--------------------------------+---------------------+
| SELF           | HERE / LOCAL ACTIONS           | RECORDS / LOG       |
| Vitals         | [Ask ferry times] [Take bridge]| [Log] [Issues]      |
| Gear           | [Rest] [Inspect notice]        | 12.3  Wharf         |
| Costume: coat  |                                | +-----------------+ |
|                | CURRENT WORK                   | | Caption         | |
|                | Bridge crossing, not started   | | The bell stops. | |
|                |                                | | Mara · speech   | |
|                | CONTEXT / SELECTED DETAIL      | | "Last boat."    | |
|                | Ferry notice · observed today  | +-----------------+ |
|                | Fare and actual departure time | +-----------------+ |
|                |                                | | Afterward       | |
|                |                                | | Empty moorings. | |
|                |                                | +-----------------+ |
|                |                                | [3 new] [Details]   |
+----------------+--------------------------------+---------------------+
| [Save] [Export] [Import]                 [Effects] [Text] [Help]        |
+-----------------------------------------------------------------------+
```

This original example illustrates attribution and a quiet aftermath, not an
implemented ferry action. At this width, a splash spans the log's reading width,
not the entire application. Opening an issue deliberately can use the center
reading space, with a clear Back control and work/attention still visible.

**W2, 1920×1080 workspace.** Width: margins 16×2 + self 280 + actions 600 +
context 400 + records 572 + gaps 12×3 = 1920. Height under the same top/bottom
assumptions leaves body 936. This depicts the wider allocation proposed by the
placement owner; the existing layout's real fourth-column support is not claimed.

```text
+---------------------------------------------------------------------------+
| Time / place / current work / attention                      Skin controls |
+-------------+---------------------+------------------+--------------------+
| SELF        | ACTIONS + WORK      | CONTEXT          | RECORDS + LOG      |
| Vitals      | Common verbs        | Selected person  | One-column live log|
| Build/gear  | Running jobs        | or transaction   | [Open issue]       |
| Held powers |                     |                  | Known record links |
+-------------+---------------------+------------------+--------------------+
| Save and recovery                                    Reading preferences  |
+---------------------------------------------------------------------------+
```

**W3, explicitly opened issue/recap.** A two-card row is suitable in a broad
center/context reading region, not squeezed into the 424-pixel laptop log.
Prose inside a wide splash still keeps a comfortable measure. The reading order
is numbered and matches the document order. The page can scroll within its
region; expanding a scene never silently moves the reader's live-log position.

```text
+-------------------------------------------------------------+
| [Back to work]  Issue 12: The missed ferry  [Plain transcript] |
| Previously: since Day 12, 18:00. Two recorded changes.        |
+----------------------------+--------------------------------+
| 1 · Caption                | 2 · Speech                     |
| Wharf, 18:05. Bell sounded. | Mara: "Last boat."             |
| [Recorded event]           | [Conversation]                 |
+----------------------------+--------------------------------+
| 3 · Quiet aftermath                                         |
|                 The moorings are empty.                      |
| [Description]                                               |
+-------------------------------------------------------------+
| Memory inset · Day 8, recalled now                           |
| Your note: the bridge closes after dusk. [Original note]     |
+-------------------------------------------------------------+
| Open thread: choose a route. [Return to local actions]       |
+-------------------------------------------------------------+
```

Default + Dial + Reasonably: ordinary live log uses quiet single-column beats;
the player opens issue pages when useful. Worlds may lean toward diary captions,
noir frames, linked speech or spare silent space. Optional stronger treatments
can make a significant turn feel different without forcing every transaction
into a panel-advance sequence. A recap opens with actual recorded changes and
open threads; a splash is a treatment of a fitting fact, not new content.

## A: accessibility notes specific to comic reading

These are INFERRED design notes grounded in the cited standards, not an
accessibility conformance claim. Existing accessibility and presentation owners
remain authoritative; no screen-reader, keyboard or motion check was run here.

| Code | Consideration and source | Comic-specific application |
| --- | --- | --- |
| A1 | [WCAG meaningful sequence](https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html) requires a programmatically available meaningful order. | Use ordered scene/beat structure and speaker/channel text. CSS layout follows it; avoid masonry that changes sequence. A decorative tail or frame is hidden from assistive tech, not its attribution. A CSS grid does not require ARIA grid semantics. |
| A2 | [WAI-ARIA log](https://www.w3.org/TR/wai-aria-1.2/#log) describes append-order live content and a polite default. | A named live-log surface can announce completed beats; offer announcement pause/digest and a static transcript. Reopening an old issue is not a burst of new live announcements. Authoring a flashback appends a labelled recall; it need not insert “new” text into earlier chronology. |
| A3 | [WCAG use of colour](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) disallows colour as the sole meaning. | `Memory`, `Radio`, speaker name, timestamp and known uncertainty survive monochrome/noir themes. Whisper text stays readable; reduced saturation is trim, not information. Font choice alone cannot identify a source. |
| A4 | [Animation from interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) and [Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) explain motion controls. | Instant panels default; optional page turns/type-in have static equivalents and skip. A first advance reveals remaining text; a distinct subsequent advance moves on, addressing G6's accidental-skip report. No shake moves a pending click target. |
| A5 | [WCAG reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) supports zoomed reading. | A two-panel scene reflows to one ordered column when text grows. Provide equivalent quiet-beat description and plain transcript; neither has hidden truth. Test long names, font fallback, zoom, keyboard focus return, grayscale and screen-reader beat order in a later build. |

A visually silent comic image still contains information. A completely empty
text box usually does not. Default proposal: one short perceived detail with
quiet space, or optional art with the same available description. If a world
uses visual silence, its description can be visually tucked but accessible to
any reader, rather than a secret narrator channel for assistive technology.
The description must describe the perceived scene, including an illusion if
that is what was perceived. A decorative pause conveys no new fact and need
not become an extra screen-reader stop.

## Acceptance boundary

This lane completes a sourced research palette and text sketches. It selects
no build. If a slice is later authorized, its target outcome should be observed
on a fresh rebuilt origin at 1366×768 and wider, with ordinary actions and
readable log together. Needed proof includes grouping/receipt order, plain and
comic equivalence, known-only recap links, silent-beat description, reduced
motion, zoom and keyboard/screen-reader reading. Persistence additions need
their own compatibility decision and save/reload/import checks. No reference
game's aesthetic, source-only check or wireframe closes that playable gate.
