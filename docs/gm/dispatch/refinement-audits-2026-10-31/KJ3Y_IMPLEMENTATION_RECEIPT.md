# KJ3Y implementation receipt: the Saturday table, Old Neil's ritual lesson and the found wallet (kjw15)

2026-11-03. Window kjw15 of the KJ3 sweep. **Agent-verified, not human-reviewed (AD43).** Content and pack data only: no `src/`, `dist/` or test edits. Not installed, no personal save touched. Proven on the B10 bundle `private/proof-bundles/b10-bundle-45c086a7/` (bundle.js sha256 `45c086a712262768fffb6da96132d1998afe5b64daa2bfbd04eabcd61d6ee979`, matches; scratch copy with its own `lotm-cast/cast.json`). Pack sha256 `49a61fd5…`, revision `cast-reviewed-kj3y-800dc49657a03213` (carries KJ3F-KJ3Y). Private files: `docs/research/novels/lord-of-mysteries/private/kj3y-ch50-2026-11-03/`. Seed: the KJ3X completed checkpoint, sha256 `f352c8e5…` (start state re-verified by script before building: clock 14141, money 787, pool reserve 0 strain 3, Moretti flat, sessions closed, `share.still.pending` true, `share.collected` absent, 112 kj3x keys, pack 917 acts). Predecessor: [KJ3X receipt](KJ3X_IMPLEMENTATION_RECEIPT.md). The brief was re-read end to end first.

## Scope and source

English v1 ch50 P029 - ch52 P035 (official edition). Twenty-five acts in three scenes, one per brief intent, nothing folded; no fallback cut. No Tarot gathering, remote session or seat opens in the range: the two sessions are guards only. Next boundary: ch52 P036 (the owner's carriage). Final clock 15178 (12:58, engine day 10); money 787.

| Scene | Acts (`book.lotm.kj3y.`) |
| --- | --- |
| Saturday at the table | `dress`, `selena`, `shaud`, `apology`, `calls` |
| Sunday morning | `sunday`, `royale`, `armory` |
| Old Neil's house and the street | `bungalow`, `iou`, `doubt`, `unknown`, `orthodox`, `candles`, `three`, `altar`, `circle`, `mark`, `chant`, `burn`, `settled`, `class`, `servants`, `wallet`, `wait` |

Minutes (fill, labelled; sum 1,037): 2, 2, 2, 2, 6, 695, 40, 40, 5, 5, 3, 5, 3, 8, 4, 8, 15, 5, 8, 6, 2, 113, 15, 38, 5. 110 distinct player-actor fact keys under the prefix. kjw16's required names (`iou.burnt`, `iou.thirty.drawn`, `wallet.found`, `wallet.dove.logo`, `wait.for.owner.said`, `neil.morals.understood`, `settled.how.unknown`, thread `luck.ritual.risk`) are present.

## Constraint-store select (printed first, read for the days the night crosses)

`clock 14141-15200 (engine days 9-10): beats=84, max beat day 7, beats on day 8 or later 0, anchors on day 8 or later 0, schedule rows 77, rows until day 8 or later 0.` The pack's beats and anchors all end before engine day 8, so none lies on day 9 or 10; no unsettled beat.

## Open items settled (coordinator defaults)

| # | Default | Built | Result |
| --- | --- | --- | --- |
| Q1 | cut at ch52 P035 | built to P035 | no fallback; the rest to ch54 (about 4,540 words) is kjw16 |
| Q3 | 695-minute night, split if refused | `sunday` as one act, clock 14155 to 14850 across 14400 | **accepted, no split**, no refusal message |
| Q4 | money holds 787 unless coins change hands on screen | no credit, no debit | 787 asserted at every act; the Neil debt, the wages and the wallet are facts and knowledge, no resource moves; `share.collected` never set, `kj3w.share.still.pending` stays true |
| Q5 | no `beSeerUse()`, no `cogitate` | none | pool reserve 0 strain 3 asserted after every act; Neil's glabella tap is a fact on Klein's notes only |
| Q6 | Neil's house by preflight | **`lotm.place.cast-0192f5dd…` "Neil's house"** | used for `iou` through `class`; the other candidate "Old Neil's home" `cast-a4e7…` was not used. Neil moved to the armory anteroom in `armory`, to the house in `bungalow`, back to the company in `servants` |
| Q7 | ritual as knowledge lines, no mechanic, no causal link | built | Klein performs nothing; `settled` and `wait` do not link the chant to the wallet |
| Q8 | no exemptions in the leak regex | followed | regex covers vault (whole word), earth, keyboard, gathering, previous life, ouija, fool, tarot, hanged man, gray fog, transmigrat; morning-gown gloss paraphrased as "formal dress for Mass"; "down-to-earth" avoided; old-world clauses (ch50 P047, ch51 P037, ch52 P002, ch52 P028) left no text |
| Q9 | luck-ritual worry: key and thread only | `unknown.power.worry` (key) and thread `luck.ritual.risk` | the note says only that Klein was afraid and what he feared "is not recorded here"; ch51 P021-P023 leave no text |
| Q14 | siblings hold table talk only | built | Benson and Melissa hold rows from `dress` to `calls` only (asserted: keys only from those acts, no Neil, ritual, Royale, wallet, club or Seer text) |

## Session and seat guards (asserted every act)

`simulation.sessions` empty; `household.excursion.meeting.active` and `household.kj3q.meeting.active` falsy; the three presence people at `lotm.arc.presence.closed`; the originals at their offscreen places; the three `household.excursion.alias.*` facts equal to the seed (not printed); the schedule fact "Monday, 3 p.m.; participants alone" unchanged; no alias used in any note.

## Places and presence

Klein: flat through `calls`, carriage place after `sunday`, company in `royale`, carriage place after `armory`, Neil's house from `bungalow` through `class`, carriage place after `servants`, company from `wallet`. Relocations: Benson and Melissa to the flat in `dress` (visit to `calls`); Neil to the company in `royale` (visit to `armory`), to the armory anteroom in `armory` (visit to `bungalow`), to the house in `bungalow` (visit to `servants`), to the company in `servants` (visit to `wait`). Royale, Bredt, Rozanne, Mrs. Shaud, Selena and Mrs. Smyrin are text roles; Dunn, Leonard, Rozanne unplaced and Orianna at the accounts office throughout. Preflight 0 blockers; its one remaining AMBIGUOUS line is Benson at `dress` before his arrival visit (accepted by the run).

## Money (pence)

Nothing moves. Not debited: the carriage rides (unstated), the shopping order for Mrs. Shaud's call (not bought on screen), the dress. Knowledge only: Neil's thirty-pound IOU (7,200), Neil's twelve-pound week (2,880), chef and maid wages (144-180 a week), the wallet's over 300 pounds (72,000-84,000).

## Actor per verb (standing check)

| Row | Who performs | Owner for the BE seat |
| --- | --- | --- |
| Propose a dress, send an apology, order the shopping | the lead as player; siblings buy | facts and notes |
| The IOU ritual | Old Neil performs; the lead watches | knowledge lines, no ability, no item (watch-only; R5/U3 not moved) |
| Spirit Vision tap at the IOU | Old Neil | a fact; the lead's pool unchanged |
| Find the wallet | Old Neil | facts, no money moves |

## Gated beats (fallbacks)

| Gate | Beat | Fallback |
| --- | --- | --- |
| R5 / U3 rite rows | `iou` to `burn` | knowledge lines, no causal link |
| B3 Spirit Vision | `mark` | a fact on Neil's tap |
| Found money (no row), household savings and calls (no row) | `wallet`, `dress`, `calls` | facts and knowledge lines |
| B11 Royale and Bredt | `royale`, `armory` | text roles |
| B9 long night | `sunday` | none needed |

## What each act withholds and who reads it later

| Act | Withheld | Later reader |
| --- | --- | --- |
| `unknown` | what Klein fears about his luck ritual and abilities: key and thread only | kjw16+ |
| `apology`, `three`, `class`, `wallet` | old-world clauses: no text | none |
| `iou`, `settled` | how a debt is settled by chant: Neil does not know either | kjw16 (ch52 P047-P055) |
| `wait` | Neil's remark that the find is not divination is his word, not a mechanism | kjw16 |
| `sunday` | the night: nothing shown, no Cogitation | none |

Leak asserts at every act: Klein's notes hold no seat-side, old-world, Tarot, gathering or diary text; Dunn, Leonard, Rozanne, Orianna and Neil hold no `kj3y` knowledge (Neil gets no rows at all).

## Verification (one line per check)

| Check | Result | Gap |
| --- | --- | --- |
| Pre-scan on the `.py` and the built JSON | 24 offenders over 200 trimmed in two passes; final clean on both | |
| Presence preflight, prefix `kj3y.` | 0 blockers after the Neil visits; see Places | static check |
| Native route, headless Chrome, B10 bundle, **two parts** | **Part 1: all 25 acts passed with every per-act assert (money, clock, location, pool, seats, session closed, alias facts, rounds, holder, inventories, leak), 0 page errors, 1,613.6 s wall (settle up to 388 s on a loaded machine); the final post-import boot then timed out (Session.open waitForFunction, 60 s) with no game error. Part 2: `RESUME=wait` from `ckpt-wait.json`, 0 acts and the persistence checks only, passed.** | the chain is two runs joined by a saved checkpoint; the persistence run was cheap and uneventful, so I attribute the timeout to machine load, not to the game |
| Persisted | literal Export/Import then reload at the end: closed session and seats, company place, money 787, pool 0/3, clock 15178, kjw15 facts and the kjw9-kjw14 facts | |
| Rules check | `npm run check:rules` before commit | |

Not run: full `npm test`, a build, 14/21 px captures, human play-through, civil clock.

## B9 datapoint

`sunday` (695 minutes, clock 14155 to 14850, crossing engine day 9 to 10 at 14400) and `class` (113) were accepted as single acts with no refusal. Row text: "B9: kjw15 ran a 695-minute act across engine day 9 to 10 with no refusal (0 beats on day 8 or later)."

## Proposed backlog row texts (not filed)

- M1 R5/U3: Old Neil's IOU ritual (ch50 P082 - ch51 P084) as an earlier watch-only consumer; knowledge lines only, no causal link to the wallet.
- M2 B3: ch51 P063 is a tap by another Beyonder; the lead's pool unchanged.
- M3 B9: see above. M4 B11: Royale Reideen and Bredt speak in ch50; Neil follows the lead through his house.
- M5 found-money and honest return (no row); M6 household savings and calls (no row): facts and knowledge only.

## Timing and corrections

- Authoring about 75 minutes; proof one 27-minute run plus a short persistence run.
- Corrections (3): 24 over-length strings; Neil needed visits for the armory and wait acts after the preflight showed AMBIGUOUS; the runner's first-next-id check needed an optional chain for a zero-act RESUME. The first run's browser also lost a boot at the end to a 60 s timeout.

## Next

kjw16 (final window) from ch52 P036: Klein and Old Neil on Zouteland Street by the dropped wallet, Sunday about 12:58 (clock 15178, engine day 10), money 787 (a ceiling) with the commission share still pending and unsigned, pool 0/3, sessions closed, the thirty-pound IOU burnt but not shown settled, Klein at the company place with Neil. The rest of the sweep range, about 4,540 words to ch54, is the last window. Needs its own brief; long runs need RESUME batches under about 25 minutes of browser life.


## Content reconciliation B509: actual consumers and remaining factual gaps

Twenty-five acts include1037 labelled fill minutes and a695-minute night across day9→10, with no selected beats/anchors on those days. That passes this B10 long-act case, not a general B9/civil-clock repair. The lead watches another actor's ritual and Spirit Vision tap; no player ability is acquired, no energy is spent/recovered and pool0/3 stays unchanged even through the night. Burnt IOU, claimed settlement and found wallet are distinct facts: no debt settlement, wallet custody, native money transfer or causal link from ritual to wallet is established. The source's “over300 pounds” and the receipt's72000–84000pence table must not be treated as a source-proven upper bound or exact counted amount without qualification. Share pending and money787 remain unchanged. Neil's view of the find is testimony, not validated mechanism. Household calls, dress/savings and offstage roles likewise remain knowledge. All25acts passed in the first run, but final post-import boot timed out; a zero-act saved-checkpoint resume supplied persistence proof. Machine load is the author's attribution, not a reproduced diagnosis, and the two parts cannot be reported as one uninterrupted complete run. Optional-chain runner repair and presence visits are separate from gameplay mechanisms. The1613.6-second act run plus resumed import/reload prove a bounded historical slice, without new build/full suite/fonts/civil clock. M1–M6 are explicitly proposed and not filed. Its final street prose and company-place native checkpoint remain different representations until a place consumer establishes the intended mapping.
