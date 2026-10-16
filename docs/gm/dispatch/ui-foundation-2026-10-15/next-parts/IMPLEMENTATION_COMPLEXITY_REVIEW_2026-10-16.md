# Farming, building and hidden implementation cost

2026-10-16. Planning review requested by Weibao against NEXT_PARTS: are ideas adding unnecessary complexity, especially farming, building and other future activities? Recommendations only. No implementation, dispatch, changed priority or accepted scope follows from this report.

## Assessment

**Current clarification, 2026-10-16:** Weibao likes some complexity and asked how to continue improving while managing implementation difficulty. The continuation below qualifies the original defer-heavy recommendations: they are possible starting scopes, not a simplicity ceiling. No specific mechanic is selected for implementation.

**F1: The main risk is bundling optional simulations into a feature's definition.** Farming can have meaningful crop, care and harvest choices before seasons, breeding, soil chemistry, market demand or autonomous farmhands exist. Building can change what a place lets you do before tile placement, structural physics or a settlement economy exist. Preserve the potential for a whole life path; qualify each added subsystem by the decisions and consequences it supplies.

This follows PROJECT's current authority and USER_VISION's [procedural focus clarification](../../../../USER_VISION.md#procedural-focus-ruins-and-world-first-2026-10-16): NPC-heavy procedural work is deprioritized in that design pass because of its implications and implementation cost. That instruction does not cancel existing NPC systems or authorize redirecting other active delivery. [Making rules](../../../../MAKING_RULES.md) MR18 and MR29 likewise preserve activity-specific depth and separate product logic under shared infrastructure.

## Evidence corrections and reuse

**F2: “No farming exists” would be too broad.** NEXT_PARTS AC3 and Part 8 concern the absence of a base-activity persistent crop/season simulation. The [activity review](activities.md) AV7 already qualifies the agriculture claim. Additionally, current source contains a bounded management crop flow in `src/management/shipping_farming.js:20–84`, imported by `src/management/content.js`: rent one plot, choose greens or grain, plant, tend, explicitly run growth using played minutes, then harvest once per crop. This stores crop stages, but it is not evidence of autonomous background growth, seasons or a spatial farm. SOURCE tests for MG06 are present; this review did not execute them or establish browser reachability or gameplay acceptance.

Building also has a concrete reuse candidate: `src/site_projects.js` compiles phased projects into existing job, claim, cost and world-fact contracts. `src/home_furnishing_content.js`, `src/audit_remainder_home_content.js` and `src/field_workshop.js` consume it. Assess these owners before proposing another construction queue. Source presence alone does not prove suitability for every building feature.

## Five recommendations

| Code | Preserve the valuable choice | Where cost multiplies | Proposed boundary |
| --- | --- | --- | --- |
| D1, farming | Choose a crop for an actual food, medicine or material use; choose a care method with a real consequence | Per-plant updates, soil nutrients, weather, pests, breeding, spoilage, seasons and prices form interacting simulations | Begin with one supported plot or crop batch and a small number of meaningful choices. Reuse the bounded flow where suitable. Add independent growth only when doing something else while crops grow is the selected player outcome. |
| D2, building | Choose what useful facility to create, its location at the existing site scale, material commitment and supported alternative | Free placement brings footprints, collision, access, adjacency, demolition and potentially worker navigation; settlement economics adds another layer | One authored site and one functional structure or repair with existing phased jobs. Completion must enable a concrete use. A schematic layout can supply atmosphere without gameplay coordinates. |
| D3, delegation | Set a routine or bounded work order that reduces repetitive input | General autonomous helpers require scheduling, travel, supplies, competing duties, knowledge and failure recovery | Use an existing worker/order owner when available. Give a helper one explicit supported job, input limit and stop condition. General AI planning and a simulated labor market are separate expansions. Existing means and consent rules still apply. |
| D4, shared UI | Recognize needs, duration, output, readiness and a route home across activities | “One activity model fits all” can force farming, combat, books and crafts through a replacement engine, or create empty universal fields | Share summary components and adapters over actual owners. Farms may need plot rows, construction phase rows, books a study view. Validate exact native facts without requiring every feature to implement the complete opponent knowledge ladder. |
| D5, cheats and future simulation | Distinctive identity, useful appraisal and previews supported by the cheat's actual rules | Fully simulating future farms, buildings, markets and NPCs requires copying and evolving all relevant state; carrier × entity × mechanism also creates presentation combinations | Keep visual styling separate from the behavioral promise. Begin a future simulator with a bounded supported domain, such as one encounter, when separately chosen. Whole-life forecasts, inherited rewards, false knowledge and enemy foresight each need their own scope. This review does not replace any cheat's established rules. |

## Hard-to-notice choices that affect the design

| Code | Question that needs an explicit answer in the selected slice | Why it matters / bounded approach |
| --- | --- | --- |
| R1, clocks | Does growth advance during travel, other work, another life, a paused game or browser closure? | A command that occupies the player is simpler than independent crops. Neither is automatically the correct design. Reuse the relevant clock policy and state its behavior; do not invent another timer to fill a progress bar. Offscreen is different from offline. |
| R2, commitments | When are materials reserved or spent, and what survives interruption? | Two jobs cannot spend the same wood. Reuse supported reservation/cancellation semantics; one selected construction slice needs a defined refund or progress rule, not a new universal rollback system. |
| R3, persistence | What survives leaving, returning, reloading or the relevant world/life transition? | A saved stage is cheaper than reconstructing a full historical simulation. Follow existing transition owners; define whether a plot, deed or unfinished structure stays with its world. Do not make every farming slice depend on an unselected multiverse inheritance system. |
| R4, attention | Is tending a choice or a mandatory sequence of clicks? | The present crop source requires planting, tending, starting growth and harvesting. This is concrete implementation, but its mandatory care step alone does not prove interesting gameplay. If care has no competing method, timing choice or consequence, repeated clicks may add work for both player and developer. Judge the loop before adding more care variables. |
| R5, consequences | Where does output go, and what does completion enable? | Yield without an existing use and construction without a functional consumer become detached counters. Choose a real inventory/use owner. A fixed supported trade can connect a crop to livelihood without first simulating every buyer and price. |

Many cases can be resolved locally instead of expanded into systems. For example, a water requirement can initially be a supported site condition or an explicit care input; it does not automatically require fluid simulation. Storage can use existing inventory capacity if suitable; it does not automatically require moving every harvested item through a hauling network. An authored consequence can be meaningful without an ecosystem simulation behind it.

## Implications for NEXT_PARTS

**A1, account for now:** Part 7 remains a presentation pilot over mining/foraging. Its exact tool, time and output facts need the native owner, but simple truthful facts should not acquire a universal knowledge migration merely to become displayable. Current Part 7 sequencing mentions Part 4's projection agreement; distinguish that agreement from requiring Part 4's entire implementation.

**A2, account for now:** Part 8 should remain one real site consumer, as its latest brief already says. AC3's earlier shared farm/workshop/household anatomy is a hypothesis about presentation, not authorization for a universal site simulation. Keep the farming source distinction above with any future brief.

**A3, retain:** The focused [Part 9 proposal](part-9-direction.md) already avoids gameplay coordinates, a parallel pathfinder and a new save schema merely for display layout. Farming and building do not automatically require overturning that boundary. Introduce spatial mechanics when position changes an actual decision, such as supported irrigation adjacency or access, and evaluate that cost separately.

**A4, later:** Seasons, breeding, general helpers, markets, physical construction and whole-world simulators remain possible directions. No new research programme or prototype is needed to keep them possible. Select one only when it strengthens a chosen player journey enough to justify its behavior, save and UI work.

## Recommended first-slice test

Before expanding a proposed system, be able to state: what the player chooses, what changes because of that choice, which existing owner records it, and what useful action follows. If two options produce the same decision and consequence, extra simulation is not yet justified.

For farming, a suitable candidate is one plot, two crops with distinct existing uses, an explicit growth policy, and a harvest the player can actually consume or use. For building, it is one site, a material commitment, phased work and a completed facility that enables something useful. These are candidate scopes, not newly selected delivery tasks. If the selected farming outcome is parallel growth, include that behavior in the slice rather than presenting an occupied-player grow command as equivalent.

## Continuation: preserve depth while controlling implementation difficulty

### Correction to the framing

**C1:** The earlier review treated expensive features mainly as things to defer. The better question is which complexity creates the intended experience, and how to deliver that behavior with a comprehensible implementation. A satisfying farm may need independent growth from its first playable version. Replacing that with an occupied-player grow command solely because it is easier could remove the point of farming.

Distinguish rule-design, integration, content-production and verification costs. An unusual mechanic can be small when its inputs and consequences are bounded. A familiar formula can still be costly when several systems own conflicting state. These are qualitative assessments, not measured effort estimates.

### Five ways to continue

| Code | Proposed method | Practical consequence |
| --- | --- | --- |
| C2 | Prove one rich relationship early | Crop + growing conditions, or building + site capability. An initial version consisting only of unrelated timers cannot establish whether the intended depth is enjoyable. |
| C3 | Use the least detailed model that preserves the relationship | A plot moisture value can support meaningful care without fluid simulation. If position is the desired choice, a small authored adjacency model can preserve it. Do not simplify away the reason to build the feature. |
| C4 | Keep one authoritative record per fact | Crop growth, construction progress and stock commitments need clear owners; views read those owners. Existing explicit grow commands do not establish background scheduling; the project compiler does not establish crop growth. Bridge a demonstrated gap instead of inventing a universal engine. |
| C5 | Add one consequential interaction at a time | Prove crops + conditions, then a building that changes those conditions, then a bounded routine. Recheck the earlier useful journey after each addition. Avoid introducing weather, helper and market engines together. |
| C6 | Make causes inspectable during implementation | A bounded developer view can show real inputs, elapsed time, active effects and transitions. It must read the actual resolver and preserve sealed information. It helps diagnosis but does not replace native gameplay, persistence or human acceptance. |

### Connected farming and building example

**C7, illustrative proposal:** one site, two crops with different useful outputs, one growing-condition constraint, and one constructible improvement. A rain-fed food crop and a more demanding medicinal crop could make water use matter. An irrigation improvement changes the condition through an explicit rule. Exact content still needs its world owner; these examples are not accepted content or canon.

The player commits seed, leaves to do existing useful work, returns to an explained result and uses the harvest. The player then invests materials and labor in the improvement and sees a different growing option or result under comparable conditions. If independent growth makes that journey valuable, include it explicitly. It is not already provided by the current management flow.

This is a small domain with interacting rules. It can later gain seasons, rare seeds, materials or powers without implementing those systems first. Atmosphere also counts as value: an attractive authored farm scene can be worthwhile without requiring spatial simulation.

### Subtle interactions to settle for the selected slice

| Code | Interaction | Bounded constraint |
| --- | --- | --- |
| C8 | Time jumps skip changes | If conditions change midway through growth, using only the final condition can give a wrong result. Advance consistently across relevant stage/condition boundaries. Event-based advancement is a candidate, not an assumed capability. Compare one long supported advance with equivalent small advances where rules promise equivalence. |
| C9 | New buildings change the past | Settle growth up to an improvement's effective time before applying its new condition. State how unfinished crops receive future benefits; do not recompute their whole history under the improved condition. |
| C10 | Scale creates chores and update cost | Batch equivalent plants or plots. Split them when different treatments or individually important specimens need separate state. Do not make 100 identical plants require 100 clicks. |
| C11 | More variables still yield one best answer | Check whether desired products, timing, capacity or conditions actually change the choice. Improve the demonstrated interaction before adding another dimension. Avoid arbitrary caps or penalties solely to force variety. |
| C12 | Failure changes how time feels | Decide whether neglect delays, reduces or destroys output. Away/offline behavior must be intentional, with visible causes and a reachable next step. Farming need not become recurring maintenance pressure. |
| C13 | Discoverable rules become opaque | Explain routine care and visible causes through appropriate knowledge owners. Hidden properties may remain discoverable; the player need not reverse-engineer every ordinary action. |
| C14 | Updates invalidate ongoing work | Distinguish instance state from definitions. Decide what changed crop rules do to an already planted crop or committed project. Extend schemas through their current owners, without building a universal future-proof format. |
| C15 | World differences multiply branches | Reuse compatible lifecycle/UI behavior while keeping local crop, material and power rules distinct. A magical process need not use ordinary farming math. This follows MR29's shared envelope with separate product logic. |

### Recommended continuation sequence

1. **C16, choose the experience:** name the connected player journey and the interaction that makes it interesting. Keep future ideas with their purpose and revisit condition. Deferral is neither rejection nor a mandatory backlog.
2. **C17, qualify the hardest dependency:** inspect just the clock, job, inventory and save routes required. For this example, growth while doing other work is the central uncertainty. Resolve its owner before polished UI or a broad framework.
3. **C18, deliver a representative journey:** real inputs, an actual condition-dependent consequence, useful output and relevant return/persistence behavior. Use a disposable experiment only for a named uncertainty that could cause substantial rework. This review launches none.
4. **C19, check correctness and depth separately:** rebuilt fresh-origin native journey; contrasting choices/conditions; affected cancellation and save/reload/import boundaries. Fixtures explain behavior, native play establishes access, and Weibao judges enjoyment and appearance. UI retains NEXT_PARTS' desktop targets and existing homes.
5. **C20, expand or revise from evidence:** if the relationship works, add the next named interaction. If it is opaque, repetitive or always has one answer, improve feedback or choice before multiplying content. Finish at a playable checkpoint rather than a module or planning boundary.

The immediate scope remains planning. These steps propose how later selected implementation should proceed. No worker, prototype, build, gameplay state change or commit is requested here.

## Verification and limits

Read the referenced NEXT_PARTS rounds, Part 9 refinement, activity review, PROJECT summary, relevant USER_VISION and MAKING_RULES direction, crop commands, management content import, project compiler and its consumer references. Inspected existing MG06 SOURCE test definitions without running them. No runtime, build, browser, performance measurement, save or personal gameplay state changed. Difficulty judgments are qualitative architectural assessments, not measured effort estimates. Final gameplay and visual acceptance remain open for any future implementation.
