// Optional room-local exposure. One vapor pulse supplies a finite inhaled
// pool. The body pack receives harm through its existing inbox interface.
import {check, natural} from '../basics.js';
import {WORLD_EFFECT_KINDS as K, WORLD_QUANTITIES as Q} from '../world_quantities.js';

const exposure = 'brew.vapor-exposure';
const unabsorbed = 'brew.vapor-unabsorbed';
const breathers = (view, place) => view.present(place).filter(id => {
    const {kind, tags} = view.holder(id);
    return kind === 'body' && tags.includes('living.body') && tags.includes('breathes.air') && !tags.includes('breath.sealed');
});

// A lingering constituent has a finite room account. Each occupied minute
// spends inhaled material, then ventilation moves the remainder to a sink.
export function createBrewCloudPack({constituent, uptakePerMinute, ventilationPerMinute, exchangePerMinute = 0, harm}) {
    check(typeof constituent === 'string' && /^[a-z0-9][a-z0-9_.-]*$/i.test(constituent) &&
        natural(uptakePerMinute) && natural(ventilationPerMinute) && natural(exchangePerMinute) &&
        (uptakePerMinute > 0 || ventilationPerMinute > 0 || exchangePerMinute > 0) &&
        (harm === undefined || (typeof harm === 'string' && harm.length)), 'Invalid brew cloud settings.');
    const air = `residue:air.${constituent}`, vent = `residue:vented.${constituent}`;
    const inhaled = `residue:inhaled.${constituent}`;
    const room = holder => holder.kind === 'place' && Object.hasOwn(holder.quantities, air) &&
        Object.hasOwn(holder.quantities, vent);
    const add = (holder, quantity, amount) => ({op: 'add', holder, quantity, amount});
    return {
        id: 'b.cloud', revision: 0, quantities: [Q.residue], reads: ['residue'], writes: ['residue'],
        hears: [K.vapor_released.id], publishes: harm ? ['living.harm'] : [],
        reactors: [{id: 'retain', on: [K.vapor_released.id], appliesTo: room,
            react(view, place, {detail}) {
                const rows = detail?.constituents ?? (detail?.constituent ? [{id: detail.constituent, amount: detail.amount}] : []);
                const amount = rows.filter(row => row.id === constituent).reduce((total, row) => {
                    check(natural(row.amount), 'Cloud release needs a whole constituent amount.');
                    return total + row.amount;
                }, 0);
                check(amount <= Q.residue.max - view.amount(place, air), 'Cloud release exceeds room capacity.');
                return amount ? [add(place, air, amount), {op: 'state', holder: place, value: {releasedAt: view.clock}}] : [];
            }}],
        laws: [{id: 'exposure', appliesTo: holder => room(holder) && holder.quantities[air] > 0,
            horizon: () => 1,
            decide(view, place) {
                if (view.state(place)?.releasedAt === view.clock) return [];
                let remaining = view.amount(place, air);
                const ops = [];
                for (const id of breathers(view, place).sort()) {
                    if (!view.has(id, inhaled)) continue;
                    const amount = Math.min(remaining, uptakePerMinute, Q.residue.max - view.amount(id, inhaled));
                    if (!amount) continue;
                    remaining -= amount;
                    ops.push(add(id, inhaled, amount));
                    if (harm) ops.push({op: 'publish', kind: 'living.harm', place, by: place, detail: {target: id, kind: harm, amount}});
                }
                const aired = Math.min(remaining, ventilationPerMinute, Q.residue.max - view.amount(place, vent));
                if (aired) ops.push(add(place, vent, aired));
                const spent = view.amount(place, air) - remaining + aired;
                return spent ? [add(place, air, -spent), ...ops] : [];
            }}, ...(exchangePerMinute ? [{
            // Plan exchange from one snapshot. Newly arrived material cannot
            // cross another link until the next minute.
            id: 'air-exchange',
            appliesTo: room,
            decide(view, place) {
                const hasAccounts = id => view.has(id, air) && view.has(id, vent);
                const links = view.links().filter(link => link.kind === 'air' && link.state === 'open' &&
                    hasAccounts(link.from) && hasAccounts(link.to));
                const rooms = [...new Set(links.flatMap(link => [link.from, link.to]))].sort();
                if (place !== rooms[0]) return [];
                const original = new Map(rooms.map(id => [id, view.amount(id, air)]));
                const incoming = new Map(), outgoing = new Map();
                for (const {from, to, oneWay} of links) {
                    const [source, target] = !oneWay && original.get(to) > original.get(from) ? [to, from] : [from, to];
                    if (view.state(source)?.releasedAt === view.clock) continue;
                    const held = original.get(source), nearby = original.get(target);
                    const moved = Math.min(exchangePerMinute, Math.floor((held - nearby) / 2),
                        held - (outgoing.get(source) ?? 0), Q.residue.max - nearby - (incoming.get(target) ?? 0));
                    if (moved <= 0) continue;
                    outgoing.set(source, (outgoing.get(source) ?? 0) + moved);
                    incoming.set(target, (incoming.get(target) ?? 0) + moved);
                }
                return rooms.flatMap(id => {
                    const delta = (incoming.get(id) ?? 0) - (outgoing.get(id) ?? 0);
                    return delta ? [add(id, air, delta)] : [];
                });
            },
        }] : [])],
    };
}

// Steam follows its source. Humidity is an environmental reading rather than
// a material account, so the serving's stock stays in the delivery receipt.
export const BREW_BODY_STEAM = {
    id: 'b.body_steam', revision: 0, reads: ['humidity'], writes: ['humidity'],
    laws: [{
        id: 'body-steam', appliesTo: holder => holder.kind === 'body',
        rates(view, id) {
            const place = view.placeOf(id);
            if (!place || !view.has(place, 'humidity')) return [];
            const perMinute = view.lawFields(id, 'body-steam').reduce((rate, field) =>
                field.scope === id && natural(field.params.humidityPerMinute)
                    ? Math.max(rate, field.params.humidityPerMinute) : rate, 0);
            return perMinute ? [{holder: place, quantity: 'humidity', perMinute}] : [];
        },
    }],
};

export function createBrewVaporPack({constituents, uptakePermille}) {
    check(natural(uptakePermille) && uptakePermille <= 1000, 'Vapor uptake needs a whole permille.');
    return {
        id: 'b.vapor', revision: 0, hears: [K.vapor_released.id], publishes: [exposure, unabsorbed, 'living.harm'],
        reactors: [{id: 'inhale', on: [K.vapor_released.id], appliesTo: holder => holder.kind === 'place',
            react(view, place, event) {
                const detail = event.detail;
                const rows = detail?.constituents ?? (detail?.constituent ?
                    [{id: detail.constituent, amount: detail.amount}] : []);
                const recipients = breathers(view, place);
                const effects = [];
                for (const {id, amount} of rows) {
                    check(natural(amount), 'Vapor exposure requires a whole constituent amount.');
                    const rule = Object.hasOwn(constituents, id) ? constituents[id] : null;
                    const pool = rule && recipients.length ? Number(BigInt(amount) * BigInt(uptakePermille) / 1000n) : 0;
                    const perRecipient = Math.floor(pool / Math.max(1, recipients.length));
                    for (const target of recipients) {
                        if (!perRecipient) break;
                        effects.push({op: 'publish', kind: exposure, place, detail: {target, constituent: id, amount: perRecipient}});
                        if (rule.harm) effects.push({op: 'publish', kind: 'living.harm', place,
                            detail: {target, kind: rule.harm, amount: perRecipient}});
                    }
                    const remaining = amount - perRecipient * recipients.length;
                    if (remaining) effects.push({op: 'publish', kind: unabsorbed, place, detail: {constituent: id, amount: remaining}});
                }
                return effects;
            }}],
    };
}
