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

export function coverageCase(id, {preparation = 'crush', amount = 100} = {}) {
    if (id !== DRAUGHT_CASE_ID) throw new Error(`Unknown potion case ${id}.`);
    const {facts} = brewDraughtOfLivingDeath({preparation, beanUnits: 12, precursor: 6,
        carrier: 94, strokes: 'LLLLLLLR', storage: {days: 0, vessel: 'sealed'}});
    const batch = facts.brew.batch;
    const volume = Object.values(batch).reduce((sum, units) => sum + units, 0);
    return {
        basis: 'authored',
        engine: {
            packs: [bodyPack],
            shared: {quantities: [WORLD_QUANTITIES.energy]},
            settings: {[bodyPack]: {dose: {
                liquid, active, baseline, suppressionPerUnit: 14, recoveryPerMinute: 7,
            }}},
        },
        world: {holders: [
            {id: 'infirmary', kind: 'place'},
            {id: 'flask', kind: 'thing', place: 'infirmary', quantities: {[liquid]: volume, [active]: batch.settled ?? 0}},
            {id: 'recipient', kind: 'body', place: 'infirmary', tags: ['living.body'],
                quantities: {satiety: 360, [liquid]: 0, responsiveness: baseline},
                state: {[bodyPack]: livingBodyState({species: 'human', rate: 1})}},
        ]},
        sentence: {verb: 'move', object: 'essence', target: 'touched', time: 'instant', carrier: 'potion'},
        keys: {essence: 'oral-liquid'},
        details: {target: {shape: 'holder', id: 'flask'}, to: 'recipient', amount},
        expect: [
            {holder: 'recipient', quantity: 'responsiveness', direction: 'down', to: 2},
            {holder: 'flask', quantity: liquid, direction: 'down', to: 8},
            {holder: 'flask', quantity: active, direction: 'down', to: 1},
        ],
    };
}
