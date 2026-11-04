# KJ3AA implementation receipt: Anna's astrolabe and dream divination, the first paid session and Sunday night (kjw17)

2026-11-03. Window kjw17, the first of the ch55-84 arc (A2a). **Agent-verified, not human-reviewed (AD43).** Content and pack data only: no `src/`, `dist/` or test edits. Not installed, no personal save touched. Depth: medium for the arc (default mix of [DEPTH_DIAL_PROPOSAL](DEPTH_DIAL_PROPOSAL.md); Weibao has recorded no pick), first uses of B4, B5/R1, B6 and R9 built deep.

Proof bundle: `private/proof-bundles/master-bundle-65a3b122/` (bundle.js sha256 `65a3b12270499bad226b9e2955dabe73553cd0202a43dab71a2ccd72aa3189d3`, matches), a clean `node build.js` of master `44d0adb05` in a throwaway worktree (master carries B1-B6, R1, R9, L1, L2, B10). Native runs copied the packs (`cp -R`), never the symlink. Pack sha256 `8b7ada2b…`, revision `cast-reviewed-kj3aa-6f8aa61cc1b2eabc` (carries KJ3F-KJ3AA, 986 acts). Seed: the KJ3Z completed checkpoint (clock 15384, money 787, pool 0/3 strain 3, Divination Club). Brief: `private/kj-briefs-2026-11-02/BRIEF_kjw17.md`. Private files: `private/kj3aa-ch55-2026-11-03/`. Predecessor: [KJ3Z](KJ3Z_IMPLEMENTATION_RECEIPT.md).

## Scope and source

English v1 ch55 P001 - ch57 P068 (official edition). 21 acts in five scenes. Unwitnessed and built as nothing: ch55 P069-P079 (Anna's ride and the door), ch56 P001-P031 (Joyce's account). Final clock 15770 (22:50, engine day 10), money 799, pool 2 of 3 (strain 1), at the Moretti flat. Next boundary: ch58 P001 (Monday morning).

| Scene | Acts (`book.lotm.kj3aa.`) |
| --- | --- |
| Anna's divination | `study`, `method`, `details`, `astrolabe`, `hermes`, `cogitate`, `dream`, `omens`, `reveal`, `paid` |
| The reception lobby | `tip`, `wait`, `glacis` |
| Sunday evening at home | `home`, `evening` |
| Questions on paper | `digest`, `balance`, `ritual`, `loose`, `burn`, `letter` |

Minutes (fill, labelled; sum 386): 1, 2, 5, 14, 3, 8, 20, 6, 5, 1, 2, 9, 2, 30, 168, 20, 15, 35, 20, 10, 10. Civil anchor ch56 P042 (no second client by 17:40) lands exactly: clock 15460 after `wait` (asserted).

## First uses of the new mechanisms (what ran natively, B6/R9 and B4/B5/R1)

| Mechanism | Built | Native result |
| --- | --- | --- |
| B5/R1 method gate | `study` grants the lesson knowledge for astrolabe, numerology and dream divination (inferred from ch55 P023-P024, P054); `method`, `details`, `astrolabe`, `dream` require the `.real` facts | every gated act ran; none ran before `study` (the brief's order) |
| B4 energy cost | the dream divination spends one (`beSeerUse`, ch55 P033-P049); astrolabe and numerology cost none (the text shows no spend) | pool 0/3 until `cogitate`, then 3/0, then 2/1 after `dream`, unchanged after |
| Cogitation | `cogitate` (ch55 P030) refills the pool; **the text shows Cogitation as the entry to sleep, not a refill**, so this is a labelled model assumption, needed because the empty pool refuses the use | pool asserted after every act |
| B6 session, R9 referral | `paid` passes a stated quote of 12 pence (Anna's one-soli note, ch55 P067) with no house cut | purse 787 to 799, `book.lotm.be.client.anna` = paid, fee 12, favor 1, no second money counter (asserted every act) |

## Money (pence; 12 per soli)

Anna's note is one soli, 12 pence (ch55 P067), without waiting for change; whether it holds a tip is Klein's joke (P068). Quote `stated`, no `houseCut`: B6's default would compute floor(12/8)=1, and the text computes 1.5. The club's eighth and Klein's halfpence tip (a penny and two halfpence, 2 pence, ch56 P036-P038) are a **card**: coins and the pending fact `purse.minus.two.pending`. R2 is not on master (`git log master | grep mech-r2` empty), so the purse reads **799 where the text implies 797**. Nothing else moves (Sibe tea unpriced, fares and Mrs. Shaud's gifts unstated).

## Constraint-store select (printed first)

`clock 15384-15840 (rest of engine day 10): beats=84, max beat day 7, beats on day 8 or later 0, anchors on day 8 or later 0, schedule rows 77, rows until day 8 or later 0.` No unsettled beat.

## Corrections to the sweep rows (checked against paragraphs)

The seam row put the note at ch55 P069 (it is P067); the coin sum in a1.7 is 2 pence, not "a halfpence tip" alone; ch56 P059-ch57 P068 notes are in an old script and burned, so no old-world clause may enter a note. 34 over-limit sweep summaries and a verbatim-run list were not used as source.

## Gated beats and fallbacks

| Gate | Beat | Fallback |
| --- | --- | --- |
| R2 halfpence | `tip` | coins as facts, 2 pence pending, purse 2 above the text |
| B2 darkened eyes | `cogitate` (ch55 P030) | no observer in the locked room; fact only |
| B3 Spirit Vision | none used in this window | none needed |
| R5 rites | `ritual` (ch57 analysis) | analysis as facts; no rite performed |
| Potion acting (R1 second half) | `digest` | Klein's two hypotheses as facts and a note |
| B6 for other clients | `glacis` (invitation only) | Glacis and Joyce are not in `BE_CLIENTS`; filed as a backlog row for kjw19 |

## What each act withholds

| Act | Withheld | Later reader |
| --- | --- | --- |
| `reveal` | the dream is not told to Anna | ch63 Joyce visit |
| `ritual` | the redesign's aim (old-world, private) | ch58 incantation |
| `tip` | the 2 pence | R2 settle |
| `letter` | the letter's body | ch58 P002, posted by Melissa |
| `digest`, `balance`, `ritual`, `loose` | old-world clauses (ch57 P009, P015, P032): no text at all | none |

## Verification (one line per check)

| Check | Result | Gap |
| --- | --- | --- |
| Pre-scan on the `.py` and the built JSON | 28 over-length strings trimmed in four passes; final "no string over 200 characters" | built JSON clean |
| Re-pin: KJ3Z runner on the new master bundle | passed: 23 steps, 0 page errors, bundle `65a3b122` matches, 3681 s under load 140 | confirms B10 boots and the old chain still runs |
| Native route, headless Chrome, master bundle, one run | **Passed: 21 intents, money 787 -> 799, 0 page errors, 3060.7 s (machine load 28-143), 2 boots and 1 import; per-act asserts: clock, 17:40 anchor, money, location, pool reserve, B6 facts, no second money counter, no items moved, no session open, leak regex over this window's notes** | no RESUME join |
| Persisted | literal Export/Import at the end: location, money 799, clock 15770, pool reserve 2, kj3aa facts | reload after import not repeated |
| Rules check | `npm run check:rules` before commit | |

Not run: full `npm test`, a build of the repo `dist/`, 14/21 px captures, human play-through, civil clock beyond the anchor.

## Open items

1. R2 settle: −2 pence at `tip`, and the B6 club-share default (assumed 8 pence and one-eighth) disagrees with the text (12 pence and 1.5): proposed backlog row C1 (filed).
2. Home place: kjw10 (KJ3T) used `cast-cbdaed…` (Narcissus Street No. 2) for the siblings' home, kjw12 onward and this window use `cast-266d…` (Moretti flat). Both exist in the pack; no window reconciled them. Not fixed here.
3. The leak regex generated by `gen-runner.mjs` scans all of the player's knowledge, so earlier windows' notes trip it; this run scoped it to this window's keys.

## Next

kjw18 from ch58 P001 (Monday): the letter, the third gathering and the diary pages. Required start state: clock 15770, money 799, pool 2/3 (strain 1), Moretti flat, `book.lotm.kj3aa.notes.burned.ten.seconds`, `thread.ritual.redesign.open`, `thread.cohen.letter.open`, `thread.glacis.thanks.open`.
