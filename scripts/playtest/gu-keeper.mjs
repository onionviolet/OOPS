// Earned menu actions on a private rebuilt origin. Never reads a player profile.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile, writeFile, mkdir, stat} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {encodeSaveFile} from '../../src/save_files.js';
import {keeperDiets} from '../../src/world_packs/book_gu_keeper.js';
import {starvation} from '../../src/living_upkeep.js';
const {launchChrome} = createRequire(import.meta.url)('../ui_helpers.cjs');
const build=path.resolve(process.argv[2]||'/private/tmp/claude-501/gu-keeper-build');
const out=path.resolve(process.argv[3]||'/private/tmp/claude-501/gu-keeper-evidence');
await mkdir(out,{recursive:true});
const coordinationOnly=process.argv[4] === '--coordination-only';
const P=coordinationOnly?'book.ri.coordination':'book.ri.keeper',id=n=>`${P}.${n}`,key=n=>JSON.stringify({id:id(n)});
const server=createServer(async(req,res)=>{try{
    let file=path.resolve(build,'.'+new URL(req.url,'http://local').pathname);if(!file.startsWith(build+'/')){if(file!==build)throw Error('path');}
    if((await stat(file)).isDirectory())file=path.join(file,'index.html');
    res.setHeader('Content-Type',({'.js':'text/javascript','.html':'text/html','.css':'text/css','.json':'application/json','.png':'image/png','.woff2':'font/woff2'})[path.extname(file)]||'application/octet-stream');res.end(await readFile(file));
}catch{res.writeHead(404).end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await launchChrome(),context=await browser.newContext({viewport:{width:1920,height:1080},acceptDownloads:true});
const p=await context.newPage();p.setDefaultTimeout(20000);
const result={route:'fresh Village → original RI Gu keeper beginning → free Gu → refused purchases → stipend week → hold more Gu than fed → starved out on schedule → recover → save/reload/import',errors:[],checks:[],matrix:[]};
p.on('pageerror',e=>result.errors.push(e.message));
const play=async()=>{await p.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:60000});await p.evaluate(()=>window.simulationTestHooks.pause());await p.locator('#loading_screen_play_button').click({timeout:60000});await p.waitForFunction(()=>document.documentElement.dataset.startScreen==='closed');};
const raisedMoonbladeOnly = process.argv[4] === '--raised-moonblade-only';
const open=()=> {
    if (!raisedMoonbladeOnly) return p.locator('#workspace_navigation select').first().selectOption('beginning');
    // Use the real change handler without Playwright's scroll and hit-testing waits.
    return p.evaluate(() => {
        if (document.querySelector('#structured_pack_panel [data-structured-action]')) return;
        const select = document.querySelector('#workspace_navigation select');
        if (!select) throw Error('The Beginning panel selector is missing.');
        select.value = 'beginning';
        select.dispatchEvent(new Event('change', {bubbles: true}));
    });
};
const save=()=>p.evaluate(()=>{window.saveProgress();return JSON.parse(localStorage.getItem('save data'));});
// Loading materializes zero XP for NPC skills; absence and explicit zero agree.
// Preserve the player ledger and every nonzero NPC entry in exact comparisons.
const skillDigest=levels=>({...levels,person:Object.fromEntries(Object.entries(levels.person).map(([id,ledger])=>[id,id==='main_character'?ledger:{...ledger,skill_xp:Object.fromEntries(Object.entries(ledger.skill_xp).filter(([,xp])=>xp!==0))}]))});
const digest=s=>({record:s.content_packs?.structured,actors:s.expansion.actors,simulation:s.expansion.simulation,clock:s.expansion.clock,
    keeperFacts:s.expansion.worlds[id('world')]?.facts,location:s['current location'],inventory:s.inventories,skills:skillDigest(s.levels)});
const load=async literal=>{await Promise.all([p.waitForEvent('load'),p.evaluate(text=>window.load_progress(text),literal)]);await play();await open();};
const roundTrip=async name=>{const before=await save(),expected=digest(before);await writeFile(path.join(out,name+'-before.json'),JSON.stringify(before,null,2));await p.reload();await play();assert.deepEqual(digest(await save()),expected,name+' reload');
    const literal=await p.evaluate(()=>window.save_to_file());assert.equal(typeof literal,'string');await load(literal);assert.deepEqual(digest(await save()),expected,name+' literal Import');result.checks.push(name+': Save/reload/Export/literal Import equal');};
const step=n=>p.evaluate(n=>window.advanceTicks(n),n);
const act=async n=>{await p.locator(`[data-structured-action="${id(n)}"]`).click();await p.waitForFunction(command=>{try{return window.simulationTestHooks.snapshot().expansion.simulation.jobs.some(j=>j.commandId===command);}catch{return false;}},id(n));};
const instant=async n=>{const before=(await save()).expansion.actors.player.completed[id(n)]||0;await p.locator(`[data-structured-action="${id(n)}"]`).click({noWaitAfter:true});await p.waitForFunction(({command,before})=>{try{return window.simulationTestHooks.snapshot().expansion.actors.player.completed[command]>before;}catch{return false;}},{command:id(n),before});};
const sim=s=>s.expansion.simulation;
const gu=(s,n)=>sim(s).people[id(n)];
const stones=s=>s.inventories.person.main_character[key('stone')]?.count||0;
const DAY=1440;
const shot=async name=>{
    if (raisedMoonbladeOnly) await p.locator('.gu-house').evaluate(node => node.scrollIntoView());
    else await p.locator('.gu-house').scrollIntoViewIfNeeded();
    await p.screenshot({path:path.join(out,name+'.png')});
};
const why=async n=>{assert.equal(await p.locator(`[data-structured-action="${id(n)}"]`).isDisabled(),true);return (await p.locator(`[data-structured-row="${id(n)}"]`).innerText()).split('\n').filter(l=>/need/i.test(l)).join(' ');};
const act0=act,instant0=instant;
const toClock=async t=>{for(;;){const c=(await save()).expansion.clock;if(t<=c)return;await step(Math.min(t-c,1440));}};
const FOOD={moon:['petals',4],worm:['lees',1],jade:['jade',1]};
const death=(s,n,every)=>{const init=s.content_packs.structured.initializedAt,next=init+(Math.floor((s.expansion.clock-init)/(every*DAY))+1)*every*DAY,[f,m]=FOOD[n],stock=sim(s).owners[id(n)]?.[key(f)]||0;return next+(Math.floor(stock/m)+gu(s,n).vitals.health-1)*every*DAY;};
const act1=async n=>{await open();return act0(n);},instant1=async n=>{await open();return instant0(n);};
async function runCoordination() {
    const reserves=s=>['player',id('ouyang'),id('mo')].map(actor=>sim(s).energies[actor][id('primeval')].reserve);
    assert.deepEqual(reserves(await save()),[13,12,11]);
    await instant1('cue');
    await roundTrip('formation-cue');
    await instant1('merge');
    assert.deepEqual(reserves(await save()),[12,12,11]);
    assert.equal(await p.locator(`[data-structured-action='${id('lift')}']`).isDisabled(),true);
    await instant1('recover_0');await instant1('recover_2');
    await instant1('cue');await instant1('merge');
    assert.deepEqual(reserves(await save()),[0,0,1]);
    await roundTrip('formation-merged');
    await instant1('lift');
    assert.equal((await save())['current location'],id('yard'));
    assert.match(await p.locator('#structured_pack_panel').innerText(),/Practice yard/);
    result.checks.push('The short operator blocked the shared debit. The funded team merged and lifted the gate.');
}
const rankTrialOnly=process.argv[4] === '--rank-trial-only';
const fireflyFarmOnly=process.argv[4] === '--firefly-farm-only';
const fireflyCareOnly=process.argv[4] === '--firefly-care-only';
const pastMoonbladeOnly=process.argv[4] === '--past-moonblade-only';
const wildWormOnly=process.argv[4] === '--wild-worm-only';
const wormEssenceOnly=process.argv[4] === '--worm-essence-only';
const fourFlavorsOnly=process.argv[4] === '--four-flavors-only';
const redSteelOnly=process.argv[4] === '--four-flavors-red-steel-only';
const sevenOnly=process.argv[4] === '--seven-fragrances-only';
const nineOnly=process.argv[4] === '--nine-eyes-only';
const nineLayoutOnly=process.argv[4] === '--nine-eyes-layout-only';
async function runFourFlavors(verify=true) {
    const extension=name=>p.locator(`[data-structured-extension='${id(name)}']`).click();
    const wild=name=>instant1(`wild_worm.${name}`);
    const fuse=p.locator(`[data-structured-action='${id('four_flavors.fuse_four')}']`);
    await extension('wild_worm');await extension('worm_essence');await extension('four_flavors');
    for(let index=0;index<7;index++){await act1('chores');await step(120);}
    await instant1('take_worm');
    await wild('find');await wild('approach');await wild('follow');
    await wild('buy_wine');await wild('lure');await wild('capture');await wild('refine');
    await wild('buy_wine');await instant1('worm_essence.feed');
    for(const flavor of ['sour','sweet','bitter'])await instant1(`four_flavors.buy_${flavor}`);
    assert.equal(await fuse.isDisabled(),true);
    await instant1('four_flavors.buy_spicy');
    if(verify)await roundTrip('four-flavors-ready');
    await instant1('four_flavors.fuse_four');
    const result=await save();
    assert.equal(gu(result,'worm').life,'dead');
    assert.equal(result.inventories.person.main_character[key('worm_gu')]?.count??0,0);
    assert.match(await p.locator('[data-gu="four-flavors-worm"]').innerText(),/rank 2.*in your care/);
    assert.match(await p.locator('[data-gu="wild-worm"]').innerText(),/used in the Four Flavors fusion/);
    if(verify)await roundTrip('four-flavors-fused');
    assert.equal(await fuse.isDisabled(),true);
}
async function runFourFlavorsRedSteel() {
    await runFourFlavors(false);
    await instant1('take_moon');
    const extension=name=>p.locator(`[data-structured-extension='${id(name)}']`).click();
    const action=name=>instant1(`red_steel_refinement.${name}`);
    await extension('rank_trial');
    await instant1('rank_trial.borrow');
    await extension('red_steel_refinement');
    for(let index=0;index<3;index++){await act1('chores');await step(120);}
    await action('buy_middle');
    const convert=p.locator(`[data-structured-action='${id('red_steel_refinement.concentrate_red')}']`);
    assert.equal(await convert.isDisabled(),true);
    await instant1('wild_worm.buy_wine');
    await action('feed_four');
    const raw=s=>sim(s).energies.player[id('primeval')].reserve;
    const before=raw(await save());
    await action('concentrate_red');
    const reserveLine=p.locator('[data-gu="worm-red-steel"]');
    assert.equal(raw(await save()),before);
    assert.match(await reserveLine.innerText(),/Rank-two red steel.*2 upper-stage measures/);
    await roundTrip('four-flavors-red-steel-held');
    await action('cast_upper');
    assert.equal(raw(await save()),before);
    assert.match(await reserveLine.innerText(),/0 upper-stage measures.*cut 4 straw bundles/);
    await roundTrip('four-flavors-red-steel-spent');
    result.checks.push('The Four Flavors reserve funded Moonglow without spending aperture essence.');
}
async function runSevenFragrances(useThunderclap=true) {
    await runFourFlavorsRedSteel();
    const extension=name=>p.locator(`[data-structured-extension='${id(name)}']`).click();
    const action=name=>instant1(`seven_fragrances.${name}`);
    const button=name=>p.locator(`[data-structured-action='${id(`seven_fragrances.${name}`)}']`);
    const wolf=name=>instant1(`hosted_wolf.${name}`);
    const line=p.locator('[data-gu="seven-fragrances-worm"]');
    const parent=p.locator('[data-gu="four-flavors-worm"]');
    const read=s=>JSON.parse(s.expansion.worlds[id('world')].facts[id('seven_fragrances.work')]);
    await extension('hosted_wolf');
    await extension('seven_fragrances');
    while(stones(await save()) < 4){await act1('chores');await step(120);}
    await action('buy_spices');
    await action('prepare_seven');
    assert.equal(await parent.count(),0);
    assert.equal(await button('finish_seven').isDisabled(),true);
    await roundTrip('seven-fragrances-settling');
    const pending=await p.evaluate(()=>window.save_to_file());
    await action('cancel_seven');
    assert.match(await line.innerText(),/both Worms survived/);
    assert.match(await parent.innerText(),/rank 2/);
    assert.equal(await button('prepare_seven').isDisabled(),true);
    await roundTrip('seven-fragrances-stopped');
    await load(pending);
    await step(20);
    await action('finish_seven');
    const [first, second, product]=read(await save()).world.gu;
    assert.ok(first.provenance.ingredients.first);
    assert.equal(first.alive,false);
    assert.equal(second.alive,false);
    assert.deepEqual(product.provenance.ingredients,{first:first.id,second:second.id});
    if(!useThunderclap)return product.id;
    await action('buy_silver');
    assert.equal(await button('concentrate_silver').isDisabled(),true);
    await instant1('wild_worm.buy_wine');
    await action('feed_seven');
    await action('concentrate_silver');
    assert.match(await line.innerText(),/rank 3.*2 upper-stage white-silver measures/);
    await roundTrip('seven-fragrances-concentrated');
    await wolf('enter');await wolf('find');await wolf('inspect');await wolf('shelter');await wolf('care');
    await step(20);
    await wolf('extract_sound');await wolf('release');await wolf('refine');
    const raw=s=>sim(s).energies.player[id('primeval')].reserve;
    const before=raw(await save());
    await action('cast_seven');
    assert.equal(raw(await save()),before);
    assert.match(await line.innerText(),/0 upper-stage.*Thunderclap struck with force 2/);
    assert.match(await p.locator('[data-gu="hosted-wolf"]').innerText(),/Thunderclap struck the target post/);
    await roundTrip('seven-fragrances-thunderclap');
    result.checks.push('The earned Four Flavors specimen became a rank-three Gu whose upper white silver powered the wolf’s captured Thunderclap.');
}
async function runNineEyes() {
    const parent=await runSevenFragrances(false);
    const action=name=>instant1(`nine_eyes.${name}`);
    const button=name=>p.locator(`[data-structured-action='${id(`nine_eyes.${name}`)}']`);
    const line=p.locator('[data-gu="nine-eyes-worm"]');
    const read=s=>JSON.parse(s.expansion.worlds[id('world')].facts[id('nine_eyes.work')]);
    const seven=p.locator('[data-gu="seven-fragrances-worm"]');
    await p.locator(`[data-structured-extension='${id('nine_eyes')}']`).click();
    while(stones(await save()) < 11){await act1('chores');await step(120);}
    await action('buy_second');
    await action('buy_ridge');await action('buy_marsh');
    assert.equal(await button('prepare_nine').isDisabled(),true);
    await action('buy_forest');await action('prepare_nine');
    assert.match(await seven.innerText(),/bound in the Nine Eyes fusion/);
    assert.equal(await button('settle_nine').isDisabled(),true);
    await roundTrip('nine-eyes-settling');
    await step(30);await open();
    assert.match(await line.innerText(),/gone cold/);
    await action('settle_nine');
    assert.match(await line.innerText(),/fusion failed.*both Worms survived.*fresh eyes needed/);
    assert.match(await seven.innerText(),/rank 3/);
    assert.equal(await button('prepare_nine').isDisabled(),true);
    assert.ok(read(await save()).world.gu.every(worm=>worm.alive));
    await roundTrip('nine-eyes-failed');
    for(const lot of ['ridge','marsh','forest'])await action(`buy_${lot}`);
    await action('prepare_nine');await step(15);await action('settle_nine');
    const {gu:worms,attempts}=read(await save()).world;
    assert.deepEqual(attempts.map(job=>job.status),['failed','complete']);
    assert.equal(attempts[0].cause,'control');
    assert.equal(worms[0].id,parent);
    assert.equal(worms[0].fate,'consumed');
    assert.equal(worms[1].fate,'consumed');
    assert.deepEqual(worms[2].provenance.ingredients,{first:parent,second:worms[1].id});
    await action('buy_gold');
    assert.equal(await button('concentrate_gold').isDisabled(),true);
    await action('test_initial');
    assert.match(await line.innerText(),/Charging Crash covered 100 paces/);
    assert.equal((await save())['current location'],id('annex'));
    await action('buy_gold');await instant1('wild_worm.buy_wine');
    await action('feed_nine');await action('concentrate_gold');
    assert.match(await line.innerText(),/rank 4.*2 middle-stage yellow-gold measures/);
    await roundTrip('nine-eyes-concentrated');
    const raw=s=>sim(s).energies.player[id('primeval')].reserve;
    const before=raw(await save());
    await action('cross_cut');
    assert.equal((await save())['current location'],id('nine_eyes.far_bank'));
    assert.equal(raw(await save()),before);
    assert.match(await line.innerText(),/0 middle-stage.*Charging Crash covered 200 paces/);
    const purse=stones(await save());
    await action('collect');
    assert.equal(stones(await save()),purse+3);
    assert.equal(await button('collect').isDisabled(),true);
    await roundTrip('nine-eyes-far-bank');
    await action('return');
    assert.equal((await save())['current location'],id('annex'));
    assert.equal(await button('cross_cut').isDisabled(),true);
    result.checks.push('After the nine eyes cooled, fresh lots recovered the same two Worms into Nine Eyes. Improved gold moved the player and collected a real reward.');
}
async function runWormEssence() {
    await instant1('take_moon');
    const extension=name=>p.locator(`[data-structured-extension='${id(name)}']`).click();
    const wild=name=>instant1(`wild_worm.${name}`);
    const essence=name=>instant1(`worm_essence.${name}`);
    const convert=p.locator(`[data-structured-action='${id('worm_essence.convert')}']`);
    const view=p.locator('[data-gu="worm-essence"]');
    await extension('wild_worm');
    await extension('worm_essence');
    await wild('find');await wild('approach');await wild('follow');
    await wild('buy_wine');await wild('lure');await wild('capture');
    await wild('refine');
    assert.equal(await convert.isDisabled(),true);
    await wild('buy_wine');await essence('feed');
    assert.match(await view.innerText(),/Worm fed/);
    const raw=s=>sim(s).energies.player[id('primeval')].reserve;
    const before=raw(await save());
    await essence('convert');
    assert.equal(raw(await save()),before-2);
    assert.match(await view.innerText(),/Rank-one green-copper essence.*1 middle-stage measure/);
    await roundTrip('worm-middle-essence-held');
    await wild('release');
    assert.equal(await convert.isDisabled(),true);
    const after=raw(await save());
    await essence('cast_middle');
    assert.equal(raw(await save()),after);
    assert.match(await view.innerText(),/0 middle-stage measures.*cut 8 sheets/);
    await roundTrip('worm-middle-essence-spent');
    result.checks.push('A fed and refined wild Worm made rank-one middle-stage essence. The stronger cast used only that reserve.');
}
const immortalRefinementOnly=process.argv[4] === '--immortal-refinement-only';
const immortalAdvancementOnly=process.argv[4] === '--immortal-advancement-only';
const immortalReclamationOnly=process.argv[4] === '--immortal-reclamation-only';
const stargateOnly=process.argv[4] === '--stargate-only';
const fixedTravelOnly=process.argv[4] === '--fixed-immortal-travel-only';
const fixedForgeOnly=process.argv[4] === '--fixed-forge-only';
const guRestorationOnly=process.argv[4] === '--gu-restoration-only';
const transitHouseOnly=process.argv[4] === '--transit-house-only';
const vitalityGardenOnly=process.argv[4] === '--vitality-garden-only';
const attitudeOnly=process.argv[4] === '--attitude-gu-only';
const antNestOnly=process.argv[4] === '--ant-nest-only';
const beamProcedureOnly=process.argv[4] === '--beam-procedure-only';
const fightingSpiritOnly=process.argv[4] === '--fighting-spirit-only';
const screenResearchOnly=process.argv[4] === '--screen-research-only';
const moonFusionOnly=process.argv[4] === '--moon-fusion-only';
const moonFusionTimeOnly=process.argv[4] === '--moon-fusion-time-only';
const moonFusionVitalOnly=process.argv[4] === '--moon-fusion-vital-only';
const stargateSkyOnly=process.argv[4] === '--stargate-sky-only';
const moonlightTrialOnly=process.argv[4] === '--moonlight-trial-only';
const moonlightStockOnly=process.argv[4] === '--moonlight-stock-only';
const moonlightProspectOnly=process.argv[4] === '--moonlight-prospect-only';
const moveTrialOnly=process.argv[4] === '--move-trial-only';
const fireTrialOnly=process.argv[4] === '--fire-trial-only';
const rainbowOnly=process.argv[4] === '--rainbow-light-only';
const thunderPotatoOnly=process.argv[4] === '--thunder-potato-only';
const hostedWolfOnly=process.argv[4] === '--hosted-wolf-only';
const wolfRidgeOnly=process.argv[4] === '--wolf-ridge-only';
const wolfRidgeLayoutOnly=process.argv[4] === '--wolf-ridge-layout-only';
const wolfScoutingOnly=process.argv[4] === '--wolf-scouting-only';
const wolfScoutingLayoutOnly=process.argv[4] === '--wolf-scouting-layout-only';
const crownFlightOnly=process.argv[4] === '--crown-flight-only';
const crownFlightLayoutOnly=process.argv[4] === '--crown-flight-layout-only';
const smokePassageOnly=process.argv[4] === '--smoke-passage-only';
const smokePassageLayoutOnly=process.argv[4] === '--smoke-passage-layout-only';
const stealthFusionOnly=process.argv[4] === '--stealth-fusion-only';
const stealthFusionLayoutOnly=process.argv[4] === '--stealth-fusion-layout-only';
const scaleArmorOnly=process.argv[4] === '--scale-armor-only';
const scaleArmorLayoutOnly=process.argv[4] === '--scale-armor-layout-only';
const insightMothOnly=process.argv[4] === '--insight-moth-only';
const futureMothOnly=process.argv[4] === '--future-moth-only';
const futureMothLayoutOnly=process.argv[4] === '--future-moth-layout-only';
async function runFutureMoth() {
    const act=name=>instant1(`insight_moth.${name}`);
    const time=name=>instant1(`future_moth.${name}`);
    const button=(pack,name)=>p.locator(`[data-structured-action="${id(`${pack}.${name}`)}"]`);
    const admit=pack=>p.locator(`[data-structured-extension="${id(pack)}"]`).click();
    const moth=p.locator('[data-gu="insight-moth"]');
    const future=p.locator('[data-gu="future-moth"]');
    const petals=async()=> (await save()).inventories.person.main_character[key('petals')]?.count??0;
    const encounter=async()=>JSON.parse((await save()).expansion.worlds[id('world')].facts[id('insight_moth.encounter')]);
    await admit('insight_moth');
    await act('meet');await act('leave');await act('feed');await act('steward_asks');
    assert.match(await moth.innerText(),/fed.*stayed quiet for the steward/);
    const before=await encounter();
    await admit('future_moth');
    await time('pledge');
    assert.equal(await petals(),4);
    await roundTrip('future-moth-planned');
    const planned=await p.evaluate(()=>window.save_to_file());
    await time('reach');
    assert.match(await future.innerText(),/future moth glowed for the steward/);
    assert.match(await moth.innerText(),/fed.*stayed quiet for the steward/);
    assert.deepEqual((await encounter()).lifecycle,before.lifecycle);
    assert.deepEqual((await encounter()).meal,before.meal);
    assert.equal(await button('future_moth','reach').isDisabled(),true);
    await shot('future-moth-glowing');
    await roundTrip('future-moth-glowing');
    const glowing=await p.evaluate(()=>window.save_to_file());
    await step(10);await open();
    assert.equal(await button('insight_moth','study').isDisabled(),true);
    assert.match(await future.innerText(),/borrowed glow ended/);
    await load(glowing);
    await act('study');await time('cancel');
    assert.match(await future.innerText(),/lesson called off.*borrowed glow ended/);
    assert.equal(await petals(),4);
    await act1('insight_moth.gather');await step(20);await open();
    assert.equal(await petals(),8);
    await roundTrip('future-moth-clue-after-cancellation');
    await load(glowing);
    await act('recall');await act('leave');
    assert.match(await future.innerText(),/moth left before the lesson/);
    assert.equal(await button('insight_moth','study').isDisabled(),true);
    await load(planned);
    await step(20);await open();
    await time('teach');await act('steward_asks');
    const after=await encounter();
    assert.equal(after.id,before.id);
    assert.match(await moth.innerText(),/glowed for the steward/);
    const steward=id('steward');
    assert.equal(after.lifecycle.individuals[after.id].experience[steward].bond,30);
    assert.equal(after.meal.spent,true);
    await roundTrip('future-moth-present-agreement');
    result.checks.push('Borrowed and present willingness differed for the same moth and steward. Cancelling ended the light but retained the earned grove clue.');
}
async function runFutureMothLayout(fixture) {
    await runKeeperLayout(fixture, 'future-moth', 'insight_moth.study', /future moth glowed for the steward/);
}
async function runWitnessedMoth() {
    const act = name => instant1(`insight_moth.${name}`);
    const future = name => instant1(`future_moth.${name}`);
    const past = name => instant1(`witnessed_moth.${name}`);
    const admit = name => p.locator(`[data-structured-extension='${id(name)}']`).click();
    const button = (pack, name) => p.locator(`[data-structured-action='${id(`${pack}.${name}`)}']`);
    const line = p.locator('[data-gu="witnessed-moth"]');
    const plan = p.locator('[data-gu="future-moth"]');
    const encounter = async () => JSON.parse((await save()).expansion.worlds[id('world')].facts[id('insight_moth.encounter')]);
    const petals = async () => (await save()).inventories.person.main_character[key('petals')]?.count ?? 0;
    await admit('insight_moth'); await act('meet'); await admit('witnessed_moth');
    assert.equal(await button('witnessed_moth', 'mark_aid').isDisabled(), true);
    await act('feed'); await act('ask'); await past('mark_aid');
    const marked = await encounter();
    assert.equal(marked.id, marked.witnessed.specimen);
    assert.equal(marked.litAt, marked.witnessed.at);
    assert.equal(await button('witnessed_moth', 'open_aid').isDisabled(), true);
    await act('leave'); await step(30); await open();
    assert.equal(await button('insight_moth', 'study').isDisabled(), true);
    await admit('future_moth'); await future('pledge'); await future('reach');
    assert.match(await plan.innerText(), /future moth glowed for the steward/);
    assert.equal(await button('insight_moth', 'study').isEnabled(), true);
    await future('cancel');
    assert.equal(await button('insight_moth', 'study').isDisabled(), true);
    assert.match(await plan.innerText(), /lesson called off.*borrowed glow ended/);
    const current = await encounter();
    const paid = await petals();
    await past('open_aid');
    assert.equal(paid - await petals(), 2);
    await past('steward_witnessed');
    assert.match(await line.innerText(), /earlier moth stayed quiet for the steward/);
    assert.equal(await button('insight_moth', 'study').isDisabled(), true);
    await roundTrip('witnessed-moth-refusal');
    await past('ask_witnessed');
    assert.equal(await button('witnessed_moth', 'ask_witnessed').isDisabled(), true);
    assert.match(await line.innerText(), /earlier moth glowed for you/);
    const lit = await encounter();
    assert.deepEqual(lit.lifecycle, current.lifecycle);
    assert.deepEqual(lit.meal, current.meal);
    await roundTrip('witnessed-moth-glow');
    const glow = await p.evaluate(() => window.save_to_file());
    await step(10); await open();
    assert.match(await line.innerText(), /earlier glow ended/);
    assert.equal(await button('insight_moth', 'study').isDisabled(), true);
    await load(glow); await act('study');
    await act1('insight_moth.gather'); await step(20); await open();
    assert.equal(await petals(), paid + 2);
    await roundTrip('witnessed-moth-grove');
    result.checks.push('Calling off a real lesson ended future light. Earlier aid remembered its visitor, left current care unchanged, expired, and could teach the grove route.');
}
async function runKeeperLayout(fixture, name, command, expected) {
    await load(encodeSaveFile(await readFile(fixture,'utf8')));
    const line=p.locator(`[data-gu="${name}"]`);
    const action=p.locator(`[data-structured-action="${id(command)}"]`);
    assert.match(await line.innerText(),expected);
    await p.setViewportSize({width:1536,height:864});
    for(const size of [14,21]) {
        await p.locator('#workspace_navigation select').first().selectOption('customization');
        const input=p.getByRole('spinbutton',{name:'Font size'});
        await input.fill(String(size));await input.dispatchEvent('change');
        await p.getByRole('button',{name:'Apply and save',exact:true}).first().click();
        await open();await line.scrollIntoViewIfNeeded();
        assert.equal(await line.evaluate(node=>getComputedStyle(node).fontSize),`${size}px`);
        assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
        assert.equal(await action.isEnabled(),true);
        if(name === 'layered-defense') await p.screenshot({path:path.join(out,`${name}-outcome-1536-${size}.png`)});
        await action.scrollIntoViewIfNeeded();
        await p.screenshot({path:path.join(out,`${name}-1536-${size}.png`)});
        result.matrix.push({width:1536,height:864,font:size,enabled:command});
    }
}
async function runInsightMoth() {
    const act=name=>instant1(`insight_moth.${name}`);
    const moth=p.locator('[data-gu="insight-moth"]');
    const gather=p.locator(`[data-structured-action="${id('insight_moth.gather')}"]`);
    const study=p.locator(`[data-structured-action="${id('insight_moth.study')}"]`);
    const petals=async()=> (await save()).inventories.person.main_character[key('petals')]?.count??0;
    await p.locator(`[data-structured-extension="${id('insight_moth')}"]`).click();
    await act('meet');await act('leave');await act('feed');await act('steward_asks');
    assert.match(await moth.innerText(),/steward’s desk.*fed.*stayed quiet for the steward/);
    assert.equal(await petals(),6);
    assert.equal(await study.isDisabled(),true);
    assert.equal(await gather.isDisabled(),true);
    await roundTrip('insight-moth-with-steward');
    await act('ask');
    assert.match(await moth.innerText(),/steward’s desk.*glowing.*glowed for you/);
    await roundTrip('insight-moth-glowing');
    const glowing=await p.evaluate(()=>window.save_to_file());
    await step(30);
    assert.equal(await study.isDisabled(),true);
    await load(glowing);
    await act('study');
    await step(30);
    await act1('insight_moth.gather');
    await roundTrip('insight-moth-grove-walk');
    await step(20);
    assert.equal(await petals(),10);
    assert.equal(await gather.isDisabled(),true);
    await act('recall');
    assert.match(await moth.innerText(),/at your desk/);
    await roundTrip('insight-moth-grove-found');
    result.checks.push('The unrefined moth stayed quiet for its current keeper and chose to light the player’s notes. The learned path supplied real petals after the glow expired.');
}
async function equipBlastLane() {
    const wolf = name => instant1(`hosted_wolf.${name}`);
    const admit = name => p.locator(`[data-structured-extension='${id(name)}']`).click();
    for(let job = 0; job < 6; job++) {
        await act1('chores'); await step(120);
    }
    await instant1('take_jade');
    await admit('hosted_wolf');
    await wolf('buy_silver'); await wolf('buy_silver'); await wolf('enter'); await wolf('find');
    await wolf('inspect'); await wolf('shelter'); await wolf('extract'); await wolf('release'); await wolf('refine');
    await admit('wolf_ridge'); await instant1('wolf_ridge.watch_ridge');
    await admit('stealth_fusion'); await admit('scale_armor');
    await admit('layered_defense'); await open();
}

async function prepareBlastLaneArmor() {
    await instant1('wolf_ridge.fresh_trail'); await instant1('wolf_ridge.hunt_ridge_wolf');
    await instant1('stealth_fusion.trade_fish'); await instant1('scale_armor.buy_laminate');
    await instant1('scale_armor.prepare_armor');
}

async function runDefenseResearch() {
    const research = p.locator('[data-gu="defense-research"]');
    const act = name => instant1(`defense_research.${name}`);
    const button = name => p.locator(`[data-structured-action='${id(`defense_research.${name}`)}']`);
    const hp = s => s.character.hp_to_full ?? 0;
    const dose = s => s.inventories.person.main_character[key('hosted_wolf.silver_dose')]?.count ?? 0;
    const reserve = s => sim(s).energies.player[id('primeval')].reserve;
    await equipBlastLane();
    await p.locator(`[data-structured-extension='${id('defense_research')}']`).click();
    assert.match(await research.innerText(), /trade a wolf eye/);
    assert.match(await research.innerText(), /Water Shield · 2 essence · Blast 4 health · Landing 4 health/);
    assert.equal(await button('cross_5').count(), 0);
    const before = await save();
    await act('cross_1');
    const crossed = await save();
    assert.equal(hp(crossed) - hp(before), 8);
    assert.equal(reserve(before) - reserve(crossed), 2);
    assert.equal(dose(before) - dose(crossed), 1);
    assert.equal(sim(crossed).people.player.location, id('defense_research.far_bank'));
    await act('back');
    await step(5); await open();
    assert.match(await research.innerText(), /Water Shield is still recovering/);
    assert.match(await research.innerText(), /No combination of ready Gu fits/);
    assert.equal(await button('cross_1').count(), 0);
    await prepareBlastLaneArmor();
    assert.match(await research.innerText(), /Finish the Scale Armor/);
    assert.equal(await button('cross_5').count(), 0);
    await roundTrip('defense-research-pending-armor');
    await step(20); await instant1('scale_armor.finish_armor');
    assert.doesNotMatch(await research.innerText(), /trade a wolf eye|Finish the Scale Armor/);
    assert.match(await research.innerText(), /Water Shield \+ Scale Armor · 4 essence · Blast 4 health · Landing 1 health/);
    assert.match(await research.innerText(), /White Jade \+ Scale Armor · 4 essence · Blast 7 health · Landing 1 health/);
    await roundTrip('defense-research-options');
    const ready = await save();
    await act('cross_5');
    const armored = await save();
    assert.equal(hp(armored) - hp(ready), 5);
    assert.equal(reserve(ready) - reserve(armored), 4);
    assert.equal(dose(ready) - dose(armored), 1);
    assert.equal(sim(armored).people.player.location, id('defense_research.far_bank'));
    await roundTrip('defense-research-crossed');
    assert.equal(hp(await save()), hp(armored));
    result.checks.push('A bare Water Shield plan worked, recovery removed it, and a hunted eye supplied an armor plan whose two harm estimates became the actual crossing.');
}

async function runLayeredDefense() {
    const trial = name => instant1(`layered_defense.${name}`);
    const button = name => p.locator(`[data-structured-action='${id(`layered_defense.${name}`)}']`);
    const line = p.locator('[data-gu="layered-defense"]');
    const hp = s => s.character.hp_to_full ?? 0;
    const dose = s => s.inventories.person.main_character[key('hosted_wolf.silver_dose')]?.count ?? 0;
    const reserve = s => sim(s).energies.player[id('primeval')].reserve;
    await equipBlastLane(); await prepareBlastLaneArmor();
    await step(20); await instant1('scale_armor.finish_armor');
    const fork = await p.evaluate(() => window.save_to_file());
    const before = await save();
    await trial('bare_blast');
    assert.equal(hp(await save()) - hp(before), 13);
    assert.match(await line.innerText(), /Blast took 9 health · Landing took 4 health/);
    await load(fork); await trial('shield_blast');
    const hit = await save();
    assert.equal(hp(hit) - hp(before), 6);
    assert.equal(dose(before) - dose(hit), 1);
    assert.equal(reserve(before) - reserve(hit), 4);
    assert.match(await line.innerText(), /Water Shield stopped 5 and broke/);
    assert.match(await line.innerText(), /White Jade stopped 2/);
    assert.equal(await button('jade_blast').isDisabled(), true);
    await roundTrip('defense-shield-broken');
    assert.equal(hp(await save()), hp(hit));
    await step(5); await open();
    assert.equal(await button('shield_blast').isDisabled(), true);
    const beforeJade = await save();
    await trial('jade_blast');
    assert.equal(hp(await save()) - hp(beforeJade), 11);
    await step(15); await open();
    assert.match(await line.innerText(), /Water Shield ready/);
    await load(fork); await trial('braced_blast');
    const braced = await save();
    assert.equal(hp(braced) - hp(before), 3);
    assert.equal(reserve(before) - reserve(braced), 6);
    assert.match(await line.innerText(), /Blast took 2 health · Landing took 1 health/);
    assert.match(await line.innerText(), /Scale Armor stopped 3/);
    await roundTrip('defense-braced');
    assert.equal(hp(await save()), hp(braced));
    result.checks.push('An actual Thunderclap dose and native aperture funded each attempt. Shield recovery outlasted shot recovery. Armor changed the landing only.');
}

async function runHostedWolf() {
    const action=name=>instant1(`hosted_wolf.${name}`);
    const button=name=>p.locator(`[data-structured-action='${id(`hosted_wolf.${name}`)}']`);
    const wolf=p.locator('[data-gu="hosted-wolf"]');
    await p.locator(`[data-structured-extension='${id('hosted_wolf')}']`).click();
    await action('buy_silver');await action('enter');await action('find');
    assert.doesNotMatch(await wolf.innerText(),/Thunderclap/);
    await action('inspect');
    assert.match(await wolf.innerText(),/Thunderclap living on the wolf/);
    const before=await p.evaluate(()=>window.save_to_file());
    await action('shelter');await action('care');
    await roundTrip('hosted-wolf-under-care');
    await step(20);
    assert.equal(await button('extract').isDisabled(),true);
    await action('extract_sound');
    assert.match(await wolf.innerText(),/sound.*captured with wild will/);
    await action('release');await action('refine');await action('cast');
    assert.match(await wolf.innerText(),/on the trail.*Thunderclap struck the target post/);
    await roundTrip('hosted-thunderclap-used');
    await load(before);
    await action('hunt');
    assert.match(await wolf.innerText(),/killed in the hunt.*Thunderclap lost in the hunt/);
    assert.equal(await button('refine').isDisabled(),true);
    result.checks.push('Host recovery changed extraction. Live capture preserved the Gu, while the hunt yielded no Gu.');
}
async function runWolfRidge() {
    const action=name=>instant1(`hosted_wolf.${name}`);
    const ridge=name=>instant1(`wolf_ridge.${name}`);
    const button=name=>p.locator(`[data-structured-action='${id(`wolf_ridge.${name}`)}']`);
    const admit=name=>p.locator(`[data-structured-extension='${id(name)}']`).click();
    const line=p.locator('[data-gu="wolf-ridge"]');
    const facts=async()=> (await save()).expansion.worlds[id('world')].facts;
    const original=async()=>JSON.parse((await facts())[id('hosted_wolf.encounter')]);
    const population=async()=>JSON.parse((await facts())[id('wolf_ridge.population')]);
    await admit('hosted_wolf');
    await action('buy_silver');await action('enter');await action('find');await action('inspect');
    const fork=await p.evaluate(()=>window.save_to_file());
    await action('hunt');
    await admit('wolf_ridge');await ridge('watch_ridge');
    assert.match(await line.innerText(),/6 hares.*2 wolves/);
    await step(30);await open();
    assert.match(await line.innerText(),/6 hares.*3 wolves/);
    assert.equal(await button('mark_wolf').isDisabled(),true);
    await roundTrip('wolf-ridge-after-original-hunt');
    await load(fork);
    await action('shelter');await action('care');await step(20);await action('extract_sound');await action('release');
    const released=await original();
    await admit('wolf_ridge');await ridge('watch_ridge');
    assert.match(await line.innerText(),/6 hares.*3 wolves/);
    assert.equal(await button('mark_wolf').isDisabled(),true);
    await step(30);await ridge('mark_wolf');
    assert.match(await line.innerText(),/first wolf returned/);
    assert.equal((await population()).original,released.host);
    const returned=(await population()).lifecycle.individuals[released.host];
    assert.equal(returned.health.injury.remaining,0);
    await ridge('take_hare');
    assert.match(await line.innerText(),/5 hares.*3 wolves/);
    await step(30);await open();
    assert.match(await line.innerText(),/6 hares.*2 wolves/);
    await roundTrip('wolf-ridge-prey-shortage');
    const purse=stones(await save());
    await ridge('sell_hare');assert.equal(stones(await save()),purse+1);
    await step(30);await ridge('fresh_trail');
    assert.match(await line.innerText(),/6 hares.*3 wolves.*Thunderwings on the wolf/);
    const fresh=await population();
    const candidate=fresh.focus;
    const wingId=fresh.tracks[candidate].gu;
    await ridge('spare_wolf');
    assert.equal(await button('returning_trail').isDisabled(),true);
    await roundTrip('wolf-ridge-host-spared');
    await step(30);await ridge('returning_trail');
    assert.match(await line.innerText(),/same wolf returned.*Thunderwings on the wolf/);
    assert.equal((await population()).focus,candidate);
    assert.equal((await population()).tracks[candidate].gu,wingId);
    await ridge('hunt_ridge_wolf');
    assert.match(await line.innerText(),/2 wolves.*Thunderwings in your care with wild will/);
    assert.equal((await population()).tracks[candidate].custody,'captured');
    assert.equal((await original()).gu.custody,'keeper');
    await ridge('refine_wings');await ridge('fly_shelf');
    assert.equal((await save())['current location'],id('wolf_ridge.shelf'));
    assert.match(await line.innerText(),/Thunderwings reached the shelf/);
    await roundTrip('wolf-ridge-lookout');
    await ridge('walk_down');
    const beforeSale=stones(await save());
    await ridge('sell_eye');assert.equal(stones(await save()),beforeSale+1);
    assert.equal(await button('sell_eye').isDisabled(),true);
    result.checks.push('The first hunt and release produced different wolf counts and identities. Prey removal changed the next window. The returning host kept its original Thunderwings through capture and flight.');
}
async function runWolfScouting() {
    const act=(pack,name)=>instant1(`${pack}.${name}`);
    const wolf=name=>act('hosted_wolf',name);
    const ridge=name=>act('wolf_ridge',name);
    const scout=name=>act('wolf_scouting',name);
    const admit=name=>p.locator(`[data-structured-extension='${id(name)}']`).click();
    const btn=name=>p.locator(`[data-structured-action='${id(`wolf_scouting.${name}`)}']`);
    const line=p.locator('[data-gu="wolf-scouting"]');
    const read=s=>JSON.parse(s.expansion.worlds[id('world')].facts[id('wolf_ridge.population')]);
    const reserve=s=>sim(s).energies.player[id('primeval')].reserve;
    await admit('hosted_wolf');await wolf('buy_silver');await wolf('enter');await wolf('find');await wolf('inspect');await wolf('hunt');
    await admit('wolf_ridge');await ridge('watch_ridge');
    await admit('wolf_scouting');await scout('find_crown');await ridge('fresh_trail');
    await scout('scout_plain');await scout('scout_crown');
    assert.match(await line.innerText(),/other wolf missed you.*Lightning Eye saw through Stealth Scales/);
    assert.equal(await btn('follow_ravine').isDisabled(),true);
    const first=read(await save());
    await ridge('take_hare');await ridge('take_hare');
    assert.match(await line.innerText(),/on the ridge/);
    await roundTrip('wolf-scouting-before-migration');
    await step(30);await scout('follow_ravine');
    assert.equal((await save())['current location'],id('wolf_scouting.ravine'));
    await scout('scout_ravine');
    const moved=read(await save());
    assert.equal(moved.scouting.host,first.scouting.host);
    assert.equal(moved.scouting.gu,first.scouting.gu);
    assert.equal(moved.lifecycle.individuals[moved.scouting.host].habitat,id('wolf_scouting.ravine'));
    assert.match(await line.innerText(),/followed the prey to the ravine.*Lightning Eye saw through Stealth Scales/);
    assert.equal(await btn('screened').isDisabled(),true);
    await roundTrip('wolf-scouting-ravine');
    await step(10);await scout('screened');
    assert.match(await line.innerText(),/stone bank kept you out of sight/);
    await step(10);await open();
    assert.equal(await btn('extract_eye').isDisabled(),true);
    await scout('screened');await scout('extract_eye');
    const captured=read(await save());
    assert.equal(captured.scouting.gu,first.scouting.gu);
    assert.equal(captured.scouting.custody,'captured');
    assert.equal(captured.lifecycle.individuals[captured.scouting.host].habitat,id('wolf_scouting.ravine'));
    await roundTrip('wolf-scouting-extracted');
    while(reserve(await save())<3)await step(60);
    await scout('refine_eye');await scout('scout_ravine');
    assert.match(await line.innerText(),/Stealth Scales hid you from the crown wolf/);
    const before=stones(await save());
    await scout('reveal_cache');
    assert.equal(stones(await save()),before+2);
    assert.equal(await btn('reveal_cache').isDisabled(),true);
    assert.match(await line.innerText(),/concealed cache recovered/);
    await roundTrip('wolf-scouting-cache');
    await scout('leave_ravine');
    result.checks.push('Food pressure moved the same host and Gu. Lightning Eye pierced Stealth Scales, stone blocked its sight, and removing the same Gu reversed the test.');
}
async function runCrownFlight() {
    const act=(pack,name)=>instant1(`${pack}.${name}`);
    const wolf=name=>act('hosted_wolf',name);
    const ridge=name=>act('wolf_ridge',name);
    const scout=name=>act('wolf_scouting',name);
    const flight=name=>act('crown_flight',name);
    const travel=name=>act1(`crown_flight.${name}`);
    const admit=name=>p.locator(`[data-structured-extension='${id(name)}']`).click();
    const button=name=>p.locator(`[data-structured-action='${id(`crown_flight.${name}`)}']`);
    const spark=p.locator('[data-gu="fleeing-spark"]');
    const shield=p.locator('[data-gu="fleeing-shield"]');
    const read=s=>JSON.parse(s.expansion.worlds[id('world')].facts[id('wolf_ridge.population')]);
    const stamina=s=>s.character.stamina_to_full??0;
    await admit('hosted_wolf');await wolf('buy_silver');await wolf('enter');await wolf('find');await wolf('inspect');await wolf('hunt');
    await admit('wolf_ridge');await ridge('watch_ridge');
    await admit('wolf_scouting');await scout('find_crown');await ridge('take_hare');await ridge('take_hare');
    await step(30);await scout('follow_ravine');await scout('screened');await scout('extract_eye');
    const disarmed=read(await save());
    await admit('crown_flight');await flight('buy_tongs');await flight('start_flight');
    assert.match(await spark.innerText(),/fleeing.*10 min/);
    assert.match(await shield.innerText(),/fleeing.*22 min/);
    const opened=read(await save());
    assert.equal(opened.flight.host,disarmed.scouting.host);
    assert.equal(opened.scouting.gu,disarmed.scouting.gu);
    assert.equal(opened.scouting.custody,'captured');
    const fork=await p.evaluate(()=>window.save_to_file());
    await travel('to_ledge');await step(4);
    await roundTrip('crown-flight-pending-leg');
    await step(4);await open();
    assert.equal((await save())['current location'],id('crown_flight.ledge'));
    assert.equal(await button('pluck_shield').isDisabled(),true);
    await flight('touch_shield');
    assert.match(await shield.innerText(),/Thunder Shield.*raised a lightning shield/);
    await flight('pluck_shield');await flight('refine_shield');await flight('shield_cross');
    assert.equal((await save())['current location'],id('crown_flight.bank'));
    assert.match(await shield.innerText(),/carried you across the sparking ford/);
    await roundTrip('crown-flight-shield-crossing');
    await travel('bank_back');await step(8);await travel('to_scrub');await step(5);await open();
    assert.match(await spark.innerText(),/trail went cold/);
    assert.equal(await button('tongs_spark').isDisabled(),true);
    await roundTrip('crown-flight-missed-spark');
    await load(fork);
    await travel('to_scrub');await step(5);await open();
    const before=stamina(await save());
    await flight('touch_spark');
    assert.equal(stamina(await save()),before+2);
    assert.match(await spark.innerText(),/shocked your hand/);
    await flight('tongs_spark');
    await travel('scrub_back');await step(5);await travel('to_ledge');await step(8);await open();
    await flight('touch_shield');await flight('pluck_shield');
    const caught=read(await save());
    for(const kind of ['spark','shield']) {
        assert.equal(caught.flight.gu[kind].id,opened.flight.gu[kind].id);
        assert.equal(caught.flight.gu[kind].custody,'captured');
    }
    await roundTrip('crown-flight-both-captured');
    result.checks.push('The same host released two independent Gu. One route lost the spark and used Thunder Shield. Preparing tongs and taking the shorter deadline first recovered both.');
}
async function runSmokePassage() {
    const act=(pack,name)=>instant1(`${pack}.${name}`);
    const wolf=name=>act('hosted_wolf',name);
    const ridge=name=>act('wolf_ridge',name);
    const scout=name=>act('wolf_scouting',name);
    const smoke=name=>act('smoke_passage',name);
    const admit=name=>p.locator(`[data-structured-extension='${id(name)}']`).click();
    const button=name=>p.locator(`[data-structured-action='${id(`smoke_passage.${name}`)}']`);
    const line=p.locator('[data-gu="smoke-passage"]');
    const dose=s=>s.inventories.person.main_character[key('hosted_wolf.silver_dose')]?.count??0;
    const steward=s=>sim(s).people[id('steward')].location;
    const stamina=s=>s.character.stamina_to_full??0;
    await admit('hosted_wolf');
    while(stones(await save())<5){await act1('chores');await step(120);}
    for(let i=0;i<3;i++)await wolf('buy_silver');
    await wolf('enter');await wolf('find');await wolf('inspect');await wolf('hunt');
    await admit('wolf_ridge');await ridge('watch_ridge');await admit('wolf_scouting');await scout('find_crown');
    await ridge('take_hare');await ridge('take_hare');await step(30);
    await scout('follow_ravine');await scout('screened');await scout('extract_eye');await scout('refine_eye');
    await scout('leave_ravine');await wolf('leave');await admit('smoke_passage');await smoke('start');
    assert.equal(steward(await save()),id('smoke_passage.mouth'));
    assert.match(await line.innerText(),/2 listening doses left/);
    await smoke('mouth_look');
    assert.match(await line.innerText(),/firm stones.*rope/s);
    assert.doesNotMatch(await line.innerText(),/wolf pack|charred pine/);
    const before=stamina(await save());
    await smoke('mouth_wrong');
    assert.equal(stamina(await save()),before+3);
    assert.match(await line.innerText(),/backed away from the wolf pack/);
    assert.equal(dose(await save()),2);
    await roundTrip('smoke-passage-sight-only-failure');
    const fork=await p.evaluate(()=>window.save_to_file());
    await smoke('mouth_combine');
    assert.match(await line.innerText(),/firm stones.*wolf pack is coming/s);
    await smoke('mouth_send_back');
    assert.equal(steward(await save()),id('annex'));
    assert.equal(await button('mouth_combine').isDisabled(),true);
    await step(8);await open();
    assert.match(await line.innerText(),/steward is away.*earlier signs have faded/);
    await roundTrip('smoke-passage-separated');
    await smoke('mouth_rally');await smoke('mouth_listen');
    assert.match(await line.innerText(),/0 listening doses left.*wolf pack is coming/s);
    assert.doesNotMatch(await line.innerText(),/firm stones|rope marks/);
    await smoke('mouth_side');
    assert.equal(await button('bend_combine').isDisabled(),true);
    assert.equal(await button('bend_look').isDisabled(),false);
    await smoke('bend_retreat');await smoke('replenish');await smoke('reenter');
    assert.match(await line.innerText(),/2 listening doses left/);
    await load(fork);
    await smoke('mouth_combine');
    assert.match(await line.innerText(),/1 listening doses left.*rope.*wolf pack is coming/s);
    await roundTrip('smoke-passage-shared-observations');
    await smoke('mouth_side');
    assert.equal(steward(await save()),id('smoke_passage.bend'));
    await smoke('bend_combine');
    assert.match(await line.innerText(),/0 listening doses left.*stepping stones.*wolves have moved away/s);
    assert.doesNotMatch(await line.innerText(),/second pack/);
    assert.equal(dose(await save()),0);
    await smoke('bend_straight');
    assert.equal((await save())['current location'],id('smoke_passage.exit'));
    assert.equal(steward(await save()),id('smoke_passage.exit'));
    const purse=stones(await save());
    await smoke('recover');assert.equal(stones(await save()),purse+3);
    assert.equal(await button('recover').isDisabled(),true);
    await roundTrip('smoke-passage-clearing');
    await smoke('return');
    assert.equal(steward(await save()),id('annex'));
    result.checks.push('Sight alone missed a pack. The steward’s absence and spent reserves prevented fresh listening. Both channels supported two different turns and the courier’s sack.');
}
async function runStealthFusion() {
    const act=(pack,name)=>instant1(`${pack}.${name}`);
    const wolf=name=>act('hosted_wolf',name);
    const ridge=name=>act('wolf_ridge',name);
    const cloak=name=>act('stealth_fusion',name);
    const admit=name=>p.locator(`[data-structured-extension='${id(name)}']`).click();
    const button=name=>p.locator(`[data-structured-action='${id(`stealth_fusion.${name}`)}']`);
    const line=p.locator('[data-gu="stealth-fusion"]');
    const facts=s=>s.expansion.worlds[id('world')].facts;
    const ledger=s=>JSON.parse(facts(s)[id('stealth_fusion.work')]);
    const inventory=(s,name)=>s.inventories.person.main_character[key(name)]?.count??0;
    await admit('hosted_wolf');await wolf('enter');await wolf('find');await wolf('inspect');await wolf('hunt');
    await admit('wolf_ridge');await ridge('watch_ridge');await admit('stealth_fusion');
    assert.equal(await button('trade_fish').isDisabled(),true);
    await ridge('fresh_trail');await ridge('hunt_ridge_wolf');
    assert.equal(inventory(await save(),'wolf_ridge.wolf_eye'),1);
    await cloak('trade_fish');
    assert.equal(inventory(await save(),'wolf_ridge.wolf_eye'),0);
    assert.equal(await button('buy_fish').isDisabled(),true);
    await cloak('enter_hollow');await cloak('take_rock');await cloak('leave_hollow');
    assert.match(await line.innerText(),/Stealth Rock in your care with wild will/);
    await cloak('bind_rock');await cloak('test_rock');
    assert.match(await line.innerText(),/hid you but left your sash visible/);
    const ingredients=ledger(await save()).world.gu.map(({id})=>id);
    await cloak('prepare_cloak');
    assert.equal(await button('test_rock').isDisabled(),true);
    assert.equal(await button('finish_cloak').isDisabled(),true);
    await roundTrip('stealth-fusion-pending');
    await cloak('cancel_cloak');
    assert.match(await line.innerText(),/both Gu survived/);
    assert.deepEqual(ledger(await save()).world.gu.filter(gu=>gu.alive).map(({id})=>id),ingredients);
    await roundTrip('stealth-fusion-cancelled');
    await cloak('prepare_cloak');await step(15);await cloak('finish_cloak');
    const finished=ledger(await save()).world.gu;
    assert.equal(finished[0].fate,'consumed');assert.equal(finished[1].fate,'consumed');
    assert.deepEqual(finished[2].provenance.ingredients,{scales:ingredients[0],rock:ingredients[1]});
    assert.equal(await button('test_rock').isDisabled(),true);
    await cloak('test_scales');
    assert.match(await line.innerText(),/hid the sash.*hound caught your scent/);
    await cloak('cross_screen');
    assert.equal((await save())['current location'],id('stealth_fusion.screen'));
    const petals=inventory(await save(),'petals');
    await cloak('retrieve');assert.equal(inventory(await save(),'petals'),petals+2);
    await roundTrip('stealth-fusion-screen-crossing');
    await cloak('return');await step(45);await open();
    await admit('wolf_scouting');await act('wolf_scouting','find_crown');await ridge('fresh_trail');
    await act('wolf_scouting','scout_plain');
    assert.match(await p.locator('[data-gu="wolf-scouting"]').innerText(),/under your Stealth Scales/);
    const population=JSON.parse(facts(await save())[id('wolf_ridge.population')]);
    assert.equal(population.scouting.plainGu,finished[2].id);
    await roundTrip('stealth-fusion-owned-scout');
    result.checks.push('The native trade consumed a wolf eye, both living parents survived cancellation, and the exact fused Gu powered the crossing and later scout.');
}
async function runScaleArmor() {
    const act=(pack,name)=>instant1(`${pack}.${name}`);
    const wolf=name=>act('hosted_wolf',name);
    const ridge=name=>act('wolf_ridge',name);
    const cloak=name=>act('stealth_fusion',name);
    const armor=name=>act('scale_armor',name);
    const admit=name=>p.locator(`[data-structured-extension='${id(name)}']`).click();
    const button=(pack,name)=>p.locator(`[data-structured-action='${id(`${pack}.${name}`)}']`);
    const line=p.locator('[data-gu="stealth-fusion"]');
    const ledger=s=>JSON.parse(s.expansion.worlds[id('world')].facts[id('stealth_fusion.work')]).world;
    const hp=s=>s.character.hp_to_full??0;
    const item=(s,name)=>s.inventories.person.main_character[key(name)]?.count??0;
    await admit('hosted_wolf');await wolf('enter');await wolf('find');await wolf('inspect');await wolf('hunt');
    await admit('wolf_ridge');await ridge('watch_ridge');await admit('stealth_fusion');await admit('scale_armor');
    await ridge('fresh_trail');await ridge('hunt_ridge_wolf');await cloak('trade_fish');
    await cloak('enter_hollow');await cloak('take_rock');await cloak('leave_hollow');await cloak('bind_rock');
    const fish=ledger(await save()).gu.find(row=>row.kind==='fish-scale').id;
    await armor('buy_laminate');
    await cloak('prepare_cloak');
    assert.equal(await button('scale_armor','prepare_armor').isDisabled(),true);
    await cloak('cancel_cloak');
    assert.equal(ledger(await save()).gu.find(row=>row.id===fish).alive,true);
    await armor('prepare_armor');
    assert.equal(await button('stealth_fusion','prepare_cloak').isDisabled(),true);
    assert.equal(await button('scale_armor','finish_armor').isDisabled(),true);
    assert.equal(item(await save(),'scale_armor.shell_laminate'),0);
    assert.match(await line.innerText(),/Fish Scale in the shell laminate/);
    await roundTrip('scale-armor-pending');
    const pending=await p.evaluate(()=>window.save_to_file());
    await armor('cancel_armor');
    assert.match(await line.innerText(),/Fish Scale survived/);
    assert.equal(item(await save(),'scale_armor.shell_laminate'),0);
    assert.equal(ledger(await save()).gu.find(row=>row.id===fish).alive,true);
    await roundTrip('scale-armor-cancelled');
    await load(pending);await step(20);await armor('finish_armor');
    const finished=ledger(await save());
    assert.equal(finished.gu.find(row=>row.id===fish).fate,'consumed');
    assert.equal(finished.gu.find(row=>row.kind==='stealth-rock').alive,true);
    assert.equal(finished.gu.find(row=>row.kind==='scale-armor').provenance.ingredients.scales,fish);
    assert.equal(await button('stealth_fusion','prepare_cloak').isDisabled(),true);
    const before=hp(await save());
    const ready=await p.evaluate(()=>window.save_to_file());
    await armor('plain_run');assert.equal(hp(await save()),before+3);
    assert.equal((await save())['current location'],id('scale_armor.far_run'));
    await load(ready);await armor('guard_run');assert.equal(hp(await save()),before);
    assert.equal((await save())['current location'],id('scale_armor.far_run'));
    assert.match(await line.innerText(),/Scale Armor stopped the falling stone/);
    await roundTrip('scale-armor-guarded');
    await armor('return');await ridge('fresh_trail');await ridge('hunt_ridge_wolf');await cloak('trade_fish');
    const replacement=ledger(await save()).gu.find(row=>row.kind==='fish-scale'&&row.alive).id;
    assert.notEqual(replacement,fish);
    await cloak('prepare_cloak');await step(15);await cloak('finish_cloak');
    const both=ledger(await save()).gu;
    assert.equal(both.find(row=>row.kind==='stealth-scales').provenance.ingredients.scales,replacement);
    assert.equal(both.find(row=>row.kind==='scale-armor').provenance.ingredients.scales,fish);
    assert.match(await line.innerText(),/Stealth Scales in your care.*Scale Armor in your care/);
    await roundTrip('scale-armor-two-distinct-products');
    result.checks.push('One Fish Scale could not fund both recipes. Armor prevented the real damage, and a later specimen enabled the other branch.');
}
async function runThunderPotato() {
    const action=name=>instant1(`thunder_potato.${name}`);
    const button=name=>p.locator(`[data-structured-action='${id(`thunder_potato.${name}`)}']`);
    const stock=s=>s.inventories.person.main_character[key('thunder_potato.fruit')]?.count??0;
    const bed=p.locator('[data-gu="thunder-potato"]');
    await p.locator(`[data-structured-extension='${id('thunder_potato')}']`).click();
    await action('borrow');
    for(let batch=0;batch<8&&!stock(await save());batch++) {
        if(!stones(await save())){await act1('chores');await step(120);}
        await action('buy_silver');
        await action('produce');
        assert.match(await bed.innerText(),/4 unsorted fruit.*0 carried/);
        await action('sort');
    }
    const carried=stock(await save());
    assert.ok(carried>0);
    await action('return_mother');
    await action('refine');
    await action('enter_pit');
    assert.equal(await button('inspect_recess').isDisabled(),true);
    await action('plant_deep');
    assert.equal(stock(await save()),carried-1);
    assert.match(await bed.innerText(),/growing, 10 min left/);
    await roundTrip('thunder-potato-growing');
    assert.equal(await button('strike').isDisabled(),true);
    await step(10);
    await action('tap');
    assert.match(await bed.innerText(),/soil stayed quiet/);
    await action('strike');
    assert.match(await bed.innerText(),/blast cleared the clay plug/);
    assert.equal(await button('strike').isDisabled(),true);
    await action('inspect_recess');
    assert.equal((await save())['current location'],id('thunder_potato.recess'));
    await roundTrip('thunder-potato-recess');
    result.checks.push('A planted Gu survived export and import, then detonated once and opened the recess.');
}
async function runPotatoTrial() {
    const original = name => instant1(`thunder_potato.${name}`);
    const trial = name => instant1(`thunder_potato_trial.${name}`);
    const button = name => p.locator(`[data-structured-action="${id(`thunder_potato_trial.${name}`)}"]`);
    const bed = p.locator('[data-gu="thunder-potato"]');
    const report = p.locator('[data-gu="thunder-potato-trial"]');
    const stock = (s, name) => s.inventories.person.main_character[key(name)]?.count ?? 0;
    const ledger = s => JSON.parse(s.expansion.worlds[id('world')].facts[id('thunder_potato.bed')]);
    for (const name of ['thunder_potato', 'thunder_potato_trial']) {
        await p.locator(`[data-structured-extension="${id(name)}"]`).click();
    }
    await original('borrow');
    for (let batch = 0; batch < 8; batch++) {
        if (!stones(await save())) { await act1('chores'); await step(120); }
        await original('buy_silver');
        await original('produce');
        await original('sort');
        if (stock(await save(), 'thunder_potato.fruit')) break;
    }
    assert.ok(stock(await save(), 'thunder_potato.fruit'));
    await original('return_mother');
    await original('refine');
    await original('enter_pit');
    const beforeDressing = stock(await save(), 'petals');
    await trial('plant_dressed');
    assert.equal(stock(await save(), 'petals'), beforeDressing - 1);
    assert.match(await bed.innerText(), /growing, 5 min left/);
    assert.match(await report.innerText(), /Buried fruit has a usual blast/);
    assert.equal(await button('test_brace').isDisabled(), true);
    await step(5);
    await trial('test_brace');
    assert.match(await report.innerText(), /stone brace held/);
    assert.equal(await button('enter_store').isDisabled(), true);
    await original('leave_pit');
    await trial('borrow');
    assert.equal(await button('produce_crest').isDisabled(), true);
    for (let batch = 0; batch < 8; batch++) {
        if (!stones(await save())) { await act1('chores'); await step(120); }
        await original('buy_silver');
        if ((await report.innerText()).includes('needs food')) {
            const beforeMeal = stock(await save(), 'petals');
            await trial('feed_crest');
            assert.equal(stock(await save(), 'petals'), beforeMeal - 1);
        }
        await trial('produce_crest');
        await original('sort');
        if (!(await button('refine_crest').isDisabled())) break;
    }
    await trial('return_crest');
    await trial('refine_crest');
    const fruit = ledger(await save()).fruits.find(row => row.phase === 'refined');
    assert.equal(fruit.producer, id('thunder_potato_trial.mother'));
    assert.equal(fruit.force, 2);
    await original('enter_pit');
    await original('plant_deep');
    assert.match(await bed.innerText(), /growing, 10 min left/);
    assert.match(await report.innerText(), /Buried fruit has a strong blast/);
    await roundTrip('potato-trial-strong-growing');
    await step(10);
    assert.equal(ledger(await save()).fruits.find(row => row.phase === 'planted').id, fruit.id);
    await trial('test_brace');
    assert.ok(!ledger(await save()).fruits.some(row => row.id === fruit.id));
    assert.match(await report.innerText(), /stone brace broke/);
    await trial('enter_store');
    const beforeCache = stones(await save());
    await trial('recover_cache');
    assert.equal(stones(await save()), beforeCache + 3);
    assert.equal(await button('recover_cache').isDisabled(), true);
    await roundTrip('potato-trial-cache');
    result.checks.push('Dressed soil sped up the usual fruit, the unfed mother could not grow fruit, and the exact crested fruit broke the brace and opened the cache.');
}
async function runPotatoMarket(withRig = false, withWear = false) {
    const base = op => instant1(`thunder_potato.${op}`);
    const trial = op => instant1(`thunder_potato_trial.${op}`);
    const market = op => instant1(`thunder_potato_market.${op}`);
    const button = op => p.locator(`[data-structured-action="${id(`thunder_potato_market.${op}`)}"]`);
    const ledger = s => JSON.parse(s.expansion.worlds[id('world')].facts[id('thunder_potato.bed')]);
    const owned = (s, name) => sim(s).owners[id('steward')]?.[key(name)] ?? 0;
    const fruitKey = 'thunder_potato.fruit';
    const report = p.locator('[data-gu="potato-market"]');
    const rig = op => instant1(`drain_rig.${op}`);
    const wear = op => instant1(`drain_rig_wear.${op}`);
    const rigView = p.locator('[data-gu="drain-rig"]');
    const reserve = s => sim(s).energies.player[id('primeval')].reserve;
    const ensureStones = async()=>{ if (!stones(await save())) {await act1('chores'); await step(120);} };
    for (const name of ['thunder_potato','thunder_potato_trial','thunder_potato_market']) {
        await p.locator(`[data-structured-extension="${id(name)}"]`).click();
    }
    if (withRig) {
        await instant1('take_moon');
        await p.locator(`[data-structured-extension="${id('drain_rig')}"]`).click();
    }
    if (withWear) await p.locator(`[data-structured-extension="${id('drain_rig_wear')}"]`).click();
    async function releaseLog(size, checkpoint) {
        await ensureStones(); await rig('buy_cord'); await rig(`rig_${size}`);
        if (reserve(await save()) < 4) { await act1('rest'); await step(60); }
        const before = await save();
        await rig('cut_tether');
        const cut = await save();
        assert.equal(reserve(before)-reserve(cut),4);
        assert.equal(ledger(cut).rig.phase,'rolling');
        if (checkpoint) await roundTrip(checkpoint);
        await step(1);
        const landed = ledger(await save()).rig;
        assert.equal(landed.phase,'landed');
        assert.equal(landed.impact.vibration,size==='light' ? 1 : 2);
        return landed;
    }
    await base('borrow');
    async function grow(op, name) {
        for (let batch=0; batch<8; batch++) {
            await ensureStones(); await base('buy_silver');
            if (op === 'produce_crest') {
                const feed = p.locator(`[data-gu="thunder-potato-trial"]`);
                if ((await feed.innerText()).includes('needs food')) await trial('feed_crest');
                await trial(op);
            } else await base(op);
            await base('sort');
            const fruit = ledger(await save()).fruits.find(row => row.holder==='player' && row.phase==='viable' && row.producer===id(name));
            if (fruit) return fruit;
        }
        throw Error('No viable fruit in the trial batches.');
    }
    const usual = await grow('produce','thunder_potato.mother');
    assert.equal(await button('sell_usual').isDisabled(), true);
    await ensureStones(); await instant1('buy_petals');
    const before = await save();
    await market('sell_usual');
    const sold = await save();
    assert.equal(stones(sold), stones(before)+1);
    assert.equal(owned(sold, 'stone'), owned(before, 'stone')-1);
    assert.equal(owned(sold, fruitKey),1);
    assert.deepEqual(ledger(sold).fruits.find(row=>row.id===usual.id), {...usual,holder:id('steward')});
    await roundTrip('potato-market-sold');
    await market('buy_back');
    assert.equal(stones(await save()),stones(before));
    assert.equal(owned(await save(),fruitKey),0);
    assert.deepEqual(ledger(await save()).fruits.find(row=>row.id===usual.id),usual);
    await market('sell_usual'); await market('plant_sale');
    assert.equal(await button('buy_back').isDisabled(),true);
    assert.equal(await button('test_sale').isDisabled(),true);
    await step(10);
    if (withRig) assert.equal((await releaseLog('heavy')).triggered,true);
    else await market('test_sale');
    assert.equal(ledger(await save()).buyerResult.id,usual.id);
    assert.match(await report.innerText(),/left the heavy stone in place/);
    assert.equal(await button('enter').isDisabled(),true);
    await trial('borrow');
    const crested = await grow('produce_crest','thunder_potato_trial.mother');
    await ensureStones(); await instant1('buy_petals');
    await market('sell_crested'); await market('plant_sale');
    await roundTrip('potato-market-buyer-plot');
    if (withWear) {
        const castCount = s => s.expansion.actors.player.completed[id('drain_rig.cut_tether')] ?? 0;
        const casts = castCount(await save());
        await ensureStones(); await rig('buy_cord'); await rig('rig_heavy');
        await step(2);
        assert.equal(ledger(await save()).rig.phase,'tethered');
        await wear('get_cord'); await wear('rig_worn_heavy'); await step(1);
        await roundTrip('frayed-cord-under-load');
        const beforeBreak = await save();
        await step(1);
        const snapped = await save();
        assert.match(await rigView.innerText(),/frayed cord snapped · log rolling/);
        assert.equal(castCount(snapped),casts);
        assert.equal(reserve(snapped),reserve(beforeBreak));
        await roundTrip('frayed-cord-rolling');
        await step(1);
        const early = ledger(await save());
        assert.equal(early.rig.triggered,false);
        assert.ok(early.fruits.some(row=>row.id===crested.id));
        assert.equal(await button('enter').isDisabled(),true);
        await wear('get_cord'); await wear('rig_worn_light'); await step(10);
        assert.equal(ledger(await save()).rig.phase,'tethered');
        await wear('get_cord'); await wear('rig_worn_heavy'); await step(3);
        const late = await save();
        assert.equal(castCount(late),casts);
        assert.equal(ledger(late).rig.release,'wear');
        assert.equal(ledger(late).wearReleases,2);
        assert.equal(ledger(late).rig.triggered,true);
        result.checks.push('Fresh heavy and frayed light tethers held. Frayed heavy broke without a cast and detonated only after the fruit matured.');
    } else if (withRig) {
        await step(10);
        const light = await releaseLog('light');
        assert.equal(light.triggered,false);
        assert.equal(ledger(await save()).fruits.find(row=>row.id===crested.id)?.phase,'planted');
        assert.equal(await button('enter').isDisabled(),true);
        assert.equal((await releaseLog('heavy','drain-rig-rolling')).triggered,true);
    } else { await step(10); await market('test_sale'); }
    const resultRow=ledger(await save());
    assert.deepEqual(resultRow.buyerResult,{id:crested.id,producer:crested.producer,force:2});
    assert.ok(!resultRow.fruits.some(row=>row.id===crested.id));
    assert.equal(owned(await save(),fruitKey),0);
    await market('enter');
    assert.equal((await save())['current location'],id('thunder_potato_market.store'));
    await roundTrip('potato-market-cleared-drain');
    if (withRig) {
        const stock = (s, name) => s.inventories.person.main_character[key(`drain_rig.${name}`)]?.count ?? 0;
        await rig('grain');
        await act1('drain_rig.mill'); await step(1);
        assert.equal(stock(await save(),'grain'),0);
        assert.equal(stock(await save(),'meal'),0);
        await roundTrip('drain-rig-mill-pending');
        await step(3);
        assert.equal(stock(await save(),'meal'),1);
        await roundTrip('drain-rig-meal');
        result.checks.push(withWear ? 'The snapped tether cleared the drain and enabled the four-minute mill job.' :
            'The same ripe fruit survived a light impact. The heavy log triggered it, cleared the drain and powered a four-minute mill job.');
    }
    result.checks.push('An actual trade paid from the steward’s purse. The same sold fruit crossed custody, preparation and detonation.');
}

async function runRainbowLight() {
    const extension=name=>p.locator(`[data-structured-extension='${id(name)}']`).click();
    await instant1('take_moon');
    await extension('firefly_farm');
    await instant1('firefly_farm.start');
    await extension('stargate');
    await extension('move_trial');
    await extension('rainbow_light');
    await act1('chores');await step(120);
    await instant1('rainbow_light.loan');
    await instant1('rainbow_light.buy');
    await instant1('move_trial.borrow_light_source');
    await instant1('rainbow_light.start_supported');
    const view=p.locator('[data-gu="rainbow-light"]');
    assert.match(await view.innerText(),/8 white-silver measures.*with Light Source/);
    const beforeFlight=await p.evaluate(()=>window.save_to_file());
    await act1('rainbow_light.fly_out');
    await step(10);
    assert.match(await view.innerText(),/4 white-silver measures/);
    await roundTrip('rainbow-light-in-flight');
    await step(6);
    assert.equal((await save())['current location'],id('stargate.observatory'));
    await step(14);
    assert.match(await view.innerText(),/0 white-silver measures.*essence ran short/);
    await roundTrip('rainbow-light-exhausted');
    await load(beforeFlight);
    await instant1('move_trial.return_light_source');
    await act1('rainbow_light.fly_out');
    await step(16);
    assert.equal((await save())['current location'],id('annex'));
    assert.match(await view.innerText(),/8 white-silver measures.*bound Gu became unavailable/);
    result.checks.push('A saved flight renewed and arrived. Fuel exhaustion ended the form, and returning Light Source interrupted the flight without another debit.');
}
async function runMoveTrial() {
    await instant1('take_moon');
    await p.locator(`[data-structured-extension='${id('move_trial')}']`).click();
    const action=name=>instant1(`move_trial.${name}`);
    const notes=p.locator('[data-gu="moonblade-combinations"]');
    const candidates=notes.locator('[data-gu-move-slot]');
    const resultLine=notes.locator('[data-gu="moonblade-result"]');
    await action('research');
    assert.equal(await candidates.count(),1);
    await action('borrow_little_light');
    await action('borrow_light_source');
    await action('research');
    assert.equal(await candidates.count(),4);
    const sourced=candidates.filter({hasText:'known pairing'});
    const alternate=candidates.filter({hasText:/Little Light Gu.*Light Source Gu/});
    assert.match(await sourced.innerText(),/5 essence.*force 2.*reach 2/);
    assert.match(await alternate.innerText(),/4 essence.*force 2.*reach 2/);
    const sourcedSlot=await sourced.getAttribute('data-gu-move-slot');
    const alternateSlot=await alternate.getAttribute('data-gu-move-slot');
    const essence=s=>sim(s).energies.player[id('primeval')].reserve;
    const before=essence(await save());
    await action(`try_${sourcedSlot}`);
    assert.equal(essence(await save()),before-5);
    assert.match(await resultLine.innerText(),/blade struck.*force 2 and reach 2/);
    await act1('rest');await step(60);
    await action(`try_${alternateSlot}`);
    assert.match(await resultLine.innerText(),/4 essence spent.*blade struck.*force 2 and reach 2/);
    await roundTrip('moonblade-combinations-tried');
    await action('return_light_source');
    const withMissingSupport=essence(await save());
    await action(`try_${alternateSlot}`);
    assert.equal(essence(await save()),withMissingSupport-1);
    assert.match(await resultLine.innerText(),/1 essence spent.*Gu was unavailable.*blade did not form/);
    await roundTrip('moonblade-combination-interrupted');
    result.checks.push('Generated plans compared real casts, and a returned second support left the first unit spent.');
}
async function runRaisedMoonblade() {
    const command = async name => {
        const action = id(name);
        const before = (await save()).expansion.actors.player.completed[action] ?? 0;
        const button = p.locator(`[data-structured-action="${action}"]`);
        assert.equal(await button.isEnabled(), true, name);
        await button.evaluate(node => node.click());
        await p.waitForFunction(({action, before}) =>
            (window.simulationTestHooks.snapshot().expansion.actors.player.completed[action] ?? 0) > before,
        {action, before});
    };
    await command('take_moon');
    for (const name of ['move_trial', 'raised_moonblade']) {
        const extension = id(name);
        const button = p.locator(`[data-structured-extension="${extension}"]`);
        assert.equal(await button.isEnabled(), true, name);
        await button.evaluate(node => node.click());
        await p.waitForFunction(extension => {
            window.saveProgress();
            return JSON.parse(localStorage.getItem('save data')).content_packs.structured.extensions.some(pin => pin.id === extension);
        }, extension);
    }
    const trial = op => command(`raised_moonblade.${op}`);
    const loan = op => command(`move_trial.${op}`);
    const view = p.locator('[data-gu="distant-cord"]');
    const line = view.locator('[data-cord-result]');
    const plan = async pattern => `try_${await view.locator('[data-cord-plan]').filter({hasText: pattern}).getAttribute('data-cord-plan')}`;
    await loan('borrow_little_light');
    await command('buy_petals');
    await command('feed_moon');
    await command('buy_petals');
    await step(DAY);
    await trial('feed');
    await trial('research');
    const paired = await plan(/Little Light Gu/);
    await trial(await plan(/^Moonlight Gu/));
    assert.match(await line.innerText(), /4 essence spent.*fell short/);
    await roundTrip('cord-pair-fed');
    await step(DAY);
    await trial(paired);
    assert.match(await line.innerText(), /0 essence spent.*needs feeding/);
    await roundTrip('cord-pair-hungry');
    await loan('return_little_light');
    await loan('borrow_light_source');
    await trial(paired);
    assert.match(await line.innerText(), /0 essence spent.*unavailable/);
    await trial('research');
    await trial(await plan(/Light Source Gu/));
    assert.match(await line.innerText(), /3 essence spent.*fell short/);
    await loan('borrow_little_light');
    await trial('feed');
    await trial('research');
    await trial(await plan(/^Little Light Gu → Moonlight Gu/));
    assert.match(await line.innerText(), /5 essence spent.*cut the cord/);
    await trial('enter');
    assert.equal((await save())['current location'], id('raised_moonblade.alcove'));
    await roundTrip('cord-pair-opened-alcove');
    result.checks.push('The plain and cheaper substitute casts fell short. The exact pairing recovered from hunger and opened the alcove.');
}
async function runFireTrial() {
    await p.locator(`[data-structured-extension="${id('fire_trial')}"]`).click();
    const fire=name=>instant1(`fire_trial.${name}`);
    const view=p.locator('[data-gu="red-fire-trial"]');
    const targets=view.locator('[data-gu="fire-targets"]');
    const resultLine=view.locator('[data-gu="fire-result"]');
    const cross=p.locator(`[data-structured-action="${id('fire_trial.cross')}"]`);
    const reserve=async()=>sim(await save()).energies.player[id('primeval')].reserve;
    const rest=async()=>{await act1('rest');await step(60);};
    const slot=async pattern=>`try_${await view.locator('[data-fire-slot]').filter({hasText:pattern}).getAttribute('data-fire-slot')}`;
    await fire('loan');await fire('research');
    assert.equal(await view.locator('[data-fire-slot]').count(),8);
    const full=await slot(/Fire Source Gu.*Duplicate Gu.*Enlarge Gu.*6 essence.*2 flames.*force 2/);
    const pair=await slot(/Fire Source Gu.*Duplicate Gu.*5 essence.*2 flames.*force 1/);
    const bundle=await slot(/Fire Source Gu.*Enlarge Gu.*5 essence.*1 flame.*force 2/);
    const written=await p.evaluate(()=>window.save_to_file());
    await fire('return_duplicate');
    const beforeInterrupted=await reserve();
    await fire(full);
    assert.equal(await reserve(),beforeInterrupted-1);
    assert.match(await resultLine.innerText(),/1 essence spent.*unavailable/);
    assert.equal(await cross.isDisabled(),true);
    await roundTrip('red-fire-interrupted');
    await fire('borrow_duplicate');await fire(pair);
    assert.match(await targets.innerText(),/Twin braziers lit.*Damp kindling needs force 2/);
    assert.equal(await cross.isDisabled(),true);
    await rest();await fire(bundle);
    assert.match(await targets.innerText(),/Twin braziers lit.*Damp kindling lit/);
    await rest();
    const beforeCross=await reserve();
    await fire('cross');
    assert.equal(await reserve(),beforeCross-2);
    assert.equal((await save())['current location'],id('fire_trial.ledge'));
    await roundTrip('red-fire-ledge');
    await fire('return_house');
    assert.equal((await save())['current location'],id('annex'));
    await load(written);await fire(full);
    assert.match(await resultLine.innerText(),/6 essence spent.*2 flames, force 2/);
    assert.match(await targets.innerText(),/Twin braziers lit.*Damp kindling lit/);
    await view.screenshot({path:path.join(out,'red-fire-combinations.png')});
    await roundTrip('red-fire-combined');
    result.checks.push('Two separate casts and the fully supported attack both lit the kiln. A missing Duplicate stopped a written cast after Fire Source spent one essence. Fire Discharge paid separately and crossed to the ledge.');
}
async function runMoonlightProspect() {
    const admit=name=>p.locator(`[data-structured-extension="${id(name)}"]`).click();
    const trial=p.locator('[data-gu="moonlight-trial"]');
    const future=p.locator('[data-gu="moonlight-prospect"]');
    const cast=p.locator(`[data-structured-action="${id('moonlight_prospect.cast_future')}"]`);
    const act=name=>instant1(`moonlight_prospect.${name}`);
    const essence=async()=>sim(await save()).energies.player[id('primeval')].reserve;
    await instant1('take_moon');
    await admit('moonlight_trial');
    await instant1('moonlight_trial.borrow');await instant1('moonlight_trial.cast_loan');
    assert.match(await trial.innerText(),/loan Gu: 5 sheets cut/);
    await admit('moonlight_prospect');
    await act('prepare');await act('open');
    assert.match(await future.innerText(),/seal open/);
    const before=await essence();
    await roundTrip('moonlight-prospect-open');
    const anchored=await p.evaluate(()=>window.save_to_file());
    await act('cast_future');
    assert.match(await future.innerText(),/seal spent.*6 sheets cut/);
    assert.match(await trial.innerText(),/loan Gu: 5 sheets cut/);
    assert.equal(await essence(),before);
    await act('cancel');
    assert.match(await future.innerText(),/preparation stopped.*6 sheets cut/);
    await roundTrip('moonlight-prospect-cancelled');
    await load(anchored);
    await instant1('moonlight_trial.return_loan');await instant1('moonlight_trial.borrow');
    assert.match(await future.innerText(),/seal lost its connection/);
    assert.equal(await cast.isDisabled(),true);
    await act('cancel');await act('prepare');await act('open');
    await step(20);
    assert.match(await future.innerText(),/seal expired/);
    assert.equal(await cast.isDisabled(),true);
    await step(10);await act('finish');
    await step(240);
    await instant1('moonlight_trial.cast_loan');
    assert.match(await future.innerText(),/refinement complete/);
    assert.match(await trial.innerText(),/loan Gu: 6 sheets cut.*refined focus/);
    await roundTrip('moonlight-prospect-refined');
    result.checks.push('A future cast cut six sheets without debiting present essence. Cancellation preserved the cut, returning the Gu broke the anchor, and settling a fresh plan refined the living Gu.');
}
async function runTrayMove() {
    const stock = name => instant1(`moonlight_stock.${name}`);
    const trial = name => instant1(`move_trial.${name}`);
    const move = name => instant1(`tray_move.${name}`);
    const admit = name => p.locator(`[data-structured-extension='${id(name)}']`).click({noWaitAfter:true});
    const button = name => p.locator(`[data-structured-action='${id(`tray_move.${name}`)}']`);
    const view = p.locator('[data-gu="tray-move"]');
    const notes = s => JSON.parse(s.expansion.worlds[id('world')].facts[id('tray_move.notes')]);
    const roster = s => JSON.parse(s.expansion.worlds[id('world')].facts[id('moonlight_stock.roster')]);
    const reserve = s => sim(s).energies.player[id('primeval')].reserve;
    await instant1('take_moon');
    await admit('moonlight_trial'); await admit('moonlight_stock'); await admit('move_trial'); await admit('tray_move');
    await stock('survey'); await stock('borrow_second'); await trial('borrow_little_light');
    assert.match(await view.innerText(), /Second tray Gu · Little Light Gu · 8 sheets · 5 essence/);
    await move('write_tray_little');
    const before = await save();
    await move('cast_tray_move');
    const failed = await save();
    assert.equal(reserve(before) - reserve(failed), 5);
    assert.match(await view.innerText(), /8 of 10 sheets · the seal held/);
    assert.equal(await button('enter').isDisabled(), true);
    await stock('return_stock'); await stock('borrow_first'); await step(300); await open();
    assert.match(await view.innerText(), /First tray Gu · Little Light Gu · 10 sheets/);
    assert.match(await view.innerText(), /Written blade · Second tray Gu · the written Gu is away/);
    assert.equal(await button('cast_tray_move').isDisabled(), true);
    await roundTrip('tray-move-other-loan');
    assert.deepEqual(notes(await save()).plan, notes(before).plan);
    await stock('return_stock'); await stock('borrow_second');
    const original = roster(await save());
    await stock('tune_stock');
    const tuned = await save();
    assert.deepEqual(notes(tuned).plan, notes(before).plan);
    assert.deepEqual(roster(tuned).lifecycle.individuals['creature:2'].traits, original.lifecycle.individuals['creature:2'].traits);
    assert.equal(roster(tuned).adjustments['creature:2'], true);
    assert.match(await view.innerText(), /Second tray Gu · Little Light Gu · 10 sheets · 5 essence/);
    await roundTrip('tray-move-tuned');
    await move('cast_tray_move');
    assert.match(await view.innerText(), /10 sheets · the seal is open/);
    await move('enter');
    assert.equal(sim(await save()).people.player.location, id('tray_move.alcove'));
    await roundTrip('tray-move-alcove');
    result.checks.push('The exact written Gu improved after refinement. The stronger replacement loan could not take its place.');
}

async function runBladeChains() {
    const stock = name => instant1(`moonlight_stock.${name}`);
    const chain = name => instant1(`chain_research.${name}`);
    const view = p.locator('[data-gu="blade-chains"]');
    const enter = p.locator(`[data-structured-action="${id('chain_research.enter')}"]`);
    const reserve = s => sim(s).energies.player[id('primeval')].reserve;
    const notes = s => JSON.parse(s.expansion.worlds[id('world')].facts[id('chain_research.notes')]);
    await instant1('take_moon');
    for (const name of ['moonlight_trial', 'moonlight_stock', 'move_trial', 'tray_move', 'chain_research']) {
        await p.locator(`[data-structured-extension="${id(name)}"]`).click({noWaitAfter:true});
    }
    await stock('survey'); await stock('borrow_second');
    await chain('borrow_fork'); await chain('borrow_bend');
    await chain('research');
    assert.equal(notes(await save()).plans.length, 1);
    await chain('borrow_sweep'); await chain('research');
    const written = await save();
    assert.match(await view.innerText(), /Second tray Gu → Fork Light Gu.*5 essence/);
    assert.match(await view.innerText(), /Second tray Gu → Bend Light Gu → Sweep Light Gu.*6 essence/);
    assert.equal(notes(written).plans.length, 2);
    assert.equal(notes(written).plans[0].binding[0].id, notes(written).plans[1].binding[0].id);
    const original = await p.evaluate(()=>window.save_to_file());
    await stock('return_stock'); await stock('borrow_first');
    await chain('try_1');
    assert.equal(reserve(written) - reserve(await save()), 0);
    assert.match(await view.innerText(), /stopped at Second tray Gu/);
    await load(original);
    await chain('return_sweep'); await chain('try_2');
    assert.equal(reserve(written) - reserve(await save()), 5);
    assert.match(await view.innerText(), /stopped at Sweep Light Gu · 5 essence spent/);
    assert.equal(await enter.isDisabled(), true);
    await roundTrip('blade-chain-interrupted');
    await chain('borrow_sweep'); await step(240); await open();
    const retry = await save();
    await chain('try_2');
    assert.equal(reserve(retry) - reserve(await save()), 6);
    await chain('enter');
    assert.equal((await save())['current location'], id('chain_research.passage'));
    await roundTrip('blade-chain-swept');
    await load(original);
    await chain('try_1');
    assert.equal(reserve(written) - reserve(await save()), 5);
    await chain('enter');
    assert.equal((await save())['current location'], id('chain_research.passage'));
    await roundTrip('blade-chain-forked');
    result.checks.push('Both generated blade chains opened the same guard plate. A replacement core and a missing final loan interrupted different beats.');
}

async function runLightReaders() {
    const stock = name => instant1(`moonlight_stock.${name}`);
    const trial = name => instant1(`signal_trial.${name}`);
    const button = name => p.locator(`[data-structured-action="${id(`signal_trial.${name}`)}"]`);
    const report = p.locator('[data-gu="light-readers"]');
    const reserve = s => sim(s).energies.player[id('primeval')].reserve;
    await instant1('take_moon');
    for (const name of ['moonlight_trial', 'moonlight_stock', 'signal_trial']) {
        await p.locator(`[data-structured-extension="${id(name)}"]`).click({noWaitAfter:true});
    }
    await stock('survey'); await stock('borrow_second');
    const before = await save();
    const initial = await p.evaluate(()=>window.save_to_file());
    await trial('record');
    assert.equal(reserve(before) - reserve(await save()), 4);
    await stock('return_stock');
    const recordedReserve = reserve(await save());
    assert.equal(await button('echo').isDisabled(), true);
    await trial('replay');
    assert.equal(reserve(await save()), recordedReserve);
    assert.match(await report.innerText(), /Recorded light · the light door opened/);
    assert.equal(await button('enter_keeper').isDisabled(), true);
    await trial('enter_light');
    assert.equal((await save())['current location'], id('signal_trial.light_room'));
    await roundTrip('light-reader-recording');
    await load(initial);
    await trial('witness');
    assert.equal(reserve(before) - reserve(await save()), 4);
    await stock('return_stock');
    assert.equal(await button('replay').isDisabled(), true);
    await step(1); await trial('open_echo'); await step(30);
    assert.equal(await button('echo').isDisabled(), true);
    assert.match(await report.innerText(), /time seal expired/);
    await roundTrip('light-reader-expired');
    await trial('open_echo');
    const echoReserve = reserve(await save());
    await trial('echo');
    assert.equal(reserve(await save()), echoReserve);
    assert.match(await report.innerText(), /Borrowed blade · the light door opened/);
    assert.equal(await button('enter_keeper').isDisabled(), true);
    await trial('enter_light');
    assert.equal((await save())['current location'], id('signal_trial.light_room'));
    await roundTrip('light-reader-echo');
    await trial('back_light');
    await stock('borrow_first'); await step(480); await open();
    await trial('present');
    assert.equal(await button('enter_keeper').isDisabled(), true);
    await stock('return_stock'); await stock('borrow_second');
    const liveReserve = reserve(await save());
    await trial('present');
    assert.equal(liveReserve - reserve(await save()), 4);
    assert.match(await report.innerText(), /keeper’s door recognized you/);
    await stock('return_stock');
    assert.equal(await button('enter_keeper').isDisabled(), true);
    assert.equal(await button('enter_light').isEnabled(), true);
    await roundTrip('light-reader-authority-away');
    await stock('borrow_second'); await trial('enter_keeper');
    assert.equal((await save())['current location'], id('signal_trial.keeper_room'));
    await roundTrip('light-reader-keeper-room');
    result.checks.push('Separate past and recorded signals opened the same door. The other reader required a live cast from the marked specimen and its current custody.');
}

async function runMoonlightStock() {
    const admit=name=>p.locator(`[data-structured-extension="${id(name)}"]`).click();
    const act=name=>instant1(`moonlight_stock.${name}`);
    const tray=p.locator('[data-gu="moonlight-stock"]');
    const roster=async()=>JSON.parse((await save()).expansion.worlds[id('world')].facts[id('moonlight_stock.roster')]);
    assert.equal((await save()).expansion.simulation.seed,1);
    await instant1('take_moon');await admit('moonlight_trial');await admit('moonlight_stock');
    await act('survey');await act('borrow_first');await act('cast_stock');await act('return_stock');
    await act('borrow_second');await step(180);await act('cast_stock');
    assert.match(await tray.innerText(),/First Gu.*5 sheets/);
    assert.match(await tray.innerText(),/Second Gu.*4 sheets/);
    const initial=await roster();
    await act('tune_stock');await act('return_stock');
    await roundTrip('moonlight-stock-returned');
    await act('borrow_second');await step(240);await act('cast_stock');
    assert.match(await tray.innerText(),/Second Gu.*5 sheets.*refined focus/);
    const after=await roster();
    assert.deepEqual(Object.keys(after.lifecycle.individuals),Object.keys(initial.lifecycle.individuals));
    assert.deepEqual(Object.values(after.lifecycle.individuals).map(gu=>gu.traits),
        Object.values(initial.lifecycle.individuals).map(gu=>gu.traits));
    assert.deepEqual(Object.values(after.adjustments),[false,true]);
    await roundTrip('moonlight-stock-reborrowed');
    result.checks.push('Two generated specimens cut five and four sheets. Refinement added a sheet to the same second specimen after return, import and reborrow.');
}
async function runMoonlightTrial() {
    await instant1('take_moon');
    await p.locator(`[data-structured-extension='${id('moonlight_trial')}']`).click();
    const action=name=>instant1(`moonlight_trial.${name}`);
    const read=async()=>JSON.parse((await save()).expansion.worlds[id('world')].facts[id('moonlight_trial.specimens')]);
    const trial=p.locator('[data-gu="moonlight-trial"]');
    await action('borrow');
    const original=Object.keys((await read()).lifecycle.individuals)[0];
    await step(60);
    const essence=s=>sim(s).energies.player[id('primeval')].reserve;
    const before=essence(await save());
    await action('cast_clan');
    assert.equal(essence(await save()),before-4);
    await action('cast_loan');
    assert.equal(essence(await save()),before-8);
    assert.match(await trial.innerText(),/your Gu: 4 sheets cut.*loan Gu: 5 sheets cut/);
    await step(300);
    await action('tune');
    await action('return_loan');
    assert.match(await trial.innerText(),/back with the steward.*refined focus/);
    await roundTrip('moonlight-trial-returned');
    await action('borrow');
    await action('cast_loan');
    assert.match(await trial.innerText(),/your Gu: 4 sheets cut.*loan Gu: 6 sheets cut/);
    assert.deepEqual(Object.keys((await read()).lifecycle.individuals),[original]);
    await roundTrip('moonlight-trial-refined');
    result.checks.push('Equal essence yielded four versus five sheets. The same loan Gu cut six after refinement and reborrowing.');
}
async function runStargateSky() {
    const extension=name=>p.locator(`[data-structured-extension='${id(name)}']`).click();
    const command=name=>p.locator(`[data-structured-action='${id(name)}']`);
    const stock=s=>s.inventories.person.main_character[key('firefly_farm.starlight_firefly')]?.count??0;
    const sky=p.locator('[data-gu="stargate-sky"]');
    const waitTo=async (hour, minute=0)=>{
        const time=(await save())['current time'];
        await step((hour*60+minute-time.hour*60-time.minute+DAY)%DAY);
    };
    await extension('firefly_farm');
    await instant1('firefly_farm.start');
    await extension('stargate');
    await extension('stargate_sky');
    assert.equal(await command('stargate_sky.cross_out').isDisabled(),true);
    await act1('chores');await step(120);
    await instant1('firefly_farm.collect');
    assert.equal(stock(await save()),1);
    await waitTo(20,30);
    assert.match(await sky.innerText(),/Gu house dim.*hill lit/);
    assert.equal(await command('stargate_sky.cross_out').isDisabled(),true);
    await waitTo(21);
    await instant1('stargate_sky.cross_out');
    assert.equal((await save())['current location'],id('stargate.observatory'));
    assert.equal(stock(await save()),1);
    await roundTrip('stargate-sky-observatory');
    await instant1('stargate_sky.cross_back');
    await instant1('stargate_sky.cross_out');
    await waitTo(4);
    assert.equal(await command('stargate_sky.cross_back').isDisabled(),true);
    await instant1('stargate.cross_back');
    assert.equal((await save())['current location'],id('annex'));
    assert.equal(stock(await save()),0);
    await roundTrip('stargate-sky-returned');
    result.checks.push('Natural crossings preserved stock, both gates needed light, and the paid return worked at dawn.');
}
async function runMoonFusion() {
    const act=name=>instant1(`moon_fusion.${name}`);
    const view=p.locator('[data-gu="moon-fusion"]');
    const bench=async()=>JSON.parse((await save()).expansion.worlds[id('world')].facts[id('moon_fusion.bench')]);
    const finish=async()=>{await step(20);await act('finish');await act('take_dose');await act('cast');};
    await p.locator(`[data-structured-extension="${id('moon_fusion')}"]`).click();
    await act('setup');await act('research');
    assert.match(await view.innerText(),/Moonglow Gu.*force 3.*reach 1/);
    assert.match(await view.innerText(),/Moon Scar Gu.*force 1.*reach 2/);
    assert.match(await view.innerText(),/Etched Moon Gu.*force 1.*reach 1.5.*Groove Stone/);
    const written=await p.evaluate(()=>window.save_to_file());
    await act('start_1');await act('rush');
    assert.match(await view.innerText(),/Lost in fusion: Little Light Gu.*Surviving Gu injured/s);
    await roundTrip('moon-fusion-failed');
    await step(30);await act('recover');await act('replace');await act('research');await act('start_1');
    await roundTrip('moon-fusion-pending');
    await finish();
    assert.match(await view.innerText(),/Moonglow Gu.*test cut: force 3, reach 1/);
    assert.ok(Object.values((await bench()).world.gu.find(gu=>gu.rank===2).provenance.ingredients).includes('fusion-replacement-1'));
    await roundTrip('moon-fusion-moonglow');
    await load(written);await act('start_2');await finish();
    assert.match(await view.innerText(),/Moon Scar Gu.*test cut: force 1, reach 2/);
    await load(written);await act('start_3');await finish();
    assert.match(await view.innerText(),/Etched Moon Gu.*test cut: force 1, reach 1.5/);
    await roundTrip('moon-fusion-alternate');
    result.checks.push('Both source branches and the authored substitution cast at their own force and reach. The failed fusion kept the loss and the retry bound a new Little Light Gu.');
}
async function runMoonFusionTime() {
    const act=name=>instant1(`moon_fusion.${name}`);
    const time=name=>instant1(`moon_fusion_time.${name}`);
    const admit=async name=>{await open();await p.locator(`[data-structured-extension="${id(name)}"]`).click();};
    const cage=p.locator('[data-gu="fusion-cage"]');
    const cut=p.locator(`[data-structured-action="${id('moon_fusion_time.cut_latch')}"]`);
    const bench=async()=>JSON.parse((await save()).expansion.worlds[id('world')].facts[id('moon_fusion.bench')]);
    const rescued='fusion-rescued-light';
    await act1('chores');await step(120);
    await admit('moon_fusion');await act('setup');await act('research');
    await admit('moon_fusion_time');
    await act('start_2');await time('open_seal');await time('cut_latch');
    assert.match(await cage.innerText(),/force 1.*latch held/);
    assert.equal(await cut.isDisabled(),true);
    await time('cancel_fusion');
    await act('research');await act('start_1');await time('open_seal');
    await roundTrip('fusion-time-open');
    const openSealSave=await p.evaluate(()=>window.save_to_file());
    await step(10);assert.equal(await cut.isDisabled(),true);
    await load(openSealSave);
    const before=await save();
    await time('cut_latch');
    const pending=await bench();
    const after=await save();
    assert.deepEqual(after.inventories,before.inventories);
    assert.deepEqual(sim(after).energies,sim(before).energies);
    assert.equal(pending.world.gu.some(gu=>gu.rank===2),false);
    assert.equal(pending.world.gu.find(gu=>gu.id===rescued).alive,true);
    assert.match(await cage.innerText(),/sheltered with the steward/);
    await p.locator('[data-gu="moon-fusion"]').screenshot({path:path.join(out,'fusion-time-rescued.png')});
    await roundTrip('fusion-time-rescued');
    const afterCut=await p.evaluate(()=>window.save_to_file());
    await time('cancel_fusion');
    assert.equal(await cut.isDisabled(),true);
    assert.ok((await bench()).world.gu.every(gu=>gu.alive && gu.rank===1));
    await roundTrip('fusion-time-cancelled');
    await act('research');await act('start_1');await act('rush');
    await step(30);await act('recover');await time('bring_rescued');
    await act('research');await act('start_1');await step(20);await act('finish');
    assert.ok(Object.values((await bench()).world.gu.find(gu=>gu.rank===2).provenance.ingredients).includes(rescued));
    assert.match(await cage.innerText(),/became part of the fused Gu/);
    await roundTrip('fusion-time-recovered');
    await load(afterCut);
    await step(20);await act('finish');
    const completed=await bench();
    assert.equal(completed.world.gu.find(gu=>gu.id===rescued).alive,true);
    assert.equal(completed.world.gu.find(gu=>gu.rank===2).kind,'moonglow');
    result.checks.push('The weak future cut could not free the Gu. The stronger forecast did, and the rescue survived either cancellation or completion. A later real fusion used the rescued individual.');
    if(process.argv[5]) {
        const serialized=await readFile(process.argv[5],'utf8');
        await load(encodeSaveFile(serialized));
        assert.deepEqual(digest(await save()),digest(JSON.parse(serialized)));
        await admit('moon_fusion_time');await time('open_seal');await time('cut_latch');
        assert.match(await cage.innerText(),/sheltered with the steward/);
        result.checks.push('An exact earlier pending-fusion save imported and supplied the new seal with the original job.');
    }
}
async function runMoonFusionVital() {
    const act=name=>instant1(`moon_fusion.${name}`);
    const vital=name=>instant1(`moon_fusion_vital.${name}`);
    const admit=async name=>{await open();await p.locator(`[data-structured-extension="${id(name)}"]`).click();};
    const view=p.locator('[data-gu="moon-fusion"]');
    const bond=view.locator('[data-gu="fusion-vital"]');
    const bench=async()=>JSON.parse((await save()).expansion.worlds[id('world')].facts[id('moon_fusion.bench')]);
    const recover=async()=>{await step(30);await act('recover');};
    await admit('moon_fusion');await act('setup');await act('research');await admit('moon_fusion_vital');
    await act('start_1');await act('rush');
    let state=await bench();
    const ordinary=state.world.attempts.at(-1).ingredients.lightB;
    assert.equal(state.world.gu.find(gu=>gu.id===ordinary).fate,'destroyed');
    await recover();await vital('borrow_vital');
    assert.match(await bond.innerText(),/Little Light Gu.*rank 1.*ready.*on your bench/);
    await act('research');await act('start_1');
    await roundTrip('vital-fusion-pending');
    await act('rush');
    state=await bench();
    const attempt=state.world.attempts.at(-1);
    const protectedId=attempt.ingredients.lightB;
    assert.notEqual(protectedId,ordinary);
    assert.deepEqual(attempt.vitalSurvivors,[protectedId]);
    assert.deepEqual(state.world.gu.find(gu=>gu.id===protectedId),{
        id:protectedId,kind:'little-light',rank:1,holder:'player',alive:true,vitalMaster:id('steward'),injured:true,
    });
    assert.match(await bond.innerText(),/injured.*on your bench/);
    await view.screenshot({path:path.join(out,'vital-fusion-injured.png')});
    await roundTrip('vital-fusion-injured');
    await recover();
    assert.match(await bond.innerText(),/ready.*on your bench/);
    await act('research');await act('start_1');await step(20);await act('finish');
    state=await bench();
    const product=state.world.gu.find(gu=>gu.alive&&gu.vitalMaster===id('steward'));
    assert.equal(product.kind,'moonglow');
    assert.equal(product.provenance.ingredients.lightB,protectedId);
    assert.equal(state.world.gu.find(gu=>gu.id===protectedId).vitalMaster,undefined);
    await act('take_dose');await act('cast');
    await vital('return_vital');
    assert.match(await bond.innerText(),/Moonglow Gu.*rank 2.*with the steward/);
    await roundTrip('vital-fusion-returned');
    await vital('borrow_vital');
    assert.equal((await bench()).world.gu.find(gu=>gu.alive&&gu.vitalMaster===id('steward')).id,product.id);
    result.checks.push('The same fatal recipe slot destroyed the ordinary Gu and injured the steward’s Vital Gu. The survivor recovered, its bond followed Moonglow, and the same product could be returned and reborrowed.');
}
async function runScreenResearch() {
    const act=name=>instant1(`screen_research.${name}`);
    const admit=name=>p.locator(`[data-structured-extension="${id(name)}"]`).click();
    const research=p.locator('[data-gu="screen-research"]');
    const enter=p.locator(`[data-structured-action="${id('screen_research.enter')}"]`);
    await instant1('take_moon');
    for(let i=0;i<3;i++){await act1('chores');await step(120);}
    await instant1('take_jade');
    await admit('move_trial');await admit('beam_procedure');await admit('screen_research');
    await instant1('beam_procedure.borrow_light');await act('research');
    assert.match(await research.innerText(),/cannot move that part of the screen/);
    await instant1('beam_procedure.borrow_heavy');await act('research');
    assert.match(await research.innerText(),/Cut the cord with Moonblade.*4 essence/);
    assert.match(await research.innerText(),/Lower the counterweight.*7 essence/);
    assert.match(await research.innerText(),/needs a Gu that can lift the iron runner/);
    await roundTrip('screen-research-written');
    const written=await p.evaluate(()=>window.save_to_file());
    await act('try_1');
    assert.match(await research.innerText(),/cord is cut.*screen opens/);
    await act('enter');await act('salvage');
    assert.equal((await save()).inventories.person.main_character[key('petals')].count,12);
    await roundTrip('screen-research-cord');
    await load(written);
    await instant1('beam_procedure.return_heavy');await act('try_2');
    assert.match(await research.innerText(),/screen stayed shut.*1 essence spent/);
    assert.equal(await enter.isDisabled(),true);
    await instant1('beam_procedure.borrow_heavy');await act('try_2');
    assert.match(await research.innerText(),/counterweight is lowered.*screen opens/);
    await act('enter');await act('salvage');
    assert.equal((await save()).inventories.person.main_character[key('petals')].count,12);
    await roundTrip('screen-research-counterweight');
    result.checks.push('The same target and native shelf were reachable by either method. A lighter catch failed the load requirement, and the iron runner lacked a suitable Gu.');
}
async function runFightingSpirit() {
    const act=name=>instant1(`fighting_spirit.${name}`);
    const view=p.locator('[data-gu="fighting-spirit"]');
    const bead=async()=> (await save()).inventories.person.main_character[key('fighting_spirit.red_date')]?.count??0;
    const state=async()=>JSON.parse((await save()).expansion.worlds[id('world')].facts[id('fighting_spirit.encounter')]).world.gu;
    await p.locator(`[data-structured-extension="${id('fighting_spirit')}"]`).click();
    await act('borrow');await act('prepare');await act('buy_supports');await act('buy_beads');
    const original=(await state()).map(gu=>gu.id);
    await act('abort');
    assert.equal(await bead(),3);
    assert.match(await view.innerText(),/2 living supports.*mind steady.*soul steady.*stopped before charging/);
    await roundTrip('fighting-spirit-aborted');
    await act('rush');
    assert.equal(await bead(),0);
    assert.match(await view.innerText(),/0 living supports.*mind injured.*soul injured.*backlash destroyed/);
    assert.deepEqual((await state()).filter(gu=>!gu.alive).map(gu=>gu.id),original.slice(1));
    await roundTrip('fighting-spirit-backlash');
    await act1('chores');await step(120);
    await act('buy_supports');await act('buy_beads');
    await act1('fighting_spirit.recover_mind');
    await roundTrip('fighting-spirit-recovering');
    await step(30);
    assert.match(await view.innerText(),/mind steady.*soul injured/);
    assert.equal(await p.locator(`[data-structured-action="${id('fighting_spirit.steady')}"]`).isDisabled(),true);
    await act1('fighting_spirit.recover_soul');await step(60);
    await act('steady');await act('supplies');
    assert.equal((await state()).find(gu=>gu.kind==='fight').id,original[0]);
    assert.equal((await save()).inventories.person.main_character[key('petals')].count,12);
    assert.match(await view.innerText(),/2 living supports.*steward resumed practice/);
    await roundTrip('fighting-spirit-retried');
    result.checks.push('An early abort preserved the supports and stored beads. Late backlash destroyed the original supports, and separate mind and soul recovery enabled a successful retry.');
}
async function runBeamProcedure() {
    const act=name=>instant1(`beam_procedure.${name}`);
    const view=p.locator('[data-gu="beam-procedure"]');
    const button=name=>p.locator(`[data-structured-action="${id(`beam_procedure.${name}`)}"]`);
    const essence=async()=>sim(await save()).energies.player[id('primeval')].reserve;
    await instant1('take_moon');
    for(let i=0;i<3;i++){await act1('chores');await step(120);}
    await instant1('take_jade');
    await p.locator(`[data-structured-extension="${id('beam_procedure')}"]`).click();
    await act('borrow_light');await act('borrow_heavy');await act('research');
    assert.match(await view.innerText(),/Silk Catch Gu together.*6 essence/);
    assert.match(await view.innerText(),/Woven Catch Gu together.*7 essence/);
    await roundTrip('three-core-written');
    await act('return_heavy');
    const before=await essence();
    await act('try_2');
    assert.equal(await essence(),before-1);
    assert.match(await view.innerText(),/The move stopped.*1 essence spent/);
    assert.equal(await button('enter').isDisabled(),true);
    await roundTrip('three-core-interrupted');
    await act('try_1');await act('enter');
    assert.equal(await button('salvage').isDisabled(),true);
    await act('back');await step(360);
    await act('borrow_heavy');await act('try_2');await act('enter');await act('salvage');
    assert.match(await view.innerText(),/beam and heavy shelf are lowered/);
    assert.equal((await save()).inventories.person.main_character[key('petals')].count,12);
    await roundTrip('three-core-shelf');
    result.checks.push('The two generated bindings used different catch Gu and opened different access. A lost Gu interrupted the synchronized beat while retaining the earlier charge.');
}
async function runGiantHandVariants() {
    const hand = name => instant1(`giant_hand.${name}`);
    const variant = name => instant1(`giant_hand_variants.${name}`);
    const button = name => p.locator(`[data-structured-action='${id(`giant_hand_variants.${name}`)}']`);
    const admit = name => p.locator(`[data-structured-extension='${id(name)}']`).click({noWaitAfter:true});
    const line = p.locator('[data-gu="giant-hand-variants"]');
    const beads = s => s.inventories.person.main_character[key('giant_hand.red_date')]?.count ?? 0;
    const reserve = s => sim(s).energies.player[id('primeval')].reserve;
    const notes = s => JSON.parse(s.expansion.worlds[id('world')].facts[id('giant_hand_variants.notes')]);
    await admit('giant_hand'); await hand('enter');
    await hand('buy_red'); await hand('buy_red'); await hand('buy_materials');
    await hand('borrow_older'); await hand('prepare_phantoms'); await hand('borrow_group');
    await step(10); await hand('release_phantoms'); await hand('prepare_myriad');
    await step(20); await hand('finish_myriad'); await admit('giant_hand_variants');
    await variant('write_plain');
    assert.match(await line.innerText(), /first \+ second · force 4 · 2 essence/);
    const before = await save();
    await variant('cast_written');
    const short = await save();
    assert.equal(beads(before) - beads(short), 1);
    assert.equal(reserve(before) - reserve(short), 2);
    assert.match(await line.innerText(), /braced slab withstood/);
    assert.equal(await button('cross').isDisabled(), true);
    await variant('borrow_focused');
    assert.match(await line.innerText(), /first \+ focused · force 5 · 3 essence/);
    assert.match(await line.innerText(), /second \+ focused · force 5 · 3 essence/);
    await variant('write_focused_second');
    const binding = notes(await save()).binding;
    assert.ok(Object.values(binding).some(row => row.id === id('giant_hand.group_two')));
    assert.ok(Object.values(binding).some(row => row.id === id('giant_hand_variants.focused')));
    await variant('return_focused');
    assert.match(await line.innerText(), /a Gu from this plan is away/);
    assert.equal(await button('cast_written').isDisabled(), true);
    assert.equal(await button('write_plain').isEnabled(), true);
    await roundTrip('giant-hand-variants-unavailable');
    assert.deepEqual(notes(await save()).binding, binding);
    await variant('borrow_focused');
    await hand('return_group');
    assert.equal(await button('cast_written').isDisabled(), true);
    assert.equal(await button('write_focused_second').isDisabled(), true);
    await hand('borrow_group');
    assert.equal(await button('cast_written').isEnabled(), true);
    await roundTrip('giant-hand-variants-ready');
    const ready = await save();
    await variant('cast_written');
    const opened = await save();
    assert.deepEqual(notes(opened).binding, binding);
    assert.equal(beads(ready) - beads(opened), 1);
    assert.equal(reserve(ready) - reserve(opened), 3);
    assert.match(await line.innerText(), /covered path is open/);
    await variant('cross');
    assert.equal(sim(await save()).people.player.location, id('giant_hand_variants.covered_path'));
    await roundTrip('giant-hand-variants-crossed');
    result.checks.push('Three distinct pairs appeared. A saved pair stopped when a Gu went away, refused a single remaining specimen, and reopened after the exact loans returned.');
}

async function runGiantHandWard() {
    const hand = name => instant1(`giant_hand.${name}`);
    const ward = name => instant1(`giant_hand_ward.${name}`);
    const button = name => p.locator(`[data-structured-action='${id(`giant_hand_ward.${name}`)}']`);
    const admit = name => p.locator(`[data-structured-extension='${id(name)}']`).click({noWaitAfter:true});
    const line = p.locator('[data-gu="giant-hand-ward"]');
    const beads = s => s.inventories.person.main_character[key('giant_hand.red_date')]?.count ?? 0;
    const reserve = s => sim(s).energies.player[id('primeval')].reserve;
    await admit('giant_hand'); await hand('enter');
    await hand('buy_red'); await hand('buy_red'); await hand('buy_materials');
    await hand('borrow_older'); await hand('prepare_phantoms'); await hand('borrow_group');
    await step(10); await hand('release_phantoms'); await hand('prepare_myriad');
    await step(20); await hand('finish_myriad');
    await hand('return_older'); await admit('giant_hand_ward');
    assert.match(await line.innerText(), /force 4 of 6 needed.*the ward holds/);
    assert.equal(await button('ward_self').isDisabled(), true);
    const before = await save();
    await ward('ward_plain');
    const held = await save();
    assert.equal(beads(before) - beads(held), 1);
    assert.equal(reserve(before) - reserve(held), 2);
    assert.equal(await button('cross').isDisabled(), true);
    assert.match(await line.innerText(), /ward held against the last strike/);
    await roundTrip('giant-hand-ward-held');
    await hand('borrow_older');
    assert.match(await line.innerText(), /Self Strength · force 6 of 6 needed.*breaks the ward/);
    await hand('return_group');
    assert.equal(await button('ward_self').isDisabled(), true);
    await hand('borrow_group');
    await roundTrip('giant-hand-ward-ready');
    const ready = await save();
    await ward('ward_self');
    const broken = await save();
    assert.equal(beads(ready) - beads(broken), 2);
    assert.equal(reserve(ready) - reserve(broken), 2);
    assert.match(await line.innerText(), /reinforced hand broke the ward/);
    await ward('cross');
    assert.equal(sim(await save()).people.player.location, id('giant_hand_ward.far_path'));
    await roundTrip('giant-hand-ward-crossed');
    result.checks.push('Search changed with exact loans. Force four paid for a real failure. Force six opened a new crossing.');
}

async function runGiantHand() {
    const hand = name => instant1(`giant_hand.${name}`);
    const button = name => p.locator(`[data-structured-action='${id(`giant_hand.${name}`)}']`);
    const line = p.locator('[data-gu="giant-hand"]');
    const beads = s => s.inventories.person.main_character[key('giant_hand.red_date')]?.count ?? 0;
    const reserve = s => sim(s).energies.player[id('primeval')].reserve;
    const practice = s => JSON.parse(s.expansion.worlds[id('world')].facts[id('giant_hand.practice')]);
    await p.locator(`[data-structured-extension='${id('giant_hand')}']`).click({noWaitAfter:true});
    await hand('enter'); await hand('buy_red'); await hand('buy_red'); await hand('buy_materials');
    await hand('borrow_older');
    assert.equal(await button('prepare_phantoms').isEnabled(), true);
    const before = await save();
    await hand('prepare_phantoms');
    const held = await save();
    assert.equal(beads(before) - beads(held), 2);
    assert.equal(reserve(before) - reserve(held), 1);
    assert.equal(await button('release_phantoms').isDisabled(), true);
    await roundTrip('giant-hand-preparing');
    const fork = await p.evaluate(() => window.save_to_file());
    await hand('borrow_group'); await step(40); await hand('release_phantoms');
    assert.match(await line.innerText(), /prepared phantoms had faded/);
    assert.equal(await button('cross').isDisabled(), true);
    assert.equal(reserve(await save()), reserve(held));
    await load(fork); await hand('borrow_group'); await step(10); await hand('return_group'); await hand('release_phantoms');
    assert.match(await line.innerText(), /Group Strength was away/);
    assert.equal(await button('cross').isDisabled(), true);
    await load(fork); await hand('borrow_group'); await step(10); await hand('release_phantoms');
    assert.match(await line.innerText(), /prepared Giant Hand broke the slab/);
    assert.equal(reserve(held) - reserve(await save()), 2);
    await hand('cross');
    assert.equal(sim(await save()).people.player.location, id('giant_hand.far_bank'));
    await hand('return_yard'); await hand('reset_slab');
    assert.equal(await button('cross').isDisabled(), true);
    await hand('prepare_myriad'); await roundTrip('giant-hand-refining');
    await step(20); await hand('finish_myriad');
    assert.equal(practice(await save()).world.gu[0].uniqueKey, 'myriad-self');
    assert.equal(practice(await save()).world.gu[0].rank, 7);
    await hand('return_older'); await hand('return_group');
    assert.equal(await button('cast_giant_hand').isDisabled(), true);
    await hand('borrow_group');
    const ready = await save();
    await roundTrip('giant-hand-revised-ready');
    await hand('cast_giant_hand');
    const after = await save();
    assert.equal(beads(ready) - beads(after), 1);
    assert.equal(reserve(ready) - reserve(after), 2);
    assert.equal(practice(after).held, null);
    assert.match(await line.innerText(), /revised Giant Hand broke the slab/);
    await hand('cross'); await roundTrip('giant-hand-crossed');
    result.checks.push('The two procedures opened the same resettable target. The older stock expired or missed its support; the revised cast used rank-seven Myriad Self with the older core returned.');
}

async function runBeamLink() {
    const act = name => instant1(`beam_procedure.${name}`);
    const make = name => instant1(`beam_condensation.${name}`);
    const link = name => instant1(`beam_link.${name}`);
    const admit = name => p.locator(`[data-structured-extension='${id(name)}']`).click({noWaitAfter:true});
    const button = (pack, name) => p.locator(`[data-structured-action='${id(`${pack}.${name}`)}']`);
    const line = p.locator('[data-gu="beam-link"]');
    const reserve = async () => sim(await save()).energies.player[id('primeval')].reserve;
    const petals = async () => (await save()).inventories.person.main_character[key('petals')]?.count ?? 0;
    await instant1('take_moon');
    for(let job = 0; job < 4; job++) { await act1('chores'); await step(120); }
    await instant1('take_jade'); await admit('beam_procedure');
    await act('borrow_light'); await act('borrow_heavy'); await act('research'); await act('try_1');
    await admit('beam_condensation'); await make('prepare_beam_gu'); await step(15); await make('finish_beam_gu');
    await admit('beam_link');
    await step(420);
    const before = await reserve();
    const beforePrime = await p.evaluate(() => window.save_to_file());
    await link('prime_shelf');
    assert.equal(await reserve(), before - 2);
    assert.match(await line.innerText(), /Beam Catch is holding the shelf/);
    await roundTrip('beam-link-primed');
    const fork = await p.evaluate(() => window.save_to_file());
    await act('return_heavy');
    const afterStart = await reserve();
    await link('catch_shelf');
    assert.equal(await reserve(), afterStart);
    assert.match(await line.innerText(), /Woven Catch was away/);
    await act('enter'); assert.equal(await button('beam_procedure', 'salvage').isDisabled(), true); await act('back');
    await load(fork); await step(10); await open();
    assert.match(await line.innerText(), /hold has faded/);
    const expired = await reserve();
    await link('catch_shelf');
    assert.equal(await reserve(), expired);
    assert.match(await line.innerText(), /hold had faded/);
    await load(fork);
    await link('catch_shelf');
    assert.equal(await reserve(), before - 4);
    assert.match(await line.innerText(), /Woven Catch took the weight/);
    await roundTrip('beam-link-complete');
    await act('enter');
    const reward = await petals();
    await act('salvage'); assert.equal(await petals(), reward + 4);
    await roundTrip('beam-link-shelf');
    await load(beforePrime); await act('try_2');
    assert.equal(await reserve(), before - 7);
    await act('enter'); assert.equal(await button('beam_procedure', 'salvage').isEnabled(), true);
    result.checks.push('The same held effect supported timely completion, refusal after a loan return and expiry. The older move still opened the same shelf.');
}

async function runBeamCondensation() {
    const act = name => instant1(`beam_procedure.${name}`);
    const make = name => instant1(`beam_condensation.${name}`);
    const admit = name => p.locator(`[data-structured-extension='${id(name)}']`).click();
    const button = (pack, name) => p.locator(`[data-structured-action='${id(`${pack}.${name}`)}']`);
    const line = p.locator('[data-gu="beam-condensation"]');
    const work = s => JSON.parse(s.expansion.worlds[id('world')].facts[id('beam_condensation.work')]);
    const essence = s => sim(s).energies.player[id('primeval')].reserve;
    const petals = s => s.inventories.person.main_character[key('petals')]?.count ?? 0;
    await instant1('take_moon');
    for(let job = 0; job < 5; job++) { await act1('chores'); await step(120); }
    await instant1('take_jade'); await admit('beam_procedure');
    await act('borrow_light'); await act('borrow_heavy'); await act('research');
    assert.equal(await p.locator(`[data-structured-extension='${id('beam_condensation')}']`).isDisabled(), true);
    const rehearsal = await save();
    await act('try_1');
    assert.equal(essence(rehearsal) - essence(await save()), 6);
    await admit('beam_condensation');
    const before = await save();
    await make('prepare_beam_gu');
    const first = work(await save()).world.attempts[0].id;
    assert.equal(await button('beam_condensation', 'finish_beam_gu').isDisabled(), true);
    await roundTrip('beam-condensation-pending');
    await make('cancel_beam_gu');
    assert.equal(petals(before) - petals(await save()), 2);
    assert.equal(stones(before) - stones(await save()), 1);
    assert.match(await line.innerText(), /materials spent/);
    await make('prepare_beam_gu');
    assert.notEqual(work(await save()).world.attempts[0].id, first);
    assert.equal(petals(before) - petals(await save()), 4);
    assert.equal(stones(before) - stones(await save()), 2);
    await step(15); await make('finish_beam_gu');
    const formed = await save();
    assert.equal(work(formed).world.gu[0].provenance.recipe, 'beam-catch-condensation');
    assert.match(await line.innerText(), /2 essence to use.*practiced move used 6 essence/);
    await roundTrip('beam-condensation-ready');
    await make('use_beam_gu'); await make('enter');
    assert.equal(essence(formed) - essence(await save()), 2);
    assert.equal(sim(await save()).people.player.location, id('beam_condensation.passage'));
    await roundTrip('beam-condensation-passage');
    await make('back');
    const shelf = await save();
    await make('test_heavy_gu');
    assert.equal(essence(shelf) - essence(await save()), 2);
    assert.match(await line.innerText(), /could not lower the heavy shelf/);
    await act('enter');
    assert.equal(await button('beam_procedure', 'salvage').isDisabled(), true);
    await act('back'); await step(360);
    const heavy = await save();
    await act('try_2');
    assert.equal(essence(heavy) - essence(await save()), 7);
    await act('enter'); await act('salvage');
    assert.equal(petals(await save()), petals(heavy) + 4);
    await roundTrip('beam-condensation-heavy-original');
    result.checks.push('The practiced move produced a cheaper Gu with lower capacity. The original Woven Catch binding still lowered the shelf.');
}
async function runBeamRecord() {
    const practice = op=>instant1(`beam_procedure.${op}`);
    const record = op=>instant1(`beam_record.${op}`);
    const condensed = op=>instant1(`beam_condensation.${op}`);
    const admit = name=>p.locator(`[data-structured-extension="${id(name)}"]`).click();
    const button = op=>p.locator(`[data-structured-action="${id(`beam_record.${op}`)}"]`);
    const view = p.locator('[data-gu="beam-record"]');
    const reserve = s=>sim(s).energies.player[id('primeval')].reserve;
    const read = (s, name)=>JSON.parse(s.expansion.worlds[id('world')].facts[id(name)]);
    const archive = s=>read(s,'beam_record.copy');
    await instant1('take_moon');
    for (let i=0;i<4;i++) {await act1('chores'); await step(120);}
    await instant1('take_jade'); await admit('beam_procedure'); await admit('beam_record');
    assert.equal(await button('copy_beam').isDisabled(),true);
    await practice('borrow_light'); await practice('borrow_heavy'); await practice('research'); await practice('try_1');
    await record('copy_beam');
    const source = archive(await save());
    assert.equal(source.binding.catch.id,'light');
    assert.equal(source.attempt.operation,'try_1');
    await practice('return_light'); await step(240); await practice('research');
    const revised = await save();
    assert.equal(read(revised,'beam_procedure.notes').last,null);
    assert.equal(read(revised,'beam_procedure.notes').plans[0].catch.id,'heavy');
    assert.deepEqual(archive(revised),source);
    await roundTrip('beam-record-after-rewrite');
    await record('replay_beam');
    const stopped = await save();
    assert.equal(reserve(revised)-reserve(stopped),1);
    assert.equal(archive(stopped).last.outcome,'interrupted');
    assert.match(await view.innerText(),/stopped before lowering/);
    assert.equal(await button('enter').isDisabled(),true);
    await roundTrip('beam-record-support-away');
    await admit('beam_condensation'); await condensed('prepare_beam_gu'); await step(15); await condensed('finish_beam_gu');
    assert.deepEqual(read(await save(),'beam_condensation.work').source,source.witness);
    await condensed('use_beam_gu');
    assert.equal(read(await save(),'beam_condensation.work').passage,true);
    await practice('borrow_light'); await step(180);
    const beforeHeavy = await save();
    await record('replay_beam');
    const heavy = await save();
    assert.equal(reserve(beforeHeavy)-reserve(heavy),6);
    assert.deepEqual(archive(heavy).last,{outcome:'too-light',spent:6,target:2});
    assert.equal(await button('enter').isDisabled(),true);
    await record('remove_weight'); await step(360);
    assert.match(await view.innerText(),/gate load: light/);
    const beforeLight = await save();
    await record('replay_beam');
    assert.equal(reserve(beforeLight)-reserve(await save()),6);
    assert.deepEqual(archive(await save()).attempt,source.attempt);
    await record('enter');
    assert.equal((await save())['current location'],id('beam_record.gate'));
    await roundTrip('beam-record-side-passage');
    result.checks.push('The same demonstration survived rewritten research, supplied a living Gu and opened a later gate only with its exact support and enough capacity.');
}
async function runAntNest() {
    const act=name=>instant1(`ant_nest.${name}`);
    const stock=async name=>(await save()).inventories.person.main_character[key(`ant_nest.${name}`)]?.count??0;
    const tray=p.locator('[data-gu="ant-nest"]');
    const clear=p.locator(`[data-structured-action="${id('ant_nest.clear')}"]`);
    await p.locator(`[data-structured-extension="${id('ant_nest')}"]`).click();
    await act('borrow');await act('buy_inputs');await act('seed');
    assert.equal(await stock('dose'),0);
    assert.equal(await stock('substrate'),0);
    assert.match(await tray.innerText(),/1 queen.*2 workers.*0 soldiers/);
    await act('return_loan');await act('buy_rations');
    await act1('ant_nest.brood');
    await step(15);
    assert.match(await tray.innerText(),/0 soldiers.*with the steward.*brood due in 25 min/);
    await roundTrip('ant-nest-brood-pending');
    await step(25);
    assert.match(await tray.innerText(),/1 queen.*3 workers.*1 soldier\b/);
    assert.equal(await clear.isDisabled(),true);
    await act1('ant_nest.brood');await step(40);
    assert.match(await tray.innerText(),/1 queen.*4 workers.*2 soldiers/);
    assert.equal(await stock('ration'),0);
    await act('clear');
    assert.equal((await save())['current location'],id('ant_nest.niche'));
    assert.match(await tray.innerText(),/1 soldier\b.*storeroom niche clear/);
    await act('salvage');
    assert.equal((await save()).inventories.person.main_character[key('petals')].count,12);
    await roundTrip('ant-nest-storeroom-cleared');
    await act('back');await act('enter');
    assert.equal((await save())['current location'],id('ant_nest.niche'));
    result.checks.push('The queen raised two broods with the Gu back at the steward. Actual soldiers opened the niche and incurred the disclosed casualty.');
}
async function runAttitudeGu() {
    const act=name=>instant1(`attitude_trial.${name}`);
    const button=name=>p.locator(`[data-structured-action="${id(`attitude_trial.${name}`)}"]`);
    const mask=p.locator('[data-gu="attitude-gu"]');
    const essence=async()=>sim(await save()).energies.player[id('primeval')].reserve;
    await p.locator(`[data-structured-extension="${id('attitude_trial')}"]`).click();
    await act('borrow');await act('ask');
    assert.match(await mask.innerText(),/steward was wary/);
    assert.equal(await button('wear').isDisabled(),true);
    await act('center');
    const before=await essence();
    await act('wear');await act('ask');
    assert.equal(await essence(),before);
    assert.match(await mask.innerText(),/0 mental energy.*steward was reassured.*practice petals set aside/);
    assert.equal(await button('collect').isDisabled(),true);
    await roundTrip('attitude-gu-active');
    await act1('attitude_trial.recover');
    await roundTrip('attitude-gu-resting');
    await step(30);
    assert.match(await mask.innerText(),/2 mental energy/);
    await act('ask');
    assert.match(await mask.innerText(),/steward was wary.*practice petals set aside/);
    await instant1('take_moon');await act('collect');
    assert.equal((await save()).inventories.person.main_character[key('petals')].count,12);
    await act('wear');await act('return_loan');
    assert.match(await mask.innerText(),/with the steward.*0 mental energy.*practice petals collected/);
    assert.equal((await mask.innerText()).includes('composed demeanor'),false);
    await roundTrip('attitude-gu-petals-collected');
    result.checks.push('Mental energy paid for an observer response. The steward kept the independent ledger check, and rest restored the reserve.');
}
async function runFixedForge() {
    const admit=async name=>{await open();await p.locator(`[data-structured-extension="${id(name)}"]`).click();};
    const travel=name=>instant1(`fixed_immortal_travel.${name}`);
    const forge=name=>instant1(`fixed_forge.${name}`);
    const claim=async()=>JSON.parse((await save()).expansion.worlds[id('world')].facts[id('fixed_immortal_travel.claim')]);
    const travelView=p.locator('[data-gu="fixed-immortal-travel"]');
    const forgeView=p.locator('[data-gu="fixed-forge"]');
    const chore=async()=>{await act1('chores');await step(120);};
    if(process.argv[5]) {
        const serialized=await readFile(process.argv[5],'utf8');
        const earlier=JSON.parse(serialized);
        await load(encodeSaveFile(serialized));
        assert.deepEqual(digest(await save()),digest(earlier));
        assert.match(await travelView.innerText(),/rank 6.*with the steward/);
        result.checks.push('An exact loan save from the earlier build imported on the rebuilt route.');
        await travel('borrow');
    } else {
        await admit('firefly_farm');await instant1('firefly_farm.start');await admit('stargate');await admit('fixed_immortal_travel');
        await travel('borrow');await travel('remember_annex');await travel('buy_dose');
        await chore();await instant1('firefly_farm.collect');await instant1('stargate.cross_out');await travel('remember_hill');
        await act1('stargate.walk_back');await step(60);
    }
    while(stones(await save())<3) await chore();
    const original=(await claim()).gu.find(gu=>gu.alive).id;
    await admit('fixed_forge');await forge('commission');await forge('raise');
    assert.equal((await claim()).gu.find(gu=>gu.alive).id,original);
    assert.match(await travelView.innerText(),/rank 7.*in your care/);
    await roundTrip('fixed-forge-rival-pending');
    await forge('buy_dose');await forge('travel_out');
    assert.equal((await save())['current location'],id('stargate.observatory'));
    await act1('stargate.walk_back');await step(60);await forge('settle');
    assert.match(await forgeView.innerText(),/distant rank-six refinement failed/);
    assert.equal((await claim()).gu.length,1);
    await chore();await forge('commission');await forge('destroy');
    assert.match(await travelView.innerText(),/no living specimen here/);
    await roundTrip('fixed-forge-vacant');
    await step(30);await forge('settle');await travel('borrow');
    const replacement=(await claim()).gu.find(gu=>gu.alive);
    assert.equal(replacement.rank,6);
    assert.notEqual(replacement.id,original);
    await travel('travel_out');
    assert.equal((await save())['current location'],id('stargate.observatory'));
    await roundTrip('fixed-forge-replacement-crossing');
    result.checks.push('A rank-six attempt failed while the same raised rank-seven specimen was travelling. After its destruction the new rank-six specimen could use the original loan route.');
}
async function runGuRestoration() {
    const admit=async name=>{await open();await p.locator(`[data-structured-extension="${id(name)}"]`).click();};
    const travel=name=>instant1(`fixed_immortal_travel.${name}`);
    const forge=name=>instant1(`fixed_forge.${name}`);
    const restore=name=>instant1(`gu_as_before.${name}`);
    const claim=async()=>JSON.parse((await save()).expansion.worlds[id('world')].facts[id('fixed_immortal_travel.claim')]);
    const status=p.locator('[data-gu="gu-restoration"]');
    const travelStatus=p.locator('[data-gu="fixed-immortal-travel"]');
    const forgeStatus=p.locator('[data-gu="fixed-forge"]');
    const cast=p.locator(`[data-structured-action="${id('fixed_immortal_travel.travel_out')}"]`);
    const stabilize=p.locator(`[data-structured-action="${id('gu_as_before.stabilize')}"]`);
    const fuel=async()=>(await save()).inventories.person.main_character[key('fixed_immortal_travel.green_grape')]?.count??0;
    await admit('firefly_farm');await instant1('firefly_farm.start');await admit('stargate');await admit('fixed_immortal_travel');
    await travel('borrow');await travel('remember_annex');await travel('buy_dose');
    for(let index=0;index<2;index++){await act1('chores');await step(120);}
    await travel('buy_dose');await instant1('firefly_farm.collect');
    await instant1('stargate.cross_out');await travel('remember_hill');await act1('stargate.walk_back');await step(60);
    await admit('fixed_forge');await admit('gu_as_before');await forge('commission');await restore('reveal_mark');
    const original=(await claim()).destructionMark.specimen;
    await travel('return_loan');
    await roundTrip('restoration-mark-pending');
    const pending=await p.evaluate(()=>window.save_to_file());
    const before=await fuel();
    await restore('stabilize');
    assert.equal(await fuel(),before-1);
    const saved=(await claim()).gu.find(gu=>gu.id===original);
    assert.equal(saved.holder,id('steward'));
    assert.equal(saved.injured,true);
    assert.equal(saved.alive,true);
    assert.match(await status.innerText(),/Mark removed.*Gu still injured/);
    await status.screenshot({path:path.join(out,'gu-restoration-stabilized.png')});
    await travel('borrow');assert.equal(await cast.isDisabled(),true);
    await roundTrip('restoration-stabilized-injured');
    await step(30);await forge('settle');
    assert.match(await forgeStatus.innerText(),/distant rank-six refinement failed/);
    await restore('tend');await travel('travel_out');
    assert.equal((await claim()).gu.find(gu=>gu.alive).id,original);
    assert.equal((await save())['current location'],id('stargate.observatory'));
    await roundTrip('restoration-original-crossing');
    await load(pending);await step(20);
    assert.equal(await stabilize.isDisabled(),true);
    assert.match(await status.innerText(),/destroyed the original Gu/);
    assert.match(await travelStatus.innerText(),/no living specimen/);
    await roundTrip('restoration-mark-fired');
    await step(10);await forge('settle');
    assert.match(await forgeStatus.innerText(),/delivered a new rank-six Gu/);
    await travel('borrow');
    assert.notEqual((await claim()).gu.find(gu=>gu.alive).id,original);
    assert.equal(await stabilize.isDisabled(),true);
    await travel('travel_out');
    await roundTrip('restoration-rival-crossing');
    result.checks.push('Stabilization preserved the steward’s custody and the injury. After treatment the original Gu crossed. Waiting let the mark destroy it and a later rival claim supplied a distinct replacement.');
}
async function runTransitHouse() {
    const admit=async name=>{await open();await p.locator(`[data-structured-extension="${id(name)}"]`).click();};
    const travel=name=>instant1(`fixed_immortal_travel.${name}`);
    const forge=name=>instant1(`fixed_forge.${name}`);
    const frame=name=>instant1(`transit_house.${name}`);
    const claim=async()=>JSON.parse((await save()).expansion.worlds[id('world')].facts[id('fixed_immortal_travel.claim')]);
    const status=p.locator('[data-gu="transit-gu-house"]');
    const button=name=>p.locator(`[data-structured-action="${id(name)}"]`);
    const stock=async name=>(await save()).inventories.person.main_character[key(name)]?.count??0;
    const fuel=()=>stock('fixed_immortal_travel.green_grape');
    const chore=async()=>{await act1('chores');await step(120);};
    const walkBack=async()=>{await act1('stargate.walk_back');await step(60);};
    const finish=async()=>{await step(15);await frame('finish_frame');};
    await admit('firefly_farm');await instant1('firefly_farm.start');await admit('stargate');await admit('fixed_immortal_travel');
    await travel('borrow');await travel('remember_annex');await travel('buy_dose');
    await chore();await chore();await travel('buy_dose');await instant1('firefly_farm.collect');
    await instant1('stargate.cross_out');await travel('remember_hill');await walkBack();
    await admit('fixed_forge');await admit('gu_as_before');await admit('transit_house');
    await frame('open_frame');await frame('load_freight');await frame('fit_glide');
    const original=(await claim()).house.assembly.core;
    assert.equal(await button('fixed_immortal_travel.return_loan').isDisabled(),true);
    assert.equal(await button('fixed_immortal_travel.travel_out').isDisabled(),true);
    await roundTrip('house-setting');
    const setting=await p.evaluate(()=>window.save_to_file());
    await frame('rush_frame');
    assert.match(await status.innerText(),/Brace lost.*Lost: Glide Reed/);
    assert.equal((await claim()).gu.find(gu=>gu.alive).id,original);
    await roundTrip('house-brace-lost');
    await frame('fit_anchor');await finish();
    assert.match(await status.innerText(),/Ready to cross.*Anchor Reed.*carries freight/);
    await status.screenshot({path:path.join(out,'transit-house-repaired.png')});
    const beforeFreight=await fuel();
    const beforeReward=stones(await save());
    await frame('freight_cross');
    assert.equal(await stock('transit_house.freight'),0);
    assert.equal(stones(await save()),beforeReward+1);
    assert.equal(await fuel(),beforeFreight-2);
    assert.equal((await save())['current location'],id('stargate.observatory'));
    await roundTrip('house-freight-delivered');
    await load(setting);await finish();
    assert.equal(await button('transit_house.freight_cross').isDisabled(),true);
    const beforeGlide=await fuel();
    await frame('glide_cross');assert.equal(await fuel(),beforeGlide-1);await walkBack();
    await forge('commission');await instant1('gu_as_before.reveal_mark');await step(30);await forge('settle');await travel('borrow');
    const replacement=(await claim()).gu.find(gu=>gu.alive).id;
    assert.notEqual(replacement,original);
    assert.equal((await claim()).house.assembly.core,original);
    assert.match(await status.innerText(),/Bound core lost/);
    assert.equal(await button('transit_house.glide_cross').isDisabled(),true);
    await roundTrip('house-core-lost');
    await frame('fit_glide');await finish();
    assert.equal((await claim()).house.assembly.core,replacement);
    await frame('glide_cross');
    assert.equal((await save())['current location'],id('stargate.observatory'));
    await roundTrip('house-replacement-crossing');
    result.checks.push('The failed frame destroyed its brace and kept the core. An anchor replacement carried freight, while the glide used one dose. Losing the seated core blocked the House until the distinct rival Gu was fitted.');
}
async function runFixedWatch() {
    const admit = async name=>{await open();await p.locator(`[data-structured-extension="${id(name)}"]`).click();};
    const travel = op=>instant1(`fixed_immortal_travel.${op}`);
    const restore = op=>instant1(`gu_as_before.${op}`);
    const watch = ()=>instant1('fixed_watch.watch_smoke');
    const read = s=>JSON.parse(s.expansion.worlds[id('world')].facts[id('fixed_immortal_travel.claim')]);
    const readNow = async()=>read(await save());
    const sighting = p.locator('[data-gu="fixed-watch"]');
    const live = world=>world.gu.filter(gu=>gu.alive);
    await admit('firefly_farm'); await instant1('firefly_farm.start');
    await admit('stargate'); await admit('fixed_immortal_travel');
    await travel('borrow'); await travel('remember_annex');
    for (let i=0;i<2;i++) {await act1('chores'); await step(120);}
    await travel('buy_dose'); await travel('buy_dose');
    await instant1('firefly_farm.collect'); await instant1('firefly_farm.collect');
    await instant1('stargate.cross_out'); await travel('remember_hill');
    await act1('stargate.walk_back'); await step(60);
    await admit('fixed_forge'); await admit('gu_as_before'); await admit('fixed_watch');
    await restore('reveal_mark');
    const pending = await p.evaluate(()=>window.save_to_file());
    const original = live(await readNow())[0].id;
    await restore('stabilize'); await step(25);
    const saved = await readNow();
    assert.equal(saved.rivalWatch.status,'occupied');
    assert.equal(saved.rivalWatch.stock,1);
    assert.equal(saved.attempts.length,0);
    assert.equal(live(saved)[0].id,original);
    await load(pending);
    await instant1('stargate.cross_out');
    assert.equal((await save())['current location'],id('stargate.observatory'));
    await watch(); assert.match(await sighting.innerText(),/furnace quiet/);
    await step(20);
    const vacant = await readNow();
    assert.equal(vacant.destructionMark.status,'detonated');
    assert.equal(vacant.attempts.length,0);
    assert.equal(live(vacant).length,0);
    await roundTrip('fixed-watch-vacant-away');
    await step(5);
    const working = await readNow();
    assert.equal(working.attempts.length,1);
    assert.equal(working.attempts[0].status,'working');
    assert.equal(working.attempts[0].initiative,true);
    assert.equal(working.attempts[0].startedAt,working.rivalWatch.checkAt);
    assert.equal(working.rivalWatch.stock,0);
    await watch(); assert.match(await sighting.innerText(),/smoke rising/);
    await roundTrip('fixed-watch-rival-working');
    await step(29);
    assert.equal(live(await readNow()).length,0);
    await step(1);
    const settled = await readNow();
    assert.equal(settled.attempts[0].status,'complete');
    assert.equal(live(settled).length,1);
    assert.notEqual(live(settled)[0].id,original);
    assert.equal(live(settled)[0].holder,id('steward'));
    await watch(); assert.match(await sighting.innerText(),/furnace banked/);
    await roundTrip('fixed-watch-rival-settled-away');
    await act1('stargate.walk_back'); await step(60);
    await instant1('fixed_forge.settle'); await travel('borrow');
    assert.deepEqual(live(await readNow()),[{...live(settled)[0],holder:'player'}]);
    await travel('travel_out');
    assert.equal((await save())['current location'],id('stargate.observatory'));
    await roundTrip('fixed-watch-replacement-crossing');
    result.checks.push('The rival started and settled a funded attempt while the player was away. Saving the original kept the rival’s material intact.');
}
async function runVitalityGarden() {
    const garden=name=>instant1(`vitality_garden.${name}`);
    const button=name=>p.locator(`[data-structured-action="${id(`vitality_garden.${name}`)}"]`);
    const view=p.locator('[data-gu="vitality-garden"]');
    const stock=async name=>(await save()).inventories.person.main_character[key(`vitality_garden.${name}`)]?.count??0;
    const damage=async()=>(await save()).character.hp_to_full;
    const bed=async()=>JSON.parse((await save()).expansion.worlds[id('world')].facts[id('vitality_garden.bed')]);
    await p.locator(`[data-structured-extension="${id('vitality_garden')}"]`).click();
    await garden('borrow_grass');
    const specimen=(await bed()).plant.id;
    const before=await damage();
    await garden('clear_briars');assert.equal(await damage(),before+6);
    await garden('draw_water');await garden('buy_red_steel');
    const supplied=await p.evaluate(()=>window.save_to_file());
    const time=(await save())['current time'];
    await step(18*60-time.hour*60-time.minute);
    assert.equal(await button('grow_leaf').isDisabled(),true);
    await load(supplied);
    await garden('grow_leaf');assert.equal(await stock('water'),0);assert.equal(await stock('red_steel'),2);
    assert.match(await view.innerText(),/1\/9 on the stem.*0 plucked/);
    await roundTrip('vitality-rooted');
    await garden('harvest_leaf');await garden('treat_leaf');
    assert.equal(await stock('leaf'),0);assert.equal(await damage(),before+4);
    await step(15);await garden('draw_water');await garden('grow_leaf');
    await garden('return_grass');assert.match(await view.innerText(),/with the steward.*1\/9 on the stem/);
    assert.equal(await button('harvest_leaf').isDisabled(),true);
    await roundTrip('vitality-returned');
    await garden('borrow_grass');assert.equal((await bed()).plant.id,specimen);
    await garden('harvest_leaf');await garden('draw_briar_water');
    assert.ok(await damage()>0);assert.equal(await button('treat_leaf').isDisabled(),true);
    assert.equal(await stock('leaf'),1);
    const refractoryDamage=await damage();
    await roundTrip('vitality-recipient-refractory');assert.equal(await damage(),refractoryDamage);
    await step(15);await garden('buy_red_steel');await garden('grow_leaf');await garden('harvest_leaf');
    const beforeSale=stones(await save());await garden('sell_leaf');assert.equal(stones(await save()),beforeSale+2);
    await step(29);await garden('draw_briar_water');assert.ok(await damage()>0);
    assert.equal(await button('treat_leaf').isDisabled(),true);
    await step(1);const beforeSecond=await damage();assert.ok(beforeSecond>2);await garden('treat_leaf');
    assert.equal(await damage(),beforeSecond-2);assert.equal(await stock('leaf'),0);
    await view.screenshot({path:path.join(out,'vitality-garden.png')});
    await roundTrip('vitality-after-treatment-and-sale');assert.equal(await damage(),beforeSecond-2);
    result.checks.push('Daylight and real inputs grew three leaves on the same plant. Return preserved the rooted leaf, two detached leaves healed the player, and the other sold. The hour restriction preserved the spare leaf until treatment was possible.');
}
async function runFixedTravel() {
    const extension=name=>p.locator(`[data-structured-extension="${id(name)}"]`).click();
    const button=name=>p.locator(`[data-structured-action="${id(`fixed_immortal_travel.${name}`)}"]`);
    const action=name=>instant1(`fixed_immortal_travel.${name}`);
    const read=async()=>JSON.parse((await save()).expansion.worlds[id('world')].facts[id('fixed_immortal_travel.claim')]).gu[0];
    const status=p.locator('[data-gu="fixed-immortal-travel"]');
    const essence=async()=>sim(await save()).energies.player[id('primeval')].reserve;
    await extension('firefly_farm');await instant1('firefly_farm.start');
    await extension('stargate');await extension('fixed_immortal_travel');
    await action('borrow');await action('remember_annex');await action('buy_dose');
    const specimen=(await read()).id;
    assert.match(await status.innerText(),/rank 6.*in your care.*1 green grape dose.*Gu house/);
    assert.equal(await button('travel_out').isDisabled(),true);
    await act1('chores');await step(120);await instant1('firefly_farm.collect');
    await instant1('stargate.cross_out');await action('remember_hill');
    await roundTrip('fixed-travel-known-landing');
    const before=await essence();
    await action('travel_back');
    assert.equal((await save())['current location'],id('annex'));
    assert.match(await status.innerText(),/0 green grape doses/);
    assert.equal(await essence(),before);
    await action('return_loan');await action('buy_dose');
    assert.match(await status.innerText(),/with the steward.*1 green grape dose/);
    assert.equal(await button('travel_out').isDisabled(),true);
    await roundTrip('fixed-travel-returned-loan');
    await action('borrow');await action('travel_out');
    assert.equal((await save())['current location'],id('stargate.observatory'));
    assert.equal((await read()).id,specimen);
    assert.equal(await button('travel_back').isDisabled(),true);
    await roundTrip('fixed-travel-arrival');
    await act1('stargate.walk_back');await step(60);
    assert.equal((await save())['current location'],id('annex'));
    result.checks.push('One living Gu moved the Keeper between witnessed landings. Stored immortal essence paid for each trip, and the footpath remained usable when it ran out.');
}
async function runStargate() {
    const extension=name=>p.locator(`[data-structured-extension='${id(name)}']`).click();
    const crossing=name=>p.locator(`[data-structured-action='${id(name)}']`);
    await extension('firefly_farm');
    await instant1('firefly_farm.start');
    await extension('stargate');
    const stock=s=>s.inventories.person.main_character[key('firefly_farm.starlight_firefly')]?.count??0;
    const location=s=>s['current location'];
    assert.equal(await crossing('stargate.cross_out').isDisabled(),true);
    await act1('chores');await step(120);
    await instant1('firefly_farm.collect');
    assert.equal(stock(await save()),1);
    await instant1('stargate.cross_out');
    const across=await save();
    assert.equal(location(across),id('stargate.observatory'));
    assert.equal(stock(across),0);
    assert.match(await p.locator('#structured_pack_panel').innerText(),/Hill observatory/);
    await roundTrip('stargate-observatory');
    assert.equal(await crossing('stargate.cross_back').isDisabled(),true);
    await act1('stargate.walk_back');await step(60);
    assert.equal(location(await save()),id('annex'));
    await instant1('firefly_farm.collect');await instant1('firefly_farm.collect');
    assert.equal(stock(await save()),2);
    await instant1('stargate.cross_out');await instant1('stargate.cross_back');
    const back=await save();
    assert.equal(location(back),id('annex'));
    assert.equal(stock(back),0);
    await roundTrip('stargate-returned');
    result.checks.push('Farmed Gu paid for real relocation. The footpath returned safely with no Gu left.');
}
async function runImmortalAdvancement() {
    await p.locator(`[data-structured-extension="${id('immortal_refinement')}"]`).click();
    await instant1('immortal_refinement.buy_sand');
    await instant1('immortal_refinement.start');
    await step(20);
    await instant1('immortal_refinement.prepare');
    await step(20);
    await instant1('immortal_refinement.finish');
    const furnace=p.locator('[data-gu="immortal-refinement"]');
    assert.match(await furnace.innerText(),/rank 6.*in your care/);
    await p.locator(`[data-structured-extension="${id('immortal_advancement')}"]`).click();
    await instant1('immortal_advancement.buy_sand');
    await instant1('immortal_advancement.advance_start');
    assert.match(await furnace.innerText(),/rank 6.*furnace settling/);
    await roundTrip('immortal-advancement-pending');
    const pending=await p.evaluate(()=>window.save_to_file());
    await step(30);
    await instant1('immortal_advancement.advance_finish');
    await step(20);
    assert.match(await furnace.innerText(),/rank 7.*in your care/);
    await roundTrip('immortal-advancement-finished');
    await load(pending);
    await instant1('immortal_advancement.advance_cancel');
    assert.match(await furnace.innerText(),/rank 6.*unused sand returned/);
    assert.equal((await save()).inventories.person.main_character[key('immortal_refinement.luck_sand')].count,3);
    result.checks.push('The won rank-six Gu advanced to rank seven or returned from cancellation at rank six.');
}
async function runImmortalReclamation() {
    const admit=name=>p.locator(`[data-structured-extension="${id(name)}"]`).click();
    const action=name=>instant1(`immortal_reclamation.${name}`);
    const furnace=p.locator('[data-gu="immortal-refinement"]');
    const retry=p.locator('[data-gu="immortal-replacement"]');
    const sand=()=>instant1('immortal_refinement.buy_sand');
    const chore=async()=>{await act1('chores');await step(120);};
    const ledger=async()=>JSON.parse((await save()).expansion.worlds[id('world')].facts[id('immortal_reclamation.world_ledger')]);
    const prepare=async()=>{await step(20);await action('retry_prepare');await step(20);};
    await admit('immortal_refinement');
    await sand();
    await instant1('immortal_refinement.start');await step(20);
    await instant1('immortal_refinement.prepare');await step(20);
    await instant1('immortal_refinement.finish');
    await admit('immortal_reclamation');
    await action('lend');
    assert.match(await furnace.innerText(),/rank 6.*with the steward/);
    const original=(await ledger()).world.gu.find(gu=>gu.alive).id;
    await roundTrip('fortune-thread-steward');
    await chore();
    await sand();await action('retry_start');await prepare();await action('retry_finish');
    assert.match(await retry.innerText(),/refinement failed/);
    assert.match(await furnace.innerText(),/with the steward/);
    await action('recall');
    assert.equal((await ledger()).world.gu.find(gu=>gu.alive).id,original);
    await chore();await chore();
    await sand();await action('retry_start');await prepare();await action('destroy');
    assert.match(await furnace.innerText(),/destroyed/);
    await roundTrip('fortune-thread-replacement-ready');
    await action('retry_finish');
    assert.match(await furnace.innerText(),/rank 6.*in your care/);
    assert.match(await retry.innerText(),/a new Fortune Thread emerged/);
    const {gu}= (await ledger()).world;
    assert.deepEqual(gu.map(({id,alive})=>[id,alive]),[[original,false],['keeper-retry-2',true]]);
    await roundTrip('fortune-thread-replaced');
    result.checks.push('The steward kept the same claim, the occupied final step failed, and the prepared attempt succeeded once the original was destroyed.');
}
async function runImmortalRefinement() {
    await p.locator(`[data-structured-extension="${id('immortal_refinement')}"]`).click();
    const action=name=>instant1(`immortal_refinement.${name}`);
    const furnace=p.locator('[data-gu="immortal-refinement"]');
    const sand=s=>s.inventories.person.main_character[key('immortal_refinement.luck_sand')]?.count??0;
    await action('buy_sand');
    assert.equal(sand(await save()),5);
    await action('start');
    assert.equal(sand(await save()),0);
    assert.match(await furnace.innerText(),/furnace is warming/);
    await step(20);
    await action('prepare');
    await roundTrip('immortal-refinement-pending');
    const pending=await p.evaluate(()=>window.save_to_file());
    await step(20);
    await action('finish');
    assert.match(await furnace.innerText(),/rank 6.*in your care/);
    await step(60);
    await roundTrip('immortal-refinement-won');
    assert.match(await furnace.innerText(),/rank 6.*in your care/);
    await load(pending);
    await step(70);
    await action('finish');
    assert.match(await furnace.innerText(),/refinement failed.*ash/);
    assert.doesNotMatch(await furnace.innerText(),/rival|occupied|refiner/i);
    assert.equal(sand(await save()),0);
    await roundTrip('immortal-refinement-lost');
    await load(pending);
    await action('cancel');
    assert.equal(sand(await save()),3);
    result.checks.push('The same unfinished refinement supported a win, an undisclosed rival win, and cancellation with only unused sand returned.');
}
async function runWildWorm() {
    await p.locator(`[data-structured-extension="${id('wild_worm')}"]`).click();
    const action=name=>instant1(`wild_worm.${name}`);
    const read=async()=>JSON.parse((await save()).expansion.worlds[id('world')].facts[id('wild_worm.encounter')]);
    const trail=p.locator('[data-gu="wild-worm"]');
    await action('find');
    const original=(await read()).id;
    await action('approach');
    assert.match(await trail.innerText(),/left a trace/);
    await action('follow');
    await action('buy_wine');
    await action('lure');
    await action('capture');
    assert.match(await trail.innerText(),/wild will.*recognizes your scent/);
    await action('refine');
    assert.match(await trail.innerText(),/refined/);
    await action('release');
    assert.match(await trail.innerText(),/give it time/);
    await roundTrip('wild-worm-released');
    await step(60);
    await action('find');
    const catchButton=p.locator(`[data-structured-action="${id('wild_worm.capture')}"]`);
    if(await catchButton.isDisabled()) {
        await action('buy_wine');
        await action('lure');
    }
    await action('capture');
    const recaught=await read();
    assert.deepEqual(Object.keys(recaught.lifecycle.individuals),[original]);
    assert.ok(recaught.lifecycle.individuals[original].experience.player.bond>=30);
    assert.equal(recaught.lifecycle.individuals[original].keeper,'player');
    assert.match(await trail.innerText(),/wild will.*recognizes your scent/);
    await roundTrip('wild-worm-recaptured');
    result.checks.push('The same Gu remembered the Keeper after release, and recapture left its will wild.');
}
async function runRoamingWorm() {
    const original = op => instant1(`wild_worm.${op}`);
    const roam = op => instant1(`wild_worm_roam.${op}`);
    const essence = op => instant1(`worm_essence.${op}`);
    const trail = p.locator('[data-gu="wild-worm"]');
    const read = s => JSON.parse(s.expansion.worlds[id('world')].facts[id('wild_worm.encounter')]);
    const find = s => read(s).lifecycle.individuals[read(s).id];
    const capture = p.locator(`[data-structured-action="${id('wild_worm.capture')}"]`);
    const wine = s => s.inventories.person.main_character[key('wild_worm.wine')]?.count ?? 0;
    const untilWake = async()=>{
        const s = await save();
        await step(read(s).roam.due - s.expansion.clock);
    };
    await instant1('take_moon');
    for (const name of ['wild_worm','wild_worm_roam','worm_essence']) {
        await p.locator(`[data-structured-extension="${id(name)}"]`).click();
    }
    await original('find');
    for (let i=0;i<3;i++) await original('buy_wine');
    const first = await save();
    await roam('watch_worm');
    await roundTrip('roaming-worm-watched');
    await untilWake();
    assert.match(await trail.innerText(),/trail went cold/);
    assert.equal(await capture.isDisabled(),true);
    assert.notEqual(find(await save()).habitat,find(first).habitat);
    assert.equal(read(await save()).id,read(first).id);
    await roam('leave_wine');
    assert.equal(wine(await save()),2);
    await step(4);
    assert.match(await trail.innerText(),/wine waiting/);
    await roundTrip('roaming-worm-wine-waiting');
    await step(1);
    const lured = await save();
    assert.equal(read(lured).phase,'lured');
    assert.equal(find(lured).experience.player.bond,30);
    assert.equal(find(lured).habitat,find(first).habitat);
    assert.equal(await capture.isEnabled(),true);
    await untilWake();
    assert.equal(await capture.isDisabled(),true);
    await roam('leave_wine');
    const waiting = await save();
    assert.equal(wine(waiting),1);
    assert.ok(read(waiting).roam.due - waiting.expansion.clock > 5,'A recently fed Worm returns later.');
    await untilWake();
    const returned = await save();
    assert.equal(find(returned).experience.player.bond,60);
    assert.ok(read(returned).roam.due-returned.expansion.clock > read(lured).roam.due-lured.expansion.clock);
    await original('capture');
    await original('refine');
    await essence('feed');
    await essence('convert');
    await essence('cast_middle');
    await step(20);
    const held = await save();
    assert.equal(read(held).id,read(first).id);
    assert.equal(find(held).keeper,'player');
    assert.equal(read(held).roam.due,null);
    assert.equal(held.expansion.worlds[id('world')].facts[id('worm_essence.last_cut')],2);
    await roundTrip('roaming-worm-converted');
    result.checks.push('The Worm moved without a player action, missed its first capture window, then returned to paid wine and powered a middle-stage Moonblade.');
}
async function runPastMoonblade() {
    await instant1('take_moon');
    await p.locator(`[data-structured-extension="${id('moonblade')}"]`).click();
    await p.locator(`[data-structured-extension="${id('past_moonblade')}"]`).click();
    const sealCast=p.locator(`[data-structured-action="${id('past_moonblade.cast')}"]`);
    assert.equal(await p.locator(`[data-structured-action="${id('past_moonblade.open')}"]`).isDisabled(),true);
    await act1('moonblade.set_target');await step(1);
    await act1('moonblade.cut_target');await step(5);
    const original=gu(await save(),'moon').body.id;
    for(let day=0;day<12&&gu(await save(),'moon').vitals.health>1;day++)await step(DAY);
    assert.equal(gu(await save(),'moon').vitals.health,1);
    await instant1('past_moonblade.open');
    await act1('moonblade.set_target');await step(1);
    await roundTrip('past-moonblade-open');
    const unspent=await p.evaluate(()=>window.save_to_file());
    assert.equal(await p.locator(`[data-structured-action="${id('moonblade.cut_target')}"]`).isDisabled(),true);
    assert.equal(await sealCast.isEnabled(),true);
    const essence=s=>sim(s).energies.player[id('primeval')].reserve;
    const before=essence(await save());
    await instant1('past_moonblade.cast');
    const after=await save();
    assert.equal(essence(after),before);
    assert.equal(gu(after,'moon').body.id,original);
    assert.equal(after.expansion.actors.player.facts[id('moonblade.target_ready')],false);
    const status=p.locator('.structured-status-details');
    if(!await status.evaluate(node=>node.open))await status.locator('summary').click();
    assert.match(await status.innerText(),/Your earlier Moonblade cuts through the straw/);
    await step(30);
    assert.equal((await save()).expansion.actors.player.facts[id('moonblade.target_ready')],false);
    await roundTrip('past-moonblade-spent');
    await load(unspent);
    await step(29);
    assert.equal(await sealCast.isDisabled(),true);
    assert.equal((await save()).expansion.actors.player.facts[id('moonblade.target_ready')],true);
    result.checks.push('The borrowed cut settled while the living Moonlight Gu was too hungry to cast.');
}
async function runFireflyCare() {
    await p.locator(`[data-structured-extension="${id('firefly_farm')}"]`).click();
    await instant1('firefly_farm.start');
    await p.locator(`[data-structured-extension="${id('firefly_care')}"]`).click();
    await act1('chores');await step(120);
    await instant1('firefly_care.keep');
    const individuals=async()=>JSON.parse((await save()).expansion.worlds[id('world')].facts[id('firefly_farm.colony')]).populations.individuals;
    const [kept]=Object.keys(await individuals());
    assert.ok(kept);
    await instant1('firefly_farm.collect');
    assert.equal((await save()).inventories.person.main_character[key('firefly_farm.starlight_firefly')].count,1);
    await instant1('firefly_care.shine');
    const enclosure=p.locator('[data-gu="firefly-enclosure"]');
    assert.match(await enclosure.innerText(),/needs rest/);
    await instant1('firefly_care.care');
    await roundTrip('firefly-resting');
    await step(30);await open();
    assert.match(await enclosure.innerText(),/ready to shine/);
    await instant1('firefly_care.shine');
    assert.deepEqual(Object.keys(await individuals()),[kept]);
    result.checks.push('The same Gu shone again after rest.');
}
async function runFireflyFarm() {
    await p.locator(`[data-structured-extension="${id('firefly_farm')}"]`).click();
    await instant1('firefly_farm.start');
    assert.equal(stones(await save()),1);
    const bed=p.locator('[data-gu="firefly-bed"]');
    assert.match(await bed.innerText(),/4 ordinary fireflies.*0 Gu ready to collect/);
    assert.match(await p.locator('.gu-house').innerText(),/Net since the start: -2 stones/);
    await roundTrip('firefly-bed-open');
    await act1('chores');await step(120);await open();
    assert.match(await bed.innerText(),/2 Gu ready to collect/);
    await instant1('firefly_farm.collect');await instant1('firefly_farm.collect');
    assert.match(await bed.innerText(),/0 Gu ready to collect/);
    assert.equal((await save()).inventories.person.main_character[key('firefly_farm.starlight_firefly')].count,2);
    assert.equal(await p.locator(`[data-structured-action="${id('firefly_farm.collect')}"]`).isDisabled(),true);
    await roundTrip('firefly-bed-harvested');
    await bed.scrollIntoViewIfNeeded();
    await p.screenshot({path:path.join(out,'firefly-bed.png')});
}
async function runRankTrial() {
    await instant1('take_moon');
    await p.locator(`[data-structured-extension="${id('rank_trial')}"]`).click();
    await instant1('rank_trial.borrow');
    await act1('rest');await step(60);
    const essence=s=>sim(s).energies.player[id('primeval')].reserve;
    const before=essence(await save());
    await instant1('rank_trial.aperture_cast');
    let s=await save();
    assert.equal(essence(s),before-10);
    const sound=s.expansion.actors.player.facts[id('rank_trial.moonglow_sound')];
    assert.equal(typeof sound,'boolean');
    result.checks.push(sound ? 'The paid aperture cast hit.' : 'The paid aperture cast recoiled.');
    if(!sound) {
        await roundTrip('injured-moonglow');
        await instant1('rank_trial.treat');
    }
    await instant1('rank_trial.buy_dose');
    const afterTreatment=essence(await save());
    await instant1('rank_trial.stored_cast');
    s=await save();
    assert.equal(essence(s),afterTreatment);
    assert.equal(s.inventories.person.main_character[key('rank_trial.red_steel')]?.count??0,0);
    assert.equal(s.inventories.person.main_character[key('rank_trial.loan')].count,1);
    assert.match(sim(s).knowledge.player[id('rank_trial.last_cast')].value,/cuts through/);
    await roundTrip('stored-cast');
}
try {
    if(moonlightStockOnly || process.argv[4] === '--tray-move-only') await context.addInitScript(()=>{
        const random=crypto.getRandomValues.bind(crypto);
        crypto.getRandomValues=values=>{
            if(values instanceof Uint32Array && values.length===1) {values[0]=1;return values;}
            return random(values);
        };
    });
    await p.goto(`http://127.0.0.1:${server.address().port}/?test_hooks=1`);await play();await open();
    await p.locator('[data-structured-choice="life"]').selectOption(P);await p.locator('[data-structured-begin]').click();
    if(coordinationOnly) {
        result.route='Formation rehearsal → mark cue → miss the beat → restore individual reserves → merge and lift';
        await p.locator(`[data-structured-action='${id('cue')}']`).waitFor();
        await runCoordination();
    } else {
    await p.locator('.gu-house').waitFor();
    let s=await save();assert.equal(stones(s),3);await shot('01-start');
    result.checks.push('refused at 3 stones: '+await why('take_worm'));
    if(process.argv[4] === '--defense-research-only') {
        result.route='Gu Keeper → research a blast crossing → lose a route to recovery → trade a hunted eye and refine armor → generate and use a new plan';
        await runDefenseResearch();
    } else if(process.argv[4] === '--defense-research-layout-only') {
        result.route='Earned defense research save → 1536×864 → inspect generated plans and crossing at 14px and 21px';
        await runKeeperLayout(process.argv[5], 'defense-research', 'defense_research.cross_5', /Water Shield \+ Scale Armor/);
    } else if(process.argv[4] === '--layered-defense-layout-only') {
        result.route='Earned defense save → 1536×864 → inspect both damage results and the route home at 14px and 21px';
        await runKeeperLayout(process.argv[5], 'layered-defense', 'hosted_wolf.leave', /Blast took 2 health · Landing took 1 health/);
    } else if(process.argv[4] === '--layered-defense-only') {
        result.route='Gu Keeper → recover Thunderclap → take in White Jade and make Scale Armor → compare blast, landing and recovery';
        await runLayeredDefense();
    } else if(process.argv[4] === '--witnessed-moth-only') {
        result.route='Gu Keeper → mark a willing visit → call off the future lesson → reach the past visit → compare visitors and read by the glow';
        await runWitnessedMoth();
    } else if(process.argv[4] === '--witnessed-moth-layout-only') {
        result.route='Earned earlier glow → 1536×864 → inspect its status and study action at 14px and 21px';
        await runKeeperLayout(process.argv[5], 'witnessed-moth', 'insight_moth.study', /earlier moth glowed for you/);
    } else if(futureMothLayoutOnly) {
        result.route='Earned glowing-moth save → 1536×864 → inspect glow and study at 14px and 21px';
        await runFutureMothLayout(process.argv[5]);
    } else if(futureMothOnly) {
        result.route='Gu Keeper → witness a refusal → prepare a lesson → borrow the moth’s future aid → cancel, transfer or teach';
        await runFutureMoth();
    } else if(insightMothOnly) {
        result.route='Gu Keeper → shelter the Insight Moth → transfer and compare visitors → read by its glow → gather petals';
        await runInsightMoth();
    } else if(scaleArmorLayoutOnly) {
        result.route='Earned stone-run save → 1536×864 → inspect armor and return at 14px and 21px';
        await runKeeperLayout(process.argv[5],'stealth-fusion','scale_armor.return',/Scale Armor stopped the falling stone/);
    } else if(scaleArmorOnly) {
        result.route='Gu Keeper → bind one Fish Scale across two possible recipes → compare real impacts → acquire a second specimen';
        await runScaleArmor();
    } else if(stealthFusionLayoutOnly) {
        result.route='Earned watch screen save → 1536×864 → inspect concealment and return at 14px and 21px';
        await runKeeperLayout(process.argv[5],'stealth-fusion','stealth_fusion.return',/you passed the watch screen/);
    } else if(stealthFusionOnly) {
        result.route='Gu Keeper → hunt and trade for two Gu → compare cloak surfaces → fuse and cross → use the owned cloak in scouting';
        await runStealthFusion();
    } else if(smokePassageLayoutOnly) {
        result.route='Earned smoke clearing save → 1536×864 → inspect the clearing and return at 14px and 21px';
        await runKeeperLayout(process.argv[5],'smoke-passage','smoke_passage.return',/Clearing reached/);
    } else if(smokePassageOnly) {
        result.route='Gu Keeper → recover Lightning Eye → compare visual and ground signals → recover a lost listener → reach the clearing';
        await runSmokePassage();
    } else if(crownFlightLayoutOnly) {
        result.route='Earned shield crossing save → 1536×864 → inspect the crossing and footpath at 14px and 21px';
        await runKeeperLayout(process.argv[5],'fleeing-shield','crown_flight.bank_back',/carried you across the sparking ford/);
    } else if(crownFlightOnly) {
        result.route='Gu Keeper → disarm the crown wolf → follow two distinct escape trails → lose or recover both → cross with Thunder Shield';
        await runCrownFlight();
    } else if(wolfScoutingLayoutOnly) {
        result.route='Earned cache save → 1536×864 → inspect scouting result and return at 14px and 21px';
        await runKeeperLayout(process.argv[5],'wolf-scouting','wolf_scouting.leave_ravine',/concealed cache recovered/);
    } else if(wolfScoutingOnly) {
        result.route='Gu Keeper → compare the wolves’ senses → follow the same crown wolf to the ravine → recover and use Lightning Eye';
        await runWolfScouting();
    } else if(wolfRidgeLayoutOnly) {
        result.route='Earned ridge lookout save → 1536×864 → inspect Thunderwings and return at 14px and 21px';
        await runKeeperLayout(process.argv[5],'wolf-ridge','wolf_ridge.walk_down',/Thunderwings reached the shelf/);
    } else if(wolfRidgeOnly) {
        result.route='Gu Keeper → tend or hunt the original wolf → observe the ridge → affect prey → spare and re-find a host → fly';
        await runWolfRidge();
    } else if(hostedWolfOnly) {
        result.route='Gu Keeper → find a hosted Thunderclap → tend the wolf → extract and cast or replay the hunt';
        await runHostedWolf();
    } else if(process.argv[4] === '--frayed-rig-only') {
        result.route='Gu Keeper → compare fresh and frayed cord → test early and mature fruit → run the waterwheel';
        await runPotatoMarket(true, true);
    } else if(process.argv[4] === '--drain-rig-only') {
        result.route='Gu Keeper → grow and sell fruit → compare log impacts → grind grain with the restored waterwheel';
        await runPotatoMarket(true);
    } else if(process.argv[4] === '--drain-rig-layout-only') {
        result.route='Earned waterwheel save → inspect log and milling result at 1536×864';
        await runKeeperLayout(process.argv[5], 'drain-rig', 'thunder_potato_market.back', /waterwheel ground the grain/);
    } else if(process.argv[4] === '--potato-market-only') {
        result.route='Gu Keeper → trade fruit and buy it back → steward compares both fruits → inspect the cleared drain';
        await runPotatoMarket();
    } else if(process.argv[4] === '--potato-market-layout-only') {
        result.route='Earned drain save → check result and return at 1536×864';
        await runKeeperLayout(process.argv[5], 'potato-market', 'thunder_potato_market.back', /cleared the stone drain/);
    } else if(process.argv[4] === '--potato-trial-only') {
        result.route='Gu Keeper → compare two Mother Gu and two soil treatments → break the brace → recover the cache';
        await runPotatoTrial();
    } else if(process.argv[4] === '--potato-trial-layout-only') {
        await runKeeperLayout(process.argv[5], 'thunder-potato-trial', 'thunder_potato_trial.leave_store', /stone brace broke/);
    } else if(thunderPotatoOnly) {
        result.route='Gu Keeper → produce and sort fruit → plant the viable Gu → import growing plot → detonate and enter recess';
        await runThunderPotato();
    } else if(rainbowOnly) {
        result.route='Gu Keeper → activate Rainbow Light → save midflight → arrive or lose the support';
        await runRainbowLight();
    } else if(raisedMoonbladeOnly) {
        result.route = 'Gu Keeper → feed both Gu → compare reach and loan readiness → open the practice alcove';
        await runRaisedMoonblade();
    } else if(moveTrialOnly) {
        result.route='Gu Keeper → generate Moonblade combinations → cast known and alternate moves → interrupt a saved plan';
        await runMoveTrial();
    } else if(fireTrialOnly) {
        result.route='Gu Keeper → generate Red Fire combinations → light the kiln → cross with Fire Discharge';
        await runFireTrial();
    } else if(moonlightProspectOnly) {
        result.route='Gu Keeper → prepare a focus refinement → compare present and future cuts → cancel, lose the anchor, and finish a fresh plan';
        await runMoonlightProspect();
    } else if(process.argv[4] === '--light-reader-only') {
        result.route='Gu Keeper → replay recorded light → compare borrowed light and live custody → enter both reader rooms';
        await runLightReaders();
    } else if(process.argv[4] === '--light-reader-layout-only') {
        result.route='Earned keeper’s door save → inspect recognition and return at 1536×864';
        await runKeeperLayout(process.argv[5], 'light-readers', 'signal_trial.back_keeper', /keeper’s door recognized you/);
    } else if(process.argv[4] === '--blade-chain-only') {
        result.route='Gu Keeper → discover blade chains from held Gu → compare missing roles → open the same passage with both chains';
        await runBladeChains();
    } else if(process.argv[4] === '--blade-chain-layout-only') {
        result.route='Earned blade chain save → check both written routes and passage return at 1536×864';
        await runKeeperLayout(process.argv[5], 'blade-chains', 'chain_research.back', /Both catches cut/);
    } else if(process.argv[4] === '--tray-move-only') {
        result.route='Gu Keeper → survey exact tray Gu → write Little Light Moonblade → compare the other loan → refine the written Gu and cross';
        await runTrayMove();
    } else if(process.argv[4] === '--tray-move-layout-only') {
        result.route='Earned tray move → 1536×864 → inspect the exact quote and cast at 14px and 21px';
        await runKeeperLayout(process.argv[5], 'tray-move', 'tray_move.cast_tray_move', /Second tray Gu · Little Light Gu · 10 sheets/);
    } else if(moonlightStockOnly) {
        result.route='Gu Keeper → compare two generated Moonlight Gu → refine, return, and reborrow one';
        await runMoonlightStock();
    } else if(moonlightTrialOnly) {
        result.route='Gu Keeper → compare two rank-one Moonlight Gu → refine one → return and reborrow';
        await runMoonlightTrial();
    } else if(stargateSkyOnly) {
        result.route='Gu Keeper → wait for starlight at both Stargates → cross without spending Gu → return at dawn with a farmed Gu';
        await runStargateSky();
    } else if(moonFusionOnly) {
        result.route='Gu Keeper → discover three Moonlight fusions → restore a failure → replay and cast the three products';
        await runMoonFusion();
    } else if(moonFusionTimeOnly) {
        result.route='Gu Keeper → bind a future blade to a pending fusion → free the trapped Gu → cancel or finish → reuse the rescued Gu';
        await runMoonFusionTime();
    } else if(moonFusionVitalOnly) {
        result.route='Gu Keeper → compare two fatal fusion failures → tend the Vital Gu → fuse and return its successor';
        await runMoonFusionVital();
    } else if(screenResearchOnly) {
        result.route='Gu Keeper → research ways to open a screen → replay the written plans through two different methods';
        await runScreenResearch();
    } else if(fightingSpiritOnly) {
        result.route='Gu Keeper → abort early → suffer late backlash → replace the supports and recover → retry';
        await runFightingSpirit();
    } else if(process.argv[4] === '--giant-hand-variants-only') {
        result.route='Gu Keeper → refine Myriad Self → compare three exact pairs → return a written Gu → restore the pair and cross';
        await runGiantHandVariants();
    } else if(process.argv[4] === '--giant-hand-variants-layout-only') {
        result.route='Earned written pair → 1536×864 → inspect force, essence and the cast at 14px and 21px';
        await runKeeperLayout(process.argv[5], 'giant-hand-variants', 'giant_hand_variants.cast_written', /Written pair · second \+ focused/);
    } else if(process.argv[4] === '--giant-hand-ward-only') {
        result.route='Gu Keeper → refine Myriad Self → generate ward plans → compare force and cost → cross';
        await runGiantHandWard();
    } else if(process.argv[4] === '--giant-hand-ward-layout-only') {
        result.route='Earned ward plans → 1536×864 → inspect force, cost and the supported cast at 14px and 21px';
        await runKeeperLayout(process.argv[5], 'giant-hand-ward', 'giant_hand_ward.ward_self', /force 6 of 6 needed/);
    } else if(process.argv[4] === '--giant-hand-only') {
        result.route='Gu Keeper → prepare and compare expired phantoms → earn Myriad Self → use revised Giant Hand';
        await runGiantHand();
    } else if(process.argv[4] === '--giant-hand-layout-only') {
        result.route='Earned Myriad Self save → 1536×864 → inspect revised Giant Hand at 14px and 21px';
        await runKeeperLayout(process.argv[5], 'giant-hand', 'giant_hand.cast_giant_hand', /rank-seven Myriad Self in your care/);
    } else if(process.argv[4] === '--beam-record-only') {
        result.route='Gu Keeper → copy a successful beam demonstration → rewrite plans → refine and test a second gate';
        await runBeamRecord();
    } else if(process.argv[4] === '--beam-record-layout-only') {
        result.route='Earned side passage save → inspect the copied move and return at 1536×864';
        await runKeeperLayout(process.argv[5], 'beam-record', 'beam_record.back', /side gate lowered/);
    } else if(process.argv[4] === '--beam-link-only') {
        result.route='Gu Keeper → refine Beam Catch → save a held effect → compare loss of the loan, expiry and a successful linked move';
        await runBeamLink();
    } else if(process.argv[4] === '--beam-link-layout-only') {
        result.route='Earned linked-move save → 1536×864 → inspect the hold and Woven Catch at 14px and 21px';
        await runKeeperLayout(process.argv[5], 'beam-link', 'beam_link.catch_shelf', /Beam Catch is holding the shelf/);
    } else if(process.argv[4] === '--beam-condensation-only') {
        result.route='Gu Keeper → practice a beam move → refine, cancel and retry → use one Gu to open a passage → switch back for the heavier shelf';
        await runBeamCondensation();
    } else if(process.argv[4] === '--beam-condensation-layout-only') {
        result.route='Earned Beam Catch Gu → 1536×864 → inspect its cost and use at 14px and 21px';
        await runKeeperLayout(process.argv[5], 'beam-condensation', 'beam_condensation.use_beam_gu', /2 essence to use/);
    } else if(beamProcedureOnly) {
        result.route='Gu Keeper → research two three-core bindings → interrupt one → lower the beam and heavy shelf';
        await runBeamProcedure();
    } else if(antNestOnly) {
        result.route='Gu Keeper → found an army-ant colony → return Ant Nest → restore a pending brood → clear the storeroom';
        await runAntNest();
    } else if(attitudeOnly) {
        result.route='Gu Keeper → borrow Attitude Gu → compare the steward’s responses → restore attention → claim practice petals';
        await runAttitudeGu();
    } else if(process.argv[4] === '--fixed-watch-only') {
        result.route='Gu Keeper → save or lose the marked Gu → observe the rival from the hill → borrow the replacement';
        await runFixedWatch();
    } else if(process.argv[4] === '--fixed-watch-layout-only') {
        result.route='Earned furnace sighting save → check scouting status and route at 1536×864';
        await runKeeperLayout(process.argv[5], 'fixed-watch', 'stargate.walk_back', /furnace banked/);
    } else if(fixedForgeOnly) {
        result.route='Gu Keeper → keep the loan identity at rank seven → contest rank six → replace the destroyed original → cross';
        await runFixedForge();
    } else if(guRestorationOnly) {
        result.route='Gu Keeper → expose a destructive mark → stabilize and tend the original or wait for the rival to replace it';
        await runGuRestoration();
    } else if(transitHouseOnly) {
        result.route='Gu Keeper → fit a live core and brace → recover from a lost brace or core → cross and deliver freight';
        await runTransitHouse();
    } else if(vitalityGardenOnly) {
        result.route='Gu Keeper → clear the cistern → grow and pluck leaves → sell or treat a wound';
        await runVitalityGarden();
    } else if(fixedTravelOnly) {
        result.route='Gu Keeper → reach the hill by Stargate → study both landings → make two Fixed Immortal Travel crossings';
        await runFixedTravel();
    } else if(stargateOnly) {
        result.route='Gu Keeper → farm Starlight Firefly Gu → paired Stargate → observatory → footpath or gate home';
        await runStargate();
    } else if(immortalReclamationOnly) {
        result.route='Gu Keeper → lend Fortune Thread → fail an occupied attempt → recall and destroy → finish a new specimen';
        await runImmortalReclamation();
    } else if(immortalAdvancementOnly) {
        result.route='Gu Keeper → win Fortune Thread → import pending advancement → finish or cancel';
        await runImmortalAdvancement();
    } else if(immortalRefinementOnly) {
        result.route='Gu Keeper → refine Fortune Thread → import unfinished attempt → win, lose or cancel';
        await runImmortalRefinement();
    } else if(nineLayoutOnly) {
        result.route='Earned yellow-gold save → 1536×864 → inspect rank-four reserve and crossing at 14px and 21px';
        await runKeeperLayout(process.argv[5],'nine-eyes-worm','nine_eyes.cross_cut',/2 middle-stage yellow-gold measures/);
    } else if(nineOnly) {
        result.route='Gu Keeper → raise a Seven Fragrances Worm → fail Nine Eyes → buy fresh eyes → refine → cross the practice cut';
        await runNineEyes();
    } else if(sevenOnly) {
        result.route='Gu Keeper → capture a wild Worm → fuse Four Flavors → fuse Seven Fragrances → power captured Thunderclap';
        await runSevenFragrances();
    } else if(redSteelOnly) {
        result.route='Gu Keeper → fuse Four Flavors → concentrate rank-two red steel → cast Moonglow';
        await runFourFlavorsRedSteel();
    } else if(fourFlavorsOnly) {
        result.route='Gu Keeper → prepare two real Liquor Worms and four wines → fuse rank-two Four Flavors';
        await runFourFlavors();
    } else if(wormEssenceOnly) {
        result.route='Gu Keeper → feed and refine wild Liquor Worm → concentrate green copper → release Worm and cast';
        await runWormEssence();
    } else if(process.argv[4] === '--roaming-worm-only') {
        result.route='Gu Keeper → watch the Worm leave → lose and recover a capture window → concentrate essence';
        await runRoamingWorm();
    } else if(process.argv[4] === '--roaming-worm-layout-only') {
        result.route='Earned refined Worm save → inspect the Worm and release action at 1536×864';
        await runKeeperLayout(process.argv[5], 'wild-worm', 'wild_worm.release', /refined.*recognizes your scent/);
    } else if(wildWormOnly) {
        result.route='Gu Keeper → pursue a wild Liquor Worm → bait → capture → refine → release and recapture';
        await runWildWorm();
    } else if(pastMoonbladeOnly) {
        result.route='Gu Keeper → witness Moonblade → source Gu starves out → borrow past cast → save and import';
        await runPastMoonblade();
    } else if(fireflyCareOnly) {
        result.route='Gu Keeper → keep a firefly Gu → draw starlight → rest and use it again';
        await runFireflyCare();
    } else if(fireflyFarmOnly) {
        result.route='Gu Keeper → firefly bed → clan chores → collect two Gu → save and import';
        await runFireflyFarm();
    } else if(rankTrialOnly) {
        result.route='Gu Keeper → Moonglow loan → aperture cast → stored dose → save and import';
        await runRankTrial();
    } else {
    await instant1('take_moon');await instant1('buy_petals');await instant1('buy_petals');
    for(let i=0;i<3;i++)await instant1('feed_moon');
    s=await save();assert.equal(stones(s),1);await roundTrip('moon-fed');
    await p.locator(`[data-structured-extension="${id('moonblade')}"]`).click();
    await p.waitForFunction(id=>window.simulationTestHooks.snapshot().content_packs.structured.extensions?.some(row=>row.id===id), id('moonblade'));
    await act1('moonblade.set_target');await step(1);
    s=await save();assert.equal(s.expansion.actors.player.facts[id('moonblade.target_ready')],true);
    const beforeCut=sim(s).energies.player[id('primeval')].reserve;
    const cutButton=p.locator(`[data-structured-action="${id('moonblade.cut_target')}"]`);
    const cutRow=p.locator(`[data-structured-row="${id('moonblade.cut_target')}"]`);
    assert.equal(await cutButton.isEnabled(),true,await cutRow.textContent());
    await act1('moonblade.cut_target');await step(5);
    s=await save();assert.equal(sim(s).energies.player[id('primeval')].reserve,beforeCut-4);
    assert.equal(s.expansion.actors.player.facts[id('moonblade.target_ready')],false);
    await roundTrip('moonblade-cut');
    if(process.argv[4] !== '--moonblade-only') {
    await toClock(7*DAY);s=await save();assert.equal(stones(s),7);await p.locator('[data-gu="agreement"]').waitFor();
    await instant1('take_worm');s=await save();assert.equal(stones(s),3);
    result.checks.push('refused at 3 stones after buying the worm: '+await why('take_jade'));
    await act1('chores');await step(120);await act1('chores');await step(120);await act1('chores');await step(120);
    s=await save();assert.equal(stones(s),6);await instant1('take_jade');s=await save();assert.equal(stones(s),0);
    for(const n of ['moon','worm','jade'])assert.equal(gu(s,n).body.controllerId,'player');
    result.checks.push('held three Gu on a stipend that feeds fewer: '+await p.locator('[data-gu="feeding-cap"]').innerText());
    await shot('02-over-held');await roundTrip('over-held');
    s=await save();const FOOD={moon:'petals',worm:'lees',jade:'jade'},when={};
    for(const n of ['moon','worm','jade']){const d=keeperDiets.find(x=>x.holder===id(n));
        when[n]=starvation(d,{stock:sim(s).owners[id(n)]?.[key(FOOD[n])]||0,condition:gu(s,n).vitals.health,now:s.expansion.clock,anchor:s.content_packs.structured.initializedAt}).starvedOutAt;}
    result.matrix.push({predictedStarvedOutMinute:when,clockNow:s.expansion.clock});
    for(const [n,t] of Object.entries(when).sort((a,b)=>a[1]-b[1])){
        if(t>s.expansion.clock){await toClock(t-1);s=await save();assert.equal(gu(s,n).vitals.health,2,n+' at condition 2 one minute before');await step(1);}
        s=await save();assert.equal(gu(s,n).vitals.health,1,n+' starved out on the predicted minute');assert.equal(gu(s,n).life,'alive',n+' alive: hunger does not kill a keeper’s Gu');
    }
    await open();await p.locator('[data-gu-row="moon"]').waitFor();assert.match(await p.locator('[data-gu-row="moon"] [data-gu="starves-in"]').innerText(),/Starved out now/);
    assert.equal(await p.locator(`[data-structured-action="${id('work_moon')}"]`).isDisabled(),true);
    await act1('moonblade.set_target');await step(1);await open();
    assert.equal(await p.locator(`[data-structured-action="${id('moonblade.cut_target')}"]`).isDisabled(),true);
    await shot('03-starved-out');
    await act1('chores');await step(120);await instant1('buy_petals');await instant1('feed_moon');await toClock((await save()).expansion.clock+1440);
    s=await save();assert.ok(gu(s,'moon').vitals.health>=2,'a meal recovers it');await instant1('order_moon_on');
    await shot('04-recovering-with-order');
    await roundTrip('after-hunger');
    result.checks.push('each Gu was starved out (not killed) on its predicted minute, refused work, recovered on a meal and took a standing order; the Gu house showed the clock; save, reload, Export and Import matched');
    }
    }
    }
    assert.deepEqual(result.errors,[]);result.bundleSha256=createHash('sha256').update(await readFile(path.join(build,'dist/bundle.js'))).digest('hex');result.reviewState='agent-verified, not human-reviewed';result.success=true;
}catch(e){result.failure=e.stack;result.panel=await p.locator('#structured_pack_panel').innerText().catch(()=>'');await p.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});}
finally{await writeFile(path.join(out,'result.json'),JSON.stringify(result,null,2));await context.close();await browser.close();server.close();}
console.log(JSON.stringify({success:result.success,failure:result.failure,panel:result.panel,bundleSha256:result.bundleSha256,checks:result.checks,matrix:result.matrix,errors:result.errors}));
if (!result.success) process.exitCode=1;
