# KJ3AD implementation receipt: the Beyonder records and Tuesday evening (kjw20)

2026-11-04. Window kjw20, fourth of the ch55-84 arc. **Agent-verified, not human-reviewed (AD43).** Content and pack data only: no `src/`, `dist/` or test edits. Not installed, no personal save touched. Depth: medium for the arc; the records are read at beat grain as facts and notes.

Proof bundle: `private/proof-bundles/master-bundle-4c9c0c2b/` (bundle.js sha256 `4c9c0c2b495474893f2cdff057b67d8d613c13ac8d990c5925eb46768e7d7abd`, matches; clean build of master `f7025c8ac`; packs copied with `cp -R`, never symlinked). Pack sha256 `3d1c8448…` in the proof copy (B8 proof acts and later windows stripped, see [KJ3AC](KJ3AC_IMPLEMENTATION_RECEIPT.md) open item 1). Seed: the KJ3AC completed checkpoint (clock 17758, money 817, pool 1/2, Blackthorn office). Private files: `private/kj3ad-ch65-2026-11-04/`. Predecessor: [KJ3AC](KJ3AC_IMPLEMENTATION_RECEIPT.md).

## Scope and source

English v1 ch65 P001 - ch66 P047 (official edition). 15 acts in three scenes. Unwitnessed, built as nothing: ch66 P048-P070 (Tris at the window and the harbor). Private thoughts in ch65 P031 about how Klein came to be where he is are withheld from every note. Final clock 18540 (Tuesday 21:00, engine day 12), money 807, pool 1/2, at the Moretti flat after dinner. Next boundary: ch67 P001 (the night in the grey fog).

| Scene | Acts (`book.lotm.kj3ad.`) |
| --- | --- |
| The Beyonder records | `armory`, `fetch`, `seer`, `zaratul`, `sailor`, `savant`, `pathways` |
| Instigators and the Theosophy Order | `instigator`, `theosophy`, `demoness`, `orders`, `tris` |
| The rest of Tuesday | `study`, `shop`, `plan` |

Minutes (fill, labelled; sum 782): 5, 15, 12, 8, 10, 6, 8, 8, 6, 6, 8, 1, 479, 55, 155. Only `tris` has a stated duration (under twenty seconds, one minute); the rest are fills from clock 17758 (07:58) to 21:00.

## Constraint-store select (printed first)

`clock 17758-18600 (engine day 12): beats=84, max beat day 7, beats on day 8 or later 0, anchors on day 8 or later 0, schedule rows 77, rows until day 8 or later 0.` No unsettled beat.

## Mechanisms

| Mechanism | Built | Native result |
| --- | --- | --- |
| Reading records (clearance) | the pathways read are notes and facts; the clearance stop at Sequence 7 and the wait for Sealed Artifact 2-049 are facts | no R6 (clearance level) yet; the stop is a fact, not a gate |
| R2 grain, native money | `shop` pays 10 pence (Enmat Beer) as one native money effect; the lemon cakes carry no price in the text and no debit | purse 817 to 807, asserted every act |
| B1 pool | none spent (reading and shopping) | pool 1/2 unchanged from `armory` to `plan` |
| B3, B4/B5/R1, B6, R5, B8 | none | not exercised |

## Money (pence)

817 to 807: ten pence for the two-litre barrel of Enmat Beer (ch66 P037), the only figure the text gives. The lemon cakes have no stated price, so nothing is debited. The two-to-four-soli weekly reimbursement is Klein's claim to his siblings (ch66 P041-P042), recorded as a fact, not as income. Glacis (1) and Joyce (1.5) club shares stay owed from KJ3AC.

## Corrections to the sweep rows

The sweep gives the Seer pathway as lacking names at Sequences 8 and 7 (right, ch65 P016) and places the clearance stop at ch65 P052 (right); the Instigator is first found at ch65 P060 (the last paragraph of ch65), so the Assassin and Theosophy reading falls in ch66, not ch65. The conversation about Chanis Gate (ch65 P006) is a request, not a fetch; the fetch is P008-P009.

## Gated beats and fallbacks

| Gate | Beat | Fallback |
| --- | --- | --- |
| R6 document clearance | `savant` (clearance stops at 7) | fact |
| B3 Spirit Vision, B2 | none | none |
| B12 expense claim | none (the reimbursement figure is a claim) | fact |
| G6 case state | `tris` (no divination of Tris's place), `study` (not in the operation) | facts |

## What each act withholds

| Act | Withheld | Later reader |
| --- | --- | --- |
| `zaratul` | Klein's private reading of what the chain means for him (ch65 P031) | none |
| `demoness` | the Demoness Sect file (Neil refuses, clearance) | a later clearance window |
| `shop` | the siblings' view of the divination money (stays hidden) | the next gathering |

## Verification (one line per check)

| Check | Result | Gap |
| --- | --- | --- |
| Pre-scan on the `.py` and the built JSON | about twenty strings over 200 characters trimmed in four passes; final "no string over 200 characters" | |
| Native route, headless Chrome, master bundle, one run | **Passed: 15 intents, money 817 to 807, 0 page errors, 13,718 s (two boots, one import; a first attempt failed at `shop` because the act's place was the flat while the player was in the armory, so the arc offered a move first; the place is now the armory and the act relocates); per-act asserts: clock, money, location, pool reserve, no second money counter, no items moved, no session open, leak regex over this window's notes** | no RESUME join |
| Persisted | literal Export/Import at the end: location, money 807, clock 18540, kj3ad facts | reload after import not repeated |
| Rules check | `npm run check:rules` before commit | |

Not run: full `npm test`, a build of the repo `dist/`, 14/21 px captures, human play-through.

## Open items

1. A act's `place` must be the player's current location, or the arc asks for a move first (the `shop` failure). Later windows should set `place` to the origin and relocate by effect.
2. The 13,718 s run is dominated by long fill acts (`study` 479 and `plan` 155 minutes, settle 6,653 s at the longest). Fills over about 300 minutes are the cost driver.
3. Shared-pack B8 proof acts remain (KJ3AC open item 1).
4. The Sequence names of the Theosophy and other paths are notes, not a table; R6 would make the clearance a gate.

## Next

kjw21 from ch67 P001 (the fog at night, then the underground market). Required start state: clock 18540, money 807, pool 1/2, Moretti flat, `book.lotm.kj3ad.fog.entry.planned.after.sleep`, `underground.market.tomorrow.night`, `thread.fog.tonight.open.tuesday`. See [KJ3AE](KJ3AE_IMPLEMENTATION_RECEIPT.md) if built.
