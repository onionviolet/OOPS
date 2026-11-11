// Companion work orders (CPR15, FRC55; proposal under AD32, AD56). A kept creature that you have given a standing order does
// one working at its place every work window on the played clock, and what it makes lands in real custody: the keeper's bag or
// the creature's own home store. Shape from Rune Factory 5 helper monsters (DIALOGUE_AND_HELPERS_DIGEST F6, F7): a befriended
// monster has a home, an order, a work area and a daily worked flag, and works only above a friendship threshold and while it is
// not tired. Adapted: the "day" is the creature's own work window (its meal window when it eats, so a Gu that eats every three
// days works every three days); "friendship" is two readers kept apart, the tie (allegiance, CPR10) and opinion (CPR18).
// Pure: this compiles ordinary structured command and event rows (one authority: the engine runs the clock, the custody and the
// save) and reads an order's outlook for a view. No clock, randomness or save slice here.
// Dials (authored, with reason): the opinion bonus (fond +1, cool -1) is a calibration hint, not a source table; the RF5 numbers
// (friendship threshold 3, tired at half HP) map onto the tie level and the care condition only as hints (SKR11).
const fail = m => { throw new Error(m); };
const idLike = x => typeof x === 'string' && /^[a-z][a-z0-9_.:-]*$/i.test(x);

// The palette of order kinds. A world picks the kinds that fit its creatures; the verb is what the order line says it does.
export const WORK_KINDS = Object.freeze({
    fetch: Object.freeze({label: 'Fetch', verb: 'fetches and carries'}),
    guard: Object.freeze({label: 'Guard', verb: 'keeps watch over'}),
    tend: Object.freeze({label: 'Tend', verb: 'tends'}),
    forage: Object.freeze({label: 'Forage', verb: 'forages'})
});
// Opinion of the keeper shifts how much a minded creature puts in. A creature without a mind reads none (held, CPR10).
export const OPINION_SHIFT = Object.freeze({fond: 1, even: 0, cool: -1});

// order: {id, kind, being, beingLabel, place: {id, label}, interval, essence?, output: [{to: 'keeper'|'home', key, label, count}], why, minded?}
export function defineWorkOrder(o) {
    idLike(o?.id) && WORK_KINDS[o.kind] && idLike(o.being) && o.beingLabel && idLike(o.place?.id) && o.place.label || fail('A work order needs an id, a kind, a being and a place.');
    Number.isSafeInteger(o.interval) && o.interval > 0 || fail(`${o.id}: a work order needs a positive work window.`);
    Array.isArray(o.output) && o.output.length && o.output.every(x => ['keeper', 'home'].includes(x.to) && typeof x.key === 'string' && x.label && Number.isSafeInteger(x.count) && x.count > 0) || fail(`${o.id}: every output names where it lands, what and how much.`);
    return Object.freeze({...o, essence: o.essence ?? 0, minded: !!o.minded, output: Object.freeze(o.output.map(x => Object.freeze({...x})))});
}
const shifted = (count, band) => Math.max(0, count + (OPINION_SHIFT[band] ?? 0));
export const outputFor = (order, band = 'even') => order.output.map(x => ({...x, count: shifted(x.count, order.minded ? band : 'even')})).filter(x => x.count > 0);
export const outputLine = parts => parts.length ? parts.map(x => `${x.count} ${x.label}${x.to === 'home' ? ' into its own store' : ' into your bag'}`).join(' and ') : 'nothing';

// Compile one order to structured rows. The caller supplies the facts that make the order run, so the order and the hand verb
// read the same rule (FLR4): `gate` is the hand verb's condition (care, tie, ownership); `orderFact` is the keeper's actor fact
// holding the order id; `workedFlag` is the once-per-window flag the creature's upkeep resets; `energy` names the keeper's
// essence; `ids(suffix)` makes pack ids. Events run on the keeper with the creature as target, and their ids are `eventId(band)`,
// which the caller chooses so they sort after its own upkeep rows at a shared boundary (meal first, then work).
export function compileWorkOrder(order, {worldId, actorId = 'player', location, ids, eventId, orderFact, workedFlag, gate, assignGate, energy, note}) {
    const eq = (fact, value) => ({fact, op: 'eq', value}), all = (...r) => ({all: r.filter(Boolean)});
    const set = value => ({type: 'fact', scope: 'actor', key: orderFact, value});
    const k = WORK_KINDS[order.kind], where = order.place.label;
    const commands = [
        {id: ids(`order.${order.id}.on`), revision: 1, label: `Order the ${order.beingLabel} to ${k.label.toLowerCase()}: ${where}`, group: 'structured_local', worldId, actorId, location, audience: ['$actor'],
            targetId: order.being, coLocated: true, participants: ['$target'], requires: {...all(assignGate, {not: eq(`actor.${orderFact}`, order.id)}), reason: `Take the ${order.beingLabel} into your care first; this order must not already be set.`}, costs: [],
            description: `A standing work order. Every ${order.interval >= 1440 ? `${order.interval / 1440}-day` : `${order.interval}-minute`} work window it ${k.verb} ${where} on its own and leaves ${outputLine(order.output)}${order.essence ? `, for ${order.essence} essence of yours` : ''}. It works only while it is sound and willing; a hand working in the same window takes its turn. ${order.why}`,
            effects: [set(order.id), note(`The ${order.beingLabel} has a standing order: ${k.label.toLowerCase()}, ${where}.`)]},
        {id: ids(`order.${order.id}.off`), revision: 1, label: `Call the ${order.beingLabel} off its work order`, group: 'structured_local', worldId, actorId, location, audience: ['$actor'],
            requires: {...eq(`actor.${orderFact}`, order.id), reason: 'There is no such order to call off.'}, costs: [], description: 'It stays in your care and stops working on its own.',
            effects: [set('none'), note(`The ${order.beingLabel} is off its work order.`)]}
    ];
    const bands = order.minded ? ['fond', 'even', 'cool'] : ['even'];
    const events = bands.map(band => {
        const out = outputFor(order, band), bandRule = order.minded ? eq('target.opinion.band', band) : null;
        const said = band === 'fond' ? ' It went at it gladly.' : band === 'cool' ? ' It worked grudgingly.' : '';
        return {id: eventId(band), revision: 1, label: `${order.beingLabel} works its order`, worldId, actorId, targetId: order.being, interval: order.interval, automatic: true, mode: 'ambient', chance: 1, public: false,
            requires: all(eq(`actor.${orderFact}`, order.id), gate, bandRule),
            effects: [...(order.essence ? [{type: 'energy', energyId: energy, operation: 'use', output: order.essence, control: 1}] : []),
                ...out.map(x => ({type: 'item', key: x.key, amount: x.count, ...(x.to === 'home' ? {actor: order.being} : {})})),
                {type: 'fact', scope: 'actor', key: workedFlag, value: true, actor: order.being},
                note(`The ${order.beingLabel} ${k.verb} ${where}: ${outputLine(out)}.${said}`)]};
    });
    return {commands, events};
}

// What the order will do next window, for a view. obs: {kept, alive, condition, sound (the gate's condition floor), worked,
// willing (the tie's answer: false when it refuses), why (the refusal words), essence, opinion: {band, total} | null}.
// Mirrors the gate the caller compiled; tests hold the two to the same answers.
export function readWorkOrder(order, obs) {
    const k = WORK_KINDS[order.kind], head = `${k.label}: ${order.place.label}`;
    const band = order.minded ? obs.opinion?.band ?? 'even' : 'even', out = outputFor(order, band);
    const stop = reason => ({order: order.id, head, will: false, reason, output: [], line: `${head} · idle: ${reason}`});
    if(!obs.kept) return stop('not in your care');
    if(!obs.alive) return stop('dead');
    if(obs.condition < obs.sound) return stop(obs.condition <= 1 ? 'starved out; feed it' : 'too hungry to work; feed it');
    if(obs.willing === false) return stop(obs.why || 'it will not work for you');
    if(order.essence && obs.essence < order.essence) return stop(`needs ${order.essence} essence of yours`);
    const mood = order.minded && band !== 'even' ? ` (${band} toward you: ${OPINION_SHIFT[band] > 0 ? 'one more' : 'one less'})` : '';
    return {order: order.id, head, will: true, reason: null, output: out,
        line: `${head} · ${obs.worked ? 'worked this window' : 'works at the next window'}: ${outputLine(out)}${mood}`};
}
