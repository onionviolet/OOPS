# Play beyond menu selectors

2026-10-14. Response to Weibao: “do we need to consider expanding how YAIR is played beyond the menu selectors? more to consider?”

Design proposal only. This question authorizes consideration, not a runtime rewrite or a change to accepted priorities. No gameplay or browser verification is claimed.

## Grounding and recommendation

Yes. Expand the player's decisions and ways of acting, while retaining efficient menu access. More input gestures alone do not create more agency. A map that selects the same destination is a navigation improvement; routes with different exposure, time and encounter possibilities introduce a gameplay decision.

Live direction: [vision and accepted decisions](../PROJECT.md#vision), [desktop/laptop priority](USER_VISION.md#standing-ui-priority-2026-10-13), [food and idle progression direction](../PROJECT.md#standing-priorities-and-document-authority), and [UI design owner](THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md). Existing center-menu play remains a compatibility baseline. This proposal does not make Frontier a prerequisite opening or expand the one-realm/one-prestige milestone.

Source inspection: `src/display.js` retains selected recipe and receipt state; `src/crafting_visibility.js` derives material/station/reservation availability. The UI owner already proposes ritual diagrams, assembly steps and negotiation details. These support an incremental approach; they do not establish that any interaction proposed below is implemented. No exhaustive interface inventory or live playtest was performed.

## Proposed interaction families

| Code | Family | What the player does | What would make it gameplay |
| --- | --- | --- | --- |
| O1 | Places and routes | Inspect known places, choose a path and interact with people or objects in context | Route, preparation, access and timing affect real costs and reachable opportunities; a decorative map alone does not qualify |
| O2 | Workspaces | Arrange available components, connect a process, prepare equipment or allocate a station | The arrangement changes a supported result, resource flow or failure condition; no arbitrary slot puzzle for every recipe |
| O3 | Tactical plans | Set stance, target priorities, retreat conditions or available positioning | Plans trade survival, speed and resource use through actual combat rules; no positioning display unless the simulation resolves position |
| O4 | Social commitments | Offer specific goods, time, help or terms to a person | The other person may refuse or counter; agreement creates remembered obligations and consequences, rather than a renamed dialogue choice |
| O5 | Routines and delegation | Specify a supported activity, stop condition and available fallback | The routine saves repeated input while consuming actual time, tools and stock; another actor's contribution stays distinct from player mastery |

These are options, not five required systems. Distinct worlds can emphasize different families while keeping common navigation and action feedback stable. World-local rules decide which interactions exist.

## Account for now

**D1: Separate interface from capability.** A graph, diagram or object interaction should invoke the same authoritative action and eligibility checks as its menu equivalent. Neither surface may bypass costs, custody, knowledge, access or time. If a new mechanic is needed, identify it separately from the presentation work.

**D2: Preserve an idle role.** Prepare, observe, intervene and automate form a useful proposed rhythm. Active attention can enable deliberate choices or experiments without turning sustained progression into repeated mandatory input. Exact rewards and whether an activity needs supervision remain world-specific proposals. Do not silently invent offline execution for a system that currently advances only on played time.

**D3: Let discovery change affordances.** Learning can reveal a valid use for a known object, a new preparation or an actionable connection. Only reveal what the character can perceive or infer. Hidden nodes, silhouettes, connection lines and “unavailable” counts must not enumerate sealed content. Invalid experiments should give proportionate, understandable feedback rather than require blind combinations.

**D4: Make depth reduce routine work over time.** A method can move from initial understanding and practice toward repeatable execution where supported. An alternate physical input must have keyboard/click access; dragging, precision or reflexes should be a deliberate mechanic if used, not the price of accessing an ordinary action. Automation remains subject to means, interruptions and resource limits.

**D5: Keep consequences legible and durable.** Distinguish preview, commitment, running work, interruption and settlement. Switching surfaces or cancelling cannot duplicate results or refund consumed inputs. Proposed new plans, arrangements and obligations need explicit saved-versus-transient decisions and compatibility handling. Information surfaces should explain observed consequences without disclosing hidden truth.

## Recommended first experiment, later

Use one existing supported work or crafting activity as an optional focused workspace in its current panel. At 1366×768, show the relevant owned inputs, actual station, available decisions, cost/time and result feedback together. The concrete visible outcome is that the player can prepare and understand one activity without navigating unrelated selectors.

First determine whether existing material/equipment choices already change an actual outcome. If so, expose that decision through the workspace. If not, a bounded new preparation mechanic needs its own scope; moving icons around would test navigation only. Preserve menu access to equivalent actions. Defer a free-roaming world, universal spatial simulation, mandatory minigames and mobile optimization.

Compare two legitimate approaches with different consequences. Check whether the player can explain the difference, choose deliberately, see the outcome and repeat routine work without extra friction. Rebuild and exercise both surfaces from a fresh origin at the laptop viewport; verify save/reload/import if persistent behavior changes. Human review decides whether the interaction feels better. No such prototype or checks were run in this consideration pass.

The selection remains open. This proposal adds no new completion gate to active implementation work.

## Implementation and external comparison follow-up

Weibao asked how this would enter the UI and whether external implementations should inform it. This section adds source-grounded implementation considerations and a bounded primary-source comparison. All recommendations remain proposals. External evidence is documentation, not hands-on play or an inspection of proprietary game internals.

### F1: Existing integration points

| Existing owner | Inspected behavior | Proposed use and limit |
| --- | --- | --- |
| `src/panel_kit.js`, `src/workspace_layout.js` | Panel registration, discovery/eligibility, settings and layout ownership | Register a genuinely independent surface here; extend the current crafting region for a crafting experiment rather than adding another panel by default |
| `src/crafting_detail.js`, `src/crafting_visibility.js`, `src/display.js` | Presentation model and command callbacks are separate; availability derives from real materials, station and reservations | A workspace can present those same facts differently. New selectable inputs require checking whether the craft command actually accepts and respects them |
| `src/structured_pack_ui.js` | UI consumes an observer-safe host projection and sends commands; tracks jobs and session repetition | Reuse this boundary as a pattern, not as a universal adapter for every native system. Its repeat plan is session-local and explicitly ends when the page closes |
| `src/native_craft_transaction.js`, `src/main.js` | Native transactions can restore captured owners before durability; durable marking prevents rollback after storage commits | Keep each activity's existing publication/transaction path. A new visual input must not write inventory or rewards itself |

### D6: Proposed end-to-end flow

Use the selected activity's existing host rather than inventing a universal interaction engine:

1. Read the current observer-safe state: known participants/objects, eligible actions, supported inputs, costs, time and blockers.
2. Select a target and edit a local draft. Highlighting a route or placing an ingredient is preparation unless explicitly designed otherwise. Preview must not spend resources, advance RNG, grant knowledge or reserve stock accidentally.
3. Submit the intended action through the existing host. Recheck the exact item/target, stock, location, means and current work at commitment. Reuse existing sequence checks where supported; do not assume all native commands share one protocol.
4. Publish through the activity's existing durable path, then render the observed receipt and work state. A storage failure must not look like a completed action. A rendering failure after successful storage must not refund the action.
5. Retain focus and selection across ordinary updates. If a target disappears or becomes ineligible while selected or dragged, cancel or reject clearly instead of applying the input to a different target.

This ordering matters because game time and other work can change availability while a player is deciding. Preview is a quote under current conditions, not a guarantee. Any reservation mechanism would need explicit ownership, release and save semantics.

### D7: Concrete laptop composition and rendering choice

For the first crafting/preparation trial at 1366×768: keep relevant inventory and station status beside a central work area, with the selected operation's costs, supported alternatives and commit control adjacent. Show current work and the last outcome without covering the work area. Preserve useful independent character/log panels, comfortable text and intentional scrolling; do not force the whole game onto one screen or replace it with a full-screen modal.

Prefer ordinary HTML/CSS controls for ingredients, slots, people, offers and queues. Add SVG when actual route connections or a meaningful diagram need it. Canvas/WebGL is a later option for demonstrated entity counts or animation needs, not a prerequisite for direct interaction. No new UI framework, graph library or dependency is recommended by this pass; choose one only after a prototype exposes a concrete missing capability and its lifecycle/accessibility cost.

Keep local selection and uncommitted gestures transient by default. Panel positions remain display preferences. Committed jobs, mechanical arrangements, agreements and durable routines belong in gameplay state where introduced. A supposedly permanent routine cannot be implemented only as a renderer timer. Define load, import, missing-content and interruption behavior before promising that continuity. No new offline simulation follows automatically.

### O6–O10: External mechanisms worth studying

| Code and disposition | Verified external mechanism | YAIR application, inferred | Cost or boundary |
| --- | --- | --- | --- |
| O6, adapt | [Factorio remote view](https://www.factorio.com/blog/post/fff-380) integrates navigation and interaction after a separate preview created extra steps and misleading clickable expectations | Let selecting a place/person/station expose actionable context in the same surface, with a stable way back | Remote observation does not grant YAIR remote physical access, knowledge or inventory transfer |
| O7, trial later | [Factorio parametrised blueprints](https://www.factorio.com/blog/post/fff-392) reuse a configurable plan instead of recreating one for every item | A known preparation or routine could be saved as a template with explicit substitutions | A template is intent, not free tools, completed work or guaranteed feasibility; validate every execution |
| O8, trial selectively | [Opus Magnum](https://www.zachtronics.com/opus-magnum/) lets players assemble machines with competing simplicity, speed and compactness goals | A particular magical or technical craft could make composition itself the decision | Requires actual process rules and a readable execution trace. It is a larger mechanic addition, not a renderer feature or a model for every recipe |
| O9, adapt pattern | [ink runtime documentation](https://github.com/inkle/ink/blob/master/Documentation/RunningYourInk.md) separates story continuation/choice selection from host presentation and exposes story save/load | Contextual dialogue can live beside a selected person while the game owns costs and consequences | No ink dependency selected. Adding a narrative runtime would introduce another state owner needing coordinated saves and content-version handling |
| O10, account for now | [W3C dragging guidance](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html) distinguishes a non-drag pointer alternative from keyboard support | Offer click object, then click destination, alongside keyboard operation and optional dragging | Keyboard parity alone does not supply the click-only alternative; this applies to laptop interactions without starting mobile redesign |

These are paraphrased public design/documentation findings, not copied source, source-qualified complete game research or claims of YAIR implementation. No installations, purchases or decompilation were needed. If deeper source acquisition is selected later, reuse existing research owners and retain detailed IDs/flows privately under the standing research rule.

### A1: Bounded next implementation decision

Start with one supported activity and answer which real choice the workspace improves. Compare its existing selector route with the proposed in-panel surface, using actual supported material/preparation alternatives. If none exists, separate a presentation-only navigation trial from a proposed mechanic addition. Do not make up two mechanically different outcomes to justify a visual treatment.

The useful technical checks are equivalent outcomes and eligibility through both surfaces; stale selections and rapid repeated submission; blocked or failed saving; cancellation and interruptions; focus stability during clock updates; observer-safe discovery; and save/reload/import where persistent state changes. Confirm the named routine controls remain visible/reachable at the laptop viewport after rebuilding on a fresh origin. Test only the slice's relevant boundaries. Human review judges whether decisions are clearer and repeated work is less cumbersome.

Evidence for this follow-up: bounded local source inspection and the linked primary documents. No prototype, library trial, runtime change, rebuild, browser test or gameplay acceptance was performed. Shared live owners and unrelated dirty edits were preserved.


## OD25 experiments, failure and discovery, 2026-10-15

[Accepted answer](USER_VISION.md#overarching-direction-discussion-od25-2026-10-15):
clear known actions plus experiments/research for new uses through means;
failed experiments can teach, cheats can help discover combinations. Modular/
procedural possibilities do not select a specific implementation or new UI.

### ACCOUNT FOR NOW: proposed discovery implications

- **EX1, useful failed results:** a failure might reveal insufficient control,
  incompatible conditions, a threshold, partial effect or a wrong hypothesis.
  Perception and instrument/cheat quality decide what can actually be inferred.
  Sometimes a result is inconclusive; don't grant an exact hidden explanation
  or full mastery just because the attempt failed.
- **EX2, evidence versus practice:** recording an observation, learning a method,
  improving skill, gaining XP and creating a useful object are different outputs.
  Repeated work can legitimately train a skill where supported, while identical
  inconclusive evidence need not create a new discovery every time. No universal
  failure-XP rule or prohibition on intentionally repeatable training selected.
- **EX3, informative trials:** changing a material, target, order, intensity or
  condition can test an actual hypothesis. Earlier notes and controlled comparison
  can make experiments legible rather than blind combination guessing. False
  beliefs, misleading instruments or illusions still follow OD8/OD13; the player
  need not automatically know the correct cause.
- **EX4, assistive cheats:** sensing compatibility, proposing combinations, running
  simulations, recalling analogous cases or revealing causal relations are
  different powers. A suggestion needn't grant access/control/resources; a stronger
  cheat can supply those too. Reliability, scope and what is learned stay local.
- **EX5, usable learning:** an actual discovery should inform a next action,
  procedure, preparation, capability or better question. Failed attempts may have
  actual costs/side effects; known risks are disclosed through available means.
  Success doesn't itself guarantee safe repeatability under changed conditions.

**Guidance accepted later 2026-10-15:** before committing, show known
costs, plausible known risks and what the trial could investigate. Distinguish
unknown outcomes from guaranteed ones. Afterward, report observable results and
supported inferences, with deeper hints or cheat-assisted analysis available
through selected modes/means. Do not enumerate sealed recipes or claim unsupported
safe probes, exact odds or a freeform all-world experimentation engine.

Representations and input surfaces remain with existing UI owners; no code/style,
source library, world secret truth or implementation assignment changed here.


### Prediction answer and confidence, 2026-10-15

[Accepted answer](USER_VISION.md#experiment-predictions-and-consolidating-remaining-details-2026-10-15):
known costs/risks, uncertain outcomes according to knowledge/means, expertise and
cheat-assisted prediction improvements. The earlier broad guidance default is
answered. Exact presentation and calculation remain open.

**Derived implications/proposals:** improve a forecast's relevant scope, precision,
confidence or identified alternatives rather than mechanically add a global percent
bonus. A forecast can be confident but wrong through bad evidence, deceptive means
or changed conditions; a genuinely stronger power may predict exactly within its
actual scope. Distinguish observed result, supported inference and simulated or
reported prediction. Do not leak sealed truth by reading hidden engine facts into
an ordinary player's preview. Forecasting a method does not itself perform it,
prove its theory or grant the resources/capability required. No probability system,
perfect oracle, new interface, source/build/save change or runtime proof selected.

## Research detail reconciliation, 2026-10-15

[CA8–CA11 research/prototype answers](TECHNOLOGY_AND_PROGRESSION.md#research-and-prototype-answers-reconciled-2026-10-15)
and [CA12 repeatability](TIMELINES_AND_DIVERGENCE.md#repeatability-answer-and-research-across-rewinds-2026-10-15)
now supplement OD25 and its accepted knowledge-limited guidance. Do not ask again
whether supported imperfect prototypes can be used or whether alternatives should
preserve the original goal. Exact procedure, input surface and reward rules remain
implementation choices or playtested tuning, not a selected universal resolver.

**Proposed finite authoring detail:** attach objective, exact constraints,
procedure/revision/conditions, observed result, supported inference and useful
next action to an existing trial. Differentiate inconclusive measurement from a
failed idea; allow relevant observations during actual use. Keep generated
hypotheses distinct from implemented effects and forecasts distinct from outcomes.
The [review](gm/DIRECTION_DETAILS_REVIEW_2026-10-15.md) proposes reuse of supported
effects for a finite interaction family. It does not dispatch one or require
freeform generation, guaranteed failure rewards or every research outcome type.


## Small design freedoms: making possibilities compose, 2026-10-16

Weibao: "Small design level stuff and more to allow the idea of making
everything possible?" This follows the modular engine discussion, but concerns
play design rather than a larger registry. Proposals, not implemented mechanics.
Authority: Rulebook 1–6, AD5–AD9, AD22, AD27–AD33; MR1, MR5–MR12, MR16,
MR21 and MR29 for making. UI proposals follow UR disclosure/navigation rules
and AD34. [Means and appraisal](MEANS_AND_APPRAISAL.md) owns means;
[making rules](MAKING_RULES.md) own experimentation; this section owns the
interaction examples. No new standing rule or rewrite is proposed.

### ACT NOW: clarify the design target

**PF1, done in this proposal.** Treat "everything is possible, reasonably" as
room for causes to combine and circumstances to change. A fixed action menu
must not become a fictional law. This is broader than adding more buttons:
let the same supported object, technique or condition participate in several
situations, then show what the character can actually discover. Implemented
coverage stays finite and honestly labelled. An unimplemented interaction is
an implementation gap, not proof the world forbids it.

### ACCOUNT FOR NOW: little choices with large consequences

These are a palette. Each row gives a modest starting point, a world-dependent
dial and the reason it matters. Use the rows touched by the selected activity,
not every row as a prerequisite. Examples below are original hypotheticals,
not franchise-canon claims.

| Code | Small design freedom | Default, dial and reason | Example consequence |
| --- | --- | --- | --- |
| PF2 | **Objects have useful qualities beyond their category.** | Start with properties a real consumer reads; add scale, condition, shape or supernatural traits when an interaction needs them. A tag summarizes behavior, not permission to invent any matching outcome. | A heavy iron pot can contain liquid, collect rain or hold down a cloth. Its weight and open mouth matter; a sealed vial behaves differently. |
| PF3 | **Separate intent from method.** | Offer a concrete goal with available methods where useful. World law and actual means decide whether each method can achieve it. Some special locks may demand an exact key or oath. | Open a stuck hatch by leverage, softening a swollen frame, removing hinges or a supported spell. Several methods can exist without flattening their noise, time or damage. |
| PF4 | **Address a part or condition of the target.** | Use a few meaningful parts or states, not full physical simulation. Increase detail for activities where it creates decisions. | Dry a book before reading it; loosen a handle instead of breaking a whole door; coat a blade's edge rather than treat its sheath. |
| PF5 | **Preparation and environment are usable inputs.** | Temperature, light, moisture, support and timing matter where the local process reads them. Add no mandatory preparation ritual where it has no effect. | Warm a stiff mixture, brace a tool or work by daylight. Rain may supply water while making exposed ink work harder. |
| PF6 | **Substitution is about function and local law.** | Permit a substitute when it supplies the required role; preserve exact identities when a world makes those significant. Quality and side effects follow the actual substitute, without a compulsory surcharge. | A clean bowl replaces a cup for mixing, but a rite that binds a named heirloom still needs that heirloom or a real means to alter the rite. |
| PF7 | **Amount, concentration and scale can change a use.** | Distinguish quantities only where a consumer makes them matter. Let the activity decide whether splitting, dilution, combining or scaling is useful, with declared conservation or explicit creation means. | A drop stains a page, a coating treats an edge, and a full basin washes a garment. Dilution may spread an effect while weakening it. |
| PF8 | **Effects can matter outside their advertised purpose.** | Expose selected physical or magical consequences to neighboring systems. Extend the chain when there is a useful consumer, rather than attaching every tag to every system. | A cooling charm preserves food or eases a fever when those processes support cooling; it need not become a universal healing spell. |
| PF9 | **Knowledge guides a use without creating the underlying property.** | Ordinary handling stays available through ordinary means; special procedures can require real knowledge, control or apparatus. Unknown results remain uncertain rather than inert. | An unidentified adhesive still sticks. Experimenting may reveal it, waste some or create a residue the character can later investigate. |
| PF10 | **Progress can be partial and failures can leave usable things.** | Retain meaningful work and actual byproducts where the process supports them. Irreversible destruction, full recovery or no useful lesson are also possible locally. | A failed forging leaves a bent fitting, salvage or a diagnostic fracture; an interrupted translation retains the understood passage. No guaranteed failure XP or refund. |
| PF11 | **An obstacle has more than one kind of boundary.** | Keep physical feasibility, present readiness, knowledge, social permission and implementation coverage distinct. Institutions may object without making an act physically impossible. | A locked archive can be inaccessible, forbidden, unlocated or simply not implemented, for different reasons. A forged pass affects the guard's belief, not the door's metal. |
| PF12 | **Means can be combined, borrowed or supplied as a service.** | Combine actual contributions with their scope and custody; extend cooperation when its domain is selected. A machine, hired service or existing simple actor route can supply a missing step without a new NPC simulation. | You know the design but rent the kiln. A tool guides your hand without granting permanent mastery. If a service refuses, another supported route may remain. |
| PF13 | **Changes can create opportunities as well as costs.** | Preserve meaningful aftermath with an actual reader. Ordinary use need not attract automatic suspicion, punishment or a balancing counter. | Broken masonry supplies rubble; a drained basin exposes a mark; a successful demonstration creates a saleable sample. Whether anyone notices depends on their means. |
| PF14 | **Discovered combinations become reusable methods.** | Save the successful procedure and its demonstrated conditions; a shortcut rechecks tools, supply and scope. Changeable substitutions stay visible where useful. | A discovered way to dry herbs becomes a routine, not an invented new skill tree or a guaranteed recipe for every herb and climate. |
| PF15 | **Local impossibility need not close the wider journey.** | A world's law can be absolute within its scope. Other bodies, tools, worlds or rule-changing cheats can offer routes when their actual means support them. Do not invent a secret workaround merely to satisfy a menu. | A hand cannot touch a spirit; a compatible vessel or technique may let the player interact. Finding such a means is a possible pursuit, not an automatically revealed checklist. |
| PF16 | **Control matters separately from access and raw power.** | Support precision, target area, duration, intensity or release timing where they change a result. Fine control may depend on skill or apparatus, and an effortless cheat may supply it. | The same heating faculty warms a cup, seals wax or ruins a page. A stronger flame is not automatically better for every job. |
| PF17 | **Timing and order can create a method.** | Retain meaningful process order and interruption points; collapse irrelevant steps for convenience. Let the world define reversible and irreversible stages. | Add a volatile ingredient after cooling, hold a seal while resin sets, or stop before a reaction consumes the remaining sample. Routine playback preserves that order. |
| PF18 | **Small durable traces create later readers.** | Store selected residues, marks, wear or repairs only when they support discovery, reuse or consequence. Detail without a reader may remain narration. | A scorch pattern suggests uneven heating; a patched container leaks less; a discarded treated cloth later serves as a useful sample. Observation reveals only what its means justify. |

### How this should feel in play

**PF19.** A known object presents ordinary uses and a compact route to try
supported alternatives. Choosing a target, a method and an available means can
produce a quote with known time, material use and uncertainty. The character
need not know the full explanation before trying. Show observations after the
attempt, then let the player record, adapt or repeat a demonstrated method.

A natural-language idea box could help select supported actions later, but its
wording cannot mint powers or secretly change world law. For an unsupported
idea, distinguish "not implemented" from the character's in-world uncertainty.
Do not turn developer coverage labels into lore or enumerate hidden solutions.
The same interaction should have a straightforward click/keyboard route.
If prototyped, target a populated 1366×768 desktop view with preserved log,
clear Back/Esc and observer-safe inspection. This pass creates no UI mockup.

**PF20, worked miniature.** Consider an already-selected making slice with a
pot, cloth, heat source and wet herbs. Proposed uses might include steeping,
straining and drying. A cloth can act as a filter because the selected process
reads permeability; it can hold wrapped herbs if that process supports wrapping.
Warming changes drying time; excess heat may char a sample. A failed attempt
can leave an observed residue and a recorded temperature clue. The useful
outcome can then feed the existing item-use or trade consumer. These possibilities
share a few causes instead of a hand-authored recipe for each pair of objects.
They do not imply that every item pair must interact or that the current runtime
already supports any of these steps.

### LATER / DELEGATE: bounded next proposals, no dispatch

| Code | Proposed slice | Level / effort / done check |
| --- | --- | --- |
| PF21 | Apply a few relevant rows to the currently selected crafting consumer after its stopped integration gate is recovered. | Balanced design and implementation, strong persistence review / medium. Two materially different preparations and one unusual reuse reach existing useful consumers; failure retains the declared outputs. Rebuilt browser and save/reload/import verify the changed behavior. Do not require all PF rows or add a world to justify the slice. |
| PF22 | Add a narrow interaction coverage table beside that slice's existing task record. | Balanced / small. Record intent, actual means, observed outcome, downstream reader and implemented gap. Include an unknown-property case and a target mismatch. No repository-wide catalog or mandatory interaction matrix. |
| PF23 | Broaden from making to one already-selected obstacle or ability use when its owner is ready. | Balanced design, strong review if world law changes / medium. Reuse a real property or effect in a second context with different conditions, preserve both original consumers and disclose only what is known. NPC-heavy work and procedural layouts retain their deferrals. |

### Verification and limits

Design-only extension based on the accepted rulebook, means/appraisal and making
rules plus this owner's existing experiment/discovery proposals. No new source
research, runtime edit, browser claim, worker, build, commit or accepted product
decision. Checked relative file links, new code uniqueness and preservation of
pre-existing owner text. The examples describe proposed behavior, not evidence
that arbitrary combinations already resolve in the game.


## Round 3: abilities, exploration and everyday possibilities, 2026-10-16

Weibao: "More to consider? Expand beyond crafting to abilities, exploration and
everyday actions too, with small details and interactions that make more things
possible. Save accordingly? Consider what is required from the engine?"
He then anchored the expansion in the [modularity assessment](reviews/MODULARITY_AND_REWRITE_ASSESSMENT_2026-10-16.md).
Continues this document's PF1–PF23. PF codes here are local to this interaction
palette; older unrelated PF codes in ENGINE_EXPANSION retain their own meaning.

Proposals only. Relevant authority: Rulebook 1–6, AR3–AR12, AD5–AD9,
AD13–AD22, AD27–AD36, SR1–SR24 and applicable making rules. Existing
[ability authoring](worlds/ABILITY_AUTHORING.md), [means](MEANS_AND_APPRAISAL.md)
and [everyday skill/body proposals](LIFE_SIM_NORTH_STAR.md#skills-constitutions-and-everyday-interactions-codex-proposals-2026-10-10)
retain their domain detail. [Engine EI1–EI12](ENGINE_EXPANSION.md#possibility-support-across-domains-2026-10-16)
maps these examples to inspected seams and missing support. Saving this round
does not select implementation, alter world canon or make all examples required.

### ACT NOW: design clarification completed

**PF24.** Use the same supported cause across different pursuits when its scope
allows it, without requiring every ability to reduce to physical properties.
Heat, sound and force can affect several ordinary processes; an oath, name,
permission or conceptual technique may operate through exact local relations.
An ability's label, a matched tag or the player's intent is insufficient proof
of an outcome. Its actual mechanism decides. A powerful exception may bypass a
normal requirement without acquiring a contrived weakness or extra fee.

### ACCOUNT FOR NOW: ability details

| Code | Small detail | Modest default, useful dial and consequence |
| --- | --- | --- |
| PF25 | Delivery differs from result | Model touch, a beam, a carried object, a mark or a supported remote link where relevant. Heating through a sealed wall and heating the wall itself are different methods. Distance, path and jurisdiction need not mean the same thing. |
| PF26 | Precision and shape are applications | Give an acquired method a few supported modes before inventing another power. A narrow current moves dust from a hinge; a broad gust dries laundry; sufficient lift may move a person. Each depends on actual capacity, control and targets. |
| PF27 | Sensing is channel-specific | A vibration sense might locate a loose stone while missing ink; heat sight might find a warm pipe without reading its inscription. Detecting an anomaly, locating it, identifying it and understanding it can be different results. A superior faculty can legitimately do several at once. |
| PF28 | Support can end before the consequence | Distinguish maintained light, a released projectile, a permanent repair and a timed imprint. Ending the casting may extinguish light while leaving already warmed water warm under local laws. Do not reset all consequences when a source is removed. |
| PF29 | Target eligibility includes relations | A vow can bind a named agreement, a healing art living tissue, and a command seal its actual subordinate. These predicates can matter more than raw strength. World-specific exceptions remain possible; no universal rank comparison substitutes for the rule. |
| PF30 | Combine by a concrete handoff | One technique gathers moisture; another freezes the actual collected water; a third shapes the resulting ice. If a method creates ice directly it need not acquire the intermediate equipment. Link real output to real input, including scope and quantity. |
| PF31 | Maintained use competes only where it really does | An occupied hand, supported concentration or limited channel can constrain another act. A practiced routine, tool or multi-threaded mind may remove that interference. Do not invent concentration for every persistent effect or penalize powerful builds just for having several abilities. |
| PF32 | A counter acts at a particular stage | Preventing activation, blocking delivery and suppressing ongoing support differ. A silence effect may stop a spoken invocation but leave an already released physical object moving. Counter rules follow the selected mechanism, not the word 'magic'. |
| PF33 | Transmission and records are usable outputs | A sound technique may carry a message, a memory faculty preserve a witnessed pattern, and an imprint hold an instruction. Recording, understanding, belief and execution remain distinct; copying a description does not grant its source. |

### ACCOUNT FOR NOW: exploration details

| Code | Small detail | Modest default, useful dial and consequence |
| --- | --- | --- |
| PF34 | Approach changes what can be reached | A ledge approached from above, a narrow opening and a flooded channel can accept different bodies and means. Begin with authored connections and a few useful relations; continuous geometry is optional for a selected activity. A route can be usable in only one direction. |
| PF35 | A sensor probe is a real action | A mirror around a corner, a dropped pebble, a held lamp or a remote sense supplies particular evidence. A return signal may reveal space or depth without certifying safety, inhabitants or ownership. Repeated identical evidence need not teach more. |
| PF36 | Local conditions can be changed | Move an obstruction, open a shutter, drain an authored basin or support a loose beam. The resulting state should affect an actual route, reading, resource or shelter function. No full fluid, lighting or structural simulation is required for a bounded transition. |
| PF37 | Information can lead before it confirms | A copied map, measured bearing or remembered landmark can guide a first approach. Staleness, coordinate frame and actual source lineage matter. Correct directions can reach an entrance without surveying every interior or granting permission. |
| PF38 | Field aids have placement and custody | An anchored rope, chalk mark or portable lamp occupies an actual place and can help a later traversal. It is not simultaneously installed and in the backpack. Retrieval, abandonment and renewal follow the chosen object's rules. |
| PF39 | Getting in and getting out can require different means | A potion expires, cargo becomes heavier or an outbound ledge cannot be climbed back. Show known return constraints before commitment. Preserve forgiving recovery direction; do not introduce an undisclosed permanent trap as a small exploration detail. |
| PF40 | Observation can preserve a later option | Sketch a mark before cleaning it, take a supported rubbing before removal or retain a sample before excavation. A copy preserves its actual channel and detail, not all properties or powers of the original. Ordinary inspection remains a free preview; sampling is a distinct quoted action if it consumes material. |
| PF41 | Travel can change what is carried | An exposed record gets wet, a glowing object illuminates a route, and a large body fits different passages when those processes exist. Conditions attach to actual instances or batches, rather than rewriting an entire item template. Ordinary travel adds no unsupported wear or chores. |
| PF42 | Return has persistent practical meaning | A cleared drain remains clear until a declared cause changes it; installed shelter can later support rest. Visits do not reroll stock or advance paused worlds. A place can stay unchanged and still be useful. |

### ACCOUNT FOR NOW: everyday action details

| Code | Small detail | Modest default, useful dial and consequence |
| --- | --- | --- |
| PF43 | Carrying and containing are different services | A rigid case protects pages, a sling frees a hand and a bucket holds liquid. A container's functions can matter without making all inventories a packing puzzle. Extra-dimensional storage follows its own actual access and preservation rules. |
| PF44 | Clean, dry, warm and mend are ordinary verbs | Cleaning can reveal a readable surface, drying restore a usable record, warming loosen wax and mending restore containment. Select condition transitions with consumers; no mandatory hygiene meter or daily deterioration loop. |
| PF45 | Body and tool fit change the method | A large handle, alternate grip, beak-held tool or remote manipulator can support the same intent differently. Hand count is relevant to an action that uses hands, not a global prerequisite for ordinary agency. Adapted equipment or powers can replace the usual method. |
| PF46 | Reading and writing are practical operations | Light, medium, language and available hands can matter. Dictation or an instrument supplies an alternative. A translation, transcript and original remain different artifacts with source lineage; an unread book does not grant execution mastery. |
| PF47 | Preparation can be economical and pleasant | Packing a known kit, choosing a warm seat or preparing a sheltered workspace may reduce actual setup time or exposure. Some details can simply be descriptive. No bonus, fee, disadvantage or minigame is required for every everyday action. |
| PF48 | Maintenance changes a selected function | Sharpening improves the edge where cutting reads it, patching stops a supported leak, and calibration changes a reading. Maintenance frequency and necessity are world/activity dials, including none. Avoid a global condition tax. |
| PF49 | Small arrangements support other actions | Prop a book open, brace a ladder, hang a lamp or attach a bell. Track the selected support relation when a consumer uses it. Removing the brace changes supported work; a deliberate permanent repair may no longer need the brace. |
| PF50 | Simple cooperation does not require a society engine | An existing service holds a light, lends a tool or translates a passage under explicit terms. Keep the other actor's work, consent and custody distinct. A helper's contribution does not automatically become player mastery. NPC-heavy simulation stays deferred. |
| PF51 | Saving a method can preserve choices | A routine records tools, parameters, optional substitutes and stop conditions. It rechecks present means, pauses for meaningful choices and consumes actual supply. A new body or a changed world can invalidate a step without erasing the learned idea. |

### Three connected journeys, proposed examples

**PF52, light and evidence.** Use an available lamp or light faculty to read a
previously dim inscription. Direct the light from another angle to reveal a
supported surface relief. Copy what was actually seen, then use the directions
to attempt a first visit. Shared causes are illumination and observer evidence;
no mandatory hidden clue is asserted. A light whose law exposes only spirits
would require its own applicable reader rather than act as a generic lamp.

**PF53, movement and access.** Use a tool, supported force ability or existing
service to move one obstruction. Wedge it temporarily or relocate it durably.
The change opens an authored passage and may redirect a declared draft. That
draft can dry a damp record or affect a sustained flame if those readers exist.
The obstruction, wedge and record retain identity. Do not simulate an entire
building's airflow to support this chain.

**PF54, sound and everyday work.** Use a bell or sound faculty to signal across
a known route. An echo can also supply coarse spatial evidence under a distinct
supported method; an actual listener may hear the signal. The record distinguishes
sound emission, detected echo and delivered message. A silent mark-to-mark
communication power might deliver the message with no airborne sound at all.

These are alternatives for later scope selection, not three new active slices.
Each makes one existing output useful in another pursuit. No generated layouts,
new world, full physics, NPC wave or further crafting prerequisite is introduced.

### LATER / DELEGATE: small follow-ups, no dispatch

| Code | Candidate | Level / effort / done check |
| --- | --- | --- |
| PF55 | Select one PF52–PF54 pattern with the existing playable owner after its current gate, reusing a real available means and authored target. | Balanced design/implementation, strong review for persistence / medium. One everyday use and one exploration use cross the same supported cause; a genuinely different means works or fails for a declared reason. Native consumer, safe disclosure and save/reload/import are exercised. |
| PF56 | Extend the touched owner with one interruption and one changed-context case. | Balanced / small. Removing support, leaving range, changing body or relocating the object has the specified effect with no duplicated costs or retroactive erasure. Choose applicable cases, not all cases for every verb. |
| PF57 | Prototype discoverability if the extra uses become hard to find. | Balanced / small. At 1366×768 on a populated synthetic save, ordinary actions stay direct, alternatives reveal progressively, the log remains usable and Back/Esc works. Preserve click/keyboard access and sealed facts. A mockup validates discovery of controls, not runtime law. |

### Checks and limits

This is a docs-only more-to-consider round. Existing owner/rule/source reads
qualify the engine map; example interactions are authored proposals. No runtime
edit, fresh gameplay evidence, implementation dispatch or new accepted decision.
Check appended relative links/anchors, unique PF24–PF57 definitions in this owner,
pre-existing text preservation and input receipts in the engine map. No gameplay
suite is needed for these prose additions (AD36).
