# KJ3S implementation receipt: Mr. Glacis, Leonard, the armory and the evening (kjw9)

2026-11-03. Window kjw9 of the KJ3 sweep. **Agent-verified, not human-reviewed (AD43).** Content and pack data only: no `src/`, `dist/` or test edits. Not installed, no personal save touched. Proven on the B10 bundle `private/proof-bundles/b10-bundle-45c086a7/` (bundle.js sha256 `45c086a712262768fffb6da96132d1998afe5b64daa2bfbd04eabcd61d6ee979`; scratch copy with its own `lotm-cast/cast.json`). Pack sha256 `42b45598…`, revision `cast-reviewed-kj3s-d6a6052458e16636` (carries KJ3F-KJ3S). Private files: `docs/research/novels/lord-of-mysteries/private/kj3s-ch38-2026-11-03/`. Seed: the KJ3R completed checkpoint. Predecessor: [KJ3R receipt](KJ3R_IMPLEMENTATION_RECEIPT.md).

## Scope and source

English v1 ch38 P012 - ch39 P057 (official edition). Sixteen acts in three scenes (`reading`, `company`, `evening`), nothing folded; the brief's sixteen intents became acts one to one. No fallback cut was needed. Next boundary: ch39 P058 (the next morning). The second gathering stays closed throughout.

| Brief intent | Act | Keys set (`book.lotm.kj3s.`) |
| --- | --- | --- |
| 1 Led to the divination rooms | `led` | `led.in`, `topaz.chosen` |
| 2 The novice's warning, the free offer | `warned` | `glacis.warned`, `exchange.offered` |
| 3 The tap and the aura | `aura` | `aura.glacis` |
| 4 The first draw | `first` | `tarot.first` |
| 5 The second draw | `second` | `tarot.second` |
| 6 Two pence for the reading | `paid` | `paid.glacis` |
| 7 A word at the door | `door` | `lung.warned` |
| 8 The plan and the carriage | `carriage` | `fee.saving.plan`, `carriage.club.zouteland` |
| 9 Leonard's question | `leonardq` | `leonard.question` |
| 10 The vessel idea | `vessel` | `vessel.idea`, `leonard.probe.answered` |
| 11 Tomorrow's route | `route` | `route.told` |
| 12 The armory | `armory` | `bullets.drawn`, `rozanne.knows.seer`, `bredt.met`, `shift.swap` |
| 13 Practice | `practice` | `shooting.practice` |
| 14 Home in the dark | `ride` | `home.evening` |
| 15 Melissa's sums | `sums` | `budget.sums` |
| 16 The fare argument | `fare` | `fare.agreed` |

kjw10's required keys are all present with the exact pinned names. Intents per chapter: ch38 (P012-P085) 8 acts, ch39 (P001-P057) 8. Level: deep; `practice` and `ride` are short cards. Scenes Klein cannot see (ch38 P067-P071, ch39 P015-P016) are unbuilt (Q10).

## Open items settled

| # | Coordinator default | Built | Result |
| --- | --- | --- | --- |
| Q3 | Floor every fill, end about 19:05 | fills 2,2,2,3,3,1,2,6,2,3,1,5,26,8,4,4 | clock equals 6831 plus the cumulative minutes after every act (asserted); final **6905 (19:05)**. The text tension (afternoon at 18:12, "dark by seven") is carried as written |
| Q4 | Two stated 2-pence debits native; no debit for the unstated trackless fare | `paid` and `carriage` carry native `money` costs | money **802 -> 800 at `paid` -> 798 at `carriage`**, unchanged after (asserted every act). Both accepted by the canon action gate. 798 is still a ceiling |
| Q5 | Glacis route B (text role, no `requiredPeople` change) | Glacis, the attendant and Bredt are text roles in Klein's notes; none is enrolled or placed | **backlog row B11 filed** ([MECHANISM_BACKLOG](MECHANISM_BACKLOG.md)): Glacis enrolment, first consumer ch38 P012 |
| Q6 | No Topaz Room place unless needed | not needed: `led` to `door` run at the club place; the room and corridor are notes | no place minted |
| Q7 | Relocate only what the text needs | `carriage` moves Leonard to the Blackthorn reception (visit held to `route`); `route` moves Rozanne to the armory (visit held to `armory`); `ride` moves Melissa home (visit held to `fare`) | preflight 0 blockers; Old Neil and Benson were **not** moved (their absence is text-only: they never appear, and they hold no `kj3s` keys) |
| Q8 | One metered Spirit Vision use | `aura` spends `beSeerUse()`; the forehead tap at `paid` is a thinking pose, no second use | pool 1/2 before `aura`, **0/3 after**, unchanged to the end (asserted) |
| Q9 | Divination as fixed-outcome place acts | `first` and `second` store the card names, Glacis's rule and his spoken words; no verdict on the item | adapter not probed |
| Q10 | Lead-invisible POV stays unbuilt | followed | |
| Q11 | Bullets as a fact | `bullets.drawn` and a note; `inventories` and `household.opening.revolver.rounds` (5) asserted unchanged | custody not asserted (B8) |
| Q12 | Leonard's stare unmentioned | no line | |
| Q14 | Do not require `vision.affects.mood` or the stale `kj3p.home.asleep` | not required | |

Mechanism proposals stay proposals; none built.

## GATED beats (fallbacks)

| Gate | Beat | Fallback | Replace with |
| --- | --- | --- | --- |
| B3 (Spirit Vision, health reading) | `aura` (ch38 P027-P031) | fixed-outcome act spending `beSeerUse()` once; no switch state | on/off condition and aura reading |
| Divination (B4/B5/R1, adapter) | `first`, `second` (ch38 P032-P053) | place acts with authored card text; no cost, no method gate | divination queries through the adapter |
| B2 | none | no consumer | |

## Money (pence; 240 per pound, 20 soli per pound, 12 pence per soli)

Native money 802 -> 800 -> 798 (two debits as above). Unstated and not debited: the trackless fare home, any Shooting Club fee, the groceries, Melissa's one soli (taken offstage before the window). The talk at `sums` is notes: fares 4 and 8 pence, 24 a day, 12 soli a week, rent 12 soli 3 pence, Benson and Klein each 1 pound 10 soli a week, a penny paper, an eight-week repayment. No wage, rent or fare mechanism is proposed.

## Actor per verb (standing check)

| Row | Who performs | Owner for the BE seat |
| --- | --- | --- |
| Be led, choose a room, hear the offer | the lead as player; the attendant and Glacis speak (text roles) | authored acts and notes |
| Spirit Vision on Glacis | the lead as player | **B3 unbuilt**; fixed-outcome act with `beSeerUse()` |
| Tarot draws | the lead shuffles and flips; Glacis lays and states the rule | fixed-outcome place acts (B4/B5/R1 unbuilt) |
| Pay Glacis, pay the carriage | the lead as player | place-act native `money` cost |
| Question and answer with Leonard | the lead as player; Leonard on screen | authored acts and notes |
| Draw bullets, practise | the lead as player; Rozanne on screen, Bredt a text role | fact and notes; no firearm skill or stock (B8) |
| Money talk and the fare promise | the lead as player; Melissa on screen | authored acts, facts and notes |

## What each act withholds and who reads it later

| Act | Withheld | Later reader |
| --- | --- | --- |
| `aura`, `door` | From Glacis, the aura and the switch; he hears only face colour | the Glacis health thread |
| `first`, `second` | From Glacis, what the item is; no card verdict is recorded | later divination windows |
| `carriage` | From the attendant and Glacis, that he cannot afford the club and is acting | `savings.fee` |
| `leonardq`, `vessel` | From Leonard, the real cause of the mishap and Klein's own view | `leonard.suspicion` |
| `armory` | From Rozanne and Bredt, why the clothes | none |
| `sums`, `fare` | From Melissa, the Nighthawk job, the half pay under the advance, the revolver; the old-world debating skill | none |

Leak asserts at every act: Klein's `kj3s` notes hold no seat-side, Glacis-POV or Leonard-POV text and no old-world cause; Neil, Dunn, Wendy, Benson, Leonard, Rozanne and Melissa hold no `kj3s` keys.

## Verification (one line per check)

| Check | Result | Gap |
| --- | --- | --- |
| Text-length pre-scan (`prescan.mjs`) on the `.py` | 32 offenders over 200 listed at once, trimmed in one pass; final clean | |
| Pre-scan on the built `reviewed-episode.json` | clean | |
| Presence preflight, prefix `kj3s.` | first run: Melissa `AMBIGUOUS` at `sums` and `fare`; fixed with a relocation at `ride` and a visit; final 0 blockers, Leonard, Rozanne and Melissa `PLACED_BY_ARRIVAL_ACT` | static check only |
| Native route, headless Chrome, B10 bundle (T4 runner plus hand asserts) | **Passed on the first run: 16 intents, 0 page errors** | no 14/21 px captures |
| Session, money, clock, pool | session closed and three seats at `closed` at every act; money, clock and pool asserted per act as listed | |
| Persisted | literal Export/Import then reload: closed session, seats, position (home), money 798, pool 0/3, clock 6905, kjw8 and kjw9 facts, rounds 5 | |
| Rules check | `npm run check:rules` run before commit | |

Not run: full `npm test`, a build, 14/21 px captures, human play-through, civil clock.

## Timing and corrections

- Source and brief read (estimates): about 30 minutes. Authoring: about 50 minutes (16 acts; one 32-string trim pass). Proof: one run.
- Late corrections (2): (1) 32 over-length strings; (2) Melissa `AMBIGUOUS` caught by the preflight. A stray `loc` line in my hand-patched runner (undefined place names) was removed before the first run.
- Clock: all fills labelled; the source fixes only order and "a few minutes" for the carriage. Final clock 6905 at 2 Daffodil Street.

## Next

kjw10 from ch39 P058 at home on Monday evening (about 19:05): Melissa present, the carriage agreed (`fare.agreed`), pool reserve 0 strain 3, money 798 (a ceiling), the session closed. The night is the first act: sleep, Cogitation and the pool recover, then the day-index-5 morning (Old Neil's lessons, ch39 P059 on).
