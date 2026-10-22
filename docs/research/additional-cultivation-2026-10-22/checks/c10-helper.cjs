const gate=require('./browser-helper.cjs');
gate('c10-helper',async h=>{
 const {p,assert,gates,save,play,played,roundtrip,out,path}=h;
 await p.setViewportSize({width:1920,height:1080});await p.goto(process.env.URL+'?test_hooks=1');await play();
 const open=async()=>{await p.getByLabel('Other known panels',{exact:true}).selectOption('homes');await p.locator('#home_panel').waitFor({state:'visible'});await p.locator('#home_panel').evaluate(n=>n.querySelectorAll('details').forEach(d=>d.open=true));};
 const act=async id=>{await open();const b=p.locator(`[data-home-action="${id}"]`);await b.waitFor({state:'visible'});assert.equal(await b.isEnabled(),true,id);await b.press('Enter');};
 await act('start:ducal');await open();
 const key=id=>JSON.stringify({id}),keeper='home.manor.keeper',steward='home.manor.steward';
 const stock=s=>s.expansion.simulation.owners[keeper],resources=(s,id)=>s.expansion.actors[id].resources;
 const before=await save();const q=await p.locator('[data-home-action="staff:gather"]').innerText();assert.match(q,/2 household coins/);assert.match(q,/20 of his energy/);assert.match(q,/30 min/);assert.match(q,/2 Rough wood log \+ 3 Home dry grass/);
 await act('staff:gather');let pending=await save(),job=pending.expansion.simulation.jobs.find(j=>j.commandId==='home.staff.gather');assert.equal(job.actorId,keeper);
 assert.equal(resources(pending,steward)['home.estateFunds'],resources(before,steward)['home.estateFunds']-2);assert.deepEqual(stock(pending),stock(before));
 await open();assert.equal(await p.locator('[data-home-action="staff:gather"]').isEnabled(),false);assert.equal(await p.locator('[data-home-action="staff:repair"]').isEnabled(),false);
 gates.push('Native gather quote matches reserved named actor, time, energy and finite treasury; duplicate/conflicting orders disabled');
 await roundtrip('helper-pending',s=>({jobs:s.expansion.simulation.jobs,stock:stock(s),treasury:resources(s,steward)['home.estateFunds']}));
 await played(30);let done=await save();assert.equal(done.expansion.simulation.jobs.some(j=>j.commandId==='home.staff.gather'),false);
 assert.equal(stock(done)[key('Rough wood log')],(stock(before)[key('Rough wood log')]||0)+2);assert.equal(stock(done)[key('Home dry grass')],(stock(before)[key('Home dry grass')]||0)+3);
 assert.equal(resources(done,keeper)['home.wages'],(resources(before,keeper)['home.wages']||0)+2);
 gates.push('Completion delivers actual supplies and wages once into Toma custody');
 await roundtrip('helper-settled',s=>({stock:stock(s),wages:resources(s,keeper)['home.wages']}));
 await act('staff:repair');await played(15);let used=await save();assert.equal(stock(used)[key('Rough wood log')],stock(done)[key('Rough wood log')]-1);assert.equal(stock(used)[key('Home dry grass')],stock(done)[key('Home dry grass')]-2);
 gates.push('Existing native roof repair consumes delivered stock for a useful result');
 await roundtrip('helper-used-supplies',s=>({stock:stock(s),repair:resources(s,'player')['home.repair.manor']}));
 await act('staff:gather');pending=await save();job=pending.expansion.simulation.jobs.find(j=>j.commandId==='home.staff.gather');await act('cancel_staff:'+job.id);let cancelled=await save();assert.equal(cancelled.expansion.simulation.jobs.some(j=>j.commandId==='home.staff.gather'),false);
 gates.push('Discussed cancellation frees the reserved helper without completion output');
 for(const [w,hh]of [[1920,1080],[1800,1040],[1536,864]])for(const size of [14,21]){await p.setViewportSize({width:w,height:hh});await open();await p.locator('#home_panel').evaluate((n,size)=>{n.style.fontSize=size+'px';},size);await p.locator('[data-home-action="staff:gather"]').scrollIntoViewIfNeeded();await p.screenshot({path:path.join(out,`helper-${w}-${size}.png`)});}
},{deterministic:true}).catch(e=>{console.error(e);process.exitCode=1;});
