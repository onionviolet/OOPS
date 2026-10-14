# U7: maps, charts and economy views at scale

## CHECKPOINT

2026-10-14: research and proposal synthesis complete. Owns only this file and
[U7_REPORT.md](U7_REPORT.md). Root palette and other lanes remain read-only.
Read COMMON first, then live authority, related UI owners and nonhuman scale.
No builds, browser sessions, tests, saves, packs, commits or source edits.
Resume from the source gaps and proposed checks below, not from an assumption
that these views exist. All MP/DV rows are **INFERRED considerations**, not specs
or accepted decisions. Report owns delivery and limitations.

## Scope and incumbent

**F1, live direction:** desktop/laptop first at **1366x768 and 1920x1080**;
mobile deferred. Desired visible outcome: a useful local map or selected trend
beside the current action, its quote and current work, with larger-scale context
available without losing the selected place. This is a design target, not measured
fit. [User vision](../../../USER_VISION.md#standing-ui-priority-2026-10-13),
[PROJECT](../../../../PROJECT.md#standing-priorities-and-document-authority)
and [Panel kit](../../../PANEL_KIT.md) remain authoritative.

**F2, incumbent:** the user confirmed the Hanzi-field visual preference, while
map/action integration remains proposed. Ordinary activity menus remain primary;
a map is not a prerequisite for deeper gathering or insight. The existing
[map scope owner](../../../WANDERING_ZONES_AND_INSIGHT.md#map-scope-and-timer-driven-first-integration-2026-10-02)
separates presentation, wandering gameplay and a spatial simulation.
**SHOWN source:** `src/display.js:2539-2561` renders connected, eligible travel
choices and formatted travel times. That is a reuse seam, not an existing map
engine or observer-qualified route planner.

**F3, knowledge boundary:** maps and charts show only what the character can
know through their actual means. Reading a chart does not measure an unseen
economy, contact a scout or acquire a map. Zoom, sorting, aggregation and notation
must not increase knowledge. The [means owner](../../../MEANS_AND_APPRAISAL.md)
and [nonhuman senses/scale owner](../../../worlds/NONHUMAN_SENSES_SCALE_AND_UI_2026-10-14.md)
own that rule. Maps use their qualified evidence, not raw world state.

General workspace patterns belong to U1, long-list handling to U6, and access
methods to U4. This lane discusses map semantics, chart choice and economic
meaning only. A text-art example below does not establish accessibility proof.

## Evidence and game comparisons

**SHOWN** means an actually loaded page or inspected source with a locator;
it proves that artifact, not live gameplay. **STATED** means a documented claim
from a developer, manual, wiki or named secondary guide. **INFERRED** means our
proposed transfer. **MEMORY** is unchecked recall and cannot carry a recommendation
alone. Sources were checked on 2026-10-14. Older editions remain explicitly old.
No commercial game was run and no game screenshot was visually inspected.

### Maps: what each representation is for

| Code | Reference and evidence | Useful mechanism | Transfer and cost, INFERRED |
|---|---|---|---|
| RM1 | EU4: **STATED**, original manual, indexed text; full PDF fetch exceeded the tool size limit. [Manual](https://forumcontent.paradoxplaza.com/public/79250/EuropaUniversalisIV_Manual.pdf), main-map and ledger sections. Map modes are also described in the [manual mirror's indexed text](https://www.scribd.com/document/190664400/EuropaUniversalisIV-Manual). | Terrain, political and trade readings of one geography; a thematic ledger provides comparison outside the map. Original-release evidence, not a current exhaustive mode inventory. | Adapt question-based layers, retaining the same selected place. A map mode requires a legend, qualified values and a useful question; a new map engine is unnecessary for route-only views. |
| RM2 | CK3: **STATED**, [launch-era map guide](https://www.gamewatcher.com/crusader-kings-3-map), loaded page, map-modes section. Lists realms, terrain, faith, culture and title-tier modes. Official Dev Diary #25 was found but its readable body was unavailable through Steam/forum routes. | The guide describes paper overview → colored realms → barony terrain as zoom levels. Physical terrain, political control and title hierarchies are different readings of the same land. | Distinguish actual control from claim, membership or entitlement. Zooming a town should not automatically change a chosen ownership layer into terrain. Secondary evidence limits exact controls/current-version claims. |
| RM3 | Victoria 3: **STATED developer**, [DD74](https://www.paradoxinteractive.com/games/victoria-3/news/dev-diary-74-ux-improvements), Map Modes and Market Access sections. Documents literacy, population, infamy and heatmap changes for 1.2. | Numeric layers expose where a condition varies; the market-access explanation supplies reasons for a connection problem. | Offer price, supply or route-state layers when supported by reports. State whether a region shows total, density, mean or last quote. A regional average is not every shop's price. |
| RM4 | Stellaris: **STATED game director**, [console introduction](https://blog.playstation.com/2019/01/22/grand-strategy-comes-to-ps4-in-stellaris-pre-orders-start-today/), controls paragraph. Explicit switch between system and galaxy views, separate from zoom controls. 2019 console edition. | Galaxy connectivity and local system detail are separate semantic views, not merely different magnifications. | Use explicit rung labels and a direct return to overview. Keep selected world/system identity through the transition. This does not establish present-day PC fog rules or require smooth camera zoom. |
| RM5 | Dwarf Fortress: **STATED wiki**, [World generation](https://dwarffortresswiki.org/index.php/World), World map size; [Legends](https://dwarffortresswiki.org/index.php/Legends), Navigation and Exporting World information. | Nested region/local/tile geography; separate linked histories of people, sites and civilizations. Current Legends article distinguishes older map-export capabilities from current exports. | Keep atlas and historical knowledge as linked views. Do not copy the default broad historical reveal into character play. Current text history and older historical-map screenshots are not evidence of identical current UI. |
| RM6 | Caves of Qud: **STATED secondary**, [Qud Fundamentals](https://www.qudzoo.com/advice/novice/fundamentals), Parasangs/Zones section, loaded after the official wiki was restricted. **STATED developer**, [press kit](https://cavesofqud.com/press-kit/), links an explicitly old ASCII-only edition. | World tiles summarize multiple local zones; the guide describes a parasang as nine zones and distinguishes local exploration from world travel. | Name what one cell means at each rung. Borrow symbolic terrain and local inspection, not Qud's map dimensions, turn rules or hunger/travel restrictions. The old ASCII download does not prove the current renderer. |
| RM7 | MUD/Mudlet: **STATED official manual**, [Mapper](https://wiki.mudlet.org/w/Manual:Mapper), Maps and Autowalking. Directed room graphs, special exits, areas, grid mode and per-area zoom. | A city can be one wilderness node yet many rooms inside. Special exits preserve nongeometric links; ASCII-looking grid display and graph display serve different maps. | Best fit for existing connected locations: room/route graph first, grid only where true geometry matters. Mudlet is a client renderer plus game-specific mapping script, not universal automatic knowledge. Its graphics-backed grid can look like ASCII without being text-only. |
| RM8 | Outer Wilds: **STATED creative director**, [Ship Computer update](https://www.mobiusdigitalgames.com/news/its-a-new-year), 2018. Optional detective board links discovered clues rather than physical positions. | A known report can create a lead before visiting its target. Discovery relations form another kind of map. | Rumor and prerequisite graphs can guide exploration without exposing a dungeon layout. Every new node needs an actual clue; unseen source content does not justify an unknown-node placeholder. No story truths are reproduced here. |
| RM9 | Factorio: **STATED developer**, [FFF180](https://www.factorio.com/blog/post/fff-180), map info/tags/inspection; [FFF380](https://www.factorio.com/blog/post/fff-380), Remote view context. | Toggle logistics/electric/pollution info over one map; integrate planet/platform switching into remote view. Remote item delivery uses robots rather than teleporting inventory. | Adapt useful layers and direct scope switching. Keep viewing, issuing an order and executing it separate. FFF180's seamless map-to-world zoom was an idea there, not proven delivery by that post. |
| RM10 | Elite Dangerous: **STATED manual**, [Frontier manual v1.01 mirror](https://manualzz.com/doc/2982611/frontier-developments-elite--dangerous-game-manual), Galaxy Map/System Map. [Horizons v2.00 manual indexed text](https://hosting.zaonce.net/elite/website/assets/English-PlayersGuide_v2.00-Horizons.pdf) also documents filters and cargo-dependent route preview. | A galaxy overview answers connection/range questions; a system map answers local destination questions. Route feasibility changes with cargo; the v1.01 manual also describes purchased trade/exploration data adding known information. | Show known route means and load assumptions beside the plan. A visible destination is not necessarily reachable. These older manuals do not establish today's Odyssey filter layout or visited-star retention rules. |

### Charts and ledgers: evidence does not imply a full analytics dashboard

| Code | Reference and evidence | Useful mechanism | Transfer and cost, INFERRED |
|---|---|---|---|
| RD1 | Factorio: **STATED official wiki**, [Production statistics](https://wiki.factorio.com/Production_statistics), loaded page. | Production/consumption histories, selectable resources and windows from seconds through hours/all time. Wiki warns that short samples can distort rates and dominant series compress smaller ones. Surface/quality filters qualify scope. | Separate inflow, outflow and net, name the averaging window, and default to the selected resource. Adapt the principle, not every window or factory-wide knowledge privilege. |
| RD2 | Kittens Game: **SHOWN source**, revision `781e379f79f1e7512d168849cba21ed111502644`: [en.json L767 and L1960](https://github.com/nuclear-unicorn/kittensgame/blob/781e379f79f1e7512d168849cba21ed111502644/res/i18n/en.json#L767); [game.js L2289](https://github.com/nuclear-unicorn/kittensgame/blob/781e379f79f1e7512d168849cba21ed111502644/game.js#L2289). | Display vocabulary offers percentage/per-second and per-second/per-tick choices; source sets five ticks per second. | A compact rate beside stock can be enough. Explicit unit conversion matters; a simulation tick is not a second. This inspected slice proves neither a native history chart nor runtime tooltip behavior. |
| RD3 | Evolve: **SHOWN source**, revision `3436358dcd03d9f9e071d51ea071e0a78c0322e4`: [resources.js L851-898](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/resources.js#L851). | Resource row emits a `/s` diff value, formatted through `diffSize`; a spoken label names the resource and rate. | Prefer stock plus rate for routine resource management. A history sparkline is our proposal, not a feature proven by this slice. Formatting must retain the unit and meaningful sign. |
| RD4 | Victoria 3: **STATED developer**, [DD61](https://www.paradoxinteractive.com/games/victoria-3/news/victoria-3-dev-diary-61-data-visualization), reserves/balance discussion; **STATED publisher patch text via mirror**, [1.6 notes](https://steamdb.info/patchnotes/13565420/), UI section. | Historical reserves inform compact trend treatment; negative income need not mean an unhealthy economy. Version 1.6 notes add a small price graph to each market goods entry. | Price trend beside a good is useful when choosing when/where to buy; stock and net flow remain distinct. Do not treat every decline as bad or assume old market formulas still apply. |
| RD5 | Football Manager: **STATED developer**, [FM23 Gameplay Upgrades](https://www.footballmanager.com/features/gameplay-upgrades), Data Hub/Match Analytics. Page header now brands FM27, but body is dated 18 October 2022 and explicitly describes FM23. | Scatter plots, polygons and preferred visuals support comparisons; analysts deliver selected reports. | Use a scatter plot only for a meaningful two-variable question, such as known output versus known cost across workshops. Prefer a few chosen views to a permanent chart wall. Edition and reporting source remain explicit. |
| RD6 | Melvor: **STATED indexed official wiki**, [Circlet of Rhaelyx](https://wiki.melvoridle.com/index.php?title=Circlet_of_Rhaelyx), says total Mastery is available on Statistics. Statistics page fetch yielded no usable body; the item page body also failed. | A separate statistics surface can serve inspection without consuming the main action view. Exact current categories, windows and native charts remain unverified. | Retain totals as totals. Do not turn a lifetime total into an hourly rate without dated observations. No assumption that Melvor ships sparklines or that third-party calculators are native. |
| RD7 | Paradox ledgers: **STATED original EU4 manual indexed section 5.7**, [manual](https://forumcontent.paradoxplaza.com/public/79250/EuropaUniversalisIV_Manual.pdf). | Thematic pages compare countries and show military/economic/trade information; map and ledger answer different questions. | Borrow a scoped comparison entry point for MW1, not the strategy player's broad information rights. U6 owns row/column mechanics. Different Paradox titles do not all share one ledger implementation. |

### Tensions to preserve

| Code | Evidence on both sides | Proposed resolution, INFERRED |
|---|---|---|
| R1 | Factorio favors continuity between local and remote controls (FFF380); Stellaris explicitly separates galaxy/system views (2019 director post). | Preserve selection and familiar inspection verbs, but allow explicit semantic rung switches. Smooth camera travel is a dial, not the definition of scaling. |
| R2 | DF Legends offers broad history by default but also documents a restricted-history setting; Outer Wilds grows a clue board from discoveries. | Use discovery-filtered history for character play. A lore archive is not automatically a live or omniscient world dashboard. Keep any future privileged view tied to an authorized, disclosed means. |
| R3 | Victoria 3 adds compact price charts; Kittens/Evolve show useful rates in text. | Add a chart when the shape of change affects a decision. A steady deterministic job normally needs quantity, rate and remaining duration. |
| R4 | Mudlet supports ASCII-looking grid maps through a graphics path; Qud's press kit labels its ASCII download old. | Text art is a valid proposed renderer here. Neither source establishes that current clients use text-only DOM or that text art is automatically usable by every access method. |
| R5 | Some older documents describe planned improvements; loaded DF Legends text cautions that old exports differ, and the FM article's site header changed. | Carry edition/date and proposal status with each mechanism. Do not flatten an old idea, a current wiki statement and native proof into one SHOWN gameplay claim. |

## Map palette: defaults plus dials

All rows below are **INFERRED** and stay local to U7 until root chooses to absorb
them. Their knowledge boundary applies to every dial.

| Code | Consideration | Default | Dial | Root / owner mapping |
|---|---|---|---|---|
| MP1 | Semantic zoom | Explicit Room/Reach → Town/Settlement → Region → World → known-world network. Preserve selected identity, parent breadcrumb and return. Do not shrink room labels into unreadable world labels. | Smooth zoom within a rung, explicit rung buttons, optional Body/Household or district rungs where meaningful. Do not manufacture empty rungs. | NV4; nonhuman scale |
| MP2 | One place, several readings | Geography/routes base with one selected information layer and a named legend: price quotes, known danger, control, discovery or sensory reach. Keep selection through mode changes. | Pin a second compatible layer or side-by-side reading; remember chosen layers per rung. Conflicting color encodings should not stack. | MO6 |
| MP3 | Evidence-bearing marks | Distinguish observed, remembered, reported and estimated entries with source/time. Rumor area stays approximate; unknown space has no count or secret-shaped outline. | Notes, disputed reports and uncertainty regions if evidence supports them. A purchased atlas can reveal geography without granting current occupants or prices. | MO6, MW1; means owner |
| MP4 | Text scene versus route graph | Hanzi/symbolic field where adjacency matters; room-and-exit graph or textual itinerary where connection matters. Say whether geometry is measured or schematic. | ASCII, Hanzi, box drawing, restrained graphical atlas, prose-only projection. Preserve shared target/action refs across modes. | MC9; existing wandering owner |
| MP5 | Route proposal versus action | Selecting a known node inspects it. A separate quote states actor/body, known means, load, duration and known blockers before travel/order. Drawing an edge does not authorize traversal. | Compare safe/fast/cheap routes when known; expand a special exit, carrier request or portal step. Unknown constraints remain unknown. | NV4, GP2; nonhuman scale |
| MP6 | Perceived / reachable / controllable | Show these as separate layers or labels. A tree can sense a footstep beyond its grasp; a carried blade knows its carrier's report, not the carrier's private map. | Focus an eye/member/endpoint, overlay the footprint or compare received scout coverage. Switching the view is not transferring memory or control. | MO6, MW1; nonhuman scale |
| MP7 | Cross-world atlas | Known worlds and reported connections form a graph, not an invented physical plane. Each card names the latest report and local clock; a ledger row can open its known map. | Geographic world atlas, topology/portal view or report-only world cards. Remote zoom stops at the detail actually available. | NV4, MW1 |
| MP8 | Discovery and goal maps | Keep rumor/clue links distinct from prerequisites and travel edges. Known materials, people and places can link a goal to its actual next step. | Expand a known branch or show the reported lead that may establish a missing prerequisite. Never populate hidden recipe chains with question-mark nodes from the raw recipe. | GP2, MC9 |

### What changes at each rung

**INFERRED:** this is an information ladder, not a requirement for nested
simulation grids. A room can be an existing location node and a region can be
a set of known routes. Mapping them does not create new movement gameplay.

| Code | Rung | Question and default contents | What aggregation must not do |
|---|---|---|---|
| SZ1 | Room / body's reach | What can I sense and act on here? Known exits, contacts and shared action targets. Tiny-body gaps, rooted contact and carrier position only when supported. | Treat screen distance as motor reach or enumerate unseen objects. |
| SZ2 | Town / settlement | Which known place serves my task? Landmarks, district or room groups, reported services, route summaries. | Mark every shop as live-open because the town is remembered. |
| SZ3 | Region | Which route/connectivity matters? Known settlements, paths and reported hazards; group by actual geography or links. | Let a shortest-path search use secret edges or unmeasured exact terrain. |
| SZ4 | World | Where are my known routes, obligations and reported conditions? Summarize known regions and access channels. | Make a regional price shade imply a fresh census of every market. |
| SZ5 | Multiverse | What can I know or do across worlds? Known gateways, carried access means, received summaries and separate clocks. | Sum incompatible currencies or show live off-world output without a channel. |

### Text-only sketch, illustrative and not native UI

**INFERRED MP3/MP4:** a glyph is a binding to an already qualified target, not
the target's full hidden record. Blank space means no mapped information;
it does not expose the world's total extent. `?` appears only for an actual rumor.

```text
Town: known routes                 Layer: discovery
[家 A] ──known road── [市 B] .... [村 C?]
Home                  Market       Reported hamlet

A  Visited; route remembered. Current occupants unobserved.
B  Market quote received this morning; current price unmeasured.
C  Trader's report: east of the market. Exact location unconfirmed.
Select B → inspect the shared location/action quote.
```

The dotted connection depicts the report's relation, not an executable path.
A text renderer needs cell-width discipline: Hanzi may occupy two monospace
cells and labels may vary in length. Keep a semantic label/target beside the
sketch rather than trusting alignment or glyph shape alone. U4 owns access
verification; U6 owns any long target inventory. Spatial maps, rumor graphs
and prerequisite trees should label their edge type rather than share ambiguous
lines that look like travel permissions.

## Data-view palette: defaults plus dials

| Code | Consideration | Default | Dial | Root mapping |
|---|---|---|---|---|
| DV1 | Stock, flow and rate | `Stock 120; net +6 per played hour; observed over last 2 hours`, if known. Name the owner, unit, source and clock. Distinguish observed average from a quoted steady-state rate. | Inflow/outflow breakdown, per-minute/per-hour/per-day units; retain the same quantity semantics. | IN2 |
| DV2 | Quiet trend | Optional sparkline beside a selected or pinned changing value, with window and endpoint numbers. Omit when no meaningful history exists. | Expand to a labeled plot, flat trend text or no chart. A sparkline has no authority to fill missing samples. | MC9, IN2 |
| DV3 | History windows | Selected local job or session window first. Offer recent hour, day/season and available history only where the supported clock and stored evidence make sense. | Player-selected window; event markers for known interventions. Show bucket width and gaps; do not invent all-time history retroactively. | IN2, MW1 |
| DV4 | Economic decision | In the selected good/place view, pair current known quote, quote age, stock, observed net flow and a next useful action. | Price-history plot, known-market comparison or supply-route layer. Compare landed cost only when fees, quantity and travel means are known. | IN2, MO6 |
| DV5 | Scale-aware comparison | Compare one selected series or a few commensurate series; quantities have common units and shared labeled axes. Use totals/bars for one-off counts. | Normalized percentage, separate small plots or explicit log scale for positive magnitudes. Zero/negative/undefined/non-finite values get explicit treatment, not silent clipping. | IN2 |
| DV6 | Remote ledger | Each world/business row shows last received stock/rate/report time and connection state. Unknown current values stay unknown. | Pin a received chart; align local histories only with known clock conversion. No global sum of unrelated monies, XP systems or eras. | MW1, IN2 |
| DV7 | Observations versus forecast | History uses actual permitted observations; estimate is labeled separately with assumptions, caps, pauses and expiry. A known cost or completion target may supply a threshold line. | Confidence range and scenario comparison when the character has the required appraisal/planning means. Opening the plot is not a free scan. | GP2, IN2 |
| DV8 | Useful drill-through | From a stock/rate/price, open the known causes, producing job, supplier or goal input. Keep the selected place/resource. | A bounded flow/prerequisite sketch of known dependencies; reveal alternative methods only through existing knowledge. | GP2, MO6 |
| DV9 | History cost | Start from existing receipts/reports. Any future sampler stores bounded summaries for opted-in useful metrics, with source and clock qualifiers. | Longer history or finer samples for selected values, subject to an explicit storage/performance decision. Do not add one polling loop or unbounded series per entity. | MW1, IN2; engine lane owns implementation |

### Rate per hour needs a denominator

**INFERRED DV1/DV3:** `+6 per hour` can mean per hour of active work, elapsed
played time, wall time or a local world's clock. These are different measures.
A two-hour job producing 12 units has a quoted active rate of 6/hour. If it
spent one of the last two hours paused and produced 6, its observed elapsed
rate is 3/hour. Neither implies that another 6 will appear while the browser
is closed. Keep existing absence/offline policies intact.

Observed net flow should use permitted inflows minus outflows over the stated
window, not only `(ending stock - starting stock) / duration` if a purchase,
transfer or sale occurred. Show manual transfers separately when recorded;
otherwise label the result stock change, not production. A capped store can
have zero stock growth while a job still produces or wastes output. Gross,
usable output and net change answer different questions.

When the observation method supports only coarse impressions, use `stock seems
to be rising` rather than precise numbers. Reports can be sparse or stale;
draw gaps instead of interpolating secret activity. Viewport width, tooltip,
legend, totals, min/max, cluster counts and export all use the same filtered
evidence. Even a total can reveal a hidden business or destination.

### When a chart earns space

| Code | Player question | Default view, INFERRED | Why / clutter boundary |
|---|---|---|---|
| CH1 | Is this known reserve being exhausted? | Stock, net rate, qualified time-to-empty; expand history if flow varies. | A steady rate needs little ink. A curve helps with seasonality or interruptions only when those observations exist. |
| CH2 | Did the change I made improve output? | Before/after history with the known change marked; inflow/outflow detail on demand. | Shape and timing help diagnose; correlation does not establish the cause. No extra background monitoring means is invented. |
| CH3 | Where/when should I buy this good? | Known local quote plus age; selected price history or map layer on demand. | Trends aid timing and location choices. A stale quote is not a live buy price, and raw engine forecasts must not leak. |
| CH4 | Which workshop or method suits me? | Compact commensurate comparison; optional output-versus-cost scatter plot. | Two-variable tradeoffs can justify a plot. A radar polygon for arbitrary stats adds interpretation cost and can hide units. |
| CH5 | How much have I done? | Named total and period. | Melvor/ledger-style inspection does not need a curve unless there is a temporal question and genuine history. |
| CH6 | How are things doing elsewhere? | Qualified MW1 report rows; select a row for its available history. | Six live-looking lines from six unknown clocks would falsely imply continuous remote knowledge. |

## Root reconciliation and placement

| Root code | U7 extension | Boundary retained |
|---|---|---|
| NV4 | MP1/MP5/MP7: explicit semantic rungs, preserved focus, per-rung summaries. | Means limits apply at every range; maps do not force a new spatial simulation. |
| MO6 | MP2/MP3/MP6 and DV4: one view, named information layers. | A layer filters permitted evidence; it is not an appraisal upgrade. |
| MC9 | MP4/MP8 and DV2: text fields, route trees and tiny trends. | Text-first can retain graphical options. Glyph art is presentation, with U4 access proof still separate. |
| MW1 | MP7, DV3/DV6/DV9: report-qualified worlds, histories and clocks. | Remote possessions, current observations and execution authority remain distinct. |
| IN2 | DV1/DV3/DV5: stable quantity semantics, units, time base and special-number treatment. | Formatting does not add precision or legitimize cross-world sums. |
| GP2 | MP8 and DV7/DV8: known prerequisite links and target lines. | Route, clue and prerequisite edges remain distinct; hidden alternatives stay hidden. |
| Nonhuman scale owner | MP1/MP5/MP6: body-relative reach, routes and focused endpoints. | Footprint, sensory coverage, motor reach, command seat and received member knowledge are separate. |

**INFERRED placement:** adapt the existing Location/Reach surface for local
map/list switching, retaining one action quote and current-work surface. At
1366x768, use a selected local scene or graph, not a permanently expanded atlas
plus several charts. At 1920x1080, an independently useful regional map or
selected economic history can sit beside local actions. Both sizes keep readable
text and the player's arrangement; these are intentions, not fitted layouts.
Atlas/known-world graph belongs behind the existing navigation/inspection home.
Rate details belong to the selected job/good, while MW1 provides remote reports.
No new Maps, Prices, Production and Statistics panels are required by this lane.

## Ranked disposition and open gates

These are proposed dispositions, not requests to implement every family.

| Code | Rank / disposition | Why and concrete cost |
|---|---|---|
| A1 | First, adapt MP3 + DV1 + DV6 | Knowledge/time labels keep every scale honest. Cost: qualified evidence consumers and clear clock/unit semantics, not chart art. |
| A2 | Next, trial MP1 + MP4 using existing location/action refs | Gives the confirmed text-field preference a useful place without making map design a gate for ordinary gameplay. Cost: renderer/binding/selection work and rebuilt desktop proof. |
| A3 | Then, trial DV2/DV3/DV4 for one varying resource or good | Prove that history changes a real player decision before spreading charts. Cost: bounded evidence history, missing-data treatment and layout testing. |
| A4 | Retain MP2/MP5/MP6/MP8 and DV7/DV8 for supported means | Overlay/route/prerequisite utility grows with actual mechanics. Cost: known constraints and edge semantics; no free sensing or remote control. |
| A5 | Park broad animated multiverse atlases and dense analytics suites | Keep them reachable if later gameplay makes them useful. Cost today would be geometry, report/clock joins and storage with little verified consumer value. |

| Code | Open evidence or decision | Proposed observable check, not run |
|---|---|---|
| Q1 | Exact current CK3 modes, Elite filters, Melvor statistics and Qud renderer behavior lack native inspection here. | If one exact control becomes an implementation dependency, inspect that named edition through a permitted route. Do not turn this into a broad gameplay research gate. |
| Q2 | Which metric has genuine changing history and an actual in-world observation means? | Select one supported local economic decision; confirm the chart reveals useful timing that a number alone misses. Root may choose later; no user question is required now. |
| Q3 | No current fit or selection/route-map proof. | Rebuild and exercise fresh origins at both target desktop viewports: switch rung/mode, inspect a target, return, keep quote/work readable; no hidden knowledge appears. |
| Q4 | Future persisted map notes/history could change save compatibility. | Owning implementation must decide retention/migration, then save/reload/import selected notes/history and old saves. Documentation alone creates no schema obligation. |
| Q5 | Sparse remote/nonhuman evidence can be mistaken for live control. | Disconnected scout, lost sense, body-size change and stale price report keep remembered facts but remove unsupported current claims; execution rechecks actual means and route. |

Documentation delivery is complete. Gameplay, fit, persistence and director
acceptance remain unimplemented/unrun, not failed. No mobile gate is introduced.
