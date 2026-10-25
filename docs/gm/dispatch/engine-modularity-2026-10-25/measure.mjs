import fs from 'node:fs';
import os from 'node:os';
import {gzipSync} from 'node:zlib';
const root=process.cwd();
const {loadExpansionState,advanceSimulation}=await import(root+'/src/expansion_engine.js');
const {expeditionRegistry:registry}=await import(root+'/src/expedition_content.js');
const sample=fn=>{const a=[]; for(let i=0;i<23;i++){const t=performance.now();fn();if(i>=3)a.push(performance.now()-t);}a.sort((a,b)=>a-b);return {min:a[0],median:a[10],p95:a[19]};};
const out={node:process.version,loadavg:os.loadavg(),fixtures:{}};
for(const name of ['fresh','mid','crowded']){
 const raw=fs.readFileSync(`tests/fixtures/perf/${name}.json`,'utf8'),save=JSON.parse(raw);
 const state=loadExpansionState(save.expansion,registry),external={money:save.character.money},gameplay={player:{inventory:Object.fromEntries(Object.entries(save.inventories.person.main_character).map(([k,v])=>[k,v.count])),skills:{},reputation:{}}};
 out.fixtures[name]={bytes:Buffer.byteLength(raw),serialize:sample(()=>JSON.stringify(save)),deserialize:sample(()=>JSON.parse(raw)),hydrate:sample(()=>loadExpansionState(save.expansion,registry)),tick:sample(()=>advanceSimulation(state,registry,1,external,gameplay))};
}
const bundle=fs.readFileSync('dist/bundle.js');out.bundle={bytes:bundle.length,gzip:gzipSync(bundle).length};
fs.writeFileSync(process.argv[2],JSON.stringify(out,null,2));console.log(JSON.stringify(out));
