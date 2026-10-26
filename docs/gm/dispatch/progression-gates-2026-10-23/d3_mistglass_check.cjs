// D3 browser check: real capped Mistglass purification trial, panel outcome, save / reload / import.
const {launchChrome,advanceGameMinutes}=require('../../../../scripts/ui_helpers.cjs'),assert=require('assert/strict');
const base=process.env.URL||'http://127.0.0.1:19931/index.html',url=base+(base.includes('?')?'&':'?')+'test_hooks=1',shot=process.argv[2];
(async()=>{const b=await launchChrome();const errors=[];
const open=async s=>{const c=await b.newContext({viewport:{width:1920,height:1080}});if(s)await c.addInitScript(s=>{if(!localStorage.getItem('save data'))localStorage.setItem('save data',JSON.stringify(s))},s);const p=await c.newPage();p.setDefaultTimeout(12000);p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/404|Failed to load resource/.test(m.text()))errors.push(m.text())});await p.goto(url);await p.getByText('PLAY',{exact:true}).click();await p.waitForTimeout(800);return {c,p}};
const save=async p=>{await p.evaluate(()=>window.saveProgress());return p.evaluate(()=>JSON.parse(localStorage.getItem('save data')))};
const tech=s=>s.expansion?.worldAdaptation?.techniques??null, medXp=s=>s.levels.person.main_character.skill_xp.Meditation||0;
const panelText=p=>p.evaluate(()=>document.querySelector('#p23_mistglass_panel')?.innerText||'(no panel)');
const more=async(p,v)=>{await p.locator('select',{has:p.locator('option[value="'+v+'"]')}).first().selectOption(v);await p.waitForTimeout(300)};
const route=(p,id)=>p.evaluate(id=>document.querySelector(`button[data-route-id="${id}"]`).click(),id);
const openNotebook=async p=>{await route(p,'records:notebook');await p.locator('#notebook_box_div').waitFor({state:'visible'})};
const showPanel=async p=>{await route(p,'projects');await p.evaluate(()=>{for(const id of ['projects_drawer','p23_mistglass_panel']){const d=document.getElementById(id);if(d)d.open=true;}});};
const act=async(p,id)=>{await showPanel(p);const r=await p.evaluate(id=>{const btn=document.querySelector(`[data-mistglass-action="${id}"]`);if(!btn)return 'missing';if(btn.disabled)return 'disabled: '+btn.title;btn.click();return 'ok'},id);if(r!=='ok')throw Error(`mistglass ${id}: ${r}`);await p.waitForTimeout(250)};
let dbg;try{let {c,p}=await open();dbg=p;
await p.getByRole('button',{name:'Talk to someone'}).click();await p.locator('[data-dialogue="villageElder"]').click();await p.locator('[data-textline="hello"]').click();await p.waitForTimeout(600);await p.evaluate(()=>window.end_dialogue());await p.waitForTimeout(300);
const seed=await save(p);await c.close();
seed.character.money=30;seed.levels.person.main_character.skill_xp.Meditation=Number(process.env.MXP||200);
seed.availabilities.person.oldCraftsman|=1;seed.availabilities.dialogue.oldCraftsman|=1;seed.availabilities.textline['oldCraftsman:hello']|=4;seed.availabilities.location.Shack|=1;
({c,p}=await open(seed));dbg=p;
await p.waitForTimeout(500);console.log('SIM',await p.evaluate(()=>{const n=document.getElementById('simulation_panel');if(!n)return 'none';const path=[];for(let e=n;e&&e!==document.body;e=e.parentElement)path.push(e.tagName+(e.id?'#'+e.id:''));return 'hidden='+n.hidden+' '+path.join('<')}));
await more(p,'notebook');await p.waitForTimeout(300);await p.locator('[data-notebook-view="people"]').click();await p.waitForTimeout(300);if(!await p.locator('#simulation_panel').evaluate(n=>n.open))await p.locator('#simulation_panel > summary').click();await p.locator('[data-simulation="enroll"]').click();await p.waitForTimeout(300);
console.log('ENROLL',await p.evaluate(()=>{const n=document.getElementById('simulation_panel');return (n?.innerText||'').slice(0,400)}),'SIMSTATE',!!(await save(p)).expansion.simulation);console.log('PANEL0',await panelText(p));
await act(p,'enter');console.log('PANEL1',await panelText(p));
await act(p,'learn');await act(p,'method:breath');console.log('PANEL2',await panelText(p));
const buyDose=async()=>{await act(p,'trade');await p.locator('.trader_item_control .trader_item').first().click();await p.waitForTimeout(200);
  const total=await p.evaluate(()=>document.body.innerText.match(/Total price: [^\n]*/)?.[0]);console.log('TOTAL',total);
  await p.locator('#accept_trade_button').click();await p.waitForTimeout(300);if(await p.locator('#exit_trade_button').isVisible())await p.locator('#exit_trade_button').click();await p.evaluate(()=>{if(typeof window.exitTrade==='function')window.exitTrade()});await p.waitForTimeout(300)};
const doses=s=>Object.entries(s.inventories.person.main_character).filter(([k])=>k.includes('p23.mistglass.dose')).reduce((a,[,v])=>a+v.count,0);
await advanceGameMinutes(p,20);
await buyDose();
let s1=await save(p);console.log('AFTER BUY coins',s1.character.money,'doses',doses(s1));assert.equal(doses(s1),1);assert.equal(s1.character.money,27);
const xp0=medXp(s1);console.log('PRE panel',(await panelText(p)).match(/Condensate: [^\n]*/)?.[0]);
let outcome=null;
for(let attempt=1;attempt<=6;attempt++){
  await showPanel(p);console.log('TRADEVIS',await p.evaluate(()=>{const t=document.getElementById('trade_div');const r=[];for(const id of ['trade_div','accept_trade_button','exit_trade_button','cancel_trade_button']){const n=document.getElementById(id);r.push(id+':'+(n&&n.offsetParent!==null))}return r.join(' ')+' | '+(typeof is_in_trade==='function'?is_in_trade():'?')}));console.log('TRIALBTN',await p.locator('[data-mistglass-action="trial"]').evaluate(n=>n.disabled+' | '+n.title+' | '+n.innerText));for(let w=0;w<8&&await p.locator('[data-mistglass-action="trial"]').evaluate(n=>n.disabled);w++){await p.evaluate(()=>window.exit_trade());await advanceGameMinutes(p,5);await showPanel(p)}
await act(p,'trial');await advanceGameMinutes(p,13);
  const s=await save(p),gain=medXp(s)-xp0;
  const txt=await panelText(p);
  console.log('ATTEMPT',attempt,'xp',xp0,'->',medXp(s),'gain',gain);
  if(gain>0){outcome={s,txt,gain,attempt};break}
  console.log('ATTEMPT PANEL',txt.split('\n').filter(l=>/urif|raw|Insight|trial|Last/i.test(l)).join('\n'),'\nWA',JSON.stringify(s.expansion.worldAdaptation).slice(0,900));
  console.log('FAILED, rawness; waiting it out and retrying');await advanceGameMinutes(p,30);await buyDose();
  const mid=await save(p);assert.equal(doses(mid),1);
}
assert.ok(outcome,'a trial succeeded');
console.log('=== PANEL AFTER SUCCESS ===\n'+outcome.txt+'\n=== END ===');
const settleLine=outcome.txt.split('\n').find(l=>l.startsWith('Insight past one sitting settles into practice (converted)'));console.log('SETTLE LINE:',settleLine);
assert.ok(settleLine,'settle line shown');
console.log('XP',xp0,'->',medXp(outcome.s),'gain',outcome.gain);assert.notEqual(outcome.gain,30);
console.log('TECH after save',JSON.stringify(tech(outcome.s)));
if(shot){await showPanel(p);await p.screenshot({path:shot});}
const beforeReload=tech(outcome.s);await p.reload();await p.getByText('PLAY',{exact:true}).click();await p.waitForTimeout(800);
const reloaded=await save(p);console.log('TECH after reload',JSON.stringify(tech(reloaded)),'xp',medXp(reloaded));assert.deepEqual(tech(reloaded),beforeReload);
const encoded=await p.evaluate(()=>window.save_to_file());await Promise.all([p.waitForNavigation(),p.locator('#saved_file_input').setInputFiles({name:'d3.txt',mimeType:'text/plain',buffer:Buffer.from(encoded)})]);
await p.getByText('PLAY',{exact:true}).click();await p.waitForTimeout(800);const imported=await save(p);console.log('TECH after import',JSON.stringify(tech(imported)),'xp',medXp(imported));assert.deepEqual(tech(imported),beforeReload);assert.equal(medXp(imported),medXp(reloaded));
console.log('ERR',errors);await c.close()}catch(e){await dbg?.screenshot({path:process.env.FAILSHOT||'/tmp/fail.png'}).catch(()=>{});throw e}finally{await b.close()}})().catch(e=>{console.error(e.message||e);process.exit(1)});
