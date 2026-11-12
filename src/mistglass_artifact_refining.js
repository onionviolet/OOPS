// Mistglass owns the place, reserve and played clock. The paid work keeps one
// accepted snapshot, which is replayed on save validation and settlement.
import {check} from './basics.js';
import {readItemKey} from './inventory_key.js';
import {address} from './gen_kit.js';
import {enterArtifactRefinement, MISTGLASS_ARTIFACT, quoteArtifactRefinement, settleArtifactRefinement} from './artifact_refining.js';
import {mistglassProfile as P} from './absorb_p23/world_adaptation/profile.js';
import {cultivationView} from './absorb_p23/world_adaptation/techniques.js';

const BLADES = {
    'Cheap iron long blade': {material:'iron', hard:false},
    'Iron long blade': {material:'iron', hard:false},
    'Steel long blade': {material:'steel', hard:true}
};
const HANDLES = new Set(['Simple wooden short handle','Wooden short handle']);

function source(key) {
    const data = readItemKey(key);
    const blade = BLADES[data?.components?.head];
    if (!blade || !Number.isSafeInteger(data.quality) || !HANDLES.has(data.components.handle)) return null;
    return {key, kind:'mundane-workpiece', rank:2, quality:data.quality, element:'metal',
        inheritedEnergy:0, sharp:true, ...blade};
}

function supported(state, context) {
    const method = state.worldAdaptation;
    return method && context.alive && context.worldId === P.worldId
        && context.bodyId === method.bodyId && context.instanceId === method.instanceId
        && context.bodyForm === P.bodyForm && context.ownerId === 'player' && context.controllerId === 'player'
        && context.conditionIds.includes(P.exposureConditionId) && !context.conditionIds.includes(P.blockedConditionId);
}

function request(state, context, piece, reserve) {
    const practice = cultivationView(state.worldAdaptation?.techniques);
    return {piece,reserve,clock:state.clock,materialClock:context.materialClock,workspaceReady:!!supported(state,context),
        manual:practice.stage==='Integrated'?90:practice.stage==='Practiced'?70:50,
        composure:60};
}

export function mistglassArtifactView(state, context, reserve) {
    const work = state.mistglassRealm?.refinement;
    const options = work?.pending || !supported(state,context) ? [] : Object.entries(context.inventory || {}).flatMap(([key,count]) => {
        const piece=source(key);
        if (!piece || !count) return [];
        try {
            const quote=quoteArtifactRefinement(request(state,context,piece,reserve));
            return [{key,label:readItemKey(key).components.head,quality:piece.quality,...quote}];
        } catch { return []; }
    });
    return {options, pending:work?.pending ? {minutesLeft:work.pending.due-state.clock,material:work.pending.request.piece.material} : null,
        last:work?.last ?? null};
}

function replay(row, instanceId) {
    const {request:accepted, root, id} = row;
    const original=source(accepted?.piece?.key);
    check(original && address(accepted.piece)===address(original),
        'The refining job needs the exact source sword and its traits.');
    return enterArtifactRefinement(accepted,{
        stock:{[accepted.piece.key]:1}, root, worldId:P.worldId, lifeId:instanceId, jobId:id, outputId:MISTGLASS_ARTIFACT
    });
}

export function validateMistglassArtifactWork(work, state, realm) {
    if (work === undefined) return;
    check(work && Number.isSafeInteger(work.count) && work.count > 0
        && Object.keys(work).sort().join(',')==='count,last,pending', 'Invalid conservatory refining work.');
    if (work.pending) {
        const row=work.pending;
        check(state.worldAdaptation && realm.activeVisitId && Object.keys(row).sort().join(',')==='due,id,request,root'
            && row.id===`mistglass.refine.${work.count}`
            && row.request?.clock<=state.clock && row.due>state.clock
            && replay(row,realm.instance.id).pending.due===row.due, 'Invalid pending conservatory refining work.');
    }
    check(work.pending || work.last, 'Missing conservatory refining result.');
    if (work.last) {
        const {at,status}=work.last;
        check(Number.isSafeInteger(at)&&at<=state.clock&&at>=0
            && source(work.last.source) && work.last.energy===source(work.last.source).rank**2*500
            && ['success','failure','interrupted'].includes(status), 'Invalid conservatory refining result.');
    }
}

export function startMistglassArtifact(plan, context, reserve, key, {debit, spend}) {
    const {state}=plan, realm=state.mistglassRealm, family=state.worldAdaptation;
    const work=realm?.refinement ?? {count:0,last:null,pending:null};
    check(supported(state,context) && !family.pending && !family.pathWork?.prepared && !work.pending
        && !context.choiceWaiting, 'Finish current work before refining in the conservatory.');
    const accepted=request(state,context,source(key),reserve);
    check(plan.gameplay.player.inventory[key]>0, 'Carry the exact sword to refine.');
    const row={request:accepted,root:state.rng,id:`mistglass.refine.${work.count+1}`};
    const proposal=replay(row,realm.instance.id);
    spend(proposal.inputs[0].item_key);
    debit(proposal.energyCost);
    realm.refinement={...work,count:work.count+1,pending:{...row,due:proposal.pending.due}};
    return plan;
}

export function advanceMistglassArtifact(plan, context, grant) {
    const {state}=plan,realm=state.mistglassRealm,work=realm?.refinement,row=work?.pending;
    if (!row) return;
    const interrupted=!supported(state,context);
    if (!interrupted && state.clock<row.due) return;
    const result=settleArtifactRefinement(replay(row,realm.instance.id).pending,state.clock,{interrupted});
    for (const {item_key,count} of result.outputs) grant(item_key,count);
    work.pending=null;
    work.last={at:state.clock,status:result.outputs.length?'success':interrupted&&state.clock<row.due?'interrupted':'failure',
        source:row.request.piece.key, energy:row.request.piece.rank**2*500};
}
