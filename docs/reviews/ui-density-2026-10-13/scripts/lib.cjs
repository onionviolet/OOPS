const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const URLS={original:'http://127.0.0.1:18802/',current:'http://127.0.0.1:18801/',v06:'http://127.0.0.1:18803/'};
let browser;
async function launch(){browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});return browser;}
async function open(build,{width=1366,height=768,zoom=1,save=null,storage=null}={}){
 // zoom emulated as browser zoom: CSS viewport shrinks by zoom, DSF scales up
 const ctx=await browser.newContext({viewport:{width:Math.round(width/zoom),height:Math.round(height/zoom)},deviceScaleFactor:zoom});
 const p=await ctx.newPage();p.setDefaultTimeout(10000);p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));
 if(save||storage){await p.goto(URLS[build]+'favicon.ico');await p.evaluate(([s,st])=>{localStorage.clear();if(s)localStorage.setItem('save data',typeof s==='string'?s:JSON.stringify(s));for(const [k,v] of Object.entries(st||{}))localStorage.setItem(k,v);},[save,storage]);}
 await p.goto(URLS[build],{waitUntil:'domcontentloaded'});
 try{await p.locator('#loading_screen_play_button:not(.none_display)').click({timeout:4000});}catch{await p.evaluate(()=>document.getElementById('loading_screen_play_button').click());p.forcedPlay=true;}await p.waitForTimeout(1200);
 if(await p.locator('#hero_creation_panel_confirmation').isVisible().catch(()=>false)){await p.locator('[data-race_id=human]').click().catch(()=>{});await p.locator('#hero_creation_name_field').fill('Audit');await p.locator('[data-gender=female]').click().catch(()=>{});await p.locator('#hero_creation_panel_confirmation').click();await p.waitForTimeout(800);}
 return {p,ctx};
}
async function getSave(p){await p.evaluate(()=>{try{save_progress?.()}catch{}});await p.locator('#save_button').click().catch(()=>{});await p.waitForTimeout(200);return p.evaluate(()=>localStorage.getItem('save data'));}
module.exports={launch,open,getSave,URLS,get browser(){return browser}};
