# U12: inspirations beyond games

## CHECKPOINT

2026-10-14: COMPLETE documentation survey. Read COMMON first, then live project
authority and round 8. The requested section now lives under **AG. Inspirations
beyond games**, not AF (AF is Macro shape). Root OI1-OI18 remain unchanged.
U12 verifies OI1-OI12 and OI18, adds OI19-OI32, and leaves OI13-OI17 to U13.
Only this file and U12_REPORT.md are owned. No implementation, builds, browsers,
tests, saves, packs, commits or game surveys. Resume from the report's evidence
limits rather than repeating the survey.

Target: 1366x768 laptop and 1920x1080 desktop. Proposed visible outcome: useful
independent panels remain visible at comfortable text size; known content can be
found, related and inspected without a growing menu or alert flood. Mobile,
runtime integration and human layout acceptance remain deferred/separate.

Authority: [User vision](../../../USER_VISION.md#standing-ui-priority-2026-10-13),
[root palette](../../../UI_AT_SCALE_CONSIDERATIONS_2026-10-14.md),
[Panel kit](../../../PANEL_KIT.md). These are considerations, not accepted specs.
The incumbent already has stable homes, discovery/eligibility distinctions,
named dashboards and a ranked attention queue in its design. Outside references
strengthen those mechanisms; they do not authorize an IDE-shaped replacement.

## Evidence grammar

**SHOWN** means an artifact actually loaded here, including a documentation page
or source file. **STATED** means behavior described by its author or developer,
even when that documentation was SHOWN. Neither means the product was exercised.
**INFERRED** marks every RPG transfer, default, dial and ranking below. **MEMORY**
claims from the root are upgraded only as far as the cited evidence supports.
Sources were consulted on 2026-10-14. No screenshot or runtime survey was run.
Each S code below is a source link; each OI code is a mechanism/consideration.

## Corrections to round 8

| Finding | Root code | Correction and evidence | Keep and extend |
| --- | --- | --- | --- |
| F1 | OI1 | VS Code separates view containers, views, commands and settings. A view's `when` controls visibility; command `enablement` and menu visibility have different jobs. These are UI conditions, not secrecy guarantees. STATED [S1](#s1), [S2](#s2). | Keep SC2 contributions, but bind discovery before any public title/index/count; retain known-but-unavailable reasons per Panel kit. |
| F2 | OI2 | Dark cockpit concerns normal-state annunciators. It does not mean gauges disappear or every color signals failure. FAA's published ARC report gives a deicing example and allows both philosophies. SHOWN historical report, STATED [S15](#s15). | Keep calm attention. World accents, role tints, selection and success retain meaning; reserve urgent styling for urgent items. A failed information source must not look healthy. |
| F3 | OI3 | Priority, rationalization, operator shelving, designed suppression and out-of-service are distinct. ISA's public design article explains them; EEMUA's public page establishes scope/alignment, not every clause. STATED [S16](#s16), [S17](#s17). | Separate actionable alarm, event and reminder. Snooze is temporary display deferral, never gameplay resolution. Do not import industrial numeric limits as game targets. |
| F4 | OI4 | Bloomberg's tutorial documents tabs, securities and mnemonics. Launchpad customization is stated separately; this is no proof that maximal density helps beginners. STATED [S12](#s12), [S13](#s13). | Keep optional mnemonic aliases beside searchable full names and clickable routes. Density is a dial, not tiny text as a default. |
| F5 | OI5 | Sparklines and small multiples are different: one adds compact history; the other supports repeated comparisons. Tufte's book page names data-ink and small multiples but is not a full reading of the book. STATED [S20](#s20), [S21](#s21). | Keep units, interval, scale and accessible numeric history. Removing decoration must not remove labels, focus outlines or distinctions. |
| F6 | OI6, OI7 | Pad++ explicitly changes representation with scale. Shneiderman calls his mantra a starting point and also includes relate, history and extract. SHOWN papers, STATED [S22](#s22), [S23](#s23). | Keep overview for exploration, but let a known direct link open its detail immediately. Semantic zoom must preserve knowledge limits and readable type. |
| F7 | OI8 | Backlinks, local graph and date-based capture are separate mechanisms. Obsidian documents all three; Roam evidence has a mirror limitation. STATED [S25](#s25)-[S28](#s28). | Default to text backlinks and scoped connections; a full graph is optional. A mention is not proof of truth or an in-fiction relationship. |
| F8 | OI9, OI10 | Unread, addressed, muted and resolved are different states. Gmail snooze removes a message temporarily; Slack/Discord have layered notification rules. STATED [S31](#s31)-[S35](#s35). | Reading clears unread only. Archiving a card does not finish a job or remove a consequence. Mute does not erase archive/search history. |
| F9 | OI11, OI12 | i3 also supports floating windows; “never overlap” is too absolute. Emacs modes are buffer-local behaviors, not merely workspace layouts. STATED [S6](#s6), [S7](#s7). | Keep tiled default and stable focus paths. Separate a view's state from where it is placed and from the active activity. |
| F10 | OI18 | htop/btop monitor system resources/processes; tmux manages sessions/windows/panes. They are not interchangeable ops dashboards. STATED [S8](#s8)-[S10](#s10). | Borrow process trees and temporary pane enlargement, not terminal key conflicts, polling rate or process-kill semantics. |

## Mechanisms, evidence and concrete transfers

All transfer columns are INFERRED. Source links carry the original evidence,
not evidence of YAIRPG behavior. Defaults and dials appear in the next section.

### Developer tools

| Code | Mechanism and evidence | Concrete transfer | Root map |
| --- | --- | --- | --- |
| OI1 | VS Code activity bar selects view containers; sidebars hold views; the Panel serves supporting views needing horizontal room; the status bar carries bounded workspace/context state; the command palette provides typed command access. Contribution points are declarative registrations. STATED [S1](#s1)-[S4](#s4). | Use a short rail of player questions, existing self/actions/records zones, and one command index of known entities and verbs. Packs contribute rows or views to existing homes. Keep save health visible even when supporting output is collapsed. No rail icon per cheat. | SC1-SC4, NV1, ZN1-ZN3, FR1, EN5 |
| OI19 | Context expressions let VS Code show a view or menu in the right context; command enablement is a separate condition. STATED [S1](#s1), [S2](#s2). | Treat discovered, eligible, relevant and player-hidden as distinct. A known workshop may be unavailable away from a bench, with a reason; an undiscovered system leaves no searchable title. Both palette and visible button use the same authorized action check. | SC2, SC3, EN4, MC7, AX11 |
| OI20 | JetBrains tool windows include always-present, plugin-dependent and action-created tools; shortcuts show/hide them, Escape returns to the editor and F12 returns to the last tool. Hide-all restores prior windows. STATED [S5](#s5). | Inspect an NPC, return to the exact action row, then reopen that inspector with its scroll/selection intact. A temporary focus view restores the previous workspace rather than resetting it. A first job can reveal a supporting output view once, without a forced layout switch. | NV3, NV6, ZN4, AX1, AX2, MC3 |
| OI12 | Emacs buffers retain contents and associated state independent of display. Each has one major mode and optional minor modes; modes specialize available behavior. STATED [S6](#s6). | Keep recipe selection, notebook draft and reading position with the view/entity rather than its dock. Craft, trade or research adds contextual verbs while Inspect, Back, Pin and Note stay stable. Show active context so the same key does not silently spend different resources. | NV2, NV3, MC3, IG1, IG2, MI62 |
| OI11 | i3 splits containers, has tabbed/stacked layouts, directional focus and workspaces. Floating and fullscreen are supported exceptions. STATED [S7](#s7). | Tile useful panels across laptop width. When a split would make actions unreadable, use tabs within the supporting region. Offer explicit focus movement and enlarge/restore, keeping the action region's minimum size. Dialogs can still overlay. | ZN1, ZN2, EN1, AX1, NV6 |
| OI18 | htop supplies an interactive process list with scrolling and mouse support; btop documents filtering, sorts, process trees, selected-process detail and pausing its process list. STATED [S8](#s8), [S9](#s9). | A Running work table shows actor, known world, job, rate, remaining time and blocker. A tree groups settlement projects and child jobs without repeating every summary. Freeze row order while selecting, with a visible Refresh action. Do not stop simulation merely to stabilize the table. | IN6, MW1, MW3, MI23, NV5 |
| OI21 | tmux sessions contain windows containing panes; layouts determine pane geometry. Pane zoom temporarily fills the window then restores layout, with a status mark. STATED [S10](#s10). | Enlarge a long journal or complex bench temporarily; preserve previous proportions, focus and scroll when returning. Distinguish “view enlarged” from game speed/pause. Carry attention/save state into the enlarged view. | NV2, ZN1, PC1, FR1, EN3 |

### Dense professional screens

| Code | Mechanism and evidence | Concrete transfer | Root map |
| --- | --- | --- | --- |
| OI4 | Bloomberg's getting-started tutorial names window anatomy/tabs, loading a security and menus/mnemonics. Its Launchpad writing describes customizable monitors. STATED [S12](#s12), [S13](#s13), with the latter's limited excerpt. | Type a short alias such as `jobs` to reach Running work, but display the full action label and current world/actor before execution. Offer a named trading dashboard of inventory, market and current orders. Commands navigate by default; consequential actions still show a quote. | NV1, NV6, MC4, DP1, PC2 |
| OI22 | TradingView can synchronize symbol, crosshair, interval and time range across charts. STATED [S14](#s14). | Inspect a companion or ingredient and let explicitly linked panes follow the selection: details, mentions and comparison. Lock a pane to keep the prior item for comparison. Label which panes follow, and restrict changes to the chosen group; do not retarget every panel. | MC1, IN5, NV3, IG5 |
| OI23 | Grafana asks each dashboard to answer a question, progress from general to specific and reduce cognitive load. STATED [S11](#s11). | “Which worlds need me?” shows actionable known changes and the reason/route to intervene, with a drilldown to the relevant ledger. “What is running?” shows jobs. These can be two saved views of the same records rather than two duplicate systems. Add an explicit last-known timestamp to remote facts. | SC1, MW1, IN4, MC4, NV5 |

Density is useful when comparisons stay on one screen; it is costly when reading
requires tiny type or unfamiliar abbreviations. The professional references
support user-controlled layouts, filters and shortcuts, not a claim that the
game should look like a trading terminal. U12 does not survey its live software.

### Safety-critical attention

| Code | Mechanism and evidence | Concrete transfer | Root map |
| --- | --- | --- | --- |
| OI2 | FAA's historical ARC report explains failure illumination instead of a light on every normal deicing cycle. It explicitly discusses dark and non-dark designs. SHOWN/STATED [S15](#s15), PDF pp. 55 and 166. | Keep normal work visible but quiet. A stalled job gets text “Blocked: no fuel” and a distinct mark; ordinary completion can be a quiet receipt. Calm is about salience, not black backgrounds. A dead status-window cheat needs an explicit unavailable state, not a blank healthy-looking queue. | SC5, MI7, MI38, QL1, MC7 |
| OI3 | ISA's public article describes rationalization, floods and three suppression forms. EEMUA 191's publisher describes operator-focused design/management and alignment with ISA/IEC. STATED [S16](#s16), [S17](#s17); full standards not accessed. | Each attention item names the condition, player response, urgency and clearing rule. Separate urgent intervention, decision, completion and background event. Shelve a reminder until a known condition/time; list shelved items and return rules. Reading/acknowledging does not clear its cause. | SC5, IN3, PC4, QL1, QL2 |
| OI24 | ISA explains a common failure causing many downstream alarms and context-based suppression of redundant consequences. STATED [S16](#s16). | If known missing fuel blocks six benches, show one “Fuel shortage: 6 jobs blocked” card with expandable jobs and interventions. Group only when the cause is actually known; otherwise say “6 blocked jobs,” without inventing a diagnosis. Preserve chronological raw events. | SC5, IN1, IN3, MW1, AX5 |
| OI25 | Drew et al. observed 2,558,760 alarms over 31 days; 88.8% of 12,671 annotated arrhythmia alarms were false positives. This is a specific ICU study, not all hospital alarms. AHRQ discusses fatigue and mitigation. SHOWN research/STATED [S18](#s18), [S19](#s19). | Prevent repeated hunger alerts every tick: alert on meaningful threshold transition, clear at an explicit recovery condition, and re-alert for real worsening. Prototype quiet periods and hysteresis on continuous values. Track duplicates and ignored reminders before adding more sounds. | SC5, IN3, PC4, QL1, MI41 |
| OI26 | FAA terminal automation rules tie target identity to alphanumeric data, maintain current assigned altitude and prescribe displayed identity/heading/speed. STATED [S36](#s36). | Stable actor/world IDs bind a row, map marker, job and its commands. Show active actor, known location, status and observation age. A remote apprentice's last report stays “last known”; no made-up live rate. Switching worlds cannot leave an old actor selected under a new label. | MW1, MW3, IN4, PT1, TP4 |

The transfer is attention design, not aviation/medical compliance. An idle RPG
can allow players to mute, pause or ignore consequences under its chosen rules.
It should state the consequence and clock rather than silently convert a mute
into immunity. Color, sound and motion each need text/focus equivalents.
Urgency should reflect actionable time and consequence, not merely rarity.

### Information design

| Code | Mechanism and evidence | Concrete transfer | Root map |
| --- | --- | --- | --- |
| OI5 | Tufte describes compact inline time series; his book page names small multiples and data-ink. STATED [S20](#s20), [S21](#s21). | Put a small history trace beside food reserves, showing “last 7 played days” and current value. Compare known companions/world ledgers with repeated column order and comparable scales. Keep a numeric/table alternative and mark gaps. Decoration can recede while narrative prose, labels and focus cues remain. | IN1, IN5, IN6, MI65, VI3 |
| OI6 | Pad++ distinguishes smaller drawings from different representations at different scales. SHOWN/STATED [S22](#s22), PDF p. 2. | Settlement level shows supply and work counts; household level shows people and assignments; actor level shows an injury or need. Use discrete text scale buttons/breadcrumbs with stable IDs. A world summary aggregates only known reports; absence of data is distinct from zero. | NV4, MW1, MW2, IN4 |
| OI7 | Shneiderman's taxonomy includes overview, zoom, filter, detail, relate, history and extraction. SHOWN/STATED [S23](#s23), PDF p. 1. | People starts with counts and filters, then rows, then a detail inspector. Keep filter/history when returning. Direct NPC links bypass the overview. Related events and export are reachable without forcing a tour of the hierarchy. | IN6, NV3, NV4, AN4, SH1 |
| OI27 | NN/g defers advanced or rare options behind a clear route while keeping important choices initially visible. STATED [S24](#s24). | Keep local actions and common recipes visible; put rare formula tuning or advanced standing-order clauses in an expandable detail area. Expert players can keep that area open. Separate this display preference from fictional discovery: expansion never reveals sealed systems. | SC3, PC2, ZN1, IN7, EN4 |

### Knowledge tools and triage

| Code | Mechanism and evidence | Concrete transfer | Root map |
| --- | --- | --- | --- |
| OI8 | Obsidian backlinks distinguish linked/unlinked mentions; graph has global and depth-limited local views; daily notes open/create date-based entries. STATED [S25](#s25)-[S27](#s27). | A person's inspector lists known journal mentions with date, source and Back. Default to one-hop connections as text. A Day 14 journal captures chronology and links to people without duplicating their pages. Use run/world/day as identity, not the computer date alone. | NV3, IN3, IN4, AN1, MI53, MI67 |
| OI28 | Roam's readable help mirror describes writing page links within Daily Notes and Linked References; it calls a graph a database. STATED mirror [S28](#s28), provenance limit below. | Let a player capture a thought in the current day's journal and link it to known entities. Reuse the same note/event ID in a person's page. Keep player notes distinct from character knowledge and mark user-written speculation. Do not claim the mirror verifies current visual graph controls. | AN1, MK1, IN4, NP2 |
| OI29 | Notion represents the same database through multiple layouts with view-specific filters, sorts, groups and visible properties. STATED [S29](#s29). | Inventory “For sale,” recipes “Can craft now,” and people “Owe me” are named filtered views over their canonical records. Changing the view does not duplicate items or change the facts. Display a filter summary and unfiltered route so hidden rows are recoverable. | IN6, NV5, MC4, AN2 |
| OI30 | Zettelkasten design writing emphasizes fixed addresses, bounded topics, links and entry/structure notes. STATED [S30](#s30). | A rumor has an ID, source/date, uncertainty and related observations. New evidence adds a dated revision rather than silently replacing the old claim. Player-made index notes can link a mystery's evidence, without auto-confirming a sealed truth. Small notes are optional, not homework imposed on play. | IN4, NV3, AN1, MK1 |
| OI9 | Gmail snooze temporarily removes inbox mail and provides a Snoozed location. Mann's original series is now parked; the original talk landing page loads but no transcript was retrieved. STATED [S31](#s31); MEMORY attribution limit [S32](#s32). | Triage a known card into act, defer or file, separately from read/unread. “Remind me at the next visit” is an RPG extension, not a documented Gmail feature. Archived cards remain searchable. No reward or penalty for maintaining an empty attention list. | SC5, IN3, NV5, SF2 |
| OI10 | Slack threads organize replies and notification preferences select mentions/DMs versus all messages. Discord threads can be followed with different notification levels; server/channel rules include mutes and mention controls. STATED [S33](#s33)-[S35](#s35). | Conversations become dated threads with unread dividers. “Addresses you” is separate from “not yet read.” Mute ambient trade chatter while retaining decision/threat cards in the attention view. Show mute scope and exception rules instead of assuming Slack and Discord behave identically. | NP2, SC5, IN3, MI29, MI53, QL1 |
| OI31 | Obsidian scoped graphs and backlinks, combined with Zettelkasten's source-linked notes, support navigation through related records. STATED [S25](#s25), [S26](#s26), [S30](#s30). | Give every known claim a provenance drawer: who reported it, when, which world/run and whether later evidence contradicted it. Backlinks/counts derive from the filtered representation, including accessible labels. A hidden edge/count must not hint at sealed content. | IN4, EN4, AX11, MK1, MW1 |
| OI32 | Bloomberg separates selected securities/functions; TradingView separately configures synchronization dimensions. STATED [S12](#s12), [S14](#s14). | Before a mnemonic or linked-pane action, show “Actor · world · verb · target.” Switching context invalidates an old quote rather than applying it to a new actor. Selection can update inspectors; it cannot itself spend coins or issue a standing order. | MW3, DP1, NV1, MC1, IG1 |

## Proposed defaults and dials

OI1-OI12 and OI18 keep their root identity. OI19-OI32 are new U12 proposals.
U13's new prefix is TT, so it does not need these IDs. Defaults describe a
possible first presentation; dials keep alternatives reachable. All are INFERRED.

| Code | Proposed default | Dial / reachable alternative | Disposition and main cost |
| --- | --- | --- | --- |
| OI1 | Stable question homes; contributions favor rows/cards over panels. | Named layouts, more pinned views, movable supporting regions. | Adapt; shared contribution/action vocabulary is the main work. |
| OI2 | Visible normal data, quiet decoration; explicit exception text. | Cozy, ordinary and crisis salience; sound/motion separately adjustable. | Adapt; “quiet” must not conceal failed sensing or save failure. |
| OI3 | Actionable tiers and explicit response/clear rules. | Expanded background feed, timed shelving, chosen reminder levels. | Adapt; define transitions and snooze clock before persistence. |
| OI4 | Full-name search with a few visible aliases. | User aliases and optional mnemonic hints/dense dashboard. | Trial; aliases add learning and collision handling. |
| OI5 | Numeric values plus selective short history at fixed labeled intervals. | Off, trend-only, longer histories, common versus per-row scales. | Trial; history sampling/storage and misleading scales need care. |
| OI6 | Discrete text scope ladder with readable type and breadcrumb. | Continuous map zoom, parallel overview/detail, user-selected scope. | Trial; each rung needs its own known-data summary. |
| OI7 | Overview/filter/details for large exploratory lists. | Open directly at pinned detail, remembered filter, related/history view. | Adapt; preserve navigation state. |
| OI8 | Text backlinks and daily journal; one-hop related view. | Deeper/local/global graph, date grouping or session grouping. | Adapt text first; visual graph can wait. |
| OI9 | No empty-inbox target; explicit act/defer/file routes. | Reminder conditions, archive visibility, batch triage. | Adapt; UI dismissal must stay separate from world resolution. |
| OI10 | Quiet unread mark; addressed/decision badge separate. | Per-thread/category mute, follow, all updates or mentions. | Adapt; mute exceptions must be explicit. |
| OI11 | Tiled zones with supporting tabs when needed. | Floating inspector, directional navigation, fullscreen region. | Adapt; minimum readable size overrides arbitrary split count. |
| OI12 | Persistent view state and named contextual commands. | Activity presets, additional contextual tools, manual mode selection. | Adapt principle; copying Emacs keymaps would add needless cost. |
| OI18 | Jobs grouped by actor/world, stable order during interaction. | Sort by time/blocker/rate, parent-child tree, explicit live sort. | Adapt; require trustworthy timing and rate data. |
| OI19 | Discovery first; known disabled entries explain why. | Show only available versus include known unavailable; context command filter. | Adapt; one predicate path must serve every public surface. |
| OI20 | Inspect returns to the exact prior action/focus. | Pinned inspectors and explicit focus-only layout. | Adapt; view state/focus restoration is the main cost. |
| OI21 | Enlarge/restore one region without changing saved layout. | Toggle supporting panes, two-pane comparison, remembered focus preset. | Trial; keep attention/save strip present and restore precisely. |
| OI22 | Only the inspector follows selection. | Opt-in linked groups; lock individual panes. | Trial; linking state needs visible scope and back history. |
| OI23 | A small named dashboard answers one question. | Player columns/filters, dense multi-world view, separate activity views. | Adapt; freshness and coverage labels matter more than graph count. |
| OI24 | Group only known common causes; raw log stays available. | Expand all consequences, different grouping interval, disable grouping. | Trial; avoid invented causality and lost distinct responses. |
| OI25 | Re-alert on transition/worsening, not every tick. | Reminder cadence and thresholds; quiet periods with explicit units. | Trial; tuning must respect actual game clocks/consequences. |
| OI26 | Identity and last-observed state on remote/controlled rows. | Extra columns, sigils, linked entity highlights. | Adapt; observation state must come from gameplay authority. |
| OI27 | Routine verbs visible; rare tuning in a clear advanced area. | Keep advanced area open; expert column/detail sets. | Adapt; never hide useful independent panels to manufacture simplicity. |
| OI28 | Fast dated notes with known-entity links, player-labeled. | Outline blocks, session notes, separate author/topic pages. | Trial; note links must not become in-fiction knowledge. |
| OI29 | Table view with named filters and visible filter summary. | Board, calendar, list and saved column sets where each answers a question. | Adapt; keep canonical records and display preferences distinct. |
| OI30 | Source/date/uncertainty on bounded claims. | Player index notes, longer prose, revision/history detail. | Adapt; do not force atomic note-taking as a chore. |
| OI31 | Text provenance/backlinks from already filtered data. | Related graph, depth, source categories and contradiction filter. | Adapt; node/edge/count leakage needs one guard. |
| OI32 | Commands preview actor/world/target and require a fresh quote. | Compact expert preview, remapped aliases, linked-pane groups. | Adapt; stale selection/quote must fail safely. |

## Top 10 transfers, ranked

Ranking is INFERRED fit for a text-first many-world desktop RPG, based on reach,
attention cost, compatibility with live owners and effort. It is not a build queue.
The default/dial table is part of every ranked row.

| Rank | Code | Why this ranks here | Bounded observable check for a future prototype |
| --- | --- | --- | --- |
| 1 | OI19 + OI1 | Contribution/discovery separation prevents every new world becoming another custom navigation system. | Known available, known unavailable and unknown fixtures agree across panels, commands, settings and accessible labels. Unknown names/counts never appear. |
| 2 | OI3 + OI2 | One calm actionable queue limits competing demands without sacrificing visible data. | Normal jobs remain visible; one urgent known problem has reason/action; acknowledgment does not clear cause; sensor/save failure stays explicit. |
| 3 | OI20 | Reliable return from detail protects the actual action-first play loop. | Inspect/back/reopen keeps actor, row, typed text, scroll and visible keyboard focus at both target sizes. |
| 4 | OI29 + OI23 | Saved views let hundreds of records serve several questions without adding duplicate panels. | “Can craft” and “All known” share IDs; clear filter recovers rows; long tables remain readable with actions visible. |
| 5 | OI8 + OI31 | Text backlinks make long stories searchable while preserving source and uncertainty. | Person-to-event-to-person returns correctly; secret nodes, edges and counts are absent everywhere. |
| 6 | OI24 + OI25 | Common-cause grouping and transition-based reminders keep idle returns readable. | Six known blocked jobs produce one expandable cause card, raw events remain; threshold oscillation does not spam or hide worsening. |
| 7 | OI18 + OI26 | A stable jobs ledger makes many actors/worlds manageable without pretending all facts are live. | Rows show actor/world/time/observation age; selection does not move under the pointer; remote unknowns remain unknown. |
| 8 | OI4 + OI32 | Optional mnemonics give expert reach without a permanent menu of every system. | Full-name and alias navigation agree; context switch invalidates stale quote; typing cannot accidentally issue a paid action. |
| 9 | OI21 + OI11 | Temporary enlargement makes long reading comfortable while restoring useful panel space. | Enlarge/restore preserves proportions/scroll/focus and critical strip at 1366x768 and 1920x1080. |
| 10 | OI5 | Small histories reveal depletion or stalled progress better than another headline number. | Numeric history agrees with trace; interval/units/gaps are clear; common-scale comparisons are truthful and keyboard-readable. |

OI6 semantic scope, OI7 exploratory overview and OI27 advanced disclosure remain
useful extensions of the incumbent. They rank below these ten because they need
specific dense surfaces and summary semantics before a broad UI change pays off.
The full visual knowledge graph is parked behind text backlinks; none of this
selects a dependency, installs a tool or authorizes source changes.

## Sources and access limits

Every entry records a page loaded or an explicit access limit. Reading a page
does not verify its screenshot, product runtime, current install or conformance.
Paraphrases are brief; no full standard/book/transcript was copied.

| Source | Page and evidence used |
| --- | --- |
| <a id="s1"></a>S1 | SHOWN official [VS Code contribution points](https://code.visualstudio.com/api/references/contribution-points), especially commands and views. STATED declarative registrations, command enablement, view visibility. |
| <a id="s2"></a>S2 | SHOWN official [when-clause contexts](https://code.visualstudio.com/api/references/when-clause-contexts). STATED expressions/context keys; not a confidentiality system. |
| <a id="s3"></a>S3 | SHOWN official [user interface](https://code.visualstudio.com/docs/editing/getting-started/userinterface). STATED areas, command palette and separate quick-open routes. |
| <a id="s4"></a>S4 | SHOWN official UX guides: [Activity Bar](https://code.visualstudio.com/api/ux-guidelines/activity-bar), [Panel](https://code.visualstudio.com/api/ux-guidelines/panel), [Status Bar](https://code.visualstudio.com/api/ux-guidelines/status-bar). STATED container navigation, supporting horizontal views, bounded status items. |
| <a id="s5"></a>S5 | SHOWN [JetBrains tool windows](https://www.jetbrains.com/help/idea/tool-windows.html). STATED availability, show/hide, return to editor, last tool and hide-all/restore. |
| <a id="s6"></a>S6 | STATED GNU search-indexed manual: [buffers](https://www.gnu.org/s/emacs/manual/html_node/emacs/Buffers.html), [modes](https://www.gnu.org/software/emacs/manual/html_node/emacs/Modes.html), [minor modes](https://www.gnu.org/s/emacs/manual/html_node/emacs/Minor-Modes.html). Direct buffer/major-mode page loads timed out; switched to indexed official documentation rather than retrying those pages. No live Emacs claim. |
| <a id="s7"></a>S7 | SHOWN [i3 User's Guide](https://i3wm.org/docs/userguide.html), sections 2.2, 2.6, 2.11 and 3. STATED splits, stacks/tabs, directional focus, workspaces and floating exceptions. |
| <a id="s8"></a>S8 | SHOWN [htop official site](https://htop.dev/). STATED interactive process viewer, scrolling and mouse support. |
| <a id="s9"></a>S9 | SHOWN [btop author README](https://github.com/aristocratos/btop#features). STATED filters, sorting, tree, detail, pause-list and presets. Not proof of every OS's parity. |
| <a id="s10"></a>S10 | SHOWN [tmux Getting Started](https://github.com/tmux/tmux/wiki/Getting-Started). STATED sessions/windows/panes, layouts, pane zoom/restore/status mark. |
| <a id="s11"></a>S11 | SHOWN [Grafana dashboard best practices](https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/best-practices/). STATED question-led dashboards, general-to-specific sequence and cognitive load. |
| <a id="s12"></a>S12 | SHOWN [Bloomberg Terminal Essentials: Getting started](https://professional.content.cirrus.bloomberg.com/professional2023/insights/technology/bloomberg-terminal-essentials-getting-started/), tutorial chapter list (1:36 window/tabs, 2:40 security, 3:10 menus/mnemonics). STATED tutorial coverage only; video not watched. |
| <a id="s13"></a>S13 | STATED official search excerpt [Bloomberg modern-icon design writing](https://bloomberg.com/company/stories/innovating-a-modern-icon-how-bloomberg-keeps-the-terminal-cutting-edge). Limited excerpt supports customized data panes. Full article not loaded; no exact panel geometry or density metrics claimed. |
| <a id="s14"></a>S14 | SHOWN [TradingView layout synchronization](https://www.tradingview.com/support/solutions/43000629992-how-to-sync-the-charts-of-my-layout/). STATED synchronized selection/time dimensions. |
| <a id="s15"></a>S15 | SHOWN [FAA Part 23 icing ARC report](https://www.faa.gov/regulations_policies/rulemaking/committees/documents/media/Part23IARC-2192010.pdf), historical report with proposed revisions, especially PDF pp. 55, 166, 171. STATED dark-cockpit rationale; not current certification requirements or a universal cockpit rule. Airbus brochure load failed; this independent official route supplied the mechanism. |
| <a id="s16"></a>S16 | SHOWN [ISA: From managing to optimizing alarms](https://www.isa.org/intech-home/2017/september-october/features/from-managing-to-optimizing-alarms), 2017. STATED actionable response, common-cause flood, context and three suppression forms. Public design writing, not full ISA-18.2 text or clause audit. |
| <a id="s17"></a>S17 | SHOWN [EEMUA 191 publisher page](https://www.eemua.org/products/publications/digital/eemua-publication-191), fourth edition. STATED scope and alignment. Full paid guide not accessed; no numeric flood/priority target or exact shelving clause asserted from it. |
| <a id="s18"></a>S18 | SHOWN [Drew et al., PLOS ONE (2014)](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0110274), abstract/results. Observational sample supports nuisance-alarm burden, not a causal study of RPG notifications. |
| <a id="s19"></a>S19 | SHOWN [AHRQ PSNet: Alert Fatigue](https://psnet.ahrq.gov/primer/alert-fatigue). STATED concern about desensitization and system-level mitigation. |
| <a id="s20"></a>S20 | SHOWN [Tufte: Sparkline theory and practice](https://www.edwardtufte.com/notebook/sparkline-theory-and-practice-edward-tufte/). STATED compact inline data history. Initial guessed sparkline URL failed; switched to source search and this discovered page. |
| <a id="s21"></a>S21 | SHOWN [Tufte: The Visual Display of Quantitative Information](https://www.edwardtufte.com/book/the-visual-display-of-quantitative-information/), publisher/author description. STATED small multiples and data-ink topics; full book not read. |
| <a id="s22"></a>S22 | SHOWN [Bederson and Hollan, Pad++ (UIST 1994)](https://www.cs.umd.edu/~bederson/images/pubs_pdfs/p17-bederson.pdf), PDF p. 2, explicit semantic zoom. SHOWN [related CHI 1994 short paper](https://www.cs.umd.edu/projects/hcil/pad%2B%2B/papers/chi-94-pad/index.html). These support ZUI mechanisms, not every map product. |
| <a id="s23"></a>S23 | SHOWN [Shneiderman, The Eyes Have It (1996)](https://www.cs.umd.edu/~ben/papers/Shneiderman1996eyes.pdf). STATED mantra/taxonomy and its starting-point qualification. |
| <a id="s24"></a>S24 | SHOWN [NN/g: Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/), Jakob Nielsen, 2006. STATED separating frequent from advanced options; not fictional unlock/discovery. |
| <a id="s25"></a>S25 | SHOWN [Obsidian backlinks](https://obsidian.md/help/plugins/backlinks). STATED linked/unlinked mentions and context/filter controls. |
| <a id="s26"></a>S26 | SHOWN [Obsidian graph view](https://obsidian.md/help/plugins/graph). STATED global/local graph and depth/filter controls. |
| <a id="s27"></a>S27 | SHOWN [Obsidian daily notes](https://obsidian.md/help/plugins/daily-notes). STATED date-based notes and templates. |
| <a id="s28"></a>S28 | SHOWN [Roam help FAQ mirror](https://roamdocs.fyi/help/faq), sections on page creation and missing daily notes. Mirror links to the [source help graph](https://roamresearch.com/#/app/help/page/FAQ); provenance is not independently certified. The official home loaded no text. Bidirectional capture is STATED by the mirror; current visual graph controls remain unverified. |
| <a id="s29"></a>S29 | SHOWN [Notion views, filters, sorts and groups](https://www.notion.com/help/views-filters-and-sorts). STATED many presentations of one database and view configuration. |
| <a id="s30"></a>S30 | SHOWN [Sascha: Introduction to Zettelkasten](https://zettelkasten.de/introduction/), 2020 design writing. STATED stable IDs, bounded topics, links and structure notes. Modern method writing, not an official software standard. |
| <a id="s31"></a>S31 | SHOWN [Gmail snooze](https://support.google.com/mail/answer/7622010). STATED temporary inbox removal and Snoozed access. |
| <a id="s32"></a>S32 | Original [Mann Inbox Zero series](https://www.43folders.com/43-folders-series-inbox-zero) now redirects to a parked domain. Switched to original [Google TechTalks video](https://www.youtube.com/watch?v=z9UjeTMb3Yk): landing title SHOWN, transcript unavailable. MEMORY attribution only, no quote or verified reconstruction of Mann's full method; RPG triage is INFERRED. |
| <a id="s33"></a>S33 | SHOWN [Slack threads](https://slack.com/help/articles/115000769927-Use-threads-to-organize-discussions) and [Configure notifications](https://slack.com/help/articles/201355156-Configure-your-Slack-notifications). STATED replies/following, mention/DM versus all-message preferences, unread badge. Initial obsolete notification URL failed; switched to discovered current guide. |
| <a id="s34"></a>S34 | SHOWN [Discord Threads FAQ](https://support.discord.com/hc/en-us/articles/4403205878423-Threads-FAQ). STATED threads and notification controls. |
| <a id="s35"></a>S35 | SHOWN [Discord Notifications Settings 101](https://support.discord.com/hc/en-us/articles/215253258-Notifications-Settings-101). STATED server/channel overrides, mute and mention controls. Product rules vary by scope. |
| <a id="s36"></a>S36 | SHOWN [FAA terminal automation systems](https://www.faa.gov/air_traffic/publications/atpubs/atc_html/chap5_section_14.html), sections 5-14-2 through 5-14-5. STATED identity responsibility, keeping altitude current and displayed data. No controller workstation usability trial. |

## Open evidence and acceptance

| Code | Open matter | Proposed default / resolving evidence |
| --- | --- | --- |
| Q1 | Full ISA/EEMUA clause text was not accessed. | Use public qualitative mechanisms; exact industrial limits/compliance stay unclaimed. A later clause audit needs licensed full text if actually required. |
| Q2 | Roam's official interactive docs and current visual graph controls were not readable here. | Use the fully loaded Obsidian docs for backbone; treat Roam capture as mirror-stated. Signed-in/current official evidence would strengthen only that product attribution. |
| Q3 | Mann's original article is parked and the original talk transcript was unavailable. | Keep triage as an independent RPG proposal supported by documented Gmail snooze; no Inbox Zero quotation or mandatory-zero design. |
| Q4 | Priority, shelving expiry and histories need actual world clock/knowledge semantics. | Played-time expiry for simulated needs; explicit calendar time only for a real external reminder. Conditions say which world/actor/clock; paused or unknown state must not look elapsed/current. No mechanic is accepted by this survey. |
| Q5 | Usability and gameplay acceptance were not tested. | If selected, prototype the top-ranked mechanisms at both desktop targets, including large lists, several worlds, keyboard return, stale data and sealed filtering. Rebuilt gameplay and persistence gates apply only to later implementation. |

