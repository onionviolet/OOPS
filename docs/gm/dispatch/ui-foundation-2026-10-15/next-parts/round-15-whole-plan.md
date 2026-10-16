# Round 15: whole-plan pass and iteration rounds R15+, 2026-10-16

Weibao: "consider NEXT_PARTS details and expand and think accordingly?", then: "can we improve the
round plan accordingly? Aren't we iterating on ideas? r14 is the best thus far but everything is
working to finetune accordingly? More to consider? everything that I mentioned?"

Planning only. No source, build, save, dispatch or commit follows from this file. Codes: **NX**
(findings), **IT** (iteration rules), **WB** (workbench studies), **R15+** (native rounds). All
unused elsewhere in this dispatch. Everything here is a proposal until Weibao plays it.

## What was wrong with the plan's shape

The Parts were written as large feature blocks (Part 1 to Part 10) behind a review gate (W6: "Part 1
waits for R13/R14 acceptance"). That does not match how the UI has actually improved: R1 to R14 were
small rounds, each fixing one ranked gap on top of the previous candidate, with frozen before/after
evidence. Weibao's reading is the right one: **R14 is the best candidate so far and the working
baseline; the next work fine-tunes it round by round.** The Parts stay as the design detail; the
schedule becomes a ranked queue of small rounds.

## Iteration rules (IT)

| Code | Rule | Replaces |
| --- | --- | --- |
| IT1 | **Baseline = best candidate so far.** R14 now. Each round freezes before/after on top of the previous round, as R14 did | W6 acceptance gate |
| IT2 | **Rolling review.** Weibao plays any candidate when he likes. His feedback becomes a tune item in the next round or the next polish round; it never stalls the queue. Rejecting a round reverts only that round's owned paths | "Review backlog" constraint |
| IT3 | **One gap per round, presentation before save.** A save-touching round runs alone, with migration and save/reload/export/import checks | Part-sized bundles |
| IT4 | **The queue is a ranking, not a contract.** A regression or Weibao's feedback jumps the queue; evidence from a round can reorder the rest (UI_NEXT method: frequency × impact × low reversible cost) | Fixed Part order |
| IT5 | **Each round reports at most five "what to look at" items**, keeps the inherited regression sweep and the three desktop targets (1366×768 at 14/21px, 1920×1080 at 21px) | — |
| IT6 | **New ideas land in the next unstarted round's brief** or a workbench study. A new Part only when a new surface appears | New consideration rounds growing the doc |
| IT7 | **Polish round every three or four rounds:** consistency debt in surfaces already touched (number format V18, placeholder glyphs F16/W5, row anatomy F20, tokens VC2) plus accumulated tune items | Deferred "finish slice" |
| IT8 | **Mockups go through the shared workbench** ([MOCKUP_SYSTEM](../../../../MOCKUP_SYSTEM.md) MW1–MW7) and run in parallel with native rounds, since they touch no production source | Static PNG sets per lane |
| IT9 | **Runtime rounds name their seam** ([ARCHITECTURE_RULES](../../../../ARCHITECTURE_RULES.md) AR1, AR14, AR15): new UI code lives in its own module and registers; check the modular-seams reservation before editing `main.js`, `display.js` or `save_files.js` | Ad hoc edits in core files |

## Native rounds on the R14 baseline

Order follows how often a player meets the surface, then impact, then cost. Executor: strong model,
high effort for every native round unless noted; Codex or Claude by availability.

| Round | One gap | Detail and codes | Save? | What it needs first |
| --- | --- | --- | --- | --- |
| **R15** | **Combat place descriptor restored**: type tags back in the combat header, focusable, hover/focus/Enter tooltip parity, Esc | Part 2 descriptor subset, L2/SF243, NX4 | No | Nothing. Fixes a known R14 regression |
| R16 | Inventory category tabs with native counts, Favorites kept, stable known tabs, explicit clear filter | UI_NEXT P2, Part 1, UX13, L4, NX2 (panel-scoped preference); fixtures include a fight in progress at 21px (WR11) | No | WB1 strip placement helps, not required |
| R17 | Inventory rows and item detail anatomy; selection by item key | Part 1, L5, L6, UX14, NX10 (500-row tick time); detail as hover, pinned or inspector per WB1 pick (WR24) | No | R16 |
| R18 | Opponent board sized by count (1, 2–4, 5–8, 9+ rows), defeated stay identifiable, cards read through an all-known projection shape | Part 2 board, B1, UX17, R2, W4 | No | WB2 helps |
| R19 | Combat log: per-encounter letters on events, dealt/taken tokens, quieter misses, ×N collapse of equivalent lines, custom palettes | Part 2 log, R1/W3/IL55, C2, C3, A5, UX18; milestone lines distinct (B6) | No | IT9 seam for the combat-text change |
| R20 | Reports category tabs replace the hidden Filters menu; full place inspection (date, weather, temperature grouped) | K8, SF230; temperature links to its native cold/heat effect (B7) | No | R19 |
| R21 | **Polish 1** (IT7) plus Weibao's tune items from R15–R20; empty-state lines for discovered but empty routes (F16, WR61) | VC2, V18, F16 | No | — |
| R22 | You panel: Standard/All attribute sets, gear inline vs Equipment tab | Part 3, IL56, NX11; done check measures the selected tab's facts visible without scrolling at 1366×768 14/17.5/21px (WR42) | No | — |
| R23 | Status-effect chips (countdown only for known duration), derived-stat breakdowns, bar text backing | Part 3, X1–X3, V19, V21, UX21 | No | R22 |
| R24 | Activity clarity on mining and foraging: readiness, cycle, yields known, output home; inspect elsewhere without cancelling | Part 7, AVE6; evaluate `action_legibility_ui` first. Second consumer: the existing management crop flow (`src/management/shipping_farming.js`), presentation only (WR77) | No | Projection agreement only (complexity A1) |
| R25 | **Idle Focus / Around you clean-up:** services show native ready/keeper facts, place prose shortened with a full-reading route, known connected places as a list with travel time (Part 9 list baseline MP6) | UI_NEXT P4, P9S1–P9S2, WR19 | No | Travel quote check (P9F4) for exact times; otherwise label as quoted |
| R26 | **Polish 2:** plus Climb lessons if still wanted (stat identity colors L1, exchange dividers) | IT7, WR49 | No | — |
| R27 | **Knowledge slice:** namespaced `bestiary_knowledge` save slice through the domain registry, LR8 migration, LR1 learn-by-fighting, first-sight impressions (LR9) | Part 4, KL20–KL28, NX5, AR2, AR6 | **Yes**, runs alone | Docs-only route freeze (NX5, NX6); modular-seams M2 registry if landed, else an explicit compatibility note. Strongest model |
| R28 | One hover popup owner: provenance per fact, learn-more hints, log subjects, Bestiary | Part 4, LR10, L9, SF250 | No (reads R27) | R27 |
| R29+ | Learning routes one per round: Perception (LR2), creature books (LR3), examine (LR4), testimony/butchering (LR6) | Round 11 LR table | Maybe | R28 |
| R3x | Footer: truthful save state, Save/Export/Import, Settings, Help, About/Credits; freed space for every-minute facts only if WB3 shows one (M9) | Part 5 footer, UX16 | No | — (can move earlier) |
| R3x | View placement: which views open where (local vs center vs bottom tabs), Proto23 bottom-tab center views kept | UR41, WR21, WR32 | No | WB7 |
| R3x | Control strips for Skills, Crafting and other panels, once Inventory and Reports prove a shared strip | UX24, WR64 | No | R16, R20 |
| R3x | Trip tally from recorded events | B11, P9 | No | Reopen when an event projection exists for visits |
| R3x | Navigation from the WB3 result | UX7–UX12 | No | WB3 + Weibao's pick |
| R3x | Pursuits box with pins stored by one existing owner | Part 5, NX3, UX20, R5 | **Yes**, runs alone | Footer round |
| Later | Sense of place native slice (Village + one route) as a diagram, building on R25's list; place knowledge from exploring, being told and bought maps (WR93) | Part 9, P9E1, CX1–CX8 | No | WB4 + travel quote check (P9F4) |
| Later | Cheat host pilot on the status-window card | Part 10, NX7 | No | WB5 + R28 popup owner |
| Later | Special monsters, enemy effects; one real site | Parts 6, 8 | Content | Reopen when enemy tags/effects have a producer (content owner: enemy data in `src/data/`) or Weibao picks a site journey |

## Workbench studies (parallel, no production source)

Medium model, medium effort; each study follows MW1–MW7 and states which parts are real, simulated or
absent. A study feeds a round; it does not pick a default (that is Weibao's).

| Study | Question | Feeds |
| --- | --- | --- |
| WB1 | Inventory tools: header strip vs bottom strip vs hybrid, same filtered state | R16, R17 |
| WB2 | Opponent board at 1/3/5/8/9 opponents and 21px; cards vs rows vs groups | R18 |
| WB3 | Navigation A/B/C (UX7) with 15+ discovered routes, UX12 journeys | Nav round |
| WB4 | Sense of place: route diagram vs ink/Hanzi vs list on one inspect/travel/return journey | Part 9 |
| WB5 | Cheat foreign layer at runtime: CS2 behavior (focus, Esc, keyboard, no cover of log or pending click, reduced motion), identity looks by type (CT1), several versions per cheat (portrait slot, ASCII, line art) and stage variants (CV1, CV2) | Cheat host pilot |
| WB6 | Simulator surfaces, later: one mode from sim-ui as an interactive preview vs commit | After a simulator runtime consumer |
| WB7 | View placement journeys: where each view opens, Proto23 bottom-tab center views, Back/Esc | View placement round |
| WB8 | Combat feedback and future VFX: hit splats, special-name effects, status flashes, all with reduced-motion forms (WR08, L3) | R19, Part 6 |

## Current brief index

Where each Part's design detail lives (the rounds above schedule it).

| Part | Governing text | Changes save? |
| --- | --- | --- |
| 0 Census, mockups | NEXT_PARTS Round 10 "Part 0"; mockups now WB1–WB4 | No |
| 1 Inventory | Round 10 "Part 1" | No, if its preference is panel-scoped (NX2) |
| 2 Combat, descriptor, Reports | Round 10 "Part 2" | No (combat text only) |
| 3 You panel | Round 10 "Part 3" | No, if panel-scoped (NX2, NX11) |
| 4 Knowledge, popups | Round 10 "Part 4", Round 11 LR1–LR13, [knowledge](knowledge.md) KL20–KL28 | **Yes** |
| 5 Pursuits, nav, footer | Round 10 "Part 5", UX7–UX16 | **Yes for pins** (NX3) |
| 6 Special monsters | Round 10 "Part 6" | Content |
| 7 Activity clarity | Round 10 "Part 7", [complexity](IMPLEMENTATION_COMPLEXITY_REVIEW_2026-10-16.md) A1 | No |
| 8 Sites | Round 10 "Part 8", complexity D1–D2, C8–C20 | Depends on consumer |
| 9 Sense of place | [part-9-direction](part-9-direction.md) P9E1, [room-to-world](part-9-room-to-world.md), [complexity and openness](part-9-complexity-and-openness.md) CX1–CX8 | No |
| 10 Cheat host pilot (new) | NX7 | No |
| Simulator surfaces | [sim-ui](sim-ui.md) | — |

## Findings

| Code | Evidence | Consequence and disposition |
| --- | --- | --- |
| NX1 | Fourteen rounds, about 800 lines; Parts 7–9, cheat looks and simulator surfaces were absent from the top Parts table | **Done:** index and round queue above, pointer at the top of NEXT_PARTS |
| NX2 | **stated:** global `DISPLAY_SETTINGS` keys are written into the save (`src/main.js:6661` `save_data.display_preferences`) and import validates strictly: an unknown key throws (`src/display_settings.js:161–176`). Panel settings registered through `panel_kit` (`registerPanelSettings`, `display_settings.js:40–49`) stay browser-local and are not exported | **ACCOUNT FOR NOW, R16/R22.** "Display setting, no save change" holds only for panel-scoped settings. A new global key enters the save envelope and needs an old-build/new-build import check |
| NX3 | **stated:** display settings accept only enumerated options and hex colors (`normalizeDisplaySettings`, `display_settings.js:51–57`) and are browser-wide. Pinned pursuits are free IDs scoped to a character and world | **ACCOUNT FOR NOW, pursuits round. Corrects** "pinned pursuit IDs persist as display settings if compatible": they are not compatible. Pins live with one existing pin/reminder owner in the save (R5), so that round changes the save and needs a migration or explicit compatibility decision |
| NX4 | **shown + stated (Round 10 L2):** R14 hides native place type tags in combat (`styles/ui_tokens.css:986`). The shell hides native modules by CSS (90 `display:none` declarations in that file, not all native modules) | **R15 fixes it.** Each round's sweep also checks that every native module the shell hides has a replacement route; one with no route is a defect |
| NX5 | **stated:** [knowledge](knowledge.md) `SourceClaim` routes cover fought, read, examined, told and system, with rewind through the existing carry policy. Later rounds added routes it does not name: simulated (SD2), reader foreknowledge (CRSIM), carried-across-rewind marks (SD6) and convincing false sources (CR50, CT4) | **ACCOUNT FOR NOW, before R27.** Freeze the route field as open (new routes are data, not migrations) with a branch/timeline context. Whether a source is false is truth-side state: never in DOM, ARIA, class names or the popup |
| NX6 | CT1 composes a cheat's look from carrier, entity and mechanism; CT4 lets a disguised entity wear its claimed look | **ACCOUNT FOR NOW, WB5 and cheat pilot.** Render from the *presented* identity only. The true entity must not appear in class names, data attributes, asset filenames, CSS variables or alt text until exposure. Add to the KL17 leak matrix; same for simulator honesty grades and undisclosed map nodes (AS21) |
| NX7 | Rounds 9, 11, 13 and 14 produced styles, 100+ mockups and a 142-row crosswalk, but only `status-window` has a runtime renderer (SF248) and no Part owned cheat surfaces | **Proposal: Part 10**, via WB5 then a native pilot on the status-window card. CT1 identity fields go into cheat card data through the cheat card owner |
| NX8 | CV5 is superseded: looks may carry meaning visually | **ACCOUNT FOR NOW.** Text checks cannot verify visual meaning. Those claims need screenshots at the three targets and Weibao's eye; behavior checks stay textual |
| NX9 | Parts 5, 7, 9, cheat center views and simulator views all open through `src/center_modes.js`; most rounds add tokens to `ui_tokens.css` | **ACCOUNT FOR NOW.** Rounds run one at a time on shared UI files (IT3). Extend `center_modes.js` once if its API needs it; later rounds only register |
| NX10 | Stress fixtures (500 inventory rows, 15+ routes, 9 opponents, map nodes) all update under ticks; UX15/UX22 forbid focus loss and reflow under a pending click | **ACCOUNT FOR NOW, R17/R18/Part 9.** Add one measured tick-render time at the stress fixture to the done check |
| NX11 | Part 3's set picker and Part 9's skins read world data; panel settings validate against options fixed at registration, so a missing option normalizes to the fallback and the next commit overwrites the stored choice | **ACCOUNT FOR NOW, R22.** Register every set the game can produce, or show the fallback without committing it |
| NX12 | **stated:** [MOCKUP_SYSTEM](../../../../MOCKUP_SYSTEM.md) (2026-10-16, Weibao's request) says new interactive UI comparisons use the shared workbench. NEXT_PARTS never mentions it; Part 0 and lanes made isolated static sets | **ACT NOW (done):** IT8 and WB1–WB6 route mockups through it |
| NX13 | **stated:** [ARCHITECTURE_RULES](../../../../ARCHITECTURE_RULES.md) AR1–AR16 accepted 2026-10-16; the [modular seams run](../../modular-seams-2026-10-16/CHECKPOINT.md) reserves `main.js`, `display.js`, `save_files.js` on its branch and merges shared-branch edits at each round start. R14 edited `display.js`; R19 and R27 need `main.js`/save | **ACCOUNT FOR NOW (IT9).** UI rounds put new code in their own modules and keep core-file edits to registration lines; R27's save slice uses the registry when M2 lands |
| NX14 | Accepted CX1–CX8 guardrails (USER_VISION 2026-10-16) apply to UI too: CX1 depth on demand, CX7 one slice at a time, CX8 reopen triggers | **ACCOUNT FOR NOW.** Every "Later" row above names what reopens it |

## Coverage of Weibao's requests (WR01–WR99)

A read-only [trace](request-coverage.md) found 99 distinct UI requests from 2026-10-02 to today across USER_VISION,
R14_FOLLOWUP_CONSIDERATIONS, NEXT_PARTS and the Part 9 docs. 67 were covered by a round, a Part with a
done check, delivered candidates R1–R14 or a later instruction that superseded them. The 32 that were
partial or missing are now placed:

| Request | Now in |
| --- | --- |
| Focus and Around you feel unclean at idle (WR19, WR81, WR83) | R25 list baseline, then Part 9 diagram |
| Selected tab readable without scrolling, stats in You at 21px (WR42) | R22 done check |
| Views opening in the right place; Proto23 bottom-tab center views (WR21, WR32) | WB7, view placement round |
| Dropdowns in their own strip beyond Inventory/Reports (WR64) | Strip round after R16, R20 |
| Item detail as hover, pin or inspector (WR24) | WB1 alternatives, Weibao picks, R17 |
| Inventory during combat at 150% (WR11) | R16 fixture |
| Empty discovered routes (WR61) | R21 |
| Milestone lines, temperature effect, trip tally, footer extras (B6, B7, B11, M9) | R19, R20, trip-tally round, footer round |
| Climb lessons: stat colors, dividers (WR49) | R26 |
| Special names, enemy effects (WR55, WR56) | Later with reopen trigger |
| Farming (WR77) | R24 second consumer (existing crop flow); deeper farming with Part 8 |
| Future VFX (WR08) | WB8 |
| Cheat looks, many versions, by type (WR74, WR76, WR80, WR84, WR88) | WB5, then the cheat pilot |
| Bought maps (WR93); Hanzi field look (WR01) | Part 9 slice; WB4 ink/Hanzi treatment |
| Duplicates that differ: observed trait lines per opponent (WR53) | R28 popup |
| This coverage check itself (WR98) | This section |
| Global rank (WR16) | Answered by E6: ranks or levels show only in worlds that have them. No round |
| Simulators, Part 9 scale, whole canon (WR87, WR91, WR92, WR96) | Planning docs; WB6 and Part 9 when consumers exist |
| New cheat types (WR86) | CHEAT_LIBRARY owners |

## Reconciliation against the live tree, 2026-10-16

Weibao: "reconcile latest UI stuff based on plan and chat feedback? more to consider?" Latest chat
feedback is the R14-as-baseline entry above; no newer UI feedback found in USER_VISION or the UI
planning session. Plan stands. Live checks:

| Code | Evidence | Disposition |
| --- | --- | --- |
| NX15 | **shown:** a stray `}` after the R13 Expand-hiding rule (`styles/ui_tokens.css`, former line 1400) made the browser drop the next rule, the `.shell-focus-back` style. Confirmed in a browser: the live sheet lacked that rule; after the fix all three R13 rules parse. Brace scan of `styles/*.css` finds no other imbalance | **ACT NOW, done.** One-character fix, presentation only. R13 focus-back screenshots predate it. Not rebuilt or re-swept at the three targets |
| NX16 | **shown:** `docs/UI_RULES.md`, `docs/MOCKUP_SYSTEM.md` and the Oct 15 UI design docs are untracked; the R13 and R14 source hunks exist only in the working tree, while dirty `AGENTS.md` links UI_RULES | **ACCOUNT FOR NOW, before R15.** IT1 assumes a frozen baseline. An own-paths commit of the R13+R14 UI slice and its rule docs protects it; that commit waits for Weibao's yes |
| NX17 | **shown:** `docs/ARCHITECTURE_RULES.md` and the modular-seams BRIEF, CHECKPOINT and `runs/launch.py` are staged deletions in the shared index while the files remain on disk; IT9 and AGENTS.md link them | **ACCOUNT FOR NOW.** Not ours to unstage; the modular-seams owner confirms. Any commit without pathspecs would drop them from git |
| NX18 | **shown:** `ui_tokens.css` still hides the native location module in parity r3 (`[data-module="location"] {display:none!important;}`), so the NX4 combat-tag regression is live | R15 unchanged, still first, waits on "go" |
| NX19 | NX15 slipped through R13 and R14 sweeps because a dropped rule fails silently | **ACCOUNT FOR NOW, R15 done check:** add a parse check (every stylesheet rule the shell adds is present in `document.styleSheets`) to the inherited sweep |

## LATER

- About 150 round-specific `check-r*.cjs` scripts sit in the dispatch folder. Reopen trigger: a round
  spends more time porting checks than writing them; then build one sweep runner over existing libraries.
- MC1–MC7 and CRM08–CRM11 cheat types go to the CHEAT_LIBRARY and cheat access owners.

## Questions for Weibao

None required. R15 can start whenever he says go; nothing else waits on him except picks among
workbench alternatives (WB1 item detail, WB3 navigation, WB4 map look).

## Verification

Read NEXT_PARTS in full, the complexity review, Part 9 direction, room-to-world, complexity and
openness headings, `knowledge.md` route lines, R14 report/checkpoint, UI_NEXT ranking, MOCKUP_SYSTEM,
ARCHITECTURE_RULES and the modular-seams checkpoint. NX2, NX3 and NX11 come from reading
`src/display_settings.js` and `src/main.js:6661,6794,8578`; nothing was run. NX4's count is a grep.
