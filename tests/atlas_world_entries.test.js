import test from 'node:test';import assert from 'node:assert/strict';import{readFile}from'node:fs/promises';
import{NATIVE_WORLD_ENTRIES,withNativeWorldEntries,worldEntryRole,overviewSummary,overviewRows,worldNodeLabel}from'../prototypes/world-atlas/world-entry-inventory.mjs';
import{wormLeadLife}from'../src/world_packs/book_worm_lead_life.js';import{supLeadLife}from'../src/world_packs/book_sup_lead_life.js';
import{CAPABILITY_RUNS}from'../src/capability_runs/index.js';import{runShows}from'../src/capability_runs_domain.js';
const source=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
test('listed typed beginnings match actually composed registration and loaded start owners',async()=>{
 const reg=await source('src/book_world_beginning_registration.js'),main=await source('src/main.js');
 assert.match(main,/await registerBookBeginnings\(registerStructuredNative,beginningChoices/);
 for(const [id,owner,variable]of[['worm',wormLeadLife,'worm'],['sup',supLeadLife,'supLead']]){
  const entry=NATIVE_WORLD_ENTRIES.find(x=>x.id===id);assert.equal(entry.kind,'typed-beginning');assert.equal(entry.packId,owner.id);assert.ok(owner.starts.length);
  assert.match(reg,new RegExp('choices\\.register\\(\\{packId: '+variable+'\\.id, label: '+JSON.stringify(entry.choice).replaceAll('"',"'")));
  assert.ok(owner.starts.some(s=>owner.locations.some(p=>p.id===s.locationId)));
 }
 const choice=await source('src/structured_beginning_choice.js');assert.match(choice,/context.worldId !== 'base.frontier'.*context.facts\?\.location !== 'Village'.*context.busy/);
});
test('Ryan is the registered ordinary-life independent run, not a typed Beginning',async()=>{
 const entry=NATIVE_WORLD_ENTRIES.find(x=>x.id==='pr'),run=CAPABILITY_RUNS.find(x=>x.id===entry.runId);
 assert.equal(entry.kind,'capability-run');assert.equal(run.run.title,entry.choice);assert.equal(run.world,'book.perfect_run.');assert.equal(runShows(entry.runId,'base.frontier'),true);assert.equal(runShows(entry.runId,'book.sup.lead.world'),false);
 assert.match(entry.scope,/independent saved capability run.*does not move.*typed Beginning/);
 assert.doesNotMatch(await source('src/book_world_beginning_registration.js'),/label: 'The Perfect Run|label: 'Ryan Romano/);
});
test('reader shelf IDs share the native world row; readings and source games cannot create playable entries',()=>{
 const base=[{id:'village',views:['places']},{id:'worm',readOnly:true,views:['things','reading']},{id:'reader-only',readOnly:true,views:['things']},{id:'yair',source:'yair',views:['source']},{id:'frontier',registeredOnly:true,views:['locations']}];
 const rows=withNativeWorldEntries(base);assert.equal(base[1].readOnly,true);assert.equal(rows.filter(x=>x.id==='worm').length,1);assert.equal(rows.find(x=>x.id==='worm').readOnly,false);assert.equal(rows.find(x=>x.id==='reader-only').readOnly,true);
 assert.equal(overviewSummary(rows,[{}]),'5 worlds with native routes listed in this Atlas · 1 source-game reference · 1 reading world without a listed native entry');
 assert.equal(overviewSummary([{id:'village'}],[]),'1 world with native routes listed in this Atlas · 0 source-game references · 0 reading worlds without a listed native entry');
 assert.equal(worldEntryRole(rows.find(x=>x.id==='worm')),'Native Beginning · bounded opening');assert.equal(worldEntryRole(rows.find(x=>x.id==='pr')),'Independent capability run');assert.equal(worldEntryRole(base[3]),'Source game · reference');assert.equal(worldEntryRole(base[4]),'Registered content · entry not listed');assert.equal(worldEntryRole(base[2]),'Reader findings · no native entry listed');
});
test('overview map includes all three entries with selected directions, without claiming reader-place travel',async()=>{
 const index=await readFile(new URL('../prototypes/world-atlas/index.html',import.meta.url),'utf8'),serve=await readFile(new URL('../prototypes/world-atlas/serve.mjs',import.meta.url),'utf8');
 const ids=overviewRows.flat();for(const e of NATIVE_WORLD_ENTRIES){assert.equal(ids.filter(id=>id===e.id).length,1);assert.match(e.scope,/Reader places are not all travel destinations|does not.*expose all reader places/)}
 assert.match(index,/const WORLDS=withNativeWorldEntries\(\[/);assert.match(index,/const order=overviewRows/);assert.match(index,/label:worldNodeLabel\(w,count\)/);assert.match(index,/overviewSummary\(WORLDS,readingOnly\)/);assert.match(index,/worldEntryRole\(w\)/);assert.match(index,/if\(w.nativeEntry\).*w.nativeEntry.route.*w.nativeEntry.scope/);
 assert.doesNotMatch(index,/read but not used by the game yet|reading worlds have no game consumer yet/);assert.match(serve,/'\/world-entry-inventory.mjs':\['.\/world-entry-inventory.mjs'/);
 const roster=index.match(/const WORLDS=withNativeWorldEntries\(\[([\s\S]*?)\]\);/)[1];assert.match(roster,/id:'proto23',registeredOnly:true/);assert.match(roster,/id:'testpacks',registeredOnly:true/);assert.match(roster,/id:'frontier',registeredOnly:true/);
});

test('entry nodes distinguish a real route from absent mapped-location data',()=>{
 for(const entry of NATIVE_WORLD_ENTRIES){const world={label:entry.label,nativeEntry:entry};assert.equal(worldNodeLabel(world,0),entry.label+' · '+(entry.kind==='typed-beginning'?'Beginning':'Capability run'));assert.equal(worldNodeLabel(world,2),entry.label+' · 2');assert.match(entry.route,/^From a fresh Village life,/);assert.doesNotMatch(entry.route,/unoccupied/);}
 assert.equal(worldNodeLabel({label:'Registered reference'},0),'Registered reference · 0');
});
