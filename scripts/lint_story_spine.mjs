import {pathToFileURL} from 'node:url';
import {storyletEvents} from '../src/storylet_content.js';
import {storyAftermathDefinitions} from '../src/story_aftermath.js';
import {REQUEST_CONTRACT} from '../src/story_requests.js';
import {expeditionRegistry} from '../src/expedition_content.js';
import {readFileSync} from 'node:fs';
// Read literal item declarations from their real owners without loading native DOM.
const itemSource=readFileSync(new URL('../src/items.js',import.meta.url),'utf8'),extraSource=readFileSync(new URL('../src/data/expedition_items.js',import.meta.url),'utf8');
const items=new Set([...itemSource.matchAll(/item_templates\["([^"]+)"\]/g),...extraSource.matchAll(/\["([^"]+)", "/g)].map(m=>m[1]));
import {validatePredicate,validateSimulationEffect} from '../src/simulation_contracts.js';
const supportedEffects=new Set(['fact','relationship','resource','world','item','xp']);
const collectRules=r=>!r?[]:r.fact?[r]:r.not?collectRules(r.not):(r.all||r.any||[]).flatMap(collectRules);
const effects=d=>[...(d.effects||[]),...(d.onExpire||[]),...(d.responses||[]).flatMap(r=>[...(r.costs||[]),...(r.effects||[])])];
// Bounded reachability lint, not a general solver. Contradictory conjunctions
// and missing/self-locked fact producers are rejected; runtime witnesses remain QA.
export function lintStoryContent({cards=[...storyletEvents,...storyAftermathDefinitions.events],request=REQUEST_CONTRACT,registry=expeditionRegistry,sealedStrings=['synthetic-sealed-canary']}={}) {
 const findings=[],add=(code,id)=>findings.push({code,id});
 const seen=new Set(),writers=new Map();
 for(const d of cards)for(const e of effects(d))if(e.type==='fact') {const key=`actor.${e.key}`;if(!writers.has(key))writers.set(key,new Set());writers.get(key).add(d.id);}
 const initial=new Set(['actor.tag.dog','actor.storylet.roof.fixed','actor.storylet.fever.treated','actor.storylet.fever.contained','actor.storylet.scouts.warned']);
 function ruleLint(rule,id,owner) {
  try{validatePredicate(rule);}catch{add('BAD_REQUIREMENT',id);return;}
  for(const r of collectRules(rule)) {
   if(r.fact.startsWith('actor.storylet.')&&!initial.has(r.fact)&&!writers.has(r.fact))add('UNREACHABLE_REQUIREMENT',id);
   if(r.fact.startsWith('actor.storylet.')&&writers.get(r.fact)?.size===1&&writers.get(r.fact).has(owner)&&r.value===true&&!initial.has(r.fact))add('SELF_LOCKED_REQUIREMENT',id);
  }
  if(rule?.all) {
   const by=new Map();for(const r of rule.all.filter(r=>r.fact)){const rows=by.get(r.fact)||[];rows.push(r);by.set(r.fact,rows);}
   for(const rows of by.values()) {
    const eq=rows.filter(r=>r.op==='eq'),lo=Math.max(-Infinity,...rows.filter(r=>r.op==='gte').map(r=>r.value)),hi=Math.min(Infinity,...rows.filter(r=>r.op==='lte').map(r=>r.value));
    if(lo>hi||eq.some(r=>r.value!==eq[0]?.value)||eq.some(r=>typeof r.value==='number'&&(r.value<lo||r.value>hi)))add('UNREACHABLE_REQUIREMENT',id);
   }
  }
 }
 for(const d of cards) {
  if(seen.has(d.id))add('DUPLICATE_REF',d.id);seen.add(d.id);
  if(!registry.simulation.events.has(d.id)||d.actorId&&d.actorId!=='player'&&!registry.simulation.people.has(d.actorId)||d.targetId&&!registry.simulation.people.has(d.targetId))add('BAD_REF',d.id);
  if(!['village.daily','village.people','village.chances','village.threats'].includes(d.storylet?.deck))add('BAD_REF',d.id);
  const serialized=JSON.stringify(d);if(sealedStrings.some(s=>s&&serialized.includes(s))||/sealed[._ -]?truth/i.test(serialized))add('SEALED_TEXT',d.id);
  ruleLint(d.requires,d.id,d.id);for(const r of d.responses||[])ruleLint(r.requires,`${d.id}:${r.id}`,d.id);
  for(const e of effects(d)) {
   try {validateSimulationEffect(e);}catch{add('UNSUPPORTED_EFFECT',d.id);continue;}
   if(!supportedEffects.has(e.type))add('UNSUPPORTED_EFFECT',d.id);
   if(e.actor&&!['$actor','$target','player'].includes(e.actor)&&!registry.simulation.people.has(e.actor)||e.target&&!['$actor','$target','player'].includes(e.target)&&!registry.simulation.people.has(e.target))add('BAD_REF',d.id);
   if(e.type==='item'){try{if(!items.has(JSON.parse(e.key).id))add('BAD_REF',d.id);}catch{add('BAD_REF',d.id);}}
  }
 }
 if(request.revision!==1||request.place!=='Village'||request.routes.some(r=>!['take','deliver','decline'].includes(r))||request.items.some(id=>!items.has(id)))add('BAD_REQUEST_REF','request.contract');
 if(sealedStrings.some(s=>s&&JSON.stringify(request).includes(s)))add('SEALED_TEXT','request.contract');
 return findings;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const findings=lintStoryContent();console.log(JSON.stringify({label:'SOURCE',cards:15,requestContracts:1,findings}));if(findings.length)process.exitCode=1;}
