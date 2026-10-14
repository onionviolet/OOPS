// Fresh-origin natural Village transactions. Only the external HackTimer worker
// is stopped after mount, keeping unrelated game ticks out of exact comparisons.
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=process.cwd(),out=path.join(__dirname,'evidence'),origin='http://127.0.0.1:22460';
const settle=ms=>new Promise(r=>setTimeout(r,ms)),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{
 const {decodeSaveFile}=await import(path.join(root,'src/save_files.js'));
 const {generateVillageLaw}=await import(path.join(root,'src/mixture_rules.js'));
 const {resolveMixture,mixtureKey}=await import(path.join(root,'src/mixture_state.js'));
 const {drawUnit}=await import(path.join(root,'src/seeded_streams.js'));
 fs.mkdirSync(out,{recursive:true});const results=[];
 const scope=s=>({mixtures:s.mixtures,inventory:s.inventories,streams:s.expansion.streams,appearances:s.expansion.productAppearances,effect:s.active_effects});
 const next=s=>generateVillageLaw(s.mixtures.ruleLaws.root,s.mixtures.ruleLaws.epoch+1);
 const nativeNext=s=>drawUnit(structuredClone(s.expansion),'craft','cb-t3-proof-next');
 for(const [width,height]of [[1366,768],[1600,1000]]){
  const profile='/private/tmp/cb-t3-profile-natural-'+width+'-'+Date.now();
  const ctx=await chromium.launchPersistentContext(profile,{channel:'chrome',headless:true,viewport:{width,height},acceptDownloads:true});
  const page=ctx.pages()[0],errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(12000);let ctx2;
  const read=()=>page.evaluate(()=>localStorage.getItem('save data'));
  const save=async()=>{await page.locator('#save_button').click();await settle(80);return JSON.parse(await read());};
  const freeze=async p=>{await settle(650);for(const w of p.workers())await w.evaluate(()=>self.close());await settle(80);};
  const boot=async(p,name)=>{await p.clock.setFixedTime(new Date('2026-10-14T20:00:00.000Z'));await p.goto(origin+'/?harvest-inspector=1');await p.locator('#loading_screen_play_button').click();await p.locator('#hero_creation_name_field').fill(name);await p.locator('#hero_creation_panel_confirmation').click();await freeze(p);};
  const notice=()=>page.locator('#mixture_notice').innerText();
  const mix=async()=>{await page.locator('#mixture_craft').click();assert.match(await notice(),/Mixture owned/);};
  const drink=async id=>{const row=page.locator('#mixture_products > div').filter({has:page.locator('button')});const lines=await row.all();for(const line of lines){const k=JSON.parse(await line.getAttribute('data-mixture-product'));if(k.mixture===id){await line.getByRole('button',{name:/drink one dose/i}).click();return;}}throw Error('Missing native owned dose');};
  try{
   await boot(page,'TEST FIXTURE CB T3 NATURAL '+width);
   const served=await page.request.get(origin+'/dist/bundle.js'),buildHash=hash(await served.body());assert.equal(buildHash,hash(fs.readFileSync(path.join(root,'dist/bundle.js'))));
   const start=await save();assert.equal(start.character.money,102);assert.equal(start.mixtures,undefined);
   await page.locator('#village_mixing_open').click();
   for(let i=0;i<4;i++){await page.getByRole('button',{name:'Buy 1 (8 coins)',exact:true}).click();await page.getByRole('button',{name:'Buy 1 (2 coins)',exact:true}).click();}
   const bought=await save();assert.equal(bought.character.money,62);
   await page.locator('#mixture_process').selectOption('boil');await mix();
   const legacy=await save(),old=Object.values(legacy.mixtures.products)[0];assert.equal(old.revision,1);assert.equal(legacy.mixtures.ruleLaws,undefined);
   await page.locator('#mixture_method').selectOption('responsive@2');
   const preFailure=await save(),raw=await read();
   await page.evaluate(()=>{globalThis.cbOriginalSetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='save data')throw Error('CB T3 forced durable failure');return globalThis.cbOriginalSetItem.call(this,k,v);};});
   await page.locator('#mixture_craft').click();assert.match(await notice(),/forced durable failure/);assert.equal(await read(),raw);
   await page.evaluate(()=>{Storage.prototype.setItem=globalThis.cbOriginalSetItem;delete globalThis.cbOriginalSetItem;});
   const afterFailure=await save();assert.deepEqual(scope(afterFailure),scope(preFailure));assert.equal(afterFailure.character.money,preFailure.character.money);
   await mix();const mixed=await save(),p=Object.values(mixed.mixtures.products).find(p=>p.revision===2);
   assert.ok(p);assert.equal(mixed.mixtures.ruleLaws.laws[0].reason,'causal_mix');assert.equal(mixed.mixtures.knowledge[p.id],undefined);
   assert.notEqual(p.dose.health,resolveMixture(mixed.mixtures,p.inputs,p.process).dose.health);
   assert.equal(mixed.inventories.person.main_character[mixtureKey(p)].count,1);
   assert.equal(mixed.inventories.person.main_character['{"id":"River bellleaf"}'].count,2);
   assert.equal(mixed.character.money,62);
   const box=await page.locator('#village_mixing_panel').boundingBox();assert.ok(box.x>=0&&box.x+box.width<=width&&box.height>0,'counter within viewport width');
   await page.screenshot({path:path.join(out,`natural-mixed-${width}.png`)});
   await page.getByRole('button',{name:'Back to local actions',exact:true}).click();
   await page.locator('#harvest_inspector > summary').click();await settle(100);
   const trace=await page.locator('[data-chain="rules"]').innerText();assert.match(trace,/village\.mix@2/);assert.match(trace,/rule:village.response/);
   assert.equal(await page.locator('#harvest_inspector button,#harvest_inspector input').count(),0);
   assert.deepEqual(scope(await save()),scope(mixed));
   await page.screenshot({path:path.join(out,`developer-trace-${width}.png`)});
   await page.locator('#harvest_inspector > summary').click();await page.locator('#village_mixing_open').click();
   const beforeTooltip=await page.locator('#character_health_tooltip').textContent();
   await drink(p.id);const used=await save(),effect=used.active_effects['Village mixture exposure'];
   assert.equal(effect.mixtureExposure.revision,2);assert.deepEqual(effect.mixtureExposure.dose,p.dose);assert.equal(effect.effects.stats.health_regeneration_flat.flat,p.dose.health);
   const afterTooltip=await page.locator('#character_health_tooltip').textContent();assert.notEqual(afterTooltip,beforeTooltip);assert.ok(afterTooltip.includes(String(Math.round(10*p.dose.health)/10)));
   assert.equal(used.mixtures.knowledge[p.id].observed,true);
   await page.screenshot({path:path.join(out,`natural-drink-${width}.png`)});
   // An old product was brewed before enrollment and is still owned unchanged.
   await drink(old.id);const oldUsed=await save();assert.equal(oldUsed.active_effects['Village mixture exposure'].mixtureExposure.revision,1);assert.deepEqual(oldUsed.active_effects['Village mixture exposure'].mixtureExposure.dose,old.dose);assert.deepEqual(oldUsed.mixtures.products[old.id],old);
   // Another paid responsive occurrence leaves a new exposure for restoration.
   await mix();await drink(p.id);
   await page.getByRole('button',{name:'Save observed method',exact:true}).first().click();
   const beforeRepeat=await save();await page.getByRole('button',{name:'Queue learned method',exact:true}).first().click();
   const pending=await save();assert.equal(pending.mixtures.job.product,p.id);assert.equal(pending.mixtures.job.remaining,3);assert.deepEqual(pending.mixtures.job.held,p.inputs);
   await page.screenshot({path:path.join(out,`native-repeat-pending-${width}.png`)});
   await page.locator('#mixture_cancel').click();const cancelled=await save();assert.equal(cancelled.mixtures.job,null);assert.deepEqual(cancelled.inventories,beforeRepeat.inventories);
   await mix();const beforeShortage=await save();await page.locator('#mixture_craft').click();assert.match(await notice(),/Shortage/);const afterShortage=await save();assert.deepEqual(scope(afterShortage),scope(beforeShortage));assert.equal(afterShortage.character.money,beforeShortage.character.money);
   const final=afterShortage;
   const download=page.waitForEvent('download');await page.locator('#save_to_file_button').click();const literal='/private/tmp/cb-t3-natural-'+width+'-'+Date.now()+'.txt';await(await download).saveAs(literal);
   const exported=decodeSaveFile(fs.readFileSync(literal,'utf8'),'v0.6');assert.deepEqual(exported,final,'Export exact full envelope');
   await page.reload();await page.locator('#loading_screen_play_button').click();await freeze(page);const reloaded=await save();assert.deepEqual(scope(reloaded),scope(final),'reload retained native owners');assert.deepEqual(next(reloaded),next(final));assert.equal(nativeNext(reloaded),nativeNext(final));
   ctx2=await chromium.launchPersistentContext('/private/tmp/cb-t3-profile-import-'+width+'-'+Date.now(),{channel:'chrome',headless:true,viewport:{width,height},acceptDownloads:true});const p2=ctx2.pages()[0];p2.on('pageerror',e=>errors.push('import:'+e.message));p2.setDefaultTimeout(12000);
   await boot(p2,'TEST FIXTURE CB T3 IMPORT '+width);
   await Promise.all([p2.waitForNavigation({waitUntil:'domcontentloaded'}),p2.locator('#saved_file_input').setInputFiles(literal)]);
   const rawImport=await p2.evaluate(()=>localStorage.getItem('save data'));assert.equal(rawImport,JSON.stringify(exported),'literal Import exact full bytes');
   await p2.locator('#loading_screen_play_button').click();await freeze(p2);await p2.locator('#save_button').click();await settle(80);const imported=JSON.parse(await p2.evaluate(()=>localStorage.getItem('save data')));
   assert.deepEqual(scope(imported),scope(final));assert.deepEqual(next(imported),next(final));assert.equal(nativeNext(imported),nativeNext(final));
   await p2.locator('#village_mixing_open').click();await p2.screenshot({path:path.join(out,`literal-import-${width}.png`)});
   // Ordinary URL must not mount a developer truth surface.
   await page.goto(origin+'/');await page.locator('#loading_screen_play_button').click();await freeze(page);assert.equal(await page.locator('#harvest_inspector').count(),0);
   assert.deepEqual(errors,[]);
   const result={label:'natural',viewport:`${width}x${height}`,profile,literal,buildHash,paidSupplies:40,moneyBefore:102,moneyAfter:62,responsivePaidOccurrences:3,nativeLearnRepeatCancelExact:true,nativeShortageNoDebit:true,causalFreezeBeforeUse:true,retainedTraceShown:true,nativeHealthTooltipChanged:true,savedNativePayloadExact:true,oldRevisionOneDrinkExact:true,forcedWriteFailureAllOwnersUnchanged:true,exportFullEnvelopeExact:true,reloadOwnersExact:true,literalImportFullBytesExact:true,importOwnersExact:true,nextLawExact:true,nextNativeDrawExact:true,ordinaryUrlInspectorAbsent:true,pageErrors:errors};results.push(result);
   fs.writeFileSync(path.join(out,'proof.json'),JSON.stringify({generatedTruthOmitted:true,results},null,2));console.log(JSON.stringify(result));
  }catch(error){await page.screenshot({path:path.join(out,`failure-${width}.png`)});throw error;}finally{if(ctx2)await ctx2.close();await ctx.close();}
 }
})().catch(e=>{console.error('T3 proof failed:',e.message);process.exitCode=1;});
