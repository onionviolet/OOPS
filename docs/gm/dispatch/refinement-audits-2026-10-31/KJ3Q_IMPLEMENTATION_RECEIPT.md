# KJ3Q implementation receipt: the second gathering (kjw7)

2026-11-03. Window kjw7 of the KJ3 sweep. **Agent-verified, not human-reviewed (AD43).** Content and pack data only: no `src/`, `dist/` or test edits. Not installed, no personal save touched. Proven on the B10 bundle `private/proof-bundles/b10-bundle-45c086a7/` (bundle.js sha256 `45c086a712262768fffb6da96132d1998afe5b64daa2bfbd04eabcd61d6ee979`, B10 fix included; the run used a scratch copy with its own `lotm-cast/cast.json`). Pack sha256 `3e807707…`, revision `cast-reviewed-kj3q-c6d4518a3955000a` (carries KJ3F-KJ3Q). Private files: `docs/research/novels/lord-of-mysteries/private/kj3q-ch33-2026-11-03/`. Seed: the KJ3P completed checkpoint (sha256 `17ddd3ed…`). Predecessor: [KJ3P receipt](KJ3P_IMPLEMENTATION_RECEIPT.md).

## Scope and source

English v1 ch33 P051 - ch35 P083 (official edition). Nineteen acts in four scenes (`noon`, `ritual`, `club1`, `club2`), nothing folded; the brief's nineteen intents became acts one to one. Next boundary: ch35 P084 (Justice's answer to the news). The window ends with the second remote session **live**: kjw8 starts with the seats connected.

| Brief intent | Act | Keys set (`book.lotm.kj3q.`) |
| --- | --- | --- |
| 1 Wake, the watch | `wake` | `wake.noon` + pool recover |
| 2 Body check | `body` | `body.restored` |
| 3 Tea and bread | `tea` | `meal.noon` |
| 4 Reading until 2:57 | `reading` | `study.afternoon` |
| 5 Curtains, lock, room check | `room` | `room.checked` |
| 6 The ritual without bread | `ritual` | `ritual.nobread`, `murmurs.resisted` |
| 7 Into the fog, the link | `link` | `link.formed`; world `household.kj3q.meeting.active` true |
| 8 The two arrive | `arrive` | `club.arrived` |
| 9 Spirit Vision on the club | `aura` | `club.aura.read` |
| 10 The blood | `blood` | `blood.received`; world `trade.blood.delivered` true |
| 11 The formula | `formula` | `formula.heard`; world `trade.formula.delivered` true |
| 12 The hint | `hint` | `hint.given` |
| 13 The request | `request` | `diary.requested` |
| 14 A diary, for now | `cryptic` | `diary.cryptic.talk` |
| 15 The imprint test | `imprint` | `imprint.works`; fact `imprint.received` on the first original |
| 16 The terms | `terms` | `diary.terms` |
| 17 A Spectator is a bystander | `bystander` | `acting.plan` |
| 18 Ludwell | `ludwell` | `ludwell.heard` |
| 19 The notebook news | `notebook` | `antigonus.evernight.heard`, `nighthawks.reason.inferred` |

kjw8's required keys are all present with the exact names the brief pinned. Intents per chapter: ch33 (P051-P075) 7 acts, ch34 (P016-P069) 6, ch35 (P001-P083) 6. Level: deep. The reading act is the only long fill (129 minutes, from the 2:57 anchor).

## Open items settled

| # | Coordinator default | Built | Result |
| --- | --- | --- | --- |
| Q1 | Accept a cut with a live session | yes; the last act `notebook` leaves the session active | **proof point:** after a literal Export/Import and again after a reload of the saved checkpoint, `second_gathering` is active, `ready` true, all three seats connected (labels The Fool, Justice, The Hanged Man), the Seer source and pool, facts, formula flag and clock unchanged |
| Q3 | Second `remoteSessions` entry anchored at 2 Daffodil Street | `second_gathering` copied from `first_gathering` with anchor `lotm.place.cast-cbdaed37cd97109c0a65`, `activeFact` `household.kj3q.meeting.active`, same hall, seats and alias facts | accepted by the pack validator and the runtime; **no B11 needed**. `first_gathering` untouched |
| Q4 | Three seat people moved from closed to the hall | one act (`link`) carries three `relocate` effects (host, first, second) | accepted; no split needed. The seats sit at `closed` until `link` and at the hall from `link` on (asserted) |
| Q5 | Spirituality recover on the wake act | `wake` carries the literal `beSeerCogitateEffects()` | pool reserve/strain by act: wake 3/0, body 2/1, room 1/2, aura 0/3, then unchanged to the end (0/3). Kept as built; strain 3 of 6 at the window end |
| Q6 | Benson, Melissa per the brief default | never moved and never on stage; their kj3q keys asserted empty | |
| Q9 | B9 risk on the 129-minute act | `reading` accepted | |
| Q10 | Eyes and switch state at the end | carried unstated: no eyes-normal fact, no switch state | |
| Q13 | Fact on an original | `imprint.received` on `lotm.arc.original.first` | accepted |
| Q7, Q8, Q12 | POV scenes unbuilt; no replacement items; the sound unexplained | followed (one note on the sound in `wake`) | |

Reader-row script (`scripts/lead_run/check_reader_rows.mjs`) run once before use on `a1b_out.json`: 1 hard failure (row a1b.13, outside this window), 4 soft. Nothing used from the failing row.

## GATED beats (fallbacks)

| Gate | Beat | Fallback | Replace with |
| --- | --- | --- | --- |
| B3 (Spirit Vision) | `body` (ch33 P058-P059), `room` (P063-P064), `aura` (ch34 P023) | fixed-outcome acts that spend `beSeerUse()` (the kjw6 `switch` precedent); no switch state, no condition; the body-restored outcome is a fact | a registered on/off condition and exhaustion recovery |
| Illusory items (R4/U2) | `imprint` (ch35 P027) | the parchment and pen are a note, not objects | conjured-item display |
| Aura reading of a remote seat (R3/U1) | `aura` | notes only | an aura-read verb |
| B2 | none in the window | the club sees only fog-shrouded figures | |

## Money

No price, fee or coin is stated. Native money 802 (a ceiling) unchanged at every act (asserted); inventories unchanged (asserted). Tea, bread and butter are a note only.

## Actor per verb (standing check)

| Row | Who performs | Owner for the BE seat |
| --- | --- | --- |
| Wake, check, tea, read | the lead as player | authored acts and notes |
| Spirit Vision on and off | the lead as player | **B3 unbuilt**; fixed-outcome acts with `beSeerUse()` |
| Recover the pool on waking | the lead | place-act `energy recover` (`beSeerCogitateEffects`) |
| The no-bread ritual | the lead as player | authored place act; the rite engine is unwired |
| Summon the two | the lead as player; the two arrive as seat people | pack remote session plus three relocations (proven natively here) |
| Speak in the hall | someone on screen: Justice and the Hanged Man (controlled by their originals); the lead as player | remote acts with `targetId` |
| Deliver blood and formula | the Hanged Man and Justice, on screen | world facts `trade.blood.delivered`, `trade.formula.delivered` (flip exactly at `blood` and `formula`, asserted) |
| Hint, request, terms, plan to act | the lead as player | facts and notes |
| Imprint through the fog | the lead guides; Justice writes | fact on the original; items as notes |

## What each act withholds and who reads it later

| Act | Withheld | Later reader |
| --- | --- | --- |
| `wake` to `room` | Everything from the siblings (not on stage) | none |
| `link`, `arrive` | From both seats, everything about Klein; the off-screen openings are unbuilt | none |
| `aura` | From both, that he reads them and doubts the Hanged Man's depth | none |
| `blood` | The vault and amount are the other side's narration, not Klein's | none |
| `hint` | From both, the source of the hint (diary pages the Nighthawks hold) and his incomprehension | the diary request |
| `cryptic` | From both, the Chinese script and the tattoo joke | none |
| `imprint` | That Klein had never tried it | none |
| `bystander` | From both, his plan to act as a Seer | kjw8 (`acting.plan`) |
| `notebook` | From both, the Nighthawk link; from Klein, the Hanged Man's source | ch36 P037 |

Leak asserts (every act): originals and Neil, Dunn, Rozanne, Benson and Melissa hold no `kj3q` keys (the seat people hold no knowledge store); Klein's `kj3q` notes contain no Audrey, Alger, vault, basement, dance-teacher, Backlund or mansion text.

## Verification (one line per check)

| Check | Result | Gap |
| --- | --- | --- |
| Text-length pre-scan (`prescan.mjs`) on the `.py`, built `reviewed-episode.json` and `cast.json` | 16 offenders over 200 listed at once, trimmed in two passes (three assertion misses); final clean on all three | |
| Presence preflight, prefix `kj3q.` | 0 blockers | static check only |
| Native route, headless Chrome, B10 bundle (T4 runner plus hand asserts) | **Passed on the second run: 19 intents, money 802 unchanged, 0 page errors, 340.8 s.** First run stopped at my own leak regex (the word "guidance" matched "dance"), regex fixed to a word boundary | no 14/21 px captures |
| Session asserts | before `link`: seats at `closed`, session fact not true; from `link` on every act: fact true, seats at the hall, `remoteMeetings` entry `second_gathering` ready with all seats connected | |
| Persisted | literal Export/Import then reload of the saved checkpoint: session active and ready, all kjw8 keys, formula flag, pool 0/3, source, clock 6715, first original at its parked place | |
| Pool numbers | as listed under Q5, logged per act in `browser-result.json` | |
| Rules check | `npm run check:rules` run before commit | |

Not run: full `npm test`, a build, 14/21 px captures, human play-through, civil clock, a display check of the gathering view (the `remoteMeetings` projection was read, not looked at).

## Timing and corrections

- Source and brief read (estimates): about 25 minutes. Authoring: about 45 minutes (19 acts; pre-scan trims in three passes). Proof: two runs, the second 340.8 s.
- Late corrections (3): (1) 16 over-length strings; (2) a pre-scan trim script asserting on a 200-character string and then a 205-character one before it wrote; (3) the leak regex tripped on "guidance". No pack or content defect; no native rerun beyond the second.
- Clock: the two anchors are from the text (2:57 p.m. study end, 6657; ritual one minute before three); every other duration is fill. Final clock 6715 (15:55 on day 5), final position 2 Daffodil Street with the session live.
- Boot/import counts of the green run: 3 boots and 1 import (the third boot is the reload check).
- Notable: walking away from the house is refused while the gathering is live (`src/book_world_lotm_host.js:219`, "End the remote gathering before walking away"); kjw8 must end the session before leaving.

## Next

kjw8 from ch35 P084 with `second_gathering` live (`household.kj3q.meeting.active` true, seats in the hall). The gathering ends at ch36 P034 (Klein severs the link); the closing act should set the active fact false and relocate the three seats back to `lotm.arc.presence.closed`, as the first gathering's `strain` act does, before the ch37 errand. Start money 802 (a ceiling), pool reserve 0 strain 3 (recover on the next sleep).


## Content reconciliation B508: native state versus authored narration

KJ3Q ends inside a live second remote gathering, not at a closed session or completed whole gathering feature. Nineteen acts are preserved one-to-one. Three seat relocations in link plus the active fact were validated; a second session reused existing support and did not require the proposed B11 engine change. This local Q3/B11 hypothesis differs from KJ3S's later actor-enrolment backlog B11. Actual session projection stays active/ready with connected seats across literal import/reload, while the gathering view was not visually checked. Source pool3/0→2/1→1/2→0/3 is metered fixed-outcome use, not functional Spirit Vision switching/exhaustion, aura inspection or recovery at exhaustion. The ritual remains authored, parchment/pen remain notes, imprint is a fact on an original, and trade flags are not inventory transfers. Money802 remains a ceiling; meal prose consumes no supplies here. The second run corrected a guidance/dance regex false positive rather than a game defect; the reader-row hard failure outside the window was excluded, not repaired or dismissed globally. 129-minute study completed on this B10 bundle, not a general clock proof. Known anchors differ from remaining fill minutes. No source build, full suite, font captures or civil-clock test ran in this receipt. The successor must close the session before travel, retaining the distinction between projection data and rendered UI.
