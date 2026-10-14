# P16 encounter profiles, 2026-10-14

**Implemented-unverified. P06/P00 native joins OPEN. Not eligible for final gameplay merge.**
Original reversible proposal, not director acceptance.

## Authority and boundaries

Clean initial HEAD `0216ccdefcfce79877378f8cb0ee41129fe11c5d`, assigned branch
`absorb-all/p23-encounter-profiles`. Coordinator's current assignment reserves
port 18835 and authorizes module work immediately without waiting for wave 1.
Live dispatch `runs/SESSIONS.md` lists lane session
`01a138b9-0e65-7e22-81b1-a65db2b7a4b8`. Port unused before own server.
Read AGENTS/PROJECT/USER_VISION/LIFE_SIM_NORTH_STAR relevant direction; native
Enemy templates, CombatZone, combat loot publication, accessory modifier,
Proto23 visitor content/IDs and implementation status. Default campaign stays.
1366×768 desktop target: optional repeatable dojo rung, level/move/counter and
native receipt. Mobile deferred. No sealed content added or disclosed.

Input reaudit ledger; pinned HTML `e93a8cd617932fb698ff889b968a32f9a20d48f3`,
SHA256 `a43e55e2eeb455f1c1ae589e3fc074a588813fe6cd57cfba827dcf923f3755d5`;
R1–R5 and six Xeus24 reader notes' relevant mechanism references reviewed.
No foreign code/assets copied. `d49cb911`/`379007d7` features not redone.

## Dispositions

| Row | Decision | Landed module; native limit |
| --- | --- | --- |
| R34 | unpark, implemented-unverified | Seeded levels 1–3, immutable authored stat bands, fresh native Enemy specification; native group/resume hook OPEN. |
| R60 | adapt, implemented-unverified | One repeatable reed-circle rung factory in original existing visitor dojo; registration/travel OPEN. No full source progression spine or instant-travel replacement. |
| N09 | adapt, implemented-unverified | Area eligibility, pending rank and native luck modifier; one seeded Piece of willow wood draw. Actual loot commit/receipt/rollback OPEN. |
| N11 | unpark, implemented-unverified | Stable Reed sweep preview, live Defensive Measures counter, one-exchange target-local status plan; native intent/cooldown/stat hooks OPEN. |

Source: `src/absorb_p23/encounter_profiles/profile.js`.
[Concrete host requests H1–H5](../../../../../src/absorb_p23/encounter_profiles/HOST_CONTRACT.md)
contain signatures, input/output, admission and publication preflight.
No import-time registrations or shared-file edits. No custom hit/crit math,
shared dummy, extra clock or unseeded repeated rolls. Native constructor doubles
in tests prove fresh specifications, not native runtime construction.

## P00 integration and compatibility decision

H1: inject native Enemy/CombatZone/live dojo; only explicit original-branch
training travel invokes factories. Seed comes from saved native RNG atomically
with pending admission. Restore uses same pending enemy. Normal native travel,
body, resource, custody and discovery owners apply.

H2: P06 supplies real exchange/cooldown preview and target-local temporary stat
hook. `previewExchange` reads without mutation/reroll; `planExchange` resolves
once using live eligible stance. Returned off-balance attack-points modifier is
local to player versus this construct and expires next exchange or on leaving.
No native status is applied yet. Effects-off suppresses any future cue, ordinary
known intent/counter text remains. No extra timer.

H3: real kill ID `p23.reed-circle:<attempt>:kill`, actual rank and native
custody-filtered drop modifier enter `planSettlement`. Serial/CAS preflight
combines area/creature loot in ONE existing native inventory/acquisition/XP/
kill-progress/receipt transaction with profile state. Duplicate skips the entire
occurrence. Failed durable write publishes nothing; retry keeps the same draw.
Plan alone does not insert inventory or publish receipts. Finish/abandon retires
that event, and later attempts remain repeatable without lifetime once limits.

H4: suggested optional field `p23EncounterProfile`, absent/inert on old saves;
create only after explicit rung selection. Strict copied schema-1 reader rejects
unknown fields/schema, bad seeds, nonfinite cursors and inconsistent level before
mutation. P00 must validate full envelope and preserve native health/cooldown/
intent with profile. Module has identity/seed/level/exchange/status/settled state,
not a second native health/clock owner. No old save migration needed for absence.

H5: two legitimate native attempts, authored bands, named move/counter, one
receipt per kill, repeat ladder and unchanged old templates; exact pending/final
Save/reload/export/literal-file import plus absent/malformed/rejected-publication
controls remain OPEN until integrated candidate. No fixture closes these gates.

## Verification

- Focused `node --test tests/p23-encounter-profiles.test.js`: **13 tests, 13 pass,
  0 fail**. Bands across 200 seeds, cloned specs, stable intent/counter, strict
  admission, rank/luck, deterministic restore/settlement, duplicates and repeat.
- `npm run build`: **PASS**. This module is not registered/reached by main yet;
  baseline build compatibility does not prove feature inclusion.
- Full `npm test`: **633 tests, 632 pass, 1 fail**, 501288.452875 ms. Failure:
  `equipped native brace with an open road offer keeps ticking, travelling and
  reloading` at `tests/alloy_equipment.test.js:118`, fixture
  `docs/gm/d1-alloy-equipment-2026-10-07/fixture/generate.mjs --equipped-clock`
  subprocess failed after 60493.529583 ms (its 60-second timeout). Both files
  unchanged from base; encounter module is not imported there. Isolated failure
  reproduction **PASS: 1/1, 0 fail, 16319.092375 ms**. This supports a
  concurrent-load timeout inference; it is not a passing full-suite rerun.
  Full run loaded earlier 12-test encounter version; final 13-test focused run
  covers the added stable-preview contract and stricter settled-status validation.
- Fresh-origin Playwright at **1366×768**: native Village started, **0 page
  errors**, served/local rebuilt bundle SHA256
  `598e02f54fe7db4c9a35bc79c75a754a7f8dc42eccf9fab828de8fd82e97b615`.
  Separate browser module import/JSON restore passed. This is baseline smoke
  and module evidence, **not changed native gameplay**. Playwright cached browser
  missing; installed Chrome used in separate headless process, no user tabs.
- Native changed loop and native persistence: **OPEN** due to host dependency.

Evidence: `checks/p23-encounter-profiles/{focused.tap,full.tap,build.log,browser.json,
browser.cjs,desktop.png,alloy-reproduction.tap}`. Dist output not committed.
Wave-1 reports read as available: p23-ui-polish, upstream-dev, fork-fort and
later air-workshop. P06 report arrived later and was read: commit `a5f9d7a3` exposes optional
`encounterProfile: {id, dropChanceModifier}` and duplicate-defeat guards. This
scales existing target loot but does not itself publish area loot, intent/status
or pending native combat restoration. P00 report/candidate still absent; no
shared-file ownership transfer inferred.
P00 may adapt joins after wave 1 UI polish merges. This lane changes only its
module, tests, checks and report/ledger, so shared runtime ownership stays with
P06/P00. No main-checkout game writes, source library/user save changes, push or merge.

Source/tests/contract commit: `a561a949a7a9764fd117a182e280e2ab8e3fb102`. Evidence/report commit: `110b4ccb6230ad1b688410833692ca07e6385a19`.
Both commits are on the assigned branch; no push or merge. Final lane working
tree is clean; staged diff check passed after stripping one trailing blank
whitespace line from the captured TAP log. Own port server stopped. Technical native gates and the full-suite failure
remain open. After technical integration gates pass, Weibao's play/taste is the
remaining authoritative acceptance.
