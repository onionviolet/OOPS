# Dedup audit follow-up checkpoint (2026-10-19)

Request (Weibao, 2026-10-19): "work across all areas using parallel sonnet agents, consider every little details and everything". Interpreted as the remaining SYNTHESIS.md items.

AU1-AU15 budget: coordinator 1 (Opus) | workers: 6 Sonnet lanes (L1-L6) + 2 repair | concurrent: 6 (Weibao's "parallel" request overrides the two-at-once default for this task) | no successors beyond the repair reserve | stop: lane report delivered.

| Lane | Scope | Isolation | Owned paths |
|---|---|---|---|
| L1 | X1 + X3: shared no-import leaf helper module, hash/RNG and combat-math single source; migrate only semantically identical copies | worktree | src/ except main.js, trade.js, L2/L3 files |
| L2 | X2: one clone stack (book_world_mol_native / paradise_native) to a shared base | worktree | those two stacks + new base |
| L3 | X4: architecture ratchets bite, baselines refreshed, cycle at simulation_effects.js:50, trade.js -> main.js import, unused main.js imports | worktree | scripts/check_architecture.mjs, baselines, main.js imports, trade.js, simulation_effects.js imports |
| L4 | X1 test side: shared test harness (esbuild stub loader, fake DOM); fix crafting_native_reload checkVisibility failure | worktree | tests/ |
| L5 | X6 rule-code collisions: prefix register rule, rename colliding local tables | in place | docs (not USER_VISION, PROJECT, IDEA_INDEX) |
| L6 | X8 + X10 doc truth: stale claims, PROJECT_LOG mislabels, remaining M3 lines, world1 state conflict, unapplied queue edits, game counts | in place | docs (not RULES_INDEX, USER_VISION) |

Out of scope pending Weibao: bulk snapshot/dispatch dedupe (X9/X10 bulk), S4-F9 panel moves, merging lane branches, push.

## Results (2026-10-19)

All six lanes delivered; reports L1_REPORT.md to L6_REPORT.md (L1-L4 reports live on their branches until merged).

| Lane | Branch / place | Coordinator check |
|---|---|---|
| L1 | `worktree-agent-ac52ddffa4e1deb75` 11c0640ae, 246 files | every changed src file parses; script found no helper removed without import or redefinition (3 flags were local variables or a re-export); leaves have zero imports |
| L2 | `worktree-agent-ade1a18e0e62a2371` 7f53c0b1f | golden-output test passes; check:arch passes |
| L3 | `worktree-agent-a8c58a4ec73f617af` 11ecc0c1c | the four injected trade callbacks are hoisted function declarations |
| L4 | `worktree-agent-af3469cb234ad3a9b` bb2072901 | removed todos were stale (sites no longer call Math.random) |
| L5 | working tree, uncommitted | check:rules PASS; ICX rename consistent; renamed CX_CHEAT_CARDS.json ids have no code consumer |
| L6 | working tree, uncommitted | USER_VISION edits are link text only; other session's 2026-10-19 section intact |

Trial merge of L3, L2, L4, L1 onto HEAD 1d5ca8eed in a scratch worktree (`trial/dedup-followup-2026-10-19`). Two conflicts resolved: tests/architecture.test.js (kept both tests), src/feature_expansion_battle.js (L3's facts import plus L1's leaf imports). Combined: `npm test` 2236 tests, 2235 pass, 1 fail (R51 cooldown in p23-combat-options, flaky: also fails 2 of 4 alone on unmodified HEAD); check:arch exit 0 (6 main imports, 226 cyclic edges, no growth); check:rules PASS; build OK. Browser smoke at 1920x1080 on a fresh origin from the trial build: loads with "No issues in the loading process", only console error is the expected private_packs 404, new game starts, a mixing-counter purchase debits the purse and adds the item. Not exercised: save/reload/import (no persistence change intended; L2 save round trip covered by test), the cafe traders, Paradise full-save restore, 1366x768.

Merged 2026-10-19 on Weibao's yes: codex/gameplay-foundations fast-forwarded to baa3a3297 (trial merge); L5/L6 docs committed from own paths only, other sessions' uncommitted hunks left unstaged. No push.

Open: sealed-ID fix (L5 proposal), unapplied queue rows (L6), other clone stacks (L2 ranked list), R51 flake, headless runner village-route failure (L4), S4-F9 panels, X9/X10 bulk.

## Issue pass, 2026-10-19 (branch `claude/features-and-fixes-f490c6`)

- R51 flake: fixed. The p23 combat stub read `Date.now()` several times per start; a
  millisecond boundary shifted the delays. The stub's engine clock is frozen; 17 straight
  passing runs.
- Headless village route: fixed, not a game bug. Center mode hides `.end_dialogue_button` and
  the exit buttons by design (shared back bar), and the r3 shell hides the native [equip]
  span. The route uses `#center_mode_back` and the shell Equip action; the DOM shim gained
  `NodeFilter` and a `whatToShow`-aware TreeWalker. Runner 5/5.
- Cafe traders: both "Cat cafe" traders fill all ten template items in the rebuilt build at
  1920×1080 (first fill only; a later epoch roll was not exercised).
- S2-F13: profile data corrected (Mother of Learning `nativeBound:true` with an
  optional-campaign status; Paradise roster `nativeWorldId` and `nativeWorldIds`). No code
  reads these fields.
- Found during the M4 slice and fixed: trade back-bar exit (E2) and travel branches skipping
  registry ticks (E1); details in the [modular checkpoint](../../gm/dispatch/modular-seams-2026-10-16/CHECKPOINT.md#m4-results-2026-10-19).

Still open for Weibao: sealed-ID fix, unapplied queue rows, other clone stacks, S4-F9 panels,
X9/X10 bulk.

