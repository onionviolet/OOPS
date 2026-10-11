import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import * as esbuild from 'esbuild';
import {heirCandidateMain} from './candidate_main.mjs';
import {execFileSync} from 'node:child_process';
const label=process.argv[2];if(!/^[a-z0-9-]+$/.test(label||''))throw Error('Supply a unique label');
const output=`/tmp/yairpg-life-experience-${label}-20261007`;
if(fs.existsSync(output))throw Error('Preview exists; preserve it');fs.mkdirSync(output);
for(const file of ['src','assets','styles','stories','locales','resources','style.css','index.html','LICENSE','docs/gm/feature-wave/ink','docs/gm/book-world-player-agency/contracts'])if(fs.existsSync(file))fs.cpSync(file,path.join(output,file),{recursive:true});
if(process.argv.includes('--heir-candidate')) {
 const target=path.join(output,'src/main.js'),before=fs.readFileSync(target,'utf8');
 fs.writeFileSync(path.join(output,'main-before-candidate.js'),before);fs.writeFileSync(target,heirCandidateMain(before));
 let diff;try{diff=execFileSync('diff',['-u','--label','a/src/main.js','--label','b/src/main.js',path.join(output,'main-before-candidate.js'),target],{encoding:'utf8'});}catch(e){if(e.status!==1)throw e;diff=e.stdout;}
 fs.writeFileSync('docs/gm/life-sim-experience-2026-10-07/HEIR_HOST_CANDIDATE.patch',diff);
}
fs.mkdirSync(path.join(output,'dist'));fs.symlinkSync(path.join(process.cwd(),'node_modules'),path.join(output,'node_modules'));
await esbuild.build({absWorkingDir:output,entryPoints:['src/main.js'],bundle:true,sourcemap:true,minify:true,outfile:'dist/bundle.js',platform:'browser',target:'es2022',format:'esm'});
const hash=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const fingerprint=hash(path.join(output,'dist/bundle.js'));
fs.writeFileSync(path.join(output,'index.html'),fs.readFileSync(path.join(output,'index.html'),'utf8').replace(/dist\/bundle\.js\?version=[^&"]+/,`dist/bundle.js?version=life-${fingerprint.slice(0,12)}`));
const map=JSON.parse(fs.readFileSync(path.join(output,'dist/bundle.js.map'),'utf8'));
for(let i=0;i<map.sources.length;i++){const file=path.resolve(output,'dist',map.sources[i]);if(fs.existsSync(file)&&fs.readFileSync(file,'utf8')!==map.sourcesContent[i])throw Error(`Stale source: ${file}`);}
fs.writeFileSync(`docs/gm/life-sim-experience-2026-10-07/${label}-BUILD.json`,JSON.stringify({output,fingerprint,sources:map.sources.map((file,i)=>({file,sha256:createHash('sha256').update(map.sourcesContent[i]).digest('hex')}))},null,2));console.log(output);
