// Test-only control steps posted to harness.mjs. Private inputs are read, never written.
globalThis.assert=(await import('node:assert/strict')).default;
globalThis.privateRoot='/Users/weiwei/code/yet-another-idle-rpg';
globalThis.raw=JSON.parse(fs.readFileSync(root+'/private_packs/p09/pack.json'));
globalThis.recipe=JSON.parse(fs.readFileSync(privateRoot+'/docs/research/novels/world1-full-completion-2026-10-11/route/NATIVE_RECIPE.json'));
globalThis.tmp='/private/tmp/w1-campaign-c01-artifacts';fs.mkdirSync(tmp,{recursive:true});
globalThis.results=globalThis.results||[];
globalThis.HOLD='const __id=setTimeout(()=>{},0);for(let i=0;i<=__id+10;i++){clearTimeout(i);clearInterval(i);}';
globalThis.key=id=>JSON.stringify({id:'p09.'+id});
globalThis.decode=x=>JSON.parse(Buffer.from(x.replace('YAIR-UTF8-1:',''),'base64').toString());
globalThis.stable=s=>({expansion:s.expansion,record:s.content_packs,inventory:s.inventories,gear:s.character.equipment,location:s['current location'],effects:s.active_effects,money:s.character.money});
globalThis.record=(id,data={})=>{results.push({id,label:'seeded-native',status:'PASS',...data});fs.writeFileSync(out+'EVIDENCE.json',JSON.stringify({bundle:log.bundle,results,errors:log.errors},null,2)+'\n');};
globalThis.play=async()=>{await page.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:30000});await page.locator('#loading_screen_play_button').click();};
// Call the existing production speed setter without changing bundle/source.
globalThis.frameEval=async expression=>{
 const cdp=await ctx.newCDPSession(page);await cdp.send('Debugger.enable');
 const object=await cdp.send('Runtime.evaluate',{expression:'window.save_to_file'});
 const bp=await cdp.send('Debugger.setBreakpointOnFunctionCall',{objectId:object.result.objectId});
 let resolve;const paused=new Promise(r=>resolve=r);cdp.once('Debugger.paused',resolve);
 const invoke=cdp.send('Runtime.evaluate',{expression:'window.save_to_file()'});const event=await paused;
 const changed=await cdp.send('Debugger.evaluateOnCallFrame',{callFrameId:event.callFrames[0].callFrameId,expression,returnByValue:true});
 await cdp.send('Debugger.removeBreakpoint',{breakpointId:bp.breakpointId});await cdp.send('Debugger.resume');await invoke;await cdp.detach();
 if(changed.exceptionDetails)throw Error(changed.exceptionDetails.text+' '+changed.result.description);return changed.result.value;
};
globalThis.speed=async n=>{const fn=fs.readFileSync(root+'/dist/bundle.js','utf8').match(/set_speed:\w+=>((?:\w|\$)+)\(\w+\)/)[1];assert.equal(await frameEval(fn+'('+n+')'),n);};
globalThis.start=async(id,startId)=>{
 await page.evaluate(HOLD+'localStorage.clear();');await ctx.clearCookies();
 const index=raw.starts.findIndex(s=>s.id==='p09.'+startId),seed=Math.floor((index+.2)/raw.starts.length*0x100000000);
 await ctx.addInitScript(seed=>{const original=crypto.getRandomValues.bind(crypto);let used=false;crypto.getRandomValues=x=>{if(!used&&x instanceof Uint32Array&&x.length===1){used=true;x[0]=seed;return x;}return original(x);};},seed);
 await page.reload();await play();
 await page.locator('input').evaluateAll((els,name)=>{const el=els.find(e=>e.id.includes('name'));if(!el)throw Error('Name input absent');el.value=name;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));},'TEST FIXTURE W1 C01 '+id);
 await page.getByText('Confirm',{exact:true}).click();
 await page.locator('[data-structured-begin]').evaluate(e=>e.click());assert.equal((await saved()).content_packs.structured.startId,'p09.'+startId);if((await saved())['current location']==='p09.road')await page.locator('[data-structured-action="p09.walk_to_depot"]').evaluate(e=>e.click());await speed(100);
};
globalThis.enabled=async id=>page.locator('[data-structured-action="p09.'+id+'"]').evaluate(e=>!e.disabled);
globalThis.act=async(id,hold=false)=>{
 await page.waitForFunction(id=>{const e=document.querySelector('[data-structured-action="p09.'+id+'"]');return e&&!e.disabled;},id,{timeout:8000});
 assert(await enabled(id),'Unavailable '+id);
 await page.evaluate(({id,hold,HOLD})=>{document.querySelector('[data-structured-action="p09.'+id+'"]').click();if(hold)eval(HOLD);},{id,hold,HOLD});
 let s=await saved();const job=s.expansion.simulation.jobs.find(j=>j.commandId==='p09.'+id);
 if(job&&!hold){await page.waitForFunction(id=>!JSON.parse(localStorage.getItem('save data')).expansion.simulation.jobs.some(j=>j.id===id),job.id,{timeout:600000});s=await saved();}
 return s;
};
globalThis.tick=async n=>{const before=(await saved()).expansion.clock;await page.waitForFunction(t=>JSON.parse(localStorage.getItem('save data')).expansion.clock>=t,before+n,{timeout:600000});return saved();};
globalThis.reload=async()=>{await page.reload();await play();await speed(100);};
globalThis.roundtrip=async label=>{
 await page.evaluate(HOLD+'document.getElementById("save_button").click();');const before=await saved();
 await page.reload();const loaded=await saved();assert.deepEqual(stable(loaded),stable(before));await play();
 await page.evaluate(HOLD);const [dl]=await Promise.all([page.waitForEvent('download'),page.locator('#save_to_file_button').click()]);const file=tmp+'/'+label+'.txt';await dl.saveAs(file);const exported=decode(fs.readFileSync(file,'utf8'));
 await page.evaluate(()=>localStorage.clear());assert.equal(await saved(),null);
 await Promise.all([page.waitForEvent('framenavigated'),page.locator('#saved_file_input').setInputFiles(file)]);await page.waitForLoadState('domcontentloaded');await page.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:30000});
 assert.deepEqual(stable(await saved()),stable(exported));await play();await speed(100);
 record(label,{saveReload:true,exportLiteralFileImport:true,exactState:true,exportSha256:hash(fs.readFileSync(file))});return saved();
};
return 'helpers ready';
