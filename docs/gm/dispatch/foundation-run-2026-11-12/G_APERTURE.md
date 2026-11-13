# Gu law: the aperture

*Proposal throughout (AD32, AD56), 2026-11-12. Asked by Weibao in a separate chat ("Deeper implementation for aperture and more?"), outside the coordinator's lanes. Agent-verified by headless tests, not human-reviewed. Codes: PC94, PC95, PFP3, PFP10, WSC3 to WSC7, AD38, AD49, GKM13, GKM14, GP1, RIG1 to RIG10, RIG15, RIG38. Engine only: no `src/main.js`, no UI, no game save change, no build, no shared engine file edited.*

## What was wrong

The aperture was a label. `living_body.js` turned an organ record (grade, rank, condition) into one capacity number, and every cast was handed its essence by its caller. Nothing owned the sea over time, so recovery, the wall, the rank break, stones, held essence and a cracked aperture did not exist as mechanisms.

## What exists now

| File | Holds |
| --- | --- |
| `src/gu_aperture.js` | The law as data (`APERTURE_LAW`) and pure reads: grade, capacity, recovery, essence worth, `payFromSea`, `readAperture` (the GP1 read), `apertureFuel` (reserves and supply for `gu_activation.js`), `quoteStoneRefill`, `apertureOrganRecord` |
| `src/world_substrate_packs/gu_aperture.js` | Pack `g.aperture` and `apertureHolder`. Passed to the engine world as an own pack (`ownPacks`), so the registry is untouched |
| `tests/gu_aperture.test.js` | 16 tests |

The sea is kept as energy pools by rank and stage (`energy:primeval.rank1.middle`), the key shape the essence conversions already use. Kinds do not mix (RIG9). A price is stated once, in rank-one initial motes, and each pool pays at its own worth: twice per stage, ten times per rank.

| Mechanism | How it works | What the player decides |
| --- | --- | --- |
| Recovery | The body makes own-stage essence while there is room. A full sea takes fresh essence by pushing out its weakest essence, so old essence is replaced after a new stage or rank | Nothing; it is the clock everything else is paid from |
| Stones | An absorbing master opens one stone at a time and draws it in. An open stone keeps what a full sea leaves | When to burn stones; `quoteStoneRefill` says what would go unused first |
| The wall | Poured essence wears the wall to the next stage. Refined essence goes as far as it is worth. Pace follows aptitude | How much of each hour's essence goes to the wall and how much stays for Gu |
| The rank break | At the peak a strike must outrun the wall's healing. A strike the sea cannot feed ends and the wall closes | Force of the strike, whether to feed it with stones, when to try |
| Holds | A working in flight moves essence into its own account (`aperture_held:<id>`). The wall, the strike and other prices cannot take it, and any pack or the cost owner can see it | Which move keeps a claim on the sea |
| Strain | A price past the sea is still paid: the aperture takes the rest as strain. Enough cracks it (half capacity, the excess sea is lost), more shatters it. Rest eases strain and a crack mends | Whether to overdraw in a fight |
| Poured essence | Another master pours essence in at its worth. It fills the sea and stays as foreign essence, which slows the wall until cleansed | Take an elder's help now and pay in pace later |
| Tempering | Outside means move aptitude by points or lift a small realm without the wall's time. A relic stops at the peak | Which routes are worth their owner's price |

Effects heard: `aperture.focus`, `spend`, `hold`, `release`, `pour`, `cleanse`, `temper`. Published: `aperture.stage`, `rank`, `condition`, `overflow`, `short`, `stones_out`, `strike_ended`.

## How Gu workings pay from it

The Gu workings other lanes are writing publish essence as cost rows (`{quantity: 'energy:primeval.rank1', payer, amount}` in the moon fusion working, `{quantity: 'primeval_essence', ...}` in first control), and the engine host settles rows through `cost_owner.js`. So the sea is wired in as the world's price list, with no edit to those files or to the cost owner:

- `apertureAccounts(record, law, {kinds, unit, hold})` returns cost-owner `accounts` for the cost words a world's workings publish. A row is paid from the working's hold if it names one, then the master's own essence, then the rest of the sea strongest first, each at its worth.
- What stays short is the fault `aperture.overdrawn`, priced as strain. The working still lands, as the cost owner already does for every other account.
- `unit` converts the row's unit to motes. `APERTURE_LAW.measure` (6,600) is calibrated so the catalogue's four-measure Moonblade costs a tenth of a 44% sea at the initial stage (RIG15) and a twentieth at the middle stage (RIG5).

Tested three ways: the two row shapes through `settleCosts`, a shortfall with a hold in place, and a kernel working started on the engine host that pays its first cut from the sea and its second partly as strain.

Limits of this wiring, each a known gap and not a design choice:

| Code | Limit | Way to close it |
| --- | --- | --- |
| W1 | The price list is built for one master at one rank and stage, and the host's list is keyed by cost word, so two masters at different stages in one world need different words | A per-payer account port on the cost owner (shared file, coordinator's merge) |
| W2 | The list is data fixed when the host is made; a stage change needs it rebuilt | Same port, or rebuild on `aperture.stage` |
| W3 | A working's own refusal check still reads whatever quantity its law names (first control reads `primeval_essence` on the operator) | Those laws read the sea's free essence, when their lanes land |
| W4 | The catalogue also gives the Moonblade a middle-stage cost factor of 0.25, which stacks with the sea's halving if a caller passes both | One of the two owns stage efficiency; the sea's is the stated one |
| W5 | The game-side keeper flows, the brew regulator and the essence line keep their own pools | Game tie-in (PC95); the regulator is loaded by the game, so changing it means the full suite |

## Canon numbers and where they land

Relayed from the saved reader notes ([ranks and economy](../../../research/novels/reverend-insanity/readers-2026-10-10/RANKS_ECONOMY.md), [gate catalogue](../../../worlds/progression-gates-2026-10-23/REVEREND_INSANITY.md)). No chapter was reopened.

| Fixed point | Source | In the law | Test result |
| --- | --- | --- | --- |
| C recovers 4% of the aperture an hour ("24% in 6 hours"), A 8% | ch10, stated | `hourlyPoints` | Exact |
| Aptitude bands C 40 to 59, A 80 to 99 | ch91, ch173, stated; B and D inferred | `grades` | Exact |
| Cost halves per small realm; a higher rank is worth ten | ch148, ch26, stated | `stagePotency`, `rankPotency` | Exact |
| A C needs twice a B's time and four times an A's | ch148, stated | Recovery times `nurturePermille` (calibrated) | 2.00 and 4.00 |
| A lone sea of 55% breaks the rank-one wall; below that needs help | ch91, stated | `break.need` 294,000 (calibrated) | 55 passes, 54 and 44 fail |
| Fang Yuan at 44% on stones: about three days, sea down to about 20% | ch92, shown | `stone.dividedPerMinute` 640 (calibrated) | 2.8 days, 20.7%, 86 stones |
| Stones refill to the cap in about half an hour | ch10, stated | `stone.fillMinutes` | 32 minutes for two stones |
| Foreign essence stifles later talent; Cleansing Water removes it | ch50, ch111, stated | `foreign` | Slows, then clears |
| Apertures crack when essence runs out | ch193, shown | `strain` | Cracks, sheds, mends |

Authored, with no chapter number held: the mote unit (600,000 to an aperture), the three wall sizes, strike force and heal rates, what one stone holds, every strain threshold, the foreign-essence curve, the D, B and Ten Extreme band values. Each is one field of `APERTURE_LAW`; a world passes its own law to `createGuAperturePack`.

## Floor (AD43)

| Line | State |
| --- | --- |
| FLR1 build | No build run; this slice is engine side (PC95) and a build waits for tie-in |
| FLR2 route | Fixture: `apertureHolder` in a test world. No fresh-life route until tie-in |
| FLR3 shown | `readAperture` returns the GP1 fields; no screen |
| FLR4 used | Any kernel working whose essence cost row is in the price list pays from the sea through the engine host (tested with a working law). The activation resolver reads free essence. No game flow reads it yet |
| FLR5 kept | Engine save, restore and continue match a straight run; reload at every minute matches one jump |
| FLR6 label | Implemented, below floor. Agent-verified in headless tests |

Checks, 2026-11-12: `node --test tests/gu_aperture.test.js` 16 of 16; `tests/cost_owner.test.js`, `tests/engine_host.test.js` and `tests/living_foundation.test.js` 20 of 20 unchanged; `npm run check:arch` exit 0; `npm run check:rules` exit 0 (its warnings are in files this change does not touch). The files are not reachable from `src/main.js`, so PC99 asks for focused tests and no full suite.

## Open, in the order I would take them

| Code | What | Needs |
| --- | --- | --- |
| AP1 | Done as price-list data for one master (see W1, W2) | A per-payer account port in `cost_owner.js` for several masters (shared; coordinator's merge) |
| AP2 | Engine-side workings pay through the price list. The keeper runs, the brew regulator and the essence line still carry their own pools (W5) | Game tie-in; costs convert through `measure` |
| AP3 | Two records of one aperture: this slice and the lifecycle organ | One owner. `apertureOrganRecord` bridges until then |
| AP4 | Gu housed in the aperture: feeding as upkeep, a Gu too heavy for its rank (ch19), the cicada's pressure | The body alteration pack with the aperture as a budget, reading this pack's rank |
| AP5 | Ten Extreme collapse, a second aperture (RIG4, RIG10) | A course on strain that rises with rank; a second state slice |
| AP6 | The break's failure side and the rank two to three assists (RIG6, RIG7) | Source check of ch90 to ch92 and ch152 before numbers |
| AP7 | A long dry sea (RIG15) | A clock on an empty sea, if the chapters support it apart from ch193 |
| AP8 | Registration in `ENGINE_PACKS`, coverage ledger rows, the GP1 panel | Coordinator; tie-in |
| AP9 | Rank six and the immortal aperture (RIG23 to RIG26) | Its own law; this one stops at rank five |

Calibration note for AP6: the wall sizes are the weakest numbers here. The text gives pace ratios and no durations, so a C reaching the middle stage in 21 days of unbroken nurturing is a guess to be replaced by the first chapter that dates a stage.
