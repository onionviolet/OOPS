# X01–X09 life-detail specialist return

2026-10-12. Exclusive writer: life-detail specialist, this file only. Root integrates final cards. Frozen scope: the eighteen leaves in MANIFEST.json for X01–X09. All scene details, additional states and rules below are original proposals. Inspected source provides seams, not runtime proof. No shared source, saves, build, source library or other output changed. No gameplay tests run.

## Provenance and reconciliation

Canonical direction: [PROJECT](../../../../PROJECT.md), [romance expansion](../../../LIFE_SIM_NORTH_STAR.md#romance-expanded), [means](../../../MEANS_AND_APPRAISAL.md), [implementation-support brief](../../MICRO_MESO_MACRO_IMPLEMENTATION_SUPPORT.md). The [prior MM manifest](../macro-micro-detail-2026-10-11/MANIFEST.json) and [detail ledger](../macro-micro-detail-2026-10-11/DETAIL_LEDGER.json) preserve exact original IDs. The earlier MM cards remain their owners. These leaves deepen unresolved social recipients, recognition, interpreted action and evidence consequences rather than replacing MM01–MM10. G3-015 already owns friendship/romance/shared futures; G6-026 owns research programs; I36 owns reflection. No new claim of first discovery.

Inspected implementation evidence, relative to repository root:

| Evidence | Actual inspected seam and limit |
|---|---|
| `src/everyday_life.js` | `socialCommands` includes habits, interruption, quiet time and practical apology; relationships use directed familiarity/respect and remembered text; `everydayFacts` derives busy/present conditions. This supports a small social exchange, not a completed romance engine. |
| `src/simulation_effects.js` | `simulationFacts` projects actor-specific knowledge/basis and target relationship axes; `applySimulationEffects` writes knowledge and relationship memories, staged inventory transfers, conditions and other typed effects. A numeric axis is not agreement or proof of an unseen event. Relationship memories retain only the latest 32 entries, so a live agreement cannot rely on that history alone. Knowledge effects replace only at equal/higher supported stage; a revised uncertain claim needs an explicit update policy rather than assuming rank downgrade works. |
| `src/village_career.js` | Schema 4 custody/study/recruit state; `watchcraftPresentation` separates known/practiced/executable; `beginVillageTeaching` and `advanceVillageMentor` address Iona specifically and support several local terms. They are not generic autonomous delegation or household scheduling. |
| `src/proto23_world_content.js`, `src/proto23_world_actions.js`, `src/proto23_world_state.js` | Original Mara/Toma actors, finite stock, handling reading/instruction/practice, notebook review and `proto23.home_kit`; actual knowledge attribution, physical notebook and native material outputs. Admission currently requires a living controlled supported human body. Validation binds claims to actual completion receipts. |
| `src/feature_expansion_nested_life.js` | Separate finite Brin/Ivo jobs, reserved inputs, retained object, wage and later exchange; `previewNestedLifeCommand`, `commitNestedLifeCommand`, presentation and validation. Useful recipient/account pattern, not permission to replace those stories. |
| `src/life_record.js` | Explicitly a lossy biography, never authority for relationships, rewards or quests. New agreements cannot live only in biography. |
| `src/simulation.js` | Selected reset policies can delete knowledge/relationships; this is not a world-independent identity-continuity guarantee. Any copied/changed-body promise policy needs an explicit decision. |

Contexts: ordinary Village uses existing craftsman/Tessa/Iona only in their established capacities; proposed romance counterpart **V-R1** is an original adult resident with their own craft apprenticeship and no established runtime actor. Proto23 is the [bounded retained-body visitor branch](../../../worlds/proto23/WORLD_BRIEF.md): Mara/Toma and cottage fiction are original adaptations, not source romance/courtship lore. Extraordinary **GH-R1/GH-C1** are wholly original Glasshouse-compatible proposal fixtures (a rooted communicating person and a copied actor), not claims about existing Glasshouse secrets or mechanics. Each selected context needs its world owner to freeze exact actor/body/communication rules before implementation.

## X01 Romance and affection

### X01-A specific invitation and friendship continuation

**Owner/status/new detail.** G3-015; north-star romance; MM02 household and MM08 time are adjacent. Proposal adds an invitation with an actual reply and friendship aftermath, rather than expanding a relationship threshold. Local Village scene: V-R1 is finishing a commission and can prefer an afternoon walk as friendship while declining a romantic framing. Their willingness is authored independently from comfort/respect and can change after a received conversation.

**Actor/target/means/discovery/verb.** Player and V-R1 can each invite, clarify, accept, decline or offer a different occasion. Spoken contact requires meeting and shared communication; a delivered note is a distinct route. Player learns availability by asking or receiving V-R1's offer, not reading a private timetable. NPC learns player intent through the invitation's stated framing; no omniscient affection tooltip. Both retain an ordinary leave/refuse action.

**Order/effect/response/continuation.** Receive invitation before resolve reply, then record whether a specific occasion is agreed; the calendar owns an appointment only after agreement. Recipient can reply “I would like the walk as friends,” and that reply becomes player-known evidence, not universal rejection history. A walk has an optional conversation and later familiar greeting; a full friendship future remains available. Romantic follow-up needs a fresh mutual agreement, never a gift count.

**Interruption/state/gate/contrast.** Leaving before delivery creates no received message; leaving after acceptance preserves their received agreement and allows cancellation/renegotiation. Proposed agreement IDs live with simulation social state, clock jobs with simulation jobs, recollection with actor knowledge and biography only a projection. Next gate: reserve one social-command/appointment adapter and register V-R1 with declared adult life stage; prove accepted-friendship, declined-romance, cancellation and restored agreement. Proto23 comparison must first qualify an original adult counterpart rather than reuse the source kid; GH-R1 can invite a visitor to stay near its rooted body only through its declared voice/channel.

### X01-B gift provenance and conflicting feelings

**Owner/status/new detail.** G3-015, G6-012; MM01 custody/MM03 quality. Original proposal specifies taste and provenance separately from affection. V-R1 likes a repaired personal cup but dislikes an expensive object acquired by taking a colleague's property. The receiver can appreciate workmanship, doubt the giver's account and decline possession simultaneously; no fixed emotional response or global moral rule follows.

**Actor/target/means/discovery/verb.** Player offers a particular held cup, source/history and optional repair account. V-R1 inspects by ordinary senses, asks its previous owner if reachable, or simply trusts provisionally. NPC can offer the player a gift using their own stock and willingness. Taste is learned by conversation or a visible reaction; concealed provenance stays unknown unless an actual means reveals it.

**Order/effect/response/continuation.** Offer is distinct from accepted transfer. A recipient who declines leaves custody unchanged. Acceptance updates the actual inventory owner; the known reaction/memory references the object and exchange. A preserved cup can reappear during shared tea; a later discovered origin can change trust without deleting its physical use or earlier appreciation. Repeated identical gifts can be welcomed, unwanted or unnecessary according to that person's situation, without automatically awarding another romance step.

**Interruption/state/gate/contrast.** Interrupted offer reserves no permanent transfer; already accepted gift remains theirs when the player leaves. Native inventory/transfer owns possession, proposed object provenance owns carrier history, directed relationship memory owns response and actor knowledge owns evidence. Gate: bind gift instance/provenance to a supported inventory identity, prove acceptance/refusal/repeated offer and later attributed correction. Proto23 steward review already distinguishes returned notebook from sold ownership; that is a comparison seam, not a gift engine. GH-R1 may accept a projected song rather than an inventory item only after an actual sensory/recording consumer exists.

## X02 A shared life

### X02-A shared calendar renegotiation

**Owner/status/new detail.** G1-005, G3-005, G3-015, G3-021; MM02/MM08. Proposal adds overlapping independent commitments and explicit renegotiation. V-R1's apprentice inspection and player patrol can conflict with a planned meal. Relationship agreement does not give either actor command over the other's career.

**Actors/means/discovery/verbs.** Both actors disclose, ask, propose, confirm, renegotiate or decline. Their own spoken reports or shared calendar grant knowledge; neither sees private future plans automatically. Player can arrange a different meal, invite someone else or accept missing this occasion; NPC can likewise keep work or change it if they hold that authority. Borrowed transport/helper availability is a separate actual means.

**Order/effects/channel/continuation.** Write the shared meal appointment only after both accept. A subsequently accepted work change causes a new proposal, not silent rewriting of the partner's appointment. The response is delivered by conversation/note and each actor's receipt records which revision they accepted. A late arrival can lead to a saved portion and another conversation if V-R1 chose that, without universal affection loss or mandatory punishment. Later shared planning can use learned preferences.

**Interruption/state/gate/contrast.** An unreceived proposal cannot cancel their accepted plan; travel can interrupt delivery, and absence resolves only the declared local clock policy. Appointment/acceptance revision needs a domain owner alongside jobs, with actor-known projection and additive save default empty. Gate: select one clock, explicit delivery and supported conflict, then prove accepted update, declined update and reload midway. Proto23 attention/shop/job timing is bounded source-inspired work, not evidence of canon household calendars. GH-R1 may have no travel conflict but can have an independently chosen visitor session; powerful communication removes delay if its actual rule allows it.

### X02-B separate possessions and care offer

**Owner/status/new detail.** G1-005, G3-005, G3-007, G3-015, G8-021; MM02/MM03. Proposal distinguishes household access, personal tools and volunteered care. Sharing a cottage does not merge purses or transfer a partner's instrument. V-R1 can request help maintaining their tool while keeping ownership and deciding whether to accept.

**Actors/means/discovery/verbs.** Player asks what help is wanted, borrows with scope, repairs, cooks or declines. Recipient can demonstrate the problem, lend a tool, do it themselves or commission another willing person. Observation diagnoses only what the player can inspect; private medical/body information needs its own means and permission where applicable, not shared-household membership.

**Order/effects/channel/continuation.** Consent to handle precedes custody, repair uses actual stock/tools, and owner tries the repaired object before declaring the need met. A care offer can be “bring tea and leave me quiet,” producing actual supplied tea and a remembered specific response rather than an obligatory care meter. A working tool can support V-R1's later commission; thanks and romance remain independent outcomes.

**Interruption/state/gate/contrast.** Refusal leaves stock/relationship promises untouched except the known exchange; cancelled repair returns declared reservations and preserves a still-broken object. Inventory/custody and typed object state own mechanics; directed agreements/knowledge own scope, native downstream job owns use. Gate: choose one personal item and actual consumer, avoiding another household inventory. Proto23 cottage access conveys local installation/use rights but not Mara's stock; GH-R1 may physically house visitors while retaining its own bodily structures, requiring a typed body-object boundary before anyone repairs them.

## X03 Strange relationships and identities

### X03-A changed-body recognition

**Owner/status/new detail.** G1-009/G1-010/G1-018/G1-020, G2-018/G2-026, G3-015; MM07 and J04. Proposal deepens recognition and communication before shared-life continuation. An original consenting adult player becomes GH-R1-like rooted form in a disposable design fixture. Continuity carrier is explicitly declared; familiar appearance is not presumed.

**Actors/means/discovery/verbs.** Changed actor has a selected voice or written signal; partner can ask about a private shared memory, inspect a held continuity marker, consult an available trusted witness or remain uncertain. Player can explain, offer evidence, request a visit or accept distance. Partner has only their actual perception/testimony means, never save-history access by default.

**Order/effect/channel/continuation.** Change body through its own authorized future effect, establish contact, then compare evidence. Recognition can become “credible but uncertain” separately from present willingness to keep a relationship. An accepted visit changes routines to a reachable place; later intimacy remains appropriate to actual life stage and mutual agreement. No automatic relationship reset, no automatic restored courtship when the body returns.

**Interruption/state/gate/contrast.** Failed voice transmission gives no received proof; recipient may refuse a test or proposed shared-life change. Body owner, identity-carrier owner, recipient knowledge and current agreement remain separate saved domains. Gate: freeze exact carrier/body communication and recognition response, inspect reset policy so transformation does not accidentally delete history, prove uncertain contact and independently accepted continuation. Village can use ordinary voice/recognition; current Proto23 admission rejects unsupported form, so its nonhuman visit needs an exact native body/admission adapter, not a fabricated canon exception.

### X03-B copy with untransferred promises

**Owner/status/new detail.** G2-002/G2-003/G2-015/G2-017, G3-015/G3-021; MM06/MM07. Original GH-C1 proposal copies a memory record while creating a distinct actor identity. Physical/mental resemblance, ownership of material goods and promise participants are separately declared. Copying recalled promises does not by itself substitute the copy into an existing agreement.

**Actors/means/discovery/verbs.** Original, copy and partner can introduce, ask, inspect evidence, agree a new role or refuse. Partner can learn that a copy exists only through arrival/report or actual identification means; copied memories alone are not proof of current identity. Copy can sincerely want to help and hold skills without owning the original's kit.

**Order/effects/channel/continuation.** Create distinct actor with exact declared copied fields; display only recipient-observable evidence; request a new agreement if the copy wants to undertake the original's household task. Accepted substitution names all agreeing parties and specific obligation. Partner can accept help as friendship while declining romance; original remains responsible for untransferred obligations. If a selected extraordinary rule genuinely shares identity/commitments instead, author that different rule rather than covertly forcing separateness.

**Interruption/state/gate/contrast.** Unwilling partner or missing communication stops agreement transfer, not the copy's existence. Native actor/body creation needs its owner; proposed commitment participants reference stable instance IDs; inventory owners and recipient knowledge persist independently. Gate: specify exact copy recipe, no duplicated inventory/purse by accidental cloning, then prove both distinct and explicitly shared-identity variants only if separately supported. Village recognizes ordinary distinct participants; Proto23 currently validates selected player receipts and offers no generic copied visitor role, an exact adapter dependency.

## X04 Features inside features

### X04-A commission inspection and actual user

**Owner/status/new detail.** G3-011, G6-001/G6-003/G6-008/G6-012/G6-026; MM01/MM03 and J01. Proposal extends a repaired survey tool beyond “quality increased” to an actual user's trial. Customer may be an intermediary, user an apprentice, inspector the craftsman; these roles cannot silently merge.

**Actors/means/discovery/verbs.** Player accepts specifications, asks user, diagnoses, reserves stock, repairs, requests a trial and revises. Craftsman can inspect with held tools and identify observable defects; apprentice can try it on their supported task. Customer can approve custody but lack authority over apprentice's willingness. Extraordinary instant repair is allowed if it truly produces the requested functioning object; it skips manual labor without pretending a trial occurred.

**Order/effect/channel/continuation.** Capture agreed function and owner, then work, then actual user tries it. A result changes one native survey/preparation output; inspector report records scope, not universal mastery. Wrong diagnosis can leave function unimproved even if finish looks attractive. The received report may support a later commission or method revision through actual cause.

**Interruption/state/gate/contrast.** User unavailable delays trial while a completed object exists; refusal to trial does not erase repair. Stock/custody/object condition, contract terms, user task output and attributed report each retain owners. Gate: choose a native consumer and typed defect/repair effect; prove intermediary approval without user availability, cancellation and powerful repair. Brin/Ivo finite nested jobs are source pattern references, not repeated assignments. Proto23 shaped stave/home kit supplies an actual material consumer; original GH-R1 needs a reachable sensory trial if it uses something without hands.

### X04-B admission versus attendance versus credentials

**Owner/status/new detail.** G3-004/G3-010/G3-013/G3-014/G3-018; MM05/MM09. Proposal distinguishes permission to enter, completed study, demonstrated competence and an issuer's actual credential. A Village practical circle admits visitors; it can welcome someone who already knows more than its teacher without requiring artificial beginner progression.

**Actors/means/discovery/verbs.** Applicant asks admission or observation, studies/teaches with held means, demonstrates and asks issuer recognition. Teacher can lack recognition authority; examiner can recognize a result without claiming to teach it. Student sees published terms or learns from a received answer. Free mentoring, paid instruction, trade or self-study remain locally chosen alternatives.

**Order/effects/channel/continuation.** Admission grants specified access only; attendance records actual participation; execution produces a task result; a named issuer can then issue a credential if their local policy supports it. Credential consumer is one actual workshop access/commission rule, not a decorative badge or universal social authority. An exceptional actor can demonstrate first and seek examination without compulsory attendance when policy allows.

**Interruption/state/gate/contrast.** Leaving halfway retains received material but no false completion; rejected credential request can leave knowledge intact. Access facts/rights, jobs, actor knowledge/practice, issuer claim and native service gate remain separate. Gate: freeze issuer authority and credential consumer; prove knowing without attendance, attendance without mastery and direct demonstration. Proto23 Toma handling instruction/practice is bounded original tutor content, not canonical graduation or dojo certification. GH-R1 can participate remotely only through actual teaching channel and task-compatible means.

## X05 Research and invention

### X05-A controlled negative result

**Owner/status/new detail.** G6-026, G6-005/G6-022, G3-010; MM03/MM09 and J02. Original proposal tests whether prepared stave behavior comes from drying or shaping. This question is a design fixture, not a Proto23 source claim. Negative outcome matters by changing the next experiment/recipe choice rather than awarding automatic discovery XP.

**Actors/means/discovery/verbs.** Player notices an actual differing output, records sample identity/provenance, hypothesizes, prepares comparison, measures and asks a willing specialist. NPC can run the comparison with their own instruments/stock and report only what they observed. A remembered recipe or plentiful created stock supplies materials, not an unmeasured result. A power that genuinely reveals the answer may bypass experiments, with its declared evidence basis.

**Order/effects/channel/continuation.** Compare authored treatments against a control and an observable consumer, preserving changed variables. An unsuccessful trial records “this tested preparation did not improve this output,” not “all versions impossible.” Report reaches a mentor only by actual delivery; next action can adjust method, repeat or abandon. Changed hypothesis remains inference until further evidence; replicated result and institution adoption remain later separate actions.

**Interruption/state/gate/contrast.** Interrupted treatment returns/consumes materials according to selected job rule and records no completed measurement. Actor knowledge records basis/sample/result; native recipe/output owns effect; experiment receipt owner must be selected before any generic research save. Gate: implement one controlled pair with actual task output and false-positive counterexample. Village tool work offers ordinary measurement; Proto23 hearth/stave/kit gives inspected compatible seams but no experimental record engine; GH-R1's extraordinary sensor needs a declared measurable output rather than assumed omniscience.

### X05-B demonstrated teaching and local execution

**Owner/status/new detail.** G3-010/G3-018, G6-005/G6-022, G8-011/G8-012; MM09, MM-D09 and MICRO-P3. Proposal adds independent recipient use after an attributed demonstration. No new universal learning level or repeat of Village's implemented Iona lesson is proposed.

**Actors/means/discovery/verbs.** Skilled player offers instruction; willing recipient asks, observes, practices and later attempts a declared task with their own body/tools. Teacher can provide notes or lend a tool, but borrowed access is not ownership. Recipient learns through actual demonstration/report; teacher knows independent success only by witnessing it or receiving a credible report.

**Order/effects/channel/continuation.** Demonstration establishes known method, rehearsal establishes local practice, compatible tools enable execution. Recipient's actual later task produces a result owned by its native consumer. A returned notebook is not transferred authorship; teaching a method does not automatically grant access to a restricted workshop. Recipient can adapt the method and teach another willing person only after their own authority/capability is established.

**Interruption/state/gate/contrast.** Unwilling learner, incompatible body or missing tool prevents that execution route; a superior held means can execute without simulated practice where its actual rule permits. Actor knowledge/practice, inventories/custody and task receipt remain separate; agreement terms persist only if actually accepted. Gate: use Iona's inspected known/practiced/solo route as comparison, select one new recipient/consumer under MM-D09, prove notes-only failure and genuinely capable direct use. Proto23 handling notebook is personal attributed learning, not automatic tutor qualification; GH-R1 needs nonhand task and communication adapters before it teaches by root-sense.

## X06 Pondering and self-understanding

### X06-A recollection with attributed uncertainty

**Owner/status/new detail.** I36, G4-01, G3-015; north-star small remembered touches; MM08 reports. Original proposal lets player reflect on an awkward conversation without rewriting what the NPC thinks. Reflection can conclude “perhaps I interrupted” while leaving the NPC's motive unknown.

**Actors/means/discovery/verbs.** Player recalls a received utterance, compares own dated notes, journals or asks advice. NPC can reflect on their own received events and ask their own contacts. Player notes are outside-character annotations unless deliberately authored into a held journal. Recollection can be incomplete; a copied memory has its provenance, not guaranteed firsthand observation.

**Order/effects/channel/continuation.** Retrieve actual known evidence before writing a tagged interpretation. Reflection can make “ask about preferred timing” findable, or provide optional scene texture without XP. Advice records speaker and confidence; corroboration updates the claim rather than replacing historical evidence. An NPC's later reply can disagree with the inference without retroactively deleting the journal.

**Interruption/state/gate/contrast.** Interrupted journal writes no finished entry; declining to reflect carries no invented maintenance penalty. Knowledge owns attributed evidence; proposed character journal owns chosen notes; life_record remains a lossy projection, never truth authority. Gate: distinguish evidence/inference/player annotation in one native view and save, demonstrate no hidden-motive disclosure. Village `working_habits`/interruption offers actual evidence; Proto23 learningRoute supports attribution; GH-C1 can remember a copy's source without gaining the original's unseen subsequent events.

### X06-B rehearsal versus external discovery

**Owner/status/new detail.** I36, G3-010, G8-011/G8-012; MM09. Proposal rehearses a known invitation or tool procedure, affecting preparedness only for its supported local consumer. It cannot determine an absent partner's reply or inspect an unseen object.

**Actors/means/discovery/verbs.** Player rehearses speech, plans questions, compares known outcomes or seeks advice; NPC independently rehearses their own plan. Actual instruction/notes/memory are inputs; neither can use private facts they lack. Powerful simulation/prediction means may genuinely add information if its selected rule supplies that, but ordinary pondering does not silently inherit it.

**Order/effect/channel/continuation.** Rehearse after known method or intention; optional scene lets choose a concise question, then ask through real contact. Reply remains authored from recipient state. A physical rehearsal can fill a declared practice field only where a real consumer uses it, following Watchcraft's inspected separation. The player can skip rehearsal and directly act where allowed.

**Interruption/state/gate/contrast.** No completed practice on interrupted work beyond its declared progress; changed circumstances can invalidate a plan without erasing the reflection. Career practice/native learning owner stores actual rehearsal; social intent remains proposal until delivered; knowledge changes only on real evidence. Gate: prove rehearsal creates no NPC knowledge and no learned method before instruction. Village Watchcraft practice is inspected; Proto23 handling practice is distinct from read/instruction; GH-R1 planning a mobile journey remains non-executable until it acquires actual mobility/delegation means.

## X07 Action grammar and targets

### X07-A typed repair target and reachable channel

**Owner/status/new detail.** G5-05/G5-08, G3-011, G6-003/G6-012; MM03/MM07. Proposal specifies “repair this owned instrument by this method” rather than an unqualified repair button. Broken blade, injured body and corrupted memory are different targets and consumers, even if a powerful method truly repairs all three through distinct adapters.

**Actors/means/discovery/verbs.** Player/NPC each inspect, offer repair, request custody, repair or refuse using their own tools/body/range. Discovery exposes only observed defect and known alternatives. Correct verb with an unreachable object reports unreachable target; held ordinary tool with wrong target reports unsupported method, not impossible world law. Remote power can bypass reach if its actual scope includes the object.

**Order/effect/channel/continuation.** Preview names actor, target instance, operation and anticipated effect; resolve permission separately from physical capability; commit stages native target change and actual supplies. Recipient's use tests repaired function. Failed publication yields no success memory or partial stock. An unauthorized but physically possible route needs its actual taking/repair consequence, not a false capability block.

**Interruption/state/gate/contrast.** Target moved, custody revoked or tool lost requires revalidation at completion; another route remains available if held. Object/body/memory owners stay typed and separate; jobs record target identity and method. Gate: wire one existing native object consumer plus wrong-target/moved-target counterexamples, later adapters named exactly. Proto23 currently uses concrete item keys/commands rather than arbitrary repair intent; GH-R1 needs a declared remote manipulation/body target interface before ordinary hand-tool commands can target it.

### X07-B interpreted intent with honest unsupported result

**Owner/status/new detail.** G5-05/G5-08, I36; revision-2 X07 plus north-star parser idea. Proposal accepts “fix our home before the festival” as intent, then shows which concrete supported operations it can interpret. No arbitrary-text engine is established by the current inspected sources.

**Actors/means/discovery/verbs.** Player states intent; local interpreter resolves known home fixture/repair actions only from actual held means and known targets. NPC receives only an actually sent request or delegated operation, not hidden text. Player can clarify, select target/method, cancel, or leave text as a note. An NPC can likewise ask for work with named scope.

**Order/effect/channel/continuation.** Parse to an explicit proposed operation before commit; preview target, recipient, scope and concrete effect. “Repair known shelf” may map to selected native repair command once authored; “rewrite everyone's memories” must report missing supported effect/target adapter if none exists. Unsupported text changes no state and makes no fictional impossibility claim. Successful execution returns actual receipt and a known consequence; a note remains a note.

**Interruption/state/gate/contrast.** Cancelling interpretation creates no job; stale resolved target revalidates before commit. No new intent-state owner needed unless drafts persist; actual operations use existing preview/commit publishers. Gate: finite resolver for one known command, ambiguous target clarification, unsupported input and a genuinely powerful supported operation with its real effect. Village/Proto23 command definitions are suitable supported vocabulary; extraordinary input still requires an adapter, even when the fictional power is unlimited. No broad language model authority over the save is proposed.

## X08 Means and capabilities

### X08-A custody and held-use loss

**Owner/status/new detail.** G3-009/G3-011/G3-012, G6-012/G8-017; MM01/MM07. Proposal links losing a borrowed tool to only the dependent route, without erasing learned technique or forbidding alternative means. Village career's lantern/baton loan is inspected job custody, not ordinary equipped inventory.

**Actors/means/discovery/verbs.** Player or NPC borrows, uses, returns, requests renewal, substitutes a held tool or declines. Owner can authorize limited use without transferring ownership; borrower knows terms through the actual agreement. NPC who learns the method but lacks tools is willing yet not currently executable. Extraordinary self-supplied light/precision can replace equipment only if the particular patrol/output consumer supports it, not by relabeling career custody.

**Order/effects/channel/continuation.** Record custody, start dependent task, then recheck held-use support according to its selected completion rule. Return stops future loan-dependent starts but preserves knowledge and past completed shifts. A substitute route has its own working effect and consent/ownership scope. Owner receives a return report from actual transaction, not clairvoyant detection across worlds.

**Interruption/state/gate/contrast.** Tool lost during work may interrupt the exact task; no automatic loss of every skill or relationship. Custody owner remains career for its existing kit, native inventory for actual tools; practice/knowledge stay their owners. Gate: avoid inserting career kit into equipment; select one support-loss consumer and prove knowledge retained plus functional alternative. Proto23 sharp-to-dull knife/home kit gives concrete support transition; GH-R1 nonhand handling needs an actual manipulator, and a valid extraordinary replacement should work without a fabricated fee.

### X08-B perception range and reciprocal knowledge

**Owner/status/new detail.** G4-01, G5-05, G2-007/G2-028; PROJECT/MEANS_AND_APPRAISAL actor-held principle; MM07/MM08. Proposal distinguishes seeing a repair from knowing its maker, means or motive. A craftsman across the Village can observe a repaired object only when within declared ordinary sight/contact; player cannot read the craftsman's private assessment by looking at them.

**Actors/means/discovery/verbs.** Both player and NPC inspect, listen, ask witnesses or use held appraisal tools. Range, occlusion, precision and evidence basis are local. Witness can misremember; received rumor records source/uncertainty. A genuinely global sensing faculty works globally if authored that way; no balancing range cap is invented.

**Order/effects/channel/continuation.** Actual event occurs, detectable signal exists, observer applies their held means, then their own knowledge record changes. NPC can adjust an offer after detecting better work; player learns that offer on contact, not immediately from private state. New tools expand detectable detail and may revise earlier impressions. Taking a tool away ends future perception, not already known evidence unless an explicit memory rule says so.

**Interruption/state/gate/contrast.** Missing witness/reach leaves event unknown; failed appraisal creates no authoritative truth. Actor knowledge/basis owner, local sensor rule and public projection remain separate; no write to all actors on every event. Gate: ordinary two-observer fixture where only one receives a signal, then powerful sensor variant and save replay without leaks. Proto23 `knowledge` basis/recipient review is an inspected received-evidence seam; GH-R1 distributed sensing is an original exact sensor-adapter dependency, not an established secret truth.

## X09 Cooperation, opposition and delegation

### X09-A supplied delegation and report

**Owner/status/new detail.** G3-021/G3-009/G3-010, G6-012; MM01/MM08/MM09. Proposal delegates one supply pickup to a willing named adult helper. Request, agreement, custody, executable travel and received report are distinct. Iona's inspected solo patrol is a narrow implementation comparison, not generic NPC offscreen labor.

**Actors/means/discovery/verbs.** Player requests pickup with destination/item/return terms; helper accepts, changes terms or refuses using their actual route access, purse/custody and carrying means. Helper needs only supplied information; player learns progress by seeing them or receiving a report. Alternative helper/direct pickup remains available when actually supported.

**Order/effects/channel/continuation.** Confirm scope, reserve actual entrusted stock/funds, start supported helper job, perform destination transaction, then deliver item/report through actual return/contact. Destination stock and purse update once. Report can state unavailable stock without pretending completion; successfully returned supply feeds a named player workshop task. A capable helper may volunteer for free; neither fee nor favor is globally mandatory.

**Interruption/state/gate/contrast.** Route closes, helper loses means or recipient leaves: replan, return entrusted goods or retain agreed custody according to the local rule. Cancellation cannot erase already received request or completed purchase. Jobs/participants, custody/native owners and attributed reports need selected saved owners; no automatic offscreen world's progression assumed. Gate: one helper/route/transaction under a declared clock with refusal, failed stock, cancel-after-purchase and reload. Proto23 actors have concrete stock/attention but no general travel-delegation adapter; GH-R1 can commission mobile hands, or directly act if it obtains truly sufficient manipulation means.

### X09-B opponent plan interrupted by missing trace

**Owner/status/new detail.** G3-021, G4-01/G4-05/G4-08; MM08 plus actor-held means. Original rival courier seeks the same commission and tries to find the player through a witnessed route. Rival's intent is private unless the player has evidence; the player's action changes observable traces, not the rival's knowledge retroactively.

**Actors/means/discovery/verbs.** Rival can ask a witness, inspect a footprint or use a held tracker; player can conceal a trace, change route, confront if they know, or do unrelated work. Witness reports only what they saw/heard. Rival may be capable yet lack location, or know location but choose not to pursue. Powerful declared tracking can defeat ordinary concealment without giving all NPCs that ability.

**Order/effects/channel/continuation.** Rival forms goal from received commission news, acquires usable trace, then initiates a supported local pursuit/contact. Removing a still-unread trace prevents that acquisition; removing it after reading does not erase remembered location. Rival rechecks current reach before interception; player learns pursuit only via encounter, report or fitting observation. Later competing bid requires actual received offer and commissioner response, not global reputation reaction.

**Interruption/state/gate/contrast.** Missing trace pauses/replans that route rather than inventing instant replacement knowledge; departed player can still be found by an actually held superior sensor. Plan/job owner, trace lifetime/local object owner and actor knowledge remain distinct; public UI cannot reveal intent directly. Gate: exact witness/trace/pursuit adapter and actor-safe view; test trace removed before/after observation, unwilling witness and genuine tracking bypass. Village ordinary witnesses give a grounded design fixture; Proto23 narrow authored actors provide no canon rival/courier lore; GH-R1 rooted presence may remove location uncertainty while hiding its goals, showing that location and intent are separate.

## Evidence gaps and bounded next uses

| ID | Exact unresolved dependency | Existing owner/future gate |
|---|---|---|
| LD-D1 | Adult original relationship participant, invitation agreement/receipt and appointment revision not implemented by inspected social axes alone | Local life/relationship packet; no universal affection meter or relationship reset |
| LD-D2 | Object instance/provenance and permission/custody semantics for one personal gift/repair | MM-P1/MM-P2 with native inventory/target publisher; retained downstream trial |
| LD-D3 | Body/identity carrier plus communicating changed form and copied actor obligations | MM-P3/body owner; no source canon, hidden criteria or automatic promise cloning |
| LD-D4 | Controlled experiment receipt and independent recipient-use evidence, chosen exact native consumer | MM-D09 and research/learning packet; separate from notebook acquisition |
| LD-D5 | Finite intent interpreter and actual nonhand/remote typed effect adapters | Tooling/extraordinary packet; unsupported input remains nonexecuting with honest reason |
| LD-D6 | General supplied delegation, witness/trace and plan revalidation over a selected local clock | MM-P4 plus social/means owner; existing Iona solo behavior is narrower |

Read-back checks to run by root: eighteen unique headings match frozen leaves; relative links resolve; all cards retain original IDs, explicit means on both sides, effects/response/continuation/refusal, durable owner and next gate; no private source text or sealed truths. This draft does not reserve runtime files or supersede existing dispatch ownership.
