// SW1-SW12, KW5/KW10/KW12: plain saved patterns over the one effect host.
// The caller owns the clock and supplies all prices, pulses and world vocabulary.
import {landEffect} from './effect_host.js';
import {applyWorldOps, quantityDef} from './world_substrate.js';
import {resolveTargets} from './world_effects.js';
import {settleCosts} from './cost_owner.js';

export const STORED_SCHEMA = 'kernel.stored@1';
const clone = value => structuredClone(value);
const check = (ok, why) => { if (!ok) throw Error(`Stored working: ${why}`); };
const natural = n => Number.isSafeInteger(n) && n >= 0;
const positive = n => Number.isSafeInteger(n) && n > 0;
const terminal = record => ['spent', 'broken', 'lost'].includes(record.status);
const ways = ['recharge', 'renew', 'feed', 'draw', 'reach', 'move', 'stranger', 'key', 'break'];
// What still works after each kind of resistance (SW7-SW10). A reason not listed keeps the whole list.
const WAYS_FOR = {charge: ['recharge', 'renew', 'feed', 'draw'], price: ['feed', 'draw', 'break'], reach: ['reach', 'move'],
    'target-unavailable': ['reach', 'move'], spent: ['renew'], broken: ['renew'], lost: ['store-again'],
    stimulus: ['key', 'break', 'stranger'], key: [], quiet: ['renew']};

function validate(record) {
    check(record?.schema === STORED_SCHEMA, 'unknown save version.');
    check(typeof record.id === 'string' && record.id && typeof record.carrier === 'string', 'id and carrier required.');
    check(Array.isArray(record.effects) && record.effects.length && record.effects.every(e => e.sentence), 'effects required.');
    check(['once', 'repeating', 'held'].includes(record.mode), 'unknown mode.');
    check(['quantity', 'event', 'time', 'touch', 'word'].includes(record.trigger?.kind), 'unknown trigger.');
    check(positive(record.pulse) && natural(record.stored.at) && natural(record.watch.next), 'whole clock and positive pulse required.');
    check(!record.charge || natural(record.charge.now) && natural(record.charge.max) && record.charge.now <= record.charge.max && natural(record.charge.per), 'invalid charge.');
    check(!record.decay || positive(record.decay.every) && natural(record.decay.amount), 'invalid decay.');
    check(!record.draw || typeof record.draw.quantity === 'string' && natural(record.draw.per), 'invalid draw.');
    check(natural(record.anchor) && natural(record.watch.seq) && typeof record.watch.true === 'boolean' && Array.isArray(record.receipts), 'invalid saved cursors.');
    check(['armed', 'dormant', 'spent', 'broken', 'lost'].includes(record.status), 'unknown status.');
    check(record.strangerFactor >= 0 && Number.isFinite(record.strangerFactor), 'invalid stranger factor.');
    check(record.trigger.kind !== 'quantity' || ['>=', '<='].includes(record.trigger.op) && Number.isFinite(record.trigger.value), 'invalid threshold.');
    check(record.trigger.kind !== 'time' || natural(record.trigger.at) || positive(record.trigger.every), 'time trigger needs at or every.');
    return record;
}

function authority(ports, record, moment, by, at, trigger) {
    const answer = ports.authority?.({moment, id: record.id, storer: record.stored.by, by, at,
        carrier: record.carrier, trigger: clone(trigger)}) ?? {ok: true};
    check(typeof answer.ok === 'boolean', 'authority must answer ok.');
    return clone(answer);
}

export function storeWorking(spec, {id, by, at, ports = {}}) {
    const record = JSON.parse(JSON.stringify({...spec, schema: STORED_SCHEMA, id, mode: spec.mode ?? 'once',
        actsFor: spec.actsFor ?? 'anyone', strangerFactor: spec.strangerFactor ?? 1,
        stored: {by, at, authority: null}, anchor: at, status: 'armed', receipts: [],
        watch: {next: at + spec.pulse, seq: spec.watch?.seq ?? 0, true: false}}));
    validate(record);
    record.stored.authority = authority(ports, record, 'store', by, at, spec.trigger);
    if (!record.stored.authority.ok) record.status = 'dormant';
    return record;
}

export function chargeAt(record, at) {
    check(natural(at) && at >= record.anchor, 'charge read precedes anchor.');
    return record.charge ? Math.max(0, record.charge.now - (record.decay
        ? Math.floor((at - record.anchor) / record.decay.every) * record.decay.amount : 0)) : 0;
}

// Materialize whole decay intervals, retaining the fractional interval on spending.
function decayTo(record, at) {
    if (record.charge) {
        record.charge.now = chargeAt(record, at);
        if (record.decay) record.anchor += Math.floor((at - record.anchor) / record.decay.every) * record.decay.every;
    }
}

function bindings(world, record, stimulus, ports) {
    const carrier = world.holders[record.carrier];
    return {$carrier: record.carrier, $place: carrier?.kind === 'place' ? carrier.id : carrier?.place,
        $holder: ports.holder?.(world, record.carrier) ?? (carrier?.kind === 'body' ? carrier.id : carrier?.properties.holder),
        $trigger: stimulus?.by ?? null};
}
function resolve(value, refs) {
    if (Array.isArray(value)) return value.map(v => resolve(v, refs));
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolve(v, refs)]));
    return typeof value === 'string' && Object.hasOwn(refs, value) ? refs[value] : value;
}
const available = (rules, world, from, quantity) => Math.max(0,
    (world.holders[from]?.quantities[quantity] ?? quantityDef(rules, quantity)?.min ?? 0) - (quantityDef(rules, quantity)?.min ?? 0));
function pay(rules, world, from, quantity, amount, cause) {
    check(natural(amount), 'payment must be whole units.');
    return amount ? applyWorldOps(rules, world, [{op: 'add', holder: from, quantity, amount: -amount, source: cause}], cause) : world;
}
// E1 (proposal). With `costs` ({accounts, backers, fault}: the world's data) a published price goes to
// the cost owner: it is debited here, and a payer who is short gets a fault with its price, no refusal.
function owed(rules, world, costs, rows, payer, cause, more) {
    const {world: next, ...settled} = settleCosts({rules, world, costs: rows, payer, cause, ...costs, ...more});
    return {world: next, settled, paid: rows.reduce((n, r) => n + r.amount, 0) - settled.lines.reduce((n, l) => n + l.short, 0)};
}
function receipt(record, row) {
    const entry = {...row, authority: {store: clone(record.stored.authority), fire: row.authority ?? null}, ways: row.ways ?? [...(WAYS_FOR[row.reason] ?? (row.reason ? ways : []))]};
    record.receipts.push(entry);
    return entry;
}

export function fireStored({rules, world, record: input, at, stimulus = {}, way = {}, ports = {}, keys, read, costs}) {
    const record = clone(validate(input));
    check(at === world.clock && at >= record.stored.at, 'fire at the world clock.');
    decayTo(record, at);
    const refs = bindings(world, record, stimulus, ports), by = stimulus.by ?? null;
    const answer = authority(ports, record, 'fire', by, at, stimulus);
    const finish = (status, reason, extra = {}) => ({world, record,
        receipt: receipt(record, {at, by, status, reason, authority: answer, ...extra})});
    // What the authority charges for this firing, allowed or not, is debited from whoever fired (the storer when nobody did).
    const asked = () => {
        if (!costs || !answer.costs?.length) return {};
        const run = owed(rules, world, costs, answer.costs, by ?? record.stored.by, `stored:${record.id}:authority`, {keys, read});
        world = run.world;
        return {settled: run.settled};
    };
    if (terminal(record)) return finish('resisted', record.status);
    if (['touch', 'word'].includes(record.trigger.kind) && stimulus.kind !== 'force' &&
        (stimulus.kind !== record.trigger.kind || !by || record.trigger.word && stimulus.word !== record.trigger.word)) return finish('resisted', 'stimulus');
    if (!answer.ok) return finish('resisted', answer.reason ?? 'authority', {costs: answer.costs ?? [], ways: answer.ways ?? ways, ...asked()});
    if (stimulus.kind !== 'force' && by && (record.keys ?? []).some(key => (world.holders[by]?.properties.marks ?? []).includes(key))) return finish('bypassed', 'key');
    const carrier = world.holders[record.carrier];
    if (!carrier || carrier.properties.lost) { record.status = 'lost'; return finish('lost', 'carrier-lost'); }
    const broken = carrier.properties.broken;
    if (broken && record.whenCarrierBreaks === 'quiet') { record.status = 'broken'; return finish('broken', 'quiet'); }
    const effects = resolve(record.effects, refs);
    let far = false;
    for (const effect of effects) {
        const target = effect.details?.target;
        if (!target) continue;
        let targets;
        try { targets = resolveTargets(world, target); }
        catch (error) { return finish('resisted', error.message); }
        if (!targets.length) return finish('resisted', 'target-unavailable');
        for (const id of targets) {
            const h = world.holders[id], place = h.kind === 'place' ? id : h.place;
            if (place === refs.$place) continue;
            const reach = record.reach;
            if (!reach?.holders?.includes(id) && !(reach?.mark && h.properties.marks?.includes(reach.mark))) return finish('resisted', 'reach');
            far = true;
        }
    }
    const attuned = record.actsFor === 'anyone' || by === (record.actsFor === 'holder' ? refs.$holder
        : record.actsFor === 'storer' ? record.stored.by : record.actsFor);
    const factor = attuned ? 1 : record.strangerFactor;
    const per = record.draw?.per ?? record.charge?.per ?? 0;
    const need = Math.ceil(per * factor + (far ? record.reach.extra ?? 0 : 0));
    const source = way.feed ?? record.draw;
    let have = record.charge?.now ?? 0;
    let from, rate = 1;
    if (source) {
        from = resolve(source.from ?? by, refs); rate = source.rate ?? 1;
        check(positive(rate), 'feed rate must be positive whole units.');
        have = Math.floor(available(rules, world, from, source.quantity) / rate);
    }
    if (broken) have = record.charge?.now ?? 0;
    const spent = broken ? have : Math.min(need, have);
    if (need && (!spent || record.mode === 'held' && spent < need)) {
        record.status = 'dormant'; return finish('dormant', 'charge', {cost: 0});
    }
    const scale = need ? spent / need : 1;
    if (source && !broken) world = pay(rules, world, from, source.quantity, spent * rate, `stored:${record.id}:cost`);
    else if (record.charge) record.charge.now = Math.max(0, record.charge.now - spent);
    const outcomes = [];
    for (const effect of effects) {
        if (effect.details?.amount != null) {
            effect.details.amount = Math.floor(effect.details.amount * scale);
            if (!effect.details.amount) continue;
        }
        const landed = landEffect(rules, world, effect, {cause: `stored:${record.id}:${at}`, by: by ?? record.stored.by, keys, read});
        world = landed.world;
        const {world: ignored, ...outcome} = landed;
        outcomes.push(outcome);
    }
    const resisted = outcomes.find(o => o.reason || o.outcomes.some(a => a.blocked.length || a.skipped.length));
    const reason = resisted?.reason ?? (resisted ? 'world-resisted' : null);
    record.status = broken ? 'broken' : record.mode === 'once' ? 'spent' : 'armed';
    return finish(reason ? 'resisted' : 'fired', reason, {cost: spent * rate, scale, outcomes, ...asked()});
}

export function advanceStoredWorkings({rules, world, records, to, advance, ports = {}, keys, read, costs}) {
    check(natural(to) && to >= world.clock, 'advance needs a later whole clock.');
    records = records.map(r => clone(validate(r))).sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    check(new Set(records.map(r => r.id)).size === records.length, 'duplicate record id.');
    const receipts = [];
    const move = at => {
        const result = advance(clone(world), at);
        check(!result.pending, 'world advancement is pending.');
        world = result.world ?? result;
        check(world.clock === at, 'world did not reach pulse.');
    };
    for (;;) {
        const next = Math.min(...records.filter(r => !terminal(r)).map(r => r.watch.next));
        if (next > to) break;
        check(next >= world.clock, 'record pulse precedes world clock.');
        move(next);
        for (let i = 0; i < records.length; i++) {
            let record = records[i];
            if (terminal(record) || record.watch.next !== next) continue;
            record.watch.next += record.pulse;
            const refs = bindings(world, record, {}, ports), trigger = resolve(record.trigger, refs);
            let stimuli = [];
            const carrier = world.holders[record.carrier];
            if (!carrier || carrier.properties.lost || carrier.properties.broken) stimuli = [{}];
            else if (trigger.kind === 'quantity') {
                const value = world.holders[trigger.holder]?.quantities[trigger.quantity];
                const hit = value != null && (trigger.op === '>=' ? value >= trigger.value : value <= trigger.value);
                if (hit && (!record.watch.true || trigger.again === 'pulse')) stimuli.push({});
                record.watch.true = hit;
            } else if (trigger.kind === 'event') {
                // Optional host journal uses substrate seq/at and retains omitted chain detail.
                stimuli = (ports.events?.(world, record, next) ?? world.chain).filter(row => row.seq > record.watch.seq && row.at >= record.stored.at && row.kind === trigger.event &&
                    Object.entries(trigger.where ?? {}).every(([path, value]) => path.split('.').reduce((v, k) => v?.[k], row) === value));
            } else if (trigger.kind === 'time' && (trigger.at === next || trigger.every && (next - record.stored.at) % trigger.every === 0)) stimuli = [{}];
            else if (['touch', 'word'].includes(trigger.kind)) stimuli = (ports.stimuli?.(world, record, next) ?? []).filter(s => s.kind === trigger.kind && (!trigger.word || s.word === trigger.word));
            // Snapshot the chain before firing. New events remain visible at the next pulse.
            record.watch.seq = world.seq;
            for (const stimulus of stimuli) {
                if (terminal(record)) break;
                const run = fireStored({rules, world, record, at: next, stimulus, ports, keys, read, costs});
                world = run.world; record = run.record; receipts.push(run.receipt);
            }
            records[i] = record;
        }
    }
    move(to);
    return {world, records, receipts};
}

function maintain({rules, world, record: input, at, by, amount = 0, costs}, renew) {
    const record = clone(validate(input));
    check(at === world.clock && at >= record.anchor && natural(amount), 'invalid maintenance clock or amount.');
    decayTo(record, at);
    // A broken pattern can be laid again at the renewal price while its carrier is whole; a lost carrier leaves nothing to ink.
    const carrier = world.holders[record.carrier], gone = !carrier || carrier.properties.lost;
    if (gone || record.status === 'lost' || record.status === 'broken' && (!renew || carrier.properties.broken))
        return {world, record, receipt: receipt(record, {at, by, status: 'resisted', reason: gone ? 'lost' : record.status})};
    check(record.charge, 'maintenance needs a charge reservoir.');
    const price = renew ? record.renew : record.recharge;
    check(price && natural(renew ? price.price : price.rate), 'pack must quote maintenance price.');
    const added = renew ? record.charge.max - record.charge.now : Math.min(amount, record.charge.max - record.charge.now);
    const cost = renew ? price.price : added * price.rate;
    if (costs) {
        // Short of the price: what was paid restores its share, and the fault's price is the rest of the answer.
        const run = owed(rules, world, costs, [{kind: price.kind, quantity: price.quantity, amount: cost}], by, `stored:${record.id}:maintenance`);
        const got = cost ? Math.floor(added * run.paid / cost) : added;
        record.charge.now += got; record.anchor = at;
        if (got && (record.status === 'dormant' || renew && got === added)) record.status = 'armed';
        return {world: run.world, record, receipt: receipt(record, {at, by, status: renew ? 'renewed' : 'recharged', cost: run.paid, added: got, settled: run.settled})};
    }
    if (available(rules, world, by, price.quantity) < cost) return {world, record,
        receipt: receipt(record, {at, by, status: 'resisted', reason: 'price', cost})};
    world = pay(rules, world, by, price.quantity, cost, `stored:${record.id}:maintenance`);
    record.charge.now += added; record.anchor = at;
    if (renew || record.status === 'dormant') record.status = 'armed';
    return {world, record, receipt: receipt(record, {at, by, status: renew ? 'renewed' : 'recharged', cost, added})};
}
export const rechargeStored = args => maintain(args, false);
export const renewStored = args => maintain(args, true);

export function breakStored({rules, world, record: input, at, by, force, payment, ports, keys, read, costs}) {
    check(natural(force) && at === world.clock, 'break needs force at the world clock.');
    const record = clone(validate(input));
    decayTo(record, at);
    if (terminal(record)) return {world, record, receipt: receipt(record, {at, by, status: 'resisted', reason: record.status})};
    check(payment && natural(payment.rate), 'pack must quote force price.');
    let cost = force * payment.rate, settled = null;
    if (costs) {
        // Short of the price: the force that was paid for is the force that lands.
        const run = owed(rules, world, costs, [{kind: payment.kind, quantity: payment.quantity, amount: cost}], by, `stored:${record.id}:force`);
        world = run.world; settled = run.settled;
        if (cost) force = Math.floor(force * run.paid / cost);
        cost = run.paid;
    } else {
        if (available(rules, world, by, payment.quantity) < cost) return {world, record,
            receipt: receipt(record, {at, by, status: 'resisted', reason: 'price', cost})};
        world = pay(rules, world, by, payment.quantity, cost, `stored:${record.id}:force`);
    }
    const broken = force >= (record.strength ?? 0);
    if (!broken && record.charge) record.charge.now = Math.max(0, record.charge.now - force);
    const remaining = record.charge?.now ?? 0;
    if (broken) {
        record.effects = record.effects.map(e => ({...e, details: {...e.details,
            target: {shape: 'holder', id: by}, ...(e.details?.amount != null ? {amount: record.charge?.per ? Math.floor(e.details.amount * remaining / record.charge.per) : e.details.amount} : {})}}));
        if (record.charge) record.charge.per = remaining;
    }
    const run = fireStored({rules, world, record, at, stimulus: {by, kind: 'force'}, ports, keys, read, costs});
    run.record.effects = clone(input.effects);
    if (run.record.charge) run.record.charge.per = input.charge.per;
    if (broken) { run.record.status = 'broken'; if (run.record.charge) run.record.charge.now = 0; }
    run.receipt.forceCost = cost; run.receipt.broken = broken;
    if (settled) run.receipt.forcePaid = settled;
    return run;
}
export const serializeStored = record => JSON.parse(JSON.stringify(validate(record)));
export const restoreStored = saved => clone(validate(saved));
