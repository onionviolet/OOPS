// UM5 journey check (2026-10-22): each new control box opens, its native control acts through its
// own owner, the label follows, Esc closes and returns focus (UR53), and leaving the parity shell
// puts every native control back in its native home.
const L=require('../ui-foundation-2026-10-15/r11-lib.cjs');const {fs,path,assert}=L;const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=process.env.URL,E=path.join(__dirname,'evidence','strip-boxes');fs.mkdirSync(E,{recursive:true});
(async()=>{const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});const gates=[];const results=[];
for(const [w,h,font] of (process.env.TARGETS?JSON.parse(process.env.TARGETS):[[1920,1080,14],[1920,1080,21],[1536,864,21]])){
const ctx=await b.newContext({viewport:{width:w,height:h},reducedMotion:'reduce'});await ctx.route('**/private_packs/manifest.json',r=>r.fulfill({json:{schema:1,packs:[]}}));
const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));p.setDefaultTimeout(25000);
await p.goto(base+'/style.css');await p.evaluate(d=>{localStorage.clear();localStorage.setItem('save data',d);},L.save);
await p.goto(base+'/?test_hooks=1',{waitUntil:'domcontentloaded'});await L.R.startFresh(p);await p.evaluate(()=>simulationTestHooks.pause());if(font!==14)for(let i=1;;i++){try{await L.textSize(p,font);break;}catch(e){if(i>=3)throw e;await p.keyboard.press('Escape');}}await p.waitForTimeout(800);
const label=id=>p.locator(`[data-control-box="${id}"] .control-box-label`).first().textContent();
const tag=`${w}x${h}-${font}`;
// Quests: Hide completed.
assert.equal(await label('quests'),'All quests');
await p.locator('[data-control-box="quests"] .control-box-button').click();
assert.equal(await p.locator('#control_box_quests').evaluate(n=>n.matches(':popover-open')),true);
await p.locator('#quest_hiding_button').click();
assert.equal(await label('quests'),'Completed hidden');
await p.keyboard.press('Escape');
assert.equal(await p.locator('#control_box_quests').evaluate(n=>n.matches(':popover-open')),false);
assert.equal(await p.evaluate(()=>document.activeElement?.closest('[data-control-box]')?.dataset.controlBox),'quests');
gates.push(tag+' quests: open, native Hide completed, label, Esc focus');
// Journal tabs: the Quests box hides on another tab.
await p.evaluate(()=>document.getElementById('journal_show_bestiary').click());await p.waitForTimeout(100);
assert.equal(await p.locator('[data-control-box="quests"]').first().isVisible(),false);
await p.evaluate(()=>document.getElementById('journal_show_quests').click());await p.waitForTimeout(100);
assert.equal(await p.locator('[data-control-box="quests"]').first().isVisible(),true);
gates.push(tag+' quests box follows the Journal tab');
// Skills: sort by level through the native owner.
await p.locator('[data-panel-path="skills"]').first().evaluate(n=>n.click());await p.waitForTimeout(500);
assert.equal(await label('skills'),'Name');
await p.locator('[data-control-box="skills"] .control-box-button').first().focus();await p.keyboard.press('Enter');
assert.equal(await p.locator('#control_box_skills').evaluate(n=>n.matches(':popover-open')),true);
for(let i=0;i<8&&await p.evaluate(()=>document.activeElement?.id)!=='skill_sort_by_level';i++)await p.keyboard.press('Tab');
assert.equal(await p.evaluate(()=>document.activeElement?.id),'skill_sort_by_level','Tab reaches a moved sort control');
await p.keyboard.press('Enter');await p.waitForTimeout(100);
assert.equal(await p.locator('#skill_sort_by_level').evaluate(n=>n.classList.contains('active_selection_button')),true);
assert.equal(await label('skills'),'Level');
await p.locator('#options_hide_max_level_skills').click();
assert.equal(await label('skills'),'Level · Max level hidden');
await p.keyboard.press('Escape');
gates.push(tag+' skills: keyboard open, Tab and Enter on a moved sort control, Hide max level, label');
await p.locator('[data-control-box="skills"] .control-box-button').first().click();await p.locator('#skill_sort_by_name').click();await p.locator('#options_hide_max_level_skills').click();await p.keyboard.press('Escape');
// Crafting: recipe kind and Makeable now.
await p.locator('[data-panel-path="crafting"]').first().evaluate(n=>n.click());await p.waitForTimeout(500);
const craftLabel=await label('crafting');assert.match(craftLabel,/Items\/trinkets|All recipes/);
await p.locator('[data-control-box="crafting"] .control-box-button').first().click();
await p.locator('#crafting_makeable_filter').check();await p.waitForTimeout(100);
assert.match(await label('crafting'),/Makeable now/);
const comp=p.locator('#crafting_subpage_buttons [data-crafting_subcategory="components"]');
if(await comp.isVisible()){await comp.focus();await p.keyboard.press('Enter');await p.waitForTimeout(100);assert.match(await label('crafting'),/^Components/);gates.push(tag+' crafting: Enter on a moved recipe kind acts');}
await p.keyboard.press('Escape');await p.locator('[data-control-box="crafting"] .control-box-button').first().click();await p.locator('#crafting_makeable_filter').uncheck();await p.keyboard.press('Escape');
await p.screenshot({path:path.join(E,tag+'-crafting.png')});
gates.push(tag+' crafting: native recipe kind and Makeable now, label');
// CTL4: Hide completed and Hide max level skills are gameplay-save state; set both from their boxes, Save, reload.
await p.evaluate(()=>{for(let i=0;i<6&&document.getElementById('main_content').dataset.centerTask;i++)document.getElementById('center_mode_back')?.click();});await p.waitForTimeout(500);
try{await p.locator('[data-control-box="quests"]').first().waitFor({state:'visible',timeout:5000});}catch(e){console.log('STATE',JSON.stringify(await p.evaluate(()=>{const n=document.querySelector('[data-control-box="quests"]'),m=document.querySelector('.workspace-module[data-module="records"]'),r=document.getElementById('main_content');return{boxHidden:n?.hidden,inHeader:!!n?.closest('.workspace-module-header'),modHidden:m?.hidden,modVis:m?.checkVisibility(),ctx:r.dataset.layoutContext,task:r.dataset.centerTask,comp:r.dataset.shellCompanions,item:r.dataset.parityItem,expanded:r.dataset.parityExpanded,quests:document.getElementById('journal_show_quests').className};})));throw e;}
await p.locator('[data-control-box="quests"] .control-box-button').click();await p.locator('#quest_hiding_button').check();await p.keyboard.press('Escape');
await p.locator('[data-panel-path="skills"]').first().evaluate(n=>n.click());await p.waitForTimeout(300);
await p.locator('[data-control-box="skills"] .control-box-button').first().click();await p.locator('#options_hide_max_level_skills').check();await p.keyboard.press('Escape');
await p.evaluate(()=>document.getElementById('save_button').click());await p.waitForTimeout(300);
const saved=await p.evaluate(()=>{const s=JSON.parse(localStorage.getItem('save data'));return {quests:s.are_finished_quests_hidden,skills:s.options?.hide_max_level_skills};});
assert.deepEqual(saved,{quests:true,skills:true});
await p.reload({waitUntil:'domcontentloaded'});await L.R.startFresh(p);await p.evaluate(()=>simulationTestHooks.pause());await p.waitForTimeout(800);
assert.deepEqual(await p.evaluate(()=>({q:document.getElementById('quest_hiding_button').checked,s:document.getElementById('options_hide_max_level_skills').checked})),{q:true,s:true});
assert.equal(await label('quests'),'Completed hidden');
await p.locator('[data-panel-path="skills"]').first().evaluate(n=>n.click());await p.waitForTimeout(300);
assert.match(await label('skills'),/Max level hidden$/);
gates.push(tag+' CTL4: both moved save toggles Save, reload and relabel');
// Leaving the parity shell restores every native home.
await p.evaluate(()=>{const s=document.querySelector('[data-workspace-action=presentation]');s.value='existing';s.dispatchEvent(new Event('change',{bubbles:true}));});await p.waitForTimeout(500);
const homes=await p.evaluate(()=>({sort:document.getElementById('skill_sorting_buttons').parentElement.id,skillHide:document.getElementById('skill_hiding_div').parentElement.id,quest:document.getElementById('quest_hiding_div').parentElement.id,sub:document.getElementById('crafting_subpage_buttons').parentElement.id,make:document.getElementById('crafting_makeable_filter').closest('label').parentElement.id,boxes:document.querySelectorAll('[data-control-box=skills],[data-control-box=quests],[data-control-box=crafting]').length}));
assert.deepEqual(homes,{sort:'skill_list_div',skillHide:'skill_list_div',quest:'quests_box_div',sub:'crafting_window',make:'crafting_window',boxes:0});
await p.evaluate(()=>{const s=document.querySelector('[data-workspace-action=presentation]');s.value='proto23-parity';s.dispatchEvent(new Event('change',{bubbles:true}));});await p.waitForTimeout(500);
assert.equal(await p.evaluate(()=>document.getElementById('quest_hiding_div').closest('.control-box-body')?.id||document.getElementById('quest_hiding_div').closest('.control-box-panel')?.id),'control_box_quests');
gates.push(tag+' classic restores native homes; parity re-boxes');
assert.deepEqual(errors,[]);results.push({tag,errors});await ctx.close();console.log('PASS',tag);}
await b.close();fs.writeFileSync(path.join(E,'strip-boxes.json'),JSON.stringify({status:'PASS',gates,results},null,1));console.log('ALL PASS',gates.length,'gates');})().catch(e=>{console.error('FAIL',e.message);process.exit(1);});
