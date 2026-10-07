# Actor work selection and social memory

Completed finite static review of installed ACS Steam app955900/build17074448: ordinary cleaning and one warm conversation between ordinary wisdom actors. No ACS gameplay or save opened. Recovered C# stays private.

[actors.json](actors.json) owns exact private-root-relative paths, SHA256 pins, read spans, assembly pins, live YAIRPG hashes and limits. Source IDs below refer to that manifest. No whole-file or whole-game semantic coverage claim.

## Allowed worker completes cleaning

**Prerequisites.** Ordinary worker registers Clean priority3 and job bans. Idle dispatch excludes locked/RPG/dead/corpse/off-map actors. NeedClean is a single CommandClean. Cleaning needs fewer than two lost hands, activity scope, valid/unlocked owner, key-stay permission and reachable path.

Evidence: `npc:4777-4805`, `npc:6326-6358`, `clean_command_def:150-153`, `clean_admission:10-23`, `clean_command:46-60`, `command:517-604`.

**Decision.** Work UI selects enable/VIP policy; Carry includes Clean. VIP changes main priority3 to2 while preserving disabled sign. NPC sorts ascending kind*100000+main*10000+workkind*100+insertion child; first enabled/unbanned/currently legal Check yielding job wins. Work-hour/health/body/magic filters remain. Command search scores squared distance minus owner/command priority, then applies eligibility/activity scope.

Evidence: `work_ui:48-64`, `work_ui:180-198`, `work_engine:161-206`, `behaviour:42-49`, `work_engine:592-661`, `command_search:390-503`.

**Expenditure.** No direct item/purse debit in this selected path. Actor occupancy, movement and nominal Lerp(10,1,CleanSpeed/1.7) simulation-second toil are spent. Idle may extend to a nonloop animation length; exact visible time and wider needs expenditure are unobserved.

Evidence: `clean_job:19-24`, `idle:44-64`, `idle:83-108`.

**Mutation.** Register/CurJob/start event, work-on and command lock precede stepping. Last successful toil sets Did. Successful clean leave finishes command, restoring10 beauty/removing dust and flagging room recalc; creation had applied minus10/dust.

Evidence: `work_engine:416-425`, `job:462-475`, `job:490-552`, `clean_job:27-32`, `command:401-448`, `clean_command:8-15`, `clean_command:27-34`.

**Consumer.** Tile beauty feeds room average, Map.GetBeauty and NpcFeeling BeautyExpect mood bands. This is atmosphere feedback; GetCleanEvaluate returns1 and is not evidence of a functional cleanliness stat.

Evidence: `map:519-530`, `room:253-256`, `room:407-411`, `room:500-515`, `map:2280-2304`, `feeling:714-749`, `room:332-339`.

**Time policy.** Supplied dt drives JobEngine.Step. Cached WorkHour accumulates on CurJob changes for previous behavior category3 and positive stored day/hour; admission compares it with RuntimeVar limit. Free job probes higher-priority eligible work every5 TolSecond units, but individual jobs/toils control preemption probes. No universal per-tick preemption or daily accounting claim.

Evidence: `work_engine:73-105`, `work_engine:503-569`, `work_engine:623-639`, `free_retry:115-129`.

**Failure.** No eligible reachable command yields no job. Loss of worker/owner/required command or interrupted toil sets Did false; normal interrupted clean does not finish/remove dust. BeginJob replaces only interruptible current work; job or parent can reject interruption. Rain can remove outdoor cleaning commands independently and cleanup restores beauty regardless of OnFinished did.

Evidence: `job:243-258`, `job:389-412`, `job:490-534`, `clean_job:27-32`, `work_engine:388-463`, `clean_command:18-34`.

**Aftermath.** Leave removes work-on and unlocks command for later eligible pickup. No retained partial cleaning progress established. Child jobs attach parent; successful child restores parent, interrupted child attempts parent interruption. General command ownership is distinct from simple cancel-and-restart.

Evidence: `job:595-689`, `work_engine:388-463`.

## Conversation separates prose memory, mood and retained relation drift

**Prerequisites.** Capable wisdom actor looks around outside fight mode with shared room, vision/line of sight, same camp/compatible race, squared distance<256, awake/actionable/non-god-practicing partner and no no-communication flags. One neighbor attempted per pass. Pair cooldown and first-contact random0-100 TolSecond warmup can return before effects. Selected warm pair has no Fancy/Lover/Spouse special path.

Evidence: `feeling:169-239`, `feeling:760-771`, `relation:922-939`, `relation:1056-1129`, `relation:1336-1354`.

**Decision.** Directed Value maps to a social level; level modifier clamps[-3,3]. NPC samples SayHello/Talk/DeepTalk/Neglect/Quarrel/Insult. Level0 weights50/35/3/10/2/0; level-2 weights40/5/1/40/10/4. Partner applies same kind reciprocally. This is autonomous stochastic selection, not guaranteed player outcome.

Evidence: `relation:909-919`, `relation:1076-1116`, `social_weights:1748-1778`, `interactive_kinds:1-20`.

**Expenditure.** Warm Talk has no direct item/currency/stamina debit here and grants property-valued SocialContact XP. If both are free/jobless at different keys, paired JobTalk occupies each for nominal3-second toil. Relation/mood may apply without that presentation job when busy.

Evidence: `relation:1115-1129`, `relation:1360-1364`, `relation:1406-1422`, `social_job:50-69`.

**Mutation.** Warm Talk sets nexttime=(0.02+0.1667*(1-K))*random(0.5,1.5)*600+TolSecond, triggers Social_Talk, adds AfterTalk favor and mood and SocialContact XP. Favor value4/max6/duration0.5; AddFavour stores NPC/definition/explanation/KeepTime0, rejects self/mutex/full stack, optionally reverse-indexes, emits ModifierFavour. It does not immediately assign BaseValue/AddValue. Story-rate0.2/actor guards can skip prose while numeric effects occur. Successful parsed story appends dated partner-linked NpcMemery, outside RPG, dropping oldest at100.

Evidence: `relation:1336-1386`, `relation:1406-1422`, `favour_def:366-373`, `relation:1441-1479`, `social_stories:26-45`, `npc_story:1710-1785`, `npc:2437-2469`.

**Consumer.** For IsPlayerThing actors, Relation.Step expires labels at Duration*600, sums permanent values into AddValue and timed values into CurValue, integrates timed values into BaseValue at0.0012*FavourChangeSpeedRate*dt clamped[-100,100]. Value=clamp(BaseValue+AddValue); future level/weighted interactions reread it. Expiring AfterTalk may leave baseline drift; it is not permanent immediate+4 friendship. Separate mood value4/max3/stack0.8/duration0.5 changes mood sum, later un-applies and affects moving RealMoodValue. Separate NpcInfo renders newest prose/time/tooltip; no prose-to-job AI parser established.

Evidence: `relation:25-40`, `relation:754-827`, `relation:909-919`, `relation:1076-1116`, `mood_def:567-575`, `mood:189-285`, `mood:430-439`, `mood:442-491`, `mood:498-529`, `memory_ui:200-212`, `memory_ui:306-343`.

**Time policy.** Simulation dt/TolSecond, not proven offline policy. IsPlayerThing relation updates staggered at least1 second. Duration0.5 means300 simulation units for both chosen favor/mood. K lazy builder can use inclinations/shared interests/features/oppositions, but normal path creates default cache before GetRelationK; cached K0 may bypass lazy affinity initialization. Actual initialization lifecycle and exact accumulated drift are uncertain.

Evidence: `relation:456-508`, `relation:754-816`, `relation:1064-1074`, `relation:1336-1354`, `property_step:1294-1299`.

**Failure.** No neighbor/cooldown/first warmup yields no favor. Full favor stack rejects new label while mood can reset oldest timer. Story failure does not undo numeric interaction. Negative choices add distinct negative favor/mood; probabilistic escalation adds Fight labels/mood and possibly fight presentation. JobTalk movement/animation alone proves no injury. No romance claim.

Evidence: `relation:1441-1479`, `mood:224-242`, `npc_story:1710-1785`, `relation:1360-1386`, `favour_def:382-454`, `mood_def:585-611`, `relation:1117-1129`, `relation:1298-1333`, `social_job:64-69`.

**Aftermath.** Timed labels/moods expire separately, existing BaseValue drift remains. Surviving relations/interactive clocks and JSON-marked prose list are serialized; Relation.Step removes absent NPCs. Runtime save/reload unobserved.

Evidence: `relation:754-827`, `relation:92-131`, `relation:257-301`, `npc:518-525`.

## Original proposal: Negotiate Orr’s next eligible duty

At the already introduced Village bench, ask repair-first, lesson-first or leave Orr’s ordinary order when two existing genuinely funded/consented offers are available. Orr and Hessa must accept any delay. No forced permanent service. The selected legal duty enters only at a free common boundary; accepted jobs are intact. Later meeting records exact kept/deferred/refused agreement and one optional next-request response.

Orr is explicitly `feature_society.orr` in live `src/feature_expansion_society.js:3-7`; existing repair/teaching controller candidates are at lines212-214. Live `src/audit_remainder_livelihood_content.js:3-9` reuses that same actor for newer funded shifts. These are verified source owners.

Reused owners:

- `src/simulation.js:430 legal controller preview/admission; existing job participants/cancellation/completion support`.
- `src/feature_expansion_society.js:212 existing Orr repair priority2/teaching priority1, stock/rights/method/body/funding`.
- `src/simulation_effects.js:195 directed cause-deduplicated memory/axes and attributed knowledge`.
- `src/feature_expansion_work_plan.js:179 finite waits/pause/resume`.
- `src/people_knowledge.js:25 witnessed/attributed contact projection`.

Missing consumers limited to the new optional request:

- Selected current Orr controller reads fixed priority2/1 and offered guards, with no optional negotiated next-duty fact. Add an explicitly enrolled bounded fact/guard for new requests, preserving original revision1 path on absence. No replacement scheduler. Evidence: `society:211-214; controller_execution:430-450`.
- Common target-rule facts expose relationship axes only; selected craftsman recovery reads temporary conditions. New optional Orr repeat request needs a narrow kept-agreement account reader with specific cause/attribution, not prose parsing or universal friendship gate. Existing all19 friction/promise/grievance consumers are already owned, not claimed missing. Evidence: `source_effects:76-82; source_effects:195-203; social_existing:25-56`.

**Cost.** Negotiation may take1 original proposed played minute; real cost is deferring one future duty. Existing repair/teaching costs/time/outputs remain their frozen revisions. No order bonus, free stock or purchased affection.

**Result.** One supported existing duty really completes into the same home/learner/object owner; deferred offer and escrow stay pending. Preserve current finite shifts/site allocations.

**Retained consequence.** Store typed/knowledge receipt for agreed order/actual completion/refusal and a directed reason memory. Brief condition can expire independently. Later optional scheduling consent reads exact receipt; paid alternatives/native quests remain.

Compatibility:

- Optional absent state inert; no new world/prestige/clock/inventory/publisher. Root chooses admission under live schema, preserving frozen jobs and revision1 definitions.
- Receipt must survive bounded memory eviction; do not rely on prose-text equality.
- Current all19 root01a10fe7 owns integration, causal01a10fa6 owns causal_story_*; re-pin moving source before implementation.

Later playable gate, unrun:

- Synthetic save: genuinely support both offers; choose each order and ordinary order. Check one legal admission/exact cost/worker occupancy/distinct first result with player free for other work.
- Cancellation/lost consent/insufficient stock/busy site never creates output or priority bypass; frozen job policies intact, replay cannot farm memory or wage.
- Later meet after mood expiry, see only attributed agreement/result; optional request uses retained account and paid alternative. Save/reload/import/publication failure and director checks remain deferred.

## Coverage and released checkpoint

Reviewed 3,659 selected lines across 31 nonempty ACS files; one additional behavior XML is empty. Counts are declared selected spans, not complete assembly semantics.

Selected XML copies and both assemblies match read-only installed inputs. Self-review passed 90 trace locators and 32 private hashes. Eight YAIRPG source snapshots are pinned; People projection and work-plan ranges were reread after shared-file drift. Root must re-pin these moving inputs before implementation. These checks establish traceability only.

Unread:

- Whole-game behavior graph; other work families, broad needs/injury expenditure and reset/mask paths.
- Most kinship propagation/animal/lover/fancy paths, firstpass and Lua mod framework. No romance conclusion.
- Complete large sources beyond listed ranges; input/Settings/Behaviour/Human.xml is empty, not evidence of an active behavior policy.
- ACS gameplay/UI/save/reload/offline/balance; YAIRPG gameplay/unit/browser/save-failure/regression/director checks.

Uncertain:

- K0 affinity initialization lifecycle
- actual animation-extended cleaning time
- story guard/rate means prose may be absent despite numeric effect
- JobTalk fight presentation does not prove injury
- moving dirty YAIRPG shared source can drift

No runtime/canonical/build/test/save/profile/library/global configuration/installation/commit/push/publication/automation mutation. No children or pending worker processes. Root reported shared ILSpy exports complete. Both assigned files are complete and released to root review/integration. Gameplay, unit, browser, save-failure, regression and director gates remain deferred.
