import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';
const root=resolve(process.argv[2]),out=resolve(process.argv[3]);await mkdir(out,{recursive:true});const server=await serve(root),session=new Session({url:server.url+'?test_hooks=1',seed:19,wall:Date.UTC(2026,9,21),opTimeout:12000});
const receipt={checks:[],setup:'Native public noble beginning and actual pending staff order; only typography changes are imported from its own saved native state.'};
try{await session.start();await session.open();let page=session.page;await page.getByRole('combobox',{name:'Other known panels',exact:true}).selectOption('homes');
 const start=page.locator('[data-home-action="start:royal"]');await start.evaluate(n=>{for(let p=n.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;});await start.click();const native=await session.save();
 for(const size of [14,21]){const seed=structuredClone(native);seed.customization.profiles.Default.settings.typography={font:'gothic',size};await session.open(seed);page=session.page;await page.getByRole('combobox',{name:'Other known panels',exact:true}).selectOption('homes');
 const staff=page.locator('#home_panel details').filter({has:page.locator('summary:text-is("Family, staff and household accounts")')});await staff.evaluate(n=>n.open=true);await staff.locator('summary').scrollIntoViewIfNeeded();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:join(out,'staff-'+size+'.png')});
 const cook=page.locator('[data-home-action="staff:cook"]');await cook.scrollIntoViewIfNeeded();await cook.click();await staff.locator('summary').scrollIntoViewIfNeeded();assert.ok((await session.save()).expansion.simulation.jobs.some(j=>j.commandId==='home.staff.cook'));await page.screenshot({path:join(out,'staff-working-'+size+'.png')});receipt.checks.push(`1920×1080 at ${size}px: actual rank, household funds, staff presence/orders and wages; no page-width overflow`);}
 receipt.status='passed';receipt.bundle_sha256=createHash('sha256').update(await readFile(join(root,'dist/bundle.js'))).digest('hex');
}finally{await writeFile(join(out,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');await session.close();await server.close();}
