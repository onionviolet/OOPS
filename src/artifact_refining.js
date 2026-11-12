// ACS build 17074448, production trace P13–P20/P35. Ordinary refinement
// spends the chosen object and rank-squared energy at entry. These YAIR
// success and combat dials preserve the relationships in that trace.
import {drawU32, address} from './gen_kit.js';
import {planMaterialPartition, readMaterialLineage} from './material_lineage.js';

const FAMILY = 'refined-artifact';
export const MISTGLASS_ARTIFACT = 'Mist-bound sword';
const UINT_RANGE = 0x100000000;
const integer = (value, min, max) => Number.isSafeInteger(value) && value >= min && value <= max;
const assert = (condition, message) => { if (!condition) throw Error(message); };

export function quoteArtifactRefinement({piece, reserve, manual, composure, clock, workspaceReady}) {
    assert(workspaceReady, 'Use an accessible refining workspace.');
    assert(piece?.kind === 'mundane-workpiece' && typeof piece.key === 'string', 'Choose an unrefined object.');
    assert(readMaterialLineage(piece.key)?.family !== FAMILY, 'Choose an unrefined object.');
    assert(integer(piece.rank,1,10) && integer(piece.quality,1,1000)
        && integer(piece.inheritedEnergy,0,30000), 'The workpiece needs measured rank, quality and inherited energy.');
    assert(typeof piece.material === 'string' && piece.material.length > 0
        && typeof piece.element === 'string' && piece.element.length > 0
        && typeof piece.sharp === 'boolean' && typeof piece.hard === 'boolean', 'The workpiece needs actual material and shape traits.');
    assert(integer(manual,0,100) && integer(composure,0,100)
        && integer(clock,0,Number.MAX_SAFE_INTEGER-300), 'The maker needs supported skill, composure and time.');
    const energyCost = piece.rank ** 2 * 500;
    assert(integer(reserve,energyCost,Number.MAX_SAFE_INTEGER), 'Recover the required refining energy.');
    const minutes = Math.min(300,Math.ceil((80*piece.rank+piece.inheritedEnergy/100)/(1+0.02*manual)));
    const chancePermille = Math.max(50,Math.min(950,500+4*manual+3*composure-60*piece.rank));
    return {energyCost, minutes, chancePermille, due:clock+minutes};
}

// The native host must publish the debit and the pending work together. The
// same accepted address is used after reload. A quote draws and spends nothing.
export function enterArtifactRefinement(request, {stock, root, worldId, lifeId, jobId, outputId}) {
    const quote = quoteArtifactRefinement(request);
    const {piece,clock,materialClock=clock} = request;
    const draw = drawU32(root,address('artifact.refining@1',worldId,lifeId,jobId,clock,piece.key));
    const success = draw < Math.floor(quote.chancePermille*UINT_RANGE/1000);
    const attack = Math.max(1,Math.floor(piece.quality/100)+piece.rank+Math.floor(piece.inheritedEnergy/5000)
        +(piece.sharp?3:0)-(piece.hard?1:0));
    const recovery = piece.hard ? 2 : 4;
    const partition = planMaterialPartition({
        stock, inputs:[{item_key:piece.key,count:1}], unit:'whole workpiece', unitsPerInput:()=>1,
        process:{id:'artifact.refine',revision:1,world_id:worldId,at:materialClock,
            parameters:{material:piece.material,element:piece.element,attack,recovery,sharp:piece.sharp,hard:piece.hard}},
        outputs:success ? [{output:{id:outputId,family:FAMILY,count:1,quality:piece.quality},unitsPerItem:1}] : [],
        losses:success ? [] : [{reason:'failed refinement',amount:1}]
    });
    const {inputs, ...outcome} = partition;
    return {inputs, energyCost:quote.energyCost, pending:{id:jobId, startedAt:clock, due:quote.due, draw, success, outcome}};
}

export function settleArtifactRefinement(pending, clock, {interrupted=false} = {}) {
    if (interrupted && integer(clock,pending.startedAt,pending.due-1)) {
        const {balance,event} = pending.outcome;
        return {event:structuredClone(event), outputs:[], losses:[{reason:'interrupted refinement',amount:balance.input}],
            balance:{...balance,output:0,loss:balance.input}};
    }
    assert(integer(clock,pending.due,Number.MAX_SAFE_INTEGER), 'Refining work is still in progress.');
    return structuredClone(pending.outcome);
}

// Read the converted object's traits at the consumer, from its own ancestry.
export function refinedArtifactStrike(key) {
    const lineage = readMaterialLineage(key);
    const event = lineage?.history.at(-1);
    if (lineage?.family !== FAMILY || event?.process_id !== 'artifact.refine') return null;
    const {attack,recovery,element} = event.parameters;
    assert(integer(attack,1,100) && integer(recovery,1,100) && typeof element === 'string',
        'Invalid refined artifact traits.');
    return {attack,recovery,element};
}
