# Land, scale, involvement and the right representation

2026-10-15. **Proposal-only companion** to [river keeper](FISHING_PATH_PROPOSAL.md) and [courtyard grower](FARMING_PATH_PROPOSAL.md). These files answer the latest request with concrete examples, not a selected implementation specification. No world secrets, existing-save reinterpretation or implementation. [Existing-system fit](EXISTING_SYSTEM_FIT_AND_PROPOSALS.md) owns the source findings; [UI rules](../../UI_RULES.md) own any later UI work.

## LA1. Would farming reduce to plot count and crop type?

**Recommended proposal:** use plot count/crop type as a summary of meaningful land, not its complete identity. Area and spatial relationships matter when a crop, worker, tool, power or intended outcome actually consumes them. A fixed tile grid is optional.

A summary such as “Greens8 m² ·2 beds · ready” is useful. It should open the actual beds, whose identity, stage, treatment, actor and reserved output remain distinct if they differ. One “plot” could be a planter, a rented parcel or a large field; counting them without scale is misleading. Conversely, measuring every square metre is pointless if area changes nothing in this path. A first one-plot slice can honestly remain an abstract unit with a known capacity.

| Code | Distinction | Concrete consequence | Minimum suitable representation |
|---|---|---|---|
| A1 | Tenure/access versus physical area | Renting a field grants use of a boundary; it does not automatically grant seed, water, access to neighboring land or ownership. | Named holding/parcel with known access conditions. Track legal/social rules only where the world uses them. |
| A2 | Total versus usable versus cultivated area | A48 m² garden may devote24 m² to crops,16 to access and8 to shared water/work space. | Area breakdown where allocation matters. These numbers are illustrative, not inferred from current MG06. |
| A3 | Bed/field capacity versus crop cohort | One bed can contain a planted cohort; replanting creates a new crop occurrence. Orchard trees or rare specimens may deserve individual identity. | Bed/field record plus crop stage; individual record only for a meaningful individual. No per-stalk simulation required. |
| A4 | Area versus density |4 m² of grain and4 m² of a tree crop do not use identical seed counts, effort or output. | Selected crop/method has explicit coverage/density where needed. Existing seed packets stay abstract until a compatibility choice is made. |
| A5 | Local condition versus average | A shaded corner can differ from the sunny half. Uniform averages can hide the exact part causing a result. | Split into meaningful zones or overlays, not automatically thousands of cells. Show known conditions, unknown assessment and actual differences. |
| A6 | Area versus shape/reach/connection | A12 m² care effect might not reach beds separated by an obstruction or missing channel. A narrow strip and compact square have equal area but different boundaries. | Explicit target set or coarse geometry/network using the power's actual scope law. Area alone is not radius. |
| A7 | Growth versus labor | A growing plant may need no current worker; harvesting still requires real work. Current MG06 instead requires an explicit played-time grow command. | Separate displayed stage and job status. Do not quietly introduce passive growth while changing the UI. |
| A8 | Productive area versus useful output | Twice the area may produce more only under an actual density/yield/input rule; it does not double rarity or personal mastery by definition. | Quote relevant effective area and actual inputs/expected range, with uncertainty. No invented agronomic precision. |
| A9 | Capacity versus ownership/custody | A harvested portion belongs somewhere; storing, assigning to a meal and selling compete for actual stock. | Output destination/reservation linked to inventory and existing consumers. Storage limits apply only if represented. |
| A10 | Local work versus access/travel | Nearby beds can be tended together; distant fields might have travel/access costs, where actual rules support them. | Named sites and travel links often suffice. Detailed routing only if route choice matters. |

These are questions to account for, not ten required systems. Area need not bring soil exhaustion, disease, pollution, weather simulation, irrigation engineering and surveying with it. Add a phenomenon when its consequences are chosen and worthwhile. A magically self-sufficient plot may remove ordinary constraints under its world law.

## LA2. A deliberately small abstraction ladder

The following are interchangeable views or task-specific models, **not mandatory progression tiers**:

| Representation | Good use | What would justify more detail |
|---|---|---|
| Named capacity unit | Current one-plot MG06, window planter, simple household garden. | Differing sizes, treatment, output allocation or a capability that genuinely needs area. |
| Area/crop groups | Ordinary fields: crop, cultivated area, stage, method, labor commitment, destination. | A meaningful subgroup differs in condition/care/history. |
| Named beds/zones and relationships | Garden with sunny/shaded sections, shared water supply, experimental pair or distinct access. | Physical distance, shape or precise placement changes a chosen action. |
| Spatial plan/coverage overlay | Place a cultivation device, inspect reach, connect channels, maintain an important neighbor arrangement. | Exact boundaries matter enough for explicit geometry; otherwise use zones. |
| Individual specimen detail | A selected tree, unusual plant, graft, heirloom specimen or magical stage. | Its own history/state/interaction is interesting. Does not imply every crop becomes an individual. |

A large field can remain a row; a single rare plant can deserve the center view. Switching display never splits inventory, resets timers, creates observations or changes simulation granularity behind the player's back. If a new physical subdivision is an actual action, show its cost and effect explicitly. An aggregate includes only units equivalent for that displayed question; “watered” totals cannot conceal an untreated bed. Mixed groups say “mixed” and open the exceptions.

**Proposed limit to subdivision:** identify a boundary only for a real difference in crop, stage, condition, access, treatment, assignment or a selected experiment. Paths/water points can be relationships or area allocations rather than simulated tiles. Drawings can help orientation without promising collision, exact walking distance or fluid simulation.

## LA3. Area also matters for fishing, selectively

Fishing needs access and meaningful water distinctions more often than land parcel acreage. A named bank can contain reachable shallows, a current seam and cover. A pole, net, boat, sensing power and water-control effect can have different reach/targets. Draw a local diagram if those relations affect an action; otherwise use named spots with known conditions.

A territorial fishing right, water surface area, casting reach and expected catch are different quantities. Owning a pond does not establish fish population, stocking or sustainable yield. Multiple helpers using one reachable bank might compete for represented access, but no depletion or ecology rule is inferred from them. Weather/season/depth/flow and population are candidate world laws, not automatic necessities. A cultivation world may also make water volume, contained space or spiritual boundary relevant; adopt only the actual selected rule.

## UX1. Separate attention, control and execution

A single “manual↔auto” slider hides important differences. Keep three concepts distinct without forcing three configuration menus:

| Question | Example | Visible consequence |
|---|---|---|
| What does the player want to inspect? | Zoom into a bed or bank, inspect a specimen, pin a question. | More relevant evidence and controls; no time, work, XP or RNG change. |
| What decisions are delegated to an instruction? | Follow a known method until a real goal/shortage; ask before changing it. | A short readable routine/plan with an explicit stopping condition. |
| What means actually executes? | Player, consenting helper, device, autonomous power, or a power operated by the player. | Correct occupied actor, effect, effort, custody, learning and expiry. |

“Observe closely” need not mean “perform every chore.” A player can inspect a helper's garden; a personally executed routine can remain in summary while the human reads another panel. A player-powered technique may occupy the character even though it removes ordinary hand labor. True autonomous means can free the character. A global UI toggle must not invent concurrency, consent, autonomy or mastery.

**Switching contract, proposal:** inspecting is free; changing instructions affects only future uncommitted decisions; taking over actual work is an explicit handoff with a stated safe boundary. Existing spent time/inputs and resolved outcomes remain. Pause automation, cancel current work and stop watching are different actions. Cancellation rules are domain-specific: existing refundable planting is not proof that harvested crops, a consumed lure or a partially collected specimen can be undone. Changes can be queued for the next safe boundary rather than promising instant interruption.

## UX2. Concrete layouts at different involvement levels

Target for any later design trial: populated1366×768 desktop with readable ordinary text, status/current work/full-height log intact, shared components/controller and pinned labelled Back/Esc. Mobile deferred. The following are paper-level content layouts, not screenshots, prototypes or measured geometry. Square frames, exact dimensions and proportions must come from the shared owner when implemented.

**Routine at its place**

```text
Village / river                       [existing status/current work/log remain]
River fishing   You · known routine · [actual cycle status]     Inspect / Stop
Courtyard       1 planted crop · next step: Tend                Inspect
```

These are candidate rows within existing place navigation, not two new permanent panels appended to Local actions. Remote work appears only through actual knowledge/reporting rules. An expanded future garden can summarize ready groups, outstanding care and an exception count rather than six repeated controls.

**Focused fishing**

```text
River detail     [known reach] · [selected method] · [actual actor]
Local reach diagram / visible signs  | Means and method comparison
One consequential choice             | Actual inputs / known consequence
Selected catch / relevant evidence   | Goal, destination and stopping rule
[← actual previous destination]       [existing status/current work/log remain]
```

The diagram omits unknown species. Tension/timing appears only if a meaningful optional technique calls for it; a paused tactical choice is another valid hands-on form. A notebook link returns to the same selected reach and work context.

**Focused garden**

```text
Courtyard garden   24 m² planted / 48 m² holding  [illustrative future model]
Labelled bed/zone plan                | Selected B · greens · [actual stage]
Optional selected coverage overlay   | Care method / actual actor / inputs
Crop groups and outstanding work     | Known condition / next useful action
[← actual previous destination]       [existing status/current work/log remain]
```

This example is for the six-bed proposal, not the current MG06 display. Current one-plot detail uses one clear plot card without a fictitious area figure. Different overlays are selected deliberately; do not display every environmental layer, worker route and power radius at once. Text identifies covered/outside/unknown; color is supplementary.

**Delegation and investigation**

| Focus | Concrete proposed content | Interaction |
|---|---|---|
| Assignment | Known person/means, specific chore/target, real supplies, output destination, actual work/waiting reason and termination. | Inspect, change future instruction, pause mandate or explicitly hand off/cancel under supported rules. Show only applicable actions. |
| Comparison | A/B actual specimen or method; one chosen difference; observed conditions/results; source/actor; confidence. | Pin question, inspect sample, record actual report or start an explicit paid experiment. Merely clicking a note confirms nothing. |
| Power | Real supplied effect; targets/known coverage; operator or autonomous means; cost and end condition if applicable. | Preview known consequences before commitment. A power that needs no upkeep shows none. |
| Return summary | Useful actual outputs, destination, who did/learned what, exceptional observation and unfinished obligation. | Link directly to bed/reach/specimen. Avoid one interruption per watered tile or ordinary catch. |

A passive inspection view does not create new sensory observations the actor could not acquire. An actual “examine” or “survey” action can take time and use a capability; its button must say so. Unknown/unassessed/blocked are distinct. A summary can be approximate when the player lacks exact measurement. All examples omit implementation IDs and hidden formulas from product wording.

## DS1. Small coherent state, rather than everything at once

This is conceptual information to preserve, **not a new schema**. Reuse the current owners and add state only for a selected behavior.

| Information | Why it matters | Save/derive distinction to settle later |
|---|---|---|
| Site/holding access; bed or reach identity; actual area/relationships if used | Stable place and scope for actions. | Persist actual acquisitions and physical changes; derive totals/filtered views. Current plot right must not silently become new acreage. |
| Crop occurrence or fishing work, selected method, stage/progress and settled results | Same pursuit survives switching views/involvement. | Reuse existing clock and outcome authority; do not reroll during render/load. |
| Real actor/means, target claim, inputs, destination, stop condition | No duplicate worker, resource spend, crop harvest or contradictory assignment. | Use existing job/participant/custody routes; persist accepted work under their compatibility contract. |
| Known condition, observation/source, hypothesis, learned method | Legible discovery without omniscience. | Persist actual received/observed evidence; derive known-only views. Physical truth and belief are distinct. |
| UI selection, pinned question/overlay and navigation context | Return to the same work without unnecessary hunting. | Presentation state cannot mutate crops, claims or knowledge. Follow existing saved-layout policy. |

**Lifecycle questions to account for:** season/access changes while an instruction runs; a helper becomes unavailable; a target is already harvested; a power expires halfway through a chore; stock is reserved elsewhere; output cannot be delivered; treatment changes between cohorts; death/absence/ownership transfer; world travel and continuity. Each follows a selected real rule with an honest status, not a universal punitive event system. Simultaneous claims and completion must settle once through the existing authority. Browser-closed progress and distant simulation remain separate decisions. No new offline entitlement is implied.

## DS2. Ranked disposition

| Code | Disposition | Saved recommendation |
|---|---|---|
| NP1 | ACCOUNT FOR NOW | Keep land identity and useful capacity separate from plot count; start with the least spatial detail that preserves the chosen decisions. |
| NP2 | ACCOUNT FOR NOW | Allow hands-on choice per activity/chore; separately show actual executor and instruction. Same underlying work, no view-driven rewards or rerolls. |
| NP3 | LATER, possible small slice | One existing river with one method and useful catch consumer, or current one-plot MG06 with Farming integration and clear stage detail. The two fleshed-out lives are alternatives/examples, not a requirement to implement both together. |
| NP4 | LATER, only when useful | Named bed areas, meaningful coverage and one helper chore. A whole grid, irrigation simulator, village economy or universal ecology is unnecessary. |
| NP5 | LATER, after a selected experience | Native interaction/persistence and populated desktop UI evidence, then separate human acceptance. No implementation/testing is authorized by saving these proposals. |

Research is complete for this request: concrete fishing/farming paths, skill/power/discovery/delegation examples, area/scale relationships, involvement-dependent UI content and lifecycle implications are saved together. There is no required follow-up worker, new chat, purchase, compatibility change, general engine, automatic implementation sequence or new product decision.
