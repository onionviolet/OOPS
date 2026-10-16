# Part 9: spatial overview, scope and showcase proposal

2026-10-16. **Planning only.** Weibao requested a specific focus on Part 9,
then clarified: “No implement, but the improve and scope direction better”.
This document refines the proposal; it dispatches no implementation or prototype.
The recommendations below remain unaccepted. Existing runtime ownership is unchanged.

Follow-up, 2026-10-16: Weibao requested a more concrete showcase, how maps,
people, activities and travel fit together, variation across worlds, future
expansion and book-world fit. The sections P9J–P9X below extend the planning
proposal only. No additional gameplay or source adaptation is selected.

Further planning: [room-to-world walkthrough, panel allocation and large-scale
execution considerations](part-9-room-to-world.md) develops P9H/P9U/P9L/P9T/P9G.
It preserves this document's bounded first slice; planetary complexity is a
future direction, not a prerequisite or implementation claim.

## Direction in one sentence

**P9D1, proposed:** make Around you a readable sense of place: where I am,
what is here, which known places connect to it, and what I can deliberately do next.
The representation should add atmosphere and make those choices easier to understand.

Authority: [USER_VISION](../../../../USER_VISION.md),
[UI_RULES](../../../../UI_RULES.md), and the latest
[Part 9 brief](../NEXT_PARTS_2026-10-15.md#map-lanes-folded-2026-10-16).
Research detail remains in [AW](around-you.md) and [AS](around-you-sims.md).
Their static studies demonstrate proposals, not native gameplay.

## Findings that change the scope

| Code | Evidence and interpretation | Consequence |
| --- | --- | --- |
| P9F1 | **Stated:** NEXT_PARTS Round 12 corrected “math” to map/representation, and its latest brief proposes a known-place graph. **Inferred:** the player outcome is still less definite than the representation catalogue. | Judge the map by orientation, inspection and deliberate action. A graph is a candidate way to achieve that outcome. |
| P9F2 | **Stated:** USER_VISION's “Hanzi-field preference” endorses its appearance; its later “Original-screen screenshot and map necessity” entry questions added complexity. [Existing scope review](../../../../WANDERING_ZONES_AND_INSIGHT.md#map-scope-and-timer-driven-first-integration-2026-10-02) separates appearance from spatial simulation. | Preserve a Hanzi treatment as a serious comparison. Neither the earlier enthusiasm nor later concern chooses the final layout or requires tile movement. |
| P9F3 | **Stated:** `src/models/location.js:169` onward provides named connections and travel metadata; `src/village_workspace.js:152` onward renders nearby subjects and place prose. AW16 records missing universal geometry/presence inputs. | A connected-place overview has a concrete starting point. Local landmarks need supported anchors; service entries must not masquerade as physical objects. |
| P9F4 | **Stated:** `src/display.js:2733` onward presents travel using computed path times; `src/main.js:3307` onward applies conditional running adjustment, rounding and stamina effects in an admitted travel branch. | Quote and execution need a focused reconciliation before a native map can promise exact cost. This planning pass neither fixes nor proves a universal mismatch. |
| P9F5 | **Stated:** AW17 and AS19–AS22 already distinguish spatial inputs, knowledge filtering, navigation and desktop fit. **Inferred:** repeating them as new systems would enlarge Part 9 without improving its first use. | Consume existing disclosure, actions and navigation. Add only the missing bounded adapters when implementation is separately authorized. |

## The first slice and the larger direction

**P9D2, proposed first slice:** Village and one legitimately available adjacent
route, with a readable summary of the people/services already exposed there.
The same selected destination appears in diagram and list. Selection opens
details; a separate labelled command performs native travel or work. Start with
one-hop inspection and travel. A larger display must not silently add multi-stop
execution, itinerary scheduling or remote interaction.

| Code / scale | Player question | First-slice boundary | Expansion trigger |
| --- | --- | --- | --- |
| P9S1, here | Who or what can I deal with here? | Existing public people/services and place prose, with a clear inspection route. A schematic grouping is allowed if labelled as such. | Add an authored scene when real anchors or a clearly schematic composition improve recognition. |
| P9S2, nearby | Where can I go, and what does going there mean? | Known adjacent connections, current-place marker, selected destination detail and explicit native action. Expanded area view uses the existing center controller. | Add broader browsing when the disclosed network exceeds the useful neighbourhood. |
| P9S3, region/world | How do these areas fit together? | Preserve as future direction; no atlas requirement in the first slice. | Existing region/geography/discovery owners and a real player task justify the scale. Cross-world entry remains means-dependent. |

Desktop targets: **1366×768 at 14/21px and 1920×1080 at 21px**.
Around you stays in its appropriate local pane; a deliberately opened area map
uses the shared center-mode controller. Reports keeps its full region. Larger
text reduces simultaneous content, not text size. Mobile remains deferred.

## Appearance: a bounded comparison with a recommendation

**P9D3, proposed:** compare the same disclosed places, labels, selection and
commands in these three treatments. Reuse the existing AW/AS studies as inputs;
do not commission another broad reference survey. A future comparison is a
separate authorized step, not work launched by this document.

| Code | Treatment | What it could win | What the comparison must expose |
| --- | --- | --- | --- |
| P9V1 | Clear labelled route diagram, restrained lines and a strong current-place anchor | Fast orientation and visible relationships | Whether diagram space earns its cost relative to a well-organized list, especially at 21px. Positions are schematic; no compass or measured distance without data. |
| P9V2 | Ink/Hanzi treatment of the same route diagram, with readable names and a selected-place text summary | Distinctive text-first atmosphere consistent with the user's visual interest | Whether unfamiliar glyphs or decoration slow recognition. Glyphs supplement names; no terrain grid, moving actor or implied walkable field is required. |
| P9V3 | Grouped place list with the same current/nearby distinction and selected detail | A strong accessible baseline and dense-state fallback | Whether relationships are equally understandable with less screen area. Keep it first-class even if a diagram wins. |

Recommend **P9V1 as the structural baseline and P9V2 as the expressive candidate**.
This is an agent recommendation, not a selected product default. Proto23 frames,
gutter rhythm, typography roles and semantic colors stay coherent across them.
World-specific art may change the inner treatment without changing what a click means.

Do not compare a lavish invented forest against an empty list. Match disclosed
content, text size, shell and task. Assess pleasure of place as well as speed:
does the representation feel worth keeping on screen after its first impression?

## Showcase: one journey, five beats

**P9D4, proposed:** the showcase should tell a connected story. These are
storyboard requirements for a future comparison, not claims of executed behavior.

| Code | Beat | What the player should see or understand |
| --- | --- | --- |
| P9B1 | Arrive in Village | A clear “You are here”, concise place identity, known people/services and a readable nearby route. Routine work, You and Reports remain recognizable in the full shell. |
| P9B2 | Inspect a known neighbour | Selection highlights the same destination in diagram/list; detail names the destination and public route consequences. Inspection preserves work and does not travel. |
| P9B3 | Decide whether to go | A distinct native command states the applicable time and other supported costs. Hostile entry explains that it starts native combat where that is the actual rule. Cancel returns to the unchanged selection. |
| P9B4 | Arrive and do something useful | Current-place context changes after actual travel; existing local action or combat takes its appropriate surface. The map does not become a second combat board or a remote-work menu. |
| P9B5 | Return and find your place | Navigation Back restores the originating view; physical return uses a real travel command. Selection/scroll restoration works where meaningful. The player can tell those two returns apart. |

Use the same five beats for each treatment. Include a laptop large-text frame,
a longer label/dense neighbourhood, and a route that becomes unavailable after
selection. Use supported native states for the ordinary journey. Any illustrated
future cue, landmark or lens must carry a visible **concept-only** label.
No synthetic Perception scan or secret doorway is needed to make the showcase interesting.

Future review records: recognizable current place, correct first destination,
wrong turns, clicks/keyboard steps, visible useful content, and restored context.
An agent walkthrough is provisional; Weibao judges appearance and feel.
If the graph helps neither orientation nor atmosphere over P9V3, retain the list
and revise the diagram before expanding it.

## Concrete showcase: Village, a known cave and useful work

**P9J1, proposed storyboard, not executed:** choose an explicitly post-unlock
review state: the player knows the Village–Nearby cave route and has unlocked
the cave's ordinary mining activity. `src/data/locations.js:562` defines the
Village connection with 60 base minutes; `:565–598` defines Cave room, its clear
reward unlocking mining, and the separate entrance-to-room connection;
`:2095` onward defines the ordinary ore activity. These are source facts, not a
claim that the current UI exposes every intended interaction. Quote actual
travel through the admitted native owner; do not advertise 60 as universal cost.

| Step / code | Map and selected details | People, activity and action | What remains unchanged |
| --- | --- | --- | --- |
| P9J2, orient in Village | Village is current. Nearby cave is a known neighbour. Compact local subject entries and the place prose share the place context. | Inspect a currently disclosed Village person, such as the native elder when available. Show actual available native conversation options; inspection does not speak. No invented mining tip, new quest or reward is required. | The current destination marker, inventory, work and Reports. |
| P9J3, choose the cave | Select Nearby cave. Detail identifies it as the entrance, shows received information and the current travel quote. Known mining can appear as an available source there only if prior knowledge supports it. | `Travel to Nearby cave · <evaluated time>` is separate from selection. A record for a person last seen there would be labelled as a last-seen record, not a promise of current presence. | The player is still in Village. No remote mining or free survey occurs. |
| P9J4, arrive at the entrance | After committed travel, Nearby cave becomes current; Village is a return destination. Cave room is a distinct combat-entry choice, not a decorative room inside the mining node. | Local work exposes the existing unlocked mining action. Opening its detail shows evaluated native duration/yield disclosure and actual requirements. Entering Cave room deliberately invokes its native combat rules instead. | Reports retains the journey; the map has not converted combat groups into physical rooms or guaranteed safety for the whole cave. |
| P9J5, work at the source | Selecting mining highlights the chosen work entry. An actual vein anchor may be used if authored; otherwise show a labelled work entry without a made-up location. | A separate native start command begins mining. Current work shows its true progress and Stop path. Opening the map or inspecting ore does not stop the job. Outputs reach native inventory through the native activity. | No second gathering timer, new stock pool or countdown animation implying the player is walking. |
| P9J6, use the result and return | Inspect obtained ore in Inventory. A source link can return to the known cave context if that link is supported. Back returns from Inventory to the prior view; it does not move the player. | The next useful consumer is an actually known recipe, trade or project, where registered. Travel to Village uses a new evaluated native command and discloses any work interruption. | Ownership, costs, local access and recipes remain with their existing systems. No automatic sale, commission or delivery is invented. |

This expands the five-beat showcase into a concrete source-backed example; it
does not make all six rows separate implementation milestones. A fresh opening
is a second review state: omit the unlearned route/work rather than showing the
post-unlock layout through disabled placeholders.

**P9J7, proposed composition:** the compact Around you pane carries the current
place, brief atmosphere, local subjects and a nearby-map opener. Local subject
inspection takes the appropriate Focus scope with a local return. An expanded
area view gives the diagram/list most of the available task region and a
selected-destination detail area. At 21px, prefer a stacked selection/detail
composition if side-by-side labels become cramped. Current work and Reports
stay visible. Do not repeat a full action menu inside every map node.

**P9J8, proposed relationship rule:** a place contains or hosts work sites and
services; a person may be present at that place; an activity targets a place,
site, person or resource through its actual owner; a route connects places.
Selecting any representation resolves to the same subject and allowed actions.
`Work available here`, `this person offers work`, and `this resource can be
worked` are distinct relationships. A diagram may summarize them without making
them all geographical destinations or inventing a physical Projects building.

## An expandable world representation

**P9W1, proposed:** represent a world as connected places with persistent
relationships, then choose the appropriate view for the current task. A world
may include geography, institutions, interiors, routes and unusual spaces.
No single picture needs to contain all of them. This extends the separation of
truth, observer knowledge and representation already recorded in USER_VISION
and the [representation discussion](../../../../gm/REPRESENTATION_DIRECTION_DISCUSSION_2026-10-15.md).

Reuse the identity and continuity distinctions in
[campaign authoring](../../../../worlds/CAMPAIGN_FRAMEWORK.md#frozen-authoring-interface-v1)
and the connection/coverage proposals in
[multiverse structures](../../../../worlds/MULTIVERSE_STRUCTURES.md#minimal-new-authoring-records).
Those documents mix dated proposals and later receipts; this section makes no
claim about their current runtime completeness and proposes no replacement schema.

| Code | Preserve as a distinction | Why it matters when expanding |
| --- | --- | --- |
| P9W2 | World/source family, actual history or instance, and this particular place | Two similarly named schools or towns in different histories cannot share people, debts, discoveries or selections accidentally. Returning to the same history is distinct from entering a fresh version. |
| P9W3 | Containment, connection and geometric position | A school can contain rooms; a route can cross a border; a doorway can lead to an interior whose size differs from its exterior. A diagram needs connections, a geographical map needs coordinates, and a scene needs anchors. One input does not establish the others. |
| P9W4 | Person, institution, service and physical site | A school remains when a teacher leaves. A merchant can move while a shop stays. Membership can grant access without changing geography. An institution may occupy multiple sites. |
| P9W5 | What exists, what is known, what is reachable, and what the current build resolves | A known capital can be background setting; an actual playable district can be inaccessible to this character; a hidden room can exist without a UI trace. These are different states, not one locked/unlocked flag. |
| P9W6 | Presentation layout, actual location, observations and historical changes | Moving a node on screen does not move a building. A remembered witness location does not track the witness. Expanding content must preserve actual visits, goods and consequences according to existing owners. |

**P9W7, proposed expansion pattern:** begin with a meaningful place and useful
connections. Add depth inside that place or breadth to another place when it
supports a journey, relationship, pursuit or discovery. A regional summary can
later open a detailed district without renaming the existing place or replaying
its arrival rewards. Keep coarse and fine geography compatible: an old “travel
across town” action may remain an abstract journey while a selected district
gets more detail. Do not turn every coarse route into mandatory room-by-room
walking. Existing travel commitments retain their quoted semantics.

A common browsing ladder can be `world → region → settlement → site → room`,
but levels are optional. A small realm might expose only a few sites; a ship
might expose decks; a nongeographic realm might expose linked domains. Back
means previous view; `Exit building` or `Return through gate` means an action.
Do not force this browsing ladder onto the travel model.

**P9W8, proposed authoring economy:** a place contributes its identity/prose,
supported local subjects, legitimate routes and existing work. Optional inputs
add anchors, coordinates, art or specialized display rules. Known subject/action
bindings should survive changing from list to diagram to illustrated scene.
A new world need not author every optional input or implement a universal
map specification before it can support ordinary play.

## Book-world fit: source geography and a lived branch

**P9K1, ACCOUNT FOR NOW:** author from a declared source/edition/range and era;
keep verified source anchors, inferred relationships, original connective
detail and unresolved questions distinct in authoring records. The
[lore/continuity owner](../../../../worlds/LORE_AND_CONTINUITY.md#evidence-vocabulary)
already supplies that vocabulary. A novel naming two places does not establish
their street plan, precise journey time or compass bearing. Use a schematic
connection and a labelled original gameplay choice where necessary. Research
only a specific fact whose answer changes the selected experience.

**P9K2, ACCOUNT FOR NOW:** source uncertainty is an authoring issue; player
uncertainty is an in-world knowledge issue. Do not turn missing research into a
player's mysterious `?` location. Conversely, a fully researched secret stays
absent until its proper discovery route. Spoiler-sensitive lore/source labels
belong in authoring records, not automatic player tooltips.

**P9K3, ACCOUNT FOR NOW:** the book's baseline and the player's current history
can differ. A familiar character's future scene is not a live map appointment.
Show a current marker only through a legitimate presence/report owner. Known
events can alter access, inhabitants or routes after supported consequences;
do not make an atlas enforce the book's future. Returning to another era or a
parallel version must not silently substitute its people for prior acquaintances.

**P9K4, proposed coverage policy:** distinguish three authoring coverage levels:
background setting; inspectable/communicative representation; and supported
playable interaction. These are coverage descriptions, not a mandatory new
runtime enum. A background city may be honestly named in a received text without
offering a working travel button. If the player can commit to entry, its selected
arrival, useful interaction and allowed return must resolve through actual owners.
Do not disguise unfinished content as a fictional lock that misleads the player
about what they can unlock. State scenario boundaries before commitment when
needed, consistent with existing world-entry and coverage policy.

**P9K5, proposed book-world place brief:** a future author needs only a compact
answer to these five questions for the chosen locality, linked to existing world
owners rather than copied into a competing master specification:

1. Which source/era/history and actual place is this, and which details are original?
2. What makes life here distinctive: people, institutions, work, atmosphere and pressures?
3. How can this character learn about, reach, enter and leave it with their actual means?
4. Which meaningful actions and consequences resolve now, and which remain background?
5. What does returning preserve, and where could the next useful connected detail fit?

## Variation across worlds: change the logic as well as the look

**P9X1, proposed design examples:** the rows below are illustrative adaptation
directions, not claims of canon accuracy or selected content for these worlds.
Named source-family examples still need their local source/era owners before
specific places, methods or restrictions are authored.

| Code / world type | Representation | How people, work and access change | Expansion opportunity |
| --- | --- | --- | --- |
| P9X2, occult-city investigation, potentially a source-qualified LOTM locality | District/street connections; local scene for a known office, shop or meeting place; dossiers separate from live presence. | Information may come from contact, records or testimony. A known venue need not reveal its meeting schedule or attendees. Investigation, ordinary employment and trade link to their actual owners. | Deepen a known venue's contacts and useful services, then connect another district. No supernatural census or hidden gathering marker by default. |
| P9X3, academy, potentially a source-qualified Harry Potter locality | Building/site diagram and appropriate room details; known timetable shown separately from geography. | Room existence, permission to enter, class availability and a particular teacher's presence are distinct. Lessons, study, social interaction and preparation form different work routes. | Add a library or workshop as a useful site; detailed corridors only when a navigation or encounter decision benefits. No compulsory walking simulator. |
| P9X4, original cultivation setting | Regional ink/Hanzi route map, settlement or sect-site scene, specialized resource/condition overlays only when legitimately supplied. | Institutional access, learned harvesting methods and actual travel means can change choices. A spiritual perception ability reveals only the facts its rules grant. | Add a cultivation site, trade circuit or nested interior with explicit access and return, without requiring every region to be a terrain grid. |
| P9X5, ship or space setting | Deck/interior plans where geometry matters; system/transit graph at large scale. | Crew presence, repair sites, supplies and transport schedules use their own owners. Remote communication differs from physical travel and remote operation. | A ship interior can gain detail while inter-system travel remains abstract. Cargo, passengers and return capability follow actual transport rules. |
| P9X6, dream, pocket realm or other nongeographic space | Explicit transition graph, meaningful symbolic scene, or a list if that communicates the rules best. | Doors/connections can depend on a real method, condition or established world rule. A way in does not establish a way out or permission to bring a body, companion or item. | Add domains or conditional passages while keeping their continuity and clock rules explicit. Do not invent hidden dynamic routes just to animate the view. |

**P9X7, ACCOUNT FOR NOW:** travel methods can change the represented network.
Walking, transport, flight or an exceptional passage may offer different valid
connections, costs, bodies/cargo and return conditions. Show a method selector
only where multiple supported methods actually exist; otherwise one truthful
command is enough. More power need not mean only a smaller number beside the
same edge. Do not invent tolls, suppression or hazards to cancel earned means.

**P9X8, ACCOUNT FOR NOW:** presence and time rules must remain scoped. Looking
at a distant world does not advance it or move attention/control there. A live
marker, a dated observation and a predicted appointment are distinct. Inactive
worlds and important choices follow their existing accepted clock policy;
planning a map introduces no offscreen simulation or universal shared sight.

## Keep expansion useful and bounded

| Code | Consideration | Disposition |
| --- | --- | --- |
| P9A1 | A known workplace with a person, an action, a useful result and a reason to return teaches more than an atlas of inert destinations. | ACCOUNT FOR NOW: evaluate connected loops and recurring relationships, not just node count. Preserve multiple ordinary and extraordinary paths as future consumers. |
| P9A2 | New authored detail can refine an existing site, but adding a previously hidden room is different from revealing it, and different again from constructing it in play. | ACCOUNT FOR NOW: distinguish content revision, discovery and causal world change. No automatic re-scan, rewritten history or reward replay. |
| P9A3 | Large networks need scoped browsing, stable ordering and selected-route focus; a giant graph or badge for every task will drown the place. | ACCOUNT FOR NOW: show one purposeful layer at a time, contextual links and readable list access. Pins remain with their existing owner. |
| P9A4 | A book expansion or removed pack can change which records are available. | ACCOUNT FOR NOW: preserve stable subject/history references; unavailable content gets an honest safe state through the existing compatibility owner. No silent remapping to a similarly named actor or new instance. |
| P9A5 | Detailed terrain, route scheduling, independent moving populations, remote automation and multi-body maps could support later play. | LATER: select each for a concrete player choice and verified owner. They are neither first-slice gates nor implementation tasks from this discussion. |

Planning-pass completion means a concrete connected storyboard, a reusable
world-authoring direction and honest boundaries for book-world expansion.
It does not mean these world variants, UI interactions or integration contracts
have been implemented or proven. The first native slice remains P9D2.

## Subtle interactions to account for

| Code | Constraint / opportunity | Disposition |
| --- | --- | --- |
| P9C1 | Filter undisclosed places before layout, counts, accessibility text and bounds. Show a cued unknown only when a real received cue supports its existence. Publicly named unavailable routes may explain their legitimate restriction. | ACCOUNT FOR NOW. No new knowledge ledger or generic fog system. |
| P9C2 | Separate availability from knowledge. Remote person/service inspection may show received information; it cannot imply current presence or authorize using the service from afar. Old testimony does not update from hidden truth. | ACCOUNT FOR NOW. Keep per-fact provenance when the existing owner supplies it. |
| P9C3 | Keep current place distinct from inspected destination. Ordinary tick updates do not move targets; a disappeared/blocked selection gets an explanation and revalidation at execution. | ACCOUNT FOR NOW. Future route quotations need an owner and a clear refresh policy. |
| P9C4 | Navigation and physical travel have different consequences. Opening/closing the map preserves the existing simulation policy; it neither pauses time nor cancels work by itself. Traveling may interrupt work through native rules, which must be disclosed. | ACCOUNT FOR NOW. Inspect relevant close callbacks before integration. |
| P9C5 | Activity availability is not resource stock, cave clears are not surveyed terrain, and drawn proximity is not cheap travel. Directional edges and different return costs must remain possible. | ACCOUNT FOR NOW. Omit unsupported annotations rather than creating simulation to fill the picture. |
| P9C6 | Purposeful tool/skill/cheat overlays, authored local scenes, illustrated regions, generated spatial sites and navigation pins can each enrich the view. | LATER. Select one when an actual owner and useful choice exist; no implementation or broad dependency gate follows here. |

## Future implementation shape and gates

**P9I1, proposed sequence after separate authorization:** qualify one disclosed
neighbourhood and its action/quote owners; compare the matched treatments; choose
the visual direction; integrate one native journey; then evaluate expansion.
Initial diagram positions are display data. Do not add gameplay coordinates,
visited history or a save schema merely to remember a layout.

Use the existing place/route owners, local inspection, center navigation and
native action guards. A small adapter may be needed; a universal map engine,
parallel pathfinder, new timer or general knowledge migration is not a first-slice
prerequisite. Part 4 remains relevant to advanced lenses; Part 7 owns resource
detail; Part 2 owns combat. Current public disclosure can support planning now.

Future technical evidence must cover rebuilt fresh-origin travel/inspection,
actual charged time/cost against the quote, no inspection side effects, Back/Esc,
tick stability, hidden-topology leakage and all three desktop targets. Add
save/reload/export/import checks if persistent state changes. Human visual
acceptance remains separate. None of those runtime checks ran in this pass.

## Proposed plan edit

**P9E1:** retain NEXT_PARTS Round 12 and the map-lane return as dated history.
Link this refinement as the current focused proposal for discussion. Suggested
short brief: “Part 9: readable sense of place, piloted on Village and one known
adjacent route. Compare a labelled route diagram, an ink/Hanzi treatment of the
same topology, and a strong list baseline through one inspect/travel/return
journey. Preserve native commands, truthful costs, disclosure and Proto23
composition. Local scenes, lenses and atlases remain explicit expansions.
Planning only; implementation and the final visual default are unselected.”

## Settled without asking

| Class | Point | Resolution |
| --- | --- | --- |
| 1, already answered | Execution authority | The latest user clarification selects planning only. No source, prototype, build, save, commit or dispatch work. |
| 1, already answered | Visual interests and desktop priority | Retain the endorsed Hanzi interest alongside the user's complexity concern; follow standing UI rules at the stated desktop sizes. |
| 2, straightforward derivation | One first-slice outcome | Orientation, inspection and a deliberate adjacent journey are enough to evaluate Part 9 without a new spatial simulation. |
| 3, reversible future choice | Comparison and showcase | Recommend P9V1–P9V3 and P9B1–P9B5; they remain proposals. |
| 4, focused evidence needed | Travel quote and native integration | Current source shows conditional adjustments. A future executor must trace the applicable branch and verify the displayed quote against actual costs. |

## Questions for Weibao

None required to complete this scoping pass. Final visual treatment and any
expansion into spatial gameplay remain future choices, not implied approvals.
