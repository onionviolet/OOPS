const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
h.fullDiff=(a,b)=>[...new Set([...Object.keys(a),...Object.keys(b)])].filter(k=>k!=='saved_at'&&JSON.stringify(stable(a[k]))!==JSON.stringify(stable(b[k])));
h.advance=async n=>{for(let i=0;i<n;i++)await page.clock.fastForward(1000);};
h.persist=async name=>{const a=await h.save();await h.reload();const b=await h.saved();await h.play();const f=await h.exportFile(name+'.txt');const exported=JSON.parse(Buffer.from(fs.readFileSync(f.file,'utf8').trim().split(':')[1],'base64'));await page.evaluate(()=>localStorage.clear());await h.reload();await h.importFile(f.file);const c=await h.saved();const r={name,reloadExact:h.same(a,b),reloadDiff:h.diff(a,b),fullReloadDiff:h.fullDiff(a,b),fullImportDiff:h.fullDiff(exported,c),importExact:h.same(exported,c),importDiff:h.diff(exported,c),exportAfterPlayDiff:h.diff(a,exported),digest:h.digest(c),sha256:f.sha256};h.write(name+'-persistence.json',r);await h.play();if(!r.reloadExact||!r.importExact||r.fullReloadDiff.length||r.fullImportDiff.length)throw Error('Persistence mismatch '+JSON.stringify(r));return r;};
h.record=async(name)=>{const s=await h.save(),r={name,hero:s.character.name,inventory:Object.fromEntries(Object.entries(s.inventories.person.main_character).map(([k,v])=>[k,v.count])),nativeVitals:{hp_to_full:s.character.hp_to_full,stamina_to_full:s.character.stamina_to_full},digest:h.digest(s,Object.keys(s.expansion.actors).filter(k=>/orr|vale|neri|partyPartner/.test(k))),facts:s.expansion.actors.player.facts,worlds:s.expansion.worlds,sites:s.expansion.simulation.sites,knowledge:s.expansion.simulation.knowledge.player,session:s.expansion.simulation.sessions.player,errors:[...h.errors],loaded:h.loaded.slice(-1)};h.write(name+'.json',r);return r.digest;};

h.combatClick=async(text)=>{for(let i=0;i<60;i++){await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true));const b=page.getByRole('button',{name:text}).filter({visible:true});if(await b.count()&&await b.first().isEnabled())return h.click(text);await page.clock.runFor(200);}throw Error('Combat choice stayed unavailable: '+text);};


h.click=async(text,{exact=false,nth=0}={})=>{
 const find=()=>page.getByRole('button',{name:text,exact}).filter({visible:true});
 await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true));
 let b=find();
 if(await b.count()<=nth)for(const tabName of ['Here','Practice','People']){
   const tab=page.getByText(tabName,{exact:true}).filter({visible:true});if(!await tab.count())continue;
   await tab.first().click();await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true));b=find();if(await b.count()>nth)break;
 }
 if(await b.count()<=nth)throw Error('No visible button '+text);
 if(!await b.nth(nth).isEnabled())throw Error('Disabled button '+text);
 await b.nth(nth).scrollIntoViewIfNeeded();await b.nth(nth).evaluate(el=>el.click());await page.waitForTimeout(250);
};
return 'helpers ready';
