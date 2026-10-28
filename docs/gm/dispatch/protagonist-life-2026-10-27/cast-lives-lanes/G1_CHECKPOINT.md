# G1 fix round, 2026-10-28

**Implemented, below floor pending browser performance proof.** F1 was caused by one full
`update_timer` transaction for each waited minute. The coordinator had applied the original
integration patch before this round and assigned its two host hunks to G1. The history below
records the prior lane state; its claims that the patch is unapplied and that F2 is open are
superseded by the coordinator's report.

`wait_until.js` now advances to the next unsettled cast beat or the target in one request,
rechecking sleep, occupation, writable state and location around each advance. A clipped or
mismatched step switches the rest of that wait to one-minute requests; a paused clock stops.
`book_world_lotm_cast_host.js` projects due minutes from the same pack/day and durable ledger
used by beat settlement. `book_world_lotm_host.js` supplies that projection and the existing
clock port; `main.js` forwards the requested minutes to `update_timer`. There is no new clock
or save field. Tests are in `tests/wait_and_beat_knowledge.test.js`. Files and ownership are
as stated in the original lane plus the coordinator-assigned `book_world_lotm_host.js` and
`main.js` hunks. AR3, AR7, AR10, AR16, AD36 and AD43 apply.

| Check | Result | Gap |
| --- | --- | --- |
| `node --test tests/wait_and_beat_knowledge.test.js` | PASS 7/7; a 349-minute fake-clock wait visits four due beat minutes in four calls; clipped-step fallback and interruptions pass | Focused scope |
| `npm run check:arch` | PASS; 205 grandfathered cyclic edges, no growth; main 10085 vs 10115 baseline | No baseline changed |
| `BUILD_OUT=/tmp/yair-g1-fix-build npm run build` | PASS; SHA-256 `110e3a657745db5179e3e74d1c9c8442b413d106bc2f96dc96c23841336ac6b8` | Isolated bundle, not primary dist |
| `node /tmp/yair-g1-fix-probe.mjs` | PASS: fresh native fixture, walk, greeting, 358-minute wait in four calls, 549 ms, witnessed person knowledge, envelope roundtrip | Node fixture timing is not browser timing |
| `python3 -m http.server 18763 --bind 127.0.0.1` in isolated build | BLOCKED: sandbox rejects bind with `PermissionError: [Errno 1] Operation not permitted` | 1920×1080 browser wait under 3 seconds and zero page errors remain unverified |
| `git diff --check -- src/main.js src/book_world_lotm_host.js src/book_world_lotm_cast_host.js` | PASS | No commit |

The coordinator reports prior combined source/full-suite 3698/3698 and `check:arch` passes,
and F2 closed by literal Save, reload, Export and Import after waiting. Those checks predate
this fix; the full suite is the coordinator's pre-commit gate. The fix has no new persistence
fields. The remaining playable gate is a rebuilt 1920×1080 browser run measuring the 349-minute
wait under 3 seconds and confirming the witnessed dawn knowledge and zero page errors. FLR1
passes for the isolated bundle; FLR2-FLR4 remain partial for this fix until browser proof;
FLR5 is coordinator-reported before this fix; FLR6 is agent-verified at focused/native fixture
scope, not human-reviewed. No commit or push.

## Previous G1 lane receipt (historical)

# G1 wait and aftermath checkpoint, 2026-10-28

**Implemented, below floor.** Agent-verified at focused/native-state fixture scope, not human-reviewed.
The primary checkout has the knowledge adapter and UI renderer. Waiting's two unowned host hunks
are prepared in [G1_INTEGRATION.patch](G1_INTEGRATION.patch), not applied to the shared checkout.
No commit, staging, reset, stash, push, user-save change or primary bundle write was performed.

Authority: [brief](G1_WAIT_AND_AFTERMATH_BRIEF.md), [card](../CAST_LIVES_CARD.md),
[plan section 22](../CAST_LIVES_PLAN_2026-10-28.md#22-round-14-build-the-gaps-for-the-whole-game-not-only-for-the-leads-life-2026-10-28).
Applied CLR2/CLR3/CLR7/CLR9/CLR10/CLR11, CL214/CL216/CL219/CL220, AR3/AR7/AR8/AR10/AR11/AR14/AR16,
AD6-AD8/AD36/AD43, WA12 and RPT2. UI follows `.claude/rules/player-ui.md`; target 1920×1080.
Visible outcome: a wait quote in minutes, completion/interruption feedback, and received knowledge in a
known person's view. Deferred: mobile, other cast verbs, concealment, inventory/economy transactions,
seat changes and a new MoL cast-beat driver.

## Ownership and input identity

Base HEAD observed at receipt: `150a246b1581af4b0c1fa5e0f6cbbbce8e72aa54`. Shared checkout was already dirty.
Existing changes to dist, index, research and unrelated evidence were preserved. No shared direction docs edited.

| File | Change / publication class |
| --- | --- |
| `src/wait_until.js` | New name-free quote/execute adapter over the supplied clock; next band and known appointment cases |
| `src/beat_knowledge.js` | New name-free per-learner adapter, altered-outcome handling and event-date application through injected existing knowledge writer |
| `src/book_world_lotm_cast_host.js` | Wait projection; settlement produces knowledge writes; existing effect owner persists them with the ledger; player-safe person details |
| `src/book_world_lotm_ui.js` | Wait quotes, reasons and result feedback in the existing place-service actions surface |
| `private_packs/lotm-cast/cast.json` | Private beat `knows` fields, derived from existing attributed knowledge rows and reviewed witness templates; no public cast text |
| `private_packs/mol-cast/cast.json` | Private per-person knowledge mapped by the existing explicit scene attribution |
| `tests/wait_and_beat_knowledge.test.js` | Five synthetic regressions |
| `cast-lives-lanes/G1_INTEGRATION.patch` | Prepared changes to unowned `book_world_lotm_host.js` and `main.js`; coordinator applies after checking live owners |
| `cast-lives-lanes/G1_RESCORING.json` | Six-row rescore, without modifying the sibling private gap ledger |
| `cast-lives-lanes/G1_CHECKPOINT.md` | This receipt |

CLR2 gate passed: combined ledger exists, 32 rows, one `missing UI path`, five `aftermath` rows.
Private data after edit: LOTM 84 beats, 56 with knowledge, 114 knowledge effects; MoL 44 beats, 11 with
knowledge, 11 effects. LOTM's beat and bound-beat copies retain matching knowledge data.
Pack SHA-256:

- LOTM: `7f9a0daa8fb1b268a295b3365abd3e04749eeaa682eee7571e1023d10834fe37`
- MoL: `12cf5fe77e2e784e7520c7773913c0cd5a69f6660809940ed818d790c54bded3`

## Mechanism and ramifications (CL220)

A: `waitUntilOptions` quotes from the existing clock and `TIME_BANDS`. `runWaitUntil` invokes the host's
ordinary one-minute advancement, rechecking occupation/location each step and stopping when the clock
owner pauses. The prepared main hunk injects `update_timer(1,'wait')`; it adds no clock or timer.
Appointments are offered only when a caller supplies an explicitly known future appointment. The
prepared host accepts an optional `knownAppointments` port; no appointment is invented from private schedules.
The helper is available to another world's existing actions panel without adding a new panel or clock.
No other-world panel or appointment data source is wired in this lane.

B: terminal successful beats stage authored knowledge for their learners even during off-screen catch-up.
Present learners use the full schedule's precedence at the event time, rather than the body's later location.
Private actor knowledge stays private. Player entries require their own authored exposure and use masked,
rendered witness text. Altered beats use their altered branch's knowledge; blocked/lapsed beats teach nothing.
Each stored entry uses the existing `simulation.knowledge[actor][key]` owner, event minute and beat `cause`.
The ordinary effect writer preserves a stronger existing understanding. Planning remains pure, and a
terminal ledger prevents duplicate settlement. NPC knowledge feeds existing simulation/target knowledge
facts; player knowledge feeds the known-person view. Pack absence leaves retained knowledge intact.

Save decision: additive entries in the existing knowledge owner; no schema/envelope fields, no new saved
wait state and no migration. Previously terminal beats are not replayed or backfilled. A new life or a
previously unsettled beat receives the new authored effects. Literal browser persistence is still open.
No money, stock, source/sink or balance flow changes. The four original starts retain their existing
entry answers, bodies, command lists and move lists (existing byte-identity regression passes).

MoL: its attributed private rows pass the same adapter and its existing pack validator, with 11 writes.
There is no native MoL cast-beat driver in the current source to hook; this lane supplies the data and
shared adapter, not an implemented MoL runtime. That integration remains an explicit gap.

## Checks (command, result, gaps)

| Command / input | Result | Gaps |
| --- | --- | --- |
| `node --test tests/wait_and_beat_knowledge.test.js tests/lotm_cast_week.test.js` in primary | PASS 20/20; original starts, missing pack, reports, durability and new knowledge/wait invariants | The last wait refusal guard was subsequently covered by the focused file below; existing cast behavior inputs unchanged |
| `node --test tests/wait_and_beat_knowledge.test.js` in primary, final helper | PASS 5/5 | Synthetic module/native-owner fixtures, not browser UI |
| `npm run check:arch` in primary and final prepared-patch candidate | PASS; 6 grandfathered main imports, 205 cyclic edges, no growth; main 10085 vs 10115 baseline | No architecture baseline edits |
| `npm run build` in `/tmp/yair-g1-yt3xqobm` | PASS; owned sources plus prepared host patch compiled | First attempt lacked temporary `locales`; corrected asset link, then passed. Primary dist/index untouched |
| `node g1_probe.mjs` in that candidate | PASS: fresh native enrollment, walk, greeting, 358-minute quoted wait to dawn, same place, one person-view knowledge row, 20 cast knowledge entries; domain save/reload/export/import roundtrip | Native-state fixture; literal browser controls unrun |
| `node scripts/headless/lead_runs/lotm_beside_week.mjs --roundtrip` in prepared candidate; primary `runLotmBesideWeek({roundtrip:true})` plus owner assertions | PASS: four-day fixture, 73 carried / 11 mechanism-blocked beats; stored actor knowledge matches all 6/3/3 expected rows for scenes 005/304/503 | Outcomes settle offscreen; no claim to execute missing source verbs or stock transfers |
| Private pack spot check via `validateMolCast`, `beatKnowledgeWrites`, and expected actor/cause assertions | PASS; MoL validator clean, 11 shared-adapter writes; LOTM knowledge dates/causes retained | MoL native driver absent |
| Existing `scripts/ui_helpers.cjs` `launchChrome()` | BLOCKED: Chrome exits immediately in this sandbox, `Target page, context or browser has been closed` | No 1920×1080 screenshots or zero-page-error claim; coordinator runs browser |
| `git diff --check -- src/book_world_lotm_cast_host.js src/book_world_lotm_ui.js` | PASS | No commit performed; full suite belongs to coordinator |

Final prepared-candidate bundle SHA-256:
`d2eb8244d96b44fb8acecc3dc83f78b76ae5e89272a9a1cc478606c4a5cbfecd`.
Candidate and native probe remain at `/tmp/yair-g1-yt3xqobm`; source copies are frozen, asset links are live.
The primary bundle is deliberately not represented by this hash.

## Six-line floor and coordinator handoff

| Code | State |
| --- | --- |
| FLR1 | PASS for prepared candidate build/hash above; shared primary still needs patch adoption and rebuild |
| FLR2 | PARTIAL: fresh native-state fixture passes earned walk/greeting/wait route; browser launch blocked |
| FLR3 | PARTIAL: quote, cost, refusals and result text implemented; witnessed person details projected; 1920×1080 browser proof pending |
| FLR4 | PASS at native fixture scope: clock settlement, ordinary knowledge owner, target facts and known-person projection consume results; other-world UI and MoL driver remain unwired |
| FLR5 | PARTIAL: existing envelope save/reload/export/import fixtures pass; literal browser controls pending |
| FLR6 | Implemented, below floor; agent-verified at source/focused/native fixture scope, not human-reviewed |

Coordinator next steps: review and apply the two unowned hunks, rebuild, then run the fresh-origin desktop
wait/person-view/persistence journey with zero page errors. Retain the five aftermath rescores as scoped
claims: the knowledge-only row is closed at native-fixture scope; concealment, source-rejected verb,
held bread and the missing numerical offer anchor remain open. Full `npm test` is the coordinator's
pre-commit gate. All G1 owned paths are released for coordinator review and commit; no worker remains running.

## Coordinator review and browser floor (2026-10-28)

`G1_INTEGRATION.patch` applied by the coordinator. First floor: "Wait until dawn · 349 min" froze the page
268 s (one `update_timer(1)` per minute at about 0.77 s each). G1 fix round (resumed session) advances between
due beat times. Floor after the fix, bundle `0539519ff13ad55da2a49f6e6f2252275af9f34cc137e1ae9317b065d9f98cc3`
(with S1's hunks), fresh origin, 1920×1080, natural clock: walk, talk and wait by visible controls; waited 349
min in 13.4 s; the witnessed dawn beat wrote one player knowledge entry, shown in the person view; Save,
reload, Export and Import kept people and knowledge; zero page errors. Private screenshots
`g1-wait-quote.png`, `g1-wait-result.png`, `g1-person-knowledge.png`. Gaps: 13 s is above the 3 s target (CO3
in the handoff); the wait click was a DOM click because the panel re-renders each game minute (CO2); the
quoted label (352 min) and the result (349 min) differ by the minutes that passed between render and click.
FLR1-FLR6 met at this scope; agent-verified, not human-reviewed.
