import {readFile,writeFile,mkdir,cp,rm,readdir,lstat} from 'node:fs/promises';
import {resolve,join,relative} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {build} from 'esbuild';
const root=resolve('.'),out=resolve('prototypes/workbench/built/native-home');
const hash=b=>createHash('sha256').update(b).digest('hex');
const graph=await build({entryPoints:['src/main.js'],bundle:true,platform:'browser',format:'esm',target:'es2022',write:false,metafile:true,logLevel:'silent'});
const graphHashes={};for(const file of Object.keys(graph.metafile.inputs))graphHashes[file]=hash(await readFile(file));
await mkdir(out,{recursive:true});
// build.js is the production build route; only this study's output is written.
execFileSync(process.execPath,['build.js'],{env:{...process.env,BUILD_OUT:out},stdio:'inherit'});
for(const asset of ['style.css','styles','resources','assets','private_packs','LICENSE']){
 const dest=join(out,asset);try{if((await lstat(dest)).isSymbolicLink())await rm(dest);else continue;}catch{continue;}
 if(asset!=='private_packs')await cp(asset,dest,{recursive:true});
}
const fixture=JSON.parse(await readFile('prototypes/workbench/adapters/native-character/fresh-base.json','utf8'));
await writeFile(join(out,'fixture.json'),JSON.stringify(fixture));
for(const name of ['bridge.js','room.css'])await cp(`prototypes/workbench/studies/native-home/${name}`,join(out,name));
let html=await readFile(join(out,'index.html'),'utf8');
html=html.replace('<head>','<head><script src="bridge.js"></script>');
html=html.replace('</head>','<link rel="stylesheet" href="room.css"></head>');
await writeFile(join(out,'index.html'),html);
await writeFile(join(out,'.gitignore'),'resources/fonts/private/\n');
const sourceHashes={...graphHashes},outputHashes={};
for(const name of ['bridge.js','room.css','build.mjs']){const p='prototypes/workbench/studies/native-home/'+name;sourceHashes[p]=hash(await readFile(p));}
sourceHashes['prototypes/workbench/adapters/native-character/fresh-base.json']=hash(await readFile('prototypes/workbench/adapters/native-character/fresh-base.json'));

async function walk(dir,fn){for(const entry of await readdir(dir,{withFileTypes:true})){const p=join(dir,entry.name);if(entry.isDirectory())await walk(p,fn);else await fn(p);}}
for(const dir of ['src','styles','resources','assets','stories'])await walk(dir,async p=>sourceHashes[p]=hash(await readFile(p)));
for(const p of ['index.html','style.css','build.js','package.json','tests/fixtures/perf/mid.json','tests/fixtures/perf/crowded.json','prototypes/workbench/studies/native-home/build.mjs','prototypes/workbench/build.mjs','prototypes/workbench/workbench.js','prototypes/workbench/workbench.css','prototypes/workbench/serve.mjs','prototypes/workbench/freshness.mjs','prototypes/workbench/experiments.json','prototypes/workbench/index.html','LICENSE'])sourceHashes[p]=hash(await readFile(p));
await walk(out,async p=>{if(!p.endsWith('/INPUTS.json'))outputHashes[relative(out,p)]=hash(await readFile(p));});
for(const [file,expected]of Object.entries(graphHashes))if(hash(await readFile(file))!==expected)throw Error('Concurrent native input changed during build: '+file+'; rebuild before claiming freshness.');
const manifest={schema:1,fidelity:'native',fixture:'fresh-native-cottage-2026-11-01',sourceHashes,outputHashes,bundleSha256:outputHashes['dist/bundle.js'],route:'Current native shell and Homes/storage/rest/repair controls; public fresh base fixture plus native Cottage owner beginning. Prototype-only scene links; disposable origin; manual clock; no personal saves.'};
await writeFile(join(out,'INPUTS.json'),JSON.stringify(manifest,null,2));
console.log('Native home study frozen:',manifest.bundleSha256);
