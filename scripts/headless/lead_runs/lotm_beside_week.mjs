// L4b native-state null-player fixture. Private content is read locally; output
// contains counts only. No source rows, names, user saves or network requests.
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
export async function runLotmBesideWeek({roundtrip=false}={}){
 const pack=JSON.parse(readFileSync(new URL('../../../private_packs/lotm-cast/cast.json',import.meta.url),'utf8'));
 assert.ok(pack.bindings.beats.length>=42,'CLR2 bound-beat gate');
 assert.ok(new Set(pack.bindings.days.map(d=>d.day)).size>=2,'CLR2 bound-day gate');
 const previous=globalThis.fetch;
 globalThis.fetch=async path=>({ok:true,json:async()=>String(path).endsWith('manifest.json')?{schema:1,supplements:['lotm-cast/cast.json']}:structuredClone(pack)});
 try{
  const {whenCastLoaded}=await import('../../../src/book_world_lotm_cast_days.js');await whenCastLoaded();
  const {bare,hostOver,wait,save}=await import('../../../tests/lotm_helpers.js');
  const {planLotmCastBeats,castBeatReports}=await import('../../../src/book_world_lotm_cast_host.js');
  await import('../../../src/beat_ledger.js');
  const {domainRegistry}=await import('../../../src/domain_registry.js');
  const read=domainRegistry.command('beatLedger','state'),commit=domainRegistry.command('beatLedger','commit');
  commit({facts:{},done:{},day:0});const {host,box}=hostOver(bare());host.enroll('beside');
  const days=new Map(pack.bindings.days.map(d=>[d.scene,d]));
  const boundaries=[...new Set(pack.bindings.beats.map(b=>{const d=days.get(b.scene);return (d.day-1)*1440+d.from;}))].sort((a,b)=>a-b);
  let restored=false;
  for(const minute of boundaries){
   const elapsed=box.p.state.clock-box.p.state.lotm.initializedAt;
   while(box.p.state.clock-box.p.state.lotm.initializedAt<minute){
    const before=box.p.state.clock;box.p=wait(box.p,Math.min(60,minute-(before-box.p.state.lotm.initializedAt)));
    assert.ok(box.p.state.clock>before,'native clock made no progress');
   }
   host.tick();
   // Explicit settling driver until the coordinator adopts the native host hook.
   const out=planLotmCastBeats(box.p.state,read());commit(out.ledger);
   assert.equal(planLotmCastBeats(box.p.state,read()).results.length,0,'RPT8 repeated sync');
   if(roundtrip&&!restored&&minute>=1440){
    // Exercise this domain's actual envelope hooks. JSON bytes stand for the
    // fixture's Save/reload and Export/Import, not literal browser controls.
    const before=JSON.stringify(read()),envelope=domainRegistry.save(save(box.p));
    const saved=JSON.stringify(envelope);commit({facts:{},done:{},day:0});
    const reloaded=JSON.parse(saved);domainRegistry.validate(reloaded);domainRegistry.load(reloaded);
    assert.equal(JSON.stringify(read()),before,'reload ledger');
    const exported=JSON.stringify(domainRegistry.save(reloaded)),imported=JSON.parse(exported);
    domainRegistry.validate(imported);domainRegistry.load(imported);box.p.state=imported.expansion;
    assert.equal(JSON.stringify(read()),before,'import ledger');restored=true;
   }
  }
  const ledger=read(),reports=castBeatReports(ledger),counts=[];
  for(let day=1;day<=Math.max(...days.values().map(d=>d.day));day++){
   const rows=pack.bindings.beats.filter(b=>days.get(b.scene).day===day),r={day,settled:0,blocked:0,lapsed:0,reports:reports.filter(r=>r.day===day).length};
   for(const beat of rows){const done=ledger.done[beat.id];assert.ok(done,'every bound beat resolved');assert.equal(done.day,day,'bound day');
    assert.equal(done.status,beat.mechanism?'blocked':'carried','LP9 mechanism versus settlement');
    if(['carried','altered'].includes(done.status))r.settled++;else if(done.status==='blocked')r.blocked++;else if(done.status==='lapsed')r.lapsed++;
   }counts.push(r);
  }
  if(roundtrip)assert.ok(restored,'mid-run roundtrip reached');
  return {counts,ledgerHash:createHash('sha256').update(JSON.stringify(ledger)).digest('hex'),ledger,state:box.p.state};
 }finally{globalThis.fetch=previous;}
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const out=await runLotmBesideWeek({roundtrip:process.argv.includes('--roundtrip')});
 for(const row of out.counts)console.log(JSON.stringify(row));
 console.log('ledger SHA-256 '+out.ledgerHash);
}
