# Primordial credit loop completion: handoff, 2026-10-24

Owner-linked brief for ONE fresh Sonnet coordinator. Read, in order: [CHECKPOINT](CHECKPOINT.md) (what the first worker built and
played), the [first-slice packet](../claude-coordinator-continuation-2026-10-23/FIRST_SLICE_PACKET_2026-10-23.md) (live summary:
loan meaning, SOURCE / AUTHORED / SHOWN BASIS dial labels, viewport targets), [GAP_AUDIT](../claude-coordinator-continuation-2026-10-23/GAP_AUDIT.md)
(latest rounds), [WORLD_PASS_RULES](../../../WORLD_PASS_RULES.md), [AGENT_USAGE_RULES](../../../AGENT_USAGE_RULES.md),
[ARCHITECTURE_RULES](../../../ARCHITECTURE_RULES.md), [PROGRESSION_GATE_RULES](../../../PROGRESSION_GATE_RULES.md), AGENTS.md.

## Released runtime area (first worker `ad425044b49d9f073` released it; hashes at release)

| File | sha256 |
|---|---|
| src/book_world_primordial_credit.js | 5ddc50077d782767ace3f13332ecc681efece2ed0800715ce20693ba8c84d98f |
| src/book_world_primordial_domain.js | 7808efefd254476abe8fa35995c3e0f2aa7c67718665254d74027dedd225dedb |
| src/book_world_primordial_host.js | a38fa8136dbc7d130317d59da367ad7c8576768cd61174ce86fc98cde790f0b3 |
| src/book_world_primordial_ui.js | b1b27e8e40feecbaf5d24bba233235aa7f6b2483700a007c211f58210707f50e |
| tests/primordial_credit.test.js | 2bd15b3c31ed3868d6aba0aeea1f9caf9331c043459059411dc6c0d7a0a16857 |
| docs/gm/dispatch/primordial-credit-2026-10-24/CHECKPOINT.md | 4e63f136df16344567a5d396fc008d612a412bb71419314cf48aac68a21de58c |

Shared files carrying the first worker's hunks (the hunks are the worker's; the files are shared): `src/carry_ledger.js` (file
sha256 8d8aeb81..., worker hunk diff hash b4f4a08e..., `registerCarryRules`) and `src/lives_carry_domain.js` (file sha256 8787490d...,
hunk diff hash 9f2e984f..., one import line). Dependency: `src/progression_gates.js` (untracked, other owner, sha256 3e7cf495...).
Other sessions hold uncommitted edits in `main.js`, `heir_inheritance.js`, `ui_extras.js`, `economy_standing*` and many more: never
edit, stash, reset, checkout or revert them. Coordination for integration runs through the existing O/F/A session
`local_5e36e0d0-18df-4629-8f2e-088a55ee0543`: name hashes and minimal hunks; no competing main, heir or serializer writers.

## Finite task (close the inability to repay)

1. ONE modest repeating native sect task that earns CP with time and cost (AUTHORED prototype rates, labelled, with reasons;
   reuse saved source facts for names and rent 30 CP a month; no new readers, downloads or worlds).
2. A Repay verb through the current ledger and domain: atomic payment or refusal (no partial state on failure); the four
   quantities (annual installment, accrued interest, remaining principal, total obligation) stay clearly distinct in the
   model, tests and UI; missed and partial payment behave consistently with the existing dials (3 grace days, forgiving, no
   standing ratchet; interest-first inside an installment is AUTHORED).
3. Real clock-driven interest through controlled normal game ticks; a calendar import cannot be the only evidence.
4. Browser proof on the rebuilt bundle, never-used origin: 1920x1080 and 1536x864 at 14px and at 21px; the cap refusal,
   partial repayment, full repayment; native Export, then literal Import and reload. The 300 CP curse only if the existing slice
   already exposes it. Excluded: Merit Pool, same-body restart, talent settling, later-Book mechanics, mobile.
5. Resolve "carries is display-only" truthfully: keep the selected loop default `drops`. If another world's `carries` is an
   advertised route, specify the exact additive heir copy-list seam and hand it to the incumbent owner (O/F/A or the heir lane)
   to make it real; otherwise remove the unsupported claim from player text and docs. Never change save policy silently.
6. Validation happens in an ISOLATED combined candidate that already contains `src/progression_gates.js` (assemble the candidate from
   HEAD plus exact named files by hash; do not copy whole shared files from other sessions into the primary). Committing is NOT a
   prerequisite and NOT authorized. Run focused regressions first, then the required combined checks (`npm run build`,
   `npm run check:arch`, the focused test files, `npm run check:rules`) once inputs change; the full `npm test` only if the
   candidate is the final one.

## Budget and limits

You plus at most 2 bounded workers (disjoint: one code, one proof), one finite budget including retries, no chains. Docs
under this folder and the packet/GAP_AUDIT/QUEUE records only. No commit, push, install, publish, download or personal
saves. Never open visible windows on the user's screen beyond the in-app preview pane. Label drafted / built / played /
human-accepted separately; source findings alone are not built gameplay.

## Required saves

Your chat id and model, actual ownership, the actual gates run and remaining human acceptance, in the CHECKPOINT here, the
GAP_AUDIT and the QUEUE (dated). Final report: what was built, files and hashes, checks one line each, viewport/text sizes
actually played, the carries resolution, the delivery packet for O/F/A, and exact remaining gates.
