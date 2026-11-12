// Potion workroom adapter. The process resolver owns transfers. The workroom
// owns the water, timed jobs, bottle custody and which readings were observed.
import {cleanProcessVessel, contactProcessVessel, defineSeparationLaw, separateProcessBatch} from './craft_process_separation.js';

const operations = ['strain', 'decant', 'skim', 'distill', 'divide'];
const require = (ok, reason) => { if(!ok) throw Error(reason); };
const whole = n => Number.isSafeInteger(n) && n >= 0;
const film = vessel => vessel.films[0]?.amount ?? 0;
const lawRef = rule => `${rule.law.id}@${rule.law.revision}`;

export function definePotionLining(spec) {
    const {id, tracer, label, partsPerMeasure, volumePerMeasure, washMinutes, retainPermille, releasePerVolume} = spec;
    const law = defineSeparationLaw({
        id, revision: 1, constituents: {[tracer]: {}},
        costs: Object.fromEntries(operations.map(op => [op, {secondsPerVolume: 1, workPerVolume: 1}])),
        filmRetainPermille: retainPermille, filmReleasePerVolume: releasePerVolume,
        cleanWaterPerAmount: 1, cleanWorkPerAmount: 1,
    });
    const vessel = {id: `${id}.vessel`, material: 'porous_lining', capacity: spec.capacity, closure: 'open',
        meshSize: 0, thermalMass: 1, heatTransfer: 1, condenserPermille: 0, films: []};
    return {law, vessel, tracer, label, partsPerMeasure, volumePerMeasure, washMinutes};
}

function currentVessel(history, rule) {
    const last = history?.at(-1);
    return last ? last.vessel : rule.vessel;
}

export function planLiningBrew(history, rule, {serial, product, volume, freshTrace}) {
    const vessel = currentVessel(history, rule);
    if(!freshTrace && !film(vessel)) return null;
    const contact = contactProcessVessel(rule.law, {volume,
        constituents: [{id: rule.tracer, phase: 'dissolved', amount: freshTrace}]}, vessel);
    const poured = separateProcessBatch(rule.law, contact.batch, {op: 'decant'}, contact.vessel);
    return {kind: 'brew', law: lawRef(rule), serial, product, volume, freshTrace, released: contact.released[0]?.amount ?? 0,
        bottle: poured.product, vessel: poured.vessel};
}

export function planLiningWash(history, rule, serial) {
    const vessel = currentVessel(history, rule);
    require(film(vessel), 'The lining has no retained tracer to wash out.');
    const waterMeasures = Math.ceil(film(vessel) / rule.volumePerMeasure);
    const volume = waterMeasures * rule.volumePerMeasure;
    const wash = cleanProcessVessel(rule.law, vessel, {water: volume, work: volume});
    return {kind: 'wash', law: lawRef(rule), serial, waterMeasures, wash: {...wash.waste, volume}, vessel: wash.vessel};
}

export function traceParts(batch) {
    return batch.constituents[0]?.amount ?? 0;
}

export function viewLining(history, rule, uses = {}) {
    if(!rule) return null;
    const lastWash = history?.findLast(row => row.kind === 'wash');
    const amount = film(currentVessel(history, rule));
    const waterMeasures = Math.ceil(amount / rule.volumePerMeasure);
    const balance = {added: 0, held: 0, used: 0, washed: 0};
    for(const entry of history ?? []) {
        if(entry.kind === 'wash') balance.washed += traceParts(entry.wash);
        else {
            balance.added += entry.freshTrace;
            balance[Object.hasOwn(uses, entry.serial) ? 'used' : 'held'] += traceParts(entry.bottle);
        }
    }
    return {label: rule.label, balance, washMinutes: rule.washMinutes * waterMeasures, waterMeasures,
        film: amount,
        lastWash: lastWash && {serial: lastWash.serial, volume: lastWash.wash.volume, parts: traceParts(lastWash.wash)}};
}

export function validateLiningHistory(history, rule, serial) {
    require(rule && Array.isArray(history), 'Invalid cauldron lining history.');
    const replay = [];
    for(const entry of history) {
        require(whole(entry.serial) && entry.serial > (replay.at(-1)?.serial ?? 0) && entry.serial <= serial,
            'Invalid cauldron history order.');
        const expected = entry.kind === 'wash' ? planLiningWash(replay, rule, entry.serial)
            : planLiningBrew(replay, rule, entry);
        require(expected && JSON.stringify(expected) === JSON.stringify(entry), 'Invalid saved cauldron material transfer.');
        replay.push(expected);
    }
}
