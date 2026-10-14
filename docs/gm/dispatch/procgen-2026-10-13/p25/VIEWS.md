# P25: Stories workspace, timelines and authored maps

2026-10-14. **PROPOSAL ONLY.** Extends root E3 and T2. [EPISODES](EPISODES.md) owns the P25 editorial extension. [P14](../p14/) supplies chronicle editions; [P12](../p12/) supplies thread structure; [P24](../p24/) supplies knowledge/perspective/time interpretation; [P13 RULES](../p13/RULES.md) supplies source/branch qualification. Views are pure projections. Filtering, sorting, reading and switching view cause no gameplay action or draw.

## E3.1: one Stories tab with several reachable readings

Propose Stories as an existing Notebook destination, with **Episodes**, **Threads**, **Timeline**, **Map** and **Hero page** subtabs. Full history is reachable from a feed row or episode, and the live response remains in its owner panel. Keep ongoing, concluded, interrupted, abandoned and disputed states distinct; **finished chapter** is not **finished quest**. A story list can contain quiet home/work threads alongside conflicts and power progression.

Shared persistent scope bar: world instance, life, branch, known interval, observer lens and provenance. Proposed filters: person, place, thread, state, receipt/account/annotation, source continuity and newly learned versus occurred. Compose filters with AND across categories, OR within selected values. Reset filters is always visible. Chips and facets are computed only after disclosure projection; hidden records do not change counts, suggestions, empty messages, search snippets or sort position. No **17 hidden events** placeholder.

Observer lens defaults to current-character knowledge. Optional player-journal comparison uses only authorized player-known records and is visibly labelled; it cannot grant character or NPC knowledge. Director inspection belongs to [P22](../p22/), not a permissive toggle in Stories. Forecasts/dreams use P24's semantics and appear separately from occurred facts. Player notes are labelled annotations, excluded from causal proof and from export unless explicitly included and scanned.

```text
1366x768: Stories  [Episodes] [Threads] [Timeline] [Map] [Hero page]
World/instance [v]  Life [v]  Branch [v]  Lens [v]  [Reset] [Export preview]
+-------------------+------------------------------------+--------------------+
| Known filters     | Threads                            | Selected thread    |
| Person [v]        | Open     Cart repair               | Cast: known names  |
| Place  [v]        | Disputed Credit for the repair     | Started / observed |
| Status [v]        | Quiet    Workshop practice         | Summary + basis    |
| Search [_______]  | Concluded A funded delivery        | [Timeline] [Map]   |
|                   | rows scroll; selected row stable   | [Current controls] |
+-------------------+------------------------------------+--------------------+
```

At 1600x1000 show a roomier preview and more rows, rather than more navigation layers. Keep filter/list/detail visible together. Long names wrap, and independent pane scroll does not move routine navigation out of reach. Keyboard access, comfortable contrast, text labels plus color and reduced-motion settings are requirements for a selected builder, not claims about these sketches.

## T2.1: a timeline is a record of order, not a prophecy

Default to a vertical readable **Story so far** list. Optional horizontal lanes group threads/known people/place history. Known events use occurrence time; a **Learned** lane shows receipt arrival. Uncertain dates display intervals or partial order, not fake exact ticks. Cross-world clocks occupy separate labelled lanes, linked by actual crossing receipts. Zoom changes reading granularity only: episode → day → individual receipt.

```text
Timeline: [Occurred v] [Local clock v] [Day < >] [List | Lanes]
Thread             local 08h       09h        10h          11h
Repair             o accepted ----o supplied ------------o finished
Received accounts                              o disputed claim received
Practice           [ supported interval ]
Selected: finished   SHOWN R17   [Basis] [Episode] [Authored place]
```

Use a causal connector only for retained cause refs. A chronological connector is labelled **later**, not **because**. A source graph future event remains an expected event under a qualified foreknowledge route, never an occurred node. Unknown future events stay undrawn, including unlabelled branches that would reveal their number. An unobserved disruption cannot show a failed canon event or divergence magnitude. Link the [intro TA/TB/TU/TX/AH/BR/DV/OT rounds](../../../../INTRO_FLOW_CONSIDERATIONS_2026-10-13.md#round-10-story-world-timelines-and-branches-2026-10-14) for branch atlas/diff proposals rather than implementing branch creation from this view. Viewing a fork is distinct from entering it or performing in-fiction time travel.

## T2.2: pins on authored geography

Attach known receipts to authored node IDs, coordinates if supplied, or an authored schematic. P9/P10 authored-geography constraints remain binding. This surface generates no topology, new route, dungeon room, canon landmark or coordinates from prose. A place label is not enough to determine distance or direction. A filter for a person uses last observed/reported place, dated and attributed; it is not live tracking.

```text
Map: authored local schematic   [Place] [Person] [Thread] [Interval]
+------------------------------------------+--------------------------+
| Village o----------o Forest road         | Known places / pins      |
|         |           2 visible accounts   | Village: repair R17      |
|       Shack o                            | Road: dated report C2    |
| Authored connections only                | [Open receipt]           |
| Selected pin outlined + text label        | Location basis: reported |
+------------------------------------------+--------------------------+
```

Synthetic sketch, not a claim about actual coordinates or connection direction. Cluster visible pins by authored node/time window; cluster counts use only safe projected records. Keyboard list mirrors pins and works without SVG/canvas. Show a travelled path only when travel receipts retain real node transitions; gaps remain gaps. Never infer a route from two endpoints or label speculative passages traversable. Remote news may pin where an event is reported to have occurred, with uncertainty, not where an NPC must currently be.

## E3.2/T2.3: common degradation

| Missing input | Stories / timeline / map behavior |
|---|---|
| No P12 sifter | Receipt journal and ungrouped episodes remain available; Threads explains **No grouped thread recorded** |
| No known cast relation | Omit graph edge; known display name is not proof of friendship or kinship |
| No dates/mapping | Stable producer order; **date not retained**; no duration comparison across clocks |
| No authored coordinates | Authored schematic if supplied, otherwise accessible place list; no procedural placement presented as geography |
| No known place on a receipt | **Place not recorded**, timeline still works; no automatic hero-location backfill |
| All safe results filtered out | **No matching recorded entries** and Reset; never disclose suppressed records |
| Compacted history | Known aggregate range marked **summary only**; disable exact event/route zoom |
| Dormant branch/missing pack | Read-only approved retained summaries; unavailable actions labelled; no guessed source revision or ghost replay |

## T2.4: future gates

All OPEN: pure preview/filter/search with unchanged RNG/state; provenance and lens on every pane; same-name and cross-branch actors remain distinct; uncertain-order/clock boundaries honest; nonexistent geography cannot become a route; hidden-only mutations do not change facets/counts/search/layout; keyboard pin-to-list parity. Rebuilt 1366x768 and 1600x1000 must show filters, selected content and a useful current control without page-spanning text or focus loss. Saved scope preferences are optional additive metadata, with old-save compatibility and failed-write/import proof if implemented. Human readability and branch navigation acceptance remain separate. Exports use [U0.2](EXPORTS.md#u02-one-export-gate-for-every-format).
