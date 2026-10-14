Coordinator assignment (2026-10-14): your worktree and branch exist (base 0216ccde, node_modules symlinked) and your proposed port is reserved. Weibao authorized launching wave 2 without waiting. Wave 1 lanes (see runs/SESSIONS.md) may still be running: do not wait for them. Build your feature module, tests and contracts against 0216ccde now; read wave-1 reports as they land. Where you need a shared-file hook, write the exact request into your report for P00 (p23-host-joins, launched after wave 1 merges) and mark the native loop implemented-unverified rather than editing P00 files.

### P04: Portable aura and a growing owned weapon (M)

You are lane `p23-living-gear` of absorb-all wave 2. Follow `/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/absorb-all-2026-10-14/COMMON.md` exactly. This prepared prompt is not implementation started by the audit lane.
Worktree: `/Users/weiwei/code/yair-absorb-all-20261014/p23-living-gear`. Branch: `absorb-all/p23-living-gear`. Proposed port `18823` must first be reserved by the coordinator. Report: `/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/absorb-all-2026-10-14/reports/p23-living-gear.md`; companion ledger `p23-living-gear.ledger.json`.

Read AGENTS.md, PROJECT.md, USER_VISION.md, LIFE_SIM_NORTH_STAR.md and each current owner for R12, R33, N10. Input: `/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/absorb-all-2026-10-14/reports/p23-reaudit.ledger.json`, pinned HTML and R1–R5/mod reader notes named there. Proto23 source/mod code and assets are inspiration only: copy none.

Exclusive writes: `src/absorb_c1/accessories.js`, `src/absorb_e2/durability.js`, `src/native_equipment_transaction.js`, `src/absorb_p23/living_gear/`; `tests/p23-living-gear*.test.js`; `docs/gm/dispatch/absorb-all-2026-10-14/checks/p23-living-gear/`; own report/ledger. Other named owners are read-only. No main-checkout game writes, preserve unrelated state. Verify live HEAD and actual reservations before work; wait for wave1 reports/ownership transfer and do not redo d49cb911/379007d7 features.

Dependencies / stop conditions: P00 owns item registration, kill fanout, native modifier and shared save wiring; P08 reads E2 APIs only.

Implement: Read E2 identity/custody and C1 equipment projections. Implement one original day/night/light utility and one kill-growth item from native kill events. Add one equipped resource collector plus explicit spend consumer. Use stable per-copy fields and derived modifiers, not arbitrary foreign closures/global callback bags. No changes to crafting transaction files.

Pass condition: Two identical owned copies stay independent. Equip/use/kill increases the intended copy only; unequip stops its effect, re-equip does not add subscriptions. Day/night aura changes from native time; collector spend reduces real resource and does useful work. Full old-copy/new-copy import controls.

Shared host contract: P00 alone edits shared registrations, main/display/items/skills/activities/calendar/save/workspace connections. Return concrete signature/input/output/preflight requests to P00 and wait for native integrated candidate; never cross-edit. Use native played clock/custody/discovery/resource owners. Optional absent state preserves old saves, schema validation rejects before mutation. Idempotent settlement per real event is required; no fixed lifetime once limits. Known-only and sealed-secret disclosure, Effects-off master switch, 1366×768 desktop first, mobile deferred.

Full COMMON gate: `npm run build`, focused tests, full `npm test` with exact count/failures, fresh-origin desktop Playwright of the changed native loop and Save/reload/export/literal-file import for persistence. Record tested served bundle hash and evidence. A fixture or uncoupled module is not native gameplay; missing host integration remains implemented-unverified with P00 dependency. Coordinator must not final-merge failing/unverified gameplay lanes.

Commit small task-only changes on the assigned branch, no Co-Authored-By, no dist unless separately instructed, no push/merge by lane. Return per-row dispositions, compatibility decisions and exact commit/check evidence. Keep unexercised paths OPEN; remaining authoritative acceptance after technical gates is Weibao play/taste. Do not edit original/audit ledgers, user saves or raw sources.
