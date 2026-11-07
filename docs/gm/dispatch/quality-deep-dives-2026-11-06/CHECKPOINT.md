# Quality deep dives, 2026-11-06: checkpoint

```receipt
build: n/a
route: fixture(headless fresh starts via scripts/headless/trace.mjs)
state: built
viewport: headless runner 1366x768 desktop on the rebuilt bundle; no visible-browser pass (background-only rule)
persistence: checked
tests: focused lane tests (names, continuity, pacing, openings, feedback, touched modules); npm test 5660/5661 then the one failure fixed and rerun focused
review: diff-scoped
surface: five quality checks and rulebooks; fix slices in npc display names, shell feedback, openings text
```

Direction: [USER_VISION](../../../USER_VISION.md#five-quality-deep-dives-on-the-prose-model-2026-11-06).
Lane rules: [COMMON.md](COMMON.md). Coordinator (this Claude session) owns every shared
file: package.json, RULES_INDEX, AGENTS.md, DESIGN.md, BALANCE.md, UI_RULES, IDEA_INDEX.

| Lane | Prefix | Owned outputs | Status |
| --- | --- | --- | --- |
| Pacing + shared trace recorder | PAC | scripts/headless/trace.mjs, scripts/check_pacing.mjs, docs/PACING_RULES.md, docs/pacing/ | running |
| Names and world vocabulary | NMR | scripts/check_names.mjs, docs/NAMING_RULES.md, docs/names/ | done; wired into check:rules |
| Consistency across files | CTR | scripts/check_continuity.mjs, docs/CONTINUITY_RULES.md, docs/continuity/ | done; wired into check:rules |
| First ten minutes of each start | OPN | scripts/check_openings.mjs, docs/OPENING_RULES.md, docs/openings/ | running (trace ready) |
| Feedback after every action | FBK | scripts/check_feedback.mjs, docs/FEEDBACK_RULES.md, docs/feedback/ | running (trace ready) |

Gate placement: static lints (NMR, CTR) may join `check:rules` with a baseline;
game-driven checks (PAC, OPN, FBK) get their own npm scripts (AD36).
Rule lines are proposals (AD32). Committed 2026-11-07 on Weibao's "commit and push" (see the last fix-log line).

## Checks

(one line per check: command, result, gaps)
- `node scripts/check_names.mjs`: ok, 1322 names, 34 known findings, 0 new. `node --test tests/names_check.test.js`: 8 pass. Gap: private cast mode (`--private`) is local only.
- `node scripts/check_continuity.mjs`: ok, 146 known findings (all private packs), src 0. `node --test tests/continuity_check.test.js`: 11 pass. Gap: who-knows-what not covered (sealed data).
- `node --test tests/pacing_check.test.js`: 9 pass, 1 skipped (boot smoke, `YAIRPG_PACING_BOOT=1`). Baseline run: 15 starts, 40 target misses. Gap: book and Tingen payoffs unmeasured (policy never reaches paid work).
- `node --test tests/feedback_check.test.js`: 8 pass, 1 fail. The cached-trace test reads machine-local traces that PAC re-recorded with a new policy. Fix: rebaseline after PAC traces settle; gate that test behind an env flag.

## Resume block (if usage runs out, a fresh session continues here)

Weibao's standing goal (2026-11-07): "continue accordingly, plan for in case of usage full, fix everything".
Order:
1. Integrate: OPN lane return; FBK rebaseline + env-gate the cached-trace test; package.json `check:pacing`,
   `check:openings`, `check:feedback`; RULES_INDEX register + router rows for PAC/OPN/NMR/CTR/FBK (proposed);
   one AGENTS.md line; BALANCE.md pacing paragraph (PAC_REPORT); DSG13 names link (NMR_REPORT);
   headless README line; IDEA_INDEX entry. Run `npm run check:rules`.
2. Fix slices from the backlogs, one writer per file. Skip files other sessions have dirty
   (check `git status --short src`). Ids stay; display text changes; saved history untouched (PRS8).
   After each slice: `--update-baseline` on its check so the entry retires.
3. Rebuild (`npm run build`), `npm test` once, headless proof of changed behavior.
4. Record checks here; no commit or push without Weibao's yes.
Status of each step is in the Fix log below.

## Fix log

- 2026-11-07 integration done: package.json check:names/continuity (in check:rules) and check:pacing/openings/feedback; RULES_INDEX register + router rows; AGENTS.md quality-checks line; BALANCE pacing paragraph; DSG13 names link; headless README; IDEA_INDEX. FBK cached-trace test gated by `YAIRPG_FEEDBACK_TRACES=1`.
- Fix lanes launched (rules: FIX_COMMON.md, claims: CLAIMS.md): NAMES, FEEDBACK, PACING, CONTINUITY. OPENINGS fix lane waits for the OPN lane return. Each writes FIX_<LANE>_REPORT.md. If the session ends: read those reports, CLAIMS.md and `git status --short`, then continue with step 3 of the resume block.
- Coordinator: check_names --private now honours pack idMap and continuity-links.json; private DUP 123 -> 47 (total 413 -> 337). Cast builder keeps base rows (build_cast_pack.mjs:100-105), so the 21 spelling fixes survive a rebuild from the current cast.json.
- PRIVATE-NAMES lane: private names 337 -> 104 (VAR 64, DUP 40, GEN 0); 108 lotm-cast renames (name only), 120 links; continuity 12 -> 11. Left: ~46 person and 18 place pairs need a source read (no shared alias), 40 DUP titles need a display-name field the pack lacks. Tests: names+continuity 22/22, 150 pack tests pass.
- OPN lane done for 14/15 starts (lotm.beside recorder hangs): 77 flags baselined, 10 tests pass. OPENINGS fix lane launched.
- FEEDBACK fix lane: 4 real defects fixed (slot buttons open detail in center view, Tools lists tool slots, closed hover-preview 'Full item' hidden, affinity test disabled with reason), FBK4 probe added (29 sampled: 26 inline reason, 3 title-only). 43 flagged controls baselined, 0 regressions. Left: lotm.* traces did not re-record (asked PACING to diagnose), Crafting nav reason title-only.
- Coordinator fixes: (a) cast place names that were raw ids read as words (castPlaceName/castPlaceLabel in src/book_world_lotm_cast_host.js); private 'Uninhabited island' duplicate renamed one line in lotm-cast (backup kept). (b) lotm.beside opened with 351 walk buttons; nearest 8 stay, the rest fold into 'More places you know (339)' (src/book_world_lotm_ui.js). Headless: 351 -> 12 visible, 0 raw ids. 425 lotm/walk tests pass; build ok; check:arch ok; check:rules PASS.
- NAV fix lane: locked nav controls use aria-disabled and announce their reason in a fixed status line (src/locked_control.js); probe title-only 3 -> 0. Coordinator: scenarios.mjs NPC clicks matched old exact labels; now regex on the role; npc_calendar + village_wave2 pass (3).
- REASONS fix lane: 25 neutral 'Not open to you yet.' book-start controls -> 0 via display-only src/structured_action_reasons.js (pack files untouched: their content hash is pinned by saves). Left: hp.lead's three acts show the next unmet scene; its real gate may be a clock in private hp-cast.
- PACING fix lane: work policy (--policy work), progress field, --only, disabled-option filter; 15 starts 0 misses; Village 31/240/150 -> 30/120/40, Soldier 171/240/140 -> 60/70/20; book/Tingen now measured (10-60 min first payoff). Tingen traces record cleanly (earlier failure was the disabled-option fill). Village pay-on-stop kept as design (accrued pay already shown); BALANCE line added.
- Final gate (2026-11-07): `npm run build` ok; `check:arch` ok; `check:rules` PASS (names 0, continuity 11 known). `npm test`: 5661 tests, 5658 pass, 1 fail, 2 skipped; the failure was the new `data-lotm-more-walks` family missing a perspective tag; tagged in src/perspective_controls.js, `tests/perspective_controls.test.js` passes. Not rerun as a full suite after that one-line fix.
- Final tree, fresh traces (`check_feedback.mjs --fresh`, then `check_openings.mjs`): first pass showed 22 new feedback flags: trade rows (a press moves the row between trader list and basket; same text, so the diff read it as silent) and filled slot buttons (re-select a detail already shown). Both SHOWN by hand and code read (index.html trade handler, proto23_shell chooseSlot), added as named artifact classes in check_feedback.mjs, then rebaselined: feedback 9 controls (from 43), openings 37 flags, 0 regressions each; their tests 19 pass. The 9 left are visual-only or re-press (active tab, Show me highlight, re-opened read disclosures). `check_pacing` (work policy): 15 starts, 0 misses (lane run).
- Persistence: headless boot, save, reload, export/import: "Old Hesk, the village elder" shown each time; display name not written into the save; invariants ok.
- Not done: visible-browser review (agent-verified, not human-reviewed); ~46 person and 18 place private spelling pairs need a source read; 40 private DUP titles need a display-name field; hp.lead acts' real clock gate. Nothing committed.
- 2026-11-07 round 2 (stop-hook: open items remain): lanes SOURCE-PAIRS (104 private names + 11 continuity via source text), HPLEAD (real gate for 3 acts), LAST-FEEDBACK (trade sold-out/unaffordable, 9 silent controls). After them: rebuild, full npm test, rerun game checks. Commit still waits for Weibao's yes.
- HPLEAD: the three acts have no clock gate; they wait on 7, 8 and 14 prior scenes. Reason now names the next scene plus the count ('6 more scenes come before this'); headless proof each enables right after its last prerequisite; 155 hp/structured tests pass.
- SOURCE-PAIRS: private names 104 -> 2, continuity 11 -> 1 (84 renames to official spellings via zh/en chapter alignment and wiki, 82 links, 8 pairs + 15 dups recorded distinct with reasons). 3 left: no evidence either way after searching zh locator windows, en text and wiki (listed in SOURCE_PAIRS_REPORT). Evidence local in private/source-pairs/decisions.json.
- 2026-11-07 closeout (another Claude session, on Weibao's "commit and push and reconcile accordingly"): LAST-FEEDBACK wrote no report; its code is `src/trade_notice.js` (sold-out and in-basket trade reasons) with `tests/trade_notice.test.js` and the claimed tab and Show me edits. Stale staged deletions of `docs/PROSE_RULES.md`, `scripts/check_player_text.mjs`, its baseline and `docs/prose/PROSE_REWRITE_BACKLOG.md` were dropped: the files on disk matched HEAD and `check:rules` still runs the player-text check. Final gate on the whole tree: `npm run build` ok, `check:arch` ok, `check:rules` PASS (names 0, continuity 1 known, player text 0 new), `npm test` 5671 pass, 0 fail. Game checks (pacing, openings, feedback) not rerun at closeout; their lane runs above stand. Agent-verified, not human-reviewed.
