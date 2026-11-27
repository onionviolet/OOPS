// Same-save native projection measurement. No browser or default bundle build.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {performance} from 'node:perf_hooks';
import {boot,bundleGame} from '../headless/runner.mjs';

const input=resolve(process.argv[2]);
const output=resolve(process.argv[3]);
const hash=value=>createHash('sha256').update(value).digest('hex');
const bytes=await readFile(input);
const sources=['src/audit_remainder_facts.js','src/book_world_lotm_host.js',
 'src/book_world_lotm_ui.js','private_packs/manifest.json','private_packs/lotm-cast/cast.json'];
const identities=async()=>Object.fromEntries(await Promise.all(sources.map(async file=>[file,hash(await readFile(file))])));
const canonical=value=>Array.isArray(value)?value.map(canonical):value&&typeof value==='object'?
 Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])])):value;
const snapshot=game=>{
 const saved=game.snapshot();delete saved.saved_at;
 return hash(JSON.stringify(canonical(saved)));
};
function gates(value,path='$',out=[]){
 if(!value||typeof value!=='object')return out;
 if(!Array.isArray(value)&&Object.keys(value).some(k=>['eligible','allowed','blocked','available','ready','visible'].includes(k)))out.push({path,value});
 for(const [key,child] of Object.entries(value))gates(child,path+'.'+key,out);
 return out;
}

let game;
const result={schema:1,inputSha256:hash(bytes),sources:await identities(),times:[],views:[],gatedActions:[],stateReadOnly:true};
try{
 const build=await bundleGame();result.nativeCandidateSha256=hash(await readFile(build));
 game=await boot(JSON.parse(bytes),{seed:87});
 result.stateBefore=snapshot(game);
 for(let i=0;i<5;i++){
  const before=snapshot(game),start=performance.now();
  const view=globalThis.simulationTestHooks.project('lotm');
  result.times.push(performance.now()-start);
  result.views.push({raw:hash(JSON.stringify(view)),canonical:hash(JSON.stringify(canonical(view)))});
  const rows=gates(view);result.gatedActions.push({count:rows.length,sha256:hash(JSON.stringify(canonical(rows)))});
  result.stateReadOnly&&=before===snapshot(game);
 }
 result.stateAfter=snapshot(game);result.stateReadOnly&&=result.stateBefore===result.stateAfter;
 result.errors=game.errors.map(error=>String(error));
 result.sourcesUnchanged=JSON.stringify(result.sources)===JSON.stringify(await identities());
 await mkdir(dirname(output),{recursive:true});await writeFile(output,JSON.stringify(result,null,2)+'\n');
 assert.equal(result.stateReadOnly,true,'native projection changed serialized save state');
 assert.equal(result.sourcesUnchanged,true,'source/pack inputs changed during measurement');
 assert.deepEqual(result.errors,[],'native game recorded errors');
 assert.equal(new Set(result.views.map(v=>v.canonical)).size,1,'unchanged input changed its view');
 console.log(JSON.stringify({inputSha256:result.inputSha256,times:result.times,stateReadOnly:result.stateReadOnly,
  view:result.views[0],gatedActions:result.gatedActions[0],nativeCandidateSha256:result.nativeCandidateSha256}));
}finally{game?.close();}
