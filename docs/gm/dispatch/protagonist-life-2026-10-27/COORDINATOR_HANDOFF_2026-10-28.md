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
4. [LEAD_LIFE_SYSTEMS_DESIGN.md](LEAD_LIFE_SYSTEMS_DESIGN.md) (LSD1-LSD164, proposed): sections 15-17 for the canon run,
   tiers, engine and long term; every cast, clock, save or pack brief cites its LSD lines.
5. `AGENTS.md` (AD44), `docs/GROUND_RULES.md`.

## Lanes (runner: `node scripts/codex_lane.mjs status`; records in `~/.codex/lanes/protagonist-life-2026-10-27/`)

| Lane | What | State |
| --- | --- | --- |
| W1 | Lane runner, review script, brief template | Committed `6324d336f`; resume fixed to `-c sandbox_mode` and proven on a live G1 resume |
| L5r | Chapters 1-3 UI replay driver | Committed `8a6dffa6a`; two identical UI runs, 1/18 verified (beside seat) |
| G1 | Wait until; beat aftermath writes knowledge | Committed `5832a1f8b`; floor PASS bundle `0539519f` |
| C1 | Perspective tags for 64 controls (`src/perspective_controls.js`) | Committed `5832a1f8b` |
| S1 | Seat filter (`src/seat_profiles.js`), shell hunk, LOTM panel hunk | Committed `5832a1f8b`; coordinator fixed two defects (below) |
| P1 | `world_lead_pipeline.mjs`, one command per book to records-ready (CL272) | Committed `569616c90` |
| B1 | Be the lead ([brief](cast-lives-lanes/B1_BE_SEAT_BRIEF.md)) | Round 3 committed `e7b6f5851`, implemented below floor. Floor at 1920×1080 on `a7147d40`: fresh be start reloads in 3.6 s, canon run, 15 memories, 3 known people, intention wait, reload keeps state, pack-absent read-only. **Round 4 running** ([message](cast-lives-lanes/B1_RESUME_4_MESSAGE.md)): BF1 other-world and Village panels listed, BF2 default hero gear and level, BF3 date/weather placeholders, BF4 read-only save noise. Then the L5r replay in the be seat |
| M1 | Schema 1.4 and census union stage ([brief](cast-lives-lanes/M1_SCHEMA_UNION_BRIEF.md)) | Committed `c822b8bc1` (coordinator updated the P1 test to seven stages). LOTM v1: 1,462 to 1,574 people rows, +700 routine slots, +1,022 reactions, census 3,431 + 3,832 to 4,085; lead-scene cast 134 (was 107, older snapshot). Three shards lack a pre-1.4 backup (w1s18, w3s33, w3s35), kept as 1.4. Output in `/tmp/m1-lotm-final4`. Full suite 3714/3715 with B1's in-flight `src/` edits; the one failure is `seat_profiles.test.js`, B1's area, recheck at B1 review |
| T1 | Lean union disk use, reusable floor with budgets ([brief](cast-lives-lanes/T1_TOOLING_BRIEF.md)) | Committed `0141e18fa`. Union output 11.6 MB (was ~400 MB), merged outputs byte-identical. Chrome cannot start inside the Codex sandbox: the coordinator runs browser floors. Contended baseline (bundle `11520d97`, three lanes running): 1,716 ms per game minute, 349-minute wait 45 s, save 370 KB, pack load 6.4 s |
| P2 | Measure per-minute cost, wake queue ([brief](cast-lives-lanes/P2_WAKE_QUEUE_BRIEF.md)) | Committed `edb88a929` (module, test, checkpoint, patch). **Finding:** one game minute is about 1.8-2.2 s in the Node harness; 46% `simulationFacts` (673 calls), 37% `simulationNativeContexts`, 9% `lotmFacts`; cast schedules are negligible. The wake-queue patch cuts about 20%. `P2_INTEGRATION.patch` (LOTM cast host, host, UI, cast-week tests) waits until B1 round 4 lands; recheck `git apply --check`, then the browser floor |
| P3 | Facts and contexts once per unchanged input ([brief](cast-lives-lanes/P3_FACTS_FRAME_BRIEF.md)) | **Running** (Sol medium); side by side with an equivalence test, `main.js` hunks through `P3_INTEGRATION.patch` |
| M2 | Union every row kind across schema versions ([brief](cast-lives-lanes/M2_ALL_KINDS_UNION_BRIEF.md)) | Committed `96be7cb18`. Older-only rows now kept: LOTM rules +888, places +300 (2,800 fields filled), MoL rules +1,029 (6,128 fields), places +247. MoL lead slice fitness: relations 149/170, reacts 76/133, routines 15/96 (timing stays thinnest). Outputs `/tmp/m2-lotm`, `/tmp/m2-mol`. MoL people have backups for only 4 of 106 files |
| P4 | Clock out of `main.js` ([brief](cast-lives-lanes/P4_CLOCK_BRIEF.md)) | Committed `df87df058`: `src/clock_owner.js`, `main.js` 10,056 (59 under baseline), no behavior change. Batching stopped: the expensive loop is `advanceSimulation` boundaries (a one-minute controller), and local-life publication is not span-equivalent (F4). Its F3 enrollment error came from a mixed scratch copy; the combined tree passes in the browser |
| R1 | Cast pack generator from merged readings, tiers, order edges, timing metric ([brief](cast-lives-lanes/R1_PACK_GENERATOR_BRIEF.md)) | **Running** (Sol medium); output to `/tmp/r1-pack/`, the coordinator swaps the pack in after a browser check |
| P5 | Per-boundary cost of idle spans: minute controllers on wakes, D1 cost ([brief](cast-lives-lanes/P5_SPEED_BRIEF.md)) | **Running** (Sol medium) |
| F1 | Step 1: one battle runner for the saved battles, byte-identical ([brief](cast-lives-lanes/F1_BATTLE_RUNNER_BRIEF.md)) | **Running** (Sol medium; Weibao via relay 2026-10-29: "send out next waves in codex?") |
| V1 | Be-seat replay and fidelity score, null-player mode ([brief](cast-lives-lanes/V1_BE_REPLAY_BRIEF.md)) | **Running** (Luna medium, scripts only; one lane over MW5's scripts slot because it is small and on the be-seat path) |
| D1 | Canon as constraints ([brief](cast-lives-lanes/D1_CONSTRAINT_STORE_BRIEF.md)) | Committed `da377b25f`. Floor on combined tree `34b15ea0`: be start, history, reload, pack-absent PASS; beside save/reload/Export/Import PASS; full suite 3763/3763. Cost: wait per game minute rose from 82 to 111 ms (P5 target). Known limits R1-R4 in its checkpoint |
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
5. **D1 spine** after B1: [LEAD_LIFE_SYSTEMS_DESIGN](LEAD_LIFE_SYSTEMS_DESIGN.md) LSD59 (means reader, risk and exposure quote,
   keyed resolver for the lead and cast, divergence log; covers CO10). Later gap lanes take their scope from LSD60
   (R1 relationships, E1 work and household, K1 witness and rumour, LW1 law, N1 needs, F1 conflict ladder) as the be
   replay reaches them; every brief cites its LSD lines.
   Canon results (Weibao 2026-10-28, reconciled with WA28, WA32, WA33, CL21-CL22 in LSD61-LSD70): the lead's run
   pins the book's route (WA32's dial) and holds the canon result while inputs match (a "book fidelity" play dial);
   untaken options stay possible (WA28) and resolve by our model with divergence logged. D1 adds the fidelity dial and
   the strain table; F1 generalizes the existing saved-battle runner into the conflict frame, porting the three battles unchanged first
   (LSD81-LSD95); FD1 is a narrow fight-detail reader pass (LSD100); C2 calibrates bands by script (LSD96); D2 (outside
   interference) is deferred. Order: B1, D1, FD1, F1, C2, as the be replay reaches each.
   **The canon run is forced** (Weibao 2026-10-28, LSD103-LSD125): the lead's choices are the book's; only external
   factors bend canon. D1 builds canon as constraints with conditioned keyed draws, provenance on every write,
   reservations that refuse free actions which would break a later canon fact, and the run-mode field.
6. **Schema 1.4 merge input** (relay 2026-10-28, batch-reading commit `ce199eb41`, READINESS_AND_SCOPE C29/C30):
   LOTM ch1-24 (prefixes s2..s9v) and MoL ch1-4 (molc001-004) people rows were replaced in place by schema 1.4
   (routine recurrence, reacts class/by/responseClass); the 1.3 rows sit in each book's private `pre-sv8/`.
   Before the next merge, union 1.4 and 1.3 by person and slot, taking 1.4 fields where present, as a stage in
   `world_lead_pipeline.mjs` (P1 follow-up, Luna low; scripts only, so it can run beside B1). Then rerun the
   pipeline so worksheets and book-pack rows gain recurrence; the L7 classifier becomes the fallback for reacts
   (CL56). Do not use `touchedByLead` alone as the cast list (Haiku under-marks it); presence in lead scenes via
   the crosswalk stays the source. Book-pack regeneration waits until B1 has landed (B1 edits the pack).
   **Update (relay, later 2026-10-28):** all 72 LOTM volume 1 shards now carry 1.4 rows (people ch25-213,
   rules, texture); the replaced rows are in the private `lead-run-2026-10-27/pre-sv14/` (not `pre-sv8/` for
   this batch). Merge per READINESS_AND_SCOPE C34, same as SV8. A second medium census covers 31 volume 1
   shards (`*x2_census.jsonl`); union it with the first by normalized name and aliases per C28 (about +7
   points of recall). The merge stage therefore unions three inputs: 1.4 over 1.3 by person and slot, and
   census x1 with x2. Ready to dispatch now (scripts only, beside B1). Also available: Reverend Insanity read
   through about ch400 (volumes 2-4), and retry gap fills in HP, A Soldier's Life and LOTM v1.
7. Efficiency lanes as slots free up: CL278 parametrized floor (start from this session's floor script,
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

## Several worlds at once (Weibao asked 2026-10-28; proposal, codes MW1-MW8)

Yes, by layer. Data work for other books runs in parallel now; runtime work for a second world follows each
generic seam LOTM proves, so no seam is built twice.

| Code | Consideration | Disposition |
| --- | --- | --- |
| MW1 | **Data layer is already parallel.** Batch reading covers RI, HP, A Soldier's Life and MoL; P1 and M1 are book-parametrized (`world_profiles.mjs`). Running the pipeline for MoL and RI costs scripts, not writers | ACCOUNT FOR NOW: after M1, run P1+M1 for MoL and RI into their private folders (coordinator, no lane) |
| MW2 | **Runtime: LOTM is the reference, a second world is the proof.** Seats, wait, beat knowledge, perspective tags, the constraint store (D1) and the saved-battle family are world-generic seams. Each is real only once a second world uses it unchanged | ACCOUNT FOR NOW: every runtime brief adds a "second-world check" line: a synthetic second-world fixture test, no world-named branch (CL225) |
| MW3 | **MoL is the right second world.** It has a pack, a host and state, short chapters, and its time loop stresses canon-as-constraints: canon facts are per-loop, the loop reset is a world mechanism not an external factor, and knowledge carries over by the world's rule | LATER/DELEGATE: CL279 MoL be seat after B1 lands (Sol medium); done when a MoL be life starts in canon mode and one loop reset keeps the lead's knowledge and resets the cast's |
| MW4 | **RI tests the canon run against a ruthless lead.** Canon outcomes the player may find distasteful stay locked in the canon run; the open run unlocks them. No new rule, a good fidelity test | LATER: after MoL |
| MW5 | **Writer cap is usage, not design.** Two Codex writers keeps usage inside the included plan (AU rules). A third slot is possible for scripts-only or data lanes that touch no `src/` | ACCOUNT FOR NOW: cap 2 runtime writers plus 1 scripts/data lane when preflight allows |
| MW6 | **File collisions.** Per-world files (`book_world_<world>_*`, `private_packs/<world>-*`) split cleanly; shared ones (`seat_profiles.js`, `perspective_controls.js`, `main.js`, the combat family) need one owner at a time | ACCOUNT FOR NOW: briefs list shared files as integration patches unless the lane owns them |
| MW7 | **Determinism across worlds.** Draw keys include the world id, so two worlds in one save never share a stream, and adding a world never rerolls another | ACCOUNT FOR NOW: D1 brief line |
| MW8 | **One player, one seat at a time.** Several worlds in progress means several lives in the save; switching is a Menu action, and crossings stay deferred in the be seat (CL227, CL239) | No change |

## Size and scale (Weibao asked 2026-10-28; proposal, codes SZ1-SZ7)

Measured after M1: the LOTM volume 1 registry has **270 distinct people** (plus items, prices, places and other
kinds, 2,680 entities in all). M1's 1,574 counts person rows per shard (one person read in 72 shards is 72
rows); the 4,085 census entities are every named thing the readers listed, not characters. The pack today
carries 36 people for chapters 1-24 in 388 KB; `dist/bundle.js` is 7.3 MB and holds no book data.

| Code | Consideration | Disposition |
| --- | --- | --- |
| SZ1 | **Install size does not grow.** Book packs are local files fetched at runtime (`content_packs.js`, `book_world_lotm_cast_days.js`), never bundled or published. A full volume 1 pack scales to an estimated 3-4 MB | No change |
| SZ2 | **Save size is the real risk.** If every pack person becomes a live body with full state in the save, saves grow with the cast. Saves should hold only deltas from the pack (what changed, keyed by id), and the pack stays the source | ACCOUNT FOR NOW: D1 and the pack regeneration brief; done check: a save after one book week stays within 2x today's |
| SZ3 | **Depth tiers.** About 30-50 recurring people get full lives (schedule, needs, relations); the rest are role records that wake to full depth when the lead meets them; census mentions stay reference rows | ACCOUNT FOR NOW: pack regeneration brief (tier from crosswalk lead-scene counts, not `touchedByLead`) |
| SZ4 | **Load by window.** Load the pack slice for the current chapter window plus the next, not the whole volume, so start time and memory stay flat as more volumes arrive | LATER/DELEGATE: Luna medium after B1; done when a be start loads one window and crossing into the next loads it without a reload |
| SZ5 | **Pipeline disk use.** The union stage copies the whole 401 MB private input per run; five M1 attempts used 2.2 GB of `/tmp` (the coordinator removed the four earlier ones; `/tmp/m1-lotm-final4` kept). Copy only changed shard files and link the rest | LATER/DELEGATE: Luna low; done when a run's output is under 50 MB |
| SZ6 | **Per-tick cost.** CO3 already measures 0.77 s per game minute with 36 people; 270 people would multiply it unless off-screen people advance only at their schedule boundaries (the same trick G1 used for waiting) | ACCOUNT FOR NOW: fold into the CO3 profiling lane |
| SZ7 | **Several worlds multiply all of the above** (MW1-MW8): per-world windows and delta saves keep the cost per active world, not per installed world | ACCOUNT FOR NOW: same lanes |

## Open to refactor (Weibao 2026-10-28; AD45 recorded, codes RF1-RF6 proposed)

| Code | Consideration | Disposition |
| --- | --- | --- |
| RF1 | **AD45 is in the rules index, ground rules, the runtime router row and the brief template.** Everything built is the current best; change needs a reason, not permission | Done (`5ac0c3efd`) |
| RF2 | **Refactors are only cheap with safety nets.** Golden null-player runs per pack revision (LSD146) and the budget receipt (T1, LSD147) let a later lane replace a system and prove nothing changed (AR9) | ACCOUNT FOR NOW: T1 running; D1 adds the state hash |
| RF3 | **`main.js` pressure is the first refactor.** B1 hit AR1 (+11 lines) on its first cross-cutting feature; the clock (`update_timer`) and fresh-life routes live there. An AR15 extraction round that lifts the clock into a module would also give P2's wake queue one place to plug in | LATER/DELEGATE: Sol medium after B1 and P2 land, with an AR15 writer reservation; done when `main.js` drops by the moved lines and the same journey passes before and after |
| RF4 | **Versions make refactors safe for saves.** Pack revision in the save (LSD142), reader schema versions (LSD151) and stable crosswalk ids let data shapes change without breaking lives in progress | ACCOUNT FOR NOW: pack regeneration brief |
| RF5 | **Every checkpoint names its known limits and expected refactor** (template line), so the next lane starts from them instead of rediscovering | Done in template; B1, T1, P2 apply it |
| RF6 | **Proposals stay replaceable too.** LSD lines are a dated proposal; when accepted they move to a standing rulebook (LSD155) and keep codes, so later revisions are dated amendments, not rewrites | No change |

## Modularity, past code earns no weight (Weibao 2026-10-28; AD45 extended, codes MD1-MD9 proposed)

| Code | Consideration | Disposition |
| --- | --- | --- |
| MD1 | **The module seam already exists and works.** `registerDomain` plus a ports object let B1 move its fresh-life route into `src/fresh_life_start.js` with one registration line; `main.js` went from +11 over baseline to 26 under | Pattern for every new cross-cutting feature |
| MD2 | **Fat port bags are the next smell.** `configureLotm` receives 20+ ports from `main.js` in one call; group them by concern (clock, save, body, UI, world) so a module asks only for what it uses and a replacement can be wired without reading all of `main.js` | LATER/DELEGATE: with RF3's clock extraction (Sol medium); done when LOTM and MoL hosts take grouped ports and `main.js` lines drop |
| MD3 | **Contract tests at every seam.** A replacement implementation passes the same tests as the old one (wake queue, save envelope validators, seat filter, constraint store). Tests pin behavior at the port, not internals, so rewriting a module does not mean rewriting its tests | ACCOUNT FOR NOW: brief template line on contract tests |
| MD4 | **Replace rather than patch when special cases pile up.** When a module gathers world-only branches or flags, rewrite it behind the same port and prove it with the golden run and floor budgets (LSD146, LSD147) | ACCOUNT FOR NOW |
| MD5 | **Delete freely.** Dead routes, superseded helpers and tests that pin an old shape go in the same change as their replacement (lean tests rule, 2026-10-22) | No change |
| MD6 | **Side by side during a swap.** A large replacement runs behind a dial (old and new implementation, same save) until the floor and golden run agree, then the old one is removed; no big-bang rewrites of systems a life depends on | ACCOUNT FOR NOW |
| MD7 | **Data over code.** Worlds are packs and rows on generic verbs; world code only for world mechanisms (LSD148, FND5). The less world-specific code, the less there is to refactor per world | No change |
| MD8 | **Upstream code is not prized either.** The original game's code in `main.js` is the fork's base; AR1/AR15 extraction continues, and a better implementation may replace upstream systems, keeping attribution and LICENSE | No change |
| MD9 | **The cost of rewrites is lost subtle behavior.** Guard it with the golden run, floor budgets, save versioning (LSD142) and the checkpoint's known-limits line, so a rewrite shows what it changed | ACCOUNT FOR NOW |

## Local agents (Weibao asked 2026-10-28; proposal, codes LA1-LA8)

Evidence: [local reader test](../../../research/LOCAL_AI_READER_TEST_2026-10-27.md) (Qwen3.8 27B, Gemma4 31B, an
abliterated Q8 on this 64 GB Mac). No local model has been tried on code in this repo yet.

| Code | Consideration | Disposition |
| --- | --- | --- |
| LA1 | **Reading: narrow lanes only.** Whole-shard reading failed (recall 9-42%); the narrowed census lane (one chapter per call, script-owned fields, schema output, lint and a recall check) passed with 87-93% recall. Scenes, options, fills and inner life stay with cloud readers | Standing (memory `local-model-lanes`) |
| LA2 | **Best next local reading jobs are row-level and checkable:** filling routine times (the thinnest layer: MoL 15/96 usable), confirming price and measure rows, tagging texture, labelling provenance on fills, classifying panels and controls by perspective (C1-style). Each has a lint and a known-answer sample | LATER/DELEGATE: pilot the routine-time fill on 3 MoL shards (Qwen 27B, census-lane harness); done when usable routines rise with zero lint errors on a hand-checked sample of 20 |
| LA3 | **Code: only small modules with contract tests.** Context is about 16k tokens per call; `main.js` (10,090 lines) does not fit, a module plus its test does. AD45's modularity (small modules behind ports, MD1-MD3) is what makes local coding possible at all | LATER/DELEGATE: one pilot task, a pure module with an existing contract test (for example a budget or union helper); done when the pass rate over 5 attempts is recorded |
| LA4 | **Not a fit locally:** design synthesis, multi-file integration, browser floors, review of lane returns, anything that needs the whole rule set in context. Those stay with Codex Sol/Luna and the coordinator | No change |
| LA5 | **Same gates as any lane.** Local output passes the same lint, recall check, focused tests, `lane_review` and coordinator review; a local lane never commits | ACCOUNT FOR NOW |
| LA6 | **Memory is the binding limit.** Qwen 27B holds 18-21 GB; at this check swap was 14.4 of 15.4 GB used with builds and headless Chrome running. One local model at a time, never beside a browser floor or a build; check `sysctl vm.swapusage` first and `ollama stop` after | ACCOUNT FOR NOW |
| LA7 | **Variance needs retries.** The same prompt gave 2/34 and 23/30 known names; a local lane retries per item against its check and records seeds, so results stay reproducible (LSD139 spirit) | ACCOUNT FOR NOW |
| LA9+ | **Pilot results** (2026-10-29, [capacity doc](../../../research/LOCAL_AGENT_CAPACITY_2026-10-28.md), `2fd71528f`): routine times 3 to 10-12 usable of 80 slots, 0 lint errors, 9 of 15 fills supported, 0 invented; the text, not the model, is the ceiling. Code pilot 3 of 5 passed; a test-gated loop makes it usable. Estimate (inferred): 10-20% of lanes, under 10% of cloud spend. Swap-used is a poor memory gate (LA11) | Owned by the capacity doc |
| LA8 | **Cost trade.** Local runs spend wall time and memory instead of subscription usage; worth it for bulk row work across many books (MW1), not for one-off runtime lanes | No change |

## Accepted by Weibao (2026-10-28)

Weibao answered the batched list with "Sure": SUI1-SUI19, CLR1-CLR13 and RPT1-RPT12 are binding defaults; the
LOTM start month is the book's opening date; rebuild the checked-in `dist/` at the next commit batch; meta
powers stay hidden in the be seat (asked again only if an outsider-mind premise comes up); pushes wait for
his explicit yes. USER_VISION and PROJECT.md records are the owning session's to write.

## Superseded: the batched list as asked (CL281)

- Acceptance of SUI1-SUI19, CLR1-CLR13 and RPT1-RPT12 as binding defaults. Default: accept as written.
- The LOTM start month. Default: the book's own opening date; until then the day counts from the life's start.
- Rebuilding the checked-in `dist/` so `index.html` shows this work. Default: rebuild at the next commit batch;
  `npm run desktop` already rebuilds.
- After B1 lands (CL246): which meta powers, if any, an outsider-mind premise keeps. Default: none.
- Any push of the local commits. Default: hold until he says yes.

## Overnight loop (2026-10-29, codes ON1-ON12)

Weibao 2026-10-29 ([record](../../../USER_VISION.md#cast-lives-automate-finishing-lotm-overnight-from-one-session-2026-10-29)):
run from one session, one checkout, few cross-chat messages; finish the LOTM lead's playthrough so he can follow
his options to the end. **Coordinator from 00:40 on 2026-10-29: the vision-doc session** (`local_bf0faa81`
transcript); the earlier coordinator session stops launching, resuming, reviewing and committing.

- **ON1 Done means** the be-seat canon-run replay (V1) over the whole book, scored as events reached in the book's
  order inside their windows (LSD156). The whole book is read: volume 1 at schema 1.4, volumes 2-8 at 1.3
  (`overnight_2026-10-28x-lotm`, 592 shards, 47 census partials, 7 people parse failures). Correction 2026-10-29:
  the first draft said only volume 1 was read; the gameplay merge, not the reading, stopped at volume 1. M3 merges
  volumes 2-8. Paid retries and a 1.4 re-read of volumes 2-8 are November credit, Weibao's call.
- **ON2 Options** under the forced canon run: each canon step reachable through the game's own controls; the
  replay ledger lists what the screen offers at each step, untaken ones locked (LSD103-LSD125). Open run later.
- **ON3 Loop.** Replay -> scored ledger -> top gaps by chapter order -> brief from the template with LSD lines ->
  preflight and launch (at most two writers, disjoint grants) -> on exit: checkpoint, diff, focused tests,
  `lane_review` plus a hand canon sweep of untracked and `scripts/` files -> one full `npm test`, `check:arch`,
  headless 1920×1080 floor per batch -> commit own paths -> replay again.
- **ON4 Wakeups.** Lanes are watched by a background wait on their pids (scratch `wait_lanes.sh`), which
  re-invokes the coordinator on exit. No polling.
- **ON5 Window ladder.** ch1-3, then ch1-24 (existing beat ledger), then volume 1 in arcs as R1's pack and the
  day binding cover them. Advance when the window's ordered-event fidelity stops rising on its own gaps.
- **ON6 Data gaps first** (pack rows, crosswalk ids, day binding), mechanism gaps second (LSD60 lanes as the
  replay reaches them: relationships, work, witness, law, needs, conflict), UI-path gaps third.
- **ON7 Stop** on: preflight fail or a usage window at 100% (never API keys); the same gap failing twice; a save
  shape change needing a compatibility decision; a sealed secret's text; any push.
- **ON8 Browser** checks stay with the coordinator (Chrome cannot start in the Codex sandbox).
- **ON9 Patches** are cut against HEAD at lane exit; check with `git apply --check` and reverse check before
  applying; a reverse-clean patch is already in.
- **ON10 Morning note** here: lanes run, commits, fidelity per window, open gaps, each check's verification state.
- **ON11 Out of scope tonight:** pushes, new readings, the open run, other worlds, deleting the stale
  `~/.codex/worktrees/q*` checkouts from 2026-10-26 (a cleanup Weibao can approve).
- **ON12 Model routing** stays: Luna for scripts and data, Sol for engine and UI, browser and commits here.
- **ON13 Codex weekly budget** (Weibao asked 2026-10-29). Plan `prolite`, one weekly window (10,080 min), 23% used at
  00:50 on 2026-10-29, resets 2026-11-04 07:10. The account also holds paid credits, so a full window could fall
  through to them: launch only with `CODEX_LANE_MAX_USED=45` overnight (about +22 points), and keep the rest of
  the week under 85%. Record the used percent at each launch and exit to price lanes. Spend Codex on what only a
  model can do (engine and UI code, mapping judgement); the coordinator runs deterministic pipelines, browser
  floors, test fixes and small driver fixes itself. Luna for scripts and data, Sol medium only for `src/`;
  sharp briefs to avoid resumes; at most two writers.

### Overnight log
- 00:45 Handover accepted by the earlier coordinator (last commit `d8d865c8c`). Applied patches: B1_INTEGRATION, B1_INTEGRATION_2, P2, P3, S1 (by hand). Open: P5_INTEGRATION.patch, R1 (unreviewed, `/tmp/r1-pack/`, 92 people, 13 unresolved routine actor ids; do not overwrite `private_packs/lotm-cast/cast.json` before a browser check), F1 and V1 running. Floors: `scripts/floor/run_floor.cjs` (beside), be floor `b1_floor.cjs` (build in `/tmp/yairpg-b1`, pack symlinked). Baseline on `34b15ea0`: 1,240 ms per game minute, 349-minute wait 50.1 s; suite 3763/3763 on `df87df058`. Nit: pack-absent console "Something went wrong on saving the game!" (BF4).
- 00:55 R1 committed `64adcb976` (runtime patch waits for P5). V1 committed `612fa9c56` (audit: 18 steps, 7 need be routes). M3 (whole-book merge, Luna medium) launched, pid 53428.
- 01:00 Suite on P5+F1 3906/3908; P5 resumed for a held-stock release regression and a story-budget test. V1 driver fixed here twice (be state path and reload Play; collapsed walk groups, per-row gaps). Weekly Codex window 23%.
- 01:40 M3 `88beade60`, M4 `558aae1f1` (whole book: 8 volumes, 3,444 lead rows incl. 346 persona rows; outputs copied to private `m4-whole-book-2026-10-29/`). First be replay ch1-3: 0/18 (8 missing verbs, 7 stale `needs seat: be`, 1 walk id, 1 dawn wait, 1 CLR1 rejection); null-player hashes differ (compare at a fixed game time next). P5 `c2e199776` and F1 `0e6dd6928` committed after suite 3914/3915 (the one failure was the replay test, updated) and floors on bundle `b273a71d`: be start, canon run, reload keeps state, no page errors before pack-absent; beside floor pageErrors none, Save/reload/Export/Import PASS, 349-minute wait 18.7-21.7 s (was 50.1 s), 1,062-1,095 ms per game minute (was 1,240). Gaps: F1 battle journeys not browser-compared (126 unit replay cases with save bytes); be wait timing not browser-measured. X1 `1257d88c2`: generator, ch1-24 1,491 steps, 0 walk/talk matches. H1 (everyday acts, Sol) and X2 (place/person resolution, Luna) running. R1's pack swap waits for H1's pack rows; rerun `build_cast_pack.mjs` with the new base, then swap after a browser check. Codex weekly 23%.
