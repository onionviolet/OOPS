# Absorption checkpoint

IDENTITY: Master GM, 2026-10-11, revision 15.
OBJECTIVE: Execute GM_PROMPT.md phases 1–4, Parts A–E; final push to origin/codex/gameplay-foundations authorized by that prompt.
OWNERSHIP: Root integrates shared source, persistence, generated dist, index/style and global docs. Unrelated root PNG preserved; private saves untouched. Prior detached session stopped; inherited preview replaced with server at 18512.
PROGRESS: Part A resolutions reviewed against HEAD and f0e32c20. Retained defensive recipe mapping, Springsteel extensions and existing guild ID. npm test 279/279, rebuild and disposable browser old-save/Motherwood/Primeval forest/save/reload/import pass. Evidence: evidence/A-browser.json and A-motherwood.png.
RESUME: Commit Part A, create isolated worker worktrees off that commit. Reserve worker paths before dispatch. All workers use proposals; no dist, global docs or shared source edits.

## Phase 2 reservations

Base commit: c83bd819. Each worker owns only the following paths in its isolated checkout. Root owns every other path and integration.

| Worker | Checkout | Exclusive paths | Status | Agent ID |
|---|---|---|---|---|
| W-B | /Users/weiwei/code/absorb-2026-10-11-workers/b | src/absorb_b/**, tests/absorb_b.test.js, docs/gm/dispatch/absorb-2026-10-11/W-B.md | verified (native housing; other branches in backlog) | /root/furniture |
| W-C1 | /Users/weiwei/code/absorb-2026-10-11-workers/c1 | src/absorb_c1/**, tests/absorb_c1.test.js, docs/gm/dispatch/absorb-2026-10-11/W-C1.md | verified (craft/luck/cooking; other effects in backlog) | /root/accessories |
| W-C2 | /Users/weiwei/code/absorb-2026-10-11-workers/c2 | src/absorb_c2/**, tests/absorb_c2.test.js, docs/gm/dispatch/absorb-2026-10-11/W-C2.md | verified (core journey; alternatives in backlog) | /root/discoveries |
| W-D | /Users/weiwei/code/absorb-2026-10-11-workers/d | src/absorb_d/**, tests/absorb_d.test.js, docs/gm/dispatch/absorb-2026-10-11/W-D.md | verified (core chain; alternatives in backlog) | /root/fork_patterns |
| W-E1 | /Users/weiwei/code/absorb-2026-10-11-workers/e1 | src/absorb_e1/**, tests/absorb_e1.test.js, docs/gm/dispatch/absorb-2026-10-11/W-E1.md | verified (core toggles/food/weather/sleep; alternatives in backlog) | /root/hunger_weather |
| W-E2 | /Users/weiwei/code/absorb-2026-10-11-workers/e2 | src/absorb_e2/**, tests/absorb_e2.test.js, docs/gm/dispatch/absorb-2026-10-11/W-E2.md | verified (copy/wear/repair/armor/storage failure) | /root/durability |
| W-E3 | /Users/weiwei/code/absorb-2026-10-11-workers/e3 | src/absorb_e3/**, tests/absorb_e3.test.js, docs/gm/dispatch/absorb-2026-10-11/W-E3.md | verified (earth native comparison; alternatives in backlog) | /root/elements |

Integration order: B, C1, C2, D, E1/E2/E3. Each worker commits owned paths locally and supplies hook/save/UI notes and focused plus full-test evidence. Root reviews actual diffs then tests/builds/browser/save/reload/imports each part before commit.

Phase 1 merge commit: c83bd819. Phase 2 active with seven workers; root reading shared integration seams while workers build. No worker owns shared native files.

Phase 3: B integrated, tests284/284, build, fresh disposable browser housing/sleep/save/reload/import passed. Worker commits: B d54bf106; C1 49e098fb+a2000678; C2 79e619be+ad903e2c; D7749e1f9; E1fd89f0c8; E2db93e46a; E34e66ad9d. Worker full suites had host contention timeouts; C1 serialized285/285, C2 serialized287/287. E2 earlier284/284; D/E1/E3 full retries still pending. Root integration suite is serialized. Next C1. New unrelated untracked docs/gm/AUDIT_RECONCILIATION_METHOD_2026-10-11.md preserved.

C1 integrated: native item/recipe registration; crafting success/drop/trader margin consumers; portable cooking shared tier gates; live custody-filtered equipment reader. Browser found final recipe hidden by Exit, fixed list padding and initialization refresh. Root tests290/290, build and all-four craft/luck/portable cooking/save/reload/import pass. Next C2 repaired worker commit bd88a15a after79e619be+ad903e2c.

C2 integrated and repaired unsupported-save rejection/panel reattachment. Native calendar is the common played clock even while expansion clock dormant. Claims/rewards/costs/XP publish through persistExpansion after durable save. Tests299/299, build, bread/find/poison/runner/save/reload/import browser pass. Furniture redraw regression fixed. Concurrent unrelated global planning-doc changes are preserved in worktree; PROJECT index rebuilt from Part A baseline plus wave proposal section to remove accidental unrelated inclusion from B commit. Next D7749e1f9+81ba26c4. E1 serial291/291 notee6c65732, E3 serial284/284 note16bb9ef8.

Phase 3 D: registration, journal observers, read-gated clear hints and native board/quest integrated. Root307/307 tests passed. Registrar placeholder repair761fde39 included. Browser currently actual Fort combat chain in progress (strong generated hero, original native opening inventory untouched outside fixture). Worker E1/E3 serial full suites now pass; all workers idle, available for repairs. User mod-fork followup answered as proposals in MOD_FORK_CONSIDERATIONS.md, no expansion of runtime scope. Next E1, E2, E3 after D gate.

D gate passed: actual two yard clears, salvage, native smelting, repair, two funded board hand-ins, cellar clear/native quest ledger, journal/known marker, save/reload/import. Root307/307 tests. Fixed inherited first-clear event attribution after reward travel and hidden safe-location NaN counter. D browser uses strong generated hero and deterministic smelting, not natural balance evidence. Next E1fd89f0c8+e6c65732; E2db93e46a; E34e66ad9d+16bb9ef8.

E1 integrated: pacing_e1 schema1, runtime elapsed marker derived from native calendar (no second clock), staged within common persistence once per consumed minute. Defaults hunger/weather off; home-world scope, optional-pack play pauses meters. Root319/319 tests/build/browser independent toggles, repeated food, fog->rain/Wet, sleep drain, disabled freeze and exact state/XP reload/import pass. Next E2db93e46a.

E2 gate passed: root325/325 tests/build, browser two same-quality steel copies distinct IDs, actual hit wear99.92, repair1 coin, damaged native defense5.2 versus full14, save/reload/import independent copies, injected failed repair write leaves money/condition unchanged. Shared v0.6 loader now preserves identified keys and hydrates after inventory decode; exact+canonical custody guard protects dispositions. Native armor regression9ef8a719 included; no speculative getStats scaling. Next E34e66ad9d+16bb9ef8.

E3 gate passed: root330/330 tests/build; native settings, observed boar affinity, matching cape4% earth, identical16 real hits reduce health loss1152->1120, save/reload/import persist option/gear. Fixed inherited hit/critical-taken counter NaN from undefined enemy main_character tags. Defaults all four pacing options off. Phase 3 done; Phase 4 next: combined fresh-origin one-context journey A–E, final pre-merge bundle save compatibility, REPORT/backlog and push origin/codex/gameplay-foundations. Remote checked0b85be4f is ancestor; no force push. Concurrent unrelated docs remain unstaged/untouched.

Phase 4 combined reached all parts and reload, then import preflight rejected a cosmetic duplicate Waypost quest display warning. Diagnosed actual generated export with primary-loader warnings: completed-book unlocks start quest before saved active quest restore. src/quests.js.startQuest now idempotent for already-active quests; preflight remains strict. Durability panel render fingerprint now includes combat/busy/writable state so Repair re-enables after leaving combat. Root330/330 final tests/build pass after both fixes. Actual combined export file import retest and full combined rerun underway; generated debug fixture /tmp/absorb-combined-generated-save.txt. Final report/push remain pending.

Phase 4 PASSED: full combined A-E journey at18514 with all optional settings together plus save/reload/file import; final actual pre-merge bundle save retained inventory/money/XP/career/packs/schema/location, all new pacing off. Final330/330 tests/build; source map407 native files matches; bundlee8681b6bce6c. REPORT.md written, all unplayed branches in ACCEPTANCE_BACKLOG.md. Next: commit final shared fixes/scripts/report, push origin/codex/gameplay-foundations, record confirmed source delivery, docs-only commit/push and verify remote HEAD. No source work remains.

COMPLETE: All four phases passed. Source/report commitdb2f1abd pushed toorigin/codex/gameplay-foundations; ls-remote verified exact db2f1abd805c18a3bc7a365a14b100f92cc5e616. First HTTPS push408 left remote unchanged; SSH lacked authentication; command-local HTTP/1.1+100MiB post buffer succeeded with existing HTTPS auth. Source/build/330 tests/combined/old-save proofs complete, all optional settings default off, remaining human/unplayed gates in backlog. This documentation finalization is the only pending commit/push; no source work remains. Other planning docs/PNG are preserved. Worker branches/worktrees retained for inspectable provenance.
