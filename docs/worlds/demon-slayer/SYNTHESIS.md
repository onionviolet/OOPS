# Demon Slayer: world-pack synthesis (M5)

Status: **[PROPOSAL]** Research synthesis, 2026-10-14. Every gameplay mapping and implementation choice here is a proposal. It is not accepted gameplay, a loaded pack, a playable result or a completed world. See the [world brief](WORLD_BRIEF.md), [campaign](CAMPAIGN.md), [module catalogue](MODULE_CATALOGUE.md), [source ledger](SOURCE_LEDGER.md), [ability variants](ABILITY_VARIANTS.md), [interactions](INTERACTIONS.md), [GM role](GM_PROMPT.md) and [implementation packet](IMPLEMENTATION_PACKET.md).

## 1. Sources, labels and earlier work

**Snapshot basis:** WikiTeam Internet Archive history dump of Kimetsu no Yaiba Wiki, dated 2023-12-19, sourced from page revisions mostly dated 2022–2023. Manga ended in 2020 per `Kimetsu no Yaiba (Manga)` rev 129911. Wiki articles are secondary evidence. Citations below use page title plus revision ID and should be read as claim-level citations; mixed pages include non-manga attribution.

**Read accounting:** The input was `docs/research/power-systems/wiki-digests/full-dumps/workers/demon-slayer-full/NOTES.jsonl` (353 rows). All 353 note records report `read_complete: true` for their selected payload/spans. The dump index counts 45 `full_page` rows, 117 mechanic-section rows (including five character-page mechanic-section rows), and many narrative-only, metadata, and other scope dispositions. The assigned restoration audit is complete: 2/2 scope supplements, 27/27 noncharacter restorations, 9/9 empty-input restorations and 38/38 named audit entries; retained and audit receipts pass hash/length/order/chunk-coverage checks (`workers/demon-slayer-full/SUMMARY.md`, `INTEGRITY.json`). This closes the named lane audit, not broader completeness: the 962-page content inventory, unexpanded/transcluded material and the full 26,300-page archive do not prove exhaustive coverage. No local book/manga primary text was read.

**Core laws checked directly against private retained cited payloads:** `Demon` rev 130890; `Total Concentration Breathing` rev 127065; `Nichirin Sword` rev 126696; `Demon Slayer Corps` rev 125400; `Demon Slayer Mark` rev 129116; `Bright Red Nichirin Sword` rev 123577; and `Repetitive Action` rev 116919. Spot checks retained the payload conditions and section wording. Direct checks do not make the wiki primary or resolve its contradictions.

**Earlier record:** [Older digest](../../research/power-systems/wiki-digests/DIGEST_demon-slayer.md) was `blocked_no_revision`, so it is not evidence for mechanics. Its prior E8 mappings remain leads, not verified claims. [Wiki lane spotcheck](../../gm/dispatch/wiki-lanes-2026-10-13/SPOTCHECK_1.md) says notes may misassign actors (P2) or omit conditions (P3); core conditions here were checked directly, and open page-specific uncertainty is retained.

**M3 coexistence survey:** not run. The start options below are design proposals, not fanfiction trend claims. **Manga/full primary verification:** not run. **Later anime season survey:** not run. **M4 live wiki cross-check:** not run; snapshot is fixed historical evidence.

## 2. Rules an engine has to model

| Rule and evidence | Proposed engine shape |
|---|---|
| **[PROPOSAL]** Demon bodies feed and grow; their regeneration and weakness vary. `Demon` rev 130890. | **[PROPOSAL]** Body/species profile, nutrition, growth, regeneration, injury and specific counters. Do not apply one character’s art to all demons. |
| **[PROPOSAL]** Sunlight, Nichirin and wisteria have distinct effects. `Demon` rev 130890; `Nichirin Sword` rev 126696. | **[PROPOSAL]** Target/material/condition/environment interactions with explicit exceptions. Avoid one “anti-demon damage” tag that erases conditions. |
| **[PROPOSAL]** Breathing changes human physical capacity through trained respiration; sustained practice is difficult. `Total Concentration Breathing` rev 127065. | **[PROPOSAL]** Learnable method plus current execution, bodily state, fatigue, duration and recovery. Art imagery is not assumed physical water/fire. |
| **[PROPOSAL]** Personal styles and forms are taught, adapted and practiced; techniques have different movement conditions. `Water Breathing` rev 126658; `Tanjiro Kamado` rev 130972. | **[PROPOSAL]** Form-specific trigger, movement, target and cost; do not reduce style to a universal tier. |
| **[PROPOSAL]** Corps membership and service have distinct roles: training, selection, field combat, medical/logistics support and smithing. `Demon Slayer Corps` rev 125400. | **[PROPOSAL]** Institutional membership, rank, duty, access and service capacity separate from personal combat skill. |
| **[PROPOSAL]** Nichirin blades have material, maker, owner and condition; the red-state overview's marked-user restriction conflicts with its explicit Nezuko ignition exception. Method text says friction/clash and pressure/grip require a Mark; ignition does not. The state is temporary and impedes regeneration while causing heat/pain. `Nichirin Sword` rev 126696; `Bright Red Nichirin Sword` rev 123577. | **[PROPOSAL]** Track custody and item state plus the activation method and its stated condition separately. Preserve the article's opening generalization beside method-specific wording; keep primary-source verification open. |
| **[PROPOSAL]** Mark, Transparent World and Repetitive Action have distinct stated conditions and costs, with wiki uncertainty. `Demon Slayer Mark` rev 129116; `Transparent World` rev 127620; `Repetitive Action` rev 116919. | **[PROPOSAL]** Separate discovered/learned condition, physiological state, perception and duration. Do not impose a universal unlock or lifespan timer from disputed wording. |
| **[PROPOSAL]** Muzan blood conversion is described for human recipients with dose tolerance and Breathing-resistance conditions; Upper Rank blood requires Muzan's approval. The page separately says demons were originally human, then records Tamayo scientifically converting Yushiro and transforming a cat. `Demon` rev 130890. | **[PROPOSAL]** Keep human blood-exposure conversion and Tamayo's narrow scientific route distinct; preserve the animal eligibility conflict. Track amount, recipient response, control and uncertainty; do not invent a universal dose or eligibility rule. |

## 3. Full catalogue at a glance

This is a coverage map, not a complete named-technique inventory. Every row is a proposal for world-pack inclusion.

| Family | Coverage proposal | Neighbors / conflicts |
|---|---|---|
| **[PROPOSAL]** Breathing | Sun-derived style family; water and other documented styles; forms, personal variants, constant breathing, recovery | **[PROPOSAL]** Connect training, body condition, weapons and timing. Water imagery does not prove physical water. |
| **[PROPOSAL]** Demon body and art | Conversion, nutrition, regeneration, senses, flesh manipulation, movement, individual Blood Demon Arts | **[PROPOSAL]** Connect counters, materials, social concealment, feeding and source-specific control. |
| **[PROPOSAL]** Nichirin equipment | Ore, forging, color, owner, repair, form factors, red state | **[PROPOSAL]** Connect smithing, custody, combat and red-state disagreement C2. |
| **[PROPOSAL]** Corps and training | Cultivators, Final Selection, ranks, Hashira/Tsuguko, Kakushi, crows, swordsmiths, recovery institution | **[PROPOSAL]** Rank is not equivalent to form mastery or universal power. |
| **[PROPOSAL]** Physiological enhancements | Mark, Transparent World, Selfless State, Repetitive Action | **[PROPOSAL]** Keep discrete; unlock and cost rules need primary verification. |
| **[PROPOSAL]** Medicine and logistics | Wisteria, antidotes, treatment, transport, food, shelter, secrecy | **[PROPOSAL]** Effects and treatment remain dose/skill/context dependent. |
| **[PROPOSAL]** Non-manga and adaptations | Anime-only feats, film/game moves, novel/fanbook/Academy material | **[PROPOSAL]** Separate branches and claim labels; not silently merged into manga baseline. |

## 4. Data model

**[PROPOSAL]** Author packs as independent records for source family, continuity, era, region, entry profile, scenario, person, body, institution, learned technique, technique execution, item, condition, observation, obligation and outcome. A technique should include eligible source/body, acquisition, trigger, target, range, substrate, duration, cost, failure, counter and source locator. A character’s art is not a species default. An item’s owner and state are not a grant of a personal ability.

**[PROPOSAL]** Store source medium and confidence on each claim, and keep character knowledge apart from world truth. Freeze committed scenario facts and choices. Any new persistent fields need a compatibility decision. These are authoring proposals, not existing runtime schema.

## 5. Turning rules into play and YAIRPG systems

| Rule-to-play proposal | Existing design fit | Gap / gate |
|---|---|---|
| **[PROPOSAL]** Train and maintain breathing under fatigue | Skill progression, practice, activity and body-condition designs | Exact native consumer/state owner must be inspected at implementation time |
| **[PROPOSAL]** Give support work meaningful consequences | Jobs, people, inventory, treatment and institutions | Needs real supply/capacity/custody effects; narrative setup alone is insufficient |
| **[PROPOSAL]** Make weapon, material and target compatibility explicit | Item/equipment and effect contracts | Do not infer that every combat path handles target-specific source interactions |
| **[PROPOSAL]** Reveal knowledge through an appropriate in-world route | Notebook/knowledge and sealed discovery standard | Unknown state must not leak truth before discovery; randomized truth stays opaque in this tracked pack |
| **[PROPOSAL]** Preserve the same fixed threat across choices | World instance/continuity and causal campaign framework | Native independent world-instance and absence-clock behavior may need an adapter; verify current owners before implementation |
| **[PROPOSAL]** Treat rank, reputation, duty and personal capability separately | Relationships, institutions, renown and progression designs | No shared generic rank meter should collapse these state types |

## 6. Living beside the protagonist

M3 was not run, so no fan-premise taxonomy is asserted. These are proposed start options based on the campaign architecture, not reports about fan consensus.

| Start proposal | Needed mechanics | Pitfall proposal |
|---|---|---|
| **[PROPOSAL]** Trainee before selection | Mentor, training, work, body condition and qualification | Do not grant canon-character relationships or skills automatically |
| **[PROPOSAL]** Final Selection candidate | Fixed time window, route, supplies, observation and failure outcomes | Do not guarantee passing or equalize threats |
| **[PROPOSAL]** Kakushi/support worker | Logistics, transport, medical assistance, cleanup and evidence | Support role should not silently grant sword mastery |
| **[PROPOSAL]** Swordsmith apprentice | Craft, materials, secrecy, custody, repair and client needs | A forged blade does not grant the wielder’s powers |
| **[PROPOSAL]** Civilian household member | Work, household, rumor, evacuation and help-seeking | Do not assume civilians know demons exist before evidence |
| **[PROPOSAL]** Demon-origin alternate start | Body/identity eligibility, feeding, control, sunlight and social danger | Must be a separate authored start, not a routine transformation unlock |

## 7. More to consider

- **[PROPOSAL]** Reconcile manga primary evidence for red Nichirin activation, mark costs, Transparent World prerequisites, demon decapitation exceptions and conversion conditions before freezing those rules.
- **[PROPOSAL]** Preserve contradictory wiki assertions side-by-side in any revision until a primary source establishes scope.
- **[PROPOSAL]** Add cast, named-form, demon-art, materials and location coverage only after a bounded completeness audit; do not turn an incomplete wiki capture into false exhaustiveness.
- **[PROPOSAL]** Treat anime, movie, novel, game, fanbook and Academy sources as optional continuity overlays with explicit medium identity.
- **[PROPOSAL]** Define ordinary life: food, household work, sleep, travel, civilian distrust, secrecy and support capacities around the fighting loop.
- **[PROPOSAL]** Determine how the source’s terminal ending, Corps dissolution, descendants and modern setting map to independent era branches. No rollback of a played continuity.
- **[PROPOSAL]** Any modified/randomized version of canon truth must use a sealed slot ID and discovery route only in this pack; the altered truth remains in a private owner.

## 8. First playable slice

**[PROPOSAL]** Build one Final Selection night at Fujikasane for one eligible entrant start. The player can inspect carried supplies and a local report, then choose to assist an injured entrant, mark the location for later help, avoid the area, or engage a fixed demon. Show changed time, supply, injury, trust and evidence as applicable. Outcome may be incomplete or severe; no guaranteed win or selection pass.

**[PROPOSAL]** This is the smallest slice that makes the world’s core loop visible: preparation, human limits, demon-specific threat, equipment/support, observation and lasting choice. First target is desktop/laptop at 1920×1080, with 1536×864 as the desktop floor; mobile optimization is deferred. The [implementation packet](IMPLEMENTATION_PACKET.md) defines rebuild, fresh-origin browser and persistence gates. No such gate has yet been run.

## 9. Gaps that would change the design

| Gap | Why material | Status / proposed response |
|---|---|---|
| Primary manga scene verification | Could change conditions, exceptions, speaker or scope of core laws | **[PROPOSAL]** Open; verify exact chapters before implementation |
| Mark cost, prerequisites and survivorship | Changes risk and progression balance | **[PROPOSAL]** Open; current wiki wording and exceptions retained |
| Nichirin red activation eligibility | Changes team combat and equipment model | **[PROPOSAL]** Open; preserve both page wordings |
| Later anime seasons after snapshot | May add techniques, institutions or mechanics | **[PROPOSAL]** Open; not filled from memory |
| Full page/scope audit | May reveal omitted mechanism pages or bad dispositions | **[PROPOSAL]** Open; index/audit explicitly not exhaustive |
| M3 fan-start survey | Could alter the best co-protagonist entry options | **[PROPOSAL]** Not run; start suggestions remain provisional |
| Native engine binding and persistence | Could make proposed state expensive or require migration | **[PROPOSAL]** Open; current runtime owners must be inspected before a build packet |
| Sealed truth handling for changed branches | Prevents a randomized/changed truth leaking in UI/docs | **[PROPOSAL]** Open for any such branch; this folder contains IDs/routes only |

**Read versus search summary:** 353 paraphrased notes report full reading of selected input text; 45 full pages and 117 mechanic-section rows anchor the system coverage. The named assigned restoration audit is complete, while broader completeness remains open. The full-history dump itself was indexed rather than read end-to-end. The core laws listed above were checked against retained private payloads. I searched the local project's existing digest, dispatch spotcheck, playbook, campaign framework, completion template, secrets rule, world-depth start/cheat/access notes and the Bleach eight-owner layout. No M3 survey, manga primary read, or post-snapshot anime verification occurred. No test, build, browser run, persistence check or gameplay acceptance was performed.
