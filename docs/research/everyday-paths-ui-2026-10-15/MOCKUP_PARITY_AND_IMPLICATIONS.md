# Everyday paths: mockups, parity and better design studies

2026-10-15. User requested mockups for fishing/farming/mining, then deeper implications, UI parity, other places/menus, potions, future cheat menus and improving the design studios. **Design-only artifacts.** [Standalone viewer](mockups/index.html), [mining source/proposal](MINING_FLOW_AND_PATH_PROPOSAL.md), [fishing](FISHING_PATH_PROPOSAL.md), [farming](FARMING_PATH_PROPOSAL.md), [area model](LAND_AREA_AND_INVOLVEMENT_UI.md). No production code, layout owner, gameplay, save, library, installation or accepted product direction changed.

## MS1. What the viewer actually does

The HTML runs independently, uses fixed fictional fixtures in memory, makes no network requests itself, imports no game modules and reads/writes no game storage. View buttons inspect scenarios; preview buttons explain proposals rather than executing work. Current work stays the same across involvement views within a pursuit. It contains three pursuit studies, a simplified source-backed current-mining comparison, potion and fictional cheat-menu studies, and adjacent-menu reference cards. These are not fully simulated features.

The initial four view controls compare personal/routine/investigation/delegation. They are **studio controls**, not a proposal to put the same four tabs in every game menu. Potions use ingredient/process/experiment/work-order labels. The fictional ability uses known-faculty/applications/study/scope labels. A final game surface may expose only the controls useful for that life and actual means.

Fixtures: six4 m² beds in a48 m² holding;12 m² selected water-care scope; named river reaches and an eddy target; exposed mining face with a sensing target and proposed collection route; actual stock/held-stock concepts for a potion; known versus inferred ability evidence. All names, quantities, powers and helpers are examples. There is no claim that these capabilities are currently available. The current MG06 one-plot model is preserved in the written comparison and has not acquired area or passive growth.

## MS2. Stronger ideas from the first visual pass

| Code | Improvement | Practical implication |
|---|---|---|
| I1 | Keep purpose visible with the current place, method and actual executor. | “A useful meal,” “retain a sample,” “supply this recipe” or simply “spend time here” can guide actions without becoming compulsory quests or a universal production target. |
| I2 | Make a comparison explain what actually changes. | Show selected method/means, known cost and useful consequence together. A stronger power can remove an ordinary requirement; do not preserve chores through invented costs. Unknown consequences are uncertain, not a guaranteed preview. |
| I3 | Distinguish target, footprint, coverage and delivery. | A bed's area, irrigation targets, operator's reach and output destination are different. Mining face area is not reserve volume; sensing scope is not extraction scope. A selected overlay answers one question at a time. |
| I4 | Summarize equivalent work, preserve meaningful exceptions. | A large routine garden can group crops; one unusual specimen can deserve detail. A single grid/row layout is not the right answer for every scale. Show mixed/unassessed rather than hiding exceptions in averages. |
| I5 | Keep a causal return account. | Report actual inputs spent, executor, result/custody, justified learning, unusual observation and unfinished work. The display summarizes settled state rather than awarding predicted production or exposing every hidden cause. |

The first mockup pass had too much explanatory text and content below the fold. The revision shortened assignment descriptions, preserved pinned current work/return controls, reduced diagram height at laptop size and added a current-mining incumbent view. Dense detail still needs internal scrolling in some scenes; that is a measured design tradeoff, not native acceptance. Unnecessary explanatory text belongs in this report rather than the final product.

## MS3. What other games contribute, with evidence limits

| Reference | Documented or inspected mechanism | Adaptation worth considering | What not to infer |
|---|---|---|---|
| Factorio | Official wiki electric drill page distinguishes3×3 machine footprint,5×5 working area, delivery at an output tile, and running/blocked/exhausted status indications. | Overlay the actual affected targets; display delivery independently; give a known blocking reason rather than generic “not working.” | YAIR does not thereby need finite veins, belts, electricity or pollution. These are documented mechanics, not a newly operated UI session. |
| Melvor | Existing local audit traces timed growing, real seed/plot inputs, charged support effects, active/passive separation and actual return snapshots. Selected mining deposits have explicit finite support in that audited context. | Compact routine cards and clear actual return/shortage accounts can be enough when spatial choice is absent. | No automatic adoption of its offline cap, depletion, survival odds, skill balance or one-active-action model. New Mining/Farming wiki fetches failed; existing local evidence is reused instead. |
| Stardew | Retained Crop/HoeDirt/sprinkler bodies inspected in prior passes keep crop/soil state while alternative care changes supplied water. Fishing code separates skill, handling and catch eligibility/selectivity. | Same underlying pursuit can accept personal, device or power care; focused interaction can change a technique choice. | A universal crop tile, fishing minigame or shared manual-only rare reward is not selected. See previous pinned source receipts. |
| ACS | Fresh managed farming/job/worker UI exports and historical UI references distinguish designation, actual work, worker attributes and eligibility. | Assignment and cause visibility; one helper task before a general colony economy. | No native YAIR farm delegation, full storage chain or modern donor geometry proof. |
| Immortal Life | Retained tables/localization support named temporary care and staged rare cultivation; historical guide images depict crop knowledge and arrangement requirements. | Powers can remove specific chores while specimen planning stays interesting; show known stage/coverage requirements. | No full NPC workforce or recovered native IL2CPP execution. A guide image is not present-build proof. |
| Scroll of Taiwu | Retained managed bodies distinguish profession seniority/learning/use, task-dependent worker attainment and material/tool/product consumers. Official retained UI image shows input/tool choices beside the work. | Functional expertise, actual stock source and adjacent causal comparisons, including potions. | Authored ingredient families are not unrestricted chemistry; crafting media is not its fishing screen. |

Fresh Factorio source: [Electric mining drill](https://wiki.factorio.com/index.php?title=Electric_mining_drill&oldid=214635), read2026-10-15; page edited2025-06-13. [Mining](https://wiki.factorio.com/Mining) separately describes miner speed versus resource mining time. These are official wiki documentation, not game-version-pinned native behavior. Existing evidence: [Melvor report](../melvor-idle/REPORT.md), [source follow-up](PATH_PROPOSALS.md), [cultivation deep dive](FARMING_DELEGATION_DEEP_DIVE.md), [Taiwu UI](../taiwu-ingredient-use-2026-10-15/UI_EVIDENCE.md). No donor assets or code were copied into the mockup.

## MS4. Parity has several separate meanings

| Dimension | Proposal / comparison | Present proof and limit |
|---|---|---|
| Visual composition | Preserve separate player/inventory, focus/current work and full-height log regions; square frames, shared semantic palette and readable text. | Existing Proto23-flow1366×768 evidence image directly inspected. Mockup uses an original palette adaptation and analogous columns, not shared production components or measured exact visual parity. |
| Navigation | Same header meanings, free inspection, visible return, retained target and no view-driven mutations. | Mock has pinned return and Esc-to-routine behavior. It does not implement the production controller/history stack. “← Local places” is a studio return simulation, not actual world travel. |
| Information | Known input/means/status/result at every place; uncertainty and attribution consistent. | Fixed known-only examples, no production knowledge adapter. No unknown cheat names or world truths. |
| Domain behavior | Fishing reach/presentation; farming cohort/care/area; mining face/extraction/stock; crafting process/recipient. | These are intentionally different. Existing native contracts and compatibility remain with each owning system. |
| Interaction/accessibility | Primary decision and return visible, keyboard focus, larger text and preserved selection. | Baseline browser inspection and limited mock interactions recorded separately. Full keyboard/focus history,125%/150% text, production populated saves and human feel remain unaccepted. Mobile deferred. |

Functional parity should mean consistent promises, not identical controls. A waterfall bank may need access/current information; a lake device might need coverage and retrieval; a village plot needs land right and crop stage; a distant farm may be known only through a delayed report. A mining option whose identity differs by output/skill can stay a compact row until another choice exists. A world where a power supplies unlimited ordinary water can simplify the care display. A place-service cannot appear available everywhere merely because a global menu is convenient.

## MS5. Potion menus need a process view

**Proposed structure:** known purpose or preparation → actual free input lot and role → apparatus/operator/process → known quote → accepted work → actual product → recipient/use. The existing [procedural crafting synthesis](../procedural-crafting-ui-2026-10-15/DEEPER_SYNTHESIS.md), Taiwu ingredient-to-use trace and `src/mixture_ui.js` remain the owners/references. The latter has a local panel, candidate stock display, preview and explicit action; this pass did not establish full current potion chemistry or every production route.

The mock potion example highlights free versus held herb portions, reusable apparatus versus consumed ingredients, process contribution from heat control, uncertain predicted effects and a retained comparison. “Save method” would preserve what was done and observed; it must not declare a new magical law solely because a recipe name was entered. A batch work order differs from an open experiment: an apprentice should not silently improvise substitutions. Actual activation/use, adverse effects if represented, recipient eligibility, concentration/dose and duration belong to the chosen world's real consumers. Do not bolt on universal toxicity, potion rarity or reagent tax.

A product comparison can include “known procedure,” “modified preparation” and “unconfirmed result” without pretending all materials are points on one chemistry graph. Identity-specific recipes, property-based substitution, rituals and apparatus-driven transformations can use different views through the same navigation. Lot/provenance detail earns space only when it changes a choice. The final potion's use should remain reachable from actual inventory, with separate confirmation where appropriate.

## MS6. Future cheat menus need known scope and consequence

The viewer's **Quiet lens** is an invented menu fixture, not an existing cheat, a sealed-library entry or a promised power. It demonstrates availability, actual evidence, known applications, study questions and scope. It does not rewrite accepted access/continuation direction in [cheat-access discussion](../../gm/CHEAT_ACCESS_DESIGN_DISCUSSION_2026-10-15.md).

| Surface | What should be shown | What should be kept separate |
|---|---|---|
| Quiet faculty / status | Known passive capability, actual active state and evidence it supplies. | No compulsory toggle, bar, cooldown or resource invented for a passive faculty. |
| Known applications | What this character can actually do with available body/means, target and relevant conditions. | Knowing a method does not grant its apparatus, energy, body or social access. |
| Study / improvement | A known question, evidence, actual research means and applied versus merely learned improvement. | No global spoiler tree of unknown extensions or menu-click knowledge awards. Research is not the only improvement route. |
| Activated use | Exact target/scope, known costs if any, observed/uncertain consequences and explicit commit. | Inspection, a preview, activation and completed effect are different. |
| Rare threshold choice | Recovery, continuity, world entry or another weighty choice uses its accepted full-screen flow and actual policy. | Do not tuck it into an everyday worker grid or imply a new reset/loss rule. No save/recovery control operates in this mock. |

No universal skill tree, mana budget or scaling level should be forced across very different cheats. An authority, an internal faculty, a device and a place-bound capability have different meaningful controls. Allow one capability's application to appear in the relevant activity while keeping its known rule and provenance in its ability home. The activity shows the contribution, not a second competing power specification.

## MS7. Other menus and little aspects

| Family | Useful concrete details | Appropriate abstraction |
|---|---|---|
| Woodcutting | Tree versus grove, desired usable part, method, cutting versus hauling, actual stock. | Individual tree only where identity matters; lot/reach where equivalent. No compulsory regrowth/ecology. |
| Herbalism | Patch/access, recognition confidence, part/preparation, observed season/condition, retained sample. | Knowledge and locality, not every wild patch as owned farmland. |
| Animal care | Individual where relationship/health matters, named chore, actual feed and keeper competence. | Enclosure/capacity only when represented; feeding, diagnosis and treatment are distinct. |
| Cooking | Serving purpose, free ingredients, batch/process, actual recipient, preserved known method. | Station/stock/meal occasion instead of a generic plot map. |
| Trade / obligations | Actual owner/purse/stock, quote, commitment and destination/report. | Ledger and finite agreement; not automatic global demand. |
| Investigation / teaching | Known question, source, confidence, available teacher/learner means and attributable progress. | Case/notebook or lesson view. Evidence is not a consumable production counter. |

Small but consequential details to retain across designs: units and time basis; actual executor; free/held stock; source of a claim; known versus unassessed condition; selected target after refresh; direct return from log notice; text plus color; stop versus pause versus cancel; expiry at the next action boundary; failed output delivery; same-life/distant/world-travel knowledge. These need honest representation where the underlying state exists, not a new global simulator by default.

## MS8. Improving future design studios, proposal only

| Code | Recommended studio improvement | Why it helps |
|---|---|---|
| ST1 | Give each study a brief: decision, accepted owners, current incumbent, candidate difference, fixture and exclusions. | Keeps exploratory examples from becoming accepted product requirements. This folder already supplies most of the brief. |
| ST2 | Separate studio scenario controls from product controls. Add domain-specific scenarios such as blocked output, unknown evidence, power expiry and no available helper. | A screenshot should not imply a whole new universal mode system or make every feature available. Fixed alternatives can answer design questions without simulating a game. |
| ST3 | Keep comparable fixtures and an inspectable state/provenance sheet. Preserve actual record IDs/known-state boundaries in later authorized native prototypes. | Makes “same work, different detail” testable and prevents source/schema/UI/runtime evidence from blurring. No new production schema is proposed here. |
| ST4 | Save baseline/candidate screenshots and measured overflow at1366×768, then selected larger-text and keyboard/return checks. | Structural similarity, control reachability and visual feel are separate. A checked mock is not native gameplay or human acceptance. |
| ST5 | End each study with a recommendation, tradeoff, unresolved question and a reusable path. Keep accepted outcomes in existing owners only after the user selects them. | Builds a useful design reference library without a new approval bureaucracy, general studio service or automatic implementation queue. |

The current viewer is one disposable study, not the future studio platform. A common fixture manifest/gallery could be a later convenience once several studies demonstrate the same need. Keep production tokens/controllers/components authoritative; reuse their snapshots or isolated adapters if later authorized, rather than cloning an evolving design system into every study. A full game replay engine, React migration, generated graphics pipeline or new app is unnecessary to review these screens.

**Disposition:** ACT NOW, design artifacts and review, completed by this pass; ACCOUNT FOR NOW, parity dimensions/knowledge/means/state distinctions; LATER, selected native prototype, broader text/keyboard checks and any production change. No accepted design, game implementation or expanded engine scope follows.

## MS9. Better abstractions and future integration

Latest user steering asks for better future abstractions and integration possibilities. **Yes, as selective shared contracts around distinct domain behavior.** This is an extension of the design proposal, not authorization for a universal activity engine, new schema, migration or source change.

| Code | Candidate shared seam | Concrete reuse and difference | Existing authority / evidence |
|---|---|---|---|
| AB1 | Intent → known preview → explicit commitment → work → settled result | Catch for a purpose, care for a cohort, extract material or prepare a vial can describe inputs/conditions, actual performer and a result. Fishing's random cycle, farming's growth, a potion's process and an ability's immediate use keep different resolution rules. | Native activities and inventory already execute; simulation preview/jobs/participants and crafting transactions provide existing seams. EG1–EG8 and the mining report pin the current reads. Do not assume every subsystem already satisfies one transaction contract. |
| AB2 | Stable target and effect scope | A bed/cohort, reachable water band, exposed rock face, ingredient lot, selected person or known rule can be targets. Scope might be discrete targets, area, distance, volume, adjacency, connection or jurisdiction. | Area is not a universal scalar. Use domain-owned validity/reach rules and observer-safe projection. A sensible common envelope identifies target/scope; it does not implement geometry, fluid physics or supernatural authority. |
| AB3 | Attributed contribution of actual means | Skill may supply diagnosis/control; a tool physical access; a power energy, information or a rule change; a worker actual labor. Combine them at the process step they affect, rather than multiplying all of them into generic yield. | Existing power models, learned-skill families, real NPC participants and material/process owners. A label/tag grants no executable verb. Actual power law can remove a requirement; no invented cap/upkeep is required to fit the envelope. |
| AB4 | Method and evidence, with world/revision context | A known drift, care instruction, extraction method or preparation can retain inputs/roles, steps/conditions, observed result and source. Hypothesis, useful repeatable procedure and confirmed cause stay distinct. | Existing knowledge bases and discovery projection; production/research owners govern recipe/material behavior. A saved procedure is not a universal resolver or proof that a property-based substitute works in every world. |
| AB5 | Known presentation from actual owner state | Place summary, focused detail, coverage comparison, assignment and return report can expose the same actual record at suitable detail. UI declares its home and supported inspection/actions. | Existing shared tokens/components/controller, panel ownership, native discovery policy and known-only views. A UI mode cannot award XP, advance time, reroll, enroll a system or reveal truth. The mockup's copied style is disposable and has no authority over the production kit. |

### Useful integrations, without duplicate owners

| Integration | Example consequence | Boundary that must remain explicit |
|---|---|---|
| Pursuit ↔ inventory/crafting/use | A known catch can be allocated to a supported preparation; garden produce to an actual meal; ore to an actual ingot; a finished potion to a valid recipient. | Same stock cannot be spent twice. Known uses are not every use. A raw resource, intermediate, product and applied effect are different outcomes. |
| Skills/powers ↔ ordinary work | Practiced control changes one supported step; water/heat/separation means supplies that step; a real diagnosis informs a choice. | Training an actor, revealing knowledge and supplying an effect are different. No global “magic proficiency” replacement for specific competence. |
| Helpers ↔ routines/obligations | An agreement names performer, method, targets, input budget, custody, expiry/stop and what requires asking again. | Instruction is not execution. Consent/availability, actual work capacity and access remain real where represented. Pausing future work differs from cancelling accepted work. |
| Experiment/notebook ↔ return report | Routine or delegated work can return an unusual sample, observation or unresolved question. | Physical truth, observed event, report received and player's belief differ. An inspected summary cannot grant unwitnessed knowledge. |
| Place/world ↔ continuity | A method can remain understood while its body, tools, local power source, land right or material access changes. | Follow accepted identity/continuity/access owners. No automatic interworld transfer, remote live sensor or new loss policy from an interface abstraction. |

A future common **presentation envelope** could name a known target, intended outcome, selected means, quoted resources/time, evidence, and supported actions. It would be assembled by each existing owner, not become an extra stored copy of world truth. A common **result summary** could name actual actor/means, spent/reserved/released stock, actual outcome/custody, credited practice, received evidence and remaining work. These are candidate fields to compare, not an approved data model or a requirement that every action populate every field.

A context distinction matters for preview: **known consequence**, **estimate from a known method**, **unassessed** and **actual result** should not be combined into a single predicted-output number. Different representations can describe the same true scope while showing only what the character knows. Accepted jobs need stable target identity; changing a label, grouping beds or choosing an overlay must not change their claims.

### Costs and limits to consider before selecting a seam

| Concern | Concrete implication |
|---|---|
| Clock and concurrency | Keep one authoritative time basis and actual occupied actor/work capacity. Existing MG06 explicit grow work cannot quietly become independent growth. Offline/distant progress needs its own policy. |
| Randomness and revision | Preserve committed outcomes and the appropriate random stream; method/view changes cannot create rerolls. If a world/method law changes, retain the revision needed to interpret old observations and work without inventing new truths for old saves. |
| Cancellation and delivery | Some inputs can be returned, others have already been transformed. Failure to deliver is not permission to mint another output. Existing transaction/job contracts need domain-specific proof. |
| Compression and scale | Aggregate equivalent cohorts/jobs for the displayed question, retaining stable differing targets and exceptions. One interesting specimen can stay detailed while a large ordinary operation remains compact. No per-entity render/update every tick by default. |
| Compatibility | Current activity IDs, item identities, crop-stage facts, knowledge and saved navigation remain under their owners. A new shared contract needs an explicit additive/migration plan before source changes. A documentation example does not migrate anything. |

**Recommended future order, not an implementation mandate:** keep the current incumbent; choose one decision from an actual pursuit; identify the smallest missing join; prove it reaches a useful consumer; then reuse the join in a second genuinely similar activity. A new abstraction earns its place through those consumers or a demonstrated failure it removes. Do not first build a generic activity graph, universal chemistry, full land simulator or universal cheat tree and then search for content to justify it.

The design-studio implication is a **comparison contract**, not a game engine: a study should declare its owner/state source, target decision, fixture, known-information boundary, actual controls versus simulated controls, viewport, comparison result and open acceptance. Later adapters can render real read-only view models in isolation if that resolves a selected uncertainty. Until then, keep example fixtures visibly fictional and all proposals in this research home.


## MS10. Direct farming block interaction

User follow-up: “for the farming why not make the blocks interactable?” The first diagram used separate bed buttons while its drawn blocks were passive. The revised standalone viewer makes each block a labelled focusable button with click, Enter/Space, hover and selected outlines. Selection opens the matching inspector; it does not start work. The redundant button row provides an alternate route.

BI1: Bed A/B selects existing harvest responsibility and previews a supported handoff, preserving Mara’s claim. BI2: C/D/E shows existing guided-water care and previews inspection without duplicate care. BI3: F shows the retained comparison; a coverage preview explains that adding4m² would bring the set from12 to16m² and change the study condition, without applying it. BI4: Delegation inspects the selected bed’s scope separately from the existing worker agreement. These previews are explanatory, not a simulated farm.

Future consideration: explicit multi-select could draft a named care set, with included/excluded area, reachable connections, exceptions and existing claims shown before commitment. Dragging could select a region only if geometry is meaningful and an equivalent keyboard route exists. Neither is implemented here. Click-to-inspect should remain free; click-to-harvest should require an explicit action. A spatial farm view can coexist with a compact routine table at any scale.

Browser evidence, viewer limitations and remaining native gates are in [mockup review](mockups/REVIEW.md). These are proposals; no production integration or accepted design decision follows.


## Selectable fishing/mining targets, 2026-10-15

Completed the requested mockup-only follow-up in [FISHING_MINING_INTERACTIVE_CHOICES](FISHING_MINING_INTERACTIVE_CHOICES.md). Three fishing reaches and three faces of the same known seam are directly selectable; target, skill, sensing/control and method change the inspector, blocked reasons and preview. Investigation/delegation retain selected context and responsibility. Existing Current flow remains separate.36 scenario combinations plus targeted interactions checked;21 main captures refreshed at1366×768. No game implementation, actual-world balance, native parity, save or accepted-product change. Larger-text and native acceptance remain open if a candidate is later selected. All writes stayed in this research folder; no new donor acquisition, workers, messages, commit or push.
