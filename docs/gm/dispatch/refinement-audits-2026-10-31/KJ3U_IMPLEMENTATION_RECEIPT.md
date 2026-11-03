# KJ3U implementation receipt: the ration, Leonard's commission and the search for the boy (kjw11)

2026-11-03. Window kjw11 of the KJ3 sweep. **Agent-verified, not human-reviewed (AD43).** Content and pack data only: no `src/`, `dist/` or test edits. Not installed, no personal save touched. Proven on the B10 bundle `private/proof-bundles/b10-bundle-45c086a7/` (bundle.js sha256 `45c086a712262768fffb6da96132d1998afe5b64daa2bfbd04eabcd61d6ee979`; scratch copy with its own `lotm-cast/cast.json`). Pack sha256 `f6c8f143…`, revision `cast-reviewed-kj3u-dd8edf34cc3b2c02` (carries KJ3F-KJ3U). Private files: `docs/research/novels/lord-of-mysteries/private/kj3u-ch41-2026-11-03/`. Seed: the KJ3T completed checkpoint (clock 12270, money 798, pool 3/0). Predecessor: [KJ3T receipt](KJ3T_IMPLEMENTATION_RECEIPT.md).

## Scope and source

English v1 ch41 P067 - ch43 P084 (official edition). Sixteen acts, one per brief intent, nothing folded; no fallback cut was needed. Next boundary: ch43 P085 (the third-floor landing). Final clock 12479 (12270 + 209 fill minutes).

| Scene | Acts (`book.lotm.kj3u.`) |
| --- | --- |
| Office afternoon | `lunch`, `visitor`, `slip`, `paper`, `klee`, `leonard`, `offer`, `contract`, `help` |
| Preparing the hunt | `medium`, `ride`, `hire` |
| The search | `dowse1`, `route`, `block`, `floor3` |

Minutes (fill, labelled): 12, 6, 5, 60, 30, 2, 6, 12, 3, 8, 25, 5, 6, 19, 4, 6. Every intent sets its own `book.lotm.kj3u.*` fact (for example `ration.seven`, `contract.signed`, `mission.joined`, `dowsing.first`, `dowsing.cane.method`, `route.corrected`, `building.found`, `room.found`, `weapons.recalled`); the full key list is asserted in the runner's persistence block.

## Open items settled (coordinator defaults)

| # | Default | Built | Result |
| --- | --- | --- | --- |
| Q1 | Take each brief default as written | done | |
| Q2 | Meter only the one Spirit Vision tap; dowsing costs nothing; end 2/1 | `floor3` carries the metered tap; `dowse1` and `route` have no cost | pool **3/0 asserted through `block`, 2/1 from `floor3`** |
| Q3 | Debit the 7-pence ration only if shown paid or issued on screen | debited in `lunch` as a native cost | the text has the ration issued, eaten and priced on screen. **Money 798 -> 791** (native, asserted at every step after `lunch`). 791 is a ceiling like 798 |
| Q4 | Mint no place for the three-storey block | none minted | block and floors stay in notes; the player stays at the carriage place |
| Q5 | Boundary ch43 P084 | reached | no fallback cut (P066, P020, P087, P009) used |
| Q6 | Checkpoint per act, RESUME batches | per-act `ckpt-<act>.json` written | one batch was enough (334.2 s); `RESUME` unused |
| Q7 | Print the constraint-store select first | printed before the first act | 84 canon beats, max beat day-end 4, 0 beats on day 8 or later; 0 anchors ending at or after day 8; 77 schedule rows. Every act accepted |

## Places and presence

The company is `cast-0785…`; the carriage place `cast-b4fd…` (`Carriage in transit`) is the act place from `medium` on, and the **untested carriage place was accepted**. Relocations: Rozanne held at the company by a visit `lunch` to `contract`; Leonard placed at the company in `klee` (a preflight run showed him HELD_BY_VISIT at the gate without that), visit `klee` to `medium`, then a second visit `medium` to `floor3`. Preflight 0 blockers. Dunn, Neil, Orianna, Melissa, Benson untouched.

## Money (pence; 240 per pound, 20 soli, 12 pence per soli)

| Line | Pence | Locator | Native |
| --- | --- | --- | --- |
| Office ration, on the sofa | -7 | ch41 P067+ (`lunch`) | yes |
| Gun prices, fares, hire rate, contract fee | stated or unstated, not debited | `paper`, `ride`, `hire`, `contract` | none; facts and notes only |

## Actor per verb (standing check)

| Row | Who performs | Owner |
| --- | --- | --- |
| Eat, read, sign, ride, hire | the lead as player | authored acts, native debit for the ration |
| Dowse with the cane and notebook | the lead as player, no cost | authored act; no B5 method object (unbuilt) |
| Spirit Vision tap | the lead as player | `beSeerUse` place-act effect, metered once |
| Offer, photograph, clothes | Leonard and the client on screen | facts and notes |

## Proposed mechanism rows (not built)

M1 contract or commission row (`contract.signed`, `contract.copy.held`), M2 hire-by-time carriage fares, M3 a medium-assisted dowsing consumer for B5. All stay proposals.

## What each act withholds and who reads it later

| Act | Withheld | Later reader |
| --- | --- | --- |
| `slip`, `leonard`, `offer` | From visitors, Klein's notebook and the Seer source | none |
| `medium`, `dowse1`, `route` | From Leonard, the pendulum draw and Spirit Vision results | kjw12 |
| `floor3` | The aura reading beyond counts | kjw12 |

Leak asserts at every act: Klein's notes hold no seat-side POV text, no old-world cause, no diary text; Dunn, Rozanne, Leonard, Neil, Orianna, Melissa and Benson hold no `kj3u` text.

## Verification (one line per check)

| Check | Result | Gap |
| --- | --- | --- |
| Text-length pre-scan | 38 offenders over 200 trimmed in two passes; final clean on the `.py` and built JSON | |
| Presence preflight, prefix `kj3u.` | 0 blockers after the `klee` relocation | static check |
| Native route, headless Chrome, B10 bundle, one run | Passed: 16 intents, 0 page errors, 334.2 s, 3 boots and 1 import, every per-act assert (money, clock, location, pool, seats, session closed, rounds 5, leak) | no 14/21 px captures |
| Persisted | literal Export/Import then reload: closed session and seats, carriage place, money 791, pool 2/1, clock 12479, kjw9, kjw10, kjw11 facts, rounds 5 | |
| Rules check | `npm run check:rules` before commit | |

Not run: full `npm test`, a build, 14/21 px captures, human play-through, civil clock.

## Timing and corrections

- Authoring about 60 minutes; proof one run, 334.2 s.
- Corrections (2): 38 over-length strings; Leonard HELD_BY_VISIT in preflight fixed by a `klee` relocation. The third visit's departure id was first a non-act id (`search`) and was corrected to `floor3` before the run.

## Next

kjw12 from ch43 P085 on the third-floor landing: clock 12479, money 791 (a ceiling), pool 2/1, session closed, position the carriage place, Leonard with Klein (his visit ends at `floor3`; kjw12 places him), revolver rounds 5. Needs its own brief.
