const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),crypto=require('crypto');
const R=require('../../../vivid-proto23-flow-2026-10-13/checks/routes.cjs');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),context=await browser.newContext({viewport:{width:1366,height:768}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const response=await page.goto('http://127.0.0.1:18832/dist/bundle.js');
 const servedHash=crypto.createHash('sha256').update(await response.body()).digest('hex');
 const localHash=crypto.createHash('sha256').update(fs.readFileSync('dist/bundle.js')).digest('hex');
 if(servedHash!==localHash)throw Error('served bundle mismatch');
 await page.goto('http://127.0.0.1:18832/');await R.startFresh(page);
 const baseline={location:await page.locator('#location_name_span').innerText(),errors,servedHash,localHash};
 await page.screenshot({path:__dirname+'/native-baseline.png'});
 // Separate browser module probe. This explicitly does NOT exercise the host.
 const probe=await context.newPage();await probe.goto('http://127.0.0.1:18832/style.css');
 const moduleResult=await probe.evaluate(async()=>{
  const m=await import('/src/absorb_p23/repeat_search/repeat_search.js');
  const ui=await import('/src/absorb_p23/repeat_search/panel.js');
  document.body.replaceChildren();const title=document.createElement('h1');title.textContent='P14 module probe: simulated host events and clock';document.body.append(title);
  let clock=10,state=m.replenishRepeatSearch(undefined,{worldId:'base.frontier',location:'Village',alive:true,clock}, {kind:'village-runner-departed',ordinal:1,clock}).state;
  const c=()=>({worldId:'base.frontier',location:'Village',alive:true,idle:true,clock});
  const container=document.createElement('div');document.body.append(container);
  const panel=ui.createRepeatSearchPanel({container,read:()=>({state,context:c()}),act:()=>{const p=m.repeatSearchAction(state,c());state=p.state;return p;}});panel.panel.open=true;
  document.querySelector('[data-repeat-search-action]').click();clock=15;
  let paid=m.advanceRepeatSearch(JSON.parse(JSON.stringify(state)),c());state=paid.state;panel.render();
  if(!document.querySelector('[data-repeat-search-action]').disabled)throw Error('depleted panel enabled');
  if(m.replenishRepeatSearch(state,c(),{kind:'village-runner-departed',ordinal:1,clock}).state.remaining)throw Error('duplicate event restocked');
  clock=100;state=m.replenishRepeatSearch(state,c(),{kind:'village-runner-departed',ordinal:2,clock}).state;panel.render();
  document.querySelector('[data-repeat-search-action]').click();clock=105;
  const again=m.advanceRepeatSearch(JSON.parse(JSON.stringify(state)),c());state=again.state;panel.render();
  return {firstItems:paid.native.items,secondItems:again.native.items,state,summary:document.body.innerText,scope:'uncoupled module only; native acceptance OPEN'};
 });
 await probe.screenshot({path:__dirname+'/module-probe.png'});
 fs.writeFileSync(__dirname+'/browser.json',JSON.stringify({baseline,moduleResult,nativeChangedLoop:'NOT RUN: P00 host integration absent',nativeSaveReloadExportLiteralImport:'NOT RUN: optional field is not wired to native saves'},null,2));
 await browser.close();console.log(JSON.stringify({baseline,moduleResult}));
})().catch(e=>{console.error(e);process.exit(1)});
