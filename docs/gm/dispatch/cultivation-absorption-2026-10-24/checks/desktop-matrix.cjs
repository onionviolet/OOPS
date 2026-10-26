const gate=require('../../cultivation-spacing-2026-10-22/browser-helper.cjs');
gate('desktop-matrix',async h=>{
 const {p,assert,fs,path,out,boot,load,save,roundtrip,gates}=h;await boot();const base='/Users/weiwei/.codex/research/cultivation-absorption-2026-10-24/browser/',sources=[],matrix=[];
 const scenarios=[
 ['cohort','cohort-6Iz7PK/native-admitted-combat-cohort.save.txt','household-cohort','#cohort_battle_panel'],
 ['root','root-retuning-bcGagq/actual-calibrated-body-and-residue.save.txt','root-retuning','#root_retuning_panel'],
 ['thread','rule-relic-NNDs3d/woven-named-carrier.save.txt','vessel-thread','#vessel_thread_panel'],
 ['insights','intents-bZfq6l/field-earned-intent.save.txt','cultivation-insights','#cultivation_intents_panel'],
 ['site','drainage-E0BI9A/S4-real-cargo-and-persistent-aftermath.save.txt','drainage-site','#drainage_site_panel'],
 ['household','cohort-6Iz7PK/same-finish-native-cohort-contributions.save.txt','homes','#home_panel'],
 ['journal','crossings-IOqjxM/exact-recorded-crossings.save.txt','personal-journal','#personal_journal_panel']
 ];
 for(const [label,relative,id,selector]of scenarios){
  console.log('matrix',label);const file=base+relative,text=fs.readFileSync(file,'utf8').trim();sources.push({label,path:file,sha256:require('crypto').createHash('sha256').update(text).digest('hex')});await p.setViewportSize({width:1920,height:1080});await load(JSON.parse(Buffer.from(text.replace(/^YAIR-UTF8-1:/,''),'base64').toString()),'actual-native-'+label+'-prefix');const open=()=>p.getByRole('combobox',{name:'Other known panels'}).selectOption(id);await open();await p.locator(selector).waitFor({state:'visible'});
  if(label==='cohort'){const resume=p.locator('[data-cohort-action="resume"]');if(await resume.count()&&await resume.isEnabled())await resume.press('Enter');assert.equal(await p.evaluate(()=>simulationTestHooks.project('cohort').running),true);assert.equal((await save()).expansion.simulation.sessions.player.nativeBattle.admission.members.length,2);assert.ok(await p.locator('#cohort_attackers').evaluate(n=>n.childElementCount>0));assert.ok(await p.locator('#cohort_defenders').evaluate(n=>n.childElementCount>0));}
  for(const size of [14,21]){
   await p.locator('[data-route-id="customization"]').click();await p.locator(`[data-text-size-preset="${size}"]`).press('Enter');await open();await p.locator(selector).evaluate(n=>{if(n.tagName==='DETAILS')n.open=true;});
   for(const [width,height]of [[1920,1080],[1800,1040],[1536,864]]){
    await p.setViewportSize({width,height});await open();if(label==='journal')await p.getByRole('heading',{name:'Recorded world crossings',exact:true}).scrollIntoViewIfNeeded();else if(label==='cohort')await p.locator('#cohort_attackers').scrollIntoViewIfNeeded();else await p.locator(selector).evaluate(n=>n.scrollIntoView({block:'start'}));
    const fit=await p.locator(selector).evaluate(n=>({font:getComputedStyle(n).fontSize,width:n.clientWidth,scroll:n.scrollWidth}));assert.equal(fit.font,size+'px',label+' uses the actual saved native font');assert.ok(fit.scroll<=fit.width+2,`${label} has horizontal overflow at ${width}/${size}: ${JSON.stringify(fit)}`);matrix.push({label,width,height,size,...fit});await p.screenshot({path:path.join(out,`${label}-${width}-${size}.png`)});
   }
  }
  if(label==='cohort'){await p.locator('[data-cohort-fight="withdraw:player:"]').press('Enter');assert.equal((await save()).expansion.actors.player.facts['cohort.lastOutcome'],'withdrew');}
 }
 fs.writeFileSync(path.join(out,'sources.json'),JSON.stringify(sources));fs.writeFileSync(path.join(out,'matrix.json'),JSON.stringify(matrix));gates.push('Seven actual earned native prefixes and real saved 14/21px profiles across three desktop viewports; current cohort native multi-person render and withdrawal, calibrated root, named carrier, earned insight, observed site, household and lower recorded-crossing surfaces; no horizontal panel content overflow');
},{deterministic:true}).catch(e=>{console.error(e);process.exitCode=1;});
