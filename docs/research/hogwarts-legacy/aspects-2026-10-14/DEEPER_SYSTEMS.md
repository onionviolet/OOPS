# Three underexplained systems

2026-10-14. Selected by payoff to dialogue, reveal and causally consistent NPC work. The original dossier mentions some table names but does not explain these three rule sets. Fresh full rows and schemas are private in `/Users/weiwei/.codex/research/bf-hogwarts/notes/tables/ship/`. SHOWN is data; INFERRED is interpretation. None is proof that every dormant feature ships as live play.

## DS1: acknowledgements and ambient speech arbitration

**What was missing:** the prior dialogue digest covers scene graphs and conversation registration, but leaves ambient selection/repetition mostly unexplained.

**SHOWN:** AcknowledgementRules has 219 rows: 155 Time, 52 Event and twelve Ambient. Its fields separate VOEventID and TemporaryEventID from RuleType, Score, NPCType, TogglingSystem, MaxCount, Cooldown and PlayInExclusiveMission. Cooldown has thirteen distinct stored values. AcknowledgementMissionStats has 64 mission/status rows; AcknowledgementMissionDisablesVO has twenty mission rows. AmbientChatterTopicsDynamic has 89 shipped topic defaults with Active/MissionLocked. EavesdropConversations has 215 records with up to four participant IDs and a location abbreviation; EavesdropCharacters and EavesdropLocations supply 45 and ten definitions.

**Deeper read:** repeated dialogue is a candidate/arbitration problem in addition to authored conversation flow. Rule eligibility, actor class, narrative suppression and repetition control are separate data. Score is not proved to be a normalized probability. MaxCount zero occurs 146 times and null 68 times, so treating either as “never play” would erase most candidates without a consumer trace. Cooldown units and whether maxima reset by load, session, chapter or event are unread. Event IDs are references to speech events, not necessarily subtitle IDs. Do not fabricate a direct SUB join.

**PROPOSAL P1:** author an original acknowledgement for one witnessed lesson/work result, gated by actual speaker availability. Retain a cause/event key and repeat policy through the existing dialogue/persistence owner. Separate the last-spoken receipt from current eligibility. A later repeat may become valid when its cause/context changes; do not copy arbitrary lifetime maxima into solo play.

**Small observable check:** two eligible calls in one context do not repeat the same bark immediately; a changed situation can speak again. Save/reload/import preserve that outcome without awarding a second reward. This is a proposed check, not a test run here.

## DS2: knowledge at the subject-and-field level

**What was missing:** prior QL8 connects text IDs, but does not explain the knowledge authoring schema or its numeric defaults.

**SHOWN:** KnowledgeSubjects has 386 subject/category/unlock-reward rows. KnowledgeFacts has 987 SubjectID/ColumnID/EKnowledgeLevel/LockName rows. KnowledgeFactTypes has 103 field descriptors with source table, subject-column, category, UI category and optional CustomQuery; KnowledgeSubjectTables maps eleven definition tables/identity columns. KnowledgeLevels has ten levels. This lets a fact refer to one field of a subject, rather than duplicate a whole actor/item record.

KnowledgeActions has 42 action records with level, applicability, player-interactor condition and possible numeric awards. Twenty-two use OnlyIfUnknown and twenty Always. All KnowledgePoints and CompanionBondingPoints values are zero; twelve ExperiencePoints entries are nonzero. KnowledgeDynamic contains sixteen shipped defaults. Nineteen MissionSteps use GrantKnowledge with a subject/action signature. The declared EvalGainedKnowledge task was not found among the shipped MissionSteps in this census.

KnowledgeVendorFacts has 33 shop/vendor/open-time rows. These supply discovery metadata. They are not independently verified shop opening hours, stock generation or ability ownership. KnowledgeInvestigatable has 236 named location/rotation records, not 236 proved discoverable facts in play.

**Deeper read:** this is a reveal projection over authoritative mechanical tables. A knowledge record can decide what the player sees about a subject while its ability, access and reward remain owned elsewhere. The zero-valued point fields warn against promoting an elaborate schema to a live grinding system. The exact reveal evaluator, handling of missing field references and current-build knowledge-award native consumer remain unread.

**PROPOSAL P2:** let one known source reveal a notebook field, with its provenance. Learning that a tool suits a task does not grant the tool or trained skill. Retain the underlying mechanical owner and store learned evidence through the existing save path.

**Small observable check:** discover a practical fact, reload/import, and still distinguish “known method” from “can perform method.” An unknown NPC fact stays hidden. No whole new knowledge level system is required.

## DS3: social actions, witness distinctions and station occupancy

**What was missing:** prior AI/schedule coverage explains activity overrides but not station-choice grammar or the social rows that qualify the HousePoints negative search.

**SHOWN:** SocialActionDefinition has 178 rows across nine action-type IDs. It separates SocialCapitalValue, TargetSCMod, WitnessSCMod, HearsaySCMod, SCDecayPercent, Lifetime, MaxPropagationCount, MinPropagationSCStatus, Priority and HousePoints. There are 400 SocialActionSemantics rows joining action ID to semantic ID/value; SocialSemantics has 67 definitions. Twenty-five action rows have nonzero HousePoints, both positive and negative. Lifetime includes -1; its sentinel meaning is untraced. MaxPropagationCount spans zero to five, but no actual transmission algorithm follows.

SocialStationActionChoices has 301 rows keyed by PropType, CurrentAction, OccupiedConnections, NumConnectionsReqd, AvailableAction, UseConnection/UseConnectionAsSet, TargetConnections, ActivityTypeID and CurrentActionMustBeActive. This is a richer rule than “actor is idle, choose animation.” It describes compatibility with existing occupancy/action and which connection(s) a candidate uses. Connection numbers/sets are serialized values; their exact bit/index interpretation is unread.

Related CrimeEnforcementMatrix has 36 rows with CallAF/Flee/Retaliate response values; CrimeSeverityMatrix has two rows and separate theft/violence bands. These are evidence for authored response parameters, not a proved working crime engine. No probability normalization, exact boundary inclusivity, runtime witnesses or response call chain was traced.

**Deeper read:** target, witness and hearsay distinctions offer a useful social-authoring reference, but source richness must not be sold as an implemented rumor or house-scoring simulation. Station choice and social judgment also solve different problems. An actor may have a feasible seat activity with no reason to change an opinion, or witness an action while unable to occupy a station.

**PROPOSAL P6:** bind one supported activity to a finite station connection and release it on completion/cancellation. If a later social response is selected, record what that actor actually observed. Do not grant every witness a shared omniscient reputation value.

**Small observable check:** two actors cannot reserve the same exclusive tool connection; cancellation restores only that reservation. A remote actor does not know the witnessed event without an actual report route. Persistence checks apply only if this proposal is later selected.

## Research priority after this backfill

| Code | Gap | Best next route |
|---|---|---|
| G1 | A04 actual serializer, version/rejection and atomicity | Current executable native registration plus a bounded save manager/persistent-data chain; no personal save needed for static tracing |
| G2 | A01 Articy condition/effect expressions | Relationship CONV record grammar and exact graph provider lookups; preserve unknown effects explicitly |
| G3 | DS1/DS3 selection, time units and propagation | Current-build native consumers named by the tables, after an exact behavior question is chosen |

These are research options, not accepted YAIRPG gates or authorization to launch a game.
