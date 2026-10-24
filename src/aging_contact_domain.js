import {registerDomain} from './domain_registry.js';
import {addPurse} from './economy_domain.js';
import {freshAging, validateAgingContact, migrateAgingContact, syncLife, stepAging, setStance as stanceOf, treat as treatOf, spendCompany, writeLetter, contactChoices,
    ceilings, buckets, agingView, lifeInput, latestMemory, STANCES, CONTACT_NAMES} from './aging_contact.js';
import {createAgingContactPanel} from './aging_contact_ui.js';
// Aging and contact domain. The chronicle owns age and the clock; the hero owns stats. This slice stores wear, choices and letters,
// and publishes three named multiplier buckets (age wear, chronic conditions, contact) that the stat tooltip shows as parts.
let state = freshAging(), ports = null, applied = '', panel = null;
const chronicle = () => ports?.root().chronicle ?? null;
const inputs = () => {
    const life = lifeInput(chronicle());
    return life ? {age: life.age, clock: ports.root().clock, worldId: ports.world?.(), ended: life.ended} : null;
};
function apply() {
    const input = inputs(), actor = ports?.actor?.();
    if(!input || !actor?.getLevelableComponent) return;
    const sets = buckets(ceilings(state, input)), signature = JSON.stringify(sets);
    if(signature === applied) return;
    const stats = actor.getLevelableComponent().stats, full = actor.getFullStats(), vitals = {health: full.health, stamina: full.stamina};
    // Replace only our buckets; current health and stamina keep their value, clamped to the new ceiling without healing.
    for(const [bucket, row] of Object.entries(sets)) stats.multiplier[bucket] = row;
    actor.updateStatsAndDisplay();
    const next = actor.getFullStats();
    next.health = Math.max(0, Math.min(next.max_health, vitals.health));next.stamina = Math.max(0, Math.min(next.max_stamina, vitals.stamina));
    applied = signature;
}
function sync() {
    const life = lifeInput(chronicle());
    if(life) state = syncLife(state, {key: life.key, age: life.age});
}
const view = () => {const input = inputs();return input ? agingView(state, input) : null;};
const contacts = () => contactChoices(chronicle()?.relationships, []);
const here = () => ports?.location?.() === 'Village';
function commit(next, after, undo) {
    const before = state;
    state = next;
    try {after?.();ports.persist(() => {});} catch(error) {undo?.();state = before;applied = '';apply();throw error;}
    apply();panel?.render();
}
const commands = {
    stance(id, stance) {sync();const input = inputs();if(!input)throw Error('Begin a life chronicle first.');commit(stanceOf(state, id, stance, input.clock));},
    treat(id) {
        sync();const input = inputs();if(!input)throw Error('Begin a life chronicle first.');
        const actor = ports.actor(), result = treatOf(state, id, input.clock, actor.money);
        if(!here())throw Error('Treatment is offered in the Village.');
        commit(result.state, () => addPurse(actor, -result.cost, 'aging.treatment'), () => addPurse(actor, result.cost, 'aging.treatment.undo'));
    },
    company(withId) {
        sync();const input = inputs();if(!input)throw Error('Begin a life chronicle first.');
        if(!here())throw Error('Company is found in the Village.');
        if(!contacts().some(c => c.id === withId))throw Error('You have not met them yet.');
        const result = spendCompany(state, input.clock, withId);
        commit(result.state);ports.logMessage(`You sit a while with ${CONTACT_NAMES[withId] ?? withId}. The silence lifts a little.`, 'notification');
    },
    letter(to) {
        sync();const input = inputs();if(!input)throw Error('Begin a life chronicle first.');
        if(!contacts().some(c => c.id === to))throw Error('You have no one to write to yet.');
        const actor = ports.actor(), result = writeLetter(state, input.clock, to, actor.money);
        commit(result.state, () => addPurse(actor, -result.cost, 'aging.letter'), () => addPurse(actor, result.cost, 'aging.letter.undo'));
        ports.logMessage(`You write to ${CONTACT_NAMES[to] ?? to}. A reply should take about three days.`, 'notification');
    },
};
export const agingContactState = () => state;
export function setAgingDial(id, rate, reason) {
    const next = structuredClone(state);next.dial = {id, rate, reason};validateAgingContact(next);state = next;applied = '';apply();panel?.render();
}
export function configureAgingContact(operations) {ports = operations;applied = '';}
registerDomain({id: 'aging_contact', initialState: freshAging,
    save: () => structuredClone(state), validate: validateAgingContact, migrate: migrateAgingContact,
    load: slice => {state = slice ?? freshAging();applied = '';if(ports)try {apply();} catch {/* stats may not be loaded yet; refresh retries */}},
    tick: minutes => {
        if(!ports || !(minutes > 0))return;
        const input = inputs();if(!input)return;
        sync();
        const result = stepAging(state, {...input, minutes, inVillage: here(), latestMemory: latestMemory(chronicle())});
        state = result.state;
        for(const note of result.notes)ports.logMessage(note, 'notification');
        apply();
    },
    refresh: () => {if(!ports)return;try {sync();apply();} catch {/* retried next refresh */}panel?.render();},
    projection: () => ({view: view(), contacts: contacts(), letters: structuredClone(state.contact.letters)}),
    commands,
    panels: [() => {panel = createAgingContactPanel({read: () => ({view: view(), contacts: contacts(), here: here(), money: ports?.actor?.().money ?? 0, enrolled: !!chronicle()}), commands, stances: STANCES});}],
});
