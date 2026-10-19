import {natural, sameJson as same} from '../basics.js';
import {I} from './shared.js';
import {managementDefinitions} from './content.js';
const check=(ok,msg)=>{if(!ok)throw new Error(`Courtyard: ${msg}`);};
export function stampManagementJob(state,job) {
 if(job.commandId.startsWith('mg.')&&managementDefinitions.commands.some(d=>d.id===job.commandId&&d.duration>0))
  job.managementWork={schema:1,startedAt:state.clock};
}
// This additive content has no second inventory/calendar/state namespace.
// Validate real resident balances against exact authored transactions and held
// costs. Old saves with no charter remain inert and gain no defaults.
export function validateManagementState(state,registry) {
 const s=state.simulation,opened=state.actors?.player?.facts?.['mg.opened']===true;
 const related=Object.keys(state.actors||{}).some(id=>id.startsWith('mg.'))||Object.keys(s?.sites||{}).some(id=>id.startsWith('mg.'))||Object.keys(state.actors?.player?.facts||{}).some(id=>id.startsWith('mg.'));
 if(!opened){check(!related,'local records require explicit charter activation.');return;}
 check(s&&state.actors.player.facts['mg.version']===1&&state.actors.player.completed[I.begin]===1,'unsupported or duplicate charter revision.');
 check(s.situations?.[I.situation]?.revision===1,'knowledge requires its actual courtyard context.');
 const defs=new Map(managementDefinitions.commands.map(d=>[d.id,d]));
 const knownFacts=new Map(),knownKnowledge=new Set();
 for(const d of defs.values())for(const e of d.effects||[]){if(e.type==='fact'){const key=`${e.actor||'player'}:${e.key}`;if(!knownFacts.has(key))knownFacts.set(key,new Set());knownFacts.get(key).add(e.value);}if(e.type==='knowledge')knownKnowledge.add(e.key);}
 const balances=Object.fromEntries(managementDefinitions.people.map(p=>[p.id,{coins:p.resources.coins,stock:{}}]));
 const apply=e=>{
  if(e.type==='resource'&&balances[e.actor]){check(e.key==='coins'&&Number.isSafeInteger(e.amount),'unsupported resident currency.');balances[e.actor].coins+=e.amount;}
  if(e.type==='item'&&balances[e.actor])balances[e.actor].stock[e.key]=(balances[e.actor].stock[e.key]||0)+e.amount;
  if(e.type==='transfer'){if(balances[e.from])balances[e.from].stock[e.key]=(balances[e.from].stock[e.key]||0)-e.count;if(balances[e.to])balances[e.to].stock[e.key]=(balances[e.to].stock[e.key]||0)+e.count;}
 };
 for(const [actor,a]of Object.entries(state.actors)) {
  for(const [id,count]of Object.entries(a.completed||{}))if(id.startsWith('mg.')){
   const d=defs.get(id);check(d&&natural(count)&&count<=1000000&&(d.actorId||'player')===actor,'unknown completed local command or unsafe count.');
   if(d.once||d.claim)check(count<=1,'one agreement cannot settle twice.');
   for(const e of [...d.costs,...d.effects]){if(e.type==='resource'||e.type==='item')apply({...e,amount:e.amount*count});else if(e.type==='transfer')apply({...e,count:e.count*count});}
  }
  for(const [key,value]of Object.entries(a.facts||{}))if(key.startsWith('mg.'))check(knownFacts.get(`${actor}:${key}`)?.has(value),'unsupported local permission/phase value.');
 }
 for(const j of s.jobs.filter(j=>j.commandId.startsWith('mg.'))) {
  const d=defs.get(j.commandId);check(d&&d.duration>0&&j.actorId===d.actorId&&j.revision===d.revision&&j.siteId===(d.siteId||null)&&j.targetId===(d.targetId||null)&&j.reservationReturns===1&&j.cancellation==='refund','unsupported local work revision or owner.');
  check(same(j.costs,d.costs)&&same(j.effects,d.effects)&&same(j.completionSupport,{schema:1,requires:d.completionRequires,coLocated:!!d.completionCoLocated,location:d.location,failure:'refund'}),'accepted local work lost exact reserved inputs/output/support.');
  check(j.due>=state.clock&&j.due<=state.clock+d.duration,'unsupported local duration.');
  if(j.managementWork!=null){const w=j.managementWork;
   check(w&&same(Object.keys(w).sort(),['schema','startedAt'])&&w.schema===1&&natural(w.startedAt)&&w.startedAt<=state.clock&&j.due===w.startedAt+d.duration,
    'accepted local work lost its actual start and due time.');
  }
  for(const e of j.costs)apply(e);
 }
 for(const d of managementDefinitions.people) {
  const a=state.actors[d.id],p=s.people[d.id],b=balances[d.id];
  check(a&&p&&p.definitionId===d.id&&p.definitionRevision===d.revision&&p.inventory==='simulation'&&a.worldId===I.world,'missing real resident owner.');
  check(natural(a.resources.coins)&&a.resources.coins===b.coins,'resident cash does not match completed sales/costs and held reservations.');
  const actual=s.owners[d.id]||{};
  check(Object.keys(actual).every(key=>(actual[key]||0)===(b.stock[key]||0))&&Object.keys(b.stock).every(key=>(actual[key]||0)===b.stock[key]),'resident stock was duplicated or lost from its authored transaction.');
 }
 for(const d of managementDefinitions.sites)check(s.sites[d.id]?.owner==='player'&&s.sites[d.id].capacity===d.capacity,'local site access/capacity changed.');
 for(const [key,k]of Object.entries(s.knowledge.player||{}))if(key.startsWith('mg.'))check(knownKnowledge.has(key)&&k.basis?.situationId===I.situation,'unsupported player knowledge attribution.');
 for(const p of Object.values(s.programs||{}))if(p.commandId.startsWith('mg.')){const d=defs.get(p.commandId);check(d?.repeatable===true&&d.automatable===true&&p.remaining<=3,'work mandate exceeded its learned finite recipe limit.');}
 if(registry)for(const d of defs.values())check(same(registry.commands.get(d.id),d),'local content revision differs from the admitted reader.');
}
