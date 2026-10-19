import {deepFreeze as freeze, eqNoReason as eq} from './basics.js';
import {TIDEMARK_IDS as ids, TIDEMARK_LOCATIONS as places} from './feature_expansion_destination.js';
import {tidemarkContext, previewTidemarkAction, commitTidemarkAction, activeTidemarkVisit} from './feature_expansion_destination_host.js';
import {previewSimulationCommand, commitSimulationCommand} from './simulation.js';
import {REPLACEMENT_IDS as relayIds} from './backlog_expansion_replacement.js';
import {NESTED_IDS as nestedIds,NESTED_LOCATIONS as nestedPlaces,NESTED_FOOTPRINTS,NESTED_MISSIONS,nestedDefinitions,nestedActions} from './feature_expansion_nested_content.js';
import {previewNestedChainCommand,commitNestedChainCommand} from './feature_expansion_nested_chains_host.js';
import voiceCues from '../docs/gm/feature-wave/ink/voice-cues/VOICE_CUES.json' with {type:'json'};

export const INK_RESPONSES = Object.freeze(['ask_terms', 'material', 'coin', 'borrow_tool', 'return_tool', 'use_tool', 'teach', 'refuse', 'leave', 'relay_terms', 'relay_honest', 'relay_alias', 'relay_credential', 'relay_registry', 'relay_personal', 'relay_office', 'relay_work', 'relay_correction', 'relay_refuse', 'relay_leave', 'nested_lin_open', 'nested_lin_work', 'nested_lin_refuse', 'nested_lin_texture', 'nested_lin_account', 'nested_lin_supply', 'nested_hub_terms', 'nested_hub_work', 'nested_hub_train', 'nested_hub_refit', 'nested_hub_role', 'nested_hub_leave', 'nested_offer_terms', 'nested_offer_accept', 'nested_offer_cooperate', 'nested_offer_decline', 'nested_offer_leave', 'nested_local_report', 'nested_local_objective', 'nested_local_support', 'nested_local_extend', 'nested_local_withdraw', 'nested_local_extract', 'nested_local_recover', 'nested_local_refuse', 'nested_local_leave', 'nested_return_report', 'nested_return_settle', 'nested_return_dispute', 'nested_return_refit', 'nested_return_revisit', 'nested_return_stay', 'nested_return_leave']);
export const INK_SCENE_IDS = Object.freeze({scene:'feature-wave-negotiation',world:ids.world,keeper:ids.keeper,location:places.dock});
const knowledge=(key,value)=>({type:'knowledge',actor:'player',key:`ink.tidemark.${key}`,stage:'seen',value});
const narrative=(name,label,effects=[])=>({id:`ink.tidemark.${name}`,revision:1,label,actorId:'player',worldId:ids.world,location:places.dock,
    targetId:ids.keeper,coLocated:true,participants:[ids.keeper],group:'ink',requires:{all:[eq('tidemark.nativeBound'),eq('world.tidemark.met')]},costs:[],effects});
export const inkSceneDefinitions = {commands:[
    narrative('begin','Discuss the offered local work',[knowledge('meeting','You explicitly began a discussion with the keeper at the Tidemark landing. Talking alone accepts no work or payment.')]),
    narrative('terms','Ask about the offered terms',[knowledge('terms','The keeper offers an owned-timber repair, separately paid local instruction and a purpose-bound inspection kit loan. The ropewright sells finite local stock. Each accepted action checks its current means and rights.')]),
    narrative('leave','Leave the discussion open',[knowledge('left','You left the discussion without accepting new work, paying for a lesson or acquiring a tool.')])
]};
// These identities map to registered native planners, never to external Ink
// callbacks. The Features integrator admits the exact destination IDs below.
export const INK_COMMAND_BINDINGS = Object.freeze({
    begin:{id:'ink.tidemark.begin',kind:'narrative'},revisit:{id:'ink.tidemark.begin',kind:'narrative'},
    ask_terms:{id:'ink.tidemark.terms',kind:'narrative'},leave:{id:'ink.tidemark.leave',kind:'narrative'},
    material:{id:'tidemark.timber',kind:'destination',acceptAgreement:true},
    coin:{id:'tidemark.buy_log',kind:'destination'},
    borrow_tool:{id:'tidemark.borrow_kit',kind:'destination'},return_tool:{id:'tidemark.return_kit',kind:'destination'},
    use_tool:{id:'tidemark.inspect_floats',kind:'destination'},teach:{id:'tidemark.lesson',kind:'destination'},
    refuse:{id:'tidemark.decline',kind:'destination'}
});
const bounded=(value,fallback,limit=120)=>typeof value==='string'&&value.length&&value.length<=limit?value:fallback;
export function inkObserverVariables(observed={}) {
    return {keeper_name:bounded(observed.keeperName,'the bench keeper'),place_name:bounded(observed.placeName,'the terrace'),
        terms_known:observed.termsKnown===true,material_known:observed.materialRouteKnown===true,
        tool_known:observed.toolRouteKnown===true,lesson_known:observed.lessonKnown===true,
        tool_held:observed.toolHeld===true,prior_agreement:['material','coin','loan','returned','lesson','refused'].includes(observed.priorAgreement)?observed.priorAgreement:'',
        lesson_done:observed.lessonDone===true,
        host_scene:['relay.office','nested.hub','nested.offer','nested.mission','nested.return'].includes(observed.sceneId)?observed.sceneId:'tidemark.negotiation',
        relay_keeper_name:bounded(observed.keeperName,'the rightful keeper'),relay_clerk_name:bounded(observed.clerkName,'the registry clerk'),
        relay_witness_name:bounded(observed.witnessName,'the familiar local'),relay_terms_known:observed.relayTermsKnown===true,
        credential_result:['accepted','rejected'].includes(observed.credentialResult)?observed.credentialResult:'unknown',
        registry_result:['holder','not_holder'].includes(observed.registryResult)?observed.registryResult:'unknown',
        personal_result:['match','mismatch'].includes(observed.personalResult)?observed.personalResult:'unknown',
        office_held:observed.officeHeld===true,duty_done:observed.dutyDone===true,
        prior_relay_choice:['honest','alias','credential','office','work','corrected','refused'].includes(observed.priorRelayChoice)?observed.priorRelayChoice:'',
        voice_greeting:bounded(observed.voiceGreeting,'The desk is open; the work still has to be done.',200),
        voice_detail:bounded(observed.voiceDetail,'A cup cools beside the ledger. A used cloth keeps the seal clean.',240),
        voice_aside:bounded(observed.voiceAside,'The stamp is quicker than the paperwork. Most things are.',200),
        ...inkNestedObserverVariables(observed.nested)};
}
export function inkBindingFor(host,id) {
    const binding=host?.bindings?.[id];
    if(!binding||typeof binding.id!=='string'||!['narrative','destination','replacement','nested','nested_chain','nested_life'].includes(binding.kind))throw Error('This narrative response has no admitted host command.');
    return binding;
}
const merged=(context,plan)=>({...context,external:plan.external,gameplay:plan.gameplay,vitals:plan.vitals||context.vitals});
const costText=quote=>{
    const costs=(quote.costs||[]).map(c=>c.type==='item'?`${Math.abs(c.amount)} ${JSON.parse(c.key).id}`:
        c.type==='resource'&&c.native?`${Math.abs(c.amount)} wooden coins`:c.type==='vital'?`${Math.abs(c.amount)} ${c.key}`:
        c.type==='transfer'?`${c.count} ${JSON.parse(c.key).id} transferred`:'').filter(Boolean);
    return [costs.join(' + '),quote.duration?`${quote.duration} played minutes`:''].filter(Boolean).join(' · ');
};
const summary={material:'Accept the repair agreement, then reserve your actual logs for the timed repair. No completion reward is paid by this conversation.',
    coin:'Buy one actual local log. Payment and finite shop stock settle in the same durable save.',
    borrow_tool:'Borrow the actual inspection kit for its declared purpose. The keeper retains ownership; return it before leaving.',
    return_tool:'Return the same borrowed kit. No ownership gift or repair reward is created.',
    use_tool:'Inspect with the reusable kit. Its lawful use creates the observed finding, not ownership or a repaired sluice.',
    teach:'Reserve paid instruction. The learned local method arrives only when the actual lesson completes.',
    refuse:'Record this private refusal. Keep ordinary passage, shop and tide access.',
    ask_terms:'Hear the offered terms. No payment, loan, completed work or learned method.',leave:'Leave without accepting a new arrangement.'};
const agreementByCommand={material:'material',coin:'coin',borrow_tool:'loan',return_tool:'returned',teach:'lesson',refuse:'refused'};
export function createTidemarkInkHost({bindings=INK_COMMAND_BINDINGS}={}) {
    function prepare(state,registry,binding,context) {
        context=tidemarkContext(state,context);
        if(binding.acceptAgreement&&!state.worlds[ids.world]?.facts['tidemark.agreed']) {
            const quote=previewTidemarkAction(state,registry,'tidemark.accept',context);
            if(!quote.visible||!quote.eligible)return {state,context,blocked:quote};
            // Pure staging only: include the explicit agreement in this one plan
            // if the player accepts the displayed timber response.
            const plan=commitTidemarkAction(state,registry,'tidemark.accept',context,state.sequence);
            return {state:plan.state,context:merged(context,plan),agreement:plan};
        }
        return {state,context};
    }
    return {bindings,sceneId:'tidemark.negotiation',title:'At the pump bench',
        observe(state) {
            const known=state.simulation?.knowledge.player||{},terms=!!known['ink.tidemark.terms'];
            return {keeperName:known['tidemark.meeting']?'Nessa':'the bench keeper',placeName:known['tidemark.entered']?'Tidemark landing':'the terrace',
                termsKnown:terms,materialRouteKnown:terms,toolRouteKnown:terms,lessonKnown:terms,
                priorAgreement:state.actors.player.facts['ink.tidemark.agreement']==='loan'&&!state.simulation?.custody?.['tidemark.inspection_loan']&&known['tidemark.loan_return']?'returned':state.actors.player.facts['ink.tidemark.agreement']||'',lessonDone:!!known['tidemark.method'],toolHeld:state.simulation?.custody?.['tidemark.inspection_loan']?.holder==='player'};
        },
        preview(state,registry,binding,context) {
            if(!activeTidemarkVisit(state)||!state.simulation?.knowledge.player?.['tidemark.meeting'])return {visible:false,eligible:false,reasons:['Meet the keeper at the actual Tidemark landing first.']};
            const prepared=prepare(state,registry,binding,context);
            const quote=prepared.blocked||(binding.kind==='destination'
                ?previewTidemarkAction(prepared.state,registry,binding.id,prepared.context)
                :previewSimulationCommand(prepared.state,registry,binding.id,{...prepared.context,targetId:ids.keeper}));
            const response=Object.keys(bindings).find(key=>bindings[key]===binding);
            return {...quote,costText:costText(quote),consequenceText:summary[response]||'Conversation only; no completed work or reward.'};
        },
        commit(state,registry,binding,context,expectedSequence=state.sequence) {
            if(expectedSequence!==state.sequence)throw Error('This negotiation is stale.');
            const prepared=prepare(state,registry,binding,context);
            if(prepared.blocked)throw Error(prepared.blocked.reasons.join(' '));
            const plan=binding.kind==='destination'
                ?commitTidemarkAction(prepared.state,registry,binding.id,prepared.context,prepared.state.sequence)
                :commitSimulationCommand(prepared.state,registry,{id:binding.id},{...prepared.context,targetId:ids.keeper},prepared.state.sequence);
            const response=Object.keys(bindings).find(key=>bindings[key]===binding);
            if(agreementByCommand[response])plan.state.actors.player.facts['ink.tidemark.agreement']=agreementByCommand[response];
            return plan;
        }
    };
}


export const INK_WORLD_VOICE_CUES = freeze(voiceCues.rows);
export const ORIGINAL_RELAY_VOICE = freeze({id:'ink.voice.original_relay',provenance:'original',worldId:'base.frontier',sceneId:'relay.office',
    actorIds:[relayIds.holder,relayIds.clerk,relayIds.witness],greeting:'The desk is open; the work still has to be done.',
    detail:'Eda taps the seal on a damp cloth. Orrin straightens the ledger; Bera leaves her cup on the dry side.',
    aside:'The stamp is quicker than the paperwork. Most things are.'});
// Profiles are authoring records. A book row never activates because it exists
// in the bundle. Its native scene must explicitly supply a matched binding.
export function inkVoiceProjection(profile, {state,context,sceneId,nativeBinding}={}) {
    if(!profile || !nativeBinding || nativeBinding.active !== true || nativeBinding.sceneId !== sceneId ||
        nativeBinding.worldId !== context?.worldId || state?.actors?.player?.worldId !== nativeBinding.worldId ||
        !nativeBinding.actorIds?.length || !nativeBinding.actorIds.every(id => state.simulation?.people[id]?.life === 'alive' && state.actors?.[id]?.worldId === nativeBinding.worldId)) {
        return {active:false,reason:'This voice profile has no actual matched native scene/people binding.'};
    }
    if(profile.provenance !== 'original' && (!nativeBinding.sourceCutoff || !nativeBinding.eraId || !nativeBinding.profileId || nativeBinding.profileId !== profile.id)) {
        return {active:false,reason:'The selected source-world voice needs its explicit era/cutoff/profile binding.'};
    }
    const lines=profile.original_dialogue;
    return {active:true,voiceGreeting:bounded(profile.greeting||lines?.[0]?.text,'The desk is open.',200),
        voiceDetail:bounded(profile.detail,'A clean cloth lies beside the open ledger.',240),
        voiceAside:bounded(profile.aside||lines?.[1]?.text,'There is room for another account.',200),
        provenance:profile.provenance||profile.classification,profileId:profile.id};
}
const relayNarrative = (name,label,effects=[],requires=[]) => ({id:`ink.relay.${name}`,revision:1,label,actorId:'player',worldId:'base.frontier',location:'Village',
    targetId:relayIds.holder,coLocated:true,participants:[relayIds.holder,relayIds.clerk,relayIds.witness],group:'ink',
    requires:{all:[eq('ink.relay.enrolled'),eq('ink.relay.nativeAlive'),...requires]},costs:[],effects});
const relayKnowledge=(key,value,actor='player')=>({type:'knowledge',actor,key:`ink.relay.${key}`,stage:'seen',value});
export const inkRelayDefinitions = {commands:[
    relayNarrative('begin','Discuss the existing seal-office arrangements'),
    relayNarrative('terms','Ask about office and visitor terms',[relayKnowledge('terms','You heard the actual office offer: willing appointment and two-seal duty are separate from personal goods, debt, memory and methods. Ordinary visitor work stays open.')]),
    relayNarrative('leave','Leave the relay discussion open',[relayKnowledge('left','You left the relay discussion without accepting another commitment.')]),
    relayNarrative('refuse','Refuse the offered office',[relayKnowledge('refusal','You refused the proposed office; its actual right, duty and personal possessions remain with the living holder.'),
        relayKnowledge('visitor_refusal','The visitor refused the offered office; I keep my own current arrangements.',relayIds.holder)], [eq('ink.relay.officeUnaccepted')])
]};
export const INK_RELAY_BINDINGS = freeze({
    begin:{id:'backlog.replacement.meet',kind:'replacement',introduces:true},revisit:{id:'backlog.replacement.revisit',kind:'replacement',revisits:true},
    relay_terms:{id:'ink.relay.terms',kind:'narrative'},relay_leave:{id:'ink.relay.leave',kind:'narrative'},relay_refuse:{id:'ink.relay.refuse',kind:'narrative'},
    relay_honest:{id:'backlog.replacement.honest_entry',kind:'replacement'},relay_alias:{id:'backlog.replacement.claim_eda',kind:'replacement'},
    relay_credential:{id:'backlog.replacement.present_honest',kind:'replacement'},relay_registry:{id:'backlog.replacement.registry_test',kind:'replacement'},
    relay_personal:{id:'backlog.replacement.personal_test',kind:'replacement'},relay_office:{id:'backlog.replacement.accept_office',kind:'replacement'},
    relay_work:{id:'backlog.replacement.deliver_duty',kind:'replacement'},relay_correction:{id:'backlog.replacement.correct_clerk',kind:'replacement'}
});
const relayLast={relay_honest:'honest',relay_alias:'alias',relay_credential:'credential',relay_office:'office',relay_work:'work',relay_correction:'corrected',relay_refuse:'refused'};
// Features injects its existing Backlog preview/commit and actual native context;
// no new carrier, body, rights or reward engine is created by this bridge.
export function createRelayInkHost({previewReplacement,commitReplacement,voiceProfile=ORIGINAL_RELAY_VOICE,bindings=INK_RELAY_BINDINGS}={}) {
    if(typeof previewReplacement!=='function'||typeof commitReplacement!=='function') throw Error('Bind the actual Backlog replacement preview and staged commit.');
    const contextOf=(state,context)=>({...context,facts:{...context.facts,'ink.relay.enrolled':!!state.backlog?.replacement,
        'ink.relay.nativeAlive':context.nativeAlive===true&&(context.vitals?.player?.health||0)>0,
        'ink.relay.officeUnaccepted':state.backlog?.replacement?.officeStatus==='rightful'}});
    const resolved=(state,binding)=>binding.introduces&&state.backlog?.replacement || binding.revisits&&state.backlog?.replacement?.revisited
        || binding.revisits&&state.backlog?.replacement&&!state.backlog.replacement.dutyPerformed&&state.backlog.replacement.officeStatus!=='returned'&&!state.backlog.replacement.publicDelivered
        ?{id:'ink.relay.begin',kind:'narrative'}:binding;
    return {sceneId:'relay.office',title:'At the seal registry',bindings,
        observe(state,context) {
            const r=state.backlog?.replacement,known=state.simulation?.knowledge.player||{};
            const introduced=!!known['backlog.registry.terms'];
            const voice=inkVoiceProjection(voiceProfile,{state,context,sceneId:'relay.office',nativeBinding:{active:introduced,worldId:'base.frontier',sceneId:'relay.office',actorIds:[relayIds.holder,relayIds.clerk,relayIds.witness],profileId:voiceProfile.id}});
            return {sceneId:'relay.office',keeperName:introduced?'Eda':'the rightful keeper',clerkName:introduced?'Orrin':'the registry clerk',witnessName:introduced?'Bera':'the familiar local',
                relayTermsKnown:!!known['ink.relay.terms'],credentialResult:known['backlog.registry.clerk_report']?'accepted':'unknown',
                registryResult:known['backlog.registry.return_office']?'not_holder':known['backlog.registry.registry_report']&&r?.officeStatus==='appointed'?'holder':'unknown',
                personalResult:known['backlog.registry.witness_report']?(r?.recognition?.[relayIds.witness]?.beliefId===relayIds.holder?'match':'mismatch'):'unknown',
                officeHeld:!!known['backlog.registry.appointment']&&r?.officeStatus==='appointed',dutyDone:!!known['backlog.registry.duty']&&r?.dutyPerformed===true,
                priorRelayChoice:state.actors.player.facts['ink.relay.lastResponse']||'',...(voice.active?voice:{})};
        },
        preview(state,registry,binding,context) {
            if(context.worldId!=='base.frontier'||context.facts?.location!=='Village'||context.facts?.['village.elderMet']!==true)return {visible:false,eligible:false,reasons:['Meet the actual Village elder before the seal-office introduction.']};
            const action=resolved(state,binding),ctx=contextOf(state,context);
            const quote=action.kind==='replacement'?previewReplacement(state,registry,action.id,ctx):previewSimulationCommand(state,registry,action.id,{...ctx,targetId:relayIds.holder});
            return {...quote,costText:action.kind==='replacement'?quote.label:'No payment or material transfer.',
                consequenceText:quote.description||'Conversation only; no copied identity, goods, source or reward.'};
        },
        commit(state,registry,binding,context,expectedSequence=state.sequence) {
            const action=resolved(state,binding),ctx=contextOf(state,context);
            const plan=action.kind==='replacement'?commitReplacement(state,registry,{id:action.id},ctx,expectedSequence):
                commitSimulationCommand(state,registry,{id:action.id},{...ctx,targetId:relayIds.holder},expectedSequence);
            const response=Object.keys(bindings).find(id=>bindings[id]===binding);
            if(relayLast[response])plan.state.actors.player.facts['ink.relay.lastResponse']=relayLast[response];
            return plan;
        }
    };
}

export function inkNestedObserverVariables(observed={}) {
    const safe = observed && typeof observed==='object' ? observed : {};
    return {
        nested_hub_present:safe.nested_hub_present===true,
        ...Object.fromEntries(['open','work','refuse','texture','account','supply'].map(id=>[`nested_lin_${id}_offered`,safe[`nested_lin_${id}_offered`]===true])),
        nested_lin_report:bounded(safe.nested_lin_report,'',1200),
        nested_local_present:safe.nested_local_present===true,
        nested_return_arrived:safe.nested_return_arrived===true,
        nested_offer_visible:safe.nested_offer_visible===true,
        nested_terms_known:safe.nested_terms_known===true,
        nested_work_offered:safe.nested_work_offered===true,
        nested_training_offered:safe.nested_training_offered===true,
        nested_refit_offered:safe.nested_refit_offered===true,
        nested_role_offered:safe.nested_role_offered===true,
        nested_cooperation_offered:safe.nested_cooperation_offered===true,
        nested_objective_offered:safe.nested_objective_offered===true,
        nested_support_offered:safe.nested_support_offered===true,
        nested_extension_offered:safe.nested_extension_offered===true,
        nested_withdrawal_offered:safe.nested_withdrawal_offered===true,
        nested_extraction_offered:safe.nested_extraction_offered===true,
        nested_recovery_offered:safe.nested_recovery_offered===true,
        nested_settlement_offered:safe.nested_settlement_offered===true,
        nested_dispute_offered:safe.nested_dispute_offered===true,
        nested_revisit_offered:safe.nested_revisit_offered===true,
        nested_residence_offered:safe.nested_residence_offered===true,
        nested_destination_kind:['saltworks','archive'].includes(safe.nested_destination_kind)?safe.nested_destination_kind:'',
        nested_contact_name:bounded(safe.nested_contact_name,'the person across from you',120),
        nested_hub_name:bounded(safe.nested_hub_name,'',160),
        nested_destination_name:bounded(safe.nested_destination_name,'',160),
        nested_issuer_name:bounded(safe.nested_issuer_name,'',160),
        nested_entry_context:bounded(safe.nested_entry_context,'',320),
        nested_purpose:bounded(safe.nested_purpose,'',320),
        nested_role_terms:bounded(safe.nested_role_terms,'',640),
        nested_mission_terms:bounded(safe.nested_mission_terms,'',640),
        nested_cost_terms:bounded(safe.nested_cost_terms,'',640),
        nested_welfare_terms:bounded(safe.nested_welfare_terms,'',640),
        nested_portability_terms:bounded(safe.nested_portability_terms,'',640),
        nested_extraction_terms:bounded(safe.nested_extraction_terms,'',640),
        nested_issuer_outcome:bounded(safe.nested_issuer_outcome,'',640),
        nested_local_outcome:bounded(safe.nested_local_outcome,'',640),
        nested_recognition_report:bounded(safe.nested_recognition_report,'',640),
        nested_method_report:bounded(safe.nested_method_report,'',640),
        nested_welfare_report:bounded(safe.nested_welfare_report,'',640),
        nested_extraction_report:bounded(safe.nested_extraction_report,'',640),
        nested_request_report:bounded(safe.nested_request_report,'',640),
        nested_prior_exchange:bounded(safe.nested_prior_exchange,'',640)
    };
}


const nestedEndpoints = freeze([
    {id:'hub_street',scene:'nested.hub',world:nestedIds.hub,location:nestedPlaces.hub,actor:nestedIds.employee},
    {id:'hub_workroom',scene:'nested.hub',world:nestedIds.hub,location:nestedPlaces.workroom,actor:nestedIds.trainer},
    {id:'offer',scene:'nested.offer',world:nestedIds.hub,location:nestedPlaces.hub,actor:nestedIds.issuer},
    {id:'salt_landing',scene:'nested.mission',world:nestedIds.salt,location:nestedPlaces.salt,actor:nestedIds.keeper},
    {id:'salt_enginehouse',scene:'nested.mission',world:nestedIds.salt,location:nestedPlaces.enginehouse,actor:nestedIds.foreman},
    {id:'archive_reception',scene:'nested.mission',world:nestedIds.archive,location:nestedPlaces.archive,actor:nestedIds.registrar},
    {id:'archive_records',scene:'nested.mission',world:nestedIds.archive,location:nestedPlaces.records,actor:nestedIds.witness},
    {id:'return',scene:'nested.return',world:nestedIds.hub,location:nestedPlaces.hub,actor:nestedIds.issuer}
]);
const nestedTalk=(endpoint,operation)=>({id:`ink.nested.${endpoint.id}.${operation}`,revision:1,label:operation==='begin'?'Begin this local conversation':operation==='terms'?'Hear the disclosed current terms':'End this discussion',
    actorId:'player',worldId:endpoint.world,location:endpoint.location,targetId:endpoint.actor,coLocated:true,participants:[endpoint.actor],group:'ink',
    requires:{all:[eq('nested.nativeBound'),eq('ink.nested.scopeAvailable')]},costs:[],effects:[{type:'knowledge',actor:'player',key:`ink.nested.${endpoint.id}.${operation}`,stage:'seen',
        value:operation==='begin'?'You explicitly met the local participant for this discussion. No mission, service, source or payment was accepted.':
        operation==='terms'?'You heard the currently disclosed local terms. Each response still checks its actual people, rights, stock and contract stage.':'You ended this discussion without accepting another service or commitment.'}]});
export const inkNestedDefinitions = {commands:nestedEndpoints.flatMap(endpoint=>['begin','terms','leave'].map(operation=>nestedTalk(endpoint,operation)))};
const nestedStd=(world,leaf)=>nestedDefinitions.commands.find(d=>d.worldId===world&&d.id.split('.').at(-1)===leaf)?.id;
const missionById=id=>NESTED_MISSIONS.find(m=>m.id===id);
const nativeRow=id=>nestedActions.find(d=>d.id===id)||nestedDefinitions.commands.find(d=>d.id===id);
const ownMission=(state,id)=>state.nestedCampaign?.mission?.id===id?state.nestedCampaign.mission:state.nestedCampaign?.history.find(m=>m.id===id)||null;
const footprintByWorld=world=>NESTED_FOOTPRINTS.find(f=>f.worldId===world);
const prefixForScene=scene=>scene==='nested.hub'?'nested_hub_':scene==='nested.offer'?'nested_offer_':scene==='nested.return'?'nested_return_':'nested_local_';
const safeNativeQuote=(preview,state,registry,id,context)=>{
    if(!id)return {visible:false,eligible:false,reasons:['No declared local operation is bound.']};
    try{return preview(state,registry,id,context);}catch{return {visible:true,eligible:false,reasons:['This local operation is unavailable in the current native binding.']};}
};
// The actual campaign owns the scope domain. This validator checks its current
// explicit IDs and local body/contact without moving or creating any instance.
export function validateNestedInkScope(state,registry,scope,context,{sceneId,missionId,endpoint}={}) {
    const reasons=[],d=state.nestedCampaign,def=missionById(missionId),logicalWorld=sceneId==='nested.hub'?nestedIds.hub:def?.worldId;
    const footprint=footprintByWorld(logicalWorld),location=context.facts?.location||state.simulation?.people.player?.location;
    if(!d||!footprint||!d.instances?.some(i=>i.id===scope.instanceId&&i.worldId===scope.worldId)||scope.worldId!==logicalWorld)reasons.push('This discussion has no initialized matching place and contract.');
    if(sceneId==='nested.hub'?scope.kind!=='hub'||scope.missionId!=null:scope.kind!=='mission'||scope.missionId!==missionId)reasons.push('This discussion belongs to a different mission record.');
    const visit=d?.visits.find(v=>v.id===d.activeVisitId&&v.status==='active');
    if(!endpoint||visit?.endpoint.worldId!==endpoint.world||state.actors.player.worldId!==endpoint.world||location!==endpoint.location)reasons.push('Return to the actual participant at this place.');
    const p=endpoint&&state.simulation?.people[endpoint.actor];
    if(!p||p.life!=='alive'||p.location!==location||state.actors[endpoint.actor]?.worldId!==endpoint.world)reasons.push('The same living participant must be present.');
    if(context.nestedNative?.bound!==true||context.nestedNative.revision!==d?.nativeRevision)reasons.push('The current native place and people are unavailable.');
    if(context.nativeAlive!==true||(context.vitals?.player?.health||0)<=0||state.simulation?.people.player?.life!=='alive'||context.nestedNative?.body?.id!=='native.player.body'||context.nestedNative?.body?.form!=='human')reasons.push('This visit needs your supported living native body.');
    if(sceneId==='nested.offer'&&!d?.offers.some(o=>o.id===missionId))reasons.push('Hear the actual issuer’s offer before discussing this contract.');
    if(sceneId==='nested.mission'&&(!d?.mission||d.mission.id!==missionId||!['arrived','outcome','extracting'].includes(d.mission.stage)))reasons.push('Arrive under this actual mission before discussing its local work.');
    if(sceneId==='nested.return'&&(!ownMission(state,missionId)||!['returned','settled'].includes(ownMission(state,missionId).stage)||!state.simulation?.knowledge.player?.[`nested.returned.${missionId}`]))reasons.push('This discussion requires the same mission’s actual hub arrival.');
    return {scope,visible:!!d&&!!endpoint&&location===endpoint.location&&state.actors.player.worldId===endpoint.world,eligible:reasons.length===0,reasons};
}
// Features passes its existing pure preview and its staged native+joined-clock
// planner. Passing an action that already persists/publishes is unsupported.
export function createNestedInkHost({state,registry,context,sceneId,missionId=null,previewNative,commitNative,previewLife,commitLife,roleChoice='contractor'}={}) {
    if(!registry?.simulation?.commands||!['nested.hub','nested.offer','nested.mission','nested.return'].includes(sceneId)||typeof previewNative!=='function'||typeof commitNative!=='function')throw Error('Bind this exact nested scene, its actual registry and pure native preview/commit.');
    const world=state.actors.player.worldId,location=context.facts?.location||state.simulation?.people.player?.location;
    const endpoint=nestedEndpoints.find(e=>e.scene===sceneId&&e.world===world&&e.location===location);
    if(!endpoint)throw Error('There is no supported local conversation at the current place.');
    const mission=missionId&&missionById(missionId),footprint=footprintByWorld(sceneId==='nested.hub'?nestedIds.hub:mission?.worldId);
    if(!footprint)throw Error('Select the actual offered or retained mission for this conversation.');
    const scope={id:`ink.${sceneId}.${endpoint.id}.${missionId||footprint.instanceId}`,kind:sceneId==='nested.hub'?'hub':'mission',worldId:footprint.worldId,instanceId:footprint.instanceId,...(missionId?{missionId}:{})};
    const narrative=operation=>({id:`ink.nested.${endpoint.id}.${operation}`,kind:'narrative'});
    const native=id=>({id:id||'ink.nested.unbound',kind:'nested',...(id?{}:{missing:true})});
    const chain=id=>({id,kind:'nested_chain'});
    const lin=endpoint.id==='hub_street'&&typeof previewLife==='function'&&typeof commitLife==='function';
    const life=id=>({id:`nested.life.lin.${id}`,kind:'nested_life'});
    const lifeAllowed=binding=>{const row=registry.simulation.commands.get(binding.id);return lin&&row?.group==='nested_life'&&row.targetId===endpoint.actor&&row.worldId===endpoint.world&&row.location===endpoint.location&&Object.values(bindings).some(b=>b.kind==='nested_life'&&b.id===binding.id);};
    const localLeaf=leaf=>nestedStd(endpoint.world,leaf);
    const extraction=state.nestedCampaign?.mission?.extraction;
    const bindings={begin:narrative('begin'),revisit:narrative('begin')};
    if(sceneId==='nested.hub')Object.assign(bindings,{
        nested_hub_terms:narrative('terms'),nested_hub_leave:narrative('leave'),
        nested_hub_work:native(localLeaf('shift')),nested_hub_train:native(localLeaf(state.actors.player.facts['nested.method']==='fragment'?'support_lesson':'fragment')),
        nested_hub_refit:native(localLeaf('refit')),nested_hub_role:native(localLeaf(roleChoice==='employee'?'role_employee':'role_contractor'))});
    if(lin)Object.assign(bindings,Object.fromEntries(['open','work','refuse','texture','account'].map(id=>[`nested_lin_${id}`,life(id)])),{nested_lin_supply:native('nested.staff_supply')});
    if(sceneId==='nested.offer')Object.assign(bindings,{
        nested_offer_terms:narrative('terms'),nested_offer_accept:native(`nested.accept.${missionId}`),nested_offer_cooperate:native(`nested.accept.${missionId}`),
        nested_offer_decline:narrative('leave'),nested_offer_leave:narrative('leave')});
    if(sceneId==='nested.mission')Object.assign(bindings,{
        nested_local_report:narrative('terms'),nested_local_leave:narrative('leave'),
        nested_local_objective:native(localLeaf(endpoint.world===nestedIds.salt?'deliver':'register')),
        nested_local_support:native(localLeaf(endpoint.world===nestedIds.salt?'ordinary_brace':'preserve')),
        nested_local_extend:native('nested.mission.extend'),nested_local_withdraw:native('nested.mission.withdraw'),
        nested_local_extract:native(extraction?.phase==='ready'?'nested.extraction.arrive':state.nestedCampaign?.mission?.stage==='extracting'?'nested.extraction.wait':'nested.extraction.initiate'),
        nested_local_recover:native('nested.extraction.recover'),nested_local_refuse:native(localLeaf(endpoint.world===nestedIds.salt?'withhold':'refuse'))});
    if(sceneId==='nested.return') {
        const next=NESTED_MISSIONS.find(m=>m.worldId===mission.worldId&&m.kind==='followup');
        Object.assign(bindings,{nested_return_report:narrative('terms'),nested_return_leave:narrative('leave'),
            nested_return_settle:native('nested.mission.settle'),nested_return_dispute:chain(`nested.chain.${mission.worldId===nestedIds.salt?'welfare':'roles'}.account`),nested_return_refit:native('nested.move.workroom'),
            nested_return_revisit:native(next?`nested.offer.${next.id}`:null),nested_return_stay:native(nestedStd(nestedIds.hub,state.actors.player.facts['nested.role']==='employee'?'staff_rest':'rest'))});
    }
    const checkedContext=(current,ctx)=>({...ctx,facts:{...ctx.facts,'ink.nested.scopeAvailable':validateNestedInkScope(current,null,scope,ctx,{sceneId,missionId,endpoint}).eligible}});
    const observe=(current,ctx)=>{
        const known=current.simulation?.knowledge.player||{},m=ownMission(current,missionId),met=!!known[`ink.nested.${endpoint.id}.begin`];
        const definition=nestedDefinitions.people.find(p=>p.id===endpoint.actor),name=met?definition?.label?.split(',')[0]:'the person across from you';
        const local=sceneId==='nested.mission',hub=endpoint.world===nestedIds.hub;
        const records=Object.entries(known).filter(([key])=>key.startsWith('nested.chain.')&&!key.includes('.private.')).sort((a,b)=>b[1].at-a[1].at);
        const report=(prefix,label,world)=>{
            if(local&&endpoint.world!==world&&prefix!=='nested.chain.method.')return '';
            const delivered=records.find(([key])=>key.startsWith(prefix))?.[1];
            return delivered?.value?`Your last delivered ${label} account (${delivered.at} played minutes): ${delivered.value}`:'';
        };
        const cursor=current.inkNarrative?.schema===2?current.inkNarrative.scopes.find(r=>r.scope.id===scope.id):null;
        const prior=cursor?.receipts?.filter(r=>!['begin','revisit','pause','resume'].includes(r.responseId)).at(-1);
        const row=prior&&nativeRow(prior.commandId);
        const deliveredOutcome=!!known[`nested.outcome.${missionId}`]||!!known[`nested.settled.${missionId}`];
        const fields={nested_hub_present:hub&&ctx.worldId===nestedIds.hub,nested_local_present:local&&ctx.worldId===endpoint.world,
            nested_return_arrived:!!known[`nested.returned.${missionId}`]&&['returned','settled'].includes(m?.stage),
            nested_offer_visible:!!known[`nested.offer.${missionId}`],nested_destination_kind:mission?.worldId===nestedIds.salt?'saltworks':mission?.worldId===nestedIds.archive?'archive':'',
            nested_contact_name:name,nested_hub_name:known['nested.passage']?'Paradise service district':'',
            nested_destination_name:known[`nested.offer.${missionId}`]?mission?.worldId===nestedIds.salt?'Saltworks':'Lamplit Archive':'',
            nested_issuer_name:known[`nested.offer.${missionId}`]?'Mara':'',nested_entry_context:known[`nested.arrival.${missionId}`]?.value||'',
            nested_purpose:known[`nested.offer.${missionId}`]?mission?.objective||'':'',nested_terms_known:!!known[`ink.nested.${endpoint.id}.terms`]||!!known[`nested.offer.${missionId}`],
            nested_role_terms:known['nested.hub.life']?`Current approval: ${current.actors.player.facts['nested.role']}. Employee services and contractor contracts have separate permissions.`:'',
            nested_mission_terms:known[`nested.offer.${missionId}`]?`${mission.objective} Offered ${mission.reward} credits for issuer success, ${mission.partialReward} for a truthful partial/local result, zero for breach. Settlement occurs once after hub arrival.`:'',
            nested_cost_terms:known[`nested.offer.${missionId}`]?`Acceptance reserves issuer funds; one optional ${mission.extension}-minute extension costs ${mission.extensionCost} hub credits. Current service costs appear beside the responses.`:'',
            nested_welfare_terms:known[mission?.worldId===nestedIds.salt?'nested.saltworks.inspection':mission?.worldId===nestedIds.archive?'nested.archive.inspection':'']?.value||'',
            nested_portability_terms:known['nested.passage']?'Your same living body and owned carried/equipped goods use the declared edge. Return unapproved loans first. A local office credential grants no foreign jurisdiction.':'',
            nested_extraction_terms:known[`nested.offer.${missionId}`]?`${mission.extraction} local minutes prepare extraction. ${mission.interference?'One unrepaired Saltworks route may interrupt; a declared rope repair is available.':'This route has no authored interference.'} Initiation, readiness, actual hub arrival and settlement are separate.`:'',
            nested_issuer_outcome:deliveredOutcome?`Reported ${m?.outcome}; issuer success ${m?.issuerSuccess}.`:'',nested_local_outcome:deliveredOutcome?m?.welfare||'':'',
            nested_recognition_report:report('nested.chain.roles.','archive recognition',nestedIds.archive),nested_method_report:report('nested.chain.method.','learned method',nestedIds.hub),nested_welfare_report:report('nested.chain.welfare.','Saltworks welfare',nestedIds.salt),
            nested_extraction_report:known[`nested.returned.${missionId}`]?.value||known[`nested.recovery.${missionId}`]?.value||known[`nested.extraction.${missionId}`]?.value||'',
            nested_prior_exchange:row?.label||prior?.responseId||'',nested_request_report:known[`nested.settled.${missionId}`]?.value?`This mission's recorded settlement: ${known[`nested.settled.${missionId}`].value}`:known[`nested.outcome.${missionId}`]?.value?`This mission's recorded outcome: ${known[`nested.outcome.${missionId}`].value}`:''};
        const linKnown=key=>known[`nested.life.lin.${key}`]?.value||'';
        const linJob=current.simulation?.jobs.find(j=>j.actorId==='player'&&j.commandId==='nested.life.lin.work');
        fields.nested_lin_report=lin?(linKnown('account')||linKnown('result')||linKnown('refusal')||(linJob?'Your accepted supply job is in progress. Its materials and wage remain reserved; closing this conversation does not cancel the job.':linKnown('terms'))):'';
        for(const id of ['open','work','refuse','texture','account'])fields[`nested_lin_${id}_offered`]=lin&&safeNativeQuote(previewLife,current,registry,bindings[`nested_lin_${id}`].id,ctx).visible===true;
        fields.nested_lin_supply_offered=lin&&safeNativeQuote(previewNative,current,registry,'nested.staff_supply',ctx).visible===true;
        const offered=response=>{
            const b=bindings[response];return b?.kind==='nested'&&safeNativeQuote(previewNative,current,registry,b.id,ctx).visible===true;
        };
        Object.assign(fields,{nested_work_offered:offered('nested_hub_work'),nested_training_offered:offered('nested_hub_train'),nested_refit_offered:offered(sceneId==='nested.return'?'nested_return_refit':'nested_hub_refit'),
            nested_role_offered:offered('nested_hub_role'),nested_cooperation_offered:offered('nested_offer_cooperate'),nested_objective_offered:offered('nested_local_objective'),
            nested_support_offered:offered('nested_local_support'),nested_extension_offered:offered('nested_local_extend'),nested_withdrawal_offered:offered('nested_local_withdraw'),
            nested_extraction_offered:offered('nested_local_extract'),nested_recovery_offered:offered('nested_local_recover'),nested_settlement_offered:offered('nested_return_settle'),
            nested_dispute_offered:bindings.nested_return_dispute?.kind==='nested_chain'&&safeNativeQuote(previewNestedChainCommand,current,registry,bindings.nested_return_dispute.id,ctx).visible===true,nested_revisit_offered:offered('nested_return_revisit'),nested_residence_offered:hub});
        return {sceneId,nested:fields};
    };
    return {sceneId,title:sceneId==='nested.hub'?'Between journeys':sceneId==='nested.offer'?'The offered assignment':sceneId==='nested.return'?'A return account':'At the retained destination',
        scope,bindings,allowJoinedClockAdvance:true,observe,
        validateScope:(current,registry,bound,ctx)=>validateNestedInkScope(current,registry,bound,ctx,{sceneId,missionId,endpoint}),
        preview(current,registry,binding,ctx) {
            const quote=validateNestedInkScope(current,registry,scope,ctx,{sceneId,missionId,endpoint});
            if(!quote.visible||!quote.eligible)return quote;
            if(binding.kind==='nested_life'&&!lifeAllowed(binding))return {visible:false,eligible:false,reasons:['This request belongs to a different local participant or unsupported adapter.']};
            const prepared=checkedContext(current,ctx),nativeQuote=binding.kind==='nested_life'?safeNativeQuote(previewLife,current,registry,binding.id,prepared):binding.kind==='nested'?safeNativeQuote(previewNative,current,registry,binding.id,prepared):binding.kind==='nested_chain'?safeNativeQuote(previewNestedChainCommand,current,registry,binding.id,prepared):
                previewSimulationCommand(current,registry,binding.id,{...prepared,targetId:endpoint.actor});
            const row=registry.simulation.commands.get(binding.id)||nativeRow(binding.id);
            return {...nativeQuote,costText:costText(nativeQuote)||row?.label||'Conversation only; no payment.',
                consequenceText:row?.description||'Only this accepted native step is committed. Mission outcome, actual arrival, local welfare and settlement stay separate.'};
        },
        commit(current,registry,binding,ctx,expectedSequence=current.sequence) {
            const prepared=checkedContext(current,ctx);
            if(binding.kind==='nested_life'){if(!lifeAllowed(binding))throw Error('This request belongs to a different local participant or unsupported adapter.');return commitLife(current,registry,{type:'nested_life',id:binding.id},prepared,expectedSequence);}
            return binding.kind==='nested'?commitNative(current,registry,binding.id,prepared,expectedSequence):binding.kind==='nested_chain'?commitNestedChainCommand(current,registry,{type:'command',id:binding.id},prepared,expectedSequence):
                commitSimulationCommand(current,registry,{id:binding.id},{...prepared,targetId:endpoint.actor},expectedSequence);
        }
    };
}
