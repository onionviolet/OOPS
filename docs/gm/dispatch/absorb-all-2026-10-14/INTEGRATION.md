# Absorb-all integration, pass 1 (2026-10-14)

Coordinator: the Claude session that launched the wave, under Weibao's "merge
when they're done" and "push after merging too" (COMMON.md). Branch
`absorb-all/integration`, fast-forwarded into `codex/gameplay-foundations`.

## Merged lanes (all gates passed)

| Lane | Branch | What landed |
| --- | --- | --- |
| air-workshop | `absorb/air-systems-cheats-completion` | Opt-in Village systems workshop and irrigation model (Air absorb) |
| upstream-dev | `absorb-all/upstream-dev` | Upstream dev `200f1ba6` town unlock; the 15-silver fee is actually debited |
| fork-resurvey | `absorb-all/fork-resurvey` | 42-fork / 61-head resurvey; known clear milestones, known bestiary sources, known-loot estimate |
| fork-fort | `absorb-all/fork-fort` | Opt-in Frontier Fort chain adapted from Schoko (MIT, cited in source) |
| p23-ui-polish | `absorb-all/p23-ui-polish` | Vendor states, condition/weather presentation, combat hit grammar, keyboard detail |
| p23-reveal-chain | `absorb-all/p23-reveal-chain` | Experience-to-interface chain; staged opening setting, default off |
| p23-life-loops | `absorb-all/p23-life-loops` | Village watch, bread stall, courier pamphlet, parcel relays, lifetime titles, bleeding trains Iron skin |

Not merged: the twelve wave-2 p23 feature lanes report **implemented-unverified**
until P00 (`p23-host-joins`) joins them natively; `air-wider` was still running.

## Integration fixes

- Conflicts were additive (imports, a facts hook, panel registration) and were
  resolved as unions; procgen (`4e13f97f`) and later main tips were merged in.
- `tests/absorb_c2.test.js`, `tests/p23_life_loops.test.js`: procgen requires a
  saved stream for local life; stream-free test calls get a fixed no-hit draw.
  Production already passes the seeded stream (`src/main.js`), and `drawUnit`
  advances its ordinal, so the new visitor roll is independent of search rolls.
- `scripts/upstream_dev_browser.cjs`: pre-procgen saves gain `expansion.streams`
  on load (procgen's documented migration); the rest of `expansion` stays exact.
- `scripts/systems_workshop_legacy.cjs`: newer content adds default availability
  keys; every old key must keep its value.
- `checks/p23-life-extra.cjs`: the visitor roll now draws from the seeded stream,
  so the check repeats real arrivals instead of overriding `Math.random`.
- Lane PROJECT.md sections were held out (PROJECT.md is dirty and owned by other
  sessions); their text is below for the next owner pass.

## Checks on the final candidate

- `npm run build`: pass. `npm test -- --test-concurrency=2`: **724/724 pass**.
- Fresh-origin 1366x768 Playwright, rebuilt bundle: workshop browser (10 cases),
  boundaries (10), persistence, legacy old-save (old client built from main tip
  `7c049c9a`, served at `.proof-old/`); upstream town entry (3 groups); fork
  resurvey; Fort route and restore (literal import, no reward replay);
  ui-polish (8 groups); reveal chain incl. save/reload/export/import; life loops
  browser (14) and extra (seeded visitor, bleeding trains Iron skin). All pass.
- Not committed: rebuilt `dist/` (main's `dist/` is dirty and owned by another
  session). The playable bundle needs a rebuild by whoever owns `dist/` next.

Remaining gate: Weibao's play/taste on every proposal above.

## Deferred PROJECT.md text

Fork resurvey proposal, 2026-10-14: A live resurvey found 42 forks and 61 branch
heads. New Ononoki content and fixes are already in the October 11 absorption.
The branch adds public or heard clear milestones, known bestiary sources in the
item log and a partial known-loot base-value estimate. Unknown rewards and
sources stay hidden; no save fields or rewards are added. [Resurvey](../../world-implementation/second-pass/fork-network-absorption/RESURVEY_2026-10-14.md),
[lane report](reports/fork-resurvey.md).

Proto23 reveal-chain proposal, 2026-10-14: first-level skill discovery and modest
native milestone perks, practiced Run/Investigate controls, held-herb recipe
learning, literacy-scaled study and earned reference panels. The optional staged
opening is off by default; the original beginning remains intact.
[Owner](P23_REVEAL_CHAIN.md).

Proto23 Village life loops proposal, 2026-10-14: morning watch, a weekly bread
stall, a discovered courier pamphlet, repeatable parcel relays and elder guidance
through Local life and Quests. Two public lifetime title goals use observed home
minutes and settled trade quantities. Guardian claws can cause native Bleeding
that trains Iron skin. Search states remaining finds.
[Owner](../../../PROTO23_VILLAGE_LIFE_LOOPS_2026-10-14.md).

# Pass 2: air-wider (2026-10-14)

Merged `absorb-all/air-wider` (P1 structured abilities, P2 repeatable outings,
P3 scoped true death with independent next life, P4 candidate tooling) onto main
`59917616`. Conflicts: imports (union) and the per-minute render/early-return
line, which keeps main's practice panel and `awakenOptionalStart()` and uses
air-wider's `nativeLifeEnded()` (chronicle end OR structured death, a superset
of the old check).

Checks: build pass; `npm test` **800/800**; fresh-origin 1366x768 air-wider
P1-P3 browser gates pass; P4 passes with the git-ignored private candidate
linked into the integration worktree for the run only and removed after (the
candidate stays uninstalled in main; installing it is a separate decision).
Regression subset passes: workshop browser, legacy old save (old client
`59917616`), Fort route, reveal chain, life-loop extra.

P00 (`p23-host-joins`) is still integrating the sixteen wave-2 p23 modules; its
fixture-scope question was approved by the coordinator (finished lanes' files
transfer to P00).
