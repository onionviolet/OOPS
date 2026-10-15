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

## Air-wider candidate installed (2026-10-14)

Weibao: "install the air-wider candidate too". Copied the git-ignored
`private_packs/p06-air-wider-candidate/pack.json` (identity `p06_air_wider_v1`
rev 1, SHA-256 `5cbd5798…`) into the main checkout and listed it in
`private_packs/manifest.json` directly after `p06/pack.json`. Co-loaded, not a
replacement: original `p06/pack.json` is untouched (`89adcf18…`), and old saves
keep binding it. Manifest backup: `private_packs/manifest.json.bak-20261014-pre-air-wider`.
Play it on localhost with `?structured_candidate=p06_air_wider_v1`.

Checked on main tip `2aaf07ad` with the real manifest: all nine packs load (200),
zero page or console errors with and without the candidate query; the P4 native
route, pending and final literal-file import pass at 1366x768. Lethal candidate
content is omitted. To uninstall, restore the manifest backup and remove the folder.

# Pass 3: wave 2 (2026-10-14)

Merged onto main `59b02ab6`: P00 `p23-host-joins` (16 Proto23 lanes joined natively; opt-in single-key Undo authority P15), `sim-stepper` (deterministic `advanceTicks`, localhost `?test_hooks=1` only, dev mode stays off), `reach-fixes` (natural-play A1-A9), `int-fix` (2 real fixes: stable P18 controls, paid workshop work in primary actions; 6 harness updates, none weakened), `gate-determinism` (paused-engine snapshots; P15 trace proves the extra write is the scheduled tick autosave, one write per Save/Import/Undo), `stepper-perf` (planning read frame, lighter persistence path, P00 panels batched; 1.6-1.9x idle/work under equal load, combat unchanged, 7/7 byte-equal).

Merge resolutions: stepper's `simulateTick()` early exits are plain `return` (two converted, plus P15's backup branch); habitat save line kept beside P00's encounter line; save validators combined.

Final gate (`FINAL_GATE.sh`, MAXPAR=3, old client `ad89c04e`, real private packs): build pass; npm test 1742/1743, the one failure `alloy_equipment.test.js:118` is its 60 s fixture-child limit under load average ~200 and passes 5/5 alone in 5 s; all 47 browser checks pass, three on isolated retry under load (life-loops, p00 field-familiarity, p00 tranche2 gear). Workshop boundaries passed first try (its earlier hot-renderer retry did not recur).

Old saves: gain two documented empty counter bags and zero-XP level records for P00's registered NPCs; no items, stock, purse or knowledge. Undo opt-in makes that game need this build or later.

Known flakes (follow-up L3): tick-window assertions under heavy host load. Open: natural-play pass 2 with the stepper; stepper speed targets (1000/200 ticks/s); Weibao's play/taste on every proposal.
