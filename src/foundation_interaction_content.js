// Optional original development arena. Definitions do not enroll its people,
// grant sources or allocate demonstration budgets during ordinary play.
import {eqNoReason as eq} from './basics.js';
export const FOUNDATION_PROBE_GROUP = 'foundation_interaction';
export const FOUNDATION_PROBE_SOURCE = 'foundation.probe.control';
export const FOUNDATION_PROBE_ACTORS = ['foundation.probe.a','foundation.probe.b','foundation.probe.c'];
export const foundationInteractionSources = [{id:FOUNDATION_PROBE_SOURCE,revision:1,label:'Experimental arena control',kind:'skill',origin:'trained',grants:[]}];
const body = actor => `${actor}.body`;
const command=d=>({revision:1,worldId:'base.frontier',group:FOUNDATION_PROBE_GROUP,costs:[],effects:[],requires:eq('foundation.probe.host'),...d});
const cost=(actor,n=1)=>({type:'resource',actor,key:'demonstrationFuel',amount:-n});
const source=(actor,operation='grant')=>({type:'source',actor,sourceId:FOUNDATION_PROBE_SOURCE,operation,...(operation==='grant'?{origin:'trained',awakened:true,active:true}:{})});
const instance=(actor,target,id,kind,extra={})=>({type:'foundationInteraction',operation:'create',id,kind,policy:'P-A',actor,target,bodyId:body(actor),targetBodyId:body(target),sourceId:FOUNDATION_PROBE_SOURCE,duration:10,support:'admission',fuel:{key:'demonstrationFuel',amount:1},...extra});
const vital=(actor,target,id,intent='injury',extra={})=>({type:'vital',actor:target,key:'health',amount:intent==='aid'?5:-5,delivery:{id,actorId:actor,targetId:target,bodyId:body(actor),targetBodyId:body(target),sourceId:FOUNDATION_PROBE_SOURCE,channel:'magic',intent,support:'admission',fuel:{key:'demonstrationFuel',amount:1},...extra}});
const arenaCommands=[];
const encounters=[];
for(const actor of FOUNDATION_PROBE_ACTORS.slice(0,2)) {
    const target=FOUNDATION_PROBE_ACTORS.find(a=>a!==actor), stem=actor;
    for(const policy of ['P-A','P-B']) arenaCommands.push(command({id:`${stem}.barrier.${policy.toLowerCase()}`,label:`${policy} barrier · 1 demonstration fuel · 10 min`,actorId:actor,targetId:actor,costs:[cost(actor)],
        effects:[instance(actor,actor,`${stem}.barrier.${policy.toLowerCase()}`,'barrier',{policy,support:policy==='P-B'?'sustained':'admission',...(policy==='P-B'?{aidActors:[target,FOUNDATION_PROBE_ACTORS[2]]}:{})})]}));
    arenaCommands.push(command({id:`${stem}.attack`,label:'Deliver magical injury · 1 demonstration fuel',actorId:actor,targetId:target,coLocated:true,costs:[cost(actor)],effects:[vital(actor,target,`${stem}.hit`)]}),
        command({id:`${stem}.aid`,label:'Offer magical aid · 1 demonstration fuel',actorId:actor,targetId:target,coLocated:true,costs:[cost(actor)],effects:[vital(actor,target,`${stem}.aid`,'aid')]}),
        command({id:`${stem}.self_aid`,label:'Self treatment · 1 demonstration fuel',actorId:actor,targetId:actor,costs:[cost(actor)],effects:[vital(actor,actor,`${stem}.self_aid`,'aid')]}),
        command({id:`${stem}.construct`,label:'Sustain magical delivery · 1 fuel · 2 min',actorId:actor,targetId:target,coLocated:true,duration:2,cancellation:'forfeit',costs:[cost(actor)],effects:[vital(actor,target,`${stem}.construct`,'injury',{support:'sustained'})]}),
        command({id:`${stem}.launch`,label:'Release physical projectile · 1 demonstration fuel',actorId:actor,targetId:target,coLocated:true,costs:[cost(actor)],effects:[instance(actor,target,`${stem}.projectile`,'projectile',{support:'released'})]}),
        command({id:`${stem}.flight`,label:'Commit released projectile flight · 1 fuel · 2 min',actorId:actor,targetId:target,coLocated:true,duration:2,cancellation:'forfeit',costs:[cost(actor)],effects:[vital(actor,target,`${stem}.impact`,'injury',{channel:'physical',support:'released',projectileId:`${stem}.projectile`})]}));
    for(const [key,stage] of [['s1','sustained'],['s2','sustained'],['activation','activation'],['delivery','delivery']]) {
        const id=`${stem}.${key}`;
        arenaCommands.push(command({id,label:`Apply ${key} ${stage} counter · 1 fuel · 5 min`,actorId:actor,targetId:target,coLocated:true,costs:[cost(actor)],effects:[instance(actor,target,id,'suppressor',{channel:'magic',stage,duration:5})]}),
            command({id:`${id}.remove`,label:`Remove owned ${key} counter`,actorId:actor,targetId:target,effects:[{type:'foundationInteraction',operation:'remove',id,actor}]}));
    }
    for(const policy of ['p-a','p-b']) arenaCommands.push(command({id:`${stem}.remove.${policy}`,label:`Remove owned ${policy.toUpperCase()} barrier`,actorId:actor,targetId:actor,effects:[{type:'foundationInteraction',operation:'remove',id:`${stem}.barrier.${policy}`,actor}]}));
    const encounterId=`${stem}.encounter`;
    encounters.push({id:encounterId,revision:1,label:'Experimental delivery exchange',lethal:false,turns:[{cue:'An actual arena actor attempts delivery through the current policy.',responses:[{id:'attempt',label:'Attempt magic · 1 fuel',requires:eq('foundation.probe.host'),costs:[cost(actor)],effects:[vital(actor,target,`${stem}.encounter.hit`)]}]}],settlement:[]});
    arenaCommands.push(command({id:encounterId,label:'Open delivery encounter',actorId:actor,targetId:target,coLocated:true,encounterId}));
}
for(const target of FOUNDATION_PROBE_ACTORS.slice(0,2)) arenaCommands.push(command({id:`foundation.probe.c.strip.${target.at(-1)}`,label:`C removes ${target.at(-1).toUpperCase()}'s acquired source`,actorId:FOUNDATION_PROBE_ACTORS[2],targetId:target,coLocated:true,costs:[cost(FOUNDATION_PROBE_ACTORS[2])],effects:[source(target,'remove')]}));
export const foundationInteractionDefinitions = {
    people:FOUNDATION_PROBE_ACTORS.map((actor,i)=>({id:actor,revision:1,label:`Arena ${'ABC'[i]}`,worldId:'base.frontier',location:'Foundation test room',inventory:'simulation',provision:false,
        body:{id:body(actor),ownerId:actor,controllerId:actor,mobile:true,form:'humanoid',hands:2,handsUsable:true},vitals:{health:40,max_health:40,stamina:20,max_stamina:20},resources:{demonstrationFuel:30}})),
    commands:[command({id:'foundation.probe.enroll',label:'Complete experimental admission drill · demonstration actors and budgets only',actorId:'player',effects:[
        {type:'foundationInteraction',operation:'enroll'},
        ...FOUNDATION_PROBE_ACTORS.flatMap(actor=>[{type:'spawn',actor:'player',personId:actor,definitionId:actor},source(actor),{type:'knowledge',actor:'player',key:`${actor}.drill`,stage:'seen',value:'The experimental admission drill created an identified arena body with its own acquired active control and 30 demonstration fuel. This budget has no native money value.'}])]}),...arenaCommands],encounters
};
export function foundationInteractionProbeFacts(state, context={}) {
    return {'foundation.probe.host':context.foundationProbeHost===true,
        'foundation.probe.enrolled':!!state.simulation?.foundationInteraction};
}
export function foundationInteractionProbeContext(state, actorId='player', extra={}) {
    if(actorId!=='player'&&!FOUNDATION_PROBE_ACTORS.includes(actorId))throw Error('Unknown experimental actor.');
    return {...extra,actorId,foundationProbeHost:true,facts:{...extra.facts,...foundationInteractionProbeFacts(state,{foundationProbeHost:true}),...(actorId==='player'?{}:{location:state.simulation?.people[actorId]?.location})}};
}
export function foundationInteractionProbeGuard(state, definition, context={}) {
    if(definition?.group!==FOUNDATION_PROBE_GROUP)return;
    if(context.foundationProbeHost!==true)throw Error('Use the opt-in experimental arena controls.');
    if(definition.id!=='foundation.probe.enroll'&&!state.simulation?.foundationInteraction)throw Error('Complete the experimental admission drill first.');
    if(definition.id!=='foundation.probe.enroll') {
        const actorId=context.actorId,p=state.simulation?.people[actorId],b=p?.body;
        if(!FOUNDATION_PROBE_ACTORS.includes(actorId)||p?.life!=='alive'||b?.id!==body(actorId)||b.ownerId!==actorId||b.controllerId!==actorId||b.mobile!==true||b.form!=='humanoid'||b.hands<2||b.handsUsable!==true||b.handsTender===true)throw Error('The experimental actor needs its actual mobile controlled body and usable hands.');
    }
}
