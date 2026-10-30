import {seatOf, seatScope, seatAllows, seatAllowsPanel, panelPerspective} from './seat_profiles.js';

// MDL9/LTU11: the one read point for "what this seat may see and know".
// Player-facing surfaces take an observer from here and never compare against
// the lead's identity (LSD226). The observer is derived from state on every
// call and never saved. Seats choose only who the player controls; today every
// seat controls the actor stored as `player`, so that id lives here and nowhere
// else in the UI.
export const CONTROLLED_ACTOR_ID = 'player';

function build(state, seat) {
    const scope = seatScope(seat);
    const actorId = CONTROLLED_ACTOR_ID;
    const knowledgeMap = () => state?.simulation?.knowledge?.[actorId] ?? {};
    return Object.freeze({
        seat,
        actorId,
        tags: scope.tags,
        audiences: scope.audiences,
        worldId: state?.actors?.[actorId]?.worldId ?? null,
        // Controls ({control}) and capabilities ({capability}) this seat is shown.
        sees: request => seatAllows(state, request),
        seesPanel: panel => seatAllowsPanel(state, panel),
        perspectiveOf: panel => panelPerspective(state, panel),
        // The seat actor's own knowledge entry, or undefined. Names, Knows and
        // locked rows resolve here, never against another seat's facts.
        knows: key => knowledgeMap()[key],
        knowledge: knowledgeMap,
        facts: () => state?.actors?.[actorId]?.facts ?? {},
        completed: id => !!state?.actors?.[actorId]?.completed?.[id],
    });
}

export function observerView(state) {
    return build(state, seatOf(state));
}

// For surfaces that hold only an entry profile id (a selected start, a preview).
export function observerForProfile(profileId) {
    return observerView({lotm: {entryProfile: profileId}});
}
