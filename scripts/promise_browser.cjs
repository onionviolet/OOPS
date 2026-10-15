// Generated saves and isolated browser contexts. Never read personal saves.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {launchChrome,waitForPage,waitGameTime,withTestHooks}=require('./ui_helpers.cjs');
const {openNotebook}=require('./ui_helpers.cjs');
const url=withTestHooks(process.env.YAIRPG_PROOF_URL || 'http://127.0.0.1:18624/'),out=process.env.YAIRPG_PROOF_DIR || '/tmp/yairpg-promise-proof';
fs.mkdirSync(out,{recursive:true});
const wood=JSON.stringify({id:'Rough wood log'}),sid='promise.visitor',visitor='promiseVisitor';
(async()=>{
 const browser=await launchChrome();
 const errors=[],warnings=[],findings=[];let page,context,fingerprint;
 const open=async fixture=>{
  context=await browser.newContext({viewport:{width:1500,height:1050}});
  if(fixture)await context.addInitScript(s=>{if(!localStorage.getItem('save data'))localStorage.setItem('save data',JSON.stringify(s));},fixture);
  page=await context.newPage();page.setDefaultTimeout(18000);
  page.on('pageerror',e=>errors.push(e.stack));page.on('console',m=>{if(['warning','error'].includes(m.type()))warnings.push(m.text());});
  await page.goto(url);await page.getByText('PLAY',{exact:true}).click();
  if(await page.getByText('Confirm',{exact:true}).isVisible())await page.getByText('Confirm',{exact:true}).click();
 };
 const save=async()=>{await page.evaluate(()=>window.saveProgress());return page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));};
 const panel=async()=>{await openNotebook(page);await page.locator('[data-notebook-view="people"]').click();await page.locator('#promise_panel').evaluate(n=>{n.open=true;});};
 const click=async id=>{await panel();await page.locator('#promise_panel [data-promise-command="'+id+'"]').click();};
 const reload=async()=>{await page.reload();await page.getByText('PLAY',{exact:true}).click();await panel();};
 const phase=async value=>waitForPage(page, ([id,v])=>JSON.parse(localStorage.getItem('save data')).expansion.simulation?.situations?.[id]?.phase === v,[sid,value]);
 try{
  await open();assert.equal(await page.locator('#promise_panel').isVisible(),false);
  fingerprint=await page.evaluate(()=>performance.getEntriesByType('resource').find(e=>e.name.includes('/dist/bundle.js?version='))?.name);
  assert.ok(fingerprint.endsWith(fs.readFileSync('index.html','utf8').match(/dist\/bundle\.js\?version=[^&"]+/)[0]));
  await page.getByRole('button',{name:'Talk to someone'}).click();await page.locator('[data-dialogue="villageElder"]').click();
  await page.locator('[data-textline="hello"]').click();await page.locator('.end_dialogue_button').click();
  const base=await save();assert.equal(base.expansion.simulation,null);
  const legacyEncoded=await page.evaluate(()=>window.save_to_file());
  await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('#saved_file_input').setInputFiles({name:'generated-legacy.txt',mimeType:'text/plain',buffer:Buffer.from(legacyEncoded)})]);
  await page.getByText('PLAY',{exact:true}).click();assert.equal((await save()).expansion.simulation,null);
  await context.close();
  const fixture=structuredClone(base);fixture.character.money=20;fixture.inventories.person.main_character[wood]={count:5};
  let helpSave,helpReadySave;
  for(const route of ['evidence','help','declined','unanswered']){
   await open(fixture);await click('promise.begin');const start=await save(),born=start.expansion.simulation.people[visitor].bornAt,quests=structuredClone(start.quests);
   assert.equal(start.expansion.simulation.schema,3);assert.equal(start.expansion.simulation.knowledge.player['promise.claim'].basis.kind,'recollection');
   assert.doesNotMatch(await page.locator('body').innerText(),/Rowan|identification_mistake|frontier\.branch|playerMadePromise/);
   await page.locator('[data-promise-command="promise.help"]').focus();await waitGameTime(page, 1100);assert.equal(await page.locator('[data-promise-command="promise.help"]').evaluate(n=>n === document.activeElement),true);
   await page.screenshot({path:path.join(out,route+'-claim.png'),fullPage:true});
   if(route === 'evidence' || route === 'help'){
    await click(route === 'evidence' ? 'promise.investigate' : 'promise.help');
    const mid=await save();assert.deepEqual(mid.expansion.simulation.jobs.find(j=>j.actorId === 'player').participants,['player',visitor]);
    if(route === 'help'){assert.equal(mid.inventories.person.main_character[wood].count,4);assert.ok(mid.character.stamina_to_full >= start.character.stamina_to_full+3.9);}
    await reload();await phase(route === 'evidence' ? 'evidence_ready' : 'help_ready');
    const waiting=await save();assert.equal(waiting.expansion.simulation.knowledge.player['promise.later'],undefined);if(route === 'help')helpReadySave=waiting;
    const event=page.locator('[data-world-event="promise:meeting"] button');await event.waitFor({state:'visible'});await event.click();
    assert.equal(await page.locator('#promise_panel').evaluate(n=>n.open),true);
    await click('promise.meet_'+route);
   }else{
    if(route === 'declined')await click('promise.decline');
    await reload();await phase(route+'_ready');await click('promise.meet_'+route);
   }
   const result=await save();assert.equal(result.expansion.simulation.situations[sid].phase,'met_'+route);
   assert.equal(result.expansion.simulation.people[visitor].bornAt,born);assert.deepEqual(result.quests,quests);
   assert.equal(result.character.money,20);assert.equal(result.expansion.simulation.claims['promise.visitor'],undefined);
   assert.equal(result.expansion.actors[visitor].resources.coins,route === 'help' ? 2 : 1);
   const text=await page.locator('#promise_panel').innerText();
   if(route === 'evidence')assert.match(text,/mistook you/);
   else if(route === 'help'){assert.match(text,/brace held/);assert.doesNotMatch(text,/Rowan|mistook you/);helpSave=result;}
   else {assert.equal(result.inventories.person.main_character[wood].count,5);assert.match(text,/no agreement|no promise/i);}
   await panel();await page.locator('#promise_panel').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,route+'-later.png'),fullPage:true});
   await reload();const retained=await save();assert.deepEqual(retained.expansion.simulation.situations[sid],result.expansion.simulation.situations[sid]);
   assert.equal(await page.locator('[data-promise-command="promise.meet_'+route+'"]').isVisible(),false);
   if(route === 'help'){
    await click('promise.hear_bracing');const recalled=await save();assert.equal(recalled.expansion.actors.player.sources['promise.bracing_control'],undefined);
    assert.equal(await page.locator('[data-promise-command="promise.pack_brace"]').isVisible(),false);
    await click('promise.lesson');await reload();await waitForPage(page, ()=>!!JSON.parse(localStorage.getItem('save data')).expansion.actors.player.sources['promise.bracing_control']);
    const kit=JSON.stringify({id:'Prepared survey kit'});
    const beforeCancel=await save();await click('promise.pack_brace');await click('cancel');const refunded=await save();assert.equal(refunded.inventories.person.main_character[wood].count,beforeCancel.inventories.person.main_character[wood].count);
    for(let n=1;n<=2;n++){await click('promise.pack_brace');await reload();await waitForPage(page, ([kit,n])=>JSON.parse(localStorage.getItem('save data')).inventories.person.main_character[kit]?.count === n,[kit,n]);}
    helpSave=await save();assert.equal(helpSave.inventories.person.main_character[wood].count,2);assert.equal(helpSave.expansion.actors.player.completed['promise.pack_brace'],2);
    await panel();await page.locator('#promise_panel').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'learned-bracing.png'),fullPage:true});
    findings.push('Recalled description grants no control. A saved paid lesson earns trained control; cancellation returns the reserved log/stamina; two saved native kit productions consume two real logs and actual stamina.');
   }
   findings.push(route+': real controls, distinct later meeting, same visitor, unchanged quests/money and saved aftermath.');
   await context.close();
  }
  await open(helpSave);await panel();const encoded=await page.evaluate(()=>window.save_to_file());
  await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('#saved_file_input').setInputFiles({name:'generated-promise.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)})]);
  await page.getByText('PLAY',{exact:true}).click();await panel();const imported=await save();
  assert.deepEqual(imported.expansion.simulation.situations[sid],helpSave.expansion.simulation.situations[sid]);assert.equal(imported.inventories.person.main_character[wood].count,2);assert.equal(imported.inventories.person.main_character[JSON.stringify({id:'Prepared survey kit'})].count,2);
  findings.push('Legacy and schema3 native file imports retain actual owners and issue no loading reward.');await context.close();
  for(const at of ['introduction','help','meeting','production']){
   await open(['meeting','production'].includes(at) ? helpSave : fixture);
   if(at === 'help')await click('promise.begin');
   if(at === 'meeting'){await context.close();await open(helpReadySave);}
   await panel();
   await page.evaluate(([sid,at])=>{
    const original=Storage.prototype.setItem;
    Storage.prototype.setItem=function(k,v){
     const s=k === 'save data' ? JSON.parse(v).expansion?.simulation : null;
     const selected=at === 'introduction' ? !!s?.situations?.[sid] : at === 'help' ? s?.jobs.some(j=>j.commandId === 'promise.help') : at === 'production' ? s?.jobs.some(j=>j.commandId === 'promise.pack_brace') : s?.situations?.[sid]?.phase === 'met_help';
     if(selected){window.promiseBeforeFailure=localStorage.getItem(k);throw Error('Injected promise quota');}
     return original.call(this,k,v);
    };
   },[sid,at]);
   await click(at === 'introduction' ? 'promise.begin' : at === 'help' ? 'promise.help' : at === 'production' ? 'promise.pack_brace' : 'promise.meet_help');
   assert.equal(await page.evaluate(()=>localStorage.getItem('save data')),await page.evaluate(()=>window.promiseBeforeFailure));
   assert.match(await page.locator('#promise_panel').innerText(),/saving failed/i);
   await reload();const after=await save();
   assert.equal(after.expansion.simulation?.situations?.[sid]?.phase,at === 'introduction' ? undefined : at === 'help' ? 'introduced' : at === 'production' ? 'met_help' : 'help_ready');
   findings.push('Injected '+at+' failure preserves exact durable bytes and rejects partial publication.');await context.close();
  }
  assert.deepEqual(errors,[]);assert.deepEqual(warnings,[]);
  fs.writeFileSync(path.join(out,'result.json'),JSON.stringify({url,fingerprint,findings,errors,warnings},null,2));
  fs.writeFileSync(path.join(out,'generated-help-save.json'),JSON.stringify(helpSave));
  console.log(JSON.stringify({out,findings,errors,warnings},null,2));
 }catch(e){
  fs.writeFileSync(path.join(out,'failure.json'),JSON.stringify({message:e.stack,errors,warnings,text:await page?.locator('body').innerText().catch(()=>null)},null,2));
  await page?.screenshot({path:path.join(out,'failure.png'),fullPage:true}).catch(()=>{});throw e;
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
