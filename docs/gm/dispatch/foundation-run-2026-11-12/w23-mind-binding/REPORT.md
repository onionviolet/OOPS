# W23-M mind-binding law report

Status: proposal (AD32), agent-verified engine slice. No ledger write or played consumer. The 25% PWC60 gate fails, so the coordinator should leave these ledger rows blocked.

## Census and split

`blocked:mind-binding` has 1,758 rows in 159 ledgers. The exact `Effect verb.object/target/time` pattern appears in 1,098 rows (the wave's 1,225 labelled figure includes other label shapes). Those 1,098 contain 78 distinct verb.object pairs, 8 target values (`area`, `bound`, `cone`, `line`, `marked`, `none`, `self`, `touched`) and 7 time values (`delayed`, `instant`, `lasting`, `none`, `sustained`, `triggered`, unstated). The largest pairs are `alter.mind` 362 and `bind.mind` 258; 660 rows have no parseable sentence. These are not one mechanism.

The coherent slice is an individual, directed order stated as `bind.mind`. It needs an order and a target who can resist. The sentence, target and order change play. Duration, caster notch, defender resistance, guard and the destination are world dials or scene facts. Mood alteration, fear, charm, possession, memory editing, group control and mind copying remain blocked. Sharper future slugs: `mind-affect`, `mind-possession`, `memory-rewrite`, `group-compulsion`.

## Design

Default (AD56): one directed command wins an opposed will meeting before its stored effect fires. The existing notch contest resolver decides resistance, including a mind guard. `a.mind` then leases `mind_controller` and `mind_order`; its agency follows a reachable route, and the lease lapses on the world clock. A stored working owns trigger and save state. This follows the existing contest, mind, effect grammar and substrate owners (AD38). The fixed three-minute lease and two-notch caster in the generic case are **design dials**, not source claims. An authored world supplies its own duration, will ratings, order, cost and reach. The row label states none of those numbers. A resisted attempt changes no mind state; the prospective consumer must gate the fire on `contestMindBinding(...).won`.

Rejected designs: a generic `alter.mind` binding would treat mood and thought changes as orders; a universal mind property would duplicate `a.mind`; an automatic `bind.mind` take for every row would count possession and allegiance changes as simple commands. Area and line targets require a separate per-target will and reach decision.

The existing mind lease lapses and restores after save/reload. An early counter that ends a named working does **not** clear `mind_controller` or `mind_order`: `src/world_substrate_packs/mind.js` `endHold` uses `counterable`, which omits both. Shared-file proposal for the coordinator: add both names to the `endHold` set for `effect.end.working`, with a test showing that ending one named command leaves another layer intact. This lane did not edit that file. Until then, the demonstrated break route is the lease's expiry; early break remains a gap.

## Dry run

`node scripts/mind_binding_ledgers.mjs` writes nothing. It takes 45 / 1,758 (2.6%) overall and 16 / 356 (4.5%) held out by `isTest`. Both miss the 25% floor. Top blocked reasons: no parseable sentence 660, `alter.mind` is another mechanism 362, no stated directed order 56, different faculty or control model 50, `block.mind` 41, area target lacks individual resistance 38. No `--write` mode was run or supplied.

The case uses a stored `bind.mind` sentence with the existing `a.mind` pack. It checks that the order takes hold, the subject moves, save/restore preserves the lease and the lease lapses. The separate contest test proves that defender resistance and guard can defeat the same caster. The generic case does not yet execute the contest gate itself; it is an engine probe, not a player journey or canon verification.

## First consumer

`src/contest.js` `release()` is the first fight tie-in: a binding move uses its existing notch meeting as the will contest and fires the stored command only after a hit. It must not draw a second contest. A conversation action can call `contestMindBinding` for the same opposed rule, then apply the mind lease through its own social owner. The player should see the command, the defender's resistance or yielding, a noticeable change in directed behavior, and a way to break the lease. No consumer was edited. The actual played tie-in, per-target reach, early break and rebuilt browser proof are later gates under AD43.

## Files and checks

Owned source: `src/mind_binding_law.js`; tests: `tests/mind_binding_law.test.js`; dry run: `scripts/mind_binding_ledgers.mjs`; this report. No shared files or ledgers edited.

| Command | Result |
| --- | --- |
| `node --test tests/mind_binding_law.test.js` | PASS, 3/3 |
| `node --test tests/case_runner*.test.js tests/*_law.test.js` | PASS, 92/92 |
| `npm run -s check:arch` | PASS; reported grandfathered import/cycle baseline |
| `npm run -s check:rules` | FAIL, 2 new raw-duration strings in concurrently owned `src/world_packs/book_gu_keeper_lotus_route.js:58-59`; no finding on owned files |
| `npm run -s check:docs` | PASS, no new doc-slip hits |
| `node scripts/mind_binding_ledgers.mjs` | PASS execution; take 2.6% overall and 4.5% held out, below floor |

No browser or native gameplay proof: this lane owns no consumer. No commit, stage or push.
