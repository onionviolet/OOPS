// UIL8: rebuilt bundle, fresh storage contexts and the existing populated fixture. No personal save.
const T=require('./target-set.cjs'),{fs,path,assert}=T.L;
const E=path.join(__dirname,'evidence/uil8');fs.mkdirSync(E,{recursive:true});
const targets=T.targets().filter(t=>['1920','1366'].includes(t.name));
const wait=p=>p.waitForTimeout(550);
const pinKey='panel.shell-character.pin.health_regeneration_percent';
const region=p=>p.evaluate(()=>document.querySelector('.workspace-module[data-module=condition]').closest('.parity-region')?.dataset.region);
const row=p=>p.locator('#shell_condition [data-attribute-preview=health_regeneration_percent]');
async function reload(p){await p.reload({waitUntil:'domcontentloaded'});await T.L.R.startFresh(p);await p.evaluate(()=>simulationTestHooks.pause());await wait(p);}
async function importSave(p,file){const loaded=p.waitForEvent('domcontentloaded');await p.locator('#saved_file_input').setInputFiles(file);await loaded;await T.L.R.startFresh(p);await p.evaluate(()=>simulationTestHooks.pause());await wait(p);}
async function saveExport(p,file){await p.locator('#save_button').click();const pending=p.waitForEvent('download');await p.locator('#save_to_file_button').click();await(await pending).saveAs(file);}
async function pin(p,on){
    await p.locator('.shell-attributes-open').click();await wait(p);
    await p.locator('.attribute-inspector-row[data-attribute-id=health_regeneration_percent]').click();
    const button=p.locator('[data-pin-attribute=health_regeneration_percent]');
    assert.equal(await button.getAttribute('aria-pressed'),String(!on));await button.click();
    await p.keyboard.press('Escape');await wait(p);
}
const snap=p=>p.evaluate(()=>{
    const weather=document.querySelector('#weather_div').dataset;
    const visible=s=>[...document.querySelectorAll(s)].filter(n=>!n.hidden).map(n=>({id:n.dataset.attributePreview,text:n.textContent,visible:n.checkVisibility()}));
    return {weather:{...weather},header:document.querySelector('.scene-location-header').textContent,
        warnings:document.querySelectorAll('.scene-conditions [data-cold-warning]').length,
        secondary:visible('#proto23_character .shell-secondary-stat'),rates:visible('#shell_condition .shell-secondary-stat'),
        condition:document.querySelector('#shell_condition').textContent,conditionFont:getComputedStyle(document.querySelector('#shell_condition')).fontSize,region:document.querySelector('[data-module=condition].workspace-module')?.closest('.parity-region')?.dataset.region,
        overflow:document.documentElement.scrollWidth>innerWidth,reader:window.yairpgChangeSignal.inspect().readers.find(r=>r.id==='condition')};
});
(async()=>{const b=await T.launch(900),out={targets:[],cases:[]};try{
for(const t of targets){console.log('target',T.tag(t));const{p,ctx}=await T.L.open(b,{w:t.w,h:t.h,dpr:t.dpr});if(t.font!==14)await T.L.textSize(p,t.font);await wait(p);
    const r={target:T.tag(t),initial:await snap(p)};out.targets.push(r);
    assert(!r.initial.secondary.some(x=>['cold_tolerance','attack_count','unarmed_power'].includes(x.id)));
    assert.equal(r.initial.rates.length,0);assert(r.initial.header.includes('comfortable'));assert.equal(r.initial.warnings,0);
    assert.equal(r.initial.conditionFont,`${t.font}px`);assert.equal(r.initial.reader.error,null);assert.deepEqual(r.initial.reader.topics,['body','time','place']);assert.equal(r.initial.region,'player');
    await T.shot(p,path.join(E,`after-${T.tag(t)}.png`));
    // Focus, pin the weather inspection, dismiss. No clock or work changes.
    const before=await T.L.state(p);const temp=p.locator('.scene-conditions [data-context-preview=temperature]');await temp.focus();await wait(p);
    assert(await p.locator('#shell_context_preview').evaluate(n=>n.matches(':popover-open')));assert((await p.locator('#shell_context_preview').textContent()).includes('Cold tolerance'));
    await temp.click();await p.keyboard.press('Escape');assert.deepEqual((await T.L.state(p)).clock,before.clock);
    // Open through the shared route, then return. More N uses the same route if folded.
    await p.keyboard.press('Alt+o');await wait(p);assert.equal(await p.locator('#center_mode_navigation').getAttribute('data-center-mode'),'workspace:condition');
    await T.shot(p,path.join(E,`after-${T.tag(t)}-nav.png`));await p.keyboard.press('Escape');await wait(p);
    // Pin on, reload, literal game import, unpin, reload and literal import.
    await pin(p,true);assert(await row(p).isVisible());
    const pinnedFile=path.join(E,`temporary-${T.tag(t)}.save.txt`);await saveExport(p,pinnedFile);
    await reload(p);assert(await row(p).isVisible());await importSave(p,pinnedFile);assert(await row(p).isVisible());
    r.pinned=await snap(p);await T.shot(p,path.join(E,`after-${T.tag(t)}-pinned.png`));
    // Layout transfer is also the actual display preference import/export boundary.
    await p.locator('[data-control-box=game-bar-menu] > .control-box-button').click();
    await p.evaluate(()=>{document.querySelector('.workspace-layout-menu').open=true;document.querySelector('.workspace-transfer').open=true;});
    await p.locator('[data-workspace-action=export]').click();
    const config=await p.locator('[aria-label="Layout configuration"]').inputValue();
    r.layoutExportHasPin=config.includes(pinKey);console.log('pins roundtrip',T.tag(t));
    assert(r.layoutExportHasPin);await p.evaluate(()=>{document.querySelector('.workspace-layout-menu').open=false;});
    await pin(p,false);assert(!await row(p).isVisible());
    await p.locator('[data-control-box=game-bar-menu] > .control-box-button').click();
    await p.evaluate(()=>{document.querySelector('.workspace-layout-menu').open=true;document.querySelector('.workspace-transfer').open=true;});
    await p.locator('[aria-label="Layout configuration"]').fill(config);await p.locator('[data-workspace-action=import]').click();await wait(p);
    assert(await row(p).isVisible());r.displayImported=true;await pin(p,false);assert(!await row(p).isVisible());
    await reload(p);assert(!await row(p).isVisible());await importSave(p,pinnedFile);assert(!await row(p).isVisible());fs.rmSync(pinnedFile);
    r.unpinned=await snap(p);
    // Real native food action changes a neutral regeneration row to a non-neutral rate.
    const item=p.locator('#inventory_content_div > [data-character_item]').filter({has:p.locator('.item_name',{hasText:'Fresh bread'})}).first();
    await item.locator('.item_name').click();await p.locator('[data-shell-item-action=use]').click();await wait(p);
    const rate=p.locator('#shell_condition [data-attribute-preview=stamina_regeneration_flat]');assert(await rate.isVisible());assert((await rate.textContent()).includes('0.5'));
    r.effect=await snap(p);await T.shot(p,path.join(E,`after-${T.tag(t)}-meal.png`));
    await p.locator('.condition-effect[data-effect-id="Basic meal"]').focus();await wait(p);assert((await p.locator('#shell_context_preview').textContent()).includes('Basic meal'));await p.keyboard.press('Escape');
    // Layout menu and Move to are real controls, not a seeded placement.
    await p.locator('[data-control-box=game-bar-menu] > .control-box-button').click();
    await p.evaluate(()=>{document.querySelector('.workspace-layout-menu').open=true;});await p.locator('[data-workspace-action=edit-layout]').click();await wait(p);
    const move=p.locator('[data-workspace-action=shell-move][data-box=condition]');r.moveControlCount=await move.count();
    assert.equal(await move.inputValue(),'player');await move.selectOption('actions');await wait(p);assert.equal(await region(p),'actions');
    await T.shot(p,path.join(E,`after-${T.tag(t)}-moved.png`));await move.selectOption('player');await wait(p);assert.equal(await region(p),'player');
    r.errors=p.errors;assert.deepEqual(p.errors,[]);await ctx.close();
}
// Cold exposure and native Wet: both restored through the native save loader. The warm case uses the same clock and no Wet.
for(const t of targets)for(const wet of [false,true]){const data=JSON.parse(T.L.save);if(wet)data.active_effects={Wet:{duration:30}};
    const{p,ctx}=await T.L.open(b,{w:t.w,h:t.h,data:JSON.stringify(data)});if(t.font!==14)await T.L.textSize(p,t.font);const r=await snap(p);r.case=wet?'wet-cold':'warm';r.target=T.tag(t);out.cases.push(r);
    const d=r.weather,cold=Number(d.temperatureC)+Number(d.coldTolerance)<=Number(d.coldThreshold);
    assert.equal(cold,wet);assert.equal(r.warnings,cold?1:0);assert(r.header.includes(cold?' · cold':' · comfortable'));
    await T.shot(p,path.join(E,`after-${T.tag(t)}-${r.case}.png`));assert.deepEqual(p.errors,[]);await ctx.close();}
}finally{fs.writeFileSync(path.join(E,'after.json'),JSON.stringify(out,null,2));await b.close();}console.log('UIL8 browser checks passed');})().catch(e=>{console.error(e);process.exit(1);});
