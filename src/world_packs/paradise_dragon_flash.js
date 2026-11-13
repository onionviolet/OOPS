// RP-M1 / PC95. Ch. 196 of the local English MTL, corroborated by Reincarnation
// Paradise [EDITED] ch. 196 (https://www.webnovel.com/book/23336301206178105/62666404943417286).
// The kernel owns settlement, the substrate owns the exact weapons and their
// lineage, and the contest owns hit resolution and changes to the bodies.
import {beginContest, defineContestLaw, runContest} from '../contest.js';
import {CONTEST_RESOLVERS} from '../contest_resolvers.js';
import {startEngineWorking} from '../engine_world.js';
import {defineWorkingLaw, quoteWorking} from '../kernel_working.js';
import {substratePort} from '../world_substrate.js';
import {WORLD_QUANTITIES} from '../world_quantities.js';

export const RC_CELL_RHYTHM = 'rc_cell_rhythm';
export const BLOOD_SACRIFICE_RITE = 'blood_sacrifice_rite';
export const DRAGON_FLASH = 'dragon_flash';
export const DONOR_WEAPON = 'tc_jack';
export const WEAPON_STOCK = 'stock:paradise_weapon';

// Chapter values for the selected feed, not a formula for any blue weapon.
export const DRAGON_FLASH_AFTER = Object.freeze({edge: 48, durability: 67, attackMin: 20, attackMax: 48, rating: 60});
export const DRAGON_FLASH_BEFORE = Object.freeze({durability: 60, attackMin: 17, attackMax: 40, rating: 52});
const PHYSICAL_STRENGTH = 2;
const COMPRESSED_BLOOD_LOSS = 4;
const fields = Object.keys(DRAGON_FLASH_AFTER);
const roles = {actor: 'body', receiver: 'weapon', donor: 'weapon'};
const property = name => `paradise.${name}`;
export const dragonFlashProperties = [
    ...['model', 'custodian', 'passive'].map(name => ({id: property(name), type: 'label'})),
    {id: property('supreme_edge_blade'), type: 'flag'},
    ...fields.map(name => ({id: property(name), type: 'level', min: 0, max: 100})),
];
export const bladeProperties = (model, custodian, passive, stats = {}) => ({
    [property('model')]: model, [property('custodian')]: custodian, [property('passive')]: passive,
    ...Object.fromEntries(Object.entries(stats).map(([key, value]) => [property(key), value])),
});
const holdsWeapon = (actor, weapon) => weapon && weapon.properties[property('custodian')] === actor.id &&
    weapon.place === actor.place && weapon.quantities[WEAPON_STOCK] === 1;

const upgradeLaw = defineWorkingLaw({id: 'paradise.supreme_edge_blade', revision: 1, operations: {
    absorb: {roles, settle({bound: {actor, receiver, donor}, options: {passive}}) {
        if (!actor.properties[property('supreme_edge_blade')]) return {ok: false, reason: 'Supreme Edge Blade is unavailable.'};
        if (receiver.holder === donor.holder || !holdsWeapon(actor, receiver) || !holdsWeapon(actor, donor))
            return {ok: false, reason: 'Hold Dragon Flash and a separate donor blade.'};
        if (receiver.properties[property('model')] !== DRAGON_FLASH || donor.properties[property('model')] !== DONOR_WEAPON ||
            receiver.properties[property('rating')] !== DRAGON_FLASH_BEFORE.rating)
            return {ok: false, reason: 'These blades do not fit the chapter 196 feed.'};
        if (![receiver.properties[property('passive')], donor.properties[property('passive')]].includes(passive) ||
            ![RC_CELL_RHYTHM, BLOOD_SACRIFICE_RITE].includes(passive))
            return {ok: false, reason: 'Choose a passive from the two blades.'};
        const update = (name, value) => ({op: 'property', holder: receiver.holder, property: property(name), value});
        return {ok: true, observed: {donor: donor.id, receiver: receiver.id, passive}, effects: [
            {op: 'lifecycle', act: 'end', holder: donor.holder, to: ['row:paradise.sacrificed']},
            ...Object.entries(DRAGON_FLASH_AFTER).map(([name, value]) => update(name, value)), update('passive', passive),
        ]};
    }},
}});

export const dragonFlashHost = {
    packs: ['c.contest'], host: {laws: [upgradeLaw]},
    shared: {properties: dragonFlashProperties, quantities: [WORLD_QUANTITIES.stock]},
};

function upgradePlan({id, actor, receiver, donor, passive}) {
    return {id, law: upgradeLaw,
        method: {id: 'paradise.chapter196_feed', revision: 1, law: upgradeLaw.ref, roles,
            // The passage gives tens of seconds for the crushing. Use one whole engine minute.
            steps: [{op: 'absorb', bindings: {actor: 'actor', receiver: 'receiver', donor: 'donor'}, minutes: 1, options: {passive}}]},
        bindings: {actor: {kind: roles.actor, id: actor}, receiver: {kind: roles.receiver, id: receiver}, donor: {kind: roles.donor, id: donor}}};
}

export function quoteDragonFlashUpgrade(engine, request) {
    const {law, method, id, bindings} = upgradePlan(request);
    const read = substratePort(engine.world);
    // Forecast against the current loadout. The host rereads it at the deadline.
    const quote = quoteWorking(law, method, {id, bindings, at: engine.world.clock, ports: {read: ref => read(ref)}});
    return {...quote, sacrifice: quote.ok ? {id: request.donor, quantity: 1} : null};
}

export function startDragonFlashUpgrade(engine, request) {
    const quote = quoteDragonFlashUpgrade(engine, request);
    return quote.ok ? {quote, engine: startEngineWorking(engine, upgradePlan(request))} : {quote, engine};
}

// Authored contest calibration. RC's physical strength maps one-for-one to
// strike power. The four-second bleed is compressed to one supplemental loss
// on a wounding hit for this comparison. Timed, stacking wounds need a host on
// the contest clock. Blood eligibility comes from the body's profile.
const contestLaw = defineContestLaw({id: 'c.paradise_dragon_flash', revision: 1, moves: {
    slash: {resolver: 'blade', steps: [8], costs: {stamina: 2}},
    counter: {resolver: 'strike', steps: [11], power: 14, costs: {stamina: 2}},
}, resolvers: {
    blade(args) {
        const {bladePower, passive} = args.actor.profile;
        const power = bladePower + (passive === RC_CELL_RHYTHM ? PHYSICAL_STRENGTH : 0);
        const strike = CONTEST_RESOLVERS.strike({...args, move: {...args.move, power}});
        if (passive === BLOOD_SACRIFICE_RITE && args.target.profile.bleeds && strike.landed.length > 0)
            strike.landed.push({verb: 'remove', object: 'vitality', amount: COMPRESSED_BLOOD_LOSS});
        return strike;
    },
}});

export function runDragonFlashBout(engine, {id, seed, place, actor, receiver, rival, limits}) {
    const blade = substratePort(engine.world)({kind: 'weapon', id: receiver});
    if (!holdsWeapon({id: actor, place}, blade) || blade.properties[property('model')] !== DRAGON_FLASH ||
        engine.world.holders[actor]?.place !== place || engine.world.holders[rival]?.place !== place)
        throw Error('Bring Dragon Flash and both fighters to the bout.');
    const props = blade.properties;
    const min = props[property('attackMin')], max = props[property('attackMax')];
    if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max) || min <= 0 || max < min)
        throw Error('Dragon Flash needs a valid attack range.');
    const bladePower = Math.round((min + max) / 2);
    const entrants = [
        {id: actor, body: actor, side: 'a', profile: {attack: 28, evasion: 12, bladePower, passive: props[property('passive')]}, moves: ['slash']},
        {id: rival, body: rival, side: 'b', profile: {attack: 19, evasion: 12, armor: 3,
            bleeds: engine.world.holders[rival].tags.includes('circulating_blood')}, moves: ['counter']},
    ];
    const record = beginContest(contestLaw, {id, seed, place, entrants, limits}, engine.world);
    const run = runContest(contestLaw, record, engine.rules, engine.world);
    return {record: run.record, engine: {...engine, world: run.world}};
}
