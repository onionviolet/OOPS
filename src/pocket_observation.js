import {createFoldedGlasshouseContent} from './pocket_realm_content.js';
import {createPocketRealmScenes} from './pocket_realm_scenes.js';
import {createRealmConnection, realmConnectionBinding, validateRealmConnectionBinding} from './realm_connections.js';
import {realmStableId as stable, realmNatural as natural, sameRealmEndpoint, validateRealmJson} from './realm_boundary_rules.js';
import {createObservationChannel, createObservationChannelState, validateObservationChannelState,
    validateObservationChannelBinding, planObservationActivation, planObservationSample,
    planObservationDetection, planObservationNotice, planObservationIdentity, planObservationClosure,
    observationReplayView} from './observation_channels.js';

// Selected original prototype. Inject common execution; no native/storage imports.
const content = createFoldedGlasshouseContent(), scenes = createPocketRealmScenes();
const copy = x => structuredClone(x), assert = (ok, text) => { if (!ok) throw Error(text); };
const prefix = content.bindings.worldFactPrefix, scene = scenes.id, joss = content.caretakerId;
const cmd = name => `pocket.observation.${name}`, key = name => `${prefix}.observation.${name}`;
const item = name => JSON.stringify({id:name});
const eq = (fact,value=true) => ({fact,op:'eq',value}), all = (...rules) => ({all:rules});
const sourceId = scenes.listenerProposal.source.id, powerId = key('notice_power'), anchorId = key('frame_anchor');
const deviceFact = 'glasshouse.observation.deviceOwned', listenerFact = 'glasshouse.observation.listenerInstalled';
const local = all(eq('worldVisit.instanceId',content.endpoint.instanceId),eq(`person.${joss}.willing`));
const know = (name,text,actor='player',kind='observation') => ({type:'knowledge',actor,key:key(name),stage:kind==='instruction'?'understood':'seen',value:text,basis:{kind,attributedTo:joss,situationId:content.situationId}});
const base = (name,label,actorId='player',worldId=content.endpoint.worldId) => ({id:cmd(name),revision:1,label,actorId,worldId,costs:[],effects:[]});
const npc = (name,label,effects,requires,power=false) => ({...base(name,label,joss),audience:[joss,'player'],requires,effects,...(power?{powerId}: {})});
export const POCKET_OBSERVATION_IDS = Object.freeze({channelId:key('channel'),connectionId:key('view'),sourceId,powerId,anchorId,caretakerId:joss,deviceFact,listenerFact,maxActivations:32});
export const pocketObservationSources = [copy(scenes.listenerProposal.source)];
export const pocketObservationDefinitions = {
 powers:[{id:powerId,revision:1,label:'Frame listener notice',model:'practice',capacity:1,cooldown:0,
    execution:all(eq(`faculty.${sourceId}.active`),eq('body.frameSense'),eq('actor.life','alive'),eq('glasshouse.observation.returnSupported'))}],
 commands:[
  {...base('earn_listener','Calibrate Joss’s Frame listener here · 1 coin'),once:true,location:'Folded Glasshouse',targetId:joss,coLocated:true,participants:['$target'],group:'glasshouse',
   visibleWhen:all(local,eq(`knowledge.${prefix}.packing.seen`)),requires:all(local,eq('glasshouse.observation.listenerEligible')),
   costs:[{type:'resource',native:true,key:'money',amount:-1}],effects:[{type:'resource',actor:joss,key:'coins',amount:1},
    {type:'body',actor:joss,key:'form',value:'human'},{type:'body',actor:joss,key:'frameSense',value:true},{type:'fact',scope:'actor',actor:joss,key:listenerFact,value:true},
    {type:'source',actor:joss,sourceId,operation:'grant',origin:'trained',awakened:true,active:true},{type:'power',actor:joss,powerId,operation:'learn'},
    know('listener','You paid for a local calibration after Joss’s funded frame work. Joss acquired the Frame listener and its notice; you acquired neither source nor power.'),
    know('listener','I completed the paid calibration and acquired my own frame faculty and notice power.',joss)]},
  {...base('craft_device','Craft your paired viewing device here · template + 2 logs + kit + 2 stamina'),once:true,location:'Folded Glasshouse',group:'glasshouse',visibleWhen:local,
   requires:all(local,eq('glasshouse.observation.deviceEligible'),eq('glasshouse.handsUsable')),costs:[{type:'item',key:item('Rough wood log'),amount:-2},{type:'item',key:item('Prepared survey kit'),amount:-1},{type:'vital',key:'stamina',amount:-2}],
   effects:[{type:'fact',scope:'actor',key:deviceFact,value:true},know('device','You used your owned reusable template, two logs, one kit and two stamina to craft your paired viewing device. The template remains yours; the device carries only images and notices.','player','instruction')]},
  {...base('activate','Activate the Village viewing slit · 1 coin · 12 played min','player','base.frontier'),location:'Village',costs:[{type:'resource',native:true,key:'money',amount:-1}],requires:eq('glasshouse.observation.canActivate'),effects:[know('activation','You paid once for a twelve-minute anonymous live view. Your body and bag remain in the Village.')]},
  {...base('sample','Sample the paired live slit','player','base.frontier'),location:'Village',requires:eq('glasshouse.observation.sampleSupported'),effects:[]},
  npc('detect','Joss notices one incoming live sample',[know('detected','An anonymous live trace reached my actually supported frame. I learned no sender identity.',joss)],eq('glasshouse.observation.detectionSupported')),
  npc('notice','Joss sends one zero-fuel return notice',[know('notice','I notice someone at the frame. You need not give a name.','player'),know('notice_sent','I sent one notice through my actual return path; no sender identity was disclosed.',joss)],eq('glasshouse.observation.noticeSupported'),true),
  {...base('shutter','Shut your actual viewing device','player','base.frontier'),location:'Village',requires:eq('glasshouse.observation.canShutter'),effects:[know('closure','You closed the viewing slit. Earlier text, Joss, stock and the physical doorway remain.')]},
  {...base('claim','Send the deliberate claim “visiting artisan”','player','base.frontier'),location:'Village',requires:eq('glasshouse.observation.claimSupported'),effects:[know('claim','The anonymous sender deliberately claimed to be a visiting artisan. This is a claim, not verified identity.',joss)]},
  {...base('cooperate','Introduce locally for calibration · 1 coin'),once:true,location:'Folded Glasshouse',targetId:joss,coLocated:true,participants:['$target'],group:'glasshouse',requires:all(local,eq('glasshouse.observation.localCooperation')),
   costs:[{type:'resource',native:true,key:'money',amount:-1}],effects:[{type:'resource',actor:joss,key:'coins',amount:1},know('cooperation','You introduced yourself here as a visiting artisan and paid for local calibration. Joss’s listener remains his.','player','instruction'),know('local_claim','The present visitor claimed the artisan role and paid one actual coin here.',joss)]}
 ]};
const publicNames = ['earn_listener','craft_device','activate','shutter','claim','cooperate'];
export const pocketObservationActions = [...publicNames.map(name => ({id:cmd(name),label:pocketObservationDefinitions.commands.find(d=>d.id===cmd(name)).label})),{id:cmd('replay'),label:'Replay your stored viewing evidence · no sample or cost'}];

function connectionAt(clock=0,revision=1,open=false) {
 return createRealmConnection({id:POCKET_OBSERVATION_IDS.connectionId,revision,from:content.connectionProposal.from,to:content.endpoint,kind:'view',controllerId:'player',bidirectional:false,
  open,openedAt:open?clock:null,expiresAt:open?clock+12:null,lifetime:12,duration:0,
  requirements:{id:key('boundary'),revision:1,operations:['view','sense','reach'],bodyForms:['human'],costs:[]},
  observationPolicy:{sense:true,identify:false,reach:true,contact:false,identification:'disclosure'},flows:['light','sound'],costs:[],openingCosts:[]});
}
export const POCKET_OBSERVATION_CONNECTION_BINDING = realmConnectionBinding(connectionAt());
export const POCKET_OBSERVATION_CHANNEL = createObservationChannel({id:POCKET_OBSERVATION_IDS.channelId,revision:1,connectionId:POCKET_OBSERVATION_IDS.connectionId,
 from:content.connectionProposal.from,to:content.endpoint,subjectId:joss,
 listener:{sourceId,sourceRevision:1,bodyFaculty:'frameSense',anchorId,noticePowerId:powerId,noticePowerRevision:1},
 flows:{sample:['light'],return:['light']},activationCosts:[{ownerId:'player',resourceId:'money',amount:1}],sampleCosts:[],detectionCosts:[],noticeCosts:[],lifetime:12});
const currentLease = state => Object.values(state.realmPrototype?.observation?.state.leases||{}).find(l=>l.status==='active')||null;
const hasRecord = (state,actor,name) => {const r=state.simulation?.knowledge?.[actor]?.[key(name)];return !!r&&stable(r.cause)&&natural(r.at)&&r.at<=state.clock;};
function ownedDevice(state) {return state.actors?.player?.facts?.[deviceFact]===true&&state.actors.player.completed?.[cmd('craft_device')]>0&&hasRecord(state,'player','device');}
function acquiredListener(state,at=state.clock) {
 const a=state.actors?.[joss],p=state.simulation?.people?.[joss],s=a?.sources?.[sourceId],f=state.simulation?.faculties?.[joss]?.[sourceId],power=state.simulation?.powers?.[joss]?.[powerId];
 return !!(a?.facts?.[listenerFact]===true&&p?.body?.frameSense===true&&(p.body.form||'human')==='human'&&s?.revision===1&&stable(s.receiptId)&&s.acquiredAt<=at&&
  (s.expiresAt===null||s.expiresAt>at)&&f?.awakened&&f.active&&!f.suppressed&&power?.owned&&power.revision===1&&stable(power.cause)&&power.cause===s.receiptId&&state.simulation.knowledge?.[joss]?.[key('listener')]?.cause===s.receiptId&&
  state.actors?.player?.completed?.[cmd('earn_listener')]>0&&hasRecord(state,joss,'listener'));
}
function anchorSupported(state) {
 const i=state.realmPrototype?.instances?.[content.endpoint.instanceId];
 return !!(i?.facts?.['scenes.shelfBuilt']===true&&i.facts['bench.open']===true&&i.facts['repair.status']==='repaired'&&hasRecord(state,joss,'listener'));
}
export function pocketObservationSupport(state,playedAt=state.clock) {
 assert(natural(playedAt),'Supply joined played time.');const o=state.realmPrototype?.observation,l=currentLease(state),reasons=[];
 if(!o||!l)reasons.push('No active acquired viewing lease.');
 if(!ownedDevice(state))reasons.push('The player lacks the actually crafted device.');
 if((state.simulation?.people?.player?.body?.form||'human')!=='human')reasons.push('The current player body cannot operate this authored device.');
 if(!acquiredListener(state,playedAt))reasons.push('Joss lacks actual operating listener/source/power/body support.');
 if(!anchorSupported(state))reasons.push('The actual repaired shelf/frame anchor is unavailable.');
 if(state.actors?.player?.worldId!=='base.frontier'||state.simulation?.people?.player?.location!=='Village'||state.simulation?.people?.player?.life!=='alive')reasons.push('The current player body is not alive at the Village device.');
 if(state.actors?.[joss]?.worldId!==content.endpoint.worldId||state.simulation?.people?.[joss]?.location!=='Folded Glasshouse'||state.simulation.people[joss].life!=='alive')reasons.push('The current Joss body is unavailable at the actual frame.');
 if(l&&(playedAt<l.openedAt||playedAt>=l.expiresAt||!o.connection.open||o.connection.revision!==l.connectionRevision||o.connection.expiresAt!==l.expiresAt))reasons.push('The bounded view edge/lease is closed, stale or expired.');
 const sample=l&&o.state.receipts[l.sampleId];if(l&&(!sample||sample.kind!=='sample'||sample.at>playedAt))reasons.push('The lease lacks actual incoming sampling evidence.');
 const active=!reasons.length,clockBinding=active?{leaseId:l.id,policyId:'glasshouse.live_observation',causeId:o.state.receipts[l.activationId].cause,
  issuerId:joss,ownerId:'player',sourceId,anchorId,contactId:l.id,endpoint:copy(content.endpoint),expiresAt:l.expiresAt}:null;
 return {active,instanceId:content.endpoint.instanceId,leaseId:l?.id||null,expiresAt:l?.expiresAt??null,leaseRevision:l?.revision??null,
  connectionRevision:o?.connection.revision??null,reasons,clockBinding};
}
export function nextPocketObservationBoundary(state) {const l=currentLease(state);return l&&l.expiresAt>state.clock?l.expiresAt:null;}
export function validatePocketObservation(state) {
 const o=state.realmPrototype?.observation;if(o==null)return state;validateRealmJson(o);
 assert(Object.keys(o).length===3&&o.connection&&o.channel&&o.state,'Invalid optional observation namespace.');
 validateRealmConnectionBinding(o.connection,POCKET_OBSERVATION_CONNECTION_BINDING);validateObservationChannelBinding(o.channel,POCKET_OBSERVATION_CHANNEL);validateObservationChannelState(o.state);
 const leases=Object.values(o.state.leases);assert(leases.length<=32&&leases.filter(l=>l.status==='active').length<=1,'Observation permits at most 32 retained activations.');
 for(const l of leases)assert(l.channelId===o.channel.id&&l.channelRevision===o.channel.revision&&l.operatorId==='player'&&l.subjectId===joss&&l.connectionId===o.connection.id&&l.expiresAt-l.openedAt===12&&l.openedAt<=state.clock,'Unsupported saved viewing lease.');
 assert(o.state.sequence<=224,'This selected prototype retains at most seven receipts per activation.');
 for(const l of leases){const rs=Object.values(o.state.receipts).filter(r=>r.leaseId===l.id);assert(rs.filter(r=>r.kind==='sample').length<=2&&rs.filter(r=>r.kind==='claim').length<=1&&!rs.some(r=>r.kind==='verified_identity'),'Unsupported prototype sampling/identity history.');}
 for(const r of Object.values(o.state.receipts))assert(r.at<=state.clock,'Observation receipt exceeds played time.');
 assert(o.connection.openedAt===null||o.connection.openedAt<=state.clock,'View opening exceeds played time.');
 const l=currentLease(state);if(l)assert(o.connection.open&&l.connectionRevision===o.connection.revision&&l.expiresAt===o.connection.expiresAt,'Active viewing lease disagrees with actual edge.');
 return state;
}
function hostContext(state,context={},playedAt=state.clock) {
 const o=state.realmPrototype.observation,person=(actorId,ep)=>{const p=state.simulation.people[actorId],a=state.actors[actorId],s=a.sources?.[sourceId],f=state.simulation.faculties?.[actorId]?.[sourceId],power=state.simulation.powers?.[actorId]?.[powerId];return {actorId,sequence:state.sequence,clock:playedAt,endpoint:ep,life:p.life,
  body:{id:actorId==='player'?'native.player.body':`${actorId}.body`,revision:1,form:p.body?.form||'human',endpoint:ep,faculties:{frameSense:p.body?.frameSense===true,pairedViewDevice:actorId==='player'?ownedDevice(state):false}},
  sources:s?[{id:sourceId,revision:s.revision,ownerId:actorId,owned:true,active:!!f?.active,suppressed:!!f?.suppressed,awakened:!!f?.awakened,receiptId:s.receiptId,acquiredAt:s.acquiredAt,expiresAt:s.expiresAt,operations:['sense','reach'],bodyForms:['human']}]:[],
  powers:power?[{id:powerId,revision:power.revision,ownerId:actorId,owned:power.owned,receiptId:power.cause}]:[],
  anchors:[{id:anchorId,revision:1,available:anchorSupported(state),endpoint:copy(content.endpoint)}],resources:actorId==='player'?[{ownerId:'player',resourceId:'money',amount:context.external?.money||0}]:[{ownerId:actorId,resourceId:'coins',amount:a.resources.coins||0}],
  methodIds:[],authorityIds:[],knownConnectionIds:[o.connection.id],bindings:[o.connection.from,o.connection.to].map(endpoint=>({endpoint,available:true,positions:[]}))};};
 const playerEndpoint=state.actors.player.worldId===content.endpoint.worldId?content.endpoint:{...content.connectionProposal.from,regionId:state.simulation.people.player.location==='Village'?content.connectionProposal.from.regionId:'frontier.away'};
 const jossEndpoint=state.simulation.people[joss].location==='Folded Glasshouse'?content.endpoint:{...content.endpoint,regionId:'glasshouse.away'};
 return {clock:playedAt,sequence:state.sequence,operator:person('player',playerEndpoint),subject:person(joss,jossEndpoint),closureAuthority:{actorId:'player',channelId:o.channel.id,connectionId:o.connection.id,connectionRevision:o.connection.revision,cause:`observation:shutter:${state.sequence+1}`,at:playedAt,endpoint:copy(playerEndpoint),shutterReachable:ownedDevice(state)&&state.simulation.people.player.location==='Village'&&state.simulation.people.player.life==='alive'&&(state.simulation.people.player.body?.hands??2)>=2}};
}
function requestFor(state,kind,lease=currentLease(state)) {const o=state.realmPrototype.observation;return {cause:`simulation:${state.sequence+1}`,receiptId:`glasshouse.observation.${o.state.sequence+1}.${kind}`,expectedSequence:o.state.sequence,expectedHostSequence:state.sequence,expectedChannelRevision:o.channel.revision,expectedConnectionRevision:o.connection.revision,leaseId:lease?.id||`glasshouse.observation.lease.${Object.keys(o.state.leases).length+1}`,expectedLeaseRevision:lease?.revision??0};}
function closeState(state,reason,context={}) {const o=state.realmPrototype.observation,l=currentLease(state),request={...requestFor(state,'closure',l),reason};request.cause=`observation:closure:${state.sequence+1}`;
 const plan=planObservationClosure(o.state,o.channel,o.connection,hostContext(state,context),request);assert(plan.allowed,plan.reasons.join(' '));o.state=plan.nextState;
 o.connection={...o.connection,open:false,revision:o.connection.revision+1,closure:{cause:request.cause,at:state.clock,reason:reason==='support_lost'?'anchor_lost':reason}};state.sequence++;return state;}
export function expirePocketObservation(state) {
 const l=currentLease(state);if(!l)return state;const support=pocketObservationSupport(state);if(support.active)return state;
 const next=copy(state);return closeState(next,state.clock>=l.expiresAt?'expired':'support_lost');
}
function liveMeans(state,at=state.clock) {
 const reasons=[];
 if(!ownedDevice(state))reasons.push('Craft the actual paired viewing device first.');
 if((state.simulation?.people?.player?.body?.form||'human')!=='human')reasons.push('The current player body cannot operate this authored device.');
 if(!acquiredListener(state,at))reasons.push('Acquire and operate Joss’s actual listener first.');
 if(!anchorSupported(state))reasons.push('The actual repaired shelf/frame anchor is unavailable.');
 if(state.actors?.player?.worldId!=='base.frontier'||state.simulation?.people?.player?.location!=='Village'||state.simulation.people.player.life!=='alive')reasons.push('Return the current player body to the Village device.');
 if(state.actors?.[joss]?.worldId!==content.endpoint.worldId||state.simulation?.people?.[joss]?.location!=='Folded Glasshouse'||state.simulation.people[joss].life!=='alive')reasons.push('Joss’s current body is unavailable at the frame.');
 return reasons;
}
function projectedNativeLocation(state,context) {
 const location=context.facts?.location;
 if((context.actorId||'player')==='player'&&state.actors?.player?.worldId==='base.frontier'&&state.simulation?.people?.player&&typeof location==='string'&&location.length>0&&location!==state.simulation.people.player.location){
  const projected=copy(state);projected.simulation.people.player.location=location;return projected;
 }
 return state;
}
export function pocketObservationContext(state,context) {
 // The host supplies actual native current_location, never imported metadata.
 state=projectedNativeLocation(state,context);
 const s=state.simulation,i=state.realmPrototype?.instances?.[content.endpoint.instanceId],inside=state.actors?.player?.worldId===content.endpoint.worldId&&s?.people.player?.location==='Folded Glasshouse';
 const packing=s?.knowledge?.player?.[`${prefix}.packing`],research=s?.knowledge?.[joss]?.[`${scene}.private_research`];
 const inventory=context.gameplay?.player?.inventory||{},template=item('Sealing template');
 const templateOwned=inventory[template]>=1&&!Object.values(s?.custody||{}).some(c=>c.holder==='player'&&c.key===template);
 const deviceEligible=inside&&templateOwned&&packing?.basis?.kind==='instruction'&&stable(packing.cause)&&acquiredListener(state)&&!ownedDevice(state);
 const listenerEligible=inside&&(s?.people?.[joss]?.body?.form==null||s.people[joss].body.form==='human')&&i?.facts?.['scenes.shelfBuilt']===true&&i.facts['bench.open']===true&&research&&stable(research.cause)&&research.basis?.attributedTo===joss&&state.actors?.[joss]?.completed?.[`${scene}.private_research`]>0&&packing?.basis?.kind==='instruction'&&stable(packing.cause)&&!state.actors?.[joss]?.sources?.[sourceId];
 const support=pocketObservationSupport(state),l=currentLease(state),o=state.realmPrototype?.observation;
 const noticeDone=l&&o.state.receipts[l.noticeId],claimDone=l&&Object.values(o.state.receipts).some(r=>r.leaseId===l.id&&r.kind==='claim');
 const canActivate=!!state.realmPrototype&&!l&&Object.keys(o?.state.leases||{}).length<32&&!liveMeans(state).length;
 return {...context,facts:{...context.facts,
  'glasshouse.observation.listenerEligible':!!listenerEligible,'glasshouse.observation.deviceEligible':!!deviceEligible,
  'glasshouse.observation.canActivate':canActivate,'glasshouse.observation.liveSupported':support.active,
  'glasshouse.observation.sampleSupported':!!l&&!!o?.connection.open&&state.clock>=l.openedAt&&state.clock<l.expiresAt&&!liveMeans(state).length,
  'glasshouse.observation.detectionSupported':support.active&&!!l&&!l.detectionId,
  'glasshouse.observation.noticeSupported':support.active&&!!l?.detectionId&&!l.noticeId,
  'glasshouse.observation.returnSupported':support.active,'glasshouse.observation.canShutter':!!l&&ownedDevice(state)&&s.people.player.location==='Village'&&state.actors.player.worldId==='base.frontier'&&s.people.player.life==='alive'&&(s.people.player.body?.hands??2)>=2,
  'glasshouse.observation.claimSupported':support.active&&!!noticeDone&&!claimDone,
  'glasshouse.observation.localCooperation':inside&&ownedDevice(state)&&acquiredListener(state)&&anchorSupported(state)&&hasRecord(state,'player','notice')
 }};
}
export function previewPocketObservationAction(state,registry,actionId,context,previewCommand) {
 if(!state.simulation?.people?.player||!state.actors?.player)return {visible:false,eligible:false,reasons:[],costs:[],duration:0};
 assert(typeof previewCommand==='function','Inject the actual common preview.');state=projectedNativeLocation(state,context);context=pocketObservationContext(state,context);
 const support=pocketObservationSupport(state),o=state.realmPrototype?.observation;
 if(actionId===cmd('replay'))return {visible:!!o&&observationReplayView(o.state,'player').records.length>0,eligible:true,reasons:[],costs:[],duration:0};
 const d=pocketObservationDefinitions.commands.find(d=>d.id===actionId);if(!d||!publicNames.some(name=>cmd(name)===actionId))return {visible:false,eligible:false,reasons:['Unknown observation action.']};
 const result=previewCommand(state,registry,actionId,{...context,targetId:d.targetId||null});
 let visible=true;
 if(['earn_listener','craft_device','cooperate'].some(n=>cmd(n)===actionId))visible=state.actors.player.worldId===content.endpoint.worldId&&state.simulation.people.player.location==='Folded Glasshouse';
 else visible=state.actors.player.worldId==='base.frontier'&&state.simulation.people.player.location==='Village'&&ownedDevice(state);
 if(actionId===cmd('activate'))visible=visible&&!currentLease(state);
 if(actionId===cmd('activate')&&Object.keys(o?.state.leases||{}).length>=32)return {...result,visible,eligible:false,reasons:['This prototype retains all 32 viewing activations. No further lease is supported.']};
 if(actionId===cmd('shutter'))visible=visible&&!!currentLease(state);
 if(actionId===cmd('claim'))visible=visible&&support.active;
 if(d.once&&state.actors.player.completed?.[actionId])visible=false;
 return {...result,visible:visible&&result.visible,eligible:visible&&result.eligible};
}
function sampledRoomText(state) {
 const i=state.realmPrototype.instances[content.endpoint.instanceId],facts=i.facts;
 const frame=facts['repair.status']==='repaired'?'the frame is repaired':'the frame is still loose';
 const bench=facts['bench.open']===true?'the bench is uncovered':'the bench is covered';
 const shelf=facts['scenes.shelfBuilt']===true?'a calibration shelf stands by the frame':'no calibration shelf is fitted';
 const present=state.actors?.[joss]?.worldId===content.endpoint.worldId&&state.simulation?.people?.[joss]?.location==='Folded Glasshouse';
 return `Image snapshot at played minute ${state.clock}: ${frame}; ${bench}; ${shelf}; ${present?'Joss is present at the frame':'Joss is not in this sampled room'}. The image reveals no private stock or plans.`;
}
function carry(previous,next) {if(!previous)return next;for(const name of ['rewards','effects','nativeEffects'])if(Array.isArray(previous[name])&&Array.isArray(next[name]))next[name]=[...previous[name],...next[name]];return next;}
export function commitPocketObservationAction(state,registry,actionId,context,execute,expectedSequence=state.sequence) {
 assert(typeof execute==='function','Inject the actual common executor.');assert(expectedSequence===state.sequence,'Observation action is stale.');
 if(actionId===cmd('replay'))return {state:copy(state),external:copy(context.external||{}),gameplay:copy(context.gameplay||{}),rewards:[],effects:[],replay:pocketObservationView(state)};
 let out=null,next=projectedNativeLocation(copy(state),context);const executeAt=(name,actor='player')=>{
  const d=pocketObservationDefinitions.commands.find(d=>d.id===cmd(name));assert(d,'Bind observation command.');
  const actualContext=pocketObservationContext(next,{...context,actorId:actor,targetId:d.targetId||null,busy:actor==='player'?!!context.busy:false,
   external:out?.external||context.external,gameplay:out?.gameplay||context.gameplay,facts:{...context.facts,location:next.simulation.people[actor].location}});
  out=carry(out,execute(next,registry,{id:d.id},actualContext,next.sequence));next=out.state;
 };
 if(['earn_listener','craft_device','cooperate'].some(n=>cmd(n)===actionId)){executeAt(actionId.split('.').at(-1));validatePocketObservation(next);return out;}
 if(actionId===cmd('activate')){
  assert(next.realmPrototype,'Open and learn the actual Glasshouse first.');assert(!currentLease(next),'Close the old observation lease first.');
  assert(Object.keys(next.realmPrototype.observation?.state.leases||{}).length<32,'All 32 prototype viewing activations are retained; no new lease is supported.');assert(!liveMeans(next).length,liveMeans(next).join(' '));
  const old=next.realmPrototype.observation;next.realmPrototype.observation={connection:connectionAt(next.clock,(old?.connection.revision||0)+1,true),channel:copy(POCKET_OBSERVATION_CHANNEL),state:old?copy(old.state):createObservationChannelState()};
  let o=next.realmPrototype.observation,req=requestFor(next,'activation'),p=planObservationActivation(o.state,o.channel,o.connection,hostContext(next,context),req);assert(p.allowed,p.reasons.join(' '));
  executeAt('activate');next.realmPrototype.observation.state=p.nextState;
  for(const [name,planner,actor] of [['sample',planObservationSample,'player'],['detect',planObservationDetection,joss],['notice',planObservationNotice,joss]]){
   o=next.realmPrototype.observation;req=requestFor(next,name);if(name==='sample')req.text=sampledRoomText(next);p=planner(o.state,o.channel,o.connection,hostContext(next,{...context,external:out.external}),req);assert(p.allowed,p.reasons.join(' '));
   // The NPC notice has no target. Its declared knowledge explicitly addresses
   // player, so the common executor never invents cross-world co-location.
   executeAt(name,actor);next.realmPrototype.observation.state=p.nextState;
  }
 }else if(actionId===cmd('shutter')){assert(pocketObservationContext(next,context).facts['glasshouse.observation.canShutter'],'Reach your actual Village shutter first.');executeAt('shutter');closeState(next,'manual',context);}
 else if(actionId===cmd('claim')){
  assert(pocketObservationContext(next,context).facts['glasshouse.observation.claimSupported'],'A supported noticed live lease permits one deliberate claim.');
  // A later disclosure needs a new real current sample at this joined time.
  let o=next.realmPrototype.observation,req={...requestFor(next,'sample'),text:sampledRoomText(next)},p=planObservationSample(o.state,o.channel,o.connection,hostContext(next,context),req);assert(p.allowed,p.reasons.join(' '));executeAt('sample');next.realmPrototype.observation.state=p.nextState;
  o=next.realmPrototype.observation;req={...requestFor(next,'claim'),kind:'claim',disclosedBy:'player',recipientId:joss,text:'The sender deliberately claims to be a visiting artisan. This is not verified identity.'};
  p=planObservationIdentity(o.state,o.channel,o.connection,hostContext(next,context),req);assert(p.allowed,p.reasons.join(' '));executeAt('claim');next.realmPrototype.observation.state=p.nextState;
 }else throw Error('Unknown observation action.');
 validatePocketObservation(next);out.state=next;return out;
}
export function pocketObservationView(state) {
 const o=state.realmPrototype?.observation,support=pocketObservationSupport(state);
 const lastSample=o?Object.values(o.state.receipts).filter(r=>r.kind==='sample'&&r.recipients.includes('player')).sort((a,b)=>b.sequence-a.sequence)[0]:null;
 return {lastSampleAt:lastSample?.at??null,acquiredDevice:ownedDevice(state),active:support.active,expiresAt:support.expiresAt,
  remaining:support.active?Math.max(0,support.expiresAt-state.clock):0,records:o?observationReplayView(o.state,'player').records:[],
  description:support.active?`The channel is open, with the last sampled image at played minute ${lastSample?.at??'unknown'} and one supported notice. The open lease supports local time; it does not refresh the stored image. Your body and bag remain here.`:ownedDevice(state)?'Your paired device is shut. Remembered lines are read-only; the Glasshouse and its stock remain.':'Craft the paired device locally after the funded shelf and Joss’s actual listener calibration.'};
}
