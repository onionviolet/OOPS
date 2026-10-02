# Superseded cultivation prototype and planning state

Archived 2026-10-01 after the user requested a return to the YAIRPG foundation. The following records prior planning and verification; it is not the current build status.

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
