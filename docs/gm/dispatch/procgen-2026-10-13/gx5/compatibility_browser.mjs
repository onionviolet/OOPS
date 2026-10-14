// Seeded-native compatibility input derived from the earned natural unknown
// export by omitting only GX5's optional fields. Real codec/validator/UI load.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdtemp} from 'node:fs/promises';
import {chromium} from '/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {decodeSaveFile,encodeSaveFile,validateSaveEnvelope} from '../../../../../src/save_files.js';
const exported=await readFile('/private/tmp/proc-gx5-unknown.txt','utf8');
const version=JSON.parse(Buffer.from(exported.slice('YAIR-UTF8-1:'.length),'base64').toString())['game version'];
const legacy=decodeSaveFile(exported,version),stream='discovery:appearances@village.demonstration';
delete legacy.expansion.productAppearances;delete legacy.mixtures.acquisitions;delete legacy.expansion.streams.cells[stream];legacy.expansion.streams.log=legacy.expansion.streams.log.filter(r=>r.s!==stream);
legacy.character.name='TEST FIXTURE PROCGEN GX5 legacy';validateSaveEnvelope(legacy,version);
const file='/private/tmp/proc-gx5-legacy.txt';await writeFile(file,encodeSaveFile(JSON.stringify(legacy)));
const profile=await mkdtemp('/private/tmp/procgen-gx5-profile-compat-');
const c=await chromium.launchPersistentContext(profile,{channel:'chrome',headless:true,viewport:{width:1366,height:768},acceptDownloads:true});const checks=[],errors=[];
const record=(id,check)=>{checks.push({id,label:'seeded-native',check,pass:true});console.log(id+' '+check);};
try{
const p=c.pages()[0];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:19410');await p.locator('#loading_screen_play_button:not(.none_display)').waitFor();
await Promise.all([p.waitForEvent('load'),p.locator('#saved_file_input').setInputFiles(file)]);await p.locator('#loading_screen_play_button:not(.none_display)').waitFor();await p.waitForTimeout(300);
const read=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));let s=await read();assert.equal(s.expansion.productAppearances,undefined);assert.deepEqual(s.mixtures,legacy.mixtures);assert.deepEqual(s.inventories.person.main_character,legacy.inventories.person.main_character);
await p.locator('#loading_screen_play_button:not(.none_display)').click();await p.locator('#village_mixing_open').click();const id=Object.keys(s.mixtures.products)[0];assert.match(await p.locator('[data-mixture-product]').first().innerText(),/^Steeped Village mixture/);record('S1','pre-slice mixture literal-file load preserves truth/stock/knowledge and original label');
await p.locator('#mixture_craft').click();s=await read();assert.equal(s.expansion.productAppearances,undefined);assert.equal(s.inventories.person.main_character[JSON.stringify({id:'Village mixture',mixture:id})].count,2);
await p.locator('#mixture_process').selectOption('boil');await p.locator('#mixture_craft').click();s=await read();assert.equal(s.expansion.productAppearances.nextSlot,1);assert.equal(s.expansion.productAppearances.bindings[id],undefined);record('S2','repeat legacy type stays unchanged; actual new type explicitly enrolls first appearance');
// Pause with reload before testing rejected files so native ticks cannot change
// the current save. These malformed candidates never replace the real state.
await p.evaluate(()=>document.getElementById('save_button').click());await p.reload();await p.locator('#loading_screen_play_button:not(.none_display)').waitFor();const before=await read();
for(const [label,mutate]of [['unsupported pool',s=>s.expansion.productAppearances.poolId='missing.pool'],['forged binding',s=>Object.values(s.expansion.productAppearances.bindings)[0].acquisitionReceiptId='forged']]){
    const bad=structuredClone(before);mutate(bad);const path='/private/tmp/proc-gx5-bad-'+label.replaceAll(' ','-')+'.txt';await writeFile(path,encodeSaveFile(JSON.stringify(bad)));await p.locator('#saved_file_input').setInputFiles(path);
    await p.getByText('Import rejected. Current save kept.',{exact:false}).last().waitFor();assert.deepEqual(await read(),before);
}
record('S3','native literal-file unsupported-pool and forged-binding rejection keep current save exact');assert.deepEqual(errors,[]);
await writeFile(new URL('compatibility_evidence.json',import.meta.url),JSON.stringify({checks,errors},null,2)+'\n');
}finally{await c.close();}
