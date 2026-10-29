import assert from 'node:assert/strict';import {readFile,writeFile} from 'node:fs/promises';import {pathToFileURL} from 'node:url';
const [dir,kind,out,mode='span',wakeMode='true',probe='normal']=process.argv.slice(2),{boot}=await import(pathToFileURL(dir+'/scripts/headless/runner.mjs').href);
const loadStart=performance.now();const g=await boot(null,{heroName:null,seed:37});let result;
try{
 await g.module.p5CastReady();await g.settle();
 if(kind==='beside'||kind==='be'){
  if(kind==='beside'){await g.fill('[aria-label="Other known panels"]','lotm');await g.click('[data-lotm="pick_beside"]');await g.click('[data-lotm="enroll_beside"]');}
  else {g.module.p5EnrollBe();}
  await g.settle();assert.ok(g.internals.expansionState.lotm);assert.ok(Object.keys(g.internals.expansionState.simulation.people).length>10);
 }
 if(kind==='reading'){g.internals.character.addToInventory([{item_id:'Old combat manual',count:1}]);await g.call('update_displayed_character_inventory');await g.call('start_reading','Old combat manual');assert.equal(g.internals.is_reading,'Old combat manual');}
 g.module.p5SetWakeMode?.(wakeMode==='true');
 g.module.setClockSpanModeForTests(mode);let close;
 const controllers=structuredClone(g.internals.expansionState.simulation?.controllers||{});
 window.__wakeFixture={boundaries:0,publications:0};
 window.__p5stats={};const stack=[];
 window.__p5measure=(key,run)=>{const f={key,start:performance.now(),child:0};stack.push(f);try{return run();}finally{const ms=performance.now()-f.start;stack.pop();if(stack.length)stack.at(-1).child+=ms;const r=window.__p5stats[key] ||= {calls:0,ms:0,self:0};r.calls++;r.ms+=ms;r.self+=ms-f.child;}};
 const loadMs=performance.now()-loadStart;const mt=performance.now();g.internals.update_timer(1);await g.settle();const minuteMs=performance.now()-mt;const minuteStats=structuredClone(window.__p5stats);window.__p5stats={};close=g.module.openStepperBatch(false);
 const start=g.internals.expansionState.clock,t=performance.now();let consumed=0,calls=0;
 while(consumed<349){assert.ok(calls++<350);const n=g.internals.update_timer(349-consumed,'wait');assert.ok(n>0);consumed+=n;}
 close();await g.settle();
 result={kind,mode,loadMs,minuteMs,minuteStats,controllers,consumed,delta:g.internals.expansionState.clock-start,calls,ms:performance.now()-t,stats:window.__p5stats,boundaries:window.__wakeFixture.boundaries,publications:window.__wakeFixture.publications,errors:[...g.errors],state:JSON.stringify(g.internals.expansionState),save:g.internals.create_save()};assert.deepEqual(g.errors,[]);
 if(probe==='restore'){
  const pack=JSON.parse(await readFile(dir+'/private_packs/lotm-cast/cast.json','utf8'));
  const target=pack.places.find(p=>p.travel&&!p.anchorOnly&&p.id!==g.internals.expansionState.simulation.people.player.location);
  assert.ok(target);await g.click('[data-lotm="lotm.move.'+target.id+'"]');
  const before=JSON.stringify(g.internals.expansionState),job=g.internals.expansionState.simulation.jobs.find(j=>j.commandId.startsWith('book.lotm.cast_walk_'));
  assert.ok(job);await g.save();await g.reload();await g.module.p5CastReady();await g.settle();
  assert.equal(JSON.stringify(g.internals.expansionState),before);
  const encoded=await g.exportFile();await g.importFile(encoded);await g.module.p5CastReady();await g.settle();
  assert.equal(JSON.stringify(g.internals.expansionState),before);
  assert.equal(g.internals.expansionState.simulation.people.player.location,target.id);
  assert.deepEqual(g.errors,[]);result.persistence={saved:true,reloaded:true,exported:true,imported:true,exactState:true,activeWalk:true};
 }
}finally{g.close();}
await writeFile(out,JSON.stringify(result));console.log(JSON.stringify({...result,state:undefined,save:undefined}));
