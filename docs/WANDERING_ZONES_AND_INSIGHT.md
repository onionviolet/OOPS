# Wandering zones and practical insight

Saved 2026-10-02 from the current repository chat. **Hanzi-field visual style endorsed; original center action menu retained as the primary exploration surface for now. New gameplay and optional glyph integration remain proposals and unimplemented.** [PROJECT.md](../PROJECT.md) owns direction/current delivery; [User vision](USER_VISION.md#insight-and-wandering-idle-zones-follow-up-2026-10-02) retains the initial request; [runtime contracts](ENGINE_EXPANSION.md#wandering-zone-and-insight-contracts-proposed-2026-10-02) own integration. First milestone remains one realm and one prestige layer; the current Village/shop/Rat-step human review remains pending.

> More to consider? this can help with stuff like 'insight' skills and more? more to consider? "Wanderable"/ Idle zones? where gameplay is just a little different and automated resource gathering but with chance of big monster or whatever

## One loop that connects information, resources and encounters

Proposed loop: **choose a zone and plan → wander/gather through supported field intervals → acquire materials and observations → follow the plan or stop at a discovery/threat → return with declared cargo and knowledge → prepare a different trip**. Wandering can initially move between a few abstract terrain pockets, with a visible route/depth and safe return point. A full coordinate map/pathfinding system is a later option, not a dependency for this proof.

The difference from a fixed resource job is the changing situation: a useful patch diverts the route, tracks suggest a predator, a discovery opens a later objective, or supplies prompt return. Quiet intervals and reliable ordinary gathering still matter. A trip that encounters no rare monster should have a useful result.

## Five connected design considerations

### 1. Insight should produce usable understanding

| Stage or capability | Original example | What it unlocks, and what it does not |
|---|---|---|
| Perception / sensing | Notice deep tracks or see a creature brace its forelegs | An observed signal. A special eye can expose a signal ordinary sight misses; it does not automatically interpret it |
| Relevant knowledge / appraisal | Recognize territorial tracks or estimate the creature's size | A supported classification or warning with its source/date; an estimate need not reveal its entire hidden build |
| Insight / analysis | Relate the foreleg brace to its committed charge and vulnerable recovery | A conditional explanation and a new counter lead; it does not grant the body, fuel, equipment or technique needed to execute that counter |
| Comprehension / practice | Test that explanation or study a relevant guide | A reliable learned response or method under its declared acquisition handler |
| Planning / field mastery | Use the learned response on later trips | A better automatic plan, route choice or preparation; mastery changes a decision rather than adding only a global XP multiplier |

Insight can be a trained skill, domain specializations or subject-specific knowledge records. This request does not choose that roster. Reuse [G2 knowledge distinctions](GRANULAR_SYSTEMS_AND_INTERACTIONS.md#g2-distinguish-knowing-what-from-being-able-to-do-it), rather than create a second knowledge engine. Relevant native Perception, Meditation, Herbalism and Spatial awareness can support narrow checks where appropriate; a native skill description alone is not an implemented interpretation handler.

Earn evidence through supported observation, successful counterplay, escape, material experiments, manuals, teachers or comparison between related subjects. Later reflection can consolidate a field clue at camp. Insight about a charge can apply to another compatible charging enemy when the authored principle actually fits; do not turn one observation into universal omniscience. A bloodline can accelerate, bypass or specialize a step under its own power rules. Ordinary study and equipment remain alternate routes.

Track first meaningful observations, repeated confirmed applications and domain proficiency separately. Repeating a settled trivial encounter should not produce an unlimited stream of first discoveries. A rare inspiration moment may reveal an optional lead; a dependable study/test route can secure foundational understanding. Observation needs a supported cost/exposure and records its evidence once, not repeated free combat toggles.

### 2. Zone differences should change the plan

These are candidate local zone families, not selected locations or new worlds:

| Zone family | Routine automation | Distinct decision and exceptional event |
|---|---|---|
| Wooded outskirts | Collect wood/herbs, read tracks, follow known paths | Noise, cover and territory affect whether to observe, detour or hunt; an unusually large predator may cross the route |
| Ruins / abandoned works | Search salvage pockets and inspect markings | Route knowledge and supported tool use open a sealed cache or avoid a trap; a dormant guardian can become an encounter |
| Wetland / river edge | Forage, fish or collect local materials | Footing, weather or an authored tide changes access/return; a migration, flood warning or nest creates another objective |

Possible shared controls: **gather**, **observe/scout** and **hunt/search**, plus shallow/deep route and a return rule. Each focus changes the declared time allocation, yields and accessible actions, rather than granting every benefit at full rate. Changing focus at a legal boundary never rerolls an already selected encounter. Later companions, devices or home support can extend a trip using actual resources/capacity.

### 3. Big monsters can become continuing opportunities

An exceptional encounter may be an ambush, a territorial warning, distant sighting, wounded creature, migration or active fight. The event definition decides which applies. Show the zone's known risk before entry; sightings and tracks can create more warning, while a declared hazardous area can still surprise an unprepared visitor. A very powerful creature need not be scaled down to the player.

Observe, avoid, retreat, lure, negotiate where appropriate, or fight through the supported encounter rules. A retained clue can open a later prepared hunt, research lead or request for help. A giant beast's learned attack, body faculty, equipment/custody and materials have separate acquisition rules; ordinary escape can teach something without yielding a kill reward. Follow the [enemy power owner](RNG_ENCOUNTERS_AND_SOURCE_DEVELOPMENT.md#bloodlines-and-enemy-power-builds-refinement-2026-10-02) for actual skills and the [character owner](CHARACTERS_AND_WORLD_EVENTS.md) for a persistent individual's later life.

Separate actual occurrence, detected evidence, understood meaning and chosen response. Insight can reveal an existing threat earlier; it should not silently make more monsters physically spawn by improving detection. A rare herb discovered and a rare monster encountered can use different eligibility/selection rules. Future regional monster/ecology simulation is optional; a committed encounter table alone does not implement roaming actors elsewhere in the world.

### 4. Automation should carry the player's intent

A readable plan could say: “Gather along known paths; observe from cover when legal; avoid elites; return when supplies reach the minimum or cargo reaches the chosen limit.” A hunting plan instead follows confirmed tracks and fights only threats within its declared policy. A threat estimate is based on known information, so uncertain cases need an explicit stop/retreat rule.

Proposed first policy: familiar supported situations resolve automatically; the first unhandled exceptional event pauses this outing for review, with a return option. Record the event at that boundary and resume from the same result. Closing/reopening does not let danger advance past that stop. A chosen auto-return is a real supported action with its stated route/time/cost, not proof that all future threats guarantee escape.

Foreground simulated time is enough for the first prototype. Wall-time/offline catch-up remains a separate choice. Possible later modes include banking time, completing only supported safe work or resolving encounters with an explicitly selected risk policy. The proposed first zone has no new lethal/offline-loss rule. [G4 clock/stop contracts](GRANULAR_SYSTEMS_AND_INTERACTIONS.md#g4-time-and-interruption-belong-to-the-commitment) own the current native calendar integration gap.

### 5. Familiarity and aftermath should make return trips different

Keep known paths, interpreted signals, learned counters and discovered objectives with their declared retention. A route can later support more efficient gathering or a deliberate hunt. Resource depletion/regrowth, weather, other actors and regional threats may change conditions when explicitly modeled; historical knowledge can become dated without erasing learned competence. Avoid requiring routine maintenance in every visited zone.

Retain species familiarity separately from an individual monster's identity. Unique caches and named creatures need retained claim/settlement records; ordinary populations need explicit renewal rules. Cargo, used supplies, a suspended local task and personal knowledge remain separate. Returning to town should not refill a monster's spent charge, recreate a unique cache or repeat a first insight reward.

## Proposed first local proof

**One wooded outing near Village**, with a short bounded route, ordinary gathering, a track discovery and one exceptional predator encounter. Zone name, native item keys, interval length, risk weights, supplies and rewards remain reversible tuning choices. Reuse one realm and the saved encounter service; no second world, prestige layer or broad ecology simulation is required.

| Plan / event | Required observable result |
|---|---|
| Gather along known paths | Earn actual native materials through settled intervals and return under the chosen limit; a quiet trip is productive |
| Observe a supported charge from cover | Trade time/yield and any declared exposure for relevant evidence. A later study/test explains one recovery counter; owning Insight or a bloodline tag alone does not skip unsupported execution requirements |
| Exceptional large predator | The gathering action suspends. The saved encounter exposes a supported response or a real withdrawal route; observation, escape and victory settle distinct costs/results. A journal sentence claiming a monster appeared is not a playable encounter |
| Return and prepare again | Keep settled cargo/knowledge, spend actual preparation and use the discovered response on the next eligible trip. A repeated familiar observation does not regrant the first discovery |

**Playable gate:** compare gather and observe/hunt plans at similar strength; show actual materials, retained evidence and a changed legal response. Play both a quiet outing and an exceptional encounter, then return and use the discovery. Reload mid-interval, at the selected monster, after interpretation and after return without duplicated supplies, lost cargo, fresh draws or repeat rewards. Prepared automation stops at its declared uncertainty. Human review assesses whether ordinary wandering is useful and exceptional events create interesting later plans.

## Chinese-glyph map direction, explored 2026-10-02

The user proposed visualizing wandering through Chinese characters, referring to an unidentified indie game seen on Reddit that uses Japanese characters for its world. The conversation mockup compared **Hanzi field**, with spatial terrain/actors, and **Ink atlas**, with larger landmarks linked by routes. The later user response endorsed Hanzi field; exact reference, renderer and embedding layout remain unselected. Its scripted interactions are a visual study, not an integrated gathering/insight/combat implementation. Ink atlas remains an alternative/regional-overview proposal, not an equally preferred local-zone style.

Closest inspected reference: [Hito's World creator screenshots and description](https://hito.world/press), viewed in the browser on 2026-10-02. Its screenshots construct terrain, settlements, objects and actors directly from characters; the creator's [Reddit introduction](https://www.reddit.com/r/LearnJapanese/comments/gpcxks/) describes a world made of kanji. This is a close match, not confirmation of the user's original post. [Anoxic Depths](https://studiotectorum.itch.io/anoxic-depths) is another verified creator reference with Japanese kanji among its tile-set options; it was not selected as the exact reference. No source art/code was copied or downloaded.

| Visual rule proposed | Purpose and state boundary |
|---|---|
| Semantic glyphs and bilingual inspection | 林/森 for woodland, 水 for water, 山 for mountains, 草 for herbs, 营 for camp, 人 for player, 足 for tracks and 兽 for a detected beast. These are game-symbol mappings, not a vocabulary test. Known marks have a short English label or a persistent selected-detail area; users can hide labels without losing accessible names |
| Terrain, actors and cues remain distinct | Quiet terrain forms a spatial background; a clear player marker moves along the supported route; resources, tracks and detected enemies are selectable foreground marks. Use size, enclosure and wording as well as color. A large monster gets visual weight without covering the whole field |
| Knowledge changes disclosure | Unexplored terrain remains faded/undisclosed. Observed tracks can appear before a creature is detected; identification changes 兽 to a more specific symbol/label only after relevant evidence. Insight adds an explained behavior/counter cue, not an omniscient map overlay. Actual occurrence stays separate from rendering |
| Automatic movement with readable stops | Show a restrained route trail, current focus, cargo and current action. Pause at the plan's unhandled threat; observation/return are explicit controls. Animate finite state transitions only when useful and respect reduced motion; drawing a route does not implement pathfinding or elapsed-time simulation |
| Renderer does not own gameplay | Tile/node coordinates, font, tint and overlays are a read model over the committed field session. Selecting/hovering a glyph cannot spend resources, reroll a discovery or reveal private actor data. Keep a common glyph/label mapping so a future icon view can show the same knowledge without a save conversion |

Current visual direction: use Hanzi field as the preferred local wandering style, with the atlas retained as a candidate regional overview. A bundled Chinese-capable font with declared fallback, legible glyph size, keyboard/touch selection and quiet terrain density need checking in the actual game before renderer adoption. Keep established non-wandering UI readable; Chinese glyphs need not become every button or stat label. No raster art, full map engine, canonical setting, glyph roster or game-wide reskin is selected by the mockup.

## Base-game integration and shared views, refined 2026-10-02

The user asked how wandering integrates with the base game, whether maps are different views and whether the map must correspond to available selections. **Proposed answer: one authoritative game state, several projections, shared commands.** The text list, regional atlas and local glyph field show different representations/scales of the same discovered locations, resources, actors and events. A view toggle is presentation. Wandering's field intervals, interruptions and interpreted evidence are additional gameplay that still needs the shared controller/adapters; a map skin alone cannot create it.

### Five integration considerations

| Connection | Proposed rule and practical consequence |
|---|---|
| Existing location graph and local detail | Regional landmarks reference real native location IDs and `connected_locations`, with actual travel time/unlock/access. A local field belongs to one location/session and contains selected points of interest; not every decorative 林 is a new native location. Begin with meaningful nodes/route pockets before deciding whether individual traversable tiles need their own navigation rules |
| Selection and command binding | Every interactive mark/list row has a stable target ID and kind, a known label/glyph and legal command references. Selecting it opens the same detail/actions in either view. Inspecting does not travel, gather or attack. A disclosed command commits that action through shared eligibility/cost/effect rules; UI mode and Chinese/English label changes cannot create gameplay state |
| Native progression and economy | Gathered outputs go to actual inventory; relevant skill XP goes to its existing owner; supplies come from normal shops/crafting/storage under access rules. Discovery can open a recipe, route, dialogue, quest step or counter through its supported adapter. A trip can supply healing preparation or a later hunt; no separate wandering currency/inventory/XP economy is needed |
| Occupation, encounters and aftermath | For the first proof, wandering is the player's active assignment. Gathering suspends for a selected encounter and resumes/returns under its policy; it does not run concurrently with a second native gathering/combat job. Stamina, supplies, equipment, earned knowledge, defeat/recovery and quest/loot receipts follow actual owners. Player orders and automatic plans invoke the same validated commands |
| Knowledge, time and persistence | Map/list eligibility derives from the same known-information projection. Actual world state can contain unseen actors without drawing them. One supported clock settles route work, gathering, encounter stops and return; view switching consumes no time or draws. Persist selected target, route/focus/policy, partial commitments and outcomes independently of renderer coordinates/font/zoom |

Concrete proposed binding examples:

| Mark | Model target | Same selection/action in map and list |
|---|---|---|
| 村 / 营 | Native location or known safe return point | Inspect access; explicitly travel/return using its real route cost |
| 草 | An accessible resource patch referencing a supported gathering action | Inspect known material/tool requirements; choose gather or include it in the trip's plan |
| 足 | A discovered evidence/event record | Inspect the clue; choose a supported follow/observe/study action if available |
| 兽 / identified creature glyph | Detected encounter participant or persistent actor ID | Show known traits/history and supported observe/fight/withdraw/dialogue actions; hidden possessions remain hidden |
| Decorative 林 / 水 / 山 | Terrain presentation, with an optional real terrain rule where exercised | No action by default. A supported river crossing or obstruction gains an explicit target/command rather than making every glyph clickable |

Proposed integrated loop: **Village supplies → a local Wander assignment → actual gathering plus tracks/encounter → return with materials and a counter lead → native alchemy/equipment preparation or study → deliberate return/hunt**. A discovered movement can use the existing Rat-step-style evidence mechanism where its own rules fit, but this does not impose that sequence on every insight or power. Quest recognition and NPC reports need explicit discovery/receipt adapters; gathering materials cannot silently progress every related quest.

Current source confirms a native location graph, `current_location.activities`, travel and action controls. Importantly, `change_location` starts native combat when entering a non-safe location unless its supported skip path applies. A glyph click must not accidentally call it during inspection or convert a wandering threat into an uncontrolled ordinary enemy wave. Integrate the chosen activity/location entry policy explicitly and preserve ordinary location behavior.

The conversation mockup now includes **Map/List** controls backed by the same local target selection, discovery and outing state. This demonstrates presentation/selection continuity only, not native command binding. Its deterministic scripted scene is not general wandering, pathfinding, enemy AI or field resource simulation. Actual rebuilt-game proof must show both views invoking the same real action, the same costs/results across reload, and the Village preparation/return payoff.

Visual-study checks, 2026-10-02: browser exercised automatic scripted wandering, the unfamiliar-threat stop, observation changing the creature label/counter note, return, both layout variants, hidden English map labels and Map/List selection continuity. Desktop width 736px and narrow width 320px were inspected; the narrow document had no horizontal overflow. JavaScript syntax and local document links were checked. These checks apply only to the conversation mockup; no native game build or gameplay acceptance is claimed.

## Hanzi-field preference and native-screen composition, 2026-10-02

**Accepted current direction: keep the original center action menu as the main exploration surface for now.** The user clarified this after the synthesis proposed making the Hanzi field primary. Their screenshot illustrates the familiar location description above Move/Train/Gather/Challenge choices, with inventory, skills and records alongside. Hanzi-field style remains endorsed; new placement and gameplay remain optional proposals. Books and ordinary actions can deepen within the existing interface.

[User vision](USER_VISION.md#center-menu-book-depth-and-self-aware-humor-2026-10-02) records this clarification. [Prototype history](PROTOTYPE_HISTORY.md#adaptive-exploration-composition-superseded-2026-10-02) preserves the superseded field-primary recommendation and layout comparisons verbatim.

Source checked 2026-10-02: native location/action panels already exist, `src/display.js/start_reading_display` shows reading progress and Stop reading in the central action area, and `src/expedition_ui.js` uses a read/command interface. These are integration points, not implemented new book details or glyph control.

| Context | Current direction | Possible depth |
|---|---|---|
| Exploration | Center menu remains primary for choices and current work | Inspection, scouting, plans and discoveries expose supported actions here |
| Books | Retain inventory Read and central reading status; details can use this area or Anthology | Passages, practical leads and later interpretation share book/knowledge state |
| Preparation and return | Preserve ordinary inventory, equipment, shops, crafting and journal access | Materials and understanding change later normal actions |
| Encounters | Use the supported encounter/action surface | Optional field context references the actual encounter; inspection never starts combat |
| Hanzi presentation | Optional supporting scene/view with access to the center menu | Depict known state and action focus; adaptive or map-primary composition is deferred |

Any later field/list view uses the same targets, legal commands, known costs and saved results as the menu. View changes do not advance time, draw outcomes or create spatial movement. A map is not a dependency for deeper books, contextual writing or the next gameplay choice. The later [original-screen assessment](#original-screen-assessment-and-optional-hanzi-presentation-2026-10-02) remains useful supporting analysis; retaining the center menu is now a user decision, beyond the earlier recommendation.

Documentation only: no native UI, gameplay, timer, schema, bundle or personal save changed; no new build/browser claim. Existing playable review and the first milestone remain in place.

## Map scope and timer-driven first integration, 2026-10-02

The user questioned whether adding a map changes the game too much and creates map-design work, then asked whether new implementation is needed if the current activity is just a countdown. **Recommendation: treat Hanzi presentation as optional. If selected, bind it to existing expedition state before adding any new wandering controller.** The later [original-screen assessment](#original-screen-assessment-and-optional-hanzi-presentation-2026-10-02) favors the existing activity menus as the main interface. Neither a larger picture nor an expressive glyph style requires tile-based movement. No presentation change is a prerequisite for deeper gameplay; Hanzi visual preference remains endorsed.

| Scope | What it adds | Authoring and implementation cost |
|---|---|---|
| Presentation of existing timed actions | A schematic glyph scene, selected-action focus, actual remaining time, known landmarks and settled aftermath | Some UI binding, target/glyph mapping, readable layout and rebuilt browser/reload checks. It can reuse existing actions/state without a new gameplay timer, coordinate save, monster simulation or map generation |
| Bounded wandering activity | Gathering/scouting/hunting focus, a few meaningful route pockets and supported exceptional events/responses | Real interval/event/cost/knowledge/encounter adapters and authored choices. The existing future packet describes these; a countdown or animated marker alone does not implement them |
| Tile-based spatial world | Movement/collision, pathfinding, sight/range, terrain effects and potentially independently moving actors | Substantial new rules, content layout, testing and persistence. This is a later option only when requested/selected interactions benefit from exact position |

Map design still has a cost in the first row: select clear landmarks, map them to honest actions, choose a quiet glyph background and retain readable selected details. A reusable forest/cave/town scene template can provide atmosphere; individual decorative trees need no game identity. Layout positions may be schematic. Only an explicitly authored route connection has a time/access rule; the scene must not imply that clicking a nearby drawn object bypasses a real travel requirement. A fixed illustration needs no gameplay RNG; any decorative variation stays separate from gameplay draws.

Current-source fit: `src/expedition_ui.js` already reads saved pending action IDs, world/actor facts and `job.due - state.clock`, then invokes commands by action ID. `src/expedition_content.js` already defines inspection, kit/rope/strength approaches, requirements, costs, frozen results, skill/material rewards and later guide/crossing consequences. Those choices can be depicted directly. The timer is pacing; the existing prerequisites, commitments and aftermath carry the current interaction. The conversation mockup's timed movement/monster/insight sequence is scripted illustration and cannot be used as evidence of a native encounter or discovery.

Proposed smallest integration **if an optional scene is selected**: show Village/crossing/preparation/guide landmarks where their actual known state supports them; selecting a landmark filters or focuses the existing action choices. An active action highlights its subject and displays the existing remaining supported time. Completed inspection/survey changes the scene only from saved facts; if no actual encounter happened, no native monster encounter is implied. Use “working at the crossing” or an action-focus marker rather than inventing an authoritative player coordinate. The existing clock and save semantics remain the authority; this display does not establish a global calendar/offline adapter or an accurate travel animation.

This first pass is legitimately a presentation improvement. Its acceptance is that the field is attractive and clearer, commands/costs/results match the existing journal, and reload restores the same state without replaying effects. Call it an **integrated expedition view**, not implemented wandering gameplay. It still needs source integration, a build and generated-save browser checks; the current conversation visual remains only a mockup.

New runtime work should follow a concrete changed decision: scouting spends time for useful evidence; an alternate route changes declared travel/risk; a threat offers supported observe/retreat/fight outcomes; a discovery enables a usable later method. Add only the selected handlers, with the existing transaction/save gates. If an activity only waits for a fixed reward, rendering that activity does not justify adding a spatial simulator. A timer-based activity can remain enjoyable because preparation and its result are useful, and its scene can add atmosphere without a new gameplay promise.

Bounded primary comparison checked 2026-10-02: Jagex's [Atlas of Discovery announcement](https://www.jagex.com/news/melvor-idle-s-new-expansion-atlas-of-discovery-launching-this-september) introduces world-map exploration through new Cartography and Archaeology skills as an expansion. It shows a deliberately broader map/progression direction, not evidence that a glyph view needs those systems or a scope/cost estimate for YAIRPG.

This clarification changed documentation only. Current source and the bounded primary reference were read; no native code, bundle, timer, save schema, personal save or new build/test/browser result changed. The broader vision and first milestone remain intact; a presentation-first recommendation sequences work without ruling out later spatial worlds.

## Original-screen assessment and optional Hanzi presentation, 2026-10-02

The user supplied a screenshot of the earlier Nearby cave UI and questioned whether Hanzi field is necessary or introduces unnecessary complexity. The image visibly shows character/stats/inventory, location description/activity choices, quests/skills and the event log in adjacent columns. It establishes the earlier screen's composition, not its exact source revision, current runtime behavior or acceptance of an implementation. No inventory quantities or personal save data are transcribed here.

**Current recommendation: keep the existing activity menus as the primary interaction and prioritize useful gameplay within them. Hanzi field remains an optional visual idea.** The image strengthens the case for preserving simultaneous access to progress, possessions and actions. A scene can provide atmosphere or clarify current activity, but the conversation mockup's appeal does not justify navigation rules, a new layout or a map engine by itself. This is an agent assessment; the user has not cancelled the Hanzi idea or accepted a final placement.

Practical proposal: a selected Wander activity can run from the existing action area and summarize supplies, found resources, relevant evidence and any real encounter response. Insight, enemy techniques, preparation and resource uses can alter those ordinary controls without requiring spatial coordinates. If the optional Hanzi presentation is later desired, a small collapsible scene below the description or within the active activity can depict the same known state, using a cave/forest template and a few meaningful marks. Normal text controls remain a complete way to play.

Remaining visual costs are layout/readability, semantic labels, honest activity/knowledge feedback, target/action bindings and maintained fallback behavior. Explicit map mechanics add a separate cost: authored routes, reachability, terrain, movement, encounter positioning and compatible save rules. Select them only for a concrete interaction whose outcome benefits from spatial choice. A cosmetic scene may still be worthwhile, but should be evaluated as presentation rather than required progression or claimed wandering simulation.

First milestone recommendation: develop the selected preparation/gathering/insight/encounter payoff through the current interface; optional art can follow when it improves the experience. Comparing compact/adaptive map layouts remains a future option, not a delivery prerequisite. A useful check for any later field is whether hiding it preserves ordinary actions/results and whether showing it adds atmosphere or decision clarity sufficient to justify its maintenance. This does not remove broader world/spatial proposals from the project.

This assessment used the user-supplied image and current design owners. Documentation changed only; no new visual, native source/bundle, timer, schema, personal save or gameplay verification changed.

## Source fit and reference boundary

Inspected 2026-10-02: `src/activities.js` defines gathering/training/jobs and a patrol job; `src/models/location.js/LocationActivity.getActivityEfficiency` computes skill-scaled interval/yield/chance/quality; `src/main.js` settles native gathering with `Math.random`, direct XP/inventory changes and elapsed work counters. `src/technique_content.js` already has a paid/timed Rat-step evidence/study/practice loop. `src/data/skills.js` includes Perception and Meditation, but no native skill named Insight was found. These are reusable foundations, not a saved wandering/interpretation/encounter controller.

Primary comparator checked 2026-10-02: [Loop Hero's developer/publisher store description](https://store.steampowered.com/app/1282730/Loop_Hero/) connects expedition preparation, terrain/enemy placement, recovered resources, camp development and guardian encounters. It supports considering a trip whose route and resources feed later preparation. Our insight lifecycle, wandering focus controls and idle risk policies are original proposals, not verified Loop Hero mechanics. Its terrain-card interface is not selected for this game.

This pass changes documentation only. No native gameplay source, schema, bundle or personal save changed. No new build/test/browser result is claimed; earlier evidence remains dated in PLAYTEST.md. [Engineering contracts](ENGINE_EXPANSION.md#wandering-zone-and-insight-contracts-proposed-2026-10-02) identify the real adapters and acceptance requirements.
