# T1 code inventory

2026-10-14. Source inspected in the shared `codex/gameplay-foundations`
checkout. Every statement below is source evidence, not current browser proof.
Line locators refer to the files as read; concurrent integration can move them.
No code, test, build, browser or user-save operation was performed.

## C6. What is already represented

The palette has useful local implementations, not a universal research tree.
`simulation.knowledge[actor][key]` stores an attributed finding; actor/world
facts gate actions; native availabilities gate recipes and other content;
techniques and powers store execution learning separately. The notebook routes
panels rather than owning a question database. These distinctions matter when
adding RQ/RV/RF/BS/TM consumers.

State notation below: **E** = saved `expansion`; **K** =
`E.simulation.knowledge[actor][key]`; **A** = `E.actors[id]`; **W** =
`E.worlds[id].facts`; **S** = `E.simulation`. K records contain
`{stage,value,at,cause,basis?}`. Stages are `seen`, `interpreted`, `understood`,
not TK0–TK5. Equal/higher-stage writes replace the latest record; they do not
append an evidence history (`src/simulation_effects.js:281`). Definition and
save validation live at `src/simulation_contracts.js:66`, `:235`, `:249`.

Panel notation: **Here** = existing Notebook Here/local panel; **Feature** =
`feature_expansion_panel`, with named local sections; **Practice** = skill,
technique or body panels; **People** = known people and social panels.
Panel routing: `src/adventure_notebook.js:10`, `:17`, `:43`, `:75`.
Feature sections render known records at `src/feature_expansion_ui.js:78`;
the shared record projection is `src/feature_expansion_host.js` (producer
index below does not imply every declaration is reachable in every start).

## Native learning and unlocks

| Mechanism | State actually saved | Visible consumer/panel | Source locators |
|---|---|---|---|
| Recipe learning | `availabilities.recipe[id]` status; legacy `recipes` accepted by loader | Crafting recipe list, detail and Makeable now | `src/crafting_recipes.js:46`, `:65`; `src/crafting_visibility.js:4`, `:50`; `src/main.js:5042`, `:6906` |
| Craft success and quality | Native skill XP, real inventory/output quality, craft counters; no generic research points | Crafting results and skills | `src/crafting_recipes.js:80`, `:86`, `:376`; `src/main.js:4136`, `:4212`, `:4303` |
| Material discovery/item catalogue | `item_log`; inventory remains separate; discovery alone supplies no stock | Journal item log and known crafting materials | `src/main.js:5150`, `:5725`; `src/crafting_visibility.js:24` |
| Book study | `books[id].accumulated_time`, current `is_reading`; completion restores native bonuses and unlock rewards | Book inventory/read controls, skill XP | `src/main.js:5112`, `:5143`, `:5475`, `:5518`; `src/items.js:1407` |
| Ordinary skill XP and milestones | `levels` owner skill XP, native availability, legacy `skills` migration; threshold-dependent discovery | Skills bars and skill descriptions | `src/models/skill.js:16`; `src/main.js:3786`, `:3883`, `:4864`, `:5568`; `src/skill_discovery.js:82` |
| Native global/local actions, activities, places, beds and stations | `global_flags`, `availabilities`, location action progress, local kill/clear counts and current activity | Local action/work/travel menus | `src/main.js:2684`, `:2700`, `:2724`, `:4047`, `:5006`, `:5042`, `:6531` |
| Dialogue, trader, quest and stance unlock rewards | Corresponding `availabilities`; quest task progress, active/finished states, stances | People/dialogue, trade, quest Journal, combat stance | `src/main.js:3100`, `:3557`, `:5125`, `:6358`; `src/native_unlock_transaction.js:1` |
| Bestiary | `enemy_killcount[name]`; entry built after eligible ordinary victory | Journal Bestiary; base stats/XP, tags, known-drop display | `src/main.js:3684`, `:5149`, `:6753`; `src/display.js:5274`, `:5311`; `src/enemies.js:52` |
| Watchcraft learning and teaching | `village_career` schema 4: reading/tutor access, practice minutes, first use, recruit known/practiced/teacher/terms, shift and kit records | Village career menu; patrol payout and biography | `src/village_career.js:8`, `:11`, `:22`, `:59`, `:72`; `src/save_files.js:47`; `src/items.js:1407` |
| Work Ledger preparation and applied practice | `work_ledger` schema 2: commissions/rules, precision/assistance resources, applied receipt; native craft evidence | Work Ledger plus real craft chance/quality | `src/work_ledger_system.js:49`, `:77`, `:119`, `:144`, `:149`; `src/main.js:2327`, `:5302` |
| Fort supply/source journal | `fort_supply` schema 1: notes, repair, finite budget/orders and acquisition sources | Fort board, source/disclosed-clear journal | `src/absorb_d/fort.js:10`, `:27`, `:37`, `:46`; `src/main.js:690`, `:5294` |
| Home fixture benefits | Existing native housing, owned books/kits and fixture access; derived bonuses | Housing/rest/study display | `src/absorb_b/furniture.js:1`; distinct from the later home-furnishing jobs below |

## Shared knowledge, perception and records

| Mechanism | State actually saved | Visible consumer/panel | Source locators |
|---|---|---|---|
| Notebook routing and waiting-work attention | No question domain; selected tab is a local variable. Saved jobs/sessions provide attention | Notes, practice & people; right-side records/workspace | `src/adventure_notebook.js:22`, `:52`, `:58`, `:93`, `:131` |
| Learned world identity | A facts `world.<worldId>.nameKnown/branchKnown`; authored identity alone does not reveal it | Known location/world label | `src/world_knowledge.js:3`; `src/main.js:583` |
| Known people | K, chronicle relations, introductions and received accounts; view itself saves nothing | People overview and Notebook People | `src/people_knowledge.js:12`, `:28`, `:81`, `:97`; `src/adventure_notebook.js:74` |
| Known routes | Existing discovery/access/means/quote facts; projection saves nothing and grants no passage | Known routes panel in Here/workspace | `src/known_routes.js:11`, `:70`; `src/main.js:8304` |
| Discovery catalogue | Known/hinted/unlocked/eligible inputs only; read-only; filters before search/count | Skill and feature controls, known catalogues | `src/skill_discovery.js:55`, `:96`, `:123`, `:138`; `src/skill_discovery_native.js:1` |
| Actor appraisal and observation | The `observation` effect stores selected fact and `<as>.observedAt` in A; K can store partial/attributed interpretation | Simulation, field or owning local panel | `src/simulation_effects.js:231`; `src/simulation_content.js:69`; `src/chronicle.js:188` |
| Sourced means and learned powers | A sources; S faculties/powers/mastery/progression; acquired source differs from owned physical tool | Practice and owning local actions | `src/capabilities.js:5`, `:56`; `src/skill_expansion_content.js:21`, `:32`, `:73`, `:195` |
| Rat-step observation, study and practice | A techniques: observation/understanding/ownership evidence, proficiency, frozen practice and last-practice receipt | Technique panel in Practice; footing consumers | `src/techniques.js:42`, `:99`, `:128`, `:168`; `src/technique_content.js:7`, `:18`; `src/main.js:3710` |
| Chronicle inspection, lessons and archive | E chronicle knowledge/relationships/events/log and life; archive completion receipt | Chronicle, People, world events | `src/chronicle.js:78`, `:135`, `:155`, `:188`, `:278` |
| Event/news feed | No new state. Reads only received K, discovered events and completed receipts; recent news limited to eight | World events above message box, Life and Heard details | `src/event_feed.js:3`, `:37`, `:53`, `:87`, `:102`; `src/event_feed_ui.js:5`, `:17` |
| Life record | `life_record` schema 1, bounded recent entries/year summaries, observed world; lossy, never reward authority | Life record panel and World events Life | `src/life_record.js:1`, `:10`, `:41`, `:65`, `:75`; `src/life_record_ui.js:1`; `src/main.js:5188` |
| Anonymous instrument observation | K, S situation/checks; detection, claim and learned identity remain distinct | Observation panel in People | `src/observation_content.js:10`, `:13`, `:45`, `:61` |
| Scoped remote viewing evidence | `realmPrototype.observation` channel state with leases/receipts, acquired listener source and endpoint/body refs | Pocket realm panel; replay is read-only | `src/observation_channels.js:43`, `:48`, `:65`, `:313`; `src/pocket_observation.js:63`, `:92` |

## Local research and technology chains

These reuse K/A/W, real inventory and frozen S jobs/claims/sites. Their
optional enrolments and exact validators are part of the mechanism, not a
promise that absence in any old save automatically enables them.

| Mechanism | State actually saved and effect | Panel | Source locators |
|---|---|---|---|
| Field workshop | A method/facility, source and mastery; W project phases; observed road report; specialist stock/jobs and real kits | Field panel, Here | `src/field_workshop.js:71`, `:75`, `:78`, `:83`, `:86`, `:101` |
| Paid cooling learning and refinement | K instruction; acquired active cooling source/mastery; conserved charged/empty sleeves and actual material conversion | Feature workshop | `src/reference_gameplay_content.js:25`, `:32`, `:40`, `:42`; `src/cooling_refinement_content.js:25`, `:84` |
| Ordinary clamping fixture | A enrollment/terms/access/completions; W actual frame/builder; K matching commission; timed stock-to-kit work | Feature, Eda clamping frame | `src/audited_workshop_fixture.js:45`, `:73`, `:114`; `src/audited_workshop_host.js:28` |
| Earned focused application lesson | A offered/choice/redeemed; paired K; completed paid lesson enables same-input two-minute resin job | Feature, Eda earned choice | `src/audited_workshop_lesson.js:56`, `:69`, `:121`, `:174`; `src/audited_workshop_facts.js:7` |
| Timber observations to measuring jig | K actual trim/dry observations and paid understood research; separate jig construction and salvage; S specialization | Feature, remainder home | `src/audit_remainder_home_content.js:96`, `:108`, `:113`, `:119`, `:131`; `src/audit_remainder_home_facts.js:105` |
| Manual commissioning and prepared reading | Actual clearance manual, trial/comparison, known procedure, fatigue; later knife/kit jobs | Feature, clearance study | `src/steam_boh_content.js:13`, `:24`, `:44`, `:53`, `:62` |
| Offered-stock appraisal | K issued report precision and actual offer/source attribution; paid inspection has frozen support | Feature, stock reports | `src/steam_df_content.js:22`, `:26`, `:36`; `src/steam_df_runtime.js:74` |
| Installed retort production | Actual installed site, work plan, held fuel/inputs/receivers and K outputs/stalls | Feature, retort | `src/factorio_retort_content.js:39`, `:55`, `:100`; `src/factorio_retort_host.js:1` |
| Assay and identification | K and actual sample/item variants, declared traits and finite offer; identification affects item view and useful work | Feature, assay; inventory item view | `src/game_absorption_assay_content.js:30`, `:52`; `src/game_absorption_assay_facts.js:98`; `src/game_absorption_assay_item_view.js:1` |
| Fieldcraft object identification/companion work | K identification, actual stock/custody, dog satiety/body/effort; inspection differs from use | Feature, fieldcraft; inventory item view | `src/nethack_fieldcraft_content.js:27`, `:45`; `src/nethack_fieldcraft_item_view.js:1` |
| Local nursery and lamb-like routines | K instruction; real supplied tray/sow/harvest or participant/stock jobs | Feature nursery and local routine sections | `src/steam_oni_content.js:19`, `:26`; `src/steam_lamb_content.js:23`; `src/steam_absorption_content.js:8` |
| Current-sample lens measurement | K plus frozen sample/cause/body context; owned, exact loan and owner-service routes; deposit/custody separate | Feature, lens service | `src/world_completion_lens_content.js:27`, `:41`, `:60`; `src/world_completion_lens_facts.js:1` |
| Datum learning and making | Personal/teacher K and source, sponsored learner own travel/effort, native strip stamped with sample/measurement/production/maker evidence | Feature, datum learning | `src/world_completion_learning_content.js:14`, `:47`, `:65`, `:87`, `:98`; `src/world_completion_learning_facts.js:51`; `src/world_completion_strip.js:1` |
| Materials consequence | W disposal/cover/sample causes, K receipts, frozen job metadata; exact measured strip/offcuts affect existing finite crop and drain | Feature, timber/drain/herb bed | `src/world_completion_materials_content.js:65`, `:96`, `:119`; `src/world_completion_materials_facts.js:40`, `:139`; `src/world_completion_materials_host.js:26`, `:50`; `src/world_completion_materials_runtime.js:30` |
| Learned warnings, delivered evidence and conditional response | K firsthand sample, paid relay, recipient knowledge/decision, actual trial/crop/rain state; knowing is separate from physical intervention | Feature, lore/work and world completion | `src/lore_practice_content.js:25`, `:119`, `:146`, `:197`; `src/world_completion_life_content.js:14`, `:23` |
| Household/workshop fit-out and imported notebook adaptation | A rights/adapted, W phases/rack/bench; K exact receipts; physically held mature notebook; improved drying/fitting/kit jobs | Feature, home furnishings at Shack | `src/home_furnishing_content.js:39`, `:70`, `:78`, `:86`; `src/home_furnishing_facts.js:49`, `:94`, `:159`; `src/home_furnishing_host.js:29` |
| Mother of Learning catalogue work | A catalogWorked, K received account; six-minute finite funded job pays crowns/paper. No search-speed modifier is declared in this job | Feature, Cyoria local work | `src/book_world_mol_actions.js:43`, `:44`; `src/book_world_mol_state.js:51`; `src/book_world_mol_host.js:1` |
| Mother of Learning research chain | K study/sample/temporal/received research/notebook; A learned/tested/standing/mastery, W deposited/aftermath; real paper/notebook and actual device construction/control. Ongoing research gives Literacy XP | Feature, Cyoria research/work; People received accounts; event feed | `src/book_world_mol_actions.js:45`, `:47`, `:67`, `:69`, `:71`, `:80`; `src/event_feed.js:61` |
| Glasshouse packing study | W research.complete in retained instance; player/caretaker K; paid kit trial teaches packing, separate actual template transfer and later kit consumer | Pocket realm panel, Here | `src/pocket_realm_content.js:43`, `:82`, `:160`, `:164`, `:168`, `:174`; `src/pocket_realm_host.js:1` |
| Causal case research and instruction | Actor-owned K, paid request, separate NPC completed study and received player account; source/current-person support then learned intervention | Causal story panel, Here | `src/causal_story_content.js:153`, `:160`, `:165`, `:170`; `src/causal_story_actors.js:125` |
| Field comparison, mastery and shared inquiry | K question/dossier/test context; A trained/feat/insight; S powers/advancements; actual task changes | Original Frontier panel | `src/original_frontier_field_content.js:60`, `:97`, `:218`, `:282`; `src/original_frontier_career_content.js:21` |
| Alloy tool capability | Native actual ingot/brace inventory and derived function, not generic tech level | Crafting/equipment and field consumers | `src/alloy_equipment.js:5`, `:10`, `:21`; `src/crafting_recipes.js:1187` |

## Other knowledge/unlock-producing content families

The following are additional applications of the shared mechanisms, not new
research engines. Each saves K plus its owning actor/world facts, jobs,
claims, relationships, acquired sources/powers or situation receipts as
applicable. Physical results live in native/simulation inventory. Public UI
shows only earned/received accounts. The producer index below includes host
and reducer writes too, so a helper is not counted as a separate system.

| Family | Additional persistent meaning | Panel and producer locator |
|---|---|---|
| Basic commissions, helpers, local livelihood and town | Supplied work, observed reports and completion/access | Simulation/town/local panels: `src/simulation_content.js:69`, `src/helper_content.js:18`, `src/local_livelihood_content.js:10`, `src/encounter_content.js:9` |
| Body, everyday life and field care | Learned body feedback/conditions, actual care observations | Body/field/local: `src/body_progression.js:28`, `src/everyday_life.js:23`, `src/field_care_content.js:6`, `src/field_care_battle.js:24` |
| Skill, status/book care and balm | Learned family/source or care action; supported ordinary/power effect | Practice/Feature: `src/skill_expansion_content.js:21`, `src/status_care_content.js:44`, `src/book_care_content.js:20`, `src/contextual_balm_content.js:35` |
| Promise, party, exchange, pursuit and social | Received claim, invitation, consent, contribution or contact | Respective People panels: `src/promise_content.js:9`, `src/party_content.js:15`, `src/exchange_content.js:9`, `src/pursuit_content.js:15`, `src/crush_social_content.js:13` |
| Frontier crossing/campaign and agreed duties | Route/acquisition/settlement knowledge and finite commissioned continuation | Frontier/Feature: `src/frontier_campaign.js:30`, `src/original_frontier_campaign_content.js:26`, `src/agreed_duty_content.js:8`, `src/agreed_duty_continuation.js:12` |
| Feature objects, powers, society, battles, destinations and reference desk | Learned offer/method/inspection with independent current eligibility and real consumers | Feature: `src/feature_expansion_objects.js:37`, `src/feature_expansion_powers.js:44`, `src/feature_expansion_society.js:24`, `src/feature_expansion_battle.js:47`, `src/feature_expansion_destination.js:19`, `src/feature_expansion_reference_desk.js:16` |
| Nested campaigns, carrier chains, lived local roles and subtle relay | Received branch/role evidence; carrier/custody, attributed authorship and response | Feature/nested/People: `src/feature_expansion_nested_content.js:50`, `src/feature_expansion_nested_chains.js:22`, `src/feature_expansion_nested_life.js:17`, `src/feature_expansion_subtlety_scene.js:21` |
| Repository absorption chains/substitutions | Known process alternatives, actual stock work and constraints | Repository panel: `src/repository_absorption_content.js:37`, `src/repository_absorption_chains.js:16`, `src/repository_absorption_substitutions.js:12` |
| Remainder livelihood/offers/consequences/combat | Received offers, process choices, site/recipient/paid-result evidence | Feature: `src/audit_remainder_livelihood_content.js:30`, `src/audit_remainder_offers_content.js:17`, `src/audit_remainder_consequences_content.js:37`, `src/audit_remainder_combat_fit_content.js:34`, `src/audit_remainder_combat_objectives_content.js:76` |
| Paradise campaign and Proto23 | Local study/acquisition/reports, separately qualified worlds/native consumers | Feature: `src/book_world_paradise_actions.js:16`, `src/book_world_paradise_campaign_content.js:28`, `src/proto23_world_content.js:33` |
| Management and Ink scenes | Management methods/agreements; authored narrative knowledge effects | Management/Ink/nested panels: `src/management/shared.js:16`, `src/ink_scene_content.js:12` |
| Foundation beginnings/interactions | Starting or observed actor knowledge and allowed interactions | Opening/local interaction panel: `src/foundation_start_content.js:17`, `src/foundation_interaction_content.js:42` |

The native Export reward adds an inspiration active effect (`src/main.js:4900`);
its label does not establish an RV4 research-evidence system.

Titles, quests and achievement counters are recognition/unlock consumers, not
research evidence (`src/titles.js:68`, `src/quests.js:1`). Book recognition,
roster, cultivation and subtlety catalogues are author/source metadata and rule
bindings; catalogue membership does not give the player their contents
(`src/feature_expansion_book_catalogue.js:26`, `:36`). Material recipe data,
monster templates and static skill lists likewise contain author knowledge.

## C7. Save joins and compatibility

Native state is serialized by `src/main.js:4936` onward: availabilities
`:5042`, book time `:5112`, bestiary `:5149`, item log `:5150`, life record
`:5188`, expansion `:5190`. Native levels serialize at `src/main.js:4985`, and the career, Fort and Work
Ledger owners serialize at `:5180`, `:5184`, `:5185`. Native levels/legacy XP load at `:5540`/`:5568`;
books restore separately at `:5475`; recipes have a legacy path at `:6906`.

Expansion load clones current schemas and validates them, while only older
schemas 1–4 take the generic additive migration path
(`src/expansion_engine.js:136`, `:256`, `:267`). Schema 11 has explicit optional
owner prerequisites (`:141`). New fields need an actual validator/loader join;
an object surviving JSON serialization is insufficient compatibility proof.

Plan publication copies the whole envelope, writes staged expansion, money,
clock, inventory/XP, unlocks and native patches, validates, then writes storage
before live publication (`src/expansion_persistence.js:7`, `:30`, `:47`;
`src/main.js:921`, `:950`). Native craft has its own rollback scope
(`src/main.js:4136`, `src/native_craft_transaction.js:4`). A rider crossing
these two owners needs one atomic plan or a declared failure/recovery contract.

File import validates the full envelope and runs preflight before storage
(`src/save_files.js:40`, `:186`; `src/import_probe.js:2`). Guarded saves use a
4 MiB storage budget (`src/save_files.js:196`, `:209`). Existing migrations
preserve retired content and convert legacy kits without new grants
(`src/save_compatibility.js:9`, `src/save_migration.js:3`).

No general anomaly queue, arbitrary invention interpreter, multi-stage research
project scheduler, universal numeric measurement/calibration model or automatic
encounter-to-research evidence ledger was established by this search. This is
a scoped absence finding about the searched owners, not proof that every
possible private pack lacks one.

## Producer coverage index

Keyword hits include UI projections, static author catalogues and ordinary
native unlock handlers as well as research. This index lists every source module
with a literal knowledge, observation or unlock effect declaration found by the
scan, including reducer/host writes. It supplements the family/state/panel
tables above; declaration presence alone establishes neither registration nor
player reachability. No private prose or hidden rule values are reproduced.

| Module | First declaration locators |
|---|---|
| `src/agreed_duty_content.js` | `src/agreed_duty_content.js:8`, `src/agreed_duty_content.js:10` |
| `src/agreed_duty_continuation.js` | `src/agreed_duty_continuation.js:12` |
| `src/agreed_duty_host.js` | `src/agreed_duty_host.js:11`, `src/agreed_duty_host.js:98` |
| `src/artifact_workshop_content.js` | `src/artifact_workshop_content.js:22` |
| `src/audit_remainder_combat_fit_content.js` | `src/audit_remainder_combat_fit_content.js:34` |
| `src/audit_remainder_combat_objectives_content.js` | `src/audit_remainder_combat_objectives_content.js:76` |
| `src/audit_remainder_consequences_content.js` | `src/audit_remainder_consequences_content.js:37`, `src/audit_remainder_consequences_content.js:40` |
| `src/audit_remainder_consequences_facts.js` | `src/audit_remainder_consequences_facts.js:131`, `src/audit_remainder_consequences_facts.js:142` |
| `src/audit_remainder_home_content.js` | `src/audit_remainder_home_content.js:37` |
| `src/audit_remainder_livelihood_content.js` | `src/audit_remainder_livelihood_content.js:30` |
| `src/audit_remainder_offers_content.js` | `src/audit_remainder_offers_content.js:17` |
| `src/audit_remainder_state.js` | `src/audit_remainder_state.js:19` |
| `src/audited_workshop_fixture.js` | `src/audited_workshop_fixture.js:25` |
| `src/audited_workshop_lesson.js` | `src/audited_workshop_lesson.js:22` |
| `src/body_progression.js` | `src/body_progression.js:28`, `src/body_progression.js:30`, `src/body_progression.js:41` |
| `src/book_care_content.js` | `src/book_care_content.js:20` |
| `src/book_world_mol_actions.js` | `src/book_world_mol_actions.js:17` |
| `src/book_world_mol_host.js` | `src/book_world_mol_host.js:56`, `src/book_world_mol_host.js:67`, `src/book_world_mol_host.js:68` |
| `src/book_world_paradise_actions.js` | `src/book_world_paradise_actions.js:16` |
| `src/book_world_paradise_campaign_content.js` | `src/book_world_paradise_campaign_content.js:28` |
| `src/book_world_paradise_host.js` | `src/book_world_paradise_host.js:15`, `src/book_world_paradise_host.js:71`, `src/book_world_paradise_host.js:72` |
| `src/causal_story_actors.js` | `src/causal_story_actors.js:45` |
| `src/causal_story_content.js` | `src/causal_story_content.js:23` |
| `src/causal_story_host.js` | `src/causal_story_host.js:37` |
| `src/contextual_balm_content.js` | `src/contextual_balm_content.js:35` |
| `src/cooling_refinement_content.js` | `src/cooling_refinement_content.js:21` |
| `src/crush_social_content.js` | `src/crush_social_content.js:13` |
| `src/encounter_content.js` | `src/encounter_content.js:9` |
| `src/everyday_life.js` | `src/everyday_life.js:23` |
| `src/exchange_content.js` | `src/exchange_content.js:9` |
| `src/factorio_retort_content.js` | `src/factorio_retort_content.js:47` |
| `src/feature_expansion_battle.js` | `src/feature_expansion_battle.js:47`, `src/feature_expansion_battle.js:54`, `src/feature_expansion_battle.js:262` |
| `src/feature_expansion_destination.js` | `src/feature_expansion_destination.js:19` |
| `src/feature_expansion_nested_chains.js` | `src/feature_expansion_nested_chains.js:22` |
| `src/feature_expansion_nested_content.js` | `src/feature_expansion_nested_content.js:50` |
| `src/feature_expansion_nested_host.js` | `src/feature_expansion_nested_host.js:29` |
| `src/feature_expansion_nested_life.js` | `src/feature_expansion_nested_life.js:17` |
| `src/feature_expansion_objects.js` | `src/feature_expansion_objects.js:37`, `src/feature_expansion_objects.js:158`, `src/feature_expansion_objects.js:178` |
| `src/feature_expansion_powers.js` | `src/feature_expansion_powers.js:44` |
| `src/feature_expansion_reference_desk.js` | `src/feature_expansion_reference_desk.js:16` |
| `src/feature_expansion_society.js` | `src/feature_expansion_society.js:24` |
| `src/feature_expansion_subtlety_scene.js` | `src/feature_expansion_subtlety_scene.js:21` |
| `src/field_care_battle.js` | `src/field_care_battle.js:24` |
| `src/field_care_content.js` | `src/field_care_content.js:6` |
| `src/field_workshop.js` | `src/field_workshop.js:10`, `src/field_workshop.js:31`, `src/field_workshop.js:96` |
| `src/foundation_interaction_content.js` | `src/foundation_interaction_content.js:42` |
| `src/foundation_start_content.js` | `src/foundation_start_content.js:17` |
| `src/frontier_campaign.js` | `src/frontier_campaign.js:30` |
| `src/game_absorption_assay_content.js` | `src/game_absorption_assay_content.js:30` |
| `src/helper_content.js` | `src/helper_content.js:18`, `src/helper_content.js:27`, `src/helper_content.js:38` |
| `src/home_furnishing_content.js` | `src/home_furnishing_content.js:23` |
| `src/ink_scene_content.js` | `src/ink_scene_content.js:12`, `src/ink_scene_content.js:142`, `src/ink_scene_content.js:261` |
| `src/local_livelihood_content.js` | `src/local_livelihood_content.js:10` |
| `src/lore_practice_content.js` | `src/lore_practice_content.js:26`, `src/lore_practice_content.js:118`, `src/lore_practice_content.js:126` |
| `src/management/shared.js` | `src/management/shared.js:16` |
| `src/nethack_fieldcraft_content.js` | `src/nethack_fieldcraft_content.js:28` |
| `src/observation_content.js` | `src/observation_content.js:10` |
| `src/original_frontier_campaign_content.js` | `src/original_frontier_campaign_content.js:26` |
| `src/original_frontier_career_content.js` | `src/original_frontier_career_content.js:21`, `src/original_frontier_career_content.js:23` |
| `src/original_frontier_field_content.js` | `src/original_frontier_field_content.js:23`, `src/original_frontier_field_content.js:132`, `src/original_frontier_field_content.js:232` |
| `src/party_content.js` | `src/party_content.js:15` |
| `src/pocket_observation.js` | `src/pocket_observation.js:20` |
| `src/pocket_realm_content.js` | `src/pocket_realm_content.js:82`, `src/pocket_realm_content.js:122` |
| `src/pocket_realm_host.js` | `src/pocket_realm_host.js:20` |
| `src/pocket_realm_scenes.js` | `src/pocket_realm_scenes.js:54` |
| `src/promise_content.js` | `src/promise_content.js:9` |
| `src/proto23_world_content.js` | `src/proto23_world_content.js:33`, `src/proto23_world_content.js:127` |
| `src/proto23_world_host.js` | `src/proto23_world_host.js:128` |
| `src/pursuit_content.js` | `src/pursuit_content.js:15`, `src/pursuit_content.js:18`, `src/pursuit_content.js:29` |
| `src/reference_gameplay_content.js` | `src/reference_gameplay_content.js:25` |
| `src/repository_absorption_chains.js` | `src/repository_absorption_chains.js:16` |
| `src/repository_absorption_content.js` | `src/repository_absorption_content.js:37` |
| `src/repository_absorption_substitutions.js` | `src/repository_absorption_substitutions.js:12`, `src/repository_absorption_substitutions.js:48` |
| `src/simulation.js` | `src/simulation.js:517` |
| `src/simulation_content.js` | `src/simulation_content.js:69`, `src/simulation_content.js:83`, `src/simulation_content.js:91` |
| `src/skill_expansion_content.js` | `src/skill_expansion_content.js:21`, `src/skill_expansion_content.js:32`, `src/skill_expansion_content.js:181` |
| `src/status_care_content.js` | `src/status_care_content.js:44` |
| `src/steam_boh_content.js` | `src/steam_boh_content.js:35` |
| `src/steam_df_content.js` | `src/steam_df_content.js:22` |
| `src/steam_df_runtime.js` | `src/steam_df_runtime.js:74` |
| `src/steam_lamb_content.js` | `src/steam_lamb_content.js:23` |
| `src/steam_oni_content.js` | `src/steam_oni_content.js:19` |
| `src/world_completion_learning_content.js` | `src/world_completion_learning_content.js:28` |
| `src/world_completion_learning_runtime.js` | `src/world_completion_learning_runtime.js:68` |
| `src/world_completion_lens_content.js` | `src/world_completion_lens_content.js:27` |
| `src/world_completion_life_content.js` | `src/world_completion_life_content.js:14` |
| `src/world_completion_materials_content.js` | `src/world_completion_materials_content.js:46` |
