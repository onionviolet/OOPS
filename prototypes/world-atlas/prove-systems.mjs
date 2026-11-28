import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {createHash} from 'node:crypto';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {launchChrome} from '../../scripts/perf/lib.mjs';

const root=fileURLToPath(new URL('../../',import.meta.url));
const out=resolve(process.argv[2]||'docs/representations/evidence/atlas-systems-2026-11-27');
const snapshot=join(root,'work/atlas-snapshot/snapshot.json');
const identity=()=>createHash('sha256').update(readFileSync(snapshot)).digest('hex');
const bundle=identity(),runs=[];
const env={...process.env,ATLAS_PORT:'0'};
delete env.ATLAS_REBUILD;delete env.ATLAS_READER_ROOT;delete env.ATLAS_SNAPSHOT;
mkdirSync(out,{recursive:true});
const server=spawn(process.execPath,['prototypes/world-atlas/serve.mjs'],{cwd:root,env,windowsHide:true,stdio:['ignore','pipe','inherit']});
let browser;
try{
    const base=await new Promise((ok,fail)=>{
        const timer=setTimeout(()=>fail(Error('Atlas did not start')),120_000);
        server.once('error',fail);server.once('exit',code=>fail(Error('Atlas exited '+code)));
        server.stdout.setEncoding('utf8').on('data',output=>{
            const match=output.match(/http:\/\/127\.0\.0\.1:\d+/);
            if(match){clearTimeout(timer);ok(match[0]);}
        });
    });
    browser=await launchChrome();
    for(const viewport of [{width:1366,height:768},{width:1920,height:1080}]){
        const page=await browser.newPage({viewport}),errors=[],captures=[];
        page.setDefaultTimeout(90_000);
        page.on('pageerror',error=>errors.push(error.message));
        const shot=async name=>{
            assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),0);
            const filename=name+'-'+viewport.width+'.png';
            await page.screenshot({path:join(out,filename)});
            captures.push(filename);
        };
        await page.goto(base+'/');
        await page.getByRole('navigation',{name:'Atlas sections'}).getByRole('button',{name:'Systems',exact:true}).click();
        const growth=page.getByRole('link',{name:/^SM1 ·/}).first();
        await growth.waitFor();
        await shot('systems');
        await growth.click();
        await page.getByRole('table').waitFor();
        const heading=page.getByRole('heading',{name:/^SM1 ·/});
        assert.equal(await heading.evaluate(node=>getComputedStyle(node).fontSize),'24px');
        assert.equal(await heading.evaluate(node=>getComputedStyle(node).lineHeight),'30px');
        await shot('sm1');
        await page.getByRole('table').scrollIntoViewIfNeeded();
        await shot('sm1-comparison');
        const cite=page.locator('[data-system-cell="AZ5"] a');
        const href=await cite.getAttribute('href');
        assert.ok(href);
        if(href.startsWith('#')){
            const id=decodeURIComponent(href.split('/').at(-1));
            const digest=page.waitForResponse(res=>res.url().includes('/readers/az')&&res.ok());
            await cite.click();
            const reader=await (await digest).json();
            assert.ok(reader.rules.some(rule=>rule.id===id));
            assert.ok(page.url().endsWith(href));
        }else {
            await cite.click();
            assert.equal((await (await page.request.get(base+href)).json()).id,'AZ5');
        }
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),0);
        await page.goto(base+'/#systems/EV2');
        await page.getByRole('heading',{name:/^EV2 ·/}).waitFor();
        assert.ok(await page.getByRole('table').getByText('A Novel Concept',{exact:true}).count());
        await shot('ev2');
        await page.getByRole('table').scrollIntoViewIfNeeded();
        await shot('ev2-comparison');
        const input=page.getByRole('searchbox',{name:'Find in Atlas',exact:true});
        await input.fill('level up');
        await input.press('Enter');
        await page.getByRole('heading',{name:'Find in Atlas',exact:true}).waitFor();
        const filter=page.getByRole('combobox',{name:'Result type',exact:true});
        await filter.selectOption('systems');
        const sm=page.locator('main a[href="#systems/SM1"]'),ev=page.locator('main a[href="#systems/EV2"]');
        await sm.first().waitFor();await ev.first().waitFor();
        await shot('find');
        assert.deepEqual(errors,[]);
        runs.push({viewport,citation:href,find:['SM1','EV2'],horizontalOverflow:0,pageErrors:errors,captures});
        await page.close();
    }
    assert.equal(identity(),bundle,'Adopted snapshot changed during browser proof');
    writeFileSync(join(out,'proof.json'),JSON.stringify({entry:'/',snapshotSha256:bundle,runs},null,2)+'\n');
}finally{
    try{await browser?.close();}
    finally{if(server.exitCode===null&&server.signalCode===null){const exited=once(server,'exit');server.kill();await exited;}}
}
