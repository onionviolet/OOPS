# C1 merge readiness: LOTM Q3–Q5, 2026-10-25

Status: ready for coordinator integration. Selected slices are committed and browser-verified. The one full-suite run and focused localhost-permitted retry cover all cases; the full invocation itself exited 1 because of sandbox restrictions. Branch `codex/lotm-q3-2026-10-25`, isolated worktree `~/.codex/worktrees/lotm-q3/yet-another-idle-rpg`. Primary checkout/master were read only; no push. Shared Git metadata was used only for this branch's commits/merges.

## F1: commits and master inputs

| Commit | Result |
|---|---|
| `40e186d15` | Q3 civil opening budget/history, native enrollment and civil display |
| `ba40dcc9d` | Merge master `9b997ea60a7eb12200dbc825684e6668403aa015`, including `af68acc0f` brewing/native material bridge/catalogue; no conflicts |
| `99d3a202b` | Repair retired copied-test API; current pathway dose-accounting tests; Q3 integration/browser receipt |
| `b7769821a` | Q4 same-world group clearance, stale-group regression and browser custody/persistence receipt |
| `167f10227` | Q5 physical-stock quotes, numeric equal-value barter rows, known trade records, regression and browser receipts |
| `1bedd2c5e` | Merge newer master `3dfc49cf3422c0262d86810df47459f53f3a4a67`; docs/skills-only delta, no runtime/test changes |

Q3 passed before Q4 source edits; Q4 passed and was committed before Q5 source edits. This is branch delivery, not a merge into master. No reset, rebase, force, stash or push.

Rules applied: AR1–AR16, WA13, AD38, SR1–SR24 where world/place/custody/persistence matter, ECR4/9/15/16/23, UR1–UR69. [Architecture](../../../ARCHITECTURE_RULES.md), [UI](../../../UI_RULES.md). Existing shared role leaf, simulation quote/commit, native custody and money publishers remain authoritative. No new shared typed seam or persistence schema. Proposed values remain proposals. Higher-grade stock, arbitrary barter baskets, new scheduling and mobile optimization are outside this slice.

## F2: behavior and bounded proof

[Q3 checkpoint](../lotm-q3-2026-10-25/CHECKPOINT.md): both profiles enroll, earn, spend and retain different balances through Save/reload/Export/literal Import. Opening history stays knowledge; no repeated opening charges or old-save grants. The inherited copied test was replaced with a current factory/save invariant test rather than reviving a retired assessor API.

[Q4 checkpoint](../lotm-q4-2026-10-25/CHECKPOINT.md): grade 2 is the captain/bishop rule-table case; grade 3 is the playable vault request/return. Living, able, present role holders must belong to the same world. A stale valid group cannot transfer after someone leaves, dies or changes world. Probationer refusal and formal-member sign-out/return were played, including custody round-trip persistence. A second-world fixture exercises the shared clearance leaf.

[Q5 checkpoint](CHECKPOINT.md): money and actual stock stay with the broker until verification, followed by release or refund and persistent known records. The fixed barter offer checks numeric posted equality and has a separate appraisal fee. Payment/appraisal cannot charge against missing broker stock. Open-trade saves require the physical lot; appraisal verdict flags are coherent. Only 18 immediate payment/appraisal definitions deliberately change their golden hashes. Timed jobs, IDs, costs, effects and claims stay stable.

Fresh-origin headless Chrome checks used rebuilt bundles and the native clock/actions at 1920×1080. Q5 adds three exact persistence checkpoints (pending money, pending barter, closed trades), a 1920×1080/1536×864 14/21 px matrix and 1800×1040 at 14 px. Primary and large-text screenshots were inspected; no page or record horizontal overflow, reports/back bar retained. Private fonts were unavailable; fallback font used. Natural weekly pacing and human taste are not established by the accelerated checks.

## F3: final combined verification input

Frozen commit `1bedd2c5e4753884927ab1de502a64b461ab733f`, clean export `/tmp/c1-lotm-final-e4q4iq7c` (removed after checks), with an isolated Git index at that commit and a read-only alternate object store. Dependencies linked from the existing worktree. No inherited untracked Q2 context or dirty queue/Q1 notes are included in this candidate. The final receipt changes documentation only.

- `src` Git tree: `9e2c775891b61f638c2ac7ebc7d93dfc50d7da01`.
- `tests` Git tree: `9cfd67df068b0eddf3256bdcf5b7d825d501c479`.
- Rebuilt bundle SHA-256: `2348a9de009fd5ddbc43ca8f652f4c47886ce56e09cc779eca5f66496716c0ba`, byte-identical to Q5 browser proof.

| Command | Result | Gaps |
|---|---|---|
| `npm run build` | PASS, clean final candidate | Generated bundle/map/index are verification outputs, excluded from lane commits |
| `npm run check:arch` | PASS; main −2, display −43, save_files 0 versus baselines; no new cycle | Initial archive lacked Git tracking metadata; isolated index added before final check |
| `npm run check:rules` | PASS, 0 warnings | Same tracking-metadata correction; no rulebook change, so no rule-behavior gate |
| `npm test` | 2886 cases: 2882 pass, 4 fail, 0 skipped; exit 1; single full invocation | All four failures were `listen EPERM` before their localhost browser fixture could run; no code assertion failures |
| `node --test tests/cheat_awakening.test.js tests/cheat_cards.test.js tests/rt_slice1_fixtures.test.js` with localhost permission | PASS, 9/9, exit 0 | Includes all four blocked cases; same frozen input, no source changes; no second full-suite run |
| `git diff --check` on owned source/test/doc paths | PASS | Generated minified outputs excluded; inherited context preserved |

Focused slices already passed: Q3 LOTM wildcard 91/91; Q4 clearance 6/6; Q5 broker/golden/old-save slice 12/12. The full run plus the nine-case permission retry cover the final runtime/test tree; no second full-suite invocation was run.

## R1: integration boundary and preserved work

Selected playable done checks pass, and all four full-run failures pass in the targeted retry. There is no remaining known code/test defect from this lane. A single all-green unrestricted full-suite invocation was not produced; the full run plus targeted retry are the exact combined evidence, in keeping with the instruction to run the full suite once. The coordinator's merge into master is the next authoritative integration gate, followed by rebuilding/adopting the normal app. No package, installation, deployment or human acceptance is claimed. Check master again at integration if it has advanced beyond `3dfc49cf3`.

Generated `dist/bundle.js`, `dist/bundle.js.map` and `index.html` were restored byte-for-byte from branch HEAD after browser verification. The coordinator must rebuild from the committed sources; the checked candidate demonstrates the resulting bundle identity. No user saves were read or modified; all browser saves are synthetic contexts.

Inherited worktree context is left untouched and uncommitted: the queue and Q1 checkpoint edits, and untracked `docs/gm/dispatch/lotm-q2-2026-10-23/`. These are not required dependencies of this branch's tests. The formerly untracked obsolete pathway test was explicitly repaired and committed under this dispatch. No shared owner docs or accepted-direction text were edited by C1.

Final verification summary: build, architecture, rules, Q3/Q4/Q5 browser done checks and each of the four environment-blocked test cases pass. The only next integration gate is the coordinator merging this branch into master and rebuilding there. Human pacing/taste and normal-app adoption remain distinct. [Machine receipt](final-verification.json). Raw logs remain `/tmp/c1-final-{build,arch,rules,tests,localhost-retry}.log`.
