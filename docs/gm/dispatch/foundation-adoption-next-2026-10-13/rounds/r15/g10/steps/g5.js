const E={label:'seeded-native',cases:[]};
for(const shortfall of [false,true]){
 await reload();await fixture('g10','fixture/TEST-FIXTURE-R15-G10-rich-ended.txt');
 if(shortfall){await page.evaluate(()=>G.character.money=40);await save();await reload();}
 const before=await s();assert.equal(before.village_career.debt,50);assert.deepEqual(before.expansion.chronicle.life.experience.taught,[]);
 const preview=await page.locator('#chronicle_heir_leftovers').innerText();assert.match(preview,/kin/);assert.match(preview,shortfall?/40 of 50/:/50 of 50/);
 await Promise.all([page.waitForEvent('domcontentloaded'),page.locator('[data-life="begin-heir"]').evaluate(b=>b.click())]);
 await page.waitForFunction(()=>!localStorage.getItem('heir request'),null,{timeout:60000});await ready();await play();await stop();
 await page.locator('#hero_creation_name_field').fill('TEST FIXTURE R15 G10 '+(shortfall?'shortfall':'kin')+' heir');await page.locator('#hero_creation_panel_confirmation').evaluate(b=>b.click());await stop();
 const heir=await save();const record=heir.expansion.chronicle.life.experience.inheritance;assert.equal(record.recipient,'kin');assert.equal(heir.character.money,shortfall?102:452);assert.equal(record.debtsPaid,shortfall?40:50);assert.ok(!heir.expansion.chronicle.knowledge.routeSignals);assert.equal(heir.village_career.debt,0);
 await page.evaluate(()=>{window.start_dialogue('villageElder');window.start_textline('hello');window.end_dialogue();G.refresh();window.workspaceOpenModule?.('notebook');document.querySelector('#chronicle_panel').open=true;});await click('[data-chronicle="study.routeSignals"]');const studied=await save();assert.ok(studied.expansion.chronicle.knowledge.routeSignals);assert.equal(studied.expansion.clock,heir.expansion.clock+5);assert.equal(studied.character.money,heir.character.money);
 const r={id:shortfall?'debt-shortfall':'kin-papers-debt',preview,money:[before.character.money,heir.character.money],inheritance:record,studyMinutes:5,learned:true,persistence:await persist(shortfall?'heir-shortfall':'heir-kin-papers')};E.cases.push(r);h.write('g5.json',E);
}
return E;
