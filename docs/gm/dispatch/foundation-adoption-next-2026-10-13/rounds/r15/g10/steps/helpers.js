globalThis.stop=()=>page.evaluate(()=>{const n=setTimeout(()=>{},0);for(let i=0;i<n+5;i++){clearTimeout(i);clearInterval(i);}});
globalThis.s=()=>h.saved();
globalThis.save=async()=>{await page.locator('#save_button').evaluate(b=>b.click());return s();};
globalThis.play=async()=>{await page.locator('#loading_screen_play_button').evaluate(b=>b.click());await page.waitForTimeout(50);};
globalThis.ready=()=>page.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:60000});
globalThis.reload=async(start=true)=>{await page.reload({waitUntil:'domcontentloaded'});await ready();if(start){await play();await stop();}};
globalThis.importFile=async(file,start=true)=>{await Promise.all([page.waitForEvent('domcontentloaded',{timeout:60000}),page.locator('#saved_file_input').setInputFiles(file)]);await ready();if(start){await play();await stop();}};
globalThis.fixture=async(group,file)=>{let p=path.join(h.root,'docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r15',group,file);if(p.endsWith('.gz')){const dst='/private/tmp/r15-g10-'+path.basename(p).replace(/\.gz$/,'');fs.writeFileSync(dst,zlib.gunzipSync(fs.readFileSync(p)));p=dst;}await importFile(p);};
globalThis.inv=(v,id)=>v.inventories.person.main_character[JSON.stringify({id})]?.count||0;
globalThis.jobs=v=>v.expansion.simulation.jobs;
globalThis.comp=v=>{const n=structuredClone(v);for(const k of ['savedAt','timestamp','saveTime'])delete n[k];return n;};
globalThis.canonical=v=>JSON.stringify(v, function(k,v){return v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b))):v;});
globalThis.eq=(a,b)=>canonical(a)===canonical(b);
globalThis.click=async(selector,{key=false,disabled=false}={})=>{const b=page.locator(selector).first();if(disabled)return b.isDisabled();assert.equal(await b.isDisabled(),false,'disabled '+selector);if(key){await b.focus();await b.press(key===true?'Enter':key);}else await b.evaluate(b=>b.click());await stop();};
globalThis.act=async(id,opts={})=>{const b=page.locator('#feature_expansion_panel section').filter({has:page.locator('button')}).filter({has:page.locator('[data-feature-command="'+id+'"]')});return click('[data-feature-command="'+id+'"]',opts);};
globalThis.waitJob=async()=>{await reload(); // reload restores timers; play without stopping
await page.reload({waitUntil:'domcontentloaded'});await ready();await play();await page.waitForFunction(()=>{const s=JSON.parse(localStorage.getItem('save data'));return !s.expansion.simulation.jobs.length;},null,{timeout:60000});await stop();return save();};
globalThis.persist=async(label)=>{await stop();await save();const d=await h.exportFile(label+'.txt');await stop();const before=await save();await reload(false);const reloaded=await save();assert.ok(eq(h.groups(before),h.groups(reloaded)),label+' reload mismatch');await page.evaluate(()=>localStorage.removeItem('save data'));await reload(false);await importFile(d.file,false);const imported=await save();assert.ok(eq(h.groups(before),h.groups(imported)),label+' import mismatch');const r={label,reload:true,literalImport:true,file:path.basename(d.file),sha256:d.sha256,clock:before.expansion.clock};h.write(label+'-persistence.json',r);await play();await stop();return r;};
await ready();await play();await page.locator('#hero_creation_name_field').fill('TEST FIXTURE R15 G10 base');await page.locator('#hero_creation_panel_confirmation').click();await stop();return {ready:true,loaded:h.loaded};
