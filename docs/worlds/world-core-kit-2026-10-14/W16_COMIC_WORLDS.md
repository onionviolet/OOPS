# W16: comic worlds through the kit

> Code namespace 2026-10-19 (no codes renamed): CW3 here is a confirmation rating on the kit's CW3 row; CW3 also appears in NONHUMAN_STARTS_ENGINE_REQUIREMENTS. Outside this file cite `W16_COMIC_WORLDS#CW3`. See [reserved prefixes](../../RULES_INDEX.md#reserved-prefixes-2026-10-19).

## CHECKPOINT

2026-10-14. Design pass complete after the checks recorded in W16_REPORT.md. Owned writes: this file and that report only. Seventeen CW rows checked; ten cards cover Worm and Ward separately plus eight other requested/chosen settings. Every card proposes the eleven requested K parts and adds subtle rows. No playable-floor claim, source change, build, private pack, save, staging or commit. Resume by refreshing the root palette and source access, not by treating these proposals as accepted direction.

## W16.E: scope, evidence and floor language

Read COMMON first, then the root palette, AGENTS, PROJECT standing priorities and user preferences. This lane extends round 6 rather than replacing K/CWS/CL/CLR/OV/AX/II codes. Comic ranking is only within this candidate group. It does not move comics ahead of the canon-first order in PROJECT or reopen paused runtime work.

**SHOWN** means directly read text or repository data with a locator. **STATED** means an attributed source statement, including a secondary wiki. **INFERRED** means an original proposal. **MEMORY** means a lore candidate not checked in this pass. A source's existence proves access, not every mechanic in it. All numerical game costs, prices, schedules, authored roles and future behavior below are INFERRED. Public canon spoilers are distinct from changed/sealed world truths. No SECRETS files were opened and no altered truth is supplied here.

The cards assess **documentation today before W16**, within the sources and world-design inventory read here. **partial** means useful source/design fragments exist but the complete typed K floor does not; **missing** means no corresponding world-specific floor was found in that bounded inventory. The adjacent text is a proposed floor, not a claim that source, gameplay or source verification now meets it. Even a complete design needs K1 issue/chapter binding and K18 runtime proof. Runtime was not inspected or tested in this lane. W1's D/R distinction and W2's cautions support this separation.

### W16.E1: source ledger

Paths below are repository-relative; section or paragraph IDs are locators. Web sources checked 2026-10-14. Publisher blurbs establish only the described premise or collection, not unread page-level mechanics.

| Ref | Evidence read and limit |
|---|---|
| E01 | `docs/research/comics/REPORT.md`, Findings F1-F9 and M1-M10. SHOWN dated research, with its SHOWN/STATED/INFERRED layers retained. Category counts are page counts across mixed realities, not demographics or probabilities. |
| E02 | `docs/research/comics/PLAYTHROUGH_TARGETS.md`, T1-T24, C1-C12, recommendations. Its `known` facts remain MEMORY unless checked here. T1 specifically warns about Invincible TV/comic mixing. |
| E03 | `docs/research/comics/raw/marvel_power_grid.wiki`, lines 1-5 and six stat sections. SHOWN wiki text; STATED handbook attribution and warning that ratings can be outdated. Source: [Marvel Database Power Grid](https://marvel.fandom.com/wiki/Power_Grid). |
| E04 | `docs/research/comics/raw/dc_Green_Lantern_Ring.wiki`, HistoryText, Pre-Crisis beginnings, Honor Guard, Overcharging, Oath and Powers headings. SHOWN secondary text, with issue citations and some citation-needed material. Separate Alan Scott/Starheart from Corps rings; recharge and weakness vary by era. [Ring source](https://dc.fandom.com/wiki/Green_Lantern_Ring). |
| E05 | `docs/research/comics/raw/mantles.json`, keys `marvel\|Captain America`, `marvel\|Sorcerer Supreme`, `dc\|Robin`, `dc\|Flash`, `dc\|Green Lantern`. SHOWN legacy and continuity catalog. `taxonomy.json` power-source/category keys, `events.json` Marvel/DC lists, and `flag_counts.json` identity/death keys were also inspected. Counts and list membership do not prove a specific issue's rule. |
| E06 | `docs/research/power-systems/wiki-digests/DIGEST_{dc-comics,marvel-comics,my-hero-academia,worm}.md`, Evidence limit, Source attempts and Dump addendum. All four are `blocked_no_revision`; their inherited mechanics are leads, not newly verified evidence. This does not invalidate the independent earlier E03-E05 pilot captures. |
| E07 | `docs/research/novels/full-book/worm/EDITION.md`, `SYSTEMS.md` sections natural-triggers-and-formula-acquisition and situated-power-execution-and-cost; `docs/research/novels/worm/world-design-2026-10-11/DESIGN.md`, F1-F3, era and means tables. SHOWN research with exact source locators, not a new whole-book reread. Available supplied EPUB opened through read-only `source_reader.py`. Directly read W007:p002-p014 (cape history), W013:p054-p059 (recruitment and territory), W064:p150-p166 (classification and containment) and p180-p215 (prison economy). Member hashes checked by reader. In particular W064:p152/p156/p159 ties ratings to precautions; assessments are Dragon's testimony, not objective combat tiers. |
| E08 | [Ward author introduction](https://www.parahumans.net/) and [TOC](https://www.parahumans.net/table-of-contents/). STATED official sequel premise: reconstruction, uneasy amnesty and damaged records/facilities. TOC makes chapters discoverable, not read. A direct guessed chapter open failed; switched to available introduction/TOC. No Ward full-text reading claim. |
| E09 | [VIZ MHA introduction](https://www.viz.com/my-hero-academia). STATED 80% Quirk population, Quirkless minority, academy and exceptional inherited power premise. E06's MHA license/mastery distinctions remain unchecked leads where not supported here. A guessed volume URL failed; used the successful title route instead. |
| E10 | [VIZ OPM introduction](https://www.viz.com/opm) and [Vol. 3](https://www.viz.com/manga-books/manga/one-punch-man-volume-3/product/3485). STATED training, Saitama/Genos and Hero Association premise; volume source is a bounded reading lead. It does not establish a reproducible training formula for every actor. |
| E11 | [Image Invincible Compendium 1](https://imagecomics.com/comics/releases/invincible-compendium-vol-1-tp). STATED collection of #0-47 and official first-issue reading route. E02 supplies the intended #1-144 comic boundary but its detailed counter/plot claims remain leads. No comic issue pages acquired or fully read here. |
| E12 | [Dynamite The Boys catalog](https://dynamite.com/titles/the-boys/), Name of the Game and #24 descriptions. STATED publisher comic premise and undercover G-Wiz job. E02's drug/corporation claims require comic issue binding; Amazon versions are excluded. |
| E13 | [DC Watchmen collection](https://www.dc.com/graphic-novels/watchmen-1986/watchmen). STATED investigation, former teammates, legal pursuit and Cold War premise, original series credit. No movie, Before Watchmen or Doomsday Clock facts imported. |
| E14 | [Dark Horse Hellboy/B.P.R.D. 1956](https://digital.darkhorse.com/books/929a7e7010844f4bbfd7db8bdbbb0caa/hellboy-and-the-bprd-1956) and [1955-1957 collection](https://digital.darkhorse.com/books/61e038a16668416bb48d366ddc3ec21d/hellboy-and-the-bprd-1955-1957). STATED period cases, institutional pressure and international occult investigations. Cast/ritual details still need pages. |
| E15 | [DC Prelude to Knightfall](https://www.dc.com/graphic-novels/batman-knightfall-1993/batman-prelude-to-knightfall), [Knightfall Vol. 1](https://www.dc.com/graphic-novels/batman-knightfall-1993/batman-knightfall-vol-1-new-edition), [Who Rules the Night](https://www.dc.com/graphic-novels/batman-knightfall-1993/batman-knightfall-part-2-who-rules-the-night). STATED main-line Gotham exhaustion, Bane and successor phases with collection issue ranges. Not evidence for every main-line DC era. |
| E16 | [Marvel She-Hulk: Breaking the Fourth Wall](https://www.marvel.com/comics/collection/99377/she-hulk_epic_collection_breaking_the_fourth_wall_2022). STATED reader/creator address, specifically Sensational She-Hulk #1-12 and listed companion material. [Civil War II: Choosing Sides #1](https://www.marvel.com/comics/issue/59606/civil-war-ii-choosing-sides-2016-1) confirms Damage Control in a tie-in; it does not establish Civil War 2006 event timings. |
| E17 | `docs/worlds/world-core-kit-2026-10-14/W1_READINESS.md`, W1.E; `W2_LAWS_POWER_COMBAT.md`, floor/evidence cautions; `docs/COMIC_WORLDS_AND_MEDIUM_CONSIDERATIONS_2026-10-14.md`, introduction/CW/CL tables. SHOWN sibling proposals, read only. That medium document uses overlapping CW/CL codes: references in W16 mean root-kit codes unless explicitly qualified. |

### W16.V: each root CW row checked

CONFIRMED applies to a bounded claim, not to its proposed engine implication. CORRECTED preserves the useful part and names the overreach. UNVERIFIED means evidence read here cannot settle it.

| Root row | Verdict | Evidence and corrected scope |
|---|---|---|
| CW1 | CONFIRMED | E05 catalogs counterparts and continuities; E02 distinguishes 6160 from older Ultimate and AU realities. Multiple continuities are real. A universal lattice and runtime overlay are INFERRED, not mandatory for a single frozen snapshot. |
| CW2 | UNVERIFIED | No checked handbook/issue locator establishes one common aging formula. Sliding time is a plausible Big Two editorial lead, not a law of Worm, Ward, MHA, Invincible or all comics. Default fixed local calendar; dial sliding chronology only after binding a source/era. |
| CW3 | CONFIRMED | E05 power sources and E01 F3 support heterogeneous origins; E04 distinguishes magic legacy and Corps technology. Origin, acquisition and operating resource are separate fields. Do not convert all origins into mana bars. |
| CW4 | CORRECTED | E03 confirms Marvel's six 1-7 handbook dimensions, with stale-entry caveat. E07 W064 directly connects PRT class/rating to containment protocols. E06 does not prove a universal DC threat scale or MHA Quirk rank. Hero popularity/license, Quirk type, tactical threat and bodily capacity need different fields. |
| CW5 | CONFIRMED | E05 identity flags and mantle/person catalog support aliases. One actor can have more than two faces or a public identity; E01 F6's "default" is not true of its own DC count. Persona-specific standing needs witnesses who may link them. |
| CW6 | CORRECTED | E05 records formerly deceased pages, not a return probability. Repairs and returns are character/event/era-specific. The dated pilot's 5-7% page ratios cannot drive a death roll or imply that next issue repairs every neighborhood. Default lasting injury/damage; dial named revival and restoration routes. |
| CW7 | CORRECTED | E05 lists crossovers alongside historical events; E16 establishes one tie-in. Global scope does not mean universal participation or a fixed recurring schedule. Publication order, in-world time and district consequence must be separate. Event-season scheduling is INFERRED. |
| CW8 | CONFIRMED | E07 W013 names competing teams; E12 describes a junior team; E01/E05 include Corps and mantle membership. Roster churn is usable. Votes and reserve lists are institution-specific proposals, not universal team rules. |
| CW9 | CONFIRMED | E05 ranges from ordinary identities to cosmic sources; E01 documents street jobs and deities. Scale coexistence is supported as a setting feature, not a guaranteed safe cosmic gate. An access gate can be social, transport or information, not just level. |
| CW10 | CONFIRMED | E01 jobs, E16 Damage Control and E07 cash recruitment/prison barter ground work around capes. Insurance products and tourism are authoring candidates until a source is bound. Ordinary starts can matter without powers. |
| CW11 | CORRECTED | E07 W064:p180-p215 directly shows prison tolls, favors and repair usefulness; E05 criminal/prison flags support the broad premise. No checked source proves a general henchman union. Gang, prison, contractor and union rules must be independent. |
| CW12 | CONFIRMED | E05 legacy pages support repeated holders; E04 shows distinct Lantern traditions. Mantle, body, office, equipment and granted faculty transfer separately. A title alone is not power inheritance. |
| CW13 | CONFIRMED | E16 verifies a comic series explicitly using reader address; E13/E14 are credited visual comics. The proposed panel/log/lettering frame is INFERRED. Worm/Ward are prose serials and need an optional comic skin, not a canon visual interface. |
| CW14 | CORRECTED | E16 confirms She-Hulk reader/creator interaction in the bounded collection. Deadpool and Ambush Bug remain unchecked examples here. A character gag does not confer reliable UI knowledge, retcon authority or sealed truth. |
| CW15 | CORRECTED | E14 fixes a 1956 story period while E15 fixes a 1993 publication run. Industry ages are not diegetic calendars. "No smartphones in Silver Age" is a chosen period default, not universal comic physics. Record publication era, fictional date and modernization separately. |
| CW16 | CORRECTED | E07 confirms accessible Worm edition and source-qualified local rules. E08-E12 establish distinct source routes, not equal rule tightness. OPM's exceptional protagonist and Invincible's varied counters resist universal formulas. Rank each snapshot on verified rules and access, not on finite length alone. |
| CW17 | CONFIRMED | E06 records actual prior blocks; E03-E05 independently exist as earlier pilot captures. This is route/date-specific. Prefer local captures and official pages after a failed route; do not label every claim MEMORY when checked evidence exists. No blocked Fandom request was repeated in this pass. |

## W16.F: shared floor contract for the ten cards

**F1 Starts and means.** Each trio below has an ordinary role, a job/tool role and a power-adjacent role. For every authored start, default cash covers seven basic meals plus seven nights of shared housing; debt is one named obligation, not an unexplained negative purse. The ordinary starter knows local transport, work and public news only; the skilled starter also knows one trade; the adjacent starter knows their own ability or agency duties, never the setting's hidden truth. Dial resources, debt and starting knowledge independently with an in-world family/job reason. No training or job secretly guarantees a trigger, Quirk or Viltrumite body.

**F2 Economy and care.** Proposed prices below are fictional tuning values, not researched historical prices. All cards use weekday work and evening/weekend availability, adjusted by their K12 crisis. Beds, food and paid care support ordinary life. Comfortable unfed play and no hunger death remain standing direction. Reward work quality and kept obligations, not only fights. Each job pays a meal/bed budget at modest hours by default; dial rent and subsidy for local scarcity. Recovery retains consequences without forcing unattended catastrophic harm.

**F3 Cast floor.** Every K6 row lists six proposed usable cast roles. A listed canon name is a candidate pending snapshot/page binding unless its evidence is specified. The first three receive T2 verbs; the two marked **memory pair** also get schedule, need and a remembered act. The authored **arc contact** gets T5: introduction, request, player decision, persistent consequence, closure and future availability. Contacts do not obligate a canon protagonist meeting. Authored people are local additions labeled INFERRED, not newly claimed canon characters.

**F4 Event floor.** Each K12 row has three canon event candidates or source-backed phases with locator leads, a local quest shape and abstention consequence. A phase not checked at page/chapter level is marked MEMORY/candidate and remains partial. Default relative chronology; dial start era and degree of divergence. Source events happen through causal conditions, not forced retries after the player prevents them. Choosing to work during a crisis still changes routes, demand or notices. Exact dates and unread outcomes are not invented.

**F5 Presentation floor.** Target 1366×768 laptop and wider desktop. Proposed visible outcome: district/jobs on one side, case/team evidence on the other, stable caption history below; routine actions remain visible at useful text size. Each card gives palette, log voice and one revealed panel. Text labels identify speaker/source even without color, animation or special lettering. Dial comic skin intensity for diegetic printing or player preference. Mobile layout is deferred. No rebuilt-browser claim is made.

**F6 Power floor.** K3 rows include a resource/state, training route, four usable techniques and rank treatment. Ordinary trade/rescue/investigation counts as a core. Other innate, technological or supernatural cores can coexist but require individual rules and source locators. The same K3 core need not grant the same results to every body. No universal strength tier replaces matchup, range, exposure, tools or civilian objectives.

**F7 Defeat.** Every combat row defaults to retreat, capture or injury according to the threat; recovery uses the card's clinic/bed, gear repair and social aftermath. Dial lethal stakes and named exceptional recovery with a source/era reason. A body that survives damage does not undo hostage loss, disclosure or a ruined paycheck.

## W16.WO: Worm, early Brockton Bay

Evidence: E07 supplied edition and finite design ER02, E02 T19. Existing design remains the research owner. Default early-serial local work; dial pre-crisis/recovery era, because the same street has different supply and authority after damage. Source qualifiers below come from E07; added game behavior is INFERRED.

| Part | Today / pointer | Proposed floor |
|---|---|---|
| WO.K2 | partial, E07 means/era tables | Six laws: acquisition is not ordinary training; each power has its own target/range; available material and sensory load matter; practice changes operation rather than granting any function; PRT ratings are assessed responses; cape secrecy/truces depend on witnesses and institutions. Default no automatic revival; dial a named source-backed exception. First five are research-supported; local secrecy enforcement needs a scene binding. |
| WO.K3 | partial, E07 situated-power section | Fabrication/rescue core: cloth stock, tools, fatigue, tested fit. Learn from a local repairer; measure, stitch, reinforce and field-test. Trade standing is visible; PRT assessment separate. Optional existing cape faculty is a second core with a checked holder profile. Default ordinary craft; dial cape start with its own history. |
| WO.K4 | partial, E07 ER02 start design | Ordinary PRT records temp with bus fare and shift obligation; tailor's helper with tools and supplier tab; adult independent cape with modest rented workspace and one agreed commission. Use F1 means/knowledge, no predetermined trigger reward. |
| WO.K5 | partial, E07 geography/ER02 | Six-place hub: rented room, repair shop, bus stop, Boardwalk stall, public clinic, PRT reception. Route out to docks; hazard is contested access. Daytime deliveries/night patrols. Exact street bindings still needed. |
| WO.K6 | partial, E07 W013 and design cast leads | Brian: negotiate a job; Lisa: compare a claim; Armsmaster: review evidence; authored shopkeeper and clerk are the memory pair; authored neighbor is arc contact for an evacuation/repair commitment. Canon access depends on standing, not a free menu. |
| WO.K7 | partial, E07 W013/W064 | PRT/Protectorate as distinct administrative/hero roles, Wards as youth institution, Undersiders and competing local groups. Join ordinary employment, owe a commission or anger a team by leaking its location. Record civilian standing separately from cape identity. |
| WO.K8 | partial, E07 cash/barter scenes | USD; records shift, suit repair, delivery. Prototype meal $6, shared bed $18/night, cloth kit $12; weekdays and pickup deadlines. Default civilian wages fund housing; dial crisis scarcity through blocked suppliers rather than a universal price multiplier. |
| WO.K10 | partial, E07 execution/containment | Four threats: territorial shakedown, ranged cape, specialist bomb/device, identity exposure. Combat grammar: test reach, disrupt means, choose escape/containment and protect witnesses. Foam and restraints are assessed tools, not universal counters. Defeat F7 with clinic, repair and team debt. |
| WO.K12 | partial, E07 ER02/ER03; E02 T19 | Candidates: early Lung confrontation (W013 aftermath directly checked), Bakuda crisis and detention (W064 intake directly checked), Leviathan/recovery (Worm arc 8 and E07 ER03, not reread here). Local commission: deliver reliable safety gear. Abstain: competing teams recruit, route risk grows, crisis supply changes. Exact trigger times remain open. |
| WO.K13 | partial, E07 finite commission proposal | Observe operational problem → acquire cloth/tools → test design → negotiate job → deliver → see whether it worked → repair and earn trust. Default finite commissions; dial patron/team demand because local reputation opens work. |
| WO.K14 | missing, E07 is prose design | Slate/harbor amber, practical first-person notebook voice; reveal an operational-profile panel after a witnessed test. Default prose captions, optional comic framing. No omniscient shard display. |

| Subtle row | More to consider, default + dial + reason |
|---|---|
| WO.S1, CWS3/5 | Patched glove and an unpaid repair slip carry the same job ID. Default visible to its owner; dial supplier publicity when debt is disputed. |
| WO.S2, CWS4 | A clerk notices identical appointment gaps, not a magical unmasking. Default tentative belief; dial corroboration because a shared schedule is weak evidence. |
| WO.S3, CL5/CLR1 | A PRT file shows assessor, date, evidence and recommended precautions. Default stale uncertainty; dial updated observation after a real encounter. |

## W16.WA: Ward, reconstruction-era City

Evidence: E08 official premise/TOC only for Ward; E07 is prior-world context, not sequel proof. Default post-Worm rebuilding; dial neighborhood and later era only after chapter binding. Detailed cast/powers below are MEMORY candidates or INFERRED authored locals, not verified Ward mechanics.

| Part | Today / pointer | Proposed floor |
|---|---|---|
| WA.K2 | partial, E08 introduction | Six laws/proposals: society is rebuilding; old evidence/facilities can be missing; uneasy second chances alter enforcement; cooperation does not erase testimony; power profiles remain holder-specific; aid and therapy do not guarantee a power upgrade. First three STATED E08, rest INFERRED operating rules requiring Ward scenes. Default lasting damage, dial exceptional restoration by checked route. |
| WA.K3 | missing, E08 has no operational floor | Recovery/coordination core: capacity, supplies, trust and rest. Learn supervised field support; triage, route-plan, signal and evacuate. Team clearance is visible, damage output separate. Candidate cape core requires a Ward-specific profile, never a copied Worm end-state. |
| WA.K4 | missing, E08 | Ordinary housing registrar with record debt; reconstruction courier with bicycle/tools and delivery bond; team support recruit with radio and supervision obligation. F1 supplies means/knowledge; dial former identity/history because amnesty is uneven. |
| WA.K5 | partial, E08 rebuilding premise | Six places: shared housing, records office, depot, clinic, transit junction, supervised practice room. Route to settlement perimeter; hazard missing/unsafe links. Default predictable local route; dial cross-settlement travel after map verification. |
| WA.K6 | partial, E08 protagonist premise | Victoria and Jessica as MEMORY access candidates, plus authored foreman and registrar as memory pair, authored medic at T2, displaced household representative as arc contact. Requests: safe practice, records comparison, delivery, care, repair and a durable housing decision. |
| WA.K7 | partial, E08 uneasy amnesty | Reconstruction office and neighborhood council as authored joinable structures; hero teams and Wardens as MEMORY candidates. Owe aid deadlines, anger a council by falsifying records. Default public service membership; dial formal cape clearance after source binding. |
| WA.K8 | partial, E08 facilities/supply premise | Local dollar tender is a proposal pending chapter check; hauling, repair and records jobs. Prototype meal 5 units, bunk 15/night, transit 2; weekly aid/work calendar. Default paid work plus aid access; dial barter when supply links fail, with exchange provenance. |
| WA.K10 | partial, E08 conflict premise | Threats: unstable structure, hostile cape, crowd panic, sabotaged route. Grammar: coordination and extraction with attention to consent and team trust. F7 recovery includes care and follow-up, not a reset of relationships. |
| WA.K12 | partial, E08 TOC | Three chapter-binding candidates: Daybreak opening, early team formation/support, first joint field case. These are reading targets, not verified event summaries. Proposed local phases: register shelter, establish route, respond to failure. Abstain: other crews proceed and help may arrive late. Quest: restore a reliable care route. |
| WA.K13 | missing, E08 | Hear needs → confirm capacity → coordinate team → perform bounded aid → debrief → revise commitments. Default consent-aware support loop; dial team scope because reliability matters in a rebuilt society. |
| WA.K14 | missing, E08 prose serial | Dawn gold/blue-gray, restrained debrief voice; reveal team readiness and support commitments. Default notebook, dial caption panels for player skin preference. |

| Subtle row | More to consider, default + dial + reason |
|---|---|
| WA.S1, CWS2 | Conflicting records come from lost archives or witnesses. Default uncertainty; dial deliberate misinformation after evidence. Do not relabel missing records as a literal retcon. |
| WA.S2, CWS3/5 | A reused sign bears the previous depot number; a supply job corrects its route. Default mundane callback; dial public confusion when signage changes faster than maps. |
| WA.S3, CL4/CLR4 | A support lens reads stated needs and observed cues, not diagnoses or private thoughts. Default low confidence; dial disclosure through consent and actual communication. |

## W16.MH: My Hero Academia, early academy period

Evidence: E09 for broad premise; E06 is blocked and its detailed mechanics remain leads. Default manga continuity before large-scale collapse. Dial civilian/academy/agency focus because most people have Quirks while hero work is a career. Candidate canon names/events need volume/chapter locators.

| Part | Today / pointer | Proposed floor |
|---|---|---|
| MH.K2 | partial, E09/E06 | Six rules: Quirks are widespread but not universal (STATED); ordinary mastery differs from exceptional inheritance (premise STATED); capability depends on a specific Quirk/body; public use and hero authorization are distinct; rankings are social assessments; support gear has physical maintenance. Last four are INFERRED from unchecked leads, not a verified legal code. Default no shared Quirk XP tier; dial a checked awakening/inheritance exception. |
| MH.K3 | partial, E06 unchecked mastery lead | Rescue/support core: stamina, equipment condition and rehearsal records. Learn supervised drills; brace, carry, signal and evacuate. Quirk core optional: one defined output with strain/cooldown and four applications checked for that holder. Display training proficiency and license separately; never "Quirk rank A" by default. |
| MH.K4 | missing, E09 academy premise | Ordinary shop apprentice with rent and stock duty; support-course applicant with tool kit and exam prep; low-output Quirk student with school gear and attendance obligation. F1 knowledge excludes protagonist secrets. Dial Quirkless or powered body independently from job. |
| MH.K5 | missing, E09 | Six places: neighborhood room, shop, school reception, practice ground, gear lab, clinic. Route to agency district; hazard regulated/unsafe public use. Default school-day rhythm; dial internship access after acceptance. |
| MH.K6 | partial, E09 Midoriya; other names MEMORY | Midoriya: practice exchange; All Might: supervised advice; Aizawa: drill evaluation; authored shop owner and classmate are memory pair; authored injured customer is arc contact for a lasting access repair. Do not route every civilian through the protagonist. |
| MH.K7 | partial, E09 academy | U.A. school, hero agency, licensing authority as candidates. School joins with admissions, agency owes contracted work, authority remembers unsafe incidents. Default support access; dial hero credentials via checked exam rules. |
| MH.K8 | missing, E09 | Yen; stock clerk, equipment repair, clinic runner. Prototype meal ¥600, shared bed ¥1800/night, repair parts ¥1200; school terms and weekend work. Default civilian income matters; dial dorm subsidy by enrollment. |
| MH.K10 | partial, E06 body-strain leads | Threats: uncontrolled Quirk, falling structure, robber, training opponent. Grammar: rescue objective and controlled application, not just damage. F7 recovery uses rest/clinic, gear repair, discipline and missed work; exact body costs require holder scenes. |
| MH.K12 | missing, E09 has no event census | MEMORY candidates: entrance selection, USJ attack, Sports Festival, from early manga arcs. Three local phases are preparation, disrupted schedule and public audition. Quest: build a tested support item. Abstain: exams proceed, security changes, rivals gain publicity. Chapter/time binding remains required. |
| MH.K13 | missing, E09 | Identify rescue constraint → train control → make/fit gear → supervised exercise → receive evaluation → revise method. Default useful restraint; dial spectacle through agency/publicity incentives. |
| MH.K14 | missing, E09 | Clear school blue with warm action accents; earnest training log; reveal separate rescue proficiency/license/public standing panel. Default legible labels; dial halftone/SFX intensity without disguising uncertainty as a stat. |

| Subtle row | More to consider, default + dial + reason |
|---|---|
| MH.S1, CWS7 | Merch popularity and exam performance disagree. Default separate records; dial agency reliance on publicity because sponsorship and competence serve different goals. |
| MH.S2, CWS3 | Gear fits a body's own output, not every inherited technique. Default fitting checks; dial school resources because expensive redesign changes access. |
| MH.S3, CL3/5 | A danger warning identifies observation and lead time. Default hint; dial exactness only for a verified holder, not generic future sight. |

## W16.MV: Marvel Earth-616, bounded New York street slice

Evidence: E01/E03/E05 pilot; E16 checked publisher examples. Default 616 around the 2006 Civil War candidate, not MCU or 6160. Freeze a specific issue list before content authoring; dial another period as a separately identified snapshot.

| Part | Today / pointer | Proposed floor |
|---|---|---|
| MV.K2 | partial, E01/E03/E05 | Seven rules: powers have heterogeneous origins; a handbook entry can lag feats; public and secret identities differ; registration is era-specific; magic/technology need their own operation rules; extraordinary revival needs a named route; neighborhood consequences persist until repaired. First three grounded by pilot; others INFERRED floor choices awaiting issue bindings. Default fixed local calendar, dial sliding time only with an explicit chronology policy. |
| MV.K3 | partial, E03 is rating evidence only | Device/repair core: battery, parts, condition and schematic knowledge. Learn apprenticeship; diagnose, insulate, shield and extract. Separate optional mutant/magic faculty. Six-stat handbook lens is dated assessment, never a spendable growth bar. Default civilian engineering; dial known-source tech availability. |
| MV.K4 | partial, E01 civilian jobs | Ordinary newspaper assistant with camera loan; cleanup contractor with PPE and supplier debt; emerging mutate with a checked local profile and clinic follow-up. F1 starting means and knowledge. Dial school/office origin without automatically granting an accident power. |
| MV.K5 | partial, E01 NYC leads | Six places: apartment, newspaper desk, contractor depot, clinic, corner shop, transit stop. Route to borough worksite; hazard collateral/debris. Default commuting distance; dial event lockdown because geography affects work before cosmic access. |
| MV.K6 | partial, E01 mantle/job catalog | Peter Parker, Matt Murdock, Luke Cage as MEMORY street contacts with photo, legal and protection verbs; authored editor and depot supervisor are memory pair; authored displaced tenant is arc contact. Availability must fit the issue snapshot. |
| MV.K7 | partial, E01/E16 | Cleanup contractor joinable, local press, Avengers/X-Men as distant team structures, registration enforcement as era candidate. Owe a safe-site duty; anger an agency by mishandling evidence. Default street contracts; dial team access through sponsorship. |
| MV.K8 | partial, E01 jobs/E16 cleanup | USD; photo assignment, repair, cleanup. Prototype meal $8, shared bed $25/night, worksite permit $15; weekday shifts/edition deadlines. Default private contracts; dial insurance/municipal reimbursement only as authored policy, not assumed canon. |
| MV.K10 | partial, E01 power families | Threats: armed gang, unstable device, powered enforcer, collapsing building. Grammar: matchup and objective, hostage rescue, cover, restraint and extraction. F7 includes bills and identity exposure. Cosmic force is not a routine random street encounter. |
| MV.K12 | partial, E05 event list | MEMORY/issue-binding candidates: Stamford incident, registration enforcement, street arrests/team split in Civil War 2006. E16 confirms a later Civil War II tie-in, not these phases. Quest: preserve a civilian claim/evidence trail. Abstain: law and route access change, cleanup demand rises. |
| MV.K13 | partial, E01 M6/M9 | Take a job → gather witnessed evidence → prepare a counter/tool → rescue/contain → bill/repair → protect civilian relationships. Default neighborhood scale; dial team/cosmic commissions by credible invitation and transport. |
| MV.K14 | missing, E16 is presentation reference | Newsprint cream/red-blue, wry work log; reveal dated handbook and civilian obligations side by side. Default neutral narrator; dial She-Hulk-style address only for the appropriate character/series. |

| Subtle row | More to consider, default + dial + reason |
|---|---|
| MV.S1, CWS4 | Photo timestamps may connect two personas. Default source-specific suspicion; dial newspaper investigation budget. |
| MV.S2, CWS5 | A saved shop still loses business during repairs. Default distinct rescue/financial receipts; dial contractor turnaround through actual funds and labor. |
| MV.S3, CL5 | Old handbook card disagrees with a recent feat. Default show both dated claims; dial revised entry after a publisher/source update, not player preference. |

## W16.DC: DC main line, New Earth Gotham during Knightfall

Evidence: E15 bounds main-line era; E04/E05 broader cores are not automatically part of this slice. Default Gotham New Earth 1993-era publication snapshot, not TV, DCEU or Absolute line. Dial a main-line era via a new source manifest rather than merging all ring/Flash rules.

| Part | Today / pointer | Proposed floor |
|---|---|---|
| DC.K2 | partial, E15/E04/E05 | Seven floor rules: trained human work remains relevant; exhaustion has consequences; office and holder can diverge; equipment needs custody/maintenance; identity knowledge is observer-specific; each external power has era-specific laws; return from death is a named exception. Exhaustion/succession grounded by E15; rest INFERRED. Default no universal threat rank and no automatic ring recharge policy from another era. |
| DC.K3 | partial, E04 broader ring fragment | Detective/rescue core: fatigue, tools, evidence quality and practiced methods. Learn field supervision; observe, corroborate, restrain and extract. Display case competence/department standing. Optional ring/magic core deferred to its own era ledger; trained skill does not equal invulnerability. |
| DC.K4 | partial, E02 ordinary-role examples | Ordinary municipal repairer with kit and rent duty; precinct records trainee with clearance and confidentiality duty; neighborhood vigilante with limited tools and a prior injury. F1 knowledge; dial trusted mentor access through history, not automatic Bat-family admission. |
| DC.K5 | partial, E15 Gotham | Six places: rented room, precinct reception, clinic, transit stop, repair yard, neighborhood shelter. Route to Arkham perimeter; hazard escaped criminals/blocked roads. Default street map; dial cave/tower access only with a sponsor. |
| DC.K6 | partial, E15 Batman/Bane/Gordon | Gordon: file a report; Batman: pass actionable evidence; Bane: observe threat logistics; authored dispatcher and repairer are memory pair; shelter coordinator is arc contact for a lasting evacuation plan. Canon people can refuse or be unavailable. |
| DC.K7 | partial, E15/E05 | GCPD employment, shelter network, Bat-family as gated roster, Arkham as custody institution. Owe confidentiality/duty; anger police by tainting evidence. Default civil service path; dial vigilante cooperation by witness trust. |
| DC.K8 | missing, E15 has no price floor | USD; dispatch, repair, delivery. Prototype meal $5, shared bed $15/night, first-aid restock $10, explicitly tuning rather than researched 1993 prices. Weekday shifts/emergency callouts. Default paid civic work; dial corruption pressure through a named official. |
| DC.K10 | partial, E15 exhaustion plot | Threats: escaped specialist, gang ambush, endurance campaign, unsafe rescue site. Grammar: counter preparation and attrition, information/hostage objectives. F7 includes clinic, lost duty and damaged kit. Default human recovery; dial powered exceptions by actor profile. |
| DC.K12 | partial, E15 collection descriptions | Source-backed broad phases: prelude threats/Bane preparation, exhaustion and confrontation, successor's changed methods. Publisher blurbs ground these phases but exact pages/dates remain open. Quest: establish safe shelter routes. Abstain: deployments change and exhausted protection leaves gaps. |
| DC.K13 | missing, E15 | Collect reports → corroborate pattern → prepare specific counter → coordinate safe intervention → preserve evidence → restore community trust. Default case/service loop; dial mantle aspiration through training and sponsor politics. |
| DC.K14 | missing, E15 | Charcoal with municipal amber, concise incident voice; reveal case board plus witness-scoped identity links. Default readable report labels; dial noir captions without making darkness hide routine actions. |

| Subtle row | More to consider, default + dial + reason |
|---|---|
| DC.S1, CW12 | Same mantle, different restraint practice. Default witnesses disagree about the person behind it; dial institutions' willingness to separate office from holder. |
| DC.S2, CWS3 | An unrepaired gauntlet changes safe technique selection. Default persistent kit wear; dial workshop capacity under citywide pressure. |
| DC.S3, CL12 | A voice/limp clue raises a hypothesis, not an identity fact. Default evidence threshold; dial trained detective inference while retaining alternative explanations. |

## W16.IN: Invincible, original comic early Earth

Evidence: E11 publisher access; E02 T1 continuity warning. Default comic #1-13 opening window, with later #1-144 horizon a candidate boundary. No TV-exclusive feats, episode timing or universal counter list. Detailed lore below remains MEMORY until issue pages are bound.

| Part | Today / pointer | Proposed floor |
|---|---|---|
| IN.K2 | partial, E02/E11 | Six candidate rules: physiology matters; equipment grants separate means; powerful bodies still have specific vulnerabilities; recovery consumes time/care; institutions control intelligence access; cosmic travel requires actual transport. INFERRED from E02's unchecked leads. Default no auto-revival and no guaranteed counter effectiveness; dial a named matchup supported by a comic scene. |
| IN.K3 | partial, E02 counter-collector proposal | Counter-testing core: parts, calibration, lab time and reliability. Learn supervised maintenance; sample, simulate, shield and deploy. Optional trained body or suit core uses its own stamina/charge/repair profile. Display test confidence, no invented universal Viltrumite numerical cap. |
| IN.K4 | partial, E02 paths | Ordinary medical logistics worker with cooler/cart and shift duty; suit-maintenance apprentice with tools and equipment bond; new powered adult with one checked faculty and collateral obligation. F1 knowledge, no guaranteed empire knowledge. Dial institution entry after vetting. |
| IN.K5 | missing, E11 | Six places: rented room, campus/job desk, clinic, parts shop, repair hangar, public transport hub. Route to authorized test range; hazard falling debris. Exact comic city names/access need verification. |
| IN.K6 | partial, E02 lead cast | Mark, Debbie and Cecil as MEMORY candidates with rescue report, household help and clearance verbs; authored medic and technician are memory pair; displaced shopkeeper is arc contact for a paid rebuild. Canon access/locations depend on issue binding. |
| IN.K7 | partial, E02 agency lead | GDA, Guardians and local medical services as candidates. Join support staff, owe secrecy/custody, anger agency through unapproved field trials. Default ordinary contractor; dial specialist clearance after verified service. |
| IN.K8 | missing, E11 | USD; hospital supply, suit repair, courier. Prototype meal $7, shared bed $20/night, parts pack $25; shifts/school calendar. Default civilian wages; dial agency subsidy and rationing by contract, not unlimited free weapons. |
| IN.K10 | partial, E02 vulnerability lead | Threats: brute with reach, fast airborne attacker, device failure, collateral casualty. Grammar: momentum, interception, shelter, timed extraction and credible tested counter. F7 care/repair cannot erase casualty costs. Dial cosmic fronts separately from the first hub. |
| IN.K12 | partial, E02 T1 natural-course MEMORY | Candidates: first emergence/early patrol, Guardians crisis, family confrontation from early comic run. These await issue verification; no TV ordering adopted. Quest: secure reliable emergency supplies. Abstain: canon crises proceed and medical demand changes. |
| IN.K13 | partial, E02 counter-collector | Collect evidence → obtain candidate counter → test safely → earn clearance → deploy for a bounded objective → record limits → repair. Default rescue window, dial anti-cape role by institution and stakes. |
| IN.K14 | missing, E11 | Bright clear primary colors with quiet hospital gray; matter-of-fact incident voice; reveal vulnerability-test ledger. Default consequences in text; dial graphic intensity as presentation, independent of injury state. |

| Subtle row | More to consider, default + dial + reason |
|---|---|
| IN.S1, CWS5 | A cleared impact zone has a delayed clinic queue. Default timed causal receipt; dial aid supply and triage priorities. |
| IN.S2, CL11 | A "counter" label shows source, test target and uncertainty. Default anecdote remains anecdote; dial confidence after repeated relevant tests. |
| IN.S3, CWS1 | Flight montage advances travel, not free healing or production. Default distinct elapsed work/care; dial off-panel activity with a real plan. |

## W16.BO: The Boys, original comic opening run

Evidence: E12 publisher descriptions and E02 T20. Default original comic Name of the Game/Get Some period; exclude Amazon, Gen V and temporary-V rules from television. Drug mechanics and particular characters remain MEMORY candidates until issue binding.

| Part | Today / pointer | Proposed floor |
|---|---|---|
| BO.K2 | partial, E12/E02 | Six candidate rules: hero work is commodified; publicity can conflict with incident truth; Compound V acquisition is not training; dossiers need witnesses; powered people differ in vulnerability; corporate/employer control is practical rather than immunity to law. First and drug claim are E02 unchecked leads; E12 grounds policing/undercover work. Default mundane evidence economy; dial enhancement only with comic dose/aftereffect evidence. |
| BO.K3 | missing, E12 | Investigation core: leads, cover integrity, equipment, contacts. Learn supervised surveillance; tail, record, corroborate and extract. Optional drug-enhancement core has dose/source/body aftermath, not TV Temp V. Display dossier credibility and employer standing. |
| BO.K4 | partial, E02 ordinary role | Ordinary claims-office temp with records duty; press runner with recorder and editor debt; supervised investigator with cover budget and reporting obligation. F1 means/knowledge. Dial enhanced start only with a verified personal history; ordinary worker is not automatically safe in a direct supe fight. |
| BO.K5 | missing, E12 | Six places: lodging, claims office, press desk, diner, surveillance room, public corporate reception. Route to event venue; hazard compromised cover. Default workday access; dial private compounds through actual credentials. |
| BO.K6 | partial, E12 Hughie | Hughie, Butcher and Starlight as MEMORY contacts for compare leads, assign surveillance and discuss testimony; authored editor and claims worker are memory pair; injured worker is arc contact around compensation/exposure. Local additions clearly authored. |
| BO.K7 | partial, E12 junior-team lead | Vought and Seven as MEMORY organization candidates; investigative employer and press as joinable floor. Owe reporting, anger corporation by releasing supported allegations. Default ordinary employment; dial clandestine sponsorship via contract. |
| BO.K8 | missing, E12 | USD; claims clerk, courier, evidence transcription. Prototype meal $6, shared bed $18/night, recorder hire $8/day; work shifts and promotional calendar. Default income supports cover; dial paid settlement or withheld pay with a named cause. |
| BO.K10 | partial, E12 policing premise | Threats: corporate security, powered intimidation, cover exposure, evidence sabotage. Grammar: leverage, preparation and withdrawal; direct violence is dangerous rather than an obligatory ladder. F7 recovery also addresses identity/records custody and employment loss. |
| BO.K12 | partial, E12 | Candidates: Hughie's entry/first assignment (opening collection lead), public-team scrutiny, G-Wiz undercover case (#24 description directly STATED, later phase). Quest: preserve an incident dossier through employer pressure. Abstain: investigation proceeds elsewhere and public narrative hardens. Dates and opening-to-#24 transition remain open. |
| BO.K13 | missing, E12 | Gather incident → protect witness → establish evidence chain → choose private/public leverage → face institutional response → sustain cover and livelihood. Default evidence-first; dial action intensity by verified means and risk. |
| BO.K14 | missing, E12 | Corporate gloss against plain dossier paper, dry witness-report voice; reveal claim/source/PR narrative comparison. Default explicit speaker attribution; dial satire intensity without trivializing civilian testimony. |

| Subtle row | More to consider, default + dial + reason |
|---|---|
| BO.S1, CWS7 | A sponsored ranking changes after a press cycle, while the incident file stays unchanged. Default two receipts; dial campaign budget and reach. |
| BO.S2, CWS4 | A changed badge disables one job route without deleting the actor's skills. Default institution/persona access; dial cover quality from actual documents. |
| BO.S3, CL4 | A thought-caption cheat is an explicit import, not ordinary interrogation. Default observed subtext; dial genuine mind access with cost and countermeasures. |

## W16.OP: One Punch Man, manga early Association period

Evidence: E10; E02 lists this as a later-check title, not verified census. Default VIZ manga version, not a blend of webcomic/redraw/anime. Dial later manga version with a revision manifest because redraws can change event details.

| Part | Today / pointer | Proposed floor |
|---|---|---|
| OP.K2 | partial, E10 | Six rules/proposals: Saitama is exceptional (STATED premise); his training outcome is not a universal recipe; association credit differs from combat ability; monsters have case-specific means; civilian evacuation remains useful; body/tech maintenance constrains ordinary heroes. Last five are INFERRED or MEMORY leads. Default no player automatic one-punch growth; dial exceptional body via a separately grounded start. |
| OP.K3 | partial, E10 training/Association | Rescue/cyborg-support core: stamina or battery, equipment condition and practice. Learn supervised fitness/maintenance; intercept, brace, signal and evacuate. C-B-A-S is a MEMORY career ladder candidate, not verified physical power tiers here. Separate ranking, feat and threat fields. |
| OP.K4 | missing, E10 | Ordinary evacuation marshal with radio and shift duty; repair apprentice with diagnostic tools and supplier debt; low-ranked hero applicant with training gear and attendance/credit obligation. F1 means. Dial Association enrollment after checking exam and upkeep rules. |
| OP.K5 | missing, E10 | Six places: apartment, grocery, clinic, workshop, Association desk, shelter. Route to damaged district; hazard sudden monster attack. City-letter/map bindings still required. Default commuter scale; dial travel when roads close. |
| OP.K6 | partial, E10 Saitama/Genos | Saitama: mundane errand; Genos: compare maintenance data; Mumen Rider as MEMORY rescue contact; authored mechanic and dispatcher are memory pair; shelter resident is arc contact for a sustained safety plan. Extraordinary fights do not erase ordinary contacts. |
| OP.K7 | partial, E10 | Hero Association, local emergency service and repair contractors. Join service work, owe dispatch, anger Association through an unsupported claim. Default civilian/service access; dial professional hero admission by tested record. |
| OP.K8 | missing, E10 | Yen as proposal requiring setting-page confirmation; delivery, repair, dispatch. Prototype meal ¥500, bed ¥1500/night, parts ¥1000; weekly job/dispatch cycle and shopping hours. Default useful ordinary wages; dial hero subsidy by rank, not raw damage. |
| OP.K10 | partial, E10 exceptional combat | Threats: small monster, armored monster, collapsing structure, misleading threat report. Grammar: asymmetry, rescue and arrival time. A strong ally can defeat the monster but fail to save property if late. F7 recovery for ordinary bodies; dial comic impact presentation separately. |
| OP.K12 | partial, E10 Vol. 3 lead | MEMORY candidates: Association entry, meteor crisis, sea-monster crisis from early manga. Candidate locator window begins with Vol. 3, later volumes need reading. Quest: make an evacuation route reliable. Abstain: battles resolve without credit and civilian damage remains. |
| OP.K13 | missing, E10 | Receive imperfect dispatch → check risk → prepare route/gear → rescue or contain → submit evidence → receive mismatched credit → maintain livelihood. Default service loop; dial rank ambition because recognition is a different reward from power. |
| OP.K14 | missing, E10 | Clean ink with calm grocery-green accents; deadpan routine log; reveal dispatch/credit/actual-result comparison. Default plain receipts; dial dramatic SFX for witnessed action only. |

| Subtle row | More to consider, default + dial + reason |
|---|---|
| OP.S1, CWS7 | The hero who signed the report gets credit while a helper's route saved people. Default separate witness/office records; dial reassessment when corroboration arrives. |
| OP.S2, CWS1 | A "meanwhile" grocery task still costs travel time during dispatch. Default actual travel; dial queued errands with interruption conditions. |
| OP.S3, CL5 | A file's high rank cannot predict a specific matchup. Default contextual assessment; dial more evidence rather than a universal damage estimate. |

## W16.WM: Watchmen, original twelve-issue world

Evidence: E13 official collection establishes investigation and Cold War context; E02 T22 is an unchecked lead. Chosen extra tests evidence as the main verb. Default original comic only; 1985 dating, sparse superpowers and named events remain MEMORY pending pages, not movie evidence.

| Part | Today / pointer | Proposed floor |
|---|---|---|
| WM.K2 | partial, E13 | Six rules/proposals: masked networks have a history; legal pursuit matters; investigation can reveal a larger threat (STATED premise); most starts use ordinary means; one extraordinary body does not define a common growth ladder; dates/technology are snapshot-bound. Last three INFERRED from MEMORY leads. Default lasting consequences; dial later continuation only as a separate continuity. |
| WM.K3 | missing, E13 | Evidence core: leads, witness confidence, fatigue and record custody. Learn newspaper/forensic apprenticeship; interview, photograph, compare and corroborate. Display evidence confidence and trade standing. No generic superpower leveling; extraordinary physics needs its own source profile. |
| WM.K4 | missing, E13 | Ordinary newsstand assistant with stock duty; forensic clerk with camera/log kit and custody obligation; retired masked neighborhood helper with mundane gear and old social debt. F1 knowledge. Dial prior reputation independently from physical competence. |
| WM.K5 | missing, E13 | Six places: room, newsstand, diner, press office, precinct desk, clinic. Route to an interview site; hazard surveillance/street violence. Default period workday; dial access through sources and transport, not smartphones. |
| WM.K6 | partial, E13 Rorschach/former team | Rorschach: exchange a lead; Dan: request technical help; Laurie: compare recollection, latter two MEMORY; authored editor and diner owner are memory pair; missing worker's relative is arc contact for evidence/closure. Do not expose any altered mystery truth here. |
| WM.K7 | partial, E13 | Local press and police as joinable/angered institutions; former masked network as fragmented contacts. Owe chain of custody, anger authority through tampering. Default civic route; dial vigilante collaboration via personal trust. |
| WM.K8 | missing, E13 | USD; newsstand shift, photo work, archive search. Prototype meal $4, bed $12/night, film roll $5, tuning not researched 1985 prices; edition deadlines and weekly shifts. Default ordinary income; dial information purchase by specific source. |
| WM.K10 | partial, E13 legal pursuit | Threats: street assailant, armed pursuer, evidence loss, escalating public crisis. Grammar: vulnerable bodies, scarce tools, interviewing and escape. F7 cannot repair lost evidence automatically. Cosmic confrontation is not a fair damage-level encounter. |
| WM.K12 | partial, E13 broad plot | MEMORY candidates: opening death investigation, Manhattan's public rupture/departure, approaching final convergence. Original issues #1, #4 and #11-12 are reading leads, not checked page locators here. Quest: corroborate a missing person's trail. Abstain: public pressure/records access change, independent investigators proceed. |
| WM.K13 | missing, E13 | Hear rumor → preserve source → compare accounts → follow physical trail → decide whom to tell → live with disclosure or silence. Default evidence and civilian stakes; dial foreknowledge via a distinct import that loses confidence under divergence. |
| WM.K14 | missing, E13 | Muted violet/yellow, dated investigative captions; reveal source chronology beside witness chronology. Default linear readable log; dial panel-grid framing, never making nonlinear narration change the world's elapsed time. |

| Subtle row | More to consider, default + dial + reason |
|---|---|
| WM.S1, CWS6 | Repeated text motif remains a stylistic cue unless a real observation links it. Default optional callback; dial lens inference with provenance. |
| WM.S2, CL9 | The same newspaper page is remembered differently by two witnesses. Default retain both accounts; dial corroboration with the preserved edition. |
| WM.S3, CWS5 | A small shop's credit book survives as local history while public news moves on. Default persistent ordinary relationships; dial closure through actual repayment/help. |

## W16.HB: Hellboy/B.P.R.D., 1956 field cases

Evidence: E14 period collection and case synopsis; E02 T21. Chosen extra tests folklore investigation and a bureau career. Default 1956 collection, not films or the entire later apocalypse. Dial later B.P.R.D. era after a separate case/roster census.

| Part | Today / pointer | Proposed floor |
|---|---|---|
| HB.K2 | partial, E14 | Six rules/proposals: supernatural cases are real; bureau work faces institutional pressure; occult knowledge is uneven (premise STATED); folklore method must be case-specific; artifacts have custody; prophecy does not guarantee player obedience. Last three INFERRED, requiring case pages. Default unknown rituals fail safely or narrowly as authored, not universally; dial exact consequence once checked. |
| HB.K3 | missing, E14 | Occult fieldcraft core: case notes, tested materials, stamina and access. Learn supervised archive/field work; identify, ward, negotiate and contain. These verbs require specific case methods before binding. Display clearance and knowledge confidence; no shared spell mana invented for every entity. |
| HB.K4 | missing, E14 | Ordinary bureau driver with van/maintenance duty; archive assistant with notes and confidentiality obligation; new field agent with basic kit and supervisor commitment. F1 knowledge/means. Dial unusual body after an independently sourced profile, not generic demon powers. |
| HB.K5 | partial, E14 international travel | Six places: bureau dorm, archive, briefing room, garage, infirmary, local lodging/case office. Route to a named field site from the 1956 issues; hazard unreliable evidence/occult site access. Default case travel budget; dial international logistics and interpreters. |
| HB.K6 | partial, E14 Hellboy/agents | Hellboy: case consultation; Professor Bruttenholm and a period-appropriate named agent as MEMORY candidates; authored archivist and driver are memory pair; local caretaker is arc contact for investigation and lasting site care. Later cast requires era proof. |
| HB.K7 | partial, E14 bureau pressure | B.P.R.D. plus local authority and a rival occult organization as case candidates. Join support work, owe artifact custody, anger bureau by hiding evidence. Default field supervision; dial clearance with demonstrated reliable cases. |
| HB.K8 | missing, E14 | USD/per-diem with local conversion receipts; archive work, vehicle repair, translation. Prototype meal $2, bed $6/night, supply restock $8, tuning not historical price research; dated case/leave calendar. Default paid bureau living; dial private contracting when sponsorship is absent. |
| HB.K10 | partial, E14 occult cases | Threats: haunting, possessed site/object, hostile operative, unreliable ritual. Grammar: identify story/method, negotiate or contain, protect civilians, retreat from wrong diagnosis. F7 care includes decontamination and custody review, with specific ritual costs still open. |
| HB.K12 | partial, E14 1956 synopsis | Source-backed broad phases: pressure over recovered occult weapons, suspected cover-up/agent investigation, Mexico assignment. Exact pages/order need checking in #1-5 plus Ring of Death. Quest: preserve a local site's case evidence. Abstain: bureau assigns another crew, local risk persists and reports arrive indirectly. |
| HB.K13 | missing, E14 | Receive strange report → interview/translate → compare archive → test relevant tradition → confront/negotiate → return artifact/report → maintain site relationship. Default case-based rules; dial global arc connection only when evidence establishes it. |
| HB.K14 | missing, E14 | Ochre/black/field red, laconic case-note voice; reveal folklore claim versus tested-method notebook. Default source labels; dial gothic panels without hiding ordinary work and travel options. |

| Subtle row | More to consider, default + dial + reason |
|---|---|
| HB.S1, CWS6 | An interpreter's choice changes the ritual hypothesis, not automatically its actual mechanism. Default parallel translations; dial expert confidence after a case test. |
| HB.S2, CWS3 | A field coat smells of rain and carries a repaired tear from the last site. Default continuity mark; dial recognition by a witness who was there. |
| HB.S3, CL11 | Appraisal shows custody and reports, not the object's sealed truth. Default tested properties; dial stronger psychometry only through a grounded profile/discovery route. |

## W16.R: which comic-world candidate fits first

INFERRED ranking by **source access actually established here** and **tightness of a bounded local rule set**, not fame, whole-world completeness or a new product priority. Worm and Ward count separately. Publisher listings/blurbs rank below exact text and below actual page reading; finite length alone earns no rule-proof credit. No acquisition, purchase or implementation is selected.

| Rank | World | Access today | Rule fit for proposed slice | What changes the ranking |
|---|---|---|---|---|
| R1 | Worm | Local readable edition, exact locators, existing finite design; selected windows reread | Strong local means/limits and response rules, with institutional uncertainty retained | First choice within this list. Still needs a typed census and chosen commission bindings, not a whole-world simulation. |
| R2 | Ward | Official complete TOC and author introduction; chapters discoverable but not read here | Prior framework plus reconstruction pressures; sequel-specific rules unverified | A bounded Daybreak/team/case read is necessary. R2 is provisional and may fall behind MHA if chapter access fails. |
| R3 | My Hero Academia | Official VIZ premise and manga reading route; wiki digest blocked | Focused academy/body/gear/rescue loop; licensing details still need source pages | Actual early volume/exam reading, rather than inherited Quirk claims. |
| R4 | Watchmen | Official bounded collection/reading route; no pages acquired | Investigation core avoids a fabricated shared power ladder | Original issue-level chronology and ordinary-place/cast census. Would rise above R3 for a deliberately noncombat first slice. |
| R5 | Invincible | Official compendium/first-issue route; TV contamination explicitly documented | Finite comic and counter-support loop; physiology/counters not yet bound | First-issue and early-crisis pages plus actual counter tests from comic scenes. E02's earlier first-audit recommendation remains historical proposal, not an access fact. |
| R6 | Hellboy/B.P.R.D. | Official bounded 1956 collection and case descriptions | Case-specific folklore permits a small ruleset; no universal occult model | One complete case with methods, failed interpretations and period roster. |
| R7 | The Boys | Official comic catalog and undercover-case descriptions | Evidence/corporate pressure is coherent; drug/feats differ from television | Comic-only enhancement and first-case pages. Do not treat an ordinary start as a proven supe-killing build. |
| R8 | One Punch Man | Official VIZ premise and volume route | Ordinary rescue/credit loop is bounded; protagonist exception is deliberately unsuitable as a universal core | Fix manga/redraw version and verify ranks/events. Could rise for a rescue-first comedy slice. |
| R9 | DC main line | Pilot legacy/ring captures plus official Knightfall phase descriptions | Gotham detective slice is manageable; broader eras are not one rulebook | Selected main-line issue manifest and ordinary-life census. A frozen Gotham slice does not need a working multiverse hub. |
| R10 | Marvel 616 | Pilot handbook/taxonomy plus official character/tie-in blurbs | Strong assessment data, weak selected-event/local-law bindings today | Read chosen 616 issues and build civilian/event ledger. Grid availability does not make it an operating law. |

**R11 Decision boundary.** Worm is the clear first source audit/design candidate in this group. Ward's second place relies on cheap accessible author-hosted reading and is not equal to Worm's verified local access. MHA is the clearest alternative if the desired fantasy is public hero schooling. Invincible remains attractive, but the dated recommendation in E02 cannot substitute for unread comic rule evidence. None outranks standing HP/D&D/book/anime priorities without Weibao changing that order.

## W16.I: implications for root round 6

All rows are INFERRED considerations for the owning lanes. No source interfaces or runtime behavior were verified here.

| Code / root seam | Default + dial + in-world reason |
|---|---|
| I1, CL5/CLR1/AX6/AX15 | Native-scale display is an **assessment record**: assessor, observed persona, source date/version, dimensions, confidence and recommended response. Default dated evidence; dial confidential/current records through actual institutional access. This fits Worm, MHA career assessment and Marvel handbooks without calling them one ladder. |
| I2, CL13/CLR1/II29-II30 | Root calls every CL entry read-only, but retcon changes an event. Default CL13's lens only previews eligible history/receipts; the actual retcon is a separate authorized effect with causal aftermath and compatibility policy. Dial reversal scope/cost by named world tool. Thought reading and future-sense also require an existing power-generated observation channel, not invented omniscience. |
| I3, CLR2-CLR6/OV3 | Stronger lenses improve resolution within their accessible evidence, not correctness by decree. Default sealed-route limits apply at every strength; dial uncertain evidence and observer reaction. Combining two uncertain channels can still be wrong. A caption can be narration, testimony or a reading of subtext; label which. |
| I4, AX17/II28 | One actor has shared underlying body/history plus observer-specific persona links. Default employer knows civilian work, team knows codename, and neither automatically knows the bridge. Dial linked identities after corroborated exposure. Actor standing and persona standing can both matter; a universal actor+persona key alone could split a debt or injury that actually follows the person. |
| I5, AX14/II27 | Freeze continuity manifest before overlays: series, issue/chapter window, fictional period, source revision and imported assumptions. Default build-time snapshot; dial runtime crossing only when that slice needs it. OPM redraw is a source revision, a reprint a publication artifact, a reboot a possible world event, and an AU an authored divergence. Do not treat them as interchangeable. |
| I6, AX3/II31/II35-II36 | Each card needs ordinary learned means plus optional innate/tool core. Default separate acquisition, operation, upkeep and assessment. Dial compound bodies/equipment with actual profiles. This gives W15 and core-foundations A1 concrete demand, but does not authorize W16 to modify their contracts. |
| I7, CWS1/II32/AX7/OV1 | Presentation reads elapsed travel/work and causal history. Default gutters omit depiction, not simulation. Dial montage pacing and recap length. Strict "each layer reads only the one below" is too coarse if a case panel must show a law or life action creates a story event; proposed seam is explicit read/effect contracts with no presentation-authored truth. |
| I8, CWS5/AX9/AX10/II34 | Event season has district scope, phase, cause and absence consequence. Default affected districts retain bills, closures and unmet care. Dial reach and repair funding. A tie-in can be one changed shift or bus route rather than every NPC joining a battle. |
| I9, CW6/II33 | World default establishes defeat policy, with actor/route/era exceptions and lasting causal receipts. Default no automatic revival; dial a checked recovery route. A world-wide permanence switch alone cannot model an exceptional revenant beside ordinary civilians. Category ratios are not revival RNG. |
| I10, CW12/AX4/AX10/AX17 | Mantle is an office with holders, authority, equipment custody and attached expectations. Default title may pass without body/faculty; dial succession by trial, appointment or bonding. A mantle is not merely a persona, and an impostor's claim can have standing without legitimate custody. |
| I11, CW15/AX1/AX7 | Separate publication age, in-world date, sliding chronology and modernization policy. Default fixed local dates; dial supported sliding age or updated technology. Source-era nouns must not silently replace a world's clock. |
| I12, OV5/OV8/K18 | Promote depth after actual attention to a bounded playable slice, while retaining the untouched source horizon. Default one ordinary paid job and meaningful local consequence before another setting; dial deep cast/event coverage after play. Future gate: chosen-source census, built desktop journey, Save/reload/import when applicable, then director acceptance. No runtime gate is passed by this file. |

## More to consider, other stuff

These extend rather than repeat root CWS1-CWS7/KX43-KX50. Each angle names a consequence that the existing broad rows do not yet spell out. All are INFERRED.

| New angle | Default + dial + reason |
|---|---|
| W16.X1 Franchise records are sampled populations | Default page counts inform research coverage only. Dial an authored rarity distribution separately, because notable-character catalogs, overlapping categories and alternate selves are not a population survey. Applies to origin, identity and resurrection ratios. |
| W16.X2 Correction without erasing evidence | Default a changed assessment leaves a dated old entry plus correction reason. Dial who receives the update through carrier/access rules. A false threat file can continue to affect an employer who never got the correction. |
| W16.X3 Publication gaps versus idle duration | Default a release hiatus, redraw or issue number does not advance world time. Dial only source-grounded elapsed time or a chosen montage. This prevents waiting between releases from aging actors or rerunning crises. |
| W16.X4 Civilian success beside canon defeat | Default receipts distinguish saved lives, protected evidence, paid work, hero victory and public credit. Dial institution weighting. A normal courier can succeed at medicine delivery while a nearby hero loses the fight. |
| W16.X5 Counter markets and fraud | Default every sold counter has provenance, tested scope and warranty/claim. Dial counterfeit prevalence through named supply chains. Collecting counters is an economy and evidence problem, not buying a universal weakness tag. |
| W16.X6 Biography versus paperwork | Default legal name, mantle, codename, corporate brand, costume and actor are separate linked facts. Dial jurisdiction-recognized documents. A person can keep wages or medical history after changing their brand without automatically revealing every identity. |
| W16.X7 Reimbursement as a delayed loop | Default disaster relief and claims require records, authorization and an actual payer. Dial delay, subsidy and disputes. "Collateral bill" gains playable work when someone gathers proof, negotiates responsibility and funds repairs. |
| W16.X8 Unequal access to power care | Default treatment/gear needs expertise, compatible tools and consent. Dial public provision, agency support or exclusion with explicit local reason. A clinic that can help one body may need a specialist for another; rarity is not the only barrier. |
| W16.X9 Contradictions have a jurisdiction | Default conflicting stories remain tied to issue/chapter/version and observer. Dial a selected interpretation or explicit AU. A handbook/feat conflict is not automatically an in-world retcon, and a publication correction does not silently rewrite the save. |

### Three ranked suggestions

1. **W16.A1:** Use Worm's existing ER02 finite commission as the first comic-group source-binding exercise. Bind one ordinary craft/support start, six local contacts and three crisis consequences to exact chapters before runtime scope is selected. Keep the broader standing world order intact.
2. **W16.A2:** Give W15 and the assessment/knowledge owners I1/I4/I6 as requirements: operative core, institutional assessment and persona exposure need different records. Check the same distinction against MHA and Marvel so a shared interface serves two actual cases.
3. **W16.A3:** Give the lens/overlay owners I2/I5/I7: separate retcon mutation from a read-only lens, freeze a source snapshot, and let captions read elapsed causes. If a slice is later authorized, prove a paid ordinary job, an observed consequence and a dated assessment at laptop width before expanding its multiverse.

