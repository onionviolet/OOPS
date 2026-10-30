# P8 calibration of tempo fight odds, 2026-10-30

Status: **script-run, rate table exists** (LSD350). Agent-verified, not human-reviewed. Run: `node scripts/calibrate_fights.mjs --seeds 300` (cases in `scripts/calibration/fight_cases.json`, bands set before the first run and labelled proposals).

## The chapters 1-24 finding

LSD350 asks for a rate table against the chapter 1-24 fights. The first lead book's sourced conflict contracts for that window (`merged-cast-2026-10-28/conflict_contracts.jsonl`) hold five rows, three marked not-a-conflict and the other two a police questioning and a hide-and-wait. No blow is struck in chapters 1-24, so there is no fight there to compare against. The `m4-whole-book` copy of the file is empty. The comparison with the book therefore waits for the window where fights start; the same script will take sourced cases once they exist. Until then the table compares the engine against archetype matchups (even, outmatched, ambushed, with allies, retreating), with bands I set from what a reader would expect.

## Rate table (300 seeds per case, named policy "steady"; "safe" for the retreat case)

| case | won | lost | withdrawn | yielded | ally fled | ally down | player injured | band check |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| even-duel | 49% | 51% | 0% | 0% | 0% | 0% | 87% | won 49% in band (35%-65%) |
| outmatched | 2% | 98% | 0% | 0% | 0% | 0% | 91% | lost 98% in band (60%-100%) |
| overmatching | 97% | 3% | 0% | 0% | 0% | 0% | 53% | won 97% in band (60%-100%) |
| ambushed | 27% | 73% | 0% | 0% | 0% | 0% | 96% | won 27% in band (20%-50%) |
| bonded-ally-two-foes | 85% | 15% | 0% | 0% | 0% | 52% | 31% | allyFled 0% in band (0%-15%) |
| fearful-ally-two-foes | 54% | 46% | 0% | 0% | 50% | 33% | 73% | allyFled 50% in band (40%-100%) |
| careful-retreat | 0% | 61% | 39% | 0% | 0% | 0% | 92% | withdrawn 39% in band (25%-90%) |

## What the run found and changed

- **Tie-break bias (changed):** with equal ready time and speed the fighter whose id sorts first acted first. In the even duel the foe (`foe1`) always opened, so the player won 38 percent of fights between equals. Ties are now settled by a per-fight shuffle of the ids; the even duel is now about 49 percent. Regression: `tests/tempo_fight.test.js` (exact tie).
- **Surprise delay (changed):** the dial was 8 time units (about three quick moves). An ambush between equals was a loss 97 percent of the time. At 3 (about one quick move) the ambushed side wins about 27 percent, inside the proposed 20 to 50 percent band. The dial's reason is updated.
- **Allies:** a bonded, disciplined friend fled in none of the 300 fights and went down in about half; a frightened hireling with little tie to the player left in about half of the fights. Both sit inside their bands.
- **Retreat:** the careful policy ends in a clean withdrawal in about 39 percent of fights against a stronger foe and is beaten in the rest; inside its band.

## Gaps

- Every band is a proposal. Weibao has not set target rates, and nothing here is canon; moving a band or a dial needs a stated reason.
- The table does not yet cover orders, hit location, armour, or surrender; those have unit tests but no rate bands.
- Player injured is high (about 90 percent in even fights) because any blow that takes 8 percent of health injures a part; whether that is the right injury threshold is a taste call for Weibao.
