// Divination floor: fresh Village life -> cross as Tingen probationer -> report in -> start the first offered walk. Headless 1920x1080, temp bundle, fresh origin.
// Usage: node scripts/playtest/lotm-divination-probe.mjs <out-dir>
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {buildBundle,serve,Session,sha} from './lib.mjs';
const out=path.resolve(process.argv[2]||'.'),mode=process.argv[3]||'unclear';await fs.mkdir(out,{recursive:true});
const bundle=await buildBundle(),server=await serve(bundle.dir);
const bundleHash=sha(await fs.readFile(path.join(bundle.dir,'bundle.js')));
const s=await new Session({url:server.url,opTimeout:240000,seed:7,wall:Date.UTC(2026,9,30)}).start();
const mark=m=>fs.appendFile(path.join(out,'progress.log'),new Date().toISOString()+' '+m+'\n').catch(()=>{});
const pause=(ms=350)=>s.page.waitForTimeout(ms);
const nav=async id=>{await s.page.keyboard.press('Escape');await s.page.evaluate(v=>{const e=document.querySelector('select[aria-label="Other known panels"]');e.value=v;e.dispatchEvent(new Event('change',{bubbles:true}));},id);await pause();};
const report={bundle:bundleHash,viewport:'1920x1080',steps:[]};
try{
 await s.open();const p=s.page;report.events=[];p.on('crash',()=>report.events.push('crash'));p.on('close',()=>report.events.push('close'));p.on('pageerror',e=>report.events.push('pageerror '+String(e).slice(0,200)));p.on('console',m=>{if(m.type()==='error')report.events.push('console '+m.text().slice(0,200));});p.on('framenavigated',f=>{if(f===p.mainFrame())report.events.push('nav '+f.url().slice(-40));});await p.setViewportSize({width:1920,height:1080});
 await nav('lotm');const panel=p.locator('#lotm_panel');
 await panel.locator('[data-lotm="pick_be"]').click();await pause();await panel.locator('[data-lotm="enroll_be"]').click();
 const t0=Date.now();
 for(let i=0;i<80;i++){try{if(await p.locator('#loading_screen_play_button').isVisible()){await p.locator('#loading_screen_play_button').click({timeout:3000});await pause(2000);}
  report.entry=await p.evaluate(()=>window.simulationTestHooks.snapshot().expansion.lotm?.entryProfile);if(report.entry){report.enrollMs=Date.now()-t0;break;}}catch(e){}await pause(1500);}
 report.shot=await p.screenshot({path:path.join(out,'pre-nav.png'),timeout:60000}).then(()=>1,e=>String(e).slice(0,100));await nav('lotm');
 report.btns=await p.evaluate(()=>[...document.querySelectorAll('#lotm_panel button')].map(b=>b.textContent.trim().slice(0,90)).slice(0,40));

 if(mode==='supported'||mode==='death'){
  if(mode==='death'){const cl=async re=>{for(let i=0;i<40;i++){const t=await p.evaluate(src=>{const d=document.querySelector('#lotm_panel details[data-lotm-divinations]');if(d)d.open=true;const b=[...document.querySelectorAll('#lotm_panel details[data-lotm-divinations] button')].find(b=>!b.disabled&&new RegExp(src).test(b.textContent));if(!b)return null;b.click();return b.textContent;},re);if(t)return t;await pause(1000);}return null;};
   for(const re of ['^Take out the coin','^Ask about returning'])await cl(re).then(()=>pause(2500));await mark('one peek done');}
  await mark('exporting');const text=await p.evaluate(()=>window.save_to_file());await mark('exported '+String(text).length);report.exportHead=String(text).slice(0,60);
  const PRE='YAIR-UTF8-1:';const save=JSON.parse(Buffer.from(String(text).slice(PRE.length),'base64').toString('utf8')),sim=save.expansion?.simulation||save.simulation;
  const known=sim.knowledge.player,tpl=Object.values(known)[0];
  if(mode==='death'){const find=(o,path)=>{if(!o||typeof o!=='object')return null;if(o.backlash&&typeof o.backlash==='object')return {o,path};for(const [k,v] of Object.entries(o)){const r=find(v,path+'.'+k);if(r)return r;}return null;};const hit=find(save,'save');report.harmKeys=hit?[hit.path]:[];if(hit){hit.o.backlash.power=9;report.seeded=hit.path+' '+JSON.stringify(hit.o).slice(0,160);}}else known['book.lotm.div.grounds.coin-divination']={...structuredClone(tpl),value:'You know why the Boklund address is unsafe.'};
  await mark('loading');await Promise.race([p.evaluate(t=>{window.load_progress(t);return 1;},PRE+Buffer.from(JSON.stringify(save),'utf8').toString('base64')).catch(()=>{}),new Promise(r=>setTimeout(r,20000))]);await mark('load issued');await pause(3000);
  for(let i=0;i<60;i++){try{if(await p.locator('#loading_screen_play_button').isVisible())await p.locator('#loading_screen_play_button').click({timeout:3000});if(await p.evaluate(()=>!!window.simulationTestHooks.snapshot().expansion.lotm?.entryProfile))break;}catch(e){}await pause(1500);}
  report.imported=true;await mark('imported');await nav('lotm');await mark('nav done');
 }
 const grab=()=>p.evaluate(()=>{const d=document.querySelector('#lotm_panel details[data-lotm-divinations]');if(!d)return null;d.open=true;return [...d.querySelectorAll('p,button')].map(e=>(e.tagName==='BUTTON'?'[BTN'+(e.disabled?' disabled':'')+'] ':'')+e.textContent.trim().slice(0,160));});
 for(let i=0;i<10&&!report.rows;i++){report.rows=await grab();if(!report.rows)await pause(1000);}
 report.hasRites=!!report.rows;
const clickLabel=async re=>{for(let i=0;i<40;i++){const t=await p.evaluate(src=>{const b=[...document.querySelectorAll('#lotm_panel details[data-lotm-divinations] button')].find(b=>!b.disabled&&new RegExp(src).test(b.textContent));if(!b)return null;const t=b.textContent;b.click();return t;},re);if(t)return t;await pause(1000);}return null;};
 if(report.rows){await p.screenshot({path:path.join(out,'divination-before.png'),timeout:8000}).catch(()=>{report.shotFail=1;});
  report.clicked=[];
  if(mode!=='backlash')  for(const re of ['^Take out the coin','^Ask about returning','^Read the coin']){const t=await clickLabel(re);report.clicked.push(t);if(!t)break;await pause(2500);}
  report.notice=await p.evaluate(()=>document.querySelector('#lotm_panel [role=status]')?.textContent||'');
  report.after=await grab();
  report.reports=await p.evaluate(()=>document.body.innerText.split('Reports')[1]?.slice(0,1500)||'');
  await p.screenshot({path:path.join(out,'divination-after.png'),timeout:8000}).catch(()=>{report.shotFail=1;});}


 if(mode==='rail'){
  const btns=()=>p.evaluate(()=>[...document.querySelectorAll('#lotm_panel button')].map(b=>(b.disabled?'[disabled] ':'')+b.textContent.trim().slice(0,110)));
  const click=async re=>p.evaluate(src=>{const b=[...document.querySelectorAll('#lotm_panel button')].find(b=>!b.disabled&&new RegExp(src).test(b.textContent));if(!b)return null;const t=b.textContent;b.click();return t;},re);
  report.stationBtns=(await btns()).filter(t=>/station/i.test(t));report.rail=[];if(mode==='rail'&&process.env.LISTONLY){report.allBtns=await btns();}await click('^Show the walking map');await pause(1000);report.walkList=(await btns()).filter(t=>/Walk|station|Station/.test(t)).slice(0,60);report.placedAt=await p.evaluate(()=>window.simulationTestHooks.snapshot().expansion.simulation.people.player.location);
  if(process.env.LISTONLY)throw new Error('list only');
  const seen=new Set();
  for(let i=0;i<60;i++){
   const all=await btns();await fs.appendFile(path.join(out,'progress.log'),`${new Date().toISOString()} step ${i} ${all.filter(t=>/Walk|Travel/.test(t)).slice(0,40).map(t=>t.slice(0,60)).join(' | ')}\n`);const j=all.filter(t=>/^(\[disabled\] )?Travel to Backlund/.test(t));
   if(j.length){report.rail.push({step:i,journeys:j});break;}
   const stationTravel=all.find(t=>/^Travel from .* to Tingen railway station/i.test(t));if(stationTravel&&!report.stationVia){report.stationVia=stationTravel;}
   const walks=all.filter(t=>/^(Walk|Travel (from|to))/.test(t));
   const pick=(stationTravel?[stationTravel]:[]).concat(walks.filter(t=>/railway station/i.test(t))).find(Boolean)||(i<3?walks.find(t=>/street market/i.test(t)):null)||walks.find(t=>!seen.has(t))||walks[0];
   if(!pick){if(all.some(t=>/^\[disabled\] /.test(t))&&i<59){await pause(5000);continue;}report.rail.push({step:i,stuck:all.slice(0,20)});break;}
   seen.add(pick);const t=await click('^'+pick.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').slice(0,60));report.rail.push({step:i,walked:t});
   await pause(3500);
  }
  const grabHalt=()=>p.evaluate(()=>({halted:document.body.innerText.match(/[^\n]*(Halted|halted|Trains out)[^\n]*/g)?.slice(0,6)||[],travel:[...document.querySelectorAll('#lotm_panel button')].filter(b=>/Travel to Backlund/.test(b.textContent)).map(b=>(b.disabled?'[disabled] ':'')+b.textContent.trim()),comingUp:(document.body.innerText.match(/Coming up[\s\S]{0,300}/)||[''])[0]}));
  report.day1=await grabHalt();await mark('day1 '+JSON.stringify(report.day1).slice(0,300));
  await Promise.race([p.screenshot({path:path.join(out,'rail-day1.png'),timeout:20000}).catch(()=>{}),pause(25000)]);
  report.days=[];
  for(let w=0;w<4;w++){
   const t=await p.evaluate(()=>{const b=[...document.querySelectorAll('#lotm_panel button')].find(b=>!b.disabled&&/^Wait until dawn/.test(b.textContent));if(!b)return null;const t=b.textContent;b.click();return t;});await mark('wait '+w+' '+t);
   if(!t)break;
   let g;for(let i=0;i<80;i++){await pause(6000);g=await grabHalt();g.clock=await p.evaluate(()=>(document.body.innerText.match(/Now: [^\n]*/)||[''])[0]);g.reason=await p.evaluate(()=>{const b=[...document.querySelectorAll('#lotm_panel button')].find(b=>/Travel to Backlund/.test(b.textContent));return b?{title:b.title,next:b.parentElement?.innerText.slice(0,260)}:null;});if(g.reason&&!/Saving is paused/.test(g.reason.title||'')||i===79)break;}
   report.days.push(g);await mark('day '+JSON.stringify(g).slice(0,400));
   if(g.travel.length&&!g.travel[0].startsWith('[disabled]'))break;
  }
  report.reports=await p.evaluate(()=>document.body.innerText.match(/halted[^\n]{0,80}/ig));
 }

 if(mode==='death'){
  report.deathLog=[];
  const snap=()=>p.evaluate(()=>{const e=window.simulationTestHooks.snapshot();return {harm:JSON.stringify(e.harm||e.expansion?.harm||null).slice(0,300),dead:/died|death|lost control|restart/i.test(document.body.innerText),clock:e['current time']?.hour+':'+e['current time']?.minute};});
  report.deathLog.push({at:'seeded',...await snap()});
  const clicked=process.env.DEATH_WAIT?await p.evaluate(()=>{const b=[...document.querySelectorAll('#lotm_panel button')].find(b=>!b.disabled&&/^Wait until/.test(b.textContent));if(!b)return null;const t=b.textContent;b.click();return t;}):'natural time only';
  await p.evaluate(()=>window.simulationTestHooks.resume());report.deathLog.push({clicked});await mark('wait clicked '+clicked);
  for(let i=0;i<24;i++){await pause(5000);let x;try{if(await p.locator('#loading_screen_play_button').isVisible().catch(()=>false)){report.sawReload=true;await p.locator('#loading_screen_play_button').click({timeout:3000}).catch(()=>{});await pause(2000);}x=await snap();}catch(e){report.deathLog.push({i,err:String(e).slice(0,80)});continue;}report.deathLog.push({i,...x});if(x.dead)break;}
  report.panelText=await p.evaluate(()=>document.body.innerText.match(/[^\n]*(died|death|lost control|Restart|restart)[^\n]*/gi)?.slice(0,12));
  await p.screenshot({path:path.join(out,'death.png'),timeout:15000}).catch(()=>{report.shotFail=1;});
 }
 if(mode==='backlash'){
  const loops=[];report.loops=loops;
  for(let n=0;n<14;n++){
   const row={n};
   for(const re of ['^Take out the coin','^Ask about returning','^Read the coin']){const t=await clickLabel(re);row[re]=!!t;if(!t)break;await pause(900);}
   row.harm=await p.evaluate(()=>{const e=window.simulationTestHooks.snapshot();const h=e.harm||e.expansion?.harm;return h?JSON.stringify(h).slice(0,200):null;});
   row.life=await p.evaluate(()=>document.body.innerText.match(/(You (have )?died|lost control|Connection|restart)[^\n]{0,80}/i)?.[0]||null);
   loops.push(row);await fs.appendFile(path.join(out,'progress.log'),JSON.stringify(row)+'\n');if(row.life||!row['^Take out the coin'])break;
  }
  report.reports=await p.evaluate(()=>document.body.innerText.slice(-1500));
 }
 const know=()=>p.evaluate(()=>{const k=window.simulationTestHooks.snapshot().expansion.simulation.knowledge.player||{};return Object.keys(k).filter(x=>x.startsWith('divination.')).length;});
 report.knowBefore=await know();report.saved=await p.evaluate(()=>{const b=[...document.querySelectorAll('button,#save_button')].find(b=>b.id==='save_button'||b.textContent.trim()==='Save');if(b){b.click();return b.id||'text';}return null;});await pause(800);
 await p.reload({waitUntil:'domcontentloaded'});for(let i=0;i<40;i++){try{if(await p.locator('#loading_screen_play_button').isVisible())await p.locator('#loading_screen_play_button').click({timeout:3000});report.knowAfter=await know();if(report.knowAfter)break;}catch(e){}await pause(1500);}
 report.errors=s.errors;
}finally{await fs.writeFile(path.join(out,'lotm-divination-probe.json'),JSON.stringify(report,null,1)+'\n');await s.close();server.close();await bundle.dispose();}
console.log(JSON.stringify({entry:report.entry,rows:report.rows,clicked:report.clicked,notice:report.notice,knowBefore:report.knowBefore,knowAfter:report.knowAfter,reports:report.reports,errors:report.errors},null,1).slice(0,7000));
