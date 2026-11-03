# KJ3E implementation receipt: return home to the Chanis Gate junction

2026-11-02. Authorized by Weibao ("work on both concurrently" after the sweep pilot; the ch16 build is the pilot's comparison episode, PF13 proposal). **Agent-verified, not human-reviewed (AD43).** Not committed, not installed, no personal save touched. Content-only slice: the public bundle is byte-identical to KJ3D's (`919b17d3…`), so no runtime or UI code changed.

## Scope and source

English v1 ch16 P001-P132 and ch17 P001-P046 (official edition, sha256 `395c9d9f…`), qualified by reading the window itself; the [sweep rows](../../../research/novels/lord-of-mysteries/private/kj-sweep-pilot-2026-11-02/PILOT_RESULT.md) s1.1-s1.8 were inputs, not authority. Eleven native intents in three situations: home before the reply (climb, answer Melissa, weigh the invitation, nap), finding the contact (dress and count coins, tracked carriage with a four-pence fare, the Hound pub, Wright's referral), and the office on Zouteland Street (find the stair, announce, follow Rozanne to the junction before the Chanis Gate). The contract (ch17 P047 onward) is the next boundary and the first employment consumer; it is not started. The invitation stays pending (`offer.open`, `offer.reply.by`); the decision to find Dunn today is a private resolve, not an assent; giving Dunn's name to Wright is a referral, not acceptance.

## What exists

Private rows and builder: `docs/research/novels/lord-of-mysteries/private/kj3e-ch16-2026-11-02/` (`build-episode.py`, `reviewed-episode.json`, `play-episode.mjs`, earned checkpoints per step, `completed-checkpoint.json`, `completed-export.txt`, 14/21 px captures, `browser-result.json`, pack backup `cast-before.json`). Rows live in the ignored `private_packs/lotm-cast/cast.json` under prefix `book.lotm.kj3e.`.

| Decision | Basis |
| --- | --- |
| Pocket balance of seven pence, stated in an explicit "count your coins" act | ch16 P076-078 (four paid, three left) implies seven; ch9 P023 says five. The conflict stays unresolved and is recorded in the note and the row data; this is a labelled source-qualified correction of KJ3A's zero lower bound, not a silent top-up. The fare act is blocked without the coins. |
| Fare as a native money cost of four pence, no payee | Source names an unnamed money collector; no payee actor is invented. |
| Nap through the native sleep operation (180 min, authored) | Source gives order, not duration. |
| English display corrections: Luo Shan to Rozanne, "Night Watch reception" to "Blackthorn Security Company office" | ch17 P031 self-introduction; ch16 P130 and ch17 P001 sign. Same bodies and places, not new ones. |
| Pub = the Hound Tavern place the player already knows from KJ3D | The sweep's "Brown Hound tavern" id is a duplicate of the same pub; Wright's routine uses the duplicate. |
| Melissa, Wright, the bartender and Rozanne are placed by the arrival act and held by visits | The native schedule does not place them: Melissa's routine uses the other flat id and carries no night hours; Wright's routine uses the duplicate pub id; Rozanne has no hours. The source places them, so the arrival act relocates and the visit holds. This is recorded as a presence gap, not a general rule. |
| Leonard is glimpsed, not required or relocated | Relocating both Rozanne and Leonard in `find`, with Leonard also held in the office visit, froze the browser page on click; relocating either alone ran fine, and relocating Wright and the bartender together in `pub` also ran fine, so "two actors" is not the cause and the cause is undetermined (variant kept as `two-relocation-hang-variant-pack.json`; the earlier wording in `reviewed-episode.json` is superseded by this row). Open runtime question, not investigated here. |
| Melissa hears the running excuse as her testimony | The confidentiality promise's first household consumer: testimony recorded as hers, not the lead's private reasoning. By default the bond system and an affinity meter stay out until a behavioral consumer needs them (plan, relationship clarification), so this slice adds neither. |
| Canonical flat | The build uses the Moretti flat id (366 references) and leaves the provisional `klein-flat` duplicate alone. |

## Verification (one line per check)

| Check | Result | Gap |
| --- | --- | --- |
| Rebuilt bundle `BUILD_OUT=/tmp/lotm-kj3e-ch16 npm run build`, pack `db0a0c77…` | Passed; bundle hash equals KJ3D's | no full `npm test` (not authorized; no runtime change) |
| Native route, headless Chrome, fresh origin, seed = KJ3D earned checkpoint | Acts 1-3 (climb, return, decide) passed in one run; acts 4-11 (nap to descend) passed in a resumed run from the earned `decide` checkpoint, with money 0 to 7 to 3, the invitation still pending, no item created or consumed, arrival at the gate junction | not one uninterrupted run: browser stalls under host memory pressure (63 GB used, heavy swapping) broke three runs; split evidence is stated, not hidden |
| Literal Export/Import after completion | Passed: position, money, retained knowledge and completed arc preserved | |
| Counterfactuals | Fare blocked with no coin; ride blocked until the pocket balance is stated | other failure cases (absent speaker, cancel mid-sleep) not run |
| 14 and 21 px captures | Taken; the 21 px capture inspected: complete arc, `3 pence`, Chanis Gate | 14 px capture not inspected |
| Page errors | 0 in the resumed run | |

Not verified: a human play-through, installed app, the civil clock (native shows "Day 2, morning" for a source afternoon; known gap), and ch9's five pence.

## Coarse cost ledger (PF13 comparison point)

About four wall-clock hours from the preflight to the verified route; not a clean measure because host stalls and waiting on background runs dominate. Eleven runner executions plus three probes; the final resumed run had 5 boots (94 s), 8 native actions (51 s), 8 settles (90 s), 1 import (23 s), all inflated by load. Late corrections: one invalid empty participants list, one missing native move in the runner, three presence corrections (Melissa; Wright and the bartender; Rozanne), one runner key bug, one two-actor relocation hang. About four of the eleven runs were avoidable by a presence preflight (who is natively where at the act's time) that the sweep rows did not provide. The sweep did correctly flag the purse, flat and pub id problems before the build. No standard-episode comparison is made; chapter counts and passing tests are diagnostics, not quality.

## Next

Source-qualify ch17 from P047 (the contract, wages and confidentiality clause, the first employment consumer) before building; carry `offer.open`, `offer.reply.by`, Wright's referral, the pocket balance and the Blackthorn office knowledge. Add a native-presence check to the fixture preflight (PF7). Investigate the two-relocation freeze separately.
