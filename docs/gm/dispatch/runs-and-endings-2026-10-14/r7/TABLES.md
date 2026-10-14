# R7 generated simulation tables

Original proposal model, not observed gameplay. Run `python3 docs/gm/dispatch/runs-and-endings-2026-10-14/r7/simulate.py`.

## N10: ten prestige cycles

| Strategy | Lives | Time | Effective deeds | Currency | Early world power | Why it matters |
|---|---|---|---|---|---|---|
| short-life | 10 | 20.0 | 67.64 | 16.13 | 2.98% | Cycle count does not equal time spent |
| long-life | 10 | 100.0 | 838.69 | 105.17 | 10.00% | Cycle count does not equal time spent |
| many-short-lives | 40 | 20.0 | 127.94 | 26.72 | 4.69% | Cycle count does not equal time spent |
| grind-one-world | 10 | 60.0 | 419.35 | 64.50 | 9.51% | Cycle count does not equal time spent |

## N11: equal 100-unit budget

| Strategy | Prestiges | Completed lives | Effective deeds incl. pending | Banked currency | Pending currency | Why it matters |
|---|---|---|---|---|---|---|
| short-life | 50 | 50 | 257.89 | 45.32 | 0.00 | Compares equal time, preserves unfinished credit |
| long-life | 10 | 10 | 838.69 | 105.17 | 0.00 | Compares equal time, preserves unfinished credit |
| many-short-lives | 50 | 200 | 524.75 | 75.68 | 0.00 | Compares equal time, preserves unfinished credit |
| grind-one-world | 16 | 16 | 626.93 | 84.73 | 1.08 | Compares equal time, preserves unfinished credit |

## N12: cumulative currency by cycle

| Cycle | short-life | long-life | many-short-lives | grind-one-world | Why it matters |
|---|---|---|---|---|---|
| 1 | 3.02 | 26.08 | 5.50 | 15.02 | Shows slower marginal growth |
| 2 | 5.20 | 40.88 | 9.04 | 24.13 | Shows slower marginal growth |
| 3 | 7.03 | 52.38 | 11.96 | 31.28 | Shows slower marginal growth |
| 4 | 8.63 | 62.13 | 14.54 | 37.38 | Shows slower marginal growth |
| 5 | 10.09 | 70.77 | 16.89 | 42.81 | Shows slower marginal growth |
| 6 | 11.44 | 78.62 | 19.08 | 47.75 | Shows slower marginal growth |
| 7 | 12.70 | 85.87 | 21.13 | 52.32 | Shows slower marginal growth |
| 8 | 13.90 | 92.66 | 23.08 | 56.60 | Shows slower marginal growth |
| 9 | 15.04 | 99.07 | 24.93 | 60.65 | Shows slower marginal growth |
| 10 | 16.13 | 105.17 | 26.72 | 64.50 | Shows slower marginal growth |

## N13: repeat-mode sensitivity at equal time (alpha 0.65)

| Mode | short-life | long-life | many-short-lives | grind-one-world | Why it matters |
|---|---|---|---|---|---|
| diminishing | 45.32 | 105.17 | 75.68 | 85.80 | Includes earned but unsettled credit |
| steady | 73.13 | 137.76 | 134.70 | 119.95 | Includes earned but unsettled credit |
| rising | 95.71 | 167.13 | 176.97 | 150.70 | Includes earned but unsettled credit |

## N14: same-ending speed sensitivity

| Ending time | Completed prestiges | Entitled currency | Why it matters |
|---|---|---|---|
| 1 | 100 | 246.26 | Fast easy endings can dominate despite diminishing payout |
| 2 | 50 | 163.91 | Fast easy endings can dominate despite diminishing payout |
| 3 | 33 | 128.97 | Fast easy endings can dominate despite diminishing payout |
| 4 | 25 | 109.65 | Fast easy endings can dominate despite diminishing payout |
| 5 | 20 | 96.39 | Fast easy endings can dominate despite diminishing payout |
| 6 | 16 | 85.80 | Fast easy endings can dominate despite diminishing payout |
| 8 | 12 | 72.39 | Fast easy endings can dominate despite diminishing payout |
| 10 | 10 | 64.50 | Fast easy endings can dominate despite diminishing payout |

## N15: first-attempt survival stress

| Hazard/unit | Long expected deeds | Long expected time | Long deeds/time | Tiny deeds/time | Why it matters |
|---|---|---|---|---|---|
| 0 | 124.00 | 10.00 | 12.40 | 12.00 | Mortality can reverse the fresh-life rate |
| 0.05 | 86.98 | 7.87 | 11.05 | 11.92 | Mortality can reverse the fresh-life rate |
| 0.1 | 62.40 | 6.32 | 9.87 | 11.84 | Mortality can reverse the fresh-life rate |
| 0.2 | 34.58 | 4.32 | 8.00 | 11.69 | Mortality can reverse the fresh-life rate |
| 0.4 | 14.21 | 2.45 | 5.79 | 11.38 | Mortality can reverse the fresh-life rate |

## N16: bounty market examples

| Case | Requested | Budget/job | Quoted | Why it matters |
|---|---|---|---|---|
| baseline | 187.50 | 1000.00 | 187 | Danger, labor scarcity and funds have separate effects |
| more danger | 312.50 | 1000.00 | 312 | Danger, labor scarcity and funds have separate effects |
| urgent | 300.00 | 1000.00 | 300 | Danger, labor scarcity and funds have separate effects |
| many hunters | 140.82 | 1000.00 | 140 | Danger, labor scarcity and funds have separate effects |
| few hunters | 231.74 | 1000.00 | 231 | Danger, labor scarcity and funds have separate effects |
| monster boom, fixed treasury | 249.65 | 50.00 | 50 | Danger, labor scarcity and funds have separate effects |
| monster boom, funded response | 249.65 | 500.00 | 249 | Danger, labor scarcity and funds have separate effects |

## N17: offer density, 900 in-world days

| Adjective | Expected/90-day season | Offers in 10 seasons | Quiet days | Pity days | Why it matters |
|---|---|---|---|---|---|
| sparse | 2.0 | 22 | 22.5 | 67.5 | Density changes by world, display count does not |
| settled | 22.5 | 220 | 2.0 | 6.0 | Density changes by world, display count does not |
| busy | 180 | 1783 | 0.25 | 0.75 | Density changes by world, display count does not |
| saturated | 720 | 7193 | 0.0625 | 0.1875 | Density changes by world, display count does not |


Verification: 27 mathematical/accounting checks passed. No native gameplay checks.
