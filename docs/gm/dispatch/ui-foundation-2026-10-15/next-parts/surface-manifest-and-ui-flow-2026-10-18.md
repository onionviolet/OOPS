# Surface manifest, UI flow and feature representations, 2026-10-18

Proposal only. Nothing here is built or accepted. Weibao asked "How to design better ui that can
incorporate all the scopes and more that we want in the future?", then "How will the plan
interplay into existing R21 and R22 stuff and mroe?", then ran `/more-to-consider`: "what else
should be shown more often? what changes when others change? what should change because of
things? mroe to consider? Ui flow and more? representations of other features?"

Owners this extends, not replaces: [UI_RULES](../../../../UI_RULES.md) (UR1–UR58),
[surface types](../../../../UI_SURFACE_TYPES_AND_DRAWING_BOARD_2026-10-15.md) (ST1–ST9),
[UI at scale](../../../../UI_AT_SCALE_CONSIDERATIONS_2026-10-14.md) (SC, NV, IN, PL, ZN, TP, FR),
[R21 feedback](r21-feedback-2026-10-17.md) (BX1–BX15), the
[R22 report](../R22_REPORT.md) and [`src/layout_spec.js`](../../../../../src/layout_spec.js).
Codes UIM, UIW, UIX, UIY, UIZ are new and unused elsewhere (checked 2026-10-18).

## Diagnosis (read live 2026-10-18)

- **shown:** the rules already cover what a surface should be (UR1–UR58, ST1–ST9). The runtime
  does not enforce them: 38 files under `src/` still reference `location_actions_div`, and 15
  use `definePanel`.
- **shown:** R21 made layout data (`LAYOUT_SPEC` v2: regions, boxes, slots, per-context homes,
  `fit`). Contexts are only `idle` and `combat`.
- **shown:** navigation routes are a hand-written array of 18 entries with special-case branches
  in `src/workspace_navigation.js`.
- **shown:** there is no shared change signal. Four `CustomEvent` names exist in `src/`; about 25
  modules run their own refresh and about 20 run their own interval or animation loop.
- **stated in UI at scale:** the attention queue (SC5), away digest (IN3), glance view (PC1) and
  top strip (ZN) are proposals; none is built.

## The plan: UIM1–UIM5

Was A1–A5 in chat; renamed because A5 already means ×N in NEXT_PARTS Part 2.

| Code | Proposal | Default, dial and reason |
| --- | --- | --- |
| UIM1 | **Surface fields on each panel** | Each panel declares surface type (ST1–ST9), home place and keeper, use frequency, status (proposal or accepted), discovery gate, the topics it reads (UIX2), its contexts (UIX6) and its representations (UIZ1). Lives in `LAYOUT_SPEC` v3, not a second registry (one authority per fact). Spec owns *where*; the new fields say *what kind*. Player placement still wins (MB1) |
| UIM2 | **One route table** | Every surface has a route ID. Nav bar, hotkeys, More N groups (BX11), quick jump (UR28), log links (UR29), Back history (UR22) and Move to all read it. Replaces the hand-written route array |
| UIM3 | **Places are the scaling unit** | New systems attach to a place and keeper (UR4, ST2). Local actions lists people and services at the place. A world adds places, not columns |
| UIM4 | **One template per surface type** | Crafting (BX10), threshold screen, reference tab, ledger rows. A new making system fills the crafting template; mastery changes density, not layout (UIX12) |
| UIM5 | **Enforcement and migration** | A contract test blocks new direct mounts and counts routine entries per place (UR3). The 38 mounts migrate in batches, each logging where a feature moved (UR13) |

### Interplay with R21 and R22

| Existing piece | With UIM |
| --- | --- |
| R21 Move to and slots (MB1) | Surface type sets the default home and allowed slots. Stored placements keep their keys and get a v2→v3 migration (GU6, UR17, UR58) |
| R21 Options tab holding group drop-downs (BX3) | Hand sorting by surface type; UIM1 makes it automatic: ST1 to Actions, groups to Options, ST8 to Projects. "(4 ready)" becomes the general ready/blocked/locked summary (UR26, BX12) |
| R21 one bar, More N, nav groups (MB2, BX11) | Generated from UIM2, grouped by category. Hotkeys keep stable IDs |
| R21 shared choices slot and diary companion (BX13, BX14) | Register as companions through existing `fit` fields |
| R21 contextual homes (item detail in fight vs idle) | Generalize to UR41 navigation scope per context (UIX6) |
| R22 log column | ST9, fixed column, never a slot (UR11). UIM never moves it |
| R22 event snapshot per combat line | Pattern for UR29/UR48: a line carries a subject that resolves through UIM2, keeping "then" separate from "now" |
| R22 report kinds (BX7) | Today a hand list in `styles/combat_log.css`. Under UIM1 each system declares its log kind and token |
| Classic layout (GU5, frozen) | UIM drives the parity shell only; classic keeps its mounts until a separate decision |

**Practical risk:** R22 is unmerged on `claude/ui-r22-combat-log` with acceptance open (UR16). Log
links wait for that merge.

## Round 1: more to consider, 2026-10-18

### ACT NOW (done in this save)

- Renamed the plan's codes to UIM1–UIM5 to avoid the A5 collision.
- Saved the plan, interplay and this round here; recorded the request in USER_VISION.

### UIW. What should be shown more often

Default test: a fact earns persistent space when it changes a decision in the next few minutes of
play, ranked by how often it changes and how costly missing it is. Dial per world and per player
pin. Everything else stays one click away (UR21). Prose, stable stats and settings show *less*.

| Code | Fact | Why it earns space | Existing owner |
| --- | --- | --- | --- |
| UIW1 | Current work, its time left and what ends it, visible in the bar when its panel is out of view | Idle play is mostly "is my thing still running" | Current-work panel, ZN top strip |
| UIW2 | Attention count with the top item named | One place for "needs you" instead of ten blinking panels | SC5 |
| UIW3 | Ready counts: things makeable now, options ready, obligations ready to hand in | Turns browsing into a glance | BX12 |
| UIW4 | Which clock is running and the time of day where it gates services | Shops, duties and effects depend on it | TP, subtle gaps G11–G17 |
| UIW5 | Body facts that change choices (hunger, fatigue, injury) as labelled chips | They silently block actions otherwise | Vitals, PL chip form |
| UIW6 | Obligations due soon with a countdown | Missing one has a cost | ST5, ledger |
| UIW7 | Active effects with time left | Ending effects change fights | UR47 |
| UIW8 | Near-complete discoveries ("one clue left"), observer-safe | Draws the player to finish a thread | Journal, SR discovery |
| UIW9 | Carrying limit and spoilage when close | Prevents lost loot | Inventory |

### UIX. What changes when others change, and what should change because of things

| Code | Consideration | Default, dial and reason |
| --- | --- | --- |
| UIX1 | **No shared change signal today** (diagnosis) | Each panel recomputes on its own, so counts like "(4 ready)" can drift from inventory or time. The more surfaces show the same fact (UIW), the worse this gets |
| UIX2 | **Topic-based change signal** | State owners publish a change on a small set of topics (inventory, place, time, body, knowledge, combat, world, work). Panels declare which topics they read (UIM1). The shell refreshes readers once per batch. Dial: legacy panels keep polling until migrated. Reason: nav counts, Options ready, the attention queue and quick jump all need it, so the seam has demonstrated consumers |
| UIX3 | **Dependency examples to test against** | Item gained → inventory row, recipe readiness, quest step, attention item, log line. Place change → Around you, Local actions, services open, tokens on a world change. Time → service hours, obligations, effects. Knowledge → names resolve, quick-jump entries, bestiary. Combat start → context switch |
| UIX4 | **Stability during change** | Batch updates and defer reordering while the pointer or focus is on a target (UR52). A count may change; a button may not move under the cursor |
| UIX5 | **Legible dependencies** | A dev inspector lists, per panel, the topics it reads and the last change that refreshed it. Inspection only, no state change |
| UIX6 | **More contexts** | Beyond idle and combat: travel, at a service, threshold, talking to someone, resting, returning from away, defeated. Each picks companions and focus through the existing `contexts` mechanism. Leaving restores the prior layout and place (UR23) |
| UIX7 | **Unavailable things say why and what would work** | "Opens at 7", "needs two free hands", not hidden. Distinguish unknown, blocked and locked (UR52, BX12). Follows AD38: show the mechanism, not a permission |
| UIX8 | **World changes reskin, not relayout** | Tokens, vocabulary, currency and time units per world (UR12), labelled with canon status where relevant |
| UIX9 | **Knowledge changes how a thing is shown** | Unknown, assessed, known (UR36). Old log lines keep what was known then (UR48) |
| UIX10 | **Self changes** | Another body, shared minds or multiple bodies (AD10, MW) change the You box per self, not a new layout |
| UIX11 | **Faculties add surfaces quietly** | An awakened cheat adds its surface with one log line (AD29, UR13), as the status window already does |
| UIX12 | **Mastery changes density** | A novice sees guidance, previews and one-at-a-time controls; a master sees compact rows and batch controls. Dial per activity (MR: mastery improves control) |

### UIY. UI flows

Default: every flow ends by naming where you go next and returns you to the context you left.
These become the standing journey set for UR57 checks at 1920×1080 and 1366×768.

| Code | Flow | Steps and end state |
| --- | --- | --- |
| UIY1 | Return after absence | Away digest (IN3) → attention queue → resume current work. Not built |
| UIY2 | Arrive at a place | Place header, who is here, what is open, what is new since your last visit |
| UIY3 | Start and stop work | One route; stopping says what you got and what stopped it |
| UIY4 | Encounter | Warning → combat context → result summary → back to the prior context and layout |
| UIY5 | Make something | Free preview (UR35, MR4) → commit → outcome line linking to the result |
| UIY6 | Threshold | World entry, rebirth or start as a full screen (ST3) with a clear "Not now" |
| UIY7 | Defeat and recovery | What was lost, where you are, the way forward (FR) |
| UIY8 | Discovery | Notice → link → reference entry, observer-safe |

### UIZ. Representations of other features

| Code | Consideration | Default, dial and reason |
| --- | --- | --- |
| UIZ1 | **A representation set per feature** | Home view (required), summary row (UR26), chip (PL), log kind and token (BX7), hover card (UR47), route and quick-jump entry (UIM2), attention item type (SC5), in-world anchor (UIM3). Each beyond the home view is opt-in when it changes a decision |
| UIZ2 | **One projection feeds every representation** | The feature's observer-safe projection drives its chip, row, card and view, so a chip never disagrees with the full view |
| UIZ3 | **Reverse links from data** | An item shows "used in 3 known recipes"; a person shows what they teach and sell; a place lists its services. Generated from the owners, never hand-written |
| UIZ4 | **Proposals stay in Projects** | An ST8 feature's representations stay suppressed elsewhere until Weibao promotes it; promotion flips one field (UR2) |
| UIZ5 | **Representation budget** | The top strip and chip row have fixed room; chips rank by the attention budget, the rest fold into a count |
| UIZ6 | **World-styled representations** | A ledger can read as a scroll in one world and a terminal in another; the mechanism and route stay the same |

### LATER / DELEGATE

| Code | Step | Level and effort | Done check |
| --- | --- | --- | --- |
| UIL1 | `LAYOUT_SPEC` v3 surface fields plus UIM2 route table, no visual change | Strong coder, medium-high | Nav and hotkeys read the table; contract test passes; rebuilt screenshots at 1920 and 1366 match before |
| UIL2 | UIX2 change signal pilot with three readers (nav counts, Options ready, current work in the bar) | Strong coder, medium | A reproduced stale count fixed with a regression; no extra refreshes per tick |
| UIL3 | Attention queue and away digest first slice (SC5, IN3, UIY1) | Strong coder, high | Return after a timed skip shows a ranked digest that links to sources |
| UIL4 | Travel and at-a-service contexts (UIX6) | Medium coder, medium | Layout switches and restores on entry and exit at both targets |
| UIL5 | UIY journey set as a reusable browser script for UR57 | Medium coder, medium | Script runs all eight flows on a populated save and records click cost |
| UIL6 | Migrate the 38 Local actions mounts in batches (UIM5) | Medium coder, batches of five to eight | Each batch logs moves; contract test count falls to zero |

UIL1 implemented 2026-10-18, uncommitted, visual acceptance open: [UIL1 report](UIL1_REPORT.md).

UIL2 implemented 2026-10-18, uncommitted, visual acceptance open: [UIL2 report](UIL2_REPORT.md).

UIL4 implemented 2026-10-18, uncommitted, visual acceptance open: [UIL4 report](UIL4_REPORT.md).

## Suggested order (proposal)

1. UIL1, since everything else reads the surface fields and route table.
2. UIL2, since UIW summaries are only trustworthy with a shared change signal.
3. UIL6 batches alongside UIL4.
4. UIL3 and UIL5 once routes and contexts exist; R22 log links once it merges.

## Round 2: adjustable panels, stat sheet and splits, 2026-10-18

Weibao, with a 1920×1080 screenshot of the parity shell at the Village mixing counter: "Any way to
make each panel individually adjustable? also Cold shoudnt be a stat? HP%/s? Some of those can be
hidden away into the larger stats, Inventory currently too wide right? We should incorporate new
panels/split existing ones into distinct panels accoridnlgyt?" Proposal only.

Read from the screenshot (shown): columns are about 623 px (You and Inventory), 738 px (centre)
and 495 px (Reports). Inventory names end near 160 px while values sit at the right edge, yet
equipment rows still wrap their slot ("[torso]") onto a second line. The centre repeats "Village
mixing counter" twice, and the Journal companion shows one row in about 250 px. Read from code
(shown): R21 lets a box move between slots (Move to); nothing resizes a column or row today.
`cold_tolerance` is a real native modifier (`src/display.js`: added to the cold threshold
comparison), listed in the always-visible secondary grid (`src/proto23_shell.js` `secondaryOrder`).

| Code | Consideration | Default, dial and reason |
| --- | --- | --- |
| UIP1 | **Adjustable panels** | Drag gutters between columns and between the top and bottom rows, plus per-box collapse and expand (UR24, UR30). Sizes are stored in the same per-context placement as Move to (R21 MB1, UR58), with a Reset. Minimum sizes come from content at the current text size, never smaller text (UR46). Gutters are keyboard-operable (UR53). The log column can be resized but not hidden or squeezed below its minimum (UR11) |
| UIP2 | **Stat sheet tiers** | Always visible: vitals and the core attributes. Secondary rows show only when they differ from the neutral value or an effect changes them (HP/s at 0, HP %/s at 0 and ×1.000 multipliers hide). Everything stays in Attributes › with its modifiers. Dial: the player can pin any row back. Reason: a fact earns permanent space when it changes a decision (UIW) |
| UIP3 | **Cold tolerance belongs with the weather** | It is a real modifier, so it stays in Attributes ›, but its everyday home is the place header's temperature: "14.7 °C · comfortable" with tolerance in the hover card, and a warning chip when cold starts to bite (UIW5). Same for future heat, altitude or mana-density tolerances per world |
| UIP4 | **Inventory width** | At 1920 the list wastes about half its row. Default: the inventory column follows content (BX4, WX12), slot labels sit on the same line as the name when they fit, and freed width goes to the centre. Dial: UIP1 lets the player widen it again |
| UIP5 | **Split into distinct surfaces** | Each split is its own registered surface with a route, so Move to, resize and contexts work on it (UIM1): You → You (vitals, core) and Condition (effects, body, temperature, rates); Inventory → list and Item detail (VP2, BX9); Around you → people and services, and place prose (BX5). Equipment stays a tab or disclosure of You |
| UIP6 | **Empty space rules** | A companion with one row shrinks to content and yields its height (UR32 empty states); a service view does not repeat its own title. Applies to the Journal companion and the mixing counter in this screenshot |

LATER / DELEGATE: **UIL7** adjustable gutters plus per-context sizes (UIP1); **UIL8** stat tiers,
Condition split and cold in the place header (UIP2, UIP3, UIP5 first slice); **UIL9** inventory
content width, one-line slots, item detail split and empty-space fixes (UIP4–UIP6). Strong coder,
medium each. Done check: rebuilt browser at 1920×1080 and 1366×768, 14 px and 21 px, before and
after screenshots, stored placements and sizes survive save, reload and import. They touch the
layout owners UIL4 just changed and the shell file, so they start after UIL2 and UIL4 are
committed, and UIL7 runs before UIL9.

After UIL2, UIL4 and UIL7–UIL9 land, run the [post-build UI audit prompt](POST_BUILD_UI_AUDIT_PROMPT.md). It starts the repeatable `docs/audits/UI_CORE_AUDIT.md`: how to show more information and look better.
