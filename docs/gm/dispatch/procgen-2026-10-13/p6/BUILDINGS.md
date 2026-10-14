# Buildings, bases, rooms and workshops as created things

Status: PROPOSAL ONLY. `src/site_projects.js:4-25` compiles a phase graph into existing jobs/world facts; `src/home_furnishing_content.js:39-63,70-101` spends actual stock to build a rack/bench and supports real drying/drafting. [Audit F11](LIVE_AUDIT.md). Missing: generated fixture instance, room/site geometry, capacity derived from inputs and complete installation/disassembly persistence. Authored completion flags are not a free-form building generator.

## Product law and axes

| Axis | Proposed contract |
|---|---|
| Logic | L2 connected structure, room boundaries, installed fixtures and interfaces; L1 material/condition; L3 powered ward/array only when selected; L4 site title/provenance where local law reads it. |
| Inputs | Actual site/access, footprint/capacity, material lots, tools, work crew/player means, utility source if required and plan. Ownership is distinct from construction competence. No universal permit/tax layer added. |
| Process | Survey/plan → foundations/frame → connections/fit-out → test/install. Authored geometry classes and finite phase graph initially, not voxel drawing or procedural dungeon layouts. Parts of a structure can be useful before an entire base is finished. |
| Skill | Planning, joinery/masonry and relevant installation precision influence structural suitability or capacity. Skill cannot supply space, resources or a magical utility source. |
| Knowledge | Measured space/load/interface, actual installed capability and observed work result. Maps/blueprints are informational patterns, not already built rooms. |

Generated: fixture dimensions/connection class, supported layout, actual capacity/drying rate or operation access derived from material/geometry. Authored: legal geometry classes, phase operators, environmental interactions, job consumers and teardown laws. Real consumer: a generated rack dries exact offcuts or a bench supports a compatible fitting job. Capacity becomes scheduler capacity only through its actual installed site record; a preview cannot register it. Room habitability/residents/reputation are separate later consumers, not assumed from a roof tag.

## Idle and persistence

Queue phase graph with exact materials/tool/worker/site reservations. Completed partial work remains a physical state. Cancellation returns untransformed escrow; teardown accounts installed recoverable material. After installation, player chooses batches, stock policy and receiver; unattended production follows eligible played time and actual capacity. Initial offline advancement deferred. Existing finite phase claims prevent duplicate settlement of that project, not all future buildings globally.

Save site/fixture IDs, title/access and occupant/capacity bindings, resolved material/structure/law versions, completed phases, installed utilities/charge, work receipts and pending jobs. Persist generated assembly before command/instance references. Existing Shack/Rack/Bench progress loads unchanged; no retroactive rebuild/reset or automatic resident enrollment. A selected generated fixture does not raise every station tier by altering a global template.

## Book laws

- K7, MoL ch3/ch30: ward geometry/coverage and live power differ. A protected entrance does not protect every wall or room.
- K9, TTKS rune contract: building an array's carrier does not supply its blueprint or fuel; useful fragments require exact supported functions.
- K11, Soldier Book5 ch296/ch314-315: light and lightning interactions are contextual. An illuminated workroom can have one actual consumer without becoming a universal defensive base.

[Locators](CANON_LOCATORS.md). No invented building safety standard, real engineering formula or canon dimensional threshold is admitted.

## First playable slice S7-A: build a variable drying rack

At an existing lawful earned workshop, select one original rack frame size and rail-spacing class, reserve real logs/binder/tool, complete two phases and install. Two valid designs differ in actual receiver capacity or eligible played drying time for supported offcuts. Use dry output in actual repair/kit work. Show installed capability and queue beside materials at 1366x768 and 1600x1000. This optional local prototype does not force every world/start to earn Frontier housing.

Acceptance, all OPEN: SOURCE proves acyclic phases, counted installation/capacity, stock conservation, no render enrollment and teardown/queue conflicts. NATIVE proves paid phases → installed design → actual drying difference → downstream use, and partial build/cancel behavior. Save mid-frame, installed and working; reload/Export/literal-file Import retain structure/capacity/title/jobs. Common gates apply. Base expansion, rooms/residents, wards and procedural geometry remain later proposals with separate consumers.
