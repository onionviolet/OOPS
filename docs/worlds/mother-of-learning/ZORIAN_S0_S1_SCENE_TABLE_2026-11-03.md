# Zorian S0 and S1: scene table for G11, G12 and the actor-per-verb check (proposal, 2026-11-03)

Proposal under AD32; nothing accepted, nothing built, nothing run in the game. Closes the three items the
[stage record](ZORIAN_S0_S1_STAGE_RECORD_2026-11-03.md) left open: G11 (canon-pull anchors), G12 (locked options, never counted) and the
LATER/DELEGATE actor-per-verb list. Rules applied: [plan](ZORIAN_PLAYTHROUGH_PLAN_2026-11-03.md) (ST13 on-path/off-path, ST15 locked options),
[P2b](ZORIAN_P1_P2_PAPER_TEST_2026-11-03.md#p2b-what-actor-binding-costs-read-by-script-over-the-pack-object-2026-11-03-not-run-in-the-game).
Evidence words: *counted* (script over files), *read* (file opened), *rule* (a hand-written pattern in the script), *judgment* (me, from the text).
Nothing here is "verified in the game", and no row says the Zorian seat "exists": no seat is built (G1).

**Sealed scenes.** 19 S1 scenes carry `sealed`: 00503, 00608, 00612, 00613, 00615, 00801, 00901-00909, 01107, 01204, 01205, 01207 (beat suffix
`CCCNN`, prefix `lr.mol.main.`). They appear by beat id and counts only: no place, verb, option or people names, no command ids, and a date
text is shown only when it is a plain `L?-D?` value. Their truth is not restated anywhere in this file.

## How this was made

- **Script:** [`scripts/lead_run/zorian_scene_table.mjs`](../../../scripts/lead_run/zorian_scene_table.mjs) reads the merged reading
  `private/wb8-merged-2026-10-30/scenes.jsonl` (main checkout, gitignored) and the pack's `native.definitions.commands` (84 ids, counted; P2b said 82, which
  was a pattern count). It rewrites only the generated blocks below; the prose is hand-written. Rerun: `node scripts/lead_run/zorian_scene_table.mjs`.
- **Check:** [`scripts/lead_run/check_zorian_scene_table.mjs`](../../../scripts/lead_run/check_zorian_scene_table.mjs) counts rows (105 in section 1 and in G11), compares
  place and step count of every non-sealed row with the scene file, spot-checks ten rows, and confirms no sealed row carries its place, verb or option text.
- **Rows kept:** beat ids matching `lr.mol.main.001..013` + two digits: 105 (S0 c1-c4 = 5+7+8+4 = 24; S1 c5-c13 = 13+15+6+4+9+9+7+7+11 = 81). Of these, 90 have
  `pov` "lead" and 15 have `pov` "mol.person.zorian-kazinski" (third-person phrasing, mostly c13); both are the lead's scenes.
- **Verb to command mapping** is a rule list over verb text, class and place, first match wins. `match` = same mechanism as the pack command;
  `near` = same family, different content (for example the visitor's lamp-brightness drill standing in for a levitation exercise); no command = `gap (category)`.
  The pack has no travel, rest, class or family command, so those are gaps *in the pack*. I did not open the host's base commands (`src/book_world_mol_*.js`
  or the generic action layer), so "gap" means no `book_mol_pack.js` command, and G17 below asks whether the host already covers movement and rest.
- **Seat reach words** (per scene, over lead verbs only): `exists-for-visitor` if every lead verb has a `match` command; `partial` if any lead verb has a
  `match` or `near` command; `gap` otherwise. The visitor is the only seat, so even `partial` means "a visitor command of the same family exists", not that
  Zorian can run it (82 of the 84 commands are `actorId: "player"`, the other two are NPC rows, and 81 gate on the visitor's three facts, counted here and in P2b).

## 0. Counts

<!-- BEGIN generated:counts -->
| Count | S0 (c1-c4) | S1 (c5-c13) | Total |
|---|---|---|---|
| Scenes | 24 | 81 | 105 |
| Sealed scenes | 0 | 19 | 19 |
| Scenes with non-empty `options` | 14 | 66 | 80 |
| Scenes with at least one untaken ("Not how it happened") option | 14 | 50 | 64 |
| Untaken options | 17 | 56 | 73 |
| Scenes with `date.label` I (inferred) | 0 | 44 | 44 |
| Scenes with `date.label` U (unknown) | 24 | 37 | 61 |
| Scenes with any other date label | 0 | 0 | 0 |
| Scenes whose lead verbs all map to a pack command at "match" | 0 | 0 | 0 |
| Scenes with partial reachability | 9 | 43 | 52 |
| Scenes with gap reachability | 15 | 38 | 53 |
| Steps (verbs) in the scenes | 81 | 220 | 301 |
| Verbs performed by the lead | 80 | 209 | 289 |
| Verbs performed by someone else (named subject) | 1 | 11 | 12 |
| Lead verbs with a pack command (any fit) | 16 | 74 | 90 |
| Lead verbs with no pack command (gap) | 64 | 135 | 199 |
<!-- END generated:counts -->

Reading the counts (counted): no scene reaches `exists-for-visitor`, so the visitor's content does not carry any c1-c13 beat on its own. About a third of lead verbs
have a `near` command, and 26 of those 90 are one command, `control_drill`, standing in for every spell exercise: that is a content gap wearing a mapped label.
**Correction to the stage record:** S1's date labels are 44 `I` (inferred) and 37 `U` (unknown), not 37 and 44; S0 is all `U` (24). 105 of 105 `dateRef` are
`relative` with `absolute: null`, so no scene has a calendar date from the text.

## 1. Per-scene table: verbs, actors, owner commands, seat reach

Columns: verbs come from `steps` (label and class); `[name]` marks a verb whose subject is someone else; "Others on screen" is `present` minus Zorian, `*` when
that person is the subject of a step; owner command is the pack id without the `book.mol.` prefix with its fit, or `gap (category)`.

<!-- BEGIN generated:table -->
| Beat | Place | Lead verbs (class) | Others on screen (* acts) | Owner command per lead verb | Seat reach |
|---|---|---|---|---|---|
| lr.mol.main.00101 | Kazinski family house, Cirin | 1. wake and wrestle sister off the bed (fight)<br>2. recover textbooks from sister's room (other)<br>3. pack school supplies (other)<br>4. eat porridge warmed by a heat-water spell (rest)<br>5. argue with Mother over caring for Kirielle (socialize) | kirielle, mother | 1. gap (rest-wake)<br>2. gap (family-household)<br>3. gap (family-household)<br>4. meal (near)<br>5. gap (family-household) | partial |
| lr.mol.main.00102 | Kazinski family house kitchen, Cirin | 1. receive academy visit and certification talk (socialize)<br>2. break sealed certification scroll with mana (practice)<br>3. accept housing key keyed to personal mana (other)<br>4. pause elective selection for a break (other) | ilsa | 1. gap (academy-admin)<br>2. gap (academy-admin)<br>3. gap (academy-admin)<br>4. gap (academy-admin) | gap |
| lr.mol.main.00103 | Cirin train station and the train to Cyoria | 1. wait for train among a crowd (rest)<br>2. board train and wait for departure (travel)<br>3. sleep through the Korsa stop (rest)<br>4. decline first-year's request for a magic demonstration (socialize)<br>5. wait by the exit among first-years (travel) | fortov, mother, kirielle | 1. gap (travel)<br>2. gap (travel)<br>3. gap (rest-wake)<br>4. gap (peer-social-or-event)<br>5. gap (travel) | gap |
| lr.mol.main.00104 | Cyoria station, central plaza route, park, bridge, road to the academy | 1. buy bread at the station bakery (trade)<br>2. avoid the stairway of exposed-brain rats (other)<br>3. calm crying girl on the bridge (care)<br>4. levitate sunken bicycle onto the bridge (practice)<br>5. walk toward the academy as rain starts (travel)<br>6. draw ambient mana and levitate an apple (practice) | bridge | 1. bread (match)<br>2. gap (hazard-avoidance)<br>3. gap (unruled-care)<br>4. control_drill (near)<br>5. gap (travel)<br>6. control_drill (near) | partial |
| lr.mol.main.00105 | Cyoria academy grounds, administration building, third-year housing room | 1. test the rain barrier with a hand (appraise)<br>2. walk to the administration building (travel)<br>3. complete admission paperwork (work)<br>4. search for room 115 and housing (travel)<br>5. change clothes and nap (rest) | admin | 1. gap (combat-or-ward-spell)<br>2. gap (travel)<br>3. gap (academy-admin)<br>4. gap (academy-admin)<br>5. guest_room (near) | partial |
| lr.mol.main.00201 | Academy cafeteria | 1. browse restricted library levels (study)<br>2. eat lunch in academy cafeteria (rest)<br>3. talk with Benisek about academy changes and gossip (socialize) | benisek | 1. temporal_study (near)<br>2. meal (near)<br>3. gap (peer-social-or-event) | partial |
| lr.mol.main.00202 | Zorian's room in the academy | 1. return to room and plan reading (study)<br>2. fend off Taiven's job invitation and bet (socialize)<br>3. spend rest of weekend lazing around (rest) | taiven | 1. gap (unruled-study)<br>2. decline (near)<br>3. gap (rest-wake) | partial |
| lr.mol.main.00203 | Essential Invocations classroom | 1. review structured versus unstructured magic and dispelling (study)<br>2. levitate bowls and cast de-illuminator on them (practice)<br>3. ignite paper and try to dispel the flames (practice)<br>4. take notes and receive dispelling essay (study) | akoja, briam, zach, raynie, ilsa | 1. gap (combat-or-ward-spell)<br>2. gap (combat-or-ward-spell)<br>3. gap (combat-or-ward-spell)<br>4. gap (combat-or-ward-spell) | gap |
| lr.mol.main.00204 | history of magic classroom | 1. attend history of magic and magical law class (study)<br>2. receive reading assignment for the week (study) | zenomir | 1. gap (class-lecture)<br>2. gap (class-lecture) | gap |
| lr.mol.main.00205 | training hall | 1. listen to Kyron on combat casting limits (study)<br>2. fire magic missile from spell rod until mana runs out (practice)<br>3. watch Zach fire magic missile repeatedly (study)<br>4. class released early (rest) | kyron, zach, neolu, jade | 1. gap (combat-or-ward-spell)<br>2. gap (combat-or-ward-spell)<br>3. gap (combat-or-ward-spell)<br>4. gap (class-lecture) | gap |
| lr.mol.main.00206 | spell formula classroom | 1. sit a 60-question placement test (study)<br>2. receive 12-book recommended reading and weekly lecture offer (study)<br>3. assign first three chapters for next class (study) | nora | 1. gap (class-lecture)<br>2. gap (class-lecture)<br>3. gap (unruled-study) | gap |
| lr.mol.main.00207 | Xvim Chao's office | 1. show basic three shaping exercises to mentor (practice)<br>2. restart levitation exercise repeatedly under mentor's orders (practice)<br>3. lose focus after a marble strikes (practice)<br>4. accept plan to retrain basic three until flawless (study) | xvim | 1. control_drill (near)<br>2. control_drill (near)<br>3. control_drill (near)<br>4. control_drill (near) | partial |
| lr.mol.main.00301 | warding classroom (unnamed) | 1. finish warding exam after Zach remark (study)<br>2. plan warding self-study (study) | zach, akoja | 1. gap (class-lecture)<br>2. gap (unruled-study) | gap |
| lr.mol.main.00302 | academy corridor | 1. walk and gossip about Zach and Neolu (socialize) | akoja, benisek | 1. gap (peer-social-or-event) | gap |
| lr.mol.main.00303 | alchemy classroom | 1. grind borer wasp husks into powder (craft)<br>2. make magical glue with Benisek's table (craft) | akoja, benisek, azlyn, zach | 1. gap (alchemy-craft)<br>2. gap (alchemy-craft) | gap |
| lr.mol.main.00304 | Ilsa's class (unnamed room) | 1. hear mandatory dance announcement (work)<br>2. accept role in teaching dance with animation spell (work) | akoja, ilsa | 1. gap (peer-social-or-event)<br>2. gap (peer-social-or-event) | gap |
| lr.mol.main.00305 | room six | 1. question the spell method with Ilsa's class (study)<br>2. argue with Benisek over the festival (socialize) | benisek, ilsa | 1. ilsa_meet (near)<br>2. gap (peer-social-or-event) | partial |
| lr.mol.main.00306 | Ilsa's office | 1. meet Ilsa about boycotting the dance (socialize)<br>2. practice levitation exercise with Xvim (study) | ilsa | 1. ilsa_meet (near)<br>2. control_drill (near) | partial |
| lr.mol.main.00307 | residence building corridor | 1. agree to make anti-rash salve for Fortov (socialize)<br>2. gather reagents from room (work) | fortov | 1. gap (alchemy-craft)<br>2. gap (alchemy-craft) | gap |
| lr.mol.main.00308 | alchemical workshop | 1. grind purple creeper leaves wrapped in cloth and leather (craft)<br>2. mix leaf dust with honey and oblia berry juice and heat (craft)<br>3. clean equipment and talk with Kael (socialize) | kael | 1. gap (alchemy-craft)<br>2. gap (alchemy-craft)<br>3. kael_meet (near) | partial |
| lr.mol.main.00401 | Residence building, walk to dance hall, dance hall | 1. walk to dance hall with Akoja (travel)<br>2. slip away from Akoja and mingle through the crowd (socialize)<br>3. endure introductions and dancing with Akoja (socialize)<br>4. name stars and constellations from the dance hall roof (study) | akoja | 1. gap (travel)<br>2. gap (peer-social-or-event)<br>3. gap (peer-social-or-event)<br>4. gap (peer-social-or-event) | gap |
| lr.mol.main.00402 | Dance hall roof, dance hall stairway, dance hall, city streets | 1. watch fireworks from the roof (rest)<br>2. run down into the dance hall to warn the mages (travel)<br>3. cast a locating divination to find Akoja (practice)<br>4. slip out of the hall and run toward the compass needle (travel) | ilsa, kyron | 1. gap (rest-wake)<br>2. gap (peer-social-or-event)<br>3. gap (peer-social-or-event)<br>4. gap (unruled-travel) | gap |
| lr.mol.main.00403 | City streets, then a house upper floor | 1. sneak through the streets in the shadows (travel)<br>2. watch Zach fight war trolls, iron beaks and winter wolves (other)<br>3. follow Zach through the burning streets to Akoja (travel)<br>4. convince Akoja to leave the barricaded house (care)<br>5. receive the teleport rod and push Zach clear of a red ray (fight) | zach, akoja | 1. gap (unruled-travel)<br>2. gap (combat-or-ward-spell)<br>3. gap (peer-social-or-event)<br>4. gap (peer-social-or-event)<br>5. gap (teleport) | gap |
| lr.mol.main.00404 | Street near the house, behind a cart | 1. drag himself behind a cart to shelter from the battle (other)<br>2. watch Zach trade spells with the lich (fight)<br>3. get hurled into Zach by the lich's spell (other)<br>4. lich begins a soul-altering rite on Zorian (ritual) [lich] | zach, lich* | 1. gap (hazard-avoidance)<br>2. gap (combat-or-ward-spell)<br>3. gap (combat-or-ward-spell)<br>4. gap (npc-side) | gap |
| lr.mol.main.00501 | Zorian's room, Cirin | 1. wake to Kirielle's ambush (rest)<br>2. cast light orb (practice)<br>3. direct orb to circle Kirielle (practice) | kirielle | 1. gap (rest-wake)<br>2. control_drill (near)<br>3. control_drill (near) | partial |
| lr.mol.main.00502 | Zorian's room, Cirin | 1. receive academy scroll and channel mana into it (other)<br>2. reenact earlier conversation with Ilsa (socialize)<br>3. reason about whether time travel is possible (study) | ilsa, mother | 1. gap (academy-admin)<br>2. ilsa_meet (near)<br>3. temporal_study (near) | partial |
| lr.mol.main.00503 (sealed) | withheld | 3 verbs: study 2, research 1 | 0 present, 0 acting; names withheld | 0 of 3 lead verbs map to a pack command; ids withheld | gap |
| lr.mol.main.00504 | Zorian's academy room, then academy library | 1. wake and let Taiven in (rest)<br>2. talk Taiven out of the sewer mission (socialize)<br>3. buy a quick bite at a nearby bakery (other)<br>4. search academy library for time-travel texts (research) | taiven | 1. gap (rest-wake)<br>2. decline (near)<br>3. bread (match)<br>4. temporal_study (near) | partial |
| lr.mol.main.00505 | Academy library | 1. sift library texts for time-travel mentions and lich language clues (research)<br>2. abandon library research (other) | - | 1. temporal_study (near)<br>2. gap (unruled-other) | partial |
| lr.mol.main.00506 | Academy classroom | 1. attend Ilsa's review lecture (study)<br>2. scan new arrivals for Zach (other) | akoja, briam, ilsa | 1. ilsa_meet (near)<br>2. gap (peer-social-or-event) | partial |
| lr.mol.main.00507 | Academy | 1. take in report of Zach's disappearance (research)<br>2. pass Nora Boole's surprise tests (study)<br>3. decide not to ask around about Zach (other) | nora | 1. gap (peer-social-or-event)<br>2. gap (class-lecture)<br>3. gap (peer-social-or-event) | gap |
| lr.mol.main.00508 | Xvim's office, academy | 1. levitate pen over palm as the basic three (practice)<br>2. attempt spinning pen variant (practice)<br>3. endure Xvim's thrown marble interruptions (other) | xvim | 1. control_drill (near)<br>2. control_drill (near)<br>3. control_drill (near) | partial |
| lr.mol.main.00509 | Academy library, then history classroom | 1. read book on the pen exercise in academy library (study)<br>2. outline plan for anonymous letters (study)<br>3. brush off Benisek's questions and leave (socialize) | benisek | 1. study_invocation (near)<br>2. gap (letters-post)<br>3. gap (peer-social-or-event) | partial |
| lr.mol.main.00510 | Academy, then academy library | 1. read Neolu's list of books (study)<br>2. check out the books at the academy library (research) | neolu | 1. temporal_study (near)<br>2. temporal_study (near) | partial |
| lr.mol.main.00511 | Cyoria stores and public postal boxes | 1. buy generic paper, pens and envelopes at a poorly tracked shop (trade)<br>2. write letters in a blocky formal hand (craft)<br>3. destroy leftover paper, pens and envelopes (other)<br>4. post letters in public boxes across Cyoria (other)<br>5. wait for any reaction (other) | - | 1. paper (match)<br>2. gap (letters-post)<br>3. gap (letters-post)<br>4. gap (letters-post)<br>5. gap (letters-post) | partial |
| lr.mol.main.00512 | Train leaving Cyoria | 1. take the first train out of the city (travel)<br>2. fall into uneasy sleep on the train (rest) | - | 1. gap (travel)<br>2. gap (travel) | gap |
| lr.mol.main.00513 | Zorian's room, Cirin | 1. wake to Kirielle's ambush (rest) | kirielle | 1. gap (rest-wake) | gap |
| lr.mol.main.00601 | train compartment approaching Korsa | 1. ride train toward Cyoria (travel)<br>2. reason about the restart and the time-travel spell (study)<br>3. consider leaving the train at Korsa (other) | - | 1. gap (travel)<br>2. temporal_study (near)<br>3. gap (travel) | partial |
| lr.mol.main.00602 | train compartment | 1. talk with Byrn about first-year curriculum (socialize)<br>2. feign study of the notebook to discourage talk (other)<br>3. discuss personal research and library options (socialize) | byrn | 1. gap (peer-social-or-event)<br>2. gap (unruled-other)<br>3. gap (unruled-socialize) | gap |
| lr.mol.main.00603 | academy library, information desk | 1. interview with the librarian about employment (socialize)<br>2. accept the library assistant role (work)<br>3. meet Ibery and receive an introduction (socialize) | kirithishli, ibery | 1. library_meet (near)<br>2. catalog_shift (near)<br>3. library_meet (near) | partial |
| lr.mol.main.00604 | academy classroom | 1. attend class without Zach (study)<br>2. reflect on Zach's absence and the invasion (study) | - | 1. gap (class-lecture)<br>2. gap (combat-or-ward-spell) | gap |
| lr.mol.main.00605 | academy library and classrooms | 1. shelve books and learn classification scheme (work)<br>2. practice pen-spinning exercise under Xvim (practice) | - | 1. catalog_shift (near)<br>2. control_drill (near) | partial |
| lr.mol.main.00606 | academy library, information desk | 1. ask Kirithishli for help with book divinations (socialize)<br>2. hand over the coded slip with the chant (research)<br>3. accept the suggestion to seek a language expert (study) | kirithishli, ibery | 1. library_meet (near)<br>2. library_meet (near)<br>3. gap (language-expert) | partial |
| lr.mol.main.00607 | academy, Zenomir's office (I) | 1. request translation help from Zenomir (study)<br>2. show the coded chant to Zenomir (research)<br>3. explain an invented overheard plot (socialize) | zenomir | 1. gap (language-expert)<br>2. gap (language-expert)<br>3. gap (deception-or-warning) | gap |
| lr.mol.main.00608 (sealed) | withheld | 2 verbs: rest 1, other 1 | 0 present, 0 acting; names withheld | 0 of 2 lead verbs map to a pack command; ids withheld | gap |
| lr.mol.main.00609 | lead's room at the academy dormitory | 1. wake from nightmare with Kirielle present (rest)<br>2. breathe and suppress phantom pain (rest) | kirielle | 1. gap (rest-wake)<br>2. gap (rest-wake) | gap |
| lr.mol.main.00610 | lead's room at the academy dormitory | 1. notice shaking hands and calm himself (rest)<br>2. accept Ilsa's teleport offer (travel)<br>3. tell mother he is leaving (other) | ilsa | 1. gap (rest-wake)<br>2. gap (teleport)<br>3. gap (family-household) | gap |
| lr.mol.main.00611 | teleport redirection point, then lead's room at the academy | 1. teleport to the academy with Ilsa (travel)<br>2. ask Ilsa to cast the teleport again (study)<br>3. settle into his room and drop luggage (rest) | ilsa | 1. gap (teleport)<br>2. gap (teleport)<br>3. guest_room (near) | partial |
| lr.mol.main.00612 (sealed) | withheld | 3 verbs: study 1, research 1, rest 1 | 0 present, 0 acting; names withheld | 1 of 3 lead verbs map to a pack command; ids withheld | partial |
| lr.mol.main.00613 (sealed) | withheld | 3 verbs: travel 1, practice 1, rest 1 | 1 present, 0 acting; names withheld | 0 of 3 lead verbs map to a pack command; ids withheld | gap |
| lr.mol.main.00614 | lead's room at the academy | 1. plan electives and personal studies (study)<br>2. plan savings for alchemical supplies (other) | - | 1. gap (academy-admin)<br>2. gap (alchemy-craft) | gap |
| lr.mol.main.00615 (sealed) | withheld | 3 verbs: study 2, other 1 | 1 present, 0 acting; names withheld | 0 of 3 lead verbs map to a pack command; ids withheld | gap |
| lr.mol.main.00701 | Academy classroom (Ilsa's class) | 1. observe Zach's condition (study)<br>2. sit beside Briam to study Zach (study)<br>3. hint at Zach's time travel with a 'pile of bones' remark (socialize) | zach, briam, ilsa, akoja | 1. gap (peer-social-or-event)<br>2. gap (peer-social-or-event)<br>3. gap (deception-or-warning) | gap |
| lr.mol.main.00702 | Academy cafeteria | 1. walk Zach home from class (care)<br>2. eat lunch with Zach in the cafeteria (rest)<br>3. provoke Zach with soul-magic speculation (socialize)<br>4. agree to continue the talk at the fountain (socialize) | zach | 1. gap (peer-social-or-event)<br>2. meal (near)<br>3. gap (deception-or-warning)<br>4. gap (unruled-socialize) | partial |
| lr.mol.main.00703 | Fountain | 1. study fish and fountain condition (study)<br>2. question Zach on time travel and resets (socialize)<br>3. feign confusion over time travel (socialize)<br>4. offer changed electives as cover story (socialize) | zach | 1. gap (unruled-study)<br>2. gap (deception-or-warning)<br>3. gap (deception-or-warning)<br>4. gap (deception-or-warning) | gap |
| lr.mol.main.00704 | Academy corridors and Zorian's room | 1. return to school and field classmates' questions (socialize)<br>2. lock room and think over the day (study)<br>3. plan goals in notebook (research) | akoja | 1. gap (peer-social-or-event)<br>2. gap (unruled-study)<br>3. ongoing_research (near) | partial |
| lr.mol.main.00705 | Academy classroom (Kyron's class) | 1. argue to drop the magic missile lessons (socialize)<br>2. wait while Kyron fetches items (other)<br>3. catch and throw plates for demonstration (practice)<br>4. accept loaned spell rod and booklet (other) | kyron | 1. gap (combat-or-ward-spell)<br>2. gap (unruled-other)<br>3. gap (combat-or-ward-spell)<br>4. gap (combat-or-ward-spell) | gap |
| lr.mol.main.00706 | Library | 1. shelve books and check spell restrictions (work)<br>2. practice magic missile variations in thought (practice)<br>3. discuss library organization with Ibery and Kirithishli (socialize)<br>4. follow Zach out for a meal and talk (socialize) | ibery, kirithishli, zach | 1. catalog_shift (near)<br>2. gap (combat-or-ward-spell)<br>3. library_meet (near)<br>4. meal (near) | partial |
| lr.mol.main.00801 (sealed) | withheld | 3 verbs: practice 2, socialize 1 | 2 present, 0 acting; names withheld | 0 of 3 lead verbs map to a pack command; ids withheld | gap |
| lr.mol.main.00802 | mol.place.academy-cafeteria | 1. talk with Zach in the cafeteria about his claims (socialize)<br>2. recount two weeks of combat practice (practice) | zach | 1. gap (deception-or-warning)<br>2. gap (combat-or-ward-spell) | gap |
| lr.mol.main.00803 | mol.place.ilsa-office | 1. levitate a pen and spin it (practice)<br>2. discuss mentorship and self study with Ilsa (socialize)<br>3. accept a challenge on the variations book (study) | ilsa | 1. control_drill (near)<br>2. ilsa_meet (near)<br>3. study_invocation (near) | partial |
| lr.mol.main.00804 | mol.place.academy-library | 1. read the variations book from the start (study)<br>2. practice vertical levitation (practice) | - | 1. study_invocation (near)<br>2. control_drill (near) | partial |
| lr.mol.main.00901 (sealed) | withheld | 3 verbs: research 2, other 1 | 1 present, 0 acting; names withheld | 2 of 3 lead verbs map to a pack command; ids withheld | partial |
| lr.mol.main.00902 (sealed) | withheld | 2 verbs: travel 1, socialize 1 | 2 present, 0 acting; names withheld | 1 of 2 lead verbs map to a pack command; ids withheld | partial |
| lr.mol.main.00903 (sealed) | withheld | 5 verbs: other 1, craft 3, trade 1 | 2 present, 0 acting; names withheld | 1 of 5 lead verbs map to a pack command; ids withheld | partial |
| lr.mol.main.00904 (sealed) | withheld | 3 verbs: socialize 2, other 1 | 3 present, 0 acting; names withheld | 2 of 3 lead verbs map to a pack command; ids withheld | partial |
| lr.mol.main.00905 (sealed) | withheld | 3 verbs: socialize 1, other 1, travel 1 | 4 present, 0 acting; names withheld | 1 of 3 lead verbs map to a pack command; ids withheld | partial |
| lr.mol.main.00906 (sealed) | withheld | 4 verbs: travel 2, fight 2 | 5 present, 0 acting; names withheld | 0 of 4 lead verbs map to a pack command; ids withheld | gap |
| lr.mol.main.00907 (sealed) | withheld | 2 verbs: travel 1, socialize 1 | 2 present, 0 acting; names withheld | 0 of 2 lead verbs map to a pack command; ids withheld | gap |
| lr.mol.main.00908 (sealed) | withheld | 4 verbs: socialize 1, fight 3 | 1 present, 0 acting; names withheld | 0 of 4 lead verbs map to a pack command; ids withheld | gap |
| lr.mol.main.00909 (sealed) | withheld | 2 verbs: fight 1, other 1 | 2 present, 0 acting; names withheld | 0 of 2 lead verbs map to a pack command; ids withheld | gap |
| lr.mol.main.01001 | Zorian's family home, his room (not named) | 1. shove Kirielle off the bed (other)<br>2. lock himself in the bathroom (other) | kirielle | 1. gap (family-household)<br>2. gap (rest-wake) | gap |
| lr.mol.main.01002 | Train to Cyoria, then road from the train station toward the academy | 1. travel by train to Cyoria (travel)<br>2. cast rain barrier and walk toward the academy (practice) | - | 1. gap (travel)<br>2. gap (combat-or-ward-spell) | gap |
| lr.mol.main.01003 | Academy cafeteria | 1. sit with Benisek and hear the gossip (socialize)<br>2. reflect on the unusual divergence from earlier restarts (other) | benisek | 1. gap (peer-social-or-event)<br>2. gap (unruled-other) | gap |
| lr.mol.main.01004 | Academy and Cyoria, classes and Ilsa's class | 1. skip classes to study Ilsa's book (study)<br>2. master vertical and fixed position levitation (study) | ilsa | 1. ilsa_meet (near)<br>2. control_drill (near) | partial |
| lr.mol.main.01005 | Hill overlooking Cyoria | 1. practice combat invocations learned from Zach (practice)<br>2. travel on foot to a hill overlooking the city (travel)<br>3. observe the invasion stages from the hill (appraise) | - | 1. gap (combat-or-ward-spell)<br>2. gap (travel)<br>3. gap (combat-or-ward-spell) | gap |
| lr.mol.main.01006 | Cyoria: Noveda mansion area, academy and library (summarised) | 1. study Ilsa's book (study)<br>2. research Tesen Zveri in public sources (research) | - | 1. ilsa_meet (near)<br>2. temporal_study (near) | partial |
| lr.mol.main.01007 | Ilsa's office, academy | 1. fill out copy of the class test (study)<br>2. attempt the advanced test (study)<br>3. leave the office after being pushed out (other) | ilsa | 1. gap (class-lecture)<br>2. gap (class-lecture)<br>3. gap (unruled-other) | gap |
| lr.mol.main.01008 | Family home, Zorian's room | 1. cast floating lantern repeatedly for Kirielle (practice)<br>2. peel the scroll seal by channelling mana along its sides (practice) | kirielle, ilsa | 1. control_drill (near)<br>2. control_drill (near) | partial |
| lr.mol.main.01009 | Ilsa's office, academy | 1. argue for a transfer to Ilsa's own teaching (socialize)<br>2. request a permit to skip lectures (socialize)<br>3. choose spell formulas as the private study area (study) | ilsa | 1. ilsa_meet (near)<br>2. ilsa_meet (near)<br>3. study_formula (near) | partial |
| lr.mol.main.01101 | Academy, Nora's classroom | 1. answer second advanced spell formula test (study)<br>2. discuss spell formula theory with Nora (study) | nora, benisek, akoja | 1. gap (class-lecture)<br>2. study_formula (near) | partial |
| lr.mol.main.01102 | Cyoria main train station, then walk into Cyoria | 1. wait for the late train on platform 6 (other)<br>2. push mana at pigeons and sparrows to agitate them (practice)<br>3. carry Kael's luggage with floating disc (travel)<br>4. walk with Kael and Kana toward the city (travel) | kael, kana | 1. gap (travel)<br>2. control_drill (near)<br>3. kael_meet (near)<br>4. kael_meet (near) | partial |
| lr.mol.main.01103 | Academy classroom | 1. talk with Akoja about his absence and Kael (socialize) | akoja, kael | 1. gap (peer-social-or-event) | gap |
| lr.mol.main.01104 | Academy, Nora's workshop classroom | 1. receive compressed beginner's cube assignment (study)<br>2. study compressed spell formula on demonstration cube (study)<br>3. plan to recreate lamp cube before next session (study) | nora | 1. study_formula (near)<br>2. study_formula (near)<br>3. study_formula (near) | partial |
| lr.mol.main.01105 | Xvim's office, Academy | 1. levitate pen and make it glow on Xvim's order (practice)<br>2. combine levitation and glow exercises (practice)<br>3. receive blindfold mana-sensing marble drill (study) | xvim | 1. control_drill (near)<br>2. control_drill (near)<br>3. control_drill (near) | partial |
| lr.mol.main.01106 | Academy and Cyoria | 1. study spell formulas with Nora, including Sunday lessons (study)<br>2. practice Xvim's mana-sensing exercise without much progress (practice) | - | 1. study_formula (near)<br>2. control_drill (near) | partial |
| lr.mol.main.01107 (sealed) | withheld | 2 verbs: rest 1, study 1 | 1 present, 0 acting; names withheld | 0 of 2 lead verbs map to a pack command; ids withheld | gap |
| lr.mol.main.01201 | mol.place.zorian-apartment | 1. receive Taiven and hear her request for a job (socialize)<br>2. drink a sleeping potion to rest (rest) | taiven | 1. taiven_offer (near)<br>2. gap (rest-wake) | partial |
| lr.mol.main.01202 | mol.place.academy-classroom | 1. question Briam about soul bonds and his fire drake (study)<br>2. plan to keep clear of Zach and learn more first (other) | briam, fire | 1. gap (peer-social-or-event)<br>2. gap (peer-social-or-event) | gap |
| lr.mol.main.01203 | mol.place.chess-park | 1. walk the long route across Cyoria toward the park (travel)<br>2. wander the park to reach the meeting place (travel)<br>3. look for the bicycle in the creek under the bridge (other) | cat | 1. gap (travel)<br>2. gap (travel)<br>3. gap (travel) | gap |
| lr.mol.main.01204 (sealed) | withheld | 5 verbs: socialize 1, travel 1, research 1, fight 1, care 1 | 6 present, 0 acting; names withheld | 1 of 5 lead verbs map to a pack command; ids withheld | partial |
| lr.mol.main.01205 (sealed) | withheld | 2 verbs: socialize 1, rest 1 | 1 present, 0 acting; names withheld | 1 of 2 lead verbs map to a pack command; ids withheld | partial |
| lr.mol.main.01206 | mol.place.taiven-home | 1. throw marbles over his shoulders while blind to track aim (practice)<br>2. cast magic missile into a training dummy (practice)<br>3. cast a shield and test it against Taiven's spell rod bolt (practice)<br>4. try the flamethrower and fail to burn the dummy (practice) | taiven | 1. control_drill (near)<br>2. gap (combat-or-ward-spell)<br>3. gap (combat-or-ward-spell)<br>4. gap (combat-or-ward-spell) | partial |
| lr.mol.main.01207 (sealed) | withheld | 3 verbs: study 1, other 1, travel 1 | 0 present, 0 acting; names withheld | 1 of 3 lead verbs map to a pack command; ids withheld | partial |
| lr.mol.main.01301 | Zorian's bedroom | 1. wake to Kirielle's greeting and reflect on short restarts (rest) | kirielle | 1. gap (rest-wake) | gap |
| lr.mol.main.01302 | Zorian's academy room | 1. Taiven pitches a sewer run for Monday (socialize) [taiven]<br>2. Zorian warns Taiven of danger and refuses to join (socialize)<br>3. Taiven storms out angrily (socialize) [taiven] | taiven* | 1. gap (npc-side)<br>2. decline (near)<br>3. gap (npc-side) | partial |
| lr.mol.main.01303 | Zorian's academy room | 1. Zorian claims prophetic visions to deter Taiven (socialize)<br>2. Zorian describes a staged nightmare about sewer spiders (socialize)<br>3. Taiven leaves to go into the sewers anyway (travel) [taiven] | taiven* | 1. gap (persuade-npc)<br>2. gap (rest-wake)<br>3. gap (npc-side) | gap |
| lr.mol.main.01304 | Zorian's room | 1. Zorian warns Taiven about mind-magic spiders in the sewers (socialize)<br>2. Taiven plans to go down with a mind ward (socialize) [taiven]<br>3. Zorian refuses to join the sewer run (socialize)<br>4. Taiven returns to report a failed search with no attack (socialize) [taiven] | taiven* | 1. gap (persuade-npc)<br>2. gap (npc-side)<br>3. decline (near)<br>4. gap (npc-side) | partial |
| lr.mol.main.01305 | Zorian's bedroom | 1. Zorian hugs Kirielle at waking (care) | kirielle | 1. gap (family-household) | gap |
| lr.mol.main.01306 | academy combat magic classroom | 1. Kyron describes mind-magic countermeasures (study) [kyron]<br>2. Kyron proposes resistance training and casts Nightmare Vision on Zorian (practice) [kyron] | kyron* | 1. gap (npc-side)<br>2. gap (npc-side) | gap |
| lr.mol.main.01307 | Zorian's bedroom | 1. Zorian attempts unstructured levitation of Kirielle and fails (practice) | kirielle | 1. control_drill (near) | partial |
| lr.mol.main.01308 | Ilsa's workroom at the academy | 1. Zorian asks Ilsa for a training regimen to levitate a person (study)<br>2. Zorian demonstrates spinning and glowing a shut book without hands (practice)<br>3. Ilsa explains fixed-position levitation limits and shows hand-free control (study) [ilsa]<br>4. Ilsa advises training on small living beings first (study) [ilsa] | ilsa* | 1. ilsa_meet (near)<br>2. control_drill (near)<br>3. gap (npc-side)<br>4. gap (npc-side) | partial |
| lr.mol.main.01309 | Zorian's bedroom | 1. Kirielle pinches and slaps Zorian to rouse him (other) [kirielle]<br>2. Zorian screams at Kirielle, then laughs (socialize) | kirielle* | 1. gap (npc-side)<br>2. gap (family-household) | gap |
| lr.mol.main.01310 | family home bedroom | 1. Zorian tickles Kirielle until mother intervenes (socialize) | kirielle | 1. gap (family-household) | gap |
| lr.mol.main.01311 | family home bedroom | 1. Kirielle asks to go to Cyoria and apologizes for the favor (socialize) [kirielle]<br>2. Zorian agrees to take Kirielle to Cyoria (socialize)<br>3. Zorian goes to the bathroom and notes the mother plan (rest) | kirielle* | 1. gap (npc-side)<br>2. gap (family-household)<br>3. gap (rest-wake) | gap |
<!-- END generated:table -->

Commands that own at least one non-sealed lead verb (rule, with counts):

<!-- BEGIN generated:cmdused -->
control_drill 26, ilsa_meet 10, temporal_study 8, study_formula 6, library_meet 5, meal 4, decline 4, kael_meet 3, study_invocation 3, catalog_shift 3, bread 2, guest_room 2, paper 1, ongoing_research 1, taiven_offer 1
<!-- END generated:cmdused -->

<!-- BEGIN generated:coverage -->
Pack commands: 84 total in `native.definitions.commands`; 15 are the owner of at least one non-sealed lead verb in this table (rule mapping). Unused by this table: 69.
<!-- END generated:coverage -->

<!-- BEGIN generated:sealedline -->
Sealed scenes (19): 57 lead verbs, 11 map to a pack command, 46 do not; categories withheld.
<!-- END generated:sealedline -->


## 2. G12: locked options

**Count (counted):** 80 of the 105 scenes have a non-empty `options` field (S0 14 of 24, S1 66 of 81); 64 scenes have at least one untaken option (the "Not how it
happened" ones); the 73 untaken options are classed below. The other 16 non-empty scenes list only the taken choice. Classes follow ST15: **resolves-by-mechanism**
(an ordinary verb or reply that existing or already-proposed mechanisms settle), **needs-build** (needs a system the pack does not have), **out-of-world** (needs
something the world does not have for him). Per AD38 and WER ST15, an option is not out-of-world because it is unusual.

<!-- BEGIN generated:g12tally -->
| Class | All untaken options | Of which non-sealed (text read) | Sealed (class-only rule) |
|---|---|---|---|
| resolves-by-mechanism | 61 | 54 | 7 |
| needs-build | 12 | 7 | 5 |
| out-of-world | 0 | 0 | 0 |
| Total | 73 | 61 | 12 |
<!-- END generated:g12tally -->

Judgment on the result: **no option is out-of-world in this pass.** Nothing a scene offers needs a thing the world lacks; the closest cases (the teleport rod, a
fight with the lich) are needs-build with a stated outcome fallback, because the death branch is already the restart row (G7). Of the 12 needs-build options, the 7 readable ones split into
two build families: *sewer-run and combat verbs* (00202, 00504, 01302, 01304 and the invasion-night fights 00404, 01005) and *one-shot items* (the teleport rod, 00403).
The rule also flagged five sealed needs-build options by class only (class `fight`, `craft` or `ritual`: 00801, 00903, 00906, 00909, 01204); their detail is withheld. The 61 mechanism options (54 readable, 7 sealed) need
five things, all already on the gap list: the seat and an NPC reply (G1, G4), knowledge and witness records for every "tell Zach / Ilsa / Taiven / Zenomir" option
(G7, G8), the loop and calendar rows for "skip the month" and "leave by train" (G2, G6, G7), study and practice rows (G5), and the persuasion mechanism (G22 below).

<!-- BEGIN generated:g12 -->
| Beat | Untaken option (class) | Class | Why | Basis |
|---|---|---|---|---|
| lr.mol.main.00101 | accept Kirielle's care (care) | resolves-by-mechanism | ordinary social, rest, travel or work verb with an NPC reply (G4) | rule |
| lr.mol.main.00102 | switch to a different mentor (socialize) | resolves-by-mechanism | ordinary social, rest, travel or work verb with an NPC reply (G4) | rule |
| lr.mol.main.00103 | show magic to first-year (practice) | resolves-by-mechanism | visible-magic reaction needs a witnesses/secrecy row; the verb is ordinary practice | judgment |
| lr.mol.main.00104 | wade into the creek for the bicycle (work) | resolves-by-mechanism | ordinary work/travel verb with a wet-and-late consequence; no new system | judgment |
| lr.mol.main.00105 | learn the rain protection spell (study) | resolves-by-mechanism | study or practice verb on the seat (G5) | rule |
| lr.mol.main.00202 | join the sewer run team (work) | needs-build | combat, craft or place mechanism not in the pack | rule |
| lr.mol.main.00207 | protest and refuse to retrain basic three (socialize) | resolves-by-mechanism | ordinary social, rest, travel or work verb with an NPC reply (G4) | rule |
| lr.mol.main.00305 | attend the dance as required (other) | resolves-by-mechanism | ordinary social, rest, travel or work verb with an NPC reply (G4) | rule |
| lr.mol.main.00306 | claim a medical condition to skip the dance (other) | resolves-by-mechanism | ordinary social, rest, travel or work verb with an NPC reply (G4) | rule |
| lr.mol.main.00306 | accept Ilsa's mentor offer and attend (other) | resolves-by-mechanism | ordinary social, rest, travel or work verb with an NPC reply (G4) | rule |
| lr.mol.main.00307 | refuse and send Fortov to the apothecary (other) | resolves-by-mechanism | refusal plus an NPC reply; the salve is the only craft and it is not made in this branch | judgment |
| lr.mol.main.00401 | follow Akoja outside (travel) | resolves-by-mechanism | ordinary social, rest, travel or work verb with an NPC reply (G4) | rule |
| lr.mol.main.00401 | go home (travel) | resolves-by-mechanism | ordinary social, rest, travel or work verb with an NPC reply (G4) | rule |
| lr.mol.main.00402 | run blindly from the area (travel) | resolves-by-mechanism | travel verb into a hazard; the outcome is the invasion-night death or survival, which the restart row (G7) settles | judgment |
| lr.mol.main.00402 | stay in the dance hall with the others (rest) | resolves-by-mechanism | ordinary social, rest, travel or work verb with an NPC reply (G4) | rule |
| lr.mol.main.00403 | hold the teleport rod and leave with Akoja (travel) | needs-build | one-shot item with a scripted push (teleport rod); the item and its use need a row | judgment |
| lr.mol.main.00404 | fight the lich alongside Zach (fight) | needs-build | lead combat against a scripted lich; the death/restart outcome (G7) is the mechanism, the fight is the build | judgment |
| lr.mol.main.00502 | tell Ilsa about the future memories (socialize) | resolves-by-mechanism | knowledge and witness records (G7, G8) plus the NPC reply | rule |
| lr.mol.main.00504 | join Taiven on the sewer mission (socialize) | needs-build | combat, craft or place mechanism not in the pack | rule |
| lr.mol.main.00505 | continue library research (research) | resolves-by-mechanism | study or practice verb on the seat (G5) | rule |
| lr.mol.main.00507 | ask around about Zach (research) | resolves-by-mechanism | study or practice verb on the seat (G5) | rule |
| lr.mol.main.00509 | warn people face-to-face (socialize) | resolves-by-mechanism | ordinary social, rest, travel or work verb with an NPC reply (G4) | rule |
| lr.mol.main.00510 | do something nice for Neolu later (socialize) | resolves-by-mechanism | ordinary social, rest, travel or work verb with an NPC reply (G4) | rule |
| lr.mol.main.00512 | use the alchemical accident excuse if asked (other) | resolves-by-mechanism | a spoken excuse judged by the NPC; no craft is performed | judgment |
| lr.mol.main.00601 | get off at Korsa and skip the month (rest) | resolves-by-mechanism | travel and calendar plus loop row (G2, G6, G7) | rule |
| lr.mol.main.00602 | keep avoiding conversation (socialize) | resolves-by-mechanism | ordinary social, rest, travel or work verb with an NPC reply (G4) | rule |
| lr.mol.main.00603 | decline the role (work) | resolves-by-mechanism | ordinary social, rest, travel or work verb with an NPC reply (G4) | rule |
| lr.mol.main.00604 | confront Zach about the invasion (other) | resolves-by-mechanism | knowledge and witness records (G7, G8) plus the NPC reply | rule |
| lr.mol.main.00607 | tell Zenomir the truth about time travel (other) | resolves-by-mechanism | knowledge and witness records (G7, G8) plus the NPC reply | rule |
| lr.mol.main.00610 | take the train (travel) | resolves-by-mechanism | travel and calendar plus loop row (G2, G6, G7) | rule |
| lr.mol.main.00614 | repeat earlier electives (study) | resolves-by-mechanism | study or practice verb on the seat (G5) | rule |
| lr.mol.main.00701 | confront Zach directly (socialize) | resolves-by-mechanism | knowledge and witness records (G7, G8) plus the NPC reply | rule |
| lr.mol.main.00702 | accept the alchemical excuse (socialize) | resolves-by-mechanism | accepting an offered excuse is an NPC-reply verb | judgment |
| lr.mol.main.00703 | admit he is also looping (socialize) | resolves-by-mechanism | knowledge and witness records (G7, G8) plus the NPC reply | rule |
| lr.mol.main.00705 | keep attending the class (study) | resolves-by-mechanism | study or practice verb on the seat (G5) | rule |
| lr.mol.main.00706 | stay to finish shelving (work) | resolves-by-mechanism | ordinary social, rest, travel or work verb with an NPC reply (G4) | rule |
| lr.mol.main.00802 | reveal stowaway status to Zach (socialize) | resolves-by-mechanism | knowledge and witness records (G7, G8) plus the NPC reply | rule |
| lr.mol.main.00803 | request transfer to another mentor (other) | resolves-by-mechanism | ordinary social, rest, travel or work verb with an NPC reply (G4) | rule |
| lr.mol.main.01001 | confront Kirielle (other) | resolves-by-mechanism | ordinary social, rest, travel or work verb with an NPC reply (G4) | rule |
| lr.mol.main.01002 | use an umbrella (other) | resolves-by-mechanism | ordinary social, rest, travel or work verb with an NPC reply (G4) | rule |
| lr.mol.main.01002 | tell Zach everything now (socialize) | resolves-by-mechanism | knowledge and witness records (G7, G8) plus the NPC reply | rule |
| lr.mol.main.01003 | ignore Benisek (socialize) | resolves-by-mechanism | ordinary social, rest, travel or work verb with an NPC reply (G4) | rule |
| lr.mol.main.01004 | attend every class (study) | resolves-by-mechanism | study or practice verb on the seat (G5) | rule |
| lr.mol.main.01004 | show levitation to Xvim (socialize) | resolves-by-mechanism | ordinary social, rest, travel or work verb with an NPC reply (G4) | rule |
| lr.mol.main.01005 | enter the city fight (fight) | needs-build | invasion-night combat; off-path combat engine, outcome falls back to the restart row | judgment |
| lr.mol.main.01005 | leave by train (travel) | resolves-by-mechanism | travel and calendar plus loop row (G2, G6, G7) | rule |
| lr.mol.main.01007 | refuse the tests (study) | resolves-by-mechanism | study or practice verb on the seat (G5) | rule |
| lr.mol.main.01007 | incinerate the reading list (other) | resolves-by-mechanism | destroying an owned item with a spell the seat already practises; needs the flame spell row (G5 content) | judgment |
| lr.mol.main.01007 | start the flame variations exercise (study) | resolves-by-mechanism | a spell-practice verb like the levitation exercises; needs the flame spell and study rows (G5 content) | judgment |
| lr.mol.main.01008 | flood the seal with mana (practice) | resolves-by-mechanism | study or practice verb on the seat (G5) | rule |
| lr.mol.main.01101 | skip the next class (other) | resolves-by-mechanism | travel and calendar plus loop row (G2, G6, G7) | rule |
| lr.mol.main.01102 | attend today's classes (study) | resolves-by-mechanism | study or practice verb on the seat (G5) | rule |
| lr.mol.main.01104 | copy the compressed formula line by line (study) | resolves-by-mechanism | study or practice verb on the seat (G5) | rule |
| lr.mol.main.01201 | refuse Taiven as in earlier restarts (socialize) | resolves-by-mechanism | ordinary social, rest, travel or work verb with an NPC reply (G4) | rule |
| lr.mol.main.01202 | return to the Academy library to research (research) | resolves-by-mechanism | study or practice verb on the seat (G5) | rule |
| lr.mol.main.01302 | join the sewer run with Taiven (fight) | needs-build | combat, craft or place mechanism not in the pack | rule |
| lr.mol.main.01303 | tell Taiven he knows of the loop (socialize) | resolves-by-mechanism | knowledge and witness records (G7, G8) plus the NPC reply | rule |
| lr.mol.main.01304 | join Taiven in the sewers (fight) | needs-build | combat, craft or place mechanism not in the pack | rule |
| lr.mol.main.01306 | practice mind shield until reflexive (practice) | resolves-by-mechanism | study or practice verb on the seat (G5) | rule |
| lr.mol.main.01308 | keep pressing the Kirielle levitation prank (practice) | resolves-by-mechanism | study or practice verb on the seat (G5) | rule |
| lr.mol.main.01311 | refuse and send Kirielle to Koth with mother (socialize) | resolves-by-mechanism | ordinary social, rest, travel or work verb with an NPC reply (G4) | rule |
| lr.mol.main.00612 (sealed) | 1 untaken, text withheld | resolves-by-mechanism 1 | class-only rule | rule |
| lr.mol.main.00615 (sealed) | 1 untaken, text withheld | resolves-by-mechanism 1 | class-only rule | rule |
| lr.mol.main.00801 (sealed) | 1 untaken, text withheld | needs-build 1 | class-only rule | rule |
| lr.mol.main.00901 (sealed) | 1 untaken, text withheld | resolves-by-mechanism 1 | class-only rule | rule |
| lr.mol.main.00903 (sealed) | 1 untaken, text withheld | needs-build 1 | class-only rule | rule |
| lr.mol.main.00904 (sealed) | 1 untaken, text withheld | resolves-by-mechanism 1 | class-only rule | rule |
| lr.mol.main.00906 (sealed) | 1 untaken, text withheld | needs-build 1 | class-only rule | rule |
| lr.mol.main.00909 (sealed) | 1 untaken, text withheld | needs-build 1 | class-only rule | rule |
| lr.mol.main.01107 (sealed) | 1 untaken, text withheld | resolves-by-mechanism 1 | class-only rule | rule |
| lr.mol.main.01204 (sealed) | 1 untaken, text withheld | needs-build 1 | class-only rule | rule |
| lr.mol.main.01207 (sealed) | 2 untaken, text withheld | resolves-by-mechanism 2 | class-only rule | rule |
<!-- END generated:g12 -->


## 3. G11: next-beat anchors at every boundary

For each boundary the next beat's place, date, time of day and presence are listed so a skipped replayed stretch can land correctly. **Day delta** is
`offsetDays` of the next beat minus this one when both share a `dateRef.root` and neither is `U`; otherwise `unknown` or `root change`. Presence is `present` minus
Zorian. Anchors are the next beat's `anchors` with a time unit (first two), as the scene states them.

<!-- BEGIN generated:g11count -->
Counted: 44 scenes carry date label I (inferred), 61 carry U (unknown), 0 carry neither.

Span scenes (value or place says a stretch is summarised): lr.mol.main.01004, lr.mol.main.01006.

Loop-number changes at a boundary (value prefix L\d): 10 of 104 boundaries.

Every `dateRef.precision` is "relative" and every `dateRef.absolute` is null (counted: 105 of 105).
<!-- END generated:g11count -->

Judgment on landing rules (proposal):
- **Place and presence are always known** (every non-sealed row has them), so the landing rule can be strict on those: the canon pull puts him in the next beat's
  place with the listed people present, or the run takes the beat's `deps`/branch rather than faking it.
- **Time is weak.** 61 scenes have unknown dates, 44 inferred, none absolute. The landing therefore keys on *time of day plus ordering* (`order`, `timeOfDay`), not
  on a day of the month, until G6's reader pass resolves stated times. Rows flagged "date unknown" or "next unknown" must not be given a day by the generator.
- **Two span scenes** (01004 and 01006 say a stretch is summarised) are the clearest skipped-replay cases: the brief should give them the exact quantities the
  scene keeps (the anchors column) and run the months at L0/L1.
- **Restart boundaries** are flagged "loop number A to B"; at those the landing is the reset row (G7), not a canon pull. 10 of 104 boundaries change the loop number,
  and 00404 to 00501 (S0 end to the first S1 morning) is the first.
- The S0 to S1 boundary (00404 to 00501) crosses a restart and a place change (the academy streets to the family house in Cirin); that is the first
  boundary a replay must reproduce, and it lands by the reset, not by the previous scene's place.

<!-- BEGIN generated:g11 -->
| Beat | Date (label) | Next beat | Next place | Next date (label), time of day | Day delta | Next presence (non-lead) | Flags |
|---|---|---|---|---|---|---|---|
| lr.mol.main.00101 | L?-D1 (U) | lr.mol.main.00102 | Kazinski family house kitchen, Cirin | L?-D1 (U), morning | unknown | ilsa | date unknown; next unknown; anchor Years until graduation: 2 year; anchor Years already lived in academy housing: 2 year |
| lr.mol.main.00102 | L?-D1 (U) | lr.mol.main.00103 | Cirin train station and the train to Cyoria | L?-D1 (U), morning | unknown | fortov, mother, kirielle | date unknown; next unknown |
| lr.mol.main.00103 | L?-D1 (U) | lr.mol.main.00104 | Cyoria station, central plaza route, park, bridge, road to the academy | L?-D1 (U), afternoon | unknown | bridge | date unknown; next unknown; anchor Walk from train station to academy, one to two hours: 1 hour; anchor Years spent mastering apple levitation: 2 year |
| lr.mol.main.00104 | L?-D1 (U) | lr.mol.main.00105 | Cyoria academy grounds, administration building, third-year housing room | L?-D1 (U), afternoon | unknown | admin | date unknown; next unknown; anchor Days before classes start: 2 day |
| lr.mol.main.00105 | L?-D1 (U) | lr.mol.main.00201 | Academy cafeteria | L?-D? (U), noon | unknown | benisek | date unknown; next unknown; anchor years Zorian has been away from the library: 2 years |
| lr.mol.main.00201 | L?-D? (U) | lr.mol.main.00202 | Zorian's room in the academy | L?-D? (U), afternoon | unknown | taiven | date unknown; next unknown; anchor length of Taiven's visit: 3 hours |
| lr.mol.main.00202 | L?-D? (U) | lr.mol.main.00203 | Essential Invocations classroom | L?-D? (U), morning | unknown | akoja, briam, zach, raynie, ilsa | date unknown; next unknown; anchor minutes until class starts when Zorian arrived: 10 minutes; anchor minutes before class students must be ready: 15 minutes |
| lr.mol.main.00203 | L?-D? (U) | lr.mol.main.00204 | history of magic classroom | L?-D? (U), afternoon | unknown | zenomir | date unknown; next unknown |
| lr.mol.main.00204 | L?-D? (U) | lr.mol.main.00205 | training hall | L?-D? (U), morning | unknown | kyron, zach, neolu, jade | date unknown; next unknown |
| lr.mol.main.00205 | L?-D? (U) | lr.mol.main.00206 | spell formula classroom | L?-D? (U), afternoon | unknown | nora | date unknown; next unknown |
| lr.mol.main.00206 | L?-D? (U) | lr.mol.main.00207 | Xvim Chao's office | L?-D? (U), day | unknown | xvim | date unknown; next unknown; anchor time lost in basic three session: 1 hours; anchor years since Zorian mastered the basic three: 1 years |
| lr.mol.main.00207 | L?-D? (U) | lr.mol.main.00301 | warding classroom (unnamed) | L?-D? (U), day | unknown | zach, akoja | date unknown; next unknown; anchor Weeks since first-week warding realization: 14 days; anchor Zach's first two years were below average: 2 years |
| lr.mol.main.00301 | L?-D? (U) | lr.mol.main.00302 | academy corridor | L?-D? (U), day | unknown | akoja, benisek | date unknown; next unknown; anchor Neolu's exam finish time: 30 minutes; anchor Akoja and Neolu have shared a class: 2 years |
| lr.mol.main.00302 | L?-D? (U) | lr.mol.main.00303 | alchemy classroom | L?-D? (U), day | unknown | akoja, benisek, azlyn, zach | date unknown; next unknown |
| lr.mol.main.00303 | L?-D? (U) | lr.mol.main.00304 | Ilsa's class (unnamed room) | L?-D? (U), day | unknown | akoja, ilsa | date unknown; next unknown; anchor Dance teaching window before the dance: 5 days |
| lr.mol.main.00304 | L?-D? (U) | lr.mol.main.00305 | room six | L?-D? (U), evening | unknown | benisek, ilsa | date unknown; next unknown |
| lr.mol.main.00305 | L?-D? (U) | lr.mol.main.00306 | Ilsa's office | L?-D? (U), day | unknown | ilsa | date unknown; next unknown; anchor Xvim levitation drill has run for weeks: 4 weeks |
| lr.mol.main.00306 | L?-D? (U) | lr.mol.main.00307 | residence building corridor | L?-D? (U), evening | unknown | fortov | date unknown; next unknown; anchor Fortov is a year older than Zorian: 1 year; anchor Zorian's first two years were theory and lab safety: 2 years |
| lr.mol.main.00307 | L?-D? (U) | lr.mol.main.00308 | alchemical workshop | L?-D? (U), night | unknown | kael | date unknown; next unknown |
| lr.mol.main.00308 | L?-D? (U) | lr.mol.main.00401 | Residence building, walk to dance hall, dance hall | dance night (date unstated) (U), evening | unknown | akoja | date unknown; next unknown; anchor time until the dance begins (Zorian's statement): 120 minutes; anchor walk from residence building to dance hall: 10 minutes |
| lr.mol.main.00401 | dance night (date unstated) (U) | lr.mol.main.00402 | Dance hall roof, dance hall stairway, dance hall, city streets | dance night (date unstated) (U), midnight | unknown | ilsa, kyron | date unknown; next unknown |
| lr.mol.main.00402 | dance night (date unstated) (U) | lr.mol.main.00403 | City streets, then a house upper floor | dance night (date unstated) (U), night | unknown | zach, akoja | date unknown; next unknown |
| lr.mol.main.00403 | dance night (date unstated) (U) | lr.mol.main.00404 | Street near the house, behind a cart | dance night (date unstated) (U), night | unknown | zach, lich | date unknown; next unknown |
| lr.mol.main.00404 | dance night (date unstated) (U) | lr.mol.main.00501 | Zorian's room, Cirin | L1-D1 (I), morning | unknown | kirielle | date unknown; loop number ? to 1; next inferred |
| lr.mol.main.00501 | L1-D1 (I) | lr.mol.main.00502 | Zorian's room, Cirin | L1-D1 (I), morning | root change | ilsa, mother | date inferred; next inferred |
| lr.mol.main.00502 | L1-D1 (I) | lr.mol.main.00503 (sealed) | withheld | L1-D1 (I), day | root change | sealed: 0 others, names withheld | date inferred; next inferred |
| lr.mol.main.00503 (sealed) | L1-D1 (I) | lr.mol.main.00504 | Zorian's academy room, then academy library | L1-D2 (I), afternoon | root change | taiven | date inferred; next inferred |
| lr.mol.main.00504 | L1-D2 (I) | lr.mol.main.00505 | Academy library | L1-D3 (I), day | root change | alone | date inferred; next inferred |
| lr.mol.main.00505 | L1-D3 (I) | lr.mol.main.00506 | Academy classroom | L1-D5 (I), morning | root change | akoja, briam, ilsa | date inferred; next inferred; anchor Time before classmates noticed Zach's improvement: 2 week; anchor Time since the earlier review sessions: 1 month |
| lr.mol.main.00506 | L1-D5 (I) | lr.mol.main.00507 | Academy | L1-D9 (I), day | root change | nora | date inferred; next inferred |
| lr.mol.main.00507 | L1-D9 (I) | lr.mol.main.00508 | Xvim's office, academy | L1-D9 (U), day | unknown | xvim | date inferred; next unknown |
| lr.mol.main.00508 | L1-D9 (U) | lr.mol.main.00509 | Academy library, then history classroom | L1-D9 (U), day | unknown | benisek | date unknown; next unknown |
| lr.mol.main.00509 | L1-D9 (U) | lr.mol.main.00510 | Academy, then academy library | L1-D11 (I), day | unknown | neolu | date unknown; next inferred; anchor Time for the crush rumour to spread: 2 day |
| lr.mol.main.00510 | L1-D11 (I) | lr.mol.main.00511 | Cyoria stores and public postal boxes | L1-D? (U), day | unknown | alone | date inferred; next unknown; anchor Time before the festival that letters were posted: 1 week |
| lr.mol.main.00511 | L1-D? (U) | lr.mol.main.00512 | Train leaving Cyoria | L1-D? (U), night | unknown | alone | date unknown; next unknown |
| lr.mol.main.00512 | L1-D? (U) | lr.mol.main.00513 | Zorian's room, Cirin | L2-D1 (I), morning | unknown | kirielle | date unknown; loop number 1 to 2; next inferred |
| lr.mol.main.00513 | L2-D1 (I) | lr.mol.main.00601 | train compartment approaching Korsa | L1-D1 (I), unknown | root change | alone | date inferred; loop number 2 to 1; next inferred |
| lr.mol.main.00601 | L1-D1 (I) | lr.mol.main.00602 | train compartment | L1-D1 (I), unknown | 0 | byrn | date inferred; next inferred |
| lr.mol.main.00602 | L1-D1 (I) | lr.mol.main.00603 | academy library, information desk | L1-D1 (I), unknown | 0 | kirithishli, ibery | date inferred; next inferred |
| lr.mol.main.00603 | L1-D1 (I) | lr.mol.main.00604 | academy classroom | L1-D2 (I), unknown | 0 | alone | date inferred; next inferred |
| lr.mol.main.00604 | L1-D2 (I) | lr.mol.main.00605 | academy library and classrooms | L1-D15 (I), unknown | 14 | alone | date inferred; next inferred; anchor Time spent on library work so far: 2 weeks; anchor Estimated months needed to reach library proficiency: 2 months |
| lr.mol.main.00605 | L1-D15 (I) | lr.mol.main.00606 | academy library, information desk | L1-D15 (I), unknown | 0 | kirithishli, ibery | date inferred; next inferred |
| lr.mol.main.00606 | L1-D15 (I) | lr.mol.main.00607 | academy, Zenomir's office (I) | L1-D15 (I), unknown | 0 | zenomir | date inferred; next inferred |
| lr.mol.main.00607 | L1-D15 (I) | lr.mol.main.00608 (sealed) | withheld | L1-D15 (I), night | 0 | sealed: 0 others, names withheld | date inferred; next inferred |
| lr.mol.main.00608 (sealed) | L1-D15 (I) | lr.mol.main.00609 | lead's room at the academy dormitory | L2-D1 (I), morning | 1 | kirielle | date inferred; loop number 1 to 2; next inferred |
| lr.mol.main.00609 | L2-D1 (I) | lr.mol.main.00610 | lead's room at the academy dormitory | L2-D1 (I), morning | 0 | ilsa | date inferred; next inferred |
| lr.mol.main.00610 | L2-D1 (I) | lr.mol.main.00611 | teleport redirection point, then lead's room at the academy | L2-D1 (I), morning | 0 | ilsa | date inferred; next inferred; anchor Train day saved by teleporting: 1 day |
| lr.mol.main.00611 | L2-D1 (I) | lr.mol.main.00612 (sealed) | withheld | L2-D1 (I), unknown | 0 | sealed: 0 others, names withheld | date inferred; next inferred |
| lr.mol.main.00612 (sealed) | L2-D1 (I) | lr.mol.main.00613 (sealed) | withheld | L2-D30 (I), night | 29 | sealed: 1 others, names withheld | date inferred; next inferred |
| lr.mol.main.00613 (sealed) | L2-D30 (I) | lr.mol.main.00614 | lead's room at the academy | LU-D1 (U), unknown | unknown | alone | date inferred; loop number 2 to U; next unknown |
| lr.mol.main.00614 | LU-D1 (U) | lr.mol.main.00615 (sealed) | withheld | (text withheld) (U), morning | unknown | sealed: 1 others, names withheld | date unknown; next unknown |
| lr.mol.main.00615 (sealed) | (text withheld) (U) | lr.mol.main.00701 | Academy classroom (Ilsa's class) | L?-D? (U), day | unknown | zach, briam, ilsa, akoja | date unknown; loop number U to ?; next unknown; anchor Zach's guessed recovery time: 1 hour; anchor Zorian's doubt over the 'hour or two' recovery: 1 hour |
| lr.mol.main.00701 | L?-D? (U) | lr.mol.main.00702 | Academy cafeteria | L?-D? (U), noon | unknown | zach | date unknown; next unknown; anchor Review session Zorian avoided by leaving class: 2 hours; anchor Delay Zorian considers before raising the topic: 3 days |
| lr.mol.main.00702 | L?-D? (U) | lr.mol.main.00703 | Fountain | L?-D? (U), noon | unknown | zach | date unknown; next unknown; anchor Months since restarts started for lead: 8 months; anchor Zach's stated years ('nearly 17 years'), referent unclear: 17 years |
| lr.mol.main.00703 | L?-D? (U) | lr.mol.main.00704 | Academy corridors and Zorian's room | L?-D? (U), afternoon | unknown | akoja | date unknown; next unknown; anchor Zach's memory gap length: 7 months |
| lr.mol.main.00704 | L?-D? (U) | lr.mol.main.00705 | Academy classroom (Kyron's class) | L?-D? (U), afternoon | unknown | kyron | date unknown; next unknown; anchor Length of Kyron's magic missile course: 1 month; anchor Return visit to Kyron for progress check: 2 weeks |
| lr.mol.main.00705 | L?-D? (U) | lr.mol.main.00706 | Library | L?-D? (U), afternoon | unknown | ibery, kirithishli, zach | date unknown; next unknown; anchor Lunch break Zach offers: 1 hour |
| lr.mol.main.00706 | L?-D? (U) | lr.mol.main.00801 (sealed) | withheld | L?-D? (U), day | unknown | sealed: 2 others, names withheld | date unknown; next unknown |
| lr.mol.main.00801 (sealed) | L?-D? (U) | lr.mol.main.00802 | mol.place.academy-cafeteria | L?-D? (I), unstated | unknown | zach | date unknown; next inferred; anchor Zorian's combat practice span with Zach: 14 day; anchor Zach's time spent as a classmate's mentor span: 10 year |
| lr.mol.main.00802 | L?-D? (I) | lr.mol.main.00803 | mol.place.ilsa-office | L?-D? (I), unstated | 13 | ilsa | date inferred; next inferred; anchor Duration Ilsa names for typical learning: 1 year; anchor Duration Zorian names for six variations: 1 year |
| lr.mol.main.00803 | L?-D? (I) | lr.mol.main.00804 | mol.place.academy-library | L?-D? (U), unstated | unknown | alone | date inferred; next unknown; anchor Time Zorian has beyond a few weeks for the book: 3 week |
| lr.mol.main.00804 | L?-D? (U) | lr.mol.main.00901 (sealed) | withheld | (text withheld) (I), evening | unknown | sealed: 1 others, names withheld | date unknown; next inferred |
| lr.mol.main.00901 (sealed) | (text withheld) (I) | lr.mol.main.00902 (sealed) | withheld | (text withheld) (I), evening | 0 | sealed: 2 others, names withheld | date inferred; next inferred |
| lr.mol.main.00902 (sealed) | (text withheld) (I) | lr.mol.main.00903 (sealed) | withheld | (text withheld) (I), evening | 0 | sealed: 2 others, names withheld | date inferred; next inferred |
| lr.mol.main.00903 (sealed) | (text withheld) (I) | lr.mol.main.00904 (sealed) | withheld | (text withheld) (I), evening | 1 | sealed: 3 others, names withheld | date inferred; next inferred |
| lr.mol.main.00904 (sealed) | (text withheld) (I) | lr.mol.main.00905 (sealed) | withheld | (text withheld) (I), evening | 0 | sealed: 4 others, names withheld | date inferred; next inferred |
| lr.mol.main.00905 (sealed) | (text withheld) (I) | lr.mol.main.00906 (sealed) | withheld | (text withheld) (I), evening | 0 | sealed: 5 others, names withheld | date inferred; next inferred |
| lr.mol.main.00906 (sealed) | (text withheld) (I) | lr.mol.main.00907 (sealed) | withheld | (text withheld) (I), evening | 0 | sealed: 2 others, names withheld | date inferred; next inferred |
| lr.mol.main.00907 (sealed) | (text withheld) (I) | lr.mol.main.00908 (sealed) | withheld | (text withheld) (I), evening | 0 | sealed: 1 others, names withheld | date inferred; next inferred |
| lr.mol.main.00908 (sealed) | (text withheld) (I) | lr.mol.main.00909 (sealed) | withheld | (text withheld) (I), evening | 0 | sealed: 2 others, names withheld | date inferred; next inferred |
| lr.mol.main.00909 (sealed) | (text withheld) (I) | lr.mol.main.01001 | Zorian's family home, his room (not named) | L?-D1 (U), morning | unknown | kirielle | date inferred; next unknown |
| lr.mol.main.01001 | L?-D1 (U) | lr.mol.main.01002 | Train to Cyoria, then road from the train station toward the academy | L?-D1 (U), daytime | unknown | alone | date unknown; next unknown; anchor Rain barrier protection duration: 1.5 hour; anchor Pace of mastering 15 shaping exercises described as implausible: 1 month |
| lr.mol.main.01002 | L?-D1 (U) | lr.mol.main.01003 | Academy cafeteria | L?-D2 (U), day | unknown | benisek | date unknown; next unknown; anchor Usual time before restarts go off the rails: 7 day; anchor Days since arrival in Cyoria at cafeteria scene: 1 day |
| lr.mol.main.01003 | L?-D2 (U) | lr.mol.main.01004 | Academy and Cyoria, classes and Ilsa's class | L?-D2 onward (span) (U), day | unknown | ilsa | date unknown; next unknown; anchor Project promised to Ilsa to be finished within: 1 month; anchor Newspaper coverage of the Zach story lasted: 1 week |
| lr.mol.main.01004 | L?-D2 onward (span) (U) | lr.mol.main.01005 | Hill overlooking Cyoria | L?-D? invasion night (day not numbered) (U), night (00:02) | unknown | alone | date unknown; span (replayed stretch); next unknown; anchor Gap between fire elementals and the monster wave: 3 minute |
| lr.mol.main.01005 | L?-D? invasion night (day not numbered) (U) | lr.mol.main.01006 | Cyoria: Noveda mansion area, academy and library (summarised) | L?-D? later restarts (span) (U), varied (Zach's escapes fall at night) | unknown | alone | date unknown; next unknown |
| lr.mol.main.01006 | L?-D? later restarts (span) (U) | lr.mol.main.01007 | Ilsa's office, academy | L?-D? office visit (day unclear) (U), day | unknown | ilsa | date unknown; span (replayed stretch); next unknown |
| lr.mol.main.01007 | L?-D? office visit (day unclear) (U) | lr.mol.main.01008 | Family home, Zorian's room | L?-D1 (new restart, inferred) (U), morning | unknown | kirielle, ilsa | date unknown; next unknown |
| lr.mol.main.01008 | L?-D1 (new restart, inferred) (U) | lr.mol.main.01009 | Ilsa's office, academy | L?-D? later the same restart (Cyoria) (U), day | unknown | ilsa | date unknown; next unknown; anchor Nora Boole's reading deadline for her students: 7 day |
| lr.mol.main.01009 | L?-D? later the same restart (Cyoria) (U) | lr.mol.main.01101 | Academy, Nora's classroom | L?-D? (U), day | unknown | nora, benisek, akoja | date unknown; next unknown; anchor Expected length of teacher approval process: 7 days; anchor Time before Benisek began pestering: 3 minutes |
| lr.mol.main.01101 | L?-D? (U) | lr.mol.main.01102 | Cyoria main train station, then walk into Cyoria | L?-D? (U), day | unknown | kael, kana | date unknown; next unknown; anchor Train delay on platform 6: 2 hours; anchor Pigeons fled after the agitation build-up: 1 minute |
| lr.mol.main.01102 | L?-D? (U) | lr.mol.main.01103 | Academy classroom | L?-D? (U), day | unknown | akoja, kael | date unknown; next unknown |
| lr.mol.main.01103 | L?-D? (U) | lr.mol.main.01104 | Academy, Nora's workshop classroom | L?-D? (I), day | unknown | nora | date unknown; next inferred; anchor Days Nora needed to organize first lesson: 2 days |
| lr.mol.main.01104 | L?-D? (I) | lr.mol.main.01105 | Xvim's office, Academy | L?-D? (I), day | 0 | xvim | date inferred; next inferred; anchor Length of a school week: 7 days |
| lr.mol.main.01105 | L?-D? (I) | lr.mol.main.01106 | Academy and Cyoria | L?-D? (I), day | 1 | alone | date inferred; next inferred; anchor Span of Nora's intensive teaching: 14 days; anchor Lesser endurance of Nora's pace: 30 days |
| lr.mol.main.01106 | L?-D? (I) | lr.mol.main.01107 (sealed) | withheld | L?-D1 (U), morning | unknown | sealed: 1 others, names withheld | date inferred; next unknown |
| lr.mol.main.01107 (sealed) | L?-D1 (U) | lr.mol.main.01201 | mol.place.zorian-apartment | L?-D? (U), evening | unknown | taiven | date unknown; next unknown; anchor Lead expects to be unproductive for a stretch: 7 days; anchor Taiven stayed a short while before leaving: 3 minutes |
| lr.mol.main.01201 | L?-D? (U) | lr.mol.main.01202 | mol.place.academy-classroom | L?-D?+1 (I), morning | unknown | briam, fire | date unknown; next inferred; anchor Minimum time to cast the soul bond ritual: 10 minutes; anchor Time before a bonded person feels the bond, per Briam: 3 weeks |
| lr.mol.main.01202 | L?-D?+1 (I) | lr.mol.main.01203 | mol.place.chess-park | L?-D?+1 (I), evening | 0 | cat | date inferred; next inferred; anchor Walk from the start to the bridge: 3 minutes |
| lr.mol.main.01203 | L?-D?+1 (I) | lr.mol.main.01204 (sealed) | withheld | (text withheld) (I), evening | 0 | sealed: 6 others, names withheld | date inferred; next inferred |
| lr.mol.main.01204 (sealed) | (text withheld) (I) | lr.mol.main.01205 (sealed) | withheld | (text withheld) (I), morning | 1 | sealed: 1 others, names withheld | date inferred; next inferred |
| lr.mol.main.01205 (sealed) | (text withheld) (I) | lr.mol.main.01206 | mol.place.taiven-home | L?-D? (U), unstated | unknown | taiven | date inferred; next unknown; anchor Marble throwing time negotiated per session: 60 minutes; anchor Time others could keep charging marbles before draining reserves: 30 minutes |
| lr.mol.main.01206 | L?-D? (U) | lr.mol.main.01207 (sealed) | withheld | L?-D? (U), evening | unknown | sealed: 0 others, names withheld | date unknown; next unknown |
| lr.mol.main.01207 (sealed) | L?-D? (U) | lr.mol.main.01301 | Zorian's bedroom | L5-D? (I), morning | unknown | kirielle | date unknown; loop number ? to 5; next inferred |
| lr.mol.main.01301 | L5-D? (I) | lr.mol.main.01302 | Zorian's academy room | L5-D? (I), morning | root change | taiven | date inferred; next inferred; anchor Reset interval before the loop resets: 2 days |
| lr.mol.main.01302 | L5-D? (I) | lr.mol.main.01303 | Zorian's academy room | L5-D? (I), morning | root change | taiven | date inferred; next inferred |
| lr.mol.main.01303 | L5-D? (I) | lr.mol.main.01304 | Zorian's room | L?-D? (U), day | unknown | taiven | date inferred; loop number 5 to ?; next unknown; anchor Taiven's return visit after the sewer run: 3 days |
| lr.mol.main.01304 | L?-D? (U) | lr.mol.main.01305 | Zorian's bedroom | L?-D? (U), morning | unknown | kirielle | date unknown; next unknown |
| lr.mol.main.01305 | L?-D? (U) | lr.mol.main.01306 | academy combat magic classroom | L?-D? (U), afternoon | unknown | kyron | date unknown; next unknown |
| lr.mol.main.01306 | L?-D? (U) | lr.mol.main.01307 | Zorian's bedroom | L?-D? (U), morning | unknown | kirielle | date unknown; next unknown |
| lr.mol.main.01307 | L?-D? (U) | lr.mol.main.01308 | Ilsa's workroom at the academy | L?-D? (U), day | unknown | ilsa | date unknown; next unknown; anchor Ibery took to warm up and teach Zorian: 2 weeks; anchor Ilsa's estimate to levitate a person from living-being start: 4 years |
| lr.mol.main.01308 | L?-D? (U) | lr.mol.main.01309 | Zorian's bedroom | L>15-D? (I), morning | unknown | kirielle | date unknown; loop number ? to >15; next inferred; anchor Typical restart length, upper bound: 3 days; anchor Longest restart length observed: 5 days |
| lr.mol.main.01309 | L>15-D? (I) | lr.mol.main.01310 | family home bedroom | L?-D? (U), morning | unknown | kirielle | date inferred; loop number >15 to ?; next unknown |
| lr.mol.main.01310 | L?-D? (U) | lr.mol.main.01311 | family home bedroom | L?-D? (U), morning | unknown | kirielle | date unknown; next unknown |
| lr.mol.main.01311 | L?-D? (U) | end of c13 | - | - | - | - | date unknown; next is c14, outside this table |
<!-- END generated:g11 -->


## 4. Gap roll-up

### Actor per verb

Counted: 289 verbs are the lead's and 12 have another person as subject, in 8 scenes (S0 1, S1 11). The `[name]` verbs are an NPC doing something on screen: Taiven pitching and storming out (c13), Kyron's lecture and spell
(c13), Ilsa's explanations (c13), Kirielle waking him (c13), Kirielle asking to come to Cyoria, and the lich's rite (c4). The host forces `actorId: "player"` and has
only two NPC rows (`npc.taiven_review`, `npc.scavenger_guard`), neither of which matches any of these verbs. So **NPC-side verbs have no owner command at all**;
they need a scheduled NPC action in the event feed (G27). The lead's own verbs with a counterpart (`with Ilsa`, `Taiven`, `Xvim`) are the player acting on a person,
as P2b said; the Zorian start swaps the target set.

### Verbs with no pack command, by category (non-sealed, counted)

<!-- BEGIN generated:rollup -->
| Gap category (verbs with no pack command) | Verbs | Scenes | First beats (CCCNN) |
|---|---|---|---|
| peer-social-or-event | 26 | 18 | 00103, 00201, 00302, 00304, ... |
| combat-or-ward-spell | 23 | 12 | 00105, 00203, 00205, 00403, ... |
| travel | 16 | 10 | 00103, 00104, 00105, 00401, ... |
| rest-wake | 15 | 14 | 00101, 00103, 00202, 00402, ... |
| npc-side-verb | 12 | 8 | 00404, 01302, 01303, 01304, ... |
| class-lecture | 11 | 8 | 00204, 00205, 00206, 00301, ... |
| family-household | 9 | 7 | 00101, 00610, 01001, 01305, ... |
| academy-admin | 8 | 4 | 00102, 00105, 00502, 00614 |
| alchemy-craft | 7 | 4 | 00303, 00307, 00308, 00614 |
| deception-or-warning | 7 | 5 | 00607, 00701, 00702, 00703, ... |
| unruled-study | 5 | 5 | 00202, 00206, 00301, 00703, ... |
| unruled-other | 5 | 5 | 00505, 00602, 00705, 01003, ... |
| letters-post | 5 | 2 | 00509, 00511 |
| teleport | 4 | 3 | 00403, 00610, 00611 |
| language-expert | 3 | 2 | 00606, 00607 |
| hazard-avoidance | 2 | 2 | 00104, 00404 |
| unruled-travel | 2 | 2 | 00402, 00403 |
| unruled-socialize | 2 | 2 | 00602, 00702 |
| persuade-npc | 2 | 2 | 01303, 01304 |
| unruled-care | 1 | 1 | 00104 |
<!-- END generated:rollup -->

`unruled-*` rows are verbs no rule matched (about 19, mostly small "other" verbs such as waiting, reflecting, packing); they are not a mechanism and are not
promoted to gaps. Sealed scenes are one line: see the sealed count above; their categories are withheld.

### Gaps (existing codes extended, new codes proposed)

Tag per ST13: **on-path** = the school, Cyoria, his teachers and allies, and what a restart replay needs (build now); **off-path** = recorded, built when a start needs it.
Dispositions are proposals. New codes continue the stage record's G1-G16.

| Code | Mechanism or row missing | Evidence (counted, non-sealed) | Tag | Links and note |
|---|---|---|---|---|
| G1, G4 (extended) | Seat binding; Zorian's house, family, school day and rooms as rows | family-household 9 verbs in 7 scenes; academy-admin 8 in 4 | on-path | The guest permit becomes student status; the admin verbs (certification scroll, housing key, electives) are G4 content, not a new mechanism |
| G5 (extended) | Reserve and spell practice rows (levitation, light orb, glow, pen spin, flame) | 26 `control_drill` near-mappings; 3 `study_invocation` | on-path | One visitor drill command is standing in for every exercise; G5 must add spell rows or the "near" label hides a gap |
| G6, G7, G8, G2 (extended) | Calendar, reset v2, carried knowledge, loop key | 105 of 105 dates relative; 10 loop-number boundaries; options that tell an ally about the loop | on-path | G6's reader pass for 61 unknown dates is still the blocker for day-keyed landing |
| G11 (closed to a table) | Landing rule at each boundary | section 3 | on-path | Landing keys on place, presence, time of day; two span scenes need exact kept quantities |
| G12 (closed to a count) | Locked options | 73 untaken: 61 mechanism, 12 needs-build, 0 out-of-world | on-path | needs-build splits into sewer/combat (G20) and items (G21) |
| **G17** | Seat movement and rest/wake: place change by train, walk, wait; waking, napping, sleeping; time advance on the seat | travel 16 verbs in 10 scenes; rest-wake 15 in 14 | on-path | Check first whether host base commands already cover it (not opened here); if so this is a seat-binding item under G1 |
| **G18** | Class, test, assignment and lecture verbs (attend, sit a test, receive an assignment, take notes) | class-lecture 11 in 8; study fallbacks 5 | on-path | School is his ring (ST13); needs a class row family with teacher, subject, hours and an outcome that feeds G5; the visitor has no classroom |
| **G19** | Ward, dispel and combat-spell *training* with teachers (Kyron's lessons, Taiven's practice range, rain barrier, shield) | combat-or-ward-spell 23 verbs in 12 scenes (most are lessons) | on-path (lessons) | Teachers and allies are central (ST16); this is practice content on G5, not the combat engine |
| **G20** | Lead combat engine for invasion night and sewer runs | the fight, lich and join-the-run options and verbs (00403-00404, 01005, 00202, 00504, 01302, 01304) | off-path | The death outcome is G7; the engine waits until a start needs combat. ST14 should not depend on it |
| **G21** | Teleport as a service (Ilsa's offer, 00610-00611) and the teleport rod as a one-shot item (00403) | teleport 4 verbs in 3 scenes | service on-path; rod off-path | One transport row with a cost and a witness; the rod is an item row with a scripted use |
| **G22** | Persuasion, deception, warning and disclosure to NPCs, with the NPC's belief | deception-or-warning 7 in 5; persuade-npc 2 in 2; 8 of the 54 readable mechanism options are disclosure or confrontation | on-path | Builds on G8 (what he knows) and the witness field of G7; the NPC reply needs a belief/trust record per person (links G14 for Zach, Taiven, Ilsa, Xvim, Kael) |
| **G23** | Peer-social and event verbs: gossip, lunch with classmates, the dance, Zach conversations | peer-social-or-event 26 verbs in 18 scenes | on-path | The pack's only talk command targets Zorian himself (`zorian_talk`); a per-NPC talk/meet family with tier and trust is needed (ST16: contact deepens tiers) |
| **G24** | Family household verbs (Kirielle, Mother, Fortov) | included in G1/G4 count above | on-path | Own item because c1 and the c13 mornings are repeated daily and need a cheap row, not a scene each |
| **G25** | Alchemy craft for school and Kael's workshop (salve, glue, powders) | alchemy-craft 7 verbs in 4 scenes | on-path | The visitor's Kael commands sort labels and treat burns; none craft. A craft row family with inputs, time and result |
| **G26** | Posting anonymous letters and waiting for a reaction | letters-post 5 verbs in 2 scenes | on-path (S1 replay) | Needs an item (paper), a location (public boxes), a delayed reaction in the event feed; small |
| **G27** | NPC-side verbs: an NPC performs a scheduled action on screen (pitch, storm out, lecture, wake him) | 12 verbs in 8 scenes with a named other subject | on-path | The actor-per-verb finding; event feed items per NPC keyed to a time of day; today's host has two NPC rows only |
| **G28** | Language and translation help (Zenomir, coded chant) | language-expert 3 verbs in 2 scenes | on-path | Small NPC-help row; the chant itself stays a scene fact |

Not new gaps: the 15 `rest-wake` verbs and 16 `travel` verbs are one item (G17); `hazard-avoidance` (2) rides on G20.

## More to consider

- ACT NOW (done): the scene table, the G12 count (80 non-empty, 64 with untaken options, 73 untaken options), the actor-per-verb list (12 NPC-side verbs), the correction to
  the I/U date counts in the stage record, and 12 gap lines (G17-G28).
- ACCOUNT FOR NOW: the verb-to-command mapping is a rule list, not a read of the pack's effects; before G1 is built, one haiku shard should open the 15 commands marked in
  the command list above and confirm each `near` mapping is genuinely the same family (mislabels would inflate "partial"). The host's base commands (movement, rest) were
  not opened (G17).
- LATER / DELEGATE: a sonnet pass to turn the 61 mechanism options into one seat-neutral check each (done check: the option's outcome follows from named rows with no new
  rule); the G6 reader pass over the 61 unknown dates (done check: stated times with locators, `check_reader_rows.mjs` clean).
