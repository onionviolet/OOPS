# Relationship prerequisites audit, 2026-10-14

**F1 [Inferred].** The first pass understates existing social groundwork and overstates a mandatory store merge. The cheapest useful follow-up is a documented directed-reader contract, then evidence-aware views and one optional offer using existing facts. New family, continuity and idle systems remain proposals.

**Scope [Shown].** Source-read documentation pass in the dirty current checkout. No gameplay source, tests, bundle, save or private pack was edited. No build, test suite, browser proof, commit or push was run. This audit owns only this file, part 29 and the part 29 index row. The dispatch's `runs/SESSIONS.md` records that write scope. Existing dirty files and other active work are outside it.

**Method [Inferred].** CONFIRMED means supported by current source; WRONG means the claim is false, too broad or points at the wrong operation; UNVERIFIED means evidence was insufficient. Labels distinguish **Shown** in source, **Stated** in documents and **Inferred** analysis/proposals. Negative search results apply to this checkout, not all future content or private packs. Counts below classify the 15 original section-1 Have cells as composite claims, not individual clauses or every later audit finding. Sections 2 and 3 are also checked below but are proposed dependencies/slices rather than Have cells.

## 1. Every original Have cell and citation

| Code | Status and evidence class | Original claim and checked reference | Correct fact and disposition |
|---|---|---|---|
| H01 / RQ1 | CONFIRMED [Shown] | Directed store at `src/simulation_contracts.js:218`; chronicle axes/ties at `src/chronicle.js:34-38`. | Directed state is validated at `:250`. Chronicle validation bounds axes to ±100; actual clamping is `src/chronicle.js:67`. Typed ties are checked at `:38`. Both stores exist. Kept the shown Have facts; corrected the unsupported claim that all consumers must ask both stores and retained merge as an option. |
| H02 / RQ2 | CONFIRMED [Shown] | Person ids per owner, no original file:line. | Simulation requires ids present in both actor/person owners (`src/simulation_contracts.js:232,237-239`); household ids are unique locally (`src/npc_lives.js:27-28`). Stable local ids are not yet a universal counterpart map. Kept Have and clarified that name equality is not identity evidence. |
| H03 / RQ3 | WRONG [Shown] | Open axes and eleven owners, citing part 20 X3. | Open finite axes are shown at `src/simulation_contracts.js:250`. The writer inventory below spans more than eleven files; files are not themselves distinct authority domains. Replaced the stale count with named axes and many writers. Do not migrate distinct semantics into one word merely because they look similar. |
| H04 / RQ4 | WRONG [Shown] | Player location/transit; NPC presence only in a few book owners. | Every simulation person has location (`src/simulation_contracts.js:238`); the Village craftsman has current presence/busy facts (`src/everyday_life.js:60-65`). Participant reservations already reject overlaps (`src/simulation_contracts.js:261-262`). Corrected Have; generic daily roaming schedules are still missing. |
| H05 / RQ5 | WRONG [Shown] | Shared scheduler from the chronicle; yearly NPC tick at `src/npc_lives.js:33-38`. | Shared advancement is owned by `src/expansion_engine.js:588-626`, integrating chronicle boundaries. Jobs, moods, controllers and routines advance at `src/simulation.js:470-550`. The cited yearly function clones existing lives and reveals preauthored event news; it does not generate ties. Corrected clock attribution and the missing-mood-decay claim. |
| H06 / RQ6 | WRONG [Shown] | None; no temperament field anywhere. | No literal temperament field was found in public JS, but preferences are authored at `src/everyday_life.js:23`, moods at `:15-28`, and patient testing is disclosed at `src/crush_social_content.js:37`. Corrected None to partial tastes/moods; reusable temperament response rules remain unimplemented in the inspected seams. |
| H07 / RQ7 | WRONG [Shown] | One effect at `src/simulation_effects.js:284-291`; receipt, eleven positive owners, negatives only attacks. | Relationship effect is actually `:285-292`; receipt is `:289`, write/retention `:291-292`. Direct memory writers also exist (`src/backlog_expansion_body.js:136-139`; `src/backlog_expansion_replacement.js:67-68`). Interruption lowers respect (`src/everyday_life.js:28-29`); disputed office claims, harmful allocation and false exclusivity lower respect (`src/feature_expansion_nested_chains.js:87,139,148,216`). Corrected Have and the citation. |
| H08 / RQ8 | WRONG [Shown] | Elder lesson/inheritance is the only gate; `relationship.<axis>` exists but no predicate uses it (part 20 X7). | The literal fact seam is shown at `src/simulation_effects.js:156`; no authored literal predicate reader was found. Elder lesson also needs control-pattern knowledge and an open event (`src/chronicle.js:212-214`); inheritance uses duty/grievance and event resolution (`:202-204`). A non-elder revisit asserts prior directed memory (`src/backlog_expansion_replacement.js:161`). Corrected the exclusive reader claim and bound the suggested offer to a direction. |
| H09 / RQ9 | CONFIRMED [Shown] | Chronicle ties for one person, one-favor recruit cap at `src/village_career.js:49-50`, promise content. | Elder tie mutations are shown at `src/chronicle.js:199-219`; cap and earning conditions are exactly at career `:49-50`. Promise situations hold phases, response windows and attributed evidence (`src/promise_content.js:5-20`). This is partial obligation groundwork, not one general obligation ledger. Kept row. |
| H10 / RQ10 | WRONG [Shown, citation] | Per-person knowledge-prefix facts at `src/simulation_effects.js:157`. | The original line is now the observation-boundary comment; actual prefix filtering is `:158`, inside a target-bound context (`:131`). It exposes the observing actor's entries, not universal knowledge of a person's truth. Updated citation below; general actor knowledge writers already exist, so absence of all writers is too broad. |
| H11 / RQ11 | WRONG [Shown] | NPC-to-NPC family links only at `src/npc_lives.js:5-23`. | Family links are shown there, but direct donor/recipient memories also exist at `src/backlog_expansion_body.js:401,432-433`. Corrected Have. Autonomous village friendship generation remains missing; adding it is not simply using the news-reveal tick. |
| H12 / RQ12 | CONFIRMED [Shown] | Party list and household family links; no original citation. | `party: []` is initialized at `src/simulation_contracts.js:218`; join/leave effects at `src/simulation_effects.js:379-382`. Household family links are at `src/npc_lives.js:12-20`. Neither is a full household/group stock-and-duty owner. Kept row. |
| H13 / RQ13 | WRONG [Shown] | Rebirth wipes ties both ways at `src/simulation.js:573,580`. | Those lines run when `reset` explicitly includes relationships; rebirth handling is separate at `:581-584`. A bounded heir already preserves predecessor recognition, grievance/archive duty and succession (`src/chronicle.js:297-301`). Corrected blanket rebirth and missing-all-carriers wording. General RX bond manifests remain proposals. |
| H14 / RQ14 | CONFIRMED [Shown] | People notebook memories mix directions (`src/people_knowledge.js`, `src/people_ui.js`). | Helper-to-player is read at knowledge `:52`; player-to-porter/clerk at `:59-63`. UI renders text at `src/people_ui.js:26`. No direction label appears in those rows. Equal titles already get location suffixes (`:11-13`). Kept Have; corrected A3's assumption that disambiguation is wholly absent. |
| H15 / RQ15 | CONFIRMED [Shown] | Both stores validated and saved; no original citation. | `src/expansion_engine.js:146-147` validates both; `src/main.js:5190` includes expansion in the native envelope. Loader restoration is at `src/main.js:5308`; file validation is `src/save_files.js:73,145`. Kept Have; refined save-free claims for axis mapping and offers. |

**Counts [Shown]: 6 CONFIRMED, 9 WRONG, 0 UNVERIFIED Have cells (H10 is a correct fact with a wrong original line reference).** Source confirmation is not rebuilt gameplay acceptance.

**F2 [Shown, correction].** RQ10's prefix citation is corrected to `src/simulation_effects.js:158`. Its Missing cell is narrowed to reusable who-knows-whom fields/adapters rather than absence of knowledge writers: `src/promise_content.js:25-38` already writes each side's recollection, inference and observed evidence. RQ7's listed examples remain proposals beyond existing interruption, apology, shared work and claim consequences.

## 2. Sections 2 and 3: misordered or understated dependencies

| Code | Finding and evidence class | Correction or next design need |
|---|---|---|
| F3 | [Inferred from shown seams] SH1 to SH8 and SH10 name reasonable shared owners, but the claim that these all become content once the spine exists is too broad. | Teaching, trade, hiring, family and institutions also need authoritative quotes, ownership, permission and settlement adapters. Record these as extra contracts, not automatic unlocks. |
| F4 | [Shown] SH9 says party combat is beyond the current solo fighter and assigns moods to RQ10. | The bounded two-fighter braced contest exists (`src/party_battle.js:29-38`). Consent is read at `:20-22`. Corrected SH9 to general party/routine gaps; moods belong to conditions and time, not who-knows-what. |
| F5 | [Shown/Inferred] A1's target-relative fact reads actor-to-target axes (`src/simulation_effects.js:156`). Most cooperative writes record NPC-to-player; party rest writes player-to-helper (`src/party_content.js:20`). | A player command reading its own trust does not prove the NPC trusts the player. Bind actor/target and project the required reverse-edge willingness, or author a genuinely NPC-issued offer. Threshold two is illustrative and may be unreachable for a chosen current edge. Use a lesson before a discount, which needs trader settlement integration. |
| F6 | [Shown/Inferred] A2's direct words-from-axes approach is not automatically observer-safe; A3's plain disambiguation partly exists. | Words need received or witnessed evidence. Existing role suffixes and equal-title location tags mean a review is cheaper than new duplicate-name machinery. Corrected A2/A3 without removing rows. |
| F7 | [Inferred] A4 wrongly says every later slice waits for a merge; the section-1 spine places readers after new schedules and temperament. | Name owners and read existing facts first. A merge needs separate compatibility work; it is not needed for a direction label or the existing elder gate. Corrected A4 and the dependency paragraph. |
| F8 | [Stated/Inferred] A5's fixed daily limit copies MF1 but conflicts with adjective-based limits and may create a click chore. | Reworded as elapsed eligible contact with world cadence/saturation dials and a persistent cursor/retention decision. This is larger than the five cheapest steps below. |
| F9 | [Shown/Inferred] The two stores have different semantics and validation. | Simulation axes are finite without the chronicle's ±100 clamp; chronicle ties are flat typed values. A naive merge could alter thresholds, obligation meaning and receipt identity. Add an owner/adapter contract before proposing migration (`src/simulation_contracts.js:250`; `src/chronicle.js:34-39,62-69`). |

## 3. Missed foundations

| Code | Evidence class and finding | What the proposal now adds |
|---|---|---|
| F10 | [Shown] Both memory stores keep 32 entries; chronicle has 64 owners (`src/simulation_contracts.js:250`; `src/simulation_effects.js:292`; `src/chronicle.js:34-39,69`). Household is bounded at 32 people, 64 events and 16 news (`src/npc_lives.js:26`). | RZ separates recent history, durable facts and replay receipts. These are validation bounds, not accepted friend limits or a measured byte budget. |
| F11 | [Shown/Inferred] Relationship receipts accumulate in `simulation.causes` independently of memory trimming (`src/simulation_effects.js:289-292`). Memory-based readers can lose their cause when old entries roll off (`src/audit_remainder_consequences_facts.js:37,244`; `src/backlog_expansion_replacement.js:161`). | Summaries must retain facts that readers require; receipt compaction must preserve replay behavior. Stored commitments cannot depend solely on the last 32 conversations. |
| F12 | [Shown/Inferred] Boundary discovery and execution scan jobs, events, controllers, conditions and people (`src/simulation.js:452-457,470-550`). People UI repeatedly filters known rows and serializes card signatures (`src/people_ui.js:12,22,29`). No large-cast benchmark was found/run. | RZ sparse active edges, due-work scheduling and byte/render/boundary measurements. Performance is UNVERIFIED as a separate question, not a failed Have claim. No performance implementation is authorized. |
| F13 | [Shown] Reviewed offline packing exists, bounded by paid escrow, trusted elapsed wall timestamp, explicit review and shared-clock settlement (`src/backlog_expansion_time.js:80-86,197-221,283-288`; `src/backlog_expansion_host.js:80-94`; native wall binding at `src/main.js:1456`). | RI distinguishes that narrow mechanism from general browser-closed social simulation. General wall time, another world, pause and played idle time have separate clocks and authority. |
| F14 | [Shown/Inferred] The generic receipt blocks duplicate cause/actor/target/axis delivery, not future genuine work. Two effects to the same axis under the same cause also share the receipt (`src/simulation_effects.js:289-292`). | Give later elapsed contact fresh epoch/interval causes; retries retain the cause. Combine same-cause deltas before delivery or declare the effect policy. Direct memory writers need their own idempotent command contract. |
| F15 | [Shown/Inferred] Current party permission uses facts; transitions can carry alive companions but do not independently enforce consent (`src/party_battle.js:20-38`; `src/simulation.js:586-588`). | RZ/RCL name combat, party, travel and service readers, scoped willingness and actual means. A relationship score is not ownership or a stat bonus. |
| F16 | [Shown] Structured packs already compile people/commands/controllers and explicit audiences, require person introduction keys and can apply bootstrap effects (`src/structured_pack_definitions.js:73-85`; `src/structured_pack_runtime.js:6-12,68-81`). Presentation reveals people only after their introduction key (`:89-92`). | RAU extends existing person schema and validators with proposed tie templates, social lint, revision handling and fixtures. It does not request another pack loader or read/edit private payloads. |
| F17 | [Shown] Save migration and atomic import seams exist: older expansion migration (`src/expansion_engine.js:256-270`), native biography/kit migration (`src/save_migration.js:1-27`), structural preflight before storage write (`src/save_files.js:158-190`). | RZ8/RAU7 require old-save and missing-pack dispositions for every new persistent social owner. Save-free presentation does not mean a new preference toggle is save-free. |
| F18 | [Shown] Nine MoL actor rows include an original local adversary (`src/book_world_mol_content.js:7-17`); the current campaign declares a retained-body branch (`:5`). Meal continuation explicitly avoids resetting actor/history (`src/book_world_mol_actions.js:73`). No relationship effect writer was found in `src/book_world_mol_*.js`. | RCL/RPW keep lack of regard writes separate from loop-memory behavior. Part 20 X9/RWML1's inference that this already behaves as social loop resets is unsupported. No MoL loop implementation is inferred. |

## 4. Contradictions and tensions, both sides retained

[Stated] Parts 19 to 23 and 28 describe proposals, not accepted constraints. Accepted direction comes from User Vision and PROJECT. The following records both sides; suggested fits are inferred and do not settle world tuning.

| Code | Side in part 29 | Other side and status | Disposition |
|---|---|---|---|
| C1 | [Stated] Missing all social writers beyond gifts/attacks and per-person tastes. | [Shown/Stated] Part 19's dialogue groundwork and existing everyday preference/interruption/apology code already supply several social writes and moods; part 23 UP4 recognizes shared primitives. | Corrected part 29's facts. Leave parts 19/20 untouched; part 20 X4 shares the stale attack-only claim. |
| C2 | [Stated] One store first; merge unblocks every later slice. | [Stated] Part 20's five cheap slices and part 23 AR1 to AR3 are content/view-first using existing state; UP4 names gaps rather than ordering a mandatory merge. | Corrected the mandatory dependency. Store convergence remains an option with migration, not accepted architecture. |
| C3 | [Stated] RQ7/RM6 repetition decay and A5 daily cap can make progression stall. | [Stated] Part 20 MF1 says idle routines count, but RM6 says keep idle loops from grinding. Part 28 SF4 says automated upkeep keeps familiarity, not trust. Accepted User Vision's 2026-10-13 idle clarification allows relevant sustained conditions or queued activity without clicks. | RI2 proposes distinguishing impersonal upkeep from real reliable shared work. No blanket passive-trust ban is adopted. Pace/saturation and which tasks deepen trust remain open per person/world. |
| C4 | [Stated] RQ5 needs a rule for offline catch-up. | [Stated] Part 19 CF9 schedules away conversations; part 20 RD9 letters pile up; part 23 TN2 defaults absent worlds to freeze and leaves wall-clock absence off until authorized. [Shown] Narrow reviewed funded packing already exists. | Separate played idle, absent-world and wall clocks. Accepted passive direction does not authorize universal wall-clock social catch-up. No new offline behavior was enabled. |
| C5 | [Stated] A2 raw axes become words; RQ14 wants both directions. | [Stated] Part 20 UF3 and part 22 FI24 allow words/numbers; part 28 SF1 says the panel is the character's fallible read and truth-reading is a cheat. Accepted User Vision 2026-10-03 and skill discovery direction disclose information only as it comes up. | RUI2/RUI3 preserve evidence gating. Numeric formatting can show known estimates; it is not automatically a truth grant. Exact truth view placement remains proposal tension. |
| C6 | [Stated] RQ13 rebirth wipe and missing carriers; SH5 assumes family/succession depth. | [Shown/Stated] Part 20 RX7/RX8 and part 23 UP8 assume selected inheritance/carry mechanisms; bounded elder heir already carries obligations/recognition. North star romance/family and lineage modes cover much wider lives. | Corrected blanket absence and added per-side manifests, new heir identity and household/property/care separation. General carrier/family mechanics remain open. |
| C7 | [Stated] RQ11 yearly tick is enough to add NPC friendships; SH9 party combat is missing. | [Shown] Household yearly advancement reveals a fixed event list, and bounded party combat exists. [Stated] PE3/PE4 and UP12 need active schedules, needs, groups and duties beyond news. | Separate these owners. Add selected generic schedules/controllers instead of treating annual news as social simulation. |
| C8 | [Stated] The whole spine makes life functions content and can read as a universal build gate. | [Stated] Part 28 DS makes verbs depend on world/body/role; part 22 distinguishes base comfort, world rules and cheats; part 23 TN12 keeps shared primitives but distinct worlds. Accepted direction is everything possible reasonably; the named memory notes say palettes, no global once limits. | RPW8 and section labels keep all new rows proposals selected per fitting slice. No full-world or family prerequisite was added to the one-realm milestone. |

**F19 [Stated/Inferred].** Part 21 RN1 separates private regard from audience reputation, rank and title, and RN3/RN5 require graded claims and communication carriers. RQ10/RQ11 alone do not implement that audience ledger. RZ7, RAU4 and RCL7 keep these readers and carriers distinct; no global reputation effect is inferred from a private tie.

## 5. Five cheapest real next steps, ranked

[Inferred proposals] These are future steps, not work authorized by this pass. Preserve current source ownership before any implementation. Ranks compare useful effort, not mandatory order for all worlds.

| Rank / Code | Step | Save impact | Observable next gate |
|---|---|---|---|
| 1 / N1 | Write a one-page actor/target reader contract and owner map, including reverse-edge willingness, absent-axis behavior, cause scope and chronicle adapter. No merge. | None; docs only. | One real offer's direction is traceable to its actual writer; no duplicate authority. |
| 2 / N2 | Label evidence-safe memory direction and time in the known-person projection. | None; derived view. New settings would be separate state. | Rebuilt 1366x768 notebook shows holder/subject and dates without private reverse-edge leaks. |
| 3 / N3 | Map existing known preference, mood and response evidence to plain words. Retain current name suffixes; fix only observed ambiguous cards. | None for derived mapping/disambiguation; no axis or id rewrites. | Existing craftsman/helper/porter cards are readable and correctly attributed at desktop size. |
| 4 / N4 | One optional target-aware lesson or aid offer reading an existing directed edge plus willingness and supported contact. Use an edge with naturally attainable current state. | No new domain if existing facts suffice; normal completion/knowledge/relationship receipts may grow. | Positive and refused/unavailable branches, source/build/fresh-browser and exact persistence if effects write saved state. |
| 5 / N5 | One remembered preference pays off in a later shared act using existing knowledge and relationship effects. | Additive knowledge/memory/cause rows in existing owners; explicit old-save absent behavior. No schema change assumed solely from that reuse. | Natural discovery to later consequence, then save/reload/export/import and 32-memory retention boundary where a durable reader depends on it. |

[Inferred] Elapsed contact/schedules, generic family owners and store merging cost more than these five. RQ A1 to A5 remain as Claude's slice palette with fact corrections; this ranking does not silently replace them with accepted priorities.

## 6. Search coverage and remaining decisions

[Shown] Read the requested public source owners and targeted north-star/engine/User Vision sections. Read the four named Claude memory notes as routing for palettes, reasonable options, local limits and evidence labels; checked their direction against live User Vision/PROJECT. No relevant hit was found in the Codex memory registry. No private book packs or saves were opened.

[Shown] Searched all `src/**/*.js` for relationship effect object literals, `relationship.` fact strings and `relationships` access. The literal fact family has one evaluator projection (`src/simulation_effects.js:156`) and no authored predicate reader in this checkout. The following inventory lists every source file/line matching a literal `type: relationship`, excluding comparisons in validators/dispatcher. Wrappers and direct writers were then followed separately. Line numbers describe the source-read checkout, not frozen release locations.

| Code | Literal effect source | Lines |
|---|---|---|
| W1 | [Shown] `src/audit_remainder_consequences_content.js` | 43 |
| W2 | [Shown] `src/body_progression.js` | 29 |
| W3 | [Shown] `src/causal_story_host.js` | 248, 259 |
| W4 | [Shown] `src/crush_social_content.js` | 15 |
| W5 | [Shown] `src/encounter_content.js` | 45 |
| W6 | [Shown] `src/everyday_life.js` | 10, 24, 28 |
| W7 | [Shown] `src/exchange_content.js` | 41 |
| W8 | [Shown] `src/feature_expansion_battle.js` | 267 |
| W9 | [Shown] `src/feature_expansion_nested_chains.js` | 21 |
| W10 | [Shown] `src/feature_expansion_nested_content.js` | 51 |
| W11 | [Shown] `src/feature_expansion_society.js` | 26 |
| W12 | [Shown] `src/feature_expansion_subtlety_scene.js` | 22 |
| W13 | [Shown] `src/frontier_campaign.js` | 36, 44, 60 |
| W14 | [Shown] `src/helper_content.js` | 19, 28 |
| W15 | [Shown] `src/local_livelihood_content.js` | 44, 86 |
| W16 | [Shown] `src/management/shared.js` | 17 |
| W17 | [Shown] `src/native_battle.js` | 29 |
| W18 | [Shown] `src/nethack_fieldcraft_content.js` | 89, 102 |
| W19 | [Shown] `src/observation_content.js` | 34 |
| W20 | [Shown] `src/original_frontier_campaign_content.js` | 29 |
| W21 | [Shown] `src/original_frontier_career_content.js` | 22 |
| W22 | [Shown] `src/original_frontier_field_content.js` | 26 |
| W23 | [Shown] `src/party_battle.js` | 53, 54 |
| W24 | [Shown] `src/party_content.js` | 20 |
| W25 | [Shown] `src/pocket_realm_scenes.js` | 56 |
| W26 | [Shown] `src/promise_content.js` | 10 |
| W27 | [Shown] `src/pursuit_content.js` | 22 |
| W28 | [Shown] `src/repository_absorption_chains.js` | 39 |
| W29 | [Shown] `src/repository_absorption_content.js` | 40 |
| W30 | [Shown] `src/repository_absorption_substitutions.js` | 44 |
| W31 | [Shown] `src/simulation_content.js` | 84, 107 |
| W32 | [Shown] `src/skill_expansion_content.js` | 175 |

[Shown] Additional direct relationship-memory writers: `src/chronicle.js:62-69`, `src/backlog_expansion_body.js:136-139`, `src/backlog_expansion_replacement.js:67-68`. Template wrappers such as `management/shared.js` and `feature_expansion_nested_chains.js` were checked at call sites, including their negative amounts.

[Shown] Direct relationship readers and protections found by the broader search: chronicle commands/facts/UI (`src/chronicle.js:130-139,166,199-219`; `src/chronicle_ui.js:92,113-119`), life narration and estate builder (`src/life_experience.js:19-20`; `src/heir_inheritance.js:56`), People/crush views (`src/people_knowledge.js:16-26,52,59-63`; `src/crush_social_views.js:94`), fieldcraft counter checks (`src/nethack_fieldcraft_facts.js:80-83`), remainder cause checks (`src/audit_remainder_consequences_facts.js:37,244`), remembered revisit/recognition (`src/backlog_expansion_replacement.js:161,213`), retention assertions/projections (`src/feature_expansion_book_host.js:57-58,107,129`; `src/backlog_expansion_transit.js:158`; `src/steam_oni_facts.js:58`; `src/steam_boh_facts.js:69`; `src/steam_lamb_facts.js:57`), plus generic fact exposure, validation and transition resets already cited. Broad grep also finds declarative prose naming retained relationships; those statements are not executable tie readers.

### Open decisions, no answer needed to finish this pass

| Code | Evidence class and decision needed only before a build |
|---|---|
| Q1 | [Inferred] Approve the first playable payoff and person. Suggested default: one optional Village lesson/aid offer on existing records; later worlds and family paths remain reachable. |
| Q2 | [Inferred] Set the first idle-contact pace and which reliable shared acts can deepen trust. Suggested default: gentle familiarity plus task-specific trust/respect, with world/person dials and SF4's tell for templated upkeep. |
| Q3 | [Inferred] Authorize any future persistent-domain migration and its compatibility policy when a concrete slice needs it. Suggested default: additive missing-as-absent fields; no merge or historical affection invented. |
| Q4 | [Inferred] Authorize general wall-clock social catch-up if wanted. Suggested default for the first slice: supported played idle time, with explicit absence clocks; broader offline behavior remains a separate implementation decision. |

[Shown] Expansion added sections 4 to 11 with RZ, RFM, RI, RAU, RCL, RUI, RHE and RPW, eight rows each. Original 30 rows remain; total 94. The index previously said 60 for those 30 rows; only its part 29 count was corrected to 94. Gameplay and human acceptance remain outside this audit.


## 7. Documentation checks

[Shown] Counted 94 unique coded rows and retained all 30 original codes. Checked all 64 added codes against other parts for exact row-code clashes. Checked added prose for em dashes and spaced double-hyphen punctuation. The task's index edit changes only part 29's count from 60 to 94. A concurrent writer expanded the part 22 index row during this pass; its changes were preserved. Source/bundle/test snapshots also detected concurrent changes in four source files; this task issued no source writes. Rechecked the relationship contract/effect anchors afterward: `src/simulation_contracts.js:218,250` and `src/simulation_effects.js:156,158,285-292` retain their cited meaning. No gameplay verification is claimed.
