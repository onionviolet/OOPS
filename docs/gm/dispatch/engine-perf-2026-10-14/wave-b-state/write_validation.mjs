// node write_validation.mjs <repoOrBaseRoot> [fixture]: validation CPU ms per durable write (engine + persist + envelope), plus the three expansion validations with the registry passed through
import {fileURLToPath} from 'node:url';import path from 'node:path';
const REPO=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../../..');
import fs from 'node:fs';import {pathToFileURL} from 'node:url';
const root=process.argv[2],fx=process.argv[3]||'crowded';const imp=p=>import(pathToFileURL(root+'/src/'+p).href);
const {advanceSimulation,validateExpansionState}=await imp('expansion_engine.js');
const {validateSaveEnvelope}=await imp('save_files.js');
const {expeditionRegistry:registry}=await imp('expedition_content.js');
const env=JSON.parse(fs.readFileSync(REPO+`/tests/fixtures/perf/${fx}.json`,'utf8'));
const ver=env['game version'];
let st=env.expansion;const states=[];for(let i=0;i<12;i++){st=advanceSimulation(st,registry,1,{money:1000},{}).state;states.push(st);}
const ms=d=>(d.user+d.system)/1000;
const run=(label,fn)=>{for(const s of states.slice(0,2))fn(s);const t=[];for(const s of states.slice(2)){const c=process.cpuUsage();fn(s);t.push(ms(process.cpuUsage(c)));}t.sort((a,b)=>a-b);return +t[t.length>>1].toFixed(2);};
// Fresh deep copies so each write sees new objects with new content.
const fresh=s=>JSON.parse(JSON.stringify(s));
const engineOnly=run('engine',s=>validateExpansionState(fresh(s),registry));
const write=run('write',s=>{const x=fresh(s);validateExpansionState(x,registry);validateExpansionState(x);validateSaveEnvelope({...env,expansion:x},ver);});
const proj=run('proj',s=>{const x=fresh(s);validateExpansionState(x,registry);validateExpansionState(x,registry);validateExpansionState(structuredClone(x),registry);});
const envOnly=run('env',s=>validateSaveEnvelope({...env,expansion:fresh(s)},ver));
const parse=run('parse',s=>fresh(s));
console.log(fx,JSON.stringify({freshCopyMs:parse,engineValidateMs:engineOnly,envelopeValidateMs:envOnly,perWriteAllThreeMs:write,expansionThreeWithRegistryMs:typeof proj==='undefined'?null:proj}));
