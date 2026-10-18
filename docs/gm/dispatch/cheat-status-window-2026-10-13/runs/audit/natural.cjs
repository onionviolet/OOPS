const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'); const D=__dirname;
(async()=>{
 const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--remote-debugging-port=18439']});
 const c=await b.newContext({viewport:{width:1366,height:768},acceptDownloads:true});const p=await c.newPage();
 p.on('pageerror',e=>console.log('ERROR',e.message));
 await p.addInitScript(()=>{window.auditReveals=[];new MutationObserver(ms=>{for(const m of ms)if(m.target.getAttribute?.('data-workspace-reveal'))auditReveals.push(m.target.dataset.module)}).observe(document,{subtree:true,attributes:true,attributeFilter:['data-workspace-reveal']});});
 await p.goto('http://127.0.0.1:18437/');await p.locator('#loading_screen_play_button').click();await p.waitForTimeout(1200);
 await p.locator('[data-cheat-start]').selectOption('system-quests');await p.locator('#hero_creation_name_field').fill('AUDIT NATURAL');
 await p.screenshot({path:D+'/natural-creation.png'});
 const t=Date.now(); await p.locator('#hero_creation_panel_confirmation').click();await p.waitForTimeout(1800);await p.locator('#save_button').click();
 fs.writeFileSync(D+'/natural-start.json',await p.evaluate(()=>localStorage.getItem('save data')));
 await p.screenshot({path:D+'/natural-dormant.png'});console.log('START',new Date(t).toISOString());
 console.log('UI',await p.locator('body').innerText());
 for(let i=0;i<100;i++){
  await p.waitForTimeout(30000);await p.locator('#save_button').click();await p.waitForTimeout(100);
  const s=await p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));console.log(JSON.stringify({elapsed:(Date.now()-t)/1000,time:s['current time'],state:s.cheats,location:s['current location'],sleep:s.is_sleeping}));
  if(s.cheats.held['system-quests'].card.state.awakened){fs.writeFileSync(D+'/natural-awakened.json',JSON.stringify(s));await p.screenshot({path:D+'/natural-awakened.png'});console.log('AWAKENED',await p.evaluate(()=>({reveals:auditReveals,log:document.querySelector('#message_box_div')?.innerText})));break;}
 }
 console.log('DONE');await new Promise(r=>setTimeout(r,1200000));await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
