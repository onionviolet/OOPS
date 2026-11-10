# Zorian S2 teacher bridge prep (2026-11-08)

Scope: prepare the first post-reset step from the completed S0/S1 drill into S2, using local c13-c15 readings. This is a source-fit note, not accepted direction or runtime implementation. No sealed scene truth is included.

## Evidence and sufficiency

The after-drill save at `work/mol-restart-memory-2026-11-08/after-drill.save.json` is the closure artifact named by the S0/S1 record. That record reports a rebuilt headless Chromium run at 1920×1080, native reset and persistence round trip, drill spent and settled, zero page errors/overflow. The S2 record still identifies teacher windows as absent from MoL and H3 as on-path; it names a c15 lesson series as its done check. This prep establishes a plausible first appointment route, but the available chapters do not establish a completed lesson series or new ability from that appointment.

## Known from the local text

- Chapter 13 reopens in Imaya's house after a short restart. Zorian wants mind protection before returning to the sewers; the archive ward he knows blocks mind communication as well. Taiven visits and proposes a sewer job. The immediate action available to Zorian is conversation and warning, not trained mind defense (c13 p10-30).
- Chapter 14 establishes that he applies for library work, meets Ilsa about advanced instruction, chooses divination, practices the north-finding shaping exercise, and is due to meet his divination instructor. Xvim's marble session is scheduled for the next Friday (c14 p108-110).
- Chapter 15's opening is an Xvim practice session in the academy practice room: blindfolded sensing of mana-charged marbles. Xvim's critique distinguishes sensing from guessing; Zorian recognizes that he had relied on gut instinct (c15 p1-18). This is ongoing instruction, but the chapter's described session does not show a completed skill acquisition.
- Later in c15, the divination connection with Haslush is an introductory meeting over drinks. Haslush says they will meet again Monday; this scene sets up the relationship and professional context, not a demonstrated divination lesson (c15 p49-73). Do not treat this appointment as taught practice or as the earliest completed S2 lesson.

## Proposed bridge for implementation planning

**Earliest actual bridge:** start at the post-reset Imaya-house beat with the previously completed drill state; carry the player's existing shaping practice as prior experience only. Route to the already scheduled academy practice room session with Xvim on Friday. Xvim has teaching authority through the existing academy relationship; Zorian participates as a student. The source supports a lesson appointment and a concrete exercise/critique, but not a guaranteed positive result. Cost: the scheduled practice-session time and Zorian's attention; avoid inventing a monetary fee or a fixed duration. Learner means: blindfolded attention to the marble's mana presence and trajectory, then responding from sensed location rather than a guess. Supported later action: a better basis for sensing a moving mana source and, over repeated practice, the c37 sensory training noted by the S2-S6 stage record. It does not yet enable mind shielding or safe sewer entry.

Haslush is a later alternate bridge for divination: the source supports a Monday follow-up after an introductory social meeting, but no instruction content in the inspected passage. Keep it as contact/appointment until a source passage establishes actual teaching and what the learner can then do.

## Owner and checks

- **Owner:** H3 in `ZORIAN_S2_S6_STAGE_RECORD_2026-11-03.md`; S2 teacher windows remain an unimplemented gap. This note proposes a source-grounded first appointment shape; it does not close H3.
- **Blocked check:** the H3 c15 lesson-series window opens/closes by clock and proves a learner action/consumer. The inspected c15 Xvim session is a practice episode with critique, not evidence of durable skill gain; Haslush's c15 meeting is contact, not taught practice. A bounded later source read or implementation acceptance must establish repeat scheduling and a concrete result before calling the S2 teacher bridge sufficient.
- **Status:** source prep complete for the earliest appointment and its limits; S2 teacher-series sufficiency remains blocked. No runtime, shared-owner, or private locator files changed.

## Playable H3 appointment, 2026-11-08

The authorized continuation begins with Zorian’s earned post-reset rod drill. In **Notebook → Here → Tools, practice & local lives → Mother of Learning**, stay in the supervised practice court and choose **Wait for Xvim until Friday at 3 p.m.** Start the blindfold drill when the slot opens, then report the trace you lost or call a side. Xvim’s response enters your local records as attributed instruction. It distinguishes sensing the approach from reliably locating the path, with two different critiques. The exact chapter response and the uncertainty response are adapted routes through the same practice.

Chapter 14 p111 supplies Friday. Chapter 15 p2–20 supplies the blindfold, mana-charged marbles, unreliable lateral tracking, Xvim’s critique and the session end. The first represented Friday, 3–5 p.m. **Cyoria local time**, two 15-minute phases, stamina and attention are authored dials for this scene. There is no fee or player mana expenditure. Cancelling the wait keeps elapsed time. A late arrival or absent Xvim prevents the corresponding phase. Loss of teacher support during a timed phase stops its result. Finishing records the critique and closes both response choices for this run. Repeat appointments and demonstrated mastery remain open in H3.

The slice uses the existing simulation command rows, completed-command checks, observer knowledge, and the MoL run clock. The wait reserves the ordinary player job and binds its exact due time to the appointment. The native shared book passage clock can request up to 120 played minutes per tick while that job is pending, clipping at the appointment and respecting the clock’s existing boundaries. Cyoria's save validator checks the job’s frozen definition and exact due. Existing saves use the same schema. Xvim’s critique uses the existing knowledge carrier, distinct from the current run's completion and spend.

Desktop target is 1920×1080. Both response cards occupy the first row of the existing Cyoria section and the resolved critique appears in local records. Mobile remains deferred. The scene follows AD36, AD38, AD43, AD49, AD51, AD52, AD54, WPR30/WPR32, AR3/AR6/AR10 and PRS1–PRS8. Nearby voice sample for the brief was “Try the shaping drill you remember.”

### Verification

| Check | Result |
|---|---|
| Input identity | Existing after-drill save SHA-256 `d52bd77c3e48189553d566e44aa4e565157c8f20179de1fc80e2795318a5ff9e`. Pre-change MoL command-pack SHA-256 `20ffb8f602203ec686092e8da03d27d63eb5b80eb7f77766db04af8e4c489399`. |
| `BUILD_OUT=<isolated dir> npm run build` | Bundle SHA-256 `cf4b3085122e6bd5d5c317531b98f89f56a8eaf5918a19bec5aa77ebca00b543`. The existing duplicate-key warning in `travel_legs.js` remains. |
| `node scripts/playtest/mol-xvim-friday.mjs <build> <seed> <evidence>` | Headless Chromium passed at 1920×1080. Exact unmodified seed, early refusal, first wait tick 120 minutes, pending reload and cancellation, full 6,298 played minutes to Friday, 30-minute practice, one teacher attention, critique displayed, prior drill and reserve preserved, save/reload/Export/literal Import, zero page errors and zero horizontal overflow. Local receipt and screenshots in `work/mol-xvim-friday-final-2026-11-08/`. |
| `node --test tests/mol_zorian_restart.test.js tests/mol_zorian_start.test.js tests/book_world_mol_cast.test.js` | 28 passed. The focused new test also checks the second critique, teacher absence, interruption, late arrival, wrong saved wait due, and repeat-drill admission. |
| `npm run check:arch`, `npm run check:player-text`, `node scripts/lead_run/check_zorian_s2_s6_scene_table.mjs`, scoped `git diff --check` | Passed. No new import cycle, 341 of 341 source-table rows verified. |

Agent-verified, human review open. The MCP accepts its own exports or named scenarios and rejected the exact repository-work seed path. The limit was recorded and the private seed was played in isolated Chromium. Reports’ existing “Now” line can show the native clock rather than the Cyoria clock. The appointment uses the local time in the location header.

## Playable Monday object lesson, 2026-11-08

The continuation starts from the exact earned `mol-zorian-xvim` save. Follow the first card in **Notebook → Here → Tools, practice & local lives → Mother of Learning** to the library, then tell Imaya about Monday at home. Waiting ends at 3 p.m. Monday by the Cyoria clock. At the tavern, look around, try the locator compass or ask a patron, then learn a narrow object-analysis spell and use it on the sealed envelope. The exercise closes when the player observes the ward and Haslush confirms where he put it. The school sequence's existing wait job supplies both Friday and Monday with bounded ticks. Native walk and the local Notebook supply the tavern route. New saved data is limited to existing action, observation, inventory and location carriers. An older MoL envelope can omit the newly defined empty tavern record while the player is elsewhere.

Chapter 15 p45–73 gives Ilsa’s introduction and the Monday follow-up. Chapter 16 p1–4 gives the need to warn Imaya, and p5–36 gives the tavern diagnostic and the actual lesson. The source shows Zorian with a compass and prior resistance training. For this checkpoint, collecting the compass with the introduction accounts for the missing tool. The player can stay and ask for the teacher without claiming prior resistance training, or use the compass and have Haslush drop the test. Giving Imaya advance notice in person, the two-hour afternoon window, the individual durations, the mana costs, and the envelope’s particular ward are authored dials. Haslush is a local scheduled scene role. The exercise records the player's own recollection of the teaching and observation of the result. It makes no general mastery grant. The police-reporting conversation that follows c16 p36, c17 material, later repeat sessions and the larger S2 c13–24 remain open.

At 1920×1080, the two diagnostic choices appear together in the first row, with the observed result in the same local Notebook section. Mobile remains deferred. The route follows AD36/38/43/49/51/52/54, WPR30/32, AR3/6/10 and PRS1–8. Voice sample “Try the shaping drill you remember.” The old location report can still describe the area as a Cyoria guest life and show the native clock. Use the local time in the place header for Monday.

### Verification

| Check | Result |
|---|---|
| Exact predecessor | `mol-zorian-xvim` SHA-256 `9bfcc4c19c0656976f44141ab096c8866371ce939389f5d398e547b5c2c21d1f`. |
| Game MCP | Loaded the exact Xvim scenario. The directed walk, introductory appointment and school-kit compass settled. The earned `mol-zorian-haslush` endpoint also opened at the tavern and exposed the method and confirmed ward. |
| Focused tests | `node --test tests/mol_zorian_restart.test.js tests/mol_zorian_start.test.js tests/book_world_mol_cast.test.js`, 29 passed. The new regression checks the exact wait due, alternative without a compass, late refusal, and interrupted practice with returned mana and no result. |
| Rules and boundaries | `npm run check:arch`, `npm run check:player-text` and scoped `git diff --check` passed. Main, display and save files have zero growth. No new import cycles. |
| Rebuilt desktop browser | `BUILD_OUT=<isolated dir> npm run build` followed by `node scripts/playtest/mol-haslush-monday.mjs <build> <seed> <evidence>` passed. Bundle SHA-256 `b4a7026d0f599e3393ac37ec56bce1101adc938f1ff940eeb33b51aea7ef0fe7`. Early arrival refused, the first wait tick advanced 120 minutes and 4,275 minutes of local time elapsed in total. The pending wait survived Save and reload, cancellation kept elapsed time, and the job stopped at its exact due. The 40-minute locator route spent two casts of mana, retained the prior drill and critique, and produced the ward observation. Completed Save, reload, actual Export download and literal file Import passed with zero page errors or horizontal overflow. |
| Earned endpoint | `mol-zorian-haslush`, expansion clock 53444, Cyoria tavern, 5 of 8 casts of reserve. Private endpoint SHA-256 `981a25a3df2de95ef4cd40b2398ef85e0111f07354a9ae74f51468b4af19d577`. Local receipt and both screenshots are in `work/mol-haslush-monday-2026-11-08/`. |

Agent-verified. Human play review remains open.

## After Haslush’s lesson through Kael’s examination

The exact earned Haslush save starts at the tavern after the ward exercise. Haslush can ward the table and hear a discreet warning before he leaves, or Zorian can keep the warning to himself. The warning opens an inquiry. Haslush promises to look into it and asks for a follow-up. His response provides no guarantee of intervention.

At Imaya’s house, Zorian can practice holding a snail by its shell while Kirielle distracts him. The practice uses the existing reserve and records where his control wobbled. Then he helps Kael with first-year magic, reads the paper Taiven brings, and chooses whether to share his account of the repeating month by taking up the private conversation. Kael’s own witness state is local to this run. Zorian can let three local days pass at home or return after using that time elsewhere. Kael gives his reading of the remembered chant, then Zorian can consent to his examination or leave it for another time. Kael’s examination distinguishes the bond he can test from an unresolved connection. It grants neither soul magic nor the means to inspect other people.

The source is c16 p36–58 for the warning, p59–76 for home and levitation, p77–122 for tutoring and the article, p123–151 for disclosure, and p152–200 for Kael’s theory and examination. The reserve cost, scene durations other than the stated 15-minute examination, no-tip branch, and the option to decline the examination are authored dials. The earlier route already delivered Imaya’s warning in person, so it omits the paper plane’s mishap. Zorian’s account uses the developer life’s source premise for earlier festival events. It supplies the remembered content here for the conversation without asserting that the old seed played those events. Haslush and the other visitors are local scene roles; Kael is an existing resident, required and reserved for both tutoring and the examination.

The 1920×1080 target is the existing local Notebook section, with both tavern options in the same row and the examination result displayed there after settlement. Mobile remains deferred. The route follows AD36/38/43/49/51/52/54, WPR30/32, AR3/6/10 and PRS1–PRS8. Voice sample “Try the shaping drill you remember.”

### Verification

| Check | Result |
|---|---|
| Exact predecessor | `mol-zorian-haslush`, SHA-256 `981a25a3df2de95ef4cd40b2398ef85e0111f07354a9ae74f51468b4af19d577`. |
| Rebuilt browser and persistence | `BUILD_OUT=<isolated dir> npm run build`, bundle `6a87fa2f072f7c048e5dffa051ca0fc34f2823e778a3aa5c4cd904d0af4d7ba6`. `node scripts/playtest/mol-haslush-to-kael.mjs <build> <seed> <evidence>` passed. Both tavern choices, a one-cast shaping exercise, Kael’s tutoring and examination, a 4,320-minute research wait with a 120-minute first tick, pending reload and cancellation, earlier memories and completions, actual Export download and file Import. Zero page errors and horizontal overflow. |
| Focused tests | `node --test tests/mol_zorian_restart.test.js tests/mol_zorian_start.test.js tests/book_world_mol_cast.test.js` passed 30 tests at this slice. They check pending tutoring with both actors reserved, interrupted shaping refund, withheld tip, no result on interrupted or declined examination, and Kael’s witness state rewinding while Zorian’s result stays remembered. |
| Earned endpoint | `mol-zorian-kael`, expansion clock 57839, Imaya’s house, 4/8 casts. SHA-256 `94bec448542662101dce5ea6593e4b401d7fa89f1aca0b76ad72bac179c43f28`, private save, receipt and screenshots in `work/mol-arc-one-c16-2026-11-08/`. |

## The next tunnel meeting and the offer

The next exact window runs from the late chapter 16 interruption through the offer in chapter 18. Follow the voice, use the library to compare conflicting accounts, ask Imaya about the pressure in crowds, and prepare a way back out with Kael before returning below. The cubes are a real carried item. Preparation and firing each use one cast of the established reserve. Kael must be there to prepare the cubes and attend the meeting. The player can agree to carry the packet or leave without it. The accepted packet appears as an unreadable recollection and follows the seat’s existing memory carry. Neither its content nor new mind powers are granted.

The playable passage uses c16 p202–208, c17 p1–34, p36–39, p42–83, p104–162 and c18 p1–31. The ward-cube blanks from Kael, quantities expressed as one set, action durations, reserve costs, and early departure option are authored dials. The local sewer place stands in for the tunnels and the surface alley. Kael is moved to the hatch with the existing resident movement effect and returns to the household on either packet choice. The first contact and retreat use short actions with a checked escape plan. Their timing and roles represent this encounter and do not simulate the broader tunnel ecology. The local Notebook remains the desktop surface at 1920×1080.

| Check | Result |
|---|---|
| Exact predecessor | `mol-zorian-kael`, SHA-256 `94bec448542662101dce5ea6593e4b401d7fa89f1aca0b76ad72bac179c43f28`. |
| Rebuilt browser and persistence | `BUILD_OUT=<isolated dir> npm run build`, bundle `e38e7cfd6220ad4c21bc4de1d8f67b6db81b11a62c9da6a175e5ddf700c0040b`. `node scripts/playtest/mol-haslush-to-kael.mjs <build> <seed> <evidence> aranea` passed. Two casts spent, physical cube set produced and consumed, Kael at the hatch then back at home, both choices visible, earlier notes intact, actual Export download and file Import, zero page errors and horizontal overflow. |
| Focused tests | 31 passed across the three MoL files. They include missing cube refusal, a valid pending meeting, alternate refusal, and accepted packet recollection crossing a scoped restart while the choice’s completion resets. |
| Earned endpoint | `mol-zorian-aranea`, expansion clock 57934, sewer entrance after the retreat, 2/8 casts. SHA-256 `db58b23701b828930c672cdb69d5c60c052221d7bd6ea3aef3b5c0141f46d022`. Private save, receipt and screenshots in `work/mol-arc-one-c18-2026-11-08/`. |

## Festival departure, six study months and the next Friday drill

The next window picks up the packet offer and lets Zorian plan the train departure. The train and each of the six study months use the existing timed job and the next calendar reset. The study command must begin during the first local day. Cancel to use the days yourself. If that misses the study window, Zorian can wait out the month at home and start the same study round in a later run. The calendar still runs and no study record is given for a skipped month. Each completed month settles one distinct recollection, then the existing loop restarts and resets local commitments and reserve. The wait can request up to one local day per scheduler span, clipped at the owning month boundary. Ordinary Friday and Monday appointments remain shorter spans. Haslush’s three rounds of divination and Nora’s three rounds of spell formula alternate here as an authored order.

Chapter 18 p58, p108–114 supply the choice to leave, the train, the six-month montage and the three months with each instructor. The study text paraphrases the existing topics, with no new claim about the particular spell learned in any given month. Late chapter 18’s household care and the outside assessment of the packet remain compressed out of this route. The original fixture calendar still sets the exact festival date. The departure uses the station as its origin and compresses the train ride into the passage to the reset.

Chapter 19 p1–67 supply Ilsa’s refusal, returning to the tunnels with Taiven, and agreeing on practice. Zorian can return with a packet or make a new request without one. The practice bout in p68–108 is represented by a warded exchange at the existing court. The court substitutes for Taiven’s family hall. The source’s more elaborate spar is compressed into the shield and the cast Taiven senses. Both mages spend their existing mana; the player spends two single-cast units. Zorian can then ask how she located the spell, shape a small cloud in two hours of independent practice, and spend a cast applying it at Xvim’s Friday session. The last action requires Xvim, the live local slot, and the player’s own practice. The result distinguishes tracking a marble’s movement from distinguishing its mana output, as in c19 p95–109. The wait uses the next Friday after the independent practice. The hour and scene durations are authored calendar and action dials. Human review remains open, with the local Notebook and feedback targeted at 1920×1080.

### Remaining Arc 1

- **Next exact source window.** c19 p110–149 / 01906 is the first unimplemented passage after the Friday result. Continue through c20’s inquiries and source-labelled discovery routes before the next coached mind exercise, 02101.
- **Later route.** The party and festival response are c21. The retrieved item is the first separately identified independent object-analysis consumer in c22 p104–107, after Taiven’s training and the retrieval. c23–25 add further teacher, preparation, travel and investigation windows. c26 p287 explicitly closes Arc 1.
- **Coverage.** H3 now has a recurring study consumer and a distinct coached transfer through Xvim’s drill. Broader teacher scheduling, H2 packet handling outside the represented relationship, H5 beyond the drill, the independently used object-analysis route, and the remaining Arc 1 windows stay open. Source qualification beyond this passage needs a fresh bounded read. Overlapping and cut terminal excerpts made the prior direct-read total uncertifiable under the lane’s 12,000-word cap, so the remaining route here uses the prepared scene table and the already located arc marker.

### Verification

| Check | Result |
|---|---|
| Exact predecessor | `mol-zorian-aranea`, SHA-256 `db58b23701b828930c672cdb69d5c60c052221d7bd6ea3aef3b5c0141f46d022`. |
| Rebuilt browser and persistence | `BUILD_OUT=<isolated dir> npm run build` and `node scripts/playtest/mol-haslush-to-kael.mjs <build> <seed> <evidence> cloud` passed at 1920×1080 on bundle `c183be6bc85d9122bf52ed135db3016556b119fc7b5287b5794167bd81440b9c`. The train used 27,630 played minutes and each study month used 42,780. Seven calendar resets reached run 9. The packet and older instruction stayed remembered. Four casts paid for the exchange, independent work and Friday drill. The Friday result and prior notes survived Save, reload, actual Export download and file Import. Zero page errors and horizontal overflow. |
| Current source checks | 32 focused tests passed across the three MoL files. The canceled or late study and no-credit wait, return without showing a packet, and interrupted Friday drill are covered in the focused test. The canonical browser replay predates the late-admission and optional withholding refinements. The current-source Game MCP booted the exact packet checkpoint and queued the festival train. `npm run check:arch`, `npm run check:rules`, the 341-row source table check, and scoped `git diff --check` passed. |
| Earned endpoint | `mol-zorian-cloud`, expansion clock 348559, run 9, Cyoria supervised practice court, 4/8 casts. SHA-256 `4e42e710d6ae831a101c504b0f81397209d0ff7382f6f8d5c7e0651de214d427`. Private save, receipt and screenshot in `work/mol-arc-one-c19-2026-11-08/`. |

Agent-verified on the named path. Human play review remains open.

## Arc 1 continuation from the cloud drill, 2026-11-09

The selected route uses c19 p110–126 and p144–149, c20 p126–136, c21 p1–25, p104–121 and p162–167, and c22 p1–15, p98–113 and p126–134. The direct-reader ledger records 6,767 nonoverlapping words and per-range hashes at `work/mol-arc-one-closure-2026-11-09/source-reading.jsonl`. A separately bounded reader qualified c23–26 in 11,977 distinct words. The prepared scene table supplies in-between context and scene IDs. Sealed beats remain discovery-only.

From the exact cloud drill, follow the scout’s three-day wait, compare the web’s forecast with other accounts, and return for the arranged mind lesson. The lesson distinguishes a deliberate inward sense from an outward push. Later the festival forces a test in motion. Help the group cross the mansion, then carry Tinami. The existing harm and continuation route rewinds after the garden outcome. Zorian’s observations survive as memories while equipment and the current visit rewind. In the next run, make a missile rod, use the inward sense below, take Taiven’s practice and recover the client’s watch. Haslush’s remembered object-analysis method identifies what the watch does. The remembered mana-cloud technique opens the casing by a different means. Both need the physical watch and spend mana. The player returns the same item before giving an account to the matriarch.

The c20 inquiries and first coached practice are selected and compressed. The academy approach represents the temple quarter, and the existing court represents Taiven’s practice room. The festival uses an additive mansion location, guarded by the invitation, with an authored 7 p.m. slot on the fixture month’s last day. Short preparation and retreat actions use authored mana costs and durations. The prose follows PRS1–PRS8 and the existing Notebook voice, “Try the shaping drill you remember.” The target remains 1920×1080. Mobile is deferred.

| Check | Result |
|---|---|
| Exact predecessor | `mol-zorian-cloud` SHA-256 `4e42e710d6ae831a101c504b0f81397209d0ff7382f6f8d5c7e0651de214d427`. |
| Rebuilt native browser | `BUILD_OUT=<isolated dir> npm run build` and `node scripts/playtest/mol-arc-one-closure.mjs <build> <exact-cloud> <evidence> watch` passed on bundle `e742a1e32096d7f89bf23fdf89bd519849c5d3baaaa2c907b750906d3bd68236`. Early appointment refused, scheduled waits settled, garden death produced the existing harm restart, remembered techniques operated on the actual owned watch, and delivery removed it. Save, reload, actual Export and file Import passed. Zero page errors and horizontal overflow. |
| Earned checkpoint | `mol-zorian-ward-reader`, run 10, clock 385064, SHA-256 `7ce7a0edfd95fc55ec9d0078cae8717e33aff30f23e7446c44c09090d8222d20`. Private save, screenshot and receipt in `work/mol-arc-one-closure-2026-11-09/watch/`. |

### Selected closure, c23–26

The apprenticeship demonstrates shaping and formula work to Ilsa and settles five real calendar blocks, one per restart. Missing a first-day start leaves a no-credit wait. Teleport instruction is earned at the end of the fifth block. The final route uses physical relay discs and silver, Kael’s separate soul-sight concealment, the trap’s observed aftermath, and partial retained map/message observations. The old parts of the map are not filled in. The beacon jump costs mana and has one represented known destination. Equipment is newly acquired after the last reset. The shop’s on-credit payment is an authored means when the chapter does not state prices, and the resident durations and per-action mana are authored dials. The packet and notes carry through real resets. The carried relay and other equipment do not.

Scenes 02304–02305, 02402/02408–02409, 02504/02507–02508 and 02605–02614 supply the selected closure. The classroom and cavern interludes are compressed, and some optional investigation and training scenes remain unplayed. Kael’s instruction is an authored lesson bridge grounded in the later explicit attribution. The discovery route ends at c26 p287 in the existing world, with the terminal action and spent means saved. The same loop adapter continues to handle earlier lethal and date boundaries. The terminal scene is held for the printed boundary because the next awakening begins the following arc.

The lane follows AD36/38/43/49/51/52/54, WPR30/32, AR3/6/10 and PRS1–PRS8. The latest focused tests include the completed route, owned means, same-watch return, early refusal, five independent apprenticeship blocks, and distinct earlier and terminal life outcomes.

| Check | Result |
|---|---|
| Exact apprenticeship start | `mol-zorian-ward-reader` SHA-256 `7ce7a0edfd95fc55ec9d0078cae8717e33aff30f23e7446c44c09090d8222d20`. The 1920×1080 browser ran five actual calendar resets on bundle `7da8e6f19d3727a11503345f474c06ce531271b0b16eab5431462333a5907c89`. The ward-reader memory survived all five. Per-run hashes and clocks are in `work/mol-arc-one-closure-2026-11-09/end/apprenticeship-receipt.json`. |
| Exact finale start | Run 15 at clock 598719, SHA-256 `61910afb0be26a9383e4b1cdadc37670af9ca9b683f4a7e213885e4625c1b556`. The same browser harness loaded that exact save into rebuilt bundle `fd6768dd92e38ff0b52f03cca110759ff756f62814927a6abd0e332b5b04dc99`, with the second festival at its own dance hall. |
| Last reset and terminal round trip | The late route took one calendar reset. The two partial observations stayed remembered while physical equipment rewound. The beacon cost two casts and landed at its named destination. The six rounds and last charges were spent. The terminal save held at c26 p287 after the in-game timer tick, Save, reload, actual Export and file Import. Zero page errors and horizontal overflow. |
| Final checkpoint | `mol-zorian-arc-one-end`, run 16, clock 641559, SHA-256 `fbf66fd580e07af4db9dc1963f1095ad4c53121e8c96d7d024416e512d1d4ca2`. Private save, screenshot and receipt in `work/mol-arc-one-closure-2026-11-09/finale/`. |
| Current focused checks | 33 passed across the three MoL files. `check:arch`, `check:rules`, and scoped whitespace checks passed. |

The selected Arc 1 route is agent-verified through its printed ending. Human play review remains open.
