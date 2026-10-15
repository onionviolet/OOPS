# Exact selected economy and combat rules

SHOWN static native evidence, build 25097075. This is a selected formula
reconstruction, not a complete balance model. Large monolithic resolvers timed
out; all-path effects and full battle-event probabilities remain PARTIAL.

## B1: harvest starts from available labor

Assembly in TurnReport, `0x1409b490d` through `0x1409b55ec`, shows the
following sequence. Ordinary positive non-overflowing inputs are assumed.
C integer division truncates toward zero; floating results are explicitly
converted back to integers where shown.

Let W = YourPeasants + Aslave. No positive workers skips harvest. MouseRevenge=1
clears that flag and takes a failed-crop route. Otherwise LongerHarvest=0
sets B=W; LongerHarvest=1 sets B=2W. A negative computed base is replaced with
9,999,999 in the native code. That overflow-related branch is not a desirable
YAIRPG balance rule.

Draw q=`rand()%15`:

| q | Pre-upgrade harvest candidate |
|---|---|
| 0 | 0 |
| 1..6 | `rand()%max(B,1)` |
| 7..14 | `floor(B/2) + rand()%max(floor(B/2),1)` |

Candidates of 0 or 1 follow a failed-crop route before bonuses. On a successful
candidate, the inspected modifier order is WitchBlessing, Fertil, HarvestStone,
HarvestTools, RoadUpgrade, TerraEconBuff, NewYearEvent, longer-harvest worker
losses and HarvestShrine. Later code credits the final value to YourGold and
GainGold. This block uses labor as its base, not YourLand.

Selected exact modifier steps: WitchBlessing=1 clears its flag and multiplies
by 1.5 with truncation; Fertil=1 and candidate above 3 also multiplies by 1.5;
HarvestStone=6 adds 100; tool levels 1/2/3 replace H with truncated
`H + H*0.1/0.2/0.3` respectively. Shrine levels 1/2/3/4 apply
`H+floor(H/2)`, `2H`, `5*floor(H/2)` and truncated `3.5H` respectively.
Level 3 is not generally equal to truncating 2.5H because division happens
first. Full road/Terra/year modifier tables and overwork loss order remain open.

The proposal is labor opportunity cost with explicit rounding and modifier
order. It is not a request to adopt slavery, this game's mortality policy or
these coefficients in YAIRPG.

## B2: wages and insufficient funds

TurnReport `0x1409d42ac` onward: for S positive soldiers, cost is
`S*SoldierWage`. If YourGold covers the entire cost, subtract exactly that
amount and add it to ExpenseGold. There is no shown proportional partial-pay
formula in this branch.

If gold cannot cover the group and S>9, desertion is
`rand()%floor(S/10)`. Subtract that number from YourSoldiers, add it to
SoldierD and construct the relevant report. This range includes zero, so
unpaid soldiers can remain loyal. Smaller groups bypass this random-loss
branch. Subsequent opinion/report effects and other unit/staff wage branches
need separate reading; no single universal upkeep coefficient was derived.

## B3: battle damage selects a living unit by count

`BattleDamage` at `0x140898456` snapshots prior casualty counters, clears the
current counters and handles incoming Inflict2Att while fighters remain.
It rolls `rand()%YourFighters+1`, then finds a troop group through cumulative
remaining counts, subtracting previous and current dead. INFERRED from those
shown bounds: the normal casualty target selection samples living individual
units, not troop classes equally and not units weighted by their power.

For an ordinary attacking peasant selected with fresh budget D:

- D<=50 stores D in ExtraDamageAtt, marks ExtraDamageAttUnit=5 and ends that
  damage-budget loop.
- D>=51 increments DeadAttPeasant, decrements YourFighters and subtracts 50
  from the budget.

The 50-versus-51 boundary is real in both pseudocode and native comparisons.
A previously retained peasant injury combines its remainder with the next
budget and also needs at least 51 to kill. Other fixed unit thresholds include
soldier 101 to kill/cost 100 and knight 151 to kill/cost 150. Independent
units use their own stats with strict comparisons. Extra-damage carry handling
has separate code, so it must not be replaced by one guessed division formula.

`BattleTroopReturn` at `0x1408a6d29` subtracts dead from each deployed group.
For the player-named attacking faction, positive surviving peasants return to
YourPeasants; the defending player branch also returns its survivors. The
identity checks and several faction routing branches are explicit. BattleSim
calls BattleDamage and later BattleTroopReturn. Initial deployment removal,
all special effects and every battle-round incoming-budget formula remain
open. This establishes a casualty/return chain, not a whole battle simulator.

## B4: one mercenary score setup

BattleSim `0x140816305` onward, for MercFight 2 or 3, adds
`rand()%100 + G_MercTroops*G_MercTroopStats + 50` to BattleScore. Training-post
level 1 then adds 1, level 2 adds 3. It counts fighters as troop count plus
one. This is one setup branch; ordinary mixed-army, monster and siege setups
cannot be inferred from it. A display score is distinct from the casualty
unit count and damage budget.

## B5: arena, score resolution and treasury settlement

`Arena` at `0x1407b6fc0` selects participants from animal tables or troop and
champion contexts. Animal modifier rows explicitly choose add, subtract,
divide, multiply or set operators. Personal Name bonuses can enter a fighter's
score. Zero scores become 2. It invokes BattleEvents before comparing the
resulting BattleScore and BattleScoreO; equality draws, otherwise the larger
score wins. BattleEvents' complete score-randomization and special-effect
matrix remains open, so no exact win-probability formula is claimed.

A positive bet B must be covered by both YourGold and ArenaFund. Its accepted
branch subtracts B from YourGold before the match. A draw refunds B. A winning
ordinary bet credits truncated `1.5B` to gold; the inspected ordinary winner
path reduces ArenaFund by B. A grand-champion match outside a kingdom challenge
credits 2B instead. Thus ordinary net win is roughly +0.5B after the initial
stake, and grand-match net win is +B. A loss keeps the stake deduction. Fund
movements must be traced separately; these rules are not evidence of a
conservative two-account betting ledger or a current played exploit.

The 1.5 constant was decoded as a little-endian double at `0x140fc28b8`.
Narrative animations and report draws are distinct from resolver inputs.

## B6: recruitment boundary

The prior dossier's purchase amounts remain menu evidence unless joined to a
transfer branch. Preparation is battle setup, not a complete recruiting owner.
A selected AutoRecruit query was stopped without a result after about five
minutes. Native assembly supplied the following bounded recruitment read.
All market pools, prices, special recruits and recruiter conversions remain
uncertified as a complete catalog.


SHOWN in AutoRecruit `0x140cb4517`: AutoRecruitKey=1 runs ordered categories
in a loop from priority 1 through 6, matching each category's configured order.
Earlier categories spend the treasury before later ones. For ordinary positive
requested count R, cost C=MilitiaUnitCost>0 and available pool A=AvPeasants,
the militia branch at `0x140cb554e` recruits
`min(R,A,floor(YourGold/C))`. Each iteration adds one YourPeasants, removes
one AvPeasants and debits C. The report computes actual count*C afterward.
The same branch does not conjure a new recruit pool.

A second inspected pool, MarketScum at `0x140cb5b07`, uses cost 10 and the
configured AutoHireBlackmarketScum cap, with the same one-in/one-out/debit
loop. Free SmallHaven recruitment requires its unlock, local population>19
and its unused flag; it marks the flag before a `rand()%20` draw, then
transfers the positive result from local population to YourPeasants. A zero
draw can therefore consume that opportunity without a recruit. Its flag-reset
cadence remains open. This is not a proposed permanent once-only YAIRPG rule.
