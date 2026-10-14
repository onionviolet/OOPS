# TW-T: research and technology evidence extensions

2026-10-14. Proposal review only. Round 11's `docs/gm/dispatch/research-tech-2026-10-14/NEXT_SLICE_PROMPT.md` remains the next build step and is unchanged. No code, save, build, browser, commit or merge work was performed.

Evidence vocabulary: **SHOWN** means this lane read the cited YAIR source. **STATED** means a cited dossier reports static source/data or documentation; its own SHOWN/STATED distinction is retained below. **INFERRED** marks this lane's proposed transfer or mapping. No game was launched and no current server balance was checked. Source IDs and section codes are citations to the local evidence, not fresh native proof.

## Corrections first

| Code | Evidence and correction | Existing row extended and owner | Disposition and done check |
|---|---|---|---|
| TW-T01 | **STATED:** HoI4 `RESEARCH_DIGEST.md`, H-R2 documents this install's XP-bought grand doctrines, selected subdoctrines and mastery tracks; H-R3 shows tech-unlocked chassis/modules. RW2 joins two different mechanisms. Split its explanation into learned/active doctrine policy and unlocked design capability. Persistent equipment effects can survive doctrine changes while activation bonuses retract. The dossier explicitly leaves a reward-unlock TODO unresolved. | RW2, TG2/TG10, PP and OM7 in `docs/TECHNOLOGY_AND_PROGRESSION.md`; design capability under planner/content owners, selected practice under `docs/worlds/SKILL_MECHANISMS_AND_MEANS_2026-10-13.md`. | **ACT NOW for root**, doc fold only. Done: RW2 cites H-R2/H-R3 separately and does not describe doctrine mastery as an ordinary technology timer or verified reward formula. |
| TW-T02 | **STATED:** `docs/research/cividle/REPORT.md`, F2 says age is derived from the furthest unlocked tech column. HoI4 `RESEARCH_DIGEST.md`, H-R1 shows start years and an ahead-of-time penalty, not a single era-unlock ladder. RW10's per-world dial is a valid proposal, but these sources do not establish the same kind of age gate. | RW10, TS3/TS4 and OM9 in technology root. | **ACT NOW for root**, doc fold only. Done: separate derived era, soft early cost and authored hard prerequisites; never infer one from another. |
| TW-T03 | **STATED:** Discworld `pass-2026-10-14/REPORT.md`, opening and P1/F3 distinguish historical taskmaster code from current help. Useful queued work is the dossier's YAIR adaptation, not proof of native queued idle research. | RW6, RV4/RV6 in technology root; routine-practice row in skill-mechanisms owner. | **ACT NOW for root**, qualify evidence. Done: RW6 names historical shown mechanism, current stated help and inferred queue adaptation; no claim that old code proves failure learning. |
| TW-T04 | **STATED:** the numbered round-9 order at technology root lines 1538-1551 places planner at 4, revealer at 5 and diffusion later; round-11 CN14 instead names anomaly store, teaching, glass roadmap plus RC2 and diffusion as steps 2-5. They disagree. | CN14 and the older numbered order, technology root. | **ACT NOW for root**, reconcile numbering without editing/reopening NEXT_SLICE_PROMPT. This lane uses the later CN14 sequence below. Done: root records one crosswalk so a step number cannot silently authorize a different slice. |
| TW-T05 | **SHOWN:** `src/simulation_effects.js:282-286` already writes actor knowledge with stage/value/time/cause and optional basis. It overwrites an equal/higher stage and refuses a lower stage. `src/simulation_contracts.js:249` validates three stages. `src/people_knowledge.js:12-15` reads actor knowledge; `src/adventure_notebook.js:10` currently names Here/Practice/People. A notebook router is not an evidence store, but IM2's older “no existing owner” wording misses this live seam. | IM2, OM1-OM3 and RW5, technology root; `docs/emergent/E7_OBSERVATION_AND_MYSTERY.md`, `docs/ENGINE_EXPANSION.md`. | **ACT NOW for root**, update seam description. **ACCOUNT FOR NOW** at step 2: extend or adapt existing actor records rather than create a rival store. Done: specify belief revision/history and old-save defaults without claiming the current forward-only stage rule implements correction or independent evidence. |

## Build-order key

**STATED:** round-11 CN14 plus CN1/CN3-CN9 in technology root and the existing NEXT_SLICE_PROMPT supply the sequence. **INFERRED:** use this crosswalk for this lane, pending TW-T04's root wording fix.

| Step | Existing slice | How this review may affect it |
|---|---|---|
| 1 | U40 craft cue plus N19 Village sentence | Unchanged next prompt. No additions, new save field or new payoff from this lane. |
| 2 | One anomaly question plus evidence store | Source identities, beliefs, correction and one useful consumer. |
| 3 | Teach one operative cue | Ordinary-action riders and real learner/use receipts, with world-fitting support. |
| 4 | Glass roadmap plus RC2 | Known roadmap and explicitly granted truth view; no planner execution claim. |
| 5 | One diffusion consequence | One local transmission and useful recipient outcome, after earlier acceptance. |
| LATER | Larger projects, schools, world state, technique execution | Separate scoped work; no new gate for step 1. |

Every extension below is **INFERRED** as YAIR design. Same rules apply to NPCs and player; Default + Dial + Reasonably, fitting alternate routes and repeated improvement remain available. No fixed lifetime study cap, universal research currency, mandatory survival chore or new prestige layer follows from these games.

## RW1-RW10 reconciliation

All technology codes in this table refer to `docs/TECHNOLOGY_AND_PROGRESSION.md`, not new parallel rows. “Account” means retain the constraint for its named future slice; it does not authorize its build now.

| Code / root row | Source and angle | Existing row extended / owner | Step, disposition, suggested executor and done check |
|---|---|---|---|
| TW-T06 / RW1 | **STATED:** HoI4 `RESEARCH_DIGEST.md`, H-R1 reports shown start-year/cost fields, saved-slot points and scoped limited-use bonuses. Exact native discount ordering and completion-time integration are unread. Extend early research with a visible local cost reason and saved bonus eligibility/consumption; preview spends nothing. | TG2/TG3, TS4, PM4, OM8; technology root and engine transaction owner. | **ACCOUNT FOR NOW**, step 4 cost explanation; actual timed bonuses **LATER**, balanced executor, high effort for transaction boundary. Done: early attempt is permitted where world rules allow, preview does not spend, committed bonus cannot duplicate after reload/import; no invented exact HoI4 formula. |
| TW-T07 / RW2 | **STATED:** HoI4 H-R3/H-R4 distinguishes archetype, version, module slots, formation templates, production and fielded equipment. Tech opens a capability rather than a stocked or equipped object. Apply TW-T01's doctrine correction. | CT3, TG3/TG4, OM7, planner PI/PP; chain owner `docs/MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md`, HV2 M1 role crosswalk. | **ACCOUNT FOR NOW**, step 4. Balanced executor, medium effort. Done: one roadmap names design unlock, built intermediary and real use separately; preview neither manufactures stock nor equips an actor. Doctrine switching remains **LATER**. |
| TW-T08 / RW3 | **STATED:** Academagia `decompile-2026-10-14/ROLLS_AND_EXAMS.md`, R1/R3/R4 separates research substitution, competence, study preparation and recorded exam scores; `CLASS_TABLES.md`, dated class records shows a saved initialized curriculum. PNP grades use competence independently of drawn scores. | TK3/TK5, TG7, SC1/SC2, OM3; skills owner and school-world/engine owners named by Academagia decompile REPORT P1. | **ACCOUNT FOR NOW**, step 3: being taught or prepared is not demonstrated use. Term curricula/assessment **LATER**, balanced executor, high effort. Done: lesson receipt and useful action differ from exam record; saved calendar/result cannot reroll on reopening; old saves gain no forced enrollment. |
| TW-T09 / RW4 | **STATED:** Taiwu `pass-2026-10-14-deep/STUDY_AND_FORCE_DIGEST.md`, S1-S3 separates physical pages, effective references, reading progress, comprehension, breakthrough readiness and chosen mastery. Better reference condition does not repair the original copy; readiness is not realm advancement or universal casting refusal. | RU2, RB2/RB5, TK and SC1; technology root and `docs/SKILLS_AND_TALENTS.md` manual/copy means. | **ACCOUNT FOR NOW**, steps 2-3 evidence/teaching meaning. Full manuals **LATER**, balanced executor, high effort. Done: partial reading is useful, a reference improves access without altering custody/physical condition, and a learned function has a real consumer; reload/import preserve each affected state. |
| TW-T10 / RW5 | **STATED:** Heaven's Vault `KNOWLEDGE.md`, F1-F3 reports guesses, known state, actual correctness, rejected candidates and inscription provenance separately. Related-word retrieval can include seen/unconfirmed words. Same inscription cannot supply that confirmation assessment repeatedly, but this is not a claim all counters deduplicate. | RU3/RU4, RB8, OM1-OM3 and RQ1; observation/mystery owner, existing notebook and actor knowledge seams in TW-T05. | **ACCOUNT FOR NOW**, step 2, balanced executor, high effort. Done: revisiting one specimen can still practice but cannot masquerade as independent confirmation; correction retains old evidence, changes one useful action and survives save/reload/import; UI reveals only actor-known facts. |
| TW-T11 / RW6 | **STATED:** Discworld `pass-2026-10-14/SKILL_GROWTH.md`, F15 shows difficulty/category/skill effects; REPORT P1 proposes useful queued challenge-band work and alternate lessons. Extend ordinary action riders without forcing manual variety. | RV4/RV6, TG7; `docs/worlds/SKILL_MECHANISMS_AND_MEANS_2026-10-13.md`, routine-practice row. | **ACCOUNT FOR NOW**, step 3. Balanced executor, medium effort. Done: matched easy/challenging/mastered queued work has useful output and causal learning differences with named plateau relief; no compulsory clicking or imported global teaching ceiling. Source-version correction is TW-T03. |
| TW-T12 / RW7 | **STATED:** KoL `pass-2026-10-14/REPORT.md`, P2 reports Journeyman reuse of 180 skills across 1,080 class/location/slot mappings; `SHARED_GRAMMAR.md`, G1 identifies stable skill IDs. This is client representation plus stated game rules, not server code proof. | TN1/TN2, RQ and OM2; `docs/RESEARCH_LITRPG_SYSTEMS.md`, skills and engine content owners. | **ACCOUNT FOR NOW**, step 3 acquisition by lesson/discovery. Balanced executor, medium effort. Done: two fitting acquisition routes resolve the same existing skill ID and consumer; no second XP ledger, duplicated skill identity or false claim that metadata proves live availability. |
| TW-T13 / RW8 | **STATED:** Immortality Idle `pass-2026-10-14/COMBAT_AND_TECHNIQUES.md`, F11 shows generated moves, focus/refinement, archive/relearn and saved library fields, with a partial-debit hazard not to copy. Path `CONTENT_AUTHORING_DIGEST.md`, “Techniques do more than multiply power” shows fixed node effects, purchased vs active state and respec; “Generated manuals” is a separate item mechanism. History/refinement must be attributed to the correct source. | PP1/PP5, OM4/OM7; X9 in modular chain owner, `docs/worlds/ABILITY_AUTHORING.md`, skill/power owners. | **LATER**, balanced executor, high effort with strong review of transaction/effect seams. Step 4 can show prerequisites only. Done: one world-valid technique changes real execution, shared effect data explains it, cost failure leaves state unchanged and archive/relearn/save/import retain exact history; planner alone is not a technique compiler. |
| TW-T14 / RW9 | **STATED:** Prestige Tree community `pass-2026-10-14/REPORT.md`, P2/F3/F10 describes named transforms/descriptions and earned softcap relief. This supports explaining the governing effect, not adding anti-abuse caps. | RD1/RD2, RV6, PM4; technology root, `docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md` and live balance owner. | **ACCOUNT FOR NOW**, step 4 roadmap stall reason. More progress formulas **LATER**, balanced executor, medium effort. Done: explanation reads the same known balance record as the effect and names reachable relief; absence of knowledge does not leak a sealed threshold. No expansion of step 1. |
| TW-T15 / RW10 | **STATED:** CivIdle REPORT F2/F3 derives ages and checks input unlocks against consumers. HoI4 H-R1 exposes soft time pressure and actual tech paths. Treat era as presentation/world policy, not universal truth or prerequisite substitute. | TS3/TS4, TG11, OM9, PI7a; technology root and world pack owners. | **ACCOUNT FOR NOW**, step 4 per-world pack lint; world-wide era state **LATER**, balanced executor, medium effort. Done: pack distinguishes derived label, local cost and true prerequisite, supports fitting exceptions and rejects consumers whose required input route is unavailable. |

## Missed systems from the aspect inventories

These extend the rows above rather than add duplicate root systems.

### TW-T16: Experiment phases retain different kinds of work

**Source, STATED:** HoI4 `aspects-2026-10-14/SYSTEM_INVENTORY.md`, special-project entries; `DEEPER_SYSTEMS.md`, D1. Shipped project docs say setup restarts on cancellation, initial research remembers partial work and completed discovery, and prototypes retain progress across iterations. Static land-project data unlocks modules/subunits; completion does not supply stock. Old project design docs and current reward min/max prose disagree, so they cannot establish boundary formulas or native cancellation persistence.

**Angle, INFERRED:** give the existing experiment a phase-specific cancellation contract: current setup/reservation, earned finding, selected iteration result and usable recipe are different state. Extend RV1/RV2/RV5, PM1/PM3, IM2 and OM7 in technology root, plus existing making/action transactions under the modular chains and engine owners.

**Disposition:** **ACCOUNT FOR NOW** at step 2: an evidence receipt is earned information, not proof an experiment was completed. Actual project runner **LATER**, balanced executor, high effort, strong review if reservations cross owners. **Done:** paid original workshop experiment, cancellation in each relevant phase, retained earned learning, useful downstream output and exact save/reload/import. No universal research slots or once-per-account restriction.

### TW-T17: Investigations yield information separately from exit rewards

**Source, STATED:** Academagia aspect inventory names StorySystem, ResearchSystem and InformationSystem; the completed `pass-2026-10-14-adventures/ADVENTURE_GRAMMAR.md`, A2/A3 shows remembered successful investigations, failed checks that may disclose the checked skill, benefit thresholds distinct from exit success, and failure links with consequences. Its pending-date calculation does not consume duration as an end-window length in the traced method. No native branch was played.

**Angle, INFERRED:** a research encounter can grant evidence without granting the exit's whole reward or closing the question. Same next stage on success/failure can still carry different receipts. Extend RQ3, RU6, SH1/SH3, OM3 in technology root; scene/decision execution belongs to `docs/DIALOGUE_AND_INTERACTIONS.md` and engine owners.

**Disposition:** **ACCOUNT FOR NOW**, step 2. Balanced executor, medium effort; timed follow-ups **LATER**, high effort. **Done:** one investigation yields a specific observation, failure has a useful supported lead, exit reward requires its own successful cause, repeated inspection cannot duplicate that reward and reload/import retain pending decisions. No copied duration formula or global once-only adventure rule.

### TW-T18: Study batches and reference copies have their own boundaries

**Source, STATED:** Taiwu `aspects-2026-10-14/SYSTEM_INVENTORY.md`, CombatSkill/Taiwu/Item families, joined to deep `STUDY_AND_FORCE_DIGEST.md`, S1/S2. Active reading settles work at batch thresholds; monthly change preserves a remainder. Costs occur before the cap guard in the traced backend, while frontend cap protection remains unread. Reference books can improve effective page condition without physical repair.

**Angle, INFERRED:** queue settlement should name partial work, settled learning and physical copy/reference support independently. Extend TW-T09, RV1/RV2 and RU2, not a second study system. Owners: skill-means/manuals, engine jobs/custody and technology IM2.

**Disposition:** full reading jobs **LATER**, balanced executor, high effort. Step 3 may account for a lesson's unfinished vs earned work only when that slice needs it. **Done:** boundary checks before charging, pause/cancel without duplicate debit, repeat improvement with alternate copies or teachers, missing references give a clear reason, and exact remainder/custody survives import. Do not copy Taiwu's 30-progress cap or report cap-loss as a played bug.

### TW-T19: Notebook retrieval returns evidence, not the answer

**Source, STATED:** Heaven's Vault aspect inventory's evidence/knowledge and translation rows; `KNOWLEDGE.md`, F1/F2 reports root-based similarity ranking, diversified overlap and provenance. Seen and unconfirmed candidates are eligible. A short ranked comparison is not proof of equivalence or calibrated probability.

**Angle, INFERRED:** extend RB8 and RU3 with a related-evidence view for the one anomaly: source, observed overlap and contradictory candidate. Reuse the notebook and actor knowledge projection in TW-T05, with observation/mystery and technology IM2 as owners.

**Disposition:** **ACCOUNT FOR NOW**, step 2, balanced executor, medium effort. **Done:** related known observations appear beside a question on rebuilt 1366x768 desktop, uncertain matches stay marked, contrary evidence can revise the belief, and no unseen truth is used to rank ordinary hints. The cheat path at step 4 remains a separately granted means.

### TW-T20: Help knows which research interaction was learned

**Source, STATED:** Heaven's Vault `aspects-2026-10-14/DEEPER_SYSTEMS.md`, D3 describes saved per-interaction tutorial counters/learned flags, separate from reading/input pace settings. Exact visible help sequence and tuning were not exercised.

**Angle, INFERRED:** extend SH2/SH4, MU4 and OM10 with optional recall for comparison, correction and source inspection. UI familiarity is neither research knowledge nor actor competence. Owner: information-design document, with gameplay facts remaining under IM2/skills.

**Disposition:** **LATER**, balanced executor, medium effort. **Done:** one hint supports zero practice, first use and learned state, survives reload/import and can be recalled; turning help off changes no learning rate, action eligibility or saved world truth. No mandatory tutorial or finite retry limit.

### TW-T21: Knowledge transmission keeps occurrence and source separate

**Source, STATED:** Taiwu aspect `DEEPER_SYSTEMS.md`, D1 distinguishes occurrence, sourced information instance, holder and reception. Alternate source route retains occurrence identity; exact/same-occurrence checks avoid duplicate reception. Reception/social effects depend on the recipient, source and relations; exhaustive effects and reveal exceptions remain unread.

**Angle, INFERRED:** extend TW1, RP1/RP5, OM2/OM3 and CN14 with one attributed research result reaching a recipient who can use it. A rumor repeated through two holders is not two independent experiments. Owner: `docs/CHARACTERS_AND_WORLD_EVENTS.md`, engine knowledge channels and technology world-state/diffusion owners.

**Disposition:** **ACCOUNT FOR NOW** at step 2: preserve event vs source IDs if the chosen evidence needs them. Transmission consumer at **step 5**, balanced executor, high effort. **Done:** recipient gains only delivered knowledge, source credit and useful use are distinct, uninformed NPC stays uninformed, two retellings do not double-confirm, and save/reload/import preserve the receipt. Reveal sealed IDs only through their discovery route.

### TW-T22: A book's custody and a reader's learning can diverge

**Source, STATED:** Taiwu aspect `DEEPER_SYSTEMS.md`, D2 reports library pool selection, item custody exchange, staged settlement and close/reconcile as separate boundaries. Atomic/crash-safe trade and full frontend valuation are not established.

**Angle, INFERRED:** extend RB5/RB7, RU2 and TW-T09: institutional access, holding a copy, owning it and knowing its contents differ. Return/sale should not silently erase earned learning. Owners: engine item/custody transactions and skills manuals; do not add a second library inventory.

**Disposition:** **LATER**, balanced executor, high effort. **Done:** one physical-copy transaction changes the correct owner/holder/library stock, preserves legitimately learned content, rejects stale settlement without partial changes and roundtrips through import. Alternate acquisition remains reachable; no required trader or new mandatory chore.

## Top five picks, ranked

1. **TW-T05:** correct the live knowledge seam now, then use it for step 2's belief revision. It prevents a duplicate store and an unsupported correction claim.
2. **TW-T04:** reconcile step numbers now. Preserve the already-scoped step-1 prompt exactly.
3. **TW-T10 + TW-T19:** source-backed comparison and revision for the single anomaly, with useful repeated practice separated from independent confirmation.
4. **TW-T17:** make the investigation evidence receipt distinct from its exit reward, so an inconclusive result can still teach something useful.
5. **TW-T21:** carry those same evidence identities into one local diffusion-to-use consequence at step 5, after prior slice acceptance.
