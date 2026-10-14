# U3 laptop wireframes, 2026-10-14

## CHECKPOINT

Complete: four requested scenarios, including each of CS2 Spread/Shelf/Merged, at both sizes (12 ASCII views). All geometry and sample content are **INFERRED proposals**, not rendered measurements or new mechanics. Engine evidence and compatibility live in [ENGINE_FIT](ENGINE_FIT.md); no browser/build run. Mobile deferred. Source-read ownership is limited to the three U3 documents.

## W0. Shared pixel budget

ASCII is schematic, not to scale. The numeric budgets govern. Both viewports mean CSS pixels at normal text size, not physical display resolution. Keep 16 px body text, about 24 px text line height, and at least 28 px routine action rows. Longer labels wrap; do not shrink the font to meet the budget. All panels have 32 px headers plus 16 px total body padding/border allowance. `>` means a disclosure/summary; `...` means legitimate list continuation, not hidden-entity count. No panel or tab enumerates undiscovered content.

Top strip has time, known place, attention, held powers and save state. Bottom strip keeps settings/Layout, save/recovery and pause reachable. Main regions start below the top strip. This is a proposed top strip, not today's native time module copied twice. One live node/view owns each control.

| Code | Region | 1366x768 budget | 1920x1080 budget |
|---|---|---|---|
| B1 | Outer padding and gaps | 12 px outer; 12 px gaps | same |
| B2 | Top strip | 1342x48 at x12, y12 | 1896x48 at x12, y12 |
| B3 | Main board | 1342x624 at x12, y72 | 1896x936 at x12, y72 |
| B4 | Left: self | 300x624 at x12 | 320x936 at x12 |
| B5 | Center: actions/work | 706x624 at x324 | 592x936 at x344 |
| B6 | Contextual slot | Shares B5, when active: 362x548 at x668, y148 | Independent 600x936 at x948, y72 |
| B7 | Right: records/log | 312x624 at x1042 | 348x936 at x1560 |
| B8 | Bottom strip | 1342x48 at x12, y708 | 1896x48 at x12, y1020 |

Arithmetic: laptop width = 24 outer + 300 + 706 + 312 + 24 gaps = 1366; height = 24 outer + 48 top + 624 board + 48 bottom + 24 gaps = 768. Desktop width = 24 outer + 320 + 592 + 600 + 348 + 36 gaps = 1920; height replaces 624 with 936 = 1080.

**B9 laptop center, no context:** work/save-related status 64 high, 12 gap, Local actions 706x548, useful body 500 high. Idle work can release unused lines, but this estimate keeps a conservative 64 px reservation. Place prose opens in a reading view rather than a second tall panel above actions.

**B10 laptop center, active context:** the same work line sits across 706x64. Below it, Local actions 332x548 and context 362x548 separated by 12 px. The narrower action list wraps labels; its useful body remains 500 px. Thus contextual trade does not take height away from actions. Belongings in the left column supplies the seller's stock beside the trader. If a recipe/detail table requires more width, the contextual view can use the full 706 width as an explicit activity view with persistent 64 px safe action/exit rail. That dial does not claim the full action list remains visible in that mode.

**B11 desktop center:** Current work 84, gap12, Local actions 592x840, useful body792. Context has 600x936, useful body888. When no activity is open, use it for a pinned known view (inventory, map, preparation), without inventing content to fill space. One context router replaces its previous occupant and restores the pin on exit. Required boundary prompts and combat take priority; no arbitrary simultaneous trade/combat is implied.

**B12 reading areas:** right laptop Records 240 + gap12 + Reports372 =624; desktop Records360 + gap12 + Reports564 =936. They can internally scroll long records and history. The board does not have a second dock scroller around each body. Bottom work controls, trader Total/Accept and recovery are fixed in their own panel region. A long entity list gets one list scroller, never a scroller inside a scroller.

## W1. Early Village

### W1L: 1366x768

```text
+--------------------------- TOP 1342x48 ----------------------------+
| Morning | Village [Read place] | Attention 0 | Saving available      |
+--------- LEFT 300 --------+------------ CENTER 706 -----+ RIGHT 312 +
| Character vitals         | Current work: none (64)     | Records   |
| HP / stamina / XP        +-----------------------------+ known     |
| Inventory & combat view  | LOCAL ACTIONS 706x548       | entries   |
| Preparation [inspect]    | Talk                        +-----------+
| Belongings [use food]    | Find work                   | Reports   |
|                         | Trade                       | newest    |
| Useful held items       | Craft                       | lines     |
| > Equipment comparison  | Gather                      | ...       |
|                         | Travel / other known choices|           |
+-------------------------+-----------------------------+-----------+
| Pause | Save/recovery | Layout | Settings       BOTTOM 1342x48      |
+-------------------------------------------------------------------+
```

Left = vitals184 + gap12 + preparation172 + gap12 + belongings244 =624. Inventory/combat view is included in vitals allocation, not another tall shell. No hunger rows, companions or dormant cheat names are shown unless known. Context is unoccupied and actions use its width. B12 governs the right.

### W1D: 1920x1080

```text
+------------------------------ TOP 1896x48 -------------------------------+
| Morning | Village [Read place] | Attention 0 | Saving available             |
+-- SELF 320 --+-- ACTIONS/WORK 592 --+-- CONTEXT 600 ------+-- RECORDS 348 --+
| Vitals      | No work running 84  | Pinned belongings   | Journal         |
| Preparation +--------------------+ Held items / details| Known people    |
| Equipment   | Local actions      | Compare held items  | Known routes    |
| known build | Talk / Work / Trade | when requested      +-----------------+
|             | Craft / Gather     |                     | Reports         |
| > Compare   | Travel             | Empty pin can be    | newest lines    |
|             | 840 high           | changed or released | ...             |
+-------------+--------------------+---------------------+-----------------+
| Pause | Save/recovery | Layout | Settings              BOTTOM 1896x48      |
+--------------------------------------------------------------------------+
```

Left = vitals200 + gap12 + preparation300 + gap12 + equipment412 =936. Pinned inventory is 600x936; its controls stay with its single view rather than duplicate left inventory. More known detail uses desktop space; unknown panels do not appear as locked placeholders.

**143 px status:** geometrically avoided by 500/792 px action bodies, with time/place no longer stacked above them. Seven illustrative short routine rows need roughly196 px. The exact current/native Village menu still needs a future rebuilt fit check. Neither ASCII nor the old audit proves current runtime fit.

## W2. Mid run: hunger, two companions, status-window cheat

Hunger is a known vitals row with useful meal effects and comfortable unfed play, following PROJECT direction; no death countdown. Companion actions are proposals, not new control rights. Status window numbers here are fixture data. Current source has informational CH1 and no system quests (ENGINE_FIT X2).

### W2L: 1366x768

```text
+-------------------------- TOP 1342x48 -----------------------------+
| Afternoon | Village | Attention 1 | Status: 12 pts | Saving          |
+------- SELF 300 ---------+--------- CENTER 706 --------+ RIGHT 312 +
| Vitals + satiety         | Work: patrol / next pay     | Records   |
| Meal benefit [details]   | Companion A: resting        | People    |
| Status window           | Companion B: gathering      +-----------+
| Level / five known stats+-----------------------------+ Reports   |
| 12 system points        | LOCAL ACTIONS 706x548       | received  |
| Held titles             | Existing useful verbs      | companion |
| Belongings [use food]    | Work / Trade / Craft       | messages  |
| > Preparation summary   | Travel / inspect           | ...       |
+-------------------------+-----------------------------+-----------+
| Pause | Save/recovery | Layout | Settings       BOTTOM 1342x48      |
+-------------------------------------------------------------------+
```

Left = vitals/needs180 + gap12 + status260 + gap12 + belongings116 + gap12 + preparation summary32 =624. Center64 fits three24 px text lines only if work uses a shorter single line with companions sharing a second line; reserve 16 px padding gives48 px text. Therefore **default**: two lines, `Patrol: next pay ...` then `A resting | B gathering`, with full cards via Inspect. Dial: expand companions to 112 px current-work area, actions become500 high/body452. This makes the line budget explicit rather than squeezing three lines into64. Useful independent self/status/inventory remain visible.

### W2D: 1920x1080

```text
+------------------------------ TOP 1896x48 -------------------------------+
| Afternoon | Village | Attention 1 | Status: 12 pts | Saving available       |
+-- SELF 320 --+-- ACTIONS/WORK 592 --+-- CONTEXT 600 ------+-- RECORDS 348 --+
| Vitals      | Patrol / next pay84 | Pinned companion A  | People / routes |
| Satiety     +--------------------+ Known work + terms  | Journal         |
| Meal effect | LOCAL ACTIONS      | Companion B card    +-----------------+
| Status      | Talk / work        | Known work + terms  | Reports         |
| stats/titles| Trade / Craft      | [Open controls]     | received voices |
| Belongings  | Travel / inspect   | replaces pin when   | ...             |
| Preparation | 840 high           | shop/combat opens   |                 |
+-------------+--------------------+---------------------+-----------------+
| Pause | Save/recovery | Layout | Settings              BOTTOM 1896x48      |
+--------------------------------------------------------------------------+
```

Left = vitals220 + gap12 + status300 + gap12 + belongings220 + gap12 + preparation160 =936. Context = two companion cards300 each + gap12 + known group detail324 =936. This is one grouped pinned view, not two extra floating panels. It does not keep control of companions who are not commandable; observed/received status is labelled accordingly. B12 governs records/log.

**143 px status:** avoided in both defaults; laptop companion expansion still leaves452 px body. If arbitrary companion prose is expanded above actions without a cap, starvation returns. Use a bounded card/reading region instead.

## W3. Three held cheats under CS2

Same fixture across all variants: a known Status window, known foresight Records contribution, and a known exchange/shop. These are illustrative CS1 forms, not claims all three run today. One top chip per held power, with a `Powers (count)` dial after about four chips. Library stays the index. Quiet cheats add no panel. Default Spread; Shelf available; Merged offered only with world-supported fusion. Preset switching moves views and does not grant fusion mechanics or reveal unavailable powers.

### W3SL: Spread, 1366x768

```text
+------------------------- TOP 1342x48 ------------------------------+
| Village | Attention | Status pts | Foresight | Exchange | Saving    |
+------- SELF 300 ---------+----- CENTER 706 ----------------+ R312 --+
| Vitals                  | Work line 706x64               |Records|
| Status window stats     +-- ACTIONS332 --+-- CONTEXT362 --+Forecast|
| Status points/titles    | Local choices | EXCHANGE       |known  |
| Belongings: your stock  | Work / inspect| Trader stock   +-------+
| [quantity] [sell]       | Travel        | [quantity]     |Reports|
| > Preparation summary   |               | Total / Accept |...    |
+-------------------------+---------------+----------------+-------+
| Pause | Save/recovery | Layout | Settings       BOTTOM 1342x48      |
+-------------------------------------------------------------------+
```

Left = vitals164 + gap12 + status228 + gap12 + belongings164 + gap12 + preparation summary32 =624. Center B10. Records240 includes foreknowledge tab; Reports372. Trader list body500 less fixed88 px quote/Total/Accept rail leaves412 px, about14 single-line28 px rows. Your stock body116 has about4 rows, with its own list scrolling. Foresight shows only supported forecasts, never unobserved global outcomes.

### W3SD: Spread, 1920x1080

```text
+------------------------------ TOP 1896x48 -------------------------------+
| Village | Attention | Status pts | Foresight | Exchange | Saving            |
+-- SELF 320 --+-- ACTIONS/WORK 592 --+-- CONTEXT 600 ------+-- RECORDS 348 --+
| Vitals      | Work84             | Exchange            | Foresight tab   |
| Status      +--------------------+ Trader | Your stock | Known forecast  |
| stats/titles| Local actions840   | quantities + prices | Library index   |
| Preparation | Work / travel      | lists scroll once   +-----------------+
| Equipment   | inspect            |                     | Reports         |
|             |                    | Total / Accept rail | ...             |
+-------------+--------------------+---------------------+-----------------+
| Pause | Save/recovery | Layout | Settings              BOTTOM 1896x48      |
+--------------------------------------------------------------------------+
```

Left = vitals220 + gap12 + status300 + gap12 + preparation220 + gap12 + equipment160 =936. Exchange's two stocks are inside600x936 (roughly270 px each after padding/gap), not duplicated in left Belongings. Lists receive800 px after88 px transaction rail; long item labels still wrap. Right B12.

### W3HL: Shelf, 1366x768

```text
+------------------------- TOP 1342x48 ------------------------------+
| Village | Attention | Status pts | Foresight | Exchange | Saving    |
+------- SELF 300 ---------+----- CENTER 706 ----------------+ R312 --+
| Vitals                  | Work line64                   |Records|
| HELD POWERS             +-- ACTIONS332 --+-- CONTEXT362 --+Library|
| [Status][Sight][Shop]    | Local choices | SHOP DETAIL    |known  |
| Status rows (selected)  | Work / inspect| Opened via     +-------+
| Shop tab: [Open shop]   | Travel        | Shelf shop tab |Reports|
| Belongings: your stock  |               | Total / Accept |...    |
| > Preparation summary   |               | [Back to pin]  |       |
+-------------------------+---------------+----------------+-------+
| Pause | Save/recovery | Layout | Settings       BOTTOM 1342x48      |
+-------------------------------------------------------------------+
```

Left allocation identical to W3SL; Shelf uses228 including a32 px tab row, leaving148 px body after header/padding/tabs, about6 short24 px lines. Status's deep titles require Inspect or pop out. Shop tab supplies a summary and open link; its operational view uses the contextual slot so300 px Shelf does not swallow the trade list. Short tab labels have full known accessible names. This is a deliberate Shelf overview, with dedicated Status pop out still reachable.

### W3HD: Shelf, 1920x1080

```text
+------------------------------ TOP 1896x48 -------------------------------+
| Village | Attention | Status pts | Foresight | Exchange | Saving            |
+-- SELF 320 --+-- ACTIONS/WORK 592 --+-- CONTEXT 600 ------+-- RECORDS 348 --+
| Vitals      | Work84             | Shop detail         | Library         |
| HELD POWERS +--------------------+ Trader | Your stock | links to Shelf  |
| Status/Sight| Local actions840   | [quantity]          | Journal         |
| /Shop tabs  | Work / travel      | lists               +-----------------+
| selected    | inspect            |                     | Reports         |
| known view  |                    | Total / Accept      | ...             |
| Preparation |                    | [Return to pin]     |                 |
+-------------+--------------------+---------------------+-----------------+
| Pause | Save/recovery | Layout | Settings              BOTTOM 1896x48      |
+--------------------------------------------------------------------------+
```

Left = vitals220 + gap12 + Shelf480 + gap12 + preparation212 =936. Shelf useful body400 after header/padding/tab row. Context and right allocations match W3SD. A player can keep Shelf as the index and pop a known contribution beside it without creating another command owner.

### W3ML: Merged system, 1366x768

```text
+------------------------- TOP 1342x48 ------------------------------+
| Village | Attention | System resource chips | Saving available      |
+------- SELF 300 ---------+----- CENTER 706 ----------------+ R312 --+
| Vitals                  | Work line64                   |Records|
| Known build             +-- ACTIONS332 --+-- CONTEXT362 --+Library|
| Belongings: your stock  | Local choices | MERGED SYSTEM  |links  |
| [sell]                  | Work / inspect| Status/Sight/  +-------+
| Preparation             | Travel        | Shop tabs      |Reports|
|                         |               | Shop selected  |...    |
|                         |               | Total / Accept |       |
+-------------------------+---------------+----------------+-------+
| Pause | Save/recovery | Layout | Settings       BOTTOM 1342x48      |
+-------------------------------------------------------------------+
```

Left = vitals184 + gap12 + preparation172 + gap12 + belongings244 =624. Merged window consumes the one context slot, has a32 px tabs row and468 px useful content before its transaction rail. Current resource chips remain visible across tabs. If combat needs the slot, return the merged window to its pin/home with its selected tab retained; do not lose the pending shop state or treat a layout tab change as transaction cancellation. Exact game command rules still own whether leaving trade is allowed.

### W3MD: Merged system, 1920x1080

```text
+------------------------------ TOP 1896x48 -------------------------------+
| Village | Attention | System resource chips | Saving available              |
+-- SELF 320 --+-- ACTIONS/WORK 592 --+-- CONTEXT 600 ------+-- RECORDS 348 --+
| Vitals      | Work84             | MERGED SYSTEM       | Library index   |
| Preparation +--------------------+ Status / Sight /Shop| known entries   |
| Build       | Local actions840   | Shop selected       | Journal         |
| Equipment   | Work / travel      | Trader | Your stock +-----------------+
|             | inspect            |                     | Reports         |
|             |                    | Total / Accept      | ...             |
+-------------+--------------------+---------------------+-----------------+
| Pause | Save/recovery | Layout | Settings              BOTTOM 1896x48      |
+--------------------------------------------------------------------------+
```

Left = vitals200 + gap12 + preparation300 + gap12 + build/equipment412 =936. Merged context useful content856 after header/padding/tabs, then88 px transaction rail. B12 right. Fusion changes window organization only in these wireframes; actual merged powers require the world owner.

**143 px status across CS2:** B10's500 px action body and desktop792 px body avoid the historical height starvation in all six diagrams. Shelf's148 px detail body is a separate explicit detail tradeoff, not a500 px action list squeezed to143. If every player pop out is kept expanded in the center, these budgets stop holding. Offer rearrangement while retaining a protected action allocation and showing over-budget feedback in Edit layout. Long lists still scroll; no claim that 830 px of content fits without scrolling.

## W4. Nonhuman body, settlement and contextual trade

Illustrative rooted being trading through a known, authorized carrier. Terms and control rights are hypothetical owner inputs. No new species/canon facts. Body rows show supported reserve/reach/senses instead of assuming human HP/stamina/mana. A received settlement report is not live remote knowledge. Inventory is actual offered stock, not anatomy automatically converted into tradable items. Body mechanics remain with [nonhuman UI owner](../../../worlds/NONHUMAN_SENSES_SCALE_AND_UI_2026-10-14.md).

### W4L: 1366x768

```text
+------------------------- TOP 1342x48 ------------------------------+
| Rooted body | Village edge | via agreed carrier | Attention | Saving|
+------- SELF 300 ---------+----- CENTER 706 ----------------+ R312 --+
| BODY: reserve / reach   | Work: tending / next result64 |Records|
| Known contact/senses    +-- ACTIONS332 --+-- CONTEXT362 --+Reports|
| Carrier: known terms    | Inspect       | TRADE          |received|
| SETTLEMENT              | Tend          | Trader stock   +-------+
| Received report [time]  | Request carry | Stock offered  |Log    |
| Running work [inspect]  | known terms   | via carrier    |known  |
| OFFERED STOCK [quantity]| safe exit     | Total / Accept |events |
+-------------------------+---------------+----------------+-------+
| Pause | Save/recovery | Layout | Settings       BOTTOM 1342x48      |
+-------------------------------------------------------------------+
```

Left = body/carrier184 + gap12 + settlement224 + gap12 + offered stock192 =624. Settlement useful body176 can show report age, known running jobs and one next choice; its long resident/job list scrolls in Inspect. Offered stock useful body144 is about5 short28 px rows. Context B10 gives about14 trader rows after rail with short labels; quantities/cost/Total/Accept do not scroll out. Body stays independently visible while settlement and trade are open. Invalid reach offers known reasons, never a fake Move action.

### W4D: 1920x1080

```text
+------------------------------ TOP 1896x48 -------------------------------+
| Rooted body | Village edge | via agreed carrier | Attention | Saving        |
+-- SELF 320 --+-- ACTIONS/WORK 592 --+-- CONTEXT 600 ------+-- RECORDS 348 --+
| Body        | Work84             | TRADE               | Received reports|
| Reserve     +--------------------+ Trader | Offered    | age/source      |
| Reach/senses| Local actions840   | stock via carrier   | Known routes    |
| Carrier terms| Inspect / tend    | quantities + quote  +-----------------+
| Settlement  | Request carrier    |                     | Reports         |
| known jobs  | known reach        | Total / Accept      | observed events |
| report age  | safe exit          | Exit / return pin   | ...             |
+-------------+--------------------+---------------------+-----------------+
| Pause | Save/recovery | Layout | Settings              BOTTOM 1896x48      |
+--------------------------------------------------------------------------+
```

Left = body/carrier280 + gap12 + settlement644 =936. Settlement now has596 useful px for received work/resource lists. Trade supplies both stocks within600 px as W3SD, so no duplicate stock panel sits in left. B11 center, B12 right. Known nonhuman body and settlement panels share the self/management area; Manage can move the settlement into the larger contextual region after trade closes as a dial, without forcing a new global preset during a transaction.

**143 px status:** avoided by B10/B11 action budgets. The long settlement can still overflow its own reading region. Body-specific labels, known lack of sight, carrier terms and long species names need actual wrapping/focus/knowledge tests; these diagrams do not verify them.

## W5. What these budgets do and do not prove

| Code | Proposed check for later implementation | Current result |
|---|---|---|
| G1 | Measure action body, not its header: default >=452 useful px in these laptop variants, >=792 desktop. Seven short routine actions, known Finish/Stop/retreat and critical choice remain visible. | Arithmetic only. Nested expansion and long labels can fail even above a height floor. |
| G2 | With open trade/craft, keep quantity controls, Total/Accept or craft commit/exit visible; at least five useful recipe/trader rows where applicable. | Diagrams allocate rails and rows; no actual native control measurement. Laptop craft detail may need full-center dial and then loses the full visible action list. |
| G3 | No page overflow or overlay blocking save/recovery; one list scroll owner; F6/focus reaches every visible region and returns after pop/tuck/context change. | Intended behavior only. Existing F6 enumerates board modules, so top strip/context integration needs adaptation. |
| G4 | Import old layouts and display settings without shrinking critical actions or naming unknown content; restore gameplay only from game state. | ENGINE_FIT C1-C5 specify compatibility risks; no import/save operation run. |
| G5 | At laptop text enlargement/zoom, reflow and preserve control access rather than shrinking text; long labels, populated trade, companions and nonhuman state tested. | Open. These fixed normal-size budgets do not prove enlarged-text fit or human layout-feel acceptance. |

The density audit's 143 px measurement is historical **SHOWN by its report**, not newly observed. Current A1 CSS/PROJECT claims are recorded separately in ENGINE_FIT X1. These **INFERRED** diagrams solve its allocation cause on paper. They do not claim the current game still has that precise problem, or that this proposal is playable, implemented or accepted.
