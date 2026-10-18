# Implementation rule checks, 2026-10-16

Request: "can we make it check whether the implementation actually follows the
rules too? Is it worth doing so much checks?" Includes a more-to-consider pass.
This is an implementation receipt and recommendation, not a new standing
rulebook or acceptance of the proposed workflow below.

Update, 2026-10-16: Weibao subsequently requested shared agent guidance for
relevant checks, regressions and token efficiency. The resulting standing
workflow is [AD36](../RULES_INDEX.md#efficient-rule-verification-ad36).
The recommendations below preserve the earlier assessment; AD36 now owns when
agents check and reuse evidence. O1's incremental regression practice is covered
there; O2 remains an adjacent proposal rather than a new browser harness mandate.

Authority: [rules index](../RULES_INDEX.md), AD6–AD7, AD32–AD34;
[architecture](../ARCHITECTURE_RULES.md) AR3, AR6, AR8, AR10, AR13, AR16;
[making](../MAKING_RULES.md) MR5, MR33, MR36;
[UI](../UI_RULES.md) UR6, UR8–UR9, UR14–UR16.

## ACT NOW: completed

F1. Existing tests already exercise portions of standing rules. Added
`npm run check:rule-behavior` as a small optional runner over those tests.
Each group prints its rule references and actual scope. No duplicate assertions,
new runtime framework, gameplay changes or additional mandatory gate.

| Group | Rules partially exercised | Existing implementation checks | Limit |
|---|---|---|---|
| knowledge | AD6, AD7, AR8 | `people_knowledge.test.js`, `world_knowledge.test.js`: withheld facts, observation-based disclosure, read purity and reload cases | Specific projections; not every UI, AI, tooltip, sort or log |
| transactions | AR3, MR5 | `native_craft_transaction.test.js`: rollback, durable results, retry and identity preservation | Transaction helper and component fixtures; not complete crafting command/browser integration |
| saves | AR6, MR33 | `save_compatibility.test.js`: absent payload, retained retired content and unknown schema handling | Compatibility helper fixtures; not every save slice or literal browser Import |
| navigation | UR9 | `center_modes.test.js`: nested history, return lifecycle and native completion | Controller only; not actual Esc events, focus, back-bar visibility or discoverability |

Run all groups, or a selected group:

```sh
npm run check:rule-behavior
npm run check:rule-behavior -- knowledge
```

All these files already run under `npm test`. Running this command after a full
suite on unchanged inputs provides no additional behavioral evidence. Existing
`ui_contract.test.js` separately checks literal styles and foreign panel
insertion against an allowlist; that is useful structural evidence for UR6/UR8,
not proof of appearance. The architecture checker remains owned by the
[modular-seams run](../gm/dispatch/modular-seams-2026-10-16/CHECKPOINT.md);
this task does not duplicate its reserved implementation.

## ACCOUNT FOR NOW: recommended approach

F2. Checks pay for themselves when they catch a plausible, costly regression
with a stable observable result. Prioritize save loss, duplicated/lost goods,
knowledge leaks and broken return paths. Cheap structural checks can reject new
import cycles. Taste, pacing and whether an activity fits a world's logic need
review and play. A universal compliance percentage would hide these differences.

F3. Express a testable rule as a scenario with initial state, action and expected
observable result. Include the prohibited result: an observer learns no new
private fact; a failed durable write restores its debit; a stale action cannot
spend twice. Exercise actual producers and consumers where feasible. An isolated
helper passing does not prove its caller uses it correctly. Rebuild and exercise
the player journey for integration claims, retaining the existing persistence
gate when affected. No UI behavior or visual acceptance is claimed by this task.

F4. Keep cost proportional. During development, run the affected group. At the
existing completion checkpoint, use the required full suite and changed browser
journey. Do not add a whole-project semantic AI review to every edit. Inspect
neighboring systems when a named interaction warrants it. Static checks should
report exact edges or sites and use explicit, shrinking legacy exceptions;
reformatting and justified world variation should not trigger blanket bans.

F5. Coverage can mislead. Several rule codes beside one test are not independent
proofs. A passing snapshot can preserve the wrong behavior. A textual search can
miss an alias or indirect disclosure. Label each result by scenario, evidence
layer and scope; an untested part stays unverified. Keep proposed rules and
world-qualified exceptions distinct from standing defaults. Test synthetic
hidden values; keep real sealed truths out of public failure receipts.

## LATER / DELEGATE: proposals, not dispatched

| Code | Opportunity | Level / effort | Done check |
|---|---|---|---|
| O1 | As a real defect or feature touches a boundary, extend its existing tests with a rule-linked counterexample, including stale commands or preview purity where relevant | Focused implementation / small per boundary | Test fails on the reproduced violation and passes after the fix through the relevant real path |
| O2 | Reuse one rebuilt browser journey to check disclosure, action, Back/Esc and save/reload/Export/Import when that journey changes | Integration / medium | Fresh-origin desktop evidence at 1366×768; fixture setup distinguished from actual gameplay actions; failures reproducible |

No new agent dispatch or general rule engine is needed for these proposals.

## Verification receipt

`npm run check:rule-behavior`: 23 tests passed, 0 failed, about 0.26 seconds
reported by Node on the current shared checkout. This is partial source-level
implementation evidence. The runner does not establish whole-rule compliance,
browser integration, visual acceptance or a release gate.

## Implementation regression pass, 2026-10-16

Request: check the current implementation against relevant rules and add important
missing regressions under AD36, including a bounded more-to-consider pass.
Scope: observer disclosure (AD6–AD7, AR8), mixture quote revalidation (AR7,
MR4–MR5), native craft rollback ownership (AR3, MR5), and navigation recovery
(UR9). This is a risk-prioritized pass, not a whole-project compliance audit.
No UI source or persistence behavior change is planned; no new playable claim.

Writer for this pass: current Codex chat. Own edits only in
`tests/mixture_rule_modules.test.js`, `tests/native_craft_transaction.test.js`,
`tests/center_modes.test.js`, `tests/world_knowledge.test.js`, the focused runner
if needed, and this record. Runtime sources, shared core owners and the separate
modular-seams checker remain read-only. Target viewport for any future UI
integration claim remains desktop 1366×768; no layout or mobile work in this pass.

Planned missing cases: quote sequence/money/method changes; active quest instance
replaced in the registry; Back stop failure and retry; observer-specific world
identity. Reuse existing rollback, save batching, save-import rejection and
preview-purity tests instead of reproducing their assertions in another suite.
Run the changed focused files, then the existing full unit suite once. Source
and test input hashes plus results will be recorded below. No rebuild or browser
run for test-only additions unless a runtime correction becomes necessary.

### Results and disposition

Completed: three added tests and one expanded matrix in the existing suites.
No runtime source edits, migrations, commits, installs or user-save access.

| Finding | Evidence and consequence | Disposition |
|---|---|---|
| RG1: the old mixture test title promised stale sequence coverage, but its assertion only changed stock | The real quote/stage functions already reject changed admission tokens. Expanded the test to stock, owner sequence, money and method changes, checking rejection leaves owners/stock/knowledge/draw state unchanged and a refreshed quote remains usable | ACT NOW: done; AR7, MR4–MR5. Added this existing suite to the focused `transactions` group |
| RG2: active quest and registry instances can differ under the same ID | `nativeCraftQuestOwners` explicitly includes both instances and private task availability. Added rollback coverage for divergent flags and replaced registry entries; asserts original identities and exact private state return | ACT NOW: done; AR3, MR5. This is helper/fixture evidence, not a new end-to-end native crafting claim |
| RG3: a stop callback can reject Back | Added a failed-stop/retry case through the actual center controller. Failure retains current view/depth/destination; successful retry reaches the previous reference and does not rerun the stop while leaving it | ACT NOW: done; UR9. No rendered Esc/focus or discoverability claim |
| RG4: knowledge is observer-specific as well as world-specific | Added two actors in the same world with independent name/branch discoveries. The actual projection stays pure and does not borrow the player's facts for another actor | ACT NOW: done; AD6–AD7, AR8. Current UI callers use the player default; another observer's browser consumer is not claimed |
| RG5: full-suite completion is not green | `npm test` returned 2,053 passed, 2 failed, 3 TODO (2,058 total). Failures are in untouched `tests/cheat_awakening.test.js` at tests starting lines 33 and 71: storage injection was not reached, and an expected held card was absent | ACCOUNT FOR NOW: unresolved findings outside these four boundaries. Do not call whole-project verification passed; no speculative fix to shared cheat/start/clock owners |

All four scoped behaviors passed on the current implementation. These changes
close regression gaps; they do not demonstrate a production defect in those
scenarios. Each new/expanded test was also checked against an isolated temporary
source mutation: bypass quote validation, omit active-quest private owners,
drop Back's failed-stop restoration, or force the player observer. Each mutation
produced the intended assertion failure. Repository runtime files were untouched.

Source trace checked: mixing UI previews supply admission tokens to the native
stage path; `main.js` rollback call sites include `nativeCraftQuestOwners`;
the mounted center controller uses `createCenterModes`; identity readers use
`worldIdentityView`. This is source inspection, not refreshed browser evidence.

Efficiency: reused existing save retirement/batch parity, rejected import,
durable transaction and pure-preview tests. Ran four changed files once (27
passed), then the full suite once; did not rerun the focused wrapper afterward.
The full suite includes some existing isolated browser harnesses, but this pass
did not perform an additional manual browser journey or standalone gameplay build.
No runtime change needed either. `check:rules` passed with nine untracked-link
warnings; whitespace validation passed. No additional agent or audit loop.

### Evidence identity and remaining gates

Suite start HEAD: `1e3a59cb17fd4b865fcb8c4add259833f5c0d88b` plus the dirty
inputs captured in a 979-file SHA-256 manifest. All captured files were unchanged
when the suite finished. Manifest SHA-256:
`cc148644852434f4c7660883fa1a1198eb6375a9069f8a65ad5d396632d4b0ca`.
Private manifest, command logs, mutation assertion receipts and structured result:
`docs/research/rule-implementation-checks/private/2026-10-16-pass-1/` (gitignored).
The manifest identifies code/tests/styles/fixtures/scripts and named entry/rule
files; it is not a complete machine/environment or all-docs snapshot. Evidence
reuse still requires relevant dependencies and environment to match under AD36.

LATER / DELEGATE: RG5 needs a separate focused diagnosis of the existing
cheat/start/clock harness and actual consumer before a repair is selected.
Level: integration debugging; effort: small-to-medium, provisional. Done check:
reproduce the two failed assertions, distinguish harness setup from runtime
behavior, preserve optional-start/save semantics, and pass the affected suite
with any runtime fix exercised through the existing isolated browser path.
Not dispatched here. Do not infer that either failure was introduced by this
test-only change, or claim its root cause was established.

Little details accounted for: rejection checks compare the entire input, not
just the resource count; refreshed quotes prove recovery remains possible;
private quest fields need explicit owners even when object graphs look complete;
one world's known name is not shared knowledge between its actors. No new rules
or world mechanics follow from these regression scenarios. Broader UI appearance,
new site/crafting families, architecture worktree integration and full rule
coverage remain outside this bounded pass.
