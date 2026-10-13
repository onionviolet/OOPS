import {I,K} from './shared.js';
import {managementDefinitions} from './content.js';
// Rule `not` needs a known fact. Unset courtyard actor facts read as false so
// "not yet chosen" gates (charter, sold, booked, plot right) can be met.
let actorFactKeys;
const unsetActorFacts=()=>actorFactKeys||=[...new Set(managementDefinitions.commands.flatMap(d=>d.effects||[]).filter(e=>e.type==='fact'&&e.scope==='actor').map(e=>`actor.${e.key}`))];
// Public quotes come from means physically present now. No private motive or
// future result is exported to the UI; observed terms live in player knowledge.
export function managementFacts(state,context={}) {
 const s=state.simulation,location=context.facts?.location||s?.people.player?.location;
 const alive=context.nativeAlive===true&&context.nativeBody?.alive!==false;
 const f=Object.fromEntries(unsetActorFacts().map(k=>[k,false]));
 Object.assign(f,{'management.supported':state.actors?.player?.worldId===I.world&&location==='Village'&&alive&&context.nativeBody!=null&&(!s||s.people.player?.life==='alive')});
 f['management.foremanOutstanding']=state.actors?.[I.orin]?.facts?.['mg.foremanReady']===true;
 f['management.foremanIdle']=!(s?.jobs||[]).some(j=>(j.participants||[j.actorId]).includes(I.orin));
 f['management.foremanReturnAvailable']=state.actors?.player?.worldId===I.world&&(context.managementPlayerLocation||context.facts?.location)==='Village'&&(context.managementPlayerAlive??context.nativeAlive)===true&&s?.people[I.orin]?.life==='alive'&&s.people[I.orin].location==='Village'&&state.actors[I.orin]?.facts['mg.consent']===true;
 const held=context.gameplay?.player?.inventory||{};
 for(const [name,key] of Object.entries(K))f[`management.owned.${name}`]=Object.values(s?.custody||{}).some(c=>c.holder==='player'&&c.key===key)||Object.values(context.equipment?.player||s?.equipment.player||{}).includes(key)?0:(held[key]||0);
 for(const id of [I.mira,I.orin,I.sela,I.bram]) {
  const p=s?.people[id],a=state.actors?.[id];
  // A completion may use its own reserved participant, but cannot borrow a
  // participant from a different live job or encounter.
  const relevant=s?.jobs?.find(j=>j.actorId==='player'&&j.commandId.startsWith('mg.')&&(j.participants||[]).includes(id));
  const busy=(s?.jobs||[]).some(j=>j!==relevant&&(j.participants||[j.actorId]).includes(id))||Object.values(s?.sessions||{}).some(j=>(j.participants||[]).includes(id));
  f[`management.present.${id}`]=!!p&&p.life==='alive'&&p.location===location&&a?.worldId===I.world&&a.facts['mg.consent']===true&&(p.vitals?.health||0)>1&&!busy;
  f[`management.coins.${id}`]=a?.resources?.coins||0;
  for(const [name,key] of Object.entries(K))f[`management.stock.${id}.${name}`]=s?.owners[id]?.[key]||0;
 }
 return f;
}
