import fs from 'node:fs/promises';import assert from 'node:assert/strict';import {resolve} from 'node:path';import {pathToFileURL} from 'node:url';import {createHash} from 'node:crypto';
const root=process.argv[2],originPath=process.argv[3];
const imp=p=>import(pathToFileURL(resolve(p))),{Session}=await imp('scripts/playtest/lib.mjs'),{NativeContinuation}=await imp('scripts/playtest/native-continuation.mjs'),{serve}=await imp('scripts/perf/lib.mjs');
const origin=JSON.parse(await fs.readFile(originPath,'utf8'));
const server=await serve(root),session=await new Session({url:server.url+'?test_hooks=1',seed:7,wall:Date.UTC(2026,10,2),opTimeout:300000}).start(),route=new NativeContinuation(session);
const result={bundleSha256:createHash('sha256').update(await fs.readFile(root+'/dist/bundle.js')).digest('hex'),steps:[]};
session.page?.on('pageerror',e=>console.log('PAGEERR',String(e).slice(0,300)));session.page?.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text().slice(0,300))});
const fa=s=>s.expansion.actors.player.facts;
try{
 await route.load(origin);const p=route.page;const v0=await route.view();
 const s0=await route.snapshot();result.moneyBefore=s0.character.money;result.next=v0.arc.next?.id;
 assert.equal(v0.arc.next?.id,'book.lotm.b6r9.session','the paid session is the next task');
 await route.startCurrent({exact:false});await route.settle();
 const s=await route.snapshot();result.moneyAfter=s.character.money;
 assert.equal(s.character.money-s0.character.money,7,'purse moved once by the net fee');
 assert.equal(fa(s)['book.lotm.be.client.anna'],'paid');assert.equal(fa(s)['book.lotm.be.client.anna.fee'],7);assert.equal(fa(s)['book.lotm.be.client.anna.favor'],1);
 assert(!Object.keys(s.expansion.actors.player.resources||{}).some(k=>/be\.(client|fee|income)/.test(k)),'no second money counter');
 const log=await p.evaluate(()=>[...document.querySelectorAll('#message_box_div > *')].map(e=>e.textContent));
 result.reportLines=log.slice(-6);
 assert(log.some(t=>/Anna paid 8 pence/.test(t)),'the existing Reports show the fee line');
 // reload round trip
 const exp=s;await route.load(s);const s2=await route.snapshot();
 assert.equal(s2.character.money,s.character.money);assert.equal(fa(s2)['book.lotm.be.client.anna'],'paid');
 result.pageErrors=session.pageErrors?.length??'n/a';result.ok=true;
}catch(e){result.error=String(e.stack||e).slice(0,300);result.errors=session.errors.slice(0,5);process.exitCode=1}finally{console.log(JSON.stringify(result,null,1));await session.close?.();await server.close?.();}
