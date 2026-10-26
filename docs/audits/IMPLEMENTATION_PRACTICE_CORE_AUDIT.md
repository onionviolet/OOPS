# Implementation practice core audit

Weibao, 2026-10-26: "Other rules and more to make future implementations
better? what else to consider? Continue accordingly". This follows the
[ability rules](../ABILITY_RULES.md) and [AD42](../RULES_INDEX.md#accepted-direction-rules-ad)
of 2026-10-25.

A repeatable audit of how implementation work goes wrong in this repo and which
rule, check or tool would have prevented it. Rounds extend this file; codes are
never restarted. Prefix IPC (unused before this round).

Status: proposals. Nothing here is accepted direction, changes a rulebook, or
authorizes a runtime or tooling change. Each proposal names the owner it would
land in.

## Round 1, 2026-10-26: what recurred on 2026-10-21 to 2026-10-25

### Evidence

A read-only sweep of 51 dispatch checkpoints and receipts, the reviews, the MCP
limits ledger and the rules index looked for patterns that repeat across two or
more lanes. Four citations were spot-checked directly: the tool-crack build lock,
review findings U1 and U4, and playtest P1.

| Code | Pattern | Lanes | Evidence | Consequence |
| --- | --- | --- | --- | --- |
| IPC1 | Native proof deferred by the single build output | 4+ | [tool-crack receipt](../gm/dispatch/tool-crack-2026-10-25/RECEIPT.md) line 9 ("Build lock: do not build... LOTM owns dist/index"); [hp-school receipt](../gm/dispatch/hp-school-progression-2026-10-25/RECEIPT.md) line 50; [master reconciliation](../gm/dispatch/master-reconciliation-2026-10-25/CHECKPOINT.md) | Lanes stop at "SOURCE READY, implemented-unverified"; every native journey is re-run in one late batch; a 181-path dirty-primary snapshot and 1,191 archived worktree files |
| IPC2 | Parallel or uncommitted work clobbers landed work, found late by review | 3+ | [uncommitted runtime review](../reviews/UNCOMMITTED_RUNTIME_REVIEW_2026-10-25.md) U2 (reference-crafting journey deleted), U3 (copied test imports missing exports), U1 (stale checkpoint); master-ready review F1 | Four high or medium defects found by review with about 174 paths in flight |
| IPC3 | A command writes, then persisting fails, with no rollback; or one copy of a fact updates and its siblings do not | 2 | Review U1 (baggage duplicated through a retained checkpoint), U4 (failed rust save leaves the setting changed) | Duplicated items; settings changed after a "failed" command |
| IPC4 | Harness and MCP wrapper defects mistaken for game defects | 2 | [playtest sweep](../reviews/PLAYTEST_SWEEP_2026-10-25.md) P1 (hidden loading text read as a blocker), BFA2, BMC1, BLD2, BLD3; about ten [MCP limits](../tools/game_mcp_limits.jsonl) entries | The first sweep rated zero systems playable; findings ranked against drifting builds |
| IPC5 | Proof through prepared fixtures where the feature is not naturally reachable | 3 | Reconciliation tool fixture "explicitly prepares practice, equipment and cave access"; LOTM q2 dose refusal "not reachable by play today"; sweep Meditation prerequisite | Honestly labelled, but entry routes stay unproven (MC3) |
| IPC6 | Seam found missing mid-lane, then an extension seam bolted on after a stop | 2 | hp-school receipt line 7 (lane stopped; coordinator authorized a new seam); engine-bindings checkpoint ("to avoid duplicate seams") | Stall and rework |
| IPC7 | Tests named by wave or slice | many files | [test leanness audit](../reviews/TEST_SUITE_LEANNESS_AUDIT_2026-10-25.md) R1-R6 | A large relocation round; already handled by the lean-tests rule |

Refuted or too thin to act on: hand-built commands beside an existing
descriptor (not seen in these sources; ABR6 covers it going forward), invented
numbers, cost vocabulary (one lane), generated-bundle merge conflicts, measured
token waste.

Rules that exist but were bypassed in practice: AR10, AR16 and AD36 (browser
proof, bypassed by IPC1); AR3, AR6 and AR7 (one authority, revalidate before
mutation, bypassed by IPC3); AR14 and AR15 (name the seam, reserve hot files;
IPC2, IPC6). For these the fix is a check or tool, not another rule.

### Root cause found for IPC1

`build.js` writes `dist/bundle.js` and then rewrites the tracked `index.html`
in place (lines 29 and 36-65). With every lane in the primary checkout (AD41),
one build changes files every other lane is testing against, so a lane that
builds must lock everyone else out. The lock follows from the build script, not
from the rules.

### ACCOUNT FOR NOW

| Code | Apply to the next implementation slice |
| --- | --- |
| IPC8 | **State the route kind in every receipt.** Each exercised route is "reached naturally from a fresh life" or "fixture-prepared (name)". The cheap check is the `yairpg-game` MCP walk from `game_new` (MC14); the browser run stays the UI proof. Owner: AD36 receipts. |
| IPC9 | **Every report carries its build identity.** Playtest, MCP and browser reports state the bundle SHA-256 (`game_freeze` returns it) and the tool version. A finding without one is not ranked against another build's findings. Owner: [GAME_MCP_LIMITS](../tools/GAME_MCP_LIMITS.md), playtest README. |
| IPC10 | **Check the tool before blaming the game.** A "blocker" from a wrapper or MCP is confirmed against the real DOM or a second route before it is ranked as a game defect; otherwise it goes to the limits ledger. Owner: GAME_MCP_LIMITS. |
| IPC11 | **A persisting command is one transaction.** Apply, persist, and on persist failure roll back every copy it touched (live state, checkpoints, paused copies). Tests for such commands include a throwing persist port. Owner: an AR6/AR7 application note in [ARCHITECTURE_RULES](../ARCHITECTURE_RULES.md). |
| IPC12 | **Name the seam before dispatch.** A runtime brief names the existing registry, descriptor or store it extends (AR14), checked against [SYSTEMS_REGISTER](../SYSTEMS_REGISTER.md) and, for abilities, [ABR5-ABR6](../ABILITY_RULES.md). A brief that cannot name one gets a short seam check first instead of a mid-lane stop. |

### LATER / DELEGATE (proposals, not dispatched)

| Code | Opportunity and owner | Suggested capability and effort | Done check |
| --- | --- | --- | --- |
| IPC13 | **Per-lane build output (fixes IPC1).** `build.js` takes an output directory (for example `BUILD_OUT=.lane-builds/<lane>`) and writes the bundle plus its own copy of `index.html` there, leaving tracked `index.html` and `dist/` alone. Adoption builds keep today's path. Owner: `build.js`, [shared worktree practice](../gm/SHARED_WORKTREE_PRACTICE.md). | Sonnet medium; one small tooling slice with a test; needs relative asset paths checked | Two lanes build at once in the primary checkout; `git status` shows no change to `index.html` or `dist/`; each lane's page loads in the browser with its own bundle hash |
| IPC14 | **Combined-candidate gate (fixes IPC2).** One command run before landing: full suite once, `check:arch`, `check:rules`, plus a fast check that every symbol a test imports still exists. Owner: AD36, SHARED_WORKTREE_PRACTICE. | Sonnet low-medium; script plus npm entry | A deliberately removed export fails the fast check in seconds, before the full suite |
| IPC15 | **Persist-failure test helper (enforces IPC11).** A shared fake persist port that throws, and a helper asserting state equals the pre-command snapshot. Owner: tests for persisting commands. | Sonnet medium | Review findings U1 and U4 each reproduce as a failing test before their fixes and pass after |
| IPC16 | **Natural-route check script (enforces IPC8).** A headless script per delivered route that reaches it by earned steps through the MCP and fails when a fixture is required. Owner: playtest/MCP tooling; builds on MC10. | Sonnet medium after the M1 walk names the routes | Each route reports natural or fixture with a bundle hash, in under a few minutes |
| IPC17 | **Compact MCP views (found by the M1 walk).** Every `game_look`/`game_click` reply repeats about 8k tokens of whole-screen text, so the [M1 route walk](../gm/dispatch/m1-route-walk-2026-10-26/ROUTES.md) got 6-8 calls per route instead of 40 and left routes unwalked. A delta or scoped-summary reply mode makes IPC16 affordable. Owner: [GAME_MCP_LIMITS](../tools/GAME_MCP_LIMITS.md), ledger entry 2026-10-26. | Sonnet medium in `scripts/mcp/` with a check in `game_mcp_check.mjs` | A 40-call route walk fits one agent's budget; a reply after one click carries only changed panels and actions |

### Rulebooks still missing (proposed order)

The index lists cheats, characters/companions, lives/continuation and time as
aspects without a dedicated rulebook. The recent work points to four rulebooks
that would most help future implementation, in this proposed default order:

1. **Content rows and census loading.** Every world's deepening now runs through
   census kinds mapped to seams (DWF165-DWF182): row identity, rung, sealed
   filter, the shallow-to-deep ladder and one row loader. Highest payoff because
   HP, LOTM and the next worlds all scale through it.
2. **Institutions, membership and missions.** `faction_rank.js`, the
   contribution store, lessons and duties recur in LOTM, HP, cultivation, Qud
   and the institution passes (implementation map C2, C19).
3. **People and companions.** Rows versus bespoke lives (DWF114), routines,
   knowledge of people, companions ([core audit](COMPANIONS_CORE_AUDIT.md)).
4. **Time, idle and away.** AD16-AD18 plus owning clocks; the master plan's MC5
   shows each slice re-deriving it.

Each would compose its existing owners the way [ABILITY_RULES](../ABILITY_RULES.md)
does. Under the index's rule, a new rulebook needs Weibao's request; this round
records the order, not the books.

Round verification: evidence from one read-only sonnet sweep with four direct
spot checks; `build.js` read in full. No runtime, tooling or rulebook edit.
