# R3: independent Proto23 upper and lower regions

2026-10-15. **Technically delivered. Runtime UI source ownership released to root.**
Weibao's visual acceptance remains **OPEN**. No commit, push, publication, install,
new chat, agent, queue restart or personal-save access.

[Source / frozen R2 / rebuilt R3 comparison](http://127.0.0.1:19148/docs/gm/dispatch/ui-foundation-2026-10-15/evidence/parity-r3/comparison.html)
has Inventory, Focus, Stats, Bars, Combat and 150% text views, version toggles and
verified native 100% mode. [Populated playable R3](http://127.0.0.1:19148/r3-demo.html)
uses a separate frozen origin and seeds a synthetic save **only if that origin has
no save**. An existing save there is retained. [Ordinary start](http://127.0.0.1:19148/):
choose **Proto23 Parity R3** in Presentation. This does not change the game's default.

## What was wrong, and the finished change

R2's three full-height docks forced unequal upper widths and left only82px of
inventory at150%. Changing offsets could not fix the region ownership. R3 adds
five real composition regions to the **existing registry and sole mover**: player,
focus, inventory, actions and log. A four-track/two-row grid spans two tracks for
the upper player and independently spans two different tracks for lower actions.
No duplicated native nodes, second mover/controller/dispatcher, transform scaling
or overlapping panel widths were introduced.

| Code | Result | Changed paths |
| --- | --- | --- |
| R3A | Separately selectable/stored composition; equal upper regions within0.9%, paired lower boundaries, full-height board log. Native equipment discloses inside the fixed upper player region | `src/workspace_layout.js`, shared `styles/ui_tokens.css` |
| R3B | Native item names/counts actually inherit14/17.5/21px. Compact category, sort and Reverse controls delegate original handlers. Purse moves to the shared Inventory header. Selected-item Hotkey goes to its existing expanded native binding form. Six full populated rows remain during selected-item two-enemy combat at21px | `src/proto23_shell.js`, same styles/controller |
| R3C | Native direction labels **Hit you**, **Evade you**, **You hit them**; Speed retains `/s`; AP/EP explicitly remain ratings. Your connection chance reuses the authoritative renderer's already calculated opponent evasion. Opponent HP fill reads its existing native health-bar width | `src/ui/combat_display.js`, `src/combat_focus.js`, `src/village_workspace.js`, `tests/combat_focus.test.js` |
| R3D | Measured source role colors/gradients/frames. Health, XP, energy and native extra mana remain distinct. Zero-capacity mana now draws empty while retaining native0/0 text | shared tokens and shell adapter |
| R3E | Ordinary Pin glyphs removed; labelled Pin/Unpin remains keyboard operable in Edit layout, with stored pin state retained. Favorite/Unfavorite, Auto, Hotkey and Compare remain under labelled **More actions**, which opens the existing expanded item route. Use and Close item stay visible in compact150% combat | same UI owners |

Surface declaration: routine player/inventory/actions at their existing homes,
contextual place/person/opponent Focus, existing reference/expanded Inventory and
item routes, and ambient log. Target1366×768 first; affected1440×900/1920×1080
checked. Mobile, new content/AI, portraits, rank mechanics and a new VFX engine
remain deferred. Root retains PROJECT/USER_VISION/UI_RULES and dispatch ownership.

Read acknowledgment: R3 packet, live PROJECT/USER_VISION/UI_RULES UR1–UR40,
R2 report and pinned original were read before edits. R3_TRANSFER names actual
chat `01a13e70-6c75-7630-b105-26b861da80ca`. The adjacent writer's main/save/clock
and continuation reservation was respected. Its final report now explicitly
releases its runtime writes; R3 does not claim acceptance of that gameplay slice.

## Measured geometry and actual text

Source is pinned SHA256
`a43e55e2eeb455f1c1ae589e3fc074a588813fe6cd57cfba827dcf923f3755d5`.
Fresh source captures call the existing disposable lab presets/native owners,
then remove only the lab display scale. `transform:none`, native1366×768,
DEV SEEDED, no original file edits. Game/progression states differ between
source, R2 and YAIR; these are composition comparisons, not equal game states.

| Region at1366×768 | Source px | Frozen R2 px | R3 px |
| --- | ---: | ---: | ---: |
| Upper player |446×326|337×246|467.2×303.3|
| Upper focus |446×326|564×246|463.2×303.3|
| Inventory outer |336×436|337×422|349.0×366.7|
| Actions region |556×436|564×292|581.4×366.7|
| Log outer |379×765|389×668|393.6×674|
| Useful native item list,14px |386|245|**274**|
| Useful native item list,21px |source native17.6px|82|**243**|

Upper width difference is4px,0.86%; heights end together. Lower inventory/actions
ratio is0.600 versus source0.604. Log is about29.5% of the board width. The board
occupies y47–721, allowing the persistent top navigation and Save/Import footer;
source extends5px below the viewport. R3 therefore does not copy source absolute
heights or claim pixel identity. The log keeps its full board height.

| Viewport / native item text | Useful list px | Full populated rows before selection |
| --- | ---: | ---: |
|1366×768 /14px|274|11|
|1440×900 /14px|406|17|
|1920×1080 /14px|586|21|
|1366×768 /17.5px actual125%|261|9|
|1366×768 /21px actual150%|243|7|

The combined selected-item combat assertions also require **at least six full
native item rectangles** after selection, not merely six DOM nodes. Native
selected opponent, six fact rows, live log, item use, description and explicit
Close/way back remain. The final21px compact combat description has61px of
reading space and a larger reference route. Duplicate held metadata yields space
in compact combat; its native count/value stays in the selected inventory row.

No page scroll at any tested desktop/text size. Longer lists, item descriptions,
native stats and expanded reference content use their bounded scroll routes.
Long item names can truncate in the compact list; selected detail wraps the full
name. Equipment discloses/scrolls in the upper player region. This is a visible
space decision, not a claim that every empty slot or full tooltip fits at once.

## Extracted source → candidate color roles

[Original computed values](evidence/parity-r3/source-computed.json) and
[candidate computed values](evidence/parity-r3/candidate-computed.json) are fresh
browser reads. The measured-source role assertion passes.

| Source role | Source value | Candidate token / role |
| --- | --- | --- |
| Player and focus `.d` |`rgb(0,40,64)`|`--p23-context`, both upper regions |
| Inventory/actions |90° `#000533 → #00416b`|`--p23-region-fill`, both lower regions |
| Log |180° `#3c325a → #181031`|`--p23-log-fill` |
| Outer frame |3px solid black|`--p23-frame`, all five regions |
| Inventory hairline |1px `#4444cc`|`--p23-line`, native item rows |
| Health `.hp` |90° `#feef9d → #2ddfce`|`--p23-health-fill`, real player/opponent fill |
| XP `.exp` |90° `#feef9d → #db779e`|`--p23-xp-fill` |
| Energy `.en` |270° `#7c4470 → #1d1d71`|`--p23-energy-fill`, real YAIR stamina |
| Hover |90° `#19816c → #012927`|`--p23-hover-fill`, observed native row hover |
| Lower-region text |`#bcfefe`|`--p23-text` |
| Persistent selection / keyboard focus |Source has no matching retained selection; input outline is removed|YAIR keeps pointer+outline, explicit pressed state and2px keyboard outline |
| Native extra mana |No equivalent source slot|Native mana label remains; zero capacity is visibly empty |

R3's presentation selection opts into these shared source tokens. Player custom
palettes still win, including structural regions, detail and log; the native
custom red palette test passes. Native14px default typography is retained rather
than copying source17.6px MS Gothic. Native message semantic colors and readable
outlined bar labels remain. These are named semantic/accessibility deviations.
No original HTML/CSS/assets or engine/timer/save code were copied into runtime;
private source-derived experiments were allowed but unnecessary for this route.
Upstream licensing metadata remains unresolved; no publication/relicensing claim.

Native full/low/empty resource loading is exercised at21px, with exact native
numeric text and an empty0/0 mana track. The native loader normalizes attempted
overcap snapshots. A separate **display-only** empty/overcap/long-number fixture
checks clipping and full label bounds without changing gameplay; this does not
claim an attainable native overcap mechanic. See
[bar boundaries](evidence/parity-r3/bar-boundaries.json) and
[additional boundaries](evidence/parity-r3/boundary-results.json).

## Combat, navigation and preserved behavior

The native emitted facts are read from their existing rows. `Hit you` is the
selected opponent's chance against you; `Evade you` is its evasion against your
attack. `You hit them` is the complementary native connection chance from that
same authoritative calculation, before damage reduction/block. Existing shield
symbols/guards are retained; no shield chance, AP/EP percentage, level or intent
is invented. Zero defense remains0. Multi-enemy selection and health match the
selected native row, including live updates. No RNG, damage, timing or balance
calculation changed.

Native equip/take-off, use, read, worn equipment, comparison, real stats, active
meal effect, known/unassessed person, dialogue, craft/mix, Back/Esc/history and
filter/selection return are exercised. Inspection preserves paused clock,
character, inventories, books, encounter and expansion/RNG. Use consumes one
native item. Favorite/filter and both directions of a populated native sort
column are checked. Sort ties retain native semantics; no new sort model exists.
The original Hotkey form is opened through the public expanded Inventory route,
with selection and gameplay preserved on return.

Full effects still reach the native animation path (3 observed animations);
Reduced/Off/system reduced motion produce0. Stable actor/name/health/stat/log
anchors remain. This is not a new VFX system or a claim of visible animation
parity with Proto23.

## Compatibility, verification and frozen delivery

The explicit compatibility choice is a new per-browser presentation key
`yairpg.presentation.proto23-parity.v1` and layout key
`yairpg.workspace.v1.desktop.proto23-parity`. Existing game schema and commands
are unchanged. Old default/C1/R2 layout bytes, pins and collapse records are not
rewritten. Switching back restores the exact original raw layout; it survives
Save/reload/Export/literal-file Import. Native old row controls remain attached;
compact adapters delegate them. No personal save was read or tested.

| Check | Result | Evidence |
| --- | --- | --- |
| Final rebuild |Pass|`runs/r3-build.log` |
| Native desktop/item/person/service/persistence journey |**24 groups pass**|`check-r3.cjs`, `runs/r3-browser.log`, `evidence/parity-r3/results.json` |
| Structural/text/combined selected combat/favorites/sort |**8 groups pass**|`check-r3-parity.cjs`, `runs/r3-parity-browser.log`, `evidence/parity-r3/parity-results.json` |
| Close/description, palette, motion, knowledge, long names, bars |**9 groups pass**|`check-r3-extra.cjs`, `runs/r3-extra.log` |
| Native hotkey, active effect, keyboard pin, display boundaries |**4 bounded checks pass**|`check-r3-boundaries.cjs`, `runs/r3-boundaries.log` |
| Final focused affected/controller/contract slice |**12 pass**|`runs/r3-focused.log` |
| Broader suite during R3 |**1791 total:1786 pass,2 inherited failures,3 TODOs**|`runs/r3-tests.log` |
| Source/served bytes |**565 project sources /13 served JS/CSS match**,44 vendor embedded entries excluded from project-disk comparison|`runs/r3-parity.log`, `evidence/parity-r3/parity.json` |
| Final adjacent-source refresh |Fresh integrated desktop/21px/selected multi-combat plus Save/reload/Export/literal-file Import pass|`runs/r3-integrated.log`, `final-integrated.json` |
| UI contract |211 entries /273 occurrences, no new exception|same parity record |
| Frozen prior artifacts |**144 R2/C1/prior artifacts unchanged**, plus inherited prior hash records|`frozen-before.json`, same parity record |
| Comparison |All six facets, original1366×768 pixels, source/R2/R3 toggles pass|`runs/r3-comparison.log`, `comparison-check.json` |
| Final window |No source/style drift; adjacent reserved source hashes retained across build/proof|`window-before.json`, `window-after.json`, `reserved-before-final-build.json` |
| Hygiene |`git diff --check -- src styles tests` passes|final command |

A later adjacent `main.js`/`continuation_state.js` adult-human eligibility guard
changed after the initial no-drift check. That drift is retained in
`window-drift.json`; R3 rebuilt against the released final sources and repeated
the affected integrated text/combat/save/import and source/served gates. The
final verification window has no drift. Earlier visual journeys cover unchanged
UI modules; this does not accept continuation gameplay.

The broader run precedes the final bounded UI refinements; final focused and
browser checks cover those changes. The inherited failures are exactly the
cheat-awakening clock-jump first-message/storage retry and partial-enemy-load
undefined `card` failures, with3 existing TODOs. They remain open, not relabelled.
Earlier R3 diagnostics found small item text, clipped Close, the selected Hotkey
row cost, an expanded binding hidden by an overbroad compact selector and an
invalid assumption about stable native price ties. Those findings were corrected
or their tests aligned with native semantics and rechecked; they are not final
passing evidence.

The final UI snapshot is frozen outside the shared checkout at
`/Users/weiwei/.codex/candidates/yair-ui-parity-r3-2026-10-15-01a13e70`.
[Output fingerprint](evidence/parity-r3/frozen-output.json) records its bytes.
The adjacent quiet-continuation final report explicitly releases its source;
reserved source bytes matched across R3 verification. These UI tests do not
accept continuation gameplay. Shared authority documents remain root-owned.

## Rank investigation, proposal only

**RK1 Source fact.** Original `you.rank()` near7316 derives an estimate from local
stats; d6's tooltip near9102 says a realm power position with lower stronger,
and d6.update near9956 displays it. Monster `eranks`/d9m is a different rating.
No population enumeration or online leaderboard was established by that code.

**RK2 Native boundary.** YAIR's `power_models.js` and ENGINE_EXPANSION explicitly
avoid universal fictional-rank conversion. Existing world content distinguishes
local recipe rank and institution rights from martial power/mastery; native Lv
is not a cross-world rank. Observer-known facts constrain any assessment.

**RK3 Design proposal.** A future world-scoped assessment should name its domain
(e.g. an institution's admitted grade, a witnessed local combat estimate), issuer,
evidence/knownness and whether it is an estimate or actual recorded position.
Actual positions require an actual defined roster. Incomparable powers remain
incomparable or use an explicitly chosen scenario. Unknown rank stays omitted,
not filled with the Proto23 formula or sealed truths. **No rank mechanic or
placeholder was added**, and this report does not promote that proposal.

## Release and remaining gate

**R3 runtime UI writes are released to root.** The queue remains held; this report
creates no next dispatch. Read-only frozen preview may remain. No commit/push.
Technical source/layout/native/save/browser delivery is complete for this slice.
**Weibao's visual/feel acceptance is the remaining authoritative acceptance gate.**
Exact pixel identity, simultaneous disclosure of all equipment/tooltips, mobile,
global rank and future effects remain outside the delivered claim.
