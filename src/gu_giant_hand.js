import {runGuProcedure, runGuProcedureFollowup, searchGuProcedures} from './gu_procedures.js';

export const giantHandPractice = Object.freeze({preparation: 10, phantomLife: 30, oldBeads: 2, newBeads: 1,
    oldSupportEssence: 1, groupEssence: 2, supportCount: 2});
const actor = 'player';
const stage = (id, kind, rank, ability, day, supply) =>
    ({gu: {id, kind, rank, fedThrough: day}, operator: actor, ability, ...(supply && {supply})});
const bind = ({gu, operator}) => ({id: gu.id, operator});
const redDate = {pool: 'red-date', family: 'immortal', source: 'stored', rank: 7};
const effect = (kind, magnitude) => ({kind, magnitude});
const phantomAbility = (cost, count) => ({fuel: 'immortal', cost, effect: effect('strength-phantoms', count)});
const groupRoleIds = ['group-one', 'group-two'];
const groupRoles = groupRoleIds.map(id => ({id, kind: 'group-strength'}));
const groupBeat = {roles: groupRoleIds, requires: {specimens: giantHandPractice.supportCount}};
export const giantHandForceSupportCost = 1;
export const giantHandWardForce = 6;

export function handFrom(effects) {
    const phantoms = effects.find(row => row.kind === 'strength-phantoms')?.magnitude ?? 0;
    const coordinated = effects.filter(row => row.kind === 'gather-strength').reduce((sum, row) => sum + row.magnitude, 0);
    const formed = Math.min(phantoms, coordinated);
    const reinforcement = effects.find(row => row.kind === 'reinforce-hand')?.magnitude ?? 0;
    return {kind: 'giant-hand', magnitude: formed > 0 ? formed + reinforcement : 0};
}

export const revisedPhantomAbility = Object.freeze(phantomAbility(giantHandPractice.newBeads, 5));
export const preparedPhantomAbility = Object.freeze(phantomAbility(giantHandPractice.oldBeads, 6));
export const steadyPhantomAbility = Object.freeze({fuel: 'primeval', cost: giantHandPractice.oldSupportEssence,
    effect: effect('steady-phantoms', 1)});
export const gatherStrengthAbility = (cost = 1, gather = 2) => ({fuel: 'primeval', cost, effect: effect('gather-strength', gather)});

function groupStages(day, groupIds) {
    return groupIds.map(id => stage(id, 'group-strength', 1,
        gatherStrengthAbility(), day));
}

export function prepareGiantHandPhantoms({selfId, supportId, day, essence}) {
    const core = stage(selfId, 'self-strength', 7, preparedPhantomAbility, day, redDate);
    const support = stage(supportId, 'older-strength-supports', 1, steadyPhantomAbility, day);
    const result = runGuProcedure({recipe: {roles: [{id: 'core', kind: core.gu.kind}, {id: 'supports', kind: support.gu.kind}],
        beats: [{roles: ['supports']}, {roles: ['core']}]},
        binding: {core: bind(core), supports: bind(support)}, available: [core, support], day,
        reserves: {[actor]: {'red-date': giantHandPractice.oldBeads, primeval: essence}}});
    return {...result, held: result.outcome === 'complete' ? {at: day, expiresAt: day + giantHandPractice.phantomLife,
        effect: result.effects.find(row => row.kind === 'strength-phantoms')} : null};
}

export function releasePreparedGiantHand({held, boundIds, groupIds, day, essence}) {
    const available = groupStages(day, groupIds);
    const binding = Object.fromEntries(groupRoleIds.map((role, index) => [role, {id: boundIds[index], operator: actor}]));
    return runGuProcedureFollowup({held, recipe: {roles: groupRoles, beats: [groupBeat], completion: handFrom},
        available, binding, day, reserves: {[actor]: {primeval: essence}}});
}

export function castRevisedGiantHand({myriadId, groupIds, day, essence}) {
    const core = stage(myriadId, 'myriad-self', 7, revisedPhantomAbility, day, redDate);
    const groups = groupStages(day, groupIds);
    const binding = {core: bind(core), ...Object.fromEntries(groups.map((row, index) => [groupRoleIds[index], bind(row)]))};
    return runGuProcedure({recipe: {roles: [{id: 'core', kind: 'myriad-self'}, ...groupRoles],
        beats: [{roles: ['core']}, groupBeat], completion: handFrom}, binding, available: [core, ...groups], day,
        reserves: {[actor]: {'red-date': giantHandPractice.newBeads, primeval: essence}}});
}

const wardRecipe = {
    roles: [{id: 'core', kind: 'myriad-self'}, ...groupRoles, {id: 'force', fn: 'reinforce-hand', optional: true}],
    beats: [{roles: ['core']}, groupBeat, {roles: ['force']}],
    completion: handFrom,
};

function wardRequest({myriadId, groupIds, selfId, day, essence, beads}) {
    const core = stage(myriadId, 'myriad-self', 7, revisedPhantomAbility, day, redDate);
    const force = selfId ? stage(selfId, 'self-strength', 7, {fn: 'reinforce-hand', fuel: 'immortal',
        cost: giantHandForceSupportCost, effect: effect('reinforce-hand', 2)}, day, redDate) : null;
    const available = [core, ...groupStages(day, groupIds), ...(force ? [force] : [])];
    return {recipe: wardRecipe, available, day, reserves: {[actor]: {'red-date': beads, primeval: essence}}};
}

export function searchGiantHandWard(input) {
    const request = wardRequest(input);
    const options = searchGuProcedures(request).options;
    const bySupport = new Map();
    for (const {binding, result} of options) {
        const reinforced = !!binding.force;
        const force = result.effects.at(-1).magnitude;
        if (!bySupport.has(reinforced)) bySupport.set(reinforced, {reinforced, binding, force,
            beads: input.beads - result.remaining.player['red-date'],
            essence: input.essence - result.remaining.player.primeval, breaks: force >= giantHandWardForce});
    }
    return [...bySupport.values()];
}

export function castGiantHandWard(input, binding) {
    return runGuProcedure({...wardRequest(input), binding});
}

const variantRecipe = {
    roles: [{id: 'core', kind: 'myriad-self'}, ...groupRoles],
    beats: [{roles: ['core']}, groupBeat],
    completion: handFrom,
};

function variantRequest({myriadId, groups, day, essence, beads}) {
    const core = stage(myriadId, 'myriad-self', 7, revisedPhantomAbility, day, redDate);
    const supports = groups.map(({id, cost, gather}) => stage(id, 'group-strength', 1,
        gatherStrengthAbility(cost, gather), day));
    return {recipe: variantRecipe, available: [core, ...supports], day, reserves: {[actor]: {'red-date': beads, primeval: essence}}};
}

export function searchGiantHandVariants(input) {
    const options = searchGuProcedures(variantRequest(input)).options;
    const pairs = new Map();
    for (const {binding, result} of options) {
        const supports = groupRoleIds.map(role => binding[role].id).sort();
        const key = supports.join('|');
        if (!pairs.has(key)) pairs.set(key, {supports, binding, force: result.effects.at(-1).magnitude,
            beads: input.beads - result.remaining.player['red-date'], essence: input.essence - result.remaining.player.primeval});
    }
    return [...pairs.values()];
}

export function castGiantHandVariant(input, binding) {
    return runGuProcedure({...variantRequest(input), binding});
}
