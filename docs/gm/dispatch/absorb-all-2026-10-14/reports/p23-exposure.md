# P02: Passive Famine and optional storm/gust exposure, 2026-10-14

Status: **IMPLEMENTED-UNVERIFIED native gameplay. Do not final-merge as a passing gameplay lane.**

Lane `absorb-all/p23-exposure`, worktree `/Users/weiwei/code/yair-absorb-all-20261014/p23-exposure`, live base `0216ccdefcfce79877378f8cb0ee41129fe11c5d`, initially clean. The coordinator assignment explicitly confirms port 18821 reservation and permission to build wave 2 now without waiting for wave 1. No listener on that port was present before this lane served its build. Shared owners are untouched; this lane adds only its exposure module, tests, checks and report/ledger. No package installs, source copies, user saves, pushes or merges.

## Authority and outcome

Accepted ordinary food direction and passive XP correction are in current main-checkout `docs/USER_VISION.md#food-benefits-and-famine-consideration-2026-10-13` and `docs/HUNGER_AND_BODILY_NEEDS_CONSIDERATIONS_2026-10-13.md`. The latter is not present at this prepared base, so it was read in the main checkout without mutation. E1's current default-off settings, eight-hour fullness drain, 80–100% optional hunger efficiency and native food behavior are preserved. LIFE_SIM_NORTH_STAR remains a proposal; this module does not add a second time engine or universal bodily need. Only explicitly eligible home bodies and played time train.

D1: Reversible numeric proposals: underfed means fullness <=20, Famine earns 0.01 XP per eligible played minute, and level 40 mitigates up to five percentage points of the existing optional loss. No active-action prerequisite, health damage, hunger death, retroactive history or extra meal bonus. Exact threshold crossing is integrated; sub-cent pending XP survives serialization because native `Skill.addXp` rounds awards to cents.

D2: One explicitly selected hazardous storm/gust profile, default off: six-minute gusts, twelve-minute rests. Exposed gusts cost up to 0.2 stamina/minute, train existing Cold resistance at 0.02 XP/minute and project -3C; native resistance reduces cost. Shelter blocks cost/XP/temperature while rhythm continues. Mode/weather/body/world/offline controls freeze the profile and add no penalty. This is an original deterministic resource-risk adaptation, not Proto23's random lethal lightning implementation. No RNG state is needed.

D3: The cursor is a native-event settlement watermark, not a clock. Contiguous real events keep training indefinitely, replay returns zero deltas, overlaps/gaps reject. No lifetime once limit. All proposed native deltas must share the existing durable transaction with state and clock; P00 alone implements that join.

Target 1366×768 desktop, visible outcome: an explicit hazardous-mode checkbox with shelter/risk/phase/time and known-skill progress text. Mobile deferred. Text only, no VFX or Effects-off bypass. No sealed truths are used or disclosed. Unknown Famine names are suppressed by the panel until the host reports discovery.

## Per-row disposition

| Row | Disposition | Source binding / implementation / remaining gate |
| --- | --- | --- |
| N01 | Original module implemented, native unverified | Pinned HTML 2029–2039, 7321, 13869–13873; passive underfed suffix and saved fractional remainder in `src/absorb_p23/exposure/exposure.js`; native Famine registration, idle XP/discovery/benefit/persistence OPEN for P00 |
| R09 | Adapted as optional nonlethal storm/gust resource risk, native unverified | R1 weather section / pinned HTML 911–922; explicit opt-in, outside/shelter and native resistance contract; random lethal lightning not copied or claimed; native resource/temperature integration OPEN |
| R10 | Original gust/rest rhythm implemented, native unverified | R1 weather section / pinned HTML 13610–13623; saved phase and remaining duration driven only by supplied played interval; native weather and pending literal Import OPEN |

Pinned HTML sha256 `a43e55e2eeb455f1c1ae589e3fc074a588813fe6cd57cfba827dcf923f3755d5` matches reaudit ledger. R1 and matching R2–R5/mod reader bindings were inspected; original source/mod code/assets copied: none. Existing d49cb911/379007d7 UI features are not redone.

## P00 exact requests

The complete signature/input/output/preflight requests are in [HOST_CONTRACT.md](/Users/weiwei/code/yair-absorb-all-20261014/p23-exposure/src/absorb_p23/exposure/HOST_CONTRACT.md), joins J1–J5:

- J1 native Famine registration and bounded hunger-factor benefit.
- J2 atomic native skill XP, cent remainder and cursor publication, using native known-only discovery.
- J3 optional `p23_exposure` save envelope, full preflight before mutation and clock agreement.
- J4 existing resource-owner stamina settlement and one weather temperature projection, zero HP damage.
- J5 guarded synchronous Settings mount/toggle, settle old context first, desktop result.

`stageExposure(raw, {start,end}, context)` returns `{state,skillXp,staminaCost,underfedMinutes,gustMinutes,replayed}`. Context carries start-of-interval E1 pacing, native played/home/body/shelter applicability and native resistance. Split at every context change. Save, native skills/resources and cursor must be one atomic publication. Never award XP separately after saving.

Compatibility: absent optional field stays absent in old saves; runtime defaults are safe and do not invent past progress. Schema 1 only; malformed state and unsupported schema throw before mutation. E1 schema and all shared files remain unchanged. Pending phase/remainders are additive, not a replacement of existing fullness/weather/native skill state. Import clock and cursor together. P00 must validate the entire native envelope before loading any owner.

## Evidence

Evidence directory: `docs/gm/dispatch/absorb-all-2026-10-14/checks/p23-exposure/` in this worktree.

E1: `node --test tests/p23-exposure.test.js tests/absorb_e1.test.js`: **28/28 pass**, 0 fail, 0 skipped. Includes 16 new behavioral tests and 12 inherited E1 regressions. Covers eligible idle XP, sub-cent accumulation, threshold crossing, fed/nonfeeding/offline controls, replay and later events, overlap/gap rejection without mutation, mode off, shelter/resistance, gust/rest, long-step segmentation, pending JSON restoration, invalid schemas, bounded benefit and panel rollback.

E2: `npm run build`: PASS. No dist committed. This build does not include uncoupled exposure modules, which is why native changed-loop gates remain OPEN.

E3: `npm test` was attempted and stalled at 55 completed tests; only this lane's test processes were interrupted. A retry with options appended by npm did not apply Node runner controls and also stalled. The complete bounded equivalent `node --test --test-concurrency=1 --test-timeout=30000 tests/*.test.js` exited 1: **608 tests, 606 pass, 0 fail, 2 cancelled, 0 skipped** (241,668 ms). Timeout cancellations: unchanged `tests/agreed_duty_continuation.test.js` and `tests/cooling_refinement.test.js`, each at 30,000 ms. Those files do not import this uncoupled feature; a baseline code defect versus environment/timing cause is not established. Full-suite gate is NOT PASS. Exact logs, including interrupted attempts, are retained. No attempt to repair unrelated tests.

E4: Headless installed Chrome/Playwright at fresh 1366×768: isolated module controls and pending Save/reload/export/literal-file Import PASS; unsupported-schema fixture import rejects unchanged; resumed award and mode-off PASS. Screenshot `module-desktop.png` inspected. These are fixture/module results, not native save acceptance. Playwright's packaged browser was missing; installed headless Chrome was used without installing anything.

E5: Fresh native default opening smoke PASS with zero page errors; screenshot `native-desktop-smoke.png`. The native exposure panel is absent, as expected before P00. Served `dist/bundle.js` exactly equals the local rebuilt bytes: SHA256 `598e02f54fe7db4c9a35bc79c75a754a7f8dc42eccf9fab828de8fd82e97b615`, 5,100,591 bytes. `browser.json` also records served/local module hashes. No changed-positive native gameplay or native exposure Save/reload/export/literal-file Import claim.

## Merge risks and OPEN gates

R1: P00 must join the existing played clock, custody/discovery/resource/save owners; this lane edits none of them. No native registration/hook exists at this base. R2: p23-ui-polish report asks weather presentation to refresh from the integrated gameplay owner; preserve its newer display work. Existing E1 weather/hunger owners stay authoritative and unmodified. R3: p23-life-loops/reveal-chain reports were not yet present at this checkpoint; read them before P00 joins. Air/upstream/ui reports available during the lane were read for relevant shared-surface risks. No wave-1 ownership transfer is required for new exclusive module files; no wave-1 shared write was attempted.

Native OPEN: real idle Famine XP/discovery and useful effect; fed/nonfeeding/paused/offline controls; switch off; outdoor/shelter and gust/rest resource/temperature outcomes; native pending and settled Save/reload/Export/literal-file Import; old-save absence and unsupported-schema rejection before mutation; replay after restore; Effects-off and final Settings presentation. The fixture does not satisfy these gates. Coordinator may stack a candidate for P00, but must not final-merge this lane as gameplay-complete. After technical gates, the remaining authoritative acceptance is Weibao's play/taste.

Commit: source/contract commit `68c98cfe0b7ba6f85cc914b07e1098b212a37a11`; checks/report commit `3b46d94b`; reproducible served-module fingerprint harness commit `5ba2ec4f`. Worktree clean at handoff; own server stopped; no push or merge.
