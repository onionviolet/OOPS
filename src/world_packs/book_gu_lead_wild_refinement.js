// Fang Yuan refines the wild Gu his wolf-tide patrol turns up (foundation run 2026-11-14, OR1 consumer: his ordinary day; proposal under
// AD32, AD56). A command extension on his own life, so no pinned hash moves. Two rows, one per route: pour essence until the wild Gu's
// will gives way, or cow it first with a lightning wolf eye and finish in minutes. Each command reserves its inputs through the ordinary
// costs (refunded if cancelled), and at completion the shared refinement engine settles them through the world-agnostic `guRefine` effect
// (ri_wild_gu.js registers his world), so the kind that comes out is the engine's, drawn per find from the save's seed.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {RI_DAY_ITEMS as IT} from '../ri_lead_day_facts.js';
import {RI_WILD_GU_KINDS, RI_WILD_NOTE, RI_WILD_REFINEMENT, RI_WILD_WORLD, riWildGuInputs, riWildGuItem} from '../ri_wild_gu.js';

export const GU_LEAD_WILD_REFINEMENT = RI_WILD_REFINEMENT;
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const academy = id('academy');
const essence = id('primeval');
const local = name => `${RI_WILD_REFINEMENT}.${name}`;
const all = (...rules) => ({all: rules});
const eq = (fact, value, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
const key = item => JSON.stringify({id: item});
const has = (item, value, reason) => ({fact: `item.${key(item)}`, op: 'gte', value, reason});
const item = (it, amount) => ({type: 'item', actor: 'player', key: key(it), amount});
const ready = all(eq('actor.life', 'alive'), eq('native.ready', true), eq('native.alive', true),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile', true));
const admitted = eq(extensionFact(RI_WILD_REFINEMENT), true);
const at = eq('actor.location', academy, 'Go back to your room at the clan academy; refining needs a quiet place.');
const holdsWild = has(IT.wildGu, 1, 'You have no wild Gu in hand to refine.');
const parts = n => ({fact: `energy.${essence}.reserve`, op: 'gte', value: n, reason: `Your sea is too low. Wearing down its will takes ${n} parts of essence.`});

function route(operation, label, description, {cowed}) {
    const need = riWildGuInputs({cowed}), support = all(ready, admitted, at);
    return {
        id: local(operation), revision: 1, label, description, group: 'structured_local',
        worldId: RI_WILD_WORLD, actorId: 'player', location: academy, audience: ['$actor'], once: false, duration: need.minutes, visibleWhen: admitted,
        requires: all(support, holdsWild, ...(need.eyes ? [has(IT.eye, need.eyes, 'You have no lightning wolf eye to cow it with.')] : []), parts(need.essence)),
        completionRequires: support, completionCoLocated: true, completionFailure: 'refund', cancellation: 'refund', reservationReturns: 1,
        costs: [item(IT.wildGu, -1), ...(need.eyes ? [item(IT.eye, -need.eyes)] : []),
            {type: 'energy', actor: 'player', energyId: essence, operation: 'use', output: need.essence, control: 1}],
        effects: [{type: 'knowledge', actor: 'player', key: RI_WILD_NOTE, stage: 'understood', value: 'You finished refining the wild Gu.'},
            {type: 'guRefine', actor: 'player', world: RI_WILD_WORLD, operation}]
    };
}

export const guLeadWildRefinement = {
    schema: 1, id: RI_WILD_REFINEMENT, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Refine the wild Gu you found',
    description: 'A wild Gu is not yours until your will has worn its own away. Pour your essence into it, or cow it first with a lightning wolf eye.',
    requires: all(ready, holdsWild),
    reason: 'Find a wild Gu first. One turns up now and then under the wall on a wolf-tide patrol.',
    items: RI_WILD_GU_KINDS.filter(row => row.weight > 0).map(row => ({id: riWildGuItem(row.kind), label: `${row.label} · refined from the wild`,
        description: `A ${row.label} you found wild under the wall and refined with your own essence. It answers to you now.`, value: 0})),
    status: [{id: local('status'), label: 'Wild Gu', knowledgeKey: RI_WILD_NOTE}],
    commands: [
        route('refine', 'Refine the wild Gu', 'Hold the wild Gu and pour your essence into it until its will gives way. It resists the whole time.', {cowed: false}),
        route('cow', 'Cow the wild Gu with a wolf eye, then refine it', 'A lightning wolf eye still carries the wolf\'s aura. Held over the wild Gu it cows it, and a cowed Gu stops resisting, so the refining takes minutes and far less essence. The eye is spent.', {cowed: true}),
    ]
};

export async function registerGuLeadWildRefinement(register, base) {
    if(!register.bundledInstantExtension || base.contentHash !== baseHash) return null;
    return register.bundledInstantExtension(guLeadWildRefinement, base);
}
