# KJ3AE implementation receipt: the fog at night, the underground market and the amulet stall (kjw21)

2026-11-04. Window kjw21, fifth of the ch55-84 arc. **Agent-verified, not human-reviewed (AD43).** Content and pack data only: no `src/`, `dist/` or test edits. Not installed, no personal save touched. Depth: medium for the arc.

Proof bundle: `private/proof-bundles/master-bundle-4c9c0c2b/` (bundle.js sha256 `4c9c0c2b495474893f2cdff057b67d8d613c13ac8d990c5925eb46768e7d7abd`, matches; clean build of master `f7025c8ac`; packs copied with `cp -R`, never symlinked). Pack sha256 `52e76c54…` in the proof copy (B8 proof acts stripped, see [KJ3AC](KJ3AC_IMPLEMENTATION_RECEIPT.md) open item 1). Seed: the KJ3AD completed checkpoint (clock 18540, money 807, pool 1/2, Moretti flat). Private files: `private/kj3ae-ch67-2026-11-04/`. Predecessor: [KJ3AD](KJ3AD_IMPLEMENTATION_RECEIPT.md).

## Scope and source

English v1 ch67 P001 - ch69 P082 (official edition). 19 acts in two scenes. Unwitnessed, built as nothing: ch67 P039-P049 (Audrey wakes) and P070-P080 (Alger in the hotel). Final clock 19926 (Wednesday 20:06, engine day 13), money 684, pool 3/0, on Daffodil Street at the flat. Next boundary: ch69 P082 (the Spirit Vision glance at the shuddering lady) into ch70 P001.

| Scene | Acts (`book.lotm.kj3ae.`) |
| --- | --- |
| Tuesday night above the grey fog | `late`, `wall`, `rise`, `prayer`, `aware`, `limits`, `hanged`, `down`, `sleep`, `wednesday` |
| Wednesday dusk: the underground market | `dinner`, `bar`, `market`, `ademisaul`, `stalls`, `amulets`, `girl`, `leave`, `lady` |

Minutes (fill, labelled; sum 1,386, of which 1,245 before the market): 150, 6, 3, 5, 1, 4, 4, 5, 467, 600, 55, 7, 10, 8, 6, 10, 12, 30, 3. Wednesday dusk is the only anchor the text gives; the day itself is a labelled fill.

## Constraint-store select (printed first)

`clock 18540-20000 (engine days 12-13): beats=84, max beat day 7, beats on day 8 or later 0, anchors on day 8 or later 0, schedule rows 77, rows until day 8 or later 0.` No unsettled beat.

## Mechanisms

| Mechanism | Built | Native result |
| --- | --- | --- |
| B1 pool | `wall` spends one spirituality on the room seal (ch67 P005-P008); `prayer` calms the mania with Cogitation, modelled as a recover (assumption, the text shows calming, not a refill) | pool 1/2 to 0/3 at `wall`, 3/0 at `prayer`, unchanged after |
| R5 rites | the redirected luck ritual and the four steps are facts: R5 binds only the proof `spirit-call` rite, and the candles/knife kit are not stocked (G5) | facts, no altar block exercised |
| Places | the pack's Dragon Bar, Underground market and Carriage in transit are used by relocation | location asserted every act |
| Native money | `amulets` is one native money effect of 123 pence (5 soli 6 + 4 soli 9) | 807 to 684, asserted every act |
| B3 Spirit Vision | the text shows two switch-ons (ch69 P007, P080); both are facts | not native (the pool is the barrier and exhaustion bars a second cycle; see KJ3AC) |
| R8 amulet protection, G5 shopping | the blanks are bought but no item enters the inventory; the plan to carve protection amulets is a fact | facts |
| B12 expense claim | the 10 soli 3 pence come from the club reimbursement the text names, paid from the one purse | fact plus purse debit |

## Money (pence)

807 to 684: 123 pence for two silver amulet blanks (ch69 P030-P032). The text says it is deducted from the reimbursement for the club membership; in the model it leaves the one native purse (there is no second account). The girl's amulet, Neil's debt and the fares carry no figure for Klein. Glacis (1) and Joyce (1.5) club shares stay owed.

## Corrections to the sweep rows

The sweep puts the amulet purchase at ch69 P030 (right) and the price total "10 soli 3 pence, meant as protection gifts for Benson and Melissa" (right: the pieces are uncarved silver blanks, 5 soli 6 and 4 soli 9 after haggling, from asking prices of 6 and 5 soli 3).

## Gated beats and fallbacks

| Gate | Beat | Fallback |
| --- | --- | --- |
| R5 binding of the redirected rite | `rise`, `prayer`, `hanged` | facts (kit and station not bound) |
| B3 repeated switch-ons | `stalls`, `lady` | facts |
| R8 amulet craft, items | `amulets`, `girl` | facts (no item moved) |
| B11 Hanass and others | none | none |

## What each act withholds

| Act | Withheld | Later reader |
| --- | --- | --- |
| `down` | what Klein thinks of the luck ritual beyond its use (ch67 P085 reference) | none |
| `ademisaul` | Ademisaul's private words (only the smell of death is said) | the Monster lead is left open |
| `girl` | the girl's friend and her purchase | none |

## Verification (one line per check)

| Check | Result | Gap |
| --- | --- | --- |
| Pre-scan on the `.py` and the built JSON | about twenty-three strings over 200 characters trimmed in five passes; final "no string over 200 characters" | |
| Native route, headless Chrome, master bundle, one run | **Passed: 19 intents, money 807 to 684, 0 page errors, 4559.3 s (two boots, one import; a first attempt tripped the generated leak regex on the in-world god "Earth Mother", so the regex excludes that phrase); per-act asserts: clock, money, location, no second money counter, no items moved, no session open, leak regex over this window's notes** | no RESUME join; pool recorded not asserted |
| Persisted | literal Export/Import at the end: location, money 684, clock, kj3ae facts | reload after import not repeated |
| Rules check | `npm run check:rules` before commit | |

Not run: full `npm test`, a build of the repo `dist/`, 14/21 px captures, human play-through.

## Open items

1. R5: the redirected luck ritual with knife, four steps and spirituality wall could become a bound rite and an altar layout; today it is facts.
2. The 600-minute Wednesday fill and the 467-minute night are the cost drivers (settle 1,335 s at the longest); no source text covers either.
3. Shared-pack B8 proof acts remain (KJ3AC open item 1).
4. A protection amulet craft (R8) needs a bound craft row and an inventory item for the silver blanks.

## Next

kjw22 from ch69 P082 or ch70 P001 (Daffodil Street, the shuddering lady, then Melissa's dress and the Tris report, ch70-72 to Sealed Artifact 2-049). Required start state: clock 19926, money 684, pool 3/0, Daffodil Street flat, `book.lotm.kj3ae.thread.lady.shudder.open`, `silver.blanks.bought.two`, `amulets.planned.for.siblings`.
