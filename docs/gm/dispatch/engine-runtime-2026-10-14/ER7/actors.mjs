import assert from 'node:assert/strict';
import {World} from 'miniplex';
import {actor,tickActor,clock,stats,save,environment,WARM,SAMPLES} from './common.mjs';
const result={environment:environment(),method:'Rotated order per sample; batched elapsed divided by ticks; mutations and utility equal; setup separate',rows:[]};
for(const n of [1000,10000,100000])for(const activeFraction of [1,.1]) {
  const batch=Math.max(2,Math.floor(200000/n));
  const cases=['array-for-of','array-indexed','array-cached-active-indexed','miniplex-query-for-of','miniplex-query-indexed'].map(name=>{
    const t=clock();
    const actors=Array.from({length:n},(_,i)=>{const a=actor(i);if(i<n*activeFraction)a.active=true;return a;});
    let world,query;const active=actors.filter(a=>a.active);
    if(name.startsWith('miniplex')){world=new World();for(const a of actors)world.add(a);query=world.with('needs','active');query.connect();}
    const setupMs=clock()-t;
    const run=()=>{for(let j=0;j<batch;j++) {
      if(name==='array-for-of'){for(const a of actors)if(a.active)tickActor(a);}
      else if(name==='array-indexed'){for(let k=0;k<actors.length;k++)if(actors[k].active)tickActor(actors[k]);}
      else if(name==='array-cached-active-indexed'){for(let k=0;k<active.length;k++)tickActor(active[k]);}
      else if(name==='miniplex-query-for-of'){for(const a of query)tickActor(a);}
      else {const list=query.entities;for(let k=0;k<list.length;k++)tickActor(list[k]);}
    }};
    return {name,actors,run,setupMs,raw:[]};
  });
  for(let r=0;r<WARM;r++)for(const c of cases)c.run();
  for(let r=0;r<SAMPLES;r++)for(let j=0;j<cases.length;j++) {
    const c=cases[(r+j)%cases.length];const t=clock();c.run();c.raw.push(clock()-t);
  }
  for(const c of cases)assert.deepEqual(c.actors,cases[0].actors);
  for(const c of cases){const row={n,activeFraction,activeActors:n*activeFraction,batch,case:c.name,setupMs:c.setupMs,...stats(c.raw,batch)};result.rows.push(row);console.log(JSON.stringify({...row,rawMs:undefined}));}
}
result.correctness='All fields of all actors equal for every case after identical warmup and sample ticks';
result.endEnvironment=environment();save('actors-results.json',result);
