# Agentic power enhancements, 2026-10-25

Scope: practical changes that make Claude and Codex work in this repository faster, cheaper and more reliably. This is a proposal and implementation record, not a change to accepted agent policy. Apply AU1-AU15 and AD37; tool and workflow work also follows the shared worktree practice. Evidence below comes from the 2026-10-25 parallel run records and current repository owners.

## Ranked improvements

| Rank | Improvement | Level | Effort | Evidence and rationale | Done check |
|---|---|---|---|---|---|
| 1 | **Canonical detached lane launcher and status CLI** (implemented here) | ACT NOW | M | The current run-specific `runs/launch.py` hardcodes the Codex binary and primary checkout paths, takes positional arguments without validation, and forks twice. The shared-worktree guide points to it, while the dedup audit counted 41 copies across 22 variants. A canonical tool should take explicit workdir, run directory, model/effort, resume ID, binary and access directories; write a receipt and distinguish process liveness from a successful final result. | `python3 -m unittest discover -s scripts/lanes/tests -v` passes; launch a disposable fake CLI and verify arguments, PID receipt, log and final-message path; then one authorized real lane completes and its status is inspectable. |
| 2 | **Read-only merge-readiness report** (implemented here) | ACT NOW | M | Shared worktree guidance requires a fresh base, clean worktree and explicit overlap review. Existing practice is documented but not machine summarized; C5's inventory patch failed because expected lines were absent (`runs/c5-reconcile.log:6738`), with concurrent drift a plausible but unproven cause. Report ancestry, dirty files, merge-tree result and changed paths before integration. | Synthetic clean, dirty, stale-base and conflicting branches produce correct blockers; report does not alter refs, index or worktree. |
| 3 | **Tool preflight and failure-route hints** | ACCOUNT FOR NOW | M | C4 hit a missing `subagent-scoping.md` skill helper (`runs/c4-lean-tests.log:2062`) and process creation failed (`:4281`). B1's last note reports four sandbox-denied tests followed by a successful targeted rerun (`runs/b1-game-mcp-play.last.md:5`). Registry already has `show` and scoped `doctor --probe`, but agents still discover missing capabilities late. Add a compact `doctor` preset for selected task tools and explain the supported fallback per failure class. | On a clean machine, preflight identifies missing executable, missing skill file and unavailable MCP tool separately; each report points to a documented fallback and does not install or launch anything implicitly. |
| 4 | **Frozen-bundle game runner** | ACCOUNT FOR NOW | M | Game MCP limits explicitly say the current server boots the working tree; an import cycle broke `game_new` during another session's unfinished edit, and the owner lists a frozen bundle as the expansion. This avoids runtime evidence depending on concurrent uncommitted source. | Given a built bundle path and fresh test origin, multiple game sessions load the same SHA-256 identity while the working tree changes; fresh browser acceptance remains separate. |
| 5 | **Ownership reservation receipts for lanes** | ACCOUNT FOR NOW | M | A3 found another reader wave active and correctly withheld duplicate readers while ownership release was pending (`runs/a3-you-are-summoned.last.md:3`). Shared worktree practice already says one writer per file area, but no small, inspectable reservation protocol is standard across dispatches. Start with advisory path claims and expiry/heartbeat, never a lock that silently deletes another agent's work. | Two lane receipts claiming overlapping paths warn or refuse the second reservation; expired claims require explicit owner check; no source file is locked or modified. |
| 6 | **Budget and response-limit checkpoint helper** | ACCOUNT FOR NOW | M | A3 reports a spot-check over its declared word bound with clipped output and stopped further loading (`runs/a3-you-are-summoned.last.md:5`); B2 reports one reader over response cap with repair documented (`runs/b2-wish-upon-the-stars.last.md:3`); B3 records response-limit deviations and unavailable quota telemetry (`runs/b3-godclads.last.md:5`). AU2, AU7, AU10, AU12 and AU14 already define the controls, but dispatch receipts should make the active bound and checkpoint visible. | A reader receipt shows source range, response count, remaining repair slot, context/usage telemetry availability and exact stop condition; synthetic bound breach returns a partial checkpoint without dispatching another reader. |
| 7 | **Tighten skill routing and add a lane handoff template** | LATER / DELEGATE | S-M | Current skills cover topic expansion, source deep dives and mechanic absorption. Repeated process/tool friction suggests a small `lane-operations` skill could route launch/status/preflight, remind about primary-checkout overlap, and produce a compact evidence handoff. Keep it separate from domain skills so it is loaded only for delegated execution. | Claude and Codex dry-runs select the skill for lane operations, cite the same owner docs, and generate a bounded handoff with owned files, checks and open gates. |
| 8 | **Prompt templates for bounded extraction, implementation and verification** | LATER / DELEGATE | S | AU rules already give strong source and budget contracts. Reusable prompts can reduce repeated setup and missing constraints; they should link to live rules rather than copy them. | One template each for extraction, code lane, and merge/review includes scope, owner paths, model/effort, shared budget, stop condition, checks and final evidence fields; a link check finds no stale policy copies. |
| 9 | **MCP ergonomics from the limits ledger** | LATER / DELEGATE | M | `docs/tools/GAME_MCP_LIMITS.md` already routes limits into its JSONL ledger and requires repeated/stalling entries to become tested tools. The specific frozen-bundle request ranks above broad API growth; screenshots, sessions, pagination and quote actions remain possible only when a real lane demonstrates repeated cost. | Every implemented ledger entry has a named test in `scripts/mcp/game_mcp_check.mjs`; unrelated MCP behavior is unchanged. |

## Observed run friction

- **Sandbox and environment:** four sandbox-denied tests needed a targeted rerun (B1 final note); C4 logged a sandbox-denied baseline tree (`runs/c4-lean-tests.log:4447-4450`). This points to clearer preflight and rerun instructions, not broader permissions by default.
- **Missing tools and process startup:** C4 could not read a referenced skill helper (`:2062`) and logged process creation failure (`:4281`). One failed fetch/process route should trigger a different documented route, not repeated variants.
- **Bound overruns:** A3's clipped spot-check and B2/B3 response-limit notes show why the budget receipt should record observed telemetry separately from policy bounds. B3 says quota telemetry was unavailable, so no quota cost is inferred here.
- **Ownership:** A3's active-reader check prevented duplicate source work. Keep explicit ownership release visible across both file writers and source ranges.
- **Concurrent drift:** C5's patch mismatch is observed; concurrent editing as its cause is an inference, not proven by that log line.

The D6 run itself only records setup and its brief in the inspected log; it is not used as evidence of a failure.

## More to consider round

### ACT NOW (done in this branch)

- Add `scripts/lanes/lanes.py` with detached launch, JSON process receipt, status, and read-only merge report. The command-line surface is a first slice; it does not claim automatic ownership locking, test discovery, approval elevation or merge execution.
- Add focused Python tests and usage notes. Test results prove only these helper paths.

### ACCOUNT FOR NOW

- Decide whether the launch receipt should accept a single file prompt or a manifest of multiple prompts and explicit sibling budgets. Default: keep one lane per invocation and leave shared-budget accounting in the owner checkpoint until a concrete format is selected.
- Pilot the launcher from both Claude and Codex execution contexts. The current launcher invokes Codex only; Claude lane execution should stay host-native until a stable unattended route exists.
- Extend merge reporting with primary-checkout path overlap and a required-owner acknowledgement only after the report reads the project's existing task records reliably.
- Make failure messages actionable while preserving the current security boundary: no automatic sandbox widening, installation, account sign-in, commit, merge or push.

### LATER / DELEGATE

- Frozen-bundle game runner: medium level, medium effort; done when a hash-pinned bundle survives concurrent source edits and real browser proof is captured.
- Advisory ownership reservations: medium level, medium effort; done when overlapping claims are detected and stale claims cannot release another owner's work.
- Preflight plus lane-operations skill and prompt templates: low level, small effort; done when representative Claude and Codex tasks discover tools early and hand off the same evidence fields.
- Budget checkpoint helper: medium level, medium effort; done when synthetic response/source limits checkpoint without hidden continuation and report unknown quota telemetry honestly.
- MCP limits ledger follow-through: medium level, scoped effort; done per repeated entry with test and a browser/runtime distinction intact.

## Implementation status

Implemented source and tests are in `scripts/lanes/`; focused test command: `python3 -m unittest discover -s scripts/lanes/tests -v`. This branch does not claim a live Codex lane was launched or a real integration branch was accepted. Current report status and future gates remain separate from merge, commit and push.

## Primary-checkout overlap check

Checked exact paths with `git status --short -- <path>` in `/Users/weiwei/code/yet-another-idle-rpg` before editing. `scripts/lanes/` and the new report filename had no existing edits. The primary checkout has two untracked sibling files under `docs/tools/` (`GAME_MCP_LIMITS.md` and `game_mcp_limits.jsonl`), which are C2's MCP work; this lane added only `AGENTIC_POWER_2026-10-25.md` and did not edit either sibling or `scripts/mcp/`. Source and test files in this branch: `scripts/lanes/lanes.py`, `scripts/lanes/README.md`, and `scripts/lanes/tests/test_lanes.py`.
