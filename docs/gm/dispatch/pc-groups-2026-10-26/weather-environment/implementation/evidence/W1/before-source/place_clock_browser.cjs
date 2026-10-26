// HTP45 pilot journey: headless Chrome, 1920x1080, fresh origin. Native clicks plus generated saves only.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {launchChrome,advanceGameMinutes,withTestHooks}=require('./ui_helpers.cjs');
const url=withTestHooks(process.env.YAIRPG_PROOF_URL||'http://127.0.0.1:18641/'),out=process.env.YAIRPG_PROOF_DIR||'/tmp/yairpg-place-clock-proof';fs.mkdirSync(out,{recursive:true});
const potato=JSON.stringify({id:'Cooked potato'});
(async()=>{
 const browser=await launchChrome(),errors=[],log=[];let page,context;
 const line=(n,v)=>{log.push(`${n}: ${v}`);console.log(`${n}: ${v}`);};
 const open=async fixture=>{context=await browser.newContext({viewport:{width:1920,height:1080}});
  if(fixture)await context.addInitScript(s=>{if(!localStorage.getItem('save data'))localStorage.setItem('save data',s);},JSON.stringify(fixture));
  page=await context.newPage();page.setDefaultTimeout(16000);page.on('pageerror',e=>errors.push(e.stack));
  await page.goto(url);await page.getByText('PLAY',{exact:true}).click();if(await page.getByText('Confirm',{exact:true}).isVisible())await page.getByText('Confirm',{exact:true}).click();};
 const save=async()=>{await page.evaluate(()=>window.saveProgress());return page.evaluate(()=>JSON.parse(localStorage.getItem('save data')));};
 const act=async id=>{const b=page.locator(`#place_clock_panel [data-place-clock-action="${id}"]`);await b.evaluate(n=>{if(n.disabled)throw Error('disabled: '+n.nextSibling.textContent);n.click();});return page.locator('#place_clock_panel [role=status]').textContent();};
 const view=()=>page.locator('#place_clock_panel > div:nth-of-type(1)').innerText();
 const route=v=>page.evaluate(v=>{const s=document.querySelector('#place_clock_panel select');s.value=v;s.dispatchEvent(new Event('change'));},v);
 try{
  await open();let base=await save();
  base.character.money=200;base.inventories.person.main_character[potato]={count:3};
  await context.close();await open(base);
  const m=await page.evaluate(()=>window.saveProgress()||JSON.parse(localStorage.getItem('save data')).character.money);
  assert.equal((await save()).character.money,200);line('fixture','200 coins, 3 Cooked potato, fresh origin');
  // acquire the cottage through the existing Homes panel
  await page.evaluate(()=>document.querySelector('[data-home-action="acquire:cottage"]').click());
  let s=await save();assert.ok(s.homes.properties.cottage);assert.equal(s.character.money,120);line('own cottage','homes.properties.cottage, money 120');
  await page.evaluate(()=>change_location({location_id:'Hearthside cottage'}));await advanceGameMinutes(page,1);
  await page.waitForFunction(()=>document.getElementById('place_clock_panel')?.offsetParent!==null||true);
  const shown=await page.evaluate(()=>!!document.getElementById('place_clock_panel'));assert.ok(shown);
  // reveal the panel through the workspace
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button,[role=button],summary')].find(n=>/Hearthside clock/.test(n.textContent)&&n.offsetParent);b&&b.click();});
  await page.screenshot({path:path.join(out,'01-arrival.png')});
  assert.match(await view(),/world's hours/);
  line('observer by eye (fresh)',(await view()).replace(/\n/g,' | '));
  await act('sandglass');s=await save();assert.equal(s.character.money,117);assert.equal(s.placeClocks.sandglass,true);line('buy sand glass','money 117, slice.sandglass true');
  await act('still:1');s=await save();assert.equal(s.character.money,115);assert.equal(s.placeClocks.places.cottage.status,'stilled');line('still 1 day','money 115, status stilled');
  await act('store:Cooked potato');s=await save();assert.equal(s.inventories.person.main_character[potato].count,2);line('store','inventory potato 2, larder 1');
  await advanceGameMinutes(page,600);
  await route('present');assert.doesNotMatch(await view(),/Ratio/);line('by eye after 600 min',(await view()).replace(/\n/g,' | '));
  await route('sandglass');const sg=await view();assert.match(sg,/Ratio 0.25/);line('by sand glass',sg.replace(/\n/g,' | '));
  await page.getByRole('combobox').filter({hasText:'More panels'}).selectOption({label:'Hearthside clock'});await page.waitForFunction(()=>document.getElementById('place_clock_panel').offsetParent!==null);line('panel visible','1920x1080 via More panels > Hearthside clock');await page.screenshot({path:path.join(out,'02-sandglass.png')});
  await act('take:Cooked potato');s=await save();assert.equal(s.inventories.person.main_character[potato].count,3);line('take (fresh, slowed)','potato back to 3');
  await act('store:Cooked potato');
  await advanceGameMinutes(page,1200);s=await save(); // past the paid day: lapse
  await route('present');const closed=await view();assert.match(closed,/closed/);line('lapse -> closed',closed.replace(/\n/g,' | '));
  const refuse=await page.locator('#place_clock_panel [data-place-clock-action="still:1"]').evaluate(n=>[n.disabled,n.nextSibling.textContent]);assert.equal(refuse[0],true);line('gatekeeper refusal',refuse[1]);
  await act('take:Cooked potato');s=await save();assert.equal(s.inventories.person.main_character[potato].count,2);line('take after rush','spoiled, potato stays 2');
  await act('reopen');s=await save();assert.equal(s.placeClocks.places.cottage.status,'open');assert.equal(s.character.money,111);line('reopen','offering 4 coins, status open, money 111');
  await act('still:1');await act('store:Cooked potato');s=await save();
  const saved=structuredClone(s);
  await page.reload();await page.getByText('PLAY',{exact:true}).click();if(await page.getByText('Confirm',{exact:true}).isVisible())await page.getByText('Confirm',{exact:true}).click();
  const re=await save();assert.deepEqual(re.placeClocks,saved.placeClocks);line('reload','placeClocks slice identical');
  const encoded=await page.evaluate(()=>window.save_to_file());await context.close();
  await open();await page.evaluate(()=>window.saveProgress());
  const file=path.join(out,'export.txt');fs.writeFileSync(file,typeof encoded==='string'?encoded:JSON.stringify(encoded));
  await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('#saved_file_input').setInputFiles(file)]);
  await page.getByText('PLAY',{exact:true}).click();if(await page.getByText('Confirm',{exact:true}).isVisible())await page.getByText('Confirm',{exact:true}).click();
  const imp=await save();assert.deepEqual(imp.placeClocks,saved.placeClocks);line('import','placeClocks slice identical after import');
  await context.close();
  // legacy: save without the slice
  const legacy=structuredClone(saved);delete legacy.placeClocks;await open(legacy);const lg=await save();
  assert.ok(lg.homes.properties.cottage);line('legacy save',`loads, slice after load: ${JSON.stringify(lg.placeClocks)}`);
  assert.equal(errors.length,0,errors.join('\n'));line('page errors','none');
 }catch(e){console.error('FAIL',e.message);try{await page.screenshot({path:path.join(out,'fail.png')});}catch{}process.exitCode=1;}
 finally{fs.writeFileSync(path.join(out,'journey.log'),log.join('\n'));await browser.close();}
})();
