# Cast lives: coordinator handoff (2026-10-28, late evening)

For the next coordinator session. Standing direction: **AD44, lead first** (a book world is implemented by
playing its protagonist's life), with the build order CL268 (plan section 27) and the efficiency list
CL272-CL281 (section 28). Beside keeps its floor as a regression check and gets no new features (CL270).
This handoff grants no new scope.

## Read first (in order)

1. [CAST_LIVES_CARD.md](CAST_LIVES_CARD.md): goal, lane state, rules, what Weibao can do now.
2. This file.
3. [Plan](CAST_LIVES_PLAN_2026-10-28.md) sections 23-28 (rounds 15-20). Earlier sections only when a brief
   cites them.
4. `AGENTS.md` (AD44), `docs/GROUND_RULES.md`.

## Lanes (runner: `node scripts/codex_lane.mjs status`; records in `~/.codex/lanes/protagonist-life-2026-10-27/`)

| Lane | What | State |
| --- | --- | --- |
| W1 | Lane runner, review script, brief template | Committed `6324d336f`; resume fixed to `-c sandbox_mode` and proven on a live G1 resume |
| L5r | Chapters 1-3 UI replay driver | Committed `8a6dffa6a`; two identical UI runs, 1/18 verified (beside seat) |
| G1 | Wait until; beat aftermath writes knowledge | Committed `5832a1f8b`; floor PASS bundle `0539519f` |
| C1 | Perspective tags for 64 controls (`src/perspective_controls.js`) | Committed `5832a1f8b` |
| S1 | Seat filter (`src/seat_profiles.js`), shell hunk, LOTM panel hunk | Committed `5832a1f8b`; coordinator fixed two defects (below) |
| P1 | `world_lead_pipeline.mjs`, one command per book to records-ready (CL272) | Committed `569616c90` |
| B1 | Be the lead ([brief](cast-lives-lanes/B1_BE_SEAT_BRIEF.md)) | **Running** (Sol medium, pid 25335, launched 2026-10-28 ~20:00); review with the loop, then the be-seat browser check and the L5r replay in the be seat |
| G2 | Concealment | **Held** until the be replay asks for it (brief kept: `G2_CONCEALMENT_BRIEF.md`) |

Coordinator fixes made in review this session (each lane's checkpoint records them): L5r snapshot paths
(knowledge, money); W1 resume flag; S1's panel filter reached only 9 of 34 panel anchors and none of the
crossing or other-seat ones; S1's known-panel filter warned for every panel.

## The coordinator loop (what worked)

1. Brief from `cast-lives-lanes/LANE_BRIEF_TEMPLATE.md` (now with CL225 actor and CL228 disclosure lines).
2. Launch: `node scripts/codex_lane.mjs launch <ID> <brief> --model <m> --effort <e> &` (it runs preflight,
   strips API keys, records pid and session; the launcher stays alive as the log writer). Resume with
   `codex_lane.mjs resume <ID> <message.md>`. At most two writers; give the second lane only files the first
   does not own.
3. On exit: checkpoint, diff, focused tests, `lane_review.mjs` with explicit paths (it misses untracked files
   and does not scan `scripts/` or docs), and the capitalized-token canon sweep by hand. Prepared patches
   are cut against HEAD: if a sibling lane edited the same file, apply by hand.
4. Full `npm test` once per commit batch; `npm run check:arch`; browser floor in headless Chrome at 1920×1080
   from a fresh origin, `BUILD_OUT=/tmp/<lane>` build (book pack symlinked in). Private screenshots to
   `docs/research/novels/lord-of-mysteries/private/cast-evidence-2026-10-28/`.
5. Commit each lane's own paths from a fresh HEAD (zsh: use arrays for path lists), no `Co-Authored-By`, no
   push; one line in the card's state table.

## Known pitfalls (new this session)

- The LOTM panel rebuilds its walk groups every game minute, and zero-size duplicate controls exist; a
  Playwright click on a stale element times out. Pause with `simulationTestHooks.pause()` around a click,
  or select `:visible`. (Also a player-facing finding, CO2 below.)
- The natural clock keeps running between persistence reads; compare state without the clock.
- `src/main.js` always shows one name hit and one top-level await in `lane_review` (baseline).

## Queue (CL268 order)

1. Done: G1, C1, S1 and P1 committed. Still open: the browser check that every visible control
   in a beside screenshot has a C1 tag, and a synthetic be state hides crossing and other-seat controls.
2. **B1, the be seat**: running. Its files cover the LOTM host, UI, state, lives, seat profiles and the book
   pack, so a second writer now must stay in `scripts/` (CL278 floor or CL274 ready-queue).
3. **Day-binding fix** (CL252/CL265, Luna low): flashback scenes tagged `history`, excluded from day binding.
   Can run beside B1 if it owns only the binding script and book-pack data.
4. **Be replay**: rerun L5r in the be seat (CL269); report fidelity there. Then the be replay's ledger is the
   only backlog (CL273); G2 and other G-lanes return as it asks.
5. **D1 determinism and divergence** (CO10) after B1, before the be replay's gap lanes multiply chance.
6. Efficiency lanes as slots free up: CL278 parametrized floor (start from this session's floor script,
   below), CL274 runner ready-queue, CL279 MoL lead playthrough after B1 is generic.

Browser floor script used this session (scratch, worth turning into CL278):
`/private/tmp/claude-501/-Users-weiwei-code-yet-another-idle-rpg/f33d10f0-e129-40d6-ae61-5cfdbbbf37ce/scratchpad/g1_floor.cjs`.

## More to consider, coordinator round (2026-10-28)

Weibao asked whether current work follows the refined direction. It does for order (G2 held; C1 and S1 make
the lead's screen his own; G1 serves his day; P1 is CL272). The items below are what the direction implies
that the lanes have not yet covered. Codes CO1-CO9 are this coordinator's.

| Code | Finding | Disposition |
| --- | --- | --- |
| CO1 | **In the be seat, the lead's own schedule is the player's appointment book.** G1's wait already takes a `knownAppointments` port; B1 should feed it from his schedule rows and duties (his family's mealtimes, his appointments), so "Wait until" offers his day, not only time bands | ACCOUNT FOR NOW: B1 brief line |
| CO2 | **Panel churn.** The LOTM panel rebuilds its walk list every game minute, so a click can land on a replaced button, and hidden duplicate controls exist. This hurts every seat and doubles S1's filter work (it reruns on each rebuild) | LATER/DELEGATE: UI lane (Luna medium) to render on signature change only and drop duplicates; done when a Playwright click needs no pause |
| CO3 | **Time cost per game minute is about 0.77 s.** Waiting is now 13 s for six hours (target under 3 s) because each beat boundary still pays the full per-minute cost elsewhere; sleeping and idle play pay it too | LATER/DELEGATE: profiling lane (Sol medium) on `update_timer`; done when a 349-minute wait is under 3 s and natural play keeps its rate |
| CO4 | **Filter at the source for the be seat.** S1 hides panel blocks after render (MutationObserver). For the be seat, controls that never apply (Village door, paused-life line, start pickers) should not be built at all, so they cannot flash or leak into keyboard order | ACCOUNT FOR NOW: B1 removes them from the be view model; S1's DOM filter stays as the backstop |
| CO5 | **A be life has no Village life behind it.** "First life is paused where you left it" assumes a crossing; CL227 says switching seat is a new life. B1 decides whether a be start creates or links any Village state at all; default none, so saves carry no crossing fields | ACCOUNT FOR NOW: B1 brief line and a save test |
| CO6 | **The workroom and supervisor are dated, not seat-fixed.** C1 has no rows for them; CL236 calls them other-seat, but the lead works there later in the book. Tag them by date in the book pack (other-seat before he joins, in-world after) | ACCOUNT FOR NOW: B1 or a C1 follow-up |
| CO7 | **The Village's own Reports lines** (quest and navigation notices) have no perspective row; in the be seat they must not appear (CL241) | ACCOUNT FOR NOW: S1 follow-up hunk, small |
| CO8 | **Fidelity is still measured in beside** (1/18). Until B1 lands the number cannot move by CL269's definition; do not report beside fidelity as progress | ACCOUNT FOR NOW: card wording |
| CO9 | **Wording (CL248).** G1's and G2's briefs say "private pack"; new briefs say "local book pack (not published)" first, then "book pack" | ACCOUNT FOR NOW: done in C1, S1, P1 briefs; G2 brief updated when it returns |
| CO10 | **Determinism has owners but no use in the cast path yet.** `seeded_streams.js`, `hash_rng.js` and `check_resolver.js` exist; cast schedules and beats are deterministic only because they contain no chance (beats settle as written). CL262 (the lead as an NPC follows the book while his state matches, otherwise the same resolver by needs and motives, with seeded close calls) and CL260 (same life, same actions, same result) have no lane. L5r's two-run comparison is the only replay check | ACCOUNT FOR NOW: B1 brief line 6 (draws keyed by life seed, day, subject; a two-run identity test). LATER/DELEGATE: D1 lane (Sol medium) for the CL262 divergence resolver and an emergence and divergence log (CL150); done when a be replay that leaves the book's path at one step shows the cast's beats that depend on it resolving by motive, identically across two runs |

## Waiting on Weibao (one batched list, CL281; each has a default)

- Acceptance of SUI1-SUI19, CLR1-CLR13 and RPT1-RPT12 as binding defaults. Default: accept as written.
- The LOTM start month. Default: the book's own opening date; until then the day counts from the life's start.
- Rebuilding the checked-in `dist/` so `index.html` shows this work. Default: rebuild at the next commit batch;
  `npm run desktop` already rebuilds.
- After B1 lands (CL246): which meta powers, if any, an outsider-mind premise keeps. Default: none.
- Any push of the local commits. Default: hold until he says yes.
