// usage: TAG=before node probe.cjs '[{"state":"hub","w":1366,"h":768}]'
const L=require('./lib.cjs');const fs=require('fs');const S=process.env.S;const TAG=process.env.TAG||'run';
const save=fs.readFileSync(S+'/out/progressed.json','utf8');
const TARGETS={
 hub:[],
 findwork:[['Talk','#location_actions_div >> text=Talk to someone']],
 busy:[['job title','#action_status_div'],['next pay','#time_for_earnings_div'],['stop','#action_end_div']],
 combat:[['enemy name','#enemies_div .enemy_name'],['enemy hp','#enemies_div .enemy_health_value'],['retreat','#location_actions_div >> text=/Go back to/'],['log last5','#message_box_div > .message_common >> nth=-1'],['log -2','#message_box_div > .message_common >> nth=-2'],['log -3','#message_box_div > .message_common >> nth=-3'],['log -4','#message_box_div > .message_common >> nth=-4'],['log -5','#message_box_div > .message_common >> nth=-5']],
 merchant:[['trader row','#trader_inventory_div > .trader_item_control'],['own row','#inventory_content_div .character_item_control'],['trader qty','#trader_inventory_div > .trader_item_control .trade_ammount_buttons'],['own qty','#inventory_content_div .character_item_control .trade_ammount_buttons'],['total','#trade_price_div'],['accept','#accept_trade_button']],
 craft:[['tabs','#crafting_mainpage_buttons'],['recipes','.recipe_div, .crafting_recipe, .recipe_entry']],
};
(async()=>{await L.launch();const jobs=JSON.parse(process.argv[2]);const res=[];
for(const j of jobs){const {state,w,h,zoom=1,preset,fresh}=j;const {p,ctx}=await L.open({w,h,zoom,save:fresh?null:save,storage:j.storage});
 let err=null;try{if(preset){await p.locator('.workspace-layout-menu > summary').click().catch(()=>{});await p.selectOption('select[data-workspace-action=preset]',preset).catch(e=>console.log('PRESETERR',e.message));await p.locator('.workspace-layout-menu > summary').click().catch(()=>{});await p.waitForTimeout(500);}await L.routes[state](p);}catch(e){err=e.message.split('\n')[0];}
 const name=`${fresh?"T1":""}${state}${preset?"-"+preset:""}_${w}x${h}${zoom!==1?'@'+zoom*100:''}_${TAG}`;await p.screenshot({path:`${S}/shots/${name}.png`});
 // native action list: direct children of #location_actions_div that are clickable
 const actions=[];const kids=await p.locator('#location_actions_div > *').all();
 for(const k of kids){const info=await k.evaluate(e=>({id:e.id,cls:e.className,txt:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,60),native:e.matches('div[onclick],.location_choice_dropdown,.location_action_div')||!!e.querySelector(':scope > div[onclick]'),disp:getComputedStyle(e).display}));if(info.disp==='none'||!info.txt)continue;const v=await L.vis(k);actions.push({...info,vis:v.ok,why:v.why});}
 const t={};for(const [n,sel] of (TARGETS[state]||[])){const l=p.locator(sel);const c=await l.count();if(!c){t[n]='absent';continue;}const all=[];for(let i=0;i<Math.min(c,8);i++){const v=await L.vis(l.nth(i));all.push(v.ok?'Y':'n:'+v.why);}t[n]={count:c,vis:all};}
 const hs=await L.hscroll(p);
 res.push({name,err,hs,targets:t,actions,errs:p.errs.slice(0,3)});console.log(name,err||'',JSON.stringify(hs),JSON.stringify(t));
 for(const a of actions)console.log('   ',a.vis?'VIS ':'--- ',a.native?'N':'x',a.txt.slice(0,50),a.vis?'':a.why);
 await ctx.close();}
fs.writeFileSync(`${S}/out/probe_${TAG}.json`,JSON.stringify(res,null,1));await L.browser.close();})();
