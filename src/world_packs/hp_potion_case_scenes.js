// Engine coverage fixture (PC95, AD32). The brew's actual settled fraction
// supplies the active material. Dose size, response and recovery are authored.
import {WORLD_QUANTITIES} from '../world_quantities.js';
import {livingBodyState} from '../world_substrate_packs/living_body.js';
import {brewDraughtOfLivingDeath} from './hp_brew_pack.js';

export const DRAUGHT_CASE_ID = 'draught_of_living_death';
const bodyPack = 'l.living_body';
const liquid = 'energy:oral-liquid';
const active = 'energy:settled-soporific';
const baseline = 100;
const suppressionPerUnit = 14;
const recoveryPerMinute = 7;

export function coverageCase(id, {preparation = 'crush', amount = 100} = {}) {
    if (id !== DRAUGHT_CASE_ID) throw new Error(`Unknown potion case ${id}.`);
    const {facts} = brewDraughtOfLivingDeath({preparation, beanUnits: 12, precursor: 6,
        carrier: 94, strokes: 'LLLLLLLR', storage: {days: 0, vessel: 'sealed'}});
    const batch = facts.brew.batch;
    const volume = Object.values(batch).reduce((sum, units) => sum + units, 0);
    const settled = batch.settled ?? 0;
    const absorbed = Math.floor(settled * amount / volume);
    const loss = Math.min(baseline, absorbed * suppressionPerUnit);
    const recovery = Math.ceil(loss / recoveryPerMinute);
    const response = (direction, to) => ({holder: 'recipient', quantity: 'responsiveness', direction, to});
    return {
        basis: 'authored',
        engine: {
            packs: [bodyPack],
            shared: {quantities: [WORLD_QUANTITIES.energy]},
            settings: {[bodyPack]: {dose: {
                liquid, active, baseline, suppressionPerUnit, recoveryPerMinute,
            }}},
        },
        world: {holders: [
            {id: 'infirmary', kind: 'place'},
            {id: 'flask', kind: 'thing', place: 'infirmary', quantities: {[liquid]: volume, [active]: settled}},
            {id: 'recipient', kind: 'body', place: 'infirmary', tags: ['living.body'],
                quantities: {satiety: 360, [liquid]: 0, responsiveness: baseline},
                state: {[bodyPack]: livingBodyState({species: 'human', rate: 1})}},
        ]},
        timeline: [
            {id: 'dose',
                sentence: {verb: 'move', object: 'essence', target: 'touched', time: 'instant', carrier: 'potion'},
                keys: {essence: 'oral-liquid'},
                details: {target: {shape: 'holder', id: 'flask'}, to: 'recipient', amount},
                expect: [response('down', baseline - loss)]},
            {id: 'before-recovery', advanceTo: recovery - 1,
                expect: [response(recovery > 1 ? 'up' : 'unchanged', baseline - loss + (recovery - 1) * recoveryPerMinute)]},
            {id: 'recovered', advanceTo: recovery, expect: [response('up', baseline)]},
        ],
        expect: [
            response('unchanged', baseline),
            {holder: 'flask', quantity: liquid, direction: 'down', to: volume - amount},
            {holder: 'flask', quantity: active, direction: 'down', to: settled - absorbed},
        ],
    };
}
