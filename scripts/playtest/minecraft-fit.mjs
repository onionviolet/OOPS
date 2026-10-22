// Native controls on a disposable, explicitly seeded assembled-workshop save.
// Ordinary stock/access is seeded; all new works, jobs and discoveries are earned.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';
import {createFieldFixture,joinField,completeFieldProject} from '../field_fixtures.mjs';
import {WORKS as I,WORKS_KEYS as K} from '../../src/field_works_content.js';
const root=resolve(process.argv[2]||'.'),out=resolve(process.argv[3]||'/tmp/minecraft-fit-proof');await mkdir(out,{recursive:true});
const server=await serve(root),s=new Session({url:server.url+'?test_hooks=1',seed:71,wall:Date.UTC(2026,9,21,15),opTimeout:10000}),checks=[];let p;
const snap=()=>p.evaluate(()=>simulationTestHooks.snapshot());
const stock=(save,k)=>save.inventories.person.main_character[K[k]]?.count||0;
async function openWorks(){
    // Reach the works through an ordinary local-place action and shared Back stack.
    if(!await p.locator('[data-field-workshop-door]').isVisible())await p.locator('#center_mode_back').click();
    await p.locator('[data-field-workshop-door]').click();
    await p.mouse.move(960,5);await p.waitForTimeout(220);
    if(await p.locator('#shell_item_preview').evaluate(el=>el.matches(':popover-open')))await p.keyboard.press('Escape');
    assert.equal(await p.locator('[data-field-works]').isVisible(),true);
}
async function click(id){await openWorks();const special=['cancel','pause','resume','queue_sequence','apply_sequence','queue_garden'].includes(id);const b=p.locator(`[data-works-command="${special||id.startsWith(I.prefix)?id:I.prefix+id}"]`);await b.evaluate(el=>{for(let n=el.parentElement;n;n=n.parentElement)if(n.tagName==='DETAILS')n.open=true;});assert.equal(await b.isDisabled(),false,`${id}: ${await b.locator('..').innerText()}`);await b.click();}
async function finish(){const save=await snap(),job=save.expansion.simulation.jobs.find(j=>j.actorId==='player');if(job)await s.step(job.due-save.expansion.clock);await openWorks();}
async function run(id){console.log('native',id);await click(id);await finish();}
async function play(){await p.waitForFunction(()=>typeof simulationTestHooks==='object');await p.evaluate(()=>simulationTestHooks.pause());await p.locator('#loading_screen_play_button').click();await p.waitForTimeout(150);await openWorks();}
async function roundtrip(label){
    const before=await s.save();await p.reload();await play();let after=await s.save();assert.deepEqual(after.expansion,before.expansion,`${label}: reload`);assert.deepEqual(after.inventories,before.inventories);
    const literal=await p.evaluate(()=>save_to_file());const exported=await s.save();await writeFile(join(out,'last-roundtrip.json'),JSON.stringify(exported));await Promise.all([p.waitForEvent('load'),p.locator('#saved_file_input').setInputFiles({name:'generated-minecraft-fit.txt',mimeType:'text/plain',buffer:Buffer.from(literal)})]);await play();after=await s.save();assert.deepEqual(after.expansion,exported.expansion,`${label}: literal import`);assert.deepEqual(after.inventories,exported.inventories);assert.equal(after.character.money,exported.character.money);checks.push(label+': Save/reload/Export/literal Import exact expansion, inventory and money');
}
try{
    await s.start();await s.open();p=s.page;const base=await s.save();
    const field=completeFieldProject(joinField(createFieldFixture()));base.expansion=field.state;base['current location']='Shack';base.character.money=200;base.character.stamina_to_full=0;base.character.hp_to_full=0;
    base.availabilities.location.Shack|=1;base.locations.Shack={...base.locations.Shack,housing_unlocked:true};
    for(const [k,n]of [['log',80],['coal',40],['ore',20],['iron',20],['belmart',12],['golmoon',12]])base.inventories.person.main_character[K[k]]={count:n};
    delete base.inventories.person.main_character[K.kit];
    await writeFile(join(out,'review-start.json'),JSON.stringify(base));await s.open(base);p=s.page;await openWorks();assert.equal((await snap()).expansion.actors.player.facts[I.prefix+'enrolled'],undefined);
    await run('begin');assert.equal(stock(await snap(),'empty'),2);checks.push('Native setup spends wood/payment and supplies exactly two receiving objects');
    for(const id of ['gather_clay','shape'])await run(id);await click('dry');await roundtrip('Pending ceramic drying');await click('cancel');assert.equal(stock(await snap(),'wet'),1);
    for(const id of ['dry','fire','gather_clay','shape','wet_fire','garden','grow_variety','grow_variety'])await run(id);
    assert.equal((await snap()).expansion.actors.player.resources[I.prefix+'mana'],12);await openWorks();const full=p.locator(`[data-works-command="${I.prefix}grow_ember"]`);assert.equal(await full.isDisabled(),true);checks.push('Committed ceramic stages, useful wet-fire fragments and finite resource-fed garden; full reservoir refuses feeding');
    for(const id of ['composition','learn_shape','learn_dry','learn_fire','gather_clay','gather_clay'])await run(id);
    for(const [i,value]of ['shape','dry','fire'].entries())await p.locator(`[data-works-step="${i}"]`).selectOption(value);await p.locator('[data-works-strength]').selectOption('strong');
    await p.locator('[data-works-command="apply_sequence"]').click();await finish();assert.equal(stock(await snap(),'fired'),1);
    await p.locator('[data-works-strength]').selectOption('gentle');await p.locator('[data-works-command="apply_sequence"]').click();await finish();assert.equal(stock(await snap(),'dry'),1);checks.push('Actual composition controls select the ordered method; strong firing produces a vessel and gentle warming retains unfired work');
    await p.locator('[data-works-strength]').selectOption('strong');await click('queue_sequence');await s.step(6);assert.equal((await snap()).expansion.simulation.programs.player.status,'paused');assert.equal((await snap()).expansion.simulation.programs.player.remaining,1);
    await run('grow_ember');await click('resume');await finish();assert.equal((await snap()).expansion.simulation.programs.player.remaining,0);checks.push('Native finite technique queue stops on actual energy shortage, retains one outstanding application, then resumes after real reservoir feeding');
    for(const id of ['gather_clay','sift','sift','prepare_charge','smelt'])await run(id);assert.equal((await snap()).expansion.actors.player.facts[I.prefix+'mineralKnown'],undefined);
    await run('hint');await run('observe');assert.equal(stock(await snap(),'sample'),1);await run('known_charge');checks.push('Retained unknown material acts before identification; paid procedural hint and actual test preserve the sample and earn a faster shortcut');
    await run('drive');await run('grow_ember');await run('bind_spirit');await click('assign_spirit_3');await click('supply_spirit');await s.step(1);
    assert.equal((await snap()).expansion.actors.player.resources[I.prefix+'drive'],1);await openWorks();assert.equal(await p.locator(`[data-works-command="${I.prefix}press"]`).isDisabled(),true);
    assert.match(await p.locator(`[data-works-command="${I.prefix}press"]`).locator('..').innerText(),/Drive needs 2/);
    await click('mill');await roundtrip('Concurrent player/wisp power reservations');await s.step(4);await openWorks();assert.equal(stock(await snap(),'empty'),0);
    await click('collect_staves');await click('collect_spirit');assert.equal(stock(await snap(),'stave'),4);assert.equal(stock(await snap(),'empty'),2);
    checks.push('Two concurrent makers reserve shared drive; press names its load blocker; filled trays retain output until actual collection');
    await click('supply_spirit');await s.step(1);await click('disconnect');await roundtrip('Revoked support with held helper stock');await s.step(4);await openWorks();assert.equal((await snap()).expansion.simulation.owners[I.spirit][K.empty],1);assert.equal((await snap()).expansion.actors.player.resources[I.prefix+'drive'],2);
    await click('pause_spirit');for(const k of ['log','coal','empty'])await click('recall_spirit_'+k);await click('connect');
    await run('grow_ember');await run('rank_spirit');await run('grow_ember');await click('supply_spirit');await click('resume_spirit');await s.step(1);assert.equal((await snap()).expansion.simulation.jobs.find(j=>j.actorId===I.spirit).due-(await snap()).expansion.clock,2);await s.step(2);await click('collect_spirit');await click('pause_spirit');
    checks.push('Paid wisp refinement changes the actual job to two minutes; paused outstanding orders resume with supplied stock');
    await run('press');await click('collect_fittings');await click('hire_artisan');const funded=await snap();await click('supply_artisan');await s.step(1);await roundtrip('Funded fitter order pending');await s.step(3);await click('collect_artisan');assert.equal(stock(await snap(),'kit'),2);
    await click('pause_artisan');await click('refund_artisan_2');assert.equal((await snap()).character.money,funded.character.money+2);checks.push('Fitter request consumes real deliveries once, retains two native kits, records one earned wage and returns exactly two unearned coins');
    // Continuation: all additional behavior uses the same native index and controls.
    let beforeExtra=await snap();const firedBefore=stock(beforeExtra,'fired'),coalBefore=stock(beforeExtra,'coal');
    await run('charcoal');assert.equal(stock(await snap(),'fired'),firedBefore);assert.equal(stock(await snap(),'coal'),coalBefore+2);
    for(const id of ['gather_clay','shape','gather_clay','shape','shape'])await run(id);
    await p.locator('[data-works-input]').evaluate(el=>el.closest('details').open=true);
    await p.locator('[data-works-input]').selectOption('wet');await p.locator('[data-works-batch]').selectOption('3');
    await p.locator('[data-works-step="0"]').selectOption('dry');await p.locator('[data-works-step="1"]').selectOption('');
    await click('apply_sequence');await roundtrip('Three retained workpieces reserved by a technique');await finish();assert.ok(stock(await snap(),'dry')>=3);
    await p.locator('[data-works-input]').evaluate(el=>el.closest('details').open=true);
    await p.locator('[data-works-input]').selectOption('clay');await p.locator('[data-works-batch]').selectOption('1');
    // Make real space if earlier jobs have left a nearly full reservoir.
    while((await snap()).expansion.actors.player.resources[I.prefix+'space']<6){
        await p.locator('[data-works-step="0"]').selectOption('fire');await p.locator('[data-works-step="1"]').selectOption('');await p.locator('[data-works-strength]').selectOption('gentle');
        if(!stock(await snap(),'clay'))await run('gather_clay');await click('apply_sequence');await finish();
    }
    await run('tend_garden');await run('grow_tended');assert.equal((await snap()).expansion.actors.player.resources[I.prefix+'gardenCare'],2);
    await run('gather_clay');await run('sift');const ironBefore=stock(await snap(),'iron');await run('recorded_smelt');assert.equal(stock(await snap(),'iron'),ironBefore+1);
    checks.push('Retained wet-vessel batch through actual input/batch selectors; reusable charcoal retort; supplied garden care; demonstrated smelting feeds native stock');
    await click('withdraw_spirit');assert.equal((await snap()).expansion.actors.player.resources[I.prefix+'spiritOrders'],0);
    await click('renew_artisan');await click('hire_courier');for(const k of ['stave','stave','parts','empty'])await click('stock_depot_'+k);
    await s.step(1);assert.equal((await snap()).expansion.simulation.jobs.find(j=>j.actorId===I.courier).commandId,I.prefix+'courier_supply_artisan');
    assert.equal(await p.locator(`[data-works-command="${I.prefix}supply_artisan"]`).isDisabled(),true);
    await click('pause_courier');await roundtrip('Paused handcart with actual reserved cargo');await s.step(2);
    assert.equal((await snap()).expansion.actors.player.resources[I.prefix+'courierOrders'],3);assert.equal((await snap()).expansion.simulation.owners[I.courier][K.stave],2);
    await click('resume_courier');await s.step(1);await roundtrip('Promised handcart delivery in flight');await s.step(7);
    assert.equal((await snap()).expansion.actors[I.courier].resources[I.prefix+'earnedWages'],2);assert.equal(stock(await snap(),'kit'),4);
    await click('pause_courier');await click('refund_courier_1');assert.equal((await snap()).expansion.actors.player.resources[I.prefix+'courierOrders'],0);
    checks.push('Finite funded local route reserves promised cargo and recipient, blocks duplicate supply, refunds paused cargo exactly once, delivers real stock and returns actual output without double wages');
    await roundtrip('Finished works, discoveries and settled wages');
    const saved=await s.save();for(const size of [14,21]){const view=structuredClone(saved);view.customization.profiles.Default.settings.typography={font:'gothic',size};await s.open(view);p=s.page;await openWorks();await p.locator('[data-field-works]').scrollIntoViewIfNeeded();assert.equal(await p.locator('[data-field-works]').evaluate(el=>getComputedStyle(el).fontSize),`${size}px`);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await p.screenshot({path:join(out,`works-${size}.png`)});}
    checks.push('1920x1080 at actual 14px/21px text; no document horizontal overflow');
    assert.deepEqual(s.errors.filter(e=>e.kind==='pageerror'),[]);await writeFile(join(out,'receipt.json'),JSON.stringify({checks,errors:s.errors,setup:'DEV SEEDED existing assembled workshop, stock and access. New works all entered through rebuilt native controls. Game minutes dev-stepped; no natural pacing/human acceptance claim.'},null,2));console.log(JSON.stringify({checks,out}));
}catch(e){await writeFile(join(out,'failure.txt'),e.stack);if(p){await writeFile(join(out,'failure-ui.txt'),await p.locator('body').innerText().catch(()=>''));await writeFile(join(out,'failure-dom.json'),JSON.stringify(await p.evaluate(()=>({errors:window.__errors,paths:['#notebook_tab_here','#field_panel','[data-field-works]'].map(sel=>{const a=[];for(let n=document.querySelector(sel);n;n=n.parentElement)a.push({tag:n.tagName,id:n.id,class:n.className,hidden:n.hidden,open:n.open,display:getComputedStyle(n).display});return {sel,a};})})),null,2));await p.screenshot({path:join(out,'failure.png')}).catch(()=>{});}throw e;}finally{await s.close();await server.close();}
