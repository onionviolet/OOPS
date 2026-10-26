// Early-Tingen Seer slice: decline or accept a supervised dose, learn one bounded
// method, observe real sample lots at finite cost, sleep to recover. Source
// patterns are pinned in the LOTM initiation plan (H1/H2 only). Everything else
// the plan lists as later (other paths, bad doses, loss of control) is not exposed here.
// Digestion and the Sequence 8 promotion follow LTS11-LTS14: acting in role, an
// institutional assessment, then one more atomic ingestion.
import {LOTM_IDS as I,LOTM_LOCATIONS as L,LOTM_KEYS as K,LOTM_SAMPLES,LOTM_ENERGY,LOTM_PRACTICE_MINUTES,LOTM_OBSERVE_MINUTES,LOTM_SLEEP_MINUTES,LOTM_READING_MINUTES,LOTM_DIGEST_ACTS,LOTM_CC_ACTS,LOTM_CC_LAYING_MINUTES,LOTM_CC_VIGIL_MINUTES} from './book_world_lotm_ids.js';
import {freeze,eq,gte,all,not,af,has,no,item,transfer,attention,use,know,present,ready,cmd} from './book_world_lotm_kit.js';
import {examinationCommand,examFacts,pathwayCommands,pathwayFlags,pathwaySources,pathwayFacts,flagOf} from './book_world_lotm_pathways.js';
import {pathwayRows,allRows} from './book_world_lotm_rows.js';
import {generatedRows,generatedCommands} from './book_world_lotm_generated.js';
import {abilityCommands} from './book_world_lotm_abilities.js';
import {brewCommands,brewFlags,brewFacts} from './book_world_lotm_brew.js';
import {benchCommands,benchFlags,benchFacts} from './book_world_lotm_bench.js';
import {causeCommands,causeSteadyCommand,causeFlags,causeFacts} from './book_world_lotm_causes.js';
import {brokerCommands,lotFlags,brokerFacts} from './book_world_lotm_broker.js';
import {clearanceCommands,clearanceFacts,LOTM_ROLE_OF} from './book_world_lotm_clearance.js';
import {lifeCommands,LOTM_PROFILES,profileKeyOf,weeksOwed} from './book_world_lotm_lives.js';
import {LOTM_DISTRICTS,districtOfPlace,districtCommands,districtFacts,onShift} from './book_world_lotm_districts.js';
const acted=()=>({type:'resource',actor:'player',key:'book.lotm.acting',amount:1}),undigested=not(gte('lotm.acting',LOTM_DIGEST_ACTS));
const sample=name=>K[name];
const findings={
 comparator:'Through the learned channel this ordinary comparator showed no signal. A negative reading here is a limited observation: it is not proof the material is safe, unpoisoned or unwatched.',
 sampleA:'Through the learned channel this lot showed a signal at the material. You can say that it is present and where it sits, not what it is made of, whether it is safe, or who prepared it.',
 sampleB:'Through the learned channel this second lot showed a different signal at the material. As before, the reading is limited: no identity, recipe or safety follows from it.'};
const sampleCommands=LOTM_SAMPLES.flatMap(name=>[
 cmd(`take_${name}`,`Take the ${name==='comparator'?'ordinary comparator':'supported sample lot '+name.slice(-1)} from the supervisor's bench`,L.workroom,{targetId:I.supervisor,requires:all(eq('lotm.beyonderTrack'),no(`took.${name}`)),
  costs:[transfer(I.supervisor,'player',sample(name))],effects:[af(`took.${name}`)]}),
 cmd(`observe_${name}`,`Observe the ${name==='comparator'?'ordinary comparator':'sample lot '+name.slice(-1)} · 1 spirituality, ${LOTM_OBSERVE_MINUTES} min`,L.workroom,
  {requires:all(eq('lotm.methodSupported'),has(`took.${name}`),no(`returned.${name}`),gte(`lotm.holds.${name}`,1)),duration:LOTM_OBSERVE_MINUTES,cancellation:'none',powerId:I.method,
   costs:[use(),item('player',sample(name),-1)],effects:[item('player',sample(name),1,true),af(`observed.${name}`),know(`finding.${name}`,findings[name])]}),
 cmd(`return_${name}`,`Return the ${name==='comparator'?'comparator':'sample lot '+name.slice(-1)} with your finding`,L.workroom,{targetId:I.supervisor,requires:all(has(`observed.${name}`),no(`returned.${name}`),gte(`lotm.holds.${name}`,1)),
  costs:[transfer('player',I.supervisor,sample(name))],effects:[af(`returned.${name}`),
   know(`received.${name}`,'The probationer returned the sample with a limited finding. I hold the material again and the attributed note; it does not certify safety.','player',I.supervisor,'instruction','understood')]})]);
const baseCommands=[
 cmd('report_in','Report to the supervisor in the workroom and read the terms',L.workroom,{entry:true,targetId:I.supervisor,requires:all(eq('lotm.home.evernight'),no('reportedIn')),
  effects:[{type:'situation',situationId:I.situation,operation:'begin'},af('reportedIn')]}),
 cmd('accept_allocation','Accept the supervisor\'s allocated Seer dose (no faculty yet; one pathway per life, switching is a stated cause of loss of control)',L.workroom,{targetId:I.supervisor,visibleWhen:all(ready,eq('lotm.beyonderTrack'),eq('lotm.home.evernight'),no('allocated'),no('ingested'),eq('lotm.ingestedAny',false)),requires:all(eq('lotm.beyonderTrack'),eq('lotm.home.evernight'),no('allocated'),no('ingested'),eq('lotm.pathChosen',false),gte('lotm.supplierDoses',1)),
  costs:[transfer(I.supervisor,'player',K.dose)],effects:[af('allocated'),know('terms','One prepared dose now sits in your hands under the supervisor\'s allocation. Taking it into your body is a separate, irreversible step: you can still decline, and holding it grants nothing. Disturbed senses and trouble focusing follow ingestion; guided attention on a familiar object eases them. Supervision is not a guarantee for every recipient.','player','player','instruction','understood')]}),
 cmd('decline','Decline the dose and keep your ordinary clerical work',L.workroom,{once:false,requires:all(eq('lotm.beyonderTrack'),eq('lotm.ingestedAny',false)),effects:[af('declined'),know('declined','You declined. Nothing was spent and no faculty was granted; your post and the supervisor\'s goodwill are unchanged. The offer stands only while the supervisor still holds the dose.')]}),
 cmd('ingest','Take the dose under supervision (irreversible, one short guided attention)',L.workroom,{targetId:I.supervisor,requires:all(has('allocated'),no('ingested'),gte('lotm.holds.dose',1),eq('lotm.block.seer.wrongPotion',false)),
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
 // Seer acting principle: peek at fate, but fear it. Each act is one completed role, not a meter tick.
 cmd('act_reading','Answer a client from the request ledger with a hedged reading · 1 spirituality, '+LOTM_READING_MINUTES+' min',L.workroom,{once:false,
  requires:all(eq('lotm.methodSupported'),has('methodLearned'),undigested),duration:LOTM_READING_MINUTES,cancellation:'forfeit',powerId:I.method,
  costs:[use()],effects:[acted(),know('acting.reading','You read for a client and kept it vague: a hint, never a promise. Staying inside the Seer\'s role, curious about fate but wary of it, settles something in you a little more each time.','player','player','observation','understood')]}),
 cmd('act_refusal','Refuse a ledger request to divine someone far above your station',L.workroom,{requires:all(has('methodLearned'),no('refusedHigh'),undigested),
  effects:[af('refusedHigh'),acted(),know('acting.refusal','You turned down the request to look at a powerful person. Fearing what fate might show is also part of the role, and that restraint counted.','player','player','observation','understood')]}),
 cmd('request_assessment','Ask Warden Hale to pre-screen your digestion before the Nighthawk examination',L.workroom,{targetId:I.supervisor,
  requires:all(eq('lotm.digested'),no('assessed'),gte('lotm.supervisorAttention',1)),costs:[attention()],
  effects:[af('assessed'),af('exam.required'),know('assessment','Hale judged the potion digested in a local pre-screen. The Nighthawk senior deacon must examine you before a Clown dose is released.','player','player','instruction','understood')]}),
 cmd('ingest_clown','Drink the prepared Clown dose (irreversible: Sequence 8)',L.workroom,{targetId:I.supervisor,
  requires:all(has('assessed'),eq('lotm.exam.seer.released'),no('promoted'),eq('lotm.digested'),eq('lotm.sourceSupported'),gte('lotm.holds.clownDose',1),eq('lotm.block.seer.wrongPotion',false)),costs:[item('player',K.clownDose,-1)],
  effects:[{type:'source',actor:'player',sourceId:I.clown,operation:'grant',origin:'acquired',awakened:true,active:true},af('promoted'),
   know('promoted','The Clown potion is gone for good. The same whispers rose and passed. Your body answers faster and steadier, and your face holds whatever you set on it. This Sequence needs digesting in turn, by its own role.','player','player','observation','understood')]}),
 ...pathwayRows.flatMap(pathwayCommands),
 ...allRows.filter(r=>r.exam).map(examinationCommand),
 ...brewCommands,
 ...benchCommands,
 ...districtCommands,
 ...lifeCommands,
 ...clearanceCommands,
 ...abilityCommands,
 ...brokerCommands,
 ...pathwayRows.flatMap(causeCommands),causeSteadyCommand,
 ...generatedRows.flatMap(generatedCommands),
 cmd('sleep','Sleep at your lodging to recover spirituality and cool strain · '+LOTM_SLEEP_MINUTES+' min',L.lodging,{alone:true,once:false,requires:all(has('reportedIn'),eq('lotm.sourceSupported'),eq('lotm.restPlace')),visibleWhen:all(eq('lotm.enrolled'),has('ingested')),
  duration:LOTM_SLEEP_MINUTES,cancellation:'forfeit',effects:[{type:'energy',energyId:I.energy,operation:'recover',amount:LOTM_ENERGY.capacity,cooling:LOTM_ENERGY.strainLimit}]})
];
// Vouched acts in another church's district (the primary lane's Q2 mechanism, kept byte-for-byte on costs, effects and timing): Hale is not there, the team on
// duty supervises, and Hale's attention pays the district row's vouch. Built from the base act, so the same verb costs more away from home. Evernight lives only.
const baseCmd=id=>baseCommands.find(c=>c.id===`book.lotm.${id}`);
const districtRule={act_reading:all(eq('lotm.methodSupported'),has('methodLearned'),undigested),act_laying_out:all(eq('lotm.ccSupported'),has('cc.stabilized'),not(gte('lotm.cc.acting',LOTM_CC_ACTS)))};
const districtCost={act_reading:[use()],act_laying_out:[]},districtPower={act_reading:I.method};
const districtActCommands=LOTM_DISTRICTS.flatMap(d=>Object.entries(d.vouch).map(([base,spec])=>{
 const b=baseCmd(base),rule=districtRule[base],why=`${d.q2team} supervise at the ${d.qlabel.toLowerCase()}. Hale vouched for you and spent ${spec.cost} of his attention. ${d.why}`;
 return cmd(`${base}_${d.alias}`,spec.label,d.places[0],{alone:true,once:false,visibleWhen:all(eq('lotm.enrolled'),eq('lotm.home.evernight'),has('reportedIn'),eq(`lotm.district.${d.alias}.here`),rule),
  requires:all(eq('lotm.home.evernight'),has('reportedIn'),rule,eq(`lotm.district.${d.alias}.supervised`),gte('lotm.supervisorAttention',spec.cost)),duration:b.duration,cancellation:b.cancellation,...districtPower[base]?{powerId:districtPower[base]}:{},
  costs:[...districtCost[base],attention(-spec.cost)],effects:[...b.effects,know('district.act',`${why} (${d.claim})`)]});}));
export const lotmCommands=freeze([...baseCommands,...districtActCommands]);
export const lotmPowers=freeze([{id:I.method,revision:1,label:'Material perception',model:'practice',capacity:1,worlds:[I.world],cooldown:0,execution:all(eq('lotm.methodSupported')),description:'A taught, bounded sight at one material. Presence only: no identity, safety or foresight. Costs spirituality and adds strain per use.'}]);
export const lotmEnergies=freeze([LOTM_ENERGY]);
export const lotmSources=freeze([{id:I.source,revision:1,label:'Seer source (initiated)',kind:'trait',origin:'acquired',grants:[],bioDetail:'One consumed supervised dose. Source ownership is separate from control, strain and any later digestion; none of those follows from it alone.'},
 {id:I.clown,revision:1,label:'Clown source (Sequence 8)',kind:'trait',origin:'acquired',grants:[],bioDetail:'A second consumed dose after an assessed digestion. Canon grants fine body coordination, combat intuition and facial control; the Tingen slice has no fight or performance that reads them yet.'},
 ...pathwayRows.flatMap(pathwaySources),...generatedRows.flatMap(pathwaySources)]);
const LIFE_FLAGS=['contract.signed','sealed.held',...lotFlags,...causeFlags];
const DISTRICT_FLAGS=LOTM_DISTRICTS.map(d=>`endorsed.${d.id}`);
const LOTM_FLAGS=['reportedIn','allocated','declined','ingested','stabilized','methodLearned','refusedHigh','assessed','exam.required','examined','promoted',...pathwayRows.flatMap(pathwayFlags),...generatedRows.flatMap(pathwayFlags),...brewFlags,...benchFlags,...DISTRICT_FLAGS,...LIFE_FLAGS,...LOTM_SAMPLES.flatMap(n=>[`took.${n}`,`observed.${n}`,`returned.${n}`])];
export function lotmFacts(state,ctx={}){
 const s=state.simulation||{},p=s.people?.player,sup=s.people?.[I.supervisor],f={};
 const alive=x=>x?.life==='alive'&&x.body?.form==='human'&&(x.body.hands??0)>=2&&x.body.mobile===true;
 const enrolled=state.actors?.player?.worldId===I.world&&alive(p);
 f['lotm.enrolled']=enrolled;
 const flag=n=>state.actors?.player?.facts?.[`book.lotm.${n}`]===true;
 for(const name of LOTM_FLAGS)f[`lotm.flag.${name}`]=flag(name);
 f['lotm.supervisorHere']=enrolled&&alive(sup)&&state.actors?.[I.supervisor]?.worldId===I.world&&sup.location===p.location;
 // District layer (Q2): the officer of the district the body stands in, present only when their own entity exists in this save.
 const here=enrolled?districtOfPlace(p.location):null,off=here&&s.people?.[here.officerId];
 f['lotm.officerHere']=!!here&&alive(off)&&state.actors?.[here.officerId]?.worldId===I.world&&off.location===p.location&&onShift(here,state.clock);
 Object.assign(f,districtFacts(state,enrolled));
 f['lotm.officerAttention']=here?state.actors?.[here.officerId]?.resources?.['book.lotm.attention']??0:0;
 for(const d of LOTM_DISTRICTS)f[`lotm.district.${d.id}`]=here?.id===d.id;
 for(const [k,place] of Object.entries(L))f[`lotm.at.${k}`]=enrolled&&p.location===place;
 f['lotm.ready']=f['lotm.supervisorHere']&&flag('reportedIn');f['lotm.readyAtOfficer']=f['lotm.officerHere']&&flag('reportedIn');
 const src=state.actors?.player?.sources?.[I.source],fac=s.faculties?.player?.[I.source];
 f['lotm.sourceSupported']=enrolled&&!!src&&(src.expiresAt==null||src.expiresAt>state.clock)&&fac?.awakened===true&&fac.active===true&&!fac.suppressed;
 f['lotm.methodSupported']=f['lotm.sourceSupported']&&s.powers?.player?.[I.method]?.owned===true;
 f['lotm.restPlace']=enrolled&&p.location===L.lodging;
 const inv=ctx.gameplay?.player?.inventory||{},natural=ctx.lotmNative?.stock||{};
 f['lotm.holds.dose']=inv[K.dose]||0;for(const n of LOTM_SAMPLES)f[`lotm.holds.${n}`]=inv[K[n]]||0;
 f['lotm.supplierDoses']=natural[I.lot]?.[K.dose]??ctx.gameplay?.[I.supervisor]?.inventory?.[K.dose]??0;
 const acting=state.actors?.player?.resources?.['book.lotm.acting']||0;
 f['lotm.acting']=acting;f['lotm.digested']=acting>=LOTM_DIGEST_ACTS;f['lotm.holds.clownDose']=inv[K.clownDose]||0;
 examFacts(allRows[0],state,f);
 for(const row of [...pathwayRows,...generatedRows])pathwayFacts(row,state,f,{inv,flag});
 // One pathway per life: any allocation or ingestion elsewhere closes the other offers.
 // Generated rows (DWF139) count for choice and ingestion but not for the wrong-potion held set: holding a brewed dose is harmless, drinking it is the act.
 const chosenRows=[...allRows,...generatedRows],rows=chosenRows.map(r=>[flagOf(r,'allocated'),flagOf(r,'ingested'),flagOf(r,'brew.started')]);
 // The primary lane's block facts (kept additively): another pathway's allocation, ingestion or source blocks switching; holding another pathway's dose blocks the step (wrong potion).
 for(const P of allRows){const others=allRows.filter(Q=>Q!==P),othersChosen=chosenRows.filter(Q=>Q!==P),srcOf=Q=>Q.key==='seer'?I.source:Q.base,held=Q=>(inv[K[Q.holds.base]]||0)>0||(inv[K[Q.holds.next]]||0)>0;
  f[`lotm.other.${P.pid}.allocated`]=othersChosen.some(Q=>flag(flagOf(Q,'allocated'))||flag(flagOf(Q,'brew.started')));f[`lotm.other.${P.pid}.ingested`]=othersChosen.some(Q=>flag(flagOf(Q,'ingested'))||!!state.actors?.player?.sources?.[srcOf(Q)]);
  f[`lotm.block.${P.pid}.switching`]=f[`lotm.other.${P.pid}.allocated`]||f[`lotm.other.${P.pid}.ingested`];f[`lotm.block.${P.pid}.wrongPotion`]=others.some(held);}
 f['lotm.pathChosen']=rows.some(([a,i,b])=>flag(a)||flag(i)||flag(b));f['lotm.ingestedAny']=rows.some(([,i])=>flag(i));brewFacts(state,f);benchFacts(state,f,{inv,brokerInv:ctx.gameplay?.[I.broker]?.inventory||{}});
 const profile=enrolled?profileKeyOf(state):null;
 for(const k of Object.keys(LOTM_PROFILES))f[`lotm.profile.${k}`]=profile===k;
 for(const d of LOTM_DISTRICTS)f[`lotm.home.${d.id}`]=!!profile&&LOTM_PROFILES[profile].home===d.id;
 f['lotm.beyonderTrack']=!!profile&&LOTM_PROFILES[profile].beyonderTrack;f['lotm.weeksOwed']=enrolled?weeksOwed(state):0;
 const peopleAt=enrolled?Object.keys(LOTM_ROLE_OF).filter(id=>state.actors?.[id]?.worldId===I.world&&alive(s.people?.[id])&&s.people[id].location===p.location):[];
 clearanceFacts(state,f,{profile,ingested:f['lotm.ingestedAny'],here:enrolled,peopleAt});
 f['lotm.holds.sealed3']=inv[K.sealed3]||0;
 causeFacts(state,f);
 for(const r of pathwayRows)if(r.market)for(const n of [r.market.baseHold,r.market.nextHold])f[`lotm.holds.${n}`]=inv[K[n]]||0;
 for(const n of ['frog','hairs','ink'])f[`lotm.holds.${n}`]=inv[K[n]]||0;
 if(enrolled)brokerFacts(state,f,{alive,enrolled,player:p,inventory:ctx.gameplay?.[I.broker]?.inventory||{}});else{f['lotm.brokerHere']=false;f['lotm.escrow']=0;}
 for(const id of [I.supervisor,I.stormOfficer,I.machineryOfficer,I.seniorDeacon,I.stormDeacon,I.evernightDeacon,I.member])f[`lotm.attention.${id}`]=state.actors?.[id]?.resources?.['book.lotm.attention']??0;
 f['lotm.supervisorAttention']=state.actors?.[I.supervisor]?.resources?.['book.lotm.attention']??0;
 return f;
}
export const lotmContext=(state,ctx={})=>({...ctx,facts:{...ctx.facts,...lotmFacts(state,ctx)}});
