# River map and pacing

## F7: A directed graph with player knowledge

SHOWN: `extract/csharp/SpaceGame.Pathfinding.Graph/RiverGraphConnection.cs` distinguishes river, interchange and dead-space edges. `SpaceGame.Pathfinding/PathfinderNodeConnection::ConnectionValid` rejects unsupported reverse arc travel. Its cost calculation samples lengths and speeds, distinguishes jetstreams, weights hidden/untravelled/travelled rivers and can make locked rivers infinite cost. Path preference and physical travel time are distinct calculations.

SHOWN: `Player.RiverKnowledge` keeps per-river locked, travelled and really-travelled state. Its explicit save list includes the river ID and two travel flags; locked state is refreshed by the host rather than included in that list. `SpaceGame/RegionKnowledgeRiverLocker` responds to map state changes and locks/unlocks configured rivers when a site becomes searchable or visitable; an invert option allows opposite rules. A destination can therefore be vaguely known before it is a usable landing or a resolved route.

## F8: Travel has estimated duration and authored stopping points

SHOWN: `PathfinderPath::GetEstimateTravelTime` sums connection travel times for the whole path or a selected range. `ShipPather` schedules branch approaches using time offsets. Its skip-point builder uses route ranges, unique river count, estimated duration and destination knowledge. `GetNextSkipPoint` checks current position and remaining time. `SpaceSkipUI` additionally requires an authored AUTOPILOT choice, a valid path/skip point and no landing/teleport interaction conflict.

INFERRED: travel creates room for conversation, approach cues and decisions, while conditional skipping can compress uneventful stretches. No wall-clock travel timings, all-route table, exact serialized tuning or experienced pacing were measured. These estimates must not be reported as game-world calendar time or a deadline simulation.

## PROPOSALS for YAIRPG

Use existing travel/time owners in `docs/ENGINE_EXPANSION.md`, `docs/ENCOUNTERS_AND_PURSUIT.md`, `docs/TIME_KEEPERS_AND_VARIANTS.md` and `docs/WANDERING_ZONES_AND_INSIGHT.md`. Keep route knowledge, legal access, actual capability and arrival state separate. A queued journey should stop on its declared unknown choice and retain earned route knowledge on interruption.

Show the known reason to revisit a route, such as “your survey narrows the search,” with the evidence that changed it. Never reveal unknown destination counts through search results or disabled controls. On a desktop notebook trial, compare source, interpretation and route consequence side by side at 1440 × 900. Mobile optimization remains deferred. Use text/route cards before considering a 3D river renderer. The useful import is pacing and causality, not the source game's assets.
