const gate=require('../cultivation-spacing-2026-10-22/browser-helper.cjs');
gate('w3-history',async h=>{
 const {p,boot,enroll,act,save,roundtrip,assert,gates,open}=h;
 await p.setViewportSize({width:1920,height:1080});await boot();await enroll();
 await act('data-mistglass-action','enter');let s=await save();
 assert.ok(s.expansion.mistglassRealm.history.receiptId);assert.equal(s.expansion.loreHistory.receipts.length,1);
 assert.equal(s.expansion.simulation.knowledge.player?.['p23.mistglass.history'],undefined);
 await act('data-mistglass-action','learn');await act('data-mistglass-action','method:history:inspect');
 s=await save();assert.ok(s.expansion.simulation.knowledge.player['p23.mistglass.masonry']);
 const stock=s.inventories.person.main_character;assert.ok(stock['{"id":"Rough wood log"}']?.count,'Baseline owns an ordinary log');
 const logs=stock['{"id":"Rough wood log"}'].count,reserve=s.expansion.simulation.energies.player['p23.mistglass.condensate'].reserve;
 await act('data-mistglass-action','method:history:restore');s=await save();
 assert.equal(s.inventories.person.main_character['{"id":"Rough wood log"}']?.count||0,logs-1);
 assert.equal(s.expansion.worldAdaptation.sluice.route,'brace');assert.equal(s.expansion.simulation.energies.player['p23.mistglass.condensate'].reserve,reserve);
 await roundtrip('w3-historical-restoration',s=>({history:s.expansion.mistglassRealm.history,lore:s.expansion.loreHistory,knowledge:s.expansion.simulation.knowledge.player,world:s.expansion.worlds['p23.mistglass'],sluice:s.expansion.worldAdaptation.sluice,stock:s.inventories.person.main_character}));
 await act('data-mistglass-action','exit');await act('data-mistglass-action','enter');s=await save();assert.equal(s.expansion.loreHistory.receipts.length,1);
 gates.push('Native account, surviving masonry, timber restoration, exact lot debit and retained origin on revisit');await open();
},{deterministic:true}).catch(e=>{console.error(e);process.exitCode=1;});
