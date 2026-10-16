# Part 9: room, city, world and scale

2026-10-16. **Planning only; all new designs below are proposals.**
Weibao requested a concrete LOTM or Harry Potter room-to-world walkthrough,
people/work/travel/discovery, possible panel reorganization, YAIR-like composition,
and how planet-level complexity and larger scales could be possible.

This extends [the focused Part 9 proposal](part-9-direction.md), which retains
the bounded first native slice. It selects no book-world implementation, UI
default, storage migration, new clock policy or planetary simulation project.
Keep the accepted [UI rules](../../../../UI_RULES.md), desktop priority and
Proto23 composition baseline. “More like YAIR” is interpreted provisionally as
retaining useful simultaneous native panels and explicit actions; the wording
does not establish a requested rollback of the accepted visual baseline.

## Evidence and existing owners

| Code | Inspected basis | Limit |
| --- | --- | --- |
| P9R1 | `src/workspace_layout.js:243–249` distinguishes composed core modules; `:415` establishes player/focus/inventory/actions/log regions. `src/village_workspace.js:152` changes the Focus heading by subject/encounter; `:160` onward renders local people/things and prose. | Source inspection, not a fresh screenshot or proof of room-to-world navigation. |
| P9R2 | [Surface types](../../../../UI_SURFACE_TYPES_AND_DRAWING_BOARD_2026-10-15.md#surface-types-one-home-per-kind-of-decision) already distinguish routines, services, threshold decisions, obligations, references, settings and ambient reports. [UI at scale](../../../../UI_AT_SCALE_CONSIDERATIONS_2026-10-14.md) owns wider UI considerations. | Reuse the accepted placement direction and existing owner distinctions; this proposal does not replace their controllers or queues. |
| P9R3 | [HP brief](../../../../worlds/harry-potter/WORLD_BRIEF.md) has original craft/nursery people and careers; [its source ledger](../../../../worlds/harry-potter/SOURCE_LEDGER.md) distinguishes original-novel scope and supplementary sources. | No specific origin, magical training, current cast schedule or native HP binding is selected here. |
| P9R4 | Official companion pages inspected 2026-10-16 locate [Hogwarts](https://www.harrypotter.com/fact-file/locations/hogwarts) in the Scottish Highlands, [Diagon Alley](https://www.harrypotter.com/fact-file/locations/diagon-alley) in London, and [the Leaky Cauldron](https://www.harrypotter.com/fact-file/locations/the-leaky-cauldron) as an entrance from Charing Cross Road to the alley. | Supplemental source anchors, not a seven-novel/chapter audit. No exact floor plan, shop adjacency, journey duration or unrestricted access follows. The Hogwarts page also lists mapping/travel restrictions; check their actual selected-source rules before implementing any map or transport interaction. |
| P9R5 | [Engine/saves/scale review](../../../../ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md#proposed-requirements-and-acceptance) E1–E8 proposes identity, bounded history, due work, aggregation equivalence and measured rendering/storage costs. Current source `src/save_files.js:237` sets a 4 MiB save-storage guard; `src/expansion_engine.js:639–654` bounds causal work and returns remaining time. | These narrow current source facts do not establish that today's engine supports planetary simulation. Earlier timing results in the review are historical, not rerun measurements. |

## P9H: one concrete Harry Potter journey

**P9H1, original scenario:** an eligible adult visitor rents a room at the
Leaky Cauldron and helps with a small specimen-carrier repair for a nursery.
Nessa and Elias may be reused from the existing HP proposal, with their actual
presence authored for this scenario; no placement is asserted as book canon.
The repair, room arrangement, payments, dialogue and discovery are original
gameplay ideas. Magical faculty, instruction and special travel require their
own source-qualified means and are not granted by the scenario.

| Code / scale | What the main view looks like | People and activities | Navigation, travel and discovery |
| --- | --- | --- | --- |
| P9H2, rented room | A short room description, selected carrier, desk/work entry and exit. Optional small schematic vignette; no tile grid needed. Location strip identifies the current room and its containing inn. | Study known notes, inspect the damaged carrier, select an actually supported repair method. Inventory remains visible for comparing materials. No magical repair action merely because the world contains magic. | Opening the inn overview changes the view only. `Go downstairs` is a separate physical action with its authored cost. Inspection does not rummage, reveal hidden contents or search the room. |
| P9H3, inn | A local site view with legitimate public areas and current subjects. A named room list can be schematic; do not invent a sourced floor plan. | An authored meeting with Nessa exposes her actual options: inspect a sample, discuss the repair, or offer help if that content exists. Opening a person dossier does not deliver dialogue or transfer anything. | An actual conversation can teach a supplier's name or directions. A new safe record/link appears from that received fact, not from a raw world lookup. Knowing the pub does not automatically disclose or grant access to its other passages. |
| P9H4, London / alley neighbourhood | Known street/site connections and a selected shop detail. Ordinary and magical places can coexist with different visibility/access. The public entrance is a meaningful connection, not just a new cosmetic tab. | Known suppliers, workshop and nursery contacts appear through disclosed records. Live people are shown only at supported presence precision; citywide acquaintance lists are not live headcounts. Compare available materials through an actual shop owner when locally accessible. | Select shop → inspect known information → quote actual supported route → explicitly travel → open native trade. Remote browsing may show a dated offer, not guaranteed current stock. Exact street distances/order remain original or unverified until qualified. |
| P9H5, Britain | Region/site network or atlas with only appropriate disclosed anchors. London and a broadly known school region can be represented without a precise school pin or an invented road. | A known study opportunity is an institution/contact record, not a guarantee that a named teacher is waiting there. Existing nursery work remains an obligation or current job, not a blinking planet-wide marker. | Choose a supported method and arrival site. Permission, fare, schedule, body/cargo and return differ by method. Simply opening the school record neither enrolls the visitor nor invents a journey. |
| P9H6, whole world | Known regional summaries or a globe/atlas only where geometry is appropriate. The same selected London site resolves back to its city and room views. Distant regions may remain setting information. | Institutions, markets and acquaintances are contextual layers with source/as-of labels. Do not scatter every actor or available recipe across the whole world. | A text mentioning a distant institution may create a record without exact coordinates, an executable route or current observations. Globe zoom is browsing; entry into another world/history is a separate means-dependent operation. |

**P9H7, close the loop:** buy or otherwise legitimately acquire the selected
materials; return to the actual room/work site; complete the supported repair;
deliver through an explicit handover; retain actual payment, relationship and
custody consequences. Later return shows that history through its existing owners.
None of this is native HP gameplay delivered by this planning pass.

**P9H8, discovery progression:** received mention → identifiable record →
directions/access knowledge → executable route → local observation → deeper
interaction. These are independent facts, not a compulsory six-rank unlock
ladder. Some origins begin with broad geographic knowledge; some abilities
skip a step legitimately. Discovering a new fact changes the relevant view
without inventing a universal explored percentage or automatic scout reward.

Hogwarts need not appear after London in a physical zoom hierarchy. The room
and inn are containment; the alley entrance is a connection; the school is a
different destination. A route graph and geographic containment answer different
questions. Non-Earth worlds and unusual interiors can use the same distinctions.

## P9U: divide panel responsibilities, keep useful simultaneous views

**P9U1, recommended interpretation:** narrow what a panel owns before narrowing
its pixel width. More panels are useful only when the player needs their contents
at the same time. Start with the existing player/focus/inventory/actions/log
composition and move inappropriate content to its existing natural home.

Conceptual arrangement, not measured geometry or an implemented mockup:

```text
Named destinations / existing navigation
+-----------------+-----------------------------------+----------------+
| YOU             | YOU ARE: rented room              | REPORTS        |
| Vitals, effects | Browsing: London > selected shop  |                |
|                 +-----------------------------------+ Travel, work,  |
|                 | FOCUS                             | dialogue,      |
+-----------------+ Here / selected person/site/route  | discoveries    |
| INVENTORY       +-----------------------------------+                |
| Materials, case | CURRENT WORK: actual status        |                |
|                 +-----------------------------------+ Full-height    |
|                 | TASK REGION                       | readable log   |
|                 | Local actions OR map OR service   |                |
|                 | Explicit commands / named return  |                |
+-----------------+-----------------------------------+----------------+
```

The current-body/location line remains authoritative while browsing a different
place. No duplicated current-place and inspected-place markers with equal meaning.
No inference that the proposed regions fit all text sizes until compared at
1366×768 14/21px and 1920×1080 21px. Reports and useful inventory space remain intact.

| Code | Existing responsibility to narrow | Proposed treatment / new surface need |
| --- | --- | --- |
| P9U2 | Around you / Focus currently mixes overview, subject inspection and combat | Keep a small location/browsing strip; Focus shows the local overview when unselected and a chosen subject when selected. Combat retains its board and known opponent detail, rather than inheriting a world map. |
| P9U3 | Local actions accumulates unrelated feature blocks | Keep actual actions available here; references remain in Journal/People, preferences in Settings, and threshold world-entry decisions in their own existing scope. Map browsing may replace the task region deliberately, with a named return. No change to accepted discovery or project visibility rules. |
| P9U4 | Map scale competes with local detail | Here/site, area and wider-world browsing are modes of one map surface, exposed only where supported. Selected detail uses Focus; an explicit expanded map can occupy the center with a readable selected-detail mode at large text. Avoid separate permanent Room, City, Planet and Cosmos panels. |
| P9U5 | People here versus everyone known | Present local subjects in Here; use the existing People reference for acquaintances, reports and history. A person can be reached from either route without becoming two records or two conversation owners. |
| P9U6 | Activity catalogue, running work and long obligations | Local actions offers eligible starts; one current-work summary owns progress/stop; the existing ledger or pursuit owner summarizes obligations. A map source link returns to the work site, not another running-job widget. |
| P9U7 | Large context changes and control loss | Browsing does not replace physical context or steal current-work focus. Navigation restores selection/scroll; commands revalidate current permissions and actual place. Critical choices follow the existing choice/clock policy. |

**P9U8, possible new surfaces:** a compact location/browsing strip and one
registered map view are plausible needs. A separate subject panel is warranted
only if an actual comparison task cannot fit the existing Focus/expanded view.
Do not add permanent task, person, route, institution and discovery panes merely
because those are distinct data concepts. At larger text, switch contextual
content or explicitly expand; do not stack six short scrolling panels.

**P9U9, baseline versus candidate:** compare current composed native play with
this allocation using the same inventory/work/people and the same journey.
“More like YAIR” does not itself choose a Classic layout or retire Proto23
frames, gradients and proportional references. No accepted default changes here.

## P9L: planetary representation and planetary simulation are different sizes

**P9L1, proposed technical direction:** large-scale play is feasible as a
combination of deep local places, meaningful distant processes and coarse
backgrounds. It is not established for today's engine, and the cost depends on
how much simultaneous causal interaction the player can actually exercise.
A planet picture, many generated names, and a planet of independently simulated
people are three different deliverables.

| Code / detail | Preserve | Advance or construct | Limitation |
| --- | --- | --- | --- |
| P9L2, active encounter/place | Actual participants, objects, commitments and relevant local conditions | Detailed existing combat/work/social rules in the selected locality | Being offscreen in a different panel does not deactivate a committed process. Relevance is causal, not camera visibility. |
| P9L3, distant meaningful activity | Named acquaintances, loans, commissioned work, unique objects, consequences, due boundaries | Relevant scheduled work/events under the existing world's clock policy | Do not replace a known person's actual promised outcome with a regional random roll. Remote influence keeps its affected targets relevant. |
| P9L4, supported regional model | Declared aggregate populations, production or institutional state only when their gameplay needs it | Coarse transitions with explicit inputs, outputs and conservation | No free-floating simulation of every possible sector. Aggregation must preserve promised outcomes and prevent double counting actors/resources. |
| P9L5, background/uninstantiated detail | Stable source/generation baseline and facts already fixed by play | Generate selected ordinary detail reproducibly when actually needed | A new camera view must not reroll history, inventory, rare finds or hidden truth. Use versioned definitions; retain consequential generated results. |

These are proposed execution strategies, not levels of reality or a new saved
state machine. Known people remain the same people. Coarse detail does not make
a local site immune to a supported regional event or large-scale power.

**P9L6, scheduling:** advance to meaningful boundaries instead of ticking every
room on a planet every second. A delivery, wage settlement, institution decision
or local hazard has a relevant time/condition. Process affected owners, then
publish consequences in causal order. Important player choices retain the
accepted pause policy. Preserve unspent time if catch-up exceeds a work budget;
the current bounded expansion loop is an existing seam, not planetary proof.

**P9L7, stable refinement:** a town first represented coarsely can later acquire
named shops or streets consistent with prior facts. Generate from stable scoped
seeds/content revisions where appropriate, and persist deviations and important
results. Never create extra stock by expanding a summary warehouse into rooms,
or let entering a district turn one aggregate population into duplicate people.
Preserve identities already exposed, commitments and counts actually relied on.
An original novel site may be authored instead of generated; canon landmarks
are constraints, not things a generic city generator may shuffle.

**P9L8, complexity budget:** aim for work driven by active interactions, due
consequences and changed summaries rather than total decorative planet size.
This is a design objective, not a performance measurement or guaranteed formula.
If a capability genuinely observes every person or edits an entire planet, its
required state and causal work grow accordingly. Represent supported uniform
effects compactly where valid; resolve consequential exceptions and named targets.
Do not claim a coarse model can reproduce every individual or exact global
interaction. State unsupported resolution before commitment, or deepen that
capability's adapter. Do not quietly weaken earned power to hide engine limits.

**P9L9, storage/rendering:** keep static content separate from changed gameplay
state, render only the scoped visible view, and bound disposable presentation
history without losing history used by gameplay. Current source has a 4 MiB
storage guard, so saving a fully expanded planet of per-person/per-tile JSON is
not a credible extension of that envelope. A different persistence arrangement
may eventually be needed after measured workloads; no storage backend or schema
is selected now. Existing save size, cloning and boundary work need profiling,
not confidence borrowed from node count or unit tests.

**P9L10, beyond a planet:** a star system or realm network adds regions and
explicit transitions at another scale. A larger spatial scale is different from
a different world history, metaphysical layer, dream or instance. Preserve
endpoint identity, access, cargo and return contracts. Render a schematic realm
network when geometry is meaningless. Do not force every cosmology into a globe
or treat a portal as a shorter ordinary road.

## P9T: subtle cases that change the design

| Code | Case | Planning consequence |
| --- | --- | --- |
| P9T1 | The player knows an institution but not its exact position or how to enter | A named record without a precise pin or travel command is valid. Unknown position, denied access, absent source data and unfinished gameplay are different. |
| P9T2 | A changing building, concealed space or misleading map | Distinguish actual topology from observations and cartographic claims. A personal schematic memory versus an in-world map may have different rules; qualify the selected source/ability rather than bypassing world restrictions by UI convention. |
| P9T3 | New details appear as the world is deepened | Revealing a pre-existing place, constructing a place in play and adding authored coverage are different events. Expansion must not fabricate a past visit or player knowledge. |
| P9T4 | A known person works elsewhere or leaves | Keep identity and relationships, update actual presence through its owner, and retain dated reports. A map marker disappearing must not leak a hidden departure or death. |
| P9T5 | The player looks at a map while mining, in combat or in a timed situation | Browsing retains the current clock/work rules. Context, current work and an explicit return remain accessible. Optional map use must not create pause exploits or forcibly cancel actions. |
| P9T6 | A distant event affects the current place | Apply effects through causal owners at supported boundaries; viewing distance is not protection. Only actual received news updates knowledge. Do not update hidden-event badges or unseen casualty counts. |
| P9T7 | Broad senses, projection, telepathy or multiple controlled bodies | Track whose location/control/knowledge is being represented under the accepted identity rules. No universal shared vision, remote trade or body travel follows from opening a remote view. |
| P9T8 | Travel interruption or a route closes after a quote | Distinguish planned, committed and completed journey; validate at commitment and honor declared interruption/return semantics. The map never invents arrival because the destination was selected. |
| P9T9 | A generated ordinary person becomes important | Stabilize identity and the facts already encountered before adding ongoing contracts. Avoid save bloat from persisting every decorative name, while never rerolling someone the player actually knows. |

## P9G: proposed expansion evidence, not a new Part 9 gate

Before a later scale implementation can claim success, use synthetic workloads
that distinguish breadth, interaction and retained history. Compare a small
reference run with coarser/scheduled execution where outcomes should agree.

| Code | Future proof question | Example acceptance evidence |
| --- | --- | --- |
| P9G1 | Does a larger view preserve one real journey? | Room → inn → city → region/world browse → same room, with unchanged selection identities, real travel costs, native work and Back/physical-return distinction. |
| P9G2 | Does refinement preserve actual history? | Reopen/generated-detail expansion, reload and import retain known actors, custody and unique outcomes without duplicating aggregate resources or rerolling facts. |
| P9G3 | Does the execution scale with relevant work? | Separate many background places from many active interacting jobs; measure input, boundary processing, render time, save bytes and load/import cost on a named device. Counts alone are insufficient. |
| P9G4 | Are clock and causal joins equivalent? | Single advance versus split advance, interrupted catch-up and save failure preserve due order, conserved goods/money and unspent time within the declared policy. |
| P9G5 | Are scope and knowledge honest? | Hidden-state perturbation leaves public map/list/ARIA unchanged; planet-scale commands resolve their advertised effects or disclose unsupported resolution before commitment. Human style/play acceptance remains separate. |

**ACCOUNT FOR NOW:** retain these distinctions in Part 9's representation and
future adapter boundaries. **LATER:** expanded book-world scenes, panel redesign,
regional simulation, large-scale abilities and persistence work each need their
own selected scope and evidence. This discussion launches none of them.

## Settled without asking

Planning-only authority, useful simultaneous desktop panels, appropriate local
navigation, one center controller, intact Reports and the existing clock/knowledge
direction are already established. A room-to-world study can be described with
explicitly original content without settling all novel canon or selecting an
origin. The proposed panel allocation and execution detail remain reversible
design choices. Specific travel/canon rules and scale performance need focused
evidence if their implementation is selected.

## Questions for Weibao

None required for this planning pass. Final panel proportions, visual treatment,
the first book-world locality and the advertised resolution of large-scale
capabilities remain future decisions; none is implied by this document.
