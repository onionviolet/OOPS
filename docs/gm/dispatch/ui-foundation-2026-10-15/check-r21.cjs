// R21 check: one bar (MB2), control boxes (CB1–CB5), shell layout editing (MB1, MB9), name field,
// group drop-downs under Options. Journeys at 1920×1080 21px and 1366×768 21px by default.
// Usage: R4_URL=http://127.0.0.1:19490 node check-r21.cjs [R21_TARGETS=...]
const T=require('./target-set.cjs');const {L}=T;const {fs,path,assert}=L;
const E=path.join(__dirname,'evidence/r21/check');fs.mkdirSync(E,{recursive:true});
const list=process.env.R21_TARGETS?T.targets():T.targets().filter(t=>['1920-21','1366-21'].includes(T.tag(t)));
const results=[];let failed=0;
const step=async(name,fn)=>{try{await fn();results.push({name,ok:true});}catch(e){failed++;results.push({name,ok:false,error:e.message.split('\n')[0]});console.log('  FAIL',name,e.message.split('\n')[0]);}};
const rect=(p,s)=>p.evaluate(s=>{const n=document.querySelector(s);if(!n)return null;const r=n.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom};},s);
const snap=p=>p.evaluate(()=>{const s=simulationTestHooks.snapshot();delete s.saved_at;return JSON.stringify(s);});
const openMenu=async p=>{await p.locator('[data-control-box=game-bar-menu] > .control-box-button').click();await p.waitForTimeout(150);};
const layoutMenu=async p=>{await openMenu(p);await p.evaluate(()=>{document.querySelector('#control_box_game-bar-menu .workspace-layout-menu').open=true;});await p.waitForTimeout(100);};
const regionOf=(p,id)=>p.evaluate(id=>document.querySelector(`.workspace-module[data-module="${id}"]`)?.closest('.parity-region')?.dataset.region||null,id);
(async()=>{const b=await T.launch(900);
try{for(const t of list){const tag=T.tag(t);console.log('target',tag);
    const {ctx,p}=await L.open(b,{w:t.w,h:t.h,dpr:t.dpr});if(t.font!==14)await L.textSize(p,t.font);await p.waitForTimeout(400);
    const before=await snap(p);
    // Ticks run during the keep-open step, so the save comparison waits for a fresh baseline after it.
    await step(`${tag} one bar`,async()=>{
        assert.equal(await p.evaluate(()=>document.documentElement.dataset.oneBar),'true');
        assert.equal(await p.locator('#bottom_panel_div').isVisible(),false,'bottom bar hidden');
        for(const s of ['#game_bar #save_button','#game_bar #save_to_file_button','#game_bar #load_from_file_button','#game_bar .game-bar-save-state'])assert(await p.locator(s).isVisible(),s);
        assert.match(await p.locator('#game_bar .game-bar-save-state').textContent(),/Saving available|Read only|restore/i,'save state visible (UR55)');
        const bar=await rect(p,'#game_bar');assert(bar.h<=40,`bar ${bar.h}px is one row`);
        const page=await p.evaluate(()=>[document.documentElement.scrollHeight,innerHeight,document.documentElement.scrollWidth,innerWidth]);assert(page[0]<=page[1]&&page[2]<=page[3],`no page scroll ${page}`);
        await openMenu(p);assert(await p.locator('#control_box_game-bar-menu [data-workspace-action=context]').isVisible(),'Authoring in Menu');
        assert(await p.locator('#control_box_game-bar-menu #hits_counter').count(),'hit counter in Menu (UR50)');
        await p.keyboard.press('Escape');assert.equal(await p.evaluate(()=>document.activeElement?.closest('[data-control-box]')?.dataset.controlBox),'game-bar-menu','focus back to Menu');
        const more=p.locator('[data-control-box=game-bar-more]');if(await more.isVisible()){await more.locator(':scope > .control-box-button').click();const n=await p.locator('#control_box_game-bar-more .game-bar-overflow-item').count();assert(n>0,'overflow lists folded panels');await p.keyboard.press('Escape');}
    });
    await step(`${tag} inventory box`,async()=>{
        const box=p.locator('[data-control-box=inventory] > .control-box-button');assert(await box.isVisible());
        const header=await rect(p,'.workspace-module[data-module=belongings] > .workspace-module-header'),b1=await rect(p,'[data-control-box=inventory] > .control-box-button');assert(b1.y>=header.y-1&&b1.bottom<=header.bottom+1,'box sits in the Inventory header');
        await box.click();await p.waitForTimeout(150);
        assert(await p.locator('#control_box_inventory:popover-open').count(),'opens');
        const search=p.locator('#control_box_inventory input[type=search]');assert(await search.isVisible(),'search inside');
        await search.fill('bread');await p.waitForTimeout(500);
        assert.match(await box.textContent(),/"bread"/,'label names the search (CB4)');
        const panel=await rect(p,'#control_box_inventory'),log=await rect(p,'.parity-region[data-region=log]');assert(panel.right<=log.x+1,'not over the log');
        await p.keyboard.press('Escape');assert.equal(await p.locator('#control_box_inventory:popover-open').count(),0,'Esc closes');
        assert.equal(await p.evaluate(()=>document.activeElement?.closest('[data-control-box]')?.dataset.controlBox),'inventory','focus returns');
        // Outside press closes without activating what is under it (UR53).
        await box.click();await p.waitForTimeout(150);const row=await rect(p,'.workspace-module[data-module=local-actions] [data-native-choice]');
        const mode=await p.evaluate(()=>document.getElementById('center_mode_navigation')?.dataset.centerMode||'');
        await p.mouse.click(row.x+row.w/2,row.y+row.h/2);await p.waitForTimeout(300);
        assert.equal(await p.locator('#control_box_inventory:popover-open').count(),0,'outside press closes');
        assert.equal(await p.evaluate(()=>document.querySelector('.location_choice_dropdown_expanded')?1:0),0,'the action under the press did not open');
        assert.equal(await p.evaluate(()=>document.getElementById('center_mode_navigation')?.dataset.centerMode||''),mode);
        await box.click();await search.fill('');await p.keyboard.press('Escape');await p.waitForTimeout(300);
        assert.doesNotMatch(await box.textContent(),/"/,'cleared');
        // CB3 dial: Keep open docks the choices under the box and they stay through ticks.
        await box.click();await p.locator('#control_box_inventory .control-box-pin').click();await p.waitForTimeout(300);
        assert(await p.locator('.workspace-module[data-module=belongings] .control-box-inline input[type=search]').isVisible(),'kept inline in the Inventory panel');
        await p.evaluate(()=>{simulationTestHooks.resume();});await p.waitForTimeout(1500);await p.evaluate(()=>simulationTestHooks.pause());
        assert(await p.locator('.control-box-inline input[type=search]').isVisible(),'stays open through ticks');
        await p.locator('.control-box-inline .control-box-pin').click();await p.keyboard.press('Escape');await p.waitForTimeout(200);
        assert.equal(await p.locator('.control-box-inline').count(),0,'Float returns to the popover');
        const folded=await p.evaluate(()=>document.querySelector('.parity-inventory-controls')?.dataset.categoryFolded);
        console.log('   categories folded into the box:',folded);
    });
    const before2=await snap(p);
    await step(`${tag} reports box`,async()=>{
        const box=p.locator('[data-control-box=reports] > .control-box-button');assert.equal(await box.textContent().then(s=>s.trim().replace(/▾$/,'').trim()),'All reports');
        assert.equal(await p.locator('.workspace-module[data-module=shell-log-tools]').isVisible(),false,'old bottom rows gone');
        await box.click();await p.waitForTimeout(150);
        const panel=await rect(p,'#control_box_reports'),log=await rect(p,'.parity-region[data-region=log]');assert(panel.right<=log.x+1,`beside the log, not over it (${panel.right} vs ${log.x})`);
        const toggle=p.locator('#control_box_reports [data-native-filter=message_show_loot]');await toggle.click();await p.waitForTimeout(500);
        assert.match(await box.textContent(),/5\/6 kinds/);assert.equal(await p.evaluate(()=>document.getElementById('message_show_loot').classList.contains('active_selection_button')),false,'native filter owns the state');
        await toggle.click();await p.waitForTimeout(500);assert.match(await box.textContent(),/All reports/);
        await p.keyboard.press('Escape');
    });
    await step(`${tag} name field in the You header`,async()=>{
        const field=p.locator('.workspace-module[data-module=vitals] > .workspace-module-header #character_name_field');assert(await field.isVisible(),'name field in header');
        await field.fill('Weibao');await field.press('Enter');await field.blur();await p.waitForTimeout(200);
        assert.equal(await p.evaluate(()=>simulationTestHooks.snapshot().character.name),'Weibao','native handler stored the name');
        await field.fill('Hero');await field.press('Enter');await field.blur();
    });
    await step(`${tag} groups under Options`,async()=>{
        const shown=()=>p.evaluate(()=>[...document.querySelectorAll('#location_actions_div > details')].filter(d=>d.checkVisibility()).length);
        assert.equal(await shown(),0,'Actions tab holds only direct actions');
        const tab=p.locator('[data-place-tab=options]');assert.match(await tab.textContent(),/Options · \d+/);await tab.click();await p.waitForTimeout(300);
        assert(await shown()>0,'Options shows the groups');assert.equal(await p.evaluate(()=>[...document.querySelectorAll('#location_actions_div > [data-native-choice]')].filter(d=>d.checkVisibility()).length),0);
        await p.locator('[data-place-tab=actions]').click();await p.waitForTimeout(300);
    });
    await step(`${tag} save untouched by boxes (CB5)`,async()=>{const now=JSON.parse(await snap(p)),was=JSON.parse(before2);now.character.name=was.character.name;assert.equal(JSON.stringify(now),JSON.stringify(was));});
    await step(`${tag} layout editing in the shell`,async()=>{
        await T.shot(p,path.join(E,`before-edit-${tag}.png`));
        await layoutMenu(p);await p.locator('[data-workspace-action=edit-layout]').click();await p.waitForTimeout(300);
        assert.equal(await p.evaluate(()=>document.getElementById('main_content').dataset.parity),'r3','stays in the shell');
        const move=p.locator('.workspace-module[data-module=belongings] .shell-move-control select');assert(await move.isVisible(),'Move to on Inventory');
        assert.equal(await p.locator('.parity-region[data-region=log] .shell-move-control').count(),0,'log offers no Move to (UR11)');
        await move.selectOption('player');await p.waitForTimeout(500);
        assert.equal(await regionOf(p,'belongings'),'player');assert.equal(await regionOf(p,'vitals'),'inventory','You swapped down');
        const page=await p.evaluate(()=>[document.documentElement.scrollHeight,innerHeight]);assert(page[0]<=page[1],'no page scroll after move');
        // MB9: Tab order follows the visible order: You's module now comes after Around you's.
        const order=await p.evaluate(()=>[...document.querySelectorAll('.parity-region > .workspace-module:not([hidden])')].map(n=>n.dataset.module));
        assert(order.indexOf('belongings')<order.indexOf('focus')&&order.indexOf('focus')<order.indexOf('vitals'),`DOM order ${order.join(',')}`);
        const journal=p.locator('.workspace-module[data-module=records] .shell-move-control select');await journal.selectOption('inventory');await p.waitForTimeout(400);
        assert.equal(await regionOf(p,'records'),'inventory','Journal under the You box');
        await T.shot(p,path.join(E,`after-edit-${tag}.png`));
        const top=await p.evaluate(()=>parseFloat(document.getElementById('main_content').style.getPropertyValue('--shell-top-row')));assert(top<t.h*0.63,'a list on top does not drive the row past its cap');
        await p.reload();await p.waitForFunction(()=>!!window.simulationTestHooks);await L.R.startFresh(p).catch(()=>{});await p.evaluate(()=>simulationTestHooks.pause());await p.waitForTimeout(800);
        assert.equal(await regionOf(p,'belongings'),'player','placement survives reload');assert.equal(await regionOf(p,'records'),'inventory');
        await layoutMenu(p);await p.locator('[data-workspace-action=edit-layout]').click();await p.waitForTimeout(200);
        await layoutMenu(p);await p.locator('[data-workspace-action=shell-reset]').click();await p.waitForTimeout(400);
        assert.equal(await regionOf(p,'belongings'),'inventory','reset');assert.equal(await regionOf(p,'vitals'),'player');assert.equal(await regionOf(p,'records'),'actions');
        await layoutMenu(p);await p.locator('[data-workspace-action=edit-layout]').click();
        assert.equal(await snap(p).then(s=>JSON.parse(s).character.name),'Hero');
    });
    await ctx.close();}}
finally{await b.close();}
fs.writeFileSync(path.join(E,'results.json'),JSON.stringify(results,null,1));
console.log(`${results.filter(r=>r.ok).length}/${results.length} pass`);process.exitCode=failed?1:0;})();
