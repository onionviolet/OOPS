// R12 harness: synthetic cooking fixture (craft_ready + 3 Rat meat chunks, known), Village cooking tier 1.
const L=require('./r11-lib.cjs');const {fs,path,assert}=L;
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const E=path.join(__dirname,'evidence/r12');
const FIX=fs.readFileSync(path.join(E,'cooking-fixture.save.json'),'utf8');
const BASE=()=>process.env.R12_URL||'http://127.0.0.1:19251';
const launch=async()=>{const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});const t=setTimeout(()=>{console.error('HARNESS180sBOUND');b.close()},180000);t.unref();b.on('disconnected',()=>clearTimeout(t));return b;};
const ready=p=>p.waitForFunction(()=>!!window.simulationTestHooks&&!!document.getElementById('workspace_navigation'),null,{timeout:60000});
async function open(b,{w=1366,h=768,data=FIX}={}){const ctx=await b.newContext({viewport:{width:w,height:h},reducedMotion:'reduce'}),p=await ctx.newPage();p.errors=[];p.on('pageerror',e=>p.errors.push(e.message));p.setDefaultTimeout(25000);await ctx.route('**/favicon.ico',r=>r.abort());
 await p.goto(BASE()+'/style.css');await p.evaluate(d=>{localStorage.clear();localStorage.setItem('save data',d);localStorage.setItem('yairpg.presentation.proto23-parity.v1','on');},data);
 await p.goto(BASE()+'/?test_hooks=1',{waitUntil:'domcontentloaded'});await ready(p);await L.R.startFresh(p);await p.evaluate(()=>simulationTestHooks.pause());await p.waitForTimeout(500);return{ctx,p};}
async function shot(p,name){const cdp=await p.context().newCDPSession(p);try{const r=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false});fs.writeFileSync(path.join(E,name+'.png'),Buffer.from(r.data,'base64'));}finally{await cdp.detach();}}
async function openCooking(p){await p.locator('.choice_craft').first().click({noWaitAfter:true});await p.locator('#crafting_window').waitFor({state:'visible'});await p.locator('.crafting_mainpage_button[data-crafting_category="cooking"]').click({noWaitAfter:true});await p.locator('.crafting_recipe_list:visible .recipe_div').first().waitFor({state:'visible'});}
const row=(p,id)=>p.locator(`.crafting_recipe_list:visible .recipe_div[data-recipe_id="${id}"]`);
async function pick(p,id){const r=row(p,id);await r.scrollIntoViewIfNeeded();await r.click({noWaitAfter:true});await p.waitForTimeout(150);}
const snap=p=>p.evaluate(()=>{const s=simulationTestHooks.snapshot();return{clock:JSON.stringify(s['current time']),inv:JSON.stringify(s.inventories?.person?.main_character??s.inventories),xp:JSON.stringify(s.character?.skills??null)};});
const geo=p=>p.evaluate(()=>{const b=n=>{if(!n)return null;const r=n.getBoundingClientRect();return{top:Math.round(r.top),bottom:Math.round(r.bottom),h:Math.round(r.height),client:n.clientHeight,content:n.scrollHeight}};const d=document.getElementById('crafting_detail');return{page:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],viewport:[innerWidth,innerHeight],detail:b(d),commit:b(d?.querySelector('[data-craft-commit]')),font:getComputedStyle(d).fontSize,text:d?.innerText}});
module.exports={...L,E,FIX,BASE,launch,open,shot,openCooking,row,pick,snap,geo};
