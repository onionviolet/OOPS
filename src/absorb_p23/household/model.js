// Original domestic proposals. Proto23 is inspiration only; no copied code/assets.
// Pure transaction plans. P00 publishes these with native inventory/conditions
// and the root sequence atomically; this module never owns those resources.
import {natural} from '../../basics.js';
export const HOUSEHOLD = Object.freeze({schema: 1, animalId: 'household.moss', name: 'Moss',
    fuelKey: JSON.stringify({id: 'Rough wood log'}), giftKey: JSON.stringify({id: 'Rat tail'}),
    burnMinutes: 20, dryMinutes: 3, giftMinutes: 60, growMinutes: 1440});
const check = (ok, message) => {if(!ok) throw new Error(`Household: ${message}`);};
const shape = (o, keys) => o && typeof o === 'object' && !Array.isArray(o) &&
    Object.keys(o).length === keys.length && keys.every(k => Object.hasOwn(o, k));
const id = v => typeof v === 'string' && v.length > 0 && v.length <= 120;
const bounded = (v, max) => natural(v) && v <= max;

/** Optional save block: absence remains absence, never a migration grant. */
export function validateHousehold(s, {clock = Number.MAX_SAFE_INTEGER, sequence = Number.MAX_SAFE_INTEGER} = {}) {
    if(s === undefined) return s;
    check(natural(clock) && natural(sequence), 'invalid native clock/sequence');
    check(shape(s, ['schema', 'homeId', 'lastClock', 'lastSequence', 'animal', 'hearth']) &&
        s.schema === 1 && id(s.homeId) && natural(s.lastClock) && s.lastClock <= clock &&
        natural(s.lastSequence) && s.lastSequence <= sequence, 'unsupported schema or clock');
    const a = s.animal;
    check(a === null || (shape(a, ['id', 'metAt', 'bond', 'interactions', 'lastInteraction', 'ageMinutes', 'mood', 'adopted', 'lastGiftAt', 'gifts']) &&
        a.id === HOUSEHOLD.animalId && natural(a.metAt) && a.metAt <= s.lastClock &&
        bounded(a.bond, 100) && natural(a.interactions) && a.interactions >= 1 && natural(a.lastInteraction) &&
        a.lastInteraction >= a.metAt && a.lastInteraction <= s.lastClock && natural(a.ageMinutes) &&
        a.ageMinutes === s.lastClock - a.metAt && ['curious', 'content', 'sheltering'].includes(a.mood) &&
        typeof a.adopted === 'boolean' && a.adopted === (a.bond >= 30) &&
        natural(a.lastGiftAt) && a.lastGiftAt >= a.metAt && a.lastGiftAt <= s.lastClock && natural(a.gifts) &&
        a.gifts <= Math.floor((s.lastClock - a.metAt) / HOUSEHOLD.giftMinutes)), 'invalid animal');
    const h = s.hearth;
    check(shape(h, ['fuelMinutes', 'ventilated', 'smokeOptIn', 'smoke', 'dryProgress']) &&
        bounded(h.fuelMinutes, HOUSEHOLD.burnMinutes) && typeof h.ventilated === 'boolean' &&
        typeof h.smokeOptIn === 'boolean' && bounded(h.smoke, 10) && bounded(h.dryProgress, HOUSEHOLD.dryMinutes) &&
        (h.smokeOptIn || h.smoke === 0), 'invalid hearth');
    return s;
}
function create(clock, sequence, homeId) {
    return {schema: 1, homeId, lastClock: clock, lastSequence: sequence, animal: null,
        hearth: {fuelMinutes: 0, ventilated: true, smokeOptIn: false, smoke: 0, dryProgress: 0}};
}
function supported(c) {
    check(c.alive === true && c.controlled === true && c.homeOwned === true && id(c.homeId), 'living controlled owner and actual home required');
}
function here(c, s) {supported(c); check(c.atHome === true && c.homeId === s.homeId, 'return to this owned home');}
const count = (c, key) => natural(c.ownedInventory?.[key]) ? c.ownedInventory[key] : 0;

/**
 * c: {sequence,clock,homeId,homeOwned,atHome,alive,controlled,animalKnown,
 * hearthOwned,ownedInventory,wet,knownGift}. Every value comes from native
 * custody/discovery/location owners, not command payloads. Tick is called at
 * every played-clock change BEFORE commands/travel. No wall clock catch-up.
 * event: {type,sequence,clock,elapsed?}. Sequence is the NEW root sequence.
 * Result effects are intents, not fulfilled receipts. Preflight/publish all.
 */
export function planHousehold(state, event, c) {
    check(natural(c.sequence) && natural(c.clock), 'native snapshot required');
    validateHousehold(state, c);
    check(event && natural(event.sequence) && event.sequence === c.sequence + 1 && event.clock === c.clock,
        'stale root sequence or clock');
    const actions = ['meet', 'pet', 'light', 'ventilate', 'close_vent', 'smoke_on', 'smoke_off', 'extinguish', 'tick', 'leave'];
    check(actions.includes(event.type), 'unknown action');
    if(!state && ['tick', 'leave'].includes(event.type)) return {state: undefined, effects: [], notices: []};
    if(!state) {check(['meet', 'light'].includes(event.type), 'meet Moss or light an owned hearth to enroll'); supported(c); check(c.atHome === true, 'enroll only at your owned home');}
    const s = structuredClone(state || create(c.clock, c.sequence, c.homeId)), effects = [], notices = [];
    const h = s.hearth, a = s.animal;
    check(s.homeId === c.homeId, 'household belongs to another home');
    const delta = c.clock - s.lastClock;
    if(event.type === 'tick') {
        check(natural(event.elapsed) && event.elapsed === delta, 'played delta must match saved/native clock');
        // Prepaid fuel burns only on real played ticks, including while outside.
        const heated = Math.min(delta, h.fuelMinutes);
        h.fuelMinutes -= heated;
        const usable = c.atHome === true && c.homeOwned === true && c.hearthOwned === true &&
            c.alive === true && c.controlled === true;
        const smoky = usable && h.smokeOptIn && !h.ventilated;
        h.smoke = smoky ? Math.max(0, Math.min(10, h.smoke + heated) - (delta - heated) * 2) : Math.max(0, h.smoke - delta * 2);
        if(usable && c.wet === true && heated > 0) {
            h.dryProgress = Math.min(HOUSEHOLD.dryMinutes, h.dryProgress + heated);
            if(h.dryProgress === HOUSEHOLD.dryMinutes) {
                effects.push({type: 'removeCondition', id: 'Wet'});
                notices.push('The paid hearth warmth dries your wet clothes.');
                h.dryProgress = 0;
            }
        } else if(c.wet !== true || !usable) h.dryProgress = 0;
        if(a) {a.ageMinutes += delta; a.mood = h.smoke > 0 ? 'sheltering' : a.adopted ? 'content' : 'curious';}
    } else {
        check(delta === 0, 'settle the played tick before acting');
        if(event.type !== 'leave') here(c, s);
        switch(event.type) {
        case 'meet':
            check(c.animalKnown === true && !a, 'meet the discovered animal only once');
            s.animal = {id: HOUSEHOLD.animalId, metAt: c.clock, bond: 10, interactions: 1,
                lastInteraction: c.clock, ageMinutes: 0, mood: 'curious', adopted: false, lastGiftAt: c.clock, gifts: 0};
            notices.push('Moss, a young brindled cat, sniffs your hand and remembers it.'); break;
        case 'pet':
            check(a && c.animalKnown === true && h.smoke === 0, 'Moss must be known and safely here');
            check(c.clock >= a.lastInteraction + 5, 'Give Moss five played minutes between visits.');
            a.interactions++; a.bond = Math.min(100, a.bond + 10); a.lastInteraction = c.clock;
            a.adopted = a.bond >= 30; a.mood = a.adopted ? 'content' : 'curious';
            notices.push(`Moss leans into your hand. Bond ${a.bond}/100${a.adopted ? '; this is home now' : ''}.`);
            if(a.adopted && c.knownGift === true && c.clock >= a.lastGiftAt + HOUSEHOLD.giftMinutes) {
                a.lastGiftAt = c.clock; a.gifts++;
                effects.push({type: 'item', key: HOUSEHOLD.giftKey, amount: 1});
                notices.push('Moss leaves a rat tail at your feet after hunting outside.');
            } break;
        case 'light':
            check(c.hearthOwned === true && h.fuelMinutes === 0, 'an owned unlit hearth required');
            check(count(c, HOUSEHOLD.fuelKey) >= 1, 'carry one unborrowed Rough wood log');
            effects.push({type: 'item', key: HOUSEHOLD.fuelKey, amount: -1}); h.fuelMinutes = HOUSEHOLD.burnMinutes;
            notices.push('One real log fuels twenty played minutes. No automatic refuelling.'); break;
        case 'ventilate': h.ventilated = true; h.smoke = 0; notices.push('Fresh air clears the room.'); break;
        case 'close_vent': check(c.hearthOwned === true, 'owned hearth required'); h.ventilated = false; break;
        case 'smoke_on': check(c.hearthOwned === true, 'owned hearth required'); h.smokeOptIn = true; break;
        case 'smoke_off': h.smokeOptIn = false; h.smoke = 0; break;
        case 'extinguish': h.fuelMinutes = 0; h.smoke = 0; h.dryProgress = 0;
            notices.push('You quench the fire. Spent fuel is not refunded.'); break;
        case 'leave': check(c.atHome === false, 'publish this alongside native travel outside'); h.dryProgress = 0; break;
        }
        if(s.animal) s.animal.mood = h.smoke > 0 ? 'sheltering' : s.animal.adopted ? 'content' : 'curious';
    }
    // Smoke has no lethal damage or independent timer. Native owner projects
    // this reversible exposure and clears it immediately upon exit/ventilation.
    effects.push({type: 'householdSmoke', active: c.atHome === true && h.smokeOptIn && h.smoke > 0,
        intensity: c.atHome === true && h.smokeOptIn ? h.smoke : 0});
    s.lastClock = c.clock; s.lastSequence = event.sequence;
    validateHousehold(s, {clock: c.clock, sequence: event.sequence});
    return {state: s, effects, notices};
}

/** Derived only. P00 multiplies a native sleeping recovery once, never XP. */
export function householdRest(state, c, comfort = {score: 0}) {
    validateHousehold(state, c);
    if(!state || c.atHome !== true || c.homeOwned !== true || c.homeId !== state.homeId ||
        c.alive !== true || c.controlled !== true || state.hearth.smoke > 0) return 1;
    check(bounded(comfort.score, 20), 'invalid owned comfort');
    const animal = state.animal?.adopted && state.animal.mood === 'content' && c.animalKnown === true ?
        (state.animal.ageMinutes >= HOUSEHOLD.growMinutes ? 0.05 : 0.03) : 0;
    return 1 + animal + Math.min(6, comfort.score) * 0.01;
}
