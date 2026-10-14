const {run,village,assert}=require('./native-lane-helper.inc');
const fs=require('fs'),path=require('path');
run('p10-leisure-memory',async({page,seed,save,click,until,persist,reject,quota,gates,out})=>{
 await seed(village());assert.equal((await save()).p23_leisure_memory,undefined);await click('enrollLeisure');const enrolled=await save();assert.equal(enrolled.p23_leisure_memory.rounds,0);
 await quota(()=>click('dice:3'));assert.equal((await save()).p23_leisure_memory.pending,null);const before=await save();await click('dice:3');const pending=await save();assert.equal(pending.p23_leisure_memory.pending.id,1);assert.equal(pending.character.money,before.character.money-1);const draw=pending.p23_leisure_memory.pending.seedAfter;
 await persist('paid-pending-dice',s=>({memory:s.p23_leisure_memory,streams:s.expansion.streams}));const finished=await until(s=>s.p23_leisure_memory.rounds===1);assert.equal(finished.p23_leisure_memory.pending,null);assert.ok(finished.life_record.recent.some(r=>r.text.includes('target dice')));assert.ok(draw>0);await persist('settled-dice',s=>s.p23_leisure_memory);
 await click('meetEda');await click('edaHelp');const helped=await save();assert.equal(helped.p23_leisure_memory.response,'help');assert.equal(helped.expansion.actors['p23.leisure.eda'].resources.coins,1);await persist('actual-eda-kindness',s=>({memory:s.p23_leisure_memory,purse:s.expansion.actors['p23.leisure.eda'].resources.coins}));await until(s=>s.expansion.clock>=s.p23_leisure_memory.helpAt+2);await click('edaTalk');const offer=await save();assert.equal(offer.p23_leisure_memory.offer,'ready');await persist('eda-reciprocal-offer',s=>s.p23_leisure_memory);const money=(await save()).character.money;await click('dice:2');const sponsored=await save();assert.equal(sponsored.p23_leisure_memory.pending.fee,0);assert.equal(sponsored.character.money,money);assert.equal(sponsored.expansion.actors['p23.leisure.eda'].resources.coins,0);await until(s=>s.p23_leisure_memory.rounds===2);await persist('actual-eda-sponsored-round',s=>({memory:s.p23_leisure_memory,purse:s.expansion.actors['p23.leisure.eda'].resources.coins}));await reject('p23_leisure_memory');gates.push('real paid native two-minute seeded round, native biography settlement and Eda actual coin custody');
 // Control-only prerequisite: use this check's actual settled family progress,
 // import one remaining HP and the existing combat location's admission. The
 // faint, native counter increment and biography below are real combat events.
 const beforeDefeat=await save(),control=structuredClone(beforeDefeat);
 const hpText=await page.locator('#character_health_value').innerText();
 const hp=hpText.match(/([\d.]+)\s*\/\s*([\d.]+)/);assert.ok(hp,'Native health display exposes actual current/max HP');
 control.character.hp_to_full=Number(hp[2])-1;control.options.auto_return_to_bed=false;
 control.availabilities.location['Infested field']=1;
 const file=path.join(out,'p10-existing-native-one-HP-prerequisite.save.txt');
 fs.writeFileSync(file,'YAIR-UTF8-1:'+Buffer.from(JSON.stringify(control)).toString('base64'));
 await Promise.all([page.waitForNavigation(),page.locator('#saved_file_input').setInputFiles(file)]);
 await page.locator('#loading_screen_play_button:not(.none_display)').click();
 assert.deepEqual((await save()).p23_leisure_memory,beforeDefeat.p23_leisure_memory);
 const deaths=beforeDefeat.total_deaths||0,memories=s=>s.life_record.recent.filter(r=>r.text.includes('lost consciousness'));
 assert.equal(beforeDefeat.p23_leisure_memory.defeatCount,deaths);
 await page.evaluate(()=>window.change_location({location_id:'Infested field'}));
 const fainted=await until(s=>s.total_deaths===deaths+1&&s['current location']==='Village');
 assert.equal(fainted.native_encounter,null);assert.ok(fainted.active_effects.Recovering);
 assert.equal(fainted.p23_leisure_memory.defeatCount,deaths+1);
 assert.equal(memories(fainted).length,memories(beforeDefeat).length+1);
 const memory=memories(fainted).at(-1);assert.equal(memory.kind,'memory');assert.equal(memory.worldId,'base.frontier');
 assert.equal(memory.text,'You lost consciousness and began recovering.');
 assert.ok(memory.id>=beforeDefeat.life_record.nextId);
 await persist('actual-native-faint-and-leisure-memory',s=>({deaths:s.total_deaths,memory:s.p23_leisure_memory,biography:memories(s)}));
 await page.waitForTimeout(2200);const noReplay=await save();
 assert.equal(noReplay.total_deaths,deaths+1);assert.equal(noReplay.p23_leisure_memory.defeatCount,deaths+1);
 assert.deepEqual(memories(noReplay),memories(fainted));
 gates.push('one actual native combat faint increments the existing defeat counter and enrolled leisure memory once; known-only biography, native recovery/return, Save/reload/Export/literal-file Import and no replay');
}).catch(e=>{console.error(e);process.exitCode=1;});
