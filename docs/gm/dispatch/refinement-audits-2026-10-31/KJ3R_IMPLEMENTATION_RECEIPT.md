# KJ3R implementation receipt: the end of the second gathering, the errand and the Divination Club (kjw8)

2026-11-03. Window kjw8 of the KJ3 sweep. **Agent-verified, not human-reviewed (AD43).** Content and pack data only: no `src/`, `dist/` or test edits. Not installed, no personal save touched. Proven on the B10 bundle `private/proof-bundles/b10-bundle-45c086a7/` (bundle.js sha256 `45c086a712262768fffb6da96132d1998afe5b64daa2bfbd04eabcd61d6ee979`; scratch copy with its own `lotm-cast/cast.json`). Pack sha256 `13a100c8…`, revision `cast-reviewed-kj3r-3cbce624cd9fe526` (carries KJ3F-KJ3R). Private files: `docs/research/novels/lord-of-mysteries/private/kj3r-ch35-2026-11-03/`. Seed: the KJ3Q completed checkpoint (sha256 `9a59e477…`). Predecessor: [KJ3Q receipt](KJ3Q_IMPLEMENTATION_RECEIPT.md).

## Scope and source

English v1 ch35 P084 - ch38 P011 (official edition). Sixteen acts in four scenes (`tail`, `fog`, `errand`, nothing folded); the brief's sixteen intents became acts one to one. No fallback cut was needed. Next boundary: ch38 P012 (the attendant leads Klein to the divination room). The second gathering is **closed**: kjw9 starts with no live session.

| Brief intent | Act | Keys set (`book.lotm.kj3r.`) |
| --- | --- | --- |
| 1 Justice's turn | `news` | `justice.news` |
| 2 The problem | `problem` | `justice.problem` |
| 3 The exam | `exam` | `exam.proposed` |
| 4 Baboons, the verdict | `baboons` | `exam.accepted.justice` |
| 5 End the Tarot Club | `sever` | `club.ended`; world `household.kj3q.meeting.active` false |
| 6 Alone in the fog | `alone` | `third.star.known`, `summon.held`, `gods.view` |
| 7 Back in the room | `return` | `returned.body`, `fog.differs.spirit` + pool recover |
| 8 Out and past the square | `out` | `walk.out`, `circus.gone` |
| 9 Iron Cross Street | `street` | `street.layout` |
| 10 Mrs. Smyrin's tea | `tea` | `iced.tea`, `wendy.southerner` |
| 11 The gloom | `gloom` | `gloom.seen`, `vision.affects.mood`, `perception.passive` |
| 12 The old flat | `flat` | `flat.searched`, `spirits.as.spirituality` |
| 13 Welch's gates | `gates` | `welch.gate.checked`, `plan.tomorrow` |
| 14 Signboards | `signs` | `bullets.plan`, `club.found` |
| 15 The membership terms | `terms` | `club.terms.heard` |
| 16 The album and the choice | `album` | `album.seen`, `glacis.chosen` |

kjw9's required keys are all present with the exact pinned names. Intents per chapter: ch35 (P084-P087) 1 act, ch36 (P001-P057) 7, ch37 (P001-P076) 7, ch38 (P001-P011) 1. Level: deep. Scenes Klein cannot witness (ch36 P058-P079) are unbuilt (Q7).

## Open items settled

| # | Coordinator default | Built | Result |
| --- | --- | --- | --- |
| Q3 | The return act carries `beSeerCogitateEffects()` | `return` | pool by act: 0/3 through `alone`, **3/0 after `return`**, 2/1 after `gloom`, 1/2 after `flat`, unchanged to the end (1/2). The run asserts each number |
| Q4 | The closing act does all three seat relocations and the fact (option A) | `sever`: world fact false, host, first and second seats to `lotm.arc.presence.closed` | accepted in one act. After it: fact false, seats closed, originals unmoved, `remoteMeetings` empty |
| Q5 | Authored place acts for the lead's movement | `out`, `street`, `tea`, `gloom`, `flat`, `signs` relocate the player; no engine walk | all accepted. The first move act (`out`) was accepted with the session closed; its requires also assert the fact is false. The 61-minute `gates` act was accepted |
| Q1, Q2 | The brief stands as the contract | followed | |
| Q6 | Two metered Spirit Vision uses | `gloom` and `flat` each spend `beSeerUse()` | no switch state, no eyes-normal fact |
| Q8 | Existing bakery and enrolled Wendy | pack place `Sline Bakery`, person `Wendy Sline`; notes use "Mrs. Smyrin" | preflight first reported Wendy `NOT_PLACED` (nothing put her at the bakery); `street` now relocates her there and a visit holds her to `tea` |
| Q9 | Attendant, Glacis, Vincent as text only | notes only; no enrolled person | kjw9 will need Glacis enrolled at the club: **carried open item for the kjw9 brief (ch38 P012 is the first consumer); no backlog row written here** |
| Q10 | World store is authoritative for the trade facts | `blood.delivered` and `formula.delivered` asserted **true** at every act and after import and reload | corrects the kjw7 draft's start-state read of the legacy ledger |
| Q11 | Clothes, revolver, cane as notes | one note; `inventories` asserted unchanged | |
| Q12 | Clock stays afternoon | final clock 6831 (17:51), as built | |

Reader-row check was run for the brief; its one hard failure (a1.12) is outside the built range and its wording was not used. Mechanism proposals M1-M4 stay proposals, none built.

## GATED beats (fallbacks)

| Gate | Beat | Fallback | Replace with |
| --- | --- | --- | --- |
| B3 (Spirit Vision, borrowed mood) | `gloom` (ch37 P034-P044), `flat` (P045-P046) | fixed-outcome acts spending `beSeerUse()`; facts `vision.affects.mood`, `perception.passive`; no switch state | on/off condition and emotion influence |
| Always-on perception | `gloom` | a note and fact `perception.passive` | a passive sense |
| B2 | none | no consumer in this window | |

## Money (pence; 240 per pound, 20 soli per pound, 12 pence per soli)

Native money 802 (a ceiling) unchanged at every act (asserted). Quoted anchors, none paid: club membership 1,200 the first year (five pounds, ch37 P072) and 240 each later year; Hanass Vincent 48 (four soli, ch38 P004); Glacis 2 (ch38 P007). The trial tea is free. Perks, cost-price meals and the club's cut are unstated. Klein cannot join on 802 and says so to nobody.

## Actor per verb (standing check)

| Row | Who performs | Owner for the BE seat |
| --- | --- | --- |
| Listen and speak in the hall | Justice and the Hanged Man on screen (controlled by their originals); the lead as player | remote acts with `targetId` (proven in KJ3Q) |
| End the gathering | the lead as player | authored act: fact false and three relocations (first proven with the pack's `strain`, now with a second session) |
| Suggest a policy | the lead as player | authored act and notes (M4) |
| Return to the body, recover | the lead | place-act `energy recover` (`beSeerCogitateEffects`); no BE command |
| Walk, greet, take the trial cup | the lead as player; Wendy on screen at the bakery | authored move acts with fill minutes |
| Spirit Vision on the crowd and the old flat | the lead as player | **B3 unbuilt**; fixed-outcome acts with `beSeerUse()` |
| Ask club terms, choose a reader | the lead as player; the attendant is a text role | authored acts and notes |

## What each act withholds and who reads it later

| Act | Withheld | Later reader |
| --- | --- | --- |
| `news` to `baboons` | From both seats, that the exam idea comes from a former world and that Klein is pleased with himself; the Hanged Man's bad-superior inference | none |
| `sever` | From both, the Benson plan and why he ends early | thread `benson.civil.service` |
| `alone` | From everyone, the third star and his view of the gods and the church | thread `third.star.held` |
| `return` to `gates` | From Wendy, the old-world comparison; from everyone, the step-counter joke and the old-flat search | none |
| `terms`, `album` | From the attendant, his finances; that he is acting as a Seer | kjw9 (the Glacis divination) |

Leak asserts at every act: Klein's `kj3r` notes contain no Audrey, Alger, vault, basement, dance, Backlund, mansion, etiquette, Susie, Seafarer or parchment text; the two originals, Wendy, Neil, Dunn, Rozanne, Leonard, Benson and Melissa hold no `kj3r` keys.

## Verification (one line per check)

| Check | Result | Gap |
| --- | --- | --- |
| Text-length pre-scan (`prescan.mjs`) on the `.py` | 20 offenders over 200, trimmed in two passes (four assertion misses in my trim script); final clean | |
| Pre-scan on the built `reviewed-episode.json` | clean | |
| Presence preflight, prefix `kj3r.` | first run: 1 blocker (Wendy `NOT_PLACED`); fixed with a relocation and a visit; final 0 blockers, Wendy `PLACED_BY_ARRIVAL_ACT` | static check only |
| Native route, headless Chrome, B10 bundle (T4 runner plus hand asserts) | **Passed on the first run: 16 intents, money 802 unchanged, 0 page errors, 294.1 s** | no 14/21 px captures |
| Session asserts | before `sever`: fact true, `second_gathering` ready, seats in the hall; after: fact false, seats at closed, originals unmoved, no session in `remoteMeetings` | the closed-session display was read as data, not looked at |
| Clock and pool | clock equals 6715 plus the cumulative minutes after every act; final 6831; pool as listed under Q3 | |
| Persisted | literal Export/Import then reload: session closed, seats closed, position (Divination Club), money, pool 1/2, clock, kjw7 and kjw8 facts, trade facts true | |
| Rules check | `npm run check:rules` run before commit | |

Not run: full `npm test`, a build, 14/21 px captures, human play-through, civil clock.

## Timing and corrections

- Source and brief read (estimates): about 25 minutes. Authoring: about 45 minutes (16 acts; trims in two passes). Proof: one run, 294.1 s.
- Late corrections (2): (1) 20 over-length strings; (2) Wendy `NOT_PLACED` caught by the preflight. No native rerun was needed.
- Clock: the one-hour walk (ch37 P055) is the single text anchor; every other duration is fill. Final clock 6831 (17:51 on day 5), the Divination Club reception.
- Boot/import counts of the green run: 3 boots and 1 import (the third boot is the reload check).

## Next

kjw9 from ch38 P012 at the Divination Club reception: session closed, money 802 (a ceiling), pool reserve 1 strain 2, clock 6831 (about 17:51), Glacis chosen (carried open item: Glacis must be enrolled at the club for the divination), the afternoon bullets and Leonard ahead.


## Content reconciliation B508: native state versus authored narration

KJ3R closes the live session with its active fact false and all three seats parked, then exercises the first permitted move and durable closed-session state. That proves bounded closure on B10; remoteMeetings data was read, not visually reviewed. The introduction says four scenes but names only tail/fog/errand, so the scene count is unconfirmed here rather than silently inventing a fourth; sixteen acts are the specified content count. Return recovery and two later metered uses reach3/0→2/1→1/2 without implementing on/off vision, passive perception or borrowed emotion. Wendy's initial NOT_PLACED defect was fixed by actual arrival/visit placement. Attendant/Glacis/Vincent remained text roles, with Glacis enrolment carried to the next brief and no backlog row written in R. World trade facts, not the stale legacy ledger, remain the authoritative flags in this historical journey. Club fees and reader quotations are not payments: money802 unchanged, membership1200 first year/240 later, quoted48 and2pence distinct. Authored movement is not the engine's free walk route. The one-hour text anchor is separate from other fill durations and no civil-clock verification follows. M1–M4 remain unbuilt proposals, and no native rerun/build/full suite/font matrix is implied by the first successful294.1-second journey and persistence checks.
