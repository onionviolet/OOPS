# Priority worlds: canon spines and easy AU variants (H lane, 2026-10-13)

Responding to Weibao (2026-10-13): "We can prioritize worlds like Harry potter and D&D and the book worlds for cannon and easy work for implementing parallel or alternative universe stuff and more?" plus his follow-up "AUs that would change relationships, starting points and more?". Recorded direction lives in `docs/USER_VISION.md#world-depth-and-canon-first-world-priority-2026-10-13`: order, not scope.

Everything below is a proposal. Nothing is accepted, implemented or verified by this file. Engine features belong to the G lane (`G_required_features.md`); this file owns the content side and names the engine seam each row leans on so "easy" stays grounded. Sizes: S = pack or content data on an existing seam; M = new content plus one small consumer; L = new engine owner or source work first. Acceptance cases are specified, not run.

Sealed secrets: none read or revealed here. Rows refer to proposed or existing IDs and routes only: HP-SEAL-1, DND-SEAL-1, MOL-SEAL-1 (proposed in `B_magic_academy.md`), W1-SRC-13 and W1-SRC-26 routes (book world 1), TT28 hooks (TTKS B1 volume-two hooks, B4 deleted-record route).

Shared vocabulary used below: TIMELINES T1 to T5 and branch starts B1 to B4 (`docs/TIMELINES_AND_DIVERGENCE.md`), What If cards W1 and change types W2 (`docs/TIME_KEEPERS_AND_VARIANTS.md`), MULTIVERSE "branching histories" (`docs/worlds/MULTIVERSE_STRUCTURES.md`), and F lane PW, ST rows.

## Where each world actually stands (grounding)

| World | Source held and read | Code in `src/` today | Verified state |
|---|---|---|---|
| Harry Potter | Seven novels held as prepared private TXT (mixed edition/OCR); targeted scenes read from every volume, not a full read; four Cursed Child snippets; companion pages H1 to H4 | Authoring profile `harry-potter` in `src/feature_expansion_book_roster.js` (Mara Fen, Elias Brook, Nessa Vale; `nativeWorldId: null`). Generic seams: `structured_pack_runtime.js`, timed jobs in `simulation.js`, native Alchemy | Profile implemented-unverified; no native HP instance |
| D&D | SRD 5.2.1 selected sections, SRD 5.1 crafting page, conversion guide, official Phandalin (S04) and Realms (S05) overviews. Adventure chapter unread (S07) | None world-specific. FIRST_SLICE E01 to E07 list the missing consumers (d20 resolver, object repair, profile state, pinning) | Decision-ready design only |
| A Soldier's Life (book world 1) | Supplied source privately qualified; 26 private cards W1-SRC-01..26; full-completion ledger 3,803 rows with all S00 to S14 gates open | Generic private pack loader (`src/content_packs.js`, `content_pack_ui.js`); private packs p01 to p08. p01 has a four-way premise field (canon, divergent, remix, swapped) that sets the storage method; p08 has 8 locations, 48 items, 12 people, 213 commands, 3 typed starts | First slice browser-verified 2026-10-09; p05 food route verified 2026-10-11; p08 partly verified, N2 to N5 unrun. Full-world goal paused 2026-10-12 |
| TTKS (B1 to B5) | All five read in full as of 2026-10-10 (B1 ch 1 to 110, B2 1 to 665, B3 members 1 to 429, B4 1 to 206, B5 members 1 to 668). All ongoing, so new chapters need a delta fetch | None | Research and deep dives only |
| Mother of Learning | 107/107 story items read and integrated (supplied WebToEpub edition) | Six `src/book_world_mol_*` leaves wired into `main.js` and `expansion_engine.js`; schema `motherOfLearning` 1; 9 native people, 7 locations, 1 quest; footprint carries `continuityId` and `eraId` | Implemented-unverified; native journeys deferred |

Two consequences for "easy": book world 1 and MOL already have running content, so their AUs are the cheapest in the set. HP, D&D and TTKS need a first canon slice before an AU has anything to reuse, so their first AU is chosen to reuse that slice almost whole.

---

## Harry Potter (`docs/worlds/harry-potter/`, craft packet `docs/gm/dispatch/harry-potter-craft-research-2026-10-12/`, private world audit)

### Canon spine

| Code | Canon era, events, places | Coverage we hold | Source gaps |
|---|---|---|---|
| PHP1 | **Summer 1991 to first year 1991-92** (audit T02/T03): letter, Diagon Alley shopping, the Express, Sorting, first-year classes, Hogsmeade later (general knowledge). The audit's D1 opening sits here. | H1 bounded publisher evidence; targeted scenes from book 1 including the beginner potions lesson (CCF03/04); O01 to O16 origin matrix and T01 to T10 era matrix privately | Exact supply list, prices, shop roster and dated cast per scene; full recipe for the beginner brew (F1 says the book gives none) |
| PHP2 | **School years 2 to 7** (1992 to 1998): yearly set pieces, House Cup, Quidditch, Triwizard year, Ministry pressure on the school (general knowledge, public twists). | Targeted scenes per volume for craft, Time-Turner (TT-C1 to 3) and Polyjuice (PJ-C1 to 3) | Year-by-year staff and timetable map; no whole-year read |
| PHP3 | **First war household, c. 1981** (T05) and **earlier intake, c. 1971** (T04). | Era rows only | Dated cast, Ministry personnel, medicine and teaching state; heavy invention needed |
| PHP4 | **Late war and aftermath, 1997 onward** (T06/T07) and **2017 epilogue continuation** (T08). | Era rows; epilogue as endpoint context | Who survives in a branch, housing, law and employment after the war |
| PHP5 | **Places usable first**: a small household, Diagon Alley shops and bank counter, a nursery/craft bench (original), the school's classroom, library and greenhouse. | WORLD_BRIEF six local contexts; roster profile people | Canonical shop interiors and staff need scene locators before a cameo |

### Easy AU and parallel variants

| Code | Divergence point | Content reused | New content (size) | Player notices first | Carries between canon and copy |
|---|---|---|---|---|---|
| PHP6 | **Relationship AU: the household is family to the canon cast.** Swap O02 unrelated child for O05 Dursley sibling, O07 distant Potter cousin or O11 ward at the same summer opening (W2 "add an outsider"). | The PHP1 summer slice whole: carrier repair, shopping help, guardian trust | New guardian actor and household ledger, one changed contact rule (S to M) | Who answers the door; whether a famous cousin is at the table | The player's learned procedures and owned items carry only if the start says so; guardian trust is per copy |
| PHP7 | **Relationship AU: mentor and rival swap.** Nessa Vale is a rival bench-holder instead of a teaching contact; Elias offers the apprenticeship instead (W2 "change a choice"). | Roster people, nursery stock, bench rental terms | Flipped relationship seeds and two lines of texture per person (S) | The first greeting's tone and who quotes a price | Nothing personal; the same people with different starting regard |
| PHP8 | **Different house.** Sorting lands in another house (B lane HP2 reads receipts). | PHP1 plus first-term school content once built | House-specific dorm, table, rivals and staff bias seeds (M) | Colors on the V6 frame and which older students greet you | Learned spells and grades carry; house points and housemate regard are per house |
| PHP9 | **Start-shift: adult apprentice at the same bench** (O13, audit O-ALT3). | Nursery, bench, Elias and Nessa, the paid job seams | Adult body snapshot, rent and wage terms (S to M) | No school gate; rent is due on day one | Same people, different age; no shared history with the child start |
| PHP10 | **Start-shift: earlier intake, c. 1971** (T04). | Household and nursery contexts, roster people as their younger selves or parents | Dated cast map and period prices (L, source-heavy) | Younger versions of known adults in corridors | Nothing by default; a carrier (B4) would be a priced power |
| PHP11 | **Survivor or absent character.** One canon person lives or is never present (W2 "remove someone"), chosen per run from a short authored list. | Whatever slice is built; BT12 per-event status (expected, prevented, altered) | Event-status rows for the touched events (M) | A name on a staff list or a missing face at a feast | Notebook entries carry with a copy tag (F lane PW7) |
| PHP12 | **Sealed HP-SEAL-1.** A rerolled truth about how one core magical object chooses or passes loyalty. | Wandmaker or research route content | Sealed data in the private pack (M) | Nothing until the research route resolves it | Discovery stays in that copy |

### First canon slice and first AU slice

**Canon: PHP1 "summer 1991 supply week"**, the audit's D1 situation. A household with one damaged study carrier and limited funds: repair it under supervision, borrow or buy a used one, or defer and study. It is cheap because it needs no new magic system: household stock, custody, paid jobs and guardian trust run on existing claim/job/custody owners plus `structured_pack_runtime.js` typed selection (audit E02). The beginner potion (P1) stays the second slice because it needs the new staged-craft owner (`expansion.craftWork`).

Acceptance (specified, not run): PHP-A1 fresh origin selects the start once and the snapshot survives save, reload and import without reroll. PHP-A2 each of repair, used carrier and defer leaves a different custody and obligation record. PHP-A3 the carrier holds actual study supplies and a later action reads it. PHP-A4 the guardian's willingness changes only from actions she witnessed. PHP-A5 a missing or revised private pack suspends safely and restores without reroll. PHP-A6 no future plot fact appears in UI text.

**AU: PHP6 cousin/ward household.** Same slice, one changed relationship row. Cheap because every job and item is reused; only the guardian actor and one contact rule change.

Acceptance: PHP-A7 the AU start is a separate instance (T1/T4) and does not edit a canon save. PHP-A8 the same repair job settles once with the new guardian as owner. PHP-A9 the famous relative's presence or absence follows the start contract, not surname alone (H2). PHP-A10 notebook facts learned in the AU show a copy tag in the canon run.

---

## D&D / Forgotten Realms (`docs/worlds/dnd/`)

### Canon spine

| Code | Canon era, events, places | Coverage we hold | Source gaps |
|---|---|---|---|
| PDD1 | **Phandalin after its rebuilding**: mining town with inn, equipment sellers, farm, shrine and trading exchange (S04). | S04 overview inspected; FIRST_SLICE ST1 to ST3 and PS01 to PS06 | Exact DR year, prices, canonical NPC biographies; adventure chapter (S07) unread |
| PDD2 | **The Sword Coast and wider Faerûn** as the regional horizon (S05). | S05 overview only | Gazetteer, routes, distances, regional law |
| PDD3 | **Rules profiles as era-independent dials**: O1 SRD 5.2.1 default, O2 SRD 5.1, O3 to O5 older editions (SOURCE_CONTRACT). | O1 selected sections (C01 to C07); O2 crafting page (C08) | O1 class, background and spell lists for the three starts; O3 to O5 uninspected |
| PDD4 | **Historical eras** such as the Spellplague around 1385 DR and later eras (general knowledge). | None in repo | Setting books for any era before a start uses it |
| PDD5 | **Planes and sibling settings** (Shadowfell, Feywild, Sigil, Greyhawk, Eberron; general knowledge). | None | Cosmology and planar access rules (DDC12 U) |

### Easy AU and parallel variants

| Code | Divergence point | Content reused | New content (size) | Player notices first | Carries between canon and copy |
|---|---|---|---|---|---|
| PDD6 | **Rules-profile swap.** Same town, people and torn bag, run under O2 SRD 5.1 instead of O1 (W2 "change a rule"). | PDD1 slice whole | Profile data for crafting pace (C08 versus C02) and the start package (S once E04/E07 profile pinning exists) | The repair and crafting quotes read differently | Nothing crosses by default; a traveler needs an explicit profile conversion (SOURCE_CONTRACT) |
| PDD7 | **Relationship AU: the client is kin.** The carrier who needs the bag is your sibling, parent or old party mate (W2 "add an outsider"). | PS01 to PS06 job chain | Relation seed, a softer refusal outcome, one family obligation (S) | The client greets you by name before you ask | Relationship is per copy; the job terms reuse the same receipt shape |
| PDD8 | **Relationship AU: rival shrine.** The shrine priest sees you as a competitor for patrons rather than a helper (W2 "change a choice"). | ST3 shrine-helper start and its service-for-board offer | Flipped regard, a lost board option, one rival service event (S to M) | Board is offered elsewhere; the priest counts your patients | Your spells and kit carry; standing with the shrine does not |
| PDD9 | **Start-shift: start as the client.** Play the carrier who owns the torn bag and needs someone to fix it (ST2 in reverse). | Same job, same bag, same town | A client-side start snapshot and hiring choices (S to M) | You are the one quoting a fee | Same people, opposite side of the deal |
| PDD10 | **Start-shift: town before the rebuilding.** Earlier ruin-era start (T2 "before" snapshot). | Town map and shrine as places | Ruin-era people and economy, an event schedule (L, source-gated by S07) | Empty lots where the inn should be | A carrier would be needed for later knowledge |
| PDD11 | **Shadowfell echo of Phandalin.** Same places, other people, a despair dial (B lane DDC22). | Map and site list | Echo cast and mood dial (M to L) | Gloomy palette (V6) and familiar streets with strangers | Items carry and may wither (dial) |
| PDD12 | **Sealed DND-SEAL-1.** The first slice's hidden scenario truth rerolled per instance. | Rumor, investigation and route content | Sealed scenario data (M) | Nothing until the rumor route resolves it | Per copy |

### First canon slice and first AU slice

**Canon: PDD1 "torn bag in Phandalin"**, PS01 to PS04 plus PS06, with the PS05 d20 hazard held for the second unit. It is the cheapest canon D&D because Mending (C06), mundane repair and paid help are three routes on one object and need E01 jobs, E03 object repair and E04 profile state, but not the E02 resolver or E06 tactical combat. Start with one start (ST2 itinerant student) as the technical proof, as FIRST_SLICE allows.

Acceptance: PDD-A1 inspect reveals tear size and owner, not motive. PDD-A2 Mending works on a compatible tear, rejects an oversized break and an inaccessible target. PDD-A3 paid help and needle-and-thread routes stay useful without magic. PDD-A4 the repaired bag changes PS04 carrying capacity. PDD-A5 settlement happens once across save, reload and import at agreement, mid-repair and completion. PDD-A6 instance pins `rulesProfileId` and revision.

**AU: PDD6 rules-profile swap.** Cheap because content is reused whole and the only new data is profile tables; it also proves the profile pin the whole D&D family needs.

Acceptance: PDD-A7 the O2 instance is separate and shows its own crafting quote. PDD-A8 an O1 save never picks up O2 numbers on load. PDD-A9 Mending behaves identically where both profiles agree, and the UI states which profile is active.

---

## A Soldier's Life, book world 1 (private pack; owners `docs/gm/dispatch/soldiers-life-world-2026-10-09/`, `world1-expansion-2026-10-11/`, `world1-full-completion-2026-10-11/`)

Public-safe: no source names, characters or places below.

### Canon spine

| Code | Canon era, events, places | Coverage we hold | Source gaps |
|---|---|---|---|
| PSL1 | **Enlistment and the first posting**: kit issue, drill, supply duty, local pay, storage methods (first slice). | Source-qualified in private cards; playable in p01 and later packs | Director acceptance A1; A2 unverified branches |
| PSL2 | **Garrison life**: provisioning, cook handover, meals, repeat orders (p05), care, routes, gathering, trade and return (p08). | 40 more chapters privately qualified; 214 semantic contexts | N2 to N5 native gates unrun |
| PSL3 | **The company's deployment calendar and first campaign** (W1-SRC cards; later horizons tied to the W1-SRC-26 route). | Private cards and ledger | Campaign events, injury, command, larger ranks (A3/A4) |
| PSL4 | **Places usable first**: the 8 p08 locations and the Village departure door. | p08 data | Wider regions and eras in REMAINING_MANIFEST |

### Easy AU and parallel variants

| Code | Divergence point | Content reused | New content (size) | Player notices first | Carries between canon and copy |
|---|---|---|---|---|---|
| PSL5 | **Relationship AU: a colleague is family.** One of the three first-slice colleagues is the player's sibling or cousin (W2 "add an outsider"). | p08 people, witnessed-memory receipts, duty chain | Relation seed plus a family letter beat; start set as a premise field (S, pack data) | The colleague uses your first name at muster | Learned drill and ledger skill carry if the start says so; regard is per copy |
| PSL6 | **Relationship AU: mentor becomes rival.** The colleague who teaches storage handling instead competes for the same post (W2 "change a choice"). | Same people and the lesson commands | Flipped regard values, one rivalry consequence on a later duty (S) | Lessons cost a favor instead of being offered | Nothing personal |
| PSL7 | **Relationship AU: the enemy recruit.** A recruit from the other side is posted to your squad (W2 "add an outsider"). | Squad roster, mess, duty | One new person and suspicion texture (M) | A stranger at the mess bench others avoid | Per copy |
| PSL8 | **Start-shift: the company cook** (D lane SL16). | p05 provisioning, cook handover, meals | A cook start snapshot from the existing cook role (S to M) | You start in the kitchen with the ledger's food side | Same people seen from the kitchen |
| PSL9 | **Start-shift: the supplier** (SL19) who bids on the company's contracts. | Supplier stock and the kit ledger | Supplier start and bid choices (M) | Quartermasters are customers | Same stock, opposite custody |
| PSL10 | **Peacetime posting** (SL22): no campaign; roads, gates and refugees. | Garrison content | Calendar with no deployments, a gate duty (M) | The deployment board is empty | Skills and kit carry |
| PSL11 | **Premise swap carried forward**: p01's four premises (canon, divergent, remix, swapped) re-exposed on current content as a start dial. | p01 premise field pattern, current p08 units | Premise rows in a fresh-campaign successor pack (S) | The storage method you start with | Per the p05 rule, existing saves keep their exact pack |
| PSL12 | **Rerolled crossing history.** Sealed; existence and route only: W1-SRC-26's discovery route. | Whatever slice is current | Sealed private data (M) | Nothing until that route is walked | Per copy |

### First canon slice and first AU slice

Gate note: the full-world goal is paused (PAUSED_HANDOFF, 2026-10-12) pending foundation reconciliation. Default reading: the 2026-10-13 priority puts this world first in order; implementation writes still follow the handoff's resume steps.

**Canon: PSL1 morning muster** (D lane SL1). The existing colleagues plus two names answer roll; one is missing; the player can report, cover or look. Cheap because it is a new fresh-campaign successor pack revision on the generic loader with existing people, locations, `requires`/`visibleWhen` field conditions and witnessed memory.

Acceptance: PSL-A1 one muster per local day on the native clock. PSL-A2 report, cover and look each write a different witnessed memory. PSL-A3 a covered absence surfaces on a later duty. PSL-A4 prior pack saves load their exact content with no new actors (p05 rule). PSL-A5 absent or removed pack leaves progress dormant and restores without replayed wages. PSL-A6 privacy check finds no source names in tracked files.

**AU: PSL5 colleague-is-family.** Same pack revision, one premise field that sets a relation seed. Cheapest relationship AU in the set because the seam already exists in p01's premise activity.

Acceptance: PSL-A7 the premise is chosen once at start and survives reload and import. PSL-A8 the sibling's muster absence produces a family consequence the canon start lacks. PSL-A9 the canon start never shows the relation. PSL-A10 no sealed W1-SRC route text appears in either start.

---

## TTKS, five books (`docs/LIFE_SIM_NORTH_STAR.md#ttks-five-book-findings-2026-10-10`, private deep dives)

### Canon spine

| Code | Canon era, events, places | Coverage we hold | Source gaps |
|---|---|---|---|
| PTT1 | **B1: magical London, 2010.** Mimics, seven veins and routes, anchors, the wizard market. | Full read ch 1 to 110; volume 2 just started | Volume 2 onward; TT28 hooks sealed |
| PTT2 | **B2: a yearly draw from childhood; the simulator at eighteen.** | Full read 1 to 665 | Ongoing; late realms |
| PTT3 | **B3: the JJK fan world challenge board**, then later segments in other worlds. | Full read members 1 to 429 | Ongoing; later segment rules |
| PTT4 | **B4: the far future after humanity**, purity bands, ruins, the estate AI. | Full read 1 to 206 | Ongoing; extinction cause sealed under TT28 |
| PTT5 | **B5: the border gate town**, daily applicants, the collector, the power bill. | Full read members 1 to 668 | Ongoing |

### Easy AU and parallel variants

Most reuse the B5 gate and B1 anchor-hunt slices (deep dive section 8), since those are the smallest first slices.

| Code | Divergence point | Content reused | New content (size) | Player notices first | Carries between canon and copy |
|---|---|---|---|---|---|
| PTT6 | **Relationship AU: supervisor flip (B5).** The gate supervisor is your ally instead of the reviewer who docks you (W2 "change a choice"). | B5 gate day, applicants, tools | Flipped regard and a softer liability rule (S) | The end-of-shift review reads as advice | Skills carry; standing is per copy |
| PTT7 | **Relationship AU: the detective is a friend (B1).** The investigator who keeps calling is an old friend of the replaced person. | B1 anchor hunt, three NPCs | Friend relation and a harder habit test (S to M) | Calls come with warmth, so lies cost more | Per copy |
| PTT8 | **Relationship AU: the simulated friend remembers (B2, TT5 inverted).** One companion recognizes you from a simulation. | B2 draw and one-forecast slice | One memory-leak rule for one person (M) | A stranger knows your favorite food | What that one person remembers, nothing else |
| PTT9 | **Start-shift: the refused applicant (B5, TT23).** | Gate, applicant roster, town roster (TT15) | Outside-wall start and a re-application route (M) | You queue at the desk you would have run | Same gate and people, opposite side |
| PTT10 | **Start-shift: the person about to be replaced (B1, TT19).** | B1 anchor hunt NPCs and tells | A human start whose colleague changes (S to M) | A coworker's tea goes cold | You know what a mimic missed |
| PTT11 | **Clean wasteland (B5, TT27).** No infection sources; the gate checks papers only. | Gate day, tools minus rot-light | Paper-forgery cases (S to M) | The rot-light is missing from the desk | Collector consent and charge rules still work |
| PTT12 | **Rerolled TT28 truths.** Sealed; existence and route only: B1's volume-two hooks and B4's deleted-record route. | B1 or B4 slice | Sealed data (M) | Nothing until the route resolves | Per copy |

### First canon slice and first AU slice

**Canon: PTT5 "B5 gate day"**, the deep dive's slice: five applicants per day, interview, thermometer and rot-light, a cooperation meter, one consent copy at 50% for one charge, charge refilling from a socket. Cheapest TTKS slice because it is a job loop with no identity theft or simulation; it can ride the generic private pack loader the way book world 1 does, with jobs, witnessed memory and a counter. Each tool names its blind spot (P32).

Acceptance: PTT-A1 five applicants per day on the native clock, with a hidden source on one. PTT-A2 each tool returns its declared false positive or blind spot. PTT-A3 copying requires cooperation at threshold and spends one charge. PTT-A4 charge refills on the socket schedule and survives reload and import. PTT-A5 an admitted applicant appears on the town roster later (TT15). PTT-A6 no raw novel prose in pack text.

**AU: PTT9 refused applicant.** Reuses the gate, applicants and roster from the other side. Cheap because the roster that the canon slice writes is the AU's starting state.

Acceptance: PTT-A7 the AU is its own instance. PTT-A8 the same inspector tools read the player with their declared blind spots. PTT-A9 re-application after a refusal is possible with changed papers, not free retries.

---

## Mother of Learning / Cyoria (`docs/worlds/mother-of-learning/`)

### Canon spine

| Code | Canon era, events, places | Coverage we hold | Source gaps |
|---|---|---|---|
| PML1 | **Third-year academy era, ordinary city** (ch 1 to 20 patterns): the implemented `book.mol.independent_visitor.branch`. | 107/107 read; claim index with 24 profiles; MOL-C pins in WORLD_BRIEF | Native journeys deferred; director review |
| PML2 | **The month including the festival** (public franchise structure). | Fully read; excluded from implementation by the brief | Event graph and invasion beats not authored |
| PML3 | **After the ending**: school shut, cheap property, contested aranea status (epilogue). | Read | Post-ending people states per actor |
| PML4 | **Backstory eras**: Splinter Wars, the Weeping (source history). | Read as history | Lived-era detail is thin; needs invention labels |
| PML5 | **Places usable first**: the 7 implemented locations (arrival, Imaya household, guest desk, library, workshop, practice court, sewer hatch). | `MOL_LOCATIONS` | Dungeon depths, Knyazov Dveri, Koth unimplemented |

### Easy AU and parallel variants

| Code | Divergence point | Content reused | New content (size) | Player notices first | Carries between canon and copy |
|---|---|---|---|---|---|
| PML6 | **Relationship AU: Taiven as rival retriever.** She takes the lost-watch job herself and you race her (W2 "change a choice"). | Retrieval quest, hatch encounter, her combat profile, watch stock | Flipped regard and a competing claim on one watch (S to M) | The job board says the watch is already claimed | Your lamp skill and notebook carry; Taiven's regard is per copy |
| PML7 | **Relationship AU: the household is kin.** Imaya is a relative who houses you rather than a landlady. | Household work, meals, room | Relation seed, rent waived for chores (S) | No rent quote at the door | Per copy |
| PML8 | **Relationship AU: Zorian as a study partner or a cold stranger.** His starting regard is a dial, not a fixed contact. | Existing contact actor | Two regard presets with different lines (S) | Whether he sits with you in the library | Per copy; he still knows nothing from the future |
| PML9 | **Start-shift: settled lodger.** Start mid-arc with the guest pass and a rented room already earned (T2 "during" snapshot). | All 7 locations, 9 people, pass and shop | A start snapshot freezing those receipts (S to M) | You skip the arrival board | No arrival history; people remember a past you did not play, as authored |
| PML10 | **Start-shift: after the ending** (PML3, B lane MOL12/MOL20). | Same locations and household | Post-ending actor states and a new `eraId` footprint (M) | Shut academy and low property prices | Nothing by default |
| PML11 | **No guns** (B lane MOL23): mages won the Splinter Wars. | City and people | Changed equalizer rules and price shifts (M) | Rods everywhere, no gun shops | Your firearm reads as a strange object |
| PML12 | **Sealed MOL-SEAL-1.** A rerolled answer to one public mystery. | The investigation route | Sealed data (M) | Nothing until that route resolves it | Per copy |

### First canon slice and first AU slice

**Canon: PML1, finish what exists.** The cheapest canon work in all five worlds is running the deferred native journeys of the implemented Cyoria arc, then adding the ward-ledger taste (B lane MOL1) as a small content add. No new source reading or engine owner is needed.

Acceptance: PML-A1 rebuilt fresh origin plays entry through mastery 3 and a changed return. PML-A2 smoke then paid finite care. PML-A3 delivered-report Taiven cover conserves her own means. PML-A4 negotiated, withdrawn, declined, failed and late branches leave the right watch, payment and hazard. PML-A5 save, reload and import mid-job and after return. PML-A6 the ward renewal lapses visibly if skipped.

**AU: PML6 Taiven as rival.** One relationship flip and one competing claim on content that already runs. Cheapest MOL AU because the encounter, quest and her combat profile exist and only regard plus claim ownership change.

Acceptance: PML-A7 the rival copy is a separate instance with its own `continuityId`. PML-A8 the watch settles to exactly one claimant. PML-A9 Taiven's later offers read the rivalry receipt. PML-A10 the canon instance never shows the rivalry.

---

## Cross-world AU kit (AK)

| Code | Pattern | How it works across the five | Engine seam it leans on (G lane owns) |
|---|---|---|---|
| AK1 | **Premise field at start.** One start-time field selects the divergence; content uses ordinary field conditions. | SL p01 already does it; HP household type, D&D profile, MOL regard presets, TTKS supervisor | Pack `requires`/`visibleWhen` conditions; start snapshot freeze (T2) |
| AK2 | **Relationship-flip kit.** Each reused NPC gets a relation (friend, rival, family, mentor, enemy, love interest) and starting regard as data; the AU flips or shifts values and swaps two or three lines of texture. Jobs and receipts stay the same. Default: flip at most two people per AU so the copy stays readable (W5 premise fatigue). | PHP6/7, PDD7/8, PSL5/6/7, PTT6/7/8, PML6/7/8 | Directed relationships and witnessed memory in existing simulation people; per-instance regard |
| AK3 | **Start-shift kit.** Same world, other era, position or body: freeze a start snapshot from existing receipts (mid-arc), reverse a job's side (client, supplier, refused applicant), or move the era with a new `eraId`. Default: prefer side-reversal and mid-arc first because they reuse content whole. | PHP9/10, PDD9/10, PSL8/9, PTT9/10, PML9/10 | Typed starts (`structured_pack_runtime`, pack `starts`); footprint `eraId` |
| AK4 | **Profile or rule swap.** Same content, one rule table changed. | PDD6 editions, PML11 no guns, PTT11 clean wasteland | Instance pins a rules or definition revision |
| AK5 | **Survivor or absence toggle.** One person present or absent, with BT12-style event status. | PHP11, and later any world's cast | Event status per instance (T3) |
| AK6 | **Sealed reroll by ID.** A rerolled truth lives in sealed private data and surfaces only through its route. | HP-SEAL-1, DND-SEAL-1, W1-SRC-26 route, TT28, MOL-SEAL-1 | Sealed data loading per instance |
| AK7 | **Copy hygiene.** Every AU is its own instance (T1/T4); notebook facts carry a copy tag (PW7); existing saves keep their exact pack (book world 1's p05 rule). | All | Instance identity, notebook tag, pack compatibility |

### Five cheapest builds across the five worlds (ranked)

1. **PSL5 colleague-is-family AU** (S): pack data on p01's existing premise seam and p08's people. Gate: book world 1 resume steps.
2. **PML6 Taiven-rival AU** (S to M): regard flip plus one competing claim on a running encounter.
3. **PML1 canon acceptance runs** (S, verification): run the deferred native journeys of the implemented Cyoria arc; no new content.
4. **PSL1 morning muster** (S to M): fresh successor pack revision with existing people and field conditions.
5. **PHP1 summer 1991 supply week** (M): first native HP instance on existing jobs, custody and structured starts; PHP6 then follows at S.

D&D (PDD1 then PDD6) and TTKS (PTT5 then PTT9) come next: each needs one new consumer (D&D object repair and profile state; TTKS detection tools and consent copy) before its AU becomes an S-sized reuse.
