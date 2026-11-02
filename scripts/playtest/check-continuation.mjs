// Content checks over the existing command compiler, not a second story DSL.
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import {definePlaceActs} from '../../src/place_acts.js';
import {createSimulationRegistry} from '../../src/simulation_contracts.js';
export function checkContinuation(data,{prefix='',worldId='fixture.world',group='fixture',situationId='fixture.situation'}={}){
 const commands=definePlaceActs(data,{worldId,group,situationId});createSimulationRegistry({commands});
 const keys=new Set((data.acts||[]).flatMap(r=>[r.knowledgeKey,...(r.effects||[]).filter(e=>e.type==='knowledge'&&e.actor==='player').map(e=>e.key)]));
 const selected=(data.acts||[]).filter(r=>r.id.startsWith(prefix));
 const walk=rule=>{if(!rule||typeof rule!=='object')return;if(rule.fact?.startsWith('knowledge.')&&rule.fact.slice(10).startsWith(prefix)){
  const m=/^knowledge\.(.+)\.(seen|understood|value|basis|attributedTo)$/.exec(rule.fact);if(!m||!keys.has(m[1]))throw Error(`Unbound retained-knowledge reference: ${rule.fact}`);
 }for(const x of Object.values(rule))if(typeof x==='object')if(Array.isArray(x))x.forEach(walk);else walk(x);};
 for(const row of selected){if(!row.locator||!row.timing?.basis||!row.costLabel)throw Error(`Missing source, timing basis or cost disclosure: ${row.id}`);walk(row.requires);walk(row.visibleWhen);}
 const ids=new Set((data.acts||[]).map(r=>r.id));for(const visit of data.visits||[])if(!ids.has(visit.arrival)||!(ids.has(visit.departure)||visit.departure===null&&visit.continues===true))throw Error('Visit lifecycle references an unknown command.');
 return {commands:selected.length,knowledgeKeys:keys.size,visits:(data.visits||[]).length};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const pack=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));console.log(JSON.stringify(checkContinuation(pack.householdActs,{prefix:process.argv[3]||'',worldId:'book.lotm.tingen',group:'book_lotm',situationId:'book.lotm.tingen.canon_beside'})));
}
