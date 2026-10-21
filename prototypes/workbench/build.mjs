import {cpSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const here=dirname(fileURLToPath(import.meta.url));
const source=resolve(here,'../recipe-ui-2026-10-15');
const output=resolve(here,'built/recipes');
const hashes={};
function read(base,path){const bytes=readFileSync(resolve(base,path));hashes[`${base===source?'recipe-fixture':'workbench'}/${path}`]=createHash('sha256').update(bytes).digest('hex');return bytes.toString();}
mkdirSync(output,{recursive:true});
// Retain the prior experiment's pinned source/component build. Never rebuild it in place.
for(const file of ['index.html','comparison.css','built/ui_tokens.css','built/crafting_detail.css','built/recipes.json','built/INPUTS.json','built/comparison.js']){
  const text=read(source,file);
  mkdirSync(dirname(resolve(output,file)),{recursive:true});
  writeFileSync(resolve(output,file),text);
}
const adapter=read(here,'adapters/recipes.js');
const bundle=readFileSync(resolve(output,'built/comparison.js'),'utf8').replace(/\/\/# sourceMappingURL=.*$/gm,'');
writeFileSync(resolve(output,'built/comparison.js'),`${bundle}\n\n// Workbench fixture adapter, not production integration.\n${adapter}`);
let html=readFileSync(resolve(output,'index.html'),'utf8');
html=html.replace('<body>','<body>\n<style>.lab,.lab-footer{display:none} .board{height:100dvh;flex:none} </style>');
writeFileSync(resolve(output,'index.html'),html);
cpSync(resolve(output,'built/ui_tokens.css'),resolve(here,'built/ui_tokens.css'));
for(const file of ['experiments.json','index.html','workbench.js','workbench.css','build.mjs','serve.mjs'])read(here,file);
await import('./build-launch.mjs');
read(here,'built/launch/INPUTS.json');
const manifest={schema:1,description:'Pinned recipe prototype plus isolated workbench adapter; no main-game build',hashes};
manifest.revision=createHash('sha256').update(JSON.stringify(hashes)).digest('hex').slice(0,16);
writeFileSync(resolve(here,'built/INPUTS.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(`Workbench built: ${manifest.revision}. Prior prototype unchanged.`);
