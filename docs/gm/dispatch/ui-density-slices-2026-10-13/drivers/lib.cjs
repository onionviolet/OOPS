const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const URL=process.env.URL||'http://127.0.0.1:18231/';
let browser;
async function launch(){browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});return browser;}
// Each newContext is a fresh storage origin.
async function open({w=1366,h=768,zoom=1,save=null,storage=null,play=true,ctx=null}={}){
  ctx=ctx||await browser.newContext({viewport:{width:Math.round(w/zoom),height:Math.round(h/zoom)},deviceScaleFactor:zoom});
  const p=await ctx.newPage();p.setDefaultTimeout(10000);p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));
  if(save||storage){await p.goto(URL+'style.css',{waitUntil:'load'}).catch(()=>{});await p.waitForTimeout(100);await p.evaluate(([s,st])=>{localStorage.clear();if(s)localStorage.setItem('save data',s);for(const [k,v] of Object.entries(st||{}))localStorage.setItem(k,v);},[save,storage]);}
  await p.goto(URL,{waitUntil:'domcontentloaded'});
  if(play)await doPlay(p);
  return {p,ctx};
}
async function doPlay(p){
  try{await p.locator('#loading_screen_play_button:not(.none_display)').click({timeout:6000});}catch{await p.evaluate(()=>document.getElementById('loading_screen_play_button').click());p.forcedPlay=true;}
  await p.waitForTimeout(1200);
  if(await p.locator('#hero_creation_panel_confirmation').isVisible().catch(()=>false)){await p.locator('[data-race_id=human]').click().catch(()=>{});await p.locator('#hero_creation_name_field').fill('Audit');await p.locator('[data-gender=female]').click().catch(()=>{});await p.locator('#hero_creation_panel_confirmation').click();await p.waitForTimeout(900);}
}
async function getSave(p){await p.locator('#save_button').click().catch(()=>{});await p.waitForTimeout(300);return p.evaluate(()=>localStorage.getItem('save data'));}
const loc=p=>p.locator('#location_related_div');
const routes={
 hub:async()=>{},
 findwork:async p=>{await loc(p).getByText('Find work',{exact:false}).first().click();await p.waitForTimeout(500);},
 busy:async p=>{await loc(p).getByText('Find work',{exact:false}).first().click();await p.waitForTimeout(400);await loc(p).locator('.location_choice_dropdown_expanded').getByText('Work on the fields').first().click();await p.waitForTimeout(1500);},
 combat:async p=>{await loc(p).getByText('Move somewhere else',{exact:false}).first().click();await p.waitForTimeout(400);await loc(p).locator('.location_choice_dropdown_expanded').getByText('Infested field').first().click();await p.waitForTimeout(5000);},
 merchant:async p=>{await loc(p).getByText('Visit a merchant',{exact:false}).first().click();await p.waitForTimeout(400);await loc(p).locator('.location_choice_dropdown_expanded div[onclick], .location_choice_dropdown_expanded [role=button]').filter({hasNotText:'Visit a merchant'}).first().click();await p.mouse.move(2,2);await p.waitForTimeout(800);},
 combatback:async p=>{await routes.combat(p);await loc(p).getByText(/Go back to/).first().click();await p.waitForTimeout(1500);},
 craft:async p=>{await p.locator('.choice_craft').first().click();await p.waitForTimeout(800);},
};
// Strict visibility: fully inside viewport, not covered at 5 probe points, not clipped by any scroll ancestor.
async function vis(handle){return handle.evaluate(e=>{const r=e.getBoundingClientRect();if(!r.width||!r.height)return {ok:false,why:'empty'};
  const W=innerWidth,H=innerHeight;if(r.top<0||r.left<0||r.bottom>H+0.5||r.right>W+0.5)return {ok:false,why:'viewport',r:[r.top,r.bottom]};
  for(let n=e.parentElement;n;n=n.parentElement){const s=getComputedStyle(n);if(/(auto|scroll|hidden|clip)/.test(s.overflowY+s.overflowX)){const q=n.getBoundingClientRect();if(r.top<q.top-0.5||r.bottom>q.bottom+0.5)return {ok:false,why:'clipped:'+(n.id||n.className).toString().slice(0,40),r:[Math.round(r.top),Math.round(r.bottom)],q:[Math.round(q.top),Math.round(q.bottom)]};}}
  const pts=[[r.left+r.width/2,r.top+r.height/2],[r.left+3,r.top+3],[r.right-3,r.top+3],[r.left+3,r.bottom-3],[r.right-3,r.bottom-3]];
  for(const [x,y] of pts){const t=document.elementFromPoint(x,y);if(!t||!(t===e||e.contains(t)))return {ok:false,why:'covered:'+(t&&(t.id||t.className||t.tagName)).toString().slice(0,40)};}
  return {ok:true,r:[Math.round(r.top),Math.round(r.bottom)]};});}
async function hscroll(p){return p.evaluate(()=>({doc:document.documentElement.scrollWidth>innerWidth,sw:document.documentElement.scrollWidth,w:innerWidth,vscroll:document.documentElement.scrollHeight>innerHeight}));}
module.exports={launch,open,doPlay,getSave,routes,vis,hscroll,loc,URL,get browser(){return browser}};
