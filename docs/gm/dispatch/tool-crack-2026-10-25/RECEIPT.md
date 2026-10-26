# TQ199 Village crack slice, 2026-10-25

Status: SOURCE READY, implemented-unverified in the native UI. Custody recorded before edits and released to the coordinator at this receipt. Coordinator: `01a171d5-703b-70ed-9e74-2a44ce84701a`.

## Custody and scope

Exclusive source custody: `src/tools_domain.js`, `src/tool_profiles.js`, `src/tools_panel.js`, `tests/tools_domain.test.js`, `tests/tools_panel.test.js`, `tests/tools_commit_contract.test.js`, as needed. All six were clean at claim. One scoped TQ199 hunk is allowed in the tools palette after reread. Receipt/harness custody is this directory. Other dirty files retain their writers. No workers or worktrees.

Build lock: do not build, launch browsers/localhost, inspect processes, run npm test or generate output. LOTM owns dist/index at build `4db87189c6adf78b92c577270f3fc4dadebc23aecc74a40aea8f4c6057206205`. Stop at SOURCE READY and release source custody. No commit/push/adoption.

## Fit and plan

Owner: [TQ199, TQ133, TQ162](../../../TOOLS_AND_INSTRUMENTS_CONSIDERATIONS_2026-10-17.md). Rules: AD5/6–8/22/36/38/41; AR2–8/10/12/14/16; MR1/4/5/13/16/21; UR1/8/35/42/47/52/55/63. [Architecture](../../../ARCHITECTURE_RULES.md), [UI](../../../UI_RULES.md). Use existing tools domain registry, native per-copy e2 identity, native gathering gate/workCycle, current hand repair transaction/job. Typed damage is absent in the initial source; scalar wear and hand repair already exist. No replacement owner, random punitive breakage, catalogue or layered repair.

Original Village proposal: opt in at Village with an equipped Iron pickaxe to pry a wedged stone during the next native mining round. That actual work round strains this copy, adds a physical head crack and interrupts mining. Subsequent native gathering reads the unknown crack through tool rates. Bench inspection with Forging 2 and a tier-1 forge diagnoses it. Existing hand repair targets the diagnosed crack, consuming its current inputs/time; success closes that crack without restoring unrelated scalar wear. Ordinary hand wear repair remains unchanged. Cancellation returns reserved materials; failure retains the crack and existing max-loss behavior. Cause and values are proposals, not canon.

UI outcome: existing Tools place-service shows opt-in/cancel, inspection, observed diagnosis and targeted hand repair. Target 1920×1080, floor 1536×864, 14/21px after serialized integration. Mobile deferred. No visual claim before rebuild/native acceptance.

Compatibility: optional schema-1 per-copy fields; absent legacy fields mean no crack/no armed cause. Existing pending wear jobs preserve behavior. New typed targets validate/roundtrip. Durability off freezes and ignores typed state. Private saves untouched.

Failure scenario: stale quote or rejected durable write cannot spend, diagnose, arm or repair a different copy; duplicate start and cancellation settle once. Hidden truth must never appear in rows/quotes/tooltips before inspection.

## Initial source hashes

- `src/tools_domain.js`: `6eda40734c44cdce23ea933d3ae17acd5056d2c30031ac00bbe6ec80e4e9b957`
- `src/tool_profiles.js`: `e9204f2f6898dd1ddadfc0bb052d6b4ed1aa1677c8c5977c7a4afe12c55b93b5`
- `src/tools_panel.js`: `9de30a30149e0a5a9e3af6c4bc19b11e6fa69b998e7cf8b01b9a34e12f2a45ef`
- `tests/tools_domain.test.js`: `dd8391fa26c36b3eab65006514ff09171ac3c4a11fe41484e30f6f0e501da471`
- `tests/tools_panel.test.js`: `d53a71460606ad07ac134332bf7da87c2cd2c6c29a5c10adca01df8ac2607124`
- `tests/tools_commit_contract.test.js`: `7c3474f7b00e584921f4be562c7f7183be628a0f0993205f9da29ee935915c26`

## Source result and consumer

F1: The opted-in cause is saved as `instances[actualInventoryKey].leverNext`. The existing native completed gathering round calls `tools.workCycle` (`src/main.js:8938`); it wears the actual copy once, consumes the plan, writes `{type: 'crack', cause: 'wedged-stone', diagnosed: false}` on that key, and uses the existing `broken` return flag as a stop-work signal (`main.js:8942–8944`). It does not set scalar condition to zero. No extra reward, timer or random breakage is added. The cause is prepared in Village and resolves in base.frontier mining with this copy. Cancelling the plan prevents that cause.

F2: Restarting gathering calls `tools.gate` (`main.js:3475–3476`), which reads the copy's actual defect even when unknown. Native `LocationActivity.getActivityEfficiency` (`src/models/location.js:504–515`) consumes rates `{levels:0,speed:0.65,yield:0.85}`: retain the tool's skill bonus, slower rounds and fewer finds. Ordinary tools still return null rates, and broken scalar tools retain improvised fallback. Crack knowledge is separate: rows and quotes expose no raw damage; target snapshots use an opaque revision. Fitting Forge inspection records diagnosis. Inadequate means report inability to judge, with no invented diagnosis or skill XP.

F3: Existing `quoteRepair`/`executeRepair` and timed job target a diagnosed crack with their existing material, Forging, station and success/failure bands (Iron pickaxe: one Iron ingot when supplied, 20 base minutes). Success clears that damage and increments history without restoring unrelated scalar wear. Failure retains damage/diagnosis and the existing best-condition loss. Scalar/coin repair cannot erase a crack. Cancellation refunds reserved material once. Existing transaction snapshots cover tools state and durability; no new save writer or persistence owner.

## Checks

- `node --test tests/tools_domain.test.js tests/tools_panel.test.js tests/tools_commit_contract.test.js`: PASS 19/19 on final source below; [output](focused-tests.txt). Covers existing profile/rate goldens; actual native Iron pickaxe and native mining rate consumer; hidden, inadequate and fitting diagnosis; actual-copy identity; armed/unknown/diagnosed/pending/repaired JSON domain-state roundtrips; off-mode freeze; scalar repair separation; stale/duplicate/refused actions; rejected action/start/completion writes; cancellation refund; failed repair. Tests use generated fixtures, not private saves.
- `node --check src/tools_domain.js` and `node --check src/tools_panel.js`: PASS during editing; final source is parsed again by focused tests.
- `git diff --check` on five changed source/test paths plus scoped palette: PASS. No rule codes or rulebook changed.
- Build, full npm test, architecture/rules gates, native browser/desktop and actual save/reload/Export/literal Import: UNRUN, deliberately deferred under the LOTM build lock. Focused state JSON roundtrips are not native persistence proof.

## Integration and acceptance handoff

A1: Source custody is explicitly released to coordinator `01a171d5-703b-70ed-9e74-2a44ce84701a`. Five source/test files changed; `tests/tools_panel.test.js` was reserved but remains unchanged. No shared source/register, dist/index, generated build output, save, app, commit or push was written by this lane. No worker, browser, server, worktree or process inspection was started.

A2: After LOTM releases its native gate, serialize combined build/architecture/rules, and full npm test only at its assigned integration/commit stage. Exercise Village Tools at 1920×1080 and 1536×864, 14/21px. Enable durability, equip a disposable Iron pickaxe copy, ensure Forging 2 and forge tier 1, opt into next-round prying, and run native mining. Confirm round interruption/symptom without crack diagnosis; restart and compare actual mining rates. Return to Village, inspect, quote/start/cancel once, then complete targeted hand repair and confirm ordinary wear/identity retained. Save/reload/Export/literal Import at armed, unknown-damage, diagnosed and pending/completed-repair points. Check controls/disclosure at target viewports. Native transaction/whole-tick failure behavior remains its host owner's responsibility; this lane reuses the existing workCycle mutation boundary and does not claim a new whole-tick atomicity guarantee.

A3: Update shared register and play queue at integration if desired under coordinator custody. Broader TQ130–141 coverage and layered repair TQ239 remain open. Director fiction/numbers/visual acceptance and normal-app adoption are separate later states.

## Final changed source hashes

- `src/tools_domain.js`: `6ee50046cb1d28ea7c66cfe1281369d93778bd78c5204a49a94a3ec83330bebe`
- `src/tool_profiles.js`: `0aa3843a472a441ad7c7a4d0474a1f91ab736740cce71e8c5d45bfa250cccefd`
- `src/tools_panel.js`: `af874f97d2966d458ebb581dac540d7e960b244e9f7c58604e22dfecd30295cf`
- `tests/tools_domain.test.js`: `c4e669c71629a2af89bbc53715eac89adc00d69a6890d4da3e012037f692608c`
- `tests/tools_commit_contract.test.js`: `40a1fbc2c3d4501698dace4bec299775d0a229f7314f034c32c560a1e4a5c003`

Read-only dependency hashes for focused evidence:

- `src/absorb_e2/durability.js`: `4875b35c13f78b4e2c61bffd9ff7102df2d8b7b508c011c59fa0e7b94fc3c0fa`
- `src/models/location.js`: `31a83685b3e14601c8c3677a3971df53ed0489fb98114a564a0f18994823bae9`
- `src/native_craft_transaction.js`: `df314bdbde04ad3a5f413e9ff2d6bb5f323a6f444b430f8dc5921a3df2c898f5`
- `src/domain_registry.js`: `d8c0ffd423e1dbcb00dc9098e3e9eacb815cb5346e3dfa76c3229282a16ce07b`
- `src/native_tool_domains.js`: `5c1124262f055a2b7c3cd9723b2f4396a110119b6aa44b915b041ae5eeced371`
- `src/main.js`: `2b23c1dd2725933334417ec60f359c7316ceab29f63d9c38737137ec2ae9c1e0`
- `src/save_files.js`: `70d1ef3f7e8fbc2561df294a38a1ca5c4d539930b53d6e5fdd7e62271713b1aa`
- `src/items.js`: `54b2e7203106e9c56e0541c4014516452baf4a4411651ed6f6f4336dcf2c58c1`
- `src/data/locations.js`: `02d8ef54fb14e103176109a8ad4f3e72b734d07674bba7b62733404286d103cf`
- `tests/helpers/native_loader.mjs`: `1de023a5b41328b09cae7f2990b1a2077b124434805b245ede9741b113aca505`
