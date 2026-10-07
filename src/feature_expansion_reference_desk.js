// A finite original registry discussion. No book world, power or carrier is granted.
import {BOOK_RECOGNITION_SCENE,getBookRecognitionProfile,recognizeBookWorld} from './feature_expansion_book_recognition.js';
import {qualifiedOfficeBody} from './feature_expansion_book_host.js';
import {commitSimulationCommand,previewSimulationCommand,simulationOccupiesActor} from './simulation.js';
import {projectFeatureCommands,featureRecordedKnowledge} from './feature_expansion_host.js';
import {assert} from './simulation_contracts.js';

export const REFERENCE_DESK_IDS=Object.freeze({scene:'subtlety.reference_desk',group:'subtlety_reference',world:'base.frontier',
    keeper:'backlog.registry.eda',clerk:'backlog.registry.orrin',witness:'backlog.registry.bera',
    office:'backlog.registry.seal_steward',begin:'subtlety.reference_begin'});
const I=REFERENCE_DESK_IDS,P='subtlety.reference.';
const eq=(fact,value=true,reason)=>({fact,op:'eq',value,...(reason?{reason}:{})});
const all=(...rules)=>({all:rules}),any=(...rules)=>({any:rules}),not=rule=>({not:rule});
const introduced=eq(`actor.${P}introduced`),open=all(introduced,not(eq(`actor.${P}declined`)));
const fact=(key,value=true)=>({type:'fact',scope:'actor',actor:'player',key:P+key,value});
const know=(key,value,attributedTo,actor='player')=>({type:'knowledge',actor,key:P+key,stage:'understood',value,
    basis:{kind:'instruction',attributedTo,situationId:I.scene}});
const command=d=>({revision:1,group:I.group,worldId:I.world,actorId:'player',location:'Village',
    targetId:I.clerk,coLocated:true,participants:[I.keeper,I.clerk,I.witness],duration:0,costs:[],effects:[],once:true,
    requires:eq('reference.actualContact',true,'Meet the same office staff in your actual native body, with no current work.'),...d});
const heard=key=>eq(`reference.${key}`);
export const referenceDeskDefinitions={situations:[{id:I.scene,revision:1,label:'Original office discussion',
    context:{worldId:I.world,instanceId:I.world,continuityId:'original.frontier',eraId:'current_adventure',regionId:'Village'},
    participants:['player',I.keeper,I.clerk,I.witness],initialPhase:'discussion',phases:['discussion'],
    privateTruth:{originalDiscussion:true}}],commands:[
    command({id:I.begin,label:'Ask Orrin about the office entry',visibleWhen:not(introduced),
        requires:all(heard('actualContact'),heard('termsKnown')),
        description:'An ordinary conversation with the same office staff. It appoints no one and accepts no work.',
        effects:[{type:'situation',operation:'begin',situationId:I.scene},fact('introduced'),fact('version',1),know('opening','Orrin sets the ledger beside the counter. A name, an appointment and Bera’s personal account answer different questions. No office, method or goods changed.',I.clerk),
            ...[I.keeper,I.clerk,I.witness].map(actor=>know('heard_opening','I was present for the visitor’s ordinary discussion at Orrin’s counter. It moved no personal source, means or institutional right.',actor,actor))]}),
    command({id:'subtlety.reference_registry',label:'Compare the actual appointment with the name claim',visibleWhen:open,
        requires:all(heard('actualContact'),heard('registryCurrent')),
        effects:[fact('registryCompared'),know('registry','Orrin points to your actual temporary appointment. It identifies the holder of this office right. Eda’s body, personal method, memories and own debt remain hers.',I.clerk)]}),
    command({id:'subtlety.reference_registry_returned',label:'Compare the old report with the returned office',visibleWhen:open,
        requires:all(heard('actualContact'),heard('registryReturned')),
        effects:[fact('registryCompared'),know('registry_returned','Orrin distinguishes the report of your earlier appointment from the current right, which has returned to living Eda. The old meeting still happened; its report does not appoint you again.',I.clerk)]}),
    command({id:'subtlety.reference_personal',label:'Ask what Bera’s own comparison established',targetId:I.witness,visibleWhen:open,
        requires:all(heard('actualContact'),heard('personalReported')),
        effects:[fact('personalCompared'),know('personal','Bera’s personal comparison belongs to her actual remembered signs and reported test. Orrin’s own interpretation remains separate. Hearing either account supplies no body, source or practiced skill.',I.witness)]}),
    command({id:'subtlety.reference_texture',label:'Listen while Orrin straightens the counter',visibleWhen:introduced,
        effects:[fact('ordinaryHeard'),know('ordinary','Orrin puts the bent slip under the short leg of his cup. “There. One ledger improvement I can promise.” Nobody needs to turn it into a job.',I.clerk)]}),
    command({id:'subtlety.reference_refuse',label:'Leave the comparison for another day',visibleWhen:all(introduced,not(eq(`actor.${P}registryCompared`)),not(eq(`actor.${P}personalCompared`))),
        effects:[fact('declined'),know('refusal','You left the comparison before accepting any new work. The current office holder and each person’s own means stayed as they were; Orrin asked for no fee or explanation.',I.clerk)]}),
    command({id:'subtlety.reference_return',label:'Return to the same people and remembered discussion',visibleWhen:introduced,
        requires:all(heard('actualContact'),heard('discussionRemembered'),any(eq(`actor.${P}registryCompared`),eq(`actor.${P}personalCompared`),eq(`actor.${P}declined`),eq(`actor.${P}ordinaryHeard`))),
        effects:[fact('returned'),know('return','The same Eda, Orrin and Bera remember the discussion in their own ways. Your earlier account remains in your notes. This meeting repeats no appointment, payment, material output or practiced method.',I.clerk)]}),
]};

const report=(state,key,commandId)=>{
    const r=state.backlog?.replacement,k=state.simulation?.knowledge?.player?.[`backlog.registry.${key}`];
    return k&&r?.history?.some(h=>h.id===commandId&&h.cause===k.cause&&h.at===k.at&&h.sequence<=state.sequence)?k:null;
};
function localReady(state,context) {
    return !!state.backlog?.replacement&&context.actorId==='player'&&context.worldId===I.world&&
        context.facts?.location==='Village'&&context.busy!==true&&qualifiedOfficeBody(state,context).status==='supported'&&
        [I.keeper,I.clerk,I.witness].every(id=>state.actors?.[id]?.worldId===I.world&&
            state.simulation?.people?.[id]?.definitionId===id&&state.simulation.people[id].life==='alive'&&
            state.simulation.people[id].location==='Village'&&state.simulation.people[id].body?.ownerId===id&&
            state.simulation.people[id].body?.controllerId===id&&!simulationOccupiesActor(state,id))&&
        !simulationOccupiesActor(state,'player');
}

/** Author/integration result only. The public surface below uses local prose. */
export function referenceRegistryComparison(state,context={}) {
    if(!localReady(state,context))return null;
    const r=state.backlog.replacement,k=report(state,'registry_report','backlog.replacement.registry_test');
    const credential=r.credential,right=state.simulation.claims?.[I.office];
    if(!r.registryRead||!k||!credential||credential.holderId!=='player'||credential.officeId!==I.office||
        credential.issuerId!==I.keeper||right?.status!=='held'||!r.claim)return null;
    const body=qualifiedOfficeBody(state,context),profile=getBookRecognitionProfile('lord-of-mysteries');
    const rule=profile?.rules.find(rule=>rule.id==='lotm1.office');
    if(!rule)return null;
    return recognizeBookWorld(profile.id,{mode:'source-comparison',sceneId:BOOK_RECOGNITION_SCENE.id,originalScene:true,
        ruleId:rule.id,eraId:rule.eraId,observer:{id:I.clerk,playerKnown:true},
        carriers:{actorId:'player',bodyId:body.bodyId,controllerId:body.controllerId,claimedActorId:r.claim.claimedActorId,
            rightId:I.office,rightHolderId:right.owner},
        means:{completed:true,reported:true,observerId:I.clerk,actorId:'player',channel:rule.channel,
            registryEntry:{actorId:credential.holderId,rightId:credential.officeId}}});
}
export function referenceDeskFacts(state,context={}) {
    const ready=localReady(state,context),r=state.backlog?.replacement,evaluation=ready?referenceRegistryComparison(state,context):null;
    const witness=state.backlog?.replacement?.recognition?.[I.witness];
    return {'reference.actualContact':ready,
        'reference.termsKnown':ready&&!!report(state,'terms','backlog.replacement.meet'),
        'reference.registryCurrent':ready&&evaluation?.status==='supported'&&r.officeStatus==='appointed',
        'reference.registryReturned':ready&&evaluation?.status==='blocked'&&r.officeStatus==='returned'&&state.simulation.claims[I.office].owner===I.keeper,
        'reference.discussionRemembered':ready&&[I.keeper,I.clerk,I.witness].every(id=>state.simulation.knowledge[id]?.[P+'heard_opening']),
        'reference.personalReported':ready&&witness?.kind==='personal_memory_and_method'&&
            !!report(state,'witness_report','backlog.replacement.personal_test')};
}
export function referenceDeskContext(state,context) {return {...context,facts:{...context.facts,...referenceDeskFacts(state,context)}};}
export function validateReferenceDeskState(state) {
    const f=state.actors?.player?.facts||{},k=state.simulation?.knowledge?.player||{},present=Object.keys(f).some(key=>key.startsWith(P))||Object.keys(k).some(key=>key.startsWith(P));
    if(!present)return;
    assert(f[P+'introduced']===true&&f[P+'version']===1&&state.backlog?.replacement?.schema===1,
        'The original desk requires its same actual supported office history. Preserve the original save.');
    for(const key of ['registryCompared','personalCompared','ordinaryHeard','declined','returned'])
        assert(f[P+key]==null||typeof f[P+key]==='boolean','Unsupported reference-desk progress.');
    assert(k[P+'opening']?.stage==='understood'&&state.simulation.situations?.[I.scene]?.revision===1&&
        [I.keeper,I.clerk,I.witness].every(id=>state.simulation.knowledge[id]?.[P+'heard_opening']?.stage==='understood'),
        'The desk requires its actual opening discussion with the same participants.');
    if(f[P+'registryCompared'])assert(state.backlog.replacement.registryRead&&
        (k[P+'registry']||k[P+'registry_returned'])&&report(state,'registry_report','backlog.replacement.registry_test'),
        'The comparison lost its earned actual registry report.');
    if(f[P+'personalCompared'])assert(k[P+'personal']&&report(state,'witness_report','backlog.replacement.personal_test'),
        'The discussion lost its actual personal account.');
}

export function createReferenceDeskHost() {
    function preview(state,registry,id,context) {
        const d=registry.simulation.commands.get(id);assert(d?.group===I.group,'Unknown office discussion.');
        return previewSimulationCommand(state,registry,id,referenceDeskContext(state,{...context,targetId:d.targetId}));
    }
    function commit(state,registry,command,context,expectedSequence=state.sequence) {
        const id=command.type==='begin'?I.begin:command.id,d=registry.simulation.commands.get(id);
        assert(state.sequence===expectedSequence&&d?.group===I.group&&d.actorId==='player','This office discussion changed.');
        assert(command.targetId==null||command.targetId===d.targetId,'Meet the actual declared office participant.');
        const ctx=referenceDeskContext(state,{...context,targetId:d.targetId});
        const out=commitSimulationCommand(state,registry,{id},ctx,expectedSequence);
        validateReferenceDeskState(out.state);return out;
    }
    function presentation(state,registry,context) {
        const ctx=referenceDeskContext(state,context),started=state.actors?.player?.facts?.[P+'introduced']===true;
        const actions=projectFeatureCommands(state,registry,ctx,{groups:[I.group],commandType:'reference'});
        return {id:I.scene,label:'At Orrin’s counter',visible:started||actions.some(a=>a.id===I.begin&&a.eligible),
            description:'Ask about your actual office account, listen to a familiar person or leave freely.',
            actions:actions.filter(a=>started||a.id===I.begin),records:featureRecordedKnowledge(state,[P])};
    }
    return {commit,preview,presentation,validate:validateReferenceDeskState,context:referenceDeskContext};
}
