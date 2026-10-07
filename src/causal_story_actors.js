// Original Village residents. Definitions/read projections never enroll or refill.
import {CAUSAL_STORY_PEOPLE as P, CAUSAL_STORY_PROOFS as PROOFS,
    CAUSAL_STORY_WORLD as WORLD, CAUSAL_STORY_LOCATION as LOCATION, CAUSAL_STORY_ITEMS as K,
    CAUSAL_STORY_SOURCES as SOURCES, causalStoryPersonIds, causalStoryId} from './causal_story_ids.js';

export const freezeCausalStoryContent = value => {
    if(value && typeof value === 'object') {Object.values(value).forEach(freezeCausalStoryContent); Object.freeze(value);}
    return value;
};
const freeze = freezeCausalStoryContent;
const stats = (health, stamina, strength, agility, intuition, defense) => ({health, max_health:health, stamina, max_stamina:stamina,
    strength, agility, dexterity:agility, intuition, defense, attack_power:strength / 10, unarmed_power:1,
    attack_points:agility * Math.sqrt(intuition), evasion_points:agility * Math.sqrt(intuition), attack_count:1,
    attack_speed:1, crit_rate:0.05, crit_multiplier:1.5, block_chance:0, stamina_efficiency:1});

// Numerical O prototypes, never a conversion from a book's ranks or powers.
export const causalStoryNativeStats = freeze({
    [P.mortal]:stats(20, 16, 9, 9, 5, 1),
    [P.covenant]:stats(24, 16, 10, 8, 6, 1),
    [P.anchor]:stats(18, 16, 8, 10, 7, 0),
    [P.witness]:stats(22, 18, 9, 10, 6, 1),
    [P.keeper]:stats(26, 18, 8, 7, 9, 1),
});
const purse = (money, attention, effort) => ({'causal.story.purse':money, 'causal.story.attention':attention, 'causal.story.effort':effort});
const rows = [
    [P.mortal, 'Tarin, local courier', 'Tarin counts the lashings twice. "A kit on the bench helps nobody. I mean to put this one into Nell\'s hands."', purse(6, 5, 5)],
    [P.covenant, 'Asha, local courier', 'Asha stands beside her counted load. "Ask what the work needs, then ask me. I keep my own terms."', purse(6, 5, 5)],
    [P.anchor, 'Orin, local courier', 'Orin tightens a plain rope around the kit. "You can disagree with my plan. You still have to deal with the person making it."', purse(6, 5, 5)],
    [P.witness, 'Roe, local witness and packer', 'Roe has room for a careful account. "Tell me what you saw. If you want me to carry a copy, give me something I can actually use."', purse(9, 10, 6)],
    [P.keeper, 'Nell, local keeper and teacher', 'Nell keeps a small working bench. "I can check a claim, teach a method, or mend a useful kit. Pick the work and pay for the work."',
        {...purse(6, 18, 12), 'causal.story.study':3, 'causal.story.teaching':3}],
];
export const causalStoryPeople = freeze(rows.map(([id, label, description, resources]) => {
    const s = causalStoryNativeStats[id];
    return {id, revision:1, label, description, worldId:WORLD, location:LOCATION, inventory:'native', provision:false, resources,
        body:{id:`native.person.${id}.body`, form:'human', ownerId:id, controllerId:id, hands:2, mobile:true},
        vitals:{health:s.health, max_health:s.max_health, stamina:s.stamina, max_stamina:s.max_stamina}};
}));
export const CAUSAL_STORY_NATIVE_PEOPLE = freeze({
    ...Object.fromEntries(PROOFS.map(p => [P[p], {inventory:{[K.kit]:1, [K.rope]:2, [K.log]:2}, skills:{}, reputation:{village:0}, equipment:{}}])),
    [P.witness]:{inventory:{[K.kit]:3, [K.rope]:2, [K.log]:3}, skills:{}, reputation:{village:0}, equipment:{}},
    [P.keeper]:{inventory:{[K.kit]:2, [K.rope]:2, [K.log]:6}, skills:{}, reputation:{village:0}, equipment:{}},
});
const flag = (proof, key, actor, value=false) => ({type:'fact', scope:'actor', actor, key:causalStoryId(proof, key), value});
const know = (proof, key, actor, value) => ({type:'knowledge', actor, key:causalStoryId(proof, key), stage:'understood', value});
const source = (actor, sourceId, origin='trained') => ({type:'source', actor, sourceId, operation:'grant', origin, awakened:true, active:true});
const power = (actor, powerId) => ({type:'power', actor, powerId, operation:'learn'});
const account = {
    mortal:'Tarin has one ordinary living body, one independently supplied kit and one finite delivery plan. No revival or survival source is supplied to Tarin in this case.',
    covenant:'Asha owns an active original survival covenant. While this actual source is supported it prevents a terminal physical killing, but promises no delivery, victory, possession or freedom. It is neither copied nor inherited by an observer.',
    anchor:'Orin already owns an active original identity-local future connection. It is an established relation, not a prediction from Orin\'s present strength. Its limited topology protects this identity while supported; it promises no courier success or transfer of future powers.',
};

// Only the root's explicit durable activation applies these effects once.
// Native bags, XP, equipment and body vitals have distinct native owners above.
export const causalStorySeedEffects = freeze([
    source(P.keeper, SOURCES.method), power(P.keeper, SOURCES.method),
    ...PROOFS.flatMap(proof => [
        source(P[proof], SOURCES.guard), power(P[proof], SOURCES.guard),
        ...['noticed','accepted','delivered','attacked','suspectsPlayer','guardReady','careRequested','severAuthorized','followupDone']
            .map(key => flag(proof, key, P[proof])),
        ...['noticed','copyHeld','copyDelivered','warned','suspectsPlayer','followupDone'].map(key => flag(proof, key, P.witness)),
        ...['noticed','accepted','delivered','methodTaught','severAuthorized','followupDone'].map(key => flag(proof, key, P.keeper)),
        ...['noticed','accepted','delivered','methodTaught','severAuthorized','followupDone'].map(key => flag(proof, key, 'player')),
        know(proof, 'private_plan', P[proof], 'I own this one local courier plan, its kit, ropes, purse, body and effort. Only an explicitly begun proof starts its thirty-six-played-minute deadline. I do not need an unpaid player promise.'),
        know(proof, 'source', P.keeper, account[proof]),
    ]),
    source(P.covenant, SOURCES.covenant, 'acquired'), source(P.anchor, SOURCES.anchor, 'acquired'),
]);

const actualSource = (state, id, sourceId) => {
    const source = state.actors?.[id]?.sources?.[sourceId], f = state.simulation?.faculties?.[id]?.[sourceId];
    return !!source && (source.expiresAt == null || source.expiresAt > state.clock) && f?.awakened === true && f.active === true && f.suppressed !== true;
};
const ownedPower = (state, id, powerId) => state.simulation?.powers?.[id]?.[powerId]?.owned === true;
const ownedKnowledge = (state, id, key) => state.simulation?.knowledge?.[id]?.[key]?.stage === 'understood';
const free = (state, id) => !state.pending?.some(j => j.context?.actorId === id) &&
    !state.simulation?.jobs?.some(j => (j.participants || [j.actorId]).includes(id)) &&
    !Object.entries(state.simulation?.sessions || {}).some(([actor, s]) => (s.participants || [actor]).includes(id)) &&
    !Object.values(state.causalStories?.proofs || {}).some(p => p?.restraint && p.leadId === id) &&
    !Object.values(state.actors?.[id]?.techniques || {}).some(t => t?.practice != null);

// Private admission facts only. Reading these never grants observer knowledge.
export function causalStoryActorFacts(state, context={}) {
    const d = state.causalStories, s = state.simulation || {}, n = context.causalStoryNative || {}, actorId = context.actorId || 'player';
    const enrolled = !!d && d.schema === 1 && d.definitionRevision === 1;
    const bound = enrolled && n.bound === true && Number.isSafeInteger(n.revision) && n.revision > 0 && n.revision === d.nativeRevision;
    const vitals = id => context.vitals?.[id] || context.vitalsByActor?.[id] || n.fighters?.[id]?.stats || {};
    const bodySupported = (id, living=true) => {
        const p = s.people?.[id], b = p?.body, v = vitals(id), expected = id === 'player' ? 'native.player.body' : `native.person.${id}.body`;
        return bound && p?.inventory === 'native' && (!living || p.life === 'alive') && b?.id === expected && b.form === 'human' &&
            b.ownerId === id && b.controllerId === id && b.hands >= 2 && b.mobile === true && Number.isFinite(v.health) && v.health > 0 &&
            state.actors?.[id]?.worldId === WORLD && p.location === LOCATION;
    };
    const available = id => bodySupported(id) && vitals(id).health > 1 &&
        !Object.values(d?.proofs || {}).some(p => p?.restraint && p.leadId === id);
    const p = s.people?.player, b = p?.body, actual = n.body;
    const samePlayer = b?.id === 'native.player.body' && actual?.id === b.id && actual.form === b.form && actual.ownerId === b.ownerId && actual.controllerId === b.controllerId;
    const playerSupported = available('player') && samePlayer && context.nativeAlive === true && n.currentLocation === LOCATION;
    const location = actorId === 'player' ? context.facts?.location || n.currentLocation || p?.location : s.people?.[actorId]?.location;
    const here = state.actors?.[actorId]?.worldId === WORLD && location === LOCATION;
    const flags = (id, proof, key) => state.actors?.[id]?.facts?.[causalStoryId(proof, key)] === true;
    const stock = (id, key) => context.gameplay?.[id]?.inventory?.[key] || 0;
    const f = {'causal.enrolled':enrolled, 'causal.nativeBound':bound, 'causal.local':bound && here,
        'causal.playerSupported':playerSupported, 'causal.playerMethodOwned':ownedPower(state, 'player', SOURCES.method),
        'causal.playerMethodSupported':playerSupported && actualSource(state, 'player', SOURCES.method) && ownedPower(state, 'player', SOURCES.method),
        'causal.keeperMethodSupported':available(P.keeper) && actualSource(state, P.keeper, SOURCES.method) && ownedPower(state, P.keeper, SOURCES.method),
        'causal.actorMethodSupported':available(actorId) && actualSource(state, actorId, SOURCES.method) && ownedPower(state, actorId, SOURCES.method)};
    for(const id of ['player', ...causalStoryPersonIds]) {
        f[`causal.person.${id}.available`] = available(id);
        f[`causal.person.${id}.bodySupported`] = bodySupported(id);
        f[`causal.person.${id}.careSupported`] = bodySupported(id) && !Object.values(d?.proofs || {}).some(p => p?.restraint && p.leadId === id);
        f[`causal.person.${id}.free`] = available(id) && free(state, id);
        f[`causal.person.${id}.at`] = s.people?.[id]?.location || '';
        f[`causal.person.${id}.health`] = vitals(id).health || 0;
        f[`causal.person.${id}.stamina`] = vitals(id).stamina || 0;
        f[`causal.person.${id}.wounded`] = Number.isFinite(vitals(id).health) && vitals(id).health > 0 && vitals(id).health < vitals(id).max_health;
        for(const key of Object.values(K)) f[`causal.person.${id}.item.${key}`] = stock(id, key);
    }
    for(const proof of PROOFS) {
        const r = d?.proofs?.[proof], lead = P[proof], prefix = `causal.proof.${proof}.`;
        const sourceId = proof === 'mortal' ? null : SOURCES[proof], sourceSupported = sourceId == null || actualSource(state, lead, sourceId);
        const interrupted = !!r && (s.people?.[lead]?.life !== 'alive' || vitals(lead).health <= 1 || !!r.restraint || flags(lead, proof, 'attacked') && !flags(lead, proof, 'guardReady'));
        const sourceKnown = ownedKnowledge(state, P.keeper, causalStoryId(proof, 'source'));
        const researchDone = flags(P.keeper, proof, 'accepted') && ownedKnowledge(state, P.keeper, causalStoryId(proof, 'research'));
        const teacher = available(P.keeper) && actualSource(state, P.keeper, SOURCES.method) && ownedPower(state, P.keeper, SOURCES.method);
        const leadReady = available(lead) && !r?.restraint && (!flags(lead, proof, 'attacked') || flags(lead, proof, 'guardReady'));
        const witnessKnows = flags(P.witness, proof, 'copyHeld') && ownedKnowledge(state, P.witness, causalStoryId(proof, 'warning'));
        f[prefix + 'exists'] = !!r;
        f[prefix + 'open'] = r?.phase === 'open' && state.clock < r.deadline;
        f[prefix + 'closed'] = r?.phase === 'closed';
        f[prefix + 'deadline'] = r?.deadline || 0;
        f[prefix + 'delivery'] = r?.delivery || 'absent';
        f[prefix + 'deliveryPending'] = r?.phase === 'open' && r.delivery === 'pending' && state.clock < r.deadline && !flags(lead, proof, 'delivered') && !flags(P.witness, proof, 'copyDelivered');
        f[prefix + 'protection'] = r?.protection || 'none';
        f[prefix + 'sourceSupported'] = bound && !!r && sourceSupported;
        f[prefix + 'sourceKnown'] = sourceKnown;
        f[prefix + 'leadFree'] = available(lead) && free(state, lead);
        f[prefix + 'leadSupported'] = leadReady;
        f[prefix + 'leadInterrupted'] = interrupted;
        f[prefix + 'guardWanted'] = available(lead) && flags(lead, proof, 'attacked') && !flags(lead, proof, 'guardReady');
        f[prefix + 'guardSource'] = available(lead) && actualSource(state, lead, SOURCES.guard) && ownedPower(state, lead, SOURCES.guard);
        f[prefix + 'witnessKnows'] = witnessKnows;
        f[prefix + 'witnessWarned'] = flags(P.witness, proof, 'warned');
        f[prefix + 'witnessCanObserveInterruption'] = !!r && interrupted && available(P.witness) && s.people?.[lead]?.location === s.people?.[P.witness]?.location && state.actors?.[lead]?.worldId === WORLD;
        f[prefix + 'researchRequested'] = flags(P.keeper, proof, 'noticed') && ownedKnowledge(state, P.keeper, causalStoryId(proof, 'research_request'));
        f[prefix + 'researchDone'] = researchDone;
        f[prefix + 'researchSupported'] = bound && !!r && teacher && available(lead) && sourceSupported && sourceKnown;
        f[prefix + 'methodSupported'] = teacher && researchDone && available(lead) && sourceSupported;
        f[prefix + 'methodTaught'] = flags(P.keeper, proof, 'methodTaught') && flags('player', proof, 'methodTaught') && ownedKnowledge(state, 'player', causalStoryId(proof, 'method'));
        f[prefix + 'keeperAuthorized'] = flags(P.keeper, proof, 'severAuthorized');
        f[prefix + 'leadAuthorized'] = flags(lead, proof, 'severAuthorized');
        f[prefix + 'consentAvailable'] = available(lead) && !flags(lead, proof, 'attacked') && !flags(lead, proof, 'suspectsPlayer');
        f[prefix + 'canSever'] = proof !== 'mortal' && !!r && ['open','closed'].includes(r.phase) && r.protection === 'intact' && sourceSupported &&
            available(lead) && teacher && flags(P.keeper, proof, 'severAuthorized') && flags(P.keeper, proof, 'methodTaught') &&
            ownedKnowledge(state, 'player', causalStoryId(proof, 'method')) && f['causal.playerMethodSupported'];
        f[prefix + 'deliveryKnownToKeeper'] = flags(P.keeper, proof, 'delivered') && !!s.knowledge?.[P.keeper]?.[causalStoryId(proof, 'delivery')];
        f[prefix + 'playerTermsKnown'] = !!s.knowledge?.player?.[causalStoryId(proof, 'terms')];
        f[prefix + 'playerEvidenceKnown'] = !!s.knowledge?.player?.[causalStoryId(proof, 'intervention')];
        f[prefix + 'ordinarySupported'] = bound && !!r && r.phase === 'closed';
    }
    return f;
}
