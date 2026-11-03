# KJ3Z implementation receipt: the wallet returned, the Sunday afternoon and the Divination Club (kjw16, final window)

2026-11-03. Window kjw16 of the KJ3 sweep, the last. **Agent-verified, not human-reviewed (AD43).** Content and pack data only: no `src/`, `dist/` or test edits. Not installed, no personal save touched. Proven on the B10 bundle `private/proof-bundles/b10-bundle-45c086a7/` (bundle.js sha256 `45c086a712262768fffb6da96132d1998afe5b64daa2bfbd04eabcd61d6ee979`, matches; scratch copy with its own `lotm-cast/cast.json`). Pack sha256 `ebfe4861…`, revision `cast-reviewed-kj3z-76744cdb41ea066b` (carries KJ3F-KJ3Z). Private files: `docs/research/novels/lord-of-mysteries/private/kj3z-ch52-2026-11-03/`. Seed: the KJ3Y completed checkpoint, sha256 `d061e0d9…` (start state re-verified by script before building: clock 15178, money 787, pool reserve 0 strain 3, Klein and Neil at the company place, sessions closed, `share.collected` absent, 110 kj3y keys, kjw16's required names all present, pack 942 acts). Predecessor: [KJ3Y receipt](KJ3Y_IMPLEMENTATION_RECEIPT.md). The brief was re-read end to end first.

## Scope and source

English v1 ch52 P036 - ch54 P079 (official edition). Twenty-three acts in three scenes, one per brief intent, nothing folded; no fallback split. The cut ends at Klein asking Anna which divination method she wants; method, fee and result belong to a later volume. Three scenes the lead does not witness (ch52 P059-P078, ch53 P001-P024, ch54 P051-P067) build nothing. Final clock 15384 (16:24, engine day 10); money 787.

| Scene | Acts (`book.lotm.kj3z.`) |
| --- | --- |
| The wallet goes back | `owner`, `verify`, `return`, `dewey`, `settled`, `stair` |
| Sunday afternoon at the company | `lunch`, `report`, `goddess`, `why`, `route`, `hold` |
| The Divination Club | `range`, `doctor`, `lie`, `aura`, `advice`, `members`, `room`, `pend`, `booking`, `topaz`, `story` |

Minutes (fill, labelled; sum 206): 2, 4, 3, 2, 2, 5, 75, 5, 3, 4, 2, 3, 60, 8, 3, 2, 3, 2, 3, 4, 5, 3, 3. 106 distinct player-actor fact keys under the prefix. Every Q10 required name from kjw11-kjw15 is required by an act and present.

## Constraint-store select (printed first)

`clock 15178-16000 (rest of engine day 10): beats=84, max beat day 7, beats on day 8 or later 0, anchors on day 8 or later 0, schedule rows 77, rows until day 8 or later 0.` No unsettled beat.

## Open items settled (coordinator defaults)

| # | Default | Built | Result |
| --- | --- | --- | --- |
| Q1 | one window with a ceiling waiver; split at ch53 P062 only if context at risk | one window, 23 acts | **no split**; context was not at risk. About 2,990 of the ~4,720 words are built, the rest is unwitnessed or withheld |
| Q5 | facts only for the two Spirit Vision uses at an empty pool; no Cogitation the text does not show | `aura` (Angelica) and `topaz` (Anna) are facts and notes | pool reserve 0 strain 3 asserted after every act; no `beSeerUse()` |
| Q7 | Neil's settled claim and Klein's reaction as written, no causal link | `settled` | the note says "settled by Neil's account; whether the ritual caused the money is not stated" |
| Q8 | no exemptions in the leak regex | followed | vault (whole word), earth, keyboard, gathering, previous life, ouija, fool, tarot, hanged man, gray fog, transmigrat, Audrey, Alger, Susie, seat; old-world clauses at ch53 P030, ch54 P010, P036, P076 and the ch52 P056 profanity left no or neutral text |
| Q9 | unwitnessed scenes build nothing | built | the reception, Angelica's recommendation to the client and the first pass at the door are absent |
| Q14 | no knowledge rows for any non-player | built | Neil, Dunn, Rozanne, Leonard, Orianna, Benson and Melissa hold no `kj3z` text (asserted every act) |
| Money | holds 787 unless coins change hands on screen | held | the three ten-pound notes are Neil's; no fee, tea price or range fee is stated |

## Session and seat guards (asserted every act)

`simulation.sessions` empty; `household.excursion.meeting.active` and `household.kj3q.meeting.active` falsy; the three presence people at `lotm.arc.presence.closed`; originals at their offscreen places; alias facts (`The Fool`, `Justice`, `The Hanged Man` in the stored seed, not printed in any note) and the schedule fact "Monday, 3 p.m.; participants alone" unchanged; `first_gathering`/`second_gathering` untouched; rounds fact 5; holder fact unchanged.

## Places and presence

Klein: company place (`lotm.place.cast-0785d86b800a41be64ed`) from `owner` through `hold`; Underground shooting range (`cast-7970e3ee…`) after `range`; Divination Club (`cast-97c3d9b9…`) from `doctor` to `story`. Neil relocated to the company in `owner`, visit to `lunch`. Dunn relocated to the company in `report`, visit to `hold`. Angelica, Hanass, the butler, Sir Deweyville and Anna are text roles; Rozanne, Leonard unplaced, Orianna at the accounts office. Preflight 0 blockers; its remaining duplicate-place WARN lines are the known "Club" and "Underground" name overlaps.

## Money (pence)

Nothing moves. The commission share (2,400) still shows no signing on screen, so the purse 787 stays a ceiling and `share.collected` is never set (also not set: `fee.agreed`, `fee.paid`, `income.first.client`). Knowledge only: the wallet's 72,000-84,000, Neil's three ten-pound notes (7,200).

## Actor per verb (standing check)

| Row | Who performs | Owner for the BE seat |
| --- | --- | --- |
| Return the wallet, accept the reward | Old Neil | facts; no resource moves |
| Aura read of Angelica and of Anna | the lead, at an empty pool | facts and notes, no use metered (text shows no Cogitation) |
| Pendulum over the tea | the lead, staged for Angelica | a performance fact; no question, no answer, no cost |
| Choose the Topaz room, ask the method | the lead | facts; no fee settled |

## Gated beats (fallbacks)

| Gate | Beat | Fallback |
| --- | --- | --- |
| B3 / B4 / R3 Spirit Vision | `aura`, `topaz` | facts and notes; the pool is 0/3 and the text shows no recovery, a mismatch with the B3/B4 meter that I leave as a datapoint |
| B5 pendulum | `pend` | a performance fact, gate unbuilt |
| B6 listing, first client | `booking`, `topaz`, `story` | request and story as facts, no fee |
| R9 services and referral | `booking` | the lead hears only the request |
| B8 firearms | `hold`, `range` | statement and destination; no practice |
| R6 / R7 sealed artifact | `report` | two facts, clearance lacked |
| R5 / U3 | `settled` | claim as fact, no causal link |
| Found money (no row) | `owner` to `settled` | facts only |
| B9 long act | `lunch` (75), `range` (60) | none needed |

## What each act withholds and who reads it later

| Act | Withheld | Later reader |
| --- | --- | --- |
| `settled` | how the debt was settled (Neil's word only) | a later R5/U3 owner |
| `report` | what artifact 2-049 does; Klein lacks clearance | R6/R7 owner |
| `aura`, `topaz` | any Cogitation or spirituality cost | a B3/B4 owner |
| `topaz`, `story` | method, fee and result of Anna's divination | the next volume |
| `dewey`, `lie`, `why` | old-world clauses and Klein's private reasons: no text | none |

## Verification (one line per check)

| Check | Result | Gap |
| --- | --- | --- |
| Pre-scan on the `.py` and the built JSON | about 35 over-length strings trimmed in three passes; final clean ("no string over 200 characters") | |
| Presence preflight, prefix `kj3z.` | 0 blockers | static check |
| Native route, headless Chrome, B10 bundle, one run | **Passed: 23 intents, money 787 unchanged, 0 page errors, 617.2 s, 3 boots and 1 import; every per-act assert (money, clock at 15196/15271/15288/15348/15384, location, pool 0/3, seats, session closed, alias and schedule facts, rounds, holder, inventories, leak, non-player leak)**; no RESUME join, no timeout | |
| Persisted | literal Export/Import then reload at the end: closed session and seats, Divination Club, money 787, pool 0/3, clock 15384, kjw16 facts and kjw9-kjw15 facts | |
| Rules check | `npm run check:rules` before commit | |

Not run: full `npm test`, a build, 14/21 px captures, human play-through, civil clock.

## B9 datapoint

`lunch` (75 minutes) and `range` (60) accepted as single acts, no refusal. Row text: "B9: kjw16 ran no act over 75 minutes; no refusal."

## Proposed backlog row texts (not filed)

- M1 R5/U3: Neil's claim that the IOU is settled completes the watch-only consumer kjw15 opened; claim and reaction built as facts, no causal link.
- M2 B3/B4: ch54 shows two Spirit Vision uses by the lead with the pool at 0/3 and no Cogitation shown in ch52-54; built as facts, mismatch recorded.
- M3 B5: ch54 P041 is a staged pendulum, no question and no cost; a performance fact, gate unbuilt.
- M4 B6: the first client reaches the lead at ch54 P068-P071 and the cut ends before method and fee.
- M5 R9: Angelica's recommendation to the client is seen from the reception side only; nothing built for the lead seat.
- M6 B8: Dunn's shooting advice and the Shooting Club visit are a statement and a destination; a fact, no practice.
- M7 R6/R7: the sealed artifact is first mentioned with the lead lacking clearance; two facts.
- M8 found money and honest return (no row): kjw15 built the find, kjw16 the return, as facts, no resource moves.
- M9 B9: see above.

## Timing and corrections

- Authoring about 70 minutes; proof one 11-minute run.
- Corrections (3): about 35 over-length strings across three trim passes; the runner patch needed a location rule (range at the company place, range after `range`, club from `doctor`); the receipt tool prints MISMATCH when given a bundle prefix, the full sha matches.

## Volume 1 closing (ch32-54 sweep)

Status labels: **verified** = read from the saved checkpoint, pack or receipts by script or grep this session; **inferred** = my reading. Findings and proposals here are not accepted decisions.

**End state (verified).** Money: engine purse 787; the text-implied figure is higher (the 2,400-pence commission share is unsigned on screen, and the wallet reward was Neil's), so 787 is a ceiling, as kjw14 Q4 said. Pool: reserve 0, strain 3. Clock 15384 (16:24, engine day 10), at the Divination Club. Sessions: none open, `first_gathering`/`second_gathering` closed, three presence seats closed. Open threads: 20 by key script (22 opened, 3 closed across kj3d-kj3z; the closed ones include `neil.debt` and `found.wallet`).

**Player-actor `book.lotm.kj3*` fact keys (verified, printed by script).** kj3d 9, kj3e 7, kj3f 4, kj3g 8, kj3h 6, kj3i 8, kj3j 13, kj3k 13, kj3l 17, kj3m 16, kj3n 16, kj3o 15, kj3p 21, kj3q 21, kj3r 27, kj3s 23, kj3t 27, kj3u 42, kj3v 78, kj3w 120, kj3x 112, kj3y 110, kj3z 106. Total 819 across kj3d-kj3z (713 across kj3d-kj3y before this window); 850 player facts in all (744 before).

**Pack (verified).** Acts before 942, after 965 (942 + 23); revision `cast-reviewed-kj3z-76744cdb41ea066b`.

**GATED beats still on fallbacks, by B-code (verified from the KJ3P-KJ3Z gated tables; "B13 is not a board row", it was a proposed label for commission payout).**

| Code | State | Where it was a fallback |
| --- | --- | --- |
| B1 Seer source and pool | merged, implemented below floor | built in KJ3P onward on the B10 bundle |
| B2 eyes seen | unbuilt | KJ3P (`plate`), KJ3W (`cane`) |
| B3 Spirit Vision switch and exhaustion | unbuilt | KJ3P-KJ3T, KJ3V-KJ3Z: fixed-outcome or fact-only uses |
| B4 divination cost | unbuilt | KJ3S, KJ3T, KJ3W, KJ3Z |
| B5 pendulum / method | unbuilt | KJ3T, KJ3W, KJ3Z |
| B6 listing and clients | unbuilt | KJ3X, KJ3Z |
| B8 firearms | unbuilt | KJ3V, KJ3Z |
| B9 long acts | resolved empirically, 695 minutes accepted | KJ3V, KJ3W, KJ3X, KJ3Y, KJ3Z |
| B10 energy contract | resolved (bundle `45c086a7`) | KJ3P failed at boot on the earlier bundle |
| B11 Hanass, Angelica, Royale, Bredt | unbuilt, text roles | KJ3X, KJ3Y, KJ3Z |
| B12 expense claim | unbuilt | KJ3T, KJ3X |
| R1-R9 | unbuilt (R1 digestion, R2 halfpence, R3 aura reads, R4 illusory items, R5 rites, R6/R7 sealed artifact, R9 referral) | as named in the rows above |
| B7 | no gated row in KJ3P-KJ3Z receipts | not stated |

**Mechanisms proposed but unbuilt (verified from receipts).** The M-rows in each receipt (KJ3P-KJ3Z) are all proposals; none is filed or built. The most-mentioned code is B10 (28 mentions) then B9 (22) and B3 (17), counted by grep across KJ3P-KJ3Y; of those only B10 and B9 are now settled, so B3 Spirit Vision is the most-repeated open mechanism (inferred).

**Native proof coverage by window (verified from receipts; headless Chrome, fresh origin, each seeded by the previous window's checkpoint).**

| Window | Receipt | Range | Bundle | Result |
| --- | --- | --- | --- | --- |
| kjw2 | KJ3L | withdrawal to range | pinned | 14 intents, run 2, 0 page errors, 468.8 s |
| kjw3 | KJ3M | Benson, lease, intruder | pinned | 15 intents, third attempt (first two stopped at `dawn`), 284.6 s |
| kjw4 | KJ3N | Sunday, Daffodil Street move | B9 | 15 intents, run 9, 582.6 s |
| kjw5 | KJ3O | outfit, Seer answer, potion | B9 | 11 intents, first run, 618.0 s |
| kjw6 | KJ3P | Seer drink | B9 then B10 | **failed at boot on B9** (`Unknown authored energy`); passed on B10, 17 acts, 268 s |
| kjw7 | KJ3Q | second gathering | B10 | 19 intents, second run, 340.8 s |
| kjw8 | KJ3R | errand, Divination Club | B10 | 16 intents, first run, 294.1 s |
| kjw9 | KJ3S | Glacis, armory, evening | B10 | 16 intents, first run |
| kjw10 | KJ3T | night, lesson, routine week | B10 | **two parts** joined by a checkpoint; browser closed during `wed` twice |
| kjw11 | KJ3U | ration, commission, search | B10 | 16 intents, one run, 334.2 s |
| kjw12 | KJ3V | rescue, night, dawn visit | B10 | 25 intents, one run, 829.2 s |
| kjw13 | KJ3W | apartment, portrait, noon | B10 | 25 intents, one run, 597.1 s |
| kjw14 | KJ3X | club, lessons, dinner | B10 | 25 intents, one run, 665.1 s |
| kjw15 | KJ3Y | table, ritual lesson, wallet | B10 | **two parts**: 25 acts passed at 1,613.6 s, final post-import boot timed out (60 s), persistence checks run from `ckpt-wait.json` |
| kjw16 | KJ3Z | wallet return to first client | B10 | 23 intents, one run, 617.2 s, no join |

Every window has native proof; none is without one. Persistence (Export/Import and reload) is asserted at the end of kjw11-kjw16 (verified for kjw15 and kjw16 in this session; the others as their receipts record it); earlier windows are as their own receipts state.

**The one remaining authoritative gate for the whole sweep (inferred).** Weibao playing the chain end to end, from a fresh save through the Divination Club, on a bundle that carries B10, is the only check that spans windows; the per-window runs prove each hop from a saved checkpoint, and a continuous run of all hops in one save is not recorded here. Until then the sweep is agent-verified, not human-reviewed.
