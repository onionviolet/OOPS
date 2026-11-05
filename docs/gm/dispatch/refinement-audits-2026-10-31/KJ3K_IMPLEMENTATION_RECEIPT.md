# KJ3K implementation receipt: the cane, the change problem and the smaller celebration

2026-11-02. Window kjw1 of the KJ3 sweep. **Agent-verified, not human-reviewed (AD43).** Not committed, not installed, no personal save touched. Content-only: the run used KJ3E's pinned bundle (`919b17d3…`, unchanged; the repo `dist/bundle.js` was not used). Pack sha256 `8159096e…`, revision `cast-reviewed-kj3k-b69711e85082066b` (carries KJ3F-KJ3K). Private files: `docs/research/novels/lord-of-mysteries/private/kj3k-ch23-2026-11-02/`.

## Scope and source

English v1 ch23 P001 - ch24 P033 (official edition, sha256 `395c9d9f…`), read from sweep shard 2. Six deep intents, nothing folded: `change`, `cane`, `pay`, `drill`, `dinner`, `errand`. Next boundary: ch24 P034 (kjw2, the university withdrawal).

| Decision | Basis |
| --- | --- |
| Reused pack places and roles, no new ones | Zhotelan Avenue = Zouteland Avenue; "Welker clothing shop" = Wilker Clothing and Hats (translation variants); roles shop-assistant and shop-cashier added to `requiredPeople` |
| Place acts run where the player stands | `change` sits at the stairs and relocates to the avenue; `cane` sits on the avenue and relocates into the shop |
| One non-player relocation per act | cashier in `change`, assistant in `cane`, Melissa in `drill`, Melissa to Iron Cross Street in `errand`; three visits (cashier and assistant until `pay`, Melissa until `errand`) |
| Native money by costs | `pay` -90 (cane) and -6 (fare); `errand` -27 (24 pence of notes plus an assumed 3 pence of coppers) |
| Cane is a fact and note, not an inventory item | Inventories asserted unchanged |
| Melissa and staff hold only what was said in front of them | Runner asserts no Nighthawk, Beyonder, way-home, revolver or church text in Melissa's new keys, none of revolver/Nighthawk/Beyonder in staff knowledge |

## What each intent withholds and who reads it later

| Intent | Withheld | Later reader |
| --- | --- | --- |
| `change` | The revolver left home out of fear the Nighthawks would take it (player-only note) | `drill` (loads it); kjw2 range scene |
| `cane` | Nothing told to anyone; the cane's weight and price are Klein's own | `pay`; ch25+ armed scenes |
| `pay` | That Klein owns an unpermitted revolver; the staff see only a cane swing | kjw2 onward where firearm law matters; fact `firearm.law.learned` |
| `drill` | Loaded state is private; ten or thirty rounds are not claimed (five demon-hunting, sixth empty) | kjw2 Dunn/range scenes; `revolver.loaded.five` |
| `dinner` | Nighthawks, Beyonders, the confidentiality promise, the revolver, his reason (a way home); the withdrawal | ch24 P034 withdrawal (`university.withdraw.planned`); any scene where Melissa meets colleagues |
| `errand` | The same private reasons (player-only note); the copper count | kjw2 (money 2760 carried); kjw3 dinner and home scenes |

Pinned fact keys set, prefix `book.lotm.kj3k.`: `change.problem.seen`, `cane.shop.entered`, `cane.bought`, `change.received`, `home.counted`, `revolver.loaded.five`, `job.story.told`, `advance.reason.move`, `celebration.smaller`, `errand.sent`; extra: `discount.refused`, `staff.wary`, `firearm.law.learned`. The KJ3J key `treat.melissa.tonight` was not altered; `celebration.smaller` records its closing.

## Verification (one line per check)

| Check | Result | Gap |
| --- | --- | --- |
| Text-length pre-scan (`scripts/lotm_slice/prescan.mjs`) | Python file: only two unpacked review strings over 200; reviewed JSON clean | |
| Presence preflight, prefix `kj3k.` | 0 blockers; assistant, cashier and Melissa `PLACED_BY_ARRIVAL_ACT`; warnings: weak DUPLICATE_PLACE (Hotel), Melissa in other visits (ended) | static check only |
| Native route, headless Chrome, fresh origin, KJ3J checkpoint seed, pinned bundle | Passed on run 2: six intents, money 2883 -> 2787 -> 2760, 0 page errors, 151 s | no 14/21 px captures |
| Literal Export/Import | Position (flat), money 2760, KJ3J `treat.melissa.tonight` and `university.withdraw.planned`, KJ3I `leonard.met` and all new facts preserved | |

Native money at the end is exactly 2760, as planned. It rests on the assumed 3 pence of coppers (the text does not state the count).
Not run: full `npm test`, bundle build, 14/21 px captures, human play-through, civil clock.

## PF13 comparison point (not a speedup claim)

| | KJ3J | KJ3K |
| --- | --- | --- |
| Intents | 5 | 6 |
| Runner executions to green | 1 | 2 |
| Late corrections | 0 | 1 |
| New actors / places | 0 / 0 | 0 / 0 (two existing roles enrolled) |

- Source read: about 4 minutes. Authoring: about 25 minutes, including one pack restore and rebuild. Native proof: two runs, the first a 5-minute timeout, the second 151 s.
- Late correction (1): run 1 timed out because a place act is only offered where the player stands, and `change` and `cane` were authored at their destinations. Fixed by moving their places to the origin (stairs, avenue) and relocating on completion; the cast pack was restored from `cast-before.json` and rebuilt. The text-length pre-scan caught six offenders in one pass before any builder run.
- Boot/import counts of the green run: 2 boots and 1 import. Run 1 failed before import.
- Defects: none beyond the above. The `gen-runner` output needed a hand patch for money and Melissa-key leak assertions (Melissa already holds an older note naming the Nighthawk invitation, so a whole-knowledge regex cannot be used for that word).
- Clock note: hours are not stated; authored minutes are fill.

## Next

kjw2 from ch24 P034. Start money 2760 (assumed); first act places the player at the flat.


## Content reconciliation B488: preserved scope and later evidence

Historical six-intent consumer and authored currency fill under AD36/AD42/AD43. Preserve place aliases as translations/reused identities, and the repaired action origin versus destination distinction: an offered act starts where the player stands and moves on completion. One non-player relocation per act is a workaround, not an established cause/fix for KJ3E's freeze. Source-qualified purchase/fare costs and known private/public facts remain separate from banknote denominations, created item stock or full firearms behavior. Cane bought/loaded-round facts are knowledge/state markers here; inventories are asserted unchanged, so the cane is not a native usable inventory item.

The native arithmetic is internally consistent:2883 minus90 minus6 gives2787; minus27 gives2760. However the final27 includes an assumed three coppers, and2760 is therefore authored/assumed, not an exact canonical recovered purse. Keep the24-pence note component, unknown copper count and authored minutes explicit for kjw2 rather than laundering the final balance through an exact test. A changed dinner plan records closure through celebration.smaller while preserving the earlier treat promise key as history. Planned withdrawal and later range/legal consumers are not completed just by withholding/later-reader tables.

The whole-knowledge Nighthawk regex was unsuitable because Melissa already held an older invitation note; final new-key disclosure checks have narrower scope and do not erase that older knowledge. Prescan catches over-length strings, not semantic accuracy or current native line behavior. Two route attempts retain the first origin-place timeout and pack restore/rebuild; the second151-second seeded KJ3J route and literal import establish the named bundle/pack continuation. No font captures, civil-clock, ordinary-start, human or current shared-dist proof is added. The full receipt was read; private source, pack and runtime were not.
