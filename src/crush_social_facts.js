// Pure, absent-inert owner projection. Keep runtime/content imports out of
// this leaf so the shared simulation fact evaluator can cold-import it.
export const CRUSH_SOCIAL_IDS = Object.freeze({prefix: 'crush_social', world: 'base.frontier',
    promise: 'promise.visitor', visitor: 'promiseVisitor',
    preparation: 'crush_social.household_preparation', knownUse: 'crush_social.household_known_use'});
const I = CRUSH_SOCIAL_IDS, key = suffix => `${I.prefix}.${suffix}`;
const usableHands = (state, actorId) => !['body.sore_hands', 'body.scraped_hands', 'field.care.open_cut'].some(id => {
    const c = state.simulation?.conditions?.[actorId]?.[id];
    return c?.intensity > 0 && (c.expiresAt == null || c.expiresAt > state.clock);
});

// Actual bodies support admission/completion. These private predicates are
// not themselves permission for a public view to reveal another body's data.
export function crushSocialFacts(state, context = {}) {
    const s = state.simulation, player = state.actors?.player, t = s?.people?.[I.visitor], actor = state.actors?.[I.visitor];
    const local = !!s && player?.worldId === I.world && !state.realmPrototype?.activeVisitId &&
        (context.facts?.location || s.people.player?.location) === 'Village';
    const ownBody = s?.people?.player?.body;
    const body = ownBody?.id && ownBody.form ? ownBody : context.nativeBody;
    const playerSupported = local && s?.people?.player?.life === 'alive' && s.people.player.inventory === 'native' &&
        context.nativeAlive === true && !!body && body.ownerId === 'player' && body.controllerId === 'player' &&
        body.hands >= 2 && body.mobile === true && usableHands(state, 'player');
    return {'crushSocial.local': local,
        'crushSocial.playerSupported': playerSupported,
        'crushSocial.metHelp': player?.completed?.['promise.meet_help'] === 1 && !!s?.knowledge?.player?.['promise.later'],
        'crushSocial.chosen': ['patient', 'quick', 'declined'].includes(player?.facts?.[key('choice')]),
        'crushSocial.tamsinSupported': local && !!t && t.life === 'alive' && t.location === 'Village' && actor?.worldId === I.world &&
            (t.body?.hands || 0) >= 2 && t.body.mobile !== false && t.vitals?.health > 1 && usableHands(state, I.visitor),
        'crushSocial.tamsinWilling': actor?.facts?.[key('willing')] === true};
}
export const crushSocialContext = (state, context = {}) => ({...context, facts: {...context.facts, ...crushSocialFacts(state, context)}});
