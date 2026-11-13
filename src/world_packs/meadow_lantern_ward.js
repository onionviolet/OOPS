// The clip supplies charge. The worn gear and stored working own interception.
import {applyEngineOps} from '../engine_world.js';
import {bindGearWard, catchGearHit, settleGearHit} from './gear_ward.js';
import {landEffect} from '../effect_host.js';
import {resolveTargets} from '../world_effects.js';

const coatCharge = 'energy:lantern-charge';
const load = 4;

export function bindLanternWoolWard(engine, {id, wool, carrier, bearer}) {
    const clip = engine.world.holders[wool];
    const worn = engine.world.holders[carrier];
    const body = engine.world.holders[bearer];
    if (clip?.kind !== 'thing' || worn?.kind !== 'thing' || body?.kind !== 'body' ||
        clip.place !== body.place || worn.place !== body.place ||
        clip.properties.holder !== bearer || worn.properties.holder !== bearer || wool === carrier ||
        worn.properties.broken || worn.properties.lost || clip.properties.lost ||
        !((clip.quantities['stock:fine-wool'] ?? 0) > 0 || (clip.quantities['stock:wool'] ?? 0) > 0) ||
        !(clip.quantities[coatCharge] >= load) || Object.hasOwn(engine.records.stored, id) ||
        Object.values(engine.records.stored).some(row => row.carrier === carrier && row.ward &&
            !['spent', 'broken', 'lost'].includes(row.status)))
        return {ok: false, reason: 'wool-ward-needs-held-carrier-and-charged-clip', engine};

    const bound = bindGearWard(engine, {id, carrier, bearer, type: 'fire', phase: 'contact', charge: load, per: 2});
    return {ok: true, engine: applyEngineOps(bound, [
        {op: 'add', holder: wool, quantity: coatCharge, amount: -load},
    ], `wool-ward:${id}`)};
}

// The local caller supplies the type and phase after resolving spell contact.
// This consumes the settled damage effect instead of landing it a second time.
export function settleLanternWardImpact(engine, {id, effect, type, phase, attacker, settle}) {
    const {sentence, details} = effect;
    if (sentence?.verb !== 'remove' || sentence.object !== 'vitality' || sentence.time !== 'instant' ||
        details?.target?.shape !== 'holder' || !Number.isSafeInteger(details.amount) || details.amount <= 0)
        throw Error('The ward needs one settled direct vitality impact.');
    return settleGearHit(engine, {id, wearer: details.target.id, attacker, settle,
        packets: [{type, phase, amount: details.amount}]});
}

export function lanternSpellWardPort({id, spell, type, packets}) {
    return ({engine, effect, landed, cause, by}) => {
        const {sentence, details} = effect ?? {};
        if (effect?.name !== spell || sentence?.verb !== 'remove' || sentence.object !== 'vitality' ||
            sentence.time !== 'instant' || details?.contact?.held ||
            !(details?.contact || ['holders', 'present'].includes(details?.target?.shape)) ||
            !Number.isSafeInteger(details.amount) || details.amount <= 0) return undefined;
        const incoming = packets ?? [{type, phase: 'contact', amount: details.amount}];
        if (!incoming.every(row => Number.isSafeInteger(row.amount) && row.amount > 0) ||
            incoming.reduce((sum, row) => sum + row.amount, 0) !== details.amount)
            throw Error('Ward damage packets must account for the whole spell impact.');
        const area = !details.contact;
        // Area membership is fixed at impact. Resolve each member's protection
        // against the current world, after reactions from earlier members.
        const targets = area ? resolveTargets(engine.world, details.target) :
            landed.outcomes.flatMap(outcome => outcome.applied)
                .filter(row => row.verb === 'remove' && row.object === 'vitality').map(row => row.target);
        let current = engine, intercepted = false, applied = false;
        const {contact, ...aim} = details;
        const land = (state, target, amount, previewVitality = false) => landEffect(state.rules, state.world,
            {...effect, details: {...aim, target: {shape: 'holder', id: target}, amount}},
            {cause, by, keys: state.host.effects.keys, read: state.host.effects.read, previewVitality});
        for (const target of targets) {
            if (!current.world.holders[target]) continue;
            const unprotected = area ? land(current, target, details.amount, true) : landed;
            if (unprotected.status !== 'landed') continue;
            const hit = current.world.holders[target]?.kind === 'body'
                ? catchGearHit(current, {id, wearer: target, attacker: by, packets: incoming, settle: false})
                : {engine: current, remainder: incoming, absorbed: 0};
            intercepted ||= hit.absorbed > 0 || hit.engine.records.stored !== current.records.stored;
            if (!area && !intercepted) continue;
            const amount = hit.remainder.reduce((sum, packet) => sum + packet.amount, 0);
            const next = amount && land(hit.engine, target, amount);
            current = next ? {...hit.engine, world: next.world} : hit.engine;
            applied ||= next?.status === 'landed';
        }
        if (!area && !intercepted) return undefined;
        return {world: current.world, stored: current.records.stored, status: applied ? 'landed' : 'idle',
            ...(!applied && intercepted ? {reason: 'The worn ward caught the impact.'} : {})};
    };
}
