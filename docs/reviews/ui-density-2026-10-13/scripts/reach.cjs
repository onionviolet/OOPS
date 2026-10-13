const L=require('./lib.cjs');const measure=require('./measure.cjs');const fs=require('fs');
const S=process.env.S, OUT=process.env.OUT;const saves={original:S+'/out/orig_progressed.json',v06:S+'/out/v06_progressed.json',current:S+'/out/current_progressed.json'};
const loc=p=>p.locator('#location_related_div');
async function reach(p,locator){return locator.evaluate(e=>{const r=e.getBoundingClientRect();const bar=document.getElementById('bottom_panel_div');const bt=bar?bar.getBoundingClientRect().top:innerHeight;const x=r.left+Math.min(r.width/2,40),y=r.top+Math.min(r.height/2,10);if(y<0||y>=bt||x<0||x>=innerWidth)return false;const t=document.elementFromPoint(x,y);return !!t&&(t===e||e.contains(t));});}
// click with interaction accounting
async function act(p,cost,locator,label){const l=locator.first();await l.waitFor({state:'attached',timeout:5000});
 if(!(await reach(p,l))){cost.scrolls++;cost.log.push('scroll→'+label);await l.scrollIntoViewIfNeeded();await p.waitForTimeout(150);}
 await l.click({timeout:5000});cost.clicks++;cost.log.push('click '+label);await p.waitForTimeout(400);}
const T=(p,t)=>loc(p).getByText(t,{exact:false});
const routes={
 hub:async()=>{},
 busy:async(p,c)=>{await act(p,c,T(p,'Find work'),'Find work');await act(p,c,loc(p).locator('.location_choice_dropdown_expanded').getByText('Work on the fields'),'Work on the fields');await p.waitForTimeout(1500);},
 combat:async(p,c)=>{await act(p,c,T(p,'Move somewhere else'),'Move');await act(p,c,loc(p).locator('.location_choice_dropdown_expanded').getByText('Infested field'),'Infested field');await p.waitForTimeout(5000);},
 merchant:async(p,c)=>{await act(p,c,T(p,'Visit a merchant'),'Visit a merchant');await act(p,c,loc(p).locator('.location_choice_dropdown_expanded div[onclick], .location_choice_dropdown_expanded [role=button]').filter({hasNotText:'Visit a merchant'}),'trader');await p.waitForTimeout(800);},
 craft:async(p,c)=>{await act(p,c,p.locator('.choice_craft'),'Try to craft');await p.waitForTimeout(800);},
};
async function stability(p,sel){return p.evaluate(async sel=>{const els=sel.map(s=>[s,document.querySelector(s)]).filter(x=>x[1]);const first=els.map(([s,e])=>e.getBoundingClientRect().top);let max=els.map(()=>0);const sc=[...document.querySelectorAll('.workspace-module-body,#message_log_div,#location_actions_div')];
 for(let i=0;i<24;i++){await new Promise(r=>setTimeout(r,250));els.forEach(([s,e],j)=>{max[j]=Math.max(max[j],Math.abs(e.getBoundingClientRect().top-first[j]))});}
 return Object.fromEntries(els.map(([s],j)=>[s,Math.round(max[j])]));},sel);}
async function focusWalk(p,targets){return p.evaluate(()=>document.activeElement?.blur()).then(async()=>{const seq=[];for(let i=0;i<160;i++){await p.keyboard.press('Tab');const d=await p.evaluate(()=>{const e=document.activeElement;if(!e||e===document.body)return null;const r=e.getBoundingClientRect();let hidden=false;for(let n=e;n;n=n.parentElement){const s=getComputedStyle(n);if(s.display==='none'||s.visibility==='hidden')hidden=true;}const coll=!!e.closest('.workspace-collapsed,details:not([open]) > :not(summary)');const inView=r.bottom>0&&r.top<innerHeight&&r.width>0;const ring=getComputedStyle(e).outlineStyle!=='none'||getComputedStyle(e).boxShadow!=='none';return {t:(e.getAttribute('aria-label')||e.innerText||e.value||e.tagName).replace(/\s+/g,' ').trim().slice(0,40),inView,hidden,coll,ring,y:Math.round(r.top),chrome:!!e.closest('.workspace-toolbar,.workspace-module-header,.workspace-module-controls,.workspace-divider,.workspace-resize-grip')};});seq.push(d);if(i>5&&d&&seq[0]&&d.t===seq[0].t&&d.y===seq[0].y)break;}
 const idx=t=>seq.findIndex(s=>s&&s.t.includes(t));return {steps:seq.length,first:targets.map(t=>[t,idx(t)]),chromeStops:seq.filter(s=>s&&s.chrome).length,offscreenStops:seq.filter(s=>s&&!s.inView).length,hiddenStops:seq.filter(s=>s&&(s.hidden||s.coll)).length,noRing:seq.filter(s=>s&&!s.ring).length,seq:seq.slice(0,60)};});}
(async()=>{await L.launch();const results=[];const plan=JSON.parse(process.env.PLAN);
for(const job of plan){const {build,state,w,h,zoom=1,extra}=job;const save=fs.readFileSync(saves[build],'utf8');const storage=job.layout?{}:null;
 let p,ctx;try{({p,ctx}=await L.open(build,{width:w,height:h,zoom,save}));}catch(e){results.push({T:job.T,build,state,viewport:`${w}x${h}@${zoom}`,openError:e.message.split('\n')[0]});fs.writeFileSync(process.env.RES,JSON.stringify(results,null,1));console.log('OPENFAIL',build,state,w,h,zoom,e.message.split('\n')[0]);continue;}const cost={clicks:0,scrolls:0,log:[]};let err=null;
 try{if(job.preset){await p.selectOption('select[data-workspace-action=preset]',job.preset);await p.waitForTimeout(500);}
   await routes[state](p,cost);
   if(extra==='ledger'){await p.locator('summary:has-text("Work ledger")').first().click();await p.waitForTimeout(400);}
   if(extra==='authoring'){await p.getByRole('button',{name:'Authoring'}).click();await p.waitForTimeout(600);}
 }catch(e){err=e.message.split('\n')[0];}
 const tag=`${state}${job.preset?'-'+job.preset:''}${extra?'-'+extra:''}`;const vp=`${w}x${h}${zoom!==1?'@'+zoom*100+'pct':''}`;
 await p.screenshot({path:`${OUT}/${job.T}_${tag}_${vp}_${build}.png`});
 const m=await p.evaluate(`(${measure.toString()})()`);
 const TG={hub:[['Talk to someone','#location_related_div >> text=Talk to someone'],['Find work','#location_related_div >> text=Find work'],['Visit a merchant','#location_related_div >> text=Visit a merchant'],['Try to craft','.choice_craft'],['Gather resources','#location_related_div >> text=Gather resources'],['first [use] food','text=[use]'],['inventory row 1','.inventory_item_div, #character_inventory_list > div']],
 busy:[['job title','#location_related_div >> text=/Working on/'],['stop/finish','#location_related_div >> text=/(Finish|Stop) fieldwork/'],['next earnings','#location_related_div >> text=/(earnings|pay) in/'],['progress bar','#action_progress_bar, .action_progress_bar']],
 combat:[['enemy hp','.enemy_hp_bar, [id^=enemy_hp]'],['go back','#location_related_div >> text=/Go back to/'],['message log','#message_log_div'],['enemy count','#enemy_count_div']],
 merchant:[['trader row 1','#trader_inventory_div [class*=item]'],['own sellable row 1','#trade_character_inventory_list > :first-child, #character_inventory_list > :first-child'],['Accept','#accept_trade_button'],['total price','#trade_price_div']],
 craft:[['category tabs','#crafting_mainpage_buttons'],['makeable filter','#crafting_makeable_filter'],['recipe row 1','.recipe_div, .crafting_recipe'],['close crafting','text=/^(Exit|Close)/']]};
 const reachT={};for(const [n,sel] of (TG[state]||[])){try{const l=p.locator(sel).first();if(!(await l.count())){reachT[n]='absent';continue;}if(!(await l.isVisible())){reachT[n]='hidden';continue;}reachT[n]=(await reach(p,l))?'onscreen':'needs-scroll';}catch(e){reachT[n]='err';}}
 let stab=null,focus=null;if(job.stab)stab=await stability(p,['.location_choice_dropdown','#action_end_div','#action_status_div','.choice_craft','#combat_div','#enemies_div','#message_log_div','[data-structured-action]']);
 if(job.focus)focus=await focusWalk(p,['Talk to someone','Find work','Move somewhere else','Visit a merchant','craft']);
 const text=(await loc(p).innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,1500);
 results.push({reachT,T:job.T,build,state:tag,viewport:vp,zoom,cost,err,m,stab,focus,actionText:text,errs:p.errs});console.log(job.T,build,tag,vp,'err',err,'cost',cost.clicks,cost.scrolls,'play',m.clickables.play,'h-ovf',m.doc.hOverflow,'v-ovf',m.doc.vOverflow);fs.writeFileSync(process.env.RES,JSON.stringify(results,null,1));await ctx.close();}
fs.writeFileSync(process.env.RES,JSON.stringify(results,null,1));await L.browser.close();})();
