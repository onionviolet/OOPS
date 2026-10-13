# Proto23 deeper source mechanisms and adoption

2026-10-13. Follow-up requested by Weibao: “can continue deeper, also consider
source code and more?” Extends [UI absorption](UI_SOURCE_ABSORPTION_2026-10-13.md)
and the [earlier complete source reading](PROTO23_VS_YAIRPG_2026-10-10.md).
Research and proposals, not accepted implementation choices or gameplay delivery.
Desktop/laptop is primary; mobile optimization remains deferred.

## Evidence scope

Primary source: [Proto23 index.html](https://github.com/23html/23html.github.io/blob/e93a8cd617932fb698ff889b968a32f9a20d48f3/index.html),
revision `e93a8cd617932fb698ff889b968a32f9a20d48f3`, SHA256
`a43e55e2eeb455f1c1ae589e3fc074a588813fe6cd57cfba827dcf923f3755d5`.
This pass directly read the event/XP, acquisition, recipe preview/execution,
inventory, combat messages, reading, scouting, restore, timer and RNG helpers,
then compared relevant current fork source. It does not claim another full
14,768-line read or a new browser playthrough. The earlier UI report owns the
live introduction/difficulty evidence.

[Probe script](probe_source_mechanisms.mjs) extracts exact functions from the
pinned source into disposable Node VM fixtures. It does not start the game,
read browser storage, or execute the whole downloaded document.
[Recorded output](SOURCE_MECHANISM_PROBES_2026-10-13.json) owns four reproduced
mechanisms. Source line numbers below refer to the pinned HTML, not our fork.

## F4: The strongest pattern is a chain from experience to capability to UI

The earlier R2 report incorrectly said first XP reveals a skill. In
`giveSkExp` (13747-13758), the visibility insertion is inside the level-up branch.
The default first threshold is 51 XP. The exact-function probe confirms:
1 XP leaves level 0, no entry and an unknown Skills tab; another 50 XP reaches
level 1 and reveals the entry/tab. This distinction matters for pacing and
whether a small incidental experience should advertise an entire system.

| Source chain | Mechanism | Fit in the current fork |
|---|---|---|
| Walking practice → level 1 → Run action → Actions tab | Walking milestone calls `giveAction`; that grants the command and replaces the tab label (1859-1872, 9054-9059). Run still has location/activity restrictions (8996-9020). | Native skills already have visibility thresholds and milestones; `skill_expansion_host` represents learned methods. Reuse those owners. A known action may remain visible with a current reason it cannot run. |
| Hold 50 Cure Grass → recipe knowledge → Assemble tab | `onGet` tests current amount and grants a recipe, then replaces its own handler with a no-op (2222-2224, 10892-10899). | Useful hypothesis: handling enough of a material teaches a preparation. Do not silently substitute lifetime gathered count for current held stock. Native recipe/unlock/acquisition owners should record the chosen fact explicitly. |
| Read a book → new information view | Book completion grants Bestiary or Journal (5354-5357, 5583-5585); the reading view has remaining time and Stop (12676-12691). | Keep current notebook and discovery records. A new reference view can be earned, while essential logs/save/recovery remain available. Preserve partial study on cancellation and explain whether knowledge survives loss of the physical book. |
| Use wallet → visible money denominations | Wallet contents become native wealth; `m_un` reveals money UI (4938-4946). | Currency can enter an unfamiliar world's UI through discovery. Known balances and transaction costs cannot become inaccessible because the wallet is dropped. Distinguish possession of a tool from learned knowledge. |
| Counter threshold → title → bonus and announcement | `giveTitle` grants once, runs hooks and updates the selected title (13760-13766). | Already has `titles.js` and native `refresh_titles`/derived bonuses. Improve presentation/earned feedback in that owner rather than build a second title system. |

The transferable idea is that interface growth reflects what the player has
actually encountered or learned. Discovery, mastery, permanent unlock, current
permission/fuel and user layout preferences remain separate. Losing access
should not erase a known record or replay its first discovery.

## F5: Colors and effects form several distinct vocabularies

Proto23 inventory defaults mostly color by item subtype, with explicit item
overrides (`renderItem`, 11081-11094). Equipped gear also uses a rarity palette
and glow (`equip`, 10832 onward; palette at 187). Shop item colors reuse subtype
colors, while red marks insufficient money and gray marks sold out
(11250-11275). Thus “copy rarity colors everywhere” would misread the source.

Combat has a separate grammar: damage-type color, CRIT text, target body-part
suffixes, and multi-hit counts (13930-13975). Place UI combines time/season,
weather and local effect glyphs (`rfeff`, 13703-13711). These details help explain
what happened and where, not merely decorate a panel.

Proposal: keep separate semantic tokens for category, rarity, resource, result,
damage type, and selected/blocked states. Accompany important meanings with
words or icons. Scope labels to actual supported mechanics: body-part damage
or elemental effects should not appear in a cosmetic skin if the active engine
does not resolve them. Current `component_themes` already computes readable
contrast; current `workspace_layout` and `workspace.css` also contain a Vivid
color option. Their presence is source evidence, not new visual acceptance here.

The pointer burst is not a generic click effect: `dumb(x)` is called by coin
items (4779-4818). `mf` floats spending at hard-coded money coordinates;
`appear` reveals panels; `.blinks` marks newly acquired items. Their triggers
matter as much as their appearance. Adapt meaningful event feedback through
`settled_text_effects`/native display, anchored to current geometry and emitted
after settlement. Reserve strong effects for rare meaningful changes; routine
ticks need quiet feedback and a readable log. No source-only particle claim
becomes a browser-verified effect by appearing in an inventory.

## F6: Dense UI works because details have a nearby place to go

`renderRcp` puts the recipe list beside reagents, output and tool requirements,
with the current recipe marker in the list (10623-10704). Shops put quantity,
price and bulk controls on the same row (11250 onward). Skills pair name/level,
XP fraction and a small bar (10730 onward). The full revealed opening puts the
enemy beside the player above the action view, giving comparison a dedicated
region rather than a succession of full-screen views.

Adapt that relationship with flexible desktop tracks and an explicit selected
row/detail region. Compact data rows can coexist with comfortable interactive
targets and group spacing. Keep quote, missing requirements, current work and
the next command close together. Preserve selection, focus and scroll position
during updates. No nested dock scrollbar containing several independently
scrolling panels, under the current UI owner's policy.

The source has keyboard handling, but inventory focus is assigned on mouse
entry and removed on exit (11013-11016, 11067 onward). So the earlier blanket
claim that Proto23 has no focusable controls was too broad: the observed opening
had no focusable action controls, while deeper inventory has hover-dependent
keyboard support. Adapt keyboard-first selection and persistent buttons rather
than require a mouse to make them focusable. Hover may preview, while focus/click
provides the same useful details.

## F7: Preserve strong behavior while correcting source coupling

| Issue | Exact evidence and practical implication | Disposition |
|---|---|---|
| Overflow XP also reaches side-effect hooks repeatedly | A 60-XP award leaves 9 XP after level 1 and calls `onGive(9)` then `onGive(60)`, totaling 69. Absorption hooks accumulate that argument as Ki (2041-2081, 13747-13758). Reproduced with the exact function and disposable fixture. | Adapt XP and one-time milestones; process award side effects exactly once per settled award, regardless of overflow. |
| Preview/button/count disagree about second tool | `canMake` checks every tool with `!o.includes(2)` (8858-8880). Recipe UI and `_fcraft` inspect only `o[0]` (10698, 10728). Missing Tool B with Tool A present yields no output/material consumption but increments `crftt`. Exact-function probe reproduced this. | One authoritative result should supply enabled state, every known missing requirement, execution and receipt. Increment counters only after an actual craft. |
| Random selection favors middle entries | `rand` rounds instead of flooring; `select` calls it with `length-1` (13883-13885, 14423-14426). For three options, 10,000 evenly spaced midpoint samples produce 2500/5000/2500. This is a function-distribution probe, not sampled full-game encounter rates. | Use explicit uniform integer sampling, or explicit deliberate weights. Preserve saved outcome/RNG contracts when changing an existing game. |
| Hover is gameplay | `addDesc` mouseenter grants Literacy XP and increments a counter (10362). More tooltips therefore change progression. | Deliberate Examine can be gameplay. Rendering, previewing and focus should remain read-only unless the design explicitly makes the action a lesson. |
| Acquire and restore share event code | `load` replays `giveItem` (348-352), which invokes `onGet`; milestone restore can run reward closures (319-326). | Restore facts and derive projections separately from new acquisitions. Old-save backfill needs explicit idempotent migration/compatibility rules. |
| Countdown animations and jobs use independent timers | Reading display dots use 333 ms and reading progress 1000 ms (12681-12686); run/repeat-craft use other intervals. | Retain existing played-time/work owners. Draw countdowns from owner clocks; visual timers should neither settle jobs nor grant XP. |
| Log freeze suppresses new displayed events | `msg` returns without appending while frozen; otherwise it forces scroll to the bottom (10296-10311). | Separate retained event/receipt history from filtered rendering. Reading older reports should stop auto-scroll and expose an unread count, not erase new receipts. |

These findings are adaptation costs, not a reason to reject the reference.
Probe scope does not establish how often any defect affects an ordinary run.

## F8: Current adoption map, checked against live source

The October 10 comparison described an older fork. These current counterparts
already exist, so absorption should extend or verify them rather than duplicate
them. No fresh browser acceptance is claimed by this table.

| Family | Current source owner | Current evidence and next useful work |
|---|---|---|
| Native skill discovery | `skill_discovery.js`, `skill_discovery_native.js`, `models/skill.js`, `display.js` | Threshold plus unlock gate; filtered render paths. Extend the same disclosure decision to categories, search, picker labels and event detail. |
| Learned methods and their progress | `skill_expansion_host.js`, `skill_expansion_ui.js` | Known offers, learned methods, milestone descriptions and current reasons. Trace a chosen milestone through native use before claiming the full chain works. |
| Titles | `titles.js`, `titles_ui.js`, `main.js:refresh_titles` | Counter grants and derived bonuses exist. Current panel exposes unearned goals; distinguish public achievement goals from any future sealed/discovery-only title. No blanket hiding proposal. |
| Home/furnishing bonuses | `absorb_b/furniture.js`, native host bindings | Existing ownership/location projections and Literacy/rest bonuses. PROJECT.md explicitly replaced “no passive bonuses” on October 11. Numbers and balance remain proposals. |
| Utility equipment | `absorb_c1/accessories.js` | Four native amulet designs reuse equipment/recipes; proposed extra depth should use those utility hooks. |
| Finite search/local rhythms | `absorb_c2/local_life.js`, `world_rhythm.js` | Capped search and recurring windows already exist. Improve known opportunity cues/stop reasons, not another uncapped per-room timer. |
| Optional hunger/weather | `absorb_e1/pacing.js`, `weather.js` | Default-off settings and played-time state exist. Add precise consequences to the current weather/resource view before proposing another meter. |
| Optional equipment condition | `absorb_e2/durability.js` | Per-copy condition/repair source exists. Show exact held-copy condition and cost through the existing identity owner. |
| Layout, palette and feedback | `workspace_layout.js`, `workspace_state.js`, `component_themes.js`, `settled_text_effects.js` | Flexible panels, density presets, Vivid option and event effects exist. Core registrations often use default eligibility; ineligible picker names remain visible. Trace disclosure into the whole UI. |

For existing browser/persistence evidence, PROJECT.md's Absorption wave section
links the wave checkpoint and acceptance backlog. The table above establishes
current source counterparts only. Historical “ONLY” labels are not current
absence claims.

## Proposed adoption order

1. **A6 Discovery end to end:** one already supported learning event reveals
   the useful panel and known records, including layout picker/search/counts.
   Preserve known records and current failure explanations across reload.
2. **A7 One action explanation end to end:** give a native craft/activity one
   consistent selection, quote, requirements, button state and settled receipt.
   Use the existing preview/execution owners, not a second availability engine.
3. **A8 Presentation coherence:** apply category/result/resource semantics to
   that same loop, with vivid surfaces, compact comparison rows and anchored
   reveal/receipt feedback. Verify the existing palette before adding another.
4. **A9 Extend current absorbed systems:** choose the next gap in title,
   furnishing, search, equipment or pacing presentation from the live adoption
   map. A named gap and playable route determine scope.

These are proposals. This research request does not select all four runtime
packages. For a selected slice, the gate is rebuilt fresh-origin desktop play at
1366×768, 1440×900 and 1920×1080, with a populated state and larger text/zoom.
Persistence changes also require export, reload, literal-file import and an old
save fixture. Verify once-only reveals/rewards, truthful failures, stable focus,
readable contrast and reduced motion. User saves remain private and untouched.

## Checks and open work

Ran `node docs/research/proto23/probe_source_mechanisms.mjs` against the pinned
snapshot: all four assertion groups passed and output was saved. Read current
source counterparts and checked their governing PROJECT.md direction. No game
build/tests were needed for these research-only changes; no native gameplay,
balance, installed, committed or deployed claim follows from the probes.
Later Proto23 gates/effects remain source-only. A rebuilt playable adoption
slice remains open. Attribution/license provenance is retained in the UI report;
this pass distributes no copied source functions or assets.
