// Original review prototypes. These opt-in local requests reuse the existing
// residents, native stock, credits, body, sites, jobs and durable publisher.
// Import, preview and rendering create no demand, reward, fund or inventory.
import {all, deepFreeze as freeze, eqNoReason as eq, gte} from './basics.js';
import {NESTED_IDS as I,NESTED_LOCATIONS as L,NESTED_KEYS as K,NESTED_MISSIONS} from './feature_expansion_nested_content.js';
import {assert,natural,copy} from './simulation_contracts.js';
import {previewSimulationCommand,commitSimulationCommand,cancelSimulationJob} from './simulation.js';
import {itemActorFirst as item, staminaActorFirst as stamina, transferCount as transfer} from './content_kit.js';

const flag=(name,key,value=true)=>({type:'fact',scope:'actor',actor:'player',key:`nested.life.${name}.${key}`,value});
const worldFlag=(world,key,value=true)=>({type:'world',worldId:world,key:`nested.life.${key}`,value});
const credit=(actor,amount)=>({type:'resource',actor,key:'nested.credit',amount});
const demand=(actor,name,amount)=>({type:'resource',actor,key:`nested.life.${name}.demand`,amount});
const know=(name,key,value)=>({type:'knowledge',actor:'player',key:`nested.life.${name}.${key}`,stage:'seen',value});
const f=(name,key,value=true)=>eq(`nested.life.${name}.${key}`,value);
const offer=name=>`nested.life.${name}.offer`,work=name=>`nested.life.${name}.work`;
const claim=(actor,key,operation)=>({type:'claim',actor,key,operation});
const specs=freeze([
 {name:'lin',actor:I.employee,world:I.hub,location:L.hub,site:I.hubSite,wage:3,duration:4,label:'Lin’s one supply request',
  terms:'Lin offers three of her existing credits for one supply kit. Your one owned log and rope become Lin’s kit. This request grants no staff approval, affection, mission fee or replenished purse.',
  texture:'Lin leaves the desk lantern burning while she straightens the parcel tags. A cup has gone cold beside the family-message table; she wants the evening shift to end quietly.',
  output:'lin.kitMade',costs:[item('player',K.log,-1),item('player',K.rope,-1)],effects:[item(I.employee,K.kit,1)],
  result:'Your counted log and rope became one actual Lin-owned survey kit. Three reserved Lin credits paid your purse; her ordinary staff-supply sale can use the kit under its existing approval and price.',
  refused:'You declined Lin’s one supply request. No material, wage or friendship was transferred, and her finite request closed without changing any mission or paid shift.',
  account:'Lin shows the kit supply receipt and the three-credit wage receipt. Her remaining kits and funds still belong to her; staff approval and later purchases remain separate.'},
 {name:'brin',actor:I.foreman,world:I.salt,location:L.enginehouse,site:I.saltSite,wage:2,duration:3,label:'Brin’s one maintenance request',
  terms:'Brin offers two existing credits for one maintained spare kit, made from your counted log and rope with your reusable kit. It belongs to Brin until a separate paid transfer. Export, water repair and old debts stay separate.',
  texture:'Brin knocks the grit out of a boot before stepping inside. The pressure wheel keeps its old uneven tick; he counts the next maintenance turn rather than announcing a new crisis.',
  output:'brin.kitMade',costs:[item('player',K.log,-1),item('player',K.rope,-1),item('player',K.kit,-1)],effects:[item('player',K.kit,1,true),item(I.foreman,K.kit,1)],
  result:'Your log and rope became one actual Brin-owned spare survey kit; your original reusable kit returned. Two reserved Brin credits paid your purse. His actual source work can use the spare, or you may buy one kit through the separately quoted once-only transfer.',
  refused:'You declined Brin’s one maintenance request. His native stock and purse remain his, the demand closes, and no export, water outcome or older repair duty was changed.',
  account:'Brin shows the maintained-spare receipt and the two-credit local wage. This was a supplies job, not another export settlement or a declaration that the water account is now good.'},
 {name:'ivo',actor:I.witness,world:I.archive,location:L.records,site:I.archiveSite,wage:1,duration:4,label:'Ivo’s one shelf request',
  terms:'Ivo offers one existing credit for a small sorting shelf made from your counted log and rope, using your reusable kit. The fixture stays here and opens one limited organized tool exchange. It grants no office, corrected testimony or mission reward.',
  texture:'Ivo squares a stack of ordinary returns without looking up at the disputed ledger. Someone has drawn a tiny lamp in the margin of an old shelf list; he leaves it there.',
  output:'ivo.shelfBuilt',costs:[item('player',K.log,-1),item('player',K.rope,-1),item('player',K.kit,-1)],effects:[item('player',K.kit,1,true)],
  result:'Your log and rope became Ivo’s retained sorting shelf; your reusable kit returned. One reserved Ivo credit paid your purse. The shelf permits one separately priced native tool exchange, leaving the old claim and evidence untouched.',
  refused:'You declined Ivo’s one shelf request. No lumber, rope, kit or wage changed owner. His ordinary filing continues, and no appointment or disputed testimony was settled by the refusal.',
  account:'Ivo shows the retained shelf and its one-credit local wage receipt. The shelf organizes his bounded tool exchange; it has no authority over authorship, archive office or a past mission payment.'}
]);
export const NESTED_LIFE_IDS=freeze({schema:8,group:'nested_life',cancel:'nested.life.cancel',names:specs.map(s=>s.name),
 lin:{offer:offer('lin'),work:work('lin')},brin:{offer:offer('brin'),work:work('brin')},ivo:{offer:offer('ivo'),work:work('ivo')}});
export const NESTED_LIFE_ITEMS=freeze({...K});
const command=(s,id,label,d={})=>({id:`nested.life.${s.name}.${id}`,revision:1,label,group:'nested_life',actorId:'player',worldId:s.world,location:s.location,
 targetId:s.actor,coLocated:true,participants:['$target'],once:true,costs:[],...d,
 effects:[...(d.effects||[]),{type:'fact',scope:'actor',actor:'player',key:'nested.life.version',value:1}],
 requires:all(eq('nested.life.nativeBound'),f(s.name,'local'),f(s.name,'bodySupported'),...(d.requires?[d.requires]:[]))});
const completion=s=>all(eq('nested.life.nativeBound'),f(s.name,'local'),f(s.name,'bodySupported'));
const commands=specs.flatMap(s=>[
 command(s,'open',`Hear ${s.label} and open its one finite demand`,{visibleWhen:f(s.name,'opened',false),requires:all(f(s.name,'opened',false),f(s.name,'eligibleVisit')),
  description:s.terms,effects:[demand(s.actor,s.name,1),claim(s.actor,offer(s.name),'acquire'),flag(s.name,'opened'),know(s.name,'terms',s.terms)]}),
 command(s,'work',`Do ${s.label} · ${s.duration} min · earn ${s.wage} credits`,{siteId:s.site,duration:s.duration,cancellation:'refund',claim:work(s.name),
  visibleWhen:all(f(s.name,'opened'),f(s.name,'closed',false)),requires:all(f(s.name,'opened'),f(s.name,'closed',false),gte(`nested.life.${s.name}.demand`,1)),
  completionRequires:completion(s),completionCoLocated:true,completionFailure:'refund',
  description:`${s.terms} This accepted job reserves only its stated demand, existing wage, materials, both bodies and site. Cancellation or lost supported contact returns the reserved inputs and creates no result.`,
  costs:[demand(s.actor,s.name,-1),credit(s.actor,-s.wage),...s.costs,stamina('player',-2),stamina(s.actor,-1)],
  effects:[...s.effects,credit('player',s.wage),worldFlag(s.world,s.output),flag(s.name,'done'),flag(s.name,'closed'),claim(s.actor,offer(s.name),'settle'),know(s.name,'result',s.result)]}),
 command(s,'refuse',`Decline ${s.label} without spending materials`,{visibleWhen:all(f(s.name,'opened'),f(s.name,'closed',false)),
  requires:all(f(s.name,'opened'),f(s.name,'closed',false),gte(`nested.life.${s.name}.demand`,1)),costs:[demand(s.actor,s.name,-1)],
  effects:[flag(s.name,'refused'),flag(s.name,'closed'),claim(s.actor,offer(s.name),'settle'),know(s.name,'refusal',s.refused)]}),
 command(s,'texture',`Spend a quiet moment with ${s.name==='lin'?'Lin':s.name==='brin'?'Brin':'Ivo'}`,{description:'A free local meeting. It opens no work, quota, wage or mechanical reward.',effects:[know(s.name,'texture',s.texture)]}),
 command(s,'account',`Hear ${s.name==='lin'?'Lin':s.name==='brin'?'Brin':'Ivo'}’s retained local account`,{visibleWhen:f(s.name,'closed'),requires:f(s.name,'closed'),
  description:'A free later meeting reports the job or its refusal, without reopening demand or repeating a payment.',
  outcomes:[{id:'worked',weight:{fact:`nested.life.${s.name}.doneWeight`},effects:[know(s.name,'account',s.account)]},
   {id:'refused',weight:{fact:`nested.life.${s.name}.refusedWeight`},effects:[know(s.name,'account',s.refused)]}]})
]);
const brin=specs[1],ivo=specs[2];
commands.push(command(brin,'buy_spare','Buy one of Brin’s actual maintained kits · 1 credit',{
 visibleWhen:f('brin','done'),requires:all(f('brin','done'),eq('world.nested.life.brin.kitMade'),gte(`nested.life.brin.kits`,1)),
 description:'One separate finite consented transfer after the maintenance job. Pay Brin one real credit and move one actual kit from his native inventory into yours. The old kit count, source, export and mission accounts are preserved.',
 costs:[credit('player',-1),transfer(I.foreman,'player',K.kit)],effects:[credit(I.foreman,1),flag('brin','spareBought'),
  know('brin','spare','Paid one actual credit to Brin and received one actual native survey kit from his stock. Its ordinary inspection, pressure and packing consumers still require your own body/source/support; buying it copied no skill or quota.')]}));
commands.push(command(ivo,'shelf_exchange','Use Ivo’s shelf for one organized tool exchange · rope + 1 credit · 2 min',{
 siteId:I.archiveSite,duration:2,cancellation:'refund',claim:'nested.life.ivo.shelf_exchange',visibleWhen:f('ivo','done'),
 requires:all(f('ivo','done'),eq('world.nested.life.ivo.shelfBuilt'),gte('nested.life.ivo.kits',1)),completionRequires:completion(ivo),completionCoLocated:true,completionFailure:'refund',
 description:'The retained shelf opens one organized exchange: your actual rope and one credit for Ivo’s actual kit. Both participants use their own body/time; the reciprocal native transfers and fee refund if the supported exchange is cancelled.',
 costs:[credit('player',-1),transfer('player',I.witness,K.rope),transfer(I.witness,'player',K.kit),stamina('player',-1),stamina(I.witness,-1)],
 effects:[credit(I.witness,1),flag('ivo','shelfUsed'),know('ivo','shelf_use','Used the actual retained shelf for one agreed tool exchange. Your rope is now Ivo-owned, his kit is now yours, and one real credit paid him. Neither witness evidence nor office rights changed; the acquired kit serves ordinary native tool functions.')]}));
export const nestedLifeDefinitions=freeze({commands});

// Private support facts are for legal previews, reservations and completion.
// Presentation reports only player-directed local knowledge and quoted terms.
export function nestedLifeFacts(state,context={}) {
 const d=state.nestedCampaign,s=state.simulation,a=state.actors?.player,visit=d?.visits.find(v=>v.id===d.activeVisitId&&v.status==='active'),facts={};
 facts['nested.life.nativeBound']=!!d&&context.nestedNative?.bound===true&&context.nestedNative.revision===d.nativeRevision;
 const usable=id=>{const p=s?.people?.[id],v=context.vitals?.[id]||p?.vitals;return p?.life==='alive'&&p.body?.mobile!==false&&(p.body?.hands??2)>=2&&(v?.health??0)>1;};
 const player=s?.people?.player,body=context.nestedNative?.body;
 const actualBody=context.nativeAlive===true&&body?.id==='native.player.body'&&body.form==='human'&&player?.inventory==='native'&&a&&
  (player.body?.form==null||player.body.form===body.form)&&(player.body?.id==null||player.body.id===body.id)&&
  (player.body?.ownerId==null||player.body.ownerId==='player')&&(player.body?.controllerId==null||player.body.controllerId==='player')&&usable('player');
 for(const spec of specs) {
  const prefix=`nested.life.${spec.name}`,f=a?.facts||{},npc=state.actors?.[spec.actor];
  facts[`${prefix}.local`]=!!d&&a?.worldId===spec.world&&visit?.endpoint.worldId===spec.world;
  facts[`${prefix}.bodySupported`]=!!actualBody&&s?.people?.[spec.actor]?.inventory==='native'&&usable(spec.actor)&&npc?.worldId===spec.world;
  facts[`${prefix}.eligibleVisit`]=spec.world===I.hub||!!d?.history.some(m=>m.stage==='settled'&&NESTED_MISSIONS.find(def=>def.id===m.id)?.worldId===spec.world);
  for(const key of ['opened','closed','done','refused'])facts[`${prefix}.${key}`]=f[`${prefix}.${key}`]===true;
  facts[`${prefix}.demand`]=npc?.resources?.[`${prefix}.demand`]||0;
  facts[`${prefix}.kits`]=context.gameplay?.[spec.actor]?.inventory?.[K.kit]||0;
  facts[`${prefix}.doneWeight`]=f[`${prefix}.done`]===true?1:0;
  facts[`${prefix}.refusedWeight`]=f[`${prefix}.refused`]===true?1:0;
 }
 return facts;
}
export const nestedLifeContext=(state,context={})=>({...context,facts:{...context.facts,...nestedLifeFacts(state,context)}});
const publicIds=new Set(commands.map(d=>d.id));
const preparedState=state=>{const next=copy(state);next.schema=(next.auditRemainder||next.causalStories||next.motherOfLearning||next.proto23Village)?11:next.bookWorldCampaign?10:next.referenceGameplay?9:8;return next;};
const describeReason=reason=>reason.startsWith('Requires nested.life.')||reason.startsWith('Insufficient nested.')?
 'The known local request, available funds, consent or supported means are not ready.':reason;
export function previewNestedLifeCommand(state,registry,id,context={}) {
 if(!state.nestedCampaign||!state.simulation||!publicIds.has(id))return {visible:false,eligible:false,reasons:['This local-life command is unavailable.']};
 const d=registry.simulation.commands.get(id);assert(d?.group==='nested_life'&&d.actorId==='player','Register the exact local-life definition before preview.');
 const next=preparedState(state),ctx=nestedLifeContext(next,{...context,actorId:'player',targetId:d.targetId});
 const p=previewSimulationCommand(next,registry,id,ctx);
 return {...p,visible:p.visible&&!(d.once&&state.actors.player.completed[id]),reasons:p.reasons.map(describeReason)};
}
export function commitNestedLifeCommand(state,registry,command,context,expectedSequence=state.sequence) {
 assert(natural(expectedSequence)&&expectedSequence===state.sequence&&context.actorId==='player'&&state.nestedCampaign&&state.simulation,'This local-life command is stale or its actual native owners are unavailable.');
 assert(command.type==='nested_life'&&(command.sequence==null||command.sequence===expectedSequence),'Use the current local-life command token.');
 const next=preparedState(state),ctx=nestedLifeContext(next,context);
 if(command.id===NESTED_LIFE_IDS.cancel) {
  const job=state.simulation.jobs.find(j=>j.id===command.jobId&&j.actorId==='player'&&registry.simulation.commands.get(j.commandId)?.group==='nested_life');
  assert(job&&job.cancellation==='refund','Choose the actual accepted refundable local-life job.');
  return cancelSimulationJob(next,registry,job.id,ctx,expectedSequence);
 }
 assert(publicIds.has(command.id),'Unsupported local-life command.');
 const d=registry.simulation.commands.get(command.id);assert(d?.group==='nested_life'&&(!command.targetId||command.targetId===d.targetId),'Choose the declared existing local resident.');
 const preview=previewNestedLifeCommand(state,registry,d.id,ctx);assert(preview.visible&&preview.eligible,preview.reasons.join(' ')||'This local-life choice is unavailable.');
 return commitSimulationCommand(next,registry,{id:d.id},{...ctx,targetId:d.targetId},expectedSequence);
}
export function nestedLifePresentation(state,registry,context={}) {
 if(!state.nestedCampaign||!state.simulation)return {visible:false,sections:[]};
 const sections=[];
 for(const spec of specs) {
  const actions=[];
  for(const d of commands.filter(c=>c.worldId===spec.world&&c.targetId===spec.actor)) {
   if(state.actors.player.worldId!==d.worldId||(context.facts?.location||state.simulation.people.player.location)!==d.location)continue;
   const p=previewNestedLifeCommand(state,registry,d.id,context);if(!p.visible)continue;
   actions.push({id:d.id,label:d.label,description:d.description||'',eligible:p.eligible,reasons:p.reasons,costs:p.costs,duration:p.duration,cancellation:d.cancellation||'none',command:{type:'nested_life',id:d.id}});
  }
  const jobs=state.simulation.jobs.filter(j=>j.actorId==='player'&&registry.simulation.commands.get(j.commandId)?.targetId===spec.actor&&registry.simulation.commands.get(j.commandId)?.group==='nested_life');
  for(const j of jobs)actions.push({id:`${j.id}:cancel`,label:'Cancel this accepted local work and return its reserved inputs',eligible:true,reasons:[],command:{type:'nested_life',id:NESTED_LIFE_IDS.cancel,jobId:j.id}});
  const records=Object.entries(state.simulation.knowledge.player||{}).filter(([key])=>key.startsWith(`nested.life.${spec.name}.`)).map(([id,r])=>({id,at:r.at,text:r.value,stage:r.stage,cause:r.cause,basis:r.basis?copy(r.basis):null}));
  if(actions.length||jobs.length||records.length)sections.push({id:`nested.life.${spec.name}`,label:spec.label,description:'A separate finite local job and its retained account. Existing mission, water, claim and source histories stay separate.',
   actions,records,work:jobs.map(j=>`${j.label}: ${Math.max(0,j.due-state.clock)} played minutes remaining.`).join(' ')});
 }
 return {visible:sections.length>0,sections};
}
export function validateNestedLife(state,registry) {
 const s=state.simulation,player=state.actors?.player,prefix='nested.life.';
 const active=Object.keys(player?.facts||{}).some(k=>k.startsWith(prefix))||Object.keys(s?.knowledge?.player||{}).some(k=>k.startsWith(prefix))||Object.keys(s?.claims||{}).some(k=>k.startsWith(prefix))||Object.keys(player?.completed||{}).some(k=>k.startsWith(prefix))||
  (s?.jobs||[]).some(j=>j.commandId.startsWith(prefix))||Object.values(state.worlds||{}).some(w=>Object.keys(w.facts||{}).some(k=>k.startsWith(prefix)));
 const demands=specs.some(spec=>Object.hasOwn(state.actors?.[spec.actor]?.resources||{},`${prefix}${spec.name}.demand`));
 if(!active&&!demands)return true;
 assert([8,9,10,11].includes(state.schema)&&state.nestedCampaign&&s,'New local-life receipts require the explicit compatible expansion8 reader; preserve unsupported saves without resetting them.');
 assert(player.facts['nested.life.version']===1,'Unsupported explicit local-life semantics version; preserve the saved history for its matching reader.');
 for(const spec of specs) {
  const key=`${prefix}${spec.name}`,f=player.facts,npc=state.actors[spec.actor],quota=npc?.resources?.[`${key}.demand`];
  if(quota!=null)assert(natural(quota)&&quota<=1&&f[`${key}.opened`]===true,'A local-life demand must come from its deliberate once-only opening.');
  for(const field of ['opened','closed','done','refused','spareBought','shelfUsed'])if(Object.hasOwn(f,`${key}.${field}`))assert(typeof f[`${key}.${field}`]==='boolean','Invalid local-life history flag.');
  assert(!(f[`${key}.done`]&&f[`${key}.refused`]),'A local request cannot both pay completed work and record refusal.');
  if(f[`${key}.closed`])assert(quota===0&&(f[`${key}.done`]||f[`${key}.refused`]),'A closed local request must retain its actual finite outcome.');
  const invitation=s.claims[offer(spec.name)];
  if(f[`${key}.opened`])assert(invitation?.owner===spec.actor&&invitation.status===(f[`${key}.closed`]?'settled':'held'),'The local offer must retain its actual resident owner and closure.');
  if(f[`${key}.done`])assert(state.worlds[spec.world].facts[`nested.life.${spec.output}`]===true&&s.claims[work(spec.name)]?.owner==='player'&&s.claims[work(spec.name)].status==='settled','Completed local work needs its retained fixture/output and settled work receipt.');
 }
 if(registry)for(const job of s.jobs.filter(j=>j.commandId.startsWith(prefix)))assert(registry.simulation.commands.get(job.commandId)?.group==='nested_life','Saved local-life work is unregistered.');
 return true;
}
