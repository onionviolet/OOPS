# Whole-project game architecture and long-term design review

Later bounded follow-up: [modularity and rewrite assessment, 2026-10-16](MODULARITY_AND_REWRITE_ASSESSMENT_2026-10-16.md)
rechecks source integration pressure and compares continued patching, incremental
domain extraction and whole-game replacement. It is a recommendation, not new
implementation authority. This document's original dated evidence remains below.

October 12, 2026, America/New_York. Repository snapshot inspected around 23:00 EDT.
Review only. No gameplay changes, builds, new agents, campaign resumption, source acquisition, private-pack edits, personal-save access, commits or publication.

**Recommendation:** after the incumbent closes the finite Foundation joins, prove an independent local livelihood that becomes a dependable small workshop over several return sessions. Start from a coherent local snapshot, give ordinary learning an actual functional advance, let another person contribute through their own means, and retain the changed place and relationship. Use one original world for this proof. Frontier's existing mechanics are a reuse candidate, not a compulsory player opening. This is a proposal, not implementation authority.

The emerging game is a text RPG about acquiring **ways to act**, living with what those actions change, and discovering which rules apply. Its distinctive promise is broader than grinding, prestige, or visiting named settings. A strong character should genuinely solve old problems; a strange body should genuinely change ordinary actions; a discovery should change both belief and available choices. The current implementation contains useful connected fragments of that promise. It does not yet demonstrate a sustained whole-world or multiverse experience.

## Evidence and authority

Labels apply to claims, not entire files:

| Label | Meaning in this review |
|---|---|
| U | Accepted user direction, including the current review request |
| R | Current repository/source fact personally inspected |
| T | Demonstrated/tested behavior recorded in the cited existing evidence; not rerun here |
| I | Reviewer inference from named evidence |
| P | New recommendation or existing unaccepted proposal |
| ? | Insufficient evidence or unresolved choice |

Priority is current user instruction, accepted project decisions, applicable historical user quotes, current implementation/evidence, older proposals/research, then this review. The [accepted project decisions](../../PROJECT.md#accepted-decisions), [accepted rulebook](../RULES_FROM_SCRATCH.md#the-rulebook-accepted-2026-10-10) and [original requests](../USER_VISION.md) govern interpretation. A document headed proposal can contain an accepted quote without making its surrounding design accepted.

All required input documents were inspected. Long accumulated palettes, especially [the north star](../LIFE_SIM_NORTH_STAR.md) and [presentation](../PRESENTATION_AND_FOURTH_WALL.md), were navigated by headings and relevant direction/design sections rather than treated as a new complete source audit. This review does not certify every research entry, book assertion, ledger leaf or source universe. It did not reread source books. Source-book rules below are left with their qualified world owners.

### Snapshot, ownership and freshness

**R:** branch `codex/gameplay-foundations`, HEAD `dd3efe3383f12f0aac22e4f390aae90fae2e7fc4`. Extensive tracked modifications and untracked runtime, tests, documents and assets exist. They were preserved. Current bundle SHA-256 is `e73550a4344ec549b67b830112200a10f9ed1a6f652c8c54c1b1c1ee95bff7a9`; this review did not rebuild it.

**R:** current [Foundation STATE](../gm/dispatch/foundation-completion-2026-10-12/STATE.json) names `01a130b3-4a35-7963-8fa3-b52c3d2ed441` as sole coordinator. This supersedes the older fresh-perspective packet's owner `01a1305a-d5c2-70b2-a96f-843fbee945e8`. Native-positive, refusal and prepared combined-journey workers have bounded evidence reservations. Shared source, build and ledger remain coordinator-owned. This review owns only this new document and transfers no reservations.

**?:** the read-only chat query could not resolve the current owner through the available durable host. A local process inspection found no matching Foundation proof/HTTP processes; that is a local observation, not proof that its workers or goal are released. STATE remains active. Historical server/PID entries must not be assumed live or terminated by a reviewer.

**R:** [latest checkpoint](../gm/dispatch/foundation-completion-2026-10-12/CHECKPOINT.md) is fresher than introductory REPORT text and old successor instructions. Current affected suite is recorded as 137/137 after the import timeout repair. [Legitimate refusal return](../gm/dispatch/foundation-completion-2026-10-12/refusal-proof/RETURN.md) now records the real finite-means refusal and restoration. The earlier invalid reduced-attention fixture remains excluded. The positive workflow records real NPC production, account, collection and subsequent reload at clock 11753; its crop-use JSON is a **planned workflow**, not a passing receipt. Final useful NPC-output application/restoration and combined G6 remain open at this snapshot. G6's final-journey directory contains preparation, not completed evidence. Do not repeat the packet's blanket statement that refusal and all absence remain unproven, or infer closure from planned steps.

**R/T:** separate isolated returns must remain separate:

| Owner | Observed delivery state | Integration/acceptance limit |
|---|---|---|
| [Absorption](../gm/dispatch/absorb-2026-10-11/REPORT.md) | Reported rebuilt combined journey, persistence and 330 tests; committed/pushed wave | Tuning and unplayed alternatives remain local backlog; not acceptance of every later dirty edit |
| [Village choices](../gm/dispatch/village-choices-2026-10-09/REPORT.md) | Career, instruction, teaching terms and Iona participation have bounded evidence | Fiction/numbers and broad social simulation remain separate |
| [Starts/talents candidate](../gm/dispatch/starts-talents-continuity-2026-10-11/CHECKPOINT.md) | Isolated 399 source tests and three native journeys reported | Shared integration and director review open |
| [Wider gameplay candidate](../gm/dispatch/wider-gameplay-2026-10-11/CHECKPOINT.md) | Isolated 416 tests, finite dungeon/ability/loss journey and persistence reported | Not present as an integrated whole-game death law |
| [Management candidate](../gm/dispatch/minigames-2026-10-11/CHECKPOINT.md) | Ten families implemented/rebuilt in candidate; schema/registry checks | Behavioral/browser/save gates explicitly unrun; registered worktree is marked prunable locally, candidate availability not requalified here |
| [Cheats/SFX/authoring](../gm/dispatch/cheats-sfx-implementation-2026-10-12/CHECKPOINT.md) | Bounded candidate delivery; later authoring continuation has its own owner | Source/editor proposals do not establish a universal content editor or shared integration |
| [Full World1](../gm/dispatch/world1-full-completion-2026-10-11/CHECKPOINT.md) | Full represented-source goal explicitly paused; earlier finite editions retained | No resumption, whole-world completion or private-pack changes authorized here |

Snapshot fingerprints: Foundation STATE `64ee4b1d6ba15370e330ae6f121d303c144ef2b958e0aa0586bf923abe37834b`; CHECKPOINT `81dc72999740e3767d2a2b04cea59c9368227c0c31cf355fbcdcd28516c157cf`; REPORT `3698e96d20c0ba84e17ffc10800f2feec4c737be8cd487ac3f9c0f0f6e0a25cc`. They bind this reading, not a frozen future implementation. Later owner evidence can supersede this review's status without invalidating unaffected conclusions.

## V1. Game synthesis

**U:** extend usable native YAIR into a broad progression/life RPG, with original and source-derived worlds, independent lives, several advancement forms, small details, meaningful bodies and carried capabilities. Native professions, stats, equipment, quests and center-menu play survive. Random expanded entry is intended; native compatibility is not a demand to play Frontier first. One realm and one prestige layer sequence a first milestone without making every life a reset run.

**I:** the strongest unifying experience is: *I understand my situation, obtain a real means, use it in a way that changes something, and later encounter what survived.* Several different pleasures fit this structure: becoming good at useful work, experimenting with uncertain properties, living among people who remember, being overwhelmingly capable, leaving a functioning legacy, or entering a place where different mechanisms matter. They need not share a progression currency or mandatory plot.

Three consequential tensions deserve explicit alternatives:

| Code | Tension | Workable alternatives and implication |
|---|---|---|
| V-a | Discovery versus legibility | Hide author truth while showing reliable actual costs, saving state and available actions. Offer observed clues or player-requested help where supported. An opaque refusal is not automatically a good mystery. |
| V-b | Lived detail versus attention | Routine established work; attend to new means, exceptions and commitments. More simulated needs can create meaningful trade or merely more chores. Texture may remain prose without XP or a consumer. |
| V-c | Shared production versus local possibility | Reuse transaction, identity and authoring contracts while keeping rule evaluation local. Data-driven content is useful; forcing every magic system into two research bars is an expensive reduction. |

### Experience across seven horizons

Each row distinguishes intended satisfaction from current proof. The new tests described here are P, specified rather than run.

| Horizon | Desired experience and U | R/T evidence | Missing connection, I/? | Smallest convincing proof, P | Can remain abstract/deferred |
|---|---|---|---|---|---|
| H1 Immediate action | Notice a concrete situation, choose a useful action or experiment, see what happened. Means and knowledge limit both sides. | Native actions; Foundation Lin stock/work quotes; player measurement/lesson/material use; body/fit alternatives. | Many actions are reachable only after unrelated enrollment or prerequisites. Technical controls may work without making the first meaningful decision obvious. | Two local starts each offer useful work or inspection immediately, with known commitment terms and visibly different consequences. | Full start generator, every sensory channel, exhaustive tutorial. |
| H2 Session loop | Return because a pursuit is advancing and circumstances offer a worthwhile next choice. Idle remains useful. | Native jobs/gathering; repeated patrol; Iona's played-clock duty; private finite work controls. | More repeatable buttons do not establish enjoyable cadence. Browser-closed progression is not established by played-clock timers. | Set a bounded routine, do another supported activity, return to a result and one understandable exception. Repeat after ordinary reload. | Global offline policy, remote populations, unlimited queues. |
| H3 Capability change | Become genuinely able to do something through appropriate understanding, practice, body, tools, access or structural growth. | Watchcraft known/practiced/executable distinction; F4 paid learning and provenance-bearing product; native skill/recipe/quality; F3 jig/refit. | Distinct advancement shapes exist in design; ordinary-to-extraordinary functional growth lacks a qualified joined arc here. | Compare the same task before/after learned method or improved tool; one previously unavailable function now works. | Universal mastery labels, talent tree, all numerical ceilings. |
| H4 Life/career arc | Acquire history, possessions, relationships and changed goals without compulsory heroics. | Village promotions, teaching choices/favor/tuition, chronicle relationships and lossy biography. | Repetition, capability, livelihood and later opportunity are proven in separate scopes; a sustained voluntary life is not qualified as a whole. | Across several returns, a worker becomes dependable, chooses self-work versus hired work, and later sees one changed person/place. | Birth-to-death simulation, general romance, all professions. |
| H5 World journey | A coherent place has ordinary work, institutions, mysteries and different rules with durable effects. | Connected Village/Frontier fragments; distinct local destination consumers; isolated world editions. | No inspected whole-world proof covers natural acquisition, several viable pursuits and later aftermath together. Names and destinations do not establish depth. | One bounded district with work, production, a person, a causal situation and a later changed use; qualification of another viable local pursuit follows. | Entire geography, every NPC, all source eras. |
| H6 Continuing life | Keep playing after success, retirement, incapacity or a supported transition; each has its own survival mechanism. | Native defeat/recovery; earned same-person renewal; heir host exists; isolated true-loss candidate. | Accepted inheritance differs from current one-lesson host. Renewal is not inheritance, and neither proves indefinite powerful living. | Finish the small workshop objective, then choose continued ordinary use or another pursuit with old work intact. A later separate legacy proof compares retained assets/records/people. | General soul transfers, all death/resurrection laws, mandatory prestige. |
| H7 Cross-world horizon | A carried thing meets genuinely different circumstances without either world becoming a skin. | F5 actual retained Tidemark method, cargo/custody, return and locally gated execution. | Retained references and dormant receipts are continuity; they do not yet demonstrate a new useful foreign application or two rich worlds. | One acquired method or device has a second destination consumer, with concrete compatible and incompatible circumstances and a consequential return. | Universal equalization, infinite branches, full second campaign. |

Sources: [PROJECT](../../PROJECT.md), [vision](../USER_VISION.md#vision-update-what-weibao-asked-for-2026-10-05-evening-to-2026-10-07), [north-star paths](../LIFE_SIM_NORTH_STAR.md#paths-of-play-and-too-much-versus-too-restrictive-proposal-2026-10-07), [starts/endings palette](../STARTS_ENDINGS_AND_RANDOMNESS_PALETTE.md), and the bounded owners above.

### Attention and idle play

**R:** played-time scheduling, shared boundaries, cancellation and declared unsupported-world pauses are real seams. [World instances](../../src/world_instances.js) union occupied intervals and initialize freeze-absence clocks. [Clock leases](../../src/realm_clock_leases.js) permit selected authorized work/observation support. Neither establishes one offline simulator for all native actions. **U:** worlds choose policies; no global catch-up, danger or aging rule is selected by this review.

**P:** for the recommended workshop prototype, established safe work can repeat to a player-set count or budget, without automatic new commitments. It stops on insufficient actual input, loss of required access/means, an unknown new step, or an explicit decision. A collaborator operates only within their accepted task. Travel, unsupported presence and browser closure each need a stated policy; provisional browser-closed pause is an honest test limitation, not fulfillment of offline idle play.

| Attention class | Proposed treatment for the selected proof | Why the player returns |
|---|---|---|
| First inspection, new method, new contract | Direct decision | Changes what can be understood or attempted |
| Settled production | Bounded queue, actual stock reservation and stop explanation | Frees attention after competence |
| Collaborator's work | Agreed delegation with separate knowledge and output | Others provide real participation rather than a multiplier |
| Deadline or changed access | Interrupt only the affected work; apply local consequence | A real changed cause deserves notice |
| Several commitments | Compact current-work view: owner, place, supported time, next event, reserved input | The player can explain what is running and why something stopped |
| Return after absence | Actor-qualified account of result, missed opportunity and outstanding obligation | No forced reading of a full debug ledger |

Taste acceptance should evaluate perceived interruptions and choices over real sessions, not a fixed click target invented by the reviewer. Default-off hunger, durability and elemental preparation in the absorption wave show that optional pacing experiments are possible. Their numbers are not universal needs or world physics.

### Meaningful power

**U:** OP paths and outliers are legitimate; beaten obstacles stay beaten absent a new cause. **P:** apply an explicit success test to future powerful slices: the old obstacle actually becomes easy or irrelevant, its rewards cannot be endlessly replayed by reload, and ordinary choices remain available afterward. Power may remove food, tool, labor or danger requirements when it truly supplies their function. It need not create upkeep in exchange.

Ordinary skills remain relevant through causal use: precision in making, teaching, interpretation, social familiarity, supplying a particular consumer or a chosen hobby. They need not remain equally competitive forever; a superior means may simply replace one. New possibilities can be larger projects, unfamiliar subjects, relationships, discovery or another world's actual rules. None requires a hidden enemy scaled to the player.

**I:** the current strongest evidence concerns finite bodily/equipment advantages and selected interactions, not overwhelming power over an extended life. The development arena proves scoped resolution. It does not prove that a powerful career remains satisfying or that designers avoid scaling across every encounter. The near-term arc can test continued ordinary play after local success; spectacular late power remains a later selected proof.

## X1. Experience-thread map

These are lenses, not ten universal subsystems. T preserves its cited scope; a broken join means a named absence of proof or binding, not a demand to reopen every component.

| Thread | Existing connected chain and strong join | Missing consumer or unproven integration | Next useful proof |
|---|---|---|---|
| E1 Life | Village patrol → loan custody → wages → rank → written or personal study → practice → teaching choice → Iona duty/history. T: bounded career/choices owner. | Initial identity/body and a broader changed life are not demonstrated through this entire chain. ? Fun across several sessions. | Coherent local start → livelihood → functional advance → collaborator → changed opportunity → later return. |
| E2 Discovery | F4 real condition → owned sample → measurement → taught procedure → stamped material → player's useful intervention. R/T: basis and provenance survive repaired restoration. | No general conflicting-witness, misinformation or revisable-hypothesis loop established. NPC final useful application is still open. | One observed prediction tested under a genuine changed condition; retain the earlier reading as historical rather than rewrite it as omniscience. |
| E3 Capability | Watchcraft knows/practices/holds kit; F4 player and NPC have separate learning; F3 hand/jig/fit gate. | F4's projections recently confused sample owner with learner location; corrected locally, not universal actor-context correctness. | Before/after ability comparison with lost tool and another actor who has not learned it. |
| E4 Ordinary → extraordinary | D1 alloy/equipment-sensitive technique, body practice and native mastery provide plausible joins. | [D1 checkpoint](../gm/d1-alloy-equipment-2026-10-07/CHECKPOINT.md) leaves its browser gate open. Research about simple-skill growth is not a demonstrated extraordinary arc. | One ordinary competence gains a genuinely expanded function; recheck an earlier application and an optional ordinary goal. |
| E5 Social | Tessa remembers work/custody; Iona learns, acts and offers terms. F4 Neri spends own means and can refuse. | A scripted agenda is not general motive-driven life. No broad rumor or institutional knowledge diffusion demonstrated. | A colleague's remembered agreement changes a later service; refusal leaves a viable alternative. |
| E6 Production | Native recipes/stations/quality → actual inventory; workshop repair/commission; F4 taught maker → provenance-bearing product → consumer. | Materials handed over are not adoption. Regional industrial capacity remains design. Management candidate has unrun behavior. | One workshop product installed or used by a named consumer; a second batch has actual demand/input and no duplicated earnings. |
| E7 History | Causal situations retain phase/cause, deadlines and attributed observations; local rain/intervention has consequence. | Era branching, actor substitution and retained whole-history archives are not supplied by context IDs. | Abstention versus changed relevant cause produces different lasting result and later report. |
| E8 Continuing life | Native unconscious recovery; same-person earned renewal; host-generated heir; isolated ended-life candidate. | One-lesson heir contradicts accepted richer inheritance. None of these is general death, resurrection or prestige. | Local success with continued play first; separate future transfer of one surviving asset, record and consenting person's relation. |
| E9 Cross-world | F5 passage → owned carrier references/cargo → destination-local method → departure/reentry → restoration. | G6 coexistence is pending; dormant preservation alone is not useful foreign operation. | A transferred means actually changes work in a distinct destination and return retains both outcomes. |
| E10 Combination | F2 explicit barrier/suppressor/projectile policies → delivery/stage/source rules → observed effect → persistent consequence. | Not arbitrary property emergence, recursive reflection, general forecast or unqualified source-law interaction. | Two independently authored properties interact in a selected ordinary consumer, with a developer-only causal explanation and an observable player result. |

Source joins: [Foundation checkpoint](../gm/dispatch/foundation-completion-2026-10-12/CHECKPOINT.md), [Village choices report](../gm/dispatch/village-choices-2026-10-09/REPORT.md), [causal situations](../../src/causal_situations.js), [learning bridge](../../src/world_completion_bridge.js), [interaction resolver](../../src/foundation_interaction_policy.js). Foundation's selected final G6 must establish compatible coexistence in one actual save; it must not be described as Q6 merely because it visits several panels.

## M1. Connected coverage map

This groups detail families under experience consumers. Smaller variants retain their existing IDs and owners in the [idea index](../IDEA_INDEX.md) and [completion standard S00–S14](../WORLD_COMPLETION_STANDARD.md). This is not a replacement ledger.

| Area / meaningful join | U direction | R/T present evidence | P useful next work | ? unresolved / smallest useful proof |
|---|---|---|---|---|
| Entry × body × local livelihood | Suspenseful coherent starts; no Frontier prerequisite | Typed per-pack durable selection, native-compatible adult starts, exact content binding | Two qualified local snapshots for C-a below | Preference/reroll policy; first useful action without unrelated native campaign credit |
| Person × body × life × controller | Distinct identities, bodies genuinely matter | Owner/controller/body references; supported hand-dependent work and renewal | Preserve identities through selected actions; do not replace them with labels | Arbitrary host/clone/network control absent; body changes work while person knowledge stays owned |
| Skills × methods × tools | Several advancement forms; ordinary skills can become extraordinary | Native XP, craft quality, Watchcraft, F4 separate learners | One new function consumed by work, not another generic XP bar | Extended mastery/endgame unproven; actual unable → able comparison |
| Constitution × anatomy × inheritance | Local bodily mechanisms and lineage possibilities | Capability origin tags, body practice, supported typed body | World-specific process when selected consumer needs it | Genetics/organ/brood palette is not runtime organ simulation; one functional tissue/means proof later |
| Truth × observations × decisions | Hidden properties act; knowledge follows means | privateTruth, attributed basis, actor knowledge stages, observed UI | Historical observation plus changed-condition test | General beliefs/conflicting witnesses absent; useful correction without truth leak |
| People × duties × opportunities | NPCs have means and can act independently | Controllers/jobs, commitments, remembered teaching, real refusal | One durable colleague relation alters later work | Autonomy versus agreed routine; no claim of a full society |
| Housing × production × economy | Homes/workshops/trade/management can matter | Native fixtures; repair/stock jobs; management source candidate | One useful facility with real cost, owner, output and recipient | Integrated management candidate unqualified; repair changes available production/use |
| Technology × practice × adoption | Idea alone is insufficient; instruments/tools/organization matter | Native station/material/quality gates; F4 measure/product | Reuse one selected tool/process advance and actual demand | No universal tech level; blueprint versus build versus reliable repeated use |
| Danger × power × aftermath | Native defeat intact; local death and OP paths allowed | Native combat/recovery; F2 local effects; isolated lethal continuation | Keep C-a peaceful viable; qualify a powerful resolution separately | No source-backed universal counters; old problem remains solved |
| Time × history × natural course | Causes can be changed; local clocks | Joined boundary clock, situations, instance visits and leases | One event with abstention/intervention and retained aftermath | Archive/era/rewind meanings; removing a cause really prevents its old consequence |
| Endings × carriers × legacy | Inherit what actually survives and transfers | Same-person renewal; old heir host; isolated death archive | Correct selected legacy route when chosen, without universalizing it | Full inheritance not implemented; asset/record/person transfer contrasted |
| Travel × local interpretation | Actual carriers; distinct rules | F5 retained method/custody; destination-native bindings | Second functional application once C-a exists | Scalar rank conversion remains unselected; useful arrival and consequential return |
| Presentation × discovery × controls | Center-menu baseline, expressive text, observer knowledge | action_legibility; known-person/world projections; integrated UI bounded proof | Current-work and return account from actual existing records | Human pacing/accessibility/feel open; hidden properties stay hidden while save status remains exact |
| Saves × content × production | Integrity, privacy, exact history/content meaning | Validated import, storage guard, writer lock, exact pack hash, scoped rollback | Profile current import; narrow consumer validation | Recovery/long-run scale unqualified; compatible meaningful journey restores exactly |

The [genetics/constitution palette](../GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md) correctly distinguishes sample possession, faculty expression, practical coordination, identity and transmission. Its six layers are useful authoring questions, not six new meters. [Technology](../TECHNOLOGY_AND_PROGRESSION.md) distinguishes capability, workmanship, condition, rarity, personal knowledge and regional adoption. Keep those distinctions whenever a selected route consumes them; do not implement all listed axes first.

## A1. Architecture map

### Four layers and justified reuse

| Connected feature | L1 Player experience | L2 Local rule | L3 Shared capability | L4 Production capability |
|---|---|---|---|---|
| A useful commitment | Decide, wait or cancel, receive actual result | Stock, price, duration, deadline, permissions and refund | Existing quote/sequence/staged plan/publisher/job identity | Validate references; natural journey; rejected-write and restoration cases |
| Learn and execute | Know what changed; perform a newly useful function | Instruction, practice, body/tool/fuel requirements | Existing actor knowledge, capability queries and authoritative native bindings | Before/after scenario and recipient-independence check |
| Observe and revise | Learn through an instrument/person/test | What this channel can read, errors, concealment | Basis/time/source attribution and qualified projection | Spoiler-safe checks across menus, failures and observations |
| Body-shaped work | An alternative grip/tool/route actually helps | Anatomy and local task fit | Existing body identity and action admission; P extension only for another selected form | Changed-support interruption and equipment-fit scenario |
| A living collaborator | See a person's accepted work and later response | Goals, consent, wages, travel and local fatigue | Jobs/controllers, relationships, custody and information delivery | Actual independently learned production/use plus refusal |
| A place improved | Use a workshop/home after a project | Facility function, local inputs and ownership rights | Sites, items, stock, claims and durable effects | Repeated consumer plus later return; not just repair flag |
| Cross a boundary | Carry something, adapt, return | Carried state, physics, absence and local application | Existing instance/carrier references and sole transaction authority | Two distinct consumers, missing-content and return proof |
| Continue after closure | Choose next pursuit or supported successor | What ends, what remains, who accepts | Existing transition/renewal plans; future actual custody transfer | Distinct continuity scenarios, old-save compatibility |

**R:** architecture already has plan/preview/effect validation, authoritative external native adapters, simulation owners, jobs, causes, content revision checks and one guarded publication route for selected expansion operations. It is not merely a collection of UI prototypes. [main's publication](../../src/main.js), [simulation contracts](../../src/simulation_contracts.js), [world instances](../../src/world_instances.js) and [structured starts](../../src/structured_pack_runtime.js) substantiate these seams.

**I:** the pressure is integration cost and projection coupling. Main assembles many local context/fact providers; the same common clock touches optional residents, gear owners, observed samples and world support. Recent missing-actor, native-gear-owner, sample-owner and stamp-restoration defects show why a locally correct operation can fail in a joined journey. They justify targeted contract tests and an actual combined journey, not a wholesale rewrite.

### Premature universals and duplication to avoid

| Code | Evidence | Review disposition |
|---|---|---|
| A-a Universal research | North-star “Research as a standard system” calls every world's growth research and suggests two bars. | P only. Reuse job/result plumbing where useful; retain local digestion, refinement, instinct, inheritance and direct level growth. A research UI is not the underlying meaning of all progression. |
| A-b Universal costs/counters | Means palette says every means has counters; older temporal proposals insist time-like powers are priced. | Not accepted universal constraints. Unlimited means and uncountered outliers can behave literally. Validate only actual supported local mechanics. |
| A-c Universal canon resistance | Older timeline inertia includes plot weight and substituting roles. | Later cause-based planning and U outrank it. Replacement actors need independent motives/means; do not resurrect canon through a score after its necessary cause is gone. |
| A-d Universal physiology in a shared resolver | `foundation_interaction_policy.js` supportPresent requires humanoid form, two usable hands and matching owner/controller; its policies are explicitly finite development laws. | Valid for the named proof, not demonstrated engine support for one-handed casting, ghosts, installed machines or a system-guided host. P: when a selected second consumer needs it, move that eligibility into its local policy while retaining identity/source/lifecycle checks. |
| A-e Duplicated epistemic projections | knownPeopleView appends several local views; world and learning projections also compose explicit known facts. | Different local presentation is legitimate. P: extract a touched attributed-observation helper only after two consumers need identical semantics. No new parallel knowledge owner. |
| A-f Data-only worlds as a requirement | Older north-star wording expects every mechanic as data and no new host modules. | Useful ambition for common operations, not a ban on new qualified mechanics. A novel law can need code. Require a handler, real consumer and tests; do not force it into misleading existing tags. |

### Epistemology and emergence

**R:** [causal situations](../../src/causal_situations.js) retain private truth, context, phases and causal receipts. Knowledge basis can be recollection, observation, instruction or inference, attributed to an actor/situation. Simulation knowledge stages are seen/interpreted/understood with value, time and cause. [Action legibility](../../src/action_legibility.js) filters requirements and quotes through explicit disclosure, including partial OR alternatives. [Known people](../../src/people_knowledge.js) and [world identity](../../src/world_knowledge.js) do not introduce everyone merely because a registry contains them.

**I:** this supports the beginnings of `truth → evidence → attributed observation → displayed understanding`. It does not establish a general belief engine with simultaneous contradictory hypotheses, channel-specific precision, calibrated measurement, language comprehension, memory decay or false testimony. A string tagged understood is not proof of correct understanding. An NPC knowing a fact is not proof the player received it. The recent sample-owner repair demonstrates this distinction operationally.

**P:** choose one revisable observation for C-b or within C-a, retaining target/context, source, time and the basis of a claim. Actual effects evaluate truth regardless of whether it was inspected. An older claim remains a claim about an earlier state. A failed experiment reveals only what its witness could establish; ignorance should not itself add a generic random danger roll. Misinformation, language and conflicting witnesses remain world-specific later unless this proof requires them.

**U/P:** fictional uncertainty must stay outside application trust. Saving failure, accepted resource charges, cancellation terms, accessibility settings and import errors need accurate feedback. A fake status window may lie in fiction, but cannot impersonate a real successful save. Developer traces and exported raw state can contain truth and therefore are not player journals.

**R:** F2 validates finite interaction stages/channels, source support, expiry and released projectiles, rejecting recursive reflection and unknown precedence. This is a useful scoped implementation rather than unrestricted emergence. **P:** add interaction tooling only with the next actual consumer: synthetic scenario with fixed initial state/seed, ordered cause trace, exact property provenance and expected final effects. Trace information remains developer-only and spoiler-safe. Bound loops explicitly; detect ambiguous or impossible supported states rather than fabricate a “fair” outcome. Broader pairwise catalogs, universal physics and a global Noita simulator remain unnecessary now.

### Sustainable production

**R:** the repository separates research/source ledgers, world briefs, mechanical definitions, Ink scenes, native hosts, tests, built/browser evidence, director review and accepted PROJECT decisions. The completion standard already offers detail IDs and qualified coverage. Foundation's 166 leaves, the idea wave's 179 cards/693 specified cases, and management's 84 source commands represent different products. They do not accumulate into world completion.

**I:** the main production bottleneck is turning proposed cards and isolated returns into one playable natural journey with meaningful repeat use. Another inventory without consumers makes this harder to direct. Some introductory status text is stale, and handoffs have accumulated multiple obsolete next-step recipes. Existing worker receipts should be retained, but one current owner should state the latest remaining gate.

**P:** for selected work, keep one local route record with source/authority, action and handler IDs, actor/site/tool/material references, content revision, information route, output consumer, continuity policy and evidence pointer. Reuse S00–S14, not a new grand matrix. An eventual pack validator can check references, unique IDs, dependencies, supported fields/effects, bootstrap viability and engine/content compatibility. It cannot certify fun, source fidelity or whole-world simulation. Add checks incrementally for actual authoring errors; do not require an editor, universal DSL or a plugin pipeline before the next arc.

Source qualification and writing are distinct: an accurately read book does not supply a usable action; an action does not prove its source rule. Harmless scenery or an incidental person may remain texture. Qualified research should be consumed by a selected route, not copied into yet another summary or reread by default. This review acquired no source material and publishes no sealed truth.

## Q1. Proof-depth assessment

Q codes here mean experience depth, not Foundation's internal G gates or the completion standard's C stages.

| Depth | Existing evidence supports | Does not support |
|---|---|---|
| Q1 Action | Native actions and numerous scoped repairs; F2, F3, F4 player use, F5 and selected craft have reported source/native checks. | Every registered command or future source-law variant. |
| Q2 Loop | Village repeated paid work and custody; learning/practice/use; selected production/collection and native routines. | Subjective worthwhile cadence or every repeatable activity. Technical repeatability is narrower than fun. |
| Q3 Arc | A bounded Village rank/study/teaching sequence records meaningful changed opportunity. Isolated starts/world candidates report finite aftermath. | A sustained life/career with naturally connected choices across many returns, or all alternatives combined. Technical arc evidence has no automatic director acceptance. |
| Q4 Continuity | Exact selected save/reload/import, F5 departure/reentry and carried method/cargo; F3 same-person renewal. | Correct general heir inheritance, full archives, every absence/offline policy or all native atomicity. Reload is weaker than a meaningful life transition. |
| Q5 World | Connected places/people/work exist; finite editions have local proofs. | No inspected evidence establishes a coherent whole represented world with distinct ordinary and extraordinary pursuits, natural course and extended continuation. This review does not declare all worlds incapable; the gate is unqualified. |
| Q6 Multiverse | World-instance/travel machinery and local carrier proof provide groundwork. | Two distinct sufficiently lived worlds interacting through a useful means while retaining rules, identities and histories. Several Q1–Q4 tests do not sum to Q6. |

**I:** the project is strongest at bounded Q1–Q4 mechanisms, uneven at repeated experience, and still open at Q5–Q6. The next proof should increase connected depth rather than maximize command count. Foundation closure is a technical substrate milestone, not whole-game completion.

## C1. Candidate milestones

All four are P and require a later authorized scope/ownership decision. None resumes World1. Estimates below are qualitative integration judgments, not schedules or measured costs.

| Candidate | Player story / horizons / reuse | Missing pieces and dependencies | World/source and risk | Deliberately unproven | Success gate / stop condition / next-proof value |
|---|---|---|---|---|---|
| C-a Dependable small workshop **recommended** | Begin as one of two coherent local workers. Earn, learn a useful process, improve or access a facility, supply someone, choose personal versus agreed colleague work, return to changed prospects. H1–H4 and limited H5/H6; reuse native craft, quotes, custody, F4 learning/provenance, remembered terms and site state. | Local start binding; a viable peaceful acquisition/service route; one functional process/tool improvement; repeated recipient demand; one changed later offer/use; bounded routine and return account. Needs Foundation F4/G6 and exact shared release. | Original selected district, Frontier reuse optional. No book acquisition. Medium join risk across economy/knowledge/UI/native owners; new start must not inherit unrelated campaign credit. | Full society, general offline catch-up, death/prestige, genetics, powerful late scale, second world. | Two starts → real livelihood → unable/able contrast → two useful production cycles → independent collaborator contrast → later opportunity → literal roundtrip; no grants or double payment. Stop at this arc and director-playable checkpoint. Best next test of whether the core can sustain a life. |
| C-b A mistaken reading becomes useful knowledge | Investigate one local problem, obtain an instrument/contact, test a hypothesis under changed conditions, use the revised belief, hear a later consequence. H1–H3 and limited H5; reuse F4 sample/measurement/provenance and causal situations. | Retained historical claims, one controlled counterexample, deliberate uncertain feedback and independent information delivery. | Original or already qualified source situation. Medium projection/spoiler risk; low geographic scope. | Livelihood sustainability, broader relationships, macro technology, long life, multiverse. | Genuine observations before/after changed cause; same truth effects when unknown; useful revised action and later account survive restoration. Stop after one discovery cycle. Strong discriminator for epistemology, less informative about session longevity. |
| C-c An unfamiliar body acquires a useful trade | Supported altered anatomy changes tools/clothing/work; learn or commission a fitting method, earn through it, develop one real faculty/function and retain history through a declared renewal. H1/H3/H4/H6; reuse F3 jig/refit, body practice, capability provenance and native equipment. | Reachable repeat livelihood beyond development room; progression consumer; local social response from observed evidence. Do not invent outbound travel solely to pass a chain. | Original supported body; not a direct Warhammer/gene-looting implementation. Medium/high body/native-adapter risk. | Arbitrary species/childhood, hereditary genetics, brood control, family tree, world completion. | Two supported bodies show actual action differences, useful adaptation and continued work; unsupported forms reject safely; renewal does not erase obligations or duplicate stock. Stop at one finite career/body arc. Valuable, but currently more likely to test adapters than a broad everyday loop. |
| C-d Carry a successful method to a different place | Acquire and use a method/device at home; travel with an actual carrier; adapt it for a distinct destination task; return to home consequences. H3/H5/H7, selected Q4 toward Q6; reuse F5 local method/custody and instance clocks. | A second meaningful foreign application; compatibility route with actual tools/fuel/means; after-return consumer; enough local place context to avoid a tooltip comparison. | Two already available qualified destinations; source owners supply laws if source-derived. Highest integration risk across instances, clocks, stock, observer knowledge and content versions. | Two full campaigns, universal conversion, historical branch archives, all portable powers. | Actual second use differs locally, incompatible case follows real cause, both outcomes/custody survive departure/reentry/import. Stop at one useful crossing. Important horizon proof, but premature before one sustained local arc. |

### Recommendation and scope

**P:** C-a teaches the most next because it tests whether currently separate foundations form a worthwhile repeating life. It consumes epistemology, capability, production and another person's participation without requiring every future mechanic. C-b can contribute one observation/changed-condition comparison inside C-a if the existing process naturally needs it; do not turn it into a second full milestone. C-c and C-d remain subsequent alternatives, not rejected ambitions.

**P:** no new implementation should begin before the incumbent's remaining F4/G6 technical gates and reservations are reconciled. This is a small prerequisite, not another audit or instruction from this review to resume its execution. Preserve already qualified scopes and run only affected checks. If the incumbent closes while this review is read, use its new release instead of repeating the same work.

**P:** C-a's initial represented scope is two compatible local starts, one livelihood, one functional advancement, one workshop/consumer, one named collaborator and one later consequence across roughly three return points. This is a scope bound, not a universal minimum or a promise of exact real-time length. It advances a one-realm slice; it does not close the accepted first milestone's prestige layer. Prestige needs a separately selected local mechanism and continuation proof. Do not rename ordinary renewal as prestige to satisfy the milestone wording.

## D1. Decision ledger

At most five current choices/priorities. None is permission to execute. No answer is required to finish this review.

| Rank / code | Class | Choice that matters | Proposed disposition and reason |
|---|---|---|---|
| 1 / D-a | Evidence decision | Are the remaining Foundation positive-use, G6 and current-leaf joins actually closed? | Read the incumbent's final receipts/release first. Current snapshot does not close them. Avoid another foundation audit or equivalently repeated suite. |
| 2 / D-b | Taste decision | Should the next experience emphasize becoming dependable through ordinary work, or investigation/body/crossing first? | Recommend C-a; alternatives C-b–d above genuinely test different pleasures. Selection materially changes scope and player story. |
| 3 / D-c | Taste decision | How much direct attention should a settled work routine demand? | Show C-a with direct first-time commitments and bounded familiar work; Weibao judges its actual interruption/return cadence before expanding queue/delegation/offline scope. No global policy. |
| 4 / D-d | Taste decision, when starts are selected | What constraints and reroll/reveal behavior should suspenseful entry offer? | Two local candidates can provisionally use equal committed selection with no preview reroll; no global world distribution implied. Director chooses before building player-facing selection. Actor knowledge remains separate from an out-of-fiction player preference. |
| 5 / D-e | Evidence decision | Does representative progressed-state projection/import meet an acceptable return experience? | Measure actual current generated workload by phase before optimization or storage/platform choice. Timeout extension recovered import, but did not make it fast. |

**Reversible prototype choices:** one original district, present-clock-supported work, finite queue/budget and one later service/recipient are reasonable provisional scope choices once a milestone is authorized. They do not require answering every palette question.

**Deferred decisions:** global loss tolerance, universal reveal ladder, broad control of a brood/system, birth-to-death skip rules, app framework, infinite archives and every post-immortality mode have no current C-a consumer. Local lethal commitments and supported control must be settled when their selected slice needs them. Post-success ordinary play is included now without imposing boredom, mortality or a reset. These unresolved horizons remain available.

## R1. Risks and negative space

### Technical durability

| Concern | R/T evidence and limit | P targeted response / trigger |
|---|---|---|
| Save integrity / authority | `save_files.js` validates envelopes, preflights actual loading, guards a 4 MiB shared-origin budget including other keys. Main uses Web Locks; selected expansion publication stages before durable commit. | Preserve one writer. Exercise rejection at the selected work/settlement boundary; do not claim all native mutation paths atomic from scoped craft rollback. |
| Content identity / migrations | Structured selections bind pack/revision/hash/start/snapshot/instance/life/body; old content and missing-pack behavior have bounded proof. Canonical stamped materials needed a real restoration repair. | Freeze the selected content revision and explicit old-save policy. No inferred provenance, changed earned past or invented startup rewards. IDs alone cannot substitute for compatible definitions. |
| Branches / long histories | Instance has continuity/era/parent identity; parent is not a fork. Situations retain bounded causal receipts. Biography is explicitly lossy. | Keep gameplay history separate from narrative summaries. Before a history-aware power/inheritance consumes it, define exact retained facts and equivalence after compaction. Do not use annual highlights as authority. |
| Compaction | `life_record.js` retains 64 recent entries, 200 annual groups, limited highlights/worlds and older counts. This safely expresses a lossy biography, not arbitrary exact history. | Compact presentation freely within its declared meaning; compact receipts/claims only with a named semantic preservation proof. No branch-resume promise from a seed plus a summary. |
| Replay exploits / randomness | Expansion RNG is persisted; native combat/crafting still use Math.random. Receipts/claims/sequence guards prevent selected repeated settlement. | Test once-only results and committed start restoration. Whole-game deterministic replay and identical native retry quality are not established. Do not rewrite every RNG source absent a consumer. |
| Recovery / portability | File encode/decode/import exists; failed probe preserves current save. Retired content is retained. Named runs, recovery history and all corruption recovery are not qualified here. | Preserve last-good and actionable error. Plan recovery/slot measures when growth or packaging needs them; require actual literal-file roundtrip, not only parsing JSON. |
| Multiple tabs | Source Web Lock controls live/dev save key ownership; read-only tab paths exist. | Require actual two-tab contention for a selected authority change. Cross-browser concurrent runs and atlas merging remain a separate unresolved contract. |
| Simulation continuity | 512-boundary budget returns remaining elapsed time; occupied visit union avoids double local time; leases qualify support. | Test caller handling of remaining time for any new catch-up consumer. A budget is not lost time, but a caller can still discard it. Never extrapolate local presence pause into global offline behavior. |
| Performance | Existing positive profile samples identify common fact projection/GC. Actual progressed-save probe exceeded 15 seconds; 60-second bound then imported successfully. | Profile projection, validation, cloning, serialize/write, UI and importer startup separately on generated data. This is a named risk, unlike file line count. No numeric latency improvement is established by the repair. |
| Future packaging | Browser DOM/ES modules/esbuild/Ink are actual current implementation; previous engine review proposes portable core/platform adapters. | Extract touched boundaries with equivalent behavior if needed. Choose engine/backend/app host only after a representative measured comparison and actual lifecycle/storage needs. |

Sources: [save files](../../src/save_files.js), [import probe](../../src/import_probe.js), [main](../../src/main.js), [structured start runtime](../../src/structured_pack_runtime.js), [biography](../../src/life_record.js), [expansion clock](../../src/expansion_engine.js), [prior scale review](../ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md), [actual recent profile summary](../gm/dispatch/foundation-completion-2026-10-12/learning-proof/final-positive/FINAL_POSITIVE_PROFILE_SUMMARY.json). No stress workloads, benchmarks or runtime tests were run by this reviewer.

### Five consequential risks

| Code | Risk, evidence and implication | Recommended containment |
|---|---|---|
| R-a | Proof inflation: source declarations, workflows, candidate tests and dormant receipts can be mistaken for playable world depth. Current planned crop workflow and prepared G6 illustrate the distinction. | One final natural journey bound to current inputs; state its depth and human acceptance separately. |
| R-b | Fragmented integration: isolated verified and unverified candidates have different baselines; shared source is heavily dirty. | One integrator, exact released paths and changed-interface requalification. Never copy a dated main/bundle wholesale or revive a prunable candidate from its status text. |
| R-c | Silent design narrowing: fixed-hand shared policy, one-lesson heir, universal research/cost/canon proposals can turn local choices into engine limits. | Label selected boundaries; correct accepted-direction conflicts in their next authorized consumer. Refusing unsupported forms is honest now, not permanent impossibility. |
| R-d | Attention without life: many transactional commands can become paperwork instead of a reason to return. Technical gates cannot decide feel. | C-a natural return playtest; routine familiar work, preserve concrete texture, put detailed accounting behind readable terms/results. |
| R-e | Progressed-state reliability: real slow import and common fact projection may impair long campaigns; lossy biography cannot satisfy exact-history consumers. | Representative generated measurements and semantic history classification before more archive/instance scale. |

### Deliberate negative space

| Timing class | What belongs here and why |
|---|---|
| Necessary now | Honest authority/ownership snapshot, preservation of dirty work and qualified receipts, current remaining Foundation gate, milestone choice. No new runtime from this review. |
| Useful for selected next proof | Coherent local entry, peaceful livelihood access, one functional advance/consumer, a colleague, bounded routine, later consequence and exact restoration. |
| Reusable soon | Touched quote/commit, identity/custody, observation-basis and definition-reference validation already have more than one consumer. Extend only the demonstrated seam. |
| World-specific later | Physiology, calendars, research meaning, death/resurrection, technology substrates, lawful succession, canon exceptions, fate and compatibility. |
| Long-horizon possibility | Rich families, organs/constitutions, broods, institutions, uplift, multiple bodies, archives, temporal powers and several mechanically distinct worlds. |
| Backburner | Broad editor, universal director, every minigame integration, infinite procedural catalog, full branch-merging service. Revisit when selected content blocks without them. |
| Unnecessary until a consumer exists | One generic advancement ladder, global AP0–AP9 implementation, full ECS rewrite, every NPC every tick, universal counters, universal physiology or automatic balancing penalties. |

No table row rejects a legitimate world-specific possibility. A bounded prototype may use explicit snapshots and a few scheduled people without promising a fully simulated population. The [NPC lives implementation](../../src/npc_lives.js) is a predetermined bounded family timeline, not a general family decision model. Current context IDs, controller records and body provenance likewise should not be advertised as simulations their actual consumers do not provide.

## N1. Near-term sequence

Dependency order for C-a, contingent on later implementation authority:

1. **N-a Recover the incumbent release.** Confirm F4's independent output is actually used and restored, G6 coexists in one generated save, the affected final suite/reconciliation is current, and exact source reservations are released. Preserve valid lower-level evidence. Stop if a real integration dependency is unresolved; do not commission another broad audit.
2. **N-b Select a finite local arc.** Choose original district/host, two viable start snapshots, livelihood, one functional advance and one recipient. Record local entry/absence/queue policies and current consumers. Existing book designs remain intact; no World1 resumption. Director selects C-a versus alternatives and relevant entry/attention taste.
3. **N-c Connect one first-session journey.** Start → useful peaceful work → real resources/access → learning → tool/process use. Reuse exact native/structured owners, and implement only missing joins. Rebuild and exercise each selected start naturally. Stop adding mechanics until this works.
4. **N-d Prove repeated change and return.** Two actual useful production cycles, one independently capable/refusing colleague, bounded familiar work, a changed later use/offer, and continued ordinary play after success. Include observed changed-condition evidence only where the process uses it. Measure progressed import/projection while qualifying this workload; fix only the bottleneck that blocks the selected experience.
5. **N-e Close a playable arc.** Fresh-origin combined journey, relevant failed-write/interruption/content/old-save boundaries and actual export/reload/literal import. Give Weibao the play path, represented scope and human gates for fiction, pacing and fun. Stop at the arc checkpoint, with C-c/C-d and the separately selected prestige mechanism retained as possible next work.

This is not a substitute for the paused full-world assignment. When explicitly resumed, World1 still owns its whole-source/whole-world represented horizon and remaining S00–S14 gates. A small workshop proof cannot retrospectively close that goal.

## H1. Long-horizon map

| Horizon | What C-a could provide | What still needs a selected proof |
|---|---|---|
| Richer personal lives | Useful repeated work, possessions, learned methods, durable colleague and changed place | Several independent pursuits, aging/retirement where fitting, romance/family, failure and changed goals |
| Ordinary → extraordinary | Ordinary method already has real consumers and provenance | An expanded function or powerful combination changes daily work literally, without arbitrary penalties |
| Unusual bodies/constitutions | Separate method, body/tool eligibility and available services | An acquired/changed faculty with actual everyday effects, distinct knowledge and transmission |
| Technology and institutions | Workshop capacity differs from knowing a recipe; another trained maker provides real production | Tools-to-make-tools, distributed supply, demand, adoption and independent institutional action |
| Continuing lives | Surviving tools, records, relationships and projects are concrete rather than invented reset bonuses | Actual local inheritance/custody, resurrection, renewal, body change or prestige separately qualified |
| Causal worlds | A later service/space reflects earlier conduct and a local situation changes for an actual cause | Several independent event courses, meaningful divergent aftermath and sufficient represented world depth |
| Cross-world play | A well-defined method/product can be an actual carrier rather than a tier label | Useful foreign application, local compatibility, independent histories and consequential return |
| Broader control | A colleague has independent knowledge/means and communicates a result | A system-guided host, multiple bodies or brood with explicit control/communication scopes |
| App delivery and scale | Selected command/state/persistence seams and representative workload | Host lifecycle/storage/input qualification and measurement-led packaging choice |

**I/P:** ambition survives best when every expansion adds a meaningful possibility to a life or world, and reusable machinery follows actual repeated needs. A sequence of finite connected proofs can support a very large design. It cannot promise every imaginable interaction today, nor should it turn today's supported humanoid workroom into the permanent shape of all lives.

### Review checks and remaining gate

This review checked current dirty tree/branch/worktrees, authoritative direction, dispatch state and reservations, representative relevant implementation, existing receipts and workflow-versus-result distinctions. It inspected the current bundle fingerprint and the latest recorded profile. It ran no tests, rebuild, browser journey or performance workload; T statements cite prior owner evidence. No implementation acceptance is implied.

The report is the completed deliverable for this review. Next implementation needs a selected milestone and current ownership release. Foundation's authoritative remaining technical gate is its final qualifying F4/G6/reconciliation evidence, not this report. Human fiction, pacing, balance, feel and fun remain unaccepted unless Weibao explicitly accepts them.
