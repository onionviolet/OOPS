import {bindGuMove} from './gu_move_roles.js';
import {moonglowBlade} from './gu_ability_profiles.js';
import {resolveGuActivation} from './gu_activation.js';

export const moonFusionMaterials = 'furnace-stone';
export const moonFusionKinds = {
    moonlight: {label: 'Moonlight Gu'},
    'little-light': {label: 'Little Light Gu'},
    'stone-scar': {label: 'Stone Scar Gu', channel: 2},
    'groove-stone': {label: 'Groove Stone Gu', channel: 1.5},
    moonglow: {label: 'Moonglow Gu'},
    'moon-scar': {label: 'Moon Scar Gu'},
    'etched-moon': {label: 'Etched Moon Gu'},
};

const core = {id: 'moon', kind: 'moonlight'};
const branches = [
    {id: 'power', roles: [core, {id: 'lightA', kind: 'little-light'}, {id: 'lightB', kind: 'little-light'}],
        product: () => ({kind: 'moonglow', power: 3, reach: 1}), failure: {moon: 'injure', lightA: 'injure', lightB: 'destroy'}},
    {id: 'reach', roles: [core, {id: 'channel', fn: 'channel'}],
        product: ({channel}) => ({kind: channel.gu.kind === 'stone-scar' ? 'moon-scar' : 'etched-moon',
            power: 1, reach: moonFusionKinds[channel.gu.kind].channel}), failure: {moon: 'injure', channel: 'destroy'}},
];

export function discoverMoonFusions(gu, holder, {vitalSuccessor} = {}) {
    const available = gu.filter(row => row.alive && !row.injured && row.rank === 1 && row.holder === holder)
        .map(gu => ({gu, operator: holder, ability: {fn: moonFusionKinds[gu.kind]?.channel ? 'channel' : 'ingredient'}}));
    const seen = new Set();
    return branches.flatMap(branch => bindGuMove(branch, available).flatMap(({roles}) => {
        const product = branch.product(roles);
        const ingredients = Object.fromEntries(Object.entries(roles).map(([role, {gu}]) => [role, gu.id]));
        const vitalSuccessorRole = Object.keys(roles).find(role => roles[role].gu.id === vitalSuccessor);
        const identity = JSON.stringify([product.kind, Object.values(ingredients).sort()]);
        if (seen.has(identity)) return [];
        seen.add(identity);
        return [{ingredients, recipe: {id: product.kind, revision: 1, kind: product.kind, rank: 2, recordLineage: true,
            ...(vitalSuccessorRole && {vitalSuccessorRole}),
            productTraits: {power: product.power, reach: product.reach},
            ingredients: Object.fromEntries(Object.entries(roles).map(([role, {gu}]) => [role, gu.kind])),
            stages: [{id: 'prepare', inputs: [{material: moonFusionMaterials, amount: 1}]},
                {id: 'fuse', inputs: [], onControlFailure: branch.failure}]}}];
    }));
}

export const moonFusionDose = moonglowBlade.cost;
export const moonFusionSupply = Object.freeze({pool: 'red-steel', family: 'primeval', rank: 2, source: 'stored'});

export function moonFusionAbility(gu) {
    return {...moonglowBlade, effect: {...moonglowBlade.effect, magnitude: gu.traits.power, range: gu.traits.reach}};
}

export function testMoonFusion(gu, operator, day, reserve) {
    return resolveGuActivation({stages: [{gu: {...gu, fedThrough: day}, operator, ability: moonFusionAbility(gu),
        supply: moonFusionSupply}],
        reserves: {[operator]: {'red-steel': reserve}}, day});
}
