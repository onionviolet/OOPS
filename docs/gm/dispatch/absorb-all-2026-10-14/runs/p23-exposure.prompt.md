Coordinator assignment (2026-10-14): your worktree and branch exist (base 0216ccde, node_modules symlinked) and your proposed port is reserved. Weibao authorized launching wave 2 without waiting. Wave 1 lanes (see runs/SESSIONS.md) may still be running: do not wait for them. Build your feature module, tests and contracts against 0216ccde now; read wave-1 reports as they land. Where you need a shared-file hook, write the exact request into your report for P00 (p23-host-joins, launched after wave 1 merges) and mark the native loop implemented-unverified rather than editing P00 files.

### P02: Passive Famine and optional storm/gust exposure (M)

You are lane `p23-exposure` of absorb-all wave 2. Follow `/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/absorb-all-2026-10-14/COMMON.md` exactly. This prepared prompt is not implementation started by the audit lane.
Worktree: `/Users/weiwei/code/yair-absorb-all-20261014/p23-exposure`. Branch: `absorb-all/p23-exposure`. Proposed port `18821` must first be reserved by the coordinator. Report: `/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/absorb-all-2026-10-14/reports/p23-exposure.md`; companion ledger `p23-exposure.ledger.json`.

Read AGENTS.md, PROJECT.md, USER_VISION.md, LIFE_SIM_NORTH_STAR.md and each current owner for R09, R10, N01. Input: `/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/absorb-all-2026-10-14/reports/p23-reaudit.ledger.json`, pinned HTML and R1–R5/mod reader notes named there. Proto23 source/mod code and assets are inspiration only: copy none.

Exclusive writes: `src/absorb_e1/pacing.js`, `src/absorb_e1/panel.js`, `src/weather.js`, `src/absorb_p23/exposure/`; `tests/p23-exposure*.test.js`; `docs/gm/dispatch/absorb-all-2026-10-14/checks/p23-exposure/`; own report/ledger. Other named owners are read-only. No main-checkout game writes, preserve unrelated state. Verify live HEAD and actual reservations before work; wait for wave1 reports/ownership transfer and do not redo d49cb911/379007d7 features.

Dependencies / stop conditions: P00 publishes native skill/time/context hooks; no second clock. Do not modify active derived-snapshot/branch-clock owners.

Implement: Read food accepted direction and pacing.js before proposing rates. Underfed eligible played minutes accrue small positive fractional Famine XP without activity. Add one optional storm/gust exposure profile with shelter, visible risk and an explicit hazardous-mode switch. Default ordinary food/weather behavior remains compatible; no hunger death.

Pass condition: Idle underfed time gains XP; fed/nonfeeding-body controls do not. Storm outside versus shelter and gust/rest state differ. Pending phase/remainder survives reload and literal import; mode off has no new penalty.

Shared host contract: P00 alone edits shared registrations, main/display/items/skills/activities/calendar/save/workspace connections. Return concrete signature/input/output/preflight requests to P00 and wait for native integrated candidate; never cross-edit. Use native played clock/custody/discovery/resource owners. Optional absent state preserves old saves, schema validation rejects before mutation. Idempotent settlement per real event is required; no fixed lifetime once limits. Known-only and sealed-secret disclosure, Effects-off master switch, 1366×768 desktop first, mobile deferred.

Full COMMON gate: `npm run build`, focused tests, full `npm test` with exact count/failures, fresh-origin desktop Playwright of the changed native loop and Save/reload/export/literal-file import for persistence. Record tested served bundle hash and evidence. A fixture or uncoupled module is not native gameplay; missing host integration remains implemented-unverified with P00 dependency. Coordinator must not final-merge failing/unverified gameplay lanes.

Commit small task-only changes on the assigned branch, no Co-Authored-By, no dist unless separately instructed, no push/merge by lane. Return per-row dispositions, compatibility decisions and exact commit/check evidence. Keep unexercised paths OPEN; remaining authoritative acceptance after technical gates is Weibao play/taste. Do not edit original/audit ledgers, user saves or raw sources.
