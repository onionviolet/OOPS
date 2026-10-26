// Synthetic audit fixtures. No live owners, saves, clocks or browser writes.
import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import {defineCatalogue, materialTags, materialPool} from '../../../../../src/craft_materials.js';
import {TagRegistry, TagStore} from '../../../../../src/tag_store.js';
import {gradeMaterialFit} from '../../../../../src/craft_material_fit.js';
import {defineCraftLaw} from '../../../../../src/craft_resolver.js';
import {nativeCatalogue} from '../../../../../src/native_material_catalogue.js';
import {renderingSources} from '../../../../../src/native_rendering_recipes.js';
import {quoteHideTreatment} from '../../../../../src/material_treatment.js';
import {planProcessedMaterial} from '../../../../../src/material_lineage.js';

const catalogue = defineCatalogue({id:'audit.synthetic',revision:1,axes:[{id:'oil',kind:'fraction'}],
  tags:[{id:'fuel',kind:'functional',revision:1}],materials:[
    {id:'omitted',revision:1,tags:['fuel']},
    {id:'zero',revision:1,tags:['fuel'],properties:{oil:0}}
  ]});
assert.deepEqual(catalogue.materials.omitted.properties,catalogue.materials.zero.properties);
const fit = gradeMaterialFit(catalogue,catalogue.materials.omitted,{tags:'feul',targets:[{axis:'oil',value:100}]});
assert.equal(fit.status,'rejected');
assert.throws(()=>materialPool(catalogue,'feul'),/Unknown query tag/);
const law = defineCraftLaw({id:'audit.typo',revision:1,catalogue,reactions:[
  {id:'r',station:'fictional-station',catalyst:'feul',reactants:{oil:1},products:{matrix:1}}
]});
assert.equal(law.reactions[0].catalyst,'feul');
const q=quoteHideTreatment({treatmentId:'oiled',inventory:{'Rat pelt':3,'Lamp oil':1},skillLevel:5,clock:50,world:'base.frontier'});
assert.equal(q.eligible,true);
const event=JSON.parse(q.receive[0].key).lineage.history[0];
assert.equal(q.spend.length,2);assert.equal(event.inputs.length,1);
const charcoalTags=[...materialTags(nativeCatalogue,nativeCatalogue.materials.Charcoal)];
assert.ok(charcoalTags.includes('wood')&&charcoalTags.includes('plant'));

let key='Rat pelt';const growth=[];
for(let n=1;n<=12;n++) {
  key=planProcessedMaterial({stock:{[key]:1},inputs:[{item_key:key,count:1}],
    output:{id:'Rat pelt',family:'animal-hide',count:1},process:{id:'audit.repeat',revision:1,at:n}}).item_key;
  if([1,4,8,12].includes(n)) growth.push({steps:n,keyBytes:Buffer.byteLength(key)});
}
const registry=new TagRegistry([{id:'fuel',kind:'functional',revision:1}]);
const queries=[];
for(const size of [33,1000,10000]) {
  const store=new TagStore(registry);
  for(let n=0;n<size;n++)store.set(`material:${n}`,n%2?['fuel']:[]);
  let calls=0;const original=store.matches;
  TagStore.prototype.matches=function(...args){calls++;return original.apply(this,args);};
  const start=performance.now();let result;
  try {result=store.query('fuel');} finally {TagStore.prototype.matches=original;}
  queries.push({size,matchesCalls:calls,results:result.length,elapsedMs:+(performance.now()-start).toFixed(3)});
  assert.equal(calls,size);
}
console.log(JSON.stringify({missingEqualsZero:catalogue.materials.omitted.properties,
  typoFit:fit,typoReactionAccepted:law.reactions[0],charcoalTags,
  nativeMaterialCount:Object.keys(nativeCatalogue.materials).length,renderingSources:renderingSources(),
  treatment:{spend:q.spend,receiptInputs:event.inputs,receiptParameters:event.parameters},
  lineageKeyGrowth:growth,tagStoreQuery:queries},null,2));
