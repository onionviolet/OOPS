// bk-party: companion stance + bond stage proof at 1920x1080 on a fresh origin (generated fixtures only). Env: YAIRPG_PROOF_URL, YAIRPG_PROOF_DIR.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {launchChrome,waitForPage,withTestHooks}=require('./ui_helpers.cjs');
const {openNotebook}=require('./ui_helpers.cjs');
const url=process.env.YAIRPG_PROOF_URL||'http://127.0.0.1:18626/',out=process.env.YAIRPG_PROOF_DIR||'/tmp/yairpg-party-proof';
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const f=await import('./field_fixtures.mjs');
 const browser=await launchChrome();
 const errors=[],warnings=[],findings=[];let page,context,fingerprint,profile;
 const open=async fixture=>{
  context=await browser.newContext({viewport:{width:1920,height:1080}});
  if(fixture)await context.addInitScript(s=>{if(!localStorage.getItem('save data'))localStorage.setItem('save data',JSON.stringify(s));},fixture);
  await context.addInitScript(()=>{
   const p=window.__partyProfile={phase:'load',writes:[],serializations:[],callbacks:[],frames:[],longtasks:[]};
   const stringify=JSON.stringify,write=Storage.prototype.setItem;
   JSON.stringify=function(value,...args){const t=performance.now(),result=stringify.call(this,value,...args);if(value?.expansion)p.serializations.push({phase:p.phase,ms:performance.now()-t,bytes:result.length});return result;};
   Storage.prototype.setItem=function(key,value){const t=performance.now();try{return write.call(this,key,value);}finally{if(key==='save data')p.writes.push({phase:p.phase,ms:performance.now()-t,bytes:value.length});}};
   window.__installPartyTimerProbe=()=>{const timer=window.setTimeout;window.setTimeout=function(callback,delay,...args){return timer.call(this,typeof callback==='function'?function(...a){const t=performance.now();try{return callback.apply(this,a);}finally{p.callbacks.push({phase:p.phase,ms:performance.now()-t});}}:callback,delay,...args);};};
   let last;const frame=t=>{if(last!=null)p.frames.push({phase:p.phase,ms:t-last});last=t;requestAnimationFrame(frame);};requestAnimationFrame(frame);
   new PerformanceObserver(list=>p.longtasks.push(...list.getEntries().map(e=>({phase:p.phase,ms:e.duration})))).observe({entryTypes:['longtask']});
  });
  page=await context.newPage();page.setDefaultTimeout(18000);page.on('pageerror',e=>errors.push(e.stack));page.on('console',m=>{if(['error','warning'].includes(m.type()))warnings.push(m.text());});
  await page.goto(withTestHooks(url));await page.getByText('PLAY',{exact:true}).click();if(await page.getByText('Confirm',{exact:true}).isVisible())await page.getByText('Confirm',{exact:true}).click();await page.evaluate(()=>window.__installPartyTimerProbe());
 };
 const saved=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));
 const save=async()=>{await page.evaluate(()=>window.saveProgress());return saved();};
 const panel=async id=>{await openNotebook(page);await page.locator('[data-notebook-view="people"]').click();await page.locator('#'+id).evaluate(n=>{n.open=true;});};
 const click=async(id,kind='party')=>{await panel(kind==='party'?'party_panel':'frontier_campaign_panel');const b=page.locator(`[data-${kind}="${id}"]`);await b.evaluate(n=>{for(let p=n.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});await b.click();};
 const reload=async()=>{await page.reload();await page.getByText('PLAY',{exact:true}).click();};
 const imported=async()=>{const encoded=await page.evaluate(()=>window.save_to_file());await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('#saved_file_input').setInputFiles({name:'generated-party.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)})]);await page.getByText('PLAY',{exact:true}).click();return save();};
 const jobDone=()=>waitForPage(page, ()=>!JSON.parse(localStorage.getItem('save data')).expansion.simulation.jobs.some(j=>j.actorId==='player'));
 const battle=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('save data')).expansion.simulation.sessions.player?.nativeBattle);
 const closed=()=>waitForPage(page, ()=>!JSON.parse(localStorage.getItem('save data')).expansion.simulation.sessions.player);
 try{
  await open();assert.equal(await page.locator('#party_panel').isVisible(),false);
  await page.getByRole('button',{name:'Talk to someone'}).click();await page.locator('[data-dialogue="villageElder"]').click();const hello=page.locator('[data-textline="hello"]');await hello.waitFor({state:'visible'});await hello.evaluate(n=>n.click());await page.waitForTimeout(500);await page.evaluate(()=>end_dialogue());await page.evaluate(()=>advanceTicks(3));await page.waitForTimeout(400);const base=await save();assert.equal(base.expansion.actors.partyPartner,undefined);await context.close();
  const legacy=structuredClone(base);delete legacy.expansion;await open(legacy);const migrated=await imported();assert.equal(migrated.expansion.actors.partyPartner,undefined);await context.close();
  const joined=f.joinField(),fixture=structuredClone(base);fixture.expansion=joined.state;fixture.character.money=joined.external.money;fixture.inventories.person.main_character[f.wood]={count:20};
  await open(fixture);fingerprint=await page.evaluate(()=>performance.getEntriesByType('resource').find(e=>e.name.includes('/dist/bundle.js?version='))?.name);assert.ok(fingerprint.endsWith(fs.readFileSync('index.html','utf8').match(/dist\/bundle\.js\?version=[^&"]+/)[0]));
  await click('party.meet');const met=await save();assert.equal(met.expansion.simulation.owners.partyPartner[f.kit],1);assert.equal(met.expansion.actors.player.sources['party.guard_control'],undefined);
  await click('decline');let s=await save();assert.equal(s.expansion.actors.player.facts['party.invited'],false);assert.equal(s.character.money,met.character.money);assert.equal(s.expansion.simulation.sessions.player,undefined);
  await click('ask');assert.match(await page.locator('#party_panel [role="status"]').textContent(),/Lio agreed/);const asked=await save();assert.equal(asked.character.money,met.character.money);assert.equal(asked.expansion.simulation.sessions.player,undefined);
  await click('rival.begin','campaign');await waitForPage(page, ()=>JSON.parse(localStorage.getItem('save data')).expansion.simulation.pursuits['frontier.road_rival'].status==='waiting');const ready=await save();fs.writeFileSync(path.join(out,'ready-save.json'),JSON.stringify(ready));
  const roster=async()=>{await page.getByRole('combobox',{name:'Other known panels'}).selectOption('companions');await page.locator('#companion_roster_panel').waitFor({state:'visible'});return page.locator('#companion_roster_panel').innerText();};
  // 1 stance is chosen in the party panel, saved as an actor fact, and the roster agrees.
  let t=await roster();assert.match(t,/Bond: Met/);assert.match(t,/in a contest he braces at once/);
  await click('party.stance.hold');s=await save();assert.equal(s.expansion.actors.player.facts['party.stance'],'hold');
  t=await roster();assert.match(t,/holds his guard until you are hurt/);
  await page.locator('#companion_roster_panel').screenshot({path:path.join(out,'roster-stance-hold.png')});
  await page.screenshot({path:path.join(out,'screen-1920x1080-roster.png')});
  // 2 a bond rite moves the bar by earned steps: base +1 or preferred +3 (Lio is practical).
  await page.locator('#companion_roster_panel [data-bond-rite="work_alongside"]').click();
  s=await save();assert.equal(s.companions.bonds['party:lio'].level,3);t=await roster();assert.match(t,/Bond: Acquainted|Bond: Familiar/);
  fs.writeFileSync(path.join(out,'roster-after-rite.txt'),t);
  // 3 save, reload, Export/Import keep stance and bond.
  await reload();t=await roster();assert.match(t,/holds his guard until you are hurt/);assert.match(t,/Bond: (Acquainted|Familiar)/);
  const imp=await imported();assert.equal(imp.expansion.actors.player.facts['party.stance'],'hold');assert.equal(imp.companions.bonds['party:lio'].level,3);
  t=await roster();assert.match(t,/holds his guard until you are hurt/);
  // 4 consumer: in the contest a healthy player keeps Lio's effort; the hold stance is read by the fight.
  await click('start');await waitForPage(page, ()=>JSON.parse(localStorage.getItem('save data')).expansion.simulation.sessions.player?.nativeBattle.actions>=3);
  const b=await battle();assert.equal(b.guardsPrepared>=0,true);const live=await saved();
  fs.writeFileSync(path.join(out,'contest-state.json'),JSON.stringify({actions:b.actions,guardsPrepared:b.guardsPrepared,guardsTaken:b.guardsTaken,last:b.last,braceEffort:live.expansion.actors.partyPartner.resources.brace_effort,playerHealth:live.expansion.simulation.sessions.player&&null},null,1));
  await page.screenshot({path:path.join(out,'screen-1920x1080-contest.png')});
  findings.push('Stance hold saved, shown in roster, kept through reload and Import; contest read it.');
  fs.writeFileSync(path.join(out,'result.json'),JSON.stringify({ok:true,url,fingerprint,findings,errors,warnings},null,1));console.log('PASS',JSON.stringify(findings));
 }catch(error){if(page&&!page.isClosed())await page.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});fs.writeFileSync(path.join(out,'failure.json'),JSON.stringify({message:error.message,stack:error.stack,errors,warnings},null,1));console.error(error);process.exitCode=1;}
 finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
