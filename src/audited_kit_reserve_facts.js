// Pure current-state facts. No simulation.js, host or inventory mutation: this
// module may safely be read by simulation_effects.js at each real boundary.
import {AUDITED_KIT_RESERVE_IDS as I, AUDITED_KIT_RESERVE_POLICY as P,
    AUDITED_KIT_RESERVE_TERMS as T} from './audited_kit_reserve_content.js';

const count = value => Number.isSafeInteger(value) && value >= 0;
export function availableOwnedNativeCount(state, context = {}, key) {
    if(state.simulation?.people?.player?.inventory !== 'native') return 0;
    const stock = context.gameplay?.player?.inventory;
    if(!count(stock?.[key])) return 0;
    // Existing item spending treats a key with custody/equipment as unavailable.
    // Respect that same conservative boundary even if another copy is carried.
    if(Object.values(state.simulation?.custody || {}).some(c => c.holder === 'player' && c.key === key) ||
        Object.values(context.equipment?.player || {}).includes(key) ||
        Object.values(state.simulation?.equipment?.player || {}).includes(key)) return 0;
    return stock[key];
}

export function auditedKitReserveFacts(state, context = {}, supportFacts = context.facts || {}) {
    // Common executor callers pass freshly recomputed reference workshop facts,
    // not a cached preview. Missing support facts fail closed without guessing.
    const s = state.simulation, player = s?.people?.player, actor = state.actors?.player;
    const stock = context.gameplay?.player?.inventory, vitals = context.vitals?.player;
    const nativeReady = player?.inventory === 'native' && !!stock && Object.values(stock).every(count) && !!vitals &&
        ['health', 'max_health', 'stamina', 'max_stamina'].every(k => Number.isFinite(vitals[k]) && vitals[k] >= 0) &&
        vitals.health <= vitals.max_health && vitals.stamina <= vitals.max_stamina;
    const opened = state.referenceGameplay?.schema === 1 && !!state.referenceGameplay.workshop &&
        actor?.facts?.['reference_gameplay.opened'] === true;
    const location = context.facts?.location || player?.location;
    const supported = opened && (context.actorId || 'player') === 'player' && actor?.worldId === I.world && location === I.location &&
        player?.life === 'alive' && nativeReady && vitals.health >= 2 && !!s?.sites?.[I.site] &&
        supportFacts['reference.workshop.opened'] === true && supportFacts['reference.workshop.supported'] === true &&
        supportFacts['reference.workshop.handsUsable'] === true;
    return {'auditedKitReserve.opened': opened, 'auditedKitReserve.supported': supported,
        'auditedKitReserve.available': availableOwnedNativeCount(state, context, P.key),
        'auditedKitReserve.resinAvailable': availableOwnedNativeCount(state, context, T.resinKey),
        'auditedKitReserve.soundAvailable': availableOwnedNativeCount(state, context, T.soundKey)};
}
