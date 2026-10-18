# W37: Source fidelity of native world code

## CHECKPOINT

2026-10-14. COMPLETE design-only source audit, at live branch `codex/gameplay-foundations`, initial HEAD `702919063b290cec2561d4581c027c24b71ccffe`. Only this file and `docs/gm/dispatch/world-core-kit-2026-10-14/W37_REPORT.md` are owned. Other workers' dirty source, bundles, docs and evidence were preserved. No SECRETS file, private pack or user save was opened. No game, build, test, browser, checkout, stage, commit or push was run. Proposed tests and playable gates remain OPEN. Resume from the registry and field rules below, then refresh source locators before any later implementation.

Authority: [COMMON](../../gm/dispatch/world-core-kit-2026-10-14/COMMON.md), [kit round 14](../WORLD_CORE_KIT_2026-10-14.md#round-14-book-versus-code-where-numbers-come-from-2026-10-14), [audit playbook](../WORLD_CORE_KIT_AUDIT_PLAYBOOK.md), PROJECT standing priorities and USER_VISION. This extends W29, W30, W31 and W23 G01-G19. It supplies considerations, not accepted mechanics. Canon-first order, the selected independent visitor branches, one initial realm/prestige and comfortable unfed play remain unchanged. No new source-fidelity gate is imposed on an unrelated implementation wave.

## W37.N: registered modules, listed first

SHOWN(source): `src/expedition_content.js:4-10,48-50` registers ten built-in world IDs: the nine away-world IDs below plus Frontier. Native binding creation is in `src/main.js:537-554`; Glasshouse has its own native location. Registry presence is not enrollment or playable acceptance.

| Code | World ID / scope | Definition and native owner |
|---|---|---|
| W37.N1 | `book.mol.cyoria` | The six `src/book_world_mol_{ids,content,actions,state,host,native}.js` leaves plus `src/book_world_effects.js` (six prefixed leaves, one effect projector). Seven places, nine authored resident bindings. |
| W37.N2 | `book.paradise.hub` | `src/book_world_paradise_{ids,content,actions,state,host,native,carriers}.js` and four `campaign_*` leaves. Two places; original independent service desk. |
| W37.N3 | `book.paradise.goa` | Same modules, five places; supplied-MTL first-Goa alternate branch, not authenticated One Piece canon. |
| W37.N4 | `reference.proto23.village` | Six `src/proto23_world_{ids,content,actions,state,host,native}.js` leaves. Three places, two original residents. Source game, not a novel. |
| W37.N5 | `nested.paradise_hub` | `src/feature_expansion_nested_{content,host,native}.js`; original Wayfarer/Exchange service footprint, distinct from N2. |
| W37.N6 | `nested.saltworks` | Same nested modules; original two-place water/export destination. |
| W37.N7 | `nested.archive` | Same nested modules; original two-place records destination. |
| W37.N8 | `feature.tidemark` | `src/feature_expansion_destination.js`, `_host.js`, `_native.js`; original two-place harbor. |
| W37.N9 | `pocket.folded_glasshouse` | `src/pocket_realm_{content,scenes,rules,host}.js`, `src/pocket_observation.js`, `src/realm_state.js`, `src/data/pocket_location.js:3-11`. One original room. Only scene names selected in `pocket_realm_host.js:23-28` are live consumers. |
| W37.N10 | `base.frontier` | Home/reference world. Original fork content and inherited YAIRPG tuning, not book evidence. G01-G19 and the leak table own the shared values under review; this lane does not recensus the entire vanilla game. |
| W37.N11 | `reedbank.district` | Additional source-built structured native world, registered unconditionally at `src/main.js:8286`; `src/local_livelihood_content.js:20-104`. Original local livelihood, two covered locations. |
| W37.N12 | `foundation_start.workroom` | Conditional source-built probe, `src/main.js:8285`; `src/foundation_start_content.js:1-84`. Original one-room fixture, not a book world or unconditional enrollment. |

**W37.N13: authoring registration is a separate census.** `src/main.js:423` calls `registerBookSubtletyCatalogue`; `src/feature_expansion_book_catalogue.js:10-23` registers 19 authoring profiles without creating worlds, bodies or stock. The four families are cultivation, recognition, situated and roster. `bindBookSubtletyWorld` requires a real native world/era/branch and command binding (`:25-40`); no call site in main binds another book world. The roster's HP/Naruto/Bleach/Paradise rows have `nativeWorldId:null`, unlike its Frontier row (`feature_expansion_book_roster.js:12-2838`). These profiles are source-rule/design inputs, not 19 additional native climates. Exact catalogue IDs: cultivation `fated-villain`, `reverend-insanity`, `regressors-tale`; recognition `mother-of-learning`, `lord-of-mysteries`, `circle-of-inevitability`, `shadow-slave`; situated `omniscient-reader`, `worm`, `legendary-mechanic`, `labyrinth-mad-god`; roster `original-frontier`, `reincarnation-paradise`, `skyrim`, `fallout4`, `elden-ring`, `naruto`, `bleach`, `harry-potter`. Registration alone supplies no climate, local purse or native schedule for these profiles. W30's HP household start and W31's LOTM/CoI/SS/TTKS proposals must not receive invented native fidelity scores. Skyrim, Fallout and Elden Ring: inert roster references, deprioritized, no extra native consumer established.

**W37.N14: dynamic boundary.** `src/content_packs.js:88-98` reads a private manifest at runtime; `src/main.js:8260-8286` stages optional/structured locations and definitions. Private payloads were not opened, so their installed world membership and authored facts are UNKNOWN. No claim that the built-in census is an inventory of the user's loaded browser. Source host defaults are audited below.

## W37.E: evidence and tagging rules

**SHOWN(source)** means a read code path, never an exercised outcome. **STATED(doc)** means a source pin in a world brief/dossier was read, not a fresh novel reread. **INFERRED** means this audit's classification, proposed consumer, harm ranking or test. No MEMORY claim is used.

Tags apply to world claims, not syntax: **B book/source**, **D derived**, **O original**, **P placeholder**. B includes qualified source-game facts for Proto23. D needs a stated transformation, not resemblance. O is a deliberate branch choice, even when its balance is temporary. P is a fallback asserting an unresolved external fact. A numeric original wage is not automatically a placeholder. UNKNOWN source climate is neither dry weather nor proof of no seasons.

| Key | Checked source owner / exact scope |
|---|---|
| W37.E-ML | `docs/worlds/mother-of-learning/WORLD_BRIEF.md`, “Source pins and actual choices”. Supplied WebToEpub SHA256 `e53f95695730fd58b70c9676f03cd2ee457521c60210515cea38c1a514aa2fcf`. MOL-C001-04/05, 1:p65-100 (access/certification); C001-06/07/10, 1:p114/129-134/155-156 (mana/train ward); C002-05/08, 2:p137-153/165-175 (invocation/shaping); C002-06/07, 2:p146-160 (physical fire); C011-06/07/08, 11:p94-117 (functional formula lamp). Cast/household/sewer pins C002-04, 2:p65-100; C011-03/04; C012-03/07; C014-02/03/07; C019-05/06; C024-04/05. Paragraph-level expansion of the latter claim IDs remains with the dossier. |
| W37.E-PD | `docs/gm/book-world-player-agency/source-fit/OPENING_AND_GOA.md`, exact source evidence and actor/means tables. Supplied English MTL SHA256 `67f15d112389a7e4a1218a9f0888b358c5c8f8bd6ab339d9df4ede50c76636e6`. sid3 p41-83 (Goa/king/task); sid5 p60-70 and sid6 p20-43 (Mia/dump); sid8 p40-46, sid9 p23-24,p50-60 (Hank/armory); sid18 p3-15,p34-45,p58-61 (office); sid20 p9-36,p58-65 and sid21 p3-19,p22-29,p39-56,p64-84 (fire/gate). Member hashes are retained in that owner and `PARADISE_COVERAGE.json`; do not turn spine IDs into Chinese chapter numbers. |
| W37.E-PN | Same PD actor/means table: sid11 p11-17 and sid16 p45-50 (maximum 76 then 91, +15, source gain); sid11 p40-72 and sid16 p60-65 (two +1 necklaces); sid20 p69-104 (crystal/claw). sid23 p14-18 and settlement evidence support the inferred pre-settlement 8.9%, not a live sid20 meter. Sword locator: sid9 p19-28,p40-57 card and sid20 p51 retention; source requirements Strength2/Dexterity5 are not implemented as native equip requirements. |
| W37.E-PC | W29.C and `paradise-hub/HUB_LIFE_ECONOMY_AND_PEOPLE_2026-10-14.md`: ordinary hub climate UNKNOWN; sid852 p7-10 and sid2347 p41-44 are crisis skies; sid2597 p53-59 is a later paid habitat with 7-8 hours simulated sunlight. sid26 p38,p52-56 role notices and sid1731 p9-10 employee discrepancy remain separate witnessed profiles. These facts do not license static20, a solar cycle or a rain cycle. |
| W37.E-P23 | `docs/worlds/proto23/WORLD_BRIEF.md`, “Source facts versus authored branch”. Official HTML revision `e93a8cd617932fb698ff889b968a32f9a20d48f3`, SHA256 `a43e55e2eeb455f1c1ae589e3fc074a588813fe6cd57cfba827dcf923f3755d5`. Place names in that brief; reading 1901-1910,12676-12690,13796-13804; bed/book furniture 1468-1489,1574-1583; fuel/fireplace 1558-1572,8233-8276,12865-12901; store/work 8940-8947,1638-1649,12307-12332. Source world/village proper name is unestablished. |
| W37.E-OR | `feature_expansion_nested_content.js:1-3,20-24`; `feature_expansion_destination.js:1-14`; `pocket_realm_content.js:3-4`; `local_livelihood_content.js:1`; `foundation_start_content.js:1-6`. Explicit original content. A Paradise frame source pin qualifies institutional distinctions, not Saltworks names, temperatures or economics. |

### W37.E1: exhaustive field coverage rule

The tables below use **claim families**, so each referenced declaration covers every value in its stated fields, including strings/prose and booleans. Apply O to **all** authored IDs/labels, branch rights, initial fact states, budgets, prices, wages, fees, durations, quantities, thresholds, capacity, XP, recovery/damage, schedule/controller intervals/priorities, cancellation/refund/once/repeat policy, body admission and local causal outcomes in the named modules unless a B/D/P exception below names that field or clause. Source conceptual exceptions do not promote neighboring numeric values. This avoids tagging a full line “book” when it contains a source name plus an invented wage.

This field rule covers the full six MoL and six Proto23 leaves; the eleven Paradise leaves; the nested and destination modules; and the original pocket/structured definitions named in N9/N11/N12. Schema/revision numbers, validation lengths, history caps (96/128/64), array indices, transaction sequence increments and error messages are implementation constants, excluded from the fidelity denominator. If a cap becomes a player-facing rule, it needs a separate O claim. Source hashes are source identity, not claims about world physics. `privateTruth`, author-only baseline contents and undiscovered observer records are not reproduced here. No registry or inspector proposal grants actor knowledge of them.

Bare JavaScript filenames in these tables resolve under `src/`; every full source path is printed again in the index. The scalar index gives file:line for numeric and boolean declarations throughout these modules. It is a navigation aid, not an alternative provenance policy. Negative costs and positive returned quantities keep their own owner; matching magnitudes do not imply a book conversion.

## W37.M: Mother of Learning claim ledger

All rows are SHOWN(source); B/D classifications rely on STATED(doc) W37.E-ML. Rows split sourced concepts from original local realization.

| Code / tag | Claims and exact source consumers | Qualification / replacement floor |
|---|---|---|
| W37.M01 B | Cyoria, academy, library, train/mana infrastructure: `src/book_world_mol_content.js:5`; `book_world_mol_actions.js:35,40,43,45-46`. | E-ML C001/C002/C011 pins. The authored arrival doorway is O. |
| W37.M02 B | Named Imaya, Ilsa, Ibery, Nora, Xvim, Taiven, Kael, Zorian and their institutional/craft roles; source clauses of descriptions: `book_world_mol_content.js:8-15,19-25,27`. | E-ML cast/household claim IDs; early joint availability is O. Detailed claims about family/private affairs are author-facing source facts, not automatic player knowledge. |
| W37.M03 B | Invocation versus shaping, personal mana versus ambient source, train wards, formula anchoring, ordinary combustion survives dispel: `book_world_mol_actions.js:35,42,45-46,59`. | E-ML 1:p114/129-134/155-156; 2:p137-175; 11:p94-117. No numerical mana reserve follows. |
| W37.M04 B | Key recognition, three lamp brightness levels and covered-face shutoff: source clause at `book_world_mol_actions.js:46,50`. | E-ML C011-06/07/08; three is a source requirement, not invented charge capacity. |
| W37.M05 D | Cube/ink reconstruction and test, paid retrieval/report, household/material collaboration mapped to counted native jobs: `book_world_mol_content.js:42-54`; `book_world_mol_actions.js:37-81`. | E-ML task patterns transformed into an independent visitor service arc. Every rate, cost and outcome below stays O. |
| W37.M06 O | All initial states, NPC purses/attention/mana and bodies/vitals: `book_world_mol_content.js:6-16,28-40`. Crowns/attention pairs 10/14,0/10,14/12,10/14,0/7,8/10,10/12,0/3,0/4; Nora18 and Taiven12 mana; health24/stamina18, two hands, human/mobile. | Finite proposed current budgets, not source character stats or canon peak capacities. Scavenger identity/role is original (`:16,26`). |
| W37.M07 O | Exact owned inventories and shop/watch stock `book_world_mol_content.js:29-38`; 13 item value 1/tags/descriptions `:41-55`. | Counted materials, local rights and manual lamp are authored. `Survey rope` is deliberate home cargo, not a source Cyorian item name. |
| W37.M08 O | Every wage/fee/price/recovery/duration/effort in `book_world_mol_actions.js:27-82`: house8+food/5min; room1/4min/+5stamina; meal1+food/2min/+5; pass2/2min; assessment2/3min; catalogue12+paper/6min; formula3/4min; assembly3/6min; calibration2/3min/6charge; control2/4min/1charge. Shop2paper/2crowns (three offers), ink1,cube2,oil1,bread1,rope1. | Numeric branch tuning. Three six-charge calibration opportunities (`:48`) are authored availability, not a book limit. Finite trader stock does not establish a city economy. |
| W37.M09 O | Device capacity6, zero initial charge/mastery; Nora anchoring2/recharge6, reserve18; Taiven4mana/4stamina/food/rope and4crowns; prepared2charge, ordinary2health, effort2/3 and smoke14: `book_world_mol_actions.js:28-31,42,47-50,77,129-136`; `book_world_mol_state.js:39,44-46`. | Independent nonmage interface and training thresholds are authored divergences. Recovery6 per6min for2crowns is not source mana physiology. |
| W37.M10 O | Retrieval90 occupied minutes, reward6, survey/tether/report/research/care/commission/notebook costs and quantities; failure injuries and conditions; mastery1/3 and Literacy4; controller2min; encounter nonlethal/two turns, negotiation2crowns+bread, social opponent health-4: `book_world_mol_actions.js:55-109`; `book_world_mol_state.js:55-57`; effects0.9stamina efficiency/0.85dexterity `src/book_world_effects.js:3-5`. | Lost watch is source-inspired; deadline, scavenger and local aftermath are not book outcomes. Additional exact O claims: ordinary survey2min/2stamina/paper versus lamp survey2min/1stamina/1charge/paper; tether2min/2stamina; delivered report2min/1stamina/paper; rush3health/3stamina/smoke14/burn20; treatment and research/commission terms at`:66-74`. Full scalar index retains every parameter on those lines rather than treating the headline examples as the whole inventory. |
| W37.M11 O | Same human body, zero-time bidirectional doorway, cargo retained, no other entry powers; independent continuous no-reset branch/frozen absence; workshop capacity1, no free source grants: `book_world_mol_ids.js:1-13`; `book_world_mol_state.js:11,24`; `book_world_mol_host.js` enrollment and movement. | The supported body requirement is an adapter limit, not a universal MoL species law. Canon loop rules do not apply to this branch (W30). |
| W37.M12 P | Every one of seven places `is_under_roof:false`, `is_temperature_static:true`, `static_temperature:20`, `light_level:'normal'`: `book_world_mol_native.js:103-106`. | No E-ML climate locator supports them. Household/library/workshop roof denial also contradicts the authored room fiction. `normal` enables home-night mechanics; it is not fixed normal illumination. |
| W37.M13 P | Local epoch1/1/1 06:00, 60/24/30/12 calendar and calendarSeed: `book_world_mol_native.js:7,19-20,88`. | Local elapsed ownership exists; canon epoch/season mapping does not. Preserve elapsed and exact-save reader before replacing its calendar projection. |
| W37.M14 O | Supply-counter name, margin1, refresh_time4 but overridden refresh/can_refresh false and last_refresh0; locked trader; quest prose/empty rewards; location availability: `book_world_mol_native.js:84-106,111-116`. | Four is inert constructor metadata, not a four-day source supply schedule. Native custom crown purchases bypass legacy trade. |

**Floor:** SF1/KX82 partial in code comments and this external ledger; per-field source metadata missing. K28/source-climate missing. Proposal: retain the visitor arc as original, source-pin only its conceptual clauses, represent climate/light as UNKNOWN until qualified and give indoor authored rooms an explicit local exposure policy. **More to consider:** lamp brightness testing currently proves a local device task, not a night-light modifier; do not silently claim it cancels the home-night penalty. W30's future loop calendar must remain a separate profile from this continuous clock.

## W37.P: Paradise hub and Goa claim ledger

| Code / tag | Claims / code locator | Source or qualification |
|---|---|---|
| W37.P01 B | Paradise institutions and employee/contractor distinction: `book_world_paradise_content.js:5`; source clauses in `book_world_paradise_actions.js:66-75`. | E-PD sid26 p25-65, sid27 p1-32, sid28 p1-45. Desk, employee identity, availability beside first Goa and fees are O. |
| W37.P02 B | Goa/Gray Terminal, Mia, Hank, Su Xiao, Philip Herbert, supplied-MTL Krieg alias, guardhouse/palace/dump causal roles: `book_world_paradise_ids.js:6-7`; `book_world_paradise_content.js:15-19`; source clauses at `book_world_paradise_actions.js:76,81,83-84,88,118-142`. | E-PD opening/Goa windows. Labels qualify the novel's franchise rendering. Rin and the hub service worker are O, not sourced named cast. |
| W37.P03 B | Source notice tomorrow18:00, distinct midnight task reference: `book_world_paradise_actions.js:83,139`; `book_world_paradise_campaign_content.js:61`. | E-PD sid20 p9-36,p58-65; not a conversion into played minutes. |
| W37.P04 B | Damaged sword source description35/40, Fear/Shock; two +1Strength necklaces, claw and small crystal: `book_world_paradise_content.js:26,37-40`; `book_world_paradise_actions.js:84`. | E-PN gear windows. Exact sword stat card retained by OPENING_AND_GOA actor/means table. Value1, current native durability/use/damage and NPC budgets are O; owning a source drop grants no player bonus. |
| W37.P05 B | Soul Eater maximum91 last sourced, awakened source and guard-chief status; prior pistol seen at sid6 p69-70 but current custody unknown: `book_world_paradise_host.js:62`; `book_world_paradise_actions.js:135,159-160`. | E-PN sid3 p19, sid11 p11-17, sid16 p45-50; E-PD sid18 office. Unknown current mana is an explicit evidence limit, not zero spendable mana supplied by canon. |
| W37.P06 D | 8.9% pre-settlement source total inference: `book_world_paradise_host.js:62`. | E-PN sid16 gain plus later settlement and no Source from king. Keep inferred/last-sourced text; no native spend/reward consumer. |
| W37.P07 D | Source fire/gate/king/actor motives mapped into conditional branches/controllers and record delivery: `book_world_paradise_actions.js:118-155`; sourced-item native carriers `book_world_paradise_content.js:35-40`. | E-PD sid20-23 causal pattern. Alternative warning, bargaining, rescue, shelter and exact order remain O. Two initial casks are authored operational stock, not a sourced total barrel count. |
| W37.P08 O | All initial facts; purses, agenda, attention; human2hands/mobile, health24/stamina16; NPC inventories/stock/site capacity1: `book_world_paradise_content.js:6-32`. Employee coin18/attention8; Rin belli12/attention8; Mia0/8; Hank8/agenda4/attention5; Su4/4/4; Krieg4/3/3; king8/3/3. | Finite opposing budgets, not source power/stat conversions. NPC necklaces/crystal/claw identity/count exception is P04; other counts O. |
| W37.P09 O | All packing/porter wages8, 3/5min, stamina2 and Equilibrium5; lesson2credits/3min; shop kit2,rope1,ration2; Goa2logs/2belli,rope1,ration1; rest1/4min/+4; meal1/2min/+4: `book_world_paradise_actions.js:46-80`. | Do not replace prototype prices with sid28's different three-coin meal as if same service, currency or era. Root SF8/W29 preserved. |
| W37.P10 O | Cache logs1/2, duration4/6, stamina1/2, capacity3/2, XP8/5; warn4min; direct report2min/1stamina; cask bargain2belli/3min/two casks; palace access2belli; warning2min: `book_world_paradise_actions.js:56-64,88-106`. | Voluntary local outcomes and finite means, not canon rescue capacity or an institution's tariff. |
| W37.P11 O | All NPC job durations/stamina/funds/agenda, local fire trigger54, Su movement42, 2min controllers and priorities; non-source aftermath: `book_world_paradise_actions.js:118-155`. | Source order and motives do not establish authored clock conversions. Player warning can change the later king opportunity; do not restore the baseline by timer. |
| W37.P12 O | Optional survey reward4/partial1/deadline90/extraction2; frozen absence, independent_parallel entry, instant human/cargo routes, two separate parent-null instances: `book_world_paradise_state.js:8-14,24-36`; `book_world_paradise_host.js:79-85`; `book_world_paradise_carriers.js:8,30-37`. | Deliberate branch contract. Source72h Hunter mission/30sec return do not transfer; native common/presence rate1:1 is O, not sourced universal world flow. |
| W37.P13 O | All extended workshop/rigging/bench/orders: two logs+rope+2stamina/5min; paid2credits/4min, self7min/4stamina; practice3min/2stamina/mastery up to3; kit4min/3stamina or2min/1stamina; two commissions3credits/2min: `book_world_paradise_campaign_content.js:63-100`. | Original physical craft. Counts, right to build, method compatibility and stock exhaustion are all proposals. |
| W37.P14 O | Rescue assembly58/danger60/deadline72, wrap20min, recon3min, three-turn scene nonlethal flag, all health/stamina/cloth/food/rope/belli response costs; smoke16/bruise18, recovered+3health/+2stamina: `book_world_paradise_campaign_content.js:12,101-127,169-221,239-243`. | O72min is not source72h. `lethal:false` on the encounter does not prevent later NPC death when the danger closes (`:178-181`). |
| W37.P15 O | Hank kit2belli/3min, salvage1beam/4min, sheltercapacity2/log1or2/4or6min, shelter kit3min, all postfire orders/records, sitescapacity1/control2/mastery3; native condition multipliers0.9: `book_world_paradise_campaign_content.js:128-166,230-243`; `book_world_paradise_campaign_facts.js` and `src/book_world_paradise_campaign_runtime.js`. | Existing care/method/stock owners, not canon medicine or general fire immunity. Full scalar index covers every threshold, duration and multiplier. |
| W37.P16 P | All seven places unroofed, static20, normal light: `book_world_paradise_native.js:103-106`. | Hub2 and Goa5 separately. E-PC establishes neither public ordinary hub climate nor Goa's numerical weather. A paid booth/guardhouse still inherits outdoor rain. |
| W37.P17 P | Epoch1/1/1 06:00 and 60/24/30/12 calendar for both: `book_world_paradise_native.js:7,19-20,88`. | Real local elapsed ownership; unsourced calendar labels. Neither calendar is evidence of a sourced shared epoch with each other. |
| W37.P18 O | Margin1/refresh4 disabled, supply-counter names, quest/room descriptions and two stock owners: `book_world_paradise_native.js:84-106,111-116`. | Native shop availability stays false; custom local money owner is deliberate. |

**Floor:** provenance partial (edition hash, source notes and explicit original fees), per-field metadata missing; environmental K28 missing. Proposal: close the actual home-rain path with UNKNOWN local environment, preserve authored finance and deadlines, then source one place/era at a time. **More to consider:** war sky is an event signal, paid habitat a later room override, employee calendar notices conflict by witness/era. None should become a world-wide season toggle (W29.C5-C7). Original nested hub must never inherit “canon” tags from its name.

## W37.T: Proto23 claim ledger

| Code / tag | Claims / code locator | Source or qualification |
|---|---|---|
| W37.T01 B | Village Center and Dojo lobby source place-name stems: `proto23_world_ids.js:10`; `proto23_world_content.js:3-5`. | E-P23 place audit. Prefixes and “Proto23 village” are O attribution metadata, not the source village's proper name. |
| W37.T02 D | Time-occupying reading, counted useful bed/hearth/bookstand and fuel/material service ideas: `proto23_world_content.js:52-64,87-117,138-144`. | E-P23 reading/furniture/fireplace locators. Native jobs are deliberately different: no passive source XP, inherited deed or original pupil. |
| W37.T03 O | Mara/Toma, cottage and all prose about their rights, finite demand and ordinary methods: `proto23_world_content.js:17-23,68-86`; `proto23_world_ids.js:10,20-30`. | Source people/property not copied. Both human2hands/mobile, health24/stamina18; purses12/0 and attention10/6. |
| W37.T04 O | Stockbed1/hearth1/bookstand1/log14/sap6/knife2/paper3/ink3, tutor sharpknife1; shop pricesbed2/hearth2/bookstand1/log1/sap1/knife2/paper1/ink1: `proto23_world_content.js:9-16,47-51,81-82`. | Exact prices/counts invented. Explicit home native-coin acceptance (`:29,51,71`) is an authored exchange rule, not an accidental currency leak. |
| W37.T05 O | Sorting8coins/5min/2stamina; cottage2coins/2min; reading1coin/6min; instruction2coins/4min; practice3min/2stamina; installation2min/1stamina: `proto23_world_content.js:54-59,72-91`. | All fees/durations/attention costs, once/repeat flags and completion/refund policies O. |
| W37.T06 O | Shape3or5min/2or3stamina, one log→one wet stave+two green offcuts, knife returned dull; bed4min/up to4stamina; sharpen1sap/1stamina/3min; drying1fuel log/1stamina/4min; compare3min/1stamina; notebook4min/paper+ink/1stamina; review4coins/2min: `proto23_world_content.js:59-64,90-125`. | Original useful material loop, no copied source Sword Mastery or free book XP. Cyorian paper/ink item IDs (`proto23_world_ids.js:17`) are intentional shared catalog material, but local commodity naming is a design concern. |
| W37.T07 O | Useful home kit3min/1stamina, source body/owned tools/no copied mastery, fixed cottage sitescapacity1, itemvalue1: `proto23_world_content.js:126-154`; human/cargo/absence rules `proto23_world_host.js`, `proto23_world_state.js`. | Exporting the notebook is physical custody, not export of source entitlement. |
| W37.T08 P | Static20, static-temperature true and normal light for all 3 places: `proto23_world_native.js:129-132`; local epoch/calendar `:7,19-20`. | No pinned source climate or native period/epoch. |
| W37.T09 D | Center unroofed, dojo/cottage roofed: `proto23_world_native.js:130`. | Inferred physical exposure from E-P23 place meanings; cottage itself O. This is a derived local placement decision, not evidence of sourced rain or indoor light. |
| W37.T10 O | Supply counter margin1/refresh4 disabled; quest/description and locked availability `proto23_world_native.js:110-132,137-142`. | No home daily/visit refill. Source guarding20:00 payout is not implemented here. |

**Floor:** field provenance partial; local climate/calendar missing. Proposal: keep all native economics explicitly original, replace the 20°C/default light readings with unavailable or authored room conditions. **More to consider:** paper named Cyorian may look like a world leak even where sharing is intentional. Keep material identity but allow local market labels; do not rename inventory IDs or convert prices silently. The latest full-source Proto23 research is an absorption menu, not proof these native branch rates are copied from that source.

## W37.O: other native worlds and profiles

Every original label, description, fact, number, schedule, effect, danger/outcome, count and flag in these definitions is O, with the P environmental exceptions below. Source framing does not make them book claims. This is an exhaustive field rule, including less visible NPC costs, priorities and passage settings; the scalar index gives individual source lines.

| Code / tag | World / complete claim families | File:line and concrete values |
|---|---|---|
| W37.O01 O | Nested hub: Mara/Lin/Oren, workroom, roles/permissions, finite people/stock, shifts/rest/care/refit/pressure lessons and return obligations. | `feature_expansion_nested_content.js:6-32,56-73,75-93`; `src/feature_expansion_nested_native.js:55-76`. Purses24/12/0; agenda2, attention3; health24/stamina12, human2hands; shift6min/4credits, rest2credits/4min/+10health/+10stamina, staffrest1credit, care2credits/3min; exact remaining values indexed. |
| W37.O02 O | Saltworks: Sela/Brin and water/export conflict, stock, repair/haul/demand and agreement outcomes. | `feature_expansion_nested_content.js:17,22,30,34-36,39-40,58,61-68,94-104` plus remaining local commands. Initial purses4/6; foreman attention5/haulDemand2; mission reward8/partial3/deadline30/extension15/cost2/extraction3; followup3/0/24/+12/cost1/extraction2. |
| W37.O03 O | Archive: Tess/Ada/Ivo, witness/record/custody/claim, press/evidence work and refusals. | `feature_expansion_nested_content.js:18,23,31,37-38,41-42,59,61-68,105-118` plus remaining local commands. Purses6/3/2; initial mission7/partial3/deadline36/extension12/cost2/extraction2; followup3/0/24/+12/cost1/extraction2. |
| W37.O04 O | Nested destinations and hub connections, role approval, currencycredit, absencefreeze, source-independent pressure capability, controller/extraction/extension/refund semantics. | `feature_expansion_nested_host.js` and `src/feature_expansion_nested_content.js:25-43,69-73`; counter names/margin1/inert refresh4/no refresh `src/feature_expansion_nested_native.js:55-58`. All are original profile rules, not Paradise canon. |
| W37.O05 P | Nested temperature/static/normal light and synthetic epoch. | `src/feature_expansion_nested_native.js:7,11-12,75-76`. Saltworks17°C (landing+enginehouse); hub20°C (both places); Archive20°C (both). No climate qualification. Roof distribution only Saltworks landing outdoors, rest indoors is O local architecture, not a sourced flag. |
| W37.O06 O | Tidemark names/Nessa/Venn, all local descriptions/access/stock/skills/payments/loans, low-tide9 of12local minutes, one kit reward reserved, log2coins/kit5coins, passage1coin. | `feature_expansion_destination.js:1-80`; `src/feature_expansion_destination_host.js:13-15,44-63,115-162`; `src/feature_expansion_destination_native.js:52-60`. NPC purses2/3, human2hands; timber2logs/2stamina/6min; lesson2coins/3min; balance1kit/2stamina/2min. Native money explicitly shared, no source currency claim. |
| W37.O07 P | Tidemark static16°C/normal light and synthetic calendar. | `src/feature_expansion_destination_native.js:8-10,58-60`. Covered dock and exposed terrace are O local architecture. Tide clock is O, not P just because compressed. |
| W37.O08 O | Glasshouse room/Joss/folding pane/frame/refuge/bench, all repairs/research/trials/furniture, material/energy/sensory/observation policies and actor records. | `pocket_realm_content.js:28-45,89-237`; `pocket_realm_scenes.js:20-261` only selected scenes per `src/pocket_realm_host.js:23-28`; `src/pocket_realm_host.js:35-49`; `src/pocket_realm_rules.js:4-7`; `pocket_observation.js` source policy. Joss6coins, health20/stamina10; meet6logs/3kits/1template, offer8occupied minutes; ordinary2logs+kit+2stamina/4min; learned1log+3drive+1stamina/2min/control1/mastery2; caretaker5min. Opening1coin; bench contribution1coin; home pack2logs+2stamina/3min→2kits. |
| W37.O09 P | Glasshouse warm-room claim has no local thermal binding; dynamic home climate inherited through omitted fields; normal light. | `src/data/pocket_location.js:8-10`; `models/location.js:95-100,181-186`; `weather.js:71-104,111-188`. Rooftrue is O; it blocks direct rain, not temperature or home-daylight stat readers. |
| W37.O10 O | Reedbank: every person/item/start/fee/work/benefit/schedule/description and covered2 places; one/two-hand adult starts. | `local_livelihood_content.js:1-104`. Access2coins; basket1offcut/2min; crate1offcut/3min; joint2min splits4coins into3+1; coatvalue1/defense2/weight1/layer1; bodyhuman/mobile and exact resources at`:96-104`. No return route currently is an explicit authored branch fact. |
| W37.O11 P | Reedbank omitted climate/light/date mapping, host defaults even when underRooftrue. | `local_livelihood_content.js:97`; `main.js:8265`; `models/location.js:176-186`; legacy readers in leak table. Indoor cover is O, not proof of20°C or solar timing. |
| W37.O12 O | Conditional foundation fixture: every start/item/method/reserve/renewal/number is an original test-world choice. | `foundation_start_content.js:1-84`; two/single hand adult starts, shape2/3min, refit1min; masteryThreshold2, resetmastery1/reserve0, same body/history/stock. |
| W37.O13 P | Foundation omitted local climate/light/epoch, through same source host defaults. | `foundation_start_content.js:44-57`; `main.js:8265`; `models/location.js:176-186`. No evidence this conditional probe is active in a user's current browser. |

**Floors:** original identity/economy provenance met as a declaration, field metadata partial; local environment provenance missing for N5-N9/N11/N12. Proposal: retain deliberate original numbers, explicitly adopt a local authored climate or UNKNOWN; separate roof, precipitation, thermal conditions and light. **More to consider:** shared names Mara and Venn are different actors in several original worlds; same-name text is not an ID collision or evidence of person travel. Explicit namespaced body/purse ownership already prevents simple aliasing. Per-instance markets and fixture capacity still need copy-safe IDs when real copies are introduced.

## W37.H: home-world leaks, ranked by visible harm (KX84)

All paths are SHOWN(source), unexercised. Harm rankings and proposed dispositions are INFERRED. Holding local world/instance/place/elapsed constant while changing only Frontier calendar is the proposed isolation probe. Continued aging of the same carried player's effects is not itself a home-world leak.

| Rank / code | Source → reader → effect, with file:line | Reach / consequence / disposition |
|---|---|---|
| 1 W37.H1 | `game_time.js:193-195` global clock → `weather.js:194-196` day_count%13rain → `main.js:699-701` nativeRain even when homeWorldfalse → `absorb_e1/pacing.js:67-78` unconditional nativeRain OR → `main.js:7446-7462` unroofed exposure, threshold10 (`data/character.js:10`), `add_active_effect('Wet',30)` → `active_effects.js:44-51` cold_tolerance-5. | All7MoL, all 7 Paradise/Goa places, Proto23center, Saltworkslanding, Tidemarkterrace exposed. Indoor book places can become Wet. This is a shown state-changing path; no observed gameplay reproduction is claimed. Wet does not immediately prove Cold at static20. ACCOUNT NOW for W36 integration. |
| 2 W37.H2 | `game_time.js:3-6,188-191` home night20:00-04:00 → `models/hero.js:173-179` normal light/night sets attack/evasion multiplier `0.5+0.5*NightVision/max` → `main.js:1040,7335` day/night stat refresh. `main.js:7829` normal/night also admits night XP. | Every native place with normal light, including roofed interiors. Rooftrue does not fix stat light. Source stat/display effect SHOWN; actual changed encounter outcome not established (book encounters may use scripted costs). Rank above cosmetic climate; propose local light or UNKNOWN policy, no fabricated permanent bright world. |
| 3 W37.H3 | Glasshouse/structured location omit local climate (`data/pocket_location.js:8-10`, `main.js:8265,8281`) → `models/location.js:95-100,181-186` dynamic defaults → `weather.js:5-51,111-188` season offsets-20/-5/0/-8, home hour peaks and cycles/smoothing → `main.js:7447,7539-7550` cold counters/effects/Cold-resistance XP; `display.js:4229-4258` readout. | Static20/16/17 worlds block temperature variation, but Glasshouse and default structured rooms do not. “Warm panes” can display cold home winter conditions. Actual Cold depends on carried tolerance; no unattended damage claim added. Shared smoothing cache is global (`weather.js:7,117-142`), a cross-world cache hazard for dynamic profiles. |
| 4 W37.H4 | `main.js:1293-1313` native occupied minutes also advance global Game_Time → joined publication`:990,1025` → update tick`:7430-7438` global-day crossing → `market_saturation.js:76-108` recover_item_prices/trickle_market_saturations → item valuation `items.js:269-299`. | Home-market price state changes while visiting another world. Static book custom quotes do not read that price function; harm is returning to changed home prices or using globally valued goods, not proof that a crown quote changed. Default clarify intended home economic passage-of-time policy; Dial explicit freeze or shared ongoing home market. This audit does not silently select one. |
| 5 W37.H5 | Same joined global calendar advance → `display.js:4221-4226` home date/time/day label; `main.js:2380` global season to customization, `:8537` setting readers; native local calendars separately derive from elapsed in adapters. | Shared header can contradict N1/N2/N3/N4/N5-8local6am epoch. Home season palette may shift while local climate UNKNOWN. Both display changes SHOWN, local schedule mutation from header alone not established. Preserve home clock for return but label/project the active local date separately. |
| 6 W37.H6 | `weather.js:194-219` global rain/light → `display.js:4250-4258,6049-6057` rain/snow icon and background visibility; `main.js:7465-7507` rain/snow/stars; `main.js:8541-8542` quiet place detail receives global rain/daylight. | Exposed places show unearned rain/stars; all normal-light places may use solar colors. A quiet detail reader is a separate consumer and may leak after header repair. Global simple Day/Night flips21:00 (`game_time.js:85`), stats flip20:00, so two inherited home displays may disagree. |
| 7 W37.H7 | `main.js:811,837-843` inject home hour, rain, damp, villagecircle8-10 and everydayFacts; `main.js:570-575` structured equipment passes unroofed rain and hot>25/cold<5 into existing item projector with0.1penalties. | SHOWN injected home facts; equipment branch additionally requires an active structured definition. Do not claim all MoL gear takes this penalty. Local book predicates currently use their own support, coin and elapsed facts; inherited weather facts remain a live input hazard for subsequent commands. |

### W37.H8: G01-G19 disposition and guarded paths

| W23 input | Current trace result |
|---|---|
| G01/G02/G03/G04/G05/G16/G18 | H1-H3/H5-H7 demonstrate actual state/display readers. Local clocks exist, yet do not bind all environmental consumers. Local calendar30day/12month/6am is P canon mapping, not proof of a shared native epoch. |
| G06 schedules | Native MoL90min and Paradise54/42/58-72 triggers use retained instance elapsed (`book_world_mol_state.js:55-57`; `book_world_paradise_actions.js:118,138`; `book_world_paradise_campaign_content.js:12,169-181`). Tidemarktide uses elapsed%12 (`feature_expansion_destination_host.js:48-56`). No shown home-hour alteration of those actual local schedules. O local schedules remain separate from H7's injected home facts. |
| G07 trader epochs | Generic trader reads home day_count (`components/trader_component.js:87,98-113`), but MoL/Paradise `book_world_mol_native.js:84-87`, Proto23`:110-113`, nested`:55-58`, Tidemark`:52-55` replace refresh and can_refresh withfalse. Thus no shown periodic stock refill leak in these adapters. Refresh_time4 is inert. Locked legacy trader availability prevents crown/belli/credit bypass; adapters' snapshot validators enforce that lock. Glasshouse has no native TraderComponent. |
| G08/G09/G10 money/prices | MoLcrowns, Paradisecoin/belli and nestedcredit quote through explicit resource keys (`book_world_mol_actions.js:9,27`; Paradise`:10,62-64`; nestedcontent`:48`). Proto23 and Tidemark intentionally accept shared native coins (`proto23_world_content.js:29,51,71`; destination`:37-38,55-58`). Generic formatter remains Frontier denominations (`display.js:4310-4334`); context-free purse UI can mislabel expectations but does not convert source currency. H4 proves home sold-ledger change; no proof local custom prices inherit saturation. |
| G11/G12 names | Current named native residents use explicit labels, not home grammar. `name_grammar.js` default/`generated_people.js` are a potential missing-context route, not shown renaming of Mia/Imaya/Toma. `main.js:8553` passes actual expansion context. Different Mara/Venn are authored labels, not automatic name leakage. |
| G13 aging | Home NPC-life years can advance when global calendar advances; source native residents here use their separate bodies/life state and no shown native old-age scheduler. `main.js:5347` advances Village lives on save using home year, not a canonical lifespan claim about book residents. |
| G14 threats | Native SafeLocation default `types:[]`, no parent combat-zone roster (`models/location.js:91,170-189`) and explicit local/empty NPC/connection lists prevent automatic wolf-rat spawning. SafeLocation is O represented UI/travel safety, not proof the source sewer/Goa is harmless; actual book danger is command/encounter-owned. |
| G15/G17 home life/furnishings | Frontier/Shack locations and world conditions remain local. Cross-world material/home consumers are deliberate O seams, e.g. Proto23 notebook kit (`proto23_world_content.js:126-136`). H7 shows fact contamination, not universal paid village jobs/cottage ownership in every world. |
| G19 migration | `save_compatibility.js:26-38` retires exact Jade Hollow references; no shown relocation of current retained native-world IDs. Do not generalize migration danger into a claimed active leak. |

**W37.H9: existing carried state.** A character may enter already Wet, injured or holding home coins. That is retained-body continuity, not proof local rain created Wet. A future local UNKNOWN policy should stop *new home-caused exposure* while retaining legitimate existing effects and their normal duration owner. The current roof branch `main.js:7510-7523` also does not run the outdoor dry-weather rain_counter decrement (`:7484-7486`), so a dry-looking indoor transition can retain exposure; test this separately from false local precipitation. Never erase an existing debuff simply to make a leak assertion pass.

## W37.R: placeholder registry (KX82)

One row is a replacement task family, with affected place expansion explicit. These are P values, not new source facts. A source/book field stays UNKNOWN until qualified; an original setting can instead intentionally adopt an O value with its in-world reason.

| Code | World / affected values | Source locator / proposed replacement |
|---|---|---|
| W37.R1 | MoL7 places: static=true,20°C,roof=false,normal light; synthetic date epoch/calendar. | M12-M13. Default UNKNOWN local weather/date and authored indoor exposure; Dial qualified region/season. Avoid inventing canonical20°C in the library. |
| W37.R2 | Paradisehub2 places: static=true,20°C,roof=false,normal light; synthetic date. | P16-P17. Default unknown ordinary public climate; Dial witnessed event sky/room override under E-PC. No automatic perpetual spring or world-wide climate control. |
| W37.R3 | Goa5 places: same flags20°C/normal/exposed and epoch. | P16-P17. Default separate child environment; Dial source-window-qualified surface weather. Same novel and shared code are insufficient provenance. |
| W37.R4 | Proto233 places: static=true,20°C,normal; synthetic date. | T08. Derived roof split stays T09, does not supply rain. Dial explicit original visitor-room condition if source audit cannot establish it. |
| W37.R5 | Original nestedhub2 places: static20/normal and epoch. | O05. Default declared original room climate or UNKNOWN; Dial exposed local street region when authored. Existing rooftrue is deliberate O geometry. |
| W37.R6 | Saltworks2 places: static17/normal and epoch. | O05. Default qualify the coastal/enginehouse conditions separately. Seventeen has no source support even though plausible. |
| W37.R7 | Archive2 places: static20/normal and epoch. | O05. Default local indoor reading conditions with an O reason; do not infer sunlight from “Lamplit”. |
| W37.R8 | Tidemark2 places: static16/normal and epoch. | O07. Local tide9/12 is deliberately O; only unsupported temperature/light/calendar assumptions are P. |
| W37.R9 | Glasshouse1 room: dynamic inherited home climate, normal/home daylight and home date projection. | O09/H3. Default an authored enclosed-room profile or UNKNOWN, keeping real opening flows separate from exterior precipitation. |
| W37.R10 | Reedbank2 places: omitted local thermal/light/date policies; normal/default dynamic host values. | O11. Default authored covered-stall/lane conditions or UNKNOWN; one/two-hand starts do not supply a climate profile. |
| W37.R11 | Conditional foundation1 room: omitted local climate/light/date. | O13. Default explicit original stable fixture environment; keep probe-only status. |

**W37.R12:** Exact local service fees, mortal budgets, short job durations and one-time finite offers are O balance debt, not P source debt. Source descriptions that overstate an unverified fact should be P even without a number. Unknown source money/gear custody is an evidence limit, not a license to seed an item. The index below uses this distinction.

## W37.C: fidelity counts per world (KX83)

These are **tagged claim-family counts**, not percentages of a novel implemented and not literal-token counts. The stable unit is one homogeneous row in the ledgers M/P/T/O, attributed to each world it affects. A row can cover a vector of stock or prices; that vector is not misleadingly counted as one verified scalar while ten placeholder flags inflate another denominator. Per-field expansion into schema metadata is LATER. Counts can be recomputed directly from the row IDs below; “O” is deliberate fiction, not lower quality than “B”.

| World | B | D | O | P | Counted rows / scope |
|---|---:|---:|---:|---:|---|
| MoL | 4 | 1 | 7 | 2 | M01-M14. |
| Paradisehub | 1 | 0 | 7 | 2 | B:P01; O:P08,P09,P12,P13,P14(shared enrollment terms only),P15(shared method/return terms),P18; P:P16,P17. Shared families do not imply a hub rescue scene. |
| Goa | 4 | 2 | 10 | 2 | B:P02-P05; D:P06-P07; O:P08-P15,P18 plus original local place/right realization in P02; P:P16-P17. The final O subfamily is counted separately because P02's source identity must not promote invented access rights. |
| Proto23 | 1 | 2 | 6 | 1 | B:T01; D:T02,T09; O:T03-T07,T10; P:T08 (date and environment grouped). |
| Nestedhub | 0 | 0 | 2 | 1 | O01,O04,O05(P). Institutional framing is qualified context, not a book-coded weather row. |
| Saltworks | 0 | 0 | 2 | 1 | O02,O04,O05(P). |
| Archive | 0 | 0 | 2 | 1 | O03,O04,O05(P). |
| Tidemark | 0 | 0 | 1 | 1 | O06,O07(P). |
| Glasshouse | 0 | 0 | 1 | 1 | O08,O09(P). |
| Reedbank | 0 | 0 | 1 | 1 | O10,O11(P). |
| Conditional foundation | 0 | 0 | 1 | 1 | O12,O13(P). Conditional source fixture, not a current enrolled player world. |
| Frontier | n/a | n/a | reference | n/a | Home reference only; whole vanilla scalar census is outside this bounded lane. |
| Inert 19profiles / dynamic private payloads | n/a | n/a | n/a | n/a | N13/N14; absence of native binding is not a zero-placeholder native world. |

**W37.C1: expanded environmental debt.** The static adapter subtotal is **25 locations**: MoL 7, Paradise 7, Proto23 3, nested 6 and Tidemark 2. Adding Glasshouse 1, Reedbank 2 and the conditional foundation 1 gives **29 source-built locations** excluding Frontier. At each static location there is one numeric temperature assumption and one normal-light policy; MoL/Paradise also have14 unsupported roof flags. Synthetic date mappings are counted once per world, not once per field or place. This expansion is a locator-backed debt inventory, not a source fidelity percentage.

## W37.BR: W36 branch read, no checkout

Read only with `git show kit/w36-calendar-climate`. First inspection found W28 prototype tip `024d4da98268cd04b7d534e796d94c97bb6f6837`; final refreshed inspection found **`45c75e9cd2fd8e792756599a5ee50dfbc78d1dd8`**, “Keep home rain out of visitor worlds (kit CR8)”. The live checkout still has the old `main.js:699-701` nativeRain path. W36 branch source and live source findings must not be conflated. These branch-qualified paths below are not live-tree locators.

| Code | SHOWN at W36 branch tip | Consequence / remaining design question |
|---|---|---|
| W37.BR1 | `src/main.js:707-712` computes atHome from actor world and gates `nativeRain:atHome&&!!is_raining()`. | Closes H1's shown pacing/Wet input for non-Frontier actor IDs on that branch. No W37 execution proves tick behavior. It does not change legacy `is_raining()` readers used elsewhere or give a visitor local weather. |
| W37.BR2 | `src/world_calendar_content.js:7-26` defines fixed60/24/30/12 profiles for Frontier/MoL/Paradisehub/Goa, existing anchors; visitor seasonsfalse; hub elapsed format. `src/world_calendar.js:54-64` selects active retained instance, no undeclared-world fallback. | O explicit legacy date projection, not B canon calendar. `:47-52` deliberately reuses physical home20:00 daylight algorithm on local time. Source calendar gaps remain; Proto23/nested/Tidemark/Glasshouse/structured worlds are not mapped here. |
| W37.BR3 | `src/world_calendar.js:66-83` creates session-only date log with per-instance/profile day identity; main`:403-408` binds local date/weather reads; branch display`:4235-4243` uses local weather words before its legacy numeric reader. | Meaningful display seam, no new saved clock. Existing main top date still uses global Game_Time; local-date notification does not by itself fix H5/H6 across every surface. |
| W37.BR4 | `src/world_weather_display.js:3-19`: hub returns “Weather unknown”; MoL proposed base17/indoor18/light60, Goa proposed base28/indoor24/light60, seasonsnull, seededCyclesfalse, derive seed0, weather words explicitly “climate proposal”. | These numbers are **O labelled proposals**, not B, and not silent P defaults. Existing unroofed flags mean most book rooms are still treated outdoors by this display projection. Mechanical weather/hero light/temperature remain their old readers, so display proposals can disagree with effects. |
| W37.BR5 | `src/world_climate.js:11-121` retains finite-temperature validation, outdoor/indoor/sealed environment and home-based cycles; no UNKNOWN-temperature profile. | Hub UNKNOWN is handled by the display bypass, not the pure climate helper. Do not replace it with proposed sealed18°C and call it canon. Keep no-rain-source distinct from dry-weather assertion. |

`W36_SLICE.md` in the branch reports its own test/build results and explicitly leaves integrated desktop, persistence and human acceptance gates OPEN. W37 did not run or adopt those checks as its own. The branch tip's later rain guard postdates its recorded rebuilt candidate; no post-guard served-byte or browser proof was established by W37. The branch report path requested during inspection was absent from committed tip; the committed slice owns the evidence read. Re-read the later tip at integration. No W36 source, worktree or report was edited.

## W37.Q: exact leak tests to add, not run

Proposed file names and literal test names below are INFERRED. Add nothing in this lane. Fixture builders should create generated disposable envelopes and real retained native bindings, never open a private user save. Unit/source adapter checks and rebuilt desktop journeys remain separate gates. Use both rainy home day_count4 and dry day_count3 at equal native elapsed; day/night19:59/20:00 and simple-label20:59/21:00; a home season boundary; then save/reload/literal-file import. Proposed expected behavior requires a future local environment policy, so several tests should fail on current source.

| Code | Proposed test file / exact test name | Exact assertions |
|---|---|---|
| W37.Q1 | `tests/native_world_source_fidelity.test.js`: `unknown_paradise_hub_does_not_inherit_frontier_rain_or_create_wet` | At both hub locations, build matched fixtures with equal local instance/elapsed/place/body and vary only home day_count3→4. Advance 11 one-minute real host ticks in each fixture from rain_counter0 and noWet. Assert local precipitation remains unknown, no newWet, counter does not gain home-rain exposure, displayed value is unavailable instead of20°C, no rain/snow icon or animation. Assert existing local jobs/purse/stock unchanged except the deliberately advanced job clock. |
| W37.Q2 | Same: `goa_environment_uses_child_policy_not_hub_or_frontier_defaults` | Parameterize five Goa places. Same home-rain perturbation; no home-createdWet under UNKNOWN child profile. An explicitly authored Goa rainy profile produces exposure only at authored exposed places and never changes the hub profile. No reset of fire/gate/Hank or contract deadline. |
| W37.Q3 | Same: `cyoria_household_library_and_workshop_do_not_receive_frontier_rain` | Parameterize all seven MoL places; explicit room exposure policies for house/library/workshop. home rainy day cannot create rain/Wet anywhere with UNKNOWN local precipitation. Held lamp charge, Nora/Taiven reserves, watchstock and90min offer deadline retain correct owners. Ordinary authored smoke/burn still applies through its chosen encounter. |
| W37.Q4 | Same: `proto23_center_and_roofed_rooms_require_local_weather_opt_in` | Three places, dry/rain home pair. No inherited rain forcenter, no exposure indoors. Explicit local center rain can createWet, while dojo/cottage remain sheltered. Assert paper/ink, installedfixtures, stock and Mara/Toma funds conserved. |
| W37.Q5 | Same: `original_native_worlds_require_explicit_home_weather_adoption` | Table-driven nestedhub2/Saltworks2/Archive2/Tidemark2/Glasshouse1/Reedbank2/conditionalfoundation1. Hold each local clock/context; vary home season/rain/hour. Local climate/light/readouts unchanged or explicitly unknown unless profile explicitly adopts Frontier climate. Tidemarktidephase and borrowed-kit custody, Glasshouse support leases and original NPC identity unchanged. |
| W37.Q6 | `tests/native_world_light_isolation.test.js`: `normal_native_light_does_not_apply_frontier_night_attack_or_evasion_penalties` | For every native location, keep local illumination constant; home19:59→20:00 changes neither attack/evasion multiplier norNightVisionXP. An explicit local darkness profile applies its declared native penalty once; roof alone must not decide light. UNKNOWN displays no reading and uses a declared neutral mechanical policy. |
| W37.Q7 | `tests/native_world_calendar_isolation.test.js`: `active_world_header_customization_and_quiet_detail_use_one_local_environment_context` | At equal native elapsed, home seasonal/date20:00/21:00 changes do not relabel local header as Frontier date/day or add rain/stars. Header, quietdetail, hero light and notebook weather agree on world/instance/profile revision. Home date retained for return, not overwritten by local year1 projection. |
| W37.Q8 | `tests/native_world_market_isolation.test.js`: `retained_native_shops_do_not_refresh_from_frontier_trader_epochs` | For every MoL/Paradise/Proto23/nested/Tidemark shop snapshot inventory and refresh marker; cross multiple home 4-day epochs via native ticks, render, revisit, restore. refresh() andcan_refresh() remainfalse, exact stock unchanged absent purchases, no RNG epoch draw, no credit/crown/belli legacy trade unlocked. Explicit purchase debits exact stock and pays actual seller once. |
| W37.Q9 | Same: `book_quotes_ignore_frontier_saturation_and_keep_currency_owners` | Same item in home and local context; vary home sold ledger and nativepurse independently. Assert fixed authored crown/belli/credit quote unchanged; insufficient local money cannot be covered by homecoins. Proto23/Tidemark sharedmoney is explicitly admitted and debits once. Restock and itemvalue1 do not overwrite quoted price. |
| W37.Q10 | Same: `away_native_visit_obeys_declared_frontier_market_time_policy` | First declare existing-preserved versus deliberately revised home-market policy. Simulate global day crossing while locally occupied; assert only that declared policy's recovery/trickle occurs, with per-instance market isolation. Local prices and dormant native stock unchanged. This test is blocked on policy selection, not a unilateral demand to freeze Frontier. |
| W37.Q11 | `tests/native_world_schedule_isolation.test.js`: `home_hours_names_and_seasons_do_not_rewrite_native_people_or_local_deadlines` | At equal localelapsed, vary homehour/year/season/namegrammar; same named people and IDs, Crown/belli budgets, MoL90min offer, Goa42/54 and58/60/72 boundaries, Tidemark9/12 phase unchanged. Deliberate local clock advancement triggers each exact boundary once. Home teacher/circle facts cannot satisfy local admission. |
| W37.Q12 | `tests/native_world_environment_persistence.test.js`: `unknown_environment_and_existing_wet_survive_save_reload_and_literal_import_without_fabrication` | Enter with legitimateWetremaining7 and rain_counter9, then UNKNOWN local environment. No refresh to30 or instant deletion; played7min expires existing effect normally, no local home-rain accrual. Generated save/reload/import preserves elapsed, profile identity/revision or explicit legacy projection, all native domains and actor coins/items. Render/load performs no climate reroll or stock refill. |
| W37.Q13 | Same: `world_climate_cache_is_keyed_by_instance_region_and_profile_revision` | Switch cold dynamichome→unknownhub→authoredroom at home04:59 and14:00, without localadvance. Repeated reads identical; no previous_temperature_modifier transfer and no RNG cursor draw. Profile revision change applies compatibility decision, not silent saved clock reset. |
| W37.Q14 | `tests/native_world_provenance_contract.test.js`: `source_names_do_not_promote_original_prices_or_placeholder_environment_to_book_facts` | A mixed name+fee row retains Bidentity/Ofee; MoLthreebrightness B versus sixcharge O; Paradise91 B versus8.9 D versus rescue72min O; 20°C P stays hidden. Source locator resolves exact edition+member/claim, no SECRETS content enters public lens or error. Inert authoring profile is not counted as native world. |

Later browser proof target: fresh disposable origin rebuilt at **1366x768 and1920x1080**; compare active native header/weather/effects/stats and return with known carriedWet. Exercise real wait ticks separately from a paid-job time jump and a blocked encounter choice. Manual source tracing does not prove tick batching equivalence or actual background visuals. Mobile deferred. Source changes, tests, builds, native play, persistence and human acceptance remain distinct.

## W37.I: scalar source index

This index is produced from read-only source text, not by importing/running game modules. Each row lists numeric/boolean/null tokens **outside string literals and comments** on that source line. Prose facts and numbers inside labels are covered by the field/clause ledgers above; tokens in strings are deliberately not miscounted as active parameters. Technical counters/validation constants appear for navigation but remain excluded from claim counts. Tag is O by field rule, except named P environment/calendar or B/D exceptions in M/P/T/O. The index is not an independently verified canon catalogue.


### src/book_world_mol_content.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/book_world_mol_content.js:8` | `10, 14` | O |
| `src/book_world_mol_content.js:9` | `0, 10` | O |
| `src/book_world_mol_content.js:10` | `14, 12` | O |
| `src/book_world_mol_content.js:11` | `10, 14, 18` | O |
| `src/book_world_mol_content.js:12` | `0, 7` | O |
| `src/book_world_mol_content.js:13` | `8, 10, 12` | O |
| `src/book_world_mol_content.js:14` | `10, 12` | O |
| `src/book_world_mol_content.js:15` | `0, 3` | O |
| `src/book_world_mol_content.js:16` | `0, 4` | O |
| `src/book_world_mol_content.js:29` | `4, 2` | O |
| `src/book_world_mol_content.js:30` | `1` | O |
| `src/book_world_mol_content.js:31` | `4, 2` | O |
| `src/book_world_mol_content.js:32` | `2, 2` | O |
| `src/book_world_mol_content.js:34` | `1, 2, 2` | O |
| `src/book_world_mol_content.js:35` | `3, 2` | O |
| `src/book_world_mol_content.js:36` | `1` | O |
| `src/book_world_mol_content.js:37` | `1, 1, 1` | O |
| `src/book_world_mol_content.js:38` | `1, 6, 4, 3, 3, 4, 3` | O |
| `src/book_world_mol_content.js:39` | `2, 24, 24, 18, 18, provision=false, mobile=true` | O |
| `src/book_world_mol_content.js:40` | `1` | O |
| `src/book_world_mol_content.js:55` | `1, expedition=true, book_world_mol=true` | O |

### src/book_world_mol_actions.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/book_world_mol_actions.js:30` | `-2, -3, -2, -1, -2, -4, -4, -4, -1, -1` | O |
| `src/book_world_mol_actions.js:31` | `1, 1, 5, -1, 1, 4, 14, 1` | O |
| `src/book_world_mol_actions.js:34` | `once=true` | O |
| `src/book_world_mol_actions.js:37` | `5, -8, -2, -1, 8, 1` | O |
| `src/book_world_mol_actions.js:38` | `4, -1, 1, 5` | O |
| `src/book_world_mol_actions.js:39` | `2, -1, -1, 1, 5` | O |
| `src/book_world_mol_actions.js:41` | `2, -2, 2` | O |
| `src/book_world_mol_actions.js:42` | `3, -2, 2` | O |
| `src/book_world_mol_actions.js:44` | `6, -12, -1, -2, 12, 1` | O |
| `src/book_world_mol_actions.js:45` | `3, -1` | O |
| `src/book_world_mol_actions.js:46` | `4, -3, -1, 3` | O |
| `src/book_world_mol_actions.js:47` | `6, -3, -1, -1, -2, -2, 3, 1, 6` | O |
| `src/book_world_mol_actions.js:48` | `1, 2, 3, 0, 3, -2, -6, 2, 6` | O |
| `src/book_world_mol_actions.js:49` | `4, -2, -1, -2, 2, 1` | O |
| `src/book_world_mol_actions.js:50` | `1, -1` | O |
| `src/book_world_mol_actions.js:51` | `2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1` | O |
| `src/book_world_mol_actions.js:53` | `5, -8, -1, -2, 8, 1` | O |
| `src/book_world_mol_actions.js:56` | `2, -2, -1, 1` | O |
| `src/book_world_mol_actions.js:57` | `1, 2, -1, -1, 1` | O |
| `src/book_world_mol_actions.js:58` | `2, -2` | O |
| `src/book_world_mol_actions.js:59` | `2, -1` | O |
| `src/book_world_mol_actions.js:61` | `5, -3, -3, 14, 20` | O |
| `src/book_world_mol_actions.js:64` | `-6, 6` | O |
| `src/book_world_mol_actions.js:66` | `1, 2, 4, -2, -1, 2, 2` | O |
| `src/book_world_mol_actions.js:67` | `5, -2, -1, -1, 2` | O |
| `src/book_world_mol_actions.js:68` | `4, -1` | O |
| `src/book_world_mol_actions.js:69` | `3, -1` | O |
| `src/book_world_mol_actions.js:71` | `5, -2, -2, 1` | O |
| `src/book_world_mol_actions.js:72` | `1, 4, -1, -4, 4, 1` | O |
| `src/book_world_mol_actions.js:73` | `3, -1, -1, 1, 4` | O |
| `src/book_world_mol_actions.js:74` | `1, 3, -1, 2` | O |
| `src/book_world_mol_actions.js:76` | `2` | O |
| `src/book_world_mol_actions.js:77` | `6, -2, 2, 6, once=false` | O |
| `src/book_world_mol_actions.js:78` | `1, 3, -1, 1, 2, once=false` | O |
| `src/book_world_mol_actions.js:79` | `3, 3, 3, -1, 3, once=false` | O |
| `src/book_world_mol_actions.js:80` | `4, -1, 4, once=false` | O |
| `src/book_world_mol_actions.js:81` | `3, -1, -2` | O |
| `src/book_world_mol_actions.js:85` | `2, 1, once=true` | O |
| `src/book_world_mol_actions.js:86` | `2, 1, -1, -1, once=true` | O |
| `src/book_world_mol_actions.js:89` | `-1` | O |
| `src/book_world_mol_actions.js:90` | `-4` | O |
| `src/book_world_mol_actions.js:91` | `-2` | O |
| `src/book_world_mol_actions.js:93` | `-2, -2, 2` | O |
| `src/book_world_mol_actions.js:97` | `lethal=false` | O |
| `src/book_world_mol_actions.js:99` | `1, -1, 1` | O |
| `src/book_world_mol_actions.js:101` | `2, 1, 2, 1` | O |
| `src/book_world_mol_actions.js:108` | `1, 0` | O |
| `src/book_world_mol_actions.js:109` | `bioVisible=true, bioVisible=true` | O |

### src/book_world_mol_native.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/book_world_mol_native.js:7` | `1, 1, 1, 6, 0, 1` | P environment/calendar; O remainder |
| `src/book_world_mol_native.js:19` | `360, 360, 1440, 30, 12` | P environment/calendar; O remainder |
| `src/book_world_mol_native.js:20` | `1, 12, 1, 30, 1, 60, 24, 60, 1` | P environment/calendar; O remainder |
| `src/book_world_mol_native.js:84` | `1, 4, is_unlocked=false` | O |
| `src/book_world_mol_native.js:87` | `0` | O |
| `src/book_world_mol_native.js:100` | `is_unlocked=false` | O |
| `src/book_world_mol_native.js:103` | `is_unlocked=false` | O |
| `src/book_world_mol_native.js:104` | `is_under_roof=false` | P environment/calendar; O remainder |
| `src/book_world_mol_native.js:105` | `20, is_temperature_static=true, book_world_mol=true` | P environment/calendar; O remainder |

### src/book_world_mol_state.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/book_world_mol_state.js:11` | `0, 0, bidirectional=true, lifetime=null, passage=true, manifestation=false, contact=false, allowed=true, allowEquipped=true` | O |
| `src/book_world_mol_state.js:41` | `0, 1, 1` | O |
| `src/book_world_mol_state.js:42` | `1` | O |
| `src/book_world_mol_state.js:44` | `6` | O |
| `src/book_world_mol_state.js:46` | `0, 6` | O |
| `src/book_world_mol_state.js:55` | `0, 0, 0` | O |
| `src/book_world_mol_state.js:56` | `0, 90` | O |
| `src/book_world_mol_state.js:57` | `0, 90, 0` | O |

### src/book_world_mol_host.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/book_world_mol_host.js:17` | `2, 2, 0, 1` | O |
| `src/book_world_mol_host.js:20` | `0` | O |
| `src/book_world_mol_host.js:22` | `1` | O |
| `src/book_world_mol_host.js:23` | `0` | O |
| `src/book_world_mol_host.js:30` | `0` | O |
| `src/book_world_mol_host.js:31` | `visible=false, eligible=false` | O |
| `src/book_world_mol_host.js:34` | `visible=false, eligible=false` | O |
| `src/book_world_mol_host.js:39` | `0` | O |
| `src/book_world_mol_host.js:41` | `2` | O |
| `src/book_world_mol_host.js:42` | `0, 0, 0, 0` | O |
| `src/book_world_mol_host.js:43` | `0` | O |
| `src/book_world_mol_host.js:47` | `visible=false, eligible=false` | O |
| `src/book_world_mol_host.js:48` | `visible=false, eligible=false` | O |
| `src/book_world_mol_host.js:51` | `0, 0` | O |
| `src/book_world_mol_host.js:52` | `0, 0, 0` | O |
| `src/book_world_mol_host.js:53` | `0` | O |
| `src/book_world_mol_host.js:60` | `0` | O |
| `src/book_world_mol_host.js:62` | `11, 0` | O |
| `src/book_world_mol_host.js:63` | `0, 0, parentInstanceId=null, activeVisitId=null, open=true, retrievalOpenedAt=null` | O |
| `src/book_world_mol_host.js:66` | `awakened=true, active=true, awakened=true, active=true, awakened=true, active=true` | O |
| `src/book_world_mol_host.js:72` | `-128` | O |
| `src/book_world_mol_host.js:76` | `eligible=true` | O |
| `src/book_world_mol_host.js:77` | `0, 0` | O |
| `src/book_world_mol_host.js:78` | `known=true` | O |
| `src/book_world_mol_host.js:79` | `0` | O |

### src/book_world_mol_ids.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/book_world_mol_ids.js:12` | `initialOpen=true` | O |

### src/book_world_paradise_content.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/book_world_paradise_content.js:13` | `18, 8` | O |
| `src/book_world_paradise_content.js:14` | `12, 8` | O |
| `src/book_world_paradise_content.js:15` | `0, 8` | O |
| `src/book_world_paradise_content.js:16` | `8, 4, 5` | O |
| `src/book_world_paradise_content.js:17` | `4, 4, 4` | O |
| `src/book_world_paradise_content.js:18` | `4, 3, 3` | O |
| `src/book_world_paradise_content.js:19` | `8, 3, 3` | O |
| `src/book_world_paradise_content.js:22` | `4, 3, 2` | O |
| `src/book_world_paradise_content.js:23` | `3, 2, 3` | O |
| `src/book_world_paradise_content.js:25` | `1, 1, 1` | O |
| `src/book_world_paradise_content.js:26` | `1, 2, 1, 1` | O |
| `src/book_world_paradise_content.js:27` | `2, 1` | O |
| `src/book_world_paradise_content.js:28` | `1` | O |
| `src/book_world_paradise_content.js:30` | `2, 2, 3, 4, 2, 4, 3, 4` | O |
| `src/book_world_paradise_content.js:31` | `2, 24, 24, 16, 16, provision=false, mobile=true` | O |
| `src/book_world_paradise_content.js:32` | `1, 1` | O |
| `src/book_world_paradise_content.js:41` | `1, expedition=true, book_world_paradise=true` | O |

### src/book_world_paradise_actions.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/book_world_paradise_actions.js:48` | `3, 5` | O |
| `src/book_world_paradise_actions.js:50` | `-8, -1, -1, -1, -1, -2` | O |
| `src/book_world_paradise_actions.js:51` | `8, 1, 1` | O |
| `src/book_world_paradise_actions.js:52` | `5` | O |
| `src/book_world_paradise_actions.js:54` | `0` | O |
| `src/book_world_paradise_actions.js:58` | `4, 6` | O |
| `src/book_world_paradise_actions.js:59` | `-1, -2, -1, -1, -1, -1, -2` | O |
| `src/book_world_paradise_actions.js:60` | `1, 1, 3, 2` | O |
| `src/book_world_paradise_actions.js:61` | `8, 5` | O |
| `src/book_world_paradise_actions.js:66` | `once=true` | O |
| `src/book_world_paradise_actions.js:71` | `3, -2, -1` | O |
| `src/book_world_paradise_actions.js:72` | `2, 1, awakened=true, active=true` | O |
| `src/book_world_paradise_actions.js:74` | `1, 2, 1, 1, 1, 2` | O |
| `src/book_world_paradise_actions.js:75` | `4, -1, 1, 4` | O |
| `src/book_world_paradise_actions.js:79` | `2, 2, 1, 1, 1, 1, 1, 1` | O |
| `src/book_world_paradise_actions.js:80` | `2, -1, -1, 1, 4` | O |
| `src/book_world_paradise_actions.js:91` | `4, -1, -1, -1, -2` | O |
| `src/book_world_paradise_actions.js:92` | `1` | O |
| `src/book_world_paradise_actions.js:95` | `2, -1` | O |
| `src/book_world_paradise_actions.js:96` | `1` | O |
| `src/book_world_paradise_actions.js:100` | `2` | O |
| `src/book_world_paradise_actions.js:101` | `3, -2, 2, -1` | O |
| `src/book_world_paradise_actions.js:102` | `2, 1` | O |
| `src/book_world_paradise_actions.js:104` | `-2, -1, 2, 1` | O |
| `src/book_world_paradise_actions.js:106` | `2, -1, 1` | O |
| `src/book_world_paradise_actions.js:113` | `4, -3, -1, -1, -2, 3, 1, 8` | O |
| `src/book_world_paradise_actions.js:117` | `2, -2` | O |
| `src/book_world_paradise_actions.js:118` | `54, 1` | O |
| `src/book_world_paradise_actions.js:119` | `2, -1, -2` | O |
| `src/book_world_paradise_actions.js:120` | `54` | O |
| `src/book_world_paradise_actions.js:122` | `1, 3` | O |
| `src/book_world_paradise_actions.js:123` | `-1, -2` | O |
| `src/book_world_paradise_actions.js:125` | `2, -1, -1, -1` | O |
| `src/book_world_paradise_actions.js:128` | `-1, -1` | O |
| `src/book_world_paradise_actions.js:129` | `2` | O |
| `src/book_world_paradise_actions.js:130` | `-1, lethal=true` | O |
| `src/book_world_paradise_actions.js:131` | `2` | O |
| `src/book_world_paradise_actions.js:132` | `-4, -1, -2` | O |
| `src/book_world_paradise_actions.js:134` | `3, -1, -2` | O |
| `src/book_world_paradise_actions.js:135` | `1, 1` | O |
| `src/book_world_paradise_actions.js:136` | `1` | O |
| `src/book_world_paradise_actions.js:137` | `-1, 2` | O |
| `src/book_world_paradise_actions.js:138` | `42` | O |
| `src/book_world_paradise_actions.js:139` | `-2` | O |
| `src/book_world_paradise_actions.js:141` | `3, -1, -2, -3` | O |
| `src/book_world_paradise_actions.js:142` | `1, -1, lethal=true` | O |
| `src/book_world_paradise_actions.js:145` | `5, -2` | O |
| `src/book_world_paradise_actions.js:151` | `2, 1` | O |
| `src/book_world_paradise_actions.js:152` | `2, 3, 2, 1` | O |
| `src/book_world_paradise_actions.js:153` | `2, 3, 2, 1` | O |
| `src/book_world_paradise_actions.js:154` | `2, 1` | O |
| `src/book_world_paradise_actions.js:155` | `2, 7, 6, 5, 4, 3, 2` | O |
| `src/book_world_paradise_actions.js:163` | `1, 0` | O |
| `src/book_world_paradise_actions.js:164` | `1, 0` | O |

### src/book_world_paradise_native.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/book_world_paradise_native.js:7` | `1, 1, 1, 6, 0, 1` | P environment/calendar; O remainder |
| `src/book_world_paradise_native.js:19` | `360, 360, 1440, 30, 12` | P environment/calendar; O remainder |
| `src/book_world_paradise_native.js:20` | `1, 12, 1, 30, 1, 60, 24, 60, 1` | P environment/calendar; O remainder |
| `src/book_world_paradise_native.js:84` | `1, 4, is_unlocked=false` | O |
| `src/book_world_paradise_native.js:87` | `0` | O |
| `src/book_world_paradise_native.js:100` | `is_unlocked=false` | O |
| `src/book_world_paradise_native.js:103` | `is_unlocked=false` | O |
| `src/book_world_paradise_native.js:104` | `is_under_roof=false` | P environment/calendar; O remainder |
| `src/book_world_paradise_native.js:105` | `20, is_temperature_static=true, book_world_campaign=true` | P environment/calendar; O remainder |

### src/book_world_paradise_state.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/book_world_paradise_state.js:8` | `4, 1, 90, 2` | O |
| `src/book_world_paradise_state.js:9` | `96` | O |
| `src/book_world_paradise_state.js:11` | `0` | O |
| `src/book_world_paradise_state.js:14` | `0, 0, 1, 0, bidirectional=true, lifetime=null, passage=true, manifestation=false, contact=false, allowed=true, allowEquipped=true` | O |

### src/book_world_paradise_host.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/book_world_paradise_host.js:61` | `2` | O |
| `src/book_world_paradise_host.js:62` | `91` | B 91; D 8.9% text; O remainder |
| `src/book_world_paradise_host.js:68` | `11, 10` | O |
| `src/book_world_paradise_host.js:69` | `0, 0, parentInstanceId=null, activeVisitId=null, open=true, mission=null` | O |
| `src/book_world_paradise_host.js:70` | `awakened=true, active=true, awakened=true, active=true` | O |
| `src/book_world_paradise_host.js:75` | `1` | O |
| `src/book_world_paradise_host.js:76` | `0, 1, 0` | O |
| `src/book_world_paradise_host.js:80` | `2, -4, 4, 0, arrivedAt=null, localDeadline=null, extraction=null, returnedAt=null, settledAt=null` | O |
| `src/book_world_paradise_host.js:81` | `4` | O |
| `src/book_world_paradise_host.js:83` | `2, arrivalSequence=null` | O |
| `src/book_world_paradise_host.js:85` | `4, 1, 0, 4` | O |

### src/book_world_paradise_ids.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/book_world_paradise_ids.js:11` | `initialOpen=true` | O |
| `src/book_world_paradise_ids.js:16` | `authorOnly=true` | O |

### src/book_world_paradise_campaign_content.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/book_world_paradise_campaign_content.js:12` | `58, 60, 72` | O |
| `src/book_world_paradise_campaign_content.js:21` | `reservationReturn=true` | O |
| `src/book_world_paradise_campaign_content.js:22` | `1` | O |
| `src/book_world_paradise_campaign_content.js:26` | `-1` | O |
| `src/book_world_paradise_campaign_content.js:30` | `awakened=true, active=true` | O |
| `src/book_world_paradise_campaign_content.js:36` | `coLocated=true` | O |
| `src/book_world_paradise_campaign_content.js:37` | `1` | O |
| `src/book_world_paradise_campaign_content.js:40` | `once=true` | O |
| `src/book_world_paradise_campaign_content.js:43` | `once=true` | O |
| `src/book_world_paradise_campaign_content.js:44` | `-1, -1` | O |
| `src/book_world_paradise_campaign_content.js:45` | `1, 1` | O |
| `src/book_world_paradise_campaign_content.js:65` | `5, -2, -1, -2` | O |
| `src/book_world_paradise_campaign_content.js:69` | `4` | O |
| `src/book_world_paradise_campaign_content.js:70` | `-2, -2, -1, -1` | O |
| `src/book_world_paradise_campaign_content.js:71` | `2, 1` | O |
| `src/book_world_paradise_campaign_content.js:74` | `7` | O |
| `src/book_world_paradise_campaign_content.js:75` | `-1, -4` | O |
| `src/book_world_paradise_campaign_content.js:78` | `once=false` | O |
| `src/book_world_paradise_campaign_content.js:79` | `3, -2` | O |
| `src/book_world_paradise_campaign_content.js:80` | `1` | O |
| `src/book_world_paradise_campaign_content.js:81` | `once=false` | O |
| `src/book_world_paradise_campaign_content.js:83` | `active=false` | O |
| `src/book_world_paradise_campaign_content.js:85` | `once=false` | O |
| `src/book_world_paradise_campaign_content.js:87` | `active=true` | O |
| `src/book_world_paradise_campaign_content.js:89` | `4, 3, 2, 1` | O |
| `src/book_world_paradise_campaign_content.js:91` | `once=false` | O |
| `src/book_world_paradise_campaign_content.js:92` | `-1, -1` | O |
| `src/book_world_paradise_campaign_content.js:93` | `1, 1` | O |
| `src/book_world_paradise_campaign_content.js:96` | `1, 2` | O |
| `src/book_world_paradise_campaign_content.js:97` | `2` | O |
| `src/book_world_paradise_campaign_content.js:98` | `2, -1, -3` | O |
| `src/book_world_paradise_campaign_content.js:99` | `1, 3` | O |
| `src/book_world_paradise_campaign_content.js:101` | `once=false` | O |
| `src/book_world_paradise_campaign_content.js:102` | `2, -1, -1` | O |
| `src/book_world_paradise_campaign_content.js:103` | `20` | O |
| `src/book_world_paradise_campaign_content.js:105` | `3, -2` | O |
| `src/book_world_paradise_campaign_content.js:113` | `-1, -1` | O |
| `src/book_world_paradise_campaign_content.js:115` | `once=false` | O |
| `src/book_world_paradise_campaign_content.js:116` | `5, -1, -1, -1` | O |
| `src/book_world_paradise_campaign_content.js:117` | `3, 2` | O |
| `src/book_world_paradise_campaign_content.js:119` | `once=false` | O |
| `src/book_world_paradise_campaign_content.js:120` | `6` | O |
| `src/book_world_paradise_campaign_content.js:124` | `4, -1, -1, -1` | O |
| `src/book_world_paradise_campaign_content.js:125` | `3, 3` | O |
| `src/book_world_paradise_campaign_content.js:130` | `3` | O |
| `src/book_world_paradise_campaign_content.js:131` | `-1, -2, -1` | O |
| `src/book_world_paradise_campaign_content.js:132` | `1, 2` | O |
| `src/book_world_paradise_campaign_content.js:136` | `4, -2` | O |
| `src/book_world_paradise_campaign_content.js:137` | `1` | O |
| `src/book_world_paradise_campaign_content.js:142` | `4, 6` | O |
| `src/book_world_paradise_campaign_content.js:143` | `-1, -2, -1, -1, -2, -3` | O |
| `src/book_world_paradise_campaign_content.js:144` | `2` | O |
| `src/book_world_paradise_campaign_content.js:146` | `once=false` | O |
| `src/book_world_paradise_campaign_content.js:147` | `3` | O |
| `src/book_world_paradise_campaign_content.js:148` | `-1, -1, -2, 1, 1` | O |
| `src/book_world_paradise_campaign_content.js:152` | `2, -1, -2` | O |
| `src/book_world_paradise_campaign_content.js:153` | `1, 2` | O |
| `src/book_world_paradise_campaign_content.js:163` | `2` | O |
| `src/book_world_paradise_campaign_content.js:173` | `-1` | O |
| `src/book_world_paradise_campaign_content.js:176` | `-1` | O |
| `src/book_world_paradise_campaign_content.js:180` | `-1, lethal=true` | O |
| `src/book_world_paradise_campaign_content.js:187` | `-2` | O |
| `src/book_world_paradise_campaign_content.js:189` | `-2, -3` | O |
| `src/book_world_paradise_campaign_content.js:190` | `-2, 2` | O |
| `src/book_world_paradise_campaign_content.js:193` | `-3, -3, 18` | O |
| `src/book_world_paradise_campaign_content.js:199` | `-2, -1, 1` | O |
| `src/book_world_paradise_campaign_content.js:202` | `-1, -4, -2, -2, -2` | O |
| `src/book_world_paradise_campaign_content.js:203` | `16, 16, 18` | O |
| `src/book_world_paradise_campaign_content.js:206` | `-4, -5, -4, -2` | O |
| `src/book_world_paradise_campaign_content.js:207` | `16, 18, 16, 18` | O |
| `src/book_world_paradise_campaign_content.js:215` | `-1, 2` | O |
| `src/book_world_paradise_campaign_content.js:233` | `bioVisible=true` | O |
| `src/book_world_paradise_campaign_content.js:234` | `bioVisible=true` | O |
| `src/book_world_paradise_campaign_content.js:235` | `bioVisible=true` | O |
| `src/book_world_paradise_campaign_content.js:236` | `1, 1` | O |
| `src/book_world_paradise_campaign_content.js:237` | `1` | O |
| `src/book_world_paradise_campaign_content.js:239` | `lethal=false` | O |
| `src/book_world_paradise_campaign_content.js:241` | `1` | O |
| `src/book_world_paradise_campaign_content.js:242` | `20, 10` | O |
| `src/book_world_paradise_campaign_content.js:243` | `1, 10` | O |

### src/book_world_paradise_campaign_facts.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/book_world_paradise_campaign_facts.js:7` | `0` | O |
| `src/book_world_paradise_campaign_facts.js:9` | `1, 9, 0, 9, 1` | O |
| `src/book_world_paradise_campaign_facts.js:12` | `0, 0, 1` | O |
| `src/book_world_paradise_campaign_facts.js:16` | `0, c=null` | O |
| `src/book_world_paradise_campaign_facts.js:19` | `0` | O |
| `src/book_world_paradise_campaign_facts.js:22` | `0` | O |
| `src/book_world_paradise_campaign_facts.js:35` | `1, 1` | O |
| `src/book_world_paradise_campaign_facts.js:41` | `0, 0` | O |
| `src/book_world_paradise_campaign_facts.js:42` | `1` | O |
| `src/book_world_paradise_campaign_facts.js:54` | `2, 3` | O |
| `src/book_world_paradise_campaign_facts.js:55` | `3` | O |
| `src/book_world_paradise_campaign_facts.js:57` | `1` | O |
| `src/book_world_paradise_campaign_facts.js:61` | `1` | O |
| `src/book_world_paradise_campaign_facts.js:72` | `3, 1` | O |
| `src/book_world_paradise_campaign_facts.js:74` | `3` | O |
| `src/book_world_paradise_campaign_facts.js:76` | `4` | O |
| `src/book_world_paradise_campaign_facts.js:77` | `3, 3` | O |
| `src/book_world_paradise_campaign_facts.js:78` | `5, 5` | O |
| `src/book_world_paradise_campaign_facts.js:82` | `0, 0, 1` | O |
| `src/book_world_paradise_campaign_facts.js:96` | `16, 0.9, 0.9` | O |
| `src/book_world_paradise_campaign_facts.js:97` | `20` | O |
| `src/book_world_paradise_campaign_facts.js:98` | `18, 0.9` | O |
| `src/book_world_paradise_campaign_facts.js:107` | `2, 2` | O |
| `src/book_world_paradise_campaign_facts.js:114` | `effect=true, buff=true, debuff=true, affected_by_travel=true` | O |
| `src/book_world_paradise_campaign_facts.js:140` | `0, 1` | O |
| `src/book_world_paradise_campaign_facts.js:142` | `1` | O |
| `src/book_world_paradise_campaign_facts.js:156` | `0, 0` | O |
| `src/book_world_paradise_campaign_facts.js:162` | `0, 0` | O |
| `src/book_world_paradise_campaign_facts.js:176` | `1` | O |
| `src/book_world_paradise_campaign_facts.js:177` | `0, 0` | O |
| `src/book_world_paradise_campaign_facts.js:178` | `0` | O |
| `src/book_world_paradise_campaign_facts.js:183` | `1` | O |
| `src/book_world_paradise_campaign_facts.js:188` | `1` | O |
| `src/book_world_paradise_campaign_facts.js:191` | `1` | O |
| `src/book_world_paradise_campaign_facts.js:193` | `1` | O |

### src/book_world_paradise_campaign_runtime.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/book_world_paradise_campaign_runtime.js:6` | `0` | O |
| `src/book_world_paradise_campaign_runtime.js:36` | `3` | O |
| `src/book_world_paradise_campaign_runtime.js:44` | `1` | O |
| `src/book_world_paradise_campaign_runtime.js:45` | `1` | O |

### src/book_world_paradise_carriers.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/book_world_paradise_carriers.js:30` | `1, 1` | O |
| `src/book_world_paradise_carriers.js:32` | `1, 1` | O |
| `src/book_world_paradise_carriers.js:34` | `1` | O |

### src/proto23_world_content.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/proto23_world_content.js:11` | `1` | O |
| `src/proto23_world_content.js:14` | `1, 1, 1, 14, 6` | O |
| `src/proto23_world_content.js:15` | `2, 3, 3` | O |
| `src/proto23_world_content.js:18` | `12, 10` | O |
| `src/proto23_world_content.js:19` | `0, 6` | O |
| `src/proto23_world_content.js:22` | `2, provision=false, mobile=true` | O |
| `src/proto23_world_content.js:23` | `24, 24, 18, 18` | O |
| `src/proto23_world_content.js:28` | `reservationReturn=true` | O |
| `src/proto23_world_content.js:29` | `native=true` | O |
| `src/proto23_world_content.js:31` | `-1` | O |
| `src/proto23_world_content.js:43` | `once=true` | O |
| `src/proto23_world_content.js:44` | `coLocated=true` | O |
| `src/proto23_world_content.js:45` | `1` | O |
| `src/proto23_world_content.js:49` | `once=false` | O |
| `src/proto23_world_content.js:50` | `1` | O |
| `src/proto23_world_content.js:51` | `-1` | O |
| `src/proto23_world_content.js:52` | `1` | O |
| `src/proto23_world_content.js:56` | `2` | O |
| `src/proto23_world_content.js:57` | `-1, -1` | O |
| `src/proto23_world_content.js:61` | `once=false` | O |
| `src/proto23_world_content.js:62` | `3, 5, -1, -1, -2, -3` | O |
| `src/proto23_world_content.js:63` | `1, 1, 2` | O |
| `src/proto23_world_content.js:67` | `once=true` | O |
| `src/proto23_world_content.js:74` | `5` | O |
| `src/proto23_world_content.js:75` | `-8, -2, 8` | O |
| `src/proto23_world_content.js:78` | `2` | O |
| `src/proto23_world_content.js:79` | `-2, 2` | O |
| `src/proto23_world_content.js:83` | `2, 2, 1` | O |
| `src/proto23_world_content.js:84` | `1, 1, 2, 1, 1` | O |
| `src/proto23_world_content.js:86` | `6` | O |
| `src/proto23_world_content.js:87` | `-1, -1, 1` | O |
| `src/proto23_world_content.js:91` | `4, -2, -1, -1, -1` | O |
| `src/proto23_world_content.js:92` | `2, 1` | O |
| `src/proto23_world_content.js:96` | `3, -1, -2, 1` | O |
| `src/proto23_world_content.js:99` | `once=false` | O |
| `src/proto23_world_content.js:100` | `4` | O |
| `src/proto23_world_content.js:101` | `4` | O |
| `src/proto23_world_content.js:103` | `once=false` | O |
| `src/proto23_world_content.js:104` | `3` | O |
| `src/proto23_world_content.js:105` | `-1, -1, -1, 1` | O |
| `src/proto23_world_content.js:107` | `once=false` | O |
| `src/proto23_world_content.js:108` | `4` | O |
| `src/proto23_world_content.js:109` | `-1, -1, -1, 1` | O |
| `src/proto23_world_content.js:111` | `once=false` | O |
| `src/proto23_world_content.js:112` | `4` | O |
| `src/proto23_world_content.js:113` | `-1, -2, -1, 2` | O |
| `src/proto23_world_content.js:117` | `3, -1` | O |
| `src/proto23_world_content.js:121` | `4` | O |
| `src/proto23_world_content.js:122` | `-1, -1, -1, 1` | O |
| `src/proto23_world_content.js:125` | `2` | O |
| `src/proto23_world_content.js:126` | `-4, -1, 4, 1` | O |
| `src/proto23_world_content.js:130` | `3, once=false` | O |
| `src/proto23_world_content.js:131` | `1, completionCoLocated=false` | O |
| `src/proto23_world_content.js:134` | `-1, -1, -1, -1, -1` | O |
| `src/proto23_world_content.js:135` | `1, 1, 1` | O |
| `src/proto23_world_content.js:139` | `1, provision=false` | O |
| `src/proto23_world_content.js:140` | `1, provision=false` | O |
| `src/proto23_world_content.js:150` | `1, expedition=true, proto23_world=true` | O |

### src/proto23_world_ids.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/proto23_world_ids.js:28` | `initialOpen=true` | O |
| `src/proto23_world_ids.js:29` | `initialOpen=true` | O |

### src/proto23_world_host.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/proto23_world_host.js:21` | `2, 2, 0, 1` | O |
| `src/proto23_world_host.js:29` | `0` | O |
| `src/proto23_world_host.js:33` | `1` | O |
| `src/proto23_world_host.js:37` | `0` | O |
| `src/proto23_world_host.js:50` | `proto23Host=true` | O |
| `src/proto23_world_host.js:54` | `0` | O |
| `src/proto23_world_host.js:56` | `visible=false, eligible=false` | O |
| `src/proto23_world_host.js:65` | `visible=false, eligible=false` | O |
| `src/proto23_world_host.js:75` | `0` | O |
| `src/proto23_world_host.js:89` | `2` | O |
| `src/proto23_world_host.js:92` | `0` | O |
| `src/proto23_world_host.js:94` | `0, 0` | O |
| `src/proto23_world_host.js:97` | `0` | O |
| `src/proto23_world_host.js:105` | `proto23Host=true` | O |
| `src/proto23_world_host.js:121` | `11, 0` | O |
| `src/proto23_world_host.js:125` | `parentInstanceId=null` | O |
| `src/proto23_world_host.js:126` | `activeVisitId=null` | O |
| `src/proto23_world_host.js:127` | `open=true` | O |
| `src/proto23_world_host.js:134` | `-128` | O |
| `src/proto23_world_host.js:153` | `eligible=true` | O |
| `src/proto23_world_host.js:155` | `known=true` | O |
| `src/proto23_world_host.js:157` | `basis=null` | O |
| `src/proto23_world_host.js:162` | `0` | O |

### src/proto23_world_native.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/proto23_world_native.js:7` | `1, 1, 1, 6, 0, 1` | P environment/calendar; O remainder |
| `src/proto23_world_native.js:19` | `360, 360, 1440, 30, 12` | P environment/calendar; O remainder |
| `src/proto23_world_native.js:20` | `1, 12, 1, 30, 1, 60, 24, 60, 1` | P environment/calendar; O remainder |
| `src/proto23_world_native.js:110` | `1, 4, is_unlocked=false` | O |
| `src/proto23_world_native.js:113` | `0` | O |
| `src/proto23_world_native.js:126` | `is_unlocked=false` | O |
| `src/proto23_world_native.js:129` | `is_unlocked=false` | O |
| `src/proto23_world_native.js:131` | `20, is_temperature_static=true, proto23_world=true` | P environment/calendar; O remainder |

### src/proto23_world_state.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/proto23_world_state.js:7` | `0` | O |
| `src/proto23_world_state.js:11` | `128` | O |
| `src/proto23_world_state.js:14` | `0, bidirectional=true` | O |
| `src/proto23_world_state.js:15` | `0, lifetime=null` | O |
| `src/proto23_world_state.js:16` | `passage=true, manifestation=false, contact=false, allowed=true, allowEquipped=true` | O |
| `src/proto23_world_state.js:41` | `parentInstanceId=null` | O |
| `src/proto23_world_state.js:42` | `0, 0` | O |
| `src/proto23_world_state.js:66` | `1, 1` | O |
| `src/proto23_world_state.js:68` | `1` | O |
| `src/proto23_world_state.js:79` | `0` | O |
| `src/proto23_world_state.js:85` | `0, 1` | O |
| `src/proto23_world_state.js:87` | `1` | O |
| `src/proto23_world_state.js:106` | `0, 0` | O |
| `src/proto23_world_state.js:110` | `0` | O |
| `src/proto23_world_state.js:123` | `0` | O |
| `src/proto23_world_state.js:124` | `0` | O |
| `src/proto23_world_state.js:128` | `1` | O |
| `src/proto23_world_state.js:129` | `1` | O |

### src/feature_expansion_nested_content.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/feature_expansion_nested_content.js:4` | `1` | O |
| `src/feature_expansion_nested_content.js:27` | `initialOpen=true` | O |
| `src/feature_expansion_nested_content.js:34` | `8, 3, 30, 15, 2` | O |
| `src/feature_expansion_nested_content.js:36` | `3, interference=true` | O |
| `src/feature_expansion_nested_content.js:37` | `7, 3, 36, 12, 2` | O |
| `src/feature_expansion_nested_content.js:38` | `2, interference=false` | O |
| `src/feature_expansion_nested_content.js:39` | `3, 0, 24, 12, 1` | O |
| `src/feature_expansion_nested_content.js:40` | `2, interference=false` | O |
| `src/feature_expansion_nested_content.js:41` | `3, 0, 24, 12, 1` | O |
| `src/feature_expansion_nested_content.js:42` | `2, interference=false` | O |
| `src/feature_expansion_nested_content.js:49` | `reservationReturn=true` | O |
| `src/feature_expansion_nested_content.js:51` | `1` | O |
| `src/feature_expansion_nested_content.js:57` | `24, 12, 0` | O |
| `src/feature_expansion_nested_content.js:58` | `4, 6` | O |
| `src/feature_expansion_nested_content.js:59` | `6, 3, 2` | O |
| `src/feature_expansion_nested_content.js:60` | `provision=false` | O |
| `src/feature_expansion_nested_content.js:61` | `2, 5, 3, 2, 2, 24, 24, 12, 12, mobile=true` | O |
| `src/feature_expansion_nested_content.js:63` | `1, 3, 1, 1, 1` | O |
| `src/feature_expansion_nested_content.js:64` | `2, 1, 1, 1` | O |
| `src/feature_expansion_nested_content.js:65` | `1, 1, 1` | O |
| `src/feature_expansion_nested_content.js:67` | `2, 2, 3, 3, 2` | O |
| `src/feature_expansion_nested_content.js:68` | `3, 1, 2, 2, 1, 1, 2, 1` | O |
| `src/feature_expansion_nested_content.js:71` | `1, 1, 1` | O |
| `src/feature_expansion_nested_content.js:72` | `1, 0` | O |
| `src/feature_expansion_nested_content.js:73` | `1` | O |
| `src/feature_expansion_nested_content.js:75` | `once=true` | O |
| `src/feature_expansion_nested_content.js:78` | `once=true, coLocated=true` | O |
| `src/feature_expansion_nested_content.js:79` | `coLocated=true` | O |
| `src/feature_expansion_nested_content.js:80` | `coLocated=true` | O |
| `src/feature_expansion_nested_content.js:81` | `6, coLocated=true` | O |
| `src/feature_expansion_nested_content.js:82` | `completionCoLocated=true` | O |
| `src/feature_expansion_nested_content.js:83` | `-4, -1, -2, 4, 1, 12` | O |
| `src/feature_expansion_nested_content.js:84` | `coLocated=true` | O |
| `src/feature_expansion_nested_content.js:85` | `-1, 1, 1` | O |
| `src/feature_expansion_nested_content.js:86` | `4, -2, 2, 10, 10, coLocated=true` | O |
| `src/feature_expansion_nested_content.js:87` | `4, -1, 1, 10, 10, coLocated=true` | O |
| `src/feature_expansion_nested_content.js:88` | `3, -2, 2, 20, coLocated=true` | O |
| `src/feature_expansion_nested_content.js:89` | `3, -2, -1, 2, 1, coLocated=true` | O |
| `src/feature_expansion_nested_content.js:90` | `-2, 2, coLocated=true, once=true` | O |
| `src/feature_expansion_nested_content.js:91` | `3, coLocated=true, once=true` | O |
| `src/feature_expansion_nested_content.js:92` | `-2, -1, 2, awakened=true, active=true` | O |
| `src/feature_expansion_nested_content.js:93` | `once=true, coLocated=true` | O |
| `src/feature_expansion_nested_content.js:94` | `2, coLocated=true` | O |
| `src/feature_expansion_nested_content.js:95` | `3, coLocated=true` | O |
| `src/feature_expansion_nested_content.js:96` | `-2, -1, -1` | O |
| `src/feature_expansion_nested_content.js:97` | `2` | O |
| `src/feature_expansion_nested_content.js:98` | `4, -2, -1, -2, coLocated=true` | O |
| `src/feature_expansion_nested_content.js:99` | `2, -1, -1, -1, 1, 1, coLocated=true` | O |
| `src/feature_expansion_nested_content.js:100` | `coLocated=true, once=true` | O |
| `src/feature_expansion_nested_content.js:101` | `1` | O |
| `src/feature_expansion_nested_content.js:102` | `coLocated=true, once=true` | O |
| `src/feature_expansion_nested_content.js:103` | `2, coLocated=true` | O |
| `src/feature_expansion_nested_content.js:104` | `coLocated=true` | O |
| `src/feature_expansion_nested_content.js:105` | `-1, 1` | O |
| `src/feature_expansion_nested_content.js:106` | `coLocated=true` | O |
| `src/feature_expansion_nested_content.js:107` | `2, -1, -1, -1, 1, 1, coLocated=true, once=true` | O |
| `src/feature_expansion_nested_content.js:108` | `3, 2, 2, 1, -1, coLocated=true` | O |
| `src/feature_expansion_nested_content.js:109` | `1, -1` | O |

### src/feature_expansion_nested_host.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/feature_expansion_nested_host.js:16` | `0` | O |
| `src/feature_expansion_nested_host.js:22` | `96` | O |
| `src/feature_expansion_nested_host.js:24` | `1` | O |
| `src/feature_expansion_nested_host.js:26` | `1` | O |
| `src/feature_expansion_nested_host.js:27` | `1, 2, 0` | O |
| `src/feature_expansion_nested_host.js:35` | `0, bidirectional=true, lifetime=null` | O |
| `src/feature_expansion_nested_host.js:36` | `passage=true, manifestation=false, contact=false` | O |
| `src/feature_expansion_nested_host.js:37` | `allowed=true, allowEquipped=true` | O |
| `src/feature_expansion_nested_host.js:62` | `parentInstanceId=null` | O |
| `src/feature_expansion_nested_host.js:69` | `1, 8, 9, 10, 11` | O |
| `src/feature_expansion_nested_host.js:93` | `0` | O |
| `src/feature_expansion_nested_host.js:104` | `1, 1` | O |
| `src/feature_expansion_nested_host.js:105` | `1` | O |
| `src/feature_expansion_nested_host.js:118` | `0` | O |
| `src/feature_expansion_nested_host.js:120` | `0, 4, 0, 0` | O |
| `src/feature_expansion_nested_host.js:121` | `0, 2, 0, 0` | O |
| `src/feature_expansion_nested_host.js:122` | `0, 0` | O |
| `src/feature_expansion_nested_host.js:123` | `2, 2, 0, 0, 0, 0` | O |
| `src/feature_expansion_nested_host.js:126` | `0` | O |
| `src/feature_expansion_nested_host.js:128` | `0, 0` | O |
| `src/feature_expansion_nested_host.js:138` | `0, 0` | O |
| `src/feature_expansion_nested_host.js:142` | `1` | O |
| `src/feature_expansion_nested_host.js:144` | `0` | O |
| `src/feature_expansion_nested_host.js:158` | `visible=false, eligible=false` | O |
| `src/feature_expansion_nested_host.js:169` | `0` | O |
| `src/feature_expansion_nested_host.js:170` | `0` | O |
| `src/feature_expansion_nested_host.js:171` | `0` | O |
| `src/feature_expansion_nested_host.js:174` | `0, 0` | O |
| `src/feature_expansion_nested_host.js:177` | `1, 2` | O |
| `src/feature_expansion_nested_host.js:181` | `1, 2` | O |
| `src/feature_expansion_nested_host.js:183` | `1, 2` | O |
| `src/feature_expansion_nested_host.js:186` | `0, 0` | O |
| `src/feature_expansion_nested_host.js:190` | `0, 1` | O |
| `src/feature_expansion_nested_host.js:191` | `1, 2` | O |
| `src/feature_expansion_nested_host.js:197` | `-1` | O |
| `src/feature_expansion_nested_host.js:198` | `0, 0` | O |
| `src/feature_expansion_nested_host.js:202` | `-96` | O |
| `src/feature_expansion_nested_host.js:207` | `0` | O |
| `src/feature_expansion_nested_host.js:226` | `0` | O |
| `src/feature_expansion_nested_host.js:228` | `parentInstanceId=null, activeVisitId=null` | O |
| `src/feature_expansion_nested_host.js:229` | `open=true, mission=null` | O |
| `src/feature_expansion_nested_host.js:231` | `awakened=true, active=true` | O |
| `src/feature_expansion_nested_host.js:234` | `0, 0` | O |
| `src/feature_expansion_nested_host.js:238` | `11, 10, 9, 8, 1` | O |
| `src/feature_expansion_nested_host.js:240` | `1, 2` | O |
| `src/feature_expansion_nested_host.js:244` | `1` | O |
| `src/feature_expansion_nested_host.js:247` | `2` | O |
| `src/feature_expansion_nested_host.js:248` | `0, arrivedAt=null, localDeadline=null, extended=false, objective=false, issuerSuccess=false, extraction=null, returnedAt=null, settledAt=null` | O |
| `src/feature_expansion_nested_host.js:250` | `2, 1, 2, 1, 2` | O |
| `src/feature_expansion_nested_host.js:262` | `recoveredAt=null, arrivalSequence=null` | O |
| `src/feature_expansion_nested_host.js:265` | `-1` | O |
| `src/feature_expansion_nested_host.js:266` | `2` | O |
| `src/feature_expansion_nested_host.js:270` | `0, 0` | O |
| `src/feature_expansion_nested_host.js:284` | `1, 2` | O |
| `src/feature_expansion_nested_host.js:287` | `1, 2` | O |
| `src/feature_expansion_nested_host.js:293` | `0` | O |
| `src/feature_expansion_nested_host.js:297` | `0` | O |

### src/feature_expansion_nested_native.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/feature_expansion_nested_native.js:7` | `1, 1, 1, 6, 0, 1` | P environment/calendar; O remainder |
| `src/feature_expansion_nested_native.js:11` | `360, 1440, 30, 12` | P environment/calendar; O remainder |
| `src/feature_expansion_nested_native.js:12` | `1, 12, 1, 30, 1, 60, 24, 60, 1` | P environment/calendar; O remainder |
| `src/feature_expansion_nested_native.js:55` | `1, 4, is_unlocked=false` | O |
| `src/feature_expansion_nested_native.js:58` | `0` | O |
| `src/feature_expansion_nested_native.js:67` | `is_unlocked=false` | O |
| `src/feature_expansion_nested_native.js:75` | `is_unlocked=false` | O |
| `src/feature_expansion_nested_native.js:76` | `17, 20, is_temperature_static=true, nested_campaign=true` | P environment/calendar; O remainder |

### src/feature_expansion_destination.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/feature_expansion_destination.js:13` | `initialOpen=true` | O |
| `src/feature_expansion_destination.js:14` | `initialOpen=true` | O |
| `src/feature_expansion_destination.js:16` | `1` | O |
| `src/feature_expansion_destination.js:25` | `provision=false` | O |
| `src/feature_expansion_destination.js:26` | `2, 2, mobile=true` | O |
| `src/feature_expansion_destination.js:27` | `provision=false` | O |
| `src/feature_expansion_destination.js:28` | `3, 2, mobile=true` | O |
| `src/feature_expansion_destination.js:29` | `1` | O |
| `src/feature_expansion_destination.js:30` | `1, 0` | O |
| `src/feature_expansion_destination.js:34` | `once=true` | O |
| `src/feature_expansion_destination.js:38` | `-1, native=true` | O |
| `src/feature_expansion_destination.js:41` | `once=true, coLocated=true` | O |
| `src/feature_expansion_destination.js:42` | `once=true, coLocated=true` | O |
| `src/feature_expansion_destination.js:44` | `once=true, coLocated=true` | O |
| `src/feature_expansion_destination.js:46` | `6, coLocated=true` | O |
| `src/feature_expansion_destination.js:47` | `-2, -2` | O |
| `src/feature_expansion_destination.js:48` | `3, once=true, coLocated=true` | O |
| `src/feature_expansion_destination.js:49` | `-2, 2, native=true` | O |
| `src/feature_expansion_destination.js:51` | `2, coLocated=true` | O |
| `src/feature_expansion_destination.js:52` | `-1, -2` | O |
| `src/feature_expansion_destination.js:53` | `once=true, coLocated=true` | O |
| `src/feature_expansion_destination.js:54` | `1` | O |
| `src/feature_expansion_destination.js:55` | `coLocated=true` | O |
| `src/feature_expansion_destination.js:56` | `-2, 1, native=true` | O |
| `src/feature_expansion_destination.js:57` | `coLocated=true` | O |
| `src/feature_expansion_destination.js:58` | `-5, 1, native=true` | O |
| `src/feature_expansion_destination.js:59` | `1` | O |
| `src/feature_expansion_destination.js:61` | `1, coLocated=true` | O |
| `src/feature_expansion_destination.js:63` | `coLocated=true` | O |
| `src/feature_expansion_destination.js:64` | `1` | O |
| `src/feature_expansion_destination.js:65` | `2, once=true` | O |
| `src/feature_expansion_destination.js:66` | `12` | O |
| `src/feature_expansion_destination.js:67` | `coLocated=true` | O |
| `src/feature_expansion_destination.js:68` | `1, returning=true` | O |

### src/feature_expansion_destination_host.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/feature_expansion_destination_host.js:13` | `0, bidirectional=true, lifetime=null` | O |
| `src/feature_expansion_destination_host.js:14` | `passage=true, manifestation=false, contact=false` | O |
| `src/feature_expansion_destination_host.js:15` | `1, allowed=true, allowEquipped=true` | O |
| `src/feature_expansion_destination_host.js:49` | `12, 9, 9, 12` | O |
| `src/feature_expansion_destination_host.js:51` | `0, 12` | O |
| `src/feature_expansion_destination_host.js:54` | `0, 1` | O |
| `src/feature_expansion_destination_host.js:55` | `0` | O |
| `src/feature_expansion_destination_host.js:56` | `9, 9` | O |
| `src/feature_expansion_destination_host.js:57` | `0, 1` | O |
| `src/feature_expansion_destination_host.js:58` | `0, 1` | O |
| `src/feature_expansion_destination_host.js:59` | `0` | O |
| `src/feature_expansion_destination_host.js:60` | `0, 1` | O |
| `src/feature_expansion_destination_host.js:61` | `1` | O |
| `src/feature_expansion_destination_host.js:62` | `0, 1` | O |
| `src/feature_expansion_destination_host.js:63` | `0, 1` | O |
| `src/feature_expansion_destination_host.js:120` | `1` | O |
| `src/feature_expansion_destination_host.js:122` | `2, 1` | O |
| `src/feature_expansion_destination_host.js:123` | `1` | O |
| `src/feature_expansion_destination_host.js:142` | `1, 2, 5, 0` | O |
| `src/feature_expansion_destination_host.js:149` | `parentInstanceId=null` | O |
| `src/feature_expansion_destination_host.js:150` | `activeVisitId=null` | O |
| `src/feature_expansion_destination_host.js:156` | `targetId=null` | O |
| `src/feature_expansion_destination_host.js:161` | `-63` | O |

### src/feature_expansion_destination_native.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/feature_expansion_destination_native.js:8` | `1, 1, 1, 6, 0, 1` | P environment/calendar; O remainder |
| `src/feature_expansion_destination_native.js:9` | `360, 1440, 30, 12` | P environment/calendar; O remainder |
| `src/feature_expansion_destination_native.js:10` | `1, 12, 1, 30, 1, 60, 24, 60, 1` | P environment/calendar; O remainder |
| `src/feature_expansion_destination_native.js:52` | `1, 4, is_unlocked=false` | O |
| `src/feature_expansion_destination_native.js:55` | `0` | O |
| `src/feature_expansion_destination_native.js:57` | `is_unlocked=false` | O |
| `src/feature_expansion_destination_native.js:58` | `is_unlocked=false` | O |
| `src/feature_expansion_destination_native.js:59` | `16, is_temperature_static=true, feature_destination=true` | P environment/calendar; O remainder |

### src/book_world_effects.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/book_world_effects.js:4` | `0.9` | O |
| `src/book_world_effects.js:5` | `0.85` | O |

### src/pocket_realm_content.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/pocket_realm_content.js:39` | `initialOpen=false` | O |
| `src/pocket_realm_content.js:40` | `initialOpen=false` | O |
| `src/pocket_realm_content.js:41` | `initialOpen=false` | O |
| `src/pocket_realm_content.js:91` | `2, 6` | O |
| `src/pocket_realm_content.js:93` | `4` | O |
| `src/pocket_realm_content.js:97` | `coLocated=true` | O |
| `src/pocket_realm_content.js:99` | `coLocated=false` | O |
| `src/pocket_realm_content.js:108` | `provision=false` | O |
| `src/pocket_realm_content.js:109` | `6, 2, 20, 20, 10, 10` | O |
| `src/pocket_realm_content.js:111` | `1` | O |
| `src/pocket_realm_content.js:116` | `8` | O |
| `src/pocket_realm_content.js:120` | `coLocated=true, once=true` | O |
| `src/pocket_realm_content.js:125` | `once=true` | O |
| `src/pocket_realm_content.js:126` | `coLocated=false` | O |
| `src/pocket_realm_content.js:129` | `value=true` | O |
| `src/pocket_realm_content.js:131` | `6, 3` | O |
| `src/pocket_realm_content.js:132` | `1` | O |
| `src/pocket_realm_content.js:136` | `-2, -1, -2` | O |
| `src/pocket_realm_content.js:138` | `2, 3` | O |
| `src/pocket_realm_content.js:140` | `2` | O |
| `src/pocket_realm_content.js:141` | `-1, -1` | O |
| `src/pocket_realm_content.js:142` | `3, 1` | O |
| `src/pocket_realm_content.js:146` | `5` | O |
| `src/pocket_realm_content.js:149` | `2` | O |
| `src/pocket_realm_content.js:150` | `-2, -1, -2` | O |
| `src/pocket_realm_content.js:151` | `-1` | O |
| `src/pocket_realm_content.js:159` | `once=true` | O |
| `src/pocket_realm_content.js:160` | `3` | O |
| `src/pocket_realm_content.js:163` | `-1, -1, -1` | O |
| `src/pocket_realm_content.js:167` | `once=true` | O |
| `src/pocket_realm_content.js:173` | `3` | O |
| `src/pocket_realm_content.js:174` | `coLocated=false` | O |
| `src/pocket_realm_content.js:179` | `-2, -2, 2` | O |
| `src/pocket_realm_content.js:180` | `4` | O |
| `src/pocket_realm_content.js:181` | `coLocated=false` | O |
| `src/pocket_realm_content.js:182` | `2` | O |
| `src/pocket_realm_content.js:197` | `1, 1` | O |
| `src/pocket_realm_content.js:205` | `numbersAccepted=false` | O |
| `src/pocket_realm_content.js:209` | `open=false, expiresAt=null` | O |
| `src/pocket_realm_content.js:211` | `retainActualBody=true, retainOwnedSources=true, loansRequirePermission=true` | O |
| `src/pocket_realm_content.js:213` | `grantsIdentity=false, grantsContact=false` | O |

### src/pocket_realm_scenes.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/pocket_realm_scenes.js:51` | `2, 6` | O |
| `src/pocket_realm_scenes.js:56` | `1` | O |
| `src/pocket_realm_scenes.js:59` | `coLocated=true` | O |
| `src/pocket_realm_scenes.js:62` | `3` | O |
| `src/pocket_realm_scenes.js:65` | `coLocated=false` | O |
| `src/pocket_realm_scenes.js:68` | `value=true` | O |
| `src/pocket_realm_scenes.js:69` | `awakened=true, active=true` | O |
| `src/pocket_realm_scenes.js:75` | `once=true` | O |
| `src/pocket_realm_scenes.js:80` | `4` | O |
| `src/pocket_realm_scenes.js:82` | `-1, -1` | O |
| `src/pocket_realm_scenes.js:83` | `-2` | O |
| `src/pocket_realm_scenes.js:84` | `1` | O |
| `src/pocket_realm_scenes.js:85` | `2, native=true` | O |
| `src/pocket_realm_scenes.js:89` | `once=true` | O |
| `src/pocket_realm_scenes.js:90` | `2, -1, -1` | O |
| `src/pocket_realm_scenes.js:93` | `once=true` | O |
| `src/pocket_realm_scenes.js:96` | `-1, -1, 1` | O |
| `src/pocket_realm_scenes.js:100` | `once=true` | O |
| `src/pocket_realm_scenes.js:104` | `-1, -1` | O |
| `src/pocket_realm_scenes.js:105` | `-1, -1` | O |
| `src/pocket_realm_scenes.js:109` | `once=true` | O |
| `src/pocket_realm_scenes.js:110` | `5` | O |
| `src/pocket_realm_scenes.js:111` | `-1, -2` | O |
| `src/pocket_realm_scenes.js:112` | `-2, native=true` | O |
| `src/pocket_realm_scenes.js:115` | `once=true` | O |
| `src/pocket_realm_scenes.js:116` | `4` | O |
| `src/pocket_realm_scenes.js:118` | `2` | O |
| `src/pocket_realm_scenes.js:119` | `-1, -1, -1` | O |
| `src/pocket_realm_scenes.js:121` | `once=true` | O |
| `src/pocket_realm_scenes.js:122` | `coLocated=true` | O |
| `src/pocket_realm_scenes.js:127` | `once=true` | O |
| `src/pocket_realm_scenes.js:135` | `1` | O |
| `src/pocket_realm_scenes.js:138` | `once=true` | O |
| `src/pocket_realm_scenes.js:139` | `coLocated=true` | O |
| `src/pocket_realm_scenes.js:140` | `4` | O |
| `src/pocket_realm_scenes.js:142` | `2` | O |
| `src/pocket_realm_scenes.js:143` | `2` | O |
| `src/pocket_realm_scenes.js:144` | `-1, -1` | O |
| `src/pocket_realm_scenes.js:147` | `once=true` | O |
| `src/pocket_realm_scenes.js:152` | `once=true` | O |
| `src/pocket_realm_scenes.js:159` | `once=true` | O |
| `src/pocket_realm_scenes.js:160` | `coLocated=false` | O |
| `src/pocket_realm_scenes.js:162` | `-1, native=true` | O |
| `src/pocket_realm_scenes.js:163` | `1` | O |
| `src/pocket_realm_scenes.js:168` | `coLocated=false, readOnly=true` | O |
| `src/pocket_realm_scenes.js:206` | `nativeWrapperRequired=true` | O |
| `src/pocket_realm_scenes.js:218` | `commandId=null` | O |
| `src/pocket_realm_scenes.js:229` | `commandId=null` | O |
| `src/pocket_realm_scenes.js:239` | `numbersAccepted=false` | O |
| `src/pocket_realm_scenes.js:241` | `1` | O |
| `src/pocket_realm_scenes.js:242` | `4` | O |
| `src/pocket_realm_scenes.js:243` | `3, 2` | O |
| `src/pocket_realm_scenes.js:244` | `1` | O |
| `src/pocket_realm_scenes.js:249` | `grantRequiresMasterSelection=true` | O |
| `src/pocket_realm_scenes.js:251` | `initializeOnlyWhenMissing=true` | O |
| `src/pocket_realm_scenes.js:257` | `0, zeroFuelIsOriginalScopeChoice=true` | O |
| `src/pocket_realm_scenes.js:259` | `1` | O |
| `src/pocket_realm_scenes.js:260` | `selectionAndAssentRequired=true` | O |

### src/pocket_realm_rules.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/pocket_realm_rules.js:5` | `0, bidirectional=true, lifetime=null` | O |
| `src/pocket_realm_rules.js:7` | `1, allowed=true, allowEquipped=true` | O |

### src/pocket_realm_host.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/pocket_realm_host.js:24` | `-1` | O |
| `src/pocket_realm_host.js:39` | `-1, native=true` | O |
| `src/pocket_realm_host.js:43` | `-1, 1, native=true, coLocated=true` | O |
| `src/pocket_realm_host.js:45` | `-2, -2, 2, 3` | O |

### src/pocket_observation.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/pocket_observation.js:23` | `32` | O |
| `src/pocket_observation.js:26` | `1, 0` | O |
| `src/pocket_observation.js:29` | `once=true, coLocated=true` | O |
| `src/pocket_observation.js:31` | `-1, 1, native=true` | O |
| `src/pocket_observation.js:32` | `value=true, value=true` | O |
| `src/pocket_observation.js:33` | `awakened=true, active=true` | O |
| `src/pocket_observation.js:36` | `once=true` | O |
| `src/pocket_observation.js:37` | `-2, -1, -2` | O |
| `src/pocket_observation.js:38` | `value=true` | O |
| `src/pocket_observation.js:39` | `-1, native=true` | O |
| `src/pocket_observation.js:45` | `once=true, coLocated=true` | O |
| `src/pocket_observation.js:46` | `-1, 1, native=true` | O |
| `src/pocket_observation.js:51` | `0, 1` | O |
| `src/pocket_observation.js:52` | `bidirectional=false` | O |
| `src/pocket_observation.js:53` | `12, 12, 0, clock=null, 12=null` | O |
| `src/pocket_observation.js:55` | `sense=true, identify=false, reach=true, contact=false` | O |
| `src/pocket_observation.js:60` | `1, 1` | O |
| `src/pocket_observation.js:61` | `1, 12` | O |
| `src/pocket_observation.js:64` | `0` | O |
| `src/pocket_observation.js:67` | `1` | O |
| `src/pocket_observation.js:68` | `1` | O |
| `src/pocket_observation.js:69` | `0` | O |
| `src/pocket_observation.js:91` | `expiresAt=null` | O |
| `src/pocket_observation.js:96` | `32, 1` | O |
| `src/pocket_observation.js:97` | `12` | O |
| `src/pocket_observation.js:99` | `2, 1` | O |
| `src/pocket_observation.js:108` | `owned=true` | O |
| `src/pocket_observation.js:110` | `0, 0` | O |
| `src/pocket_observation.js:111` | `available=true` | O |
| `src/pocket_observation.js:114` | `2, 2` | O |
| `src/pocket_observation.js:116` | `0` | O |
| `src/pocket_observation.js:119` | `1, open=false` | O |
| `src/pocket_observation.js:136` | `0` | O |
| `src/pocket_observation.js:147` | `1` | O |
| `src/pocket_observation.js:149` | `0` | O |
| `src/pocket_observation.js:152` | `32` | O |
| `src/pocket_observation.js:159` | `2, 2` | O |
| `src/pocket_observation.js:165` | `0, visible=false, eligible=false` | O |
| `src/pocket_observation.js:168` | `0, 0, eligible=true` | O |
| `src/pocket_observation.js:169` | `visible=false, eligible=false` | O |
| `src/pocket_observation.js:175` | `32, eligible=false` | O |
| `src/pocket_observation.js:195` | `busy=false` | O |
| `src/pocket_observation.js:199` | `-1` | O |
| `src/pocket_observation.js:203` | `0, 1` | O |
| `src/pocket_observation.js:224` | `0` | O |
| `src/pocket_observation.js:226` | `0, 0` | O |

### src/realm_state.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/realm_state.js:20` | `2, 64, 32` | O |
| `src/realm_state.js:24` | `parentInstanceId=null` | O |
| `src/realm_state.js:45` | `0, 0` | O |

### src/data/pocket_location.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/data/pocket_location.js:10` | `is_under_roof=true, pocket=true` | O |

### src/local_livelihood_content.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/local_livelihood_content.js:12` | `native=true` | O |
| `src/local_livelihood_content.js:14` | `1` | O |
| `src/local_livelihood_content.js:15` | `1` | O |
| `src/local_livelihood_content.js:16` | `1` | O |
| `src/local_livelihood_content.js:18` | `1, 1` | O |
| `src/local_livelihood_content.js:24` | `1` | O |
| `src/local_livelihood_content.js:25` | `completionCoLocated=true` | O |
| `src/local_livelihood_content.js:27` | `1, 3, 2, 1` | O |
| `src/local_livelihood_content.js:28` | `1, 1` | O |
| `src/local_livelihood_content.js:36` | `1` | O |
| `src/local_livelihood_content.js:40` | `once=true, coLocated=true` | O |
| `src/local_livelihood_content.js:42` | `-4` | O |
| `src/local_livelihood_content.js:43` | `3, 4, 1` | O |
| `src/local_livelihood_content.js:44` | `1` | O |
| `src/local_livelihood_content.js:52` | `once=true, coLocated=true` | O |
| `src/local_livelihood_content.js:53` | `-2, 2` | O |
| `src/local_livelihood_content.js:57` | `once=true, coLocated=true` | O |
| `src/local_livelihood_content.js:60` | `2, -1, -1` | O |
| `src/local_livelihood_content.js:62` | `coLocated=true` | O |
| `src/local_livelihood_content.js:65` | `coLocated=true` | O |
| `src/local_livelihood_content.js:68` | `2, -2, 2` | O |
| `src/local_livelihood_content.js:69` | `once=true, coLocated=true` | O |
| `src/local_livelihood_content.js:72` | `once=true, coLocated=true` | O |
| `src/local_livelihood_content.js:75` | `3, -1, -1` | O |
| `src/local_livelihood_content.js:76` | `2, 1` | O |
| `src/local_livelihood_content.js:77` | `-1, -1, -1` | O |
| `src/local_livelihood_content.js:78` | `coLocated=true` | O |
| `src/local_livelihood_content.js:82` | `1` | O |
| `src/local_livelihood_content.js:83` | `1` | O |
| `src/local_livelihood_content.js:85` | `once=true, coLocated=true` | O |
| `src/local_livelihood_content.js:86` | `1` | O |
| `src/local_livelihood_content.js:88` | `2` | O |
| `src/local_livelihood_content.js:89` | `-1, -2` | O |
| `src/local_livelihood_content.js:90` | `1, 2, coLocated=true` | O |
| `src/local_livelihood_content.js:92` | `-1, 1, coLocated=true` | O |
| `src/local_livelihood_content.js:97` | `underRoof=true, underRoof=true` | O |
| `src/local_livelihood_content.js:98` | `1, 2, 1, 1, 1, 1` | O |
| `src/local_livelihood_content.js:99` | `1` | O |
| `src/local_livelihood_content.js:100` | `2, 1, mobile=true` | O |
| `src/local_livelihood_content.js:101` | `0, 1, 8, 6, 2, 10, 10, 10, 10, provision=false, mobile=true` | O |

### src/foundation_start_content.js

| Source | Scalars / named flags | Tag (field exceptions above prevail) |
|---|---|---|
| `src/foundation_start_content.js:30` | `1` | O |
| `src/foundation_start_content.js:31` | `completionCoLocated=true` | O |
| `src/foundation_start_content.js:33` | `-1` | O |
| `src/foundation_start_content.js:34` | `1, 2` | O |
| `src/foundation_start_content.js:35` | `1` | O |
| `src/foundation_start_content.js:37` | `1, 2` | O |
| `src/foundation_start_content.js:38` | `1, 0` | O |
| `src/foundation_start_content.js:45` | `underRoof=true` | O |
| `src/foundation_start_content.js:47` | `1` | O |
| `src/foundation_start_content.js:48` | `2, 1, 1, 1, 1` | O |
| `src/foundation_start_content.js:49` | `0.25` | O |
| `src/foundation_start_content.js:50` | `1` | O |
| `src/foundation_start_content.js:51` | `1` | O |
| `src/foundation_start_content.js:55` | `2, mobile=true` | O |
| `src/foundation_start_content.js:57` | `1, mobile=true` | O |
| `src/foundation_start_content.js:63` | `1, 1, 1, once=true` | O |
| `src/foundation_start_content.js:64` | `1, completionCoLocated=true` | O |
| `src/foundation_start_content.js:66` | `-1, -1, 1, reservationReturn=true` | O |
| `src/foundation_start_content.js:76` | `2` | O |

## More to consider, other stuff

All are INFERRED proposals. ACT NOW here means record the correction in these owned docs, not edit runtime.

| Code / disposition | New angle / cross-world consequence | Default + Dial + in-world reason |
|---|---|---|
| W37.X1 ACCOUNT | **Provenance is a field/clause property.** A source name next to an invented price is common in every existing native adapter. A family-level count cannot become a scalar “canon score”. | Default Bidentity/Olocaltransaction/Punknownenvironment; Dial edition/era overlay per field. Let a known source place offer a clearly authored guest service without forging a book tariff. |
| W37.X2 ACCOUNT | **Exposure, light and physical flows are independent.** Rooftrue blocks local rainfall but does not prove light/temperature; Glasshouse's explicit air/light doorway flows differ from precipitation. | Default independent local exposure/illumination/thermal policy and knownness. Dial room openings, local lamps, paid simulation or sourced event sky. A doorway carrying air is not an automatic conduit for home seasonal rain. |
| W37.X3 ACCOUNT | **Unknown state must cross every consumer.** NaN/null coercion can yield0°C, night or false dry weather; pure helper finite-temperature validation cannot express unknown alone. | Default unavailable display plus separately declared neutral mechanics, keeping uncertainty visible. Dial authored measured reading, without allocating freeColdXP or granting an immunity source. |
| W37.X4 ACCOUNT | **Clock provenance is not clock ownership.** Retained played clocks already solve local freeze; their Game_Time projection supplies unsourced epoch/calendar. W31's paired realms and W30's future loop need different profiles. | Default retain elapsed+sourceidentity, add qualified projection metadata when selected. Dial actor/local/institution/transport clocks; preserve frozen job descriptors and source-consistent revision migration. |
| W37.X5 LATER | **Provenance retirement should preserve decisions.** A newly found book quote may concern another era, seller, portion or currency. Blind replacement could break finite solvency and saved reservations. | Default keep O prototype contract and introduce a separately qualified offer. Dial prospective balance change with explicit compatibility. Source tags should expose choices, not silently reprice a paid job. |
| W37.X6 LATER | **Leak causality receipts help more than a color legend.** It is hard to distinguish carriedWet from locally createdWet or home-night from local dark in a screenshot. | Default read-only known cause/world/instance/profile/time in W27's lens. Dial trusted developer diagnostics beyond actor knowledge, with sealed disclosure filtering before projection. Do not expose private truth through a denied-action reason. |
| W37.X7 ACCOUNT | **Debt can fall without invented certainty.** Renaming P20 to O20 needs an explicit creative choice, not a green-count incentive. Book climate gap can remain honest while local play improves. | Default track resolvedsource, explicitlyauthored and stillunknown separately. Dial source window/room rather than maximizing a weighted canon percentage. |

Three ranked suggestions, design only:

1. **W37.A1 / ACCOUNT NOW:** route H1-H3 and BR1 to the W36 integrator: preserve the branch rain guard, then use one active-world environment context for remaining light stats, icons, quiet detail and cold readers. Done check for later authorized implementation: Q1-Q7/Q12-Q13 plus rebuilt desktop comparison, with existing saves/carry effects intact. Closing only the rain icon is insufficient.
2. **W37.A2 / LATER:** add a small provenance field map using current IDs and this ledger, starting MoL/Paradise/Proto23. Reuse W27; keep source edition/member/claim, tag, knownness and original branch rationale independent. Done check: mixed rows and hidden placeholders pass Q14, no sealed truth on the public lens, no raw novel prose copied.
3. **W37.A3 / LATER:** resolve one place/era source gap per canon-first implementation slice, then reduce R-family debt with qualified evidence or an explicit original choice. Use W29 source windows and W30/W31 stage boundaries; preserve current service solvency and native clock/stock conservation. Done check: dated before/after counts name their units and show the exact source consumer, without claiming gameplay from documentation.

