# KJ3AC implementation receipt: the Divination Club, Glacis and Joyce, the calling and the warrant (kjw19)

2026-11-04. Window kjw19, third of the ch55-84 arc. **Agent-verified, not human-reviewed (AD43).** Content and pack data only: no `src/`, `dist/` or test edits. Not installed, no personal save touched. Depth: medium for the arc.

Proof bundle: `private/proof-bundles/master-bundle-4c9c0c2b/` (bundle.js sha256 `4c9c0c2b495474893f2cdff057b67d8d613c13ac8d990c5925eb46768e7d7abd`, matches; clean build of master `f7025c8ac`, which carries B1-B6, B8, R1, R2, R5, R9, C1, G3, G4, B10; packs copied with `cp -R`, never symlinked). Pack sha256 `eb38c228…` in the proof copy (see Open items 1), revision of the repo pack `cast-reviewed-kj3ac-a7142b756e1cbdab`. Seed: the KJ3AB completed checkpoint (clock 16804, money 799, pool 2/1, Moretti flat). Private files: `private/kj3ac-ch62-2026-11-04/`. Predecessor: [KJ3AB](KJ3AB_IMPLEMENTATION_RECEIPT.md).

## Scope and source

English v1 ch62 P001 - ch64 P088 (official edition). 13 acts in two scenes. Unwitnessed, built as nothing: ch63 P067-P069 (Audrey and the dog), ch64 P001-P062 (Audrey's ritual, Alger on the Blue Avenger). Monday evening and the night to Tuesday have no text, so they are two labelled fills. Final clock 17758 (Tuesday 07:58, engine day 12), money 817, pool 1 of 3 (strain 2), at the Blackthorn Security Company office. Next boundary: ch65 P001 (Klein goes underground to the armory with Dunn's note).

| Scene | Acts (`book.lotm.kj3ac.`) |
| --- | --- |
| Monday at the Divination Club | `ledger`, `ride`, `angelica`, `members`, `ask`, `glacis`, `joyce`, `dream`, `paid` |
| Monday night and Tuesday morning | `evening`, `night`, `calling`, `office` |

Minutes (fill, labelled; sum 954): 20, 25, 4, 10, 4, 20, 5, 25, 2, 297, 520, 14, 8. No civil anchor is fixed by the text in this window (the 17:40 anchor belongs to Sunday); the Tuesday morning is a fill.

## Constraint-store select (printed first)

`clock 16804-17800 (engine days 11-12): beats=84, max beat day 7, beats on day 8 or later 0, anchors on day 8 or later 0, schedule rows 77, rows until day 8 or later 0.` No unsettled beat.

## First native uses of the newly merged seams

| Mechanism | Built | Native result |
| --- | --- | --- |
| C1 client registry (Glacis, Joyce) | `glacis` and `paid` carry `clientSessionEffects` for each client, with the registry quote (Glacis eight pence listed, Joyce one soli stated, club eighth `settle:'later'`) | purse 805 then 817, `client.glacis` and `client.joyce` = paid, fee 8 and 12, owed 1 and 1.5, favor 1, no second money counter (asserted every act) |
| C1/R2 Anna settle | `ledger` settles the KJ3AA card with `clientSettleEffects('anna',{owed:2})`, clears `purse.minus.two.pending` | 799 to 797, Anna fee 10, owed 0, asserted at once and every act after |
| B3 Spirit Vision | `dream` switches it on (`beSpiritVisionOnEffects` plus one `beSeerUse`), `paid` ends it, the model adds Spirit exhaustion, `night` (sleep) clears it | condition on in `dream`, exhaustion in `paid` and `evening`, absent after `night`; pool 2/1 to 1/2 at `dream` and unchanged after |
| R2 grain | the 1.5-pence Joyce share and the half-pence tip are on the Tingen grain | owed 1.5 asserted |
| B4/B5/R1 | `glacis` requires the astrolabe `.real` method fact; no spirituality spent (as in KJ3AA) | ran after the KJ3AA lessons |
| R5, B8, B11, G17 | none in this window | not exercised |

## Money (pence)

Start 799. `ledger` -2 (Anna's club share and tip, ch56 P036-P038, settled late in the model: the KJ3AA card). `glacis` +8 (stated by Klein, ch62 P047), `paid` +12 (one-soli note, ch63 P061). End 817. The club's share on Glacis (1 penny) and Joyce (1.5) stays owed: **neither is in the text**, the registry's eighth for them has basis `listed`. Nothing else moves; the fares are unstated and the text does not show Klein paying the club.

## Corrections to the sweep rows

None needed against a2 for ch62-64 beyond two small ones: the sweep puts the thread close at ch63 P066 (Joyce leaves), the note is at P061-P062; the black dots at ch64 P066-P067 are a calling that Klein guesses is Justice or the Hanged Man (P069), not a confirmed rite.

## Gated beats and fallbacks

| Gate | Beat | Fallback |
| --- | --- | --- |
| B3 repeated switch-ons | `angelica` (ch62 P008, P016), `members` (P033), `dream` (P016) | the text shows three switch-ons; the model allows one cycle, so only `dream` is native and the others are facts (the pool would be empty at the third, and exhaustion bars a second switch-on) |
| B2 darkened eyes | none | none needed |
| R5 rites | none (the leave ritual stays a Justice/Hanged Man matter) | none |
| Glacis and Joyce club share | `glacis`, `paid` | owed fact remains; settle row not authored |
| Potion acting (R1 second half) | none | none |

## What each act withholds

| Act | Withheld | Later reader |
| --- | --- | --- |
| `dream` | how Klein judged it was Tris beyond the stated deduction (the Alfalfa events are Joyce's account) | ch64 office, later case |
| `members` | whether the folk medicine is Beyonder work | the apothecary check (thread open) |
| `evening`, `night` | everything (no text) | none |
| `calling` | the content of the calling (not heard) | the next gathering window |

## Verification (one line per check)

| Check | Result | Gap |
| --- | --- | --- |
| Pre-scan on the `.py` and the built JSON | ten strings over 200 characters trimmed in three passes; final "no string over 200 characters" | |
| Native route, headless Chrome, master bundle, one run | **Passed: 13 intents, money 797, 805, 817, 0 page errors, 4864.3 s (two boots, one import; the first two attempts failed before any act: a 60 s boot timeout under load, then the B8 proof acts in the shared pack that put `book.lotm.b8.issue` first in the arc, see Open items 1); per-act asserts: clock, money, location, pool reserve, B6 client facts, no second money counter, no items moved, no session open, alias facts, leak regex over this window's notes** | no RESUME join |
| Persisted | literal Export/Import at the end: location, money 817, clock 17758, pool reserve 1, kj3ac facts | reload after import not repeated |
| Rules check | `npm run check:rules` before commit | |

Not run: full `npm test`, a build of the repo `dist/`, 14/21 px captures, human play-through.

## Open items

1. **The shared pack carries four B8 proof acts** (`book.lotm.b8.issue`, `.load`, `.fire`, `.fire2`) in the `club` sequence of `private_packs/lotm-cast/cast.json`, added after KJ3AB. They are available from KJ3Z's `range` onward, so a runner that asks the arc for its next act gets `book.lotm.b8.issue` first. I stripped them (and the later window's acts) from the proof copy only; the repo pack still holds them. Someone should move them out of the campaign pack or order them.
2. Glacis and Joyce club shares are owed and unsettled; the cut and the referrer for both are registry guesses (`listed`), not paragraph facts.
3. The carriage to Zouteland Street is not a place: `calling` runs at the flat and `office` relocates to Blackthorn. The pack has a "Carriage in transit" place that a later pass could use.
4. The Anna fee fact now reads 10 (net); KJ3AA's receipt said 12.
5. Home place id inconsistency from KJ3AA open item 2 is unchanged (the Moretti flat is used).

## Next

kjw20 from ch65 P001 (Klein goes underground to the armory). See [KJ3AD](KJ3AD_IMPLEMENTATION_RECEIPT.md). Required start state: clock 17758, money 817, pool 1/3 (strain 2), Blackthorn office, `book.lotm.kj3ac.thread.beyonder.records.open`, `dunn.will.teach.beyonder.info`, `enter.fog.tonight.planned`.


## Content reconciliation B495: later evidence and preserved gaps

Historical13-act continuation with materially qualified proof copy, under AD36/AD42/AD43. Preserve selected ch62–64 scenes and unbuilt unwitnessed passages,954 labelled minutes/16804→17758 clock, and unstated Monday-night/Tuesday times as fills. The later C1 client entries and late Anna settlement are actual named consumers in this receipt, superseding KJ3AB's then-anna-only fallback for these two selected clients. That does not establish every paid story client or source-authorized club shares. The money calculation799−2+8+12=817 is coherent; Glacis1/Joyce1.5 shares remain listed/inferred debt, not source-shown payments. Anna's net10 fact is a disclosed correction from the older12 note. Unstated fares/stamps do not invent numerical debits.

Only dream uses the actual B3 switch-on/spend/exhaustion path; two other source switch-ons are factual fallbacks because the model's single-cycle/pool/exhaustion semantics do not fit them. Night clearing exhaustion does not claim the three source uses are implemented. A .real method prerequisite is a concrete bounded reader, not newly verified full divination. R5/B8/B11/G17 and acting's later half remain unexercised. Calling guesses the caller without heard content or confirmed rite; other actors' remote actions remain outside lead knowledge.

The successful run is on a proof copy stripped of four B8 proof acts and later-window rows. The repo campaign pack still contained those interfering acts, so passing proof does not establish normal next-act ordering on the live shared pack. Keep boot-timeout and first-act-order failures separate from the final successful13-act run; one run in the table means the final successful route, not no prior attempts. A clean pinned master bundle plus modified copied pack has its own identity; copied files differ from symlinks/live source. No RESUME join, repeat reload after import,14/21 visual, current shared-dist or whole-campaign claim follows. The before-commit rules command lacks a result field here. Carriage place/use, home-ID mismatch and owed-share settlement remain explicit consumers/gaps. This full receipt review inspects no private proof pack, runtime, current source or actual saved game.
