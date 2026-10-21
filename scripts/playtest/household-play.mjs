// Fresh rebuilt origin; synthetic owned home/cloth, native commands thereafter.
import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';
import {canonicalSave,diffSaves} from '../headless/runner.mjs';
import {firewoodFixture} from '../../tests/helpers/household_firewood_fixture.mjs';

const root=resolve(process.argv[2]),out=resolve(process.argv[3]||'/tmp/oops-household-play-proof');await mkdir(out,{recursive:true});
const server=await serve(root),missing=[];
const session=new Session({url:server.url+'?test_hooks=1',seed:19,wall:Date.UTC(2026,9,21),opTimeout:12000,
    hooks:{beforeOpen:c=>c.on('response',r=>{if(r.status()===404)missing.push(new URL(r.url()).pathname);})}});
const receipt={setup:'Synthetic owned Shack, installed hearth, carried logs and Linen cloth. Meet, play, sitting, hearth and persistence use native controls. No natural campaign acquisition claim.',checks:[]};
let page;
const cloth=JSON.stringify({id:'Linen cloth'});
const action=id=>page.locator(`[data-household-action="${id}"]`);
async function home(){page=session.page;await page.locator('button[data-place-tab="options"]').click();await page.locator('#p23_household_panel').evaluate(el=>{el.open=true;});}
async function history(){await page.locator('[data-household-animal-history]').evaluate(el=>{el.open=true;});}
async function replay(){await page.waitForFunction(()=>typeof simulationTestHooks==='object');await page.evaluate(()=>simulationTestHooks.pause());await page.locator('#loading_screen_play_button').click();await home();}
async function persist(label){
    const before=await session.save();await page.reload();await replay();
    assert.deepEqual(diffSaves(canonicalSave(await session.save()),canonicalSave(before)),[]);
    const literal=await page.evaluate(()=>save_to_file()),exported=await session.save();await writeFile(join(out,label+'-export.txt'),literal);
    await Promise.all([page.waitForEvent('load'),page.evaluate(raw=>load_progress(raw),literal)]);await replay();
    assert.deepEqual(diffSaves(canonicalSave(await session.save()),canonicalSave(exported)),[]);
    await history();assert.match(await page.locator('#p23_household_panel').innerText(),/Likes chasing a trailing cloth/);
    receipt.checks.push(`${label}: exact Save/reload/Export/literal Import retains the learned preference with no replayed bond`);
}
try{
    await session.start();await session.open();const seed=firewoodFixture(await session.save());seed.inventories.person.main_character[cloth]={count:1};
    await session.open(seed);await home();await action('meet').click();
    assert.equal(await action('play').isEnabled(),false);await session.step(5);await home();
    await action('play').focus();await page.evaluate(()=>{window.referencePlayButton=document.querySelector('[data-household-action="play"]');});
    await session.step(1);
    assert.equal(await page.evaluate(()=>document.activeElement===window.referencePlayButton&&window.referencePlayButton===document.querySelector('[data-household-action="play"]')),true,'native refresh preserves exact focused control');
    await action('play').click();let save=await session.save();assert.equal(save.household.animal.playVisits,1);assert.equal(save.household.animal.bond,20);
    assert.equal(save.inventories.person.main_character[cloth].count,1);assert.equal(await action('play').isEnabled(),false);assert.equal(await action('pet').isEnabled(),false);
    await history();assert.match(await page.locator('#p23_household_panel').innerText(),/Likes chasing a trailing cloth/);
    receipt.checks.push('Native meet/play learns preference, keeps cloth and shares the five-minute visit boundary; native refresh keeps focused node');
    await persist('played');await session.step(5);await home();await action('pet').click();assert.equal((await session.save()).household.animal.adopted,true);
    await action('light').click();assert.match(await page.locator('.household-scene-animal').innerText(),/curls up beside the warm hearth/);
    await action('close_vent').click();await action('smoke_on').click();await session.step(1);await home();
    assert.match(await page.locator('.household-scene-animal').innerText(),/outside the smoky room/);assert.equal(await action('play').isEnabled(),false);
    await action('ventilate').click();assert.match(await page.locator('.household-scene-animal').innerText(),/curls up beside the warm hearth/);
    receipt.checks.push('Native warmth and actual smoke change the observed posture and eligibility; ventilation restores it without a cosmetic timer');
    await persist('adopted');
    for(const size of [14,21]){
        const view=await session.save();view.customization.profiles.Default.settings.typography={font:'gothic',size};await session.open(view);await home();await history();
        for(const [width,height]of [[1920,1080],[1800,1040],[1536,864]]){
            await page.setViewportSize({width,height});await page.locator('.household-scene-animal').scrollIntoViewIfNeeded();
            assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
            assert.match(await page.locator('#p23_household_panel').innerText(),/Likes chasing a trailing cloth/);
            await page.screenshot({path:join(out,`household-${size}-${width}.png`)});
            await action('pet').scrollIntoViewIfNeeded();await page.screenshot({path:join(out,`controls-${size}-${width}.png`)});
        }
    }
    receipt.checks.push('Actual 14/21px profile at 1920×1080, 1800×1040 and 1536×864 retains readable known history and controls without page-width overflow');
    // Component-only race fixture. It uses the same rebuilt source module, without
    // pretending a synthetic home switch is a natural world-travel journey.
    const component=await page.evaluate(async()=>{
        const {createHouseholdPanel}=await import('/src/absorb_p23/host_joins/tranche_one_ui.js');
        const results=[];
        for(const initialized of [false,true]){
            const host=document.createElement('div');document.body.append(host);let calls=0;
            let frame={subjectKey:'home-A',visible:true,disabled:false,scene:initialized?{subjectKey:'home-A',fixtures:[]}:undefined,records:['Known home'],actions:[{id:'play',label:'Play',enabled:true}]};
            const panel=createHouseholdPanel({host,read:()=>frame,act:()=>calls++});const button=host.querySelector('button');
            button.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));frame={...frame,subjectKey:'home-B',scene:initialized?{subjectKey:'home-B',fixtures:[]}:undefined};panel.render();button.click();
            results.push({rejected:calls===0});button.click();results.at(-1).fresh=calls===1;host.remove();
        }return results;
    });assert.deepEqual(component,[{rejected:true,fresh:true},{rejected:true,fresh:true}]);receipt.checks.push('Component-only stale-home pointer gestures reject A-to-B rebinding before enrollment and with an existing scene; fresh activations work');
    const unexpected=missing.filter(p=>p!=='/private_packs/manifest.json');assert.deepEqual(unexpected,[]);
    const errors=session.errors.filter(e=>!(e.kind==='console'&&e.text==='Failed to load resource: the server responded with a status of 404 (Not Found)'));assert.deepEqual(errors,[]);
    receipt.status='passed';receipt.bundle_sha256=createHash('sha256').update(await readFile(join(root,'dist/bundle.js'))).digest('hex');receipt.optional404s=[...new Set(missing)];
}catch(error){receipt.status='failed';receipt.failure=error.stack;if(page)await page.screenshot({path:join(out,'failure.png')}).catch(()=>{});throw error;}
finally{await writeFile(join(out,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');await session.close();await server.close();}
process.stdout.write(JSON.stringify(receipt,null,2)+'\n');
