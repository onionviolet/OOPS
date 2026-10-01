# Superseded cultivation prototype and planning state

Archived 2026-10-01 after the user requested a return to the YAIRPG foundation. The following records prior planning and verification; it is not the current build status.

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

Next proposed playable increment: one ordinary expedition/event using explicit facts, explainable requirements and a recorded outcome. [The broken crossing](docs/NEXT_EVENT_PROPOSAL.md) supplies one minimal peer-rescue premise, two approaches and later aftermath for review; premise and consequence severity remain the creative decision. Add simulated deadlines and reset ownership only as needed by that event. `docs/ENGINE_EXPANSION.md` owns the architecture proposal, `docs/DIRECTION_SYNTHESIS.md` the broader creative proposal, and `docs/RUN_DEFINING_ADVANTAGES.md` the origin comparison. No event plot, book world, origin roster or exact balance has been accepted.


### Superseded standalone-rules architecture status

Date: 2026-10-01. Source-grounded architecture proposal, not implemented engine functionality.

Shared rules status, 2026-10-01: `src/rules.js` provides three pure primitives: explicit fact rules with all/any/not and requirement explanations; validated graded outcome selection from a caller-supplied draw; and a serializable resolve-once receipt. The earlier cultivation integration is now archived in `prototypes/jade-hollow/cultivation.js`; no active gameplay imports that prototype. Unknown facts are distinct from false facts, including negation. Outcome/receipt primitives are tested but not connected to story events or the game save envelope; they do not implement resource transactions, a persisted RNG stream or replay. Seven active rules/compatibility tests and six archived reference tests pass; browser retirement evidence is in PLAYTEST.md. The broader architecture below remains a proposal.

Only design documents changed in this architecture pass. No new engine, migration, browser behavior or offline progress is claimed.
