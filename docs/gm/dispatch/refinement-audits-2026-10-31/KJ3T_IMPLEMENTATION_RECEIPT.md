# KJ3T implementation receipt: the night, Old Neil's lesson, Dunn's signature and the routine week (kjw10)

2026-11-03. Window kjw10 of the KJ3 sweep. **Agent-verified, not human-reviewed (AD43).** Content and pack data only: no `src/`, `dist/` or test edits. Not installed, no personal save touched. Proven on the B10 bundle `private/proof-bundles/b10-bundle-45c086a7/` (bundle.js sha256 `45c086a712262768fffb6da96132d1998afe5b64daa2bfbd04eabcd61d6ee979`; scratch copy with its own `lotm-cast/cast.json`). Pack sha256 `2f55a872…`, revision `cast-reviewed-kj3t-77f5d7e6f88475f2` (carries KJ3F-KJ3T). Private files: `docs/research/novels/lord-of-mysteries/private/kj3t-ch39-2026-11-03/`. Seed: the KJ3S completed checkpoint. Predecessor: [KJ3S receipt](KJ3S_IMPLEMENTATION_RECEIPT.md).

## Scope and source

English v1 ch39 P058 - ch41 P066 (official edition). Seventeen acts in four scenes (`morning`, `lesson`, `paper`, `routine`), nothing folded: thirteen deep acts and four L1 routine-day cards. No fallback cut was needed. Text read fully is ch39 P058 - ch41 P030; ch41 P031-P066 are scenes Klein cannot see and build nothing (Q10). Next boundary: ch41 P067 (Friday, the storm). Intents per chapter: ch39 4, ch40 6, ch41 7.

| Brief intent | Act | Keys set (`book.lotm.kj3t.`) |
| --- | --- | --- |
| 1 The night | `night` | `night.slept` |
| 2 Cogitation and the recover | `cogitate` | `cogitation.morning` + pool recover |
| 3 Melissa, Benson, the walk in | `commute` | `commute.morning` |
| 4 Good morning at the reception | `greet` | `neil.question.asked`, `bredt.relieved` |
| 5 The two cups | `coffee` | `coffee.set`, `dowsing.demo` |
| 6 The rules of the pendulum | `rules` | `dowsing.rules`, `dowsing.limits` |
| 7 The perk | `perk` | `pendulum.perk.heard`, `pendulum.apply.plan` |
| 8 Symbolism | `symbols` | `symbolism.taught`, `memory.improved.noticed` |
| 9 Cogitate daily; the club on expenses | `advice` | `club.expense.offered`, `report.captain.promised`, `cogitation.daily.advised` |
| 10 The cup | `cup` | `cup.poured` |
| 11 The typewriter | `typing` | `application.typed` |
| 12 The documents | `documents` | `documents.read` |
| 13 Dunn signs | `signs` | `application.signed`, `pendulum.draw.allowed` |
| 14-17 Routine, Tue / Wed / Thu / Fri | `tue`, `wed`, `thu`, `fri` | `routine.set`, `routine.tue`, `pendulum.drawn.inferred`; `routine.wed`; `routine.thu`; `routine.fri` |

kjw11's required keys (`routine.fri`, `application.signed`, `pendulum.draw.allowed`, `dowsing.rules`, `club.expense.offered`, `report.captain.promised`) are present with the exact names.

## Open items settled

| # | Coordinator default | Built | Result |
| --- | --- | --- | --- |
| Q3 | Floor the night at 655 minutes; end at clock 12270 | fills as in the brief | clock equals 6905 plus the cumulative minutes after every act (asserted); the **655-minute night was accepted** (first night past a day roll since kjw5); final **12270 (Friday 12:30)** |
| Q4 | Cogitation as its own act plus the recover on wake | `cogitate` carries the literal `beSeerCogitateEffects()` | pool **0/3 before, 3/0 from `cogitate` to the end** (asserted every act); `night` changes nothing |
| Q5 | Money holds 798 | no debit anywhere | 798 asserted at every act |
| Q6 | Application subject stays unstated | notes say the text names no subject or amount and nothing is approved | |
| Q7 | Pendulum draw as an inferred fact | `pendulum.drawn.inferred` set in `tue`, labelled in its note; no inventory row | `inventories` unchanged (asserted) |
| Q8 | Build the four L1 cards; if a 1,440-minute card or the Thursday card past clock 10080 is refused, take the ch41 P030 fallback | all four built | **not refused.** `wed` (9030 to 10470, crossing 10080) and `thu` (10470 to 11910) ran, so the pack's anchors ending at 10080 caused no refusal and no page error |
| Q9 | Neil's question about last night | said as written; no explanation added | |
| Q11 | Places the pack lacks | the company is `cast-0785…`, the lesson `cast-a815…`; rooms stay in notes | no place minted. Relocations: Neil and Rozanne to the company in `night` (held by a visit to `greet`), Neil to the armory in `greet` (held to `cup`), Dunn to the company in `documents` (held to `signs`), Leonard to "Whereabouts unplaced" in `cogitate`, Melissa and Benson unplaced in `commute`, home in `tue`, unplaced again in `fri` (at most two non-player relocations per act). Preflight 0 blockers |
| Q12 | Zero Spirit Vision uses | none spent | |
| Q14 | Require only what has an in-window consumer | `rozanne.knows.seer`, tarot keys, stale `kj3p.home.asleep` not required | |

Mechanism proposals M1-M8 stay proposals. B12 (expense claim and team funding) is filed in [MECHANISM_BACKLOG](MECHANISM_BACKLOG.md) as a proposed row, not built.

## GATED beats (fallbacks)

| Gate | Beat | Fallback | Replace with |
| --- | --- | --- | --- |
| B5 (pendulum method) | `coffee`, `rules`, `perk` | knowledge cards of Neil's demonstration and the rules; Klein does not dowse; no cost | method-gated dowsing |
| B4 (divination cost) | none | no cost stated | |
| R1 (digestion, acting) | `advice` | facts and a note; no progress number | a digestion state |
| Expense claim (B12) | `advice`, `typing`, `signs` | facts and notes; no money moves | claim, approval, payout |
| Armory issue | `perk`, `signs` | `pendulum.draw.allowed`; the draw inferred; custody unreachable (B8) | an item loan |
| L1 routine (M5) | `tue`..`fri` | facts and notes, quantities exact | a period line |
| B2, B3 | none | no consumer, no Spirit Vision use | |

## Money

Nothing in the window states a price for Klein. Native money 798 (a ceiling) unchanged at every act (asserted). Not debited: Melissa's carriage, Klein's commute, lunches, groceries, any range fee. The application's amount is unstated. The 7-pence office ration starts Friday and is kjw11's.

## Actor per verb (standing check)

| Row | Who performs | Owner for the BE seat |
| --- | --- | --- |
| Sleep, Cogitate, recover | the lead as player | authored acts; `beSeerCogitateEffects()` place-act effect |
| Make two cups, learn the pendulum rules, symbolism | the lead as player; Old Neil teaches and demonstrates on screen | authored acts and notes (B5 unbuilt) |
| Ask the club on expenses | the lead as player; Neil advises | facts and a thread (B12 proposed) |
| Type the application | the lead as player | authored act |
| Sign it, allow the pendulum | Dunn on screen | facts (`application.signed`, `pendulum.draw.allowed`) |
| Routine days | the lead as player | L1 cards (facts and notes) |

## What each act withholds and who reads it later

| Act | Withheld | Later reader |
| --- | --- | --- |
| `greet` | From Neil, Klein's own guess about his perception | none |
| `coffee` | From Neil, that the dirt is boot mud, until asked | none |
| `symbols` | From Neil, the grey fog as the source of Klein's answer | none |
| `advice`, `typing`, `signs` | From Neil and Dunn, the old-world memory work behind the typing; the application's subject is unstated | kjw11 |
| `tue` | That the pendulum draw is inferred, not shown | kjw11 (Friday's topaz pendulum) |

Leak asserts at every act: Klein's notes hold no seat-side POV text and no old-world cause; Neil, Dunn, Rozanne, Leonard, Benson and Melissa hold no `kj3t` keys.

## Verification (one line per check)

| Check | Result | Gap |
| --- | --- | --- |
| Text-length pre-scan (`prescan.mjs`) on the `.py` | 17 offenders over 200, trimmed in one pass (two assertion misses in my trim script); final clean | |
| Pre-scan on the built `reviewed-episode.json` | clean | |
| Presence preflight, prefix `kj3t.` | 0 blockers; Neil, Rozanne and Dunn `PLACED_BY_ARRIVAL_ACT` | static check only; the brief's constraint-store select was not run, the acts' acceptance is the evidence |
| Native route, headless Chrome, B10 bundle, **two parts** | **Part 1 (run 2): acts `night` to `tue` (14 acts), every per-act assert passed, checkpoint `ckpt-tue.json` written. The headless browser then closed during `wed` ("Target page, context or browser has been closed") about 26 minutes into the run, as it had on the first run at the same point; no page error and no game message. Part 2 (run 3, `RESUME=tue`): `wed`, `thu`, `fri` and the persistence checks passed, 0 page errors, 1,523.6 s (settle 159-633 s each).** | the chain is two runs joined by a saved checkpoint, not one uninterrupted run; the `wed` act also passed in isolation, so the closure is a harness limit, not a game defect |
| Session, money, clock, pool, locations | closed session and three seats at `closed` at every act; money 798, clock and pool as listed, player location after every act | |
| Persisted | literal Export/Import then reload at the end: closed session, seats, position (company), money 798, pool 3/0, clock 12270, kjw9 and kjw10 facts, rounds 5 | |
| Rules check | `npm run check:rules` run before commit | |

Not run: full `npm test`, a build, 14/21 px captures, human play-through, civil clock.

## Timing and corrections

- Source and brief read (estimates): about 35 minutes. Authoring: about 55 minutes (17 acts; one 17-string trim pass). Proof: four runs; the long cards take 8-10 minutes of wall each.
- Late corrections (3): (1) 17 over-length strings; (2) the first full run died during `wed` with a closed browser, so the runner gained per-act checkpoints (`ckpt-<act>.json`) and a `RESUME` switch; (3) the second full run died at the same act, so the last three acts were run from `ckpt-tue.json`. The closure is attributed to the browser session lifetime (about 25 minutes), because `wed` passed alone.
- Clock: all fills labelled; final 12270 at the Blackthorn reception.

## Next

kjw11 from ch41 P067 at the Blackthorn reception on Friday about 12:30 (clock 12270): the application signed and pending, the pendulum permitted and the draw inferred, pool 3/0, money 798 (a ceiling), the session closed. Long runs need `RESUME` batches under about 25 minutes of browser life.


## Content reconciliation B509: actual consumers and remaining factual gaps

Seventeen acts include thirteen deep acts and four routine-day cards, not seventeen independently deep mechanics. The receipt's fully read text range ends at ch41P030; P031–P066 is excluded lead-invisible content, so its nominal scope does not prove those pages were fully source-read. The 655-minute night and two1440-minute cards passed across day boundaries, including10080; that is this pack/B10 behavior, not general civil-clock or unattended aging proof. Constraint-store select was not run. The proof comprises a saved fourteen-act prefix, two browser closures during Wednesday, an isolated Wednesday pass and a resumed final three acts/persistence. Browser lifetime is the author's plausible diagnosis, not a demonstrated universal25-minute limit or proof of game immunity. Night does not recover the pool; separate Cogitation does, with0/3→3/0 and zero later vision use. Dowsing is Neil's watched demonstration, not Klein's method execution. The signed application is pending with unstated subject/amount, and a permitted/inferred pendulum is not item custody. B12 was filed as proposed, whereas M1–M8 were not implemented. Routine notes do not perform the proposed period-line consumer. Money798 remains a ceiling and the seven-pence ration belongs to the next window. Existing actor visits, literal import/reload and exact facts are bounded historical proof; no full suite, new source build, typography or civil-clock test ran.
