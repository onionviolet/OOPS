import {Session, buildBundle, serve} from '../../../../../scripts/playtest/lib.mjs';
import {readFile} from 'node:fs/promises';
const W=new URL('../../../../../',import.meta.url).pathname.replace(/\/$/,'');
const old=JSON.parse(await readFile(W+'/tests/fixtures/rt_slice1/old-before-slice.save.json','utf8'));
const b=await buildBundle(),sv=await serve(b.dir),s=await new Session({url:sv.url,seed:7,wall:Date.UTC(2026,9,26,8)}).start();
const L=[];try{await s.open(old);const p=s.page;await p.waitForTimeout(800);
const loc=await p.locator('#location_name_span').innerText();L.push('loaded old save at: '+loc);
const door=p.locator('#location_actions_div [data-lotm-door]');L.push('door visible: '+await door.isVisible().catch(()=>false));
if(await door.isVisible().catch(()=>false)){await door.click();await p.waitForTimeout(300);
 const b1=p.locator('#lotm_panel button[data-lotm="enroll"]');L.push('enroll enabled: '+await b1.isEnabled());
 if(await b1.isEnabled()){await b1.click();await p.waitForTimeout(500);const after=await p.locator('#location_name_span').innerText();L.push('after enroll: '+after);
  const saved=await s.save();await s.open(saved);L.push('after reload: '+await s.page.locator('#location_name_span').innerText()+' enrolled='+JSON.stringify(await s.save()).includes('entryProfile'));}
 else L.push('reasons: '+await p.locator('#lotm_panel').innerText().then(t=>t.slice(-200)));}
L.push('page errors: '+s.errors.filter(e=>e.kind==='pageerror').length);}catch(e){L.push('ERROR '+e.message.slice(0,400));}finally{await s.close();sv.close();await b.dispose();}
console.log(L.join('\n'));
