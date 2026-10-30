import {ringSpiritCard} from './cheat_growth.js';
import {validateModuleState,moduleCard,CHEAT_MODULES} from './cheat_definitions.js';
// C0 data contract. Granting one runs no hooks.
const CARD_KEYS = ['id', 'family', 'name', 'ui', 'terms', 'hooks', 'state', 'stages', 'observers', 'sources'];
const PANELS = new Set(['status-window', 'death-menu', 'anchor-list', 'system-shop', 'companion-voice',
    'simulator', 'simulator-foresight', 'appraisal-lens', 'harvest-ledger', 'harvest-multiplier-ledger',
    'cheat-library', 'cheat-settings', 'quiet']);
const TERMS = new Set(['gift', 'digested', 'matured', 'lease', 'loan', 'lien', 'leash', 'burdened-loan', 'bound-item']);
function object(value, label) {
    if(!value || typeof value !== 'object' || Array.isArray(value) || ![Object.prototype, null].includes(Object.getPrototypeOf(value)))
        throw new Error(`Invalid cheat ${label}: expected an object.`);
}
function keys(value, allowed, label) {
    object(value, label);
    if(Object.keys(value).some(key => !allowed.includes(key)) || allowed.some(key => !Object.hasOwn(value, key)))
        throw new Error(`Invalid cheat ${label}: expected only ${allowed.join(', ')}.`);
}
function text(value, label) {
    if(typeof value !== 'string' || !value.trim()) throw new Error(`Invalid cheat ${label}: expected non-empty text.`);
}
// All nested data must survive JSON serialization without loss or executable values.
function json(value, label, ancestors = new Set()) {
    if(value === null || typeof value === 'string' || typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value))) return;
    if(typeof value !== 'object' || ancestors.has(value)) throw new Error(`Invalid cheat ${label}: expected JSON data.`);
    if(!Array.isArray(value)) object(value, label);
    ancestors.add(value);
    for(const child of Object.values(value)) json(child, label, ancestors);
    ancestors.delete(value);
}
function timestamp(at) {
    if(at == null) throw new Error('Invalid cheat timestamp: expected a recorded time.');
    json(at, 'timestamp');
}
export function validateCheatCard(card) {
    keys(card, CARD_KEYS, 'card');
    for(const key of ['id', 'family', 'name']) text(card[key], `card ${key}`);
    if(!PANELS.has(card.ui)) throw new Error('Invalid cheat card ui: unknown panel.');
    if(!TERMS.has(card.terms)) throw new Error('Invalid cheat card terms.');
    object(card.state, 'card state');
    validateModuleState(card);
    if(Object.hasOwn(card.state, 'awakened') && typeof card.state.awakened !== 'boolean')
        throw new Error('Invalid cheat awakened state: expected a boolean.');
    if(Object.hasOwn(card.state, 'points') && (!Number.isSafeInteger(card.state.points) || card.state.points < 0))
        throw new Error(`Invalid cheat card ${card.id} points: expected a non-negative integer.`);
    for(const key of ['hooks', 'stages', 'observers', 'sources']) {
        if(!Array.isArray(card[key])) throw new Error(`Invalid cheat card ${key}: expected an array.`);
    }
    json(card, 'card');
    return structuredClone(card);
}
export function defaultCheatState() { return {schema: 1, held: {}, known: {}}; }
export function validateCheatState(state) {
    keys(state, ['schema', 'held', 'known'], 'state');
    if(state.schema !== 1) throw new Error('Invalid cheat state schema: expected 1.');
    object(state.held, 'held'); object(state.known, 'known');
    for(const [id, entry] of Object.entries(state.held)) {
        keys(entry, ['card', 'acquired', 'messages'], 'held entry');
        validateCheatCard(entry.card);
        if(entry.card.id !== id) throw new Error('Invalid cheat card id: held key must match.');
        keys(entry.acquired, ['route', 'at'], 'acquisition');
        text(entry.acquired.route, 'acquisition route'); timestamp(entry.acquired.at);
        if(!Array.isArray(entry.messages)) throw new Error('Invalid cheat messages: expected an array.');
        if(entry.card.state.awakened === true && entry.messages.length === 0)
            throw new Error(`Invalid cheat card ${id}: awakening requires its first system message.`);
        for(const message of entry.messages) {
            keys(message, ['text', 'at'], 'message'); text(message.text, 'message text'); timestamp(message.at);
        }
    }
    json(state, 'state');
    return structuredClone(state);
}
export function grantCheat(state, card, {route, at}) {
    const next = validateCheatState(state), validated = validateCheatCard(card);
    if(Object.hasOwn(next.held, validated.id)) throw new Error('Cheat card is already held.');
    Object.defineProperty(next.held, validated.id, {value: {card: validated, acquired: {route, at: structuredClone(at)}, messages: []}, enumerable: true, writable: true, configurable: true});
    return validateCheatState(next);
}
export function recordCheatMessage(state, id, text, at) {
    const next = validateCheatState(state);
    if(!Object.hasOwn(next.held, id)) throw new Error('Cannot record a message for an unheld cheat.');
    next.held[id].messages.push({text, at: structuredClone(at)});
    return validateCheatState(next);
}
export const SYSTEM_QUESTS_CARD = Object.freeze({id: 'system-quests', family: 'system', name: 'Quest system',
    ui: 'status-window', terms: 'gift', hooks: Object.freeze([]), state: Object.freeze({}),
    stages: Object.freeze([]), observers: Object.freeze([]), sources: Object.freeze([])});

// CH1: explicit dormancy is opt-in; legacy C0 cards and messages stay valid.
export function optionalStartCard() {
    return {...structuredClone(SYSTEM_QUESTS_CARD), state: {awakened: false, points: 0, wake: {day: 3, victory: true}, firstMessage: FIRST_SYSTEM_MESSAGE}};
}
// AD29: this is a personal faculty, without a voice or a quest giver.
export function quietFacultyCard() {
    return {...structuredClone(SYSTEM_QUESTS_CARD), id: 'quiet-faculty', family: 'personal-faculty',
        name: 'Continuing insight', ui: 'quiet', hooks: ['continuation'],
        state: {awakened: false, points: 0, earned: 0, spent: 0, claimed: [],
            wake: {day: 3, victory: true}, firstMessage: 'An insight settles into place. What you learn need not end with this life.'}};
}
export function seedBeginningCheats(state, {choice = 'none', at} = {}) {
    let next = validateCheatState(state);
    if(!next.held['quiet-faculty']) next = grantCheat(next, quietFacultyCard(), {route: 'personal-faculty', at});
    if(['system-quests', 'surprise'].includes(choice) && !next.held['system-quests'])
        next = grantCheat(next, optionalStartCard(), {route: 'optional-start', at});
    // Premise intros call this with their kind; the ring elder is the first voiced non-system start.
    if(choice === 'ring-spirit' && !next.held['ring-spirit'])
        next = grantCheat(next, ringSpiritCard(), {route: 'optional-start', at});
    return next;
}
// A temporal return restores local inputs from its snapshot; enduring faculty
// stages follow the continuing self. An heir has fresh per-life inputs.
// Default dial; a world's inheritance law may change it.
export const HEIR_REACH = Object.freeze({'system-quests': 'line', 'ring-spirit': 'line'});
export function carryCheats(source, target = defaultCheatState(), {heir = false} = {}) {
    const from = validateCheatState(source ?? defaultCheatState()), next = validateCheatState(target);
    // Reach dial per card: the self, or the family line (re-granted dormant, points reset).
    if(heir) for(const [id, entry] of Object.entries(from.held)) {
        if(HEIR_REACH[id] !== 'line' || next.held[id]) continue;
        const card = structuredClone(entry.card);
        const {claimed, earned, ...kept} = card.state;
        card.state = {...kept, awakened: false, points: 0}; card.stages = [];
        next.held[id] = {card, acquired: {route: 'heir-line', at: structuredClone(entry.acquired.at)}, messages: []};
    }
    const entry = from.held['quiet-faculty'];
    if(!entry) return validateCheatState(next);
    const carried = structuredClone(entry);
    if(heir) carried.card.state = {...quietFacultyCard().state, awakened: entry.card.state.awakened};
    next.held['quiet-faculty'] = carried;
    for(const stage of carried.card.stages) {
        if(!CHEAT_MODULES.some(d=>d.id===stage.id))continue;
        const original=from.held[stage.id];
        if(next.held[stage.id]){
            // Designs and journey time belong to the continuing self. Local
            // charges and routine assignment still come from the restored body.
            if(stage.id==='pattern-book'&&original)next.held[stage.id].card.state.patterns=structuredClone(original.card.state.patterns);
            if(stage.id==='patient-furnace'&&original){
                const a=next.held[stage.id].card.state.away,b=original.card.state.away;
                for(const key of ['bank','spent','remainder'])a[key]=b[key];
                if(a.assigned)a.anchor=null; // stamp arrival, never re-credit the snapshot’s wall interval
            }
            continue;
        }
        const card=moduleCard(stage.id);
        // Learned means endure; per-life reserves start empty on a new body.
        if(heir){card.state.used=card.state.charges;card.state.charges=0;
            if(stage.id==='patient-furnace')card.state.away={...structuredClone(from.held[stage.id]?.card.state.away??card.state.away),assigned:false,world:null,anchor:null,stop:'Retained time follows the journey. Assign a supported routine in this life.'};
            if(stage.id==='heirloom-compact')card.state.receipt=structuredClone(from.held[stage.id]?.card.state.receipt??null);
            if(stage.id==='pattern-book')card.state.patterns=structuredClone(from.held[stage.id]?.card.state.patterns??[]);}
        next.held[stage.id]=heir||!original?{card,acquired:structuredClone(carried.acquired),messages:[]}:structuredClone(original);
        if(!heir&&stage.id==='patient-furnace'&&next.held[stage.id].card.state.away.assigned)next.held[stage.id].card.state.away.anchor=null;
    }
    return validateCheatState(next);
}
export function awakenedStatusCard(state) {
    return Object.values(state.held).find(entry => entry.card.ui === 'status-window' &&
        entry.messages.length > 0 && entry.card.state.awakened !== false);
}
export const FIRST_SYSTEM_MESSAGE = 'Your system is awake. You can now read your level and known abilities.';
export function awakenCheats(state, {dayCount, wonFight = false, at}) {
    const next = validateCheatState(state), messages = [];
    for(const [id, entry] of Object.entries(next.held)) {
        if(!['status-window', 'quiet'].includes(entry.card.ui) || entry.card.state.awakened !== false) continue;
        const wake = entry.card.state.wake ?? {day: 3, victory: true};
        if(!(dayCount >= wake.day) && !(wonFight && wake.victory)) continue;
        // Validate only the complete transition, never an awake/message-free intermediate.
        const message = entry.card.state.firstMessage ?? FIRST_SYSTEM_MESSAGE;
        entry.messages.push({text: message, at: structuredClone(at)});
        entry.card.state.awakened = true;
        messages.push(message);
    }
    return {state: validateCheatState(next), messages};
}
