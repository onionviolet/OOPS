# Round 15: whole-plan pass and iteration rounds R15+, 2026-10-16

Weibao: "consider NEXT_PARTS details and expand and think accordingly?", then: "can we improve the
round plan accordingly? Aren't we iterating on ideas? r14 is the best thus far but everything is
working to finetune accordingly? More to consider? everything that I mentioned?"

Planning only. No source, build, save, dispatch or commit follows from this file. Codes: **NX**
(findings), **IT** (iteration rules), **WB** (workbench studies), **PX** (panel-extension proposals), **R15+** (native rounds). All
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
| IT2 | **Rolling review.** Weibao plays any candidate when he likes. His feedback becomes a tune item in the next round or the next polish round; awaiting visual review does not stall the queue. A failed changed technical gate prevents promoting that candidate. Rejecting a round removes its owned changes, preserving later and unrelated edits; check dependent rounds before reversing a shared seam (NX20) | "Review backlog" constraint |
| IT3 | **One gap per round, presentation before save.** A save-touching round runs alone, with migration and save/reload/export/import checks | Part-sized bundles |
| IT4 | **The queue is a ranking, not a contract.** A regression or Weibao's feedback jumps the queue; evidence from a round can reorder the rest (UI_NEXT method: frequency × impact × low reversible cost) | Fixed Part order |
| IT5 | **Each round reports at most five "what to look at" items**, keeps the inherited regression sweep and the three desktop targets (1366×768 at 14/21px, 1920×1080 at 21px) | — |
| IT6 | **New ideas land in the next unstarted round's brief** or a workbench study. A new Part only when a new surface appears | New consideration rounds growing the doc |
| IT7 | **Polish round every three or four improvement rounds:** consistency debt in surfaces already touched (number format V18, placeholder glyphs F16/W5, row anatomy F20, tokens VC2) plus accumulated tune items. Bring the first checkpoint forward after R18, rather than waiting through R20; keep existing round IDs as planning references (NX21) | Deferred "finish slice" |
| IT8 | **Mockups go through the shared workbench** ([MOCKUP_SYSTEM](../../../../MOCKUP_SYSTEM.md) MW1–MW7) and run in parallel with native rounds, since they touch no production source | Static PNG sets per lane |
| IT9 | **Runtime rounds name their seam** ([ARCHITECTURE_RULES](../../../../ARCHITECTURE_RULES.md) AR1, AR14, AR15): new UI code lives in its own module and registers; check the modular-seams reservation before editing `main.js`, `display.js` or `save_files.js` | Ad hoc edits in core files |

## Native rounds on the R14 baseline

Order follows how often a player meets the surface, then impact, then cost. Executor: strong model,
high effort for every native round unless noted; Codex or Claude by availability.

**Renumbered 2026-10-16 (R16, then R17):** the shell-default/density/composition round took R16 and the approved structural layout-spec + Step 0 round took R17, so each round queued before them moved up by two (old R16 inventory tabs is now R18, old R18 opponent board is R20, old R21 polish is R23, old R27 knowledge slice is R29). Links elsewhere in this plan that name the old numbers mean the same rounds.

**Renumbered 2026-10-17 (R21):** the approved shell layout editing, one bar and control box round took R21, so each round queued after R20 moved up by one (old R21 combat log is R22, old R22 Reports tabs is R23, old R23 polish is R24, old R29 knowledge slice is R30, old R31+ is R32+). Links elsewhere in this plan and in the R16–R20 reports that name the old numbers mean the same rounds.

| Round | One gap | Detail and codes | Save? | What it needs first |
| --- | --- | --- | --- | --- |
| **R15** | **Combat place descriptor restored**: type tags back in the combat header, focusable, hover/focus/Enter tooltip parity, Esc | Part 2 descriptor subset, L2/SF243, NX4 | No | Nothing. Fixes a known R14 regression **Status 2026-10-16:** technically complete, visual acceptance open ([report](../R15_REPORT.md)) |
| **R16** | **Shell default, density pass, idle and combat compositions** (Weibao's "core first" feedback, IT4 jump): parity shell opens when no presentation is stored; chrome sized to content; top row follows content; Journal and Skills companions beside the actions; Around you as rows | Feedback: core first; WX2–WX7, WX10, WX11, CZ1–CZ9, CTL9/CTL18 subset | No (browser-local layout spec 1) | Nothing. **Status 2026-10-16:** technically complete, visual acceptance open ([report](../R16_REPORT.md)) |
| **R17** | **Structural layout spec + Step 0** (approved 2026-10-16): the game looks identical before and after at the three targets; `shell_composition.js` decisions (top-row rule, `companionsFor`) become per-context UIE20 spec data with the measuring host kept as the fit engine; R16c's region-height block lifts out whole; preview page and bundle on the existing factory panel contract | [Ground-up restructure](#ground-up-restructure-more-to-consider-2026-10-16) GU1–GU6 (GU5 proposal), GU8; NX37, NX38, PV2–PV4, PV8 | No (browser-local layout identity mapped or shell layout reset with a notice, GU6) | R16 landed (done); engine merge landed (ae42e850e), so registry projections are available per GU8. **Status 2026-10-16:** technically complete, preview review open ([report](../R17_REPORT.md)); includes R17a, a fix to the R16c top-row ratchet, kept as a separate step |
| R18 | Inventory category tabs with native counts, Favorites kept, stable known tabs, explicit clear filter | UI_NEXT P2, Part 1, UX13, L4, NX2 (panel-scoped preference); fixtures include a fight in progress at 21px (WR11) | No | WB1 strip placement helps, not required. **Status 2026-10-16:** technically complete on branch `codex/ui-r18-inventory-tabs`, visual acceptance open ([report](../R18_REPORT.md)); also fixes the shell's dead category filter and the CTL13 value-sort leak |
| R19 | Inventory rows and item detail anatomy; selection by item key | Part 1, L5, L6, UX14, NX10 (500-row tick time); detail as hover, pinned or inspector per WB1 pick (WR24) | No | R18 |
| R20 | Opponent board sized by count (1, 2–4, 5–8, 9+ rows), defeated stay identifiable, cards read a public projection shape; all-known is a labelled fixture case, alongside unknown/partial readings (NX22) | Part 2 board, B1, UX17, R2, W4 | No | WB2 helps; R30 still owns learning/persistence |
| **R21** | **Shell layout editing, one bar, control box** (approved 2026-10-17): Edit layout stays in the shell and moves boxes between named slots per context; one top bar with save state and a Menu; Inventory and Reports choices open from one box each | MB1, MB2, MB7, MB9, CB1–CB5, GU6, WX11; Weibao's 2026-10-17 tune items (typable name in the You header, Skills off the idle default, group drop-downs under Options) | No (browser-local placement, spec version 2) | R20 landed. **Status 2026-10-17:** see [R21 report](../R21_REPORT.md) |
| R21b | **Retire the character selector** (Weibao's standing item, 2026-10-17): a new game reaches play without the hero creation panel; the start probe and the CH1 capture re-homed; old saves unchanged | [R21 feedback](r21-feedback-2026-10-17.md) BX15, HR1–HR10 | No format change (defaults; save/reload/export/import gate) | R21 merged (done). Next round, before R22: it finishes R21's name move, is small, and the uncommitted default-hero mechanism (HR1) goes stale the longer it waits. Confirm the reading (HR2) and the HR1 owner first **Status 2026-10-17:** technically complete on `claude/ui-r21b-retire-selector`, visual acceptance open ([report](../R21B_REPORT.md)) |
| R21c | **Status window home in the parity shell** (R21b finding F1): the awakened status window has no region, box or companion in the layout spec, so the shell parks it and CH1 H3–H6 fail since the parity default | R21B_REPORT F1; CH1 gate; UR13 | No | Next after R21b: a cheat panel hidden from the player is a regression, the fix is a spec entry plus the CH1 gate |
| R24 | **Polish 1, brought forward after R20** (IT7): inventory/combat whole-journey review, Weibao's available tune items, empty-state lines for discovered but empty routes (F16, WR61) | VC2, V18, F16, NX21, NX23 | No | R15–R20; ID retained so existing links remain valid |
| R22 | Combat log: per-encounter letters on events, dealt/taken tokens, quieter misses, ×N collapse of equivalent lines, custom palettes | Part 2 log, R1/W3/IL55, C2, C3, A5, UX18; milestone lines distinct (B6); BX7 Report colors folded in (2026-10-17) | No | IT9 seam for the combat-text change. **Status 2026-10-17:** technically complete on `claude/ui-r22-combat-log`, visual acceptance open ([report](../R22_REPORT.md)) |
| **R22b** | **Screen use at 1920 (Weibao's R22 check, 2026-10-17):** the center place region splits in two; a fight lists opponents stacked in that second column; opponent kinds get distinct name colors on the board and in Reports; You narrows to its content; light custom palettes keep native report colors readable | [Screen use at 1920](#screen-use-at-1920-weibaos-r22-check-2026-10-17) SU1–SU12; BX4, BX6 first slice, MB6, VP2; R22 palette finding | No (browser-local layout spec 3, migrated like spec 2) | R22 merged (done). **Next, before R23** (proposal): third time this empty space came up (VP2, BX9, now) and R23's Reports tabs do not depend on it. Weibao's go 2026-10-17, with the status window compact by default (SU11 decided). **Status 2026-10-18:** technically complete on `claude/ui-r22b-screen-use`, visual acceptance open ([report](../R22B_REPORT.md)) |
| **R22c** | **Fill the center and color the inventory (Weibao's R22b check, 2026-10-18):** opponent rows name each opponent with the letter as a small tag; a fight's left column shows your stances and bars; idle splits into actions and a detail slot (selected item, quest or recipe); inventory gets per-category tab colors, kind-colored names and a new-item marker | [Fill the center and color the inventory](#fill-the-center-and-color-the-inventory-2026-10-18) FC1–FC10; SU12, BX8, BX9, BX14 first slice, VP2 | No | R22b merged. Proposal, waits for Weibao's go |
| R23 | Reports category tabs replace the hidden Filters menu; full place inspection (date, weather, temperature grouped) | K8, SF230; temperature links to its native cold/heat effect (B7) | No | R22 |
| R25 | You panel: Standard/All attribute sets, gear inline vs Equipment tab | Part 3, IL56, NX11; done check measures the selected tab's facts visible without scrolling at 1366×768 14/17.5/21px (WR42) | No | — |
| R26 | Status-effect chips (countdown only for known duration), derived-stat breakdowns, bar text backing | Part 3, X1–X3, V19, V21, UX21 | No | R25 |
| R27 | Activity clarity on mining and foraging: readiness, cycle, yields known, output home; inspect elsewhere without cancelling | Part 7, AVE6; evaluate `action_legibility_ui` first. Second consumer: the existing management crop flow (`src/management/shipping_farming.js`), presentation only (WR77) | No | Projection agreement only (complexity A1) |
| R28 | **Idle Focus / Around you clean-up:** services show native ready/keeper facts, place prose shortened with a full-reading route, known connected places as a list with travel time (Part 9 list baseline MP6) | UI_NEXT P4, P9S1–P9S2, WR19 | No | Travel quote check (P9F4) for exact times; otherwise label as quoted |
| R29 | **Polish 2:** plus Climb lessons if still wanted (stat identity colors L1, exchange dividers) | IT7, WR49 | No | — |
| R30 | **Knowledge slice:** namespaced `bestiary_knowledge` save slice through the domain registry, LR8 migration, LR1 learn-by-fighting, first-sight impressions (LR9) | Part 4, KL20–KL28, NX5, AR2, AR6 | **Yes**, runs alone | Docs-only route freeze (NX5, NX6); modular-seams M2 registry if landed, else an explicit compatibility note. Strongest model |
| R31 | One hover popup owner: provenance per fact, learn-more hints, log subjects, Bestiary | Part 4, LR10, L9, SF250 | No (reads R30) | R30 |
| R32+ | Learning routes one per round: Perception (LR2), creature books (LR3), examine (LR4), testimony/butchering (LR6) | Round 11 LR table | Maybe | R31 |
| R3x | Footer: truthful save state, Save/Export/Import, Settings, Help, About/Credits; freed space for every-minute facts only if WB3 shows one (M9) | Part 5 footer, UX16 | No | — (can move earlier) |
| R3x | View placement: which views open where (local vs center vs bottom tabs), Proto23 bottom-tab center views kept | UR41, WR21, WR32 | No | WB7 |
| R3x | Control strips for Skills, Crafting and other panels, once Inventory and Reports prove a shared strip | UX24, WR64 | No | R18, R23 |
| R3x | Trip tally from recorded events | B11, P9 | No | Reopen when an event projection exists for visits |
| R3x | Navigation from the WB3 result | UX7–UX12 | No | WB3 + Weibao's pick |
| R3x | Pursuits box with pins stored by one existing owner | Part 5, NX3, UX20, R5 | **Yes**, runs alone | Footer round |
| Later | Sense of place native slice (Village + one route) as a diagram, building on R28's list; place knowledge from exploring, being told and bought maps (WR93) | Part 9, P9E1, CX1–CX8 | No | WB4 + travel quote check (P9F4) |
| Later | Cheat host pilot on the status-window card | Part 10, NX7 | No | WB5 + R31 popup owner |
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

## Further consideration: extensible panels and smaller iteration costs, 2026-10-16

Weibao: "more to consider based on that?", clarified as:
"UI extension and additions? like narrowing a bannel to fit another useful panel?
Modulizing everything underneath to allow better iterations and implementatio and
improvemets and more?"

The desired outcome is an extensible screen backed by replaceable modules. The
specific layouts, contracts and sequence below are proposals. This remains a
planning pass, not authorization to launch rounds or restructure runtime code.
Apply **AD6–AD8, AD32, AD34, AD36; UR6–UR17, UR41–UR58; AR1–AR16**.
Target: 1366×768 at 14/21px and 1920×1080 at 21px; inspect 17.5px when a width
threshold changes the result. Mobile, a framework migration and an unrestricted
nested docking editor remain outside this proposed first slice.

### ACT NOW: plan corrections completed

| Code | Evidence and consequence | Correction |
| --- | --- | --- |
| NX20 | **stated:** IT2 promised reversal by owned paths, while NX9 says rounds repeatedly share UI files. **Inferred:** restoring a whole file could erase later rounds or another writer's work. R14 already records frozen builds and source hashes in `R14_CHECKPOINT.md` and `R14_REPORT.md`. | IT2 now reverses owned changes with dependent-round review. Before a future round, retain source patch/input identity and frozen review assets; a commit is a separate authorized action, not a prerequisite to preserving a baseline. NX16's commit recommendation is not an added gate. Save-changing reversals retain their compatibility decision. |
| NX21 | **stated:** IT7 said polish every three or four rounds, but R15–R20 contained six improvements before R21. | Move the existing R21 checkpoint after R18, retaining IDs for reference. Review one connected inventory/combat journey there. Later polish cadence follows delivered improvement rounds, not the numeric labels. |
| NX22 | **stated:** R18 specified an all-known projection; AD8 and `knowledge.md` KL24/KL25 require learned opponent numbers with scoped exceptions. **Inferred:** an all-known fixture could accidentally become the renderer's production default. | R18 now names a public projection with unknown/partial/all-known fixture cases. Missing knowledge does not mean all-known. R27 still owns learning and persistence; before it lands, report inherited native disclosure as legacy behavior, not completed AD8 behavior. Add no new truth reads to populate cards. Unknown fixtures prove rendering capability, not an integrated knowledge system. |

### ACCOUNT FOR NOW: make extensions fit the screen and the code

| Code | Source observation and implication | Proposed default, dial and reason | First consumer and observable done check |
| --- | --- | --- | --- |
| PX1 | **stated:** `src/workspace_state.js:6–7,16–20` normalizes three column shares and module dimensions. `src/workspace_layout.js:297–307` resizes a docked panel by changing its whole column; floating panels have independent widths. **Inferred:** narrowing just You does not necessarily free a side-by-side slot beside You. | Distinguish a column resize from a local split. Reuse the current mover for column changes. Where one panel needs a companion, compare a local two-pane composition inside the same registered home against a stacked/tabbed companion. Extend the layout owner only if that actual comparison needs a missing capability. No new global mover per feature. | WB9 compares You + existing Equipment comparison in one area while Inventory and the full-height log remain useful. Record which sibling widths changed. A dock slider moving every sibling is not evidence of independent local resizing. **Improved 2026-10-16:** WB9 starts from the shipped Crafting beside/below split (NX25), then adds You + Equipment comparison as the second case; both are layout-spec entries (NX29), not separate movers |
| PX2 | **stated:** `definePanel` accepts identity/home/eligibility/settings, but no content-derived width requirements (`src/panel_kit.js:7–12`); workspace uses generic clamps. **Inferred:** being resizable does not establish that a panel remains useful when narrowed. | For each touched panel, describe essential visible facts, preferred/minimum useful width at the selected text size, compact/expanded composition and overflow route. Start with local measured styles and shared tokens; promote common metadata only when a second consumer uses it. A compact form rearranges facts and moves detail to an explicit route rather than silently dropping the current action or shrinking text. | WB9 records readable content and control reachability at each proposed width. If two useful minima do not fit, stack, tab or expand the companion with a visible return path. Available width, not viewport width alone, decides the form. **Improved 2026-10-16:** widths are UIE20 spec fields per text size; PX6 applies them through container queries on the panel shell |
| PX3 | **stated:** `src/workspace_views.js` already registers `equipment-comparison` and `current-work`; UR11 protects status/current work/log, UR41 gives views appropriate homes. **Inferred:** adding a permanent new box for every feature would reproduce the earlier crowded screen. | Add panels when simultaneous reading changes a decision: equipment comparison beside an item, known route context beside travel, or ingredients beside a recipe. Reuse existing panels/projections first. Default to a stable optional companion slot for the current task, with an explicit open/close action; context can recommend it without rearranging a pending click. Keep its previous occupant reachable. | First pilot uses Equipment comparison, not a new domain. Compare simultaneous facts gained against displaced facts, scroll and repeated switching. Opening/closing the companion preserves current work, selection and log follow state. No automatic new default for existing saved layouts. **Improved 2026-10-16:** first pilot is the craft detail dial generalized to a per-shell slot (NX25); Equipment comparison is the second consumer that proves reuse |
| PX4 | **stated:** workspace already separates state, layout, navigation and disclosure; `panel_kit` registers panels. However, `parityRegion()` and `makeShellLayout()` in `src/workspace_layout.js:16–43` encode specific feature IDs, and `src/ui/combat_display.js:7` still imports `main.js`. **Inferred:** files called modules do not yet imply replaceable feature boundaries. | Keep domain state/commands/public projection with their domain; keep view rendering/local selection with the panel; let the workspace own placement and lifecycle; keep appearance in shared components/tokens. Inject narrow operations into a view. Move existing structure in a separate behavior-preserving round (AR9) before altering that seam's behavior. Trace the modular-seams owner before choosing registration changes. | Extract only the touched inventory/comparison seam first. A second panel should reuse placement/inspection behavior without another feature-ID branch in the layout host or another import from `main.js`. Count core files and bespoke joins touched, not extracted files. Register/unregister/reopen checks cover cleanup and duplicate handlers. **Improved 2026-10-16:** the view contract is the existing factory `create…Panel({container, read, command})` (NX37); "replaceable" is measured by mounting in preview without `main.js` in its import closure (PV1) |
| PX5 | **stated:** `workspace_state.js:16–23` reconstructs layout from currently registered IDs; `unregisterWorkspaceModule()` normalizes and saves the remaining layout (`workspace_layout.js:474–478`). **Inferred:** using unregister for temporary absence can discard remembered placement; splitting/renaming a module can also strand preferences. | Keep stable IDs for existing homes. Temporary undiscovery/ineligibility uses the existing visibility policy, not destructive unregister as a hiding shortcut. When a real split changes layout identity, explicitly map the old layout to the new one or document a scoped reset, preserving unrelated preferences. Move an existing owned node or render read-only companions; do not clone command-bearing DOM. | Existing custom layout → enable companion → hide/reopen → reload preserves positions/pins and one working command route. Missing/undiscovered content stays unnamed. If a save envelope changes, use the save round gate; browser layout compatibility still needs checking when gameplay saves do not change. **Improved 2026-10-16:** layout identity maps live in the UIE20 spec with a spec version; preview never writes layout keys (PV3) |

These are design constraints for selected extensions, not a demand to modularize
the entire application before R15. Reuse the related engine proposals
[UIE1–UIE12](../../../../ENGINE_EXPANSION.md#ui-engine-support-for-design-and-iteration-2026-10-16)
for refresh, projection, navigation and cleanup instead of inventing another UI
runtime here.

### Whole-screen checks and feedback applicability

**NX23, ACCOUNT FOR NOW.** **Stated:** R16/R18 already stress Inventory and
combat separately; UR57 and UIE12 require changing-state journeys. **Inferred:**
a separately successful narrow panel can crowd its neighbor or hide the facts
needed for an action. Use one shared synthetic journey: fight in progress →
filter inventory → inspect/compare an item → return/resume. For a future
companion pilot, also open/close it during this journey. Measure useful facts
visible together, switching/scroll cost and retained subject/focus. Pick the
relevant transition (item disappears, opponent count crosses a layout threshold,
or companion opens), rather than taking the full Cartesian product of all
stress fixtures. This is a selected scenario within existing completion gates,
not another full suite. No inspection step should run a gameplay command.

**NX24, ACCOUNT FOR NOW.** **Stated:** MW2 permits a focused pane study only
when its question does not depend on surrounding composition. **Inferred:** WB1
and WB2 alone cannot answer PX1–PX3. Record each study's baseline, fixture,
text size, layout variant and the journey its comparison can answer. Feedback
on an earlier candidate stays attached to that candidate; check whether its
reported problem still exists before carrying a fix into a changed layout.
Shared tokens do not prove a workbench adapter matches the current native shell.

### LATER / DELEGATE: bounded extensions, no dispatch

| Candidate | Level / effort | Trigger and done check |
| --- | --- | --- |
| **WB9: whole-screen companion study** | Balanced design/tracing, medium effort | Next UI-extension study. Show baseline, narrower-summary + Equipment comparison, and stacked/tabbed alternative on identical state at the target sizes. Explain displaced content and choose a reversible proposed default. Keep real/simulated/absent parts explicit. Feeds the next unstarted relevant brief under IT6; does not block R15. **Improved 2026-10-16:** run natively on the preview host once Step 0 exists; before that, as a native round candidate on the craft split (NX25) |
| **Native companion pilot** | Strong, high effort if shared placement/lifecycle changes; balanced, medium for a view-local adapter | After WB9 resolves a material layout question and implementation is authorized. One useful Equipment comparison journey on a rebuilt origin, stable return/focus and existing layout compatibility. Existing required build/test/browser gates apply; human visual acceptance stays distinct. |
| **Second-consumer proof** | Balanced, medium effort; strong review if command/save ownership changes | After the pilot, only when another real task needs a companion. Reuse the seam for known route context or ingredient inspection. Demonstrate fewer core joins and retained domain-specific rules. If reuse still needs host-specific branches, revise that seam before generalizing. |

### Settled without asking and evidence limits

Already answered: extensibility is wanted, the Proto23 composition remains the
baseline, desktop comes first, and AR rules favor progressive domain boundaries.
Derived: narrowness must be judged by useful content at actual text size, and
layout state must stay separate from gameplay authority. Reversible proposal:
Equipment comparison is the first companion study because it already exists.
Uncertainty requiring evidence: the best split, minimum widths and native parity
behavior require WB9 and rebuilt browser exercise. No consequential preference
question is required to save these proposals; none of the sizes/layouts is
presented as accepted.

This pass read current source and docs, corrected the queue and appended these
considerations only. No runtime, tests, build, browser, personal save, dispatch,
commit or push was performed. Documentation checks below cover this edit only;
historical verification above retains its original scope.

Documentation verification: a Python comparison against the pre-edit snapshot
confirmed all prior lines retained except the four intended queue/rule rows and
the code declaration; one R21 queue entry follows R18; NX20–NX24, PX1–PX5 and WB9
are present; all 14 local linked files exist. No runtime check was needed for
this planning-only edit.

## Further consideration, round 2: extension seams already in the layout host, 2026-10-16

Weibao repeated the same question ("UI extension and additions? like narrowing a bannel to fit
another useful panel? Modulizing everything underneath ...") with `/more-to-consider`. Per AGENTS.md
a repeat means expand: this round adds angles the first pass (PX1–PX5, NX20–NX24, WB9) did not
cover, found by reading `src/workspace_layout.js`, `src/panel_kit.js`, `styles/crafting_detail.css`
and the `main.js` URL switches. Planning only, same targets and deferrals as round 1. Codes
continue: NX25, PX6–PX10.

### ACT NOW: correction to round 1

| Code | Evidence | Correction |
| --- | --- | --- |
| NX25 | **stated:** a local split with a placement choice already ships. Crafting detail sits `beside` or `below` its list (`workspace_layout.js:151–153`, `styles/crafting_detail.css:67–69`), stored under its own key `yairpg.craft-detail.v1` and applied as a root attribute `data-craft-detail-place`. Round 1 called Equipment comparison the first companion because "it already exists" but missed this working precedent | WB9 adds Crafting beside/below as the **existing baseline** for a local split. The companion pilot generalizes that dial when Equipment comparison becomes its second consumer, instead of building a fresh mechanism. **Inferred risk:** the dial lives on `document.documentElement`, so a second panel with its own placement would share one global attribute; scope it to the panel's shell when generalizing |

### ACCOUNT FOR NOW: seams a narrow or added panel will hit

| Code | Source observation and implication | Proposed default, dial and reason | Observable done check |
| --- | --- | --- | --- |
| PX6 | **stated:** the only width switch is the viewport query `(max-width: 1000px)` (`workspace_layout.js:428`), which swaps the whole layout and its storage key. **Inferred:** text size does not move the viewport, so at 1366×768 and 21px every column keeps the "wide" form with far fewer characters per line; a narrowed panel never learns it is narrow | Default: each panel's compact/expanded form follows its **own inline size** (CSS container queries on the panel shell, thresholds in `rem`/`ch` so text size shifts them). Keep the 1000px whole-layout switch as is (mobile stays deferred). Dial: a panel may declare no compact form and fall back to scroll | The same panel at the same column width shows the same form at 1366 and 1920; at 21px it switches to compact at a wider column than at 14px. No JS resize loop added per panel |
| PX7 | **stated:** `makePreset` (`workspace_layout.js:107`) hard-codes about 20 module IDs in two orders (narrow and wide) plus a separate "context" ID set; `parityRegion()` (lines 38–43) is a third list. A panel missing from them sorts to position 999. **Inferred:** every new panel needs a layout-host edit, which is the bespoke join PX4 wants to stop counting up | Default: `definePanel` accepts a placement hint (region, order weight, context flag) as data; presets read hints, with the current lists kept as overrides until each ID migrates. The move is structural only (AR9): its own round, no behavior change | Before/after preset output is identical for every existing ID. A test panel registered with a hint lands in its declared region with zero edits to `workspace_layout.js` **Improved 2026-10-16:** implemented as UIE20 spec content, not `definePanel` hints (NX29) |
| PX8 | **stated:** besides gameplay-saved `DISPLAY_SETTINGS` (NX2) and browser-local panel settings, the layout host keeps five ad hoc `localStorage` keys: shell, layout, composition, colors, craft detail (`workspace_layout.js:10–13, 96, 148–153`). **Inferred:** each new companion or form dial adds another key and another hand-written validator | Default: new panel-local dials go through `registerPanelSettings` (browser-local, not exported). An old key migrates only when its round touches it: read it once, write the new setting, then stop reading it. Never put layout dials into global `DISPLAY_SETTINGS` (that changes the save envelope, NX2) | An existing `below` craft-detail choice survives the move and a reload. Export/import of a gameplay save is byte-unchanged by layout dials **Improved 2026-10-16:** spec references panel settings; migration of the five keys happens only for keys a round touches |
| PX9 | **stated:** one build can already show two presentations: `selectShell` with `yairpg.presentation.proto23-shell.v1` toggles the shell, and localhost-only `structured_candidate` and probe URL params gate candidates (`main.js:373–376`). **Inferred:** IT2's rolling review is cheaper if Weibao can flip R(n−1) and R(n) on the same save in the same build | Default: a round whose change is a presentation swap may ship its old form behind a localhost-only candidate param for side-by-side review. Reason and cost: switches left in place become permanent branches, so each one expires at the next polish round (IT7), deleted on promote or reject | Both forms render from identical state on a fresh origin. The polish round's report lists live switches; the count does not grow from one polish round to the next **Improved 2026-10-16:** for presentation swaps, a preview link over the same fixture is the cheaper first choice; an in-game switch only when the swap needs live ticks (PV5) |
| PX10 | **inferred:** a companion opened beside its subject must keep a sensible keyboard path. If placement uses CSS `order` or grid placement that differs from DOM order, Tab and screen-reader order no longer match what is seen. UIE4 covers selection survival, not tab order | Default: insert the companion's node right after its subject in the DOM; placement CSS only changes geometry, never reading order | Tab from the subject's last control reaches the companion's first control; Esc or close returns focus to the subject |

### LATER / DELEGATE

| Candidate | Level / effort | Trigger and done check |
| --- | --- | --- |
| **Generic panel contract sweep** | Balanced, medium | Once PX2 minimum widths and PX7 hints exist as data. One sweep iterates every registered panel: register, render at its declared minimum width at 14/21px, hide and reopen, unregister, then checks no leaked handlers and no undiscovered label text (UIE9, UIE12, UI rules). This is the first concrete use of the round-1 LATER reopen trigger for the ~150 `check-r*.cjs` scripts; it replaces per-round panel lifecycle checks, not journey checks |
| **Placement-hint migration** | Balanced, small to medium | After PX7's structural round. Move one ID set per touched round from the hard-coded lists to hints; done when `makePreset` has no feature IDs left |

### Evidence limits

Read only: the files named above plus round 1 and UIE1–UIE16 headings in
[ENGINE_EXPANSION](../../../../ENGINE_EXPANSION.md). Nothing was built, run or opened in a
browser. PX6's "fewer characters at 21px" is inferred from the viewport query, not measured.
No round, dispatch, commit or push follows from this section.

## Joint schedule with the modular engine plan, 2026-10-16

Weibao: "ajudt other pklans accordingly? combining engine plan with round 15 to work together?
more to conisder?" This section is the one place where UI rounds and the modular-seams engine lane
are sequenced together. The [modular brief](../../modular-seams-2026-10-16/BRIEF.md) (MP12) and
[ENGINE_EXPANSION UI round 4](../../../../ENGINE_EXPANSION.md#round-4-joint-schedule-with-ui-round-15-2026-10-16)
point here instead of keeping their own copy. Planning only: no run, merge, dispatch or commit.

### Live state the schedule rests on (shown, 2026-10-16 11:30)

| Code | Evidence | Consequence |
| --- | --- | --- |
| NX26 | **shown:** commit `a595d4768` "UI R13+R14 baseline, UI rules and mockup workbench" holds the R13/R14 source hunks, `UI_RULES.md` and `MOCKUP_SYSTEM.md` | **NX16 resolved.** IT1's frozen baseline exists in git; the engine lane receives it on its next `git merge codex/gameplay-foundations` |
| NX27 | **shown:** `codex/modular-seams` (`3b24c469c`) is not an ancestor of HEAD; `src/domain_registry.js` and `scripts/check_architecture.mjs` do not exist on this branch | IT9's `check:arch`, R27's "M2 registry if landed" and UIE13's open refresh are **not available to UI rounds yet**. Every UI dependency on them waits on one merge, which is Weibao's call (brief: "the merge back is Weibao's or the coordinator's call") **Resolved 2026-10-16:** the engine lane merged `codex/modular-seams` into this branch (HEAD `ae42e850e`); `domain_registry.js` and `npm run check:arch` now exist here |
| NX28 | **shown:** the shared tree carries other sessions' uncommitted edits to `main.js`, `save_files.js`, `simulation*.js`; the lane merges only the committed branch | A UI round that edits `main.js` or `display.js` adds merge reconciliation on top of that. UI rounds keep those files at zero lines where possible and at registration lines otherwise (AR1, IT9) |
| NX17 | still **shown:** `ARCHITECTURE_RULES.md`, the modular BRIEF, CHECKPOINT and `runs/launch.py` remain staged deletions with the files on disk | Unchanged. Any UI or engine commit uses explicit pathspecs |

### ACT NOW: overlaps between the two plans, resolved in the docs

| Code | Overlap | Resolution |
| --- | --- | --- |
| NX29 | Two layout-data proposals: PX7 placement hints on `definePanel` and UIE20's layout spec (regions, slots, companions, minimum useful width) | **One owner: UIE20.** PX7's hints become the spec's first content (region and order per panel, replacing the lists in `makePreset`/`parityRegion`). PX2/PX6 widths are spec fields; PX6's container-width forms are how the spec is applied in CSS. PX8 dials are panel settings the spec refers to. No separate hint mechanism is built |
| NX30 | UIE24 Step 0 makes `crafting_detail.js` the first real view; the stopped M3 lane owns the crafting home (`crafting_home.js`, `crafting_domain.js`) on its branch | **One writer on crafting UI at a time.** Step 0 starts after M3 is fixed and merged, or Step 0 picks its first view only after checking that lane's M3 diff does not touch `crafting_detail.js` and its styles. NX25's beside/below dial then becomes the first companion the spec expresses, which is also UIE26's trigger |
| NX31 | UIE25 converts the touched panel inside each round; IT3 says one gap per round | Conversion is how the round lands its gap, not a second gap. Default: convert in the same round. Dial: if conversion would cost more than the gap itself, the round ships its gap unconverted and the panel converts on its next touch. The report says which happened |
| NX32 | UIE13 proposes one open/publication refresh through `deferSimulationRender`; R16–R18 add panels and tabs that must be correct when opened while paused (UIE1) | Before the merge, UI rounds add no per-panel open-redraw timers or second refresh path; they reuse the existing render batching. After the merge, shell panels register on the same hook |

### Joint sequence (proposal)

Two writers run in parallel only on disjoint files: the engine lane in its own worktree, UI rounds
in the shared checkout.

| Step | Engine lane (`codex/modular-seams` worktree) | UI rounds (shared checkout) | Gate between them |
| --- | --- | --- | --- |
| J1 | MP2 recovery, then the M3 fix in the brief's order: UIE15 harness check, UIE13 open refresh, UIE14 first failing reason | **R15** combat descriptor (`ui_tokens.css`, combat header; no `main.js`) | None. Disjoint files |
| J2 | **Merge of passed rounds** (proposal): M1 and M2 already passed per the lane report. Merging them without waiting for M3 makes `check:arch` and the registry available sooner. Needs Weibao's yes and a re-run of M1/M2 gates on the current base, since inputs changed | Rounds keep going | Weibao's merge decision |
| J3 | M3 completes its retained gate, then merges by the same decision | R16 inventory tabs, without conversion if Step 0 has not landed | — |
| J4 | — (no lane writer on UI files) | **UIE24 Step 0**, structural round run alone, reserves `workspace_layout.js`, `panel_kit.js`, `src/ui/preview/`, `prototypes/workbench/`. Absorbs PX7 for the IDs it moves | After J3 (NX30). If J2/J3 land quickly, run Step 0 **before R16** so Inventory is not rebuilt twice. **Amended by NX40:** Step 0 can start with an existing factory panel and no longer waits for M3 |
| J5 | M4 (one cause crossing pursuits), separately recorded | R17, R18, R21 polish with UIE25 conversion; WB9 as a native companion pilot on the craft beside/below dial (NX25, UIE26) | M4 and any UI round never share a file in one step |
| J6 | MP8–MP10 only on triggers | **Pursuits box** waits for M4's pursuit projection and its quote/receipt path; **R24 activity clarity** reuses M4's path if landed, else `action_legibility` projections; **R27 knowledge** uses the merged registry (drop the "else compatibility note" fallback once J2 lands) | R27 and the pursuits box each run alone (save) |

### Shared verification, not a second suite

- One scenario library: the M1 kept Playwright save scenario (new game, actions, Save, reload,
  Export, Import) is the save tail of NX23's journey (fight → filter inventory → inspect → return).
  UI save rounds and engine rounds call the same script.
- After J2, every UI round also runs `npm run check:arch`; the baseline only shrinks. The existing
  `src/ui/combat_display.js` import of `main.js` is a baseline entry: R15 and R19 add none, and
  removing it is its own structural change (AR9).
- After Step 0, a converted panel's done check adds the UIE25 preview render; screenshots at the
  three targets from fixtures can then replace that panel's round-specific `check-r*.cjs` capture.

### More to consider for the joint plan

| Code | Consideration | Disposition |
| --- | --- | --- |
| NX33 | **inferred:** the lane brief's "out of scope" excludes UI beyond the M3 crafting home, and this plan excludes engine work from UI rounds. Nothing yet owns a defect that sits on the seam (a stale panel caused by a missing registry refresh) | ACCOUNT FOR NOW: a seam defect goes to whichever writer owns the file that changes; the reporting side files it in this section's table, not in a new doc |
| NX34 | **inferred:** UIE17 projections and AR8 domain projections are the same object once a domain registers `projection`. Two shapes for one panel would drift | ACCOUNT FOR NOW: a registered domain's `projection` **is** the panel's view model; UI rounds add fields there rather than building a view-only model beside it |
| NX35 | **inferred:** UIE23 fixture capture exports projections from a live session. Before Step 0, R16–R18 build fixtures by hand (FX00) | ACCOUNT FOR NOW: keep hand fixtures in the projection's shape so capture can replace them later without rewriting checks |
| NX36 | **stated:** the brief requires the lane to record a reconciliation note for shared dirty files at merge | LATER: when a UI round edits a file in the lane's reserved set (`main.js`, `display.js`, `save_files.js`), the round's report lists it so the lane's next merge sees it |

## Addressing the round 3 blockers and costs, 2026-10-16

Weibao pasted the round 3 answer ([UIE17–UIE26](../../../../ENGINE_EXPANSION.md#round-3-one-renderer-for-the-game-and-its-mockups-2026-10-16):
why mockups do not look like the real game) and asked: "how can we address these too?" Each
blocker and cost it named now has a remedy, the round that lands it and a measurable done check.
A source pass changed two of round 3's premises (NX37, NX38). Proposals only; no source, build,
dispatch or commit.

### ACT NOW: corrections from source (stated, read 2026-10-16)

| Code | Evidence | Correction |
| --- | --- | --- |
| NX37 | Round 3 says one panel (`crafting_detail.js`) "already works the right way". **Stated:** 49 `src/*_ui.js` feature panels already use an injected factory, `create…Panel({registry, read, command})` or `({container, read, act})`, and none import `main.js` or `display.js` | The problem is concentrated in the **core screen** (`display.js` panels, `village_workspace.js`, shell CSS), not in every panel. Adopt the existing factory as the view contract rather than a new `render(root, model, handlers)` signature: `read()` returns the model, `command`/`act` carries intents (UIE18, UIE19). `renderCraftingDetail(root, model, handlers)` stays as the stateless inner form a factory may call |
| NX38 | **Stated:** the factory panels have two gaps. `read()` often returns raw state (`createBodyPanel` reads `state.simulation` and `context.facts`, `src/body_ui.js:18`), and panels mount themselves into legacy homes (`document.getElementById("location_actions_div")`, `body_ui.js:20`, `expedition_ui.js:14,60`) | Raw-state panels mount fine in preview over **hand-made** fixtures. UIE23's capture button is limited to panels whose `read()` is an observer-safe projection: capturing raw state could copy sealed truth into a fixture file (sealed-secrets rule). A panel becomes capturable when its round gives it a projection and an injected `container` from the layout spec |
| NX39 | The pasted report flagged three USER_VISION lines missing against HEAD. **Shown:** a line diff finds one real change. The carryover paragraph was reworded to point at [RULES_FROM_SCRATCH](../../../../RULES_FROM_SCRATCH.md#what-no-free-carries-and-no-generic-conversion-meant); the other flagged block (Subsystem ladders, Part 9, Architecture rules) was moved, not lost | Done: the replaced wording is restored in USER_VISION, marked as superseded 2026-10-16 history beside the new text (AGENTS.md: preserve superseded wording as dated history) |

### ACCOUNT FOR NOW: one remedy per blocker

| Code | Blocker (measured 2026-10-16) | Remedy and round | Done check (count only shrinks) |
| --- | --- | --- | --- |
| NX40 | **Preview needs a first real panel.** Round 3 picked crafting detail, which waits on M3 (NX30) | Step 0 mounts one or two existing factory panels **not owned by M3** first (for example a location-actions panel) plus the placeholder boxes. Crafting detail joins once M3 merges. A separate preview entry (its own HTML page and `src/ui/preview/` entry bundled by `build.js`) avoids touching `main.js`, which the lane reserves | Step 0 no longer waits for J3. The game bundle is byte-identical in behavior; preview shows real factory panels from fixtures **Improved 2026-10-16:** preview build reuses the `scripts/build_nethack_preview.mjs` pattern (second bundle, fingerprint, receipt) rather than editing `build.js` (PV2) |
| NX41 | **Shell is a CSS skin:** `styles/ui_tokens.css` has 1,405 lines, 758 `#main_content` selectors, 90 `display:none` declarations and 27 distinct legacy `#…_div` IDs | Each round that converts a panel replaces that panel's legacy-ID selectors with slot and component selectors from the layout spec (UIE20, UIE26). No big-bang CSS rewrite. NX4's route check and NX19's parse check stay in the sweep | The UI sweep prints the three counts; a round may not raise them. Done for a region when the spec owns it and it has zero legacy selectors |
| NX42 | **Workspace reads legacy DOM:** `src/village_workspace.js` reads `#enemies_left_div`, `#clear_count_div`, `#location_description_div` (twice), `#temperature_tooltip`, and `#main_content` 12 times | Each value becomes a projection field when its round touches it: place tags and description in **R15** (descriptor), enemies-left and clear count in **R18** (opponent board), temperature in **R20** (place inspection). `#main_content` lookups go when Step 0 hands the workspace its root | One fewer legacy read per touching round; preview of that region needs no legacy DOM |
| NX43 | **`main.js` importers:** 12 modules, including `display.js` and `src/ui/combat_display.js` | Not a UI-round job. Lane M1 already moves `display.js`'s imports to a leaf and handles mechanical others; UI rounds get that through J2. Until then, UI rounds add no `main.js` import; R19 removes `combat_display.js`'s import as its own structural step if M1 left it (AR9) | After J2, `check:arch` baseline lists no UI file the rounds touched **Improved 2026-10-16:** R15 cannot convert: `combat_display.js` pulls 580 modules including `main.js` and `display.js` (PV1); R15 ships its gap unconverted (NX31 dial) |
| NX44 | **`display.js`:** 6,716 lines, 358 `document.` references | No rewrite. A touching round first moves the panel's code out as a structural step (same behavior, own commit), then changes behavior: Inventory in R16/R17, opponents in R18, log in R19, You in R22. The moved panel takes the factory form (NX37) | `display.js` line count drops for every converted panel; check:arch reports it after J2 |

### ACCOUNT FOR NOW: the two costs round 3 named

| Code | Cost | Remedy | Done check |
| --- | --- | --- | --- |
| NX45 | **Two users for one data shape** (game and preview) | Each projection carries a `version` and a declared field list. The preview host validates a fixture against it, so a stale fixture fails as a fixture error rather than drawing a blank panel. A round that changes a projection updates its fixtures in the same change; one owner, the panel's domain. Hand fixtures follow the projection shape now (NX35) | Changing a projection without its fixture fails the preview check **Improved 2026-10-16:** projection `version` is not a save version; it never enters the save envelope |
| NX46 | **Tick cost if panels redraw whole** | Keep the existing batching (`deferSimulationRender`, UIE3) and memo keys that cover every input (UIE16). Preview gives a cheap benchmark: render the 500-row, 9-opponent fixtures N times without ticks. Add a keyed-row helper only if that number regresses (round 3's own condition) | Each converted panel records render time at its stress fixture; NX10's tick measurement stays the in-game check |

### What this changes in the joint schedule

- J4 Step 0 is no longer blocked on M3 (NX40). It still runs alone and still reserves the layout
  files, so it fits between R15 and R16 whenever Weibao wants the preview.
- The conversion load per round (UIE25, NX31) is smaller than round 3 estimated for factory panels
  and larger for the `display.js` panels in R16–R22; the structural step (NX44) is where that cost
  goes.
- Nothing here needs the lane merge except NX43's `check:arch` report.

## Improved ideas and preview feasibility, 2026-10-16

Weibao: "improve all the ideas accordingly, and then /more-to-consider". Earlier rows are improved
in place: each changed row ends with **Improved 2026-10-16** and keeps its original text (PX1–PX5,
PX7–PX9, NX40, NX43, NX45, WB9 here; UIE18, UIE22–UIE25 in
[ENGINE_EXPANSION round 3](../../../../ENGINE_EXPANSION.md#round-3-one-renderer-for-the-game-and-its-mockups-2026-10-16)).
New codes PV1–PV8. Proposals only.

### How the ideas fit now

1. **Contract:** the existing panel factory `create…Panel({container, read, command})`; `read()`
   becomes an observer-safe projection when its round touches it (NX37, NX38, UIE17–UIE19).
2. **Layout data:** one UIE20 spec holds regions, slots, companions, order and minimum useful
   widths per text size; PX2, PX6, PX7 and PX8 are fields or uses of it (NX29).
3. **Preview:** a separate page and bundle, storage stubbed, mounting real factory panels over
   fixtures (UIE22, NX40, PV2, PV3).
4. **Convert by touch, gated by import closure:** a panel converts when its round touches it and
   its closure is free of `main.js` and `display.js` (UIE25, NX31, NX44, PV1).
5. **Companion:** the shipped Crafting beside/below split becomes the first spec slot; Equipment
   comparison proves reuse second (NX25, PX1, PX3, WB9).

### Feasibility measured (shown: esbuild metafile over each entry, nothing executed)

| Entry | Modules in closure | Includes `main.js` / `display.js` |
| --- | --- | --- |
| `crafting_detail.js` | 2 | no / no |
| `action_legibility_ui.js` | 1 | no / no |
| `event_feed_ui.js`, `harvest_ui.js`, `village_workspace.js` | 11, 16, 12 | no / no |
| `workspace_layout.js`, `panel_kit.js` | 5, 6 | no / no |
| `body_ui.js`, `expedition_ui.js`, `exchange_ui.js` | 242–243 (simulation closure) | no / no |
| `src/ui/combat_display.js` | 580 | **yes / yes** |

### More to consider (PV)

| Code | Evidence | Disposition |
| --- | --- | --- |
| PV1 | **shown**, table above. The workspace, panel kit and most factory panels already bundle without the game core; the combat display does not | **ACCOUNT FOR NOW.** Import closure is the objective "can this panel preview?" test. A small script printing each registered panel's closure joins the UI sweep; after J2 it can fold into `check:arch`. R15 ships unconverted; combat converts after the lane cuts its `main.js` import |
| PV2 | **stated:** `scripts/build_nethack_preview.mjs` already builds a second bundle (`dist/nethack-fieldcraft-preview.js`) with a fingerprinted HTML entry and a hash receipt; `dist/` is tracked and `dist/bundle.js` is already dirty from other sessions | **ACCOUNT FOR NOW.** The preview build copies that script's pattern with its own entry. Default: the preview bundle is a local dev artifact and stays out of git, so shared-branch `dist/` churn does not grow. Dial: track it only when Weibao wants a hosted review link |
| PV3 | **stated:** the workspace writes layout to `localStorage` on change (`workspace_layout.js:96`), and the game stores saves there too. **Inferred:** a preview page on the same origin as the game would share those keys | **ACCOUNT FOR NOW, Step 0 done check.** Preview runs with injected in-memory storage (or its own port/origin). After a preview session, the game's layout and save keys are byte-identical. Personal saves stay untouched by rule |
| PV4 | **inferred:** the 242-module simulation closure has not been checked for import-time side effects (timers, storage, globals) | **ACCOUNT FOR NOW, Step 0.** Preview boot asserts zero timers registered and zero storage writes before any panel mounts; any module with import-time effects is listed and wrapped, not silently imported |
| PV5 | **stated:** R14 served a per-round demo page (`r14-demo.html`) and comparison page; PX9 proposes in-game switches | **ACCOUNT FOR NOW.** Once preview exists, a round's review artifact is a preview link per fixture, before and after; this replaces per-round demo pages and most in-game switches. IT2 rolling review becomes "open these links" |
| PV6 | **stated:** browser checks load Playwright from a Codex runtime path through `YAIRPG_PLAYWRIGHT` (`prototypes/workbench/check.cjs:1`); `node_modules` has only esbuild and inkjs, no DOM library | **ACCOUNT FOR NOW.** Renderer checks run in the preview page through the same Playwright resolver; no new dependency. **Risk:** if that runtime path moves, every UI check breaks at once. LATER: one shared resolver helper for all check scripts (balanced, small; done when every UI check resolves Playwright from one place) |
| PV7 | **stated:** `origin` is a public fork (AGENTS.md); sealed secrets must not reach Weibao outside their discovery route | **ACCOUNT FOR NOW.** Committed fixtures carry observer-safe content only. Fixtures for sealed worlds live in gitignored private paths; fixture file names and IDs follow the NX6 leak matrix |
| PV8 | **inferred:** preview screenshots mislead if preview uses different text size, palette or density than the game (NX24) | **ACCOUNT FOR NOW.** Preview applies the real display-setting defaults and actual text size through the same tokens, never the user's stored preferences. Done check: a converted panel's preview at 21px matches its native screenshot geometry at the target viewport |

### LATER / DELEGATE

| Candidate | Level / effort | Trigger and done check |
| --- | --- | --- |
| Closure report script (PV1) | Balanced, small | Before Step 0. Lists each registered panel and whether its closure reaches `main.js`/`display.js`; output pasted in the Step 0 report |
| Step 0 with PV2–PV4 and PV8 built in | Strong, medium to large (unchanged from UIE24) | After R15 or whenever Weibao wants the preview; runs alone. Done adds: storage keys unchanged after preview, zero import-time timers/writes, preview geometry matches native for its first factory panel |

### Evidence limits

Closure counts come from an esbuild metafile build of each file with `write: false`; no module
was executed. PV3 and PV4 are inferred from source reading. Nothing was built into `dist/`, run
in a browser, committed or dispatched.

## Whole-screen composition: narrowing to fit useful panels everywhere, 2026-10-16

Weibao, with a screenshot of the classic layout on a fresh character
([saved](../evidence/wx-classic-fresh-weibao-2026-10-16.webp)): "how narrowing panels to fit
other useful panels and how the whole screen works together, beyond just You and Equipment.
/more-to-consider Update and save accordingly". Codes WX1–WX14, unused elsewhere. Proposals only.
Target stays 1366×768 at 14/21px and 1920×1080 at 21px; the screenshot's viewport is unknown
(image 2000×941), so its proportions are evidence of the pattern, not measurements at a target.

### What the screenshot shows (shown, read by eye)

| Region | Content on a fresh Village character | Rough unused share |
| --- | --- | --- |
| Hero and stats, with Stats/Equipment/Tools tabs | Dense: bars, 12 stat cells, active effects | Little |
| Inventory/Combat, with sort and category strips | Purse line and 3 items | About 85% of the list |
| Time/weather and Village description | Seven lines of place prose | About a third |
| Actions | Six buttons | About 40% below them |
| Quests/Bestiary/Anthology/Data | One quest, "Hide completed" | About 85% |
| Combat/Environmental/Character skills, Skills/Stances/Magic tabs | Three collapsed groups | About 75% |
| Log, with Levels/Events/Crafting/Combat/Loot/BGM tabs | Empty | All, until play starts |

Roughly half the screen is empty. Late in a run the same frames overflow (500 items, many
quests, a full log). Slack is a property of **state**, not of the layout.

### ACT NOW: correction to the plan's picture of the screen

| Code | Evidence | Correction |
| --- | --- | --- |
| WX1 | **stated:** the R14 parity grid is five regions, `"player player focus log" / "inventory actions actions log"`, columns `336fr 110fr 446fr 379fr` (`styles/ui_tokens.css:641–643`). The classic layout in the screenshot has a fourth column of records (Quests/Bestiary/Anthology/Data over Skills/Stances/Magic) visible alongside play; in the shell, those open as center views or bottom tabs (WR21, WR32) | Earlier rounds (PX1–PX10, WB9) reasoned only about the shell. Whole-screen composition has two baselines: classic shows records **simultaneously**, the shell shows them **on demand**. The open question is which records earn simultaneous space in which context, not only how to fit a companion next to You. WB9 now covers both baselines |

### ACCOUNT FOR NOW: how the whole screen works together

| Code | Consideration | Proposed default, dial and reason | Observable done check |
| --- | --- | --- | --- |
| WX2 | **Shorten before narrowing.** The slack in the screenshot is vertical: short lists in tall frames. Narrowing a column costs line length for stat labels, item names and log lines at 21px; shortening a panel inside its column costs nothing when the panel is sparse | Default order of levers: (1) stack a companion under a sparse panel in the same column, (2) merge two sparse panels into one tab set, (3) change column widths. Dial: a world or context with wide content (maps, opponent boards) may start at lever 3 | WB9 reports which lever each proposal used and the line length of the narrowest text at 21px |
| WX3 | **Height follows content within limits.** Workspace modules store a fixed `height` (40–1000px, `workspace_state.js:11,19`); the shell rows are fixed (`min(304px,45%)` / `1fr`) | Each panel declares minimum, preferred and maximum useful height in rem (UIE20 fields, beside PX2's widths). Inside a column, panels take at least their minimum; slack goes first to the panel whose content overflows, then to the column's companion slot. A sparse panel shrinks to its content plus its empty-state line (UR32) | Fresh fixture: no panel shows more than a set share of empty frame. Populated fixture: no panel overflows while another in its column has slack |
| WX4 | **Re-compose only at stable moments.** UR52 forbids a tick, count update or discovery moving a pending target. Content-driven heights would move buttons every time an item arrives | Re-compose on context change (enter or leave combat, travel, open a center view), on explicit actions (open, close, pin, resize) and on a panel's first content after being empty. Never on ticks. Between those moments a growing list scrolls inside its frame | Under a pending click, 30 ticks with items arriving move no target (NX10 fixture) |
| WX5 | **Each panel declares how it yields.** "Narrow X to fit Y" generalizes into a yield behavior per panel, stored in the layout spec: *never* (status bars, current work, log: UR11), *compact form* (place prose → title and first line with a full-reading route, R25; stats → Standard set, R22), *collapse to header*, *move to tab or center view* | When space is short, panels yield in a per-context order. Nothing disappears silently: a yielded panel keeps a visible header, tab or count (UR13) | A test context with all yield kinds: each yielded panel stays reachable in one action with focus returning |
| WX6 | **Compositions are per context.** Already visible: col 1 switches Inventory↔Combat. In combat the opponent board (R18, sized by count) needs the place panel's height; at a merchant, stock and purse matter; at a quest giver, the quest detail | The spec holds a small set of context compositions (idle in a place, combat, travel, merchant/work, reading). Each names the companions it recommends and the yield order. Reuse `setWorkspaceContext` and the existing preset path rather than a second context system | Entering and leaving combat restores the idle composition, scroll positions and selection exactly (UIE4) |
| WX7 | **Companions per column, from existing views.** Candidates the screenshot suggests, all reusing panels that exist: under a short inventory, item detail or Equipment comparison (WR24, R17); under a short action list, current work when active, otherwise the selected action's preview (known destinations with travel times for Move/Fast travel, R25 list baseline); under a short quest list, the selected quest's steps; under collapsed skills, the selected skill's next unlock | A companion appears only when it changes a decision now (PX3) and follows the shared selected subject, not its own selection (UIE4). The idle default recommends; it never replaces a panel the player opened | Per companion: facts gained against facts displaced at the three targets, on fresh and populated fixtures |
| WX8 | **The log keeps its column.** The empty fresh log is the biggest single slack, but UR11 says never shrink or crowd it, and it fills within minutes of play | The fresh log shows a one-line empty state (UR32) and keeps its width. Its slack is not lent to other panels. Dial: none proposed; changing this needs Weibao's word against UR11 | Log width identical across all compositions and contexts |
| WX9 | **Text size removes slack.** At 1366×768 and 21px the screen has far less spare height than this screenshot. A stacked companion that fits at 14px may not fit at 21px | Evaluate fits in rem at the actual text size (PX6). If minimum heights do not fit, the companion becomes a tab in that column or a center view with a return path (UR41) instead of squeezing | Same fixture at 14px stacks, at 21px tabs; both reach the same facts in at most one action |
| WX10 | **Records: simultaneous or on demand.** Classic shows quests and skills alongside play; the shell moved them to center views. Early on both are sparse; late on, quests matter while travelling and skills while training | Default: records stay on demand in the shell (current baseline). A records companion earns simultaneous space in contexts where it drives the next action: the active quest's next step while travelling or idle, the trained skill's progress while training. Show the one relevant line, not the whole records column | Idle and travel fixtures show the active quest step without opening Quests; the full Quests view stays one action away |
| WX11 | **Manual choices win.** Players resize, pin and collapse (PX5, UR17, UR58) | Automatic composition applies only to unpinned, unresized panels; a manual change sticks for that context until reset. A "Reset this layout" action restores the context default | Pin a panel, change context twice: the pinned panel never moves |
| WX12 | **Width shares from content, per context.** The shell's fixed column fractions give the actions column 110fr; classic gives every column the same share. Action labels are short at 14px and wrap at 21px; stats need label plus value; the log wants long lines | Column shares become per-context spec values with minimum useful widths (PX2), measured at 21px first, since that is where wrapping starts | No action label, stat row or log line wraps at 1366×768 21px in the idle and combat compositions |

### LATER / DELEGATE

| Candidate | Level / effort | Trigger and done check |
| --- | --- | --- |
| **WX13: slack map in the sweep** | Balanced, small | Before the next layout-changing round. For each region at each target, record content height against frame height on three fixtures: fresh (this screenshot's state), populated, combat. Output one table per round. This turns "the screen works together" into a number each round can only improve or explain |
| **WX14: WB9 widened to whole-screen compositions** | Balanced design and tracing, medium | Replaces WB9's You + Equipment scope. Compare, on identical state, the classic and shell baselines with: idle (item detail under inventory, current work or route list under actions, active quest line), combat (opponent board takes place height, Stances foreground), merchant. Report levers used (WX2), yield order (WX5), slack map (WX13) and the 21px fallback (WX9). Feeds the context-compositions round below; picks nothing for Weibao |
| **Context-compositions round** | Strong, high (shared placement and lifecycle) | After Step 0 (the layout spec exists) and the companion pilot. Adds the idle and combat compositions only; merchant, travel and reading follow as their rounds touch them. Existing build, test and rebuilt browser gates at the three targets; WX4 stability check; save and import untouched (layout stays browser-local, NX2) |

### How this changes the queue

- R17 (item detail), R18 (opponent board), R22 (You sets) and R25 (place prose, route list)
  already build the compact forms and companions WX5–WX7 need; their briefs add the yield
  behavior and min/preferred heights as spec fields once Step 0 exists.
- R21 polish adds UR32 empty-state lines for a fresh Quests list, skills groups and log (WX8).
- WB9 becomes WX14. The context-compositions round sits after the companion pilot, before the
  R3x footer and navigation rounds.

### Evidence limits

The table above is read by eye from Weibao's screenshot at an unknown viewport. The shell grid
and module height fields are read from source. Nothing was built, measured in a browser,
committed or dispatched.

## Every little control, 2026-10-16

Weibao: "what to consider based on this and more? Every little menu considerations?
/more-to-consider". The same classic screenshot (WX), control by control. Codes CTL1–CTL24,
unused elsewhere. The [census](census.md) already lists every control site (CN rows) and
R14_FOLLOWUP F18–F20 covers control strips; this round adds what each control **means, owns and
risks**. Proposals only; "classic" is the screenshot's layout, "shell" is R14.

### ACT NOW: facts that change earlier assumptions (stated from source)

| Code | Evidence | Consequence |
| --- | --- | --- |
| CTL1 | `index.html` has 66 `<div … onclick>` controls and one `<button … onclick>`. Sort strips, category tabs, journal tabs, Skills/Stances/Magic and log filters are all clickable divs | In classic, most small controls cannot be reached by Tab or announced as buttons. Every strip round must check what the shell already wrapped before claiming keyboard parity (UR53). A count that only shrinks joins the WX13 sweep |
| CTL2 | The log row (`message_show_*`, `index.html:680–695`) is a set of **independent show/hide toggles**, all highlighted by default, not tabs. "BGM" calls `showBackgroundMessages()`: background messages, not music. The shell relabels the row to Growth, Events, Crafting, Combat, Loot, World (`src/proto23_shell.js:118`) | Two names for one control across baselines, and a classic label that reads as a music switch. R20's "Reports category tabs" must decide tabs (one at a time) versus toggles (several at once); today's behavior is toggles. The label set should be one vocabulary in both baselines |
| CTL3 | Each skill group has a leading chevron that collapses it and trailing ⌄ ⌃ that **move the group down or up** (`src/display.js:5320–5345`); the order is saved in the game save (`save_data.skill_category_order`, `main.js:6488`) | The same chevron shape means "collapse" and "reorder". A player trying to collapse can reorder instead, and the change persists in the save |
| CTL4 | "Hide completed" (`save_data.are_finished_quests_hidden`, `main.js:6478`), "Hide max level skills" and combat autoswitch (`game_options`, saved as `save_data.options`, `main.js:6666`) live in the **gameplay save** | NX2 said panel settings are browser-local. Classic's small toggles are not: they travel with export/import. Moving any of them to panel settings is a save change needing a migration or compatibility note (UR17, UR58) |
| CTL5 | Two "favorite" ideas: the star (Favs category) and `favourite_consumables`, which drives the row's **auto** toggle (auto-use) (`display.js:2232–2242`); generated vials have no auto toggle | Labels must keep them apart: star = "keep in Favorites", auto = "use automatically when needed". Hover or detail says when auto fires and from which stack |

### ACCOUNT FOR NOW: control by control

| Code | Control (screenshot) | Consideration | Proposed default and dial | Round |
| --- | --- | --- | --- | --- |
| CTL6 | Bars: xp, stamina, mana, hp | "0/0 mana" shows a resource this character does not have yet; "42/42stamina" lacks a space; white text on bright green and red at 21px | Show a bar once the character has the resource (world-dependent, as ranks are, E6); format numbers per V18; check contrast on every bar color | R22, R23 |
| CTL7 | Stat table: AP, EP, Atk power, Crit mult | Abbreviations without explanation; derived values without breakdown | Hover and focus give the full name and the breakdown (UR47, X2) | R23 |
| CTL8 | "Active effects: 2" | A count with no route to the effects | The count opens or scrolls to the effect chips; chips show countdown only for known duration (UX21) | R23 |
| CTL9 | Stats / Equipment / Tools tabs | Tabs under the panel, matching F18; "Tools" names a mechanism | Selected state readable without color; label by content if "Tools" is unclear to a new player (UR10) | R22 |
| CTL10 | Inventory / Combat tab | Combat greyed outside a fight; `disable_combat_autoswitch` exists, so by default the panel switches itself when a fight starts | Autoswitch fires only when no click is pending and no item is selected (UR52); otherwise show a visible "Fight started" cue on the Combat tab. The existing option stays the player's dial | R16 fixture "fight in progress" |
| CTL11 | Purse "10C 2W" | Coin letters by color only; unit names unexplained | Hover gives coin names and total in the smallest unit; color is never the only cue | R21 polish |
| CTL12 | Item row: star, slot tag, name, quality %, [use]/[equip], auto, price | Bracket text works as buttons but is not one (CTL1); "[50%]" unexplained; prices of two widths break the column | Real buttons with the bracket look kept if Weibao likes it; quality % gets a hover; prices right-aligned with tabular numerals (F20, L5) | R17 |
| CTL13 | Sort by name / value / type | Sorting by a value the player has not learned **leaks it through order**. Re-sorting while loot arrives moves rows under the pointer | Sort uses displayed (known) values only, unknown last; re-sort at stable moments (WX4); selected row follows by item key (UX14). Clicking the active sort again reverses it, shown by an arrow | R16 |
| CTL14 | All / Equipment / Usable / Other / Favs | No counts; an empty category looks the same as an unknown one | Native counts, and a known-empty category stays in place with "None yet" (UX13, UR52) | R16 |
| CTL15 | Header: date, season, weekday, Day, weather icon, temperature | Dense one line; "24/04/999" order is ambiguous; ticking clock can shift text | Tabular numerals so ticks never shift layout; hover explains the date order; temperature links to its effect (B7) | R20 |
| CTL16 | ☆ before the place name | A star with an untraced purpose sits next to the star that means Favorites | Trace its function before R25. If it pins the place, its label says so, and it does not share the Favorites glyph without sharing the meaning | R25 |
| CTL17 | Action buttons with icons | Clear, by destination (UR10). New discoveries could insert a button above a pending click | New actions append or animate in only at stable moments (WX4); a disabled action says why; number-key shortcuts are a LATER option | R24, R25 |
| CTL18 | Quests / Bestiary / Anthology / Data, then "= Quests =" | Four tabs wrap so Data sits alone on a second row; the heading repeats the selected tab; Notebook appears only when discovered (good) | One row that wraps by available width (PX6); drop the duplicated heading or make it the selected subject's title | Records view round (R3x view placement) |
| CTL19 | "Hide completed" | Hides finished quests, saved in the game save (CTL4) | Keep its save home; show "N completed hidden" so hiding is visible | R3x records |
| CTL20 | Skill groups: collapse chevron plus ⌄ ⌃ reorder (CTL3) | Same glyph, two meanings; reorder persists | Collapse keeps the chevron; reorder uses labelled Move up/Move down, or moves into layout editing like the workspace's Pin. Existing saved orders load unchanged | R3x control strips |
| CTL21 | Hide max level skills; Sort by name / level / progress | Progress and level sorts reorder while skills train, moving rows under the pointer | Re-sort on stable moments only; while a row is hovered or selected the order holds (UR52) | R3x control strips |
| CTL22 | Skills / Stances / Magic | Magic shows before magic exists for this character | Tabs appear on discovery, like Notebook; a known-but-empty tab says how to fill it (UR32) | R3x control strips |
| CTL23 | Log filters (CTL2) | Toggling a category off can hide a new unlock or a combat death | Show "N new hidden" on an off filter; milestone lines (B6) ignore filters or flag themselves | R19, R20 |
| CTL24 | Checkboxes at 21px | Small white squares; label and box are separate targets | Shared checkbox component with the label as part of the target, sized from tokens | R21 polish |

### Cross-cutting

- **One control primitive.** Strips, tabs, toggles and row buttons become one shared component
  family with selected/pressed state, keyboard path and token sizes (UR53, UX24). Each round
  converts the controls it touches; CTL1's count only shrinks.
- **Every control declares its state owner** (UR58): save (CTL4, skill order), browser (layout,
  panel settings) or none (transient). The census gains a "state owner" column the next time it
  is regenerated; no control changes owner without a compatibility note.
- **No control reorders under the pointer.** Sorts, discovery and autoswitch wait for stable
  moments (WX4); this is the most repeated risk in this pass (CTL10, CTL13, CTL17, CTL21).
- **No control leaks knowledge through order, count or presence** (CTL13, CTL22; KL17 leak
  matrix).

### LATER / DELEGATE

| Candidate | Level / effort | Trigger and done check |
| --- | --- | --- |
| Census "state owner" and "real button" columns | Balanced, small | Next census regeneration. Every CN row names save/browser/none and whether its control is a real button |
| Number-key shortcuts for actions | Balanced, small | After CTL1 conversion of the action list. Keys never fire while typing; shown on hover |

### Evidence limits

Read from `index.html`, `src/display.js`, `src/main.js` and `src/proto23_shell.js` at the lines
cited; CTL16's star was not traced. Nothing was run, built or committed.

## Feedback: core first, 2026-10-16

Weibao after R15 (quote in USER_VISION): things look big for no reason, and the core changes and
more panels he asked for are missing. **Stated:** only R15 is implemented; WX, CTL, PX and Step 0
are plans. **Stated:** the shell is opt-in (`workspace_layout.js:11–15`, keys default off), so the
default screen is classic, where R1–R15 changes do not show.

Proposed reorder (IT4: feedback jumps the queue), done by the strongest session:

1. **Which screen is the baseline.** Decide whether the redesigned shell becomes the default or the
   core work lands in classic too. This needs Weibao's pick; everything below follows it.
2. **Density pass (new round, before R16):** controls and frames sized to content: oversized tab
   strips, action buttons and empty frames shrink; heights follow content within limits (WX2, WX3,
   CTL9, CTL14, CTL18, CTL22). Done check: slack map (WX13) at the three targets on fresh and
   populated fixtures, no text below current minimum size.
3. **Whole-screen composition, natively (WX5–WX7, WX10):** companions under sparse panels using
   existing views (item detail, route list, active quest line, current work), yield order per
   panel, idle and combat compositions. This replaces the WB9/WX14 study as the next step.
4. Then R16 onward as queued.

## More panels and a cohesive screen, 2026-10-16

Weibao during R16, with a classic-layout screenshot (four columns: You and stats over Inventory;
place prose over actions; Quests/Bestiary/Anthology/Data over Skills/Stances/Magic; log):
"Incorporating and adding panels to make things more cohesive? So like more panels? Changing the
around you to be more visually better? more to consider?" Codes CZ1–CZ10, unused elsewhere.
Applied in R16c (see [R16 report](../R16_REPORT.md)); proposals beyond that stay proposals.

### ACT NOW (taken into R16c)

| Code | Evidence | Disposition |
| --- | --- | --- |
| CZ1 | **stated:** `records` (`journal_div`) and `skills` (`skills_and_stances_div`) are registered workspace modules (`main.js:10183–10184`). `makeShellLayout` hides every ID missing from its order list (`workspace_layout.js`), so the shell shows them only as center views from the top nav | "More panels" first means **placing panels that already exist**, not new domains (PX3). R16c gives them a companion slot in the shell |
| CZ2 | **shown** (R16 probe, 1366×768 21px, populated fixture): Around you draws each person/thing as a padded card (8/10px) with the role on a second line; five entries take 344px and the place prose is cut after one line | R16c restyles them as hairline rows, name and role on one line where it fits, and keeps the prose readable below (UR46: grouping and alignment, not smaller text) |

### ACCOUNT FOR NOW

| Code | Consideration | Proposed default, dial and reason |
| --- | --- | --- |
| CZ3 | **Where a companion goes.** The bottom actions region is the widest bottom frame, and in every fixture its actions use less than its width | Companion column inside the actions region, beside current work and the action list; the place header and the bottom pane tabs span both. Dial: a context may put its companion elsewhere when that frame is the sparse one (WX7) |
| CZ4 | **Which companion, per context** | Idle: Journal (quests) over Skills. Combat: Skills only, so Stances sit beside the fight (WX6). Merchant, travel and reading compositions follow when their rounds touch them |
| CZ5 | **Undiscovered panels stay unnamed** (UR52, CTL22) | The companion column appears only when one of its modules is discovered; otherwise the actions use the full width |
| CZ6 | **Saved shell layouts hide records/skills** | One browser-local layout upgrade (spec version) unhides them once; a later manual hide wins (WX11, UR17). No game-save change |
| CZ7 | **One node, one home** (UR8, PX5) | The Journal and Skills nav buttons still expand the same module into the center; Back returns it to the companion slot |
| CZ8 | **Text size decides the form** (WX9, PX6) | Companion width follows content in `rem`; if the action list would drop below its minimum useful width, the companion yields first |
| CZ9 | **Cohesion is shared anatomy** | Companion panels use the same header, hairline row and tab look as Inventory and Reports (UR30, F20); no per-panel styling |

### LATER / DELEGATE

| Candidate | Level / effort | Trigger and done check |
| --- | --- | --- |
| CZ10: a records column of its own at wide viewports (classic's fourth column) | Strong, medium | After R16c is reviewed. At 1920×1080 21px, a fifth column keeps every action label and log line unwrapped (WX12) |
| Active quest line in the place header (WX10) | Balanced, small | When R16c's companion is hidden at small sizes; the one-line quest step stays visible |
| Around you: full place reading route and known-route list | Balanced, medium | R25 as queued (renumbered in the R16 report) |

## Ground-up restructure: more to consider, 2026-10-16

Weibao: "Will UI be restructured from ground up for more adaptability and more?" then
`/more-to-consider`. Answer given: not as briefed; the core-ui session (R16a–c) is incremental, and
the ground-up structure (UIE17–UIE26) is convert-as-you-touch. Recommendation: insert the layout
spec and Step 0 as one structural round **after R16c lands and before further composition work**.
Codes GU1–GU8. Read live at 15:57: `R16_CHECKPOINT.md`, `src/shell_composition.js` (101 lines,
uncommitted, core-ui's).

| Code | Evidence | Disposition |
| --- | --- | --- |
| GU1 | **stated:** `shell_composition.js` already splits pure decisions (`topRowHeight`, `companionsFor({combat, available})`) from a measuring host that re-composes only on stable signals (attribute changes with real old/new difference, text size, resize, explicit layout actions, a short start-screen settle) | **ACCOUNT FOR NOW.** This is the seed of the UIE20 spec, not a competitor. The structural round turns `companionsFor`'s hard-coded choices and the top-row rule into spec data per context; the measuring host stays as the "fit" engine. No rewrite of R16c needed |
| GU2 | **stated:** `contentExtent` walks every descendant of a region with `getBoundingClientRect` and `getComputedStyle` on each measure | **ACCOUNT FOR NOW, R16c done check.** Measure time at the 500-row inventory fixture (NX10). If a measure costs more than a frame, measure only the regions whose stable signal changed, or read declared heights from the spec instead (WX3) |
| GU3 | **inferred:** R16b changes frame heights and chrome in `ui_tokens.css` against legacy `#main_content` selectors (NX41) | **ACCOUNT FOR NOW.** Token and control sizing survives a spec move; region-height rules will move into the spec round. Keep R16b's height rules grouped in one block so the structural round can lift them out whole |
| GU4 | **stated:** R16a keeps any stored presentation choice; the keys are browser-local | **ACT NOW (tell Weibao).** If his own browser already stored "classic", shell-default will not show for him. R16's report must say how to switch (Layout menu → presentation) and whether his browser had a stored choice cannot be known from here |
| GU5 | **inferred:** with the shell as default, classic remains selectable. Every future UI change could be asked to work in both | **ACCOUNT FOR NOW, proposal.** Classic is frozen: kept working, regression-checked, no new features. New panels and compositions target the shell and spec only. Reason: halves verification; cost: classic users see no improvements. Needs Weibao's word only if he plays classic |
| GU6 | **inferred:** moving region layout into a spec changes the identity of stored shell layouts (`shellLayoutKey`, version 1 module lists) | **ACCOUNT FOR NOW, structural round.** Map stored shell layouts to the spec, or reset only the shell layout with a visible notice, preserving other preferences (PX5, UR17). Browser-local, not a save change |
| GU7 | **inferred:** "adaptability" also means worlds can bring panels. A world pack loader session exists; the spec's regions and slots are the natural address for world-provided panels and skins (THEMATIC_UI, cheat looks WB5) | **LATER.** Slots addressable by data from a world pack, no code per world. Trigger: the first world pack that ships a panel. Done check: a test pack adds a companion to one slot with zero edits to the layout host |
| GU8 | **stated:** views become projection-driven (UIE17); the registry's `projection` is unmerged (NX27, NX34) | **ACCOUNT FOR NOW.** The structural round uses `read()` injection (existing factory form, NX37) and swaps to registry projections after the engine-lane merge; it does not wait for that merge |

Proposed order for core-ui after R16c: **structural round "spec + Step 0"** (game identical before and
after at the three targets; GU1, GU3, GU6; PV2–PV4, PV8), then context compositions extended through
the spec, then the queue. **Approved 2026-10-16** (Weibao: "Yes: tell core-ui to add the structural spec + Step 0 round after R16c lands, with GU1–GU6 as constraints, and to tell me how to switch if my browser stored classic."); sent to the core-ui session.

## Parallel next parts after R17: more to consider, 2026-10-16

Weibao: "start next part in parallel, /more-to-consider first". Codes PP1–PP8. Read live: the
renumbered queue above, `src/combat_focus.js`, `src/village_workspace.js`, git status, the stopped
core-ui turn.

| Code | Evidence | Disposition |
| --- | --- | --- |
| PP1 | **shown:** core-ui's last turn stopped on "Maximum 5 dev servers per folder reached"; two were this session's R15 servers | **ACT NOW, done:** both stopped. Parallel sessions in one folder share five server slots |
| PP2 | **shown:** R15–R17 are uncommitted in the shared checkout, mixed with other sessions' dirty files; `npm run build` rewrites `dist/bundle.js`, `index.html` and now `build.js`-driven outputs for everyone | **ACT NOW, needs Weibao's yes.** Two UI writers in one checkout would build each other's half-finished edits into their evidence, and race on `dist/`. Committing R15–R17 (own paths only, partial hunks for `index.html`, `build.js`, `package.json`) lets each parallel session run in its **own git worktree** with its own build, servers and evidence |
| PP3 | **stated:** shared hot files: `styles/ui_tokens.css` (every round), `src/layout_spec.js` (composition), `src/proto23_shell.js` (inventory tools, You, popovers), `src/village_workspace.js` (place header, opponent cards), `src/display.js` (inventory, log, stats) | **ACCOUNT FOR NOW.** Pair rounds by disjoint owners. New round CSS goes in its own stylesheet (`styles/<round-area>.css`), not `ui_tokens.css`, so worktree merges stay clean (own-your-node, AR1) |
| PP4 | **stated:** inventory render lives in `display.js` and the shell's inventory tools in `proto23_shell.js`; opponent cards live in `village_workspace.js` and read the native combat DOM through `readNativeCombatFocus` (`src/combat_focus.js:10`) | **R18 (inventory tabs) and R20 (opponent board) can run in parallel:** different panels, different source files. Shared touch points: one stylesheet link each in `index.html`, and R20's count-sized board may change `layout_spec.js` top-row data; R18 does not touch the spec |
| PP5 | **stated:** `src/ui/combat_display.js` imports `main.js` (580-module closure, PV1); opponent cards read native DOM instead of a public projection (NX22, NX42) | **Engine lane, in parallel:** cut the combat display's `main.js` import (structural, AR9) and publish an observer-safe opponent projection through the merged registry. R20 starts on `read()` injection and swaps to the projection when it lands (GU8). Engine works in its worktree; reconciliation at merge |
| PP6 | **inferred:** R19 (rows/detail) depends on R18; R21/R22 (log, Reports) share `display.js` log code with each other; R24/R25 (You) share `proto23_shell.js` with R18's tools | Not in this parallel wave. Next wave pairs R21 (log) with R24 (You) once R18 lands |
| PP7 | **stated:** the R16 visual review is still open; R20 is where the oversized combat cards Weibao flagged get fixed | R20 is the higher-value parallel UI round; R18 is the queue's next round. Both proceed; his R16 feedback becomes tune items (IT2) |
| PP8 | **inferred:** three writers merging back into `codex/gameplay-foundations` | Merge order: engine structural first (smallest UI surface), then R18, then R20; each re-runs check-r13–r17 and `check:arch` on the merged base. Merges and commits stay Weibao's call |

**Proposed wave:** engine-lane (combat import cut + opponent projection, its worktree), core-ui
(R18 inventory tabs, new worktree), new session (R20 opponent board, new worktree). Prerequisite:
PP2 commit.

## Merge wave record, 2026-10-16

Weibao: "Wait until R20 finishes, then merge engine, R18 and R20 in that order with checks after
each." Merged in a temporary worktree from `ea9dbd8d2`, then the branch moved once (guarded):
`5457a1b15` engine combat projection, `599e06e50` R18 inventory tabs, `d10599f54` R20 opponent
board. Only build outputs (`dist`, `index.html`) and `build.js` conflicted; stylesheet links and
build lines were unioned and the bundle rebuilt. After each merge: `check:arch` pass; check-r11
to check-r20 and the engine combat journey pass. Suite: 2,065/0, 2,069/0, then 2,073 pass with one
load-sensitive timing test (`p23-combat-options` R51) that passes 3/3 alone; `check-r11-interactions`
once failed under concurrent load and passed 2/2 alone. Other sessions' uncommitted `main.js`
edits were three-way merged onto the new HEAD without conflict. Not pushed.

## Control box, 1920×1080 target, 8 and hundreds of opponents, 2026-10-17

Weibao: "We can put selectioj menus in one box and then drop down in another one, so we have more
effective space? also instead of 1366 x 768 we can have like 1980 x 1080 right? more to consider?
what if there is 8 enemies? more? hundreds? more to consider?" Codes CB1–CB5 (control box),
VP1–VP4 (viewport), HZ1–HZ8 (crowds). Proposals only. Read live: `src/opponent_board.js`,
R20_REPORT, `src/data/locations.js` enemy counts, UI_RULES UR14/UR25/UR51/UR54, the standing UI
priority in USER_VISION, and the R20 8-opponent screenshot at 1920×1080 21px.

### Control box: selection controls in one box, the choices open elsewhere

| Code | Consideration | Proposed default, dial and reason | Done check |
| --- | --- | --- | --- |
| CB1 | **stated:** at 1366×768 21px Inventory spends about three rows on controls (category select, Name, Reverse, search, R18 tabs); Reports spends two (Filters, Follow, Latest, Stop combat log, Clear) | One **control box** per panel: a single row that shows the current view as text ("All · Name ↑ · 21/21"). Activating it opens the choices (category, sort, direction, search, toggles) in a drop-down surface. Frees one to two rows per panel at 21px | Slack map (WX13): rows of content gained per panel at 1366 21px and 1920 21px |
| CB2 | **stated:** UR21/UR51 make direct access the default and require an accepted tradeoff for an extra click; categories are switched often | The box keeps the one or two most-used choices inline (Inventory: category tabs or their icon form, O3), and moves rare ones (sort direction, hide toggles, Clear, Follow) behind the box. Dial per panel by measured frequency. Recorded tradeoff: rare controls cost one extra click | Click count per routine journey (UR57) before/after |
| CB3 | Where the drop-down opens. "Drop down in another one" can mean an anchored popover or a panel-sized drawer in a different region | Default: a popover anchored to the box, over the panel's own list, never over the log (UR11) or a pending target (UR52); Esc closes and returns focus (UR53). Dial: at 1920 with room, the choices open in the panel's companion slot from the layout spec (UIE20) and stay open while you use them | Focus, Esc, outside-click and tick checks (CTL1 primitive) |
| CB4 | Hidden state risk: once filters live behind a box, a forgotten filter can make items "vanish" (CTL19, CTL23) | The box always states every non-default choice in its label and shows a clear ×. A filtered-empty list says what hides the rows | Fixture: filter on, rows hidden; the label names the filter |
| CB5 | **stated:** some control states live in the save (`are_finished_quests_hidden`, `skill_category_order`, `game_options`, CTL4); others are browser-local panel settings | The box changes presentation only; each control keeps its current storage owner. No save change | Export/import of a save is byte-identical before/after using the box |

One shared component (CTL1 cross-cutting) for Inventory, Reports, Skills, Quests and Crafting;
Inventory and Reports first, since they carry the most control rows.

### Viewport: design for 1920×1080

| Code | Evidence | Disposition |
| --- | --- | --- |
| VP1 | **stated:** the standing UI priority (USER_VISION 2026-10-13) and UI_RULES UR14/UR25 measure discoverability and the scroll budget at 1366×768; every round also checks 1920×1080 21px | **Needs Weibao's word to change.** Proposal: 1920×1080 becomes the primary design target (his screen, by inference from the question); 1366×768 stays a floor check that must not break (no page scroll, routine actions visible). 14px and 21px text both checked at each |
| VP2 | **shown:** the R20 8-opponent screenshot at 1920×1080 21px. The shell is the 1366 composition stretched: the actions region below "Go back to Village" is mostly empty, Reports is empty below its header, and the opponent board uses half its height | At 1920 the composition should spend the extra width and height on companions (WX7): item detail beside Inventory, known routes or current work under actions, the opponent detail beside the board. Per-context column shares from the layout spec (WX12), not a stretched 1366 grid |
| VP3 | **inferred:** 1920×1080 at 125% or 150% OS scaling reports about 1536×864 or 1280×720 CSS pixels; a "1920" screen can behave like 1366 | Checks keep a scaled case (1536×864) so a scaled 1920 screen is not left behind |
| VP4 | **inferred:** larger targets invite larger default text; Weibao called the shell "big for no reason" at 21px | Default text stays at its current setting; 1920 space goes to more useful panels, not bigger type |

### Crowds: 8 opponents, and hundreds

| Code | Evidence | Disposition |
| --- | --- | --- |
| HZ1 | **stated:** R20 already covers 8: two-column grid from 5, repeated names grouped ("Starving wolf rat · 8"), one cell per opponent with letter, health and cycle, at most 8 visible rows then the rows scroll; facts once for the inspected opponent (R20_REPORT). The 1920 screenshot shows 8 in two compact rows | Nothing new needed for 8. Tune: at 1920 the grid can go to four columns before grouping (VP2) |
| HZ2 | **stated:** native fights are small and sequential: `enemy_group_size` tops out at `[6,8]`; `enemy_count` 50 or 100 is the zone total fought group by group ("15/15 groups left") | "Hundreds" exists today only **over time**, as waves. The encounter caption and a trip tally (B11) are the right home for that, not the board |
| HZ3 | **inferred:** worlds Weibao wants (sieges, sect wars, armies, swarms) could put dozens to hundreds on the field at once | Default representation by scale: 1–8 individuals (R20); 9–40 grouped individuals (name once, cells per opponent, scrolling); 40+ **units**: one row per group with count alive/total, a health spread (min–max or a small histogram), and the front rank or targeted few as individuals. Individuals stay reachable on demand (UR56: summaries keep a route to detail) |
| HZ4 | **inferred:** the native engine runs an attack loop per defender (`native_encounter.loops`); a parallel session already works on combat timers ("deadlines, not 60 callbacks") | Hundreds on the field is an **engine** question first: per-opponent loops, projection cost per tick and save size. A unit model (one loop per group with a count and pooled health, promoted to individuals when targeted) is the likely engine shape; the UI follows the projection. Reopen trigger: the first world that needs it |
| HZ5 | **inferred:** each projection rebuild and each DOM row costs per tick | For 40+: virtualized rows (only visible ones in the DOM), projection diffed by group, render through the existing batching (UIE3). Done check: tick render time at a 200-opponent synthetic fixture stays within a frame |
| HZ6 | **inferred:** hundreds of hits per second would flood Reports | Log collapses by group and outcome ("Rats ×37 hit you for 4–6") per UX18/R21, with per-hit detail on demand; milestone lines (a group broken, a leader down) stay distinct |
| HZ7 | **stated:** knowledge is per opponent today (NX22); learning one rat should inform the rest of its kind | Knowledge attaches to the kind, with per-individual exceptions (variants, leaders). A unit row shows known facts once per kind |
| HZ8 | **inferred:** targeting and selection | Default: the game targets as now; the player can focus a group or an individual. Inspection never changes the target (UR35); selection survives the group shrinking (UX14) |

### LATER / DELEGATE

| Candidate | Level / effort | Trigger and done check |
| --- | --- | --- |
| Control box component, Inventory + Reports first | Strong, medium (shared component) | After Weibao's yes on CB2's tradeoff. Rows gained at 1366/1920 21px, click counts, focus/Esc/tick checks |
| 1920 compositions | Strong, medium | After VP1 is decided. Companions fill the 1920 empty regions; slack map shows the gain; 1366 floor unchanged |
| Crowd units (HZ3–HZ5) | Strong, high (engine + UI) | First world with 40+ simultaneous opponents. Engine unit model first, then the unit row, virtualized list and grouped log |

## Screen real estate and moving menu boxes, 2026-10-17

Weibao: "yes, check my screen realestate and what is most common? More to consider? moving other
menu boxes around? More to consider?" VP1 is **decided**: 1920×1080 primary, 1366×768 floor (rule
owners updated: UI_RULES UR14/UR25 and viewport note, AGENTS.md, RULES_INDEX, PROJECT.md,
USER_VISION). Codes MB1–MB9.

### Evidence

- **His screen (shown, `system_profiler`, Finder desktop bounds):** 14-inch MacBook Pro, 3024×1964
  Retina, scaled to 1800×1169 points. A full-screen browser leaves about 1800×1040 CSS pixels at
  device pixel ratio 2 (inferred: menu bar and browser chrome subtracted).
- **Most common (stated, secondary sources):** Steam survey mid-2026 puts 1920×1080 at about 51% of
  players and 2560×1440 at about 22–29%; StatCounter desktop puts 1920×1080 at about 20–22%,
  1536×864 at about 7% and 1366×768 at about 5–6%.
- **Target set now:** 1920×1080 primary; about 1800×1040 at DPR 2 (his screen) every round; floors
  1536×864 and 1366×768; text 14px and 21px at each.

### Moving menu boxes

| Code | Evidence | Disposition |
| --- | --- | --- |
| MB1 | **stated:** `Edit layout` first switches the shell off (`workspace_layout.js:121`, `if(owner.shell)selectShell(false)`), so in the default screen the player cannot move boxes at all | **ACCOUNT FOR NOW, high value.** Shell-aware layout editing over spec slots: drag or "Move to…" a panel between named slots, swap companions, reset per context. Stored browser-local with the spec version (GU6, WX11). Manual placement beats automatic composition |
| MB2 | **shown (R20 1920 screenshots):** two full-width bars, a top navigation row and a bottom bar (Save, Export, Import, settings, version, help, Authoring, Layout, Comfortable, a hit counter, links) | One bar at the primary target: navigation left, save state and Save/Export/Import right, rarely used items (Authoring, version, links) in a menu. Frees one row on every screen. UR50 already says the hit counter does not earn play-bar space; UR55 keeps save state visible |
| MB3 | **shown:** the place panel shows "Go back to [Village] [15m]" and a separate "← Village" button | **Inferred** duplicate route; trace both before changing. If they are the same action, keep the one that shows travel time |
| MB4 | **shown:** the place panel carries two tab systems (Actions/Options at the top, Here/Crafting/Mixing/? at the bottom) plus "Open local controls" | One strip per panel (UX24, CB1); "Options" and local controls behind the control box |
| MB5 | **shown:** Reports keeps two control rows at the bottom (Filters, Follow, Latest, Stop combat log, Clear) | Control box in the Reports header (CB1–CB4); the log keeps its full column (UR11) |
| MB6 | **shown:** at 1920×1080 21px with 8 opponents, the actions region is mostly empty and the opponent detail sits under the board | 1920 compositions (VP2, WX7): opponent detail beside the board, item detail beside Inventory, current work or known routes under actions. Fills measured slack, not by enlarging type (VP4) |
| MB7 | **inferred:** his screen is Retina (DPR 2); checks run at DPR 1 | Add a DPR 2 case at about 1800×1040 (`r11-lib.cjs` already takes `dpr`). Hairline borders and focus rings checked there |
| MB8 | **inferred:** a browser beside another window on his screen is about 900px wide, under the 1000px switch that changes the whole layout (`workspace_layout.js` `max-width: 1000px`), whose mobile work is deferred | Ask only if he plays side by side. Otherwise record: half-screen play falls into the narrow layout until mobile work is scheduled |
| MB9 | **inferred:** moving boxes changes where keyboard focus goes and what Tab order means (PX10) | Moved panels keep reading order by slot (top to bottom, left to right). Check: Tab order follows the visible order after a move |

### LATER / DELEGATE

| Candidate | Level / effort | Trigger and done check |
| --- | --- | --- |
| Shell layout editing (MB1) | Strong, medium to high | Next structural UI round. Move a panel between slots, reload, reset; spec version stored; focus order follows (MB9) |
| One bar (MB2) + control box (CB1–CB5) | Strong, medium | With the 1920 compositions round. Rows gained per region at the target set; save state never hidden |
| Target-set check helper (MB7) | Balanced, small | Before the next UI round: one helper runs a check at 1920×1080, 1800×1040 DPR 2, 1536×864 and 1366×768 at 14/21px |

## Screen use at 1920 (Weibao's R22 check), 2026-10-17

Weibao, on the R22 8-opponent fight at his MacBook size: "there is so much space with the center
middle panel, why not split it? also when fighting multiple enemies, why not stack them more
vertically? make their names and colors more distinct? Also the Character panel doesnt need to be
so wide, we should make more use of the screen realestate". **Direction** for the four asks; the
defaults below are proposals. Codes SU1–SU12. Third time the 1920 slack came up (VP2, BX9), so it
gets its own round, R22b, before R23.

Measured on the rebuilt branch tip (`3d43257ba`, 14px, fixtures r21c `awakened` and r20
`opponents-8-mixed`), shown in the R22 visual-check screenshots:

| Region (fight, 8 opponents) | 1920×1080 | 1800×1040 DPR 2 | 1366×768 |
| --- | --- | --- | --- |
| You (player) | 629 × 287 | 589 × 287 | 467 × 307 |
| Opponent board in Around you | 716 × 147, 3 columns | 668 × 147, 3 columns | 435 × 147, 3 columns |
| Place region (center bottom) | 873 × 730, one action row and a back button; about 480px empty (shown) | 817 × 690, same | 581 × 400 |
| Inventory | 501 wide | 468 wide | 349 wide |

The board is squeezed into the short top row while the tall region under it is empty. You is
wider than Inventory beneath it for four stat column pairs.

### ACT NOW (this round)

| Code | Consideration | Proposed default, dial and reason | Done check |
| --- | --- | --- | --- |
| SU1 | **Split the center** | The place region becomes two columns when it is at least about 2 × 28em wide: left keeps the place header, actions and options; right is a **second slot** whose content follows the context. Fight: the opponent list (SU2). Idle: the existing Journal companion (BX2, BX14 later fills it), no new panel. Dial: narrower than 56em (1366 at 21px) the slot stacks under the actions or becomes a tab, as companions already yield (WX5) | 1920 and MacBook, fight and idle: right column filled; actions unchanged in place; 1366 floor no page scroll |
| SU2 | **Stack opponents vertically** | In the fight slot the board is one column, one row per opponent: letter, name, health bar, cycle bar; kind groups keep their header ("Wolf rat · 3"). `boardLayout` already picks columns from width; it also takes the slot's height, so a tall narrow slot gives one column up to 8 rows before going to two. Defeated stay in place (R20, UR52) | 8-mixed at 1920: 8 rows visible without scrolling, one column; 1 and 3 opponents unchanged in content |
| SU3 | **Target detail moves up** | With the board out of the top row, the inspected opponent's facts (Atk, Spd, Hit you, Evade) sit in the top row beside You, so your bars and the target's are level (BX6 first slice) | Fight: your HP and the target's HP both visible in the top row at every target |
| SU4 | **Distinct names and colors** | One hue per opponent **kind** (Starving wolf rat, Wolf rat, Elite wolf rat), from a fixed categorical set of about six hues with contrast ≥4.5:1 on the board and log fills; letters keep telling individuals apart. The same hue marks the name on the board and in Reports, plus a small letter chip there, so "Wolf rat B" in the log matches its row. Variant words stay text ("Starving", "Elite"), so color never carries meaning alone (UR37). More kinds than hues: hues repeat and the letter carries it. Your side keeps cyan | Grayscale screenshot still tells kinds apart by name; contrast check passes on board and log fills, default and a light custom palette |
| SU5 | R22 log sides | R22 colors every opponent lilac. SU4 replaces that with the kind hue; dealt/taken stay on the values and left rules, so direction still reads | check-r22 C1–C5 still pass with the new hues |
| SU6 | **Narrow You** (BX4) | You takes its content width: two stat column pairs instead of four, short labels with full names on hover (CTL7), matching Inventory's column below it. The freed width goes to Around you and the top-row target detail. Dial: at 1366 21px the current width stays | No stat label or value wraps at the target set; Around you or the target detail gains the measured width |
| SU7 | **Palette finding (R22 visual check)** | Under a light custom palette on Reports, combat lines read well, but native message colors (the yellow system line, the lilac title line, the faint "level" in the Evasion line) nearly vanish. Map those native message kinds onto the palette's recovered tokens, as R22 did for combat | Light palette fixture: every visible log line ≥4.5:1 on its fill |

### ACCOUNT FOR NOW

| Code | Consideration | Default and reason |
| --- | --- | --- |
| SU8 | Saved browser layouts (R21 Move to) | Layout spec 3 adds the second slot. A spec-2 layout migrates once: boxes keep their slots, the board's home moves to the fight slot unless the player moved it. Game save untouched (UR17) |
| SU9 | One authority | The second slot is spec data per context (UIE20), not a new layout host; Move to lists it like any slot. Kind hues come from one table keyed by kind id, read by board and log |
| SU10 | Crowds | Past 8 opponents the list scrolls inside its slot, then groups per HZ3; the slot's height sets the visible rows, so a fight never pushes the actions off screen |
| SU11 | Status window density | The R21c window cuts off at Magic at 1920 in comfortable spacing and shows Magic plus Earned titles in compact (shown). **Decided (Weibao, 2026-10-17):** compact by default; Comfortable stays in Appearance |

### LATER / DELEGATE

| Candidate | Level / effort | Trigger and done check |
| --- | --- | --- |
| SU12 Idle second slot content (BX14 quest step, BX9 item detail, R28 routes) | Strong, medium | After R22b lands the slot. Idle at 1920: next quest step visible without opening Journal |
| Per-world kind palettes | Balanced, small | When a second world has opponents. Hues come from world data; same contrast check |

### Readjusted order (proposal)

1. **R22b** screen use at 1920 (SU1–SU11), presentation only, own worktree.
2. **R23** Reports tabs and place inspection, unchanged.
3. **R22a** companions (BX13 shared choices, BX14 quest companion, BX5 split Around you) now
   fill R22b's second slot instead of competing for the top row.
4. R24 polish and the rest of the queue as listed.

## Fill the center and color the inventory, 2026-10-18

Weibao, on the R22b screenshots: "I feel like sectioning by letters might detract from them too
much? how can we make more use of the panels in the center? Split and then add more panels? Improve
the inventory? ... I feel like we need more color work since the color of the inventory feels bland
compared to everything else? look at how proto23 works". **Direction:** names over letters, more
use of the center, a more colorful inventory, Proto23 as the reference. The defaults below are
proposals. Codes FC1–FC10.

Proto23 reference (shown, `docs/research/panel-design-2026-10-15/private/proto23-lab/` and the
1920 opening screenshot in `docs/reviews/ui-density-2026-10-13/screenshots/`):

- Its center splits by task: crafting is a list on the left and a detail on the right, each with its
  own tint (navy list, purple detail).
- Category tabs carry their own fill colors (MED, FOD, WEP, EQP, MAT), not one underline style.
- Inventory names are colored by item type (weapon orange, material green, plain white), with a
  yellow "new" marker and the quantity right-aligned.
- The opponent is a card that mirrors the player card (name, level, HP bar, stats), so both sides read
  the same way.
- Each region has its own gradient tint: player teal, inventory navy to teal, log purple.

Live (shown, R22b build): the shell already has item kind tokens (`--p23-item-equipment` gold,
`usable` green, `component` blue, `book` violet) on names, but the tabs, rows and region fill are one
teal; the fight's left column holds one action and a back button.

| Code | Consideration | Proposed default, dial and reason | Done check |
| --- | --- | --- | --- |
| FC1 | **Names over letters** | Each opponent row shows its full name in its kind hue, with the letter as a small muted tag after it ("Wolf rat ·B"); no group headings while one column fits. Groups return only when rows must share columns (9+, HZ3). Reports keep the letter chip so lines still match rows | 8-mixed at 1920: every row readable as a name alone; letter still present on row and log line |
| FC2 | **Mirror card for the target** | Inspecting shows the target like Proto23's enemy card: name, HP bar, cycle bar and stats in the same rows and widths as You's bars, so the two read side by side | Your HP and the target's HP align horizontally at 1920 and MacBook |
| FC3 | **Fight left column** | Under the place actions: Stances (Skills companion moves here in a fight) and your attack cycle, so the left half shows your side and the right half theirs | 1920 fight: left column has no empty block taller than ~6 lines |
| FC4 | **Idle detail slot** (SU12) | Idle center splits: actions left, a detail slot right that shows what you last selected: an item (Inventory click), the active quest step (Journal), or a recipe (Crafting), Proto23's list + detail. Empty state names how to fill it. One slot, not a panel per kind (BX13) | Idle 1920: selecting an item shows its detail in the slot without hiding actions; Esc clears |
| FC5 | **Category tab colors** (BX8) | Inventory tabs take their category's kind color as a tinted fill when active and a colored top rule when not; counts in the same hue. Same hues as the item names, one token set | Each tab's hue equals its items' name hue; contrast ≥4.5:1 on fills |
| FC6 | **Row anatomy** | Name in kind color, a "new" marker (yellow, word not only color) for items gained since last viewed, quantity and value right-aligned in fixed columns, equipped slot as a dim tag | New item shows "new" until the row is seen; columns align across rows |
| FC7 | **Region tints** | Inventory region gets its own navy-to-teal gradient (Proto23), distinct from You's teal; the detail slot a purple tint like Proto23's crafting detail. Tokens only | Screenshot shows four distinct region fills; text contrast unchanged |
| FC8 | Truth and knowledge | "New" is presentation state (browser-local seen set), not a save field; kind colors read existing item kinds only | Export before and after viewing is byte-identical |
| FC9 | Custom palettes | Tab and name hues map to the palette's own tokens as R22 did for the log | Light palette fixture: inventory text ≥4.5:1 |
| FC10 | Floors | At 1366 the idle detail slot becomes a tab beside Actions (WX5); the fight split keeps R22b's behavior | 1366 14/21px: actions visible, no page scroll |

### LATER / DELEGATE

| Candidate | Level / effort | Trigger and done check |
| --- | --- | --- |
| Crafting as list + detail in the center (BX10 template) | Strong, medium | After FC4's slot exists; a second making system opens in the same slot |
| Rarity scale separate from kind colors (P23-5) | Balanced, small | When items carry a rarity field; rarity as border or tag, kind stays the name color |
