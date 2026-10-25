// HTP49 true-route journey: headless Chrome 1920x1080, fresh origin, UNPATCHED bundle, native clicks.
// Paradise commands are clicked in the feature expansion panel by label; time is dev-stepped (?test_hooks=1).
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {launchChrome,advanceGameMinutes,withTestHooks}=require('./ui_helpers.cjs');
const {startFresh}=require('../docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/routes.cjs');
const url=withTestHooks(process.env.YAIRPG_PROOF_URL||'http://127.0.0.1:18772/index.html'),out=process.env.YAIRPG_PROOF_DIR||'/tmp/yairpg-rank-gap-proof';fs.mkdirSync(out,{recursive:true});

// Shared route: fresh origin to Goa with localPermit and the duty copy, normal clicks only. Returns the page helpers.
async function reachGoa({browser,errors,line}){
  const context=await browser.newContext({viewport:{width:1920,height:1080}});
  await context.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}));
  const page=await context.newPage();page.setDefaultTimeout(16000);page.on('pageerror',e=>errors.push(e.stack));
  await page.goto(url);await page.waitForFunction(()=>window.simulationTestHooks);await startFresh(page);
  const snap=()=>page.evaluate(()=>window.simulationTestHooks.snapshot());
  const a=page.locator('#location_actions_div');
  await a.getByText('Talk to someone',{exact:false}).first().click();await a.getByText('Talk to village elder',{exact:false}).first().click();
  for(const key of ['hello','what happened','ask to leave 1','need to']){const l=a.locator(`.dialogue_textline[data-textline="${key}"]`);await l.waitFor({state:'visible'});await l.evaluate(n=>n.click());await l.waitFor({state:'detached'});}
  await page.evaluate(()=>end_dialogue());await advanceGameMinutes(page,3);
  line('elder','four textlines done (village.elderMet is native, main.js metVillageElder)');
  const openHere=async()=>{await page.getByRole('combobox',{name:'Other known panels'}).selectOption({label:await page.evaluate(()=>[...document.querySelector('select[aria-label="Other known panels"]').options].map(o=>o.textContent).find(t=>/^Notes, practice & people/.test(t)))});await page.locator('[data-notebook-view="here"]').click();await page.locator('#feature_expansion_panel').evaluate(n=>{n.open=true;});};
  await openHere();
  const recover=async()=>{try{await page.waitForLoadState('load',{timeout:8000});}catch{}
   if(await page.locator('#loading_screen_play_button').isVisible()){await page.waitForFunction(()=>window.simulationTestHooks);await page.locator('#loading_screen_play_button').click();await page.waitForFunction(()=>window.simulationTestHooks.saveStatus().ownsSave);await page.waitForTimeout(800);await openHere();line('reload','page reloaded after command; panel reopened');}};
  const clickLabel=async re=>{await page.evaluate(()=>document.querySelectorAll('#feature_expansion_panel details').forEach(d=>d.open=true));
   const b=page.locator('#feature_expansion_panel button',{hasText:re}).first();if(!await b.count())return 'absent';
   if(await b.isDisabled()||await b.getAttribute('aria-disabled')==='true')return 'disabled: '+(await b.evaluate(n=>{const d=n.getAttribute('aria-describedby');return (d&&document.getElementById(d)?.innerText)||n.parentElement?.innerText||'';})).slice(0,300).replace(/\n/g,' ');
   await b.scrollIntoViewIfNeeded();await b.click({timeout:15000,noWaitAfter:true});await page.waitForTimeout(1200);await recover();return 'ok';};
  const step=async(name,re,tries=400)=>{let r;for(let i=0;i<tries;i++){r=await clickLabel(re);if(r==='ok'){await advanceGameMinutes(page,1);for(let k=0;k<30&&(await snap()).expansion.simulation?.jobs?.some(j=>j.actorId==='player');k++)await advanceGameMinutes(page,5);line(name,'ok; player at '+(await snap()).expansion.simulation?.people?.player?.location);return;}await advanceGameMinutes(page,5);}throw Error(`${name}: ${r}; errors: ${errors.join('|').slice(0,400)}; status: ${await page.evaluate(()=>{document.querySelectorAll('#feature_expansion_panel details').forEach(d=>d.open=true);return [...document.querySelectorAll('#feature_expansion_panel details')].find(d=>/Paradise/.test(d.innerText))?.innerText.slice(0,900)+' || STATUS:'+[...document.querySelectorAll('#feature_expansion_panel [role=status],#feature_expansion_panel p')].map(x=>x.textContent).filter(t=>/hang|again|Review|cannot|Finish/i.test(t)).join('/')})}; chartKnown: ${await page.evaluate(()=>{const e=window.simulationTestHooks.snapshot().expansion;return JSON.stringify({save:window.simulationTestHooks.saveStatus(),completed:Object.keys(e.actors.player.completed||{}).filter(k=>/paradise/.test(k)),know:Object.keys(e.simulation?.knowledge?.player||{}).filter(k=>/paradise/.test(k)),campaign:!!e.bookWorldCampaign,facts:Object.keys(e.actors.player.facts).filter(k=>/paradise/.test(k)),kids:[...document.getElementById('feature_expansion_panel').children].map(c=>c.tagName+(c.hidden?'(H)':'')+':'+c.textContent.slice(0,100)),live:[...document.querySelectorAll('[role=status],[role=alert],.notice,[class*=legib] p,[class*=legib] div')].map(x=>x.textContent.trim().slice(0,150)).filter(Boolean)})})}; buttons: ${JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('#feature_expansion_panel button')].map(b=>b.textContent.trim().slice(0,70)+(b.disabled?' [dis]':''))))}`);};
  await step('living-world enrolment (any existing optional record)',/Begin an optional record of local care/);line('simulation exists',String(!!(await snap()).expansion.simulation));
  await step('chart',/Read the parallel-entry/);await step('enroll',/Choose independent Paradise entry/);await step('enter hub',/Enter the independent contractor district/);
  await step('hub meet',/Meet the independent service desk/);await step('hub shift',/Accept the funded packing shift/);await step('hub ration',/Buy 1 .*Goa ration parcel|Buy 1 .*ration/i);
  await step('goa visit',/Visit the first-Goa branch/);
  let s=await snap();line('player world',s.expansion.actors.player.worldId);assert.equal(s.expansion.actors.player.worldId,'book.paradise.goa');
  await step('meet Mia',/Meet Mia in Gray Terminal/);await step('go pier',/Go to Goa provision pier/);await step('meet Rin',/Meet Rin/);await step('pier shift',/Work the independent pier shift/);
  await step('go guardhouse',/Go to Goa guardhouse/);await step('meet Hank',/Meet Hank at the guardhouse/);await step('duty copy',/Ask Hank for his physical operation-duty copy/);
  await step('guard access',/Pay Hank for one documented palace-warning admission/);
  s=await snap();const f=s.expansion.actors.player.facts;line('facts',JSON.stringify({localPermit:f['book.paradise.localPermit'],palaceAccess:f['book.paradise.palaceAccess']}));
  assert.ok(f['book.paradise.localPermit']);
  const copyKey=Object.keys(s.inventories.person.main_character).find(k=>/Goa duty copy/.test(k));line('duty copy key',copyKey);assert.ok(copyKey);
  return {context,page,snap,openHere,step,clickLabel,recover,s};
}

// Controlled measurement (task: stamina/time conservation). Engine paused; only explicit advanceTicks run.
async function main(){
 const browser=await launchChrome(),errors=[],log=[];let page;
 const line=(n,v)=>{log.push(`${n}: ${v}`);console.log(`${n}: ${v}`);};
 try{
  const r=await reachGoa({browser,errors,line});page=r.page;const snap=r.snap;
  await page.evaluate(()=>window.simulationTestHooks.pause());
  const read=async()=>{const s=await snap(),t=s['current time'];return {clock:s.expansion.clock,time:t.day_count*1440+t.hour*60+t.minute,slice:s.rankGapObserver?.clock??null,toFull:s.character.stamina_to_full,seq:s.expansion.sequence,loc:s.expansion.simulation?.people?.player?.location};};
  const tick=async n=>{for(let i=0;i<n;i++)await page.evaluate(()=>advanceTicks(1));};
  const rows=[],rec=async(label)=>{const x=await read();rows.push({label,...x});line('M '+label,JSON.stringify(x));return x;};
  // Control: idle ticks, no watch.
  await rec('control t0');for(let i=1;i<=3;i++){await tick(1);await rec(`control +${i} tick`);}
  // Open the panel, then watch (cost 1, witness).
  await page.getByRole('combobox',{name:'Other known panels'}).selectOption({label:(await page.evaluate(()=>[...document.querySelector('select[aria-label="Other known panels"]').options].map(o=>o.textContent).find(t=>/^Watch a working/.test(t))))});
  const panel=page.locator('#rank_gap_observer_panel');await panel.waitFor({state:'visible'});
  const btn=id=>panel.locator(`button[data-subject="book.paradise.${id}"]`);
  await tick(1);await panel.locator('button[data-subject]').first().waitFor();await rec('panel render tick');const b0=await rec('watch#1 before');await btn('mia').click();const b1=await rec('watch#1 immediately after');
  await tick(1);await rec('watch#1 +1 tick');await tick(1);await rec('watch#1 +2 ticks');
  // Two watches back to back, no ticks between: 1 (witness) + 2 (glimpse) + 2 (glimpse).
  await panel.locator('select').selectOption('local_permit');
  const c0=await rec('watch#2-3 before');await btn('philip_herbert').click();const c1=await rec('watch#2 immediately after');await btn('philip_herbert').click();const c2=await rec('watch#3 immediately after');
  for(let i=1;i<=4;i++){await tick(1);await rec(`after watches +${i} tick`);}
  const d=(x,y,k)=>y[k]-x[k];
  line('CONSERVATION watch#1',`world clock +${d(b0,b1,'clock')} (expect 2); time +${d(b0,b1,'time')}; slice +${d(b0,b1,'slice')||b1.slice-0} (expect 2); toFull +${d(b0,b1,'toFull')} (expect quoted 1); seq +${d(b0,b1,'seq')}`);
  line('CONSERVATION watch#2',`world clock +${d(c0,c1,'clock')}; slice +${d(c0,c1,'slice')}; toFull +${d(c0,c1,'toFull')} (expect 2)`);
  line('CONSERVATION watch#3',`world clock +${d(c1,c2,'clock')}; slice +${d(c1,c2,'slice')}; toFull +${d(c1,c2,'toFull')} (expect 2)`);
  fs.writeFileSync(path.join(out,'measure.json'),JSON.stringify(rows,null,1));
  assert.equal(errors.length,0,errors.join('\n'));line('page errors','none');
 }catch(e){console.error('FAIL',e.message);try{await page.screenshot({path:path.join(out,'fail.png')});}catch{}process.exitCode=1;line('FAIL',e.message);}
 finally{fs.writeFileSync(path.join(out,'journey.log'),log.join('\n'));await browser.close();}
}
module.exports={reachGoa,url,out,launchChrome};
if(require.main===module)main();
