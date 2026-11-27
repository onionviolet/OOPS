import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {launchChrome} from '../../scripts/perf/lib.mjs';
import {SNAPSHOT} from './build.mjs';
import {readinessPath} from './reading-readiness.mjs';
import {registeredBooks} from './library-reading.mjs';

const out='docs/representations/evidence/atlas-reading-survey-2026-11-25';
const registered=new Set(registeredBooks().map(book=>book.world));
const server=spawn(process.execPath,['prototypes/world-atlas/serve.mjs'],{windowsHide:true,env:{...process.env,ATLAS_PORT:'0'},stdio:['ignore','pipe','inherit']});
let browser;
try {
    const base=await new Promise((ok,fail)=>{
        server.once('exit',code=>fail(Error('Atlas exited '+code)));server.once('error',fail);
        server.stdout.on('data',bytes=>{const match=String(bytes).match(/http:\/\/127\.0\.0\.1:\d+/);if(match)ok(match[0]);});
    });
    browser=await launchChrome();
    const page=await browser.newPage({viewport:{width:1366,height:768}});
    const errors=[],checks=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('request',request=>{if(new URL(request.url()).pathname==='/reading-readiness')checks.push(request.url());});
    await page.goto(base+'/#library/coverage');
    const rows=page.locator('.reading-survey-table tbody tr');
    await rows.first().waitFor();
    assert.equal(await rows.count(),registered.size);
    const actual=await (await page.request.get(base+'/reading-survey')).json();
    const verifiedTotals={};
    for (const row of actual) {
        assert.ok(registered.has(row.world));
        const saved=JSON.parse(await readFile(readinessPath(SNAPSHOT,row.world),'utf8'));
        for (const [key,value] of Object.entries(row.totals)) {
            const fromBooks=saved.books.flatMap(book=>book.outputs).reduce((n,output)=>n+output[key],0);
            assert.equal(value,fromBooks,row.world+' '+key);
            verifiedTotals[key]=(verifiedTotals[key]||0)+value;
        }
    }
    assert.ok((await page.locator('article [aria-live]').first().innerText()).includes(verifiedTotals.parsedRows.toLocaleString('en-US')+' parsed rows'));
    const rankings={};
    for(const key of ['unindexedRows','missing','unattested','parsedRows']){
        await page.getByLabel('Rank worlds by').selectOption(key);
        const first=rows.first(),label=await first.locator('button').innerText();
        const col={unindexedRows:0,missing:1,unattested:2,parsedRows:4}[key];
        assert.equal(Number((await first.locator('td').nth(col).innerText()).replaceAll(',','')),Math.max(...actual.map(r=>r.totals[key])));
        rankings[key]=label;
    }
    await page.getByLabel('Rank worlds by').selectOption('missing');
    await mkdir(out,{recursive:true});await page.screenshot({path:out+'/coverage-1366.png'});
    await rows.first().getByRole('button').click();
    assert.equal(checks.length,0);
    await page.getByRole('button',{name:'Show measured output readiness'}).click();
    await page.getByText('Output files to follow up',{exact:true}).waitFor();
    assert.equal(checks.length,1);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    assert.deepEqual(errors,[]);
    await writeFile(out+'/result.json',JSON.stringify({worlds:actual.length,verifiedTotals,rankings,checks:checks.length,viewport:'1366x768',errors},null,2));
    console.log(JSON.stringify(rankings));
} finally {try{await browser?.close();}finally{if(server.exitCode===null&&server.signalCode===null){const exit=once(server,'exit');server.kill();await exit;}}}
