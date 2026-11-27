# Atlas native play-evidence bridge

Status: implemented and agent-verified, not human-reviewed. Atlas evidence navigation changed; native game source, bundle, saves and historical receipts remain unchanged. No commit or push.

## Preflight

| Field | Scope |
|---|---|
| Request | Let Atlas readers see which existing findings and advantages have native played evidence and where those bounded interactions are reached. |
| Player sentence | “These interactions run in the native OOPS game.” The bridge browses receipt-backed results; opening it installs nothing. |
| Ordinary route | Workbench → Native play evidence. Related cheat detail → Where to play returns to its exact card. Implementation acceptance retains each record’s scope; browsing does not promote a record. |
| Fit | Existing Workbench navigation, native public receipt JSONs and on-demand checkout bundle comparison. No copied gameplay engine or runtime adapter. |
| Failure | A changed/missing/invalid receipt withholds its result. A different native bundle means tested on another build; it does not establish feature absence. A missing bundle leaves comparison unavailable. |
| Screen | 1920×1080 desktop first; five cards with setup, POV, real play route and expandable evidence hashes. Mobile remains deferred. |
| Rules | AD6–AD8, AD36, AR3 and existing desktop evidence priority. Public allowlist and explicit source/implementation/playtest distinctions preserve provenance. |

## Implementation and scope

The new server model `atlas-native-evidence.mjs` reads exactly seven named public receipts, each pinned to its reviewed byte SHA-256. It recognizes the existing receipt shapes and projects curated card fields and strict identities, not raw JSON or source-controlled strings. The default `dist/bundle.js` is streamed for its current SHA. No private directories are scanned; raw saves and filesystem locators are absent from the response. Receipt size is bounded at 64 KiB. Loading and comparing are read-only.

The new client `atlas-native-evidence-view.mjs` renders five stable cards: `village-watch-relay`, `tingen-local`, `tingen-klein`, `starting-insight`, `loaded-dice`. Exact deep links use `#workbench/play-evidence/<id>` and focus the matching heading. `Compare checkout build` refreshes the same public projection on demand. Atlas_passes owns the hunk-only server/static/nav integration; root owns the CTC21/CTC64 detail links. This lane changed neither shared file.

| Card | Receipt-specific qualification |
|---|---|
| Village watch and relay | Real earned prerequisite checkpoints; native watch, relay, interruption and zero-standing courier assertions. Tested e0dad8c7, another build relative to the proof checkout. |
| Tingen ordinary local | Local actions/pending/final persistence passed on d815 before that combined process later failed at Klein’s control. A separate 06758b45 proof covers exact closing and an actual hour away. |
| Tingen Klein | Original earned d815 opening; final 06758b45 reading/response/Decline and a separate clean earned-response paid continuation. Final paid persistence is supported; no whole-campaign or live POV-switch claim. |
| +1 insight | Matched fresh ordinary/advantage beginnings on b691073a; three versus four actual distinct appraisal readings. Another tested build, with no inference of absence now. |
| Loaded Dice | Actual native combat→pelt work with an explicit held-card fixture on 06758b45. Quality 75/70/80, same 9 fighting ticks; acquisition remains unproved. |

Existing native receipts are immutable inputs. If their bytes change, that card’s played-result paragraph disappears and its receipt says Changed receipt. Missing, malformed, oversized or contradictory served-build evidence says Receipt unavailable. Checkout exact/different/unavailable is separate from receipt availability and entry/fixture scope.

## Checks and observed result

| Command / route | Result | Limit |
|---|---|---|
| `node --test tests/atlas_native_evidence.test.js tests/atlas_cheat_catalogue.test.js tests/atlas_campaign_sequencing.test.js` | 15/15 passed | Focused Atlas group; no full game suite duplicated. |
| `node --test tests/atlas_native_evidence.test.js` after final scope narrowing | 5/5 passed | Synthetic exact/different/missing/changed/invalid/oversized cases and actual seven receipts; raw private fields excluded, read-only behavior checked. |
| `node prototypes/world-atlas/prove-native-evidence.mjs` | Exit 0; normal default Atlas server and headless 1920×1080 Chrome | Workbench click route, all five cards, exact CTC64 and CTC21 related-record→Where to play round trips and target focus. |
| Compare button / API | Seven reviewed receipts admitted; exact for Dice/Klein/local boundary, different for Village/local actions/+1 on 06758b45 | Does not rerun gameplay or claim new native acceptance. |
| UI | Three screenshots visually inspected; zero page errors and horizontal overflow | Captured before the independent Atlas typography update; route behavior unchanged by that separate work. |
| `npm run check:docs`, scoped `git diff --check` | Passed | Existing shared line-ending warnings retained. |

[Desktop proof](../representations/evidence/atlas-native-evidence-2026-11-25/proof.json) · [Workbench page](../representations/evidence/atlas-native-evidence-2026-11-25/workbench-native-evidence-1920.png) · [Loaded Dice destination](../representations/evidence/atlas-native-evidence-2026-11-25/loaded-dice-where-to-play-1920.png) · [+1 destination](../representations/evidence/atlas-native-evidence-2026-11-25/starting-insight-where-to-play-1920.png) · [Final source identities](../representations/evidence/atlas-native-evidence-2026-11-25/source-freeze.json).

The desktop proof checked default native bundle 06758b45d2e5de05aa4e2cb6819e7cc8dc757188e73f4d51fa8dceb34b791634 before and after. A final metadata wording was narrowed afterward from pending/final Klein persistence to final persistence, matching the clean paid receipt; client rendering and route code did not change, and backend tests were rerun. The owned browser/server closed normally with exit 0. No scratch snapshot, copied save, candidate native build or gameplay installer was created. Kept artifacts are the cited public proof and source identities.


## November 27 replay of Village watch and relay

The checkout Workbench lists eleven cards. Three have documented evidence and eight have verified receipts. The desktop proof now compares the rendered card identities with the current inventory and still requires the five original receipt-backed routes to verify. Run `node prototypes/world-atlas/prove-native-evidence.mjs .local/atlas-replay` for a fresh desktop capture.

The Village card points to the previously verified `e0dad8c7` bundle. On checkout bundle `3ecaa88c`, a separate native replay from the earned cave-report and courier checkpoints passed the watch payout, carried receipt, relay payout, interruption and zero-standing courier branches. Pending watch, carried receipt and finished relay survived reload and fresh file import. The replay finished with three shifts and one completed relay. The Workbench still identifies the original receipt's bundle correctly.

For another replay, use an empty scratch working directory. Copy the two earned inputs into the same relative `.lane-builds/village-native-watch-relay-20261125/` directory inside it, then invoke the checkout's `tests/village_watch_relay_browser.cjs` with the absolute checkout as its build argument. The runner writes screenshots, saves and a proof relative to its working directory. This keeps the reviewed receipt available for comparison.

## Additional native routes integrated, 2026-11-26

Fang’s two reviewed native-evidence cards and typed world-entry inventory were integrated after the suite release alongside the independent reader-scene Find change. The coordinator observed both cards in the combined built-in desktop preview; native gameplay assertions remain bound to each card’s existing receipt and tested bundle. The overview distinguishes 10 worlds with listed native routes, 3 source-game references and 36 reading worlds without a listed native entry. This is a route inventory, not a universal gameplay gate. The [Find integration record](ATLAS_FIND_2026-11-25.md#reader-scene-metadata-and-combined-atlas-integration-2026-11-26) records 26/26 combined focused checks, file identities, unchanged snapshot/readiness and the limits of prior full-suite evidence.
