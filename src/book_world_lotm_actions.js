// Early-Tingen Seer slice: decline or accept a supervised dose, learn one bounded
// method, observe real sample lots at finite cost, sleep to recover. Source
// patterns are pinned in the LOTM initiation plan (H1/H2 only). Everything else
// the plan lists as later (digestion, other paths, bad doses) is not exposed here.
import {LOTM_IDS as I,LOTM_LOCATIONS as L,LOTM_KEYS as K,LOTM_SAMPLES,LOTM_ENERGY,LOTM_PRACTICE_MINUTES,LOTM_OBSERVE_MINUTES,LOTM_SLEEP_MINUTES} from './book_world_lotm_ids.js';
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
const eq=(fact,value=true)=>({fact,op:'eq',value}),gte=(fact,value)=>({fact,op:'gte',value});
const all=(...rules)=>({all:rules});
const af=(key,value=true,actor='player')=>({type:'fact',scope:'actor',actor,key:`book.lotm.${key}`,value});
// Unknown facts never satisfy a rule, even under not(), so every flag is emitted explicitly by lotmFacts.
const has=(key,value=true)=>eq(`lotm.flag.${key}`,value),no=key=>has(key,false);
const item=(actor,key,amount,returned=false)=>({type:'item',actor,key,amount,...(returned?{reservationReturn:true}:{})});
const transfer=(from,to,key,count=1)=>({type:'transfer',from,to,key,count});
const attention=(amount=-1)=>({type:'resource',actor:I.supervisor,key:'book.lotm.attention',amount});
const use=()=>({type:'energy',energyId:I.energy,operation:'use',output:LOTM_ENERGY.output,control:LOTM_ENERGY.control});
const know=(key,value,attributedTo='player',actor='player',kind='observation',stage='seen')=>({type:'knowledge',actor,key:`book.lotm.${key}`,stage,value,basis:{kind,attributedTo,situationId:I.situation}});
const present=all(eq('lotm.enrolled'),eq('lotm.supervisorHere')),ready=all(present,has('reportedIn'));
function cmd(id,label,location,d={}){
 const {alone,entry,...rest}=d,requires=all(alone?eq('lotm.enrolled'):entry?present:ready,...(d.requires?[d.requires]:[]));
 return {id:`book.lotm.${id}`,revision:1,label,group:'book_lotm',actorId:'player',worldId:I.world,location,once:true,costs:[],effects:[],visibleWhen:d.visibleWhen||requires,...rest,requires,
  ...(d.costs?.length||d.duration)&&d.once!==false?{claim:`book.lotm.receipt.${id}`}:{},...d.targetId?{coLocated:true,participants:['$target']}:{}};
}
const sample=name=>K[name];
const findings={
 comparator:'Through the learned channel this ordinary comparator showed no signal. A negative reading here is a limited observation: it is not proof the material is safe, unpoisoned or unwatched.',
 sampleA:'Through the learned channel this lot showed a signal at the material. You can say that it is present and where it sits, not what it is made of, whether it is safe, or who prepared it.',
 sampleB:'Through the learned channel this second lot showed a different signal at the material. As before, the reading is limited: no identity, recipe or safety follows from it.'};
const sampleCommands=LOTM_SAMPLES.flatMap(name=>[
 cmd(`take_${name}`,`Take the ${name==='comparator'?'ordinary comparator':'supported sample lot '+name.slice(-1)} from the supervisor's bench`,L.workroom,{targetId:I.supervisor,requires:no(`took.${name}`),
  costs:[transfer(I.supervisor,'player',sample(name))],effects:[af(`took.${name}`)]}),
 cmd(`observe_${name}`,`Observe the ${name==='comparator'?'ordinary comparator':'sample lot '+name.slice(-1)} · 1 spirituality, ${LOTM_OBSERVE_MINUTES} min`,L.workroom,
  {requires:all(eq('lotm.methodSupported'),has(`took.${name}`),no(`returned.${name}`),gte(`lotm.holds.${name}`,1)),duration:LOTM_OBSERVE_MINUTES,cancellation:'none',powerId:I.method,
   costs:[use(),item('player',sample(name),-1)],effects:[item('player',sample(name),1,true),af(`observed.${name}`),know(`finding.${name}`,findings[name])]}),
 cmd(`return_${name}`,`Return the ${name==='comparator'?'comparator':'sample lot '+name.slice(-1)} with your finding`,L.workroom,{targetId:I.supervisor,requires:all(has(`observed.${name}`),no(`returned.${name}`),gte(`lotm.holds.${name}`,1)),
  costs:[transfer('player',I.supervisor,sample(name))],effects:[af(`returned.${name}`),
   know(`received.${name}`,'The probationer returned the sample with a limited finding. I hold the material again and the attributed note; it does not certify safety.','player',I.supervisor,'instruction','understood')]})]);
export const lotmCommands=freeze([
 cmd('report_in','Report to the supervisor in the workroom and read the terms',L.workroom,{entry:true,targetId:I.supervisor,requires:no('reportedIn'),
  effects:[{type:'situation',situationId:I.situation,operation:'begin'},af('reportedIn')]}),
 cmd('accept_allocation','Accept the supervisor\'s allocated prepared dose (no faculty yet)',L.workroom,{targetId:I.supervisor,requires:all(no('allocated'),no('ingested'),gte('lotm.supplierDoses',1)),
  costs:[transfer(I.supervisor,'player',K.dose)],effects:[af('allocated'),know('terms','One prepared dose now sits in your hands under the supervisor\'s allocation. Taking it into your body is a separate, irreversible step: you can still decline, and holding it grants nothing. Disturbed senses and trouble focusing follow ingestion; guided attention on a familiar object eases them. Supervision is not a guarantee for every recipient.','player','player','instruction','understood')]}),
 cmd('decline','Decline the dose and keep your ordinary clerical work',L.workroom,{once:false,requires:all(no('ingested')),effects:[af('declined'),know('declined','You declined. Nothing was spent and no faculty was granted; your post and the supervisor\'s goodwill are unchanged. The offer stands only while the supervisor still holds the dose.')]}),
 cmd('ingest','Take the dose under supervision (irreversible, one short guided attention)',L.workroom,{targetId:I.supervisor,requires:all(has('allocated'),no('ingested'),gte('lotm.holds.dose',1)),
  costs:[item('player',K.dose,-1)],
  effects:[{type:'source',actor:'player',sourceId:I.source,operation:'grant',origin:'acquired',awakened:true,active:true},
   {type:'energy',energyId:I.energy,operation:'learn',policy:LOTM_ENERGY},{type:'energy',energyId:I.energy,operation:'recover',amount:LOTM_ENERGY.capacity,cooling:0},
   af('ingested'),af('stabilized'),
   know('stabilized','The dose is gone for good. Senses flared, whispers pressed in, and holding your attention on a familiar object under the supervisor\'s guidance brought them down. You hold a Seer source but no method: control is taught, not given. This reading shows what happened to one supervised body, not that every novice is safe.','player','player','observation','understood')]}),
 cmd('lesson','Take the control lesson: learn bounded material perception · 1 spirituality, '+LOTM_PRACTICE_MINUTES+' min',L.workroom,{targetId:I.supervisor,
  requires:all(has('stabilized'),no('methodLearned'),eq('lotm.sourceSupported'),gte('lotm.supervisorAttention',1)),duration:LOTM_PRACTICE_MINUTES,cancellation:'forfeit',
  costs:[use(),attention()],effects:[{type:'power',actor:'player',powerId:I.method,operation:'learn'},af('methodLearned'),
   know('method','You can now deliberately look at one material in front of you and end the sight. It costs spirituality and tires you; it shows presence at the material, not identity, safety or future. Ending the sight stops new cost; it does not undo fatigue.','player','player','instruction','understood')]}),
 ...sampleCommands,
 cmd('sleep','Sleep at your lodging to recover spirituality and cool strain · '+LOTM_SLEEP_MINUTES+' min',L.lodging,{alone:true,once:false,requires:all(has('reportedIn'),eq('lotm.sourceSupported'),eq('lotm.restPlace')),visibleWhen:all(eq('lotm.enrolled'),has('ingested')),
  duration:LOTM_SLEEP_MINUTES,cancellation:'forfeit',effects:[{type:'energy',energyId:I.energy,operation:'recover',amount:LOTM_ENERGY.capacity,cooling:LOTM_ENERGY.strainLimit}]})
]);
export const lotmSources=freeze([{id:I.source,revision:1,label:'Seer source (initiated)',kind:'trait',origin:'acquired',grants:[],bioDetail:'One consumed supervised dose. Source ownership is separate from control, strain and any later digestion; none of those follows from it alone.'}]);
export const lotmPowers=freeze([{id:I.method,revision:1,label:'Material perception',model:'practice',capacity:1,worlds:[I.world],cooldown:0,execution:all(eq('lotm.methodSupported')),description:'A taught, bounded sight at one material. Presence only: no identity, safety or foresight. Costs spirituality and adds strain per use.'}]);
export const lotmEnergies=freeze([LOTM_ENERGY]);
const LOTM_FLAGS=['reportedIn','allocated','declined','ingested','stabilized','methodLearned',...LOTM_SAMPLES.flatMap(n=>[`took.${n}`,`observed.${n}`,`returned.${n}`])];
export function lotmFacts(state,ctx={}){
 const s=state.simulation||{},p=s.people?.player,sup=s.people?.[I.supervisor],f={};
 const alive=x=>x?.life==='alive'&&x.body?.form==='human'&&(x.body.hands??0)>=2&&x.body.mobile===true;
 const enrolled=state.actors?.player?.worldId===I.world&&alive(p);
 f['lotm.enrolled']=enrolled;
 for(const name of LOTM_FLAGS)f[`lotm.flag.${name}`]=state.actors?.player?.facts?.[`book.lotm.${name}`]===true;
 f['lotm.supervisorHere']=enrolled&&alive(sup)&&state.actors?.[I.supervisor]?.worldId===I.world&&sup.location===p.location;
 const src=state.actors?.player?.sources?.[I.source],fac=s.faculties?.player?.[I.source];
 f['lotm.sourceSupported']=enrolled&&!!src&&(src.expiresAt==null||src.expiresAt>state.clock)&&fac?.awakened===true&&fac.active===true&&!fac.suppressed;
 f['lotm.methodSupported']=f['lotm.sourceSupported']&&s.powers?.player?.[I.method]?.owned===true;
 f['lotm.restPlace']=enrolled&&p.location===L.lodging;
 const inv=ctx.gameplay?.player?.inventory||{},natural=ctx.lotmNative?.stock||{};
 f['lotm.holds.dose']=inv[K.dose]||0;for(const n of LOTM_SAMPLES)f[`lotm.holds.${n}`]=inv[K[n]]||0;
 f['lotm.supplierDoses']=natural[I.lot]?.[K.dose]??ctx.gameplay?.[I.supervisor]?.inventory?.[K.dose]??0;
 f['lotm.supervisorAttention']=state.actors?.[I.supervisor]?.resources?.['book.lotm.attention']??0;
 return f;
}
export const lotmContext=(state,ctx={})=>({...ctx,facts:{...ctx.facts,...lotmFacts(state,ctx)}});
