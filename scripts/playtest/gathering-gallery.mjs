// Gallery evidence for the gathering fixtures (Luminous Gothic and Neutral side by side), headless 1920x1080.
// Usage: node scripts/playtest/gathering-gallery.mjs <repo root> <out dir>
import {resolve,join} from 'node:path';
import {mkdir} from 'node:fs/promises';

import {serve, launchChrome} from '../perf/lib.mjs';
const root=resolve(process.argv[2]||'.'),out=resolve(process.argv[3]||'docs/representations/evidence/gathering');await mkdir(out,{recursive:true});
const server=await serve(root),browser=await launchChrome(),errors=[];
try{
    const page=await browser.newPage({viewport:{width:1920,height:1080}});page.on('pageerror',e=>errors.push(e.message));
    await page.goto(server.url+'figure-gallery.html');
    for(const id of ['gather-bloom','gather-fall','gather-plain','gather-insight']){
        const section=page.locator(`[data-fixture="${id}"]`);await section.waitFor();await section.scrollIntoViewIfNeeded();
        await section.screenshot({path:join(out,`gallery-${id}.png`)});
    }
    if(errors.length)throw new Error(errors.join('\n'));console.log('PASS');
}finally{await browser.close();await server.close?.();}
