# KJ3M implementation receipt: Benson, the lease, the intruder and the three paths

2026-11-03. Window kjw3 of the KJ3 sweep. **Agent-verified, not human-reviewed (AD43).** Content-only, below the human gate: no `src/`, `dist/` or test edits. Not installed, no personal save touched. Proven on the pinned KJ3E bundle (`919b17d3a114e5c622d0efd81f53a84c927012d10537c863fdb851ba2d7c9abf`, unchanged; the repo `dist/bundle.js` was not used). Pack sha256 `8ebc961d…`, revision `cast-reviewed-kj3m-159465c926fb3e80` (carries KJ3F-KJ3M). Private files: `docs/research/novels/lord-of-mysteries/private/kj3m-ch26-2026-11-02/`. Seed: the KJ3L completed checkpoint (money 2744, position the flat). Predecessor: [KJ3L receipt](KJ3L_IMPLEMENTATION_RECEIPT.md).

## Scope and source

English v1 ch26 P069 - ch29 P016 (official edition), shards 3 and 4. Fifteen acts in five scenes covering the brief's eight proposed intents, nothing folded. Next boundary: ch29 P017 (Sunday morning, kjw4).

| Brief intent | Acts built | Pinned keys set (`book.lotm.kj3m.`) |
| --- | --- | --- |
| 1 Benson, cover story, coin joke | `arrive`, `cover` | `benson.told.cover` |
| 2 Lease and plans | `lease`, `lunch` | `lease.constraint`, `visit.plan` |
| 3 Lunch, market, bakery, weights | `market`, `home` | `market.stocked`, `fourth.epoch.reading` |
| 4 Celebration dinner | `table`, `serve`, `dinner` | `dinner.held` |
| 5 Dream warning and bluff | `dream`, `bluff` | `dream.warning`, `intruder.bluffed`, `chamber.empty.revealed` |
| 6 Dunn at the corridor end | `settled`, `order` | `dunn.settled`, `secret.order` |
| 7 Offer and three paths | `offer` | `offer.made`, `paths.described`, `daly.seq7.confirmed`, `monday.deadline` |
| 8 Awake until dawn | `dawn` | `choice.made.unrevealed` (no key names a Sequence) |

Intents per chapter: acts cross chapter edges (`cover` ch26-27, `dream` ch27-28, `offer` ch28-29), so chapter counts are not clean; the window averages about 3.7 acts per chapter over ch26 P069 - ch29 P016. Level: deep. The quiet-stretch rows (`lunch`, `home`) are short cards with no new chore mechanism.

## Corrections to the brief

| # | Brief said | Built | Basis |
| --- | --- | --- | --- |
| C1 | Corridor-end window is NEW | pack `lotm.place.cast-5c546fd1eaf3c3376183` (Apartment corridor) | existing place (zh ch13 p4 corridor, where Dunn first speaks) |
| C2 | Dream visit: Dunn is a note, not a relocation | built so, `dream` has only the intruder relocation | brief rule kept |
| C3 | Intent 5 sets `chamber.empty.revealed` as a self-note | a fact plus a player note; the intruder's note says nothing of the empty chamber | the ch28 P033-P034 line is said alone |
| C4 | Fill for the final act | `dawn` is 20 minutes (see late corrections) | engine refused 120 and 360 |
| C5 | Bakery NEW | a note inside `home`, no place | purchases unstated (ch27 P023) |
| C6 | Seed required `kj3i.diary.potions`, `kj3j.paths.incomplete`, `kj3g.duty.diary` as facts | they are knowledge keys in the checkpoint (present once each); not required as facts | checkpoint grep |

## Money (pence; AD49 anchors)

| Line | Pence | Locator | Native |
| --- | --- | --- | --- |
| Exchange: 20 soli to the pound, 12 pence to the soli (so 240) | n/a | ch26 P079 | recorded in the `cover` note |
| Pound of beef | -6 | ch27 P021 | `market` |
| Fresh fish | -7 | ch27 P021 | `market` |
| Potatoes, peas, radishes, rhubarb, lettuce, turnips, rosemary, basil, cumin, oils | unpriced | ch27 P021 | not charged |
| Bakery, ginger beer, lemon pudding | unpriced | ch27 P023, P030-P031 | not charged |

Native money: 2744 -> 2731 after `market`, unchanged to the end; each step asserted. **2731 is a ceiling, not a figure**: the unpriced goods lower the true purse by an unknown amount; the game does not invent a price. Carried at the market: three soli notes (36 pence) plus an unstated number of pennies (ch27 P021); the source of the notes is assumed to be the drawer. The money change is a player-picked place act with a native cost, reserved in the pack, and the canon action gate accepted it.

## Actor per verb (standing check)

Every verb is the player's, as the BE seat: telling the cover story, shopping, cooking and serving (notes), aiming and bluffing (the revolver is a fact and note, no firearm skill: [B8](MECHANISM_BACKLOG.md)), following Dunn, asking about the paths, lying awake. Non-player actions (Benson's reaction, Dunn's dream warning, the intruder's escape, the unseen singer) are knowledge notes written in the same act, never separate acts for the player to pick. Owner: `definePlaceActs` and `quotePlaceActs` over `householdActs` (`src/book_world_lotm_cast_host.js:194` and `:112`). The singer is never an actor. The choice is not stored as a Sequence name, so the Monday answer (kjw5) is the first act that may name it; the Seer chain stays gated on B1 ([B1](MECHANISM_BACKLOG.md)).

## What each act withholds and who reads it later

| Act | Withheld | Later reader |
| --- | --- | --- |
| `arrive`, `cover` | From Benson, the true employer, the Church, the revolver, the watcher, the day's cathedral and Dunn visit | ch27 P033 toast, ch29 P026 |
| `lease`, `lunch` | From Benson, the real reason to move and the advance | ch29 P021, P031-P036, ch30 P042-P055 |
| `market`, `home` | From shopkeepers and Benson, the watcher and why he trains | `dinner`, ch31 P012-P015 |
| `table`, `serve`, `dinner` | From both siblings, the job, the revolver and the watcher | ch28 P024, P030, ch29 P018 |
| `dream`, `bluff` | From the intruder, the empty chamber; from the siblings, everything | `settled`, ch29 P018-P021 |
| `settled`, `order` | By Dunn, the intruder's fate and who sang; by Klein, the watcher deduction | ch31 P028 |
| `offer` | From Dunn, Klein's real aim (a way home) | ch30 P080-P084, ch31 P006 |
| `dawn` | From everyone, which path he chose | ch30 P080-P084 |

## Verification (one line per check)

| Check | Result | Gap |
| --- | --- | --- |
| Text-length pre-scan (`prescan.mjs`) | `.py`: 9 offenders listed in one pass; rebuilt JSON clean | |
| Presence preflight, prefix `kj3m.` | 0 blockers; Benson (arrive, table), Melissa (serve), the intruder (dream), Dunn (settled) `PLACED_BY_ARRIVAL_ACT`; weak warnings only | static check only |
| Native route, headless Chrome, fresh origin, KJ3L checkpoint seed, pinned bundle (T4 runner) | Passed on the third attempt (the first two stopped at `dawn`, see below): 15 intents, money 2744 -> 2731, 0 page errors, 284.6 s | no 14/21 px captures |
| Literal Export/Import | Position (flat), money 2731, KJ3L `range.practice`, KJ3K `job.story.told`, KJ3J `university.withdraw.planned`, all new facts preserved | |
| Leak asserts | Benson's and Melissa's new keys hold no Nighthawk, Beyonder, revolver, way-home, mysticism, silver or Sequence text | |

Not run: full `npm test`, bundle build, 14/21 px captures, human play-through, civil clock, chain replay of earlier runners.

## Timing and corrections

- Source and brief read (estimates): about 10 minutes (plus the text reread for the AD49 anchors, ch26 P079 and ch27 P021). Authoring: about 15 minutes. Native proof: three runs (284.6 s on the green one; two earlier runs about 5 minutes each to the same refusal).
- Late corrections (1): the engine refused `dawn` at 360 and then 120 minutes with "leave time for what you have planned" (`src/constraint_store.js:78`: a non-fill beat reserved for the player lies inside the window). Cause not diagnosed; 20 minutes passes, matching `offer`. The night is unnarrated; the next window should carry the clock to Sunday morning as `walk` did in KJ3L (720 minutes passed there).
- Clock: all minutes are labelled fill; no hour fact; the text gives no hour for Saturday.
- Defects: none beyond the above. Boot/import counts of the green run: 2 boots and 1 import.

## Next

kjw4 from ch29 P017. Start money 2731 (a ceiling), position the flat, Benson and Melissa at the flat for Sunday. The dawn clock is short of the text's Sunday-morning state; kjw4's first act sets it with fill.


## Content reconciliation B496: actual consumer and retained proposal scope

Historical15-act household/dream continuation under AD36/AD42/AD43. Preserve all eight intent/act mappings, C1–C6 corrections, monetary source anchors and withheld-recipient rows. Fifteen acts across partial chapters are action inventory, not a clean source denominator. The existing corridor is reused; bakery and chores can remain notes without new place/verbs. Actual known keys are not interchangeable with facts, and an unrevealed chosen path must not be named by future Sequence keys before the later answer. Actor-per-verb notes describe player participation versus observed non-player actions, not a general engine in which actors have no autonomous capabilities.

Only two priced goods are debited:2744−6−7=2731. Unpriced produce/bakery/drinks and assumed note source remain unmodeled, so2731 is an upper bound, not a precise recovered purse. Pocket carrier36-pence notes/coppers and full balance are separate scopes. Cooking/aiming/dream warning/fate/relationship notes do not become actual firearm/food/contract/occult engines from a fact label. The stated empty chamber was private; older recipient knowledge cannot be inferred from narration or leak-regex pass. B1 gating remains a mechanism dependency at this receipt's time, not a source-law inability.

The final dawn act was shortened360→120→20 after reservation refusals; that is a disclosed workaround with undiagnosed cause, not a repaired clock/constraint defect. The final state is short of Sunday morning, and a later window's planned fill does not prove calendar correctness here. Earlier20-minute acceptance does not justify discarding protected actual appointments/resources. Source durations are labelled fill. Third-attempt native success, final literal import and selected new-key leak checks retain their input/pinned-bundle scopes; no14/21 captures, civil clock, full earlier-chain replay or fresh ordinary entry was verified.

The phrase below the human gate does not create a required human blocker under AD42. Human play is optional; missing source/consumer/clock evidence remains distinct. The final short run is not equivalent to two earlier failing long-night attempts and does not prove every admitted duration. Old next-window/source/model instructions and proof-path IDs remain history. This complete receipt review reads neither private source, current pack/source nor browser/save artifacts and adds no actual clock, installation or gameplay proof.
