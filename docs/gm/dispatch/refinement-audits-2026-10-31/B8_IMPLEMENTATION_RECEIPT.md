# B8 implementation receipt: BE-seat firearm practice, ammunition and hit chance (2026-11-03)

Backlog row B8 (AD48 mechanism lane; AD36, AD43, AD38, AD49, WA33). Consumers: range practice ch26 P047-P066, deterrence bluff ch28 P004-P010, first gunfight ch103 P054. Seam: `src/book_world_lotm_be_firearm.js` (pure data and functions, no state slice, no `main.js` line), registered by one line each in `book_world_lotm_actions.js` (facts) and `book_world_lotm_state.js` (save assertions). AR3: ammunition and practice are actor resources `book.lotm.be.{carried,loaded}.<kind>` and `book.lotm.be.practice_fired`; the revolver is the actor fact `book.lotm.be.revolver`. Hit chance and toughness reuse `book_world_lotm_bands.js` (`winChance`, `hitsToDown`); no second combat system.

## Built
- Effect builders (issue, stock, load, unload, fire with optional practice), predicates (`beFirearmFireRequires`, `beFirearmLoadRequires`), facts `lotm.beFirearm.*`, `shotOdds`, `resolveShot` (needs the game rng; returns the effects to commit with the act so a round is spent exactly once), `beFirearmAssertions`.
- Round kinds: ordinary (force 0) and silver demon-hunting (+1 force against a Beyonder, LCD4/LCT5). Six chambers (ch141 P061; a five-chamber revolver is a dial for G17).
- Aim: practice rounds 0/50/250/1000 give 0/1/2/3 notches; the last step is the Captain's basic approval after over a thousand rounds (ch128 P002). Nothing grows past it. Steps, range notches and the unaware bonus are proposals (WPR5/AD49); only the 1000 cap and six chambers have a locator.

## Evidence rows
| Row | State |
|---|---|
| source-edited | yes |
| focused-tested | `node --test tests/lotm_firearms.test.js`: 5 pass (empty or unissued never hits; one round spent per shot; no negative ammunition; chambers; aim cap; Demoness Seq 7 dodges; silver needs fewer hits; JSON save and reload keep counts; Tingen life refused) |
| built | `npm run build` ok; `check:arch` PASS |
| check:rules | FAIL, not from this change: register says WA1-WA53, highest in WORLD_ABSORPTION_RULES is WA68 (same failure noted in the B6 receipt) |
| native (headless, fresh origin) | `scripts/lotm_slice/b8-range-proof.mjs`, bundle built from this tree, B10 packs plus four proof acts injected into a scratch cast.json, origin kj3z `ckpt-range`: issue, load six, two practice shots gave carried/loaded/fired 20/0/0, 14/6/0, 14/5/1, 14/4/2; literal save then fresh session reload kept 14/4/2; `browser-result` in scratchpad only |
| full `npm test` | 4952 pass, 20 fail, none in firearms: road old/runner (15), book_world_lotm_opening (missing `canonPullVisible` export), perspective_controls (`data-lotm-altar-rites` untagged, from R5/U3), Village shower event, run admission, index.html stylesheets; an earlier run also caught my own over-broad `book.lotm.be.` key assertion (B6 client test), fixed and re-run |

## Not done or not verified
- Below the floor on content reach: the proof acts live only in a scratch cast.json; no committed cast slice calls B8 yet, so range practice is not reachable in real play until a cast slice (ch26, ch28, ch103) adds acts using the builders.
- No consumer calls `resolveShot` yet (first gunfight ch103 P054 needs it). Dodge uses the target's speed band; Clown Seq 8 has speed 0 in the L1 table, so it does not dodge.
- Armor and scale blocking of silver (ch129 P047, ch134 P052), the three-month power loss (ch186 P024) and enemy state are G17's. G17 was not started: B8 is not at the floor.
