# KJ3L implementation receipt: the withdrawal, the watcher, the cathedral and the range

2026-11-03. Window kjw2 of the KJ3 sweep. **Agent-verified, not human-reviewed (AD43).** Content-only, below the human gate: no `src/`, `dist/` or test edits. Not installed, no personal save touched. Proven on the pinned KJ3E bundle (`919b17d3a114e5c622d0efd81f53a84c927012d10537c863fdb851ba2d7c9abf`, unchanged, copy in the scratchpad; the repo `dist/bundle.js` was not used). Pack sha256 `63943a36…`, revision `cast-reviewed-kj3l-16e945af9e3f6371` (carries KJ3F-KJ3L). Private files: `docs/research/novels/lord-of-mysteries/private/kj3l-ch24-2026-11-02/`. Seed: the KJ3K completed checkpoint (money 2760).

## Scope and source

English v1 ch24 P034 - ch26 P068 (official edition), read from sweep shards 2 and 3. Fourteen acts in six scenes covering the brief's eight proposed intents, nothing folded. Next boundary: ch26 P069 (kjw3, Benson at the desk).

| Brief intent | Acts built | Pinned keys set (`book.lotm.kj3l.`) |
| --- | --- | --- |
| 1 Withdrawal | `walk`, `withdraw` | `withdraw.told` (+ extra `walk.done`) |
| 2 Cohen and Azik | `history`, `antigonus` | `cover.told.history`, `azik.blank`, `letter.promise`, `newspaper.held` |
| 3 The paper | `paper` | `paper.read`, `observer.felt` |
| 4 Carriage | `carriage` | `route.avoids.home` |
| 5 Mass, confession | `mass`, `confession`, `passage` | `badge.cathedral` |
| 6 Passage and Rozanne | `reception`, `teased` | `route.cathedral.blackthorn`, `rozanne.teased` |
| 7 Dunn, deduction | `dunn`, `outside` | `dunn.told`, `watcher.avoids.church` |
| 8 Range and ride home | `range` | `range.practice`, `brass.spent`, `silver.reloaded` |

Intents per chapter: acts cross chapter edges (`antigonus` ch24-25, `passage` ch25-26), so chapter counts are not clean: 14 acts over about 2.6 chapters. Level: deep, every row at beat grain (plot beats, not routine rows).

## Corrections to the brief (text and pack checked)

| # | Brief said | Built | Basis |
| --- | --- | --- | --- |
| B1 | Cathedral is NEW | pack `lotm.place.cast-f8ef0f90dae4c6193ca2` (Saint Selena Church) | alias "Night Goddess church HQ in Tingen" at zh ch17 p47; ch25 P057 calls the place the Tingen headquarters of Evernight. The brief's warning was only against the Saint Hilan Cathedral entry |
| B2 | Range is `zot-street-3` (unverified) | pack `lotm.place.cast-7970e3eb24edeee1e0dc` (Underground shooting range) | alias "Zhotelan shooting club range" at zh ch20 p57; the `outside` act relocates the player straight to it |
| B3 | Dunn's office is the anchor `lotm.anchor.place.6ca3099d091be3a9` | `lotm.place.cast-0785d86b800a41be64ed` (Blackthorn office) | the anchor id is not in `places`; KJ3G-KJ3J used the office id |
| B4 | Newspaper is an item | fact `newspaper.held` plus a note | the cane precedent (KJ3K); inventories asserted unchanged |
| B5 | Boulevard and passage NEW | minted `lotm.place.kj3l.khoy-boulevard` and `lotm.place.kj3l.cathedral-passage` (kj3c minimal place entries) | no pack place fits; the junction and stair share the passage place |
| B6 | Intent 6 relocates Rozanne with the player at once | `reception` relocates Rozanne and the player; `teased` relocates Dunn and the player to his office | one non-player relocation per act |
| B7 | Cast spellings | Stone is `Harvan Stone`, Azik is `Aziq` in the pack | ids confirmed; Azik's relation text matches ch24 P057 |

Anchors: the brief's money rows match the text, no brief row changed. The Stone/Cohen/Azik/priest/Rozanne/Dunn ids are as in the brief.

## Money (pence; 240 per pound, 12 per soli)

| Line | Pence | Locator | Native |
| --- | --- | --- | --- |
| Public carriage out | -6 | ch24 P035 ("paid six pence for the public carriage") | `walk` |
| Carriage to Champagne Street | -6 | ch25 P041-P042 (officer says six pence; two soli notes taken, 24 pence, minus the earlier six leaves a soli and six pence, all coins handed over) | `carriage` |
| Tracked carriage home | -4 | ch26 P068 | `range` |
| Range fee | 0 | ch26 P048-P049: only a badge check, no fee stated | none |

Native money: 2760 -> 2754 -> 2748 -> 2744, exactly as planned; each step asserted. Known: the three fares. Assumed: start 2760 (the coppers to Melissa are unstated); no change is returned at P042 (the text says all coins were handed over, the fare is six). The Saturday notes (two soli notes) are not modelled as items. Every change is a player-picked place act with a native cost, so the canon action gate sees pack-reserved acts (it accepted all three on the native route).

## Actor per verb (standing check)

Every verb is performed by the player (Klein as the BE seat, `beyonderTrack:false`); non-player reactions are knowledge notes written inside the same act. The owner that runs them is `definePlaceActs` (`src/book_world_lotm_cast_host.js:194`) and `quotePlaceActs` (`:112`), which read `householdActs`, using `src/place_acts.js`. No Beyonder command is involved. The firearm practice has no skill owner: logged as B8 in [MECHANISM_BACKLOG](MECHANISM_BACKLOG.md) (proposal); the act stays at fact grain.

## What each act withholds and who reads it later

| Act | Withheld | Later reader |
| --- | --- | --- |
| `walk` | Packed brass and the revolver are Klein's own notes | `range` (brass), kjw3 bluff |
| `withdraw`, `history` | The true employer (Stone, Cohen hold only "security firm, relics, three pounds") | ch24 P059 repeat; no later reader in ch31 for Stone's message |
| `antigonus` | Concealment about Welch and Naya's fate; Azik's near-memory | ch28 P044 (Dunn names the origin), ch30 P034-P036 (letter owed) |
| `paper`, `carriage` | The watched feeling and the cover-up inference; the Nighthawk avoidance reasoning | kjw3 `dream`, `outside`, ch27 P022 |
| `mass`, `confession`, `passage` | Why and by whom he is followed (unknown); the Antigonus matter; his view of gods | `dunn` (cathedral question), `outside` |
| `reception`, `teased` | The tail and the cathedral route (Rozanne holds only the knock and "a secret") | ch30 P073-P076 |
| `dunn`, `outside` | Dunn's plan; Klein's cathedral deduction is not told to Dunn | ch28 P044 |
| `range` | The silver rounds and the reason for the practice | kjw3 `bluff` (empty chamber) |

## Verification (one line per check)

| Check | Result | Gap |
| --- | --- | --- |
| Text-length pre-scan (`prescan.mjs`, T1) | `.py` first pass: 8 offenders over 200 listed at once (line 91 etc.); rebuilt JSON clean | |
| Presence preflight, prefix `kj3l.` | 0 blockers; Stone, Cohen, Azik (relocate in `walk`, `withdraw`, `history`), guide, Rozanne and Dunn `PLACED_BY_ARRIVAL_ACT`; warnings: weak DUPLICATE_PLACE only | static check only |
| Native route, headless Chrome, fresh origin, KJ3K checkpoint seed, pinned bundle (T4 runner) | Passed on run 2: 14 intents, money 2754 -> 2748 -> 2744, 0 page errors, 468.8 s wall | no 14/21 px captures |
| Literal Export/Import | Position (flat), money 2744, KJ3K `job.story.told` and `revolver.loaded.five`, KJ3J `university.withdraw.planned` and all new facts preserved | |
| Leak asserts | Stone, Cohen, Azik know no Nighthawk, Beyonder, revolver, Blackthorn or Seventh text; Rozanne's new keys hold no tail, follow, cathedral or watch text | |

Not run: full `npm test`, bundle build, 14/21 px captures, human play-through, civil clock, chain replay of earlier runners.

## Timing and corrections

- Source and brief read (estimates): about 25 minutes (workflow, receipt, builder, brief, text). Authoring: about 20 minutes. Native proof: two runs, run 1 about 5.5 minutes to a block, run 2 468.8 s.
- Late correction (1): run 1 stopped at `confession` because the badge requirement was written as a fact (`actor.book.lotm.kj3i.kit.badge`), but KJ3I stores the badge as a knowledge key; changed to `knowledge.book.lotm.kj3i.kit.badge.seen`, the pack rebuilt from `cast-before.json`, and the whole route rerun.
- Clock: `walk` carries 720 minutes of labelled fill for Friday night; no hour fact is set. The text's morning and afternoon greetings (ch24 P055, ch26 P022-P023, P070) stay as written. Hour of day is not stated.
- Defects: none beyond the above. Boot/import counts of the green run: 2 boots and 1 import.

## Next

kjw3 from ch26 P069 (KJ3M receipt). Start money 2744, position the flat, Benson not placed.
