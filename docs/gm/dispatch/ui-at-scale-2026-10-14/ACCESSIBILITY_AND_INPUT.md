# U4: accessibility and input at desktop scale

## CHECKPOINT

2026-10-14: research and design complete; documentation checks recorded in
[U4_REPORT](U4_REPORT.md). Only this file and that report are U4-owned.
No implementation, build, browser session, save inspection or gameplay test.
All AX rows are INFERRED considerations, not accepted specs or new release gates.
Root palette and panel-kit owners remain read only to this lane.

Target: 1366×768 laptop and 1920×1080 desktop. Desired visible outcome: useful
simultaneous panels at comfortable text size, a predictable keyboard route to
each, quiet status feedback and readable optional effects. Mobile, touch,
controller, localization and engine selection remain deferred/outside U4.
U1-U3 own broader game patterns, cheat-window placement and engine fit.

## Authority and evidence

Read [COMMON](COMMON.md), AGENTS.md, PROJECT.md, user preferences and the
[standing UI direction](../../../USER_VISION.md#standing-ui-priority-2026-10-13).
These considerations extend [the root palette](../../../UI_AT_SCALE_CONSIDERATIONS_2026-10-14.md)
and [Panel kit](../../../PANEL_KIT.md), not their product authority.
The [W3 draft](../cheat-considerations-2026-10-13/W3_HIDING_UI_AND_INTEGRATIONS.md)
is a proposal source, especially HU17, not an accepted gameplay change.

SHOWN means a loaded page or line-addressed local source actually inspected;
it does not mean a game was played. STATED means the linked standard, developer
or reviewer says it. INFERRED means U4's proposed transfer. No MEMORY claims.
Web sources below were loaded on 2026-10-14. Historical posts retain their dates;
they do not establish current whole-game accessibility or version parity.

## Standards that matter as panels multiply

| Code | Evidence and hard part | Proposed desktop consequence, INFERRED |
| --- | --- | --- |
| ST1 | STATED: [Game Accessibility Guidelines full list](https://gameaccessibilityguidelines.com/full-list/) covers remapping, readable/resizable text, contrast, alternatives to color, contextual help, replayable instructions, reminders and disabling background movement. | Treat access as ordinary play settings. Keep reminders and instructions retrievable after dismissal; do not make a crowded workspace depend on color or remembered key chords. |
| ST2 | STATED: [Xbox guidelines](https://learn.microsoft.com/en-us/xbox/accessibility/guidelines) organize text (101), contrast (102), extra cue channels (103), narration (106), input (107), navigation/focus/context (112-114), errors (115), timing (116) and motion/photosensitivity (117-118). They are design guidance, not a compliance certificate. | Audit the journey between panels, not just each panel's markup. |
| ST3 | STATED: [XAG 106 narration](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/106) includes labels, roles, values and context changes. [XAG 113 focus](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/113) calls for a visible indicator and focus that stays on visible controls. | Stable region names, explicit expanded/selected state, no unexplained focus jump when a background job finishes. |
| ST4 | STATED: [XAG 107 input](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/107) recommends action remapping and single, non-simultaneous presses, plus toggles for holds. | Bind semantic verbs rather than screen coordinates. A chord may be an accelerator, but an ordinary menu/button route must remain. |
| ST5 | STATED: [XAG 117](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/117) addresses visual distractions and motion settings. | Separate text reveal, shake, glitch and ambient animation controls; reduced motion must preserve the message and action reach. |
| ST6 | STATED: [AbleGamers APX](https://accessible.games/accessible-player-experiences/) uses design patterns to find barriers and brainstorm solutions. | Frame evaluation as tasks: find a panel, understand a change, act, return. A long settings checklist alone is weak evidence of playability. |
| ST7 | STATED: [Can I Play That's Chicory review](https://caniplaythat.com/2021/06/10/chicory-a-colorful-tale-can-i-play-that-accessibility-review/) describes instant text, readable font choice, text-effect/shake/flashing switches, remapping and hold-to-toggle options. It also flags small emphasis text and absent scaling despite its positive assessment. Reviewed console experience, not tested PC parity. | Keep style optional and readable text adjustable. Even a strong feature set can fail at one small sentence or required input. |

### WCAG 2.2 browser subset

ST8: The normative reference is [WCAG 2.2](https://www.w3.org/TR/WCAG22/).
Useful criteria include semantic structure/sequence (1.3.1-2), color (1.4.1),
contrast (1.4.3, 1.4.11), resize (1.4.4), keyboard/no trap (2.1.1-2),
bypass blocks (2.4.1), focus order/visibility (2.4.3, 2.4.7), labels (2.4.6),
predictable focus/input (3.2.1-2) and name/role/value (4.1.2).
Normal text contrast is 4.5:1; large text 3:1. Text resize reaches 200% without
loss. Timing, pause and flashes are covered by 2.2.1-2 and 2.3.1, with stated
exceptions. Interaction animation control (2.3.3) is AAA, not an AA requirement.
This selected subset is not a full conformance audit.

| Code | Precise reading | Scale consequence, INFERRED |
| --- | --- | --- |
| WC1 | STATED: [1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) addresses reading without two-direction scrolling at 320 CSS-pixel width, with exceptions for content requiring two-dimensional layout. | Desktop zoom can produce this narrow CSS viewport. Test readable stacked panels at 400% on a 1280-wide viewport as a later accessibility check. This does not create a mobile product milestone. A genuinely two-dimensional map exception does not excuse clipped narrative or settings. |
| WC2 | STATED: [1.4.12 Text spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html) requires no loss with user overrides: line height 1.5×, paragraph spacing 2×, letter spacing .12× and word spacing .16× font size. It does not require these as authored defaults. | Avoid fixed-height prose and controls that cut off when spacing changes. Density and text size need independent controls. |
| WC3 | STATED: [2.1.4 Character shortcuts](https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html) requires character-only shortcuts to be switchable, remappable to include a non-character key, or active only when their component has focus. | Do not let a bare J action fire while a reader uses navigation commands or a player types search/notes. |
| WC4 | STATED: [2.4.11 Focus Not Obscured, AA](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) prevents author-created content from entirely hiding the focused component. Full non-obscuration and Focus Appearance are separate AAA criteria, 2.4.12-13. | Floating panels, sticky headers and pinned tooltips can hide a focus ring. Prefer full visibility as a design aim without mislabelling the AA minimum. |
| WC5 | STATED: [4.1.3 Status messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) makes status updates programmatically available without moving focus; the guidance warns against excessive chatter. | Announce action receipts and meaningful transitions. Do not narrate every XP tick. A modal's focus change does not also need a duplicate live announcement. |
| WC6 | STATED: WCAG [1.4.13 hover/focus content](https://www.w3.org/TR/WCAG22/#content-on-hover-or-focus), [2.5.7 dragging](https://www.w3.org/TR/WCAG22/#dragging-movements) and [2.5.8 targets](https://www.w3.org/TR/WCAG22/#target-size-minimum) cover dismissible/persistent hover help, a non-drag single-pointer route and minimum 24×24 CSS-pixel targets or qualifying exceptions. | Nested help needs an explicit open/close path. Panel layout needs Move left/right/up/down buttons as well as drag. Small desktop icons still need usable hit areas. |

## Precedents: take the mechanism and retain its limits

| Code | Game/client and evidence, STATED unless marked | What transfers, INFERRED; what remains unproven |
| --- | --- | --- |
| PR1 | Cogmind: [2024 developer UI scaling analysis](https://www.gridsagegames.com/blog/2024/01/full-ui-upscaling-part-1-history-and-theory/) explores a 60-row to 45-row UI for larger fonts, trading away simultaneous information. The [2014 developer account](https://www.gridsagegames.com/blog/2014/10/prototype-full-game/) describes mouse and keyboard routes but explicitly lacks key remapping then. | Preserve large-text layouts alongside dense ones. Keyboard efficiency and remapping are distinct. Historical omission is not a claim about the current release; screen-reader support and current binding coverage were not established here. |
| PR2 | Caves of Qud: [official 1.0 release notes, 2024](https://freeholdgames.itch.io/cavesofqud/devlog/845582/caves-of-qud-10-out-now) describe a cleaned-up control bindings menu, searchable options with advanced settings, correct category collapse selection and search through collapsed skill categories. | A panel-heavy game needs searchable controls and a safe selected parent when rows collapse. Keep common access controls visible while allowing deeper tuning. No claim here of screen-reader support, macros or a global verbosity mode. |
| PR3 | Dwarf Fortress classic: [Bay 12's May 12, 2010 log](https://www.bay12games.com/dwarves/dev_2010.html) explicitly records macro record/playback and resizing work. | Recording repeated input is a real precedent for reducing effort, not proof that ASCII is screen-reader friendly. This historical source does not establish current remapping, narration or verbosity coverage. |
| PR4 | NetHack: [3.6.3 Guidebook §9.15](https://nethack.org/v363/Guidebook.html) explains NHAccess symbols, traditional menus without overlays, relative coordinates, numpad conflicts with reader review and disabling status updates while retaining an attributes query. It also documents optional compile-time external message handling. | Stable symbols and on-demand status are useful; reader review keys must remain free. The manual's strong accessibility wording is specific to its documented setup, not proof for every modern port or browser terminal. |
| PR5 | DCSS: [official manual, macro section](https://raw.githubusercontent.com/crawl/crawl/master/crawl-ref/docs/crawl_manual.rst) distinguishes key maps from command macros and provides in-game editing/saving. Its [options guide §7](https://raw.githubusercontent.com/crawl/crawl/master/crawl-ref/docs/options_guide.txt) gives console screen-reader settings, removes animations/delays, puts messages at the top, disables short-message condensation and provides relative coordinates. Other sections expose message channels, repeat grouping and stop prompts. | Offer editable action bindings and reviewable message channels. Important contradiction: condensation helps the idle digest but can hinder reader review. Retain raw entries and independent speech verbosity. Console recommendations do not prove WebTiles access. |
| PR6 | Blind-accessible MUD precedent: [Alter Aeon's official blind-player entry](https://www.alteraeon.com/indexb.html) recommends clients and reader scripts over telnet, warning that fast output makes reader tuning hard. Its [official landing page](https://www.alteraeon.com/landing_pages/landing_page_all.html) recommends Mush-Z with reader support and sounds. | A text stream still needs a tuned presentation path and onboarding. Do not claim arbitrary MUDs, clients or ASCII maps are accessible merely because they contain text. Specific macros/verbosity controls were not verified for Alter Aeon in this pass. |
| PR7 | Mudlet: [current UI manual, Accessibility tab](https://wiki.mudlet.org/w/Manual:Mudlet_User_Interface) exposes incoming-text announcements, advertising reader use to servers, configurable input/output navigation including F6, and blank-line handling. Its editors support keys, aliases, triggers and scripts; app shortcuts can be changed or disabled separately. It notes possible incomplete announcements on macOS and an alternative TTS route. The [2022 macOS developer post](https://www.mudlet.org/2022/06/accessibility-for-mudlet-part-2-breakthrough-on-macos/) records solving speech while input retains focus. | Keep command focus stable while notifying elsewhere. Earlier success and present platform caveats coexist; test exact reader/browser combinations. Native client APIs are not a browser implementation recipe. Server reader detection is not permission to expose extra knowledge. |
| PR8 | Fallen London: [official patch notes](https://community.failbettergames.com/t/patch-notes/19404?page=4) record visible focus outlines and outfit save/rename buttons entering tab order for keyboard and screen-reader users. | Small secondary controls matter as much as main choices. This patch proves stated improvements, not complete narration, rebinding, macros or verbosity settings. |
| PR9 | A Dark Room: [developer/contributor issue #70, opened 2013](https://github.com/doublespeakgames/adarkroom/issues/70) distinguishes blind iOS play from browser map barriers and discusses reader output of individual ASCII symbols. SHOWN: the loaded issue remains open. | A readable opening does not establish access after a spatial system unlocks. Consider a known-location list with relative distance/direction beside any map. This historical issue is not a current browser failure reproduction or proof of current iOS parity. |

Shadows of Doubt was not used as an accessibility precedent: the selected sources
above directly cover the requested input and text problems without extending
U4 into U1's general game-pattern survey. No unsupported game-feature matrix
has been filled in from memory.

## AX palette proposals: default plus dial

Every row below is INFERRED. Dials change presentation or access, not discovery,
costs, simulation knowledge or the saved world. Codes are local proposals for
root-owner consideration; this lane does not allocate them in the root file.

| Code | Consideration and proposed default | Dial, with guard | Maps to |
| --- | --- | --- | --- |
| AX1 | Two navigation levels: F6/Shift+F6 across visible panel shells; Tab/Shift+Tab through ordinary controls. Label shells with known titles and use headings within them. Provide a visible Jump to panel menu and skip-to-actions link. | Choose a smaller pinned panel circuit or all visible panels; direct known-panel jumps remain available. Native landmarks/headings work without a global application role. | NV6, panel-kit F6, HU17 |
| AX2 | Stable focus recovery: live updates do not steal focus or reorder the current controls. On panel removal, move to its known restore control or nearest stable shell. On a modal close, return to its opener or a stable fallback. | Optional per-panel last-control memory versus heading-first entry. Never remember focus into now-hidden or undiscovered content. | NV6, HU17, PC6 |
| AX3 | One action-binding list, context-aware collision checks and displayed shortcuts generated from the active binding. No gameplay shortcut while editing text, composing IME input or using browser/reader commands. | Rebind, disable, or limit character-only shortcuts to focused components; one-hand presets and sequential menu access. Reset bindings without resetting the save or layout. | NV6, PC6 |
| AX4 | Quiet announcements: ordinary history is a readable archive, separate from one concise polite status channel for action receipts, completed work and decisions needing attention. Do not put every panel/stat in a live region. | Essential / summaries / detailed categories; pause automatic speech and request current status or unread digest. Reserve assertive alerts for immediate meaningful danger/errors. Muting speech does not remove visible receipts or programmatic state. | IN3, SC5, PC6 |
| AX5 | Separate archival detail from announcement detail. Away digest groups repeats and links to original ordered entries; reading older entries holds the scroll position. | Per-category filters, repeat grouping on/off and raw chronological review; concise / full prose independently. Keep a clear New entries control and contextual count. | IN3, SC5 |
| AX6 | Readable text and flexible panels: preserve current comfortable defaults; allow prose to wrap and expand. Do not shrink text to keep every panel onscreen. | Independent text scale, density, line/paragraph spacing, reading width and font choice. Offer a stacked reading view at desktop zoom while keeping the normal wide workspace reachable. | PC6, MC5 |
| AX7 | State has text plus shape/icon where useful: Ready, Blocked with reason, Rumored, Unread. Focus has a distinct outline; color adds emphasis. | High-contrast palette, player colors and label density. Player palettes retain precedence; flag poor contrast with an optional readable preset, not a silent replacement. Meaning must survive any tint. | PC6, SC5, HU17 |
| AX8 | Motion-safe text VFX: honor OS reduced motion on first use and Effects off as a master. Show the complete stable message with the same timing of knowledge/action availability. Decorative duplicates never announce. | Instant / gentle / full text reveal, separately tune shake, flicker and ambient motion. No setting bypasses discovery or makes controls vanish. Flash safety is independent of reduced motion. | PC6, CS8, HU17 |
| AX9 | Nested explanations open from focus or an explicit Details button; persistent rich help uses a labelled popover/dialog or reading panel. Escape closes the current layer, then returns to the trigger. | Brief definition / breakdown / glossary depth. Support pinning and Back. Do not implement links inside a simple tooltip. | MC5, NV6, PC6 |
| AX10 | One ranked attention queue with dismiss, defer and revisit. On return show current work, unresolved choices and the next known step; keep dismissed teaching in help. | Reminder cadence, category priority and stronger hints on request. Never auto-switch workspace or repeatedly interrupt reading for routine gains. No reminders about undiscovered systems. | SC5, IN3, PC6 |
| AX11 | One knowledge-filtered representation feeds visible text, accessible names/descriptions, search and speech. Undiscovered panels have no title, count, focus target or catalogue entry. Known-but-unavailable panels retain their known name and specific reason. | Conceal known personal details for screenshots or restore them. This dial cannot grant undiscovered truth. Provide a neutral keyboard restore route. | HU17, CS8, NV6, MC5 |
| AX12 | Reduce repeated input with single-press semantic actions and native quantity/batch controls where already supported. Show what will run and provide Stop. | Optional saved finite action sequences as a later proposal, with current-cost validation and interruption on changed conditions. Never replay positional clicks or accept a newly different choice automatically. Broader automation stays with its gameplay owner. | NV6, PC6, SC5 |

### Focus and F6 details worth resolving before adoption

F1, SHOWN: [Panel kit lines 24-26](../../../PANEL_KIT.md) already excludes
unknown names, skips hidden panels and defines F6 direction. It does not settle
the landing target, remembered child, modal interaction or large-panel ordering.
AX1-2 fill those design gaps without claiming a source defect.

F2, INFERRED: use the current saved workspace's readable visual order for both
DOM order and the F6 circuit. User layout changes can update it; routine ticks
cannot. Avoid positive tabindex sequences. F6 focuses a programmatically
focusable shell/heading without adding every shell to ordinary Tab order.
When a shell is visible but collapsed, enter its header; hidden/inert content
stays out. A pinned subset must be labelled as such and must not make other
known panels unreachable.

F3, INFERRED: browsers and laptop function keys can consume F6. Retain the
panel-kit rule, but make Jump to panel and Next/Previous panel buttons reach
the same destinations, with rebindable accelerators. Do not promise F6 can
always override the browser. In a modal, background panel navigation is
suspended until dismissal; a nonmodal inspector does not trap Tab.
The [WAI modal pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
supports contained modal focus and return behavior. The
[WAI tooltip pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)
does not give tooltips interactive focus, which is why MC5's nested links need
a richer component. The exact browser bindings remain an implementation test.

## Sealed knowledge and text VFX conflicts

| Code | Conflict | Proposed resolution, INFERRED |
| --- | --- | --- |
| CF1 | HU17's broad remove-masked-content advice can also remove useful, already-known controls. | Distinguish unknown from known-and-concealed. Omit unknown content entirely from discovery surfaces. For concealed known content, remove masked children from focus/accessibility exposure but retain a neutral restore control. Never focus an aria-hidden descendant; aria-hidden alone does not prevent keyboard access. |
| CF2 | CSS opacity, visual redaction or a decorative cover can leave the true name in an accessible label, tooltip, linked description or queued announcement. | Apply knowledge/masking before producing any output string. On mask or knowledge-context change, drop pending app announcements and regenerate safe summaries. Already-spoken or assistive-technology-queued speech cannot reliably be recalled, so filtering must precede emission. Do not inspect or enumerate sealed truth to build an accessibility test. |
| CF3 | A foresight ghost or rewound log may convey real permitted evidence, decorative flavor, or intentionally uncertain fiction. | Keep actual history stable; expose an explicit known forecast/uncertainty label when the effect carries permitted information. A silent decorative clone is fine only when it adds no information. Do not label a forecast as an event that already happened. Plain mode preserves the same allowed clue. |
| CF4 | Glitch typography, typewriter effects and duplicate glyph layers can overwhelm speech or alter label matching. | One stable semantic message/control name; decorative clones hidden from assistive technology and pointer input. Reveal the stable text once when knowledge becomes available, not letter by letter. Visual effects never obscure the real Save, Stop or recovery controls. |
| CF5 | A short digest can hide detail; a full transcript can overwhelm attention. | Keep independently adjustable announcement and archive verbosity. The default digest links to raw entries with timestamps and repeat counts. Both representations obey the same discovery filter; accessibility is neither a spoiler route nor a detail penalty. |

## Possible later acceptance slice, not run or newly required here

| Code | Observable check if a slice is selected |
| --- | --- |
| AT1 | At both target desktops, traverse many synthetic known panels in both directions, collapse/hide/restore the focused panel, open nested help and a modal, then return. No lost ring, unexpected action, focus trap or tick-driven reorder. Include a keyboard route when the browser consumes F6. |
| AT2 | With NVDA plus Firefox/Chrome on Windows and VoiceOver plus Safari on macOS, execute one action while 100 background entries arrive. Hear one truthful receipt and a bounded digest, inspect full history, pause speech and resume review without losing place. Record reader/browser versions; automated DOM checks cannot prove speech usability. |
| AT3 | At 200% text resize and desktop 400% zoom/reflow, apply WC2 spacing overrides. Read prose, reach costs/actions and change panel layout without clipping. Test color-independent state and focus under player palettes. Narrow viewport checks here concern desktop magnification, not mobile scope. |
| AT4 | Test Effects off, OS reduced motion, instant text and full VFX with a synthetic undiscovered panel. Accessible names, descriptions, search, queued speech and keyboard help reveal no hidden name; plain mode retains every allowed clue and control. No sealed source file is needed. |
| AT5 | Rebind conflicting keys, use search/notes with IME composition, inspect current bindings, operate layout without dragging and stop a batch after conditions change. Recheck the selected slice's persistence/import only if it changes those owners. |

No runtime accessibility pass, conformance claim or human acceptance follows from
this research. Rebuilt desktop and assistive-technology evidence remain future
work if any proposal is selected under the existing project workflow.
