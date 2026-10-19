# Domain rules conformance scan, 2026-10-19

Scan of runtime code in `src/` against the accepted domain rules in
[DOMAIN_RULES](../DOMAIN_RULES.md) (BHR, CBR, ECR, SLR, PIR), and of how the
core and [architecture rules](../ARCHITECTURE_RULES.md) AR1–AR16 read beside
them. Weibao accepted the domain rulebooks on 2026-10-19 "as long as core rules
are followed": they are default dials under Rulebook 1–12 and AD1–AD38
([rules index](../RULES_INDEX.md)), and a core rule wins on conflict.

Status: findings and proposals, not accepted decisions (RULES_INDEX authority
level 4). Two small fixes were applied (DRC2, DRC10); everything else is a
backlog row. Rule-wording conflicts are proposals for Weibao; no rule text was
changed.

Codes use the local prefix DRC, because DC is already used in other docs
(RULES_INDEX reserved-prefix rule). Cite them from elsewhere as
`DOMAIN_RULES_CONFORMANCE_2026-10-19#DRC1`.

## Method

Started from the eight conflicts (RC1–RC8) the rule-application session
recorded, verified each against the code, then swept the remaining codes with
greps and targeted reads (no whole-file reads). Bounded by design: a code not
listed here was not found in conflict by that sweep, which is weaker than a
proof of conformance.

## Summary

| Severity | Count | Codes |
|---|---|---|
| High | 0 | |
| Medium | 6 | DRC1, DRC3, DRC4, DRC6, DRC7, DRC15 |
| Low | 9 | DRC5, DRC8, DRC9, DRC10 residual, DRC11, DRC12, DRC13, DRC14, DRC16 |
| Fixed here | 2 | DRC2 (fixed), DRC10 (fixed, residual Low kept open) |

Total 16 rows: 15 code or data gaps and 1 rule-wording conflict (DRC1).

## Gaps

Kind: **code** = the code departs from an accepted rule; **wording** = two
rules (or a rule and its check) read against each other.
Safe and small = local, no save change, outside the ECL2 money-wrapper scope,
about an hour with its regression.

| Code | From | Rule | Evidence | Kind | Severity | Proposed fix, effort | Safe and small |
|---|---|---|---|---|---|---|---|
| DRC1 | RC1 | AR1 | `docs/ARCHITECTURE_RULES.md:27` allows one registration line per feature in `main.js`, `save_files.js`, `display.js`; `scripts/check_architecture.mjs:45-46` fails any growth over the baseline, and the baseline only shrinks. M4 and CBL1 joined lines to stay at zero. | wording | Medium | Proposal for Weibao, see [DRC1 proposal](#drc1-proposal). XS doc edit once chosen. | Not applied: rule text is Weibao's |
| DRC2 | RC2 | CBR2, BHR17, CBR5 | `src/main.js:3898-3900` calls `kill_player` every tick while HP is 0; its non-combat branch (`src/main.js:4930`) published nothing and re-ran each tick. | code | Medium | **Fixed.** `harmCollapse` in `src/defeat_domain.js` publishes one `unconscious` record with cause kind `harm` and logs "has collapsed" once per collapse. The guard clears only when a whole tick ends above 0 HP (`heroStanding`, called after the per-tick effect update at `src/main.js:9054`), because a rest heal lifts HP above 0 mid-tick. Any publication arms it, and it starts armed, so a hero loaded at 0 HP is not counted again. A first version keyed on the Recovering effect failed the browser check: the save can hold Recovering at 1, which expires on the first tick after a reload. No save change (the slice already accepts `harm`). | Yes, done |
| DRC3 | RC2 | CBR2, BHR17 | `src/structured_life_runtime.js:21` raises `total_deaths` for a structured-pack terminal death (called from `src/main.js:1820`) and publishes no defeat record. | code | Medium | Publish `killed` with cause kind `harm` from main after `reconcileStructuredLifePlan`, only when it created the `structuredDeath` proof (that branch is once per life), inside the plan's commit binding. S. | No: sits on the ended-life proof and save path | **Closed 2026-10-19:** `reconcileStructuredLifePlan` stages a `killed`/`harm` record only where it creates the proof; `persistExpansionPlan` publishes it inside the write. Evidence: [CBL3](../COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md#cbl3-evidence-2026-10-19).
| DRC4 | RC2 | CBR2, CBR24 | Three saved battles end outside the publisher: road duel `src/native_battle.js:62`, Lio party battle `src/party_battle.js:95`, sluice battle `src/feature_expansion_battle.js:332`. Each writes its own `lost` result. | code | Medium | CBL3 in the [combat palette](../COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md): publish from each battle's commit with the plan's binding. S–M. | No: three transactional battle owners | **Closed 2026-10-19:** all three battles stage `plan.defeat` on a player loss; `persistExpansionPlan` publishes it inside the write. Browser-verified at 1920x1080 for the party battle. Evidence: [CBL3](../COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md#cbl3-evidence-2026-10-19).
| DRC5 | RC3 | ECR6, ECR26 | `src/items.js:1542` lamp value 250 and `:1549` oil 25 set by hand; no reference basket exists in `src/` (the `basket` in `market_life.js:27` is a shopping cart, not ECR6's basket). | code (data) | Low | ECL1: author a Village basket (meal, lodging, day's wage, basic tool) and derive these prices from it. M with design data. | No: needs basket design |
| DRC6 | RC4 | ECR10 | `src/components/trader_component.js:86-87`: refresh empties stock and refills from the template; only conserved campaign keys survive (`:80-84`). Goods the player sold, including a lamp, vanish. | code | Medium | Keep player-sold lots across refresh, marked by origin, so they can be bought back (ECX3). M. | No: needs a saved origin marker |
| DRC7 | RC5 | ECR16, ECR15 | Direct `character.money` writes at `src/main.js:1905, 2197, 3437, 3451, 3861, 5945, 6838, 8897, 9717, 9767`, `src/expansion_persistence.js:16`, `src/generated_people_ui.js:30`, `src/heir_inheritance.js:82`, `src/mixture_native.js:58`, plus envelope writes in `src/story_requests.js:63`. `add_money_to_character` (`src/main.js:3860`) is a partial seam. | code | Medium | ECX1 money wrapper plus ECL2 ledger, already proposed as its own session. M. | No: ECL2 scope, excluded here |
| DRC8 | RC6 | BHR2, BHR3, SLR8 | `src/structured_ability_runtime.js:91-93`: a lasting `price` is a list of ordinary effects pushed onto the command with no declared carrier or layer. | code (schema) | Low | RS26: add a carrier/layer field per price and grant, body prices keyed to the body instance once that key exists. S–M. | No: content schema change |
| DRC9 | RC7 | BHR25 | `src/crafting_home.js:32-33`: the button always reads "Drink one"; a known outcome appears only as a separate "Observed ..." line. | code (UI) | Low | When effects are observed, name them in the action text ("Drink one · restores HP ..."); keep the unknown case as is (AD6). XS, plus a crafting browser journey. | Yes, not done: outside the two flagged fixes |
| DRC10 | RC8 | PIR9, SLR29 | `src/skill_expansion_host.js` gave every disabled method one generic line. | code (UI) | Low | **Fixed** for authored requirements: a disabled practice, lesson or use row now names each failed requirement whose author wrote player text (`reason` on a requires leaf), plus the shared busy line. Residual: cost shortfalls (stamina, log, coin) stay generic, because the engine's cost error cannot tell the player's stock from the craftsman's attention. Residual fix: per-actor cost errors in `previewCommand`, S. | Fix: yes, done. Residual: no |
| DRC11 | sweep | PIR9 | `src/village_career_ui.js:35`: teaching-term buttons disabled when the method is not executable or the kit is out, with no per-button reason (the study line above says "executable now no"). | code (UI) | Low | Add the failing condition as the button's reason line. XS. | Yes, not done |
| DRC12 | sweep | PIR9 | `src/harvest_ui.js:16`: harvest buttons disabled while not ready or while a job runs, with no reason. | code (UI) | Low | Reason line: "Finish the current harvest first" or the readiness cause. XS. | Yes, not done |
| DRC13 | sweep | ECR15, ECR32 | `src/native_trade_transaction.js:14`: a sale credits `money + sellValue` with no merchant purse to debit. Merchants can always buy, so ECR32 is met only because purses do not exist; the coin is created without a recorded source. | code | Low | Record merchant purchases as a faucet in the ECL2 ledger; add purses only where a world wants them (ECR30). S inside ECL2. | No: ECL2 scope |
| DRC14 | sweep, from DRC2 | BHR10 | `src/defeat_domain.js` `harmCollapse`: a harm collapse records place but `by: []`; the actual cause (for example the venom) is not recorded, because the slice's cause keys are `kind`, `place`, `by` only. | code | Low | Add an optional `source` key to the cause and its validator, filled from the active effect that drained HP. S. | No: changes the slice validator |
| DRC15 | sweep | CBR2, BHR10 | `src/main.js:3900` decides combat by location type (`"parent_location" in current_location`). Venom ticking HP to 0 in a combat zone between fights publishes a combat defeat, raises `total_deaths` and names opponents from `current_combat`. | code | Medium | Decide by an active fight, not the zone; route the rest through `harmCollapse`. S, but it changes where the hero wakes. | No: behavior change needing a design call |
| DRC16 | sweep | BHR18, CBR27 | `src/main.js:9311`: no player offline policy exists, so away-time lethal boundaries are met only because nothing runs while away. | code (absent) | Low | None now. When an offline policy lands, it must stop at the downed boundary. | n/a |

Checked and met by the sweep: BHR16 (no hunger or starvation damage found);
CBR5 (`src/titles.js:21` names the counter "losing consciousness", not death);
ECR10 for unique items (`src/items.js:3758` tags them unsellable and
`src/display.js:2306` honors it); SLR32 (no `Math.random` in skill modules);
SLR29/SLR34 (plain practice names the route past its plateau, SLL12).

## DRC1 proposal

AR1 and its check describe two dials. Proposed default: keep the zero-growth
ratchet as the check, and read AR1's "one registration line" as the budget a
feature may spend only by moving at least one line out of the same file in the
same change (net zero). Condition for loosening: if a feature cannot pay for its
line without an unrelated refactor, it may grow the file by one line with
`ARCHITECTURE_BASELINE_RESET=1` and a named reason in its commit. Weibao decides
the wording; until then the check governs and features keep joining lines,
which costs readability (DRC2 and CBL1 both did).

## Fixes applied

Both changes stay inside their owners, need no save change and leave
`main.js` at its baseline (growth 0).

- DRC2: `src/defeat_domain.js` (`harmCollapse`, `heroStanding`),
  `src/main.js` (two changed lines plus the import, growth 0). Regressions: `tests/defeat_domain.test.js`
  (starts armed, one record while down, re-arms after a standing tick,
  a combat defeat arms it) and
  `tests/headless/collapse_once.test.js` (fresh hero in Village takes a venom
  that keeps HP at 0 for 30 minutes: one record, one log line,
  `total_deaths` unchanged, still one after a reload). A mutation that drops
  the guard fails the headless test.
- DRC10: `src/skill_expansion_host.js` (`knownReasons`). Regression:
  `tests/skill_disabled_reasons.test.js` (wet bench names "Use a dry bench for
  material practice."; out of teaching hours names both failed requirements in
  rule order; a missing log keeps the generic line).

Gates and the browser check are under [Evidence](#evidence).

## Evidence

Branch `codex/gameplay-foundations`, base HEAD `5cf88adab`, final source as
committed with this file:

- `npm run build` PASS; `npm test` and the headless journeys
  (`node --test tests/headless/*.test.js`): counts in the commit message.
- `npm run check:arch` PASS, growth 0 on `main.js`, `display.js`,
  `save_files.js`; `npm run check:rules` PASS.
- Browser, 1920×1080, fresh origin `http://localhost:19568`, rebuilt bundle:
  new game, venom injected into the save, reload. Over 31 game minutes at 0 HP
  in Village: one "Hero has collapsed" line, `defeat.counts` `{unconscious: 1}`
  with cause `harm`/`Village`, `total_deaths` 0. Reload with a real wall-clock
  gap, 24 more ticks at 0 HP: still one record, no new line, no critical
  message. Export/import not exercised: the save format did not change.
- DRC10 browser check: **implemented-unverified** at the visible layer.
  Reaching a learned timber method with the craftsman present takes a long
  in-game route; the presentation row that the button renders is covered by
  `tests/skill_disabled_reasons.test.js`. Acceptance backlog: see the wet-bench
  reason on the practice button at 1920×1080.

## Top remaining gaps

1. ~~DRC4 + DRC3~~ closed 2026-10-19 (CBL3).
2. DRC7 + DRC13: money has no single authority or ledger (ECX1/ECL2 session).
3. DRC6: trader refresh destroys sold goods (ECR10, ECX3).
