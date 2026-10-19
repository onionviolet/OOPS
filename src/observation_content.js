import {all, eqNoReason as eq} from './basics.js';
import {commitSimulationCommand,enrollSimulation,previewSimulationCommand} from './simulation.js';
import {validateExpansionState} from './expansion_engine.js';
export const SUBJECT='observation.ilex',LENS='observation.lens',GAZE='observation.return_gaze',NOTICE='observation.return_notice',CUT='observation.inner_shutter';
const wood=JSON.stringify({id:'Rough wood log'}),kit=JSON.stringify({id:'Prepared survey kit'});
const phase=p=>eq(`situation.${LENS}.phase`,p), phases=(...ps)=>({any:ps.map(phase)});
const active=all(phases('open','answered'),eq(`situation.${LENS}.responseOpen`),eq('world.observation.lens_active'));
const fact=(key,value=true,actor)=>({type:'fact',scope:'actor',key,value,...(actor?{actor}:{})});
const live=value=>({type:'world',worldId:'base.frontier',key:'observation.lens_active',value});
const shift=(from,to)=>({type:'situation',situationId:LENS,operation:'advance',expected:Array.isArray(from)?from:[from],phase:to});
const know=(key,value,actor='player',kind='observation')=>({type:'knowledge',actor,key:`observation.${key}`,stage:kind==='instruction'?'understood':'seen',value,basis:{kind,attributedTo:SUBJECT,situationId:LENS}});
const command=d=>Object.fromEntries(Object.entries({revision:1,worldId:'base.frontier',actorId:'player',location:'Village',group:'observation',costs:[],effects:[],...d}).filter(([,v])=>v!==undefined));
export const observationSources=[{id:GAZE,revision:1,label:'Return Gaze',kind:'trait',grants:[]}];
export const observationDefinitions={
 people:[{id:SUBJECT,revision:1,label:'Visitor beyond the inner glass',worldId:'base.frontier',location:'Village',inventory:'simulation',provision:false,resources:{coins:0},body:{perceptualSupport:true},vitals:{health:20,max_health:20,stamina:10,max_stamina:10}}],
 powers:[{id:NOTICE,revision:1,label:'Send a return notice',model:'practice',capacity:1,cooldown:0,execution:all(eq(`faculty.${GAZE}.active`),eq('body.perceptualSupport'),eq('actor.life','alive'),active)}],
 situations:[{id:LENS,revision:1,label:'The returned gaze',context:{worldId:'base.frontier',instanceId:'frontier.main',continuityId:'frontier.branch',eraId:'frontier.present',regionId:'frontier.village'},
  privateTruth:{mechanism:'paired_live_lens',subject:SUBJECT,anonymous:true},participants:['player',SUBJECT],initialPhase:'open',responseWindow:12,phases:['open','answered','shuttered','cooperated','unanswered','met_shuttered','met_cooperated','met_unanswered']}],
 commands:[
  command({id:'observation.prepare',label:'Prepare the one public demonstration',once:true,requires:eq('knowledge.exchange.lens_lead.seen'),effects:[{type:'spawn',personId:SUBJECT,definitionId:SUBJECT},
   {type:'source',actor:SUBJECT,sourceId:GAZE,operation:'grant',origin:'acquired',awakened:true,active:true},{type:'power',actor:SUBJECT,powerId:NOTICE,operation:'learn'},{type:'item',actor:SUBJECT,key:kit,amount:1}]}),
  command({id:'observation.open',label:'Look through the paired glass · anonymous live view',once:true,requires:eq('knowledge.exchange.lens_lead.seen'),effects:[{type:'situation',situationId:LENS,operation:'begin'},live(true),
   know('opening','The lens samples a visitor behind an opaque screen. The paired inner terminal can write back; its preset shutter closes after twelve played minutes. The view carries pictures and messages, not a body.'),
   know('trace','A live sampling link reaches the outer terminal; no observer name was disclosed.',SUBJECT)]}),
  command({id:'observation.notice',label:'The subject writes a return notice into the live image',actorId:SUBJECT,powerId:NOTICE,location:undefined,audience:['$actor'],requires:active,effects:[shift('open','answered'),
   know('return_line','A line appears inside the image: “There is a listener at the outer glass.” The screen still blocks ordinary sight of you.'),know('notice','I detected the anonymous live sampling and sent one notice through its return path.',SUBJECT)]}),
  command({id:'observation.shutter',label:'Close the outer shutter · 1 log + 2 stamina',requires:all(active,eq('observation.handsUsable'),{fact:'strength',op:'gte',value:6},{fact:'vital.health',op:'gte',value:2}),visibleWhen:phases('open','answered'),
   costs:[{type:'item',key:wood,amount:-1},{type:'vital',key:'stamina',amount:-2}],effects:[live(false),{type:'world',worldId:'base.frontier',key:'observation.shutter_installed',value:true},shift(['open','answered'],'shuttered'),
   know('shutter','Your actual wooden shutter stopped the live sampling. You kept your identity private and received no kit.'),know('closure','The anonymous outer link was mechanically closed; its observer did not introduce themself.',SUBJECT)]}),
  command({id:'observation.cooperate',label:'Introduce yourself for calibration · 1 wooden coin',targetId:SUBJECT,coLocated:true,participants:['$target'],once:true,requires:active,visibleWhen:phases('open','answered'),
   costs:[{type:'resource',native:true,key:'money',amount:-1}],effects:[{type:'resource',actor:SUBJECT,key:'coins',amount:1},{type:'transfer',from:SUBJECT,to:'player',key:kit,count:1},live(false),shift(['open','answered'],'cooperated'),
    know('identity','The visitor introduced themself as the parcel fitter and paid for one calibration exchange.',SUBJECT),
    know('name','The visitor introduces himself as Ilex. You sent a claimed present identity through the terminal, not proof of your past.'),
    know('provenance','Ilex showed how a current sample differs from a stored impression. Closing the live channel stops new return notices; replay retains the earlier evidence. He gave his own one kit and kept your coin. This instruction is not Return Gaze ownership.','player','instruction'),
    {type:'relationship',actor:SUBJECT,target:'player',axis:'familiarity',amount:1,text:'Introduced as the parcel fitter and paid for one agreed calibration.'}]}),
  ...['shuttered','cooperated','unanswered'].map(route=>command({id:`observation.inspect_${route}`,label:'Return to the glass and inspect what remains',once:true,visibleWhen:phase(route),requires:phase(route),effects:[shift(route,`met_${route}`),
   know('later',route==='shuttered'?'The same outer shutter remains installed. The live link is closed; the visitor kept his kit and your identity was not disclosed.':route==='cooperated'?'Ilex recognizes the introduction and the agreed calibration. His one kit remains spent, his coin retained, and his faculty still his.':'The inner preset closed the stream. Its posted note says the demonstration ended; no exchange or promise was made. The visitor kept his kit.')]})),
  command({id:'observation.replay',label:'Read the stored impression · no live sampling',requires:phases('met_shuttered','met_cooperated','met_unanswered'),visibleWhen:phases('met_shuttered','met_cooperated','met_unanswered'),effects:[]})
 ],
 events:[{id:CUT,actorId:SUBJECT,revision:1,label:'The preset inner shutter closes',automatic:false,interval:1,chance:1,maxOccurrences:1,mode:'ambient',public:false,
  requires:all(phases('open','answered'),eq(`situation.${LENS}.responseOpen`,false),eq('world.observation.lens_active')),
  effects:[live(false),shift(['open','answered'],'unanswered')]}]
};
// A single external action stages all internal commands, then publishes once.
function carry(previous,next){if(!previous)return next;next.acquisitions=[...(previous.acquisitions||[]),...(next.acquisitions||[])];next.unlocks=[...(previous.unlocks||[]),...(next.unlocks||[])];if(previous.native&&!next.native)next.native=previous.native;return next;}
export function beginObservation(state,registry,context,expectedSequence=state.sequence){
 if(state.sequence!==expectedSequence)throw Error('This viewing request is stale.');
 let p=state.simulation?{state,external:context.external,gameplay:context.gameplay,vitals:context.vitals,equipment:context.equipment}:enrollSimulation(state,registry,context,expectedSequence);
 if(!p.state.simulation.people[SUBJECT])p=carry(p,commitSimulationCommand(p.state,registry,{id:'observation.prepare'},{...context,external:p.external,gameplay:p.gameplay,targetId:null}));
 p=carry(p,commitSimulationCommand(p.state,registry,{id:'observation.open'},{...context,external:p.external,gameplay:p.gameplay,targetId:null}));
 const npc={actorId:SUBJECT,external:p.external,gameplay:p.gameplay,vitals:p.vitals,equipment:p.equipment,facts:{location:'Village'}};
 if(previewSimulationCommand(p.state,registry,'observation.notice',npc).eligible)p=carry(p,commitSimulationCommand(p.state,registry,{id:'observation.notice'},npc));
 const r=p.state.simulation.situations[LENS];p.state.simulation.checks[CUT]={due:r.deadline,interval:1,rng:p.state.simulation.seed||1,count:0,definitionId:CUT,cause:r.receipts[0].cause};
 validateExpansionState(p.state,registry);return p;
}
export function commitObservationCommand(state,registry,command,context,expectedSequence=state.sequence){
 if(!['observation.shutter','observation.cooperate','observation.replay','observation.inspect_shuttered','observation.inspect_cooperated','observation.inspect_unanswered'].includes(command.id))throw Error('Unsupported viewing action.');
 const p=commitSimulationCommand(state,registry,command,context,expectedSequence),s=p.state.simulation;
 if(['observation.shutter','observation.cooperate'].includes(command.id)){const c=s.checks[CUT],r=s.situations[LENS];if(c?.definitionId===CUT&&c.cause===r.receipts[0].cause)delete s.checks[CUT];}
 validateExpansionState(p.state,registry);return p;
}
export function observationView(state){const known=state.simulation?.knowledge.player||{},r=state.simulation?.situations?.[LENS];return {introduced:!!known['observation.opening'],phase:r?.phase,deadline:r?.deadline,details:Object.entries(known).filter(([k])=>k.startsWith('observation.')).map(([key,v])=>({key,text:v.value,at:v.at,basis:v.basis}))};}
