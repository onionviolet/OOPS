# KJ3V implementation receipt: the rescue, the night and the dawn visit to the apartment (kjw12)

2026-11-03. Window kjw12 of the KJ3 sweep. **Agent-verified, not human-reviewed (AD43).** Content and pack data only: no `src/`, `dist/` or test edits. Not installed, no personal save touched. Proven on the B10 bundle `private/proof-bundles/b10-bundle-45c086a7/` (bundle.js sha256 `45c086a712262768fffb6da96132d1998afe5b64daa2bfbd04eabcd61d6ee979`, matches; scratch copy with its own `lotm-cast/cast.json`). Pack sha256 `ed7c90b6…`, revision `cast-reviewed-kj3v-0b920e2b8146364c` (carries KJ3F-KJ3V). Private files: `docs/research/novels/lord-of-mysteries/private/kj3v-ch43-2026-11-03/`. Seed: the KJ3U completed checkpoint. Predecessor: [KJ3U receipt](KJ3U_IMPLEMENTATION_RECEIPT.md).

## Scope and source

English v1 ch43 P085 - ch45 P080 (official edition). Twenty-five acts in three scenes, one per brief intent, nothing folded; no fallback cut was needed. Next boundary: ch46 P001 (Klein vomiting, Frye's flask). Final clock 13392; money 787.

| Scene | Acts (`book.lotm.kj3v.`) |
| --- | --- |
| Rescue | `poem`, `lock`, `stairwell`, `shot`, `room`, `errand`, `wait`, `farewell`, `commission`, `cover` |
| Evening, dream, dawn | `walk`, `dinner`, `evening`, `sleep`, `dream`, `recall`, `dress`, `ride`, `office`, `report`, `ride2` |
| The apartment door | `climb`, `sight`, `breach`, `chair` |

Minutes (fill, labelled; sum 913): 4, 3, 2, 3, 8, 12, 42, 8, 4, 3, 40, 90, 142, 430, 5, 15, 30, 30, 4, 6, 20, 6, 3, 1, 2. 78 distinct fact keys; kjw13's required names (`corpse.found`, `klein.vomited`, `notebook.reported`, `deja.vu.recalled`, `sight.tap`, `frye.reading`, `seal.vanished`) are present and asserted.

## Constraint-store select (printed before the first act)

`beats=84, max beat day 7, beats on day 8 or later 0, anchors on day 8 or later 0, schedule rows 77, rows until day 8 or later 0.` No unsettled beat in clock 12479-13400.

## Open items settled (coordinator defaults)

| # | Default | Built | Result |
| --- | --- | --- | --- |
| Q1-Q3, Q7-Q8 | as the brief says | done | fills as listed; no place minted; text roles (Klee, Vickroy, Elliott, police, Frye, Kenley) never placed |
| Q4 | no morning recover, one metered Spirit Vision tap | `sight` carries the literal `beSeerUse()`; no `cogitate` effect in `dress` | pool **2/1 asserted through `climb`, 1/2 from `sight` to the end** |
| Q5 | debit the 4-pence dawn carriage if shown paid | native debit in `ride` | text shows two pennies and four halfpence paid on screen. **Money 791 -> 787**, asserted at every act (791 through `dress`). The coin split is a note |
| Q6 | follow the text on rounds; do not silently hold 5 | **rounds held at 5 and said so** | `household.opening.revolver.rounds` is an authored world fact set by early windows; no engine ammunition count exists (B8 unbuilt). The text fires one round in `shot`; a note says one shot was fired and the fact is not an ammunition count. Holder: the checkpoint says `desk`, the text has the revolver under the pillow in `dress`; both are in notes and the fact is unmoved (asserted equal to the checkpoint value) |
| Q9 | try `sleep` at 430 and `evening` at 142 first | built as written | **neither refused** (B9 datapoint below) |

## Places and presence

Klein: carriage place through `cover`; Moretti flat `cast-266d…` from `walk` through `dress`; carriage place at `ride`'s end; company in `office` and `report`; carriage place from `ride2` on. Relocations: Leonard placed at the carriage place in `poem` with a visit to `walk` (the preflight showed him relocated but unheld), then to "Whereabouts unplaced" at `walk`; Melissa and Benson to the flat at `dinner`, visit to `recall`; Dunn and Leonard to the company at `office`, visit to `ride2`; Old Neil to the company at `report`, visit to `ride2`; Dunn, Neil and Leonard to the carriage place at `ride2` (three non-player relocations, accepted), visit to `chair`. Preflight 0 blockers; its one remaining AMBIGUOUS line is Leonard at `poem` before the arrival visit, and the native run accepted the act. No place minted for the block, rooms or the apartment (notes only). Frye, Kenley, Klee, the Vickroys, Elliott, the policemen and the kidnappers are text roles.

## Money (pence)

| Line | Pence | Locator | Native |
| --- | --- | --- | --- |
| Public carriage at dawn | -4 | ch45 P017-P018 | yes (`ride`) |
| Gas meter penny, beef and olives, hired carriage, commission share (about 2,400, pending) | not debited | ch44 P069-P084 | none; payer or amount unstated, share unpaid |

## Actor per verb (standing check)

| Row | Who performs | Owner for the BE seat |
| --- | --- | --- |
| Resist the poem, recall, dream | the lead as player | authored acts, facts and notes; no ability object |
| Draw, aim, fire, holster | the lead as player | facts and notes (B8 unbuilt); first fired shot of the lead, fixed outcome |
| Punch locks, recite, tie, bandage | Leonard on screen | facts and notes |
| Take the public carriage | the lead as player | place act with a native debit (kjw9 `carriage` shape) |
| Spirit Vision at the door | the lead as player; Neil and Frye give their own readings on screen | `beSeerUse()` place-act effect, metered once |

## Gated beats (fallbacks)

| Gate | Beat | Fallback |
| --- | --- | --- |
| B8 firearms | `lock`, `stairwell`, `shot`, `errand`, `dress` | facts and notes, no hit roll, rounds fact unchanged |
| B3 / R3 Spirit Vision | `sight`, `chair` | one metered use, no switch or exhaustion |
| R2 halfpence | `ride` | whole 4 pence, coin split in a note |
| B9 overnight carry | `evening`, `sleep` | none needed |
| Commission and fund (proposed B13) | `commission` | facts and notes, nothing credited |
| Leonard's song, Dunn's revolver, the seal | `poem`, `climb`, `breach` | notes only, no gloss |

## What each act withholds and who reads it later

| Act | Withheld | Later reader |
| --- | --- | --- |
| `shot` | Klein's aim thought, from Leonard | none |
| `commission` | the money feeling, from Leonard | none |
| `dream`, `recall` | the page details (ch44 P090-P093) are not recorded; the focus has no stated cause | kjw13 |
| `ride2` | whether Klein described the dream page (unstated) | none |
| `breach`, `chair` | why the seal vanished and what it was | kjw13 (ch46) |

Leak asserts at every act: Klein's notes hold no seat-side POV, old-world, diary or ch46 text; Dunn, Neil, Rozanne, Leonard, Melissa, Benson and Orianna hold no `kj3v` text.

## Verification (one line per check)

| Check | Result | Gap |
| --- | --- | --- |
| Pre-scan on the `.py` and the built JSON | About 20 strings over 200 trimmed in four passes, including one long window string; final clean on both | |
| Presence preflight, prefix `kj3v.` | 0 blockers; see Places | static check |
| Native route, headless Chrome, B10 bundle, one run | Passed: 25 intents, money 791 -> 787, 0 page errors, 829.2 s, 3 boots and 1 import; every per-act assert (money, clock, location, pool, seats, session closed, rounds 5, holder, inventories, leak) | no RESUME needed; no 14/21 px captures |
| Persisted | literal Export/Import then reload: closed session and seats, carriage place, money 787, pool 1/2, clock 13392, all kjw12 facts and the kjw9-kjw11 facts | |
| Rules check | `npm run check:rules` before commit | |

Not run: full `npm test`, a build, 14/21 px captures, human play-through, civil clock. The first run attempt stopped on my own leak regex (`vault` matched the report text "vaults the handrail"); I made it a whole-word match and reran.

## B9 datapoint

`evening` (142 minutes, clock 12698 to 12840) and `sleep` (430, to 13270, crossing from engine day 8 into day 9 at 12960) were both accepted without a split or a refusal message. Row text for the board: "B9: kjw12 ran 142 and 430 minute acts across clock 12698-13270 (day index 8 to 9) with no refusal (constraint select: 0 beats on day 8 or later)."

## Proposed backlog row texts (not filed)

- M1 B8: fourth consumer ch44 P015-P030 (draw, cylinder, first fired shot, left shoulder) and the permit at P053; rounds fact is authored, not an ammunition count.
- M2 R2: first consumer moves to ch45 P017 (two pennies and four halfpence for four pence).
- M3 B11: Frye speaks from ch45 P068 through ch46; pack role `cast-b914936b…`; route B kept.
- M4 B13: commission fund, second consumer ch44 P069-P079; signing at ch47.

## Timing and corrections

- Authoring about 55 minutes; proof one run of 829.2 s after one assertion-regex fix.
- Corrections (3): over-length strings; Leonard AMBIGUOUS at the carriage place fixed with a `poem` relocation plus visit; leak regex made whole-word.

## Next

kjw13 from ch46 P001 at the apartment doorway about 07:12 Saturday (clock 13392): Klein, Dunn, Neil, Leonard and Frye present at the carriage place; the corpse found, Klein has vomited; money 787 (a ceiling), pool 1/2, the session closed, rounds fact 5. Needs its own brief; ch46 covers the flask, the recognised room, the cupboard, the powder circle and portrait.


## Content reconciliation B504: refinement-audits-2026-10-31

The 25-act, three-scene KJ3V run records 913 added fill minutes and a bounded final native journey, not complete physical or source-mechanism coverage. One Spirit Vision tap without recovery does not prove switching or exhaustion. Four pence assembled from pennies/halfpence is not a full fractional-money journey. Firearm rounds remain a fixed authored fact even after the narrated shot; the holder remains a desk checkpoint despite pillow prose. Neither is functional ammunition/custody proof. Carriage act locations and note-only floors, rooms and text roles do not establish placed rooms or actual actors. Three relocations in this run do not diagnose or repair the earlier KJ3E freeze. Leonard's arrival/visit/end-of-walk placements have distinct states; unknown roles do not become knowledge automatically. Pending commission is not paid income, and unpriced services are not debits. The final leak scan followed an earlier false positive matching “vaults”; preserve both attempts. Crossing day eight to nine with zero selected late beats does not establish global clock/booking repair, nor explain the KJ3M reserved-beat failure. The 829.2-second journey, three boots, import/reload and zero page errors do not prove desktop font matrices, a new full suite or current build. M1–M4 were proposed, not filed. Source fidelity, real actor placement, quantities and functional firearms remain named gaps. The next chapter's unrevealed knowledge stays withheld.
