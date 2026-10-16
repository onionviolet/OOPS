# R1: check resolver, exact odds and spend hooks

Status: source proposal on `codex/rbe-r1-resolver`, baseline `ba46670a`.
Root codes: EP1, EP2, EP10, EA1, EA2, EA3, EA17, EA18, A8, A10, A11,
MC5-5. No existing runtime file was edited. No gameplay acceptance is claimed.
Authority: [COMMON.md](../COMMON.md) and the R1 assignment. COMMON.md and
the root rulebook palette were read in the main checkout because they are
not in the baseline worktree. Existing USER_VISION.md/PROJECT.md priorities
remain in force. This lane adds no UI; desktop/laptop consumer proof is later.

## Delivered source

| Code | State | Delivery and evidence |
|---|---|---|
| R1-F1 | SHOWN | EP1/EA1: `src/check_contract.js:21` admits `sum_target`, `roll_under`, `success_pool` profiles. `src/check_resolver.js:23` implements pure `resolveCheck(profile, check, drawAddress)`. Tests cover d20, advantage/disadvantage, 2d6, 3d6, d100 and 5d6 success pools. |
| R1-F2 | SHOWN | EA2/A11/MC5-5: `src/check_odds.js:10` convolves BigInt face counts; selection uses cumulative squared counts. `src/check_odds.js:37` runs the same policy evaluator as the resolver, including conditional spends and replacement rerolls. Probabilities are reduced integer strings, safe to JSON roundtrip. |
| R1-F3 | SHOWN | EA3: `src/check_contract.js:116` returns resource remainders and named before/after spend records. `src/check_resolver.js:64` can replace a pending proposal after the author sees its roll. It retains original die slots. These pure proposals do not debit live game state. |
| R1-F4 | SHOWN | EA17/GR9: `src/check_resolver.js:49` captures profile id@revision, frozen profile/check inputs, input fingerprint, complete candidate dice, accepted raw draws and attempt numbers, selected candidate, modifiers, spends, result and top reasons. `src/check_resolver.js:56` replays and compares the entire receipt. This detects accidental edits, not hostile forgery. |
| R1-F5 | SHOWN | EA18: `src/check_contract.js:91` reuses `rules.js` for requires/facts evaluation and why-not reasons. Unmet/unknown gates return `blocked`, with no dice or proposed debit (`src/check_contract.js:119`). |
| R1-F6 | SHOWN | EP2: `src/check_rule_pack.js:6` wraps existing module compile/lock APIs in a world/edition envelope with a resolution profile and revisioned `ruling` records. An original D&D declaration is at `src/check_rule_pack.js:33`. It is an example, not an accepted complete rules pack. |
| R1-F7 | SHOWN | EP10: `src/check_inspector.js:7` returns a detached author-only profile, shared exact odds and last N chronological receipts for that profile revision, default 20, max 100. Caller supplies world/life-scoped history and enforces actual author capability. No UI or storage owner is wired. |

## API and semantics

```js
import {resolveCheck, replayCheck, spendAfterCheck} from './src/check_resolver.js';
import {checkOdds} from './src/check_odds.js';

const profile = {
  id: 'example.dnd.ability', revision: 1, family: 'sum_target',
  dice: {count: 1, sides: 20}
};
const check = {
  id: 'scene:7/lock:west', target: 14,
  modifiers: [{id: 'skill', kind: 'bonus', value: 3, reason: 'Trained skill'}],
  resources: {effort: 2},
  spends: [{id: 'careful', timing: 'before', resource: 'effort', cost: 1,
    modifier: {id: 'careful.bonus', kind: 'bonus', value: 2, reason: 'Careful effort'}}]
};
const drawAddress = {
  root: 'existing-world-life-stream-root', worldId: 'example.dnd',
  lifeId: 'life:1', gameTime: 1440, eventId: 'scene:7/lock:west/attempt:1'
};
const quote = resolveCheck(profile, check, drawAddress);
const odds = checkOdds(profile, check); // success: 3/5
const replay = replayCheck(JSON.parse(JSON.stringify(quote.receipt)));
```

The example runs from the repository root. Runtime consumers import the
`src/` modules directly.

| Field/hook | Contract |
|---|---|
| `sum_target` | Sum dice plus bonus succeeds on `>= target`. |
| `roll_under` | One die plus bonus succeeds on `<= target`. A positive bonus increases the rolled total and therefore hurts this family; raise target for an easier check. |
| `success_pool` | Count faces `>= profile.successAt`; apply bonus to the count, then compare `>= target`. No exploding dice or per-face rerolls are implied. |
| `advantage` / `disadvantage` | Before modifiers; roll two complete candidate sets, keep higher/lower score respectively. Reverse selection for roll-under. Presence of both cancels, independent of source count. Ties keep the first candidate. |
| `bonus` / `target` | Integer additive modifiers. Supported both before and after rolling. |
| `reroll` | One after-roll spend per check. Replace the complete selected roll, using the same advantage mode, including a worse result. The declared policy always prepares reroll dice; the receipt's reroll `used` flag records whether it triggered. This is not an arbitrary per-die replacement implementation. |
| Spend `when` | `always` (default) or `failure` (after only). Failure means the current result at that point in the declared after-spend order. A conditional spend that does not trigger incurs no debit. |
| Resources | Named nonnegative integer balances. Admission requires enough balance for the sum of requested costs, reserving the policy's worst case. Only applied costs appear in `spent` and reduce returned resources. |
| Degrees | `success`, `failure`, optional explicit single-die `critical_success`/`critical_failure`; blocked checks have `blocked`. Signed `level` is 1/-1 by default; `degreeStep` adds magnitude for margin bands. No automatic d20 critical rule. |
| `requires` / `facts` | Existing `evaluateRule` semantics with bounded AST admission. False/unknown requirements refuse before dice/spends and preserve reasons. |
| `checkOdds` | Exact unconditional probability for the declared policy before observing its initial roll. It does not optimize choices or condition on a known receipt. `degrees` groups the named degrees; margin `level` is available in individual receipts. |
| Pending after-spend | `spendAfterCheck(receipt, spend)` returns a replacement proposal. The host must commit only the chosen final proposal, once. It cannot apply a delta safely to an already-settled transaction by itself. |

Example declaration source was checked against the existing private D&D SRD
5.2.1 capture, page 8, advantage/disadvantage cancellation paragraph.
The shipped example uses original paraphrase and a heading locator, with
the edition pinned. The existing full text remains in the tabletop library's
gitignored private corpus. No new source collection or raw prose ships here.

## Determinism, cost and exactness

SHOWN: every die calls `drawU32` and `address` from `gen_kit.js`
(`src/check_resolver.js:15`). The base includes engine/profile revision,
check ID, root, world, life, integer game time and event ID. Initial/reroll,
candidate, die slot and rejection attempt have separate addresses. No ambient
clock, tick count, shared mutable RNG cursor or random API is read. The host
must supply the existing world/life-scoped stream root and stable occurrence
ID, and advance game-time/occurrence state only on commit. Repeated quotes
and canceled previews do not shift draws.

`gen_kit.js:73` documents multiply-high's one-input bucket imbalance. To
preserve exact fair-die arithmetic, the wrapper uses equal integer buckets
and rejects the incomplete uint32 tail (`src/check_contract.js:12`). All
admitted sides have equal accepted population, checked at every bucket
boundary. Each die has at most eight addressed attempts; exhaustion throws
before any result or cost proposal returns. There is no biased fallback.
Odds are exact under the usual independent uniform uint32 draw model,
conditional on a completed roll, not an enumeration of all hash roots or a
proof that the deterministic hash is independent. A declared reroll policy
always prepares both initial and reroll candidates, even if its failure
condition does not trigger. This fixed draw envelope makes budget-completion
probability independent of the policy's branch. Unused reroll dice are
retained with `used:false`, no cost, and no effect on the result.
For sides <=100 the
single-die exhaustion probability under that model is less than
`(100 / 2^32)^8`. The sweep is evidence about actual addressed draws.

SHOWN budgets: <=32 dice, <=100 sides, count*sides <=512, <=32 ordinary
modifiers, <=8 spends, one whole-roll reroll. At worst there are 128 accepted
die faces and 1024 addressed attempts per check. Convolution support is
bounded by 512; a reroll may enumerate <=512 squared score pairs. No global
per-day scheduler or away batch owner is introduced. Consumers must cap
checks per game day/job window and keep receipt history bounded.

## Verification

Targeted command:
`node --test tests/check_resolver.test.js tests/check_odds.test.js`

SHOWN: 72 passed, 0 failed. Includes 21 complete receipt goldens, seven
profile/mode cases at game-time addresses 0, 1440, 9001; replay after JSON
roundtrip; before/after spend receipts and conditional costs; immutable
inputs; unknown gates; crits; admission failures; wrapper matching and
fingerprint changes; author read model. Four independent exhaustive
enumerators compare full named-degree odds. BigInt tests include the
32d6 all-sixes probability `1/6^32` beyond safe Number precision.

SHOWN: twelve deterministic sweeps of 6000 addresses each, 72,000 total,
match exact success probabilities within an absolute 0.025 band, including
all families, advantage/disadvantage, before/after bonus, conditional reroll,
advantage with reroll and pool with reroll. The band is wider than 3.8
worst-case binomial standard errors; it is not used as proof of exact odds.
See `tests/check_odds.test.js:106` and `tests/check_resolver.test.js:19`.

SHOWN: final targeted run after the fixed reroll draw-envelope correction:
72 pass, 0 fail, about 2.8 seconds. Final full `npm test`: 1831 tests,
1828 pass, 0 fail, 3 TODO, 0 skipped/canceled, about 94.1 seconds.
The earlier full run also passed; repeating it was required by the source
correction. Full-suite TODOs are existing legacy RNG audit cases, not this
lane. `git diff --cached --check` passes.

## First D&D consumer and remaining gates

All entries below are INFERRED integration work, not delivered gameplay.

| Code | Needed from the first consumer |
|---|---|
| R1-C1 | Select one actual ability-check scene and an accepted SRD 5.2.1 ruling set. Load a validated world/edition check pack; lock the full profile/rulings alongside existing module lock. Derive skill/stat bonuses, DC, prerequisites and resource balance from authoritative actor/scene state. Keep attack critical rules separate from ability checks. The example is not a full SRD implementation. |
| R1-C2 | Supply the existing world/life stream root, stable scene/action occurrence and integer game time. Bind quote to actor/scene version, preserve revealed receipt, stop stale/double commits, and atomically install final costs, result/consequences, receipt and occurrence advancement. A pending after-roll choice must survive interruption and cannot be applied twice. Adapt the generic whole-roll reroll only where the selected rule permits it; SRD per-die reroll/advantage interactions need a separate reviewed adapter. |
| R1-C3 | Persist only opted-in instances: frozen declaration/lock, bounded revealed receipts, pending choice if any and occurrence state. Compatibility decision here: no save shape or migration is installed, and old saves/worlds without a profile remain inert. A future native owner must explicitly migrate opt-in data and exercise old-save refusal, Save/reload and literal-file Export/Import. Pure JSON roundtrips here do not prove native persistence. |
| R1-C4 | Wire `checkOdds` to the intended knowledge-filtered player/cheat surface and `readCheckInspector` only to actual author access. Supply scoped history. Keep truth receipts and roots private to author tooling. Do not advertise policy odds as conditional odds for an already-observed roll. If required, add a separately reviewed conditional lens. |
| R1-C5 | Build and exercise that real scene from a fresh desktop/laptop origin, target 1366x768 or larger; show useful success/failure, a real resource spend, receipt, exact odds and replay. Exercise pending/final Save/reload/Import and negative controls. Until that passes, this branch is source-tested infrastructure only. Root review and a playable consumer remain merge gates. No mobile work is needed. |

No `rule_modules.js` edit is needed for this envelope. SHOWN: its validator
still accepts only `village.mix@2` and its five existing module kinds
(`src/rule_modules.js:42`); the wrapper delegates existing effects to that
validator/matcher/lock rather than admitting new executable effects. The
new `ruling` is declaration metadata, not an executable module kind. To
make rule modules directly supply check bonuses or broader predicates,
a later owner would need a versioned resolver/fact/effect admission contract
and compatibility tests. UNKNOWN: that later module contract and final
D&D consumer policy, which other lanes/root must reconcile before merging.

No dist build, browser run, save access, merge or push was performed.
