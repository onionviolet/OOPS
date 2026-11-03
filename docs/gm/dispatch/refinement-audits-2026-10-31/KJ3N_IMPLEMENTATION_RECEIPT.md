# KJ3N implementation receipt: Sunday, the housing company, 2 Daffodil Street and the move

2026-11-03. Window kjw4 of the KJ3 sweep, plus the chain replay on the B9 bundle (workflow row R). **Agent-verified, not human-reviewed (AD43).** Content-only: no `src/`, `dist/` or test edits. Not installed, no personal save touched. Proven on the **B9 bundle** `private/proof-bundles/b9-bundle-2f659cc7/` (bundle.js sha256 `2f659cc73c6c19b592cf6e5571a7e6f70f35d3dcbf3c9f760b9867165f2e1431`, built from `3447f0a31`, includes B1 and B9; its `private_packs` is a symlink, so each run copied the bundle and gave it its own `lotm-cast/cast.json`). Pack sha256 `5916b2a3…`, revision `cast-reviewed-kj3n-865282c9d9671cda` (carries KJ3F-KJ3N). Private files: `docs/research/novels/lord-of-mysteries/private/kj3n-ch29-2026-11-03/` (the replay logs, checkpoints and results are in its `replay-b9/`). Seed: the KJ3M checkpoint (money 2731, a ceiling).

## Chain replay on the B9 bundle (row R)

Each runner ran with its own pack (the `cast-before.json` of the next slice), seeded from the previous replayed checkpoint, 0 page errors each.

| Runner | Result | Wall | Final money, position, clock vs pinned-bundle proof |
| --- | --- | --- | --- |
| KJ3F | pass, 5 steps | 81 s | 3, same place, 2098, identical |
| KJ3G | pass, 9 steps | 123 s | 3, same, 2145, identical |
| KJ3H | pass, 9 steps | 123 s | 2883, same, 2183, identical |
| KJ3I | pass, 6 steps | 96 s | 2883, same, 2206, identical |
| KJ3J | pass, 5 steps | 94 s | 2883, same, 2229, identical |
| KJ3K | pass, 6 steps | 160 s | 2760, same, 2421, identical |
| KJ3L | pass, 14 steps | 514 s | 2744, same, 3425, identical |
| KJ3M | pass, 15 steps | 306 s | 2731, same, 3813, identical |

B1 and B9 changed no earlier behaviour: all eight pass with the same money, position and clock as on the pinned bundle. The originals of each slice's `completed-checkpoint.json`, export and result were restored in place after the replay (they are the pinned-bundle proofs the older receipts cite); the replay copies are in `replay-b9/`. A first attempt that launched the chain detached failed to open a browser (not a game result) and was rerun in three batches.

## Scope and source

English v1 ch29 P017 - ch30 P065 (official edition), shard 4. Fifteen acts in five scenes covering the brief's nine intents, nothing folded. Next boundary: ch30 P066 (kjw5, the next morning).

| Brief intent | Acts built | Keys set (`book.lotm.kj3n.`) |
| --- | --- | --- |
| 1 Bread and a Sunday | `bread` | `bread.bought` |
| 2 Listing and tip | `listing`, `tip` | `listing.read`, `rochelle.tip` |
| 3 Walk and poverty talk | `walk` | `housing.explained`, `confirm.place.first` |
| 4 At the company | `scarter`, `choose` | `scarter.met` |
| 5 Tour | `tour` | `house.toured` |
| 6 Buy price, haggling | `buyprice`, `haggle` | `buy.price`, `terms.agreed` |
| 7 Sign, notarize, keys | `keys` | `contract.notarized`, `pooled.purse`, `keys.held`, `locks.todo` |
| 8 Franky | `rye`, `farrive`, `franky` | `franky.ended` |
| 9 Suit, carrying, evening | `suit`, `evening` | `suit.bought`, `moved` |

Intents per chapter: ch29 (P017-P064) 6 acts, ch30 (P001-P065) 9 acts, counting `choose` in ch29 and `tour` in ch30. Level: deep, every row at beat grain. Quiet stretches (`rye`, `farrive`) are short cards.

## Open items settled and corrections

| # | Brief said | Built | Basis |
| --- | --- | --- | --- |
| Q1 | 2 Daffodil Street is a new place | pack `lotm.place.cast-cbdaed37cd97109c0a65` (Narcissus Street No. 2) | alias "2 Narcissus Street" (zh ch211 p39); Narcissus and daffodil are the same flower, and the book gives Klein's later home as that address. The other candidate `cast-7351aa…` is a street-level "Forward anchor address" and is not used. kjw5 starts in this place |
| Q3 | Who pays | no purse debit for the pooled sum; the coordinator's recommendation was followed | ch30 P035 counts one pool for Klein and Benson; the only debit is the bread |
| Q4 | Suit price outside the window | the suit is unpriced here; 1920 pence (8 pounds, ch30 P068) is kjw5's | the purchase is at ch30 P058 with no price |
| Q5 | Two keys or three | three bunches, assumed, stated in the note | ch30 P036 says "they each held" |
| Q6 | Party against the one-relocation rule | 15 acts, each moves one non-player; Benson, Melissa, Scarter and Franky each have a visit | preflight 0 blockers |
| Franky | Franky stays NEW (verify) | pack `lotm.person.cast-dadd9c660e7f3220a07d` (`Frank`, role landlord of Klein's building, zh ch2 p42) | the text calls Franky the family's landlord (ch27 P004-P009); probable, not proven |
| Places | company, Franky's flat | minted `lotm.place.kj3n.housing-company` and `lotm.place.kj3n.franky-flat` | no pack match |
| Scarter | confirmed | pack `Scarth` (`cast-29f1ecc7…`) | alias table |

## Money (pence; 240 per pound, 20 soli per pound, 12 pence per soli; ch26 P079)

| Line | Pence | Locator | Native |
| --- | --- | --- | --- |
| Eight pounds of rye bread (a weight) | -9 | ch29 P017 (one-soli note spent; the 3 pence change is derived, not stated) | `bread` |
| Deposit, first week | pooled | ch30 P033-P035 (rent 12 soli, furniture 3 pence, deposit two pounds) | facts and notes only |
| Left in the pool | 2192 | ch30 P035 | note |
| Suit | 1920 | ch30 P068 (outside the window) | kjw5 |

Native money: 2731 -> 2722, unchanged to the end; asserted at every step. **2722 is a ceiling**, like its seed (unpriced shopping at ch27 P021-P031). The bread debit is a player-picked place act with a native cost, reserved in the pack; the canon action gate accepted it.

## Actor per verb (standing check)

| Row | Who performs | Owner for the BE seat |
| --- | --- | --- |
| Buy bread | the lead as player | place-act `money()` (`definePlaceActs`, `src/book_world_lotm_cast_host.js:194`) |
| D1 negotiate rent, furniture, deposit | Benson on screen; the lead asks the buy price and steps back | none (content-only): the terms are facts and notes. A rent backlog row is not added: a weekly rent now exists (147 pence), with no due date or payer stated |
| D2 sign, notarize, pay | the siblings together | facts (`contract.notarized`, `pooled.purse`); no debit to a purse |
| D3 end the lease | Benson on screen; Klein watches | fact `franky.ended`; no lease object in `src` |
| Choose, tour, carry the move | shared, Benson speaks | authored acts and facts |

## What each act withholds and who reads it later

| Act | Withheld | Later reader |
| --- | --- | --- |
| `bread` | The whole night (intruder, dream, song, offer, choice) from Benson and Melissa; nothing is said of it | none in window; the silence is the check |
| `listing`, `tip`, `walk` | The real job and Klein's reason to move (rituals, a quiet house) | none in window |
| `scarter`, `choose`, `tour`, `buyprice`, `haggle` | From Scarter, the siblings' means; from the siblings, the ritual reason | ch30 P036-P041 |
| `keys` | From Benson and Melissa, why Klein wants new locks | none in range (open thread `locks.change`) |
| `rye`, `farrive`, `franky` | How Benson would open (planned on the way) | ch30 P056-P057 |
| `suit`, `evening` | The revolver and iron case move unmentioned | ch30 P071 (kjw5) |

## Verification (one line per check)

| Check | Result | Gap |
| --- | --- | --- |
| Text-length pre-scan (`prescan.mjs`) | `.py`: 20 offenders listed at once, then 5, then 3 (trimmed in three passes); final clean | three passes cost about 6 minutes |
| Presence preflight, prefix `kj3n.` | 0 blockers; Benson, Melissa, Scarter and Franky `PLACED_BY_ARRIVAL_ACT` throughout | static check only |
| Native route, headless Chrome, fresh origin, KJ3M checkpoint seed, B9 bundle (T4 runner) | Passed on run 9: 15 intents, money 2731 -> 2722, 0 page errors, 582.6 s | no 14/21 px captures |
| Literal Export/Import | Position (2 Daffodil Street), money 2722, KJ3M `choice.made.unrevealed`, KJ3L `range.practice`, KJ3K `job.story.told`, all new facts preserved | |
| Leak asserts | Scarter and Franky hold no Nighthawk, Beyonder, revolver, church, ritual, Seer, Sequence or silver text; Benson's and Melissa's new keys hold none of those, nor intruder or Dunn text | |
| B9 first act | `bread` at 300 minutes and at 870 minutes both accepted (refused before B9) | |

Not run: full `npm test`, a build, 14/21 px captures, human play-through, civil clock.

## Timing and corrections

- Source and brief read (estimates): about 25 minutes (brief, ch29-30 text, cast checks). Authoring: about 30 minutes (15 acts; three trim passes). Proof: runs 6-9; the chain replay took about 25 minutes of wall (sum above).
- Late corrections (3): (1) run 6 on the pinned bundle stopped at `bread` (B9, now fixed; recorded in `MECHANISM_BACKLOG` B9, `b4fd1a087`); (2) run 7 failed my own leak regex on the harmless word "offers" in Melissa's note, regex narrowed; (3) run 8 passed with a 300-minute night, but the engine clock then read the evening of day 3 (4113), short of Sunday morning, so the night is 870 minutes (4683, early Sunday) and the final clock is 4956.
- Clock: all minutes are labelled fill; no hour fact. The text states no hour for Sunday. The final checkpoint is day 4, clock 4956.
- Boot/import counts of the green run: 2 boots and 1 import.

## Next

kjw5 from ch30 P066 (Monday morning). Start money 2722 (a ceiling), position 2 Daffodil Street, Benson and Melissa at the house. Required keys: `book.lotm.kj3n.suit.bought`, `.moved` (kept exact).
