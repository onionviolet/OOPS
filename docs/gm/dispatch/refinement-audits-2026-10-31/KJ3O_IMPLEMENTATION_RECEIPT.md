# KJ3O implementation receipt: the outfit, the Seer answer and Old Neil brews the potion

2026-11-03. Window kjw5 of the KJ3 sweep. **Agent-verified, not human-reviewed (AD43).** Content-only: no `src/`, `dist/` or test edits. Not installed, no personal save touched. Proven on the B9 bundle `private/proof-bundles/b9-bundle-2f659cc7/` (bundle.js sha256 `2f659cc73c6c19b592cf6e5571a7e6f70f35d3dcbf3c9f760b9867165f2e1431`, built from `3447f0a31`, includes B1 and B9; the run used a scratch copy with its own `lotm-cast/cast.json`). Pack sha256 `3a38e155…`, revision `cast-reviewed-kj3o-324ba6e710d5bcbd` (carries KJ3F-KJ3O). Private files: `docs/research/novels/lord-of-mysteries/private/kj3o-ch30-2026-11-03/`. Seed: the KJ3N completed checkpoint (money 2722, a ceiling). Predecessor: [KJ3N receipt](KJ3N_IMPLEMENTATION_RECEIPT.md).

## Scope and source

English v1 ch30 P066 - ch31 P077 (official edition), shard 4. Eleven acts in five scenes covering the brief's ten intents, nothing folded. The potion is made and **not drunk**; no B1 effect is used. Next boundary: ch32 P001 (kjw6, the cup, the drink at ch32 P010).

| Brief intent | Acts built | Keys set (`book.lotm.kj3o.`) |
| --- | --- | --- |
| 1 Mirror, eight pounds | `dress` | `outfit.worn`, `outfit.priced` |
| 2 Watch, cane, revolver, carriage | `ride` | `commute.done`, `melissa.fare.forgotten` |
| 3 Rozanne and the coffee | `coffee` | `rozanne.greeted` |
| 4 The answer | `answer` | `seer.chosen.told` |
| 5 The full minute | `minute` | `no.regret.warned`, `reasons.private` |
| 6 Stairwell and the question | `question` | `knowledge.sources` |
| 7 The door and civilian status | `door` | `alchemy.room`, `status.civilian`, `order.update` |
| 8 Neil arrives, lamps, method | `neil`, `method` | `neil.method` |
| 9 The first five | `five` | none (knowledge notes) |
| 10 The crucial two and the cup | `cup` | `ingredients.known`, `potion.made` |

Intents per chapter: ch30 (P066-P084) 4 acts, ch31 (P001-P077) 7 acts. Level: deep; the quiet stretch (`coffee`, `ride`) is short cards. `potion.made` is the name kjw6 requires.

## Open items settled

| # | Brief said | Built | Basis |
| --- | --- | --- | --- |
| Q1 | Test whether a place act can target the `anchorOnly` office and alchemy-room anchors, or mint | Dunn's office is the Blackthorn office `lotm.place.cast-0785d86b800a41be64ed` (as KJ3G-KJ3J and KJ3L); the alchemy room is a minted place `lotm.place.kj3o.alchemy-room`; the `anchorOnly` entries were not tested | the minimal-place append works (kj3c, kj3l, kj3n); ch32 starts in the minted room |
| Q2 | Who holds the potion | a fact (`potion.made`) and a note; no inventory row; nobody holds the cup | the text puts it in an opaque cup that Neil points at (ch31 P076) |
| Q3 | Star Crystal amount | "slightly under 50 g, exact figure not stated" | ch31 P066-P071 |
| Q6 | B9 clock risk | the first act carries **1260 minutes** (checkpoint clock 4956, day 4 10:36, to 6216, day 5 07:36); it was accepted. No canon beat refused it | the brief assumed 18:36 and 780 minutes; the checkpoint clock is 4956 |
| Q7 | Benson, Melissa | never placed or moved; their new keys are asserted empty | ch30 P072 is only an afterthought |
| Q9 | Sequence number | no number; "Seer" first appears in `answer` | brief rule |

Brief corrections: the suit debit is booked once in the first act; the diary-potions knowledge key is not required.

## Money (pence; 240 per pound, 20 soli per pound, 12 pence per soli; ch26 P079)

| Line | Pence | Locator | Native |
| --- | --- | --- | --- |
| Formal outfit (shirt, tuxedo, silk top hat, vest, trousers, boots, bow tie), total | -1920 (eight pounds) | ch30 P068 | `dress` |
| Carriage fare, Melissa's money, civilian salary, potion materials | unpriced | ch30 P071-P072, ch31 P020-P023 | none |

Native money: 2722 -> 802 in the first act and unchanged to the end, asserted at every step. **802 is a ceiling**, as 2722 was: it sits above the derived pooled bound 272 (2192 - 1920, ch30 P035 and P041); the engine cannot hold the pooled bound without an unstated debit and none is invented. The outfit was bought on Sunday (kjw4 `suit`); the price is booked here because the text first states it here. The payer is not stated; the native purse is the only purse the game tracks. The debit is a player-picked place act with a native cost, reserved in the pack, and the canon action gate accepted it.

## Actor per verb (standing check)

| Row | Who performs | Owner for the BE seat |
| --- | --- | --- |
| Pay for and wear the outfit | the lead as player | place-act `money()` (`definePlaceActs`, `src/book_world_lotm_cast_host.js:194`) |
| Ride, hide the revolver, take the cane | the lead as player | place act with relocation and notes; no firearm skill (backlog B8) |
| Tell Dunn the choice, hold the gaze, ask the question | the lead as player, Dunn answers on screen | authored acts and facts; no mechanism owns "choose a Pathway" |
| Be told civilian status, open the secret door | Dunn on screen | facts (`status.civilian`); no membership object |
| Brew the Seer potion | **Old Neil does every step; Klein watches and asks nothing** | none: watch-only content (backlog B7). No bench, no recipe object, no ingredient stock, no brew verb for the lead. Each ingredient and amount is a player knowledge note as Neil adds it |
| Drink the potion | not in this window | kjw6 (ch32 P010), B1 place-act effects |

## What each act withholds and who reads it later

| Act | Withheld | Later reader |
| --- | --- | --- |
| `dress`, `ride` | The revolver and the choice from the siblings (not on stage) | none |
| `coffee` | From Rozanne, the answer; her keys hold no Seer text | none |
| `answer` | From Dunn, Klein's reasons and real aim | `minute` |
| `minute`, `question` | From Dunn, the Tarot Club source, the diary tipping reason, the luck-ritual fear | none in window |
| `door` | Dunn's plan beyond the outline of the Order | ch31 P028 |
| `neil`, `method` | From Neil, the luck-ritual fear | none |
| `five`, `cup` | The rest of the goatskin page (Neil's wrist); the Sequence number | kjw6 (ch32 P001-P010) |

## Verification (one line per check)

| Check | Result | Gap |
| --- | --- | --- |
| Text-length pre-scan (`prescan.mjs`) on the `.py` and the built JSON | 6 offenders over 200 listed at once, trimmed in two passes (two more over after the first); final clean on both | |
| Presence preflight, prefix `kj3o.` | 0 blockers; Rozanne (ride), Dunn (coffee, minute) and Neil (neil) `PLACED_BY_ARRIVAL_ACT`; warnings: other-visit only | static check only |
| Native route, headless Chrome, fresh origin, KJ3N checkpoint seed, B9 bundle (T4 runner) | Passed on the first run: 11 intents, money 2722 -> 802, 0 page errors, 618.0 s | no 14/21 px captures |
| Literal Export/Import | Position (alchemy room), money 802, KJ3N `moved`, KJ3M `choice.made.unrevealed`, KJ3K `job.story.told`, all new facts preserved | |
| Seer state asserts | no ingestion flag, no `be_seer` source, no `be_spirituality` pool anywhere in the snapshot at any step; inventories unchanged | the B1 ingestion route itself is not run (kjw6) |
| Leak asserts | Rozanne holds no Seer, Sequence, potion or choice text; Dunn holds no Tarot Club, route-home, luck or diary text; Neil holds no luck, Tarot Club or route-home text; Benson and Melissa gain no keys | |

Not run: full `npm test`, a build, 14/21 px captures, human play-through, civil clock.

## Timing and corrections

- Source and brief read (estimates): about 20 minutes. Authoring: about 20 minutes (11 acts). Proof: one run, 618.0 s.
- Late corrections (1): the text-length pre-scan listed six offenders over 200 in one pass, then two more after trimming; fixed before the first run. No native rerun was needed.
- Clock: all minutes are labelled fill; no hour fact. Final clock 6312 (day 5). The brief said the checkpoint read 18:36; it read 10:36 (4956).
- Boot/import counts of the green run: 2 boots and 1 import.

## Next

kjw6 from ch32 P001: Klein in the alchemy room (`lotm.place.kj3o.alchemy-room`) with the cup (fact `book.lotm.kj3o.potion.made`, not in inventory), Old Neil there. Start money 802 (a ceiling). B1's first native proof is the drink at ch32 P010.


## Content reconciliation B500: source limits and actual executed scope

Historical11-act watch-only brewing window under AD36/AD42/AD43/AD49. Preserve all ten intent rows/Q1–Q9 corrections and actor/withholding tables. A minted minimal alchemy room works in the recorded route, while anchorOnly alternative was not tested. The cup is potion.made knowledge/fact with no actual inventory holder. Old Neil performs every brew step; Klein watches. No lead bench, recipe, ingredient stock or brew verb exists from these notes, and B1 ingestion/source/pool is explicitly absent until the next window. A true knowledge of ingredients does not grant execution or ingestion. Sequence choice name is first told in answer, private reasons remain undisclosed.

Eight-pound outfit debit2722−1920=802 is native accounting, but remains an upper bound inherited from unknown earlier debits and above the separate272 pooled bound. Source payer is unstated; charging the sole tracked purse at price disclosure is an authored abstraction of the earlier purchase, not a newly proven payment day or reconstructed complete household wealth. Unpriced fare/allowance/salary/materials are not numerical zero-cost source facts. The1260-minute fill corrects the brief's assumed780 and10:36 versus18:36, not a full civil-time calibration. All later duration values remain labelled fill.

One seeded KJ3N run on pinned B9 source plus scratch pack, literal import, zero-ingestion/pool/item assertions and selected leak checks support that bounded window, not a fresh campaign, current repo pack or built brewing engine. No14/21 captures, civil-clock, full suite or new build were run by that lane. Format trims and preflight are not semantic/source proof; the output schema/cup marker has an intended next consumer but no claim it was exercised in this receipt. Full public receipt read adds no new chapter/pack/source/browser/private-save inspection or human acceptance.
