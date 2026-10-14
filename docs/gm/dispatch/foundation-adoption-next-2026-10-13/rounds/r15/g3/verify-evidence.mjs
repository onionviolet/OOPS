import assert from 'node:assert/strict';
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const dir=dirname(fileURLToPath(import.meta.url)), evidence=join(dir,'evidence');
const read=async name=>JSON.parse(await readFile(join(evidence,name),'utf8'));
const names=['current-00-import','current-01-study','current-02-kits','current-03-cancel-failure',
 'current-10-fa13-import','current-11-control-stamina','fa13-03-controlled-comparison','fa13-04-pins',
 'fa13-05-stave-pin-kit','fa13-06-dog-oil-feats','current-17-fa13-assertions','fa13-07-feats-ui',
 'current-20-old-absence','current-21-clouded-debit','current-30-copy-cancel-owner'];
for(const name of names)assert.equal((await read(name+'-result.json')).ok,true,name);
const study=(await read('current-01-study-result.json')).value;
assert.equal(study.fatigue.expiresAt,study.diagnostic.at+4,'four-minute fatigue');
assert.ok(study.rested.clock<study.fatigue.expiresAt,'rest completed before fatigue expiry');
const comparison=(await read('fa13-03-controlled-comparison-result.json')).value;
assert.equal(comparison.identity.kind,'inference');assert.equal(comparison.stockSame,true);
for(const name of ['current-11-control-stamina','current-21-clouded-debit']){
 const r=(await read(name+'-result.json')).value;
 assert.equal(r.pending.staminaToFull,1,name+' native debit');
 assert.match(r.liveStamina,/\d+\/\d+ stamina/);
}
const checkpoints=[];
for(const name of await readdir(evidence))if(/^persistence-current-.*\.json$/.test(name)){
 for(const {checkpoint:c} of await read(name)){
  for(const k of ['reloadExact','exportEqual','importEqual'])assert.equal(c[k],true,c.name+' '+k);
  assert.deepEqual(c.exportImportOtherDiffs,[]);assert.equal(c.bundle.match,true);assert.deepEqual(c.pageErrors,[]);
  checkpoints.push(c.name);
 }
}
const full=await read('current-checks.json');assert.equal(full.fail,0);assert.equal(full.pass,611);
const source=await read('current-source-fa13.json');assert.equal(source.results.length,13);
for(const r of source.results)assert.equal(r.status,'PASS',r.name);
const fixtures=JSON.parse(await readFile(join(dir,'fixture/VERIFICATION.json'),'utf8'));
assert.equal(fixtures.length,4);
for(const f of fixtures){assert.equal(f.importPreflight,'PASS');assert.equal(f.expansionUnchanged,true);assert.deepEqual(f.loadWarnings,[]);assert.match(f.name,/^TEST FIXTURE R15 G3 /);}
const result={status:'PASS',browserSteps:names.length,checkpointCount:checkpoints.length,checkpoints,
 npmTest:{label:'source',pass:full.pass,fail:full.fail},fa13Probe:{label:'source',pass:source.results.length},
 browserLabel:'seeded-native',remainingNative:['FA10 forced support loss and synthetic guard inputs','FA10 guided and fine-tool alternatives','FA13 forced support/body/clock/custody/forged-input cases','FA13-specific failed storage writes'],
 humanAcceptance:'fiction, pacing and balance remain with Weibao'};
await writeFile(join(evidence,'VERDICT.json'),JSON.stringify(result,null,1)+'\n');
console.log(JSON.stringify(result));
