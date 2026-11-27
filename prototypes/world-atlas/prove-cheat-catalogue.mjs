import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {mkdir,writeFile} from 'node:fs/promises';
import {launchChrome} from '../../scripts/perf/lib.mjs';

const out='docs/representations/evidence/atlas-cheat-catalogue-2026-11-25';
const server=spawn(process.execPath,['prototypes/world-atlas/serve.mjs'],{
    windowsHide:true,env:{...process.env,ATLAS_PORT:'0'},stdio:['ignore','pipe','inherit'],
});
let browser;
try {
    const base=await new Promise((resolve,reject)=>{
        server.once('error',reject);
        server.once('exit',code=>reject(Error('Atlas exited '+code)));
        server.stdout.on('data',bytes=>{
            const url=String(bytes).match(/http:\/\/127\.0\.0\.1:\d+/);
            if(url)resolve(url[0]);
        });
    });
    const response=await fetch(base+'/cheat-catalogue');assert.equal(response.status,200);
    const sections=await response.json();
    browser=await launchChrome();
    const page=await browser.newPage({viewport:{width:1366,height:768}});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base+'/#library/cheats');
    const family=page.getByLabel('Family',{exact:true}), search=page.getByLabel('Search cheats');
    await family.waitFor();
    const counts={};
    for(const section of sections){
        await family.selectOption(section.id);
        assert.equal(await page.locator('details[id^="atlas-cheat-"]').count(),section.cheats.length);
        const compared=section.examples.map(example=>example.ordinary.match(/^CTC\d+/)?.[0]);
        assert.deepEqual(new Set(compared),new Set(section.cheats.map(c=>c.id)),'individual comparisons for '+section.id);
        counts[section.name]=section.cheats.length;
    }
    await family.selectOption('');
    await search.fill('CTC1');
    assert.equal(await page.locator('details[id^="atlas-cheat-"]').count(),1);
    await page.locator('#atlas-cheat-CTC1 > summary').click();
    assert.match(await page.locator('#atlas-cheat-CTC1').innerText(),/true-appraisal/i);
    assert.match(await page.locator('#atlas-cheat-CTC1').innerText(),/Ordinary decision/);
    await mkdir(out,{recursive:true});
    await page.screenshot({path:out+'/appraisal-1366.png'});
    await search.fill('no-such-cheat-21842');
    await page.getByText('No matching cheats. Change the family or search.').waitFor();
    await search.fill('');
    const source=await fetch(base+await page.getByText('Open catalogue source').getAttribute('href'));
    assert.equal(source.status,200);assert.match(await source.text(),/^# Cheat catalogue/);
    await family.selectOption('G');await search.fill('CTC64');
    await page.locator('#atlas-cheat-CTC64 > summary').click();
    await page.locator('#atlas-cheat-CTC64 a').click();
    await page.getByRole('heading',{name:'Roll override',exact:true}).waitFor();
    const proofLink=page.getByRole('link',{name:'Open native playtest results'});
    const native=await (await fetch(base+await proofLink.getAttribute('href'))).json();
    assert.equal(native.ok,true);assert.deepEqual(native.results.map(r=>r.peltQuality),[75,70,80]);
    await page.screenshot({path:out+'/roll-override-detail-1366.png'});
    await page.goBack();await family.waitFor();
    assert.equal(await family.inputValue(),'G');assert.equal(await search.inputValue(),'CTC64');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    assert.deepEqual(errors,[]);
    await writeFile(out+'/proof.json',JSON.stringify({viewport:[1366,768],sections:counts,
        comparisons:sections.map(s=>s.examples.length),searchAndReset:true,source:true,pageErrors:errors},null,2)+'\n');
    console.log(JSON.stringify(counts));
} finally {
    try{await browser?.close();}finally{
        if(server.exitCode===null && server.signalCode===null){
            const stopped=once(server,'exit');server.kill();await stopped;
        }
    }
}
