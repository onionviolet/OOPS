// Kernel test adapters for G (resolveGuActivation per beat) and S
// (S's spellDraftCommands per dictionary method, which runs on the kernel since
// S phase 2). The owners'
// files are unchanged; domain chats can copy these when they embed.
import {defineWorkingLaw} from '../src/kernel_working.js';
import {composeWorking, defineComposition} from '../src/kernel_compose.js';
import {resolveGuActivation} from '../src/gu_activation.js';
import {strengthReversingProcedure as reversal} from '../src/gu_procedures.js';
import {spellDictionary} from '../src/spell_dictionary.js';
import {spellDraftCommands} from '../src/spell_working.js';
import {hogwartsSpellRules} from '../src/spell_world_rules.js';

// ---- G: one Gu activation law, beats stay atomic ---------------------------
export const stage = gu => ({gu: {id: gu.id, kind: gu.species, rank: gu.rank, fedThrough: gu.fedThrough}, operator: gu.operator, ability: gu.ability});
export const beat = slots => ({bound, facts, at}) => {
    const result = resolveGuActivation({beats: [{stages: slots.map(slot => stage(bound[slot]))}], reserves: facts.reserves, day: at});
    if (result.outcome !== 'complete') return {ok: false, reason: result.reason};
    return {ok: true, facts: {reserves: result.remaining},
        effects: result.activations.map(row => ({kind: 'essence-spent', operator: row.operator, fuel: row.fuel, amount: row.cost})),
        costs: result.activations.map(row => ({quantity: `essence.${row.fuel}`, amount: row.cost, holder: row.operator}))};
};
export const guLaw = defineWorkingLaw({id: 'kernel.test.gu-activation', revision: 1, operations: {
    'beat-1': {roles: {operator: 'cultivator', core: 'gu'}, minutes: 1, settle: beat(['core'])},
    'beat-2': {roles: {operator: 'cultivator', first: 'gu', second: 'gu'}, minutes: 1, settle: beat(['first', 'second'])},
}});
export const single = {law: guLaw, method: {id: 'activate-one', revision: 1, law: guLaw.ref, roles: {operator: 'cultivator', core: 'gu'},
    steps: [{op: 'beat-1', bindings: {operator: 'operator', core: 'core'}}]}};
export const pair = {law: guLaw, method: {id: 'activate-together', revision: 1, law: guLaw.ref,
    roles: {operator: 'cultivator', first: 'gu', second: 'gu'}, steps: [{op: 'beat-2', bindings: {operator: 'operator', first: 'first', second: 'second'}}]}};
export const threeCore = defineComposition({id: 'killer-move.three-core', revision: 1,
    roles: {operator: 'cultivator', a: 'gu', b: 'gu', c: 'gu'}, slots: [
        {name: 'lead', needs: {operator: 'cultivator', core: 'gu'}, bindings: {operator: 'operator', core: 'a'}, facts: 'shared'},
        {name: 'pair', needs: {operator: 'cultivator', first: 'gu', second: 'gu'}, bindings: {operator: 'operator', first: 'b', second: 'c'}, facts: 'shared'},
    ]});
export const guThings = (rows, fedThrough = 100_000) => Object.fromEntries([['player', {kind: 'cultivator', id: 'player'}],
    ...rows.map(([id, species, cost]) => [id, {kind: 'gu', id, species, rank: 6, fedThrough, operator: 'player', ability: {fuel: 'immortal', cost}}])]);
export const reversalThings = guThings(reversal.roles.map(({id, kind}, index) => [id, kind, index + 1]));
export const guBindings = (a, b, c) => ({operator: {kind: 'cultivator', id: 'player'}, a: {kind: 'gu', id: a}, b: {kind: 'gu', id: b}, c: {kind: 'gu', id: c}});

export function composedGuConsumer() {
    const {law, method} = composeWorking(threeCore, {lead: single, pair});
    return {name: 'Composed killer move (G)', law, method, things: reversalThings, facts: {reserves: {player: {immortal: 6}}}, start: 0,
        bindings: guBindings('eat-strength', 'pulling-mountain', 'pulling-water'), leaving: 'pulling-water', leavesAt: 2,
        finalEffect: {kind: 'essence-spent', operator: 'player', fuel: 'immortal', amount: 3}};
}

// ---- S: one dictionary method is one part --------------------------------
export function spellLaw(rules) {
    const entries = spellDictionary.filter(entry => entry.world === rules.world);
    const op = entry => `${entry.id}.r${entry.revision}`;
    const law = defineWorkingLaw({id: `kernel.test.spell.${rules.world}`, revision: 1, operations: Object.fromEntries(entries.map(entry => [op(entry), {
        roles: Object.fromEntries(entry.roles.map(({name, type}) => [name, type])),
        settle({bound}) {
            const world = {...rules, target: ref => {
                const thing = Object.values(bound).find(row => row.id === ref);
                return thing && {id: thing.id, type: thing.kind};
            }};
            const draft = [{method: entry.id, revision: entry.revision, bindings: Object.fromEntries(entry.roles.map(({name}) => [name, bound[name].id]))}];
            let native;
            try { native = spellDraftCommands(draft, spellDictionary, world); }
            catch { return {ok: false, reason: 'cannot-reach'}; }
            return {ok: true, effects: native.map(({command}) => ({kind: 'command', id: command.id})), observed: {spoke: entry.id}};
        },
    }]))});
    const filler = id => {
        const entry = entries.find(row => row.id === id);
        const roles = Object.fromEntries(entry.roles.map(({name, type}) => [name, type]));
        return {law, method: {id: entry.id, revision: entry.revision, law: law.ref, roles,
            steps: [{op: op(entry), bindings: Object.fromEntries(Object.keys(roles).map(role => [role, role]))}]}};
    };
    return {law, filler};
}
export const draftStep = (method, bindings) => ({method, revision: 1, bindings});
export const castSlot = (name, method, bindings) => {
    const entry = spellDictionary.find(row => row.id === method);
    return {name, needs: Object.fromEntries(entry.roles.map(({name: role, type}) => [role, type])), bindings, facts: 'own', minutes: 1};
};
export const hpDraft = [draftStep('hp.levitation', {target: 'board'}), draftStep('hp.summoning', {target: 'weight', destination: 'rail'}),
    draftStep('hp.release', {target: 'board'})];
export const hpCombined = defineComposition({id: 'spell.combined.hp-bench', revision: 1, roles: {board: 'object', weight: 'object', rail: 'place'}, slots: [
    castSlot('lift', 'hp.levitation', {target: 'board'}),
    castSlot('summon', 'hp.summoning', {target: 'weight', destination: 'rail'}),
    castSlot('release', 'hp.release', {target: 'board'}),
]});
export const hpThings = {board: {kind: 'object', id: 'board'}, weight: {kind: 'object', id: 'weight'}, rail: {kind: 'place', id: 'rail'}};
export const hpBindings = {board: {kind: 'object', id: 'board'}, weight: {kind: 'object', id: 'weight'}, rail: {kind: 'place', id: 'rail'}};
export const hpComposed = () => {
    const {filler} = spellLaw(hogwartsSpellRules);
    return composeWorking(hpCombined, {lift: filler('hp.levitation'), summon: filler('hp.summoning'), release: filler('hp.release')});
};
export const nativeIds = (draft, rules) => spellDraftCommands(draft, spellDictionary, rules).map(({command}) => command.id);

export function composedSpellConsumer() {
    const {law, method} = hpComposed();
    return {name: 'Combined spell (S, Hogwarts bench)', law, method, things: hpThings, bindings: hpBindings, facts: {}, start: 5,
        leaving: 'rail', leavesAt: 7, finalEffect: {kind: 'command', id: nativeIds(hpDraft, hogwartsSpellRules).at(-1)}};
}

