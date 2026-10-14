const E=JSON.parse(fs.readFileSync(path.join(h.evidence,'production-failures.json')));
for(const [kind,text] of [['assay','Wash one gummed pin with a clouded charge']]){
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
