# LP6 partner help proposal

Lio, the existing association porter, now offers help at the existing Village
workbench. In **Notes, practice & people → People → A porter’s guarded contest
→ Village bench partner · proposal**, choose **Ask Lio about bench help**.
Supply one actual survey kit and finish the three-minute re-rig, then Lio
helps pack each log into a usable survey kit in two minutes, spending one
stamina each. Decline the favor and he offers the slower solo plan: one log,
two player stamina and three minutes. Refusal creates no debt; a later completed
favor changes the offer. His remembered cause changes no friendship points.

If necessary, first meet the craftsman, open **Field association & workshop**,
join through its existing craft or survey route, then **Meet Lio, the association
porter**. His existing peaceful preparation makes the spare kit from one log.
The resulting kits remain ordinary native stock, usable by existing peaceful
settlement and workshop consumers. LP6 adds no second inventory or currency.

Lio remains in Village when the player leaves. The panel retains the agreement
and shows the return-to-Village boundary. Shared work reserves the actual porter
and the one-slot Village workbench. Its current job and remaining played minutes
explain unavailability; completion or cancellation releases the reservation.
Each shared batch rechecks his own harness kit, trained active method, body,
consent, health and stamina. Rest uses his existing paid re-rig action. Completed
packing closes that batch agreement; asking again opens another paid batch,
without a fixed batch count or stock refill.

Authorized by Weibao's 2026-10-14 LP2-LP8 dispatch. This is an original,
reversible **PROPOSAL**, not an accepted fiction/balance decision. The
[LP6 row](IMPLEMENTATION_PACKETS.md) and
[earlier P3](../hogwarts-games/IMPLEMENTATION_PACKETS.md#p3-a-study-partner-gives-particular-help)
own its scope. Desktop target is 1366 × 768; mobile, new rosters, new worlds,
prestige, and friendship XP are deferred. Standing direction is unchanged.

## Files

- `src/party_partner_content.js`: local favor, refusal and packing definitions;
  existing scheduler, native log/kit stock, porter and workbench do execution.
- `src/party_partner_facts.js` and two lines in `src/simulation_effects.js`:
  read-only absent-state defaults and current consent projection.
- `src/party_content.js`, `src/party_ui.js`: register the optional commands and
  show their cause, wait boundary, availability and visible disabled reasons.
- One line in `src/main.js`: refresh the porter panel when save ownership is
  acquired, including after reload/import. Rebuilt tracked bundle/map and
  `index.html` accompany the source.
- `tests/party_partner.test.js` and `lp6-evidence/`: focused contracts, repeatable
  browser harness, controlled seed generator, screenshots and exact results.

## Verification

- `npm run build`: PASS. Ink compiler check has zero diagnostics; esbuild passes.
- `node --test tests/party_partner.test.js tests/party_battle.test.js tests/people_knowledge.test.js`:
  **24 passed, zero failed**. Seven LP6 tests cover absent-state compatibility,
  introduced-only visibility, real reservation/cancellation, helped/declined
  useful outputs, boundary return, history repair, reload/no duplication, and
  completion-time loss of location, body or method with input refund.
- `npm test`: **1,401 tests, 1,398 passed, zero failed, three TODOs**.
  Existing TODOs concern legacy combat RNG; legacy local-life search/contact RNG;
  and legacy encounter/loot/craft/market/gather RNG. No unrelated failure repaired.
- `node docs/research/hogwarts-legacy/lp6-evidence/browser.cjs`: **12 groups
  passed**, including **eight exact Save/reload/Export/literal-file Import
  checkpoints**. These cover the pending favor, both waiting histories, waiting
  at the Shack boundary, both pending packing jobs and both completed results.
  Comparisons include the clock/calendar, relationship memories, waiting/task
  state, held inputs, native log/kit stock, Lio's body and bench reservations.
  Reinspection/restore never reissued stock. Boundary return restored the offer.
- `node docs/research/hogwarts-legacy/lp6-evidence/normal-timer.cjs`: **one
  default-worker-timer group passed**, with no timer/resource interception. The
  actual paid favor completed and enabled shared packing, consuming the kit
  while retaining zero trust-point gain.
- **Zero page errors** in both browser runs. Seven desktop screenshots were
  captured; the six controlled screenshots have no horizontal page overflow.
  Reviewed pending help, the real-worker offer, boundary refusal and both
  completed offers visually. All evidence uses only `127.0.0.1:8199`, fresh
  isolated contexts and the rebuilt bundle. `lp6-evidence/build.json` records
  its SHA-256 and an exact served-byte match.

The controlled run disables only `HackTimer.min.js` in its disposable browser
and uses Playwright's clock. That background worker replaces window timers and
otherwise bypasses the virtual clock. No game facts or rewards are injected.
The separate normal-timer run verifies the unmodified background transport.
`lp6-evidence/results.json` and `normal-timer.json` retain the exact check results;
`checks.txt` records the build and suite totals.

The browser harness creates a fresh disposable native envelope, then generates
an explicitly controlled pre-LP6 fixture using existing field enrollment,
craft membership, Lio introduction and peaceful kit preparation commands. Its
initial test stock, prior native greetings and unlocked Shack are setup, not a
claim that this run played the opening tutorial or acquired those prerequisites.
All LP6 choices, waiting, task completion, travel and file persistence checks use
the running game's controls. No private player save is read or modified.

To reproduce, run the build, then `browser.cjs`, then `normal-timer.cjs`, with
the worktree served on port 8199. The first browser script generates its own
disposable native envelope and pre-LP6 seed.

## Compatibility and time policy

No save schema bump or migration. LP6 actor facts, knowledge and directed
relationship memories remain absent from old saves until the optional interaction.
Read projections treat absent help/history as false/unanswered without writing
state. The existing scheduler owns jobs, reserved inputs, participant identity,
completion support and the one bench slot. Lio's own stock and body retain their
existing owners. Old states roundtrip unchanged; importing an existing record
does not call favor or packing effects again.

Work uses played game minutes under the existing host clock. Browser closure
adds no offline production. A pending job retains its actual due time and inputs;
returning to a saved record resumes that job rather than scheduling another.
Shared support lost before completion refunds reserved inputs and awards no kit.

## Limits and merge risks

Natural tutorial-to-membership acquisition is outside this controlled browser
slice. Mobile is deferred; there is no whole-world, roster or relationship-system
completion claim. Unsupported body, source and completion-location losses have
passing source checks, not browser-played evidence. LP6-specific mid-task consent withdrawal
is implemented-unverified; the completion predicate rechecks current consent.

Against `codex/gameplay-foundations` and sibling lanes, the main risks are the
small import/default-facts join in `simulation_effects.js`, one save-ownership
refresh line in `main.js`, and generated bundle/index conflicts. Preserve all
lanes' fact projections and refreshes; rebuild the combined bundle after merge.
Party-specific files and optional namespaced state should otherwise be local.
The shared Village workbench may legitimately be occupied by existing work;
LP6 obeys that capacity instead of creating a parallel slot.

The remaining acceptance gate is **Weibao's play and taste**. No push or merge.
