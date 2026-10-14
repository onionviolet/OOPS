await start('N1','ST04');
await page.locator('[data-durability-option]').evaluate(el=>{el.checked=true;el.dispatchEvent(new Event('change'));});
let s;
for(const id of recipe.journeys.find(t=>t.id==='ROUTE-N1').commands){
 s=await act(id);
 if(id==='equip_boots_depot'){
  assert.equal(JSON.parse(s.character.equipment.torso.inventory_key).id,'p08.issue_armor');assert(s.equipment_durability.enabled);
  const before=Number((await page.locator('#defense_slot').innerText()).match(/[\d.]+/)[0]);
  await roundtrip('N1-worn');await page.evaluate(()=>window.unequip_item('torso'));
  const after=Number((await page.locator('#defense_slot').innerText()).match(/[\d.]+/)[0]);assert(after<before);record('N1-defense',{before,after});await act('equip_armor_depot');
 }
 if(id==='feed_mare')assert.equal(await enabled('ride_woods'),false);
 if(id==='riding_lesson')assert.equal(await enabled('ride_woods'),false);
 if(id==='ride_woods'){assert.equal(s['current location'],'p08.woods');assert.equal(s.expansion.simulation.people['p08.mare'].location,'p08.woods');record('N1-acquisition-care-riding');}
 if(id==='sell_grass'){assert.equal(s.inventories.person.main_character[key('silver')].count,4);assert.equal(s.expansion.simulation.claims['p08.mushroom01.title'].owner,'p08.buyer');assert.equal(s.expansion.simulation.claims['p08.grass01.title'].owner,'p08.buyer');record('N1-gather-sales',{paid:4});await roundtrip('N1-sales');}
}
assert.equal(s['current location'],'p08.depot');assert.equal(s.expansion.simulation.custody['p08.tack_loan'],undefined);assert.equal(s.expansion.simulation.claims['p08.mare.access'].owner,'p08.horse_master');assert.equal(s.expansion.actors.player.facts['p08.riding_learned'],true);
await roundtrip('N1-return');record('N1-return-custody');return results;
