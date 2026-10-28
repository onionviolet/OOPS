# L3 checkpoint: LOTM cast records, 2026-10-28

Status: source-bound data authored and structurally verified, not integrated gameplay. Agent-verified, not human-reviewed. Civil-day binding remains unresolved as described below. No host, start profile, save, registration, commit or push change.

Authority: [L3 brief](L3_CAST_RECORDS_BRIEF.md), [L2b output](L2B_CHECKPOINT.md), [L1 crosswalk](L1_CHECKPOINT.md), and [plan](../CAST_LIVES_PLAN_2026-10-28.md) sections 2, 3.1, 8, 9, 12-14. Applied: WA5, WA22-WA24, WA35, proposed WA43, PL-A46, CL2, CL24-CL25, CL86, LP9, AR1-AR16, AD36, AD41. CL110 keeps this lane data-only.

Writer reservation and release: this lane created only `src/book_world_lotm_cast.js`, `tests/book_world_lotm_cast.test.js`, and this checkpoint. The source and test paths were absent at entry. The shared checkout had unrelated dirty work, which was preserved. These three paths are now released to the coordinator. Observed HEAD during final checks: `3b99d046dc5b1c3fa3802c09e9fbe2f22eec1a70`; this is a shared-tree observation, not a frozen combined candidate.

## D1. Data and import contract

- Export: `LOTM_CAST`, `validateLotmCast()`, `lotmAnchorProbes()` from the owned source module. Pure data and validation through existing `cast_schedule` and `beat_records`; zero registration lines, core-owner changes or save fields.
- IDs remove the crosswalk preparation marker `new:`; `indexId` preserves the worksheet identity. Place aliases carry independently checked locators. L4 must resolve the alias table before using an imported source address. Anchor-only addresses are lint references, not travel destinations.
- Principals rank by present plus partial counts, keeping the household. The two remote members remain M1. Named/individual recurring people rank next with source-id tie breaks; explicit service roles get schedule-only records, and crowds stay M1. Earl Hall takes the final principal slot by the tied count; his two remote scenes do not move him to Tingen.
- Three additional place/role records cover the clothing assistant, cashier and inferred market seller. They are roles, not newly invented named people. The source identifies the young investigator with Leonard at chapter 21 paragraph 70: `sameActorAs` joins that role to Leonard and schedules one body.
- Roselle carries a historical-reference record, without a present-week body schedule. Empty relation/knowledge/aim lists mean no verified row was imported, not a negative fact about that person. The two remote members have address-only M1 references and dated source-order whereabouts, with no arcs.

## D2. Timing, fills and forward anchors

Day 1 is the first scene by the brief. Clock statements, the stated June 30 interview, the four-day Monday countdown and the proposed Monday 15:00 gathering are retained separately in `clockClaims`. They do not by themselves establish the midnight boundary between the initial night and dawn. The pack keeps the remaining civil-day mapping as `U` with the slice window `[1,7]`; it does not turn source order into invented exact days. The time model is `U`, default Ordinary (CL24).

All canon schedule rows are `irregular`: their source-order window, clock band and locator are retained, but no automatic phase is asserted. Unknown end times and the general weekday/rotation phase are not canon. All eight role-hour fills state their mechanism and basis. Three anchorless service fills (baker, street vendors, bar owner) are bounded daily proposals through day 7. The five fills for actors with undated forward anchors remain irregular, so they cannot relocate someone before a later appearance. `until: 7` prevents the slice from projecting routines indefinitely.

Every worksheet forward anchor for every recorded actor is retained (38). All are undated. The lint probes every possible slice day and each schedule boundary, conservatively; those probes are possible times, not claimed dates. Twenty missing crosswalk addresses use opaque unresolved lint addresses. No later-volume fact or knowledge is imported from those anchors. The negative test activates a contradictory office fill and confirms that the lint catches it.

Each principal beat is in `beat_records` shape, with actor, place, effect, provenance and source-order window. The initial scene fixes day 1. Other beats require `lotm.cast.window.<scene>` facts before they can settle, so an unset date cannot replay every scene on day 1. `dayIndex: 1` / `until: 7` on those rows is an eligibility window, not an asserted canon day. L4 must bind a date and narrow that window, then supply its fact on that date; this lane does not choose the binding. Knowledge and relation `since` windows mark first verified source checkpoints, not invented acquisition dates.

Cheat-space beats require `lotm.cheat-space`; dream guidance and the spirit examination have separate mechanism requirements. The dream beat has `realm: dream` and `bodyPlacement: false`. The resolver test confirms that an absent mechanism blocks its own beat even after its date is bound. Effects are fact-map event markers, not a claim that this data module spends money, issues inventory or moves a body.

## F1. Coverage

| Tier or surface | Count |
| --- | ---: |
| principal | 8 |
| recurring | 12 |
| role | 16 |
| Concrete slice places | 28 |
| Anchor-only address references | 16 |
| Checked place aliases | 18 |
| Schedule rows | 77 |
| Arc beats | 84 |
| M1-only worksheet queue below | 108 |

Presence counts remain worksheet counts for ranking, not corrected physical-presence claims. Klein also receives the implicit lead-POV scenes omitted by the explicit touched/present worksheet count. Benson has zero on-scene beats: all three worksheet scenes mention an absent brother; his trip destination stays unplaced.

| Principal | Present | Partial | Beats |
| --- | ---: | ---: | ---: |
| `lotm.person.klein-moretti` | 26 | 0 | 55 |
| `lotm.person.dunn-smith` | 13 | 0 | 15 |
| `lotm.person.melissa` | 6 | 2 | 6 |
| `lotm.person.luo-shan` | 4 | 0 | 4 |
| `lotm.person.benson` | 1 | 2 | 0 |
| `lotm.person.bichi-montbatten` | 2 | 0 | 1 |
| `lotm.person.dai-li` | 2 | 0 | 1 |
| `lotm.person.hall-father` | 2 | 0 | 2 |

| Row collection | S | T | I | U | fill |
| --- | ---: | ---: | ---: | ---: | ---: |
| people | 35 | 0 | 1 | 0 | 0 |
| references | 2 | 0 | 0 | 0 | 0 |
| places | 28 | 0 | 0 | 16 | 0 |
| placeAliases | 18 | 0 | 0 | 0 | 0 |
| schedule | 65 | 3 | 1 | 0 | 8 |
| beats | 84 | 0 | 0 | 0 | 0 |
| anchors | 0 | 0 | 0 | 38 | 0 |
| remoteWhereabouts | 2 | 0 | 0 | 0 | 0 |
| clockClaims | 6 | 3 | 0 | 0 | 0 |
| relations | 10 | 11 | 0 | 0 | 0 |
| knows | 2 | 9 | 3 | 0 | 0 |
| wants | 0 | 9 | 0 | 0 | 0 |

Labels in this table concern the claimed content. Timing windows and `since` carry their own `U`; source-confirmed content is not upgraded to an exact date.

## F2. PL-A46 rejected input claims

Rows lack individual IDs in several worksheet collections; the stable references below use entity/collection, scene ID and locator. Rejected fields were not copied. Other independent claims from the scene can still produce a cited beat.

| Input row or field ID | Rejected claim and evidence |
| --- | --- |
| `benson/scenes/004`, `104`, `304` | Present body in the flat/bakery. Chapter 3 p19 and chapter 4 p54-55 place him on a business trip; chapter 10 p19 mentions him as a source of past information. |
| `melissa/scenes/004`, `107` | Present in the recollection or shopping scene. Chapter 3 p9-10 precedes her waking; chapter 5 p53 describes the lead buying food for her. |
| `luo-shan/scenes/801` | Present at the briefing. Chapter 19 p18 does not place her there; chapter 20 p28-29 shows her being summoned afterwards. |
| `luo-shan/scenes/704/place` | At the contract desk. Chapter 17 p8 and p31 verify reception and escort; chapter 17 p53-56 places the subsequent meeting in the duty room. |
| `bichi-montbatten/scenes/305` | Still in the room during chapter 11 p6 speculation. Chapter 11 p10-12 shows the officers leaving; there is no separately verified action for him in that scene. |
| `dai-li/scenes/409/present` | With the departing pair at chapter 14 p88. Her examination ends and she requests rest at p85-86; the next passage follows Dunn and the lead. |
| `main.801/place`, `main.802/place` | Lead bedroom as the briefing/requisition location. The independently stated duty room is chapter 17 p53-56 and chapter 20 p64. These incorrect place rows are excluded from aliases. |
| `main.108`, `109`, `110`, `111` / afternoon fields | Their cited chapter 5 p58 / p84 and chapter 6 p36 / p44 do not state afternoon. Chapter 9 p18 has a later 12:30 waking after sleep. No afternoon schedule is imported from these fields. |
| `main.303/read` at chapter 9 p45 | That paragraph is a resolution to seek supernatural knowledge, not reading notes. The beat records that resolution; the unsupported reading-at-p45 claim is dropped. |
| `main.703/bet` at chapter 16 p128 | This locator supplies an address, not a placed wager. No betting effect is imported. |
| `oyster-seller/whereabouts` at chapter 12 p9 | A dream-interview room does not place a real vendor there. The separate source-verified street role comes from chapter 4 p35. |
| `klein-moretti/wants` at chapter 1 p45 (four entries) | Biography does not state these aims there. Only independently verified aims at chapter 2 p74 and chapter 9 p7 are imported. |
| `melissa/wants` at chapter 2 p37 (two entries), chapter 9 p27 | The cited passages do not support the attributed aims. Her mechanical ambition is separately stated at chapter 3 p16. |
| `dunn-smith/wants` at chapter 12 p13 (three entries), chapter 15 p3 | The attributed bundle of aims is not established by those paragraphs. Only the independently stated examination and job invitation are imported. |
| `dai-li/wants` at chapter 14 p18 (two entries) | The greeting does not state a wish for rest or an aim labelled curiosity. Rest is independently stated at chapter 14 p85. |
| `luo-shan/wants` at chapter 17 p15, chapter 22 p1 | Appearance/greeting does not support the attributed aims. Her conditional interest in a power is separately stated at chapter 22 p58. |
| `hall-father/wants` at chapter 8 p79 | Entering a room does not state a public-pride plan. No explicit want is fabricated. |
| `bichi-montbatten/knows` at chapter 10 p15 | The doorway introduction does not establish a death report as his knowledge. The new record retains his heard response to the memory-loss claim at p71. |
| `dunn-smith/knows` at chapter 22 p31 | Luo Shan reporting a sequence does not date Dunn learning it. Observer knowledge is not transferred to another person. |

## F3. Unplaced and folded worksheet places

Named-room, desk, bedroom and school variants are folded through `placeAliases`, with the supporting paragraph for each join. No alias turns the incorrect chapter 19-20 bedroom claim into a valid room. `lead's dream` is not a physical place; the dream beat carries its realm and mechanism. `unspecified` and `unknown` are skipped as non-addresses. Benson's distant/away-on-business variants remain unplaced rather than becoming an invented destination. Generic outdoors, route and unstated-post variants are not promoted to travel nodes. The remaining raw place IDs stay in the queue below for later source review.

## Inputs and checks

Private input root: `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/`. Worksheets: `cast-worksheets/`; crosswalk/merged rows: `merged-cast-2026-10-28/`. The module has no private-file dependency.

| Merged input | SHA-256 |
| --- | --- |
| `registry.jsonl` | `c09d5e85d31033c1bba9f9704b22662e9e795e2f66e628c31457249e1aca691b` |
| `scenes.jsonl` | `67db2b769c1cb922f66ece05e41e3f9c2ce179267daec5b38c5eb808af45c2a7` |
| `extras.jsonl` | `e2c0ef67413be109c8a2b368ece4baf7a8b0d2cad0560bc2947ca6c8693d31fe` |
| `crosswalk.json` | `209fe613ba879df10c335b1c7bf1662d5d71784503e842a28e3a7fb86eea787f` |

- Local `cite_paragraphs.mjs --id lotm.person.klein-moretti --context 2 --max 180` and `--topic hours|bells|clocks|office|school --context 2 --max 75`, both with the L1 merged directory: PASS, no missing cited paragraphs in those calls; whole-book output was filtered to the selected slice for authored facts. Additional bounded reads used the same `shardIndex` API against exact selected locators. No paid call or external source used.
- `node --test tests/book_world_lotm_cast.test.js`: PASS, 5/5 on final source; covers provenance, row validation, all-actor anchor lint with an adversarial fill, bounded service hours, missing mechanisms, unresolved dates, absent people and invalid input regressions. Gap: no integrated host or browser claim.
- `npm run check:arch`: PASS; zero new cycles; baseline remains 205 cyclic edges / 6 grandfathered main imports. Core-owner growth: main -30, display -37, save 0 relative to their existing baselines. Gap: this is the shared live tree, not a frozen integration candidate.
- Local SHA-256 comparison of the four merged inputs with `LOTM_CAST.sourceIdentity`: PASS, all match at final review. Gap: future rereads require new input identities.
- `python3 - <<'PY'` final input-hash, locator-range and owned-path whitespace scan: PASS; all four input hashes match, every authored fact locator is in chapters 1-24, and `git diff --no-index --check /dev/null <owned-path>` reports no diagnostics for all three paths. Later locators are confined to forward-anchor references. Gap: structural/provenance checks do not prove gameplay.

Final checked source SHA-256: `d63c91a4b2be55f4973de2969f1bbb5c50c3224aa280c6834eb3d7a3f4a59dbe`.
Focused test SHA-256: `1767bfb4b685226671a3bf6083a40d50f83fb158ddb3015e006a043ca577a421`.

Full `npm test`, build, rules check and playable/browser/persistence proof belong to the coordinating integration lanes. No equivalent full suite was run here. No commit was attempted; the coordinator owns committing these paths.

## L4 handoff

L4 must settle or explicitly author the civil-day mapping, bind source windows, choose duty rotation phases against the retained anchors, and then integrate the existing schedule and beat readers. The current data deliberately does not claim three dated canon beats run autonomously. Only the initial anchor scene settles without supplied timing facts. The service fills are proposals and the remaining role hours are inactive. The start/continuity and additive save decision remain L4's scope under CL110. Browser, Save/reload/Export/Import and the AD43 floor remain integration work; this checkpoint is data verification only.

## Remaining worksheet identities (M1 queue, no promoted cast life)

This inventory lists every worksheet not represented by a promoted person, concrete slice place or checked place alias. The remote two remain here intentionally. Counts are the L2b present/partial counts, not a claim of physical co-location. Items were outside L2b's person/place/organization worksheet universe and remain with L1/CL86; no item instance is created here.

| Index ID | Kind | Present | Partial |
| --- | --- | ---: | ---: |
| `lotm.organization.night-watch` | organization | 3 | 1 |
| `lotm.organization.police` | organization | 2 | 1 |
| `lotm.organization.admiralty` | organization | 0 | 1 |
| `lotm.organization.augustus-house` | organization | 0 | 1 |
| `lotm.organization.backlund-gun-institute` | organization | 0 | 1 |
| `lotm.organization.cabinet` | organization | 0 | 1 |
| `lotm.organization.church` | organization | 1 | 0 |
| `lotm.organization.clerical-staff` | organization | 1 | 0 |
| `lotm.organization.coal-steel-consortia` | organization | 0 | 1 |
| `lotm.organization.conservative-party` | organization | 0 | 1 |
| `lotm.organization.cult-unnamed` | organization | 1 | 0 |
| `lotm.organization.hall-family` | organization | 0 | 1 |
| `lotm.organization.house-of-commons` | organization | 0 | 1 |
| `lotm.organization.import-export` | organization | 0 | 1 |
| `lotm.organization.pirate-generals` | organization | 0 | 1 |
| `lotm.organization.pirate-kings` | organization | 0 | 1 |
| `lotm.organization.prizzle-ship-institute` | organization | 0 | 1 |
| `lotm.organization.royal-family` | organization | 1 | 0 |
| `lotm.organization.royal-navy` | organization | 1 | 0 |
| `lotm.organization.royal-shipyards` | organization | 0 | 1 |
| `lotm.organization.shipbuilding-committee` | organization | 0 | 1 |
| `lotm.organization.tarot-council` | organization | 1 | 0 |
| `lotm.person.audrey-hall` | person | 5 | 0 |
| `lotm.person.alger-wilson` | person | 4 | 0 |
| `lotm.person.children` | person | 1 | 1 |
| `lotm.person.black-armoured-knights` | person | 1 | 0 |
| `lotm.person.clowns` | person | 1 | 0 |
| `lotm.person.ghost-ship-captain` | person | 1 | 0 |
| `lotm.person.ginia-designer` | person | 0 | 1 |
| `lotm.person.guards` | person | 1 | 0 |
| `lotm.person.maids` | person | 1 | 0 |
| `lotm.person.ministers` | person | 1 | 0 |
| `lotm.person.mps` | person | 1 | 0 |
| `lotm.person.nobles` | person | 1 | 0 |
| `lotm.person.palas-nigen` | person | 0 | 1 |
| `lotm.person.prime-secretary` | person | 1 | 0 |
| `lotm.person.princes-group` | person | 0 | 1 |
| `lotm.person.princess` | person | 1 | 0 |
| `lotm.person.queen-consort` | person | 1 | 0 |
| `lotm.person.quentin-cohen` | person | 1 | 0 |
| `lotm.person.royal-navy-commander` | person | 1 | 0 |
| `lotm.person.sailors` | person | 0 | 1 |
| `lotm.person.sedes-tailor` | person | 0 | 1 |
| `lotm.person.ship-crew` | person | 0 | 1 |
| `lotm.person.ship-first-mate` | person | 0 | 1 |
| `lotm.person.ship-second-mate` | person | 0 | 1 |
| `lotm.person.susie-dog` | person | 0 | 1 |
| `lotm.person.tenants` | person | 0 | 1 |
| `lotm.place.prizzle-port` | place | 1 | 1 |
| `lotm.place.apartment-building` | place | 1 | 0 |
| `lotm.place.apartment-washroom` | place | 1 | 0 |
| `lotm.place.backlund` | place | 0 | 1 |
| `lotm.place.backlund-university` | place | 0 | 1 |
| `lotm.place.city-wharf` | place | 0 | 1 |
| `lotm.place.earth` | place | 0 | 1 |
| `lotm.place.empty-island` | place | 0 | 1 |
| `lotm.place.grey-fog-world` | place | 1 | 0 |
| `lotm.place.hoy-university` | place | 1 | 0 |
| `lotm.place.loen-kingdom` | place | 0 | 1 |
| `lotm.place.narcissus-street` | place | 1 | 0 |
| `lotm.place.pelican-street` | place | 0 | 1 |
| `lotm.place.queen-district` | place | 0 | 1 |
| `lotm.place.royal-naval-base` | place | 1 | 0 |
| `lotm.place.second-floor` | place | 0 | 1 |
| `lotm.place.temple-hall` | place | 1 | 0 |
| `lotm.place.wardrobe-six` | place | 0 | 1 |
| `lotm.place.white-rose-district` | place | 0 | 1 |
| `lotm.place.zhotelan-avenue` | place | 1 | 0 |
| `lotm.place.zotran-street-36` | place | 1 | 0 |
| `Awwa County (public role)` | place | 0 | 0 |
| `Hound tavern, Bessik Street` | place | 0 | 0 |
| `Klein's apartment room (unnamed in shard)` | place | 0 | 0 |
| `Night Watch office corridor (unnamed)` | place | 0 | 0 |
| `Tingen University (academic meeting)` | place | 0 | 0 |
| `Tingen University (academic meeting; place not clearly stated)` | place | 0 | 0 |
| `Tingen University office` | place | 0 | 0 |
| `Welch's residence (unnamed)` | place | 0 | 0 |
| `away from home (unnamed)` | place | 0 | 0 |
| `away on business (no place given)` | place | 0 | 0 |
| `busy street route` | place | 0 | 0 |
| `circus fortune tent at the square` | place | 0 | 0 |
| `distant place (unstated)` | place | 0 | 0 |
| `family apartment near Iron Cross Street` | place | 0 | 0 |
| `front door of the Moretti home` | place | 0 | 0 |
| `his rented apartment with a shared washroom` | place | 0 | 0 |
| `home` | place | 0 | 0 |
| `home (unstated)` | place | 0 | 0 |
| `import-export company (unnamed in shard)` | place | 0 | 0 |
| `lead's dream` | place | 0 | 0 |
| `lotm.place.docks-district` | place | 0 | 0 |
| `lotm.place.range` | place | 0 | 0 |
| `lotm.place.reference-573545e9e8ec2bbbb7f3` | place | 0 | 0 |
| `lotm.place.silver-crown-restaurant` | place | 0 | 0 |
| `lotm.place.sunia-sea` | place | 0 | 0 |
| `lotm.place.university-district` | place | 0 | 0 |
| `meat and vegetable market one street away from the bakery` | place | 0 | 0 |
| `office (unnamed)` | place | 0 | 0 |
| `outdoors (unnamed)` | place | 0 | 0 |
| `outside the flat (unnamed)` | place | 0 | 0 |
| `police carriage (no id)` | place | 0 | 0 |
| `routes between the Welch residence and his home` | place | 0 | 0 |
| `stairs below the Night Watch office (unnamed)` | place | 0 | 0 |
| `street near the family apartment` | place | 0 | 0 |
| `the block around the flat (unnamed)` | place | 0 | 0 |
| `unknown` | place | 0 | 0 |
| `unspecified` | place | 0 | 0 |
| `unspecified (decoding sessions)` | place | 0 | 0 |
| `unstated post` | place | 0 | 0 |
