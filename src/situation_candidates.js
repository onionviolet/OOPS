import {validateSituationEffect} from "./causal_situations.js";
import {check} from "./basics.js";
import {address, compareCodePoints} from "./gen_kit.js";
import {stableId} from "./simulation_ids.js";

const REVISION = 1;
const CONTEXT_KEYS = ["worldId", "instanceId", "continuityId", "eraId", "regionId"];
const validContext = context => CONTEXT_KEYS.every(key => stableId(context?.[key]));
const contextValues = context => CONTEXT_KEYS.map(key => context[key]);
// Length prefixes keep identities distinct even when refs contain dots or colons.
const pressureId = identity => "situation.pressure." + identity.map(id => id.length + ":" + id).join(".");

// The host registers the source rule. Saved episodes carry the rule's ID and
// preserve their opening evidence without requiring the episode to repeat.
export const pressureSituationGenerator = Object.freeze({
    id: "situation.pressure.v1",
    validate(situation) {
        const {authorityId, sourceId, episodeId, magnitude, readAt} = situation.privateTruth;
        check(situation.revision === REVISION && validContext(situation.context) &&
            [authorityId, sourceId, episodeId].every(stableId) && Number.isFinite(magnitude) && magnitude > 0 &&
            readAt === situation.openedAt && Number.isSafeInteger(situation.deadline) && situation.deadline > readAt &&
            situation.phases.length === 2 && situation.phases[0] === "open" && situation.phases[1] === "settled" &&
            situation.receipts[0]?.to === "open", "Invalid generated pressure situation.");
        const expected = pressureId([...contextValues(situation.context), authorityId, sourceId, episodeId]);
        check(situation.definitionId === expected && situation.cause === expected, "Generated situation cause disagrees with its pressure episode.");
    },
});

// Owner-only port. Each reading describes a live pressure episode from its
// authority. Keep episodeId stable across readings until that episode ends.
// Eligible actor refs are supplied by the caller's current context/agency read.
export function situationCandidates({readings = [], eligibleActors = [], situations = {}, budget}) {
    if(!Number.isSafeInteger(budget) || budget < 0) throw RangeError("Invalid situation candidate budget.");
    if(!budget || !readings.length || !eligibleActors.length) return [];

    const eligible = new Map();
    for(const actor of eligibleActors) {
        if(!stableId(actor.id) || !validContext(actor.context)) continue;
        const scope = address(...contextValues(actor.context));
        if(!eligible.has(scope)) eligible.set(scope, new Set());
        eligible.get(scope).add(actor.id);
    }

    const episodes = new Map();
    for(const reading of readings) {
        const {context, authorityId, sourceId, episodeId, magnitude, clock, responseWindow, category} = reading;
        if(!validContext(context) || ![authorityId, sourceId, episodeId].every(stableId) ||
            !stableId(category) || !/^[a-z][a-z0-9_]*$/.test(category) ||
            !Number.isFinite(magnitude) || magnitude <= 0 ||
            !Number.isSafeInteger(clock) || clock < 0 ||
            !Number.isSafeInteger(responseWindow) || responseWindow <= 0 ||
            !Number.isSafeInteger(clock + responseWindow)) continue;

        const scope = contextValues(context);
        const actors = eligible.get(address(...scope));
        const requested = reading.participantIds;
        if(!actors || !Array.isArray(requested) || !requested.length || !Array.from(requested).every(id => actors.has(id))) continue;
        const participants = [...new Set(requested)].sort(compareCodePoints);

        const identity = [...scope, authorityId, sourceId, episodeId];
        const cause = pressureId(identity);
        if(Object.hasOwn(situations, cause)) continue;
        if(episodes.has(cause)) throw Error("Multiple readings for one situation pressure episode.");
        episodes.set(cause, {identity, cause, reading, participants});
    }

    // One indexed snapshot pass. Stable ordering is independent of input order
    // and pressure units. At most budget definitions are validated, with zero draws.
    return [...episodes.values()].sort((a, b) => compareCodePoints(a.cause, b.cause)).slice(0, budget)
        .map(({identity, cause, reading, participants}) => {
            const {context, authorityId, sourceId, episodeId, magnitude, clock, responseWindow, category} = reading;
            const definition = {
                id: cause, revision: REVISION, generator: pressureSituationGenerator.id,
                context: Object.fromEntries(CONTEXT_KEYS.map(key => [key, context[key]])),
                participants, initialPhase: "open", phases: ["open", "settled"], responseWindow,
                privateTruth: {authorityId, sourceId, episodeId, magnitude, readAt: clock},
            };
            const effect = {type: "situation", operation: "begin", situationId: definition.id, definition};
            validateSituationEffect(effect);
            return {
                id: definition.id, category, weight: 1, cause, effect, clock,
                address: address("situation.pressure", REVISION, ...identity),
                // This v0 quote is usable on its reading clock. The caller
                // supplies the current situation store at selection/commit.
                recheck: facts => facts.clock === clock && !Object.hasOwn(facts.situations ?? {}, cause),
            };
        });
}
