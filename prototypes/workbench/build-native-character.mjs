import {readFile,writeFile,mkdir,cp,rm,readdir,lstat} from 'node:fs/promises';
import {resolve,join,relative} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {build} from 'esbuild';
import {defaultCustomizationState} from '../../src/customization_profiles.js';
const root=resolve('.'),out=resolve('prototypes/workbench/built/native-character');
const hash=b=>createHash('sha256').update(b).digest('hex');
const graph=await build({entryPoints:['src/main.js'],bundle:true,platform:'browser',format:'esm',target:'es2022',write:false,metafile:true,logLevel:'silent'});
const graphHashes={};for(const file of Object.keys(graph.metafile.inputs))graphHashes[file]=hash(await readFile(file));
await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});
// build.js is the production build route; only this study's output is written.
execFileSync(process.execPath,['build.js'],{env:{...process.env,BUILD_OUT:out},stdio:'inherit'});
for(const asset of ['style.css','styles','resources','assets','private_packs','LICENSE']){
 const dest=join(out,asset);try{if((await lstat(dest)).isSymbolicLink())await rm(dest);else continue;}catch{continue;}
 if(asset!=='private_packs')await cp(asset,dest,{recursive:true});
}
const fixture=JSON.parse(await readFile('prototypes/workbench/adapters/native-character/fresh-base.json','utf8'));
const crowded=JSON.parse(await readFile('tests/fixtures/perf/crowded.json','utf8'));for(const [key,value]of Object.entries(crowded.inventories.person.main_character).slice(0,30)){fixture.inventories.person.main_character[key]=value;const id=JSON.parse(key).id;if(crowded.item_log[id])fixture.item_log[id]=crowded.item_log[id];}
delete fixture.availabilities.recipe.undefined;delete fixture.availabilities.recipe['recipe/undefined'];
fixture.customization=defaultCustomizationState();fixture.global_flags.is_crafting_unlocked=true;fixture.availabilities.skill.Cooking=1;
fixture.inventories.person.main_character[JSON.stringify({id:'Rat meat chunks'})]={count:12};fixture.item_log['Rat meat chunks']={id:'Rat meat chunks',number:12,quality_highest:0,quality_lowest:0};
await writeFile(join(out,'fixture.json'),JSON.stringify(fixture));
for(const name of ['bridge.js','treatments.css'])await cp(`prototypes/workbench/adapters/native-character/${name}`,join(out,name));
let html=await readFile(join(out,'index.html'),'utf8');
html=html.replace('<head>','<head><script src="bridge.js"></script>');
html=html.replace('</head>','<link rel="stylesheet" href="treatments.css"></head>');
await writeFile(join(out,'index.html'),html);
await writeFile(join(out,'.gitignore'),'resources/fonts/private/\n');
const sourceHashes={...graphHashes},outputHashes={};
async function walk(dir,fn){for(const entry of await readdir(dir,{withFileTypes:true})){const p=join(dir,entry.name);if(entry.isDirectory())await walk(p,fn);else await fn(p);}}
for(const dir of ['src','styles','resources','assets','stories','prototypes/workbench/adapters/native-character'])await walk(dir,async p=>sourceHashes[p]=hash(await readFile(p)));
for(const p of ['index.html','style.css','build.js','package.json','tests/fixtures/perf/mid.json','tests/fixtures/perf/crowded.json','prototypes/workbench/build-native-character.mjs','prototypes/workbench/build.mjs','prototypes/workbench/workbench.js','prototypes/workbench/workbench.css','prototypes/workbench/serve.mjs','prototypes/workbench/freshness.mjs','prototypes/workbench/experiments.json','prototypes/workbench/index.html','LICENSE'])sourceHashes[p]=hash(await readFile(p));
await walk(out,async p=>{if(!p.endsWith('/INPUTS.json'))outputHashes[relative(out,p)]=hash(await readFile(p));});
for(const [file,expected]of Object.entries(graphHashes))if(hash(await readFile(file))!==expected)throw Error('Concurrent native input changed during build: '+file+'; rebuild before claiming freshness.');
const manifest={schema:1,fidelity:'native',fixture:'mid-cook-2026-10-26',sourceHashes,outputHashes,bundleSha256:outputHashes['dist/bundle.js'],route:'Actual populated OOPS shell/controllers; CSS-only treatments; disposable origin storage; no personal profiles. Fixture prerequisites, not earned progress.'};
await writeFile(join(out,'INPUTS.json'),JSON.stringify(manifest,null,2));
console.log('Native character study frozen:',manifest.bundleSha256);
