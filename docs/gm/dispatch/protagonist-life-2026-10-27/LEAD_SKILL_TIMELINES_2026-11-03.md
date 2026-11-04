# Lead skill timelines per book (SLC120 pass), 2026-11-03

Status: proposal and research table (AD32). Nothing here is a decision, and nothing changes code, packs or rules. Owner of the ask: SLC120 in
[SKILLS_AND_LEARNING_CONSIDERATIONS Round 6](../../../SKILLS_AND_LEARNING_CONSIDERATIONS_2026-10-18.md). Method: only readings, packs, receipts and
notes already saved in the repo or its linked private folders; no download, no new book read, no model run. Sealed truths are not restated; where a row
touches one, it names only the pack route (see "Sealed-secret handling").

## 1. Which leads, and why (reading, proposal)

The lead-life guide does not contain a ranking table. The reading used here, each part checkable in the guide:

- **Klein (Lord of the Mysteries, be seat)** is first: guide section 10 names the Klein full-journey campaign as the current execution, and the Klein-first
  campaign is required by the task regardless of rank.
- **Zorian (Mother of Learning)** is second: wherever the guide names a second world it names MoL (section 4.4 first slice, drift item Dr2, step 5 "one MoL or HP row set").
- **Harry (Harry Potter)** is listed in the gaps. The saved HP material is craft-scene windows (potions, shop products) and a school-life plan for an opt-in
  student life, not a reading of Harry's own skills, so a Harry timeline would be mostly fill.

Dial: if Weibao ranks the leads differently, only section 1 and the gaps change; the row shape in section 2 does not.

## 2. How to read the tables

**Row labels** (`KS1`, `ZS1`) are local to this file. They are not registered codes and nothing else cites them.

**Position.** Klein: English v1 chapter and paragraph (`ch32 P041`), as the KJ receipts and seam files cite them. Zorian: `Ch N Title ¶k` is the
MAGIC_SYSTEM reader's 0-based paragraph index; `cNNN pK` is the R1/R2 window ids (1-based paragraph ids). The two schemes are not reconciled, so a
Zorian locator proves the chapter and nearby text, not the exact paragraph (the Klein ARC2 probe found three off-by-paragraph locators in a
reader's output for the same reason; its corrections are applied below).

**Evidence kind** follows LSD284: *claim* (a person says it; a speaker who lies is still logged, see ZS1), *feat* (something done on the page),
*contest* (who beat whom), *practice* (repetition or time spent), *failure*. Source labels follow the saved readers: SHOWN, STATED (by whom),
INFERRED, narration, pack text, title only (the chapter title is the only evidence I saw).

**Band** uses the LSD287 evidence-to-band fit, which is not built (it is "build it once in the C2 lane"). Every band below is therefore a hand prior,
labelled `fill`, and the proposed fit is:

| Evidence kind | What it may set | Dated how |
|---|---|---|
| claim | a prior, `fill`, and nothing more; a contradicted or interested claim sets nothing | from the claim's date |
| feat | a floor (the person can do at least this, under those conditions) | from the feat's chapter |
| contest | a pairwise result against someone whose band is known (LSD285 ranking later) | from the contest's chapter |
| practice | a dated delta, not a value (LSD286, LSD301): the value is the baseline plus deltas | per restart or per chapter span |
| failure or injury | a dated drop, with its cause | from the event |

Rungs (proposal, each world may regloss them under WA33): `b0` none or lost, `b1` novice (tried, guided, fails as often as not), `b2` working
(reliable in ordinary conditions), `b3` skilled (beats trained peers, handles hard cases), `b4` master (others defer). MoL also keeps its own text unit,
missile casts, for reserves. Klein's Beyonder faculties are read inside the Sequence rung the potion gives (`Seq9` below); no Sequence 8 evidence is saved.

**Consumer** is a file or rule code that I found reading the skill. A backlog row or a design line is not a consumer. "None" names why: no owner found,
or a design line that no code reads. Where code reads a *source, resource or fact* but no band, I say so.

**Seat-neutral (SN)** is a check that reads the table, not who holds the seat. Proposed check (not built): for each row, (a) the row has no field that
says "lead", (b) its consumer is keyed by an actor id or a generic store, and (c) one non-lead from the same pack can carry a row of the same shape.
`yes` = all three hold on what I read; `no` = the consumer is keyed to a literal player, home or profile (named); `n/a` = no consumer, so the check
has nothing to read; `partial` = shape holds, the command does not. Non-lead sample rows that show (c) are in section 5.

## 3. Klein (Lord of the Mysteries), be seat

Saved sources used: KJ2 source extraction (ch4-6), KJ3A/KJ3C/KJ3K/KJ3L/KJ3M/KJ3O receipts, the ch32-54 seam files (`kj-seams-2026-11-02`), the
mechanism probes (`kj-mechanisms-2026-11-02`, ch31-54 and ch55-84 with its corrections M-A to M-E), the mechanism backlog (B3, B6, B8), the Klein
pack's own note strings, and the runtime files named in the consumer column. Canon turning points used as anchors: ch5 P066-P085 (first contact),
ch26 P047-P066 (range), ch28 P004-P010 (bluff), ch32 P010 (the drink), ch33 P075 (first gathering), ch43-46 (the search for the missing son),
ch54 P041-P079 (first paid requester), ch57 P022 (ritual structure), ch84 (end of saved reading).

Runtime facts that decide most SN cells (MECHANISM_GAPS F1-F3, re-read in `src/book_world_lotm_be_seer.js`): the be-seat Seer chain writes facts and
effects with `actor:'player'` and the be profile, Seer has no Sequence 9 ability rows beyond the Sequence 8 `face_hold`, and no Spirit Vision code exists
in `src/`. The Klein pack carries explicit "no skill increase is awarded" notes on several steps (ch11 P071-P081 among them), so no skill value is
saved anywhere for him today.

| Row | Position | Skill | Evidence | Band | Consumer | At the nearest turning point | SN |
|---|---|---|---|---|---|---|---|
| KS1 | ch4 P062; ch24 P034 on | University-trained scholarship (field not stated in the saved notes) | feat/claim: weighs a probation lecturer's pay against his options (narration, ch4 P062); the ch24 withdrawal scene (title and KJ3L scope). A pack note at ch39 P049-P057 mentions "debating skill", referent not verified, so unused | b2 fill (role prior for a recent graduate) | none: native skills exist (`src/skill_records.js`) but no Klein row; pack notes say no skill is awarded | ch24 P034 withdrawal closes the academic route; proposal: the band stays on the record as a qualification other checks (hiring, club) may read | n/a |
| KS2 | ch4 P077-P095; ch5 P002-P047 | Card-system knowledge (tarot), recognition not practice | feat/SHOWN: accepts a free reading, declines add-ons, picks "present", sees The Fool turned; recalls this world's tarot origin (narration, ch4 P089-P090) | b1 fill (knows the system, has not practised divination) | none: no divination row for him until ch48 | ch33 P075 first gathering uses cards as framing; proposal: b1 here is the floor that KS16 later raises | n/a |
| KS3 | ch5 P052-P061 | Ancient-language translation (Feysac, Loen; Hermes incomplete) | feat/SHOWN: translates the invocation into Feysac and Loen for a retry, cannot complete the Hermes translation | Feysac b2, Loen b2, Hermes b1; all fill | none found among the adapters listed in MECHANISM_GAPS F5 (ability, divination, exchange, making, household acts, inference, event cards) | ch57 P022: the ritual uses a Hermes format and a redirected incantation (ARC2 N8); proposal: b1 in Hermes is why he is a reader of rites before a writer of them | n/a |
| KS4 | ch5 P048; ch23 P001; ch56 P036; ch68 P039-P043 | Household budgeting and price sense | feat/SHOWN: market total 25 pence, source accounting disagrees with ch4 bread (KJ2, ch5 P048); three pence on Zouteland Avenue (KJ3J); one-eighth soli = one and a half pence (ARC2, confirmed); a market skim of five percent and heavy loan interest explained to him (ch68). The ch66 "two to four soli a week" claim is unverified (ARC2 M-A) | b2 fill | `src/cast_exchange_adapter.js` runs purchases (kinds purchase/wear) and reads no skill; halfpence cannot be tendered (ARC2 N14) | ch68 P039-P043: the skim and loan terms are information to him, not yet a transaction; proposal: price-sense band sets how fast he spots a bad quote | n/a (the adapter is actor-keyed in principle; no skill read) |
| KS5 | ch9; ch11 (title "Real Culinary Skills") | Cooking for a household | feat/SHOWN: a household meal (KJ3A, ch9), mutton stew as native labelled items and one atomic batch (KJ3C). The title is a claim about skill; no in-text comparison read | b2 fill | recipe inputs run through the native recipe, reserve and refund path (KJ3A); no skill reads quality; ch11 P071-P081 note says no skill is granted | ch11 interview-prep evening: proposal: the band would set family reaction and spoilage, with no new action | n/a |
| KS6 | ch23 P001-ch24 P033; ch26 P047-P066 | Firearm handling and marksmanship | practice/SHOWN: loads five, sixth empty (KJ3K `drill`); range practice, brass spent, silver rounds reloaded, no fee (KJ3L). No hit or score is saved | b1 fill | none: B8 records that `src/` has no revolver or firearm owner | ch26 P065 range scene; proposal: b1 feeds the bluff check (KS7) as grip credibility and a later fight as a hit band | n/a |
| KS7 | ch26-ch28 P010 | Cover story and bluff (lying with a weapon) | feat/SHOWN: tells the cover story, aims and bluffs with an empty chamber (B8; KJ3M); avoids the Nighthawks in his reasoning (KJ3L) | b2 fill | none: LSD342 (feint and read) and LSD383 (tells in talk) are design lines no code reads | ch28 P004-P010: the deterrence bluff; the text outcome is not restated in the saved notes; proposal: it resolves as a read at the listener's band against his | n/a |
| KS8 | ch18-ch22; ch20 | Study and lore intake (Sequences, origins, what to read) | feat/SHOWN: nine intents on creation myth, potion origins, Sequences, loss-of-control kinds (KJ3G); "what to read" and the diary pages (KJ3H, KJ3I) | b2 fill (knowledge, not fluency) | knowledge facts through `src/cast_inference_adapter.js` (holds facts, no band); study pace has no reader | ch22 "Starting Sequence": proposal: the lore band sets which rites and formulas he can follow when told | partial |
| KS9 | ch32 P029-P033 | Steadying against the whispers (hold one familiar object) | feat/SHOWN | Seq9 b1 fill | `src/book_world_lotm_be_seer.js` (`beSeerSteadyEffects`, fact `be.seer.stabilized`); reads a flag, not a band | ch32 P010 the drink itself is the turning point; steadying is what lets the pool exist at all | no (`actor:'player'`, be profile) |
| KS10 | ch32 P043-P054; ch55 P030 | Cogitation (recover spirituality; method: picture a sphere of light) | practice/SHOWN at first, method named at ch55 | Seq9 b1 at ch32, b2 at ch55 fill | `beSeerCogitateEffects` in the same file; B1 receipt: implemented below floor | ch55 P030: the method is learned after the first month of practice; proposal: recovery rate is the band's one number | no |
| KS11a | ch32 P061 | Spirit Vision, first aura colour | feat/SHOWN (dark-room exercise) | Seq9 b1 fill | none: `src/` has no Spirit Vision code (ARC2 N6); the closest analog is a pack encounter `lotm.rw8.5407.s1` read by `src/cast_ability_adapter.js` (content, no band) | ch33 P034 switch set | no (adapter lowers moves for the player actor) |
| KS11b | ch33 P034, P046 | Spirit Vision, personal switch (two taps on, two off) and exhaustion | feat/SHOWN | Seq9 b1 fill | none (backlog B3 queued; `condition.<id>` fact path exists) | ch37 P036 | no |
| KS11c | ch37 P036 | Spirit Vision in a crowd | failure/SHOWN: overwhelmed by the gloomy auras | Seq9 b1 fill (a failure under load, so no rise) | none | the failure is what makes the switch a control; proposal: crowd load lowers the effective band | no |
| KS11d | ch46 P017; ch48 P047; ch62 P008 | Spirit Vision, reading rooms and people | feat/SHOWN: a room's memory with two place names (ch46); a worry located in one body part (ch48); health and emotion colours, thin or dim aura (ARC2 N6, ch62) | Seq9 b2 fill | none | ch46 P017 clue feeds the missing-son search (ch43-46); this is the first time the faculty changes what he does | no |
| KS12 | ch44 P038; ch68 P052; ch84 P081 | Spiritual perception (objects and footsteps through walls; noticing another's sensing) | feat/SHOWN | Seq9 b2 fill | `src/cast_inference_adapter.js` can hold the facts (MECHANISM_GAPS M11, content-only); no skill read | ch44: used during the rescue approach; proposal: range band | no |
| KS13 | ch43 P089-ch44 P005 | Resisting a sleep song (Cogitation plus perception) | feat/SHOWN: partly resists | Seq9 b2 fill | none: the NPC-executed ability path is missing; counters need a held source (`cast_ability_adapter.js` player-only) | ch43 P089 Leonard recites the poem at the door | no |
| KS14 | ch43 P063; ch46 P073 | Dowsing rod seeking (cane plus clothes) | feat then failure: finds the building (P063); repeated failure, status obscured (P073) | Seq9 b2 when unobscured, fails when the status is obscured; fill | `src/lotm_divination_rows.js` (cane-dowsing failure row exists, no success row), spliced at `src/book_world_lotm_cast_host.js`; `src/book_world_lotm_div_supply.js` gates by means. Rows are fixed authored signals: they read means, not a band | ch43-46 search: success locates, failure is read as interference; the conditional band is the proposal | no (method gate reads the Tingen power, which he does not own, M16) |
| KS15 | ch54 P041; ch72 P049-P054; ch75 P043-P044; ch82 P064 | Pendulum divination (yes/no by direction, degree by swing speed, own matters) | feat/SHOWN and STATED rules: seven repetitions, clockwise yes, counterclockwise no (locators corrected per ARC2 M-C) | Seq9 b2 fill | pendulum row in `src/lotm_divination_rows.js` (free signal text, no graded field) | ch72 and ch75: used inside the 2-049 chain; proposal: degree is the band | no |
| KS16 | ch48 P020-P024; ch54 P041-P079; ch55 P067; ch62 P047 | Divination as a service (club listing, show, fee, tip) | STATED club rule: a newcomer is not promoted until the club confirms the skill, listed at two pence, club keeps an eighth (pack note, ch48); feat/SHOWN: the pendulum show wins a requester's favour (ch54) | b1 at ch48 (unconfirmed), b2 at ch54 fill | none: fee and favour write owner-needed facts (backlog B6; exchange kinds are purchase and wear) | ch54 P079: asks which method she wants; proposal: the club's confirmation is a recognizer, so the band can rise before the title (SLC115) | no |
| KS17 | ch63 P018 | Dream interpretation (a client's recurring dream) | feat/SHOWN (title "Dream Interpretation") | Seq9 b2 fill | dream row in `src/lotm_divination_rows.js` covers the surgery scene alone (ARC2 N4) | ch63: proposal: an interpreted dream is a spirituality reminder for the client | no |
| KS18 | ch33 P075; ch35 P033; ch36 P042; ch58 P018-P076; ch59 P009 | Gathering craft: calling seats, imprinting a line on another's page | feat/SHOWN. Route detail stays in the pack; sealed-truth rows are not restated | b2 fill | one remote session in the pack (`src/place_remote_presence.js`, placeholder seats); no skill read | ch35 P033 first imprint works; proposal: imprint success is a band check on the recipient side | partial (session data is seat-labelled, not actor-keyed) |
| KS19 | ch5 P066-P085; ch57 P022; ch60 P067; ch64 P011 | Ritual practice (structure: sacrifice, incantation, symbols; altar layout) | feat/SHOWN then STATED: first attempt at ch5 ends in an unintended contact; structure learned by ch57 (ARC2 N8); the leave-ritual altar of four candles, four foods and a silver knife at ch60 | b1 at ch5, b2 at ch57-60 fill | `src/lotm_rite_rows.js` (nine rite rows) is data; the act engine is unreachable from play (MECHANISM_GAPS F4, ARC2 R5) | ch57 P022: the ritual written as a format; ritual pain and the spirituality wall at ch58 P048 are the cost | n/a (rows unwired) |
| KS20 | ch57 P003 | Potion acting and digestion as method | STATED/INFERRED: acting as a method, digestion model (ARC2 N7) | Seq9 b1 fill | Tingen path exists (`actions.js` acted/undigested); the be seat has none (B1 omits acting) | Sequence 8 advancement is outside the saved reading; nothing after ch84 | no |
| KS21 | ch69 P014; ch83 P034-P045 | Amulet making (blade, incantation, metal; lasts about a year; wrong-faith risk) | feat/SHOWN at ch83 (title "Carving"; ARC2 N20) | b1 at ch69, b2 at ch83 fill | craft row in `src/lotm_craft_rows.js`, protection left pending, unreachable from play | ch83: the amulet's protection decays; proposal: potency decay is a dated delta | n/a |

Row count: 24 rows (KS1-KS21, with KS11 split into four dated rows). SN: no 13, n/a 9, partial 2, yes 0. No Klein row passes, because every row with a consumer is keyed to the player or the be profile; that is why section 5 matters.

## 4. Zorian (Mother of Learning), the loop lead

Saved sources used: MAGIC_SYSTEM and LOOP_INERTIA readers (`readers-2026-10-10`, ch1-108 by search, ch56-82 and ch90-106 in keyword windows only), R1 and R2
(institution tables for ch1-2 and ch6), the SYSTEMS_DEEP_DIVE, and the Cyoria host pack `src/world_packs/book_mol_pack.js`. The host is the independent
visitor world, not Zorian's own life: it holds a command `book.mol.zorian_talk` with Zorian as a person, so the consumer column maps skills to the
visitor's commands that a lead-life version would reuse. Every command found there carries `"actorId": "player"`.

Dating: the bands carry the book's own clock. Elapsed experience is over 4 years at Ch 38, nearly 6 at Ch 66, about 7 at Ch 82, nearly 8 at Ch 86
(LOOP_INERTIA); the body resets each month but soul-bound things persist (skills, memory, soul damage), which is the SLR20 carrier for these rows.
Canon turning points used: Ch 8 (Zach's reserve contest), Ch 22 (Taiven, the false magnitude), Ch 38 (the Rea scene), Ch 46 (the marker restart switch),
Ch 55 (the Threshold), Ch 84 (Powerless), Ch 92 (The Scramble).

| Row | Position | Skill | Evidence | Band | Consumer | At the nearest turning point | SN |
|---|---|---|---|---|---|---|---|
| ZS1 | Ch 2 c002 p172-p173; Ch 8 ¶51-¶57; Ch 22 ¶31, ¶62 | Reserve (missile casts; inborn magnitude) | feat: ran dry after eight shots in class (narration); STATED: 10 casts (Zorian), average student 8-12 (Kyron's booklet); claim: magnitude 12 told to Taiven, a lie against narration's 8 (Ch 22); contest: Zach spent three to four times Zorian's maximum in one class (Ch 2 c002 p173), and states his own maximum as 232 casts (Ch 8 ¶57) | 8 then 10 casts, magnitude 8 (feat and narration set it; the 12 claim sets nothing) | resource `book.mol.personalMana` on cast bodies and `book.mol.mana_assessment` ("assess your actual personal-mana compatibility") in `src/world_packs/book_mol_pack.js` | Ch 8: the contest with Zach places both on one scale (his stated 232 against Zorian's 10); Ch 22: the lie is logged as a claim and sets nothing | partial (resource is per body; commands are `actorId: "player"`) |
| ZS2 | Ch 7, Ch 12; Ch 38; Ch 46 ¶7-¶15 | Spell efficiency (magic missile casts per reserve) | practice: 10-11 casts early (Ch 7, 12), about 20 (Ch 38), about 35 (Ch 46, his own count, credited to efficiency not size); lifetime cap about four times the start, about 40 for him (Ch 8 ¶55, ¶59, INFERRED ratio) | 10 casts (to Ch 12), 20 (Ch 38), 35 (Ch 46), dated by elapsed years (about 4 at Ch 38) | `book.mol.personalMana` holds the pool; no efficiency discount is read by any host command id I found | Ch 46: low-power boundary refinement is the method (¶12-¶15); the marker restart at Ch 46 is the turning point, and efficiency, not size, carries across it | n/a |
| ZS3 | Ch 1 ¶181; Ch 2 ¶203-¶212; Ch 8-10 | Shaping: the basic three and 15 variations | STATED: two years to master levitation (Zorian, Ch 1, Ch 8 ¶173), mastery means flawless under thrown marbles (Xvim); feat: all 15 variations within a month via many loops (Ch 10 ¶19, ¶85) against about six a year for most students (Ch 8 ¶154-¶163); flame is his weakest of the three (Ch 11 ¶142) | basic three b2 (flame b1) at Ch 2; 15 variations b3 at Ch 10 | `book.mol.control_drill` (Xvim, brightness, key, occlusion control; claim `receipt.control_drill`) and `book.mol.formula_operator`; they grant a receipt, not a band | Ch 10: Ilsa tests his abilities; proposal: the variations feed a small cost discount to related spells (Ch 10 ¶105 textbook) | no (`actorId: "player"`) |
| ZS4 | Ch 8 ¶76-¶79; Ch 6 ¶191; Ch 23 ¶138-¶159 | Learning a spell by watching it cast once | feat/SHOWN: memorises a chant after one casting, seeing the mana move speeds learning (Ch 8); STATED: once chant and gesture are known about 80 percent is done (Ilsa, Ch 6) | b3 fill | `book.mol.study_invocation` (study invocation, shaping and physical aftermath) | Ch 23: teleport learned from Ilsa in an early restart; proposal: this skill is the pace dial on every later spell | no |
| ZS5 | Ch 11 ¶24-¶131 | Spell formulas: keyed lamp on a beginner's cube | feat/SHOWN: the set exercise (command words, three brightness levels, self-shutoff, owner key); STATED: a formula limits flow, it does not amplify (Nora) | b2 fill | `book.mol.study_formula`, `assemble_lamp`, `lamp_test`, `mastered_reading`; the visitor's lamp control is a trained row (`nora_formula` holds the same skill for Nora) | Ch 11 lesson; proposal: formula band sets how forgiving a tighter boundary is | partial (a non-lead row `book.mol.nora_formula` exists; commands are player-bound) |
| ZS6 | Ch 11 ¶151-¶153; Ch 50 ¶117-¶130; Ch 51 ¶7 | Mana sensing and raw manipulation | practice/STATED: marble exercise with a point system that stops at ten points (Ch 11); 20-plus sensing exercises, hours daily (Ch 50); rapid growth after one month under Xvim, credited as much to his guidance (Ch 51, SHOWN) | b1 at Ch 11, b3 at Ch 51 fill | none found among the host's command ids (`survey_lamp` is light control, not sensing) | Ch 49-53: Xvim's trust gate (a code phrase and a prediction list carry across restarts) opens the regime | n/a |
| ZS7 | Ch 9 ¶67-¶73; Ch 6 c006 p80, p87; Ch 13 ¶146 | Library divination and lock-feel (mana cloud) | STATED/narration: book-search divinations taught to long-term library workers, a couple of months to learn (Zorian's estimate); mana-cloud lock-picking takes months of practice (catalog row 64) | b1 fill | none: `book.mol.catalog_shift` is the library job, not the divination | Ch 13 ¶146: teaching depends on the learner earning trust | n/a |
| ZS8 | Ch 13 ¶116-¶123 | Mind shield (spell or ring; reflex trainable) | feat/SHOWN | b2 fill | none: no mind-magic command in the host | Ch 17-21: the contact with the spiders makes the shield matter | n/a |
| ZS9 | Ch 21 ¶38-¶41; Ch 35 ¶24; Ch 36 ¶140-¶149; Ch 37 ¶6; Ch 63 ¶212 | Mind sense, empathy, telepathy, memory reading (the Open gift) | practice/SHOWN: mind sense first, then a mental shell, then attacks and memory work; memory manipulation withheld until a full memory probe; diminishing returns ("low-hanging fruit picked", Ch 63); range halved by shaping static (Ch 35) | b2 at Ch 21, b3 at Ch 37, plateau b3 at Ch 63 fill | none | Ch 90: an offered exit that needs him to damage Zach's mind makes the skill the lever; proposal: the plateau is a dated delta of zero, not a cap | n/a |
| ZS10 | Ch 22 ¶49-¶53; Ch 45 ¶87, ¶102 | Combat spell breadth (fire, survival spells) | feat/SHOWN: casts fireball twice on a 10-cast reserve; combat notebooks from Taiven | b2 fill | `book.mol.taiven_combat` and `hatch_encounter` read Taiven's trained row; no row for Zorian | Ch 22: Taiven teaches breadth before depth; proposal: breadth is a separate band from reserve | partial (Taiven's row is a non-lead trained row) |
| ZS11 | Ch 23 ¶138-¶159; Ch 26 ¶283-¶289 | Teleport | feat/SHOWN: learned in an early restart; needs a visited place, risky near wells and wards, about half an hour to be safe after | b2 fill | none: the host has arrival and route reads, no teleport command | Ch 26: used as an escape; proposal: the safe-after interval is the cost the band lowers | n/a |
| ZS12 | Ch 30 ¶16-¶98; Ch 41 ¶114 | Ward breaking (siphon, break, bypass) and recall | feat/SHOWN: contract job with Gurey; recall spell with a running cost per anchor | b2 fill | none | Ch 30: bypass is preferred and needs analysis, not power | n/a |
| ZS13 | Ch 32 ¶66-¶99; Ch 74 ¶117-¶125; Ch 76 ¶81; Ch 83 ¶14 | Soul perception (months of meditation and a weekly potion; later a potion or ring) | practice/SHOWN: daily attendance with Alanic; the near-death potion; the ring skips the lethal unlock | b1 at Ch 32, b3 at Ch 76 fill | none | Ch 76 ¶81: soul forensic spells need it; carrier is the soul, so it persists across restarts (SLR20) | n/a |
| ZS14 | Ch 34-35 | Route planning and place knowledge (crystal harvesting route) | feat/SHOWN: plans at Ch 34, executes at Ch 35; selling the crystals draws unwelcome attention (Ch 35 ¶30-¶31) | b3 fill | none: the host's `survey_ordinary` and `survey_lamp` are the nearest reads of a place | Ch 35: a routine map that repeats until nudged (LOOP_INERTIA weak-inertia setting) is what the skill reads | n/a |
| ZS15 | Ch 49; Ch 53; Ch 72 | Convincing and briefing allies each restart | feat/SHOWN: a prediction list proves the loop to Xvim; briefs Kael fast each month; Taiven needs about half a restart (STATED Ch 72) | b3 fill | none: LSD383 (tells) is a design line; briefing carriers (notebook, code phrase) are the mechanism | Ch 49-53: the code phrase is the carrier; proposal: the band sets how many predictions it takes | n/a |
| ZS16 | Ch 50 ¶131; Ch 56 ¶110 | Dimensional boundary (rock, statue, live insect) | practice/SHOWN: the primitive of all time and space magic | b1 at Ch 50, b2 at Ch 56 fill | none | Ch 55: the Threshold needs time and space work; text beyond keyword windows is not read | n/a |
| ZS17 | Ch 62 ¶176-¶188; Ch 64 ¶16; Ch 92 ¶12-¶25 | Simulacrum | feat/SHOWN: learned at Ch 62; three to four copies before regeneration goes negative | b2 fill | none | Ch 92: a mage with damaged mana stability needs a simulacrum's attention to hold reserves | n/a |
| ZS18 | Ch 62 ¶29-¶67; Ch 89 ¶79-¶96 | Blood magic and enhancement knowledge | STATED (Zorian): permanent cost 10 to 50 percent of maximum reserves; SHOWN at Ch 89: a toad ability at about eight percent (subject not stated in the saved reader) | b2 fill (knowledge) | none | Ch 89 ¶96: the cost figure is the check | n/a |
| ZS19 | Ch 84 ¶15; Ch 92 ¶12-¶15 | Casting after a soul wound | failure/SHOWN: cannot cast at all, drills cause pain and nausea, three to five months estimated | b0 for casting, understanding kept (dated drop with cause) | `src/skill_records.js` rust is a derived, reversible penalty that leaves the peak untouched and is off by default (SLR10); an injury is a different cause (SLR42), so no rust is borrowed | Ch 84 Powerless to Ch 92 The Scramble; proposal: log the drop as a cause-dated delta (LSD301) | n/a (no reader for this row; the generic store has no seat field) |

Row count: 19 rows (ZS1-ZS19). SN: yes 0, partial 3, no 2, n/a 14. No Zorian row passes either.

## 5. Non-lead rows that show the shape reads the same (SLC114)

A check that reads the table needs a second holder. These are rows already in the saved material; none is added here, they only prove (c) of the SN check.

| Holder | Skill and position | Source | What it shows |
|---|---|---|---|
| Old Neil | brewing the Seer dose (ch31 P047); portrait ritual (ch46 P061); IOU-burning ritual (ch51 P084) | seams, MECHANISM_GAPS M1, M12, M18 | the ritual and brewing rows are about a cast person, not the lead; the act engine is unwired for all of them |
| Leonard Mitchell | the sleep song (ch43 P089) | seams | an NPC ability the adapter cannot run (player-only), so the SN gap is in the adapter, not the content |
| Nora Boole | formula anchoring | host command `book.mol.nora_formula` | a trained row for a non-lead exists in code |
| Taiven | combat breadth | host command `book.mol.taiven_combat` | same |
| Xvim | the mastery standard (flawless under thrown marbles) | MAGIC_SYSTEM Ch 2 ¶203-¶212 | a stated band definition that any holder could be tested against |

## 6. What the tables say (findings)

- **F1.** Neither lead has a saved skill value anywhere. Klein's pack says so in its note strings, and Zorian's host stores the reserve as a per-body resource, not as a band. The first consumer for any band is therefore the C2 fit (LSD287) plus one reader per row.
- **F2.** Rows with a consumer read a *source, resource, fact or recipe*; I found none that reads a band. Spirit Vision, firearm and the language skills have no owner at all (B3, B8, N6). Writing a band before a reader exists breaks the file's own FLR4 test, so the table is a design input, not a build list.
- **F3.** No row passes the SN check on either lead (Klein 0 yes of 24, Zorian 0 of 19), for one shared reason: commands and adapters are keyed to a literal player or be profile. The cheapest fix named in the saved material is in the adapters (player-only move lowering), not in content.
- **F4.** Rows for non-lead holders already exist in the saved material (section 5), so the row shape can be tested with a non-lead fixture before any lead consumer is built (LSD226, join 3 in the guide).
- **F5.** A canon turning point usually uses a skill as a *cost or a read*, not as a roll: Klein's room-memory clue (ch46), the Hermes gap (ch57), Zorian's efficiency across the marker restart (Ch 46), the soul wound (Ch 84). That points to bands as inputs to existing checks (price, gate, cost), which agrees with AD38 (mechanisms, not allowed-outcome lists).

## 7. Sealed-secret handling

The Klein pack's sealed-truth rows are not read or restated here; KS18 and KS19 give chapters and visible actions only. What I searched, and what I found:

- `docs/worlds/WORLD_SECRETS_AND_DISCOVERY.md` for its record format: original worlds keep sealed notes under `docs/worlds/<world>/sealed/`, franchise worlds keep them in the private pack, and secrets are cited as ids such as "S2" with a route.
- `docs/worlds/mother-of-learning/` (two files), `docs/worlds/MOTHER_OF_LEARNING_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md`, `docs/worlds/LORD_OF_THE_MYSTERIES_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md` and `docs/worlds/LOTM_SEER_SLICE_LAWS_2026-10-19.md`, by the words sealed and secret. The hits I read were sealed *items* (a church artifact grade, a certification scroll) or the phrase "no sealed truth" in a method note; none is a secret id.
- No `sealed/` folder exists for either world under `docs/worlds`, and `private_packs/lotm-cast/cast.json` uses "sealed" for 61 item and place strings (for example a sealed box), not for secret ids.

Result: no LOTM or MoL secret id was found in the places the standing rule points to, so there is no id to cite. The pack's private sealed-truth rows (if any) were not opened. Rows that name a gathering or a ritual rest on public chapter content and the repo's own backlog wording. The late-book MoL exit mechanics (Ch 85-106) are public premises and are left out of the cells.

## 7a. Defaults, dials and reasons for the repeated proposals

| Proposal | Default | Dial | Reason |
|---|---|---|---|
| Rung scale b0-b4 | five rungs, glossed per world; a world may swap them for its own unit (MoL keeps missile casts) | rung count and names per world | WA33 puts bands in the world's own scale; five rungs are the fewest that separate novice, working, skilled and master without false precision (LSD434) |
| Conditional bands (KS14) | a band carries the condition it holds under ("b2 when unobscured") when the text shows a success and a failure on the same skill | whether a world models the condition at all | one number would hide that the same skill both succeeded and failed in the book; a condition is the cheapest honest form (AD38) |
| Evidence-to-band fit | claims set a prior, feats a floor, contests a ranking, practice a dated delta | which kinds a world trusts (a lying narrator can be dropped) | LSD287 asks for one tool; saving causes and deriving values keeps reloads equal (LSD301) |
| Seat-neutral check | three tests on the table: no lead field, an actor-keyed consumer, a non-lead sample row | strictness (a row with no consumer is n/a, not a pass) | SLC114: a lead-only table drifts from the one other people use |
| Bands as inputs to existing checks (F5) | a skill band feeds a price, gate, cost or read that already exists | a world may add a new check once two consumers need it | AD38 and FND5: model mechanisms, grow the DSL on a second consumer |

## 8. Checks run

| Check | Result |
|---|---|
| `ls` on 17 cited src, docs and private paths | all exist |
| Style sweep by script: em dash, en dash, spaced double hyphen, the decision-status word, and the absolute words the slip lint targets | 0 of each in this file before this row was written |
| `node scripts/check_doc_slips.mjs`, lines for this file | first run flagged 10 lines (the word "only" with no default, dial or reason); those lines were reworded and the rerun count is 0 (see the report) |
| Sealed-secret search | section 7 lists the files searched; no LOTM or MoL secret id found |
| Consumer cells | `book_world_lotm_be_seer.js` read; `book_mol_pack.js` command ids extracted by script; Klein pack searched for "skill" (8 strings, all "no skill awarded" notes or other people); other cells cite the saved gap probes, which are read-only code readings with "unverified" marks |
| Locator corrections from ARC2 (M-A to M-E) | M-A (ch66 income) and M-C (pendulum) applied; M-B, M-D, M-E touch no row |
| Bands, SN and turning-point text | hand placed proposals; no fit, test or code run |

## 9. Gaps list

| Gap | Why |
|---|---|
| Klein ch1-3 and ch6-8, ch12-17 skill content | Chapter text for ch1-3 is saved (first-arc folder) but was not read in this pass; ch6-8 appear through KJ2 scene notes alone; ch12-17 as titles and the examination receipt alone; no skill evidence was extracted |
| Klein ch19-22, ch29-31 skill content | Read through receipts alone (KJ3G-KJ3J, KJ3M, KJ3O); no skill-specific paragraphs checked |
| Klein ch85 onward, Sequence 8 advancement, combat (ch73 First Battle is a chapter title, nothing more) | Nothing saved beyond ch84; the first fight and the advancement are exactly the turning points a skill table most needs |
| Klein edition numbering | KJ2 and KJ3A cite the Webnovel compilation (`2c8e3803`), later receipts the official edition (`395c9d9f`); chapter numbers were not re-verified against both |
| Zorian ch56-82 and ch90-106 | The reader covered them by keyword windows alone; ZS16, ZS17 and ZS18 rest on those windows |
| Zorian alchemy, golemancy, summoning, and non-spell skills (social standing, money) | Not extracted as rows; the reader has them as catalogue entries, not as Zorian's own band over time |
| Zorian own-life consumers | The host is the independent visitor world; there is no lead-life Zorian command set, so consumer cells name the visitor's reusable commands |
| Locator schemes for Zorian | 0-based reader paragraphs and 1-based window ids are not reconciled; locators prove the chapter and neighbourhood |
| Harry (and the other worlds: D&D, Worm, etc.) | The saved HP material is craft-scene windows (B1 ch8, B3 ch7, B5 ch12, B6 ch9, B6 ch12) and a plan for an opt-in student life; a Harry skill timeline would be fill. The guide's own ranking is unstated, so this is one reading (section 1) |
| Band numbers | No evidence-to-band fit exists (LSD287 not built); every band is `fill`. A calibration against canon contests (LSD285) is the first thing that would replace them |
| Consumers cited from probes | Several Klein consumer cells (cast adapters, rite and craft rows) are taken from the saved gap probes, which are read-only code readings with "unverified" marks; they were not re-grepped |
| A seat-neutral check as code | Described in section 2, not implemented |
