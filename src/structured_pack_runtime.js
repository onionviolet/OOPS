import {previewStructuredExpeditions} from './structured_expedition_runtime.js';
import {createSimulationState,validateSimulationState,validateSimulationEffect,jsonData,stableId} from './simulation_contracts.js';
import {applySimulationEffects} from './simulation_effects.js';
import {previewSimulationCommand} from './simulation.js';
import {requireStructuredContent,validateStructuredRecord,requireStructuredSelection,validateStructuredSelection} from './structured_pack_state.js';

export function validateStructuredBootstrap(d, startId) {
    const starts=d.starts || [d.bootstrap];
    if(!Array.isArray(starts)||!starts.length||new Set(starts.map(b=>b?.id)).size!==starts.length)throw Error('Unsupported structured beginnings.');
    for(const b of starts) {
        jsonData(b);
        if(!b||!stableId(b.id)||!b.id.startsWith(d.id+'.')||!d.locations.some(l=>l.id===b.locationId)||typeof b.description!=='string'||!Array.isArray(b.effects))throw Error('Unsupported structured beginning.');
        b.effects.forEach(validateSimulationEffect);
        if(d.starts) {
            if(Object.keys(b).some(key=>!['id','locationId','description','body','effects','snapshotHash'].includes(key)))throw Error('Unsupported structured beginning field.');
            if(b.effects.some(e=>e.type==='relocate'&&(e.actor==null||['player','$actor'].includes(e.actor))&&e.location!==b.locationId))throw Error('Beginning relocation must match its selected location.');
            if(b.snapshotHash!=null&&(typeof b.snapshotHash!=='string'||!/^sha256:[a-f0-9]{64}$/.test(b.snapshotHash)))throw Error('Invalid beginning snapshot hash.');
            const body=b.body;
            if(!body||Array.isArray(body)||!stableId(body.id)||body.ownerId!=='player'||body.controllerId!=='player'||typeof body.form!=='string'||Object.entries(body).some(([k,v])=>!stableId(k)||!['string','number','boolean'].includes(typeof v)||typeof v==='number'&&!Number.isFinite(v)))throw Error('Unsupported structured native body.');
            if(b.effects.some(e=>e.type==='body'&&['id','ownerId','controllerId'].includes(e.key)))throw Error('Beginning effects cannot replace native body identity.');
        }
    }
    if((d.simulation.people||[]).some(p=>p.provision!==false||p.inventory!=='simulation'))throw Error('Structured initialization requires explicitly provisioned simulation people.');
    const selected=startId==null?starts[0]:starts.find(b=>b.id===startId);
    if(!selected)throw Error('Unsupported structured beginning.');
    return selected;
}

function requireUnpublishedTypedOrigin(state,d,context) {
    if(context.nativeReady===false||context.nativeAlive!==true||(context.vitals?.player&&!(context.vitals.player.health>0)))throw Error('Begin with a living native body.');
    if(!context.nativeBody||d.starts.some(b=>b.body.form!==context.nativeBody.form)||context.nativeBody.ownerId!=='player'||context.nativeBody.controllerId!=='player'||d.admission&&(!d.admission.forms.includes(context.nativeBody.form)||!d.admission.lifeStages.includes(context.nativeBody.lifeStage)))throw Error('This beginning requires a compatible native body and life stage. Your saved character has been preserved.');
    const owned=id=>id.startsWith(d.id+'.');
    if(Object.keys(state.actors).some(owned)||Object.keys(state.simulation?.claims||{}).some(owned)||Object.keys(state.actors.player.sources||{}).some(owned)||state.worlds[d.world.id]?.facts?.[`${d.id}.instance`]!=null)throw Error('This beginning has already been initialized.');
}

// Commit this receipt durably before publishing any selected origin content.
export function planStructuredSelection(state,d,context) {
    if(!d.starts)throw Error('Typed starts required for selection.');
    validateStructuredBootstrap(d);
    requireUnpublishedTypedOrigin(state,d,context);
    if(state.pending.length||state.simulation?.jobs.length||context.busy||state.actors.player.worldId!=='base.frontier'||state.worlds[d.world.id]?.facts?.[`${d.id}.instance`])throw Error('Begin from an unoccupied native opening.');
    const next=structuredClone(state),choice=Math.floor(state.rng/0x100000000*d.starts.length),b=d.starts[choice];
    const sequence=++next.sequence;
    const selection={schema:2,packId:d.id,revision:d.revision,contentHash:d.contentHash,startId:b.id,snapshotHash:b.snapshotHash,seed:state.rng,choice,startCount:d.starts.length,originSequence:sequence,instanceId:`${d.id}.run.${state.rng}.${sequence}`,worldId:d.world.id,locationId:b.locationId,bodyId:b.body.id,controllerId:'player',playerActorId:'player',life:'alive'};
    selection.lifeId=selection.instanceId+'.life';selection.bodyInstanceId=selection.instanceId+'.body';
    validateStructuredSelection(selection);requireStructuredSelection(selection,new Map([[d.id,d]]));
    const plan={state:next,external:structuredClone(context.external),gameplay:structuredClone(context.gameplay),vitals:structuredClone(context.vitals||{}),acquisitions:[],unlocks:[]};
    return {plan,selection};
}

// Initialize only this revision's declared ordinary snapshot. Existing scalar
// visits are not converted into invented unit objects or past deeds.
export function beginStructuredCampaign(state,d,context,receipt,selection=null) {
    if(d.starts) {
        if(!selection)throw Error('A durable beginning selection is required.');
        requireUnpublishedTypedOrigin(state,d,context);
        requireStructuredSelection(selection,new Map([[d.id,d]]));
        if(selection.seed!==state.rng||selection.originSequence>state.sequence)throw Error('Beginning selection and durable state disagree.');
    } else if(selection)throw Error('Typed selection cannot initialize a legacy beginning.');
    const b=validateStructuredBootstrap(d,selection?.startId);
    if(receipt||state.pending.length||state.simulation?.jobs.length||context.busy||state.actors.player.worldId!=='base.frontier')throw Error('Begin from an unoccupied native opening.');
    const out={state:structuredClone(state),external:structuredClone(context.external),gameplay:structuredClone(context.gameplay),vitals:structuredClone(context.vitals||{}),acquisitions:[],unlocks:[]};
    const next=out.state,s=next.simulation??=createSimulationState(next.rng||1);s.enrolledAt??=next.clock;
    next.worlds[d.world.id]??={facts:{},resources:{},completed:{}};
    next.actors.player.worldId=d.world.id;
    s.people.player??={life:'alive',inventory:'native',location:b.locationId,bornAt:next.clock};
    s.people.player.location=b.locationId;s.people.player.body=structuredClone(d.starts?b.body:context.nativeBody);
    if(d.starts){s.people.player.life='alive';if(selection.lifeId)s.people.player.lifeId=selection.lifeId;if(selection.bodyInstanceId)s.people.player.body.instanceId=selection.bodyInstanceId;}
    for(const p of d.simulation.people||[]) {
        if(s.people[p.id]||next.actors[p.id])throw Error('This beginning has already been initialized.');
        next.actors[p.id]={worldId:d.world.id,facts:{},resources:structuredClone(p.resources||{}),completed:{},sources:{},techniques:{}};
        s.people[p.id]={life:'alive',inventory:'simulation',location:p.location,bornAt:next.clock,definitionId:p.id,definitionRevision:p.revision,body:structuredClone(p.body||{}),vitals:structuredClone(p.vitals||{})};
        s.owners[p.id]={};
    }
    const cause=`structured:${d.starts?selection.originSequence:++next.sequence}`;
    applySimulationEffects(out,b.effects,{...context,...(d.starts?{nativeBody:s.people.player.body}:{}),worldId:d.world.id,facts:{...context.facts,location:b.locationId}},context.registry,cause);
    if(d.starts&&(s.people.player.life!=='alive'||s.people.player.body.id!==selection.bodyId||s.people.player.body.ownerId!=='player'||s.people.player.body.controllerId!=='player'||out.vitals?.player&&!(out.vitals.player.health>0)))throw Error('Beginning effects violate the selected living body.');
    const record={schema:1,packId:d.id,revision:d.revision,contentHash:d.contentHash,startId:b.id,seed:state.rng,originSequence:next.sequence,instanceId:`${d.id}.run.${state.rng}.${next.sequence}`,worldId:d.world.id,locationId:b.locationId,locationIds:d.locations.map(l=>l.id),containerBindings:(d.simulation.containers||[]).map(c=>({id:c.id,category:c.category,holder:c.holder,revision:c.revision})),peopleIds:(d.simulation.people||[]).map(p=>p.id),units:structuredClone(d.units||[]),initializedAt:next.clock};
    if(d.starts)Object.assign(record,selection,{initializedAt:next.clock});
    s.claims[`${d.id}.origin`]={owner:'player',status:'settled',cause:record.instanceId};
    next.worlds[d.world.id].facts[`${d.id}.instance`]=record.instanceId;
    validateStructuredRecord(record);validateSimulationState(s,next,context.registry.simulation);
    out.nativeLocation=b.locationId;out.nativePatch={'current location':b.locationId};
    return {plan:out,record};
}

export function structuredCampaignView(state,d,record,context) {
    if(!record)return {available:!!d,active:false,title:d?.title||'A new beginning',description:d?.description||'Begin an independent local life. Your existing progress stays in this save.',people:[],status:[],actions:[],jobs:[]};
    requireStructuredContent(record,new Map([[d.id,d]]));
    const known=state.simulation.knowledge.player||{},people=[];
    for(const p of d.simulation.people||[]) {
        const key=d.presentation.people[p.id].introductionKnowledgeKey;
        if(known[key])people.push({name:p.label,details:[known[key].value]});
    }
    const status=d.presentation.status.filter(row=>known[row.knowledgeKey]).map(row=>({label:row.label,value:known[row.knowledgeKey].value}));
    const actions=[];
    for(const a of d.simulation.commands||[]) {
        if(a.actorId && a.actorId!=='player' || a.actorDefinitionId && a.actorDefinitionId!==state.simulation.people.player?.definitionId)continue;
        if(a.location!=null&&a.location!==(context.facts?.location||state.simulation.people.player.location))continue;
        const quote=previewSimulationCommand(state,context.registry,a.id,{...context,targetId:a.targetId});
        if(quote.visible)actions.push({id:a.id,label:a.label,description:a.description||'',eligible:quote.eligible,reasons:quote.reasons,duration:quote.duration,completed:state.actors.player.completed[a.id]||0,repeatable:!a.once&&quote.duration>0,costs:structuredActionCosts(quote,d)});
    }
    const jobs=state.simulation.jobs.filter(j=>j.actorId==='player'&&j.commandId.startsWith(d.id+'.')).map(j=>({id:j.id,commandId:j.commandId,label:j.label,remaining:Math.max(0,j.due-state.clock),duration:context.registry.simulation.commands.get(j.commandId)?.duration||0,cancellable:j.cancellation!=='none'}));
    return {available:true,active:true,expeditions:previewStructuredExpeditions(state,d,context),title:d.title||'Local life',place:d.locations.find(l=>l.id===state.simulation.people.player.location)?.label,description:validateStructuredBootstrap(d,record.startId).description,people,status,actions,jobs};
}

// Show only the acting character's executable input quote. NPC reserves and
// counterfactual outcomes never become part of the observer projection.
export function structuredActionCosts(quote, definition) {
    if(!quote.eligible)return [];
    const rows=[];
    for(const e of quote.costs||[]) {
        if(e.actor!=null&&!['player','$actor'].includes(e.actor))continue;
        if(e.type==='vital'&&e.amount<0)rows.push(`${-e.amount} ${e.key}`);
        else if(e.type==='resource'&&e.amount<0)rows.push(e.native&&e.key==='money'?`${-e.amount} coins`:`${-e.amount} local resource units`);
        else if(e.type==='transfer'&&['player','$actor'].includes(e.from)) {
            const item=definition.items?.find(i=>i.id===JSON.parse(e.key).id);
            if(item)rows.push(`${e.count} × ${item.label} to recipient`);
        }
        else if(e.type==='item'&&e.amount<0) {
            const item=definition.items?.find(i=>i.id===JSON.parse(e.key).id);
            if(item)rows.push(`${-e.amount} × ${item.label}`);
        }
    }
    return rows;
}
