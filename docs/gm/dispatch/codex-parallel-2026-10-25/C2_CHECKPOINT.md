# C2 MCP coverage checkpoint, 2026-10-25

Owner: C2. Isolated branch `codex/game-mcp-play-2026-10-25`; merge `5a2ed4c9e` includes requested master `9b997ea60`. No runtime source edits authorized here. Primary playtest report ownership transferred from B1 to C2 by Weibao.

Rules: AD6-AD8 (player observation), AD22 (save integrity), AD32/AD36 (authority and verification), AD34 (desktop acceptance separate), AR3/AR7/AR8, AU1-AU7. MCP seam only; no new gameplay rules.

Routes under investigation: native workspace More panels selector opens Projects, Continuing connection and Tingen workroom. LOTM enrollment additionally requires the existing localhost `lotm_probe=1` flag. No synthetic state or sealed-truth route.

Finite dispatch: 4 fresh Luna-medium workers, one invocation per area (Mistglass, LOTM, continuation, combat), max 4 concurrent. Each owns only its C2 area report and scratch receipts. Coordinator integrates the report. No descendants or runtime edits. Allowance telemetry unavailable; bounded dispatch, no API fallback. Stop each after requested journeys or concrete reproducible remaining blockers and persistence receipts.

Frozen-bundle path deferred after inspection: `game_new.path` already means an encoded save. Runner reload rebuilds a harness-instrumented bundle and reads checkout HTML/CSS; a bundle-only option would not pin the game. A complete frozen root is outside this cheap wrapper seam.

## Route diagnosis and implementation

All three routes exist. B1's title text was hidden, but the native workspace's
`startScreen` remained `open`, because the runner's MutationObserver never
called the native start-screen observer. C2 implements bounded attribute
observer delivery at settle boundaries (style included), so PLAY now closes
that mode through the existing observer. No gameplay state edit.

A first regression caught another distinction: Layout / Panels / Show restores
a module's dock setting, but unmapped parity modules still need the ordinary
More panels expansion route. C2's `panel` shortcut uses that visible selector,
validates the option, and dispatches native input/change. `game_click` also
accepts `value` with a select `key`; hidden, disabled, absent options fail.

Runtime identity: committed `src` tree `6f928fb9523f41ce21c8140461ba39d81ecc7a52`,
`dist/bundle.js` SHA-256 `652f967dc96777ce3c78a01a5d214c082e30e14000e9cccecd9ad1cc1897aec4`.
MCP actually bundles this worktree's source with harness instrumentation; the
dist hash is a build receipt, not a claim that MCP imports dist. Concurrent
primary uncommitted gameplay is excluded from these journeys.

## Verification while editing

- `npm run build`: PASS; branch runtime bundle hash above. Generated source-map path drift reverted from this lane's build; no dist change selected.
- `npm run check:arch`: PASS; existing grandfathered baseline unchanged.
- `npm run check:rules`: PASS, zero warnings; no rule changes, rule-behavior rerun not needed.
- `npm test`: 2,872/2,877 pass. Four localhost fixtures denied with `listen EPERM`; one independent alloy fixture reached its 60-second timeout under concurrent tests. No changed runtime code.
- `node --test tests/cheat_awakening.test.js tests/cheat_cards.test.js tests/rt_slice1_fixtures.test.js` outside sandbox: PASS 9/9, covering all four denied cases.
- `YAIRPG_FIXTURE_TIMEOUT_MS=180000 node --test tests/alloy_equipment.test.js`: PASS 5/5; timeout failure cleared in focused rerun.
- `node scripts/mcp/game_mcp_check.mjs`: in progress; intermediate route assertions corrected as described above. No claim of final pass yet.

Focused route receipt: `/tmp/c2-mist-route.log` reaches `Mistglass conservatory`
and its native Learn method control after elder hello, center Back, one played
minute, place Options, Iona ledger enrollment, More panels → Projects and the
two project disclosures. Tingen enrollment reached its actual workroom;
continuation exposed Begin a fresh life. Final combined MCP regression remains
running separately; intermediate failures were route/test assumptions, not
runtime source changes.

## Final tool receipt (supersedes pending regression lines above)

`35ef1a1f3` commits the runtime harness/MCP change; runtime `src` is unchanged.
`node scripts/mcp/game_mcp_check.mjs`: PASS on final regression inputs, nine
tools, deterministic save hash `ce1f755934f76ad5`. All three previously blocked
native entries, native travel/resource return, hidden startup text, action
pagination, save/export/load/path resume, unique exports and rejected external
origins/save paths passed. The inherited dropdown assertion now accepts its
native accessibility decoration instead of pinning one incidental generated key.
No implementation edits followed this passing run.

Four Luna-medium play workers are active; each owns its C2 area report. Parent
reviews their receipts and folds conclusions into the primary playtest report.
Temporary `/tmp/c2_session_host.mjs` keeps adaptive MCP sessions alive over stdin;
it is a client convenience, not a new game backend or gameplay entry route.

## Follow-up defect discovered by worker: asynchronous native click

The continuation worker reproduced `game_look: "undefined" is not valid JSON`
after confirming a fresh life. The native click started validation in a frame,
while the runner returned before that command's authority operation/reload
finished. This was a harness synchronization gap, not a player state injection.
C2 now waits for native authority activity and requested reloads to settle,
with the existing 40-second virtual timer bound. The regression now confirms
fresh life itself, opens the ordinary panel after reload, verifies paused
arrival and saves through the new writable runtime.

- `/tmp/c2-fresh-check.mjs` via real MCP: PASS; Life 2 arrival paused, native Continue and reciprocal First-life controls, save hash `bd500535ce527677`.
- `node scripts/mcp/game_mcp_check.mjs`: expanded final rerun in progress after this new fix.
- `node --test tests/interaction_native.test.js tests/scenario_facade.test.js tests/palette_native.test.js tests/crafting_native_reload.test.js tests/domain_instance_isolation.test.js`: focused changed-runner consumers in progress. The earlier full suite's unrelated passing inputs are retained; no gameplay source changed.

Final post-fix verification:
- `node scripts/mcp/game_mcp_check.mjs`: PASS; nine tools, hash `ce1f755934f76ad5`; includes confirmed fresh-life arrival and native save. Receipt `/tmp/c2-mcp-check-final.log`.
- `node --test tests/interaction_native.test.js tests/scenario_facade.test.js tests/palette_native.test.js tests/crafting_native_reload.test.js tests/domain_instance_isolation.test.js`: PASS 14/14, receipt `/tmp/c2-runner-consumers.log`.
- `git diff --check`: PASS. Source runtime, architecture and rule-index inputs remain unchanged; earlier build/arch/rules and unrelated full-suite evidence retained.

A worker accidentally called `game_report_limit` without fields once. Its blank
raw ledger line is retained as an execution receipt, not an actionable finding.
The actual continuation failure and fix are described above and in its report.

Review qualification for CCC1: the “already applied” message after a reciprocal
return corresponds to the native event-token equality guard. Since the harness
re-seeds deterministic crypto on reload, identity replay is a possible harness
cause. C2 does not promote this observation to a native runtime defect without
isolation. It remains a separately labeled observation/coverage limitation.
- Harness-only UUID probe (`HeadlessGame` seed 251045, two realm installations, compare first UUID; no game loaded): PASS as diagnosis, `firstUuidRepeatsAfterRealmReinstall: true`. Supports a harness cause for CCC1; it is not native browser reproduction or gameplay completion evidence.


## C2 delivery close

The four Luna-medium workers completed the bounded assigned play journeys; the same Mistglass worker performed its prerequisite-route follow-up. No fifth worker or descendants were started. Detailed area reports and the consolidated [C2 follow-up](../../../reviews/PLAYTEST_SWEEP_2026-10-25.md#c2-follow-up) record exact runtime, seeds, routes, saves and gaps. The report lives in the primary checkout and is copied into this branch for delivery. All worker hosts were stopped at handoff.

BMC1/BLD2/BLD3 entry coverage is unblocked. Mistglass method/condensate/sluice/dose, both Tingen Sequence 9 lives, reciprocal continuation/checkpoints, first combat-group win and live-fight persistence were exercised. Trial prerequisite discovery, brewing means and outcome, withdrawal/defeat, and initial return remain bounded gaps. Advanced cultivation, law memory/baggage/U1 and dedicated combat review require a candidate containing those newer systems. No claim that the excluded primary runtime passes or fails them.

Final code inputs are the runner SHA `d3c0beb4aa949fc9ffd31087aa466f33dd96964fd5cbe651c0b3c38c0997cc0a` and worker SHA `a8ece8452e1bc7b32590b6784ca77ccddf930ccbf718062a74d4747cc4031ee7`. The final expanded MCP check and 14 changed-runner consumer tests passed after the last code edit. Earlier full-suite failures cleared in the focused reruns above; unaffected build/architecture/rules and suite evidence is reused. No whole-suite rerun after CT2.

The refreshed `C2_game_mcp.patch` compares against primary's current actual untracked `scripts/mcp/` and existing runner/limit records, preserving their input lines. `git apply --check` validates applicability only. Primary tool/runtime files are not changed by this delivery. Branch commits are authorized; no push or primary integration is included.
