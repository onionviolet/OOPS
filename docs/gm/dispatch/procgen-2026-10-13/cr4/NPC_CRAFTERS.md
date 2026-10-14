# NPC makers use the same material law

2026-10-14. **PROPOSAL ONLY.** Extends root NP1-NP3, MK1/MK4, EC2 and KN4 in the [crafting palette](../../../../PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md). Read-only [P4 branch report](../../../../../.claude/worktrees/proc-p4-people/docs/gm/dispatch/procgen-2026-10-13/p4/REPORT.md) supplies identities, not a workforce. [P19 social contract](../p19/CONTRACT.md), [P20 settlement](../p20/SETTLEMENTS.md), [P8 logistics](../p8/LOGISTICS.md), [P11 funded requests](../p11/REQUESTS_AND_MARKETS.md) and [CR3 automation](../cr3/AUTOMATION.md) remain their owners.

## NP1: one resolver, several actors and honest means

NP1.1: Pass a frozen actual batch, procedure edition, station/world context and any committed execution terms to the same pure material/product resolver for hero and NPC. Identical complete facts produce identical chemistry. Different actual input quality, method, apparatus or supported precision can cause different outputs. Species/body differences belong to execution and consumption laws, not a hidden NPC success bonus.

NP1.2: Material-family truth is world/save-scoped under its material owner. Do not call `createMixtureState` with each crafter's seed to create contradictory River bellleaf chemistry. Share retained definitions/products, while each actor's observations, methods and job references remain scoped. NPC learning cannot set the hero's `observed` flag. A shared assay result reaches the hero through an actual teaching/report route.

NP1.3: Existing P2 is not directly an NPC host. In its worktree, `src/mixture_native.js:5-35` stages one owner/stock/purse; `:38-43` writes specifically to `inventories.person.main_character` and `character.money`; `src/main.js:4668-4679` guards free Village player activity. Reuse resolver and publication principles. Add an actor-aware adapter that stages all participating actor inventories, funds, capacity, knowledge, output holders and draw state together. NPC work should neither occupy the hero's body automatically nor bypass native write authority.

NP1.4: Main recipes also assume the hero: `src/crafting_recipes.js:39-42,80-99,314-338` read `character` skill/inventory; main `src/main.js:4197-4236` reads a fixed result and unseeded craft draws. Wrap/adapt only the selected method; do not call the global recipe against temporarily swapped character state. P2 has no general skill/quality term yet, so an initial NPC uses the exact deterministic law. A later trained/error-prone law needs real operators and saved execution draws; inventing generic failure penalties would not be same-resolver proof.

## Actor and production bindings, logical proposal

These are required semantic references, not new exports or a duplicate person/schema owner. Root chooses current optional versions and module boundaries after integration.

| Binding | Actual authority and required reference |
|---|---|
| Maker | Qualified world/instance/life/person ID mapped explicitly to a supported simulation/native actor where work needs it; no name-based join. |
| Means | Actual skill/source/body, held tools/station rights, supported operations and reachable schedule. P4 role/keepsake text is not a registered tool or ability. |
| Method | Owned knowledge/edition and allowed substitutions; copied method versus practiced competence distinct. |
| Enterprise | Actual personal/workshop purse, goods and consignment custody with compensation terms. Funds are not added merely by assigning a job title. |
| Job | Existing scheduler command/reservations plus exact inputs/context, due boundary, eligible clock, output receiver and cancellation policy. |
| Receipt | Actual actor contributions, inputs/output/byproducts, observations, payment/settlement and optional saved draw allocation; P14 retention binds later callbacks. |

SHOWN/SOURCE: P4 branch `src/generated_people.js:22-25` saves a request, purse, keepsake and supplies; `:29-40` validates exactly three people and tightly bounded original supplies/goals. `:45-60` projects hourly routines, `:68-79` handles meeting/help/settlement, not production. CR4 cannot silently stuff new herbs or jobs into that exact schema. Use a qualified extension/bridge selected by its owner. Main `src/models/npc.js:8-50,53-63` combines person/dialogue/trader and disables ordinary XP multipliers; it does not establish a crafter controller. Main `src/npc_lives.js:5-22,33-42` supplies authored annual households/news, not workshop actions. These are inspected seams, not repository-wide absence claims.

## NP1.5: schedules and interruptions

Choose goals from known needs, existing orders, observed supply, method access and actual funds. Candidate work is intent until admitted. Revalidate means and reserve worker/tool/station/input/receiver; save frozen terms and stage. A job can run while the hero does other work if the NPC and site laws permit. A busy worker cannot also be a full-strength teacher or paid helper in another overlapping commitment.

Use one existing clock/scheduler. First slice is eligible played game time; browser closure freezes it. Reconcile due boundaries in stable order (clock, priority defined by law, job ID) and admit follow-up work from stock that really exists at that boundary. Arbitrary iteration order must not decide who gets the same last herb. New contracts can use disclosed reservation priority, queue order, negotiated sharing or bidding; no universal hero-first priority.

P2 `mixture_native.js:29-33` completes one due batch and dates its next batch from the supplied current clock; `mixture_ui.js:37` polls under current player readiness/location. This is not a general catch-up scheduler. Extending it for NPCs requires a boundary traversal adapter and segmented-time proof; keep old P2 timing outside selected scope. A computation budget can pause reconciliation with a saved cursor, not discard lawful production or grant a hidden extra burst when returning to the screen.

Stop on shortage, full receiver, lost source, inaccessible site or unavailable worker. Cancellation returns untransformed escrow and follows a declared partial-output law after irreversible work. Wages/deposits use actual parties and balances. A rejected/stale/failed write changes no stock, knowledge, draw, salary or capacity. After durable publication, a render error cannot refund consumed goods.

## NP2: supply webs carry goods and information separately

NP2.1: Start with a reachable graph: collector → maker → recipient, with optional vessel supplier, transporter or retailer. Each edge is an actual lot transfer, funded order, consignment or service. No invisible refill from being called herbalist. A public counter's abstract supply can remain an explicit source at first, but that cannot prove a conserved ecological supply web.

NP2.2: Distinguish available, held for work, in transit, offered, promised and used stock. P8 owns harvest/delivery; P11 owns demand/quote; CR4 binds a crafter's admitted production and learned method. Teaching or price news uses P19/P11 channels and supplies no physical herb. A downstream maker can know of future harvest without owning it.

NP2.3: Disruption has causal effects. If a delivery is interrupted, the maker waits on that missing input; recipient need may generate a backed alternative request. The hero can supply stock, commission another maker, teach a known substitute, negotiate a smaller batch, hire transport, buy finished goods or leave ordinary work running. Shortage does not automatically force robbery, illness escalation or hunger death.

NP2.4: Cyclic webs are valid when there is an initial source and conserved accounting: a maker recovers declared vessels, returns them to a bottler and receives newly paid refills. An instantaneous cycle cannot create stock or settle one receipt repeatedly. Rare abundance/duplication laws explicitly provide stock through their own source; profit alone is not an error.

## NP3: teaching changes a place through actual learners

NP3.1: Bind recipient, transmitted edition/claims, teacher/medium, interval and observed practice. An NPC must acquire means and execute the method before that teaching changes production. A learner can misunderstand, adapt to local ingredients, improve or teach another child edition under [KN4](MAKERS.md). Save negative/inconclusive tests and shared source roots. Public instruction can make local copying easy without erasing the inventor's credit.

NP3.2: Aggregate settlement consequences from real receipts: number of qualified active makers, supported service availability, fulfilled treatment/work needs, funded output and practiced traditions. The same successful dose cannot be counted both as three treated people and one stored bottle. P20 projects these changes; there is no bonus prosperity score that prints money or cures unmodeled diseases.

NP3.3: Different dissemination strategies remain available: teach one apprentice, publish a manual, sell licenses, demonstrate publicly, found a school, conceal the recipe or let independent research proceed. Generous or secretive worlds have fitting knowledge/copying rules. Schools are not restricted to one lifetime enrollment. Skilled apprentices can surpass a teacher through actual practice, not automatic player-level scaling.

## Small connected witness and gates

Original proposed first NPC route: an introduced qualified maker owns one supported station and buys/acquires real input stock. Hero commissions two P2-compatible doses, with funds held under P11 terms. Maker queues the exact known method, spends own stock and returns actual generated keys; hero inspects known provenance and uses one dose through P2. A deliberate next-input shortage stops the following job, leaving other player work available. Teach another method, then the same maker produces the changed real result using newly acquired inputs. A later third actor's funded order proves an NPC-to-NPC edge, rather than assuming a whole village economy.

OPEN: qualified identity bridge, recipient-scoped knowledge, world-scoped truth, actor-aware write-before-publish, worker/station/tool exclusivity, actual paid output, supply transfers, independent body effects, wages and cancellations, tick partition equivalence, no template refill, root stream integration, old P4/NPC/P2 continuity and full-envelope reference closure. Save/reload/literal-file Import pending production and finished/consumed outputs, actor stock/purses, teaching editions, reservations, receipts and next draws. [REPORT](REPORT.md) ranks a bounded proof; broad society is not required to demonstrate one useful maker.
