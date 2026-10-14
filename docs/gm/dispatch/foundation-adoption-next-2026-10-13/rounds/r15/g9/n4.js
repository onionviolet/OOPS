await start('N4','ST04');let s,age,beforeClock,loan,sampleAge,vialTitle;
for(const id of recipe.journeys.find(t=>t.id==='ROUTE-N4').commands){
 s=await fastAct(id);if(id==='learn_method')await fastAct('borrow_sample');
 if(id==='store_mushroom01_fresh_woods'){
  assert.equal(s.inventories.storage['p08.compartment'][key('mushroom01_fresh')].count,1);assert(!s.inventories.person.main_character[key('mushroom01_fresh')]);assert.equal(s.expansion.simulation.claims['p08.mushroom01.title'].owner,'player');
  loan=structuredClone(s.expansion.simulation.custody['p08.sample_loan']);sampleAge=s.expansion.simulation.objectClocks['p08.unit_sample01'].elapsed;vialTitle=s.expansion.simulation.claims['p08.vial01.title'].owner;
  age=s.expansion.simulation.objectClocks['p08.unit_mushroom01'].elapsed;beforeClock=s.expansion.clock;
  s=await advance(300);assert.equal(s.expansion.simulation.objectClocks['p08.unit_mushroom01'].elapsed,age);assert.equal(s.expansion.clock,beforeClock+300);assert.equal(s.expansion.simulation.custody['p08.sample_loan'].owner,loan.owner);assert.equal(s.expansion.simulation.custody['p08.sample_loan'].holder,loan.holder);assert.equal(s.expansion.simulation.custody['p08.sample_loan'].key,loan.key);assert.equal(s.expansion.simulation.objectClocks['p08.unit_sample01'].elapsed,sampleAge+300);assert.equal(s.expansion.simulation.objectClocks['p08.unit_vial01'].key,key('vial01_expired'));assert.equal(s.expansion.simulation.claims['p08.vial01.title'].owner,vialTitle);record('N4-custody-exposure-control',{titleAndHolderPreserved:true,outsideAgeAdvanced:300,otherOutsideConditionExpired:true});
  record('N4-stored-age',{ageBefore:age,ageAfter:age,commonClockAdvanced:300,titleUnchanged:true,storedCount:1,carriedCount:0});await roundtrip('N4-stored');
 }
 if(id==='retrieve_mushroom01_fresh_woods'){
  assert(!s.inventories.storage['p08.compartment'][key('mushroom01_fresh')]);assert.equal(s.inventories.person.main_character[key('mushroom01_fresh')].count,1);const at=s.expansion.simulation.objectClocks['p08.unit_mushroom01'].elapsed;s=await advance(7);assert.equal(s.expansion.simulation.objectClocks['p08.unit_mushroom01'].elapsed,at+7);record('N4-retrieval-exposure',{exposureBefore:at,exposureAfter:at+7,sameIdentifiedUnit:true});
 }
}
assert.equal(s.inventories.person.main_character[key('silver')].count,2);assert.equal(s.expansion.simulation.claims['p08.mushroom01.title'].owner,'p08.buyer');assert(!s.inventories.person.main_character[key('mushroom01_fresh')]);assert.equal(s.expansion.simulation.owners['p08.buyer'][key('mushroom01_fresh')],1);record('N4-sale',{paid:2,buyerCount:1,noLotMerge:true});await roundtrip('N4-sale');return results.map(r=>r.id);
