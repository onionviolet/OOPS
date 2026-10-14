const E=fs.existsSync(path.join(h.evidence,'g6-support.json'))?JSON.parse(fs.readFileSync(path.join(h.evidence,'g6-support.json'))):{label:'seeded-native',cases:[]};
const cmd=async id=>{await page.evaluate(id=>G.management({id}),id);await stop();};
for(const job of ['shipment','foreman','aid'])for(const support of ['leave','contact']){
 if(E.cases.some(c=>c.id===job+'-'+support))continue;
 await reload();await fixture('g1','fixture/fa07-base-new-game-export.txt');await page.evaluate(()=>{G.character.name='TEST FIXTURE R15 G10 courtyard support';G.character.addToInventory([{item_id:'Rough wood log',count:6},{item_id:'Courtyard wood crate',count:1}]);});await mg('Visit the market courtyard');
 if(job==='shipment')await cmd('mg.ship.hear_order');if(job==='foreman')await cmd('mg.foreman.commission');if(job==='aid'){await cmd('mg.aid.sela_request');await cmd('mg.aid.refuse_sela');}
 const base=await save();await cmd(job==='shipment'?'mg.ship.crate.escorted':job==='foreman'?'mg.foreman.execute':'mg.aid.mira_funded_work');const pending=await s();const accepted=jobs(pending).find(j=>j.commandId.startsWith('mg.'));assert.ok(accepted);
 await page.evaluate(([job,support])=>{if(support==='leave')G.forceLocation('Shack');else G.state.simulation.people[job==='shipment'?'mg.bram':job==='foreman'?'mg.orin':'mg.sela'].location='Shack';},[job,support]);await advance(6);let done=await s();assert.equal(jobs(done).length,0);assert.equal(inv(done,'Courtyard wood crate'),inv(base,'Courtyard wood crate'));assert.equal(done.character.money,base.character.money);assert.ok(!done.expansion.actors[job==='foreman'?'mg.orin':'player'].completed[accepted.commandId]);
 for(const site of Object.values(done.expansion.simulation.sites))assert.ok(!site.reservations[accepted.id]);
 await page.evaluate(([job,support])=>{G.forceLocation('Village');if(support==='contact')G.state.simulation.people[job==='shipment'?'mg.bram':job==='foreman'?'mg.orin':'mg.sela'].location='Village';G.refresh();},[job,support]);
 if(job==='foreman'){const logs=inv(done,'Rough wood log');const feeCoins=done.expansion.actors['mg.orin'].resources.coins;await cmd('mg.foreman.retrieve_inputs');done=await save();assert.equal(inv(done,'Rough wood log'),logs+2);assert.equal(done.expansion.actors['mg.orin'].resources.coins,feeCoins);}
 E.cases.push({id:job+'-'+support,refund:true,noOutput:true,noOwnReservation:true,foremanFeeKept:job==='foreman',persistence:await persist('courtyard-'+job+'-'+support)});h.write('g6-support.json',E);
}
return E;
