// Derive eligibility from actual owners. No renderer, quote or import seeds
// resident funds/items, completes work or installs a fixture.
import {sameJson as same} from './basics.js';
import {PROTO23_IDS as I, PROTO23_KEYS as K, PROTO23_LOCATIONS as L, PROTO23_OPTIONAL_NATIVE_LOCATIONS, proto23Commands} from './proto23_world_content.js';
export function proto23Facts(state, context = {}) {
    const d = state.proto23Village, s = state.simulation || {}, n = context.proto23Native || {}, p = s.people?.player;
    const actual = n.body, body = p?.body, at = context.facts?.location || p?.location;
    const visit = d?.visits?.find(v => v.id === d.activeVisitId && v.status === 'active');
    const vitals = id => context.vitals?.[id] || context.vitalsByActor?.[id];
    const usable = id => {const person = s.people?.[id], b = person?.body, v = vitals(id); return person?.inventory === 'native' &&
        person.life === 'alive' && b?.form === 'human' && b.ownerId === id && b.controllerId === id &&
        (b.hands ?? 0) >= 2 && b.mobile === true && (v?.health ?? 0) > 1;};
    const bound = !!d && n.bound === true && n.revision === d.nativeRevision && n.revision > 0;
    const sameBody = body?.id === 'native.player.body' && actual?.id === body.id && actual.form === body.form &&
        actual.ownerId === body.ownerId && actual.controllerId === body.controllerId;
    const controlled = bound && sameBody && context.nativeAlive === true && usable('player') && p.location === at;
    const here = !!visit && visit.endpoint.worldId === I.world && state.actors?.player?.worldId === I.world && [...Object.values(L), ...PROTO23_OPTIONAL_NATIVE_LOCATIONS].includes(at);
    const supported = controlled && here;
    const f = {'proto23.nativeBound': bound, 'proto23.playerSupported': supported,
        'proto23.homeSupported': controlled && !visit && state.actors?.player?.worldId === 'base.frontier' && at === 'Shack',
        'proto23.chartSupported': context.nativeAlive === true && state.actors?.player?.worldId === 'base.frontier' && at === 'Village' && (!p || p.life === 'alive')};
    for(const id of [I.steward, I.tutor]) f['proto23.support.' + id] = supported && usable(id) &&
        state.actors?.[id]?.worldId === I.world && s.people[id].body.id === `native.person.${id}.body` && Object.values(L).includes(s.people[id].location);
    const accepted = context.proto23AcceptedJob, def = proto23Commands.find(c => c.id === accepted?.commandId);
    const exactReservation = !!accepted && !!def && accepted.actorId === 'player' && accepted.context?.actorId === 'player' &&
        accepted.revision === def.revision && accepted.reservationReturns === 1 && accepted.cancellation === 'refund' &&
        accepted.due === state.clock && accepted.completionSupport?.location === def.location &&
        same(accepted.costs, def.costs) && same(accepted.effects, def.effects);
    const held = (id, key) => {
        const count = context.gameplay?.[id]?.inventory?.[key] || 0;
        const borrowed = Object.values(s.custody || {}).filter(c => (c.key === key || c.itemKey === key) && c.holder === id && c.owner !== id).reduce((sum, c) => sum + c.count, 0);
        const equipped = Object.values(context.equipment?.[id] || s.equipment?.[id] || {}).includes(key);
        return equipped ? 0 : Math.max(0, count - borrowed);
    };
    const reserved = key => exactReservation && accepted.costs.some(e => e.type === 'item' && e.actor === 'player' && e.key === key && e.amount === -1) ? 1 : 0;
    for(const name of ['bed', 'hearth', 'bookstand', 'sharp', 'dull', 'notes']) f['proto23.own.' + name] = held('player', K[name]) + reserved(K[name]) >= 1;
    f['proto23.tutorMethod'] = f['proto23.support.' + I.tutor] && held(I.tutor, K.sharp) >= 1;
    for(const [owner, bag] of Object.entries(n.stock || {})) for(const [key, count] of Object.entries(bag)) f[`proto23.stock.${owner}.${key}`] = count;
    // A zero remaining stack needs an explicit zero fact rather than a stale
    // prior quote retained in context.facts.
    for(const c of proto23Commands) for(const r of c.proto23Stock || []) f[`proto23.stock.${r.owner}.${r.key}`] = n.stock?.[r.owner]?.[r.key] || 0;
    return f;
}
export const proto23Context = (state, context = {}) => ({...context, facts: {...context.facts, ...proto23Facts(state, context)}});
