# P07 field familiarity, 2026-10-14

Status: module implemented, native loop **implemented-unverified**. Do not final
merge as gameplay. P00 owns the missing native joins and integrated candidate.
Source commit: `359e6565` on `absorb-all/p23-field-familiarity`, base
`0216ccdefcfce79877378f8cb0ee41129fe11c5d`. No push or merge. Initial tree clean.

## Authority and scope

Coordinator authorized wave 2 without waiting for wave 1 and explicitly confirmed
port 18826 reserved. Live `runs/SESSIONS.md` lists session
`01a138b8-c632-71b3-ba84-38884fae6a43`. No listener used that port before our own
temporary server. Prepared node_modules symlink retained; nothing installed.
Exclusive game writes: `src/absorb_p23/field_familiarity/` and
`tests/p23-field-familiarity.test.js`. No shared registrations, C2/P14 state,
original audit ledger, raw library or user save edited. Build-generated tracked
artifacts restored to initial bytes; no dist committed.

Read AGENTS, PROJECT standing priorities/accepted decisions, USER_VISION desktop
priority/scope, LIFE_SIM_NORTH_STAR (proposal), COMMON, re-audit ledger, native
calendar/activity/CombatZone clear rewards/C2 state and resource owners. Pinned
Proto23 HTML hash matched `a43e55e2eeb455f1c1ae589e3fc074a588813fe6cd57cfba827dcf923f3755d5`,
revision e93a8cd. R1–R5 mechanism bindings and supplemental mod lunar/scouting
notes reviewed. No foreign code/assets copied. d49cb911/379007d7 presentation,
crafting/settings/panel features were not reimplemented.

Target **1366×768 desktop/laptop**. Intended native outcome: known-only next
window, stock and six/three-minute search options in Local actions. Mobile
optimization deferred. Exact site/name/threshold are reversible original
proposals, not creative acceptance.

## Row dispositions

| ID | Source mechanism | Disposition and evidence |
| --- | --- | --- |
| R04 | Master calendar, weekday, moon, sleep tuning | Native calendar reused, not replaced. lunarWindow uses Game_Time's actual New phase; 120-day positive/closed sweep and next-window/month/year boundaries pass. Sleep tuning unchanged. Native consumer join OPEN. |
| R37 | Familiarity from scouting/combat | One minute per genuine eligible played minute, no clear/character/skill XP. Village scouting and Infested field combat both independently unlock three-minute search at 30 minutes, versus six-minute ordinary search. Continued learning allowed. Native action/combat callback gate OPEN. |
| R59 | Recurring night lunar herb | Known Village bed yields existing Golmoon leaf through a planned native receipt. One physical stock per native New phase, daily 00:00–04:00 appointments until picked; future phases replenish indefinitely. Two distinct cycles/serialization/replay controls pass at module layer. Native acquisition/persistence OPEN. |

## Compatibility decisions

D1: Proposed optional envelope key `field_familiarity_p07`. Old-save absence
stays absent; load/render must not publish normalization defaults. Present state
requires exact schema 1, finite safe integers and valid pending records.
Unsupported schemas, containers, unknown fields and impossible claims reject.
Whole-envelope validateFieldSnapshot binds claims/cursor/pending to the incoming
native calendar/played clock before mutation.

D2: Claims use first native day_count of a New phase and a saved high-water mark.
Render/reload/clock replay does not pay. Missed windows grant nothing;
interruptions claim nothing; duplicate/backward/gapped callbacks do not replay
elapsed learning. A physical bed can deplete while its future occurrence remains
reachable. C2 stashes remain owned by life-loops/P14.

D3: Outputs are plans, not a second store/publisher. P00 preflights live revision,
clocks, discovery, action and native custody; atomically commits state, item and
native activity through the existing save transaction. Aborted/stale plans change
neither owner. This host atomicity is OPEN, not proved by module tests.

## Exact P00 request

[HOST_CONTRACT.md](/Users/weiwei/code/yair-absorb-all-20261014/p23-field-familiarity/src/absorb_p23/field_familiarity/HOST_CONTRACT.md)
contains signature/input/output/preflight requests: public elder discovery,
Village scouting, lunar activity registration, existing Golmoon leaf resource,
start-bound combat/scout callbacks, native action start/stop, optional save key,
incoming-save preflight and atomic native publication. No cross-edits. P00 must
return its integrated candidate and evidence before native completion.

APIs: validateFieldFamiliarity(raw), validateFieldSnapshot(raw,{clock,calendar}),
normalizeFieldFamiliarity(raw), fieldAction(raw,context,id),
advanceFieldFamiliarity(raw,context), fieldView(raw,context),
lunarWindow(calendar,lastHarvestOccurrence). Contract specifies start/end
interval semantics, absence-preserving loading, no offline simulation, action
exclusivity, known-only projection and Effects-off handling. No VFX emitted.

## Checks

Evidence is in the assigned worktree [checks directory](/Users/weiwei/code/yair-absorb-all-20261014/p23-field-familiarity/docs/gm/dispatch/absorb-all-2026-10-14/checks/p23-field-familiarity/). Relative evidence paths below resolve from the mirrored worktree report.

C1: `node --test tests/p23-field-familiarity.test.js`: **14/14 PASS**, zero failures,
skips/cancellations; `../checks/p23-field-familiarity/focused.tap`. Initial run
had one failure: open-window projection retained native Game_Time methods. It now
returns plain date fields; final focused run passes. Module SOURCE evidence only.

C2: `npm run build`: **PASS**; `../checks/p23-field-familiarity/build.log`.
Unregistered module is not imported by main or included in the native bundle;
baseline build pass does not establish packaged P07 gameplay. `node --check` and
scoped `git diff --check` pass.

C3: Full `npm test`: **634/635 PASS, 1 FAIL**, no skip/cancellation,
443550.416125 ms. Failure: unchanged `tests/alloy_equipment.test.js:118`,
“equipped native brace with an open road offer keeps ticking, travelling and
reloading”. Its child `generate.mjs --equipped-clock` exceeded the existing
60000 ms timeout (failure duration 61114.923875 ms) during concurrent lanes.
This is a timing inference, not a proven pre-existing functional defect. The
full run remains failed. Evidence: `../checks/p23-field-familiarity/full.tap`.
Targeted reproduction: `node --test --test-name-pattern="equipped native brace
with an open road offer" tests/alloy_equipment.test.js`: **1/1 PASS**,
18955.178083 ms, zero skips/failures/cancellations; `alloy-repro.tap`. No shared
source was changed to obtain that result. A passing reproduction does not
replace the failed full-suite record; P00 must run a green integrated suite.

C4: Fresh-origin Playwright **baseline opening-load smoke PASS**, HTTP 200,
bundle HTTP 200, zero page errors, 1366×768. Served/local SHA-256:
`598e02f54fe7db4c9a35bc79c75a754a7f8dc42eccf9fab828de8fd82e97b615`.
Evidence under `../checks/p23-field-familiarity/`: browser-baseline.json,
desktop-baseline.png, browser.cjs. Screenshot visually reviewed: fresh PLAY
opening, no changed-loop claim. First launch lacked Playwright's bundled Chromium;
installed Chrome channel used headlessly instead. No foreground/native computer
control, browser install or user profile used.

C5: Changed native loop, Save/reload/Export/literal-file Import, native old-save
absence and host atomic failure controls: **NOT RUN / OPEN**, P00 absent. JSON
serialization is not literal native import evidence.

## Integration risks and remaining gates

R1: Available wave-1 reports read: p23-ui-polish (fd737f8a), upstream-dev and
air-workshop. Their shared presentation/dialogue/main changes mean P00 must adapt
hooks against the merged candidate. Life-loops report/transfer and reveal-chain
report were not yet available at last inspection. Their areas remain untouched.

R2: P14 owns C2 replenishment. P07 has a separate authored lunar occurrence; P00
must not also award C2 search/ordinary herbalism loot for this job. Familiarity
is elapsed time, not kill/clear settlement; native clear rewards remain intact.

R3: Full-suite green gate and native integration acceptance remain OPEN. P00 must earn discovery, show
open/closed/next windows, harvest two native cycles, learn through both activities,
use the faster option, and exercise pending/settled Save/reload/export/literal-file
import plus aborted/stale receipts on its rebuilt desktop candidate. Coordinator
may assemble a candidate; COMMON forbids final merging unverified gameplay.
After technical gates, **Weibao play/taste** is the authoritative remaining gate.
No proposal here changes accepted owners or grants new scope.
