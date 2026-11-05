import {readFile,writeFile,cp,rm,readdir,mkdir} from 'node:fs/promises';
import {resolve,join,relative} from 'node:path';import {createHash} from 'node:crypto';import {build} from 'esbuild';
// Reuse the existing isolated build/assets route rather than another packaging pipeline.
await import('../functional-home/build.mjs');
const base=resolve('prototypes/workbench/built/functional-home'),out=resolve('prototypes/workbench/built/equipment-comparison'),study='prototypes/workbench/studies/equipment-comparison';
await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});await cp(base,out,{recursive:true});
const bundle=await build({entryPoints:[study+'/native-entry.js'],bundle:true,sourcemap:true,minify:true,outfile:out+'/dist/bundle.js',platform:'browser',target:'es2022',format:'esm',metafile:true,logLevel:'silent'});
await build({entryPoints:[study+'/panel.js'],bundle:true,format:'iife',platform:'browser',target:'es2022',outfile:out+'/overlay.js',logLevel:'silent'});
await cp(study+'/bridge.js',out+'/bridge.js');await cp(study+'/equipment.css',out+'/equipment.css');let html=await readFile(out+'/index.html','utf8');html=html.replace('</head>','<link rel="stylesheet" href="equipment.css"></head>');await writeFile(out+'/index.html',html);
const fixture=JSON.parse(await readFile('tests/fixtures/perf/mid.json','utf8'));delete fixture.availabilities?.recipe?.undefined;if(fixture.availabilities?.recipe)delete fixture.availabilities.recipe['recipe/undefined'];
const tool=JSON.stringify({id:'Iron pickaxe',e2_instance:'e2.901'}),gear=JSON.stringify({components:{head:'Cheap iron short blade',handle:'Simple wooden short handle'},quality:100,e2_instance:'e2.902'});
fixture.equipment_durability={schema:1,enabled:true,nextId:903,condition:{[tool]:35,[gear]:62}};fixture.tools={schema:1,instances:{},job:null};fixture.global_flags.is_crafting_unlocked=true;fixture.availabilities.dialogue.oldCraftsman=1;
for(const [key,count]of[[tool,1],[gear,1],[JSON.stringify({id:'Iron ingot'}),3],[JSON.stringify({id:'Iron short blade',quality:100}),2],[JSON.stringify({id:'Simple wooden short handle',quality:100}),2],[JSON.stringify({id:'Charcoal'}),3]])fixture.inventories.person.main_character[key]={count};
await writeFile(out+'/fixture.json',JSON.stringify(fixture));
const hash=b=>createHash('sha256').update(b).digest('hex'),m=JSON.parse(await readFile(base+'/INPUTS.json','utf8'));m.fixture='public-mid-with-prepared-worn-tool-and-gear';m.route='Isolated native tool repair and gear component swap review; prepared fixture stock, no personal save.';
async function walk(dir,fn){for(const e of await readdir(dir,{withFileTypes:true})){const p=join(dir,e.name);if(e.isDirectory())await walk(p,fn);else await fn(p);}}
await walk(study,async p=>{if(!p.includes('/evidence/'))m.sourceHashes[p]=hash(await readFile(p));});for(const p of Object.keys(bundle.metafile.inputs))m.sourceHashes[p]=hash(await readFile(p));m.outputHashes={};await walk(out,async p=>{if(!p.endsWith('/INPUTS.json'))m.outputHashes[relative(out,p)]=hash(await readFile(p));});m.bundleSha256=m.outputHashes['dist/bundle.js'];await writeFile(out+'/INPUTS.json',JSON.stringify(m,null,2));console.log('Equipment comparison native bundle:',m.bundleSha256);
