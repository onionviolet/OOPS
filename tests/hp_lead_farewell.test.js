import test from 'node:test';
import assert from 'node:assert/strict';
import {compileHpLeadFarewell,HP_LEAD_FAREWELL,HP_LEAD_FINALE} from '../src/book_world_hp_lead_finale.js';
import {extensionFact} from '../src/structured_pack_extensions.js';
import {evaluateRule} from '../src/rules.js';

test('the last word requires the exact completed station arrival and writes one native receipt',()=>{
 const life='book.hp.lead',station=life+'.train',arrival=HP_LEAD_FINALE+'.kings-cross',key=HP_LEAD_FAREWELL+'.last-word';
 const row={id:key,place:station,venue:'King’s Cross',label:'Say goodbye',description:'Talk with your friends.',report:'You talk with your friends.',minutes:1,operation:'use',knowledgeKey:key+'.seen'};
 const base={id:life,revision:1,contentHash:'base',extensions:[{id:HP_LEAD_FINALE,contentHash:'finale',commands:[{id:arrival}]}]};
 const pack={schema:1,baseHash:'base',predecessorHash:'finale',data:{acts:[row],sequences:[{id:HP_LEAD_FAREWELL,title:row.label,stages:[{commandId:key,label:row.label}]}]}};
 assert.throws(()=>compileHpLeadFarewell({...pack,predecessorHash:'different-finale'},base),/Invalid King’s Cross account/);
 const extension=compileHpLeadFarewell(pack,base),command=extension.commands[0];
 const eligible={'actor.location':station,'actor.hp.lead.house':'gryffindor',[extensionFact(HP_LEAD_FINALE)]:true,['completed.'+arrival]:true,['knowledge.'+arrival+'.seen.seen']:true};
 assert(evaluateRule(extension.requires,eligible).met);
 for(const [fact,value] of [['actor.location',life+'.school_hall'],[extensionFact(HP_LEAD_FINALE),false],['completed.'+arrival,false],['knowledge.'+arrival+'.seen.seen',false]]){
  assert(!evaluateRule(extension.requires,{...eligible,[fact]:value}).met);
 }
 assert.equal(command.location,station);
 assert.equal(command.once,true);
 assert.deepEqual(command.effects.map(e=>[e.type,e.key,e.value]),[['knowledge',row.knowledgeKey,row.report]]);
});
