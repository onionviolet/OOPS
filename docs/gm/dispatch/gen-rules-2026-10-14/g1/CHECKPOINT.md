# G1 checkpoint

2026-10-14. Owner: this G1 run, branch `gen/g1-kit`, isolated worktree
`.claude/worktrees/gen-g1-kit`. Starting HEAD `12179d0f`, clean worktree.

Scope: new `src/gen_kit.js`, new `tests/gen_kit.test.js`; this folder's
CHECKPOINT and REPORT only. No existing generator edits, merges, builds,
pushes, saves, private packs or gameplay claims. COMMON and root rules read.
Root rules remain proposals under PROJECT and USER_VISION authority.

Read-only references read: P1 `src/seeded_streams.js` and its tests; P3
`src/storylet_deck.js` and content for the report's proposed caller example.
P1 uses uint32 roots, FNV multiplication and mix32; G1 will retain those
arithmetic conventions with a second hash lane, full UTF-16 input and
canonical addressed draws. Seven current xorshift sites found, report pending.

Complete: 194-line pure kit and 309-line tests committed as `adaa4e18`
(`Add pure addressed generator kit and tests`) on `gen/g1-kit`.
Focused `node --test tests/gen_kit.test.js`: 27/27 pass. Full `npm test`
run once: 661/661 pass, zero failures/skips/cancellations/todos.
Staged diff check passed; only the two named new code paths committed.
Report's 15-line P3 proposal example passed a quote/accept source smoke check.

[REPORT](REPORT.md) contains API docs, seven untouched dedupe targets,
P1 compatibility differences, the P3 proposal and verification limits.
Main-checkout lane docs remain unstaged as COMMON requires. No merge,
push, build, save mutation or native gameplay claim. Root review and a
separately authorized live generator port remain open; E1/P1 owns live
roots/storage and future save-envelope integration.
