# Superseded cultivation prototype and planning state

Archived 2026-10-01 after the user requested a return to the YAIRPG foundation. The following records prior planning and verification; it is not the current build status.

## Character-proposal overview before the shared-platform refresh, 2026-10-03

The current overview in CHARACTERS_AND_WORLD_EVENTS.md now links the delivered shared simulation and independent-helper services, and distinguishes those controllers from a complete autonomous regional campaign. Its earlier summary described only the chronicle and incorrectly left all controllers in proposed state. The old summary is preserved verbatim:

**Current playable subset:** the existing Village elder has a saved control encounter, conditional debrief/lesson, separate relationship memories, timed archive duty/inheritance and missed-event reports through the center menu. [Chronicle runtime](ENGINE_EXPANSION.md#chronicle-runtime-increment-2026-10-02) owns exact implementation; other cast, controllers, family trees and broad world simulation below remain proposals. Human review and the first milestone remain in place.

## Superseded technology-world scaling illustration, 2026-10-02

DIRECTION_SYNTHESIS.md now explicitly includes powerful technological individuals such as gene warriors, implants and synthetic bodies. The earlier paragraph below illustrated fragile inhabitants plus infrastructure; that illustration was not intended to cap technology-world personal power and has been replaced with the broader user clarification.

Use a world danger profile with overlapping ranges and typed capabilities. Ordinary inhabitants, trained specialists, rare apex actors and deployed institutional assets can have very different strength. A world with fragile ordinary people can possess strong sensors, vehicles or industry; a high-energy world can contain weak civilians alongside exceptional practitioners. A stronger traveler can legitimately overpower a lower-band threat. Preserve that achievement, while an unfamiliar rule or differently scoped objective can still matter. A world label should not grant every inhabitant the same strength multiplier.

## Superseded blanket player-choice rule for rival events, 2026-10-02

RIVALS_IDENTITIES_AND_FATE.md now permits authored outside actions and information discovery, consistent with the user's life-event direction. Player commitments and responses remain explicit. Its original summary is preserved verbatim:

The desired loop is **discover a person and their leverage → prepare or scheme → contest something specific → resolve it → encounter the consequences**. Idle preparation can support the loop, but meaningful decisions and surprise identity changes need an explicit player choice.

## Superseded engine-readiness assessment, 2026-10-02

DIRECTION_SYNTHESIS.md now points to the current v0.6 source/test audit in ENGINE_EXPANSION.md. Its earlier assessment below is preserved verbatim; references to active cultivation and a future v0.6 audit describe the prior prototype stage.

The source-grounded [Engine expansion proposal](ENGINE_EXPANSION.md) owns the detailed architecture and delivery boundaries. It explicitly recognizes existing action probabilities and proposes incremental saved events, simulation and world/origin interfaces rather than a full rewrite.

**Design assessment: yes for an incremental proof of the idea; the full architecture remains unproven.** Local source contains staged quests, dialogue conditions/locks, book reading, skill milestones, equipment, recipes, reputation, travel and stance tradeoffs. The cultivation module demonstrates a small independently versioned state machine. Those are useful attachment points for a discovery chapter.

The main loop also owns substantial progression, reward, save and UI integration. Existing quest fields do not constitute a general reversible story graph. Current cultivation trials are timers, not new enemy AI. Closed-browser catch-up is absent from the inspected load path and the documented prototype. Existing browser evidence covers the first slice, not branching campaigns or temporal resets.

Add a small story layer before a whole-engine rewrite: stable chapter/choice IDs, current scenario state, remembered knowledge, transition requirements and once-only reward receipts. Keep definitions separate from saved progress, derived effects separate from their owners, and scenario resets restricted to explicit namespaces. Do not duplicate ordinary inventory or reputation in a competing story store.

New transitions must commit costs, decisions and rewards together. Save/reload and export/import need to preserve pending choices and partial tasks without paying twice. For replay, test reset boundaries, repeated completion, reward replacement and attempted temporary-item export. Preserve historical saves and grandfather valid prototype cultivation progress if entry gates change.

Audit upstream v0.6's availability and quest work before choosing reuse. This is an integration checkpoint, not a recommendation to merge immediately. Stay on the current base for a bounded chapter unless source evidence identifies a concrete blocker or worthwhile migration. A major engine decision can wait until the first chapter exposes actual costs.

## Superseded copying, loadout and trade summaries, 2026-10-02

The current journey proposal in DIRECTION_SYNTHESIS.md permits deliberately exceptional copying/stacking with explicit authored rules. Its earlier blanket copying warning and fixed preparation recommendation are preserved verbatim below. Replay now refers to the optional first-milestone prestige policy because cultivation rebirth is archived. PROJECT.md's sequential-trade summary is superseded by implemented atomic native acquisition; its original paragraph is retained here.

| [Progression and learned magic](RESEARCH_PROGRESSION_MAGIC.md) | Understanding, capacity, control and field execution differ; tools and environment can substitute for personal abilities | Useful techniques with requirements, costs, limits and practical tests | Unlimited spell copying; stacking every protagonist exception; another passive bonus shop |

Know many methods, prepare a few. Start by reusing stance tradeoffs and one expedition utility choice before designing a general slot engine. Techniques should sometimes complement each other, but require a budget, compatibility condition or meaningful cost. Imported knowledge can remain useful while an imported power requires local fuel or an adapter. Later worlds earn their place by changing decisions, not by renaming the same resource loop.

Keep replay distinct from the existing optional cultivation rebirth. It is not a second multiplier-producing prestige layer. Campaign-wide regression, imported future gear and a fully rewritten historical world remain separate, much larger designs.

Playable shop increment: Village Basic stock now includes three Prepared survey kits and one lightweight Survey rope per ordinary refresh. Native purchase prices start at 8/16 coins, with native Haggling/reputation rules; journal preparation remains fixed at 8/16. Base/resale values are 2/4. The older Coil of rope retains its ID, value and separate role. Existing saved stocks receive new offers at the next scheduled refresh; loading never forcibly refills them. New shops still use native sequential trading, while the expansion event adapter remains separate. The next acquisition work must stage merchant/player transfers and acquisition records together. Item labels, prices and stock limits remain review proposals; saves retain the same item keys/schema.

## Next work

First shared rules increment, 2026-10-01: implemented `src/rules.js` with explainable fact requirements, validated weighted outcomes and a JSON-safe resolution receipt. Cultivation trial eligibility uses its requirement evaluator with unchanged valid-save costs/thresholds. Ten tests and source rebuild pass. The probability/receipt helpers remain unconnected to story state and saves; no new event, rewind, world or offline feature is claimed. See ENGINE_EXPANSION.md for boundaries and PLAYTEST.md for browser verification. The next simple primitives should be a simulated-time deadline and an explicit reset-ownership policy, added with the first real event rather than empty framework modules.

Latest architecture request, 2026-10-01: Weibao asked how to expand YAIRPG's engine so the broader ideas have a path to implementation. `docs/ENGINE_EXPANSION.md` maps inspected code to proposed state/transition, rule/commit, simulation, world/origin and UI boundaries, with five playable delivery stages. Existing conditional probabilities are acknowledged; persisted graded events, scoped rewind, safe offline execution and multiple actors are new work. The recommended first engine increment supports one conditional expedition event and aftermath while retaining current content and cultivation saves. This is a source-grounded proposal, not an implemented engine or accepted plot.

Latest research steering, 2026-10-01: Weibao asked to examine novel tropes and starting advantages that can change a run's gameplay in its entirety. `docs/RUN_DEFINING_ADVANTAGES.md` compares temporal retention, resource production, exceptional profession access, invested power and distributed selves, separating verified source examples from original adaptations and remaining gaps. Starting advantages may change campaign rules and objectives rather than only stats; no specific origin roster or implementation is accepted. The refinement-first chapter remains the proposed shared test ground.

Latest requested exploration, 2026-10-01: save the subsequent event, journey-ending and probability discussion; consider different starting treasures/opportunities, including a time-travel ring, guiding system and resource-enhancing vessel, with book golden fingers/cheats as design sources. `docs/DIRECTION_SYNTHESIS.md` owns the detailed proposals: granular conditional interventions, probability previews and graded consequences, persistent event outcomes, journey retention, and contrasting bounded starting advantages. The requested design space is recorded; exact odds, artifacts, reset/RNG rules and book adaptations remain undecided. No new event or origin gameplay has been implemented.

Latest steering, 2026-10-01: Weibao asked how to begin amid the possible directions and whether existing gameplay can be refined. The refinement-first proposal in `docs/DIRECTION_SYNTHESIS.md` starts with a fresh-save opening audit, clearer leads, one useful manual/mentor expedition and stronger existing stance/craft interactions. Review that chapter before selecting earned cultivation entry, bounded replay or a second-world connection. The synthesis also covers deep world campaigns and original, book-inspired and explicitly selected direct book settings. No particular book world, canon policy or new temporal rule has been accepted. No new gameplay is claimed by this starting proposal.

Current steering, 2026-09-30: Weibao raised cultivation as a possible separate or future path, with entry earned through finding relevant techniques and other prerequisites, and requested comparison of forks, Proto23, Your Chronicle and lore-based design research. Its placement and exact gates remain provisional. Immediate Jade Hollow access is still the implemented review shortcut, not an accepted campaign entry.

The research and recommended priorities are in `docs/REFERENCE_RESEARCH.md`: audit upstream development and selected mods, deepen ordinary adventure with a discovery/manual/mentor expedition, then use verified lore to design later power paths. No gameplay change or upstream integration is implied by this research. Keep Jade Hollow playable for pacing, trial, reset and legacy review; no human acceptance is recorded. The spirit archive and other additions in `docs/EXPANSION_DESIGN.md` remain candidate expansions rather than the automatic next milestone.

Weibao also requested parallel chats researching power paths and genre tropes across specific acclaimed books, with relevant Calibre references used as needed, plus a separate comparison of other idle games and adjacent references. Five disjoint research lanes are recorded in `docs/RESEARCH_COORDINATION.md`. Their findings are now reconciled into `docs/DIRECTION_SYNTHESIS.md`; creative acceptance and new gameplay remain pending.

Current design exploration, 2026-09-30: Weibao requested a possible story/choice-driven direction, chances to return in time or move through the story chain, hybrid numeric/mechanical difficulty, and an assessment of the existing foundation. The synthesis recommends a discovery-led ordinary chapter, consequential branches that meet at shared milestones, and a later bounded chapter replay with retained knowledge. It separates replay from travel, breakthrough and cultivation rebirth. This records the requested exploration, not acceptance of the proposed story, reset contract, difficulty rules or implementation sequence. Broader world and power-path options remain available.

Historical YAIRPG save exports remain in `/Users/weiwei/Downloads/Games/`. Do not commit or overwrite them. Use a dedicated preview origin and fresh test saves when developing.


## First slice implementation and review status

Implemented: original Jade Hollow region connected to Village; Meditation qi, Weightlifting/Combat body conditioning, Herbalism dewleaf gathering with a sickle; native Cooking tea and Alchemy pellet recipes; endurance and formation trials; first meridian breakthrough; and explicit optional rebirth with Remembered breath or Steady hands as one active legacy. Access is intentionally immediate for prototype review, including before the base tutorial finishes. No custom faction, branching mentor quest, new enemy combat encounter or second world is claimed.

Prototype rules: both trials require 60 qi, spend 40 and take 12 active ticks. Endurance needs 30 body; formation spends 30 preparation. Breakthrough needs the seal and 60 qi, awards ordinary skill XP, and speeds cultivation training by 50%. Rebirth resets cultivation resources, the trial/realm and all carried/stored cultivation ingredients and preparations. It retains ordinary skills, character progress, gear, money, other inventory, quests, reputation and knowledge. The preview lists these consequences before confirmation. One active legacy is replaced rather than stacked. These choices require Weibao's review.

Persistence: additive versioned cultivation state defaults cleanly for upstream saves. Trial progress resumes after reload. Unsupported cultivation schema blocks saving; reverting to upstream is not a supported roundtrip. Closed-browser time earns no cultivation progress. The browser reload test found and fixed Meditation's unlock/display ordering before replaying saved XP.

Verified: reproducible `npm ci` and source rebuild; five rules tests; baseline Play and elder dialogue; upstream-shaped development-save migration; a martial build and a fresh artisan build both reaching breakthrough; mid-trial reload on both routes; native herb harvest and Cooking/Alchemy recipes; both legacy choices; breath rebirth with its 2.5 qi/tick rate; Steady hands rebirth clearing seven carried ingredients/preparations, showing 15/45 preparation effects, and retaining the choice after reload. Detailed final checks and boundaries are in `docs/PLAYTEST.md`.

Review pending: human acceptance of the UI, balance, immediate access, deterministic pressure trials, and cultivation-only reset scope. Storage reset is implemented in source but has not been exercised through the native chest UI. Export/import uses the existing full-save payload; no browser file-import roundtrip is claimed. Historical saves were untouched. Existing setup documents remain uncommitted alongside this implementation; no commit, push or release was performed.


## Superseded foundation-only status, 2026-10-01

Replaced by the engine increment requested in the next user message. Content names, balance and larger systems remain proposals.

Current implementation: base YAIRPG content with pinned build dependencies, fingerprinted assets, the standalone `src/rules.js` primitives, the Meditation reload-order repair and safe failed-save handling. Jade Hollow's source, styling, tests and former integration patch are preserved under `prototypes/jade-hollow/` but are not loaded or registered. Shared rules remain available for new content; they are no longer exercised by live cultivation content.

Next proposed playable increment: one ordinary expedition/event using explicit facts, explainable requirements and a recorded outcome. [The broken crossing](NEXT_EVENT_PROPOSAL.md) supplies one minimal peer-rescue premise, two approaches and later aftermath for review; premise and consequence severity remain the creative decision. Add simulated deadlines and reset ownership only as needed by that event. `docs/ENGINE_EXPANSION.md` owns the architecture proposal, `docs/DIRECTION_SYNTHESIS.md` the broader creative proposal, and `docs/RUN_DEFINING_ADVANTAGES.md` the origin comparison. No event plot, book world, origin roster or exact balance has been accepted.


### Superseded standalone-rules architecture status

Date: 2026-10-01. Source-grounded architecture proposal, not implemented engine functionality.

Shared rules status, 2026-10-01: `src/rules.js` provides three pure primitives: explicit fact rules with all/any/not and requirement explanations; validated graded outcome selection from a caller-supplied draw; and a serializable resolve-once receipt. The earlier cultivation integration is now archived in `prototypes/jade-hollow/cultivation.js`; no active gameplay imports that prototype. Unknown facts are distinct from false facts, including negation. Outcome/receipt primitives are tested but not connected to story events or the game save envelope; they do not implement resource transactions, a persisted RNG stream or replay. Seven active rules/compatibility tests and six archived reference tests pass; browser retirement evidence is in PLAYTEST.md. The broader architecture below remains a proposal.

Only design documents changed in this architecture pass. No new engine, migration, browser behavior or offline progress is claimed.

## Initial engine delivery order, superseded 2026-10-01

The audit-derived work packages in ENGINE_EXPANSION.md now own the recommended order. The initial proposed stage order is preserved verbatim below; it was not an accepted full campaign or implementation claim.

## Five delivery stages

Each engine increment must arrive with observable play. Do not treat module creation as completed gameplay. Preserve one realm and one prestige layer until later scope is deliberately selected.

| Stage | Engine work plus playable result | Required evidence |
|---|---|---|
| 1. Conditional event | Extension save schema, pure preview, committed graded event and NPC fact; one expedition rescue with two preparation routes and later aftermath | Old-shaped saves and dormant retired-prototype data preserved; fixture odds/requirements match browser preview; reload mid-action and after resolution cannot double-charge, reroll or duplicate rewards; fresh export/import |
| 2. Time and preparation | Scheduler for the new event, one timed opportunity, one conditional encounter and a supply target | Same simulated duration through normal ticks and allowed time jumps produces consistent new-system results; pause at choice, supply stop and event cooldown survive reload |
| 3. Contrasting origins | Scoped origin policy; vessel batch and one isolated ring checkpoint | Two fresh origins change plans; batch input/output preserved; rewind cannot export temporary goods, duplicate rewards or lose unrelated progress; unrelated dormant prototype state remains intact |
| 4. World identity | World registry and compatibility; second world's small chapter, one distinct rule and useful return interaction | Existing progress loads; imported technique eligibility explained; travel preserves proper state; returning changes a meaningful solution in the first world |
| 5. Advanced execution | Port additional action/combat timing, safe offline work, authored helper and eventually an additional actor | Resume supported combat/action state; active versus catch-up accounting agrees; ownership/stop rules hold; helper/actor adds a decision rather than free duplicated production |

Broader skill/equipment depth develops alongside these stages through the actual expedition. Branches, origin variants and ending combinations need content tests as well as accounting tests. First-stage rescue is a candidate implementation packet, not an accepted specific plot. Historical personal saves remain untouched; use dedicated preview origins and generated test fixtures. Rebuild and exercise changed behavior in a browser for every runtime delivery.

## Basic Rat-step encounter proposal, superseded 2026-10-02

This was an **unimplemented proposal**, not shipped gameplay or an accepted balance rule. The user asked whether low-level techniques should have such powerful effects, then requested comparable scope for different world/power systems. The current [saved encounter packet](ENGINE_EXPANSION.md#saved-mechanical-encounter-packet-2026-10-02) now treats Rat-step as improving an ordinary movement response; the [scale/world contract](ENGINE_EXPANSION.md#power-scale-and-world-system-implementation-contract-2026-10-02) owns its limits. Existing crossing/study/practice behavior and saves were not changed. The superseded wording is retained verbatim:

| Executable Rat-step | At its existing ownership/proficiency/Agility requirements, a new handler moves outside the sweep, avoids that impact and returns during recovery. Using it costs stamina and increments execution exactly once. Having merely observed or owned it does not suffice. |

The first fixture needs at least two viable comparable-stat plans: guard plus recovery strike, and Rat-step or rope plus recovery strike. A diagnostic lead tells players the phase rule. Show the failed unprepared heavy policy alongside a prepared one, without requiring both to have equal speed/cost. No ancestry or rare source is required to enter or succeed.

The matching superseded comparison row from RNG_ENCOUNTERS_AND_SOURCE_DEVELOPMENT.md is also retained verbatim:

| Braced sweep: protected windup, costly sweep, then a real exposed recovery window | Defensive stance/shield absorbs a disclosed impact cost; executable Rat-step moves outside the sweep and opens a counter. Heavy attack during recovery breaks posture; repeating it during brace does not. | A researched latch and anchored Survey rope restrain one sweep, opening recovery. A kit provides expendable safe preparation. | A sight faculty reveals a concealed windup variant early, or copies one supported step. Obscured sight prevents observation; copying the step does not copy the enemy's body or fuel. |

## Simple-skill growth interpretation, refined 2026-10-02

The user explicitly requested the possibility of leveling a simple skill into something extremely powerful. [The growth owner](RESEARCH_LITRPG_SYSTEMS.md#simple-skills-with-extraordinary-long-term-growth-2026-10-02) now distinguishes modest beginner effects from long-term growth through levels, deep mastery, creative applications and optional evolution. The introductory Rat-step cap stays a current implementation fact, while the broader lineage has no automatically selected permanent ceiling. The following prior proposal wording is preserved verbatim; it was not a shipped progression restriction:

**Proposed distinction:** level measures development within a particular method; grade/rank identifies the method's available scope in its own system; the actor's body/source/resources determine what can actually be executed. A novice with an exceptional talent may possess a powerful narrow function. An ordinary high-level footwork technique can be excellent without becoming teleportation. No universal correspondence between one world's “B,” another world's “Epic,” a cultivation realm and a native skill level is proposed.

Develop the same basic move through learning, useful application and refinement. Native Evasion/Equilibrium growth supports it; a practiced Rat-step plus weapon familiarity can make a coordinated sidestep-and-thrust procedure. Comprehension improves reading a familiar cue, not mind-reading unknown enemies. Magical displacement, kinetic capture or damage redirection belongs to a separate eligible source/path or an earned structural evolution. Do not quietly add those properties to a basic movement skill because its proficiency counter is full.

Keep the existing native skill XP totals as the authority for ordinary skills. Keep current Rat-step provenance, ownership and proficiency0-12 as the authority for its existing content. The first new movement proof can derive novice/practiced/trained bands from that proficiency without converting old progress into a new global level scale. “Mastered basic form” still means a basic form.

## Compact Hanzi-field composition, superseded 2026-10-02

The earlier compact-column recommendation optimized for a small integration change. A later review recommends comparing it with an adaptive exploration layout before selection. Hanzi-field visual preference remains endorsed; no layout was accepted or implemented. The current answer belongs to [native-screen composition](WANDERING_ZONES_AND_INSIGHT.md#hanzi-field-preference-and-native-screen-composition-2026-10-02). Earlier proposal text is preserved verbatim below.

## Hanzi-field preference and native-screen composition, 2026-10-02

User response:

> Hanzi field is awesome, not shure how to best mix with original game tho

**Visual style endorsed; composition below is a recommendation.** Preserve the original game's character/inventory, journal/skills and location/action structure while giving wandering a spatial scene in the location column. Extract the field from the conversation mockup; its duplicate location heading, morning label, cargo count and separate detail sidebar are not all required inside the native screen.

Source checked 2026-10-02: `index.html` exposes `location_div`, `combat_div` and `location_related_div/location_actions_div`, with character/inventory and journal surfaces elsewhere. `style.css` places the location/action/combat surfaces in a 400-pixel column. `createExpeditionPanel` in `src/expedition_ui.js` already mounts a details panel in `location_actions_div` and submits action IDs using a read/command interface. This makes a shared selection/action surface a practical integration seam, not a completed general wandering controller. Fixed sizes need an explicit layout/height plan before a field is added.

| Mode | Proposed composition | Connection to ordinary play |
|---|---|---|
| Town / safe services | Keep the native location description and services; show a compact known-area preview only where it helps choose an outing | Shopping, training, reading, crafting and dialogue retain their existing flow. The Wander entry is an explicit supported assignment |
| Wandering | Below the location description, show a compact Hanzi field, current marker and one short action/status line; selected-object details and commands appear in the existing action panel below | Normal character stats, equipment, inventory, time/weather and journal remain available. Field cargo/XP changes publish to their normal owners |
| Encounter | Suspend wandering; show the relevant combat/encounter controls as the main central content and retain a small field inset or selected-position context | Combat shares the same actor, equipment, costs and aftermath. A combat presentation change cannot start native waves, duplicate reward or resume gathering before settlement |
| Return / preparation | Resume the native town/location view with retained discoveries in the journal and materials in inventory | An unlocked study, recipe, commission or hunt lead appears through the relevant normal action/quest adapter |

Start with a roughly 400-by-280-pixel field plus an explicit expand option, subject to actual layout review. Glyph inspection fills one shared action area; it does not overlay a second permanent action list on top of the original controls. Keep a compact list alternative for the same known targets. On narrow screens, stack location, field and actions while retaining accessible access to inventory/stats. A larger field can be explored without enlarging every base-game panel or requiring a full interface redesign.

Use the game's existing surface/control colors and borders for the surrounding chrome; keep the Chinese serif/glyph treatment, quiet terrain and clear marks inside the field. A small shared accent treatment can connect the field to selection/insight feedback. The existing calendar is the displayed clock; the source prototype's separate morning label is illustration. Avoid a second HP/stamina/currency/cargo authority or duplicate progress bars where native state already supplies them.

The first recommended integration proof is one outing accessible through a normal location action, a few real resource/clue targets, shared native inventory/skill outputs and one supported return/encounter path. This does not select the whole wooded-outing design or change the existing milestone. Acceptance: the user can enter from normal play, select the same target in field/list, see one matching action panel, return with a useful result and reload without duplicate costs or rewards; ordinary services and combat remain usable. A field mounted in the UI without those actual effects is only presentation setup.

This clarification changed documentation only. No native HTML/CSS/JavaScript, game bundle, save schema or personal save changed; no new gameplay build/test/browser result is claimed. Previous mockup checks remain dated above.

## Adaptive exploration composition, superseded 2026-10-02

The user selected keeping the original center action menu primary for now. The earlier field-primary recommendation below is historical; [current composition](WANDERING_ZONES_AND_INSIGHT.md#hanzi-field-preference-and-native-screen-composition-2026-10-02) owns the replacement. Preserved verbatim:

## Hanzi-field preference and native-screen composition, 2026-10-02

User response:

> Hanzi field is awesome, not shure how to best mix with original game tho

**Visual style endorsed; composition remains unselected and unimplemented.** The follow-up asks whether the compact embedding is really optimal. No live comparison establishes an optimum. The earlier recommendation optimized for a small integration change; an adaptive exploration layout remains a candidate to compare when its space is useful. The later [scope/timer review](WANDERING_ZONES_AND_INSIGHT.md#map-scope-and-timer-driven-first-integration-2026-10-02) recommends first depicting the existing expedition, without requiring a general wandering engine or broader screen redesign. Layout size and spatial simulation are separate decisions. [Prototype history](PROTOTYPE_HISTORY.md#compact-hanzi-field-composition-superseded-2026-10-02) preserves the earlier wording verbatim.

Source checked 2026-10-02: `index.html` exposes `location_div`, `combat_div` and `location_related_div/location_actions_div`, with character/inventory and journal surfaces elsewhere. `style.css` places location/action/combat surfaces in a 400-pixel column and uses a fixed-size `main_content` with many positioned panels. Those dimensions are current implementation facts, not selected requirements for the expansion. `createExpeditionPanel` in `src/expedition_ui.js` supplies a read/command interface, but its DOM mount is not an adaptive screen or completed wandering controller. Both candidate layouts still need the same real field/ownership/encounter adapters; squeezing into an existing slot does not remove that work.

| Layout candidate | Benefit | Cost and present recommendation |
|---|---|---|
| Compact field in the old column | Smallest presentation change and familiar always-visible panels | May make glyphs, routes and threat context cramped; repeated expansion can interrupt play. Retain as a prototype/comparison option, not the permanent size target |
| Adaptive exploration area | Gives the field enough space and keeps one selected-object/action surface; secondary panels can be opened or pinned when relevant | Needs responsive layout/panel bindings and careful focus/context preservation. Recommended candidate for the intended idle exploration experience, subject to actual play comparison |
| Full map-centered interface across the game | Potentially consistent spatial town/travel/combat presentation | Broadest UI/content conversion and risk of inventing meaningless coordinates for nonspatial services. Later option if tested interactions justify it; not necessary to prove one wandering zone |

### Five decisions that determine a good fit

1. **Map purpose and spatial contract.** Given the requested idle gathering/exploration loop, prioritize route/focus planning and observing the outing. Meaningful pockets, reachability, cover or return routes can justify a spatial field without immediately modeling every tree as a traversable tile. If tile position is later used for movement, sight or combat range, that rule must be authoritative and explained; presentation coordinates alone cannot imply free travel or a real attack distance. Terrain animation can improve atmosphere/presentation, but does not itself implement new exploration mechanics.

2. **Information priority and panel behavior.** Make the field the main exploration area with readable HP/stamina, current action, resources needed for the plan and danger/stop status. Keep one inspector/action panel. Inventory, full skills and journal remain normal native domains but can be opened or pinned; active skill gains and important inventory changes stay visible in compact feedback. Towns can prioritize services and preparation without discarding the common field/selection vocabulary. Do not hide a frequently used loadout control merely because it saves width.

3. **Encounter continuity and idle agency.** Keep the selected encounter's position/route context visible while enemy information, supported cues and battle commands appear alongside it. Automatic plans use the same commands as direct action and stop at their declared unsupported case. If the current native combat presentation must temporarily take more space, visibly suspend wandering and restore the same target/route afterward. This does not assume spatial battle rules are already implemented or make opening an inventory panel a simulation-pause rule.

4. **Readable glyphs and responsive composition.** A stable glyph vocabulary, quiet terrain, foreground hierarchy and bilingual selected details matter more than using characters everywhere. Give the field adequate space rather than shrinking the entire old screen. On narrow screens, stack/reflow text and actions around a usable field; retain view, selected target, focus and scroll through transitions. Saved view/pin preferences should not change the trip's time, draws or costs. Match surrounding navigation/control styles enough to feel like one game while allowing the field's own typography and atmosphere.

5. **Acceptance through real tasks.** Compare compact and adaptive layouts on the same supported outing and known information. Have the user find/gather a resource, interpret a threat, inspect/change a legal preparation, understand the running/paused plan and return/use the result. Observe wrong selections, repeated panel/expand switches, readability and loss of context; no arbitrary numeric score is accepted here. The shared transaction/reload/native-service regression gates still apply. One attractive screenshot or a scripted visual study does not establish which layout is best in play.

Primary design comparison checked 2026-10-02: Cogmind's developer [history/theory](https://www.gridsagegames.com/blog/2024/01/full-ui-upscaling-part-1-history-and-theory/) connects visible map area to what the player must perceive, while its [layout mockups](https://www.gridsagegames.com/blog/2024/01/full-ui-upscaling-part-2-holy-mockups/) discuss keeping frequently used equipment accessible and making stored inventory optional/dynamic. That is a useful tradeoff to investigate, not proof that Cogmind's exact layout fits YAIRPG. [W3C reflow guidance](https://www.w3.org/WAI/WCAG21/Understanding/reflow) distinguishes inherently two-dimensional maps from surrounding text that should reflow. Our inference is to preserve the field's legibility while adapting the supporting panels, rather than scale the whole fixed legacy layout.

The proposed first new wandering gameplay proof remains one outing accessible through a normal location action, a few real resource/clue targets, shared native inventory/skill outputs and one supported return/encounter path. It is separate from the earlier, smaller display integration now recommended in the scope/timer review. If the new outing is selected, deliver its real controller/command bridge and compare compositions using that same state. A responsive exploration surface can adopt selected native panels incrementally. This does not select the whole wooded-outing design, final panel defaults or a larger milestone.

This review changed documentation only. Source layout and primary design references were checked; no comparative native playtest, new composition mockup, gameplay implementation, build or runtime test was run. Previous visual-study checks remain dated above. Hanzi-field style endorsement remains the accepted visual preference; adaptive placement is the revised recommendation, not an accepted or proven optimum.

## Hidden-chief unselected status, superseded 2026-10-02

The user endorsed the hidden-strength concept and requested scoping against existing systems. [Current prototype scope](ENGINE_EXPANSION.md#village-elder-hidden-strength-prototype-scope-2026-10-02) uses the existing Village elder as a reversible content candidate. Numerical balance, specific backstory and implementation remain pending. Earlier exploration status and example are preserved verbatim:

**Requested exploration; examples remain original proposals.** [User vision](USER_VISION.md#npc-power-levels-and-secretly-powerful-characters-2026-10-02) records the question about everyone having a power level and attacking a secretly powerful village chief. This refines [open-world actions](CHARACTERS_AND_WORLD_EVENTS.md#open-world-actions-reputation-law-and-karma-2026-10-02), functional enemy powers and world danger profiles, without selecting the chief as a hidden master or adding a universal rank ladder.

Optional original example: an apparently ordinary chief stops a novice's wrist with a practiced movement, offers a supported withdrawal, and leaves a movement observation plus personal distrust if witnessed. An earlier scene or manual margin note could foreshadow the method. Later training or a compatible counter changes the same encounter. Restraint, observation reward and a teaching route require actual supported handlers; this is not current gameplay, a selected chief identity, or a scripted forced-loss guarantee.

## Expansion balance proposal status, superseded 2026-10-02

Weibao endorsed using the reviewed guidance and requested other considerations/similar games. [Current owner](DIRECTION_SYNTHESIS.md#expansion-and-balance-policy-2026-10-02) records accepted review principles; exact rates, content, controls and implementation remain proposed. Only the prior status/introductory wording is retired here; the five principles and illustrative scenario remain available in their owner. Earlier wording is preserved verbatim below. Its old fragment identifiers are historical, not current navigation.

### Expansion and balance policy, proposed 2026-10-02

The user asks about expansions and Your Chronicle's balance. [Verified reference findings](RESEARCH_IDLE_GAMES.md#your-chronicle-expansion-and-balance-follow-up-2026-10-02) distinguish developer statements from inference. The following is an original proposal for this game; it does not select exact rates, chapters, retention, a universal cap or another prestige layer.

Former PROJECT.md entry, preserved with its original root-relative links:

```markdown
Requested expansion/balance comparison, 2026-10-02: use Your Chronicle to consider growing content and progression, interacting bonuses, viable paths, waiting and management effort. [Verified developer evidence](RESEARCH_IDLE_GAMES.md#your-chronicle-expansion-and-balance-follow-up-2026-10-02) and [expansion balance proposal](DIRECTION_SYNTHESIS.md#expansion-and-balance-policy-proposed-2026-10-02) distinguish content/alternative/power/automation additions and their acceptance questions; [runtime contract](ENGINE_EXPANSION.md#expansion-balance-and-combination-contract-proposed-2026-10-02) owns integration. Exact equations, targets and content remain proposals, not an endorsement of the reference's balance. No gameplay or milestone changed; preserve current playable review and one realm/one prestige layer.
```

## Standalone party inventory study, superseded 2026-10-02

The user requested following the original UI. Current direction belongs to [the inventory owner](CHARACTERS_AND_WORLD_EVENTS.md#inventory-surface-proposal): native panels, center menu, compact item controls and equipment slots. The earlier separate, light/olive party window is no longer the preferred presentation. Its original conversation fragment is preserved as `party-inventory-standalone-study.html` alongside the task's visualization files; the active study keeps `party-inventory.html` and now follows the original interface. Neither study is native gameplay.

Earlier owner paragraphs, preserved verbatim:

> Reuse the existing inventory area with a compact owner selector: **You / named member / shared supplies**. The chosen member shows their role/location/availability, bag and equipment, plus later supported skills, orders and history. The center menu remains the main exploration surface. A total-supplies view may summarize the real bags while showing who holds each usable quantity; its totals do not create another storage owner.

> A conversation-only **Member inventory** study uses fictional You/Mei/shared supplies. It demonstrates owner switching, a weapon-slot swap, giving one available item, a private guide lent with retained ownership, protected reservation quantities and a demo snapshot reload. It is separate from the repository runtime and user saves. Browser inspection verified the loan survived demo reload, a transfer left the reserved herb unavailable, and a weapon swap/reload moved the old weapon into the bag. At a 320px viewport, measured root width/scroll width both equal 288px and bag/equipment sections stack. These checks prove the mockup's stated interactions, not native party saving or cross-session save compatibility.

## Fixed-yield craftsman candidate, superseded as shipping scope, 2026-10-02

The user requested more explicit base-game, engine-size and complexity consideration. Village already gathers Rough wood log and occasional Tree sap, with native tool/skill/introductory access. The current [engine owner](ENGINE_EXPANSION.md#gathering-and-character-interaction-implementation-scope-2026-10-02) recommends a thin commodity exchange and earned native activity first, with larger production/actor/site work separately scoped. The earlier fixed-output timings and mandatory structured-record migration were proposals, not accepted balance or implemented gameplay. They can inform synthetic adapter fixtures but no longer specify the first shipping path.

Earlier engineering section, preserved verbatim (including its dated source/test boundaries):

```markdown
## Gathering and character-interaction implementation scope, 2026-10-02

**Delivery: current source audited and scope prepared; no gameplay implemented.** The user asked how to implement the saved gathering/interaction ideas according to the engine, including required improvements and further considerations. [Creative scope](GATHERING_AND_RESOURCE_USES.md) retains alternatives. Audited base: `97c28efece4fd6248b6f075ad0c6927c3d0432df`, branch `codex/gameplay-foundations`; [fingerprints](research/gathering_engine_scope_inputs_2026-10-02.json) identify source and dirty pre-addition owners. Fresh `npm test`: **54 pass, 0 fail**. This proves existing named contracts, not these future adapters. [Playtest checkpoint](PLAYTEST.md#gathering-and-interaction-engine-scoping-2026-10-02) owns verification limits.

Implementation approach: reuse native inventory/skills/content and the expansion's **preview → stage → save one envelope → publish → render** path. Most new work is explicit adapters and validated records. A general ecology engine, freeform AI, party combat and a new map are not prerequisites for a gathering/relationship proof. The endorsed elder scope remains available; this packet does not replace its priority or require building it and the apprentice scenario first.

### Five packages and dependencies

| Package | Reuse verified in source | Scoped improvement, affected files and dependency |
|---|---|---|
| **G-A. Saved gathering commands** | `LocationActivity.getActivityEfficiency`, native activities/tools/items; `commitAction`, frozen jobs/draws, `stageAcquisition`, gameplay/persistence/publication | Add one authored timed collection batch and command-time checks for location/access, equipment, native gathering unlock and occupation. Bind Woodcutting and its Gathering mastery parent to existing XP. First output/duration may be explicitly fixed prototype values; a later native-activity adapter must freeze the actual native interval/yield/chance/quality policy with supplied saved draws. Scope: `expedition_content.js`, `main.js`, existing transaction modules; extract `gathering.js` only when settlement/resume rules exceed declarative actions. Native `main.js` gathering currently calls Math.random and directly publishes XP/items, so its loop is not already a saved production transaction |
| **G-B. One actor and one agreement** | Registered native NPC personal bags and dialogue progress; generic ownership transfer/publication; existing scoped actor facts | Bind the existing `oldCraftsman` to one validated expansion actor record, without duplicating the native person. Add a pure `actor_interactions.js` handler for a stated material-for-instruction agreement, participant/access validation, one retained cause/settlement and changed later offer. The NPC can be an inventory-only receiver; no NPC XP, combat build, autonomous controller or money endowment is required. Scope: `data/npcs.js` only if registration needs adjustment, `main.js`, `acquisition.js`, `expansion_engine.js` validation/migration, interaction content/read model. Depends on G-A's transaction boundary. Share actor/cause/claim validators with peer/elder work |
| **G-C. Earned methods and selected native unlocks** | Primitive known facts/capabilities, technique provenance, recipe availability, native XP/stat milestones | First lesson can grant a retained collection-method fact that changes a real authored action. It need not unlock a native recipe. When a recipe/skill/quest unlock is selected, add its staged native availability/reward handler before accepting inputs; `prepareGameplayPublication` currently rejects such milestone crossings. Native `use_recipe` calculates batches and mutates live state, so a selected craft needs a pure calculation/staging adapter, not a callback after saving. Scope: gameplay publication/transactions/persistence, availability/rewards, selected recipe/main handlers; reuse the formulation packet. Mutable charged/affixed items require additional reconstruction and are later work |
| **G-D. Common time and one persistent site** | Ordered `advanceSimulation`, calendar deltas, world resources/facts and native location unlocks | Add a `simulation_clock.js` bridge with a saved enrollment anchor and a consumed/remaining-time result honored by native `update_timer`. Only then add `resource_sites.js`: one site, access/owner, a finite stock or one recovery boundary, one functional improvement and exactly-once harvest/project settlement. Scope: engine schema/validators, main timer/save/load, site content/read model. Depends on G-A/B and coherent clock publication. A broader botanical/ecological simulation is not required. Native calendar boundary findings need correction/tests before the selected seasonal or long-jump rule relies on them |
| **G-E. Center-menu views and earned routines** | Native location/action surfaces, stable buttons and pure preview pattern in `expedition_ui.js` | Show Inspect, Collect, agreement terms, known method and later response through the retained center menu; keep existing inventory/skills/journal as their owners. Render IDs and known information, submit the same validated commands. Later add a saved routine cursor, supply target/reserves, fallback and stop reason using G-A/B/D commands. Scope: `display.js`, `main.js`, a narrow `gathering_ui.js` if needed, engine plan validation. UI is required for the first proof; general automation waits for direct commands and site/time behavior to pass. Prevent duplicate action cards in the existing expedition panel |

**Dependency order:** G-A plus the UI portion of G-E gives a saved material output; G-B/C completes one meaningful exchange and later choice. G-D enables regeneration, plant growth, independently changing availability and NPC jobs. Routine automation follows those supported commands. A native crafting adapter is required only when the selected result actually crafts or unlocks native content. Combat/life/equipment adapters remain dependencies of encounter, injury, theft or companion combat, not of a simple commodity agreement.

### Bounded first candidate

Proposed original scene, not a selected balance rule: a small local willow collection task started from Village's center menu, plus a collection lesson from its existing craftsman. This is an explicitly authored local task; it does not enter Forest lake, bypass that location's combat or claim to port its ordinary gathering probabilities.

1. Inspect the task and craftsman's terms without spending time, RNG or resources. Show native gathering/tool/access requirements and costs before commitment; inspection remains available when collection is blocked.
2. Commit a four-minute batch yielding three native Piece of willow wood and one Tree sap, with a fixed native Woodcutting XP award. Values are reversible prototype choices. Persist the selected batch before playback; prevent concurrent native training, work, reading, combat or another player assignment.
3. Keep/sell the output through existing play, or transfer two carried Tree sap to the craftsman's actual personal inventory for one authored selective-collection lesson. The transfer, retained cause, agreement settlement and knowledge grant commit together. The craftsman's expertise/lesson is original content, not an assertion of an upstream teaching offer.
4. The learned method opens a six-minute collection action yielding one wood and two sap, with an explicitly authored XP award. The two plans favor different supply goals; no new universal skill or second material currency. Repeat dialogue cannot award the same lesson twice. The later response references the fulfilled agreement.
5. Return/reload and compare the two methods, actual bags and changed offer. This delivers a small gathering/use/relationship loop. Gardens, loans, privately mutable tools, autonomous NPC work, research minigames and general automation remain follow-on alternatives.

The native Woodcutting/Gathering mastery declarations inspected here have no content-unlock milestone, making this a narrower XP proof than the alchemy proposal. Still revalidate the actual staged award and parent gains at command start; a future content change cannot silently bypass an unsupported unlock. Existing native collection, craftsman tool-gift dialogue and quest completion must retain their behavior.

### State and compatibility

Use the **next coordinated expansion schema**, proposed schema4 while current code remains schema3. If another scoped increment lands first, extend that migration rather than introduce a competing version or overwrite its records. Current primitive facts can represent the learned method, but structured actor bindings/agreements/causes need validators; schema3's unchecked extra properties are not a compatibility strategy.

| State authority | First exercised records / later extension |
|---|---|
| Native `inventories.person.main_character` and `.oldCraftsman`; native player skill progress | Sole ownership/XP stores. An NPC personal bag is distinct from trader stock. `plan.gameplay.player.inventory` publishes the player once; `plan.ownership` binds only the other owner, following native trade's pattern |
| `expansion.actors.frontier.craftsman` and `actors.player.facts` | Validated nativeRegistryId/world/location/initialization reference plus the relevant directed relationship/known cause; player owns the learned-method fact. No combat body/profile or invented old grievance is required |
| `expansion.worlds.base.frontier.claims` and `.causes` | One typed agreement instance with participants, revision, exact terms, eligibility, open/settled/cancelled status and settlement receipt; retained transfer/lesson cause and disclosure. Reuse the existing proposed claim/cause family rather than create a separate agreement ledger. These invariants survive the 100-entry prose-history cap |
| Later world `.sites`, clock binding and actor routine record | Site definition/revision, location/access, stock/project/reservation and next supported boundary; enrollment/consumed-time anchor; optional plan cursor/reserves. Add only exercised state with its validating migration and command handlers |

Schemas1/2/3 migrate additively while retaining pending draws/due times/costs, techniques, RNG/sequence, native NPC progress and dormant payloads. Old saves gain no sap, XP, lesson, fulfilled agreement or elapsed growth. Initialize new contextual records through one explicit command; do not seed rewards on load. Keep the importer real-loader probe and future-schema rejection. Existing jobs retain their remaining duration when a common epoch is enrolled.

### Execution packet and acceptance

**GOAL / OWNER:** deliver the five-step collection → exchange → learned alternative → later meeting loop; Weibao reviews its usefulness, writing and balance. **AUTHORITY / WRITER:** this request scopes implementation; it does not select every package or authorize delegation/publication. A future builder owns the chosen source/schema slice and refreshes the fingerprints against live work. **DO NOT TOUCH:** private saves/exports, unrelated dirty work, attribution/LICENSE and retired content. **NEXT ACTION:** define the minimum actor/claim/cause migration and pure agreement transaction using synthetic owned inventories, then connect the existing timed collection planner and center-menu controls. The planned transaction must reject before spending if any later output/unlock cannot be published.

Meaningful checks for the future build:

| Gate | Required evidence |
|---|---|
| Conservation and agreement identity | Both personal inventories match the exact transfer; stale terms, missing quantity, wrong actor/location, busy player and repeated settlement cannot spend or grant again. Failed storage publishes no material, XP, knowledge, claim or relationship change |
| Persistence and migration | Generated fresh and progressed saves reload mid-batch, after output, before/after exchange and after the alternate batch. Real-loader export/import preserves all new records and old craftsman/quest/Rat-step state. No migration reward or reinitialized bag |
| Time and routine consistency, when selected | One long supported advance equals smaller advances and a mid-boundary reload. Retain unspent time at a blocking choice/transition limit; no native calendar advance beyond the settled boundary. Native ordinary work cannot run alongside the player's saved batch. No closed-browser claim without a separately tested policy |
| Known views and content changes | Inspection/view changes produce no draw or mutation; unknown actor/site details stay undisclosed. Required tool/access and quantities are checked again on command. Frozen commitments retain promised results through supported definition updates, while unsupported saved references reject safely |
| Playable and regression evidence | Relevant transaction/migration/resolver tests, `npm test`, `npm run build`, then the rebuilt fingerprint in an isolated fresh localhost origin with generated fixtures. Show real inventory/XP, the fulfilled agreement, changed later response and two useful output choices. Human design acceptance remains separate from technical checks |

Further engineering concerns: bounded actor/site transitions and writes per advance; shared site/participant reservations before another actor's work can conflict; effect order and resource/time floors in combinations; observer-specific information rather than passing secret truth into UI rules; and explicit recovery/cancellation/renewal terms. Implement each when its chosen scene exercises it, using the existing owners. These are reasons to grow shared services through contrasting playable cases rather than build all five proposed systems in advance.
```

Former PROJECT.md entry, preserved verbatim with its original root-relative links:

```markdown
Requested engineering scope, 2026-10-02: [gathering/interaction implementation](ENGINE_EXPANSION.md#gathering-and-character-interaction-implementation-scope-2026-10-02) maps that design to five existing-engine packages and their dependencies. One timed native-material batch, an agreement with the existing craftsman and a learned collection alternative form the smallest proposed candidate; common-clock sites, selected crafting and routines follow only when needed. Shared actor/claim/migration work must compose with the peer/elder scopes. Source rechecked and 54 existing tests pass; concrete content/order remain proposed and no gameplay was implemented by this scoping pass.
```

## Pre-chronicle implementation status, superseded 2026-10-02

The World chronicle now has source and rebuilt-browser delivery. PROJECT.md owns current status; the earlier header is preserved verbatim:

Status: v0.6 foundation with atomic native trade, shared acquisition, Village packing and a saved Rat-step learning/practice/execution slice implemented, 2026-10-01. Build, 54 tests and generated-save browser checks pass. Human design/balance acceptance remains pending; evidence and limits are in `docs/PLAYTEST.md`.

## Pre-platform current-state snapshots retired, 2026-10-02

The schema5 shared platform replaced these earlier live summaries. They are preserved verbatim for provenance; PROJECT and the current engine entry now own delivery state.

### Retired PROJECT.md snapshot

Current implementation: the v0.6 YAIRPG foundation plus expansion schema3, the provisional Village field journal and Technique notebook. `src/expansion_engine.js` owns scoped state, immutable definitions, preview/commit rules, reserved costs, persisted draws, frozen pending effects and weighted roll receipts, ordered deadlines, bounded history and isolated checkpoints. `src/gameplay_transactions.js`, `src/gameplay_publication.js` and `src/expansion_persistence.js` stage inventory, fixed skill XP including parent inheritance/stat milestones, signed reputation and money in one save envelope before native publication. `src/capabilities.js` queries skill/equipment providers and earned sources with explicit sum/max stacking, conditions, provenance and duration. The journal now offers kit, reusable rope/practiced anchors and strength routes, real skill rewards, a 20% Field eye discovery and a later money/reputation consequence. Browser Web Locks permit one writer per release; other tabs remain read-only. Native activities cannot start while an expedition occupies the player. Jade Hollow stays archived and dormant data stays preserved.

### Retired PROJECT.md snapshot

Next gate: Weibao's playable review of shop/service pricing, route usefulness and the optional Rat-step drill. Native quote/ownership and the packing service are implemented. The smallest technique slice now connects enemy evidence, study, active/idle practice, ownership and a usable expedition. Broader C/D/E packages remain proposals; durable donor theft needs a real actor/claim bridge before implementation. Authored party progression, bloodline inheritance/awakening, physiology, persistent NPC arcs, identity transfer, automation, offline wall-time replay, global rebirth and historical rollback remain unimplemented. Isolated checkpoints and multiple actor budgets are unit-tested contracts. No second world or prestige layer was added.

### Retired IDEA_INDEX.md snapshot

The current playable review remains the Village shop/service, expedition routes and optional Rat-step technique loop described in PROJECT.md and PLAYTEST.md. Saving more ideas does not replace that gate or imply their acceptance.

The endorsed hidden-strength concept is scoped on the [existing Village elder](ENGINE_EXPANSION.md#village-elder-hidden-strength-prototype-scope-2026-10-02), with a saved encounter and narrow remembered aftermath; the latest request reinforces using that existing character. [One apprentice and one crossing disruption](CHARACTERS_AND_WORLD_EVENTS.md#first-proposed-proof) remains an unselected alternative for independent actor/world development. Both are unimplemented; integration scope belongs to ENGINE_EXPANSION.md. [Earned opening restart](DIRECTION_SYNTHESIS.md#earned-opening-restart-proposed-2026-10-02) is a separate requested progression direction with proposed policy, not a completed prerequisite for the elder scene.

Enemy-life investigation, 2026-10-02: [life beyond encounters](CHARACTERS_AND_WORLD_EVENTS.md#giving-enemies-life-investigation-2026-10-02) refines I14/I16/I18/I20/I23 with a smaller staging proposal: one Village peer, a shared optional work claim, cooperation/nonlethal contest and one paid/timed response with a later payoff. [Source audit and implementation packet](ENGINE_EXPANSION.md#persistent-peer-source-audit-and-implementation-packet-2026-10-02) owns the exact adapter/migration/native-combat/clock work and acceptance gate. The storm/title/loan variants remain available in their owner. Investigation is complete; gameplay, schema4, controllers and new browser verification are pending.


## Home-world framing before branch-dimension selection, 2026-10-03

Superseded current-state wording retained verbatim. PROJECT.md now owns the selected alternate-dimension framing; USER_VISION.md preserves the sequence of direct requests. This retirement changes no saved world ID or native gameplay.

### Retired PROJECT.md framing

Confirmed refinement, 2026-10-03: Weibao wants the original YAIRPG world fully expanded too. It needs its own substantial regional stories, existing-system development and long-term progression, with useful reasons to remain or return as other worlds develop. The one-realm/one-prestige milestone sequences delivery; it does not make the home world only an opening tutorial or require cultivation/prestige to replace ordinary adventure. A parallel-universe version of the world upstream is building is an explored framing, not a selected continuity or a claim to know upstream's unfinished canon. [Home-world and divergent-continuity proposal](DIRECTION_SYNTHESIS.md#full-home-world-and-divergent-continuity-proposal-2026-10-03) owns the recommended framing and expansion considerations; [User vision](USER_VISION.md#full-original-world-expansion-and-possible-parallel-continuity-2026-10-03) retains the request. Exact local arcs, native power rules, branching point and implementation order remain proposals. This refinement changes project direction documentation only.

### Retired DIRECTION_SYNTHESIS.md framing

[PROJECT_LOG.md](gm/PROJECT_LOG.md#agreed-direction) owns the confirmed requirement to fully expand the starting YAIRPG world. The parallel-universe framing and the choices below remain proposals. This section changes no gameplay, saves or native unlocks.

Execution update, 2026-10-03: the user authorized proceeding while preserving the vanilla experience. [Optional town chapter](gm/PROJECT_LOG.md#optional-town-chapter-2026-10-03) owns the delivered first contract and compatibility. Native opening/quests/dialogue remain available and town access is opt-in. The broader regional catalogue and final cosmology remain proposals; a separate untouched upstream build was not selected or shipped.

Recommendation: treat our home world as a divergent continuity built from the inherited YAIRPG setting. Keep recognizable geography, people, ordinary professions, equipment, humor and opening mysteries, then extend them with our own regional arcs and local rules. A technical fork does not require a visible multiverse explanation, two playable copies of the same world or waiting for an unpublished upstream story to be finished. An explicit parallel-world identity can become fiction later if it creates useful choices.


## Unconditional dimension label before knowledge-aware presentation, 2026-10-03

Retired current-state presentation claim retained verbatim. Authorial world identity stays in the registry; PROJECT.md now owns the separate player-knowledge rule. The earlier browser proof remains a dated account of the old UI.

The current campaign is the YAIRPG-derived branch dimension, with working name **YAIRPG: Parallel Frontier**. The native location header shows **YAIRPG · Branch dimension**; its tooltip identifies the source and alternate continuity. The stable saved world ID remains `base.frontier`, so existing characters, jobs, facts and receipts are not moved or reset. Metadata and presentation identify the already expanded adventure; they do not create a second playable world.


## Notebook Journal and explicit unknown labels before the separation pass, 2026-10-03

Superseded PROJECT.md current-state wording retained verbatim. PROJECT.md owns the revised local-notes/quest separation and quieter discovery presentation. Prior dated browser evidence remains historical.

The current campaign is the YAIRPG-derived branch dimension, with authorial working name **YAIRPG: Parallel Frontier**. World name and branch identity can each be unknown, both in authored metadata and in the character's knowledge. The native header and Journal show **Unknown world · Unknown branch** until explicit saved discoveries establish each field. A learned name can appear while branch status remains unknown, or vice versa; tooltips follow the same boundary. The neutral public-name placeholder **Frontier** is a proposal for a future discovery, not automatically awarded knowledge. The stable saved world ID remains `base.frontier`, so characters, jobs, facts and receipts are not moved or reset. [Archived header wording](PROTOTYPE_HISTORY.md#unconditional-dimension-label-before-knowledge-aware-presentation-2026-10-03) retains the earlier unconditional note.

Requested and implemented: unknown world/branch identity plus improvements to UI and menus. `worldIdentityView` reads separate saved actor facts `world.<worldId>.nameKnown` and `.branchKnown`; missing old-save facts stay unknown. A flag cannot reveal a name or continuity that the author has left unknown. World discoveries do not leak across worlds, and native tooltips/Journal do not expose hidden registry labels. Actual discovery scenes remain later authored content; no debug/reveal button or automatic identity award is added.

The original center menu keeps native travel, dialogue, gathering and other controls. Extension panels now share a compact **Notebook** with **Here**, **Practice**, **People** and **Journal** tabs. Here emphasizes the current location; town play no longer stacks unrelated Village route, elder and training panels. The notebook appears after familiar story access or retained expansion progress, rather than covering fresh character creation. Active saved work/practice/encounters select their relevant view once and open its controls; changing tabs during that work is respected. Keyboard navigation, stable controls, saved timed-practice cancellation in Practice, fewer duplicate counters, collapsible preparation details and hidden completed one-time workshop actions improve the first UI pass. Journal combines retained player events with discovered chronicle/simulation information.

Compatibility: schema5 and native registries remain unchanged. Knowledge uses the existing extensible actor-fact owner; absent fields disclose nothing. The menu selection is presentation-only and does not pause jobs, change balance or enroll life/world services. Original quests, NPC definitions, inventory owners and personal saves are preserved. Full native-panel responsive redesign, world discovery scenes and dimensional travel remain separate work. [Playtest](PLAYTEST.md#knowledge-aware-identity-and-notebook-ui-proof-2026-10-03) owns browser/save/focus verification; visual and wording acceptance remain human gates.


## Notebook in the location menu and mostly cosmetic Bio before relocation, 2026-10-03

Superseded PROJECT.md current-state wording retained verbatim. PROJECT.md now owns the Journal placement and derived Bio views; earlier dated browser proofs remain historical.

The original center menu keeps native travel, dialogue, gathering and other controls. Extension panels share a compact **Notebook** with **Here**, **Practice** and **People** tabs for local observations and available interactions. Here emphasizes the current location; town actions appear only where they can be performed. The redundant Journal tab and combined event feed were removed after Weibao flagged overlap with Quests. The notebook appears after familiar story access or retained expansion progress, rather than covering fresh character creation. Active saved work/practice/encounters select their relevant view once and open its controls; changing tabs during that work is respected. Keyboard navigation, stable controls, timed-practice cancellation, collapsible preparation details and hidden completed one-time workshop actions remain implemented. Panels retain relevant known aftermath; the office's last exchange is collapsed.

The user authorized implementation of the Proto23-inspired discovery, practical knowledge, NPC response, home and recurring-service direction. The original center menu now includes a compact Village discoveries notebook after the elder greeting. This adds no world, prestige layer or forced reset. [Engine owner](ENGINE_EXPANSION.md#proto23-inspired-village-life-runtime-2026-10-02) records implementation and further engine considerations; [playtest owner](PLAYTEST.md#village-life-browser-and-save-proof-2026-10-02) records verification.

The checkout contains skill levels and milestones, gathering/training/jobs, combat stances, equipment and crafting, quests/dialogues, locations/travel, weather/time and reputation. The first source and save audit is recorded in `docs/BASELINE_AUDIT.md`; browser smoke testing does not establish full upstream-content coverage. The v0.6 foundation supports configurable race/height stat bonuses, disabled by default and unbalanced upstream. Character biography remains mostly cosmetic; no new race progression is selected.


## Character proposal status before the independent-actor update, 2026-10-03

Requested exploration and saved ideas, 2026-10-02: develop character implementation proposals with persistent or episodic enemies/peers, independent AI goals, other characters' inventories/equipment, traits, titles and spontaneous life/world events, including things that occur without player initiation. [Characters and world events](CHARACTERS_AND_WORLD_EVENTS.md) owns the combined proposal; [idea index](IDEA_INDEX.md) makes earlier research and new ideas discoverable; [runtime contracts](ENGINE_EXPANSION.md#character-and-world-event-contracts-requested-2026-10-02) owns integration. This accepts saving and exploring the direction, not a cast, AI provider, event rate, title rule, lethal/offline-loss policy or the proposed apprentice scenario. Durable NPC controllers, persistent personal possessions/claims and broad spontaneous event generation remain unimplemented. Current playable review and the one-realm/one-prestige milestone remain in place.


## Local People tab before persistent discovered records, 2026-10-03

Superseded PROJECT.md current-state wording, preserved verbatim. The discovery-aware menus section in PROJECT.md now owns behavior.

The original location menu keeps native travel, dialogue, gathering and other controls. Extension panels now live in a dedicated **Notebook** tab in the existing Journal area beside Quests, Bestiary, Anthology and Data. Its **Here**, **Practice** and **People** tabs provide local observations and interactions without taking space in the movement menu. Here emphasizes the current location; town actions appear only where they can be performed. The redundant inner Journal tab remains removed. The Notebook tab stays hidden before familiar story access, an enrolled life/simulation, retained technique/town progress or active work. Newly waiting work/practice/encounters open Notebook and their relevant section once; subsequent player tab choices are respected. Keyboard navigation, stable controls, timed-practice cancellation, collapsible preparation details and hidden completed one-time workshop actions remain implemented. Panels retain relevant known aftermath; the office's last exchange is collapsed. This placement is a reversible UI proposal for playable review.


## Body, recovery and recognition proposal before implementation, 2026-10-03

Superseded PROJECT.md wording retained verbatim. PROJECT.md now owns the bounded body runtime and its remaining broader limits.

Further considerations, still proposals: separate inherited traits, acquired training and temporary conditions; describe physical changes only when an actual training/injury/lineage mechanic creates them; and let NPC recognition follow observed changes rather than automatically knowing private traits. Recovery, aging, scars, visible physique, bloodline transformations and associated dialogue need authored rules and discovery boundaries. The existing life/body/source/relationship services are groundwork. This UI increment does not implement those new progression families or force aging, a bloodline or a new world.

## Design resume before the connected workshop implementation, 2026-10-03

The planning-only resume was replaced with the implemented scope in PROJECT.md. Its exact earlier text follows.

## Design session resume point, 2026-10-03

Scope saved: deep local campaigns lasting many sessions; cooperating systems for energies/elements, location interactions, learning/projects, bases/institutions, independent actors, contextual events, pursuit and lasting consequences. [Idea index](IDEA_INDEX.md) routes each family to its existing owner; [direct requests](USER_VISION.md#long-world-campaigns-and-parallel-systems-2026-10-03) retain provenance. These are requested design areas, not completed feature families.

Reference selection: Amazing Cultivation Simulator and Caves of Qud are endorsed for targeted research, with particular interest in Qud's nuance. [Reference owner](NICHE_GAME_REFERENCES.md#endorsed-simulation-references-2026-10-03) and [source comparisons](RESEARCH_IDLE_GAMES.md#selected-simulation-references-and-living-world-implementation-2026-10-03) retain A Dark Room's interface/discovery pattern and bounded Mother of Learning/The Perfect Run examples. Other titles and source worlds remain candidates.

Where we left off: [five proposed work packets](ENGINE_EXPANSION.md#five-work-packets) define disjoint feature writers and one integrator for shared contracts, native bindings and persistence. [Situation/readiness proposal](CHARACTERS_AND_WORLD_EVENTS.md#autonomous-situations-readiness-and-selective-intervention-2026-10-03) and [interface/foreknowledge contracts](ENGINE_EXPANSION.md#interface-integration-autonomous-situations-and-foreknowledge-2026-10-03) cover choosing whether to observe, assist, intervene or defer, and separating previous-timeline expectations from current evidence. [Random inspiration](ENGINE_EXPANSION.md#targeted-research-and-inspiration) includes both authoring combinations and in-game clues developed through actual practice/discovery.

Open choices remain source-world roster/era, energy policies, prestige retention, danger and missed-opportunity consequences, active/idle tuning and browser-closed advancement. The 80-90 percent routine-execution automation figure is a testing hypothesis, not accepted balance. Preserve the vanilla opening, private saves, one-realm/one-prestige first milestone and the distinction between implemented, rebuilt-browser-verified and human-accepted behavior.

Completed here: research selection, source-backed comparisons, proposed architecture/parallel packets and integration gates are saved. No runtime feature or new browser verification was added by these design/capture turns, and no builders were dispatched. Existing dirty work and independently added research remain preserved. A user-requested memory update note points back to these repository owners rather than replacing them.

Proposed resume action: refresh the live source against the packet's dirty-input snapshot, then establish the P5 extension interfaces/generated fixtures for P1 energy and P2 site-project work. P3 pursuit and P4 scenes can develop against those contracts as slots permit. The combined playable gate is preparation and a useful facility, an independently developing local situation or pursuit, a supported response, and saved later consequences through the real native interface. Execution still requires the relevant runtime and human review gates.
