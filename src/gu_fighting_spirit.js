import {runGuProcedure} from './gu_procedures.js';

export const fightKind = 'fight';
export const fightCharge = 3;
export const spiritRecipe = {
    roles: [{id: 'thought', kind: 'thought-support'}, {id: 'will', kind: 'will-support'},
        {id: 'fight', kind: fightKind, minRank: 7}],
    beats: [{roles: ['thought', 'will']}, {roles: ['fight'], backlash: [
        {kind: 'destroy-gu', role: 'thought'}, {kind: 'destroy-gu', role: 'will'},
        {kind: 'injure-operator', role: 'fight', aspect: 'mind', amount: 2},
        {kind: 'injure-operator', role: 'fight', aspect: 'soul', amount: 2},
    ]}],
    completion: () => ({kind: 'raise-fighting-spirit'}),
};

export function tryFightingSpirit({mode, gu, operator, now, primeval, immortal}) {
    const available = gu.filter(specimen => specimen.alive && specimen.holder === operator).map(specimen => ({
        gu: {...specimen, fedThrough: now}, operator, ability: specimen.kind === fightKind ?
            {fuel: 'immortal', cost: fightCharge, effect: {kind: 'send-will', magnitude: 1}} :
            {fuel: 'primeval', cost: 1},
    }));
    const binding = Object.fromEntries(spiritRecipe.roles.map(role => {
        const stage = available.find(row => row.gu.kind === role.kind);
        if (!stage) throw Error('Bring both living supports and Fight Gu.');
        return [role.id, {id: stage.gu.id, operator}];
    }));
    return runGuProcedure({recipe: spiritRecipe, binding, available, day: now,
        reserves: {[operator]: {primeval, immortal}}, ...(mode === 'abort' && {stopBefore: 1}),
        ...(mode === 'rush' && {controlFailedAt: 1})});
}
