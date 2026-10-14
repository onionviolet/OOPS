import assert from 'node:assert/strict';import {readFile,writeFile} from 'node:fs/promises';
import {chromium} from '/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const c=await chromium.launchPersistentContext('/private/tmp/procgen-p2-profile-holders-final',{channel:'chrome',headless:true,viewport:{width:1366,height:768}});const checks=[];
try{const p=c.pages()[0],errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:19320');await p.locator('#loading_screen_play_button:not(.none_display)').click();await p.locator('#hero_creation_name_field').fill('TEST FIXTURE PROCGEN P2 holders');await p.locator('#hero_creation_panel_confirmation').click();
    await Promise.all([p.waitForEvent('load'),p.locator('#saved_file_input').setInputFiles('/private/tmp/proc-p2-holders.txt')]);await p.locator('#loading_screen_play_button:not(.none_display)').waitFor();assert.doesNotMatch(await p.locator('#loading_screen').innerText(),/Something went wrong|error has/i);
    const expected=JSON.parse(await readFile('/private/tmp/proc-p2-holders-expected.json','utf8'));
    await p.evaluate(()=>window.save_to_file());let s=await p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));
    assert.deepEqual(s.mixtures,expected.mixtures);assert.deepEqual(s.inventories,expected.inventory);assert.deepEqual(s.active_effects['Village mixture exposure'],expected.exposure);checks.push({id:'S1',label:'seeded-native',check:'literal-file import reconstructs exact carried/chest/vendor variants',pass:true});
    await p.reload();await p.locator('#loading_screen_play_button:not(.none_display)').waitFor();await p.evaluate(()=>window.save_to_file());s=await p.evaluate(()=>JSON.parse(localStorage.getItem('save data')));assert.deepEqual(s.inventories,expected.inventory);checks.push({id:'S2',label:'seeded-native',check:'all holder variants retain identity on Save/reload',pass:true});
    assert.deepEqual(errors,[]);await writeFile(new URL('holder_evidence.json',import.meta.url),JSON.stringify({checks},null,2)+'\n');console.log(JSON.stringify(checks));
}finally{await c.close();}
