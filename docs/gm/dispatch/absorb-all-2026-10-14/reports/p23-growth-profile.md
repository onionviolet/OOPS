# P18 world/body growth profile, 2026-10-14

Status: **implemented-unverified native gameplay; P00 joins required**. Module
implementation is committed; the full suite has one existing fixture timeout. Not ready for
final gameplay merge. No push/merge by this lane.

F1: Clean lane started at `0216ccdefcfce79877378f8cb0ee41129fe11c5d` on
`absorb-all/p23-growth-profile`. Exclusive paths and port 18836 are authorized by
the coordinator assignment in `runs/p23-growth-profile.prompt.md`; listener was
absent before starting this lane's server. Actual session roster lists lane
`01a138b9-1945-7593-bf09-e046b6b8ae82`. No shared source transfer was assumed.
The later launch instruction supersedes the packet's wait-for-wave1 wording.

F2: Read AGENTS.md, PROJECT.md, USER_VISION.md, LIFE_SIM_NORTH_STAR.md,
ABUSE_AND_LIMITS.md, SKILLS_AND_TALENTS.md, W18 in WORLD_GROWTH_AUDIT.md,
Proto23 WORLD_BRIEF/IDs, models/skill.js, levelable_component.js,
energy_resources.js, skill_expansion_host.js and native reading/XP consumers.
Checked pinned HTML's R21 skill flow and N04 consumable spans plus R1–R5 reader
coverage and relevant M2 S3/M3 S45/N2 31–32 mod notes. Pinned HTML hash matches
`a43e55e2eeb455f1c1ae589e3fc074a588813fe6cd57cfba827dcf923f3755d5`.
No foreign code/assets or raw source copied. Mod raw runtime was not re-audited.

F3: Proposed optional `p23.visitor.study_body` is bound to actual body ID and
`reference.proto23.village`. Original iterative exponential curve affects only
local `p23.study_conditioning`. All native capped defaults remain unchanged.
A repeatable owned tonic proposes +2 native `max_health`, no implicit heal.
Two consumptions yield exactly +4 in the module projection. Quiet conditioning
can earn one local XP per eligible played reading minute; resource/body/action
conflicts pause truthfully, with no blocked/offline catch-up or global bypass.

| Row | Disposition | Landing and remaining native gate |
| --- | --- | --- |
| R21 | Adapted source, implemented-unverified | `profile.js`: finite integer awards, saved pending continuation, milestones 2/5/10 once each, bounded iterative settlement and duplicate receipt guard. Native skill registration/event/settlement UI pending P00. |
| N04 | Adapted source, implemented-unverified | `profile.js`: funded acquisition quote, repeat native-item consumption plan, cumulative body-bound replaceable max-health source. Native shop/item/stat-source/save joins pending P00. |
| N30 | Adapted source, implemented-unverified | `profile.js`: default-off eligible reading/background plan on shared played clock, explicit conflicts and generic blocked reasons. Native scheduler/reading/control join pending P00. |

D1: Optional `p23_growth_profile` schema1 is absent for old saves. Validator
returns undefined unchanged; no initializer on ordinary load. All serialized
numeric values are finite safe integers. Unknown schemas/fields, malformed
pending state and inconsistent level reject before mutation. Existing native
XP/save/resource/item records are not changed by the module. BigInt is used only
for threshold arithmetic; an unrepresentable next threshold renders as null,
not Infinity or a lifetime cap. No receipt-array growth or fixed once limit.

D2: Each function returns a pure transaction plan. P00 must commit optional
state, native items/stock/money and replaceable stat source atomically under
native custody. On reload, replace the absolute stat source, never reapply a
reward delta or insert a second copy in native skill-milestone stats. Dormant
outside matching world/body/profile; prior progress remains available on return.

A1: Source commit `94296e29af4ca784f9832f59387b7e965d2e8a9e`,
"Add optional body growth profile and repeatable tonic contracts". No
Co-Authored-By trailer. Native hooks are specified in
[HOST_CONTRACT.md](../../../../../src/absorb_p23/growth_profile/HOST_CONTRACT.md).
No edits to P00 registrations/main/display/items/skills/activities/calendar/save/
workspace files, P12 cultivation trial, other lane paths, original ledgers, user
saves or sources. Existing d49cb911/379007d7 UI features retained, not redone.

A2: `node --test tests/p23-growth-profile.test.js`: **15/15 pass**, 0 failures.
Covers absent old optional state, eligibility, two funded acquisitions/two exact
consumption deltas, 250 repeat uses, unsupported bodies/profiles, pending and
completed reload, 150000 and MAX_SAFE_INTEGER finite XP, milestone/replay guards,
reading minutes, conflicts, malformed-state rejection, and literal JSON fixture
roundtrips preserving an entire example old envelope. These fixtures are not
native game import proof. Evidence: `checks/p23-growth-profile/focused.txt`.
`git diff --check` passes. Full `npm test`: **636 tests, 635 pass, 1 fail, 0 skipped/cancelled**;
365977.94125 ms. Failure: existing `tests/alloy_equipment.test.js:118`,
"equipped native brace with an open road offer keeps ticking, travelling and
reloading", fixture command `generate.mjs --equipped-clock`, elapsed60898 ms
against its60000-ms child-process limit. Its test/source are unchanged by P18.
This is an observed full-suite failure, not a passing gate. Isolated rerun of exactly that unchanged case passed **1/1**, 0 failures,
18365.548417 ms (test16558.639708 ms); evidence `alloy-rerun.txt`. The rerun
supports a contention-related timeout explanation but does not relabel the full
suite as passing. No out-of-scope fixture/test timeout edits were made.

A3: `npm run build` passes (including Ink parity). Rebuilt bundle SHA256
`598e02f54fe7db4c9a35bc79c75a754a7f8dc42eccf9fab828de8fd82e97b615`.
Playwright fresh isolated Chrome context at `http://127.0.0.1:18836/`,
1366×768: HTTP200, exact served/local bundle hash, no page errors, native PLAY
entry renders and P18 controls are absent. `browser.json`, `desktop.png` and
`browser.cjs` record **baseline entry smoke only**. First bundled-Chromium launch
failed because its executable was absent; installed headless Chrome succeeded.
No foreground browser/profile was used. No dist/cache stamps committed; the generated tracked source-map change was restored to its pre-build state.

## Exact shared joins and ownership

P00: use `HOST_CONTRACT.md` as the signature/input/output/preflight contract.
It includes live-context derivation, native acquisition and consumption custody,
ordered event sequences, saved pending-award settlement, default-off
conditioning scheduled once per eligible reading minute, replaceable native
flat stat source, optional save/import validation and known-only projection.
Register only after reconciling current Proto23 world/body/profile ownership.
The module never writes native energy reserves or bypasses energy predicates.

Read wave1 reports as landed: upstream-dev's native dialogue/skill additions,
p23-ui-polish's display/focus/equipment/weather changes, fork-fort's still-open
route gates and air-workshop's opt-in optional domain/native save work and fork-resurvey's known discovery views. No lane source
was copied or changed. Reveal-chain/life-loops reports were absent at last check;
P00 must reconcile their eventual discovery/scheduler/save joins. P12 cultivation
trials remain separate. No merge conflicts in exclusive source area expected;
shared joins and optional-domain ordering are P00's integration risk.

## Acceptance backlog

Native tonic acquisition/two consumes, exact max-health totals, unsupported-body
control, earned large-XP event/milestones, real reading/background positive,
conflicting native action/resource control, Effects-off/known-only desktop UI,
failed-save no-charge and Save/reload/export/literal-file import of full old,
pending and completed envelopes are **OPEN**, owned by P00 integrated candidate.
An uncoupled module does not fulfill native gameplay. Coordinator must not
final-merge this lane as verified gameplay while these gates remain open.
After technical integration gates, remaining authority is Weibao's play/taste
for original method fiction, tonic cost/strength and pacing. Mobile is deferred.

Evidence closeout: source remains at `94296e29`; evidence/report are committed
on this lane. Full test stdout has trailing whitespace normalized only. All check records live under
`docs/gm/dispatch/absorb-all-2026-10-14/checks/p23-growth-profile/`. Main checkout
received only this lane's report and companion ledger. Assigned HTTP server is
stopped after evidence collection; no shared worker was stopped.
