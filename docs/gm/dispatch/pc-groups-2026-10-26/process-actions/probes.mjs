import assert from 'node:assert/strict';
import {frontierCatalogue as cat, frontierLayeredLaw as law} from '../../../../../src/craft_content_frontier.js';
import {generateMaterial} from '../../../../../src/craft_materials.js';
import {resolveBatch} from '../../../../../src/craft_resolver.js';

// Synthetic material fixtures; no player state or native inventory is loaded.
const materials=['reedherb','riversalt'].map(f=>generateMaterial(cat,f,{root:4,scope:'village',index:0}).value);
const inputs=materials.map(material=>({material,qty:1}));
const request={inputs,order:[materials[1].id,materials[0].id],process:[{op:'heat',level:4}]};
const once=resolveBatch(law,request).product;
const partitioned=resolveBatch(law,{...request,process:[{op:'heat',level:2},{op:'heat',level:2}]}).product;
assert.deepEqual(once.thermal,partitioned.thermal);
assert.deepEqual(once.composition,partitioned.composition);
assert.equal(once.availability.vigor,800);
assert.equal(partitioned.availability.vigor,640);
assert.notEqual(once.id,partitioned.id);
assert.throws(()=>resolveBatch(law,{...request,process:[{op:'heat',level:4,duration:6}]}),/Unknown process step field/);
assert.throws(()=>resolveBatch(law,{...request,process:[{op:'stir',level:1}]}),/Unknown process/);
const scaled=resolveBatch(law,{...request,inputs:inputs.map(i=>({...i,qty:10}))}).product;
assert.equal(once.thermal.safeHeat,scaled.thermal.safeHeat);
assert.equal(scaled.mass,once.mass*10);
console.log(JSON.stringify({fixture:'root 4, village, index 0, reedherb + riversalt',
  heatPartition:{thermalEqual:true,compositionEqual:true,availabilityVigor:[once.availability.vigor,partitioned.availability.vigor],productIdentityEqual:false},
  unsupported:{durationRejected:true,stirRejected:true},
  scale:{mass:[once.mass,scaled.mass],safeHeat:[once.thermal.safeHeat,scaled.thermal.safeHeat],reason:'distinct consumed material rows, not total quantity'}},null,2));
