const gate=require('./browser-helper.cjs');
gate('sluice',async h=>{
 const {p,assert,gates,boot,enroll,act,save,played,roundtrip,out,path,open,fs}=h;
 const steps=[];
 const snap=s=>{const e=s.expansion,en=e.simulation?.energies?.player||{},k=Object.keys(en).find(k=>/mist/i.test(k))||Object.keys(en)[0];
  return {reserve:en[k]?.reserve,reserveKey:k,coins:s.character.money,reputation:s.character.reputation,clock:e.clock,historyId:e.mistglassRealm?.history?.id,sluice:e.worldAdaptation?.sluice,technique:e.worldAdaptation?.techniques?.selected};};
 const sl=()=>p.locator('[data-mistglass-action="sluice"]');
 const panelText=()=>p.locator('#p23_mistglass_panel').innerText();
 const rec=(name,extra={})=>save().then(s=>{const o={name,...snap(s),...extra};steps.push(o);console.log(JSON.stringify(o));return o;});
 await p.setViewportSize({width:1920,height:1080});await boot();
 await p.evaluate(()=>{document.querySelector('[data-open-projects]')?.click();});
 await enroll();await act('data-mistglass-action','enter');await act('data-mistglass-action','learn');
 await open();await p.locator('#p23_mistglass_panel').waitFor({state:'visible'});
 // item 1
 const label0=(await sl().innerText()).trim(),t0=await panelText();
 assert.match(label0,/^Clear the jammed outflow sluice · \d+ condensate, (\+2 coins|\+1 Village standing)$/);
 assert.match(t0,/Outflow sluice:/);assert.match(t0,/grandmother|mill race/);
 const pays=/coins/.test(label0)?'coins':'reputation';
 const history=(t0.match(/[^\n]*(grandmother|mill race)[^\n]*/)||[])[0];
 const r0=await rec('after-learn',{label:label0,history,pays,paragraph:(t0.match(/Outflow sluice:[^\n]*/)||[])[0],disabled:await sl().isDisabled(),title:await sl().getAttribute('title')});
 gates.push('1: sluice button + Outflow sluice paragraph + history account present');
 // item 2
 assert.ok(r0.reserve<2000,'reserve under 2 condensate: '+r0.reserve);
 assert.equal(r0.disabled,true);assert.match(r0.title,/Needs 2 condensate/);
 gates.push('2: disabled with Needs 2 condensate');
 // item 3
 await act('data-mistglass-action','method:settling');await played(49);
 let s=await save();assert.equal(s.expansion.worldAdaptation.techniques.minutes.settling,48);
 await open();
 const label1=(await sl().innerText()).trim();assert.match(label1,/· 1 condensate,/);
 const before=await rec('integrated-before-clear',{label:label1,disabled:await sl().isDisabled(),stage:(await panelText()).match(/Still-pool refinement: Integrated/)?.[0]});
 assert.ok(before.reserve>=1000);assert.equal(before.disabled,false);
 await sl().press('Enter');
 await open();
 const afterT=await panelText();
 const after=await rec('after-clear',{label:(await sl().innerText()).trim(),disabled:await sl().isDisabled(),title:await sl().getAttribute('title')});
 await p.locator('#p23_mistglass_panel').evaluate(n=>{n.open=true;n.scrollIntoView({block:'start'});});
 await p.screenshot({path:path.join(out,'sluice-panel-after-clear.png')});
 const dMist=before.reserve-after.reserve,dCoins=after.coins-before.coins,dRep=(after.reputation?.Village??after.reputation?.village??0)-(before.reputation?.Village??before.reputation?.village??0);
 steps.push({name:'deltas',reserveDropMilli:dMist,coinDelta:dCoins,reputationDelta:dRep,note:'reserve may include one advance tick of accrual'});
 console.log('deltas',dMist,dCoins,dRep,JSON.stringify(before.reputation),JSON.stringify(after.reputation));
 assert.equal(after.sluice.cleared,1);assert.equal(dMist,1000);
 if(pays==='coins')assert.equal(dCoins,2);else assert.equal(dRep,1);
 assert.equal(after.disabled,true);assert.match(after.title,/runs clear.*silts up again in \d+ played minutes/);
 gates.push('3: clear paid '+pays+', button disabled with silt reason; reserve drop '+dMist);
 // item 4
 const proj=s=>{const x=snap(s);delete x.clock;return x;};
 const {reloaded,literal}=await roundtrip('sluice',proj);
 const fin=[snap(reloaded),snap(literal)];
 steps.push({name:'reloaded',...fin[0]},{name:'literal-import',...fin[1]});
 for(const f of fin){assert.equal(f.historyId,after.historyId);assert.equal(f.sluice.cleared,1);assert.equal(f.coins,after.coins);assert.deepEqual(f.reputation,after.reputation);}
 const post=await rec('after-import');assert.equal(post.historyId,after.historyId);assert.equal(post.sluice.cleared,1);
 gates.push('4: history id, sluice record, reserve/coins/reputation identical through save/reload/export/import');
 fs.writeFileSync(path.join(out,'sluice-steps.json'),JSON.stringify({pays,steps},null,2));
},{deterministic:true}).catch(e=>{console.error(e);process.exitCode=1;});
