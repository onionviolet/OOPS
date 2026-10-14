const E={label:'seeded-native',cases:[]};
for(const kind of ['reserve','retort']){
 await reload();await importFile(kind==='retort'?path.join(h.root,'docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r15/g2/fixture/TEST-FIXTURE-R15-G2-retort.txt'):'/private/tmp/r15-g10-g2-fixtures/TEST-FIXTURE-R15-G2-reserve.txt');await page.evaluate(kind=>G.character.name='TEST FIXTURE R15 G10 completion '+kind,kind);await save();
 await feature(kind==='reserve'?'Keep a finite survey-kit reserve':'Plan three retort batches');
 E.cases.push(await faultCase('fa-'+kind+'-completion',async()=>{await page.evaluate(()=>G.advance(3));await stop();},async()=>{await advance(3);},async(done,pending)=>{assert.equal(inv(done,kind==='reserve'?'Prepared survey kit':'Filled retort resin tray'),inv(pending,kind==='reserve'?'Prepared survey kit':'Filled retort resin tray')+(kind==='reserve'?2:1));assert.equal(done.expansion.actors.player.completed[kind==='reserve'?'reference_gameplay.resin_kits':'factorio_retort.batch'],(pending.expansion.actors.player.completed[kind==='reserve'?'reference_gameplay.resin_kits':'factorio_retort.batch']||0)+1);}));h.write('production-failures.json',E);
}
for(const [kind,text] of [['fieldcraft','Apply a pale vial to your own dull plain knife'],['assay','Wash one gummed pin with a clouded charge']]){
 for(const phase of ['acceptance','completion']){
 await reload();await fixture('g3','fixture/TEST-FIXTURE-R15-G3-FA13.txt.gz');await page.evaluate(kind=>G.character.name='TEST FIXTURE R15 G10 '+kind,kind);await save();
 if(kind==='assay'){await feature('Buy one Clouded bench vial');await feature('Buy one Gummed fitting pin');}
 if(phase==='completion')await feature(text);
 const action=async()=>{if(phase==='acceptance')await feature(text);else{await page.evaluate(n=>G.advance(n),kind==='fieldcraft'?3:2);await stop();}};
 const retry=async()=>{if(phase==='acceptance')await feature(text);await advance(kind==='fieldcraft'?3:2);};
 E.cases.push(await faultCase(kind+'-'+phase,action,retry,async(done,pending)=>{assert.equal(jobs(done).filter(j=>j.actorId==='player').length,0);assert.equal(inv(done,kind==='fieldcraft'?'Field fitting knife':'Recovered fitting pin'),inv(pending,kind==='fieldcraft'?'Field fitting knife':'Recovered fitting pin')+1);}));h.write('production-failures.json',E);
 }
}
return E;
