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
