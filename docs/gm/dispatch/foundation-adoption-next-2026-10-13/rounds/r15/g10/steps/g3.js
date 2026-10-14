const E={label:'seeded-native',cases:[]};
const boot=async()=>{await reload();await fixture('g3','fixture/TEST-FIXTURE-R15-G3-FA10.txt.gz');await page.evaluate(()=>{G.character.name='TEST FIXTURE R15 G10 FA10';G.character.addToInventory([{item_id:'Fine field fitting knife',count:1}]);G.refresh();});await save();};
await boot();const before=await s();
await feature('Ask Eda to guide the comparison');const pending=await s();assert.equal(pending.character.money,before.character.money-3);assert.equal(inv(pending,'Bench clearance manual'),inv(before,'Bench clearance manual')-1);
await advance(3);let done=await s();assert.equal(done.expansion.actors.player.facts['steam.boh.preparationVersion'],1);assert.ok(!done.expansion.actors.player.facts['steam.boh.procedureVersion']);
await feature('Read the prepared manual');await advance(3);done=await s();assert.equal(done.expansion.actors.player.facts['steam.boh.procedureVersion'],1);
const preFine=done;await feature('Make 2 survey kits with your sharp fine fitting knife');await advance(3);done=await s();assert.equal(inv(done,'Prepared survey kit'),inv(preFine,'Prepared survey kit')+2);assert.equal(inv(done,'Dulled fine field fitting knife'),1);assert.equal(inv(done,'Bench clearance manual'),inv(preFine,'Bench clearance manual'));
E.cases.push({id:'guided-fine',money:[before.character.money,preFine.character.money],preparationDistinct:true,kits:2,persistence:await persist('fa10-guided-fine')});
for(const support of ['location','alive','author','hands','bench']){
 await boot();const base=await s();await feature('Ask Eda to guide the comparison');
 await page.evaluate(support=>{if(support==='location')G.forceLocation('Shack');if(support==='alive')G.negativeAlive(false);if(support==='author')G.state.actors['feature_objects.miri'].facts['feature_objects.willing']=false;if(support==='hands')G.state.simulation.people.player.body.hands=1;if(support==='bench')G.state.simulation.sites['feature_objects.fitting_bench'].capacity=2;},support);
 const result=await advance(3);done=result.save;if(support==='bench'){assert.equal(jobs(done).length,1);E.cases.push({id:'invalid-bench',publicationRejected:true,pendingDurableKept:true});h.write('g3.json',E);continue;}assert.equal(jobs(done).length,0,support);assert.equal(done.character.money,base.character.money,support+' money refund');assert.equal(inv(done,'Bench clearance manual'),inv(base,'Bench clearance manual'));assert.ok(!done.expansion.actors.player.completed['steam.boh.guided']);E.cases.push({id:'support-'+support,refunded:true,noResult:true});h.write('g3.json',E);
}
h.write('g3.json',E);return E;
