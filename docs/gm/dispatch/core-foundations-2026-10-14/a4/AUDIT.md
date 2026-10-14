# A4 relationship and legacy standing audit, 2026-10-14

Proposal lane A4, extending U08/F4 and M5. Source snapshot: worktree
`core-a4-relationships`, branch `core/a4-relationships`, base commit
`30a2671ecde9ab92a23313a170fbb78ca6de8a8a`. All `file:line` references below
were read there. Main-checkout [COMMON](../COMMON.md),
[prerequisite audit](../../relationship-prereqs-2026-10-14/AUDIT.md) and
[companion palette](../../../../COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md)
were read only. Their proposals remain proposals. This audit adds an exhaustive
public-source inventory and the A4 read contract rather than repeating H01-H15.

## Findings against the scorecard

| Code | Class | Finding |
|---|---|---|
| A4-F1 | SHOWN | The broad U08/F4 “almost nothing reads” / write-only relationship claim is overstated. Chronicle trust and ties gate lessons, succession, restitution, agreed challenges and archive work. Directed memories also support gameplay qualification, consistency checks and People/recap views. See reader inventory below. |
| A4-F2 | SHOWN | The scorecard's **42** matches are confirmed as effect declaration lines in **32 files**, not 42 runtime deliveries, writers or commands. Wrappers generate additional effects. Three direct record helpers and transition deletions are separate. |
| A4-F3 | SHOWN | General simulation social-axis consumption is thin: `src/simulation_effects.js:156` projects actor-to-target axes as `relationship.<axis>`, but no authored literal rule predicate consumes this family in the inspected public source. Fieldcraft does read two training/retrieval axes as consistency counters (`src/nethack_fieldcraft_facts.js:113-116`); these do not establish a general affection gate. |
| A4-F4 | SHOWN / INFERRED | Two incompatible owner shapes are present. Chronicle records a life-counterpart relationship; simulation records an observer/actor-to-target edge. A read adapter can make both accessible without merging their meanings. A score alone establishes neither another actor's consent nor the player's knowledge. |
| A4-F5 | SHOWN | Legacy region reputation already has useful readers: availability conditions, trader margin, display and heir standing. It is not another synonym for personal trust. `src/reputation.js:18-19` is a comment about future unlocks, not the complete reader inventory. |

Recommended scorecard wording [INFERRED]: “Relationships: many producers;
chronicle gates and directed memory consequences already work in source;
general social-axis predicates scarcely consume the simulation projection.
Legacy regional standing affects availability, trade and inheritance;
no general faction/membership owner was established by this audit.” Root owns
the scorecard and decides whether to adopt this wording. No gameplay claim.

## Store contracts and direct mutations

| Code | Class | Owner, operation and evidence |
|---|---|---|
| A4-S1 | SHOWN | `src/simulation_contracts.js:218` initializes relationships. `:230,250` validate actor and target owners, finite named axes and at most 32 memories per edge. Axes are bounded by finite MAX_SAFE_INTEGER magnitude (`:16`), not ±100. Memory entry payloads themselves are not checked by that store validator. |
| A4-S2 | SHOWN | `src/simulation_contracts.js:67` validates relationship effects; `src/simulation_effects.js:58,174-185` resolve participant selectors/party expansion; `:285-292` create directed records, add one axis, append `{cause,at,text}`, retain 32, and guard replay with cause/actor/target/axis receipts. No numeric clamping. Two same-cause effects on one axis share a receipt. |
| A4-S3 | SHOWN | `src/backlog_expansion_body.js:136-139` directly creates an edge and appends bounded memory without an axis delta. Callers at `:286,341,389,401,432-433`, including NPC-to-NPC edges. |
| A4-S4 | SHOWN | `src/backlog_expansion_replacement.js:67-68` directly appends observer-to-player memory. Callers at `:83,105,118`; the helper has no generic effect receipt. Command/scene owners provide the surrounding constraints. |
| A4-S5 | SHOWN | `src/simulation.js:577,584` delete outgoing and incoming edges only when the transition explicitly resets relationships. Rebirth separately clears chronicle at `:585-587` under its end policy. A rebirth is not itself proof that every simulation tie is wiped. |
| A4-S6 | SHOWN | `src/chronicle.js:34-39` validates at most 64 counterpart records, axes within ±100, scalar typed ties and at most 32 `{id,at,text}` memories. `:62-69` creates records, clamps accumulated axes to ±100, assigns ties and retains 32 memories. It is not receipt-idempotent on its own. |
| A4-S7 | SHOWN | Chronicle helper callers: enrollment `src/chronicle.js:83`, fulfilled duty `:137`, pledge `:200`, restitution `:218`, encounter aftermath `:270-271`, heir recognition/obligations `:297-301`. Direct `r.ties.successor = true` at `:204` is also a writer. `:81` initializes an empty store; `:291` creates the heir's new owner rather than copying the old record wholesale. |

## All relationship effect producers

These are every public `src/**/*.js` line declaring `type: 'relationship'`
(including quoted property keys), excluding this lane's new read module.
Rows point to the effect or wrapper declaration, not a claim that every generated
command has been exercised. Helper call sites follow.

| Code | Class | Exact declaration anchors |
|---|---|---|
| A4-W01 | SHOWN | `src/audit_remainder_consequences_content.js:43` |
| A4-W02 | SHOWN | `src/body_progression.js:29` |
| A4-W03 | SHOWN | `src/causal_story_host.js:248`; `src/causal_story_host.js:259` |
| A4-W04 | SHOWN | `src/crush_social_content.js:15` |
| A4-W05 | SHOWN | `src/encounter_content.js:45` |
| A4-W06 | SHOWN | `src/everyday_life.js:10`; `src/everyday_life.js:24`; `src/everyday_life.js:28` |
| A4-W07 | SHOWN | `src/exchange_content.js:41` |
| A4-W08 | SHOWN | `src/feature_expansion_battle.js:267` |
| A4-W09 | SHOWN | `src/feature_expansion_nested_chains.js:21` |
| A4-W10 | SHOWN | `src/feature_expansion_nested_content.js:51` |
| A4-W11 | SHOWN | `src/feature_expansion_society.js:26` |
| A4-W12 | SHOWN | `src/feature_expansion_subtlety_scene.js:22` |
| A4-W13 | SHOWN | `src/frontier_campaign.js:36`; `src/frontier_campaign.js:44`; `src/frontier_campaign.js:60` |
| A4-W14 | SHOWN | `src/helper_content.js:19`; `src/helper_content.js:28` |
| A4-W15 | SHOWN | `src/local_livelihood_content.js:44`; `src/local_livelihood_content.js:86` |
| A4-W16 | SHOWN | `src/management/shared.js:17` |
| A4-W17 | SHOWN | `src/native_battle.js:29` |
| A4-W18 | SHOWN | `src/nethack_fieldcraft_content.js:89`; `src/nethack_fieldcraft_content.js:102` |
| A4-W19 | SHOWN | `src/observation_content.js:34` |
| A4-W20 | SHOWN | `src/original_frontier_campaign_content.js:29` |
| A4-W21 | SHOWN | `src/original_frontier_career_content.js:22` |
| A4-W22 | SHOWN | `src/original_frontier_field_content.js:26` |
| A4-W23 | SHOWN | `src/party_battle.js:53`; `src/party_battle.js:54` |
| A4-W24 | SHOWN | `src/party_content.js:20` |
| A4-W25 | SHOWN | `src/pocket_realm_scenes.js:56` |
| A4-W26 | SHOWN | `src/promise_content.js:10` |
| A4-W27 | SHOWN | `src/pursuit_content.js:22` |
| A4-W28 | SHOWN | `src/repository_absorption_chains.js:39` |
| A4-W29 | SHOWN | `src/repository_absorption_content.js:40` |
| A4-W30 | SHOWN | `src/repository_absorption_substitutions.js:44` |
| A4-W31 | SHOWN | `src/simulation_content.js:84`; `src/simulation_content.js:107` |
| A4-W32 | SHOWN | `src/skill_expansion_content.js:175` |

### Wrapper call sites beyond the 42 declarations

The helper declarations above generate effects at these read call sites.
Direct memory helpers are included here for complete producer coverage. Each
file's local helper was followed; management imports the shared helper at
`src/management/shared.js:17`. A function returning a memory effect is a
producer, while the actual stored write is A4-S2.

| Class | File | Helper | Call sites |
|---|---|---|---|
| SHOWN | `src/audit_remainder_consequences_content.js` | `memory` | `src/audit_remainder_consequences_content.js:70`, `src/audit_remainder_consequences_content.js:73`, `src/audit_remainder_consequences_content.js:85`, `src/audit_remainder_consequences_content.js:146`, `src/audit_remainder_consequences_content.js:177` |
| SHOWN | `src/backlog_expansion_body.js` | `remember` | `src/backlog_expansion_body.js:286`, `src/backlog_expansion_body.js:341`, `src/backlog_expansion_body.js:389`, `src/backlog_expansion_body.js:401`, `src/backlog_expansion_body.js:432`, `src/backlog_expansion_body.js:433` |
| SHOWN | `src/backlog_expansion_replacement.js` | `remember` | `src/backlog_expansion_replacement.js:83`, `src/backlog_expansion_replacement.js:105`, `src/backlog_expansion_replacement.js:118` |
| SHOWN | `src/crush_social_content.js` | `memory` | `src/crush_social_content.js:47`, `src/crush_social_content.js:55`, `src/crush_social_content.js:73` |
| SHOWN | `src/everyday_life.js` | `respect` | `src/everyday_life.js:32`, `src/everyday_life.js:36` |
| SHOWN | `src/feature_expansion_nested_chains.js` | `memory` | `src/feature_expansion_nested_chains.js:75`, `src/feature_expansion_nested_chains.js:87`, `src/feature_expansion_nested_chains.js:105`, `src/feature_expansion_nested_chains.js:139`, `src/feature_expansion_nested_chains.js:148`, `src/feature_expansion_nested_chains.js:173`, `src/feature_expansion_nested_chains.js:216` |
| SHOWN | `src/feature_expansion_nested_content.js` | `relationship` | `src/feature_expansion_nested_content.js:78`, `src/feature_expansion_nested_content.js:83`, `src/feature_expansion_nested_content.js:88`, `src/feature_expansion_nested_content.js:93`, `src/feature_expansion_nested_content.js:97`, `src/feature_expansion_nested_content.js:102`, `src/feature_expansion_nested_content.js:107` |
| SHOWN | `src/feature_expansion_society.js` | `memory` | `src/feature_expansion_society.js:191` |
| SHOWN | `src/feature_expansion_subtlety_scene.js` | `memory` | `src/feature_expansion_subtlety_scene.js:47`, `src/feature_expansion_subtlety_scene.js:50`, `src/feature_expansion_subtlety_scene.js:65`, `src/feature_expansion_subtlety_scene.js:69`, `src/feature_expansion_subtlety_scene.js:75`, `src/feature_expansion_subtlety_scene.js:77`, `src/feature_expansion_subtlety_scene.js:79`, `src/feature_expansion_subtlety_scene.js:81` |
| SHOWN | `src/management/capital_rooms.js` | `relationship` | `src/management/capital_rooms.js:27`, `src/management/capital_rooms.js:30`, `src/management/capital_rooms.js:33`, `src/management/capital_rooms.js:36`, `src/management/capital_rooms.js:53`, `src/management/capital_rooms.js:59`, `src/management/capital_rooms.js:62` |
| SHOWN | `src/management/events_restoration.js` | `relationship` | `src/management/events_restoration.js:50`, `src/management/events_restoration.js:81` |
| SHOWN | `src/management/shipping_farming.js` | `relationship` | `src/management/shipping_farming.js:17` |
| SHOWN | `src/management/shops_auctions.js` | `relationship` | `src/management/shops_auctions.js:23`, `src/management/shops_auctions.js:27`, `src/management/shops_auctions.js:31` |
| SHOWN | `src/management/workshop_aid.js` | `relationship` | `src/management/workshop_aid.js:24`, `src/management/workshop_aid.js:28`, `src/management/workshop_aid.js:37`, `src/management/workshop_aid.js:40`, `src/management/workshop_aid.js:53`, `src/management/workshop_aid.js:58` |
| SHOWN | `src/original_frontier_campaign_content.js` | `memory` | `src/original_frontier_campaign_content.js:44`, `src/original_frontier_campaign_content.js:82`, `src/original_frontier_campaign_content.js:94`, `src/original_frontier_campaign_content.js:135`, `src/original_frontier_campaign_content.js:145`, `src/original_frontier_campaign_content.js:159`, `src/original_frontier_campaign_content.js:164` |
| SHOWN | `src/original_frontier_career_content.js` | `memory` | `src/original_frontier_career_content.js:37`, `src/original_frontier_career_content.js:241`, `src/original_frontier_career_content.js:255`, `src/original_frontier_career_content.js:267`, `src/original_frontier_career_content.js:325` |
| SHOWN | `src/original_frontier_field_content.js` | `remember` | `src/original_frontier_field_content.js:122`, `src/original_frontier_field_content.js:134`, `src/original_frontier_field_content.js:165` |
| SHOWN | `src/pocket_realm_scenes.js` | `memory` | `src/pocket_realm_scenes.js:88`, `src/pocket_realm_scenes.js:108`, `src/pocket_realm_scenes.js:166` |
| SHOWN | `src/promise_content.js` | `memory` | `src/promise_content.js:29`, `src/promise_content.js:33`, `src/promise_content.js:38`, `src/promise_content.js:41`, `src/promise_content.js:49`, `src/promise_content.js:51`, `src/promise_content.js:57`, `src/promise_content.js:63` |
| SHOWN | `src/repository_absorption_content.js` | `memory` | `src/repository_absorption_content.js:95`, `src/repository_absorption_content.js:104`, `src/repository_absorption_content.js:113`, `src/repository_absorption_content.js:135`, `src/repository_absorption_content.js:140`, `src/repository_absorption_content.js:151` |

Negative effects exist as well as gifts/attacks: interruption at
`src/everyday_life.js:28`, office/water/exclusivity disputes at
`src/feature_expansion_nested_chains.js:87,139,148,216`, tenant refusal at
`src/management/capital_rooms.js:62`, and attribution consequences through
`src/feature_expansion_subtlety_scene.js:22,77`. [SHOWN]

## Every direct relationship reader

A gate uses stored data to qualify behavior. A projection exposes it to another
reader. A protection checks retention/consistency; it is not an autonomous
social response. Whole-state persistence is inventoried separately.

| Code | Class | Source and read purpose |
|---|---|---|
| A4-R1 | SHOWN | `src/simulation_effects.js:156`: actor-to-context-target axis fact projection. `:157-158` separately expose observer knowledge, so relationship fact exposure is not an observer-safe UI. |
| A4-R2 | SHOWN | `src/chronicle.js:130-131`: archive-duty facts. `:136`: fulfilled-duty guard. `:166,199,203,208,213,217,222`: pledge, successor, debrief, lesson, settlement and agreed-challenge guards. `:269`: previous courtesy/concession markers determine later deltas. |
| A4-R3 | SHOWN | `src/chronicle_ui.js:92,110,113-119`: show/disable matching elder actions from ties/trust. |
| A4-R4 | SHOWN | `src/people_knowledge.js:16-26`: introduced elder ties/memories; `:52-55`: helper-to-player handover memory; `:59-63`: player-to-Lio/clerk memories under introduction knowledge. Directions currently differ across rows. `src/people_ui.js:26` renders the projected text, not raw stores. |
| A4-R5 | SHOWN | `src/crush_social_views.js:94-98`: known Lio contest/rest history, then observation-qualified recap. |
| A4-R6 | SHOWN | `src/life_experience.js:19-20`: duty/concession narration; `src/event_feed.js:97`: fulfilled-promise life entry; `src/heir_inheritance.js:56-63`: ties feed retained grievance/archive duty and archive-line estate metadata. |
| A4-R7 | SHOWN | `src/nethack_fieldcraft_facts.js:113-116`: dog-to-player scent lesson / pin retrieval axes must match real completed counters. Validation/protection, not scalar loyalty. |
| A4-R8 | SHOWN | `src/audit_remainder_consequences_facts.js:37-41`: caused outlet memory qualifies the actual seizure consequence; `:244-245`: interruption memory must survive its temporary condition. |
| A4-R9 | SHOWN | `src/backlog_expansion_replacement.js:161`: earlier participant memory gates revisiting; `:213`: caused memory/knowledge consistency for scoped recognition. |
| A4-R10 | SHOWN | `src/feature_expansion_book_host.js:57-69,107,127,129`: preserve every prior axis/memory while allowing the named holder's one appended appointment memory; retained-domain comparison. |
| A4-R11 | SHOWN | `src/backlog_expansion_transit.js:158`: whole relationship store goes into an observer carrier manifest, without conversion into a player disclosure. |
| A4-R12 | SHOWN | `src/steam_boh_facts.js:69-70`, `src/steam_oni_facts.js:58-59`, `src/steam_lamb_facts.js:57-59`: reject parallel state owned by those feature prefixes. These scan both outer and/or inner keys, not social scores. |
| A4-R13 | SHOWN | `src/simulation_contracts.js:230,250` and `src/chronicle.js:34-39`: structural read/validation. `src/simulation_effects.js:287,291` and `src/chronicle.js:64,67` read existing values during writes; `src/simulation.js:584` enumerates incoming edges during reset. |

`relationships` in `src/feature_expansion_book_roster.js:351,3104`,
`src/feature_expansion_book_recognition.js:113`,
`src/feature_expansion_book_situated.js:96`,
`src/feature_expansion_book_cultivation.js:396`,
`src/feature_expansion_subtlety_scene.js:98`,
`src/backlog_expansion_replacement.js:20`, and
`src/world_completion_lens_content.js:77,102` is descriptive/retained-domain
text, not an additional raw-store consumer. `src/life_record.js:1` expressly
rejects biography as authority. [SHOWN]

## src/reputation*.js and the regional totals they own

`src/reputation.js` and `src/reputation_state.js` are the only glob matches.
Their APIs are used in production only by main. The table also traces regional
data through the transactional path, all total readers, and authored producers.
Empty NPC reputation objects are compatibility slots, not faction membership.

| Code | Class | Writer/reader and exact anchors |
|---|---|---|
| A4-P1 | SHOWN | `src/reputation.js:5-14`: checks integer delta and supported region, then increments native `character.reputation`. No ±100 or 1000 write clamp. It uses Number.isInteger rather than the loader's stricter safe-integer check. |
| A4-P2 | SHOWN | `src/reputation_state.js:2-3`: missing/omitted saved region determines replay. `:6-16`: returns a copied total map, overwriting supported regions with saved safe integers. It never mutates its inputs. |
| A4-P3 | SHOWN | `src/main.js:268,278` imports both APIs. `:3255-3261` conditionally reconstructs old rewards and adds live rewards. `:5320-5321` publishes restored totals and remembers the saved map. `:4966` writes character totals to the envelope. `:750` checks expedition effect regions. |
| A4-P4 | SHOWN | `src/models/hero.js:31-35` initializes Village, Slums, Town totals. `src/gameplay_transactions.js:12,21-22,42-44,73-76,94` validates snapshots/effects, requires an existing region, adds a finite bounded total and writes it to the native envelope. `src/gameplay_publication.js:10,43,58` snapshots and publishes staged totals. Dispatchers: `src/expansion_engine.js:114,498`, `src/simulation_effects.js:280`, `src/simulation_contracts.js:44,65,245`. |
| A4-P5 | SHOWN | `src/conditions.js:246-252`: hard/fuzzy regional requirement checks. `src/data/locations.js:480,491,495,499,585,589,617,1231,1766,1784` author their thresholds. `src/components/trader_component.js:141-145` uses region total in haggling-adjusted margin, capped above at 1000 only during the read. Negative values are preserved and can increase margin. |
| A4-P6 | SHOWN | `src/display.js:4273-4294`: renders positive totals only; negative totals still affect the other readers. `src/heir_inheritance.js:51-56,62,74,91-92,108`: computes signed half totals, validates and applies retained standing, describes them. |
| A4-P7 | SHOWN | Legacy authored reward sources: `src/data/dialogues.js:375,553,1257`; `src/quests.js:363,381,384,386,404,440`. `src/rewards.js:92,165` retains/supports the reward field; `:155` documents its non-random-source reconstruction rule. |
| A4-P8 | SHOWN | Engine reputation effect sources: `src/chronicle.js:272` witnessed assault; `src/expedition_content.js:138`; `src/village_content.js:38`; `src/town_content.js:41,45`; `src/world_completion_life_content.js:40`. No change to those amounts or routes. |
| A4-P9 | SHOWN | Gameplay/NPC seed objects: `src/book_world_mol_content.js:29-37`, `src/book_world_paradise_content.js:22-28`, `src/proto23_world_content.js:10-11`, `src/feature_expansion_nested_content.js:63-65`, `src/feature_expansion_destination_host.js:122-123`, `src/causal_story_actors.js:40-42`. Native initializers: `src/book_world_mol_native.js:101`, `src/book_world_paradise_native.js:101`, `src/proto23_world_native.js:127`, `src/feature_expansion_nested_native.js:67`, `src/feature_expansion_destination_native.js:57`. `src/causal_story_host.js:202` copies a seed into staged gameplay. |
| A4-P10 | SHOWN | `src/causal_story_native.js:62-64,117,152,183-184,232,261,297,307,326,404,411,454`: validates, snapshots, initializes, restores, retains and publishes per-person native reputation through causal-story adapters. The lowercase `village` NPC seed region is not identity evidence for the hero's `Village` region or any faction. |
| A4-P11 | SHOWN | `tests/reputation_state.test.js:5-32`: current pure-API coverage for saved totals, partial legacy reconstruction, sign and repeated-load stability. Tests are not production readers. |

Prose-only reputation mentions are not executable readers:
`src/audit_remainder_offers_content.js:98,108`, `src/backlog_expansion_replacement.js:44`,
`src/body_progression.js:27`, `src/book_world_mol_actions.js:69`,
`src/original_frontier_campaign_content.js:142`,
`src/components/availability_component.js:78`, `src/components/dialogue_component.js:64`
and `src/verifier.js:467`. [SHOWN]

## Generic persistence boundaries and coverage limits

Both stores live inside expansion. `src/expansion_engine.js:146-147` validates
both; `:259,269` clones migrations/loads. `src/expansion_persistence.js:8-15,48-49`
validates and writes the whole plan state to one envelope. Native envelope writes
are at `src/main.js:5190`, loads at `:5308`, and file preflight validation at
`src/save_files.js:73,145`. These preserve/read whole state, not a social gate.
Chronicle commands clone state (`src/chronicle.js:158`); simulation plans and
engine commands do likewise. Generic cloning/JSON traversal is not counted as
an additional domain reader per function. [SHOWN]

Search method: public `src/**/*.js` for `relationships`, all relationship effect
object declarations including quoted keys, `relationship.` fact strings,
relationship helpers/call sites, reputation APIs and reputation data accesses.
Followed local aliases (`r`, `directed`, `ties`, helper wrappers) at the anchors
above. No matching non-JS source access was found. Test fixtures, descriptive
strings and whole-state copy paths are distinguished from production domain
readers. Dynamic private-pack rules, runtime plugin content and native behavior
are UNKNOWN; no private pack, secret file, book prose or save was opened.
“No authored predicate” applies to literal public source at this snapshot,
not all possible packs or later integrations.

## New read contract, no gameplay wiring

[SHOWN in new source] `src/relationship_view.js:11-17,64,97` exports
`relationshipView(expansionState, viewerId = 'player', {chronicleOwnerId = 'player'})`
and `relationshipFacts(viewer, targetId)`. Each target has source presence,
source-qualified axes, chronicle ties and source-tagged retained memories.
`relationshipFacts` returns plain scalar maps for `rules.js`.

[INFERRED API decision] Chronicle rows appear only for the bound life owner;
no reverse-directed reading is invented. Matching axes are never summed,
renamed or selected by precedence. Memory ids remain source-qualified and
same-cause entries remain separate. Missing records produce false presence
facts; missing axes/ties produce no fact. Real zero/false remain known.
Facts use `relationship.simulation.axis.*`, `relationship.chronicle.axis.*`
and `relationship.chronicle.tie.*`. No unqualified legacy fact is overwritten.

[INFERRED API decision] Reads copy and validate, never repair or clamp. Each
source's 32-memory limit stays intact, so a combined row can show 64 retained
memories. The projection rejects unsupported memory payloads explicitly;
that check is stricter than today's simulation store validator, which validates
only the array/length. This unwired adapter cannot block existing save import.
It supplies internal authoritative facts only. A future UI must filter known
people/evidence before revealing rows or scores, following the existing People
owner and companion GA/GC/BX08 direction. No raw NPC memory becomes public merely
because this API can read it.

[SHOWN] Lane changes add only a module and its tests. No store, schema, fact
publisher, action predicate, native save path or UI reader was changed. Standing
and membership remain the [separate design palette](STANDING.md).

Usage [SHOWN by the focused tests]:

```js
const viewer = relationshipView(expansionState, 'player');
const row = viewer.relationships.villageElder; // source-qualified, detached
const facts = relationshipFacts(viewer, 'villageElder');
evaluateRule({fact: 'relationship.chronicle.tie.dutyKept', op: 'eq', value: true}, facts);
```

The selected rule here reads a chronicle tie. A separate rule must name
`relationship.simulation.axis.trust` to read player-to-target simulation trust.
Neither rule is wired into an existing command by this lane.
